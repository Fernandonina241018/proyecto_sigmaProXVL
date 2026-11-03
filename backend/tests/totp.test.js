// Contrato TOTP con otplib v13 — la v13 eliminó `authenticator` y `verify`
// pasó a ser async. Los helpers viven en backend/totp.js y server.js los
// importa: este test ejercita el MISMO módulo de producción (no una copia),
// además de fijar el manejo de tokens inválidos (no debe lanzar hacia el
// endpoint, donde un catch convertiría un bypass en 500).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { generateSecret, generateURI, generateSync } = require('otplib');
const { verifyTOTP, totpKeyuri } = require('../totp');

test('generateSecret produce un secreto base32 compatible', () => {
    const secret = generateSecret();
    assert.equal(typeof secret, 'string');
    assert.ok(secret.length >= 16);
    assert.match(secret, /^[A-Z2-7]+=*$/);
});

test('totpKeyuri conserva el formato otpauth de la v12 (issuer + label)', () => {
    const secret = generateSecret();
    const uri = totpKeyuri('ana', secret);
    assert.match(uri, /^otpauth:\/\/totp\//);
    assert.ok(uri.includes('StatAnalyzer%20Pro:ana'));
    assert.ok(uri.includes(`secret=${secret}`));
    assert.ok(uri.includes('issuer=StatAnalyzer%20Pro'));
});

test('totpKeyuri coincide con generateURI para el mismo issuer', () => {
    const secret = generateSecret();
    assert.equal(
        totpKeyuri('ana', secret),
        generateURI({ issuer: 'StatAnalyzer Pro', label: 'ana', secret })
    );
});

test('verifyTOTP acepta el código vigente y rechaza uno incorrecto', () => {
    const secret = generateSecret();
    const token = generateSync({ secret });
    assert.equal(verifyTOTP(token, secret), true);
    assert.equal(verifyTOTP(token === '000000' ? '111111' : '000000', secret), false);
});

test('verifyTOTP trata tokens mal formados como inválidos (no lanza)', () => {
    const secret = generateSecret();
    assert.equal(verifyTOTP('123', secret), false);
    assert.equal(verifyTOTP('', secret), false);
    assert.equal(verifyTOTP(undefined, secret), false);
});

test('server.js importa los helpers de ./totp (no los reimplementa)', () => {
    const server = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
    assert.match(server, /require\(['"]\.\/totp['"]\)/);
    assert.doesNotMatch(server, /function\s+verifyTOTP\s*\(/);
    assert.doesNotMatch(server, /function\s+totpKeyuri\s*\(/);
});
