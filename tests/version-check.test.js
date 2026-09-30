// Aviso de nueva versión sin Ctrl+Shift+R (toast + Recargar).
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { describe, test, expect, vi } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');
const SRC = readFileSync(join(core, 'version-check.js'), 'utf-8');

function loadHarness(versions) {
  let i = 0;
  const appended = [];
  let reloaded = false;
  const listeners = {};
  const toastEl = {
    id: '', style: {}, innerHTML: '',
    appendChild: (c) => { toastEl.btn = c; return c; },
  };
  const btnEl = { type: '', textContent: '', style: {}, onclick: null };
  const sandbox = {
    console,
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({ v: versions[Math.min(i++, versions.length - 1)] }) }),
    setInterval: () => 1,
    clearInterval: () => {},
    document: {
      readyState: 'complete',
      hidden: false,
      addEventListener: (ev, fn) => { listeners[ev] = fn; },
      getElementById: () => null,
      createElement: (tag) => (tag === 'button' ? btnEl : toastEl),
      body: { appendChild: (c) => { appended.push(c); return c; } },
    },
  };
  sandbox.globalThis = sandbox;
  sandbox.window = { location: { reload: () => { reloaded = true; } } };
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox);
  const VC = vm.runInContext('VersionCheck', sandbox);
  return { VC, appended, btnEl, getReloaded: () => reloaded };
}

describe('version-check', () => {
  test('sin cambio no hay toast; con cambio aparece y Recargar recarga', async () => {
    const h = loadHarness(['aaa', 'aaa', 'bbb']);
    expect(h.VC.start()).toBe(true);
    await h.VC._tick();
    expect(h.VC._base()).toBe('aaa');
    expect(h.appended).toHaveLength(0);
    await h.VC._tick();
    expect(h.appended).toHaveLength(1);
    expect(h.appended[0].innerHTML).toContain('Nueva versión');
    h.btnEl.onclick();
    expect(h.getReloaded()).toBe(true);
    // no duplica el aviso
    await h.VC._tick();
    expect(h.appended).toHaveLength(1);
  });

  test('fetch caído no rompe nada', async () => {
    const h = loadHarness(['aaa']);
    h.VC._base('aaa');
    await h.VC._tick();
    expect(h.appended).toHaveLength(0);
  });

  test('version.json existe y tiene forma válida', () => {
    const j = JSON.parse(readFileSync(join(__dirname, '..', 'version.json'), 'utf-8'));
    expect(j.v).toMatch(/^[0-9a-f]{7,40}$/);
    expect(j.t).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
