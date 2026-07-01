// ════════════════════════════════════════════════════════════════
// indexx-palette.js — Command palette (sidebar + modal) + column
//                     analysis modal
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// COMMAND PALETTE — sidebar search
// ════════════════════════════════════════════════════════════════
var COMMANDS = [
  // Pages
  { id:'page-datos',       label:'Abrir Datos',       icon:'📊', cat:'Páginas',     action:function(){ loadPage('datos'); } },
  { id:'page-trabajo',     label:'Abrir Trabajo',     icon:'📋', cat:'Páginas',     action:function(){ loadPage('trabajo'); } },
  { id:'page-analisis',    label:'Abrir Análisis',    icon:'🔬', cat:'Páginas',     action:function(){ loadPage('analisis'); } },
  { id:'page-visualizacion',label:'Abrir Visualización',icon:'📈', cat:'Páginas',   action:function(){ loadPage('visualizacion'); } },
  { id:'page-reportes',    label:'Abrir Reportes',    icon:'📄', cat:'Páginas',     action:function(){ loadPage('reportes'); } },
  { id:'page-firmar',      label:'Firmar Reporte',    icon:'✍️', cat:'Páginas',     action:function(){ loadPage('firmarReporte'); } },
  { id:'page-ml',          label:'ML Analysis',       icon:'🧠', cat:'Páginas',     action:function(){ loadPage('ml'); } },
  { id:'page-auditoria',   label:'Auditoría',         icon:'📋', cat:'Páginas',     action:function(){ loadPage('auditoria'); } },
  { id:'page-usuarios',    label:'Usuarios',          icon:'👥', cat:'Páginas',     action:function(){ loadPage('usuarios'); } },
  { id:'toggle-sidebar',   label:'Toggle Sidebar',    icon:'📌', cat:'Páginas',     action:function(){ toggleSidebar(); } },
  // Data
  { id:'import-csv',       label:'Cargar dataset',    icon:'📁', cat:'Datos',       action:function(){ document.getElementById('fileInput').click(); } },
  { id:'paste-data',       label:'Pegar datos',       icon:'📋', cat:'Datos',       action:function(){ showPasteModal(); } },
  { id:'new-project',      label:'Nuevo proyecto',    icon:'🆕', cat:'Datos',       action:function(){ nuevoProyecto(); } },
  { id:'export-csv',       label:'Exportar CSV',      icon:'⬇',  cat:'Datos',       action:function(){ handleToolsAction('export-csv'); } },
  { id:'sample-data',      label:'Configurar datos',  icon:'⚙️', cat:'Datos',       action:function(){ generateSampleData(); } },
  // Edit
  { id:'undo',             label:'Deshacer',          icon:'↩️', cat:'Editar',      action:function(){ undoAction(); } },
  { id:'redo',             label:'Rehacer',           icon:'↪️', cat:'Editar',      action:function(){ redoAction(); } },
  // Tools
  { id:'remove-dups',      label:'Eliminar duplicados',icon:'🔍',cat:'Herramientas',action:function(){ handleToolsAction('remove-duplicates'); } },
  { id:'filter-rows',      label:'Filtrar filas',     icon:'🔽', cat:'Herramientas',action:function(){ handleToolsAction('filter-rows'); } },
  { id:'impute-missing',   label:'Imputar valores faltantes',icon:'🔧',cat:'Herramientas',action:function(){ handleToolsAction('handle-missing'); } },
  { id:'outliers',         label:'Detectar outliers', icon:'📊', cat:'Herramientas',action:function(){ handleToolsAction('outlier-detection'); } },
  { id:'encode-cat',       label:'Codificar categóricas',icon:'🏷️',cat:'Herramientas',action:function(){ handleToolsAction('encode-categorical'); } },
  { id:'scale-norm',       label:'Escalar / Normalizar',icon:'📏',cat:'Herramientas',action:function(){ handleToolsAction('scale-normalize'); } },
  { id:'correlation',      label:'Matriz de correlación',icon:'🔗',cat:'Herramientas',action:function(){ handleToolsAction('correlation-matrix'); } },
  { id:'train-test',       label:'Particionar train/test',icon:'✂️',cat:'Herramientas',action:function(){ handleToolsAction('train-test-split'); } },
  { id:'feature-sel',      label:'Selección de variables',icon:'🎯',cat:'Herramientas',action:function(){ handleToolsAction('feature-selection'); } },
  // Visualization
  { id:'batch-graphs',     label:'Generar múltiples gráficos',icon:'📈',cat:'Visualización',action:function(){ showBatchGraphModal(); } },
  // System
  { id:'toggle-theme',     label:'Cambiar tema',      icon:'🌙', cat:'Sistema',     action:function(){ document.getElementById('themeToggle').click(); } },
  { id:'save-session',     label:'Guardar sesión',    icon:'💾', cat:'Sistema',     action:function(){ if(typeof StateManager!=='undefined'){StateManager.saveToLocalStorage();showToast('Sesión guardada ✓');} } },
  { id:'load-session',     label:'Cargar sesión',     icon:'📂', cat:'Sistema',     action:function(){ if(confirm('Restaurar última sesión?')){if(typeof StateManager!=='undefined')StateManager.loadFromLocalStorage();location.reload();} } },
  { id:'help',             label:'Ayuda / Atajos',    icon:'❓', cat:'Sistema',     action:function(){ showHelpModal(); } },
  { id:'about',            label:'Acerca de',         icon:'ℹ️', cat:'Sistema',     action:function(){ showAboutModal(); } },
  { id:'settings',         label:'Configuración',     icon:'⚙️', cat:'Sistema',     action:function(){ if(typeof showSettingsModal==='function')showSettingsModal(); } },
];

// ════════════════════════════════════════════════════════════════
// COLUMN ANALYSIS MODAL
// ════════════════════════════════════════════════════════════════

function showModalRaw(html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    while (temp.firstChild) {
        document.body.appendChild(temp.firstChild);
    }
}

function updateColumnAnalysisSummary() {
    var s = getCurrentSheet();
    if (!s) return;
    var analysis = window.StatsUtils ? StatsUtils.analyzeColumns({ headers: s.headers, data: s.rows }) : [];
    var numeric = analysis.filter(function(c) { return c.viable; }).length;
    var el = document.getElementById('analisisStatNumeric');
    if (el) el.textContent = numeric + '/' + analysis.length;
}

function showColumnAnalysisModal() {
    var s = getCurrentSheet();
    if (!s) { showToast('No hay dataset activo'); return; }
    var analysis = window.StatsUtils ? StatsUtils.analyzeColumns({ headers: s.headers, data: s.rows }) : [];
    if (!analysis || analysis.length === 0) { showToast('No se pudieron analizar columnas'); return; }
    var numeric = analysis.filter(function(c) { return c.viable; }).length;
    var rows = analysis.map(function(c) {
        var color = c.viable ? 'var(--accent)' : (c.numericRatio > 0 ? 'var(--warning,#e8a317)' : 'var(--text-faint)');
        var typeLabel = c.viable ? '✅ numérica' : (c.numericRatio > 0 ? '⚠️ mixta (' + Math.round(c.numericRatio*100) + '%)' : '❌ no numérica');
        return '<tr>' +
            '<td style="padding:4px 8px;font-size:11px;color:' + color + ';font-weight:' + (c.viable?'600':'400') + '">' + escapeHtml(c.header) + '</td>' +
            '<td style="padding:4px 8px;font-size:11px;text-align:center">' + c.total + '</td>' +
            '<td style="padding:4px 8px;font-size:11px;text-align:center">' + c.validos + '</td>' +
            '<td style="padding:4px 8px;font-size:11px;text-align:center">' + Math.round(c.density*100) + '%</td>' +
            '<td style="padding:4px 8px;font-size:11px;text-align:center">' + Math.round(c.numericRatio*100) + '%</td>' +
            '<td style="padding:4px 8px;font-size:11px;color:' + color + '">' + typeLabel + '</td>' +
        '</tr>';
    }).join('');

    var html = '<div class="modal-overlay" onclick="this.remove()">' +
        '<div class="modal-box" style="max-width:700px;width:90%;max-height:90vh;display:flex;flex-direction:column;padding:0" onclick="event.stopPropagation()">' +
            '<div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border)">' +
                '<div><strong style="font-size:14px">🔍 Análisis de Columnas</strong>' +
                '<span style="font-size:11px;color:var(--text-faint);margin-left:10px">' + numeric + ' numéricas de ' + analysis.length + '</span></div>' +
                '<button class="modal-close" onclick="this.closest(\'.modal-overlay\').remove()" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--text-faint)">✕</button>' +
            '</div>' +
            '<div class="modal-body" style="flex:1;overflow-y:auto;padding:12px 16px">' +
                '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap">' +
                    '<div style="display:flex;align-items:center;gap:4px;font-size:11px">' +
                        '<span>Umbral:</span>' +
                        '<input type="range" min="0" max="100" value="' + Math.round(columnAnalysisConfig.threshold*100) + '" style="width:100px;height:4px" oninput="columnAnalysisConfig.threshold=this.value/100;if(window.StatsUtils){var s=getCurrentSheet();if(s){var a=StatsUtils.analyzeColumns({headers:s.headers,data:s.rows});var n=a.filter(function(c){return c.viable;}).length;document.getElementById(\'colModalNumeric\').textContent=n+\'/\'+a.length}}" id="colModalThreshold">' +
                        '<span id="colModalThresholdVal" style="min-width:28px;text-align:right">' + Math.round(columnAnalysisConfig.threshold*100) + '%</span>' +
                    '</div>' +
                    '<label style="display:flex;align-items:center;gap:3px;font-size:11px;color:var(--text-faint);cursor:pointer"><input type="checkbox" ' + (columnAnalysisConfig.forceInclude?'checked':'') + ' onchange="columnAnalysisConfig.forceInclude=this.checked;updateColumnAnalysisSummary();showColumnAnalysisModal()"> Forzar todas</label>' +
                    '<label style="display:flex;align-items:center;gap:3px;font-size:11px;color:var(--text-faint);cursor:pointer"><input type="checkbox" ' + (columnAnalysisConfig.imputeMissing?'checked':'') + ' onchange="columnAnalysisConfig.imputeMissing=this.checked"> Imputar valores</label>' +
                '</div>' +
                '<div style="font-size:10px;color:var(--text-faint);margin-bottom:6px">Las columnas <span style="color:var(--accent)">verdes</span> son numéricas viables según el umbral.</div>' +
                '<div style="overflow-x:auto">' +
                    '<table style="width:100%;border-collapse:collapse;font-size:12px">' +
                        '<thead><tr style="background:var(--item-bg);position:sticky;top:0">' +
                            '<th style="padding:6px 8px;text-align:left;font-weight:600">Columna</th>' +
                            '<th style="padding:6px 8px;text-align:center">Total</th>' +
                            '<th style="padding:6px 8px;text-align:center">Válidos</th>' +
                            '<th style="padding:6px 8px;text-align:center">Densidad</th>' +
                            '<th style="padding:6px 8px;text-align:center">% Num.</th>' +
                            '<th style="padding:6px 8px;text-align:left">Tipo</th>' +
                        '</tr></thead>' +
                        '<tbody>' + rows + '</tbody>' +
                    '</table>' +
                '</div>' +
            '</div>' +
            '<div class="modal-footer" style="padding:10px 16px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end">' +
                '<button class="btn btn-secondary" onclick="this.closest(\'.modal-overlay\').remove()">Cerrar</button>' +
                '<button class="btn btn-primary" onclick="this.closest(\'.modal-overlay\').remove();updateColumnAnalysisSummary()">Aplicar configuración</button>' +
            '</div>' +
        '</div>' +
    '</div>';
    showModalRaw(html);
}

var _cmdResults = [];
var _cmdHighlightIdx = -1;

function initCommandPalette() {
  var input = document.getElementById('sidebarSearch');
  if (!input) return;

  var dropdown = document.createElement('div');
  dropdown.id = 'cmdPalette';
  dropdown.style.cssText = 'position:fixed;z-index:9999;background:var(--bg-panel);border:1px solid var(--border);border-radius:8px;max-height:320px;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.5);min-width:240px;display:none;padding:4px 0';
  document.body.appendChild(dropdown);

  function positionDropdown() {
    var rect = input.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 4) + 'px';
    dropdown.style.left = rect.left + 'px';
    dropdown.style.width = Math.max(rect.width, 240) + 'px';
  }

  function filterCommands(query) {
    if (!query || query.trim() === '') return [];
    var q = query.toLowerCase().trim();
    return COMMANDS.filter(function(cmd) {
      return cmd.label.toLowerCase().indexOf(q) !== -1
        || cmd.cat.toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderDropdown(results) {
    _cmdResults = results;
    dropdown.innerHTML = '';
    _cmdHighlightIdx = -1;
    if (results.length === 0) {
      dropdown.style.display = 'none';
      return;
    }
    dropdown.style.display = 'block';
    positionDropdown();

    results.forEach(function(cmd, i) {
      var item = document.createElement('div');
      item.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 12px;font-size:13px;color:var(--text-primary);cursor:pointer;transition:background .1s';
      item.innerHTML = '<span style="flex-shrink:0;font-size:15px">' + cmd.icon + '</span>' +
        '<span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + cmd.label + '</span>' +
        '<span style="font-size:10px;color:var(--text-faint);background:var(--item-bg);padding:2px 6px;border-radius:4px;flex-shrink:0">' + cmd.cat + '</span>';
      item.addEventListener('mouseenter', function() { highlightItem(i); });
      item.addEventListener('mousedown', function(e) { e.preventDefault(); executeCommand(_cmdResults[i]); });
      dropdown.appendChild(item);
    });
  }

  function highlightItem(idx) {
    var items = dropdown.children;
    for (var i = 0; i < items.length; i++) {
      items[i].style.background = i === idx ? 'var(--item-hover)' : '';
    }
    _cmdHighlightIdx = idx;
  }

  function executeCommand(cmd) {
    dropdown.style.display = 'none';
    input.value = '';
    input.blur();
    cmd.action();
  }

  function updateResults() {
    var query = input.value;
    var results = filterCommands(query);
    renderDropdown(results);
  }

  input.addEventListener('input', updateResults);

  input.addEventListener('focus', function() {
    if (input.value.trim()) updateResults();
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (_cmdResults.length === 0) return;
      var next = _cmdHighlightIdx < _cmdResults.length - 1 ? _cmdHighlightIdx + 1 : 0;
      highlightItem(next);
      var items = dropdown.children;
      if (items[next]) items[next].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (_cmdResults.length === 0) return;
      var prev = _cmdHighlightIdx > 0 ? _cmdHighlightIdx - 1 : _cmdResults.length - 1;
      highlightItem(prev);
      var items = dropdown.children;
      if (items[prev]) items[prev].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      if (_cmdHighlightIdx >= 0 && _cmdHighlightIdx < _cmdResults.length) {
        e.preventDefault();
        executeCommand(_cmdResults[_cmdHighlightIdx]);
      }
    } else if (e.key === 'Escape') {
      dropdown.style.display = 'none';
      input.blur();
    }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('#cmdPalette') && !e.target.closest('#sidebarSearch')) {
      dropdown.style.display = 'none';
    }
  });

  window.addEventListener('resize', function() {
    if (dropdown.style.display !== 'none') positionDropdown();
  });
}

// ════════════════════════════════════════════════════════════════
// COMMAND PALETTE — modal overlay (Ctrl+K / ribbon icon)
// ════════════════════════════════════════════════════════════════
function openCommandPalette() {
  var existing = document.getElementById('cmdModal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'cmdModal';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:flex-start;justify-content:center;padding-top:12vh';
  overlay.onclick = function(){ overlay.remove(); };

  var box = document.createElement('div');
  box.style.cssText = 'background:var(--bg-panel);border-radius:14px;padding:16px;width:520px;max-width:90vw;box-shadow:0 20px 60px rgba(0,0,0,0.5)';
  box.onclick = function(e){ e.stopPropagation(); };

  var input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Buscar comandos...';
  input.style.cssText = 'width:100%;padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg-secondary);color:var(--text-primary);font-size:14px;outline:none;box-sizing:border-box';
  input.addEventListener('input', function() {
    var q = input.value;
    var results = q.trim() ? COMMANDS.filter(function(cmd) {
      var lq = q.toLowerCase();
      return cmd.label.toLowerCase().indexOf(lq) !== -1 || cmd.cat.toLowerCase().indexOf(lq) !== -1;
    }) : [];
    renderModalResults(results);
  });

  var resultsEl = document.createElement('div');
  resultsEl.style.cssText = 'margin-top:8px;max-height:360px;overflow-y:auto;border-radius:8px';

  var modalHighlightIdx = -1;
  var modalResults = [];

  function renderModalResults(results) {
    modalResults = results;
    modalHighlightIdx = -1;
    resultsEl.innerHTML = '';
    if (results.length === 0) return;
    results.forEach(function(cmd, i) {
      var item = document.createElement('div');
      item.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 12px;font-size:13px;color:var(--text-primary);cursor:pointer;border-radius:6px;transition:background .1s';
      item.innerHTML = '<span style="flex-shrink:0;font-size:16px">' + cmd.icon + '</span>' +
        '<span style="flex:1">' + cmd.label + '</span>' +
        '<span style="font-size:10px;color:var(--text-faint);background:var(--item-bg);padding:2px 6px;border-radius:4px">' + cmd.cat + '</span>';
      item.addEventListener('mouseenter', function() {
        modalHighlightIdx = i;
        highlightModalItem(i);
      });
      item.addEventListener('mousedown', function(e) {
        e.preventDefault();
        overlay.remove();
        cmd.action();
      });
      resultsEl.appendChild(item);
    });
  }

  function highlightModalItem(idx) {
    var items = resultsEl.children;
    for (var i = 0; i < items.length; i++) {
      items[i].style.background = i === idx ? 'var(--item-hover)' : '';
    }
  }

  input.addEventListener('keydown', function(e) {
    var items = resultsEl.children;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (modalResults.length === 0) return;
      modalHighlightIdx = modalHighlightIdx < modalResults.length - 1 ? modalHighlightIdx + 1 : 0;
      highlightModalItem(modalHighlightIdx);
      if (items[modalHighlightIdx]) items[modalHighlightIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (modalResults.length === 0) return;
      modalHighlightIdx = modalHighlightIdx > 0 ? modalHighlightIdx - 1 : modalResults.length - 1;
      highlightModalItem(modalHighlightIdx);
      if (items[modalHighlightIdx]) items[modalHighlightIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      if (modalHighlightIdx >= 0 && modalHighlightIdx < modalResults.length) {
        e.preventDefault();
        overlay.remove();
        modalResults[modalHighlightIdx].action();
      }
    } else if (e.key === 'Escape') {
      overlay.remove();
    }
  });

  box.appendChild(input);
  box.appendChild(resultsEl);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  setTimeout(function(){ input.focus(); }, 50);
}

document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === '.') {
    e.preventDefault();
    openCommandPalette();
  }
});
