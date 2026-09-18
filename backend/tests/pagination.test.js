// OPT-6: tests de paginación sobre el store local (sin DATABASE_URL).
// Se ejecutan con: node --test tests/pagination.test.js
// NOTA: usa backend/data.json (git-ignored); el estado persiste entre tests
// del archivo, por eso el orden importa: auditoría → snapshots → devices.
const { test, before } = require('node:test');
const assert = require('node:assert/strict');

delete process.env.DATABASE_URL;
const db = require('../database');

async function auditEvent(i) {
  await db.logAuditEvent({
    username: 'tester', action: 'TEST_' + i, success: 1,
    ip: '127.0.0.1', userAgent: 'test', module: 'TEST', details: null, durationMs: null,
  });
}

before(async () => {
  for (let i = 1; i <= 5; i++) await auditEvent(i);
});

test('verifyAuditChain completa sigue válida (sin tail)', async () => {
  const r = await db.verifyAuditChain();
  assert.equal(r.valid, true);
  assert.equal(r.checked, 5);
  assert.equal(r.partial, undefined);
});

test('verifyAuditChain con tail verifica ventana y reporta partial', async () => {
  const r = await db.verifyAuditChain({ tail: 2 });
  assert.equal(r.valid, true);
  assert.equal(r.checked, 2);
  assert.equal(r.partial, true);
  assert.equal(r.total, 5);
  // Anclada al predecesor: el primer eslabón de la ventana se verifica
  // contra el row_hash real del anterior (no contra null).
  assert.equal(r.anchored, true);
});

test('verifyAuditChain con tail mayor al total queda anchored', async () => {
  const r = await db.verifyAuditChain({ tail: 50 });
  assert.equal(r.valid, true);
  assert.equal(r.checked, 5);
  assert.equal(r.partial, true);
  assert.equal(r.anchored, true);
});

test('getAuditLog respeta limit y offset (antes offset se ignoraba)', async () => {
  await auditEvent(6);
  await auditEvent(7);
  const page1 = await db.getAuditLog(3, 0);
  const page2 = await db.getAuditLog(3, 3);
  assert.equal(page1.length, 3);
  assert.equal(page2.length, 3);
  assert.equal(page1[0].action, 'TEST_7'); // DESC: más reciente primero
  assert.equal(page2[0].action, 'TEST_4');
  const ids1 = new Set(page1.map((r) => r.id));
  for (const r of page2) assert.ok(!ids1.has(r.id), 'páginas sin solape');
});

test('snapshots: limit/offset + cadena intacta tras create', async () => {
  for (let i = 1; i <= 5; i++) {
    await db.createSnapshot({
      username: 'u1', sheetId: 's1', dataHash: 'h' + i, snapshotJson: '{}',
      sourceFile: 'f.csv', rowCount: 10, colCount: 2, checksum: 'c',
      ip: '', userAgent: '',
    });
  }
  const p1 = await db.getSnapshots('u1', 2, 0);
  const p2 = await db.getSnapshots('u1', 2, 2);
  const p3 = await db.getSnapshots('u1', 2, 4);
  assert.equal(p1.length, 2);
  assert.equal(p2.length, 2);
  assert.equal(p3.length, 1);
  assert.ok(p1[0].id > p1[1].id, 'orden DESC');
  // createSnapshot ya no rompe la cadena (regression: filas manuales con hash nulo)
  const v = await db.verifyAuditChain();
  assert.equal(v.valid, true);
});

test('devices: limit/offset + conteos', async () => {
  for (let i = 1; i <= 5; i++) {
    await db.registerDevice('userA', 'fpA' + i, { device_name: 'd' + i });
  }
  for (let i = 1; i <= 3; i++) {
    await db.registerDevice('userB', 'fpB' + i, { device_name: 'e' + i });
  }
  assert.equal(await db.countDevices(), 8);
  assert.equal(await db.countUserDevices('userA'), 5);
  assert.equal(await db.countUserDevices('userB'), 3);
  const all1 = await db.getAllDevices(5, 0);
  const all2 = await db.getAllDevices(5, 5);
  assert.equal(all1.length, 5);
  assert.equal(all2.length, 3);
  const ua1 = await db.getUserDevices('userA', 2, 0);
  const ua3 = await db.getUserDevices('userA', 2, 4);
  assert.equal(ua1.length, 2);
  assert.equal(ua3.length, 1);
  for (const d of ua1.concat(ua3)) assert.equal(d.username, 'userA');
});

test('REGRESIÓN FASE 4: logAccess con booleano no rompe la cadena', async () => {
  // Al final: inserta filas sin desplazar los conteos de tests anteriores.
  await db.logAccess({ username: 'u', action: 'LOGIN', success: true, ip: '1', userAgent: 't' });
  await db.logAccess({ username: 'u', action: 'LOGIN', success: false, ip: '1', userAgent: 't' });
  const v = await db.verifyAuditChain();
  assert.equal(v.valid, true);
});
