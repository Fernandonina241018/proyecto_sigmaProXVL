// ========================================
// Logger.js — StatAnalyzer Pro
// Auditoría de operaciones del frontend (cliente)
//
// Fase 1 (2026-10-30): cola + lote + reintento + keepalive.
// - No bloquea la UI: log() encola y devuelve al instante.
// - Envía lotes de hasta 50 a POST /api/audit/events (hasta 20 por lote
//   se descargan solos; el resto cada 4 s o al cerrar/ocultar la pestaña).
// - Cola acotada (200) para no crecer sin límite si el backend no responde.
// - El servidor impone username/IP; aquí solo se envía la intención.
// ========================================

const Logger = (() => {
    let _apiUrl = '';
    let _enabled = true;

    // ── Cola y lote ────────────────────────────
    const MAX_QUEUE = 200;
    const BATCH_SIZE = 50;
    const FLUSH_MS = 4000;
    let _queue = [];
    let _timer = null;
    let _flushing = false;
    let _dropped = 0;
    let _sessionId = '';

    try {
        _sessionId = (typeof crypto !== 'undefined' && crypto.randomUUID)
            ? crypto.randomUUID()
            : ('s' + Date.now() + Math.random().toString(36).slice(2, 8));
    } catch (_e) { _sessionId = 's' + Date.now(); }

    const MODULES = {
        LOGIN: 'LOGIN',
        DATOS: 'DATOS',
        ANALISIS: 'ANALISIS',
        GRAFICOS: 'GRAFICOS',
        REPORTES: 'REPORTES',
        FIRMAS: 'FIRMAS',
        USERS: 'USERS',
        VALIDACIONES: 'VALIDACIONES',
        ML: 'ML',
        SYSTEM: 'SYSTEM',
    };

    function init(apiUrl) {
        if (apiUrl) _apiUrl = String(apiUrl).replace(/\/+$/, '');
    }

    function setEnabled(enabled) { _enabled = !!enabled; }

    // Resolución perezosa: si la URL llega después (auth/CFG), se usa igual.
    function _resolveApi() {
        if (_apiUrl) return _apiUrl;
        try {
            if (typeof API_URL !== 'undefined' && API_URL) return String(API_URL).replace(/\/+$/, '');
            if (typeof CFG !== 'undefined' && CFG && CFG.API_URL) return String(CFG.API_URL).replace(/\/+$/, '');
        } catch (_e) {}
        return '';
    }

    function _getToken() {
        try {
            return (typeof Auth !== 'undefined' && Auth.getToken) ? Auth.getToken() : null;
        } catch (_e) { return null; }
    }

    function _fingerprint() {
        try {
            return (typeof DeviceFingerprint !== 'undefined' && DeviceFingerprint.getFingerprint)
                ? DeviceFingerprint.getFingerprint() : null;
        } catch (_e) { return null; }
    }

    // Nunca enviar credenciales ni hashes al log.
    function _sanitize(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        const out = {};
        Object.keys(obj).forEach((k) => {
            if (/pass(word)?|token|secret|hash|signature/i.test(k)) return;
            out[k] = obj[k];
        });
        return out;
    }

    function _enqueue(ev) {
        if (_queue.length >= MAX_QUEUE) { _queue.shift(); _dropped++; }
        _queue.push(ev);
        if (_queue.length >= 20) flush();
        else _schedule();
    }

    function _schedule() {
        if (_timer) return;
        _timer = setTimeout(function () { _timer = null; flush(); }, FLUSH_MS);
    }

    // log(action, module, details, opts)
    // opts: { success, durationMs, severity } | number (compat: durationMs)
    function log(action, module, details, opts) {
        try {
            if (!_enabled) return Promise.resolve({ ok: true, skipped: true });
            const o = (typeof opts === 'number') ? { durationMs: opts } : (opts || {});
            const meta = _sanitize(details || {});
            meta.sessionId = _sessionId;
            meta.origin = 'client';
            const fp = _fingerprint();
            if (fp) meta.deviceFingerprint = fp;
            try { if (typeof currentPage !== 'undefined' && currentPage) meta.page = currentPage; } catch (_e) {}
            try { if (typeof window !== 'undefined' && window._ASSET_VERSION) meta.appVersion = window._ASSET_VERSION; } catch (_e) {}

            let payload = meta;
            try {
                if (JSON.stringify(payload).length > 4096) {
                    payload = { truncated: true, keys: Object.keys(meta).slice(0, 20), sessionId: _sessionId, origin: 'client' };
                }
            } catch (_e) {}

            _enqueue({
                action: String(action || 'UNKNOWN').slice(0, 80),
                module: String(module || 'SYSTEM'),
                success: o.success !== false,
                durationMs: (o.durationMs != null && isFinite(o.durationMs)) ? Math.max(0, Math.round(o.durationMs)) : null,
                details: payload,
            });
            return Promise.resolve({ ok: true, queued: true });
        } catch (err) {
            return Promise.resolve({ ok: false, error: String(err && err.message || err) });
        }
    }

    // Vacía la cola (lotes de 50). keepalive: sobrevive al cierre de pestaña.
    async function flush(keepalive) {
        if (_flushing || !_queue.length) return;
        const api = _resolveApi();
        const token = _getToken();
        if (!api || !token) return; // se reintenta en el siguiente flush
        _flushing = true;
        const batch = _queue.splice(0, BATCH_SIZE);
        try {
            const res = await fetch(api + '/api/audit/events', {
                method: 'POST',
                keepalive: !!keepalive,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                credentials: 'include',
                body: JSON.stringify({ events: batch }),
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
        } catch (_err) {
            // Reencolar al frente, sin superar el tope
            _queue = batch.concat(_queue).slice(0, MAX_QUEUE);
            _schedule();
        } finally {
            _flushing = false;
        }
    }

    // Wrapper con medición de duración y captura de error.
    async function track(action, module, fn, details) {
        const t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        try {
            const r = await fn();
            const ms = Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0);
            log(action, module, details, { success: true, durationMs: ms });
            return r;
        } catch (e) {
            const ms = Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0);
            log(action, module, Object.assign({}, details || {}, { error: String(e && e.message || e) }), { success: false, durationMs: ms, severity: 'error' });
            throw e;
        }
    }

    // ── Convenience (API histórica) ────────────
    function logDataChange(actionType, details) {
        return log('DATA:' + actionType, MODULES.DATOS, details);
    }
    function logReportGenerate(format, hasGraphics) {
        return log('REPORT:' + String(format || 'UNKNOWN').toUpperCase(), MODULES.REPORTES, { format: format, hasGraphics: !!hasGraphics });
    }
    function logError(errorType, errorMessage) {
        return log('ERROR:' + errorType, MODULES.SYSTEM, { error: errorMessage });
    }

    // Vaciado al cerrar/ocultar (keepalive mantiene la petición viva).
    if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('pagehide', function () { flush(true); });
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') flush(true);
        });
    }

    return {
        init,
        setEnabled,
        log,
        flush,
        track,
        logDataChange,
        logReportGenerate,
        logError,
        MODULES,
        // Solo para diagnóstico/tests:
        _pending: function () { return _queue.length; },
        _dropped: function () { return _dropped; },
        _sessionId: function () { return _sessionId; },
    };
})();

// Inicialización opcional temprana (la URL también se resuelve en el primer flush).
if (typeof window !== 'undefined') {
    try {
        if (typeof API_URL !== 'undefined' && API_URL) Logger.init(API_URL);
        else if (typeof CFG !== 'undefined' && CFG && CFG.API_URL) Logger.init(CFG.API_URL);
    } catch (_e) {}
}
