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
let activeStats = [];

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
// IMPORTACIÓN DE DATOS
// ========================================

let importedData = null;
let fileName = '';

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
    const placeholder = document.querySelector('.content-placeholder');
    
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
    
    const placeholder = document.querySelector('.content-placeholder');
    placeholder.innerHTML = `
        <h3>¡Comienza tu análisis!</h3>
        <p>Selecciona los estadísticos del menú lateral</p>
    `;
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

document.querySelector('.btn-import').addEventListener('click', function() {
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
            } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                alert('Para archivos Excel, recomendamos convertirlos a CSV primero.\nEn Excel: Archivo > Guardar como > CSV (delimitado por comas)');
                return;
            }
            
            if (parsedData) {
                importedData = parsedData;
                displayImportedData(parsedData);
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
        
        console.log('Navegación clickeada:', this.textContent);
        // Aquí se puede agregar lógica para cambiar vistas
    });
});

// ========================================
// INICIALIZACIÓN
// ========================================

// Actualizar el estado inicial
updateActiveStats();

console.log('StatAnalyzer Pro inicializado correctamente');
console.log('Formatos soportados: CSV, JSON, TXT');
console.log('Tip: Puedes descargar una plantilla CSV de ejemplo');