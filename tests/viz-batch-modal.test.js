// Regresión: modal "Generar múltiples gráficos" (opt-in, sin duplicados).
// Bug: todos los checkboxes venían marcados por defecto y se generaban
// gráficos no seleccionados; doble apertura duplicaba el set.
import { describe, test, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function loadHarness(headers) {
  const window = new Window();
  const document = window.document;
  function FakeChart() {}
  FakeChart.prototype.destroy = function () {};
  FakeChart.register = function () {};
  FakeChart.defaults = {};
  const sandbox = {
    console,
    window, document,
    Event: window.Event,
    setTimeout: (fn, ms, ...a) => setTimeout(fn, ms, ...a),
    clearTimeout: (id) => clearTimeout(id),
    Chart: FakeChart,
    showToast: () => {},
    escapeHtml: (s) => String(s),
    structuredClone: (o) => JSON.parse(JSON.stringify(o)),
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    loadPage: () => {},
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-viz.js'), 'utf-8'), sandbox);
  vm.runInContext('_V._sheetOverride = { headers: ' + JSON.stringify(headers) + ', rows: [] };', sandbox);
  return { sandbox, document, window };
}

function openModal(document, sandbox) {
  vm.runInContext('showBatchGraphModal()', sandbox);
  return document.getElementById('vizBatchModal');
}

function checkNth(document, window, n) {
  const cbs = document.querySelectorAll('.viz-modal-batch-chk');
  cbs[n].checked = true;
  cbs[n].dispatchEvent(new window.Event('change', { bubbles: true }));
}

describe('modal batch de gráficos', () => {
  test('opt-in: ningún checkbox marcado por defecto + contador en 0', () => {
    const { document, sandbox } = loadHarness(['A', 'B', 'C']);
    const modal = openModal(document, sandbox);
    expect(modal).not.toBeNull();
    expect(modal.querySelectorAll('.viz-modal-batch-chk').length).toBe(3);
    expect(modal.querySelectorAll('.viz-modal-batch-chk:checked').length).toBe(0);
    expect(document.getElementById('vizModalSelCount').textContent).toBe('0 columnas seleccionadas');
    expect(document.getElementById('vizModalGenerate').textContent).toBe('🎨 Generar');
  });

  test('contador vivo y botón con N al marcar', () => {
    const { document, sandbox, window } = loadHarness(['A', 'B', 'C']);
    openModal(document, sandbox);
    checkNth(document, window, 0);
    checkNth(document, window, 2);
    expect(document.getElementById('vizModalSelCount').textContent).toBe('2 columnas seleccionadas');
    expect(document.getElementById('vizModalGenerate').textContent).toBe('🎨 Generar (2)');
  });

  test('reabrir no duplica el modal en el DOM', () => {
    const { document, sandbox } = loadHarness(['A', 'B']);
    openModal(document, sandbox);
    openModal(document, sandbox);
    expect(document.querySelectorAll('#vizBatchModal').length).toBe(1);
    expect(document.querySelectorAll('.viz-modal-batch-chk').length).toBe(2);
  });

  test('generar deduce columnas y no repite encabezados duplicados', async () => {
    const { document, sandbox, window } = loadHarness(['A', 'A', 'B']);
    openModal(document, sandbox);
    vm.runInContext('_V_batchGenerate = function(t, x, cols) { __captured = cols; };', sandbox);
    checkNth(document, window, 0);
    checkNth(document, window, 1); // mismo encabezado 'A' dos veces
    checkNth(document, window, 2);
    document.getElementById('vizModalGenerate').click();
    await new Promise((r) => setTimeout(r, 400)); // setTimeout(150) interno
    const captured = vm.runInContext('__captured', sandbox);
    expect(captured).toEqual(['A', 'B']);
  }, 10000);
});
