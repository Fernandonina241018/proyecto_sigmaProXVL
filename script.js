// ========================================
// script.js - StatAnalyzer Pro
// Versión refactorizada: estado centralizado en StateManager
// ========================================

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
            
            // Cargar tabla si vamos a la vista de trabajo
            if (targetView === 'trabajo') {
                renderWorkTable();
                updateWorkSummary();
            }
        }
    });
});

// ========================================
// ACORDEÓN DEL MENÚ LATERAL
// ========================================

document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isActive = this.classList.contains('active');
        
        // Cerrar todos
        document.querySelectorAll('.accordion-header').forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('active');
        });
        
        // Abrir el clicado si no estaba activo
        if (!isActive) {
            this.classList.add('active');
            content.classList.add('active');
        }
    });
});

// ========================================
// GESTIÓN DE ESTADÍSTICOS ACTIVOS (usando StateManager)
// ========================================

function updateActiveStatsUI() {
    const stats = StateManager.getActiveStats();
    const container = document.getElementById('activeStatsContainer');
    const countEl = document.getElementById('statsCount');
    const emptyEl = document.getElementById('emptyState');

    if (!container) return;

    container.innerHTML = '';

    if (stats.length === 0) {
        emptyEl.style.display = 'block';
        countEl.textContent = '0 estadísticos activos';
    } else {
        emptyEl.style.display = 'none';
        countEl.textContent = `${stats.length} estadístico${stats.length !== 1 ? 's' : ''} activo${stats.length !== 1 ? 's' : ''}`;

        stats.forEach(name => {
            const chip = document.createElement('div');
            chip.className = 'stat-chip';
            chip.setAttribute('data-stat-name', name);
            chip.innerHTML = `
                <span>${name}</span>
                <button class="chip-remove" onclick="removeActiveStat('${name}')">×</button>
            `;
            container.appendChild(chip);
        });
    }
}

function removeActiveStat(name) {
    StateManager.removeActiveStat(name);
    // El listener se encarga de actualizar la UI
}

// Selección de estadísticos desde menú
document.querySelectorAll('.menu-option').forEach(option => {
    option.addEventListener('click', function() {
        const statName = this.textContent.trim();
        
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
            StateManager.removeActiveStat(statName);
        } else {
            this.classList.add('selected');
            StateManager.addActiveStat(statName);
        }
    });
});

// ========================================
// TABLA EDITABLE - SIN workTableData
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

    // Encabezados
    sheet.headers.forEach((header, colIndex) => {
        if (colIndex === 0) {
            html += `<th><span class="header-cell">${header}</span></th>`;
        } else {
            html += `
                <th>
                    <input type="text" 
                           class="editable-cell header-cell" 
                           value="${escapeHtml(header)}"
                           data-col="${colIndex}"
                           data-type="header">
                </th>
            `;
        }
    });

    html += '</tr></thead><tbody>';

    // Datos
    sheet.data.forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach((cell, colIndex) => {
            if (colIndex === 0) {
                html += `<td><div class="index-cell">${cell}</div></td>`;
            } else {
                html += `
                    <td>
                        <input type="text" 
                               class="editable-cell data-cell" 
                               value="${escapeHtml(cell || '')}"
                               data-row="${rowIndex}"
                               data-col="${colIndex}"
                               data-type="data">
                    </td>
                `;
            }
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    wrapper.innerHTML = html;

    attachTableInputListeners();
}

function attachTableInputListeners() {
    const wrapper = document.getElementById('editable-table-wrapper');
    if (!wrapper) return;

    wrapper.addEventListener('input', (e) => {
        const target = e.target;
        if (!target.classList.contains('editable-cell')) return;

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
                StateManager.updateCell(row, col, value);
            }
        }
    });

    // Navegación con Tab
    wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const inputs = Array.from(wrapper.querySelectorAll('.editable-cell'));
            const current = inputs.indexOf(e.target);
            const next = e.shiftKey ? current - 1 : current + 1;

            if (inputs[next]) {
                inputs[next].focus();
                inputs[next].select();
            }
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
    const totalCols = sheet.headers.length - 1; // sin #

    let filledCount = 0;
    sheet.data.forEach(row => {
        row.slice(1).forEach(cell => {
            if (cell && cell.toString().trim() !== '') filledCount++;
        });
    });

    document.getElementById('count-rows').textContent = totalRows;
    document.getElementById('count-cols').textContent = totalCols;
    document.getElementById('count-filled').textContent = filledCount;
}

// ========================================
// BOTONES DE LA VISTA TRABAJO
// ========================================

function setupWorkButtons() {
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
    const btnNewSheet = document.getElementById('btnNewSheet');
    if (btnNewSheet) {
        btnNewSheet.onclick = () => {
            StateManager.createSheet();  // crea hoja con nombre automático
            renderWorkTable();
            updateWorkSummary();
            updateSheetsInfo();           // si tienes esta función para pestañas
            console.log("Nueva hoja creada");
        };
    }
}

function generateWorkTable() {
    const rows = parseInt(document.getElementById('initial-rows')?.value) || 10;
    const cols = parseInt(document.getElementById('initial-cols')?.value) || 5;

    StateManager.createSheet(null, rows, cols + 1); // +1 por columna #
    renderWorkTable();
    updateWorkSummary();
}

function addWorkRow() {
    try {
        StateManager.addRow();
        renderWorkTable();
        updateWorkSummary();
    } catch (err) {
        alert('⚠️ ' + err.message);
    }
}

function addWorkColumn() {
    try {
        StateManager.addColumn();
        renderWorkTable();
        updateWorkSummary();
    } catch (err) {
        alert('⚠️ ' + err.message);
    }
}

function deleteWorkRow() {
    try {
        StateManager.deleteRow();
        renderWorkTable();
        updateWorkSummary();
    } catch (err) {
        alert('⚠️ ' + err.message);
    }
}

function deleteWorkColumn() {
    try {
        StateManager.deleteColumn();
        renderWorkTable();
        updateWorkSummary();
    } catch (err) {
        alert('⚠️ ' + err.message);
    }
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
    const sheet = StateManager.getActiveSheet();
    
    if (!sheet) {
        console.error("No hay hoja activa al intentar guardar");
        alert('⚠️ No hay hoja activa. Crea o selecciona una hoja primero.');
        return;
    }

    console.log("Hoja activa al guardar:", sheet.name, "Filas:", sheet.data.length);

    // Filtrar filas con datos reales (excluyendo columna #)
    const nonEmptyRows = sheet.data.filter(row => 
        row.slice(1).some(cell => cell && String(cell).trim() !== '')
    );

    if (nonEmptyRows.length === 0) {
        alert('⚠️ No hay datos válidos para guardar (todas las filas están vacías)');
        return;
    }

    const headers = sheet.headers.slice(1); // sin la columna #
    const formattedData = nonEmptyRows.map(row => {
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = row[i + 1] || '';
        });
        return obj;
    });

    const fileName = `${sheet.name || 'hoja_trabajo'}_${new Date().toISOString().slice(0,10)}.csv`;

    try {
        StateManager.setImportedData({
            headers: headers,
            data: formattedData,
            rowCount: formattedData.length
        }, fileName);

        console.log("Datos guardados en StateManager:", {
            rowCount: formattedData.length,
            columns: headers.length,
            fileName
        });

        // Actualizar vistas
        updateDataView();
        displayImportedData(StateManager.getImportedData());

        // Cambiar a pestaña análisis
        switchView('analisis');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelector('.nav-item').classList.add('active'); // la primera suele ser Análisis

        alert(`✅ Guardado exitoso!\n\n${formattedData.length} filas\n${headers.length} columnas\nNombre: ${fileName}`);
    } catch (err) {
        console.error("Error al guardar:", err);
        alert('❌ Error al guardar: ' + err.message);
    }
}

// ========================================
// PEGAR DESDE EXCEL (mantiene funcionalidad)
// ========================================

function enablePasteData() {
    alert('📋 Función de pegado habilitada\n\n1. Copia datos desde Excel (Ctrl+C)\n2. Haz clic en la primera celda de datos\n3. Pega con Ctrl+V');
    
    const wrapper = document.getElementById('editable-table-wrapper');
    if (!wrapper) return;

    const handlePaste = function(e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        processPastedData(pastedText);
        wrapper.removeEventListener('paste', handlePaste);
    };

    wrapper.addEventListener('paste', handlePaste, { once: true });
}

function processPastedData(text) {
    const rows = text.split('\n').filter(r => r.trim());
    if (rows.length === 0) return;

    const maxCols = Math.max(...rows.map(r => r.split('\t').length));

    // Si es necesario, expandir la hoja actual
    const sheet = StateManager.getActiveSheet();
    if (!sheet) return;

    let needMoreRows = rows.length > sheet.data.length;
    let needMoreCols = maxCols > (sheet.headers.length - 1);

    if (needMoreRows || needMoreCols) {
        // Nota: esto es simplificado; podrías pedir confirmación
        while (sheet.data.length < rows.length) {
            StateManager.addRow();
        }
        while ((sheet.headers.length - 1) < maxCols) {
            StateManager.addColumn();
        }
    }

    // Pegar datos (empezando desde fila 0, columna 1)
    rows.forEach((rowText, rowIdx) => {
        if (rowIdx >= sheet.data.length) return;
        const cells = rowText.split('\t');
        cells.forEach((cell, colIdx) => {
            const dataCol = colIdx + 1; // saltar columna #
            if (dataCol < sheet.headers.length) {
                StateManager.updateCell(rowIdx, dataCol, cell.trim());
            }
        });
    });

    renderWorkTable();
    updateWorkSummary();
    alert(`✅ Pegado completado: ${rows.length} filas × ${maxCols} columnas`);
}

// ========================================
// IMPORTACIÓN DE ARCHIVOS (actualizado)
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
    btn.addEventListener('click', function() {
        const fileInput = createFileInput();
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const fileName = file.name;
            const ext = file.name.split('.').pop().toLowerCase();
            
            const reader = new FileReader();
            reader.onload = function(e) {
                let parsed = null;
                if (ext === 'csv' || ext === 'txt') parsed = parseCSV(e.target.result);
                else if (ext === 'json') parsed = parseJSON(e.target.result);
                
                if (parsed) {
                    StateManager.setImportedData(parsed, fileName);
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
// ACTUALIZAR VISTA DE DATOS
// ========================================

function updateDataView() {
    const recentFilesList = document.getElementById('recent-files-list');
    const dataSummary = document.getElementById('data-summary');
    
    const imported = StateManager.getImportedData();
    
    if (!imported) {
        if (recentFilesList) recentFilesList.innerHTML = '<p class="empty-message">No hay archivos cargados</p>';
        if (dataSummary) dataSummary.innerHTML = '<p class="empty-message">Carga datos para ver el resumen</p>';
        return;
    }

    const fileName = StateManager.getState().fileName || 'datos importados';
    
    if (recentFilesList) {
        recentFilesList.innerHTML = `
            <div class="file-item">
                <div class="file-icon">📄</div>
                <div class="file-details">
                    <div class="file-name">${fileName}</div>
                    <div class="file-meta">${imported.rowCount} filas × ${imported.headers.length} columnas</div>
                </div>
                <button class="file-action" onclick="viewFileDetails()">👁️</button>
            </div>
        `;
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

// (mantén tus funciones calculateDataSummary, displayImportedData, clearImportedData, etc.)

// ========================================
// REACTIVIDAD CON STATEMANAGER
// ========================================

function setupStateListeners() {
    // Estadísticos activos
    StateManager.addEventListener('statsChange', updateActiveStatsUI);

    // Cambios en hojas o datos
    StateManager.addEventListener('sheetChange', () => {
        renderSheetTabs();
        renderWorkTable();
        updateWorkSummary();
        updateSheetsInfo();
    });

    StateManager.addEventListener('dataChange', () => {
        if (document.getElementById('view-datos').classList.contains('active')) {
            updateDataView();
        }
        // Podrías actualizar otras vistas aquí si es necesario
    });
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 StatAnalyzer Pro inicializado');

    // Inicializar StateManager primero (crítico)
    StateManager.init();

    // Configurar listeners reactivos
    setupStateListeners();

    // Estado inicial UI
    updateActiveStatsUI();
    switchView('analisis');
    setupWorkButtons();
    setupTransformButtons(); // mantén tus transformaciones

    // Render inicial si estamos en trabajo
    if (document.getElementById('view-trabajo').classList.contains('active')) {
        renderWorkTable();
        updateWorkSummary();
    }

    console.log('✅ Formatos soportados: CSV, JSON, TXT');
    console.log('✅ Estado centralizado activo');
    const btnRun = document.querySelector('.btn-run');
        if (btnRun) {
            btnRun.addEventListener('click', ejecutarAnalisis);
            console.log("Evento click asignado al botón Ejecutar Análisis");
        } else {
            console.warn("No se encontró el botón .btn-run en el DOM");
        }
});

function updateSheetsInfo() {
    const activeSheet = StateManager.getActiveSheet();
    const totalSheets = StateManager.getAllSheets().length;

    document.getElementById('activeSheetName').textContent = activeSheet ? activeSheet.name : '-';
    document.getElementById('totalSheets').textContent = totalSheets;
}

function renderSheetTabs() {
    const container = document.getElementById('sheetsTabs');
    if (!container) return;

    const sheets = StateManager.getAllSheets();
    container.innerHTML = sheets.map(sheet => `
        <div class="sheet-tab ${sheet.id === StateManager.getActiveSheet()?.id ? 'active' : ''}" 
             data-sheet-id="${sheet.id}"
             onclick="switchToSheet(${sheet.id})">
            <span class="sheet-tab-name">${sheet.name}</span>
            <button class="sheet-tab-close" onclick="event.stopPropagation(); deleteSheet(${sheet.id})">×</button>
        </div>
    `).join('');
}

function switchToSheet(sheetId) {
    StateManager.setActiveSheet(sheetId);
    renderWorkTable();
    updateWorkSummary();
    updateSheetsInfo();
}

function deleteSheet(sheetId) {
    if (!confirm('¿Eliminar esta hoja?')) return;
    StateManager.deleteSheet(sheetId);
    renderSheetTabs();
    renderWorkTable();
    updateWorkSummary();
}

function calculateDataSummary(data) {
    if (!data) {
        console.warn("calculateDataSummary: no hay datos");
        return { totalRows: 0, totalColumns: 0, numericColumns: 0, textColumns: 0 };
    }

    const headers = data.headers || [];
    const rows = data.data || [];
    const totalRows = data.rowCount || rows.length;
    const totalColumns = headers.length;

    let numericColumns = 0;
    let textColumns = 0;

    headers.forEach(header => {
        let numericCount = 0;
        let validCount = 0;

        rows.forEach(row => {
            const value = row[header];
            if (value !== undefined && value !== null && value !== '') {
                validCount++;
                const num = parseFloat(value);
                if (!isNaN(num) && isFinite(num)) {
                    numericCount++;
                }
            }
        });

        // Si hay suficientes valores válidos y la mayoría son numéricos → numérica
        if (validCount > 0 && numericCount / validCount >= 0.7) {
            numericColumns++;
        } else {
            textColumns++;
        }
    });

    return {
        totalRows,
        totalColumns,
        numericColumns,
        textColumns
    };
}

// Muestra la vista previa de los datos importados en la interfaz
function displayImportedData(data) {
    if (!data || !data.headers || !data.data) {
        console.warn("displayImportedData: datos inválidos");
        return;
    }

    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    if (!placeholder) return;

    const fileName = StateManager.getState().fileName || 'datos importados';

    let html = `
        <div class="data-preview">
            <div class="preview-header">
                <h3>✅ Datos Cargados</h3>
                <p>Archivo: <strong>${escapeHtml(fileName)}</strong></p>
                <p>📊 ${data.rowCount || data.data.length} filas | 📋 ${data.headers.length} columnas</p>
            </div>
            
            <div style="margin: 20px 0;">
                <h4 style="margin-bottom: 10px;">Columnas:</h4>
                <div class="columns-grid">
                    ${data.headers.map((h, i) => `
                        <div class="column-item">
                            <span class="column-number">${i + 1}</span>
                            <span>${escapeHtml(h)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin: 20px 0; overflow-x: auto; max-height: 300px;">
                <h4 style="margin-bottom: 10px;">Vista previa (primeras 5 filas):</h4>
                <table class="data-table">
                    <thead>
                        <tr>${data.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${data.data.slice(0, 5).map(row => `
                            <tr>${data.headers.map(h => `<td>${escapeHtml(row[h] || '')}</td>`).join('')}</tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="data-actions">
                <button class="btn-clear" onclick="clearImportedData()">🗑️ Limpiar Datos</button>
                <button class="btn-download" onclick="downloadSampleData()">📥 Descargar Plantilla CSV</button>
            </div>
        </div>
    `;

    placeholder.innerHTML = html;
}

function clearImportedData() {
    StateManager.clearImportedData();
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
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_datos.csv';
    link.click();
    URL.revokeObjectURL(link.href);
}

// ========================================
// EJECUTAR ANÁLISIS
// ========================================

function ejecutarAnalisis() {
    console.log("Botón Ejecutar Análisis presionado");

    const importedData = StateManager.getImportedData();
    const activeStats = StateManager.getActiveStats();

    console.log("Datos importados:", importedData);
    console.log("Estadísticos activos:", activeStats);

    // Validaciones
    if (!importedData || !importedData.data || importedData.data.length === 0) {
        alert('⚠️ Debes importar o guardar datos primero.\n\nVe a "Trabajo" o "Datos" y carga/guardar datos.');
        console.warn("No hay datos importados");
        return;
    }

    if (!activeStats || activeStats.length === 0) {
        alert('⚠️ Debes seleccionar al menos un estadístico descriptivo del menú lateral.');
        console.warn("No hay estadísticos seleccionados");
        return;
    }

    // Verificar que sean solo descriptivos (como en tu versión original)
    const estadisticosDescriptivos = [
        'Media Aritmética',
        'Mediana y Moda',
        'Desviación Estándar',
        'Varianza',
        'Percentiles',
        'Rango y Amplitud'
    ];

    const noImplementados = activeStats.filter(stat => !estadisticosDescriptivos.includes(stat));
    if (noImplementados.length > 0) {
        alert(`⚠️ Los siguientes estadísticos no están implementados:\n${noImplementados.join('\n')}\n\nSolo Estadística Descriptiva disponible por ahora.`);
        return;
    }

    // Mostrar cargando
    mostrarCargando();

    try {
        console.log("Iniciando análisis...");
        const resultados = EstadisticaDescriptiva.ejecutarAnalisis(importedData, activeStats);
        console.log("Resultados obtenidos:", resultados);

        ultimosResultados = resultados; // si tienes esta variable global

        const html = EstadisticaDescriptiva.generarHTML(resultados);
        mostrarResultados(html);

        switchView('analisis');
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelector('.nav-item').classList.add('active'); // Asumiendo que la primera es Análisis

        console.log("Análisis completado con éxito");
    } catch (error) {
        ocultarCargando();
        console.error("Error en análisis:", error);
        alert('❌ Error al ejecutar el análisis:\n\n' + error.message);
    }
}

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

function ocultarCargando() {
    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <h3>¡Comienza tu análisis!</h3>
            <p>Selecciona los estadísticos del menú lateral</p>
        `;
    }
}

function mostrarResultados(htmlResultados) {
    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    if (placeholder) {
        placeholder.innerHTML = htmlResultados;
    }
    ocultarCargando();
}

// ========================================
// MANTENER TUS OTRAS FUNCIONES
// ========================================

// Aquí mantienes:
// - updateDataView()
// - calculateDataSummary()
// - displayImportedData()
// - clearImportedData()
// - downloadSampleData()
// - normalizeData()
// - removeNulls()
// - createCalculatedColumn()
// - cleanData()
// - ejecutarAnalisis() (ya lo tienes)
// - mostrarCargando(), ocultarCargando(), mostrarResultados()
// etc.

console.log('✅ script.js refactorizado cargado');