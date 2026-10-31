import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const code = readFileSync(join(__dirname, '..', 'js', 'managers', 'AuditoriaManager.js'), 'utf8');

const LOGS_PAGE_0 = [
  {
    id: 1, username: 'ana', action: 'DATASET:LOAD', module: 'DATOS', success: 1,
    duration_ms: 12, ip: '1.2.3.4', user_agent: 'ua', timestamp: '2026-10-30T10:00:00Z',
    details: JSON.stringify({ rows: 10, deviceFingerprint: 'abcd1234efgh' })
  },
  {
    id: 2, username: 'beto', action: 'LOGIN_FAILED', module: 'LOGIN', success: 0,
    duration_ms: null, ip: '', user_agent: '', timestamp: '2026-10-30T09:00:00Z', details: null
  }
];
const LOGS_PAGE_1 = [
  { id: 51, username: 'carla', action: 'CHART:CREATE', module: 'GRAFICOS', success: 1, duration_ms: 40, ip: '5.6.7.8', user_agent: 'ua', timestamp: '2026-10-30T08:00:00Z', details: '{"chartType":"barras"}' },
  { id: 52, username: 'dora', action: 'REPORT:GENERATE', module: 'REPORTES', success: 1, duration_ms: 300, ip: '5.6.7.8', user_agent: 'ua', timestamp: '2026-10-30T07:00:00Z', details: null }
];

function loadHarness() {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML = '<div id="auditoria-container"></div>';

  const urls = [];
  const toasts = [];
  let blobs = [];

  const sandbox = {
    console,
    window,
    document,
    URLSearchParams,
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL: () => {} },
    Blob: class { constructor(parts) { this.parts = parts; blobs.push(parts.join('')); } },
    setTimeout,
    clearTimeout,
    fetchWithTimeout: async (url) => {
      urls.push(String(url));
      const u = new URL(String(url));
      if (u.pathname.endsWith('/api/audit/stats')) {
        return {
          ok: true,
          json: async () => ({
            ok: true, total: 120, today: 5, week: 30, failures: 2,
            byModule: [{ module: 'DATOS', n: 10 }],
            byDay: [{ date: '2026-10-30', n: 7 }]
          })
        };
      }
      if (u.pathname.endsWith('/api/audit/verify')) {
        return { ok: true, json: async () => ({ ok: true, valid: true, checked: 9 }) };
      }
      const off = parseInt(u.searchParams.get('offset') || '0', 10);
      return {
        ok: true,
        json: async () => ({
          ok: true,
          logs: off === 0 ? LOGS_PAGE_0 : LOGS_PAGE_1,
          total: 120,
          limit: parseInt(u.searchParams.get('limit') || '50', 10),
          offset: off
        })
      };
    },
    Auth: {
      getToken: () => 'tok',
      getSession: () => ({ username: 'root', role: 'admin' })
    },
    t: (k) => k,
    escapeHtml: (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    fmtDate: (ts) => String(ts || ''),
    showToast: (m) => toasts.push(String(m)),
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'AuditoriaManager.js' });
  const mgr = vm.runInContext('AuditoriaManager', sandbox);
  mgr.init('http://api.test');
  return { sandbox, document, urls, toasts, mgr, blobs: () => blobs };
}

const tick = () => new Promise((r) => setTimeout(r, 20));

let h;
beforeEach(() => { h = loadHarness(); });

describe('Auditoría · UI con filtros y paginación en servidor', () => {
  it('muestra módulos canónicos, KPIs reales y paginación', async () => {
    h.mgr.buildView();
    await tick();
    const opts = [...h.document.querySelectorAll('#aud-filter-module option')].map((o) => o.value);
    expect(opts).toContain('GRAFICOS');
    expect(opts).toContain('FIRMAS');
    expect(h.document.getElementById('aud-filter-action')).toBeTruthy();

    const kpi = h.document.getElementById('aud-kpis').textContent;
    expect(kpi).toContain('120'); // total
    expect(kpi).toContain('Hoy');
    expect(kpi).toContain('Últimos 7 días');

    const info = h.document.getElementById('aud-results-info').textContent;
    expect(info).toBe('Mostrando 1–2 de 120 registros');
    expect(h.document.getElementById('aud-page-next')).toBeTruthy();
    expect(h.document.querySelector('.aud-page-info').textContent).toBe('Página 1 de 3');
  });

  it('muestra duración y dispositivo (truncado)', async () => {
    h.mgr.buildView();
    await tick();
    const text = h.document.querySelector('.aud-table').textContent;
    expect(text).toContain('12 ms');
    expect(text).toContain('abcd1234efgh'); // 12 chars
    expect(text).toContain('DATASET:LOAD');
  });

  it('el filtro se aplica en el servidor (query params)', async () => {
    h.mgr.buildView();
    await tick();
    h.document.getElementById('aud-filter-module').value = 'DATOS';
    h.document.getElementById('aud-filter-action').value = 'LOAD';
    h.document.getElementById('aud-filter-user').value = 'ana';
    h.document.getElementById('aud-btn-filter').click();
    await tick();
    await tick();
    const last = h.urls.filter((u) => u.includes('/api/audit?')).pop();
    expect(last).toContain('module=DATOS');
    expect(last).toContain('action=LOAD');
    expect(last).toContain('username=ana');
    expect(last).toContain('offset=0');
  });

  it('la paginación pide el offset siguiente y muestra el rango correcto', async () => {
    h.mgr.buildView();
    await tick();
    h.document.getElementById('aud-page-next').click();
    await tick();
    await tick();
    const last = h.urls.filter((u) => u.includes('/api/audit?')).pop();
    expect(last).toContain('offset=50');
    expect(h.document.getElementById('aud-results-info').textContent).toBe('Mostrando 51–52 de 120 registros');
  });

  it('limpiar vuelve a la primera página sin filtros', async () => {
    h.mgr.buildView();
    await tick();
    h.document.getElementById('aud-filter-module').value = 'DATOS';
    h.document.getElementById('aud-btn-filter').click();
    await tick();
    h.document.getElementById('aud-btn-reset').click();
    await tick();
    await tick();
    const last = h.urls.filter((u) => u.includes('/api/audit?')).pop();
    expect(last).not.toContain('module=DATOS');
    expect(last).toContain('offset=0');
  });

  it('exporta el filtro aplicado (no solo la página)', async () => {
    h.mgr.buildView();
    await tick();
    h.document.getElementById('aud-btn-export').click();
    await tick();
    await tick();
    const csv = h.blobs()[0] || '';
    expect(csv).toContain('Módulo');
    expect(csv).toContain('DATOS');
    expect(csv).toContain('12');
    expect(h.toasts.some((m) => m.includes('exportados'))).toBe(true);
  });

  it('detalle genérico: pinta claves desconocidas como pares clave/valor', async () => {
    h.mgr.buildView();
    await tick();
    const detail = h.document.querySelector('.aud-td-details').textContent;
    expect(detail).toContain('rows');
    expect(detail).toContain('10');
    expect(detail).toContain('deviceFingerprint');
  });
});
