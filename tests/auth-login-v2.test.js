// Login V2 — híbrido oficial (tarjeta recordada + QR + proyecto).
// Verifica selección de variante, render, IDs compartidos y tarjeta.
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

describe('login V2 — selección de variante', () => {
  test('por defecto se usa el login híbrido (v2)', () => {
    const { Auth } = loadAuth();
    expect(Auth.getLoginVariant()).toBe('v2');
  });

  test('v1 retirado: siempre se usa v2', () => {
    const { Auth } = loadAuth({ savedVariant: 'v1', url: 'http://localhost/indexx.html?login=v1' });
    expect(Auth.getLoginVariant()).toBe('v2');
    expect(Auth.setLoginVariant('v1')).toBe('v2');
  });
});

describe('login V2 — render y compatibilidad de IDs', () => {
  test('renderiza el híbrido y conserva los IDs de la lógica de auth', () => {
    const { document, Auth } = loadAuth({ savedVariant: 'v2' });
    Auth.showLogin();

    const overlay = document.getElementById('auth-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay.className).toContain('auth-v2');
    expect(overlay.querySelector('.card')).not.toBeNull();
    expect(overlay.querySelector('.topbar')).not.toBeNull();
    expect(document.getElementById('av2-card-title').textContent).toBe('StatAnalyzer Pro');
    expect(document.getElementById('av2-info-toggle')).not.toBeNull();
    expect(overlay.querySelector('.av2-brand-panel')).toBeNull();

    for (const id of [
      'auth-form-area', 'auth-user', 'auth-pass', 'auth-show-pass',
      'auth-remember', 'auth-eye', 'auth-eye-icon', 'auth-error',
      'auth-attempts-info', 'auth-btn-login', 'auth-btn-text',
      'auth-lockout-msg',
    ]) {
      expect(document.getElementById(id), `falta #${id}`).not.toBeNull();
    }
    expect(overlay.querySelector('.auth-avatar-container')).toBeNull();
  });

  test('muestra el motivo (logout/timeout) como banner', () => {
    const { document, Auth } = loadAuth({ savedVariant: 'v2' });
    Auth.showLogin('logout');
    const banner = document.querySelector('#auth-overlay .banner');
    expect(banner).not.toBeNull();
    expect(banner.textContent).toMatch('Sesión cerrada');
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

  test('un login fallido muestra el error dentro del híbrido', async () => {
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

describe('login V2 — tarjeta recordada e información de proyecto', () => {
  test('pinta la tarjeta desde la caché real del perfil', () => {
    const { window, document, Auth } = loadAuth({ savedVariant: 'v2' });
    window.localStorage.setItem('__auth_remembered', JSON.stringify({ username: 'ana' }));
    window.localStorage.setItem('__auth_profile_cache', JSON.stringify({
      username: 'ana', nombre: 'Ana', apellido: 'Nina', email: 'ana@empresa.com',
      cargo: 'Control de Calidad', role: 'analista', lastLoginAt: new Date().toISOString(),
      loginCount: 24, has2FA: true, lastIpMasked: '190.12.•.•',
    }));
    Auth.showLogin();

    expect(document.getElementById('av2-remembered').hidden).toBe(false);
    expect(document.getElementById('av2-user-field').hidden).toBe(true);
    expect(document.getElementById('av2-remembered-name').textContent).toBe('Ana Nina');
    expect(document.getElementById('av2-remembered-role').textContent).toBe('Analista');
    expect(document.getElementById('av2-remembered-area').textContent).toBe('Control de Calidad');
    expect(document.getElementById('av2-remembered-logins').textContent).toBe('24');
    expect(document.getElementById('av2-remembered-ip').textContent).toBe('190.12.•.•');
  });

  test('el último acceso se muestra en hora local desde un timestamp UTC sin Z', () => {
    const { window, document, Auth } = loadAuth({ savedVariant: 'v2' });
    const now = new Date();
    const serverUtc = now.toISOString().slice(0, 19); // como PostgreSQL: sin Z
    window.localStorage.setItem('__auth_remembered', JSON.stringify({ username: 'ana' }));
    window.localStorage.setItem('__auth_profile_cache', JSON.stringify({
      username: 'ana', nombre: 'Ana', role: 'analista', loginCount: 1,
      lastLoginAt: serverUtc, has2FA: false,
    }));
    Auth.showLogin();
    const local = new Date(serverUtc + 'Z');
    const hm = String(local.getHours()).padStart(2, '0') + ':' + String(local.getMinutes()).padStart(2, '0');
    expect(document.getElementById('av2-remembered-last').textContent).toBe('hoy, ' + hm);
  });

  test('Cambiar oculta la tarjeta y muestra el campo de usuario', () => {
    const { window, document, Auth } = loadAuth({ savedVariant: 'v2' });
    window.localStorage.setItem('__auth_remembered', JSON.stringify({ username: 'ana' }));
    window.localStorage.setItem('__auth_profile_cache', JSON.stringify({
      username: 'ana', nombre: 'Ana', role: 'analista', loginCount: 1,
    }));
    Auth.showLogin();
    document.getElementById('av2-change-user').click();
    expect(document.getElementById('av2-remembered').hidden).toBe(true);
    expect(document.getElementById('av2-user-field').hidden).toBe(false);
    expect(document.getElementById('auth-user').value).toBe('');
  });

  test('una nueva versión muestra el aviso Actualizar dentro de la tarjeta', () => {
    const { window, document, Auth } = loadAuth({ savedVariant: 'v2' });
    Auth.showLogin();
    window.dispatchEvent(new window.CustomEvent('sigma:version-available', { detail: { version: 'abc1234' } }));
    const box = document.getElementById('av2-update');
    expect(box.hidden).toBe(false);
    expect(document.getElementById('av2-update-version').textContent).toContain('abc1234');
    expect(document.getElementById('av2-update-btn').textContent).toBe('Actualizar');
    expect(document.querySelector('#auth-overlay .card').classList.contains('has-update')).toBe(true);
  });

  test('Recordar usuario viene marcado por defecto y el opt-out persiste', () => {
    const { window, document, Auth } = loadAuth({ savedVariant: 'v2' });
    Auth.showLogin();
    let cb = document.getElementById('auth-remember');
    expect(cb.checked).toBe(true);

    window.localStorage.setItem('__auth_remembered', JSON.stringify({ username: 'ana' }));
    window.localStorage.setItem('__auth_profile_cache', JSON.stringify({ username: 'ana' }));
    cb.checked = false;
    cb.dispatchEvent(new window.Event('change'));
    expect(window.localStorage.getItem('__auth_remember_optout')).toBe('1');
    expect(window.localStorage.getItem('__auth_remembered')).toBeNull();
    expect(window.localStorage.getItem('__auth_profile_cache')).toBeNull();

    Auth.showLogin();
    cb = document.getElementById('auth-remember');
    expect(cb.checked).toBe(false);

    cb.checked = true;
    cb.dispatchEvent(new window.Event('change'));
    expect(window.localStorage.getItem('__auth_remember_optout')).toBeNull();
    Auth.showLogin();
    expect(document.getElementById('auth-remember').checked).toBe(true);
  });

  test('el panel de proyecto muestra al responsable y se cierra', () => {
    const { document, Auth } = loadAuth({ savedVariant: 'v2' });
    Auth.showLogin();
    document.getElementById('av2-info-toggle').click();
    expect(document.getElementById('av2-project-info').hidden).toBe(false);
    expect(document.getElementById('av2-project-owner').textContent).toContain('Fernando Alberto');
    document.getElementById('av2-project-close').click();
    expect(document.getElementById('av2-project-info').hidden).toBe(true);
  });
});
