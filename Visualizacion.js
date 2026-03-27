// ========================================
// MÓDULO DE VISUALIZACIÓN - Visualizacion.js
// Chart.js debe estar cargado antes de este módulo
// ========================================

const Visualizacion = (() => {

    // Instancia activa del gráfico (solo uno a la vez)
    let chartInstance = null;

    // Paleta coherente con el diseño de la app
    const COLORS = {
        primary:   'rgba(102, 126, 234, 0.85)',
        secondary: 'rgba(118,  75, 162, 0.85)',
        accent:    'rgba( 67, 160,  71, 0.85)',
        danger:    'rgba(229,  57,  53, 0.85)',
        warning:   'rgba(251, 140,   0, 0.85)',
        info:      'rgba( 30, 136, 229, 0.85)',
        border: {
            primary:   'rgba(102, 126, 234, 1)',
            secondary: 'rgba(118,  75, 162, 1)',
            accent:    'rgba( 67, 160,  71, 1)',
            danger:    'rgba(229,  57,  53, 1)',
            warning:   'rgba(251, 140,   0, 1)',
            info:      'rgba( 30, 136, 229, 1)',
        }
    };

    const PALETTE = [
        'rgba(102,126,234,0.82)', 'rgba(118,75,162,0.82)',
        'rgba(67,160,71,0.82)',   'rgba(30,136,229,0.82)',
        'rgba(251,140,0,0.82)',   'rgba(229,57,53,0.82)',
        'rgba(0,172,193,0.82)',   'rgba(171,71,188,0.82)',
    ];
    const PALETTE_BORDER = PALETTE.map(c => c.replace('0.82', '1'));

    // ========================================
    // UTILIDADES INTERNAS
    // ========================================

    function getNumericColumns(data) {
        if (!data || !data.headers) return [];
        return data.headers.filter(h => {
            const vals = data.data.map(r => parseFloat(r[h])).filter(v => !isNaN(v));
            return vals.length / data.data.length > 0.7;
        });
    }

    function getAllColumns(data) {
        return data?.headers || [];
    }

    function getColumnValues(data, col) {
        return data.data.map(r => parseFloat(r[col])).filter(v => !isNaN(v) && isFinite(v));
    }

    function getColumnRawValues(data, col) {
        return data.data.map(r => r[col] || '');
    }

    function destroyChart() {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
    }

    function getCanvas() {
        return document.getElementById('viz-canvas');
    }

    // ========================================
    // OPCIONES BASE DE CHART.JS
    // ========================================

    function baseOptions(title = '') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 600, easing: 'easeInOutQuart' },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { family: "'Segoe UI', sans-serif", size: 12 },
                        color: '#555',
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 10
                    }
                },
                title: {
                    display: !!title,
                    text: title,
                    font: { family: "'Segoe UI', sans-serif", size: 14, weight: '600' },
                    color: '#333',
                    padding: { bottom: 16 }
                },
                tooltip: {
                    backgroundColor: 'rgba(30,30,40,0.92)',
                    titleFont: { family: "'Segoe UI', sans-serif", size: 12, weight: '600' },
                    bodyFont:  { family: "'Segoe UI', sans-serif", size: 11 },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 4
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                    ticks: {
                        font: { family: "'Segoe UI', sans-serif", size: 11 },
                        color: '#777',
                        maxRotation: 45
                    }
                },
                y: {
                    grid: { color: 'rgba(0,0,0,0.06)', drawBorder: false },
                    ticks: {
                        font: { family: "'Segoe UI', sans-serif", size: 11 },
                        color: '#777'
                    }
                }
            }
        };
    }

    // ========================================
    // TIPOS DE GRÁFICO
    // ========================================

    function renderBarras(data, colX, colY, horizontal = false) {
        const labels = getColumnRawValues(data, colX);
        const values = data.data.map(r => parseFloat(r[colY]));

        const cfg = {
            type: horizontal ? 'bar' : 'bar',
            data: {
                labels,
                datasets: [{
                    label: colY,
                    data: values,
                    backgroundColor: PALETTE,
                    borderColor: PALETTE_BORDER,
                    borderWidth: 1.5,
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                ...baseOptions(`${colY} por ${colX}`),
                indexAxis: horizontal ? 'y' : 'x',
            }
        };

        destroyChart();
        chartInstance = new Chart(getCanvas(), cfg);
    }

    function renderLineas(data, colX, colY, area = false) {
        const labels = getColumnRawValues(data, colX);
        const values = data.data.map(r => parseFloat(r[colY]));

        const cfg = {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: colY,
                    data: values,
                    borderColor: COLORS.border.primary,
                    backgroundColor: area
                        ? 'rgba(102,126,234,0.15)'
                        : 'rgba(102,126,234,0)',
                    borderWidth: 2.5,
                    pointRadius: values.length > 80 ? 0 : 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: COLORS.border.primary,
                    tension: 0.35,
                    fill: area,
                }]
            },
            options: baseOptions(`${colY} a lo largo de ${colX}`)
        };

        destroyChart();
        chartInstance = new Chart(getCanvas(), cfg);
    }

    function renderDispersion(data, colX, colY) {
        const points = data.data
            .map(r => ({
                x: parseFloat(r[colX]),
                y: parseFloat(r[colY])
            }))
            .filter(p => !isNaN(p.x) && !isNaN(p.y));

        const cfg = {
            type: 'scatter',
            data: {
                datasets: [{
                    label: `${colX} vs ${colY}`,
                    data: points,
                    backgroundColor: COLORS.primary,
                    borderColor: COLORS.border.primary,
                    borderWidth: 1,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                }]
            },
            options: {
                ...baseOptions(`Dispersión: ${colX} vs ${colY}`),
                scales: {
                    x: {
                        ...baseOptions().scales.x,
                        title: {
                            display: true,
                            text: colX,
                            font: { size: 12, weight: '500' },
                            color: '#555'
                        }
                    },
                    y: {
                        ...baseOptions().scales.y,
                        title: {
                            display: true,
                            text: colY,
                            font: { size: 12, weight: '500' },
                            color: '#555'
                        }
                    }
                }
            }
        };

        destroyChart();
        chartInstance = new Chart(getCanvas(), cfg);
    }

    function renderHistograma(data, colX, bins = 10) {
        const values = getColumnValues(data, colX);
        if (values.length === 0) throw new Error(`"${colX}" no tiene valores numéricos.`);

        const min = Math.min(...values);
        const max = Math.max(...values);
        const binSize = (max - min) / bins;

        const counts = Array(bins).fill(0);
        const labels = [];

        for (let i = 0; i < bins; i++) {
            const lo = min + i * binSize;
            const hi = lo + binSize;
            labels.push(`${lo.toFixed(2)}–${hi.toFixed(2)}`);
            values.forEach(v => {
                if (v >= lo && (v < hi || (i === bins - 1 && v <= hi))) counts[i]++;
            });
        }

        const cfg = {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: `Frecuencia de ${colX}`,
                    data: counts,
                    backgroundColor: COLORS.primary,
                    borderColor: COLORS.border.primary,
                    borderWidth: 1,
                    borderRadius: 3,
                    borderSkipped: false,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,
                }]
            },
            options: {
                ...baseOptions(`Histograma de ${colX}`),
                plugins: {
                    ...baseOptions().plugins,
                    tooltip: {
                        ...baseOptions().plugins.tooltip,
                        callbacks: {
                            label: ctx => ` ${ctx.raw} observaciones`
                        }
                    }
                }
            }
        };

        destroyChart();
        chartInstance = new Chart(getCanvas(), cfg);
    }

    function renderBoxPlot(data, columnas) {
        // Box plot manual con Chart.js (sin plugin externo)
        // Se dibuja usando un plugin personalizado inline
        if (columnas.length === 0) throw new Error('Selecciona al menos una columna.');

        const datasets = columnas.map((col, i) => {
            const vals = getColumnValues(data, col).sort((a, b) => a - b);
            const n    = vals.length;
            if (n === 0) return null;

            const q1  = percentil(vals, 25);
            const med = percentil(vals, 50);
            const q3  = percentil(vals, 75);
            const iqr = q3 - q1;
            const lo  = q1 - 1.5 * iqr;
            const hi  = q3 + 1.5 * iqr;
            const min = vals.find(v => v >= lo) ?? vals[0];
            const max = [...vals].reverse().find(v => v <= hi) ?? vals[n - 1];
            const outliers = vals.filter(v => v < lo || v > hi);

            return { col, q1, med, q3, min, max, outliers, color: PALETTE[i % PALETTE.length], borderColor: PALETTE_BORDER[i % PALETTE.length] };
        }).filter(Boolean);

        destroyChart();

        // Renderizado canvas manual para box plot
        const canvas = getCanvas();
        const ctx    = canvas.getContext('2d');
        const W      = canvas.offsetWidth  || 600;
        const H      = canvas.offsetHeight || 380;
        canvas.width  = W;
        canvas.height = H;

        const padL = 60, padR = 30, padT = 40, padB = 50;
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;

        // Rango global
        const allVals = datasets.flatMap(d => [d.min, d.max, ...d.outliers]);
        const gMin = Math.min(...allVals);
        const gMax = Math.max(...allVals);
        const range = gMax - gMin || 1;

        function toY(v) {
            return padT + plotH - ((v - gMin) / range) * plotH;
        }

        // Fondo
        ctx.clearRect(0, 0, W, H);

        // Grid horizontal
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(0,0,0,0.07)';
        ctx.lineWidth   = 1;
        const gridLines = 6;
        for (let i = 0; i <= gridLines; i++) {
            const y = padT + (plotH / gridLines) * i;
            ctx.beginPath();
            ctx.moveTo(padL, y);
            ctx.lineTo(W - padR, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Labels eje Y
        ctx.fillStyle  = '#777';
        ctx.font       = '11px "Segoe UI", sans-serif';
        ctx.textAlign  = 'right';
        for (let i = 0; i <= gridLines; i++) {
            const v = gMin + (range / gridLines) * (gridLines - i);
            const y = padT + (plotH / gridLines) * i;
            ctx.fillText(v.toFixed(2), padL - 8, y + 4);
        }

        // Box plots
        const boxW   = Math.min(60, plotW / (datasets.length * 2));
        const slotW  = plotW / datasets.length;

        datasets.forEach((d, i) => {
            const cx   = padL + slotW * i + slotW / 2;
            const yQ1  = toY(d.q1);
            const yMed = toY(d.med);
            const yQ3  = toY(d.q3);
            const yMin = toY(d.min);
            const yMax = toY(d.max);

            // Bigotes
            ctx.strokeStyle = d.borderColor;
            ctx.lineWidth   = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, yMin); ctx.lineTo(cx, yQ1);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx, yQ3); ctx.lineTo(cx, yMax);
            ctx.stroke();

            // Topes de bigotes
            const cap = boxW * 0.4;
            ctx.beginPath();
            ctx.moveTo(cx - cap, yMin); ctx.lineTo(cx + cap, yMin);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx - cap, yMax); ctx.lineTo(cx + cap, yMax);
            ctx.stroke();

            // Caja (IQR)
            ctx.fillStyle   = d.color;
            ctx.strokeStyle = d.borderColor;
            ctx.lineWidth   = 1.5;
            ctx.beginPath();
            ctx.roundRect(cx - boxW / 2, yQ3, boxW, yQ1 - yQ3, 4);
            ctx.fill();
            ctx.stroke();

            // Mediana
            ctx.strokeStyle = '#fff';
            ctx.lineWidth   = 2.5;
            ctx.beginPath();
            ctx.moveTo(cx - boxW / 2, yMed);
            ctx.lineTo(cx + boxW / 2, yMed);
            ctx.stroke();

            // Outliers
            ctx.fillStyle = d.borderColor;
            d.outliers.forEach(v => {
                ctx.beginPath();
                ctx.arc(cx + (Math.random() - 0.5) * 10, toY(v), 3, 0, Math.PI * 2);
                ctx.fill();
            });

            // Label columna
            ctx.fillStyle  = '#444';
            ctx.font       = '12px "Segoe UI", sans-serif';
            ctx.textAlign  = 'center';
            ctx.fillText(d.col, cx, H - padB + 20);

            // Stats bajo la etiqueta
            ctx.fillStyle = '#999';
            ctx.font      = '10px "Segoe UI", sans-serif';
            ctx.fillText(`med: ${d.med.toFixed(2)}`, cx, H - padB + 34);
        });

        // Título
        ctx.fillStyle  = '#333';
        ctx.font       = '600 14px "Segoe UI", sans-serif';
        ctx.textAlign  = 'center';
        ctx.fillText('Box Plot', W / 2, 22);

        // No hay instancia Chart.js para este tipo — se renderiza en canvas raw
        chartInstance = null;
    }

    // ========================================
    // UTILIDAD PERCENTIL (para box plot)
    // ========================================

    function percentil(sorted, p) {
        const idx = (p / 100) * (sorted.length - 1);
        const lo  = Math.floor(idx);
        const hi  = Math.ceil(idx);
        return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
    }

    // ========================================
    // EXPORTAR GRÁFICO COMO IMAGEN
    // ========================================

    function exportarImagen(nombreArchivo = 'grafico') {
        const canvas = getCanvas();
        if (!canvas) { alert('No hay gráfico para exportar.'); return; }

        const link      = document.createElement('a');
        link.href       = canvas.toDataURL('image/png');
        link.download   = `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.png`;
        link.click();
    }

    // ========================================
    // CONSTRUIR LA UI DE VISUALIZACIÓN
    // (llamada desde script.js al inicializar la vista)
    // ========================================

    function buildUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="viz-layout">

                <!-- Panel de controles -->
                <div class="viz-controls-panel">
                    <div class="viz-section">
                        <label class="viz-label">Fuente de datos</label>
                        <div class="viz-source-toggle">
                            <button class="viz-source-btn active" data-source="imported">📥 Importados</button>
                            <button class="viz-source-btn" data-source="analisis">📊 Análisis</button>
                        </div>
                    </div>

                    <div class="viz-section">
                        <label class="viz-label">Tipo de gráfico</label>
                        <div class="viz-chart-types">
                            <button class="viz-type-btn active" data-type="barras" title="Barras">
                                <span class="viz-type-icon">▊▋▌</span>
                                <span>Barras</span>
                            </button>
                            <button class="viz-type-btn" data-type="barras-h" title="Barras horizontales">
                                <span class="viz-type-icon">≡</span>
                                <span>Horiz.</span>
                            </button>
                            <button class="viz-type-btn" data-type="lineas" title="Líneas">
                                <span class="viz-type-icon">∿</span>
                                <span>Líneas</span>
                            </button>
                            <button class="viz-type-btn" data-type="area" title="Área">
                                <span class="viz-type-icon">◿</span>
                                <span>Área</span>
                            </button>
                            <button class="viz-type-btn" data-type="dispersion" title="Dispersión">
                                <span class="viz-type-icon">⁖</span>
                                <span>Scatter</span>
                            </button>
                            <button class="viz-type-btn" data-type="histograma" title="Histograma">
                                <span class="viz-type-icon">▁▃▅▇</span>
                                <span>Histog.</span>
                            </button>
                            <button class="viz-type-btn" data-type="boxplot" title="Box Plot">
                                <span class="viz-type-icon">⊡</span>
                                <span>Box Plot</span>
                            </button>
                        </div>
                    </div>

                    <div class="viz-section" id="viz-col-x-section">
                        <label class="viz-label" id="viz-col-x-label">Columna X (categoría / eje)</label>
                        <select class="viz-select" id="viz-col-x">
                            <option value="">— Sin datos cargados —</option>
                        </select>
                    </div>

                    <div class="viz-section" id="viz-col-y-section">
                        <label class="viz-label" id="viz-col-y-label">Columna Y (valor numérico)</label>
                        <select class="viz-select" id="viz-col-y">
                            <option value="">— Sin datos cargados —</option>
                        </select>
                    </div>

                    <!-- Bins para histograma -->
                    <div class="viz-section" id="viz-bins-section" style="display:none">
                        <label class="viz-label">Número de intervalos (bins): <strong id="viz-bins-val">10</strong></label>
                        <input type="range" id="viz-bins" min="3" max="30" value="10" class="viz-slider">
                    </div>

                    <!-- Selección múltiple para box plot -->
                    <div class="viz-section" id="viz-boxplot-section" style="display:none">
                        <label class="viz-label">Columnas a comparar</label>
                        <div id="viz-boxplot-cols" class="viz-checkbox-group"></div>
                    </div>

                    <button class="viz-btn-render" id="viz-btn-render">
                        ▶ Generar gráfico
                    </button>

                    <button class="viz-btn-export" id="viz-btn-export">
                        📥 Exportar PNG
                    </button>
                </div>

                <!-- Canvas del gráfico -->
                <div class="viz-canvas-panel">
                    <div class="viz-canvas-wrapper" id="viz-canvas-wrapper">
                        <div class="viz-empty-state" id="viz-empty-state">
                            <div class="viz-empty-icon">📊</div>
                            <p>Configura los parámetros y pulsa <strong>Generar gráfico</strong></p>
                        </div>
                        <canvas id="viz-canvas" style="display:none"></canvas>
                    </div>

                    <!-- Info del gráfico actual -->
                    <div class="viz-chart-info" id="viz-chart-info" style="display:none">
                        <span id="viz-info-text"></span>
                    </div>
                </div>
            </div>
        `;

        attachUIListeners();
    }

    // ========================================
    // LÓGICA DE LA UI
    // ========================================

    let currentSource = 'imported';
    let currentType   = 'barras';

    function attachUIListeners() {
        // Fuente de datos
        document.querySelectorAll('.viz-source-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.viz-source-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSource = btn.dataset.source;
                refreshSelects();
            });
        });

        // Tipo de gráfico
        document.querySelectorAll('.viz-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.viz-type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentType = btn.dataset.type;
                updateControlVisibility();
                refreshSelects();
            });
        });

        // Bins slider
        document.getElementById('viz-bins')?.addEventListener('input', e => {
            document.getElementById('viz-bins-val').textContent = e.target.value;
        });

        // Botón generar
        document.getElementById('viz-btn-render')?.addEventListener('click', renderGrafico);

        // Botón exportar
        document.getElementById('viz-btn-export')?.addEventListener('click', () => {
            const colX = document.getElementById('viz-col-x')?.value || 'grafico';
            exportarImagen(colX);
        });

        // Inicializar
        refreshSelects();
        updateControlVisibility();
    }

    function getCurrentData() {
        if (currentSource === 'imported') {
            return StateManager.getImportedData();
        }
        // Fuente: resultados del análisis — construimos un dataset a partir de ultimosResultados
        if (typeof ultimosResultados !== 'undefined' && ultimosResultados) {
            return buildDataFromResultados(ultimosResultados);
        }
        return null;
    }

    function buildDataFromResultados(res) {
        // Convertir resultados estadísticos a formato {headers, data, rowCount}
        const stats    = Object.keys(res.resultados);
        const cols     = res.columnasAnalizadas;
        const headers  = ['Estadístico', ...cols];
        const data     = [];

        stats.forEach(stat => {
            const row = { 'Estadístico': stat };
            cols.forEach(col => {
                const val = res.resultados[stat][col];
                if (typeof val === 'object' && !Array.isArray(val)) {
                    // Percentiles etc: aplanar
                    Object.keys(val).forEach(k => {
                        row[`${col}_${k}`] = val[k];
                    });
                } else if (Array.isArray(val)) {
                    row[col] = val.join(', ');
                } else {
                    row[col] = val;
                }
            });
            data.push(row);
        });

        return { headers, data, rowCount: data.length };
    }

    function refreshSelects() {
        const data     = getCurrentData();
        const selX     = document.getElementById('viz-col-x');
        const selY     = document.getElementById('viz-col-y');
        const cbGroup  = document.getElementById('viz-boxplot-cols');

        if (!selX || !selY) return;

        if (!data) {
            const empty = '<option value="">— Sin datos cargados —</option>';
            selX.innerHTML = empty;
            selY.innerHTML = empty;
            if (cbGroup) cbGroup.innerHTML = '<p style="color:#999;font-size:0.85rem;">Sin datos cargados</p>';
            return;
        }

        const allCols  = getAllColumns(data);
        const numCols  = getNumericColumns(data);

        // ColX: todas las columnas
        selX.innerHTML = allCols.map(c => `<option value="${c}">${c}</option>`).join('');

        // ColY: solo numéricas
        selY.innerHTML = numCols.length > 0
            ? numCols.map(c => `<option value="${c}">${c}</option>`).join('')
            : '<option value="">No hay columnas numéricas</option>';

        // Box plot checkboxes
        if (cbGroup) {
            cbGroup.innerHTML = numCols.map((c, i) => `
                <label class="viz-checkbox-label">
                    <input type="checkbox" value="${c}" ${i < 3 ? 'checked' : ''}>
                    <span>${c}</span>
                </label>
            `).join('');
        }

        // Actualizar label col X según tipo
        updateColLabels();
    }

    function updateColLabels() {
        const labelX = document.getElementById('viz-col-x-label');
        const labelY = document.getElementById('viz-col-y-label');
        if (!labelX || !labelY) return;

        switch (currentType) {
            case 'dispersion':
                labelX.textContent = 'Columna X (numérica)';
                labelY.textContent = 'Columna Y (numérica)';
                break;
            case 'histograma':
                labelX.textContent = 'Columna a analizar';
                break;
            default:
                labelX.textContent = 'Columna X (categoría / eje)';
                labelY.textContent = 'Columna Y (valor numérico)';
        }
    }

    function updateControlVisibility() {
        const isBoxPlot    = currentType === 'boxplot';
        const isHistograma = currentType === 'histograma';

        const colXSection    = document.getElementById('viz-col-x-section');
        const colYSection    = document.getElementById('viz-col-y-section');
        const binsSection    = document.getElementById('viz-bins-section');
        const boxplotSection = document.getElementById('viz-boxplot-section');

        if (colXSection)    colXSection.style.display    = isBoxPlot ? 'none' : 'block';
        if (colYSection)    colYSection.style.display    = (isBoxPlot || isHistograma) ? 'none' : 'block';
        if (binsSection)    binsSection.style.display    = isHistograma ? 'block' : 'none';
        if (boxplotSection) boxplotSection.style.display = isBoxPlot   ? 'block' : 'none';

        updateColLabels();
    }

    function mostrarCanvas() {
        const empty  = document.getElementById('viz-empty-state');
        const canvas = document.getElementById('viz-canvas');
        if (empty)  empty.style.display  = 'none';
        if (canvas) canvas.style.display = 'block';
    }

    function mostrarInfo(texto) {
        const info = document.getElementById('viz-chart-info');
        const txt  = document.getElementById('viz-info-text');
        if (info) info.style.display = 'flex';
        if (txt)  txt.textContent    = texto;
    }

    function renderGrafico() {
        const data = getCurrentData();

        if (!data || !data.data || data.data.length === 0) {
            alert('⚠️ No hay datos disponibles.\n\nImporta datos o ejecuta un análisis primero.');
            return;
        }

        const colX = document.getElementById('viz-col-x')?.value;
        const colY = document.getElementById('viz-col-y')?.value;

        try {
            mostrarCanvas();

            switch (currentType) {
                case 'barras':
                    if (!colX || !colY) { alert('⚠️ Selecciona las columnas X e Y.'); return; }
                    renderBarras(data, colX, colY, false);
                    mostrarInfo(`Barras: ${colY} por ${colX} · ${data.rowCount} registros`);
                    break;

                case 'barras-h':
                    if (!colX || !colY) { alert('⚠️ Selecciona las columnas X e Y.'); return; }
                    renderBarras(data, colX, colY, true);
                    mostrarInfo(`Barras horizontales: ${colY} por ${colX} · ${data.rowCount} registros`);
                    break;

                case 'lineas':
                    if (!colX || !colY) { alert('⚠️ Selecciona las columnas X e Y.'); return; }
                    renderLineas(data, colX, colY, false);
                    mostrarInfo(`Líneas: ${colY} a lo largo de ${colX} · ${data.rowCount} registros`);
                    break;

                case 'area':
                    if (!colX || !colY) { alert('⚠️ Selecciona las columnas X e Y.'); return; }
                    renderLineas(data, colX, colY, true);
                    mostrarInfo(`Área: ${colY} a lo largo de ${colX} · ${data.rowCount} registros`);
                    break;

                case 'dispersion': {
                    if (!colX || !colY) { alert('⚠️ Selecciona las columnas X e Y.'); return; }
                    renderDispersion(data, colX, colY);
                    mostrarInfo(`Dispersión: ${colX} vs ${colY} · ${data.rowCount} puntos`);
                    break;
                }

                case 'histograma': {
                    if (!colX) { alert('⚠️ Selecciona la columna a analizar.'); return; }
                    const bins = parseInt(document.getElementById('viz-bins')?.value) || 10;
                    renderHistograma(data, colX, bins);
                    mostrarInfo(`Histograma: ${colX} · ${bins} intervalos · ${data.rowCount} registros`);
                    break;
                }

                case 'boxplot': {
                    const checked = Array.from(
                        document.querySelectorAll('#viz-boxplot-cols input:checked')
                    ).map(cb => cb.value);
                    if (checked.length === 0) { alert('⚠️ Selecciona al menos una columna.'); return; }
                    renderBoxPlot(data, checked);
                    mostrarInfo(`Box Plot: ${checked.join(', ')} · ${data.rowCount} registros`);
                    break;
                }
            }
        } catch (err) {
            console.error('Error al generar gráfico:', err);
            alert('❌ Error al generar el gráfico:\n\n' + err.message);
        }
    }

    // ========================================
    // API PÚBLICA
    // ========================================

    // ========================================
    // MODO EXPORTACIÓN — SELECCIÓN DE GRÁFICOS
    // ========================================

    let _graficosParaReporte = [];
    let _modoExportacion     = false;

    // ── Lista de gráficos predefinidos según el dataset ──
    function _getPredefinidosDisponibles() {
        const data = StateManager.getImportedData();
        if (!data) return [];

        const numCols    = getNumericColumns(data);
        const predefinidos = [];

        // Histograma por columna numérica
        numCols.forEach(col => {
            predefinidos.push({
                id:     `hist_${col}`.replace(/\W+/g, '_'),
                label:  `Histograma — ${col}`,
                icono:  '▁▃▅▇',
                tipo:   'histograma',
                config: { colX: col, bins: 10 }
            });
        });

        // Box Plot de todas las columnas
        if (numCols.length > 0) {
            predefinidos.push({
                id:     'boxplot_all',
                label:  `Box Plot — ${numCols.slice(0, 3).join(', ')}${numCols.length > 3 ? '…' : ''}`,
                icono:  '⊡',
                tipo:   'boxplot',
                config: { columnas: numCols }
            });
        }

        // Líneas (tendencia) por columna numérica
        numCols.forEach(col => {
            predefinidos.push({
                id:     `lineas_${col}`.replace(/\W+/g, '_'),
                label:  `Tendencia (Líneas) — ${col}`,
                icono:  '∿',
                tipo:   'lineas_indice',
                config: { colY: col }
            });
        });

        // Dispersión por pares (máx 3)
        if (numCols.length >= 2) {
            let pares = 0;
            outer: for (let i = 0; i < numCols.length; i++) {
                for (let j = i + 1; j < numCols.length; j++) {
                    if (pares >= 3) break outer;
                    predefinidos.push({
                        id:     `scatter_${numCols[i]}_${numCols[j]}`.replace(/\W+/g, '_'),
                        label:  `Dispersión — ${numCols[i]} vs ${numCols[j]}`,
                        icono:  '⁖',
                        tipo:   'dispersion',
                        config: { colX: numCols[i], colY: numCols[j] }
                    });
                    pares++;
                }
            }
        }

        return predefinidos;
    }

    function _tipoLabel(tipo) {
        return { histograma:'Histograma', boxplot:'Box Plot',
                lineas_indice:'Gráfico de Líneas', dispersion:'Dispersión' }[tipo] || tipo;
    }

    // ── Inyectar panel de selección en la vista ──
    function activarModoExportacion() {
        _modoExportacion     = true;
        _graficosParaReporte = [];

        document.getElementById('viz-export-panel')?.remove();

        const layout = document.querySelector('.viz-layout');
        if (!layout) return;

        const predefinidos = _getPredefinidosDisponibles();

        const panel = document.createElement('div');
        panel.id        = 'viz-export-panel';
        panel.className = 'viz-export-panel';

        panel.innerHTML = `
            <div class="viz-export-header">
                <div class="viz-export-title">
                    <span class="viz-export-badge">MODO REPORTE</span>
                    <div>
                        <h3>Selecciona los gráficos para incluir en el reporte</h3>
                        <p>Marca los que quieras · luego genera y continúa</p>
                    </div>
                </div>
                <button class="viz-export-close" id="viz-export-close">✕ Cancelar</button>
            </div>

            <div class="viz-predefinidos-grid" id="viz-predefinidos-grid">
                ${predefinidos.length === 0
                    ? '<p class="viz-pred-empty">No hay datos cargados. Importa datos primero.</p>'
                    : predefinidos.map(p => `
                        <label class="viz-pred-item viz-pred-selected" id="viz-pred-wrap-${p.id}">
                            <input type="checkbox" class="viz-pred-check"
                                id="viz-pred-${p.id}" value="${p.id}" checked>
                            <div class="viz-pred-body">
                                <div class="viz-pred-icon">${p.icono}</div>
                                <div class="viz-pred-info">
                                    <div class="viz-pred-label">${p.label}</div>
                                    <div class="viz-pred-type">${_tipoLabel(p.tipo)}</div>
                                </div>
                                <div class="viz-pred-checkmark">✓</div>
                            </div>
                        </label>`).join('')
                }
            </div>

            <div class="viz-export-progress" id="viz-export-progress" style="display:none">
                <div class="viz-progress-bar">
                    <div class="viz-progress-fill" id="viz-progress-fill" style="width:0%"></div>
                </div>
                <span id="viz-progress-text">Preparando...</span>
            </div>

            <div class="viz-export-footer">
                <span class="viz-export-count" id="viz-export-count">
                    ${predefinidos.length} gráfico(s) seleccionado(s)
                </span>
                <div class="viz-export-actions">
                    <button class="viz-btn-generate-all" id="viz-btn-generate-all"
                            ${predefinidos.length === 0 ? 'disabled' : ''}>
                        ⚙️ Generar seleccionados
                    </button>
                    <button class="viz-btn-continue" id="viz-btn-continue" disabled>
                        Continuar al reporte →
                    </button>
                </div>
            </div>`;

        layout.insertBefore(panel, layout.firstChild);
        _attachExportPanelListeners(predefinidos);
    }

    function _attachExportPanelListeners(predefinidos) {
        // Cancelar
        document.getElementById('viz-export-close')?.addEventListener('click', () => {
            document.getElementById('viz-export-panel')?.remove();
            _modoExportacion     = false;
            _graficosParaReporte = [];
        });

        // Checkboxes
        predefinidos.forEach(p => {
            document.getElementById(`viz-pred-${p.id}`)?.addEventListener('change', e => {
                document.getElementById(`viz-pred-wrap-${p.id}`)
                    ?.classList.toggle('viz-pred-selected', e.target.checked);
                _actualizarContadorExport();
                // Si ya había generado, resetear el botón continuar
                const btnCont = document.getElementById('viz-btn-continue');
                if (btnCont) btnCont.disabled = true;
                _graficosParaReporte = [];
            });
        });

        // Generar
        document.getElementById('viz-btn-generate-all')?.addEventListener('click', async () => {
            const seleccionados = predefinidos.filter(p =>
                document.getElementById(`viz-pred-${p.id}`)?.checked
            );
            if (seleccionados.length === 0) {
                alert('⚠️ Selecciona al menos un gráfico.');
                return;
            }
            await _generarTodos(seleccionados);
        });

        // Continuar al reporte
        document.getElementById('viz-btn-continue')?.addEventListener('click', () => {
            if (_graficosParaReporte.length === 0) return;
            document.getElementById('viz-export-panel')?.remove();
            _modoExportacion = false;
            switchView('reportes');
            inicializarReportes();
        });
    }

    function _actualizarContadorExport() {
        const n  = document.querySelectorAll('.viz-pred-check:checked').length;
        const el = document.getElementById('viz-export-count');
        if (el) el.textContent = `${n} gráfico(s) seleccionado(s)`;
    }

    async function _generarTodos(seleccionados) {
        const progress = document.getElementById('viz-export-progress');
        const fill     = document.getElementById('viz-progress-fill');
        const text     = document.getElementById('viz-progress-text');
        const btnGen   = document.getElementById('viz-btn-generate-all');
        const btnCont  = document.getElementById('viz-btn-continue');

        if (progress) progress.style.display = 'block';
        if (btnGen)   btnGen.disabled        = true;

        _graficosParaReporte = [];

        for (let i = 0; i < seleccionados.length; i++) {
            const pred = seleccionados[i];
            const pct  = Math.round((i / seleccionados.length) * 100);

            if (fill) fill.style.width   = `${pct}%`;
            if (text) text.textContent   = `Generando ${i + 1} / ${seleccionados.length}: ${pred.label}...`;

            try {
                const imagen = await _generarYCapturar(pred);
                _graficosParaReporte.push({
                    titulo: pred.label,
                    tipo:   _tipoLabel(pred.tipo),
                    imagen
                });
            } catch (err) {
                console.warn(`No se pudo generar "${pred.label}":`, err);
            }

            await new Promise(r => setTimeout(r, 200));
        }

        if (fill) fill.style.width = '100%';
        if (text) text.textContent =
            `✅ ${_graficosParaReporte.length} / ${seleccionados.length} gráfico(s) listo(s) para el reporte`;
        if (btnCont) btnCont.disabled = (_graficosParaReporte.length === 0);
        if (btnGen)  btnGen.disabled  = false;
    }

    async function _generarYCapturar(pred) {
        // Asegurarse que el canvas está visible
        mostrarCanvas();

        const data = StateManager.getImportedData();
        if (!data) throw new Error('Sin datos');

        switch (pred.tipo) {
            case 'histograma':
                renderHistograma(data, pred.config.colX, pred.config.bins);
                break;

            case 'boxplot':
                renderBoxPlot(data, pred.config.columnas);
                break;

            case 'lineas_indice': {
                // Agregar columna de índice como eje X
                const dataConN = {
                    headers:  ['N°', ...data.headers],
                    data:     data.data.map((row, i) => ({ 'N°': i + 1, ...row })),
                    rowCount: data.rowCount
                };
                renderLineas(dataConN, 'N°', pred.config.colY, false);
                break;
            }

            case 'dispersion':
                renderDispersion(data, pred.config.colX, pred.config.colY);
                break;

            default:
                throw new Error(`Tipo desconocido: ${pred.tipo}`);
        }

        // Esperar animación de Chart.js (600ms de baseOptions + margen)
        await new Promise(r => setTimeout(r, 750));

        const canvas = getCanvas();
        if (!canvas) throw new Error('Canvas no encontrado');
        return canvas.toDataURL('image/png');
    }

    // Getter público para ReporteManager
    function getGraficosParaReporte() {
        return [..._graficosParaReporte];
    }

    return {
        buildUI,
        refreshSelects,
        exportarImagen,
        renderBarras,
        renderLineas,
        renderDispersion,
        renderHistograma,
        renderBoxPlot,
        destroyChart,
        activarModoExportacion,   // ★ nueva
        getGraficosParaReporte,   // ★ nueva
    };

})();

console.log('✅ Módulo de Visualización cargado');