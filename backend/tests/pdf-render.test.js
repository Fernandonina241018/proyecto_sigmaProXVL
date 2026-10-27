// PDF en servidor — tests con un puppeteer FALSO (sin Chromium real).
// node --test tests/pdf-render.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createPdfRenderer, isAllowedUrl, safePdfFilename, sha256Hex } = require('../pdf-render');

const FAKE_PDF = Buffer.from('%PDF-1.7\n%fake\n%%EOF');

function fakePuppeteer(behavior = {}) {
  const log = { launches: 0, pages: [], closedBrowsers: 0, launchArgs: null };
  const p = {
    log,
    launch: async (args) => {
      log.launches++;
      log.launchArgs = args;
      const handlers = {};
      const browser = {
        on: (ev, fn) => { handlers[ev] = fn; },
        _disconnect: () => handlers.disconnected && handlers.disconnected(),
        close: async () => { log.closedBrowsers++; },
        newPage: async () => {
          const page = {
            js: null, intercept: null, reqHandler: null, closed: false, content: null,
            setJavaScriptEnabled: async (v) => { page.js = v; },
            setRequestInterception: async (v) => { page.intercept = v; },
            on: (ev, fn) => { if (ev === 'request') page.reqHandler = fn; },
            setContent: async (html) => {
              page.content = html;
              if (behavior.hang) await new Promise(() => {});
              if (behavior.delayMs) await new Promise((r) => setTimeout(r, behavior.delayMs));
            },
            pdf: async () => {
              if (behavior.pdfThrows) throw new Error('chromium crash');
              return behavior.notPdf ? Buffer.from('<html>') : FAKE_PDF;
            },
            close: async () => { page.closed = true; },
          };
          log.pages.push(page);
          return page;
        },
      };
      log.browsers = (log.browsers || []).concat(browser);
      return browser;
    },
  };
  return p;
}

function make(behavior, extra = {}) {
  const pp = fakePuppeteer(behavior);
  const r = createPdfRenderer(Object.assign({ env: {}, loadPuppeteer: () => pp, skipExecutableCheck: true, idleCloseMs: 60000 }, extra));
  return { r, pp };
}

test('isAllowedUrl: solo data/blob/about y Google Fonts', () => {
  assert.equal(isAllowedUrl('data:image/png;base64,AAA'), true);
  assert.equal(isAllowedUrl('blob:https://x/1'), true);
  assert.equal(isAllowedUrl('about:blank'), true);
  assert.equal(isAllowedUrl('https://fonts.googleapis.com/css2?family=X'), true);
  assert.equal(isAllowedUrl('https://fonts.gstatic.com/s/x.woff2'), true);
  assert.equal(isAllowedUrl('http://169.254.169.254/latest/meta-data'), false);
  assert.equal(isAllowedUrl('file:///etc/passwd'), false);
  assert.equal(isAllowedUrl('http://localhost:3000/api/users'), false);
  assert.equal(isAllowedUrl('https://fonts.googleapis.com.evil.com/x'), false);
  assert.equal(isAllowedUrl('https://evil.com/?https://fonts.gstatic.com/'), false);
});

test('no disponible si puppeteer-core no está instalado (servidor no se rompe)', async () => {
  const r = createPdfRenderer({ env: {}, loadPuppeteer: () => null, skipExecutableCheck: true });
  assert.equal(r.isAvailable(), false);
  await assert.rejects(() => r.render('<html></html>'), (e) => e.code === 'unavailable');
});

test('no disponible si falta el ejecutable de Chromium', () => {
  const pp = fakePuppeteer();
  const r = createPdfRenderer({ env: {}, loadPuppeteer: () => pp, fileExists: () => false });
  assert.equal(r.isAvailable(), false);
});

test('PDF_SERVER=0 lo apaga (kill switch)', () => {
  const pp = fakePuppeteer();
  const r = createPdfRenderer({ env: { PDF_SERVER: '0' }, loadPuppeteer: () => pp, skipExecutableCheck: true });
  assert.equal(r.isAvailable(), false);
});

test('render: JS desactivado, red interceptada, PDF válido y hashes', async () => {
  const { r, pp } = make();
  const html = '<html><body><script>alert(1)</script>hola</body></html>';
  const out = await r.render(html);
  const page = pp.log.pages[0];
  assert.equal(page.js, false);
  assert.equal(page.intercept, true);
  assert.equal(page.closed, true);
  assert.equal(page.content, html);
  assert.ok(out.pdf.equals(FAKE_PDF));
  assert.equal(out.pdfSha256, sha256Hex(FAKE_PDF));
  assert.equal(out.htmlSha256, sha256Hex(Buffer.from(html, 'utf8')));
  assert.ok(pp.log.launchArgs.args.includes('--no-sandbox'));
  await r.close();
});

test('render: bloquea peticiones no permitidas y deja pasar las permitidas', async () => {
  const { r, pp } = make();
  await r.render('<html></html>');
  const handler = pp.log.pages[0].reqHandler;
  const mkReq = (url) => { const q = { url: () => url, res: null, continue: () => { q.res = 'continue'; }, abort: () => { q.res = 'abort'; } }; return q; };
  const bad = mkReq('http://169.254.169.254/'); handler(bad); assert.equal(bad.res, 'abort');
  const file = mkReq('file:///etc/passwd'); handler(file); assert.equal(file.res, 'abort');
  const ok = mkReq('data:image/png;base64,AA'); handler(ok); assert.equal(ok.res, 'continue');
  await r.close();
});

test('reutiliza el navegador entre renders', async () => {
  const { r, pp } = make();
  await r.render('<p>1</p>');
  await r.render('<p>2</p>');
  assert.equal(pp.log.launches, 1);
  await r.close();
});

test('relanza Chromium si se desconecta', async () => {
  const { r, pp } = make();
  await r.render('<p>1</p>');
  pp.log.browsers[0]._disconnect();
  await r.render('<p>2</p>');
  assert.equal(pp.log.launches, 2);
  await r.close();
});

test('salida que no es PDF → render-failed y página cerrada', async () => {
  const { r, pp } = make({ notPdf: true });
  await assert.rejects(() => r.render('<p>x</p>'), (e) => e.code === 'render-failed');
  assert.equal(pp.log.pages[0].closed, true);
});

test('error de Chromium → render-failed, sin colgar el semáforo', async () => {
  const { r } = make({ pdfThrows: true }, { maxConcurrent: 1, maxQueue: 0 });
  await assert.rejects(() => r.render('<p>x</p>'), (e) => e.code === 'render-failed');
  assert.equal(r.stats().active, 0);
});

test('timeout duro → código timeout', async () => {
  const { r } = make({ hang: true }, { timeoutMs: 1000 });
  // timeoutMs mínimo 1000 + 5000 de margen
  await assert.rejects(() => r.render('<p>x</p>'), (e) => e.code === 'timeout');
  assert.equal(r.stats().active, 0);
});

test('cola llena → busy (no se acumulan renders sin límite)', async () => {
  const { r } = make({ delayMs: 150 }, { maxConcurrent: 1, maxQueue: 1 });
  const a = r.render('<p>a</p>');
  const b = r.render('<p>b</p>');
  await assert.rejects(() => r.render('<p>c</p>'), (e) => e.code === 'busy');
  await a; await b;
  assert.equal(r.stats().active, 0);
  assert.equal(r.stats().queued, 0);
  await r.close();
});

test('HTML vacío o gigante se rechaza', async () => {
  const { r } = make({}, { maxHtmlBytes: 2048 });
  await assert.rejects(() => r.render('   '), (e) => e.code === 'bad-input');
  await assert.rejects(() => r.render('x'.repeat(5000)), (e) => e.code === 'too-large');
});

test('safePdfFilename limpia caracteres peligrosos', () => {
  assert.equal(safePdfFilename('reporte_firmado_2de3_2026-10-27.pdf'), 'reporte_firmado_2de3_2026-10-27.pdf');
  assert.equal(safePdfFilename('../../etc/passwd'), 'etc_passwd.pdf');
  assert.equal(safePdfFilename('a"b\r\nc'), 'a_b_c.pdf');
  assert.equal(safePdfFilename(''), 'reporte.pdf');
});
