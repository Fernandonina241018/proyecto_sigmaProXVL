// Invariante del dataset: filas rectangulares sin perder datos.
// Carga indexx-globals.js en un vm mínimo (el archivo solo define estado y
// funciones; no toca DOM al cargarse).
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = readFileSync(join(__dirname, '..', 'js', 'core', 'indexx-globals.js'), 'utf-8');

function loadNormalize() {
  const mem = new Map();
  const store = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => { mem.set(String(k), String(v)); },
    removeItem: (k) => { mem.delete(k); },
  };
  const sandbox = {
    console, Array, Math, JSON, Date,
    localStorage: store, sessionStorage: store,
    showToast: () => {},
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox);
  return { normalize: sandbox._normalizeDataset, sandbox };
}

describe('_normalizeDataset — filas rectangulares', () => {
  test('rellena filas cortas y agrega columnas para filas más anchas', () => {
    const { normalize } = loadNormalize();
    const out = normalize(['A', 'B', 'C'], [
      ['1', '2', '3'],
      ['4', '5'],
      ['6'],
      ['7', '8', '9', '10'],
    ]);
    expect(out.headers).toEqual(['A', 'B', 'C', 'Col4']);
    expect(out.rows).toEqual([
      ['1', '2', '3', ''],
      ['4', '5', '', ''],
      ['6', '', '', ''],
      ['7', '8', '9', '10'],
    ]);
  });

  test('conserva todas las filas cuando una columna tiene más datos', () => {
    const { normalize } = loadNormalize();
    const headers = Array.from({ length: 11 }, (_, i) => 'C' + (i + 1));
    const rows = [];
    for (let r = 0; r < 7; r++) rows.push(headers.map((_, c) => 'v' + r + '-' + c));
    for (let r = 7; r < 14; r++) {
      const row = Array(10).fill('');
      row.push('largo-' + r);
      rows.push(row);
    }
    const out = normalize(headers, rows);
    expect(out.headers).toHaveLength(11);
    expect(out.rows).toHaveLength(14);
    out.rows.forEach((row) => expect(row).toHaveLength(11));
    expect(out.rows.slice(7).map((row) => row[10])).toEqual([
      'largo-7', 'largo-8', 'largo-9', 'largo-10', 'largo-11', 'largo-12', 'largo-13',
    ]);
  });

  test('descarta solo filas totalmente vacías', () => {
    const { normalize } = loadNormalize();
    const out = normalize(['A', 'B'], [
      ['1', ''],
      ['', ''],
      ['', '2'],
      ['   ', ''],
    ]);
    expect(out.rows).toEqual([['1', ''], ['', '2']]);
  });

  test('no muta los arreglos de entrada', () => {
    const { normalize } = loadNormalize();
    const headers = ['A', 'B'];
    const rows = [['1']];
    normalize(headers, rows);
    expect(headers).toEqual(['A', 'B']);
    expect(rows).toEqual([['1']]);
  });
});
