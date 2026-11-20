// Instrumentos declarados como guía en el banco de almacenes.
// El banco pone el nombre; el analista carga ID y certificado.
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const B = require('../js/core/banco-almacenes-data.js');

const ensayos = Object.entries(B.fases || {})
  .flatMap(([fase, xs]) => xs.map((x) => ({ ...x, fase })))
  .filter((e) => e.kind === 'ensayo' && (e.bloque === 2 || e.bloque === 3));

describe('almacenes: instrumentos por ensayo', () => {
  it('los ensayos de medición declaran el instrumento esperado', () => {
    const esperado = {
      'ALM-OQ-003': /termohigr[oó]metro/i,
      'ALM-OQ-004': /lux[oó]metro/i,
      'ALM-OQ-005': /termohigr[oó]metro/i,
      'ALM-PQ-003': /termohigr[oó]metro/i,
      'ALM-PQ-004': /termohigr[oó]metro/i,
    };
    for (const [id, re] of Object.entries(esperado)) {
      const e = ensayos.find((x) => x.id === id);
      expect(String(e && e.instrumentos), id).toMatch(re);
    }
  });

  it('los ensayos documentales quedan sin instrumento', () => {
    for (const id of ['ALM-IQ-002', 'ALM-IQ-006', 'ALM-IQ-012']) {
      const e = ensayos.find((x) => x.id === id);
      expect(String((e && e.instrumentos) || '').trim(), id).toBe('');
    }
  });

  it('no inventa IDs ni certificados', () => {
    const conIds = ensayos
      .filter((e) => /certificado\s*(n[o°]|no\.)|n[o°]\s*de\s*serie/i.test(String(e.instrumentos || '')))
      .map((e) => e.id);
    expect(conIds).toEqual([]);
  });
});
