// REGRESIÓN: un gráfico del dataset ACTUAL no debe quedar en "hold" al volver a Visualización.
// Causa original: _V_saveGallery() no guardaba `sourceFile`; initVizPage() recarga la galería desde
// localStorage (_V_loadGallery) y _V_graficoPerteneceActual comparaba `undefined !== 'archivo.csv'`
// → todo gráfico pasaba a hold (miniatura bloqueada y fuera del reporte) sin cambiar el dataset.
// La protección real (dataset cambiado / borrado / otra hoja) debe seguir funcionando.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = readFileSync(join(__dirname, '..', 'js', 'core', 'indexx-viz.js'), 'utf-8');

function loadViz() {
  const store = {};
  const noop = () => {};
  const sb = {
    console,
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    sessionStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ style: {} }), addEventListener: noop },
    showToast: noop,
    escapeHtml: (s) => String(s == null ? '' : s),
    structuredClone,
    datosCurrentFileName: 'ventas.csv',
    trabajoSheets: [{ name: 'Hoja1', headers: ['T', 'H'], rows: [[1, 2]] }, { name: 'Hoja2', headers: ['T', 'H'], rows: [[1, 2]] }],
    trabajoActiveSheetIndex: 0,
  };
  sb.window = sb; sb.globalThis = sb;
  vm.createContext(sb);
  vm.runInContext(SRC, sb);
  return { sb, run: (code) => vm.runInContext(code, sb) };
}

// El usuario genera un gráfico y luego sale/vuelve a Visualización (initVizPage → _V_loadGallery).
function guardarYVolver(env, extra) {
  env.run(`_V.gallery = [${JSON.stringify(Object.assign({
    id: 1, title: 'g', type: 'scatter', vars: { x: 'T', y: 'H' }, palette: 'violet', createdAt: 1,
    sourceFile: 'ventas.csv', sourceSheetIndex: 0, sourceSheetName: 'Hoja1',
  }, extra || {}))}]; _V_saveGallery(); _V_loadGallery();`);
  return env.run('_V.gallery[0]');
}

describe('galería de gráficos — hold solo cuando el dataset realmente cambió', () => {
  test('sourceFile sobrevive a guardar + recargar la galería', () => {
    const env = loadViz();
    const g = guardarYVolver(env);
    expect(g.sourceFile).toBe('ventas.csv');
  });

  test('mismo dataset y misma hoja tras volver a Visualización → NO queda en hold', () => {
    const env = loadViz();
    const g = guardarYVolver(env);
    expect(env.sb._V_graficoPerteneceActual(g)).toBe(true);
  });

  test('dataset distinto → hold', () => {
    const env = loadViz();
    const g = guardarYVolver(env);
    env.sb.datosCurrentFileName = 'otro.csv';
    expect(env.sb._V_graficoPerteneceActual(g)).toBe(false);
  });

  test('dataset borrado (sin archivo cargado) → hold', () => {
    const env = loadViz();
    const g = guardarYVolver(env);
    env.sb.datosCurrentFileName = '';
    expect(env.sb._V_graficoPerteneceActual(g)).toBe(false);
  });

  test('otra hoja → hold', () => {
    const env = loadViz();
    const g = guardarYVolver(env);
    env.sb.trabajoActiveSheetIndex = 1;
    expect(env.sb._V_graficoPerteneceActual(g)).toBe(false);
  });

  test('gráfico guardado por una versión anterior (sin sourceFile) con dataset cargado → no hold', () => {
    const env = loadViz();
    env.run(`localStorage.setItem('sigmaPro_vizGallery', JSON.stringify([{ id: 2, title: 'viejo', type: 'bar', vars: {}, palette: 'violet', sourceSheetIndex: 0, sourceSheetName: 'Hoja1' }])); _V_loadGallery();`);
    const g = env.run('_V.gallery[0]');
    expect(g.sourceFile).toBe(undefined);
    expect(env.sb._V_graficoPerteneceActual(g)).toBe(true);
  });

  test('gráfico guardado por una versión anterior (sin sourceFile) y SIN dataset cargado → hold', () => {
    const env = loadViz();
    env.run(`localStorage.setItem('sigmaPro_vizGallery', JSON.stringify([{ id: 2, title: 'viejo', type: 'bar', vars: {}, palette: 'violet', sourceSheetIndex: 0, sourceSheetName: 'Hoja1' }])); _V_loadGallery();`);
    env.sb.datosCurrentFileName = '';
    expect(env.sb._V_graficoPerteneceActual(env.run('_V.gallery[0]'))).toBe(false);
  });

  test('gráfico heredado: al adoptarlo fija su origen y luego SÍ queda en hold con otro dataset', () => {
    // Sin la adopción pegajosa, un gráfico heredado se asumía del dataset
    // actual en cada llamada y podía entrar en el reporte de otro dataset.
    const env = loadViz();
    env.run(`localStorage.setItem('sigmaPro_vizGallery', JSON.stringify([{ id: 3, title: 'heredado', type: 'bar', vars: {}, palette: 'violet', createdAt: 1, sourceSheetIndex: 0, sourceSheetName: 'Hoja1' }])); _V_loadGallery();`);
    const g = env.run('_V.gallery[0]');
    expect(env.sb._V_graficoPerteneceActual(g)).toBe(true);   // se adopta (misma hoja)
    expect(g.sourceFile).toBe('ventas.csv');                    // origen fijado
    env.sb.datosCurrentFileName = 'otro.csv';
    expect(env.sb._V_graficoPerteneceActual(g)).toBe(false);  // ahora sí: hold
  });
});
