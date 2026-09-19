// LOTE B — tests del proxy ML con servidor mock (sin ML real).
// node --test tests/ml-proxy.test.js
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createMlProxy, buildProxyHeaders, pickModule } = require('../ml-proxy');

let mock;
let seen = [];
before(async () => {
  mock = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      seen.push({ method: req.method, url: req.url, headers: req.headers, body });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, echo: body }));
    });
  });
  await new Promise((r) => mock.listen(0, r));
});
after(() => mock.close());

const { PassThrough } = require('node:stream');

function runProxy(handler, req) {
  return new Promise((resolve, reject) => {
    const pt = new PassThrough();
    const snap = { statusCode: 0, headers: {}, body: null };
    pt.status = function(c) { snap.statusCode = c; return this; };
    pt.setHeader = function(k, v) { snap.headers[String(k).toLowerCase()] = v; };
    pt.json = function(o) { snap.body = JSON.stringify(o); pt.end(); return pt; };
    Object.defineProperty(pt, 'headersSent', { get: () => false });
    const chunks = [];
    pt.on('data', (c) => chunks.push(c));
    pt.on('end', () => {
      if (snap.body === null) snap.body = Buffer.concat(chunks).toString();
      resolve(snap);
    });
    pt.on('error', reject);
    try {
      handler(req, pt);
    } catch (e) { reject(e); }
    setTimeout(() => reject(new Error('timeout esperando proxy')), 5000);
  });
}

function mockReq(port, method, path, body, headers = {}) {
  return {
    method, originalUrl: path,
    headers: Object.assign({ 'content-type': 'application/json', accept: '*/*' }, headers),
    body,
  };
}

test('pickModule elige https/http por protocolo', () => {
  assert.equal(pickModule('https:'), require('node:https'));
  assert.equal(pickModule('http:'), require('node:http'));
});

test('inyecta X-API-Key solo si está configurada', () => {
  const withKey = buildProxyHeaders({ method: 'POST', headers: {} }, 'SECRET');
  assert.equal(withKey['X-API-Key'], 'SECRET');
  const without = buildProxyHeaders({ method: 'POST', headers: {} }, '');
  assert.ok(!('X-API-Key' in without));
  // Nunca reenvía claves del cliente
  const evil = buildProxyHeaders(
    { method: 'POST', headers: { 'x-api-key': 'CLIENT', authorization: 'Bearer x' } }, 'SRV'
  );
  assert.equal(evil['X-API-Key'], 'SRV');
  assert.ok(!('authorization' in evil));
});

test('GET sin content-type y con clave', async () => {
  const port = mock.address().port;
  const handler = createMlProxy({ target: `http://127.0.0.1:${port}`, apiKey: 'K1' });
  const res = await runProxy(handler, mockReq(port, 'GET', '/api/ml/health'));
  assert.equal(res.statusCode, 200);
  assert.equal(seen[seen.length - 1].headers['x-api-key'], 'K1');
  assert.ok(!('content-type' in seen[seen.length - 1].headers));
});

test('POST reenvía path, body y responde', async () => {
  const port = mock.address().port;
  const handler = createMlProxy({ target: `http://127.0.0.1:${port}`, apiKey: '' });
  const res = await runProxy(
    handler, mockReq(port, 'POST', '/api/ml/predict?a=1', { x: 1 })
  );
  assert.equal(res.statusCode, 200);
  const last = seen[seen.length - 1];
  assert.equal(last.url, '/api/ml/predict?a=1');
  assert.deepEqual(JSON.parse(last.body), { x: 1 });
  assert.deepEqual(JSON.parse(res.body), { ok: true, echo: JSON.stringify({ x: 1 }) });
});

test('503 si el ML está caído', async () => {
  const handler = createMlProxy({ target: 'http://127.0.0.1:1', apiKey: '', timeoutMs: 1000 });
  const res = await runProxy(handler, mockReq(1, 'GET', '/api/ml/health'));
  assert.equal(res.statusCode, 503);
  assert.deepEqual(JSON.parse(res.body), { ok: false, error: 'ML Service no disponible' });
});
