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
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(mgr, 'ReporteManager.js'), 'utf-8'), sandbox);
  return sandbox;
}

const FULL_META = {
  organizacion: 'ORG', departamento: 'DEPTO', descripcion: 'DESC',
  ensayo: 'ENS', fase: 'F1', codigoProyecto: 'P-001', nombreDataset: 'datos.csv',
};

describe('validateReportMeta (gate firma)', () => {
  test('meta completa → sin faltantes', () => {
    const sb = loadReporteHarness();
    sb.__META__ = { ...FULL_META };
    const missing = vm.runInContext('ReporteManager.validateReportMeta(__META__)', sb);
    expect(missing).toEqual([]);
  });

  test('meta vacía/null → los 7 obligatorios', () => {
    const sb = loadReporteHarness();
    sb.__META__ = null;
    const missing = vm.runInContext('ReporteManager.validateReportMeta(__META__)', sb);
    expect(missing).toHaveLength(7);
    const empty = vm.runInContext('ReporteManager.validateReportMeta({})', sb);
    expect(empty).toHaveLength(7);
  });

  test('detecta exactamente los campos faltantes', () => {
    const sb = loadReporteHarness();
    sb.__META__ = { ...FULL_META, departamento: '  ', codigoProyecto: '' };
    const missing = vm.runInContext('ReporteManager.validateReportMeta(__META__)', sb);
    expect(missing.map((m) => m.key).sort()).toEqual(['codigoProyecto', 'departamento']);
    expect(missing[0]).toHaveProperty('id');
    expect(missing[0]).toHaveProperty('label');
  });

  test('mapea cada faltante a su input del formulario', () => {
    const sb = loadReporteHarness();
    sb.__META__ = {};
    const missing = vm.runInContext('ReporteManager.validateReportMeta(__META__)', sb);
    const ids = Object.fromEntries(missing.map((m) => [m.key, m.id]));
    expect(ids).toEqual({
      organizacion: 'rep-org',
      departamento: 'rep-dept',
      descripcion: 'rep-descripcion',
      ensayo: 'rep-ensayo',
      fase: 'rep-fase',
      codigoProyecto: 'rep-code',
      nombreDataset: 'rep-dataset',
    });
  });
});
