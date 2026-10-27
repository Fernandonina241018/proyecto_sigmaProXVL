// Expiración de abiertas olvidadas (Paso 3 plan control reportes). Store local.
// node --test tests/purge-expire.test.js
const { test, before } = require('node:test');
const assert = require('node:assert/strict');

delete process.env.DATABASE_URL;
const db = require('./_db-fixture');

const HTML = '<html><body>expire</body></html>';

async function mk(name, createdBy) {
  return db.createSignSession({
    name, html: HTML, createdBy,
    assignedReviewer: createdBy + '_rev', assignedApprover: null,
    preparedSignature: { nombre: 'A', cargo: '', firma: '', fecha: '2026-01-01' },
  });
}

before(async () => {
  await db.createUser({ username: 'exp_ana', password: 'x', role: 'analista' });
});

test('abierta vieja: dryRun la lista sin tocar; real la cancela con motivo', async () => {
  const s = await mk('EXP-1', 'exp_ana');
  const future = Date.now() + 91 * 86400000;
  const dry = await db.purgeSignSessions({ dryRun: true, _now: future });
  assert.ok(dry.expiredCandidates.some((c) => c.id === s.id));
  assert.equal((await db.getSignSession(s.id)).status, 'partial');
  const real = await db.purgeSignSessions({ dryRun: false, _now: future });
  assert.ok(real.expired.some((c) => c.id === s.id));
  const g = await db.getSignSession(s.id);
  assert.equal(g.status, 'deleted');
  assert.equal(g.deleted_by, 'system');
  assert.match(String(g.deleted_reason), /Expirada por antigüedad/);
});

test('abierta reciente (<90 días): intacta', async () => {
  const s = await mk('EXP-2', 'exp_ana');
  const soon = Date.now() + 30 * 86400000;
  const real = await db.purgeSignSessions({ dryRun: false, _now: soon });
  assert.ok(!(real.expired || []).some((c) => c.id === s.id));
  assert.equal((await db.getSignSession(s.id)).status, 'partial');
});

test('expireOpenDays configurable: con plazo mayor no expira', async () => {
  const s = await mk('EXP-3', 'exp_ana');
  const future = Date.now() + 91 * 86400000;
  const real = await db.purgeSignSessions({ dryRun: false, expireOpenDays: 365, _now: future });
  assert.ok(!(real.expired || []).some((c) => c.id === s.id));
  assert.equal((await db.getSignSession(s.id)).status, 'partial');
});
