// Shell V7 del área de Validaciones + mini-router por hash.
// Suite en node sin DOM: stubs mínimos para cargar indexx-validaciones.js.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
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
    for (const cat of ['sistemas', 'estabilidad', 'software']) {
      const h = Validaciones.viewEntidad(cat);
      expect(h).toContain('Generar (próximamente)');
      expect(h).toContain('próximamente para esta categoría');
    }
    expect(Validaciones.FASES_GEN).toEqual(['DQ', 'IQ', 'OQ', 'PQ']);
  });

  test('paso 3: equipos solo IQ; almacenes todas', () => {
    expect(Validaciones.GEN_FASES.equipos).toEqual(['IQ']);
    expect(Validaciones.GEN_FASES.almacenes).toEqual(['DQ', 'IQ', 'OQ', 'PQ']);
    const html = Validaciones.viewEntidad('equipos');
    expect(html).toContain('Protocolos a generar');
    expect(html).toContain('value="IQ"');
    expect(html).not.toContain('value="DQ"');
    expect(html).not.toContain('value="OQ"');
    expect(html).not.toContain('value="PQ"');
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
});
