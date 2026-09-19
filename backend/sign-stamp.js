// Formato único de fecha de firma: dd/Mmm/AAAA HH:MM:SS AM/PM (12h, hora local).
// Ej: 19/Sep/2026 02:35:22 PM. Mirror cliente en _firmaNowStamp() (indexx-firma.js).
// Puro y sin dependencias (testeable con node:test).
'use strict';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function pad2(n) {
    return String(n).padStart(2, '0');
}

function signStamp(d) {
    const t = d instanceof Date ? d : new Date();
    const h24 = t.getHours();
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 || 12;
    return (
        pad2(t.getDate()) + '/' + MESES[t.getMonth()] + '/' + t.getFullYear() + ' ' +
        pad2(h12) + ':' + pad2(t.getMinutes()) + ':' + pad2(t.getSeconds()) + ' ' + ampm
    );
}

module.exports = { signStamp, MESES };
