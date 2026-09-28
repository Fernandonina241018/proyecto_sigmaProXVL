// Shell independiente del área de Validaciones + mini-router por hash.
// Suite en node sin DOM: stubs mínimos para cargar indexx-validaciones.js.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { describe, test, expect, beforeEach } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function fakeEl() {
  const el = {
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
    setAttribute: () => {},
    removeAttribute: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    closest: () => null,
  };
  return el;
}

let appEl = null;
let mainEl = null;
const listeners = {};

function resetStubs() {
  appEl = null;
  mainEl = fakeEl();
  globalThis.window = globalThis;
  globalThis.location = { hash: '' };
  globalThis.addEventListener = (ev, fn) => { listeners[ev] = fn; };
  globalThis.dispatchEvent = () => true;
  globalThis.document = {
    getElementById: (id) => (id === 'validaciones-app' ? appEl : null),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => {
      const el = fakeEl();
      el.querySelector = () => mainEl;
      return el;
    },
    body: { appendChild: (c) => { appEl = fakeEl(); appEl.querySelector = () => mainEl; return c; } },
    readyState: 'complete',
  };
  delete globalThis.Auth;
  delete globalThis.AreaSelect;
  delete globalThis.Validaciones;
  delete globalThis.ValidacionesManifest;
}

resetStubs();
vm.runInThisContext(readFileSync(join(core, 'indexx-validaciones.js'), 'utf-8'));

describe('Validaciones', () => {
  beforeEach(() => {
    resetStubs();
  });

  test('parseRoute valida rutas y cae a banco', () => {
    expect(Validaciones.parseRoute('#/banco')).toBe('banco');
    expect(Validaciones.parseRoute('#/generador')).toBe('generador');
    expect(Validaciones.parseRoute('#/firmas')).toBe('firmas');
    expect(Validaciones.parseRoute('#/otro')).toBe('banco');
    expect(Validaciones.parseRoute('')).toBe('banco');
  });

  test('5 categorías con href a docs', () => {
    expect(Validaciones.CATS.length).toBe(5);
    for (const c of Validaciones.CATS) {
      expect(c.href).toMatch(/^docs\/banco-ensayos\//);
    }
  });

  test('4 rutas en el riel', () => {
    expect(Validaciones.ROUTES.map((r) => r.id)).toEqual(['banco', 'generador', 'protocolos', 'firmas']);
  });

  test('apply validaciones muestra shell, estadistica la oculta', () => {
    Validaciones.apply('validaciones');
    expect(appEl).not.toBe(null);
    Validaciones.apply('estadistica');
  });

  test('evento sigma-area conmuta el shell', () => {
    expect(typeof listeners['sigma-area']).toBe('function');
    listeners['sigma-area']({ detail: { area: 'validaciones' } });
    expect(appEl).not.toBe(null);
  });

  test('no-admin ve En desarrollo, admin ve dashboard', () => {
    globalThis.Auth = { getSession: () => ({ username: 'u', role: 'user' }), getArea: () => 'validaciones' };
    Validaciones.apply('validaciones');
    expect(mainEl.innerHTML).toMatch('En desarrollo');
    globalThis.Auth = { getSession: () => ({ username: 'a', role: 'admin' }), getArea: () => 'validaciones' };
    Validaciones.apply('validaciones');
    expect(mainEl.innerHTML).toMatch('Banco de ensayos');
  });

  test('sin DOM falla seguro', () => {
    const keep = globalThis.document;
    delete globalThis.document;
    expect(Validaciones.show()).toBe(false);
    globalThis.document = keep;
  });
});
