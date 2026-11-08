// FASE 4 — Ajustes y reportes de Validaciones (store local).
// node --test tests/validation-reports.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const db = require('./_db-fixture');

const SERVER = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');

test('settings: defaults y actualización parcial', async () => {
  const base = await db.getValidationSettings();
  assert.equal(base.orgName, 'StatAnalyzer Pro');
  assert.deepEqual(base.reviewRoles, ['gerente']);
  const saved = await db.saveValidationSettings(Object.assign({}, base, {
    orgName: 'ACME Pharma', numberingPrefix: 'AC', reviewRoles: ['gerente', 'supervisor'],
  }));
  assert.equal(saved.orgName, 'ACME Pharma');
  assert.equal(saved.logoUrl, '');
  const again = await db.getValidationSettings();
  assert.equal(again.numberingPrefix, 'AC');
  assert.deepEqual(again.reviewRoles, ['gerente', 'supervisor']);
});

test('reporte: agrega por fase, categoría, entidad, usuario y día', async () => {
  const rows = [
    { category: 'equipos', entity: 'reactor', phase: 'OQ', code: 'OQ-1', version: '01' },
    { category: 'equipos', entity: 'reactor', phase: 'OQ', code: 'OQ-2', version: '01' },
    { category: 'almacenes', entity: 'cuarto-frio', phase: 'PQ', code: 'PQ-1', version: '01' },
  ];
  for (const r of rows) {
    await db.saveValidationProtocol(Object.assign({}, r, {
      filename: r.code + '.docx', sha256: r.code + '-hash', username: 'ana',
      details: {}, fileData: Buffer.from(r.code),
    }));
  }
  const rep = await db.getValidationReport();
  assert.equal(rep.total, 3);
  assert.deepEqual(rep.byPhase.find((x) => x.phase === 'OQ'), { phase: 'OQ', total: 2 });
  assert.equal(rep.byCategory.length, 2);
  assert.equal(rep.byEntity.find((x) => x.entity === 'reactor').total, 2);
  assert.equal(rep.byUser[0].username, 'ana');
  assert.equal(rep.byDay.reduce((a, x) => a + x.total, 0), 3);
});

test('server: endpoints de settings/reportes con auth y auditoría', () => {
  assert.match(SERVER, /app\.get\('\/api\/val\/v1\/settings',\s*requireAuth/);
  assert.match(SERVER, /app\.put\('\/api\/val\/v1\/settings',\s*requireAuth,\s*requireAdmin/);
  assert.match(SERVER, /app\.get\('\/api\/val\/v1\/reports',\s*requireAuth,\s*requireAdmin/);
  assert.match(SERVER, /VALIDATION_SETTINGS_UPDATED/);
});
