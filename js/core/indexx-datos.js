// ════════════════════════════════════════════════════════════════
// indexx-datos.js — Data management: file loading, parsing,
//                    preview, filters, pagination, export
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// DATOS PAGE
// ════════════════════════════════════════════════════════════════
(function loadRecentSafe() {
  try { var s = localStorage.getItem('datosRecentFiles'); if (s) datosRecentFiles = JSON.parse(s); } catch(e){}
})();

function initDatosPage() {
  var dropZone = document.getElementById('dropZone');
  var fileInput = document.getElementById('fileInput');
  var btnCsv = document.getElementById('btnCsv');
  var btnXlsx = document.getElementById('btnXlsx');
  var btnPaste = document.getElementById('btnPaste');
  var btnExport = document.getElementById('btnExport');
  var btnSendToTrabajo = document.getElementById('btnSendToTrabajo');
  var btnFilterRows = document.getElementById('btnFilterRows');
  var clearHistBtn = document.getElementById('clearHistoryBtn');

  if (dropZone) {
    dropZone.addEventListener('click', function(){ fileInput && fileInput.click(); });
    dropZone.addEventListener('dragover', function(e){ e.preventDefault(); dropZone.style.borderColor='var(--accent)'; dropZone.style.background='rgba(124,106,247,.15)'; });
    dropZone.addEventListener('dragleave', function(){ dropZone.style.borderColor=''; dropZone.style.background=''; });
    dropZone.addEventListener('drop', function(e){ e.preventDefault(); dropZone.style.borderColor=''; dropZone.style.background=''; if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]); });
  }
  if (fileInput) fileInput.addEventListener('change', function(e){ if (e.target.files.length > 0) handleFile(e.target.files[0]); });
  if (btnCsv) btnCsv.addEventListener('click', function(){ fileInput.accept='.csv'; fileInput.click(); });
  if (btnXlsx) btnXlsx.addEventListener('click', function(){ fileInput.accept='.xlsx,.xls'; fileInput.click(); });
  if (btnPaste) btnPaste.addEventListener('click', showPasteModal);
  if (btnExport) btnExport.addEventListener('click', showExportModal);
  if (btnSendToTrabajo) btnSendToTrabajo.addEventListener('click', sendToTrabajo);
  if (clearHistBtn) clearHistBtn.addEventListener('click', clearRecentFiles);
  if (btnFilterRows) btnFilterRows.addEventListener('click', showFilterModal);

  renderRecentFiles();
  if (datosCurrentData) updateDatosUI();
}

function handleFile(file) {
  if (file.size > 10 * 1024 * 1024) {
    showToast('⚠️ El archivo excede el límite de 10 MB');
    return;
  }
  var ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'csv') parseCSV(file);
  else if (ext === 'json') parseJSON(file);
  else if (ext === 'xlsx' || ext === 'xls') parseXLSX(file);
  else showToast('⚠️ Formato no soportado. Usa CSV, JSON o Excel (.xlsx).');
}

function parseCSV(file) {
  Papa.parse(file, {
    complete: function(results) {
      var data = results.data;
      if (!data || data.length === 0) { showToast('⚠️ El archivo está vacío'); return; }
      var headers = data[0];
      var rows = data.slice(1).filter(function(r){ return r.some(function(c){ return c && c.trim(); }); });
      finishLoad(headers, rows, file.name, file.size);
    },
    error: function(err){ showToast('⚠️ Error CSV: ' + err.message, true); },
    skipEmptyLines: true
  });
}

function parseJSON(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var json = JSON.parse(e.target.result);
      var headers = [], rows = [];
      if (Array.isArray(json) && json.length > 0) {
        headers = Object.keys(json[0]);
        rows = json.map(function(item){ return headers.map(function(h){ return item[h] == null ? '' : item[h]; }); });
      } else if (typeof json === 'object') {
        headers = Object.keys(json);
        rows = [Object.values(json).map(function(v){ return String(v); })];
      }
      if (!headers.length) { showToast('⚠️ JSON inválido o vacío'); return; }
      finishLoad(headers, rows, file.name, file.size);
    } catch(err) { showToast('⚠️ Error JSON: ' + err.message, true); }
  };
  reader.readAsText(file);
}

function parseXLSX(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      // Simple XLSX parser using binary data inspection
      // Falls back to CSV-like parsing if XLSX lib not available
      if (typeof XLSX !== 'undefined') {
        var wb = XLSX.read(data, {type:'array'});
        var ws = wb.Sheets[wb.SheetNames[0]];
        var jsonData = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});
        if (!jsonData.length) { showToast('⚠️ El archivo está vacío'); return; }
        var headers = jsonData[0].map(function(h){ return String(h || ''); });
        var rows = jsonData.slice(1).filter(function(r){ return r.some(function(c){ return c !== ''; }); })
          .map(function(r){ return headers.map(function(_,i){ return r[i] == null ? '' : String(r[i]); }); });
        finishLoad(headers, rows, file.name, file.size);
      } else {
        showToast('⚠️ Para archivos Excel, instala la librería SheetJS.', true);
      }
    } catch(err) { showToast('⚠️ Error Excel: ' + err.message, true); }
  };
  reader.readAsArrayBuffer(file);
}

function finishLoad(headers, rows, filename, size) {
  datosFilters = []; datosSortCol = -1; datosSortAsc = true; datosPage = 0;
  datosCurrentData = { headers: headers, rows: rows, colTypes: detectColTypes(headers, rows) };
  datosCurrentFileName = filename;
  datosSourceType = filename === 'datos_pegados.csv' ? 'paste' : 'file';
  addToRecentFiles({ name: filename, type: filename.split('.').pop().toUpperCase(), size: size || 0, rows: rows.length, date: new Date().toISOString() }, datosCurrentData);
  updateDatosUI();
  _persistAllData();
}

// ── Column type detection ──
function detectColTypes(headers, rows) {
  return headers.map(function(_, ci) {
    var vals = rows.map(function(r){ return r[ci]; }).filter(function(v){ return v !== '' && v != null; });
    if (!vals.length) return 'empty';
    var nums = vals.filter(function(v){ return !isNaN(parseFloat(v)) && isFinite(v); });
    if (nums.length > vals.length * 0.8) return 'number';
    var dates = vals.filter(function(v){ return !isNaN(Date.parse(v)); });
    if (dates.length > vals.length * 0.8) return 'date';
    return 'text';
  });
}

function showPasteModal() {
  var modal = document.createElement('div'); modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-box"><div class="modal-title">Pegar datos</div><div style="font-size:11px;color:var(--text-faint)">Desde Excel, Google Sheets, etc. (tabulaciones o comas)</div><textarea id="pasteTA" style="min-height:200px;background:var(--bg-primary);border:1px solid var(--border);border-radius:6px;padding:10px;color:var(--text-primary);font-family:monospace;font-size:12px;resize:vertical;width:100%" placeholder="Encabezado1\tEncabezado2\nValor1\tValor2"></textarea><div class="modal-actions"><button class="btn btn-secondary" id="pasteCancel">Cancelar</button><button class="btn btn-primary" id="pasteConfirm">Cargar</button></div></div>';
  document.body.appendChild(modal);
  document.getElementById('pasteCancel').addEventListener('click', function(){ modal.remove(); });
  document.getElementById('pasteConfirm').addEventListener('click', function(){
    var text = document.getElementById('pasteTA').value;
    if (!text.trim()) { showToast('⚠️ No hay datos'); return; }
    parsePastedData(text); modal.remove();
  });
  modal.addEventListener('click', function(e){ if (e.target === modal) modal.remove(); });
}

function parsePastedData(text) {
  var lines = text.trim().split('\n');
  var rows = lines.map(function(line){ return line.includes('\t') ? line.split('\t').map(function(c){ return c.trim(); }) : line.split(',').map(function(c){ return c.trim().replace(/^"|"$/g,''); }); });
  var headers = rows[0];
  var dataRows = rows.slice(1).filter(function(r){ return r.some(function(c){ return c && c.trim(); }); });
  finishLoad(headers, dataRows, 'datos_pegados.csv', text.length);
}

// ── Sort ──
function datosSetSort(colIdx) {
  if (datosSortCol === colIdx) datosSortAsc = !datosSortAsc;
  else { datosSortCol = colIdx; datosSortAsc = true; }
  datosPage = 0;
  renderDatosTable();
}

// ── Filters ──
function showFilterModal() {
  if (!datosCurrentData) { showToast('⚠️ Carga un dataset primero.'); return; }
  var modal = document.createElement('div'); modal.className = 'modal-overlay';
  var colOpts = datosCurrentData.headers.map(function(h,i){ return '<option value="' + i + '">' + escapeHtml(h) + '</option>'; }).join('');
  modal.innerHTML = '<div class="modal-box"><div class="modal-title">🔍 Agregar filtro</div>' +
    '<div class="modal-row"><span class="modal-label">Columna</span><select class="modal-select" id="fltCol">' + colOpts + '</select></div>' +
    '<div class="modal-row"><span class="modal-label">Operador</span><select class="modal-select" id="fltOp"><option value="contains">Contiene</option><option value="equals">Igual a</option><option value="gt">Mayor que</option><option value="lt">Menor que</option><option value="notempty">No vacío</option></select></div>' +
    '<div class="modal-row"><span class="modal-label">Valor</span><input id="fltVal" style="flex:1;background:var(--bg-primary);border:1px solid var(--border);border-radius:5px;color:var(--text-primary);font-size:12px;padding:5px 8px" placeholder="valor..."></div>' +
    '<div class="modal-actions"><button class="btn btn-secondary" id="fltCancel">Cancelar</button><button class="btn btn-primary" id="fltApply">Aplicar</button></div></div>';
  document.body.appendChild(modal);
  document.getElementById('fltCancel').addEventListener('click', function(){ modal.remove(); });
  document.getElementById('fltApply').addEventListener('click', function(){
    var col = parseInt(document.getElementById('fltCol').value);
    var op = document.getElementById('fltOp').value;
    var val = document.getElementById('fltVal').value;
    datosFilters.push({ col:col, op:op, val:val, label: datosCurrentData.headers[col] + ' ' + op + (val?' "'+val+'"':'') });
    datosPage = 0; renderDatosTable(); renderFilterBar(); modal.remove();
  });
  modal.addEventListener('click', function(e){ if (e.target === modal) modal.remove(); });
}
function removeFilter(i) {
  datosFilters.splice(i, 1); datosPage = 0; renderDatosTable(); renderFilterBar();
}
function renderFilterBar() {
  var bar = document.getElementById('datosFilterBar');
  if (!bar) return;
  if (!datosFilters.length) { bar.style.display = 'none'; bar.innerHTML = ''; return; }
  bar.style.display = 'flex';
  bar.className = 'filter-panel';
  bar.innerHTML = '<span style="font-size:11px;color:var(--text-faint)">Filtros:</span>' +
    datosFilters.map(function(f,i){ return '<div class="filter-chip">' + escapeHtml(f.label) + '<span class="filter-chip-x" onclick="removeFilter(' + i + ')">×</span></div>'; }).join('') +
    '<span style="font-size:11px;color:var(--text-faint);cursor:pointer;margin-left:4px" onclick="datosFilters=[];datosPage=0;renderDatosTable();renderFilterBar()">Limpiar todos</span>';
}
function applyFilters(rows) {
  return rows.filter(function(r) {
    return datosFilters.every(function(f) {
      var v = String(r[f.col] || '').toLowerCase();
      var fv = (f.val || '').toLowerCase();
      if (f.op === 'contains') return v.includes(fv);
      if (f.op === 'equals') return v === fv;
      if (f.op === 'gt') return parseFloat(r[f.col]) > parseFloat(f.val);
      if (f.op === 'lt') return parseFloat(r[f.col]) < parseFloat(f.val);
      if (f.op === 'notempty') return v.trim() !== '';
      return true;
    });
  });
}

// ── Pagination ──
function goPage(n) {
  var total = datosFilteredRows.length;
  var maxPage = Math.max(0, Math.ceil(total / datosPageSize) - 1);
  datosPage = Math.max(0, Math.min(n, maxPage));
  renderDatosTable();
}
function changePageSize(v) {
  datosPageSize = parseInt(v); datosPage = 0; renderDatosTable();
}

function updateDatosUI() {
  var nameEl = document.getElementById('datosDatasetName');
  var rowsEl = document.getElementById('datosRowCount');
  var colsEl = document.getElementById('datosColCount');
  var badge = document.getElementById('datosRecordBadge');
  var empty = document.getElementById('datosEmptyState');
  var container = document.getElementById('datosTableContainer');
  var pgBar = document.getElementById('datosPaginationBar');

  if (datosCurrentData) {
    if (nameEl) nameEl.textContent = datosCurrentFileName;
    if (rowsEl) rowsEl.textContent = datosCurrentData.rows.length;
    if (colsEl) colsEl.textContent = datosCurrentData.headers.length;
    if (badge) { badge.textContent = datosCurrentData.rows.length + ' filas'; badge.style.background = 'var(--accent)'; badge.style.color = '#fff'; }
    if (empty) empty.style.display = 'none';
    if (container) container.style.display = 'block';
    if (pgBar) pgBar.style.display = 'flex';
    renderDatosTable();
    renderFilterBar();
  } else {
    if (nameEl) nameEl.textContent = 'Sin cargar';
    if (rowsEl) rowsEl.textContent = '—';
    if (colsEl) colsEl.textContent = '—';
    if (badge) { badge.textContent = 'Sin datos'; badge.style.background = 'var(--item-bg)'; badge.style.color = 'var(--text-faint)'; }
    if (empty) empty.style.display = 'flex';
    if (container) container.style.display = 'none';
    if (pgBar) pgBar.style.display = 'none';
  }
}

function renderDatosTable() {
  var head = document.getElementById('datosTableHead');
  var body = document.getElementById('datosTableBody');
  var pgInfo = document.getElementById('pgInfo');
  var pgFirst = document.getElementById('pgFirst');
  var pgPrev = document.getElementById('pgPrev');
  var pgNext = document.getElementById('pgNext');
  var pgLast = document.getElementById('pgLast');
  if (!datosCurrentData || !head || !body) return;

  // Type badge color
  var typeColor = { number:'#60a5fa', text:'#888', date:'#4ade80', empty:'#555' };
  var typeLabel = { number:'123', text:'abc', date:'📅', empty:'—' };
  var types = datosCurrentData.colTypes || [];

  head.innerHTML = '<tr><th style="width:44px;cursor:default">#</th>' +
    datosCurrentData.headers.map(function(h, i) {
      var sortClass = datosSortCol === i ? (datosSortAsc ? 'sort-asc' : 'sort-desc') : '';
      var typ = types[i] || 'text';
      return '<th class="' + sortClass + '" style="cursor:pointer;white-space:nowrap" onclick="datosSetSort(' + i + ')" title="Clic para ordenar">' +
        '<span style="display:inline-block;font-size:9px;background:rgba(255,255,255,.06);color:' + typeColor[typ] + ';border-radius:3px;padding:1px 4px;margin-right:4px;font-weight:400">' + typeLabel[typ] + '</span>' +
        escapeHtml(h) + '</th>';
    }).join('') + '</tr>';

  // Apply filters then sort
  var rows = applyFilters(datosCurrentData.rows);
  if (datosSortCol >= 0) {
    var sc = datosSortCol, asc = datosSortAsc;
    rows = rows.slice().sort(function(a,b){
      var va = a[sc] || '', vb = b[sc] || '';
      var na = parseFloat(va), nb = parseFloat(vb);
      if (!isNaN(na) && !isNaN(nb)) return asc ? na-nb : nb-na;
      return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }
  datosFilteredRows = rows;

  var total = rows.length;
  var maxPage = Math.max(0, Math.ceil(total / datosPageSize) - 1);
  if (datosPage > maxPage) datosPage = maxPage;
  var start = datosPage * datosPageSize;
  var end = Math.min(start + datosPageSize, total);
  var pageRows = rows.slice(start, end);

  var html = '';
  for (var i = 0; i < pageRows.length; i++) {
    var r = pageRows[i];
    html += '<tr><td class="mono">' + (start + i + 1) + '</td>';
    for (var j = 0; j < datosCurrentData.headers.length; j++) {
      var v = r[j] == null ? '' : r[j];
      html += '<td>' + escapeHtml(String(v)) + '</td>';
    }
    html += '</tr>';
  }
  if (!html) html = '<tr><td colspan="' + (datosCurrentData.headers.length+1) + '" style="text-align:center;color:var(--text-faint);padding:20px">Sin resultados</td></tr>';
  body.innerHTML = html;

  // Update pagination
  if (pgInfo) pgInfo.textContent = 'Mostrando ' + (total ? start+1 : 0) + '–' + end + ' de ' + total + (datosFilters.length ? ' (filtrado de ' + datosCurrentData.rows.length + ')' : '');
  if (pgFirst) pgFirst.disabled = datosPage === 0;
  if (pgPrev) pgPrev.disabled = datosPage === 0;
  if (pgNext) pgNext.disabled = datosPage >= maxPage;
  if (pgLast) pgLast.disabled = datosPage >= maxPage;

  // Update badge
  var badge = document.getElementById('datosRecordBadge');
  if (badge) { badge.textContent = total + ' filas' + (datosFilters.length ? ' (filtrado)' : ''); }
}

// ── Export modal ──
function showExportModal() {
  if (!datosCurrentData) { showToast('⚠️ No hay datos para exportar.'); return; }
  var modal = document.createElement('div'); modal.className = 'modal-overlay';
  var colChecks = datosCurrentData.headers.map(function(h,i){
    return '<label class="col-toggle"><input type="checkbox" checked data-ci="' + i + '"> ' + escapeHtml(h) + '</label>';
  }).join('');
  modal.innerHTML = '<div class="modal-box"><div class="modal-title">↓ Exportar dataset</div>' +
    '<div class="modal-row"><span class="modal-label">Formato</span><select class="modal-select" id="expFmt"><option value="csv">CSV</option><option value="json">JSON</option><option value="tsv">TSV</option></select></div>' +
    '<div class="modal-row" style="align-items:flex-start"><span class="modal-label" style="padding-top:4px">Columnas</span><div class="modal-cols" id="expCols">' + colChecks + '</div></div>' +
    '<div class="modal-actions"><button class="btn btn-secondary" id="expCancel">Cancelar</button><button class="btn btn-primary" id="expGo">Exportar</button></div></div>';
  document.body.appendChild(modal);
  document.getElementById('expCancel').addEventListener('click', function(){ modal.remove(); });
  document.getElementById('expGo').addEventListener('click', function(){
    var fmt = document.getElementById('expFmt').value;
    var selCols = Array.from(document.querySelectorAll('#expCols input:checked')).map(function(el){ return parseInt(el.dataset.ci); });
    if (!selCols.length) { showToast('⚠️ Selecciona al menos una columna.'); return; }
    doExport(fmt, selCols); modal.remove();
  });
  modal.addEventListener('click', function(e){ if (e.target === modal) modal.remove(); });
}
function doExport(fmt, selCols) {
  var rows = datosFilteredRows.length ? datosFilteredRows : datosCurrentData.rows;
  var headers = selCols.map(function(i){ return datosCurrentData.headers[i]; });
  var data = rows.map(function(r){ return selCols.map(function(i){ return r[i] == null ? '' : r[i]; }); });
  var content = '', ext = fmt, mime = 'text/plain';
  if (fmt === 'csv' || fmt === 'tsv') {
    var sep = fmt === 'tsv' ? '\t' : ',';
    content = headers.join(sep) + '\n' + data.map(function(r){ return r.map(function(c){ var s=String(c); return (fmt==='csv'&&(s.includes(',')||s.includes('"')))?'"'+s.replace(/"/g,'""')+'"':s; }).join(sep); }).join('\n');
    mime = 'text/' + (fmt === 'tsv' ? 'tab-separated-values' : 'csv') + ';charset=utf-8;';
  } else if (fmt === 'json') {
    content = JSON.stringify(data.map(function(r){ var o={}; headers.forEach(function(h,i){ o[h]=r[i]; }); return o; }), null, 2);
    mime = 'application/json'; ext = 'json';
  }
  var blob = new Blob([content], {type:mime});
  var link = document.createElement('a'); link.href = URL.createObjectURL(blob);
  link.download = datosCurrentFileName.replace(/\.[^.]+$/,'_export.' + ext); link.click(); URL.revokeObjectURL(link.href);
}

// ── Recent files ──
function addToRecentFiles(info, data) {
  datosRecentFiles = datosRecentFiles.filter(function(f){ return f.name !== info.name; });
  var entry = Object.assign({}, info);
  if (data && data.rows) { entry.headers = data.headers; entry.rows = data.rows.slice(0, 200); entry.totalRows = data.rows.length; }
  datosRecentFiles.unshift(entry);
  if (datosRecentFiles.length > 5) datosRecentFiles = datosRecentFiles.slice(0, 5);
  try { localStorage.setItem('datosRecentFiles', JSON.stringify(datosRecentFiles)); } catch(e){}
  renderRecentFiles();
}
function clearRecentFiles() {
  if (!confirm('¿Eliminar todo el historial?')) return;
  datosRecentFiles = [];
  try { localStorage.setItem('datosRecentFiles', '[]'); } catch(e){}
  renderRecentFiles();
}
function renderRecentFiles() {
  var container = document.getElementById('recentFilesList');
  if (!container) return;
  if (!datosRecentFiles.length) { container.innerHTML = '<div style="color:var(--text-faint);font-size:11px;padding:8px;text-align:center">Sin archivos recientes</div>'; return; }
  container.innerHTML = datosRecentFiles.map(function(file, i) {
    var icon = file.type === 'CSV' ? '📄' : file.type === 'JSON' ? '📋' : '📊';
    var bc = file.type === 'CSV' ? 'badge-ok' : file.type === 'JSON' ? 'badge-warn' : 'badge-info';
    var kb = Math.max(1, Math.round((file.size||0) / 1024));
    var hasData = file.headers && file.rows;
    return '<div class="file-item" style="flex-direction:column;align-items:flex-start;gap:3px" onclick="loadRecentFile(' + i + ')" ' +
      (hasData ? 'onmouseenter="showDatasetPreview(event,' + i + ')" onmouseleave="hideDatasetPreview()"' : '') + '>' +
      '<div style="display:flex;align-items:center;gap:8px;width:100%">' +
        '<span style="font-size:16px">' + icon + '</span>' +
        '<div style="flex:1;min-width:0"><div class="file-item-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(file.name) + '</div>' +
        '<div class="file-item-meta">' + kb + ' KB · ' + (file.totalRows || (file.rows && file.rows.length) || 0) + ' filas</div></div>' +
        '<span class="badge ' + bc + '">' + file.type + '</span>' +
      '</div></div>';
  }).join('');
}

var _tooltipEl = document.getElementById('datasetTooltipEl');
function showDatasetPreview(event, index) {
  var file = datosRecentFiles[index];
  if (!file || !file.headers || !file.rows || !file.rows.length) return;
  var rows = file.rows.slice(0, 8);
  var th = file.headers.map(function(h){ return '<th>' + escapeHtml(String(h)) + '</th>'; }).join('');
  var tb = rows.map(function(r){ return '<tr>' + r.map(function(c){ var s=escapeHtml(String(c==null?'':c)); return '<td title="'+s+'">'+s+'</td>'; }).join('') + '</tr>'; }).join('');
  var total = file.totalRows || file.rows.length;
  _tooltipEl.innerHTML = '<div class="preview-tooltip-title">' + escapeHtml(file.name) + '</div>' +
    '<table class="preview-tooltip-table"><thead><tr>' + th + '</tr></thead><tbody>' + tb + '</tbody></table>' +
    '<div class="preview-tooltip-footer">' + (total > 8 ? 'Mostrando 8 de ' + total : total) + ' filas</div>';
  var rect = event.target.getBoundingClientRect();
  var left = rect.right + 10; var top = rect.top;
  if (left + 360 > window.innerWidth) left = rect.left - 360;
  if (top + 260 > window.innerHeight) top = window.innerHeight - 260;
  _tooltipEl.style.left = Math.max(10, left) + 'px'; _tooltipEl.style.top = Math.max(10, top) + 'px';
  _tooltipEl.classList.add('visible');
}
function hideDatasetPreview() { _tooltipEl.classList.remove('visible'); }

function loadRecentFile(index) {
  var file = datosRecentFiles[index];
  if (!file) return;
  if (file.headers && file.rows) {
    datosFilters = []; datosSortCol = -1; datosSortAsc = true; datosPage = 0;
    datosCurrentData = { headers: file.headers, rows: file.rows, colTypes: detectColTypes(file.headers, file.rows) };
    datosCurrentFileName = file.name;
    updateDatosUI();
  } else {
    showToast('⚠️ Datos no disponibles en memoria. Vuelve a importar el archivo.');
  }
}

function sendToTrabajo() {
  if (!datosCurrentData) { showToast('⚠️ No hay datos para enviar. Importa un archivo primero.'); return; }
  var name = datosCurrentFileName.replace(/\.[^.]+$/, '');
  var existIdx = trabajoSheets.findIndex(function(s){ return s.name === name; });
  if (existIdx !== -1) { trabajoActiveSheetIndex = existIdx; loadPage('trabajo'); return; }
  var rowsToSend = datosFilteredRows.length && datosFilteredRows.length < datosCurrentData.rows.length ? datosFilteredRows : datosCurrentData.rows;
  trabajoSheets.push({ name:name, headers:datosCurrentData.headers.slice(), rows:rowsToSend.map(function(r){ return r.map(function(v){ return String(v==null?'':v); }); }) });
  trabajoActiveSheetIndex = trabajoSheets.length - 1;
  trabajoActiveCell = {row:0,col:0};
  _persistAllData();
  loadPage('trabajo');
}

