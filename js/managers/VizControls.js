// ═══════════════════════════════════════════════════════════════════════════
// VIZCONTROLS - Módulo de controles de visualización para dashboard
// ═══════════════════════════════════════════════════════════════════════════

const VizControls = (() => {
  let chartInstance = null;
  let currentData = null;
  let generatedCharts = [];
  const STORAGE_KEY = 'vizControlsPrefs';

  const COLORS = {
    primary: '#5c6bc0',
    bg: '#252525',
    bgPanel: '#3a3a38',
    border: '#404040',
    text: '#e0e0e0',
    textMuted: '#9e9e98',
    success: '#5fd97a',
    danger: '#f56960'
  };

  const CHART_TYPES = [
    { id: 'barras', label: 'Barras', needsY: true },
    { id: 'barras-h', label: 'Barras Horizontal', needsY: true },
    { id: 'dispersion', label: 'Dispersión', needsY: true },
    { id: 'histograma', label: 'Histograma', needsY: false },
    { id: 'boxplot', label: 'Boxplot', needsY: false },
    { id: 'lineas', label: 'Líneas', needsY: true },
    { id: 'heatmap', label: 'Heatmap', needsY: false },
    { id: 'radar', label: 'Radar', needsY: false }
  ];

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  }

  function savePrefs(prefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loadPrefs(), ...prefs }));
  }

  function buildDataFromResultados(res) {
    const stats = Object.keys(res.resultados);
    const cols = res.columnasAnalizadas;
    const headers = ['Estadístico', ...cols];
    const data = [];
    stats.forEach(stat => {
      const row = { 'Estadístico': stat };
      cols.forEach(col => {
        const val = res.resultados[stat][col];
        if (typeof val === 'object' && !Array.isArray(val)) {
          Object.keys(val).forEach(k => { row[`${col}_${k}`] = val[k]; });
        } else if (Array.isArray(val)) {
          row[col] = val.join(', ');
        } else {
          row[col] = val;
        }
      });
      data.push(row);
    });
    return { headers, data, name: 'Resultados del análisis' };
  }

  function getData() {
    const prefs = loadPrefs();
    const dataSource = prefs.dataSource || 'current';

    if (dataSource === 'current' || dataSource === 'imported') {
      if (typeof STATE !== 'undefined' && STATE.workDataset && STATE.workDataset.rows?.length > 0) {
        return { headers: STATE.workDataset.columns, data: STATE.workDataset.rows, name: STATE.workDataset.name };
      }
      if (typeof StateManager !== 'undefined' && StateManager.getActiveSheet) {
        const sheet = StateManager.getActiveSheet();
        if (sheet && sheet.headers && sheet.data) return sheet;
      }
    }

    if (dataSource === 'analysis') {
      if (typeof ultimosResultados !== 'undefined' && ultimosResultados && ultimosResultados.resultados) {
        return buildDataFromResultados(ultimosResultados);
      }
    }

    if (typeof STATE !== 'undefined' && STATE.workDataset && STATE.workDataset.rows?.length > 0) {
      return { headers: STATE.workDataset.columns, data: STATE.workDataset.rows, name: STATE.workDataset.name };
    }
    if (typeof ultimosResultados !== 'undefined' && ultimosResultados && ultimosResultados.resultados) {
      return buildDataFromResultados(ultimosResultados);
    }
    if (typeof StateManager !== 'undefined' && StateManager.getActiveSheet) {
      const sheet = StateManager.getActiveSheet();
      if (sheet && sheet.headers && sheet.data) return sheet;
    }
    return null;
  }

  function getNumericColumns(data) {
    if (!data || !data.headers || !data.data || data.data.length === 0) return [];
    const result = data.headers.filter((h, idx) => {
      const sampleSize = Math.min(10, data.data.length);
      for (let i = 0; i < sampleSize; i++) {
        const val = data.data[i]?.[idx];
        if (val !== null && val !== undefined && val !== '') {
          const parsed = parseFloat(val);
          if (!isNaN(parsed) && isFinite(parsed)) return true;
        }
      }
      return false;
    });
    return result;
  }

  function buildUI(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    currentData = getData();
    const numericCols = currentData ? getNumericColumns(currentData) : [];
    const prefs = loadPrefs();

    container.innerHTML = `
      <div class="viz-ctrl">
        <!-- Sección: Datos -->
        <div class="viz-accordion">
          <div class="viz-acc-header" onclick="VizControls.toggleAccordion(this)">
            <span>Datos</span>
            <span class="viz-acc-arrow">▼</span>
          </div>
          <div class="viz-acc-content">
            <div class="viz-section">
              <label class="viz-lbl">Fuente de datos</label>
              <select class="viz-input" id="viz-data-source">
                <option value="current" ${prefs.dataSource === 'current' ? 'selected' : ''}>Dataset actual</option>
                <option value="analysis" ${prefs.dataSource === 'analysis' ? 'selected' : ''}>Último análisis</option>
                <option value="imported" ${prefs.dataSource === 'imported' ? 'selected' : ''}>Datos importados</option>
              </select>
            </div>
            <div class="viz-section">
              <label class="viz-lbl">Dataset activo</label>
              <div class="viz-badge">${currentData?.name || 'Sin datos'}</div>
            </div>
            <div class="viz-section">
              <button class="btn-crystal" onclick="VizControls.loadSampleData()">Cargar datos demo</button>
            </div>
          </div>
        </div>

        <!-- Sección: Gráfico -->
        <div class="viz-accordion open">
          <div class="viz-acc-header" onclick="VizControls.toggleAccordion(this)">
            <span>Gráfico</span>
            <span class="viz-acc-arrow">▼</span>
          </div>
          <div class="viz-acc-content">
            <div class="viz-section">
              <label class="viz-lbl">Tipo de Gráfico</label>
              <select class="viz-input" id="viz-chart-type">
                ${CHART_TYPES.map(t => `<option value="${t.id}">${t.label}</option>`).join('')}
              </select>
            </div>
            <div class="viz-section">
              <label class="viz-lbl">Variable X</label>
              <select class="viz-input" id="viz-col-x" ${numericCols.length === 0 ? 'disabled' : ''}>
                ${numericCols.length === 0 ? '<option>Sin datos</option>' : 
                  numericCols.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            <div class="viz-section" id="viz-col-y-section">
              <label class="viz-lbl">Variable Y</label>
              <select class="viz-input" id="viz-col-y" ${numericCols.length === 0 ? 'disabled' : ''}>
                ${numericCols.length === 0 ? '<option>Sin datos</option>' : 
                  numericCols.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            <div class="viz-section" id="viz-bins-section" style="display:none;">
              <label class="viz-lbl">Bins</label>
              <input type="number" class="viz-input" id="viz-bins" value="${prefs.bins || 10}" min="2" max="50">
            </div>
            <div class="viz-section">
              <label class="viz-lbl">Título del gráfico</label>
              <input type="text" class="viz-input" id="viz-chart-title" placeholder="Mi gráfico" value="${prefs.chartTitle || ''}">
            </div>
          </div>
        </div>

        <!-- Sección: Estilo -->
        <div class="viz-accordion">
          <div class="viz-acc-header" onclick="VizControls.toggleAccordion(this)">
            <span>Estilo</span>
            <span class="viz-acc-arrow">▼</span>
          </div>
          <div class="viz-acc-content">
            <div class="viz-section row">
              <label class="viz-lbl">Theme</label>
              <label class="viz-toggle">
                <input type="checkbox" id="viz-theme" ${prefs.theme === 'light' ? 'checked' : ''}>
                <span>Claro</span>
              </label>
            </div>
            <div class="viz-section row">
              <label class="viz-lbl">Leyenda</label>
              <label class="viz-toggle">
                <input type="checkbox" id="viz-legend" ${prefs.legend !== false ? 'checked' : ''}>
                <span>Mostrar</span>
              </label>
            </div>
            <div class="viz-section">
              <label class="viz-lbl">Ejes</label>
              <div class="viz-checkboxes">
                <label><input type="checkbox" id="viz-axis-x" ${prefs.axisX !== false ? 'checked' : ''}> X</label>
                <label><input type="checkbox" id="viz-axis-y" ${prefs.axisY !== false ? 'checked' : ''}> Y</label>
              </div>
            </div>
            <div class="viz-section">
              <label class="viz-lbl">Zoom: <span id="viz-zoom-val">${prefs.zoom || 100}%</span></label>
              <input type="range" class="viz-range" id="viz-zoom" min="50" max="200" value="${prefs.zoom || 100}">
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="viz-actions">
          <button class="btn-crystal-blue" id="viz-generate" ${!currentData ? 'disabled' : ''}>Generar</button>
          <button class="btn-crystal-gray" id="viz-clear">Limpiar</button>
          <button class="btn-crystal" id="viz-export">Exportar PNG</button>
          <button class="btn-crystal" id="viz-generate-all" ${!currentData || numericCols.length === 0 ? 'disabled' : ''}>Generar Todos</button>
        </div>
      </div>
    `;

    attachEvents();
    updateUI();
  }

  function toggleAccordion(header) {
    const acc = header.parentElement;
    acc.classList.toggle('open');
  }

  function attachEvents() {
    document.getElementById('viz-chart-type')?.addEventListener('change', updateUI);
    document.getElementById('viz-generate')?.addEventListener('click', generateChart);
    document.getElementById('viz-clear')?.addEventListener('click', clearChart);
    document.getElementById('viz-export')?.addEventListener('click', exportChart);
    document.getElementById('viz-generate-all')?.addEventListener('click', generateAllCharts);
    document.getElementById('viz-zoom')?.addEventListener('input', (e) => {
      document.getElementById('viz-zoom-val').textContent = e.target.value + '%';
      savePrefs({ zoom: parseInt(e.target.value) });
    });
    ['viz-data-source', 'viz-theme', 'viz-legend', 'viz-axis-x', 'viz-axis-y', 'viz-chart-title', 'viz-bins'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', saveCurrentPrefs);
    });
  }

  function saveCurrentPrefs() {
    const prefs = {
      dataSource: document.getElementById('viz-data-source')?.value,
      theme: document.getElementById('viz-theme')?.checked ? 'light' : 'dark',
      legend: document.getElementById('viz-legend')?.checked,
      axisX: document.getElementById('viz-axis-x')?.checked,
      axisY: document.getElementById('viz-axis-y')?.checked,
      chartTitle: document.getElementById('viz-chart-title')?.value,
      bins: parseInt(document.getElementById('viz-bins')?.value) || 10,
      zoom: parseInt(document.getElementById('viz-zoom')?.value) || 100
    };
    savePrefs(prefs);
  }

  function updateUI() {
    const type = document.getElementById('viz-chart-type')?.value;
    const typeInfo = CHART_TYPES.find(t => t.id === type);
    
    const ySection = document.getElementById('viz-col-y-section');
    const binsSection = document.getElementById('viz-bins-section');
    
    if (ySection) ySection.style.display = typeInfo?.needsY ? 'flex' : 'none';
    if (binsSection) binsSection.style.display = type === 'histograma' ? 'flex' : 'none';
  }

  function generateChart() {
    if (!currentData) {
      alert('No hay datos disponibles');
      return;
    }

    const type = document.getElementById('viz-chart-type')?.value;
    const colX = document.getElementById('viz-col-x')?.value;
    const colY = document.getElementById('viz-col-y')?.value;
    const bins = parseInt(document.getElementById('viz-bins')?.value) || 10;
    const prefs = loadPrefs();

    if (!colX) {
      alert('Selecciona una columna');
      return;
    }

    if (['barras', 'barras-h', 'dispersion', 'lineas'].includes(type) && !colY) {
      alert('Selecciona la columna Y');
      return;
    }

    renderChart(type, colX, colY, bins, prefs);
  }

  function generateAllCharts() {
    if (!currentData) { alert('No hay datos cargados'); return; }
    const numericCols = getNumericColumns(currentData);
    if (numericCols.length === 0) { alert('No hay columnas numéricas'); return; }

    const prefs = loadPrefs();
    const bins = prefs.bins || 10;
    const typesToGenerate = ['barras', 'histograma', 'lineas'];
    const generated = [];

    clearChart();
    generatedCharts = [];
    renderGallery();

    let delay = 0;
    typesToGenerate.forEach(type => {
      numericCols.forEach(colX => {
        setTimeout(() => {
          if (type === 'dispersion' && numericCols.length > 1) {
            numericCols.forEach(colY => {
              if (colY !== colX) {
                renderChart(type, colX, colY, bins, prefs);
                addToGallery(type, colX, colY);
                generated.push({ type, colX, colY });
              }
            });
          } else {
            renderChart(type, colX, null, bins, prefs);
            addToGallery(type, colX, null);
            generated.push({ type, colX });
          }
        }, delay * 500);
        delay++;
      });
    });

    setTimeout(() => {
      alert(`✅ Generados ${generated.length} gráficos. Revisa la consola para ver la lista.`);
    }, delay * 500 + 500);
  }

  function clearChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    document.querySelector('.viz-main canvas')?.remove();
  }

  function addToGallery(type, colX, colY) {
    const id = Date.now();
    const title = colY ? `${colX} vs ${colY}` : colX;
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    generatedCharts.push({ id, type, colX, colY, title, timestamp: Date.now() });
    renderGallery();
    guardarGraficosEnLocal();
  }

  function guardarGraficosEnLocal() {
    try {
      const otros = typeof StateManager !== 'undefined'
        ? StateManager.getGraficosHistory()
        : JSON.parse(localStorage.getItem('sigmaPro_graficos') || '[]');
      otros.unshift(...generatedCharts);
      const sliced = otros.slice(0, 50);
      if (typeof StateManager !== 'undefined') {
        StateManager.setGraficosHistory(sliced);
      } else {
        localStorage.setItem('sigmaPro_graficos', JSON.stringify(sliced));
      }
    } catch (e) {
      console.error('Error guardando gráficos:', e);
    }
  }

  function renderGallery() {
    const tbody = document.getElementById('viz-gallery-body');
    if (!tbody) return;
    if (generatedCharts.length === 0) {
      tbody.innerHTML = '<tr><td>Sin gráficos</td><td><span class="tag">-</span></td></tr>';
      return;
    }

    const grouped = {};
    generatedCharts.forEach(g => {
      if (!grouped[g.type]) grouped[g.type] = [];
      grouped[g.type].push(g);
    });

    const typeLabels = { barras: 'Barras', histograma: 'Histograma', lineas: 'Líneas', dispersion: 'Dispersión' };

    tbody.innerHTML = Object.entries(grouped).map(([type, charts]) => `
      <tr onclick="VizControls.openModal('${type}')" style="cursor:pointer;background:rgba(92,107,192,0.1);">
        <td><b>${typeLabels[type] || type}</b> (${charts.length})</td>
        <td><span class="tag" style="background:#5c6bc0;color:#fff;">Ver</span></td>
      </tr>
    `).join('');
  }

  function openModal(type) {
    const charts = generatedCharts.filter(c => c.type === type);
    if (charts.length === 0) return;

    const typeLabels = { barras: 'Gráficos de Barras', histograma: 'Histogramas', lineas: 'Gráficos de Líneas', dispersion: 'Diagramas de Dispersión' };
    const prefs = loadPrefs();

    const modalHtml = `
      <div id="viz-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)this.remove()">
        <div style="background:#2a2a2a;padding:20px;border-radius:12px;max-width:90vw;max-height:90vh;overflow:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="color:#e0e0e0;margin:0;">${typeLabels[type] || type}</h3>
            <button onclick="document.getElementById('viz-modal-overlay').remove()" style="background:none;border:none;color:#9e9e98;font-size:24px;cursor:pointer;">&times;</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${charts.map((c, i) => `
              <div style="background:#3a3a38;padding:12px;border-radius:8px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;" onclick="VizControls.viewChart(${c.id});document.getElementById('viz-modal-overlay').remove();">
                <span style="color:#e0e0e0;">${c.title}</span>
                <span class="tag" style="background:#5c6bc0;color:#fff;">Ver</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  function createMiniChart(ctx, type, colX, colY, bins, prefs) {
    if (!currentData || !ctx) return null;
    const colXIdx = currentData.headers.indexOf(colX);
    const colYIdx = colY ? currentData.headers.indexOf(colY) : -1;
    const data = currentData.data.slice(0, 20);
    const labels = data.map(r => r[colXIdx]);
    const values = data.map(r => parseFloat(r[colXIdx])).filter(v => !isNaN(v));

    const isLight = prefs.theme === 'light';
    const textColor = isLight ? '#333' : COLORS.text;

    const chartType = type === 'dispersion' ? 'scatter' : (type === 'lineas' ? 'line' : 'bar');

    return new Chart(ctx, {
      type: chartType,
      data: {
        labels: type === 'dispersion' ? undefined : labels,
        datasets: [{
          label: colX,
          data: type === 'dispersion' ? data.map(r => ({ x: parseFloat(r[colXIdx]), y: parseFloat(r[colYIdx]) })).filter(p => !isNaN(p.x) && !isNaN(p.y)) : values,
          backgroundColor: COLORS.primary + '99',
          borderColor: COLORS.primary,
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  }

  function viewChart(id) {
    const chart = generatedCharts.find(c => c.id === id);
    if (!chart) return;
    const prefs = loadPrefs();
    renderChart(chart.type, chart.colX, chart.colY, prefs.bins || 10, prefs);
  }

  function renderChart(type, colX, colY, bins, prefs) {
    let canvas = document.getElementById('viz-canvas');
    if (!canvas) {
      const chartArea = document.getElementById('chartViz');
      if (chartArea) {
        chartArea.innerHTML = '';
        chartArea.style.width = '100%';
        chartArea.style.height = '100%';
        chartArea.style.padding = '0';
        chartArea.innerHTML = `<canvas id="viz-canvas" style="width:100%;height:100%;"></canvas>`;
        canvas = document.getElementById('viz-canvas');
      }
    }
    
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const isLight = prefs.theme === 'light';
    const textColor = isLight ? '#333' : COLORS.text;
    const gridColor = isLight ? '#ddd' : COLORS.border;

    if (chartInstance) chartInstance.destroy();

    const colXIdx = currentData.headers.indexOf(colX);
    const colYIdx = colY ? currentData.headers.indexOf(colY) : -1;
    const xValues = currentData.data.map(r => parseFloat(r[colXIdx])).filter(v => !isNaN(v));
    const labels = currentData.data.map(r => r[colXIdx]);

    let chartConfig = {
      type: 'bar',
      data: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: prefs.legend !== false, labels: { color: textColor } },
          title: { display: !!prefs.chartTitle, text: prefs.chartTitle || '', color: textColor }
        },
        scales: {
          x: { display: prefs.axisX !== false, ticks: { color: textColor }, grid: { color: gridColor } },
          y: { display: prefs.axisY !== false, ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    };

    switch (type) {
      case 'barras':
      case 'barras-h':
        chartConfig.type = 'bar';
        chartConfig.data = {
          labels: labels.slice(0, 20),
          datasets: [{ label: colX, data: xValues.slice(0, 20), backgroundColor: COLORS.primary + '99', borderColor: COLORS.primary, borderWidth: 1 }]
        };
        if (type === 'barras-h') chartConfig.options.indexAxis = 'y';
        break;
      case 'dispersion':
        chartConfig.type = 'scatter';
        const scatterData = currentData.data.slice(0, 100).map(r => ({ x: parseFloat(r[colXIdx]), y: parseFloat(r[colYIdx]) })).filter(p => !isNaN(p.x) && !isNaN(p.y));
        chartConfig.data = { datasets: [{ label: `${colX} vs ${colY}`, data: scatterData, backgroundColor: COLORS.primary + '99', borderColor: COLORS.primary }] };
        break;
      case 'lineas':
        chartConfig.type = 'line';
        chartConfig.data = { labels: labels.slice(0, 30), datasets: [{ label: colX, data: xValues.slice(0, 30), borderColor: COLORS.primary, backgroundColor: COLORS.primary + '33', fill: true }] };
        break;
      case 'histograma':
        const hist = calculateHistogram(xValues, bins);
        chartConfig.data = { labels: hist.labels, datasets: [{ label: colX, data: hist.values, backgroundColor: COLORS.primary + '99', borderColor: COLORS.primary }] };
        break;
      case 'heatmap':
        renderHeatmap();
        return;
      case 'radar':
        chartConfig.type = 'radar';
        const radarData = currentData.headers.slice(0, 6).map(h => { const vals = currentData.data.map(r => parseFloat(r[h])).filter(v => !isNaN(v)); return vals.length ? vals.reduce((a,b) => a+b, 0) / vals.length : 0; });
        chartConfig.data = { labels: currentData.headers.slice(0, 6), datasets: [{ label: 'Promedios', data: radarData, backgroundColor: COLORS.primary + '66', borderColor: COLORS.primary }] };
        break;
      default:
        chartConfig.data = { labels: labels.slice(0, 10), datasets: [{ label: colX, data: xValues.slice(0, 10), backgroundColor: COLORS.primary + '99' }] };
    }

    const zoom = prefs.zoom || 100;
    const wrapper = canvas.parentElement;
    if (wrapper) wrapper.style.transform = `scale(${zoom/100})`;

    chartInstance = new Chart(ctx, chartConfig);
  }

  function calculateHistogram(values, bins) {
    const min = Math.min(...values), max = Math.max(...values), width = (max - min) / bins;
    const counts = new Array(bins).fill(0);
    const labels = [];
    for (let i = 0; i < bins; i++) labels.push((min + i*width).toFixed(1));
    values.forEach(v => { const idx = Math.min(Math.floor((v - min) / width), bins - 1); counts[idx]++; });
    return { labels, values: counts };
  }

  function renderHeatmap() {
    const main = document.querySelector('.viz-main .panel > div');
    if (!main) return;
    main.innerHTML = '<canvas id="viz-canvas"></canvas>';
    const ctx = document.getElementById('viz-canvas')?.getContext('2d');
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    
    const numericCols = getNumericColumns(currentData);
    const matrix = numericCols.map((c1, i) => numericCols.map((c2, j) => {
      if (i === j) return 1;
      const x = currentData.data.map(r => parseFloat(r[c1])).filter(v => !isNaN(v));
      const y = currentData.data.map(r => parseFloat(r[c2])).filter(v => !isNaN(v));
      return calculateCorrelation(x, y);
    }));

    chartInstance = new Chart(ctx, { type: 'bar', data: { labels: numericCols, datasets: numericCols.map((col, i) => ({ label: col, data: matrix[i], backgroundColor: matrix[i].map(v => v > 0 ? `rgba(92,107,192,${Math.abs(v)})` : `rgba(229,57,53,${Math.abs(v)})`) })) }, options: { responsive: true, plugins: { legend: { display: false } } } });
  }

  function calculateCorrelation(x, y) {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;
    const sx = x.slice(0, n), sy = y.slice(0, n);
    const mx = sx.reduce((a,b) => a+b, 0)/n, my = sy.reduce((a,b) => a+b, 0)/n;
    let num = 0, den1 = 0, den2 = 0;
    for (let i = 0; i < n; i++) { const dx = sx[i] - mx, dy = sy[i] - my; num += dx * dy; den1 += dx * dx; den2 += dy * dy; }
    return den1 && den2 ? num / Math.sqrt(den1 * den2) : 0;
  }

  function exportChart() {
    const canvas = document.getElementById('viz-canvas');
    if (!canvas) { alert('No hay gráfico para exportar'); return; }
    const link = document.createElement('a');
    link.download = 'grafico.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function loadSampleData() {
    const sampleData = {
      name: 'Datos Demo',
      columns: ['X', 'Y', 'Z', 'Categoria'],
      rows: Array.from({length: 50}, () => [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 50),
        Math.floor(Math.random() * 200),
        ['A','B','C','D'][Math.floor(Math.random() * 4)]
      ])
    };
    currentData = sampleData;
    buildUI('viz-controls-container');
  }

  return { buildUI, toggleAccordion, loadSampleData, viewChart, openModal };
})();

console.log('✅ VizControls cargado');