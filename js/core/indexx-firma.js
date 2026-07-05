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

function firmaPersistState() {
  if (_firmaCurrentHtml) {
    try {
      localStorage.setItem('__firma_current_html', _firmaCurrentHtml);
      localStorage.setItem('__firma_signature_data', JSON.stringify(_firmaSignatureData));
      localStorage.setItem('__firma_signature_state', JSON.stringify(_firmaSignatureState));
      localStorage.setItem('__firma_original_name', _firmaOriginalName);
      localStorage.setItem('__firma_is_new_session', _firmaIsNewSession ? '1' : '0');
    } catch(e) {
      console.warn('Error persisting signature state:', e.message);
    }
  }
}

function firmaClearState() {
  try {
    localStorage.removeItem('__firma_current_html');
    localStorage.removeItem('__firma_signature_data');
    localStorage.removeItem('__firma_signature_state');
    localStorage.removeItem('__firma_original_name');
    localStorage.removeItem('__firma_is_new_session');
  } catch(e) {
    console.warn('Error clearing signature state:', e.message);
  }
}

function firmaHasPersistedState() {
  try {
    return !!localStorage.getItem('__firma_current_html');
  } catch(e) {
    return false;
  }
}

function firmaRestoreState() {
  try {
    var html = localStorage.getItem('__firma_current_html');
    var sigData = JSON.parse(localStorage.getItem('__firma_signature_data'));
    var sigState = JSON.parse(localStorage.getItem('__firma_signature_state'));
    var origName = localStorage.getItem('__firma_original_name');

    if (!html || !sigData) return false;

    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    if (!doc || !doc.querySelectorAll) return false;

    _firmaCurrentDoc = doc;
    _firmaCurrentHtml = html;
    _firmaSignatureData = sigData;
    _firmaSignatureState = sigState || {};
    _firmaOriginalName = origName || 'reporte.html';
    _firmaIsNewSession = localStorage.getItem('__firma_is_new_session') === '1';

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

  if (!dropZone || !fileInput || !preview) return;

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

      var resetRoleBtn = document.createElement('button');
      resetRoleBtn.textContent = '\u21BA Reiniciar';
      resetRoleBtn.style.cssText = 'margin-top:6px;padding:2px 8px;font-size:10px;background:transparent;color:var(--text-faint);border:1px solid var(--border);border-radius:4px;cursor:pointer';
      resetRoleBtn.onclick = (function(r){ return function(){ firmaResetRole(r); }; })(sd.role);
      body.appendChild(resetRoleBtn);
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
}

function firmaResetRole(role) {
  if (!confirm('¿Estás seguro de reiniciar tu firma para este rol? Esta acción no se puede deshacer.')) return;
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
  var oldBadge = _firmaCurrentDoc.getElementById('firmaProgressBadge');
  if (oldBadge) oldBadge.remove();
  var cnt = _firmaCountSigned();
  var badge = _firmaCurrentDoc.createElement('div');
  badge.id = 'firmaProgressBadge';
  badge.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;text-align:center;padding:4px;font-size:9px;font-family:monospace;color:#fff;background:rgba(26,58,107,.85)';
  badge.textContent = '\u270D ' + cnt.signed + '/' + cnt.total + ' firmas';
  _firmaCurrentDoc.body.appendChild(badge);
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

  var codeInfo = document.createElement('div');
  codeInfo.style.cssText = 'font-size:11px;color:var(--text-faint)';
  codeInfo.textContent = 'C\u00F3digo: ' + code;
  content.appendChild(codeInfo);

  var pwLabel = document.createElement('label');
  pwLabel.style.cssText = 'font-size:11px;color:var(--text-primary)';
  pwLabel.textContent = 'Contrase\u00F1a';
  content.appendChild(pwLabel);

  var pwInput = document.createElement('input');
  pwInput.type = 'password';
  pwInput.style.cssText = 'width:100%;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem;outline:none';
  pwInput.placeholder = 'Ingresa tu contrase\u00F1a';
  content.appendChild(pwInput);

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
    overlay.remove();
    firmaVerify(role, code, pwInput.value, statusEl);
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

async function firmaVerify(role, code, password, statusEl) {
  if (!password) {
    if (statusEl) statusEl.textContent = '\u26A0\uFE0F Ingresa la contrase\u00F1a';
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
