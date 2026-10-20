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

// ── Segregación de funciones: sin auto-asignación al publicar ──
test('publicar con self-reviewer se rechaza', async () => {
  const r = await db.createSignSession({
    name: 'RPT-SELF-1', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'ana_prep', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana', cargo: '', firma: '', fecha: '2026-01-01' },
  });
  assert.equal(r.code, 'self-assignment');
  assert.match(r.error, /revisor/);
});

test('publicar con self-approver se rechaza', async () => {
  const r = await db.createSignSession({
    name: 'RPT-SELF-2', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'ana_prep',
    preparedSignature: { nombre: 'Ana', cargo: '', firma: '', fecha: '2026-01-01' },
  });
  assert.equal(r.code, 'self-assignment');
  assert.match(r.error, /aprobador/);
});

// ── LOTE E: códigos de firma únicos ──
test('isSignatureCodeTaken detecta duplicados', async () => {
  await db.createUser({ username: 'dup_a', password: 'x', role: 'analista', signatureCode: 'DUP-1' });
  await db.createUser({ username: 'dup_b', password: 'x', role: 'analista', signatureCode: 'DUP-2' });
  assert.equal(await db.isSignatureCodeTaken('DUP-1', 'otro'), true);
  assert.equal(await db.isSignatureCodeTaken('DUP-1', 'dup_a'), false); // propio excluido
  assert.equal(await db.isSignatureCodeTaken('LIBRE-9', 'x'), false);
  assert.equal(await db.isSignatureCodeTaken('', 'x'), false);
  assert.equal(await db.isSignatureCodeTaken(null, 'x'), false);
});

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

test('dismiss en completa/rechazada → 422; en lápida sí (limpia el aviso)', async () => {
  const s = await db.createSignSession({
    name: 'RPT-DISM2', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
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
  const c = await db.dismissSignSession({ id: s.id, username: 'ana_prep' });
  assert.equal(c.code, 'not-pending'); // completa no se descarta
  const d = await db.deleteSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'x' });
  assert.equal(d.status, 'deleted');
  const l = await db.dismissSignSession({ id: s.id, username: 'beto_rev' });
  assert.deepEqual(l.dismissed_by, ['beto_rev']); // la lápida sí se puede ocultar
  const pb = await db.listSignSessions({ scope: 'pending', username: 'beto_rev' });
  assert.ok(!pb.some((x) => x.id === s.id), 'aviso oculto tras dismiss');
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

test('admin reinicia rol anterior con cascada (solo en parcial, nunca en completa)', async () => {
  const s = await db.createSignSession({
    name: 'RPT-ADMCASC', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  // Sesión parcial (falta approved): admin reinicia prepared con cascada de reviewed
  const r = await db.unsignSessionStep({
    id: s.id, role: 'prepared', username: 'root_adm', userRole: 'admin', expectedVersion: 2,
  });
  assert.deepEqual(r.admin_cascade, ['reviewed']);
  assert.equal(r.status, 'pending');
  assert.equal(r.next_role, 'prepared');
  assert.equal(r.signatures.reviewed, undefined);
  assert.equal(r.version, 3);
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

test('completa y verificada: ni firmante ni admin pueden reiniciar', async () => {
  const s = await db.createSignSession({
    name: 'RPT-LOCKED', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  const full = await db.signSessionStep({
    id: s.id, role: 'approved', username: 'carla_sup', userRole: 'supervisor',
    signature: {}, expectedVersion: 2,
  });
  assert.equal(full.status, 'complete');
  // La aprobadora (último rol + propio) → bloqueado
  const r1 = await db.unsignSessionStep({
    id: s.id, role: 'approved', username: 'carla_sup', userRole: 'supervisor', expectedVersion: 3,
  });
  assert.equal(r1.code, 'complete');
  // Admin con cascada → también bloqueado
  const r2 = await db.unsignSessionStep({
    id: s.id, role: 'prepared', username: 'root_adm', userRole: 'admin', expectedVersion: 3,
  });
  assert.equal(r2.code, 'complete');
  // La sesión sigue intacta
  const g = await db.getSignSession(s.id);
  assert.equal(g.status, 'complete');
  assert.equal(g.signatures.approved.username, 'carla_sup');
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
test('creador elimina rechazada con motivo; queda lápida visible', async () => {
  const s = await db.createSignSession({
    name: 'RPT-DEL', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  await db.rejectSignSession({ id: s.id, username: 'beto_rev', userRole: 'analista', reason: 'x' });
  const sinMotivo = await db.deleteSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista' });
  assert.equal(sinMotivo.code, 'reason-required');
  const d = await db.deleteSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'duplicada' });
  assert.equal(d.status, 'deleted');
  assert.equal(d.deleted_by, 'ana_prep');
  assert.equal(d.deleted_reason, 'duplicada');
  assert.ok(d.deleted_at);
  const g = await db.getSignSession(s.id);
  assert.equal(g.status, 'deleted'); // consultable, no 404 mudo
  // Aviso: la lápida sigue en pendientes de los involucrados...
  const pb = await db.listSignSessions({ scope: 'pending', username: 'beto_rev' });
  assert.ok(pb.some((x) => x.id === s.id && x.status === 'deleted'), 'revisor ve el aviso');
  // ...pero no para ajenos
  const po = await db.listSignSessions({ scope: 'pending', username: 'dora_otro' });
  assert.ok(!po.some((x) => x.id === s.id), 'ajeno no ve la lápida');
  // Firmar sobre lápida → bloqueado
  const sg = await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: d.version,
  });
  assert.equal(sg.code, 'deleted');
});

test('pendiente bloqueada; completa → lápida (creador); ajena bloqueada', async () => {
  const s = await db.createSignSession({
    name: 'RPT-DEL2', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  const p = await db.deleteSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'x' });
  assert.equal(p.code, 'not-deletable');
  // S1 está complete → el creador la convierte en lápida (con descarga previa en UI)
  const c = await db.deleteSignSession({ id: S1.id, username: 'ana_prep', userRole: 'analista', reason: 'cierre' });
  assert.equal(c.status, 'deleted');
  assert.notEqual(await db.getSignSession(S1.id), null);
  await db.rejectSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: '' });
  const f = await db.deleteSignSession({ id: s.id, username: 'dora_otro', userRole: 'analista', reason: 'x' });
  assert.equal(f.code, 'forbidden');
  const a = await db.deleteSignSession({ id: s.id, username: 'root_adm', userRole: 'admin', reason: 'admin' });
  assert.equal(a.status, 'deleted');
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
  // Completa propia del test (S1 se elimina en el test de borrado)
  const full = await db.createSignSession({
    name: 'RPT-REJ4', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: full.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  await db.signSessionStep({
    id: full.id, role: 'approved', username: 'carla_sup', userRole: 'supervisor',
    signature: {}, expectedVersion: 2,
  });
  const c = await db.rejectSignSession({ id: full.id, username: 'ana_prep', userRole: 'analista', reason: '' });
  assert.equal(c.code, 'complete');
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

// ── LOTE A: purga por retención ──
test('purge dryRun lista sin borrar; real borra viejas complete', async () => {
  const s = await db.createSignSession({
    name: 'RPT-PURGE', html: HTML, createdBy: 'ana_prep',
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
  const future = Date.now() + 400 * 86400000; // +400 días
  const dry = await db.purgeSignSessions({ retentionDays: 365, dryRun: true, _now: future });
  assert.equal(dry.dryRun, true);
  assert.ok(dry.candidates.some((c) => c.id === s.id));
  assert.ok((await db.getSignSession(s.id)) !== null, 'dryRun no borra');
  const real = await db.purgeSignSessions({ retentionDays: 365, dryRun: false, _now: future });
  assert.ok(real.deleted.some((d) => d.id === s.id && d.doc_hash));
  assert.equal(await db.getSignSession(s.id), null);
});

test('purge jamás toca pending/partial ni recientes', async () => {
  const s = await db.createSignSession({
    name: 'RPT-PURGE2', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  const future = Date.now() + 400 * 86400000;
  // pending aunque vieja → intacta
  const r1 = await db.purgeSignSessions({ retentionDays: 365, dryRun: false, _now: future });
  assert.ok(!r1.deleted.some((d) => d.id === s.id));
  // complete reciente → intacta
  await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  await db.signSessionStep({
    id: s.id, role: 'approved', username: 'carla_sup', userRole: 'supervisor',
    signature: {}, expectedVersion: 2,
  });
  const r2 = await db.purgeSignSessions({ retentionDays: 365, dryRun: false });
  assert.ok(!r2.deleted.some((d) => d.id === s.id));
  assert.ok((await db.getSignSession(s.id)) !== null);
});

// ── Dismiss (quitar de mis pendientes) ──

// ── Opción A: reabrir rechazada ──
test('reopen: rechazada vuelve a revisión con firmas e historia', async () => {
  const s = await db.createSignSession({
    name: 'RPT-REOPEN', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  const rej = await db.rejectSignSession({ id: s.id, username: 'beto_rev', userRole: 'analista', reason: 'datos mal' });
  assert.equal(rej.status, 'rejected');
  // Sin motivo no reabre
  const sr = await db.reopenSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: '', expectedVersion: rej.version });
  assert.equal(sr.code, 'reason-required');
  // Ajeno no reabre
  const fr = await db.reopenSignSession({ id: s.id, username: 'dora_otro', userRole: 'analista', reason: 'x', expectedVersion: rej.version });
  assert.equal(fr.code, 'forbidden');
  // Creador reabre: conserva firmas + rechazo como historia
  const ro = await db.reopenSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'corregido', expectedVersion: rej.version });
  assert.equal(ro.status, 'partial');
  assert.equal(ro.signatures.prepared.signed, true);
  assert.equal(ro.signatures.reviewed.signed, true);
  assert.equal(ro.rejected_reason, 'datos mal');
  assert.equal(ro.reopened_by, 'ana_prep');
  assert.equal(ro.reopened_reason, 'corregido');
  assert.ok(ro.reopened_at);
  // Reabrir lo no-rechazado → 422
  const nr = await db.reopenSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'x', expectedVersion: ro.version });
  assert.equal(nr.code, 'not-rejected');
});

test('reopen con versión vieja → stale-version', async () => {
  const s = await db.createSignSession({
    name: 'RPT-REOPEN2', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  const rej = await db.rejectSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'x' });
  const r = await db.reopenSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'x', expectedVersion: rej.version - 1 });
  assert.equal(r.code, 'stale-version');
});

// ── Opción A: devolución al rol anterior ──
test('sendback: revisor devuelve a prepared e invalida lo posterior', async () => {
  const s = await db.createSignSession({
    name: 'RPT-SENDBACK', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  // Sin comentario no devuelve
  const sc = await db.sendbackSignSession({ id: s.id, toRole: 'prepared', username: 'beto_rev', userRole: 'analista', reason: '', expectedVersion: 2 });
  assert.equal(sc.code, 'reason-required');
  // Ajeno (no firmó después) no puede devolver
  const fb = await db.sendbackSignSession({ id: s.id, toRole: 'prepared', username: 'dora_otro', userRole: 'analista', reason: 'x', expectedVersion: 2 });
  assert.equal(fb.code, 'forbidden');
  // Destino no firmado → 422
  const bt = await db.sendbackSignSession({ id: s.id, toRole: 'approved', username: 'beto_rev', userRole: 'analista', reason: 'x', expectedVersion: 2 });
  assert.equal(bt.code, 'bad-target');
  const sb = await db.sendbackSignSession({ id: s.id, toRole: 'prepared', username: 'beto_rev', userRole: 'analista', reason: 'corregir datos', expectedVersion: 2 });
  assert.deepEqual(sb.invalidated, ['prepared', 'reviewed']);
  assert.equal(sb.status, 'pending');
  assert.equal(sb.next_role, 'prepared');
  assert.equal(sb.sentback_by, 'beto_rev');
  assert.equal(sb.sentback_to, 'prepared');
  assert.equal(sb.sentback_reason, 'corregir datos');
  // El creador vuelve a firmar prepared y el flujo continúa
  const rp = await db.signSessionStep({
    id: s.id, role: 'prepared', username: 'ana_prep', userRole: 'analista',
    signature: {}, expectedVersion: sb.version,
  });
  assert.equal(rp.next_role, 'reviewed');
});

test('sendback: aprobador devuelve a reviewed en su turno; admin con cascada', async () => {
  const s = await db.createSignSession({
    name: 'RPT-SENDBACK2', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  // La aprobadora, en su turno y sin firmar aún, devuelve a reviewed
  const sb = await db.sendbackSignSession({ id: s.id, toRole: 'reviewed', username: 'carla_sup', userRole: 'supervisor', reason: 'revisar de nuevo', expectedVersion: 2 });
  assert.deepEqual(sb.invalidated, ['reviewed']);
  assert.equal(sb.next_role, 'reviewed');
  assert.equal(sb.signatures.prepared.signed, true); // lo anterior se conserva
  assert.equal(sb.sentback_to, 'reviewed');
  // Admin devuelve aunque no sea su turno ni haya firmado (cascada)
  const s2 = await db.createSignSession({
    name: 'RPT-SENDBACK3', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: s2.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  const adm = await db.sendbackSignSession({ id: s2.id, toRole: 'prepared', username: 'root_adm', userRole: 'admin', reason: 'auditoría', expectedVersion: 2 });
  assert.deepEqual(adm.invalidated, ['prepared', 'reviewed']);
  assert.equal(adm.status, 'pending');
});

// ── Opción A: enmienda de contenido ──
test('amend: creador cambia html, renueva prepared e invalida lo posterior', async () => {
  const s = await db.createSignSession({
    name: 'RPT-AMEND', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  // No creador no puede enmendar
  const f = await db.amendSignSession({ id: s.id, html: '<html>v2</html>', username: 'beto_rev', userRole: 'analista', expectedVersion: 2 });
  assert.equal(f.code, 'forbidden');
  const am = await db.amendSignSession({ id: s.id, html: '<html>v2</html>', username: 'ana_prep', userRole: 'analista', expectedVersion: 2 });
  assert.notEqual(am.doc_hash, s.doc_hash);
  assert.equal(am.prev_hash, s.doc_hash);
  assert.equal(am.signatures.prepared.signed, true);
  assert.equal(am.signatures.prepared.username, 'ana_prep');
  assert.equal(am.signatures.reviewed, undefined);
  assert.equal(am.status, 'partial');
  assert.equal(am.next_role, 'reviewed');
});

// ── Opción A: ciclo completo rechazar → reabrir → enmendar → firmar → completa ──
test('ciclo re-revisión completo termina en complete', async () => {
  const s = await db.createSignSession({
    name: 'RPT-CICLO', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: 'carla_sup',
    preparedSignature: { nombre: 'Ana' },
  });
  await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: 1,
  });
  const rej = await db.rejectSignSession({ id: s.id, username: 'beto_rev', userRole: 'analista', reason: 'error en tabla 3' });
  const ro = await db.reopenSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'tabla corregida', expectedVersion: rej.version });
  const am = await db.amendSignSession({ id: s.id, html: '<html>corregido</html>', username: 'ana_prep', userRole: 'analista', expectedVersion: ro.version });
  const rv = await db.signSessionStep({
    id: s.id, role: 'reviewed', username: 'beto_rev', userRole: 'analista',
    signature: {}, expectedVersion: am.version,
  });
  assert.equal(rv.next_role, 'approved');
  const ap = await db.signSessionStep({
    id: s.id, role: 'approved', username: 'carla_sup', userRole: 'supervisor',
    signature: {}, expectedVersion: rv.version,
  });
  assert.equal(ap.status, 'complete');
  // Completa sigue inmutable: ni reopen ni sendback ni amend
  const r1 = await db.reopenSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'x', expectedVersion: ap.version });
  assert.equal(r1.code, 'complete');
  const r2 = await db.sendbackSignSession({ id: s.id, toRole: 'prepared', username: 'root_adm', userRole: 'admin', reason: 'x', expectedVersion: ap.version });
  assert.equal(r2.code, 'complete');
  const r3 = await db.amendSignSession({ id: s.id, html: 'x', username: 'ana_prep', userRole: 'analista', expectedVersion: ap.version });
  assert.equal(r3.code, 'complete');
});

// ── Opción A: purga incluye lápidas como rechazadas ──
test('purge elimina lápidas viejas con plazo de rechazadas', async () => {
  const s = await db.createSignSession({
    name: 'RPT-PURGE-DEL', html: HTML, createdBy: 'ana_prep',
    assignedReviewer: 'beto_rev', assignedApprover: null,
    preparedSignature: { nombre: 'Ana' },
  });
  await db.rejectSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'x' });
  const g = await db.getSignSession(s.id);
  await db.deleteSignSession({ id: s.id, username: 'ana_prep', userRole: 'analista', reason: 'x' });
  const future = Date.now() + 400 * 86400000;
  const dry = await db.purgeSignSessions({ rejectedDays: 90, dryRun: true, _now: future });
  assert.ok(dry.candidates.some((c) => c.id === s.id && c.status === 'deleted'));
  assert.ok((await db.getSignSession(s.id)) !== null, 'dryRun no borra');
  assert.equal(g.status, 'rejected');
});
