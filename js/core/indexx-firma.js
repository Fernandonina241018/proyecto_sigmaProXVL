// ════════════════════════════════════════════════════════════════
// indexx-firma.js — Report signing: load HTML, edit signatures,
//                    verify, download
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// FIRMAR REPORTE — Cargar .html, editar firmas, descargar
// ════════════════════════════════════════════════════════════════
var _firmaCurrentDoc = null;
var _firmaCurrentHtml = '';
var _firmaSignatureData = null;
var _firmaSignatureState = {};
var _firmaOriginalName = '';
var _firmaIsNewSession = false;

// Almacenamiento de estado de firma: sessionStorage (se limpia al cerrar
// el navegador) con migración automática desde localStorage legacy.
var _firmaStore = {
  get: function(k) {
    try { return sessionStorage.getItem(k) || localStorage.getItem(k); } catch(e) { return null; }
  },
  set: function(k, v) {
    try { sessionStorage.setItem(k, v); localStorage.removeItem(k); } catch(e) {}
  },
  remove: function(k) {
    try { sessionStorage.removeItem(k); localStorage.removeItem(k); } catch(e) {}
  },
  has: function(k) { return !!this.get(k); }
};

function firmaPersistState() {
  if (_firmaCurrentHtml) {
    try {
      _firmaStore.set('__firma_current_html', _firmaCurrentHtml);
      _firmaStore.set('__firma_signature_data', JSON.stringify(_firmaSignatureData));
      _firmaStore.set('__firma_signature_state', JSON.stringify(_firmaSignatureState));
      _firmaStore.set('__firma_original_name', _firmaOriginalName);
      _firmaStore.set('__firma_is_new_session', _firmaIsNewSession ? '1' : '0');
    } catch(e) {
      console.warn('Error persisting signature state:', e.message);
    }
  }
}

function firmaClearState() {
  try {
    _firmaStore.remove('__firma_current_html');
    _firmaStore.remove('__firma_signature_data');
    _firmaStore.remove('__firma_signature_state');
    _firmaStore.remove('__firma_original_name');
    _firmaStore.remove('__firma_is_new_session');
  } catch(e) {
    console.warn('Error clearing signature state:', e.message);
  }
}

function firmaHasPersistedState() {
  try {
    return !!_firmaStore.get('__firma_current_html');
  } catch(e) {
    return false;
  }
}

function firmaRestoreState() {
  try {
    var html = _firmaStore.get('__firma_current_html');
    var sigData = JSON.parse(_firmaStore.get('__firma_signature_data'));
    var sigState = JSON.parse(_firmaStore.get('__firma_signature_state'));
    var origName = _firmaStore.get('__firma_original_name');

    if (!html || !sigData) return false;

    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    if (!doc || !doc.querySelectorAll) return false;

    _firmaCurrentDoc = doc;
    _firmaCurrentHtml = html;
    _firmaSignatureData = sigData;
    _firmaSignatureState = sigState || {};
    _firmaOriginalName = origName || 'reporte.html';
    _firmaIsNewSession = _firmaStore.get('__firma_is_new_session') === '1';

    var preview = document.getElementById('firmaPreview');
    if (preview) {
      preview.innerHTML = '<iframe srcdoc="' + escapeHtml(html).replace(/"/g,'&quot;') + '" style="width:100%;height:100%;border:none;min-height:70vh"></iframe>';
    }

    firmaRenderEditor();
    _firmaUpdateReportBadge();

    var status = document.getElementById('firmaStatus');
    if (status) {
      status.style.display = 'block';
      var cnt = _firmaCountSigned();
      status.innerHTML = '<div style="font-size:11px;color:var(--accent);padding:8px 12px">↻ Sesión restaurada: ' + escapeHtml(_firmaOriginalName) + ' (' + cnt.signed + '/' + cnt.total + ' firmas)</div>';
    }

    var actions = document.getElementById('firmaActions');
    if (actions) actions.style.display = 'flex';

    return true;
  } catch(e) {
    console.warn('Error restoring signature state:', e.message);
    return false;
  }
}

function initFirmarReportePage() {
  var dropZone = document.getElementById('firmaDropZone');
  var fileInput = document.getElementById('firmaFileInput');
  var preview = document.getElementById('firmaPreview');
  var status = document.getElementById('firmaStatus');
  var actions = document.getElementById('firmaActions');

  // FASE 2 — tabs de bandeja (no dependen del dropZone)
  var bandTabs = document.querySelectorAll('#firmaTabs .firma-tab');
  bandTabs.forEach(function(t) {
    t.onclick = function() { firmaLoadBandeja(t.dataset.scope); };
  });

  if (!dropZone || !fileInput || !preview) return;

  // FASE 2 — sesión recién publicada (viene de "Enviar a firma")
  var pendingSessionId = null;
  try {
    pendingSessionId = sessionStorage.getItem('__firma_session_id');
    if (pendingSessionId) sessionStorage.removeItem('__firma_session_id');
  } catch (e) { /* ignore */ }
  if (pendingSessionId) {
    dropZone.onclick = function() { fileInput.click(); };
    fileInput.onchange = function() { if (fileInput.files.length) firmaHandleFile(fileInput.files[0]); fileInput.value = ''; };
    var downloadBtn0 = document.getElementById('firmaDownloadBtn');
    if (downloadBtn0) downloadBtn0.onclick = firmaDownload;
    var publishBtn0 = document.getElementById('firmaPublishBtn');
    if (publishBtn0) publishBtn0.onclick = firmaPublishLoaded;
    firmaLoadBandeja('pending');
    _firmaOpenSession(parseInt(pendingSessionId));
    return;
  }

  // Single event listener for reset button (exists in the left panel template)
  var resetBtn = document.getElementById('firmaResetBtn');
  if (resetBtn) resetBtn.onclick = firmaResetSignatures;

  // Check for pending report from ReporteManager (sessionStorage)
  var pendingHtml = null;
  var pendingName = null;
  try {
    pendingHtml = sessionStorage.getItem('__firma_pending_html');
    pendingName = sessionStorage.getItem('__firma_pending_name');
    if (pendingHtml) {
      sessionStorage.removeItem('__firma_pending_html');
      sessionStorage.removeItem('__firma_pending_name');
    }
  } catch(e) { /* ignore */ }

  if (pendingHtml && pendingName) {
    // Clear any old persisted state first
    firmaClearState();
    _firmaCurrentDoc = null;
    _firmaCurrentHtml = '';
    _firmaSignatureData = null;
    _firmaSignatureState = {};
  _firmaOriginalName = '';
  _firmaIsNewSession = false;
    _firmaIsNewSession = true;

    // Attach events then load
    dropZone.onclick = function(){ fileInput.click(); };
    dropZone.ondragover = function(e){ e.preventDefault(); dropZone.style.borderColor = 'var(--accent)'; dropZone.style.background = 'rgba(92,107,192,0.1)'; };
    dropZone.ondragleave = function(){ dropZone.style.borderColor = 'var(--border)'; dropZone.style.background = 'transparent'; };
    dropZone.ondrop = function(e){ e.preventDefault(); dropZone.style.borderColor = 'var(--border)'; dropZone.style.background = 'transparent'; if (e.dataTransfer.files.length) firmaHandleFile(e.dataTransfer.files[0]); };
    fileInput.onchange = function(){ if (fileInput.files.length) firmaHandleFile(fileInput.files[0]); fileInput.value = ''; };
    var downloadBtn = document.getElementById('firmaDownloadBtn');
    if (downloadBtn) downloadBtn.onclick = firmaDownload;

    firmaLoadHtml(pendingHtml, pendingName);
    return;
  }

  // If there's a persisted session, restore it instead of resetting
  if (firmaHasPersistedState()) {
    if (firmaRestoreState()) {
      // Keep drop zone events attached for loading another report
      dropZone.onclick = function(){ fileInput.click(); };
      dropZone.ondragover = function(e){ e.preventDefault(); dropZone.style.borderColor = 'var(--accent)'; dropZone.style.background = 'rgba(92,107,192,0.1)'; };
      dropZone.ondragleave = function(){ dropZone.style.borderColor = 'var(--border)'; dropZone.style.background = 'transparent'; };
      dropZone.ondrop = function(e){ e.preventDefault(); dropZone.style.borderColor = 'var(--border)'; dropZone.style.background = 'transparent'; if (e.dataTransfer.files.length) firmaHandleFile(e.dataTransfer.files[0]); };
      fileInput.onchange = function(){ if (fileInput.files.length) firmaHandleFile(fileInput.files[0]); fileInput.value = ''; };
      var downloadBtn = document.getElementById('firmaDownloadBtn');
      if (downloadBtn) downloadBtn.onclick = firmaDownload;
      var publishBtn = document.getElementById('firmaPublishBtn');
      if (publishBtn) publishBtn.onclick = firmaPublishLoaded;
      _firmaSessionId = null;
      _firmaSessionVersion = null;
      firmaLoadBandeja('pending');
      return;
    }
    // If restore fails, clear corrupted state and fall through to normal init
    firmaClearState();
  }

  // Normal init (no persisted state)
  _firmaCurrentDoc = null;
  _firmaCurrentHtml = '';
  _firmaSignatureData = null;
  _firmaSignatureState = {};
  _firmaOriginalName = '';

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

  // FASE 2 — la bandeja siempre visible al entrar (fail-open si no hay servidor)
  _firmaSessionId = null;
  _firmaSessionVersion = null;
  firmaLoadBandeja('pending');
  firmaNotifyPending();
}

function firmaLoadHtml(html, originalName) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, 'text/html');
  var sigBlocks = doc.querySelectorAll('[data-signature-role]:not([data-signature-field])');

  if (!sigBlocks.length) {
    showToast('Este reporte no contiene firmas detectables. Usa la versión más reciente de StatAnalyzer Pro.');
    return false;
  }

  _firmaCurrentDoc = doc;
  _firmaCurrentHtml = html;
  _firmaSignatureState = {};
  _firmaOriginalName = originalName;

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

  // Auto-cargar firmas existentes del reporte HTML
  _firmaSignatureState = {};
  _firmaSignatureData.forEach(function(sd) {
    if (sd.fields.name && sd.fields.name !== '' && sd.fields.name !== '\u2014') {
      _firmaSignatureState[sd.role] = {
        signed: true,
        nombre: sd.fields.name,
        cargo: sd.fields.title || '',
        firma: sd.fields.firma || '',
        fecha: sd.fields.date || ''
      };
    }
  });

  firmaRenderEditor();
  _firmaUpdateReportBadge();

  var status = document.getElementById('firmaStatus');
  if (status) {
    status.style.display = 'block';
    var cnt = _firmaCountSigned();
    status.innerHTML = '<div style="font-size:11px;color:var(--accent);padding:8px 12px">✅ Reporte cargado: ' + escapeHtml(originalName) + ' (' + cnt.signed + '/' + cnt.total + ' firmas)</div>';
  }

  var actions = document.getElementById('firmaActions');
  if (actions) actions.style.display = 'flex';

  showToast('Reporte cargado: ' + cnt.signed + '/' + cnt.total + ' firmas');

  firmaPersistState();
  return true;
}

function firmaHandleFile(file) {
  if (!file || !file.name.toLowerCase().endsWith('.html')) {
    showToast('Selecciona un archivo .html válido');
    return;
  }
  _firmaIsNewSession = false;
  var reader = new FileReader();
  reader.onload = function(e){
    firmaLoadHtml(e.target.result, file.name);
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

    var state = _firmaSignatureState && _firmaSignatureState[sd.role];
    // FASE 2 — en modo sesión solo el siguiente rol es firmable; los
    // futuros muestran espera (el servidor también lo exige).
    var _nextRole = _firmaSessionId ? _firmaSessionNext() : null;
    if (_firmaSessionId && _nextRole && sd.role !== _nextRole && !(state && state.signed)) {
      var waitRow = document.createElement('div');
      waitRow.style.cssText = 'font-size:10px;color:var(--text-faint);padding:4px 0';
      var _who = '';
      if (sd.role === 'reviewed' && _firmaSessionAssignees.reviewer) _who = ' → ' + _firmaSessionAssignees.reviewer;
      if (sd.role === 'approved' && _firmaSessionAssignees.approver) _who = ' → ' + _firmaSessionAssignees.approver;
      waitRow.textContent = '⏳ Esperando firma de "' + _roleLabel(_nextRole) + '"' + _who;
      body.appendChild(waitRow);
      card.appendChild(body);
      editor.appendChild(card);
      return;
    }
    if (state && state.signed) {
      // Show signed state
      var signedRow = document.createElement('div');
      signedRow.style.cssText = 'display:flex;align-items:center;gap:6px;color:#16a34a;font-size:11px;font-weight:600';
      signedRow.innerHTML = '\u2705 Firmado por <span id="firmaSignedName-' + sd.role + '">' + escapeHtml(state.nombre) + '</span>';
      body.appendChild(signedRow);

      var cargoRow = document.createElement('div');
      cargoRow.style.cssText = 'font-size:10px;color:var(--text-primary)';
      cargoRow.textContent = state.cargo || '\u2014';
      cargoRow.id = 'firmaSignedCargo-' + sd.role;
      body.appendChild(cargoRow);

      var firmaRow = document.createElement('div');
      firmaRow.style.cssText = 'font-size:10px;color:var(--text-faint)';
      firmaRow.innerHTML = '\uD83D\uDC3B <span id="firmaSignedFirma-' + sd.role + '">' + escapeHtml(state.firma || '\u2014') + '</span>';
      body.appendChild(firmaRow);

      var dateRow = document.createElement('div');
      dateRow.style.cssText = 'font-size:10px;color:var(--text-faint)';
      dateRow.textContent = state.fecha;
      dateRow.id = 'firmaSignedDate-' + sd.role;
      body.appendChild(dateRow);

      // FASE 2 — en modo sesión no hay "desfirmar" (el servidor no lo permite)
      if (!_firmaSessionId) {
        var resetRoleBtn = document.createElement('button');
        resetRoleBtn.textContent = '\u21BA Reiniciar';
        resetRoleBtn.style.cssText = 'margin-top:6px;padding:2px 8px;font-size:10px;background:transparent;color:var(--text-faint);border:1px solid var(--border);border-radius:4px;cursor:pointer';
        resetRoleBtn.onclick = (function(r){ return function(){ firmaRequestReset(r); }; })(sd.role);
        body.appendChild(resetRoleBtn);
      }
    } else {
      // Show code input + sign button
      var codeRow = document.createElement('div');
      codeRow.style.cssText = 'display:flex;gap:6px;align-items:end';

      var codeGroup = document.createElement('div');
      codeGroup.style.cssText = 'display:flex;flex-direction:column;gap:2px;flex:1';

      var codeLabel = document.createElement('span');
      codeLabel.style.cssText = 'font-size:9px;color:var(--text-faint);text-transform:uppercase';
      codeLabel.textContent = 'C\u00F3digo de firma';
      codeGroup.appendChild(codeLabel);

      var codeInput = document.createElement('input');
      codeInput.type = 'password';
      codeInput.placeholder = 'Ej: ABC-123';
      codeInput.style.cssText = 'background:var(--bg-primary);border:1px solid var(--border);border-radius:4px;padding:4px 6px;font-size:11px;color:var(--text-primary);outline:none;width:100%';
      codeInput.id = 'firmaCodeInput-' + sd.role;
      codeGroup.appendChild(codeInput);
      codeRow.appendChild(codeGroup);

      var signBtn = document.createElement('button');
      signBtn.textContent = '\u270D\uFE0F Firmar';
      signBtn.style.cssText = 'padding:4px 12px;font-size:11px;background:var(--accent);color:white;border:none;border-radius:4px;cursor:pointer;white-space:nowrap;height:fit-content';
      signBtn.onclick = function(r) { return function(){ firmaRequestPassword(r); }; }(sd.role);
      codeRow.appendChild(signBtn);
      body.appendChild(codeRow);

      var statusEl = document.createElement('div');
      statusEl.id = 'firmaStatusMsg-' + sd.role;
      statusEl.style.cssText = 'font-size:10px;color:var(--text-faint);min-height:16px';
      body.appendChild(statusEl);
    }

  card.appendChild(body);
  editor.appendChild(card);
  });
  firmaUpdateResetBtn();
  if (typeof firmaUpdatePublishBtn === 'function') firmaUpdatePublishBtn();
}

// FASE 3 — botón Publicar: visible solo con documento local (no sesión).
// FIX: el onclick se asigna aquí (centralizado) porque firmaRenderEditor
// corre en TODOS los caminos de carga; antes solo se conectaba en 3 de
// ellos y en archivo-cargado-a-mano el clic no hacía nada.
function firmaUpdatePublishBtn() {
  try {
    var btn = document.getElementById('firmaPublishBtn');
    if (!btn) return;
    btn.onclick = firmaPublishLoaded;
    btn.style.display = (_firmaCurrentHtml && !_firmaSessionId) ? '' : 'none';
  } catch (e) { /* fail-open */ }
}

// FASE 3 — publica el .html cargado a mano a la bandeja del servidor
async function firmaPublishLoaded() {
  if (!_firmaCurrentHtml) { showToast('Carga un reporte primero'); return; }
  if (_firmaSessionId) { showToast('Esta sesión ya está publicada (#' + _firmaSessionId + ')'); return; }
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML =
    '<div class="modal-box" style="max-width:420px">' +
    '<div class="modal-title">📤 Publicar a bandeja de firmas</div>' +
    '<div style="padding:12px 16px;display:flex;flex-direction:column;gap:10px">' +
    '<div style="font-size:11px;color:var(--text-faint)">El archivo se publica con tu firma de <b>elaboración</b>. Si trae firmas de revisión/aprobación, se rechaza (no verificables en servidor).</div>' +
    '<label style="font-size:11px">Código de firma<input id="fpub-code" type="password" style="width:100%;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);box-sizing:border-box"></label>' +
    '<label style="font-size:11px">Contraseña<input id="fpub-pass" type="password" style="width:100%;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);box-sizing:border-box"></label>' +
    '<label style="font-size:11px">Revisor (obligatorio)<select id="fpub-reviewer" style="width:100%;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);box-sizing:border-box"><option value="">Cargando…</option></select></label>' +
    '<label style="font-size:11px">Aprobador (opcional)<select id="fpub-approver" style="width:100%;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);box-sizing:border-box"><option value="">— Cualquiera elegible —</option></select></label>' +
    '<div id="fpub-err" style="font-size:11px;color:#e53e3e;min-height:16px"></div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end">' +
    '<button id="fpub-cancel" class="btn btn-secondary">Cancelar</button>' +
    '<button id="fpub-ok" class="btn btn-primary">Publicar y firmar</button>' +
    '</div></div></div>';
  document.body.appendChild(overlay);
  var selR = overlay.querySelector('#fpub-reviewer');
  var selA = overlay.querySelector('#fpub-approver');
  try {
    var data = await _firmaApiGet('/api/users/list');
    var users = (data && data.ok && data.users) || [];
    var opt = function(u) {
      var nm = [u.nombre, u.apellido].filter(Boolean).join(' ') || u.username;
      return '<option value="' + escapeHtml(u.username) + '">' + escapeHtml(nm) + ' (' + escapeHtml(u.username) + ')</option>';
    };
    selR.innerHTML = '<option value="">— Seleccionar —</option>' + users.map(opt).join('');
    selA.innerHTML = '<option value="">— Cualquiera elegible —</option>' + users.filter(function(u) {
      return u.role === 'admin' || u.role === 'coordinador' || u.role === 'supervisor' || u.role === 'gerente';
    }).map(opt).join('');
  } catch (e) {
    selR.innerHTML = '<option value="">(sin conexión)</option>';
  }
  overlay.querySelector('#fpub-cancel').onclick = function() { overlay.remove(); };
  overlay.querySelector('#fpub-ok').onclick = async function() {
    var errEl = overlay.querySelector('#fpub-err');
    var code = overlay.querySelector('#fpub-code').value.trim();
    var pass = overlay.querySelector('#fpub-pass').value;
    var reviewer = selR.value;
    var approver = selA.value;
    if (!code || !pass) { errEl.textContent = 'Ingresa tu código de firma y contraseña.'; return; }
    if (!reviewer) { errEl.textContent = 'Debes asignar un revisor.'; return; }
    errEl.textContent = 'Publicando…';
    try {
      var res = await _firmaApiPost('/api/sign-sessions/import', {
        name: _firmaOriginalName || 'reporte.html',
        html: _firmaCurrentHtml,
        assignedReviewer: reviewer, assignedApprover: approver || null,
        signatureCode: code, password: pass
      });
      if (!res || !res.ok) { errEl.textContent = '❌ ' + ((res && res.error) || 'Error al publicar'); return; }
      overlay.remove();
      showToast('✅ Publicado a bandeja (sesión #' + res.session.id + ')');
      _firmaOpenSession(res.session.id);
    } catch (e) {
      errEl.textContent = '❌ Error de conexión con el servidor';
    }
  };
}

function firmaResetRole(role) {
  _firmaSignatureState[role] = { signed: false };
  firmaUpdatePreview(role, 'name', '—');
  firmaUpdatePreview(role, 'title', '—');
  firmaUpdatePreview(role, 'firma', '—');
  firmaUpdatePreview(role, 'date', '—');
  firmaRenderEditor();
  _firmaUpdateReportBadge();
  firmaPersistState();
  showToast('Firma reiniciada');
}

function firmaUpdateResetBtn() {
  var btn = document.getElementById('firmaResetBtn');
  if (!btn) return;
  if (!_firmaIsNewSession || !_firmaSignatureData || !_firmaSignatureData.length) { btn.style.display = 'none'; return; }
  btn.style.display = 'flex';
}

function firmaResetSignatures() {
  if (!confirm('¿Estás seguro de reiniciar todas las firmas? Esta acción no se puede deshacer.')) return;
  for (var role in _firmaSignatureState) {
    _firmaSignatureState[role] = { signed: false };
  }
  _firmaSignatureData.forEach(function(sd){
    firmaUpdatePreview(sd.role, 'name', '—');
    firmaUpdatePreview(sd.role, 'title', '—');
    firmaUpdatePreview(sd.role, 'firma', '—');
    firmaUpdatePreview(sd.role, 'date', '—');
  });
  firmaRenderEditor();
  _firmaUpdateReportBadge();
  firmaPersistState();
  showToast('Firmas reiniciadas');
}

function _firmaCountSigned() {
  if (!_firmaSignatureData) return { signed: 0, total: 0 };
  var s = 0;
  _firmaSignatureData.forEach(function(sd){
    if (_firmaSignatureState && _firmaSignatureState[sd.role] && _firmaSignatureState[sd.role].signed) s++;
  });
  return { signed: s, total: _firmaSignatureData.length };
}

function _firmaUpdateReportBadge() {
  if (!_firmaCurrentDoc) return;
  if (!_firmaCurrentDoc.getElementById('firmaPrintStyle')) {
    var styleEl = _firmaCurrentDoc.createElement('style');
    styleEl.id = 'firmaPrintStyle';
    styleEl.textContent = '@media print{#firmaProgressBadge{display:none!important}}';
    _firmaCurrentDoc.head.appendChild(styleEl);
  }
  var oldBadge = _firmaCurrentDoc.getElementById('firmaProgressBadge');
  if (oldBadge) oldBadge.remove();
  var cnt = _firmaCountSigned();
  var badge = _firmaCurrentDoc.createElement('div');
  badge.id = 'firmaProgressBadge';
  badge.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;text-align:center;padding:4px;font-size:9px;font-family:monospace;color:#fff;background:rgba(26,58,107,.85)';
  badge.textContent = '\u270D ' + cnt.signed + '/' + cnt.total + ' firmas';
  _firmaCurrentDoc.body.appendChild(badge);
  if (_firmaCurrentDoc.title) {
    var baseTitle = _firmaCurrentDoc.title.replace(/\s*—\s*\d+\/\d+ firmas.*$/, '');
    _firmaCurrentDoc.title = baseTitle + ' \u2014 ' + cnt.signed + '/' + cnt.total + ' firmas';
  }
  _firmaCurrentHtml = '<!DOCTYPE html>\n' + _firmaCurrentDoc.documentElement.outerHTML;
  var preview = document.getElementById('firmaPreview');
  if (preview) {
    var iframe = preview.querySelector('iframe');
    if (iframe) iframe.srcdoc = _firmaCurrentHtml;
  }
}

function firmaUpdatePreview(role, field, value) {
  if (!_firmaCurrentDoc) return;
  var el = _firmaCurrentDoc.querySelector('[data-signature-role="' + role + '"] [data-signature-field="' + field + '"]');
  if (el) {
    el.textContent = value || '';
    el.style.color = '#1a202c';
    el.style.fontStyle = 'normal';
    _firmaCurrentHtml = '<!DOCTYPE html>\n' + _firmaCurrentDoc.documentElement.outerHTML;
    var preview = document.getElementById('firmaPreview');
    if (preview) {
      var iframe = preview.querySelector('iframe');
      if (iframe) {
        iframe.srcdoc = _firmaCurrentHtml;
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

    // Append _firmado suffix + signature count (e.g. _firmado_2de3) to track signing progress
    var ts = new Date().toISOString().slice(0,10);
    var baseName = (_firmaOriginalName || 'reporte_firmado').replace(/\.html$/i, '');
    var signedCount = 0;
    var totalCount = _firmaSignatureData ? _firmaSignatureData.length : 0;
    if (_firmaSignatureData) {
      _firmaSignatureData.forEach(function(sd){
        if (_firmaSignatureState && _firmaSignatureState[sd.role] && _firmaSignatureState[sd.role].signed) signedCount++;
      });
    }
    a.download = baseName + '_firmado_' + signedCount + 'de' + totalCount + '_' + ts + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✅ Reporte firmado descargado');
    firmaClearState();
  } catch(e) {
    showToast('Error al descargar: ' + e.message);
  }
}
// ════════════════════════════════════════════════════════════════

// FEAT: firma-verificacion — password modal y verificación API
function firmaRequestPassword(role) {
  var codeInput = document.getElementById('firmaCodeInput-' + role);
  var statusEl = document.getElementById('firmaStatusMsg-' + role);
  var code = codeInput ? codeInput.value.trim() : '';
  if (!code) {
    if (statusEl) statusEl.textContent = '\u26A0\uFE0F Ingresa un c\u00F3digo de firma';
    return;
  }

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  var box = document.createElement('div');
  box.className = 'modal-box';
  box.style.cssText = 'max-width:360px';

  var title = document.createElement('div');
  title.className = 'modal-title';
  title.textContent = '\uD83D\uDD10 Verificar firma';
  box.appendChild(title);

  var content = document.createElement('div');
  content.style.cssText = 'padding:12px 16px;display:flex;flex-direction:column;gap:10px';

  var sd = null;
  if (_firmaSignatureData) {
    for (var i = 0; i < _firmaSignatureData.length; i++) {
      if (_firmaSignatureData[i].role === role) { sd = _firmaSignatureData[i]; break; }
    }
  }
  var signerName = sd && sd.fields && sd.fields.name && sd.fields.name !== '' && sd.fields.name !== '\u2014' ? sd.fields.name : null;
  var signerLabel = sd ? sd.label : role;
  var signerInfo = document.createElement('div');
  signerInfo.style.cssText = 'font-size:11px;color:var(--text-faint);display:flex;align-items:center;gap:6px';
  signerInfo.innerHTML = '\u270D\uFE0F Firmando como: <strong>' + escapeHtml(signerName || signerLabel) + '</strong>' + (signerName ? ' <span style="opacity:.7">(' + escapeHtml(signerLabel) + ')</span>' : '');
  content.appendChild(signerInfo);

  var pwLabel = document.createElement('label');
  pwLabel.style.cssText = 'font-size:11px;color:var(--text-primary)';
  pwLabel.textContent = 'Contrase\u00F1a';
  content.appendChild(pwLabel);

  var pwInput = document.createElement('input');
  pwInput.type = 'password';
  pwInput.style.cssText = 'width:100%;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem;outline:none';
  pwInput.placeholder = 'Ingresa tu contrase\u00F1a';
  content.appendChild(pwInput);

  // FASE 2 — al firmar reviewed en sesión, permite fijar/cambiar aprobador
  var approverSel = null;
  if (_firmaSessionId && role === 'reviewed') {
    var apLabel = document.createElement('label');
    apLabel.style.cssText = 'font-size:11px;color:var(--text-primary)';
    apLabel.textContent = 'Aprobador (opcional)';
    content.appendChild(apLabel);
    approverSel = document.createElement('select');
    approverSel.style.cssText = 'width:100%;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem;outline:none;box-sizing:border-box';
    var curAp = _firmaSessionAssignees.approver;
    approverSel.innerHTML = '<option value="">— Cualquiera elegible —</option>' +
      (curAp ? '<option value="' + escapeHtml(curAp) + '" selected>' + escapeHtml(curAp) + ' (actual)</option>' : '');
    content.appendChild(approverSel);
    _firmaApiGet('/api/users/list').then(function(data) {
      if (!data || !data.ok || !approverSel.isConnected) return;
      var opts = (data.users || []).filter(function(u) {
        return u.role === 'admin' || u.role === 'coordinador' || u.role === 'supervisor' || u.role === 'gerente';
      });
      var html = '<option value="">— Cualquiera elegible —</option>' + opts.map(function(u) {
        var nm = [u.nombre, u.apellido].filter(Boolean).join(' ') || u.username;
        var sel = (curAp && u.username === curAp) ? ' selected' : '';
        return '<option value="' + escapeHtml(u.username) + '"' + sel + '>' + escapeHtml(nm) + ' (' + escapeHtml(u.username) + ')</option>';
      }).join('');
      approverSel.innerHTML = html;
    }).catch(function() { /* fail-open: queda "cualquiera elegible" */ });
  }

  var errorEl = document.createElement('div');
  errorEl.style.cssText = 'font-size:10px;color:#ef4444;min-height:14px';
  content.appendChild(errorEl);

  var actions = document.createElement('div');
  actions.style.cssText = 'display:flex;gap:8px;justify-content:end';
  var cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.onclick = function(){ overlay.remove(); };
  actions.appendChild(cancelBtn);
  var confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn btn-primary';
  confirmBtn.textContent = 'Verificar';
  confirmBtn.onclick = function(){
    var extra = null;
    if (approverSel && approverSel.value) extra = { newAssignee: approverSel.value };
    overlay.remove();
    firmaVerify(role, code, pwInput.value, statusEl, extra);
  };
  actions.appendChild(confirmBtn);
  content.appendChild(actions);
  box.appendChild(content);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  pwInput.focus();
  pwInput.addEventListener('keydown', function(e){
    if (e.key === 'Enter') confirmBtn.click();
  });
}

async function firmaVerify(role, code, password, statusEl, extra) {
  if (!password) {
    if (statusEl) statusEl.textContent = '\u26A0\uFE0F Ingresa la contrase\u00F1a';
    return;
  }
  // FASE 2 — modo sesión: la firma vive en el servidor (orden + versión)
  if (_firmaSessionId) {
    if (statusEl) statusEl.textContent = '\u23F3 Firmando en servidor...';
    try {
      var body = { role: role, signatureCode: code, password: password, expectedVersion: _firmaSessionVersion };
      if (extra && extra.newAssignee) body.newAssignee = extra.newAssignee;
      var sres = await _firmaApiPost('/api/sign-sessions/' + _firmaSessionId + '/sign', body);
      var sdata = sres;
      if (!sdata || !sdata.ok) {
        var msg = (sdata && sdata.error) || 'Error al firmar';
        if (sdata && (sdata.code === 'stale-version' || sdata.code === 'out-of-order')) {
          await _firmaRefreshSession();
          msg += ' (estado actualizado)';
        }
        if (statusEl) statusEl.innerHTML = '\u274C ' + escapeHtml(msg);
        return;
      }
      var session = sdata.session;
      _firmaSessionVersion = session.version;
      _firmaSessionAssignees = {
        reviewer: session.assigned_reviewer || null,
        approver: session.assigned_approver || null
      };
      var st = {};
      ['prepared', 'reviewed', 'approved'].forEach(function(r) {
        var s = (session.signatures || {})[r];
        if (s && s.signed) st[r] = { signed: true, nombre: s.nombre || '', cargo: s.cargo || '', firma: s.firma || '', fecha: s.fecha || '' };
      });
      _firmaSignatureState = st;
      // Refleja en el preview igual que el flujo local
      var me = st[role] || {};
      firmaUpdatePreview(role, 'name', me.nombre || '');
      firmaUpdatePreview(role, 'title', me.cargo || '');
      firmaUpdatePreview(role, 'firma', me.firma || '');
      firmaUpdatePreview(role, 'date', me.fecha || '');
      firmaRenderEditor();
      _firmaUpdateReportBadge();
      firmaPersistState();
      firmaLoadBandeja();
      showToast('\u2705 Firma registrada en servidor: ' + (me.nombre || role));
    } catch (e) {
      console.error('Error signing session:', e);
      if (statusEl) statusEl.textContent = '\u274C Error de conexi\u00F3n con el servidor';
    }
    return;
  }
  if (statusEl) statusEl.textContent = '\u23F3 Verificando...';
  try {
    var res = await fetchWithTimeout(API_URL + '/api/verify-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signatureCode: code, password: password })
    });
    var data = await res.json();
    if (!data.ok) {
      if (statusEl) statusEl.innerHTML = '\u274C ' + escapeHtml(data.error || 'Error de verificaci\u00F3n');
      return;
    }
    var now = new Date();
    var dd=String(now.getDate()).padStart(2,'0'), mm=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][now.getMonth()], yyyy=now.getFullYear(), hh=now.getHours(), min=String(now.getMinutes()).padStart(2,'0'), ampm=hh>=12?'p.m.':'a.m.', h12=String(hh%12||12).padStart(2,'0');
    var fechaStr = dd+'/'+mm+'/'+yyyy+' '+h12+':'+min+' '+ampm;
    _firmaSignatureState[role] = {
      signed: true,
      nombre: data.nombre,
      cargo: data.cargo,
      firma: data.firma || '',
      fecha: fechaStr
    };
    firmaUpdatePreview(role, 'name', data.nombre);
    firmaUpdatePreview(role, 'title', data.cargo);
    firmaUpdatePreview(role, 'firma', data.firma || '');
    firmaUpdatePreview(role, 'date', fechaStr);
    firmaRenderEditor();
    _firmaUpdateReportBadge();
    showToast('\u2705 Firma registrada: ' + data.nombre);
    firmaPersistState();
  } catch (e) {
    console.error('Error verifying signature:', e);
    if (statusEl) statusEl.textContent = '\u274C Error de conexi\u00F3n con el servidor';
  }
}

function firmaRequestReset(role) {
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  var box = document.createElement('div');
  box.className = 'modal-box';
  box.style.cssText = 'max-width:360px';

  var title = document.createElement('div');
  title.className = 'modal-title';
  title.textContent = '\uD83D\uDD12 Reiniciar firma';
  box.appendChild(title);

  var content = document.createElement('div');
  content.style.cssText = 'padding:12px 16px;display:flex;flex-direction:column;gap:10px';

  var info = document.createElement('div');
  info.style.cssText = 'font-size:11px;color:var(--text-faint)';
  info.textContent = 'Ingresa tu c\u00F3digo de firma y contrase\u00F1a para reiniciar esta firma.';
  content.appendChild(info);

  var codeLabel = document.createElement('label');
  codeLabel.style.cssText = 'font-size:11px;color:var(--text-primary)';
  codeLabel.textContent = 'C\u00F3digo de firma';
  content.appendChild(codeLabel);

  var codeWrap = document.createElement('div');
  codeWrap.style.cssText = 'position:relative';
  var codeInput = document.createElement('input');
  codeInput.type = 'password';
  codeInput.style.cssText = 'width:100%;padding:8px 30px 8px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem;outline:none;box-sizing:border-box';
  codeInput.placeholder = 'Ej: ABC-123';
  codeWrap.appendChild(codeInput);
  var codeEye = document.createElement('button');
  codeEye.type = 'button';
  codeEye.textContent = '👁';
  codeEye.style.cssText = 'position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:13px;padding:2px;line-height:1';
  codeEye.onclick = function(){ var show = codeInput.type === 'password'; codeInput.type = show ? 'text' : 'password'; codeEye.textContent = show ? '🙈' : '👁'; };
  codeWrap.appendChild(codeEye);
  content.appendChild(codeWrap);

  var pwLabel = document.createElement('label');
  pwLabel.style.cssText = 'font-size:11px;color:var(--text-primary)';
  pwLabel.textContent = 'Contrase\u00F1a';
  content.appendChild(pwLabel);

  var pwWrap = document.createElement('div');
  pwWrap.style.cssText = 'position:relative';
  var pwInput = document.createElement('input');
  pwInput.type = 'password';
  pwInput.style.cssText = 'width:100%;padding:8px 30px 8px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem;outline:none;box-sizing:border-box';
  pwInput.placeholder = 'Ingresa tu contrase\u00F1a';
  pwWrap.appendChild(pwInput);
  var pwEye = document.createElement('button');
  pwEye.type = 'button';
  pwEye.textContent = '👁';
  pwEye.style.cssText = 'position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:13px;padding:2px;line-height:1';
  pwEye.onclick = function(){ var show = pwInput.type === 'password'; pwInput.type = show ? 'text' : 'password'; pwEye.textContent = show ? '🙈' : '👁'; };
  pwWrap.appendChild(pwEye);
  content.appendChild(pwWrap);

  var errorEl = document.createElement('div');
  errorEl.style.cssText = 'font-size:10px;color:#ef4444;min-height:14px';
  content.appendChild(errorEl);

  var actions = document.createElement('div');
  actions.style.cssText = 'display:flex;gap:8px;justify-content:end';
  var cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.onclick = function(){ overlay.remove(); };
  actions.appendChild(cancelBtn);
  var confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn btn-primary';
  confirmBtn.textContent = 'Reiniciar';
  confirmBtn.onclick = function(){
    overlay.remove();
    firmaVerifyReset(role, codeInput.value.trim(), pwInput.value);
  };
  actions.appendChild(confirmBtn);
  content.appendChild(actions);
  box.appendChild(content);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  codeInput.focus();
  codeInput.addEventListener('keydown', function(e){
    if (e.key === 'Enter') pwInput.focus();
  });
  pwInput.addEventListener('keydown', function(e){
    if (e.key === 'Enter') confirmBtn.click();
  });
}

function firmaVerifyReset(role, code, password) {
  if (!code || !password) {
    showToast('\u26A0\uFE0F Ingresa c\u00F3digo de firma y contrase\u00F1a');
    return;
  }
  fetchWithTimeout(API_URL + '/api/verify-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signatureCode: code, password: password })
  }).then(function(res){ return res.json(); }).then(function(data){
    if (!data.ok) {
      showToast('\u274C ' + (data.error || 'Credenciales inv\u00E1lidas'));
      return;
    }
    firmaResetRole(role);
    showToast('\u2705 Firma reiniciada');
  }).catch(function(e){
    console.error('Error verifying reset:', e);
    showToast('\u274C Error de conexi\u00F3n con el servidor');
  });
}

function firmaToggleFS() {
  var el = document.getElementById('firmaPreview');
  if (!el) return;
  if (!document.fullscreenElement) {
    if (el.requestFullscreen) el.requestFullscreen();
    var iframe = el.querySelector('iframe');
    if (iframe) iframe.focus();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

// ══ FASE 2 — Bandeja de firmas (sesiones en servidor) ════════════
var _firmaSessionId = null;
var _firmaSessionVersion = null;
var _firmaBandejaScope = 'pending';
var _firmaSessionAssignees = { reviewer: null, approver: null };

var _FIRMA_SIGN_ORDER = ['prepared', 'reviewed', 'approved'];

// Siguiente rol pendiente según estado local (mirror del servidor)
function _firmaSessionNext() {
  for (var i = 0; i < _FIRMA_SIGN_ORDER.length; i++) {
    var r = _FIRMA_SIGN_ORDER[i];
    if (!_firmaSignatureState || !_firmaSignatureState[r] || !_firmaSignatureState[r].signed) return r;
  }
  return null;
}

function _roleLabel(role) {
  if (!_firmaSignatureData) return role;
  for (var i = 0; i < _firmaSignatureData.length; i++) {
    if (_firmaSignatureData[i].role === role) return _firmaSignatureData[i].label || role;
  }
  return role;
}

// Refresca estado local desde el servidor (tras 409/422 o para re-sincronizar)
async function _firmaRefreshSession() {
  if (!_firmaSessionId) return;
  try {
    var data = await _firmaApiGet('/api/sign-sessions/' + _firmaSessionId);
    if (data && data.ok && data.session) {
      _firmaSessionVersion = data.session.version;
      _firmaSessionAssignees = {
        reviewer: data.session.assigned_reviewer || null,
        approver: data.session.assigned_approver || null
      };
      var st = {};
      ['prepared', 'reviewed', 'approved'].forEach(function(r) {
        var s = (data.session.signatures || {})[r];
        if (s && s.signed) st[r] = { signed: true, nombre: s.nombre || '', cargo: s.cargo || '', firma: s.firma || '', fecha: s.fecha || '' };
      });
      _firmaSignatureState = st;
      firmaRenderEditor();
      _firmaUpdateReportBadge();
      firmaPersistState();
      firmaLoadBandeja();
    }
  } catch (e) { /* fail-open: se mantiene estado local */ }
}

function _firmaApiBase() {
  try { if (typeof API_URL !== 'undefined' && API_URL) return API_URL; } catch (e) {}
  return '';
}
function _firmaAuthHeaders() {
  var t = '';
  try { if (typeof Auth !== 'undefined' && Auth.getToken) t = Auth.getToken() || ''; } catch (e) {}
  return { Authorization: 'Bearer ' + t };
}
async function _firmaApiGet(path) {
  var res = await fetchWithTimeout(_firmaApiBase() + path, { headers: _firmaAuthHeaders(), credentials: 'include' });
  return res.json();
}
async function _firmaApiPost(path, body) {
  var res = await fetchWithTimeout(_firmaApiBase() + path, {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json' }, _firmaAuthHeaders()),
    body: JSON.stringify(body), credentials: 'include'
  });
  return res.json();
}

// Aviso al entrar: toast + badge en nav si hay pendientes (fail-open,
// nunca bloquea el login). Llamado desde onLogin y al abrir la página.
async function firmaNotifyPending() {
  var n = await firmaUpdatePendingBadge();
  if (n === null || n <= 0) { _firmaSetNavBadge(0); return; }
  _firmaSetNavBadge(n);
  showToast('📥 Tienes ' + n + ' documento' + (n === 1 ? '' : 's') + ' pendiente' + (n === 1 ? '' : 's') + ' de firma');
}

function _firmaSetNavBadge(n) {
  try {
    var items = document.querySelectorAll('.nav-item[data-page="firmarReporte"]');
    items.forEach(function(el) {
      var b = el.querySelector('.firma-nav-badge');
      if (n > 0) {
        if (!b) {
          b = document.createElement('span');
          b.className = 'firma-nav-badge';
          b.style.cssText = 'margin-left:auto;font-size:9px;padding:1px 7px;border-radius:99px;background:rgba(239,68,68,.15);color:#f87171;font-weight:700';
          el.appendChild(b);
        }
        b.textContent = n > 99 ? '99+' : String(n);
      } else if (b) {
        b.remove();
      }
    });
  } catch (e) { /* fail-open */ }
}

// Badge con pendientes (retorna el conteo; null si sin servidor)
async function firmaUpdatePendingBadge() {
  var badge = document.getElementById('firmaPendingBadge');
  try {
    var data = await _firmaApiGet('/api/sign-sessions?scope=pending&count=1');
    if (!data || !data.ok) return null;
    var n = data.count || 0;
    if (badge) {
      badge.style.display = n > 0 ? 'inline-block' : 'none';
      badge.textContent = n > 99 ? '99+' : String(n);
    }
    return n;
  } catch (e) { return null; }
}

// Carga la bandeja (tabs Pendientes/Mías)
async function firmaLoadBandeja(scope) {
  if (scope) _firmaBandejaScope = scope;
  var tabs = document.querySelectorAll('#firmaTabs .firma-tab');
  tabs.forEach(function(t) {
    var active = t.dataset.scope === _firmaBandejaScope;
    t.style.cssText = 'flex:1;padding:5px 4px;font-size:10px;font-weight:700;border-radius:5px;cursor:pointer;border:1px solid ' +
      (active ? 'var(--accBorder)' : 'var(--border)') + ';background:' + (active ? 'var(--accDim)' : 'transparent') +
      ';color:' + (active ? 'var(--acc2)' : 'var(--t3)') + ';font-family:inherit';
  });
  var list = document.getElementById('firmaBandejaList');
  if (!list) return;
  list.innerHTML = '<div style="font-size:10px;color:var(--text-faint);text-align:center;padding:6px">Cargando…</div>';
  try {
    var data = await _firmaApiGet('/api/sign-sessions?scope=' + _firmaBandejaScope + '&limit=50');
    if (!data || !data.ok) throw new Error((data && data.error) || 'sin servidor');
    var sessions = data.sessions || [];
    firmaUpdatePendingBadge();
    if (!sessions.length) {
      list.innerHTML = '<div style="font-size:10px;color:var(--text-faint);text-align:center;padding:6px">' +
        (_firmaBandejaScope === 'pending' ? 'Sin documentos pendientes' : 'Sin sesiones propias') + '</div>';
      return;
    }
    list.innerHTML = '';
    sessions.forEach(function(s) {
      var div = document.createElement('div');
      div.style.cssText = 'border:1px solid var(--border);border-radius:6px;padding:7px 9px;cursor:pointer;display:flex;flex-direction:column;gap:3px';
      div.onmouseover = function() { div.style.borderColor = 'var(--accBorder)'; };
      div.onmouseout = function() { div.style.borderColor = 'var(--border)'; };
      var stLbl = s.status === 'complete' ? '✅ Completa' : ('✍️ ' + (s.signed_count || 0) + '/3' +
        (s.next_role ? ' · toca: ' + s.next_role : ''));
      var who = s.next_role === 'reviewed' && s.assigned_reviewer ? ' → ' + escapeHtml(s.assigned_reviewer)
        : s.next_role === 'approved' && s.assigned_approver ? ' → ' + escapeHtml(s.assigned_approver) : '';
      div.innerHTML = '<div style="font-size:11px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' +
        escapeHtml(s.name) + '</div>' +
        '<div style="font-size:9px;color:var(--text-faint)">#' + s.id + ' · ' + stLbl + who + '</div>';
      div.onclick = function() { _firmaOpenSession(s.id); };
      list.appendChild(div);
    });
  } catch (e) {
    list.innerHTML = '<div style="font-size:10px;color:var(--text-faint);text-align:center;padding:6px">Bandeja no disponible (sin conexión)</div>';
  }
}

// Abre una sesión del servidor en el visor (reutiliza parseo + editor)
async function _firmaOpenSession(id) {
  showToast('Abriendo sesión #' + id + '…');
  try {
    var data = await _firmaApiGet('/api/sign-sessions/' + id);
    if (!data || !data.ok) { showToast('❌ ' + ((data && data.error) || 'No se pudo abrir'), true); return; }
    var session = data.session;
    firmaClearState();
    _firmaCurrentDoc = null;
    _firmaCurrentHtml = '';
    _firmaSignatureData = null;
    _firmaSignatureState = {};
    _firmaOriginalName = session.name || 'reporte.html';
    _firmaIsNewSession = false;
    _firmaSessionId = session.id;
    _firmaSessionVersion = session.version;
    _firmaSessionAssignees = {
      reviewer: session.assigned_reviewer || null,
      approver: session.assigned_approver || null
    };
    // Parsea bloques del HTML (roles/etiquetas) y pisa el estado con el del servidor
    if (!firmaLoadHtml(session.html, _firmaOriginalName)) return;
    var st = {};
    ['prepared', 'reviewed', 'approved'].forEach(function(r) {
      var s = (session.signatures || {})[r];
      if (s && s.signed) st[r] = { signed: true, nombre: s.nombre || '', cargo: s.cargo || '', firma: s.firma || '', fecha: s.fecha || '' };
    });
    _firmaSignatureState = st;
    firmaRenderEditor();
    _firmaUpdateReportBadge();
    firmaPersistState();
    firmaLoadBandeja();
    showToast('✅ Sesión #' + session.id + ' abierta (' + (session.next_role ? 'toca: ' + session.next_role : 'completa') + ')');
  } catch (e) {
    showToast('❌ Error de conexión con el servidor', true);
  }
}
