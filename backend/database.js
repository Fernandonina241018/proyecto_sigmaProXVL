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

// ───── FASE 1 — Bandeja de firmas: lógica compartida PG/local ─────
// Secuencia fija: prepared (elabora, cualquiera) → reviewed (revisa,
// distinto al preparador) → approved (coordinador/supervisor/gerente).
// Admin firma todo ("campo libre") salvo la regla de persona distinta.
const SIGN_ORDER = ['prepared', 'reviewed', 'approved'];
const APPROVER_ROLES = ['coordinador', 'supervisor', 'gerente'];

function _signNextRole(signatures) {
    const sigs = signatures || {};
    for (const r of SIGN_ORDER) {
        if (!sigs[r] || !sigs[r].signed) return r;
    }
    return null; // completa
}

function _signStatusFor(signatures) {
    const next = _signNextRole(signatures);
    if (!next) return 'complete';
    const any = SIGN_ORDER.some((r) => signatures && signatures[r] && signatures[r].signed);
    return any ? 'partial' : 'pending';
}

// user = { username, role }. Retorna { ok:true, next } o { error, code }.
// codes: complete | out-of-order | wrong-role | wrong-assignee | same-person
function _signEligibility(session, role, user) {
    const sigs = session.signatures || {};
    const next = _signNextRole(sigs);
    if (!next) return { error: 'Sesión ya completa', code: 'complete' };
    if (role !== next) return { error: 'Fuera de orden: toca firmar "' + next + '"', code: 'out-of-order' };
    const isAdmin = user.role === 'admin';
    if (role === 'approved' && !isAdmin && APPROVER_ROLES.indexOf(user.role) === -1) {
        return { error: 'Aprobar requiere coordinador, supervisor o gerente', code: 'wrong-role' };
    }
    if (role === 'reviewed') {
        const prep = sigs.prepared;
        if (prep && prep.username && prep.username === user.username) {
            return { error: 'El revisor debe ser distinto al preparador', code: 'same-person' };
        }
        if (!isAdmin && session.assigned_reviewer && session.assigned_reviewer !== user.username) {
            return { error: 'Revisión asignada a otro usuario', code: 'wrong-assignee' };
        }
    }
    if (role === 'approved' && !isAdmin && session.assigned_approver && session.assigned_approver !== user.username) {
        return { error: 'Aprobación asignada a otro usuario', code: 'wrong-assignee' };
    }
    return { ok: true, next };
}

function _signDocHash(html) {
    return crypto.createHash('sha256').update(String(html || ''), 'utf8').digest('hex');
}

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
        // FASE 1 — Bandeja de firmas secuenciales: el reporte en proceso vive
        // en servidor (no viaja como archivo). signatures = JSONB con los 3
        // roles {prepared,reviewed,approved}; version = concurrencia optimista.
        await run(`CREATE TABLE IF NOT EXISTS report_signatures (
            id SERIAL PRIMARY KEY, doc_hash TEXT NOT NULL, name TEXT NOT NULL,
            html TEXT NOT NULL, signatures TEXT NOT NULL DEFAULT '{}',
            status TEXT NOT NULL DEFAULT 'pending',
            version INTEGER NOT NULL DEFAULT 1,
            created_by TEXT NOT NULL,
            assigned_reviewer TEXT, assigned_approver TEXT,
            created_at TEXT DEFAULT to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS'),
            updated_at TEXT DEFAULT to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS')
        )`);
        await run(`CREATE INDEX IF NOT EXISTS idx_report_signatures_status ON report_signatures (status)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_report_signatures_reviewer ON report_signatures (assigned_reviewer)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_report_signatures_approver ON report_signatures (assigned_approver)`);
        await run(`CREATE INDEX IF NOT EXISTS idx_report_signatures_creator ON report_signatures (created_by)`);
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

    async function getAllUsers(limit = 50, offset = 0) {
        return all('SELECT id,username,role,active,created_at,last_login,login_count,nombre,apellido,email,telefono,avatar,updated_at,totp_enabled,password_temp,signature_code,cargo,signature FROM users ORDER BY id ASC LIMIT $1 OFFSET $2', [limit, offset]);
    }

    // FASE 2 — lista pública para selects de asignación (sin secretos:
    // sin password, totp, signature_code). Cualquier autenticado.
    async function getUsersList() {
        return all("SELECT username,nombre,apellido,cargo,role FROM users WHERE active = 1 ORDER BY username ASC");
    }

    async function countUsers() {
        const row = await get('SELECT COUNT(*)::int AS total FROM users');
        return row ? row.total : 0;
    }

    async function toggleUserActive(id, active) { await run('UPDATE users SET active=$1 WHERE id=$2', [active, id]); }

    async function changePassword(username, newPassword) {
        const hash = await bcrypt.hash(newPassword, 12);
        await run('UPDATE users SET password=$1, password_temp=0 WHERE username=$2', [hash, username]);
    }

    async function setPasswordTemp(username, value) { await run('UPDATE users SET password_temp=$1 WHERE username=$2', [value ? 1 : 0, username]); }

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

    async function getAuditLog(limit = 100, offset = 0) { return all('SELECT * FROM audit_log ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset]); }

    // OPT-6: verificación de cadena con ventana opcional { tail: N }.
    // Sin opciones = cadena completa (comportamiento original). Con tail se
    // verifican los últimos N eslabones con rigor criptográfico completo:
    // se lee UN eslabón extra como ancla (su row_hash es el prev_hash real
    // del primer eslabón de la ventana). Si no hay extra, la ventana cubre
    // desde el génesis. Útil cuando audit_log crece y el full-scan bloquea.
    async function verifyAuditChain(options = {}) {
        const tail = Math.min(Math.max(parseInt(options.tail) || 0, 0), 5000);
        let rows, total = null, anchored = true, expectedHash = null;
        if (tail > 0) {
            const countRow = await get('SELECT COUNT(*)::int AS total FROM audit_log');
            total = countRow ? countRow.total : 0;
            const raw = await all('SELECT * FROM audit_log ORDER BY id DESC LIMIT $1', [tail + 1]);
            raw.reverse();
            if (raw.length > tail) {
                expectedHash = raw[0].row_hash; // ancla: hash real del predecesor
                rows = raw.slice(1);
                anchored = true;
            } else {
                rows = raw; // cubre desde el génesis
                expectedHash = null;
                anchored = true;
            }
        } else {
            rows = await all('SELECT * FROM audit_log ORDER BY id ASC');
            expectedHash = null;
        }
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
        const out = { valid: true, checked, lastHash: expectedHash };
        if (tail > 0) { out.partial = true; out.total = total; out.anchored = anchored; }
        return out;
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

    // OPT-6: paginación (antes sin LIMIT: full-scan en cada listado)
    async function getUserDevices(username, limit = 100, offset = 0) {
        limit = Math.min(Math.max(parseInt(limit) || 100, 1), 500);
        offset = Math.max(parseInt(offset) || 0, 0);
        return all('SELECT * FROM trusted_devices WHERE username=$1 ORDER BY trusted DESC, last_seen DESC LIMIT $2 OFFSET $3', [username, limit, offset]);
    }

    async function getAllDevices(limit = 100, offset = 0) {
        limit = Math.min(Math.max(parseInt(limit) || 100, 1), 500);
        offset = Math.max(parseInt(offset) || 0, 0);
        return all('SELECT * FROM trusted_devices ORDER BY trusted DESC, last_seen DESC LIMIT $1 OFFSET $2', [limit, offset]);
    }

    async function countDevices() {
        const row = await get('SELECT COUNT(*)::int AS total FROM trusted_devices');
        return row ? row.total : 0;
    }

    async function countUserDevices(username) {
        const row = await get('SELECT COUNT(*)::int AS total FROM trusted_devices WHERE username=$1', [username]);
        return row ? row.total : 0;
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

    // OPT-6: offset para paginar (antes solo limit)
    async function getSnapshots(username, limit = 20, offset = 0) {
        limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
        offset = Math.max(parseInt(offset) || 0, 0);
        if (username) {
            return all('SELECT id, username, sheet_id, data_hash, source_file, row_count, col_count, created_at FROM data_snapshots WHERE username = $1 ORDER BY id DESC LIMIT $2 OFFSET $3', [username, limit, offset]);
        }
        return all('SELECT id, username, sheet_id, data_hash, source_file, row_count, col_count, created_at FROM data_snapshots ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset]);
    }

    async function getSnapshotById(id) {
        return get('SELECT * FROM data_snapshots WHERE id = $1', [id]);
    }

    // ── FASE 1 — Bandeja de firmas (PG) ──────────────────────────
    function _parseSignRow(row) {
        if (!row) return null;
        let sigs = {};
        try { sigs = JSON.parse(row.signatures || '{}'); } catch (e) { sigs = {}; }
        return {
            id: row.id, doc_hash: row.doc_hash, name: row.name, html: row.html,
            signatures: sigs, status: row.status, version: row.version,
            created_by: row.created_by,
            assigned_reviewer: row.assigned_reviewer, assigned_approver: row.assigned_approver,
            created_at: row.created_at, updated_at: row.updated_at,
            next_role: _signNextRole(sigs),
        };
    }

    async function createSignSession({ name, html, createdBy, assignedReviewer, assignedApprover, preparedSignature }) {
        const docHash = _signDocHash(html);
        // El creador firma prepared al publicar: su username queda registrado
        // (lo exige la regla "revisor distinto al preparador").
        const sigs = { prepared: Object.assign({ signed: true, username: createdBy }, preparedSignature || {}) };
        const status = _signStatusFor(sigs);
        const rows = await all(
            `INSERT INTO report_signatures (doc_hash, name, html, signatures, status, version, created_by, assigned_reviewer, assigned_approver)
             VALUES ($1,$2,$3,$4,$5,1,$6,$7,$8) RETURNING *`,
            [docHash, name, html, JSON.stringify(sigs), status, createdBy, assignedReviewer || null, assignedApprover || null]
        );
        return _parseSignRow(rows[0]);
    }

    async function getSignSession(id) {
        return get('SELECT * FROM report_signatures WHERE id = $1', [id]);
    }

    // FASE 3 — importar un .html cargado a mano. Guards: el archivo no
    // puede traer reviewed/approved (no verificables en servidor) y el
    // prepared incrustado debe coincidir con quien publica (verificado).
    // embedded = extractEmbeddedSignatures(html) calculado en servidor.
    async function importSignSession({ name, html, createdBy, assignedReviewer, assignedApprover, preparedSignature, embedded }) {
        const emb = embedded || {};
        if ((emb.reviewed && emb.reviewed.signed) || (emb.approved && emb.approved.signed)) {
            return { error: 'El archivo ya trae firmas de revisión/aprobación no verificables; reinícialas o publícalo como respaldo', code: 'advanced-signatures' };
        }
        const verifiedName = String((preparedSignature && preparedSignature.nombre) || '').trim().toLowerCase();
        const embeddedName = String((emb.prepared && emb.prepared.name) || '').trim().toLowerCase();
        if (emb.prepared && emb.prepared.signed && embeddedName !== verifiedName) {
            return { error: 'El elaborador del archivo no coincide con tu identidad verificada', code: 'preparer-mismatch' };
        }
        return createSignSession({ name, html, createdBy, assignedReviewer, assignedApprover, preparedSignature });
    }

    async function listSignSessions({ scope, username, limit = 50, offset = 0 }) {
        limit = Math.min(Math.max(parseInt(limit) || 50, 1), 200);
        offset = Math.max(parseInt(offset) || 0, 0);
        let rows;
        if (scope === 'mine') {
            rows = await all(
                'SELECT * FROM report_signatures WHERE created_by = $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
                [username, limit, offset]
            );
        } else {
            // pending: no completas; el filtro fino (asignado/elegible) lo hace el endpoint con el rol
            rows = await all(
                "SELECT * FROM report_signatures WHERE status <> 'complete' ORDER BY id DESC LIMIT $1 OFFSET $2",
                [limit, offset]
            );
        }
        return rows.map(_parseSignRow);
    }

    // Aplica una firma con concurrencia optimista (version). Retorna la
    // sesión actualizada o un objeto { error, code }. newAssignee reasigna
    // el siguiente rol (el revisor puede fijar/cambiar el aprobador).
    async function signSessionStep({ id, role, username, userRole, signature, expectedVersion, newAssignee }) {
        const row = await get('SELECT * FROM report_signatures WHERE id = $1', [id]);
        if (!row) return { error: 'Sesión no encontrada', code: 'not-found' };
        const session = _parseSignRow(row);
        if (session.version !== expectedVersion) {
            return { error: 'Otro usuario firmó entremedio; recarga e intenta de nuevo', code: 'stale-version' };
        }
        const elig = _signEligibility(
            { signatures: session.signatures, assigned_reviewer: session.assigned_reviewer, assigned_approver: session.assigned_approver },
            role, { username, role: userRole }
        );
        if (!elig.error) {
            const sigs = Object.assign({}, session.signatures);
            sigs[role] = Object.assign({ signed: true, username, signed_at: new Date().toISOString() }, signature || {});
            let assigneeR = session.assigned_reviewer, assigneeA = session.assigned_approver;
            if (newAssignee !== undefined && newAssignee !== null && newAssignee !== '') {
                if (role === 'prepared') assigneeR = newAssignee;
                else assigneeA = newAssignee;
            }
            const status = _signStatusFor(sigs);
            const updated = await all(
                `UPDATE report_signatures SET signatures = $1, status = $2, version = version + 1,
                 assigned_reviewer = $3, assigned_approver = $4, updated_at = to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS')
                 WHERE id = $5 AND version = $6 RETURNING *`,
                [JSON.stringify(sigs), status, assigneeR, assigneeA, id, expectedVersion]
            );
            if (!updated.length) {
                return { error: 'Otro usuario firmó entremedio; recarga e intenta de nuevo', code: 'stale-version' };
            }
            return _parseSignRow(updated[0]);
        }
        return elig;
    }

    return { run, get, all, initDatabase, createInitialAdmin, getUserByUsername, getUserBySignatureCode, getUserById, createUser, updateLastLogin, getAllUsers, getUsersList, countUsers, toggleUserActive, changePassword, setPasswordTemp, updateUserProfile, updateUserProfileById, changeRole, logAccess, logAuditEvent, getAuditLog, verifyAuditChain, blacklistToken, isTokenBlacklisted, cleanExpiredBlacklist, registerDevice, isDeviceTrusted, getUserDevices, getAllDevices, countDevices, countUserDevices, setDeviceTrust, removeDevice, save2FASecret, get2FASecret, enable2FA, disable2FA, has2FAEnabled, createSnapshot, getSnapshots, getSnapshotById, createSignSession, getSignSession, listSignSessions, signSessionStep, importSignSession };}

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

    async function getAllUsers(limit = 50, offset = 0) { return state.users.map(({ password, ...u }) => u).slice(offset, offset + limit); }

    // FASE 2 — mirror local (sin password, totp_secret ni signature_code)
    async function getUsersList() {
        return state.users
            .filter(function(u) { return u.active === 1; })
            .map(function(u) { return { username: u.username, nombre: u.nombre, apellido: u.apellido, cargo: u.cargo, role: u.role }; })
            .sort(function(a, b) { return a.username < b.username ? -1 : 1; });
    }
    async function countUsers() { return state.users.length; }
    async function toggleUserActive(id, active) { const u = findById(id); if (u) { u.active = active; save(); } }

    async function changePassword(username, newPassword) {
        const u = findUser(username);
        if (!u) return;
        u.password = await bcrypt.hash(newPassword, 12);
        u.password_temp = 0;
        save();
    }

    async function setPasswordTemp(username, value) { const u = findUser(username); if (u) { u.password_temp = value ? 1 : 0; save(); } }

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

    // OPT-6: offset (el endpoint ya enviaba offset y el store local lo ignoraba)
    async function getAuditLog(limit = 100, offset = 0) {
        limit = Math.min(Math.max(parseInt(limit) || 100, 1), 500);
        offset = Math.max(parseInt(offset) || 0, 0);
        return state.audit_log.slice().reverse().slice(offset, offset + limit);
    }

    // OPT-6: mirror de la impl PG — ventana con eslabón ancla
    async function verifyAuditChain(options = {}) {
        const tail = Math.min(Math.max(parseInt(options.tail) || 0, 0), 5000);
        const sorted = [...state.audit_log].sort((a, b) => a.id - b.id);
        const total = sorted.length;
        let rows, expectedHash = null;
        if (tail > 0) {
            const raw = sorted.slice(-(tail + 1));
            if (raw.length > tail) {
                expectedHash = raw[0].row_hash; // ancla: hash real del predecesor
                rows = raw.slice(1);
            } else {
                rows = raw; // cubre desde el génesis
                expectedHash = null;
            }
        } else {
            rows = sorted;
            expectedHash = null;
        }
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
        const out = { valid: true, checked, lastHash: expectedHash };
        if (tail > 0) { out.partial = true; out.total = total; out.anchored = true; }
        return out;
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

    // OPT-6: paginación mirror de la impl PG
    function _pageDevices(list, limit, offset) {
        limit = Math.min(Math.max(parseInt(limit) || 100, 1), 500);
        offset = Math.max(parseInt(offset) || 0, 0);
        return list
            .sort(function(a, b) { return (b.trusted - a.trusted) || (new Date(b.last_seen) - new Date(a.last_seen)); })
            .slice(offset, offset + limit);
    }

    async function getUserDevices(username, limit = 100, offset = 0) {
        return _pageDevices(state.trusted_devices.filter(function(d) { return d.username === username; }), limit, offset);
    }

    async function getAllDevices(limit = 100, offset = 0) {
        return _pageDevices(state.trusted_devices.slice(), limit, offset);
    }

    async function countDevices() { return state.trusted_devices.length; }

    async function countUserDevices(username) {
        return state.trusted_devices.filter(function(d) { return d.username === username; }).length;
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
        // Paridad con PG: auditar vía logAuditEvent para no romper verifyAuditChain
        // (antes se insertaba fila manual con prev_hash/row_hash nulos → cadena inválida).
        await logAuditEvent({ username: username, action: 'SNAPSHOT_CREATE', success: 1,
            ip: ip||'', userAgent: userAgent||'', module: 'DATA',
            details: JSON.stringify({ snapshotId: snapshot.id, sheetId: sheetId||null }) });
        return { ok: true, id: snapshot.id };
    }

    async function getSnapshots(username, limit, offset) {
        limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
        offset = Math.max(parseInt(offset) || 0, 0);
        var list = state.data_snapshots.filter(function(s) { return username ? s.username === username : true; });
        return list.sort(function(a, b) { return b.id - a.id; }).slice(offset, offset + limit);
    }

    async function getSnapshotById(id) {
        return state.data_snapshots.find(function(s) { return s.id === id; }) || null;
    }

    // FASE 3 — mirror local de importSignSession
    async function importSignSession({ name, html, createdBy, assignedReviewer, assignedApprover, preparedSignature, embedded }) {
        const emb = embedded || {};
        if ((emb.reviewed && emb.reviewed.signed) || (emb.approved && emb.approved.signed)) {
            return { error: 'El archivo ya trae firmas de revisión/aprobación no verificables; reinícialas o publícalo como respaldo', code: 'advanced-signatures' };
        }
        const verifiedName = String((preparedSignature && preparedSignature.nombre) || '').trim().toLowerCase();
        const embeddedName = String((emb.prepared && emb.prepared.name) || '').trim().toLowerCase();
        if (emb.prepared && emb.prepared.signed && embeddedName !== verifiedName) {
            return { error: 'El elaborador del archivo no coincide con tu identidad verificada', code: 'preparer-mismatch' };
        }
        return createSignSession({ name, html, createdBy, assignedReviewer, assignedApprover, preparedSignature });
    }

    // ── FASE 1 — Bandeja de firmas (local, mirror PG) ──────────
    if (!state.report_signatures) state.report_signatures = [];
    var _signIdCounter = state.report_signatures.length > 0
        ? Math.max.apply(null, state.report_signatures.map(function(s) { return s.id; })) + 1 : 1;

    function _localSignView(s) {
        return {
            id: s.id, doc_hash: s.doc_hash, name: s.name, html: s.html,
            signatures: s.signatures, status: s.status, version: s.version,
            created_by: s.created_by,
            assigned_reviewer: s.assigned_reviewer, assigned_approver: s.assigned_approver,
            created_at: s.created_at, updated_at: s.updated_at,
            next_role: _signNextRole(s.signatures),
        };
    }

    async function createSignSession({ name, html, createdBy, assignedReviewer, assignedApprover, preparedSignature }) {
        // El creador firma prepared al publicar (mirror PG).
        var sigs = { prepared: Object.assign({ signed: true, username: createdBy }, preparedSignature || {}) };
        var session = {
            id: _signIdCounter++, doc_hash: _signDocHash(html), name: name, html: html,
            signatures: sigs, status: _signStatusFor(sigs), version: 1,
            created_by: createdBy,
            assigned_reviewer: assignedReviewer || null, assigned_approver: assignedApprover || null,
            created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        };
        state.report_signatures.push(session);
        save();
        return _localSignView(session);
    }

    async function getSignSession(id) {
        var s = state.report_signatures.find(function(x) { return x.id === id; }) || null;
        return s ? _localSignView(s) : null;
    }

    async function listSignSessions({ scope, username, limit = 50, offset = 0 }) {
        limit = Math.min(Math.max(parseInt(limit) || 50, 1), 200);
        offset = Math.max(parseInt(offset) || 0, 0);
        var list = state.report_signatures.filter(function(s) {
            if (scope === 'mine') return s.created_by === username;
            return s.status !== 'complete';
        });
        return list.sort(function(a, b) { return b.id - a.id; })
            .slice(offset, offset + limit).map(_localSignView);
    }

    async function signSessionStep({ id, role, username, userRole, signature, expectedVersion, newAssignee }) {
        var s = state.report_signatures.find(function(x) { return x.id === id; });
        if (!s) return { error: 'Sesión no encontrada', code: 'not-found' };
        if (s.version !== expectedVersion) {
            return { error: 'Otro usuario firmó entremedio; recarga e intenta de nuevo', code: 'stale-version' };
        }
        var elig = _signEligibility(
            { signatures: s.signatures, assigned_reviewer: s.assigned_reviewer, assigned_approver: s.assigned_approver },
            role, { username: username, role: userRole }
        );
        if (elig.error) return elig;
        s.signatures[role] = Object.assign({ signed: true, username: username, signed_at: new Date().toISOString() }, signature || {});
        if (newAssignee !== undefined && newAssignee !== null && newAssignee !== '') {
            if (role === 'prepared') s.assigned_reviewer = newAssignee;
            else s.assigned_approver = newAssignee;
        }
        s.status = _signStatusFor(s.signatures);
        s.version += 1;
        s.updated_at = new Date().toISOString();
        save();
        return _localSignView(s);
    }

    return { run, get, all, initDatabase, createInitialAdmin, getUserByUsername, getUserBySignatureCode, getUserById, createUser, updateLastLogin, getAllUsers, getUsersList, countUsers, toggleUserActive, changePassword, setPasswordTemp, updateUserProfile, updateUserProfileById, changeRole, logAccess, logAuditEvent, getAuditLog, verifyAuditChain, blacklistToken, isTokenBlacklisted, cleanExpiredBlacklist, registerDevice, isDeviceTrusted, getUserDevices, getAllDevices, countDevices, countUserDevices, setDeviceTrust, removeDevice, save2FASecret, get2FASecret, enable2FA, disable2FA, has2FAEnabled, createSnapshot, getSnapshots, getSnapshotById, createSignSession, getSignSession, listSignSessions, signSessionStep, importSignSession };}

const impl = build();
module.exports = {
    initDatabase:        (...a) => impl.initDatabase(...a),
    createInitialAdmin:  (...a) => impl.createInitialAdmin(...a),
    getUserByUsername:   (...a) => impl.getUserByUsername(...a),
    getUserBySignatureCode: (...a) => impl.getUserBySignatureCode(...a),
    createUser:          (...a) => impl.createUser(...a),
    updateLastLogin:     (...a) => impl.updateLastLogin(...a),
    getAllUsers:         (...a) => impl.getAllUsers(...a),
    getUsersList:        (...a) => impl.getUsersList(...a),
    countUsers:         (...a) => impl.countUsers(...a),
    toggleUserActive:    (...a) => impl.toggleUserActive(...a),
    changePassword:      (...a) => impl.changePassword(...a),
    setPasswordTemp:     (...a) => impl.setPasswordTemp(...a),
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
    countDevices:         (...a) => impl.countDevices(...a),
    countUserDevices:     (...a) => impl.countUserDevices(...a),
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
    createSignSession:    (...a) => impl.createSignSession(...a),
    getSignSession:       (...a) => impl.getSignSession(...a),
    listSignSessions:     (...a) => impl.listSignSessions(...a),
    signSessionStep:      (...a) => impl.signSessionStep(...a),
    importSignSession:     (...a) => impl.importSignSession(...a),
    getSnapshotById:      (...a) => impl.getSnapshotById(...a),
    run:                  (...a) => impl.run(...a),
    all:                 (...a) => impl.all(...a),
    get:                 (...a) => impl.get(...a),
};
