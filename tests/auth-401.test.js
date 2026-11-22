// 401 con code=AUTH_INVALID (JWT vencido, secreto rotado o revocado) → login.
// El 401 de credenciales incorrectas NO debe cerrar la sesión.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { describe, test, expect, vi } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = readFileSync(join(__dirname, '..', 'js', 'core', 'utils.js'), 'utf-8');

function loadUtils(fetchImpl, Auth) {
  const sandbox = {
    console,
    setTimeout: (...a) => globalThis.setTimeout(...a),
    clearTimeout: (...a) => globalThis.clearTimeout(...a),
    AbortController: globalThis.AbortController,
    location: { search: '' },
    document: { querySelector: () => null, createElement: () => ({}) },
    fetch: fetchImpl,
    Auth,
  };
  sandbox.window = { location: { hostname: 'localhost' }, __cargarScript: () => {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox);
  return vm.runInContext('fetchWithTimeout', sandbox);
}

function res401(body) {
  return {
    status: 401,
    clone: () => ({ json: () => Promise.resolve(body) }),
  };
}

describe('401 de token muerto', () => {
  test('code=AUTH_INVALID cierra la sesión', async () => {
    const Auth = { expire: vi.fn() };
    const f = loadUtils(
      () => Promise.resolve(res401({ error: 'Token inválido o expirado', code: 'AUTH_INVALID' })),
      Auth
    );
    await f('http://x/api/me');
    expect(Auth.expire).toHaveBeenCalledTimes(1);
  });

  test('un 401 de credenciales no cierra la sesión', async () => {
    const Auth = { expire: vi.fn() };
    const f = loadUtils(
      () => Promise.resolve(res401({ error: 'Credenciales incorrectas' })),
      Auth
    );
    await f('http://x/api/login');
    expect(Auth.expire).not.toHaveBeenCalled();
  });

  test('otros estados no tocan la sesión', async () => {
    const Auth = { expire: vi.fn() };
    const f = loadUtils(() => Promise.resolve({ status: 500 }), Auth);
    await f('http://x/api/me');
    expect(Auth.expire).not.toHaveBeenCalled();
  });

  test('el body ilegible no rompe la petición', async () => {
    const Auth = { expire: vi.fn() };
    const f = loadUtils(
      () => Promise.resolve({ status: 401, clone: () => ({ json: () => Promise.reject(new Error('sin body')) }) }),
      Auth
    );
    const res = await f('http://x/api/me');
    expect(res.status).toBe(401);
    expect(Auth.expire).not.toHaveBeenCalled();
  });
});
