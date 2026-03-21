// ========================================
// database.js — StatAnalyzer Pro Backend
// Manejo de SQLite con better-sqlite3
// ========================================

const Database = require('better-sqlite3');
const bcrypt   = require('bcryptjs');
const path     = require('path');

// La BD se crea automáticamente si no existe
const db = new Database(path.join(__dirname, 'auth.db'));

// ── Crear tablas ──────────────────────
function initDatabase() {
    // Tabla de usuarios
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            username     TEXT    UNIQUE NOT NULL,
            password     TEXT    NOT NULL,
            role         TEXT    NOT NULL DEFAULT 'user',
            active       INTEGER NOT NULL DEFAULT 1,
            created_by   TEXT,
            created_at   TEXT    DEFAULT (datetime('now')),
            last_login   TEXT,
            login_count  INTEGER DEFAULT 0
        );
    `);

    // Tabla de auditoría de accesos (FDA 21 CFR Part 11)
    db.exec(`
        CREATE TABLE IF NOT EXISTS audit_log (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            username   TEXT NOT NULL,
            action     TEXT NOT NULL,
            success    INTEGER NOT NULL,
            ip         TEXT,
            user_agent TEXT,
            timestamp  TEXT DEFAULT (datetime('now'))
        );
    `);

    console.log('✅ Base de datos inicializada');
}

// ── Crear usuario admin inicial ───────
function createInitialAdmin() {
    const existing = db.prepare(
        'SELECT id FROM users WHERE username = ?'
    ).get(process.env.ADMIN_USERNAME);

    if (existing) return; // ya existe

    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);

    db.prepare(`
        INSERT INTO users (username, password, role, created_by)
        VALUES (?, ?, 'admin', 'system')
    `).run(process.env.ADMIN_USERNAME, hash);

    console.log(`✅ Admin inicial creado: ${process.env.ADMIN_USERNAME}`);
}

// ── Operaciones de usuarios ───────────

function getUserByUsername(username) {
    return db.prepare(
        'SELECT * FROM users WHERE username = ? AND active = 1'
    ).get(username);
}

function createUser({ username, password, role = 'user', createdBy }) {
    const hash = bcrypt.hashSync(password, 12);
    try {
        const result = db.prepare(`
            INSERT INTO users (username, password, role, created_by)
            VALUES (?, ?, ?, ?)
        `).run(username, hash, role, createdBy);
        return { ok: true, id: result.lastInsertRowid };
    } catch (err) {
        if (err.message.includes('UNIQUE')) {
            return { ok: false, error: 'El usuario ya existe' };
        }
        return { ok: false, error: err.message };
    }
}

function updateLastLogin(username) {
    db.prepare(`
        UPDATE users
        SET last_login = datetime('now'),
            login_count = login_count + 1
        WHERE username = ?
    `).run(username);
}

function getAllUsers() {
    return db.prepare(
        'SELECT id, username, role, active, created_at, last_login, login_count FROM users'
    ).all();
}

function toggleUserActive(id, active) {
    db.prepare('UPDATE users SET active = ? WHERE id = ?').run(active, id);
}

function changePassword(username, newPassword) {
    const hash = bcrypt.hashSync(newPassword, 12);
    db.prepare('UPDATE users SET password = ? WHERE username = ?').run(hash, username);
}

// ── Auditoría ─────────────────────────

function logAccess({ username, action, success, ip, userAgent }) {
    db.prepare(`
        INSERT INTO audit_log (username, action, success, ip, user_agent)
        VALUES (?, ?, ?, ?, ?)
    `).run(username, action, success ? 1 : 0, ip, userAgent);
}

function getAuditLog(limit = 100) {
    return db.prepare(
        'SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?'
    ).all(limit);
}

module.exports = {
    initDatabase,
    createInitialAdmin,
    getUserByUsername,
    createUser,
    updateLastLogin,
    getAllUsers,
    toggleUserActive,
    changePassword,
    logAccess,
    getAuditLog,
};