// Cadena de auditoría: concurrencia + módulo LOGIN.
// El store local usa un mutex de promesa; en PG el equivalente es
// pg_advisory_xact_lock dentro de la transacción (misma garantía).
const { test } = require('node:test');
const assert = require('node:assert/strict');

delete process.env.DATABASE_URL;
const db = require('./_db-fixture');

test('30 inserts concurrentes mantienen la cadena válida', async () => {
    const before = await db.verifyAuditChain();
    assert.equal(before.valid, true);

    const jobs = [];
    for (let i = 0; i < 30; i++) {
        jobs.push(db.logAuditEvent({
            username: 'conc_user',
            action: 'TEST:CONCURRENT',
            success: true,
            ip: '127.0.0.1',
            userAgent: 'node-test',
            module: 'SYSTEM',
            details: { i },
            durationMs: i,
        }));
    }
    await Promise.all(jobs);

    const after = await db.verifyAuditChain();
    assert.equal(after.valid, true, 'la cadena no debe bifurcarse');

    const rows = await db.getAuditLog(200, 0);
    const conc = rows.filter((r) => r.action === 'TEST:CONCURRENT');
    assert.equal(conc.length, 30);
    // Sin huecos ni duplicados de prev_hash: la cadena es lineal
    const ids = conc.map((r) => r.id).sort((a, b) => a - b);
    assert.equal(new Set(ids).size, 30);
});

test('logAccess registra module LOGIN y sigue verificando', async () => {
    await db.logAccess({
        username: 'login_user',
        action: 'LOGIN_SUCCESS',
        success: true,
        ip: '127.0.0.1',
        userAgent: 'node-test',
    });
    const rows = await db.getAuditLog(10, 0);
    const row = rows.find((r) => r.username === 'login_user');
    assert.ok(row, 'debe existir el evento de login');
    assert.equal(row.module, 'LOGIN');

    const check = await db.verifyAuditChain();
    assert.equal(check.valid, true);
});
