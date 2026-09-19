// Formato único de fecha de firma: dd/Mmm/AAAA HH:MM:SS (24h, hora local).
// Ej: 19/Sep/2026 14:35:22. Mirror cliente en _firmaNowStamp() (indexx-firma.js).
// Puro y sin dependencias (testeable con node:test).
'use strict';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function pad2(n) {
    return String(n).padStart(2, '0');
}

function signStamp(d) {
    const t = d instanceof Date ? d : new Date();
    return (
        pad2(t.getDate()) + '/' + MESES[t.getMonth()] + '/' + t.getFullYear() + ' ' +
        pad2(t.getHours()) + ':' + pad2(t.getMinutes()) + ':' + pad2(t.getSeconds())
    );
}

module.exports = { signStamp, MESES };
