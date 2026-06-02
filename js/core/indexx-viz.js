// ════════════════════════════════════════════════════════════════
// indexx-viz.js — Visualización / Chart.js (13 chart types, cards)
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// VISUALIZACIÓN — Chart.js (13 tipos, tarjetas múltiples)
// ════════════════════════════════════════════════════════════════
var _vizChartInstances = {};
var _vizChartImages = {};  // imágenes base64 persistentes para reportes
var _vizCardCounter = 0;
var _vizSelectedType = 'bar';
var _vizExtraYCount = 0;

// Capturar canvas de un gráfico (con + sin async para fallback)
function vizCaptureCardImage(id) {
  var chart = _vizChartInstances[id];
  if (!chart || !chart.canvas) return;
  // Forzar render final sin animación
  chart.options.animation = false;
  chart.update();
  chart.resize();
  // Captura síncrona inmediata (fallback para reportes)
  _vizSetImage(id, chart);
  // Captura asíncrona tras 2 frames (mejor calidad, Chart.js resize completo)
  requestAnimationFrame(function() {
  requestAnimationFrame(function() {
    _vizSetImage(id, chart);
  });
  });
}
function _vizSetImage(id, chart) {
  try {
    var card = document.getElementById(id);
    var titleEl = card ? card.querySelector('.page-card-title') : null;
    var titulo = titleEl ? titleEl.textContent.trim() : id;
    var tipo = chart.config && chart.config.type ? chart.config.type : 'desconocido';
    var canvas = chart.canvas;
    var w = canvas.width;
    var h = canvas.height;
    var maxRatio = 4.0;
    var minH = Math.floor(w / maxRatio);
    if (h < minH) {
      var oc = document.createElement('canvas');
      oc.width = w;
      oc.height = minH;
      var ctx = oc.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, oc.width, oc.height);
      ctx.drawImage(canvas, 0, Math.floor((minH - h) / 2), w, h);
      _vizChartImages[id] = {
        imagen: oc.toDataURL('image/png'),
        titulo: titulo,
        tipo: tipo
      };
    } else {
      _vizChartImages[id] = {
        imagen: canvas.toDataURL('image/png'),
        titulo: titulo,
        tipo: tipo
      };
    }
  } catch(e) {
    console.warn('[Viz] Error capturando imagen ' + id + ':', e);
  }
}

// API para ReporteManager — usa imágenes pre-capturadas (no canvases vivos)
window.Visualizacion = {
  getGraficosParaReporte: function() {
    // Fallback: si no hay imágenes pre-capturadas pero hay instancias vivas, capturar ahora
    if (Object.keys(_vizChartImages).length === 0 && Object.keys(_vizChartInstances).length > 0) {
      Object.keys(_vizChartInstances).forEach(function(id) {
        var chart = _vizChartInstances[id];
        if (chart && chart.canvas) _vizSetImage(id, chart);
      });
    }
    var graficos = [];
    Object.keys(_vizChartImages).forEach(function(id) {
      var img = _vizChartImages[id];
      if (img && img.imagen) graficos.push(img);
    });
    return graficos;
  }
};

function initVizPage() {
  Object.values(_vizChartInstances).forEach(function(c){ try{ c.destroy(); }catch(e){} });
  _vizChartInstances = {};
  _vizChartImages = {};
  _vizExtraYCount = 0;
  var cols = vizGetColumns();
  var selX = document.getElementById('vizColX');
  var selY = document.getElementById('vizColY');
  var selSize = document.getElementById('vizColSize');
  if (!selX) return;
  var optsHtml = '<option value="">— Seleccionar —</option>';
  cols.forEach(function(c){ optsHtml += '<option value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</option>'; });
  selX.innerHTML = optsHtml;
  selY.innerHTML = optsHtml;
  vizResetExtraY(cols);

  if (selSize) {
    selSize.innerHTML = '<option value="">— Seleccionar —</option>';
    cols.forEach(function(c){ selSize.innerHTML += '<option value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</option>'; });
  }

  document.querySelectorAll('.viz-type').forEach(function(btn){
    btn.onclick = function(){
      document.querySelectorAll('.viz-type').forEach(function(b){ b.classList.remove('btn-primary'); b.classList.add('btn-secondary'); });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      _vizSelectedType = btn.dataset.type;
      vizUpdateControlsForType();
    };
  });

  document.getElementById('vizRenderBtn').onclick = function(){ vizRenderChart(); };

  var addBtn = document.getElementById('vizAddYBtn');
  if (addBtn) addBtn.onclick = function(){ vizAddExtraY(); };

  var firstBtn = document.querySelector('.viz-type');
  if (firstBtn) { firstBtn.classList.remove('btn-secondary'); firstBtn.classList.add('btn-primary'); _vizSelectedType = 'bar'; }
  vizUpdateControlsForType();
  vizRestoreCards();
}

function vizGetColumns() {
  var sheet = getCurrentSheet();
  if (!sheet || !sheet.headers) return [];
  return sheet.headers.slice();
}

function vizUpdateControlsForType() {
  var type = _vizSelectedType;
  var isMultiSeries = type === 'stackedBar' || type === 'groupedBar' || type === 'multiLine' || type === 'area';
  var isBubble = type === 'bubble';
  var extraC = document.getElementById('vizExtraYContainer');
  var sizeLabel = document.getElementById('vizSizeLabel');
  var sizeSelect = document.getElementById('vizColSize');
  if (extraC) extraC.style.display = isMultiSeries ? 'flex' : 'none';
  if (sizeLabel) sizeLabel.style.display = isBubble ? 'flex' : 'none';
  if (sizeSelect) sizeSelect.style.display = isBubble ? 'inline-block' : 'none';
}

function vizToggleSidebarList() {
  var list = document.getElementById('vizSidebarList');
  var arrow = document.getElementById('vizSidebarArrow');
  if (!list) return;
  var expanded = list.style.display !== 'none';
  list.style.display = expanded ? 'none' : 'flex';
  if (arrow) arrow.textContent = expanded ? '▶' : '▼';
  try { localStorage.setItem('sigmaPro_vizSidebarExpanded', expanded ? '0' : '1'); } catch(e) {}
}

function vizScrollToCard(id) {
  var card = document.getElementById(id);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    card.style.outline = '2px solid var(--accent)';
    setTimeout(function(){ if (card) card.style.outline = ''; }, 2000);
  }
}

function vizSyncSidebarList() {
  var list = document.getElementById('vizSidebarList');
  var countEl = document.getElementById('vizSidebarCount');
  if (!list) return;
  var cards = document.querySelectorAll('#vizCardsContainer > .page-card[id^="viz-"]');
  var count = cards.length;
  if (countEl) countEl.textContent = count;
  var iconMap = { bar:'📊', line:'📈', area:'📉', multiLine:'📈📈', stackedBar:'🏗️', groupedBar:'📊📊', scatter:'⬡', linealidad:'∎', bubble:'🔵', pie:'◉', doughnut:'◉', polarArea:'🔄', radar:'🕸️', histogram:'▦' };
  var html = '';
  cards.forEach(function(card){
    var id = card.id;
    var titleEl = card.querySelector('.page-card-title');
    var title = titleEl ? titleEl.textContent : 'Gráfico';
    var params;
    try { params = JSON.parse(card.dataset.vizParams || '{}'); } catch(e) { params = {}; }
    var icon = iconMap[params.type] || '📊';
    html += '<div class="viz-sidebar-item" data-card-id="' + id + '" onclick="vizScrollToCard(\'' + id + '\')" style="display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:4px;cursor:pointer;font-size:11px;color:var(--text-muted);transition:background 0.15s" onmouseenter="this.style.background=\'var(--item-hover)\'" onmouseleave="this.style.background=\'transparent\'">' +
      '<span style="flex-shrink:0">' + icon + '</span>' +
      '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escapeHtml(title) + '</span>' +
      '<span class="sc-close" onclick="event.stopPropagation();vizRemoveCard(\'' + id + '\')" style="font-size:9px;padding:2px;line-height:1;flex-shrink:0">✕</span>' +
    '</div>';
  });
  list.innerHTML = html;
  // Restore collapsed state from localStorage (default expanded)
  var expanded;
  try { expanded = localStorage.getItem('sigmaPro_vizSidebarExpanded'); } catch(e) {}
  if (expanded === '0') {
    list.style.display = 'none';
    var arrow = document.getElementById('vizSidebarArrow');
    if (arrow) arrow.textContent = '▶';
  } else {
    list.style.display = 'flex';
  }
}

function vizResetExtraY(cols) {
  var list = document.getElementById('vizExtraYList');
  if (!list) return;
  list.innerHTML = '';
  _vizExtraYCount = 0;
  if (!cols) cols = vizGetColumns();
}

function vizAddExtraY() {
  var list = document.getElementById('vizExtraYList');
  if (!list) return;
  _vizExtraYCount++;
  var idx = _vizExtraYCount;
  var cols = vizGetColumns();
  var opts = '<option value="">— Seleccionar —</option>';
  cols.forEach(function(c){ opts += '<option value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</option>'; });
  var div = document.createElement('div');
  div.id = 'vizExtraYRow-' + idx;
  div.style.cssText = 'display:flex;gap:6px;align-items:center';
  div.innerHTML =
    '<select id="vizExtraY-' + idx + '" class="modal-select" style="min-width:120px;font-size:11px">' + opts + '</select>' +
    '<span class="sc-close" onclick="vizRemoveExtraY(' + idx + ')" style="font-size:14px;cursor:pointer" title="Quitar">✕</span>';
  list.appendChild(div);
}

function vizRemoveExtraY(idx) {
  var el = document.getElementById('vizExtraYRow-' + idx);
  if (el) el.remove();
}

function vizGetAllYColumns() {
  var main = document.getElementById('vizColY');
  var cols = [];
  if (main && main.value) cols.push(main.value);
  for (var i = 1; i <= _vizExtraYCount; i++) {
    var el = document.getElementById('vizExtraY-' + i);
    if (el && el.value) cols.push(el.value);
  }
  return cols;
}

// ════════════════════════════════════════════════════════════════
// VISUALIZACIÓN — BATCH (multi-gráfico)
// ════════════════════════════════════════════════════════════════
function showBatchGraphModal() {
  var sheet = getCurrentSheet();
  if (!sheet || !sheet.headers || !sheet.headers.length) { showToast('No hay datos cargados'); return; }
  var modal = document.createElement('div'); modal.className = 'modal-overlay';
  var colOpts = '<option value="">— Seleccionar —</option>';
  sheet.headers.forEach(function(c){ colOpts += '<option value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</option>'; });
  var colChkHtml = sheet.headers.map(function(col){
    var safeId = 'vizModalChk-' + col.replace(/[^a-zA-Z0-9_-]/g, '_');
    return '<label style="font-size:11px;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;gap:2px;padding:2px 0">' +
      '<input type="checkbox" class="viz-modal-batch-chk" data-col="' + col.replace(/"/g,'&quot;') + '" id="' + safeId + '" checked> ' + escapeHtml(col) +
    '</label>';
  }).join('');
  modal.innerHTML = '<div class="modal-box" style="min-width:420px">' +
    '<div class="modal-title">🔁 Generar múltiples gráficos</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0">' +
      '<div class="modal-row"><span class="modal-label">Tipo</span>' +
        '<select id="vizModalType" class="modal-select" style="min-width:120px">' +
          '<option value="histogram">▦ Histograma</option>' +
          '<option value="bar">📊 Barras</option>' +
          '<option value="line">📈 Líneas</option>' +
          '<option value="area">📉 Área</option>' +
          '<option value="scatter">⬡ Dispersión</option>' +
        '</select></div>' +
      '<div class="modal-row" id="vizModalXRow"><span class="modal-label">Eje X</span>' +
        '<select id="vizModalColX" class="modal-select" style="min-width:120px">' + colOpts + '</select></div>' +
    '</div>' +
    '<div style="font-size:11px;color:var(--text-faint);margin:4px 0 2px">Columnas a graficar (como Y para no-histograma):</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:4px 12px;max-height:200px;overflow-y:auto;padding:4px 0">' + colChkHtml + '</div>' +
    '<div class="modal-actions" style="margin-top:10px">' +
      '<button class="btn btn-secondary" id="vizModalCancel">Cancelar</button>' +
      '<button class="btn btn-primary" id="vizModalGenerate">🎨 Generar</button>' +
    '</div></div>';
  document.body.appendChild(modal);
  document.getElementById('vizModalCancel').onclick = function(){ modal.remove(); };
  document.getElementById('vizModalGenerate').onclick = function(){
    var type = document.getElementById('vizModalType').value;
    var colX = document.getElementById('vizModalColX').value;
    var checkboxes = document.querySelectorAll('.viz-modal-batch-chk:checked');
    var selected = [].filter.call(checkboxes, function(cb){ return cb.checked; }).map(function(cb){ return cb.dataset.col; });
    if (!selected.length) { showToast('Selecciona al menos una columna'); return; }
    if (type !== 'histogram' && !colX) { showToast('Selecciona Eje X'); return; }
    modal.remove();
    loadPage('visualizacion');
    setTimeout(function(){
      vizBatchRenderFromModal(type, colX, selected);
    }, 100);
  };
  modal.onclick = function(e){ if (e.target === modal) modal.remove(); };
  // Mostrar/ocultar Eje X según tipo
  document.getElementById('vizModalType').onchange = function(){
    document.getElementById('vizModalXRow').style.display = this.value === 'histogram' ? 'none' : 'flex';
  };
  document.getElementById('vizModalType').dispatchEvent(new Event('change'));
}

function vizBatchRenderFromModal(type, colX, selectedCols) {
  var sheet = getCurrentSheet();
  if (!sheet) { showToast('No hay datos cargados'); return; }
  var container = document.getElementById('vizCardsContainer');
  if (!container) return;
  if (document.getElementById('vizCardsContainer')) {
    _vizSelectedType = type;
  }
  var count = 0;
  selectedCols.forEach(function(col){
    if (!col || !sheet.headers.includes(col)) return;
    if (type === 'histogram') {
      renderHistogramCard(sheet, col, container);
      count++;
    } else if (type === 'scatter') {
      if (col === colX) return;
      renderScatterCard(sheet, colX, col, container);
      count++;
    } else {
      if (col === colX) return;
      renderBarLineCard(sheet, type, colX, col, container);
      count++;
    }
  });
  if (count > 0) {
    showToast('✅ ' + count + ' gráfico(s) generado(s)');
    vizSaveCards();
  } else {
    showToast('No se generaron gráficos. Revisa las columnas seleccionadas.');
  }
}

function vizGetMultiSeriesData(sheet, colX, yCols) {
  var xi = sheet.headers.indexOf(colX);
  if (xi < 0) return { labels: [], datasets: [] };
  var labels = [];
  var series = {};
  yCols.forEach(function(yc){ series[yc] = []; });
  sheet.rows.forEach(function(r){
    if (xi >= r.length) return;
    var l = String(r[xi]);
    labels.push(l);
    yCols.forEach(function(yc){
      var yi = sheet.headers.indexOf(yc);
      var v = (yi >= 0 && yi < r.length) ? parseFloat(r[yi]) : null;
      series[yc].push(isNaN(v) ? null : v);
    });
  });
  return { labels: labels, series: series };
}

function vizGetValues(sheet, colY) {
  var idx = sheet.headers.indexOf(colY);
  if (idx < 0) return [];
  return sheet.rows.map(function(r){
    if (idx >= r.length || r[idx] == null || r[idx] === '') return null;
    var v = parseFloat(r[idx]);
    return isNaN(v) ? null : v;
  });
}

function vizGetValidPairs(sheet, colX, colY) {
  var xi = sheet.headers.indexOf(colX);
  var yi = sheet.headers.indexOf(colY);
  if (xi < 0 || yi < 0) return { labels: [], data: [] };
  var labels = [], data = [];
  sheet.rows.forEach(function(r){
    if (xi >= r.length || yi >= r.length) return;
    var l = String(r[xi]);
    var v = parseFloat(r[yi]);
    if (isNaN(v)) return;
    labels.push(l);
    data.push(v);
  });
  return { labels: labels, data: data };
}

function vizGetValidScatterPairs(sheet, colX, colY) {
  var xi = sheet.headers.indexOf(colX);
  var yi = sheet.headers.indexOf(colY);
  if (xi < 0 || yi < 0) return [];
  var pts = [];
  sheet.rows.forEach(function(r){
    if (xi >= r.length || yi >= r.length) return;
    var x = parseFloat(r[xi]), y = parseFloat(r[yi]);
    if (isNaN(x) || isNaN(y)) return;
    pts.push({ x: x, y: y });
  });
  return pts;
}

function vizGetValidBubbleData(sheet, colX, colY, colSize) {
  var xi = sheet.headers.indexOf(colX);
  var yi = sheet.headers.indexOf(colY);
  var si = sheet.headers.indexOf(colSize);
  if (xi < 0 || yi < 0 || si < 0) return [];
  var pts = [];
  sheet.rows.forEach(function(r){
    if (xi >= r.length || yi >= r.length || si >= r.length) return;
    var x = parseFloat(r[xi]), y = parseFloat(r[yi]), s = parseFloat(r[si]);
    if (isNaN(x) || isNaN(y) || isNaN(s)) return;
    pts.push({ x: x, y: y, r: Math.abs(s) / 2 + 1 });
  });
  return pts;
}

function vizTypeName(t) {
  var n = { bar:'Barras', line:'Líneas', area:'Área', multiLine:'Multi-líneas', stackedBar:'Apiladas', groupedBar:'Agrupadas', scatter:'Dispersión', bubble:'Burbuja', pie:'Circular', doughnut:'Dona', polarArea:'Polar', radar:'Radar', histogram:'Histograma' };
  return n[t] || t;
}

function vizTypeIcon(t) {
  var m = { bar:'📊', line:'📈', area:'📉', multiLine:'📈📈', stackedBar:'🏗️', groupedBar:'📊📊', scatter:'⬡', bubble:'🔵', pie:'◉', doughnut:'◉', polarArea:'🔄', radar:'🕸️', histogram:'▦' };
  return m[t] || '📈';
}

function vizRemoveCard(id) {
  if (_vizChartInstances[id]) { _vizChartInstances[id].destroy(); delete _vizChartInstances[id]; }
  delete _vizChartImages[id];
  var el = document.getElementById(id);
  if (el) el.remove();
  vizSaveCards();
}

function vizRenderChart() {
  var type = _vizSelectedType || 'bar';
  var colX = document.getElementById('vizColX').value;
  var colY = document.getElementById('vizColY').value;
  var colSize = document.getElementById('vizColSize') ? document.getElementById('vizColSize').value : '';
  var container = document.getElementById('vizCardsContainer');
  var sheet = getCurrentSheet();
  if (!sheet) { showToast('No hay datos cargados'); return; }
  if (!colX) { showToast('Selecciona una columna para el eje X'); return; }

  if (type === 'histogram') {
    if (!colX) { showToast('Selecciona una columna numérica'); return; }
    renderHistogramCard(sheet, colX, container);
    vizSaveCards(); return;
  }
  if (type === 'pie' || type === 'doughnut' || type === 'polarArea') {
    if (!colX || !colY) { showToast('Selecciona ambas columnas (X=etiquetas, Y=valores)'); return; }
    renderPieCard(sheet, type, colX, colY, container);
    vizSaveCards(); return;
  }
  if (type === 'radar') {
    if (!colX || !colY) { showToast('Selecciona ambas columnas (X=etiquetas, Y=valores)'); return; }
    renderRadarCard(sheet, colX, colY, container);
    vizSaveCards(); return;
  }
  if (type === 'scatter') {
    if (!colX || !colY) { showToast('Selecciona ambas columnas'); return; }
    renderScatterCard(sheet, colX, colY, container);
    vizSaveCards(); return;
  }
  if (type === 'linealidad') {
    if (!colX || !colY) { showToast('Selecciona ambas columnas'); return; }
    renderLinealidadCard(sheet, colX, colY, container);
    vizSaveCards(); return;
  }
  if (type === 'bubble') {
    if (!colX || !colY || !colSize) { showToast('Selecciona X, Y y Tamaño'); return; }
    renderBubbleCard(sheet, colX, colY, colSize, container);
    vizSaveCards(); return;
  }
  if (type === 'stackedBar' || type === 'groupedBar' || type === 'multiLine' || type === 'area') {
    var yCols = vizGetAllYColumns();
    if (!colY || yCols.length < 1) { showToast('Selecciona al menos una columna Y'); return; }
    renderMultiSeriesCard(sheet, type, colX, yCols, container);
    vizSaveCards(); return;
  }
  if (!colY) { showToast('Selecciona la columna Y'); return; }
  renderBarLineCard(sheet, type, colX, colY, container);
  vizSaveCards();
}

function vizDefaultColors(count) {
  var c = [];
  for (var i = 0; i < count; i++) c.push('hsl(' + ((i * 360 / count) % 360) + ',70%,55%)');
  return c;
}

function createChartCard(id, title, container, height, params) {
  height = height || 500;
  var card = document.createElement('div');
  card.className = 'page-card';
  card.id = id;
  card.style.cssText = 'flex-shrink:0';
  if (params) card.dataset.vizParams = JSON.stringify(params);
  card.innerHTML =
    '<div class="page-card-header">' +
      '<span class="page-card-icon">📈</span>' +
      '<span class="page-card-title">' + escapeHtml(title) + '</span>' +
      '<span class="sc-close" onclick="vizRemoveCard(\'' + id + '\')" title="Cerrar">✕</span>' +
    '</div>' +
    '<div class="page-card-body" style="padding:10px;height:' + height + 'px;display:flex;align-items:center;justify-content:center;overflow:hidden">' +
      '<canvas id="' + id + '-canvas" style="max-width:100%;max-height:100%"></canvas>' +
    '</div>';
  container.appendChild(card);
  container.scrollTop = container.scrollHeight;
  var canvas = document.getElementById(id + '-canvas');
  // Forzar layout y asignar dimensiones explícitas antes de Chart.js
  var bodyEl = canvas.parentElement;
  void bodyEl.offsetHeight;
  canvas.width = bodyEl.clientWidth - 20;
  canvas.height = bodyEl.clientHeight - 20;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  return canvas;
}

function chartOptsDark(scales) {
  var o = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#ccc', boxWidth: 12 } } } };
  if (scales !== false) o.scales = { x: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } }, y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } } };
  return o;
}

function renderBarLineCard(sheet, type, colX, colY, container) {
  var d = vizGetValidPairs(sheet, colX, colY);
  if (!d.data.length) { showToast('No hay datos numéricos válidos'); return; }
  var id = 'viz-' + (++_vizCardCounter);
  var canvas = createChartCard(id, vizTypeName(type) + ' · ' + colX + ' vs ' + colY, container, 500, {type:type, colX:colX, colY:colY});
  var opts = chartOptsDark(true);
  opts.plugins.legend.display = true;
  _vizChartInstances[id] = new Chart(canvas.getContext('2d'), {
    type: type,
    data: {
      labels: d.labels,
      datasets: [{ label: colY, data: d.data, backgroundColor: 'rgba(54,162,235,0.6)', borderColor: 'rgba(54,162,235,1)', borderWidth: 1 }]
    },
    options: opts
  });
  vizCaptureCardImage(id);
}

function renderMultiSeriesCard(sheet, type, colX, yCols, container) {
  var d = vizGetMultiSeriesData(sheet, colX, yCols);
  if (!d.labels.length) { showToast('No hay datos'); return; }
  var id = 'viz-' + (++_vizCardCounter);
  var colors = vizDefaultColors(yCols.length);
  var datasets = yCols.map(function(yc, i){
    var ds = { label: yc, data: d.series[yc], backgroundColor: colors[i], borderColor: colors[i], borderWidth: 1 };
    if (type === 'area') { ds.fill = true; ds.backgroundColor = colors[i].replace(')', ',0.2)').replace('hsl', 'hsla'); }
    if (type === 'multiLine') ds.fill = false;
    if (type === 'stackedBar' || type === 'groupedBar') ds.backgroundColor = colors[i];
    return ds;
  });
  var canvas = createChartCard(id, vizTypeName(type) + ' · ' + colX + ' [' + yCols.join(', ') + ']', container, 500, {type:type, colX:colX, colY:yCols[0]||'', allY:yCols, extraY:yCols.slice(1)});
  var opts = chartOptsDark(true);
  if (type === 'stackedBar') { opts.scales.x.stacked = true; opts.scales.y.stacked = true; }
  if (type === 'groupedBar') { /* default grouped */ }
  _vizChartInstances[id] = new Chart(canvas.getContext('2d'), {
    type: type === 'stackedBar' || type === 'groupedBar' ? 'bar' : type === 'area' ? 'line' : 'line',
    data: { labels: d.labels, datasets: datasets },
    options: opts
  });
  vizCaptureCardImage(id);
}

function renderScatterCard(sheet, colX, colY, container) {
  var pts = vizGetValidScatterPairs(sheet, colX, colY);
  if (!pts.length) { showToast('No hay pares numéricos válidos'); return; }
  var id = 'viz-' + (++_vizCardCounter);
  var canvas = createChartCard(id, 'Dispersión · ' + colX + ' vs ' + colY, container, 500, {type:'scatter', colX:colX, colY:colY});
  _vizChartInstances[id] = new Chart(canvas.getContext('2d'), {
    type: 'scatter',
    data: { datasets: [{ label: colX + ' vs ' + colY, data: pts, backgroundColor: 'rgba(54,162,235,0.6)' }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { color: '#ccc' } } },
      scales: {
        x: { title: { display: true, text: colX, color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { title: { display: true, text: colY, color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
  vizCaptureCardImage(id);
}

function renderLinealidadCard(sheet, colX, colY, container) {
  var pts = vizGetValidScatterPairs(sheet, colX, colY);
  if (!pts.length) { showToast('No hay pares numéricos válidos'); return; }
  var n = pts.length;
  var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (var i = 0; i < n; i++) {
    sumX += pts[i].x; sumY += pts[i].y;
    sumXY += pts[i].x * pts[i].y; sumX2 += pts[i].x * pts[i].x;
  }
  var mediaX = sumX / n, mediaY = sumY / n;
  var num = sumXY - n * mediaX * mediaY;
  var den = sumX2 - n * mediaX * mediaX;
  if (den === 0) { showToast('La variable X tiene varianza cero'); return; }
  var b = num / den;
  var a = mediaY - b * mediaX;
  var ssTot = pts.reduce(function(s, p) { return s + Math.pow(p.y - mediaY, 2); }, 0);
  var ssRes = pts.reduce(function(s, p) { return s + Math.pow(p.y - (a + b * p.x), 2); }, 0);
  var r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  var xMin = Math.min.apply(null, pts.map(function(p) { return p.x; }));
  var xMax = Math.max.apply(null, pts.map(function(p) { return p.x; }));
  var linea = [
    { x: xMin, y: a + b * xMin },
    { x: xMax, y: a + b * xMax }
  ];

  var signStr = a >= 0 ? '+' : '-';
  var formula = 'y = ' + b.toFixed(4) + 'x ' + signStr + ' ' + Math.abs(a).toFixed(4);
  var title = 'Linealidad · ' + colX + ' vs ' + colY + '  |  ' + formula + '  R²=' + r2.toFixed(4);

  var id = 'viz-' + (++_vizCardCounter);
  var canvas = createChartCard(id, title, container, 500, {type:'linealidad', colX:colX, colY:colY});
  _vizChartInstances[id] = new Chart(canvas.getContext('2d'), {
    type: 'scatter',
    data: {
      datasets: [
        { label: colX + ' vs ' + colY, data: pts, backgroundColor: 'rgba(54,162,235,0.6)', pointRadius: 5, pointHoverRadius: 8, order: 2 },
        { label: 'Recta: ' + formula + ' (R²=' + r2.toFixed(4) + ')', data: linea, type: 'line', borderColor: '#43a047', borderWidth: 2.5, pointRadius: 0, tension: 0, fill: false, order: 1 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { color: '#ccc' } } },
      scales: {
        x: { title: { display: true, text: colX, color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { title: { display: true, text: colY, color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
  vizCaptureCardImage(id);
}

function renderBubbleCard(sheet, colX, colY, colSize, container) {
  var pts = vizGetValidBubbleData(sheet, colX, colY, colSize);
  if (!pts.length) { showToast('No hay datos numéricos válidos para burbuja'); return; }
  var id = 'viz-' + (++_vizCardCounter);
  var canvas = createChartCard(id, 'Burbuja · ' + colX + ' × ' + colY + ' (' + colSize + ')', container, 500, {type:'bubble', colX:colX, colY:colY, colSize:colSize});
  _vizChartInstances[id] = new Chart(canvas.getContext('2d'), {
    type: 'bubble',
    data: { datasets: [{ label: colX + ' vs ' + colY, data: pts, backgroundColor: 'rgba(54,162,235,0.5)' }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { color: '#ccc' } } },
      scales: {
        x: { title: { display: true, text: colX, color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { title: { display: true, text: colY, color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
  vizCaptureCardImage(id);
}

function renderPieCard(sheet, type, colX, colY, container) {
  var d = vizGetValidPairs(sheet, colX, colY);
  if (!d.data.length) { showToast('No hay datos válidos'); return; }
  var id = 'viz-' + (++_vizCardCounter);
  var canvas = createChartCard(id, vizTypeName(type) + ' · ' + colY + ' por ' + colX, container, 500, {type:type, colX:colX, colY:colY});
  var colors = vizDefaultColors(d.labels.length);
  _vizChartInstances[id] = new Chart(canvas.getContext('2d'), {
    type: type,
    data: { labels: d.labels, datasets: [{ data: d.data, backgroundColor: colors, borderColor: '#1e1e1e', borderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#ccc', boxWidth: 12 } } } }
  });
  vizCaptureCardImage(id);
}

function renderRadarCard(sheet, colX, colY, container) {
  var d = vizGetValidPairs(sheet, colX, colY);
  if (!d.data.length) { showToast('No hay datos válidos'); return; }
  var id = 'viz-' + (++_vizCardCounter);
  var canvas = createChartCard(id, 'Radar · ' + colY + ' por ' + colX, container, 500, {type:'radar', colX:colX, colY:colY});
  _vizChartInstances[id] = new Chart(canvas.getContext('2d'), {
    type: 'radar',
    data: { labels: d.labels, datasets: [{ label: colY, data: d.data, backgroundColor: 'rgba(54,162,235,0.2)', borderColor: 'rgba(54,162,235,1)', pointBackgroundColor: 'rgba(54,162,235,1)' }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#ccc' } } }, scales: { r: { angleLines: { color: 'rgba(255,255,255,0.1)' }, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { display: false }, pointLabels: { color: '#ccc' } } } }
  });
  vizCaptureCardImage(id);
}

function renderHistogramCard(sheet, colX, container) {
  var vals = vizGetValues(sheet, colX).filter(function(v){ return v !== null; });
  if (!vals.length) { showToast('No hay datos numéricos en ' + colX); return; }
  var bins = Math.min(Math.max(Math.round(Math.sqrt(vals.length)), 5), 30);
  var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
  if (min === max) { showToast('Todos los valores son iguales'); return; }
  var N = vals.length;
  var mean = vals.reduce(function(a,b){return a+b;}, 0) / N;
  var variance = vals.reduce(function(a,b){return a+(b-mean)*(b-mean);}, 0) / (N-1);
  var std = Math.sqrt(variance);
  var binWidth = (max - min) / bins;
  var counts = new Array(bins).fill(0);
  vals.forEach(function(v){ counts[Math.min(Math.floor((v - min) / binWidth), bins - 1)]++; });
  var labels = [], curveData = [];
  for (var i = 0; i < bins; i++) {
    var lo = (min + i * binWidth), hi = (min + (i+1) * binWidth);
    labels.push(lo.toFixed(2) + '-' + hi.toFixed(2));
    var mid = (lo + hi) / 2;
    var z = (mid - mean) / std;
    var pdf = Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI));
    curveData.push(pdf * N * binWidth);
  }
  var id = 'viz-' + (++_vizCardCounter);
  var canvas = createChartCard(id, 'Histograma + Curva Normal · ' + colX, container, 500, {type:'histogram', colX:colX});
  _vizChartInstances[id] = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: colX + ' (frecuencia)', data: counts, backgroundColor: 'rgba(54,162,235,0.6)', borderColor: 'rgba(54,162,235,1)', borderWidth: 1, order: 2 },
        { label: 'Curva normal', data: curveData, type: 'line', fill: false, borderColor: '#ff6b6b', borderWidth: 2, tension: 0.4, pointRadius: 0, order: 1 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { color: '#ccc' } } },
      scales: {
        x: { title: { display: true, text: colX, color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { title: { display: true, text: 'Frecuencia', color: '#ccc' }, ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
      }
    }
  });
  vizCaptureCardImage(id);
}

// ════════════════════════════════════════════════════════════════
// VISUALIZACIÓN — Persistencia de gráficos (localStorage)
// ════════════════════════════════════════════════════════════════
function vizSaveCards() {
  var container = document.getElementById('vizCardsContainer');
  if (!container) return;
  var cards = container.querySelectorAll('.page-card[id^="viz-"]');
  var params = [];
  cards.forEach(function(c) {
    if (c.dataset.vizParams) {
      try { params.push(JSON.parse(c.dataset.vizParams)); } catch(e) {}
    }
  });
  try { localStorage.setItem('sigmaPro_vizCards', JSON.stringify(params)); } catch(e) {
    if (e.name === 'QuotaExceededError') showToast('Almacenamiento lleno. Cierra algunos gráficos.');
  }
  vizSyncSidebarList();
}

function vizRestoreCards() {
  var saved;
  try { saved = localStorage.getItem('sigmaPro_vizCards'); } catch(e) { return; }
  if (!saved) return;
  var params;
  try { params = JSON.parse(saved); } catch(e) { return; }
  if (!params || !params.length) return;
  var sheet = getCurrentSheet();
  if (!sheet) return;
  var container = document.getElementById('vizCardsContainer');
  if (!container) return;
  params.forEach(function(p) {
    if (!p.colX || !sheet.headers.includes(p.colX)) return;
    if (p.type === 'histogram') { if (p.colX) renderHistogramCard(sheet, p.colX, container); return; }
    if (p.type === 'pie' || p.type === 'doughnut' || p.type === 'polarArea') {
      if (p.colY && sheet.headers.includes(p.colY)) renderPieCard(sheet, p.type, p.colX, p.colY, container);
      return;
    }
    if (p.type === 'radar') { if (p.colY && sheet.headers.includes(p.colY)) renderRadarCard(sheet, p.colX, p.colY, container); return; }
    if (p.type === 'scatter') { if (p.colY && sheet.headers.includes(p.colY)) renderScatterCard(sheet, p.colX, p.colY, container); return; }
    if (p.type === 'bubble') {
      if (p.colY && p.colSize && sheet.headers.includes(p.colY) && sheet.headers.includes(p.colSize)) renderBubbleCard(sheet, p.colX, p.colY, p.colSize, container);
      return;
    }
    if (p.type === 'stackedBar' || p.type === 'groupedBar' || p.type === 'multiLine' || p.type === 'area') {
      var yCols = (p.allY && p.allY.length) ? p.allY : [p.colY];
      yCols = yCols.filter(function(y){ return y && sheet.headers.includes(y); });
      if (yCols.length) renderMultiSeriesCard(sheet, p.type, p.colX, yCols, container);
      return;
    }
    if (p.colY && sheet.headers.includes(p.colY)) renderBarLineCard(sheet, p.type || 'bar', p.colX, p.colY, container);
  });
  vizSyncSidebarList();
}

