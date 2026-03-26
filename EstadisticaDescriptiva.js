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
        let html = `
        <div class="analisis-resultado">
            <div class="resultado-header">
                <h2>📊 Resultados del Análisis Estadístico</h2>
                <div class="resultado-info">
                    <span>📋 ${analisisResultado.totalFilas} filas</span>
                    <span>📊 ${analisisResultado.totalColumnas} columnas numéricas</span>
                    <span>🔬 ${analisisResultado.estadisticos.length} estadísticos</span>
                </div>
            </div>
            
            <div class="columnas-analizadas">
                <h3>Columnas Analizadas:</h3>
                <div class="columnas-tags">
                    ${analisisResultado.columnasAnalizadas.map(col => 
                        `<span class="columna-tag">${col}</span>`
                    ).join('')}
                </div>
            </div>
        `;
        
        // Crear tablas para cada estadístico
        Object.keys(analisisResultado.resultados).forEach(estadistico => {
            html += `
            <div class="estadistico-section">
                <h3>📈 ${estadistico}</h3>
                <div class="resultado-tabla-wrapper">
                    <table class="resultado-tabla">
                        <thead>
                            <tr>
                                <th>Columna</th>
            `;
            
            const datos = analisisResultado.resultados[estadistico];
            const primeraColumna = Object.keys(datos)[0];
            const primerValor = datos[primeraColumna];
            
            // Determinar encabezados según el tipo de dato
            if (typeof primerValor === 'object' && !Array.isArray(primerValor)) {
                Object.keys(primerValor).forEach(key => {
                    html += `<th>${key}</th>`;
                });
            } else {
                html += `<th>Valor</th>`;
            }
            
            html += `
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            // Agregar filas
            Object.keys(datos).forEach(columna => {
                html += `<tr><td><strong>${columna}</strong></td>`;
                
                const valor = datos[columna];
                
                if (typeof valor === 'object' && !Array.isArray(valor)) {
                    Object.values(valor).forEach(v => {
                        html += `<td>${typeof v === 'number' ? v.toFixed(4) : v}</td>`;
                    });
                } else if (Array.isArray(valor)) {
                    html += `<td>${valor.length > 0 ? valor.map(v => v.toFixed(4)).join(', ') : '<em>No hay moda</em>'}</td>`;
                } else {
                    html += `<td>${typeof valor === 'number' ? valor.toFixed(4) : valor}</td>`;
                }
                
                html += `</tr>`;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            </div>
            `;
        });

        // ── Sección de control de parámetros ──────────────────
        const _importedData = (typeof StateManager !== 'undefined') ? StateManager.getImportedData() : null;
        if (_importedData && typeof ParametrosManager !== 'undefined') {
            const _numCols = getNumericColumns(_importedData);
            const _verifs  = _numCols
                .map(col => ParametrosManager.verificarColumna(_importedData, col))
                .filter(v => v !== null);

            if (_verifs.length > 0) {
                // ── Tabla resumen ──
                html += `
                <div class="estadistico-section param-control-section">
                    <h3>🎯 Control de Parámetros</h3>
                    <div class="resultado-tabla-wrapper">
                        <table class="resultado-tabla">
                            <thead>
                                <tr>
                                    <th>Columna</th>
                                    <th>Mínimo def.</th>
                                    <th>Máximo def.</th>
                                    <th>Esperanza def.</th>
                                    <th>Media real</th>
                                    <th>Fuera de rango</th>
                                    <th>Cumplimiento</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${_verifs.map(v => {
                                    const pct = parseFloat(v.porcentajeCumplimiento);
                                    const cls = pct >= 95 ? 'param-ok' : pct >= 80 ? 'param-warn' : 'param-danger';
                                    return `
                                    <tr>
                                        <td><strong>${v.col}</strong></td>
                                        <td>${v.parametros.min !== null ? v.parametros.min : '—'}</td>
                                        <td>${v.parametros.max !== null ? v.parametros.max : '—'}</td>
                                        <td>${v.parametros.esp !== null ? v.parametros.esp : '—'}</td>
                                        <td>${v.mediaReal !== null ? v.mediaReal.toFixed(4) : '—'}</td>
                                        <td class="${v.fueraDeRango > 0 ? 'param-cell-danger' : 'param-cell-ok'}">
                                            ${v.fueraDeRango} / ${v.total}
                                        </td>
                                        <td class="${cls}">${v.porcentajeCumplimiento}%</td>
                                    </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>`;

                // ── Detalle por columna (solo las que tienen violaciones) ──
                _verifs.filter(v => v.fueraDeRango > 0).forEach(v => {
                    const p       = v.parametros;
                    const outRows = _importedData.data
                        .map((row, i) => ({ i, val: parseFloat(row[v.col]) }))
                        .filter(({ val }) => {
                            if (isNaN(val)) return false;
                            if (p.min !== null && !isNaN(p.min) && val < p.min) return true;
                            if (p.max !== null && !isNaN(p.max) && val > p.max) return true;
                            return false;
                        });

                    html += `
                    <div class="estadistico-section param-detail-section">
                        <h4>⚠️ Valores fuera de rango — <span class="param-col-name">${v.col}</span>
                            <span class="param-col-count">${outRows.length} valor${outRows.length !== 1 ? 'es' : ''}</span>
                        </h4>
                        <div class="resultado-tabla-wrapper">
                            <table class="resultado-tabla">
                                <thead>
                                    <tr><th>Fila #</th><th>Valor</th><th>Razón</th></tr>
                                </thead>
                                <tbody>
                                    ${outRows.slice(0, 100).map(({ i, val }) => {
                                        const razones = [];
                                        if (p.min !== null && !isNaN(p.min) && val < p.min)
                                            razones.push(`por debajo del mínimo (${p.min})`);
                                        if (p.max !== null && !isNaN(p.max) && val > p.max)
                                            razones.push(`por encima del máximo (${p.max})`);
                                        return `
                                        <tr class="param-row-danger">
                                            <td>${i + 1}</td>
                                            <td class="param-cell-danger"><strong>${val}</strong></td>
                                            <td>${razones.join(' · ')}</td>
                                        </tr>`;
                                    }).join('')}
                                    ${outRows.length > 100
                                        ? `<tr><td colspan="3" class="param-more-rows">
                                            … y ${outRows.length - 100} valores más
                                        </td></tr>`
                                        : ''}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                });
            }
        }
        // ── Fin control de parámetros ──────────────────────────
        
        html += `
            <div class="resultado-footer">
                <button class="btn-export-results" onclick="exportarResultados()">
                    📥 Exportar Resultados
                </button>
                <button class="btn-new-analysis" onclick="nuevoAnalisis()">
                    🔄 Nuevo Análisis
                </button>
            </div>
        </div>
        `;
        
        return html;
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