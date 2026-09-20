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
      // P2 — sesión viva: persistir id+versión para retomar polling/refetch tras recargar.
      // Sin sesión abierta se limpian (evita id viejo pegado a un borrador nuevo).
      if (_firmaSessionId) {
        _firmaStore.set('__firma_session_id', String(_firmaSessionId));
        _firmaStore.set('__firma_session_version', String(_firmaSessionVersion == null ? '' : _firmaSessionVersion));
      } else {
        _firmaStore.remove('__firma_session_id');
        _firmaStore.remove('__firma_session_version');
      }
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
    _firmaStore.remove('__firma_session_id');
    _firmaStore.remove('__firma_session_version');
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
    // P2 — restaurar sesión viva (el init ya no los anula: el polling retoma solo).
    var _rsid = parseInt(_firmaStore.get('__firma_session_id') || '', 10);
    _firmaSessionId = isNaN(_rsid) ? null : _rsid;
    var _rsv = parseInt(_firmaStore.get('__firma_session_version') || '', 10);
    _firmaSessionVersion = isNaN(_rsv) ? null : _rsv;
    // Estado desconocido hasta revalidar (el revalidate lo sincroniza).
    _firmaSessionStatus = null;

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
      status.innerHTML = '<div class="fglass-status">↻ Sesión restaurada: ' + escapeHtml(_firmaOriginalName) + ' (' + cnt.signed + '/' + cnt.total + ' firmas)</div>';
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
  var refreshBtn = document.getElementById('firmaRefreshBtn');
  if (refreshBtn) {
    refreshBtn.onclick = function() {
      firmaLoadBandeja();
      firmaUpdatePendingBadge();
      if (_firmaSessionId) _firmaPollSession();
      showToast('🔄 Bandeja actualizada');
    };
  }
  firmaStartPolling();

  if (!dropZone || !fileInput || !preview) return;

  // FASE 2 — sesión recién publicada (viene de "Enviar a firma").
  // FIX: el ID se consume SOLO si la apertura tiene éxito; si falla o el
  // init se repite, el siguiente intento lo reintenta en vez de perderse.
  var pendingSessionId = _firmaTakePendingSession();
  if (pendingSessionId) {
    dropZone.onclick = function() { fileInput.click(); };
    fileInput.onchange = function() { if (fileInput.files.length) firmaHandleFile(fileInput.files[0]); fileInput.value = ''; };
    var downloadBtn0 = document.getElementById('firmaDownloadBtn');
    if (downloadBtn0) downloadBtn0.onclick = firmaDownload;
    var publishBtn0 = document.getElementById('firmaPublishBtn');
    if (publishBtn0) publishBtn0.onclick = firmaPublishLoaded;
    firmaLoadBandeja('pending');
    _firmaOpenSession(parseInt(pendingSessionId)).then(function(ok) {
      if (ok) _firmaClearPendingSession();
    });
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

    // P1 — borrador entrante del publicador: se muestra en el tab Cargado.
    if (firmaLoadHtml(pendingHtml, pendingName)) firmaLoadBandeja('cargado');
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
      // P2+P3 — el restore ya trae sessionId/version (el polling retoma solo).
      // Borrador local → tab Cargado; sesión de servidor → revalidar contra API.
      if (_firmaSessionId) {
        firmaLoadBandeja('pending');
        _firmaRevalidateRestored();
      } else {
        firmaLoadBandeja('cargado');
      }
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
  firmaRenderStepper();
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
    status.innerHTML = '<div class="fglass-status">✅ Reporte cargado: ' + escapeHtml(originalName) + ' (' + cnt.signed + '/' + cnt.total + ' firmas)</div>';
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
    // P1 — archivo cargado a mano = borrador: se muestra en el tab Cargado.
    if (firmaLoadHtml(e.target.result, file.name) && !_firmaSessionId) firmaLoadBandeja('cargado');
  };
  reader.readAsText(file);
}

// LAYOUT FP — stepper + encabezado de documento + hint del pie.
// Etiquetas desde el reporte con fallback corto. No toca la lógica.
function firmaRenderStepper() {
  try {
    var box = document.getElementById('firmaStepper');
    if (!box) return;
    if (!_firmaSignatureData || !_firmaSignatureData.length) { box.innerHTML = ''; }
    else {
      var shortFallback = { prepared: 'Preparado', reviewed: 'Revisado', approved: 'Aprobado' };
      var order = ['prepared', 'reviewed', 'approved'];
      var cur = null, done = 0;
      order.forEach(function(r) {
        var s = _firmaSignatureState && _firmaSignatureState[r];
        if (s && s.signed) done++;
        else if (cur === null) cur = r;
      });
      var labels = {};
      _firmaSignatureData.forEach(function(sd) {
        var base = (sd.label || '').replace(/\s+por\s*$/i, '');
        labels[sd.role] = base || shortFallback[sd.role] || sd.role;
      });
      box.innerHTML = '<div class="fp-steps">' + order.map(function(r) {
        var signed = _firmaSignatureState && _firmaSignatureState[r] && _firmaSignatureState[r].signed;
        var cls = signed ? 'is-done' : (r === cur ? 'is-now' : '');
        var dot = signed ? '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.3l2.2 2.2 4.8-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '';
        return '<div class="fp-step ' + cls + '"><span class="fp-dot">' + dot + '</span>' + escapeHtml(labels[r] || r) + '</div>';
      }).join('') + '</div>' +
        '<p class="fp-count">' + done + ' de 3 firmas' + (done === 3 ? ' · completo' : '') + '</p>';
    }
    var docName = document.getElementById('firmaDocName');
    if (docName) docName.textContent = _firmaOriginalName || 'Sin documento';
    var docState = document.getElementById('firmaDocState');
    if (docState) {
      docState.textContent = _firmaSessionId ? 'Sesión #' + _firmaSessionId
        : (_firmaIsNewSession ? '' : ((_firmaCurrentHtml && _firmaSignatureData && _firmaSignatureData.length) ? '↻ Sesión restaurada' : ''));
    }
    var hint = document.getElementById('firmaFootHint');
    if (hint) {
      var cnt = (typeof _firmaCountSigned === 'function') ? _firmaCountSigned() : { signed: 0, total: 0 };
      var missing = Math.max(0, 3 - (cnt.signed || 0));
      hint.textContent = (cnt.total > 0 && missing > 0)
        ? 'Faltan ' + missing + ' firma' + (missing > 1 ? 's' : '') + ': se descarga como borrador.' : '';
    }
    var dlBtn = document.getElementById('firmaDownloadBtn');
    if (dlBtn && _firmaSignatureData && _firmaSignatureData.length) {
      var cnt2 = (typeof _firmaCountSigned === 'function') ? _firmaCountSigned() : { signed: 0 };
      var full = (cnt2.signed || 0) >= 3;
      dlBtn.textContent = full ? '⬇ Descargar reporte firmado' : '⬇ Descargar borrador';
      dlBtn.classList.toggle('is-primary', full);
    }
  } catch (e) { /* fail-open: el editor sigue funcionando */ }
}

// Timeline liquid-glass (diseño .gl namespacado a fsg-*): riel con nodos +
// cuerpo por rol. Conserva todos los ids, handlers y textos (tests incluidos).
function firmaRenderEditor() {
  var editor = document.getElementById('firmaSignatureEditor');
  if (!editor || !_firmaSignatureData) return;
  editor.innerHTML = '';

  _firmaSignatureData.forEach(function(sd, idx){
    var state = _firmaSignatureState && _firmaSignatureState[sd.role];
    var signed = !!(state && state.signed);
    // FASE 2 — en modo sesión solo el siguiente rol es firmable; los
    // futuros muestran espera (el servidor también lo exige).
    var _nextRole = _firmaSessionId ? _firmaSessionNext() : null;
    var isCur = !signed && !!(_firmaSessionId && sd.role === _nextRole);
    var waiting = _firmaSessionId && _nextRole && sd.role !== _nextRole && !signed;

    var step = document.createElement('div');
    step.className = 'fsg-step' + (signed ? ' is-done' : (isCur ? ' cur' : ' is-todo'));
    if (isCur) step.setAttribute('aria-current', 'step');

    var rail = document.createElement('div');
    rail.className = 'fsg-rail';
    var node = document.createElement('div');
    node.className = 'fsg-node';
    if (signed) node.textContent = '✓';
    else if (isCur) node.innerHTML = '<i></i>';
    else node.textContent = String(idx + 1);
    rail.appendChild(node);
    var line = document.createElement('div');
    line.className = 'fsg-line';
    rail.appendChild(line);
    step.appendChild(rail);

    var body = document.createElement('div');
    body.className = 'fsg-bd';
    var lab = document.createElement('small');
    lab.textContent = sd.label;
    body.appendChild(lab);

    if (waiting) {
      var waitRow = document.createElement('div');
      waitRow.className = 'fsg-wait';
      var _who = '';
      if (sd.role === 'reviewed' && _firmaSessionAssignees.reviewer) _who = ' → ' + _firmaSessionAssignees.reviewer;
      if (sd.role === 'approved' && _firmaSessionAssignees.approver) _who = ' → ' + _firmaSessionAssignees.approver;
      waitRow.textContent = '⏳ Esperando firma de "' + _roleLabel(_nextRole) + '"' + _who;
      body.appendChild(waitRow);
      step.appendChild(body);
      editor.appendChild(step);
      return;
    }
    if (signed) {
      // Show signed state
      var nm = document.createElement('strong');
      nm.innerHTML = '<span id="firmaSignedName-' + sd.role + '">' + escapeHtml(state.nombre) + '</span>';
      body.appendChild(nm);

      var cargoRow = document.createElement('em');
      cargoRow.textContent = state.cargo || '\u2014';
      cargoRow.id = 'firmaSignedCargo-' + sd.role;
      body.appendChild(cargoRow);

      var firmaRow = document.createElement('span');
      firmaRow.className = 'fsg-firma';
      firmaRow.innerHTML = '\uD83D\uDC3B <span id="firmaSignedFirma-' + sd.role + '">' + escapeHtml(state.firma || '\u2014') + '</span>';
      body.appendChild(firmaRow);

      var dateRow = document.createElement('code');
      dateRow.textContent = state.fecha;
      dateRow.id = 'firmaSignedDate-' + sd.role;
      body.appendChild(dateRow);

      // Solo quien firmó (o admin) ve ↺; en sesión además solo el último rol.
      // La verificación real ocurre con código+password (servidor o local).
      if (_firmaCanSeeReset(sd.role)) {
        var resetRoleBtn = document.createElement('button');
        resetRoleBtn.textContent = '\u21BA Reiniciar';
        resetRoleBtn.className = 'fsg-reset';
        resetRoleBtn.onclick = (function(r){ return function(){ firmaRequestReset(r); }; })(sd.role);
        body.appendChild(resetRoleBtn);
      }
    } else {
      // Show code input + sign button
      var codeRow = document.createElement('div');
      codeRow.className = 'fsg-row';

      var codeInput = document.createElement('input');
      codeInput.type = 'password';
      codeInput.placeholder = 'Código de firma (Ej: ABC-123)';
      codeInput.setAttribute('aria-label', 'C\u00F3digo de firma');
      codeInput.id = 'firmaCodeInput-' + sd.role;
      codeRow.appendChild(codeInput);

      var signBtn = document.createElement('button');
      signBtn.textContent = '\u270D\uFE0F Firmar';
      signBtn.onclick = function(r) { return function(){ firmaRequestPassword(r); }; }(sd.role);
      codeRow.appendChild(signBtn);
      body.appendChild(codeRow);

      var statusEl = document.createElement('div');
      statusEl.id = 'firmaStatusMsg-' + sd.role;
      statusEl.className = 'fsg-statusmsg';
      body.appendChild(statusEl);
    }

    step.appendChild(body);
    editor.appendChild(step);
  });
  firmaUpdateResetBtn();
  if (typeof firmaUpdatePublishBtn === 'function') firmaUpdatePublishBtn();
  firmaRenderStepper();
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
    '<label style="font-size:11px">Aprobador (obligatorio)<select id="fpub-approver" style="width:100%;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);box-sizing:border-box"><option value="">— Seleccionar —</option></select></label>' +
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
    // Segregación (entrada 50): excluirme de ambas listas, igual que el modal de reportes.
    var mePub2 = null;
    try {
      var sPub2 = (typeof Auth !== 'undefined' && Auth.getSession) ? Auth.getSession() : null;
      if (sPub2) mePub2 = sPub2.username;
    } catch (e2) {}
    selR.innerHTML = '<option value="">— Seleccionar —</option>' + users.filter(function(u) { return u.username !== mePub2; }).map(opt).join('');
    selA.innerHTML = '<option value="">— Cualquiera elegible —</option>' + users.filter(function(u) {
      if (u.username === mePub2) return false;
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
    if (!approver) { errEl.textContent = 'Debes asignar un aprobador.'; return; }
    if (mePub2 && (reviewer === mePub2 || approver === mePub2)) { errEl.textContent = 'No puedes asignarte a ti mismo.'; return; }
    errEl.textContent = 'Publicando…';
    try {
      var res = await _firmaApiPost('/api/sign-sessions/import', {
        name: _firmaOriginalName || 'reporte.html',
        html: _firmaCurrentHtml,
        assignedReviewer: reviewer, assignedApprover: approver,
        signatureCode: code, password: pass,
        tzOffset: new Date().getTimezoneOffset()
      });
      if (!res || !res.ok) { errEl.textContent = '❌ ' + ((res && res.error) || 'Error al publicar'); return; }
      overlay.remove();
      showToast('✅ Publicado a bandeja (sesión #' + res.session.id + ')');
      // P1 — el borrador ya es sesión: se abre y el tab pasa a Mías.
      _firmaOpenSession(res.session.id).then(function() { firmaLoadBandeja('mine'); });
    } catch (e) {
      errEl.textContent = '❌ Error de conexión con el servidor';
    }
  };
}

// ¿Se muestra ↺ para este rol? Local: siempre (decide la verificación).
// Sesión: admin ve todos (apertura total con cascada); el resto solo su
// último rol. Sin login visible se muestra y el servidor decide.
function _firmaCanSeeReset(role) {
  var state = (_firmaSignatureState && _firmaSignatureState[role]) || {};
  if (!state.signed) return false;
  // Sesión completa y verificada: cerrada e inmutable, sin ↺ para nadie.
  if (_firmaSessionId && _firmaSessionStatus === 'complete') return false;
  if (!_firmaSessionId) return true;
  var me = null, myRole = null;
  try {
    var s = (typeof Auth !== 'undefined' && Auth.getSession) ? Auth.getSession() : null;
    if (s) { me = s.username; myRole = s.role; }
  } catch (e) {}
  if (myRole === 'admin') return true;
  var last = null;
  ['prepared', 'reviewed', 'approved'].forEach(function(r) {
    if (_firmaSignatureState[r] && _firmaSignatureState[r].signed) last = r;
  });
  if (role !== last) return false;
  if (!me) return true;
  return !!(state.username && me === state.username);
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
  // Solo admin (logueado): antes bastaba cualquier código válido.
  var _isAdmin = false;
  try {
    var _sess = (typeof Auth !== 'undefined' && Auth.getSession) ? Auth.getSession() : null;
    _isAdmin = !!(_sess && _sess.role === 'admin');
  } catch (e) {}
  if (!_isAdmin) { showToast('🔒 Solo un administrador puede reiniciar todas las firmas', true); return; }
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
    approverSel.innerHTML = '<option value="">— Conservar actual —</option>' +
      (curAp ? '<option value="' + escapeHtml(curAp) + '" selected>' + escapeHtml(curAp) + ' (actual)</option>' : '');
    content.appendChild(approverSel);
    _firmaApiGet('/api/users/list').then(function(data) {
      if (!data || !data.ok || !approverSel.isConnected) return;
      var opts = (data.users || []).filter(function(u) {
        return u.role === 'admin' || u.role === 'coordinador' || u.role === 'supervisor' || u.role === 'gerente';
      });
      var html = '<option value="">— Conservar actual —</option>' + opts.map(function(u) {
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

// Modal post-firma: confirma, muestra el siguiente paso y quita la sesión
// de MIS pendientes (dismiss; al resto no le afecta). Reemplaza el toast.
function firmaShowPostSignModal(session, role) {
  try {
    var sigs = session.signatures || {};
    var n = ['prepared', 'reviewed', 'approved'].filter(function(r) { return sigs[r] && sigs[r].signed; }).length;
    var isComplete = !session.next_role;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    var detail = isComplete
      ? 'Reporte completo (' + n + '/3). Solo queda en <b>' + escapeHtml(session.created_by || '') + '</b>, quien puede descargarlo con todas las firmas.'
      : 'Sesión #' + session.id + ' · ' + n + '/3 firmas. Sigue visible para <b>' + escapeHtml(session.assigned_approver || 'el aprobador') + '</b>. Ya no aparecerá en tus pendientes.';
    overlay.innerHTML =
      '<div class="modal-box" style="max-width:380px">' +
      '<div class="modal-title">' + (isComplete ? '✅ Reporte completo' : '✅ ' + (role === 'reviewed' ? 'Revisión' : 'Firma') + ' registrada') + '</div>' +
      '<div style="padding:12px 16px;display:flex;flex-direction:column;gap:10px">' +
      '<div style="font-size:12px;color:var(--text-primary)">' + escapeHtml(session.name || '') + '</div>' +
      '<div style="font-size:11px;color:var(--text-faint)">' + detail + '</div>' +
      '<div style="display:flex;justify-content:flex-end">' +
      '<button id="fps-ok" class="btn btn-primary">Entendido</button>' +
      '</div></div></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#fps-ok').onclick = async function() {
      overlay.remove();
      try { await _firmaApiPost('/api/sign-sessions/' + session.id + '/dismiss', {}); } catch (e) { /* ya se oculta por elegibilidad; best-effort */ }
      firmaLoadBandeja();
      firmaUpdatePendingBadge();
    };
  } catch (e) { /* fail-open: sin modal, el toast de bandeja ya informó */ }
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
      var body = { role: role, signatureCode: code, password: password, expectedVersion: _firmaSessionVersion, tzOffset: new Date().getTimezoneOffset() };
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
      _firmaSessionStatus = session.status || null;
      _firmaSessionAssignees = {
        reviewer: session.assigned_reviewer || null,
        approver: session.assigned_approver || null
      };
      var st = {};
      ['prepared', 'reviewed', 'approved'].forEach(function(r) {
        var s = (session.signatures || {})[r];
        if (s && s.signed) st[r] = { signed: true, username: s.username || '', nombre: s.nombre || '', cargo: s.cargo || '', firma: s.firma || '', fecha: s.fecha || '' };
      });
      _firmaSignatureState = st;
      // Refleja en el preview igual que el flujo local
      _firmaPaintSessionState();
      var me = st[role] || {};
      firmaRenderEditor();
      firmaUpdatePendingBadge();
      firmaShowPostSignModal(session, role);
      _firmaUpdateReportBadge();
      firmaPersistState();
      firmaLoadBandeja();
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
    var fechaStr = _firmaNowStamp();
    _firmaSignatureState[role] = {
      signed: true,
      username: data.username || '',
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
  // Pre-chequeo local (el servidor lo rechaza de todos modos con code complete).
  if (_firmaSessionId && _firmaSessionStatus === 'complete') {
    showToast('🔒 Sesión completa y verificada: no se puede reiniciar', true);
    return;
  }
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

  var reasonLabel = document.createElement('label');
  reasonLabel.style.cssText = 'font-size:11px;color:var(--text-primary)';
  reasonLabel.textContent = 'Motivo (obligatorio)';
  content.appendChild(reasonLabel);

  var reasonInput = document.createElement('input');
  reasonInput.type = 'text';
  reasonInput.placeholder = 'Ej: dato erróneo en ensayo';
  reasonInput.style.cssText = 'width:100%;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem;outline:none;box-sizing:border-box';
  content.appendChild(reasonInput);

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
    var reason = reasonInput.value.trim();
    if (!reason) {
      errorEl.textContent = '⚠️ El motivo es obligatorio';
      reasonInput.focus();
      return;
    }
    overlay.remove();
    // En sesión va al servidor; en local verifica y compara titular
    if (_firmaSessionId) firmaUnsignSession(role, codeInput.value.trim(), pwInput.value, reason);
    else firmaVerifyReset(role, codeInput.value.trim(), pwInput.value, reason);
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

function firmaVerifyReset(role, code, password, reason) {
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
    // Solo quien firmó (o admin): compara username verificado vs registrado
    var recorded = (_firmaSignatureState && _firmaSignatureState[role]) || {};
    var isAdmin = data.role === 'admin';
    if (!isAdmin && (!recorded.username || recorded.username !== data.username)) {
      showToast('\u274C Solo quien firmó puede reiniciar esta firma', true);
      return;
    }
    firmaResetRole(role);
    showToast('\u2705 Firma reiniciada' + (reason ? ': ' + reason : ''));
  }).catch(function(e){
    console.error('Error verifying reset:', e);
    showToast('\u274C Error de conexi\u00F3n con el servidor');
  });
}

// Reinicio en modo sesión: va al servidor (último rol + titular + motivo)
async function firmaUnsignSession(role, code, password, reason) {
  if (!code || !password) { showToast('⚠️ Ingresa código de firma y contraseña'); return; }
  if (!_firmaSessionId) { showToast('⚠️ Sin sesión activa'); return; }
  showToast('Reiniciando firma…');
  try {
    var data = await _firmaApiPost('/api/sign-sessions/' + _firmaSessionId + '/unsign', {
      role: role, signatureCode: code, password: password,
      expectedVersion: _firmaSessionVersion, reason: reason || ''
    });
    if (!data || !data.ok) {
      showToast('❌ ' + ((data && data.error) || 'No se pudo reiniciar'), true);
      if (data && (data.code === 'stale-version' || data.code === 'not-last')) await _firmaRefreshSession();
      return;
    }
    var session = data.session;
    _firmaSessionVersion = session.version;
    _firmaSessionStatus = session.status || null;
    var st = {};
    ['prepared', 'reviewed', 'approved'].forEach(function(r) {
      var s = (session.signatures || {})[r];
      if (s && s.signed) st[r] = { signed: true, username: s.username || '', nombre: s.nombre || '', cargo: s.cargo || '', firma: s.firma || '', fecha: s.fecha || '' };
    });
    _firmaSignatureState = st;
    // Limpia el pintado de roles sin firma (cascada admin) y pinta los vigentes
    ['prepared', 'reviewed', 'approved'].forEach(function(r) {
      if (!st[r] || !st[r].signed) {
        firmaUpdatePreview(r, 'name', '—');
        firmaUpdatePreview(r, 'title', '—');
        firmaUpdatePreview(r, 'firma', '—');
        firmaUpdatePreview(r, 'date', '—');
      }
    });
    _firmaPaintSessionState();
    firmaRenderEditor();
    _firmaUpdateReportBadge();
    firmaPersistState();
    firmaLoadBandeja();
    var _casc = (session.admin_cascade && session.admin_cascade.length)
      ? ' (invalidadas en cascada: ' + session.admin_cascade.join(', ') + ')' : '';
    showToast('✅ Firma reiniciada: ' + (reason || '') + _casc);
  } catch (e) {
    console.error('Error unsigning:', e);
    showToast('❌ Error de conexión con el servidor', true);
  }
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
// Estado de la sesión abierta (complete = cerrada e inmutable: sin ↺).
var _firmaSessionStatus = null;
var _firmaBandejaScope = 'pending';
var _firmaSessionAssignees = { reviewer: null, approver: null };

var _FIRMA_SIGN_ORDER = ['prepared', 'reviewed', 'approved'];

// Formato único de fecha de firma: dd/Mmm/AAAA HH:MM:SS AM/PM (12h, hora local).
// Ej: 19/Sep/2026 02:35:22 PM. Mirror servidor en backend/sign-stamp.js.
function _firmaNowStamp(d) {
  var t = d instanceof Date ? d : new Date();
  var p2 = function(n) { return String(n).padStart(2, '0'); };
  var mm = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][t.getMonth()];
  var h24 = t.getHours();
  var ampm = h24 >= 12 ? 'PM' : 'AM';
  var h12 = h24 % 12 || 12;
  return p2(t.getDate()) + '/' + mm + '/' + t.getFullYear() + ' ' +
    p2(h12) + ':' + p2(t.getMinutes()) + ':' + p2(t.getSeconds()) + ' ' + ampm;
}

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

// Pinta en el documento las firmas del estado (nombres/cargo/firma/fecha).
// Sin esto, la sidebar dice "firmado" pero el reporte visible y el
// descargable quedan en blanco (firmaUpdatePreview además refresca el
// iframe y _firmaCurrentHtml, que es lo que serializa firmaDownload).
function _firmaPaintSessionState() {
  if (!_firmaSignatureState) return;
  ['prepared', 'reviewed', 'approved'].forEach(function(r) {
    var s = _firmaSignatureState[r];
    if (s && s.signed) {
      firmaUpdatePreview(r, 'name', s.nombre || '');
      firmaUpdatePreview(r, 'title', s.cargo || '');
      firmaUpdatePreview(r, 'firma', s.firma || '');
      firmaUpdatePreview(r, 'date', s.fecha || '');
    }
  });
}

// Refresca estado local desde el servidor (tras 409/422 o para re-sincronizar)
async function _firmaRefreshSession() {
  if (!_firmaSessionId) return;
  try {
    var data = await _firmaApiGet('/api/sign-sessions/' + _firmaSessionId);
    if (data && data.ok && data.session) {
      _firmaSessionVersion = data.session.version;
      _firmaSessionStatus = data.session.status || null;
      _firmaSessionAssignees = {
        reviewer: data.session.assigned_reviewer || null,
        approver: data.session.assigned_approver || null
      };
      var st = {};
      ['prepared', 'reviewed', 'approved'].forEach(function(r) {
        var s = (data.session.signatures || {})[r];
        if (s && s.signed) st[r] = { signed: true, username: s.username || '', nombre: s.nombre || '', cargo: s.cargo || '', firma: s.firma || '', fecha: s.fecha || '' };
      });
      _firmaSignatureState = st;
      _firmaPaintSessionState();
      firmaRenderEditor();
      _firmaUpdateReportBadge();
      firmaPersistState();
      firmaLoadBandeja();
    }
  } catch (e) { /* fail-open: se mantiene estado local */ }
}

// Vista principal vacía (sin reporte): mismo render que el init normal.
// Usada al descartar borrador, al detectar sesión fantasma (404) y en el gate anti-fantasma.
function firmaClearMainView() {
  _firmaCurrentDoc = null;
  _firmaCurrentHtml = '';
  _firmaSignatureData = null;
  _firmaSignatureState = {};
  _firmaOriginalName = '';
  _firmaIsNewSession = false;
  _firmaSessionId = null;
  _firmaSessionVersion = null;
  _firmaSessionStatus = null;
  _firmaSessionAssignees = { reviewer: null, approver: null };
  var preview = document.getElementById('firmaPreview');
  if (preview) preview.innerHTML = '<div style="color:var(--text-faint);font-size:13px">Carga un reporte .html para previsualizarlo aquí</div>';
  var editor = document.getElementById('firmaSignatureEditor');
  if (editor) editor.innerHTML = '';
  var status = document.getElementById('firmaStatus');
  if (status) { status.style.display = 'none'; status.innerHTML = ''; }
  var actions = document.getElementById('firmaActions');
  if (actions) actions.style.display = 'none';
  try { firmaRenderStepper(); } catch (e) {}
  try { _firmaUpdateReportBadge(); } catch (e) {}
}

// P2 — revalida un snapshot restaurado contra el servidor (fail-open).
// - Versión distinta → re-apertura silenciosa + toast (fix vista congelada en móvil).
// - 404 (eliminada/purgada) → limpia el fantasma y muestra vista vacía.
// - Borrador local u offline → se conserva tal cual.
async function _firmaRevalidateRestored() {
  if (!_firmaSessionId) return; // borrador local: nada que revalidar
  try {
    var res = await fetchWithTimeout(_firmaApiBase() + '/api/sign-sessions/' + _firmaSessionId,
      { headers: _firmaAuthHeaders(), credentials: 'include' });
    if (res.status === 404) {
      firmaClearState();
      firmaClearMainView();
      showToast('La sesión guardada ya no existe en el servidor', true);
      return;
    }
    var data = await res.json();
    if (data && data.ok && data.session) {
      // Sincroniza estado aunque la versión no cambie (p.ej. snapshot restaurado).
      _firmaSessionStatus = data.session.status || null;
      firmaRenderEditor();
    }
    if (data && data.ok && data.session && data.session.version !== _firmaSessionVersion) {
      await _firmaOpenSession(_firmaSessionId, true);
      showToast('🔄 Sesión actualizada desde el servidor');
    }
  } catch (e) { /* fail-open: se conserva el snapshot */ }
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
    var items = document.querySelectorAll('.snav-card[data-page="firmarReporte"]');
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

// Estatus vivo: polling ligero (30s, solo pestaña visible y en esta página)
// + botón manual. Si la sesión abierta cambió de versión, la re-abre.
var _firmaPollTimer = null;

function firmaStartPolling() {
  firmaStopPolling();
  try {
    _firmaPollTimer = setInterval(function() {
      try {
        if (typeof document !== 'undefined' && document.hidden) return;
        if (typeof currentPage !== 'undefined' && currentPage !== 'firmarReporte') return;
        firmaLoadBandeja();
        firmaUpdatePendingBadge();
        if (_firmaSessionId) _firmaPollSession();
      } catch (e) { /* fail-open */ }
    }, 30000);
  } catch (e) { /* fail-open */ }
}

function firmaStopPolling() {
  try { if (_firmaPollTimer) { clearInterval(_firmaPollTimer); _firmaPollTimer = null; } } catch (e) {}
}

async function _firmaPollSession() {
  if (!_firmaSessionId) return;
  try {
    var data = await _firmaApiGet('/api/sign-sessions/' + _firmaSessionId);
    if (data && data.ok && data.session && data.session.version !== _firmaSessionVersion) {
      await _firmaOpenSession(_firmaSessionId, true);
      showToast('🔄 La sesión se actualizó (otro usuario firmó)');
    }
  } catch (e) { /* fail-open: se reintenta en 30s */ }
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

// P1 — Tab "Cargado": borrador local (sin sesión de servidor). No consulta API.
function firmaRenderCargado(list) {
  if (!list) return;
  list.innerHTML = '';
  if (_firmaCurrentHtml && !_firmaSessionId) {
    var cnt = (typeof _firmaCountSigned === 'function') ? _firmaCountSigned() : { signed: 0, total: 3 };
    var div = document.createElement('div');
    div.className = 'fglass-item';
    div.style.cursor = 'default';
    div.innerHTML =
      '<div class="fglass-name">📄 ' + escapeHtml(_firmaOriginalName || 'reporte.html') + '</div>' +
      '<div class="fglass-meta">Borrador local · ' + (cnt.signed || 0) + '/' + (cnt.total || 3) + ' firmas · sin publicar</div>' +
      '<div class="fglass-row">' +
      '<button data-cargado-pub class="fglass-btn is-primary">📤 Publicar</button>' +
      '<button data-cargado-del class="fglass-btn">🗑</button>' +
      '</div>';
    div.querySelector('[data-cargado-pub]').onclick = function() { firmaPublishLoaded(); };
    div.querySelector('[data-cargado-del]').onclick = function() { firmaDiscardDraft(); };
    list.appendChild(div);
  } else {
    list.innerHTML = '<div class="fglass-hint">Sin borrador — carga un .html en "Cargar reporte"</div>';
  }
}

// Descarta el borrador local (con confirmación: es trabajo no publicado).
function firmaDiscardDraft() {
  if (_firmaSessionId) return; // con sesión abierta no hay borrador que descartar
  if (!confirm('¿Descartar el borrador cargado? Esta acción no se puede deshacer.')) return;
  firmaClearState();
  firmaClearMainView();
  firmaLoadBandeja('cargado');
  showToast('Borrador descartado');
}

// Carga la bandeja (tabs Pendientes/Mías/Cargado)
async function firmaLoadBandeja(scope) {
  if (scope) _firmaBandejaScope = scope;
  var tabs = document.querySelectorAll('#firmaTabs .firma-tab');
  tabs.forEach(function(t) {
    var active = t.dataset.scope === _firmaBandejaScope;
    t.classList.toggle('act', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  var list = document.getElementById('firmaBandejaList');
  if (!list) return;
  if (_firmaBandejaScope === 'cargado') { firmaRenderCargado(list); return; }
  list.innerHTML = '<div class="fglass-hint">Cargando…</div>';
  try {
    var data = await _firmaApiGet('/api/sign-sessions?scope=' + _firmaBandejaScope + '&limit=50');
    if (!data || !data.ok) throw new Error((data && data.error) || 'sin servidor');
    var sessions = data.sessions || [];
    firmaUpdatePendingBadge();
    if (!sessions.length) {
      list.innerHTML = '<div class="fglass-hint">' +
        (_firmaBandejaScope === 'pending' ? 'Sin documentos pendientes' : 'Sin sesiones propias') + '</div>';
      return;
    }
    list.innerHTML = '';
    sessions.forEach(function(s) {
      var div = document.createElement('div');
      div.className = 'fglass-item has-side';
      var stLbl = s.status === 'complete' ? '✅ Completa'
        : s.status === 'rejected' ? '🚫 Rechazada' + (s.rejected_by ? ' por ' + s.rejected_by : '')
        : ('✍️ ' + (s.signed_count || 0) + '/3' + (s.next_role ? ' · toca: ' + s.next_role : ''));
      var who = s.next_role === 'reviewed' && s.assigned_reviewer ? ' → ' + escapeHtml(s.assigned_reviewer)
        : s.next_role === 'approved' && s.assigned_approver ? ' → ' + escapeHtml(s.assigned_approver) : '';
      var _me = null;
      try { var _sess = (typeof Auth !== 'undefined' && Auth.getSession) ? Auth.getSession() : null; if (_sess) _me = _sess; } catch (e) {}
      var _isMine = _me && (s.created_by === _me.username || _me.role === 'admin');
      var btnsHtml = '';
      if (s.status !== 'complete' && s.status !== 'rejected') {
        btnsHtml += '<button data-reject="' + s.id + '" title="Rechazar y sacar de pendientes" class="fglass-btn is-round40">🚫</button>';
      }
      // En Mías: eliminar rechazadas (creador o admin) para limpiar reemplazos,
      // y completas (con alerta + descarga previa recomendada).
      if (_firmaBandejaScope === 'mine' && _isMine && (s.status === 'rejected' || s.status === 'complete')) {
        if (s.status === 'complete') {
          btnsHtml += '<button data-del-complete="' + s.id + '" data-name="' + escapeHtml(s.name) + '" title="Eliminar reporte completo (recomienda descargar antes)" class="fglass-btn is-danger is-round40">🗑</button>';
        } else {
          btnsHtml += '<button data-del="' + s.id + '" title="Eliminar definitivamente (ya rechazada)" class="fglass-btn is-danger is-round40">🗑</button>';
        }
      }
      var headHtml = '<div class="fglass-main">' +
        '<div class="fglass-name">' + escapeHtml(s.name) + '</div>';
      headHtml += '</div>';
      // LOTE A — aviso de expiración por retención (182 complete / 90 rejected)
      var _expTxt = '';
      try {
        if ((s.status === 'complete' || s.status === 'rejected') && s.updated_at) {
          var _days = s.status === 'complete' ? 182 : 90;
          var _expMs = new Date(s.updated_at).getTime() + _days * 86400000 - Date.now();
          if (_expMs > 0 && _expMs < 30 * 86400000) {
            var _expD = new Date(new Date(s.updated_at).getTime() + _days * 86400000);
            var _mm = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][_expD.getMonth()];
            var _p2 = function(n) { return String(n).padStart(2, '0'); };
            _expTxt = ' · ⏳ expira ' + _p2(_expD.getDate()) + '/' + _mm + '/' + _expD.getFullYear();
          }
        }
      } catch (_e) { /* fail-open */ }
      div.innerHTML = headHtml +
        '<div class="fglass-meta">#' + s.id + ' · ' + escapeHtml(stLbl) + who +
        (s.status === 'rejected' && s.rejected_reason ? ' · “' + escapeHtml(s.rejected_reason) + '”' : '') + escapeHtml(_expTxt) + '</div></div>' +
        (btnsHtml ? '<div class="fglass-side">' + btnsHtml + '</div>' : '');
      div.onclick = function() { _firmaOpenSession(s.id); };
      list.appendChild(div);
    });
    list.querySelectorAll('[data-reject]').forEach(function(btn) {
      btn.onclick = function(e) {
        e.stopPropagation();
        firmaRejectSession(parseInt(btn.getAttribute('data-reject')));
      };
    });
    list.querySelectorAll('[data-del]').forEach(function(btn) {
      btn.onclick = function(e) {
        e.stopPropagation();
        firmaDeleteSession(parseInt(btn.getAttribute('data-del')));
      };
    });
    list.querySelectorAll('[data-del-complete]').forEach(function(btn) {
      btn.onclick = function(e) {
        e.stopPropagation();
        firmaDeleteComplete(parseInt(btn.getAttribute('data-del-complete')), btn.getAttribute('data-name'));
      };
    });
  } catch (e) {
    list.innerHTML = '<div class="fglass-hint">Bandeja no disponible (sin conexión)</div>';
  }
}

// Rechaza una sesión: pide motivo (opcional), la marca y la saca de pendientes
async function firmaRejectSession(id) {
  var reason = null;
  try {
    reason = prompt('Motivo del rechazo (opcional):');
    if (reason === null) return; // Cancelar = no hacer nada
  } catch (e) { reason = ''; }
  try {
    var data = await _firmaApiPost('/api/sign-sessions/' + id + '/reject', { reason: reason || '' });
    if (!data || !data.ok) {
      showToast('❌ ' + ((data && data.error) || 'No se pudo rechazar'), true);
      return;
    }
    // Si era la sesión abierta, se cierra la vista de verdad (limpia pintado
    // y snapshot; la rechazada sigue en Mías y se re-abre con clic).
    if (_firmaSessionId === id) { firmaClearState(); firmaClearMainView(); }
    showToast('🚫 Sesión #' + id + ' rechazada');
    firmaLoadBandeja();
    firmaUpdatePendingBadge();
  } catch (e) {
    showToast('❌ Error de conexión con el servidor', true);
  }
}

// Elimina definitivamente una sesión rechazada (creador o admin).
// La auditoría conserva SIGN_SESSION_REJECT como rastro.
async function firmaDeleteSession(id) {
  var ok = false;
  try {
    ok = confirm('¿Eliminar definitivamente la sesión #' + id + '? Solo se puede porque ya fue rechazada.');
  } catch (e) { ok = true; }
  if (!ok) return;
  await _firmaDoDelete(id);
}

// Núcleo del borrado (DELETE + limpieza + refresco). Lo usan el confirm de
// rechazadas y el modal de completas (con descarga previa recomendada).
async function _firmaDoDelete(id) {
  try {
    var res = await fetchWithTimeout(_firmaApiBase() + '/api/sign-sessions/' + id, {
      method: 'DELETE', headers: _firmaAuthHeaders(), credentials: 'include'
    });
    var data = await res.json();
    if (!data || !data.ok) {
      showToast('❌ ' + ((data && data.error) || 'No se pudo eliminar'), true);
      return false;
    }
    // Si era la sesión abierta, se limpia vista + snapshot (antes quedaba el
    // reporte fantasma pintado con las bandejas vacías).
    if (_firmaSessionId === id) { firmaClearState(); firmaClearMainView(); }
    showToast('🗑 Sesión #' + id + ' eliminada');
    firmaLoadBandeja();
    firmaUpdatePendingBadge();
    return true;
  } catch (e) {
    showToast('❌ Error de conexión con el servidor', true);
    return false;
  }
}

// Eliminar reporte COMPLETO: alerta con recomendación de descarga previa.
// [Descargar primero] abre + descarga y deja eliminar después; [Eliminar]
// borra directo; la auditoría conserva SIGN_SESSION_DELETE como rastro.
function firmaDeleteComplete(id, name) {
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  var box = document.createElement('div');
  box.className = 'modal-box';
  box.style.cssText = 'max-width:380px';
  var title = document.createElement('div');
  title.className = 'modal-title';
  title.textContent = '🗑 Eliminar reporte completo';
  box.appendChild(title);
  var content = document.createElement('div');
  content.style.cssText = 'padding:12px 16px;display:flex;flex-direction:column;gap:10px';
  var info = document.createElement('div');
  info.style.cssText = 'font-size:11px;color:var(--text-primary)';
  info.innerHTML = 'Se eliminará del servidor <b>definitivamente</b>:<br>“' +
    escapeHtml(name || ('sesión #' + id)) + '”';
  content.appendChild(info);
  var warn = document.createElement('div');
  warn.style.cssText = 'font-size:11px;color:#b45309;background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:8px 10px';
  warn.textContent = '⚠️ Se recomienda descargarlo antes para conservarlo. Una vez eliminado no se puede recuperar.';
  content.appendChild(warn);
  var btns = document.createElement('div');
  btns.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap';
  var dlBtn = document.createElement('button');
  dlBtn.className = 'btn btn-primary';
  dlBtn.setAttribute('data-act', 'dl');
  dlBtn.textContent = '⬇ Descargar primero';
  var delBtn = document.createElement('button');
  delBtn.className = 'btn btn-secondary';
  delBtn.setAttribute('data-act', 'del');
  delBtn.style.cssText = 'color:#f87171;border-color:rgba(239,68,68,.4)';
  delBtn.textContent = 'Eliminar de todos modos';
  var cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.setAttribute('data-act', 'cancel');
  cancelBtn.textContent = 'Cancelar';
  btns.appendChild(dlBtn);
  btns.appendChild(delBtn);
  btns.appendChild(cancelBtn);
  content.appendChild(btns);
  box.appendChild(content);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  var close = function() { overlay.remove(); };
  cancelBtn.onclick = close;
  overlay.onclick = function(e) { if (e.target === overlay) close(); };
  dlBtn.onclick = async function() {
    dlBtn.disabled = true;
    var ok = await _firmaOpenSession(id);
    if (ok) {
      firmaDownload();
      showToast('✅ Descargado — ya puedes eliminarlo con seguridad');
    }
    close();
  };
  delBtn.onclick = async function() {
    delBtn.disabled = true;
    await _firmaDoDelete(id);
    close();
  };
}

// Abre una sesión del servidor en el visor (reutiliza parseo + editor)
// FIX pérdida de sesión: el ID pendiente se conserva hasta abrir con éxito
// (antes se borraba antes del fetch: un doble init o un fallo lo perdía y
// caía a estado local vacío sin error). Guardia anti-doble-apertura.
// Retorna true/false para que el llamador decida si consume el ID.
var _firmaOpeningSession = null;

function _firmaTakePendingSession() {
  try { return sessionStorage.getItem('__firma_session_id'); }
  catch (e) { return null; }
}

function _firmaClearPendingSession() {
  try { sessionStorage.removeItem('__firma_session_id'); } catch (e) {}
}

async function _firmaOpenSession(id, silent) {
  if (_firmaOpeningSession === id) return false; // ya abriéndose: no duplicar
  _firmaOpeningSession = id;
  if (!silent) showToast('Abriendo sesión #' + id + '…');
  try {
    var data = await _firmaApiGet('/api/sign-sessions/' + id);
    if (!data || !data.ok) { showToast('❌ ' + ((data && data.error) || 'No se pudo abrir'), true); return false; }
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
    _firmaSessionStatus = session.status || null;
    _firmaSessionAssignees = {
      reviewer: session.assigned_reviewer || null,
      approver: session.assigned_approver || null
    };
    // Parsea bloques del HTML (roles/etiquetas) y pisa el estado con el del servidor
    if (!firmaLoadHtml(session.html, _firmaOriginalName)) { return false; }
    var st = {};
    ['prepared', 'reviewed', 'approved'].forEach(function(r) {
      var s = (session.signatures || {})[r];
      if (s && s.signed) st[r] = { signed: true, username: s.username || '', nombre: s.nombre || '', cargo: s.cargo || '', firma: s.firma || '', fecha: s.fecha || '' };
    });
    _firmaSignatureState = st;
    _firmaPaintSessionState();
    // FIX: el status lo dejaba firmaLoadHtml con el conteo incrustado (0/3);
    // se refresca con el conteo real del servidor.
    try {
      var _cnt = { signed: 0, total: 3 };
      ['prepared', 'reviewed', 'approved'].forEach(function(r) {
        if (st[r] && st[r].signed) _cnt.signed++;
      });
      var statusEl = document.getElementById('firmaStatus');
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.innerHTML = '<div class="fglass-status">✅ Sesión #' + session.id + ': ' +
          escapeHtml(session.name || '') + ' (' + _cnt.signed + '/' + _cnt.total + ' firmas)</div>';
      }
    } catch (_e) { /* fail-open */ }
    firmaRenderEditor();
    _firmaUpdateReportBadge();
    firmaPersistState();
    firmaLoadBandeja();
    if (!silent) showToast('✅ Sesión #' + session.id + ' abierta (' + (session.next_role ? 'toca: ' + session.next_role : 'completa') + ')');
    return true;
  } catch (e) {
    console.error('Error abriendo sesión:', e);
    showToast('❌ No se pudo abrir la sesión #' + id + ': ' + (e && e.message ? e.message : 'error inesperado'), true);
    return false;
  } finally {
    if (_firmaOpeningSession === id) _firmaOpeningSession = null;
  }
}
