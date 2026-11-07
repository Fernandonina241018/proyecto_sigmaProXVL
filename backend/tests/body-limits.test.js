const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isLargeBodyRoute } = require('../body-limits');

const post = (path) => ({ method: 'POST', path });

test('rutas de reportes/snapshots usan el parser grande', () => {
    for (const path of [
        '/api/sign-sessions',
        '/api/sign-sessions/import',
        '/api/sign-sessions/abc-123/amend',
        '/api/snapshots',
        '/api/pdf/render',
        '/api/val/v1/protocols',
    ]) {
        assert.equal(isLargeBodyRoute(post(path)), true, path);
    }
});

test('el resto de rutas mantiene el límite pequeño', () => {
    assert.equal(isLargeBodyRoute(post('/api/login')), false);
    assert.equal(isLargeBodyRoute(post('/api/sign-sessions/abc/step')), false);
    assert.equal(isLargeBodyRoute({ method: 'GET', path: '/api/snapshots' }), false);
    assert.equal(isLargeBodyRoute(null), false);
});
