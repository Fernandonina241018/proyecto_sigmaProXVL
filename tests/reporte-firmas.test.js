// REGRESIÓN: el HTML del reporte DEBE conservar los bloques de firma.
// Este test es la red que faltaba: un error de 2 líneas en generarHTML
// (p. ej. referenciar una variable inexistente) rompía las firmas y llegaba
// a producción sin que ninguna suite lo detectara.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mgr = join(__dirname, '..', 'js', 'managers');

function loadReporteHarness() {
  const sandbox = {
    console,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    document: {
      getElementById: () => null,
      createElement: () => null,
      querySelectorAll: () => [],
    },
    window: {},
    showToast: () => {},
    escapeHtml: (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    formatDate: () => '01/Ene/2026',
    nowDateFormatted: () => '01/Ene/2026',
    nowFormatted: () => '01/Ene/2026 00:00:00',
    QRCode: { toCanvas: async () => ({}) },
    Chart: function () {},
    HYPOTHESIS_SET: new Set(['Media']),
    estadisticosConfig: {},
    StateManager: { getState: () => ({}), getUltimosResultados: () => null },
    Logger: { logReportGenerate: () => {} },
    _userCanGenerateReport: () => true,
    getCurrentSheet: () => null,
    Auth: { getSession: () => null },
    API_URL: 'http://x',
    fetchWithTimeout: async () => ({ json: async () => ({}) }),
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(mgr, 'ReporteManager.js'), 'utf-8'), sandbox);
  return sandbox;
}

const META = {
  organizacion: 'ORG', departamento: 'DEP', ubicacion: 'UB', descripcion: 'D',
  marca: 'M', modelo: 'MOD', serie: 'S', fase: 'DQ', code: 'C1', ensayo: 'E',
  version: '1.0', conf: 'CONFIDENTIAL', protocolo: 'P', dataset: 'DS', file: 'f.csv',
  collect: '2026-01-01', analysis: '2026-01-01', observaciones: 'obs',
  preparedBy: 'Ana', reviewedBy: 'Beto', approvedBy: 'Carla', nombreDataset: 'DS',
};

const RESULTADOS = {
  totalFilas: 10, totalColumnas: 2,
  columnasAnalizadas: ['Temp'],
  estadisticos: ['Media'],
  resultados: { Media: { valor: 5 } },
  filas: [],
};

async function generar() {
  const sb = loadReporteHarness();
  return await vm.runInContext(
    `ReporteManager.generarHTML(__R__, __M__, 'ABC123')`,
    Object.assign(sb, { __R__: RESULTADOS, __M__: META })
  );
}

describe('generarHTML — el reporte conserva sus firmas', () => {
  test('devuelve un HTML string (no undefined)', async () => {
    const html = await generar();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(1000);
    expect(html).toContain('<!DOCTYPE html>');
  });

  test('incluye los 3 bloques de firma (prepared / reviewed / approved)', async () => {
    const html = await generar();
    expect(html).toContain('data-signature-role="prepared"');
    expect(html).toContain('data-signature-role="reviewed"');
    expect(html).toContain('data-signature-role="approved"');
  });

  test('cada bloque lleva los 4 campos de firma (name/title/firma/date)', async () => {
    const html = await generar();
    for (const role of ['prepared', 'reviewed', 'approved']) {
      for (const field of ['name', 'title', 'firma', 'date']) {
        expect(html).toContain('data-signature-field="' + field + '" data-signature-role="' + role + '"');
      }
    }
  });

  test('los NOMBRES de los firmantes llegan al HTML (lo que el usuario ve)', async () => {
    const html = await generar();
    const blocks = { prepared: 'Ana', reviewed: 'Beto', approved: 'Carla' };
    Object.keys(blocks).forEach(function(role) {
      const name = blocks[role];
      const re = new RegExp(
        'data-signature-role="' + role + '"[\\s\\S]*?data-signature-field="name" data-signature-role="' + role + '"[^>]*>' + name + '<'
      );
      expect(re.test(html), 'falta el nombre "' + name + '" en el bloque ' + role).toBe(true);
    });
  });

  test('los 3 firmantes NO colapsan en un mismo bloque', async () => {
    const html = await generar();
    ['prepared', 'reviewed', 'approved'].forEach(function(role) {
      const hits = html.split('data-signature-role="' + role + '"').length - 1;
      // 1 apertura del div + 4 campos con el rol = 5 apariciones
      expect(hits).toBe(5);
    });
  });

  test('incluye la grilla de firmas y el bloque de auditoría', async () => {
    const html = await generar();
    expect(html).toContain('sig-grid');
    expect(html).toContain('audit-box');
  });

  test('el reporte NO lleva botón de imprimir propio (la app lo ofrece)', async () => {
    const html = await generar();
    // El botón del reporte vivía dentro del iframe sandbox, donde su
    // onclick nunca se ejecutaba. Ahora la app tiene su propio botón
    // (firmaPrint) en la cabecera de la vista previa.
    expect(html).not.toContain('id="printButton"');
    expect(html).not.toContain('onclick="window.print()"');
  });

  test('no deja "undefined" colgando en el HTML', async () => {
    const html = await generar();
    expect(html).not.toMatch(/>undefined</);
    expect(html).not.toContain('undefined undefined');
  });
});
