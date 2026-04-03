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
                <div class="auth-support-box"><div>📧 soporte@statanalyzer.com</div><div>📞 +1 (800) 000-0000</div></div>
            </div>
            <div class="auth-footer"><span>FDA 21 CFR Part 11 Compliant</span><span>v1.0</span></div>
        </div>
        <div class="auth-timeout-warn" id="auth-timeout-warn">
            ⏱ Tu sesión expirará en <strong id="auth-warn-countdown">60</strong> segundos por inactividad.
            <button onclick="Auth.keepAlive()" class="auth-warn-btn">Mantener sesión</button>
        </div>`;
        document.body.appendChild(overlay);
        _attachLoginListeners();
        _renderParticles();
    }

    function _renderParticles() {
        const c = document.getElementById('auth-particles');
        if (!c) return;

        // Símbolos estadísticos
        const SYMBOLS = ['∑', 'σ', 'μ', 'χ²', 'β', 'α', 'ρ', 'Δ', '∞', 'π', 'φ', 'λ', 'ζ', 'η', 'θ', 'κ', 'ν', 'τ', 'ω', '∂', '∇', '∈', '∉', '∪', '∩', '⊕', '⊗', '∀', '∃', '∄'];

        // Paleta: dorado de la app + azul de la app
        const COLORS = [
            'rgba(200, 169, 81,',   // dorado
            'rgba(102, 126, 234,',  // púrpura/azul app
            'rgba(255, 255, 255,',  // blanco suave
            'rgba(0, 0, 0,',  // negro
            'rgba(0, 255, 0,',  // verde
            'rgba(255, 0, 0,',  // rojo
        ];

        // ── Partículas circulares (fondo) ──────────────────
        for (let i = 0; i < 20; i++) {
            const p       = document.createElement('div');
            p.className   = 'auth-particle';
            const size    = 2 + Math.random() * 5;
            const color   = COLORS[Math.floor(Math.random() * COLORS.length)];
            const opacity = 0.08 + Math.random() * 0.20;
            p.style.cssText = `
                left:               ${Math.random() * 100}%;
                top:                ${Math.random() * 100}%;
                width:              ${size}px;
                height:             ${size}px;
                background:         ${color}${opacity});
                animation-delay:    ${Math.random() * 10}s;
                animation-duration: ${7 + Math.random() * 8}s;
            `;
            c.appendChild(p);
        }

        // ── Símbolos estadísticos flotantes ────────────────
        for (let i = 0; i < 16; i++) {
            const span     = document.createElement('span');
            span.className = 'auth-symbol';
            span.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

            const size    = 11 + Math.random() * 18;       // 11px – 29px
            const color   = COLORS[Math.floor(Math.random() * COLORS.length)];
            const opacity = 0.10 + Math.random() * 0.22;
            const dur     = 8  + Math.random() * 12;       // 8s – 20s
            const delay   = Math.random() * 10;
            const rotDir  = Math.random() > 0.5 ? 1 : -1;  // sentido de rotación
            const drift   = (Math.random() - 0.5) * 60;    // deriva horizontal ±30px

            span.style.cssText = `
                left:               ${Math.random() * 100}%;
                top:                ${100 + Math.random() * 20}%;
                font-size:          ${size}px;
                color:              ${color}${opacity});
                animation:          auth-symbol-float ${dur}s ${delay}s linear infinite;
                --rot:              ${rotDir * (20 + Math.random() * 40)}deg;
                --drift:            ${drift}px;
            `;
            c.appendChild(span);
        }
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
            errorEl.style.cssText='display:block;';
            return;
        }

        if(btnText) btnText.textContent='Verificando...';
        btn.disabled=true;

        const result=await _verifyCredentials(user,pass);

        if(result.ok){
            _attempts=0;
            _onLoginSuccess({username:result.username,role:result.role});
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

    function _onLoginSuccess(userData){
        // Guardar fechas para el modal de perfil
        localStorage.setItem('ultimoLogin', new Date().toISOString());
        localStorage.setItem('sessionStart', Date.now().toString());

        const card=document.querySelector('.auth-card');
        card?.classList.add('auth-success-exit');
        setTimeout(()=>{
            _startSession(userData);
            document.getElementById('auth-overlay')?.remove();
            _registerActivityListeners();
            if(_onLogin) _onLogin(userData);
        },600);
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
        _renderLoginModal(reason);
    }

    function init({onLogin,onLogout}={}){
        _onLogin=onLogin||null; _onLogout=onLogout||null;
        if(_isSessionValid()){ _scheduleTimers(); _registerActivityListeners(); if(_onLogin) _onLogin(_getSession()); return; }
        showLogin();
    }

    function logout(){
        const token=getToken();
        if(token){ fetch(`${CFG.API_URL}/api/logout`,{method:'POST',headers:{Authorization:`Bearer ${token}`}}).catch(()=>{}); }
        _clearSession(); _unregisterActivityListeners(); showLogin('logout'); if(_onLogout) _onLogout('logout');
    }

    function keepAlive(){ _resetActivityTimer(); const w=document.getElementById('auth-timeout-warn'); if(w) w.style.opacity='0'; }
    function getSession(){ return _isSessionValid()?_getSession():null; }
    function isAuthenticated(){ return _isSessionValid(); }

    return { init, showLogin, logout, keepAlive, getSession, isAuthenticated, getToken };

})();

console.log('✅ Auth module cargado');