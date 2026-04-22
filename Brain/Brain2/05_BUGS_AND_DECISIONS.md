# 05 — Bugs Resueltos y Decisiones Técnicas

## Formato de entrada

```
### [FECHA] — [ARCHIVO] — [SEVERIDAD]
**Bug/Decisión:** descripción
**Causa raíz:** por qué ocurrió
**Fix/Decisión:** qué se hizo
**Impacto:** qué funcionalidad afectaba
**Regresiones posibles:** qué hay que vigilar
```

---

## Log de Bugs Resueltos

---

### 2026-04-24 — `EstadisticaDescriptiva.js` — 🔴 CRÍTICO

#### BUG 1 — Eigenvalores extremadamente grandes en PCA y Análisis Factorial
**Severidad:** 🔴 Crítico  
**Causa raíz:** El algoritmo QR para eigenvalores era numéricamente inestable, generando valores como `e+72`.  
**Fix:** Se implementó el **método de Jacobi** para cálculo de eigenvalores, que es más estable numéricamente.  
**Impacto:** PCA y Análisis Factorial no funcionaban correctamente.  
**Archivos:** `EstadisticaDescriptiva.js` → funciones `jacobiEigenvalues()`, `qrDecomposition()`  
**Fecha:** 24 Abril 2026

---

### 2026-04-24 — `EstadisticaDescriptiva.js` — 🟡 MAYOR

#### BUG 2 — Plantilla de Análisis Factorial no se renderizaba
**Severidad:** 🟡 Mayor  
**Causa raíz:** 'Análisis Factorial' y 'PCA' estaban en `HYPOTHESIS_SET`, lo que hacía que usaran la plantilla genérica de hipótesis en lugar de la plantilla especial.  
**Fix:** Se creó un set separado `multivariadoTests` en ReporteManager.js para incluir estos tests en los reportes.  
**Impacto:** La tabla de loadings y communalities no se mostraba.  
**Archivos:** `utils.js`, `dist/utils.js`, `ReporteManager.js`  
**Fecha:** 24 Abril 2026

---

### 2026-04-24 — `EstadisticaDescriptiva.js` — 🟡 MAYOR

#### BUG 3 — Communalities no se mostraban en la UI
**Severidad:** 🟡 Mayor  
**Causa raíz:** El resultado tenía la clave `communality` (singular) pero el código buscaba `communities` (plural) en algunos lugares y `communalityS` en otros.  
**Fix:** Se estandarizó a `communality` (singular) en el return de la función y en el HTML.  
**Impacto:** La columna h² aparecía vacía en la tabla de loadings.  
**Archivos:** `EstadisticaDescriptiva.js` líneas ~2771, 4384, 4439, 5351  
**Fecha:** 24 Abril 2026

---

### 2026-04-24 — `EstadisticaDescriptiva.js` — 🟡 MAYOR

#### BUG 4 — KMO no se mostraba en la UI
**Severidad:** 🟡 Mayor  
**Causa raíz:** El resultado tenía la clave `kmo` (minúscula) pero el código buscaba `data.KMO` (mayúscula).  
**Fix:** Se cambió a `data.kmo` en todas las referencias.  
**Impacto:** El valor de KMO aparecía como "—".  
**Archivos:** `EstadisticaDescriptiva.js` líneas ~4385, 5353  
**Fecha:** 24 Abril 2026

---

### 2026-04-24 — `Reportes` — 🟡 MAYOR

#### BUG 5 — Solo una columna en reportes cuando hay datos incompletos
**Severidad:** 🟡 Mayor  
**Causa raíz:** El umbral de detección de columnas numéricas era 80%, pero cuando hay datos incompletos (filas con valores vacíos), las columnas caen por debajo del umbral.  
**Fix:** Se bajó el umbral de 80% a 50% en `StatsUtils.js` y `EstadisticaDescriptiva.js`.  
**Impacto:** Solo una columna aparecía en la sección "Resultados por Variable" del reporte.  
**Archivos:** `StatsUtils.js` línea 54, `EstadisticaDescriptiva.js` línea 100  
**Fecha:** 24 Abril 2026

---

### 2026-04-24 — `script.js` — 🟡 MAYOR

#### BUG 6 — Selección múltiple de estadísticos no funcionaba para PCA y AF
**Severidad:** 🟡 Mayor  
**Causa raíz:** La función `_abrirModalesHipotesisSecuencia` solo interceptaba los botones `hypo-modal-confirm` y `correlacion-modal-confirm`, pero PCA usa `pca-save` y AF usa `af-save`.  
**Fix:** Se agregó mapeo de IDs de botones según el tipo de estadístico.  
**Impacto:** Al seleccionar múltiples estadísticos (PCA + AF), solo se configuraba el primero.  
**Archivos:** `script.js` líneas ~2052-2070  
**Fecha:** 24 Abril 2026

---

### 2025 — `estadisticosConfig.js` — 🔴 CRÍTICO (x2) + 🟡 MAYOR (x5)

(Son los bugs documentados previamente en el archivo original)

---

## Decisiones Técnicas

---

### DEC-001 — Compartir `calcularMedianaModa` entre Mediana y Moda
**Fecha:** —  
**Decisión:** Una sola función sirve a ambos tests.  
**Razón:** La mediana y la moda se calculan en el mismo paso.  

---

### DEC-002 — Método de Jacobi para eigenvalores
**Fecha:** 24 Abril 2026  
**Decisión:** Usar el método de Jacobi en lugar del método QR para calcular eigenvalores.  
**Razón:** El método QR era numéricamente inestable para matrices de correlación.  
**Referencia:** Jacobi, C.G.J. (1846). Über ein leichtes Verfahren.

---

### DEC-003 — Umbral de columnas numéricas al 50%
**Fecha:** 24 Abril 2026  
**Decisión:** Bajar el umbral de detección de 80% a 50%.  
**Razón:** Datos con valores faltantes (empty strings) no alcanzaban el 80% pero son válidos para análisis.  

---

### DEC-004 — Selección múltiple secuencial para multivariado
**Fecha:** 24 Abril 2026  
**Decisión:** Modales de PCA y AF se abren en secuencia cuando se seleccionan múltiples.  
**Razón:** Cada uno requiere configuración independiente de columnas.  

---

### DEC-005 — Keyboard shortcuts
**Fecha:** 23 Abril 2026  
**Decisión:** Agregar atajos de teclado globally.  
**Implementación:** Ctrl+Shift+D (tema), Ctrl+Shift+A (asistente), Ctrl+Z/Y (undo/redo), ? (ayuda)

---

### DEC-006 — Tutorial in-app
**Fecha:** 23 Abril 2026  
**Decisión:** Mostrar tutorial de 6 pasos al primer inicio.  
**Implementación:** Modal step-by-step con localStorage para no repetir.

---

### DEC-007 — Dark mode mejorado
**Fecha:** 23 Abril 2026  
**Decisión:** Expandir variables dark y prevenir FOUC.  
**Implementación:** 
- Script inline en `<head>` antes de CSS
- ~40 variables CSS dark (antes ~8)
- Scrollbars custom, inputs, tooltips, modals adaptados  

---

## Deuda Técnica Conocida

| ID | Descripción | Severidad | Archivo |
|---|---|---|---|
| DT-001 | No hay validación formal de que `config.salidas[]` coincida con lo que retorna `calcular*()` | 🟡 | Todos |
| DT-002 | EDAManager.js pendiente de revisión completa | 🟡 | `EDAManager.js` |
| DT-003 | `styles.css` tiene problemas estructurales | 🟢 | `styles.css` |
| DT-004 | Sin test suite — validación solo manual | 🟡 | Global |
| DT-005 | 6 tests con estado ❌ en `02_ESTADISTICOS.md` | 🔴 | `EstadisticaDescriptiva.js` |

---

## Para el Agente

**Al resolver un bug:**

1. Analizar causa raíz primero
2. Verificar con logs en consola
3. Probar en navegador
4. Verificar que no hay regresiones
5. Documentar en este archivo

**Al implementar nuevo estadístico:**

1. Agregar config en `estadisticosConfig.js`
2. Implementar función en `EstadisticaDescriptiva.js`
3. Agregar caso en `ejecutarAnalisis()`
4. Agregar plantilla en `generarHTML()`
5. Agregar caso en `ReporteManager.js`
6. Probar y documentar
