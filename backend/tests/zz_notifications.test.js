// Notificaciones por publicación — tests sobre store local
const { test, before } = require('node:test');
const assert = require('node:assert/strict');
delete process.env.DATABASE_URL;
const db = require('../database');
const { enqueueNotifications, buildEmailContent } = require('../notifications');

const HTML = '<html><body>reporte</body></html>';

before(async () => {
  await db.createUser({ username: 'prep', password: 'x', role: 'analista', email: 'prep@example.com' });
  await db.createUser({ username: 'rev1', password: 'x', role: 'analista', email: 'rev1@example.com' });
  await db.createUser({ username: 'rev2', password: 'x', role: 'analista', email: 'rev2@example.com' });
  await db.createUser({ username: 'noemail', password: 'x', role: 'analista', email: 'noemail' }); // sin @ => no elegible
});

test('preferencia default true y opt-out', async () => {
  const pref1 = await db.getNotificationPreference('rev1');
  assert.equal(!!pref1.on_publish, true);
  await db.setNotificationPreference('rev1', false);
  const pref2 = await db.getNotificationPreference('rev1');
  assert.equal(!!pref2.on_publish, false);
  await db.setNotificationPreference('rev1', true);
  const pref3 = await db.getNotificationPreference('rev1');
  assert.equal(!!pref3.on_publish, true);
});

test('buildEmailContent solo título+firmante', async () => {
  const session = { id: 999, name: 'Estabilidad Lote 042', doc_hash: 'abc123', created_by: 'prep' };
  const preparer = { username: 'prep', nombre: 'Ana', apellido: 'Pérez', signature_code: 'AP-021' };
  const c = buildEmailContent({ session, preparer });
  assert.match(c.subject, /Estabilidad Lote 042/);
  assert.match(c.subject, /Ana Pérez/);
  assert.match(c.html, /Estabilidad Lote 042/);
  assert.match(c.html, /AP-021/);
  assert.ok(!c.html.includes('abc123')); // no doc_hash
  assert.match(c.text, /Ver:/);
});

test('enqueue solo usuarios con email y opt-in, excluye creador, idempotente', async () => {
  // rev1 opt-out para este test
  await db.setNotificationPreference('rev1', false);
  const sess = await db.createSignSession({
    name: 'RPT-NOTIF', html: HTML, createdBy: 'prep',
    assignedReviewer: 'rev1', assignedApprover: 'rev2',
    preparedSignature: { nombre: 'Ana', cargo: '', firma: '', fecha: '2026-01-01' },
  });
  // Mock fetch + token para que sendMailtrap no haga request real (evita bounced)
  process.env.MAILTRAP_API_TOKEN = 'test-token';
  process.env.MAILTRAP_INBOX_ID = '123';
  const origFetch = global.fetch;
  global.fetch = async () => ({ ok: true, json: async () => ({ success: true, message_ids: ['test123'] }) });
  const deliveries = await enqueueNotifications(db, sess);
  // rev1 opt-out => skipped_optout, rev2 => queued, noemail => excluido, prep excluido
  const dRev1 = deliveries.find(d => d.recipient_username === 'rev1');
  const dRev2 = deliveries.find(d => d.recipient_username === 'rev2');
  const dNoEmail = deliveries.find(d => d.recipient_username === 'noemail');
  assert.equal(dRev1.status, 'skipped_optout');
  assert.equal(dRev2.status, 'queued');
  assert.equal(dNoEmail, undefined);
  // Idempotencia: segunda llamada no duplica
  const deliveries2 = await enqueueNotifications(db, sess);
  assert.equal(deliveries2.length, deliveries.length);
  global.fetch = origFetch;
  await db.setNotificationPreference('rev1', true); // restaurar
});

test('deliveries list filtra por usuario y RBAC (usuario ve solo suyas)', async () => {
  const sess = await db.createSignSession({
    name: 'RPT-NOTIF2', html: HTML, createdBy: 'prep',
    assignedReviewer: 'rev1', assignedApprover: 'rev2',
    preparedSignature: { nombre: 'Ana' },
  });
  process.env.MAILTRAP_API_TOKEN = 'test-token';
  process.env.MAILTRAP_INBOX_ID = '123';
  const origFetch = global.fetch;
  global.fetch = async () => ({ ok: true, json: async () => ({ success: true, message_ids: ['x'] }) });
  await enqueueNotifications(db, sess);
  global.fetch = origFetch;
  const mineRev1 = await db.listNotificationDeliveries({ recipientUsername: 'rev1' });
  const mineRev2 = await db.listNotificationDeliveries({ recipientUsername: 'rev2' });
  assert.ok(mineRev1.some(d => d.sign_session_id === sess.id));
  assert.ok(mineRev2.some(d => d.sign_session_id === sess.id));
  assert.ok(!mineRev1.some(d => d.recipient_username === 'rev2'));
});

test('purge notificaciones 182d no toca recientes', async () => {
  const sess = await db.createSignSession({
    name: 'RPT-NOTIF3', html: HTML, createdBy: 'prep',
    assignedReviewer: 'rev1', assignedApprover: 'rev2',
    preparedSignature: { nombre: 'Ana' },
  });
  process.env.MAILTRAP_API_TOKEN = 'test-token';
  process.env.MAILTRAP_INBOX_ID = '123';
  const origFetch = global.fetch;
  global.fetch = async () => ({ ok: true, json: async () => ({ success: true, message_ids: ['y'] }) });
  await enqueueNotifications(db, sess);
  global.fetch = origFetch;
  const future = Date.now() + 400 * 86400000;
  const dry = await db.purgeNotificationDeliveries({ retentionDays: 182, dryRun: true, _now: future });
  assert.ok(dry.candidates.some(c => c.sign_session_id === sess.id));
  const realNow = await db.purgeNotificationDeliveries({ retentionDays: 182, dryRun: false });
  assert.equal(realNow.count, 0); // recientes no se purgan
  const realFuture = await db.purgeNotificationDeliveries({ retentionDays: 182, dryRun: false, _now: future });
  assert.ok(realFuture.count >= 1);
});
