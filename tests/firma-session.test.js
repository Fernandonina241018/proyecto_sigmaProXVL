import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function loadFirmaHarness() {
  const previewIframe = { srcdoc: '' };
  const sandbox = {
    console,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    document: {
      getElementById: (id) =>
        id === 'firmaPreview' ? { querySelector: () => previewIframe } : null,
      createElement: () => null,
      querySelectorAll: () => [],
      body: { appendChild: () => {} },
    },
    window: {},
    showToast: () => {},
    escapeHtml: (s) => String(s),
    fetchWithTimeout: async () => { throw new Error('offline'); },
    Auth: { getToken: () => '' },
    API_URL: '',
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-firma.js'), 'utf-8'), sandbox);
  return { sandbox, previewIframe };
}

function setupFakeDoc(sb) {
  vm.runInContext(
    `var __els = {};
     _firmaCurrentDoc = {
       querySelector: function(sel){ if (!__els[sel]) __els[sel] = { textContent: '', style: {} }; return __els[sel]; },
       documentElement: { outerHTML: '<html>fake-doc</html>' }
     };`,
    sb
  );
}
function elText(sb, role, field) {
  return vm.runInContext(
    `__els['[data-signature-role="${role}"] [data-signature-field="${field}"]'].textContent`,
    sb
  );
}

describe('_firmaSessionNext (orden prepared→reviewed→approved)', () => {
  test('vacío → prepared', () => {
    const { sandbox: sb } = loadFirmaHarness();
    vm.runInContext('_firmaSignatureState = {};', sb);
    expect(vm.runInContext('_firmaSessionNext()', sb)).toBe('prepared');
  });

  test('prepared firmado → reviewed', () => {
    const { sandbox: sb } = loadFirmaHarness();
    vm.runInContext(`_firmaSignatureState = { prepared: { signed: true } };`, sb);
    expect(vm.runInContext('_firmaSessionNext()', sb)).toBe('reviewed');
  });

  test('prepared+reviewed → approved', () => {
    const { sandbox: sb } = loadFirmaHarness();
    vm.runInContext(`_firmaSignatureState = { prepared: { signed: true }, reviewed: { signed: true } };`, sb);
    expect(vm.runInContext('_firmaSessionNext()', sb)).toBe('approved');
  });

  test('todo firmado → null (completa)', () => {
    const { sandbox: sb } = loadFirmaHarness();
    vm.runInContext(
      `_firmaSignatureState = { prepared: { signed: true }, reviewed: { signed: true }, approved: { signed: true } };`,
      sb
    );
    expect(vm.runInContext('_firmaSessionNext()', sb)).toBeNull();
  });

  test('rol reseteado vuelve a ser el siguiente', () => {
    const { sandbox: sb } = loadFirmaHarness();
    vm.runInContext(
      `_firmaSignatureState = { prepared: { signed: true }, reviewed: { signed: false } };`,
      sb
    );
    expect(vm.runInContext('_firmaSessionNext()', sb)).toBe('reviewed');
  });
});

describe('_firmaTake/ClearPendingSession (ID persistente)', () => {
  test('take lee sin borrar; clear borra', () => {
    const { sandbox: sb } = loadFirmaHarness();
    vm.runInContext(`try { sessionStorage.setItem('__firma_session_id', '42'); } catch(e){}`, sb);
    // harness sessionStorage es stub: se simula con variable interna
    vm.runInContext(
      `var __store = {}; try { sessionStorage.setItem = function(k,v){ __store[k]=String(v); }; sessionStorage.getItem = function(k){ return (__store[k] !== undefined ? __store[k] : null); }; sessionStorage.removeItem = function(k){ delete __store[k]; }; } catch(e){}`,
      sb
    );
    vm.runInContext(`sessionStorage.setItem('__firma_session_id', '42');`, sb);
    expect(vm.runInContext(`_firmaTakePendingSession()`, sb)).toBe('42');
    // take NO borra: segunda lectura devuelve lo mismo (antes se perdía)
    expect(vm.runInContext(`_firmaTakePendingSession()`, sb)).toBe('42');
    vm.runInContext(`_firmaClearPendingSession();`, sb);
    expect(vm.runInContext(`_firmaTakePendingSession()`, sb)).toBeNull();
  });

  test('guardia anti-doble-apertura', () => {
    const { sandbox: sb } = loadFirmaHarness();
    vm.runInContext(`_firmaOpeningSession = 7;`, sb);
    return vm.runInContext(`_firmaOpenSession(7)`, sb).then((ok) => {
      expect(ok).toBe(false);
      vm.runInContext(`_firmaOpeningSession = null;`, sb);
    });
  });
});

describe('_firmaNowStamp (formato dd/Mmm/AAAA HH:MM:SS)', () => {
  test('fecha fija en hora local', () => {
    const { sandbox: sb } = loadFirmaHarness();
    const s = vm.runInContext(`_firmaNowStamp(new Date(2026, 8, 19, 14, 5, 9))`, sb);
    expect(s).toBe('19/Sep/2026 14:05:09');
  });

  test('coincide con el formato del servidor', () => {
    const { sandbox: sb } = loadFirmaHarness();
    const s = vm.runInContext(`_firmaNowStamp(new Date(2026, 0, 1, 0, 0, 0))`, sb);
    expect(s).toBe('01/Ene/2026 00:00:00');
  });
});

describe('_firmaPaintSessionState (pinta firmas en el reporte)', () => {
  test('pinta los 4 campos del rol firmado', () => {
    const { sandbox: sb, previewIframe } = loadFirmaHarness();
    setupFakeDoc(sb);
    vm.runInContext(
      `_firmaSignatureState = { prepared: { signed: true, nombre: 'Ana', cargo: 'Lab', firma: 'F-Ana', fecha: '2026-01-01' } }; _firmaPaintSessionState();`,
      sb
    );
    expect(elText(sb, 'prepared', 'name')).toBe('Ana');
    expect(elText(sb, 'prepared', 'title')).toBe('Lab');
    expect(elText(sb, 'prepared', 'firma')).toBe('F-Ana');
    expect(elText(sb, 'prepared', 'date')).toBe('2026-01-01');
  });

  test('actualiza _firmaCurrentHtml e iframe (lo que se descarga)', () => {
    const { sandbox: sb, previewIframe } = loadFirmaHarness();
    setupFakeDoc(sb);
    vm.runInContext(
      `_firmaSignatureState = { prepared: { signed: true, nombre: 'Ana' } }; _firmaPaintSessionState();`,
      sb
    );
    expect(vm.runInContext('_firmaCurrentHtml', sb)).toMatch('<!DOCTYPE html>');
    expect(previewIframe.srcdoc).toMatch('<!DOCTYPE html>');
  });

  test('no toca roles sin firmar', () => {
    const { sandbox: sb } = loadFirmaHarness();
    setupFakeDoc(sb);
    vm.runInContext(
      `_firmaSignatureState = { prepared: { signed: true, nombre: 'Ana' }, reviewed: { signed: false } }; _firmaPaintSessionState();`,
      sb
    );
    // El selector del rol no firmado jamás se consulta (prueba: no existe)
    const touched = vm.runInContext(
      `Object.keys(__els).some(function(k){ return k.indexOf('"reviewed"') >= 0; })`,
      sb
    );
    expect(touched).toBe(false);
  });

  test('sin estado no rompe (fail-open)', () => {
    const { sandbox: sb } = loadFirmaHarness();
    setupFakeDoc(sb);
    vm.runInContext(`_firmaSignatureState = null; _firmaPaintSessionState();`, sb);
    expect(vm.runInContext('_firmaCurrentHtml', sb)).toBe('');
  });
});
