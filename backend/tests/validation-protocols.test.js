// FASE 2 — Registro inmutable de protocolos: contrato del store local.
// node --test tests/validation-protocols.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const fs = require('node:fs');
const path = require('node:path');
const db = require('./_db-fixture');

const SERVER = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');

function sha(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

test('registra un protocolo con hash y archivo', async () => {
  const bytes = Buffer.from('docx-demo-1');
  const hash = sha(bytes);
  const row = await db.saveValidationProtocol({
    category: 'equipos', entity: 'reactor', phase: 'OQ', code: 'OQ-RC-01',
    version: '01', filename: 'OQ-reactor.docx', sha256: hash,
    username: 'val_admin', details: { code: 'OQ-RC-01' }, fileData: bytes,
  });
  assert.equal(row.created, true);
  assert.equal(row.sha256, hash);
  const full = await db.getValidationProtocol(row.id);
  assert.equal(full.filename, 'OQ-reactor.docx');
  assert.equal(Buffer.from(full.file_data, 'base64').toString(), 'docx-demo-1');
});

test('el mismo hash no duplica el registro', async () => {
  const bytes = Buffer.from('docx-demo-1');
  const row = await db.saveValidationProtocol({
    category: 'equipos', entity: 'reactor', phase: 'OQ', code: 'OQ-RC-01',
    version: '01', filename: 'OQ-reactor.docx', sha256: sha(bytes),
    username: 'val_admin', details: {}, fileData: bytes,
  });
  assert.equal(row.created, false);
  assert.equal(await db.countValidationProtocols({ category: 'equipos', entity: 'reactor', phase: 'OQ' }), 1);
});

test('regenerar el mismo archivo con otro nombre normaliza el registro', async () => {
  const bytes = Buffer.from('docx-demo-1');
  const row = await db.saveValidationProtocol({
    category: 'equipos', entity: 'reactor', phase: 'OQ', code: 'OQ-RC-01',
    version: '01', filename: 'DQ-4002058 AUTOCLAVE.docx', sha256: sha(bytes),
    username: 'val_admin', details: { code: 'OQ-RC-01' }, fileData: bytes,
  });
  assert.equal(row.created, false);
  assert.equal(row.renamed, true);
  assert.equal(row.filename, 'DQ-4002058 AUTOCLAVE.docx');
  assert.equal(row.previousFilename, 'OQ-reactor.docx');
  const list = await db.listValidationProtocols({ category: 'equipos', entity: 'reactor', phase: 'OQ' });
  assert.equal(list.length, 1);
  assert.equal(list[0].filename, 'DQ-4002058 AUTOCLAVE.docx');
});

test('lista y cuenta con filtros por categoría, entidad y fase', async () => {
  const bytes = Buffer.from('docx-demo-2');
  await db.saveValidationProtocol({
    category: 'equipos', entity: 'reactor', phase: 'PQ', code: 'PQ-RC-01',
    version: '01', filename: 'PQ-reactor.docx', sha256: sha(bytes),
    username: 'val_admin', details: {}, fileData: bytes,
  });
  const oq = await db.listValidationProtocols({ category: 'equipos', entity: 'reactor', phase: 'OQ' });
  const pq = await db.listValidationProtocols({ category: 'equipos', entity: 'reactor', phase: 'PQ' });
  assert.equal(oq.length, 1);
  assert.equal(pq.length, 1);
  assert.equal(await db.countValidationProtocols({ category: 'equipos', entity: 'reactor' }), 2);
  assert.equal((await db.listValidationProtocols({ category: 'almacenes' })).length, 0);
});

test('server: endpoints admin, sin edición ni borrado', () => {
  assert.match(SERVER, /app\.post\('\/api\/val\/v1\/protocols',\s*requireAuth,\s*requireAdmin/);
  assert.match(SERVER, /app\.get\('\/api\/val\/v1\/protocols',\s*requireAuth,\s*requireAdmin/);
  assert.match(SERVER, /app\.get\('\/api\/val\/v1\/protocols\/:id\/download',\s*requireAuth,\s*requireAdmin/);
  assert.match(SERVER, /createHash\('sha256'\)/);
  assert.match(SERVER, /PROTOCOL_REGISTERED/);
  assert.match(SERVER, /PROTOCOL_RENAMED/);
  assert.doesNotMatch(SERVER, /app\.(put|patch|delete)\('\/api\/val\/v1\/protocols/);
});
