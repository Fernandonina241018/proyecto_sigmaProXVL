// ========================================
// auth.js — StatAnalyzer Pro
// Módulo de autenticación con backend
// ========================================

const Auth = (() => {

    // LOTE C: remember-me seguro — SOLO username, nunca password.
    // Antes se guardaba el password con XOR reversible (recuperable por
    // cualquiera con acceso al navegador). Ahora solo se autocompleta el
    // usuario; la contraseña siempre se escribe a mano.

    const CFG = {
        SESSION_TIMEOUT_MS: 5 * 60 * 1000,
        VALIDACIONES_TIMEOUT_MS: 15 * 60 * 1000,
        MAX_ATTEMPTS:       10,
        SESSION_STORAGE_KEY:'auth_session',
        TOKEN_STORAGE_KEY:  'auth_token',
        WARN_BEFORE_MS:     60 * 1000,

        // ▼ CAMBIA ESTA URL ▼
        // Local:   'http://localhost:3000'
        //API_URL: 'https://proyecto-sigmapro.onrender.com',
        API_URL: API_URL,
    };

    let _sessionTimer=null, _warnTimer=null, _countdownTimer=null;
    let _attempts=0, _locked=false, _onLogin=null, _onLogout=null;

    // ── Variante de login ───────────────────────────────────────────
    // v2 = login híbrido oficial (tarjeta recordada + QR + proyecto).
    // v1 = login clásico, disponible como respaldo con ?login=v1.
    // El parámetro de URL tiene prioridad sobre el valor persistido.
    const LOGIN_VARIANT_KEY = '__auth_login_variant';
    const PROFILE_CACHE_KEY = '__auth_profile_cache';
    const REMEMBER_OPTOUT_KEY = '__auth_remember_optout';
    function _resolveLoginVariant() {
        try {
            if (typeof window !== 'undefined' && window.location
                && window.location.search && typeof URLSearchParams !== 'undefined') {
                var q = new URLSearchParams(window.location.search).get('login');
                if (q === 'v2' || q === 'v1') return q;
            }
        } catch (e) {}
        try {
            var saved = localStorage.getItem(LOGIN_VARIANT_KEY);
            if (saved === 'v2' || saved === 'v1') return saved;
        } catch (e) {}
        return 'v2';
    }
    function setLoginVariant(variant) {
        var v = variant === 'v2' ? 'v2' : 'v1';
        try { localStorage.setItem(LOGIN_VARIANT_KEY, v); } catch (e) {}
        return v;
    }
    function getLoginVariant() { return _resolveLoginVariant(); }

    // Puerta de área: antes de entrar a la app se exige área válida
    // (Estadística | Validaciones). Sin AreaSelect, entra directo.
    function _enterWithArea(next, role, retried) {
        if (typeof retried === 'undefined' && (role === true || role === false)) { retried = role; role = null; }
        try {
            if (typeof AreaSelect !== 'undefined' && AreaSelect.ensureArea) {
                AreaSelect.ensureArea(next, { role: role || null });
                return;
            }
        } catch (e) {}
        // Respaldo: si AreaSelect no cargó (indexx.html viejo en caché),
        // se inyecta bajo demanda y se reintenta una vez.
        if (!retried) {
            try {
                var el = document.createElement('script');
                el.src = 'js/core/area-select.js?v=' + (window._CACHE_BUST || Date.now());
                el.onload = el.onerror = function() { _enterWithArea(next, true); };
                document.body.appendChild(el);
                return;
            } catch (e2) {}
        }
        if (next) next(null);
    }
    let _token=null;

    // ── 2FA state ─────────────────────────
    let _tempToken = null;

    // ── Verificación contra backend ───────
    async function _verifyCredentials(user, password) {
        try {
            const res  = await fetchWithTimeout(`${CFG.API_URL}/api/login`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body:    JSON.stringify({ username: user, password }),
            });
            const data = await res.json();
            if (!res.ok) return { ok: false, error: data.error || 'Credenciales incorrectas' };
            if (data.requires2FA) {
                _tempToken = data.tempToken;
                return { ok: true, requires2FA: true, username: data.username, role: data.role, tempToken: data.tempToken };
            }
            _token = data.token;
            // FIX SEGURIDAD #1: defaultPassword ya no se retorna del backend (generada aleatoriamente)
            return { ok: true, username: data.username, role: data.role, token: data.token, mustChangePassword: data.mustChangePassword || false };
        } catch {
            return { ok: false, error: 'No se pudo conectar con el servidor.' };
        }
    }

    async function _verify2FA(totpCode) {
        try {
            const res = await fetchWithTimeout(`${CFG.API_URL}/api/2fa/verify-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken: _tempToken, token: totpCode }),
            });
            const data = await res.json();
            if (!res.ok) return { ok: false, error: data.error || 'Código 2FA inválido' };
            _token = data.token;
            _tempToken = null;
            return { ok: true, username: data.username, role: data.role, token: data.token };
        } catch {
            return { ok: false, error: 'Error de conexión al verificar 2FA' };
        }
    }

    function getToken() { return _token; }

    // ── Sesión ────────────────────────────
    function _startSession(userData) {
        const session = {
            username: userData.username, role: userData.role,
            loginTime: Date.now(), expiresAt: Date.now() + CFG.SESSION_TIMEOUT_MS,
            mustChangePassword: userData.mustChangePassword || false
        };
        sessionStorage.setItem(CFG.SESSION_STORAGE_KEY, JSON.stringify(session));
        if(_token) sessionStorage.setItem('auth_token', _token);
        _scheduleTimers();
    }
    function _clearSession() {
        sessionStorage.removeItem(CFG.SESSION_STORAGE_KEY);
        sessionStorage.removeItem('auth_token');
        _token = null;
        clearTimeout(_sessionTimer); clearTimeout(_warnTimer); clearInterval(_countdownTimer);
        _sessionTimer=null; _warnTimer=null; _countdownTimer=null;
    }
    function _getSession() {
        try { const r=sessionStorage.getItem(CFG.SESSION_STORAGE_KEY); return r?JSON.parse(r):null; } catch { return null; }
    }
    function _isSessionValid() { const s=_getSession(); return s&&Date.now()<s.expiresAt; }

    // Timeout por área: Validaciones 15 min (planillas largas), resto 5 min.
    function _timeoutMs() {
        try {
            if (typeof AreaSelect !== 'undefined' && AreaSelect.getArea
                && AreaSelect.getArea() === 'validaciones') {
                return CFG.VALIDACIONES_TIMEOUT_MS;
            }
        } catch (e) {}
        return CFG.SESSION_TIMEOUT_MS;
    }

    function _resetActivityTimer() {
        const s=_getSession(); if(!s) return;
        s.expiresAt=Date.now()+_timeoutMs();
        sessionStorage.setItem(CFG.SESSION_STORAGE_KEY,JSON.stringify(s));
        _scheduleTimers();
        const w=document.getElementById('auth-timeout-warn'); if(w) w.style.opacity='0';
    }
    function _scheduleTimers() {
        clearTimeout(_sessionTimer); clearTimeout(_warnTimer); clearInterval(_countdownTimer);
        const t=_timeoutMs();
        _warnTimer   = setTimeout(()=>_showTimeoutWarning(), t-CFG.WARN_BEFORE_MS);
        _sessionTimer= setTimeout(()=>_expireSession(),      t);
    }
    function _showTimeoutWarning() {
        const w=document.getElementById('auth-timeout-warn'); if(!w) return;
        w.style.opacity='1';
        let secs=Math.floor(CFG.WARN_BEFORE_MS/1000);
        const c=document.getElementById('auth-warn-countdown'); if(c) c.textContent=secs;
        clearInterval(_countdownTimer);
        _countdownTimer=setInterval(()=>{ secs--; if(c) c.textContent=secs; if(secs<=0) clearInterval(_countdownTimer); },1000);
    }
    function _closeAllModals() {
        document.querySelectorAll('.pd-overlay, .modal-overlay').forEach(function(el) { el.remove(); });
        document.querySelectorAll('div[style*="z-index:10001"]').forEach(function(el) { if (el.parentNode === document.body) el.remove(); });
        ['usr-reset-modal', 'usr-edit-modal', 'force-pwd-modal'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.remove();
        });
    }

    // Al expirar en Validaciones: salir del módulo (ocultar shell + limpiar
    // área) antes del login. Los borradores en sessionStorage se conservan.
    function _salirDeValidaciones() {
        try {
            let enVal = false;
            try { enVal = (typeof AreaSelect !== 'undefined' && AreaSelect.getArea) ? AreaSelect.getArea() === 'validaciones' : false; } catch (e) {}
            if (!enVal) return;
            try { if (typeof Validaciones !== 'undefined' && Validaciones.hide) Validaciones.hide(); } catch (e) {}
            try { if (typeof AreaSelect !== 'undefined' && AreaSelect.clearArea) AreaSelect.clearArea(); } catch (e) {}
        } catch (e) {}
    }

    function _expireSession() { _closeAllModals(); _salirDeValidaciones(); _clearSession(); showLogin('timeout'); if(_onLogout) _onLogout('timeout'); }

    // ── Intentos ──────────────────────────
    function _registerFailedAttempt() {
        _attempts++;
        if(_attempts>=CFG.MAX_ATTEMPTS){ _locked=true; _showLockout(); return true; }
        return false;
    }
    function _showLockout() {
        const f=document.getElementById('auth-form-area'), l=document.getElementById('auth-lockout-msg');
        if(f) f.style.display='none'; if(l) l.style.display='block';
    }

    // ── Modal ─────────────────────────────
    // Recordar usuario: SOLO username (nunca password). Se comparte entre v1/v2.
    function _restoreRememberedUser() {
        try {
            var saved = JSON.parse(localStorage.getItem('__auth_remembered'));
            // Migración: si hay entrada legacy con password, se purga
            if (saved && saved.password) {
                localStorage.removeItem('__auth_remembered');
                saved = null;
            }
            var userEl = document.getElementById('auth-user');
            var rememberEl = document.getElementById('auth-remember');
            var optedOut = _isRememberOptedOut();
            if (rememberEl) rememberEl.checked = !optedOut;
            if (saved && saved.username && !optedOut) {
                if (userEl) userEl.value = saved.username;
                if (rememberEl) rememberEl.checked = true;
            }
        } catch (_e) {}
    }

    function _renderLoginModal(reason='') {
        document.getElementById('auth-overlay')?.remove();
        const reasonMsg={timeout:'⏱ Tu sesión expiró por inactividad.',logout:'👋 Sesión cerrada correctamente.'}[reason]||'';
        // Código del commit desplegado (sello automático en cada push, ver version.yml).
        const buildRev=((document.querySelector('meta[name="build-revision"]')||{}).content||'').trim();
        const buildRevHtml=buildRev?' · <strong style="color:#64748b" title="Build '+buildRev+'">'+buildRev+'</strong>':'';
        const overlay=document.createElement('div');
        overlay.id='auth-overlay';
        overlay.innerHTML=`
        <div class="auth-bg"><div class="auth-particles" id="auth-particles"></div></div>
        <div class="auth-card" role="dialog" aria-modal="true">
            <div class="auth-brand">
                <div class="auth-brand-icon">📊</div>
                <div class="auth-brand-name">StatAnalyzer Pro</div>
                <div class="auth-brand-sub">Sistema de Análisis Estadístico · FDA 21 CFR Part 11</div>
            </div>
            <div class="auth-avatar-container">
                <svg class="auth-avatar-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    <!-- Círculo de fondo -->
                    <circle cx="60" cy="60" r="55" fill="#e8f4f8" stroke="#1a3a6b" stroke-width="2"/>
                    <!-- Cabeza -->
                    <circle cx="60" cy="40" r="18" fill="#1a3a6b"/>
                    <!-- Cuerpo -->
                    <path d="M 42 58 Q 42 70 45 85 L 75 85 Q 78 70 78 58 Z" fill="#1a3a6b"/>
                    <!-- Hombros/cuello -->
                    <rect x="48" y="55" width="24" height="5" fill="#1a3a6b" rx="2"/>
                </svg>
            </div>
            ${reasonMsg?`<div class="auth-reason-msg">${reasonMsg}</div>`:''}
            <div class="auth-spinner-container" id="auth-spinner-container">
                <div class="auth-spinner" id="auth-spinner"></div>
            </div>
            <div id="auth-form-area">
                <div class="auth-field">
                    <div class="auth-input-wrap">
                        <span class="auth-input-icon">👤</span>
                        <input class="auth-input" type="text" id="auth-user" placeholder=" " autocomplete="username" autofocus>
                        <label class="auth-label" for="auth-user">Usuario</label>
                    </div>
                </div>
                <div class="auth-field">
                    <div class="auth-input-wrap">
                        <span class="auth-input-icon">🔒</span>
                        <input class="auth-input" type="password" id="auth-pass" placeholder=" " autocomplete="current-password">
                        <label class="auth-label" for="auth-pass">Contraseña</label>
                        <button class="auth-eye-btn" id="auth-eye" type="button" aria-label="Mostrar contraseña"><span id="auth-eye-icon">👁</span></button>
                    </div>
                    <label class="auth-checkbox-row">
                        <input type="checkbox" id="auth-show-pass">
                        <span class="auth-checkbox-custom"></span>
                        <span class="auth-checkbox-text">Mostrar contraseña</span>
                    </label>
                    <label class="auth-checkbox-row" style="margin-top:4px">
                        <input type="checkbox" id="auth-remember" checked>
                        <span class="auth-checkbox-custom"></span>
                        <span class="auth-checkbox-text">Recordarme</span>
                    </label>
                </div>
                <div class="auth-error"    id="auth-error"         style="display:none"></div>
                <div class="auth-attempts" id="auth-attempts-info" style="display:none"></div>
                <button class="auth-btn-login"  id="auth-btn-login"  type="button"><span id="auth-btn-text">Iniciar sesión</span><span class="auth-btn-arrow">→</span></button>
                
                
            </div>
            <div id="auth-lockout-msg" style="display:none" class="auth-lockout">
                <div class="auth-lockout-icon">🔒</div>
                <h3>Acceso bloqueado</h3>
                <p>Has superado el máximo de intentos permitidos (<strong>${CFG.MAX_ATTEMPTS}</strong>).</p>
                <p>Por favor, comunícate con <strong>Soporte Técnico</strong> para restablecer tu acceso.</p>
                <div class="auth-support-box"><div>📧 soporte@statanalyzer.com</div><div>📞 +1 (800) 000-0000</div></div>
            </div>
            <div class="auth-footer"><span>FDA 21 CFR Part 11 Compliant</span><span>v1.0${buildRevHtml}</span></div>
        </div>
        <div class="auth-timeout-warn" id="auth-timeout-warn">
            ⏱ Tu sesión expirará en <strong id="auth-warn-countdown">60</strong> segundos por inactividad.
            <button onclick="Auth.keepAlive()" class="auth-warn-btn">Mantener sesión</button>
        </div>`;
        document.body.appendChild(overlay);
        _attachLoginListeners();
        _renderParticles();
        _restoreRememberedUser();
    }

// ========================================
// Login V2 híbrido — tarjeta recordada + QR + información de proyecto.
// Portado de login_sigmaproxvl_hibrido_v3.html; reutiliza los IDs y
// listeners reales de auth.js (login, 2FA, bloqueo, recordarme).
// ========================================
    const ROLE_LABELS = {
        admin: 'Administrador', supervisor: 'Supervisor', analista: 'Analista',
        gerente: 'Gerente', coordinador: 'Coordinador', readonly: 'Solo lectura',
        user: 'Usuario'
    };
    let _v2PendingVersion = '';
    try {
        window.addEventListener('sigma:version-available', function (e) {
            _v2PendingVersion = (e && e.detail && e.detail.version) || 'nueva';
            const box = document.getElementById('av2-update');
            const label = document.getElementById('av2-update-version');
            const card = document.querySelector('#auth-overlay.auth-v2 .card');
            if (box) box.hidden = false;
            if (label) label.textContent = 'v' + _v2PendingVersion + ' · lista para instalar';
            if (card) card.classList.add('has-update');
            const toast = document.getElementById('app-version-toast');
            if (toast) toast.remove();
        });
    } catch (_e) {}

    function _readProfileCache() {
        try { return JSON.parse(localStorage.getItem(PROFILE_CACHE_KEY) || 'null'); } catch (_e) { return null; }
    }
    function _writeProfileCache(profile) {
        try { localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile)); } catch (_e) {}
    }
    function _clearProfileCache() {
        try { localStorage.removeItem(PROFILE_CACHE_KEY); } catch (_e) {}
    }
    function _isRememberOptedOut() {
        try { return localStorage.getItem(REMEMBER_OPTOUT_KEY) === '1'; } catch (_e) { return false; }
    }
    function _setRememberOptOut(on) {
        try {
            if (on) localStorage.setItem(REMEMBER_OPTOUT_KEY, '1');
            else localStorage.removeItem(REMEMBER_OPTOUT_KEY);
        } catch (_e) {}
    }
    function _profileForRemembered() {
        if (_isRememberOptedOut()) return null;
        let saved = '';
        try {
            const raw = JSON.parse(localStorage.getItem('__auth_remembered') || 'null');
            if (raw && raw.username) saved = raw.username;
        } catch (_e) {}
        if (!saved) return null;
        const p = _readProfileCache();
        return p && p.username === saved ? p : null;
    }
    async function _cacheProfileFromServer(username) {
        try {
            const token = _token || (function () {
                try { return sessionStorage.getItem('auth_token') || ''; } catch (_e) { return ''; }
            })();
            const headers = token ? { Authorization: 'Bearer ' + token } : {};
            const res = await fetchWithTimeout(CFG.API_URL + '/api/me', { credentials: 'include', headers: headers });
            const data = await res.json();
            if (!data || !data.ok) return;
            const p = data.profile || {};
            _writeProfileCache({
                username: data.username || username,
                nombre: p.nombre || '',
                apellido: p.apellido || '',
                email: p.email || '',
                cargo: p.cargo || '',
                role: data.role || p.role || '',
                lastLoginAt: p.last_login || new Date().toISOString(),
                loginCount: Number(p.login_count || 0),
                has2FA: !!data.has2FA,
                lastIpMasked: p.last_ip_masked || ''
            });
        } catch (_e) {}
    }

    function _v2NiceName(user) {
        const local = String(user || '').split('@')[0];
        return local.split(/[._-]/).filter(Boolean)
            .map(function (x) { return x[0].toUpperCase() + x.slice(1); })
            .join(' ') || 'usuario';
    }
    function _v2RoleLabel(role) {
        return ROLE_LABELS[String(role || '').toLowerCase()] || (role ? String(role) : '—');
    }
    function _v2BrowserInfo() {
        const ua = navigator.userAgent || '';
        const br = /Edg/.test(ua) ? 'Edge' : /Firefox/.test(ua) ? 'Firefox' : /Chrome/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'Navegador';
        const os = /Windows/.test(ua) ? 'Windows' : /Mac OS X|Macintosh/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : '';
        return br + (os ? ' · ' + os : '');
    }
    function _v2FormatLast(value) {
        if (!value) return '—';
        const d = new Date(value);
        if (isNaN(d.getTime())) return '—';
        const now = new Date();
        const hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        if (d.toDateString() === now.toDateString()) return 'hoy, ' + hm;
        const y = new Date(now); y.setDate(now.getDate() - 1);
        if (d.toDateString() === y.toDateString()) return 'ayer, ' + hm;
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) + ', ' + hm;
    }
    function _v2SetVersion(label, rev) {
        const vt = document.getElementById('av2-version-text');
        if (vt) vt.textContent = label;
        const chip = document.getElementById('av2-version-chip');
        if (chip) chip.title = rev ? ('Commit ' + rev) : 'Versión desplegada';
        const pv = document.getElementById('av2-project-version');
        if (pv) pv.textContent = label;
    }
    function _v2FillCard(p) {
        const set = function (id, value) {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        const name = [p.nombre, p.apellido].filter(Boolean).join(' ') || _v2NiceName(p.username);
        set('av2-remembered-name', name);
        set('av2-remembered-user', p.email || p.username || '—');
        set('av2-remembered-role', _v2RoleLabel(p.role));
        const areaChip = document.getElementById('av2-remembered-area');
        if (areaChip) { areaChip.textContent = p.cargo || ''; areaChip.hidden = !p.cargo; }
        set('av2-remembered-last', _v2FormatLast(p.lastLoginAt));
        set('av2-remembered-device', _v2BrowserInfo());
        set('av2-remembered-logins', String(Number(p.loginCount || 0)));
        set('av2-remembered-ip', p.lastIpMasked || '—');
        const avatar = document.getElementById('av2-remembered-avatar');
        if (avatar) avatar.textContent = (name[0] || 'S').toUpperCase();
        const badge = document.getElementById('av2-remembered-2fa');
        const badgeText = document.getElementById('av2-remembered-2fa-text');
        if (badge && badgeText) {
            badge.classList.toggle('off', !p.has2FA);
            badgeText.textContent = p.has2FA ? '2FA activo' : '2FA no configurado';
        }
        const rem = document.getElementById('av2-remembered');
        if (rem) rem.hidden = false;
        const userField = document.getElementById('av2-user-field');
        if (userField) userField.hidden = true;
        const userInput = document.getElementById('auth-user');
        if (userInput && p.username) userInput.value = p.username;
    }
    function _v2RenderQr(p) {
        const block = document.getElementById('av2-session-qr-block');
        const box = document.getElementById('av2-session-qr');
        if (!block || !box) return;
        if (!p || typeof window.qrcode !== 'function') { block.hidden = true; return; }
        try {
            const ascii = function (v) {
                return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            };
            const payload = JSON.stringify({
                r: ascii(_v2RoleLabel(p.role)),
                a: ascii(p.cargo || ''),
                s: Number(p.loginCount || 0),
                ip: ascii(p.lastIpMasked || '').replace(/•/g, '*'),
                '2fa': !!p.has2FA
            });
            const qr = window.qrcode(0, 'L');
            qr.addData(payload);
            qr.make();
            let svg = qr.createSvgTag({
                cellSize: 2, margin: 1, scalable: true,
                alt: 'Datos de sesión: rol, área, sesiones, 2FA e IP enmascarada'
            });
            svg = svg.replace('<path ',
                '<defs><linearGradient id="av2QrInk" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#2f1f5a"/>' +
                '<stop offset=".55" stop-color="#3f2a86"/>' +
                '<stop offset="1" stop-color="#4c34a6"/>' +
                '</linearGradient></defs><path fill="url(#av2QrInk)" ');
            box.innerHTML = svg;
            block.hidden = false;
        } catch (_e) {
            block.hidden = true;
        }
    }

    let _v2InfoDocBound = false;
    function _attachV2InfoPanel() {
        const toggle = document.getElementById('av2-info-toggle');
        const panel = document.getElementById('av2-project-info');
        const close = document.getElementById('av2-project-close');
        if (!toggle || !panel || !close) return;
        function setOpen(open, focus) {
            panel.hidden = !open;
            toggle.setAttribute('aria-expanded', String(open));
            if (!focus) return;
            if (open) close.focus({ preventScroll: true });
            else toggle.focus({ preventScroll: true });
        }
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            setOpen(panel.hidden);
        });
        close.addEventListener('click', function () { setOpen(false); });
        if (_v2InfoDocBound) return;
        _v2InfoDocBound = true;
        document.addEventListener('click', function (e) {
            const t = document.getElementById('av2-info-toggle');
            const p = document.getElementById('av2-project-info');
            if (!t || !p || p.hidden) return;
            if (p.contains(e.target) || t.contains(e.target)) return;
            p.hidden = true;
            t.setAttribute('aria-expanded', 'false');
        });
        document.addEventListener('keydown', function (e) {
            const t = document.getElementById('av2-info-toggle');
            const p = document.getElementById('av2-project-info');
            if (e.key !== 'Escape' || !p || p.hidden) return;
            e.preventDefault();
            p.hidden = true;
            t.setAttribute('aria-expanded', 'false');
            t.focus({ preventScroll: true });
        });
    }
    function _attachV2LoginExtras(hasCard) {
        const rem = document.getElementById('av2-remembered');
        const userField = document.getElementById('av2-user-field');
        const change = document.getElementById('av2-change-user');
        if (rem && hasCard) {
            rem.addEventListener('click', function (e) {
                if (e.target.closest('#av2-change-user')) return;
                document.getElementById('auth-pass')?.focus();
            });
        }
        if (change) {
            change.addEventListener('click', function (e) {
                e.stopPropagation();
                if (rem) rem.hidden = true;
                if (userField) userField.hidden = false;
                const u = document.getElementById('auth-user');
                if (u) { u.value = ''; u.focus(); }
            });
        }
        const form = document.getElementById('av2-login-form');
        if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
        const updateBtn = document.getElementById('av2-update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', function () {
                updateBtn.disabled = true;
                updateBtn.textContent = 'Actualizando…';
                try { window.location.reload(); } catch (_e) {}
            });
        }
    }

    function _renderLoginModalV2(reason = '') {
        document.getElementById('auth-overlay')?.remove();
        if (!_v2PendingVersion) {
            try { _v2PendingVersion = window.__sigmaPendingVersion || ''; } catch (_e) {}
        }
        const buildRev = ((document.querySelector('meta[name="build-revision"]') || {}).content || '').trim();
        const safeRev = buildRev.replace(/[^a-zA-Z0-9._-]/g, '');
        const versionLabel = 'v1.0' + (safeRev ? ' · ' + safeRev : '');
        const reasonMsg = { timeout: '⏱ Tu sesión expiró por inactividad.', logout: '👋 Sesión cerrada correctamente.' }[reason] || '';
        const profile = _profileForRemembered();
        const hasCard = !!profile;

        const overlay = document.createElement('div');
        overlay.id = 'auth-overlay';
        overlay.className = 'auth-v2';
        overlay.innerHTML = `
        <div class="bg" aria-hidden="true">
            <span style="left:5%;top:20%">x̄</span><span style="left:10%;top:74%">σ</span>
            <span style="left:88%;top:18%">μ</span><span style="left:93%;top:68%">R²</span>
            <span style="left:78%;top:86%">Σ</span><span style="left:16%;top:44%">χ²</span>
        </div>
        <div class="shell">
            <header class="topbar">
                <div class="brand">
                    <div class="brand-mark" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5 12 2l8 3.5v6.1c0 4.7-3.3 8-8 10.4-4.7-2.4-8-5.7-8-10.4z"/><path d="m8.5 12 2.3 2.3 4.8-5"/></svg>
                    </div>
                    <div>
                        <div class="brand-name">POWERED FOR COMPLIANCE</div>
                        <div class="brand-sub">21 CFR PART 11</div>
                    </div>
                </div>
                <div class="secure-pill">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                    Acceso protegido
                </div>
            </header>

            <main>
                <div class="card-shell">
                    <section class="card auth-card" aria-labelledby="av2-card-title">
                        <button type="button" class="card-info" id="av2-info-toggle" aria-label="Información del proyecto" aria-expanded="false" aria-controls="av2-project-info" title="Información del proyecto">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>
                        </button>
                        <div class="card-head">
                            <div class="card-icon" aria-hidden="true">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/></svg>
                            </div>
                            <div>
                                <h1 id="av2-card-title">StatAnalyzer Pro</h1>
                                <p>Sistema de análisis estadístico</p>
                            </div>
                        </div>

                        <div class="update" id="av2-update" role="status" aria-live="polite" hidden>
                            <span class="update-dot" aria-hidden="true"></span>
                            <div class="update-copy">
                                <b>Nueva versión disponible</b>
                                <span id="av2-update-version">—</span>
                            </div>
                            <button type="button" class="update-btn" id="av2-update-btn" title="Actualizar para cargar la nueva versión">Actualizar</button>
                        </div>

                        ${reasonMsg ? `<div class="banner" role="status">${reasonMsg}</div>` : ''}

                        <div id="auth-form-area">
                            <div class="remembered" id="av2-remembered" hidden aria-label="Sesión recordada. Toca para escribir tu contraseña" title="Toca para escribir tu contraseña">
                                <div class="rem-top">
                                    <div class="rem-avatar-wrap" aria-hidden="true">
                                        <span class="rem-ring"></span>
                                        <span class="avatar" id="av2-remembered-avatar">S</span>
                                        <span class="rem-status" title="Sesión recordada en este dispositivo"></span>
                                    </div>
                                    <div class="rem-identity">
                                        <span class="rem-eyebrow">Sesión recordada</span>
                                        <strong class="rem-name" id="av2-remembered-name">—</strong>
                                        <span class="rem-user" id="av2-remembered-user"></span>
                                        <span class="rem-tags">
                                            <span class="rem-tag role" id="av2-remembered-role">—</span>
                                            <span class="rem-tag" id="av2-remembered-area">—</span>
                                        </span>
                                    </div>
                                    <button type="button" class="rem-change" id="av2-change-user" title="Usar otra cuenta">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4 3 8l4 4"/><path d="M3 8h12a4 4 0 0 1 4 4"/><path d="m17 20 4-4-4-4"/><path d="M21 16H9a4 4 0 0 1-4-4"/></svg>
                                        <span>Cambiar</span>
                                    </button>
                                </div>

                                <div class="rem-access">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                                    <span><b>Último acceso</b> <span id="av2-remembered-last">—</span> <i>·</i> <span id="av2-remembered-device">—</span></span>
                                </div>
                                <div class="rem-access rem-stats">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></svg>
                                    <span><b>Sesiones</b> <strong id="av2-remembered-logins">—</strong> <i>·</i> <b>Última IP</b> <strong id="av2-remembered-ip">—</strong></span>
                                </div>

                                <div class="rem-foot">
                                    <span class="rem-badge" id="av2-remembered-2fa">
                                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 3 4 6v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z"/><path d="m8.5 12 2.3 2.3 4.8-5"/></svg>
                                        <span id="av2-remembered-2fa-text">2FA activo</span>
                                    </span>
                                    <span class="rem-note">Solo se guarda el perfil en este equipo, nunca la contraseña.</span>
                                </div>

                                <div class="session-qr" id="av2-session-qr-block" title="Datos de sesión: rol, área, sesiones, 2FA e IP enmascarada">
                                    <div class="qr-box" id="av2-session-qr"></div>
                                </div>
                            </div>

                            <form id="av2-login-form" novalidate>
                                <div class="field-group" id="av2-user-field">
                                    <div class="field stacked">
                                        <span class="f-ic" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg></span>
                                        <label for="auth-user">Usuario</label>
                                        <input id="auth-user" name="username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="tu.usuario">
                                    </div>
                                </div>

                                <div class="field-group">
                                    <div class="field stacked pw">
                                        <span class="f-ic" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span>
                                        <label for="auth-pass">Contraseña</label>
                                        <input id="auth-pass" name="password" type="password" autocomplete="current-password" placeholder="Escribe tu contraseña">
                                        <button type="button" class="eye" id="auth-eye" aria-label="Mostrar contraseña" aria-pressed="false">
                                            <span id="auth-eye-icon">👁</span>
                                        </button>
                                    </div>
                                </div>

                                <input type="checkbox" id="auth-show-pass" hidden aria-hidden="true" tabindex="-1">

                                <div class="options">
                                    <label class="check" title="Se guarda el usuario, nunca la contraseña"><input type="checkbox" id="auth-remember" checked> <span>Recordar usuario</span></label>
                                    <a class="inline-link" id="av2-forgot-link" href="mailto:soporte@statanalyzer.com?subject=Recuperaci%C3%B3n%20de%20acceso%20StatAnalyzer%20Pro">¿La olvidaste?</a>
                                </div>

                                <div class="auth-error" id="auth-error" style="display:none"></div>
                                <div class="auth-attempts" id="auth-attempts-info" style="display:none"></div>
                                <button class="primary" id="auth-btn-login" type="button"><span id="auth-btn-text">Iniciar sesión</span></button>
                            </form>
                        </div>

                        <div id="auth-lockout-msg" style="display:none" class="auth-lockout">
                            <div class="auth-lockout-icon">🔒</div>
                            <h3>Acceso bloqueado</h3>
                            <p>Has superado el máximo de intentos permitidos (<strong>${CFG.MAX_ATTEMPTS}</strong>).</p>
                            <p>Por favor, comunícate con <strong>Soporte Técnico</strong> para restablecer tu acceso.</p>
                            <div class="auth-support-box"><div>📧 soporte@statanalyzer.com</div><div>📞 +1 (800) 000-0000</div></div>
                        </div>

                        <div class="card-foot">
                            <div class="foot-line">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3 4 6v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z"/><path d="m8.5 12 2.3 2.3 4.8-5"/></svg>
                                <span>Diseñado para apoyar 21 CFR Part 11</span>
                                <span class="foot-sep" aria-hidden="true">·</span>
                                <span class="version-chip" id="av2-version-chip"><span id="av2-version-text">${versionLabel}</span></span>
                            </div>
                            <div class="foot-line">
                                <a class="help-link" id="av2-help-link" href="mailto:soporte@statanalyzer.com">¿Necesitas ayuda?</a>
                            </div>
                        </div>
                    </section>

                    <section class="project-info" id="av2-project-info" role="dialog" aria-modal="false" aria-labelledby="av2-project-title" hidden>
                        <button type="button" class="project-close" id="av2-project-close" aria-label="Cerrar información del proyecto">×</button>
                        <span class="pi-kicker">POWERED FOR COMPLIANCE · 21 CFR PART 11</span>
                        <h2 id="av2-project-title">StatAnalyzer Pro</h2>
                        <p class="pi-desc">Sistema de análisis estadístico para laboratorios: carga y limpieza de datos, análisis, visualización y reportes con trazabilidad.</p>
                        <dl class="pi-meta">
                            <div><dt>Versión</dt><dd id="av2-project-version">${versionLabel}</dd></div>
                            <div><dt>Responsable</dt><dd id="av2-project-owner">Fernando Alberto Nina Ramirez</dd></div>
                            <div><dt>Módulos</dt><dd>Datos · Análisis · Visualización · Reportes · Firma electrónica · Auditoría · Usuarios</dd></div>
                            <div><dt>Cumplimiento</dt><dd>Diseñado para apoyar 21 CFR Part 11</dd></div>
                            <div><dt>Sesión</dt><dd>Cierre por inactividad a los 5 min</dd></div>
                        </dl>
                        <p class="pi-note">Los datos de la tarjeta provienen de tu último acceso y se guardan solo en este equipo.</p>
                    </section>
                </div>
            </main>

            <footer class="page-foot">
                <span>© 2026 StatAnalyzer Pro</span>
                <span>POWERED FOR COMPLIANCE · 21 CFR Part 11</span>
            </footer>
        </div>
        <div class="auth-timeout-warn" id="auth-timeout-warn">
            ⏱ Tu sesión expirará en <strong id="auth-warn-countdown">60</strong> segundos por inactividad.
            <button onclick="Auth.keepAlive()" class="auth-warn-btn">Mantener sesión</button>
        </div>`;
        document.body.appendChild(overlay);
        if (_v2PendingVersion) {
            const ub = document.getElementById('av2-update');
            const uv = document.getElementById('av2-update-version');
            if (ub) ub.hidden = false;
            if (uv) uv.textContent = 'v' + _v2PendingVersion + ' · lista para instalar';
            const card = overlay.querySelector('.card');
            if (card) card.classList.add('has-update');
            const toast = document.getElementById('app-version-toast');
            if (toast) toast.remove();
        }
        _attachLoginListeners();
        _restoreRememberedUser();
        if (hasCard) {
            _v2FillCard(profile);
            _v2RenderQr(profile);
        } else {
            const qrBlock = document.getElementById('av2-session-qr-block');
            if (qrBlock) qrBlock.hidden = true;
        }
        _attachV2LoginExtras(hasCard);
        _attachV2InfoPanel();
        _v2SetVersion(versionLabel, safeRev);
        setTimeout(function () {
            const target = hasCard ? document.getElementById('auth-pass') : document.getElementById('auth-user');
            if (target) target.focus();
        }, 30);
    }

// ========================================
// _renderParticles — Auth.js
// Reemplaza la función existente completa
// 3 modos aleatorios + optimización móvil
// ========================================

    function _renderParticles() {
        const container = document.getElementById('auth-particles');
        if (!container) return;

        // ── Detectar móvil ────────────────────────────────────────
        const isMobile = window.innerWidth < 768 ||
            /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

        const PARTICLE_COUNT = isMobile ? 16 : 30;
        const SYMBOL_COUNT   = isMobile ? 18 : 32;

        // ── Canvas ────────────────────────────────────────────────
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let W = 0, H = 0;
        function resize() {
            const rect = container.getBoundingClientRect();
            W = canvas.width  = rect.width  || window.innerWidth;
            H = canvas.height = rect.height || window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // ── Símbolos estadísticos ─────────────────────────────────
        const SYMBOLS = [
            'Σ','σ','μ','χ²','β','α','ρ','Δ','π','φ',
            'λ','ζ','η','θ','κ','ν','τ','ω','SD','RSD',
            '∂','∇','∈','∪','∩','∀','∃','‰','%','R²',
            'p','n','CV','F','H₀','H₁','df','SE','CI',
            'EXP%','℃','℉','∭','Máx','Mín','g','Pa','L',
        ];

        // ── Paletas de color (RGB) ────────────────────────────────
        const PALETTES = {
            symbols: [
                [200,169, 81],   // dorado app
                [102,126,234],   // púrpura app
                [255,255,255],   // blanco
                [ 67,200,140],   // verde suave
                [220,100,100],   // rojo suave
            ],
            orbits: [
                [102,126,234],
                [150,100,230],
                [ 67,180,200],
                [200,220,255],
            ],
            network: [
                [ 80,200,120],
                [102,126,234],
                [255,200, 80],
                [200,100,100],
            ],
        };

        // ── Elegir modo aleatorio al cargar ───────────────────────
        const MODES  = ['symbols', 'orbits', 'network'];
        const mode   = MODES[Math.floor(Math.random() * MODES.length)];
        let   particles    = [];
        let   networkNodes = [];

        // ════════════════════════════════════════════════════════════
        // MODO 1 — SÍMBOLOS ESTADÍSTICOS FLOTANTES
        // ════════════════════════════════════════════════════════════
        function makeSymbol() {
            const pal = PALETTES.symbols;
            const col = pal[Math.floor(Math.random() * pal.length)];
            return {
                x:       Math.random() * W,
                y:       H + 20,
                vx:      (Math.random() - 0.5) * 0.5,
                vy:      -(0.25 + Math.random() * 0.55),
                angle:   Math.random() * Math.PI * 2,
                rot:     (Math.random() - 0.5) * 0.025,
                size:    10 + Math.random() * 24,
                col,
                opacity: 0,
                life:    0,
                maxLife: 200 + Math.random() * 200,
                delay:   Math.random() * 80,
                sym:     SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            };
        }

        function initSymbols() {
            particles = [];
            for (let i = 0; i < SYMBOL_COUNT; i++) {
                const p = makeSymbol();
                p.delay  = Math.random() * 120;
                p.y      = Math.random() * H;
                p.life   = Math.random() * p.maxLife * 0.6;
                particles.push(p);
            }
        }

        function updateSymbols() {
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.delay > 0) { p.delay--; continue; }
                p.life++;
                p.x += p.vx;
                p.y += p.vy;
                p.angle += p.rot;
                const t = p.life / p.maxLife;
                if      (t < 0.12) p.opacity = (t / 0.12) * 0.75;
                else if (t > 0.80) p.opacity = ((1 - t) / 0.20) * 0.75;
                else               p.opacity = 0.75;

                if (p.life >= p.maxLife || p.y < -60) {
                    particles[i] = makeSymbol();
                }
            }
        }

        function drawSymbols() {
            for (const p of particles) {
                if (p.delay > 0 || p.opacity <= 0.01) continue;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle   = `rgb(${p.col[0]},${p.col[1]},${p.col[2]})`;
                ctx.font        = `600 ${p.size}px 'Segoe UI', sans-serif`;
                ctx.textAlign   = 'center';
                ctx.textBaseline= 'middle';
                ctx.fillText(p.sym, 0, 0);
                ctx.restore();
            }
        }

        // ════════════════════════════════════════════════════════════
        // MODO 2 — ÓRBITAS
        // ════════════════════════════════════════════════════════════
        function initOrbits() {
            particles = [];
            const pal = PALETTES.orbits;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const orbitR = 55 + Math.floor(i / 7) * 60;
                particles.push({
                    orbitR,
                    angle:      (i / PARTICLE_COUNT) * Math.PI * 2,
                    speed:      (0.002 + Math.random() * 0.004) * (i % 2 === 0 ? 1 : -1),
                    col:        pal[i % pal.length],
                    r:          2.5 + Math.random() * 3.5,
                    trail:      [],
                    sym:        SYMBOLS[i % SYMBOLS.length],
                    useSymbol:  Math.random() > 0.55,
                    x: 0, y: 0,
                });
            }
        }

        function updateOrbits() {
            const cx = W / 2, cy = H / 2;
            for (const p of particles) {
                p.angle += p.speed;
                p.x = cx + Math.cos(p.angle) * p.orbitR;
                p.y = cy + Math.sin(p.angle) * p.orbitR * 0.42;
                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > 20) p.trail.shift();
            }
        }

        function drawOrbits() {
            const cx = W / 2, cy = H / 2;
            // Elipses guía
            const radii = [...new Set(particles.map(p => p.orbitR))];
            for (const r of radii) {
                ctx.beginPath();
                ctx.ellipse(cx, cy, r, r * 0.42, 0, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                ctx.lineWidth   = 0.5;
                ctx.stroke();
            }
            // Trails + puntos
            for (const p of particles) {
                if (p.trail.length > 1) {
                    for (let i = 1; i < p.trail.length; i++) {
                        const a = (i / p.trail.length) * 0.30;
                        ctx.beginPath();
                        ctx.moveTo(p.trail[i-1].x, p.trail[i-1].y);
                        ctx.lineTo(p.trail[i].x,   p.trail[i].y);
                        ctx.strokeStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${a})`;
                        ctx.lineWidth   = 1.2;
                        ctx.stroke();
                    }
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},0.9)`;
                ctx.fill();

                if (p.useSymbol) {
                    ctx.globalAlpha  = 0.45;
                    ctx.fillStyle    = `rgb(${p.col[0]},${p.col[1]},${p.col[2]})`;
                    ctx.font         = '10px Segoe UI';
                    ctx.textAlign    = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(p.sym, p.x + p.r + 8, p.y - p.r - 5);
                    ctx.globalAlpha  = 1;
                }
            }
        }

        // ════════════════════════════════════════════════════════════
        // MODO 3 — RED NEURONAL
        // ════════════════════════════════════════════════════════════
        function initNetwork() {
            networkNodes = [];
            const pal   = PALETTES.network;
            const count = PARTICLE_COUNT;
            for (let i = 0; i < count; i++) {
                networkNodes.push({
                    x:    40 + Math.random() * (W - 80),
                    y:    40 + Math.random() * (H - 80),
                    vx:   (Math.random() - 0.5) * 0.35,
                    vy:   (Math.random() - 0.5) * 0.35,
                    r:    2.5 + Math.random() * 3.5,
                    col:  pal[i % pal.length],
                    sym:  SYMBOLS[i % SYMBOLS.length],
                    pulse: Math.random() * Math.PI * 2,
                });
            }
        }

        function updateNetwork() {
            for (const n of networkNodes) {
                n.x     += n.vx;
                n.y     += n.vy;
                n.pulse += 0.025;
                if (n.x < 20 || n.x > W - 20) n.vx *= -1;
                if (n.y < 20 || n.y > H - 20) n.vy *= -1;
            }
        }

        function drawNetwork() {
            const maxDist = isMobile ? 90 : 115;
            // Conexiones
            for (let i = 0; i < networkNodes.length; i++) {
                for (let j = i + 1; j < networkNodes.length; j++) {
                    const a  = networkNodes[i], b = networkNodes[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const d  = Math.sqrt(dx*dx + dy*dy);
                    if (d < maxDist) {
                        const alpha = (1 - d / maxDist) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${a.col[0]},${a.col[1]},${a.col[2]},${alpha})`;
                        ctx.lineWidth   = 0.8;
                        ctx.stroke();
                    }
                }
            }
            // Nodos
            for (const n of networkNodes) {
                const glow = 1 + Math.sin(n.pulse) * 0.28;
                // Halo
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r * glow * 2.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},0.07)`;
                ctx.fill();
                // Núcleo
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},0.88)`;
                ctx.fill();
                // Símbolo flotante
                ctx.globalAlpha  = 0.40;
                ctx.fillStyle    = `rgb(${n.col[0]},${n.col[1]},${n.col[2]})`;
                ctx.font         = '10px Segoe UI';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(n.sym, n.x + n.r + 8, n.y - n.r - 5);
                ctx.globalAlpha  = 1;
            }
        }

        // ════════════════════════════════════════════════════════════
        // INICIALIZACIÓN SEGÚN MODO
        // ════════════════════════════════════════════════════════════
        if      (mode === 'symbols') initSymbols();
        else if (mode === 'orbits')  initOrbits();
        else if (mode === 'network') initNetwork();

        // ════════════════════════════════════════════════════════════
        // LOOP PRINCIPAL
        // ════════════════════════════════════════════════════════════
        let rafId = null;

        function loop() {
            ctx.clearRect(0, 0, W, H);

            if      (mode === 'symbols') { updateSymbols(); drawSymbols(); }
            else if (mode === 'orbits')  { updateOrbits();  drawOrbits();  }
            else if (mode === 'network') { updateNetwork(); drawNetwork(); }

            rafId = requestAnimationFrame(loop);
        }

        loop();

        // ── Limpiar al destruir el overlay ────────────────────────
        // Se detiene automáticamente cuando el overlay es removido
        const observer = new MutationObserver(() => {
            if (!document.contains(canvas)) {
                cancelAnimationFrame(rafId);
                window.removeEventListener('resize', resize);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function _attachLoginListeners() {
        const inputUser=document.getElementById('auth-user');
        const inputPass=document.getElementById('auth-pass');
        const showCb   =document.getElementById('auth-show-pass');
        const eyeIcon  =document.getElementById('auth-eye-icon');

        function togglePass(show){
            inputPass.type=show?'text':'password';
            eyeIcon.textContent=show?'🙈':'👁';
            if(showCb.checked!==show) showCb.checked=show;
        }
        document.getElementById('auth-show-pass')?.addEventListener('change',()=>togglePass(showCb.checked));
        document.getElementById('auth-eye')?.addEventListener('click',()=>togglePass(inputPass.type==='password'));
        const rememberCb = document.getElementById('auth-remember');
        rememberCb?.addEventListener('change', () => {
            if (rememberCb.checked) {
                _setRememberOptOut(false);
            } else {
                _setRememberOptOut(true);
                try { localStorage.removeItem('__auth_remembered'); } catch (_e) {}
                _clearProfileCache();
            }
        });
        [inputUser,inputPass].forEach(el=>{
            el?.addEventListener('keydown',(e)=>{ if(e.key==='Enter') _doLogin(); });
            el?.addEventListener('input',()=>{ document.getElementById('auth-error').style.display='none'; });
        });
        document.getElementById('auth-btn-login')?.addEventListener('click',_doLogin);
    }

    async function _doLogin() {
        if(_locked) return;
        const user=document.getElementById('auth-user')?.value.trim();
        const pass=document.getElementById('auth-pass')?.value;
        const errorEl =document.getElementById('auth-error');
        const attempEl=document.getElementById('auth-attempts-info');
        const btnText =document.getElementById('auth-btn-text');
        const btn     =document.getElementById('auth-btn-login');

        if(!user||!pass){
            errorEl.textContent='❌ Completa usuario y contraseña.';
            errorEl.style.cssText='display:block';
            return;
        }

        // Mostrar indicador de carga
        const spinnerEl = document.getElementById('auth-spinner');
        if(spinnerEl) spinnerEl.classList.add('active');
        if(btnText) btnText.textContent='Iniciando sesión...';
        btn.disabled=true;

        const result=await _verifyCredentials(user,pass);

        // Ocultar indicador de carga
        if(spinnerEl) spinnerEl.classList.remove('active');

        if(result.ok){
            _attempts=0;
            var rememberCb = document.getElementById('auth-remember');
            if (rememberCb && rememberCb.checked) {
                try { localStorage.setItem('__auth_remembered', JSON.stringify({username: user})); } catch(_e) {}
                _setRememberOptOut(false);
            } else {
                try { localStorage.removeItem('__auth_remembered'); } catch(_e) {}
                _setRememberOptOut(true);
                _clearProfileCache();
            }
            if (result.requires2FA) {
                _show2FAInput(user, pass);
                if(btnText) btnText.textContent='Iniciar sesión';
                btn.disabled=false;
                return;
            }
            if (rememberCb && rememberCb.checked) _cacheProfileFromServer(result.username);
            _onLoginSuccess({username:result.username,role:result.role,mustChangePassword:result.mustChangePassword});
        } else {
            const blocked=_registerFailedAttempt();
            if(!blocked){
                errorEl.textContent=`❌ ${result.error||'Credenciales incorrectas.'}`;
                errorEl.style.cssText='display:block;';
                const remaining=CFG.MAX_ATTEMPTS-_attempts;
                if(remaining<=2){
                    attempEl.textContent=`⚠️ ${remaining} intento${remaining!==1?'s':''} restante${remaining!==1?'s':''} antes del bloqueo.`;
                    attempEl.style.display='block';
                }
                const card=document.querySelector('.auth-card');
                card?.classList.add('auth-shake');
                setTimeout(()=>card?.classList.remove('auth-shake'),500);
            }
            if(btnText) btnText.textContent='Iniciar sesión';
            btn.disabled=false;
        }
    }

    function _show2FAInput(username, password) {
        const formArea = document.getElementById('auth-form-area');
        if (!formArea) return;
        formArea.innerHTML = `
            <div style="text-align:center;padding:10px 0;">
                <div style="font-size:2rem;margin-bottom:8px;">🔐</div>
                <h3 style="margin:0 0 4px 0;color:var(--text-primary,#1e293b);font-size:1rem;">Autenticación de dos factores</h3>
                <p style="margin:0 0 16px 0;color:var(--text-secondary,#64748b);font-size:0.85rem;">
                    Ingresa el código de 6 dígitos de tu aplicación autenticadora.
                </p>
                <div class="auth-field">
                    <div class="auth-input-wrap has-icon">
                        <span class="auth-input-icon">🔑</span>
                        <input class="auth-input" type="text" id="auth-totp" placeholder=" " autocomplete="one-time-code" inputmode="numeric" maxlength="6" style="font-size:1.5rem;letter-spacing:8px;text-align:center;font-weight:700;">
                        <label class="auth-label" for="auth-totp">Código 2FA</label>
                    </div>
                </div>
                <div class="auth-error" id="auth-2fa-error" style="display:none;margin-bottom:8px;"></div>
                <button class="auth-btn-login" id="auth-btn-2fa" type="button">
                    <span id="auth-btn-2fa-text">Verificar</span>
                    <span class="auth-btn-arrow">→</span>
                </button>
                <div style="margin-top:12px;">
                    <button id="auth-back-to-login" style="background:none;border:none;color:var(--accent,#3b82f6);cursor:pointer;font-size:0.8rem;text-decoration:underline;">
                        ← Volver al inicio de sesión
                    </button>
                </div>
            </div>`;

        const totpInput = document.getElementById('auth-totp');
        totpInput.focus();

        document.getElementById('auth-btn-2fa').addEventListener('click', async function() {
            const code = totpInput.value.trim();
            const errorEl = document.getElementById('auth-2fa-error');
            const btn2faText = document.getElementById('auth-btn-2fa-text');
            const btn2fa = document.getElementById('auth-btn-2fa');

            if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
                errorEl.textContent = '❌ Ingresa un código válido de 6 dígitos.';
                errorEl.style.display = 'block';
                return;
            }

            btn2fa.disabled = true;
            btn2faText.textContent = 'Verificando...';

            const result = await _verify2FA(code);
            if (result.ok) {
                _show2FASuccess(result);
            } else {
                errorEl.textContent = '❌ ' + (result.error || 'Código inválido. Intenta de nuevo.');
                errorEl.style.display = 'block';
                btn2fa.disabled = false;
                btn2faText.textContent = 'Verificar';
                totpInput.value = '';
                totpInput.focus();
            }
        });

        totpInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') document.getElementById('auth-btn-2fa').click();
        });

        document.getElementById('auth-back-to-login').addEventListener('click', function() {
            // Variante-aware: vuelve al login que el usuario esté usando (v1/v2).
            showLogin();
        });
    }

    function _show2FASuccess(result) {
        const formArea = document.getElementById('auth-form-area');
        if (!formArea) return;
        formArea.innerHTML = `
            <div style="text-align:center;padding:20px 0;">
                <div style="font-size:3rem;margin-bottom:12px;">✅</div>
                <h3 style="margin:0 0 4px 0;color:var(--text-primary,#1e293b);">Verificación exitosa</h3>
                <p style="margin:0;color:var(--text-secondary,#64748b);font-size:0.85rem;">Redirigiendo...</p>
            </div>`;
        setTimeout(function() {
            try {
                if (localStorage.getItem('__auth_remembered')) _cacheProfileFromServer(result.username);
            } catch (_e) {}
            _onLoginSuccess({username: result.username, role: result.role || 'user', mustChangePassword: false});
        }, 800);
    }

    async function _onLoginSuccess(userData){
        localStorage.setItem('ultimoLogin', new Date().toISOString());
        localStorage.setItem('sessionStart', Date.now().toString());
        if (_token) {
            await _registerDevice();
        }
        _startSession(userData);
        const card=document.querySelector('.auth-card');
        card?.classList.add('auth-success-exit');
        setTimeout(()=>{
            document.getElementById('auth-overlay')?.remove();
            if (userData.mustChangePassword) {
                _showForceChangePasswordModal(userData);
                return;
            }
            _registerActivityListeners();
            _enterWithArea(()=>{ if(_onLogin) _onLogin(userData); }, userData && userData.role);
        },600);
    }

    function _showForceChangePasswordModal(userData) {
        document.getElementById('force-pwd-modal')?.remove();
        const modal = document.createElement('div');
        modal.id = 'force-pwd-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
            <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);"></div>
            <div style="position:relative;background:var(--bg-card,#fff);border-radius:16px;padding:24px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.4);text-align:center;">
                <div style="font-size:3rem;margin-bottom:12px;">🔐</div>
                <h2 style="margin:0 0 8px 0;color:var(--text-primary,#1e293b);">Cambio de contraseña requerido</h2>
                <p style="margin:0 0 16px 0;color:var(--text-secondary,#64748b);font-size:0.85rem;">Debes crear una nueva contraseña y código de firma antes de continuar.</p>

                <div style="margin-bottom:12px;padding:8px 12px;background:var(--bg-panel,#f8fafc);border-radius:8px;border:1px solid var(--border-color,#e2e8f0);font-size:0.8rem;color:var(--text-secondary,#64748b);text-align:left;">
                    🔑 Contacta al administrador para obtener tu contraseña temporal.
                </div>

                <div style="margin-bottom:12px;text-align:left;">
                    <label style="display:block;font-size:0.75rem;font-weight:600;color:var(--text-secondary,#64748b);margin-bottom:4px;">NUEVA CONTRASEÑA <span id="pwd-new-count" style="font-weight:400;color:#94a3b8;font-size:0.7rem;">(0)</span></label>
                    <div style="position:relative;">
                        <input type="password" id="force-pwd-new" autocomplete="new-password" style="width:100%;padding:12px 38px 12px 12px;border:2px solid var(--border-color,#e2e8f0);border-radius:10px;font-size:0.9rem;box-sizing:border-box;background:#fff;color:#111827;">
                        <span id="pwd-new-toggle" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:1.1rem;line-height:1;color:#94a3b8;user-select:none;">👁</span>
                    </div>
                    <div id="force-pwd-new-error" style="font-size:0.75rem;color:#dc2626;margin-top:4px;display:none;"></div>
                </div>

                <div id="pwd-checklist" style="margin:0 0 14px 0;text-align:left;font-size:0.78rem;display:flex;flex-direction:column;gap:5px;padding:10px 12px;background:var(--bg-panel,#f8fafc);border-radius:8px;border:1px solid var(--border-color,#e2e8f0);">
                    <div class="pwd-req" data-req="length"><span class="pwd-dot" style="display:inline-block;width:16px;text-align:center;font-weight:700;color:#94a3b8;">○</span> 8+ caracteres</div>
                    <div class="pwd-req" data-req="upper"><span class="pwd-dot" style="display:inline-block;width:16px;text-align:center;font-weight:700;color:#94a3b8;">○</span> 1 mayúscula (A-Z)</div>
                    <div class="pwd-req" data-req="lower"><span class="pwd-dot" style="display:inline-block;width:16px;text-align:center;font-weight:700;color:#94a3b8;">○</span> 1 minúscula (a-z)</div>
                    <div class="pwd-req" data-req="digit"><span class="pwd-dot" style="display:inline-block;width:16px;text-align:center;font-weight:700;color:#94a3b8;">○</span> 1 dígito (0-9)</div>
                    <div class="pwd-req" data-req="special"><span class="pwd-dot" style="display:inline-block;width:16px;text-align:center;font-weight:700;color:#94a3b8;">○</span> 1 carácter especial (!@#$%^&*)</div>
                    <div class="pwd-req" data-req="match" style="border-top:1px solid var(--border-color,#e2e8f0);padding-top:5px;margin-top:2px;"><span class="pwd-dot" style="display:inline-block;width:16px;text-align:center;font-weight:700;color:#94a3b8;">○</span> Contraseñas coinciden</div>
                </div>

                <div style="margin-bottom:12px;text-align:left;">
                    <label style="display:block;font-size:0.75rem;font-weight:600;color:var(--text-secondary,#64748b);margin-bottom:4px;">CONFIRMAR CONTRASEÑA <span id="pwd-confirm-count" style="font-weight:400;color:#94a3b8;font-size:0.7rem;">(0)</span></label>
                    <div style="position:relative;">
                        <input type="password" id="force-pwd-confirm" autocomplete="new-password" style="width:100%;padding:12px 38px 12px 12px;border:2px solid var(--border-color,#e2e8f0);border-radius:10px;font-size:0.9rem;box-sizing:border-box;background:#fff;color:#111827;">
                        <span id="pwd-confirm-toggle" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:1.1rem;line-height:1;color:#94a3b8;user-select:none;">👁</span>
                    </div>
                    <div id="force-pwd-confirm-error" style="font-size:0.75rem;color:#dc2626;margin-top:4px;display:none;"></div>
                </div>

                <div style="margin-bottom:16px;text-align:left;">
                    <label style="display:block;font-size:0.75rem;font-weight:600;color:var(--text-secondary,#64748b);margin-bottom:4px;">CÓDIGO DE FIRMA <span style="font-weight:400;color:#dc2626;font-size:0.7rem;">*obligatorio</span></label>
                    <input type="text" id="force-pwd-sig" maxlength="50" placeholder="Ej: fn24" style="width:100%;padding:12px;border:2px solid var(--border-color,#e2e8f0);border-radius:10px;font-size:0.9rem;box-sizing:border-box;background:#fff;color:#111827;font-family:monospace;">
                    <div id="force-pwd-sig-error" style="font-size:0.75rem;color:#dc2626;margin-top:4px;display:none;"></div>
                    <div style="font-size:0.7rem;color:var(--text-faint,#94a3b8);margin-top:2px;">Mínimo 3 caracteres. Se usará para firmar reportes electrónicos.</div>
                </div>

                <div id="force-pwd-current-wrap" style="margin-bottom:12px;text-align:left;display:none;">
                    <label style="display:block;font-size:0.75rem;font-weight:600;color:var(--text-secondary,#64748b);margin-bottom:4px;">CONTRASEÑA ACTUAL</label>
                    <input type="password" id="force-pwd-current" autocomplete="current-password" style="width:100%;padding:12px;border:2px solid var(--border-color,#e2e8f0);border-radius:10px;font-size:0.9rem;box-sizing:border-box;background:#fff;color:#111827;">
                    <div id="force-pwd-current-error" style="font-size:0.75rem;color:#dc2626;margin-top:4px;display:none;"></div>
                    <div style="font-size:0.7rem;color:var(--text-faint,#94a3b8);margin-top:2px;">Tu cuenta ya no está en estado temporal: confirma tu contraseña vigente.</div>
                </div>

                <div id="force-pwd-msg" style="display:none;"></div>
                <style>#force-pwd-modal input::placeholder{color:#9ca3b8;opacity:1;}</style>

                <button id="force-pwd-submit" style="padding:14px 20px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;border:none;border-radius:12px;cursor:pointer;font-weight:600;width:100%;font-size:1rem;">Cambiar contraseña</button>
            </div>`;

        document.body.appendChild(modal);

        const newInput = document.getElementById('force-pwd-new');
        const confirmInput = document.getElementById('force-pwd-confirm');
        newInput.focus();

        function _togglePwdVisibility(inputId, toggleId) {
            var inp = document.getElementById(inputId);
            var tog = document.getElementById(toggleId);
            if (!inp || !tog) return;
            var isPwd = inp.type === 'password';
            inp.type = isPwd ? 'text' : 'password';
            tog.textContent = isPwd ? '🙈' : '👁';
        }
        document.getElementById('pwd-new-toggle').addEventListener('click', function(){_togglePwdVisibility('force-pwd-new','pwd-new-toggle');});
        document.getElementById('pwd-confirm-toggle').addEventListener('click', function(){_togglePwdVisibility('force-pwd-confirm','pwd-confirm-toggle');});

        function _updatePwdChecklist() {
            var v = newInput.value;
            var c = confirmInput.value;
            var countEl = document.getElementById('pwd-new-count');
            var countCe = document.getElementById('pwd-confirm-count');
            if(countEl) countEl.textContent = '(' + v.length + ')';
            if(countCe) countCe.textContent = '(' + c.length + ')';
            var checks = {
                length:  v.length >= 8,
                upper:   /[A-Z]/.test(v),
                lower:   /[a-z]/.test(v),
                digit:   /[0-9]/.test(v),
                special: /[^A-Za-z0-9]/.test(v),
                match:   v.length > 0 && c.length > 0 && v === c
            };
            document.querySelectorAll('#pwd-checklist .pwd-req').forEach(function(el) {
                var req = el.getAttribute('data-req');
                var dot = el.querySelector('.pwd-dot');
                if (checks[req]) {
                    dot.textContent = '✓';
                    dot.style.color = '#16a34a';
                    el.style.color = '#16a34a';
                } else {
                    dot.textContent = '○';
                    dot.style.color = '#94a3b8';
                    el.style.color = '#64748b';
                }
            });
        }

        newInput.addEventListener('input', _updatePwdChecklist);
        confirmInput.addEventListener('input', _updatePwdChecklist);
        newInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmInput.focus(); });
        confirmInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') document.getElementById('force-pwd-submit').click(); });

        const sigInput = document.getElementById('force-pwd-sig');
        const curInput = document.getElementById('force-pwd-current');
        const curWrap = document.getElementById('force-pwd-current-wrap');

        document.getElementById('force-pwd-submit').addEventListener('click', async () => {
            const newPwd = newInput.value;
            const confirmPwd = confirmInput.value;
            const sigCode = sigInput.value.trim();
            const newError = document.getElementById('force-pwd-new-error');
            const confirmError = document.getElementById('force-pwd-confirm-error');
            const sigError = document.getElementById('force-pwd-sig-error');
            const msgEl = document.getElementById('force-pwd-msg');
            const submitBtn = document.getElementById('force-pwd-submit');

            newError.style.display = 'none';
            confirmError.style.display = 'none';
            sigError.style.display = 'none';
            msgEl.style.display = 'none';

            if (!newPwd || newPwd.length < 8) { newError.textContent = 'Mínimo 8 caracteres'; newError.style.display = 'block'; return; }
            if (!/[A-Z]/.test(newPwd)) { newError.textContent = 'Debe contener mayúscula'; newError.style.display = 'block'; return; }
            if (!/[a-z]/.test(newPwd)) { newError.textContent = 'Debe contener minúscula'; newError.style.display = 'block'; return; }
            if (!/[0-9]/.test(newPwd)) { newError.textContent = 'Debe contener dígito'; newError.style.display = 'block'; return; }
            if (!/[^A-Za-z0-9]/.test(newPwd)) { newError.textContent = 'Debe contener carácter especial'; newError.style.display = 'block'; return; }
            if (newPwd !== confirmPwd) { confirmError.textContent = 'Las contraseñas no coinciden'; confirmError.style.display = 'block'; return; }
            if (!sigCode || sigCode.length < 3) { sigError.textContent = 'El código de firma debe tener al menos 3 caracteres'; sigError.style.display = 'block'; return; }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Cambiando...';

            const result = await _changePassword(newPwd, sigCode, curInput.value);
            if (result.ok) {
                showToast('✅ Contraseña y código de firma configurados');
                modal.remove();
                const session = _getSession();
                if (session) {
                    session.mustChangePassword = false;
                    sessionStorage.setItem(CFG.SESSION_STORAGE_KEY, JSON.stringify(session));
                }
                _registerActivityListeners();
                _enterWithArea(()=>{ if (_onLogin) _onLogin(session || userData); }, (session && session.role) || (userData && userData.role));
            } else {
                // La cuenta salió del estado temporal: revelar campo actual y reintentar con él.
                if (/actual/i.test(result.error || '') && curWrap.style.display !== 'block') {
                    curWrap.style.display = 'block';
                    curInput.focus();
                }
                msgEl.textContent = '❌ ' + (result.error || 'Error al cambiar contraseña');
                msgEl.style.cssText = 'display:block;color:#dc2626;background:#fef2f2;padding:12px;border-radius:10px;margin-top:12px;font-size:0.85rem;';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Cambiar contraseña';
            }
        });
    }

    async function _changePassword(newPassword, signatureCode, currentPassword) {
        try {
            const body = { newPassword };
            if (signatureCode) body.signatureCode = signatureCode;
            if (currentPassword) body.currentPassword = currentPassword;
            const res = await fetchWithTimeout(`${CFG.API_URL}/api/users/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_token}` },
                body: JSON.stringify(body)
            });
            return await res.json();
        } catch {
            return { error: 'Error de conexión' };
        }
    }

    async function _registerDevice() {
        try {
            if (typeof DeviceFingerprint === 'undefined') return;
            if (!_token) return;
            var fp = DeviceFingerprint.getFingerprint();
            var info = DeviceFingerprint.getDeviceInfo();
            await fetchWithTimeout(CFG.API_URL + '/api/devices/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _token },
                body: JSON.stringify({
                    fingerprint: fp,
                    device_name: DeviceFingerprint.getDeviceLabel(),
                    browser: info.userAgent ? (info.userAgent.includes('Chrome') && !info.userAgent.includes('Edg') ? 'Chrome' : info.userAgent.includes('Firefox') ? 'Firefox' : info.userAgent.includes('Safari') && !info.userAgent.includes('Chrome') ? 'Safari' : info.userAgent.includes('Edg') ? 'Edge' : info.userAgent.includes('OPR') ? 'Opera' : 'Otro') : '—',
                    os: info.platform || '—',
                    screen_res: info.screen || '—',
                    timezone: info.timezone || '—',
                }),
            });
        } catch (_e) { console.warn('Device register failed (non-critical):', _e); }
    }

    // ── Actividad ─────────────────────────
    function _registerActivityListeners(){
        ['mousemove','keydown','click','scroll','touchstart'].forEach(e=>document.addEventListener(e,_onActivity,{passive:true}));
    }
    function _unregisterActivityListeners(){
        ['mousemove','keydown','click','scroll','touchstart'].forEach(e=>document.removeEventListener(e,_onActivity));
    }
    let _lastActivity=0;
    function _onActivity(){ const now=Date.now(); if(now-_lastActivity<10000) return; _lastActivity=now; _resetActivityTimer(); }

    // ── API pública ───────────────────────
    function showLogin(reason=''){
        _unregisterActivityListeners();
        if(_resolveLoginVariant()==='v2') _renderLoginModalV2(reason);
        else _renderLoginModal(reason);
    }

    async function init({onLogin,onLogout}={}){
        _onLogin=onLogin||null; _onLogout=onLogout||null;
        if(!_isSessionValid()){ showLogin(); return; }
        if(!_token){
            var stored=sessionStorage.getItem('auth_token');
            if(stored){ _token=stored; }
            else{
                try{
                    const res=await fetchWithTimeout(`${CFG.API_URL}/api/me`,{credentials:'include'});
                    if(res.ok){ const data=await res.json(); if(data.token){ _token=data.token; sessionStorage.setItem('auth_token',data.token); } }
                }catch(e){ console.warn('Cookie session not available, will re-login on first 401:', e.message); }
            }
        }
        const session = _getSession();
        _scheduleTimers();
        _registerActivityListeners();
        // Cambio de área: reprogramar con el timeout que corresponda (15/5 min).
        try {
            if (typeof window !== 'undefined' && window.addEventListener && !window.__authAreaHook) {
                window.__authAreaHook = true;
                window.addEventListener('sigma-area', function () { _resetActivityTimer(); });
            }
        } catch (e) {}
        if (session && session.mustChangePassword) {
            document.getElementById('auth-overlay')?.remove();
            _showForceChangePasswordModal(session);
            return;
        }
        _enterWithArea(()=>{ if(_onLogin) _onLogin(session); }, session && session.role);
    }

    function logout(){
        _closeAllModals();
        fetchWithTimeout(`${CFG.API_URL}/api/logout`,{method:'POST',credentials:'include',headers:{Authorization:'Bearer '+(_token||'')}}).catch(()=>{});
        try { if (typeof AreaSelect !== 'undefined' && AreaSelect.clearArea) AreaSelect.clearArea(); } catch (e) {}
        _clearSession(); _unregisterActivityListeners(); showLogin('logout'); if(_onLogout) _onLogout('logout');
    }

    function getArea(){
        try {
            if (typeof AreaSelect !== 'undefined' && AreaSelect.getArea) return AreaSelect.getArea();
        } catch (e) {}
        return null;
    }

    function selectArea(next) {
        try {
            if (typeof AreaSelect !== 'undefined' && AreaSelect.showModal) return AreaSelect.showModal(next);
        } catch (e) {}
        if (next) next(null);
        return false;
    }

    function keepAlive(){ _resetActivityTimer(); const w=document.getElementById('auth-timeout-warn'); if(w) w.style.opacity='0'; }
    function getSession(){ return _isSessionValid()?_getSession():null; }
    function isAuthenticated(){ return _isSessionValid(); }

    // ── 2FA API pública ──────────────────────
    async function get2FAStatus() {
        try {
            const res = await fetchWithTimeout(`${CFG.API_URL}/api/2fa/status`, {
                headers: { 'Authorization': 'Bearer ' + (_token || '') }
            });
            const data = await res.json();
            return data.ok ? data.enabled : false;
        } catch { return false; }
    }

    async function setup2FA() {
        try {
            const res = await fetchWithTimeout(`${CFG.API_URL}/api/2fa/setup`, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + (_token || '') }
            });
            return await res.json();
        } catch { return { error: 'Error de conexión' }; }
    }

    async function enable2FA(totpCode) {
        try {
            const res = await fetchWithTimeout(`${CFG.API_URL}/api/2fa/enable`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (_token || '') },
                body: JSON.stringify({ token: totpCode })
            });
            return await res.json();
        } catch { return { error: 'Error de conexión' }; }
    }

    async function disable2FA(targetUsername, adminPassword) {
        try {
            const res = await fetchWithTimeout(`${CFG.API_URL}/api/2fa/disable`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (_token || '') },
                body: JSON.stringify({ username: targetUsername, password: adminPassword })
            });
            return await res.json();
        } catch { return { error: 'Error de conexión' }; }
    }

    return { init, showLogin, logout, keepAlive, getSession, isAuthenticated, getToken, get2FAStatus, setup2FA, enable2FA, disable2FA, getArea, selectArea, getLoginVariant, setLoginVariant };

})();

