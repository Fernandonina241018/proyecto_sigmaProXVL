import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function makeEl(extra = {}) {
  return Object.assign(
    {
      value: '',
      textContent: '',
      innerHTML: '',
      style: {},
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      getContext: () => ({}),
      addEventListener: () => {},
    },
    extra
  );
}

function loadVizHarness() {
  const els = {};
  const stats = { constructed: 0, updated: 0, destroyed: 0 };
  function FakeChart(ctx, config) {
    stats.constructed++;
    this.ctx = ctx;
    this.config = config;
    this.destroyed = false;
  }
  FakeChart.prototype.destroy = function () { stats.destroyed++; this.destroyed = true; };
  FakeChart.prototype.update = function () { stats.updated++; };
  FakeChart.prototype.draw = function () {};
  FakeChart.register = function () {};
  FakeChart.defaults = {};
  const sandbox = {
    console,
    Chart: FakeChart,
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    document: {
      documentElement: { getAttribute: () => null },
      getElementById: (id) => {
        if (!els[id]) els[id] = makeEl();
        return els[id];
      },
      createElement: () => makeEl(),
      addEventListener: () => {},
      head: { appendChild: () => {} },
    },
    showToast: () => {},
    escapeHtml: (s) => String(s),
    structuredClone: (o) => JSON.parse(JSON.stringify(o)),
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-viz.js'), 'utf-8'), sandbox);
  return { sandbox, stats, els };
}

const SHEET = `{name:'T',headers:['Cat','Val'],rows:[['a','1'],['b','2'],['c','3']]}`;

describe('vizRenderChart — reutilización de instancia (OPT-5)', () => {
  test('primer render crea instancia y fija _lastType', () => {
    const { sandbox, stats } = loadVizHarness();
    vm.runInContext(`_V.type='barras'; _V.vals={x:'Cat',y:'Val'}; _V._sheetOverride=${SHEET}; vizRenderChart();`, sandbox);
    expect(stats.constructed).toBe(1);
    expect(vm.runInContext('_V._lastType', sandbox)).toBe('barras');
    expect(vm.runInContext('!!_V.chart', sandbox)).toBe(true);
  });

  test('mismo tipo re-renderiza con update (sin new Chart)', () => {
    const { sandbox, stats } = loadVizHarness();
    const setup = `_V.type='barras'; _V.vals={x:'Cat',y:'Val'}; _V._sheetOverride=${SHEET}; vizRenderChart();`;
    vm.runInContext(setup, sandbox);
    expect(stats.constructed).toBe(1);
    vm.runInContext(`_V.vals={x:'Cat',y:'Val'}; vizRenderChart();`, sandbox);
    expect(stats.constructed).toBe(1); // sin nueva instancia
    expect(stats.updated).toBe(1); // update() invocado
  });

  test('cambio de tipo destruye y crea nueva instancia', () => {
    const { sandbox, stats } = loadVizHarness();
    vm.runInContext(`_V.type='barras'; _V.vals={x:'Cat',y:'Val'}; _V._sheetOverride=${SHEET}; vizRenderChart();`, sandbox);
    vm.runInContext(`_V.type='lineas'; _V.vals={x:'Cat',y:'Val'}; vizRenderChart();`, sandbox);
    expect(stats.constructed).toBe(2);
    expect(stats.destroyed).toBe(1);
    expect(vm.runInContext('_V._lastType', sandbox)).toBe('lineas');
  });

  test('_V_destroyChart invalida _lastType', () => {
    const { sandbox, stats } = loadVizHarness();
    vm.runInContext(`_V.type='barras'; _V.vals={x:'Cat',y:'Val'}; _V._sheetOverride=${SHEET}; vizRenderChart(); _V_destroyChart();`, sandbox);
    expect(vm.runInContext('_V._lastType', sandbox)).toBeNull();
    expect(vm.runInContext('_V.chart', sandbox)).toBeNull();
    vm.runInContext(`vizRenderChart();`, sandbox);
    expect(stats.constructed).toBe(2); // no reutiliza tras destroy
  });
});
