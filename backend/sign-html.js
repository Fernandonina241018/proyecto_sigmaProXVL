// ── FASE 3 — Parser de bloques de firma incrustados en el .html ──
// Extrae { role: { name } } de los bloques data-signature-role generados
// por ReporteManager. Puro y sin dependencias (testeable con node:test).
// Un bloque cuenta como firmado si su campo name existe y no es '—'/vacío.
'use strict';

const SIGN_ROLES = ['prepared', 'reviewed', 'approved'];

function _blockHtml(html, role) {
    // Captura el div del bloque data-signature-role="X" (no anidado en sí mismo)
    const re = new RegExp(
        '<div[^>]*data-signature-role="' + role + '"[^>]*>([\\s\\S]*?)</div>\\s*(?=<div[^>]*data-signature-role=|</body|</html|$)',
        'i'
    );
    const m = String(html || '').match(re);
    return m ? m[1] : null;
}

function _fieldValue(blockHtml, field) {
    if (!blockHtml) return '';
    const re = new RegExp(
        'data-signature-field="' + field + '"[^>]*>([\\s\\S]*?)</span>',
        'i'
    );
    const m = blockHtml.match(re);
    if (!m) return '';
    return m[1].replace(/<[^>]*>/g, '').trim();
}

function extractEmbeddedSignatures(html) {
    const out = {};
    for (const role of SIGN_ROLES) {
        const block = _blockHtml(html, role);
        const name = _fieldValue(block, 'name');
        out[role] = { signed: !!name && name !== '—' && name !== '&mdash;', name };
    }
    return out;
}

module.exports = { SIGN_ROLES, extractEmbeddedSignatures };
