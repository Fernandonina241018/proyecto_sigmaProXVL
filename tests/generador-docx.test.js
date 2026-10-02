// Generador .docx de Almacenes: extractor + modelo + render (lib docx local).
import { describe, test, expect, beforeAll } from 'vitest';
import { createRequire } from 'module';
import GeneradorDocx from '../js/core/generador-docx.js';

const require = createRequire(import.meta.url);
beforeAll(() => {
  globalThis.docx = require('docx');
});

const DRAFT = {
  codigo: 'CF-01', descripcion: 'Cuarto frío principal', ubicacion: 'Edificio A',
  tipo: 'Cuarto frío', temperaturaMin: '2', temperaturaMax: '8',
  humedadMin: '', humedadMax: '', responsable: 'J. Pérez', fecha: '2026-09-29',
  tipoCalificacion: 'Calificación inicial', estudio: 'Mapeo térmico',
  condicionEstudio: 'Sin carga', duracionEstudio: '72 h',
  intervaloRegistro: '5 min', cantidadDataLoggers: '12',
};
const ENT = { id: 'cuarto-frio', nombre: 'Cuarto frío (2–8 °C)' };

describe('banco extraído', () => {
  test('43 artículos con IDs únicos y bloques válidos', () => {
    const B = GeneradorDocx.banco();
    const arts = ['DQ', 'IQ', 'OQ', 'PQ'].flatMap((f) => B.fases[f].filter((i) => i.id));
    expect(arts).toHaveLength(43);
    expect(new Set(arts.map((a) => a.id)).size).toBe(43);
    for (const a of arts) {
      expect(a.bloque).toBeGreaterThanOrEqual(1);
      expect(a.bloque).toBeLessThanOrEqual(8);
    }
  });

  test('conteos por fase: DQ 5 · IQ 16 · OQ 12 · PQ 10', () => {
    expect(GeneradorDocx.contarEnsayos('DQ', 'ambas')).toBe(5);
    expect(GeneradorDocx.contarEnsayos('IQ', 'ambas')).toBe(16);
    expect(GeneradorDocx.contarEnsayos('OQ', 'ambas')).toBe(12);
    expect(GeneradorDocx.contarEnsayos('PQ', 'ambas')).toBe(10);
  });
});

describe('filtros y marcas', () => {
  test('pasaCondicion: ambas incluye todo', () => {
    expect(GeneradorDocx.pasaCondicion('est', 'ambas')).toBe(true);
    expect(GeneradorDocx.pasaCondicion('dina', 'dina')).toBe(true);
    expect(GeneradorDocx.pasaCondicion('est', 'dina')).toBe(false);
    expect(GeneradorDocx.pasaCondicion('ambas', 'est')).toBe(true);
  });

  test('rangoTexto arma rango del borrador', () => {
    expect(GeneradorDocx.rangoTexto(DRAFT)).toBe('2–8 °C');
    expect(GeneradorDocx.rangoTexto({ ...DRAFT, humedadMin: '10', humedadMax: '60' }))
      .toBe('2–8 °C / HR 10–60 %');
  });

  test('alcanceTexto congela datos de la entidad', () => {
    const a = GeneradorDocx.alcanceTexto(DRAFT, ENT);
    expect(a).toContain('Cuarto frío principal');
    expect(a).toContain('CF-01');
    expect(a).toContain('Edificio A');
    expect(a).toContain('Laboratorios Sued');
  });

  test('congelarMarcas elimina spans dinámicos', () => {
    const ctx = { entidad: 'CF', rango: 'R', cond: 'C', listaResumen: 'L' };
    const out = GeneradorDocx.congelarMarcas(
      'del <span class="equipo">almacén</span> rango <span class="rango">x</span> ' +
      'cond <span class="cond">y</span> lista <span class="lista-resumen" data-fase-lista="DQ"></span>',
      ctx
    );
    expect(out).toBe('del CF rango R cond C lista L');
    expect(out).not.toContain('class=');
  });
});

describe('modelo estilo plantilla', () => {
  test('11 secciones en el orden del modelo', () => {
    const m = GeneradorDocx.buildModelo('DQ', DRAFT, ENT, 'ambas');
    expect(m.secciones.map((s) => s.h1)).toEqual([
      'FIRMA DE APROBACIÓN:',
      'TABLA DE CONTENIDO:',
      'OBJETIVO:',
      'ALCANCE:',
      'RESPONSABILIDADES:',
      'DESCRIPCIÓN DEL EQUIPO Y REQUISITOS PREVIOS A LA CALIFICACIÓN:',
      'PROCEDIMIENTO DE CALIFICACIÓN DE DISEÑO:',
      'REGISTRO DE FIRMAS:',
      'REFERENCIAS:',
      'ANEXOS:',
      'HISTORIAL DE CAMBIOS:',
    ]);
    const proc = m.secciones.find((s) => s.h1.startsWith('PROCEDIMIENTO'));
    expect(proc.contenido.some((it) => it.t === 'h2' && it.texto === 'RESUMEN:')).toBe(true);
  });

  test('ningún texto conserva marcas sin congelar', () => {
    for (const f of ['DQ', 'IQ', 'OQ', 'PQ']) {
      const m = GeneradorDocx.buildModelo(f, DRAFT, ENT, 'ambas');
      const textos = [];
      const camina = (items) => items.forEach((it) => {
        if (it.t === 'p') textos.push(it.runs.map((r) => r.t).join(''));
        if (it.t === 'h2' || it.t === 'bul') textos.push(it.texto);
        if (it.t === 'ensayo') { textos.push(it.titulo); }
      });
      m.secciones.forEach((s) => camina(s.contenido));
      const todo = textos.join(' ');
      expect(todo).not.toContain('class="equipo"');
      expect(todo).not.toContain('class="rango"');
      expect(todo).not.toContain('lista-resumen');
    }
  });
});

describe('render docx (estructura del modelo)', () => {
  test('empaqueta un .docx válido', async () => {
    const docx = require('docx');
    const m = GeneradorDocx.buildModelo('DQ', DRAFT, ENT, 'ambas');
    const buf = await docx.Packer.toBuffer(GeneradorDocx.modeloADocx(m));
    expect(buf.length).toBeGreaterThan(8000);
  }, 30000);

  test('xml: campo TOC, Tahoma, firmas, conclusiones y saltos de página', async () => {
    const docx = require('docx');
    const { unzipXml } = await import('./helpers/unzip-xml.mjs');
    const m = GeneradorDocx.buildModelo('OQ', DRAFT, ENT, 'ambas');
    const buf = await docx.Packer.toBuffer(GeneradorDocx.modeloADocx(m));
    const xml = unzipXml(buf, 'word/document.xml');
    expect(xml).toContain('fldChar');
    expect(xml).toContain('Tahoma');
    expect(xml).toContain('0F4761');
    expect(xml).toContain('Realizado Por:');
    expect((xml.match(/CONCLUSIÓN DE LA PRUEBA/g) || []).length).toBeGreaterThanOrEqual(3);
    // 11 secciones con salto + ensayos OQ en bloque 3 (cada uno en su página)
    const saltos = (xml.match(/pageBreakBefore/g) || []).length;
    expect(saltos).toBeGreaterThanOrEqual(11 + 3);
  }, 30000);

  test('footer SUED en el documento', async () => {
    const docx = require('docx');
    const { unzipXml } = await import('./helpers/unzip-xml.mjs');
    const m = GeneradorDocx.buildModelo('DQ', DRAFT, ENT, 'ambas');
    const buf = await docx.Packer.toBuffer(GeneradorDocx.modeloADocx(m));
    const foot = unzipXml(buf, 'word/footer1.xml');
    expect(foot).toContain('PARA USO EXCLUSIVO DE LABORATORIOS SUED, S.R.L.');
  }, 30000);
});

describe('firmantes DQ dinámicos', () => {
  const DF = {
    firmantes: {
      realizado: { username: 'jp', nombre: 'Juan Pérez', cargo: 'Analista' },
      revisor: { username: 'ag', nombre: 'Ana Gómez', area: 'Calidad', puesto: 'Gerente de Calidad' },
    },
  };
  test('T0/T2 con datos, T1/T3 del modelo', () => {
    const f = GeneradorDocx.firmantesModelo(DF);
    expect(f[0]).toEqual({ t: 'Realizado Por:', nombre: 'Juan Pérez / (Analista)' });
    expect(f[1].nombre).toContain('Nombre Personal');
    expect(f[2]).toEqual({ t: 'Revisado Por:', nombre: 'Ana Gómez / (Gerente de Calidad)' });
    expect(f[3].nombre).toContain('Nombre Personal');
  });
  test('sin firmantes conserva el modelo', () => {
    const f = GeneradorDocx.firmantesModelo({});
    expect(f.every((x) => x.nombre.indexOf('Nombre Personal') >= 0)).toBe(true);
  });
});

describe('responsabilidad del gerente dinámica en DQ', () => {
  const DF = { firmantes: { revisor: { username: 'g', nombre: 'Ana', area: 'Producción', puesto: 'Gerente de Producción' } } };
  test('título con la gerencia del revisor', () => {
    const m = GeneradorDocx.buildModelo('DQ', DF, { id: 'x', nombre: 'CF' }, 'ambas');
    const h2s = [];
    m.secciones.forEach((s) => s.contenido.forEach((it) => { if (it.t === 'h2') h2s.push(it); }));
    const dyn = h2s.find((h) => (h.texto + (h.negrita || '')).indexOf('Gerente de Producción') >= 0);
    expect(dyn).toBeDefined();
    expect(dyn.texto).toBe('Es Responsabilidad del ');
    expect(dyn.negrita).toBe('Gerente de Producción:');
    expect(h2s.map((h) => h.texto + (h.negrita || ''))).not.toContain('Es Responsabilidad del Gerente de Área:');
  });
  test('sin revisor conserva el modelo', () => {
    const m = GeneradorDocx.buildModelo('DQ', {}, { id: 'x', nombre: 'CF' }, 'ambas');
    const textos = [];
    m.secciones.forEach((s) => s.contenido.forEach((it) => { if (it.t === 'h2') textos.push(it.texto); }));
    expect(textos).toContain('Es Responsabilidad del Gerente de Área:');
  });
});

describe('SALTO_PAGINA en DQ: condición de salto por ensayo', () => {
  const procEnsayos = (fase) => {
    const m = GeneradorDocx.buildModelo(fase, DRAFT, ENT, 'ambas');
    return m.secciones.find((s) => s.h1.startsWith('PROCEDIMIENTO')).contenido
      .filter((it) => it.t === 'ensayo');
  };
  const h2Num = (xml, num) => [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((x) => x[0])
    .find((p) => p.replace(/<[^>]+>/g, '').trim().startsWith(num));

  test('tabla vacía: todos los ensayos abren página', async () => {
    const docx = require('docx');
    const { unzipXml } = await import('./helpers/unzip-xml.mjs');
    const m = GeneradorDocx.buildModelo('OQ', DRAFT, ENT, 'ambas');
    const buf = await docx.Packer.toBuffer(GeneradorDocx.modeloADocx(m));
    const xml = unzipXml(buf, 'word/document.xml');
    for (const it of procEnsayos('OQ')) {
      const h = h2Num(xml, it.num);
      expect(h).toBeTruthy();
      expect(h.slice(0, h.indexOf('<w:t')).includes('pageBreakBefore')).toBe(true);
    }
  }, 30000);

  test('ensayo en flujo: su H2 sin pageBreakBefore; resto con salto', async () => {
    const docx = require('docx');
    const { unzipXml } = await import('./helpers/unzip-xml.mjs');
    const ens = procEnsayos('OQ');
    const enFlujo = ens[1];
    const conSalto = ens[0];
    GeneradorDocx.SALTO_PAGINA[enFlujo.articulo.id] = false;
    try {
      const m = GeneradorDocx.buildModelo('OQ', DRAFT, ENT, 'ambas');
      const buf = await docx.Packer.toBuffer(GeneradorDocx.modeloADocx(m));
      const xml = unzipXml(buf, 'word/document.xml');
      const hF = h2Num(xml, enFlujo.num);
      const hS = h2Num(xml, conSalto.num);
      expect(hF).toBeTruthy();
      expect(hS).toBeTruthy();
      expect(hF.slice(0, hF.indexOf('<w:t')).includes('pageBreakBefore')).toBe(false);
      expect(hS.slice(0, hS.indexOf('<w:t')).includes('pageBreakBefore')).toBe(true);
    } finally {
      delete GeneradorDocx.SALTO_PAGINA[enFlujo.articulo.id];
    }
  }, 30000);
});

describe('SALTO_H1 en DQ: cada acápite abre página nueva', () => {
  const h1sDe = async (fase) => {
    const docx = require('docx');
    const { unzipXml } = await import('./helpers/unzip-xml.mjs');
    const m = GeneradorDocx.buildModelo(fase, DRAFT, ENT, 'ambas');
    const buf = await docx.Packer.toBuffer(GeneradorDocx.modeloADocx(m));
    const xml = unzipXml(buf, 'word/document.xml');
    return [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((x) => x[0])
      .filter((p) => /Heading1/.test((/<w:pPr>[\s\S]*?<\/w:pPr>/.exec(p) || [''])[0]))
      .map((p) => ({
        texto: p.replace(/<[^>]+>/g, '').trim(),
        salto: (/<w:pPr>[\s\S]*?<\/w:pPr>/.exec(p)[0].split('<w:t')[0]).includes('pageBreakBefore'),
      }));
  };

  test('11 H1: el 1.º sin salto, resto con salto', async () => {
    const h1s = await h1sDe('DQ');
    expect(h1s).toHaveLength(11);
    expect(h1s[0].salto).toBe(false);
    for (const h of h1s.slice(1)) expect(h.salto).toBe(true);
  }, 30000);

  test('excepción en tabla: acápite 3 en flujo', async () => {
    GeneradorDocx.SALTO_H1['3'] = false;
    try {
      const h1s = await h1sDe('DQ');
      expect(h1s[2].texto).toBe('OBJETIVO:');
      expect(h1s[2].salto).toBe(false);
      expect(h1s[1].salto).toBe(true);
    } finally {
      delete GeneradorDocx.SALTO_H1['3'];
    }
  }, 30000);
});
