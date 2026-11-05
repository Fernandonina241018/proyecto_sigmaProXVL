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

function loadAuth({ variant = 'v2', fetchImpl = null, url = 'http://localhost/indexx.html', WebAuthn = null } = {}) {
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
  if (WebAuthn) sandbox.WebAuthn = WebAuthn;
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox);
  return { window, document: window.document, Auth: vm.runInContext('Auth', sandbox), sandbox };
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

  test('2FA: el sexto dígito envía el código automáticamente', async () => {
    let calls = 0;
    const { window, document, Auth } = loadAuth({
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

    const input = document.getElementById('auth-totp');
    input.value = '123456';
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
    await tick(320);

    expect(calls).toBe(2);
    expect(document.getElementById('auth-progress').textContent).toContain('Código válido');
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

  test('passkey: se ofrece solo si el usuario tiene una y el navegador la soporta', async () => {
    const seen = [];
    const WebAuthn = {
      soportado: () => true,
      autenticar: async (args) => { seen.push(args); return { ok: true, username: 'ana', role: 'analista', token: 'tok' }; },
    };
    const { document, Auth } = loadAuth({
      variant: 'v2',
      WebAuthn,
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ requires2FA: true, hasWebAuthn: true, tempToken: 'tmp', username: 'ana', role: 'analista' }),
      }),
    });
    Auth.showLogin();
    fillAndSubmit(document);
    await tick(10);

    const area = document.getElementById('auth-passkey-area');
    expect(area).not.toBeNull();
    expect(area.style.display).toBe('block');

    document.getElementById('auth-btn-passkey').click();
    await tick(10);

    expect(seen.length).toBe(1);
    expect(seen[0].tempToken).toBe('tmp');
    expect(document.getElementById('auth-progress').textContent).toContain('Passkey verificada');
  });

  test('passkey: sin hasWebAuthn el botón queda oculto y el TOTP sigue disponible', async () => {
    const { document, Auth } = loadAuth({
      variant: 'v2',
      WebAuthn: { soportado: () => true, autenticar: async () => ({ ok: true }) },
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ requires2FA: true, hasWebAuthn: false, tempToken: 'tmp', username: 'ana', role: 'analista' }),
      }),
    });
    Auth.showLogin();
    fillAndSubmit(document);
    await tick(10);

    expect(document.getElementById('auth-passkey-area').style.display).toBe('none');
    expect(document.getElementById('auth-totp')).not.toBeNull();
    expect(document.getElementById('auth-btn-2fa')).not.toBeNull();
  });

  test('passkey: si falla, muestra el error y mantiene el TOTP como respaldo', async () => {
    const { document, Auth } = loadAuth({
      variant: 'v2',
      WebAuthn: {
        soportado: () => true,
        autenticar: async () => ({ ok: false, error: 'Credencial no reconocida.' }),
      },
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ requires2FA: true, hasWebAuthn: true, tempToken: 'tmp', username: 'ana', role: 'analista' }),
      }),
    });
    Auth.showLogin();
    fillAndSubmit(document);
    await tick(10);

    document.getElementById('auth-btn-passkey').click();
    await tick(10);

    const error = document.getElementById('auth-2fa-error');
    expect(error.style.display).toBe('block');
    expect(error.textContent).toContain('Credencial no reconocida.');
    expect(error.textContent).toContain('Usa el código de tu app');
    expect(document.getElementById('auth-btn-passkey').disabled).toBe(false);
    expect(document.getElementById('auth-totp')).not.toBeNull();
  });
});
