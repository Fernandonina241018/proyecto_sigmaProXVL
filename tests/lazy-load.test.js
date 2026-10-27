// Opción D2 — carga bajo demanda de los módulos pesados.
//
// Verifica el cargador real de indexx.html (extraído y ejecutado en un VM
// con un DOM mínimo):
//  · el núcleo no incluye los bancos de ensayos ni ML/Reportes/EDA;
//  · los grupos se descargan una sola vez y con la versión estable (?v=);
//  · los archivos diferidos existen en disco.
// También vigila que loadPage/runEDA/Validaciones usen el cargador.
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { describe, test, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raiz = join(__dirname, '..');
const html = readFileSync(join(raiz, 'indexx.html'), 'utf-8');

function loaderSource() {
  const i = html.indexOf('window.__sigmaLoadGroup');
  if (i < 0) throw new Error('No se encontró el cargador en indexx.html');
  const start = html.lastIndexOf('<script>', i) + '<script>'.length;
  const end = html.indexOf('</script>', i);
  return html.slice(start, end);
}

function cargarLoader(version = 'abc123') {
  const requests = [];
  const sandbox = {
    console,
    Promise,
    Date,
    document: {
      createElement: () => ({}),
      body: {
        appendChild(el) {
          requests.push(el.src);
          // Simula la descarga: onload inmediato y en orden.
          if (typeof el.onload === 'function') el.onload();
        },
      },
    },
  };
  sandbox.window = sandbox;
  sandbox._CACHE_BUST = version;
  vm.createContext(sandbox);
  vm.runInContext(loaderSource(), sandbox);
  return { win: sandbox, requests };
}

const DIFERIDOS = [
  'js/core/banco-almacenes-data.js',
  'js/core/banco-equipos-data.js',
  'js/core/banco-estabilidad-data.js',
  'js/core/banco-sistemas-data.js',
  'js/core/generador-docx.js',
  'js/core/plantilla-docx.js',
  'js/pages/ml.js',
  'js/managers/ReporteManager.js',
  'js/managers/EDAManager.js',
];

describe('cargador bajo demanda (D2)', () => {
  test('el núcleo carga primero, sin los archivos pesados', () => {
    const { win, requests } = cargarLoader();
    expect(win.__sigmaCoreReady).toBe(true);
    expect(win.__sigmaCoreFiles.length).toBeGreaterThan(20);
    expect(requests).toHaveLength(win.__sigmaCoreFiles.length);
    for (const f of DIFERIDOS) {
      expect(win.__sigmaCoreFiles).not.toContain(f);
    }
    expect(win.__sigmaCoreFiles).toContain('js/core/auth.js');
    expect(win.__sigmaCoreFiles).toContain('js/core/indexx-ui.js');
    expect(win.__sigmaCoreFiles).toContain('js/core/indexx-validaciones.js');
  });

  test('todos los archivos se piden con la versión estable (?v=)', () => {
    const { win, requests } = cargarLoader('d29e75b');
    expect(requests.length).toBeGreaterThan(0);
    for (const src of requests) {
      expect(src).toMatch(/\?v=d29e75b$/);
    }
    expect(win.__sigmaCoreFiles.every((f) => !f.includes('?v='))).toBe(true);
  });

  test('los grupos existen y sus archivos están en disco', () => {
    const { win } = cargarLoader();
    expect(Object.keys(win.__sigmaGroups).sort()).toEqual(['eda', 'ml', 'reportes', 'validaciones']);
    for (const [grupo, archivos] of Object.entries(win.__sigmaGroups)) {
      expect(archivos.length).toBeGreaterThan(0);
      for (const f of archivos) {
        expect(existsSync(join(raiz, f)), grupo + ': ' + f).toBe(true);
      }
    }
    // Sin duplicados entre núcleo y grupos.
    const todos = [...win.__sigmaCoreFiles, ...Object.values(win.__sigmaGroups).flat()];
    expect(new Set(todos).size).toBe(todos.length);
  });

  test('un grupo se descarga una sola vez y se marca como listo', async () => {
    const { win, requests } = cargarLoader();
    expect(win.__sigmaGroupReady('ml')).toBe(false);
    const antes = requests.length;
    await win.__sigmaLoadGroup('ml');
    expect(win.__sigmaGroupReady('ml')).toBe(true);
    expect(requests.length).toBe(antes + 1);
    expect(requests[antes]).toBe('js/pages/ml.js?v=abc123');
    // Segunda vez: no vuelve a pedirlo.
    await win.__sigmaLoadGroup('ml');
    expect(requests.length).toBe(antes + 1);
    // Grupo inexistente: no rompe.
    await expect(win.__sigmaLoadGroup('no-existe')).resolves.toBeUndefined();
  });

  test('cargar el grupo de validaciones trae bancos y generadores', async () => {
    const { win, requests } = cargarLoader();
    const antes = requests.length;
    await win.__sigmaLoadGroup('validaciones');
    const pedidos = requests.slice(antes);
    expect(pedidos).toHaveLength(6);
    expect(pedidos).toContain('js/core/banco-equipos-data.js?v=abc123');
    expect(pedidos).toContain('js/core/plantilla-docx.js?v=abc123');
  });

  test('loadPage, runEDA y Validaciones usan el cargador', () => {
    const ui = readFileSync(join(raiz, 'js/core/indexx-ui.js'), 'utf-8');
    expect(ui).toContain('_SIGMA_PAGE_GROUP');
    expect(ui).toContain('__sigmaLoadGroup');
    expect(ui).toContain("ml: 'ml'");
    expect(ui).toContain("reportes: 'reportes'");

    const analysis = readFileSync(join(raiz, 'js/core/indexx-analysis.js'), 'utf-8');
    expect(analysis).toContain("__sigmaLoadGroup('eda')");

    const val = readFileSync(join(raiz, 'js/core/indexx-validaciones.js'), 'utf-8');
    expect(val).toContain("__sigmaLoadGroup('validaciones')");
  });
});
