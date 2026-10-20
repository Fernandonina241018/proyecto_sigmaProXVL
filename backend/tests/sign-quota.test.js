// Cupo de reportes en firma (Paso 2 del plan de control). Store local.
// node --test tests/sign-quota.test.js
const { test, before } = require('node:test');
const assert = require('node:assert/strict');

delete process.env.DATABASE_URL;
const db = require('../database');

const HTML = '<html><body>quota</body></html>';
let firstId = null;

async function mk(name, createdBy) {
  return db.createSignSession({
    name, html: HTML, createdBy,
    assignedReviewer: createdBy + '_rev', assignedApprover: createdBy + '_sup',
    preparedSignature: { nombre: 'A', cargo: '', firma: '', fecha: '2026-01-01' },
  });
}

before(async () => {
  await db.createUser({ username: 'q_ana', password: 'x', role: 'analista' });
  await db.createUser({ username: 'q_ana_rev', password: 'x', role: 'analista' });
  await db.createUser({ username: 'q_ana_sup', password: 'x', role: 'supervisor' });
  await db.createUser({ username: 'q_otro', password: 'x', role: 'analista' });
});

test('signQuotaInfo: solo abiertas del creador, más antigua primero', async () => {
  const a1 = await mk('Q-1', 'q_ana');
  await mk('Q-2', 'q_ana');
  await mk('Q-X', 'q_otro');
  firstId = a1.id;
  const open = await db.signQuotaInfo('q_ana');
  assert.deepEqual(open.map((o) => o.name), ['Q-1', 'Q-2']);
  assert.equal((await db.signQuotaInfo('q_otro')).length, 1);
});

test('sin allowOpen NO se puede cancelar una abierta (creador)', async () => {
  const r = await db.deleteSignSession({ id: firstId, username: 'q_ana', userRole: 'analista', reason: 'x' });
  assert.equal(r.code, 'not-deletable');
});

test('allowOpen cancela la más antigua con motivo (borrado suave)', async () => {
  const r = await db.deleteSignSession({
    id: firstId, username: 'q_ana', userRole: 'analista',
    reason: 'Cancelada por cupo (10 en firma) — autorizada al publicar otro reporte',
    allowOpen: true,
  });
  assert.ok(!r.error, JSON.stringify(r));
  assert.equal(r.status, 'deleted');
  assert.match(String(r.deleted_reason), /cupo/);
  assert.equal((await db.signQuotaInfo('q_ana')).length, 1);
  // ya eliminada: no se puede volver a borrar
  const again = await db.deleteSignSession({ id: firstId, username: 'q_ana', userRole: 'analista', reason: 'x', allowOpen: true });
  assert.equal(again.code, 'not-deletable');
});

test('firmadas no cuentan para el cupo', async () => {
  const open = await db.signQuotaInfo('q_ana');
  const target = open[0];
  const s1 = await db.getSignSession(target.id);
  await db.signSessionStep({ id: target.id, role: 'reviewed', username: 'q_ana_rev', userRole: 'analista', signature: {}, expectedVersion: s1.version });
  const s2 = await db.getSignSession(target.id);
  await db.signSessionStep({ id: target.id, role: 'approved', username: 'q_ana_sup', userRole: 'supervisor', signature: {}, expectedVersion: s2.version });
  assert.equal((await db.getSignSession(target.id)).status, 'complete');
  assert.equal((await db.signQuotaInfo('q_ana')).length, 0);
});

test('admin puede borrar una abierta ajena (sin allowOpen)', async () => {
  const o = await mk('Q-3', 'q_otro');
  const r = await db.deleteSignSession({ id: o.id, username: 'admin', userRole: 'admin', reason: 'limpieza admin' });
  assert.ok(!r.error, JSON.stringify(r));
  assert.equal(r.status, 'deleted');
});

test('scope all (vista admin): lista todo, incluidos ajenos y lápidas, en orden desc', async () => {
  const all = await db.listSignSessions({ scope: 'all', limit: 200, offset: 0 });
  assert.ok(all.some((s) => s.created_by === 'q_otro'), 'incluye de otros usuarios');
  assert.ok(all.some((s) => s.status === 'deleted'), 'incluye canceladas');
  const ids = all.map((s) => s.id);
  assert.deepEqual(ids, ids.slice().sort((a, b) => b - a));
});
