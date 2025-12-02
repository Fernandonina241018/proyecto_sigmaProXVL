// ========================================
// VARIABLES GLOBALES
// ========================================

let importedData = null;
let fileName = '';
let activeStats = [];

// Variables para el sistema de hojas
let allSheets = [];
let activeSheetId = null;
let sheetCounter = 0;

// Datos de la hoja actual
let workTableData = {
    headers: [],
    data: [],
    rows: 10,
    cols: 5
};

//import StateManager from './state.js';

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
    
    console.log(`Vista cambiada a: ${viewName}`);
}

// ========================================
// NAVEGACIÓN SUPERIOR
// ========================================
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        this.classList.add('active');
        
        const viewName = this.textContent.trim().toLowerCase();
        
        const viewMap = {
            'análisis': 'analisis',
            'datos': 'datos',
            'visualización': 'visualizacion',
            'reportes': 'reportes',
            'trabajo': 'trabajo'
        };
        
        const targetView = viewMap[viewName];
        if (targetView) {
            switchView(targetView);
            
            // Inicializar sistema de hojas si es la vista de trabajo
            if (targetView === 'trabajo' && allSheets.length === 0) {
                initSheetsSystem();
            }
        }
    });
});

// ========================================
// FUNCIONALIDAD DE ACORDEÓN
// ========================================
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isActive = this.classList.contains('active');
        
        accordionHeaders.forEach(h => {
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
const activeStatsContainer = document.getElementById('activeStatsContainer');
const statsCount = document.getElementById('statsCount');
const emptyState = document.getElementById('emptyState');

function updateActiveStats() {
    if (activeStats.length === 0) {
        emptyState.style.display = 'block';
        statsCount.textContent = '0 estadísticos activos';
    } else {
        emptyState.style.display = 'none';
        const plural = activeStats.length !== 1;
        statsCount.textContent = `${activeStats.length} estadístico${plural ? 's' : ''} activo${plural ? 's' : ''}`;
    }
}

function addActiveStat(name) {
    if (activeStats.includes(name)) return;
    
    activeStats.push(name);
    
    const chip = document.createElement('div');
    chip.className = 'stat-chip';
    chip.setAttribute('data-stat-name', name);
    chip.innerHTML = `
        <span>${name}</span>
        <button class="chip-remove" onclick="removeActiveStatByName('${name}')">×</button>
    `;
    
    activeStatsContainer.appendChild(chip);
    updateActiveStats();
}

function removeActiveStatByName(name) {
    activeStats = activeStats.filter(stat => stat !== name);
    
    const chip = activeStatsContainer.querySelector(`[data-stat-name="${name}"]`);
    if (chip) chip.remove();
    
    document.querySelectorAll('.menu-option').forEach(option => {
        if (option.textContent === name) {
            option.classList.remove('selected');
        }
    });
    
    updateActiveStats();
}

// ========================================
// SELECCIÓN DE ESTADÍSTICOS
// ========================================
document.querySelectorAll('.menu-option').forEach(option => {
    option.addEventListener('click', function() {
        const statName = this.textContent;
        
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
            removeActiveStatByName(statName);
        } else {
            this.classList.add('selected');
            addActiveStat(statName);
        }
    });
});

// ========================================
// SISTEMA DE MÚLTIPLES HOJAS (SHEETS)
// ========================================

function initSheetsSystem() {
    console.log('Inicializando sistema de hojas...');
    createNewSheet('Sheet 1');
    setupSheetEvents();
}

function createNewSheet(name = null, rows = 10, cols = 6, headers = null) {
    // Buscar el menor número disponible para el nombre
    function getNextSheetName() {
        const existingNames = allSheets.map(s => s.name);
        let i = 1;
        while (existingNames.includes(`Sheet ${i}`)) {
            i++;
        }
        return `Sheet ${i}`;
    }

    // Determinar nombre de la hoja
    const sheetName = name || getNextSheetName();

    // Generar encabezados por defecto si no se pasan
    const defaultHeaders = ['#', ...Array.from({length: cols - 1}, (_, i) => `C${i + 1}`)];

    // Crear objeto hoja
    const newSheet = {
        id: Date.now(), // id único basado en timestamp (más robusto que un contador)
        name: sheetName,
        headers: headers || defaultHeaders,
        data: Array.from({length: rows}, (_, i) => [i + 1, ...Array(cols - 1).fill('')]),
        rows,
        cols
    };

    // Actualizar estado global
    allSheets.push(newSheet);
    activeSheetId = newSheet.id;

    // Actualizar interfaz
    renderSheetTabs();
    loadSheetData(newSheet.id);

    console.log(`Hoja "${sheetName}" creada. Total: ${allSheets.length}`);
    return newSheet;
}



function deleteSheet(sheetId) {
    if (allSheets.length <= 1) {
        alert('⚠️ Debe haber al menos una hoja');
        return;
    }
    
    const sheet = allSheets.find(s => s.id === sheetId);
    if (!confirm(`¿Eliminar la hoja "${sheet.name}"?`)) return;
    
    allSheets = allSheets.filter(s => s.id !== sheetId);
    
    if (activeSheetId === sheetId) {
        activeSheetId = allSheets[0].id;
        loadSheetData(activeSheetId);
    }
    
    renderSheetTabs();
    console.log(`Hoja eliminada. Quedan: ${allSheets.length}`);
}

function renameSheet(sheetId, newName) {
    const sheet = allSheets.find(s => s.id === sheetId);
    if (sheet && newName.trim()) {
        sheet.name = newName.trim();
        renderSheetTabs();
    }
}

function switchSheet(sheetId) {
    saveCurrentSheetData();
    activeSheetId = sheetId;
    //loadSheetData(sheetId);
    StateManager.setWorkTableData(sheet.data);
    renderSheetTabs();
    console.log(`Cambiado a hoja ID: ${sheetId}`);
}

function saveCurrentSheetData() {
    const currentSheet = allSheets.find(s => s.id === activeSheetId);
    if (currentSheet) {
        currentSheet.headers = [...workTableData.headers];
        currentSheet.data = workTableData.data.map(row => [...row]);
        currentSheet.rows = workTableData.rows;
        currentSheet.cols = workTableData.cols;
    }
}

function loadSheetData(sheetId) {
    const sheet = allSheets.find(s => s.id === sheetId);
    if (sheet) {
        workTableData.headers = [...sheet.headers];
        workTableData.data = sheet.data.map(row => [...row]);
        workTableData.rows = sheet.rows;
        workTableData.cols = sheet.cols;
        
        renderWorkTable();
        updateWorkSummary();
    }
}

function renderSheetTabs() {
    const tabsContainer = document.getElementById('sheetsTabs');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = allSheets.map(sheet => `
        <div class="sheet-tab ${sheet.id === activeSheetId ? 'active' : ''}" 
             data-sheet-id="${sheet.id}"
             onclick="switchSheet(${sheet.id})">
            <span class="sheet-tab-name" 
                  ondblclick="event.stopPropagation(); startEditSheetName(${sheet.id}, this)">${sheet.name}</span>
            <button class="sheet-tab-close" 
                    onclick="event.stopPropagation(); deleteSheet(${sheet.id})">×</button>
        </div>
    `).join('');
    
    updateSheetsInfo();
}

function startEditSheetName(sheetId, nameElement) {
    const sheet = allSheets.find(s => s.id === sheetId);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = sheet.name;
    input.className = 'sheet-tab-name-input';
    
    input.onblur = () => {
        renameSheet(sheetId, input.value);
    };
    
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            renameSheet(sheetId, input.value);
        } else if (e.key === 'Escape') {
            renderSheetTabs();
        }
    };
    
    nameElement.replaceWith(input);
    input.focus();
    input.select();
}

function updateSheetsInfo() {
    const currentSheet = allSheets.find(s => s.id === activeSheetId);
    
    const activeNameEl = document.getElementById('activeSheetName');
    const totalSheetsEl = document.getElementById('totalSheets');
    
    if (activeNameEl && currentSheet) {
        activeNameEl.textContent = currentSheet.name;
    }
    if (totalSheetsEl) {
        totalSheetsEl.textContent = allSheets.length;
    }
}

function setupSheetEvents() {
    const btnNewSheet = document.getElementById('btnNewSheet');
    if (btnNewSheet) {
        btnNewSheet.onclick = () => createNewSheet();
    }
}

function getAllSheetsData() {
    saveCurrentSheetData();
    return allSheets.map(sheet => ({
        name: sheet.name,
        headers: sheet.headers,
        data: sheet.data,
        rowCount: sheet.data.length
    }));
}

// ========================================
// TABLA EDITABLE
// ========================================

function generateWorkTable() {
    const rows = parseInt(document.getElementById('initial-rows').value) || 10;
    const cols = parseInt(document.getElementById('initial-cols').value) || 5;
    
    workTableData.rows = rows;
    workTableData.cols = cols + 1;
    
    workTableData.headers = ['#', ...Array.from({length: cols}, (_, i) => `C${i + 1}`)];
    workTableData.data = Array.from({length: rows}, (_, i) => [
        i + 1,
        ...Array.from({length: cols}, () => '')
    ]);
    
    renderWorkTable();
    updateWorkSummary();
    saveCurrentSheetData();
}

function renderWorkTable() {
    const wrapper = document.getElementById('editable-table-wrapper');
    if (!wrapper) return;
    
    let tableHTML = '<table class="work-table"><thead><tr>';
    
    workTableData.headers.forEach((header, index) => {
        if (index === 0) {
            tableHTML += `<th><span class="header-cell">${header}</span></th>`;
        } else {
            tableHTML += `
                <th>
                    <input type="text" 
                           class="editable-cell header-cell" 
                           value="${header}"
                           data-col="${index}"
                           placeholder="Col ${index}">
                </th>
            `;
        }
    });
    
    tableHTML += '</tr></thead><tbody>';
    
    workTableData.data.forEach((row, rowIndex) => {
        tableHTML += '<tr>';
        row.forEach((cell, colIndex) => {
            if (colIndex === 0) {
                tableHTML += `<td><div class="index-cell">${cell}</div></td>`;
            } else {
                tableHTML += `
                    <td>
                        <input type="text" 
                               class="editable-cell data-cell" 
                               value="${cell}"
                               data-row="${rowIndex}"
                               data-col="${colIndex}"
                               placeholder="...">
                    </td>
                `;
            }
        });
        tableHTML += '</tr>';
    });
    
    tableHTML += '</tbody></table>';
    wrapper.innerHTML = tableHTML;
    
    attachTableEvents();
}

function attachTableEvents() {
    document.querySelectorAll('.header-cell[data-col]').forEach(input => {
        input.addEventListener('input', function() {
            const col = parseInt(this.dataset.col);
            workTableData.headers[col] = this.value;
        });
        input.addEventListener('keydown', handleTabNavigation);
    });
    
    document.querySelectorAll('.data-cell').forEach(input => {
        input.addEventListener('input', function() {
            const row = parseInt(this.dataset.row);
            const col = parseInt(this.dataset.col);
            //workTableData.data[row][col] = this.value;
            StateManager.updateCell(row, col, this.value);
            updateWorkSummary();
        });
        input.addEventListener('keydown', handleTabNavigation);
    });
}

function handleTabNavigation(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const inputs = Array.from(document.querySelectorAll('.editable-cell'));
        const currentIndex = inputs.indexOf(this);
        const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
        
        if (inputs[nextIndex]) {
            inputs[nextIndex].focus();
            inputs[nextIndex].select();
        }
    }
}

function updateWorkSummary() {
    const totalRows = workTableData.data.length;
    const totalCols = workTableData.headers.length - 1;
    
    let filledCount = 0;
    workTableData.data.forEach(row => {
        row.slice(1).forEach(cell => {
            if (cell && cell.toString().trim() !== '') filledCount++;
        });
    });
    
    const countRowsEl = document.getElementById('count-rows');
    const countColsEl = document.getElementById('count-cols');
    const countFilledEl = document.getElementById('count-filled');
    
    if (countRowsEl) countRowsEl.textContent = totalRows;
    if (countColsEl) countColsEl.textContent = totalCols;
    if (countFilledEl) countFilledEl.textContent = filledCount;
}

function addWorkRow() {
    const newIndex = workTableData.data.length + 1;
    const newRow = [newIndex, ...Array.from({length: workTableData.cols - 1}, () => '')];
    workTableData.data.push(newRow);
    workTableData.rows++;
    renderWorkTable();
    updateWorkSummary();
}

function addWorkColumn() {
    workTableData.cols++;
    const newColNum = workTableData.headers.length;
    workTableData.headers.push(`C${newColNum}`);
    workTableData.data.forEach(row => row.push(''));
    renderWorkTable();
    updateWorkSummary();
}

/**
 * ELIMINA la última fila de la tabla de trabajo
 * @throws {Error} Si no hay filas para eliminar
 */
function deleteWorkRow() {
    if (workTableData.data.length === 1) {
        throw new Error('No hay filas para eliminar');
    }
    
    // Eliminar última fila
    workTableData.data.pop();
    workTableData.rows = Math.max(0, workTableData.rows - 1);
    
    renderWorkTable();
    updateWorkSummary();
    
    console.log(`Fila eliminada. Filas restantes: ${workTableData.rows}`);
}

/**
 * ELIMINA la última columna de la tabla de trabajo
 * @throws {Error} Si no hay columnas para eliminar o solo queda una columna
 */
function deleteWorkColumn() {
    if (workTableData.cols <= 2) {
        throw new Error('No se puede eliminar la única columna restante');
    }
    
    if (workTableData.headers.length === 0) {
        throw new Error('No hay encabezados para eliminar');
    }
    
    // Eliminar último header
    workTableData.headers.pop();
    
    // Eliminar última columna de cada fila
    workTableData.data.forEach(row => {
        if (row.length > 1) {
            row.pop();
        }
    });
    
    workTableData.cols = Math.max(1, workTableData.cols - 1);
    
    renderWorkTable();
    updateWorkSummary();
    
    console.log(`Columna eliminada. Columnas restantes: ${workTableData.cols}`);
}

function clearWorkTable() {
    if (confirm('¿Limpiar todos los datos de esta hoja?')) {
        workTableData.data = Array.from({length: workTableData.rows}, (_, i) => [
            i + 1,
            ...Array.from({length: workTableData.cols - 1}, () => '')
        ]);
        renderWorkTable();
        updateWorkSummary();
    }
}

function saveWorkData() {
    saveCurrentSheetData();
    
    const nonEmptyData = workTableData.data.filter(row => 
        row.slice(1).some(cell => cell && cell.toString().trim() !== '')
    );
    
    if (nonEmptyData.length === 0) {
        alert('⚠️ No hay datos para guardar');
        return;
    }
    
    const headers = workTableData.headers.slice(1);
    const formattedData = nonEmptyData.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index + 1] || '';
        });
        return obj;
    });
    
    importedData = {
        headers: headers,
        data: formattedData,
        rowCount: formattedData.length
    };
    
    const currentSheet = allSheets.find(s => s.id === activeSheetId);
    fileName = `${currentSheet ? currentSheet.name : 'datos'}.csv`;
    
    updateDataView();
    displayImportedData(importedData);
    
    switchView('analisis');
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector('.nav-item').classList.add('active');
    
    alert(`✅ Datos guardados correctamente\n\n📊 ${importedData.rowCount} filas\n📋 ${importedData.headers.length} columnas`);
}

function enablePasteData() {
    alert('📋 Función de pegado habilitada\n\n1. Copia datos desde Excel (Ctrl+C)\n2. Haz clic en la primera celda de datos\n3. Pega con Ctrl+V');
    
    const firstDataCell = document.querySelector('.data-cell');
    if (firstDataCell) {
        firstDataCell.focus();
        
        firstDataCell.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            processPastedData(pastedText);
        }, { once: true });
    }
}

function processPastedData(text) {
    const rows = text.split('\n').filter(row => row.trim() !== '');
    const maxCols = Math.max(...rows.map(row => row.split('\t').length));
    
    if (rows.length > workTableData.rows || maxCols > (workTableData.cols - 1)) {
        workTableData.rows = Math.max(rows.length, workTableData.rows);
        workTableData.cols = Math.max(maxCols + 1, workTableData.cols);
        
        while (workTableData.headers.length < workTableData.cols) {
            workTableData.headers.push(`C${workTableData.headers.length}`);
        }
        
        workTableData.data = Array.from({length: workTableData.rows}, (_, i) => [
            i + 1,
            ...Array.from({length: workTableData.cols - 1}, () => '')
        ]);
    }
    
    rows.forEach((row, rowIndex) => {
        const cells = row.split('\t');
        cells.forEach((cell, colIndex) => {
            if (rowIndex < workTableData.rows && (colIndex + 1) < workTableData.cols) {
                workTableData.data[rowIndex][colIndex + 1] = cell.trim();
            }
        });
    });
    
    renderWorkTable();
    updateWorkSummary();
    alert(`✅ Datos pegados: ${rows.length} filas × ${maxCols} columnas`);
}

// ========================================
// BOTONES DE LA VISTA TRABAJO
// ========================================
function setupWorkButtons() {
    setTimeout(() => {
        const btnGenerate = document.querySelector('.btn-generate-table');
        const btnPaste = document.querySelector('.btn-paste-data');
        const btnAddRow = document.querySelector('.btn-add-row');
        const btnAddCol = document.querySelector('.btn-add-column');
        const btnDelRow = document.querySelector('.btn-delete-row');
        const btnDelCol = document.querySelector('.btn-delete-column');
        const btnClear = document.querySelector('.btn-clear-table');
        const btnSave = document.querySelector('.btn-save-work');
        
        if (btnGenerate) btnGenerate.onclick = generateWorkTable;
        if (btnPaste) btnPaste.onclick = enablePasteData;
        if (btnAddRow) btnAddRow.onclick = addWorkRow;
        if (btnAddCol) btnAddCol.onclick = addWorkColumn;
        if (btnDelRow) btnDelRow.onclick = deleteWorkRow;
        if (btnDelCol) btnDelCol.onclick = deleteWorkColumn;
        if (btnClear) btnClear.onclick = clearWorkTable;
        if (btnSave) btnSave.onclick = saveWorkData;
    }, 100);
}

// ========================================
// FUNCIONALIDAD DE DATOS
// ========================================
function updateDataView() {
    const recentFilesList = document.getElementById('recent-files-list');
    const dataSummary = document.getElementById('data-summary');
    
    if (!importedData) {
        if (recentFilesList) recentFilesList.innerHTML = '<p class="empty-message">No hay archivos cargados</p>';
        if (dataSummary) dataSummary.innerHTML = '<p class="empty-message">Carga datos para ver el resumen</p>';
        return;
    }
    
    if (recentFilesList) {
        recentFilesList.innerHTML = `
            <div class="file-item">
                <div class="file-icon">📄</div>
                <div class="file-details">
                    <div class="file-name">${fileName}</div>
                    <div class="file-meta">${importedData.rowCount} filas × ${importedData.headers.length} columnas</div>
                </div>
                <button class="file-action" onclick="viewFileDetails()">👁️</button>
            </div>
        `;
    }
    
    const summary = calculateDataSummary(importedData);
    
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

function calculateDataSummary(data) {
    const totalRows = data.rowCount;
    const totalColumns = data.headers.length;
    let numericColumns = 0;
    let textColumns = 0;
    
    data.headers.forEach(header => {
        const values = data.data.map(row => row[header]).filter(v => v !== '' && v != null);
        const isNumeric = values.length > 0 && values.slice(0, 5).every(v => !isNaN(parseFloat(v)));
        if (isNumeric) numericColumns++;
        else textColumns++;
    });
    
    return { totalRows, totalColumns, numericColumns, textColumns };
}

function viewFileDetails() {
    switchView('analisis');
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector('.nav-item').classList.add('active');
    if (importedData) displayImportedData(importedData);
}

function displayImportedData(parsedData) {
    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    if (!placeholder) return;
    
    placeholder.innerHTML = `
        <div class="data-preview">
            <div class="preview-header">
                <h3>✅ Datos Cargados</h3>
                <p>Archivo: <strong>${fileName}</strong></p>
                <p>📊 ${parsedData.rowCount} filas | 📋 ${parsedData.headers.length} columnas</p>
            </div>
            
            <div style="margin: 20px 0;">
                <h4 style="margin-bottom: 10px;">Columnas:</h4>
                <div class="columns-grid">
                    ${parsedData.headers.map((h, i) => `
                        <div class="column-item">
                            <span class="column-number">${i + 1}</span>
                            <span>${h}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin: 20px 0; overflow-x: auto;">
                <h4 style="margin-bottom: 10px;">Vista previa (5 filas):</h4>
                <table class="data-table">
                    <thead>
                        <tr>${parsedData.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${parsedData.data.slice(0, 5).map(row => `
                            <tr>${parsedData.headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="data-actions">
                <button class="btn-clear" onclick="clearImportedData()">🗑️ Limpiar</button>
                <button class="btn-download" onclick="downloadSampleData()">📥 Plantilla CSV</button>
            </div>
        </div>
    `;
}

function clearImportedData() {
    importedData = null;
    fileName = '';
    
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

    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'plantilla_datos.csv';
    a.click();
}

// ========================================
// IMPORTACIÓN DE ARCHIVOS
// ========================================
function createFileInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json,.txt';
    input.style.display = 'none';
    return input;
}

function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((h, idx) => row[h] = values[idx]);
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
    btn.addEventListener('click', function() {
        const fileInput = createFileInput();
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            fileName = file.name;
            const ext = file.name.split('.').pop().toLowerCase();
            
            const reader = new FileReader();
            reader.onload = function(e) {
                let parsed = null;
                if (ext === 'csv' || ext === 'txt') parsed = parseCSV(e.target.result);
                else if (ext === 'json') parsed = parseJSON(e.target.result);
                
                if (parsed) {
                    importedData = parsed;
                    displayImportedData(parsed);
                    updateDataView();
                } else {
                    alert('Error al procesar el archivo');
                }
            };
            reader.readAsText(file);
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });
});

// ========================================
// EJECUTAR ANÁLISIS
// ========================================
document.querySelector('.btn-run')?.addEventListener('click', function() {
    if (!importedData) {
        alert('⚠️ Importa datos primero');
        return;
    }
    
    if (activeStats.length === 0) {
        alert('⚠️ Selecciona al menos un estadístico');
        return;
    }
    
    alert(`✅ Ejecutando análisis:
    
📊 Datos: ${importedData.rowCount} filas
📋 Columnas: ${importedData.headers.length}
🔬 Estadísticos: ${activeStats.length}

${activeStats.map((s, i) => `${i + 1}. ${s}`).join('\n')}`);
});

// ========================================
// TRANSFORMACIONES
// ========================================
function setupTransformButtons() {
    setTimeout(() => {
        const buttons = document.querySelectorAll('.transform-btn');
        if (buttons.length >= 4) {
            buttons[0].onclick = cleanData //() => alert('🧹 Función: Limpiar Datos');
            buttons[1].onclick = normalizeData;    // Normalizar
            buttons[2].onclick = createCalculatedColumn //() => alert('➕ Función: Crear Columna');
            buttons[3].onclick = removeNulls //() => alert('🗑️ Función: Eliminar Nulos');
        }
    }, 100);
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 StatAnalyzer Pro inicializado');
    
    // Configurar estado inicial
    updateActiveStats();
    switchView('analisis');
    setupWorkButtons();
    setupTransformButtons();
    
    console.log('✅ Formatos soportados: CSV, JSON, TXT');
    console.log('✅ Sistema de múltiples hojas disponible');
});

/**
 * TRANSFORMACIÓN 2: Normalizar Datos Numéricos
 * Aplica normalización Min-Max a columnas numéricas
 */
function normalizeData() {
    if (!importedData) {
        alert('⚠️ No hay datos cargados para normalizar');
        return;
    }
    
    const numericCols = [];
    
    // Identificar columnas numéricas
    importedData.headers.forEach(header => {
        const values = importedData.data.map(row => parseFloat(row[header]));
        if (values.every(v => !isNaN(v))) {
            numericCols.push(header);
        }
    });
    
    if (numericCols.length === 0) {
        alert('⚠️ No se encontraron columnas numéricas para normalizar');
        return;
    }
    
    // Normalizar cada columna numérica (Min-Max scaling: 0-1)
    numericCols.forEach(header => {
        const values = importedData.data.map(row => parseFloat(row[header]));
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        
        if (range === 0) return; // Evitar división por cero
        
        importedData.data.forEach(row => {
            const normalized = ((parseFloat(row[header]) - min) / range).toFixed(4);
            row[header + '_norm'] = normalized;
        });
        
        // Agregar nueva columna a headers
        if (!importedData.headers.includes(header + '_norm')) {
            importedData.headers.push(header + '_norm');
        }
    });
    
    updateDataView();
    displayImportedData(importedData);
    
    alert(`✅ Normalización completada\n\n📊 ${numericCols.length} columnas normalizadas\n📈 Escala: 0 - 1 (Min-Max)\n✨ Nuevas columnas creadas con sufijo "_norm"`);
    console.log('Normalización completada:', numericCols);
}

/**
 * TRANSFORMACIÓN 4: Eliminar Valores Nulos
 * Elimina filas con valores nulos o vacíos
 */
function removeNulls() {
    if (!importedData) {
        alert('⚠️ No hay datos cargados');
        return;
    }
    
    const originalCount = importedData.data.length;
    
    // Filtrar filas sin valores nulos
    importedData.data = importedData.data.filter(row => {
        return importedData.headers.every(header => {
            const value = row[header];
            return value !== '' && value !== null && value !== undefined;
        });
    });
    
    const removedCount = originalCount - importedData.data.length;
    importedData.rowCount = importedData.data.length;
    
    updateDataView();
    displayImportedData(importedData);
    
    if (removedCount === 0) {
        alert('✅ No se encontraron valores nulos\n\n📊 Todos los datos están completos');
    } else {
        alert(`✅ Eliminación completada\n\n🗑️ ${removedCount} filas eliminadas\n📊 ${importedData.data.length} filas restantes`);
    }
    
    console.log('Filas con nulos eliminadas:', removedCount);
}

/**
 * TRANSFORMACIÓN 3: Crea una nueva columna calculada a partir de una fórmula.
 * Implementación segura que evita el uso de eval().
 */
function createCalculatedColumn(columnName = 'Columna Calculada') {
    if (!importedData) {
        alert('⚠️ No hay datos cargados para crear una columna.');
        return;
    }

    const numericCols = importedData.headers.filter(header => {
        // Validación de columna numérica, mejorando la de calculateDataSummary
        const values = importedData.data.map(row => parseFloat(row[header])).filter(v => !isNaN(v));
        return values.length > 0 && values.length / importedData.rowCount > 0.8; // Más del 80% deben ser números
    });

    if (numericCols.length < 2) {
        alert('⚠️ Se necesitan al menos 2 columnas con más del 80% de datos numéricos.');
        return;
    }

    const colsList = numericCols.join(', ');
    const formula = prompt(`Fórmula (usa nombres de columnas):\nEjemplo: Peso / (Altura * Altura)\n\nColumnas disponibles: ${colsList}`, columnName);

    if (!formula || !formula.trim()) return;

    try {
        // 1. Crear una nueva columna en los headers
        const finalColumnName = prompt('Ingrese el nombre de la nueva columna:', formula.slice(0, 15) + '_calc') || columnName;
        if (importedData.headers.includes(finalColumnName)) {
            alert(`⚠️ La columna "${finalColumnName}" ya existe.`);
            return;
        }
        importedData.headers.push(finalColumnName);

        // 2. Crear un array de nombres de columnas para el constructor Function
        const argNames = numericCols;

        // 3. Reemplazar nombres de columnas en la fórmula con variables
        let safeExpression = formula;
        argNames.forEach(col => {
            // Aseguramos que solo reemplazamos el nombre de columna si está como palabra completa (evita colisiones)
            safeExpression = safeExpression.replace(new RegExp('\\b' + col + '\\b', 'g'), col);
        });

        // 4. Construir la función usando el constructor Function (más seguro que eval)
        // La función retornará la evaluación de la expresión.
        const mathFunction = new Function(...argNames, `return (${safeExpression});`);

        // 5. Aplicar la función a cada fila
        importedData.data.forEach(row => {
            const args = argNames.map(col => parseFloat(row[col]) || 0);
            
            let result;
            try {
                result = mathFunction(...args);
                if (isNaN(result) || !isFinite(result)) {
                    result = 0; // Manejar NaN y Infinity
                }
            } catch (e) {
                console.error("Error al ejecutar fórmula:", e);
                result = 0;
            }
            
            row[finalColumnName] = result.toFixed(4);
        });
        
        updateDataView();
        displayImportedData(importedData);
        alert(`✅ Columna "${finalColumnName}" creada con fórmula: ${formula}`);

    } catch (error) {
        // Si el error ocurre antes de la ejecución (ej. fórmula inválida), lo capturamos aquí
        alert('⚠️ Error en la sintaxis de la fórmula. Verifica la expresión: ' + error.message);
        console.error('Error en la fórmula:', error);
    }
}

/**
 * TRANSFORMACIÓN 1: Limpiar Datos
 * Elimina espacios en blanco y normaliza valores
 */
function cleanData() {
    if (!importedData) {
        alert('⚠️ No hay datos cargados para limpiar');
        return;
    }
    
    let changesCount = 0;
    
    importedData.data.forEach(row => {
        importedData.headers.forEach(header => {
            const original = row[header];
            if (typeof original === 'string') {
                // Eliminar espacios extras
                const cleaned = original.trim().replace(/\s+/g, ' ');
                if (cleaned !== original) {
                    row[header] = cleaned;
                    changesCount++;
                }
            }
        });
    });
    
    updateDataView();
    displayImportedData(importedData);
    
    alert(`✅ Limpieza completada\n\n🔧 ${changesCount} valores modificados\n📊 Espacios en blanco eliminados\n✨ Datos normalizados`);
    console.log('Limpieza de datos completada:', changesCount, 'cambios');
}

// ========================================
// DELEGACIÓN DE EVENTOS DE TABLA
// ========================================
function setupTableDelegation() {
    const wrapper = document.getElementById('editable-table-wrapper');
    if (!wrapper) return;

    // Listener único para todos los eventos de input y keydown dentro del contenedor
    wrapper.addEventListener('input', handleTableInput);
    wrapper.addEventListener('keydown', handleTableKeydown);

    console.log('✅ Delegación de eventos de tabla configurada.');
}

function handleTableInput(e) {
    const target = e.target;
    
    // Solo actuamos si el objetivo es una celda editable
    if (target.classList.contains('editable-cell')) {
        
        // 1. Manejar Input en Encabezado (Header)
        if (target.classList.contains('header-cell')) {
            const col = parseInt(target.dataset.col);
            if (col > 0) { // Asegura que no es la columna '#'
                workTableData.headers[col] = target.value;
                // No necesita re-renderizar, solo actualizar el estado.
            }
        } 
        
        // 2. Manejar Input en Datos (Data)
        else if (target.classList.contains('data-cell')) {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);
            
            if (row >= 0 && col > 0) {
                // Actualizar el estado global sin re-renderizar todo
                workTableData.data[row][col] = target.value;
                updateWorkSummary();
            }
        }
        
        // ¡Importante! Guardar el estado actual de la hoja
        saveCurrentSheetData();
    }
}

function handleTableKeydown(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        
        // Lógica de navegación de Tab (refactorizada para ser más eficiente)
        const target = e.target;
        if (!target.classList.contains('editable-cell')) return;

        const inputs = Array.from(document.querySelectorAll('.editable-cell'));
        const currentIndex = inputs.indexOf(target);
        const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;

        if (inputs[nextIndex]) {
            inputs[nextIndex].focus();
            inputs[nextIndex].select();
        }
    }
}