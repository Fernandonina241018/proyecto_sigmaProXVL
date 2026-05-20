// ════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ════════════════════════════════════════════════════════════════
var trabajoSheets = [{
  name: 'Hoja1',
  headers: ['Columna1','Columna2','Columna3','Columna4'],
  rows: Array.from({length:20}, function(){ return ['','','','']; })
}];
var trabajoActiveSheetIndex = 0;
var trabajoActiveCell = { row: 0, col: 0 };
var trabajoSelectionRange = null; // {r1,c1,r2,c2}
var trabajoImportedData = null;
var trabajoKeydownHandler = null;
var trabajoFreezeFirstCol = false;
var trabajoConditionalFormat = false;
// Undo/redo stacks — store deep snapshots of sheet rows+headers
var undoStack = [];
var redoStack = [];
var MAX_UNDO = 30;

var datosCurrentData = null;
var datosCurrentFileName = '';
var datosRecentFiles = [];
var datasetTooltip = null;
var currentPage = 'trabajo';
var _auditoriaInited = false;
var _usuariosInited = false;

function _persistAllData() {
  try {
    localStorage.setItem('sigmaPro_trabajoSheets', JSON.stringify(trabajoSheets));
    localStorage.setItem('sigmaPro_trabajoLimits', JSON.stringify({ limits: trabajoLimits, mode: trabajoLimitsMode }));
    if (datosCurrentData) {
      localStorage.setItem('sigmaPro_datosCurrentData', JSON.stringify({
        data: datosCurrentData,
        fileName: datosCurrentFileName,
        timestamp: Date.now()
      }));
    }
  } catch(e) {
    console.warn('[Persist] Error saving data:', e);
  }
}

function _restoreAllData() {
  try {
    var ts = localStorage.getItem('sigmaPro_trabajoSheets');
    if (ts) {
      var parsed = JSON.parse(ts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        trabajoSheets = parsed;
      }
    }
    var tl = localStorage.getItem('sigmaPro_trabajoLimits');
    if (tl) {
      var parsedTL = JSON.parse(tl);
      trabajoLimits = parsedTL.limits || null;
      trabajoLimitsMode = parsedTL.mode || 'global';
    }
    var dcd = localStorage.getItem('sigmaPro_datosCurrentData');
    if (dcd) {
      var parsed2 = JSON.parse(dcd);
      if (parsed2 && parsed2.data && parsed2.data.headers && Array.isArray(parsed2.data.rows)) {
        datosCurrentData = parsed2.data;
        datosCurrentFileName = parsed2.fileName || '';
      }
    }
  } catch(e) {
    console.warn('[Persist] Error restoring data:', e);
  }
}
// Analysis page state - dynamic tests
var analisisSelectedCategory = 'descriptiva';
var analisisSelectedTest = null;
var analisisLastResult = null;
var analisisResultContent = null;
// Datos table state
var datosPage = 0;
var datosPageSize = 50;
var datosSortCol = -1;
var datosSortAsc = true;
var datosFilters = []; // [{col, op, val}]
var datosFilteredRows = [];

// Límites (especificaciones) para tests de capacidad
var trabajoLimits = null;
var trabajoLimitsMode = 'global';
var acCurrentCell = null;
var acItems = [];
var acIndex = -1;

// ── Pane resizer ──
var resizer = document.getElementById('paneResizer');
var paneLeft = document.getElementById('paneLeft');
var panesCont = document.getElementById('panesContainer');
resizer.addEventListener('mousedown', function(e) {
  e.preventDefault(); resizer.classList.add('dragging');
  document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
  function onMove(ev) {
    var rect = panesCont.getBoundingClientRect();
    var newW = Math.max(160, Math.min(panesCont.offsetWidth - 160 - resizer.offsetWidth, ev.clientX - rect.left));
    paneLeft.style.width = newW + 'px';
  }
  function onUp() { resizer.classList.remove('dragging'); document.body.style.cursor = ''; document.body.style.userSelect = ''; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
  document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
});

// ── Menubar ──
var menuItems = document.querySelectorAll('.menu-item[data-menu]');
var anyOpen = false;
menuItems.forEach(function(item) {
  item.addEventListener('mousedown', function(e) {
    e.preventDefault(); var wasOpen = item.classList.contains('open');
    menuItems.forEach(function(i){ i.classList.remove('open'); });
    if (!wasOpen) { item.classList.add('open'); anyOpen = true; } else anyOpen = false;
  });
  item.addEventListener('mouseenter', function() { if (anyOpen) { menuItems.forEach(function(i){ i.classList.remove('open'); }); item.classList.add('open'); } });
});

document.addEventListener('mousedown', function(e) {
  // No cerrar si el click fue dentro de un menu-item o su dropdown
  if (e.target.closest('.menu-item')) return;
  
  // No cerrar si el click fue en un checkbox stat o badge
  if (e.target.classList.contains('stat-check')) return;
  if (e.target.classList.contains('stat-selected-badge')) return;
  
  menuItems.forEach(function(i){ i.classList.remove('open'); });
  anyOpen = false;
});

document.addEventListener('click', function(e) {
  var ddItem = e.target.closest('.dd-item');
  if (ddItem && ddItem.hasAttribute('onclick')) {
    console.log('Ejecutando onclick de dd-item');
    // El onclick se ejecutará automáticamente
  }
});

// ── Sidebar toggle ──
document.getElementById('sidebarToggle').addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('collapsed'); this.classList.toggle('rotated');
});

// ── Sidebar user dropdown ──
document.getElementById('sidebarUser').addEventListener('click', function(e) {
  e.stopPropagation();
  if (typeof Auth === 'undefined') return;
  var session = Auth.getSession();
  if (!session) { Auth.showLogin(); return; }
  var dd = document.getElementById('sidebarUserDropdown');
  if (!dd) return;
  document.getElementById('sudName').textContent = session.username || 'Usuario';
  document.getElementById('sudEmail').textContent = session.email || (session.username + '@sigmapro.com');
  dd.classList.toggle('open');
});
document.getElementById('sidebarUserDropdown').addEventListener('click', function(e) {
  var item = e.target.closest('.sud-item');
  if (!item) return;
  var dd = document.getElementById('sidebarUserDropdown');
  dd.classList.remove('open');
  if (item.getAttribute('data-action') === 'logout' && typeof Auth !== 'undefined') Auth.logout();
});
document.addEventListener('click', function(e) {
  var dd = document.getElementById('sidebarUserDropdown');
  if (dd && !e.target.closest('#sidebarUser') && !e.target.closest('#sidebarUserDropdown')) {
    dd.classList.remove('open');
  }
});

// ── Tab management ──
var tabbar = document.getElementById('tabbar');
function makeTabActive(tab) { document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); }); tab.classList.add('active'); }
document.getElementById('tabNew').addEventListener('click', function() {
  var t = document.createElement('div'); t.className = 'tab';
  t.innerHTML = '<span class="tab-icon">📄</span> Untitled <span class="tab-close">×</span>';
  tabbar.insertBefore(t, document.querySelector('.tabbar-spacer')); makeTabActive(t);
  t.querySelector('.tab-close').addEventListener('click', function(e){ e.stopPropagation(); t.remove(); });
  t.addEventListener('click', function(e){ if (!e.target.classList.contains('tab-close')) makeTabActive(t); });
});
document.querySelectorAll('.ribbon-icon').forEach(function(icon) {
  icon.addEventListener('click', function() { document.querySelectorAll('.ribbon-icon').forEach(function(i){ i.classList.remove('active'); }); icon.classList.add('active'); });
});

// ════════════════════════════════════════════════════════════════
// PAGE SYSTEM
// ════════════════════════════════════════════════════════════════
var leftPaneTitle  = document.getElementById('leftPaneTitle');
var rightPaneTitle = document.getElementById('rightPaneTitle');
var leftPaneBody   = document.getElementById('leftPaneBody');
var rightPaneBody  = document.getElementById('rightPaneBody');

var leftPanels = {
  trabajo: function() {
    return '<div class="left-panel" style="gap:10px">' +
      '<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">' +
        '<div class="tb-dropdown">' +
          '<button class="btn btn-primary btn-dd" onclick="toggleDropdown(this)">📋 Acciones ▾</button>' +
          '<div class="dd-menu">' +
            '<div class="dd-item" onclick="generateSampleData()">🔄 Generar datos</div>' +
            '<div class="dd-item" onclick="exportTrabajo()">💾 Exportar CSV</div>' +
            '<div class="dd-item" onclick="clearCurrentSheet()">🗑️ Limpiar hoja</div>' +
          '</div>' +
        '</div>' +
        '<div class="tb-dropdown">' +
          '<button class="btn btn-secondary btn-dd" onclick="toggleDropdown(this)">✏️ Editar ▾</button>' +
          '<div class="dd-menu">' +
            '<div class="dd-item" onclick="addRow()">➕ Fila</div>' +
            '<div class="dd-item" onclick="addColumn()">➕ Columna</div>' +
            '<div class="dd-item" onclick="deleteActiveRow()">➖ Fila</div>' +
            '<div class="dd-item" onclick="deleteActiveColumn()">➖ Columna</div>' +
            '<div class="dd-divider"></div>' +
            '<div class="dd-item" onclick="undoAction()">↩ Deshacer</div>' +
            '<div class="dd-item" onclick="redoAction()">↪ Rehacer</div>' +
          '</div>' +
        '</div>' +
        '<div class="tb-dropdown">' +
          '<button class="btn btn-secondary btn-dd" onclick="toggleDropdown(this)">👁️ Vista ▾</button>' +
          '<div class="dd-menu">' +
            '<div class="dd-item" onclick="toggleFreezeCol()" id="ddFreezeCol">' + (trabajoFreezeFirstCol ? '🔒 Col fija ON' : '🔓 Fijar col 1') + '</div>' +
            '<div class="dd-item" onclick="toggleConditionalFormat()" id="ddCondFormat">' + (trabajoConditionalFormat ? '🎨 CF ON' : '🎨 Formato cond.') + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="info-section" style="flex-shrink:0">' +
        '<div class="info-section-header" style="display:flex;justify-content:space-between;align-items:center;padding:4px 10px"><span>Hojas</span></div>' +
        '<div style="padding:3px 6px 5px;display:flex;gap:4px;align-items:center">' +
          '<select id="sheetsSelect" class="sheets-select" onchange="switchToSheet(parseInt(this.value))" style="flex:1;padding:3px 4px;border:1px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:12px">' + getSheetsOptionsHTML() + '</select>' +
          (trabajoSheets.length > 1 ? '<button class="sheets-del-btn" onclick="deleteSheet(' + trabajoActiveSheetIndex + ',event)" title="Eliminar hoja" style="background:none;border:none;cursor:pointer;color:var(--text-faint);font-size:20px;line-height:1;padding:0 2px">×</button>' : '') +
          '<button class="sheets-add-btn" onclick="createNewSheet()" title="Nueva hoja" style="background:none;border:none;cursor:pointer;color:var(--accent);font-size:20px;line-height:1;padding:0 2px">＋</button>' +
        '</div>' +
      '</div>' +
      '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">Resumen</div><div class="info-list" id="trabajoResumen">' + getTrabajoResumenHTML() + '</div></div>' +
      '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">Celda activa</div><div class="info-list" id="trabajoCeldaActiva">' + getTrabajoCeldaActivaHTML() + '</div></div>' +
      '<div class="info-section" style="flex-shrink:0" id="trabajoLimitsSection"><div class="info-section-header" style="display:flex;justify-content:space-between;align-items:center">' +
        '<span>📏 Límites</span>' +
        '<label style="font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:pointer">' +
          '<input type="checkbox" id="limitsGlobalToggle" ' + (trabajoLimitsMode === 'global' ? 'checked' : '') + ' style="accent-color:var(--accent)" onchange="toggleLimitsMode()"> Global' +
        '</label>' +
      '</div><div class="info-list" id="trabajoLimitsBody"></div></div>' +
    '</div>';
  },
  datos: function() {
    return '<div class="left-panel" style="gap:12px" id="datosLeftPanel">' +
      '<div class="upload-zone compact" id="dropZone" style="padding:10px 8px;flex-shrink:0">' +
        '<div class="upload-zone-icon" style="font-size:18px">📂</div>' +
        '<div class="upload-zone-text" style="font-size:11px">Arrastra o haz clic</div>' +
      '</div>' +
      '<input type="file" id="fileInput" style="display:none" accept=".csv,.json,.xlsx,.xls">' +
      '<div style="display:flex;gap:6px;flex-shrink:0">' +
        '<button class="btn btn-secondary" style="flex:1;font-size:11px;padding:6px 4px" id="btnCsv">📄 CSV</button>' +
        '<button class="btn btn-secondary" style="flex:1;font-size:11px;padding:6px 4px" id="btnXlsx">📊 Excel</button>' +
        '<button class="btn btn-secondary" style="flex:1;font-size:11px;padding:6px 4px" id="btnPaste">📋 Pegar</button>' +
      '</div>' +
      '<div style="display:flex;gap:6px;flex-shrink:0">' +
        '<button class="btn btn-secondary" style="flex:1;font-size:11px;padding:6px 4px" onclick="generarDatosNormales()">🔢 Normal</button>' +
        '<button class="btn btn-secondary" style="flex:1;font-size:11px;padding:6px 4px" onclick="ampliarDatos()">📈 Ampliar</button>' +
        '<button class="btn btn-secondary" style="flex:1;font-size:11px;padding:6px 4px" onclick="limpiarDataset()">🧹 Limpiar</button>' +
      '</div>' +
      '<div style="display:flex;gap:6px;flex-shrink:0">' +
        '<button class="btn btn-accent" style="flex:1;font-size:11px;padding:6px 4px" onclick="generarEjemploEstadistico()">📚 Ejemplo stats</button>' +
      '</div>' +
      '<div class="info-section" style="flex:1;overflow:hidden;display:flex;flex-direction:column">' +
        '<div class="info-section-header" style="display:flex;justify-content:space-between;align-items:center">' +
          '<span>Recientes</span>' +
          '<span id="clearHistoryBtn" title="Limpiar historial" style="cursor:pointer;font-size:11px;padding:2px 6px;border-radius:4px;color:var(--text-faint)" onmouseenter="this.style.background=\'rgba(255,255,255,.08)\';this.style.color=\'var(--text-muted)\'" onmouseleave="this.style.background=\'transparent\';this.style.color=\'var(--text-faint)\'">🗑️</span>' +
        '</div>' +
        '<div style="overflow-y:auto;flex:1;padding:6px;display:flex;flex-direction:column;gap:4px" id="recentFilesList"></div>' +
      '</div>' +
      '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">Estado</div><div class="info-list">' +
        '<div class="info-item"><div class="info-item-label">Dataset</div><div class="info-item-value" id="datosDatasetName">Sin cargar</div></div>' +
        '<div class="info-item"><div class="info-item-label">Filas</div><div class="info-item-value" id="datosRowCount">—</div></div>' +
        '<div class="info-item"><div class="info-item-label">Columnas</div><div class="info-item-value" id="datosColCount">—</div></div>' +
      '</div></div>' +
    '</div>';
  },
  analisis: function() { 
      var categoryNames = {
        descriptiva: '📊 Descriptiva',
        hipotesis: '⚖️ Hipótesis',
        correlacion: '🔗 Correlación',
        regresion: '📈 Regresión',
        noParametricos: '📉 No Paramétricos',
        multivariado: '📦 Multivariado'
      };
      var catLabel = categoryNames[analisisSelectedCategory] || '📊 Descriptiva';
      var catIcon = catLabel.split(' ')[0];
      var catText = catLabel.substring(2);
      var lastTest = analisisLastResult ? analisisLastResult.testName : '—';
      var lastPVal = analisisLastResult && analisisLastResult.pValue != null ? analisisLastResult.pValue.toFixed(4) : '—';
      var lastDec = analisisLastResult ? (analisisLastResult.significativo ? 'Rechazar H₀' : 'No rechazar H₀') : '—';
      var decColor = analisisLastResult && analisisLastResult.significativo ? 'var(--accent)' : 'var(--text-faint)';
      
      // Get selected tests from menu checkboxes
      var selectedTests = [];
      document.querySelectorAll('.child-check:checked').forEach(function(chk) {
        selectedTests.push(chk.dataset.nombre);
      });
      
      // Build selected tests list with icons
      var selectedTestsHtml = '';
      if (selectedTests.length > 0) {
        var testIcons = {
          'Media Aritmética': '📐', 'Mediana': '📊', 'Moda': '🎯', 'Varianza': '📈',
          'Desv. Estándar': '📉', 'Coef. Variación': '📊', 'Asimetría': '📐', 'Curtosis': '🔔',
          't-Test': '⚖️', 'z-Test': '📐', 'F-Test': '📊', 'Chi-cuadrado': '📐', 'Shapiro-Wilk': '🔔',
          'Pearson': '🔗', 'Spearman': '📈', 'Kendall': '📊',
          'Lineal Simple': '📈', 'Regresión Múltiple': '📊', 'Regresión Logística': '📦',
          'Mann-Whitney': '📉', 'Wilcoxon': '📊', 'Kruskal-Wallis': '📦',
          'PCA': '📊', 'Cluster K-Means': '📈', 'LDA': '📐'
        };
        selectedTests.forEach(function(t) {
          var icon = testIcons[t] || '📊';
          var isCurrent = analisisSelectedTest === t ? 'active' : '';
          selectedTestsHtml += '<div class="info-item ' + isCurrent + '" style="display:flex;align-items:center;gap:4px">' +
            '<span style="color:var(--accent)">✓</span>' +
            '<span>' + icon + ' ' + t + '</span>' +
          '</div>';
        });
      } else {
        selectedTestsHtml = '<div class="info-item" style="color:var(--text-faint);font-size:11px">Ningún test seleccionado</div>';
      }
      
      return '<div class="left-panel" style="gap:10px">' +  
        // ── Tests seleccionados desde el menú ──
        '<div class="info-section" style="flex:1;overflow:hidden;display:flex;flex-direction:column">' +
          '<div class="info-section-header">Tests seleccionados</div>' +
          '<div style="overflow-y:auto;flex:1;padding:6px;display:flex;flex-direction:column;gap:3px">' + selectedTestsHtml + '</div>' +
        '</div>' +
        // ── Resumen del último resultado ejecutado ──
        '<div class="info-section" style="flex-shrink:0">' +
          '<div class="info-section-header">Último resultado</div>' +
          '<div class="info-list">' +
            '<div class="info-item"><div class="info-item-label">Test</div><div class="info-item-value" id="analisisLastTest">' + lastTest + '</div></div>' +
            '<div class="info-item"><div class="info-item-label">p-valor</div><div class="info-item-value" id="analisisLastPVal">' + lastPVal + '</div></div>' +
            '<div class="info-item"><div class="info-item-label">Decisión</div><div class="info-item-value" id="analisisLastDecision" style="color:' + decColor + '">' + lastDec + '</div></div>' +
          '</div>' +
        '</div>' +
      '</div>'; 
    },

  visualizacion: function()  { return '<div class="left-panel" style="gap:10px"><div style="flex-shrink:0;display:flex;flex-direction:column;gap:6px"><button class="btn btn-primary" style="width:100%;justify-content:center">+ Nuevo gráfico</button><div style="display:flex;gap:6px"><button class="btn btn-secondary" style="flex:1;justify-content:center;font-size:11px">↓ SVG</button><button class="btn btn-secondary" style="flex:1;justify-content:center;font-size:11px">↓ PNG</button></div></div><div class="info-section"><div class="info-section-header">Tipo de gráfico</div><div class="info-list"><div class="info-item active">📊 Barras</div><div class="info-item">📈 Líneas</div><div class="info-item">⬡ Dispersión</div><div class="info-item">◉ Circular</div><div class="info-item">📦 Caja y bigotes</div><div class="info-item">▦ Histograma</div></div></div></div>'; },
  reportes: function() { return '<div class="left-panel" style="gap:10px"><div style="flex-shrink:0;display:flex;flex-direction:column;gap:6px"><button class="btn btn-primary" style="width:100%;justify-content:center">+ Nuevo reporte</button></div><div class="info-section"><div class="info-section-header">Plantillas</div><div class="info-list"><div class="info-item active">📐 Reporte estándar</div><div class="info-item">📋 Reporte ejecutivo</div><div class="info-item">📊 Resumen estadístico</div></div></div><div class="info-section"><div class="info-section-header">Formato de salida</div><div class="info-list"><div class="info-item active">📄 PDF</div><div class="info-item">📝 DOCX</div><div class="info-item">📊 HTML</div></div></div></div>'; },
  auditoria: function() { return '<div class="left-panel" style="gap:10px"><button class="btn btn-secondary" style="width:100%;justify-content:center;font-size:11px;flex-shrink:0" onclick="if(typeof AuditoriaManager!==\'undefined\')AuditoriaManager.exportarCSV()">📥 Exportar log completo</button><div class="info-section"><div class="info-section-header">Filtros</div><div style="font-size:11px;color:var(--text-faint);padding:8px">Usa los filtros incluidos en el panel de resultados</div></div></div>'; },
  usuarios: function() { return '<div class="left-panel" style="gap:10px"><div style="flex-shrink:0;display:flex;flex-direction:column;gap:6px"><button class="btn btn-primary" style="width:100%;justify-content:center" onclick="if(typeof UsuariosManager!==\'undefined\')UsuariosManager.abrirModalCrearUsuario()">+ Nuevo usuario</button></div><div class="info-section"><div class="info-section-header">Usuarios</div><div class="usr-toolbar" style="display:flex;flex-direction:column;gap:8px;padding:8px"><input class="usr-search" id="usr-search" type="text" placeholder="🔍 Buscar usuario..." style="padding:8px 10px;border:1.5px solid var(--border);border-radius:6px;font-size:0.82rem;font-family:inherit;color:var(--text-primary);background:var(--bg-panel);outline:none;transition:border-color 0.2s"><div style="display:flex;align-items:center;justify-content:space-between"><div class="usr-count" id="usr-count" style="font-size:0.8rem;color:var(--text-faint)">—</div><button class="usr-btn-refresh" id="usr-btn-refresh" title="Recargar" style="padding:6px 10px;background:var(--item-bg);border:1.5px solid var(--border);border-radius:6px;cursor:pointer;font-size:0.9rem;transition:all 0.2s">🔄</button></div></div></div></div>'; },
  firmarReporte: function() {
    return '<div class="left-panel" style="gap:10px">' +
      '<div class="info-section"><div class="info-section-header">✍️ Firmar Reporte</div>' +
        '<div class="info-section-body" style="font-size:11px;color:var(--text-faint);padding:8px 12px">Carga un reporte .html generado por StatAnalyzer Pro para revisar y firmar electrónicamente.</div></div>' +
      '<div class="info-section"><div class="info-section-header">📂 Cargar reporte</div>' +
        '<div class="info-section-body" style="padding:8px 12px">' +
          '<div class="upload-zone" id="firmaDropZone" style="border:2px dashed var(--border);border-radius:8px;padding:20px;text-align:center;cursor:pointer;transition:all .2s">' +
            '<div style="font-size:28px;margin-bottom:6px">📄</div>' +
            '<div style="font-size:11px;color:var(--text-muted)">Arrastra un .html aquí<br>o haz clic para seleccionar</div></div>' +
          '<input type="file" id="firmaFileInput" accept=".html" style="display:none"></div></div>' +
      '<div id="firmaStatus" style="display:none"></div>' +
      '<div id="firmaActions" style="display:none;flex-direction:column;gap:8px">' +
        '<div class="info-section"><div class="info-section-header">📝 Firmas detectadas</div>' +
          '<div class="info-section-body" id="firmaSignatureEditor" style="padding:8px 12px;display:flex;flex-direction:column;gap:10px"></div></div>' +
        '<button class="btn btn-primary" id="firmaDownloadBtn" style="width:100%;justify-content:center;font-size:12px">⬇ Descargar reporte firmado</button></div>' +
    '</div>';
  }
};

var rightPanels = {
  trabajo: function() {
    var sheet = getCurrentSheet();
    var cols = sheet ? sheet.headers : ['Columna1'];
    var rows = sheet ? sheet.rows : [];
    var colHeaders = cols.map(function(c, ci){
      var frozenClass = (trabajoFreezeFirstCol && ci === 0) ? ' frozen-col' : '';
      return '<th style="min-width:100px;text-align:left;font-size:11px;font-weight:500;padding:0;border-right:1px solid var(--border);background:var(--bg-primary);position:sticky;top:0;z-index:' + (trabajoFreezeFirstCol && ci===0 ? 3 : 2) + ';' + (trabajoFreezeFirstCol && ci===0 ? 'left:40px;border-right:2px solid rgba(124,106,247,.4)' : '') + '" class="' + frozenClass + '">' +
        '<div class="col-header-editable" contenteditable="true" data-colidx="' + ci + '" onblur="renameColumn(' + ci + ',this.textContent)" onmouseenter="showColStats(event,' + ci + ')" onmouseleave="hideColStats()" title="Hover: estadísticas · Doble clic: renombrar">' + escapeHtml(c) + '</div></th>';
    }).join('');

    var bodyRows = rows.map(function(r, ri){
      var cells = r.map(function(v, ci){
        var isActive = trabajoActiveCell.row === ri && trabajoActiveCell.col === ci;
        var inRange = isInRange(ri, ci);
        var selClass = isActive ? ' cell-selected' : (inRange ? ' cell-in-range' : '');
        var cfClass = getCFClass(v, ci);
        var frozenClass = (trabajoFreezeFirstCol && ci === 0) ? ' frozen-col' : '';
        var safeV = escapeHtml(String(v == null ? '' : v));
        return '<td class="excel-cell' + selClass + frozenClass + '" style="padding:0;border-right:1px solid rgba(255,255,255,0.04)' + (trabajoFreezeFirstCol && ci===0 ? ';border-right:2px solid rgba(124,106,247,.4)' : '') + '" onclick="cellClick(event,' + ri + ',' + ci + ')">' +
          '<div class="excel-cell-inner' + (cfClass ? ' ' + cfClass : '') + '" contenteditable="true" data-row="' + ri + '" data-col="' + ci + '"' +
          ' onblur="saveCellData(' + ri + ',' + ci + ',this.textContent)"' +
          ' oninput="onCellInput(event,' + ri + ',' + ci + ',this.textContent)"' +
          ' onpaste="handleCellPaste(event,' + ri + ',' + ci + ')"' +
          ' onfocus="onCellFocus(' + ri + ',' + ci + ')">' +
          safeV + '</div></td>';
      }).join('');
      var rowActive = trabajoActiveCell.row === ri;
      return '<tr><td class="excel-row-num' + (rowActive ? ' row-active' : '') + '" onclick="selectRow(' + ri + ')">' + (ri+1) + '</td>' + cells + '</tr>';
    }).join('');

    var colLetter = String.fromCharCode(65 + trabajoActiveCell.col);
    var cellRef = colLetter + (trabajoActiveCell.row + 1);
    var cellVal = (sheet && sheet.rows[trabajoActiveCell.row]) ? (sheet.rows[trabajoActiveCell.row][trabajoActiveCell.col] || '') : '';

    return '<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;background:var(--bg-primary)">' +
      '<div style="display:flex;align-items:center;gap:0;border-bottom:1px solid var(--border);flex-shrink:0;background:var(--card-bg)">' +
        '<div id="trabajoCellRef" style="padding:6px 10px;font-size:11px;color:var(--text-faint);border-right:1px solid var(--border);min-width:60px;font-family:monospace;flex-shrink:0">' + escapeHtml(cellRef) + '</div>' +
        '<div style="padding:0 8px;font-size:11px;color:var(--text-faint);border-right:1px solid var(--border);flex-shrink:0">fx</div>' +
        '<div id="trabajoCellVal" style="padding:6px 12px;font-size:12px;color:var(--text-muted);font-family:monospace;flex:1;border-right:1px solid var(--border)">' + escapeHtml(String(cellVal)) + '</div>' +
        '<div style="display:flex;gap:4px;padding:4px 8px;flex-shrink:0">' +
          '<button class="btn btn-secondary" style="font-size:11px;padding:3px 8px" onclick="addRow()">+ Fila</button>' +
          '<button class="btn btn-secondary" style="font-size:11px;padding:3px 8px" onclick="addColumn()">+ Col</button>' +
          '<button class="btn btn-secondary" style="font-size:11px;padding:3px 8px" onclick="deleteActiveRow()">– Fila</button>' +
          '<button class="btn btn-secondary" style="font-size:11px;padding:3px 8px" onclick="undoAction()">↩</button>' +
          '<button class="btn btn-secondary" style="font-size:11px;padding:3px 8px" onclick="redoAction()">↪</button>' +
          '<button class="btn btn-secondary" style="font-size:11px;padding:3px 8px" onclick="sortColumn()">↕</button>' +
          '<button class="btn btn-secondary" style="font-size:11px;padding:3px 8px" onclick="exportTrabajo()">💾</button>' +
          '<button class="btn btn-primary" style="font-size:11px;padding:3px 8px" onclick="loadPage(\'analisis\')">📊 Análisis</button>' +
        '</div>' +
      '</div>' +
      '<div style="flex:1;overflow:auto;position:relative" id="trabajoScrollWrap">' +
        '<table id="trabajoTable" style="border-collapse:collapse;width:100%;table-layout:fixed;min-width:400px">' +
          '<thead style="position:sticky;top:0;z-index:2"><tr>' +
            '<th style="width:40px;background:var(--bg-primary);border-right:1px solid var(--border);border-bottom:1px solid var(--border);cursor:pointer;position:sticky;top:0;z-index:3;left:0" onclick="selectAll()" title="Seleccionar todo"></th>' +
            colHeaders +
          '</tr></thead>' +
          '<tbody id="trabajoTableBody" style="font-family:monospace">' + bodyRows + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div style="display:flex;gap:0;border-top:1px solid var(--border);flex-shrink:0;background:var(--card-bg);align-items:stretch">' +
        getTrabajoTabsHTML() +
        '<div style="padding:4px 12px;font-size:11px;color:var(--accent);cursor:pointer;display:flex;align-items:center" onclick="createNewSheet()" title="Nueva hoja">+</div>' +
        '<div style="margin-left:auto;padding:4px 12px;font-size:11px;color:var(--text-faint);display:flex;align-items:center">' + rows.length + ' filas · ' + cols.length + ' cols · Pila deshacer: ' + undoStack.length + '</div>' +
      '</div>' +
    '</div>';
  },

  datos: function() {
    return '<div style="display:flex;flex-direction:column;height:100%;overflow:hidden" id="datosRightPanel">' +
      '<div style="padding:10px 16px;border-bottom:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;gap:10px;background:var(--card-bg)">' +
        '<span style="font-size:16px">👁️</span>' +
        '<span style="font-size:14px;font-weight:600;color:var(--text-primary);flex:1">Vista Previa del Dataset</span>' +
        '<span class="page-card-badge" id="datosRecordBadge" style="background:var(--item-bg);color:var(--text-faint)">Sin datos</span>' +
        '<div style="display:flex;gap:6px">' +
          '<button class="btn btn-secondary" style="font-size:11px;padding:4px 10px" id="btnFilterRows">🔍 Filtrar</button>' +
          '<button class="btn btn-primary" style="font-size:11px;padding:4px 10px" id="btnSendToTrabajo" title="Enviar a Hoja de Trabajo">📋 Trabajo</button>' +
          '<button class="btn btn-primary" style="font-size:11px;padding:4px 10px" id="btnExport">↓ Exportar</button>' +
        '</div>' +
      '</div>' +
      '<div id="datosFilterBar" style="display:none"></div>' +
      '<div class="preview-wrap" style="flex:1;border-radius:0;overflow-y:auto;overflow-x:auto">' +
        '<div id="datosTableContainer" style="display:none">' +
          '<table class="data-table" style="min-width:600px">' +
            '<thead id="datosTableHead"><tr><th style="width:44px">#</th></tr></thead>' +
            '<tbody id="datosTableBody"></tbody>' +
          '</table>' +
        '</div>' +
        '<div id="datosEmptyState" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:40px;color:var(--text-faint)">' +
          '<div style="font-size:36px">📭</div>' +
          '<div style="font-size:13px;color:var(--text-muted)">Sin datos cargados</div>' +
          '<div style="font-size:11px">Usa el panel izquierdo para cargar un archivo CSV, JSON o Excel</div>' +
        '</div>' +
      '</div>' +
      '<div class="pagination-bar" id="datosPaginationBar" style="display:none">' +
        '<button class="pg-btn" id="pgFirst" onclick="goPage(0)">«</button>' +
        '<button class="pg-btn" id="pgPrev" onclick="goPage(datosPage-1)">‹</button>' +
        '<span class="pg-info" id="pgInfo"></span>' +
        '<button class="pg-btn" id="pgNext" onclick="goPage(datosPage+1)">›</button>' +
        '<button class="pg-btn" id="pgLast" onclick="goPage(999999)">»</button>' +
        '<select class="pg-size-sel" id="pgSizeSel" onchange="changePageSize(this.value)">' +
          '<option value="25">25/pág</option><option value="50" selected>50/pág</option><option value="100">100/pág</option><option value="250">250/pág</option>' +
        '</select>' +
      '</div>' +
    '</div>';
  },

  analisis: function() { 
    // 1. Mostrar resultado si existe
    if (analisisSelectedTest && analisisResultContent) {
      var testLabel = analisisLastResult && analisisLastResult.testName ? analisisLastResult.testName : analisisSelectedTest;
      return '<div class="page-body">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
          '<span style="font-size:14px;font-weight:600;color:var(--text-primary)">' + escapeHtml(testLabel) + '</span>' +
          '<div style="display:flex;gap:6px">' +
            '<button class="btn btn-secondary" style="font-size:11px" onclick="loadPage(&#39;visualizacion&#39;)">📊 Ver gráficos</button>' +
            '<button class="btn btn-secondary" style="font-size:11px" onclick="analisisResultContent=null;analisisSelectedTest=null;loadPage(&#39;analisis&#39;)">✕ Cerrar resultado</button>' +
          '</div>' +
        '</div>' +
        '<div class="page-card">' +
          '<div class="page-card-body" style="padding:20px">' + analisisResultContent + '</div>' +
        '</div>' +
      '</div>';
    }
    
    // 2. Mostrar cards si hay tests seleccionados en el sidebar
    var sideTests = getSidebarSelectedTests();
    if (sideTests.length > 0) {
      return buildStatCardsHTML(sideTests);
    }
    
    // 3. Estado inicial / carga (wrapper con tres secciones solapadas)
    return '<div class="page-body">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
        '<span style="font-size:12px;color:var(--text-muted)">Selecciona un test desde el menú Statistical Analysis</span>' +
      '</div>' +
      // Wrapper con tres secciones que se solapan
      '<div id="analisis-content-wrapper" class="analisis-wrapper" style="flex:1;position:relative;overflow:hidden">' +
        // MAIN 1: Estado inicial (sin analíticos seleccionados)
        '<div class="analisis-main analisis-main-initial" style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;padding:20px' + (analisisSelectedTest ? ';display:none' : '') + '">' +
          '<div style="text-align:center;color:var(--text-faint);padding:40px;border:2px dashed var(--border);border-radius:8px;width:100%;max-width:600px">' +
            '<div style="font-size:48px;margin-bottom:16px">📊</div>' +
            '<div style="font-size:16px;font-weight:500;color:var(--text-muted);margin-bottom:8px">Área de Análisis</div>' +
            '<div style="font-size:12px;color:var(--text-faint)">Selecciona tests desde el menú Statistical Analysis</div>' +
            '<div style="margin-top:16px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">' +
              '<span class="badge" style="background:var(--card-bg)">1. Seleccionar</span>' +
              '<span class="badge" style="background:var(--card-bg)">2. Ejecutar</span>' +
              '<span class="badge" style="background:var(--card-bg)">3. Ver resultados</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // MAIN 2: Estado de carga/ejecución (cuando hay test seleccionado pero sin resultado)
        '<div class="analisis-main analisis-main-loading" style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;padding:20px' + (analisisSelectedTest && !analisisResultContent ? '' : ';display:none') + '">' +
          '<div style="text-align:center;padding:40px;width:100%;max-width:500px">' +
            '<div style="font-size:32px;margin-bottom:16px">⏳</div>' +
            '<div style="font-size:16px;font-weight:500;color:var(--text-muted);margin-bottom:8px">Ejecutando: ' + (analisisSelectedTest || '...') + '</div>' +
            '<div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin:16px 0">' +
              '<div style="height:100%;width:30%;background:var(--accent);animation:analisis-loading 1.5s infinite"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // MAIN 3: Estado de resultados (cuando hay resultado disponible)
        '<div class="analisis-main analisis-main-results" style="position:absolute;top:0;left:0;right:0;bottom:0;padding:20px;overflow-y:auto' + (analisisResultContent ? '' : ';display:none') + '">' +
          '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:8px;padding:20px">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border)">' +
              '<span style="font-size:14px;font-weight:600;color:var(--text-primary)">' + (analisisLastResult ? analisisLastResult.testName : 'Resultado') + '</span>' +
              '<div style="display:flex;gap:6px">' +
                '<button class="btn btn-secondary" style="font-size:11px;padding:4px 8px" onclick="loadPage(&#39;visualizacion&#39;)">📊 Ver gráficos</button>' +
                '<button class="btn btn-secondary" style="font-size:11px;padding:4px 8px" onclick="analisisResultContent=null;analisisSelectedTest=null;loadPage(&#39;analisis&#39;)">✕ Cerrar</button>' +
              '</div>' +
            '</div>' +
            '<div>' + (analisisResultContent || '<div style="color:var(--text-faint)">Sin resultados</div>') + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<style>@keyframes analisis-loading{0%{transform:translateX(-100%)}50%{transform:translateX(100%)}100%{transform:translateX(-100%)}}</style>' +
    '</div>';
  },
  visualizacion: function() { return '<div class="page-body" style="display:flex;flex-direction:column;gap:12px">' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;flex-shrink:0">' +
      '<button class="btn btn-secondary viz-type" data-type="bar" style="font-size:12px">📊 Barras</button>' +
      '<button class="btn btn-secondary viz-type" data-type="line" style="font-size:12px">📈 Líneas</button>' +
      '<button class="btn btn-secondary viz-type" data-type="area" style="font-size:12px">📉 Área</button>' +
      '<button class="btn btn-secondary viz-type" data-type="multiLine" style="font-size:12px">📈📈 Multi-líneas</button>' +
      '<button class="btn btn-secondary viz-type" data-type="stackedBar" style="font-size:12px">🏗️ Apiladas</button>' +
      '<button class="btn btn-secondary viz-type" data-type="groupedBar" style="font-size:12px">📊📊 Agrupadas</button>' +
      '<button class="btn btn-secondary viz-type" data-type="scatter" style="font-size:12px">⬡ Dispersión</button>' +
      '<button class="btn btn-secondary viz-type" data-type="bubble" style="font-size:12px">🔵 Burbuja</button>' +
      '<button class="btn btn-secondary viz-type" data-type="pie" style="font-size:12px">◉ Circular</button>' +
      '<button class="btn btn-secondary viz-type" data-type="doughnut" style="font-size:12px">◉ Dona</button>' +
      '<button class="btn btn-secondary viz-type" data-type="polarArea" style="font-size:12px">🔄 Polar</button>' +
      '<button class="btn btn-secondary viz-type" data-type="radar" style="font-size:12px">🕸️ Radar</button>' +
      '<button class="btn btn-secondary viz-type" data-type="histogram" style="font-size:12px">▦ Histograma</button>' +
    '</div>' +
    '<div class="page-card" style="flex:0 0 auto">' +
      '<div class="page-card-body" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">' +
        '<span style="font-size:12px;color:var(--text-muted)">Eje X:</span>' +
        '<select id="vizColX" class="modal-select" style="min-width:120px"><option value="">— Seleccionar —</option></select>' +
        '<span style="font-size:12px;color:var(--text-muted)">Eje Y:</span>' +
        '<select id="vizColY" class="modal-select" style="min-width:120px"><option value="">— Seleccionar —</option></select>' +
        '<span id="vizSizeLabel" style="font-size:12px;color:var(--text-muted);display:none">Tamaño:</span>' +
        '<select id="vizColSize" class="modal-select" style="min-width:120px;display:none"><option value="">— Seleccionar —</option></select>' +
        '<div id="vizExtraYContainer" style="display:none;flex-direction:column;gap:4px;width:100%">' +
          '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' +
            '<span style="font-size:11px;color:var(--text-faint)">Series Y adicionales:</span>' +
            '<button class="btn btn-secondary" id="vizAddYBtn" style="font-size:10px;padding:2px 8px">+</button>' +
          '</div>' +
          '<div id="vizExtraYList"></div>' +
        '</div>' +
        '<button class="btn btn-primary" id="vizRenderBtn" style="font-size:12px">🎨 Renderizar</button>' +
        '<button class="btn btn-secondary" onclick="loadPage(\'reportes\')" style="font-size:12px;margin-left:auto">📄 Reportes</button>' +
      '</div>' +
    '</div>' +
    '<div id="vizCardsContainer" style="display:flex;flex-direction:column;gap:10px"></div>' +
  '</div>'; },
  reportes: function() { return '<div class="page-body"><div id="reportes-editor-container"></div></div>'; },
  auditoria: function() { return '<div class="page-body"><div id="auditoria-container" style="width:100%"></div></div>'; },
  usuarios: function() { return '<div class="page-body"><div id="usuarios-container" style="width:100%"></div></div>'; },
  firmarReporte: function() { return '<div class="page-body" style="display:flex;flex-direction:column;gap:12px;height:100%">' +
    '<div class="page-card" style="flex:1;display:flex;flex-direction:column;min-height:0">' +
      '<div class="page-card-header"><span class="page-card-icon">📄</span><span class="page-card-title">Vista previa del reporte</span></div>' +
      '<div class="page-card-body" id="firmaPreview" style="flex:1;padding:0;overflow:auto;display:flex;align-items:center;justify-content:center;min-height:300px">' +
        '<div style="color:var(--text-faint);font-size:13px">Carga un reporte .html para previsualizarlo aquí</div></div></div></div>'; }
};

var pageIcons  = { trabajo:'📋', datos:'📊', analisis:'🔬', visualizacion:'📈', reportes:'📄', firmarReporte:'✍️', auditoria:'📋', usuarios:'👥' };
var pageTitles = { trabajo:'Hoja de Trabajo', datos:'Gestión de Datos', analisis:'Análisis Estadístico', visualizacion:'Visualización', reportes:'Reportes', firmarReporte:'Firmar Reporte', auditoria:'Auditoría', usuarios:'Usuarios' };

function loadPage(name) {
  currentPage = name;
  document.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });
  var navEl = document.querySelector('[data-page="' + name + '"]');
  if (navEl) navEl.classList.add('active');
  var pageTab = tabbar.querySelector('[data-page-tab="' + name + '"]');
  if (!pageTab) {
    pageTab = document.createElement('div'); pageTab.className = 'tab'; pageTab.dataset.pageTab = name;
    pageTab.innerHTML = '<span class="tab-icon">' + pageIcons[name] + '</span> ' + pageTitles[name] + ' <span class="tab-close">×</span>';
    tabbar.insertBefore(pageTab, tabbar.querySelector('.tabbar-spacer'));
    pageTab.querySelector('.tab-close').addEventListener('click', function(e){ e.stopPropagation(); pageTab.remove(); });
    pageTab.addEventListener('click', function(e){ if (!e.target.classList.contains('tab-close')) { makeTabActive(pageTab); loadPage(name); } });
  }
  makeTabActive(pageTab);
  leftPaneTitle.textContent = pageTitles[name];
  rightPaneTitle.textContent = pageTitles[name];
  var leftFn = leftPanels[name];
  leftPaneBody.innerHTML = leftFn ? leftFn() : '';
  var rightFn = rightPanels[name];
  rightPaneBody.innerHTML = rightFn ? rightFn() : '<div class="page-body"><div style="color:var(--text-faint)">Página no encontrada</div></div>';
  if (name === 'datos' || name === 'trabajo') rightPaneBody.classList.add('flush');
  else rightPaneBody.classList.remove('flush');

  if (name === 'datos') { setTimeout(initDatosPage, 60); }
  if (name === 'trabajo') { initTrabajoKeyboard(); setTimeout(renderLimitsPanel, 30); }
  if (name === 'visualizacion') { setTimeout(initVizPage, 60); }
  if (name === 'reportes') { setTimeout(function(){ if (typeof ReporteManager !== 'undefined') ReporteManager.buildReportesView(); }, 60); }
  if (name === 'auditoria') { setTimeout(function() {
    if (!_auditoriaInited && typeof AuditoriaManager !== 'undefined') { AuditoriaManager.init(API_URL); _auditoriaInited = true; }
    if (typeof AuditoriaManager !== 'undefined') AuditoriaManager.buildView();
  }, 60); }
  if (name === 'usuarios') { setTimeout(function() {
    if (!_usuariosInited && typeof UsuariosManager !== 'undefined') { UsuariosManager.init(API_URL); _usuariosInited = true; }
    if (typeof UsuariosManager !== 'undefined') UsuariosManager.buildView();
  }, 60); }
  if (name === 'firmarReporte') { setTimeout(initFirmarReportePage, 60); }
  updateToolsMenuState();
}

function updateToolsMenuState() {
  setTimeout(function() {
    var isTrabajo = currentPage === 'trabajo';
    var items = document.querySelectorAll('.menu-item[data-menu="Tools"] .dd-item[data-action]');
    items.forEach(function(item) {
      if (isTrabajo) {
        item.classList.remove('disabled');
      } else {
        item.classList.add('disabled');
      }
    });
  }, 10);
}

document.querySelectorAll('.nav-item[data-page]').forEach(function(item){
  item.addEventListener('click', function(){ loadPage(item.dataset.page); });
});

// Sync sidebar nav icons from pageIcons map
document.querySelectorAll('.nav-item[data-page] .nav-icon').forEach(function(el){
  var page = el.closest('.nav-item').dataset.page;
  if (page && pageIcons[page]) el.textContent = pageIcons[page];
});

// ── Dropdown toggle for sidebar toolbar ──
function toggleDropdown(btn) {
  var menu = btn.nextElementSibling;
  if (!menu || !menu.classList.contains('dd-menu')) return;
  var isOpen = menu.classList.contains('open');
  // Close all other dropdowns
  document.querySelectorAll('.tb-dropdown .dd-menu.open').forEach(function(m){ m.classList.remove('open'); });
  if (!isOpen) menu.classList.add('open');
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.tb-dropdown')) {
    document.querySelectorAll('.tb-dropdown .dd-menu.open').forEach(function(m){ m.classList.remove('open'); });
  }
});

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
  t.textContent = msg; t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2000);
}

function nuevoProyecto() {
  if (!confirm('¿Crear un nuevo proyecto? Se perderán los datos actuales.')) return;
  if (typeof StateManager !== 'undefined') StateManager.resetState();
  localStorage.removeItem('statAnalyzerState');
  localStorage.removeItem('_recentFiles');
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
  if (chart.options.animation !== false) {
    chart.options.animation = false;
    chart.update();
  }
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
    var maxRatio = 1.6;
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
  if (sizeLabel) sizeLabel.style.display = isBubble ? 'inline' : 'none';
  if (sizeSelect) sizeSelect.style.display = isBubble ? 'inline-block' : 'none';
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
  return '<div class="info-item"><div class="info-item-label">Filas</div><div class="info-item-value">' + rows + '</div></div>' +
    '<div class="info-item"><div class="info-item-label">Columnas</div><div class="info-item-value">' + cols + '</div></div>' +
    '<div class="info-item"><div class="info-item-label">Celdas vacías</div><div class="info-item-value">' + empty + '</div></div>';
}
function getTrabajoCeldaActivaHTML() {
  var colLetter = String.fromCharCode(65 + trabajoActiveCell.col);
  var sheet = getCurrentSheet();
  var val = (sheet && sheet.rows[trabajoActiveCell.row]) ? (sheet.rows[trabajoActiveCell.row][trabajoActiveCell.col] || '') : '';
  return '<div class="info-item"><div class="info-item-label">Referencia</div><div class="info-item-value" style="font-family:monospace">' + colLetter + (trabajoActiveCell.row+1) + '</div></div>' +
    '<div class="info-item"><div class="info-item-label">Valor</div><div class="info-item-value" style="font-family:monospace;word-break:break-all">' + escapeHtml(String(val)) + '</div></div>';
}

// ── Límites (especificaciones) ──
function toggleLimitsMode() {
  saveLimitsFromInputs();
  trabajoLimitsMode = document.getElementById('limitsGlobalToggle').checked ? 'global' : 'independent';
  renderLimitsPanel();
  _persistAllData();
}

function renderLimitsPanel() {
  var body = document.getElementById('trabajoLimitsBody');
  if (!body) return;
  var sheet = getCurrentSheet();
  if (!sheet || !sheet.headers || sheet.headers.length === 0) {
    body.innerHTML = '<div class="info-item" style="color:var(--text-faint);font-size:10px">Carga datos para definir límites</div>';
    return;
  }
  if (!trabajoLimits) {
    trabajoLimits = { global: { ls: '', li: '', lc: '' }, cols: {} };
    sheet.headers.forEach(function(h){ trabajoLimits.cols[h] = { ls: '', li: '', lc: '' }; });
  }
  // Ensure all current columns exist in limits
  sheet.headers.forEach(function(h){ if (!trabajoLimits.cols[h]) trabajoLimits.cols[h] = { ls: '', li: '', lc: '' }; });
  var html = '';
  if (trabajoLimitsMode === 'global') {
    var g = trabajoLimits.global || { ls: '', li: '', lc: '' };
    html += '<div class="info-item" style="font-size:10px;color:var(--text-muted)"></div>' +
      '<div class="info-item"><div class="info-item-label">LS</div><div class="info-item-value"><input type="number" step="any" id="limitGlobalLS" value="' + g.ls + '" style="width:170px;padding:7px 6px;border:1px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:11px"></div></div>' +
      '<div class="info-item"><div class="info-item-label">LI</div><div class="info-item-value"><input type="number" step="any" id="limitGlobalLI" value="' + g.li + '" style="width:170px;padding:7px 6px;border:1px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:11px"></div></div>' +
      '<div class="info-item"><div class="info-item-label">LC</div><div class="info-item-value"><input type="number" step="any" id="limitGlobalLC" value="' + g.lc + '" style="width:170px;padding:7px 6px;border:1px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:11px"></div></div>';
  } else {
    sheet.headers.forEach(function(h, i){
      var col = trabajoLimits.cols[h] || { ls: '', li: '', lc: '' };
      html += '<div class="info-item" style="flex-direction:column;align-items:stretch;gap:3px;padding:4px 0;border-bottom:1px solid var(--border)">' +
        '<div class="info-item-label" style="font-size:10px;margin-bottom:2px">' + escapeHtml(h) + '</div>' +
        '<div style="display:flex;gap:4px">' +
          '<input type="number" step="any" placeholder="LS" id="limitLS_' + i + '" value="' + col.ls + '" style="flex:1;min-width:0;padding:3px 4px;border:1px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:11px">' +
          '<input type="number" step="any" placeholder="LI" id="limitLI_' + i + '" value="' + col.li + '" style="flex:1;min-width:0;padding:3px 4px;border:1px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:11px">' +
          '<input type="number" step="any" placeholder="LC" id="limitLC_' + i + '" value="' + col.lc + '" style="flex:1;min-width:0;padding:3px 4px;border:1px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:11px">' +
        '</div></div>';
    });
  }
  html += '<div style="padding:4px 0"><button class="btn btn-secondary" style="width:100%;font-size:12px;padding:4px;justify-content:center" onclick="saveLimitsFromInputs();showToast(\'✅ Límites guardados\')">💾 Guardar límites</button></div>';
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
  if (trabajoSheets.find(function(s){ return s.name === name; })) { alert('Ya existe una hoja con ese nombre.'); return; }
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
  if (trabajoSheets.length <= 1) { alert('No se puede eliminar la única hoja.'); return; }
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
  var sheet = getCurrentSheet(); if (!sheet) return;
  pushUndo();
  sheet.rows = Array.from({length: sheet.rows.length}, function(_, i) {
    return sheet.headers.map(function(h, j) {
      if (j === sheet.headers.length - 1) return Math.random() > 0.2 ? 'OK' : 'Revisión';
      return (Math.random() * 100).toFixed(1);
    });
  });
  _persistAllData();
  loadPage('trabajo');
}

// ── Generar datos con distribución normal ──
function generarDatosNormales() {
  var existing = document.getElementById('gaussModal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'gaussModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  modal.onclick = function(){ modal.remove(); };
  modal.innerHTML = '<div style="background:var(--bg-panel);border-radius:14px;padding:24px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.5);color:var(--text-primary)" onclick="event.stopPropagation()">' +
    '<h2 style="margin:0 0 16px;font-size:1.1rem">🔢 Generar datos normales</h2>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;font-size:0.85rem">' +
    '<label style="color:var(--text-muted)">Media (μ)</label><input id="gaussMean" type="number" value="50" step="any" style="padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem">' +
    '<label style="color:var(--text-muted)">Desviación (σ)</label><input id="gaussStd" type="number" value="10" step="any" min="0.1" style="padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem">' +
    '<label style="color:var(--text-muted)">Muestra (n)</label><input id="gaussN" type="number" value="100" min="10" max="10000" style="padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem">' +
    '<label style="color:var(--text-muted)">Columnas</label><input id="gaussCols" type="number" value="2" min="1" max="20" style="padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem">' +
    '</div>' +
    '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end">' +
    '<button class="btn btn-secondary" onclick="this.closest(\'#gaussModal\').remove()">Cancelar</button>' +
    '<button class="btn btn-primary" id="gaussBtn">Generar</button></div></div>';
  document.body.appendChild(modal);
  document.getElementById('gaussBtn').addEventListener('click', function() {
    var mean = parseFloat(document.getElementById('gaussMean').value) || 50;
    var std = Math.max(0.1, parseFloat(document.getElementById('gaussStd').value) || 10);
    var n = Math.min(10000, Math.max(10, parseInt(document.getElementById('gaussN').value) || 100));
    var k = Math.min(20, Math.max(1, parseInt(document.getElementById('gaussCols').value) || 2));
    var headers = [];
    for (var i = 0; i < k; i++) headers.push('Variable' + (i + 1));
    var rows = [];
    for (var r = 0; r < n; r++) {
      var row = [];
      for (var c = 0; c < k; c++) {
        // Box-Muller transform for Gaussian distribution
        var u1 = Math.random();
        var u2 = Math.random();
        var z = Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
        row.push((mean + std * z).toFixed(2));
      }
      rows.push(row);
    }
    pushUndo();
    trabajoSheets.push({ name: 'Normal_' + n + 'x' + k, headers: headers, rows: rows });
    trabajoActiveSheetIndex = trabajoSheets.length - 1;
    trabajoActiveCell = {row:0,col:0};
    _persistAllData();
    modal.remove();
    loadPage('trabajo');
    showToast('✅ Datos normales generados: ' + n + ' filas x ' + k + ' columnas');
  });
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
  trabajoLimitsMode = 'global';
  updateDatosUI();
  _persistAllData();
  loadPage('trabajo');
  showToast('🧹 Dataset limpiado');
}

// ── Generar dataset de ejemplo para estadística ──
function generarEjemploEstadistico() {
  var n = 60;
  var headers = ['ID', 'Edad', 'Horas_Estudio', 'Puntaje_Examen', 'Metodo', 'Satisfaccion', 'Ingreso_Mensual'];
  var metodos = ['Tradicional', 'Nuevo', 'Mixto'];
  var rows = [];
  for (var i = 0; i < n; i++) {
    var metodo = metodos[i % 3];
    var edad = 18 + Math.round(Math.random() * 44);
    var u1 = Math.random(), u2 = Math.random();
    var zHoras = Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
    var horasBase = metodo === 'Tradicional' ? 10 : metodo === 'Nuevo' ? 24 : 17;
    var horas = Math.max(2, Math.min(40, Math.round(horasBase + zHoras * 6)));
    var u3 = Math.random(), u4 = Math.random();
    var zScore = Math.sqrt(-2 * Math.log(u3 || 0.0001)) * Math.cos(2 * Math.PI * u4);
    var metodoBonus = metodo === 'Nuevo' ? 6 : metodo === 'Mixto' ? 2 : -4;
    var score = Math.round(Math.max(0, Math.min(100, 32 + 1.4 * horas + metodoBonus + zScore * 7)));
    var sat = Math.round(Math.max(1, Math.min(10, 2 + score * 0.08 + (Math.random() - 0.5) * 2.5)));
    var ingreso = Math.round((12 + edad * 0.45 + (Math.random() - 0.5) * 9) * 10) / 10;
    rows.push([(i + 1).toString(), edad.toString(), horas.toString(), score.toString(), metodo, sat.toString(), ingreso.toString()]);
  }
  pushUndo();
  trabajoSheets.push({ name: 'Ejemplo_Estadistico', headers: headers, rows: rows });
  trabajoActiveSheetIndex = trabajoSheets.length - 1;
  trabajoActiveCell = { row: 0, col: 0 };
  _persistAllData();
  loadPage('trabajo');
  showToast('✅ Dataset de ejemplo generado: ' + n + ' filas x ' + headers.length + ' columnas');
}

function exportTrabajo() {
  var sheet = getCurrentSheet(); if (!sheet) { alert('No hay datos.'); return; }
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
      focusCell(r, e.shiftKey ? Math.max(0,c-1) : (c < maxCol ? c+1 : (r < maxRow ? (trabajoActiveCell = {row:r+1,col:0}, 0) : c)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (document.getElementById('autocompleteList').style.display !== 'none') { hideAutocomplete(); }
      if (e.shiftKey) focusCell(Math.max(0,r-1), c);
      else focusCell(Math.min(maxRow,r+1), c);
    } else if (e.key === 'Escape') { inner.blur(); hideAutocomplete(); }
    else if (e.key === 'ArrowDown' && !e.shiftKey) { e.preventDefault(); focusCell(Math.min(maxRow,r+1), c); }
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
document.addEventListener('click', function(e) { if (!e.target.closest('#autocompleteList') && !e.target.classList.contains('excel-cell-inner')) hideAutocomplete(); });

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
  var ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'csv') parseCSV(file);
  else if (ext === 'json') parseJSON(file);
  else if (ext === 'xlsx' || ext === 'xls') parseXLSX(file);
  else alert('Formato no soportado. Usa CSV, JSON o Excel (.xlsx).');
}

function parseCSV(file) {
  Papa.parse(file, {
    complete: function(results) {
      var data = results.data;
      if (!data || data.length === 0) { alert('El archivo está vacío'); return; }
      var headers = data[0];
      var rows = data.slice(1).filter(function(r){ return r.some(function(c){ return c && c.trim(); }); });
      finishLoad(headers, rows, file.name, file.size);
    },
    error: function(err){ alert('Error CSV: ' + err.message); },
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
      if (!headers.length) { alert('JSON inválido o vacío'); return; }
      finishLoad(headers, rows, file.name, file.size);
    } catch(err) { alert('Error JSON: ' + err.message); }
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
        if (!jsonData.length) { alert('El archivo está vacío'); return; }
        var headers = jsonData[0].map(function(h){ return String(h || ''); });
        var rows = jsonData.slice(1).filter(function(r){ return r.some(function(c){ return c !== ''; }); })
          .map(function(r){ return headers.map(function(_,i){ return r[i] == null ? '' : String(r[i]); }); });
        finishLoad(headers, rows, file.name, file.size);
      } else {
        alert('Para archivos Excel, instala la librería SheetJS. Por ahora usa CSV.');
      }
    } catch(err) { alert('Error Excel: ' + err.message); }
  };
  reader.readAsArrayBuffer(file);
}

function finishLoad(headers, rows, filename, size) {
  datosFilters = []; datosSortCol = -1; datosSortAsc = true; datosPage = 0;
  datosCurrentData = { headers: headers, rows: rows, colTypes: detectColTypes(headers, rows) };
  datosCurrentFileName = filename;
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
    if (!text.trim()) { alert('No hay datos'); return; }
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
  if (!datosCurrentData) { alert('Carga un dataset primero.'); return; }
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
  if (!datosCurrentData) { alert('No hay datos para exportar.'); return; }
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
    if (!selCols.length) { alert('Selecciona al menos una columna.'); return; }
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
    alert('Datos no disponibles en memoria. Vuelve a importar el archivo.');
  }
}

function sendToTrabajo() {
  if (!datosCurrentData) { alert('No hay datos para enviar. Importa un archivo primero.'); return; }
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

// ════════════════════════════════════════════════════════════════
// ANALYSIS PAGE - DYNAMIC TESTS
// ════════════════════════════════════════════════════════════════

function getAnalisisTestsHTML() {
  var testCategories = {
    descriptiva: [
      {id: 'media', name: '📐 Media Aritmética'},
      {id: 'mediana', name: '📊 Mediana'},
      {id: 'moda', name: '🎯 Moda'},
      {id: 'varianza', name: '📈 Varianza'},
      {id: 'desv', name: '📉 Desv. Estándar'},
      {id: 'cv', name: '📊 Coef. Variación'},
      {id: 'asimetria', name: '📐 Asimetría'},
      {id: 'kurtosis', name: '🔔 Curtosis'}
    ],
    hipotesis: [
      {id: 'ttest', name: '⚖️ t-Test'},
      {id: 'ztest', name: '📐 z-Test'},
      {id: 'ftest', name: '📊 F-Test'},
      {id: 'chisquare', name: '📐 Chi-cuadrado'},
      {id: 'shapiro', name: '🔔 Shapiro-Wilk'}
    ],
    correlacion: [
      {id: 'pearson', name: '🔗 Pearson'},
      {id: 'spearman', name: '📈 Spearman'},
      {id: 'kendall', name: '📊 Kendall'}
    ],
    regresion: [
      {id: 'lineal', name: '📈 Lineal Simple'},
      {id: 'multiple', name: '📊 Regresión Múltiple'},
      {id: 'logistica', name: '📦 Regresión Logística'}
    ],
    noParametricos: [
      {id: 'mann', name: '📉 Mann-Whitney'},
      {id: 'wilcoxon', name: '📊 Wilcoxon'},
      {id: 'kruskal', name: '📦 Kruskal-Wallis'}
    ],
    multivariado: [
      {id: 'pca', name: '📊 PCA'},
      {id: 'cluster', name: '📈 Cluster K-Means'},
      {id: 'lda', name: '📐 LDA'}
    ]
  };
  
  var tests = testCategories[analisisSelectedCategory] || testCategories.descriptiva;
  var html = '';
  tests.forEach(function(t) {
    var isActive = analisisSelectedTest === t.id ? ' active' : '';
    // SIN onclick — solo refleja la selección del menú superior
    html += '<div class="info-item' + isActive + '" style="cursor:default;opacity:' + (isActive ? '1' : '0.7') + '">' + t.name + '</div>';
  });
  return html;
}

function selectAnalisisTest(testId) {
  analisisSelectedTest = testId;
  analisisResultContent = null;
  loadPage('analisis');
  runSingleStat(testId);
}

function updateAnalisisLastResult(result) {
  analisisLastResult = result;
  var testEl = document.getElementById('analisisLastTest');
  var pValEl = document.getElementById('analisisLastPVal');
  var decEl = document.getElementById('analisisLastDecision');
  if (testEl) testEl.textContent = result.testName || '—';
  if (pValEl) pValEl.textContent = result.pValue != null ? result.pValue.toFixed(4) : '—';
  if (decEl) {
    var decision = result.significativo ? 'Rechazar H₀' : 'No rechazar H₀';
    decEl.textContent = decision;
    decEl.style.color = result.significativo ? 'var(--accent)' : 'var(--text-faint)';
  }
}

// ── Helpers para cards de estadísticos ──
function getSidebarSelectedTests() {
  var tests = [];
  document.querySelectorAll('.child-check:checked').forEach(function(chk) {
    if (chk.dataset.nombre) tests.push(chk.dataset.nombre);
  });
  return tests;
}

function getSectionDisplayName(key) {
  var names = {
    descriptiva: '📊 Descriptiva', hipotesis: '⚖️ Hipótesis',
    correlacion: '🔗 Correlación', regresion: '📈 Regresión',
    noParametricos: '📉 No Paramétricos', multivariado: '📦 Multivariado',
    extras: '✨ Extras', especificacion: '📐 Especificación', calidad: '⚙️ Calidad'
  };
  return names[key] || key;
}

function buildStatCardsHTML(testNames) {
  var cardsHtml = testNames.map(function(nombre) {
    var cfg = getEstadisticoConfig(nombre);
    if (!cfg) return '';
    var icono = cfg.icono || '📊';
    var meta = typeof getStatMetaConfig === 'function' ? (getStatMetaConfig()[nombre] || {}) : {};
    var formula = meta.formula || cfg.formula || '—';
    var desc = cfg.desc || '—';
    var sectionName = getSectionDisplayName(cfg.seccion || '');
    var inputs = cfg.inputs || {};
    var supuestos = meta.supuestos || cfg.supuestos || [];
    var ref = meta.referencia || cfg.referencia || null;

    var refStr = '—';
    if (ref) {
      var r = Array.isArray(ref) ? ref[0] : ref;
      var autor = r.autores || '';
      if (autor.length > 40) autor = autor.split(',')[0] + ' et al.';
      refStr = autor + (r.anio ? ' (' + r.anio + ')' : '');
    }

    var supHtml = supuestos.length > 0
      ? '<div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border)"><div class="sc-label">Supuestos</div>' +
        supuestos.map(function(s) { return '<div class="sc-item">· ' + escapeHtml(s) + '</div>'; }).join('') + '</div>'
      : '';

    return '<div class="stat-card">' +
      '<div class="sc-header">' +
        '<span class="sc-icon">' + icono + '</span>' +
        '<div class="sc-title-group">' +
          '<div class="sc-title">' + escapeHtml(nombre) + '</div>' +
          '<div class="sc-section">' + escapeHtml(sectionName) + '</div>' +
        '</div>' +
        '<span class="sc-run" onclick="runSingleStat(\'' + nombre.replace(/'/g, "\\'") + '\')" title="Ejecutar ' + escapeHtml(nombre) + '">▶</span>' +
        '<span class="sc-close" onclick="deselectStatCard(\'' + nombre.replace(/'/g, "\\'") + '\')" title="Deseleccionar ' + escapeHtml(nombre) + '">✕</span>' +
      '</div>' +
      '<div class="sc-formula">' + escapeHtml(formula) + '</div>' +
      '<div class="sc-desc">' + escapeHtml(desc) + '</div>' +
      '<div class="sc-meta">' +
        '<span>🎯 <strong>Inputs:</strong> ' + escapeHtml(inputs.tipo || '—') + '</span>' +
        '<span>👥 <strong>Grupos:</strong> ' + (inputs.grupos || '—') + '</span>' +
        '<span>📏 <strong>Mín:</strong> ' + cfg.minMuestra + '</span>' +
      '</div>' +
      supHtml +
      '<div class="sc-ref">📖 ' + escapeHtml(refStr) + '</div>' +
    '</div>';
  }).join('');

  return '<div class="page-body">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
      '<span style="font-size:14px;font-weight:600;color:var(--text-primary)">📋 Tests seleccionados</span>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        '<span style="font-size:11px;color:var(--text-faint)">' + testNames.length + ' tests</span>' +
        '<button class="sc-run-all" onclick="runBatchAnalysis()">▶ Ejecutar seleccionados</button>' +
      '</div>' +
    '</div>' +
    '<div class="stat-cards-grid">' + cardsHtml + '</div>' +
  '</div>';
}

function toggleAcordeon(btn) {
  var item = btn.closest('.acordeon-item');
  if (item) item.classList.toggle('abierto');
}

function deselectStatCard(nombre) {
  var chk = document.querySelector('.child-check[data-nombre="' + nombre.replace(/"/g, '&quot;') + '"]');
  if (!chk) return;
  var seccionKey = chk.dataset.seccion;
  chk.checked = false;
  updateParentCheck(seccionKey);
  updateBadge(seccionKey);
  if (analisisSelectedTest === nombre) analisisSelectedTest = null;
  if (currentPage === 'analisis') {
    leftPaneBody.innerHTML = leftPanels.analisis();
    rightPaneBody.innerHTML = rightPanels.analisis();
  }
}

function getDataForEjecutarAnalisis() {
  var sheet = getCurrentSheet();
  if (!sheet || !sheet.rows || sheet.rows.length === 0) return null;
  var mapped = sheet.rows.map(function(row) {
    var obj = {};
    sheet.headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });
  return { headers: sheet.headers, data: mapped, rowCount: mapped.length };
}

function _detectColTypes(headers, data) {
  var catCols = [], numCols = [];
  headers.forEach(function(h) {
    var n = 0, t = 0;
    for (var i = 0; i < Math.min(data.length, 50); i++) {
      var v = data[i][h];
      if (v !== '' && v != null) { t++; if (!isNaN(parseFloat(v))) n++; }
    }
    if (t > 0 && n / t >= 0.8) numCols.push(h);
    else catCols.push(h);
  });
  return { catCols: catCols, numCols: numCols };
}

function _mostrarModalConfigTest(nombre, callback) {
  var cfg = getEstadisticoConfig(nombre);
  if (!cfg || !HYPOTHESIS_SET.has(nombre)) { callback(); return; }
  var data = getDataForEjecutarAnalisis();
  if (!data) { callback(); return; }
  var tipos = _detectColTypes(data.headers, data.data);
  if (tipos.numCols.length === 0) { showToast('⚠️ No hay columnas numéricas disponibles'); callback(); return; }
  var t = cfg.inputs && cfg.inputs.tipo;
  var necesitaCat = t === 'tabla-contingencia' || t === 'dos-columnas';
  var necesitaDosNumericas = false;
  if (t === 'dos-columnas' && (cfg.seccion === 'correlacion' || cfg.seccion === 'regresion')) {
    necesitaCat = false;
    necesitaDosNumericas = true;
  }
  if (necesitaCat && tipos.catCols.length === 0) { showToast('⚠️ No hay columnas categóricas disponibles'); callback(); return; }
  if (necesitaDosNumericas && tipos.numCols.length < 2) { showToast('⚠️ Se necesitan al menos 2 columnas numéricas'); callback(); return; }
  var optsN = tipos.numCols.map(function(c) { return '<option value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</option>'; }).join('');
  var optsC = tipos.catCols.length ? tipos.catCols.map(function(c) { return '<option value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</option>'; }).join('') : '';
  var modal = document.createElement('div'); modal.className = 'modal-overlay';
  modal.innerHTML =
    '<div class="modal-box" style="max-width:480px">' +
      '<div class="modal-title">⚙️ Configurar: ' + escapeHtml(nombre) + '</div>' +
      '<div style="font-size:11px;color:var(--text-faint)">Selecciona las columnas para este análisis</div>' +
      (necesitaDosNumericas
        ? '<div style="display:flex;flex-direction:column;gap:6px">' +
            '<div><label style="font-size:11px;color:var(--text-primary)">Columna X (predictor/variable 1)</label><select id="cfgColX" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
            '<div><label style="font-size:11px;color:var(--text-primary)">Columna Y (respuesta/variable 2)</label><select id="cfgColY" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
          '</div>'
        : necesitaCat
          ? '<div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;color:var(--text-primary)">Columna de agrupación (categórica)</label><select id="cfgColCat" class="btn" style="width:100%;text-align:left">' + optsC + '</select></div>'
          : '') +
      (!necesitaDosNumericas
        ? '<div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;color:var(--text-primary)">Columna de valores (numérica)</label><select id="cfgColNum" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>'
        : '') +
      '<div class="modal-actions">' +
        '<button class="btn btn-secondary" id="cfgCancel">Cancelar</button>' +
        '<button class="btn btn-primary" id="cfgConfirm">Confirmar</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);
  document.getElementById('cfgCancel').addEventListener('click', function() { modal.remove(); });
  document.getElementById('cfgConfirm').addEventListener('click', function() {
    var config = {};
    if (necesitaDosNumericas) {
      config.columnaX = document.getElementById('cfgColX').value;
      config.columnaY = document.getElementById('cfgColY').value;
    } else if (necesitaCat) {
      config.categoricalCols = [document.getElementById('cfgColCat').value];
      config.numericCol = document.getElementById('cfgColNum').value;
    } else {
      config.numericCol = document.getElementById('cfgColNum').value;
    }
    StateManager.setHypothesisConfig(nombre, config);
    modal.remove();
    callback();
  });
}

function runSingleStat(nombre) {
  var data = getDataForEjecutarAnalisis();
  if (!data) { showToast('⚠️ No hay datos en la hoja de trabajo'); return; }

  var cfg = getEstadisticoConfig(nombre);
  if (!cfg) { showToast('⚠️ Estadístico no encontrado: ' + nombre); return; }

  var numericCols = [];
  for (var j = 0; j < data.headers.length; j++) {
    var numCount = 0, total = 0;
    for (var i = 0; i < Math.min(data.data.length, 20); i++) {
      var val = data.data[i][data.headers[j]];
      if (val !== '' && val != null) {
        total++;
        if (!isNaN(parseFloat(val))) numCount++;
      }
    }
    if (total > 0 && numCount / total >= 0.8) {
      numericCols.push(data.headers[j]);
    }
  }

  var values = [];
  if (numericCols.length > 0) {
    data.data.forEach(function(row) {
      var v = parseFloat(row[numericCols[0]]);
      if (!isNaN(v) && isFinite(v)) values.push(v);
    });
  }
  if (values.length < cfg.minMuestra) {
    showToast('⚠️ ' + nombre + ' requiere al menos ' + cfg.minMuestra + ' observaciones');
    return;
  }
  if (cfg.requiereDosColumnas && numericCols.length < 2) {
    showToast('⚠️ ' + nombre + ' requiere al menos 2 columnas numéricas');
    return;
  }

  if (HYPOTHESIS_SET.has(nombre) && !StateManager.getHypothesisConfig(nombre)) {
    _mostrarModalConfigTest(nombre, function() {
      if (!StateManager.getHypothesisConfig(nombre)) {
        showToast('⚠️ Error al guardar configuración para ' + nombre);
        return;
      }
      runSingleStat(nombre);
    });
    return;
  }

  analisisSelectedTest = nombre;
  analisisResultContent = null;
  rightPaneBody.innerHTML = rightPanels.analisis();

  try {
    var hc = {};
    var saved = StateManager.getHypothesisConfig(nombre);
    if (saved) hc[nombre] = saved;
    var resultados = EstadisticaDescriptiva.ejecutarAnalisis(data, [nombre], hc);
    var html = EstadisticaDescriptiva.generarHTML(resultados);
    analisisResultContent = html;
    window.ultimosResultados = resultados;

    var resultInfo = { testName: nombre, pValue: null, significativo: false };
    var resObj = resultados.resultados[nombre];
    if (resObj && typeof resObj === 'object') {
      var firstKey = Object.keys(resObj)[0];
      if (resObj[firstKey] && typeof resObj[firstKey] === 'object') {
        var r = resObj[firstKey];
        if (r.valorP !== undefined) resultInfo.pValue = r.valorP;
        else if (r.p !== undefined) resultInfo.pValue = r.p;
        resultInfo.significativo = r.significativo || (resultInfo.pValue !== null && resultInfo.pValue < 0.05);
      }
    }
    updateAnalisisLastResult(resultInfo);
  } catch(e) {
    console.error('Error executing ' + nombre + ':', e);
    analisisResultContent = '<div class="page-card"><div class="page-card-body" style="padding:20px;color:#f87171"><strong>Error:</strong> ' + escapeHtml(e.message) + '</div></div>';
  }

  rightPaneBody.innerHTML = rightPanels.analisis();
}

function runBatchAnalysis() {
  var data = getDataForEjecutarAnalisis();
  if (!data) { showToast('⚠️ No hay datos en la hoja de trabajo'); return; }

  var selected = getSidebarSelectedTests();
  if (selected.length === 0) { showToast('⚠️ Selecciona al menos un test'); return; }

  var numericCols = [];
  for (var j = 0; j < data.headers.length; j++) {
    var numCount = 0, total = 0;
    for (var i = 0; i < Math.min(data.data.length, 20); i++) {
      var val = data.data[i][data.headers[j]];
      if (val !== '' && val != null) {
        total++;
        if (!isNaN(parseFloat(val))) numCount++;
      }
    }
    if (total > 0 && numCount / total >= 0.8) {
      numericCols.push(data.headers[j]);
    }
  }
  if (numericCols.length === 0) {
    showToast('⚠️ No se encontraron columnas numéricas en la hoja de trabajo');
    return;
  }

  analisisResultContent = null;
  rightPaneBody.innerHTML = rightPanels.analisis();

  try {
    var hc = StateManager.getAllHypothesisConfig();
    var resultados = EstadisticaDescriptiva.ejecutarAnalisis(data, selected, hc);
    var html = EstadisticaDescriptiva.generarHTML(resultados);
    analisisResultContent = html;
    analisisSelectedTest = selected.join(', ');
    window.ultimosResultados = resultados;
    updateAnalisisLastResult({ testName: selected.length + ' tests', pValue: null, significativo: false });
  } catch(e) {
    console.error('Error in batch analysis:', e);
    analisisResultContent = '<div class="page-card"><div class="page-card-body" style="padding:20px;color:#f87171"><strong>Error:</strong> ' + escapeHtml(e.message) + '</div></div>';
  }

  rightPaneBody.innerHTML = rightPanels.analisis();
}

// ── Utility ──
function escapeHtml(text) {
  var d = document.createElement('div'); d.textContent = String(text == null ? '' : text); return d.innerHTML;
}

function buildStatAnalysisMenu() {
  if (typeof getSeccionesSidebar === 'undefined') return;
  var dropdown = document.getElementById('statAnalysisDropdown');
  if (!dropdown) return;

  var secciones = getSeccionesSidebar();
  var html = '';
  var isFirst = true;

  Object.entries(secciones).forEach(function([seccionKey, seccion]) {
    if (!isFirst) html += '<div class="dd-separator"></div>';
    isFirst = false;

    html += '<div class="submenu-wrapper" data-seccion="' + seccionKey + '" '
      + 'onmousedown="event.stopPropagation()">';

    // ── Item padre con checkbox ──
    html += '<div class="dd-item has-submenu" '
          + 'style="display:flex;align-items:center;gap:6px" '
          + 'onmousedown="event.stopPropagation()">'
          + '<span style="flex:1;display:flex;align-items:center;gap:6px">'
          + seccion.icon + ' ' + seccion.label
          + '<span class="stat-selected-badge" id="badge-' + seccionKey + '">0</span>'
          + '</span>'
          + '<input type="checkbox" class="stat-check parent-check" '
          + 'id="chk-parent-' + seccionKey + '" '
          + 'data-seccion="' + seccionKey + '" '
          + 'onclick="onParentCheck(event,\'' + seccionKey + '\')">'
          + '<span class="dd-arrow">▶</span>'
          + '</div>';

    // ── Subitems con checkbox ──
    html += '<div class="submenu">';
    seccion.options.forEach(function(nombre) {
      var cfg = getEstadisticoConfig(nombre);
      var icono = cfg && cfg.icono ? cfg.icono : '📊';
      var id = 'chk-' + seccionKey + '-' + nombre.replace(/[^a-zA-Z0-9]/g, '_');
      var nombreEsc = nombre.replace(/'/g, "\\'");

      html += '<div class="dd-item" style="display:flex;align-items:center;gap:6px" '
            + 'onmousedown="event.stopPropagation()" '
            + 'onclick="onSubitemClick(event,\'' + nombreEsc + '\',\'' + seccionKey + '\')">'
            + '<span style="flex:1">' + icono + ' ' + nombre + '</span>'
            + '<input type="checkbox" class="stat-check child-check" '
            + 'id="' + id + '" '
            + 'data-nombre="' + nombre.replace(/"/g, '&quot;') + '" '
            + 'data-seccion="' + seccionKey + '" '
            + 'onclick="onChildCheck(event,\'' + seccionKey + '\')">'
            + '</div>';
    });
    html += '</div>'; // .submenu
    html += '</div>'; // .submenu-wrapper
  });

  dropdown.innerHTML = html;
}

// ── Click en checkbox hijo ──
function onChildCheck(event, seccionKey) {
  event.stopPropagation();
  var chk = event.target;
  var justChecked = chk.checked;
  var nombre = chk.dataset.nombre;
  analisisResultContent = null;
  updateParentCheck(seccionKey);
  updateBadge(seccionKey);
  if (currentPage === 'analisis') {
    rightPaneBody.innerHTML = rightPanels.analisis();
  }
  if (justChecked && HYPOTHESIS_SET.has(nombre) && !StateManager.getHypothesisConfig(nombre)) {
    _mostrarModalConfigTest(nombre, function() {});
  }
}

function onParentCheck(event, seccionKey) {
  event.stopPropagation();
  var parentChk = document.getElementById('chk-parent-' + seccionKey);
  var checked = parentChk.checked;
  document.querySelectorAll('.child-check[data-seccion="' + seccionKey + '"]')
    .forEach(function(chk) { chk.checked = checked; });
  parentChk.classList.remove('partial');
  updateBadge(seccionKey);

  analisisSelectedCategory = seccionKey;
  analisisResultContent = null;

  if (currentPage === 'analisis') {
    leftPaneBody.innerHTML = leftPanels.analisis();
    rightPaneBody.innerHTML = rightPanels.analisis();
  }

  if (checked) {
    var needConfig = [];
    document.querySelectorAll('.child-check[data-seccion="' + seccionKey + '"]').forEach(function(chk) {
      var n = chk.dataset.nombre;
      if (HYPOTHESIS_SET.has(n) && !StateManager.getHypothesisConfig(n)) {
        needConfig.push(n);
      }
    });
    if (needConfig.length > 0) {
      _showModalSequence(needConfig, 0);
    }
  }
}

function _showModalSequence(tests, index) {
  if (index >= tests.length) return;
  _mostrarModalConfigTest(tests[index], function() {
    _showModalSequence(tests, index + 1);
  });
}

// ── Actualizar estado del padre según hijos ──
function updateParentCheck(seccionKey) {
  var parentChk = document.getElementById('chk-parent-' + seccionKey);
  if (!parentChk) return;
  var children = document.querySelectorAll(
    '.child-check[data-seccion="' + seccionKey + '"]'
  );
  var total    = children.length;
  var checked  = Array.from(children).filter(function(c){ return c.checked; }).length;

  parentChk.classList.remove('partial');
  if (checked === 0) {
    parentChk.checked = false;
  } else if (checked === total) {
    parentChk.checked = true;
  } else {
    parentChk.checked = false;
    parentChk.classList.add('partial'); // estado intermedio
  }
}

// ── Badge con contador de seleccionados ──
function updateBadge(seccionKey) {
  var badge = document.getElementById('badge-' + seccionKey);
  if (!badge) return;
  var checked = document.querySelectorAll(
    '.child-check[data-seccion="' + seccionKey + '"]:checked'
  ).length;
  badge.textContent = checked;
  badge.classList.toggle('visible', checked > 0);
}

// ── Click en el texto del subitem — ejecuta Y marca el checkbox ──
function selectAnalisisTestDirect(testId, category) {
  analisisSelectedCategory = category;
  analisisSelectedTest = testId;
  analisisResultContent = null;
  loadPage('analisis');
  setTimeout(function() { runSingleStat(testId); }, 50);
}

function onSubitemClick(event, nombre, seccionKey) {
  console.log('[DBG] onSubitemClick called', { nombre, seccionKey, targetClass: event.target.classList.toString(), currentPage });
  if (event.target.classList.contains('stat-check')) { console.log('[DBG] → early return (stat-check)'); return; }

  // 1. Marcar checkbox
  var id = 'chk-' + seccionKey + '-' + nombre.replace(/[^a-zA-Z0-9]/g, '_');
  var chk = document.getElementById(id);
  var justChecked = false;
  if (chk) {
    chk.checked = !chk.checked;
    justChecked = chk.checked;
    updateParentCheck(seccionKey);
    updateBadge(seccionKey);
  }

  // 2. Modal de configuración si aplica
  if (justChecked && HYPOTHESIS_SET.has(nombre) && !StateManager.getHypothesisConfig(nombre)) {
    _mostrarModalConfigTest(nombre, function() {});
  }

  // 3. Actualizar estado global y limpiar resultado previo
  analisisSelectedCategory = seccionKey;
  analisisSelectedTest = nombre;
  analisisResultContent = null;

  // 3. Cerrar el dropdown
  document.querySelectorAll('.menu-item').forEach(function(i){ i.classList.remove('open'); });
  anyOpen = false;

  // 4. Si NO estamos en análisis, navegar primero
  console.log('[DBG] currentPage=' + currentPage + ' | analisisSelectedCategory=' + analisisSelectedCategory + ' | analisisSelectedTest=' + analisisSelectedTest);
  if (currentPage !== 'analisis') {
    loadPage('analisis');
  } else {
    // Solo actualizar el sidebar izquierdo sin tocar el panel derecho
    leftPaneBody.innerHTML = leftPanels.analisis();
    console.log('[DBG] Sidebar updated, leftPaneBody.innerHTML length:', leftPaneBody.innerHTML.length, leftPaneBody.innerHTML.substring(0, 120));
  }

  // 5. Mostrar cards en panel derecho
  rightPaneBody.innerHTML = rightPanels.analisis();
}

// ── Auth + Initial load ──
function _initIndexxApp() {
  if (typeof Auth === 'undefined') { setTimeout(_initIndexxApp, 50); return; }
  // Migrar hypothesisConfig antiguos (pre-fix columnas X/Y)
  try {
    var oldCfg = StateManager && StateManager.getHypothesisConfig && StateManager.getAllHypothesisConfig();
    if (oldCfg) {
      for (var key in oldCfg) {
        if (oldCfg.hasOwnProperty(key)) {
          var c = oldCfg[key];
          if (c && !c.columnaX && !c.columnaY && c.categoricalCols && c.numericCol) {
            var estadCfg = getEstadisticoConfig(key);
            if (estadCfg && (estadCfg.seccion === 'correlacion' || estadCfg.seccion === 'regresion')) {
              StateManager.clearHypothesisConfig(key);
            }
          }
        }
      }
    }
  } catch(e) { console.warn('Migración hypothesisConfig:', e); }
  Auth.init({
    onLogin: function(session) {
      _restoreAllData();
      loadPage('datos');
      var isAdmin = session?.role === 'admin';
      var audNav = document.querySelector('[data-page="auditoria"]');
      var usrNav = document.querySelector('[data-page="usuarios"]');
      if (audNav) audNav.style.display = isAdmin ? '' : 'none';
      if (usrNav) usrNav.style.display = isAdmin ? '' : 'none';
    }
  });
}
// ════════════════════════════════════════════════════════════════
// FIRMAR REPORTE — Cargar .html, editar firmas, descargar
// ════════════════════════════════════════════════════════════════
var _firmaCurrentDoc = null;
var _firmaCurrentHtml = '';
var _firmaSignatureData = null;

function initFirmarReportePage() {
  _firmaCurrentDoc = null;
  _firmaCurrentHtml = '';
  _firmaSignatureData = null;

  var dropZone = document.getElementById('firmaDropZone');
  var fileInput = document.getElementById('firmaFileInput');
  var preview = document.getElementById('firmaPreview');
  var status = document.getElementById('firmaStatus');
  var actions = document.getElementById('firmaActions');

  if (!dropZone || !fileInput || !preview) return;

  // Reset UI
  if (preview) preview.innerHTML = '<div style="color:var(--text-faint);font-size:13px">Carga un reporte .html para previsualizarlo aquí</div>';
  if (status) { status.style.display = 'none'; status.innerHTML = ''; }
  if (actions) { actions.style.display = 'none'; }

  dropZone.onclick = function(){ fileInput.click(); };

  dropZone.ondragover = function(e){ e.preventDefault(); dropZone.style.borderColor = 'var(--accent)'; dropZone.style.background = 'rgba(92,107,192,0.1)'; };
  dropZone.ondragleave = function(){ dropZone.style.borderColor = 'var(--border)'; dropZone.style.background = 'transparent'; };
  dropZone.ondrop = function(e){ e.preventDefault(); dropZone.style.borderColor = 'var(--border)'; dropZone.style.background = 'transparent'; if (e.dataTransfer.files.length) firmaHandleFile(e.dataTransfer.files[0]); };

  fileInput.onchange = function(){ if (fileInput.files.length) firmaHandleFile(fileInput.files[0]); fileInput.value = ''; };

  var downloadBtn = document.getElementById('firmaDownloadBtn');
  if (downloadBtn) downloadBtn.onclick = firmaDownload;
}

function firmaHandleFile(file) {
  if (!file || !file.name.toLowerCase().endsWith('.html')) {
    showToast('Selecciona un archivo .html válido');
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e){
    var html = e.target.result;
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var sigBlocks = doc.querySelectorAll('[data-signature-role]:not([data-signature-field])');

    if (!sigBlocks.length) {
      showToast('Este reporte no contiene firmas detectables. Usa la versión más reciente de StatAnalyzer Pro.');
      return;
    }

    _firmaCurrentDoc = doc;
    _firmaCurrentHtml = html;

    // Render preview in iframe
    var preview = document.getElementById('firmaPreview');
    if (preview) {
      preview.innerHTML = '<iframe srcdoc="' + escapeHtml(html).replace(/"/g,'&quot;') + '" style="width:100%;height:100%;border:none;min-height:70vh"></iframe>';
    }

    // Extract signature data
    _firmaSignatureData = [];
    sigBlocks.forEach(function(block){
      var role = block.getAttribute('data-signature-role');
      var roleLabel = block.querySelector('div:first-child')?.textContent || role;
      var fields = {};
      block.querySelectorAll('[data-signature-field]').forEach(function(el){
        var field = el.getAttribute('data-signature-field');
        fields[field] = el.textContent;
      });
      _firmaSignatureData.push({ role: role, label: roleLabel, fields: fields });
    });

    firmaRenderEditor();

    var status = document.getElementById('firmaStatus');
    if (status) {
      status.style.display = 'block';
      status.innerHTML = '<div style="font-size:11px;color:var(--accent);padding:8px 12px">✅ Reporte cargado: ' + escapeHtml(file.name) + ' (' + _firmaSignatureData.length + ' firma(s) detectada(s))</div>';
    }

    var actions = document.getElementById('firmaActions');
    if (actions) actions.style.display = 'flex';

    showToast('Reporte cargado: ' + _firmaSignatureData.length + ' firmas detectadas');
  };
  reader.readAsText(file);
}

function firmaRenderEditor() {
  var editor = document.getElementById('firmaSignatureEditor');
  if (!editor || !_firmaSignatureData) return;
  editor.innerHTML = '';

  _firmaSignatureData.forEach(function(sd){
    var card = document.createElement('div');
    card.style.cssText = 'border:1px solid var(--border);border-radius:6px;overflow:hidden';

    var header = document.createElement('div');
    header.style.cssText = 'padding:6px 10px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid var(--border)';
    header.textContent = sd.label;
    card.appendChild(header);

    var body = document.createElement('div');
    body.style.cssText = 'padding:8px 10px;display:flex;flex-direction:column;gap:6px';

    var fieldKeys = ['name', 'title', 'date'];
    var fieldLabels = { name: 'Nombre', title: 'Cargo', date: 'Fecha' };

    fieldKeys.forEach(function(fk){
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;flex-direction:column;gap:2px';

      var label = document.createElement('span');
      label.style.cssText = 'font-size:9px;color:var(--text-faint);text-transform:uppercase';
      label.textContent = fieldLabels[fk];
      row.appendChild(label);

      var input = document.createElement('input');
      input.type = fk === 'date' ? 'date' : 'text';
      input.value = sd.fields[fk] || '';
      input.placeholder = fk === 'date' ? 'yyyy-mm-dd' : '—';
      input.style.cssText = 'background:var(--bg-primary);border:1px solid var(--border);border-radius:4px;padding:4px 6px;font-size:11px;color:var(--text-primary);outline:none;width:100%';
      input.dataset.sigRole = sd.role;
      input.dataset.sigField = fk;

      input.oninput = function(){ firmaUpdatePreview(this.dataset.sigRole, this.dataset.sigField, this.value); };

      row.appendChild(input);
      body.appendChild(row);
    });

    card.appendChild(body);
    editor.appendChild(card);
  });
}

function firmaUpdatePreview(role, field, value) {
  if (!_firmaCurrentDoc) return;
  var el = _firmaCurrentDoc.querySelector('[data-signature-role="' + role + '"] [data-signature-field="' + field + '"]');
  if (el) {
    el.textContent = value || '';
    // Update iframe
    var preview = document.getElementById('firmaPreview');
    if (preview) {
      var iframe = preview.querySelector('iframe');
      if (iframe) {
        var newHtml = '<!DOCTYPE html>\n' + _firmaCurrentDoc.documentElement.outerHTML;
        iframe.srcdoc = newHtml;
      }
    }
  }
}

function firmaDownload() {
  if (!_firmaCurrentDoc) { showToast('No hay reporte cargado'); return; }
  try {
    var html = '<!DOCTYPE html>\n' + _firmaCurrentDoc.documentElement.outerHTML;
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_firmado.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✅ Reporte firmado descargado');
  } catch(e) {
    showToast('Error al descargar: ' + e.message);
  }
}
// ════════════════════════════════════════════════════════════════

buildStatAnalysisMenu();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initIndexxApp);
} else {
  _initIndexxApp();
}
