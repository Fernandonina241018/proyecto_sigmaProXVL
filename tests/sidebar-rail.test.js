// Modo rail del sidebar (Ctrl+B): iconos + badges con sidebar colapsado.
// La suite corre en node sin DOM: stubs mínimos para cargar indexx-ui.js.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function fakeEl() {
  const cls = new Set();
  return {
    classList: {
      add: (...a) => a.forEach((x) => cls.add(x)),
      remove: (...a) => a.forEach((x) => cls.delete(x)),
      toggle: (x, force) => {
        if (force === true) { cls.add(x); return true; }
        if (force === false) { cls.delete(x); return false; }
        if (cls.has(x)) { cls.delete(x); return false; }
        cls.add(x); return true;
      },
      contains: (x) => cls.has(x),
    },
    style: {},
    dataset: {},
    textContent: '',
    innerHTML: '',
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: (c) => c,
    _cls: cls,
  };
}

const sidebarFake = fakeEl();
const searchInputFake = fakeEl();
searchInputFake.focused = false;
searchInputFake.focus = function() { searchInputFake.focused = true; };
const els = {
  paneResizer: fakeEl(),
  paneLeft: fakeEl(),
  panesContainer: fakeEl(),
  sidebarToggle: fakeEl(),
  ribbonPopupBtn: fakeEl(),
  sidebarUser: fakeEl(),
  sidebarUserDropdown: fakeEl(),
  tabNew: fakeEl(),
  sidebar: sidebarFake,
  sidebarSearch: searchInputFake,
};
let railTipEl = null;
const memStore = new Map();
globalThis.localStorage = {
  getItem: (k) => (memStore.has(String(k)) ? memStore.get(String(k)) : null),
  setItem: (k, v) => { memStore.set(String(k), String(v)); },
  removeItem: (k) => { memStore.delete(String(k)); },
  clear: () => { memStore.clear(); },
};
globalThis.window = { innerWidth: 1024, addEventListener: () => {} };
globalThis.document = {
  getElementById: (id) => (id === 'railTip' ? railTipEl : els[id] || null),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: () => { railTipEl = fakeEl(); return railTipEl; },
  body: fakeEl(),
};
globalThis.escapeHtml = (s) => String(s == null ? '' : s);

vm.runInThisContext('var currentPage = "datos";');
vm.runInThisContext(readFileSync(join(core, 'indexx-ui.js'), 'utf-8'));

const toggleSidebar = globalThis.toggleSidebar;
const updateRailTip = globalThis.updateRailTip;
const hideRailTip = globalThis.hideRailTip;
const expandSidebarFromRailSearch = globalThis.expandSidebarFromRailSearch;

function fakeCard() {
  return {
    querySelector: (sel) => {
      if (sel === '.snav-tx b') return { textContent: 'Firmar Reporte' };
      if (sel === '.snav-tx span') return { textContent: 'Elabora, revisa y aprueba' };
      return null;
    },
    getBoundingClientRect: () => ({ right: 60, top: 100, height: 40 }),
  };
}

describe('sidebar rail (Ctrl+B)', () => {
  test('boot en desktop abre colapsado en rail', () => {
    expect(sidebarFake.classList.contains('rail')).toBe(true);
  });
  test('toggleSidebar alterna rail en desktop', () => {
    expect(sidebarFake.classList.contains('rail')).toBe(true);
    toggleSidebar();
    expect(sidebarFake.classList.contains('rail')).toBe(false);
    toggleSidebar();
    expect(sidebarFake.classList.contains('rail')).toBe(true);
  });
  test('en móvil alterna open sin tocar rail', () => {
    globalThis.window.innerWidth = 500;
    const hadRail = sidebarFake.classList.contains('rail');
    toggleSidebar();
    expect(sidebarFake.classList.contains('open')).toBe(true);
    expect(sidebarFake.classList.contains('rail')).toBe(hadRail);
    toggleSidebar();
    expect(sidebarFake.classList.contains('open')).toBe(false);
    globalThis.window.innerWidth = 1024;
  });
  test('updateRailTip muestra título+descripción en rail desktop', () => {
    if (!sidebarFake.classList.contains('rail')) toggleSidebar();
    globalThis.window.innerWidth = 1024;
    updateRailTip(fakeCard());
    expect(railTipEl).not.toBe(null);
    expect(railTipEl.style.display).toBe('block');
    expect(railTipEl.innerHTML).toContain('Firmar Reporte');
    expect(railTipEl.style.left).toBe('70px');
  });
  test('updateRailTip se oculta sin rail, sin card o en móvil', () => {
    updateRailTip(null);
    expect(railTipEl.style.display).toBe('none');
    toggleSidebar(); // quita rail
    updateRailTip(fakeCard());
    expect(railTipEl.style.display).toBe('none');
    toggleSidebar(); // restaura rail
    globalThis.window.innerWidth = 500;
    updateRailTip(fakeCard());
    expect(railTipEl.style.display).toBe('none');
    globalThis.window.innerWidth = 1024;
  });
  test('hideRailTip oculta', () => {
    updateRailTip(fakeCard());
    expect(railTipEl.style.display).toBe('block');
    hideRailTip();
    expect(railTipEl.style.display).toBe('none');
  });
});

describe('lupa en rail expande y enfoca', () => {
  const boxEvt = { target: { closest: (sel) => (sel === '.search-box' ? {} : null) } };
  const noBoxEvt = { target: { closest: () => null } };
  test('click en lupa con rail expande y enfoca búsqueda', async () => {
    if (!sidebarFake.classList.contains('rail')) toggleSidebar();
    searchInputFake.focused = false;
    expect(expandSidebarFromRailSearch(boxEvt)).toBe(true);
    expect(sidebarFake.classList.contains('rail')).toBe(false);
    await new Promise((r) => setTimeout(r, 300));
    expect(searchInputFake.focused).toBe(true);
    toggleSidebar(); // restaura rail
  });
  test('sin rail o fuera de la caja no hace nada', () => {
    if (!sidebarFake.classList.contains('rail')) toggleSidebar();
    expect(expandSidebarFromRailSearch(noBoxEvt)).toBe(false);
    expect(sidebarFake.classList.contains('rail')).toBe(true);
    toggleSidebar(); // expande
    expect(expandSidebarFromRailSearch(boxEvt)).toBe(false);
    expect(sidebarFake.classList.contains('rail')).toBe(false);
    toggleSidebar(); // restaura rail
  });
});
