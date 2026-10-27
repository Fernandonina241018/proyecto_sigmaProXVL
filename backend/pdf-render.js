// ── PDF en servidor (Chromium headless) ──────────────────────────────
// Genera el PDF con el MISMO motor que el botón "Imprimir" del navegador:
// respeta @media print, page-break-*, @page (márgenes, "X de N") y deja el
// texto seleccionable (vectorial, no imagen).
//
// Diseño "no romper nada":
//   - puppeteer-core se carga de forma perezosa y OPCIONAL. Si no está
//     instalado o no hay Chromium, isAvailable() = false y el endpoint
//     responde 503 → el frontend cae al generador anterior (html2canvas).
//   - El servidor arranca igual con o sin esta dependencia.
//
// Seguridad (el HTML viene del cliente / de reportes importados):
//   - JavaScript DESACTIVADO en la página: ningún <script> del reporte corre.
//   - Interceptación de red: solo data:, blob:, about: y Google Fonts.
//     Todo lo demás (http internos, metadata de la nube, file://) se aborta
//     → sin SSRF ni lectura de archivos locales.
//   - Concurrencia limitada + cola acotada + timeout duro por render.
'use strict';

const crypto = require('crypto');
const fs = require('fs');

const ALLOWED_URL_PREFIXES = [
    'data:',
    'blob:',
    'about:',
    'https://fonts.googleapis.com/',
    'https://fonts.gstatic.com/',
];

function isAllowedUrl(url) {
    const u = String(url || '').trim().toLowerCase();
    return ALLOWED_URL_PREFIXES.some((p) => u.startsWith(p));
}

function sha256Hex(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

function _err(code, message) {
    const e = new Error(message || code);
    e.code = code;
    return e;
}

function _defaultLoader() {
    try { return require('puppeteer-core'); } catch (_) { return null; }
}

function createPdfRenderer(opts = {}) {
    const env = opts.env || process.env;
    const loadPuppeteer = opts.loadPuppeteer || _defaultLoader;
    const fileExists = opts.fileExists || ((p) => { try { return fs.existsSync(p); } catch (_) { return false; } });
    const executablePath = opts.executablePath || env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium';
    const maxConcurrent = Math.max(parseInt(opts.maxConcurrent ?? env.PDF_MAX_CONCURRENT) || 2, 1);
    const maxQueue = Math.max(parseInt(opts.maxQueue ?? env.PDF_MAX_QUEUE ?? 6) || 0, 0);
    const timeoutMs = Math.max(parseInt(opts.timeoutMs ?? env.PDF_TIMEOUT_MS) || 30000, 1000);
    const idleCloseMs = Math.max(parseInt(opts.idleCloseMs ?? env.PDF_IDLE_CLOSE_MS) || 300000, 1000);
    const maxHtmlBytes = Math.max(parseInt(opts.maxHtmlBytes) || 5 * 1024 * 1024, 1024);
    const disabledByEnv = String(env.PDF_SERVER || '').trim() === '0';

    let puppeteer;      // undefined = no intentado; null = no disponible
    let browserPromise = null;
    let idleTimer = null;
    let active = 0;
    const queue = [];
    let renders = 0, failures = 0;

    function _puppeteer() {
        if (puppeteer === undefined) puppeteer = loadPuppeteer() || null;
        return puppeteer;
    }

    function isAvailable() {
        if (disabledByEnv) return false;
        if (!_puppeteer()) return false;
        return opts.skipExecutableCheck ? true : fileExists(executablePath);
    }

    function _launch() {
        const p = _puppeteer();
        if (!p) return Promise.reject(_err('unavailable', 'puppeteer-core no instalado'));
        const launched = Promise.resolve(p.launch({
            executablePath,
            headless: true,
            args: [
                '--no-sandbox', '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', '--disable-gpu',
                '--no-first-run', '--disable-extensions',
                '--font-render-hinting=none',
            ],
        })).then((browser) => {
            if (browser && typeof browser.on === 'function') {
                browser.on('disconnected', () => { browserPromise = null; });
            }
            return browser;
        });
        launched.catch(() => { browserPromise = null; });
        return launched;
    }

    function _getBrowser() {
        if (!browserPromise) browserPromise = _launch();
        return browserPromise;
    }

    function _armIdleClose() {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            idleTimer = null;
            if (active === 0) close().catch(() => {});
        }, idleCloseMs);
        if (idleTimer && typeof idleTimer.unref === 'function') idleTimer.unref();
    }

    function _acquire() {
        if (active < maxConcurrent) { active++; return Promise.resolve(); }
        if (queue.length >= maxQueue) return Promise.reject(_err('busy', 'Generador de PDF ocupado'));
        return new Promise((resolve) => queue.push(resolve));
    }

    function _release() {
        const next = queue.shift();
        if (next) next(); else active--;
    }

    async function _renderOnce(html) {
        const browser = await _getBrowser();
        const page = await browser.newPage();
        try {
            await page.setJavaScriptEnabled(false);
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                try {
                    if (isAllowedUrl(req.url())) req.continue();
                    else req.abort('blockedbyclient');
                } catch (_) { /* request ya resuelta */ }
            });
            await page.setContent(html, { waitUntil: ['load', 'networkidle0'], timeout: timeoutMs });
            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true,
                timeout: timeoutMs,
            });
            return Buffer.from(pdf);
        } finally {
            try { await page.close(); } catch (_) { /* ignore */ }
        }
    }

    async function render(html) {
        if (!isAvailable()) throw _err('unavailable', 'PDF en servidor no disponible');
        if (typeof html !== 'string' || !html.trim()) throw _err('bad-input', 'HTML vacío');
        const bytes = Buffer.byteLength(html, 'utf8');
        if (bytes > maxHtmlBytes) throw _err('too-large', 'HTML demasiado grande');

        await _acquire();
        const t0 = Date.now();
        let timer;
        try {
            const timeout = new Promise((_, reject) => {
                timer = setTimeout(() => reject(_err('timeout', 'Tiempo de generación agotado')), timeoutMs + 5000);
            });
            const pdf = await Promise.race([_renderOnce(html), timeout]);
            if (!pdf || pdf.length < 5 || pdf.slice(0, 5).toString('latin1') !== '%PDF-') {
                throw _err('render-failed', 'Salida no es un PDF válido');
            }
            renders++;
            return { pdf, pdfSha256: sha256Hex(pdf), htmlSha256: sha256Hex(Buffer.from(html, 'utf8')), ms: Date.now() - t0, bytes: pdf.length };
        } catch (e) {
            failures++;
            if (!e.code) e.code = 'render-failed';
            // Un fallo de Chromium puede dejar el navegador inservible: se recicla.
            if (e.code === 'timeout' || e.code === 'render-failed') close().catch(() => {});
            throw e;
        } finally {
            clearTimeout(timer);
            _release();
            _armIdleClose();
        }
    }

    async function close() {
        if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
        const bp = browserPromise;
        browserPromise = null;
        if (!bp) return;
        try { const b = await bp; if (b && typeof b.close === 'function') await b.close(); } catch (_) { /* ignore */ }
    }

    function stats() {
        return { available: isAvailable(), active, queued: queue.length, renders, failures, maxConcurrent, maxQueue };
    }

    return { isAvailable, render, close, stats };
}

// Nombre de archivo seguro para Content-Disposition.
function safePdfFilename(name) {
    let n = String(name || 'reporte').replace(/\.pdf$/i, '');
    n = n.replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^[._]+/, '').slice(0, 120) || 'reporte';
    return n + '.pdf';
}

module.exports = { createPdfRenderer, isAllowedUrl, safePdfFilename, sha256Hex, ALLOWED_URL_PREFIXES };
