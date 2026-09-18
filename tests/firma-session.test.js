import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function loadFirmaHarness() {
  const sandbox = {
    console,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    document: {
      getElementById: () => null,
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
  return sandbox;
}

describe('_firmaSessionNext (orden prepared→reviewed→approved)', () => {
  test('vacío → prepared', () => {
    const sb = loadFirmaHarness();
    vm.runInContext('_firmaSignatureState = {};', sb);
    expect(vm.runInContext('_firmaSessionNext()', sb)).toBe('prepared');
  });

  test('prepared firmado → reviewed', () => {
    const sb = loadFirmaHarness();
    vm.runInContext(`_firmaSignatureState = { prepared: { signed: true } };`, sb);
    expect(vm.runInContext('_firmaSessionNext()', sb)).toBe('reviewed');
  });

  test('prepared+reviewed → approved', () => {
    const sb = loadFirmaHarness();
    vm.runInContext(`_firmaSignatureState = { prepared: { signed: true }, reviewed: { signed: true } };`, sb);
    expect(vm.runInContext('_firmaSessionNext()', sb)).toBe('approved');
  });

  test('todo firmado → null (completa)', () => {
    const sb = loadFirmaHarness();
    vm.runInContext(
      `_firmaSignatureState = { prepared: { signed: true }, reviewed: { signed: true }, approved: { signed: true } };`,
      sb
    );
    expect(vm.runInContext('_firmaSessionNext()', sb)).toBeNull();
  });

  test('rol reseteado vuelve a ser el siguiente', () => {
    const sb = loadFirmaHarness();
    vm.runInContext(
      `_firmaSignatureState = { prepared: { signed: true }, reviewed: { signed: false } };`,
      sb
    );
    expect(vm.runInContext('_firmaSessionNext()', sb)).toBe('reviewed');
  });
});
