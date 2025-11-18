// ========================================
// VARIABLES GLOBALES
// ========================================
let importedData = null;
let fileName = '';
let activeStats = [];

// ========================================
// NAVEGACIÓN DINÁMICA ENTRE VISTAS
// ========================================

/**
 * Cambia la vista activa en el workspace
 * @param {string} viewName - Nombre de la vista (analisis, datos, visualizacion, reportes)
 */
function switchView(viewName) {
    // Ocultar todas las vistas
    document.querySelectorAll('.workspace-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Mostrar la vista seleccionada
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
        // Remover clase active de todos
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        // Agregar clase active al clickeado
        this.classList.add('active');
        
        // Obtener el nombre de la vista desde el texto
        const viewName = this.textContent.trim().toLowerCase();
        
        // Mapear nombres españoles a IDs de vistas
        const viewMap = {
            'análisis': 'analisis',
            'datos': 'datos',
            'visualización': 'visualizacion',
            'reportes': 'reportes'
        };
        
        const targetView = viewMap[viewName];
        if (targetView) {
            switchView(targetView);
        }
        
        console.log('Navegación clickeada:', this.textContent);
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
        
        // Cerrar todos los acordeones
        accordionHeaders.forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('active');
        });
        
        // Si no estaba activo, abrirlo
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

/**
 * Actualiza el contador y visibilidad del mensaje vacío
 */
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

/**
 * Agrega un estadístico al panel de activos
 * @param {string} name - Nombre del estadístico
 */
function addActiveStat(name) {
    // Evitar duplicados
    if (activeStats.includes(name)) return;
    
    activeStats.push(name);
    
    // Crear el chip
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

/**
 * Elimina un estadístico por nombre
 * @param {string} name - Nombre del estadístico a eliminar
 */
function removeActiveStatByName(name) {
    // Eliminar del array
    activeStats = activeStats.filter(stat => stat !== name);
    
    // Eliminar el chip del DOM
    const chip = activeStatsContainer.querySelector(`[data-stat-name="${name}"]`);
    if (chip) {
        chip.remove();
    }
    
    // Desmarcar la opción en el menú
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
            // Deseleccionar
            this.classList.remove('selected');
            removeActiveStatByName(statName);
        } else {
            // Seleccionar
            this.classList.add('selected');
            addActiveStat(statName);
        }
    });
});

// ========================================
// FUNCIONALIDAD DE TRANSFORMACIONES DE DATOS
// ========================================

/**
 * Actualiza la vista de datos con información del archivo cargado
 */
function updateDataView() {
    const recentFilesList = document.getElementById('recent-files-list');
    const dataSummary = document.getElementById('data-summary');
    
    if (!importedData) {
        recentFilesList.innerHTML = '<p class="empty-message">No hay archivos cargados</p>';
        dataSummary.innerHTML = '<p class="empty-message">Carga datos para ver el resumen</p>';
        return;
    }
    
    // Actualizar lista de archivos recientes
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
    
    // Calcular estadísticas básicas
    const summary = calculateDataSummary(importedData);
    
    // Actualizar resumen estadístico
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
                <div class="summary-label">Columnas Numéricas</div>
                <div class="summary-value">${summary.numericColumns}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Columnas de Texto</div>
                <div class="summary-value">${summary.textColumns}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Valores Nulos</div>
                <div class="summary-value">${summary.nullCount}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Duplicados</div>
                <div class="summary-value">${summary.duplicates}</div>
            </div>
        </div>
    `;
}

/**
 * Calcula estadísticas básicas del dataset
 */
function calculateDataSummary(data) {
    const totalRows = data.rowCount;
    const totalColumns = data.headers.length;
    
    let numericColumns = 0;
    let textColumns = 0;
    let nullCount = 0;
    
    // Analizar cada columna
    data.headers.forEach(header => {
        const values = data.data.map(row => row[header]);
        
        // Contar nulos
        nullCount += values.filter(v => v === '' || v === null || v === undefined).length;
        
        // Determinar tipo de columna (verificar primeras 5 filas no nulas)
        const nonNullValues = values.filter(v => v !== '' && v !== null && v !== undefined).slice(0, 5);
        const isNumeric = nonNullValues.every(v => !isNaN(parseFloat(v)));
        
        if (isNumeric) {
            numericColumns++;
        } else {
            textColumns++;
        }
    });
    
    // Detectar duplicados (comparar filas completas)
    const duplicates = totalRows - new Set(data.data.map(row => JSON.stringify(row))).size;
    
    return {
        totalRows,
        totalColumns,
        numericColumns,
        textColumns,
        nullCount,
        duplicates
    };
}

/**
 * Muestra detalles completos del archivo en el workspace de análisis
 */
function viewFileDetails() {
    // Cambiar a vista de análisis
    switchView('analisis');
    
    // Cambiar tab de navegación
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector('.nav-item').classList.add('active');
    
    // Mostrar datos
    if (importedData) {
        displayImportedData(importedData);
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
 * TRANSFORMACIÓN 3: Crear Nueva Columna
 * Permite crear columnas calculadas
 */
function createNewColumn() {
    if (!importedData) {
        alert('⚠️ No hay datos cargados');
        return;
    }
    
    // Mostrar modal con opciones
    const columnName = prompt('📝 Nombre de la nueva columna:', 'Nueva_Columna');
    if (!columnName) return;
    
    // Verificar si ya existe
    if (importedData.headers.includes(columnName)) {
        alert('⚠️ Ya existe una columna con ese nombre');
        return;
    }
    
    // Opciones de creación
    const options = `Selecciona el tipo de columna a crear:

1. Columna con valor constante
2. Índice/ID secuencial
3. Combinación de columnas existentes
4. Cálculo matemático`;
    
    const choice = prompt(options, '1');
    
    switch(choice) {
        case '1':
            createConstantColumn(columnName);
            break;
        case '2':
            createIndexColumn(columnName);
            break;
        case '3':
            createCombinedColumn(columnName);
            break;
        case '4':
            createCalculatedColumn(columnName);
            break;
        default:
            alert('⚠️ Opción inválida');
            return;
    }
}

function createConstantColumn(columnName) {
    const value = prompt('Valor constante para todas las filas:', '0');
    if (value === null) return;
    
    importedData.headers.push(columnName);
    importedData.data.forEach(row => {
        row[columnName] = value;
    });
    
    updateDataView();
    displayImportedData(importedData);
    alert(`✅ Columna "${columnName}" creada con valor: ${value}`);
}

function createIndexColumn(columnName) {
    importedData.headers.push(columnName);
    importedData.data.forEach((row, index) => {
        row[columnName] = index + 1;
    });
    
    updateDataView();
    displayImportedData(importedData);
    alert(`✅ Columna "${columnName}" creada con índice secuencial`);
}

function createCombinedColumn(columnName) {
    const colsList = importedData.headers.join(', ');
    const cols = prompt(`Columnas a combinar (separadas por coma):\nDisponibles: ${colsList}`, '');
    if (!cols) return;
    
    const selectedCols = cols.split(',').map(c => c.trim());
    const separator = prompt('Separador:', ' ');
    
    importedData.headers.push(columnName);
    importedData.data.forEach(row => {
        const combined = selectedCols.map(col => row[col] || '').join(separator);
        row[columnName] = combined;
    });
    
    updateDataView();
    displayImportedData(importedData);
    alert(`✅ Columna "${columnName}" creada combinando: ${selectedCols.join(', ')}`);
}

function createCalculatedColumn(columnName) {
    const numericCols = importedData.headers.filter(header => {
        const values = importedData.data.map(row => parseFloat(row[header]));
        return values.every(v => !isNaN(v));
    });
    
    if (numericCols.length < 2) {
        alert('⚠️ Se necesitan al menos 2 columnas numéricas');
        return;
    }
    
    const colsList = numericCols.join(', ');
    const formula = prompt(`Fórmula (usa nombres de columnas):\nEjemplo: Peso / (Altura * Altura)\n\nColumnas disponibles: ${colsList}`, '');
    if (!formula) return;
    
    try {
        importedData.headers.push(columnName);
        importedData.data.forEach(row => {
            let expression = formula;
            
            // Reemplazar nombres de columnas por valores
            numericCols.forEach(col => {
                const value = parseFloat(row[col]) || 0;
                expression = expression.replace(new RegExp(col, 'g'), value);
            });
            
            // Evaluar expresión
            const result = eval(expression);
            row[columnName] = isNaN(result) ? 0 : result.toFixed(4);
        });
        
        updateDataView();
        displayImportedData(importedData);
        alert(`✅ Columna "${columnName}" creada con fórmula: ${formula}`);
    } catch (error) {
        alert('⚠️ Error en la fórmula: ' + error.message);
        console.error('Error en fórmula:', error);
    }
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
 * Conectar botones de transformación
 */
function setupTransformButtons() {
    // Esperar a que el DOM esté listo
    setTimeout(() => {
        const buttons = document.querySelectorAll('.transform-btn');
        if (buttons.length > 0) {
            buttons[0].onclick = cleanData;        // Limpiar Datos
            buttons[1].onclick = normalizeData;    // Normalizar
            buttons[2].onclick = createNewColumn;  // Crear Columna
            buttons[3].onclick = removeNulls;      // Eliminar Nulos
        }
    }, 100);
}

// ========================================
// IMPORTACIÓN DE DATOS
// ========================================

/**
 * Crea un input file dinámico para seleccionar archivos
 */
function createFileInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv, .xlsm, .xlsx, .xls, .json, .txt';
    input.style.display = 'none';
    return input;
}

/**
 * Procesa archivo CSV
 * @param {string} content - Contenido del archivo CSV
 */
function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return null;
    
    // Primera línea como encabezados
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Resto como datos
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index];
        });
        data.push(row);
    }
    
    return { headers, data, rowCount: data.length };
}

/**
 * Procesa archivo JSON
 * @param {string} content - Contenido del archivo JSON
 */
function parseJSON(content) {
    try {
        const data = JSON.parse(content);
        if (Array.isArray(data) && data.length > 0) {
            const headers = Object.keys(data[0]);
            return { headers, data, rowCount: data.length };
        }
        return null;
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return null;
    }
}

/**
 * Muestra los datos importados en el workspace
 * @param {Object} parsedData - Datos parseados
 */
function displayImportedData(parsedData) {
    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    
    placeholder.innerHTML = `
        <div class="data-preview">
            <div class="preview-header">
                <h3>✅ Datos Importados Exitosamente</h3>
                <p class="file-info">Archivo: <strong>${fileName}</strong></p>
                <p class="data-info">
                    📊 ${parsedData.rowCount} filas | 📋 ${parsedData.headers.length} columnas
                </p>
            </div>
            
            <div class="columns-list">
                <h4>Columnas detectadas:</h4>
                <div class="columns-grid">
                    ${parsedData.headers.map((header, index) => `
                        <div class="column-item">
                            <span class="column-number">${index + 1}</span>
                            <span class="column-name">${header}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="data-table-container">
                <h4>Vista previa (primeras 5 filas):</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            ${parsedData.headers.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${parsedData.data.slice(0, 5).map(row => `
                            <tr>
                                ${parsedData.headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="data-actions">
                <button class="btn-clear" onclick="clearImportedData()">🗑️ Limpiar datos</button>
                <button class="btn-download" onclick="downloadSampleData()">📥 Descargar plantilla CSV</button>
            </div>
        </div>
    `;
}

/**
 * Limpia los datos importados
 */
function clearImportedData() {
    importedData = null;
    fileName = '';
    
    const placeholder = document.querySelector('#view-analisis .content-placeholder');
    placeholder.innerHTML = `
        <h3>¡Comienza tu análisis!</h3>
        <p>Selecciona los estadísticos del menú lateral</p>
    `;
    
    // Actualizar también la vista de datos
    updateDataView();
}

/**
 * Descarga un archivo CSV de ejemplo
 */
function downloadSampleData() {
    const sampleCSV = `ID,Nombre,Edad,Peso,Altura,Grupo
1,Juan,25,70,1.75,A
2,María,30,65,1.68,B
3,Pedro,28,80,1.80,A
4,Ana,35,58,1.62,B
5,Luis,22,75,1.78,A
6,Carmen,27,62,1.65,B
7,José,32,85,1.82,A
8,Laura,29,60,1.70,B
9,Miguel,26,72,1.76,A
10,Sofia,31,67,1.72,B`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_datos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// ========================================
// BOTÓN IMPORTAR DATOS
// ========================================

document.querySelectorAll('.btn-import').forEach(btn => {
    btn.addEventListener('click', function() {
        const fileInput = createFileInput();
        
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            
            if (!file) {
                alert('No se seleccionó ningún archivo');
                return;
            }
            
            fileName = file.name;
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            // Validar tipo de archivo
            const validExtensions = ['csv', 'xlsx',  'xlsm', 'xls', 'json', 'txt'];
            if (!validExtensions.includes(fileExtension)) {
                alert('Formato de archivo no soportado. Use CSV, Excel, JSON o TXT');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const content = e.target.result;
                let parsedData = null;
                
                // Parsear según el tipo de archivo
                if (fileExtension === 'csv' || fileExtension === 'txt') {
                    parsedData = parseCSV(content);
                } else if (fileExtension === 'json') {
                    parsedData = parseJSON(content);
                } else if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'xlsm') {
                    alert('Para archivos Excel, recomendamos convertirlos a CSV primero.\nEn Excel: Archivo > Guardar como > CSV (delimitado por comas)');
                    return;
                }
                
                if (parsedData) {
                    importedData = parsedData;
                    displayImportedData(parsedData);
                    updateDataView(); // Actualizar también la vista de datos
                    console.log('Datos importados:', parsedData);
                } else {
                    alert('Error al procesar el archivo. Verifica el formato.');
                }
            };
            
            reader.onerror = function() {
                alert('Error al leer el archivo');
            };
            
            reader.readAsText(file);
        });
        
        // Trigger click en el input
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });
});

// ========================================
// BOTÓN EJECUTAR ANÁLISIS
// ========================================

document.querySelector('.btn-run').addEventListener('click', function() {
    console.log('Ejecutar análisis clickeado');
    
    if (!importedData) {
        alert('⚠️ Por favor, importa un archivo de datos primero');
        return;
    }
    
    if (activeStats.length === 0) {
        alert('⚠️ Por favor, selecciona al menos un estadístico');
        return;
    }
    
    // Aquí irá la lógica para ejecutar el análisis
    console.log('Datos:', importedData);
    console.log('Estadísticos:', activeStats);
    
    alert(`✅ Ejecutando análisis con:
    
📊 Datos: ${importedData.rowCount} filas
📋 Columnas: ${importedData.headers.length}
🔬 Estadísticos: ${activeStats.length}

${activeStats.map((stat, i) => `${i + 1}. ${stat}`).join('\n')}`);
});

// ========================================
// INICIALIZACIÓN
// ========================================

// Actualizar el estado inicial
updateActiveStats();

// Inicializar en la vista de Análisis
switchView('analisis');

// Configurar botones de transformación
setupTransformButtons();

console.log('StatAnalyzer Pro inicializado correctamente');
console.log('Formatos soportados: CSV, JSON, TXT');
console.log('Tip: Puedes descargar una plantilla CSV de ejemplo');
console.log('Transformaciones disponibles: Limpiar, Normalizar, Crear Columna, Eliminar Nulos');