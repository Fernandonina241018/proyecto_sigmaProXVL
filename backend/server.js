// ========================================
// server.js — StatAnalyzer Pro Backend
// Express + SQLite (sqlite3) + JWT
// ========================================

require('dotenv').config();

// ── Validación de variables de entorno críticas ──
if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET no está definido en el archivo .env');
    console.error('Por favor, agrega JWT_SECRET=tu-clave-secreta-aqui al archivo .env');
    console.error('Genera una clave: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    process.exit(1);
}

if (process.env.JWT_SECRET.length < 26) {
    console.error('ERROR: JWT_SECRET debe tener al menos 26 caracteres');
    console.error(`Actual: ${process.env.JWT_SECRET.length} caracteres`);
    console.error('Genera una clave: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    process.exit(1);
}

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
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

app.use(express.json());
app.use(cookieParser());

// ── Request Logging (sin dependencias nuevas) ──
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `${req.method} ${res.statusCode} ${req.path} - ${duration}ms`;
        if (res.statusCode >= 400) {
            console.warn(`⚠️ ${log}`);
        } else if (req.path.startsWith('/api/')) {
            console.log(`📋 ${log}`);
        }
    });
    next();
});

// ── Rate Limiting y Tracking de fallos ──
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutos
    max: 5,                     // máximo 5 intentos por IP
    message: { error: 'Demasiados intentos de login. Intente de nuevo en 15 minutos.' },
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
    if (userData.count >= 3 && !userData.lockedUntil) {
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
})();

// ── Middleware JWT ────────────────────
function requireAuth(req, res, next) {
    let token = null;
    
    // 1. Intentar leer del header Authorization
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
        token = header.split(' ')[1];
    }
    
    // 2. Fallback: leer de cookie httpOnly
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }
    
    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
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
        await db.logAccess({ username, action: 'LOGIN', success: true, ip, userAgent });

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        // Enviar token como cookie httpOnly
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000 // 8 horas
        });

        return res.json({ ok: true, token, username: user.username, role: user.role });

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
    res.clearCookie('token');
    res.json({ ok: true });
});

// GET /api/me
app.get('/api/me', requireAuth, (req, res) => {
    res.json({ ok: true, username: req.user.username, role: req.user.role });
});

// GET /api/users (solo admin)
app.get('/api/users', requireAuth, requireAdmin, async (req, res) => {
    const users = await db.getAllUsers();
    res.json({ ok: true, users });
});

// POST /api/users (solo admin)
app.post('/api/users', requireAuth, requireAdmin, async (req, res) => {
    const { username, password, role = 'user', nombre, apellido, email, telefono } = req.body;

    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }
    if (!['admin', 'user', 'readonly', 'supervisor', 'analista', 'gerente', 'coordinador'].includes(role)) {
        return res.status(400).json({ error: 'Rol inválido' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const result = await db.createUser({
        username: username.trim(), password, role,
        nombre: nombre?.trim(),
        apellido: apellido?.trim(),
        email: email?.trim() || username.trim(),
        telefono: telefono?.trim(),
        createdBy: req.user.username,
    });

    if (!result.ok) return res.status(400).json({ error: result.error });

    await db.logAccess({
        username: req.user.username, action: `CREATE_USER:${username}`,
        success: true, ip: getClientIP(req), userAgent: req.headers['user-agent'],
    });

    res.json({ ok: true, id: result.id });
});

// PUT /api/users/:id/toggle (solo admin)
app.put('/api/users/:id/toggle', requireAuth, requireAdmin, async (req, res) => {
    await db.toggleUserActive(req.params.id, req.body.active ? 1 : 0);
    res.json({ ok: true });
});

// PUT /api/users/password
app.put('/api/users/password', requireAuth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }
    const user = await db.getUserByUsername(req.user.username);
    if (!bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }
    await db.changePassword(req.user.username, newPassword);
    res.json({ ok: true });
});

// PUT /api/users/profile (usuario actual)
app.put('/api/users/profile', requireAuth, async (req, res) => {
    const { nombre, apellido, email, telefono } = req.body;
    await db.updateUserProfile(req.user.username, { nombre, apellido, email, telefono });
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
    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }
    const user = await db.getUserByUsername(username);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await db.changePassword(username, newPassword);

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