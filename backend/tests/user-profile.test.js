// Update parcial de perfil: fijar un campo no debe borrar el resto.
// Regresión del borrado colateral tras reset (código de firma borraba
// nombre/apellido/email/teléfono/cargo/firma). Store local (sin DATABASE_URL).
const { test, before } = require('node:test');
const assert = require('node:assert/strict');

delete process.env.DATABASE_URL;
const db = require('../database');

const FULL = {
  nombre: 'Ana', apellido: 'López', email: 'ana@lab.com', telefono: '555-1',
  cargo: 'Analista', signatureCode: 'ANA-1', signature: 'firma-dibujada',
};

before(async () => {
  await db.createUser({ username: 'perfil_a', password: 'x', role: 'analista', ...FULL });
  await db.createUser({ username: 'perfil_b', password: 'x', role: 'analista', ...FULL });
});

async function get(username) {
  return db.getUserByUsername(username);
}

test('updateUserProfile parcial conserva el resto (caso reset: solo código)', async () => {
  await db.updateUserProfile('perfil_a', { signatureCode: 'ANA-2' });
  const u = await get('perfil_a');
  assert.equal(u.signature_code, 'ANA-2');
  assert.equal(u.nombre, 'Ana');
  assert.equal(u.apellido, 'López');
  assert.equal(u.email, 'ana@lab.com');
  assert.equal(u.telefono, '555-1');
  assert.equal(u.cargo, 'Analista');
  assert.equal(u.signature, 'firma-dibujada');
});

test('updateUserProfileById parcial conserva el resto', async () => {
  const beforeUser = await get('perfil_b');
  await db.updateUserProfileById(beforeUser.id, { cargo: 'Supervisora' });
  const u = await get('perfil_b');
  assert.equal(u.cargo, 'Supervisora');
  assert.equal(u.nombre, 'Ana');
  assert.equal(u.signature_code, 'ANA-1');
});

test("borrado explícito con '' sigue limpiando (semántica preservada)", async () => {
  await db.updateUserProfile('perfil_a', { cargo: '' });
  const u = await get('perfil_a');
  assert.equal(u.cargo, null);
  assert.equal(u.nombre, 'Ana'); // el resto intacto
});
