// Timeout por área: 15 min en Validaciones, 5 min en el resto.
// Salida del módulo al expirar (hide + clearArea + login).
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');
const SRC = readFileSync(join(core, 'auth.js'), 'utf-8');

function loadAuth(area) {
  const store = {};
  const sandbox = {
    console,
    API_URL: '',
    Date: globalThis.Date,
    setTimeout: (...a) => globalThis.setTimeout(...a),
    clearTimeout: (...a) => globalThis.clearTimeout(...a),
    setInterval: (...a) => globalThis.setInterval(...a),
    clearInterval: (...a) => globalThis.clearInterval(...a),
    sessionStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    document: {
      getElementById: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      createElement: () => null,
      body: {},
    },
    AreaSelect: { getArea: () => area, clearArea: vi.fn() },
    Validaciones: { hide: vi.fn() },
    fetch: () => Promise.reject(new Error('sin red')),
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox);
  const Auth = vm.runInContext('Auth', sandbox);
  return { sb: sandbox, store, Auth };
}

describe('timeout por área', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  test('15 min en validaciones, 5 min en estadística', () => {
    vi.setSystemTime(new Date('2026-09-30T12:00:00'));
    const { store, Auth } = loadAuth('validaciones');
    store.auth_session = JSON.stringify({ username: 'a', role: 'admin', expiresAt: 0 });
    Auth.keepAlive();
    expect(JSON.parse(store.auth_session).expiresAt).toBe(new Date('2026-09-30T12:15:00').getTime());

    const e2 = loadAuth('estadistica');
    e2.store.auth_session = JSON.stringify({ username: 'a', role: 'admin', expiresAt: 0 });
    e2.Auth.keepAlive();
    expect(JSON.parse(e2.store.auth_session).expiresAt).toBe(new Date('2026-09-30T12:05:00').getTime());
  });

  test('configuración y salida del módulo en el código', () => {
    expect(SRC).toContain('VALIDACIONES_TIMEOUT_MS: 15 * 60 * 1000');
    expect(SRC).toContain("AreaSelect.getArea() === 'validaciones'");
    expect(SRC).toContain('_salirDeValidaciones');
    expect(SRC).toContain('Validaciones.hide');
    expect(SRC).toContain('AreaSelect.clearArea');
    expect(SRC).toContain("addEventListener('sigma-area'");
    // _expireSession sale del módulo antes de mostrar el login
    const iExp = SRC.indexOf('function _expireSession');
    const iSalir = SRC.indexOf('_salirDeValidaciones(); _clearSession(); showLogin');
    expect(iExp).toBeGreaterThan(-1);
    expect(iSalir).toBeGreaterThan(iExp);
  });
});
