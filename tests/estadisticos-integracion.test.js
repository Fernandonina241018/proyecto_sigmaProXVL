// Integración mínima: dispatch + render de Pareto y Covarianza.
// Cubre los dos estadísticos que antes no se podían ejecutar o no se veían.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

vm.runInThisContext(readFileSync(join(core, 'EstadisticaDescriptiva.js'), 'utf-8'));
const ED = EstadisticaDescriptiva;

function dataDe(rows, headers) {
  return { headers, data: rows, rowCount: rows.length };
}

describe('Integración — Diagrama de Pareto', () => {
  const rows = [
    { Categoria: 'A', Conteo: 30 },
    { Categoria: 'A', Conteo: 0 },
    { Categoria: 'B', Conteo: 20 },
    { Categoria: 'C', Conteo: 10 },
    { Categoria: 'D', Conteo: 5 },
  ];

  test('se ejecuta con categoría + conteo y calcula 80/20', () => {
    const res = ED.ejecutarAnalisis(
      dataDe(rows, ['Categoria', 'Conteo']),
      ['Diagrama de Pareto'],
      { 'Diagrama de Pareto': { columnaCategoria: 'Categoria', columnaConteo: 'Conteo' } }
    );
    const pareto = res.resultados['Diagrama de Pareto'];
    expect(pareto.error).toBeUndefined();
    expect(pareto.total).toBe(65);
    expect(pareto.categorias).toEqual(['A', 'B', 'C', 'D']);
    expect(pareto.conteos).toEqual([30, 20, 10, 5]);
    expect(pareto.vitales).toBe(3);
    expect(pareto.datosCompletos).toHaveLength(4);
  });

  test('el HTML muestra la tabla y no cae en "tipo no reconocido"', () => {
    const res = ED.ejecutarAnalisis(
      dataDe(rows, ['Categoria', 'Conteo']),
      ['Diagrama de Pareto'],
      { 'Diagrama de Pareto': { columnaCategoria: 'Categoria', columnaConteo: 'Conteo' } }
    );
    const html = ED.generarHTML(res);
    expect(html).toContain('Diagrama de Pareto');
    expect(html).toContain('Categoría');
    expect(html).toContain('92.31');
    expect(html).not.toContain('[object Object]');
    expect(html).not.toContain('Tipo de prueba no reconocido');
    expect(html).not.toContain('Configuración no encontrada');
  });

  test('sin conteo cuenta una fila por registro', () => {
    const res = ED.ejecutarAnalisis(
      dataDe([
        { Categoria: 'X' }, { Categoria: 'X' }, { Categoria: 'Y' },
      ], ['Categoria']),
      ['Diagrama de Pareto'],
      { 'Diagrama de Pareto': { columnaCategoria: 'Categoria' } }
    );
    const pareto = res.resultados['Diagrama de Pareto'];
    expect(pareto.error).toBeUndefined();
    expect(pareto.total).toBe(3);
    expect(pareto.conteos).toEqual([2, 1]);
  });
});

describe('Integración — Covarianza', () => {
  const rows = [
    { X: 1, Y: 2 }, { X: 2, Y: 4 }, { X: 3, Y: 6 }, { X: 4, Y: 8 },
  ];

  test('se ejecuta con dos columnas y calcula la covarianza muestral', () => {
    const res = ED.ejecutarAnalisis(
      dataDe(rows, ['X', 'Y']),
      ['Covarianza'],
      { Covarianza: { columnaX: 'X', columnaY: 'Y' } }
    );
    const cov = res.resultados.Covarianza;
    expect(cov.error).toBeUndefined();
    expect(cov.covarianza).toBeCloseTo(10 / 3, 6);
    expect(cov.n).toBe(4);
  });

  test('el HTML muestra la tarjeta de covarianza', () => {
    const res = ED.ejecutarAnalisis(
      dataDe(rows, ['X', 'Y']),
      ['Covarianza'],
      { Covarianza: { columnaX: 'X', columnaY: 'Y' } }
    );
    const html = ED.generarHTML(res);
    expect(html).toContain('Covarianza');
    expect(html).toContain('3.3333');
    expect(html).not.toContain('Configuración no encontrada');
    expect(html).not.toContain('[object Object]');
  });
});

describe('Registro de pruebas de hipótesis', () => {
  test('Pareto y Covarianza están en HYPOTHESIS_SET', () => {
    expect(HYPOTHESIS_SET.has('Diagrama de Pareto')).toBe(true);
    expect(HYPOTHESIS_SET.has('Covarianza')).toBe(true);
  });
});
