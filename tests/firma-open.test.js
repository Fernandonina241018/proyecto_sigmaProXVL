import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function block(role, label, name) {
  const v = name || '—';
  return (
    `<div data-signature-role="${role}"><div>${label}</div>` +
    `<div><span data-signature-field="name" data-signature-role="${role}">${v}</span></div>` +
    `<div><span data-signature-field="title" data-signature-role="${role}">—</span></div>` +
    `<div><span data-signature-field="firma" data-signature-role="${role}">—</span></div>` +
    `<div><span data-signature-field="date" data-signature-role="${role}">—</span></div>` +
    `</div>`
  );
}
const SESSION_HTML =
  `<html><head><title>R</title></head><body>` +
  block('prepared', 'Preparado por', '') +
  block('reviewed', 'Revisado por', '') +
  block('approved', 'Aprobado por', '') +
  `</body></html>`;

const FAKE_SESSION = {
  id: 99, name: 'RPT-T', html: SESSION_HTML,
  signatures: {
    prepared: { signed: true, username: 'ana', nombre: 'Ana', cargo: 'Lab', firma: 'F', fecha: '2026-01-01' },
  },
  status: 'partial', version: 1, created_by: 'ana',
  assigned_reviewer: 'beto', assigned_approver: null,
  created_at: '', updated_at: '', next_role: 'reviewed',
};

function loadOpenHarness() {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML =
    '<div id="firmaPreview"></div>' +
    '<div id="firmaSignatureEditor"></div>' +
    '<div id="firmaStatus"></div>' +
    '<div id="firmaActions"></div>' +
    '<div id="firmaBandejaList"></div>' +
    '<button id="firmaResetBtn"></button>' +
    '<span id="firmaPendingBadge"></span>';
  const toasts = [];
  const routes = {
    '/api/sign-sessions/99': { ok: true, session: FAKE_SESSION },
    'scope=pending': { ok: true, sessions: [] },
    'count=1': { ok: true, count: 0 },
  };
  const sandbox = {
    console,
    window, document,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    showToast: (m) => { toasts.push(String(m)); },
    escapeHtml: (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    fetchWithTimeout: async (url) => {
      for (const k of Object.keys(routes)) {
        if (String(url).includes(k)) return { json: async () => routes[k] };
      }
      throw new Error('offline:' + url);
    },
    Auth: { getToken: () => 't', getSession: () => ({ username: 'beto', role: 'analista' }) },
    API_URL: 'http://x',
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-firma.js'), 'utf-8'), sandbox);
  return { sandbox, document, toasts };
}

describe('_firmaOpenSession integración real (happy-dom)', () => {
  test('abre sesión: editor con 3 tarjetas y prepared firmado', async () => {
    const { sandbox, document, toasts } = loadOpenHarness();
    const ok = await vm.runInContext('_firmaOpenSession(99)', sandbox);
    expect(ok).toBe(true);
    const cards = document.querySelectorAll('#firmaSignatureEditor > div');
    expect(cards.length).toBe(3);
    const txt = document.getElementById('firmaSignatureEditor').textContent;
    expect(txt).toMatch('Ana');
  });

  test('preview muestra la firma pintada', async () => {
    const { sandbox, document } = loadOpenHarness();
    await vm.runInContext('_firmaOpenSession(99)', sandbox);
    const iframe = document.querySelector('#firmaPreview iframe');
    expect(iframe).not.toBeNull();
    expect(iframe.srcdoc).toMatch('Ana');
  });

  test('status refleja 1/3', async () => {
    const { sandbox, document } = loadOpenHarness();
    await vm.runInContext('_firmaOpenSession(99)', sandbox);
    expect(document.getElementById('firmaStatus').textContent).toMatch('1/3');
  });
});

describe('layout FP (stepper + doc + pie)', () => {
  test('stepper: 1 done + 1 now + count', async () => {
    const { sandbox, document } = loadOpenHarness();
    document.body.innerHTML += '<div id="firmaStepper"></div><b id="firmaDocName"></b>' +
      '<span id="firmaDocState"></span><p id="firmaFootHint"></p>' +
      '<button id="firmaDownloadBtn"></button>';
    await vm.runInContext('_firmaOpenSession(99)', sandbox);
    const steps = document.querySelectorAll('#firmaStepper .fp-step');
    expect(steps.length).toBe(3);
    expect(document.querySelectorAll('#firmaStepper .fp-step.is-done').length).toBe(1);
    expect(document.querySelectorAll('#firmaStepper .fp-step.is-now').length).toBe(1);
    expect(document.querySelector('#firmaStepper .fp-count').textContent).toMatch('1 de 3 firmas');
  });

  test('doc header + hint borrador + botón descarga', async () => {
    const { sandbox, document } = loadOpenHarness();
    document.body.innerHTML += '<div id="firmaStepper"></div><b id="firmaDocName"></b>' +
      '<span id="firmaDocState"></span><p id="firmaFootHint"></p>' +
      '<button id="firmaDownloadBtn"></button>';
    await vm.runInContext('_firmaOpenSession(99)', sandbox);
    expect(document.getElementById('firmaDocName').textContent).toBe('RPT-T');
    expect(document.getElementById('firmaDocState').textContent).toMatch('Sesión #99');
    expect(document.getElementById('firmaFootHint').textContent).toMatch('borrador');
    expect(document.getElementById('firmaDownloadBtn').textContent).toMatch('borrador');
  });
});
