// FASE 1 — Bandeja de firmas: tests sobre store local (sin DATABASE_URL).
// node --test tests/sign-sessions.test.js
// NOTA: backend/data.json es git-ignored; el estado persiste entre tests
// del archivo (orden intencional).
const { test, before } = require('node:test');
const assert = require('node:assert/strict');

delete process.env.DATABASE_URL;
const db = require('../database');

const HTML = '<html><body>reporte</body></html>';
const crypto = require('crypto');
const expectedHash = crypto.createHash('sha256').update(HTML, 'utf8').digest('hex');

let S1;

before(async () => {
  await db.createUser({ username: 'ana_prep', password: 'x', role: 'analista' });
  await db.createUser({ username: 'beto_rev', password: 'x', role: 'analista' });
  await db.createUser({ username: 'carla_sup', password: 'x', role: 'supervisor' });
  await db.createUser({ username: 'dora_otro', password: 'x', role: 'analista' });
});

test('crear sesión firma prepared y calcula doc_hash', async () => {
  S1 = await db.createSignSession({
    name: 'RPT-1', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana', cargo: '', firma: '', fecha: '2026-01-01' },
  });
  assert.equal(S1.signatures.prepared.signed, true);
  assert.equal(S1.status, 'partial');
  assert.equal(S1.next_role, 'reviewed');
  assert.equal(S1.doc_hash, expectedHash);
  assert.equal(S1.version, 1);
});

test('fuera de orden: approved antes de reviewed → 422', async () => {
  const r = await db.signSessionStep({
    id: S1.id, role: 'approved', username: 'carla_sup', userRole: 'supervisor',
    signature: {}, expectedVersion: 1,
  });
  assert.equal(r.code, 'out-of-order');
});

test('misma persona no puede revisar lo que preparó → 422', async () => {
  const r = await db.signSessionStep({
    id: S1.id, role: 'reviewed', username: 'ana_prep', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  assert.equal(r.code, 'same-person');
});

test('revisor no asignado → 422', async () => {
  const r = await db.signSessionStep({
    id: S1.id, role: 'reviewed', username: 'dora_otro', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  assert.equal(r.code, 'wrong-assignee');
});

test('rol no aprobador intenta aprobar (en su turno) → 422', async () => {
  // Avanzo S1 con el revisor correcto para llegar a approved
  const ok = await db.signSessionStep({
    id: S1.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: { nombre: 'Beto' }, expectedVersion: 1,
  });
  assert.equal(ok.next_role, 'approved');
  assert.equal(ok.version, 2);
  const r = await db.signSessionStep({
    id: ok.id, role: 'approved', username: 'dora_otro', userRole: 'analista',
    signature: {}, expectedVersion: 2,
  });
  assert.equal(r.code, 'wrong-role');
});

test('versión vieja → stale-version (concurrencia)', async () => {
  const r = await db.signSessionStep({
    id: S1.id, role: 'approved', username: 'carla_sup', userRole: 'supervisor',
    signature: {}, expectedVersion: 1, // va en 2
  });
  assert.equal(r.code, 'stale-version');
});

test('flujo completo termina en complete', async () => {
  const done = await db.signSessionStep({
    id: S1.id, role: 'approved', username: 'carla_sup', userRole: 'supervisor',
    signature: { nombre: 'Carla' }, expectedVersion: 2,
  });
  assert.equal(done.status, 'complete');
  assert.equal(done.next_role, null);
  assert.equal(done.version, 3);
  const closed = await db.signSessionStep({
    id: S1.id, role: 'approved', username: 'carla_sup', userRole: 'supervisor',
    signature: {}, expectedVersion: 3,
  });
  assert.equal(closed.code, 'complete');
});

test('admin firma todo sin restricción de rol ni asignado', async () => {
  await db.createUser({ username: 'root_adm', password: 'x', role: 'admin' });
  const s = await db.createSignSession({
    name: 'RPT-ADM', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  const r1 = await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'root_adm', userRole: 'admin',
    signature: {}, expectedVersion: 1,
  });
  assert.equal(r1.next_role, 'approved'); // admin salta assigned_reviewer
  const r2 = await db.signSessionStep({
    id: s.id, role: 'approved', username: 'root_adm', userRole: 'admin',
    signature: {}, expectedVersion: 2,
  });
  assert.equal(r2.status, 'complete'); // admin aprueba sin ser supervisor
});

test('ni el admin puede revisar lo que preparó (independencia)', async () => {
  const s = await db.createSignSession({
    name: 'RPT-ADM2', html: HTML, createdBy: 'root_adm',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Root' },
  });
  const r = await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'root_adm', userRole: 'admin',
    signature: {}, expectedVersion: 1,
  });
  assert.equal(r.code, 'same-person');
});

test('listados mine/pending', async () => {
  const mine = await db.listSignSessions({ scope: 'mine', username: 'ana_prep' });
  assert.ok(mine.some((s) => s.id === S1.id));
  assert.ok(mine.every((s) => s.created_by === 'ana_prep'));
  const pending = await db.listSignSessions({ scope: 'pending', username: 'x' });
  assert.ok(pending.every((s) => s.status !== 'complete'));
});

test('cadena de auditoría intacta tras sesiones', async () => {
  const v = await db.verifyAuditChain();
  assert.equal(v.valid, true);
});
