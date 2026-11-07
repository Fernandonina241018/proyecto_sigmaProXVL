// FASE 1 — Borradores de Validaciones: contrato del store local.
// node --test tests/validation-drafts.test.js
const { test, before } = require('node:test');
const assert = require('node:assert/strict');

delete process.env.DATABASE_URL;
const db = require('./_db-fixture');

before(async () => {
  await db.createUser({ username: 'val_admin', password: 'x', role: 'admin' });
  await db.createUser({ username: 'val_otro', password: 'x', role: 'admin' });
});

test('guardar y recuperar borrador por usuario, categoría y entidad', async () => {
  await db.saveValidationDraft({
    username: 'val_admin',
    category: 'equipos',
    entity: 'autoclave',
    data: { codigo: 'EQ-01', temperaturaMin: '-1' },
  });
  const row = await db.getValidationDraft({ username: 'val_admin', category: 'equipos', entity: 'autoclave' });
  assert.equal(row.data.codigo, 'EQ-01');
  assert.equal(row.data.temperaturaMin, '-1');
  assert.ok(row.updated_at);
});

test('segundo guardado actualiza el mismo borrador (no duplica)', async () => {
  await db.saveValidationDraft({
    username: 'val_admin', category: 'equipos', entity: 'autoclave',
    data: { codigo: 'EQ-02' },
  });
  const row = await db.getValidationDraft({ username: 'val_admin', category: 'equipos', entity: 'autoclave' });
  assert.equal(row.data.codigo, 'EQ-02');
});

test('los borradores están aislados por usuario, categoría y entidad', async () => {
  assert.equal(await db.getValidationDraft({ username: 'val_otro', category: 'equipos', entity: 'autoclave' }), null);
  assert.equal(await db.getValidationDraft({ username: 'val_admin', category: 'sistemas', entity: 'autoclave' }), null);
  assert.equal(await db.getValidationDraft({ username: 'val_admin', category: 'equipos', entity: 'reactor' }), null);
});

test('un borrador parcial (sin campos obligatorios) se guarda igual', async () => {
  await db.saveValidationDraft({
    username: 'val_admin', category: 'almacenes', entity: 'cuarto-frio',
    data: { descripcion: 'CF-01' },
  });
  const row = await db.getValidationDraft({ username: 'val_admin', category: 'almacenes', entity: 'cuarto-frio' });
  assert.equal(row.data.descripcion, 'CF-01');
  assert.equal(row.data.codigo, undefined);
});
