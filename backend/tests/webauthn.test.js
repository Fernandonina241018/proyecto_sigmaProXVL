// Passkeys/WebAuthn — contrato del store local y de los endpoints.
// El objetivo es fijar las garantías de seguridad que no dependen del
// navegador: challenge de un solo uso, expiración y CRUD por usuario.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const db = require('./_db-fixture');

const SERVER = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');

test('challenge: se consume una sola vez', async () => {
    await db.saveWebAuthnChallenge('ana', 'chal-1', 'registration', 300);
    assert.equal(await db.consumeWebAuthnChallenge('ana', 'registration'), 'chal-1');
    assert.equal(await db.consumeWebAuthnChallenge('ana', 'registration'), null);
});

test('challenge: aislado por tipo (registro no sirve para login)', async () => {
    await db.saveWebAuthnChallenge('bea', 'chal-reg', 'registration', 300);
    assert.equal(await db.consumeWebAuthnChallenge('bea', 'authentication'), null);
    assert.equal(await db.consumeWebAuthnChallenge('bea', 'registration'), 'chal-reg');
});

test('challenge: expirado no se consume', async () => {
    await db.saveWebAuthnChallenge('carla', 'chal-viejo', 'authentication', -1);
    assert.equal(await db.consumeWebAuthnChallenge('carla', 'authentication'), null);
});

test('challenge: no se mezcla entre usuarios', async () => {
    await db.saveWebAuthnChallenge('dani', 'chal-dani', 'authentication', 300);
    await db.saveWebAuthnChallenge('eva', 'chal-eva', 'authentication', 300);
    assert.equal(await db.consumeWebAuthnChallenge('dani', 'authentication'), 'chal-dani');
    assert.equal(await db.consumeWebAuthnChallenge('eva', 'authentication'), 'chal-eva');
});

test('credenciales: alta, listado, lectura y borrado por usuario', async () => {
    await db.addWebAuthnCredential({
        username: 'ana',
        credentialId: 'cred-ana-1',
        publicKey: 'pk-ana-1',
        counter: 0,
        transports: '["internal"]',
        deviceName: 'Laptop',
    });

    const list = await db.getWebAuthnCredentials('ana');
    assert.equal(list.length, 1);
    assert.equal(list[0].credential_id, 'cred-ana-1');
    assert.equal(list[0].device_name, 'Laptop');

    const one = await db.getWebAuthnCredential('cred-ana-1');
    assert.equal(one.username, 'ana');
    assert.equal(one.public_key, 'pk-ana-1');

    // Otro usuario no puede borrarla.
    await db.removeWebAuthnCredential('bea', 'cred-ana-1');
    assert.equal((await db.getWebAuthnCredentials('ana')).length, 1);

    await db.removeWebAuthnCredential('ana', 'cred-ana-1');
    assert.equal((await db.getWebAuthnCredentials('ana')).length, 0);
});

test('credenciales: el contador se actualiza y marca last_used_at', async () => {
    await db.addWebAuthnCredential({
        username: 'dani',
        credentialId: 'cred-dani-1',
        publicKey: 'pk-dani-1',
        counter: 0,
        transports: '["internal"]',
        deviceName: 'Teléfono',
    });

    await db.updateWebAuthnCounter('cred-dani-1', 7);
    const row = await db.getWebAuthnCredential('cred-dani-1');
    assert.equal(Number(row.counter), 7);
    assert.ok(row.last_used_at, 'last_used_at debe quedar registrado');
});

test('server: los endpoints de passkeys existen y están protegidos', () => {
    assert.match(SERVER, /\/api\/webauthn\/register\/options/);
    assert.match(SERVER, /\/api\/webauthn\/register\/verify/);
    assert.match(SERVER, /\/api\/webauthn\/login\/options/);
    assert.match(SERVER, /\/api\/webauthn\/login\/verify/);
    assert.match(SERVER, /\/api\/webauthn\/credentials/);

    // Registro y gestión exigen sesión; login exige tempToken de 2FA.
    assert.match(SERVER, /app\.post\('\/api\/webauthn\/register\/options',\s*requireAuth/);
    assert.match(SERVER, /app\.post\('\/api\/webauthn\/register\/verify',\s*requireAuth/);
    assert.match(SERVER, /app\.get\('\/api\/webauthn\/credentials',\s*requireAuth/);
    assert.match(SERVER, /app\.delete\('\/api\/webauthn\/credentials\/:id',\s*requireAuth/);
});

test('server: el registro exige contraseña actual', () => {
    const block = SERVER.slice(
        SERVER.indexOf("app.post('/api/webauthn/register/options'"),
        SERVER.indexOf("app.get('/api/webauthn/credentials'")
    );
    assert.match(block, /bcrypt\.compare\(String\(password \|\| ''\), account\.password\)/);
    assert.match(block, /status\(401\)/);
});

test('server: no permite registrar passkey sin TOTP activo (respaldo)', () => {
    const block = SERVER.slice(
        SERVER.indexOf("app.post('/api/webauthn/register/options'"),
        SERVER.indexOf("app.get('/api/webauthn/credentials'")
    );
    const checks = block.match(/has2FAEnabled\(account\.username\)/g) || [];
    assert.equal(checks.length, 2, 'options y verify deben exigir TOTP activo');
    assert.match(block, /método de respaldo/);
});

test('server: la verificación usa challenge de un solo uso y RP/origin configurados', () => {
    assert.match(SERVER, /consumeWebAuthnChallenge\(account\.username, 'registration'\)/);
    assert.match(SERVER, /consumeWebAuthnChallenge\(payload\.username, 'authentication'\)/);
    assert.match(SERVER, /expectedOrigin:\s*WEBAUTHN_ORIGINS/);
    assert.match(SERVER, /expectedRPID:\s*WEBAUTHN_RP_ID/);
    assert.match(SERVER, /requireUserVerification:\s*true/);
});

test('server: el login con passkey rechaza credenciales de otro usuario', () => {
    const block = SERVER.slice(SERVER.indexOf("app.post('/api/webauthn/login/verify'"));
    assert.match(block, /!row \|\| row\.username !== payload\.username/);
    assert.match(block, /b64url\.decode\(row\.public_key\)/);
    assert.match(block, /updateWebAuthnCounter\(row\.credential_id,\s*verification\.authenticationInfo\.newCounter\)/);
});

test('server: el login expone hasWebAuthn sin filtrar passkeys', () => {
    assert.match(SERVER, /hasWebAuthn:\s*webauthnCreds\.length > 0/);
    // El listado del perfil nunca devuelve la clave pública.
    const listBlock = SERVER.slice(
        SERVER.indexOf("app.get('/api/webauthn/credentials'"),
        SERVER.indexOf("app.delete('/api/webauthn/credentials/:id'")
    );
    assert.doesNotMatch(listBlock, /public_key:/);
});
