// ========================================
// database.js — StatAnalyzer Pro Backend
// PostgreSQL con Supabase
// ========================================

const { Pool } = require('pg');
const bcrypt   = require('bcryptjs');

// ── Conexión a Supabase ───────────────
// Agrega esta variable en Render → Variables:
// DATABASE_URL = postgresql://postgres:[TU-PASSWORD]@db.qfzrhlajliyqtjesixdh.supabase.co:5432/postgres

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
});

// ── Manejo de errores del pool ───────────────
pool.on('error', (err) => {
    console.error('❌ Error inesperado en cliente inactivo del pool:', err.message);
});

// ── Utilidades de query ───────────────
async function run(sql, params = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(sql, params);
        return {
            rows:     result.rows,
            rowCount: result.rowCount,
            lastID:   result.rows[0]?.id || null,
        };
    } finally {
        client.release();
    }
}

async function get(sql, params = []) {
    const result = await run(sql, params);
    return result.rows[0] || null;
}

async function all(sql, params = []) {
    const result = await run(sql, params);
    return result.rows;
}

// ── Crear tablas ──────────────────────
async function initDatabase() {
    await run(`
        CREATE TABLE IF NOT EXISTS users (
            id           SERIAL PRIMARY KEY,
            username     TEXT    UNIQUE NOT NULL,
            password     TEXT    NOT NULL,
            role         TEXT    NOT NULL DEFAULT 'user',
            active       INTEGER NOT NULL DEFAULT 1,
            created_by   TEXT,
            created_at   TEXT    DEFAULT to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS'),
            last_login   TEXT,
            login_count  INTEGER DEFAULT 0,
            nombre     TEXT,
            apellido   TEXT,
            email      TEXT,
            telefono   TEXT,
            avatar     TEXT,
            updated_at TEXT
        )
    `);

    // Migrar usernames existentes al nuevo campo email
    await run(`
        UPDATE users SET email = username WHERE email IS NULL OR email = ''
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS audit_log (
            id          SERIAL PRIMARY KEY,
            username    TEXT NOT NULL,
            action      TEXT NOT NULL,
            success     INTEGER NOT NULL DEFAULT 1,
            ip          TEXT,
            user_agent  TEXT,
            module     TEXT,
            details    TEXT,
            duration_ms INTEGER,
            timestamp   TEXT DEFAULT to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS')
        )
    `);

    // ── Índices de rendimiento ───────────────
    await run(`CREATE INDEX IF NOT EXISTS idx_users_username ON users (username)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log (timestamp DESC)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_audit_log_username ON audit_log (username)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_audit_log_module ON audit_log (module)`);

    console.log('✅ Tablas verificadas en Supabase');
    console.log('✅ Índices de rendimiento aplicados');
}

// ── Admin inicial ─────────────────────
async function createInitialAdmin() {
    const existing = await get(
        'SELECT id FROM users WHERE username = $1',
        [process.env.ADMIN_USERNAME]
    );

    if (existing) return;

    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);

    await run(
        `INSERT INTO users (username, password, role, created_by)
         VALUES ($1, $2, 'admin', 'system')`,
        [process.env.ADMIN_USERNAME, hash]
    );

    console.log(`✅ Admin inicial creado: ${process.env.ADMIN_USERNAME}`);
}

// ── Usuarios ──────────────────────────

async function getUserByUsername(username) {
    return get(
        'SELECT * FROM users WHERE username = $1 AND active = 1',
        [username]
    );
}

async function createUser({ username, password, role = 'user', nombre, apellido, email, telefono, createdBy }) {
    const hash = bcrypt.hashSync(password, 12);
    try {
        const result = await run(
            `INSERT INTO users (username, password, role, nombre, apellido, email, telefono, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [username, hash, role, nombre || null, apellido || null, email || username, telefono || null, createdBy]
        );
        return { ok: true, id: result.lastID };
    } catch (err) {
        if (err.code === '23505') return { ok: false, error: 'El usuario ya existe' };
        return { ok: false, error: err.message };
    }
}

async function updateLastLogin(username) {
    await run(
        `UPDATE users
         SET last_login  = to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS'),
             login_count = login_count + 1
         WHERE username = $1`,
        [username]
    );
}

async function getAllUsers() {
    return all(
        'SELECT id, username, role, active, created_at, last_login, login_count FROM users ORDER BY id ASC'
    );
}

async function toggleUserActive(id, active) {
    await run('UPDATE users SET active = $1 WHERE id = $2', [active, id]);
}

async function changePassword(username, newPassword) {
    const hash = bcrypt.hashSync(newPassword, 12);
    await run('UPDATE users SET password = $1 WHERE username = $2', [hash, username]);
}

async function updateUserProfile(username, { nombre, apellido, email, telefono }) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    await run(
        `UPDATE users SET nombre = $1, apellido = $2, email = $3, telefono = $4, updated_at = $5 WHERE username = $6`,
        [nombre, apellido, email, telefono, now, username]
    );
}

async function changeRole(id, role) {
    await run('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
}

// ── Auditoría ─────────────────────────

async function logAccess({ username, action, success, ip, userAgent }) {
    await run(
        `INSERT INTO audit_log (username, action, success, ip, user_agent)
         VALUES ($1, $2, $3, $4, $5)`,
        [username, action, success ? 1 : 0, ip, userAgent]
    );
}

async function logAuditEvent({ username, action, success, ip, userAgent, module, details, durationMs }) {
    const detailsJson = details ? JSON.stringify(details) : null;
    await run(
        `INSERT INTO audit_log (username, action, success, ip, user_agent, module, details, duration_ms)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [username, action, success !== false ? 1 : 0, ip, userAgent, module || null, detailsJson, durationMs || null]
    );
}

async function getAuditLog(limit = 100) {
    return all(
        'SELECT * FROM audit_log ORDER BY id DESC LIMIT $1',
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
    updateUserProfile,
    changeRole,
    logAccess,
    logAuditEvent,
    getAuditLog,
    run,
    all,
    get,
};