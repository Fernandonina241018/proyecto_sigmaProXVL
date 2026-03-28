// ========================================
// MÓDULO DE ESTADÍSTICA DESCRIPTIVA
// ========================================

const EstadisticaDescriptiva = (() => {
    
    // ========================================
    // UTILIDADES INTERNAS
    // ========================================
    
    /**
     * Valida y extrae valores numéricos de una columna
     */
    function getNumericValues(data, columnName) {
        const values = data.data
            .map(row => parseFloat(row[columnName]))
            .filter(v => !isNaN(v) && isFinite(v));
        
        if (values.length === 0) {
            throw new Error(`La columna "${columnName}" no contiene valores numéricos válidos`);
        }
        
        return values;
    }
    
    /**
     * Identifica columnas numéricas en los datos
     */
    function getNumericColumns(data) {
        const numericCols = [];
        
        data.headers.forEach(header => {
            const values = data.data.map(row => row[header]);
            const numericCount = values.filter(v => !isNaN(parseFloat(v)) && isFinite(parseFloat(v))).length;
            
            // Si más del 80% son numéricos, consideramos la columna como numérica
            if (numericCount / values.length > 0.8) {
                numericCols.push(header);
            }
        });
        
        return numericCols;
    }
    
    /**
     * Ordena un array de números
     */
    function sortNumbers(arr) {
        return [...arr].sort((a, b) => a - b);
    }
    
    // ========================================
    // MEDIDAS DE TENDENCIA CENTRAL
    // ========================================
    
    /**
     * Calcula la media aritmética
     */
    function calcularMedia(values) {
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }
    
    /**
     * Calcula la mediana
     */
    function calcularMediana(values) {
        if (values.length === 0) return 0;
        
        const sorted = sortNumbers(values);
        const mid = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            return sorted[mid];
        }
    }
    
    /**
     * Calcula la moda (puede retornar múltiples valores)
     */
    function calcularModa(values) {
        if (values.length === 0) return [];
        
        const frequency = {};
        let maxFreq = 0;
        
        values.forEach(val => {
            const key = val.toString();
            frequency[key] = (frequency[key] || 0) + 1;
            if (frequency[key] > maxFreq) {
                maxFreq = frequency[key];
            }
        });
        
        const modes = Object.keys(frequency)
            .filter(key => frequency[key] === maxFreq)
            .map(key => parseFloat(key));
        
        // Si todos los valores tienen la misma frecuencia, no hay moda
        if (modes.length === values.length) {
            return [];
        }
        
        return modes;
    }
    
    // ========================================
    // MEDIDAS DE DISPERSIÓN
    // ========================================
    
    /**
     * Calcula la varianza
     */
    function calcularVarianza(values, esMuestral = true) {
        if (values.length === 0) return 0;
        
        const mean = calcularMedia(values);
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        const sumSquaredDiffs = squaredDiffs.reduce((acc, val) => acc + val, 0);
        
        const divisor = esMuestral ? values.length - 1 : values.length;
        return sumSquaredDiffs / divisor;
    }
    
    /**
     * Calcula la desviación estándar
     */
    function calcularDesviacionEstandar(values, esMuestral = true) {
        return Math.sqrt(calcularVarianza(values, esMuestral));
    }
    
    /**
     * Calcula el rango
     */
    function calcularRango(values) {
        if (values.length === 0) return 0;
        return Math.max(...values) - Math.min(...values);
    }
    
    /**
     * Calcula el coeficiente de variación
     */
    function calcularCoeficienteVariacion(values) {
        const mean = calcularMedia(values);
        if (mean === 0) return 0;
        
        const sd = calcularDesviacionEstandar(values);
        return (sd / mean) * 100;
    }
    
    // ========================================
    // PERCENTILES Y CUARTILES
    // ========================================
    
    /**
     * Calcula un percentil específico
     */
    function calcularPercentil(values, percentil) {
        if (values.length === 0) return 0;
        if (percentil < 0 || percentil > 100) {
            throw new Error('El percentil debe estar entre 0 y 100');
        }
        
        const sorted = sortNumbers(values);
        const index = (percentil / 100) * (sorted.length - 1);
        
        if (Number.isInteger(index)) {
            return sorted[index];
        } else {
            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            const weight = index - lower;
            return sorted[lower] * (1 - weight) + sorted[upper] * weight;
        }
    }
    
    /**
     * Calcula cuartiles
     */
    function calcularCuartiles(values) {
        return {
            Q1: calcularPercentil(values, 25),
            Q2: calcularPercentil(values, 50), // Mediana
            Q3: calcularPercentil(values, 75)
        };
    }
    
    /**
     * Calcula el rango intercuartílico (IQR)
     */
    function calcularIQR(values) {
        const quartiles = calcularCuartiles(values);
        return quartiles.Q3 - quartiles.Q1;
    }
    
    // ========================================
    // FUNCIONES PRINCIPALES (API PÚBLICA)
    // ========================================
    
    /**
     * Calcula todas las estadísticas para una columna específica
     */
    function analizarColumna(data, columnName) {
        try {
            const values = getNumericValues(data, columnName);
            const quartiles = calcularCuartiles(values);
            const moda = calcularModa(values);
            
            return {
                columna: columnName,
                n: values.length,
                valoresOriginales: data.data.length,
                valoresValidos: values.length,
                
                // Tendencia central
                media: calcularMedia(values),
                mediana: calcularMediana(values),
                moda: moda.length > 0 ? moda : null,
                
                // Dispersión
                varianza: calcularVarianza(values),
                desviacionEstandar: calcularDesviacionEstandar(values),
                coeficienteVariacion: calcularCoeficienteVariacion(values),
                
                // Rango
                minimo: Math.min(...values),
                maximo: Math.max(...values),
                rango: calcularRango(values),
                
                // Cuartiles
                Q1: quartiles.Q1,
                Q2: quartiles.Q2,
                Q3: quartiles.Q3,
                IQR: calcularIQR(values)
            };
        } catch (error) {
            return {
                columna: columnName,
                error: error.message
            };
        }
    }
    
    /**
     * Analiza todas las columnas numéricas
     */
    function analizarTodasLasColumnas(data) {
        const numericCols = getNumericColumns(data);
        
        if (numericCols.length === 0) {
            return {
                error: 'No se encontraron columnas numéricas en los datos'
            };
        }
        
        const resultados = {};
        numericCols.forEach(col => {
            resultados[col] = analizarColumna(data, col);
        });
        
        return {
            columnasAnalizadas: numericCols.length,
            columnas: numericCols,
            resultados: resultados
        };
    }
    
    /**
     * Ejecuta análisis según estadísticos seleccionados
     */
    function ejecutarAnalisis(data, estadisticos) {
        const numericCols = getNumericColumns(data);
        
        if (numericCols.length === 0) {
            throw new Error('No se encontraron columnas numéricas para analizar');
        }
        
        const resultados = {};
        
        estadisticos.forEach(stat => {
            switch (stat) {
                case 'Media Aritmética':
                    resultados['Media Aritmética'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Media Aritmética'][col] = calcularMedia(values);
                    });
                    break;
                    
                case 'Mediana y Moda':
                    resultados['Mediana'] = {};
                    resultados['Moda'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Mediana'][col] = calcularMediana(values);
                        resultados['Moda'][col] = calcularModa(values);
                    });
                    break;
                    
                case 'Desviación Estándar':
                    resultados['Desviación Estándar'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Desviación Estándar'][col] = calcularDesviacionEstandar(values);
                    });
                    break;
                    
                case 'Varianza':
                    resultados['Varianza'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Varianza'][col] = calcularVarianza(values);
                    });
                    break;
                    
                case 'Percentiles':
                    resultados['Percentiles'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Percentiles'][col] = {
                            P10: calcularPercentil(values, 10),
                            P25: calcularPercentil(values, 25),
                            P50: calcularPercentil(values, 50),
                            P75: calcularPercentil(values, 75),
                            P90: calcularPercentil(values, 90)
                        };
                    });
                    break;
                    
                case 'Rango y Amplitud':
                    resultados['Rango y Amplitud'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Rango y Amplitud'][col] = {
                            minimo: Math.min(...values),
                            maximo: Math.max(...values),
                            rango: calcularRango(values),
                            amplitud: calcularRango(values)
                        };
                    });
                    break;
            }
        });
        
        return {
            columnasAnalizadas: numericCols,
            totalColumnas: numericCols.length,
            totalFilas: data.rowCount,
            estadisticos: estadisticos,
            resultados: resultados
        };
    }
    
    /**
     * Genera un reporte en texto formateado
     */
    function generarReporte(analisisResultado) {
        let reporte = `
═══════════════════════════════════════════════════════════
            REPORTE DE ESTADÍSTICA DESCRIPTIVA
═══════════════════════════════════════════════════════════

📊 INFORMACIÓN GENERAL
───────────────────────────────────────────────────────────
Total de filas:              ${analisisResultado.totalFilas}
Columnas numéricas:          ${analisisResultado.totalColumnas}
Columnas analizadas:         ${analisisResultado.columnasAnalizadas.join(', ')}
Estadísticos calculados:     ${analisisResultado.estadisticos.length}

`;
        
        // Agregar resultados por estadístico
        Object.keys(analisisResultado.resultados).forEach(estadistico => {
            reporte += `\n📈 ${estadistico.toUpperCase()}\n`;
            reporte += `${'─'.repeat(63)}\n`;
            
            const datos = analisisResultado.resultados[estadistico];
            
            Object.keys(datos).forEach(columna => {
                const valor = datos[columna];
                
                if (typeof valor === 'object' && !Array.isArray(valor)) {
                    // Para objetos (como percentiles)
                    reporte += `\n   ${columna}:\n`;
                    Object.keys(valor).forEach(key => {
                        reporte += `      ${key}: ${typeof valor[key] === 'number' ? valor[key].toFixed(4) : valor[key]}\n`;
                    });
                } else if (Array.isArray(valor)) {
                    // Para arrays (como moda)
                    reporte += `   ${columna}: ${valor.length > 0 ? valor.map(v => v.toFixed(4)).join(', ') : 'No hay moda'}\n`;
                } else {
                    // Para valores simples
                    reporte += `   ${columna}: ${typeof valor === 'number' ? valor.toFixed(4) : valor}\n`;
                }
            });
        });
        
        reporte += `\n${'═'.repeat(63)}\n`;
        reporte += `Generado: ${new Date().toLocaleString('es-ES')}\n`;
        reporte += `${'═'.repeat(63)}\n`;
        
        return reporte;
    }
    
    /**
     * Genera resultados en formato HTML para mostrar en la interfaz
     */
function generarHTML(analisisResultado) {

    const STAT_META = {
        'Media Aritmética':   { formula: 'x̄ = Σxᵢ / n',                        desc: 'Tendencia central de la distribución. Suma de todos los valores dividida entre el número de observaciones.',          icono: '📐' },
        'Mediana':            { formula: 'P₅₀ — valor central al ordenar datos', desc: 'Divide la distribución en dos mitades iguales. Resistente a valores atípicos a diferencia de la media.',             icono: '📊' },
        'Moda':               { formula: 'Valor con mayor frecuencia absoluta',   desc: 'Valor que aparece con más frecuencia. Puede ser multimodal si varios valores comparten la frecuencia máxima.',        icono: '🔢' },
        'Desviación Estándar':{ formula: 's = √[Σ(xᵢ − x̄)² / (n−1)]',          desc: 'Dispersión típica respecto a la media con corrección de Bessel (n−1). Principal indicador de variabilidad del proceso.',icono: '📉' },
        'Varianza':           { formula: 's² = Σ(xᵢ − x̄)² / (n−1)',             desc: 'Dispersión cuadrática media. Base para el cálculo de la desviación estándar y análisis de varianza (ANOVA).',       icono: '📈' },
        'Percentiles':        { formula: 'i = k/100 × (n−1)  [interp. lineal NIST]', desc: 'Dividen la distribución en 100 partes iguales. P25, P50 y P75 definen los cuartiles y el rango intercuartílico.', icono: '📶' },
        'Rango y Amplitud':   { formula: 'R = Máx − Mín',                        desc: 'Extensión total de la distribución. Sensible a valores extremos, complementa la desviación estándar.',               icono: '↔️' },
    };

    const statKeys = Object.keys(analisisResultado.resultados);
    const cols     = analisisResultado.columnasAnalizadas;
    const hasParams = typeof ParametrosManager !== 'undefined';

    // ── KPI cards para un estadístico ─────────────────────
    function kpiCards(statKey) {
        const data = analisisResultado.resultados[statKey];
        if (!data) return '';

        return cols.map(col => {
            const val = data[col];
            if (val === undefined) return '';

            // Verificar cumplimiento de parámetros
            let compliance = null;
            if (hasParams) {
                const p      = ParametrosManager.getParametros(col);
                const numVal = typeof val === 'number' ? val : null;
                if (numVal !== null && (p.min !== null || p.max !== null)) {
                    const out = (p.min !== null && numVal < p.min) ||
                                (p.max !== null && numVal > p.max);
                    compliance = !out;
                }
            }

            const statusClass  = compliance === true  ? 'ar-kpi-ok'
                               : compliance === false ? 'ar-kpi-danger' : '';
            const badgeHTML    = compliance !== null
                ? `<div class="ar-kpi-badge ${compliance ? 'ar-badge-ok' : 'ar-badge-danger'}">
                       ${compliance ? '✓ Dentro de parámetros' : '✗ Fuera de parámetros'}
                   </div>` : '';

            // Objeto (percentiles, rango)
            if (typeof val === 'object' && !Array.isArray(val)) {
                const rows = Object.entries(val).map(([k, v]) => `
                    <div class="ar-kpi-sub">
                        <span class="ar-kpi-sub-k">${k}</span>
                        <span class="ar-kpi-sub-v">${typeof v === 'number' ? v.toFixed(4) : v}</span>
                    </div>`).join('');
                return `
                    <div class="ar-kpi-card ar-kpi-multi ${statusClass}">
                        <div class="ar-kpi-col-label">${col}</div>
                        <div class="ar-kpi-sub-grid">${rows}</div>
                        ${badgeHTML}
                    </div>`;
            }

            // Array (moda)
            if (Array.isArray(val)) {
                const display = val.length > 0 ? val.map(v => v.toFixed(4)).join(', ') : '—';
                return `
                    <div class="ar-kpi-card ${statusClass}">
                        <div class="ar-kpi-col-label">${col}</div>
                        <div class="ar-kpi-val ar-kpi-val-sm">${display}</div>
                        ${badgeHTML}
                    </div>`;
            }

            // Escalar simple
            const display = typeof val === 'number' ? val.toFixed(4) : String(val);
            return `
                <div class="ar-kpi-card ${statusClass}">
                    <div class="ar-kpi-col-label">COLUMNA ${col}</div>
                    <div class="ar-kpi-val">${display}</div>
                    ${badgeHTML}
                </div>`;

        }).join('');
    }

    // ── Nav items ──────────────────────────────────────────
    const navItems = statKeys.map((key, i) => {
        const meta = STAT_META[key] || { icono: '📊' };
        return `
            <div class="ar-nav-item ${i === 0 ? 'active' : ''}" data-stat="${key}">
                <span class="ar-nav-icon">${meta.icono}</span>
                <span>${key}</span>
            </div>`;
    }).join('');

    // ── Paneles de contenido ───────────────────────────────
    const panels = statKeys.map((key, i) => {
        const meta = STAT_META[key] || { formula: '', desc: '' };
        return `
            <div class="ar-panel ${i === 0 ? 'active' : ''}" data-panel="${key}">
                <div class="ar-panel-title">
                    ${key}
                    <span class="ar-panel-n">— ${analisisResultado.totalFilas} observaciones</span>
                </div>
                <div class="ar-kpis-grid">
                    ${kpiCards(key)}
                </div>
                <div class="ar-formula">
                    <span class="ar-formula-icon">∑</span>
                    <div>
                        <div class="ar-formula-eq">${meta.formula}</div>
                        <div class="ar-formula-desc">${meta.desc}</div>
                    </div>
                </div>
            </div>`;
    }).join('');

    // ── Tags de columnas ───────────────────────────────────
    const colTags = cols.map(c =>
        `<span class="ar-col-tag">${c}</span>`
    ).join('');

    // ── Sección de parámetros de control ──────────────────
    let paramSection = '';
    if (hasParams) {
        const verifs = cols
            .map(col => ParametrosManager.verificarColumna(
                StateManager.getImportedData(), col
            ))
            .filter(v => v !== null);

        if (verifs.length > 0) {
            const rows = verifs.map(v => {
                const pct   = parseFloat(v.porcentajeCumplimiento);
                const cls   = pct >= 95 ? 'ar-param-ok' : pct >= 80 ? 'ar-param-warn' : 'ar-param-danger';
                const badge = pct >= 95 ? 'ar-badge-ok' : pct >= 80 ? 'ar-badge-warn' : 'ar-badge-danger';
                const label = pct >= 95 ? '✓ OK' : pct >= 80 ? '⚠ Revisar' : '✗ Fuera';
                return `
                    <div class="ar-param-row ${cls}">
                        <span class="ar-param-col">${v.col}</span>
                        <span class="ar-param-val">${v.parametros.min ?? '—'}</span>
                        <span class="ar-param-val">${v.parametros.max ?? '—'}</span>
                        <span class="ar-param-val">${v.parametros.esp ?? '—'}</span>
                        <span class="ar-param-val">${v.fueraDeRango} / ${v.total}</span>
                        <span class="ar-kpi-badge ${badge}">${label} ${v.porcentajeCumplimiento}%</span>
                    </div>`;
            }).join('');

            paramSection = `
                <div class="ar-params-block">
                    <div class="ar-params-title">🎯 Control de Parámetros</div>
                    <div class="ar-params-header">
                        <span>Variable</span><span>Mín</span><span>Máx</span>
                        <span>Esperanza</span><span>Fuera rango</span><span>Cumplimiento</span>
                    </div>
                    ${rows}
                </div>`;
        }
    }

    return `
    <div class="ar-layout">

        <!-- Header -->
        <div class="ar-header">
            <div>
                <h2 class="ar-title">📊 Resultados del Análisis Estadístico</h2>
                <div class="ar-header-meta">
                    <span class="ar-meta-chip">📋 ${analisisResultado.totalFilas} filas</span>
                    <span class="ar-meta-chip">📊 ${analisisResultado.totalColumnas} columnas numéricas</span>
                    <span class="ar-meta-chip">🔬 ${analisisResultado.estadisticos.length} estadísticos</span>
                </div>
            </div>
        </div>

        <!-- Columnas -->
        <div class="ar-cols-row">
            <span class="ar-cols-label">Columnas analizadas:</span>
            ${colTags}
        </div>

        <!-- Parámetros de control (si existen) -->
        ${paramSection}

        <!-- Body: nav + contenido -->
        <div class="ar-body">
            <div class="ar-nav">
                <div class="ar-nav-title">ESTADÍSTICOS</div>
                ${navItems}
            </div>
            <div class="ar-content">
                ${panels}
            </div>
        </div>

        <!-- Footer -->
        <div class="ar-footer">
            <button class="ar-btn-secondary" onclick="nuevoAnalisis()">🔄 Nuevo análisis</button>
            <button class="ar-btn-primary"   onclick="exportarResultados()">📥 Exportar reporte →</button>
        </div>
    </div>
}
    
    // ========================================
    // API PÚBLICA
    // ========================================
    
    return {
        // Funciones individuales
        calcularMedia,
        calcularMediana,
        calcularModa,
        calcularVarianza,
        calcularDesviacionEstandar,
        calcularRango,
        calcularPercentil,
        calcularCuartiles,
        calcularIQR,
        calcularCoeficienteVariacion,
        
        // Funciones de análisis
        analizarColumna,
        analizarTodasLasColumnas,
        ejecutarAnalisis,
        
        // Generación de reportes
        generarReporte,
        generarHTML,
        
        // Utilidades
        getNumericColumns
    };
})();

// Exportar si se usan módulos
// export default EstadisticaDescriptiva;

console.log('✅ Módulo de Estadística Descriptiva cargado');