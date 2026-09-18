import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function loadDatosHarness() {
  const sandbox = {
    console,
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
    document: { getElementById: () => null },
    showToast: () => {},
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-datos.js'), 'utf-8'), sandbox);
  return sandbox;
}

describe('_xlsxSheetToRows (paridad worker/sync)', () => {
  test('convierte headers y filas, stringifica valores', () => {
    const sb = loadDatosHarness();
    const out = vm.runInContext(
      `_xlsxSheetToRows([['A','B'],[1,2],['x','y']])`,
      sb
    );
    expect(out).toEqual({ headers: ['A', 'B'], rows: [['1', '2'], ['x', 'y']] });
  });

  test('filtra filas totalmente vacías y normaliza null→""', () => {
    const sb = loadDatosHarness();
    const out = vm.runInContext(
      `_xlsxSheetToRows([['A','B'],['',''],[null,'v'],['',null]])`,
      sb
    );
    expect(out).toEqual({ headers: ['A', 'B'], rows: [['', 'v'], ['', '']] });
  });

  test('headers nulos se vuelven ""', () => {
    const sb = loadDatosHarness();
    const out = vm.runInContext(`_xlsxSheetToRows([[null,'B'],[1,2]])`, sb);
    expect(out.headers).toEqual(['', 'B']);
  });

  test('handleFile rechaza >10MB sin parsear', () => {
    const sb = loadDatosHarness();
    let toasted = '';
    sb.showToast = (m) => { toasted = String(m); };
    vm.runInContext(`handleFile({ size: 11*1024*1024, name: 'big.xlsx' })`, sb);
    expect(toasted).toMatch('10 MB');
  });

  test('handleFile rechaza extensiones no soportadas', () => {
    const sb = loadDatosHarness();
    let toasted = '';
    sb.showToast = (m) => { toasted = String(m); };
    vm.runInContext(`handleFile({ size: 100, name: 'doc.pdf' })`, sb);
    expect(toasted).toMatch('no soportado');
  });
});
