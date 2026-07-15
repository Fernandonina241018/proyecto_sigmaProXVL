// ── Pane resizer ──
// ════════════════════════════════════════════════════════════════
// indexx-ui.js — Pane resizer, menubar, sidebar, tabs, page system,
//                leftPanels, rightPanels, loadPage, nav, zoom
// ════════════════════════════════════════════════════════════════

var resizer = document.getElementById('paneResizer');
var paneLeft = document.getElementById('paneLeft');
var panesCont = document.getElementById('panesContainer');
resizer.addEventListener('mousedown', function(e) {
  e.preventDefault(); resizer.classList.add('dragging');
  document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
  function onMove(ev) {
    var rect = panesCont.getBoundingClientRect();
    var minW = currentPage === 'trabajo' ? 360 : 160;
    var newW = Math.max(minW, Math.min(panesCont.offsetWidth - minW - resizer.offsetWidth, ev.clientX - rect.left));
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
    e.preventDefault();
    if (e.target.closest('.dd-item')) return;
    var wasOpen = item.classList.contains('open');
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
    // El onclick se ejecutará automáticamente
  }
});

// ── Sidebar toggle ──
function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  var toggle = document.getElementById('sidebarToggle');
  var isMobile = window.innerWidth <= 768;
  if (isMobile) {
    sidebar.classList.toggle('open');
    var backdrop = document.getElementById('sidebarBackdrop');
    if (backdrop) backdrop.classList.toggle('show');
    return;
  }
  var isNowCollapsed = !sidebar.classList.contains('collapsed');
  sidebar.classList.toggle('collapsed');
  if (toggle) toggle.classList.toggle('rotated');
  try { localStorage.setItem('sidebar_collapsed', isNowCollapsed); } catch(e) {}
}
document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    toggleSidebar();
  }
});

document.getElementById('ribbonPopupBtn').addEventListener('click', function(e) {
  e.stopPropagation();
  var sidebar = document.getElementById('sidebar');
  if (!sidebar.classList.contains('collapsed')) return;
  document.getElementById('ribbonNavPopup').classList.toggle('open');
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
  document.getElementById('sudAvatar').textContent = (session.username || 'U').charAt(0).toUpperCase();
  dd.classList.toggle('open');
});
document.getElementById('sidebarUserDropdown').addEventListener('click', function(e) {
  var item = e.target.closest('.sud-item');
  if (!item) return;
  var dd = document.getElementById('sidebarUserDropdown');
  dd.classList.remove('open');
  if (item.getAttribute('data-action') === 'perfil') { if (typeof showPerfilModal === 'function') showPerfilModal(); return; }
  if (item.getAttribute('data-action') === 'logout' && typeof Auth !== 'undefined') Auth.logout();
});
document.addEventListener('click', function(e) {
  var dd = document.getElementById('sidebarUserDropdown');
  if (dd && !e.target.closest('#sidebarUser') && !e.target.closest('#sidebarUserDropdown')) {
    dd.classList.remove('open');
  }
  var popup = document.getElementById('ribbonNavPopup');
  if (popup && !e.target.closest('#sidebarToggle') && !e.target.closest('#ribbonPopupBtn') && !e.target.closest('#ribbonNavPopup')) {
    popup.classList.remove('open');
  }
});

// ── Perfil modal ──
function showPerfilModal() {
  var session = typeof Auth !== 'undefined' ? Auth.getSession() : null;
  if (!session) return;
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div style="max-width:440px;width:90%">'
    + '<div id="perfilConnStatus" style="padding:6px 16px;font-size:11px;font-weight:600;text-align:center;background:var(--bg-secondary);color:var(--text-muted);border-radius:12px 12px 0 0;display:flex;align-items:center;justify-content:center;gap:6px">⏳ Conectando...</div>'
    + '<div class="modal-box" style="max-width:100%;padding:0;overflow:hidden;border-radius:0 0 12px 12px">'
    + '<div class="perfil-loading" style="text-align:center;padding:40px 20px;color:var(--text-muted);font-size:14px">Cargando perfil...</div>'
    + '</div></div>';
  document.body.appendChild(overlay);
  var box = overlay.querySelector('.modal-box');
  var statusEl = document.getElementById('perfilConnStatus');
  var apiUrl = typeof API_URL !== 'undefined' ? API_URL : '';
  fetchWithTimeout(apiUrl + '/api/me', { credentials: 'include', headers: { Authorization: 'Bearer ' + (Auth.getToken() || '') } })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.ok) throw new Error(data.error || 'Error al cargar');
      var user = data.profile || { username: data.username, role: data.role };
      if (statusEl) { statusEl.innerHTML = '✓ Conectado al servidor'; statusEl.style.background = 'rgba(74,222,128,0.12)'; statusEl.style.color = '#4ade80'; }
      renderPerfil(box, user);
    })
    .catch(function() {
      if (statusEl) { statusEl.innerHTML = '✕ Sin conexión al servidor'; statusEl.style.background = 'rgba(248,113,113,0.12)'; statusEl.style.color = '#f87171'; }
      renderPerfilSimple(box, session);
    });
}

function renderPerfil(box, u) {
  var nombreCompleto = [u.nombre, u.apellido].filter(Boolean).join(' ') || u.username;
  var inicial = nombreCompleto.charAt(0).toUpperCase();
  var colores = ['#7c6af7','#6ee7b7','#fb923c','#f87171','#60a5fa','#a78bfa','#f472b6','#34d399'];
  var color = colores[nombreCompleto.length % colores.length];
  var rolLabel = { admin:'🔴 Admin', user:'👤 Usuario', supervisor:'🟡 Supervisor', analista:'🔵 Analista', gerente:'🟣 Gerente', coordinador:'🟠 Coordinador', readonly:'👁 Solo lectura' }[u.role] || escapeHtml(u.role);
  var activo = u.active === 1;
  var lastLogin = u.last_login ? (typeof fmtDate === 'function' ? fmtDate(u.last_login) : u.last_login.slice(0,16).replace('T',' ')) : 'Nunca';

  box.innerHTML =
    '<div style="background:linear-gradient(135deg,' + color + ',rgba(0,0,0,0.3));padding:24px 24px 20px;text-align:center;position:relative">'
    + '<div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:26px;font-weight:700;color:#fff;border:3px solid rgba(255,255,255,0.3);font-family:var(--font-display,Outfit)">' + inicial + '</div>'
    + '<div style="font-size:18px;font-weight:700;color:#fff;font-family:var(--font-display,Outfit)">' + escapeHtml(nombreCompleto) + '</div>'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.75);margin-top:2px">' + escapeHtml(u.email || '—') + '</div>'
    + '<div style="margin-top:10px;display:flex;gap:8px;justify-content:center">'
    + '<span style="padding:3px 12px;border-radius:20px;font-size:11px;font-weight:600;background:rgba(255,255,255,0.15);color:#fff">' + rolLabel + '</span>'
    + '<span style="padding:3px 12px;border-radius:20px;font-size:11px;font-weight:600;background:' + (activo ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)') + ';color:' + (activo ? '#4ade80' : '#f87171') + '">' + (activo ? '✓ Activo' : '✕ Inactivo') + '</span>'
    + '</div></div>'
    + '<div style="padding:20px 24px;display:flex;flex-direction:column;gap:12px">'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'
    + campoPerfil('👤 Usuario', u.username)
    + campoPerfil('💼 Cargo', u.cargo || '—')
    + campoPerfil('📱 Teléfono', u.telefono || '—')
    + campoPerfil('✍️ Firma', u.signature_code || '—')
    + '</div>'
    + '<div style="display:flex;gap:16px;padding-top:12px;border-top:1px solid var(--border);font-size:12px;color:var(--text-muted);justify-content:center">'
    + '<span>🕐 ' + escapeHtml(lastLogin) + '</span>'
    + '<span>🔑 ' + (u.login_count || 0) + ' logins</span>'
    + '</div>'
    + '<button class="btn btn-secondary" style="width:100%;justify-content:center" onclick="this.closest(\'.modal-overlay\').remove()">Cerrar</button>'
    + '</div>';
}

function renderPerfilSimple(box, session) {
  var inicial = (session.username || 'U').charAt(0).toUpperCase();
  box.innerHTML =
    '<div style="background:linear-gradient(135deg,var(--accent),rgba(0,0,0,0.3));padding:24px 24px 20px;text-align:center">'
    + '<div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:26px;font-weight:700;color:#fff;border:3px solid rgba(255,255,255,0.3);font-family:var(--font-display,Outfit)">' + inicial + '</div>'
    + '<div style="font-size:18px;font-weight:700;color:#fff;font-family:var(--font-display,Outfit)">' + escapeHtml(session.username) + '</div>'
    + '<div style="margin-top:10px;display:flex;gap:8px;justify-content:center">'
    + '<span style="padding:3px 12px;border-radius:20px;font-size:11px;font-weight:600;background:rgba(255,255,255,0.15);color:#fff">' + escapeHtml(session.role || '—') + '</span>'
    + '</div></div>'
    + '<div style="padding:20px 24px;text-align:center;color:var(--text-muted);font-size:12px">ℹ️ Conectado como ' + escapeHtml(session.username) + '</div>'
    + '<div style="padding:0 24px 20px"><button class="btn btn-secondary" style="width:100%;justify-content:center" onclick="this.closest(\'.modal-overlay\').remove()">Cerrar</button></div>';
}

function campoPerfil(label, value) {
  return '<div style="display:flex;flex-direction:column;gap:4px;background:var(--item-bg);padding:10px 12px;border-radius:8px"><span style="font-size:10px;font-weight:600;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.5px">' + label + '</span><span style="font-size:13px;font-weight:500;color:var(--text-primary)">' + escapeHtml(value || '—') + '</span></div>';
}

// ── Tab management ──
var tabbar = document.getElementById('tabbar');
function makeTabActive(tab) { document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); }); tab.classList.add('active'); }
function closeTab(tabEl, e) {
  if (e) e.stopPropagation();
  var allTabs = document.querySelectorAll('.tab');
  if (allTabs.length <= 1) return;
  var pageName = tabEl.dataset.pageTab;
  tabEl.remove();
  var remaining = document.querySelectorAll('.tab');
  if (remaining.length === 0) {
    leftPaneBody.innerHTML = '';
    rightPaneBody.innerHTML = '<div class="page-body"><div style="color:var(--text-faint);padding:40px;text-align:center">Abre una página desde el menú lateral</div></div>';
    currentPage = '';
    return;
  }
  var nextTab = tabEl.nextElementSibling;
  while (nextTab && !nextTab.classList.contains('tab')) nextTab = nextTab.nextElementSibling;
  if (!nextTab) {
    nextTab = tabEl.previousElementSibling;
    while (nextTab && !nextTab.classList.contains('tab')) nextTab = nextTab.previousElementSibling;
  }
  if (!nextTab) nextTab = remaining[0];
  makeTabActive(nextTab);
  var nextPage = nextTab.dataset.pageTab;
  if (nextPage) loadPage(nextPage);
}
document.getElementById('tabNew').addEventListener('click', function() {
  var t = document.createElement('div'); t.className = 'tab';
  t.innerHTML = '<span class="tab-icon">📄</span> Untitled <span class="tab-close">×</span>';
  tabbar.insertBefore(t, document.querySelector('.tabbar-spacer')); makeTabActive(t);
  t.querySelector('.tab-close').addEventListener('click', function(e){ closeTab(t, e); });
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
    var isGlobal = trabajoLimitsMode === 'global';
    return '<div class="left-panel" style="gap:8px">' +
      '<div style="display:flex;align-items:center;gap:6px;padding:0 0 4px;flex-shrink:0">' +
        '<span style="flex:1;font-size:13px;font-weight:600;color:var(--text-primary)">📋 Hoja de Trabajo</span>' +
        '<button style="width:24px;height:24px;padding:0;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:default;color:var(--text-faint);font-size:16px;border-radius:4px" title="Más opciones">⋯</button>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;flex-shrink:0;position:relative;z-index:10">' +
        '<div class="tb-dropdown">' +
          '<button class="btn btn-secondary" style="width:100%;height:30px;min-height:30px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:4px" onclick="toggleDropdown(this)">📋 Acciones</button>' +
          '<div class="dd-menu">' +
            '<div class="dd-item" onclick="generateSampleData()">⚙️ Configurar datos</div>' +
            '<div class="dd-item" onclick="exportTrabajo()">💾 Exportar CSV</div>' +
            '<div class="dd-item" onclick="clearCurrentSheet()">🗑️ Limpiar hoja</div>' +
          '</div>' +
        '</div>' +
        '<div class="tb-dropdown">' +
          '<button class="btn btn-secondary" style="width:100%;height:30px;min-height:30px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:4px" onclick="toggleDropdown(this)">✏️ Editar</button>' +
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
          '<button class="btn btn-secondary" style="width:100%;height:30px;min-height:30px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:4px" onclick="toggleDropdown(this)">👁️ Vista</button>' +
          '<div class="dd-menu">' +
            '<div class="dd-item" onclick="toggleFreezeCol()" id="ddFreezeCol">' + (trabajoFreezeFirstCol ? '🔒 Col fija ON' : '🔓 Fijar col 1') + '</div>' +
            '<div class="dd-item" onclick="toggleConditionalFormat()" id="ddCondFormat">' + (trabajoConditionalFormat ? '🎨 CF ON' : '🎨 Formato cond.') + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="info-section" style="flex-shrink:0;overflow:visible">' +
        '<div class="info-section-header" style="display:flex;justify-content:space-between;align-items:center;padding:4px 10px"><span>Hojas</span></div>' +
        '<div style="padding:.35rem .75rem .5rem;display:flex;align-items:center;gap:5px">' +
          '<span style="font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--text-faint);flex-shrink:0">Hoja</span>' +
          '<select id="sheetsSelect" class="sheets-select" onchange="switchToSheet(parseInt(this.value))" style="flex:1;min-width:0;height:28px;padding:0 8px;border:.5px solid var(--border);border-radius:6px;background:var(--bg-primary);font-size:12px;color:var(--text-primary)">' + getSheetsOptionsHTML() + '</select>' +
          (trabajoSheets.length > 1 ? '<button onclick="deleteSheet(' + trabajoActiveSheetIndex + ',event)" style="width:24px;height:24px;padding:0;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;color:var(--text-faint);font-size:14px;border-radius:4px;flex-shrink:0" title="Eliminar hoja">✕</button>' : '') +
          '<button onclick="createNewSheet()" style="width:24px;height:24px;padding:0;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;color:var(--accent);font-size:16px;border-radius:4px;flex-shrink:0" title="Nueva hoja">＋</button>' +
        '</div>' +
      '</div>' +
      '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">Resumen</div><div id="trabajoResumen">' + getTrabajoResumenHTML() + '</div></div>' +
      '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">Celda activa</div><div id="trabajoCeldaActiva">' + getTrabajoCeldaActivaHTML() + '</div></div>' +
      '<div class="info-section" style="flex-shrink:0">' +
        '<div class="info-section-header" style="display:flex;align-items:center;justify-content:space-between">' +
          '<span>📐 Límites</span>' +
          '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:11px;color:var(--text-muted)">' +
            '<span class="toggle-bg" style="position:relative;width:28px;height:16px;background:' + (isGlobal ? 'var(--accent)' : 'var(--bg-primary)') + ';border:.5px solid var(--border);border-radius:8px;transition:background .15s;pointer-events:none;display:inline-block">' +
              '<span class="toggle-thumb" style="position:absolute;left:' + (isGlobal ? '14px' : '2px') + ';top:2px;width:10px;height:10px;background:' + (isGlobal ? '#fff' : 'var(--text-muted)') + ';border-radius:50%;transition:transform .15s,background .15s;pointer-events:none"></span>' +
            '</span>' +
            '<input type="checkbox" id="limitsGlobalToggle" ' + (isGlobal ? 'checked' : '') + ' onchange="toggleLimitsMode()" style="position:absolute;opacity:0;width:0;height:0">' +
            '<span>Global</span>' +
          '</label>' +
        '</div>' +
        '<div id="trabajoLimitsBody"></div>' +
      '</div>' +
    '</div>';
  },
  datos: function() {
    return '<div class="left-panel" style="gap:6px;padding:8px" id="datosLeftPanel">' +
      '<div class="upload-zone compact" id="dropZone" style="padding:6px 8px;flex-shrink:0">' +
        '<div class="upload-zone-icon" style="font-size:14px">📂</div>' +
        '<div class="upload-zone-text" style="font-size:10px">Arrastra o haz clic</div>' +
      '</div>' +
      '<input type="file" id="fileInput" style="display:none" accept=".csv,.json,.xlsx,.xls">' +
      '<div style="display:flex;gap:4px;flex-shrink:0">' +
        '<button class="btn btn-secondary" style="flex:1;font-size:10px;padding:4px 4px" id="btnCsv">📄 CSV</button>' +
        '<button class="btn btn-secondary" style="flex:1;font-size:10px;padding:4px 4px" id="btnXlsx">📊 Excel</button>' +
        '<button class="btn btn-secondary" style="flex:1;font-size:10px;padding:4px 4px" id="btnPaste">📋 Pegar</button>' +
      '</div>' +
      '<div style="display:flex;gap:4px;flex-shrink:0">' +
        '<button class="btn btn-secondary" style="flex:1;font-size:10px;padding:4px 4px" onclick="generateSampleData()">🎲 Generar</button>' +
        '<button class="btn btn-secondary" style="flex:1;font-size:10px;padding:4px 4px" onclick="ampliarDatos()">📈 Ampliar</button>' +
        '<button class="btn btn-secondary" style="flex:1;font-size:10px;padding:4px 4px" onclick="limpiarDataset()">🧹 Limpiar</button>' +
      '</div>' +
      '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">Estado</div><div class="info-list">' +
        '<div class="info-item"><div class="info-item-label">Dataset</div><div class="info-item-value" id="datosDatasetName">Sin cargar</div></div>' +
        '<div class="info-item"><div class="info-item-label">Filas</div><div class="info-item-value" id="datosRowCount">—</div></div>' +
        '<div class="info-item"><div class="info-item-label">Columnas</div><div class="info-item-value" id="datosColCount">—</div></div>' +
      '</div></div>' +
      '<div class="info-section" style="flex:1;overflow:hidden;display:flex;flex-direction:column;min-height:0">' +
        '<div class="info-section-header" style="display:flex;justify-content:space-between;align-items:center">' +
          '<span>Recientes</span>' +
          '<span id="clearHistoryBtn" title="Limpiar historial" style="cursor:pointer;font-size:11px;padding:2px 6px;border-radius:4px;color:var(--text-faint)" onmouseenter="this.style.background=\'rgba(255,255,255,.08)\';this.style.color=\'var(--text-muted)\'" onmouseleave="this.style.background=\'transparent\';this.style.color=\'var(--text-faint)\'">🗑️</span>' +
        '</div>' +
        '<div style="overflow-y:auto;flex:1;padding:6px;display:flex;flex-direction:column;gap:4px" id="recentFilesList"></div>' +
      '</div>' +
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
      
      // Get current dataset info
      var analisisSheet = getCurrentSheet();
      var dsName = analisisSheet ? analisisSheet.name : 'Ninguno';
      var dsRows = analisisSheet ? analisisSheet.rows.length : 0;
      var dsCols = analisisSheet ? analisisSheet.headers.length : 0;

      return '<div class="left-panel" style="gap:10px">' +
        // ── Dataset activo ──
        '<div class="info-section" style="flex-shrink:0">' +
          '<div class="info-section-header">Dataset activo</div>' +
          '<div class="info-list">' +
            '<div class="info-item"><div class="info-item-label">Nombre</div><div class="info-item-value" id="analisisDsName" style="font-weight:600;color:var(--accent)">' + escapeHtml(dsName) + '</div></div>' +
            '<div class="info-item"><div class="info-item-label">Filas</div><div class="info-item-value" id="analisisDsRows">' + dsRows + '</div></div>' +
            '<div class="info-item"><div class="info-item-label">Columnas</div><div class="info-item-value" id="analisisDsCols">' + dsCols + '</div></div>' +
          '</div>' +
        '</div>' +
        // ── Columnas activas ──
        '<div class="info-section" style="flex-shrink:0">' +
          '<div class="info-section-header">Columnas</div>' +
          '<div class="info-list" style="gap:4px">' +
            '<div class="info-item" style="display:flex;align-items:center;gap:6px">' +
              '<span id="analisisStatNumeric" style="font-size:11px;font-weight:600;color:var(--accent)">?</span>' +
              '<span style="font-size:10px;color:var(--text-faint)">numéricas</span>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:6px;padding:2px 0">' +
              '<span style="font-size:10px;color:var(--text-faint);min-width:60px">Umbral:</span>' +
              '<input type="range" id="colThresholdSlider" min="0" max="100" value="50" style="flex:1;height:4px" oninput="columnAnalysisConfig.threshold=this.value/100;document.getElementById(\'colThresholdVal\').textContent=this.value+\'%\'">' +
              '<span id="colThresholdVal" style="font-size:10px;color:var(--text-primary);min-width:28px;text-align:right">50%</span>' +
            '</div>' +
            '<div style="display:flex;gap:4px">' +
              '<label style="display:flex;align-items:center;gap:3px;font-size:10px;color:var(--text-faint);cursor:pointer"><input type="checkbox" id="colForceInclude" onchange="columnAnalysisConfig.forceInclude=this.checked"> Forzar</label>' +
              '<label style="display:flex;align-items:center;gap:3px;font-size:10px;color:var(--text-faint);cursor:pointer"><input type="checkbox" id="colImputeMissing" onchange="columnAnalysisConfig.imputeMissing=this.checked"> Imputar</label>' +
              '<button class="btn btn-secondary" style="font-size:10px;padding:1px 6px;margin-left:auto" onclick="showColumnAnalysisModal()">🔍</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // ── Último resultado ──
        '<div class="info-section" style="flex-shrink:0">' +
          '<div class="info-section-header">Último resultado</div>' +
          '<div class="info-list" id="analisisLastResultList">' +
            '<div class="info-item"><div class="info-item-label">Test</div><div class="info-item-value" id="analisisLastTest">' + lastTest + '</div></div>' +
            '<div class="info-item"><div class="info-item-label">p-valor</div><div class="info-item-value" id="analisisLastPVal">' + lastPVal + '</div></div>' +
            '<div class="info-item"><div class="info-item-label">Decisión</div><div class="info-item-value" id="analisisLastDecision" style="color:' + decColor + '">' + lastDec + '</div></div>' +
          '</div>' +
        '</div>' +
        // ── Tests seleccionados (solo este scroll) ──
        '<div class="info-section" style="flex:1;overflow:hidden;display:flex;flex-direction:column;min-height:0">' +
          '<div class="info-section-header">Test seleccionado</div>' +
          '<div id="analisisSelectedTestsScroll" style="overflow-y:auto;flex:1;padding:6px;display:flex;flex-direction:column;gap:3px">' + selectedTestsHtml + '</div>' +
        '</div>' +
      '</div>'; 
    },

  visualizacion: function()  { return '<div class="left-panel viz-root" style="gap:0;padding:0;overflow:hidden;display:flex;flex-direction:column;overflow-y:auto">' +
    '<div class="sec" style="flex-shrink:0">' +
      '<div class="sec-hdr" onclick="vizToggleSec(this)">' +
        '<span class="sec-hdr-label">Tipo de gráfico</span>' +
        '<span class="chev">▼</span>' +
      '</div>' +
      '<div class="sec-body" id="vizSecType">' +
        '<div class="cat-tabs" id="vizCatTabs"></div>' +
        '<div class="chart-grid" id="vizChartGrid"></div>' +
      '</div>' +
    '</div>' +
    '<div class="sec">' +
      '<div class="sec-hdr" onclick="vizToggleSec(this)">' +
        '<span class="sec-hdr-label">Variables</span>' +
        '<span class="chev">▼</span>' +
      '</div>' +
      '<div class="sec-body" id="vizSecAxis">' +
        '<div class="axis-body" id="vizAxisBody"><div class="axis-hint">Selecciona un tipo de gráfico primero</div></div>' +
      '</div>' +
    '</div>' +
    '<div class="sec">' +
      '<div class="sec-hdr" onclick="vizToggleSec(this)">' +
        '<span class="sec-hdr-label">Estilo y opciones</span>' +
        '<span class="chev">▼</span>' +
      '</div>' +
      '<div class="sec-body" id="vizSecStyle">' +
        '<div class="style-body">' +
          '<div class="style-row"><label class="style-lbl">Título del gráfico</label><input id="vizChartTitle" class="style-inp" type="text" placeholder="Ej: Ventas por mes 2024"></div>' +
          '<div class="style-row"><label class="style-lbl">Paleta de colores</label><div class="palettes" id="vizPalettes"></div></div>' +
          '<div class="style-row"><label class="style-lbl">Opciones</label>' +
            '<div class="toggles">' +
              '<button class="tog on" id="vizTogLegend" onclick="vizFlipToggle(\'legend\',\'vizTogLegend\')">Leyenda</button>' +
              '<button class="tog on" id="vizTogGrid"   onclick="vizFlipToggle(\'grid\',\'vizTogGrid\')">Grilla</button>' +
              '<button class="tog on" id="vizTogAnim"   onclick="vizFlipToggle(\'anim\',\'vizTogAnim\')">Animación</button>' +
              '<button class="tog on" id="vizTogSmooth" onclick="vizFlipToggle(\'smooth\',\'vizTogSmooth\')">Suavizado</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="action-bar">' +
      '<button class="btn btn-viz btn-prim" onclick="vizRenderChart()">⚡ Renderizar</button>' +
      '<button class="btn btn-viz btn-sec"  onclick="vizSaveToGallery()">💾</button>' +
      '<button class="btn btn-viz btn-sec"  onclick="vizExportPNG()">↗ PNG</button>' +
    '</div>' +
  '</div>'; },
  reportes: function() { return '<div class="left-panel" style="gap:10px"><div id="reportes-sidebar-container"></div></div>'; },
  auditoria: function() { return '<div class="left-panel" style="gap:10px"><button class="btn btn-secondary" style="width:100%;justify-content:center;font-size:11px;flex-shrink:0" onclick="if(typeof AuditoriaManager!==\'undefined\')AuditoriaManager.exportarCSV()">📥 Exportar log completo</button><div class="info-section"><div class="info-section-header">Filtros</div><div style="font-size:11px;color:var(--text-faint);padding:8px">Usa los filtros incluidos en el panel de resultados</div></div></div>'; },
  usuarios: function() { return '<div class="left-panel" style="gap:10px"><div style="flex-shrink:0;display:flex;flex-direction:column;gap:6px"><button class="btn btn-primary" style="width:100%;justify-content:center" onclick="if(typeof UsuariosManager!==\'undefined\')UsuariosManager.abrirModalCrearUsuario()">+ Nuevo usuario</button></div><div class="info-section"><div class="info-section-header">Usuarios</div><div class="usr-toolbar" style="display:flex;flex-direction:column;gap:8px;padding:8px"><input class="usr-search" id="usr-search" type="text" placeholder="🔍 Buscar usuario..." style="padding:8px 10px;border:1.5px solid var(--border);border-radius:6px;font-size:0.82rem;font-family:inherit;color:var(--text-primary);background:var(--bg-panel);outline:none;transition:border-color 0.2s"><div style="display:flex;align-items:center;justify-content:space-between"><div class="usr-count" id="usr-count" style="font-size:0.8rem;color:var(--text-faint)">—</div><button class="usr-btn-refresh" id="usr-btn-refresh" title="Recargar" style="padding:6px 10px;background:var(--item-bg);border:1.5px solid var(--border);border-radius:6px;cursor:pointer;font-size:0.9rem;transition:all 0.2s">🔄</button></div></div></div></div>'; },
  ml: function() { return typeof MLManager !== 'undefined' ? MLManager.buildLeftPanel() : ''; },
  firmarReporte: function() {
    return '<div class="left-panel" style="gap:10px">' +
      '<div class="info-section"><div class="info-section-header">✍️ Firmar Reporte</div>' +
        '<div class="info-section-body" style="font-size:11px;color:var(--text-faint);padding:8px 12px">Carga un reporte .html generado por StatAnalyzer Pro para revisar y firmar electrónicamente.</div></div>' +
      '<div class="info-section"><div class="info-section-header">📂 Cargar reporte</div>' +
        '<div class="info-section-body" style="padding:8px 12px">' +
          '<div class="upload-zone" id="firmaDropZone" style="border:2px dashed var(--border);border-radius:8px;padding:10px;text-align:center;cursor:pointer;transition:all .2s">' +
            '<div style="font-size:18px;margin-bottom:3px">📄</div>' +
            '<div style="font-size:10px;color:var(--text-muted);line-height:1.3">Arrastra un .html aquí<br>o haz clic para seleccionar</div></div>' +
          '<input type="file" id="firmaFileInput" accept=".html" style="display:none"></div></div>' +
      '<div id="firmaStatus" style="display:none"></div>' +
      '<div id="firmaActions" style="display:none;flex-direction:column;gap:8px">' +
        '<div class="info-section"><div class="info-section-header">📝 Firmas detectadas</div>' +
          '<div class="info-section-body" id="firmaSignatureEditor" style="padding:8px 12px;display:flex;flex-direction:column;gap:10px"></div></div>' +
        '<button class="btn btn-primary" id="firmaDownloadBtn" style="width:100%;justify-content:center;font-size:12px">⬇ Descargar reporte firmado</button>' +
        '<button class="btn btn-secondary" id="firmaResetBtn" style="width:100%;justify-content:center;font-size:12px;display:none">🔄 Reiniciar firmas</button></div>' +
    '</div>';
  },
  'modelo-estadistico': function() {
    return '<div class="left-panel" style="gap:10px;padding:12px">' +
      '<div style="font-size:11px;color:#888;line-height:1.5;">' +
      '<strong style="color:#b0b0b0;">🧠 Modelo Estadístico</strong><br><br>' +
      'Este modelo aprende de cada análisis que realizas. ' +
      'Usa un ensemble de k-NN y Árbol de Decisión (CART) para recomendar ' +
      'la mejor prueba estadística según las características de tus datos.<br><br>' +
      '<strong>¿Cómo mejorar el modelo?</strong><br>' +
      '1. Ejecuta análisis con datasets variados<br>' +
      '2. Acepta 👍 o rechaza 👎 las recomendaciones<br>' +
      '3. El modelo se refina con cada feedback<br><br>' +
      '<strong>Datos persistentes:</strong> almacenados en localStorage.<br>' +
      'Puedes exportar/importar el modelo como JSON.<br><br>' +
      '</div></div>';
  }
};

var rightPanels = {
  trabajo: function() {
    var sheet = getCurrentSheet();
    var cols = sheet ? sheet.headers : ['Columna1'];
    var rows = sheet ? sheet.rows : [];
    var totalRows = rows.length;
    var locked = sheet ? (sheet.locked === undefined ? false : sheet.locked) : false;
    var editable = locked ? 'false' : 'true';
    if (typeof trabajoPage === 'undefined') trabajoPage = 0;
    if (typeof trabajoPageSize === 'undefined') trabajoPageSize = 200;
    var totalPages = Math.max(1, Math.ceil(totalRows / trabajoPageSize));
    if (trabajoPage >= totalPages) trabajoPage = totalPages - 1;
    var start = trabajoPage * trabajoPageSize;
    var end = Math.min(start + trabajoPageSize, totalRows);
    var pageRows = rows.slice(start, end);
    var colHeaders = cols.map(function(c, ci){
      var frozenClass = (trabajoFreezeFirstCol && ci === 0) ? ' frozen-col' : '';
      return '<th style="width:120px;min-width:120px;text-align:left;font-size:11px;font-weight:500;padding:0;border-right:1px solid var(--border);background:var(--bg-primary);position:sticky;top:0;z-index:' + (trabajoFreezeFirstCol && ci===0 ? 3 : 2) + ';' + (trabajoFreezeFirstCol && ci===0 ? 'left:40px;border-right:2px solid rgba(124,106,247,.4)' : '') + '" class="' + frozenClass + '">' +
        '<div class="col-header-editable" contenteditable="' + editable + '" data-colidx="' + ci + '" onblur="renameColumn(' + ci + ',this.textContent)" onmouseenter="showColStats(event,' + ci + ')" onmouseleave="hideColStats()" title="Hover: estadísticas · Doble clic: renombrar">' + escapeHtml(c) + '</div></th>';
    }).join('');

    var bodyRows = pageRows.map(function(r, ri){
      var actualRow = start + ri;
      var cells = r.map(function(v, ci){
        var isActive = trabajoActiveCell.row === actualRow && trabajoActiveCell.col === ci;
        var inRange = isInRange(actualRow, ci);
        var selClass = isActive ? ' cell-selected' : (inRange ? ' cell-in-range' : '');
        var cfClass = getCFClass(v, ci);
        var frozenClass = (trabajoFreezeFirstCol && ci === 0) ? ' frozen-col' : '';
        var safeV = escapeHtml(String(v == null ? '' : v));
        return '<td class="excel-cell' + selClass + frozenClass + '" style="padding:0;border-right:1px solid rgba(255,255,255,0.04)' + (trabajoFreezeFirstCol && ci===0 ? ';border-right:2px solid rgba(124,106,247,.4)' : '') + '" onclick="cellClick(event,' + actualRow + ',' + ci + ')">' +
          '<div class="excel-cell-inner' + (cfClass ? ' ' + cfClass : '') + '" contenteditable="' + editable + '" data-row="' + actualRow + '" data-col="' + ci + '"' +
          ' onblur="saveCellData(' + actualRow + ',' + ci + ',this.textContent)"' +
          ' oninput="onCellInput(event,' + actualRow + ',' + ci + ',this.textContent)"' +
          ' onpaste="handleCellPaste(event,' + actualRow + ',' + ci + ')"' +
          ' onfocus="onCellFocus(' + actualRow + ',' + ci + ')">' +
          safeV + '</div></td>';
      }).join('');
      var rowActive = trabajoActiveCell.row === actualRow;
      return '<tr><td class="excel-row-num' + (rowActive ? ' row-active' : '') + '" onclick="selectRow(' + actualRow + ')">' + (actualRow + 1) + '</td>' + cells + '</tr>';
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
          '<button class="btn btn-secondary" style="font-size:11px;padding:3px 8px" onclick="toggleSheetLock()" title="' + (locked ? 'Desbloquear hoja para editar' : 'Bloquear hoja para proteger datos') + '">' + (locked ? '🔒' : '🔓') + '</button>' +
        '</div>' +
      '</div>' +
      '<div style="flex:1;overflow:auto;position:relative" id="trabajoScrollWrap">' +
        '<table id="trabajoTable" style="border-collapse:collapse;min-width:100%">' +
          '<thead style="position:sticky;top:0;z-index:2"><tr>' +
            '<th style="width:40px;background:var(--bg-primary);border-right:1px solid var(--border);border-bottom:1px solid var(--border);cursor:pointer;position:sticky;top:0;z-index:3;left:0" onclick="selectAll()" title="Seleccionar todo"></th>' +
            colHeaders +
          '</tr></thead>' +
          '<tbody id="trabajoTableBody" style="font-family:monospace">' + bodyRows + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div style="display:flex;gap:0;border-top:1px solid var(--border);flex-shrink:0;background:var(--card-bg);align-items:stretch">' +
        '<div style="overflow-x:auto;flex:1;min-width:0;display:flex;gap:0;align-items:stretch">' +
          getTrabajoTabsHTML() +
        '</div>' +
        '<div style="padding:4px 12px;font-size:11px;color:var(--accent);cursor:pointer;display:flex;align-items:center;flex-shrink:0" onclick="createNewSheet()" title="Nueva hoja">+</div>' +
        '<div style="margin-left:auto;padding:4px 12px;font-size:11px;color:var(--text-faint);display:flex;align-items:center;gap:6px;flex-shrink:0">' +
          (totalRows > trabajoPageSize ? '<button class="btn btn-secondary" style="font-size:10px;padding:2px 6px" onclick="trabajoGoPage(0)" ' + (trabajoPage===0?'disabled':'') + '>⏮</button>' +
          '<button class="btn btn-secondary" style="font-size:10px;padding:2px 6px" onclick="trabajoGoPage(' + (trabajoPage-1) + ')" ' + (trabajoPage===0?'disabled':'') + '>◀</button>' +
          '<span>' + (trabajoPage+1) + '/' + totalPages + '</span>' +
          '<button class="btn btn-secondary" style="font-size:10px;padding:2px 6px" onclick="trabajoGoPage(' + (trabajoPage+1) + ')" ' + (trabajoPage>=totalPages-1?'disabled':'') + '>▶</button>' +
          '<button class="btn btn-secondary" style="font-size:10px;padding:2px 6px" onclick="trabajoGoPage(' + (totalPages-1) + ')" ' + (trabajoPage>=totalPages-1?'disabled':'') + '>⏭</button>' +
          '<select style="font-size:10px;padding:1px 4px;background:var(--bg-primary);color:var(--text-muted);border:1px solid var(--border);border-radius:4px" onchange="trabajoChangePageSize(parseInt(this.value))">' +
            '<option value="100"' + (trabajoPageSize===100?' selected':'') + '>100</option>' +
            '<option value="200"' + (trabajoPageSize===200?' selected':'') + '>200</option>' +
            '<option value="500"' + (trabajoPageSize===500?' selected':'') + '>500</option>' +
            '<option value="1000"' + (trabajoPageSize===1000?' selected':'') + '>1000</option>' +
          '</select>' : '') +
          totalRows + ' filas · ' + cols.length + ' cols · Pila deshacer: ' + undoStack.length + ' · ' + (locked ? '🔒 Bloqueado' : '🔓 Editable') + '</div>' +
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
  visualizacion: function() { return '<div class="page-body viz-root" style="display:flex;flex-direction:column;height:100%;padding:0;overflow:hidden">' +
    '<div class="hdr" style="display:flex;align-items:center;gap:10px;padding:11px 18px;border-bottom:1px solid var(--sep);background:var(--bg1);flex-shrink:0">' +
      '<span style="font-size:18px">📊</span>' +
      '<div class="hdr-title" style="font-size:14px;font-weight:700;letter-spacing:-.2px">Visualización</div>' +
      '<div style="font-size:10px;padding:2px 9px;border-radius:99px;background:var(--accDim);color:var(--acc2);font-weight:700;letter-spacing:.6px">MÓDULO</div>' +
      '<div style="margin-left:auto;display:flex;align-items:center;gap:8px">' +
        '<div style="font-size:11px;color:var(--t3);display:flex;align-items:center;gap:4px">Gráficos guardados: <strong id="vizGalCount" style="color:var(--t2);font-weight:600">0</strong></div>' +
        '<button onclick="vizClearGallery()" style="font-size:10px;padding:2px 8px;border-radius:4px;border:1px solid var(--border);background:transparent;color:var(--t3);cursor:pointer;font-family:inherit;transition:all .14s" title="Borrar todos los gráficos guardados" onmouseover="this.style.color=\'var(--accent-error)\';this.style.borderColor=\'rgba(239,68,68,.4)\'" onmouseout="this.style.color=\'var(--t3)\';this.style.borderColor=\'var(--border)\'">✕ Todo</button>' +
      '</div>' +
    '</div>' +
    '<div class="gallery" id="vizGallery"><div class="gal-label">Guardados</div></div>' +
    '<div class="chart-area">' +
      '<div class="empty-state" id="vizEmptyState">' +
        '<div class="empty-icon">📈</div>' +
        '<h3>Sin gráfico activo</h3>' +
        '<p>Configura las opciones en el panel izquierdo y pulsa Renderizar para generar tu visualización</p>' +
        '<div class="empty-steps">' +
          '<div class="estep"><div class="estep-num">1</div>Tipo</div>' +
          '<div class="estep"><div class="estep-num">2</div>Variables</div>' +
          '<div class="estep"><div class="estep-num">3</div>Estilo</div>' +
          '<div class="estep"><div class="estep-num">4</div>Renderizar</div>' +
        '</div>' +
      '</div>' +
      '<div class="chart-wrapper" id="vizChartWrapper">' +
        '<div class="chart-type-tag" id="vizChartTypeTag"></div>' +
        '<div class="chart-ttl" id="vizChartTtl"></div>' +
        '<div class="canvas-wrap"><canvas id="vizMainChart"></canvas></div>' +
      '</div>' +
    '</div>' +
    '<div class="toolbar">' +
      '<div class="toolbar-info" id="vizToolbarInfo">Sin datos renderizados</div>' +
      '<span id="vizGalNav" style="display:none;gap:4px;align-items:center">' +
        '<button class="tbtn" onclick="_V_galleryNavigate(-1)" title="Anterior">◀</button>' +
        '<button class="tbtn" onclick="_V_galleryNavigate(1)" title="Siguiente">▶</button>' +
        '<span style="font-size:10px;color:var(--t3);margin-left:2px">A / D</span>' +
      '</span>' +
      '<button class="tbtn" onclick="vizExportPNG()">PNG</button>' +
      '<button class="tbtn tbtn-acc" onclick="vizToggleFS()">⛶ Pantalla completa</button>' +
    '</div>' +
  '</div>'; },
  reportes: function() { return '<div class="page-body"><div id="reportes-editor-container"></div></div>'; },
  auditoria: function() { return '<div class="page-body"><div id="auditoria-container" style="width:100%"></div></div>'; },
  usuarios: function() { return '<div class="page-body"><div id="usuarios-container" style="width:100%"></div></div>'; },
  ml: function() { return typeof MLManager !== 'undefined' ? MLManager.buildRightPanel() : ''; },
  firmarReporte: function() { return '<div class="page-body" style="display:flex;flex-direction:column;gap:12px;height:100%">' +
    '<div class="page-card" style="flex:1;display:flex;flex-direction:column;min-height:0">' +
      '<div class="page-card-header"><span class="page-card-icon">📄</span><span class="page-card-title">Vista previa del reporte</span><button onclick="firmaToggleFS()" style="margin-left:auto;padding:5px 10px;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;background:rgba(124,106,247,.12);color:#9d94f5;border:none;font-family:inherit;transition:all .14s;display:flex;align-items:center" title="Pantalla completa" onmouseover="this.style.background=\'rgba(124,106,247,.22)\'" onmouseout="this.style.background=\'rgba(124,106,247,.12)\'"><span style="font-size:22px;line-height:1">⛶</span></button></div>' +
      '<div class="page-card-body" id="firmaPreview" style="flex:1;padding:0;overflow:auto;display:flex;align-items:center;justify-content:center;min-height:300px">' +
        '<div style="color:var(--text-faint);font-size:13px">Carga un reporte .html para previsualizarlo aquí</div></div></div></div>'; },
  'modelo-estadistico': function() { return typeof MLStatsManager !== 'undefined' ? MLStatsManager.renderModelPage() : '<div class="page-body"><div style="color:var(--text-faint)">Modelo no disponible</div></div>'; },
  dispositivos: function() { return '<div class="page-body"><div id="dsp-container"></div></div>'; }
};

var pageIcons  = { trabajo:'📋', datos:'📊', analisis:'🔬', visualizacion:'📈', reportes:'📄', firmarReporte:'✍️', ml:'🧠', auditoria:'📋', usuarios:'👥', 'modelo-estadistico':'🧠', dispositivos:'🖥️' };
var pageTitles = { trabajo:'Hoja de Trabajo', datos:'Gestión de Datos', analisis:'Análisis Estadístico', visualizacion:'Visualización', reportes:'Reportes', firmarReporte:'Firmar Reporte', ml:'ML Analysis', auditoria:'Auditoría', usuarios:'Usuarios', 'modelo-estadistico':'Modelo Estadístico', dispositivos:'Dispositivos' };

function loadPage(name) {
  try {
  if (name !== 'login' && typeof _getAllowedPages === 'function') {
    var allowed = _getAllowedPages();
    if (allowed.indexOf(name) === -1) {
      showToast('🔒 No tienes acceso a esta página');
      var fallback = allowed.length ? allowed[0] : 'datos';
      if (name !== fallback) { name = fallback; } else { return; }
    }
  }
  currentPage = name;
  document.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });
  var navEl = document.querySelector('[data-page="' + name + '"]');
  if (navEl) navEl.classList.add('active');
  var pageTab = tabbar.querySelector('[data-page-tab="' + name + '"]');
  if (!pageTab) {
    pageTab = document.createElement('div'); pageTab.className = 'tab'; pageTab.dataset.pageTab = name;
    pageTab.innerHTML = '<span class="tab-icon">' + pageIcons[name] + '</span> ' + pageTitles[name] + ' <span class="tab-close">×</span>';
    tabbar.insertBefore(pageTab, tabbar.querySelector('.tabbar-spacer'));
    pageTab.querySelector('.tab-close').addEventListener('click', function(e){ closeTab(pageTab, e); });
    pageTab.addEventListener('click', function(e){ if (!e.target.classList.contains('tab-close')) { makeTabActive(pageTab); try{loadPage(name)}catch(ex){showToast('Error: '+ex.message,1)} } });
  }
  makeTabActive(pageTab);
  leftPaneTitle.textContent = pageTitles[name];
  rightPaneTitle.textContent = pageTitles[name];
  var leftFn = leftPanels[name];
  try { leftPaneBody.innerHTML = leftFn ? leftFn() : ''; } catch(e) { leftPaneBody.innerHTML = '<div style="padding:20px;color:#f87171;font-size:13px">Error en panel izquierdo: ' + escapeHtml(e.message) + '</div>'; }
  leftPaneBody.style.overflow = (name === 'datos') ? 'hidden' : '';
  document.getElementById('paneLeft')?.classList.toggle('pane-reportes', name === 'reportes');
  document.getElementById('paneLeft')?.classList.toggle('pane-ml', name === 'ml');
  document.getElementById('paneLeft')?.classList.toggle('pane-trabajo', name === 'trabajo');
  var rightFn = rightPanels[name];
  try { rightPaneBody.innerHTML = rightFn ? rightFn() : '<div class="page-body"><div style="color:var(--text-faint)">Página no encontrada</div></div>'; } catch(e) { rightPaneBody.innerHTML = '<div class="page-body"><div style="padding:20px;color:#f87171;font-size:13px">Error al cargar página: ' + escapeHtml(e.message) + '</div></div>'; }
  if (name === 'datos' || name === 'trabajo') rightPaneBody.classList.add('flush');
  else rightPaneBody.classList.remove('flush');

  if (name === 'analisis') { setTimeout(function() { try {
    updateAnalisisDatasetBadge();
    updateColumnAnalysisSummary();
  } catch(e) { showToast('Error en análisis: ' + e.message, 1); } }, 30); }
  if (name === 'datos') { setTimeout(function() { try { initDatosPage(); } catch(e) { showToast('Error en datos: ' + e.message, 1); } }, 60); }
  if (name === 'trabajo') { setTimeout(function() { try { initTrabajoKeyboard(); renderLimitsPanel(); } catch(e) { showToast('Error en trabajo: ' + e.message, 1); } }, 30); }
  if (name === 'visualizacion') {
    var pl = document.getElementById('paneLeft');
    if (pl) pl.style.width = '480px';
    setTimeout(function() { try { initVizPage(); } catch(e) { showToast('Error en visualización: ' + e.message, 1); } }, 60);
  }
  if (name === 'reportes') { setTimeout(function() { try { if (typeof ReporteManager !== 'undefined') ReporteManager.buildReportesView(); } catch(e) { showToast('Error en reportes: ' + e.message, 1); } }, 60); }
  if (name === 'auditoria') { setTimeout(function() { try {
    if (!_auditoriaInited && typeof AuditoriaManager !== 'undefined') { AuditoriaManager.init(API_URL); _auditoriaInited = true; }
    if (typeof AuditoriaManager !== 'undefined') AuditoriaManager.buildView();
  } catch(e) { showToast('Error en auditoría: ' + e.message, 1); } }, 60); }
  if (name === 'usuarios') { setTimeout(function() { try {
    if (!_usuariosInited && typeof UsuariosManager !== 'undefined') { UsuariosManager.init(API_URL); _usuariosInited = true; }
    if (typeof UsuariosManager !== 'undefined') UsuariosManager.buildView();
  } catch(e) { showToast('Error en usuarios: ' + e.message, 1); } }, 60); }
  if (name === 'firmarReporte') { setTimeout(function() { try { initFirmarReportePage(); } catch(e) { showToast('Error en firma: ' + e.message, 1); } }, 60); }
  if (name === 'ml') { setTimeout(function() { try { if (typeof MLManager !== 'undefined') MLManager.init(); } catch(e) { showToast('Error en ML: ' + e.message, 1); } }, 60); }
  if (name === 'modelo-estadistico') { setTimeout(function() { try { if (typeof MLStatsManager !== 'undefined') MLStatsManager.init(); } catch(e) { showToast('Error en modelo: ' + e.message, 1); } }, 60); }
  if (name === 'dispositivos') { setTimeout(function() { try { if (typeof DispositivosManager !== 'undefined') { DispositivosManager.init(API_URL); DispositivosManager.buildView(); } } catch(e) { showToast('Error en dispositivos: ' + e.message, 1); } }, 60); }
  updateBottomNav(name);
  updateToolsMenuState();
  updateRibbonNavPopup();
  } catch(e) { showToast('Error al cambiar de página: ' + e.message, 1); }
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

document.querySelector('.sidebar-nav')?.addEventListener('click', function(e) {
  var item = e.target.closest('.nav-item[data-page]');
  if (item) loadPage(item.dataset.page);
});

// Sync sidebar nav icons from pageIcons map
document.querySelectorAll('.nav-item[data-page] .nav-icon').forEach(function(el){
  var page = el.closest('.nav-item').dataset.page;
  if (page && pageIcons[page]) el.textContent = pageIcons[page];
});

// ── Ribbon nav popup (collapsed sidebar) ──
function buildRibbonNavPopup() {
  var popup = document.getElementById('ribbonNavPopup');
  if (!popup) return;
  popup.innerHTML = '';
  document.querySelectorAll('.nav-item[data-page]').forEach(function(item) {
    var page = item.dataset.page;
    if (typeof _getAllowedPages === 'function' && _getAllowedPages().indexOf(page) === -1) return;
    var icon = pageIcons[page] || '📄';
    var label = pageTitles[page] || page;
    var el = document.createElement('div');
    el.className = 'ribbon-nav-item' + (currentPage === page ? ' active' : '');
    el.innerHTML = '<span>' + icon + '</span> <span>' + label + '</span>';
    el.addEventListener('click', function() {
      loadPage(page);
      document.getElementById('ribbonNavPopup').classList.remove('open');
    });
    popup.appendChild(el);
  });
}

function updateRibbonNavPopup() {
  document.querySelectorAll('.ribbon-nav-item').forEach(function(el, i) {
    var pages = Object.keys(pageIcons);
    el.classList.toggle('active', pages[i] === currentPage);
  });
}

buildRibbonNavPopup();

// ── Mobile sidebar backdrop close ──
document.getElementById('sidebarBackdrop')?.addEventListener('click', function() {
  document.getElementById('sidebar')?.classList.remove('open');
  this.classList.remove('show');
});

// ── Restore sidebar collapsed state (desktop only) ──
try {
  if (window.innerWidth > 768) {
    var savedCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    var sidebar = document.getElementById('sidebar');
    var toggle = document.getElementById('sidebarToggle');
    if (savedCollapsed && sidebar && toggle) {
      sidebar.classList.add('collapsed');
      toggle.classList.add('rotated');
    }
  }
} catch(e) {}

// ── Zoom ──
var _zoomLevel = (function(){ try { return parseInt(localStorage.getItem('zoomLevel')) || 100; } catch(e){ return 100; } })();
function applyZoom() {
  document.body.style.zoom = _zoomLevel + '%';
  var el = document.getElementById('zoomValue');
  if (el) el.textContent = _zoomLevel;
  try { localStorage.setItem('zoomLevel', _zoomLevel); } catch(e) {}
}
function zoomIn() { if (_zoomLevel < 200) { _zoomLevel = Math.min(200, _zoomLevel + 10); applyZoom(); } }
function zoomOut() { if (_zoomLevel > 50) { _zoomLevel = Math.max(50, _zoomLevel - 10); applyZoom(); } }
applyZoom();

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

// ═══════════════════════════════════════
// BOTTOM NAVIGATION BAR
// ═══════════════════════════════════════
const WORKFLOW = [
  { id: 'datos',          icon: '📊', name: 'Datos' },
  { id: 'trabajo',        icon: '📋', name: 'Hoja de Trabajo' },
  { id: 'analisis',       icon: '🔬', name: 'Análisis' },
  { id: 'visualizacion',  icon: '📈', name: 'Visualización' },
  { id: 'reportes',       icon: '📄', name: 'Reportes' },
  { id: 'firmarReporte',  icon: '✍️', name: 'Firmar Reporte' },
];

const workflowIds = WORKFLOW.map(p => p.id);

function updateBottomNav(name) {
  var dotsEl   = document.getElementById('stepIndicator');
  var navLabel = document.getElementById('navCurrentPage');
  var btnPrev  = document.getElementById('btnPrev');
  var btnNext  = document.getElementById('btnNext');
  if (!dotsEl || !navLabel) return;

  var icon = pageIcons[name] || '📄';
  var title = pageTitles[name] || name;
  navLabel.textContent = icon + ' ' + title;

  var idx = workflowIds.indexOf(name);
  var isWorkflowPage = idx !== -1;

  dotsEl.innerHTML = '';
  WORKFLOW.forEach(function(page, i) {
    var dot = document.createElement('div');
    dot.className = 'step-dot';
    if (isWorkflowPage) {
      if (i === idx) dot.classList.add('active');
      else if (i < idx) dot.classList.add('done');
    }
    dot.title = page.name;
    dot.addEventListener('click', function() { loadPage(page.id); });
    dotsEl.appendChild(dot);
  });

  if (btnPrev) btnPrev.disabled = !isWorkflowPage || idx <= 0;
  if (btnNext) btnNext.disabled = !isWorkflowPage || idx >= WORKFLOW.length - 1;
}

// ── Bottom nav button events ──
document.getElementById('btnPrev')?.addEventListener('click', function() {
  var idx = workflowIds.indexOf(currentPage);
  if (idx > 0) loadPage(workflowIds[idx - 1]);
});
document.getElementById('btnNext')?.addEventListener('click', function() {
  var idx = workflowIds.indexOf(currentPage);
  if (idx < WORKFLOW.length - 1 && idx !== -1) loadPage(workflowIds[idx + 1]);
});

// ── Keyboard navigation ──
document.addEventListener('keydown', function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === 'ArrowLeft') {
    var idx = workflowIds.indexOf(currentPage);
    if (idx > 0) { e.preventDefault(); loadPage(workflowIds[idx - 1]); }
  }
  if (e.key === 'ArrowRight') {
    var idx = workflowIds.indexOf(currentPage);
    if (idx >= 0 && idx < WORKFLOW.length - 1) { e.preventDefault(); loadPage(workflowIds[idx + 1]); }
  }
});

