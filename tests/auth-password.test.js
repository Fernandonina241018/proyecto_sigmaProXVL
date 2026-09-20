import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

// Harness: sesión válida con cambio forzado → Auth.init muestra el modal directo.
function loadAuthHarness(pwdResponder) {
  const window = new Window();
  const document = window.document;
  const captured = { bodies: [] };
  const toasts = [];
  const exp = Date.now() + 5 * 60 * 1000;
  window.sessionStorage.setItem('auth_session', JSON.stringify({
    username: 'ana', role: 'analista', loginTime: Date.now(), expiresAt: exp, mustChangePassword: true,
  }));
  window.sessionStorage.setItem('auth_token', 'tok-test');
  const sandbox = {
    console,
    window, document,
    sessionStorage: window.sessionStorage,
    localStorage: window.localStorage,
    setTimeout, clearTimeout, setInterval, clearInterval,
    showToast: (m) => { toasts.push(String(m)); },
    escapeHtml: (s) => String(s),
    API_URL: 'http://x',
    fetchWithTimeout: async (url, opts) => {
      const u = String(url);
      if (u.includes('/api/users/password')) {
        captured.bodies.push(JSON.parse((opts && opts.body) || '{}'));
        return { json: async () => pwdResponder() };
      }
      return { ok: true, json: async () => ({ ok: true }) };
    },
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'auth.js'), 'utf-8'), sandbox);
  return { sandbox, document, toasts, captured };
}

function fillValid(sandbox) {
  const d = sandbox.document;
  d.getElementById('force-pwd-new').value = 'Aa1!xxxx';
  d.getElementById('force-pwd-confirm').value = 'Aa1!xxxx';
  d.getElementById('force-pwd-sig').value = 'TST-1';
}
const tick = (ms = 60) => new Promise((r) => setTimeout(r, ms));

describe('Modal cambio forzado: letras negras explícitas', () => {
  test('los 3 inputs tienen texto oscuro sobre fondo blanco', async () => {
    const { sandbox, document } = loadAuthHarness(() => ({ ok: true }));
    await vm.runInContext('Auth.init({})', sandbox);
    for (const id of ['force-pwd-new', 'force-pwd-confirm', 'force-pwd-sig', 'force-pwd-current']) {
      const el = document.getElementById(id);
      expect(el).not.toBeNull();
      // happy-dom devuelve el valor tal cual (#111827) o normalizado rgb(17, 24, 39)
      expect(el.style.color).toMatch(/#111827|17, 24, 39/);
      expect(el.style.backgroundColor).toMatch(/#fff|255, 255, 255/);
    }
  });
});

describe('Modal cambio forzado: campo actual dinámico', () => {
  test('ante error "actual" revela el campo y reintenta con él', async () => {
    let mode = 'need-current';
    const { sandbox, document, captured } = loadAuthHarness(() =>
      mode === 'need-current' ? { error: 'Debe proporcionar la contraseña actual' } : { ok: true });
    await vm.runInContext('Auth.init({})', sandbox);
    const wrap = document.getElementById('force-pwd-current-wrap');
    expect(wrap.style.display).toBe('none');
    fillValid(sandbox);
    document.getElementById('force-pwd-submit').click();
    await tick();
    expect(wrap.style.display).toBe('block');
    expect(document.getElementById('force-pwd-msg').textContent).toMatch('actual');
    // Segundo intento con la actual → el body la incluye y el modal se cierra.
    mode = 'ok';
    document.getElementById('force-pwd-current').value = 'Old1!xxx';
    document.getElementById('force-pwd-submit').click();
    await tick();
    expect(captured.bodies[1].currentPassword).toBe('Old1!xxx');
    expect(document.getElementById('force-pwd-modal')).toBeNull();
  });

  test('sin error de actual no pide la actual (flujo temporal normal)', async () => {
    const { sandbox, document, captured } = loadAuthHarness(() => ({ ok: true }));
    await vm.runInContext('Auth.init({})', sandbox);
    expect(document.getElementById('force-pwd-current-wrap').style.display).toBe('none');
    fillValid(sandbox);
    document.getElementById('force-pwd-submit').click();
    await tick();
    // Éxito al primer intento: no se envió actual y el modal se cerró.
    expect(captured.bodies[0].currentPassword).toBeUndefined();
    expect(document.getElementById('force-pwd-modal')).toBeNull();
  });
});
