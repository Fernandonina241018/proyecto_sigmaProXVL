// Test: un gráfico renderizado desde el panel izquierdo ("⚡ Renderizar")
// debe quedar guardado en la galería igual que los de "Generar múltiples
// gráficos". Los renders internos (restaurar sesión, cambio de tema o abrir un
// gráfico guardado) NO deben crear entradas nuevas.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

const SHEET = {
  name: 'Hoja1',
  headers: ['Cat', 'Val', 'Otra'],
  rows: [['a', '1', '10'], ['b', '2', '20'], ['c', '3', '30']],
};

function fakeCtx() {
  return {
    fillStyle: '',
    clearRect() {}, fillRect() {}, drawImage() {},
    setLineDash() {}, beginPath() {}, moveTo() {}, lineTo() {},
    stroke() {}, arc() {}, fill() {}, save() {}, restore() {},
  };
}

function loadHarness(opts = {}) {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML =
    '<div id="vizGallery"><div class="gal-label">Gráficos Guardados</div></div>' +
    '<span id="vizGalCount">0</span>' +
    '<span id="vizGalNav"></span>' +
    '<div id="vizChartWrapper"></div>' +
    '<div id="vizEmptyState"></div>' +
    '<div id="vizChartTtl"></div>' +
    '<div id="vizChartTypeTag"></div>' +
    '<div id="vizToolbarInfo"></div>' +
    '<input id="vizChartTitle">' +
    '<canvas id="vizMainChart"></canvas>';

  const canvas = document.getElementById('vizMainChart');
  canvas.getContext = () => fakeCtx();
  canvas.toDataURL = () => 'data:image/jpeg;base64,MAIN';

  const origCreate = document.createElement.bind(document);
  document.createElement = (tag) => {
    const el = origCreate(tag);
    if (String(tag).toLowerCase() === 'canvas') {
      if (opts.thumbFails) {
        el.getContext = () => { throw new Error('contexto no disponible'); };
      } else {
        el.getContext = () => fakeCtx();
      }
      el.toDataURL = () => 'data:image/jpeg;base64,THUMB';
    }
    return el;
  };

  function FakeChart(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.canvas = canvas;
  }
  FakeChart.prototype.destroy = function () {};
  FakeChart.prototype.update = function () {};
  FakeChart.prototype.draw = function () {};
  FakeChart.register = function () {};
  FakeChart.defaults = {};

  const toasts = [];
  const sandbox = {
    console, window, document,
    Chart: FakeChart,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    showToast: (m) => { toasts.push(String(m)); },
    escapeHtml: (s) => String(s),
    structuredClone: (o) => JSON.parse(JSON.stringify(o)),
    getCurrentSheet: () => SHEET,
    datosCurrentFileName: 'datos.xlsx',
    trabajoSheets: [SHEET],
    trabajoActiveSheetIndex: 0,
    setTimeout: (fn) => fn(),
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-viz.js'), 'utf-8'), sandbox);
  return { sandbox, document, toasts };
}

function render(sandbox, type, vals, autoSave) {
  const arg = autoSave ? 'true' : '';
  return vm.runInContext(
    `_V.type=${JSON.stringify(type)}; _V.vals=${JSON.stringify(vals)}; vizRenderChart(${arg});`,
    sandbox
  );
}

describe('galería — render simple desde el panel izquierdo', () => {
  test('vizRenderChart(true) guarda el gráfico, lo pinta y lo persiste', () => {
    const { sandbox, document, toasts } = loadHarness();
    render(sandbox, 'barras', { x: 'Cat', y: 'Val' }, true);

    expect(vm.runInContext('_V.gallery.length', sandbox)).toBe(1);
    expect(document.querySelectorAll('#vizGallery .gal-thumb').length).toBe(1);
    expect(document.getElementById('vizGalCount').textContent).toBe('1');

    const persisted = JSON.parse(sandbox.localStorage.getItem('sigmaPro_vizGallery'));
    expect(persisted.length).toBe(1);
    expect(persisted[0].type).toBe('barras');
    expect(persisted[0].vars).toEqual({ x: 'Cat', y: 'Val' });
    expect(persisted[0].sourceSheetName).toBe('Hoja1');
    expect(persisted[0].sourceFile).toBe('datos.xlsx');
    expect(toasts.join(' | ')).toContain('guardado en galería');
  });

  test('un render interno (tema / restaurar sesión) NO guarda', () => {
    const { sandbox } = loadHarness();
    render(sandbox, 'barras', { x: 'Cat', y: 'Val' }, false);
    expect(vm.runInContext('_V.gallery.length', sandbox)).toBe(0);
    expect(sandbox.localStorage.getItem('sigmaPro_vizGallery')).toBeNull();
  });

  test('re-renderizar el mismo gráfico no duplica la entrada', () => {
    const { sandbox } = loadHarness();
    render(sandbox, 'barras', { x: 'Cat', y: 'Val' }, true);
    render(sandbox, 'barras', { x: 'Cat', y: 'Val' }, true);
    expect(vm.runInContext('_V.gallery.length', sandbox)).toBe(1);
  });

  test('cambiar variables crea una entrada nueva', () => {
    const { sandbox } = loadHarness();
    render(sandbox, 'barras', { x: 'Cat', y: 'Val' }, true);
    render(sandbox, 'barras', { x: 'Cat', y: 'Otra' }, true);
    expect(vm.runInContext('_V.gallery.length', sandbox)).toBe(2);
  });

  test('el botón 💾 después del render tampoco duplica', () => {
    const { sandbox } = loadHarness();
    render(sandbox, 'barras', { x: 'Cat', y: 'Val' }, true);
    vm.runInContext('vizSaveToGallery()', sandbox);
    expect(vm.runInContext('_V.gallery.length', sandbox)).toBe(1);
  });

  test('render explícito desde modo galería sale del modo y guarda aparte', () => {
    const { sandbox } = loadHarness();
    render(sandbox, 'barras', { x: 'Cat', y: 'Val' }, true);
    vm.runInContext('_V_showGalleryChart(_V.gallery[0])', sandbox);
    expect(vm.runInContext('_V._galleryMode', sandbox)).toBe(true);
    render(sandbox, 'barras', { x: 'Cat', y: 'Otra' }, true);
    expect(vm.runInContext('_V._galleryMode', sandbox)).toBe(false);
    expect(vm.runInContext('_V.gallery.length', sandbox)).toBe(2);
  });

  test('abrir un gráfico de la galería no lo vuelve a guardar', () => {
    const { sandbox } = loadHarness();
    render(sandbox, 'barras', { x: 'Cat', y: 'Val' }, true);
    const before = vm.runInContext('_V.gallery.length', sandbox);
    vm.runInContext('_V_showGalleryChart(_V.gallery[0])', sandbox);
    expect(vm.runInContext('_V.gallery.length', sandbox)).toBe(before);
  });

  test('un fallo en la miniatura no impide guardar', () => {
    const { sandbox, document } = loadHarness({ thumbFails: true });
    render(sandbox, 'barras', { x: 'Cat', y: 'Val' }, true);
    expect(vm.runInContext('_V.gallery.length', sandbox)).toBe(1);
    expect(document.querySelectorAll('#vizGallery .gal-thumb').length).toBe(1);
    const persisted = JSON.parse(sandbox.localStorage.getItem('sigmaPro_vizGallery'));
    expect(persisted.length).toBe(1);
  });

  test('vizSaveToGallery sin gráfico avisa y no crea entradas', () => {
    const { sandbox, toasts } = loadHarness();
    vm.runInContext('vizSaveToGallery()', sandbox);
    expect(vm.runInContext('_V.gallery.length', sandbox)).toBe(0);
    expect(toasts.join(' ')).toContain('Renderiza un gráfico primero');
  });
});
