// ── Bandeja de firmas: recolección paginada de candidatos ──
// Antes el endpoint traía limit*3 filas y filtraba en JS: con más de 150
// pendientes las más viejas desaparecían (y el badge subcontaba). Aquí se
// pagina de verdad hasta juntar lo pedido (listado) o hasta agotar (conteo).
// Puro y sin dependencias (testeable con node:test).
// shortcut: el conteo escanea todas las páginas — O(n) en pendientes; si la
// bandeja llega a miles, mover el filtro de elegibilidad a SQL.
'use strict';

const BATCH = 200;

async function collectSignTray({ fetchPage, isCandidate, scope = 'list', offset = 0, limit = 50 }) {
    if (scope === 'count') {
        let total = 0;
        for (let from = 0; ; from += BATCH) {
            const batch = await fetchPage(BATCH, from);
            for (const s of batch) if (isCandidate(s)) total++;
            if (batch.length < BATCH) return total;
        }
    }
    const wanted = offset + limit;
    const out = [];
    for (let from = 0; ; from += BATCH) {
        const batch = await fetchPage(BATCH, from);
        for (const s of batch) if (isCandidate(s)) out.push(s);
        if (out.length >= wanted || batch.length < BATCH) break;
    }
    return out.slice(offset, wanted);
}

module.exports = { collectSignTray, BATCH };
