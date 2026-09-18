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
