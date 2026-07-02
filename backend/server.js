// ========================================
// server.js — StatAnalyzer Pro Backend
// Express + SQLite (sqlite3) + JWT
// ========================================

require('dotenv').config();

// ── Validación de variables de entorno críticas ──
if (!process.env.JWT_SECRET) {
    console.error('❌ ERROR: JWT_SECRET no está definido.');
    console.error('   Configúralo antes de arrancar el servidor:');
    console.error('     flyctl secrets set JWT_SECRET=<clave-de-al-menos-32-bytes>');
    console.error('   O localmente:  export JWT_SECRET=$(node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))")');
    process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ ERROR: JWT_SECRET debe tener al menos 32 caracteres.');
    console.error(`   Actual: ${process.env.JWT_SECRET.length} caracteres.`);
    console.error('   Genera una clave segura:');
    console.error('     node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"');
    process.exit(1);
}

const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD || 'sigma2026';

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet  = require('helmet');
const { authenticator } = require('otplib');
const QRCode  = require('qrcode');
const db      = require('./database');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── CORS manual — primero que todo ────
// Railway sobreescribe los headers del paquete 'cors'
// así que lo hacemos manualmente antes de cualquier otra cosa
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowed = [
        'https://fernandonina241018.github.io',
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'http://localhost:3000',
    ];

    // Verificar origen permitido
    if (origin && allowed.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    } else if (!origin) {
        // Permitir peticiones sin origen (file://, desarrollo local, curl)
        res.setHeader('Access-Control-Allow-Origin', '*');
    } else {
        // Rechazar orígenes no permitidos
        return res.status(403).json({ error: 'Origen no permitido' });
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

// ── Security headers (HSTS, X-Frame-Options, CSP, etc.) ──
// Desactivamos CSP por defecto para no romper la SPA vanilla que sirve
// su propio CSP en <meta>. HSTS queda activo (1 año, includeSubDomains).
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// ── Password Strength Validation (21 CFR 11.300) ──
function validatePasswordStrength(password) {
    if (!password || password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (password.length > 128) {
        return 'La contraseña no puede exceder 128 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
        return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/[a-z]/.test(password)) {
        return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/[0-9]/.test(password)) {
        return 'La contraseña debe contener al menos un número';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return 'La contraseña debe contener al menos un carácter especial (!@#$%^&* etc.)';
    }
    return null; // null = válida
}

// ── Request Logging con Correlation ID ──
app.use((req, res, next) => {
    const start = Date.now();
    req.correlationId = crypto.randomBytes(8).toString('hex');
    res.setHeader('X-Correlation-ID', req.correlationId);
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `[${req.correlationId}] ${req.method} ${res.statusCode} ${req.path} - ${duration}ms`;
        if (res.statusCode >= 400) {
            console.warn(`⚠️ ${log}`);
        } else if (req.path.startsWith('/api/')) {
            console.log(`📋 ${log}`);
        }
        // Log lento si supera 3s
        if (duration > 3000) {
            console.warn(`🐢 [${req.correlationId}] SLOW: ${req.method} ${req.path} - ${duration}ms`);
        }
    });
    next();
});

// ── Rate Limiting y Tracking de fallos ──
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutos
    max: 20,                     // máximo 20 intentos por IP
    message: { error: 'Demasiados intentos de login. Intente de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    }
});

const verifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Demasiados intentos de verificación. Intente de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    }
});

const tfaLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiados intentos de verificación 2FA. Intente de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    }
});

// Track de fallos por usuario (en memoria)
const _userFailures = new Map(); // username -> { count, lockedUntil }

function checkUserBlock(username) {
    const userData = _userFailures.get(username);
    if (userData && userData.lockedUntil > Date.now()) {
        const waitSec = Math.ceil((userData.lockedUntil - Date.now()) / 1000);
        return { blocked: true, waitSeconds: waitSec };
    }
    return { blocked: false };
}

function recordFailedAttempt(username) {
    let userData = _userFailures.get(username) || { count: 0, lockedUntil: 0 };
    userData.count++;
    if (userData.count >= 5 && !userData.lockedUntil) {
        userData.lockedUntil = Date.now() + 30 * 1000; // 30 segundos
    }
    if (userData.lockedUntil < Date.now()) {
        userData.count = 1;
        userData.lockedUntil = 0;
    }
    _userFailures.set(username, userData);
}

function clearUserFailure(username) {
    _userFailures.delete(username);
}

// Track de fallos por IP para alertas
const _ipFailures = new Map(); // ip -> { count, lastFailure }

function checkAndAlertIP(ip, username) {
    let ipData = _ipFailures.get(ip) || { count: 0, lastFailure: 0 };
    const now = Date.now();
    
    if (now - ipData.lastFailure < 5 * 60 * 1000) { // 5 minutos
        ipData.count++;
    } else {
        ipData.count = 1;
    }
    ipData.lastFailure = now;
    _ipFailures.set(ip, ipData);
    
    // Alerta si +3 fallos en 5 minutos
    if (ipData.count >= 3) {
        console.warn(`⚠️ ALERTA DE SEGURIDAD: ${ipData.count} intentos fallidos desde IP ${ip} para usuario ${username}`);
    }
}


// ── Proxy /api/ml/* → Python ML Service (FastAPI :8000) ──
const http = require('http');
const crypto = require('crypto');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

app.use('/api/ml', requireAuth, async (req, res) => {
    try {
        const mlUrl = new URL(ML_SERVICE_URL + req.originalUrl);
        const options = {
            hostname: mlUrl.hostname,
            port: mlUrl.port,
            path: mlUrl.pathname + mlUrl.search,
            method: req.method,
            headers: { ...req.headers, host: mlUrl.host },
            timeout: 120000,
        };
        // Remove body-restricted headers for GET/HEAD
        if (['GET', 'HEAD'].includes(req.method)) {
            delete options.headers['content-type'];
            delete options.headers['content-length'];
        }
        const proxyReq = http.request(options, (proxyRes) => {
            res.status(proxyRes.statusCode);
            proxyRes.headers && Object.entries(proxyRes.headers).forEach(([k, v]) => res.setHeader(k, v));
            proxyRes.pipe(res);
        });
        proxyReq.on('error', (err) => {
            console.error('ML proxy error:', err.message);
            res.status(503).json({ ok: false, error: 'ML Service no disponible: ' + err.message });
        });
        proxyReq.on('timeout', () => {
            proxyReq.destroy();
            res.status(504).json({ ok: false, error: 'ML Service timeout' });
        });
        if (req.body && Object.keys(req.body).length) {
            proxyReq.write(JSON.stringify(req.body));
        }
        proxyReq.end();
    } catch (err) {
        console.error('ML proxy error:', err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// ── Inicializar BD al arrancar ────────
const startTime = Date.now();
let server;

(async () => {
    await db.initDatabase();
    await db.createInitialAdmin();

    // '0.0.0.0' es requerido por Render para detectar el puerto
    server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
        console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });

    // ── Graceful shutdown (solo para producción) ──
    const shutdown = (signal) => {
        console.log(`🛑 ${signal} recibido, cerrando servidor...`);
        if (server) {
            server.close(() => {
                console.log('✅ Servidor cerrado correctamente');
                process.exit(0);
            });
            // Forzar cierre después de 10s
            setTimeout(() => process.exit(1), 10000);
        }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Capturar errores no manejados
    process.on('uncaughtException', (err) => {
        console.error('❌ Error no capturado:', err.message);
        process.exit(1);
    });
    
    process.on('unhandledRejection', (reason) => {
        console.error('⚠️ Promesa rechazada:', String(reason));
    });

    // Limpiar blacklist expirada cada hora
    setInterval(() => db.cleanExpiredBlacklist().catch(() => {}), 3600000);

    // Limpiar Maps de tracking de fallos cada 30 minutos para evitar memory leak
    setInterval(() => {
        const now = Date.now();
        const ONE_HOUR = 60 * 60 * 1000;
        for (const [u, d] of _userFailures) {
            if (now - (d.lockedUntil || 0) > ONE_HOUR && (d.count || 0) === 0) {
                _userFailures.delete(u);
            } else if (d.lockedUntil && d.lockedUntil < now && (d.count || 0) > 0) {
                _userFailures.set(u, { count: 0, lockedUntil: 0 });
            }
        }
        for (const [ip, d] of _ipFailures) {
            if (now - (d.lastFailure || 0) > ONE_HOUR) {
                _ipFailures.delete(ip);
            }
        }
    }, 30 * 60 * 1000);
})();

// ── Extraer token crudo ───────────────
function extractRawToken(req) {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) return header.split(' ')[1];
    if (req.cookies?.token) return req.cookies.token;
    return null;
}

// ── Middleware JWT ────────────────────
function requireAuth(req, res, next) {
    const token = extractRawToken(req);
    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    // CSRF: no-GET debe usar Authorization header (no cookie)
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Se requiere autenticación por header para esta operación' });
        }
    }
    
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'sigmaproxvl', audience: 'sigmaproxvl-api' });
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // Verificar si el token fue revocado
    db.isTokenBlacklisted(token).then(revoked => {
        if (revoked) return res.status(401).json({ error: 'Token revocado — inicie sesión nuevamente' });
        req.rawToken = token;
        next();
    }).catch((err) => {
        console.error('❌ Error al verificar blacklist — denegando acceso (fail-closed):', err.message);
        return res.status(503).json({ error: 'Servicio temporalmente no disponible. Intente nuevamente.' });
    });
}

function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Se requieren privilegios de administrador' });
    }
    next();
}

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
}

// ========================================
// RUTAS
// ========================================

// Raíz - información del servicio
app.get('/', (req, res) => {
    res.json({ 
        ok: true, 
        service: 'StatAnalyzer Pro API',
        version: '2.1.0',
        status: 'running',
        endpoints: [
            '/api/health',
            '/api/login', 
            '/api/me',
            '/api/audit',
            '/api/audit/event'
        ]
    });
});

// Health check completo
app.get('/api/health', async (req, res) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const mem = process.memoryUsage();
    
    let dbStatus = 'unknown';
    try {
        await db.run('SELECT 1');
        dbStatus = 'connected';
    } catch {
        dbStatus = 'disconnected';
    }
    
    res.json({
        ok: true,
        service: 'StatAnalyzer Pro API',
        version: '2.1.0',
        timestamp: new Date().toISOString(),
        uptime: `${uptime}s`,
        database: dbStatus,
        memory: {
            rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
            heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
        },
        pid: process.pid,
    });
});

// Métricas del servidor (solo admin)
app.get('/api/metrics', requireAuth, requireAdmin, async (req, res) => {
    const users = await db.getAllUsers();
    const auditLogs = await db.getAuditLog(1);
    
    res.json({
        ok: true,
        metrics: {
            totalUsers: users?.length || 0,
            activeUsers: users?.filter(u => u.active === 1)?.length || 0,
            totalAuditLogs: auditLogs?.length > 0 ? 'available' : 'empty',
            uptime: `${Math.floor((Date.now() - startTime) / 1000)}s`,
            nodeVersion: process.version,
            platform: process.platform,
            memoryUsage: {
                rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
                heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            },
        },
    });
});



// POST /api/login
app.post('/api/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    const ip        = getClientIP(req);
    const userAgent = req.headers['user-agent'];

    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Verificar bloqueo temporal por usuario
    const userBlock = checkUserBlock(username.trim());
    if (userBlock.blocked) {
        return res.status(429).json({ 
            error: `Usuario bloqueado temporalmente. Espere ${userBlock.waitSeconds} segundos.` 
        });
    }

    try {
        const user = await db.getUserByUsername(username.trim());

        if (!user) {
            recordFailedAttempt(username.trim());
            checkAndAlertIP(ip, username.trim());
            await db.logAccess({ username, action: 'LOGIN', success: false, ip, userAgent });
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const passwordOk = bcrypt.compareSync(password, user.password);
        if (!passwordOk) {
            recordFailedAttempt(username.trim());
            checkAndAlertIP(ip, username.trim());
            await db.logAccess({ username, action: 'LOGIN', success: false, ip, userAgent });
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Login exitoso: limpiar bloqueos
        clearUserFailure(username.trim());
        await db.updateLastLogin(username);

        // Verificar si debe cambiar contraseña temporal
        const mustChangePassword = user.password_temp === 1;

        // Verificar 2FA
        const tfaEnabled = await db.has2FAEnabled(user.username);
        if (tfaEnabled) {
            // Generar token temporal (5 min, solo para verificar 2FA)
            const tempToken = jwt.sign(
                { id: user.id, username: user.username, role: user.role, tfaPending: true },
                process.env.JWT_SECRET,
                { expiresIn: '5m', issuer: 'sigmaproxvl', audience: 'sigmaproxvl-api' }
            );
            await db.logAccess({ username, action: 'LOGIN_2FA_REQUIRED', success: true, ip, userAgent });
            return res.json({ ok: true, requires2FA: true, tempToken, username: user.username, role: user.role });
        }

        await db.logAccess({ username, action: 'LOGIN', success: true, ip, userAgent });

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h', issuer: 'sigmaproxvl', audience: 'sigmaproxvl-api' }
        );

        // Enviar token como cookie httpOnly (cross-origen: GitHub Pages → Fly.io)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 8 * 60 * 60 * 1000 // 8 horas
        });

        return res.json({ ok: true, token, username: user.username, role: user.role, mustChangePassword, defaultPassword: mustChangePassword ? DEFAULT_USER_PASSWORD : undefined });

    } catch (err) {
        console.error('Error en login:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/logout
app.post('/api/logout', requireAuth, async (req, res) => {
    await db.logAccess({
        username:  req.user.username,
        action:    'LOGOUT',
        success:   true,
        ip:        getClientIP(req),
        userAgent: req.headers['user-agent'],
    });
    // Revocar el token actual
    if (req.rawToken) {
        await db.blacklistToken(req.rawToken);
    }
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ ok: true });
});

// GET /api/me — restaura sesión desde cookie httpOnly
app.get('/api/me', requireAuth, async (req, res) => {
    const token = jwt.sign(
        { id: req.user.id, username: req.user.username, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h', issuer: 'sigmaproxvl', audience: 'sigmaproxvl-api' }
    );
    try {
        const user = await db.getUserByUsername(req.user.username);
        if (user) {
            const { password_hash, password_temp, ...profile } = user;
            const has2FA = await db.has2FAEnabled(req.user.username);
            return res.json({ ok: true, username: req.user.username, role: req.user.role, token, profile, has2FA });
        }
    } catch (_) { /* fallback: omitir perfil */ }
    const has2FA = await db.has2FAEnabled(req.user.username).catch(() => false);
    res.json({ ok: true, username: req.user.username, role: req.user.role, token, has2FA });
});

// GET /api/ml-api-key — devuelve la ML API Key para que el frontend la pase al ML Service
app.get('/api/ml-api-key', requireAuth, (req, res) => {
    const key = process.env.ML_API_KEY || '';
    res.json({ ok: true, key });
});

// ── 2FA (TOTP) Endpoints ──────────────────────────
// POST /api/2fa/setup — genera secreto TOTP + QR (usuario autenticado)
app.post('/api/2fa/setup', requireAuth, async (req, res) => {
    try {
        const username = req.user.username;
        // Verificar que no esté ya habilitado
        const already = await db.has2FAEnabled(username);
        if (already) {
            return res.status(400).json({ error: '2FA ya está habilitado. Desactívalo primero para regenerar.' });
        }
        const secret = authenticator.generateSecret();
        await db.save2FASecret(username, secret);
        const otpauth = authenticator.keyuri(username, 'StatAnalyzer Pro', secret);
        const qrDataUrl = await QRCode.toDataURL(otpauth);
        await db.logAuditEvent({
            username, action: '2FA_SETUP', success: 1,
            ip: getClientIP(req), userAgent: req.headers['user-agent'],
            module: 'AUTH', details: null
        });
        res.json({ ok: true, secret, qr: qrDataUrl });
    } catch (err) {
        console.error('Error 2FA setup:', err);
        res.status(500).json({ error: 'Error al generar código 2FA' });
    }
});

// POST /api/2fa/enable — activa 2FA tras verificar código
app.post('/api/2fa/enable', requireAuth, async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Código TOTP requerido' });
        const username = req.user.username;
        const secret = await db.get2FASecret(username);
        if (!secret) return res.status(400).json({ error: 'No hay secreto 2FA pendiente. Ejecuta /api/2fa/setup primero.' });
        const isValid = authenticator.verify({ token, secret });
        if (!isValid) return res.status(401).json({ error: 'Código TOTP inválido' });
        await db.enable2FA(username);
        await db.logAuditEvent({
            username, action: '2FA_ENABLED', success: 1,
            ip: getClientIP(req), userAgent: req.headers['user-agent'],
            module: 'AUTH', details: null
        });
        res.json({ ok: true, message: '2FA activado correctamente' });
    } catch (err) {
        console.error('Error 2FA enable:', err);
        res.status(500).json({ error: 'Error al activar 2FA' });
    }
});

// POST /api/2fa/disable — desactiva 2FA (requiere contraseña actual + admin)
app.post('/api/2fa/disable', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username?.trim() || !password?.trim()) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }
        // Verificar contraseña del admin que ejecuta
        const adminUser = await db.getUserByUsername(req.user.username);
        if (!adminUser || !bcrypt.compareSync(password, adminUser.password)) {
            return res.status(401).json({ error: 'Contraseña de administrador incorrecta' });
        }
        await db.disable2FA(username.trim());
        await db.logAuditEvent({
            username: req.user.username, action: `2FA_DISABLED:${username.trim()}`, success: 1,
            ip: getClientIP(req), userAgent: req.headers['user-agent'],
            module: 'AUTH', details: { targetUser: username.trim() }
        });
        res.json({ ok: true, message: '2FA desactivado para ' + username.trim() });
    } catch (err) {
        console.error('Error 2FA disable:', err);
        res.status(500).json({ error: 'Error al desactivar 2FA' });
    }
});

// ── Admin 2FA management for any user ────────────
// GET /api/users/:id/2fa — obtener estado 2FA de un usuario
app.get('/api/users/:id/2fa', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.getUserById(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const enabled = await db.has2FAEnabled(user.username);
        res.json({ ok: true, username: user.username, enabled });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/users/:id/2fa/setup — admin genera secreto TOTP + QR para un usuario
app.post('/api/users/:id/2fa/setup', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.getUserById(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const already = await db.has2FAEnabled(user.username);
        if (already) {
            return res.status(400).json({ error: '2FA ya está habilitado para este usuario' });
        }
        const secret = authenticator.generateSecret();
        await db.save2FASecret(user.username, secret);
        const otpauth = authenticator.keyuri(user.username, 'StatAnalyzer Pro', secret);
        const qrDataUrl = await QRCode.toDataURL(otpauth);
        await db.logAuditEvent({
            username: req.user.username, action: `2FA_SETUP:${user.username}`, success: 1,
            ip: getClientIP(req), userAgent: req.headers['user-agent'],
            module: 'AUTH', details: { targetUser: user.username }
        });
        res.json({ ok: true, username: user.username, secret, qr: qrDataUrl });
    } catch (err) {
        console.error('Error admin 2FA setup:', err);
        res.status(500).json({ error: 'Error al generar código 2FA' });
    }
});

// POST /api/users/:id/2fa/enable — admin activa 2FA para un usuario
app.post('/api/users/:id/2fa/enable', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Código TOTP requerido' });
        const user = await db.getUserById(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const secret = await db.get2FASecret(user.username);
        if (!secret) return res.status(400).json({ error: 'No hay secreto 2FA pendiente. Ejecuta setup primero.' });
        const isValid = authenticator.verify({ token, secret });
        if (!isValid) return res.status(401).json({ error: 'Código TOTP inválido' });
        await db.enable2FA(user.username);
        await db.logAuditEvent({
            username: req.user.username, action: `2FA_ENABLED:${user.username}`, success: 1,
            ip: getClientIP(req), userAgent: req.headers['user-agent'],
            module: 'AUTH', details: { targetUser: user.username }
        });
        res.json({ ok: true, message: `2FA activado para ${user.username}` });
    } catch (err) {
        console.error('Error admin 2FA enable:', err);
        res.status(500).json({ error: 'Error al activar 2FA' });
    }
});

// POST /api/users/:id/2fa/disable — admin desactiva 2FA para un usuario
app.post('/api/users/:id/2fa/disable', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.getUserById(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        await db.disable2FA(user.username);
        await db.logAuditEvent({
            username: req.user.username, action: `2FA_DISABLED:${user.username}`, success: 1,
            ip: getClientIP(req), userAgent: req.headers['user-agent'],
            module: 'AUTH', details: { targetUser: user.username }
        });
        res.json({ ok: true, message: `2FA desactivado para ${user.username}` });
    } catch (err) {
        console.error('Error admin 2FA disable:', err);
        res.status(500).json({ error: 'Error al desactivar 2FA' });
    }
});

// POST /api/2fa/verify-login — segundo paso: verificar TOTP con tempToken
app.post('/api/2fa/verify-login', tfaLimiter, async (req, res) => {
    try {
        const { tempToken, token } = req.body;
        if (!tempToken || !token) {
            return res.status(400).json({ error: 'tempToken y código TOTP requeridos' });
        }
        let payload;
        try {
            payload = jwt.verify(tempToken, process.env.JWT_SECRET, { issuer: 'sigmaproxvl', audience: 'sigmaproxvl-api' });
        } catch {
            return res.status(401).json({ error: 'Token temporal inválido o expirado. Inicie sesión nuevamente.' });
        }
        if (!payload.tfaPending) {
            return res.status(401).json({ error: 'Token no es de verificación 2FA' });
        }
        const secret = await db.get2FASecret(payload.username);
        if (!secret) return res.status(400).json({ error: '2FA no configurado para este usuario' });
        const isValid = authenticator.verify({ token, secret });
        if (!isValid) {
            await db.logAuditEvent({
                username: payload.username, action: '2FA_VERIFY_FAILED', success: 0,
                ip: getClientIP(req), userAgent: req.headers['user-agent'],
                module: 'AUTH', details: null
            });
            return res.status(401).json({ error: 'Código TOTP inválido' });
        }
        // Generar token real
        const realToken = jwt.sign(
            { id: payload.id, username: payload.username, role: payload.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h', issuer: 'sigmaproxvl', audience: 'sigmaproxvl-api' }
        );
        res.cookie('token', realToken, {
            httpOnly: true, secure: true, sameSite: 'none',
            maxAge: 8 * 60 * 60 * 1000
        });
        await db.logAccess({ username: payload.username, action: 'LOGIN', success: true, ip: getClientIP(req), userAgent: req.headers['user-agent'] });
        res.json({ ok: true, token: realToken, username: payload.username, role: payload.role });
    } catch (err) {
        console.error('Error 2FA verify-login:', err);
        res.status(500).json({ error: 'Error al verificar 2FA' });
    }
});

// GET /api/2fa/status — consulta si el usuario tiene 2FA habilitado
app.get('/api/2fa/status', requireAuth, async (req, res) => {
    try {
        const enabled = await db.has2FAEnabled(req.user.username);
        res.json({ ok: true, enabled });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── WORM - Data Snapshots ──────────────────────────
// POST /api/snapshots — guarda un snapshot de datos (inmutable)
app.post('/api/snapshots', requireAuth, async (req, res) => {
    try {
        const { sheetId, dataHash, snapshotJson, sourceFile, rowCount, colCount, checksum } = req.body;
        if (!dataHash || !snapshotJson) {
            return res.status(400).json({ error: 'dataHash y snapshotJson son requeridos' });
        }
        const result = await db.createSnapshot({
            username: req.user.username, sheetId: sheetId || null,
            dataHash, snapshotJson: JSON.stringify(snapshotJson),
            sourceFile: sourceFile || null, rowCount: rowCount || null,
            colCount: colCount || null, checksum: checksum || null,
            ip: getClientIP(req), userAgent: req.headers['user-agent'],
        });
        res.json({ ok: true, id: result.id });
    } catch (err) {
        console.error('Error creating snapshot:', err);
        res.status(500).json({ error: 'Error al guardar snapshot' });
    }
});

// GET /api/snapshots — lista snapshots del usuario o todos (admin)
app.get('/api/snapshots', requireAuth, async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const username = isAdmin && req.query.username ? req.query.username : (isAdmin ? null : req.user.username);
        const snapshots = await db.getSnapshots(username, parseInt(req.query.limit) || 20);
        res.json({ ok: true, snapshots });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/snapshots/:id — obtiene snapshot por ID
app.get('/api/snapshots/:id', requireAuth, async (req, res) => {
    try {
        const snapshot = await db.getSnapshotById(parseInt(req.params.id));
        if (!snapshot) return res.status(404).json({ error: 'Snapshot no encontrado' });
        // Solo admin o propietario pueden leer
        if (req.user.role !== 'admin' && snapshot.username !== req.user.username) {
            return res.status(403).json({ error: 'No autorizado' });
        }
        res.json({ ok: true, snapshot });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users (solo admin)
app.get('/api/users', requireAuth, requireAdmin, async (req, res) => {
    const users = await db.getAllUsers();
    res.json({ ok: true, users });
});

// POST /api/verify-signature — validar código de firma + contraseña
// No requiere autenticación previa; el código de firma es la credencial
app.post('/api/verify-signature', verifyLimiter, async (req, res) => {
    const { signatureCode, password } = req.body;
    if (!signatureCode?.trim() || !password?.trim()) {
        return res.status(400).json({ error: 'Código de firma y contraseña son requeridos' });
    }
    try {
        const user = await db.getUserBySignatureCode(signatureCode.trim());
        if (!user) {
            return res.status(404).json({ error: 'Código de firma no registrado' });
        }
        const passwordOk = bcrypt.compareSync(password, user.password);
        if (!passwordOk) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
        await db.logAccess({
            username:  user.username,
            action:    'VERIFY_SIGNATURE',
            success:   true,
            ip:        getClientIP(req),
            userAgent: req.headers['user-agent'],
        });
        const nombreCompleto = [user.nombre, user.apellido].filter(Boolean).join(' ') || user.username;
        return res.json({
            ok: true,
            nombre: nombreCompleto,
            cargo: user.cargo || '',
            username: user.username,
        });
    } catch (err) {
        console.error('Error en verify-signature:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/users (solo admin)
app.post('/api/users', requireAuth, requireAdmin, async (req, res) => {
    const { username, password, role = 'user', nombre, apellido, email, telefono, signatureCode, cargo } = req.body;

    if (!username?.trim()) {
        return res.status(400).json({ error: 'Usuario es requerido' });
    }
    if (username.trim().length > 50) {
        return res.status(400).json({ error: 'El usuario no puede exceder 50 caracteres' });
    }
    if (!['admin', 'user', 'readonly', 'supervisor', 'analista', 'gerente', 'coordinador'].includes(role)) {
        return res.status(400).json({ error: 'Rol inválido' });
    }
    var useDefault = !password?.trim();
    var pw = useDefault ? DEFAULT_USER_PASSWORD : password.trim();
    if (!useDefault) {
        var pwErr = validatePasswordStrength(pw);
        if (pwErr) return res.status(400).json({ error: pwErr });
    }
    if (nombre && nombre.length > 100) {
        return res.status(400).json({ error: 'El nombre no puede exceder 100 caracteres' });
    }
    if (apellido && apellido.length > 100) {
        return res.status(400).json({ error: 'El apellido no puede exceder 100 caracteres' });
    }
    if (email && email.length > 200) {
        return res.status(400).json({ error: 'El email no puede exceder 200 caracteres' });
    }

    var sigCode = signatureCode?.trim();
    if (!sigCode) {
        var prefix = username.trim().slice(0, 3).toLowerCase();
        sigCode = prefix + Math.floor(100 + Math.random() * 900);
    }

    const result = await db.createUser({
        username: username.trim(), password: pw, role,
        nombre: nombre?.trim(),
        apellido: apellido?.trim(),
        email: email?.trim() || username.trim(),
        telefono: telefono?.trim(),
        signatureCode: sigCode,
        cargo: cargo?.trim(),
        createdBy: req.user.username,
        passwordTemp: 1,
    });

    if (!result.ok) return res.status(400).json({ error: result.error });

    await db.logAccess({
        username: req.user.username, action: `CREATE_USER:${username}`,
        success: true, ip: getClientIP(req), userAgent: req.headers['user-agent'],
    });

    res.json({ ok: true, id: result.id, defaultPassword: useDefault ? DEFAULT_USER_PASSWORD : undefined, signatureCode: sigCode });
});

// PUT /api/users/:id/toggle (solo admin)
app.put('/api/users/:id/toggle', requireAuth, requireAdmin, async (req, res) => {
    await db.toggleUserActive(req.params.id, req.body.active ? 1 : 0);
    res.json({ ok: true });
});

// PUT /api/users/password
app.put('/api/users/password', requireAuth, async (req, res) => {
    const { currentPassword, newPassword, signatureCode } = req.body;
    var pwErr = validatePasswordStrength(newPassword);
    if (pwErr) {
        return res.status(400).json({ error: pwErr });
    }
    const user = await db.getUserByUsername(req.user.username);
    
    // Si tiene contraseña temporal, no requiere contraseña actual
    const isTempPassword = user.password_temp === 1;
    if (!isTempPassword) {
        if (!currentPassword) {
            return res.status(400).json({ error: 'Debe proporcionar la contraseña actual' });
        }
        if (!bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }
    }
    
    await db.changePassword(req.user.username, newPassword);
    
    // Guardar código de firma si se proporcionó
    if (signatureCode && signatureCode.trim()) {
        await db.updateUserProfile(req.user.username, { signatureCode: signatureCode.trim() });
    }
    
    res.json({ ok: true, signatureCode: signatureCode ? signatureCode.trim() : undefined });
});

// PUT /api/users/profile (usuario actual)
app.put('/api/users/profile', requireAuth, async (req, res) => {
    const { nombre, apellido, email, telefono, cargo, signatureCode } = req.body;
    if (nombre && nombre.length > 100) return res.status(400).json({ error: 'El nombre no puede exceder 100 caracteres' });
    if (apellido && apellido.length > 100) return res.status(400).json({ error: 'El apellido no puede exceder 100 caracteres' });
    if (email && email.length > 200) return res.status(400).json({ error: 'El email no puede exceder 200 caracteres' });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email inválido' });
    if (signatureCode && signatureCode.length > 50) return res.status(400).json({ error: 'El código de firma no puede exceder 50 caracteres' });
    await db.updateUserProfile(req.user.username, { nombre, apellido, email, telefono, cargo, signatureCode });
    res.json({ ok: true });
});

// PUT /api/users/:id/profile (admin puede editar cualquier usuario)
app.put('/api/users/:id/profile', requireAuth, requireAdmin, async (req, res) => {
    const { nombre, apellido, email, telefono, cargo, signatureCode, role } = req.body;
    await db.updateUserProfileById(req.params.id, { nombre, apellido, email, telefono, cargo, signatureCode });
    if (role) {
        await db.changeRole(req.params.id, role);
    }
    res.json({ ok: true });
});

// PUT /api/users/:id/role (solo admin)
app.put('/api/users/:id/role', requireAuth, requireAdmin, async (req, res) => {
    const { role } = req.body;
    if (!['admin', 'user', 'readonly', 'supervisor', 'analista', 'gerente', 'coordinador'].includes(role)) {
        return res.status(400).json({ error: 'Rol inválido' });
    }
    await db.changeRole(req.params.id, role);
    res.json({ ok: true });
});

// PUT /api/users/reset-password (solo admin — resetea contraseña de otro usuario)
app.put('/api/users/reset-password', requireAuth, requireAdmin, async (req, res) => {
    const { username, newPassword } = req.body;
    if (!username?.trim()) {
        return res.status(400).json({ error: 'Usuario requerido' });
    }
    var pwErr = validatePasswordStrength(newPassword);
    if (pwErr) {
        return res.status(400).json({ error: pwErr });
    }
    const user = await db.getUserByUsername(username);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await db.changePassword(username, newPassword);

    // Siempre marcar como temporal cuando admin resetea
    await db.setPasswordTemp(username, true);

    await db.logAccess({
        username:  req.user.username,
        action:    `RESET_PASSWORD:${username}`,
        success:   true,
        ip:        getClientIP(req),
        userAgent: req.headers['user-agent'],
    });

    res.json({ ok: true });
});

// GET /api/audit (solo admin)
app.get('/api/audit', requireAuth, requireAdmin, async (req, res) => {
    const logs = await db.getAuditLog(parseInt(req.query.limit) || 100);
    res.json({ ok: true, logs });
});

// GET /api/audit/verify - verifica la cadena de hash blockchain (solo admin)
app.get('/api/audit/verify', requireAuth, requireAdmin, async (req, res) => {
    try {
        const result = await db.verifyAuditChain();
        res.json({ ok: true, ...result });
    } catch (err) {
        console.error('Error verifying audit chain:', err);
        res.status(500).json({ error: 'Error al verificar cadena de auditoría' });
    }
});

// POST /api/audit/event - registra eventos del frontend (usuario autenticado)
app.post('/api/audit/event', requireAuth, async (req, res) => {
    const { action, module, details, durationMs } = req.body;
    if (!action) {
        return res.status(400).json({ error: 'action es requerido' });
    }
    
    await db.logAuditEvent({
        username: req.user.username,
        action,
        success: 1,
        ip: getClientIP(req),
        userAgent: req.headers['user-agent'],
        module: module || null,
        details: details || null,
        durationMs: durationMs || null,
    });

    res.json({ ok: true });
});

// ── Device Checks (§ 11.10(h)) ─────────────
// POST /api/devices/register - registrar/actualizar dispositivo actual
app.post('/api/devices/register', requireAuth, async (req, res) => {
    const { fingerprint, device_name, browser, os, screen_res, timezone } = req.body;
    if (!fingerprint) return res.status(400).json({ error: 'fingerprint requerido' });

    await db.registerDevice(req.user.username, fingerprint, {
        device_name, browser, os, screen_res, timezone
    });

    const trusted = await db.isDeviceTrusted(req.user.username, fingerprint);
    res.json({ ok: true, trusted });
});

// GET /api/devices - listar todos los dispositivos (admin) o del usuario
app.get('/api/devices', requireAuth, async (req, res) => {
    const isAdmin = req.user.role === 'admin';
    try {
        const devices = isAdmin ? await db.getAllDevices() : await db.getUserDevices(req.user.username);
        res.json({ ok: true, devices });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/devices/:id/trust - toggle trust (admin only)
app.put('/api/devices/:id/trust', requireAuth, requireAdmin, async (req, res) => {
    const trusted = req.body.trusted === 1 || req.body.trusted === true ? 1 : 0;
    await db.setDeviceTrust(req.params.id, trusted);
    await db.logAuditEvent({
        username: req.user.username, action: 'DEVICE_TRUST:' + (trusted ? 'ON' : 'OFF'),
        success: 1, ip: getClientIP(req), userAgent: req.headers['user-agent'],
        module: 'SYSTEM', details: { deviceId: req.params.id, trusted },
    });
    res.json({ ok: true });
});

// DELETE /api/devices/:id - eliminar dispositivo (admin only)
app.delete('/api/devices/:id', requireAuth, requireAdmin, async (req, res) => {
    await db.removeDevice(req.params.id);
    await db.logAuditEvent({
        username: req.user.username, action: 'DEVICE_DELETE',
        success: 1, ip: getClientIP(req), userAgent: req.headers['user-agent'],
        module: 'SYSTEM', details: { deviceId: req.params.id },
    });
    res.json({ ok: true });
});