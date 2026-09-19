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

test('CONTRATO: getSignSession devuelve signatures parseado + next_role', async () => {
  // Regresión del bug Supabase: la fila PG trae signatures TEXT; si no se
  // parsea, el frontend ve todo vacío (solo fallaba contra PG real).
  const g = await db.getSignSession(S1.id);
  assert.equal(typeof g.signatures, 'object');
  assert.equal(g.signatures.prepared.signed, true);
  assert.equal(g.signatures.prepared.username, 'ana_prep');
  assert.equal(g.next_role, 'reviewed');
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

// ── Dismiss (quitar de mis pendientes) ──
test('dismiss oculta solo para quien marcó', async () => {
  const s = await db.createSignSession({
    name: 'RPT-DISM', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  const d = await db.dismissSignSession({ id: s.id, username: 'beto_rev' });
  assert.deepEqual(d.dismissed_by, ['beto_rev']);
  // Idempotente: doble dismiss no duplica
  const d2 = await db.dismissSignSession({ id: s.id, username: 'beto_rev' });
  assert.deepEqual(d2.dismissed_by, ['beto_rev']);
  const pb = await db.listSignSessions({ scope: 'pending', username: 'beto_rev' });
  assert.ok(!pb.some((x) => x.id === s.id), 'fuera de pendientes de beto');
  const pc = await db.listSignSessions({ scope: 'pending', username: 'carla_sup' });
  assert.ok(pc.some((x) => x.id === s.id), 'sigue visible para carla');
  const mine = await db.listSignSessions({ scope: 'mine', username: 'ana_prep' });
  assert.ok(mine.some((x) => x.id === s.id), 'creadora la sigue viendo');
});

test('dismiss en completa/rechazada → 422', async () => {
  const c = await db.dismissSignSession({ id: S1.id, username: 'ana_prep' });
  assert.equal(c.code, 'not-pending'); // S1 está complete
});

// ── Unsign (solo último + solo quien firmó) ──
test('firmante reinicia su última firma y vuelve el estado', async () => {
  const s = await db.createSignSession({
    name: 'RPT-UNS', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  // prepared ya no es último → 422
  const nl = await db.unsignSessionStep({
    id: s.id, role: 'prepared', username: 'ana_prep', userRole: 'analista', expectedVersion: 2,
  });
  assert.equal(nl.code, 'not-last');
  // revisor reinicia lo suyo → vuelve a reviewed pendiente
  const ok = await db.unsignSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista', expectedVersion: 2,
  });
  assert.equal(ok.status, 'partial');
  assert.equal(ok.next_role, 'reviewed');
  assert.equal(ok.version, 3);
  assert.equal(ok.signatures.reviewed, undefined);
  assert.equal(ok.signatures.prepared.username, 'ana_prep');
});

test('ajeno no reinicia; admin sí', async () => {
  const s = await db.createSignSession({
    name: 'RPT-UNS2', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  const w = await db.unsignSessionStep({
    id: s.id, role: 'prepared', username: 'dora_otro', userRole: 'analista', expectedVersion: 1,
  });
  assert.equal(w.code, 'wrong-person');
  const a = await db.unsignSessionStep({
    id: s.id, role: 'prepared', username: 'root_adm', userRole: 'admin', expectedVersion: 1,
  });
  assert.equal(a.next_role, 'prepared');
  assert.equal(a.signatures.prepared, undefined);
});

test('admin reinicia rol anterior con cascada (apertura total)', async () => {
  const s = await db.createSignSession({
    name: 'RPT-ADMCASC', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  await db.signSessionStep({
    id: s.id, role: 'approved', username: 'carla_sup', userRole: 'supervisor',
    signature: {}, expectedVersion: 2,
  });
  const r = await db.unsignSessionStep({
    id: s.id, role: 'prepared', username: 'root_adm', userRole: 'admin', expectedVersion: 3,
  });
  assert.deepEqual(r.admin_cascade, ['reviewed', 'approved']);
  assert.equal(r.status, 'pending');
  assert.equal(r.next_role, 'prepared');
  assert.equal(r.signatures.reviewed, undefined);
  assert.equal(r.signatures.approved, undefined);
  assert.equal(r.version, 4);
});

test('admin reinicia último sin cascada', async () => {
  const s = await db.createSignSession({
    name: 'RPT-ADMNL', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  const r = await db.unsignSessionStep({
    id: s.id, role: 'prepared', username: 'root_adm', userRole: 'admin', expectedVersion: 1,
  });
  assert.equal(r.admin_cascade, undefined);
  assert.equal(r.next_role, 'prepared');
});

test('unsign con versión vieja → stale-version', async () => {
  const s = await db.createSignSession({
    name: 'RPT-UNS3', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  const r = await db.unsignSessionStep({
    id: s.id, role: 'prepared', username: 'ana_prep', userRole: 'analista', expectedVersion: 99,
  });
  assert.equal(r.code, 'stale-version');
});

// ── Borrado de rechazadas ──
test('creador elimina rechazada; desaparece', async () => {
  const s = await db.createSignSession({
    name: 'RPT-DEL', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  await db.rejectSignSession({ id: s.id, username: 'beto_rev', userRole: 'analista', reason: 'x' });
  const d = await db.deleteSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista' });
  assert.equal(d.ok, true);
  assert.equal(await db.getSignSession(s.id), null);
});

test('no se puede eliminar pendiente, completa ni ajena', async () => {
  const s = await db.createSignSession({
    name: 'RPT-DEL2', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  const p = await db.deleteSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista' });
  assert.equal(p.code, 'not-rejected');
  const c = await db.deleteSignSession({ id: S1.id, username: 'ana_prep', userRole: 'analista' });
  assert.equal(c.code, 'not-rejected'); // S1 está complete
  await db.rejectSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: '' });
  const f = await db.deleteSignSession({ id: s.id, username: 'dora_otro', userRole: 'analista' });
  assert.equal(f.code, 'forbidden');
  const a = await db.deleteSignSession({ id: s.id, username: 'root_adm', userRole: 'admin' });
  assert.equal(a.ok, true);
});

// ── Rechazo ──
test('asignado rechaza con motivo y sale de pendientes', async () => {
  const s = await db.createSignSession({
    name: 'RPT-REJ', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  const r = await db.rejectSignSession({ id: s.id, username: 'beto_rev', userRole: 'analista', reason: 'Datos mal' });
  assert.equal(r.status, 'rejected');
  assert.equal(r.rejected_by, 'beto_rev');
  assert.equal(r.rejected_reason, 'Datos mal');
  const pending = await db.listSignSessions({ scope: 'pending', username: 'x' });
  assert.ok(!pending.some((x) => x.id === s.id), 'fuera de pendientes');
  const mine = await db.listSignSessions({ scope: 'mine', username: 'ana_prep' });
  assert.ok(mine.some((x) => x.id === s.id && x.status === 'rejected'), 'visible como rechazada en Mías');
});

test('rechazada ya no se puede firmar', async () => {
  const s = await db.createSignSession({
    name: 'RPT-REJ2', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  await db.rejectSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: '' });
  const r = await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 2,
  });
  assert.equal(r.code, 'rejected');
});

test('no involucrado no puede rechazar; completa tampoco', async () => {
  const s = await db.createSignSession({
    name: 'RPT-REJ3', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  const f = await db.rejectSignSession({ id: s.id, username: 'dora_otro', userRole: 'analista', reason: '' });
  assert.equal(f.code, 'forbidden');
  const c = await db.rejectSignSession({ id: S1.id, username: 'ana_prep', userRole: 'analista', reason: '' });
  assert.equal(c.code, 'complete'); // S1 quedó complete en tests previos
});

// ── FASE 3: import guards ──
function impBlock(role, name) {
  const v = name || '—';
  return (
    `<div data-signature-role="${role}">` +
    `<span data-signature-field="name" data-signature-role="${role}">${v}</span>` +
    `</div>`
  );
}
const impHtml = (prep, rev, app) =>
  `<html><body>${impBlock('prepared', prep)}${impBlock('reviewed', rev)}${impBlock('approved', app)}</body></html>`;

test('import rechaza archivo con reviewed firmado', async () => {
  const r = await db.importSignSession({
    name: 'IMP-1', html: impHtml('Ana', 'Beto', ''), createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' }, embedded: { prepared: { signed: true, name: 'Ana' }, reviewed: { signed: true, name: 'Beto' }, approved: { signed: false, name: '' } },
  });
  assert.equal(r.code, 'advanced-signatures');
});

test('import rechaza preparador que no coincide', async () => {
  const r = await db.importSignSession({
    name: 'IMP-2', html: impHtml('Otra Persona', '', ''), createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' }, embedded: { prepared: { signed: true, name: 'Otra Persona' }, reviewed: { signed: false }, approved: { signed: false } },
  });
  assert.equal(r.code, 'preparer-mismatch');
});

test('import acepta archivo limpio y firma prepared', async () => {
  const r = await db.importSignSession({
    name: 'IMP-3', html: impHtml('', '', ''), createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' }, embedded: { prepared: { signed: false }, reviewed: { signed: false }, approved: { signed: false } },
  });
  assert.equal(r.status, 'partial');
  assert.equal(r.next_role, 'reviewed');
  assert.equal(r.signatures.prepared.username, 'ana_prep');
  assert.equal(r.assigned_reviewer, 'beto_rev');
});
