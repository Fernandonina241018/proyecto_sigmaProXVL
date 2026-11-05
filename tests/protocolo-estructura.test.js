// Estructura del protocolo maestro IQ/OQ/PQ.
// Bloquea la regresión de los 5 pendientes: backfill de las 9 familias,
// referencias pendientes explícitas, anexos A-D y nota de alcance de USP <1058>.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const raiz = process.cwd();
const equipos = resolve(raiz, 'docs/banco-ensayos/equipos');
const leer = (archivo) => readFileSync(resolve(equipos, archivo), 'utf8');

const prioritarias = [
  'tableteadora', 'encapsuladora', 'granulador', 'recubridora', 'blistera',
  'detector-metales', 'etiquetadora', 'reactor', 'sistema-cremas-vacio',
];
const backfill = [
  'autoclave', 'congelador-lab', 'horno', 'horno-vacio', 'lecho-fluido',
  'llenadora', 'llenadora-tubos', 'mezclador', 'refrigerador-lab',
];
const fases = ['oq', 'pq'];
const familias = prioritarias.concat(backfill);

describe('protocolo maestro: 18 familias con bloques 6 y 8', () => {
  for (const fase of fases) {
    for (const fam of familias) {
      it(`${fase}-${fam}: referencias, anexos A-D y sin USP <1058>`, () => {
        const html = leer(`${fase}-${fam}.html`);
        expect(html).toContain('data-bloque="6"');
        expect(html).toContain('data-bloque="8"');
        for (const letra of ['Anexo A', 'Anexo B', 'Anexo C', 'Anexo D']) {
          expect(html).toContain(letra);
        }
        expect(html).not.toMatch(/USP\s*(?:&lt;|<)\s*1058/i);
      });
    }
  }
});

describe('protocolo maestro: fila 6.6 de las 9 prioritarias', () => {
  for (const fase of fases) {
    for (const fam of prioritarias) {
      it(`${fase}-${fam}: pendiente explícito del responsable`, () => {
        const html = leer(`${fase}-${fam}.html`);
        expect(html).toContain('PENDIENTE DEL RESPONSABLE');
      });
    }
  }
});

describe('protocolo maestro: ensayo común de instrumentos', () => {
  it('aclarar que USP <1058> aplica solo a instrumentos analíticos (tipo L)', () => {
    for (const archivo of ['oq-comun.html', 'pq-comun.html']) {
      const html = leer(archivo);
      expect(html).toContain('Nota de alcance:');
      expect(html).toContain('instrumentos analíticos (tipo L)');
      expect(html).toContain('maquinaria de producción (tipo M)');
    }
    const iq = readFileSync(resolve(raiz, 'docs/banco-ensayos/equipos-comun.html'), 'utf8');
    expect(iq).toContain('Nota de alcance:');
    expect(iq).toContain('instrumentos analíticos (tipo L)');
  });
});

describe('protocolo maestro: IQ de sistemas cableado', () => {
  it('los cuatro IQ de sistemas existen y tienen fase IQ', () => {
    for (const fam of ['hvac', 'agua-purificada', 'vapor-limpio', 'aire-comprimido']) {
      const html = readFileSync(resolve(raiz, `docs/banco-ensayos/sistemas/iq-${fam}.html`), 'utf8');
      expect(html).toContain('id="fase-iq"');
      expect(html).toContain('data-bloque="3"');
    }
  });
});
