// Contrato del banco de sistemas (agua purificada, ENSAYOS.txt 2026-10-14).
// Corre sobre el JSON generado: node scripts/extraer-banco.mjs sistemas && npx vitest run tests/bancos-sistemas.test.js
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const B = require('../js/core/banco-sistemas-data.js');

const todos = Object.entries(B.fases).flatMap(([fase, xs]) => xs.map((x) => ({ ...x, fase })));
const conId = todos.filter((x) => x.id);
const ensayos = todos.filter((x) => x.kind === 'ensayo' && (x.bloque === 2 || x.bloque === 3));
const familia = ensayos.filter((x) => x.familia);
const plano = (x) => (x.secciones || []).map((s) => s.html).join(' ')
  .replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

describe('banco de sistemas: contrato', () => {
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
    expect(familia.filter((x) => !x.id.startsWith('SIS-' + x.fase + '-')).map((x) => x.id)).toEqual([]);
  });

  it('solo familias conocidas', () => {
    const fams = [...new Set(todos.filter((x) => x.familia).map((x) => x.familia))].sort();
    expect(fams).toEqual(['agua-purificada', 'hvac']);
  });

  it.each([
    ['OQ', 'agua-purificada', 33], // ENSAYOS.txt sistema de agua (2026-10-14)
    ['PQ', 'agua-purificada', 23], // ENSAYOS.txt sistema de agua (2026-10-14)
    ['OQ', 'hvac', 38], // ENSAYOS.txt HVAC (2026-10-14)
    ['PQ', 'hvac', 22], // ENSAYOS.txt HVAC (2026-10-14)
  ])('%s %s tiene %i ensayos propios', (fase, fam, n) => {
    expect(familia.filter((x) => x.fase === fase && x.familia === fam).length).toBe(n);
  });

  it('todo el PQ lleva análisis (flag global del .txt)', () => {
    const pq = familia.filter((x) => x.fase === 'PQ');
    expect(pq.length).toBeGreaterThan(0);
    expect(pq.filter((x) => !x.analisis).map((x) => x.id)).toEqual([]);
  });

  it('secuencia sin huecos por familia y fase', () => {
    const malos = [];
    const grupos = new Map();
    ensayos.filter((x) => x.familia).forEach((x) => {
      const m = /^([A-Z]+-[A-Z]+(?:-[A-Z]+)?)-(\d+)$/.exec(x.id);
      if (!m) { malos.push(x.id + ' (formato)'); return; }
      const k = x.fase + '|' + m[1];
      if (!grupos.has(k)) grupos.set(k, []);
      grupos.get(k).push(+m[2]);
    });
    grupos.forEach((nums, k) => {
      const max = Math.max.apply(null, nums);
      for (let n = 1; n <= max; n++) {
        if (nums.indexOf(n) < 0) malos.push(k + '-' + n + ' (hueco)');
      }
    });
    expect(malos).toEqual([]);
  });

  it('sin campos "[ ]" pendientes en los bancos por familia', () => {
    expect(familia.filter((x) => /\[\s*\]/.test(plano(x))).map((x) => x.id)).toEqual([]);
  });

  it('sin citas normativas erróneas conocidas', () => {
    const malas = [/USP <1211> \(tiempos de espera\)/, /USP <1211> — Tiempos de espera/, /Clase B según ISO 11140/, /positivo positivo/];
    const hits = todos.filter((x) => x.secciones || x.tabla)
      .filter((x) => malas.some((re) => re.test(plano(x))));
    expect(hits.map((x) => x.id)).toEqual([]);
  });
});
