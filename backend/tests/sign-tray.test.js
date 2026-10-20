// Bandeja >150: paginado real. node --test tests/sign-tray.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { collectSignTray, BATCH } = require('../sign-tray');

function makeRows(n, candidateFrom) {
  const rows = [];
  for (let i = 1; i <= n; i++) rows.push({ id: i, cand: i >= candidateFrom });
  return rows;
}
function paged(rows, calls) {
  return async function (limit, offset) {
    calls.push([limit, offset]);
    return rows.slice(offset, offset + limit);
  };
}

test('encuentra candidatos más allá de la ventana vieja (150)', async () => {
  const rows = makeRows(400, 300); // primeros 299 no elegibles
  const calls = [];
  const out = await collectSignTray({ fetchPage: paged(rows, calls), isCandidate: (s) => s.cand, offset: 0, limit: 50 });
  assert.equal(out.length, 50);
  assert.equal(out[0].id, 300);
  assert.ok(calls.length >= 2, 'debe paginar más de una vez');
});

test('conteo exacto aunque supere la ventana', async () => {
  const rows = makeRows(450, 200); // 251 candidatos desde id 200
  const out = await collectSignTray({ fetchPage: paged(rows, []), isCandidate: (s) => s.cand, scope: 'count' });
  assert.equal(out, 251);
});

test('bandeja normal: una sola consulta y slice correcto', async () => {
  const rows = makeRows(30, 1);
  const calls = [];
  const out = await collectSignTray({ fetchPage: paged(rows, calls), isCandidate: (s) => s.cand, offset: 5, limit: 10 });
  assert.deepEqual(out.map((s) => s.id), [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], [BATCH, 0]);
});

test('bandeja vacía', async () => {
  const out = await collectSignTray({ fetchPage: paged([], []), isCandidate: () => true, limit: 50 });
  assert.deepEqual(out, []);
});

test('offset más allá de lo disponible devuelve vacío (mismo contrato que antes)', async () => {
  const rows = makeRows(10, 1);
  const out = await collectSignTray({ fetchPage: paged(rows, []), isCandidate: (s) => s.cand, offset: 50, limit: 10 });
  assert.deepEqual(out, []);
});
