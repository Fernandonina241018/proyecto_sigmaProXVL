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
    expect(fams).toEqual(['autoclave', 'balanza', 'blistera', 'congelador-lab', 'detector-metales', 'encapsuladora', 'etiquetadora', 'granulador', 'horno-secado', 'horno-vacio', 'lecho-fluido', 'liofilizador', 'llenadora', 'llenadora-tubos', 'mezclador', 'reactor', 'recubridora', 'refrigerador-lab', 'sistema-cremas-vacio', 'tableteadora', 'tunel-despirogenizacion']);
  });

  it.each([
    ['IQ', 'autoclave', 8], // Nivel 3 (2026-10-07)
    ['IQ', 'tunel-despirogenizacion', 8], // Nivel 3 (2026-10-07)
    ['IQ', 'liofilizador', 9], // Nivel 3 (2026-10-07)
    ['IQ', 'reactor', 8], // Nivel 3 (2026-10-07)
    ['IQ', 'horno-vacio', 8], // Nivel 3 (2026-10-07)
    ['IQ', 'llenadora', 11], // Nivel 3 + addendum estéril (2026-10-29)
    ['OQ', 'llenadora', 24], // ENSAYOS.txt usuario + addendum estéril (2026-10-29)
    ['OQ', 'llenadora-tubos', 28], // ENSAYOS.txt usuario (2026-10-29)
    ['PQ', 'llenadora-tubos', 26], // ENSAYOS.txt usuario (2026-10-29)
    ['PQ', 'llenadora', 23], // ENSAYOS.txt usuario + addendum estéril (2026-10-29)
    ['IQ', 'lecho-fluido', 8], // Nivel 3 (2026-10-07)
    ['IQ', 'tableteadora', 5], // Nivel 2 (2026-10-08)
    ['IQ', 'encapsuladora', 5], // Nivel 2 (2026-10-08)
    ['IQ', 'granulador', 5], // Nivel 2 (2026-10-08)
    ['IQ', 'recubridora', 5], // Nivel 2 (2026-10-09)
    ['IQ', 'blistera', 5], // Nivel 2 (2026-10-09)
    ['IQ', 'detector-metales', 5], // Nivel 2 (2026-10-11)
    ['IQ', 'etiquetadora', 5], // Nivel 2 (2026-10-11)
    ['IQ', 'mezclador', 5], // Nivel 2 (2026-10-11)
    ['IQ', 'horno-secado', 5], // Nivel 2 (2026-10-11)
    ['IQ', 'sistema-cremas-vacio', 8], // Nivel 3 (2026-10-12)
    ['OQ', 'sistema-cremas-vacio', 36], // ENSAYOS.txt usuario (2026-10-12)
    ['PQ', 'sistema-cremas-vacio', 20], // ENSAYOS.txt usuario (2026-10-12)
    ['OQ', 'lecho-fluido', 11], // 13 cuando se aprueben LF-012/LF-013 (ops omitidas)
    ['OQ', 'autoclave', 18],
    ['OQ', 'mezclador', 13], // 12 si se retira MZ-010 (op omitida)
    ['OQ', 'horno-secado', 16],
    ['OQ', 'reactor', 27], // ENSAYOS.txt usuario (2026-10-07) + RC-027 ATEX (H-14)
    ['PQ', 'reactor', 14], // ENSAYOS.txt usuario (2026-10-07)
    ['OQ', 'tableteadora', 27], // ENSAYOS.txt usuario (2026-10-08)
    ['PQ', 'tableteadora', 19], // ENSAYOS.txt usuario (2026-10-08)
    ['OQ', 'encapsuladora', 26], // ENSAYOS.txt usuario (2026-10-08)
    ['PQ', 'encapsuladora', 18], // ENSAYOS.txt usuario (2026-10-08)
    ['OQ', 'granulador', 24], // ENSAYOS.txt usuario (2026-10-08)
    ['PQ', 'granulador', 16], // ENSAYOS.txt usuario (2026-10-08)
    ['OQ', 'recubridora', 25], // ENSAYOS.txt usuario (2026-10-09)
    ['PQ', 'recubridora', 18], // ENSAYOS.txt usuario (2026-10-09)
    ['OQ', 'blistera', 28], // ENSAYOS.txt usuario (2026-10-09)
    ['PQ', 'blistera', 19], // ENSAYOS.txt usuario (2026-10-09)
    ['OQ', 'detector-metales', 20], // ENSAYOS.txt usuario (2026-10-11)
    ['PQ', 'detector-metales', 15], // ENSAYOS.txt usuario (2026-10-11)
    ['OQ', 'etiquetadora', 30], // ENSAYOS.txt usuario (2026-10-11)
    ['PQ', 'etiquetadora', 20], // ENSAYOS.txt usuario (2026-10-11)
    ['OQ', 'refrigerador-lab', 19], // ENSAYOS.txt neveras (2026-10-14)
    ['PQ', 'refrigerador-lab', 14], // ENSAYOS.txt neveras (2026-10-14)
    ['OQ', 'congelador-lab', 19], // ENSAYOS.txt neveras (2026-10-14)
    ['PQ', 'congelador-lab', 14], // ENSAYOS.txt neveras (2026-10-14)
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

  it('H-05: todo "[n]" del banco tiene entrada en la tabla de límites', () => {
    const P05 = require('../js/core/plantilla-docx.js');
    const BE = require('../js/core/banco-estabilidad-data.js');
    const deFases = (BB) => Object.entries(BB.fases).flatMap(([fase, xs]) => xs.map((x) => ({ ...x, fase })));
    const todosB = deFases(B).concat(deFases(BE));
    const ens = todosB.filter((x) => x.kind === 'ensayo' && (x.bloque === 2 || x.bloque === 3) && x.id);
    const sin = [];
    ens.forEach((x) => {
      const toks = (plano(x).match(/\[[0-9][^\]]*\]/g) || []).map((t) => t.replace(/^\[|\]$/g, ''));
      toks.forEach((t) => {
        if (!P05.limitesDe(x.id).some((l) => l.token === t)) sin.push(x.id + ' [' + t + ']');
      });
    });
    expect(sin).toEqual([]);
  });

  it('secuencia sin huecos por familia y fase (salvo omitidas declaradas)', () => {
    // Huecos intencionales por decisión documentada (no son olvidos).
    const HUECOS_OK = { 'EQ-OQ-LF': [12, 13] };
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
        const pref = k.split('|')[1];
        if (nums.indexOf(n) < 0 && (HUECOS_OK[pref] || []).indexOf(n) < 0) malos.push(k + '-' + n + ' (hueco)');
      }
    });
    expect(malos).toEqual([]);
  });

  it('crosswalk IQ Nivel 2 vs núcleo común: sin solapes (Jaccard < 0.50)', () => {
    const N2 = ['tableteadora', 'encapsuladora', 'granulador', 'recubridora', 'blistera', 'detector-metales', 'etiquetadora', 'mezclador', 'horno-secado'];
    const iq = ensayos.filter((x) => x.fase === 'IQ');
    expect([...new Set(iq.filter((x) => N2.indexOf(x.familia) >= 0).map((x) => x.familia))].sort()).toEqual(N2.slice().sort());
    const STOP = new Set(['para', 'como', 'esta', 'este', 'entre', 'sobre', 'ante', 'cada', 'todos', 'todas', 'donde', 'cuando', 'porque', 'desde', 'hasta', 'hacia', 'durante', 'mediante']);
    const toks = (x) => new Set(plano(x).toLowerCase().replace(/[^a-záéíóúñ0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w)));
    const jac = (a, b) => {
      const A = toks(a), Cb = toks(b);
      let i = 0;
      A.forEach((w) => { if (Cb.has(w)) i++; });
      return i / (A.size + Cb.size - i);
    };
    const comun = iq.filter((x) => !x.familia);
    const solapes = [];
    iq.filter((x) => N2.indexOf(x.familia) >= 0).forEach((n2) => {
      comun.forEach((c) => {
        const v = jac(n2, c);
        if (v >= 0.5) solapes.push(n2.id + ' vs ' + c.id + ' (' + v.toFixed(2) + ')');
      });
    });
    expect(solapes).toEqual([]);
  });

  it('matriz de desafío en rechazo/visión + empaque 211.122/125/130', () => {
    const desafio = ['EQ-OQ-TB-018', 'EQ-OQ-TB-019', 'EQ-OQ-EN-019', 'EQ-OQ-BL-023', 'EQ-OQ-BL-024', 'EQ-OQ-ET-023', 'EQ-OQ-ET-024', 'EQ-OQ-ET-025', 'EQ-OQ-ET-026', 'EQ-OQ-DM-015'];
    const sinMatriz = desafio.filter((id) => {
      const x = ensayos.find((e) => e.id === id);
      return !x || !/Matriz de desafío[^.]*100 % de las unidades malas se rechaza y el 0 % de las unidades buenas se rechaza/.test(plano(x));
    });
    expect(sinMatriz).toEqual([]);
    ['EQ-PQ-BL-018', 'EQ-PQ-ET-019'].forEach((id) => {
      const t = plano(ensayos.find((e) => e.id === id)).toLowerCase();
      ['prospecto', 'doble firma', 'destruidos', '211.122'].forEach((k) => expect(t).toContain(k));
    });
  });

  it('instrumentos 7.2 usan la tabla del modelo (en blanco), no lista de verificación', () => {
    ['EQ-IQ-002', 'EQ-OQ-COM-001', 'EQ-PQ-COM-001'].forEach((id) => {
      const x = ensayos.find((e) => e.id === id);
      expect(x && x.tablaModelo).toBe('INSTRUMENTOS DE MEDICIÓN');
    });
  });
});
