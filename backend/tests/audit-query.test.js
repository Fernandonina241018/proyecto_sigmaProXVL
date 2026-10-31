// Filtros, conteo y KPIs de auditoría en el store local (paridad con PG).
const { test, before } = require('node:test');
const assert = require('node:assert/strict');

delete process.env.DATABASE_URL;
const db = require('./_db-fixture');

const base = { ip: '127.0.0.1', userAgent: 'node-test' };

before(async () => {
    await db.logAccess({ username: 'alice', action: 'LOGIN', success: true, ...base });
    await db.logAuditEvent({ username: 'alice', action: 'DATASET:LOAD', success: true, module: 'DATOS', details: { rows: 5 }, durationMs: 12, ...base });
    await db.logAuditEvent({ username: 'bob', action: 'CHART:CREATE', success: true, module: 'GRAFICOS', details: { chartType: 'barras' }, durationMs: 30, ...base });
    await db.logAuditEvent({ username: 'bob', action: 'REPORT:GENERATE', success: false, module: 'REPORTES', details: { error: 'boom' }, durationMs: 200, ...base });
});

test('getAuditLog filtra por módulo, acción, usuario y resultado', async () => {
    assert.equal((await db.getAuditLog(10, 0, { module: 'DATOS' })).length, 1);
    assert.equal((await db.getAuditLog(10, 0, { module: 'SYSTEM' })).length, 0);

    assert.equal((await db.getAuditLog(10, 0, { action: 'CHART' })).length, 1);
    assert.equal((await db.getAuditLog(10, 0, { username: 'ali' })).length, 2);
    assert.equal((await db.getAuditLog(10, 0, { success: '0' })).length, 1);
    assert.equal((await db.getAuditLog(10, 0, { success: '1' })).length, 3);

    // Combinado
    const both = await db.getAuditLog(10, 0, { username: 'bob', success: '1' });
    assert.equal(both.length, 1);
    assert.equal(both[0].action, 'CHART:CREATE');
});

test('getAuditLog filtra por rango de fechas', async () => {
    const today = new Date().toISOString().slice(0, 10);
    assert.equal((await db.getAuditLog(10, 0, { from: today })).length, 4);
    assert.equal((await db.getAuditLog(10, 0, { from: '2000-01-01', to: '2000-01-02' })).length, 0);
});

test('countAuditLog coincide con el listado filtrado', async () => {
    assert.equal(await db.countAuditLog({}), 4);
    assert.equal(await db.countAuditLog({ module: 'DATOS' }), 1);
    assert.equal(await db.countAuditLog({ username: 'bob' }), 2);
});

test('paginación: limit y offset sin romper el orden descendente', async () => {
    const all = await db.getAuditLog(10, 0, {});
    const page = await db.getAuditLog(2, 0, {});
    const page2 = await db.getAuditLog(2, 2, {});
    assert.equal(page.length, 2);
    assert.equal(page2.length, 2);
    assert.deepEqual(page.map((r) => r.id), all.slice(0, 2).map((r) => r.id));
    assert.deepEqual(page2.map((r) => r.id), all.slice(2, 4).map((r) => r.id));
});

test('getAuditStats devuelve totales, fallos, módulos y días', async () => {
    const s = await db.getAuditStats();
    assert.equal(s.total, 4);
    assert.equal(s.failures, 1);
    assert.equal(s.today, 4);
    assert.equal(s.week, 4);
    assert.ok(s.byModule.some((m) => m.module === 'DATOS' && m.n === 1));
    assert.ok(s.byModule.some((m) => m.module === 'LOGIN' && m.n === 1));
    const today = new Date().toISOString().slice(0, 10);
    assert.ok(s.byDay.some((d) => d.date === today && d.n === 4));
});

test('compatibilidad: getAuditLog(limit, offset) sigue funcionando', async () => {
    const rows = await db.getAuditLog(100, 0);
    assert.equal(rows.length, 4);
    const check = await db.verifyAuditChain();
    assert.equal(check.valid, true);
});
