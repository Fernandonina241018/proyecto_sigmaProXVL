// Cupo de reportes en firma: flujo del modal de publicar (409 → confirmar → retry).
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

const SESSION_HTML =
  '<html><head><title>R</title></head><body>' +
  '<div data-signature-role="prepared"><div>Preparado</div>' +
  '<div><span data-signature-field="name" data-signature-role="prepared">Ana</span></div>' +
  '<div><span data-signature-field="title" data-signature-role="prepared">—</span></div>' +
  '<div><span data-signature-field="firma" data-signature-role="prepared">—</span></div>' +
  '<div><span data-signature-field="date" data-signature-role="prepared">—</span></div></div>' +
  '</body></html>';

const NEW_SESSION = {
  id: 105, name: 'RPT.html', html: SESSION_HTML,
  signatures: { prepared: { signed: true, username: 'beto', nombre: 'Beto', cargo: '', firma: '', fecha: '2026-01-01' } },
  status: 'partial', version: 1, created_by: 'beto',
  assigned_reviewer: 'carla', assigned_approver: null,
  created_at: '', updated_at: '', next_role: 'reviewed',
};

function loadQuotaHarness() {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML =
    '<div id="firmaTabs"></div>' +
    '<div id="firmaPreview"></div>' +
    '<div id="firmaSignatureEditor"></div>' +
    '<div id="firmaStatus"></div>' +
    '<div id="firmaActions"></div>' +
    '<div id="firmaBandejaList"></div>' +
    '<span id="firmaPendingBadge"></span>';
  const toasts = [];
  const state = {
    calls: [],
    importReply: {
      ok: false, code: 'quota', total: 10, max: 10,
      error: 'Tienes 10 reportes en firma (máximo 10).',
      items: [{ id: 7, name: 'RPT viejo', created_at: '2026-01-01T10:00:00' }],
    },
  };
  const sandbox = {
    console, window, document,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    showToast: (m) => { toasts.push(String(m)); },
    escapeHtml: (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    fetchWithTimeout: async (url, opts) => {
      if (String(url).includes('/api/sign-sessions/import')) {
        state.calls.push(JSON.parse((opts && opts.body) || '{}'));
        return { json: async () => state.importReply };
      }
      if (String(url).includes('/api/users/list')) {
        return { json: async () => ({ ok: true, users: [{ username: 'carla', nombre: 'Carla', role: 'supervisor' }] }) };
      }
      if (String(url).includes('/api/sign-sessions/105')) {
        return { json: async () => ({ ok: true, session: NEW_SESSION }) };
      }
      if (String(url).includes('scope=mine')) return { json: async () => ({ ok: true, sessions: [] }) };
      if (String(url).includes('count=1')) return { json: async () => ({ ok: true, count: 0 }) };
      throw new Error('offline:' + url);
    },
    Auth: { getToken: () => 't', getSession: () => ({ username: 'beto', role: 'analista' }) },
    API_URL: 'http://x',
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-firma.js'), 'utf-8'), sandbox);
  return { sandbox, document, toasts, state };
}

describe('cupo de reportes en firma (modal de publicar)', () => {
  test('firmaQuotaWarnHtml lista lo que se cancelará', () => {
    const { sandbox } = loadQuotaHarness();
    const html = vm.runInContext(
      "firmaQuotaWarnHtml({total:10,max:10,items:[{id:7,name:'RPT viejo',created_at:'2026-01-01T00:00:00'}]})",
      sandbox
    );
    expect(html).toMatch('10 reportes en firma');
    expect(html).toMatch('#7');
    expect(html).toMatch('RPT viejo');
  });

  test('409 pide confirmación; el 2º clic reintenta con acceptReplace', async () => {
    const { sandbox, document, toasts, state } = loadQuotaHarness();
    vm.runInContext("_firmaCurrentHtml='<html></html>'; _firmaOriginalName='RPT.html'; _firmaSessionId=null;", sandbox);
    await vm.runInContext('firmaPublishLoaded()', sandbox);
    document.getElementById('fpub-code').value = 'C';
    document.getElementById('fpub-pass').value = 'P';
    document.getElementById('fpub-reviewer').value = 'carla';
    document.getElementById('fpub-approver').value = 'carla';
    const btn = document.getElementById('fpub-ok');
    await btn.onclick(); // 1er intento → 409
    expect(state.calls.length).toBe(1);
    expect(state.calls[0].acceptReplace).toBe(false);
    expect(document.getElementById('fpub-err').innerHTML).toMatch('reportes en firma');
    expect(btn.textContent).toMatch('Cancelar');
    state.importReply = { ok: true, session: { id: 105 }, cancelled: [7] };
    await btn.onclick(); // 2º intento con acceptReplace
    expect(state.calls.length).toBe(2);
    expect(state.calls[1].acceptReplace).toBe(true);
    expect(toasts.some((t) => t.includes('cancelados'))).toBe(true);
    await new Promise((r) => setTimeout(r, 30)); // deja correr _firmaOpenSession
  });
});
