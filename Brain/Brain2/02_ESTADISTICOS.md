# 02 — Estadísticos: Inventario, Estado y Prioridades

## Resumen

- **Total:** 51 estadísticos
- **Implementados:** 44 (88%)
- **Pendientes:** 6 (12%)
- **Config centralizada:** `estadisticosConfig.js` → `ESTADISTICOS_CONFIG`
- **Implementaciones:** `EstadisticaDescriptiva.js`

---

## Leyenda de estado

| Símbolo | Significado |
|---|---|
| ✅ | Implementado y verificado |
| ⚠️ | Implementado, pendiente revisión/bug conocido |
| 🔶 | Implementación parcial o no confirmada |
| ❌ | No implementado |
| 🔴 | Alta complejidad — requiere librerías o algoritmos avanzados |

---

## SECCIÓN: DESCRIPTIVA (13 tests)

| Nombre | Función `calcular` | Estado | Notas |
|---|---|---|---|
| Media Aritmética | `calcularMedia` | ✅ | — |
| Mediana | `calcularMedianaModa` | ✅ | Compartida con Moda |
| Moda | `calcularMedianaModa` | ✅ | Compartida con Mediana |
| Desviación Estándar | `calcularDesviacionEstandar` | ✅ | Corrección Bessel (n−1) |
| Varianza | `calcularVarianza` | ✅ | — |
| Percentiles | `calcularPercentiles` | ✅ | Interpolación lineal NIST |
| Rango y Amplitud | `calcularRango` | ✅ | — |
| Coeficiente de Variación | `calcularCoeficienteVariacion` | ✅ | Validar media≠0 |
| Asimetría (Skewness) | `calcularAsimetria` | ✅ | — |
| Curtosis (Kurtosis) | `calcularCurtosis` | ✅ | Curtosis exceso (−3) |
| Error Estándar | `calcularErrorEstandar` | ✅ | — |
| Intervalos de Confianza | `calcularIntervalosConfianza` | ✅ | t-dist, 90/95/99% |
| Detección de Outliers | `detectarOutliers` | ✅ | IQR + Z-score |

---

## SECCIÓN: HIPÓTESIS — NORMALIDAD (5 tests)

| Nombre | Función | Estado | Notas |
|---|---|---|---|
| Test de Normalidad (JB) | `calcularTestNormalidad` | ✅ | Jarque-Bera |
| Test de Shapiro-Wilk | `calcularShapiroWilk` | ✅ | Coeficientes tabulados |
| Test de Kolmogorov-Smirnov | `calcularKolmogorovSmirnov` | ✅ | Con corrección Lilliefors |
| Test de Anderson-Darling | `calcularAndersonDarling` | ✅ | Valores críticos |
| Test de D'Agostino-Pearson | `calcularDAgostinoPearson` | ✅ | K²= Zskew²+Zkurt² |

---

## SECCIÓN: HIPÓTESIS — OTRAS PRUEBAS (6 tests)

| Nombre | Función | Estado | Notas |
|---|---|---|---|
| T-Test (una muestra) | `calcularTTestUnaMuestra` | ✅ | t-dist, d de Cohen |
| T-Test (dos muestras) | `calcularTTestDosMuestras` | ✅ | Welch (varianzas desiguales) |
| ANOVA One-Way | `calcularANOVAOneWay` | ✅ | MSB/MSW, η² |
| ANOVA Two-Way | `calcularANOVATwoWay` | ✅ | SS tipo III, interacciones |
| Chi-Cuadrado | `calcularChiCuadrado` | ✅ | V de Cramér incluido |
| Test TOST (Equivalencia) | `calcularTOST` | ✅ | Dos tests unilaterales, IC90% |

---

## SECCIÓN: CORRELACIÓN (4 tests)

| Nombre | Función | Estado | Notas |
|---|---|---|---|
| Correlación Pearson | `calcularCorrelacionPearson` | ✅ | IC95% mediante transformación z |
| Correlación Spearman | `calcularCorrelacionSpearman` | ✅ | Pearson sobre rangos |
| Correlación Kendall Tau | `calcularCorrelacionKendall` | ✅ | Corrección por empates |
| Covarianza | `calcularCovarianza` | ✅ | — |

---

## SECCIÓN: REGRESIÓN (7 tests)

| Nombre | Función | Estado | Notas |
|---|---|---|---|
| Regresión Lineal Simple | `calcularRegresionLinealSimple` | ✅ | R², F-test, residuos |
| Regresión Lineal Múltiple | `calcularRegresionLinealMultiple` | ✅ | Álgebra matricial |
| Regresión Polinomial | `calcularRegresionPolinomial` | ✅ | Grado configurable |
| Regresión Logística | `calcularRegresionLogistica` | ✅ | IRLS/gradiente |
| RMSE | `calcularRMSE` | ✅ | — |
| MAE | `calcularMAE` | ✅ | — |
| R² (Coef. Determinación) | `calcularR2` | ✅ | R²adj incluido |

---

## SECCIÓN: NO PARAMÉTRICOS (5 tests)

| Nombre | Función | Estado | Notas |
|---|---|---|---|
| Mann-Whitney U | `calcularMannWhitney` | ✅ | Corrección por empates |
| Kruskal-Wallis | `calcularKruskalWallis` | ✅ | Corrección por empates |
| Wilcoxon | `calcularWilcoxon` | ✅ | Corrección por empates |
| Friedman | `calcularFriedman` | ✅ | W de Kendall incluido |
| Test de Signos | `calcularTestSignos` | ✅ | Binomial exacto |

---

## SECCIÓN: MULTIVARIADO (5 tests)

| Nombre | Función | Estado | Notas |
|---|---|---|---|
| PCA (Componentes Principales) | `calcularPCA` | ✅ | Método de Jacobi |
| Análisis Factorial | `calcularAnalisisFactorial` | ✅ | KMO, Bartlett, loadings |
| K-Medias (Clustering) | `calcularCluster` | ❌ | K-means + jerárquico |
| LDA (Análisis Discriminante) | `calcularDiscriminante` | ❌ | LDA, Lambda de Wilks |
| MANOVA | `calcularMANOVA` | ❌ | Pillai trace |

---

## SECCIÓN: EXTRAS (5 tests)

| Nombre | Función | Estado | Notas |
|---|---|---|---|
| Bootstrap | `calcularBootstrap` | ✅ | B≥1000, remuestreo |
| Series Temporales | `calcularSeriesTemporales` | ❌ | STL, ACF/PACF, ARIMA |
| Análisis de Supervivencia | `calcularSupervivencia` | ❌ | Kaplan-Meier, Cox |
| Modelos Mixtos | `calcularModelosMixtos` | ❌ | REML, ICC |
| Inferencia Bayesiana | `calcularBayesiano` | ❌ | MCMC, Factor de Bayes |

---

## SECCIÓN: ESPECIFICACIÓN (1 test)

| Nombre | Función | Estado | Notas |
|---|---|---|---|
| Límites de Cuantificación | `calcularLimitesCuantificacion` | ✅ | LOD=3σ, LOQ=10σ |

---

## SECCIÓN: CALIDAD (1 test)

| Nombre | Función | Estado | Notas |
|---|---|---|---|
| Diagrama de Pareto | `calcularPareto` | ✅ | 80/20, vitales vs triviales |

---

## Prioridades de implementación

### P1 — Completar multivariado
1. K-Medias (Clustering)
2. LDA (Análisis Discriminante)
3. MANOVA

### P2 — Extras avanzados
4. Series Temporales
5. Análisis de Supervivencia
6. Modelos Mixtos
7. Inferencia Bayesiana

---

## Estructura de retorno esperada (contrato)

Toda función `calcular*` debe retornar:
```js
// Éxito
{ ...salidas_del_config, n: number, advertencias?: string[] }

// Error
{ error: 'descripción del error', codigo: 'MIN_MUESTRA' | 'DATOS_INVALIDOS' | ... }
```

Validaciones obligatorias antes de calcular:
1. `datos.length >= config.minMuestra`
2. `config.maxMuestra` → `datos.length <= config.maxMuestra` (ej: Shapiro-Wilk)
3. Sin `NaN` ni `null` en el array (o filtrarlos y advertir)

---

## Para el Agente

**Antes de implementar un nuevo estadístico:**

1. Revisar `estadisticosConfig.js` para ver la config existente
2. Agregar entrada en `ESTADISTICOS_CONFIG` con:
   - `seccion`
   - `calcular` (nombre de función)
   - `formula`
   - `desc`
   - `minMuestra`
   - `supuestos`
   - `inputs`
   - `salidas`
3. Implementar función en `EstadisticaDescriptiva.js`
4. Agregar caso en `ejecutarAnalisis()` del mismo archivo
5. Agregar plantilla de renderizado en `generarHTML()`
6. Verificar que funcione en reportes

**Verificar siempre:**
- ✅ `textContent` vs `innerHTML`
- ✅ No mutar arrays de entrada
- ✅ Retornar `{ error: string }` en fallos
- ✅ Coincidir claves con `config.salidas[]`
