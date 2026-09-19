// ── LOTE B — Proxy /api/ml/* → ML Service (extraído testeable) ──
// Mejoras vs el handler inline anterior:
// 1. Soporta https (antes solo http: contra Fly https devolvía 503).
// 2. Inyecta X-API-Key desde ML_API_KEY del backend (nunca del cliente).
// Solo Content-Type/Accept del cliente + la clave del servidor.
'use strict';

const http = require('http');
const https = require('https');

function pickModule(protocol) {
    return protocol === 'https:' ? https : http;
}

function buildProxyHeaders(req, apiKey) {
    // FIX: en GET/HEAD no se envía Content-Type (el delete anterior usaba
    // minúsculas contra una clave capitalizada y nunca borraba nada).
    const headers = {
        'Accept': req.headers['accept'] || '*/*',
    };
    if (!['GET', 'HEAD'].includes(req.method)) {
        headers['Content-Type'] = req.headers['content-type'] || 'application/json';
    }
    if (apiKey) headers['X-API-Key'] = apiKey;
    return headers;
}

function createMlProxy({ target, apiKey, timeoutMs = 120000 }) {
    const base = String(target || 'http://localhost:8000').replace(/\/$/, '');
    return function mlProxy(req, res) {
        let mlUrl;
        try {
            mlUrl = new URL(base + req.originalUrl);
        } catch (err) {
            return res.status(500).json({ ok: false, error: 'Error interno del ML proxy' });
        }
        let body = null;
        try {
            if (req.body && Object.keys(req.body).length) body = JSON.stringify(req.body);
        } catch (err) {
            return res.status(400).json({ ok: false, error: 'Body inválido' });
        }
        const mod = pickModule(mlUrl.protocol);
        const options = {
            hostname: mlUrl.hostname,
            port: mlUrl.port || (mlUrl.protocol === 'https:' ? 443 : 80),
            path: mlUrl.pathname + mlUrl.search,
            method: req.method,
            headers: buildProxyHeaders(req, apiKey),
            timeout: timeoutMs,
        };
        if (body) options.headers['content-length'] = Buffer.byteLength(body);
        const proxyReq = mod.request(options, (proxyRes) => {
            res.status(proxyRes.statusCode);
            proxyRes.headers && Object.entries(proxyRes.headers).forEach(([k, v]) => {
                try { res.setHeader(k, v); } catch (e) { /* header inválido del upstream */ }
            });
            proxyRes.pipe(res);
        });
        proxyReq.on('error', () => {
            if (!res.headersSent) res.status(503).json({ ok: false, error: 'ML Service no disponible' });
        });
        proxyReq.on('timeout', () => {
            proxyReq.destroy();
            if (!res.headersSent) res.status(504).json({ ok: false, error: 'ML Service timeout' });
        });
        if (body) proxyReq.write(body);
        proxyReq.end();
    };
}

module.exports = { createMlProxy, buildProxyHeaders, pickModule };
