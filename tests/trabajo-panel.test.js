import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

// El keydown delegado vive en indexx-trabajo.js (top-level). Los onclick
// inline resuelven en el global real: se stubbean ahí con limpieza.
function loadTrabajoHarness() {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML =
    '<div id="panelTrabajo">' +
    '<div class="mr" role="button" tabindex="0" onclick="__trabHit(\'add\')"></div>' +
    '</div>' +
    '<div id="panelDatos">' +
    '<div class="mr" role="button" tabindex="0" data-act="x"></div>' +
    '</div>';
  const sandbox = {
    console,
    window, document,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    setTimeout, clearTimeout, setInterval, clearInterval,
    showToast: () => {},
    escapeHtml: (s) => String(s),
    _persistAllData: () => {},
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  // document/window del harness deben ser los globales para addEventListener top-level
  const vmDoc = sandbox.document;
  void vmDoc;
  vm.createContext(sandbox);
  // El listener top-level usa `document`: exponer el de happy-dom como global del sandbox
  sandbox.document = document;
  vm.runInContext(readFileSync(join(core, 'indexx-trabajo.js'), 'utf-8'), sandbox);
  return { sandbox, document, window };
}

describe('Panel trabajo: teclado en filas .mr', () => {
  test('Enter invoca click() solo dentro de #panelTrabajo', async () => {
    const { document, window } = loadTrabajoHarness();
    const hits = [];
    // happy-dom no ejecuta onclick inline: se espía el .click() que la
    // delegación invoca (el navegador real sí dispara el inline).
    const row = document.querySelector('#panelTrabajo .mr');
    row.click = () => { hits.push('trabajo'); };
    const other = document.querySelector('#panelDatos .mr');
    other.click = () => { hits.push('datos'); };
    row.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(hits).toEqual(['trabajo']);
    // Fuera del panel trabajo no hace nada (no duplica el handler de datos)
    other.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(hits).toEqual(['trabajo']);
  });
});

describe('Pegar en la rejilla: detección de encabezados', () => {
  test('_celdaTieneLetras reconoce encabezados con prefijo numérico', () => {
    const { sandbox } = loadTrabajoHarness();
    const tieneLetras = (v) => vm.runInContext(
      `_celdaTieneLetras(${JSON.stringify(v)})`, sandbox
    );
    ['1er Lote', '2ª prueba', '3M', '2024-Q1', '5 mg', 'Lote 1', 'A']
      .forEach((v) => expect(tieneLetras(v), v).toBe(true));
    ['123', '1,5', '2024-01', '-2.5', '', null]
      .forEach((v) => expect(tieneLetras(v), String(v)).toBe(false));
  });

  test('al pegar en A1 los encabezados con número inicial ya no se insertan como datos', () => {
    const { sandbox } = loadTrabajoHarness();
    vm.runInContext(`
      var __sheet = { headers: ['Col1', 'Col2', 'Col3'], rows: [], locked: false };
      getCurrentSheet = function () { return __sheet; };
      pushUndo = function () {};
      loadPage = function () {};
    `, sandbox);
    const paste = (text) => {
      vm.runInContext('__pasteText = ' + JSON.stringify(text), sandbox);
      vm.runInContext(`
        handleCellPaste({
          preventDefault: function () {},
          stopPropagation: function () {},
          clipboardData: { getData: function () { return __pasteText; } }
        }, 0, 0);
      `, sandbox);
    };

    paste('1er Lote\t2ª Prueba\t3M\n1\t2\t3');
    expect(vm.runInContext('__sheet.headers', sandbox)).toEqual(['1er Lote', '2ª Prueba', '3M']);
    expect(vm.runInContext('JSON.stringify(__sheet.rows[0])', sandbox)).toBe('["1","2","3"]');
  });

  test('una primera fila numérica sigue siendo dato (sin encabezados falsos)', () => {
    const { sandbox } = loadTrabajoHarness();
    vm.runInContext(`
      var __sheet = { headers: ['A', 'B', 'C'], rows: [], locked: false };
      getCurrentSheet = function () { return __sheet; };
      pushUndo = function () {};
      loadPage = function () {};
    `, sandbox);
    vm.runInContext(`
      __pasteText = '1.5\\t2.3\\t3.4';
      handleCellPaste({
        preventDefault: function () {},
        stopPropagation: function () {},
        clipboardData: { getData: function () { return __pasteText; } }
      }, 0, 0);
    `, sandbox);
    expect(vm.runInContext('JSON.stringify(__sheet.headers)', sandbox)).toBe('["A","B","C"]');
    expect(vm.runInContext('JSON.stringify(__sheet.rows[0])', sandbox)).toBe('["1.5","2.3","3.4"]');
  });
});
