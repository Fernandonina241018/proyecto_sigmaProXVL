import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

// StatsUtils/API_URL/escapeHtml etc. are loaded by setup.js
vm.runInThisContext(readFileSync(join(core, 'EstadisticaDescriptiva.js'), 'utf-8'));

const ED = EstadisticaDescriptiva;
function isReal(x) { return typeof x === 'number' && isFinite(x); }

const simpleData = [2, 4, 4, 4, 5, 5, 7, 9];
const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];
const z = [10, 2, 8, 1, 9];
const xReg = [1,2,3,4,5,6,7,8,9,10];
const yReg = [2.1,4.0,5.9,8.1,10.0,12.1,13.9,16.0,18.1,20.0];
const normalData = [48, 49, 50, 50, 50, 50, 50, 51, 52];

describe('ED — medidas básicas', () => {
  test('calcularMedia', () => {
    expect(ED.calcularMedia(simpleData)).toBeCloseTo(5, 6);
    expect(ED.calcularMedia([1, 2, 3])).toBeCloseTo(2, 6);
    expect(ED.calcularMedia([10])).toBe(10);
  });

  test('calcularMediana', () => {
    expect(ED.calcularMediana(simpleData)).toBeCloseTo(4.5, 6);
    expect(ED.calcularMediana([1, 2, 3])).toBe(2);
    expect(ED.calcularMediana([1, 2, 3, 4])).toBeCloseTo(2.5, 6);
  });

  test('calcularModa returns array', () => {
    expect(ED.calcularModa(simpleData)).toEqual([4]);
    expect(ED.calcularModa([1, 1, 2, 3])).toEqual([1]);
  });

  test('calcularVarianza', () => {
    expect(ED.calcularVarianza(simpleData, true)).toBeCloseTo(4.571428571, 6);
    expect(ED.calcularVarianza(simpleData, false)).toBeCloseTo(4, 6);
  });

  test('calcularDesviacionEstandar', () => {
    expect(ED.calcularDesviacionEstandar(simpleData, true)).toBeCloseTo(2.138089935, 6);
    expect(ED.calcularDesviacionEstandar(simpleData, false)).toBeCloseTo(2, 6);
  });

  test('calcularRango', () => {
    expect(ED.calcularRango(simpleData)).toBe(7);
  });

  test('calcularCoeficienteVariacion', () => {
    expect(ED.calcularCoeficienteVariacion(simpleData)).toBeCloseTo(42.7617987, 3);
  });

  test('calcularPercentil', () => {
    expect(ED.calcularPercentil(simpleData, 50)).toBeCloseTo(4.5, 6);
    expect(ED.calcularPercentil(simpleData, 25)).toBeCloseTo(4, 6);
    expect(ED.calcularPercentil(simpleData, 75)).toBeCloseTo(5.5, 6);
  });

  test('calcularCuartiles', () => {
    const q = ED.calcularCuartiles(simpleData);
    expect(q.Q1).toBeCloseTo(4, 6);
    expect(q.Q2).toBeCloseTo(4.5, 6);
    expect(q.Q3).toBeCloseTo(5.5, 6);
  });

  test('calcularIQR', () => {
    expect(ED.calcularIQR(simpleData)).toBeCloseTo(1.5, 6);
  });

  test('calcularAsimetria', () => {
    expect(ED.calcularAsimetria(simpleData)).toBeGreaterThan(0);
  });

  test('calcularCurtosis returns number', () => {
    expect(typeof ED.calcularCurtosis(simpleData)).toBe('number');
  });

  test('calcularErrorEstandar', () => {
    expect(ED.calcularErrorEstandar(simpleData)).toBeCloseTo(2.138089935 / Math.sqrt(8), 6);
  });
});

describe('ED — correlaciones', () => {
  test('Pearson r=1 for perfect corr', () => {
    const r = ED.calcularCorrelacionPearson(x, y);
    expect(r.r).toBeCloseTo(1, 10);
    expect(r.pValue).toBeLessThan(0.05);
  });

  test('Pearson low for uncorr', () => {
    expect(Math.abs(ED.calcularCorrelacionPearson(x, z).r)).toBeLessThan(0.5);
  });

  test('Spearman rho=1 for perfect corr', () => {
    expect(ED.calcularCorrelacionSpearman(x, y).rho).toBeCloseTo(1, 10);
  });

  test('Kendall tau=1 for perfect corr', () => {
    const t = ED.calcularKendallTau(x, y);
    expect(t.tau).toBeCloseTo(1, 10);
    expect(t.significante).toBe(true);
  });

  test('calcularCovarianza (sample)', () => {
    // cov = sum((xi-mean_x)*(yi-mean_y))/(n-1) = 20/4 = 5
    expect(ED.calcularCovarianza(x, y)).toBeCloseTo(5, 6);
  });
});

describe('ED — errores', () => {
  test('RMSE', () => {
    expect(ED.calcularRMSE([1, 2, 3], [1.1, 2.1, 3.1])).toBeCloseTo(0.1, 6);
  });

  test('MAE', () => {
    expect(ED.calcularMAE([1, 2, 3], [1.1, 2.1, 3.1])).toBeCloseTo(0.1, 6);
  });

  test('R2 perfect', () => {
    expect(ED.calcularR2([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 10);
  });
});

describe('ED — tests de hipótesis', () => {
  test('T-Test una muestra', () => {
    const t = ED.calcularTTestUnaMuestra(normalData, 50);
    expect(isReal(t.estadisticoT)).toBe(true);
    expect(isReal(t.valorP)).toBe(true);
  });

  test('Jarque-Bera normalidad', () => {
    const n = ED.calcularTestNormalidad(normalData);
    expect(isReal(n.estadisticoJB)).toBe(true);
    expect(typeof n.esNormal).toBe('boolean');
  });

  test('Shapiro-Wilk', () => {
    const s = ED.calcularShapiroWilk(normalData);
    expect(isReal(s.estadisticoW)).toBe(true);
    expect(isReal(s.valorP)).toBe(true);
    expect(s.estadisticoW).toBeGreaterThan(0.8);
  });

  test('ANOVA one-way significativo', () => {
    const a = ED.calcularANOVA([[1,2,3,4,5], [6,7,8,9,10], [11,12,13,14,15]]);
    expect(isReal(a.estadisticoF)).toBe(true);
    expect(a.significativo).toBe(true);
  });

  test('Mann-Whitney U significativo', () => {
    const m = ED.calcularMannWhitneyU([1,2,3,4,5], [6,7,8,9,10]);
    expect(isReal(m.U)).toBe(true);
    expect(m.significativo).toBe(true);
  });

  test('Kruskal-Wallis significativo', () => {
    const k = ED.calcularKruskalWallis([[1,2,3,4,5], [6,7,8,9,10], [11,12,13,14,15]]);
    expect(isReal(k.H)).toBe(true);
    expect(k.significativo).toBe(true);
  });

  test('Chi-Cuadrado devuelve estadístico', () => {
    const c = ED.calcularChiCuadrado([[20, 30], [30, 20]]);
    expect(isReal(c.estadisticoChi2)).toBe(true);
  });
});

describe('ED — intervalos de confianza', () => {
  test('calcularIntervalosConfianza', () => {
    const ic = ED.calcularIntervalosConfianza(simpleData);
    expect(isReal(ic.ic95.inferior)).toBe(true);
    expect(ic.ic95.inferior).toBeLessThan(ic.ic95.superior);
  });
});

describe('ED — outlier detection', () => {
  test('detectarOutliersIQR', () => {
    const out = [1, 2, 3, 4, 5, 6, 7, 8, 9, 100];
    expect(ED.detectarOutliersIQR(out).length).toBeGreaterThan(0);
  });
});
