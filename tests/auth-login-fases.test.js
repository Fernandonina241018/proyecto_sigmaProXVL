// Login real — fases de progreso visibles (conexión, BD, perfil y 2FA).
// Portadas del prototipo V2 a js/core/auth.js sin tocar el flujo de auth.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';
import { describe, test, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');
const SRC = readFileSync(join(core, 'auth.js'), 'utf-8');

function loadAuth({ variant = 'v2', fetchImpl = null, url = 'http://localhost/indexx.html' } = {}) {
  const window = new Window({ url });
  window.localStorage.setItem('__auth_login_variant', variant);
  const sandbox = {
    console,
    window,
    document: window.document,
    navigator: window.navigator,
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

function deferred() {
  let resolve;
  const promise = new Promise((r) => { resolve = r; });
  return { promise, resolve };
}

function fillAndSubmit(document) {
  document.getElementById('auth-user').value = 'ana';
  document.getElementById('auth-pass').value = 'clave';
  document.getElementById('auth-btn-login').click();
}

describe('login real — fases de progreso', () => {
  test('el aviso de progreso existe y arranca oculto en V2', () => {
    const { document, Auth } = loadAuth({ variant: 'v2' });
    Auth.showLogin();
    const progress = document.getElementById('auth-progress');
    expect(progress).not.toBeNull();
    expect(progress.hidden).toBe(true);
    expect(progress.getAttribute('role')).toBe('status');
    expect(progress.getAttribute('aria-live')).toBe('polite');
  });

  test('conexión → verificación en la base de datos mientras el servidor responde', async () => {
    const pending = deferred();
    const { document, Auth } = loadAuth({ variant: 'v2', fetchImpl: () => pending.promise });
    Auth.showLogin();
    fillAndSubmit(document);
    await tick(10);

    const progress = document.getElementById('auth-progress');
    expect(progress.hidden).toBe(false);
    expect(progress.className).toContain('info');
    expect(progress.textContent).toContain('Conectando con el servidor');
    expect(progress.querySelector('.spin')).not.toBeNull();

    await tick(380);
    expect(progress.textContent).toContain('Verificando usuario y contraseña');
    expect(progress.textContent).toContain('base de datos');

    pending.resolve({ ok: false, json: async () => ({ error: 'Credenciales incorrectas' }) });
    await tick(10);
    expect(progress.hidden).toBe(true);
    expect(document.getElementById('auth-error').textContent).toContain('Credenciales incorrectas');
  });

  test('acceso concedido: fase final en verde antes de cargar la sesión', async () => {
    const { document, Auth } = loadAuth({
      variant: 'v2',
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ username: 'ana', role: 'analista', token: 'tok' }),
      }),
    });
    Auth.showLogin();
    fillAndSubmit(document);
    await tick(10);

    const progress = document.getElementById('auth-progress');
    expect(progress.hidden).toBe(false);
    expect(progress.className).toContain('ok');
    expect(progress.textContent).toContain('Acceso concedido');
    expect(progress.textContent).toContain('Cargando perfil y sesión');
  });

  test('2FA: fase de validación y fase de código válido', async () => {
    let calls = 0;
    const { document, Auth } = loadAuth({
      variant: 'v2',
      fetchImpl: async () => {
        calls++;
        if (calls === 1) {
          return { ok: true, json: async () => ({ requires2FA: true, tempToken: 'tmp', username: 'ana', role: 'analista' }) };
        }
        return { ok: true, json: async () => ({ username: 'ana', role: 'analista', token: 'tok' }) };
      },
    });
    Auth.showLogin();
    fillAndSubmit(document);
    await tick(10);

    const progress = document.getElementById('auth-progress');
    expect(progress.textContent).toContain('segundo paso');

    document.getElementById('auth-totp').value = '123456';
    document.getElementById('auth-btn-2fa').click();
    await tick(10);

    expect(progress.className).toContain('ok');
    expect(progress.textContent).toContain('Código válido');
    expect(progress.textContent).toContain('Cargando perfil y sesión');
  });

  test('2FA incorrecto: fase en rojo y el texto del servidor no se interpreta como HTML', async () => {
    let calls = 0;
    const { document, Auth } = loadAuth({
      variant: 'v2',
      fetchImpl: async () => {
        calls++;
        if (calls === 1) {
          return { ok: true, json: async () => ({ requires2FA: true, tempToken: 'tmp', username: 'ana', role: 'analista' }) };
        }
        return { ok: false, json: async () => ({ error: '<img src=x onerror=alert(1)>' }) };
      },
    });
    Auth.showLogin();
    fillAndSubmit(document);
    await tick(10);

    document.getElementById('auth-totp').value = '000000';
    document.getElementById('auth-btn-2fa').click();
    await tick(10);

    const progress = document.getElementById('auth-progress');
    expect(progress.className).toContain('error');
    expect(progress.textContent).toContain('Código incorrecto');
    expect(progress.querySelector('img')).toBeNull();
    expect(document.getElementById('auth-2fa-error').querySelector('img')).toBeNull();
  });
});
