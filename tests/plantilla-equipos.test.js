// Generador IQ de Equipos (banco común EQ-IQ) con formato del modelo.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { resolve } from 'path';
import { cargarBanco } from '../scripts/cargar-banco.mjs';

const require = createRequire(import.meta.url);
const raiz = resolve(new URL('..', import.meta.url).pathname).replace(/^\/@fs/, '');
const P = require('../js/core/plantilla-docx.js');
const banco = cargarBanco(process.env.BANCO || resolve(raiz, 'js/core/banco-equipos-data.js'));
const dec = (u8) => new TextDecoder().decode(u8);

const DRAFT = {
  codigo: '4001234', descripcion: 'Balanza analítica Mettler Toledo XPR205', ubicacion: 'Lab', tipo: 'Instrumento',
  marca: 'Mettler Toledo', modelo: 'XPR205', fecha: '2026-10-01',
  versionProtocolo: '02', controlCambios: 'CC-007',
};
const ENT = { id: 'balanza', nombre: 'Balanza analítica' };

describe('IQ equipos con banco común', () => {
  let r, arch;
  const prep = async () => {
    if (r) return;
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.IQ)));
    r = await P.generar('IQ', u8, banco, DRAFT, ENT, 'ambas');
    arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
  };

  it('18 ensayos y requisitos EQ-IQ-001', async () => {
    await prep();
    expect(r.ensayos).toHaveLength(18);
    expect(r.requisitos).toBe('EQ-IQ-001');
    expect(r.ensayos).toContain('EQ-IQ-003');
    const doc = arch['word/document.xml'];
    for (const id of r.ensayos) expect(doc).toContain(id);
  });

  it('tablas del modelo presentes', async () => {
    await prep();
    const doc = arch['word/document.xml'].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(doc).toContain('Equipos/Instrumento');
    expect(doc).toContain('Descripción (SAP)');
    expect(doc).toContain('ALIMENTACIÓN ELÉCTRICA');
  });

  it('datos del borrador congelados y conclusión sin cortar', async () => {
    await prep();
    const doc = arch['word/document.xml'];
    const hs = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('').replace(/<[^>]+>/g, ' ');
    const hsFlat = hs.replace(/\s+/g, '');
    expect(hsFlat).toContain('IQ-4001234');
    expect(hsFlat).not.toContain('1/400AAAA');
    // Título genérico: solo descripción, nunca marca/modelo en el encabezado
    expect(hs).not.toContain('MARCA Mettler');
    expect(hs).not.toContain('MODELO XPR205');
    expect(hs).not.toContain('SIN MARCA NI MODELO');
    const hsRaw = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('');
    expect(hsRaw).not.toContain('>AA<');
    expect(/>\s*02\s*</.test(hsRaw)).toBe(true);
    expect(doc).toContain('BALANZA ANALÍTICA METTLER TOLEDO XPR205');
    expect(doc).toContain('cantSplit');
    expect(doc).toContain('Creación por control de cambios #CC-007');
  });
});

describe('OQ lecho fluido (banco por familia)', () => {
  const DRAFT_LF = {
    codigo: '400678', descripcion: 'Lecho fluido', ubicacion: 'PRODUCCION PLANTA 3',
    tipo: 'Equipo', marca: 'COMASA', modelo: '430L', fecha: '2026-10-02',
  };
  const ENT_LF = { id: 'lecho-fluido', nombre: 'Lecho fluido' };
  const genOQ = async (ent) => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.OQ)));
    const r = await P.generar('OQ', u8, banco, DRAFT_LF, ent, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return { r, doc: arch['word/document.xml'] };
  };

  it('banco OQ: 11 ensayos de la familia lecho-fluido, IDs únicos', () => {
    const ids = (banco.fases.OQ || [])
      .filter((i) => i.id && i.familia === 'lecho-fluido').map((i) => i.id);
    expect(ids).toHaveLength(13); // 11 ensayos + RES + REF
    expect(new Set(ids).size).toBe(13);
    expect(ids.filter((id) => /^EQ-OQ-LF-00[1-9]$|^EQ-OQ-LF-01[01]$/.test(id))).toHaveLength(11);
  });

  it('lecho-fluido genera sus 11 ensayos + el común, con títulos y códigos', async () => {
    const { r, doc } = await genOQ(ENT_LF);
    expect(r.ensayos).toHaveLength(12); // 11 familia + EQ-OQ-COM-001
    expect(r.ensayos[0]).toBe('EQ-OQ-COM-001');
    expect(r.ensayos[1]).toBe('EQ-OQ-LF-001');
    for (const id of r.ensayos) expect(doc).toContain(id);
    const txt = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(txt).toContain('PARADA DE EMERGENCIA');
    expect(txt).toContain('GASKET INFLABLE');
  });

  it('otra familia recibe solo el común hasta tener banco propio', async () => {
    const { r, doc } = await genOQ({ id: 'balanza', nombre: 'Balanza' });
    expect(r.ensayos).toEqual(['EQ-OQ-COM-001']);
    expect(doc).not.toContain('EQ-OQ-LF-001');
    expect(doc).not.toContain('EQ-OQ-AU-001');
  });
});

describe('OQ autoclave (banco por familia)', () => {
  const DRAFT_AU = {
    codigo: '400500', descripcion: 'Autoclave', ubicacion: 'PRODUCCION PLANTA 3',
    tipo: 'Equipo', marca: 'COMASA', modelo: '430L', fecha: '2026-10-03',
  };
  const ENT_AU = { id: 'autoclave', nombre: 'Autoclave' };
  const genOQ = async (ent) => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.OQ)));
    const r = await P.generar('OQ', u8, banco, DRAFT_AU, ent, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return { r, doc: arch['word/document.xml'] };
  };

  it('banco OQ autoclave: 18 ensayos, IDs únicos', () => {
    const ids = (banco.fases.OQ || [])
      .filter((i) => i.id && i.familia === 'autoclave').map((i) => i.id);
    expect(ids.filter((id) => /^EQ-OQ-AU-0\d\d$/.test(id) && !/RES|REF/.test(id))).toHaveLength(18);
    const todos = ['DQ', 'IQ', 'OQ', 'PQ'].flatMap((f) => (banco.fases[f] || []).filter((i) => i.id).map((i) => i.id));
    expect(new Set(todos).size).toBe(todos.length);
  });

  it('autoclave genera sus 18 ensayos + el común; lecho fluido no se mezcla', async () => {
    const { r, doc } = await genOQ(ENT_AU);
    expect(r.ensayos).toHaveLength(19); // 18 familia + EQ-OQ-COM-001
    expect(r.ensayos[0]).toBe('EQ-OQ-COM-001');
    expect(r.ensayos[1]).toBe('EQ-OQ-AU-001');
    for (const id of r.ensayos) expect(doc).toContain(id);
    const txt = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(txt).toContain('BOWIE-DICK');
    expect(txt).not.toContain('GASKET INFLABLE');
    expect(txt).not.toContain('LECHO FLUIDO');
  });

  it('lecho fluido no recibe ensayos de autoclave', async () => {
    const { r, doc } = await genOQ({ id: 'lecho-fluido', nombre: 'Lecho fluido' });
    expect(r.ensayos.every((id) => !id.includes('-AU-'))).toBe(true);
    expect(doc).not.toContain('EQ-OQ-AU-001');
  });
});

describe('PQ lecho fluido (banco por familia)', () => {
  const DRAFT_PQ = {
    codigo: '400678', descripcion: 'Lecho fluido', ubicacion: 'PRODUCCION PLANTA 3',
    tipo: 'Equipo', marca: 'COMASA', modelo: '430L', fecha: '2026-10-03',
  };
  const genPQ = async (ent) => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r = await P.generar('PQ', u8, banco, DRAFT_PQ, ent, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return { r, doc: arch['word/document.xml'] };
  };

  it('banco PQ: 16 ensayos lecho fluido + RES + REF, IDs únicos', () => {
    const ids = (banco.fases.PQ || [])
      .filter((i) => i.id && i.familia === 'lecho-fluido').map((i) => i.id);
    expect(ids).toHaveLength(18);
    expect(ids.filter((id) => /^EQ-PQ-LF-0\d\d$/.test(id))).toHaveLength(16);
  });

  it('lecho fluido genera sus 16 ensayos con contenido PQ', async () => {
    const { r, doc } = await genPQ({ id: 'lecho-fluido', nombre: 'Lecho fluido' });
    expect(r.ensayos).toHaveLength(16);
    expect(r.ensayos[0]).toBe('EQ-PQ-LF-001');
    for (const id of r.ensayos) expect(doc).toContain(id);
    const txt = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(txt).toContain('TRES LOTES CONSECUTIVOS');
    expect(txt).toContain('HUMEDAD RESIDUAL');
  });

  it('autoclave no recibe ensayos PQ de lecho fluido', async () => {
    const { r, doc } = await genPQ({ id: 'autoclave', nombre: 'Autoclave' });
    expect(r.ensayos).toHaveLength(0);
    expect(doc).not.toContain('EQ-PQ-LF-001');
  });
});

describe('data-analisis: paso + entregable estadístico en cada marcado', () => {
  const texto = (secs) => (secs || []).map((s) => (s.html || '').replace(/<[^>]+>/g, ' ')).join(' ');
  it('todo artículo con analisis trae el paso y el entregable', () => {
    const marcados = ['DQ', 'IQ', 'OQ', 'PQ']
      .flatMap((f) => banco.fases[f].filter((i) => i.analisis));
    expect(marcados.length).toBeGreaterThanOrEqual(17);
    for (const a of marcados) {
      const t = texto(a.secciones);
      expect(t).toContain('módulo de análisis estadístico');
      expect(t).toContain('Data cruda y reporte estadístico');
    }
  });
});
