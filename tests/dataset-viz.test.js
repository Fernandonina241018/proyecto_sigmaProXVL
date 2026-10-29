import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const code = readFileSync(join(__dirname, '..', 'js', 'core', 'indexx-trabajo.js'), 'utf8');

// Harness del borrado de datos: verifica avisos (C) e invalidación del gráfico (A).
function loadHarness(opts = {}) {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML = '<div id="paneLeft"></div>';

  const calls = { confirm: [], toasts: [], persist: 0, loadPage: [], clearChart: 0, refreshGallery: 0 };
  let confirmAnswer = opts.confirm !== false;

  const sheet = () => ({
    name: 'datos_prueba',
    headers: ['Mes', 'Ventas'],
    rows: [['1', '10'], ['2', '20']]
  });

  const sandbox = {
    console,
    window,
    document,
    sessionStorage: window.sessionStorage,
    setTimeout,
    clearTimeout,
    escapeHtml: (s) => String(s == null ? '' : s),
    confirm: (msg) => { calls.confirm.push(String(msg)); return confirmAnswer; },
    showToast: (m) => { calls.toasts.push(String(m)); },
    _persistAllData: () => { calls.persist++; },
    loadPage: (p) => { calls.loadPage.push(p); },
    updateDatosUI: () => {},
    pushUndo: () => {},
    getCurrentSheet: null,
    trabajoSheets: [
      { name: 'datos_prueba', headers: ['Mes', 'Ventas'], rows: [['1', '10'], ['2', '20']] },
      { name: 'Hoja2', headers: ['A', 'B'], rows: [['1', '2']] }
    ],
    trabajoActiveSheetIndex: 0,
    trabajoActiveCell: { row: 0, col: 0 },
    datosCurrentData: { headers: ['Mes', 'Ventas'], rows: [['1', '10'], ['2', '20']] },
    datosCurrentFileName: 'datos_prueba.csv',
    datosSourceType: 'csv',
    datosFilters: [],
    trabajoLimits: null,
    trabajoLimitsMode: 'global',
    undoStack: [],
    redoStack: [],
    MAX_UNDO: 50,
    _undoLimitForCells: () => 50,
    Visualizacion: {
      _countChartsForFile: () => (opts.fileCharts || 0),
      _countChartsForSheet: () => (opts.sheetCharts || 0)
    },
    _V: { _sheetOverride: null, _activeGalleryId: 7, _galleryMode: true, _galleryTitle: 'x' },
    _V_clearChartDisplay: () => { calls.clearChart++; },
    vizRefreshGallery: () => { calls.refreshGallery++; }
  };
  sandbox.getCurrentSheet = () => sandbox.trabajoSheets[sandbox.trabajoActiveSheetIndex];
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'indexx-trabajo.js' });

  return { sandbox, document, calls, setConfirm: (v) => { confirmAnswer = v; } };
}

describe('Borrado de datos · avisos de gráficos (C)', () => {
  it('limpiarDataset pide confirmación mencionando los gráficos del dataset', () => {
    const h = loadHarness({ fileCharts: 3 });
    h.sandbox.limpiarDataset(false);
    expect(h.calls.confirm.length).toBe(1);
    expect(h.calls.confirm[0]).toContain('3 gráficos');
    expect(h.calls.confirm[0]).toContain('archivados');
  });

  it('limpiarDataset en singular usa "1 gráfico"', () => {
    const h = loadHarness({ fileCharts: 1 });
    h.sandbox.limpiarDataset(false);
    expect(h.calls.confirm[0]).toContain('1 gráfico');
  });

  it('sin gráficos el aviso no menciona gráficos', () => {
    const h = loadHarness({ fileCharts: 0 });
    h.sandbox.limpiarDataset(false);
    expect(h.calls.confirm[0]).not.toContain('gráfico');
  });

  it('cancelar el confirm no borra los datos', () => {
    const h = loadHarness({ fileCharts: 2 });
    h.setConfirm(false);
    h.sandbox.limpiarDataset(false);
    expect(h.sandbox.datosCurrentData).not.toBeNull();
    expect(h.calls.persist).toBe(0);
    expect(h.calls.loadPage.length).toBe(0);
  });

  it('clearCurrentSheet avisa de los gráficos de la hoja', () => {
    const h = loadHarness({ sheetCharts: 2 });
    h.sandbox.clearCurrentSheet();
    expect(h.calls.confirm[0]).toContain('2 gráficos');
    expect(h.sandbox.trabajoSheets[0].rows.every((r) => r.every((c) => c === ''))).toBe(true);
  });

  it('deleteSheet avisa y elimina la hoja al confirmar', () => {
    const h = loadHarness({ sheetCharts: 4 });
    h.sandbox.deleteSheet(1, null);
    expect(h.calls.confirm[0]).toContain('4 gráficos');
    expect(h.sandbox.trabajoSheets.length).toBe(1);
  });

  it('no se puede eliminar la única hoja', () => {
    const h = loadHarness();
    h.sandbox.trabajoSheets = [h.sandbox.trabajoSheets[0]];
    h.sandbox.deleteSheet(0, null);
    expect(h.calls.toasts.join(' ')).toContain('única hoja');
    expect(h.calls.confirm.length).toBe(0);
  });
});

describe('Borrado de datos · coherencia con Visualización (A)', () => {
  it('limpiarDataset limpia el nombre del archivo (los gráficos pasan a hold)', () => {
    const h = loadHarness({ fileCharts: 1 });
    h.sandbox.limpiarDataset(true);
    expect(h.sandbox.datosCurrentFileName).toBe('');
  });

  it('limpiarDataset invalida el gráfico visible y el estado de sesión', () => {
    const h = loadHarness();
    h.sandbox.sessionStorage.setItem('sigmaPro_vizType', 'barras');
    h.sandbox.sessionStorage.setItem('sigmaPro_vizVals', '{"x":"Mes"}');
    h.sandbox.limpiarDataset(true);
    expect(h.calls.clearChart).toBe(1);
    expect(h.calls.refreshGallery).toBe(1);
    expect(h.sandbox.sessionStorage.getItem('sigmaPro_vizType')).toBeNull();
    expect(h.sandbox.sessionStorage.getItem('sigmaPro_vizVals')).toBeNull();
  });

  it('clearCurrentSheet y deleteSheet también invalidan el gráfico visible', () => {
    const h = loadHarness();
    h.sandbox.clearCurrentSheet();
    expect(h.calls.clearChart).toBe(1);
    h.sandbox.deleteSheet(1, null);
    expect(h.calls.clearChart).toBe(2);
  });
});
