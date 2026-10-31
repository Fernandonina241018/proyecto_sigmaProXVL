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

function loadModalHarness(role, sessions, opts = {}) {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML = '<div id="firmaPendingBadge"></div>';
  const urls = [];
  const deletes = [];
  const toasts = [];
  const deletePlan = opts.deletePlan || {};
  const sandbox = {
    console, window, document,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    showToast: (m, isErr) => { toasts.push([String(m), !!isErr]); },
    escapeHtml: (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    fetchWithTimeout: async (url, options) => {
      urls.push(String(url));
      if (options && options.method === 'DELETE') {
        const id = parseInt(String(url).split('/').pop(), 10);
        deletes.push({ id, reason: options.body ? JSON.parse(options.body).reason : '' });
        const plan = deletePlan[id];
        if (plan === 'fail') return { status: 422, json: async () => ({ ok: false, error: 'No se pudo' }) };
        if (plan === 'missing') return { status: 404, json: async () => ({ ok: false, code: 'not-found' }) };
        if (plan === 'throw') throw new Error('network');
        return { status: 200, json: async () => ({ ok: true, id }) };
      }
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
  return { sandbox, document, urls, deletes, toasts };
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

// ── Acciones masivas: Rechazadas → Canceladas (soft) · Canceladas → permanente ──
const tick = () => new Promise((r) => setTimeout(r, 50));

async function openModal(h) {
  await vm.runInContext('firmaOpenBandejaModal()', h.sandbox);
  await tick();
}

describe('bandeja · acciones masivas', () => {
  test('admin ve "Eliminar todas" y "Vaciar canceladas" con su conteo', async () => {
    const sessions = [
      { id: 3, name: 'R1', status: 'rejected', created_by: 'ana' },
      { id: 5, name: 'R2', status: 'rejected', created_by: 'beto' },
      { id: 4, name: 'D1', status: 'deleted', created_by: 'ana' },
    ];
    const h = loadModalHarness('admin', sessions);
    const document = h.document;
    await openModal(h);
    const rej = document.querySelector('#fbandeja-page-rejected [data-bulk="rejected"]');
    const can = document.querySelector('#fbandeja-page-cancelled [data-bulk="cancelled"]');
    expect(rej).toBeTruthy();
    expect(rej.textContent).toContain('(2)');
    expect(can).toBeTruthy();
    expect(can.textContent).toContain('(1)');
  });

  test('no-admin: ve Rechazadas propias pero no "Vaciar canceladas"', async () => {
    const sessions = [
      { id: 3, name: 'R1', status: 'rejected', created_by: 'ana' },
      { id: 4, name: 'D1', status: 'deleted', created_by: 'ana' },
    ];
    const h = loadModalHarness('analista', sessions);
    const document = h.document;
    await openModal(h);
    expect(document.querySelector('#fbandeja-page-rejected [data-bulk="rejected"]')).toBeTruthy();
    expect(document.querySelector('#fbandeja-page-cancelled [data-bulk="cancelled"]')).toBeNull();
  });

  test('el confirm avisa del paso a Canceladas y exige motivo', async () => {
    const sessions = [{ id: 3, name: 'R1', status: 'rejected', created_by: 'ana' }];
    const h = loadModalHarness('admin', sessions);
    const document = h.document;
    await openModal(h);
    document.querySelector('[data-bulk="rejected"]').click();
    await tick();
    const conf = document.querySelector('.fbandeja-confirm.show');
    expect(conf).toBeTruthy();
    expect(conf.textContent).toMatch(/Pasarán a Canceladas/);
    // Sin motivo no se dispara ningún DELETE
    conf.querySelector('[data-act="ok"]').click();
    await tick();
    expect(h.deletes.length).toBe(0);
    expect(h.toasts.some((t) => t[0].includes('motivo'))).toBe(true);
  });

  test('con motivo, elimina todos los visibles y resume', async () => {
    const sessions = [
      { id: 3, name: 'R1', status: 'rejected', created_by: 'ana' },
      { id: 5, name: 'R2', status: 'rejected', created_by: 'ana' },
    ];
    const h = loadModalHarness('admin', sessions);
    const document = h.document;
    await openModal(h);
    document.querySelector('[data-bulk="rejected"]').click();
    await tick();
    const conf = document.querySelector('.fbandeja-confirm.show');
    conf.querySelector('textarea').value = 'limpieza de duplicados';
    conf.querySelector('[data-act="ok"]').click();
    await tick();
    await tick();
    expect(h.deletes.map((d) => d.id).sort()).toEqual([3, 5]);
    expect(h.deletes[0].reason).toBe('limpieza de duplicados');
    expect(h.toasts.some((t) => t[0].includes('2 informes eliminados'))).toBe(true);
  });

  test('con búsqueda activa, solo borra las filas filtradas', async () => {
    const sessions = [
      { id: 3, name: 'Alfa', status: 'rejected', created_by: 'ana' },
      { id: 5, name: 'Beta', status: 'rejected', created_by: 'ana' },
    ];
    const h = loadModalHarness('admin', sessions);
    const document = h.document;
    await openModal(h);
    const search = document.getElementById('fbandejaSearch');
    search.value = 'alfa';
    search.dispatchEvent(new h.sandbox.window.Event('input', { bubbles: true }));
    await tick();
    const btn = document.querySelector('[data-bulk="rejected"]');
    expect(btn.textContent).toContain('(1)');
    btn.click();
    await tick();
    const conf = document.querySelector('.fbandeja-confirm.show');
    expect(conf.textContent).toMatch(/resultados filtrados/);
    conf.querySelector('textarea').value = 'solo alfa';
    conf.querySelector('[data-act="ok"]').click();
    await tick();
    await tick();
    expect(h.deletes.map((d) => d.id)).toEqual([3]);
  });

  test('404 (ya no existe) cuenta como éxito idempotente', async () => {
    const sessions = [{ id: 3, name: 'R1', status: 'rejected', created_by: 'ana' }];
    const h = loadModalHarness('admin', sessions, { deletePlan: { 3: 'missing' } });
    const document = h.document;
    await openModal(h);
    document.querySelector('[data-bulk="rejected"]').click();
    await tick();
    const conf = document.querySelector('.fbandeja-confirm.show');
    conf.querySelector('textarea').value = 'x';
    conf.querySelector('[data-act="ok"]').click();
    await tick();
    await tick();
    expect(h.deletes.length).toBe(1);
    expect(h.toasts.some((t) => t[0].includes('1 informe eliminado'))).toBe(true);
  });

  test('fallo parcial: informa cuántos se eliminaron y cuántos fallaron', async () => {
    const sessions = [
      { id: 3, name: 'R1', status: 'rejected', created_by: 'ana' },
      { id: 5, name: 'R2', status: 'rejected', created_by: 'ana' },
    ];
    const h = loadModalHarness('admin', sessions, { deletePlan: { 5: 'fail' } });
    const document = h.document;
    await openModal(h);
    document.querySelector('[data-bulk="rejected"]').click();
    await tick();
    const conf = document.querySelector('.fbandeja-confirm.show');
    conf.querySelector('textarea').value = 'x';
    conf.querySelector('[data-act="ok"]').click();
    await tick();
    await tick();
    expect(h.toasts.some((t) => t[0].includes('1 eliminados') && t[0].includes('1 fallidos'))).toBe(true);
    expect(h.toasts.some((t) => t[1] === true)).toBe(true);
  });

  test('no se puede cerrar el modal mientras el lote está en curso', async () => {
    const sessions = [{ id: 3, name: 'R1', status: 'rejected', created_by: 'ana' }];
    const h = loadModalHarness('admin', sessions);
    const document = h.document;
    await openModal(h);
    vm.runInContext('_firmaBulkBusy = true', h.sandbox);
    vm.runInContext('_firmaModalClose()', h.sandbox);
    expect(document.querySelector('.fbandeja-overlay')).toBeTruthy();
    vm.runInContext('_firmaBulkBusy = false', h.sandbox);
    vm.runInContext('_firmaModalClose()', h.sandbox);
    expect(document.querySelector('.fbandeja-overlay')).toBeNull();
  });
});
