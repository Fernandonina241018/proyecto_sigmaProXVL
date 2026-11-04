# Auditoría del módulo de estadística — StatAnalyzer Pro

**Fecha:** 2026-11-03
**Alcance:** catálogo → UI → cálculo → render → reporte
**Estado:** Lotes 1A, 1B, 2 y 3 corregidos.

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
| C2 | ANOVA Two-Way: `factor1/factor2` sobrescritos; clave `error` usada para residual; réplicas ignoradas | **Corregido (Lote 1B)** |
| C3 | Bootstrap: solo conserva la última columna; sin semilla; contrato `salidas` distinto | **Corregido (Lote 2)** |
| C4 | T-Test 1 muestra: μ₀ fijo en 0; sin campo en el modal | **Corregido (Lote 2)** |
| C5 | Covarianza: sin modal, sin renderer alcanzable | **Corregido (Lote 1A)** |
| C6 | Pares desalineados con huecos en MAE, R², Polinomial, Logística, calibración, TOST, Supervivencia, Mixtos | **Corregido (Lote 2)** |
| C7 | PCA/AF: `HYPOTHESIS_SET` los desvía a un render sin rama; NaN rellenados con 0 | **Corregido (Lote 1B)** |

## 3. Hallazgos altos

| ID | Hallazgo | Estado |
|---|---|---|
| A1 | `minMuestra` no se aplica en `ejecutarAnalisis` ni en batch | **Corregido (Lote 2)** |
| A2 | Umbrales internos menores que el mínimo documentado | Pendiente (revisión por estadístico) |
| A3 | 38/62 incumplen el contrato `salidas` | **Corregido (Lote 3)** |
| A4 | ANOVA One-Way/Kruskal sobrescriben `grupos` con etiquetas | **Corregido (Lote 2)** |
| A5 | LDA aplica Jacobi a una matriz no simétrica | **Corregido (Lote 2)** |
| A6 | MANOVA usa una aproximación F de Pillai no estándar | **Corregido (Lote 2)** |
| A7 | `nivelAlfa`, `tipoTest`, `efectoTamano`, `advertencias` no se leen | Pendiente (metadata informativa) |
| A8 | Badge de p-valor lee la primera clave (puede ser `prueba`) | **Corregido (Lote 2)** |

## 4. Medios/bajos

- `generarReporte` duplicado y sin llamadas. **Corregido (Lote 3): queda una sola implementación.**
- `tests/test-estadistica.js` llama funciones no públicas y no lo recoge Vitest. **Eliminado (Lote 3); su cobertura vive en Vitest.**
- No determinismo en Clúster y Bootstrap (sin semilla). **Bootstrap corregido (Lote 2); Clúster sigue usando `Math.random`.**
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

### Lote 1B — resultado correcto (este PR)
- ANOVA Two-Way: `residual`, conservar `factor1/factor2`, medias de celda con réplicas, interacción y renderer.
- PCA/AF: rama de render propia y descarte de filas incompletas.

### Lote 2 — corrección estadística (este PR)
- Pares alineados con `getPairedValues` en MAE, R², Polinomial, Logística, TOST, calibración, Supervivencia y Mixtos.
- μ₀ y alternativa en T-Test 1 muestra (modal + dispatch).
- Bootstrap por columna, semilla determinista (mulberry32) y contrato `salidas`.
- `minMuestra`/`maxMuestra` aplicados en `ejecutarAnalisis` (también en batch).
- LDA con autovalores simétricos (`Sw^-1/2 Sb Sw^-1/2`); MANOVA con F de Rao estándar.
- `grupos` de ANOVA/Kruskal ya no se sobrescribe: las etiquetas van en `etiquetasGrupos`.
- Badge de p-valor busca el p en cualquier nivel del resultado.

### Lote 3 — contrato y limpieza (este PR)
- `salidas` alineado con la devolución real en 40 entradas; los escalares declaran un único valor semántico.
- `tests/estadisticos-contrato.test.js`: un caso de ejecución y render por cada uno de los 62 estadísticos, más validación del contrato.
- Eliminada la copia duplicada de `generarReporte`.
- Eliminado `tests/test-estadistica.js` (legacy de navegador, ya migrado a Vitest).

## 7. Criterios de aceptación

- [x] Cada estadístico ejecuta desde su modal y produce tarjetas.
- [x] `generarHTML` no muestra “Tipo de prueba no reconocido” ni `[object Object]`.
- [x] Reportes incluyen los mismos valores que la UI.
- [x] Tests de integración cubren `ejecutarAnalisis` + `generarHTML`.
- [x] `npm test` y `npm run preflight` verdes.
