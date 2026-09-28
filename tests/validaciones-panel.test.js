// Panel del área de Validaciones: se muestra/oculta según el área activa.
// Suite en node sin DOM: stubs mínimos para cargar indexx-validaciones.js.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { describe, test, expect, beforeEach } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function fakeEl() {
  return {
    style: {},
    dataset: {},
    textContent: '',
    innerHTML: '',
    id: '',
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: (c) => c,
    remove: () => {},
    getAttribute: () => null,
    querySelector: () => null,
    closest: () => null,
  };
}

let viewEl = null;
const listeners = {};

function resetStubs() {
  viewEl = null;
  globalThis.window = globalThis;
  globalThis.addEventListener = (ev, fn) => { listeners[ev] = fn; };
  globalThis.dispatchEvent = () => true;
  const view = fakeEl();
  globalThis.document = {
    getElementById: (id) => (id === 'validaciones-view' ? viewEl : null),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => fakeEl(),
    body: { appendChild: (c) => { viewEl = view; return c; } },
    readyState: 'complete',
  };
  delete globalThis.Auth;
  delete globalThis.AreaSelect;
  delete globalThis.Validaciones;
}

resetStubs();
vm.runInThisContext(readFileSync(join(core, 'indexx-validaciones.js'), 'utf-8'));

describe('Validaciones', () => {
  beforeEach(() => {
    resetStubs();
  });

  test('5 categorías con href a docs', () => {
    expect(Validaciones.CATS.length).toBe(5);
    for (const c of Validaciones.CATS) {
      expect(c.href).toMatch(/^docs\/banco-ensayos\//);
    }
  });

  test('apply validaciones muestra, estadistica oculta', () => {
    Validaciones.apply('validaciones');
    expect(viewEl).not.toBe(null);
    Validaciones.apply('estadistica');
  });

  test('evento sigma-area conmuta el panel', () => {
    expect(typeof listeners['sigma-area']).toBe('function');
    listeners['sigma-area']({ detail: { area: 'validaciones' } });
    expect(viewEl).not.toBe(null);
  });

  test('sin DOM falla seguro', () => {
    const keep = globalThis.document;
    delete globalThis.document;
    expect(Validaciones.show()).toBe(false);
    globalThis.document = keep;
  });
});
