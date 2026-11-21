// Banco de procesos (PQ): común global + grupo sólidos + forma comprimidos
// + subtipos. Contrato de contenido y herencia por familia/grupo/subtipo.
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import { readFileSync } from 'fs';

const require = createRequire(import.meta.url);
const B = require('../js/core/banco-procesos-data.js');
const P = require('../js/core/plantilla-docx.js');
globalThis.BancoProcesos = B;

const ensayos = Object.entries(B.fases || {})
  .flatMap(([fase, xs]) => xs.map((x) => ({ ...x, fase })))
  .filter((e) => e.kind === 'ensayo' && (e.bloque === 2 || e.bloque === 3));

const sec = (e, prefijo) => (e.secciones || []).find((s) => String(s.et || '').startsWith(prefijo));
const texto = (e, prefijo) => {
  const s = sec(e, prefijo);
  return s ? String(s.html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
};

describe('banco de procesos: estructura', () => {
  it('solo tiene PQ y arranca con comprimidos', () => {
    expect(Object.keys(B.fases)).toEqual(['PQ']);
    expect(ensayos.length).toBe(52);
  });

  it('cápsulas tiene sus ensayos propios y hereda el grupo sólidos', () => {
    const ids = ensayos.filter((e) => e.familia === 'capsulas').map((e) => e.id);
    expect(ids).toEqual(['PRO-PQ-CAP-001', 'PRO-PQ-CAP-002', 'PRO-PQ-CAP-003', 'PRO-PQ-CAP-004', 'PRO-PQ-CAP-005']);
    expect(ensayos.filter((e) => e.familia === 'capsulas' && e.subtipo).map((e) => e.id)).toEqual(['PRO-PQ-CAP-004']);
  });

  it('granulados y polvos tienen sus ensayos propios', () => {
    expect(ensayos.filter((e) => e.familia === 'granulados').map((e) => e.id)).toEqual(['PRO-PQ-GRA-001', 'PRO-PQ-GRA-002', 'PRO-PQ-GRA-003']);
    expect(ensayos.filter((e) => e.familia === 'polvos').map((e) => e.id)).toEqual(['PRO-PQ-POL-001', 'PRO-PQ-POL-002', 'PRO-PQ-POL-003', 'PRO-PQ-POL-004']);
    expect(ensayos.filter((e) => e.familia === 'polvos' && e.subtipo).map((e) => e.id)).toEqual(['PRO-PQ-POL-004']);
  });

  it('el paso 2 pide el calibre de la cápsula', () => {
    const claves = P.parametrosFamilia('capsulas', 'procesos').map((p) => p.clave);
    expect(claves).toContain('calibre_capsula');
    const falt = P.paramsFaltantes('PQ', 'procesos', 'capsulas', 'ambas', {}, 'solidos').map((f) => f.clave);
    expect(falt).toContain('calibre_capsula');
  });

  it('reparte común, grupo y forma sin duplicar IDs', () => {
    const comunes = ensayos.filter((e) => !e.familia);
    const solidos = ensayos.filter((e) => e.familia === 'solidos');
    const comprimidos = ensayos.filter((e) => e.familia === 'comprimidos');
    const capsulas = ensayos.filter((e) => e.familia === 'capsulas');
    const granulados = ensayos.filter((e) => e.familia === 'granulados');
    const polvos = ensayos.filter((e) => e.familia === 'polvos');
    expect(comunes.length).toBe(21);
    expect(solidos.length).toBe(3);
    expect(comprimidos.length).toBe(16);
    expect(capsulas.length).toBe(5);
    expect(granulados.length).toBe(3);
    expect(polvos.length).toBe(4);
    expect(new Set(ensayos.map((e) => e.id)).size).toBe(ensayos.length);
  });

  it('los subtipos se declaran solo donde aplican', () => {
    const porSubtipo = {};
    for (const e of ensayos.filter((x) => x.subtipo)) porSubtipo[e.subtipo] = (porSubtipo[e.subtipo] || 0) + 1;
    expect(porSubtipo).toEqual({ Recubierto: 2, 'Liberación modificada': 2, Efervescente: 1, 'Polvo para reconstitución': 1 });
    expect(ensayos.filter((e) => e.subtipo && !e.familia).length).toBe(0);
  });

  it('no cita USP <1058> ni inventa IDs de instrumentos', () => {
    for (const e of ensayos) {
      expect(texto(e, 'Referencia')).not.toMatch(/1058/);
      expect(String(e.instrumentos || '')).not.toMatch(/certificado\s*(n[o°]|no\.)|n[o°]\s*de\s*serie/i);
    }
  });
});

describe('banco de procesos: herencia por familia, grupo y subtipo', () => {
  const comprimidos = { id: 'comprimidos', grupo: 'solidos' };
  const jarabe = { id: 'jarabes', grupo: 'liquidos' };
  const comun = { id: 'PRO-PQ-GEN-001' };
  const solido = { id: 'PRO-PQ-SOL-001', familia: 'solidos' };
  const forma = { id: 'PRO-PQ-CMP-001', familia: 'comprimidos' };
  const recubierto = { id: 'PRO-PQ-CMP-010', familia: 'comprimidos', subtipo: 'Recubierto' };

  it('el común aplica a cualquier forma y grupo', () => {
    expect(P.aplicaEnsayo(comun, comprimidos.id, comprimidos.grupo, {})).toBe(true);
    expect(P.aplicaEnsayo(comun, jarabe.id, jarabe.grupo, {})).toBe(true);
  });

  it('el grupo sólidos no se filtra a líquidos', () => {
    expect(P.aplicaEnsayo(solido, comprimidos.id, comprimidos.grupo, {})).toBe(true);
    expect(P.aplicaEnsayo(solido, jarabe.id, jarabe.grupo, {})).toBe(false);
  });

  it('uniformidad de mezcla es de grupo, no de una forma', () => {
    const mezcla = { id: 'PRO-PQ-SOL-003', familia: 'solidos' };
    expect(P.aplicaEnsayo(mezcla, 'comprimidos', 'solidos', {})).toBe(true);
    expect(P.aplicaEnsayo(mezcla, 'capsulas', 'solidos', {})).toBe(true);
    expect(P.aplicaEnsayo(mezcla, 'jarabes', 'liquidos', {})).toBe(false);
  });

  it('la forma solo entra en su propia forma', () => {
    expect(P.aplicaEnsayo(forma, comprimidos.id, comprimidos.grupo, {})).toBe(true);
    expect(P.aplicaEnsayo(forma, jarabe.id, jarabe.grupo, {})).toBe(false);
  });

  it('el subtipo exige coincidencia con el paso 2', () => {
    expect(P.aplicaEnsayo(recubierto, comprimidos.id, comprimidos.grupo, { subtipo: 'Recubierto' })).toBe(true);
    expect(P.aplicaEnsayo(recubierto, comprimidos.id, comprimidos.grupo, { subtipo: 'Convencional' })).toBe(false);
  });
});

describe('banco de procesos: contrato de contenido', () => {
  it('todo ensayo trae las secciones del estándar', () => {
    const faltan = [];
    for (const e of ensayos) {
      for (const prefijo of ['Objetivo', 'Procedimiento', 'Criterio', 'Documentos', 'Referencia']) {
        if (!sec(e, prefijo)) faltan.push(`${e.id}: ${prefijo}`);
      }
    }
    expect(faltan).toEqual([]);
  });

  it('todo ensayo con análisis trae plan con variable, n y regla', () => {
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

  it('todo valor propuesto en rojo declara su nota', () => {
    const sinNota = ensayos
      .filter((e) => /por-confirmar/.test(texto(e, 'Criterio')))
      .filter((e) => !sec(e, 'Nota'))
      .map((e) => e.id);
    expect(sinNota).toEqual([]);
  });

  it('todos los criterios tienen un valor numérico', () => {
    const sinNumero = ensayos.filter((e) => !/\d/.test(texto(e, 'Criterio'))).map((e) => e.id);
    expect(sinNumero).toEqual([]);
  });

  it('toda referencia cita una fuente normativa', () => {
    const sinFuente = ensayos
      .filter((e) => !/USP|ISO|IEC|EU GMP|21 CFR|OMS|ICH|Anexo/.test(texto(e, 'Referencia')))
      .map((e) => e.id);
    expect(sinFuente).toEqual([]);
  });
});

describe('plantilla de proceso: sin rótulos de equipo', () => {
  it('reemplaza los rótulos fijos de la plantilla PQ', async () => {
    const u8 = new Uint8Array(readFileSync('docs/plantillas/PQ-1-400AAAA.docx'));
    const out = await P.adaptarProceso(u8);
    const files = await P._interno.leerZip(out);
    const doc = files.find((f) => f.nombre === 'word/document.xml');
    const xml = new TextDecoder().decode(doc.datos);
    expect(xml).not.toMatch(/Descripcion del Equipo/);
    expect(xml).not.toMatch(/DESCRIPCIÓN DEL EQUIPO/);
    expect(xml).not.toMatch(/Imagen del equipo/);
    expect(xml).toMatch(/DESCRIPCIÓN DEL PROCESO/);
    expect(xml).toMatch(/Diagrama de flujo del proceso/);
  });
});

describe('muestreo PQ: tamaño de lote y porcentaje por etapa', () => {
  const claves = ['lotes_ppq', 'tamano_lote', 'porcentaje_mezcla', 'porcentaje_compresion', 'porcentaje_recubrimiento', 'porcentaje_empaque'];

  it('el paso 2 pide lotes, tamaño de lote y % por etapa', () => {
    const ps = P.parametrosFamilia('comprimidos', 'procesos').map((p) => p.clave);
    expect(ps).toEqual(expect.arrayContaining(claves));
  });

  it('bloquea la generación hasta completar los campos', () => {
    const falt = P.paramsFaltantes('PQ', 'procesos', 'comprimidos', 'ambas', {}, 'solidos').map((f) => f.clave);
    expect(falt).toEqual(expect.arrayContaining(claves));
    const draft = {
      param_lotes_ppq: '3', param_tamano_lote: '100000',
      param_porcentaje_mezcla: '0,2', param_porcentaje_compresion: '0,1',
      param_porcentaje_recubrimiento: '0,1', param_porcentaje_empaque: '0,02',
      param_tamano_lote_min: '50000', param_tamano_lote_max: '200000',
      param_tren_equipos: 'Mezclador, granulador, compresora, recubridora, blíster',
      param_peor_caso: 'Lote máximo y velocidad máxima', param_yield_min: '95',
      param_hold_time_max: '72', param_capability_min: '1,33', param_cpv_plan: 'CPV-001 v01',
      param_cma_primas: 'API D50 20-60 µm; humedad excipiente ≤ 3 %',
      param_area_temp_min: '15', param_area_temp_max: '25', param_area_hr_max: '65',
      param_metal_sensibilidad: '1,5',
      param_limpieza_protocolo: 'LIM-001 v01',
      param_transporte_protocolo: 'TRA-001 v01',
      param_escala_justificacion: 'Bracketing escala piloto/comercial',
      param_recalificacion_frecuencia: '36',
    };
    expect(P.paramsFaltantes('PQ', 'procesos', 'comprimidos', 'ambas', draft, 'solidos')).toEqual([]);
  });

  it('inyecta el tamaño de lote y el % por etapa en el protocolo', async () => {
    const u8 = new Uint8Array(readFileSync('docs/plantillas/PQ-1-400AAAA.docx'));
    const draft = {
      descripcion: 'Comprimidos 500 mg', codigo: 'PV-CMP-001', fecha: '2026-11-20',
      subtipo: 'Convencional', producto: 'Producto X', concentracion: '500 mg',
      ubicacion: 'Línea 1', usoPrevisto: 'Tratamiento oral',
      ursCodigo: 'URS-001', ursVersion: '01', riesgoCodigo: 'AR-001', riesgoVersion: '01',
      param_lotes_ppq: '3', param_tamano_lote: '100000',
      param_porcentaje_mezcla: '0,2', param_porcentaje_compresion: '0,1',
      param_porcentaje_recubrimiento: '0,1', param_porcentaje_empaque: '0,02',
      param_tamano_lote_min: '50000', param_tamano_lote_max: '200000',
      param_tren_equipos: 'Mezclador, granulador, compresora, recubridora, blíster',
      param_peor_caso: 'Lote máximo y velocidad máxima', param_yield_min: '95',
      param_hold_time_max: '72', param_capability_min: '1,33', param_cpv_plan: 'CPV-001 v01',
      param_cma_primas: 'API D50 20-60 µm; humedad excipiente ≤ 3 %',
      param_area_temp_min: '15', param_area_temp_max: '25', param_area_hr_max: '65',
      param_metal_sensibilidad: '1,5',
      param_limpieza_protocolo: 'LIM-001 v01',
      param_transporte_protocolo: 'TRA-001 v01',
      param_escala_justificacion: 'Bracketing escala piloto/comercial',
      param_recalificacion_frecuencia: '36',
    };
    const ent = { id: 'comprimidos', nombre: 'Comprimidos', grupo: 'solidos' };
    const r = await P.generar('PQ', u8, B, draft, ent, 'ambas');
    expect(r.ensayos).toContain('PRO-PQ-GEN-011');
    expect(r.ensayos).toContain('PRO-PQ-CMP-014');
    const files = await P._interno.leerZip(r.bytes);
    const xml = new TextDecoder().decode(files.find((f) => f.nombre === 'word/document.xml').datos);
    expect(xml).toContain('100000');
    expect(xml).toContain('0,2');
    expect(xml).toContain('Mezclador');
  });
});

describe('PQ P0: proceso, CPP/IPC, rendimiento y CPV', () => {
  const p0 = ['PRO-PQ-GEN-012', 'PRO-PQ-GEN-013', 'PRO-PQ-GEN-014', 'PRO-PQ-CMP-015', 'PRO-PQ-CMP-016', 'PRO-PQ-CMP-017', 'PRO-PQ-CMP-018'];

  it('los siete ensayos P0 están en el banco', () => {
    for (const id of p0) expect(ensayos.some((e) => e.id === id), id).toBe(true);
  });

  it('el paso 2 pide lote mínimo/máximo, tren, peor caso, rendimiento, hold y CPV', () => {
    const claves = P.parametrosFamilia('comprimidos', 'procesos').map((p) => p.clave);
    expect(claves).toEqual(expect.arrayContaining([
      'tamano_lote_min', 'tamano_lote_max', 'tren_equipos', 'peor_caso',
      'yield_min', 'hold_time_max', 'capability_min', 'cpv_plan',
    ]));
  });
});


describe('PQ P1: materias primas, ambiente y metales', () => {
  const p1 = ['PRO-PQ-GEN-015', 'PRO-PQ-GEN-016', 'PRO-PQ-CMP-019'];

  it('los ensayos P1 están en el banco', () => {
    for (const id of p1) expect(ensayos.some((e) => e.id === id), id).toBe(true);
  });

  it('el paso 2 pide CMA, T/HR del área y sensibilidad del detector', () => {
    const claves = P.parametrosFamilia('comprimidos', 'procesos').map((p) => p.clave);
    expect(claves).toEqual(expect.arrayContaining([
      'cma_primas', 'area_temp_min', 'area_temp_max', 'area_hr_max', 'metal_sensibilidad',
    ]));
  });

  it('metales es de comprimidos; materias primas y ambiente son comunes', () => {
    const metales = { familia: 'comprimidos' };
    const ambiente = { familia: undefined };
    expect(P.aplicaEnsayo(metales, 'comprimidos', 'solidos', {})).toBe(true);
    expect(P.aplicaEnsayo(metales, 'jarabes', 'liquidos', {})).toBe(false);
    expect(P.aplicaEnsayo(ambiente, 'jarabes', 'liquidos', {})).toBe(true);
  });
});


describe('PQ P2: ciclo de vida', () => {
  const p2 = ['PRO-PQ-GEN-017', 'PRO-PQ-GEN-018', 'PRO-PQ-GEN-019', 'PRO-PQ-GEN-020'];

  it('los ensayos P2 están en el banco', () => {
    for (const id of p2) expect(ensayos.some((e) => e.id === id), id).toBe(true);
  });

  it('el paso 2 pide protocolo de limpieza, transporte, escala y recalificación', () => {
    const claves = P.parametrosFamilia('comprimidos', 'procesos').map((p) => p.clave);
    expect(claves).toEqual(expect.arrayContaining([
      'limpieza_protocolo', 'transporte_protocolo', 'escala_justificacion', 'recalificacion_frecuencia',
    ]));
  });
});
