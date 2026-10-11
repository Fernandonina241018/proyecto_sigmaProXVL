// Shell V7 del área de Validaciones + mini-router por hash.
// Suite en node sin DOM: stubs mínimos para cargar indexx-validaciones.js.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { createRequire } from 'module';
import { describe, test, expect, beforeEach } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function fakeEl() {
  const el = {
    style: {},
    dataset: {},
    textContent: '',
    innerHTML: '',
    id: '',
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: (c) => c,
    remove: () => {},
    getAttribute: () => null,
    setAttribute: () => {},
    removeAttribute: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    closest: () => null,
  };
  return el;
}

let appEl = null;
let mainEl = null;
const listeners = {};

function resetStubs() {
  appEl = null;
  mainEl = fakeEl();
  globalThis.window = globalThis;
  globalThis.location = { hash: '' };
  globalThis.addEventListener = (ev, fn) => { listeners[ev] = fn; };
  globalThis.dispatchEvent = () => true;
  globalThis.document = {
    getElementById: (id) => (id === 'validaciones-app' ? appEl : null),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => {
      const el = fakeEl();
      el.querySelector = () => mainEl;
      el.querySelectorAll = () => [];
      return el;
    },
    body: { appendChild: (c) => { appEl = fakeEl(); appEl.querySelector = () => mainEl; appEl.querySelectorAll = () => []; return c; } },
    readyState: 'complete',
  };
  delete globalThis.Auth;
  delete globalThis.AreaSelect;
  delete globalThis.Validaciones;
  delete globalThis.ValidacionesManifest;
}

resetStubs();
vm.runInThisContext(readFileSync(join(core, 'indexx-validaciones.js'), 'utf-8'));

describe('Validaciones V7', () => {
  beforeEach(() => {
    resetStubs();
  });

  test('parseRoute valida rutas y cae a banco', () => {
    expect(Validaciones.parseRoute('#/banco')).toBe('banco');
    expect(Validaciones.parseRoute('#/generador')).toBe('generador');
    expect(Validaciones.parseRoute('#/firmas')).toBe('firmas');
    expect(Validaciones.parseRoute('#/otro')).toBe('banco');
    expect(Validaciones.parseRoute('')).toBe('banco');
  });

  test('5 categorías SIN enlaces a docs (flujo ciego)', () => {
    expect(Validaciones.CATS.length).toBe(5);
    for (const c of Validaciones.CATS) {
      expect(c.href).toBeUndefined();
      expect(Validaciones.getEntidades(c.id).length).toBeGreaterThan(0);
      expect(Validaciones.getSchema(c.id).length).toBeGreaterThanOrEqual(6);
    }
    // <base target="_blank"> en indexx.html: los enlaces in-app deben forzar _self
    const src = readFileSync(join(core, 'indexx-validaciones.js'), 'utf-8');
    const catLine = src.split('\n').find((l) => l.indexOf('class="v7-cat') >= 0) || '';
    expect(catLine).toContain('target="_self"');
    expect(src).not.toContain('docs/banco-ensayos');
  });

  test('ruta de entidad válida y desconocida cae a banco', () => {
    expect(Validaciones.parseRoute('#/entidad/almacenes')).toBe('entidad/almacenes');
    expect(Validaciones.parseRoute('#/entidad/no-existe')).toBe('banco');
    expect(Validaciones.parseRoute('#/entidad')).toBe('banco');
  });

  test('planilla adaptativa: comunes + específicos por categoría', () => {
    const comun = ['responsable', 'fecha'];
    const eq = Validaciones.getSchema('equipos').map((f) => f.k);
    for (const k of comun) expect(eq).toContain(k);
    for (const k of ['marca', 'modelo', 'codigo', 'ubicacion', 'controlCambios', 'versionProtocolo']) expect(eq).toContain(k);
    const alm = Validaciones.getSchema('almacenes').map((f) => f.k);
    for (const k of ['codigo', 'descripcion', 'ubicacion', 'tipo', 'temperaturaMin', 'temperaturaMax', 'humedadMin', 'humedadMax', 'controlCambios', 'versionProtocolo']) expect(alm).toContain(k);
    expect(alm).not.toContain('marca');
    // sin duplicados en el esquema
    expect(new Set(alm).size).toBe(alm.length);
    // estabilidad: mismos campos de identificación que equipos (portada/encabezado completos)
    const est = Validaciones.getSchema('estabilidad').map((f) => f.k);
    for (const k of ['codigo', 'descripcion', 'marca', 'modelo', 'ubicacion', 'setpoint', 'camara', 'norma', 'controlCambios', 'versionProtocolo']) expect(est).toContain(k);
    // campos numéricos reales: deben renderizar como <input type="number">
    const src2 = readFileSync(join(core, 'indexx-validaciones.js'), 'utf-8');
    expect(src2).toContain("f.tipo === 'number'");
    expect(src2).toContain('type="number"');
  });

  test('formulario profesional: secciones, etiquetas con data-f y ruta', () => {
    const html = Validaciones.viewEntidad('almacenes');
    expect(html).toContain('Datos generales');
    expect(html).toContain('Datos específicos');
    expect(html).toContain('<fieldset');
    expect(html).toContain('data-f="temperaturaMin"');
    expect(html).toContain('type="number"');
    expect(html).toContain('Guardar borrador');
    expect(html).not.toContain('docs/banco-ensayos');
    expect(Validaciones.viewEntidad('no-existe')).toContain('vas a calificar');
    // tipografía estilo iPhone solo en la planilla (no toca el .docx futuro)
    const css = readFileSync(join(__dirname, '..', 'css', 'validaciones-v7.css'), 'utf-8');
    expect(css).toContain('.v7-form-flow');
    expect(css).toContain('-apple-system');
  });

  test('paso 3 con generador; resto queda en Próximamente', () => {
    const alm = Validaciones.viewEntidad('almacenes');
    expect(alm).toContain('Protocolos a generar');
    expect(alm).toContain('class="gen-fase"');
    expect(alm).toContain('Generar y descargar');
    expect(alm).not.toContain('Generar (próximamente)');
    for (const cat of ['sistemas', 'software']) {
      const h = Validaciones.viewEntidad(cat);
      expect(h).toContain('Generar (próximamente)');
      expect(h).toContain('próximamente para esta categoría');
    }
    expect(Validaciones.FASES_GEN).toEqual(['DQ', 'IQ', 'OQ', 'PQ']);
  });

  test('paso 3: estabilidad OQ+PQ (cámaras ICH Q1A)', () => {
    expect(Validaciones.GEN_FASES.estabilidad).toEqual(['IQ', 'OQ', 'PQ']);
    const html = Validaciones.viewEntidad('estabilidad');
    expect(html).toContain('Protocolos a generar');
    expect(html).toContain('value="IQ"');
    expect(html).toContain('value="OQ"');
    expect(html).toContain('value="PQ"');
  });

  test('paso 3: equipos IQ+OQ+PQ; almacenes todas', () => {
    expect(Validaciones.GEN_FASES.equipos).toEqual(['IQ', 'OQ', 'PQ']);
    expect(Validaciones.GEN_FASES.almacenes).toEqual(['DQ', 'IQ', 'OQ', 'PQ']);
    const html = Validaciones.viewEntidad('equipos');
    expect(html).toContain('Protocolos a generar');
    expect(html).toContain('value="IQ"');
    expect(html).toContain('value="OQ"');
    expect(html).toContain('value="PQ"');
    expect(html).not.toContain('value="DQ"');
  });

  test('contarGen filtra por entidad (familia), igual que generar()', () => {
    const require = createRequire(import.meta.url);
    globalThis.BancoEquipos = require('../js/core/banco-equipos-data.js');
    try {
      // lecho fluido OQ: común (1) + familia (11)
      expect(Validaciones.contarGen('OQ', 'ambas', 'equipos', 'lecho-fluido')).toBe(12);
      // autoclave OQ: común (1) + familia (18)
      expect(Validaciones.contarGen('OQ', 'ambas', 'equipos', 'autoclave')).toBe(19);
      // sin entidad: todo el banco OQ (antes inflaba el paso 3)
      expect(Validaciones.contarGen('OQ', 'ambas', 'equipos')).toBeGreaterThan(19);
    } finally {
      delete globalThis.BancoEquipos;
    }
  });

  test('contarGen estabilidad IQ suma núcleo común + específicos', () => {
    const require = createRequire(import.meta.url);
    globalThis.BancoEquipos = require('../js/core/banco-equipos-data.js');
    globalThis.BancoEstabilidad = require('../js/core/banco-estabilidad-data.js');
    try {
      const n = Validaciones.contarGen('IQ', 'ambas', 'estabilidad', 'cabina-est-acelerada');
      const nucleo = globalThis.BancoEquipos.fases.IQ
        .filter((i) => i.id && (i.bloque === 2 || i.bloque === 3) && !i.familia).length;
      expect(n).toBe(nucleo + 2);
    } finally {
      delete globalThis.BancoEquipos;
      delete globalThis.BancoEstabilidad;
    }
  });

  test('paso 1: combobox con buscador en equipos, botones en el resto', () => {
    const eq = Validaciones.viewEntidad('equipos');
    expect(eq).toContain('v7-ent-input');
    expect(eq).toContain('v7-ents-dl');
    expect(eq).toContain('Escriba para buscar');
    expect(eq).not.toContain('class="v7-ent"');
    const alm = Validaciones.viewEntidad('almacenes');
    expect(alm).toContain('class="v7-ent"');
    expect(alm).not.toContain('v7-ent-input');
    expect(Validaciones.entidadPorNombre('equipos', 'balanza analítica / precisión')).toEqual({ id: 'balanza', nombre: 'Balanza analítica / precisión' });
    expect(Validaciones.entidadPorNombre('equipos', 'no existe')).toBe(null);
    expect(Validaciones.entidadPorNombre('equipos', '')).toBe(null);
  });

  test('firmantes: helpers de puesto y fieldset', () => {
    expect(Validaciones.puestoGerente('Calidad')).toBe('Gerente de Calidad');
    expect(Validaciones.puestoGerente('Gerente de Calidad')).toBe('Gerente de Calidad');
    expect(Validaciones.puestoGerente('', 'Analista')).toBe('Analista');
    expect(Validaciones.puestoGerente('')).toBe('');
    expect(Validaciones.AREAS_GERENCIA.length).toBeGreaterThan(3);
    const h = Validaciones.firmantesHtml();
    expect(h).toContain('data-k="realizadoPor"');
    expect(h).toContain('data-k="revisorGerente"');
    expect(h).toContain('data-k="gerenciaArea"');
    expect(h).toContain('readonly');
  });

  test('selección de protocolos persiste por entidad', () => {
    expect(Validaciones.saveGen('cuarto-frio', { fases: ['DQ', 'OQ'], cond: 'dina' })).toBe(true);
    expect(Validaciones.loadGen('cuarto-frio')).toEqual({ fases: ['DQ', 'OQ'], cond: 'dina' });
    expect(Validaciones.loadGen('otra')).toEqual({ fases: ['DQ', 'IQ', 'OQ', 'PQ'], cond: 'ambas' });
  });
  test('borrador por entidad persiste en sessionStorage', () => {
    expect(Validaciones.saveDraft('cuarto-frio', { descripcion: 'CF-01' })).toBe(true);
    expect(Validaciones.loadDraft('cuarto-frio').descripcion).toBe('CF-01');
    expect(Validaciones.loadDraft('otra-entidad')).toEqual({});
    expect(Validaciones.getSchema('cuarto-frio')).toBeDefined();
  });

  test('4 rutas en el riel', () => {
    expect(Validaciones.ROUTES.map((r) => r.id)).toEqual(['banco', 'generador', 'protocolos', 'firmas']);
  });

  test('apply validaciones muestra shell, estadistica la oculta', () => {
    Validaciones.apply('validaciones');
    expect(appEl).not.toBe(null);
    Validaciones.apply('estadistica');
  });

  test('evento sigma-area conmuta el shell', () => {
    expect(typeof listeners['sigma-area']).toBe('function');
    listeners['sigma-area']({ detail: { area: 'validaciones' } });
    expect(appEl).not.toBe(null);
  });

  test('no-admin ve En desarrollo, admin ve dashboard', () => {
    globalThis.Auth = { getSession: () => ({ username: 'u', role: 'user' }), getArea: () => 'validaciones' };
    Validaciones.apply('validaciones');
    expect(mainEl.innerHTML).toMatch('En desarrollo');
    globalThis.Auth = { getSession: () => ({ username: 'a', role: 'admin' }), getArea: () => 'validaciones' };
    Validaciones.apply('validaciones');
    expect(mainEl.innerHTML).toMatch('vas a calificar');
  });

  test('sin DOM falla seguro', () => {
    const keep = globalThis.document;
    delete globalThis.document;
    expect(Validaciones.show()).toBe(false);
    globalThis.document = keep;
  });

  test('sin duplicidad con estabilidad: equipos sin cabina-estabilidad', () => {
    const ids = Validaciones.getEntidades('equipos').map((e) => e.id);
    expect(ids).not.toContain('cabina-estabilidad');
    const html = readFileSync(join(__dirname, '..', 'docs', 'banco-ensayos', 'equipos.html'), 'utf-8');
    expect(html).not.toContain('cabina-estabilidad');
    const est = Validaciones.getEntidades('estabilidad').map((e) => e.id);
    expect(est).toContain('cabina-est-acelerada');
  });

  test('horno-secado vive en equipos (movido desde estabilidad)', () => {
    const eq = Validaciones.getEntidades('equipos').map((e) => e.id);
    const est = Validaciones.getEntidades('estabilidad').map((e) => e.id);
    expect(eq).toContain('horno-secado');
    expect(est).not.toContain('horno-secado');
  });

  test('responsable automático desde login, como Realizado por', () => {
    const comun = Validaciones.SCHEMAS._comun.find((f) => f.k === 'responsable');
    expect(comun.auto).toBe('login');
    const html = Validaciones.viewEntidad('almacenes');
    expect(html).toContain('Responsable (automático)');
    expect(html).toContain('data-k="responsable" data-req="1" readonly');
    // pintarFirmantes llena responsable con el mismo usuario del login
    const src = readFileSync(join(core, 'indexx-validaciones.js'), 'utf-8');
    const pf = src.slice(src.indexOf('function pintarFirmantes'));
    expect(pf.slice(0, 1600)).toContain('data-k="responsable"');
  });

  test('descripcion: autofill desde entidad + override manual + preview', () => {
    const R = Validaciones.resolverDescripcion;
    // vacío → rellena con la entidad, no manual
    expect(R('', 'Lecho fluido', '', false)).toEqual({ valor: 'Lecho fluido', manual: false });
    // igual a la entidad → limpio
    expect(R('Balanza', 'Balanza', '', false)).toEqual({ valor: 'Balanza', manual: false });
    // trae el nombre auto de la anterior → cambia a la nueva (cambio de entidad)
    expect(R('Lecho fluido', 'Balanza', 'Lecho fluido', false)).toEqual({ valor: 'Balanza', manual: false });
    // texto distinto = edición manual, se respeta
    expect(R('Lecho fluido Glatt', 'Lecho fluido', '', false)).toEqual({ valor: 'Lecho fluido Glatt', manual: true });
    expect(R('Lecho fluido Glatt', 'Balanza', 'Lecho fluido', true)).toEqual({ valor: 'Lecho fluido Glatt', manual: true });
    // el preview existe en el HTML del paso 2 (fuente del JS, sin DOM)
    const src2 = readFileSync(join(core, 'indexx-validaciones.js'), 'utf-8');
    expect(src2).toContain('v7-desc-preview');
    expect(src2).toContain('Saldrá como: ');
  });

  test('H-01: OQ/PQ sin banco de familia se detecta (tieneBancoFam)', () => {
    globalThis.BancoEquipos = require('../js/core/banco-equipos-data.js');
    try {
      expect(Validaciones.tieneBancoFam('OQ', 'equipos', 'etiquetadora')).toBe(false);
      expect(Validaciones.tieneBancoFam('PQ', 'equipos', 'etiquetadora')).toBe(false);
      expect(Validaciones.tieneBancoFam('OQ', 'equipos', 'detector-metales')).toBe(true);
      expect(Validaciones.tieneBancoFam('PQ', 'equipos', 'detector-metales')).toBe(true);
      expect(Validaciones.tieneBancoFam('OQ', 'equipos', 'blistera')).toBe(true);
      expect(Validaciones.tieneBancoFam('OQ', 'equipos', 'reactor')).toBe(true);
      expect(Validaciones.tieneBancoFam('PQ', 'equipos', 'mezclador')).toBe(true);
      expect(Validaciones.tieneBancoFam('IQ', 'equipos', 'tableteadora')).toBe(true);
      expect(Validaciones.tieneBancoFam('OQ', 'estabilidad', 'cabina-est-acelerada')).toBe(true);
      expect(Validaciones.tieneBancoFam('OQ', 'almacenes', 'cuarto-frio')).toBe(true);
    } finally { delete globalThis.BancoEquipos; }
  });

  test('H-09: esquema común trae URS y riesgo con código y versión', () => {
    const ks = Validaciones.SCHEMAS._comun.map((f) => f.k);
    ['ursCodigo', 'ursVersion', 'riesgoCodigo', 'riesgoVersion'].forEach((k) => expect(ks).toContain(k));
    const src3 = readFileSync(join(core, 'indexx-validaciones.js'), 'utf-8');
    expect(src3).toContain('Complete URS y análisis de riesgo');
    expect(src3).toContain('Sin banco de familia');
  });
});
