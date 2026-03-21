// ========================================
// auth.js — StatAnalyzer Pro
// Módulo de autenticación
// Sin base de datos: acepta cualquier
// credencial válida (usuario no vacío +
// contraseña no vacía). Cuando se integre
// una BD, solo cambia _verifyCredentials().
// ========================================

const Auth = (() => {

    // ── Configuración ─────────────────────
    const CFG = {
        SESSION_TIMEOUT_MS: 5 * 60 * 1000, // 5 minutos
        MAX_ATTEMPTS:       5,
        LOCKOUT_STORAGE_KEY:'auth_lockout',
        SESSION_STORAGE_KEY:'auth_session',
        WARN_BEFORE_MS:     60 * 1000,      // avisar 1 min antes de expirar
    };

    let _sessionTimer   = null;
    let _warnTimer      = null;
    let _countdownTimer = null;
    let _attempts       = 0;
    let _locked         = false;
    let _onLogin        = null; // callback cuando autenticación es exitosa
    let _onLogout       = null; // callback cuando sesión expira o cierra

    // ── Verificación de credenciales ──────
    // TODO: reemplazar este bloque con llamada a BD
    function _verifyCredentials(user, password) {
        if (!user || !user.trim()) return false;
        if (!password || !password.trim()) return false;
        // Por ahora: cualquier usuario + contraseña no vacíos pasan
        return true;
    }

    // ── Gestión de sesión ─────────────────
    function _startSession(username) {
        const session = {
            username,
            loginTime: Date.now(),
            expiresAt: Date.now() + CFG.SESSION_TIMEOUT_MS,
        };
        sessionStorage.setItem(CFG.SESSION_STORAGE_KEY, JSON.stringify(session));
        _scheduleTimers();
    }

    function _clearSession() {
        sessionStorage.removeItem(CFG.SESSION_STORAGE_KEY);
        clearTimeout(_sessionTimer);
        clearTimeout(_warnTimer);
        clearInterval(_countdownTimer);
        _sessionTimer   = null;
        _warnTimer      = null;
        _countdownTimer = null;
    }

    function _getSession() {
        try {
            const raw = sessionStorage.getItem(CFG.SESSION_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    function _isSessionValid() {
        const s = _getSession();
        return s && Date.now() < s.expiresAt;
    }

    // Reinicia el timer de inactividad en cualquier interacción
    function _resetActivityTimer() {
        const s = _getSession();
        if (!s) return;
        s.expiresAt = Date.now() + CFG.SESSION_TIMEOUT_MS;
        sessionStorage.setItem(CFG.SESSION_STORAGE_KEY, JSON.stringify(s));
        _scheduleTimers();

        // Ocultar banner de advertencia si estaba visible
        const warn = document.getElementById('auth-timeout-warn');
        if (warn) warn.style.opacity = '0';
    }

    function _scheduleTimers() {
        clearTimeout(_sessionTimer);
        clearTimeout(_warnTimer);
        clearInterval(_countdownTimer);

        // Timer de advertencia (1 min antes)
        _warnTimer = setTimeout(() => {
            _showTimeoutWarning();
        }, CFG.SESSION_TIMEOUT_MS - CFG.WARN_BEFORE_MS);

        // Timer de expiración
        _sessionTimer = setTimeout(() => {
            _expireSession();
        }, CFG.SESSION_TIMEOUT_MS);
    }

    function _showTimeoutWarning() {
        const warn = document.getElementById('auth-timeout-warn');
        if (!warn) return;
        warn.style.opacity = '1';

        let secs = Math.floor(CFG.WARN_BEFORE_MS / 1000);
        const countEl = document.getElementById('auth-warn-countdown');
        if (countEl) countEl.textContent = secs;

        clearInterval(_countdownTimer);
        _countdownTimer = setInterval(() => {
            secs--;
            if (countEl) countEl.textContent = secs;
            if (secs <= 0) clearInterval(_countdownTimer);
        }, 1000);
    }

    function _expireSession() {
        _clearSession();
        showLogin('timeout');
        if (_onLogout) _onLogout('timeout');
    }

    // ── Intentos fallidos ─────────────────
    function _registerFailedAttempt() {
        _attempts++;
        if (_attempts >= CFG.MAX_ATTEMPTS) {
            _locked = true;
            _showLockout();
            return true;
        }
        return false;
    }

    function _showLockout() {
        const form    = document.getElementById('auth-form-area');
        const lockout = document.getElementById('auth-lockout-msg');
        if (form)    form.style.display    = 'none';
        if (lockout) lockout.style.display = 'block';
    }

    // ── Render del modal de login ─────────
    function _renderLoginModal(reason = '') {
        // Eliminar modal previo si existe
        document.getElementById('auth-overlay')?.remove();

        const reasonMsg = {
            timeout:  '⏱ Tu sesión expiró por inactividad.',
            logout:   '👋 Sesión cerrada correctamente.',
            required: '',
        }[reason] || '';

        const overlay = document.createElement('div');
        overlay.id = 'auth-overlay';
        overlay.innerHTML = `
        <div class="auth-bg">
            <div class="auth-particles" id="auth-particles"></div>
        </div>

        <div class="auth-card" role="dialog" aria-modal="true" aria-label="Inicio de sesión">

            <!-- Logo / Brand -->
            <div class="auth-brand">
                <div class="auth-brand-icon">📊</div>
                <div class="auth-brand-name">StatAnalyzer Pro</div>
                <div class="auth-brand-sub">Sistema de Análisis Estadístico · FDA 21 CFR Part 11</div>
            </div>

            <!-- Mensaje de razón (timeout, etc.) -->
            ${reasonMsg ? `<div class="auth-reason-msg">${reasonMsg}</div>` : ''}

            <!-- Área del formulario -->
            <div id="auth-form-area">

                <div class="auth-field">
                    <label class="auth-label" for="auth-user">Usuario</label>
                    <div class="auth-input-wrap">
                        <span class="auth-input-icon">👤</span>
                        <input
                            class="auth-input"
                            type="text"
                            id="auth-user"
                            placeholder="Ingresa tu usuario"
                            autocomplete="username"
                            autofocus
                        >
                    </div>
                </div>

                <div class="auth-field">
                    <label class="auth-label" for="auth-pass">Contraseña</label>
                    <div class="auth-input-wrap">
                        <span class="auth-input-icon">🔒</span>
                        <input
                            class="auth-input"
                            type="password"
                            id="auth-pass"
                            placeholder="Ingresa tu contraseña"
                            autocomplete="current-password"
                        >
                        <button class="auth-eye-btn" id="auth-eye" type="button" title="Mostrar/ocultar contraseña" aria-label="Mostrar contraseña">
                            <span id="auth-eye-icon">👁</span>
                        </button>
                    </div>
                    <label class="auth-checkbox-row" id="auth-show-pass-label">
                        <input type="checkbox" id="auth-show-pass">
                        <span class="auth-checkbox-custom"></span>
                        <span class="auth-checkbox-text">Mostrar contraseña</span>
                    </label>
                </div>

                <!-- Error message -->
                <div class="auth-error" id="auth-error" style="display:none"></div>

                <!-- Intentos restantes -->
                <div class="auth-attempts" id="auth-attempts-info" style="display:none"></div>

                <button class="auth-btn-login" id="auth-btn-login" type="button">
                    <span id="auth-btn-text">Iniciar sesión</span>
                    <span class="auth-btn-arrow">→</span>
                </button>

                <div class="auth-divider">
                    <span>o</span>
                </div>

                <button class="auth-btn-create" id="auth-btn-create" type="button">
                    ➕ Crear nuevo usuario
                    <span class="auth-admin-badge">Solo Admin</span>
                </button>

            </div>

            <!-- Mensaje de bloqueo -->
            <div id="auth-lockout-msg" style="display:none" class="auth-lockout">
                <div class="auth-lockout-icon">🔒</div>
                <h3>Acceso bloqueado</h3>
                <p>Has superado el número máximo de intentos permitidos (<strong>${CFG.MAX_ATTEMPTS}</strong>).</p>
                <p>Por favor, comunícate con <strong>Soporte Técnico</strong> para restablecer tu acceso.</p>
                <div class="auth-support-box">
                    <div>📧 soporte@statanalyzer.com</div>
                    <div>📞 +1 (800) 000-0000</div>
                </div>
            </div>

            <!-- Footer -->
            <div class="auth-footer">
                <span>${REGULATORY_LABEL}</span>
                <span>v1.0</span>
            </div>
        </div>

        <!-- Banner de advertencia de timeout (se muestra 1 min antes) -->
        <div class="auth-timeout-warn" id="auth-timeout-warn">
            ⏱ Tu sesión expirará en <strong id="auth-warn-countdown">60</strong> segundos por inactividad.
            <button onclick="Auth.keepAlive()" class="auth-warn-btn">Mantener sesión</button>
        </div>`;

        document.body.appendChild(overlay);
        _attachLoginListeners();
        _renderParticles();
    }

    const REGULATORY_LABEL = 'FDA 21 CFR Part 11 Compliant';

    function _renderParticles() {
        const container = document.getElementById('auth-particles');
        if (!container) return;
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'auth-particle';
            p.style.cssText = `
                left: ${Math.random()*100}%;
                top:  ${Math.random()*100}%;
                width:  ${2 + Math.random()*4}px;
                height: ${2 + Math.random()*4}px;
                opacity: ${0.1 + Math.random()*0.25};
                animation-delay: ${Math.random()*8}s;
                animation-duration: ${6 + Math.random()*6}s;
            `;
            container.appendChild(p);
        }
    }

    function _attachLoginListeners() {
        const inputUser = document.getElementById('auth-user');
        const inputPass = document.getElementById('auth-pass');
        const btnLogin  = document.getElementById('auth-btn-login');
        const btnCreate = document.getElementById('auth-btn-create');
        const eyeBtn    = document.getElementById('auth-eye');
        const showCb    = document.getElementById('auth-show-pass');
        const eyeIcon   = document.getElementById('auth-eye-icon');

        // Toggle mostrar contraseña — checkbox Y botón ojo sincronizados
        function togglePass(show) {
            inputPass.type  = show ? 'text' : 'password';
            eyeIcon.textContent = show ? '🙈' : '👁';
            if (showCb.checked !== show) showCb.checked = show;
        }

        showCb?.addEventListener('change', () => togglePass(showCb.checked));
        eyeBtn?.addEventListener('click',  () => togglePass(inputPass.type === 'password'));

        // Login con Enter
        [inputUser, inputPass].forEach(el => {
            el?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') _doLogin();
            });
            // Limpiar error mientras escribe
            el?.addEventListener('input', () => {
                document.getElementById('auth-error').style.display = 'none';
            });
        });

        btnLogin?.addEventListener('click', _doLogin);

        btnCreate?.addEventListener('click', () => {
            _showCreateUserInfo();
        });
    }

    function _doLogin() {
        if (_locked) return;

        const user = document.getElementById('auth-user')?.value.trim();
        const pass = document.getElementById('auth-pass')?.value;
        const errorEl    = document.getElementById('auth-error');
        const attemptsEl = document.getElementById('auth-attempts-info');
        const btnText    = document.getElementById('auth-btn-text');

        // Animación de carga
        if (btnText) btnText.textContent = 'Verificando...';
        document.getElementById('auth-btn-login').disabled = true;

        // Simular latencia de verificación (300ms)
        // Cuando se integre la BD, esta es la función a reemplazar
        setTimeout(() => {
            const ok = _verifyCredentials(user, pass);

            if (ok) {
                _attempts = 0;
                _onLoginSuccess(user);
            } else {
                const blocked = _registerFailedAttempt();
                if (!blocked) {
                    const remaining = CFG.MAX_ATTEMPTS - _attempts;
                    errorEl.textContent = '❌ Usuario o contraseña incorrectos.';
                    errorEl.style.display = 'block';

                    if (remaining <= 2) {
                        attemptsEl.textContent = `⚠️ ${remaining} intento${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''} antes del bloqueo.`;
                        attemptsEl.style.display = 'block';
                    }

                    // Shake animation en la card
                    const card = document.querySelector('.auth-card');
                    card?.classList.add('auth-shake');
                    setTimeout(() => card?.classList.remove('auth-shake'), 500);
                }

                if (btnText) btnText.textContent = 'Iniciar sesión';
                document.getElementById('auth-btn-login').disabled = false;
            }
        }, 300);
    }

    function _onLoginSuccess(username) {
        const card = document.querySelector('.auth-card');

        // Animación de salida
        card?.classList.add('auth-success-exit');

        setTimeout(() => {
            _startSession(username);
            document.getElementById('auth-overlay')?.remove();

            // Registrar actividad en eventos del usuario
            _registerActivityListeners();

            if (_onLogin) _onLogin({ username });
        }, 600);
    }

    function _showCreateUserInfo() {
        const errorEl = document.getElementById('auth-error');
        if (!errorEl) return;
        errorEl.style.background = '#ebf8ff';
        errorEl.style.borderColor = '#90cdf4';
        errorEl.style.color = '#2b6cb0';
        errorEl.innerHTML = '🔐 La creación de usuarios requiere privilegios de <strong>Administrador</strong>.<br>Esta funcionalidad estará disponible próximamente.';
        errorEl.style.display = 'block';
    }

    // ── Listeners de actividad ─────────────
    function _registerActivityListeners() {
        ['mousemove','keydown','click','scroll','touchstart'].forEach(evt => {
            document.addEventListener(evt, _onActivity, { passive: true });
        });
    }

    function _unregisterActivityListeners() {
        ['mousemove','keydown','click','scroll','touchstart'].forEach(evt => {
            document.removeEventListener(evt, _onActivity);
        });
    }

    // Throttle para no saturar al mover el mouse
    let _lastActivity = 0;
    function _onActivity() {
        const now = Date.now();
        if (now - _lastActivity < 10000) return; // throttle: máx 1 reset cada 10s
        _lastActivity = now;
        _resetActivityTimer();
    }

    // ── API pública ───────────────────────
    function showLogin(reason = '') {
        _unregisterActivityListeners();
        _renderLoginModal(reason);
    }

    function init({ onLogin, onLogout } = {}) {
        _onLogin  = onLogin  || null;
        _onLogout = onLogout || null;

        // Si ya hay sesión válida, continuar directo
        if (_isSessionValid()) {
            _scheduleTimers();
            _registerActivityListeners();
            if (_onLogin) _onLogin(_getSession());
            return;
        }

        // Si no hay sesión, mostrar login
        showLogin();
    }

    function logout() {
        _clearSession();
        _unregisterActivityListeners();
        showLogin('logout');
        if (_onLogout) _onLogout('logout');
    }

    function keepAlive() {
        _resetActivityTimer();
        const warn = document.getElementById('auth-timeout-warn');
        if (warn) warn.style.opacity = '0';
    }

    function getSession() {
        return _isSessionValid() ? _getSession() : null;
    }

    function isAuthenticated() {
        return _isSessionValid();
    }

    return {
        init,
        showLogin,
        logout,
        keepAlive,
        getSession,
        isAuthenticated,
    };

})();

console.log('✅ Auth module cargado');