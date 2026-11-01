// Enmascara una IP para mostrarla en la tarjeta de sesión recordada.
// No se guarda ni se expone la IP completa en el nuevo campo.
function maskIP(ip) {
    let s = String(ip || '').trim();
    if (!s) return null;
    if (s === '::1' || s === 'localhost') return '127.0.•.•';
    // IPv4 mapeada en IPv6 (::ffff:190.12.34.56)
    if (s.indexOf('::ffff:') === 0) s = s.slice(7);
    if (s.indexOf('.') !== -1) {
        const p = s.split('.');
        if (p.length === 4) return p[0] + '.' + p[1] + '.•.•';
        return null;
    }
    if (s.indexOf(':') !== -1) {
        const p = s.split(':').filter(Boolean);
        if (p.length < 4) return '•:•:•:•';
        return p.slice(0, 4).join(':') + ':•:•:•:•';
    }
    return null;
}

module.exports = { maskIP };
