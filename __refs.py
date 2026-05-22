"""Generate reference values for all StatAnalyzer statistical functions using scipy."""
import json
import numpy as np
from scipy import stats as scipy_stats

refs = {}

# ── TEST DATASETS ──
A = [1.0, 2.0, 3.0, 4.0, 5.0]
B = [10.0, 20.0, 30.0, 40.0, 50.0]
C = [5.0, 5.0, 5.0, 5.0]  # edge: all same
D = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0]
E = [1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 4.0]  # non-normal

G1 = [2.0, 3.0, 4.0, 5.0, 6.0]
G2 = [7.0, 8.0, 9.0, 10.0, 11.0]

X = [1.0, 2.0, 3.0, 4.0, 5.0]
Y_perfect = [2.0, 4.0, 6.0, 8.0, 10.0]

# ── TIER 1: DESCRIPTIVE ──
refs['calcularMedia'] = {'A': float(np.mean(A)), 'B': float(np.mean(B)), 'C': float(np.mean(C))}
refs['calcularMediana'] = {'A': float(np.median(A)), 'B': float(np.median(B)), 'C': float(np.median(C))}
refs['calcularVarianza'] = {
    'A_pop': float(np.var(A, ddof=0)),
    'A_sample': float(np.var(A, ddof=1)),
    'B_pop': float(np.var(B, ddof=0)),
    'C_pop': float(np.var(C, ddof=0))
}
refs['calcularDesviacionEstandar'] = {
    'A_pop': float(np.std(A, ddof=0)),
    'A_sample': float(np.std(A, ddof=1))
}
refs['calcularRango'] = {'A': float(np.ptp(A)), 'B': float(np.ptp(B))}
refs['calcularCoeficienteVariacion'] = {
    'A': float(scipy_stats.variation(A, ddof=1) * 100),
    'B': float(scipy_stats.variation(B, ddof=1) * 100)
}
refs['calcularAsimetria'] = {
    'A': float(scipy_stats.skew(A, bias=True)),
    'A_unbiased': float(scipy_stats.skew(A, bias=False))
}
refs['calcularCurtosis'] = {
    # JS function returns bias-corrected excess kurtosis (= scipy bias=False, fisher=True)
    'A_fisher': float(scipy_stats.kurtosis(A, bias=False, fisher=True)),
    'A_Pearson': float(scipy_stats.kurtosis(A, bias=False, fisher=False))
}
refs['calcularErrorEstandar'] = {
    'A': float(np.std(A, ddof=1) / np.sqrt(len(A)))
}
refs['calcularPercentil'] = {
    'A_25': float(np.percentile(A, 25)),
    'A_50': float(np.percentile(A, 50)),
    'A_75': float(np.percentile(A, 75))
}
refs['calcularCuartiles'] = {
    'Q1': float(np.percentile(A, 25)),
    'Q2': float(np.percentile(A, 50)),
    'Q3': float(np.percentile(A, 75))
}

# ── TIER 2: HYPOTHESIS TESTS ──
# T-Test one sample: test if mean(D) == 5
t1_stat, t1_p = scipy_stats.ttest_1samp(D, 5.0)
refs['calcularTTestUnaMuestra'] = {
    'estadisticoT': float(t1_stat),
    'valorP': float(t1_p)
}

# T-Test two samples: G1 vs G2 (independent)
t2_stat, t2_p = scipy_stats.ttest_ind(G1, G2)
refs['calcularTTestDosMuestras'] = {
    'estadisticoT': float(t2_stat),
    'valorP': float(t2_p)
}

# ANOVA One-Way
f_stat, f_p = scipy_stats.f_oneway(G1, G2)
refs['calcularANOVAOneWay'] = {
    'estadisticoF': float(f_stat),
    'valorP': float(f_p)
}

# Mann-Whitney U
u_stat, u_p = scipy_stats.mannwhitneyu(G1, G2, alternative='two-sided')
refs['calcularMannWhitney'] = {
    'estadisticoU': float(u_stat),
    'valorP': float(u_p)
}

# Kruskal-Wallis (3 groups)
G3 = [1.0, 3.0, 5.0, 7.0, 9.0]
h_stat, kw_p = scipy_stats.kruskal(G1, G2, G3)
refs['calcularKruskalWallis'] = {
    'estadisticoH': float(h_stat),
    'valorP': float(kw_p)
}

# Wilcoxon signed-rank (paired: G1 vs [3,4,5,6,7] score shift)
wilcoxon_stat, wilcoxon_p = scipy_stats.wilcoxon(G1, [3,4,5,6,7], alternative='two-sided')
refs['calcularWilcoxon'] = {
    'estadisticoW': float(wilcoxon_stat),
    'valorP': float(wilcoxon_p)
}

# Shapiro-Wilk
sw_stat, sw_p = scipy_stats.shapiro(A)
refs['calcularShapiroWilk'] = {
    'estadisticoW': float(sw_stat),
    'valorP': float(sw_p)
}

# Jarque-Bera (Test de Normalidad)
jb_stat, jb_p = scipy_stats.jarque_bera(D)
refs['calcularTestNormalidad'] = {
    'estadisticoJB': float(jb_stat),
    'valorP': float(jb_p)
}

# Chi-Square goodness of fit
obs = [10, 12, 8, 10]
chi2_stat, chi2_p = scipy_stats.chisquare(obs)
refs['calcularChiCuadrado'] = {
    'estadisticoChi2': float(chi2_stat),
    'valorP': float(chi2_p)
}

# ── TIER 3: CORRELATION ──
X_corr_sp = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0])
Y_corr_sp = np.array([3.0, 5.0, 7.0, 9.0, 11.0, 13.0, 15.0, 17.0, 19.0, 21.0])

r_spearman, p_spearman = scipy_stats.spearmanr(X_corr_sp, Y_corr_sp)
refs['calcularCorrelacionSpearman'] = {
    'rho': float(r_spearman),
    'pValue': float(p_spearman)
}

r_kendall, p_kendall = scipy_stats.kendalltau(X_corr_sp, Y_corr_sp)
refs['calcularKendallTau'] = {
    'tau': float(r_kendall),
    'pValue': float(p_kendall)
}

# Covarianza (use X, Y_perfect for perfect cov)
cov_val = np.cov(X, Y_perfect, ddof=1)[0][1]
refs['calcularCovarianza'] = {
    'covarianza': float(cov_val)
}

# ── TIER 4: REGRESSION (use near-perfect data for non-degenerate stats) ──
from scipy.stats import linregress
X_reg = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0])
Y_reg = np.array([2.1, 4.2, 5.8, 8.3, 10.1, 11.9, 14.2, 15.8, 18.1, 20.0])
lr = linregress(X_reg, Y_reg)
t_stat = lr.slope / lr.stderr if lr.stderr > 0 else float('inf')
refs['calcularRegresionLinealSimple'] = {
    'a': float(lr.intercept),
    'b': float(lr.slope),
    'r2': float(lr.rvalue ** 2),
    'pPendiente': float(lr.pvalue),
    'tPendiente': float(t_stat),
    'errorEstandar': float(lr.stderr)
}

# Better correlation data (non-perfect for meaningful t/gl)
X_corr = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0])
Y_corr = np.array([1.8, 3.9, 5.2, 7.1, 9.3, 11.0, 13.2, 15.1, 17.0, 19.8])
r_p, p_p = scipy_stats.pearsonr(X_corr, Y_corr)
n_corr = len(X_corr)
t_corr = r_p * np.sqrt((n_corr - 2) / (1 - r_p**2))
refs['calcularCorrelacionPearson'] = {
    'r': float(r_p),
    'pValue': float(p_p),
    't': float(t_corr),
    'gl': n_corr - 2
}
# IC 95% for r via Fisher z-transform
z = np.arctanh(r_p)
se_z = 1.0 / np.sqrt(n_corr - 3)
ci_low = z - 1.96 * se_z
ci_up = z + 1.96 * se_z
refs['calcularCorrelacionPearson']['icRInferior'] = float(np.tanh(ci_low))
refs['calcularCorrelacionPearson']['icRSuperior'] = float(np.tanh(ci_up))

# ── TIER 5: OTHER ──
# Detección de Outliers (IQR method)
q1 = float(np.percentile(A, 25))
q3 = float(np.percentile(A, 75))
iqr = q3 - q1
refs['calcularOutliers'] = {
    'Q1': q1,
    'Q3': q3,
    'IQR': float(iqr),
    'limiteInferior': q1 - 1.5 * iqr,
    'limiteSuperior': q3 + 1.5 * iqr
}

# RMSE
y_true = np.array([2.0, 4.0, 6.0, 8.0, 10.0])
y_pred = np.array([1.8, 4.2, 5.9, 8.1, 10.2])
rmse = float(np.sqrt(np.mean((y_true - y_pred) ** 2)))
mae = float(np.mean(np.abs(y_true - y_pred)))
r2_score = 1 - np.sum((y_true - y_pred) ** 2) / np.sum((y_true - np.mean(y_true)) ** 2)
refs['calcularRMSE'] = {'rmse': rmse}
refs['calcularMAE'] = {'mae': mae}
refs['calcularR2'] = {'r2': float(r2_score)}

# Intervalos de Confianza (95%)
from scipy.stats import t as t_dist
n = len(A)
mean_a = float(np.mean(A))
se_a = float(np.std(A, ddof=1) / np.sqrt(n))
t_crit = float(t_dist.ppf(0.975, n - 1))
ci_low = mean_a - t_crit * se_a
ci_up = mean_a + t_crit * se_a
refs['calcularIntervalosConfianza'] = {
    'media': mean_a,
    'limiteInferior': ci_low,
    'limiteSuperior': ci_up,
    'nivelConfianza': 95
}

# Percentiles con método lineal (type=7 default en numpy)
for pct in [5, 10, 25, 50, 75, 90, 95]:
    val = float(np.percentile(A, pct))
    refs.setdefault('calcularPercentil', {})[f'p{pct}'] = val

with open('__refs.json', 'w') as f:
    json.dump(refs, f, indent=2)

print(f'[OK] Reference values generated: {len(refs)} functions')
for k in sorted(refs.keys()):
    print(f'  - {k}')
