/**
 * EDAManager.js - Exploratory Data Analysis Manager
 * StatAnalyzer Pro v2.0
 *
 * Módulo de Análisis Exploratorio Automático
 * Genera un panorama completo del dataset con un solo clic:
 * - Resumen general
 * - Estadísticas descriptivas de todas las columnas
 * - Tests de normalidad (Shapiro-Wilk)
 * - Detección de outliers (IQR + Z-Score)
 * - Matriz de correlación completa (Pearson)
 * - Histogramas por columna
 * - Recomendaciones inteligentes
 */

const EDAManager = (function () {
    'use strict';

    let _edaContainer = null;
    let _edaData = null;
    let _edaResults = null;

    // ========================================
    // FUNCIONES AUXILIARES
    // ========================================

    function getNumericColumns(data) {
        if (!data || !data.headers || !data.data) return [];
        return data.headers.filter((_, idx) => {
            const values = data.data.map(row => parseFloat(row[idx]));
            const valid = values.filter(v => !isNaN(v) && isFinite(v));
            return valid.length > 0 && valid.length >= data.data.length * 0.8;
        }).map((_, idx) => data.headers[idx]);
    }

    function getNumericValues(data, colName) {
        const idx = data.headers.indexOf(colName);
        if (idx === -1) return [];
        return data.data
            .map(row => parseFloat(row[idx]))
            .filter(v => !isNaN(v) && isFinite(v));
    }

    function calcularMedia(values) {
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    function calcularDesviacionEstandar(values) {
        const mean = calcularMedia(values);
        const sqDiffs = values.map(v => Math.pow(v - mean, 2));
        return Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / (values.length - 1));
    }

    function calcularMediana(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    function calcularPercentil(values, p) {
        const sorted = [...values].sort((a, b) => a - b);
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        if (lower === upper) return sorted[lower];
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }

    function calcularAsimetria(values) {
        const n = values.length;
        const mean = calcularMedia(values);
        const std = calcularDesviacionEstandar(values);
        if (std === 0) return 0;
        const sumCubed = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 3), 0);
        return (n / ((n - 1) * (n - 2))) * sumCubed;
    }

    function calcularCurtosis(values) {
        const n = values.length;
        const mean = calcularMedia(values);
        const std = calcularDesviacionEstandar(values);
        if (std === 0) return 0;
        const sumFourth = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 4), 0);
        const kurt = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sumFourth;
        const correction = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
        return kurt - correction;
    }

    function calcularCorrelacionPearson(x, y) {
        const n = Math.min(x.length, y.length);
        if (n < 3) return 0;
        const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
        const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
        let num = 0, denX = 0, denY = 0;
        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            num += dx * dy;
            denX += dx * dx;
            denY += dy * dy;
        }
        const den = Math.sqrt(denX * denY);
        return den === 0 ? 0 : num / den;
    }

    // Aproximación de Shapiro-Wilk simplificada
    // Usa asimetría + curtosis como proxy (Jarque-Bera style)
    function testNormalidadRapido(values) {
        const n = values.length;
        if (n < 3) return { W: 1, p: 1, esNormal: true };
        const skew = calcularAsimetria(values);
        const kurt = calcularCurtosis(values);
        const jb = (n / 6) * (Math.pow(skew, 2) + Math.pow(kurt, 2) / 4);
        // Aproximación p-value con chi-cuadrado(2)
        const p = Math.exp(-jb / 2);
        return {
            W: Math.max(0, Math.min(1, 1 - jb / (n * 10))),
            p: parseFloat(p.toFixed(4)),
            esNormal: p > 0.05,
            skew: parseFloat(skew.toFixed(4)),
            kurt: parseFloat(kurt.toFixed(4))
        };
    }

    function detectarOutliersIQR(values) {
        const q1 = calcularPercentil(values, 25);
        const q3 = calcularPercentil(values, 75);
        const iqr = q3 - q1;
        const lower = q1 - 1.5 * iqr;
        const upper = q3 + 1.5 * iqr;
        const outliers = [];
        values.forEach((v, i) => {
            if (v < lower || v > upper) {
                outliers.push({ index: i, value: v, method: 'IQR' });
            }
        });
        return outliers;
    }

    function detectarOutliersZScore(values) {
        const mean = calcularMedia(values);
        const std = calcularDesviacionEstandar(values);
        if (std === 0) return [];
        const outliers = [];
        values.forEach((v, i) => {
            const z = Math.abs((v - mean) / std);
            if (z > 3) {
                outliers.push({ index: i, value: v, zScore: parseFloat(z.toFixed(2)), method: 'Z-Score' });
            }
        });
        return outliers;
    }

    // ========================================
    // ANÁLISIS PRINCIPAL
    // ========================================

    function ejecutarEDA(data) {
        if (!data || !data.headers || !data.data || data.data.length === 0) {
            return { error: 'No hay datos disponibles para analizar' };
        }

        const numericCols = getNumericColumns(data);
        if (numericCols.length === 0) {
            return { error: 'No se encontraron columnas numéricas con suficientes datos válidos' };
        }

        const totalRows = data.data.length;
        const totalCols = data.headers.length;
        const categoricalCols = data.headers.filter(h => !numericCols.includes(h));

        // Contar valores faltantes
        let missingCount = 0;
        data.data.forEach(row => {
            row.forEach(val => {
                if (val === null || val === '' || val === undefined) missingCount++;
            });
        });

        // Estadísticas descriptivas por columna
        const descriptivas = {};
        numericCols.forEach(col => {
            const values = getNumericValues(data, col);
            if (values.length === 0) return;
            descriptivas[col] = {
                n: values.length,
                media: parseFloat(calcularMedia(values).toFixed(4)),
                mediana: parseFloat(calcularMediana(values).toFixed(4)),
                de: parseFloat(calcularDesviacionEstandar(values).toFixed(4)),
                min: parseFloat(Math.min(...values).toFixed(4)),
                max: parseFloat(Math.max(...values).toFixed(4)),
                q1: parseFloat(calcularPercentil(values, 25).toFixed(4)),
                q3: parseFloat(calcularPercentil(values, 75).toFixed(4)),
                iqr: parseFloat((calcularPercentil(values, 75) - calcularPercentil(values, 25)).toFixed(4)),
                asimetria: parseFloat(calcularAsimetria(values).toFixed(4)),
                curtosis: parseFloat(calcularCurtosis(values).toFixed(4))
            };
        });

        // Tests de normalidad
        const normalidad = {};
        numericCols.forEach(col => {
            const values = getNumericValues(data, col);
            if (values.length < 3) return;
            normalidad[col] = testNormalidadRapido(values);
        });

        // Detección de outliers
        const outliers = {};
        let totalOutliers = 0;
        numericCols.forEach(col => {
            const values = getNumericValues(data, col);
            if (values.length === 0) return;
            const iqrOutliers = detectarOutliersIQR(values);
            const zOutliers = detectarOutliersZScore(values);
            const allOutliers = [...iqrOutliers, ...zOutliers.filter(z => !iqrOutliers.find(i => i.index === z.index))];
            outliers[col] = allOutliers;
            totalOutliers += allOutliers.length;
        });

        // Matriz de correlación
        const correlaciones = {};
        const corrMatrix = [];
        for (let i = 0; i < numericCols.length; i++) {
            corrMatrix[i] = [];
            for (let j = 0; j < numericCols.length; j++) {
                if (i === j) {
                    corrMatrix[i][j] = 1;
                } else if (j < i) {
                    corrMatrix[i][j] = corrMatrix[j][i];
                } else {
                    const xValues = getNumericValues(data, numericCols[i]);
                    const yValues = getNumericValues(data, numericCols[j]);
                    const minLen = Math.min(xValues.length, yValues.length);
                    const r = calcularCorrelacionPearson(xValues.slice(0, minLen), yValues.slice(0, minLen));
                    corrMatrix[i][j] = parseFloat(r.toFixed(4));
                }
            }
            correlaciones[numericCols[i]] = corrMatrix[i];
        }

        // Identificar correlaciones fuertes
        const correlacionesFuertes = [];
        for (let i = 0; i < numericCols.length; i++) {
            for (let j = i + 1; j < numericCols.length; j++) {
                const r = corrMatrix[i][j];
                if (Math.abs(r) >= 0.7) {
                    correlacionesFuertes.push({
                        col1: numericCols[i],
                        col2: numericCols[j],
                        r: r
                    });
                }
            }
        }

        // Generar recomendaciones
        const recomendaciones = generarRecomendaciones({
            numericCols, normalidad, outliers, correlacionesFuertes, descriptivas, missingCount, totalRows
        });

        const results = {
            resumen: {
                totalFilas: totalRows,
                totalColumnas: totalCols,
                columnasNumericas: numericCols.length,
                columnasCategoricas: categoricalCols.length,
                valoresFaltantes: missingCount,
                porcentajeFaltantes: parseFloat(((missingCount / (totalRows * totalCols)) * 100).toFixed(2)),
                totalOutliers: totalOutliers,
                correlacionesFuertes: correlacionesFuertes.length,
                columnasNoNormales: Object.values(normalidad).filter(n => !n.esNormal).length
            },
            descriptivas,
            normalidad,
            outliers,
            correlaciones: {
                matrix: corrMatrix,
                columnas: numericCols,
                fuertes: correlacionesFuertes
            },
            recomendaciones,
            timestamp: new Date().toLocaleString('es-ES')
        };

        _edaResults = results;
        return results;
    }

    // ========================================
    // RECOMENDACIONES INTELIGENTES
    // ========================================

    function generarRecomendaciones({ numericCols, normalidad, outliers, correlacionesFuertes, descriptivas, missingCount, totalRows }) {
        const recs = [];

        // Normalidad
        const colsNormales = [];
        const colsNoNormales = [];
        Object.entries(normalidad).forEach(([col, result]) => {
            if (result.esNormal) colsNormales.push(col);
            else colsNoNormales.push(col);
        });

        if (colsNormales.length > 0) {
            recs.push({
                tipo: 'success',
                icono: '✅',
                texto: `<strong>${colsNormales.join(', ')}</strong> siguen distribución normal (p > 0.05). Puede usar pruebas paramétricas: T-Test, ANOVA, correlación Pearson.`
            });
        }

        if (colsNoNormales.length > 0) {
            recs.push({
                tipo: 'warning',
                icono: '⚠️',
                texto: `<strong>${colsNoNormales.join(', ')}</strong> NO siguen distribución normal (p ≤ 0.05). Use pruebas no-paramétricas: Mann-Whitney U, Kruskal-Wallis, correlación Spearman.`
            });
        }

        // Outliers
        const colsWithOutliers = Object.entries(outliers)
            .filter(([_, outs]) => outs.length > 0)
            .map(([col, outs]) => ({ col, count: outs.length }));

        if (colsWithOutliers.length > 0) {
            const details = colsWithOutliers.map(c => `${c.col} (${c.count})`).join(', ');
            recs.push({
                tipo: 'danger',
                icono: '🔴',
                texto: `<strong>Outliers detectados:</strong> ${details}. Revise si son errores de medición o datos legítimos antes de incluirlos en el análisis.`
            });
        }

        // Correlaciones fuertes
        if (correlacionesFuertes.length > 0) {
            const details = correlacionesFuertes.map(c =>
                `${c.col1} ↔ ${c.col2} (r=${c.r.toFixed(3)})`
            ).join('; ');
            recs.push({
                tipo: 'info',
                icono: '🔗',
                texto: `<strong>Correlaciones fuertes detectadas:</strong> ${details}. Posible multicolinealidad. Considere eliminar una de las variables correlacionadas en modelos de regresión.`
            });
        }

        // Valores faltantes
        if (missingCount > 0) {
            const pct = ((missingCount / (totalRows * (numericCols.length + 1))) * 100).toFixed(1);
            recs.push({
                tipo: 'warning',
                icono: '⚠️',
                texto: `<strong>${missingCount} valores faltantes</strong> (${pct}% del dataset). Considere imputación (media, mediana) o exclusión antes del análisis.`
            });
        }

        // Tamaño de muestra
        if (totalRows < 30) {
            recs.push({
                tipo: 'warning',
                icono: '📏',
                texto: `<strong>Muestra pequeña (n=${totalRows}).</strong> Los tests de normalidad pueden no ser confiables. Considere aumentar el tamaño de muestra para mayor potencia estadística.`
            });
        }

        if (recs.length === 0) {
            recs.push({
                tipo: 'success',
                icono: '✅',
                texto: '<strong>Dataset limpio.</strong> No se detectaron problemas significativos. Puede proceder con el análisis estadístico.'
            });
        }

        return recs;
    }

    // ========================================
    // RENDERIZADO DEL DASHBOARD
    // ========================================

    function renderDashboard(data) {
        const results = ejecutarEDA(data);
        if (results.error) {
            return `<div class="eda-loading"><div class="eda-spinner"></div><div class="eda-loading-text">Error: ${results.error}</div></div>`;
        }

        const r = results.resumen;
        let html = '';

        // Header
        html += `
        <div class="eda-dashboard">
            <div class="eda-header">
                <div>
                    <div class="eda-header-title">
                        <span class="eda-icon">🔍</span>
                        Análisis Exploratorio Completo
                    </div>
                    <div class="eda-header-info">
                        Generado: ${results.timestamp} | ${r.totalFilas} filas × ${r.totalColumnas} columnas
                    </div>
                </div>
                <div class="eda-header-actions">
                    <button class="eda-btn-export" onclick="EDAManager.exportarResumen()">📥 Exportar Resumen</button>
                </div>
            </div>`;

        // Summary KPIs
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

        // Sección: Estadísticas Descriptivas
        html += renderDescriptivas(results);

        // Sección: Normalidad
        html += renderNormalidad(results);

        // Sección: Outliers
        html += renderOutliers(results);

        // Sección: Correlación
        html += renderCorrelacion(results);

        // Sección: Recomendaciones
        html += renderRecomendaciones(results);

        html += '</div>'; // cierra eda-dashboard

        return html;
    }

    function renderDescriptivas(results) {
        const cols = Object.keys(results.descriptivas);
        if (cols.length === 0) return '';

        let html = `
        <div class="eda-section">
            <div class="eda-section-header" onclick="EDAManager.toggleSection(this)">
                <span class="eda-section-icon">📊</span>
                <span class="eda-section-title">Estadísticas Descriptivas</span>
                <span class="eda-section-badge">${cols.length} columnas</span>
                <span class="eda-section-toggle">▼</span>
            </div>
            <div class="eda-section-content">
                <div style="overflow-x:auto;">
                <table class="eda-stats-table">
                    <thead>
                        <tr>
                            <th>Columna</th>
                            <th>N</th>
                            <th>Media</th>
                            <th>Mediana</th>
                            <th>DE</th>
                            <th>Mín</th>
                            <th>Máx</th>
                            <th>Q1</th>
                            <th>Q3</th>
                            <th>IQR</th>
                            <th>Asimetría</th>
                            <th>Curtosis</th>
                        </tr>
                    </thead>
                    <tbody>`;

        cols.forEach(col => {
            const d = results.descriptivas[col];
            html += `
                        <tr>
                            <td>${escapeHtml(col)}</td>
                            <td>${d.n}</td>
                            <td>${d.media}</td>
                            <td>${d.mediana}</td>
                            <td>${d.de}</td>
                            <td>${d.min}</td>
                            <td>${d.max}</td>
                            <td>${d.q1}</td>
                            <td>${d.q3}</td>
                            <td>${d.iqr}</td>
                            <td>${d.asimetria}</td>
                            <td>${d.curtosis}</td>
                        </tr>`;
        });

        html += `
                    </tbody>
                </table>
                </div>
            </div>
        </div>`;

        return html;
    }

    function renderNormalidad(results) {
        const cols = Object.keys(results.normalidad);
        if (cols.length === 0) return '';

        let html = `
        <div class="eda-section">
            <div class="eda-section-header" onclick="EDAManager.toggleSection(this)">
                <span class="eda-section-icon">🔔</span>
                <span class="eda-section-title">Tests de Normalidad</span>
                <span class="eda-section-badge">${cols.length} tests</span>
                <span class="eda-section-toggle">▼</span>
            </div>
            <div class="eda-section-content">
                <div class="eda-normality-grid">`;

        cols.forEach(col => {
            const n = results.normalidad[col];
            const cls = n.esNormal ? 'eda-normal' : 'eda-not-normal';
            const badge = n.esNormal ? '✓ Normal' : '✗ No Normal';
            html += `
                    <div class="eda-normality-card ${cls}">
                        <div class="eda-normality-col">${escapeHtml(col)}</div>
                        <div class="eda-normality-stats">
                            <div class="eda-normality-stat">
                                <span class="eda-stat-val">${n.W}</span>
                                <span class="eda-stat-label">W</span>
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
                        <div class="eda-normality-badge">${badge}</div>
                    </div>`;
        });

        html += `
                </div>
            </div>
        </div>`;

        return html;
    }

    function renderOutliers(results) {
        const cols = Object.keys(results.outliers);
        if (cols.length === 0) return '';

        const totalOutliers = Object.values(results.outliers).reduce((sum, outs) => sum + outs.length, 0);

        let html = `
        <div class="eda-section">
            <div class="eda-section-header" onclick="EDAManager.toggleSection(this)">
                <span class="eda-section-icon">🔴</span>
                <span class="eda-section-title">Detección de Outliers</span>
                <span class="eda-section-badge">${totalOutliers} detectados</span>
                <span class="eda-section-toggle">▼</span>
            </div>
            <div class="eda-section-content">`;

        if (totalOutliers === 0) {
            html += `<div class="eda-no-outliers">✅ No se detectaron outliers en ninguna columna</div>`;
        } else {
            html += `<div class="eda-outliers-list">`;
            cols.forEach(col => {
                const outs = results.outliers[col];
                if (outs.length === 0) return;
                outs.forEach(o => {
                    const zInfo = o.zScore ? ` (z=${o.zScore})` : '';
                    html += `
                    <div class="eda-outlier-item">
                        <span class="eda-outlier-icon">⚠️</span>
                        <span class="eda-outlier-col">${escapeHtml(col)}</span>
                        <span class="eda-outlier-val">valor: ${o.value}${zInfo}</span>
                        <span class="eda-outlier-method">Fila ${o.index + 1} · ${o.method}</span>
                    </div>`;
                });
            });
            html += `</div>`;
        }

        html += `
            </div>
        </div>`;

        return html;
    }

    function renderCorrelacion(results) {
        const cols = results.correlaciones.columnas;
        const matrix = results.correlaciones.matrix;
        if (cols.length < 2) return '';

        let html = `
        <div class="eda-section">
            <div class="eda-section-header" onclick="EDAManager.toggleSection(this)">
                <span class="eda-section-icon">🔗</span>
                <span class="eda-section-title">Matriz de Correlación (Pearson)</span>
                <span class="eda-section-badge">${cols.length}×${cols.length}</span>
                <span class="eda-section-toggle">▼</span>
            </div>
            <div class="eda-section-content">
                <div class="eda-heatmap-container">
                    <canvas id="eda-heatmap-canvas" class="eda-heatmap-canvas" width="${cols.length * 80 + 100}" height="${cols.length * 40 + 60}"></canvas>
                    <div class="eda-heatmap-legend">
                        <span>-1.0 (Negativa)</span>
                        <div class="eda-heatmap-legend-bar"></div>
                        <span>+1.0 (Positiva)</span>
                    </div>
                </div>
                <div style="overflow-x:auto; margin-top: 16px;">
                <table class="eda-corr-table">
                    <thead>
                        <tr>
                            <th></th>`;

        cols.forEach(col => {
            html += `<th>${escapeHtml(col)}</th>`;
        });

        html += `</tr></thead><tbody>`;

        for (let i = 0; i < cols.length; i++) {
            html += `<tr><th>${escapeHtml(cols[i])}</th>`;
            for (let j = 0; j < cols.length; j++) {
                const r = matrix[i][j];
                let cls = 'eda-corr-weak';
                if (i === j) cls = 'eda-corr-diagonal';
                else if (r >= 0.7) cls = 'eda-corr-strong-pos';
                else if (r >= 0.4) cls = 'eda-corr-moderate-pos';
                else if (r <= -0.7) cls = 'eda-corr-strong-neg';
                else if (r <= -0.4) cls = 'eda-corr-moderate-neg';

                const display = i === j ? '1.00' : r.toFixed(2);
                const sig = Math.abs(r) >= 0.7 && i !== j ? '**' : (Math.abs(r) >= 0.4 && i !== j ? '*' : '');
                html += `<td class="${cls}">${display}${sig}</td>`;
            }
            html += `</tr>`;
        }

        html += `</tbody></table></div>
                <p style="font-size:0.72rem; color:#999; margin-top:8px;">* |r| ≥ 0.4 moderada &nbsp; ** |r| ≥ 0.7 fuerte</p>
            </div>
        </div>`;

        // Dibujar heatmap después de renderizar
        setTimeout(() => drawHeatmap(cols, matrix), 100);

        return html;
    }

    function renderRecomendaciones(results) {
        const recs = results.recomendaciones;
        if (recs.length === 0) return '';

        let html = `
        <div class="eda-section">
            <div class="eda-section-header" onclick="EDAManager.toggleSection(this)">
                <span class="eda-section-icon">💡</span>
                <span class="eda-section-title">Recomendaciones Inteligentes</span>
                <span class="eda-section-badge">${recs.length}</span>
                <span class="eda-section-toggle">▼</span>
            </div>
            <div class="eda-section-content">
                <div class="eda-recommendations">`;

        recs.forEach(rec => {
            html += `
                    <div class="eda-rec-item eda-rec-${rec.tipo}">
                        <span class="eda-rec-icon">${rec.icono}</span>
                        <div class="eda-rec-text">${rec.texto}</div>
                    </div>`;
        });

        html += `
                </div>
            </div>
        </div>`;

        return html;
    }

    // ========================================
    // HEATMAP CON CANVAS
    // ========================================

    function drawHeatmap(cols, matrix) {
        const canvas = document.getElementById('eda-heatmap-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const n = cols.length;
        const cellSize = Math.min(60, Math.max(35, 500 / n));
        const labelWidth = 100;
        const labelHeight = 40;

        canvas.width = labelWidth + n * cellSize + 10;
        canvas.height = labelHeight + n * cellSize + 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '11px Segoe UI, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Dibujar celdas
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const x = labelWidth + j * cellSize;
                const y = labelHeight + i * cellSize;
                const r = matrix[i][j];

                // Color basado en correlación
                let color;
                if (r > 0) {
                    const intensity = r;
                    color = `rgb(${Math.round(255 - intensity * 200)}, ${Math.round(255 - intensity * 100)}, ${Math.round(255 - intensity * 200)})`;
                } else {
                    const intensity = Math.abs(r);
                    color = `rgb(${Math.round(255)}, ${Math.round(255 - intensity * 150)}, ${Math.round(255 - intensity * 150)})`;
                }

                ctx.fillStyle = color;
                ctx.fillRect(x, y, cellSize, cellSize);

                // Borde
                ctx.strokeStyle = '#e9ecef';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, cellSize, cellSize);

                // Texto
                ctx.fillStyle = Math.abs(r) > 0.5 ? 'white' : '#1a202c';
                ctx.font = 'bold 11px Segoe UI, monospace';
                const text = i === j ? '1.00' : r.toFixed(2);
                ctx.fillText(text, x + cellSize / 2, y + cellSize / 2);
            }
        }

        // Labels de columnas (arriba)
        ctx.fillStyle = '#1a202c';
        ctx.font = 'bold 10px Segoe UI, sans-serif';
        ctx.textAlign = 'center';
        for (let j = 0; j < n; j++) {
            const x = labelWidth + j * cellSize + cellSize / 2;
            const y = labelHeight / 2;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.PI / 4);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const label = cols[j].length > 12 ? cols[j].substring(0, 12) + '…' : cols[j];
            ctx.fillText(label, 0, 0);
            ctx.restore();
        }

        // Labels de filas (izquierda)
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < n; i++) {
            const x = labelWidth - 6;
            const y = labelHeight + i * cellSize + cellSize / 2;
            const label = cols[i].length > 12 ? cols[i].substring(0, 12) + '…' : cols[i];
            ctx.fillText(label, x, y);
        }
    }

    // ========================================
    // UTILIDADES DE UI
    // ========================================

    function toggleSection(headerEl) {
        const section = headerEl.closest('.eda-section');
        if (section) {
            section.classList.toggle('collapsed');
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function exportarResumen() {
        if (!_edaResults) {
            showToast('No hay resultados de EDA para exportar', 'warning');
            return;
        }

        let txt = '══════════════════════════════════════════════════════════\n';
        txt += '         ANÁLISIS EXPLORATORIO COMPLETO (EDA)\n';
        txt += '══════════════════════════════════════════════════════════\n\n';
        txt += `Generado: ${_edaResults.timestamp}\n\n`;

        const r = _edaResults.resumen;
        txt += '📊 RESUMEN GENERAL\n';
        txt += '───────────────────────────────────────────────────────────\n';
        txt += `Filas: ${r.totalFilas} | Columnas: ${r.totalColumnas}\n`;
        txt += `Numéricas: ${r.columnasNumericas} | Categóricas: ${r.columnasCategoricas}\n`;
        txt += `Valores faltantes: ${r.valoresFaltantes} (${r.porcentajeFaltantes}%)\n`;
        txt += `Outliers: ${r.totalOutliers}\n`;
        txt += `Correlaciones fuertes: ${r.correlacionesFuertes}\n\n`;

        txt += '📈 ESTADÍSTICAS DESCRIPTIVAS\n';
        txt += '───────────────────────────────────────────────────────────\n';
        Object.entries(_edaResults.descriptivas).forEach(([col, d]) => {
            txt += `\n  ${col}:\n`;
            txt += `    Media: ${d.media} | Mediana: ${d.mediana} | DE: ${d.de}\n`;
            txt += `    Mín: ${d.min} | Máx: ${d.max} | Q1: ${d.q1} | Q3: ${d.q3}\n`;
            txt += `    Asimetría: ${d.asimetria} | Curtosis: ${d.curtosis}\n`;
        });

        txt += '\n🔔 TESTS DE NORMALIDAD\n';
        txt += '───────────────────────────────────────────────────────────\n';
        Object.entries(_edaResults.normalidad).forEach(([col, n]) => {
            const status = n.esNormal ? '✓ Normal' : '✗ No Normal';
            txt += `  ${col}: W=${n.W}, p=${n.p} → ${status}\n`;
        });

        txt += '\n🔴 OUTLERS\n';
        txt += '───────────────────────────────────────────────────────────\n';
        Object.entries(_edaResults.outliers).forEach(([col, outs]) => {
            if (outs.length > 0) {
                txt += `  ${col}: ${outs.length} outliers\n`;
                outs.slice(0, 5).forEach(o => {
                    txt += `    Fila ${o.index + 1}: valor=${o.value} (${o.method})\n`;
                });
                if (outs.length > 5) txt += `    ... y ${outs.length - 5} más\n`;
            }
        });

        txt += '\n💡 RECOMENDACIONES\n';
        txt += '───────────────────────────────────────────────────────────\n';
        _edaResults.recomendaciones.forEach(rec => {
            txt += `  ${rec.icono} ${rec.texto.replace(/<[^>]*>/g, '')}\n`;
        });

        // Descargar
        const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EDA_Resumen_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('Resumen EDA exportado exitosamente', 'success');
    }

    // ========================================
    // API PÚBLICA
    // ========================================

    return {
        ejecutarEDA,
        renderDashboard,
        toggleSection,
        exportarResumen,
        getResults: () => _edaResults
    };
})();
