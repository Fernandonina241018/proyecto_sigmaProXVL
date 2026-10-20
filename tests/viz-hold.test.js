// Test paralelo: modo "hold" de gráficos de otro dataset/hoja (viz).
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function g(id, title, type, file, sheetName, sheetIdx) {
  return { id, title, type, vars: { x: '__index__', y: 'col' }, palette: 'violet', thumb: '', url: 'data:image/jpeg;base64,abc', createdAt: Date.now(), sourceFile: file, sourceSheetName: sheetName, sourceSheetIndex: sheetIdx };
}

function loadVizHall(dataCurrentFileName, trabajoSheets, trabajoActiveSheetIndex) {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML =
    '<div id="vizGallery"></div>' +
    '<span id="vizGalCount"></span>' +
    '<div id="vizGalNav"></div>';
  const toasts = [];
  const sandbox = {
    console, window, document,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    showToast: (m) => { toasts.push(String(m)); },
    escapeHtml: (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    datosCurrentFileName: dataCurrentFileName,
    trabajoSheets: trabajoSheets,
    trabajoActiveSheetIndex: trabajoActiveSheetIndex,
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  sandbox.window = sandbox; // window.Visualizacion queda accesible como global
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-viz.js'), 'utf-8'), sandbox);
  return { sandbox, document, toasts };
}

describe('viz hold — gráficos de otro dataset/hoja', () => {
  test('pertenece: misma hoja y archivo → no hold', () => {
    const { sandbox } = loadVizHall('datos.xlsx', [{ name: 'Vacío' }, { name: 'Carga' }], 0);
    const g1 = g(1, 'G Vacío', 'barras', 'datos.xlsx', 'Vacío', 0);
    const pertenece = vm.runInContext('_V_graficoPerteneceActual(' + JSON.stringify(g1) + ')', sandbox);
    expect(pertenece).toBe(true);
  });

  test('no pertenece: hoja distinta, mismo archivo → hold', () => {
    const { sandbox } = loadVizHall('datos.xlsx', [{ name: 'Vacío' }, { name: 'Carga' }], 0);
    const g1 = g(2, 'G Carga', 'barras', 'datos.xlsx', 'Carga', 1);
    const pertenece = vm.runInContext('_V_graficoPerteneceActual(' + JSON.stringify(g1) + ')', sandbox);
    expect(pertenece).toBe(false);
  });

  test('no pertenece: archivo distinto → hold', () => {
    const { sandbox } = loadVizHall('datos.xlsx', [{ name: 'Vacío' }], 0);
    const g1 = g(3, 'G Otro', 'barras', 'otro.xlsx', 'Vacío', 0);
    const pertenece = vm.runInContext('_V_graficoPerteneceActual(' + JSON.stringify(g1) + ')', sandbox);
    expect(pertenece).toBe(false);
  });

  test('vizRefreshGallery pinta hold (opaco, sin click) en gráficos de otra hoja', () => {
    const { sandbox, document } = loadVizHall('datos.xlsx', [{ name: 'Vacío' }, { name: 'Carga' }], 0);
    vm.runInContext(
      "_V.gallery = [g(10,'Vacío','barras','datos.xlsx','Vacío',0), g(11,'Carga','barras','datos.xlsx','Carga',1)]; " +
      "function g(id,t,ty,f,s,i){return {id:id,title:t,type:ty,vars:{},palette:'violet',thumb:'',url:'data:x',createdAt:Date.now(),sourceFile:f,sourceSheetName:s,sourceSheetIndex:i}}; " +
      "vizRefreshGallery();",
      sandbox
    );
    const thumbs = document.querySelectorAll('#vizGallery .gal-thumb');
    expect(thumbs.length).toBe(2);
    const t0 = thumbs[0]; // Vacío (activa) → sin hold
    const t1 = thumbs[1]; // Carga → hold
    expect(t0.className).not.toContain('hold');
    expect(t0.style.pointerEvents).toBe('');
    expect(typeof t0.onclick).toBe('function');
    expect(t1.className).toContain('hold');
    expect(Number(t1.style.opacity)).toBeLessThan(1);
    expect(t1.style.pointerEvents).toBe('none');
    expect(t1.onclick).toBeNull();
  });

  test('getGraficosParaReporte excluye hold (otra hoja)', () => {
    const { sandbox } = loadVizHall('datos.xlsx', [{ name: 'Vacío' }, { name: 'Carga' }], 0);
    vm.runInContext(
      "function g(id,t,ty,f,s,i){return {id:id,title:t,type:ty,vars:{},palette:'violet',thumb:'',url:'data:x',createdAt:Date.now(),sourceFile:f,sourceSheetName:s,sourceSheetIndex:i}}; " +
      "_V.gallery = [g(20,'Vacío','barras','datos.xlsx','Vacío',0), g(21,'Carga','barras','datos.xlsx','Carga',1)]; " +
      "vizRefreshGallery();",
      sandbox
    );
    const graficos = vm.runInContext('Visualizacion.getGraficosParaReporte(false)', sandbox);
    const ids = graficos.map(function(g){ return g.id; });
    expect(ids).toContain(20);
    expect(ids).not.toContain(21);
  });

  test('_getGalleryGraphs trae hold flag', () => {
    const { sandbox } = loadVizHall('datos.xlsx', [{ name: 'Vacío' }, { name: 'Carga' }], 0);
    vm.runInContext(
      "function g(id,t,ty,f,s,i){return {id:id,title:t,type:ty,vars:{},palette:'violet',thumb:'',url:'data:x',createdAt:Date.now(),sourceFile:f,sourceSheetName:s,sourceSheetIndex:i}}; " +
      "_V.gallery = [g(30,'Vacío','barras','datos.xlsx','Vacío',0), g(31,'Carga','barras','datos.xlsx','Carga',1)];",
      sandbox
    );
    const graficos = vm.runInContext('Visualizacion._getGalleryGraphs()', sandbox);
    const v = graficos.find(function(x){ return x.id === 30; });
    const c = graficos.find(function(x){ return x.id === 31; });
    expect(v.hold).toBe(false);
    expect(c.hold).toBe(true);
  });
});
