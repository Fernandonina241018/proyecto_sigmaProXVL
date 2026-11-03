import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const core = join(root, 'js', 'core');

function loadHarness() {
  const toasts = [];
  const pages = [];
  const state = { resultados: null };

  const sandbox = {
    console,
    document: globalThis.document,
    window: {},
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
    setTimeout,
    clearTimeout,
    confirm: () => true,
    prompt: () => 'HojaNueva',
    showToast: (msg) => toasts.push(msg),
    showUndoToast: () => {},
    loadPage: (page) => pages.push(page),
    escapeHtml: (text) => String(text == null ? '' : text),
    _persistAllData: () => {},
    _invalidarVizActual: () => {},
    _countChartsForSheet: () => 0,
    StateManager: {
      setUltimosResultados: (value) => { state.resultados = value; },
      getUltimosResultados: () => state.resultados,
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-globals.js'), 'utf-8'), sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-trabajo.js'), 'utf-8'), sandbox);

  return { sandbox, toasts, pages, state };
}

function setSheets(sandbox, activeIndex = 0) {
  vm.runInContext(`
    trabajoSheets = [
      { name:'Hoja1', headers:['A','B'], rows:[['1','2'],['3','4']], locked:false },
      { name:'Hoja2', headers:['A','B'], rows:[['5','6'],['7','8']], locked:false },
      { name:'Hoja3', headers:['A','B'], rows:[['9','10'],['11','12']], locked:false }
    ];
    trabajoActiveSheetIndex = ${activeIndex};
    analisisSelectedTest = 't-test';
    analisisResultContent = '<div>resultado</div>';
    analisisLastResult = { testName:'t-test', pValue:0.01, significativo:true };
    StateManager.setUltimosResultados({ columnasAnalizadas:['A'], estadisticos:['t-Test'], totalFilas:2, totalColumnas:2, resultados:{} });
    captureAnalisisFocus();
  `, sandbox);
}

describe('Foco de análisis · invalidación al cambiar de hoja', () => {
  it('mantiene el resultado si se vuelve a seleccionar la misma hoja', () => {
    const { sandbox, state } = loadHarness();
    setSheets(sandbox, 0);
    vm.runInContext('switchToSheet(0)', sandbox);

    expect(vm.runInContext('analisisResultContent', sandbox)).toBe('<div>resultado</div>');
    expect(vm.runInContext('analisisResultOrigin.name', sandbox)).toBe('Hoja1');
    expect(state.resultados).not.toBeNull();
    expect(vm.runInContext('analisisResultadosVigentes()', sandbox)).toBe(true);
  });

  it('descarta resultado y caché de reporte al cambiar de hoja', () => {
    const { sandbox, state, toasts } = loadHarness();
    setSheets(sandbox, 0);
    vm.runInContext('switchToSheet(1)', sandbox);

    expect(vm.runInContext('analisisResultContent', sandbox)).toBeNull();
    expect(vm.runInContext('analisisLastResult', sandbox)).toBeNull();
    expect(vm.runInContext('analisisResultOrigin', sandbox)).toBeNull();
    expect(vm.runInContext('analisisSelectedTest', sandbox)).toBeNull();
    expect(state.resultados).toBeNull();
    expect(vm.runInContext('analisisResultadosVigentes()', sandbox)).toBe(false);
    expect(toasts.join(' ')).toContain('Análisis descartado');
  });

  it('borrar una hoja anterior conserva la hoja activa y su análisis', () => {
    const { sandbox, state } = loadHarness();
    setSheets(sandbox, 2);
    vm.runInContext('deleteSheet(0, { stopPropagation: function(){} })', sandbox);

    expect(vm.runInContext('trabajoActiveSheetIndex', sandbox)).toBe(1);
    expect(vm.runInContext('getCurrentSheet().name', sandbox)).toBe('Hoja3');
    expect(vm.runInContext('analisisResultContent', sandbox)).toBe('<div>resultado</div>');
    expect(state.resultados).not.toBeNull();
  });

  it('borrar la hoja activa invalida el análisis', () => {
    const { sandbox, state } = loadHarness();
    setSheets(sandbox, 1);
    vm.runInContext('deleteSheet(1, { stopPropagation: function(){} })', sandbox);

    expect(vm.runInContext('analisisResultContent', sandbox)).toBeNull();
    expect(state.resultados).toBeNull();
    expect(vm.runInContext('analisisResultadosVigentes()', sandbox)).toBe(false);
  });

  it('crear o limpiar una hoja también invalida', () => {
    const { sandbox, state } = loadHarness();
    setSheets(sandbox, 0);
    vm.runInContext('createNewSheet()', sandbox);

    expect(vm.runInContext('analisisResultContent', sandbox)).toBeNull();
    expect(state.resultados).toBeNull();

    setSheets(sandbox, 0);
    vm.runInContext('clearCurrentSheet()', sandbox);
    expect(vm.runInContext('analisisResultContent', sandbox)).toBeNull();
    expect(state.resultados).toBeNull();
  });
});

describe('Guardas estructurales', () => {
  it('Reportes descarta resultados que no pertenecen a la hoja activa', () => {
    const reporte = readFileSync(join(root, 'js', 'managers', 'ReporteManager.js'), 'utf8');
    expect(reporte).toContain('analisisResultadosVigentes()');
    expect(reporte).toContain('if (!_focusOk) resultados = null;');
  });

  it('el botón de nueva hoja es visible y grande en la barra de hojas', () => {
    const ui = readFileSync(join(core, 'indexx-ui.js'), 'utf8');
    const css = readFileSync(join(core, '..', '..', 'css', 'core', 'indexx.css'), 'utf8');
    expect(ui).toContain('class="sheet-add-btn"');
    expect(ui).toContain('class="sheet-add-full"');
    expect(ui).toContain('Nueva hoja');
    expect(css).toContain('.sheet-add-btn');
    expect(css).toContain('.datos .sheet-add-full');
  });
});
