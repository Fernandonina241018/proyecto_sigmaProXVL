// Middleware anti-caché: ver backend/no-store.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { apiNoStore } = require('../no-store');

function mockRes() {
  const headers = {};
  return {
    headers,
    setHeader(k, v) { headers[k.toLowerCase()] = v; },
  };
}

test('apiNoStore fija no-store + pragma + expires y llama next', () => {
  const res = mockRes();
  let nexted = false;
  apiNoStore({}, res, () => { nexted = true; });
  assert.match(res.headers['cache-control'], /no-store/);
  assert.match(res.headers['cache-control'], /no-cache/);
  assert.equal(res.headers['pragma'], 'no-cache');
  assert.equal(res.headers['expires'], '0');
  assert.equal(nexted, true);
});
