// Auditoría fase 3 — trazabilidad de imputación (EST-08) y presentación de
// estadísticos no calculables con n<2 (EST-07).
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');
vm.runInThisContext(readFileSync(join(core, 'EstadisticaDescriptiva.js'), 'utf-8') + '\n;globalThis.__ED = EstadisticaDescriptiva;');
const ED = globalThis.__ED;

const dataDe = (rows, headers) => ({ headers, data: rows, rowCount: rows.length });

describe('fase 3 — ejecutarAnalisis no muta el dataset', () => {
  test('imputa sobre una copia y deja traza {metodo, celdasImputadas}', () => {
    const original = dataDe([['1'], [2], [''], [4]], ['x']);
    globalThis.columnAnalysisConfig = { imputeMissing: true, imputeMethod: 'mediana' };
    try {
      const res = ED.ejecutarAnalisis(original, ['Media Aritmética']);
      expect(original.data[2][0]).toBe(''); // el llamador conserva sus datos
      expect(res.imputacion).toEqual({ metodo: 'mediana', celdasImputadas: 1 });
      expect(res.resultados['Media Aritmética'].x).toBe(9 / 4); // (1+2+2+4)/4
    } finally {
      delete globalThis.columnAnalysisConfig;
    }
  });

  test('sin imputación no hay traza ni copia', () => {
    const original = dataDe([['1'], ['2']], ['x']);
    const res = ED.ejecutarAnalisis(original, ['Media Aritmética']);
    expect(res.imputacion).toBe(null);
  });
});

describe('fase 3 — n<2 se muestra como no calculable', () => {
  test('Varianza, DE y CV con null no imprimen "null" ni NaN', () => {
    const html = ED.generarHTML({
      columnasAnalizadas: ['x'],
      estadisticos: ['Varianza', 'Desviación Estándar', 'Coeficiente de Variación'],
      totalFilas: 1,
      totalColumnas: 1,
      resultados: {
        'Varianza': { x: null },
        'Desviación Estándar': { x: null },
        'Coeficiente de Variación': { x: null },
      },
    });
    expect(html).toContain('No calculable');
    expect(html).not.toContain('>null<');
    expect(html).not.toContain('NaN');
  });
});
