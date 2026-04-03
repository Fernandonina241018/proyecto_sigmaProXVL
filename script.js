// ========================================
// script.js - StatAnalyzer Pro
// Versión corregida
// ========================================

// ========================================
// VARIABLE GLOBAL DE ÚLTIMOS RESULTADOS
// FIX: antes se asignaba sin declarar → variable global implícita en modo no-strict,
//      error silencioso en strict mode. Se declara explícitamente aquí.
// 
// Deprecated - use StateManager.getUltimosResultados() y StateManager.setUltimosResultados()
// Se mantiene por compatibilidad con código legacy
// ========================================
let ultimosResultados = null;

// ========================================
// UTILIDADES GENERALES
// ========================================

// Funciones movidas a utils.js:
// - escapeHtml()
// - showToast() / _showToast()
// - formatDate()
// - getRolLabel()

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
                TM.render();
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
    StateManager.addEventListener('statsChange', () => {
        updateActiveStatsUI();
        updateSidebarIconBadges();
    });

    StateManager.addEventListener('stateLoad', () => {
        sincronizarMenuLateral();
        updateActiveStatsUI();
        updateSidebarIconBadges();
    });

    StateManager.addEventListener('sheetChange', () => {
        TM.onSheetChange();
    });

    StateManager.addEventListener('dataChange', () => {
        if (document.getElementById('view-datos').classList.contains('active')) {
            DatosManager.buildView();
        }
    });
}

// ========================================

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

    const numericCols = StateManager.getNumericCols(data);
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
    StateManager.setUltimosResultados(null);

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
         'Test de Normalidad',
         'Límites de Cuantificación'
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
            StateManager.setUltimosResultados(resultados);

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
    StateManager.setUltimosResultados(null);
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
let reportesBuilt = false;
let auditoriaBuilt = false;
let usuariosBuilt = false;

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
    ReporteManager.buildReportesView();
}

// ========================================
// AUDITORÍA
// ========================================

function inicializarAuditoria() {
    if (!auditoriaBuilt) {
        const API_URL = 'https://proyecto-sigmaproxvl.onrender.com';
        AuditoriaManager.init(API_URL);
        AuditoriaManager.buildView();
        auditoriaBuilt = true;
    } else {
        AuditoriaManager.buildView();
    }
}

// ========================================
// USUARIOS
// ========================================

function inicializarUsuarios() {
    if (!usuariosBuilt) {
        const API_URL = 'https://proyecto-sigmaproxvl.onrender.com';
        UsuariosManager.init(API_URL);
        UsuariosManager.buildView();
        usuariosBuilt = true;
    } else {
        UsuariosManager.buildView();
    }
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
            cerrarModalPerfil();
        }
    });
});

// Inicialización de la app (solo tras login exitoso)
function _initApp() {
    setupStateListeners();
    setupSidebarToggles();
    StateManager.init();
    updateSidebarIconBadges();
    updateActiveStatsUI();
    sincronizarMenuLateral();
    switchView('trabajo'); // Vista por defecto: módulo de trabajo
    TrabajoManager.init();

    if (document.getElementById('view-trabajo').classList.contains('active')) {
        TM.render();
    }

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
        <div class="auth-user-chip" onclick="abrirModalPerfil()" style="cursor:pointer;">
            <div class="auth-user-chip-avatar">${escapeHtml(initials)}</div>
            <span>${escapeHtml(username)}</span>
            ${isAdmin ? '<span class="auth-admin-chip">Admin</span>' : ''}
        </div>
    `;

    // Mostrar pestañas solo para admins
    const audTab = document.getElementById('nav-auditoria');
    if (audTab) audTab.style.display = isAdmin ? '' : 'none';

    const usrTab = document.getElementById('nav-usuarios');
    if (usrTab) usrTab.style.display = isAdmin ? '' : 'none';
    navContent.appendChild(chip);
}

// ========================================
// MODAL DE PERFIL DE USUARIO
// ========================================

function abrirModalPerfil() {
    const session = Auth.getSession();
    if (!session) return;

    const username = session.username || 'Usuario';
    const role = session.role || 'user';
    const email = session.email || username + '@sigmapro.com';
    const initials = username.slice(0, 2).toUpperCase();

    const saludo = obtenerSaludo();

    // Fecha de último login
    const ultimoLogin = localStorage.getItem('ultimoLogin');
    const ultimoLoginFmt = ultimoLogin ? formatearFecha(ultimoLogin) : 'No disponible';

    // Tiempo de sesión activa
    const sessionStart = localStorage.getItem('sessionStart');
    let tiempoSesion = 'Calculando...';
    if (sessionStart) {
        const diff = Date.now() - parseInt(sessionStart);
        const horas = Math.floor(diff / 3600000);
        const minutos = Math.floor((diff % 3600000) / 60000);
        tiempoSesion = horas > 0 ? `${horas}h ${minutos}min` : `${minutos} min`;
    }

    // Permisos del usuario
    let permisos = ['Usar trabajo', 'Importar datos'];
    if (role === 'admin') {
        permisos = ['Usar trabajo', 'Importar datos', 'Exportar reportes', 'Gestión de usuarios', 'Configuración', 'Auditoría'];
    }
    const permisosHtml = permisos.map(p => `<li>• ${p}</li>`).join('');

    document.getElementById('perfil-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'perfil-modal';
    modal.innerHTML = `
        <div class="perfil-overlay" onclick="cerrarModalPerfil()"></div>
        <div class="perfil-card">
            <button class="perfil-close" onclick="cerrarModalPerfil()">✕</button>
            <div class="perfil-avatar">
                <div class="perfil-avatar-circle">${initials}</div>
            </div>
            <div class="perfil-greeting">${saludo}, ${username}!</div>
            <div class="perfil-email">${email}</div>
            <div class="perfil-role">
                <span class="perfil-role-badge">${role === 'admin' ? 'Administrador' : 'Usuario'}</span>
            </div>

            <div class="perfil-info-card">
                <div class="perfil-info-icon">📅</div>
                <div class="perfil-info-content">
                    <div class="perfil-info-label">Último acceso</div>
                    <div class="perfil-info-value">${ultimoLoginFmt}</div>
                </div>
            </div>

            <div class="perfil-info-card">
                <div class="perfil-info-icon">⏱️</div>
                <div class="perfil-info-content">
                    <div class="perfil-info-label">Sesión activa</div>
                    <div class="perfil-info-value">${tiempoSesion}</div>
                </div>
            </div>

            <div class="perfil-info-card">
                <div class="perfil-info-icon">✅</div>
                <div class="perfil-info-content">
                    <div class="perfil-info-label">Permisos activos</div>
                    <ul class="perfil-permisos-lista">${permisosHtml}</ul>
                </div>
            </div>

            <div class="perfil-actions">
                <button class="perfil-btn perfil-btn-logout" onclick="Auth.logout(); cerrarModalPerfil();">
                    🔓 Cerrar Sesión
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function cerrarModalPerfil() {
    document.getElementById('perfil-modal')?.remove();
}

function obtenerSaludo() {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
}

function formatearFecha(isoString) {
    try {
        const fecha = new Date(isoString);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();
        const hora = fecha.getHours().toString().padStart(2, '0');
        const min = fecha.getMinutes().toString().padStart(2, '0');
        return `${dia}/${mes}/${anio} ${hora}:${min}`;
    } catch (e) {
        return 'No disponible';
    }
}

// ========================================
// SIDEBAR COMPACTO CON ICONOS
// ========================================

function setupSidebarToggles() {
    const STORAGE_KEY_LEFT  = 'sidebar_left_collapsed';
    const STORAGE_KEY_RIGHT = 'sidebar_right_collapsed';

    const leftSidebar  = document.querySelector('.stats-menu');
    const rightSidebar = document.querySelector('.active-sidebar');

    if (!leftSidebar || !rightSidebar) return;

    // Crear contenedor de iconos para sidebar compacto
    createSidebarIconContainers(leftSidebar, rightSidebar);

    // Botón para sidebar derecho
    const btnRight = document.createElement('button');
    btnRight.className = 'sidebar-toggle-btn';
    btnRight.textContent = '▶';
    rightSidebar.appendChild(btnRight);

    const labelRight = document.createElement('div');
    labelRight.className = 'sidebar-strip-label';
    labelRight.textContent = 'En Proceso';
    rightSidebar.appendChild(labelRight);

    // Aplicar estado guardado del sidebar derecho
    const rightCollapsed = sessionStorage.getItem(STORAGE_KEY_RIGHT) === 'true';
    if (rightCollapsed) {
        rightSidebar.classList.add('sidebar-collapsed');
        btnRight.textContent = '◀';
    }

    // Click handler para sidebar derecho
    btnRight.addEventListener('click', (e) => {
        e.stopPropagation();
        const collapsed = !rightSidebar.classList.contains('sidebar-collapsed');
        rightSidebar.classList.toggle('sidebar-collapsed');
        btnRight.textContent = collapsed ? '◀' : '▶';
        labelRight.style.display = collapsed ? 'block' : 'none';
        sessionStorage.setItem(STORAGE_KEY_RIGHT, collapsed);
    });
}

// ========================================
// SIDEBAR COMPACTO - ICONOS Y MODAL
// ========================================

// Definir secciones con sus iconos y opciones
const SIDEBAR_SECTIONS = {
    descriptiva: {
        icon: '📊',
        label: 'Descriptiva',
        description: 'Análisis de tendencias centrales, dispersión y forma de datos',
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
        description: 'Pruebas estadísticas para validar suposiciones sobre los datos',
        options: [
            'T-Test (una muestra)', 'T-Test (dos muestras)', 'ANOVA One-Way',
            'ANOVA Two-Way', 'Chi-Cuadrado', 'Test de Normalidad'
        ]
    },
    correlacion: {
        icon: '📈',
        label: 'Correlación',
        description: 'Análisis de relaciones entre variables y modelos predictivos',
        options: [
            'Correlación Pearson', 'Correlación Spearman', 'Regresión Lineal Simple',
            'Regresión Lineal Múltiple', 'Regresión Logística', 'Regresión Polinomial'
        ]
    },
    noParametricos: {
        icon: '🔬',
        label: 'No Paramétricos',
        description: 'Tests sin distribución normal requerida para muestras pequeñas',
        options: [
            'Mann-Whitney U', 'Wilcoxon', 'Kruskal-Wallis', 'Friedman', 'Test de Signos'
        ]
    },
    multivariado: {
        icon: '🎯',
        label: 'Multivariado',
        description: 'Análisis de múltiples variables simultáneamente',
        options: [
            'PCA (Componentes Principales)', 'Análisis Factorial', 'Análisis de Cluster',
            'Análisis Discriminante', 'M-ANOVA'
        ]
    },
    extras: {
        icon: '✨',
        label: 'Extras',
        description: 'Técnicas avanzadas de análisis estadístico',
        options: [
            'Series Temporales', 'Bootstrap', 'Análisis de Supervivencia',
            'Modelos Mixtos', 'Análisis Bayesiano'
        ]
    },
    especificacion: {
        icon: '📐',
        label: 'Especificación',
        description: 'Límites de cuantificación y capacidad del proceso',
        options: [
            'Límites de Cuantificación'
        ]
    }
};

function updateSidebarIconBadges() {
    const activeStats = StateManager.getActiveStats();
    
    // Actualizar badges del sidebar compacto
    Object.entries(SIDEBAR_SECTIONS).forEach(([key, section]) => {
        const badge = document.querySelector(`.sidebar-compact-badge[data-section="${key}"]`);
        if (badge) {
            const count = activeStats.filter(stat => section.options.includes(stat)).length;
            badge.textContent = count;
            badge.classList.toggle('has-items', count > 0);
        }
    });

    // Actualizar badge del sidebar derecho (En Proceso)
    const rightBadge = document.querySelector('.sidebar-icon-badge[data-section="proceso"]');
    if (rightBadge) {
        rightBadge.textContent = activeStats.length;
        rightBadge.classList.toggle('has-items', activeStats.length > 0);
    }
    
    // Actualizar contador en header
    const totalBadge = document.getElementById('sidebarTotalBadge');
    if (totalBadge) {
        totalBadge.textContent = activeStats.length;
    }
}

// Variable para guardar la selección temporal del modal
let tempModalSelection = {};
let currentModalSection = null;

function createSidebarIconContainers(leftSidebar, rightSidebar) {
    // Crear sidebar compacto con iconos
    const iconsContainer = document.getElementById('sidebarIconsCompact');
    if (!iconsContainer) return;

    // Limpiar contenedor para evitar duplicación
    iconsContainer.innerHTML = '';
    
    // Agregar badge total al inicio
    const totalItem = document.createElement('div');
    totalItem.className = 'sidebar-icon-compact';
    totalItem.innerHTML = `
        <span class="sidebar-compact-icon">🔢</span>
        <span class="sidebar-compact-badge has-items" id="sidebarTotalBadge">0</span>
    `;
    totalItem.title = 'Total activos';
    totalItem.addEventListener('mouseenter', (e) => showTotalTooltip(e));
    totalItem.addEventListener('mouseleave', hideTooltip);
    iconsContainer.appendChild(totalItem);
    
    // Crear iconos para cada sección
    Object.entries(SIDEBAR_SECTIONS).forEach(([key, section]) => {
        const iconItem = document.createElement('div');
        iconItem.className = 'sidebar-icon-compact';
        iconItem.innerHTML = `
            <span class="sidebar-compact-icon">${section.icon}</span>
            <span class="sidebar-compact-badge" data-section="${key}">0</span>
        `;
        iconItem.title = section.label;
        iconItem.addEventListener('click', () => {
            openStatModal(key);
        });
        
        // Tooltip events
        iconItem.addEventListener('mouseenter', (e) => showTooltip(key, e));
        iconItem.addEventListener('mouseleave', hideTooltip);
        
        iconsContainer.appendChild(iconItem);
    });

    // Configurar botón de toggle
    const btnLeft = document.getElementById('btnLeft');
    if (btnLeft) {
        btnLeft.textContent = '◀';
        btnLeft.addEventListener('click', () => {
            const isCollapsed = leftSidebar.classList.contains('sidebar-collapsed');
            leftSidebar.classList.toggle('sidebar-collapsed');
            btnLeft.textContent = isCollapsed ? '◀' : '▶';
            sessionStorage.setItem('sidebar_left_collapsed', !isCollapsed);
        });
    }
    
    // Aplicar estado guardado
    const savedCollapsed = sessionStorage.getItem('sidebar_left_collapsed') === 'true';
    if (savedCollapsed) {
        leftSidebar.classList.add('sidebar-collapsed');
        if (btnLeft) btnLeft.textContent = '▶';
    }

    // Inicializar badges
    updateSidebarIconBadges();
}

// ========================================
// TOOLTIP FLOTANTE
// ========================================

function showTooltip(sectionKey, event) {
    const section = SIDEBAR_SECTIONS[sectionKey];
    if (!section) return;
    
    const tooltip = document.getElementById('sidebar-tooltip');
    const activeStats = StateManager.getActiveStats();
    const selectedOptions = section.options.filter(opt => activeStats.includes(opt));
    
    // Llenar contenido del tooltip
    tooltip.querySelector('.tooltip-icon').textContent = section.icon;
    tooltip.querySelector('.tooltip-title').textContent = section.label;
    tooltip.querySelector('.tooltip-description').textContent = section.description;
    
    // Mostrar opciones disponibles y las seleccionadas
    const statsContainer = tooltip.querySelector('.tooltip-stats');
    statsContainer.textContent = ''; // Limpiar de forma segura
    section.options.forEach(opt => {
        const span = document.createElement('span');
        span.className = 'tooltip-stat-tag';
        const isSelected = activeStats.includes(opt);
        span.style.cssText = isSelected 
            ? 'background: #667eea; color: white;' 
            : 'background: #e8eaf6; color: #5a6fd6;';
        span.textContent = opt; // textContent NO ejecuta HTML
        statsContainer.appendChild(span);
    });
    
    // Posicionar tooltip
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = (rect.right + 10) + 'px';
    tooltip.style.top = (rect.top - 10) + 'px';
    
    // Ajustar si se sale de la pantalla
    const tooltipRect = tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) {
        tooltip.style.left = (rect.left - tooltipRect.width - 10) + 'px';
    }
    if (tooltipRect.bottom > window.innerHeight) {
        tooltip.style.top = (window.innerHeight - tooltipRect.height - 10) + 'px';
    }
    
    tooltip.classList.add('active');
}

function hideTooltip() {
    document.getElementById('sidebar-tooltip').classList.remove('active');
}

function showTotalTooltip(event) {
    const activeStats = StateManager.getActiveStats();
    const tooltip = document.getElementById('sidebar-tooltip');
    
    tooltip.querySelector('.tooltip-icon').textContent = '🔢';
    tooltip.querySelector('.tooltip-title').textContent = 'Total de Estadísticos';
    tooltip.querySelector('.tooltip-description').textContent = 'Cantidad total de análisis estadísticos seleccionados';
    
    let statsHtml = '';
    if (activeStats.length === 0) {
        statsHtml = '<span class="tooltip-stat-tag" style="background: #e8eaf6; color: #999;">Sin selección</span>';
    } else {
        activeStats.forEach(opt => {
            statsHtml += `<span class="tooltip-stat-tag" style="background: #667eea; color: white;">${escapeHtml(opt)}</span>`;
        });
    }
    tooltip.querySelector('.tooltip-stats').innerHTML = statsHtml;
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = (rect.right + 10) + 'px';
    tooltip.style.top = (rect.top - 10) + 'px';
    
    const tooltipRect = tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) {
        tooltip.style.left = (rect.left - tooltipRect.width - 10) + 'px';
    }
    if (tooltipRect.bottom > window.innerHeight) {
        tooltip.style.top = (window.innerHeight - tooltipRect.height - 10) + 'px';
    }
    
    tooltip.classList.add('active');
}

// ========================================
// MODAL DE SELECCIÓN DE ESTADÍSTICOS
// ========================================

function openStatModal(sectionKey) {
    const section = SIDEBAR_SECTIONS[sectionKey];
    if (!section) return;
    
    currentModalSection = sectionKey;
    const activeStats = StateManager.getActiveStats();
    
    // Inicializar selección temporal
    tempModalSelection = {};
    section.options.forEach(opt => {
        tempModalSelection[opt] = activeStats.includes(opt);
    });
    
    // Configurar header del modal
    document.getElementById('modalStatIcon').textContent = section.icon;
    document.getElementById('modalStatTitle').textContent = section.label;
    
    // Generar lista de opciones
    const listContainer = document.getElementById('modalStatList');
    listContainer.innerHTML = section.options.map(opt => `
        <div class="stat-option ${tempModalSelection[opt] ? 'selected' : ''}" data-stat="${escapeHtml(opt)}">
            <input type="checkbox" id="stat-${escapeHtml(opt)}" ${tempModalSelection[opt] ? 'checked' : ''}>
            <label for="stat-${escapeHtml(opt)}">${escapeHtml(opt)}</label>
        </div>
    `).join('');
    
    // Agregar event listeners
    listContainer.querySelectorAll('.stat-option').forEach(item => {
        const statName = item.dataset.stat;
        const checkbox = item.querySelector('input');
        
        item.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                checkbox.checked = !checkbox.checked;
            }
            tempModalSelection[statName] = checkbox.checked;
            item.classList.toggle('selected', checkbox.checked);
            updateModalCount();
        });
        
        checkbox.addEventListener('change', (e) => {
            tempModalSelection[statName] = e.target.checked;
            item.classList.toggle('selected', e.target.checked);
            updateModalCount();
        });
    });
    
    updateModalCount();
    document.getElementById('stat-selection-modal').classList.add('active');
}

function updateModalCount() {
    const count = Object.values(tempModalSelection).filter(v => v).length;
    document.getElementById('modalStatCount').textContent = `Selec: ${count}`;
}

function closeStatModal() {
    document.getElementById('stat-selection-modal').classList.remove('active');
    currentModalSection = null;
    tempModalSelection = {};
}

function selectAllInModal() {
    if (!currentModalSection) return;
    const section = SIDEBAR_SECTIONS[currentModalSection];
    
    section.options.forEach(opt => {
        tempModalSelection[opt] = true;
    });
    
    document.querySelectorAll('.stat-option').forEach(item => {
        const checkbox = item.querySelector('input');
        checkbox.checked = true;
        item.classList.add('selected');
    });
    
    updateModalCount();
}

function deselectAllInModal() {
    if (!currentModalSection) return;
    const section = SIDEBAR_SECTIONS[currentModalSection];
    
    section.options.forEach(opt => {
        tempModalSelection[opt] = false;
    });
    
    document.querySelectorAll('.stat-option').forEach(item => {
        const checkbox = item.querySelector('input');
        checkbox.checked = false;
        item.classList.remove('selected');
    });
    
    updateModalCount();
}

function applyStatSelection() {
    if (!currentModalSection) return;
    
    const section = SIDEBAR_SECTIONS[currentModalSection];
    const currentActive = StateManager.getActiveStats();
    
    // Remover estadísticas de esta sección
    const newActive = currentActive.filter(stat => !section.options.includes(stat));
    
     // Identificar qué pruebas requieren configuración de columnas
     const hipotesisTests = ['ANOVA One-Way', 'ANOVA Two-Way', 'Chi-Cuadrado', 'T-Test (dos muestras)', 'Límites de Cuantificación', 'Correlación Pearson', 'Correlación Spearman'];
     const statsQueNecesitanConfig = [];
     const statsNormales = [];
    
    section.options.forEach(opt => {
        if (tempModalSelection[opt]) {
            if (hipotesisTests.includes(opt)) {
                statsQueNecesitanConfig.push(opt);
            } else {
                statsNormales.push(opt);
            }
        }
    });
    
    // Agregar estadísticas normales directamente
    statsNormales.forEach(stat => newActive.push(stat));
    
    // Actualizar StateManager con estadísticas normales
    StateManager.clearActiveStats();
    newActive.forEach(stat => StateManager.addActiveStat(stat));
    
    closeStatModal();
    
    // Para pruebas de hipótesis, abrir modal de configuración
    // Se abren en secuencia: cada modal guarda su config y cierra
    if (statsQueNecesitanConfig.length > 0) {
        _abrirModalesHipotesisSecuencia(statsQueNecesitanConfig, 0);
    }
}

// Función auxiliar: abre modales de configuración de hipótesis en secuencia
function _abrirModalesHipotesisSecuencia(stats, index) {
    if (index >= stats.length) return;
    
    const statName = stats[index];
    setTimeout(() => {
        mostrarModalConfiguracionHypothesis(statName);
        
        // Interceptar el botón de confirmar para continuar con la siguiente
        const confirmBtn = document.getElementById('hypo-modal-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function handler() {
                // Continuar con la siguiente prueba de hipótesis
                setTimeout(() => {
                    _abrirModalesHipotesisSecuencia(stats, index + 1);
                }, 300);
            }, { once: true });
        }
    }, 200);
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('stat-selection-modal');
    if (e.target === modal) {
        closeStatModal();
    }
});



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
        'T-Test (dos muestras)': { title: '📈 Configurar T-Test (dos muestras)', catCols: 1, numCols: 1, catLabel: 'Columna de Agrupación (2 grupos)', numLabel: 'Columna de Valores (Variable Dependiente)' },
        'Límites de Cuantificación': { title: '📐 Configurar Límites de Cuantificación', catCols: 0, numCols: 1, catLabel: null, numLabel: 'Columna a analizar', extraFields: ['lsl', 'usl', 'norma', 'nivelConfianza'] }
    };
    
    const config = configs[statName];
    if (!config) {
        _showToast('⚠️ Configuración no disponible para esta prueba', true);
        return false;
    }
    
    // Para Límites de Cuantificación, mostrar modal especial
    if (statName === 'Límites de Cuantificación') {
        return mostrarModalLimitesCuantificacion(imported);
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
// MODAL DE CONFIGURACIÓN DE LÍMITES DE CUANTIFICACIÓN
// ========================================
function mostrarModalLimitesCuantificacion(imported) {
     // MODAL DE CONFIGURACIÓN PARA CORRELACIÓN
     function abrirModalConfigCorrelacion() {
         // Limpiar modales previos
         document.getElementById('correlacion-config-modal')?.remove();
         document.getElementById('limites-config-modal')?.remove();

         const numericCols = imported.headers.filter(col => {
             const values = imported.data.map(row => row[col]).filter(v => v !== null && v !== '' && v !== undefined);
             const numericCount = values.filter(v => !isNaN(parseFloat(v))).length;
             return numericCount / values.length > 0.5;
         });

         if (numericCols.length < 2) {
             _showToast('⚠️ Se necesitan al menos 2 columnas numéricas para correlación', true);
             return false;
         }

         const modal = document.createElement('div');
         modal.id = 'correlacion-config-modal';
         modal.innerHTML = `
             <div class="dm-modal-overlay" id="correlacion-modal-overlay"></div>
             <div class="dm-modal-card" style="width: min(500px, 96vw);">
                 <div class="dm-modal-header">
                     <h3>🔗 Configurar Correlación</h3>
                     <button class="dm-modal-close" id="correlacion-modal-close">✕</button>
                 </div>
                 <div class="dm-modal-body">
                     <div class="dm-field" style="margin-bottom: 14px;">
                         <label>📊 Columna X (Variable 1)</label>
                         <select id="correlacion-columna-x" style="width:100%;padding:8px;border-radius:6px;border:1.5px solid #ddd;">
                             ${numericCols.map(col => `<option value="${escapeHtml(col)}">${escapeHtml(col)}</option>`).join('')}
                         </select>
                     </div>
                     <div class="dm-field" style="margin-bottom: 14px;">
                         <label>📊 Columna Y (Variable 2)</label>
                         <select id="correlacion-columna-y" style="width:100%;padding:8px;border-radius:6px;border:1.5px solid #ddd;">
                             ${numericCols.map(col => `<option value="${escapeHtml(col)}">${escapeHtml(col)}</option>`).join('')}
                         </select>
                     </div>
                     <div class="dm-field" style="margin-bottom: 14px;">
                         <label>📈 Tipo de Correlación</label>
                         <select id="correlacion-tipo" style="width:100%;padding:8px;border-radius:6px;border:1.5px solid #ddd;">
                             <option value="pearson">Correlación de Pearson</option>
                             <option value="spearman">Correlación de Spearman</option>
                         </select>
                     </div>
                     <p style="font-size:0.75rem;color:#666;margin-bottom:0;">
                         💡 Seleccione dos columnas numéricas diferentes para analizar su relación
                     </p>
                 </div>
                 <div class="dm-modal-footer">
                     <button class="btn-secondary" id="correlacion-modal-cancel">Cancelar</button>
                     <button class="btn-primary" id="correlacion-modal-confirm">✅ Confirmar</button>
                 </div>
             </div>
         `;

         document.body.appendChild(modal);

         // Event listeners
         document.getElementById('correlacion-modal-close').onclick = () => modal.remove();
         document.getElementById('correlacion-modal-overlay').onclick = () => modal.remove();
         document.getElementById('correlacion-modal-cancel').onclick = () => modal.remove();

         document.getElementById('correlacion-modal-confirm').onclick = () => {
             const colX = document.getElementById('correlacion-columna-x')?.value;
             const colY = document.getElementById('correlacion-columna-y')?.value;
             const tipo = document.getElementById('correlacion-tipo')?.value;

             if (!colX || !colY) {
                 _showToast('⚠️ Seleccione ambas columnas', true);
                 return;
             }

             if (colX === colY) {
                 _showToast('⚠️ Las columnas deben ser diferentes', true);
                 return;
             }

             // Guardar configuración según tipo
             const statName = tipo === 'pearson' ? 'Correlación Pearson' : 'Correlación Spearman';
             const hypothesisConfig = {
                 [statName]: {
                     columnaX: colX,
                     columnaY: colY,
                     timestamp: Date.now()
                 }
             };

             StateManager.setHypothesisConfig(statName, hypothesisConfig[statName]);
             StateManager.addActiveStat(statName);

             // Marcar visualmente en el menú
             document.querySelectorAll('.menu-option').forEach(opt => {
                 if (opt.textContent.trim() === statName) {
                     opt.classList.add('selected');
                 }
             });

             _showToast(`✅ ${statName} configurado: ${colX} vs ${colY}`);
             modal.remove();
             return true;
         };

         return true;
     }

     // ========================================
     // CONFIGURAR LÍMITES DE CUANTIFICACIÓN
     // ========================================

     document.getElementById('limites-config-modal')?.remove();

     const numericCols = imported.headers.filter(col => {
        const values = imported.data.map(row => row[col]).filter(v => v !== null && v !== '' && v !== undefined);
        const numericCount = values.filter(v => !isNaN(parseFloat(v))).length;
        return numericCount / values.length > 0.5;
    });

    if (numericCols.length === 0) {
        _showToast('⚠️ No se encontraron columnas numéricas', true);
        return false;
    }

    const modal = document.createElement('div');
    modal.id = 'limites-config-modal';
    modal.innerHTML = `
        <div class="dm-modal-overlay" id="limites-modal-overlay"></div>
        <div class="dm-modal-card" style="width: min(500px, 96vw);">
            <div class="dm-modal-header">
                <h3>📐 Configurar Límites de Cuantificación</h3>
                <button class="dm-modal-close" id="limites-modal-close">✕</button>
            </div>
            <div class="dm-modal-body">
                <div class="dm-field" style="margin-bottom: 14px;">
                    <label>📊 Columna a analizar</label>
                    <select id="limites-columna" style="width:100%;padding:8px;border-radius:6px;border:1.5px solid #ddd;">
                        ${numericCols.map(col => `<option value="${escapeHtml(col)}">${escapeHtml(col)}</option>`).join('')}
                    </select>
                </div>
                <div style="display:flex;gap:12px;margin-bottom:14px;">
                    <div class="dm-field" style="flex:1;">
                        <label>⬇️ Límite Inferior (LSL)</label>
                        <input type="number" id="limites-lsl" step="any" style="width:100%;padding:8px;border-radius:6px;border:1.5px solid #ddd;">
                    </div>
                    <div class="dm-field" style="flex:1;">
                        <label>⬆️ Límite Superior (USL)</label>
                        <input type="number" id="limites-usl" step="any" style="width:100%;padding:8px;border-radius:6px;border:1.5px solid #ddd;">
                    </div>
                </div>
                <div style="display:flex;gap:12px;margin-bottom:14px;">
                    <div class="dm-field" style="flex:1;">
                        <label>📋 Norma de referencia</label>
                        <select id="limites-norma" style="width:100%;padding:8px;border-radius:6px;border:1.5px solid #ddd;">
                            <option value="USP <232>">USP &lt;232&gt;</option>
                            <option value="EP 2.2.42">EP 2.2.42</option>
                            <option value="ICH Q2(R1)">ICH Q2(R1)</option>
                            <option value="Personalizado">Personalizado</option>
                        </select>
                    </div>
                    <div class="dm-field" style="flex:1;">
                        <label>📊 Nivel de Confianza</label>
                        <select id="limites-confianza" style="width:100%;padding:8px;border-radius:6px;border:1.5px solid #ddd;">
                            <option value="0.90">90%</option>
                            <option value="0.95" selected>95%</option>
                            <option value="0.99">99%</option>
                        </select>
                    </div>
                </div>
                <p style="font-size:0.75rem;color:#666;margin-bottom:0;">
                    💡 Ingresa los límites según la norma farmacéutica aplicable
                </p>
            </div>
            <div class="dm-modal-footer">
                <button class="btn-apply" id="limites-modal-confirm">✅ Confirmar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Cerrar modal
    document.getElementById('limites-modal-close').onclick = () => modal.remove();
    document.getElementById('limites-modal-overlay').onclick = () => modal.remove();

    // Auto-llenar LSL/USL con Min/Max de la columna seleccionada
    const selectCol = document.getElementById('limites-columna');
    function autoFillLSL_USL() {
        const col = selectCol.value;
        const values = imported.data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
        if (values.length > 0) {
            document.getElementById('limites-lsl').value = Math.min(...values);
            document.getElementById('limites-usl').value = Math.max(...values);
        }
    }
    autoFillLSL_USL();
    selectCol.addEventListener('change', autoFillLSL_USL);

    // Confirmar
    document.getElementById('limites-modal-confirm').onclick = () => {
        const col = document.getElementById('limites-columna').value;
        const lsl = document.getElementById('limites-lsl').value;
        const usl = document.getElementById('limites-usl').value;
        const norma = document.getElementById('limites-norma').value;
        const nivelConfianza = document.getElementById('limites-confianza').value;

        if (!lsl || !usl) {
            _showToast('⚠️ Ingresa ambos límites (LSL y USL)', true);
            return;
        }

        if (parseFloat(lsl) >= parseFloat(usl)) {
            _showToast('⚠️ LSL debe ser menor que USL', true);
            return;
        }

        const hypothesisConfig = {
            statName: 'Límites de Cuantificación',
            columna: col,
            lsl: lsl,
            usl: usl,
            norma: norma,
            nivelConfianza: nivelConfianza,
            timestamp: Date.now()
        };

        StateManager.setHypothesisConfig('Límites de Cuantificación', hypothesisConfig);
        StateManager.addActiveStat('Límites de Cuantificación');

        // Marcar visualmente
        document.querySelectorAll('.menu-option').forEach(opt => {
            if (opt.textContent.trim() === 'Límites de Cuantificación') {
                opt.classList.add('selected');
            }
        });

        _showToast('✅ Límites de Cuantificación configurado');
        modal.remove();
    };

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
