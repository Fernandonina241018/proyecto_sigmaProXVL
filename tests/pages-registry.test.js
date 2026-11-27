// Registro único de páginas: SIGMA_PAGES alimenta nav, títulos, workflow,
// grupos lazy, anchos de panel y la matriz de permisos.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { describe, test, expect } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function load() {
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(join(root, 'js/core/pages.js'), 'utf-8'), ctx);
  vm.runInContext(readFileSync(join(root, 'js/core/permisos.js'), 'utf-8'), ctx);
  return ctx;
}

describe('registro de páginas', () => {
  test('ids únicos y metadatos completos', () => {
    const { SIGMA_PAGES, SIGMA_PAGE_GROUPS, SIGMA_PAGE_BY_ID } = load();
    expect(SIGMA_PAGES).toHaveLength(11);
    expect(new Set(SIGMA_PAGES.map((p) => p.id)).size).toBe(11);
    SIGMA_PAGES.forEach((p) => {
      expect(p.label).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.icon).toBeTruthy();
      expect(p.desc).toBeTruthy();
      expect(['modules', 'admin']).toContain(p.group);
      expect(Array.isArray(p.roles)).toBe(true);
      expect(p.roles.length).toBeGreaterThan(0);
      expect(typeof p.paneWidth).toBe('number');
      expect(SIGMA_PAGE_BY_ID[p.id]).toBe(p);
    });
    expect(SIGMA_PAGE_GROUPS.map((g) => g.id)).toEqual(['modules', 'admin']);
  });

  test('workflow y grupos lazy salen del manifiesto', () => {
    const { SIGMA_PAGES } = load();
    expect(SIGMA_PAGES.filter((p) => p.workflow).map((p) => p.id)).toEqual([
      'datos', 'trabajo', 'analisis', 'visualizacion', 'reportes', 'firmarReporte'
    ]);
    expect(SIGMA_PAGES.find((p) => p.id === 'ml').lazyGroup).toBe('ml');
    expect(SIGMA_PAGES.find((p) => p.id === 'reportes').lazyGroup).toBe('reportes');
  });

  test('ALLOWED_PAGES se deriva de roles sin duplicar la matriz', () => {
    const { ALLOWED_PAGES } = load();
    expect(ALLOWED_PAGES.admin).toEqual([
      'datos', 'trabajo', 'analisis', 'visualizacion', 'reportes',
      'firmarReporte', 'ml', 'modelo-estadistico',
      'auditoria', 'usuarios', 'dispositivos'
    ]);
    expect(ALLOWED_PAGES.analista).toEqual([
      'datos', 'trabajo', 'analisis', 'visualizacion', 'reportes',
      'firmarReporte', 'ml', 'modelo-estadistico'
    ]);
    expect(ALLOWED_PAGES.user).toEqual(ALLOWED_PAGES.analista);
    expect(ALLOWED_PAGES.supervisor).toEqual(['firmarReporte']);
    expect(ALLOWED_PAGES.gerente).toEqual(['firmarReporte']);
    expect(ALLOWED_PAGES.coordinador).toEqual(['firmarReporte']);
    expect(ALLOWED_PAGES.readonly).toEqual([]);
  });
});
