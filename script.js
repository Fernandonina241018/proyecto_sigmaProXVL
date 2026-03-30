// ========================================
// script.js - StatAnalyzer Pro
// Versión corregida
// ========================================

// ========================================
// VARIABLE GLOBAL DE ÚLTIMOS RESULTADOS
// FIX: antes se asignaba sin declarar → variable global implícita en modo no-strict,
//      error silencioso en strict mode. Se declara explícitamente aquí.
// ========================================
let ultimosResultados = null;

// ========================================
// UTILIDADES GENERALES
// ========================================

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function _showToast(msg, isError = false) {
    document.getElementById('script-toast')?.remove();
    const t = document.createElement('div');
    t.id = 'script-toast';
    t.className = `datos-toast ${isError ? 'datos-toast-error' : 'datos-toast-ok'}`;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('datos-toast-visible'));
    setTimeout(() => { t.classList.remove('datos-toast-visible'); setTimeout(() => t.remove(), 300); }, 3000);
}

// ========================================
// NAVEGACIÓN DINÁMICA ENTRE VISTAS
// ========================================

function switchView(viewName) {
    document.querySelectorAll('.workspace-view').forEach(view => {
        view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.add('active');
    }

    // FIX: sincronizar el nav-item activo de forma robusta,
    // sin depender de posición ni de querySelector('.nav-item') ciego.
    const viewMap = {
        'analisis':      'análisis',
        'datos':         'datos',
        'visualizacion': 'visualización',
        'reportes':      'reportes',
        'trabajo':       'trabajo',
        'auditoria':     'auditoría',
        'usuarios':      'usuarios'
    };

    const expectedLabel = viewMap[viewName];
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
        if (nav.textContent.trim().toLowerCase() === expectedLabel) {
            nav.classList.add('active');
        }
    });

    // Inicializar vistas al navegar
    if (viewName === 'analisis') {
        const imported = StateManager.getImportedData();
        // Solo mostrar dashboard si NO hay resultados de análisis activos
        if (imported && !ultimosResultados) displayImportedData(imported);
    }
    if (viewName === 'datos')         DatosManager.buildView();
    if (viewName === 'visualizacion') inicializarVisualizacion();
    if (viewName === 'reportes')      inicializarReportes();
    if (viewName === 'auditoria') {
        if (PermisosManager.protegerVista('auditoria-container', 'ver_auditoria')) inicializarAuditoria();
    }
    if (viewName === 'usuarios') {
        if (PermisosManager.protegerVista('usuarios-container', 'gestionar_usuarios')) inicializarUsuarios();
    }

    console.log(`Vista cambiada a: ${viewName}`);
}

// ========================================
// NAVEGACIÓN SUPERIOR
// ========================================

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
        const viewMap = {
            'análisis':      'analisis',
            'datos':         'datos',
            'visualización': 'visualizacion',
            'reportes':      'reportes',
            'trabajo':       'trabajo',
            'auditoría':     'auditoria',
            'usuarios':      'usuarios'
        };

        const label      = this.textContent.trim().toLowerCase();
        const targetView = viewMap[label];

        if (targetView) {
            switchView(targetView);

            if (targetView === 'trabajo') {
                renderWorkTable();
                updateWorkSummary();
            }

            if (targetView === 'visualizacion') {
                inicializarVisualizacion();
            }

            if (targetView === 'reportes') {
                inicializarReportes();
            }

            if (targetView === 'datos') {
                DatosManager.buildView();
            }

            if (targetView === 'auditoria') {
                inicializarAuditoria();
            }

            if (targetView === 'usuarios') {
                inicializarUsuarios();
            }
        }
    });
});

// ========================================
// ACORDEÓN DEL MENÚ LATERAL
// ========================================

document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function () {
        const content  = this.nextElementSibling;
        const isActive = this.classList.contains('active');

        document.querySelectorAll('.accordion-header').forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('active');
        });

        if (!isActive) {
            this.classList.add('active');
            content.classList.add('active');
        }
    });
});

// ========================================
// GESTIÓN DE ESTADÍSTICOS ACTIVOS
// ========================================

function updateActiveStatsUI() {
    const stats     = StateManager.getActiveStats();
    const container = document.getElementById('activeStatsContainer');
    const countEl   = document.getElementById('statsCount');
    const emptyEl   = document.getElementById('emptyState');

    if (!container) return;

    container.innerHTML = '';

    if (stats.length === 0) {
        emptyEl.style.display = 'block';
        countEl.textContent   = '0 estadísticos activos';
        countEl.classList.remove('has-stats');
    } else {
        emptyEl.style.display = 'none';
        countEl.textContent   = `${stats.length} estadístico${stats.length !== 1 ? 's' : ''} activo${stats.length !== 1 ? 's' : ''}`;
        countEl.classList.add('has-stats');

        stats.forEach(name => {
            const chip = document.createElement('div');
            chip.className = 'stat-chip';
            chip.setAttribute('data-stat-name', name);
            chip.innerHTML = `
                <span>${escapeHtml(name)}</span>
                <button class="chip-remove" aria-label="Eliminar ${escapeHtml(name)}">×</button>
            `;
            // FIX: addEventListener en lugar de onclick inline con string interpolado
            chip.querySelector('.chip-remove').addEventListener('click', () => {
                removeActiveStat(name);
            });
            container.appendChild(chip);
        });
    }

    // Actualizar badges de iconos en sidebar
    updateSidebarIconBadges();
}

function removeActiveStat(name) {
    StateManager.removeActiveStat(name);

    // Desmarcar visualmente la opción del menú correspondiente
    document.querySelectorAll('.menu-option').forEach(opt => {
        if (opt.textContent.trim() === name) {
            opt.classList.remove('selected');
        }
    });
}

function clearAllStats() {
    if (StateManager.getActiveStats().length === 0) return;
    StateManager.clearActiveStats();

    // Desmarcar todos los ítems del menú lateral
    document.querySelectorAll('.menu-option').forEach(opt => {
        opt.classList.remove('selected');
    });
}

// Selección de estadísticos desde menú lateral
document.querySelectorAll('.menu-option').forEach(option => {
    option.addEventListener('click', function () {
        const statName = this.textContent.trim();

        // Pruebas de hipótesis que requieren configuración de grupos
        const hipotesisTests = ['ANOVA One-Way', 'ANOVA Two-Way', 'Chi-Cuadrado', 'T-Test (dos muestras)'];
        
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
            StateManager.removeActiveStat(statName);
        } else {
            // Para pruebas de hipótesis, abrir modal de configuración
            if (hipotesisTests.includes(statName)) {
                mostrarModalConfiguracionHypothesis(statName);
            } else {
                this.classList.add('selected');
                StateManager.addActiveStat(statName);
            }
        }
    });
});

// ========================================
// TABLA EDITABLE
// ========================================

function renderWorkTable() {
    const sheet = StateManager.getActiveSheet();
    if (!sheet) {
        const wrapper = document.getElementById('editable-table-wrapper');
        if (wrapper) wrapper.innerHTML = '<p class="empty-message">No hay hoja activa</p>';
        return;
    }

    const wrapper = document.getElementById('editable-table-wrapper');
    if (!wrapper) return;

    let html = '<table class="work-table"><thead><tr>';

    sheet.headers.forEach((header, colIndex) => {
        if (colIndex === 0) {
            html += `<th><span class="header-cell">#</span></th>`;
        } else {
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

    html += '</tr></thead><tbody>';

    sheet.data.forEach((row, rowIndex) => {
        html += '<tr>';
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
            } else {
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
    });

    html += '</tbody></table>';
    wrapper.innerHTML = html;

    attachTableInputListeners();
    attachHeaderMenuListeners();
}

function attachTableInputListeners() {
    const wrapper = document.getElementById('editable-table-wrapper');
    if (!wrapper) return;

    // FIX: clonar el nodo para eliminar listeners anteriores acumulados
    // que se generaban cada vez que se llamaba a renderWorkTable()
    const freshWrapper = wrapper.cloneNode(true);
    wrapper.parentNode.replaceChild(freshWrapper, wrapper);

    freshWrapper.addEventListener('input', (e) => {
        const target = e.target;
        if (!target.classList.contains('editable-cell')) return;

        const type  = target.dataset.type;
        const value = target.value;

        if (type === 'header') {
            const col = parseInt(target.dataset.col);
            if (!isNaN(col) && col > 0) {
                StateManager.updateHeader(col, value);
            }
        } else if (type === 'data') {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);
            if (!isNaN(row) && !isNaN(col) && col > 0) {
                StateManager.updateCell(row, col, value);
            }
        }
    });

    freshWrapper.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        e.preventDefault();
        const inputs  = Array.from(freshWrapper.querySelectorAll('.editable-cell'));
        const current = inputs.indexOf(e.target);
        const next    = e.shiftKey ? current - 1 : current + 1;
        if (inputs[next]) {
            inputs[next].focus();
            inputs[next].select();
        }
    });

    // Listener de paste para datos tabulares de Excel
    freshWrapper.addEventListener('paste', (e) => {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (!pastedText) return;

        // Detectar si es dato tabular (de Excel) o texto simple
        const hasTab = pastedText.includes('\t');
        const hasMultipleLines = pastedText.split('\n').filter(r => r.trim()).length > 1;
        const isTabularData = hasTab || hasMultipleLines;

        if (isTabularData) {
            e.preventDefault();
            e.stopPropagation();
            
            // Obtener celda activa
            const activeCell = document.activeElement;
            let startRow = 0;
            let startCol = 1;

            if (activeCell && activeCell.classList.contains('editable-cell')) {
                const cellRow = parseInt(activeCell.dataset.row);
                const cellCol = parseInt(activeCell.dataset.col);
                if (!isNaN(cellRow)) startRow = cellRow;
                if (!isNaN(cellCol)) startCol = cellCol;
            }

            processPastedData(pastedText, startRow, startCol);
        }
        // Si no es tabular, se pega normalmente en el input
    });
}

function attachHeaderMenuListeners() {
    const wrapper = document.getElementById('editable-table-wrapper');
    if (!wrapper) return;

    // Toggle menús de columna
    wrapper.addEventListener('click', (e) => {
        const colMenuBtn = e.target.closest('.col-menu-btn');
        if (colMenuBtn) {
            e.preventDefault();
            e.stopPropagation();
            const colIndex = colMenuBtn.dataset.col;
            const dropdown = wrapper.querySelector(`.col-dropdown[data-col="${colIndex}"]`);
            
            // Cerrar otros menús abiertos
            wrapper.querySelectorAll('.col-dropdown.active, .row-dropdown.active').forEach(d => d.classList.remove('active'));
            
            if (dropdown) dropdown.classList.toggle('active');
            return;
        }

        const rowMenuBtn = e.target.closest('.row-menu-btn');
        if (rowMenuBtn) {
            e.preventDefault();
            e.stopPropagation();
            const rowIndex = rowMenuBtn.dataset.row;
            const dropdown = wrapper.querySelector(`.row-dropdown[data-row="${rowIndex}"]`);
            
            // Cerrar otros menús abiertos
            wrapper.querySelectorAll('.col-dropdown.active, .row-dropdown.active').forEach(d => d.classList.remove('active'));
            
            if (dropdown) dropdown.classList.toggle('active');
            return;
        }

        // Acciones de menú de columna
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
                } else if (action === 'insert-right') {
                    StateManager.insertColumn(colIndex + 1);
                    renderWorkTable();
                } else if (action === 'delete-col') {
                    StateManager.deleteColumn(colIndex);
                    renderWorkTable();
                }
            } catch (err) {
                console.error(err);
            }
            return;
        }

        // Acciones de menú de fila
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
                } else if (action === 'insert-below') {
                    StateManager.insertRow(rowIndex + 1);
                    renderWorkTable();
                } else if (action === 'delete-row') {
                    StateManager.deleteRow(rowIndex);
                    renderWorkTable();
                }
            } catch (err) {
                console.error(err);
            }
            return;
        }

        // Cerrar menús al hacer clic fuera
        if (!e.target.closest('.col-dropdown') && !e.target.closest('.row-dropdown')) {
            wrapper.querySelectorAll('.col-dropdown.active, .row-dropdown.active').forEach(d => d.classList.remove('active'));
        }
    });
}

function updateWorkSummary() {
    const sheet = StateManager.getActiveSheet();

    if (!sheet) {
        ['count-rows', 'count-cols', 'count-filled'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '0';
        });
        return;
    }

    const totalRows = sheet.data.length;
    const totalCols = sheet.headers.length - 1;

    let filledCount = 0;
    sheet.data.forEach(row => {
        row.slice(1).forEach(cell => {
            if (cell && cell.toString().trim() !== '') filledCount++;
        });
    });

    document.getElementById('count-rows').textContent   = totalRows;
    document.getElementById('count-cols').textContent   = totalCols;
    document.getElementById('count-filled').textContent = filledCount;
}

// ========================================
// BOTONES DE LA VISTA TRABAJO
// ========================================

function setupWorkButtons() {
    const btnGenerate = document.querySelector('.btn-generate-table');
    const btnAddRow   = document.querySelector('.btn-add-row');
    const btnAddCol   = document.querySelector('.btn-add-column');
    const btnDelRow   = document.querySelector('.btn-delete-row');
    const btnDelCol   = document.querySelector('.btn-delete-column');
    const btnClear    = document.querySelector('.btn-clear-table');
    const btnSave     = document.querySelector('.btn-save-work');
    const btnNewSheet = document.getElementById('btnNewSheet');

    if (btnGenerate) btnGenerate.onclick = generateWorkTable;
    if (btnAddRow)   btnAddRow.onclick   = addWorkRow;
    if (btnAddCol)   btnAddCol.onclick   = addWorkColumn;
    if (btnDelRow)   btnDelRow.onclick   = deleteWorkRow;
    if (btnDelCol)   btnDelCol.onclick   = deleteWorkColumn;
    if (btnClear)    btnClear.onclick    = clearWorkTable;
    if (btnSave)     btnSave.onclick     = saveWorkData;

    if (btnNewSheet) {
        btnNewSheet.onclick = () => {
            try {
                StateManager.createSheet();
                renderWorkTable();
                updateWorkSummary();
                renderSheetTabs();
                updateSheetsInfo();
            } catch (err) {
                alert('⚠️ ' + err.message);
            }
        };
    }
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

function addWorkRow() {
    try {
        StateManager.addRow();
        renderWorkTable();
        updateWorkSummary();
    } catch (err) { alert('⚠️ ' + err.message); }
}

function addWorkColumn() {
    try {
        StateManager.addColumn();
        renderWorkTable();
        updateWorkSummary();
    } catch (err) { alert('⚠️ ' + err.message); }
}

function deleteWorkRow() {
    try {
        StateManager.deleteRow();
        renderWorkTable();
        updateWorkSummary();
    } catch (err) { alert('⚠️ ' + err.message); }
}

function deleteWorkColumn() {
    try {
        StateManager.deleteColumn();
        renderWorkTable();
        updateWorkSummary();
    } catch (err) { alert('⚠️ ' + err.message); }
}

function clearWorkTable() {
    if (!confirm('¿Limpiar todos los datos de esta hoja?')) return;
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

    const nonEmptyRows = sheet.data.filter(row =>
        row.slice(1).some(cell => cell && String(cell).trim() !== '')
    );

    if (nonEmptyRows.length === 0) {
        alert('⚠️ No hay datos válidos para guardar (todas las filas están vacías)');
        return;
    }

    // Identificar columnas que tienen al menos una celda con datos
    const allHeaders = sheet.headers.slice(1);
    const colHasData = allHeaders.map((_, colIdx) =>
        nonEmptyRows.some(row => {
            const cell = row[colIdx + 1];
            return cell && String(cell).trim() !== '';
        })
    );

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
            headers:  headers,
            data:     formattedData,
            rowCount: formattedData.length
        }, fileName);

        switchView('datos');

        alert(`✅ Datos guardados correctamente.\n\n${formattedData.length} filas · ${headers.length} columnas\nRevísalos en la vista Datos y usa "Enviar a Análisis" cuando estés listo.`);
    } catch (err) {
        console.error('Error al guardar:', err);
        alert('❌ Error al guardar: ' + err.message);
    }
}

// ========================================
// PEGADO AUTOMÁTICO DESDE EXCEL
// El listener de paste se agrega en attachTableInputListeners()
// ========================================

function processPastedData(text, startRow = 0, startCol = 1) {
    const rows = text.split('\n').filter(r => r.trim());
    if (rows.length === 0) return;

    const maxCols = Math.max(...rows.map(r => r.split('\t').length));
    const sheet = StateManager.getActiveSheet();
    if (!sheet) return;

    // Expandir hoja si es necesario
    const neededRows = startRow + rows.length;
    const neededCols = startCol + maxCols;
    
    try {
        while (sheet.data.length < neededRows) StateManager.addRow();
        while ((sheet.headers.length - 1) < neededCols) StateManager.addColumn();
    } catch (err) {
        alert('⚠️ No se pudo expandir la hoja: ' + err.message);
        return;
    }

    // Pegar datos
    rows.forEach((rowText, rowIdx) => {
        const targetRow = startRow + rowIdx;
        if (targetRow >= sheet.data.length) return;
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

// ========================================
// IMPORTACIÓN DE ARCHIVOS
// FIX: el fileInput se removía del DOM ANTES de que el usuario seleccionara
//      el archivo, cancelando el diálogo en algunos navegadores.
//      Ahora se remueve solo DESPUÉS de recibir la respuesta del usuario.
// ========================================

function createFileInput() {
    const input  = document.createElement('input');
    input.type   = 'file';
    input.accept = '.csv,.json,.txt';
    input.style.display = 'none';
    return input;
}

function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;

    const headers = lines[0].split(',').map(h => h.trim());
    const data    = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row    = {};
        headers.forEach((h, idx) => row[h] = values[idx] || '');
        data.push(row);
    }

    return { headers, data, rowCount: data.length };
}

function parseJSON(content) {
    try {
        const data = JSON.parse(content);
        if (Array.isArray(data) && data.length > 0) {
            return { headers: Object.keys(data[0]), data, rowCount: data.length };
        }
    } catch (e) {
        console.error('Error JSON:', e);
    }
    return null;
}

document.querySelectorAll('.btn-import').forEach(btn => {
    btn.addEventListener('click', function () {
        const fileInput = createFileInput();
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];

            // Limpiar DOM solo aquí, cuando ya tenemos respuesta del usuario
            if (document.body.contains(fileInput)) {
                document.body.removeChild(fileInput);
            }

            if (!file) return;

            const fileName = file.name;
            const ext      = file.name.split('.').pop().toLowerCase();
            const reader   = new FileReader();

            reader.onload = function (e) {
                let parsed = null;
                if (ext === 'csv' || ext === 'txt') parsed = parseCSV(e.target.result);
                else if (ext === 'json')             parsed = parseJSON(e.target.result);

                if (parsed) {
                    StateManager.setImportedData(parsed, fileName);
                    displayImportedData(parsed);
                    updateDataView();
                } else {
                    alert('❌ Error al procesar el archivo. Verifica el formato.');
                }
            };

            reader.onerror = () => alert('❌ Error al leer el archivo.');
            reader.readAsText(file);
        });

        // Limpiar si el usuario cancela el diálogo sin seleccionar
        window.addEventListener('focus', function cleanupOnCancel() {
            if (document.body.contains(fileInput)) {
                document.body.removeChild(fileInput);
            }
            window.removeEventListener('focus', cleanupOnCancel);
        }, { once: true });

        fileInput.click();
    });
});

// ========================================
// ACTUALIZAR VISTA DE DATOS
// ========================================

function updateDataView() {
    const recentFilesList = document.getElementById('recent-files-list');
    const dataSummary     = document.getElementById('data-summary');
    const imported        = StateManager.getImportedData();

    if (!imported) {
        if (recentFilesList) recentFilesList.innerHTML = '<p class="empty-message">No hay archivos cargados</p>';
        if (dataSummary)     dataSummary.innerHTML     = '<p class="empty-message">Carga datos para ver el resumen</p>';
        return;
    }

    const fileName = StateManager.getState().fileName || 'datos importados';

    if (recentFilesList) {
        recentFilesList.innerHTML = `
            <div class="file-item">
                <div class="file-icon">📄</div>
                <div class="file-details">
                    <div class="file-name">${escapeHtml(fileName)}</div>
                    <div class="file-meta">${imported.rowCount} filas × ${imported.headers.length} columnas</div>
                </div>
                <button class="file-action" id="btn-view-file-details">👁️</button>
            </div>
        `;

        // FIX: viewFileDetails() ahora está definida y se adjunta con addEventListener,
        // eliminando la referencia a string inline que rompía en silencio.
        document.getElementById('btn-view-file-details')
            ?.addEventListener('click', viewFileDetails);
    }

    const summary = calculateDataSummary(imported);

    if (dataSummary) {
        dataSummary.innerHTML = `
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-label">Total Filas</div>
                    <div class="summary-value">${summary.totalRows}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Total Columnas</div>
                    <div class="summary-value">${summary.totalColumns}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Numéricas</div>
                    <div class="summary-value">${summary.numericColumns}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Texto</div>
                    <div class="summary-value">${summary.textColumns}</div>
                </div>
            </div>
        `;
    }
}

// FIX: función ahora definida correctamente en scope global
function viewFileDetails() {
    const imported = StateManager.getImportedData();
    if (!imported) {
        alert('No hay datos cargados.');
        return;
    }
    displayImportedData(imported);
    switchView('analisis');
}

// ========================================
// REACTIVIDAD CON STATEMANAGER
// ========================================

function setupStateListeners() {
    StateManager.addEventListener('statsChange', updateActiveStatsUI);

    StateManager.addEventListener('stateLoad', () => {
        sincronizarMenuLateral();
        updateActiveStatsUI();
    });

    StateManager.addEventListener('sheetChange', () => {
        renderSheetTabs();
        renderWorkTable();
        updateWorkSummary();
        updateSheetsInfo();
    });

    StateManager.addEventListener('dataChange', () => {
        if (document.getElementById('view-datos').classList.contains('active')) {
            DatosManager.buildView();
        }
    });
}

// ========================================
// HOJAS - TABS
// ========================================

function updateSheetsInfo() {
    const activeSheet = StateManager.getActiveSheet();
    const totalSheets = StateManager.getAllSheets().length;

    const nameEl  = document.getElementById('activeSheetName');
    const totalEl = document.getElementById('totalSheets');

    if (nameEl)  nameEl.textContent  = activeSheet ? activeSheet.name : '-';
    if (totalEl) totalEl.textContent = totalSheets;
}

function renderSheetTabs() {
    const container = document.getElementById('sheetsTabs');
    if (!container) return;

    const sheets      = StateManager.getAllSheets();
    const activeSheet = StateManager.getActiveSheet();

    container.innerHTML = '';

    sheets.forEach(sheet => {
        const tab       = document.createElement('div');
        tab.className   = `sheet-tab${sheet.id === activeSheet?.id ? ' active' : ''}`;

        tab.innerHTML = `
            <span class="sheet-tab-name">${escapeHtml(sheet.name)}</span>
            <button class="sheet-tab-close" aria-label="Eliminar hoja ${escapeHtml(sheet.name)}">×</button>
        `;

        // FIX: addEventListener con referencia directa, no onclick inline con interpolación
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
    if (!confirm('¿Eliminar esta hoja?')) return;
    try {
        StateManager.deleteSheet(sheetId);
        renderSheetTabs();
        renderWorkTable();
        updateWorkSummary();
        updateSheetsInfo();
    } catch (err) {
        alert('⚠️ ' + err.message);
    }
}

// ========================================
// CÁLCULO Y VISUALIZACIÓN DE DATOS
// ========================================

function calculateDataSummary(data) {
    if (!data) {
        console.warn('calculateDataSummary: no hay datos');
        return { totalRows: 0, totalColumns: 0, numericColumns: 0, textColumns: 0 };
    }

    const headers      = data.headers || [];
    const rows         = data.data    || [];
    const totalRows    = data.rowCount || rows.length;
    const totalColumns = headers.length;

    let numericColumns = 0;
    let textColumns    = 0;

    headers.forEach(header => {
        let numericCount = 0;
        let validCount   = 0;

        rows.forEach(row => {
            const value = row[header];
            if (value !== undefined && value !== null && value !== '') {
                validCount++;
                const num = parseFloat(value);
                if (!isNaN(num) && isFinite(num)) numericCount++;
            }
        });

        if (validCount > 0 && numericCount / validCount >= 0.7) {
            numericColumns++;
        } else {
            textColumns++;
        }
    });

    return { totalRows, totalColumns, numericColumns, textColumns };
}

function displayImportedData(data) {
    if (!data || !data.headers || !data.data) {
        console.warn('displayImportedData: datos inválidos');
        return;
    }

    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    if (!placeholder) return;

    const fileName  = StateManager.getState().fileName || 'datos importados';
    const numRows   = data.rowCount || data.data.length;
    const numCols   = data.headers.length;
    const today     = new Date().toLocaleDateString('es-DO', { day:'2-digit', month:'short', year:'numeric' });

    const numericCols = data.headers.filter(h => {
        const vals = data.data.slice(0,10).map(r => parseFloat(r[h]));
        return vals.filter(v => !isNaN(v)).length >= vals.length * 0.7;
    });
    const nullCount = (() => {
        let n = 0;
        data.data.forEach(row => data.headers.forEach(h => {
            if (row[h] === null || row[h] === undefined || String(row[h]).trim() === '') n++;
        }));
        return n;
    })();

    const colRows = data.headers.map((h, i) => {
        const tipo = numericCols.includes(h) ? 'numerica' : 'texto';
        return `<div class="dp-col-row"><span class="dp-col-num">${i+1}</span><span class="dp-col-name">${escapeHtml(h)}</span><span class="dp-col-type dp-col-${tipo}">${numericCols.includes(h) ? 'numérica' : 'texto'}</span></div>`;
    }).join('');

    const previewRows = data.data.slice(0, 5).map((row, i) => {
        const cells = data.headers.map(h => `<td>${escapeHtml(String(row[h] ?? ''))}</td>`).join('');
        return `<tr><td class="dp-row-num">${i+1}</td>${cells}</tr>`;
    }).join('');

    placeholder.innerHTML = `
    <div class="dp-dashboard">
        <div class="dp-header">
            <div>
                <div class="dp-filename">${escapeHtml(fileName)}</div>
                <div class="dp-date">Cargado · ${today}</div>
            </div>
            <button class="dp-btn-run" id="dp-btn-run">Ejecutar análisis →</button>
        </div>
        <div class="dp-kpis">
            <div class="dp-kpi"><div class="dp-kpi-val">${numRows}</div><div class="dp-kpi-lbl">Filas</div></div>
            <div class="dp-kpi"><div class="dp-kpi-val">${numCols}</div><div class="dp-kpi-lbl">Columnas</div></div>
            <div class="dp-kpi"><div class="dp-kpi-val">${numericCols.length}</div><div class="dp-kpi-lbl">Numéricas</div></div>
            <div class="dp-kpi ${nullCount > 0 ? 'dp-kpi-warn' : ''}"><div class="dp-kpi-val">${nullCount}</div><div class="dp-kpi-lbl">Nulos</div></div>
        </div>
        <div class="dp-body">
            <div class="dp-cols-panel">
                <div class="dp-panel-title">Columnas detectadas</div>
                ${colRows}
            </div>
            <div class="dp-preview-panel">
                <div class="dp-panel-title">Vista previa</div>
                <div class="dp-preview-wrap">
                    <table class="dp-preview-table">
                        <thead><tr><th>#</th>${data.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
                        <tbody>${previewRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="dp-footer">
            <button class="dp-btn-secondary" id="btn-clear-imported">Limpiar datos</button>
            <button class="dp-btn-secondary" id="btn-download-sample">Descargar plantilla CSV</button>
        </div>
    </div>`;

    document.getElementById('dp-btn-run')?.addEventListener('click', ejecutarAnalisis);
    document.getElementById('btn-clear-imported')?.addEventListener('click', clearImportedData);
    document.getElementById('btn-download-sample')?.addEventListener('click', downloadSampleData);
}

function clearImportedData() {
    StateManager.clearImportedData();
    ultimosResultados = null;

    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <h3>¡Comienza tu análisis!</h3>
            <p>Selecciona los estadísticos del menú lateral</p>
        `;
    }
    updateDataView();
}

function downloadSampleData() {
    const csv = `ID,Nombre,Edad,Peso,Altura,Grupo
1,Juan,25,70,1.75,A
2,María,30,65,1.68,B
3,Pedro,28,80,1.80,A
4,Ana,35,58,1.62,B
5,Luis,22,75,1.78,A`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href     = URL.createObjectURL(blob);
    link.download = 'plantilla_datos.csv';
    link.click();
    URL.revokeObjectURL(link.href);
}

// ========================================
// EJECUTAR ANÁLISIS
//
// FIX 1: había DOS definiciones de ejecutarAnalisis(). La segunda sobreescribía
//         a la primera silenciosamente. Se unifica en UNA sola definición.
//
// FIX 2: mostrarResultados() llamaba a ocultarCargando() al final de su ejecución,
//         lo que sobreescribía el HTML de resultados con el placeholder vacío.
//         Ahora el flujo es:
//           → mostrarCargando()    : muestra spinner
//           → mostrarResultados()  : inyecta el HTML de resultados (NO toca el spinner)
//           → ocultarCargando()    : SOLO se llama en caso de error
// ========================================

function ejecutarAnalisis() {
    if (!PermisosManager.puede('ejecutar_analisis')) {
        PermisosManager.mostrarDenegado('ejecutar_analisis');
        return;
    }
    console.log('Botón Ejecutar Análisis presionado');

    const importedData = StateManager.getImportedData();
    const activeStats  = StateManager.getActiveStats();
    const hypothesisConfig = StateManager.getAllHypothesisConfig();

    if (!importedData || !importedData.data || importedData.data.length === 0) {
        alert('⚠️ Debes importar o guardar datos primero.\n\nVe a "Trabajo" o usa "Importar Datos".');
        return;
    }

    if (!activeStats || activeStats.length === 0) {
        alert('⚠️ Debes seleccionar al menos un estadístico descriptivo del menú lateral.');
        return;
    }

     const estadisticosDescriptivos = [
         'Media Aritmética',
         'Mediana y Moda',
         'Desviación Estándar',
         'Varianza',
         'Percentiles',
         'Rango y Amplitud',
         'Coeficiente de Variación',
         'Asimetría (Skewness)',
         'Curtosis (Kurtosis)',
         'Error Estándar',
         'Intervalos de Confianza',
         'Detección de Outliers',
         'T-Test (una muestra)',
         'T-Test (dos muestras)',
         'ANOVA One-Way',
         'ANOVA Two-Way',
         'Chi-Cuadrado',
         'Test de Normalidad'
     ];

    const noImplementados = activeStats.filter(stat => !estadisticosDescriptivos.includes(stat));
    if (noImplementados.length > 0) {
        alert(`⚠️ Los siguientes estadísticos aún no están implementados:\n\n${noImplementados.join('\n')}\n\nSolo Estadística Descriptiva disponible por ahora.`);
        return;
    }

    // Mostrar spinner antes del cálculo síncrono
    mostrarCargando();

    // Pequeño delay para que el spinner sea visible antes del bloqueo del hilo
    setTimeout(() => {
        try {
            const resultados = EstadisticaDescriptiva.ejecutarAnalisis(importedData, activeStats, hypothesisConfig);
            console.log('Resultados obtenidos:', resultados);

            ultimosResultados = resultados;

            const html = EstadisticaDescriptiva.generarHTML(resultados);

            // FIX: solo inyecta los resultados. NO llama a ocultarCargando().
            mostrarResultados(html);

            switchView('analisis');
            console.log('Análisis completado con éxito');

        } catch (error) {
            // Solo en error volvemos al placeholder vacío
            ocultarCargando();
            console.error('Error en análisis:', error);
            alert('❌ Error al ejecutar el análisis:\n\n' + error.message);
        }
    }, 50);
}

// Muestra el spinner de carga
function mostrarCargando() {
    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <h3>🔬 Procesando análisis...</h3>
                <p>Calculando estadísticas descriptivas</p>
            </div>
        `;
    }
}

// FIX: ocultarCargando() SOLO se usa al producirse un error.
// No se llama tras mostrar resultados correctos.
function ocultarCargando() {
    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <h3>¡Comienza tu análisis!</h3>
            <p>Selecciona los estadísticos del menú lateral</p>
        `;
    }
}

/**
 * Limpia el panel de resultados y restablece la interfaz 
 * para permitir un nuevo cálculo estadístico.
 */
function nuevoAnalisis() {
    // 1. Limpiar el contenedor de resultados (inyectar el placeholder vacío)
    const container = document.getElementById('analisis-resultados-container');
    ultimosResultados = null;
    ocultarCargando();
    if (container) {
        container.innerHTML = `
            <div class="analisis-placeholder">
                <p>Seleccione los estadísticos en el panel izquierdo y haga clic en "Ejecutar Análisis"</p>
            </div>`;
    }

    // 2. Opcional: Limpiar los estadísticos activos en el StateManager si deseas un reset total
    // StateManager.clearActiveStats(); 
    // updateActiveStatsUI(); // Función que refresca los chips en el sidebar derecho

    // 3. Hacer scroll hacia arriba para que el usuario vea el inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log("Interfaz reiniciada para nuevo análisis.");
}

// FIX: solo inyecta HTML. Eliminada la llamada interna a ocultarCargando()
//      que borraba los resultados al instante de mostrarlos.
function mostrarResultados(htmlResultados) {
    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    if (placeholder) {
        placeholder.innerHTML = htmlResultados;

        // ★ FIX: adjuntar listeners DESPUÉS de inyectar el HTML
        _attachNavListeners();
    }
}

function _attachNavListeners() {
    // Nav lateral — cambiar estadístico activo
    document.querySelectorAll('.ar-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const stat = item.dataset.stat;
            document.querySelectorAll('.ar-nav-item')
                .forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.ar-panel')
                .forEach(p => p.classList.remove('active'));
            item.classList.add('active');
            document.querySelector(`.ar-panel[data-panel="${stat}"]`)
                ?.classList.add('active');
        });
    });

    // ★ Botón Nuevo análisis
    document.querySelector('.ar-btn-secondary')
        ?.addEventListener('click', () => nuevoAnalisis());

    document.querySelector('.ar-btn-primary')
        ?.addEventListener('click', () => exportarResultados());
}

// ========================================
// EXPORTAR / NUEVO ANÁLISIS
// (botones generados por EstadisticaDescriptiva.generarHTML())
// ========================================

function exportarResultados() {
    if (!PermisosManager.puede('exportar_reportes')) {
        PermisosManager.mostrarDenegado('exportar_reportes');
        return;
    }
    if (!ultimosResultados) {
        alert('⚠️ No hay resultados para exportar. Ejecuta un análisis primero.');
        return;
    }
    // ★ Nuevo flujo: ir a Visualización para seleccionar gráficos
    switchView('visualizacion');
    setTimeout(() => Visualizacion.activarModoExportacion(), 80);
}

// ========================================
// TRANSFORMACIONES DE DATOS
// ========================================

function setupTransformButtons() {
    // FIX: eliminado el setTimeout como hack. Se ejecuta directamente
    // en DOMContentLoaded donde el DOM ya está garantizado.
    const buttons = document.querySelectorAll('.transform-btn');

    if (buttons.length < 4) {
        console.warn('No se encontraron los 4 botones .transform-btn');
        return;
    }

    buttons[0].addEventListener('click', cleanData);
    buttons[1].addEventListener('click', normalizeData);
    buttons[2].addEventListener('click', createCalculatedColumn);
    buttons[3].addEventListener('click', removeNulls);

    console.log('Botones de transformaciones configurados');
}

function cleanData() {
    const imported = StateManager.getImportedData();

    if (!imported || !imported.data || imported.data.length === 0) {
        alert('⚠️ No hay datos cargados para limpiar.\n\nImporta o guarda datos primero.');
        return;
    }

    let changesCount = 0;

    imported.data.forEach(row => {
        imported.headers.forEach(header => {
            const originalValue = row[header];
            if (typeof originalValue === 'string') {
                const cleaned = originalValue.trim().replace(/\s+/g, ' ');
                if (cleaned !== originalValue) {
                    row[header] = cleaned;
                    changesCount++;
                }
            }
        });
    });

    StateManager.setImportedData(imported, StateManager.getState().fileName || 'datos_limpiados.csv');
    updateDataView();
    displayImportedData(imported);

    alert(changesCount === 0
        ? '✅ Limpieza completada\nNo se encontraron espacios extras para limpiar.'
        : `✅ Limpieza completada\n${changesCount} valores fueron modificados.`
    );
}

function normalizeData() {
    const imported = StateManager.getImportedData();

    if (!imported || !imported.data || imported.data.length === 0) {
        alert('⚠️ No hay datos cargados para normalizar.');
        return;
    }

    const numericCols = EstadisticaDescriptiva.getNumericColumns(imported);

    if (numericCols.length === 0) {
        alert('⚠️ No se encontraron columnas numéricas para normalizar.');
        return;
    }

    // Normalización Min-Max → rango [0, 1]
    numericCols.forEach(col => {
        const values = imported.data
            .map(row => parseFloat(row[col]))
            .filter(v => !isNaN(v) && isFinite(v));

        const min   = Math.min(...values);
        const max   = Math.max(...values);
        const range = max - min;

        if (range === 0) return; // columna constante, evitar división por cero

        imported.data.forEach(row => {
            const val = parseFloat(row[col]);
            if (!isNaN(val) && isFinite(val)) {
                row[col] = ((val - min) / range).toFixed(4);
            }
        });
    });

    StateManager.setImportedData(imported, StateManager.getState().fileName || 'datos_normalizados.csv');
    updateDataView();
    displayImportedData(imported);

    alert(`✅ Normalización Min-Max completada en ${numericCols.length} columna(s):\n${numericCols.join(', ')}`);
}

function removeNulls() {
    const imported = StateManager.getImportedData();

    if (!imported || !imported.data || imported.data.length === 0) {
        alert('⚠️ No hay datos cargados.');
        return;
    }

    const originalLength = imported.data.length;

    imported.data = imported.data.filter(row =>
        imported.headers.every(header => {
            const val = row[header];
            return val !== null && val !== undefined && String(val).trim() !== '';
        })
    );

    const removed       = originalLength - imported.data.length;
    imported.rowCount   = imported.data.length;

    StateManager.setImportedData(imported, StateManager.getState().fileName || 'datos_sin_nulos.csv');
    updateDataView();
    displayImportedData(imported);

    alert(removed === 0
        ? '✅ No se encontraron filas con valores nulos o vacíos.'
        : `✅ Se eliminaron ${removed} fila(s) con valores nulos o vacíos.\nFilas restantes: ${imported.data.length}`
    );
}

function createCalculatedColumn() {
    const imported = StateManager.getImportedData();

    if (!imported || !imported.data || imported.data.length === 0) {
        alert('⚠️ No hay datos cargados.');
        return;
    }

    const numericCols = EstadisticaDescriptiva.getNumericColumns(imported);

    if (numericCols.length < 2) {
        alert('⚠️ Se necesitan al menos 2 columnas numéricas para crear una columna calculada.');
        return;
    }

    const col1 = prompt(`Columna A (disponibles: ${numericCols.join(', ')}):`);
    if (!col1 || !numericCols.includes(col1)) { alert('⚠️ Columna no válida.'); return; }

    const col2 = prompt(`Columna B (disponibles: ${numericCols.filter(c => c !== col1).join(', ')}):`);
    if (!col2 || !numericCols.includes(col2) || col2 === col1) { alert('⚠️ Columna no válida.'); return; }

    const op = prompt('Operación: +, -, *, /');
    if (!['+', '-', '*', '/'].includes(op)) { alert('⚠️ Operación no válida. Usa +, -, * o /'); return; }

    const newColName = `${col1}${op}${col2}`;
    imported.headers.push(newColName);

    imported.data.forEach(row => {
        const a = parseFloat(row[col1]);
        const b = parseFloat(row[col2]);

        if (isNaN(a) || isNaN(b)) { row[newColName] = ''; return; }

        let result;
        switch (op) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': result = b !== 0 ? a / b : ''; break;
        }

        row[newColName] = result !== '' ? Number(result).toFixed(4) : '';
    });

    StateManager.setImportedData(imported, StateManager.getState().fileName || 'datos.csv');
    updateDataView();
    displayImportedData(imported);

    alert(`✅ Columna "${newColName}" creada con ${imported.data.length} valores.`);
}

// ========================================
// VISUALIZACIÓN
// ========================================

let vizBuilt = false;

function inicializarVisualizacion() {
    if (!vizBuilt) {
        Visualizacion.buildUI('viz-container');
        vizBuilt = true;
    } else {
        Visualizacion.refreshSelects();
    }
}

// ========================================
// REPORTES
// ========================================

function inicializarReportes() {
    // Reconstruye siempre para reflejar el análisis más reciente
    ReporteManager.buildReportesView();
}

// ========================================
// AUDITORÍA
// ========================================

function inicializarAuditoria() {
    const API_URL = 'https://proyecto-sigmaproxvl.onrender.com';
    AuditoriaManager.init(API_URL);
    AuditoriaManager.buildView();
}

// ========================================
// USUARIOS
// ========================================

function inicializarUsuarios() {
    const API_URL = 'https://proyecto-sigmaproxvl.onrender.com';
    UsuariosManager.init(API_URL);
    UsuariosManager.buildView();
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 StatAnalyzer Pro inicializado');

    // Auth va primero — bloquea la app hasta login exitoso
    Auth.init({
        onLogin: ({ username }) => {
            console.log('✅ Sesión iniciada:', username);
            _initApp();
            _renderUserChip(username);
            PermisosManager.aplicarUI(Auth.getSession());
        },
        onLogout: (reason) => {
            console.log('🔒 Sesión cerrada:', reason);
        }
    });
});

// Inicialización de la app (solo tras login exitoso)
function _initApp() {
    setupStateListeners(); // Primero registrar listeners
    StateManager.init();   // Luego inicializar (puede cargar estado y disparar stateLoad)
    updateActiveStatsUI();
    sincronizarMenuLateral();
    switchView('trabajo'); // Vista por defecto: módulo de trabajo
    setupWorkButtons();
    // setupTransformButtons(); — reemplazado por DatosManager

    renderSheetTabs();
    updateSheetsInfo();

    if (document.getElementById('view-trabajo').classList.contains('active')) {
        renderWorkTable();
        updateWorkSummary();
    }

    const btnRun = document.querySelector('.btn-run');
    if (btnRun) {
        btnRun.addEventListener('click', ejecutarAnalisis);
        console.log('Evento click asignado al botón Ejecutar Análisis');
    } else {
        console.warn('No se encontró el botón .btn-run en el DOM');
    }

    setupSidebarToggles();
    updateSidebarIconBadges();
    
    console.log('✅ Formatos soportados: CSV, JSON, TXT');
    console.log('✅ Estado centralizado activo');
}

// Chip de usuario y botón logout en la barra superior
function _renderUserChip(username) {
    const navContent = document.querySelector('.nav-content');
    if (!navContent) return;

    document.getElementById('auth-user-info')?.remove();

    const initials = username.slice(0, 2).toUpperCase();
    const chip = document.createElement('div');
    chip.id = 'auth-user-info';
    chip.style.cssText = 'display:flex;align-items:center;gap:10px;';
    const session = Auth.getSession();
    const isAdmin = session?.role === 'admin';

    chip.innerHTML = `
        <div class="auth-user-chip">
            <div class="auth-user-chip-avatar">${initials}</div>
            <span>${username}</span>
            ${isAdmin ? '<span class="auth-admin-chip">Admin</span>' : ''}
        </div>
        <button class="auth-logout-btn" onclick="Auth.logout()" title="Cerrar sesión">
            🔓 Salir
        </button>
    `;

    // Mostrar pestañas solo para admins
    const audTab = document.getElementById('nav-auditoria');
    if (audTab) audTab.style.display = isAdmin ? '' : 'none';

    const usrTab = document.getElementById('nav-usuarios');
    if (usrTab) usrTab.style.display = isAdmin ? '' : 'none';
    navContent.appendChild(chip);
}

// ========================================
// SIDEBAR COLLAPSIBLE
// ========================================

function setupSidebarToggles() {
    const STORAGE_KEY_LEFT  = 'sidebar_left_collapsed';
    const STORAGE_KEY_RIGHT = 'sidebar_right_collapsed';

    const leftSidebar  = document.querySelector('.stats-menu');
    const rightSidebar = document.querySelector('.active-sidebar');

    if (!leftSidebar || !rightSidebar) return;

    // ── Crear botones de toggle ──

    function crearBoton(arrowExpandida, arrowColapsada) {
        const btn = document.createElement('button');
        btn.className = 'sidebar-toggle-btn';
        btn.setAttribute('aria-label', 'Toggle sidebar');
        btn.dataset.arrowExp = arrowExpandida;
        btn.dataset.arrowCol = arrowColapsada;
        btn.textContent = arrowExpandida;
        return btn;
    }

    function crearLabel(texto) {
        const label = document.createElement('div');
        label.className = 'sidebar-strip-label';
        label.textContent = texto;
        return label;
    }

    const btnLeft  = crearBoton('◀', '▶');
    const btnRight = crearBoton('▶', '◀');

    leftSidebar.appendChild(btnLeft);
    leftSidebar.appendChild(crearLabel('Estadísticos'));

    rightSidebar.appendChild(btnRight);
    rightSidebar.appendChild(crearLabel('En Proceso'));

    // ── Crear contenedores de iconos ──
    createSidebarIconContainers(leftSidebar, rightSidebar);

    // ── Aplicar estado guardado en sesión ──

    function aplicarEstado(sidebar, btn, collapsed) {
        if (collapsed) {
            sidebar.classList.add('sidebar-collapsed');
            btn.textContent = btn.dataset.arrowCol;
        } else {
            sidebar.classList.remove('sidebar-collapsed');
            btn.textContent = btn.dataset.arrowExp;
        }
    }

    aplicarEstado(leftSidebar,  btnLeft,  sessionStorage.getItem(STORAGE_KEY_LEFT)  === 'true');
    aplicarEstado(rightSidebar, btnRight, sessionStorage.getItem(STORAGE_KEY_RIGHT) === 'true');

    // ── Click handlers ──

    btnLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        const collapsed = !leftSidebar.classList.contains('sidebar-collapsed');
        if (collapsed) {
            document.querySelectorAll('.accordion-header.active').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.classList.remove('active');
            });
        }
        sessionStorage.setItem(STORAGE_KEY_LEFT, collapsed);
        aplicarEstado(leftSidebar, btnLeft, collapsed);
    });

    btnRight.addEventListener('click', (e) => {
        e.stopPropagation();
        const collapsed = !rightSidebar.classList.contains('sidebar-collapsed');
        sessionStorage.setItem(STORAGE_KEY_RIGHT, collapsed);
        aplicarEstado(rightSidebar, btnRight, collapsed);
    });

    console.log('✅ Sidebar toggles inicializados');
}

// ========================================
// ICONOS DE SIDEBAR CON BADGES (Modelo E)
// ========================================

// Definir secciones con sus iconos y opciones
const SIDEBAR_SECTIONS = {
    descriptiva: {
        icon: '📊',
        label: 'Descriptiva',
        options: [
            'Media Aritmética', 'Mediana y Moda', 'Desviación Estándar', 'Varianza',
            'Percentiles', 'Rango y Amplitud', 'Coeficiente de Variación',
            'Asimetría (Skewness)', 'Curtosis (Kurtosis)', 'Error Estándar',
            'Intervalos de Confianza', 'Detección de Outliers'
        ]
    },
    hipotesis: {
        icon: '🧪',
        label: 'Hipótesis',
        options: [
            'T-Test (una muestra)', 'T-Test (dos muestras)', 'ANOVA One-Way',
            'ANOVA Two-Way', 'Chi-Cuadrado', 'Test de Normalidad'
        ]
    },
    correlacion: {
        icon: '📈',
        label: 'Correlación',
        options: [
            'Correlación Pearson', 'Correlación Spearman', 'Regresión Lineal Simple',
            'Regresión Lineal Múltiple', 'Regresión Logística', 'Regresión Polinomial'
        ]
    },
    noParametricos: {
        icon: '🔬',
        label: 'No Paramétricos',
        options: [
            'Mann-Whitney U', 'Wilcoxon', 'Kruskal-Wallis', 'Friedman', 'Test de Signos'
        ]
    },
    multivariado: {
        icon: '🎯',
        label: 'Multivariado',
        options: [
            'PCA (Componentes Principales)', 'Análisis Factorial', 'Análisis de Cluster',
            'Análisis Discriminante', 'M-ANOVA'
        ]
    },
    extras: {
        icon: '✨',
        label: 'Extras',
        options: [
            'Series Temporales', 'Bootstrap', 'Análisis de Supervivencia',
            'Modelos Mixtos', 'Análisis Bayesiano'
        ]
    }
};

function updateSidebarIconBadges() {
    const activeStats = StateManager.getActiveStats();
    
    // Actualizar badges del sidebar izquierdo
    Object.entries(SIDEBAR_SECTIONS).forEach(([key, section]) => {
        const badge = document.querySelector(`.sidebar-icon-badge[data-section="${key}"]`);
        if (badge) {
            const count = activeStats.filter(stat => section.options.includes(stat)).length;
            badge.textContent = count;
            badge.classList.toggle('has-items', count > 0);
        }
    });

    // Actualizar badge del sidebar derecho (total activos)
    const rightBadge = document.querySelector('.sidebar-icon-badge[data-section="proceso"]');
    if (rightBadge) {
        rightBadge.textContent = activeStats.length;
        rightBadge.classList.toggle('has-items', activeStats.length > 0);
    }
}

function createSidebarIconContainers(leftSidebar, rightSidebar) {
    // Contenedor de iconos para sidebar izquierdo
    const leftIcons = document.createElement('div');
    leftIcons.className = 'sidebar-icons-container';
    
    Object.entries(SIDEBAR_SECTIONS).forEach(([key, section]) => {
        const iconItem = document.createElement('div');
        iconItem.className = 'sidebar-icon-item';
        iconItem.innerHTML = `
            <span class="sidebar-icon">${section.icon}</span>
            <span class="sidebar-icon-badge" data-section="${key}">0</span>
        `;
        iconItem.title = section.label;
        iconItem.addEventListener('click', (e) => {
            e.stopPropagation();
            // Expandir sidebar y abrir la sección correspondiente
            leftSidebar.classList.remove('sidebar-collapsed');
            sessionStorage.setItem('sidebar_left_collapsed', false);
            
            const accordionHeader = leftSidebar.querySelectorAll('.accordion-header');
            const sections = Object.keys(SIDEBAR_SECTIONS);
            const sectionIndex = sections.indexOf(key);
            
            if (sectionIndex >= 0 && accordionHeader[sectionIndex]) {
                accordionHeader[sectionIndex].click();
            }
        });
        leftIcons.appendChild(iconItem);
    });
    
    leftSidebar.appendChild(leftIcons);

    // Contenedor de iconos para sidebar derecho
    const rightIcons = document.createElement('div');
    rightIcons.className = 'sidebar-icons-container';
    
    const rightIconItem = document.createElement('div');
    rightIconItem.className = 'sidebar-icon-item proceso-icon';
    rightIconItem.innerHTML = `
        <span class="sidebar-icon">⚡</span>
        <span class="sidebar-icon-badge" data-section="proceso">0</span>
    `;
    rightIconItem.title = 'En Proceso';
    rightIconItem.addEventListener('click', (e) => {
        e.stopPropagation();
        rightSidebar.classList.remove('sidebar-collapsed');
        sessionStorage.setItem('sidebar_right_collapsed', false);
    });
    rightIcons.appendChild(rightIconItem);
    
    rightSidebar.appendChild(rightIcons);
}

// ========================================
// MODAL DE CONFIGURACIÓN DE PRUEBAS DE HIPÓTESIS
// ========================================
function mostrarModalConfiguracionHypothesis(statName) {
    document.getElementById('hypo-config-modal')?.remove();
    
    const imported = StateManager.getImportedData();
    if (!imported) {
        _showToast('⚠️ Primero importa datos', true);
        return false;
    }
    
    const allCols = imported.headers || [];
    if (allCols.length < 2) {
        _showToast('⚠️ Se necesitan al menos 2 columnas', true);
        return false;
    }
    
    // Definir configuración según la prueba
    const configs = {
        'ANOVA One-Way': { title: '🧪 Configurar ANOVA One-Way', catCols: 1, numCols: 1, catLabel: 'Columna de Agrupación (Factor)', numLabel: 'Columna de Valores (Variable Dependiente)' },
        'ANOVA Two-Way': { title: '🧪 Configurar ANOVA Two-Way', catCols: 2, numCols: 1, catLabel: 'Factores (2 columnas categóricas)', numLabel: 'Columna de Valores (Variable Dependiente)' },
        'Chi-Cuadrado': { title: '📊 Configurar Chi-Cuadrado', catCols: 2, numCols: 0, catLabel: 'Variables categóricas (2 columnas)', numLabel: null },
        'T-Test (dos muestras)': { title: '📈 Configurar T-Test (dos muestras)', catCols: 1, numCols: 1, catLabel: 'Columna de Agrupación (2 grupos)', numLabel: 'Columna de Valores (Variable Dependiente)' }
    };
    
    const config = configs[statName];
    if (!config) {
        _showToast('⚠️ Configuración no disponible para esta prueba', true);
        return false;
    }
    
    // Detectar columnas categóricas y numéricas
    const numericCols = allCols.filter(col => {
        const values = imported.data.map(row => row[col]).filter(v => v !== null && v !== '' && v !== undefined);
        const numericCount = values.filter(v => !isNaN(parseFloat(v))).length;
        return numericCount / values.length > 0.5; // 50% o más valores numéricos
    });
    
    const categoricalCols = allCols.filter(col => !numericCols.includes(col));
    
    const modal = document.createElement('div');
    modal.id = 'hypo-config-modal';
    modal.innerHTML = `
        <div class="dm-modal-overlay" id="hypo-modal-overlay"></div>
        <div class="dm-modal-card" style="width: min(560px, 96vw);">
            <div class="dm-modal-header">
                <h3>${config.title}</h3>
                <button class="dm-modal-close" id="hypo-modal-close">✕</button>
            </div>
            <div class="dm-modal-body">
                ${config.catCols >= 1 ? `
                <div class="dm-field" style="margin-bottom: 14px;">
                    <label>🏷️ ${config.catLabel}</label>
                    <div class="dm-col-checks" id="hypo-cat-checks">
                        ${categoricalCols.length > 0 ? categoricalCols.map(col => `
                            <label class="dm-check-row">
                                <input type="checkbox" value="${escapeHtml(col)}" name="hypo-cat-col">
                                ${escapeHtml(col)}
                            </label>
                        `).join('') : '<p style="font-size:0.8rem;color:#999;grid-column:1/-1;">No se detectaron columnas categóricas. Selecciona columnas numéricas como factores.</p>'}
                        ${numericCols.length > 0 ? `<p style="font-size:0.75rem;color:#666;grid-column:1/-1;margin-top:8px;">Columnas numéricas (pueden usarse como factores si tienen valores discretos):</p>` : ''}
                        ${numericCols.map(col => `
                            <label class="dm-check-row" style="border-color:#e8e8e8;">
                                <input type="checkbox" value="${escapeHtml(col)}" name="hypo-cat-col">
                                ${escapeHtml(col)} <span style="font-size:0.7rem;color:#999;">(numérica)</span>
                            </label>
                        `).join('')}
                    </div>
                </div>` : ''}
                ${config.numCols >= 1 ? `
                <div class="dm-field" style="margin-bottom: 14px;">
                    <label>📈 ${config.numLabel}</label>
                    <div class="dm-col-checks" id="hypo-num-checks">
                        ${numericCols.map(col => `
                            <label class="dm-check-row">
                                <input type="radio" value="${escapeHtml(col)}" name="hypo-num-col">
                                ${escapeHtml(col)}
                            </label>
                        `).join('')}
                    </div>
                </div>` : ''}
                <div id="hypo-preview" style="margin-top: 16px; padding: 12px; background: #f8f9fa; border-radius: 8px; display: none;">
                    <p style="font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">📋 Grupos detectados:</p>
                    <div id="hypo-groups-list" style="font-size: 0.8rem; color: #555;"></div>
                </div>
                <div id="hypo-error" style="margin-top: 12px; padding: 10px; background: #fff5f5; border-radius: 8px; color: #c53030; font-size: 0.85rem; display: none;"></div>
            </div>
            <div class="dm-modal-footer">
                <button class="dm-btn dm-btn-secondary" id="hypo-modal-cancel">Cancelar</button>
                <button class="dm-btn dm-btn-primary" id="hypo-modal-confirm">✓ Aceptar</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('dm-modal-visible'));
    
    const close = () => { modal.classList.remove('dm-modal-visible'); setTimeout(() => modal.remove(), 250); };
    document.getElementById('hypo-modal-close').addEventListener('click', close);
    document.getElementById('hypo-modal-cancel').addEventListener('click', close);
    document.getElementById('hypo-modal-overlay').addEventListener('click', close);
    
    // Actualizar preview de grupos cuando cambian las selecciones
    const updatePreview = () => {
        const preview = document.getElementById('hypo-preview');
        const groupsList = document.getElementById('hypo-groups-list');
        const errorDiv = document.getElementById('hypo-error');
        
        const selectedCatCols = [...modal.querySelectorAll('input[name="hypo-cat-col"]:checked')].map(cb => cb.value);
        const selectedNumCol = modal.querySelector('input[name="hypo-num-col"]:checked')?.value;
        
        // Validaciones
        errorDiv.style.display = 'none';
        
        if (config.catCols > 0 && selectedCatCols.length < config.catCols) {
            preview.style.display = 'none';
            return;
        }
        
        if (config.numCols > 0 && !selectedNumCol) {
            preview.style.display = 'none';
            return;
        }
        
        // Mostrar preview de grupos
        preview.style.display = 'block';
        
        if (config.catCols === 1 && selectedCatCols.length === 1) {
            // Un solo factor categórico
            const catCol = selectedCatCols[0];
            const groups = [...new Set(imported.data.map(row => row[catCol]).filter(v => v !== null && v !== ''))];
            
            if (statName === 'T-Test (dos muestras)' && groups.length !== 2) {
                errorDiv.textContent = `⚠️ T-Test requiere exactamente 2 grupos. Se detectaron ${groups.length} grupos en "${catCol}".`;
                errorDiv.style.display = 'block';
                preview.style.display = 'none';
                return;
            }
            
            if (statName === 'ANOVA One-Way' && groups.length < 2) {
                errorDiv.textContent = `⚠️ ANOVA requiere al menos 2 grupos. Se detectaron ${groups.length} grupos en "${catCol}".`;
                errorDiv.style.display = 'block';
                preview.style.display = 'none';
                return;
            }
            
            const groupsHtml = groups.map(g => {
                const count = imported.data.filter(row => row[catCol] === g).length;
                return `<div style="padding: 4px 0; border-bottom: 1px solid #eee;"><strong>${escapeHtml(String(g))}</strong> (n=${count})</div>`;
            }).join('');
            
            groupsList.innerHTML = `<p style="margin-bottom:6px;">Factor: <strong>${escapeHtml(catCol)}</strong></p>${groupsHtml}`;
        } else if (config.catCols === 2 && selectedCatCols.length === 2) {
            // Dos factores categóricos
            const [catCol1, catCol2] = selectedCatCols;
            const groups1 = [...new Set(imported.data.map(row => row[catCol1]).filter(v => v !== null && v !== ''))];
            const groups2 = [...new Set(imported.data.map(row => row[catCol2]).filter(v => v !== null && v !== ''))];
            
            groupsList.innerHTML = `
                <p style="margin-bottom:4px;">Factor 1: <strong>${escapeHtml(catCol1)}</strong> (${groups1.length} niveles)</p>
                <p style="margin-bottom:4px;">Factor 2: <strong>${escapeHtml(catCol2)}</strong> (${groups2.length} niveles)</p>
                <p style="font-size:0.75rem;color:#888;margin-top:6px;">Total observaciones: ${imported.data.length}</p>
            `;
        }
    };
    
    // Agregar listeners para actualizar preview
    modal.querySelectorAll('input[name="hypo-cat-col"], input[name="hypo-num-col"]').forEach(input => {
        input.addEventListener('change', updatePreview);
    });
    
    // Limitar selección de columnas categóricas según la configuración
    const catCheckboxes = modal.querySelectorAll('input[name="hypo-cat-col"]');
    catCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const checked = [...catCheckboxes].filter(c => c.checked);
            if (checked.length > config.catCols) {
                cb.checked = false;
                _showToast(`⚠️ Solo puedes seleccionar ${config.catCols} columna(s) categórica(s)`, true);
            }
        });
    });
    
    // Confirmar selección
    document.getElementById('hypo-modal-confirm').addEventListener('click', () => {
        const selectedCatCols = [...modal.querySelectorAll('input[name="hypo-cat-col"]:checked')].map(cb => cb.value);
        const selectedNumCol = modal.querySelector('input[name="hypo-num-col"]:checked')?.value;
        
        // Validaciones finales
        if (config.catCols > 0 && selectedCatCols.length < config.catCols) {
            _showToast(`⚠️ Selecciona ${config.catCols} columna(s) categórica(s)`, true);
            return;
        }
        
        if (config.numCols > 0 && !selectedNumCol) {
            _showToast('⚠️ Selecciona una columna numérica', true);
            return;
        }
        
        if (statName === 'T-Test (dos muestras)' && selectedCatCols.length === 1) {
            const catCol = selectedCatCols[0];
            const groups = [...new Set(imported.data.map(row => row[catCol]).filter(v => v !== null && v !== ''))];
            if (groups.length !== 2) {
                _showToast(`⚠️ T-Test requiere exactamente 2 grupos. Se detectaron ${groups.length}.`, true);
                return;
            }
        }
        
        // Guardar configuración en StateManager
        const hypothesisConfig = {
            statName: statName,
            categoricalCols: selectedCatCols,
            numericCol: selectedNumCol || null,
            timestamp: Date.now()
        };
        
        StateManager.setHypothesisConfig(statName, hypothesisConfig);
        StateManager.addActiveStat(statName);
        
        // Marcar visualmente
        document.querySelectorAll('.menu-option').forEach(opt => {
            if (opt.textContent.trim() === statName) {
                opt.classList.add('selected');
            }
        });
        
        _showToast(`✅ ${statName} configurado correctamente`);
        close();
    });
    
    return true;
}

// ========================================
// SINCRONIZAR VISUAL DEL MENÚ LATERAL
// con los estadísticos activos en StateManager
// Se llama al iniciar la app para restaurar
// el estado visual tras recargar la página
// ========================================
function sincronizarMenuLateral() {
    const activeStats = StateManager.getActiveStats();
    if (!activeStats || activeStats.length === 0) return;

    document.querySelectorAll('.menu-option').forEach(opt => {
        const nombre = opt.textContent.trim();
        if (activeStats.includes(nombre)) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });

    console.log(`🔄 Menú lateral sincronizado: ${activeStats.length} estadístico(s) activo(s)`);
}

console.log('✅ script.js cargado');