'use strict';

// Rutas que reciben HTML de reportes o snapshots grandes (>100 KB).
// El parser global es pequeño (anti-DoS); solo estas rutas usan el parser
// grande. Incluye amend y snapshots, que antes devolvían 413 (MF-3).
function isLargeBodyRoute(req) {
    if (!req || req.method !== 'POST') return false;
    const path = String(req.path || '');
    return path === '/api/sign-sessions'
        || path === '/api/sign-sessions/import'
        || /^\/api\/sign-sessions\/[^/]+\/amend$/.test(path)
        || path === '/api/snapshots'
        || path === '/api/pdf/render'
        || path === '/api/val/v1/protocols';
}

module.exports = { isLargeBodyRoute };
