// Banco OQ de cámaras de estabilidad (categoría nueva, sin familias).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { resolve } from 'path';
import { cargarBanco } from '../scripts/cargar-banco.mjs';

const require = createRequire(import.meta.url);
const raiz = resolve(new URL('..', import.meta.url).pathname).replace(/^\/@fs/, '');
const P = require('../js/core/plantilla-docx.js');
const banco = cargarBanco(process.env.BANCO || resolve(raiz, 'js/core/banco-estabilidad-data.js'));
const dec = (u8) => new TextDecoder().decode(u8);

const DRAFT = {
  codigo: '500100', descripcion: 'Cabina estabilidad acelerada', ubicacion: 'Estabilidad',
  tipo: 'Cámara', marca: 'COMASA', modelo: 'EST-400', fecha: '2026-10-06',
};
const ENT = { id: 'cabina-est-acelerada', nombre: 'Cabina estabilidad acelerada (38–42 °C)' };

describe('banco estabilidad OQ', () => {
  it('19 ensayos comunes + RES + REF, 12 con analisis, IDs únicos', () => {
    const ids = (banco.fases.OQ || []).filter((i) => i.id).map((i) => i.id);
    expect(ids).toHaveLength(21);
    expect(new Set(ids).size).toBe(21);
    expect(ids.filter((id) => /^EST-OQ-\d+$/.test(id))).toHaveLength(19);
    const an = (banco.fases.OQ || []).filter((i) => i.analisis).map((i) => i.id);
    expect(an).toHaveLength(12);
  });

  it('artículos sin familia (común a las 7 cámaras)', () => {
    const fam = (banco.fases.OQ || []).filter((i) => i.id && i.familia);
    expect(fam).toEqual([]);
  });
});

describe('OQ cámaras de estabilidad con formato del modelo', () => {
  const genOQ = async (ent) => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.OQ)));
    const r = await P.generar('OQ', u8, banco, DRAFT, ent, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return { r, doc: arch['word/document.xml'] };
  };

  it('cabina acelerada genera 19 ensayos con ICH Q1A', async () => {
    const { r, doc } = await genOQ(ENT);
    expect(r.ensayos).toHaveLength(19);
    expect(r.ensayos[0]).toBe('EST-OQ-001');
    for (const id of r.ensayos) expect(doc).toContain(id);
    const txt = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(txt).toContain('CABINA ESTABILIDAD ACELERADA');
    expect(txt).toContain('40');
  });

  it('cuarto real genera los mismos 19 (banco común)', async () => {
    const { r } = await genOQ({ id: 'cuarto-est-real', nombre: 'Cuarto estabilidad real' });
    expect(r.ensayos).toHaveLength(19);
  });
});
