// ════════════════════════════════════════════════════════════════
// indexx-trabajo.js — Worksheet: undo/redo, modals, column stats,
//                     limits, cell interaction, keyboard nav
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// TRABAJO — UNDO/REDO
// ════════════════════════════════════════════════════════════════
function snapshotSheet() {
  var sheet = getCurrentSheet();
  if (!sheet) return null;
  return { headers: sheet.headers.slice(), rows: sheet.rows.map(function(r){ return r.slice(); }) };
}
function pushUndo() {
  var snap = snapshotSheet();
  if (!snap) return;
  undoStack.push(snap);
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  redoStack = [];
}
function undoAction() {
  if (!undoStack.length) { showToast('Nada que deshacer'); return; }
  var current = snapshotSheet();
  if (current) redoStack.push(current);
  var snap = undoStack.pop();
  var sheet = getCurrentSheet();
  if (!sheet) return;
  sheet.headers = snap.headers;
  sheet.rows = snap.rows;
  showToast('↩ Acción deshecha');
  loadPage('trabajo');
}
function redoAction() {
  if (!redoStack.length) { showToast('Nada que rehacer'); return; }
  var current = snapshotSheet();
  if (current) undoStack.push(current);
  var snap = redoStack.pop();
  var sheet = getCurrentSheet();
  if (!sheet) return;
  sheet.headers = snap.headers;
  sheet.rows = snap.rows;
  showToast('↪ Acción rehecha');
  loadPage('trabajo');
}
var _toastTimer = null;
function showToast(msg) {
  var t = document.getElementById('undoToast');
  var inner = document.getElementById('undoToastInner');
  inner.textContent = msg; t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2000);
}

function nuevoProyecto() {
  if (!confirm('¿Crear un nuevo proyecto? Se perderán los datos actuales.')) return;
  if (typeof StateManager !== 'undefined') StateManager.resetState();
  localStorage.removeItem('statAnalyzerState');
  location.reload();
}

function showHelpModal() {
  var existing = document.getElementById('helpModal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'helpModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  modal.onclick = function(){ modal.remove(); };
  modal.innerHTML = '<div style="background:var(--bg-panel);border-radius:14px;padding:24px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.5);color:var(--text-primary)" onclick="event.stopPropagation()">' +
    '<h2 style="margin:0 0 16px;font-size:1.1rem;display:flex;align-items:center;gap:8px">⌨️ Atajos de teclado</h2>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 20px;font-size:0.85rem">' +
    '<span style="color:var(--text-muted)">Ctrl+Shift+D</span><span>Cambiar tema</span>' +
    '<span style="color:var(--text-muted)">Ctrl+Shift+A</span><span>Asistente IA</span>' +
    '<span style="color:var(--text-muted)">Ctrl+Z / Ctrl+Shift+Z</span><span>Deshacer / Rehacer</span>' +
    '<span style="color:var(--text-muted)">Ctrl+O</span><span>Cargar dataset</span>' +
    '<span style="color:var(--text-muted)">Ctrl+S</span><span>Guardar sesión</span>' +
    '<span style="color:var(--text-muted)">Ctrl+B</span><span>Toggle Sidebar</span>' +
    '</div>' +
    '<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">' +
    '<p style="margin:0 0 6px;font-size:0.85rem;font-weight:600">📖 Uso básico</p>' +
    '<ol style="margin:0;padding-left:18px;font-size:0.8rem;color:var(--text-muted);line-height:1.7">' +
    '<li>Carga un dataset (CSV, JSON, Excel, o pégalo)</li>' +
    '<li>Trabaja los datos en la hoja de cálculo</li>' +
    '<li>Ejecuta análisis estadísticos desde Statistical Analysis</li>' +
    '<li>Visualiza resultados con gráficos Chart.js</li>' +
    '<li>Genera reportes en PDF/DOCX/HTML</li>' +
    '</ol></div>' +
    '<button class="btn btn-primary" style="margin-top:16px;width:100%;justify-content:center" onclick="this.closest(\'#helpModal\').remove()">Cerrar</button></div>';
  document.body.appendChild(modal);
}

function showAboutModal() {
  var existing = document.getElementById('aboutModal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'aboutModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  modal.onclick = function(){ modal.remove(); };
  modal.innerHTML = '<div style="background:var(--bg-panel);border-radius:14px;padding:24px;max-width:380px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.5);color:var(--text-primary)" onclick="event.stopPropagation()">' +
    '<div style="font-size:2.5rem;margin-bottom:8px">📊</div>' +
    '<h2 style="margin:0 0 4px;font-size:1.2rem">StatAnalyzer Pro</h2>' +
    '<p style="margin:0 0 2px;font-size:0.85rem;color:var(--text-muted)">Versión 2.6</p>' +
    '<p style="margin:0 0 14px;font-size:0.8rem;color:var(--text-faint)">Análisis estadístico vanilla JS</p>' +
    '<div style="font-size:0.8rem;color:var(--text-muted);line-height:1.6;padding:12px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:14px">' +
    'Plataforma de análisis de datos con:' +
    '<br>• 20+ pruebas estadísticas<br>• Gráficos Chart.js<br>• Reportes PDF/DOCX/HTML<br>• Gestión de usuarios y roles' +
    '</div>' +
    '<button class="btn btn-primary" style="width:100%;justify-content:center" onclick="this.closest(\'#aboutModal\').remove()">Cerrar</button></div>';
  document.body.appendChild(modal);
}

function showSettingsModal() {
  var existing = document.getElementById('settingsModal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'settingsModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  modal.onclick = function(){ modal.remove(); };
  var fontSize = parseFloat(getComputedStyle(document.body).fontSize);
  var fontSizeLabel = fontSize <= 13 ? 'Pequeño' : fontSize >= 16 ? 'Grande' : 'Medio';
  modal.innerHTML = '<div style="background:var(--bg-panel);border-radius:14px;padding:24px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.5);color:var(--text-primary)" onclick="event.stopPropagation()">' +
    '<h2 style="margin:0 0 16px;font-size:1.1rem;display:flex;align-items:center;gap:8px">⚙️ Configuración</h2>' +
    '<div style="display:flex;flex-direction:column;gap:14px;font-size:0.9rem">' +
    '<div class="settings-row" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-base);border-radius:8px">' +
      '<span>🌙 Tema oscuro</span>' +
      '<label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">' +
        '<input type="checkbox" id="settingsThemeToggle" ' + (document.documentElement.getAttribute('data-theme') !== 'light' ? 'checked' : '') +
        ' style="opacity:0;width:0;height:0" onchange="document.getElementById(\'themeToggle\').click();document.getElementById(\'settingsThemeToggle\').checked=document.documentElement.getAttribute(\'data-theme\')!==\'light\'">' +
        '<span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:var(--text-faint);border-radius:11px;transition:.3s"></span>' +
        '<span style="position:absolute;content:\'\';height:18px;width:18px;left:2px;bottom:2px;background:var(--bg-panel);border-radius:50%;transition:.3s;' + (document.documentElement.getAttribute('data-theme') !== 'light' ? 'transform:translateX(18px)' : '') + '"></span>' +
      '</label>' +
    '</div>' +
    '<div class="settings-row" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-base);border-radius:8px">' +
      '<span>🔤 Tamaño de fuente</span>' +
      '<div style="display:flex;gap:6px;align-items:center">' +
        '<span id="settingsFontSizeLabel" style="font-size:0.8rem;color:var(--text-muted);min-width:60px;text-align:center">' + fontSizeLabel + '</span>' +
        '<button class="btn btn-sm" style="padding:2px 10px;font-size:0.8rem" onclick="var fs=parseFloat(getComputedStyle(document.body).fontSize);if(fs>11){document.body.style.fontSize=(fs-1)+\'px\';updateSettingsFontLabel()}">−</button>' +
        '<button class="btn btn-sm" style="padding:2px 10px;font-size:0.8rem" onclick="var fs=parseFloat(getComputedStyle(document.body).fontSize);if(fs<20){document.body.style.fontSize=(fs+1)+\'px\';updateSettingsFontLabel()}">+</button>' +
      '</div>' +
    '</div>' +
    '<div class="settings-row" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-base);border-radius:8px">' +
      '<span>🗑️ Datos guardados</span>' +
      '<button class="btn btn-sm" style="padding:2px 10px;font-size:0.8rem;color:var(--danger)" onclick="if(confirm(\'¿Limpiar todos los datos guardados?\\nEsto cerrará la sesión actual.\')){localStorage.clear();sessionStorage.clear();location.reload()}">Limpiar</button>' +
    '</div>' +
    '</div>' +
    '<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border);font-size:0.75rem;color:var(--text-faint)">' +
    'Obsidian Vault · StatAnalyzer Pro 2.6</div>' +
    '<button class="btn btn-primary" style="margin-top:12px;width:100%;justify-content:center" onclick="this.closest(\'#settingsModal\').remove()">Cerrar</button></div>';
  document.body.appendChild(modal);
}
function updateSettingsFontLabel() {
  var label = document.getElementById('settingsFontSizeLabel');
  if (!label) return;
  var fs = parseFloat(getComputedStyle(document.body).fontSize);
  label.textContent = fs <= 13 ? 'Pequeño' : fs >= 16 ? 'Grande' : 'Medio';
}

// ════════════════════════════════════════════════════════════════
function toggleFreezeCol() {
  trabajoFreezeFirstCol = !trabajoFreezeFirstCol;
  loadPage('trabajo');
}
function toggleConditionalFormat() {
  trabajoConditionalFormat = !trabajoConditionalFormat;
  loadPage('trabajo');
}
function getCFClass(val, colIdx) {
  if (!trabajoConditionalFormat) return '';
  var n = parseFloat(val);
  if (isNaN(n)) return '';
  var sheet = getCurrentSheet();
  if (!sheet) return '';
  var colVals = sheet.rows.map(function(r){ return parseFloat(r[colIdx]); }).filter(function(v){ return !isNaN(v); });
  if (!colVals.length) return '';
  var mn = Math.min.apply(null, colVals), mx = Math.max.apply(null, colVals), mid = (mn + mx) / 2;
  var pct = mx === mn ? 0.5 : (n - mn) / (mx - mn);
  if (pct >= 0.7) return 'cf-high';
  if (pct <= 0.3) return 'cf-low';
  return 'cf-mid';
}

// ════════════════════════════════════════════════════════════════
// TRABAJO — COLUMN STATS TOOLTIP
// ════════════════════════════════════════════════════════════════
function showColStats(event, colIdx) {
  var sheet = getCurrentSheet();
  if (!sheet) return;
  var vals = sheet.rows.map(function(r){ return r[colIdx]; });
  var nums = vals.map(function(v){ return parseFloat(v); }).filter(function(v){ return !isNaN(v); });
  var empty = vals.filter(function(v){ return !v || String(v).trim() === ''; }).length;
  var tt = document.getElementById('colStatsTooltip');
  var colName = sheet.headers[colIdx] || ('Col ' + (colIdx+1));
  var body = '<div class="col-stats-title">' + escapeHtml(colName) + '</div>';
  body += '<div class="col-stats-row"><span>Tipo</span><span>' + (nums.length > vals.length * 0.5 ? 'Numérico' : 'Texto') + '</span></div>';
  body += '<div class="col-stats-row"><span>No vacíos</span><span>' + (vals.length - empty) + '</span></div>';
  body += '<div class="col-stats-row"><span>Vacíos</span><span>' + empty + '</span></div>';
  if (nums.length > 0) {
    var sum = nums.reduce(function(a,b){ return a+b; }, 0);
    var avg = (sum / nums.length).toFixed(2);
    var mn = Math.min.apply(null, nums).toFixed(2);
    var mx = Math.max.apply(null, nums).toFixed(2);
    body += '<div class="col-stats-row"><span>Mín</span><span>' + mn + '</span></div>';
    body += '<div class="col-stats-row"><span>Máx</span><span>' + mx + '</span></div>';
    body += '<div class="col-stats-row"><span>Promedio</span><span>' + avg + '</span></div>';
  }
  tt.innerHTML = body;
  var rect = event.target.getBoundingClientRect();
  tt.style.left = (rect.left) + 'px';
  tt.style.top = (rect.bottom + 6) + 'px';
  tt.classList.add('visible');
}
function hideColStats() {
  document.getElementById('colStatsTooltip').classList.remove('visible');
}

// ════════════════════════════════════════════════════════════════
// TRABAJO — SHEET HELPERS
// ════════════════════════════════════════════════════════════════
function getCurrentSheet() {
  if (trabajoSheets && trabajoSheets.length > 0) return trabajoSheets[trabajoActiveSheetIndex];
  return null;
}
function updateAnalisisDatasetBadge() {
  var nameEl = document.getElementById('analisisDsName');
  var rowsEl = document.getElementById('analisisDsRows');
  var colsEl = document.getElementById('analisisDsCols');
  if (!nameEl) return;
  var sheet = getCurrentSheet();
  if (sheet) {
    nameEl.textContent = sheet.name;
    rowsEl.textContent = sheet.rows.length;
    colsEl.textContent = sheet.headers.length;
  } else {
    nameEl.textContent = 'Ninguno';
    rowsEl.textContent = '0';
    colsEl.textContent = '0';
  }
}
function getTrabajoSheetsListHTML() {
  var html = '';
  trabajoSheets.forEach(function(sheet, i) {
    var isActive = i === trabajoActiveSheetIndex;
    html += '<div class="sheet-list-item ' + (isActive ? 'active-sheet-item' : '') + '" onclick="switchToSheet(' + i + ')">' +
      '<span>📋 ' + escapeHtml(sheet.name) + '</span>' +
      (trabajoSheets.length > 1 ? '<span class="sheet-del-btn" onclick="deleteSheet(' + i + ',event)" title="Eliminar hoja">×</span>' : '') +
    '</div>';
  });
  html += '<div class="info-item" style="color:var(--accent);font-size:11px" onclick="createNewSheet()">+ Nueva hoja</div>';
  return html;
}
function getSheetsOptionsHTML() {
  return trabajoSheets.map(function(sheet, i) {
    return '<option value="' + i + '"' + (i === trabajoActiveSheetIndex ? ' selected' : '') + '>' + escapeHtml(sheet.name) + '</option>';
  }).join('');
}
function getTrabajoTabsHTML() {
  return trabajoSheets.map(function(sheet, i) {
    var isActive = i === trabajoActiveSheetIndex;
    return '<div style="padding:4px 8px 4px 10px;font-size:11px;border-right:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:2px;' +
      (isActive ? 'color:var(--text-muted);border-top:2px solid var(--accent)' : 'color:var(--text-faint)') +
      '" onclick="switchToSheet(' + i + ')">' + escapeHtml(sheet.name) +
      (trabajoSheets.length > 1 ? '<span class="sheet-tab-del" onclick="deleteSheet(' + i + ',event)" title="Eliminar">×</span>' : '') +
    '</div>';
  }).join('');
}
function getTrabajoResumenHTML() {
  var sheet = getCurrentSheet();
  var rows = sheet ? sheet.rows.length : 0, cols = sheet ? sheet.headers.length : 0;
  var empty = sheet ? sheet.rows.flat().filter(function(c){ return !c || String(c).trim() === ''; }).length : 0;
  var allNums = [];
  if (sheet) {
    sheet.rows.forEach(function(r){ r.forEach(function(c){ var v = parseFloat(c); if (!isNaN(v) && isFinite(v)) allNums.push(v); }); });
  }
  var minV = allNums.length ? Math.min.apply(null, allNums) : null;
  var meanV = allNums.length ? (allNums.reduce(function(a,b){return a+b;},0) / allNums.length) : null;
  var maxV = allNums.length ? Math.max.apply(null, allNums) : null;
  var clean = empty === 0;
  return '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;padding:0 4px">' +
    '<div style="font-size:10px;padding:1px 6px;border-radius:4px;background:' + (clean ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)') + ';border:.5px solid ' + (clean ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)') + ';color:' + (clean ? '#4ade80' : '#f87171') + ';display:flex;align-items:center;gap:3px">' +
    (clean ? '✓ Sin anomalías' : '⚠ ' + empty + ' vacías') +
    '</div></div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px 8px;padding:0 4px">' +
    '<div><div style="font-size:10px;color:var(--text-muted)">Filas</div><div style="font-size:13px;font-weight:500;color:var(--text-primary);font-variant-numeric:tabular-nums">' + rows.toLocaleString() + '</div></div>' +
    '<div><div style="font-size:10px;color:var(--text-muted)">Columnas</div><div style="font-size:13px;font-weight:500;color:var(--text-primary)">' + cols + '</div></div>' +
    '<div><div style="font-size:10px;color:var(--text-muted)">Vacías</div><div style="font-size:13px;font-weight:500;color:' + (clean ? 'var(--text-muted)' : '#f87171') + '">' + empty + '</div></div>' +
    '<div><div style="font-size:10px;color:var(--text-muted)">Mínimo</div><div style="font-size:13px;font-weight:500;color:var(--text-primary);font-variant-numeric:tabular-nums">' + (minV !== null ? minV.toFixed(2) : '—') + '</div></div>' +
    '<div><div style="font-size:10px;color:var(--text-muted)">Media</div><div style="font-size:13px;font-weight:500;color:var(--text-primary);font-variant-numeric:tabular-nums">' + (meanV !== null ? meanV.toFixed(2) : '—') + '</div></div>' +
    '<div><div style="font-size:10px;color:var(--text-muted)">Máximo</div><div style="font-size:13px;font-weight:500;color:var(--text-primary);font-variant-numeric:tabular-nums">' + (maxV !== null ? maxV.toFixed(2) : '—') + '</div></div>' +
    '</div>';
}
function getTrabajoCeldaActivaHTML() {
  var colLetter = String.fromCharCode(65 + trabajoActiveCell.col);
  var sheet = getCurrentSheet();
  var rowIdx = trabajoActiveCell.row;
  var colIdx = trabajoActiveCell.col;
  var val = (sheet && sheet.rows[rowIdx]) ? (sheet.rows[rowIdx][colIdx] || '') : '';
  var numericVal = parseFloat(val);
  var colVals = [];
  if (sheet) {
    sheet.rows.forEach(function(r){ var v = parseFloat(r[colIdx]); if (!isNaN(v) && isFinite(v)) colVals.push(v); });
  }
  var colMean = null, colStd = null;
  if (colVals.length > 0) {
    var s = 0; colVals.forEach(function(v){ s += v; });
    colMean = s / colVals.length;
    if (colVals.length > 1) {
      var sq = 0; colVals.forEach(function(v){ var d = v - colMean; sq += d * d; });
      colStd = Math.sqrt(sq / (colVals.length - 1));
    }
  }
  var colMin = colVals.length ? Math.min.apply(null, colVals) : null;
  var colMax = colVals.length ? Math.max.apply(null, colVals) : null;
  var barPos = '50%';
  var isOutRange = false;
  if (colMin !== null && colMax !== null && isFinite(numericVal)) {
    var cr = colMax - colMin;
    if (cr > 0) barPos = ((numericVal - colMin) / cr * 100).toFixed(1) + '%';
    isOutRange = numericVal < colMin || numericVal > colMax;
  }
  return '<div style="padding:8px 10px">' +
    '<div style="display:flex;align-items:center;gap:8px">' +
      '<code style="font-size:11px;padding:2px 5px;background:var(--bg-primary);border:.5px solid var(--border);border-radius:4px;color:var(--text-muted);font-family:var(--font-mono)">' + colLetter + (rowIdx + 1) + '</code>' +
      '<span style="font-size:15px;font-weight:500;color:var(--text-primary);font-variant-numeric:tabular-nums;font-family:var(--font-mono)">' + escapeHtml(String(val)) + '</span>' +
      '<div style="margin-left:auto;text-align:right">' +
        '<div style="font-size:10px;color:var(--text-muted)">Col μ / σ</div>' +
        '<div style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums">' + (colMean !== null ? colMean.toFixed(2) : '—') + ' / ' + (colStd !== null ? colStd.toFixed(2) : '—') + '</div>' +
      '</div>' +
    '</div>' +
    '<div style="margin-top:.4rem">' +
      '<div style="height:3px;background:var(--bg-primary);border-radius:1.5px;position:relative">' +
        (colMin !== null ? '<div style="position:absolute;left:' + barPos + ';top:-2px;width:1.5px;height:7px;background:' + (isOutRange ? 'var(--accent-warn)' : 'var(--accent)') + ';border-radius:1px" title="Valor actual"></div>' : '') +
      '</div>' +
      (colMin !== null ? '<div style="display:flex;justify-content:space-between;margin-top:2px">' +
        '<span style="font-size:9px;color:var(--text-muted)">' + colMin.toFixed(2) + '</span>' +
        '<span style="font-size:9px;color:' + (isOutRange ? 'var(--accent-warn)' : 'var(--text-faint)') + '">' +
          (isOutRange ? '↑ fuera de rango' : colMax.toFixed(2)) +
        '</span>' +
      '</div>' : '') +
    '</div>' +
  '</div>';
}

// ── Límites (especificaciones) ──
function toggleLimitsMode() {
  saveLimitsFromInputs();
  var on = document.getElementById('limitsGlobalToggle').checked;
  trabajoLimitsMode = on ? 'global' : 'independent';
  renderLimitsPanel();
  _persistAllData();
  var bg = document.querySelector('.toggle-bg');
  var th = document.querySelector('.toggle-thumb');
  if (bg) bg.style.background = on ? 'var(--accent)' : '';
  if (th) { th.style.transform = on ? 'translateX(14px)' : ''; th.style.background = on ? '#fff' : ''; }
}

function renderLimitsPanel() {
  var body = document.getElementById('trabajoLimitsBody');
  if (!body) return;
  var sheet = getCurrentSheet();
  if (!sheet || !sheet.headers || sheet.headers.length === 0) {
    body.innerHTML = '<div style="padding:10px;font-size:10px;color:var(--text-faint);text-align:center">Carga datos para definir límites</div>';
    return;
  }
  if (!trabajoLimits) {
    trabajoLimits = { global: { ls: '', li: '', lc: '' }, cols: {} };
    sheet.headers.forEach(function(h){ trabajoLimits.cols[h] = { ls: '', li: '', lc: '' }; });
  }
  sheet.headers.forEach(function(h){ if (!trabajoLimits.cols[h]) trabajoLimits.cols[h] = { ls: '', li: '', lc: '' }; });
  var html = '';
  var ld = null;
  if (typeof EstadisticaDescriptiva !== 'undefined') {
    var allNum = [];
    sheet.headers.forEach(function(h, i){
      var vals = sheet.rows.map(function(r){ return parseFloat(r[i]); }).filter(function(v){ return !isNaN(v) && isFinite(v); });
      allNum = allNum.concat(vals);
    });
    if (allNum.length >= 3) ld = EstadisticaDescriptiva.calcularLimitesCuantificacion(allNum);
  }
  // ── LOD / MDL / LOQ cards + validation (if computed) ──
  if (ld) {
    var isSeqValid = ld.LOD < ld.MDL && ld.MDL < ld.LOQ;
    html += '<div style="padding:6px 10px 4px;font-size:10px;color:var(--text-faint);display:flex;align-items:center;gap:4px">📐 Calculados por el método</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;padding:0 10px 6px">' +
        '<div style="padding:.45rem .5rem;background:var(--bg-primary);border:.5px solid var(--accent-error);border-radius:6px">' +
          '<div style="font-size:10px;color:var(--accent-error)">LOD</div>' +
          '<div style="font-size:13px;font-weight:500;color:var(--text-primary);font-variant-numeric:tabular-nums">' + ld.LOD.toFixed(4) + '</div>' +
          '<div style="font-size:9px;color:var(--text-muted)">detección</div></div>' +
        '<div style="padding:.45rem .5rem;background:var(--bg-primary);border:.5px solid var(--accent-warn);border-radius:6px">' +
          '<div style="font-size:10px;color:var(--accent-warn)">MDL</div>' +
          '<div style="font-size:13px;font-weight:500;color:var(--text-primary);font-variant-numeric:tabular-nums">' + ld.MDL.toFixed(4) + '</div>' +
          '<div style="font-size:9px;color:var(--text-muted)">método</div></div>' +
        '<div style="padding:.45rem .5rem;background:var(--bg-primary);border:.5px solid var(--accent);border-radius:6px">' +
          '<div style="font-size:10px;color:var(--accent)">LOQ</div>' +
          '<div style="font-size:13px;font-weight:500;color:var(--text-primary);font-variant-numeric:tabular-nums">' + ld.LOQ.toFixed(4) + '</div>' +
          '<div style="font-size:9px;color:var(--text-muted)">cuantif.</div></div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:6px;margin:0 10px 8px;padding:.35rem .625rem;background:' + (isSeqValid ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)') + ';border:.5px solid ' + (isSeqValid ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)') + ';border-radius:6px">' +
      '<span style="font-size:11px;color:' + (isSeqValid ? '#4ade80' : '#f87171') + '">' + (isSeqValid ? '✓' : '✗') + '</span>' +
      '<span style="font-size:11px;color:' + (isSeqValid ? '#4ade80' : '#f87171') + '">LOD ' + (isSeqValid ? '<' : '≥') + ' MDL ' + (isSeqValid ? '<' : '≥') + ' LOQ</span>' +
      '<span style="font-size:10px;color:var(--text-muted)">· ' + (isSeqValid ? 'secuencia válida' : 'secuencia inválida') + '</span></div>';
  }
  // ── Manual inputs ──
  html += '<div style="padding:2px 10px 6px;font-size:10px;color:var(--text-faint);display:flex;align-items:center;gap:4px">✏️ Sobrescribir manualmente</div>';
  if (trabajoLimitsMode === 'global') {
    var g = trabajoLimits.global || { ls: '', li: '', lc: '' };
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 10px">' +
      '<div style="display:flex;flex-direction:column;gap:2px">' +
        '<label style="font-size:11px;color:var(--text-muted)">Límite Superior</label>' +
        '<input type="number" step="any" id="limitGlobalLS" value="' + escapeHtml(g.ls) + '" placeholder="—" style="height:30px;padding:0 8px;border:.5px solid var(--border);border-radius:6px;background:var(--bg-primary);font-size:12px;color:var(--text-primary);width:100%;box-sizing:border-box">' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:2px">' +
        '<label style="font-size:11px;color:var(--text-muted)">Límite Inferior</label>' +
        '<input type="number" step="any" id="limitGlobalLI" value="' + escapeHtml(g.li) + '" placeholder="—" style="height:30px;padding:0 8px;border:.5px solid var(--border);border-radius:6px;background:var(--bg-primary);font-size:12px;color:var(--text-primary);width:100%;box-sizing:border-box">' +
      '</div>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;gap:2px;padding:6px 10px 8px">' +
      '<label style="font-size:11px;color:var(--text-muted)">Límite Central</label>' +
      '<input type="number" step="any" id="limitGlobalLC" value="' + escapeHtml(g.lc) + '" placeholder="—" style="height:30px;padding:0 8px;border:.5px solid var(--border);border-radius:6px;background:var(--bg-primary);font-size:12px;color:var(--text-primary);width:100%;box-sizing:border-box">' +
    '</div>';
  } else {
    sheet.headers.forEach(function(h, i){
      var col = trabajoLimits.cols[h] || { ls: '', li: '', lc: '' };
      var cd = null;
      if (typeof EstadisticaDescriptiva !== 'undefined') {
        var vals = sheet.rows.map(function(r){ return parseFloat(r[i]); }).filter(function(v){ return !isNaN(v) && isFinite(v); });
        if (vals.length >= 3) cd = EstadisticaDescriptiva.calcularLimitesCuantificacion(vals);
      }
      html += '<div style="padding:6px 10px;border-bottom:.5px solid var(--border)">' +
        '<div style="font-size:11px;font-weight:500;color:var(--text-primary);margin-bottom:4px">' + escapeHtml(h) + '</div>' +
        '<div style="display:flex;gap:4px">' +
          '<input type="number" step="any" placeholder="LS" id="limitLS_' + i + '" value="' + escapeHtml(col.ls) + '" style="flex:1;min-width:0;height:28px;padding:0 6px;border:.5px solid var(--border);border-radius:4px;background:var(--bg-primary);font-size:12px;color:var(--text-primary)">' +
          '<input type="number" step="any" placeholder="LI" id="limitLI_' + i + '" value="' + escapeHtml(col.li) + '" style="flex:1;min-width:0;height:28px;padding:0 6px;border:.5px solid var(--border);border-radius:4px;background:var(--bg-primary);font-size:12px;color:var(--text-primary)">' +
          '<input type="number" step="any" placeholder="LC" id="limitLC_' + i + '" value="' + escapeHtml(col.lc) + '" style="flex:1;min-width:0;height:28px;padding:0 6px;border:.5px solid var(--border);border-radius:4px;background:var(--bg-primary);font-size:12px;color:var(--text-primary)">' +
        '</div>' +
        (cd ? '<div style="display:flex;gap:8px;font-size:10px;color:var(--text-faint);padding:3px 2px 0"><span>LOD: <b style="color:var(--accent-error)">' + cd.LOD.toFixed(4) + '</b></span><span>MDL: <b style="color:var(--accent-warn)">' + cd.MDL.toFixed(4) + '</b></span><span>LOQ: <b style="color:var(--accent)">' + cd.LOQ.toFixed(4) + '</b></span></div>' : '') +
      '</div>';
    });
  }
  html += '<div style="padding:8px 10px 6px"><button class="btn btn-secondary" style="width:100%;height:34px;font-size:13px;font-weight:500;justify-content:center;gap:6px" onclick="saveLimitsFromInputs();showToast(\'✅ Límites guardados\')">💾 Guardar límites</button></div>';
  body.innerHTML = html;
}

function saveLimitsFromInputs() {
  if (!trabajoLimits) return;
  if (trabajoLimitsMode === 'global') {
    var lsEl = document.getElementById('limitGlobalLS');
    var liEl = document.getElementById('limitGlobalLI');
    var lcEl = document.getElementById('limitGlobalLC');
    if (lsEl) trabajoLimits.global.ls = lsEl.value;
    if (liEl) trabajoLimits.global.li = liEl.value;
    if (lcEl) trabajoLimits.global.lc = lcEl.value;
  } else {
    var sheet = getCurrentSheet();
    if (!sheet) return;
    sheet.headers.forEach(function(h, i){
      var lsEl = document.getElementById('limitLS_' + i);
      var liEl = document.getElementById('limitLI_' + i);
      var lcEl = document.getElementById('limitLC_' + i);
      if (!trabajoLimits.cols[h]) trabajoLimits.cols[h] = { ls: '', li: '', lc: '' };
      if (lsEl) trabajoLimits.cols[h].ls = lsEl.value;
      if (liEl) trabajoLimits.cols[h].li = liEl.value;
      if (lcEl) trabajoLimits.cols[h].lc = lcEl.value;
    });
  }
  _persistAllData();
}

function getLimits(colName) {
  if (!trabajoLimits) return null;
  if (trabajoLimitsMode === 'global') {
    var g = trabajoLimits.global;
    if (g.ls === '' && g.li === '' && g.lc === '') return null;
    return { ls: g.ls === '' ? null : parseFloat(g.ls), li: g.li === '' ? null : parseFloat(g.li), lc: g.lc === '' ? null : parseFloat(g.lc) };
  }
  var col = trabajoLimits.cols[colName];
  if (!col || (col.ls === '' && col.li === '' && col.lc === '')) return null;
  return { ls: col.ls === '' ? null : parseFloat(col.ls), li: col.li === '' ? null : parseFloat(col.li), lc: col.lc === '' ? null : parseFloat(col.lc) };
}

// ════════════════════════════════════════════════════════════════
// TRABAJO — CELL INTERACTION
// ════════════════════════════════════════════════════════════════
function isInRange(ri, ci) {
  if (!trabajoSelectionRange) return false;
  var r = trabajoSelectionRange;
  var r1 = Math.min(r.r1,r.r2), r2 = Math.max(r.r1,r.r2);
  var c1 = Math.min(r.c1,r.c2), c2 = Math.max(r.c1,r.c2);
  return ri >= r1 && ri <= r2 && ci >= c1 && ci <= c2;
}

function cellClick(event, ri, ci) {
  if (event.shiftKey && trabajoActiveCell) {
    trabajoSelectionRange = { r1: trabajoActiveCell.row, c1: trabajoActiveCell.col, r2: ri, c2: ci };
    loadPage('trabajo');
  } else {
    trabajoSelectionRange = null;
    setActiveCell(ri, ci);
  }
}

function setActiveCell(rowIdx, colIdx) {
  trabajoActiveCell = { row: rowIdx, col: colIdx };
  var colLetter = String.fromCharCode(65 + colIdx);
  var ref = colLetter + (rowIdx + 1);
  var sheet = getCurrentSheet();
  var val = (sheet && sheet.rows[rowIdx]) ? (sheet.rows[rowIdx][colIdx] || '') : '';
  var refEl = document.getElementById('trabajoCellRef');
  var valEl = document.getElementById('trabajoCellVal');
  if (refEl) refEl.textContent = ref;
  if (valEl) valEl.textContent = String(val);
  var celdaEl = document.getElementById('trabajoCeldaActiva');
  if (celdaEl) celdaEl.innerHTML = getTrabajoCeldaActivaHTML();
  document.querySelectorAll('.cell-selected').forEach(function(c){ c.classList.remove('cell-selected'); });
  document.querySelectorAll('.excel-row-num.row-active').forEach(function(c){ c.classList.remove('row-active'); });
  var cellInner = document.querySelector('[data-row="' + rowIdx + '"][data-col="' + colIdx + '"]');
  if (cellInner && cellInner.parentElement) {
    cellInner.parentElement.classList.add('cell-selected');
    var rowNumEl = cellInner.parentElement.parentElement.querySelector('.excel-row-num');
    if (rowNumEl) rowNumEl.classList.add('row-active');
  }
}

function onCellFocus(ri, ci) {
  acCurrentCell = {ri:ri, ci:ci};
}

function onCellInput(event, ri, ci, value) {
  var sheet = getCurrentSheet();
  if (sheet && sheet.rows[ri] !== undefined) sheet.rows[ri][ci] = value;
  if (trabajoActiveCell.row === ri && trabajoActiveCell.col === ci) {
    var valEl = document.getElementById('trabajoCellVal');
    if (valEl) valEl.textContent = value;
  }
  showAutocomplete(ri, ci, value);
}

function saveCellData(rowIdx, colIdx, value) {
  var sheet = getCurrentSheet();
  if (sheet && sheet.rows[rowIdx] !== undefined) {
    sheet.rows[rowIdx][colIdx] = value;
    if (trabajoActiveCell.row === rowIdx && trabajoActiveCell.col === colIdx) {
      var valEl = document.getElementById('trabajoCellVal');
      if (valEl) valEl.textContent = value;
      var celdaEl = document.getElementById('trabajoCeldaActiva');
      if (celdaEl) celdaEl.innerHTML = getTrabajoCeldaActivaHTML();
    }
    var resumenEl = document.getElementById('trabajoResumen');
    if (resumenEl) resumenEl.innerHTML = getTrabajoResumenHTML();
    _persistAllData();
  }
  hideAutocomplete();
}

// ── Autocomplete ──
function showAutocomplete(ri, ci, typed) {
  var sheet = getCurrentSheet();
  if (!sheet || !typed || typed.trim().length < 1) { hideAutocomplete(); return; }
  var colVals = [];
  sheet.rows.forEach(function(r, ridx) {
    var v = String(r[ci] || '').trim();
    if (ridx !== ri && v && v.toLowerCase().startsWith(typed.toLowerCase()) && v !== typed) {
      if (!colVals.includes(v)) colVals.push(v);
    }
  });
  if (!colVals.length) { hideAutocomplete(); return; }
  acItems = colVals.slice(0, 8); acIndex = -1;
  var al = document.getElementById('autocompleteList');
  al.innerHTML = acItems.map(function(v, i){ return '<div class="autocomplete-item" data-i="' + i + '" onmousedown="applyAutocomplete(event,' + ri + ',' + ci + ',' + i + ')">' + escapeHtml(v) + '</div>'; }).join('');
  var cellEl = document.querySelector('[data-row="' + ri + '"][data-col="' + ci + '"]');
  if (!cellEl) { hideAutocomplete(); return; }
  var rect = cellEl.getBoundingClientRect();
  al.style.left = rect.left + 'px';
  al.style.top = (rect.bottom + 2) + 'px';
  al.style.minWidth = rect.width + 'px';
  al.style.display = 'block';
}
function hideAutocomplete() {
  document.getElementById('autocompleteList').style.display = 'none';
  acItems = []; acIndex = -1;
}
function applyAutocomplete(event, ri, ci, idx) {
  event.preventDefault();
  var val = acItems[idx];
  if (!val) return;
  var sheet = getCurrentSheet();
  if (sheet && sheet.rows[ri]) sheet.rows[ri][ci] = val;
  var cellInner = document.querySelector('[data-row="' + ri + '"][data-col="' + ci + '"]');
  if (cellInner) cellInner.textContent = val;
  saveCellData(ri, ci, val);
  hideAutocomplete();
}

function renameColumn(colIdx, newName) {
  var sheet = getCurrentSheet();
  if (!sheet) return;
  newName = (newName || '').trim();
  if (!newName) { loadPage('trabajo'); return; }
  if (newName !== sheet.headers[colIdx]) {
    pushUndo();
    sheet.headers[colIdx] = newName;
  }
  _persistAllData();
}

function handleCellPaste(event, rowIdx, colIdx) {
  event.preventDefault();
  event.stopPropagation();
  pushUndo();
  var clipData = event.clipboardData || window.clipboardData;
  var text = clipData.getData('text');
  var sheet = getCurrentSheet();
  if (!sheet || !text.trim()) return;
  var lines = text.trim().split('\n');
  var parsedData = lines.map(function(line) {
    return line.split(/\t|,/).map(function(cell) {
      return cell.trim().replace(/^"|"$/g, '');
    });
  });
  if (parsedData.length === 0) return;
  var firstRow = parsedData[0];
  var hasTextHeaders = false;
  for (var i = 0; i < firstRow.length; i++) {
    var val = firstRow[i];
    if (val !== '' && isNaN(parseFloat(val))) {
      hasTextHeaders = true;
      break;
    }
  }
  var dataToInsert = parsedData;
  if (hasTextHeaders && rowIdx === 0) {
    var numCols = firstRow.length;
    while (sheet.headers.length < numCols) sheet.headers.push('Col' + (sheet.headers.length + 1));
    while (sheet.headers.length > numCols) sheet.headers.pop();
    for (var k = 0; k < numCols; k++) {
      sheet.headers[k] = firstRow[k];
    }
    dataToInsert = parsedData.slice(1);
  }
  var startRow = rowIdx;
  dataToInsert.forEach(function(cells, ri) {
    var targetRow = startRow + ri;
    while (sheet.rows.length <= targetRow) sheet.rows.push(Array(sheet.headers.length).fill(''));
    cells.forEach(function(cell, ci) {
      var targetCol = colIdx + ci;
      if (targetCol < sheet.headers.length) {
        sheet.rows[targetRow][targetCol] = cell;
      }
    });
  });
  var displayRows = Math.max(sheet.rows.length, 30);
  while (sheet.rows.length < displayRows) sheet.rows.push(Array(sheet.headers.length).fill(''));
  trabajoActiveCell = {row: startRow, col: colIdx};
  _persistAllData();
  loadPage('trabajo');
}

// ── Add/Delete rows & columns ──
function addRow() {
  var sheet = getCurrentSheet(); if (!sheet) return;
  if (datosSourceType === 'none') datosSourceType = 'manual';
  pushUndo();
  sheet.rows.push(Array.from({length: sheet.headers.length}, function(){ return ''; }));
  _persistAllData();
  loadPage('trabajo');
}
function deleteActiveRow() {
  var sheet = getCurrentSheet(); if (!sheet || sheet.rows.length === 0) return;
  if (!confirm('¿Eliminar la fila ' + (trabajoActiveCell.row + 1) + '?')) return;
  pushUndo();
  sheet.rows.splice(trabajoActiveCell.row, 1);
  if (trabajoActiveCell.row >= sheet.rows.length) trabajoActiveCell.row = Math.max(0, sheet.rows.length - 1);
  _persistAllData();
  loadPage('trabajo');
}
function addColumn() {
  var sheet = getCurrentSheet(); if (!sheet) return;
  if (datosSourceType === 'none') datosSourceType = 'manual';
  pushUndo();
  var newName = 'Col' + (sheet.headers.length + 1);
  sheet.headers.push(newName);
  sheet.rows.forEach(function(r){ r.push(''); });
  _persistAllData();
  loadPage('trabajo');
}
function deleteActiveColumn() {
  var sheet = getCurrentSheet(); if (!sheet || sheet.headers.length <= 1) return;
  if (!confirm('¿Eliminar la columna "' + sheet.headers[trabajoActiveCell.col] + '"?')) return;
  pushUndo();
  sheet.headers.splice(trabajoActiveCell.col, 1);
  sheet.rows.forEach(function(r){ r.splice(trabajoActiveCell.col, 1); });
  if (trabajoActiveCell.col >= sheet.headers.length) trabajoActiveCell.col = Math.max(0, sheet.headers.length - 1);
  _persistAllData();
  loadPage('trabajo');
}
function selectRow(rowIdx) { trabajoActiveCell.row = rowIdx; loadPage('trabajo'); }
function selectAll() {   trabajoActiveCell = {row:0,col:0};
  loadPage('trabajo');
  _persistAllData();
}

function sortColumn() {
  var sheet = getCurrentSheet(); if (!sheet) return;
  pushUndo();
  var col = trabajoActiveCell.col; var asc = true;
  sheet.rows.sort(function(a,b){ var va=a[col]||'',vb=b[col]||''; var na=parseFloat(va),nb=parseFloat(vb); if(!isNaN(na)&&!isNaN(nb)) return asc?na-nb:nb-na; return asc?String(va).localeCompare(String(vb)):String(vb).localeCompare(String(va)); });
  _persistAllData();
  loadPage('trabajo');
}

function createNewSheet() {
  var name = prompt('Nombre de la nueva hoja:', 'Hoja' + (trabajoSheets.length + 1));
  if (!name || !name.trim()) return;
  name = name.trim();
  if (trabajoSheets.find(function(s){ return s.name === name; })) { showToast('⚠️ Ya existe una hoja con ese nombre.'); return; }
  trabajoSheets.push({ name:name, headers:['Columna1','Columna2','Columna3','Columna4'], rows:Array.from({length:20}, function(){ return ['','','','']; }) });
  trabajoActiveSheetIndex = trabajoSheets.length - 1;
  trabajoActiveCell = {row:0,col:0};
  _persistAllData();
  loadPage('trabajo');
}
function switchToSheet(index) {
  if (index < 0 || index >= trabajoSheets.length) return;
  trabajoActiveSheetIndex = index; trabajoActiveCell = {row:0,col:0};
  _persistAllData();
  loadPage('trabajo');
}
function deleteSheet(index, evt) {
  evt && evt.stopPropagation();
  if (trabajoSheets.length <= 1) { showToast('⚠️ No se puede eliminar la única hoja.'); return; }
  if (!confirm('¿Eliminar la hoja "' + trabajoSheets[index].name + '"?')) return;
  trabajoSheets.splice(index, 1);
  if (trabajoActiveSheetIndex >= trabajoSheets.length) trabajoActiveSheetIndex = trabajoSheets.length - 1;
  _persistAllData();
  loadPage('trabajo');
}
function clearCurrentSheet() {
  var sheet = getCurrentSheet(); if (!sheet) return;
  if (!confirm('¿Limpiar todos los datos de "' + sheet.name + '"?')) return;
  pushUndo();
  sheet.rows = sheet.rows.map(function(){ return Array.from({length: sheet.headers.length}, function(){ return ''; }); });
  _persistAllData();
  loadPage('trabajo');
}
function generateSampleData() {
  var existing = document.getElementById('genDataModal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'genDataModal';
  modal.className = 'modal-overlay';
  modal.onclick = function(){ modal.remove(); };
  var html = '<div class="gen-mdl" onclick="event.stopPropagation()">' +
    '<div style="padding:1rem 1.25rem .5rem;display:flex;align-items:center;gap:8px;border-bottom:.5px solid var(--border)">' +
      '<i class="ti ti-table-options" style="font-size:18px;color:#7c3aed"></i>' +
      '<h2 style="font-size:15px;font-weight:500;margin:0;color:var(--text-primary)">Generar datos</h2>' +
    '</div>' +
    '<div style="padding:.875rem 1.25rem 0">' +
      '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;font-weight:500;color:var(--text-muted);margin-bottom:.5rem">Distribución</div>' +
      '<div class="gen-fld"><select id="gdDistType">' +
        '<option value="normal">Normal</option>' +
        '<option value="uniform">Uniforme</option>' +
        '<option value="lognormal">Log-normal</option>' +
        '<option value="exponential">Exponencial</option>' +
        '<option value="t">t-Student</option>' +
        '<option value="beta">Beta</option>' +
      '</select></div>' +
      '<p id="gdDistDesc" style="font-size:12px;color:var(--text-muted);margin:6px 0 0;font-style:italic;line-height:1.5"></p>' +
    '</div>' +
    '<div id="gdDistParams" style="padding:.75rem 1.25rem 0"></div>' +
    '<div style="padding:.75rem 1.25rem 0">' +
      '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;font-weight:500;color:var(--text-muted);margin-bottom:.5rem">Muestra</div>' +
      '<div class="gen-row">' +
        '<div class="gen-fld"><label>Observaciones (n)</label><input type="number" id="gdNVal" value="100" min="1" max="1000000"></div>' +
        '<div class="gen-fld"><label>Columnas</label><input type="number" id="gdColsVal" value="2" min="1" max="50"></div>' +
      '<div class="gen-fld"><label>Nombre base</label><input type="text" id="gdColPrefix" value="Col" style="width:100%;height:34px;padding:0 10px;border:.5px solid var(--border);border-radius:8px;background:var(--bg-secondary);font-size:13px;color:var(--text-primary);box-sizing:border-box"></div>' +
      '</div>' +
    '</div>' +
    '<div class="gen-preview-box">' +
      '<span class="gen-preview-label">Vista previa</span>' +
      '<svg id="gdCurveSvg" viewBox="0 0 280 42" preserveAspectRatio="none" class="gen-preview-svg"></svg>' +
    '</div>' +
    '<details id="gdAdvDet" style="border-top:.5px solid var(--border);margin-top:.875rem">' +
      '<summary style="padding:.65rem 1.25rem;font-size:12px;color:#7c3aed;cursor:pointer;list-style:none;display:flex;align-items:center;gap:5px;user-select:none">' +
        '<i class="ti ti-adjustments-horizontal" style="font-size:14px"></i>' +
        'Comportamiento avanzado' +
        '<i class="gen-chev ti ti-chevron-down" style="font-size:12px;margin-left:auto"></i>' +
      '</summary>' +
      '<div style="padding:0 1.25rem .875rem">' +
        '<div class="gen-adv-grid">' +
          '<div class="gen-adv-fld">' +
            '<label>Outliers</label>' +
            '<div class="gen-slrow"><input type="range" id="gdOutR" min="0" max="20" value="0" step="1"><span id="gdOutV">0%</span></div>' +
          '</div>' +
          '<div class="gen-adv-fld">' +
            '<label>Valores faltantes</label>' +
            '<div class="gen-slrow"><input type="range" id="gdMisR" min="0" max="30" value="0" step="1"><span id="gdMisV">0%</span></div>' +
          '</div>' +
          '<div class="gen-adv-fld">' +
            '<label>Correlación (entre cols)</label>' +
            '<div class="gen-slrow"><input type="range" id="gdCorR" min="-100" max="100" value="0" step="5"><span id="gdCorV">0.00</span></div>' +
          '</div>' +
          '<div class="gen-adv-fld">' +
            '<label>Precisión decimal</label>' +
            '<input type="number" id="gdDecV" value="2" min="0" max="8" class="gen-sm-inp">' +
          '</div>' +
          '<div style="grid-column:span 2;display:flex;align-items:center;gap:8px;margin-top:2px">' +
            '<label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px;cursor:pointer;white-space:nowrap">' +
              '<input type="checkbox" id="gdSeedCb"> Semilla fija (reproducible)' +
            '</label>' +
            '<input type="number" id="gdSeedV" value="42" disabled class="gen-sm-inp" style="opacity:.4;flex:1">' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</details>' +
    '<div class="gen-summary-box">' +
      'Generará ' +
      '<span id="gdSumN" class="gen-summary-accent">100</span> × ' +
      '<span id="gdSumC" class="gen-summary-accent">2</span> valores ' +
      '<span id="gdSumD" class="gen-summary-accent">normales</span> ' +
      'con <span id="gdSumP" class="gen-summary-accent">μ=50, σ=10</span>' +
      '<span id="gdSumE" class="gen-summary-extras"></span>' +
    '</div>' +
    '<div class="gen-footer">' +
      '<button class="btn btn-secondary" onclick="document.getElementById(\'genDataModal\').remove()">Cancelar</button>' +
      '<button class="btn btn-primary" id="gdGenBtn">Generar</button>' +
    '</div>' +
  '</div>';
  modal.innerHTML = html;
  document.body.appendChild(modal);

  var D = {
    normal: {
      desc:'Simétrica alrededor de la media. Ideal para datos con variación natural o errores de medición.',
      params:[{id:'mu',lbl:'Media (μ)',v:50,s:.1},{id:'sig',lbl:'Desviación (σ)',v:10,s:.1,mn:.001}],
      sf:function(p){return 'μ=' + p.mu + ', σ=' + p.sig;}, nm:'normales'
    },
    uniform: {
      desc:'Probabilidad constante en todo el rango. Sin valores más probables que otros.',
      params:[{id:'umin',lbl:'Mínimo',v:0},{id:'umax',lbl:'Máximo',v:100}],
      sf:function(p){return 'rango [' + p.umin + ', ' + p.umax + ']';}, nm:'uniformes'
    },
    lognormal: {
      desc:'Sesgada a la derecha. Solo valores positivos. Común en ingresos, tiempos de reacción.',
      params:[{id:'lmu',lbl:'Media log (μ)',v:0,s:.1},{id:'lsig',lbl:'Desv. log (σ)',v:1,s:.1,mn:.001}],
      sf:function(p){return 'μ_log=' + p.lmu + ', σ_log=' + p.lsig;}, nm:'log-normales'
    },
    exponential: {
      desc:'Decrece desde el origen. Modela tiempos de espera y fallos en equipos.',
      params:[{id:'lam',lbl:'Tasa (λ)',v:.1,s:.01,mn:.001}],
      sf:function(p){var lam=Math.max(.001,+p.lam||.1);return 'λ=' + lam.toFixed(3) + ', μ≈' + (1/lam).toFixed(1);}, nm:'exponenciales'
    },
    t: {
      desc:'Como la normal pero con colas más pesadas. Adecuada cuando n es pequeño.',
      params:[{id:'df',lbl:'Grados libertad (df)',v:10,s:1,mn:1},{id:'loc',lbl:'Localización',v:0}],
      sf:function(p){return 'df=' + p.df + ', loc=' + p.loc;}, nm:'t-Student'
    },
    beta: {
      desc:'Valores entre 0 y 1. Forma flexible según α y β. Útil para proporciones.',
      params:[{id:'al',lbl:'Forma α',v:2,s:.1,mn:.001},{id:'be',lbl:'Forma β',v:5,s:.1,mn:.001}],
      sf:function(p){return 'α=' + p.al + ', β=' + p.be;}, nm:'Beta'
    }
  };

  function getP() {
    var k = document.getElementById('gdDistType').value;
    var v = {};
    var arr = D[k].params;
    for (var i = 0; i < arr.length; i++) {
      var e = document.getElementById('gdP_' + arr[i].id);
      if (e) v[arr[i].id] = e.value;
    }
    return v;
  }

  function p2svg(pts,W,H) {
    if (pts.length < 2) return null;
    var ys = pts.map(function(p){ return p[1]; });
    var mn = Math.min.apply(null, ys);
    var mx = Math.max.apply(null, ys);
    var rng = mx - mn || 1;
    var sp = W / (pts.length - 1);
    var sc = (H - 8) / rng;
    var m = pts.map(function(p,i){ return [i * sp, (H - 4) - (p[1] - mn) * sc]; });
    var d = 'M' + m[0][0].toFixed(1) + ',' + m[0][1].toFixed(1);
    for (var i = 1; i < m.length; i++) {
      d += ' L' + m[i][0].toFixed(1) + ',' + m[i][1].toFixed(1);
    }
    return {d:d, m:m};
  }

  function buildCurve(k,pv,W,H) {
    var N = 64, pts = [], i, x;
    if (k === 'normal') {
      var mu = +pv.mu || 50;
      var sig = Math.max(.001, Math.abs(+pv.sig) || 10);
      for (i = 0; i <= N; i++) { x = mu - 4*sig + i/N * 8*sig; pts.push([x, Math.exp(-(x-mu)*(x-mu)/(2*sig*sig))]); }
    } else if (k === 'uniform') {
      pts.push([0,0],[.02,0],[.02,1],[.98,1],[.98,0],[1,0]);
    } else if (k === 'lognormal') {
      var lmu = +pv.lmu || 0;
      var lsig = Math.max(.001, Math.abs(+pv.lsig) || 1);
      for (i = 1; i <= N; i++) { x = i/N * 5; var lnx = Math.log(x); pts.push([x, Math.exp(-(lnx-lmu)*(lnx-lmu)/(2*lsig*lsig))/(x*lsig)]); }
    } else if (k === 'exponential') {
      var lam = Math.max(.001, Math.abs(+pv.lam) || .1);
      for (i = 0; i <= N; i++) { x = i/N * (6/lam); pts.push([x, lam * Math.exp(-lam * x)]); }
    } else if (k === 't') {
      var df = Math.max(1, +pv.df || 10);
      for (i = 0; i <= N; i++) { x = i/N * 8 - 4; pts.push([x, Math.pow(1 + x*x/df, -(df+1)/2)]); }
    } else {
      var a = Math.max(.01, +pv.al || 2);
      var b = Math.max(.01, +pv.be || 5);
      for (i = 1; i < N; i++) { x = i/N; pts.push([x, Math.pow(x, a-1) * Math.pow(1-x, b-1)]); }
    }
    return p2svg(pts, W, H);
  }

  function drawCurve() {
    var k = document.getElementById('gdDistType').value;
    var res = buildCurve(k, getP(), 280, 42);
    if (!res) return;
    var d = res.d, m = res.m;
    var area = d + ' L' + m[m.length-1][0].toFixed(1) + ',42 L' + m[0][0].toFixed(1) + ',42 Z';
    document.getElementById('gdCurveSvg').innerHTML =
      '<path d="' + area + '" fill="#7c3aed" opacity="0.1"/>' +
      '<path d="' + d + '" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function renderP(k) {
    var dist = D[k];
    var one = dist.params.length === 1;
    var con = document.getElementById('gdDistParams');
    var h = '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;font-weight:500;color:var(--text-muted);margin-bottom:.5rem">Parámetros</div>';
    h += '<div class="gen-row' + (one ? ' solo' : '') + '">';
    for (var i = 0; i < dist.params.length; i++) {
      var p = dist.params[i];
      h += '<div class="gen-fld"><label>' + p.lbl + '</label>' +
        '<input type="number" id="gdP_' + p.id + '" value="' + p.v + '" step="' + (p.s||1) + '"' +
        (p.mn !== undefined ? ' min="' + p.mn + '"' : '') + '></div>';
    }
    h += '</div>';
    con.innerHTML = h;
    var inputs = con.querySelectorAll('input');
    for (var j = 0; j < inputs.length; j++) {
      inputs[j].addEventListener('input', function(){ drawCurve(); updSummary(); });
    }
  }

  function updSummary() {
    var k = document.getElementById('gdDistType').value;
    var n = document.getElementById('gdNVal').value || 100;
    var c = parseInt(document.getElementById('gdColsVal').value) || 2;
    var p = getP();
    document.getElementById('gdSumN').textContent = parseInt(n).toLocaleString();
    document.getElementById('gdSumC').textContent = c;
    document.getElementById('gdSumD').textContent = D[k].nm;
    try { document.getElementById('gdSumP').textContent = D[k].sf(p); } catch(e) {}
    var o = +document.getElementById('gdOutR').value;
    var ms = +document.getElementById('gdMisR').value;
    var ex = [];
    if (o > 0) ex.push(o + '% outliers');
    if (ms > 0) ex.push(ms + '% faltantes');
    document.getElementById('gdSumE').textContent = ex.length ? ' · ' + ex.join(', ') : '';
  }

  var dt = document.getElementById('gdDistType');
  function onChange() {
    var k = dt.value;
    document.getElementById('gdDistDesc').textContent = D[k].desc;
    renderP(k); drawCurve(); updSummary();
  }
  dt.addEventListener('change', onChange);
  document.getElementById('gdNVal').addEventListener('input', updSummary);
  document.getElementById('gdColsVal').addEventListener('input', updSummary);
  document.getElementById('gdOutR').addEventListener('input', function(){
    document.getElementById('gdOutV').textContent = this.value + '%'; updSummary();
  });
  document.getElementById('gdMisR').addEventListener('input', function(){
    document.getElementById('gdMisV').textContent = this.value + '%'; updSummary();
  });
  document.getElementById('gdCorR').addEventListener('input', function(){
    document.getElementById('gdCorV').textContent = (this.value / 100).toFixed(2);
  });
  document.getElementById('gdSeedCb').addEventListener('change', function(){
    var s = document.getElementById('gdSeedV');
    s.disabled = !this.checked; s.style.opacity = this.checked ? '1' : '0.4';
  });
  var advDet = document.getElementById('gdAdvDet');
  if (advDet) {
    advDet.addEventListener('toggle', function(){
      var chev = document.getElementById('gdAdvChev');
      if (chev) chev.classList.toggle('open');
    });
  }

  document.getElementById('gdGenBtn').addEventListener('click', function(){
    var distKey = document.getElementById('gdDistType').value;
    var n = Math.min(1000000, Math.max(1, parseInt(document.getElementById('gdNVal').value) || 100));
    var k = Math.min(50, Math.max(1, parseInt(document.getElementById('gdColsVal').value) || 2));
    var dec = Math.min(8, Math.max(0, parseInt(document.getElementById('gdDecV').value) || 2));
    var outlierPct = +document.getElementById('gdOutR').value / 100;
    var missingPct = +document.getElementById('gdMisR').value / 100;
    var corr = +document.getElementById('gdCorR').value / 100;
    var useSeed = document.getElementById('gdSeedCb').checked;
    var seedVal = parseInt(document.getElementById('gdSeedV').value) || 42;
    var pv = getP();
    var dist = D[distKey];

    var _lcg = seedVal;
    function _rand() {
      if (useSeed) { _lcg = (_lcg * 1664525 + 1013904223) & 0x7FFFFFFF; return _lcg / 0x7FFFFFFF; }
      return Math.random();
    }

    function _normal(mu, sig, r) { var u1=r(),u2=r(); return mu + sig * Math.sqrt(-2*Math.log(u1||1e-10)) * Math.cos(2*Math.PI*u2); }
    function _uniform(a,b,r) { return a + r() * (b - a); }
    function _lognormal(mu,sig,r) { return Math.exp(_normal(mu,sig,r)); }
    function _exponential(lam,r) { return -Math.log(r()||1e-10) / lam; }
    function _chiSq(df,r) { var s=0; for(var i=0;i<df;i++){var u1=r(),u2=r();var z=Math.sqrt(-2*Math.log(u1||1e-10))*Math.cos(2*Math.PI*u2);s+=z*z;} return s; }
    function _tStudent(df,loc,r) { return loc + _normal(0,1,r) / Math.sqrt(_chiSq(Math.round(df),r)/df); }
    function _gamma(alpha,r) {
      if (alpha < 1) return _gamma(alpha+1,r) * Math.pow(r(),1/alpha);
      var d = alpha - 1/3, c = 1 / Math.sqrt(9*d);
      while (true) {
        var x, v;
        do { x = _normal(0,1,r); v = 1 + c*x; } while (v <= 0);
        v = v*v*v; var u = r();
        if (u < 1 - 0.0331*x*x*x*x) return d*v;
        if (Math.log(u) < 0.5*x*x + d*(1 - v + Math.log(v))) return d*v;
      }
    }
    function _beta(a,b,r) { var g1=_gamma(a,r),g2=_gamma(b,r); return g1/(g1+g2); }

    function _genVal(k,pv,r) {
      switch (k) {
        case 'normal': return _normal(+pv.mu||50, Math.max(.001,Math.abs(+pv.sig)||10), r);
        case 'uniform': return _uniform(+pv.umin||0, +pv.umax||100, r);
        case 'lognormal': return _lognormal(+pv.lmu||0, Math.max(.001,Math.abs(+pv.lsig)||1), r);
        case 'exponential': return _exponential(Math.max(.001,Math.abs(+pv.lam)||.1), r);
        case 't': return _tStudent(Math.max(1,+pv.df||10), +pv.loc||0, r);
        case 'beta': return _beta(Math.max(.01,+pv.al||2), Math.max(.01,+pv.be||5), r);
        default: return r();
      }
    }

    var cols = [];
    for (var c = 0; c < k; c++) {
      var col = [];
      for (var r = 0; r < n; r++) col.push(_genVal(distKey, pv, _rand));
      cols.push(col);
    }

    if (Math.abs(corr) > 0.001 && k > 1) {
      var sqrt1mr2 = Math.sqrt(Math.max(0, 1 - corr*corr));
      for (var c = 1; c < k; c++) {
        for (var r = 0; r < n; r++) {
          cols[c][r] = corr * (+cols[0][r]) + sqrt1mr2 * (+cols[c][r]);
        }
      }
    }

    var decFactor = Math.pow(10, dec);
    for (var c = 0; c < cols.length; c++) {
      var vals = cols[c];
      var mean = 0;
      for (var r = 0; r < n; r++) mean += +vals[r];
      mean /= n;
      var stdev = 0;
      for (var r = 0; r < n; r++) stdev += Math.pow(+vals[r] - mean, 2);
      stdev = Math.sqrt(stdev / n) || 1;
      for (var r = 0; r < n; r++) {
        var val = +vals[r];
        if (outlierPct > 0 && _rand() < outlierPct) {
          var sign = _rand() > 0.5 ? 1 : -1;
          val = mean + sign * (3 + _rand() * 2) * stdev;
        }
        if (missingPct > 0 && _rand() < missingPct) { vals[r] = ''; continue; }
        if (dec > 0) val = Math.round(val * decFactor) / decFactor;
        else val = Math.round(val);
        vals[r] = val;
      }
    }

    var headers = [];
    var prefix = document.getElementById('gdColPrefix').value.trim() || 'Col';
    for (var c = 0; c < k; c++) {
      headers.push(k > 1 ? prefix + ' (' + (c + 1) + ')' : prefix);
    }
    var rows = [];
    for (var r = 0; r < n; r++) {
      var row = [];
      for (var c = 0; c < k; c++) row.push(cols[c][r]);
      rows.push(row);
    }

    pushUndo();
    var prefix = distKey.charAt(0).toUpperCase() + distKey.slice(1, 10);
    trabajoSheets.push({ name: prefix + '_' + n + 'x' + k, headers: headers, rows: rows });
    trabajoActiveSheetIndex = trabajoSheets.length - 1;
    trabajoActiveCell = {row:0,col:0};
    _persistAllData();
    modal.remove();
    loadPage('trabajo');
    showToast('✅ Datos ' + D[distKey].nm + ' generados: ' + n + ' filas × ' + k + ' columnas');
  });

  onChange();
}

// ── Ampliar datos (data augmentation con ruido) ──
function ampliarDatos() {
  var sheet = getCurrentSheet();
  if (!sheet || !sheet.rows || sheet.rows.length < 5) {
    showToast('⚠️ Carga o genera datos primero (mín. 5 filas)');
    return;
  }
  var existing = document.getElementById('ampliarModal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'ampliarModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  modal.onclick = function(){ modal.remove(); };
  modal.innerHTML = '<div style="background:var(--bg-panel);border-radius:14px;padding:24px;max-width:380px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.5);color:var(--text-primary)" onclick="event.stopPropagation()">' +
    '<h2 style="margin:0 0 16px;font-size:1.1rem">📈 Ampliar datos</h2>' +
    '<p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:12px">Genera nuevas filas añadiendo ruido aleatorio a los datos existentes.</p>' +
    '<div style="margin-bottom:12px;font-size:0.82rem">Filas actuales: <strong>' + sheet.rows.length + '</strong></div>' +
    '<label style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:6px">Factor de ampliación</label>' +
    '<select id="ampliarFactor" style="width:100%;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem">' +
    '<option value="2">2x (' + (sheet.rows.length * 2) + ' filas)</option>' +
    '<option value="3">3x (' + (sheet.rows.length * 3) + ' filas)</option>' +
    '<option value="5">5x (' + (sheet.rows.length * 5) + ' filas)</option>' +
    '<option value="10">10x (' + (sheet.rows.length * 10) + ' filas)</option>' +
    '</select>' +
    '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end">' +
    '<button class="btn btn-secondary" onclick="this.closest(\'#ampliarModal\').remove()">Cancelar</button>' +
    '<button class="btn btn-primary" id="ampliarBtn">Ampliar</button></div></div>';
  document.body.appendChild(modal);
  document.getElementById('ampliarBtn').addEventListener('click', function() {
    var factor = parseInt(document.getElementById('ampliarFactor').value) || 2;
    var origRows = sheet.rows;
    var headers = sheet.headers;
    var n = origRows.length;
    // Determine which columns are numeric
    var isNum = headers.map(function(_, j) {
      var nums = 0;
      for (var r = 0; r < Math.min(n, 20); r++) {
        if (!isNaN(parseFloat(origRows[r][j])) && isFinite(origRows[r][j])) nums++;
      }
      return nums > 10;
    });
    // Compute range for each numeric column to scale noise
    var ranges = headers.map(function(_, j) {
      if (!isNum[j]) return 0;
      var vals = [];
      for (var r = 0; r < n; r++) { var v = parseFloat(origRows[r][j]); if (!isNaN(v)) vals.push(v); }
      if (vals.length < 2) return 1;
      var max = Math.max.apply(null, vals);
      var min = Math.min.apply(null, vals);
      return (max - min) || 1;
    });
    pushUndo();
    var newRows = [];
    for (var f = 0; f < factor - 1; f++) {
      for (var r = 0; r < n; r++) {
        var row = origRows[r].slice();
        for (var c = 0; c < headers.length; c++) {
          if (isNum[c]) {
            var noise = (Math.random() - 0.5) * 0.04 * ranges[c];
            var val = parseFloat(row[c]);
            if (!isNaN(val)) row[c] = (val + noise).toFixed(2);
          }
        }
        newRows.push(row);
      }
    }
    sheet.rows = origRows.concat(newRows);
    _persistAllData();
    modal.remove();
    loadPage('trabajo');
    showToast('✅ Datos ampliados: ' + n + ' → ' + sheet.rows.length + ' filas');
  });
}

// ── Limpiar dataset ──
function limpiarDataset() {
  if (!datosCurrentData && (!trabajoSheets || trabajoSheets.length === 0 || !trabajoSheets[0].rows.some(function(r){ return r.some(function(c){ return c && c.toString().trim(); }); }))) {
    showToast('⚠️ No hay datos cargados para limpiar');
    return;
  }
  if (!confirm('¿Limpiar el dataset actual? Se perderán los datos en la hoja de trabajo.')) return;
  datosCurrentData = null;
  trabajoSheets = [{ name:'Hoja1', headers:['Columna1','Columna2','Columna3','Columna4'], rows:Array.from({length:20}, function(){ return ['','','','']; }) }];
  trabajoActiveSheetIndex = 0;
  trabajoActiveCell = {row:0,col:0};
  datosFilters = [];
  trabajoLimits = null;
  datosSourceType = 'none';
  trabajoLimitsMode = 'global';
  updateDatosUI();
  _persistAllData();
  loadPage('trabajo');
  showToast('🧹 Dataset limpiado');
}

function exportTrabajo() {
  var sheet = getCurrentSheet(); if (!sheet) { showToast('⚠️ No hay datos.'); return; }
  var csv = sheet.headers.join(',') + '\n';
  sheet.rows.forEach(function(r){ csv += r.map(function(c){ var s=String(c||''); return (s.includes(',')||s.includes('"')||s.includes('\n'))?'"'+s.replace(/"/g,'""')+'"':s; }).join(',') + '\n'; });
  var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  var link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = sheet.name + '.csv'; link.click(); URL.revokeObjectURL(link.href);
}

// ── Keyboard navigation ──
function initTrabajoKeyboard() {
  if (trabajoKeydownHandler) document.removeEventListener('keydown', trabajoKeydownHandler);
  trabajoKeydownHandler = function(e) {
    // Global undo/redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undoAction(); return; }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redoAction(); return; }
    var inner = document.activeElement;
    if (!inner || !inner.classList.contains('excel-cell-inner')) return;
    var sheet = getCurrentSheet(); if (!sheet) return;
    var maxRow = sheet.rows.length - 1, maxCol = sheet.headers.length - 1;
    var r = trabajoActiveCell.row, c = trabajoActiveCell.col;
    if (e.key === 'Tab') {
      e.preventDefault();
      if (document.getElementById('autocompleteList').style.display !== 'none') { hideAutocomplete(); return; }
      if (e.shiftKey) {
        focusCell(r, Math.max(0, c-1));
      } else {
        if (c < maxCol) {
          focusCell(r, c+1);
        } else if (r < maxRow) {
          focusCell(r+1, 0);
        } else {
          focusCellOrAddRow(r+1, 0);
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (document.getElementById('autocompleteList').style.display !== 'none') { hideAutocomplete(); }
      if (e.shiftKey) focusCell(Math.max(0,r-1), c);
      else focusCellOrAddRow(r+1, c);
    } else if (e.key === 'Escape') { inner.blur(); hideAutocomplete(); }
    else if (e.key === 'ArrowDown' && !e.shiftKey) { e.preventDefault(); focusCellOrAddRow(r+1, c); }
    else if (e.key === 'ArrowUp' && !e.shiftKey) { e.preventDefault(); focusCell(Math.max(0,r-1), c); }
    else if (e.key === 'ArrowRight' && inner.textContent.length === 0) { e.preventDefault(); focusCell(r, Math.min(maxCol,c+1)); }
    else if (e.key === 'ArrowLeft' && inner.textContent.length === 0) { e.preventDefault(); focusCell(r, Math.max(0,c-1)); }
    else if (e.key === 'ArrowDown' && document.getElementById('autocompleteList').style.display !== 'none') {
      e.preventDefault(); acIndex = Math.min(acIndex+1, acItems.length-1); updateACHighlight();
    } else if (e.key === 'ArrowUp' && document.getElementById('autocompleteList').style.display !== 'none') {
      e.preventDefault(); acIndex = Math.max(acIndex-1, 0); updateACHighlight();
    }
  };
  document.addEventListener('keydown', trabajoKeydownHandler);
}
function updateACHighlight() {
  document.querySelectorAll('.autocomplete-item').forEach(function(el, i){ el.classList.toggle('ac-active', i === acIndex); });
}
function focusCell(rowIdx, colIdx) {
  setActiveCell(rowIdx, colIdx);
  var inner = document.querySelector('[data-row="' + rowIdx + '"][data-col="' + colIdx + '"]');
  if (inner) { inner.focus(); try { var range = document.createRange(); var sel = window.getSelection(); range.selectNodeContents(inner); range.collapse(false); sel.removeAllRanges(); sel.addRange(range); } catch(e){} }
}
function focusCellOrAddRow(targetRow, colIdx) {
  var sheet = getCurrentSheet();
  if (sheet && targetRow >= sheet.rows.length) {
    addRow();
    sheet = getCurrentSheet();
    if (!sheet) return;
  }
  focusCell(Math.min(targetRow, (sheet ? sheet.rows.length - 1 : targetRow)), colIdx);
}

// ── Paginación ──
function trabajoGoPage(page) {
  var sheet = getCurrentSheet();
  if (!sheet) return;
  trabajoPage = Math.max(0, Math.min(page, Math.ceil(sheet.rows.length / trabajoPageSize) - 1));
  loadPage('trabajo');
}

function trabajoChangePageSize(size) {
  trabajoPageSize = size;
  trabajoPage = 0;
  loadPage('trabajo');
}

document.addEventListener('click', function(e) { if (!e.target.closest('#autocompleteList') && !e.target.classList.contains('excel-cell-inner')) hideAutocomplete(); });
