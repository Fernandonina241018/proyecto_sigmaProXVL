// Selector de área post-login (Estadística | Validaciones).
// Suite en node sin DOM: stubs mínimos para cargar area-select.js.
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

const memStore = new Map();
const dispatched = [];
let overlayEl = null;

function resetStubs() {
  memStore.clear();
  dispatched.length = 0;
  overlayEl = null;
  globalThis.sessionStorage = {
    getItem: (k) => (memStore.has(String(k)) ? memStore.get(String(k)) : null),
    setItem: (k, v) => { memStore.set(String(k), String(v)); },
    removeItem: (k) => { memStore.delete(String(k)); },
    clear: () => { memStore.clear(); },
  };
  globalThis.window = globalThis;
  globalThis.CustomEvent = function (type, opts) { this.type = type; this.detail = (opts && opts.detail) || {}; };
  globalThis.dispatchEvent = (e) => { dispatched.push(e); return true; };
  globalThis.addEventListener = () => {};
  globalThis.document = {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => { overlayEl = fakeEl(); return overlayEl; },
    body: fakeEl(),
    readyState: 'complete',
  };
}

resetStubs();
vm.runInThisContext(readFileSync(join(core, 'area-select.js'), 'utf-8'));

describe('AreaSelect', () => {
  beforeEach(() => {
    resetStubs();
  });

  test('sin área guardada devuelve null', () => {
    expect(AreaSelect.getArea()).toBe(null);
  });

  test('setArea válido persiste y emite evento', () => {
    expect(AreaSelect.setArea('validaciones')).toBe(true);
    expect(AreaSelect.getArea()).toBe('validaciones');
    expect(dispatched.length).toBe(1);
    expect(dispatched[0].detail.area).toBe('validaciones');
  });

  test('setArea inválido se rechaza sin emitir', () => {
    expect(AreaSelect.setArea('otro')).toBe(false);
    expect(AreaSelect.getArea()).toBe(null);
    expect(dispatched.length).toBe(0);
  });

  test('clearArea limpia', () => {
    AreaSelect.setArea('estadistica');
    AreaSelect.clearArea();
    expect(AreaSelect.getArea()).toBe(null);
  });

  test('ensureArea con área guardada no muestra modal y llama next', () => {
    AreaSelect.setArea('estadistica');
    dispatched.length = 0;
    let picked = null;
    AreaSelect.ensureArea((a) => { picked = a; });
    expect(picked).toBe('estadistica');
    expect(overlayEl).toBe(null);
  });

  test('ensureArea sin área muestra modal', () => {
    let picked = 'no-llamado';
    AreaSelect.ensureArea((a) => { picked = a; });
    expect(overlayEl).not.toBe(null);
    expect(picked).toBe('no-llamado');
  });

  test('no-admin con validaciones guardada cae a estadistica', () => {
    AreaSelect.setArea('validaciones');
    let picked = null;
    AreaSelect.ensureArea((a) => { picked = a; }, { role: 'user' });
    expect(picked).toBe('estadistica');
    expect(AreaSelect.getArea()).toBe('estadistica');
  });

  test('admin conserva validaciones', () => {
    AreaSelect.setArea('validaciones');
    let picked = null;
    AreaSelect.ensureArea((a) => { picked = a; }, { role: 'admin' });
    expect(picked).toBe('validaciones');
  });

  test('modal marca validaciones bloqueada para no-admin', () => {
    AreaSelect.ensureArea(() => {}, { role: 'user' });
    expect(overlayEl.innerHTML).toMatch('Próximamente');
    expect(overlayEl.innerHTML).toMatch('disabled');
  });

  test('modal sin bloqueo para admin', () => {
    AreaSelect.ensureArea(() => {}, { role: 'admin' });
    expect(overlayEl.innerHTML).not.toMatch('Próximamente');
  });

  test('showModal sin document falla seguro', () => {
    const keep = globalThis.document;
    delete globalThis.document;
    expect(AreaSelect.showModal(() => {})).toBe(false);
    globalThis.document = keep;
  });
});
