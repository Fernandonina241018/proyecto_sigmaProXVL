// Contrato del banco de equipos (revisión 2026-10-05).
// Corre sobre el JSON generado: node scripts/extraer-banco.mjs equipos && npx vitest run tests/bancos-contrato.test.js
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const B = require('../js/core/banco-equipos-data.js');

const todos = Object.entries(B.fases).flatMap(([fase, xs]) => xs.map((x) => ({ ...x, fase })));
const conId = todos.filter((x) => x.id);
const ensayos = todos.filter((x) => x.kind === 'ensayo' && (x.bloque === 2 || x.bloque === 3));
const familia = ensayos.filter((x) => x.familia);
const plano = (x) => (x.secciones || []).map((s) => s.html).join(' ')
  .replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

describe('banco de equipos: contrato', () => {
  it('IDs únicos en todo el banco (todas las fases y archivos)', () => {
    const vistos = new Map();
    const dup = [];
    for (const x of conId) { if (vistos.has(x.id)) dup.push(x.id + ' (' + vistos.get(x.id) + '/' + x.fase + ')'); else vistos.set(x.id, x.fase); }
    expect(dup).toEqual([]);
  });

  it('data-analisis solo admite "si"', () => {
    expect(todos.filter((x) => 'analisis' in x && x.analisis !== 'si').map((x) => x.id)).toEqual([]);
  });

  it('ensayos con análisis traen paso de procesamiento y entregable de data cruda', () => {
    const malos = ensayos.filter((x) => x.analisis)
      .filter((x) => !/an[aá]lisis estad[ií]stico/i.test(plano(x)) || !/data cruda/i.test(plano(x)));
    expect(malos.map((x) => x.id)).toEqual([]);
  });

  it('el prefijo del ID coincide con la fase en los bancos por familia', () => {
    expect(familia.filter((x) => !x.id.startsWith('EQ-' + x.fase + '-')).map((x) => x.id)).toEqual([]);
  });

  it('solo familias conocidas', () => {
    const fams = [...new Set(todos.filter((x) => x.familia).map((x) => x.familia))].sort();
    expect(fams).toEqual(['autoclave', 'horno-secado', 'lecho-fluido', 'mezclador']);
  });

  it.each([
    ['OQ', 'lecho-fluido', 11], // 13 cuando se aprueben LF-012/LF-013 (ops omitidas)
    ['OQ', 'autoclave', 18],
    ['OQ', 'mezclador', 13], // 12 si se retira MZ-010 (op omitida)
    ['OQ', 'horno-secado', 16],
    ['PQ', 'lecho-fluido', 16],
    ['PQ', 'autoclave', 17],
    ['PQ', 'mezclador', 14],
  ])('%s %s tiene %i ensayos propios', (fase, fam, n) => {
    expect(familia.filter((x) => x.fase === fase && x.familia === fam).length).toBe(n);
  });

  it('EQ-OQ-MZ-010 presente (retiro pendiente de decisión del usuario)', () => {
    expect(conId.some((x) => x.id === 'EQ-OQ-MZ-010')).toBe(true);
  });

  it('sin campos "[ ]" pendientes en los bancos por familia', () => {
    expect(familia.filter((x) => /\[\s*\]/.test(plano(x))).map((x) => x.id)).toEqual([]);
  });

  it('sin citas normativas erróneas conocidas', () => {
    const malas = [/USP <1211> \(tiempos de espera\)/, /USP <1211> — Tiempos de espera/, /Clase B según ISO 11140/, /positivo positivo/];
    const hits = todos.filter((x) => x.secciones || x.tabla)
      .filter((x) => { const t = plano(x) + ' ' + JSON.stringify(x.tabla || ''); return malas.some((r) => r.test(t)); });
    expect(hits.map((x) => x.id)).toEqual([]);
  });
});
