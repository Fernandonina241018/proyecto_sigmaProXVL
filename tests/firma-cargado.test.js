import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function block(role, label) {
  return (
    `<div data-signature-role="${role}"><div>${label}</div>` +
    `<div><span data-signature-field="name" data-signature-role="${role}">—</span></div>` +
    `<div><span data-signature-field="title" data-signature-role="${role}">—</span></div>` +
    `<div><span data-signature-field="firma" data-signature-role="${role}">—</span></div>` +
    `<div><span data-signature-field="date" data-signature-role="${role}">—</span></div>` +
    `</div>`
  );
}
const SESSION_HTML =
  `<html><head><title>R</title></head><body>` +
  block('prepared', 'Preparado por') +
  block('reviewed', 'Revisado por') +
  block('approved', 'Aprobado por') +
  `</body></html>`;

function sessionV(version, extraSig) {
  return {
    id: 99, name: 'RPT-T', html: SESSION_HTML, version,
    signatures: Object.assign({
      prepared: { signed: true, username: 'ana', nombre: 'Ana', cargo: 'Lab', firma: 'F', fecha: 'f1' },
    }, extraSig || {}),
    status: 'partial', created_by: 'ana',
    assigned_reviewer: 'beto', assigned_approver: 'carla',
    created_at: '', updated_at: '', next_role: 'reviewed',
  };
}

// Harness con fetch que expone status (para 404/offline del revalidate).
function loadHarness(handler) {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML =
    '<div id="firmaPreview"></div>' +
    '<div id="firmaSignatureEditor"></div>' +
    '<div id="firmaStatus"></div>' +
    '<div id="firmaActions"></div>' +
    '<div id="firmaTabs"><button class="firma-tab" data-scope="pending"></button>' +
    '<button class="firma-tab" data-scope="mine"></button>' +
    '<button class="firma-tab" data-scope="cargado"></button></div>' +
    '<div id="firmaBandejaList"></div>';
  const toasts = [];
  const sandbox = {
    console,
    window, document,
    DOMParser: window.DOMParser,
    FileReader: window.FileReader,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    confirm: () => true,
    showToast: (m) => { toasts.push(String(m)); },
    escapeHtml: (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    fetchWithTimeout: async (url, opts) => handler(String(url), opts || {}),
    Auth: { getToken: () => 't', getSession: () => ({ username: 'ana', role: 'analista' }) },
    API_URL: 'http://x',
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-firma.js'), 'utf-8'), sandbox);
  return { sandbox, document, toasts };
}

function seedSnapshot(sandbox, { version, state }) {
  const ss = sandbox.sessionStorage;
  ss.setItem('__firma_current_html', SESSION_HTML);
  ss.setItem('__firma_signature_data', JSON.stringify([
    { role: 'prepared', label: 'Preparado por', fields: {} },
    { role: 'reviewed', label: 'Revisado por', fields: {} },
    { role: 'approved', label: 'Aprobado por', fields: {} },
  ]));
  ss.setItem('__firma_signature_state', JSON.stringify(state || {
    prepared: { signed: true, username: 'ana', nombre: 'Ana', cargo: 'Lab', firma: 'F', fecha: 'f1' },
  }));
  ss.setItem('__firma_original_name', 'RPT-T');
  ss.setItem('__firma_is_new_session', '0');
  ss.setItem('__firma_session_id', '99');
  ss.setItem('__firma_session_version', String(version));
}

describe('Tab Cargado (borrador local)', () => {
  test('con borrador muestra tarjeta con Publicar', async () => {
    const { sandbox, document } = loadHarness(async () => ({ status: 200, json: async () => ({ ok: true, sessions: [] }) }));
    await vm.runInContext("firmaLoadHtml(__SESS_HTML__, 'borrador.html')".replace('__SESS_HTML__', JSON.stringify(SESSION_HTML)), sandbox);
    await vm.runInContext("firmaLoadBandeja('cargado')", sandbox);
    const txt = document.getElementById('firmaBandejaList').textContent;
    expect(txt).toMatch('borrador.html');
    expect(txt).toMatch('Borrador local');
    expect(document.querySelector('[data-cargado-pub]')).not.toBeNull();
  });

  test('sin borrador muestra hint vacío', async () => {
    const { sandbox, document } = loadHarness(async () => ({ status: 200, json: async () => ({ ok: true, sessions: [] }) }));
    await vm.runInContext("firmaLoadBandeja('cargado')", sandbox);
    expect(document.getElementById('firmaBandejaList').textContent).toMatch('Sin borrador');
  });

  test('descartar limpia estado y vista', async () => {
    const { sandbox, document } = loadHarness(async () => ({ status: 200, json: async () => ({ ok: true, sessions: [] }) }));
    await vm.runInContext("firmaLoadHtml(__SESS_HTML__, 'borrador.html')".replace('__SESS_HTML__', JSON.stringify(SESSION_HTML)), sandbox);
    await vm.runInContext('firmaDiscardDraft()', sandbox);
    const has = await vm.runInContext('firmaHasPersistedState()', sandbox);
    expect(has).toBe(false);
    expect(document.getElementById('firmaBandejaList').textContent).toMatch('Sin borrador');
  });
});

describe('Revalidación de snapshot restaurado (fix móvil)', () => {
  test('versión nueva → re-apertura silenciosa con reviewed visible', async () => {
    const v2 = sessionV(2, { reviewed: { signed: true, username: 'beto', nombre: 'Beto', cargo: 'Rev', firma: 'G', fecha: 'f2' } });
    const { sandbox, document, toasts } = loadHarness(async (url) => {
      if (url.includes('scope=')) return { status: 200, json: async () => ({ ok: true, sessions: [] }) };
      return { status: 200, json: async () => ({ ok: true, session: v2 }) };
    });
    seedSnapshot(sandbox, { version: 1 });
    await vm.runInContext('firmaRestoreState()', sandbox);
    await vm.runInContext('_firmaRevalidateRestored()', sandbox);
    const txt = document.getElementById('firmaSignatureEditor').textContent;
    expect(txt).toMatch('Beto');
    expect(toasts.join('|')).toMatch('actualizada');
  });

  test('404 (eliminada/purgada) → limpia fantasma y vista vacía', async () => {
    const { sandbox, document, toasts } = loadHarness(async () => ({ status: 404, json: async () => ({ error: 'x' }) }));
    seedSnapshot(sandbox, { version: 1 });
    await vm.runInContext('firmaRestoreState()', sandbox);
    await vm.runInContext('_firmaRevalidateRestored()', sandbox);
    const has = await vm.runInContext('firmaHasPersistedState()', sandbox);
    expect(has).toBe(false);
    expect(document.getElementById('firmaPreview').textContent).toMatch('Carga un reporte');
    expect(toasts.join('|')).toMatch('ya no existe');
  });

  test('offline → conserva snapshot (fail-open)', async () => {
    const { sandbox } = loadHarness(async () => { throw new Error('offline'); });
    seedSnapshot(sandbox, { version: 1 });
    await vm.runInContext('firmaRestoreState()', sandbox);
    await vm.runInContext('_firmaRevalidateRestored()', sandbox);
    const st = await vm.runInContext('JSON.stringify(_firmaSignatureState)', sandbox);
    expect(st).toMatch('Ana');
    const sid = await vm.runInContext('_firmaSessionId', sandbox);
    expect(sid).toBe(99);
  });

  test('borrador (sin sesión) → no consulta al servidor', async () => {
    let calls = 0;
    const { sandbox } = loadHarness(async () => { calls++; return { status: 200, json: async () => ({}) }; });
    await vm.runInContext("firmaLoadHtml(__SESS_HTML__, 'b.html')".replace('__SESS_HTML__', JSON.stringify(SESSION_HTML)), sandbox);
    await vm.runInContext('_firmaRevalidateRestored()', sandbox);
    expect(calls).toBe(0);
  });
});

describe('Eliminar/rechazar la sesión abierta limpia la vista', () => {
  function loadMethodHarness(route) {
    return loadHarness(async (url, opts) => route(String(url), opts || {}));
  }
  async function open99(sandbox) {
    const ok = await vm.runInContext('_firmaOpenSession(99)', sandbox);
    expect(ok).toBe(true);
    expect(await vm.runInContext('firmaHasPersistedState()', sandbox)).toBe(true);
  }

  test('eliminar la abierta → vista vacía y sin snapshot', async () => {
    const v1 = sessionV(1);
    const { sandbox, document, toasts } = loadMethodHarness(async (url, opts) => {
      if ((opts.method || 'GET') === 'DELETE') return { status: 200, json: async () => ({ ok: true, id: 99 }) };
      if (url.includes('scope=')) return { status: 200, json: async () => ({ ok: true, sessions: [] }) };
      return { status: 200, json: async () => ({ ok: true, session: v1 }) };
    });
    await open99(sandbox);
    await vm.runInContext('firmaDeleteSession(99)', sandbox);
    expect(await vm.runInContext('firmaHasPersistedState()', sandbox)).toBe(false);
    expect(await vm.runInContext('_firmaSessionId', sandbox)).toBeNull();
    expect(document.getElementById('firmaPreview').textContent).toMatch('Carga un reporte');
    // firmaLoadBandeja() es async sin await: esperar el refetch antes de asertar la lista.
    await new Promise((r) => setTimeout(r, 50));
    expect(document.getElementById('firmaBandejaList').textContent).toMatch('Sin documentos pendientes');
    expect(toasts.join('|')).toMatch('eliminada');
  });

  test('rechazar la abierta → vista vacía y sin snapshot', async () => {
    const v1 = sessionV(1);
    const { sandbox, document } = loadMethodHarness(async (url, opts) => {
      if (url.includes('/reject')) return { status: 200, json: async () => ({ ok: true }) };
      if (url.includes('scope=')) return { status: 200, json: async () => ({ ok: true, sessions: [] }) };
      return { status: 200, json: async () => ({ ok: true, session: v1 }) };
    });
    await open99(sandbox);
    await vm.runInContext('firmaRejectSession(99)', sandbox);
    expect(await vm.runInContext('firmaHasPersistedState()', sandbox)).toBe(false);
    expect(document.getElementById('firmaPreview').textContent).toMatch('Carga un reporte');
  });

  test('eliminar otra (no abierta) → la vista se conserva', async () => {
    const v1 = sessionV(1);
    const { sandbox, document } = loadMethodHarness(async (url, opts) => {
      if ((opts.method || 'GET') === 'DELETE') return { status: 200, json: async () => ({ ok: true, id: 7 }) };
      if (url.includes('scope=')) return { status: 200, json: async () => ({ ok: true, sessions: [] }) };
      return { status: 200, json: async () => ({ ok: true, session: v1 }) };
    });
    await open99(sandbox);
    await vm.runInContext('firmaDeleteSession(7)', sandbox);
    expect(await vm.runInContext('firmaHasPersistedState()', sandbox)).toBe(true);
    expect(document.querySelector('#firmaPreview iframe')).not.toBeNull();
  });
});

describe('Sesión completa: sin reinicio (cerrada e inmutable)', () => {
  function completeByAna() {
    const full = sessionV(3, {
      reviewed: { signed: true, username: 'beto', nombre: 'Beto', cargo: 'Rev', firma: 'G', fecha: 'f2' },
      approved: { signed: true, username: 'ana', nombre: 'Ana', cargo: 'Lab', firma: 'F', fecha: 'f3' },
    });
    full.status = 'complete';
    full.next_role = null;
    return full;
  }
  test('abierta por quien la firmó → no muestra ↺ y el intento avisa', async () => {
    const full = completeByAna();
    const { sandbox, document, toasts } = loadHarness(async (url) => {
      if (url.includes('scope=')) return { status: 200, json: async () => ({ ok: true, sessions: [] }) };
      return { status: 200, json: async () => ({ ok: true, session: full }) };
    });
    const ok = await vm.runInContext('_firmaOpenSession(99)', sandbox);
    expect(ok).toBe(true);
    expect(document.getElementById('firmaSignatureEditor').textContent).not.toMatch('Reiniciar');
    const overlaysBefore = document.querySelectorAll('.modal-overlay').length;
    await vm.runInContext("firmaRequestReset('approved')", sandbox);
    expect(document.querySelectorAll('.modal-overlay').length).toBe(overlaysBefore);
    expect(toasts.join('|')).toMatch('no se puede reiniciar');
  });
});

describe('Timeline fsg del editor', () => {
  test('parcial: done ✓, actual con aria-current, futuro numerado + espera', async () => {
    const v1 = sessionV(1);
    const { sandbox, document } = loadHarness(async (url) => {
      if (url.includes('scope=')) return { status: 200, json: async () => ({ ok: true, sessions: [] }) };
      return { status: 200, json: async () => ({ ok: true, session: v1 }) };
    });
    await vm.runInContext('_firmaOpenSession(99)', sandbox);
    const steps = document.querySelectorAll('#firmaSignatureEditor > .fsg-step');
    expect(steps.length).toBe(3);
    expect(steps[0].className).toMatch('is-done');
    expect(steps[0].querySelector('.fsg-node').textContent).toBe('✓');
    expect(steps[1].className).toMatch('cur');
    expect(steps[1].getAttribute('aria-current')).toBe('step');
    expect(steps[1].querySelector('.fsg-node i')).not.toBeNull();
    expect(steps[2].className).toMatch('is-todo');
    expect(steps[2].querySelector('.fsg-node').textContent).toBe('3');
    expect(steps[2].textContent).toMatch('Esperando firma');
    // Ids funcionales preservados
    expect(document.getElementById('firmaSignedName-prepared')).not.toBeNull();
    expect(document.getElementById('firmaCodeInput-reviewed')).not.toBeNull();
  });

  test('borrador local: 3 pasos numerados con inputs', async () => {
    const { sandbox, document } = loadHarness(async () => ({ status: 200, json: async () => ({ ok: true, sessions: [] }) }));
    await vm.runInContext("firmaLoadHtml(__SESS_HTML__, 'b.html')".replace('__SESS_HTML__', JSON.stringify(SESSION_HTML)), sandbox);
    const steps = document.querySelectorAll('#firmaSignatureEditor > .fsg-step');
    expect(steps.length).toBe(3);
    expect(steps[0].className).toMatch('is-todo');
    expect(document.getElementById('firmaCodeInput-approved')).not.toBeNull();
  });
});

describe('Mías abre sesión completa', () => {
  test('completa (3/3) se abre y pinta las tres firmas', async () => {
    const full = sessionV(3, {
      reviewed: { signed: true, username: 'beto', nombre: 'Beto', cargo: 'Rev', firma: 'G', fecha: 'f2' },
      approved: { signed: true, username: 'carla', nombre: 'Carla', cargo: 'Sup', firma: 'H', fecha: 'f3' },
    });
    full.status = 'complete';
    full.next_role = null;
    const { sandbox, document } = loadHarness(async (url) => {
      if (url.includes('scope=')) return { status: 200, json: async () => ({ ok: true, sessions: [] }) };
      return { status: 200, json: async () => ({ ok: true, session: full }) };
    });
    const ok = await vm.runInContext('_firmaOpenSession(99)', sandbox);
    expect(ok).toBe(true);
    const txt = document.getElementById('firmaSignatureEditor').textContent;
    expect(txt).toMatch('Ana');
    expect(txt).toMatch('Beto');
    expect(txt).toMatch('Carla');
    expect(document.getElementById('firmaStatus').textContent).toMatch('3/3');
  });
});
