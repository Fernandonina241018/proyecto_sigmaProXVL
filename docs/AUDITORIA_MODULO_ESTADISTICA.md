# Auditoría del módulo de estadística — StatAnalyzer Pro

**Fecha:** 2026-11-03
**Alcance:** catálogo → UI → cálculo → render → reporte
**Estado:** Lote 1A corregido (Pareto y Covarianza); resto planificado.

## 1. Mapa funcional

| Capa | Archivo | Rol |
|---|---|---|
| Catálogo | `js/core/estadisticosConfig.js` | 62 entradas en 10 secciones |
| Menú/UI | `js/core/indexx-analysis.js` | sidebar, modales, `runSingleStat()`, `runBatchAnalysis()` |
| Contrato | `getDataForEjecutarAnalisis()` | `{headers, data:[{col:val}], rowCount}` |
| Motor | `js/core/EstadisticaDescriptiva.js` | `ejecutarAnalisis()` + `generarHTML()` |
| Cálculo | `js/core/StatsUtils.js`, `js/core/indexx-stats-core.js` | ~70 funciones |
| Reportes | `js/managers/ReporteManager.js` | DOCX/PDF/HTML desde `StateManager.ultimosResultados` |
| EDA | `js/managers/EDAManager.js` | dashboard exploratorio |

**Flujo:** config → tarjeta → modal → `runSingleStat`/`runBatchAnalysis` → `ejecutarAnalisis` → `generarHTML` → `StateManager` → `ReporteManager`.

**Inventario:** 62 estadísticos, 10 secciones, 62 con `case` de ejecución.

## 2. Hallazgos críticos

| ID | Hallazgo | Estado |
|---|---|---|
| C1 | Pareto: `constidxPareto80` roto; sin modal ni renderer; no estaba en `HYPOTHESIS_TESTS` | **Corregido (Lote 1A)** |
| C2 | ANOVA Two-Way: `factor1/factor2` sobrescritos; clave `error` usada para residual; réplicas ignoradas | Pendiente (Lote 1B) |
| C3 | Bootstrap: solo conserva la última columna; sin semilla; contrato `salidas` distinto | Pendiente (Lote 2) |
| C4 | T-Test 1 muestra: μ₀ fijo en 0; sin campo en el modal | Pendiente (Lote 2) |
| C5 | Covarianza: sin modal, sin renderer alcanzable | **Corregido (Lote 1A)** |
| C6 | Pares desalineados con huecos en MAE, R², Polinomial, Logística, calibración, TOST, Supervivencia, Mixtos | Pendiente (Lote 2) |
| C7 | PCA/AF: `HYPOTHESIS_SET` los desvía a un render sin rama; NaN rellenados con 0 | Pendiente (Lote 1B) |

## 3. Hallazgos altos

| ID | Hallazgo |
|---|---|
| A1 | `minMuestra` no se aplica en `ejecutarAnalisis` ni en batch |
| A2 | Umbrales internos menores que el mínimo documentado |
| A3 | 38/62 incumplen el contrato `salidas` |
| A4 | ANOVA One-Way/Kruskal sobrescriben `grupos` con etiquetas |
| A5 | LDA aplica Jacobi a una matriz no simétrica |
| A6 | MANOVA usa una aproximación F de Pillai no estándar |
| A7 | `nivelAlfa`, `tipoTest`, `efectoTamano`, `advertencias` no se leen |
| A8 | Badge de p-valor lee la primera clave (puede ser `prueba`) |

## 4. Medios/bajos

- `generarReporte` duplicado y sin llamadas.
- `tests/test-estadistica.js` llama funciones no públicas y no lo recoge Vitest.
- No determinismo en Clúster y Bootstrap (sin semilla).
- Modales de normalidad piden columna que luego no se usa.
- Renderers de K-S, Anderson-Darling, D'Agostino y Covarianza inalcanzables antes del Lote 1A.
- `totalFilas` puede ser `NaN` si el llamador no pasa `rowCount`.

## 5. Causa raíz de la deuda

Los 702 tests originales cubrían **funciones sueltas**, no la integración:
no había tests de `ejecutarAnalisis`, modales, `generarHTML` ni contrato `salidas`.
Los defectos C1–C7 viven exactamente en esa capa.

## 6. Plan de corrección

### Lote 1A — “se pueden usar” (este PR)
- Pareto: typo, `HYPOTHESIS_TESTS`, modal categoría+conteo, renderer y reporte.
- Covarianza: `HYPOTHESIS_TESTS`, modal X/Y, renderer y reporte.
- Tests de integración: `tests/estadisticos-integracion.test.js`.

### Lote 1B — resultado correcto
- ANOVA Two-Way: `residual`, conservar `factor1/factor2`, medias de celda con réplicas.
- PCA/AF: rama de render propia y descarte de filas incompletas.

### Lote 2 — corrección estadística
- Pares alineados con `getPairedValues`.
- μ₀ y alternativa en T-Test 1 muestra.
- Bootstrap por columna, semilla y contrato.
- `minMuestra`/`maxMuestra` en `ejecutarAnalisis`.
- Revisar LDA/MANOVA; no sobrescribir `grupos`.

### Lote 3 — contrato y limpieza
- Alinear `salidas` de las 62 entradas.
- Un test de integración por estadístico.
- Eliminar `generarReporte` duplicado y casos legacy.
- Arreglar o eliminar `tests/test-estadistica.js`.

## 7. Criterios de aceptación

- [ ] Cada estadístico ejecuta desde su modal y produce tarjetas.
- [ ] `generarHTML` no muestra “Tipo de prueba no reconocido” ni `[object Object]`.
- [ ] Reportes incluyen los mismos valores que la UI.
- [ ] Tests de integración cubren `ejecutarAnalisis` + `generarHTML`.
- [ ] `npm test` y `npm run preflight` verdes.
