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

describe('Integración — ANOVA Two-Way', () => {
  const rows = [
    { A: 'a1', B: 'b1', Y: 1 }, { A: 'a1', B: 'b1', Y: 2 }, { A: 'a1', B: 'b1', Y: 3 },
    { A: 'a1', B: 'b2', Y: 3 }, { A: 'a1', B: 'b2', Y: 4 }, { A: 'a1', B: 'b2', Y: 5 },
    { A: 'a2', B: 'b1', Y: 5 }, { A: 'a2', B: 'b1', Y: 6 }, { A: 'a2', B: 'b1', Y: 7 },
    { A: 'a2', B: 'b2', Y: 7 }, { A: 'a2', B: 'b2', Y: 8 }, { A: 'a2', B: 'b2', Y: 9 },
  ];

  test('usa todas las réplicas y conserva factor1/factor2 como objetos', () => {
    const res = ED.ejecutarAnalisis(
      dataDe(rows, ['A', 'B', 'Y']),
      ['ANOVA Two-Way'],
      { 'ANOVA Two-Way': { categoricalCols: ['A', 'B'], numericCol: 'Y' } }
    );
    const a = res.resultados['ANOVA Two-Way'];
    expect(a.error).toBeUndefined();
    expect(a.factor1.F).toBeCloseTo(48, 6);
    expect(a.factor2.F).toBeCloseTo(12, 6);
    expect(a.interaccion.F).toBeCloseTo(0, 6);
    expect(a.residual.SS).toBeCloseTo(8, 6);
    expect(a.n).toBe(12);
    expect(a.factor1Nombre).toBe('A');
    expect(a.factor2Nombre).toBe('B');
  });

  test('el HTML muestra F/p y no imprime [object Object]', () => {
    const res = ED.ejecutarAnalisis(
      dataDe(rows, ['A', 'B', 'Y']),
      ['ANOVA Two-Way'],
      { 'ANOVA Two-Way': { categoricalCols: ['A', 'B'], numericCol: 'Y' } }
    );
    const html = ED.generarHTML(res);
    expect(html).toContain('ANOVA Two-Way');
    expect(html).toContain('F Interacción');
    expect(html).toContain('48.0000');
    expect(html).not.toContain('[object Object]');
    expect(html).not.toContain('Tipo de prueba no reconocido');
  });
});

describe('Integración — PCA y Análisis Factorial', () => {
  const rows = Array.from({ length: 13 }, (_, i) => ({
    P1: i + 1,
    P2: i === 6 ? '' : i * 2 + (i % 2),
    P3: i * 3 - (i % 3),
  }));

  test('PCA descarta filas incompletas y no cae en el render genérico', () => {
    const res = ED.ejecutarAnalisis(
      dataDe(rows, ['P1', 'P2', 'P3']),
      ['PCA (Componentes Principales)'],
      { 'PCA (Componentes Principales)': { columnas: ['P1', 'P2', 'P3'] } }
    );
    const pca = res.resultados['PCA (Componentes Principales)'];
    expect(pca.error).toBeUndefined();
    expect(pca.nObservaciones).toBe(12);
    const html = ED.generarHTML(res);
    expect(html).toContain('PCA');
    expect(html).not.toContain('Tipo de prueba no reconocido');
  });

  test('Análisis Factorial se renderiza con su tarjeta propia', () => {
    const res = ED.ejecutarAnalisis(
      dataDe(rows, ['P1', 'P2', 'P3']),
      ['Análisis Factorial'],
      { 'Análisis Factorial': { columnas: ['P1', 'P2', 'P3'] } }
    );
    const af = res.resultados['Análisis Factorial'];
    expect(af.error).toBeUndefined();
    const html = ED.generarHTML(res);
    expect(html).toContain('Análisis Factorial');
    expect(html).not.toContain('Tipo de prueba no reconocido');
  });
});

describe('Lote 4 — umbrales y determinismo', () => {
  test('Series Temporales exige el mínimo del catálogo (20)', () => {
    const rows = Array.from({ length: 10 }, (_, i) => ({ T: i + 1 }));
    const res = ED.ejecutarAnalisis(
      dataDe(rows, ['T']),
      ['Series Temporales'],
      { 'Series Temporales': { numericCol: 'T', periodo: 2 } }
    );
    expect(res.resultados['Series Temporales'].error).toContain('20');
  });

  test('Clúster con la misma semilla es reproducible', () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({ C1: i, C2: i * 2 + (i % 3) }));
    const cfg = { 'Análisis de Cluster': { columnas: ['C1', 'C2'], k: 2, semilla: 42 } };
    const a = ED.ejecutarAnalisis(dataDe(rows, ['C1', 'C2']), ['Análisis de Cluster'], cfg).resultados['Análisis de Cluster'];
    const b = ED.ejecutarAnalisis(dataDe(rows, ['C1', 'C2']), ['Análisis de Cluster'], cfg).resultados['Análisis de Cluster'];
    expect(a.error).toBeUndefined();
    expect(a.semilla).toBe(42);
    expect(a.inertia).toBe(b.inertia);
    expect(Array.from(a.labels)).toEqual(Array.from(b.labels));
  });

  test('normalidad no paramétrica usa su renderer específico', () => {
    const rows = Array.from({ length: 40 }, (_, i) => ({ V: 10 + (i % 7) }));
    for (const stat of ['Test de Kolmogorov-Smirnov', 'Test de Anderson-Darling', "Test de D'Agostino-Pearson"]) {
      const res = ED.ejecutarAnalisis(dataDe(rows, ['V']), [stat], {});
      expect(res.resultados[stat].error).toBeUndefined();
      const html = ED.generarHTML(res);
      expect(html).not.toContain('Tipo de prueba no reconocido');
      expect(html).not.toContain('ar-error');
    }
  });
});

describe('Registro de pruebas de hipótesis', () => {
  test('Pareto y Covarianza están en HYPOTHESIS_SET', () => {
    expect(HYPOTHESIS_SET.has('Diagrama de Pareto')).toBe(true);
    expect(HYPOTHESIS_SET.has('Covarianza')).toBe(true);
  });
});

describe('Lote 2 — corrección estadística', () => {
  test('T-Test de una muestra usa μ₀ y la alternativa configuradas', () => {
    const rows = [{ V: 10.2 }, { V: 9.8 }, { V: 10.1 }, { V: 9.9 }, { V: 10.0 }];
    const base = { headers: ['V'], data: rows, rowCount: rows.length };
    const conCero = ED.ejecutarAnalisis(base, ['T-Test (una muestra)'], {
      'T-Test (una muestra)': { numericCol: 'V', mediaHipotesis: 0, alternativa: 'bilateral' },
    }).resultados['T-Test (una muestra)'].V;
    const conDiez = ED.ejecutarAnalisis(base, ['T-Test (una muestra)'], {
      'T-Test (una muestra)': { numericCol: 'V', mediaHipotesis: 10, alternativa: 'bilateral' },
    }).resultados['T-Test (una muestra)'].V;
    expect(conCero.mediaHipotesis).toBe(0);
    expect(conDiez.mediaHipotesis).toBe(10);
    expect(Math.abs(conCero.estadisticoT)).toBeGreaterThan(Math.abs(conDiez.estadisticoT));
    expect(conDiez.alternativa).toBe('bilateral');
  });

  test('Bootstrap es determinista con la misma semilla y usa la columna configurada', () => {
    const rows = Array.from({ length: 20 }, (_, i) => ({ A: i + 1, B: 100 + i }));
    const base = { headers: ['A', 'B'], data: rows, rowCount: rows.length };
    const cfg = { numericCol: 'B', estadistico: 'media', iteraciones: 300, nivelConfianza: 0.95, semilla: 7 };
    const r1 = ED.ejecutarAnalisis(base, ['Bootstrap'], { Bootstrap: cfg }).resultados.Bootstrap;
    const r2 = ED.ejecutarAnalisis(base, ['Bootstrap'], { Bootstrap: cfg }).resultados.Bootstrap;
    const r3 = ED.ejecutarAnalisis(base, ['Bootstrap'], { Bootstrap: { ...cfg, semilla: 8 } }).resultados.Bootstrap;
    expect(r1.columna).toBe('B');
    expect(r1.ic).toEqual(r2.ic);
    expect(r1.se_bootstrap).toBe(r2.se_bootstrap);
    expect(r1.semilla).toBe(7);
    expect(r1.ic.inferior).not.toBe(r3.ic.inferior);
  });

  test('MAE y R² alinean los pares por fila (huecos en filas distintas)', () => {
    const rows = [
      { Obs: 1, Pred: 1 },
      { Obs: '', Pred: 2 },
      { Obs: 3, Pred: '' },
      { Obs: 4, Pred: 4 },
    ];
    const base = { headers: ['Obs', 'Pred'], data: rows, rowCount: rows.length };
    const mae = ED.ejecutarAnalisis(base, ['MAE'], {
      MAE: { columnaObservada: 'Obs', columnaPredicha: 'Pred' },
    }).resultados.MAE;
    const r2 = ED.ejecutarAnalisis(base, ['R² (Coef. Determinación)'], {
      'R² (Coef. Determinación)': { columnaObservada: 'Obs', columnaPredicha: 'Pred' },
    }).resultados['R² (Coef. Determinación)'];
    expect(mae.n).toBe(2);
    expect(mae.mae).toBe(0);
    expect(r2.n).toBe(2);
    expect(r2.r2).toBeCloseTo(1, 10);
  });

  test('Regresión Polinomial, Logística, TOST y calibración alinean por fila', () => {
    const rows = Array.from({ length: 14 }, (_, i) => ({
      X: i + 1,
      Y: i === 3 ? '' : (i + 1) * (i + 1),
      Bin: i === 5 ? '' : (i % 2),
      X2: i === 8 ? '' : (i + 2),
      Conc: i === 2 ? '' : i + 1,
      Senal: i === 2 ? '' : 3 * (i + 1) + 1,
    }));
    const base = { headers: Object.keys(rows[0]), data: rows, rowCount: rows.length };

    const poli = ED.ejecutarAnalisis(base, ['Regresión Polinomial'], {
      'Regresión Polinomial': { columnaX: 'X', columnaY: 'Y', grado: 2 },
    }).resultados['Regresión Polinomial'];
    expect(poli.error).toBeUndefined();
    expect(poli.n).toBe(13);

    const logit = ED.ejecutarAnalisis(base, ['Regresión Logística'], {
      'Regresión Logística': { columnaY: 'Bin', columnasX: ['X2'], columnas: ['X2'] },
    }).resultados['Regresión Logística'];
    expect(logit.error).toBeUndefined();
    expect(logit.n).toBe(12);

    const tost = ED.ejecutarAnalisis(base, ['Test TOST (Equivalencia)'], {
      'Test TOST (Equivalencia)': { columnaX: 'X', columnaY: 'Conc', delta: 0.5 },
    }).resultados['Test TOST (Equivalencia)'];
    expect(tost.n1).toBe(13);
    expect(tost.n2).toBe(13);

    const calib = ED.ejecutarAnalisis(base, ['LOD (Curva de Calibración)'], {
      'LOD (Curva de Calibración)': { columnaX: 'Conc', columnaY: 'Senal' },
    }).resultados['LOD (Curva de Calibración)'];
    expect(calib.error).toBeUndefined();
    expect(calib.n).toBe(13);
  });

  test('aplica minMuestra del catálogo en ejecutarAnalisis', () => {
    const rows = [{ V: 1 }, { V: 2 }, { V: 3 }];
    const res = ED.ejecutarAnalisis(
      { headers: ['V'], data: rows, rowCount: rows.length },
      ['Test de Kolmogorov-Smirnov'],
      { 'Test de Kolmogorov-Smirnov': { numericCol: 'V' } }
    );
    expect(res.resultados['Test de Kolmogorov-Smirnov'].error).toContain('al menos 5');
  });

  test('ANOVA no sobrescribe `grupos` y expone etiquetas aparte', () => {
    const rows = [];
    ['A', 'B', 'C'].forEach((g, gi) => {
      for (let i = 0; i < 6; i++) rows.push({ G: g, V: 10 + gi * 5 + i * 0.1 });
    });
    const anova = ED.ejecutarAnalisis(
      { headers: ['G', 'V'], data: rows, rowCount: rows.length },
      ['ANOVA One-Way'],
      { 'ANOVA One-Way': { categoricalCols: ['G'], numericCol: 'V' } }
    ).resultados['ANOVA One-Way'];
    expect(anova.grupos).toBe(3);
    expect(anova.etiquetasGrupos).toEqual(['A', 'B', 'C']);
    const html = ED.generarHTML({ resultados: { 'ANOVA One-Way': anova }, totalFilas: 18, totalColumnas: 2, columnasAnalizadas: ['V'], estadisticos: ['ANOVA One-Way'] });
    expect(html).toContain('A, B, C');
  });

  test('LDA usa autovalores simétricos y clasifica clases separadas', () => {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      rows.push({ G: 'A', X1: i, X2: i * 0.5 + (i % 3) });
      rows.push({ G: 'B', X1: 100 + i, X2: 100 + i * 0.5 + (i % 3) });
    }
    const res = ED.ejecutarAnalisis(
      { headers: ['G', 'X1', 'X2'], data: rows, rowCount: rows.length },
      ['Análisis Discriminante'],
      { 'Análisis Discriminante': { categoricalCols: ['G'], columnas: ['X1', 'X2'] } }
    ).resultados['Análisis Discriminante'];
    expect(res.error).toBeUndefined();
    expect(res.accuracy).toBeCloseTo(1, 10);
    expect(res.lambda).toBeGreaterThan(0);
    expect(res.funcionesDiscriminantes).toBe(1);
  });

  test('MANOVA usa la F de Rao estándar sobre la traza de Pillai', () => {
    const rows = [];
    ['A', 'B', 'C'].forEach((g, gi) => {
      for (let i = 0; i < 12; i++) rows.push({ G: g, X1: gi * 10 + i, X2: gi * 10 + i * 2 });
    });
    const res = ED.ejecutarAnalisis(
      { headers: ['G', 'X1', 'X2'], data: rows, rowCount: rows.length },
      ['M-ANOVA'],
      { 'M-ANOVA': { categoricalCols: ['G'], columnas: ['X1', 'X2'] } }
    ).resultados['M-ANOVA'];
    expect(res.error).toBeUndefined();
    const s = Math.min(2, 3 - 1);
    expect(res.gl1).toBe(4);
    expect(res.gl2).toBe(s * (36 - 2 + s));
    expect(res.F).toBeCloseTo((res.gl2 / res.gl1) * (res.pillai / (s - res.pillai)), 3);
  });
});
