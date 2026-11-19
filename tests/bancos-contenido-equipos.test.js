// Contrato de contenido para las familias de equipos ya migradas al estándar
// §5.4 (esqueleto común + criterio individual). Se amplía MIGRADAS a medida
// que cada familia pasa por el mismo proceso.
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const banco = require('../js/core/banco-equipos-data.js');

// Familias migradas. Agregar el id de familia al migrarla.
const MIGRADAS = new Set(['tableteadora', 'encapsuladora', 'granulador', 'recubridora', 'reactor', 'llenadora', 'llenadora-tubos', 'blistera', 'etiquetadora', 'detector-metales', 'horno-secado', 'horno-vacio']);

const ensayos = Object.entries(banco.fases)
  .flatMap(([fase, xs]) => xs.map((x) => ({ ...x, fase })))
  .filter((e) => e.kind === 'ensayo' && (e.bloque === 2 || e.bloque === 3) && MIGRADAS.has(e.familia));

const sec = (e, prefijo) => (e.secciones || []).find((s) => String(s.et || '').startsWith(prefijo));
const texto = (e, prefijo) => {
  const s = sec(e, prefijo);
  return s ? String(s.html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
};

describe('equipos migrados: contrato de contenido', () => {
  it('hay ensayos de las familias migradas', () => {
    expect(ensayos.length).toBeGreaterThan(0);
  });

  it('todo ensayo tiene las cinco secciones del estándar', () => {
    const faltan = [];
    for (const e of ensayos) {
      for (const prefijo of ['Objetivo', 'Procedimiento', 'Criterio', 'Documentos', 'Referencia']) {
        if (!sec(e, prefijo)) faltan.push(`${e.id}: ${prefijo}`);
      }
    }
    expect(faltan).toEqual([]);
  });

  it('todo ensayo con análisis tiene plan con variable, n y regla', () => {
    const malos = ensayos
      .filter((e) => e.analisis === 'si')
      .filter((e) => {
        const p = texto(e, 'Plan estadístico');
        return !p || !/Variable =/.test(p) || !/n =/.test(p) || !/Regla de decisión =/.test(p);
      })
      .map((e) => e.id);
    expect(malos).toEqual([]);
  });

  it('ningún criterio delega el límite al ejecutor', () => {
    const vagos = ensayos.filter((e) =>
      /dentro de lo definido|pendiente de confirmaci[oó]n|seg[uú]n lo definido|a criterio del responsable/i.test(texto(e, 'Criterio')));
    expect(vagos.map((e) => e.id)).toEqual([]);
  });

  it('todo valor propuesto declara su nota de pendiente', () => {
    const sinNota = ensayos
      .filter((e) => /por-confirmar/.test(texto(e, 'Criterio')))
      .filter((e) => !sec(e, 'Nota'))
      .map((e) => e.id);
    expect(sinNota).toEqual([]);
  });

  it('la familia migrada tiene al menos la mitad de criterios con valor', () => {
    const conValor = ensayos.filter((e) => /\d/.test(texto(e, 'Criterio'))).length;
    expect(conValor / ensayos.length).toBeGreaterThanOrEqual(0.5);
  });

  it('toda referencia cita una fuente normativa', () => {
    const sinFuente = ensayos
      .filter((e) => !/USP|ISO|IEC|EU GMP|21 CFR|OMS|ICH|Anexo/.test(texto(e, 'Referencia')))
      .map((e) => e.id);
    expect(sinFuente).toEqual([]);
  });
});
