/**
 * EDAManager.js - Exploratory Data Analysis Manager
 * StatAnalyzer Pro v2.2 — REFACTORIZADO CON STATSUTILS
 *
 * CAMBIOS PRINCIPALES (v2.2):
 *  REF-1: Eliminada duplicación de funciones estadísticas. Ahora delega
 *          en StatsUtils.js (módulo centralizado compartido).
 *  REF-2: getNumericColumns unificado con StatsUtils.getNumericColumns()
 *          manteniendo el umbral 30% específico de EDA.
 *  REF-3: Outliers usan StatsUtils con formato detallado consistente.
 *  REF-4: Correlación usa StatsUtils.calcularCorrelacionPearson().
 *
 * FIXES PREVIOS MANTENIDOS (v2.1):
 *  FIX-1  getNumericColumns corregido (índice original vs filtrado).
 *  FIX-2  missingCount solo cuenta celdas genuinamente vacías.
 *  FIX-3  XSS prevenido con escHtml() en nombres de columnas.
 *  FIX-4  renderDashboard reutiliza caché, no ejecuta EDA dos veces.
 *  FIX-5  Correlación con pares alineados por fila (getAlignedPairs).
 *  FIX-6  Test de normalidad renombrado a Jarque-Bera (no Shapiro-Wilk).
 *  FIX-7  ValuesCache construido una vez, reutilizado en todo el análisis.
 *  FIX-8  toggleSection actualiza ícono + max-height por JS.
 *  FIX-9  drawHeatmap usa MutationObserver en lugar de setTimeout.
 */

const EDAManager = (function () {
    'use strict';

    // ── Estado interno ────────────────────────────────────────────────────────
    let _edaResults = null;  // caché del último análisis ejecutado

    // ========================================
    // REF-1 : DELEGACIÓN A STATSUTILS
    // ========================================

    /**
     * Todas las funciones estadísticas genéricas se delegan a StatsUtils.
     * Esto elimina duplicación con EstadisticaDescriptiva.js y centraliza
     * la lógica estadística en un único módulo mantenible y testeable.
     *
     * Funciones delegadas:
     * - calcularMedia, calcularMediana, calcularDesviacionEstandar
     * - calcularPercentil, calcularAsimetria, calcularCurtosis
     * - calcularCorrelacionPearson
     * - detectarOutliersIQR, detectarOutliersZScore
     */

    const Stats = StatsUtils;

    // ========================================
    // FIX-1 / REF-2 : UTILIDADES BASE
    // ========================================

    /**
     * FIX-1 / REF-2: Usa StatsUtils.getNumericColumns con umbral 30%
     * específico para EDA (tolera datasets pequeños con algún nulo).
     * El umbral por defecto de StatsUtils es 80%, por eso se pasa options.
     */
    function getNumericColumns(data) {
        return Stats.getNumericColumns(data, {
            threshold: 0.3,
            excludeColumns: ['#', 'Row', 'row', 'INDEX', 'index', 'row_index', 'No.', 'N°']
        });
    }

    /**
     * FIX-7: caché de valores numéricos por columna.
     * Usa StatsUtils.getNumericValues internamente.
     */
    function buildValuesCache(data, numCols) {
        const cache = {};
        numCols.forEach(col => {
            cache[col] = Stats.getNumericValues(data, col);
        });
        return cache;
    }

    // ========================================
    // FIX-5 : CORRELACIÓN CON PARES ALINEADOS
    // ========================================

    /**
     * FIX-5: filtra las dos columnas juntas para que solo se incluyan
     * filas donde AMBAS tienen valor numérico válido.
     * Usa StatsUtils.calcularCorrelacionPearson para el cálculo.
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

    // ========================================
    // FIX-6 : TEST DE NORMALIDAD (JARQUE-BERA)
    // ========================================

    /**
     * FIX-6: calcula Jarque-Bera usando StatsUtils para asimetría y curtosis.
     * Presentado honestamente como "JB" (no como W de Shapiro-Wilk).
     */
    function testNormalidadJB(values) {
        const n = values.length;
        if (n < 3) return { JB: 0, p: 1, esNormal: true, skew: 0, kurt: 0 };

        const skew = Stats.calcularAsimetria(values);
        const kurt = Stats.calcularCurtosis(values);

        // Estadístico Jarque-Bera: JB = (n/6) * (S² + K²/4)
        const jb = (n / 6) * (Math.pow(skew, 2) + Math.pow(kurt, 2) / 4);
        // Aproximación p-value con distribución chi-cuadrado(2 grados)
        const p = Math.exp(-jb / 2);

        return {
            JB:       parseFloat(jb.toFixed(4)),
            p:        parseFloat(Math.min(1, Math.max(0, p)).toFixed(4)),
            esNormal: p > 0.05,
            skew:     parseFloat(skew.toFixed(4)),
            kurt:     parseFloat(kurt.toFixed(4))
        };
    }

    // ========================================
    // FIX-2 / FIX-3 / FIX-7 : ANÁLISIS PRINCIPAL
    // ========================================

    function ejecutarEDA(data) {
        if (!data || !data.headers || !data.data || data.data.length === 0) {
            return { error: 'No hay datos disponibles para analizar.' };
        }

        const numericCols     = getNumericColumns(data);
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

        // ── Estadísticas descriptivas (usando StatsUtils) ──────────────────
        const descriptivas = {};
        numericCols.forEach(col => {
            const values = valCache[col];
            if (!values.length) return;
            descriptivas[col] = {
                n:        values.length,
                media:    parseFloat(Stats.calcularMedia(values).toFixed(4)),
                mediana:  parseFloat(Stats.calcularMediana(values).toFixed(4)),
                de:       parseFloat(Stats.calcularDesviacionEstandar(values).toFixed(4)),
                min:      parseFloat(Math.min(...values).toFixed(4)),
                max:      parseFloat(Math.max(...values).toFixed(4)),
                q1:       parseFloat(Stats.calcularPercentil(values, 25).toFixed(4)),
                q3:       parseFloat(Stats.calcularPercentil(values, 75).toFixed(4)),
                iqr:      parseFloat((Stats.calcularPercentil(values, 75) - Stats.calcularPercentil(values, 25)).toFixed(4)),
                asimetria:parseFloat(Stats.calcularAsimetria(values).toFixed(4)),
                curtosis: parseFloat(Stats.calcularCurtosis(values).toFixed(4))
            };
        });

        // ── Tests de normalidad (5 tests completos) ────────────────────────
        const normalidad = {};
        const normalidadShapiro = {};
        const normalidadKS = {};
        const normalidadAD = {};
        const normalidadDP = {};
        numericCols.forEach(col => {
            const values = valCache[col];
            if (values.length < 3) return;
            normalidad[col] = testNormalidadJB(values);
            if (values.length >= 3 && values.length <= 5000) {
                normalidadShapiro[col] = EstadisticaDescriptiva.calcularShapiroWilk(values);
            }
            if (values.length >= 5) {
                normalidadKS[col] = EstadisticaDescriptiva.calcularKolmogorovSmirnov(values);
            }
            if (values.length >= 8) {
                normalidadAD[col] = EstadisticaDescriptiva.calcularAndersonDarling(values);
                normalidadDP[col] = EstadisticaDescriptiva.calcularDAgostinoPearson(values);
            }
        });

        // ── Detección de outliers (usando StatsUtils) ──────────────────────
        const outliers    = {};
        let totalOutliers = 0;
        numericCols.forEach(col => {
            const values = valCache[col];
            if (!values.length) return;
            // REF-3: StatsUtils retorna array de objetos {index, value, method}
            const iqrOuts   = Stats.detectarOutliersIQR(values);
            const zOuts     = Stats.detectarOutliersZScore(values)
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
                    corrMatrix[i][j] = corrMatrix[j][i];
                } else {
                    const { x, y } = getAlignedPairs(data, numericCols[i], numericCols[j]);
                    // REF-4: delegar a StatsUtils
                    corrMatrix[i][j] = parseFloat(Stats.calcularCorrelacionPearson(x, y).toFixed(4));
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
            normalidadShapiro,
            normalidadKS,
            normalidadAD,
            normalidadDP,
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
            .map(([col, outs]) => `${escHtml(col)} (${outs.length})`);

        if (colsConOutliers.length > 0) {
            recs.push({
                tipo:  'danger',
                icono: '🔴',
                texto: `<strong>Outliers detectados:</strong> ${colsConOutliers.join(', ')}. Revise si son errores de medición o datos legítimos antes de incluirlos en el análisis.`
            });
        }

        if (correlacionesFuertes.length > 0) {
            const details = correlacionesFuertes.map(c =>
                `${escHtml(c.col1)} ↔ ${escHtml(c.col2)} (r=${c.r.toFixed(3)})`
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

    function renderDashboard(data) {
        const results = _edaResults || ejecutarEDA(data);

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
        html += renderNormalidad(results);
        html += renderOutliers(results);
        html += renderCorrelacion(results);
        html += renderRecomendaciones(results);

        html += '</div>';
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

        html += `</tbody></table></div></div></div>`;
        return html;
    }

    function renderNormalidad(results) {
        const cols = Object.keys(results.normalidad);
        if (!cols.length) return '';

        let html = buildSectionHeader('🔔', 'Tests de Normalidad (Comparativa)', `${cols.length} columnas`);
        html += `<div class="eda-section-content">
                 <p style="font-size:0.72rem;color:#888;margin:0 0 12px;">
                     Se aplicaron 5 tests de normalidad. H₀: la distribución es normal. Rechazar si p ≤ 0.05.
                     <strong>Verde</strong> = Normal, <strong>Rojo</strong> = No Normal.
                 </p>
                 <div style="overflow-x:auto;">
                 <table class="eda-stats-table" style="font-size:0.75rem;">
                     <thead><tr>
                         <th>Columna</th>
                         <th>Jarque-Bera (p)</th>
                         <th>Shapiro-Wilk (p)</th>
                         <th>Kolmogorov-Smirnov (p)</th>
                         <th>Anderson-Darling (p)</th>
                         <th>D'Agostino-Pearson (p)</th>
                         <th>Consenso</th>
                     </tr></thead><tbody>`;

        cols.forEach(col => {
            const jb = results.normalidad[col];
            const sw = results.normalidadShapiro?.[col];
            const ks = results.normalidadKS?.[col];
            const ad = results.normalidadAD?.[col];
            const dp = results.normalidadDP?.[col];

            // Calcular consenso (mayoría de tests dicen normal)
            const tests = [jb, sw, ks, ad, dp].filter(t => t && t.valorP !== undefined);
            const normalCount = tests.filter(t => t.esNormal).length;
            const totalTests = tests.length;
            const consensus = totalTests > 0 ? (normalCount / totalTests >= 0.5 ? 'normal' : 'no-normal') : 'unknown';

            const pValue = (t) => t ? (t.valorP !== undefined ? t.valorP.toFixed(4) : (t.p !== undefined ? t.p.toFixed(4) : '—')) : '—';
            const badgeClass = (t) => t ? (t.esNormal ? 'eda-kpi-ok' : 'eda-kpi-warn') : '';

            html += `<tr>
                <td><strong>${escHtml(col)}</strong></td>
                <td class="${badgeClass(jb)}">${pValue(jb)}${jb?.esNormal ? ' ✓' : ' ✗'}</td>
                <td class="${badgeClass(sw)}">${sw ? pValue(sw) + (sw.esNormal ? ' ✓' : ' ✗') : 'n/a'}</td>
                <td class="${badgeClass(ks)}">${ks ? pValue(ks) + (ks.esNormal ? ' ✓' : ' ✗') : 'n/a'}</td>
                <td class="${badgeClass(ad)}">${ad ? pValue(ad) + (ad.esNormal ? ' ✓' : ' ✗') : 'n/a'}</td>
                <td class="${badgeClass(dp)}">${dp ? pValue(dp) + (dp.esNormal ? ' ✓' : ' ✗') : 'n/a'}</td>
                <td style="text-align:center;">
                    <span class="eda-normality-badge ${consensus === 'normal' ? 'eda-normal' : 'eda-not-normal'}">
                        ${consensus === 'normal' ? '✓ Normal' : consensus === 'no-normal' ? '✗ No Normal' : '—'}
                    </span>
                </td>
            </tr>`;
        });

        html += `</tbody></table></div>
                 <p style="font-size:0.68rem;color:#999;margin-top:8px;">
                     n/a = tamaño de muestra insuficiente para ese test.
                     Jarque-Bera: n≥3, Shapiro-Wilk: 3≤n≤5000, Kolmogorov-Smirnov: n≥5, Anderson-Darling/D'Agostino: n≥8.
                 </p>
                 </div></div>`;
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

    function renderCorrelacion(results) {
        const cols   = results.correlaciones.columnas;
        const matrix = results.correlaciones.matrix;
        if (cols.length < 2) return '';

        const canvasId = `eda-heatmap-${Date.now()}`;

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
    // FIX-8 : TOGGLE SECTION
    // ========================================

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

    function _scheduleHeatmap(canvasId, cols, matrix) {
        const existing = document.getElementById(canvasId);
        if (existing) {
            drawHeatmap(existing, cols, matrix);
            return;
        }

        const observer = new MutationObserver(() => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                observer.disconnect();
                drawHeatmap(canvas, cols, matrix);
            }
        });

        const root = document.getElementById('eda-container') || document.body;
        observer.observe(root, { childList: true, subtree: true });
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

        ctx.textAlign    = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < n; i++) {
            ctx.fillText(_truncate(cols[i], 12), labelW - 6, labelH + i * cellSize + cellSize / 2);
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

    function escHtml(str) {
        const d = document.createElement('div');
        d.textContent = String(str);
        return d.innerHTML;
    }

    function buildSectionHeader(icon, title, badge) {
        return `
        <div class="eda-section">
            <div class="eda-section-header" onclick="EDAManager.toggleSection(this)">
                <span class="eda-section-icon">${icon}</span>
                <span class="eda-section-title">${title}</span>
                <span class="eda-section-badge">${badge}</span>
                <span class="eda-section-toggle">▼</span>
            </div>`;
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

        txt += '\n🔔 TESTS DE NORMALIDAD (5 tests comparativos)\n───────────────────────────────────────────\n';
        const allNormalityCols = new Set([
            ...Object.keys(_edaResults.normalidad || {}),
            ...Object.keys(_edaResults.normalidadShapiro || {}),
            ...Object.keys(_edaResults.normalidadKS || {}),
            ...Object.keys(_edaResults.normalidadAD || {}),
            ...Object.keys(_edaResults.normalidadDP || {})
        ]);
        allNormalityCols.forEach(col => {
            const jb = _edaResults.normalidad?.[col];
            const sw = _edaResults.normalidadShapiro?.[col];
            const ks = _edaResults.normalidadKS?.[col];
            const ad = _edaResults.normalidadAD?.[col];
            const dp = _edaResults.normalidadDP?.[col];
            const pVal = (t) => t ? (t.valorP !== undefined ? t.valorP.toFixed(4) : (t.p !== undefined ? t.p.toFixed(4) : '—')) : 'n/a';
            const status = (t) => t ? (t.esNormal ? '✓' : '✗') : '—';
            txt += `  ${col}:\n`;
            txt += `    Jarque-Bera:       p=${pVal(jb)} ${status(jb)}\n`;
            txt += `    Shapiro-Wilk:      p=${pVal(sw)} ${status(sw)}\n`;
            txt += `    Kolmogorov-Smirnov: p=${pVal(ks)} ${status(ks)}\n`;
            txt += `    Anderson-Darling:  p=${pVal(ad)} ${status(ad)}\n`;
            txt += `    D'Agostino-Pearson: p=${pVal(dp)} ${status(dp)}\n`;
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
        ejecutarEDA,
        renderDashboard,
        toggleSection,
        exportarResumen,
        getResults: () => _edaResults,
        clearCache: () => { _edaResults = null; }
    };
})();
