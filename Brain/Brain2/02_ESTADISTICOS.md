# 02 — Estadísticos

**Config:** `estadisticosConfig.js` · **Código:** `EstadisticaDescriptiva.js`

## Resumen

| | |
|-|-|
| Total | 51 |
| Implementados | 44 |
| Pendientes | 7 |

**Leyenda:** ✅ OK · ⚠️ revisar · ❌ no impl. · 🔴 alta complejidad

## Descriptiva (13) — ✅

| Test | Función | Nota |
|------|---------|------|
| Media | `calcularMedia` | |
| Mediana / Moda | `calcularMedianaModa` | Compartida |
| DE / Varianza | `calcularDesviacionEstandar` / `calcularVarianza` | Bessel n−1 |
| Percentiles | `calcularPercentiles` | Interpolación NIST |
| Rango | `calcularRango` | |
| CV | `calcularCoeficienteVariacion` | media≠0 |
| Asimetría / Curtosis | `calcularAsimetria` / `calcularCurtosis` | Exceso −3 |
| Error estándar | `calcularErrorEstandar` | |
| IC | `calcularIntervalosConfianza` | t, 90/95/99% |
| Outliers | `detectarOutliers` | IQR + Z |

## Hipótesis — normalidad (5) — ✅

| Test | Función | Nota |
|------|---------|------|
| JB | `calcularTestNormalidad` | |
| Shapiro-Wilk | `calcularShapiroWilk` | Tabulado, max n |
| K-S | `calcularKolmogorovSmirnov` | Lilliefors |
| Anderson-Darling | `calcularAndersonDarling` | |
| D'Agostino-Pearson | `calcularDAgostinoPearson` | K² |

## Hipótesis — otras (6) — ✅

| Test | Función | Nota |
|------|---------|------|
| T 1 muestra | `calcularTTestUnaMuestra` | Cohen d |
| T 2 muestras | `calcularTTestDosMuestras` | Welch |
| ANOVA 1-way | `calcularANOVAOneWay` | η² |
| ANOVA 2-way | `calcularANOVATwoWay` | SS tipo III |
| Chi² | `calcularChiCuadrado` | Cramér |
| TOST | `calcularTOST` | IC90% |

## Correlación (4) — ✅

Pearson, Spearman, Kendall (`calcularCorrelacion*`), Covarianza.

## Regresión (7) — ✅

Lineal simple/múltiple, polinomial, logística (IRLS), RMSE, MAE, R² (+ adj).

## No paramétricos (5) — ✅

Mann-Whitney, Kruskal-Wallis, Wilcoxon, Friedman, Signos — corrección empates.

## Multivariado (5) — 2/5

| Test | Función | Estado |
|------|---------|--------|
| PCA | `calcularPCA` | ✅ Jacobi |
| Análisis factorial | `calcularAnalisisFactorial` | ✅ KMO, Bartlett |
| K-Medias | `calcularCluster` | ❌ 🔴 |
| LDA | `calcularDiscriminante` | ❌ 🔴 |
| MANOVA | `calcularMANOVA` | ❌ 🔴 |

## Extras (5) — 1/5

| Test | Función | Estado |
|------|---------|--------|
| Bootstrap | `calcularBootstrap` | ✅ B≥1000 |
| Series temporales | `calcularSeriesTemporales` | ❌ 🔴 |
| Supervivencia | `calcularSupervivencia` | ❌ 🔴 |
| Modelos mixtos | `calcularModelosMixtos` | ❌ 🔴 |
| Bayesiano | `calcularBayesiano` | ❌ 🔴 |

## Especificación (1) — ✅

Límites cuantificación — LOD 3σ, LOQ 10σ.

## Calidad (1) — ✅

Pareto 80/20.

## Prioridades

**P1:** K-Medias → LDA → MANOVA  
**P2:** Series → Supervivencia → Modelos mixtos → Bayesiano

## Contrato retorno

```js
// OK
{ ...config.salidas, n, advertencias?: string[] }

// Error
{ error: string, codigo: 'MIN_MUESTRA'|'DATOS_INVALIDOS'|'FUERA_DE_RANGO'|... }
```

**Pre-cálculo:** `n >= minMuestra` · `n <= maxMuestra` si existe · filtrar NaN/null + advertir.

## Checklist nuevo test

1. Entrada en `ESTADISTICOS_CONFIG` (`seccion`, `calcular`, `formula`, `desc`, `minMuestra`, `supuestos`, `inputs`, `salidas`)
2. `calcular*` en `EstadisticaDescriptiva.js`
3. Caso en `ejecutarAnalisis()`
4. Plantilla `generarHTML()`
5. `ReporteManager.js`
6. Probar navegador
7. Actualizar este archivo

Detalle paso a paso: `GUIA_ESTADISTICO.md`.
