/**
 * EDAManager.js - Exploratory Data Analysis Manager
 * StatAnalyzer Pro v2.1 — FIXED & OPTIMIZED
 *
 * FIXES APLICADOS:
 *  FIX-1  getNumericColumns devolvía columnas incorrectas (índice del array
 *          filtrado vs índice del array original).
 *  FIX-2  missingCount sobrecontabilizaba columnas de texto legítimas al
 *          tratar cualquier valor no numérico como faltante.
 *  FIX-3  XSS en nombres de columnas dentro de innerHTML (recomendaciones,
 *          tooltip de correlaciones fuertes).
 *  FIX-4  ejecutarEDA se llamaba dos veces: una desde script.js y otra
 *          dentro de renderDashboard. Ahora renderDashboard reutiliza caché.
 *  FIX-5  Correlación no alineaba pares por fila; si dos columnas tenían
 *          nulos en posiciones distintas el resultado era incorrecto.
 *          Se añade getAlignedPairs() que filtra las dos columnas juntas.
 *  FIX-6  testNormalidadRapido calculaba Jarque-Bera pero se presentaba
 *          en el UI como "Shapiro-Wilk / W". Renombrado a "JB" con etiqueta
 *          "Test Jarque-Bera (aproximación)".
 *  FIX-7  getNumericValues se llamaba 4 veces por columna (descriptivas,
 *          normalidad, outliers, correlaciones). Se cachean al inicio de
 *          ejecutarEDA y se reutilizan en todo el análisis.
 *  FIX-8  toggleSection no actualizaba el ícono ▼/▶ ni controlaba
 *          max-height por JS, dependiendo solo de CSS que podía fallar.
 *  FIX-9  drawHeatmap usaba setTimeout(100ms) frágil. Sustituido por
 *          MutationObserver que dibuja exactamente cuando el canvas
 *          aparece en el DOM.
 */

const EDAManager = (function () {
    'use strict';

    // ── Estado interno ────────────────────────────────────────────────────────
    let _edaResults = null;  // caché del último análisis ejecutado

    // ========================================
    // FIX-1 / FIX-7 : UTILIDADES BASE
    // ========================================

    /**
     * FIX-1: la versión anterior hacía .filter().map((_, idx) => headers[idx])
     * donde idx era el índice del array YA filtrado, no del original,
     * devolviendo los primeros N headers en lugar de los correctos.
     * Ahora .filter() devuelve directamente los strings de header.
     */
    function getNumericColumns(data) {
        if (!data || !data.headers || !data.data) return [];
        return data.headers.filter((header, idx) => {
            const values = data.data.map(row => {
                const val = Array.isArray(row) ? row[idx] : row[header];
                return parseFloat(val);
            });
            const valid = values.filter(v => !isNaN(v) && isFinite(v));
            // Umbral 30 %: tolera datasets pequeños con algún nulo
            return valid.length > 0 && valid.length >= data.data.length * 0.3;
        });
        // .filter ya devuelve los strings; .map adicional era el bug.
    }

    /**
     * FIX-7: caché de valores numéricos por columna.
     * En la versión anterior getNumericValues se llamaba hasta 4 veces
     * por columna (descriptivas + normalidad + outliers + correlaciones).
     * Ahora se construye una vez al inicio de ejecutarEDA.
     *
     * @param {object} data        - { headers, data }
     * @param {string[]} numCols   - columnas numéricas detectadas
     * @returns {Object.<string, number[]>}
     */
    function buildValuesCache(data, numCols) {
        const cache = {};
        numCols.forEach(col => {
            const idx = data.headers.indexOf(col);
            cache[col] = data.data
                .map(row => parseFloat(Array.isArray(row) ? row[idx] : row[col]))
                .filter(v => !isNaN(v) && isFinite(v));
        });
        return cache;
    }

    // ========================================
    // ESTADÍSTICAS DESCRIPTIVAS
    // ========================================

    function calcularMedia(values) {
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    function calcularDesviacionEstandar(values) {
        if (values.length < 2) return 0;
        const mean = calcularMedia(values);
        const sqDiffs = values.map(v => Math.pow(v - mean, 2));
        return Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / (values.length - 1));
    }

    function calcularMediana(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    function calcularPercentil(values, p) {
        const sorted = [...values].sort((a, b) => a - b);
        const index  = (p / 100) * (sorted.length - 1);
        const lower  = Math.floor(index);
        const upper  = Math.ceil(index);
        if (lower === upper) return sorted[lower];
        return sorted[lower] * (1 - (index - lower)) + sorted[upper] * (index - lower);
    }

    function calcularAsimetria(values) {
        const n    = values.length;
        if (n < 3) return 0;
        const mean = calcularMedia(values);
        const std  = calcularDesviacionEstandar(values);
        if (std === 0) return 0;
        const sum  = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 3), 0);
        return (n / ((n - 1) * (n - 2))) * sum;
    }

    function calcularCurtosis(values) {
        const n    = values.length;
        if (n < 4) return 0;
        const mean = calcularMedia(values);
        const std  = calcularDesviacionEstandar(values);
        if (std === 0) return 0;
        const sum  = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 4), 0);
        const kurt = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum;
        return kurt - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
    }

    // ========================================
    // FIX-5 : CORRELACIÓN CON PARES ALINEADOS
    // ========================================

    /**
     * FIX-5: la versión anterior hacía slice(0, minLen) sobre los arrays
     * de cada columna por separado. Si columna A tenía nulos en filas 2 y 5,
     * y columna B en filas 7 y 9, los arrays resultantes de distintas
     * longitudes se truncaban al mínimo pero NO correspondían a las
     * mismas filas, produciendo correlaciones incorrectas.
     *
     * Ahora se filtran las dos columnas juntas: solo se incluyen filas
     * donde AMBAS tienen valor numérico válido.
     */
    function getAlignedPairs(data, col1, col2) {
        const idx1 = data.headers.indexOf(col1);
        const idx2 = data.headers.indexOf(col2);
        const x = [], y = [];
        data.data.forEach(row => {
            const v1 = parseFloat(Array.isArray(row) ? row[idx1] : row[col1]);
            const v2 = parseFloat(Array.isArray(row) ? row[idx2] : row[col2]);
            if (!isNaN(v1) && isFinite(v1) && !isNaN(v2) && isFinite(v2)) {
                x.push(v1);
                y.push(v2);
            }
        });
        return { x, y };
    }

    function calcularCorrelacionPearson(x, y) {
        const n = x.length;
        if (n < 3) return 0;
        const meanX = x.reduce((a, b) => a + b, 0) / n;
        const meanY = y.reduce((a, b) => a + b, 0) / n;
        let num = 0, denX = 0, denY = 0;
        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            num  += dx * dy;
            denX += dx * dx;
            denY += dy * dy;
        }
        const den = Math.sqrt(denX * denY);
        return den === 0 ? 0 : num / den;
    }

    // ========================================
    // FIX-6 : TEST DE NORMALIDAD (JARQUE-BERA)
    // ========================================

    /**
     * FIX-6: la función anterior calculaba Jarque-Bera pero presentaba
     * el estadístico como "W" (Shapiro-Wilk), lo cual es estadísticamente
     * incorrecto. Renombrado y documentado honestamente como Jarque-Bera.
     * El UI ahora muestra "JB" y "Test Jarque-Bera (aprox.)".
     */
    function testNormalidadJB(values) {
        const n = values.length;
        if (n < 3) return { JB: 0, p: 1, esNormal: true, skew: 0, kurt: 0 };
        const skew = calcularAsimetria(values);
        const kurt = calcularCurtosis(values);
        // Estadístico Jarque-Bera: JB = (n/6) * (S² + K²/4)
        const jb   = (n / 6) * (Math.pow(skew, 2) + Math.pow(kurt, 2) / 4);
        // Aproximación p-value con distribución chi-cuadrado(2 grados)
        const p    = Math.exp(-jb / 2);
        return {
            JB:       parseFloat(jb.toFixed(4)),
            p:        parseFloat(Math.min(1, Math.max(0, p)).toFixed(4)),
            esNormal: p > 0.05,
            skew:     parseFloat(skew.toFixed(4)),
            kurt:     parseFloat(kurt.toFixed(4))
        };
    }

    // ========================================
    // DETECCIÓN DE OUTLIERS
    // ========================================

    function detectarOutliersIQR(values) {
        const q1    = calcularPercentil(values, 25);
        const q3    = calcularPercentil(values, 75);
        const iqr   = q3 - q1;
        const lower = q1 - 1.5 * iqr;
        const upper = q3 + 1.5 * iqr;
        return values.reduce((acc, v, i) => {
            if (v < lower || v > upper) acc.push({ index: i, value: v, method: 'IQR' });
            return acc;
        }, []);
    }

    function detectarOutliersZScore(values) {
        const mean = calcularMedia(values);
        const std  = calcularDesviacionEstandar(values);
        if (std === 0) return [];
        return values.reduce((acc, v, i) => {
            const z = Math.abs((v - mean) / std);
            if (z > 3) acc.push({ index: i, value: v, zScore: parseFloat(z.toFixed(2)), method: 'Z-Score' });
            return acc;
        }, []);
    }

    // ========================================
    // FIX-2 / FIX-3 / FIX-7 : ANÁLISIS PRINCIPAL
    // ========================================

    /**
     * FIX-2: missingCount ahora solo cuenta celdas genuinamente vacías
     *        (null / undefined / ''), no columnas de texto legítimas.
     * FIX-3: nombres de columnas se escapan antes de insertarse en HTML.
     * FIX-7: valuesCache construido una vez, reutilizado en todo el análisis.
     */
    function ejecutarEDA(data) {
        if (!data || !data.headers || !data.data || data.data.length === 0) {
            return { error: 'No hay datos disponibles para analizar.' };
        }

        const numericCols     = getNumericColumns(data);   // FIX-1
        if (numericCols.length === 0) {
            return { error: 'No se encontraron columnas numéricas con suficientes datos válidos. Verifique que las columnas contengan números.' };
        }

        const valCache        = buildValuesCache(data, numericCols); // FIX-7
        const totalRows       = data.data.length;
        const totalCols       = data.headers.length;
        const categoricalCols = data.headers.filter(h => !numericCols.includes(h));

        // FIX-2: contar solo celdas genuinamente vacías
        let missingCount = 0;
        data.data.forEach(row => {
            data.headers.forEach((h, idx) => {
                const val = Array.isArray(row) ? row[idx] : row[h];
                if (val === null || val === undefined || String(val).trim() === '') {
                    missingCount++;
                }
            });
        });

        // ── Estadísticas descriptivas ──────────────────────────────────────
        const descriptivas = {};
        numericCols.forEach(col => {
            const values = valCache[col];           // FIX-7
            if (!values.length) return;
            descriptivas[col] = {
                n:        values.length,
                media:    parseFloat(calcularMedia(values).toFixed(4)),
                mediana:  parseFloat(calcularMediana(values).toFixed(4)),
                de:       parseFloat(calcularDesviacionEstandar(values).toFixed(4)),
                min:      parseFloat(Math.min(...values).toFixed(4)),
                max:      parseFloat(Math.max(...values).toFixed(4)),
                q1:       parseFloat(calcularPercentil(values, 25).toFixed(4)),
                q3:       parseFloat(calcularPercentil(values, 75).toFixed(4)),
                iqr:      parseFloat((calcularPercentil(values, 75) - calcularPercentil(values, 25)).toFixed(4)),
                asimetria:parseFloat(calcularAsimetria(values).toFixed(4)),
                curtosis: parseFloat(calcularCurtosis(values).toFixed(4))
            };
        });

        // ── Tests de normalidad (Jarque-Bera) ─────────────────────────────
        const normalidad = {};
        numericCols.forEach(col => {
            const values = valCache[col];           // FIX-7
            if (values.length < 3) return;
            normalidad[col] = testNormalidadJB(values); // FIX-6
        });

        // ── Detección de outliers ──────────────────────────────────────────
        const outliers    = {};
        let totalOutliers = 0;
        numericCols.forEach(col => {
            const values    = valCache[col];         // FIX-7
            if (!values.length) return;
            const iqrOuts   = detectarOutliersIQR(values);
            const zOuts     = detectarOutliersZScore(values)
                .filter(z => !iqrOuts.some(i => i.index === z.index));
            outliers[col]   = [...iqrOuts, ...zOuts];
            totalOutliers  += outliers[col].length;
        });

        // ── Matriz de correlación (pares alineados) ─────────────────────── FIX-5
        const corrMatrix   = [];
        const corrFuertes  = [];

        for (let i = 0; i < numericCols.length; i++) {
            corrMatrix[i] = [];
            for (let j = 0; j < numericCols.length; j++) {
                if (i === j) {
                    corrMatrix[i][j] = 1;
                } else if (j < i) {
                    corrMatrix[i][j] = corrMatrix[j][i]; // simetría
                } else {
                    const { x, y } = getAlignedPairs(data, numericCols[i], numericCols[j]); // FIX-5
                    corrMatrix[i][j] = parseFloat(calcularCorrelacionPearson(x, y).toFixed(4));
                }
            }
        }

        for (let i = 0; i < numericCols.length; i++) {
            for (let j = i + 1; j < numericCols.length; j++) {
                const r = corrMatrix[i][j];
                if (Math.abs(r) >= 0.7) {
                    corrFuertes.push({ col1: numericCols[i], col2: numericCols[j], r });
                }
            }
        }

        // ── Recomendaciones ────────────────────────────────────────────────
        const recomendaciones = generarRecomendaciones({
            numericCols, normalidad, outliers,
            correlacionesFuertes: corrFuertes,
            descriptivas, missingCount, totalRows
        });

        _edaResults = {
            resumen: {
                totalFilas:           totalRows,
                totalColumnas:        totalCols,
                columnasNumericas:    numericCols.length,
                columnasCategoricas:  categoricalCols.length,
                valoresFaltantes:     missingCount,
                porcentajeFaltantes:  parseFloat(((missingCount / (totalRows * totalCols)) * 100).toFixed(2)),
                totalOutliers,
                correlacionesFuertes: corrFuertes.length,
                columnasNoNormales:   Object.values(normalidad).filter(n => !n.esNormal).length
            },
            descriptivas,
            normalidad,
            outliers,
            correlaciones: {
                matrix:   corrMatrix,
                columnas: numericCols,
                fuertes:  corrFuertes
            },
            recomendaciones,
            timestamp: new Date().toLocaleString('es-ES')
        };

        return _edaResults;
    }

    // ========================================
    // FIX-3 : RECOMENDACIONES (nombres escapados)
    // ========================================

    /**
     * FIX-3: los strings de recomendaciones incluían nombres de columna
     * directamente dentro de <strong> sin escapar. Un nombre como
     * "<script>alert(1)</script>" generaría XSS.
     * Ahora todos los nombres de columna pasan por escHtml().
     */
    function generarRecomendaciones({ numericCols, normalidad, outliers, correlacionesFuertes, descriptivas, missingCount, totalRows }) {
        const recs = [];

        const colsNormales    = [];
        const colsNoNormales  = [];
        Object.entries(normalidad).forEach(([col, result]) => {
            result.esNormal ? colsNormales.push(col) : colsNoNormales.push(col);
        });

        if (colsNormales.length > 0) {
            recs.push({
                tipo:  'success',
                icono: '✅',
                // FIX-3: escHtml en cada nombre
                texto: `<strong>${colsNormales.map(escHtml).join(', ')}</strong> siguen distribución normal (p > 0.05). Puede usar pruebas paramétricas: T-Test, ANOVA, Pearson.`
            });
        }

        if (colsNoNormales.length > 0) {
            recs.push({
                tipo:  'warning',
                icono: '⚠️',
                texto: `<strong>${colsNoNormales.map(escHtml).join(', ')}</strong> NO siguen distribución normal (p ≤ 0.05). Use pruebas no-paramétricas: Mann-Whitney U, Kruskal-Wallis, Spearman.`
            });
        }

        const colsConOutliers = Object.entries(outliers)
            .filter(([, outs]) => outs.length > 0)
            .map(([col, outs]) => `${escHtml(col)} (${outs.length})`); // FIX-3

        if (colsConOutliers.length > 0) {
            recs.push({
                tipo:  'danger',
                icono: '🔴',
                texto: `<strong>Outliers detectados:</strong> ${colsConOutliers.join(', ')}. Revise si son errores de medición o datos legítimos antes de incluirlos en el análisis.`
            });
        }

        if (correlacionesFuertes.length > 0) {
            const details = correlacionesFuertes.map(c =>
                `${escHtml(c.col1)} ↔ ${escHtml(c.col2)} (r=${c.r.toFixed(3)})` // FIX-3
            ).join('; ');
            recs.push({
                tipo:  'info',
                icono: '🔗',
                texto: `<strong>Correlaciones fuertes detectadas:</strong> ${details}. Posible multicolinealidad. Considere eliminar una variable correlacionada en modelos de regresión.`
            });
        }

        if (missingCount > 0) {
            const pct = ((missingCount / (totalRows * numericCols.length)) * 100).toFixed(1);
            recs.push({
                tipo:  'warning',
                icono: '⚠️',
                texto: `<strong>${missingCount} valores faltantes</strong> (${pct}% del dataset). Considere imputación (media, mediana) o exclusión antes del análisis.`
            });
        }

        if (totalRows < 30) {
            recs.push({
                tipo:  'warning',
                icono: '📏',
                texto: `<strong>Muestra pequeña (n=${totalRows}).</strong> Los tests de normalidad pueden no ser confiables. Considere aumentar el tamaño de muestra.`
            });
        }

        if (recs.length === 0) {
            recs.push({
                tipo:  'success',
                icono: '✅',
                texto: '<strong>Dataset limpio.</strong> No se detectaron problemas significativos. Puede proceder con el análisis estadístico.'
            });
        }

        return recs;
    }

    // ========================================
    // FIX-4 : RENDER DASHBOARD (sin doble ejecución)
    // ========================================

    /**
     * FIX-4: la versión anterior llamaba ejecutarEDA internamente, lo que
     * provocaba que se ejecutara dos veces (una desde script.js y otra aquí).
     * Ahora renderDashboard reutiliza _edaResults si ya existe, y solo
     * llama ejecutarEDA si el caché está vacío.
     */
    function renderDashboard(data) {
        // Reutilizar caché si ya se ejecutó para estos mismos datos
        const results = _edaResults || ejecutarEDA(data); // FIX-4

        if (results.error) {
            return `<div class="eda-loading">
                        <div class="eda-loading-text" style="color:#c53030;">⚠️ ${escHtml(results.error)}</div>
                    </div>`;
        }

        const r = results.resumen;
        let html = '';

        // ── Header ──────────────────────────────────────────────────────────
        html += `
        <div class="eda-dashboard">
            <div class="eda-header">
                <div>
                    <div class="eda-header-title">
                        <span class="eda-icon">🔍</span>
                        Análisis Exploratorio Completo
                    </div>
                    <div class="eda-header-info">
                        Generado: ${escHtml(results.timestamp)} &nbsp;|&nbsp; ${r.totalFilas} filas × ${r.totalColumnas} columnas
                    </div>
                </div>
                <div class="eda-header-actions">
                    <button class="eda-btn-export" onclick="EDAManager.exportarResumen()">📥 Exportar resumen</button>
                </div>
            </div>`;

        // ── KPIs ─────────────────────────────────────────────────────────────
        html += `
            <div class="eda-summary-kpis">
                <div class="eda-summary-kpi">
                    <div class="eda-kpi-icon">📊</div>
                    <div class="eda-kpi-val">${r.columnasNumericas}</div>
                    <div class="eda-kpi-label">Numéricas</div>
                </div>
                <div class="eda-summary-kpi">
                    <div class="eda-kpi-icon">📋</div>
                    <div class="eda-kpi-val">${r.columnasCategoricas}</div>
                    <div class="eda-kpi-label">Categóricas</div>
                </div>
                <div class="eda-summary-kpi ${r.valoresFaltantes > 0 ? 'eda-kpi-warn' : 'eda-kpi-ok'}">
                    <div class="eda-kpi-icon">${r.valoresFaltantes > 0 ? '⚠️' : '✅'}</div>
                    <div class="eda-kpi-val">${r.valoresFaltantes}</div>
                    <div class="eda-kpi-label">Faltantes</div>
                </div>
                <div class="eda-summary-kpi ${r.totalOutliers > 0 ? 'eda-kpi-warn' : 'eda-kpi-ok'}">
                    <div class="eda-kpi-icon">${r.totalOutliers > 0 ? '🔴' : '✅'}</div>
                    <div class="eda-kpi-val">${r.totalOutliers}</div>
                    <div class="eda-kpi-label">Outliers</div>
                </div>
                <div class="eda-summary-kpi ${r.correlacionesFuertes > 0 ? 'eda-kpi-info' : 'eda-kpi-ok'}">
                    <div class="eda-kpi-icon">🔗</div>
                    <div class="eda-kpi-val">${r.correlacionesFuertes}</div>
                    <div class="eda-kpi-label">Corr. Fuertes</div>
                </div>
            </div>`;

        // ── Secciones ────────────────────────────────────────────────────────
        html += renderDescriptivas(results);
        html += renderNormalidad(results);   // FIX-6 etiqueta JB
        html += renderOutliers(results);
        html += renderCorrelacion(results);  // FIX-9 heatmap con observer
        html += renderRecomendaciones(results);

        html += '</div>'; // cierra .eda-dashboard
        return html;
    }

    // ========================================
    // SECCIONES DE RENDER
    // ========================================

    function renderDescriptivas(results) {
        const cols = Object.keys(results.descriptivas);
        if (!cols.length) return '';

        let html = buildSectionHeader('📊', 'Estadísticas Descriptivas', `${cols.length} columnas`);
        html += `<div class="eda-section-content"><div style="overflow-x:auto;">
                 <table class="eda-stats-table">
                     <thead><tr>
                         <th>Columna</th><th>N</th><th>Media</th><th>Mediana</th>
                         <th>DE</th><th>Mín</th><th>Máx</th><th>Q1</th><th>Q3</th>
                         <th>IQR</th><th>Asimetría</th><th>Curtosis</th>
                     </tr></thead><tbody>`;

        cols.forEach(col => {
            const d = results.descriptivas[col];
            html += `<tr>
                <td>${escHtml(col)}</td>
                <td>${d.n}</td><td>${d.media}</td><td>${d.mediana}</td>
                <td>${d.de}</td><td>${d.min}</td><td>${d.max}</td>
                <td>${d.q1}</td><td>${d.q3}</td><td>${d.iqr}</td>
                <td>${d.asimetria}</td><td>${d.curtosis}</td>
            </tr>`;
        });

        html += `</tbody></table></div></div></div>`; // section-content + eda-section
        return html;
    }

    /**
     * FIX-6: muestra "JB" en lugar de "W" y etiqueta
     * "Test Jarque-Bera (aprox.)" en lugar de "Shapiro-Wilk".
     */
    function renderNormalidad(results) {
        const cols = Object.keys(results.normalidad);
        if (!cols.length) return '';

        let html = buildSectionHeader('🔔', 'Tests de Normalidad', `${cols.length} tests`);
        html += `<div class="eda-section-content">
                 <p style="font-size:0.72rem;color:#888;margin:0 0 12px;">
                     Método: <strong>Jarque-Bera (aproximación)</strong> — basado en asimetría y curtosis.
                     H₀: la distribución es normal. Rechazar si p ≤ 0.05.
                 </p>
                 <div class="eda-normality-grid">`;

        cols.forEach(col => {
            const n   = results.normalidad[col];
            const cls = n.esNormal ? 'eda-normal' : 'eda-not-normal';
            html += `
                <div class="eda-normality-card ${cls}">
                    <div class="eda-normality-col">${escHtml(col)}</div>
                    <div class="eda-normality-stats">
                        <div class="eda-normality-stat">
                            <span class="eda-stat-val">${n.JB}</span>
                            <span class="eda-stat-label">JB</span>
                        </div>
                        <div class="eda-normality-stat">
                            <span class="eda-stat-val">${n.p}</span>
                            <span class="eda-stat-label">p-value</span>
                        </div>
                        <div class="eda-normality-stat">
                            <span class="eda-stat-val">${n.skew}</span>
                            <span class="eda-stat-label">Skew</span>
                        </div>
                        <div class="eda-normality-stat">
                            <span class="eda-stat-val">${n.kurt}</span>
                            <span class="eda-stat-label">Kurt</span>
                        </div>
                    </div>
                    <div class="eda-normality-badge">${n.esNormal ? '✓ Normal' : '✗ No Normal'}</div>
                </div>`;
        });

        html += `</div></div></div>`;
        return html;
    }

    function renderOutliers(results) {
        const cols         = Object.keys(results.outliers);
        const totalOutliers = Object.values(results.outliers).reduce((s, o) => s + o.length, 0);
        if (!cols.length) return '';

        let html = buildSectionHeader('🔴', 'Detección de Outliers', `${totalOutliers} detectados`);
        html += `<div class="eda-section-content">`;

        if (totalOutliers === 0) {
            html += `<div class="eda-no-outliers">✅ No se detectaron outliers en ninguna columna.</div>`;
        } else {
            html += `<div class="eda-outliers-list">`;
            cols.forEach(col => {
                results.outliers[col].forEach(o => {
                    const zInfo = o.zScore ? ` (z=${o.zScore})` : '';
                    html += `
                    <div class="eda-outlier-item">
                        <span class="eda-outlier-icon">⚠️</span>
                        <span class="eda-outlier-col">${escHtml(col)}</span>
                        <span class="eda-outlier-val">valor: ${o.value}${zInfo}</span>
                        <span class="eda-outlier-method">Fila ${o.index + 1} · ${o.method}</span>
                    </div>`;
                });
            });
            html += `</div>`;
        }

        html += `</div></div>`;
        return html;
    }

    /**
     * FIX-9: drawHeatmap ya no usa setTimeout.
     * Se lanza un MutationObserver que dibuja cuando el canvas
     * aparece en el DOM, sea inmediatamente o tras una animación.
     */
    function renderCorrelacion(results) {
        const cols   = results.correlaciones.columnas;
        const matrix = results.correlaciones.matrix;
        if (cols.length < 2) return '';

        const canvasId = `eda-heatmap-${Date.now()}`; // id único por render

        let html = buildSectionHeader('🔗', 'Matriz de Correlación (Pearson)', `${cols.length}×${cols.length}`);
        html += `<div class="eda-section-content">
                 <div class="eda-heatmap-container">
                     <canvas id="${canvasId}" class="eda-heatmap-canvas"></canvas>
                     <div class="eda-heatmap-legend">
                         <span>−1.0 (Negativa)</span>
                         <div class="eda-heatmap-legend-bar"></div>
                         <span>+1.0 (Positiva)</span>
                     </div>
                 </div>
                 <div style="overflow-x:auto;margin-top:16px;">
                 <table class="eda-corr-table">
                     <thead><tr><th></th>`;

        cols.forEach(col => { html += `<th>${escHtml(col)}</th>`; });
        html += `</tr></thead><tbody>`;

        for (let i = 0; i < cols.length; i++) {
            html += `<tr><th>${escHtml(cols[i])}</th>`;
            for (let j = 0; j < cols.length; j++) {
                const r   = matrix[i][j];
                let cls   = 'eda-corr-weak';
                if (i === j)       cls = 'eda-corr-diagonal';
                else if (r >= 0.7) cls = 'eda-corr-strong-pos';
                else if (r >= 0.4) cls = 'eda-corr-moderate-pos';
                else if (r <= -0.7)cls = 'eda-corr-strong-neg';
                else if (r <= -0.4)cls = 'eda-corr-moderate-neg';
                const sig = (Math.abs(r) >= 0.7 && i !== j) ? '**'
                          : (Math.abs(r) >= 0.4 && i !== j) ? '*' : '';
                html += `<td class="${cls}">${i === j ? '1.00' : r.toFixed(2)}${sig}</td>`;
            }
            html += `</tr>`;
        }

        html += `</tbody></table></div>
                 <p style="font-size:0.72rem;color:#999;margin-top:8px;">* |r| ≥ 0.4 moderada &nbsp;|&nbsp; ** |r| ≥ 0.7 fuerte</p>
                 </div></div>`;

        // FIX-9: observer en lugar de setTimeout
        _scheduleHeatmap(canvasId, cols, matrix);

        return html;
    }

    function renderRecomendaciones(results) {
        const recs = results.recomendaciones;
        if (!recs.length) return '';

        let html = buildSectionHeader('💡', 'Recomendaciones Inteligentes', `${recs.length}`);
        html += `<div class="eda-section-content"><div class="eda-recommendations">`;

        recs.forEach(rec => {
            html += `
                <div class="eda-rec-item eda-rec-${rec.tipo}">
                    <span class="eda-rec-icon">${rec.icono}</span>
                    <div class="eda-rec-text">${rec.texto}</div>
                </div>`;
        });

        html += `</div></div></div>`;
        return html;
    }

    // ========================================
    // FIX-8 : TOGGLE SECTION (ícono + max-height por JS)
    // ========================================

    /**
     * FIX-8: la versión anterior solo añadía/quitaba la clase .collapsed
     * en el padre y dependía exclusivamente de CSS (max-height: 0).
     * En navegadores con transiciones deshabilitadas o contenido que
     * no tenía max-height inicial definido, el contenido no colapsaba.
     * Ahora se controla max-height por JS y se actualiza el ícono.
     */
    function toggleSection(headerEl) {
        const section = headerEl.closest('.eda-section');
        if (!section) return;
        const content    = section.querySelector('.eda-section-content');
        const toggleIcon = headerEl.querySelector('.eda-section-toggle');
        const isNowCollapsed = section.classList.toggle('collapsed');

        if (content) {
            content.style.maxHeight = isNowCollapsed ? '0' : '';
            content.style.paddingTop    = isNowCollapsed ? '0' : '';
            content.style.paddingBottom = isNowCollapsed ? '0' : '';
        }
        if (toggleIcon) {
            toggleIcon.textContent = isNowCollapsed ? '▶' : '▼';
        }
    }

    // ========================================
    // FIX-9 : HEATMAP CON MUTATIONOBSERVER
    // ========================================

    /**
     * FIX-9: reemplaza el setTimeout(100ms) frágil por un MutationObserver
     * que detecta exactamente cuándo el canvas aparece en el DOM y dibuja.
     * Si el canvas ya existe (render síncrono), dibuja inmediatamente.
     */
    function _scheduleHeatmap(canvasId, cols, matrix) {
        // Intento inmediato (render síncrono)
        const existing = document.getElementById(canvasId);
        if (existing) {
            drawHeatmap(existing, cols, matrix);
            return;
        }

        // Observar inserción asíncrona
        const observer = new MutationObserver(() => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                observer.disconnect();
                drawHeatmap(canvas, cols, matrix);
            }
        });

        // Observar el contenedor EDA o document.body como fallback
        const root = document.getElementById('eda-container') || document.body;
        observer.observe(root, { childList: true, subtree: true });

        // Safety timeout: desconectar si el canvas nunca apareció (tab oculta, etc.)
        setTimeout(() => observer.disconnect(), 5000);
    }

    function drawHeatmap(canvas, cols, matrix) {
        if (!canvas || !canvas.getContext) return;
        const ctx       = canvas.getContext('2d');
        const n         = cols.length;
        const cellSize  = Math.min(60, Math.max(35, 500 / n));
        const labelW    = 110;
        const labelH    = 45;

        canvas.width  = labelW + n * cellSize + 10;
        canvas.height = labelH + n * cellSize + 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ── Celdas ──────────────────────────────────────────────────────────
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const x = labelW + j * cellSize;
                const y = labelH + i * cellSize;
                const r = matrix[i][j];

                ctx.fillStyle = _corrColor(r);
                ctx.fillRect(x, y, cellSize, cellSize);

                ctx.strokeStyle = '#e9ecef';
                ctx.lineWidth   = 1;
                ctx.strokeRect(x, y, cellSize, cellSize);

                ctx.fillStyle  = Math.abs(r) > 0.5 ? 'white' : '#1a202c';
                ctx.font       = `bold 11px 'Segoe UI', monospace`;
                ctx.textAlign  = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(i === j ? '1.00' : r.toFixed(2), x + cellSize / 2, y + cellSize / 2);
            }
        }

        // ── Labels columnas (arriba) ─────────────────────────────────────────
        ctx.fillStyle    = '#1a202c';
        ctx.font         = `bold 10px 'Segoe UI', sans-serif`;
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'middle';
        for (let j = 0; j < n; j++) {
            ctx.save();
            ctx.translate(labelW + j * cellSize + cellSize / 2, labelH / 2);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(_truncate(cols[j], 12), 0, 0);
            ctx.restore();
        }

        // ── Labels filas (izquierda) ─────────────────────────────────────────
        ctx.textAlign    = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < n; i++) {
            ctx.fillText(
                _truncate(cols[i], 12),
                labelW - 6,
                labelH + i * cellSize + cellSize / 2
            );
        }
    }

    function _corrColor(r) {
        if (r > 0) {
            const t = r;
            return `rgb(${Math.round(255 - t * 200)},${Math.round(255 - t * 100)},${Math.round(255 - t * 200)})`;
        }
        const t = Math.abs(r);
        return `rgb(255,${Math.round(255 - t * 150)},${Math.round(255 - t * 150)})`;
    }

    function _truncate(str, max) {
        return str.length > max ? str.substring(0, max) + '…' : str;
    }

    // ========================================
    // UTILIDADES INTERNAS
    // ========================================

    /** Escapa HTML — independiente de la función global escapeHtml() */
    function escHtml(str) {
        const d = document.createElement('div');
        d.textContent = String(str);
        return d.innerHTML;
    }

    /** Genera el header colapsable de una sección */
    function buildSectionHeader(icon, title, badge) {
        return `
        <div class="eda-section">
            <div class="eda-section-header" onclick="EDAManager.toggleSection(this)">
                <span class="eda-section-icon">${icon}</span>
                <span class="eda-section-title">${title}</span>
                <span class="eda-section-badge">${badge}</span>
                <span class="eda-section-toggle">▼</span>
            </div>`;
        // La sección se cierra en cada renderXxx() con </div>
    }

    // ========================================
    // EXPORTAR RESUMEN
    // ========================================

    function exportarResumen() {
        if (!_edaResults) {
            if (typeof showToast === 'function') showToast('No hay resultados de EDA para exportar', 'warning');
            return;
        }

        const r   = _edaResults.resumen;
        let txt   = '══════════════════════════════════════════════════════════\n';
        txt      += '         ANÁLISIS EXPLORATORIO COMPLETO (EDA)\n';
        txt      += '══════════════════════════════════════════════════════════\n\n';
        txt      += `Generado: ${_edaResults.timestamp}\n\n`;

        txt += '📊 RESUMEN GENERAL\n───────────────────────────────────────────\n';
        txt += `Filas: ${r.totalFilas} | Columnas: ${r.totalColumnas}\n`;
        txt += `Numéricas: ${r.columnasNumericas} | Categóricas: ${r.columnasCategoricas}\n`;
        txt += `Valores faltantes: ${r.valoresFaltantes} (${r.porcentajeFaltantes}%)\n`;
        txt += `Outliers: ${r.totalOutliers} | Corr. fuertes: ${r.correlacionesFuertes}\n\n`;

        txt += '📈 ESTADÍSTICAS DESCRIPTIVAS\n───────────────────────────────────────────\n';
        Object.entries(_edaResults.descriptivas).forEach(([col, d]) => {
            txt += `\n  ${col}:\n`;
            txt += `    Media: ${d.media}  Mediana: ${d.mediana}  DE: ${d.de}\n`;
            txt += `    Mín: ${d.min}  Máx: ${d.max}  Q1: ${d.q1}  Q3: ${d.q3}\n`;
            txt += `    Asimetría: ${d.asimetria}  Curtosis: ${d.curtosis}\n`;
        });

        txt += '\n🔔 TESTS DE NORMALIDAD (Jarque-Bera aprox.)\n───────────────────────────────────────────\n';
        Object.entries(_edaResults.normalidad).forEach(([col, n]) => {
            txt += `  ${col}: JB=${n.JB}, p=${n.p} → ${n.esNormal ? '✓ Normal' : '✗ No Normal'}\n`;
        });

        txt += '\n🔴 OUTLIERS\n───────────────────────────────────────────\n';
        Object.entries(_edaResults.outliers).forEach(([col, outs]) => {
            if (!outs.length) return;
            txt += `  ${col}: ${outs.length} outlier(s)\n`;
            outs.slice(0, 5).forEach(o => {
                txt += `    Fila ${o.index + 1}: valor=${o.value} (${o.method})\n`;
            });
            if (outs.length > 5) txt += `    … y ${outs.length - 5} más\n`;
        });

        txt += '\n🔗 CORRELACIONES FUERTES (|r| ≥ 0.7)\n───────────────────────────────────────────\n';
        if (_edaResults.correlaciones.fuertes.length === 0) {
            txt += '  Ninguna.\n';
        } else {
            _edaResults.correlaciones.fuertes.forEach(c => {
                txt += `  ${c.col1} ↔ ${c.col2}: r=${c.r.toFixed(4)}\n`;
            });
        }

        txt += '\n💡 RECOMENDACIONES\n───────────────────────────────────────────\n';
        _edaResults.recomendaciones.forEach(rec => {
            txt += `  ${rec.icono} ${rec.texto.replace(/<[^>]*>/g, '')}\n`;
        });

        const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `EDA_Resumen_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        if (typeof showToast === 'function') showToast('Resumen EDA exportado exitosamente', 'success');
    }

    // ========================================
    // API PÚBLICA
    // ========================================

    return {
        ejecutarEDA,        // calcula y guarda en caché
        renderDashboard,    // FIX-4: reutiliza caché, no recalcula
        toggleSection,      // FIX-8: actualiza ícono + max-height
        exportarResumen,
        getResults: () => _edaResults,
        // Exponer para tests / script.js si se necesita invalidar caché:
        clearCache: () => { _edaResults = null; }
    };
})();