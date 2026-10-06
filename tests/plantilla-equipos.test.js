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

  it('lecho fluido genera sus 16 ensayos + el común, con contenido PQ', async () => {
    const { r, doc } = await genPQ({ id: 'lecho-fluido', nombre: 'Lecho fluido' });
    expect(r.ensayos).toHaveLength(17); // 16 familia + EQ-PQ-COM-001
    expect(r.ensayos[0]).toBe('EQ-PQ-COM-001');
    expect(r.ensayos[1]).toBe('EQ-PQ-LF-001');
    for (const id of r.ensayos) expect(doc).toContain(id);
    const txt = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(txt).toContain('TRES LOTES CONSECUTIVOS');
    expect(txt).toContain('HUMEDAD RESIDUAL');
  });

  it('autoclave no mezcla ensayos PQ de lecho fluido', async () => {
    const { r, doc } = await genPQ({ id: 'autoclave', nombre: 'Autoclave' });
    expect(r.ensayos.every((id) => !id.includes('-LF-'))).toBe(true);
    expect(doc).not.toContain('EQ-PQ-LF-001');
  });
});

describe('PQ autoclave (banco por familia, fuente ENSAYOS.txt)', () => {
  const DRAFT_AU = {
    codigo: '400500', descripcion: 'Autoclave', ubicacion: 'PLANTA 3',
    tipo: 'Equipo', marca: 'COMASA', modelo: '430L', fecha: '2026-10-03',
  };
  const genPQ = async (ent) => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r = await P.generar('PQ', u8, banco, DRAFT_AU, ent, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return { r, doc: arch['word/document.xml'] };
  };

  it('banco PQ autoclave: 17 ensayos + RES + REF, 10 con analisis', () => {
    const ids = (banco.fases.PQ || [])
      .filter((i) => i.id && i.familia === 'autoclave').map((i) => i.id);
    expect(ids).toHaveLength(19);
    const an = (banco.fases.PQ || []).filter((i) => i.familia === 'autoclave' && i.analisis).map((i) => i.id);
    expect(an.sort()).toEqual(['EQ-PQ-AU-001', 'EQ-PQ-AU-002', 'EQ-PQ-AU-004', 'EQ-PQ-AU-005', 'EQ-PQ-AU-008', 'EQ-PQ-AU-009', 'EQ-PQ-AU-010', 'EQ-PQ-AU-011', 'EQ-PQ-AU-013', 'EQ-PQ-AU-014']);
  });

  it('autoclave genera sus 17 ensayos + el común, con contenido PQ', async () => {
    const { r, doc } = await genPQ({ id: 'autoclave', nombre: 'Autoclave' });
    expect(r.ensayos).toHaveLength(18); // 17 familia + EQ-PQ-COM-001
    expect(r.ensayos[0]).toBe('EQ-PQ-COM-001');
    expect(r.ensayos[1]).toBe('EQ-PQ-AU-001');
    for (const id of r.ensayos) expect(doc).toContain(id);
    const txt = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(txt).toContain('PUNTO FR');
    expect(txt).toContain('BOWIE-DICK');
    expect(txt).not.toContain('LECHO FLUIDO');
  });

  it('lecho fluido no recibe ensayos PQ de autoclave', async () => {
    const { r, doc } = await genPQ({ id: 'lecho-fluido', nombre: 'Lecho fluido' });
    expect(r.ensayos.every((id) => !id.includes('-AU-'))).toBe(true);
    expect(doc).not.toContain('EQ-PQ-AU-001');
  });
});

describe('PQ mezclador (banco por familia, fuente ENSAYOS.txt)', () => {
  const DRAFT_MZ = {
    codigo: '400700', descripcion: 'Mezclador V', ubicacion: 'PLANTA 3',
    tipo: 'Equipo', marca: 'COMASA', modelo: 'V-500', fecha: '2026-10-04',
  };
  const genPQ = async (ent) => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r = await P.generar('PQ', u8, banco, DRAFT_MZ, ent, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return { r, doc: arch['word/document.xml'] };
  };

  it('banco PQ mezclador: 14 ensayos + RES + REF, 13 con analisis', () => {
    const ids = (banco.fases.PQ || [])
      .filter((i) => i.id && i.familia === 'mezclador').map((i) => i.id);
    expect(ids).toHaveLength(16);
    expect(ids.filter((id) => /^EQ-PQ-MZ-\d+$/.test(id) && !/RES|REF/.test(id))).toHaveLength(14);
    const an = (banco.fases.PQ || []).filter((i) => i.familia === 'mezclador' && i.analisis).map((i) => i.id);
    expect(an).toHaveLength(13);
  });

  it('mezclador genera 14 + común, con uniformidad y sin mezcla', async () => {
    const { r, doc } = await genPQ({ id: 'mezclador', nombre: 'Mezclador V' });
    expect(r.ensayos).toHaveLength(15); // 14 familia + EQ-PQ-COM-001
    expect(r.ensayos[0]).toBe('EQ-PQ-COM-001');
    expect(r.ensayos[1]).toBe('EQ-PQ-MZ-001');
    for (const id of r.ensayos) expect(doc).toContain(id);
    const txt = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(txt).toContain('TIEMPO DE MEZCLA');
    expect(txt).not.toContain('BOWIE-DICK');
    expect(txt).not.toContain('LECHO FLUIDO');
  });

  it('autoclave no recibe ensayos PQ de mezclador', async () => {
    const { r, doc } = await genPQ({ id: 'autoclave', nombre: 'Autoclave' });
    expect(r.ensayos.every((id) => !id.includes('-MZ-'))).toBe(true);
    expect(doc).not.toContain('EQ-PQ-MZ-001');
  });
});

describe('OQ mezclador (banco por familia, fuente ENSAYOS.txt)', () => {
  const DRAFT_MZ = {
    codigo: '400700', descripcion: 'Mezclador V', ubicacion: 'PLANTA 3',
    tipo: 'Equipo', marca: 'COMASA', modelo: 'V-500', fecha: '2026-10-04',
  };
  const genOQ = async (ent) => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.OQ)));
    const r = await P.generar('OQ', u8, banco, DRAFT_MZ, ent, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return { r, doc: arch['word/document.xml'] };
  };

  it('banco OQ mezclador: 13 ensayos + RES + REF, 3 con analisis', () => {
    const ids = (banco.fases.OQ || [])
      .filter((i) => i.id && i.familia === 'mezclador').map((i) => i.id);
    expect(ids).toHaveLength(15);
    expect(ids.filter((id) => /^EQ-OQ-MZ-0\d\d$/.test(id))).toHaveLength(13);
    const an = (banco.fases.OQ || []).filter((i) => i.familia === 'mezclador' && i.analisis).map((i) => i.id);
    expect(an.sort()).toEqual(['EQ-OQ-MZ-006', 'EQ-OQ-MZ-007', 'EQ-OQ-MZ-010']);
  });

  it('mezclador genera 13 + común, con uniformidad y sin mezcla', async () => {
    const { r, doc } = await genOQ({ id: 'mezclador', nombre: 'Mezclador V' });
    expect(r.ensayos).toHaveLength(14); // 13 familia + EQ-OQ-COM-001
    expect(r.ensayos[0]).toBe('EQ-OQ-COM-001');
    expect(r.ensayos[1]).toBe('EQ-OQ-MZ-001');
    for (const id of r.ensayos) expect(doc).toContain(id);
    const txt = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(txt).toContain('UNIFORMIDAD DE MEZCLA');
    expect(txt).not.toContain('BOWIE-DICK');
    expect(txt).not.toContain('LECHO FLUIDO');
  });

  it('lecho fluido no recibe ensayos de mezclador', async () => {
    const { r, doc } = await genOQ({ id: 'lecho-fluido', nombre: 'Lecho fluido' });
    expect(r.ensayos.every((id) => !id.includes('-MZ-'))).toBe(true);
    expect(doc).not.toContain('EQ-OQ-MZ-001');
  });
});

describe('OQ horno de secado (banco por familia, fuente ENSAYOS.txt)', () => {
  const DRAFT_HO = {
    codigo: '400800', descripcion: 'Horno de secado', ubicacion: 'PLANTA 3',
    tipo: 'Equipo', marca: 'COMASA', modelo: 'H-200', fecha: '2026-10-06',
  };
  const genOQ = async (ent) => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.OQ)));
    const r = await P.generar('OQ', u8, banco, DRAFT_HO, ent, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return { r, doc: arch['word/document.xml'] };
  };

  it('banco OQ horno: 16 ensayos + RES + REF, 11 con analisis', () => {
    const ids = (banco.fases.OQ || [])
      .filter((i) => i.id && i.familia === 'horno-secado').map((i) => i.id);
    expect(ids).toHaveLength(18);
    expect(ids.filter((id) => /^EQ-OQ-HO-\d+$/.test(id))).toHaveLength(16);
    const an = (banco.fases.OQ || []).filter((i) => i.familia === 'horno-secado' && i.analisis).map((i) => i.id);
    expect(an).toHaveLength(11);
  });

  it('horno genera 16 + común, con mapeo y sin mezcla', async () => {
    const { r, doc } = await genOQ({ id: 'horno-secado', nombre: 'Horno de secado' });
    expect(r.ensayos).toHaveLength(17); // 16 familia + EQ-OQ-COM-001
    expect(r.ensayos[0]).toBe('EQ-OQ-COM-001');
    expect(r.ensayos[1]).toBe('EQ-OQ-HO-001');
    for (const id of r.ensayos) expect(doc).toContain(id);
    const txt = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(txt).toContain('SOBRETEMPERATURA');
    expect(txt).not.toContain('BOWIE-DICK');
    expect(txt).not.toContain('LECHO FLUIDO');
  });

  it('autoclave no recibe ensayos de horno', async () => {
    const { r, doc } = await genOQ({ id: 'autoclave', nombre: 'Autoclave' });
    expect(r.ensayos.every((id) => !id.includes('-HO-'))).toBe(true);
    expect(doc).not.toContain('EQ-OQ-HO-001');
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

describe('puntosTabla: analisis → tabla de recolección vacía', () => {
  const genPQ = async () => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r = await P.generar('PQ', u8, banco,
      { codigo: '400678', descripcion: 'Lecho fluido', fecha: '2026-10-03' },
      { id: 'lecho-fluido', nombre: 'Lecho fluido' }, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return arch['word/document.xml'];
  };
  const celdasFila = (tr) => [...tr.matchAll(/<w:tc\b[\s\S]*?<\/w:tc>/g)]
    .map((m) => m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

  test('unitario: con analisis devuelve blancos del mismo largo', () => {
    const e = { procedimiento: [{ nivel: 0, t: 'a' }, { nivel: 0, t: 'b' }], criterios: [] };
    expect(P._interno.puntosTabla({ id: 'X', analisis: 'si' }, e)).toEqual(['', '']);
    expect(P._interno.puntosTabla({ id: 'X' }, e)).toEqual(['a', 'b']);
  });

  test('en docx: tabla de ensayo con analisis sale vacía; sin analisis repite procedimiento', async () => {
    const xml = await genPQ();
    const tbls = [...xml.matchAll(/<w:tbl\b[\s\S]*?<\/w:tbl>/g)].map((m) => m[0]);
    // solo tablas de verificación (caption Tabla 7.N-1): el TOC también lista títulos
    const porTitulo = (t) => tbls.find((x) => {
      const s = x.replace(/<[^>]+>/g, ' ');
      return /Tabla 7\.\d+-1/.test(s) && s.includes(t) && !x.includes('CONCLUSI');
    });
    // EQ-PQ-LF-005 curva de secado (con analisis): celdas de datos vacías
    // (el encabezado lleva el título con ID en caso original)
    const tv = porTitulo('Curva de secado');
    expect(tv).toBeTruthy();
    const filasV = [...tv.matchAll(/<w:tr\b[\s\S]*?<\/w:tr>/g)].map((m) => m[0]);
    expect(filasV.length).toBeGreaterThan(2);
    for (const tr of filasV.slice(2)) {
      const c = celdasFila(tr);
      expect(c.length).toBeGreaterThanOrEqual(2);
      expect(c[1]).toBe('');
    }
    // EQ-PQ-LF-001 tres lotes (sin analisis): repite el procedimiento
    const tn = porTitulo('Tres lotes consecutivos');
    expect(tn).toBeTruthy();
    expect(tn.replace(/<[^>]+>/g, ' ')).toContain('lotes consecutivos');
  });
});

describe('Objetivo en su propia línea (requisitos del modelo)', () => {
  test('IQ equipos: objetivo de requisitos previos dividido', async () => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.IQ)));
    const r = await P.generar('IQ', u8, banco, DRAFT,
      { id: 'balanza', nombre: 'Balanza' }, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    const xml = arch['word/document.xml'];
    const paras = [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)]
      .map((m) => m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ :/g, ':').trim());
    // etiqueta exacta presente y texto de requisitos fuera de ella
    expect(paras).toContain('Objetivo:');
    const art = banco.fases.IQ.find((i) => /requisitos previos/i.test(i.titulo || ''));
    const plano = art.secciones.find((s) => /^objetivo/i.test(s.et || '')).html
      .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().replace(/^Objetivo:\s*/i, '');
    const holder = paras.find((t) => t.includes(plano.slice(0, 30)));
    expect(holder).toBeTruthy();
    expect(holder.startsWith('Objetivo:')).toBe(false);
  });
});
