// Pruebas del generador IQ/OQ/PQ basado en plantillas (vitest).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { resolve } from 'path';
import { cargarBanco } from '../scripts/cargar-banco.mjs';

const require = createRequire(import.meta.url);
const raiz = resolve(new URL('..', import.meta.url).pathname).replace(/^\/@fs/, '');
const P = require('../js/core/plantilla-docx.js');
const banco = cargarBanco(process.env.BANCO || resolve(raiz, 'js/core/banco-almacenes-data.js'));
const dec = (u8) => new TextDecoder().decode(u8);

const DRAFT = {
  codigo: 'CF-01', descripcion: 'Cuarto frío principal', ubicacion: 'Edificio A', tipo: 'Cuarto frío',
  temperaturaMin: '2', temperaturaMax: '8', fecha: '2026-09-30',
  duracionEstudio: '72 h', intervaloRegistro: '5 min', cantidadDataLoggers: '9',
};
const ENT = { id: 'cf-01', nombre: 'Cuarto frío' };
const pasa = (c, f) => f === 'ambas' || !c || c === 'ambas' || c === f;

describe.each(['IQ', 'OQ', 'PQ'])('%s con formato del modelo', (fase) => {
  const cond = fase === 'PQ' ? 'dina' : 'ambas';
  let r, arch;
  const prep = async () => {
    if (r) return;
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS[fase])));
    r = await P.generar(fase, u8, banco, DRAFT, ENT, cond);
    arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
  };

  it('incluye todos los ensayos del banco (bloques 2-3, filtrados por condición)', async () => {
    await prep();
    const esperados = (banco.fases[fase] || [])
      .filter((i) => i.kind === 'ensayo' && i.id && (i.bloque === 2 || i.bloque === 3) && pasa(i.cond, cond)
        && !/requisitos previos/i.test(i.titulo || ''))
      .map((i) => i.id);
    expect(r.ensayos).toEqual(esperados);
    for (const id of esperados) expect(arch['word/document.xml']).toContain(id);
  });

  it('una tabla de conclusión por ensayo + resumen', async () => {
    await prep();
    expect(r.conclusiones).toBeGreaterThanOrEqual(r.ensayos.length);
  });

  it('encabezado y portada completos, sin marcadores ni HTML', async () => {
    await prep();
    const hs = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('');
    expect(hs).not.toContain('400AAAA');
    expect(hs).not.toContain('DD/MMM/AAAA');
    expect(hs).toContain('30/SEP/2026');
    const doc = arch['word/document.xml'];
    expect(doc).not.toContain('NOMBRE DEL EQUIPO');
    expect(doc).not.toMatch(/&lt;\/?(span|strong|br|li|ul)\b/);
  });

  it('ids de marcadores únicos', async () => {
    await prep();
    const ids = [...arch['word/document.xml'].matchAll(/<w:bookmarkStart[^>]*w:id="(\d+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('ajustes del usuario: firmas, encabezado, control de cambios', () => {
  const D2 = { ...DRAFT, codigo: '1000625', controlCambios: 'CC-042', versionProtocolo: '02' };
  let r, arch;
  const prep = async () => {
    if (r) return;
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    r = await P.generar('PQ', u8, banco, D2, ENT, 'ambas');
    arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
  };

  it('encabezado: PQ-1000625 sin el 1/ del medio', async () => {
    await prep();
    const hs = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('');
    const txt = hs.replace(/<[^>]+>/g, '');
    expect(txt).toContain('PQ-1000625');
    expect(txt).not.toContain('1/400AAAA');
    expect(txt).not.toContain('400AAAA');
  });

  it('historial: control de cambios en la última página', async () => {
    await prep();
    expect(arch['word/document.xml']).toContain('Creación por control de cambios #CC-042');
  });

  it('versión del grid en cajetín y en historial', async () => {
    await prep();
    const hs = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('');
    expect(hs).toContain('>02<');
    expect(hs).not.toContain('>AA<');
    // la versión no debe romper el marcador de fecha (regresión DD/MMM/02AA)
    expect(hs).toContain('30/SEP/2026');
    expect(hs).not.toContain('02AA');
    const doc = arch['word/document.xml'];
    const iH = doc.indexOf('HISTORIAL DE CAMBIOS');
    expect(doc.slice(iH, iH + 8000)).toContain('>02<');
    // el historial conserva mayúsculas/minúsculas originales
    expect(doc.slice(iH, iH + 8000)).toContain('30/Sep/2026');
  });

  it('historial sin número: conserva texto del modelo', async () => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r0 = await P.generar('PQ', u8, banco, DRAFT, ENT, 'ambas');
    const a0 = Object.fromEntries((await P._interno.leerZip(r0.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    expect(a0['word/document.xml']).toContain('Creación del documento por solicitud');
    expect(a0['word/document.xml']).not.toContain('control de cambios #');
  });

  it('firmas en Tahoma 11 blindado (nada en 12)', async () => {
    await prep();
    const xml = arch['word/document.xml'];
    const seg = xml.slice(xml.indexOf('FIRMA DE APROBACIÓN'), xml.indexOf('TABLA DE CONTENIDO'));
    expect(seg.length).toBeGreaterThan(1000);
    expect(seg).not.toContain('w:val="24"');
    expect(seg).toContain('w:val="22"');
    expect(arch['word/styles.xml']).not.toMatch(/<w:docDefaults>[\s\S]*?w:val="24"/);
  });
});

describe('firmantes T0/T2 dinámicos, T1/T3 fijos, header negro', () => {
  const DF = {
    ...DRAFT,
    codigo: '1000625', fecha: '2026-09-30',
    firmantes: {
      realizado: { username: 'jperez', nombre: 'Juan Pérez', cargo: 'Analista de Validaciones' },
      revisor: { username: 'gomez', nombre: 'Ana Gómez', area: 'Calidad', puesto: 'Gerente de Calidad' },
    },
  };
  let r, arch;
  const prep = async () => {
    if (r) return;
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    r = await P.generar('PQ', u8, banco, DF, ENT, 'ambas');
    arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
  };

  it('T0 con realizado y T2 con revisor; T1/T3 intactos', async () => {
    await prep();
    const doc = arch['word/document.xml'];
    expect(doc).toContain('Juan Pérez / (Analista de Validaciones)');
    expect(doc).toContain('Ana Gómez / (Gerente de Calidad)');
    expect(doc).toContain('Martin Agüero');
    expect(doc).toContain('Noemí Terrero');
    expect(doc).not.toContain('Nombre Personal');
    // nombres reales en negro (no rojo de pendiente)
    const iJ = doc.indexOf('Juan Pérez');
    expect(doc.slice(Math.max(0, iJ - 1500), iJ + 500)).not.toContain('FF0000');
    const iA = doc.indexOf('Ana Gómez');
    expect(doc.slice(Math.max(0, iA - 1500), iA + 500)).not.toContain('FF0000');
    // la celda queda con UN solo párrafo (sin restos del modelo)
    expect(doc).not.toContain('Analista Validaciones )');
    expect(doc).not.toContain('Gerente de Área)');
  });

  it('encabezado 100% negro', async () => {
    await prep();
    const hs = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('');
    expect(hs).not.toContain('FF0000');
  });
});

describe('responsabilidad del gerente dinámica (T2)', () => {
  const DG = {
    ...DRAFT, codigo: '1000625', fecha: '2026-09-30',
    firmantes: { revisor: { username: 'g', nombre: 'Ana Gómez', area: 'Calidad', puesto: 'Gerente de Calidad' } },
  };
  test('título con la gerencia del revisor en IQ', async () => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r = await P.generar('PQ', u8, banco, DG, ENT, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    const doc = arch['word/document.xml'].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ :/g, ':');
    expect(doc).toContain('Es Responsabilidad del Gerente de Calidad:');
    expect(doc).not.toContain('Es Responsabilidad del Gerente de Área:');
    // la gerencia va en negrita en el H2 (run bold con el puesto + ':')
    const raw = arch['word/document.xml'];
    const paras = raw.split('</w:p>');
    const segH2 = paras.find((p) => p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').includes('Es Responsabilidad del Gerente de Calidad')) || '';
    expect(segH2).toContain('Gerente de Calidad');
    expect(segH2).toContain('<w:b/>');
  });

  test('sin revisor conserva el modelo', async () => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r = await P.generar('PQ', u8, banco, DRAFT, ENT, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    const norm = arch['word/document.xml'].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(norm).toContain('Es Responsabilidad del Gerente de Área');
  });
});

describe('SALTO_PAGINA: condición de salto por ensayo', () => {
  const parasDe = (xml) => [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((m) => m[0]);
  const h2De = (xml, titulo) => {
    const limpio = String(titulo || '').replace(/^[A-Z]{2,5}-[A-Z]{2}-\d{2,4}\s*[—–-]\s*/, '').trim()
      .slice(0, 30).toUpperCase();
    return parasDe(xml).find((p) =>
      p.includes('bookmarkStart') && p.includes('_SigmaSec') &&
      p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toUpperCase().includes(limpio));
  };

  test('debeSaltar: default true, false desactiva', () => {
    expect(P._interno.debeSaltar({ id: 'XX-1' })).toBe(true);
    expect(P._interno.debeSaltar(null)).toBe(true);
    P.SALTO_PAGINA['XX-1'] = false;
    try {
      expect(P._interno.debeSaltar({ id: 'XX-1' })).toBe(false);
    } finally {
      delete P.SALTO_PAGINA['XX-1'];
    }
  });

  test('ensayo en flujo: H2 sin pageBreakBefore; resto con salto', async () => {

    const ens = (banco.fases.PQ || [])
      .filter((i) => i.kind === 'ensayo' && i.id && (i.bloque === 2 || i.bloque === 3) && pasa(i.cond, 'ambas')
        && !/requisitos previos/i.test(i.titulo || ''));
    const enFlujo = ens[1];
    const conSalto = ens[2];
    P.SALTO_PAGINA[enFlujo.id] = false;
    try {
      const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
      const r = await P.generar('PQ', u8, banco, DRAFT, ENT, 'ambas');
      const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
      const xml = arch['word/document.xml'];
      const hF = h2De(xml, enFlujo.titulo);
      const hS = h2De(xml, conSalto.titulo);
      expect(hF).toBeTruthy();
      expect(hS).toBeTruthy();
      expect(hF.slice(0, hF.indexOf('<w:r')).includes('pageBreakBefore')).toBe(false);
      expect(hS.slice(0, hS.indexOf('<w:r')).includes('pageBreakBefore')).toBe(true);
    } finally {
      delete P.SALTO_PAGINA[enFlujo.id];
    }
  });
});

describe('SALTO_H1: cada acápite numerado abre página nueva', () => {
  // Los tests aíslan la tabla del usuario (puede tener sus excepciones).
  const conTablaH1 = async (t, fn) => {
    const bak = { ...P.SALTO_H1 };
    Object.keys(P.SALTO_H1).forEach((k) => delete P.SALTO_H1[k]);
    Object.assign(P.SALTO_H1, t);
    try { return await fn(); } finally {
      Object.keys(P.SALTO_H1).forEach((k) => delete P.SALTO_H1[k]);
      Object.assign(P.SALTO_H1, bak);
    }
  };
  const h1Nums = (xml) => [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((m) => m[0])
    .map((p) => ({ p, m: /w:name="(_SigmaH1_(\d+))"/.exec(p) }))
    .filter((x) => x.m && x.p.includes('bookmarkStart'))
    .sort((a, b) => +a.m[2] - +b.m[2])
    .map((x) => ({
      texto: x.p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ :/g, ':').trim(),
      salto: x.p.split('<w:bookmarkStart')[0].includes('pageBreakBefore'),
    }));
  const genPQ = async () => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r = await P.generar('PQ', u8, banco, DRAFT, ENT, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return arch['word/document.xml'];
  };

  test('debeSaltarH1: default true, primero y excepciones', () => {
    expect(P._interno.debeSaltarH1(2)).toBe(true);
    P.SALTO_H1['3'] = false;
    try {
      expect(P._interno.debeSaltarH1(3)).toBe(false);
      expect(P._interno.debeSaltarH1('3')).toBe(false);
    } finally {
      delete P.SALTO_H1['3'];
    }
  });

  test('11 acápites: el 1.º sin salto, del 2.º al 11.º con salto', async () => {
    await conTablaH1({}, async () => {
      const h1s = h1Nums(await genPQ());
      expect(h1s.map((h) => h.texto)).toEqual([
        'FIRMA DE APROBACIÓN:', 'TABLA DE CONTENIDO:', 'OBJETIVO:', 'ALCANCE:',
        'RESPONSABILIDADES:', expect.stringContaining('DESCRIPCIÓN'),
        expect.stringContaining('PROCEDIMIENTO'), 'REGISTRO DE FIRMAS:',
        'REFERENCIAS:', 'ANEXOS:', 'HISTORIAL DE CAMBIOS:',
      ]);
      expect(h1s[0].salto).toBe(false);
      for (const h of h1s.slice(1)) expect(h.salto).toBe(true);
    });
  });

  test('excepción en tabla: acápite 3 en flujo', async () => {
    await conTablaH1({ 3: false }, async () => {
      const h1s = h1Nums(await genPQ());
      expect(h1s[2].texto).toBe('OBJETIVO:');
      expect(h1s[2].salto).toBe(false);
      expect(h1s[1].salto).toBe(true);
    });
  });
});

describe('SALTO_H2: salto configurable en H2 del modelo (6.1, 6.2, ...)', () => {
  const conTablaH2 = async (t, fn) => {
    const bak = { ...P.SALTO_H2 };
    Object.keys(P.SALTO_H2).forEach((k) => delete P.SALTO_H2[k]);
    Object.assign(P.SALTO_H2, t);
    try { return await fn(); } finally {
      Object.keys(P.SALTO_H2).forEach((k) => delete P.SALTO_H2[k]);
      Object.assign(P.SALTO_H2, bak);
    }
  };
  const h2Modelo = (xml, bm) => [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((m) => m[0])
    .find((p) => p.includes('bookmarkStart') && p.includes('w:name="' + bm + '"'));
  const conSalto = (p) => p.split('<w:bookmarkStart')[0].includes('pageBreakBefore');
  const genPQ = async () => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r = await P.generar('PQ', u8, banco, DRAFT, ENT, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return arch['word/document.xml'];
  };

  test('debeSaltarH2: default false (en flujo), true activa', async () => {
    await conTablaH2({}, async () => {
      expect(P._interno.debeSaltarH2('6.2')).toBe(false);
      expect(P._interno.debeSaltarH2(null)).toBe(false);
    });
    await conTablaH2({ '6.2': true }, async () => {
      expect(P._interno.debeSaltarH2('6.2')).toBe(true);
      expect(P._interno.debeSaltarH2(6.2)).toBe(true);
    });
  });

  test('default: 6.1 y 6.2 en flujo', async () => {
    await conTablaH2({}, async () => {
      const xml = await genPQ();
      expect(conSalto(h2Modelo(xml, '_SigmaH2_6_1'))).toBe(false);
      expect(conSalto(h2Modelo(xml, '_SigmaH2_6_2'))).toBe(false);
    });
  });

  test("'6.2': true -> solo 6.2 abre página; ensayos del banco intactos", async () => {
    await conTablaH2({ '6.2': true }, async () => {
      const xml = await genPQ();
      expect(conSalto(h2Modelo(xml, '_SigmaH2_6_1'))).toBe(false);
      expect(conSalto(h2Modelo(xml, '_SigmaH2_6_2'))).toBe(true);
      // guard: un ensayo del banco conserva su salto (SALTO_PAGINA manda;
      // se excluyen USP/requisitos, que van en flujo por diseño)
      const hEns = [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((m) => m[0])
        .find((p) => p.includes('bookmarkStart') && /w:name="_SigmaSec\d+_\d+"/.test(p)
          && !/DEFINICI[ÓO]N USP|REQUISITOS PREVIO/.test(p.replace(/<[^>]+>/g, ' ')));
      expect(hEns).toBeTruthy();
      expect(conSalto(hEns)).toBe(true);
    });
  });
});

describe('SALTO_TABLA: salto previo en conclusiones (prueba inicial)', () => {
  const conTabla = async (t, fn) => {
    const bak = { ...P.SALTO_TABLA };
    Object.keys(P.SALTO_TABLA).forEach((k) => delete P.SALTO_TABLA[k]);
    Object.assign(P.SALTO_TABLA, t);
    try { return await fn(); } finally {
      Object.keys(P.SALTO_TABLA).forEach((k) => delete P.SALTO_TABLA[k]);
      Object.assign(P.SALTO_TABLA, bak);
    }
  };
  const genPQ = async () => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r = await P.generar('PQ', u8, banco, DRAFT, ENT, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return arch['word/document.xml'];
  };
  // tablas de conclusión: las que contienen 'CONCLUSIÓN DE LA PRUEBA' (con su posición)
  const conclusiones = (xml) => [...xml.matchAll(/<w:tbl\b[\s\S]*?<\/w:tbl>/g)]
    .filter((m) => m[0].includes('CONCLUSI'));
  const previaConSalto = (xml, m) => {
    const previo = [...xml.slice(0, m.index).matchAll(/<w:p\b[\s\S]*?<\/w:p>|<w:tbl\b[\s\S]*?<\/w:tbl>/g)].pop();
    return previo && previo[0].startsWith('<w:p') && previo[0].includes('pageBreakBefore');
  };

  test('debeSaltarTabla: default false; específica gana al comodín', async () => {
    await conTabla({}, async () => {
      expect(P._interno.debeSaltarTabla('ALM-PQ-003', 'conclusion')).toBe(false);
    });
    await conTabla({ '*:conclusion': true }, async () => {
      expect(P._interno.debeSaltarTabla('ALM-PQ-003', 'conclusion')).toBe(true);
      expect(P._interno.debeSaltarTabla('ALM-PQ-003', 'verificacion')).toBe(false);
    });
    await conTabla({ '*:conclusion': true, 'ALM-PQ-003:conclusion': false }, async () => {
      expect(P._interno.debeSaltarTabla('ALM-PQ-003', 'conclusion')).toBe(false);
      expect(P._interno.debeSaltarTabla('ALM-PQ-004', 'conclusion')).toBe(true);
    });
  });

  test('default: ninguna conclusión con salto previo', async () => {
    await conTabla({}, async () => {
      const xml = await genPQ();
      const conc = conclusiones(xml);
      expect(conc.length).toBeGreaterThan(0);
      for (const t of conc) expect(previaConSalto(xml, t)).toBe(false);
    });
  });

  test("'* :conclusion': toda conclusión abre página nueva", async () => {
    await conTabla({ '*:conclusion': true }, async () => {
      const xml = await genPQ();
      const conc = conclusiones(xml);
      expect(conc.length).toBeGreaterThan(0);
      for (const t of conc) expect(previaConSalto(xml, t)).toBe(true);
    });
  });
});

describe('Objetivo en su propia línea (etiqueta sola + texto debajo)', () => {
  const parasDe = (xml) => [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((m) => m[0]);
  const texto = (p) => p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ :/g, ':').trim();
  const genPQ = async () => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r = await P.generar('PQ', u8, banco, DRAFT, ENT, 'ambas');
    const arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    return { r, xml: arch['word/document.xml'] };
  };

  test('cada ensayo del banco: etiqueta sola + texto en el párrafo siguiente', async () => {
    const { r, xml } = await genPQ();
    const paras = parasDe(xml).map(texto);
    // etiquetas exactas: una por ensayo del banco
    expect(paras.filter((t) => t === 'Objetivo:')).toHaveLength(r.ensayos.length);
    // el texto del objetivo de cada ensayo NO comparte párrafo con la etiqueta
    for (const id of r.ensayos) {
      const art = banco.fases.PQ.find((i) => i.id === id);
      const obj = art.secciones.find((s) => /^objetivo/i.test(s.et || ''));
      const plano = obj.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        .replace(/^Objetivo:\s*/i, '');
      const holder = paras.find((t) => t.includes(plano.slice(0, 30)));
      expect(holder).toBeTruthy();
      expect(holder.startsWith('Objetivo:')).toBe(false);
    }
  });
});
