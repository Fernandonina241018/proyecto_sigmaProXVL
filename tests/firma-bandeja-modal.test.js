// Bandeja de firmas en MODAL moderno (tarjetas + pestañas por estado).
// Verifica: admin ve todas (scope=all), no-admin solo las suyas + pendientes
// asignados (scope=mine + scope=pending), y los reportes se separan en
// páginas: Pendientes / Completadas / Rechazadas / Canceladas.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function loadModalHarness(role, sessions) {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML = '<div id="firmaPendingBadge"></div>';
  const urls = [];
  const sandbox = {
    console, window, document,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    showToast: () => {},
    escapeHtml: (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    fetchWithTimeout: async (url) => {
      urls.push(String(url));
      if (String(url).includes('count=1')) return { json: async () => ({ ok: true, count: 0 }) };
      if (String(url).includes('scope=')) return { json: async () => ({ ok: true, sessions }) };
      throw new Error('offline:' + url);
    },
    Auth: { getToken: () => 't', getSession: () => ({ username: 'ana', role }) },
    API_URL: 'http://x',
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-firma.js'), 'utf-8'), sandbox);
  return { sandbox, document, urls };
}

describe('bandeja en modal moderno (pestañas por estado)', () => {
  test('admin usa scope=all y muestra las 4 pestañas + autor de ajenos', async () => {
    const sessions = [
      { id: 1, name: 'A', status: 'pending', signed_count: 0, next_role: 'reviewed', created_by: 'ana' },
      { id: 2, name: 'B', status: 'complete', signed_count: 3, created_by: 'beto' },
      { id: 3, name: 'C', status: 'rejected', signed_count: 1, created_by: 'ana', rejected_by: 'beto' },
      { id: 4, name: 'D', status: 'deleted', signed_count: 1, created_by: 'ana', deleted_by: 'ana', deleted_reason: 'x' },
    ];
    const { sandbox, document, urls } = loadModalHarness('admin', sessions);
    await vm.runInContext('firmaOpenBandejaModal()', sandbox);
    await new Promise((r) => setTimeout(r, 30));
    expect(urls.some((u) => u.includes('scope=all'))).toBe(true);
    // 4 pestañas de estado
    expect(document.querySelectorAll('#fbandejaTabs .fbandeja-tab').length).toBe(4);
    // métricas presentes
    expect(document.getElementById('fbandejaM-pending').textContent).toBe('1');
    expect(document.getElementById('fbandejaM-done').textContent).toBe('1');
    expect(document.getElementById('fbandejaM-rejected').textContent).toBe('1');
    expect(document.getElementById('fbandejaM-cancelled').textContent).toBe('1');
    // páginas (secciones) presentes con sus etiquetas
    const txt = document.getElementById('firmaModalList').textContent;
    expect(txt).toMatch('Pendientes');
    expect(txt).toMatch('Completadas');
    expect(txt).toMatch('Rechazadas');
    expect(txt).toMatch('Canceladas');
    expect(txt).toMatch('✍ 0/3'); // progreso de firma en la tarjeta pendiente
    expect(txt).toMatch('de beto'); // admin ve el autor de reportes ajenos
  });

  test('no-admin consulta sus reportes (mine) y sus pendientes (pending)', async () => {
    const sessions = [
      { id: 1, name: 'A', status: 'rejected', signed_count: 1, created_by: 'ana' },
    ];
    const { sandbox, document, urls } = loadModalHarness('analista', sessions);
    await vm.runInContext('firmaOpenBandejaModal()', sandbox);
    await new Promise((r) => setTimeout(r, 30));
    expect(urls.some((u) => u.includes('scope=mine'))).toBe(true);
    expect(urls.some((u) => u.includes('scope=pending'))).toBe(true);
    expect(urls.some((u) => u.includes('scope=all'))).toBe(false);
    expect(document.getElementById('firmaModalList').textContent).toMatch('Rechazadas');
  });

  test('sin reportes muestra hint según rol', async () => {
    const { sandbox, document } = loadModalHarness('analista', []);
    await vm.runInContext('firmaOpenBandejaModal()', sandbox);
    await new Promise((r) => setTimeout(r, 30));
    expect(document.getElementById('firmaModalList').textContent).toMatch('creados por ti');
  });
});

describe('canceladas: retención visible y borrado definitivo (admin)', () => {
  test('muestra la fecha de purga (90 días) y el aviso de retención', async () => {
    const sessions = [
      { id: 4, name: 'D', status: 'deleted', signed_count: 1, created_by: 'ana', deleted_by: 'ana', deleted_reason: 'x', updated_at: '2026-01-01T00:00:00' },
    ];
    const { sandbox, document } = loadModalHarness('admin', sessions);
    await vm.runInContext('firmaOpenBandejaModal()', sandbox);
    await new Promise((r) => setTimeout(r, 30));
    const txt = document.getElementById('firmaModalList').textContent;
    expect(txt).toMatch('Se elimina el 01/04/2026');
    expect(txt).toMatch('Se conservan 90 días');
  });

  test('admin ve el botón de borrado definitivo y el confirm avisa que es permanente', async () => {
    const sessions = [
      { id: 4, name: 'D', status: 'deleted', created_by: 'ana', deleted_by: 'ana', updated_at: '2026-01-01T00:00:00' },
    ];
    const { sandbox, document } = loadModalHarness('admin', sessions);
    await vm.runInContext('firmaOpenBandejaModal()', sandbox);
    await new Promise((r) => setTimeout(r, 30));
    const btn = document.querySelector('#firmaModalList [data-del]');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('data-hard')).toBe('1');
    expect(btn.getAttribute('title')).toMatch('definitivamente');
    btn.click();
    const conf = document.querySelector('.fbandeja-confirm.show');
    expect(conf).toBeTruthy();
    expect(conf.textContent).toMatch('borrará del servidor de forma permanente');
  });

  test('no-admin no puede borrar una cancelada (sin botón)', async () => {
    const sessions = [
      { id: 7, name: 'E', status: 'deleted', created_by: 'ana', updated_at: '2026-01-01T00:00:00' },
    ];
    const { sandbox, document } = loadModalHarness('analista', sessions);
    await vm.runInContext('firmaOpenBandejaModal()', sandbox);
    await new Promise((r) => setTimeout(r, 30));
    const sec = document.querySelector('#fbandeja-page-cancelled');
    expect(sec).toBeTruthy();
    expect(sec.querySelector('[data-del]')).toBeNull();
  });
});
