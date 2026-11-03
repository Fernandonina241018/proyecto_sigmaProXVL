import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

// Harness mínimo para sendToTrabajo: globals de la app + stubs de efectos.
function loadSendHarness() {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML = '';
  const toasts = [];
  let page = null;

  const sandbox = {
    console,
    window,
    document,
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
    setTimeout,
    clearTimeout,
    showToast: (m) => { toasts.push(String(m)); },
    escapeHtml: (s) => String(s),
    loadPage: (name) => { page = name; },
    _persistAllData: () => {
      if (sandbox.__persistDropNew) sandbox.trabajoSheets.pop();
    },
    trabajoSheets: [{ name: 'Hoja1', headers: ['C1'], rows: [['']], locked: false }],
    trabajoActiveSheetIndex: 0,
    trabajoActiveCell: { row: 0, col: 0 },
    trabajoPage: 0,
    datosCurrentData: null,
    datosCurrentFileName: '',
    datosFilteredRows: [],
    __persistDropNew: false,
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-datos.js'), 'utf-8'), sandbox);
  return {
    sandbox,
    toasts,
    getPage: () => page,
    send: () => vm.runInContext('sendToTrabajo()', sandbox),
  };
}

function seed(h, name, rows, headers = ['A', 'B']) {
  h.sandbox.datosCurrentFileName = name;
  h.sandbox.datosCurrentData = {
    headers,
    rows,
    colTypes: headers.map(() => 'text'),
  };
  h.sandbox.datosFilteredRows = [];
}

describe('sendToTrabajo', () => {
  test('envía el dataset como hoja nueva y navega a trabajo', () => {
    const h = loadSendHarness();
    seed(h, 'datos.csv', [['1', '2'], ['3', '4']]);
    h.send();
    expect(h.sandbox.trabajoSheets.map((s) => s.name)).toEqual(['Hoja1', 'datos']);
    expect(h.sandbox.trabajoActiveSheetIndex).toBe(1);
    expect(h.sandbox.trabajoSheets[1].rows).toEqual([['1', '2'], ['3', '4']]);
    expect(h.sandbox.trabajoSheets[1].locked).toBe(true);
    expect(h.getPage()).toBe('trabajo');
  });

  test('un segundo envío idéntico reutiliza la hoja (no duplica)', () => {
    const h = loadSendHarness();
    seed(h, 'datos.csv', [['1', '2']]);
    h.send();
    h.send();
    expect(h.sandbox.trabajoSheets).toHaveLength(2);
    expect(h.sandbox.trabajoActiveSheetIndex).toBe(1);
  });

  test('mismo nombre con datos distintos crea una hoja con sufijo', () => {
    const h = loadSendHarness();
    seed(h, 'datos.csv', [['1', '2']]);
    h.send();
    seed(h, 'datos.csv', [['9', '9']]);
    h.send();
    expect(h.sandbox.trabajoSheets.map((s) => s.name)).toEqual(['Hoja1', 'datos', 'datos (2)']);
    expect(h.sandbox.trabajoSheets[2].rows).toEqual([['9', '9']]);
  });

  test('un tercer envío del mismo dataset reutiliza el sufijo (no crea datos (3))', () => {
    const h = loadSendHarness();
    seed(h, 'datos.csv', [['1', '2']]);
    h.send();
    seed(h, 'datos.csv', [['9', '9']]);
    h.send();
    h.send();
    expect(h.sandbox.trabajoSheets).toHaveLength(3);
  });

  test('respeta el filtro activo (envía solo las filas filtradas)', () => {
    const h = loadSendHarness();
    seed(h, 'datos.csv', [['1', '2'], ['3', '4'], ['5', '6']]);
    h.sandbox.datosFilteredRows = [['3', '4']];
    h.send();
    expect(h.sandbox.trabajoSheets[1].rows).toEqual([['3', '4']]);
  });

  test('si la persistencia descarta la hoja nueva, la conserva en memoria y avisa', () => {
    const h = loadSendHarness();
    seed(h, 'grande.csv', [['1', '2']]);
    h.sandbox.__persistDropNew = true;
    h.send();
    expect(h.sandbox.trabajoSheets.map((s) => s.name)).toEqual(['Hoja1', 'grande']);
    expect(h.sandbox.trabajoActiveSheetIndex).toBe(1);
    expect(h.toasts.some((t) => t.includes('no cabe en el almacenamiento'))).toBe(true);
    expect(h.getPage()).toBe('trabajo');
  });

  test('sin dataset avisa y no navega', () => {
    const h = loadSendHarness();
    h.send();
    expect(h.getPage()).toBe(null);
    expect(h.toasts.some((t) => t.includes('No hay datos para enviar'))).toBe(true);
  });
});
