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
