// Login V2 — convive con el login clásico (v1).
// Verifica resolución de variante, render del rediseño y que los IDs que
// usa la lógica de auth (login/2FA/bloqueo/recordarme) siguen existiendo.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';
import { describe, test, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');
const SRC = readFileSync(join(core, 'auth.js'), 'utf-8');

function loadAuth({ url = 'http://localhost/indexx.html', savedVariant = null, fetchImpl = null } = {}) {
  const window = new Window({ url });
  if (savedVariant) window.localStorage.setItem('__auth_login_variant', savedVariant);
  const sandbox = {
    console,
    window,
    document: window.document,
    sessionStorage: window.sessionStorage,
    localStorage: window.localStorage,
    URLSearchParams,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    API_URL: 'http://backend.test',
    fetchWithTimeout: fetchImpl || (async () => ({ ok: true, json: async () => ({}) })),
    fetch: async () => ({ ok: true, json: async () => ({}) }),
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox);
  return { window, document: window.document, Auth: vm.runInContext('Auth', sandbox) };
}

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

describe('login V2 — selección de variante', () => {
  test('por defecto se mantiene el login clásico (v1)', () => {
    const { Auth } = loadAuth();
    expect(Auth.getLoginVariant()).toBe('v1');
  });

  test('localStorage activa v2 y setLoginVariant lo persiste', () => {
    const { window, Auth } = loadAuth({ savedVariant: 'v2' });
    expect(Auth.getLoginVariant()).toBe('v2');
    expect(Auth.setLoginVariant('v1')).toBe('v1');
    expect(window.localStorage.getItem('__auth_login_variant')).toBe('v1');
  });

  test('?login=v2 tiene prioridad sobre localStorage', () => {
    const { Auth } = loadAuth({ url: 'http://localhost/indexx.html?login=v2', savedVariant: 'v1' });
    expect(Auth.getLoginVariant()).toBe('v2');
  });

  test('?login=v1 permite volver al clásico sin borrar la preferencia', () => {
    const { window, Auth } = loadAuth({ url: 'http://localhost/indexx.html?login=v1', savedVariant: 'v2' });
    expect(Auth.getLoginVariant()).toBe('v1');
    expect(window.localStorage.getItem('__auth_login_variant')).toBe('v2');
  });
});

describe('login V2 — render y compatibilidad de IDs', () => {
  test('renderiza el rediseño y conserva los IDs de la lógica de auth', () => {
    const { document, Auth } = loadAuth({ savedVariant: 'v2' });
    Auth.showLogin();

    const overlay = document.getElementById('auth-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay.className).toContain('auth-v2');
    expect(overlay.querySelector('.av2-brand-panel')).not.toBeNull();
    expect(overlay.querySelector('.av2-control-chart')).not.toBeNull();

    for (const id of [
      'auth-form-area', 'auth-user', 'auth-pass', 'auth-show-pass',
      'auth-remember', 'auth-eye', 'auth-eye-icon', 'auth-error',
      'auth-attempts-info', 'auth-btn-login', 'auth-btn-text',
      'auth-lockout-msg',
    ]) {
      expect(document.getElementById(id), `falta #${id}`).not.toBeNull();
    }
    // No debe quedar el logo/avatar del login clásico.
    expect(overlay.querySelector('.auth-avatar-container')).toBeNull();
  });

  test('muestra el motivo (logout/timeout) en el panel', () => {
    const { document, Auth } = loadAuth({ savedVariant: 'v2' });
    Auth.showLogin('logout');
    const status = document.querySelector('#auth-overlay .av2-status');
    expect(status).not.toBeNull();
    expect(status.textContent).toMatch('Sesión cerrada');
  });

  test('el ojo muestra/oculta la contraseña', () => {
    const { document, Auth } = loadAuth({ savedVariant: 'v2' });
    Auth.showLogin();
    const pass = document.getElementById('auth-pass');
    expect(pass.type).toBe('password');
    document.getElementById('auth-eye').click();
    expect(pass.type).toBe('text');
    expect(document.getElementById('auth-show-pass').checked).toBe(true);
    document.getElementById('auth-eye').click();
    expect(pass.type).toBe('password');
  });

  test('un login fallido muestra el error dentro del rediseño', async () => {
    const { document, Auth } = loadAuth({
      savedVariant: 'v2',
      fetchImpl: async () => ({ ok: false, json: async () => ({ error: 'Credenciales incorrectas' }) }),
    });
    Auth.showLogin();
    document.getElementById('auth-user').value = 'd.nina';
    document.getElementById('auth-pass').value = 'mala';
    document.getElementById('auth-btn-login').click();
    await tick(10);

    const error = document.getElementById('auth-error');
    expect(error.style.display).toBe('block');
    expect(error.textContent).toMatch('Credenciales incorrectas');
    expect(document.getElementById('auth-btn-login').disabled).toBe(false);
    expect(document.getElementById('auth-btn-text').textContent).toBe('Iniciar sesión');
  });

  test('2FA: volver desde el código regresa al login V2 (no al clásico)', async () => {
    const { document, Auth } = loadAuth({
      savedVariant: 'v2',
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ requires2FA: true, tempToken: 'tmp', username: 'ana', role: 'analista' }),
      }),
    });
    Auth.showLogin();
    document.getElementById('auth-user').value = 'ana';
    document.getElementById('auth-pass').value = 'clave';
    document.getElementById('auth-btn-login').click();
    await tick(10);

    expect(document.getElementById('auth-totp')).not.toBeNull();
    document.getElementById('auth-back-to-login').click();

    expect(document.getElementById('auth-overlay').className).toContain('auth-v2');
    expect(document.getElementById('auth-user')).not.toBeNull();
    expect(document.getElementById('auth-totp')).toBeNull();
  });
});
