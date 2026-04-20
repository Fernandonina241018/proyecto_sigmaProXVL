"use strict";
// ========================================
// TrabajoManager.js — StatAnalyzer Pro
// Módulo Hoja de Trabajo / Excel simulation
// ========================================
const TrabajoManager = (() => {
    // ── Virtual Scroll Config ────────────────────────────────
    const ROW_HEIGHT = 32;
    const BUFFER_ROWS = 10;
    // ── Track de valores originales para auditoría
    const _originalValues = new Map(); // key: "row,col", value: valor original
    // ── Guardar cambios pendientes al cerrar/pestaña cambio
    function _savePendingChanges() {
        const activeCell = document.activeElement;
        if (activeCell && activeCell.classList.contains('editable-cell')) {
            activeCell.blur();
        }
    }
    // Registrar antes de cerrar/pestaña cambio
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', _savePendingChanges);
    }
    // ── Scroll Listener (Virtual Scroll) ─────────────────────
    const _onTableScroll = debounce(() => {
        renderWorkTable();
    }, 16);
    function attachScrollListener() {
        const wrapper = document.getElementById('editable-table-wrapper');
        if (!wrapper)
            return;
        wrapper.removeEventListener('scroll', _onTableScroll);
        wrapper.addEventListener('scroll', _onTableScroll);
    }
    // ── Build Thead HTML ─────────────────────────────────────
    function buildTheadHtml(headers) {
        let html = '<thead><tr>';
        headers.forEach((header, colIndex) => {
            if (colIndex === 0) {
                html += `<th><span class="header-cell">#</span></th>`;
            }
            else {
                html += `
                    <th class="col-header">
                        <div class="header-wrapper">
                            <input type="text"
                                   class="editable-cell header-cell"
                                   value="${escapeHtml(String(header))}"
                                   data-col="${colIndex}"
                                   data-type="header">
                            <button class="col-menu-btn" data-col="${colIndex}" title="Opciones de columna">⋮</button>
                        </div>
                        <div class="col-dropdown" data-col="${colIndex}">
                            <button class="dropdown-item" data-action="insert-left" data-col="${colIndex}">← Insertar columna izquierda</button>
                            <button class="dropdown-item" data-action="insert-right" data-col="${colIndex}">Insertar columna derecha →</button>
                            <hr>
                            <button class="dropdown-item danger" data-action="delete-col" data-col="${colIndex}">Eliminar columna</button>
                        </div>
                    </th>`;
            }
        });
        html += '</tr></thead>';
        return html;
    }
    // ── Build Single Row HTML ────────────────────────────────
    function buildRowHtml(row, rowIndex) {
        let html = '<tr>';
        row.forEach((cell, colIndex) => {
            if (colIndex === 0) {
                html += `
                    <td class="row-header">
                        <div class="index-wrapper">
                            <span class="index-cell">${escapeHtml(String(cell))}</span>
                            <button class="row-menu-btn" data-row="${rowIndex}" title="Opciones de fila">⋮</button>
                        </div>
                        <div class="row-dropdown" data-row="${rowIndex}">
                            <button class="dropdown-item" data-action="insert-above" data-row="${rowIndex}">↑ Insertar fila arriba</button>
                            <button class="dropdown-item" data-action="insert-below" data-row="${rowIndex}">Insertar fila abajo ↓</button>
                            <hr>
                            <button class="dropdown-item danger" data-action="delete-row" data-row="${rowIndex}">Eliminar fila</button>
                        </div>
                    </td>`;
            }
            else {
                html += `
                    <td>
                        <input type="text"
                               class="editable-cell data-cell"
                               value="${escapeHtml(String(cell || ''))}"
                               data-row="${rowIndex}"
                               data-col="${colIndex}"
                               data-type="data">
                    </td>`;
            }
        });
        html += '</tr>';
        return html;
    }
    // ── Table Rendering ──────────────────────────────────────
    function renderWorkTable() {
        const sheet = StateManager.getActiveSheet();
        if (!sheet) {
            const wrapper = document.getElementById('editable-table-wrapper');
            if (wrapper)
                wrapper.innerHTML = '<p class="empty-message">No hay hoja activa</p>';
            return;
        }
        const wrapper = document.getElementById('editable-table-wrapper');
        if (!wrapper)
            return;
        const totalRows = sheet.data.length;
        const scrollTop = wrapper.scrollTop || 0;
        const viewHeight = wrapper.clientHeight || 600;
        const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS);
        const endRow = Math.min(totalRows, startRow + Math.ceil(viewHeight / ROW_HEIGHT) + BUFFER_ROWS * 2);
        let html = '<table class="work-table">';
        html += buildTheadHtml(sheet.headers);
        html += '<tbody>';
        if (startRow > 0) {
            html += `<tr class="vs-spacer-top" style="height:${startRow * ROW_HEIGHT}px"><td colspan="${sheet.headers.length}"></td></tr>`;
        }
        for (let r = startRow; r < endRow; r++) {
            html += buildRowHtml(sheet.data[r], r);
        }
        if (endRow < totalRows) {
            html += `<tr class="vs-spacer-bottom" style="height:${(totalRows - endRow) * ROW_HEIGHT}px"><td colspan="${sheet.headers.length}"></td></tr>`;
        }
        html += '</tbody></table>';
        wrapper.innerHTML = html;
        attachTableInputListeners();
        attachHeaderMenuListeners();
        attachScrollListener();
    }
    function attachTableInputListeners() {
        const wrapper = document.getElementById('editable-table-wrapper');
        if (!wrapper)
            return;
        // Preserve scroll position before any DOM manipulation
        const savedScrollTop = wrapper.scrollTop;
        // Event delegation — single listener per event type, no clone needed
        wrapper.removeEventListener('input', _onTableInput);
        wrapper.removeEventListener('keydown', _onTableKeydown);
        wrapper.removeEventListener('paste', _onTablePaste);
        wrapper.addEventListener('input', _onTableInput);
        wrapper.addEventListener('keydown', _onTableKeydown);
        wrapper.addEventListener('paste', _onTablePaste);
        wrapper.addEventListener('blur', _onCellBlur, true);
        wrapper.addEventListener('focus', _onCellFocus, true);
        // Restore scroll position
        wrapper.scrollTop = savedScrollTop;
    }
    function _onTableInput(e) {
        const target = e.target;
        if (!target.classList.contains('editable-cell'))
            return;
        const type = target.dataset.type;
        const value = target.value;
        if (type === 'header') {
            const col = parseInt(target.dataset.col);
            if (!isNaN(col) && col > 0) {
                StateManager.updateHeader(col, value);
            }
        }
        else if (type === 'data') {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);
            if (!isNaN(row) && !isNaN(col) && col > 0) {
                // Skip audit here - se registrará en _onCellBlur
                StateManager.updateCell(row, col, value, true);
            }
        }
    }
    function _onCellFocus(e) {
        const target = e.target;
        if (!target.classList.contains('editable-cell'))
            return;
        const type = target.dataset.type;
        if (type === 'data') {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);
            if (!isNaN(row) && !isNaN(col)) {
                const key = `${row},${col}`;
                _originalValues.set(key, target.value);
            }
        }
    }
    function _onCellBlur(e) {
        const target = e.target;
        if (!target.classList.contains('editable-cell'))
            return;
        const type = target.dataset.type;
        const value = target.value;
        if (type === 'data') {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);
            const key = `${row},${col}`;
            if (!isNaN(row) && !isNaN(col)) {
                const oldValue = _originalValues.get(key) ?? '';
                const newValueStr = String(value ?? '');
                if (oldValue !== newValueStr && typeof Logger !== 'undefined') {
                    const sheet = StateManager.getActiveSheet();
                    Logger.logDataChange('UPDATE', {
                        row: row,
                        col: col,
                        colName: sheet?.headers[col] || col,
                        oldValue: oldValue,
                        newValue: newValueStr
                    });
                }
                _originalValues.delete(key);
            }
        }
    }
    function _onTableKeydown(e) {
        // Presionar Enter → forzar blur para registrar en auditoría
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
            return;
        }
        // Presionar Escape → cancelar edición y restaurar valor original
        if (e.key === 'Escape') {
            const target = e.target;
            const row = target.dataset.row;
            const col = target.dataset.col;
            const key = `${row},${col}`;
            if (_originalValues.has(key)) {
                target.value = _originalValues.get(key);
                _originalValues.delete(key);
            }
            e.preventDefault();
            target.blur();
            return;
        }
        // Tab → mover a siguiente celda (ya causa blur)
        if (e.key !== 'Tab')
            return;
        e.preventDefault();
        const wrapper = document.getElementById('editable-table-wrapper');
        if (!wrapper)
            return;
        const inputs = Array.from(wrapper.querySelectorAll('.editable-cell'));
        const current = inputs.indexOf(e.target);
        const next = e.shiftKey ? current - 1 : current + 1;
        if (inputs[next]) {
            inputs[next].focus();
            inputs[next].select();
        }
    }
    function _onTablePaste(e) {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (!pastedText)
            return;
        const hasTab = pastedText.includes('\t');
        const hasMultipleLines = pastedText.split('\n').filter(r => r.trim()).length > 1;
        const isTabularData = hasTab || hasMultipleLines;
        if (isTabularData) {
            e.preventDefault();
            e.stopPropagation();
            const activeCell = document.activeElement;
            let startRow = 0;
            let startCol = 1;
            if (activeCell && activeCell.classList.contains('editable-cell')) {
                const cellRow = parseInt(activeCell.dataset.row);
                const cellCol = parseInt(activeCell.dataset.col);
                if (!isNaN(cellRow))
                    startRow = cellRow;
                if (!isNaN(cellCol))
                    startCol = cellCol;
            }
            processPastedData(pastedText, startRow, startCol);
        }
    }
    function attachHeaderMenuListeners() {
        const wrapper = document.getElementById('editable-table-wrapper');
        if (!wrapper)
            return;
        wrapper.removeEventListener('click', _onTableClick);
        wrapper.addEventListener('click', _onTableClick);
    }
    function _onTableClick(e) {
        const wrapper = document.getElementById('editable-table-wrapper');
        if (!wrapper)
            return;
        const colMenuBtn = e.target.closest('.col-menu-btn');
        if (colMenuBtn) {
            e.preventDefault();
            e.stopPropagation();
            const colIndex = colMenuBtn.dataset.col;
            const dropdown = wrapper.querySelector(`.col-dropdown[data-col="${colIndex}"]`);
            wrapper.querySelectorAll('.col-dropdown.active, .row-dropdown.active').forEach(d => d.classList.remove('active'));
            if (dropdown)
                dropdown.classList.toggle('active');
            return;
        }
        const rowMenuBtn = e.target.closest('.row-menu-btn');
        if (rowMenuBtn) {
            e.preventDefault();
            e.stopPropagation();
            const rowIndex = rowMenuBtn.dataset.row;
            const dropdown = wrapper.querySelector(`.row-dropdown[data-row="${rowIndex}"]`);
            wrapper.querySelectorAll('.col-dropdown.active, .row-dropdown.active').forEach(d => d.classList.remove('active'));
            if (dropdown)
                dropdown.classList.toggle('active');
            return;
        }
        const colAction = e.target.closest('.col-dropdown .dropdown-item');
        if (colAction) {
            e.preventDefault();
            e.stopPropagation();
            const action = colAction.dataset.action;
            const colIndex = parseInt(colAction.dataset.col);
            try {
                if (action === 'insert-left') {
                    StateManager.insertColumn(colIndex);
                    renderWorkTable();
                }
                else if (action === 'insert-right') {
                    StateManager.insertColumn(colIndex + 1);
                    renderWorkTable();
                }
                else if (action === 'delete-col') {
                    StateManager.deleteColumn(colIndex);
                    renderWorkTable();
                }
            }
            catch (err) {
                console.error(err);
            }
            return;
        }
        const rowAction = e.target.closest('.row-dropdown .dropdown-item');
        if (rowAction) {
            e.preventDefault();
            e.stopPropagation();
            const action = rowAction.dataset.action;
            const rowIndex = parseInt(rowAction.dataset.row);
            try {
                if (action === 'insert-above') {
                    StateManager.insertRow(rowIndex);
                    renderWorkTable();
                }
                else if (action === 'insert-below') {
                    StateManager.insertRow(rowIndex + 1);
                    renderWorkTable();
                }
                else if (action === 'delete-row') {
                    StateManager.deleteRow(rowIndex);
                    renderWorkTable();
                }
            }
            catch (err) {
                console.error(err);
            }
            return;
        }
        if (!e.target.closest('.col-dropdown') && !e.target.closest('.row-dropdown')) {
            wrapper.querySelectorAll('.col-dropdown.active, .row-dropdown.active').forEach(d => d.classList.remove('active'));
        }
    }
    // ── Summary Sidebar ───────────────────────────────────────
    function updateWorkSummary() {
        const sheet = StateManager.getActiveSheet();
        if (!sheet) {
            ['count-rows', 'count-cols', 'count-filled'].forEach(id => {
                const el = document.getElementById(id);
                if (el)
                    el.textContent = '0';
            });
            return;
        }
        const totalRows = sheet.data.length;
        const totalCols = sheet.headers.length - 1;
        let filledCount = 0;
        sheet.data.forEach(row => {
            row.slice(1).forEach(cell => {
                if (cell && cell.toString().trim() !== '')
                    filledCount++;
            });
        });
        document.getElementById('count-rows').textContent = totalRows;
        document.getElementById('count-cols').textContent = totalCols;
        document.getElementById('count-filled').textContent = filledCount;
    }
    function updateSheetsInfo() {
        const activeSheet = StateManager.getActiveSheet();
        const totalSheets = StateManager.getAllSheets().length;
        const nameEl = document.getElementById('activeSheetName');
        const totalEl = document.getElementById('totalSheets');
        if (nameEl)
            nameEl.textContent = activeSheet ? activeSheet.name : '-';
        if (totalEl)
            totalEl.textContent = totalSheets;
    }
    // ── Toolbar CRUD ──────────────────────────────────────────
    function setupWorkButtons() {
        const btnGenerate = document.querySelector('.btn-generate-table');
        const btnClear = document.querySelector('.btn-clear-table');
        const btnSave = document.querySelector('.btn-save-work');
        if (btnGenerate)
            btnGenerate.onclick = generateWorkTable;
        if (btnClear)
            btnClear.onclick = clearWorkTable;
        if (btnSave)
            btnSave.onclick = saveWorkData;
    }
    function generateWorkTable() {
        const rows = parseInt(document.getElementById('initial-rows')?.value) || 10;
        const cols = parseInt(document.getElementById('initial-cols')?.value) || 5;
        StateManager.createSheet(null, rows, cols + 1);
        renderWorkTable();
        updateWorkSummary();
        renderSheetTabs();
        updateSheetsInfo();
    }
    function clearWorkTable() {
        if (!confirm('¿Limpiar todos los datos de esta hoja?'))
            return;
        StateManager.clearSheetData();
        renderWorkTable();
        updateWorkSummary();
    }
    // ========================================
    // GUARDAR DATOS DE HOJA COMO importedData
    // ========================================
    function saveWorkData() {
        if (!PermisosManager.puede('usar_trabajo')) {
            PermisosManager.mostrarDenegado('usar_trabajo');
            return;
        }
        const sheet = StateManager.getActiveSheet();
        if (!sheet) {
            alert('⚠️ No hay hoja activa. Crea o selecciona una hoja primero.');
            return;
        }
        const nonEmptyRows = sheet.data.filter(row => row.slice(1).some(cell => cell && String(cell).trim() !== ''));
        if (nonEmptyRows.length === 0) {
            alert('⚠️ No hay datos válidos para guardar (todas las filas están vacías)');
            return;
        }
        // Identificar columnas que tienen al menos una celda con datos
        const allHeaders = sheet.headers.slice(1);
        const colHasData = allHeaders.map((_, colIdx) => nonEmptyRows.some(row => {
            const cell = row[colIdx + 1];
            return cell && String(cell).trim() !== '';
        }));
        // Filtrar headers y datos solo por columnas con datos
        const headers = allHeaders.filter((_, colIdx) => colHasData[colIdx]);
        const formattedData = nonEmptyRows.map(row => {
            const obj = {};
            allHeaders.forEach((header, colIdx) => {
                if (colHasData[colIdx]) {
                    obj[header] = row[colIdx + 1] || '';
                }
            });
            return obj;
        });
        if (headers.length === 0) {
            alert('⚠️ No hay columnas con datos válidos para guardar');
            return;
        }
        const fileName = `${sheet.name || 'hoja_trabajo'}_${new Date().toISOString().slice(0, 10)}.csv`;
        try {
            StateManager.setImportedData({
                headers: headers,
                data: formattedData,
                rowCount: formattedData.length
            }, fileName);
            switchView('datos');
            // alert(`✅ Datos guardados correctamente.\n\n${formattedData.length} filas · ${headers.length} columnas\nRevísalos en la vista Datos y usa "Enviar a Análisis" cuando estés listo.`);
        }
        catch (err) {
            console.error('Error al guardar:', err);
            alert('❌ Error al guardar: ' + err.message);
        }
    }
    // ========================================
    // PEGADO AUTOMÁTICO DESDE EXCEL
    // ========================================
    function processPastedData(text, startRow = 0, startCol = 1) {
        const rows = text.split('\n').filter(r => r.trim());
        if (rows.length === 0)
            return;
        const maxCols = Math.max(...rows.map(r => r.split('\t').length));
        const sheet = StateManager.getActiveSheet();
        if (!sheet)
            return;
        const neededRows = startRow + rows.length;
        const neededCols = startCol + maxCols;
        try {
            while (sheet.data.length < neededRows)
                StateManager.addRow();
            while ((sheet.headers.length - 1) < neededCols)
                StateManager.addColumn();
        }
        catch (err) {
            alert('⚠️ No se pudo expandir la hoja: ' + err.message);
            return;
        }
        rows.forEach((rowText, rowIdx) => {
            const targetRow = startRow + rowIdx;
            if (targetRow >= sheet.data.length)
                return;
            const cells = rowText.split('\t');
            cells.forEach((cell, colIdx) => {
                const targetCol = startCol + colIdx;
                if (targetCol < sheet.headers.length) {
                    StateManager.updateCell(targetRow, targetCol, cell.trim());
                }
            });
        });
        renderWorkTable();
        updateWorkSummary();
        _showToast(`✅ Pegado: ${rows.length} fila(s) × ${maxCols} columna(s)`);
    }
    // ── Sheet Tabs ────────────────────────────────────────────
    function renderSheetTabs() {
        const container = document.getElementById('sheetsTabs');
        if (!container)
            return;
        const sheets = StateManager.getAllSheets();
        const activeSheet = StateManager.getActiveSheet();
        container.innerHTML = '';
        sheets.forEach(sheet => {
            const tab = document.createElement('div');
            tab.className = `sheet-tab${sheet.id === activeSheet?.id ? ' active' : ''}`;
            tab.innerHTML = `
                <span class="sheet-tab-name">${escapeHtml(sheet.name)}</span>
                <button class="sheet-tab-close" aria-label="Eliminar hoja ${escapeHtml(sheet.name)}">×</button>
            `;
            tab.addEventListener('click', () => switchToSheet(sheet.id));
            tab.querySelector('.sheet-tab-close').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSheet(sheet.id);
            });
            container.appendChild(tab);
        });
    }
    function switchToSheet(sheetId) {
        StateManager.setActiveSheet(sheetId);
        renderWorkTable();
        updateWorkSummary();
        renderSheetTabs();
        updateSheetsInfo();
    }
    function deleteSheet(sheetId) {
        if (!confirm('¿Eliminar esta hoja?'))
            return;
        try {
            StateManager.deleteSheet(sheetId);
            renderSheetTabs();
            renderWorkTable();
            updateWorkSummary();
            updateSheetsInfo();
        }
        catch (err) {
            alert('⚠️ ' + err.message);
        }
    }
    // ========================================
    // GENERADOR DE DATOS NORMALES
    // ========================================
    function abrirModalDatosNormales() {
        document.getElementById('modal-normal-data').classList.add('active');
    }
    function cerrarModalDatosNormales() {
        document.getElementById('modal-normal-data').classList.remove('active');
    }
    function generarDatosNormales() {
        const min = parseFloat(document.getElementById('nd-min').value);
        const max = parseFloat(document.getElementById('nd-max').value);
        const std = parseFloat(document.getElementById('nd-std').value);
        const decimals = parseInt(document.getElementById('nd-decimals').value);
        const rows = parseInt(document.getElementById('nd-rows').value);
        const cols = parseInt(document.getElementById('nd-cols').value);
        if (isNaN(min) || isNaN(max) || isNaN(std) || isNaN(decimals) || isNaN(rows) || isNaN(cols)) {
            alert('⚠️ Todos los campos deben tener valores numéricos');
            return;
        }
        if (min >= max) {
            alert('⚠️ El valor máximo debe ser mayor que el mínimo');
            return;
        }
        if (std <= 0) {
            alert('⚠️ La desviación estándar debe ser mayor que 0');
            return;
        }
        if (rows < 1 || rows > 1000) {
            alert('⚠️ El número de filas debe estar entre 1 y 1000');
            return;
        }
        if (cols < 1 || cols > 20) {
            alert('⚠️ El número de columnas debe estar entre 1 y 20');
            return;
        }
        const media = (min + max) / 2;
        const headers = ['#'];
        for (let i = 0; i < cols; i++) {
            let colName = '';
            let idx = i;
            do {
                colName = String.fromCharCode(65 + (idx % 26)) + colName;
                idx = Math.floor(idx / 26) - 1;
            } while (idx >= 0);
            headers.push(colName);
        }
        const data = [];
        for (let r = 0; r < rows; r++) {
            const rowData = [r + 1];
            for (let c = 0; c < cols; c++) {
                let valor;
                do {
                    valor = boxMullerRandom(media, std);
                } while (valor < min || valor > max);
                rowData.push(parseFloat(valor.toFixed(decimals)));
            }
            data.push(rowData);
        }
        StateManager.createSheet(null, rows, cols + 1, headers, data);
        renderWorkTable();
        updateWorkSummary();
        renderSheetTabs();
        updateSheetsInfo();
        cerrarModalDatosNormales();
        _showToast(`✅ ${rows * cols} datos normales generados`);
    }
    function boxMullerRandom(media, std) {
        let u1 = 0;
        let u2 = 0;
        while (u1 === 0)
            u1 = Math.random();
        while (u2 === 0)
            u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return media + z0 * std;
    }
    // ========================================
    // AMPLIAR DATOS
    // ========================================
    function abrirModalAmpliarDatos() {
        const sheet = StateManager.getActiveSheet();
        const select = document.getElementById('ad-columna');
        select.innerHTML = '<option value="">-- Seleccionar columna --</option>';
        if (sheet) {
            sheet.headers.forEach((h, i) => {
                if (i > 0) {
                    const hasNumeric = sheet.data.some(row => row[i] && !isNaN(parseFloat(row[i])));
                    if (hasNumeric) {
                        const opt = document.createElement('option');
                        opt.value = i;
                        opt.textContent = h;
                        select.appendChild(opt);
                    }
                }
            });
        }
        document.getElementById('modal-ampliar-datos').classList.add('active');
        actualizarParametrosMetodo();
    }
    function actualizarInfoColumna() {
        const colIndex = parseInt(document.getElementById('ad-columna').value);
        if (isNaN(colIndex))
            return;
        const sheet = StateManager.getActiveSheet();
        if (!sheet)
            return;
        const valores = sheet.data.map(row => parseFloat(row[colIndex])).filter(v => !isNaN(v));
        const info = document.getElementById('ad-info-texto');
        if (valores.length > 0) {
            const media = (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
            const min = Math.min(...valores).toFixed(2);
            const max = Math.max(...valores).toFixed(2);
            info.textContent = `📊 ${valores.length} valores | Media: ${media} | Min: ${min} | Max: ${max}`;
        }
    }
    function cerrarModalAmpliarDatos() {
        document.getElementById('modal-ampliar-datos').classList.remove('active');
    }
    function actualizarParametrosMetodo() {
        const metodo = document.getElementById('ad-metodo').value;
        const factor = document.getElementById('ad-factor').value;
        document.getElementById('ad-params-interpolacion').style.display = metodo === 'interpolacion' ? 'block' : 'none';
        document.getElementById('ad-params-bootstrap').style.display = metodo === 'bootstrap' ? 'block' : 'none';
        document.getElementById('ad-params-augmentation').style.display = metodo === 'augmentation' ? 'block' : 'none';
        document.getElementById('ad-custom-factor-row').style.display = factor === 'custom' ? 'flex' : 'none';
        const infoTextos = {
            'interpolacion': '💡 La interpolación genera valores suaves entre puntos conocidos',
            'bootstrap': '🔄 Bootstrap re-muestrea los datos con reemplazo manteniendo distribución',
            'augmentation': '🎲 Data Augmentation añade ruido gaussiano controlado a los datos'
        };
        document.getElementById('ad-info-texto').textContent = infoTextos[metodo] || '';
    }
    function ampliarDatos() {
        const metodo = document.getElementById('ad-metodo').value;
        const tipo = document.getElementById('ad-tipo').value;
        let factor = parseInt(document.getElementById('ad-factor').value);
        const decimals = parseInt(document.getElementById('ad-decimals').value);
        const guardado = document.getElementById('ad-guardado').value;
        if (document.getElementById('ad-factor').value === 'custom') {
            factor = parseInt(document.getElementById('ad-custom-factor').value);
            if (isNaN(factor) || factor < 2 || factor > 100) {
                alert('⚠️ El factor personal debe ser entre 2 y 100');
                return;
            }
        }
        const sheet = StateManager.getActiveSheet();
        if (!sheet) {
            alert('⚠️ No hay hoja activa. Primero importa o genera datos.');
            return;
        }
        const colIndexStr = document.getElementById('ad-columna').value;
        if (!colIndexStr) {
            alert('⚠️ Selecciona una columna para ampliar');
            return;
        }
        const numericCol = parseInt(colIndexStr);
        const colName = sheet.headers[numericCol] || 'Sin_Nombre';
        const valores = sheet.data
            .map(row => parseFloat(row[numericCol]))
            .filter(v => !isNaN(v));
        if (valores.length < 2) {
            alert('⚠️ Se necesitan al menos 2 valores numéricos para ampliar');
            return;
        }
        let nuevosValores;
        switch (metodo) {
            case 'interpolacion':
                const interpTipo = document.getElementById('ad-interp-tipo').value;
                nuevosValores = ampliarPorInterpolacion(valores, factor, decimals, interpTipo);
                break;
            case 'bootstrap':
                const reps = parseInt(document.getElementById('ad-bootstrap-reps').value);
                nuevosValores = ampliarPorBootstrap(valores, factor, reps, decimals);
                break;
            case 'augmentation':
                const ruido = parseFloat(document.getElementById('ad-ruido-nivel').value);
                nuevosValores = ampliarPorAugmentation(valores, factor, ruido, decimals);
                break;
            default:
                alert('⚠️ Método no válido');
                return;
        }
        guardarAmpliacion(nuevosValores, guardado, sheet, numericCol);
        cerrarModalAmpliarDatos();
        _showToast(`✅ ${nuevosValores.length} datos generados (${metodo})`);
    }
    function ampliarPorInterpolacion(valores, factor, decimals, tipo) {
        const resultado = [];
        if (tipo === 'lineal') {
            for (let i = 0; i < valores.length - 1; i++) {
                const a = valores[i];
                const b = valores[i + 1];
                for (let j = 0; j < factor; j++) {
                    const t = j / factor;
                    resultado.push(parseFloat((a + (b - a) * t).toFixed(decimals)));
                }
            }
            resultado.push(parseFloat(valores[valores.length - 1].toFixed(decimals)));
        }
        else if (tipo === 'spline') {
            const n = valores.length;
            const h = [];
            const alpha = [];
            const l = [1];
            const mu = [0];
            const z = [0];
            const c = [0];
            const b = [];
            const d = [];
            for (let i = 0; i < n - 1; i++) {
                h.push(1);
                alpha.push(0);
            }
            for (let i = 1; i < n - 1; i++) {
                l.push(1);
                mu.push(0);
                z.push(0);
                c.push(0);
            }
            l.push(1);
            z.push(0);
            c.push(0);
            for (let i = 1; i < n - 1; i++) {
                alpha[i] = (3 / h[i]) * (valores[i + 1] - valores[i]) - (3 / h[i - 1]) * (valores[i] - valores[i - 1]);
            }
            for (let i = 1; i < n - 1; i++) {
                l[i] = 2 * (i + 1 - (i - 1)) - h[i - 1] * mu[i - 1];
                mu[i] = h[i] / l[i];
                z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
            }
            l[n - 1] = 1;
            z[n - 1] = 0;
            c[n - 1] = 0;
            for (let j = n - 2; j >= 0; j--) {
                c[j] = z[j] - mu[j] * c[j + 1];
                b[j] = (valores[j + 1] - valores[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3;
                d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
            }
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < factor; j++) {
                    const t = j / factor;
                    const valor = valores[i] + b[i] * t + c[i] * t * t + d[i] * t * t * t;
                    resultado.push(parseFloat(valor.toFixed(decimals)));
                }
            }
            resultado.push(parseFloat(valores[n - 1].toFixed(decimals)));
        }
        else {
            for (let i = 0; i < valores.length - 1; i++) {
                const a = valores[i];
                const b = valores[i + 1];
                for (let j = 0; j < factor; j++) {
                    const t = j / factor;
                    const valor = a + (b - a) * (t * t * (3 - 2 * t));
                    resultado.push(parseFloat(valor.toFixed(decimals)));
                }
            }
            resultado.push(parseFloat(valores[valores.length - 1].toFixed(decimals)));
        }
        return resultado;
    }
    function ampliarPorBootstrap(valores, factor, repeticiones, decimals) {
        const resultado = [];
        const n = valores.length;
        for (let i = 0; i < factor * n; i++) {
            const idx = Math.floor(Math.random() * n);
            resultado.push(parseFloat(valores[idx].toFixed(decimals)));
        }
        return resultado;
    }
    function ampliarPorAugmentation(valores, factor, nivelRuido, decimals) {
        const resultado = [];
        const media = valores.reduce((a, b) => a + b, 0) / valores.length;
        const std = Math.sqrt(valores.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) / valores.length);
        for (let r = 0; r < factor; r++) {
            for (let i = 0; i < valores.length; i++) {
                const ruido = boxMullerRandom(0, std * nivelRuido);
                resultado.push(parseFloat((valores[i] + ruido).toFixed(decimals)));
            }
        }
        return resultado;
    }
    function guardarAmpliacion(valores, guardado, sheet, colIndex) {
        const colName = sheet.headers[colIndex];
        const nombreAmpliado = 'Valor_Ampliado(' + colName + ')';
        if (guardado === 'nueva-hoja') {
            const headers = ['#', nombreAmpliado];
            const data = valores.map((v, i) => [i + 1, v]);
            StateManager.createSheet(null, valores.length, 2, headers, data);
        }
        else if (guardado === 'nueva-columna') {
            const currentSheet = StateManager.getActiveSheet();
            currentSheet.headers.push(nombreAmpliado);
            const maxRows = Math.max(currentSheet.data.length, valores.length);
            for (let i = 0; i < maxRows; i++) {
                if (!currentSheet.data[i]) {
                    currentSheet.data[i] = [i + 1, ...Array(currentSheet.headers.length - 2).fill('')];
                }
                currentSheet.data[i].push(i < valores.length ? valores[i] : '');
            }
        }
        else {
            const headers = sheet.headers.slice();
            headers[colIndex] = nombreAmpliado;
            const data = [];
            for (let i = 0; i < valores.length; i++) {
                const rowData = [i + 1];
                for (let j = 1; j < headers.length; j++) {
                    if (j === colIndex) {
                        rowData.push(valores[i]);
                    }
                    else {
                        rowData.push('');
                    }
                }
                data.push(rowData);
            }
            StateManager.createSheet(null, valores.length, headers.length, headers, data);
        }
        renderWorkTable();
        updateWorkSummary();
        renderSheetTabs();
        updateSheetsInfo();
        if (guardado === 'nueva-columna') {
            marcarCeldasOriginales(colIndex);
        }
    }
    function marcarCeldasOriginales(colIndex) {
        const wrapper = document.getElementById('editable-table-wrapper');
        if (!wrapper)
            return;
        const rows = wrapper.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[colIndex]) {
                const input = cells[colIndex].querySelector('input');
                if (input) {
                    input.classList.add('cell-original-data');
                }
            }
        });
    }
    // ── Init & Events ─────────────────────────────────────────
    function init() {
        setupWorkButtons();
        renderSheetTabs();
        renderWorkTable();
        updateWorkSummary();
        updateSheetsInfo();
        document.getElementById('ad-factor')?.addEventListener('change', function () {
            document.getElementById('ad-custom-factor-row').style.display = this.value === 'custom' ? 'flex' : 'none';
        });
    }
    function render() {
        renderWorkTable();
        updateWorkSummary();
    }
    function onSheetChange() {
        renderSheetTabs();
        renderWorkTable();
        updateWorkSummary();
        updateSheetsInfo();
    }
    // ── Public API ────────────────────────────────────────────
    return {
        init,
        render,
        renderWorkTable,
        updateWorkSummary,
        renderSheetTabs,
        switchToSheet,
        deleteSheet,
        generateWorkTable,
        // Modals
        abrirModalDatosNormales,
        cerrarModalDatosNormales,
        generarDatosNormales,
        abrirModalAmpliarDatos,
        cerrarModalAmpliarDatos,
        actualizarInfoColumna,
        actualizarParametrosMetodo,
        ampliarDatos,
        // StateManager event handler
        onSheetChange
    };
})();
window.TM = TrabajoManager;
console.log('✅ TrabajoManager cargado');
