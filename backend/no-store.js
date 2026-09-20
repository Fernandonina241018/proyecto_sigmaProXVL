// Middleware anti-caché para la API.
// Sin Cache-Control, los navegadores (sobre todo móviles) sirven los GET de
// bandeja desde caché HTTP y Mías queda pegada en conteos viejos (1/3 con la
// sesión ya completa). Con no-store cada lectura va al servidor.
function apiNoStore(req, res, next) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
}

module.exports = { apiNoStore };
