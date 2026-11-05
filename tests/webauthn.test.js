// webauthn.js — conversión base64url <-> ArrayBuffer y flujos del navegador.
// El backend ya está cubierto por backend/tests/webauthn.test.js; aquí se
// fija el contrato con navigator.credentials sin necesidad de un autenticador
// real.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { describe, test, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = readFileSync(join(__dirname, '..', 'js', 'core', 'webauthn.js'), 'utf-8');

function loadWebAuthn({ fetchImpl = null, credentials = null } = {}) {
  const calls = [];
  const navigator = credentials ? { credentials } : {};
  const sandbox = {
    console,
    navigator,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    Uint8Array,
    API_URL: 'http://backend.test',
    Auth: { getToken: () => 'tok-123' },
    fetchWithTimeout: fetchImpl || (async () => ({ ok: true, json: async () => ({}) })),
    fetch: fetchImpl || (async () => ({ ok: true, json: async () => ({}) })),
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox);
  return { WebAuthn: vm.runInContext('WebAuthn', sandbox), calls };
}

function b64url(buf) {
  return Buffer.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf)).toString('base64url');
}

function jsonResponse(data, ok = true, status = 200) {
  return { ok, status, json: async () => data };
}

function fakeCredential({ registration = true } = {}) {
  const rawId = new Uint8Array([1, 2, 3, 250, 255]).buffer;
  const clientDataJSON = new TextEncoder().encode('{"type":"webauthn"}').buffer;
  const response = { clientDataJSON };
  if (registration) {
    response.attestationObject = new Uint8Array([10, 20, 30]).buffer;
    response.getTransports = () => ['internal', 'hybrid'];
  } else {
    response.authenticatorData = new Uint8Array([40, 50]).buffer;
    response.signature = new Uint8Array([60, 70, 80]).buffer;
    response.userHandle = new Uint8Array([90, 91]).buffer;
  }
  return {
    id: 'cred-1',
    rawId,
    type: 'public-key',
    response,
    authenticatorAttachment: 'platform',
    getClientExtensionResults: () => ({ credProps: { rk: true } }),
  };
}

describe('webauthn.js — base64url', () => {
  test('round-trip conserva bytes y usa el alfabeto URL-safe', () => {
    const { WebAuthn } = loadWebAuthn();
    const bytes = new Uint8Array([0, 251, 255, 62, 63, 254]);
    const encoded = WebAuthn._bufToB64url(bytes);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(Buffer.from(encoded, 'base64url').equals(Buffer.from(bytes))).toBe(true);

    const decoded = new Uint8Array(WebAuthn._b64urlToBuf(encoded));
    expect(Array.from(decoded)).toEqual(Array.from(bytes));
  });

  test('acepta base64 estándar y padding', () => {
    const { WebAuthn } = loadWebAuthn();
    const decoded = new Uint8Array(WebAuthn._b64urlToBuf('aG9sYQ=='));
    expect(Buffer.from(decoded).toString()).toBe('hola');
  });
});

describe('webauthn.js — preparación de opciones', () => {
  test('decodifica challenge, user.id y excludeCredentials', () => {
    const { WebAuthn } = loadWebAuthn();
    const options = {
      challenge: b64url(new Uint8Array([1, 2, 3])),
      rp: { id: 'fernandonina241018.github.io', name: 'StatAnalyzer Pro' },
      user: { id: b64url(new Uint8Array([9, 8])), name: 'ana', displayName: 'Ana' },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      excludeCredentials: [{ id: b64url(new Uint8Array([7, 7])), transports: ['internal'] }],
      authenticatorSelection: { userVerification: 'required' },
    };
    const pub = WebAuthn._prepararCreacion(options);
    expect(pub.challenge instanceof ArrayBuffer).toBe(true);
    expect(Array.from(new Uint8Array(pub.challenge))).toEqual([1, 2, 3]);
    expect(Array.from(new Uint8Array(pub.user.id))).toEqual([9, 8]);
    expect(Array.from(new Uint8Array(pub.excludeCredentials[0].id))).toEqual([7, 7]);
    expect(pub.excludeCredentials[0].transports).toEqual(['internal']);
    expect(pub.rp.id).toBe('fernandonina241018.github.io');
  });

  test('prepara allowCredentials para el login', () => {
    const { WebAuthn } = loadWebAuthn();
    const pub = WebAuthn._prepararGet({
      challenge: b64url(new Uint8Array([4, 5])),
      rpId: 'fernandonina241018.github.io',
      allowCredentials: [{ id: b64url(new Uint8Array([6])), transports: ['hybrid'] }],
    });
    expect(Array.from(new Uint8Array(pub.challenge))).toEqual([4, 5]);
    expect(Array.from(new Uint8Array(pub.allowCredentials[0].id))).toEqual([6]);
  });
});

describe('webauthn.js — serialización de respuestas', () => {
  test('registro: base64url y transports', () => {
    const { WebAuthn } = loadWebAuthn();
    const out = WebAuthn._serializarRegistro(fakeCredential());
    expect(out.id).toBe('cred-1');
    expect(out.rawId).toBe(b64url(new Uint8Array([1, 2, 3, 250, 255])));
    expect(out.type).toBe('public-key');
    expect(out.response.attestationObject).toBe(b64url(new Uint8Array([10, 20, 30])));
    expect(out.response.transports).toEqual(['internal', 'hybrid']);
    expect(out.clientExtensionResults.credProps.rk).toBe(true);
  });

  test('login: incluye authenticatorData, signature y userHandle', () => {
    const { WebAuthn } = loadWebAuthn();
    const out = WebAuthn._serializarAuth(fakeCredential({ registration: false }));
    expect(out.response.authenticatorData).toBe(b64url(new Uint8Array([40, 50])));
    expect(out.response.signature).toBe(b64url(new Uint8Array([60, 70, 80])));
    expect(out.response.userHandle).toBe(b64url(new Uint8Array([90, 91])));
  });
});

describe('webauthn.js — flujos', () => {
  test('soportado() detecta navegadores sin WebAuthn', () => {
    expect(loadWebAuthn().WebAuthn.soportado()).toBe(false);
    const withCreds = loadWebAuthn({ credentials: { create: async () => null, get: async () => null } });
    expect(withCreds.WebAuthn.soportado()).toBe(true);
  });

  test('autenticar: options → credentials.get → verify devuelve token', async () => {
    const bodies = [];
    const fetchImpl = async (url, opts) => {
      bodies.push({ url, body: JSON.parse(opts.body) });
      if (url.endsWith('/login/options')) {
        return jsonResponse({
          ok: true,
          options: {
            challenge: b64url(new Uint8Array([1])),
            rpId: 'fernandonina241018.github.io',
            allowCredentials: [{ id: b64url(new Uint8Array([2])), type: 'public-key' }],
          },
        });
      }
      return jsonResponse({ ok: true, token: 'real-token', username: 'ana', role: 'analista' });
    };
    const credentials = { get: async () => fakeCredential({ registration: false }), create: async () => fakeCredential() };
    const { WebAuthn } = loadWebAuthn({ fetchImpl, credentials });

    const res = await WebAuthn.autenticar({ tempToken: 'tmp-1' });
    expect(res).toEqual({ ok: true, username: 'ana', role: 'analista', token: 'real-token' });
    expect(bodies[0].body.tempToken).toBe('tmp-1');
    expect(bodies[1].body.tempToken).toBe('tmp-1');
    expect(bodies[1].body.response.response.signature).toBeTruthy();
  });

  test('autenticar: cancelar en el dispositivo no lanza', async () => {
    const fetchImpl = async (url) => jsonResponse({
      ok: true,
      options: { challenge: b64url(new Uint8Array([1])), allowCredentials: [] },
    });
    const credentials = {
      get: async () => { const e = new Error('cancel'); e.name = 'NotAllowedError'; throw e; },
      create: async () => fakeCredential(),
    };
    const { WebAuthn } = loadWebAuthn({ fetchImpl, credentials });
    const res = await WebAuthn.autenticar({ tempToken: 'tmp' });
    expect(res.ok).toBe(false);
    expect(res.cancelled).toBe(true);
  });

  test('registrar: envía la contraseña en options y verify', async () => {
    const bodies = [];
    const fetchImpl = async (url, opts) => {
      bodies.push({ url, body: JSON.parse(opts.body), headers: opts.headers });
      if (url.endsWith('/register/options')) {
        return jsonResponse({
          ok: true,
          options: {
            challenge: b64url(new Uint8Array([1])),
            rp: { id: 'fernandonina241018.github.io', name: 'StatAnalyzer Pro' },
            user: { id: b64url(new Uint8Array([2])), name: 'ana', displayName: 'ana' },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          },
        });
      }
      return jsonResponse({ ok: true, message: 'Passkey registrada correctamente' });
    };
    const credentials = { create: async () => fakeCredential(), get: async () => fakeCredential({ registration: false }) };
    const { WebAuthn } = loadWebAuthn({ fetchImpl, credentials });

    const res = await WebAuthn.registrar({ password: 'clave-segura', deviceName: 'Laptop' });
    expect(res.ok).toBe(true);
    expect(bodies[0].body.password).toBe('clave-segura');
    expect(bodies[1].body.password).toBe('clave-segura');
    expect(bodies[1].body.deviceName).toBe('Laptop');
    expect(bodies[1].body.response.response.attestationObject).toBeTruthy();
    expect(bodies[0].headers.Authorization).toBe('Bearer tok-123');
  });

  test('autenticar sin tempToken no llama al servidor', async () => {
    let called = false;
    const { WebAuthn } = loadWebAuthn({
      fetchImpl: async () => { called = true; return jsonResponse({}); },
      credentials: { get: async () => null, create: async () => null },
    });
    const res = await WebAuthn.autenticar({});
    expect(res.ok).toBe(false);
    expect(called).toBe(false);
  });
});
