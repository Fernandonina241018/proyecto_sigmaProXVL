// ========================================
// auth.js — StatAnalyzer Pro
// Módulo de autenticación con backend
// ========================================

const Auth = (() => {

    const CFG = {
        SESSION_TIMEOUT_MS: 5 * 60 * 1000,
        MAX_ATTEMPTS:       10,
        SESSION_STORAGE_KEY:'auth_session',
        TOKEN_STORAGE_KEY:  'auth_token',
        WARN_BEFORE_MS:     60 * 1000,

        // ▼ CAMBIA ESTA URL ▼
        // Local:   'http://localhost:3000'
        // Railway: 'https://TU-PROYECTO.railway.app'
        // API_URL: 'http://localhost:3000',
        //API_URL: 'https://proyecto-sigmapro-production.railway.app',
        //API_URL: 'https://proyecto-sigmapro.onrender.com',
        API_URL: 'https://proyecto-sigmaproxvl.onrender.com',
    };

    let _sessionTimer=null, _warnTimer=null, _countdownTimer=null;
    let _attempts=0, _locked=false, _onLogin=null, _onLogout=null;

    // ── Verificación contra backend ───────
    async function _verifyCredentials(user, password) {
        try {
            const res  = await fetch(`${CFG.API_URL}/api/login`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ username: user, password }),
            });
            const data = await res.json();
            if (!res.ok) return { ok: false, error: data.error || 'Credenciales incorrectas' };
            sessionStorage.setItem(CFG.TOKEN_STORAGE_KEY, data.token);
            return { ok: true, username: data.username, role: data.role, token: data.token };
        } catch {
            return { ok: false, error: 'No se pudo conectar con el servidor.' };
        }
    }

    function getToken() { return sessionStorage.getItem(CFG.TOKEN_STORAGE_KEY); }

    // ── Sesión ────────────────────────────
    function _startSession(userData) {
        const session = {
            username: userData.username, role: userData.role,
            loginTime: Date.now(), expiresAt: Date.now() + CFG.SESSION_TIMEOUT_MS,
        };
        sessionStorage.setItem(CFG.SESSION_STORAGE_KEY, JSON.stringify(session));
        _scheduleTimers();
    }
    function _clearSession() {
        sessionStorage.removeItem(CFG.SESSION_STORAGE_KEY);
        sessionStorage.removeItem(CFG.TOKEN_STORAGE_KEY);
        clearTimeout(_sessionTimer); clearTimeout(_warnTimer); clearInterval(_countdownTimer);
        _sessionTimer=null; _warnTimer=null; _countdownTimer=null;
    }
    function _getSession() {
        try { const r=sessionStorage.getItem(CFG.SESSION_STORAGE_KEY); return r?JSON.parse(r):null; } catch { return null; }
    }
    function _isSessionValid() { const s=_getSession(); return s&&Date.now()<s.expiresAt; }

    function _resetActivityTimer() {
        const s=_getSession(); if(!s) return;
        s.expiresAt=Date.now()+CFG.SESSION_TIMEOUT_MS;
        sessionStorage.setItem(CFG.SESSION_STORAGE_KEY,JSON.stringify(s));
        _scheduleTimers();
        const w=document.getElementById('auth-timeout-warn'); if(w) w.style.opacity='0';
    }
    function _scheduleTimers() {
        clearTimeout(_sessionTimer); clearTimeout(_warnTimer); clearInterval(_countdownTimer);
        _warnTimer   = setTimeout(()=>_showTimeoutWarning(), CFG.SESSION_TIMEOUT_MS-CFG.WARN_BEFORE_MS);
        _sessionTimer= setTimeout(()=>_expireSession(),      CFG.SESSION_TIMEOUT_MS);
    }
    function _showTimeoutWarning() {
        const w=document.getElementById('auth-timeout-warn'); if(!w) return;
        w.style.opacity='1';
        let secs=Math.floor(CFG.WARN_BEFORE_MS/1000);
        const c=document.getElementById('auth-warn-countdown'); if(c) c.textContent=secs;
        clearInterval(_countdownTimer);
        _countdownTimer=setInterval(()=>{ secs--; if(c) c.textContent=secs; if(secs<=0) clearInterval(_countdownTimer); },1000);
    }
    function _expireSession() { _clearSession(); showLogin('timeout'); if(_onLogout) _onLogout('timeout'); }

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
    function _renderLoginModal(reason='') {
        document.getElementById('auth-overlay')?.remove();
        const reasonMsg={timeout:'⏱ Tu sesión expiró por inactividad.',logout:'👋 Sesión cerrada correctamente.'}[reason]||'';
        const overlay=document.createElement('div');
        overlay.id='auth-overlay';
        overlay.innerHTML=`
        <div class="auth-bg"><div class="auth-particles" id="auth-particles"></div></div>
        <div class="auth-card" role="dialog" aria-modal="true">
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
            <div class="auth-brand">
                <div class="auth-brand-icon">📊</div>
                <div class="auth-brand-name">StatAnalyzer Pro</div>
                <div class="auth-brand-sub">Sistema de Análisis Estadístico · FDA 21 CFR Part 11</div>
            </div>
            ${reasonMsg?`<div class="auth-reason-msg">${reasonMsg}</div>`:''}
            <div id="auth-form-area">
                <div class="auth-field">
                    <label class="auth-label" for="auth-user">Usuario</label>
                    <div class="auth-input-wrap">
                        <span class="auth-input-icon">👤</span>
                        <input class="auth-input" type="text" id="auth-user" placeholder="Ingresa tu usuario" autocomplete="username" autofocus>
                    </div>
                </div>
                <div class="auth-field">
                    <label class="auth-label" for="auth-pass">Contraseña</label>
                    <div class="auth-input-wrap">
                        <span class="auth-input-icon">🔒</span>
                        <input class="auth-input" type="password" id="auth-pass" placeholder="Ingresa tu contraseña" autocomplete="current-password">
                        <button class="auth-eye-btn" id="auth-eye" type="button" aria-label="Mostrar contraseña"><span id="auth-eye-icon">👁</span></button>
                    </div>
                    <label class="auth-checkbox-row">
                        <input type="checkbox" id="auth-show-pass">
                        <span class="auth-checkbox-custom"></span>
                        <span class="auth-checkbox-text">Mostrar contraseña</span>
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
