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
        await run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_secret TEXT`);
        await run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_enabled INTEGER DEFAULT 0`);
        await run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS signature TEXT`);
        await run(`CREATE INDEX IF NOT EXISTS idx_users_signature_code ON users (signature_code)`);
        await run(`UPDATE users SET email = username WHERE email IS NULL OR email = ''`);
        await run(`CREATE TABLE IF NOT EXISTS audit_log (
            id SERIAL PRIMARY KEY, username TEXT NOT NULL, action TEXT NOT NULL,
            success INTEGER NOT NULL DEFAULT 1, ip TEXT, user_agent TEXT,
            module TEXT, details TEXT, duration_ms INTEGER,
            timestamp TEXT DEFAULT to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS')
        )`);
        await run(`ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS prev_hash TEXT`);
        await run(`ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS row_hash TEXT`);
        await run(`CREATE INDEX IF NOT EXISTS idx_users_username ON users (username)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log (timestamp DESC)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_audit_log_username ON audit_log (username)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_audit_log_module ON audit_log (module)`);
        await run(`CREATE TABLE IF NOT EXISTS token_blacklist (
            id SERIAL PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL,
            created_at TEXT DEFAULT to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS')
        )`);
        await run(`CREATE INDEX IF NOT EXISTS idx_token_blacklist_hash ON token_blacklist (token_hash)`);
        await run(`CREATE TABLE IF NOT EXISTS trusted_devices (
            id SERIAL PRIMARY KEY, username TEXT NOT NULL, fingerprint_hash TEXT NOT NULL,
            device_name TEXT, browser TEXT, os TEXT, screen_res TEXT, timezone TEXT,
            trusted INTEGER NOT NULL DEFAULT 0,
            last_seen TEXT, created_at TEXT DEFAULT to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS'),
            UNIQUE(username, fingerprint_hash)
        )`);
        await run(`CREATE INDEX IF NOT EXISTS idx_trusted_devices_username ON trusted_devices (username)`);
        await run(`CREATE TABLE IF NOT EXISTS data_snapshots (
            id SERIAL PRIMARY KEY, username TEXT NOT NULL, sheet_id TEXT,
            data_hash TEXT NOT NULL, snapshot_json TEXT NOT NULL,
            source_file TEXT, row_count INTEGER, col_count INTEGER,
            checksum TEXT,
            created_at TEXT DEFAULT to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS'),
            ip TEXT, user_agent TEXT
        )`);
        await run(`CREATE INDEX IF NOT EXISTS idx_data_snapshots_username ON data_snapshots (username)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_data_snapshots_created ON data_snapshots (created_at DESC)`);
        console.log('✅ Tablas verificadas en PostgreSQL');
        await _migrateAuditHashes();
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

    async function createUser({ username, password, role = 'user', nombre, apellido, email, telefono, signatureCode, signature, cargo, createdBy, passwordTemp }) {
        const hash = await bcrypt.hash(password, 12);
        const ptemp = passwordTemp ? 1 : 0;
        try {
            const result = await run(
                `INSERT INTO users (username,password,role,nombre,apellido,email,telefono,signature_code,signature,cargo,created_by,password_temp) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
                [username, hash, role, nombre||null, apellido||null, email||username, telefono||null, signatureCode||null, signature||null, cargo||null, createdBy, ptemp]
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
        return all('SELECT id,username,role,active,created_at,last_login,login_count,nombre,apellido,email,telefono,avatar,updated_at,totp_enabled,password_temp,signature_code,cargo,signature FROM users ORDER BY id ASC');
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

    async function updateUserProfile(username, { nombre, apellido, email, telefono, cargo, signatureCode, signature }) {
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
        await run(`UPDATE users SET nombre=$1,apellido=$2,email=$3,telefono=$4,cargo=$5,signature_code=$6,signature=$7,updated_at=$8 WHERE username=$9`,
            [nombre, apellido, email, telefono, cargo||null, signatureCode||null, signature||null, now, username]);
    }

    async function updateUserProfileById(id, { nombre, apellido, email, telefono, cargo, signatureCode, signature }) {
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
        await run(`UPDATE users SET nombre=$1,apellido=$2,email=$3,telefono=$4,cargo=$5,signature_code=$6,signature=$7,updated_at=$8 WHERE id=$9`,
            [nombre, apellido, email, telefono, cargo||null, signatureCode||null, signature||null, now, id]);
    }

    async function changeRole(id, role) { await run('UPDATE users SET role=$1 WHERE id=$2', [role, id]); }

    function _computeRowHash(prevHash, data) {
        const h = crypto.createHash('sha256');
        h.update(prevHash || '');
        h.update(data.username || '');
        h.update(data.action || '');
        h.update(String(data.success ?? 1));
        h.update(data.ip || '');
        h.update(data.userAgent || '');
        h.update(data.module || '');
        h.update(data.details || '');
        h.update(String(data.durationMs ?? ''));
        h.update(data.timestamp || '');
        return h.digest('hex');
    }

    async function _getLastRowHash() {
        const row = await get('SELECT row_hash FROM audit_log ORDER BY id DESC LIMIT 1');
        return row ? row.row_hash : null;
    }

    async function logAccess({ username, action, success, ip, userAgent }) {
        const prevHash = await _getLastRowHash();
        const timestamp = new Date().toISOString();
        const data = { username, action, success, ip, userAgent, module: '', details: '', durationMs: '', timestamp };
        const rowHash = _computeRowHash(prevHash, data);
        await run(`INSERT INTO audit_log (username,action,success,ip,user_agent,timestamp,prev_hash,row_hash) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [username, action, success ? 1 : 0, ip, userAgent, timestamp, prevHash, rowHash]);
    }

    async function logAuditEvent({ username, action, success, ip, userAgent, module, details, durationMs }) {
        const prevHash = await _getLastRowHash();
        const timestamp = new Date().toISOString();
        const detailsJson = details ? JSON.stringify(details) : null;
        const data = { username, action, success, ip, userAgent, module: module||'', details: detailsJson||'', durationMs: durationMs||'', timestamp };
        const rowHash = _computeRowHash(prevHash, data);
        await run(`INSERT INTO audit_log (username,action,success,ip,user_agent,module,details,duration_ms,timestamp,prev_hash,row_hash) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [username, action, success !== false ? 1 : 0, ip, userAgent, module||null, detailsJson, durationMs||null, timestamp, prevHash, rowHash]);
    }

    async function getAuditLog(limit = 100) { return all('SELECT * FROM audit_log ORDER BY id DESC LIMIT $1', [limit]); }

    async function verifyAuditChain() {
        const rows = await all('SELECT * FROM audit_log ORDER BY id ASC');
        let expectedHash = null;
        let checked = 0;
        for (const row of rows) {
            const data = {
                username: row.username,
                action: row.action,
                success: row.success,
                ip: row.ip,
                userAgent: row.user_agent,
                module: row.module,
                details: row.details,
                durationMs: row.duration_ms,
                timestamp: row.timestamp,
            };
            const computedHash = _computeRowHash(expectedHash, data);
            if (computedHash !== row.row_hash) {
                return { valid: false, checked, brokenAt: row.id, reason: 'row_hash mismatch' };
            }
            if (row.prev_hash !== expectedHash) {
                return { valid: false, checked, brokenAt: row.id, reason: 'prev_hash mismatch' };
            }
            expectedHash = computedHash;
            checked++;
        }
        return { valid: true, checked, lastHash: expectedHash };
    }

    async function _migrateAuditHashes() {
        const rows = await all('SELECT * FROM audit_log WHERE row_hash IS NULL ORDER BY id ASC');
        if (!rows.length) return;
        console.log(`🔗 Migrando ${rows.length} registros de auditoría sin hash...`);
        let expectedHash = null;
        for (const row of rows) {
            const data = {
                username: row.username,
                action: row.action,
                success: row.success,
                ip: row.ip,
                userAgent: row.user_agent,
                module: row.module,
                details: row.details,
                durationMs: row.duration_ms,
                timestamp: row.timestamp,
            };
            const computedHash = _computeRowHash(expectedHash, data);
            await run('UPDATE audit_log SET prev_hash=$1, row_hash=$2 WHERE id=$3', [expectedHash, computedHash, row.id]);
            expectedHash = computedHash;
        }
        console.log(`✅ ${rows.length} registros migrados. Último hash: ${expectedHash}`);
    }

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

    // ── Device Checks (§ 11.10(h)) ─────────
    async function registerDevice(username, fingerprintHash, info) {
        var now = new Date().toISOString();
        await run(`INSERT INTO trusted_devices (username, fingerprint_hash, device_name, browser, os, screen_res, timezone, last_seen, created_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            ON CONFLICT (username, fingerprint_hash)
            DO UPDATE SET last_seen=$8, device_name=COALESCE(trusted_devices.device_name, $3),
                browser=COALESCE(trusted_devices.browser, $4), os=COALESCE(trusted_devices.os, $5)`,
            [username, fingerprintHash, info.device_name || null, info.browser || null,
             info.os || null, info.screen_res || null, info.timezone || null, now, now]);
    }

    async function isDeviceTrusted(username, fingerprintHash) {
        var row = await get('SELECT trusted FROM trusted_devices WHERE username=$1 AND fingerprint_hash=$2', [username, fingerprintHash]);
        return row ? row.trusted === 1 : false;
    }

    async function getUserDevices(username) {
        return all('SELECT * FROM trusted_devices WHERE username=$1 ORDER BY trusted DESC, last_seen DESC', [username]);
    }

    async function getAllDevices() {
        return all('SELECT * FROM trusted_devices ORDER BY trusted DESC, last_seen DESC');
    }

    async function setDeviceTrust(id, trusted) {
        await run('UPDATE trusted_devices SET trusted=$1 WHERE id=$2', [trusted ? 1 : 0, id]);
    }

    async function removeDevice(id) {
        await run('DELETE FROM trusted_devices WHERE id=$1', [id]);
    }

    // ── 2FA (TOTP) ────────────────────────────
    async function getUserById(id) {
        return get('SELECT * FROM users WHERE id = $1', [id]);
    }

    async function save2FASecret(username, secret) {
        await run('UPDATE users SET totp_secret = $1 WHERE username = $2', [secret, username]);
    }

    async function get2FASecret(username) {
        const u = await get('SELECT totp_secret FROM users WHERE username = $1', [username]);
        return u ? u.totp_secret : null;
    }

    async function enable2FA(username) {
        await run('UPDATE users SET totp_enabled = 1 WHERE username = $1', [username]);
    }

    async function disable2FA(username) {
        await run('UPDATE users SET totp_secret = NULL, totp_enabled = 0 WHERE username = $1', [username]);
    }

    async function has2FAEnabled(username) {
        const u = await get('SELECT totp_enabled FROM users WHERE username = $1', [username]);
        return u ? u.totp_enabled === 1 : false;
    }

    // ── WORM - Data Snapshots ──────────────────
    async function createSnapshot({ username, sheetId, dataHash, snapshotJson, sourceFile, rowCount, colCount, checksum, ip, userAgent }) {
        const result = await run(
            `INSERT INTO data_snapshots (username, sheet_id, data_hash, snapshot_json, source_file, row_count, col_count, checksum, ip, user_agent)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
            [username, sheetId||null, dataHash, snapshotJson, sourceFile||null, rowCount||null, colCount||null, checksum||null, ip||null, userAgent||null]
        );
        await logAuditEvent({
            username, action: 'SNAPSHOT_CREATE', success: 1,
            ip: ip||'', userAgent: userAgent||'',
            module: 'DATA', details: JSON.stringify({ snapshotId: result.lastID, sheetId: sheetId||null, rowCount: rowCount||null })
        });
        return { ok: true, id: result.lastID };
    }

    async function getSnapshots(username, limit = 20) {
        if (username) {
            return all('SELECT id, username, sheet_id, data_hash, source_file, row_count, col_count, created_at FROM data_snapshots WHERE username = $1 ORDER BY id DESC LIMIT $2', [username, limit]);
        }
        return all('SELECT id, username, sheet_id, data_hash, source_file, row_count, col_count, created_at FROM data_snapshots ORDER BY id DESC LIMIT $1', [limit]);
    }

    async function getSnapshotById(id) {
        return get('SELECT * FROM data_snapshots WHERE id = $1', [id]);
    }

    return { run, get, all, initDatabase, createInitialAdmin, getUserByUsername, getUserBySignatureCode, getUserById, createUser, updateLastLogin, getAllUsers, toggleUserActive, changePassword, setPasswordTemp, getUserPasswordTemp, updateUserProfile, updateUserProfileById, changeRole, logAccess, logAuditEvent, getAuditLog, verifyAuditChain, blacklistToken, isTokenBlacklisted, cleanExpiredBlacklist, registerDevice, isDeviceTrusted, getUserDevices, getAllDevices, setDeviceTrust, removeDevice, save2FASecret, get2FASecret, enable2FA, disable2FA, has2FAEnabled, createSnapshot, getSnapshots, getSnapshotById };
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

    async function initDatabase() {
        if (!state.users.length) console.log('✅ Store local listo');
        await _migrateAuditHashes();
    }

    function _migrateAuditHashes() {
        const rows = state.audit_log.filter(r => !r.row_hash).sort((a, b) => a.id - b.id);
        if (!rows.length) return;
        console.log(`🔗 Migrando ${rows.length} registros de auditoría sin hash (local)...`);
        let expectedHash = null;
        for (const row of rows) {
            const data = {
                username: row.username,
                action: row.action,
                success: row.success,
                ip: row.ip,
                userAgent: row.user_agent,
                module: row.module,
                details: row.details,
                durationMs: row.duration_ms,
                timestamp: row.timestamp,
            };
            const computedHash = _computeRowHash(expectedHash, data);
            row.prev_hash = expectedHash;
            row.row_hash = computedHash;
            expectedHash = computedHash;
        }
        save();
        console.log(`✅ ${rows.length} registros migrados (local). Último hash: ${expectedHash}`);
    }

    async function createInitialAdmin() {
        const username = process.env.ADMIN_USERNAME || 'admin';
        if (state.users.find(u => u.username === username)) return;
        const adminPass = process.env.ADMIN_PASSWORD;
        if (!adminPass) {
            console.error('❌ ADMIN_PASSWORD environment variable is required for initial admin creation');
            process.exit(1);
        }
        const hash = await bcrypt.hash(adminPass, 12);
        state.users.push({
            id: state.nextUserId++, username, password: hash, role: 'admin', active: 1,
            created_by: 'system', created_at: new Date().toISOString(),
            last_login: null, login_count: 0, nombre: null, apellido: null,
            email: username, telefono: null, avatar: null, updated_at: null,
            password_temp: 0, signature_code: null, signature: null, cargo: null,
        });
        save();
        console.log(`✅ Admin local creado: ${username}`);
    }

    function findUser(username) { return state.users.find(u => u.username === username && u.active === 1) || null; }
    function findById(id) { return state.users.find(u => u.id === id) || null; }

    async function getUserByUsername(username) { return findUser(username); }
    async function getUserBySignatureCode(code) { return state.users.find(u => u.signature_code === code && u.active === 1) || null; }

    async function createUser({ username, password, role = 'user', nombre, apellido, email, telefono, signatureCode, signature, cargo, createdBy, passwordTemp }) {
        if (state.users.find(u => u.username === username)) return { ok: false, error: 'El usuario ya existe' };
        const hash = await bcrypt.hash(password, 12);
        const user = {
            id: state.nextUserId++, username, password: hash, role, active: 1,
            created_by: createdBy || 'system', created_at: new Date().toISOString(),
            last_login: null, login_count: 0, nombre: nombre||null, apellido: apellido||null,
            email: email||username, telefono: telefono||null, avatar: null, updated_at: null,
            password_temp: passwordTemp ? 1 : 0, signature_code: signatureCode||null, signature: signature||null, cargo: cargo||null,
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

    async function updateUserProfile(username, { nombre, apellido, email, telefono, cargo, signatureCode, signature }) {
        const u = findUser(username);
        if (!u) return;
        Object.assign(u, { nombre, apellido, email, telefono, cargo: cargo||null, signature_code: signatureCode||null, signature: signature||null, updated_at: new Date().toISOString() });
        save();
    }

    async function updateUserProfileById(id, { nombre, apellido, email, telefono, cargo, signatureCode, signature }) {
        const u = findById(id);
        if (!u) return;
        Object.assign(u, { nombre, apellido, email, telefono, cargo: cargo||null, signature_code: signatureCode||null, signature: signature||null, updated_at: new Date().toISOString() });
        save();
    }

    async function changeRole(id, role) { const u = findById(id); if (u) { u.role = role; save(); } }

    function _computeRowHash(prevHash, data) {
        const h = crypto.createHash('sha256');
        h.update(prevHash || '');
        h.update(data.username || '');
        h.update(data.action || '');
        h.update(String(data.success ?? 1));
        h.update(data.ip || '');
        h.update(data.userAgent || '');
        h.update(data.module || '');
        h.update(data.details || '');
        h.update(String(data.durationMs ?? ''));
        h.update(data.timestamp || '');
        return h.digest('hex');
    }

    function _getLastRowHash() {
        const last = state.audit_log[state.audit_log.length - 1];
        return last ? last.row_hash : null;
    }

    async function logAccess({ username, action, success, ip, userAgent }) {
        const prevHash = _getLastRowHash();
        const timestamp = new Date().toISOString();
        const data = { username, action, success, ip, userAgent, module: '', details: '', durationMs: '', timestamp };
        const rowHash = _computeRowHash(prevHash, data);
        state.audit_log.push({ id: state.nextAuditId++, username, action, success: success?1:0, ip, user_agent: userAgent, module: null, details: null, duration_ms: null, timestamp, prev_hash: prevHash, row_hash: rowHash });
        save();
    }

    async function logAuditEvent({ username, action, success, ip, userAgent, module, details, durationMs }) {
        const prevHash = _getLastRowHash();
        const timestamp = new Date().toISOString();
        const detailsJson = details ? JSON.stringify(details) : null;
        const data = { username, action, success, ip, userAgent, module: module||'', details: detailsJson||'', durationMs: durationMs||'', timestamp };
        const rowHash = _computeRowHash(prevHash, data);
        state.audit_log.push({ id: state.nextAuditId++, username, action, success: success!==false?1:0, ip, user_agent: userAgent, module: module||null, details: detailsJson, duration_ms: durationMs||null, timestamp, prev_hash: prevHash, row_hash: rowHash });
        save();
    }

    async function getAuditLog(limit = 100) { return state.audit_log.slice(-limit).reverse(); }

    async function verifyAuditChain() {
        const rows = [...state.audit_log].sort((a, b) => a.id - b.id);
        let expectedHash = null;
        let checked = 0;
        for (const row of rows) {
            const data = {
                username: row.username,
                action: row.action,
                success: row.success,
                ip: row.ip,
                userAgent: row.user_agent,
                module: row.module,
                details: row.details,
                durationMs: row.duration_ms,
                timestamp: row.timestamp,
            };
            const computedHash = _computeRowHash(expectedHash, data);
            if (computedHash !== row.row_hash) {
                return { valid: false, checked, brokenAt: row.id, reason: 'row_hash mismatch' };
            }
            if (row.prev_hash !== expectedHash) {
                return { valid: false, checked, brokenAt: row.id, reason: 'prev_hash mismatch' };
            }
            expectedHash = computedHash;
            checked++;
        }
        return { valid: true, checked, lastHash: expectedHash };
    }

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

    // ── Device Checks (§ 11.10(h)) ─────────
    if (!state.trusted_devices) state.trusted_devices = [];

    async function registerDevice(username, fingerprintHash, info) {
        var now = new Date().toISOString();
        var existing = state.trusted_devices.find(function(d) { return d.username === username && d.fingerprint_hash === fingerprintHash; });
        if (existing) {
            existing.last_seen = now;
            if (!existing.device_name && info.device_name) existing.device_name = info.device_name;
            if (!existing.browser && info.browser) existing.browser = info.browser;
            if (!existing.os && info.os) existing.os = info.os;
            if (!existing.screen_res && info.screen_res) existing.screen_res = info.screen_res;
            if (!existing.timezone && info.timezone) existing.timezone = info.timezone;
        } else {
            state.trusted_devices.push({
                id: state.trusted_devices.length + 1,
                username: username,
                fingerprint_hash: fingerprintHash,
                device_name: info.device_name || null,
                browser: info.browser || null,
                os: info.os || null,
                screen_res: info.screen_res || null,
                timezone: info.timezone || null,
                trusted: 0,
                last_seen: now,
                created_at: now,
            });
        }
        save();
    }

    async function isDeviceTrusted(username, fingerprintHash) {
        var d = state.trusted_devices.find(function(d) { return d.username === username && d.fingerprint_hash === fingerprintHash; });
        return d ? d.trusted === 1 : false;
    }

    async function getUserDevices(username) {
        return state.trusted_devices.filter(function(d) { return d.username === username; })
            .sort(function(a, b) { return (b.trusted - a.trusted) || (new Date(b.last_seen) - new Date(a.last_seen)); });
    }

    async function getAllDevices() {
        return state.trusted_devices.slice()
            .sort(function(a, b) { return (b.trusted - a.trusted) || (new Date(b.last_seen) - new Date(a.last_seen)); });
    }

    async function setDeviceTrust(id, trusted) {
        var d = state.trusted_devices.find(function(d) { return d.id === id; });
        if (d) { d.trusted = trusted ? 1 : 0; save(); }
    }

    async function removeDevice(id) {
        state.trusted_devices = state.trusted_devices.filter(function(d) { return d.id !== id; });
        save();
    }

    // ── 2FA (TOTP) ────────────────────────────
    async function getUserById(id) { return state.users.find(function(u) { return u.id === id; }) || null; }

    async function save2FASecret(username, secret) {
        var u = findUser(username);
        if (u) { u.totp_secret = secret; save(); }
    }

    async function get2FASecret(username) {
        var u = findUser(username);
        return u ? u.totp_secret : null;
    }

    async function enable2FA(username) {
        var u = findUser(username);
        if (u) { u.totp_enabled = 1; save(); }
    }

    async function disable2FA(username) {
        var u = findUser(username);
        if (u) { u.totp_secret = null; u.totp_enabled = 0; save(); }
    }

    async function has2FAEnabled(username) {
        var u = findUser(username);
        return u ? u.totp_enabled === 1 : false;
    }

    // ── WORM - Data Snapshots ──────────────────
    if (!state.data_snapshots) state.data_snapshots = [];
    var _snapshotIdCounter = state.data_snapshots.length > 0 ? Math.max.apply(null, state.data_snapshots.map(function(s) { return s.id; })) + 1 : 1;

    async function createSnapshot({ username, sheetId, dataHash, snapshotJson, sourceFile, rowCount, colCount, checksum, ip, userAgent }) {
        var snapshot = {
            id: _snapshotIdCounter++, username: username, sheet_id: sheetId||null,
            data_hash: dataHash, snapshot_json: snapshotJson,
            source_file: sourceFile||null, row_count: rowCount||null, col_count: colCount||null,
            checksum: checksum||null, ip: ip||null, user_agent: userAgent||null,
            created_at: new Date().toISOString(),
        };
        state.data_snapshots.push(snapshot);
        save();
        /* audit manually */
        state.audit_log.push({ id: state.nextAuditId++, username: username, action: 'SNAPSHOT_CREATE', success: 1,
            ip: ip||'', user_agent: userAgent||'', module: 'DATA', details: JSON.stringify({ snapshotId: snapshot.id, sheetId: sheetId||null }),
            timestamp: new Date().toISOString(), prev_hash: null, row_hash: null, duration_ms: null });
        save();
        return { ok: true, id: snapshot.id };
    }

    async function getSnapshots(username, limit) {
        limit = limit || 20;
        var list = state.data_snapshots.filter(function(s) { return username ? s.username === username : true; });
        return list.sort(function(a, b) { return b.id - a.id; }).slice(0, limit);
    }

    async function getSnapshotById(id) {
        return state.data_snapshots.find(function(s) { return s.id === id; }) || null;
    }

    return { run, get, all, initDatabase, createInitialAdmin, getUserByUsername, getUserBySignatureCode, getUserById, createUser, updateLastLogin, getAllUsers, toggleUserActive, changePassword, setPasswordTemp, getUserPasswordTemp, updateUserProfile, updateUserProfileById, changeRole, logAccess, logAuditEvent, getAuditLog, verifyAuditChain, blacklistToken, isTokenBlacklisted, cleanExpiredBlacklist, registerDevice, isDeviceTrusted, getUserDevices, getAllDevices, setDeviceTrust, removeDevice, save2FASecret, get2FASecret, enable2FA, disable2FA, has2FAEnabled, createSnapshot, getSnapshots, getSnapshotById };
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
    verifyAuditChain:    (...a) => impl.verifyAuditChain(...a),
    blacklistToken:      (...a) => impl.blacklistToken(...a),
    isTokenBlacklisted:  (...a) => impl.isTokenBlacklisted(...a),
    cleanExpiredBlacklist: (...a) => impl.cleanExpiredBlacklist(...a),
    registerDevice:       (...a) => impl.registerDevice(...a),
    isDeviceTrusted:      (...a) => impl.isDeviceTrusted(...a),
    getUserDevices:       (...a) => impl.getUserDevices(...a),
    getAllDevices:        (...a) => impl.getAllDevices(...a),
    setDeviceTrust:       (...a) => impl.setDeviceTrust(...a),
    removeDevice:         (...a) => impl.removeDevice(...a),
    getUserById:          (...a) => impl.getUserById(...a),
    save2FASecret:        (...a) => impl.save2FASecret(...a),
    get2FASecret:         (...a) => impl.get2FASecret(...a),
    enable2FA:            (...a) => impl.enable2FA(...a),
    disable2FA:           (...a) => impl.disable2FA(...a),
    has2FAEnabled:        (...a) => impl.has2FAEnabled(...a),
    createSnapshot:       (...a) => impl.createSnapshot(...a),
    getSnapshots:         (...a) => impl.getSnapshots(...a),
    getSnapshotById:      (...a) => impl.getSnapshotById(...a),
    run:                  (...a) => impl.run(...a),
    all:                 (...a) => impl.all(...a),
    get:                 (...a) => impl.get(...a),
};
