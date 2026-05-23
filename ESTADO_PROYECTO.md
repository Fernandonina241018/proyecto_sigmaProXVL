# Estado del Proyecto — SigmaProXVL

## CAMBIOS RECIENTES

### 2026-05-22: Theme EDA — colores adaptados al proyecto

**Qué:** Se reemplazaron todos los colores hardcodeados en EDA por variables CSS del proyecto

**Por qué:** El dashboard EDA usaba colores claros (blanco, #e9ecef, #0ea5e9) que no coincidían con el tema oscuro del proyecto StatAnalyzer Pro, resultando en una experiencia visual inconsistente.

**Archivos afectados:**
- `eda-dashboard.css` — Archivo completo reescrito (~630 líneas): todos los colores fijos reemplazados por variables CSS del proyecto (`--card-bg`, `--border`, `--text-primary`, `--text-muted`, `--accent`, etc.) más variables EDA locales (`--eda-bg-card`, `--eda-gradient`, etc.). Los colores semánticos (verde éxito, rojo error, azul info) se cambiaron a valores modernos (#22c55e, #ef4444, --eda-accent) con fondos semitransparentes rgba compatibles con tema oscuro.
- `EDAManager.js` — 5 literales inline de color reemplazados por `var(--text-muted)` o colores oscuros (#ef4444, #dcddde, #3a3a3a); función `_corrColor()` del heatmap reescrita para fondo oscuro (va de neutral=30 al accent/rojo en lugar de blanco a verde/rojo).

**Detalles técnicos:**
- El gradiente del header/botón usa `var(--accent)` → `var(--accent-hover)` en lugar del anterior azul→morado (#0ea5e9→#6366f1)
- `_corrColor()` para canvas heatmap: valor neutro RGB(30,30,30) → accent(124,106,247) para positivas, → red(239,0,0) para negativas
- Fondo del dashboard: `var(--card-bg)` en vez de `white`
- No se requirieron `[data-theme="dark"]` overrides porque el proyecto usa tema oscuro como default (`:root` ya tiene colores oscuros)
- `node -c EDAManager.js` sin errores

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
