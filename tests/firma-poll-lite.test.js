// Polling de la vista de firma en modo lite: solo metadatos (sin HTML).
// Motivo: el polling de 30 s descargaba el reporte completo (~300 KB) desde
// Supabase y consumía el egress del plan. Ahora compara `version` con un
// payload mínimo y solo pide el documento si la versión cambió.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');
const ROOT = join(__dirname, '..');

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
  block('prepared', 'Preparado por', 'Ana') +
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

function loadHarness({ liteVersion = 1 } = {}) {
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
  const requests = [];
  const sandbox = {
    console, window, document,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    showToast: () => {},
    escapeHtml: (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    fetchWithTimeout: async (url) => {
      const u = String(url);
      requests.push(u);
      if (u.includes('?lite=1')) {
        return { json: async () => ({ ok: true, session: { id: 99, version: liteVersion } }) };
      }
      if (u.includes('/api/sign-sessions/99')) {
        return { json: async () => ({ ok: true, session: FAKE_SESSION }) };
      }
      if (u.includes('scope=pending') || u.includes('count=1')) {
        return { json: async () => ({ ok: true, sessions: [], count: 0 }) };
      }
      throw new Error('offline:' + u);
    },
    Auth: { getToken: () => 't', getSession: () => ({ username: 'beto', role: 'analista' }) },
    API_URL: 'http://x',
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-firma.js'), 'utf-8'), sandbox);
  return { sandbox, requests };
}

describe('polling lite de la sesión de firma', () => {
  test('pide ?lite=1 y NO descarga el HTML si la versión coincide', async () => {
    const { sandbox, requests } = loadHarness({ liteVersion: 1 });
    await vm.runInContext('_firmaSessionId = 99; _firmaSessionVersion = 1; _firmaPollSession();', sandbox);

    expect(requests[0]).toContain('?lite=1');
    expect(requests.some((u) => !u.includes('?lite=1') && u.includes('/api/sign-sessions/99'))).toBe(false);
  });

  test('si cambia la versión, reabre con el detalle completo (html)', async () => {
    const { sandbox, requests } = loadHarness({ liteVersion: 2 });
    await vm.runInContext('_firmaSessionId = 99; _firmaSessionVersion = 1; _firmaPollSession();', sandbox);

    expect(requests[0]).toContain('?lite=1');
    expect(requests.some((u) => u === 'http://x/api/sign-sessions/99')).toBe(true);
  });

  test('el polling sin sesión abierta no hace ninguna request', async () => {
    const { sandbox, requests } = loadHarness();
    await vm.runInContext('_firmaSessionId = null; _firmaPollSession();', sandbox);
    expect(requests.length).toBe(0);
  });
});

describe('wiring del endpoint lite', () => {
  test('server.js usa getSignSessionMeta solo cuando ?lite=1', () => {
    const src = readFileSync(join(ROOT, 'backend', 'server.js'), 'utf8');
    expect(src).toMatch(/req\.query\.lite === '1'/);
    expect(src).toMatch(/db\.getSignSessionMeta\(/);
    expect(src).toMatch(/db\.getSignSession\(/);
  });

  test('database.js expone getSignSessionMeta en ambos stores', () => {
    const src = readFileSync(join(ROOT, 'backend', 'database.js'), 'utf8');
    const defs = src.match(/async function getSignSessionMeta\(/g) || [];
    expect(defs.length).toBe(2); // PG + store JSON local
    expect(src).toMatch(/getSignSessionMeta:.*impl\.getSignSessionMeta/);
  });
});
