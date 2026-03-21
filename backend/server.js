// ========================================
// server.js — StatAnalyzer Pro Backend
// Express + SQLite + JWT
// ========================================

require('dotenv').config();

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const cors    = require('cors');
const db      = require('./database');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ───────────────────────
app.use(express.json());

// CORS: permite solo tu dominio de GitHub Pages
// Cambia la URL por la tuya cuando la tengas
app.use(cors({
    origin: [
        'https://TU_USUARIO.github.io',   // ← cambia esto
        'http://127.0.0.1:5500',           // Live Server local
        'http://localhost:5500',
        'http://localhost:3000',
    ],
    methods:     ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// ── Inicializar BD ────────────────────
db.initDatabase();
db.createInitialAdmin();

// ── Middleware de autenticación JWT ───
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    try {
        const token   = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user      = decoded;
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

// ── Utilidades ────────────────────────
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
}

// ========================================
// RUTAS DE AUTENTICACIÓN
// ========================================

// POST /api/login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const ip        = getClientIP(req);
    const userAgent = req.headers['user-agent'];

    // Validaciones básicas
    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const user = db.getUserByUsername(username.trim());

    // Usuario no existe o inactivo
    if (!user) {
        db.logAccess({ username, action: 'LOGIN', success: false, ip, userAgent });
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Contraseña incorrecta
    const passwordOk = bcrypt.compareSync(password, user.password);
    if (!passwordOk) {
        db.logAccess({ username, action: 'LOGIN', success: false, ip, userAgent });
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Login exitoso
    db.updateLastLogin(username);
    db.logAccess({ username, action: 'LOGIN', success: true, ip, userAgent });

    // Crear JWT
    const token = jwt.sign(
        {
            id:       user.id,
            username: user.username,
            role:     user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.json({
        ok:       true,
        token,
        username: user.username,
        role:     user.role,
    });
});

// POST /api/logout (registra en auditoría)
app.post('/api/logout', requireAuth, (req, res) => {
    db.logAccess({
        username:  req.user.username,
        action:    'LOGOUT',
        success:   true,
        ip:        getClientIP(req),
        userAgent: req.headers['user-agent'],
    });
    res.json({ ok: true });
});

// GET /api/me — verifica token y devuelve datos del usuario
app.get('/api/me', requireAuth, (req, res) => {
    res.json({
        ok:       true,
        username: req.user.username,
        role:     req.user.role,
    });
});

// ========================================
// RUTAS DE GESTIÓN DE USUARIOS (solo admin)
// ========================================

// GET /api/users — listar todos los usuarios
app.get('/api/users', requireAuth, requireAdmin, (req, res) => {
    const users = db.getAllUsers();
    res.json({ ok: true, users });
});

// POST /api/users — crear nuevo usuario
app.post('/api/users', requireAuth, requireAdmin, (req, res) => {
    const { username, password, role = 'user' } = req.body;

    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    if (!['admin', 'user', 'readonly'].includes(role)) {
        return res.status(400).json({ error: 'Rol inválido' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const result = db.createUser({
        username: username.trim(),
        password,
        role,
        createdBy: req.user.username,
    });

    if (!result.ok) {
        return res.status(400).json({ error: result.error });
    }

    db.logAccess({
        username:  req.user.username,
        action:    `CREATE_USER:${username}`,
        success:   true,
        ip:        getClientIP(req),
        userAgent: req.headers['user-agent'],
    });

    res.json({ ok: true, id: result.id });
});

// PUT /api/users/:id/toggle — activar/desactivar usuario
app.put('/api/users/:id/toggle', requireAuth, requireAdmin, (req, res) => {
    const { active } = req.body;
    db.toggleUserActive(req.params.id, active ? 1 : 0);
    res.json({ ok: true });
});

// PUT /api/users/password — cambiar contraseña (propio usuario)
app.put('/api/users/password', requireAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }

    const user = db.getUserByUsername(req.user.username);
    if (!bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    db.changePassword(req.user.username, newPassword);
    res.json({ ok: true });
});

// ========================================
// AUDITORÍA (solo admin)
// ========================================

// GET /api/audit — ver log de accesos
app.get('/api/audit', requireAuth, requireAdmin, (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const logs  = db.getAuditLog(limit);
    res.json({ ok: true, logs });
});

// ── Ruta de health check ──────────────
app.get('/api/health', (req, res) => {
    res.json({ ok: true, service: 'StatAnalyzer Pro API', time: new Date().toISOString() });
});

// ── Arrancar servidor ─────────────────
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});