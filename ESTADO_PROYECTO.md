# Estado del Proyecto — SigmaProXVL

## CAMBIOS RECIENTES

### 2026-05-22: Integración de EDA en indexx.html/indexx.js

**Qué:** Se integró el módulo EDAManager.js en la interfaz nueva (indexx.html + indexx.js)

**Por qué:** EDAManager.js existía como módulo independiente pero no estaba conectado a la UI actual basada en indexx.

**Archivos afectados:**
- `indexx.html` — Líneas 15, 292: Se agregó `<link rel="stylesheet" href="eda-dashboard.css">` y `<script src="EDAManager.js"></script>`
- `indexx.js` — Líneas 338-342: Botón "🔍 Análisis Exploratorio (EDA)" en sidebar de Análisis (después de sección Dataset activo)
- `indexx.js` — Líneas 3273-3293: Nueva función `runEDA()` que obtiene datos, ejecuta `EDAManager.renderDashboard()` y muestra resultado en el panel derecho

**Detalles técnicos:**
- El botón EDA está estilizado como `.btn-primary` a ancho completo en la sidebar de Análisis
- `runEDA()` usa el mismo flujo que `runSingleStat`: setea `analisisSelectedTest`, limpia `analisisResultContent`, renderiza el panel, ejecuta, asigna HTML y re-renderiza
- El heatmap de correlación usa MutationObserver internamente (ya implementado en EDAManager), funciona sin cambios adicionales
- Las secciones colapsables y el botón de exportar usan onclick inline a funciones globales de EDAManager (toggleSection, exportarResumen)
- Compatibilidad de formato de datos asegurada: StatsUtils.getNumericValues maneja tanto array-de-objetos como array-de-arrays
