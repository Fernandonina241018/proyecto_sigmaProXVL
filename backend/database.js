// ========================================
// database.js — StatAnalyzer Pro Backend
// PostgreSQL (DATABASE_URL set) / JSON-store (local dev)
// ========================================

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

const USE_PG = !!process.env.DATABASE_URL;

function build() {
    if (USE_PG) return buildPostgres();
    console.log('📦 DATABASE_URL no definido — usando store JSON local (dev)');
    return buildLocalStore();
}

// ───── PostgreSQL backend ─────
function buildPostgres() {
    const { Pool } = require('pg');

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: process.env.DB_SSL_INSECURE === '1' ? false : true },
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
        console.error('❌ Error inesperado en cliente inactivo del pool:', err.message);
    });

    async function run(sql, params = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(sql, params);
            return { rows: result.rows, rowCount: result.rowCount, lastID: result.rows[0]?.id || null };
        } finally { client.release(); }
    }

    async function get(sql, params = []) { const r = await run(sql, params); return r.rows[0] || null; }
    async function all(sql, params = []) { const r = await run(sql, params); return r.rows; }

    async function initDatabase() {
        await run(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user', active INTEGER NOT NULL DEFAULT 1,
            created_by TEXT, created_at TEXT DEFAULT to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS'),
            last_login TEXT, login_count INTEGER DEFAULT 0,
            nombre TEXT, apellido TEXT, email TEXT, telefono TEXT, avatar TEXT,
            updated_at TEXT, password_temp INTEGER DEFAULT 0,
            signature_code TEXT, cargo TEXT
        )`);
        await run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_temp INTEGER DEFAULT 0`);
        await run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS signature_code TEXT`);
        await run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS cargo TEXT`);
        await run(`CREATE INDEX IF NOT EXISTS idx_users_signature_code ON users (signature_code)`);
        await run(`UPDATE users SET email = username WHERE email IS NULL OR email = ''`);
        await run(`CREATE TABLE IF NOT EXISTS audit_log (
            id SERIAL PRIMARY KEY, username TEXT NOT NULL, action TEXT NOT NULL,
            success INTEGER NOT NULL DEFAULT 1, ip TEXT, user_agent TEXT,
            module TEXT, details TEXT, duration_ms INTEGER,
            timestamp TEXT DEFAULT to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS')
        )`);
        await run(`CREATE INDEX IF NOT EXISTS idx_users_username ON users (username)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log (timestamp DESC)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_audit_log_username ON audit_log (username)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_audit_log_module ON audit_log (module)`);
        await run(`CREATE TABLE IF NOT EXISTS token_blacklist (
            id SERIAL PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL,
            created_at TEXT DEFAULT to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS')
        )`);
        await run(`CREATE INDEX IF NOT EXISTS idx_token_blacklist_hash ON token_blacklist (token_hash)`);
        console.log('✅ Tablas verificadas en PostgreSQL');
    }

    async function createInitialAdmin() {
        const existing = await get('SELECT id FROM users WHERE username = $1', [process.env.ADMIN_USERNAME]);
        if (existing) return;
        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
        await run(`INSERT INTO users (username, password, role, created_by) VALUES ($1,$2,'admin','system')`, [process.env.ADMIN_USERNAME, hash]);
        console.log(`✅ Admin inicial creado: ${process.env.ADMIN_USERNAME}`);
    }

    async function getUserByUsername(username) { return get('SELECT * FROM users WHERE username = $1 AND active = 1', [username]); }
    async function getUserBySignatureCode(code) { return get('SELECT * FROM users WHERE signature_code = $1 AND active = 1', [code]); }

    async function createUser({ username, password, role = 'user', nombre, apellido, email, telefono, signatureCode, cargo, createdBy }) {
        const hash = await bcrypt.hash(password, 12);
        try {
            const result = await run(
                `INSERT INTO users (username,password,role,nombre,apellido,email,telefono,signature_code,cargo,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
                [username, hash, role, nombre||null, apellido||null, email||username, telefono||null, signatureCode||null, cargo||null, createdBy]
            );
            return { ok: true, id: result.lastID };
        } catch (err) {
            if (err.code === '23505') return { ok: false, error: 'El usuario ya existe' };
            return { ok: false, error: err.message };
        }
    }

    async function updateLastLogin(username) {
        await run(`UPDATE users SET last_login=to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS'), login_count=login_count+1 WHERE username=$1`, [username]);
    }

    async function getAllUsers() {
        return all('SELECT id,username,role,active,created_at,last_login,login_count,nombre,apellido,email,telefono,avatar,updated_at FROM users ORDER BY id ASC');
    }

    async function toggleUserActive(id, active) { await run('UPDATE users SET active=$1 WHERE id=$2', [active, id]); }

    async function changePassword(username, newPassword) {
        const hash = await bcrypt.hash(newPassword, 12);
        await run('UPDATE users SET password=$1, password_temp=0 WHERE username=$2', [hash, username]);
    }

    async function setPasswordTemp(username, value) { await run('UPDATE users SET password_temp=$1 WHERE username=$2', [value ? 1 : 0, username]); }

    async function getUserPasswordTemp(username) {
        const u = await get('SELECT password_temp FROM users WHERE username=$1', [username]);
        return u ? u.password_temp === 1 : false;
    }

    async function updateUserProfile(username, { nombre, apellido, email, telefono, cargo, signatureCode }) {
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
        await run(`UPDATE users SET nombre=$1,apellido=$2,email=$3,telefono=$4,cargo=$5,signature_code=$6,updated_at=$7 WHERE username=$8`,
            [nombre, apellido, email, telefono, cargo||null, signatureCode||null, now, username]);
    }

    async function updateUserProfileById(id, { nombre, apellido, email, telefono, cargo, signatureCode }) {
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
        await run(`UPDATE users SET nombre=$1,apellido=$2,email=$3,telefono=$4,cargo=$5,signature_code=$6,updated_at=$7 WHERE id=$8`,
            [nombre, apellido, email, telefono, cargo||null, signatureCode||null, now, id]);
    }

    async function changeRole(id, role) { await run('UPDATE users SET role=$1 WHERE id=$2', [role, id]); }

    async function logAccess({ username, action, success, ip, userAgent }) {
        await run(`INSERT INTO audit_log (username,action,success,ip,user_agent) VALUES ($1,$2,$3,$4,$5)`,
            [username, action, success ? 1 : 0, ip, userAgent]);
    }

    async function logAuditEvent({ username, action, success, ip, userAgent, module, details, durationMs }) {
        const detailsJson = details ? JSON.stringify(details) : null;
        await run(`INSERT INTO audit_log (username,action,success,ip,user_agent,module,details,duration_ms) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [username, action, success !== false ? 1 : 0, ip, userAgent, module||null, detailsJson, durationMs||null]);
    }

    async function getAuditLog(limit = 100) { return all('SELECT * FROM audit_log ORDER BY id DESC LIMIT $1', [limit]); }

    async function blacklistToken(token) {
        if (!token) return;
        const h = hashToken(token);
        try {
            await run('INSERT INTO token_blacklist (token_hash) VALUES ($1) ON CONFLICT DO NOTHING', [h]);
        } catch (err) {
            console.error('❌ Error al añadir token a blacklist (token seguirá válido hasta expirar):', err.message);
        }
    }

    async function isTokenBlacklisted(token) {
        if (!token) return false;
        const h = hashToken(token);
        const row = await get('SELECT id FROM token_blacklist WHERE token_hash = $1', [h]);
        return !!row;
    }

    async function cleanExpiredBlacklist() {
        await run(`DELETE FROM token_blacklist WHERE created_at < to_char(now() - interval '24 hours','YYYY-MM-DD"T"HH24:MI:SS')`);
    }

    return { run, get, all, initDatabase, createInitialAdmin, getUserByUsername, getUserBySignatureCode, createUser, updateLastLogin, getAllUsers, toggleUserActive, changePassword, setPasswordTemp, getUserPasswordTemp, updateUserProfile, updateUserProfileById, changeRole, logAccess, logAuditEvent, getAuditLog, blacklistToken, isTokenBlacklisted, cleanExpiredBlacklist };
}

// ───── Local JSON store ─────
function buildLocalStore() {
    const DATA_FILE = path.join(__dirname, 'data.json');
    let state = { users: [], audit_log: [], nextUserId: 1, nextAuditId: 1 };

    function load() {
        try { state = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); }
        catch { save(); }
    }
    function save() { fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8'); }
    load();

    const run = async () => { throw new Error('raw SQL no soportado en modo local'); };
    const get = async () => { throw new Error('raw SQL no soportado en modo local'); };
    const all = async () => { throw new Error('raw SQL no soportado en modo local'); };

    async function initDatabase() { if (!state.users.length) console.log('✅ Store local listo'); }

    async function createInitialAdmin() {
        const username = process.env.ADMIN_USERNAME || 'admin';
        if (state.users.find(u => u.username === username)) return;
        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
        state.users.push({
            id: state.nextUserId++, username, password: hash, role: 'admin', active: 1,
            created_by: 'system', created_at: new Date().toISOString(),
            last_login: null, login_count: 0, nombre: null, apellido: null,
            email: username, telefono: null, avatar: null, updated_at: null,
            password_temp: 0, signature_code: null, cargo: null,
        });
        save();
        console.log(`✅ Admin local creado: ${username}`);
    }

    function findUser(username) { return state.users.find(u => u.username === username && u.active === 1) || null; }
    function findById(id) { return state.users.find(u => u.id === id) || null; }

    async function getUserByUsername(username) { return findUser(username); }
    async function getUserBySignatureCode(code) { return state.users.find(u => u.signature_code === code && u.active === 1) || null; }

    async function createUser({ username, password, role = 'user', nombre, apellido, email, telefono, signatureCode, cargo, createdBy }) {
        if (state.users.find(u => u.username === username)) return { ok: false, error: 'El usuario ya existe' };
        const hash = await bcrypt.hash(password, 12);
        const user = {
            id: state.nextUserId++, username, password: hash, role, active: 1,
            created_by: createdBy || 'system', created_at: new Date().toISOString(),
            last_login: null, login_count: 0, nombre: nombre||null, apellido: apellido||null,
            email: email||username, telefono: telefono||null, avatar: null, updated_at: null,
            password_temp: 0, signature_code: signatureCode||null, cargo: cargo||null,
        };
        state.users.push(user); save();
        return { ok: true, id: user.id };
    }

    async function updateLastLogin(username) {
        const u = findUser(username);
        if (!u) return;
        u.last_login = new Date().toISOString();
        u.login_count = (u.login_count || 0) + 1;
        save();
    }

    async function getAllUsers() { return state.users.map(({ password, ...u }) => u); }
    async function toggleUserActive(id, active) { const u = findById(id); if (u) { u.active = active; save(); } }

    async function changePassword(username, newPassword) {
        const u = findUser(username);
        if (!u) return;
        u.password = await bcrypt.hash(newPassword, 12);
        u.password_temp = 0;
        save();
    }

    async function setPasswordTemp(username, value) { const u = findUser(username); if (u) { u.password_temp = value ? 1 : 0; save(); } }
    async function getUserPasswordTemp(username) { const u = findUser(username); return u ? u.password_temp === 1 : false; }

    async function updateUserProfile(username, { nombre, apellido, email, telefono, cargo, signatureCode }) {
        const u = findUser(username);
        if (!u) return;
        Object.assign(u, { nombre, apellido, email, telefono, cargo: cargo||null, signature_code: signatureCode||null, updated_at: new Date().toISOString() });
        save();
    }

    async function updateUserProfileById(id, { nombre, apellido, email, telefono, cargo, signatureCode }) {
        const u = findById(id);
        if (!u) return;
        Object.assign(u, { nombre, apellido, email, telefono, cargo: cargo||null, signature_code: signatureCode||null, updated_at: new Date().toISOString() });
        save();
    }

    async function changeRole(id, role) { const u = findById(id); if (u) { u.role = role; save(); } }

    async function logAccess({ username, action, success, ip, userAgent }) {
        state.audit_log.push({ id: state.nextAuditId++, username, action, success: success?1:0, ip, user_agent: userAgent, module: null, details: null, duration_ms: null, timestamp: new Date().toISOString() });
        save();
    }

    async function logAuditEvent({ username, action, success, ip, userAgent, module, details, durationMs }) {
        state.audit_log.push({ id: state.nextAuditId++, username, action, success: success!==false?1:0, ip, user_agent: userAgent, module: module||null, details: details?JSON.stringify(details):null, duration_ms: durationMs||null, timestamp: new Date().toISOString() });
        save();
    }

    async function getAuditLog(limit = 100) { return state.audit_log.slice(-limit).reverse(); }

    async function blacklistToken(token) {
        if (!token) return;
        const h = hashToken(token);
        if (!state.token_blacklist) state.token_blacklist = [];
        if (!state.token_blacklist.find(e => e.token_hash === h)) {
            state.token_blacklist.push({ token_hash: h, created_at: new Date().toISOString() });
            save();
        }
    }

    async function isTokenBlacklisted(token) {
        if (!token) return false;
        const h = hashToken(token);
        return (state.token_blacklist || []).some(e => e.token_hash === h);
    }

    async function cleanExpiredBlacklist() {
        if (!state.token_blacklist) return;
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        state.token_blacklist = state.token_blacklist.filter(e => new Date(e.created_at).getTime() > cutoff);
        save();
    }

    return { run, get, all, initDatabase, createInitialAdmin, getUserByUsername, getUserBySignatureCode, createUser, updateLastLogin, getAllUsers, toggleUserActive, changePassword, setPasswordTemp, getUserPasswordTemp, updateUserProfile, updateUserProfileById, changeRole, logAccess, logAuditEvent, getAuditLog, blacklistToken, isTokenBlacklisted, cleanExpiredBlacklist };
}

const impl = build();
module.exports = {
    initDatabase:        (...a) => impl.initDatabase(...a),
    createInitialAdmin:  (...a) => impl.createInitialAdmin(...a),
    getUserByUsername:   (...a) => impl.getUserByUsername(...a),
    getUserBySignatureCode: (...a) => impl.getUserBySignatureCode(...a),
    createUser:          (...a) => impl.createUser(...a),
    updateLastLogin:     (...a) => impl.updateLastLogin(...a),
    getAllUsers:         (...a) => impl.getAllUsers(...a),
    toggleUserActive:    (...a) => impl.toggleUserActive(...a),
    changePassword:      (...a) => impl.changePassword(...a),
    setPasswordTemp:     (...a) => impl.setPasswordTemp(...a),
    getUserPasswordTemp: (...a) => impl.getUserPasswordTemp(...a),
    updateUserProfile:   (...a) => impl.updateUserProfile(...a),
    updateUserProfileById: (...a) => impl.updateUserProfileById(...a),
    changeRole:          (...a) => impl.changeRole(...a),
    logAccess:           (...a) => impl.logAccess(...a),
    logAuditEvent:       (...a) => impl.logAuditEvent(...a),
    getAuditLog:         (...a) => impl.getAuditLog(...a),
    blacklistToken:      (...a) => impl.blacklistToken(...a),
    isTokenBlacklisted:  (...a) => impl.isTokenBlacklisted(...a),
    cleanExpiredBlacklist: (...a) => impl.cleanExpiredBlacklist(...a),
    run:                 (...a) => impl.run(...a),
    all:                 (...a) => impl.all(...a),
    get:                 (...a) => impl.get(...a),
};
