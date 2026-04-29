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
        API_URL: API_URL,
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
            return { ok: true, username: data.username, role: data.role, token: data.token, mustChangePassword: data.mustChangePassword || false };
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
            mustChangePassword: userData.mustChangePassword || false
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