// PDF en servidor — frontend. Vigila que la descarga:
//   1) use el servidor primero y descargue el PDF que devuelve,
//   2) caiga al generador local ante CUALQUIER fallo (nunca rompe la descarga),
//   3) el generador local no ejecute scripts del reporte (MF-1).
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const firma = readFileSync(join(root, 'js', 'core', 'indexx-firma.js'), 'utf-8');
const rm = readFileSync(join(root, 'js', 'managers', 'ReporteManager.js'), 'utf-8');
const utils = readFileSync(join(root, 'js', 'core', 'utils.js'), 'utf-8');

function pdfResponse() {
  return {
    ok: true, status: 200,
    headers: { get: (k) => (String(k).toLowerCase() === 'content-type' ? 'application/pdf' : null) },
    blob: async () => new Blob(['%PDF-1.7 fake'], { type: 'application/pdf' }),
  };
}

describe('__generarPDFServidor', () => {
  let origFetch, origAuth, origCreate, origRevoke;
  beforeEach(() => {
    origFetch = globalThis.fetch;
    origAuth = globalThis.Auth;
    origCreate = URL.createObjectURL; origRevoke = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn(() => 'blob:fake');
    URL.revokeObjectURL = vi.fn();
    globalThis.Auth = { getToken: () => 'tok123' };
  });
  afterEach(() => {
    globalThis.fetch = origFetch;
    globalThis.Auth = origAuth;
    URL.createObjectURL = origCreate; URL.revokeObjectURL = origRevoke;
  });

  test('existe como helper global', () => {
    expect(typeof window.__generarPDFServidor).toBe('function');
  });

  test('POST /api/pdf/render con Bearer y descarga el PDF', async () => {
    globalThis.fetch = vi.fn(async () => pdfResponse());
    const ok = await window.__generarPDFServidor('<html><body>x</body></html>', 'r.pdf', { sessionId: 7, kind: 'firma' });
    expect(ok).toBe(true);
    const [url, opts] = globalThis.fetch.mock.calls[0];
    expect(url).toMatch(/\/api\/pdf\/render$/);
    expect(opts.method).toBe('POST');
    expect(opts.headers.Authorization).toBe('Bearer tok123');
    const body = JSON.parse(opts.body);
    expect(body.sessionId).toBe(7);
    expect(body.kind).toBe('firma');
    expect(body.filename).toBe('r.pdf');
  });

  test('503 (servidor sin Chromium) → false para usar el generador local', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: false, status: 503, headers: { get: () => 'application/json' } }));
    expect(await window.__generarPDFServidor('<p>x</p>', 'r.pdf')).toBe(false);
  });

  test('error de red → false (no lanza)', async () => {
    globalThis.fetch = vi.fn(async () => { throw new Error('offline'); });
    expect(await window.__generarPDFServidor('<p>x</p>', 'r.pdf')).toBe(false);
  });

  test('respuesta que no es PDF → false', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: true, status: 200, headers: { get: () => 'text/html' }, blob: async () => new Blob(['x']) }));
    expect(await window.__generarPDFServidor('<p>x</p>', 'r.pdf')).toBe(false);
  });

  test('sin sesión (sin token) no llama al servidor', async () => {
    globalThis.Auth = { getToken: () => '' };
    globalThis.fetch = vi.fn();
    expect(await window.__generarPDFServidor('<p>x</p>', 'r.pdf')).toBe(false);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test('HTML vacío no llama al servidor', async () => {
    globalThis.fetch = vi.fn();
    expect(await window.__generarPDFServidor('   ', 'r.pdf')).toBe(false);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

describe('__htmlSinScripts (generador local, MF-1)', () => {
  test('quita scripts, on* y javascript: sin tocar el contenido', () => {
    const out = window.__htmlSinScripts(
      '<html><head><script>alert(1)</script></head><body>' +
      '<div class="sec" onclick="steal()">Sección 1</div>' +
      '<a href="javascript:alert(2)">x</a><img src="data:image/png;base64,AA" onerror="x()">' +
      '<table><tr><td>42.5</td></tr></table></body></html>'
    );
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toMatch(/onclick|onerror/i);
    expect(out).not.toMatch(/javascript:/i);
    expect(out).toContain('Sección 1');
    expect(out).toContain('42.5');
    expect(out).toContain('data:image/png;base64,AA');
    expect(out).toContain('class="sec"');
  });
});

describe('orden de preferencia en los botones de descarga', () => {
  test('firmaDownload: servidor primero, luego html2canvas, luego .html', () => {
    const i = firma.indexOf('async function firmaDownload');
    const body = firma.slice(i, i + 3000);
    const a = body.indexOf('__generarPDFServidor(');
    const b = body.indexOf('__generarPDF(');
    const c = body.indexOf("'.html'");
    expect(a).toBeGreaterThan(-1);
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
    expect(body).toContain("kind: 'firma'");
  });
  test('ReporteManager.generarPDF: servidor primero, luego local', () => {
    const i = rm.indexOf('async function generarPDF');
    const body = rm.slice(i, i + 1200);
    expect(body.indexOf('__generarPDFServidor(')).toBeGreaterThan(-1);
    expect(body.indexOf('__generarPDF(')).toBeGreaterThan(body.indexOf('__generarPDFServidor('));
  });
  test('el iframe del generador local carga HTML saneado', () => {
    const i = utils.indexOf('window.__generarPDF = async function');
    const body = utils.slice(i, i + 2500);
    expect(body).toContain('__htmlSinScripts(html)');
    expect(body).toContain('iframe.srcdoc = safeHtml');
  });
});
