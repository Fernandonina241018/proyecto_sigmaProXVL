import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const code = readFileSync(join(__dirname, '..', 'js', 'core', 'Logger.js'), 'utf8');

// Harness: DOM + fetch stub + timers controlados (evita fugas entre tests).
function loadLogger(opts = {}) {
  const window = new Window();
  const document = window.document;
  const calls = [];
  const timers = [];
  let failNext = !!opts.failNext;
  const token = opts.token === undefined ? 'tok-123' : opts.token;

  const sandbox = {
    console,
    window,
    document,
    crypto: { randomUUID: () => 'sess-test' },
    performance: { now: () => Date.now() },
    setTimeout: (fn) => { timers.push(fn); return timers.length; },
    clearTimeout: () => {},
    fetch: async (url, options) => {
      calls.push({ url: String(url), options });
      if (failNext) { failNext = false; throw new Error('network'); }
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    },
    Auth: { getToken: () => token },
    API_URL: 'http://api.test',
    CFG: { API_URL: 'http://api.test' },
    fetchWithTimeout: async () => ({ ok: true }),
    currentPage: 'trabajo',
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'Logger.js' });

  return { sandbox, window, calls, timers, Logger: vm.runInContext('Logger', sandbox) };
}

const tick = () => new Promise((r) => setTimeout(r, 0));
let h;
beforeEach(() => { h = loadLogger(); });

describe('Logger v2 · cola y lotes', () => {
  it('log() encola sin bloquear y no envía de inmediato', () => {
    h.Logger.log('TEST:ONE', 'SYSTEM', { a: 1 });
    expect(h.Logger._pending()).toBe(1);
    expect(h.calls.length).toBe(0);
  });

  it('con 20 eventos descarga un lote a /api/audit/events', async () => {
    for (let i = 0; i < 20; i++) h.Logger.log('TEST:BATCH', 'SYSTEM', { i });
    await tick();
    expect(h.calls.length).toBe(1);
    expect(h.calls[0].url).toBe('http://api.test/api/audit/events');
    const body = JSON.parse(h.calls[0].options.body);
    expect(body.events.length).toBe(20);
    expect(body.events[0].action).toBe('TEST:BATCH');
    expect(body.events[0].details.origin).toBe('client');
    expect(h.Logger._pending()).toBe(0);
  });

  it('flush() vacía lo pendiente en lotes de 50', async () => {
    for (let i = 0; i < 12; i++) h.Logger.log('TEST:FLUSH', 'SYSTEM', { i });
    await h.Logger.flush();
    await tick();
    expect(h.calls.length).toBe(1);
    expect(JSON.parse(h.calls[0].options.body).events.length).toBe(12);
    expect(h.Logger._pending()).toBe(0);
  });

  it('sin token no envía y conserva la cola', async () => {
    const s = loadLogger({ token: null });
    s.Logger.log('TEST:NOAUTH', 'SYSTEM', {});
    await s.Logger.flush();
    await tick();
    expect(s.calls.length).toBe(0);
    expect(s.Logger._pending()).toBe(1);
  });

  it('si el envío falla, reencola para reintentar', async () => {
    const s = loadLogger({ failNext: true });
    for (let i = 0; i < 5; i++) s.Logger.log('TEST:FAIL', 'SYSTEM', { i });
    await s.Logger.flush();
    await tick();
    expect(s.calls.length).toBe(1);
    expect(s.Logger._pending()).toBe(5);
  });
});

describe('Logger v2 · datos y utilidades', () => {
  it('sanitiza credenciales y añade contexto', async () => {
    h.Logger.log('TEST:SEC', 'DATOS', { password: 'x', token: 'y', rows: 3, hash: 'z' });
    await h.Logger.flush();
    const ev = JSON.parse(h.calls[0].options.body).events[0];
    expect(ev.details.password).toBeUndefined();
    expect(ev.details.token).toBeUndefined();
    expect(ev.details.hash).toBeUndefined();
    expect(ev.details.rows).toBe(3);
    expect(ev.details.sessionId).toBe('sess-test');
    expect(ev.details.page).toBe('trabajo');
  });

  it('track() mide duración y registra éxito o error', async () => {
    await h.Logger.track('TEST:OK', 'ANALISIS', async () => 42, { test: 't' });
    await h.Logger.flush();
    let ev = JSON.parse(h.calls[0].options.body).events[0];
    expect(ev.success).toBe(true);
    expect(typeof ev.durationMs).toBe('number');

    await expect(h.Logger.track('TEST:KO', 'ANALISIS', async () => { throw new Error('boom'); }, {})).rejects.toThrow('boom');
    await h.Logger.flush();
    ev = JSON.parse(h.calls[1].options.body).events[0];
    expect(ev.success).toBe(false);
    expect(ev.details.error).toBe('boom');
  });

  it('logError y logReportGenerate conservan la API histórica', async () => {
    h.Logger.logError('UNCAUGHT', 'fallo');
    h.Logger.logReportGenerate('pdf', true);
    await h.Logger.flush();
    const evs = JSON.parse(h.calls[0].options.body).events;
    expect(evs[0].action).toBe('ERROR:UNCAUGHT');
    expect(evs[0].module).toBe('SYSTEM');
    expect(evs[1].action).toBe('REPORT:PDF');
    expect(evs[1].details.hasGraphics).toBe(true);
  });

  it('al ocultar/cerrar la pestaña vacía con keepalive', async () => {
    h.Logger.log('TEST:EXIT', 'SYSTEM', {});
    h.window.dispatchEvent(new h.window.Event('pagehide'));
    await tick();
    expect(h.calls.length).toBe(1);
    expect(h.calls[0].options.keepalive).toBe(true);
  });
});
