// REGRESIÓN: la referencia normativa del protocolo depende del TIPO del
// equipo, no del texto "quemado" en el banco de ensayos.
//   M = maquinaria enfocada a producción (no analítica) → EU GMP Anexo 15 + ISPE
//   Q = cámaras/cuartos de estabilidad (ICH Q1A)         → EU GMP Anexo 15 + ICH Q1A
//   L = instrumento analítico o de control de calidad     → USP <1058> + Anexo 15
// USP <1058> es "Analytical Instrument Qualification": en una máquina de
// producción es una referencia incorrecta.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { resolve } from 'path';
import { cargarBanco } from '../scripts/cargar-banco.mjs';

const require = createRequire(import.meta.url);
const raiz = resolve(new URL('..', import.meta.url).pathname).replace(/^\/@fs/, '');
const P = require('../js/core/plantilla-docx.js');
const validaciones = require('../js/core/indexx-validaciones.js');
const bancoEq = readFileSync(resolve(raiz, 'js/core/banco-equipos-data.js'), 'utf-8');
const bancoEst = readFileSync(resolve(raiz, 'js/core/banco-estabilidad-data.js'), 'utf-8');

const ENTIDADES = validaciones.ENTIDADES;

describe('clasificación de equipos por tipo', () => {
  it('toda entidad de equipos y estabilidad declara su tipo', () => {
    for (const cat of ['equipos', 'estabilidad']) {
      for (const e of ENTIDADES[cat]) {
        expect(['M', 'Q', 'L'], `${cat}/${e.id} sin tipo`).toContain(e.tipo);
      }
    }
  });

  it('el tipo M es maquinaria de producción y el L es analítico', () => {
    const t = (cat, id) => ENTIDADES[cat].find((e) => e.id === id).tipo;
    // producción
    for (const id of ['tableteadora', 'mezclador', 'granulador', 'horno-secado', 'autoclave', 'reactor']) {
      expect(t('equipos', id)).toBe('M');
    }
    // estabilidad
    for (const id of ['cabina-est-acelerada', 'cuarto-est-real', 'incubadora-38-42']) {
      expect(t('estabilidad', id)).toBe('Q');
    }
    // analíticos
    for (const id of ['hplc', 'gc', 'espectrofotometro', 'balanza', 'karl-fischer', 'phmetro']) {
      expect(t('equipos', id)).toBe('L');
    }
  });
});

describe('referencia normativa por tipo', () => {
  it('M usa EU GMP Anexo 15 + ISPE y NO cita USP <1058>', () => {
    const r = P.refNormativa({ id: 'mezclador', tipo: 'M' });
    expect(r).toMatch(/EU GMP Anexo 15/);
    expect(r).toMatch(/ISPE Baseline Guide Vol\. 5/);
    expect(r).not.toMatch(/1058/);
  });

  it('Q (estabilidad) usa EU GMP Anexo 15 + ICH Q1A y NO cita USP <1058>', () => {
    const r = P.refNormativa({ id: 'cabina-est-acelerada', tipo: 'Q' });
    expect(r).toMatch(/EU GMP Anexo 15/);
    expect(r).toMatch(/ICH Q1A/);
    expect(r).not.toMatch(/1058/);
  });

  it('L (analítico) conserva USP <1058>', () => {
    const r = P.refNormativa({ id: 'hplc', tipo: 'L' });
    expect(r).toMatch(/1058/);
    expect(r).toMatch(/EU GMP Anexo 15/);
  });

  it('sin tipo declarado cae en la referencia analítica y avisa', () => {
    expect(P.refNormativa({ id: 'x' })).toMatch(/1058/);
  });
});

describe('el banco de ensayos no escribe el estándar en el texto', () => {
  it('no queda ningún USP <1058> escrito en los bancos de equipos ni estabilidad', () => {
    expect(bancoEq).not.toMatch(/1058/);
    expect(bancoEst).not.toMatch(/1058/);
  });

  it('las referencias piden la marca refnorma (se resuelve al generar)', () => {
    expect(bancoEq).toMatch(/class=\\?"refnorma/);
    expect(bancoEst).toMatch(/class=\\?"refnorma/);
  });

  it('la marca se resuelve con la referencia del tipo', () => {
    const ctx = { entidad: 'Mezclador', rango: '', cond: 'ambas', lista: '', refnorma: P.refNormativa({ tipo: 'M' }) };
    const html = 'Referencia:<br><span class="refnorma"></span>; manual del fabricante.';
    const out = P._interno.congelar(html, ctx);
    expect(out).toMatch(/ISPE Baseline Guide Vol\. 5/);
    expect(out).not.toMatch(/1058/);
    expect(out).toMatch(/manual del fabricante/);
  });
});

describe('el .docx generado lleva la referencia del tipo de la entidad', () => {
  const raiz2 = resolve(new URL('..', import.meta.url).pathname).replace(/^\/@fs/, '');
  const banco = cargarBanco(resolve(raiz2, 'js/core/banco-equipos-data.js'));
  const dec = (u8) => new TextDecoder().decode(u8);

  async function generarIQ(ent) {
    const u8 = new Uint8Array(readFileSync(resolve(raiz2, P.PLANTILLAS.IQ)));
    const r = await P.generar('IQ', u8, banco, {
      codigo: '4001234', descripcion: ent.nombre, ubicacion: 'Producción', tipo: 'Maquinaria',
      marca: 'B', modelo: 'M1', fecha: '2026-10-21', versionProtocolo: '01', controlCambios: 'CC-001',
    }, ent, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return arch['word/document.xml'].replace(/<[^>]+>/g, '');
  }

  it('máquina de producción (M): cita EU GMP Anexo 15 + ISPE y NO USP <1058>', async () => {
    const xml = await generarIQ({ id: 'mezclador', nombre: 'Mezclador (V / bins)', tipo: 'M' });
    expect(xml).toMatch(/EU GMP Anexo 15/);
    expect(xml).toMatch(/ISPE Baseline Guide Vol\. 5/);
    expect(xml).not.toMatch(/1058/);
  });

  it('instrumento analítico (L): sí cita USP <1058>', async () => {
    const xml = await generarIQ({ id: 'balanza', nombre: 'Balanza analítica / precisión', tipo: 'L' });
    expect(xml).toMatch(/1058/);
    expect(xml).toMatch(/EU GMP Anexo 15/);
  });

  it('no queda la marca sin resolver en el documento', async () => {
    const xml = await generarIQ({ id: 'mezclador', nombre: 'Mezclador (V / bins)', tipo: 'M' });
    expect(xml).not.toMatch(/refnorma/);
  });
});
