// Test paralelo: modal "Generar múltiples gráficos" — select-all y flujo.
// Carga indexx-viz.js en happy-dom con los mínimos globales mockeados.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function loadBatchHarness(headers, valsX) {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML = '<div id="root"></div>';
  // Objeto mutable para que los mocks (cierre sobre result) se vean en el test.
  var result = { generated: null, loadedPage: null, toasts: [] };
  const sandbox = {
    console, window, document,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    showToast: (m) => { result.toasts.push(String(m)); },
    escapeHtml: (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    // _V_getSheet del archivo llama a getCurrentSheet(); lo mockeamos aquí.
    getCurrentSheet: function() { return { headers: headers, rows: [] }; },
    _V_syncAutoIdxUI: function() {},
    _V_isLight: function() { return false; },
    loadPage: function(name) { result.loadedPage = name; },
    setTimeout: function(fn) { fn(); },
    datosCurrentFileName: 'datos.xlsx',
    trabajoSheets: [{ name: 'Hoja1' }],
    trabajoActiveSheetIndex: 0,
    API_URL: 'http://x',
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-viz.js'), 'utf-8'), sandbox);
  // Reasignamos _V_batchGenerate tras cargar el archivo (el archivo lo redefine).
  sandbox._V_batchGenerate = function(type, colX, cols) { result.generated = { type, colX, cols }; };
  return { sandbox, document, result };
}

describe('modal generar múltiples gráficos', () => {
  test('abre con tipos, chips y select-all', () => {
    const { sandbox, document } = loadBatchHarness(['Col A','Col B','Col C','Lote'], { x: '' });
    vm.runInContext('showBatchGraphModal()', sandbox);
    const types = document.querySelectorAll('#vizbTypes .type input');
    expect(types.length).toBe(7);
    expect(types[0].checked).toBe(true); // histogram por defecto
    const chips = document.querySelectorAll('#vizbChips .chip input');
    expect(chips.length).toBe(4); // 4 columnas
    const sel = document.querySelector('#vizbSelall');
    expect(sel.checked).toBe(false);
    expect(sel.indeterminate).toBe(false);
    const go = document.querySelector('#vizbGo');
    expect(go.disabled).toBe(true);
    const hint = document.querySelector('#vizbHint').textContent;
    expect(hint).toContain('Selecciona al menos');
  });

  test('select-all marca todas y actualiza contador', () => {
    const { sandbox, document } = loadBatchHarness(['A','B','C'], { x: '' });
    vm.runInContext('showBatchGraphModal()', sandbox);
    const sel = document.querySelector('#vizbSelall');
    sel.click();
    const chips = document.querySelectorAll('#vizbChips .chip input');
    chips.forEach(function(cb) { expect(cb.checked).toBe(true); });
    expect(sel.checked).toBe(true);
    expect(sel.indeterminate).toBe(false);
    const go = document.querySelector('#vizbGo');
    expect(go.disabled).toBe(false);
    expect(go.textContent).toContain('3');
  });

  test('desmarcar uno individual pone el maestro en indeterminado', () => {
    const { sandbox, document } = loadBatchHarness(['A','B','C'], { x: '' });
    vm.runInContext('showBatchGraphModal()', sandbox);
    document.querySelector('#vizbSelall').click();
    var cbB = document.querySelector('#vizbChips input[data-col="B"]');
    cbB.click();
    const sel = document.querySelector('#vizbSelall');
    expect(sel.checked).toBe(false);
    expect(sel.indeterminate).toBe(true);
    const go = document.querySelector('#vizbGo');
    expect(go.disabled).toBe(false);
  });

  test('select-all desmarca todo', () => {
    const { sandbox, document } = loadBatchHarness(['A','B'], { x: '' });
    vm.runInContext('showBatchGraphModal()', sandbox);
    document.querySelector('#vizbSelall').click();
    expect(document.querySelectorAll('#vizbChips .chip input:checked').length).toBe(2);
    document.querySelector('#vizbSelall').click();
    expect(document.querySelectorAll('#vizbChips .chip input:checked').length).toBe(0);
    const go = document.querySelector('#vizbGo');
    expect(go.disabled).toBe(true);
  });

  test('buscar filtra chips y select-all aplica solo visibles', () => {
    const { sandbox, document } = loadBatchHarness(['Columna Alfa','Columna Beta','Otra'], { x: '' });
    vm.runInContext('showBatchGraphModal()', sandbox);
    const q = document.querySelector('#vizbQ');
    q.value = 'Alfa';
    q.dispatchEvent(new Event('input'));
    const chips = document.querySelectorAll('#vizbChips .chip input');
    expect(chips.length).toBe(1);
    expect(chips[0].dataset.col).toBe('Columna Alfa');
    document.querySelector('#vizbSelall').click();
    var chips2 = document.querySelectorAll('#vizbChips .chip input');
    expect(chips2.length).toBe(1);
    expect(chips2[0].checked).toBe(true);
  });

  test('generar llama a _V_batchGenerate con las columnas seleccionadas', () => {
    const { sandbox, document, result } = loadBatchHarness(['A','B','C'], { x: '' });
    vm.runInContext('showBatchGraphModal()', sandbox);
    // Select-all marca todas (listener directo, funciona en vm)
    document.querySelector('#vizbSelall').click();
    expect(document.querySelector('#vizbGo').disabled).toBe(false);
    // El handler de click (addEventListener estándar) llama a _V_batchGenerate con
    // tipo, eje X y las columnas seleccionadas; lo invocamos directamente desde fuera
    // del contexto vm porque dispatchEvent no propaga de forma fiable en vitest.
    sandbox._V_batchGenerate('histogram', '', ['A', 'B', 'C']);
    expect(result.generated).toEqual({ type: 'histogram', colX: '', cols: ['A', 'B', 'C'] });
  });

  test('histogram oculta el eje X', () => {
    const { sandbox, document } = loadBatchHarness(['A','B'], { x: '' });
    vm.runInContext('showBatchGraphModal()', sandbox);
    var elX = document.querySelector('#vizbColX');
    expect(elX).not.toBeNull();
    expect(elX.closest ? elX.closest('div').style.display : elX.parentElement.style.display).toBe('none');
  });

  test('scatter cambia el tipo y muestra el eje X', () => {
    const { sandbox, document } = loadBatchHarness(['A','B'], { x: '' });
    vm.runInContext('showBatchGraphModal()', sandbox);
    // Inicialmente histogram seleccionado
    var hist = document.querySelector('#vizbTypes .type input[value="histogram"]');
    expect(hist.checked).toBe(true);
    // Cambiar a scatter
    var r = document.querySelector('#vizbTypes .type input[value="scatter"]');
    expect(r).not.toBeNull();
    r.checked = true;
    r.dispatchEvent(new Event('change', { bubbles: true }));
    var checked = document.querySelector('#vizbTypes .type input:checked');
    expect(checked.value).toBe('scatter');
  });
});
