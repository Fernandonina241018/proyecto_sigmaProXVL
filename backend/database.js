// ========================================
// database.js — StatAnalyzer Pro Backend
// SQLite con el paquete 'sqlite3'
// (sin compilación nativa — funciona en Windows sin Build Tools)
// ========================================

const sqlite3 = require('sqlite3').verbose();
const bcrypt  = require('bcryptjs');
const path    = require('path');

const DB_PATH = path.join(__dirname, 'auth.db');

// Crear conexión (crea el archivo si no existe)
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) console.error('❌ Error abriendo BD:', err.message);
    else     console.log('✅ Conectado a SQLite:', DB_PATH);
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

// ── Promisificar operaciones ──────────
// sqlite3 es async por defecto — envolvemos en promesas
// para poder usar async/await en server.js

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else     resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else     resolve(row);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else     resolve(rows);
        });
    });
}

// ── Crear tablas ──────────────────────
async function initDatabase() {
    await run(`
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
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS audit_log (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            username   TEXT NOT NULL,
            action     TEXT NOT NULL,
            success    INTEGER NOT NULL,
            ip         TEXT,
            user_agent TEXT,
            timestamp  TEXT DEFAULT (datetime('now'))
        )
    `);

    console.log('✅ Tablas verificadas');
}

// ── Crear admin inicial ───────────────
async function createInitialAdmin() {
    const existing = await get(
        'SELECT id FROM users WHERE username = ?',
        [process.env.ADMIN_USERNAME]
    );

    if (existing) return; // ya existe

    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);

    await run(
        `INSERT INTO users (username, password, role, created_by)
         VALUES (?, ?, 'admin', 'system')`,
        [process.env.ADMIN_USERNAME, hash]
    );

    console.log(`✅ Admin inicial creado: ${process.env.ADMIN_USERNAME}`);
}

// ── Operaciones de usuarios ───────────

async function getUserByUsername(username) {
    return get(
        'SELECT * FROM users WHERE username = ? AND active = 1',
        [username]
    );
}

async function createUser({ username, password, role = 'user', createdBy }) {
    const hash = bcrypt.hashSync(password, 12);
    try {
        const result = await run(
            `INSERT INTO users (username, password, role, created_by)
             VALUES (?, ?, ?, ?)`,
            [username, hash, role, createdBy]
        );
        return { ok: true, id: result.lastID };
    } catch (err) {
        if (err.message.includes('UNIQUE')) {
            return { ok: false, error: 'El usuario ya existe' };
        }
        return { ok: false, error: err.message };
    }
}

async function updateLastLogin(username) {
    await run(
        `UPDATE users
         SET last_login  = datetime('now'),
             login_count = login_count + 1
         WHERE username = ?`,
        [username]
    );
}

async function getAllUsers() {
    return all(
        'SELECT id, username, role, active, created_at, last_login, login_count FROM users'
    );
}

async function toggleUserActive(id, active) {
    await run('UPDATE users SET active = ? WHERE id = ?', [active, id]);
}

async function changePassword(username, newPassword) {
    const hash = bcrypt.hashSync(newPassword, 12);
    await run('UPDATE users SET password = ? WHERE username = ?', [hash, username]);
}

async function changeRole(id, role) {
    await run('UPDATE users SET role = ? WHERE id = ?', [role, id]);
}

// ── Auditoría ─────────────────────────

async function logAccess({ username, action, success, ip, userAgent }) {
    await run(
        `INSERT INTO audit_log (username, action, success, ip, user_agent)
         VALUES (?, ?, ?, ?, ?)`,
        [username, action, success ? 1 : 0, ip, userAgent]
    );
}

async function getAuditLog(limit = 100) {
    return all(
        'SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?',
        [limit]
    );
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
    changeRole,
    logAccess,
    getAuditLog,
    run,
};