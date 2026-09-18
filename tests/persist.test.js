import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function loadGlobalsHarness() {
  const store = {};
  const calls = { saveGallery: 0, badge: 0 };
  const sandbox = {
    console,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
    _V: { gallery: [] },
    _V_saveGallery: () => { calls.saveGallery++; },
    updateAnalisisDatasetBadge: () => { calls.badge++; },
    showToast: () => {},
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-globals.js'), 'utf-8'), sandbox);
  return { sandbox, store, calls };
}

describe('_persistAllData (fuente única / desacople galería)', () => {
  test('persiste trabajoSheets sin llamar a _V_saveGallery', () => {
    const { sandbox, store, calls } = loadGlobalsHarness();
    vm.runInContext('trabajoSheets', sandbox); // existe
    vm.runInContext('_persistAllData()', sandbox);
    expect(store['sigmaPro_trabajoSheets']).toBeDefined();
    expect(JSON.parse(store['sigmaPro_trabajoSheets'])).toHaveLength(1);
    // La galería se auto-persiste en cada mutación (save/del/batch/load);
    // _persistAllData NO debe reescribirla en cada edición de celda.
    expect(calls.saveGallery).toBe(0);
    expect(calls.badge).toBe(1);
  });

  test('restaura trabajoSheets desde localStorage', () => {
    const { sandbox } = loadGlobalsHarness();
    vm.runInContext(
      `localStorage.setItem('sigmaPro_trabajoSheets', JSON.stringify([{name:'X',headers:['A'],rows:[['1']],locked:true}])); _restoreAllData();`,
      sandbox
    );
    const name = vm.runInContext('trabajoSheets[0].name', sandbox);
    expect(name).toBe('X');
  });
});
