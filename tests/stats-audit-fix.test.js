// Tests de regresión — remediación auditoría estadística (SEVERE + MODERATE).
// Valida: erf/CDF_T, SE OLS (diagonal), Shapiro-Royston (Monte-Carlo),
// Wilcoxon (empates /48), Signos (CC), Pearson IC (z=1.96), Kendall (empates),
// LDA (p, Mahalanobis, labels), pairing por filas, tests unilaterales.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');
// EstadisticaDescriptiva no está en setup.js: cargarla aquí igual que setup (getPairedValues)
vm.runInThisContext(readFileSync(join(core, 'EstadisticaDescriptiva.js'), 'utf-8') + '\n;globalThis.__ED = EstadisticaDescriptiva;');

const C = window.__StatsCore;
const ED = globalThis.__ED;

// PRNG determinista (mulberry32) para Monte-Carlo reproducible
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randn(rng) {
  const u1 = Math.max(1e-12, rng()), u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

describe('FIX-AUDIT SEVERE-1: erf() y CDF_T (p=1 para n>120)', () => {
  test('erf coincide con valores de referencia A&S (|err|<1e-6; antes→0 con x grande)', () => {
    expect(C.erf(0)).toBeCloseTo(0, 12);
    expect(Math.abs(C.erf(1) - 0.8427007929)).toBeLessThan(1e-6);
    expect(Math.abs(C.erf(2) - 0.9953222650)).toBeLessThan(1e-6);
    expect(C.erf(-1)).toBeCloseTo(-C.erf(1), 12);
    expect(C.erf(6)).toBeGreaterThan(0.999999); // antes → 0 (bug)
  });
  test('calcularCDF_T rama df>120 (erf) es correcta', () => {
    expect(C.calcularCDF_T(1.96, 500)).toBeCloseTo(0.9750, 3);
    expect(C.calcularCDF_T(3, 200)).toBeCloseTo(0.9986, 3);
  });
  test('calcularCDF_T rama df<=120 (beta) es correcta', () => {
    expect(C.calcularCDF_T(0.5, 10)).toBeCloseTo(0.6861, 3);
    expect(C.calcularCDF_T(0, 5)).toBe(0.5);
  });
  test('regresión simple n=150 con señal fuerte: pPendiente << 1 (antes =1)', () => {
    const rng = mulberry32(7);
    const xs = [], ys = [];
    for (let i = 0; i < 150; i++) { const x = rng() * 10; xs.push(x); ys.push(2 * x + 1 + (rng() - 0.5)); }
    const r = C.calcularRegresionLinealSimple(xs, ys);
    expect(r.error).toBeUndefined();
    expect(r.pPendiente).toBeLessThan(1e-10);
    expect(r.significante).toBe(true);
  });
});

describe('FIX-AUDIT SEVERE-2: SE de OLS múltiple (diagonal de (X\'X)⁻¹)', () => {
  // Solver independiente (Gauss-Jordan con pivoteo) para referencia
  function solveInv(A) {
    const n = A.length;
    const M = A.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))]);
    for (let c = 0; c < n; c++) {
      let piv = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
      [M[c], M[piv]] = [M[piv], M[c]];
      const d = M[c][c];
      for (let j = 0; j < 2 * n; j++) M[c][j] /= d;
      for (let r = 0; r < n; r++) {
        if (r === c) continue;
        const f = M[r][c];
        for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[c][j];
      }
    }
    return M.map(row => row.slice(n));
  }
  test('ee de cada coeficiente = sqrt(s²·diag((X\'X)⁻¹))', () => {
    const rng = mulberry32(21);
    const X = [];
    for (let i = 0; i < 30; i++) X.push([rng() * 10, rng() * 5 + i * 0.1]);
    const y = X.map(r => 1 + 2 * r[0] - 1.5 * r[1] + randn(rng) * 0.5);
    const res = C.calcularRegresionMultiple(X, y);
    // Referencia independiente
    const Xd = X.map(r => [1, ...r]);
    const XtX = Xd[0].map((_, j) => Xd[0].map((_, k) => Xd.reduce((s, row) => s + row[j] * row[k], 0)));
    const inv = solveInv(XtX);
    const pred = Xd.map(row => row.reduce((s, v, j) => s + v * res.betas[j], 0));
    const s2 = y.reduce((s, yi, i) => s + (yi - pred[i]) ** 2, 0) / (y.length - 3);
    res.coeficientes.forEach((c, i) => {
      expect(c.ee).toBeCloseTo(Math.sqrt(Math.max(0, inv[i][i]) * s2), 3);
      expect(c.ee).toBeGreaterThan(0);
      expect(isFinite(c.ee)).toBe(true);
    });
  });
});

describe('FIX-AUDIT SEVERE-3: Shapiro-Wilk p por Royston (no fabricado)', () => {
  test('p en (0,1) y W en (0,1] para datos normales', () => {
    const rng = mulberry32(3);
    const v = Array.from({ length: 50 }, () => randn(rng));
    const r = C.calcularShapiroWilk(v);
    expect(r.error).toBeUndefined();
    expect(r.estadisticoW).toBeGreaterThan(0);
    expect(r.estadisticoW).toBeLessThanOrEqual(1);
    expect(r.valorP).toBeGreaterThan(0);
    expect(r.valorP).toBeLessThan(1);
  });
  test('calibración Monte-Carlo bajo H0: tasa de rechazo ≈5% (n=30, 300 reps)', () => {
    const rng = mulberry32(99);
    let rechazos = 0;
    const REPS = 300;
    for (let k = 0; k < REPS; k++) {
      const v = Array.from({ length: 30 }, () => randn(rng));
      if (C.calcularShapiroWilk(v).valorP < 0.05) rechazos++;
    }
    const tasa = rechazos / REPS;
    expect(tasa).toBeGreaterThan(0.015);
    expect(tasa).toBeLessThan(0.10);
  });
  test('potencia: datos exponenciales se rechazan mayoritariamente', () => {
    const rng = mulberry32(5);
    let rechazos = 0;
    for (let k = 0; k < 60; k++) {
      const v = Array.from({ length: 50 }, () => -Math.log(Math.max(1e-12, rng())));
      if (C.calcularShapiroWilk(v).valorP < 0.05) rechazos++;
    }
    expect(rechazos / 60).toBeGreaterThan(0.8);
  });
  test('n=3 no rompe y n=5000 corre', () => {
    const r3 = C.calcularShapiroWilk([1.2, 2.5, 1.8]);
    expect(r3.error).toBeUndefined();
    expect(isFinite(r3.valorP)).toBe(true);
    const rng = mulberry32(11);
    const big = Array.from({ length: 2000 }, () => randn(rng));
    const rb = C.calcularShapiroWilk(big);
    expect(rb.error).toBeUndefined();
    expect(rb.valorP).toBeGreaterThan(0.01); // normales grandes → no se rechaza
  });
});

describe('FIX-AUDIT SEVERE-4: LDA (p, Mahalanobis, labels)', () => {
  test('grupos separados con labels string: significativo, accuracy 1, confusión diagonal', () => {
    const rng = mulberry32(13);
    const dm = [];
    for (let i = 0; i < 20; i++) dm.push([randn(rng), randn(rng)]);
    for (let i = 0; i < 20; i++) dm.push([5 + randn(rng), 5 + randn(rng)]);
    const lb = [...Array(20).fill('A'), ...Array(20).fill('B')];
    const r = C.calcularDiscriminante(dm, lb);
    expect(r.error).toBeUndefined();
    expect(r.p).toBeLessThan(0.05); // antes: decisión invertida ("no significativa")
    expect(r.accuracy).toBe(1);
    expect(r.matrizConfusion).toEqual([[20, 0], [0, 20]]); // antes: matriz de ceros
    expect(r.clasificacion.slice(0, 5)).toEqual(['A', 'A', 'A', 'A', 'A']);
  });
  test('grupos indistinguibles: no significativo', () => {
    const rng = mulberry32(17);
    const dm = [];
    for (let i = 0; i < 30; i++) dm.push([randn(rng), randn(rng)]);
    for (let i = 0; i < 30; i++) dm.push([randn(rng) * 1.0 + 0.1, randn(rng)]);
    const lb = [...Array(30).fill('X'), ...Array(30).fill('Y')];
    const r = C.calcularDiscriminante(dm, lb);
    expect(r.error).toBeUndefined();
    expect(r.p).toBeGreaterThan(0.05);
  });
});

describe('FIX-AUDIT MODERATE: Signos, Wilcoxon, Pearson IC, Kendall', () => {
  test('Signos: 9/10 positivos → p≈0.0269 (golden binomial+CC correcta)', () => {
    const d1 = Array(10).fill(0);
    const d2 = [1, 1, 1, 1, 1, 1, 1, 1, 1, -1];
    const r = C.calcularTestSignos(d1, d2);
    expect(r.positivos).toBe(9);
    expect(r.negativos).toBe(1);
    expect(r.valorP).toBeCloseTo(0.0269, 3); // antes (CC mal): ≈0.0044
    expect(r.significativo).toBe(true);
  });
  test('Wilcoxon: W hand-verificado y p en rango', () => {
    const d1 = [0, 0, 0, 0, 0, 0, 0, 0];
    const d2 = [3, 1, 4, 1, 5, -2, 6, -1];
    const r = C.calcularWilcoxon(d1, d2);
    expect(r.W).toBe(6);
    expect(r.Wpositivo).toBe(30);
    expect(r.Wnegativo).toBe(6);
    // varW = 8·9·17/24 − (3³−3)/48 = 50.5; z = −12/√50.5; p = 2(1−Φ(|z|)) ≈ 0.0913
    expect(r.valorP).toBeCloseTo(0.0913, 3);
  });
  test('Pearson IC usa z=1.96 (no t-crítico): coincide con Fisher independiente', () => {
    const rng = mulberry32(23);
    const x = Array.from({ length: 12 }, (_, i) => i + 1);
    const y = x.map(v => 3 * v + randn(rng));
    const r = C.calcularCorrelacionPearson(x, y);
    const rr = r.r;
    const z = 0.5 * Math.log((1 + rr) / (1 - rr));
    const se = 1 / Math.sqrt(12 - 3);
    const lo = (Math.exp(2 * (z - 1.96 * se)) - 1) / (Math.exp(2 * (z - 1.96 * se)) + 1);
    const hi = (Math.exp(2 * (z + 1.96 * se)) - 1) / (Math.exp(2 * (z + 1.96 * se)) + 1);
    expect(r.ic95Lower).toBeCloseTo(lo, 4);
    expect(r.ic95Upper).toBeCloseTo(hi, 4);
  });
  test('Kendall: monótona tau=1, inversa tau=-1, empates dobles sin NaN, todo-empatado lanza', () => {
    expect(C.calcularKendallTau([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]).tau).toBeCloseTo(1, 6);
    expect(C.calcularKendallTau([1, 2, 3, 4, 5], [5, 4, 3, 2, 1]).tau).toBeCloseTo(-1, 6);
    const tied = C.calcularKendallTau([1, 1, 2, 2], [1, 1, 2, 2]);
    expect(tied.tau).toBeCloseTo(1, 6);
    expect(isFinite(tied.p)).toBe(true);
    expect(() => C.calcularKendallTau([1, 1, 1], [2, 2, 2])).toThrow();
  });
});

describe('FIX-AUDIT: pairing por filas (getPairedValues)', () => {
  const data = {
    headers: ['A', 'B'],
    data: [
      { A: '1', B: '10' },
      { A: 'mal', B: '20' }, // NaN en A fila 2
      { A: '3', B: '' },     // NaN en B fila 3
      { A: '4', B: '40' },
    ],
  };
  test('conserva solo filas completas y alineadas', () => {
    const [a, b] = ED.getPairedValues(data, ['A', 'B']);
    expect(a).toEqual([1, 4]);
    expect(b).toEqual([10, 40]);
  });
  test('soporta filas array y columna inexistente → []', () => {
    const arr = { headers: ['A', 'B'], data: [[1, 2], ['x', 3], [4, 5]] };
    expect(ED.getPairedValues(arr, ['A', 'B'])).toEqual([[1, 4], [2, 5]]);
    expect(ED.getPairedValues(arr, ['A', 'ZZZ'])).toEqual([]);
    expect(ED.getPairedValues(null, ['A'])).toEqual([]);
  });
});

describe('FIX-AUDIT: tests unilaterales (antes muertos)', () => {
  test('t una muestra: p_mayor ≈ p_bil/2, p_menor ≈ 1-p_bil/2, default bilateral intacto', () => {
    const rng = mulberry32(31);
    const v = Array.from({ length: 25 }, () => 0.8 + randn(rng) * 0.5);
    const bil = C.calcularTTestUnaMuestra(v, 0);
    const may = C.calcularTTestUnaMuestra(v, 0, 'mayor');
    const men = C.calcularTTestUnaMuestra(v, 0, 'menor');
    expect(bil.alternativa).toBe('bilateral');
    expect(may.alternativa).toBe('mayor');
    expect(may.valorP).toBeCloseTo(bil.valorP / 2, 6);
    expect(men.valorP).toBeCloseTo(1 - bil.valorP / 2, 6);
    expect(may.interpretacion).toMatch(/mayor que/);
  });
  test('Wilcoxon/Signos/Pearson/Kendall/MW unilaterales coherentes', () => {
    const rng = mulberry32(37);
    const d1 = Array.from({ length: 30 }, () => randn(rng));
    const d2 = d1.map(v => v + 1.2 + randn(rng) * 0.3);
    const wB = C.calcularWilcoxon(d1, d2), wM = C.calcularWilcoxon(d1, d2, 'mayor');
    expect(wM.valorP).toBeLessThan(wB.valorP);
    expect(wM.valorP).toBeCloseTo(wB.valorP / 2, 4);
    // Efecto moderado para Signos (con efecto enorme p redondea a 0 en 6 decimales)
    const e1 = Array.from({ length: 30 }, () => randn(rng));
    const e2 = e1.map(v => v + 0.55 + randn(rng));
    const sB = C.calcularTestSignos(e1, e2), sM = C.calcularTestSignos(e1, e2, 'mayor');
    expect(sB.valorP).toBeGreaterThan(0);
    expect(sM.valorP).toBeLessThan(sB.valorP);
    expect(sM.valorP).toBeCloseTo(sB.valorP / 2, 2);
    const x = Array.from({ length: 30 }, (_, i) => i + randn(rng));
    const y = x.map(v => 2 * v + randn(rng));
    const pB = C.calcularCorrelacionPearson(x, y), pM = C.calcularCorrelacionPearson(x, y, 'mayor');
    expect(pM.p).toBeCloseTo(pB.p / 2, 6);
    const kB = C.calcularKendallTau(x, y), kM = C.calcularKendallTau(x, y, 'mayor');
    expect(kM.p).toBeCloseTo(kB.p / 2, 6);
    const g1 = Array.from({ length: 25 }, () => randn(rng));
    const g2 = Array.from({ length: 25 }, () => 1 + randn(rng));
    const mB = C.calcularMannWhitneyU(g1, g2), mM = C.calcularMannWhitneyU(g1, g2, 'menor');
    expect(mM.valorP).toBeLessThan(mB.valorP);
  });
});
