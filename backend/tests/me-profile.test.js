// Regresión ZAP 2026-11-18: /api/me devolvía password (bcrypt), totp_secret y
// signature_code porque el spread copiaba la fila completa de SELECT *.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { perfilPublico } = require('../me-profile');

const fila = {
    id: 14, username: 'd.nina', password: '$2a$12$hash', password_temp: 0,
    role: 'admin', active: 1, created_by: 'f.nina', created_at: '2026-01-01',
    nombre: 'D', apellido: 'N', email: 'd@lab.com', telefono: '', avatar: null,
    cargo: 'Analista', signature_code: 'CODIGO-SECRETO', signature: 'firma',
    totp_secret: 'SECRETO2FA', totp_enabled: 0, last_login: '2026-11-18',
    login_count: 3, last_ip_masked: '148.0.•.•', updated_at: '2026-11-18',
};

test('el perfil público nunca incluye secretos', () => {
    const p = perfilPublico(fila);
    for (const campo of ['password', 'password_temp', 'totp_secret', 'signature_code']) {
        assert.equal(Object.prototype.hasOwnProperty.call(p, campo), false, campo);
    }
});

test('el perfil público conserva lo que usa la UI', () => {
    const p = perfilPublico(fila);
    for (const campo of ['id', 'username', 'nombre', 'email', 'cargo', 'role', 'last_login', 'login_count', 'last_ip_masked', 'signature']) {
        assert.equal(p[campo], fila[campo], campo);
    }
});

test('campos nuevos no se filtran por defecto (allowlist, no denylist)', () => {
    const p = perfilPublico({ username: 'x', campo_nuevo_secreto: 'no debe salir' });
    assert.equal('campo_nuevo_secreto' in p, false);
});

test('perfil público tolera filas vacías', () => {
    assert.deepEqual(perfilPublico(null), {});
    assert.deepEqual(perfilPublico(undefined), {});
    assert.deepEqual(perfilPublico('texto'), {});
});
