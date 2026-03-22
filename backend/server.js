// ========================================
// server.js — StatAnalyzer Pro Backend
// Express + SQLite (sqlite3) + JWT
// ========================================

require('dotenv').config();

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
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

    if (origin && allowed.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
        // peticiones sin origen (curl, Postman, etc.)
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    next();
});

app.use(express.json());

// ── Inicializar BD al arrancar ────────
(async () => {
    await db.initDatabase();
    await db.createInitialAdmin();

    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
})();

// ── Middleware JWT ────────────────────
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    try {
        req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ ok: true, service: 'StatAnalyzer Pro API', time: new Date().toISOString() });
});

// ⚠️ TEMPORAL — resetear contraseña del admin
// Borrar este bloque después de usarlo
app.get('/api/reset-admin', async (req, res) => {
    try {
        await db.changePassword(
            process.env.ADMIN_USERNAME,
            process.env.ADMIN_PASSWORD
        );
        res.json({ ok: true, msg: `Contraseña de "${process.env.ADMIN_USERNAME}" actualizada correctamente` });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const ip        = getClientIP(req);
    const userAgent = req.headers['user-agent'];

    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    try {
        const user = await db.getUserByUsername(username.trim());

        if (!user) {
            await db.logAccess({ username, action: 'LOGIN', success: false, ip, userAgent });
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const passwordOk = bcrypt.compareSync(password, user.password);
        if (!passwordOk) {
            await db.logAccess({ username, action: 'LOGIN', success: false, ip, userAgent });
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        await db.updateLastLogin(username);
        await db.logAccess({ username, action: 'LOGIN', success: true, ip, userAgent });

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

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

    const result = await db.createUser({
        username: username.trim(), password, role,
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

// GET /api/audit (solo admin)
app.get('/api/audit', requireAuth, requireAdmin, async (req, res) => {
    const logs = await db.getAuditLog(parseInt(req.query.limit) || 100);
    res.json({ ok: true, logs });
});