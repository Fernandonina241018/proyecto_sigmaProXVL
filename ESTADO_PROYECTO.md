# Estado del Proyecto — SigmaProXVL

## CAMBIOS RECIENTES

### 2026-05-22: Fix posición del popup button — justo arriba del toggle

**Qué:** Se reposicionó el botón de navegación para que aparezca justo arriba del botón colapsar, y se agrupó en un wrapper con `margin-top: auto`.

**Por qué:** El botón aparecía en el flujo normal de la ribbon (junto a los iconos superiores), lejos del toggle. El usuario lo quiere justo arriba del botón colapsar.

**Archivos afectados:**
- `indexx.html` — Los 3 elementos inferiores (`#ribbonPopupBtn`, `#sidebarToggle`, `#sidebarUser`) envueltos en `<div class="ribbon-bottom">`
- `indexx.css` — Nueva clase `.ribbon-bottom` con `margin-top:auto; display:flex; flex-direction:column; align-items:center; gap:4px; padding-bottom:8px`; `margin-top:auto` y `margin-bottom:8px` eliminados de `.ribbon-toggle` (ahora los maneja el wrapper)

**Comportamiento final:**
- El popup button aparece JUSTO arriba del botón colapsar
- El popup se abre con el sidebar expandido O colapsado
- Todo el grupo inferior (popup, toggle, user) se mantiene al fondo de la ribbon

### 2026-05-22: Botón dedicado para ribbon nav popup

**Qué:** Se agregó un botón de navegación en el ribbon (antes del toggle) que abre/cierra el popup de páginas manualmente, independientemente del estado del sidebar.

**Por qué:** El popup solo se activaba como efecto secundario del colapso del sidebar. El usuario necesita poder abrirlo sin colapsar el sidebar.

**Archivos afectados:**
- `indexx.html:167-172` — Nuevo `.ribbon-icon#ribbonPopupBtn` con SVG de 3 puntos (navegación) antes de `#sidebarToggle`
- `indexx.js:150-153` — Handler `ribbonPopupBtn.click` con `e.stopPropagation()` + toggle del popup
- `indexx.js:177` — Outside-click handler extendido para excluir `#ribbonPopupBtn`

**Comportamiento:**
- Hacer clic en el botón de navegación abre/cierra el popup sin afectar el sidebar
- El popup también sigue funcionando con el toggle del sidebar
- Clic fuera del popup, botón nuevo, o toggle del sidebar lo cierra
- `node -c` sin errores

### 2026-05-22: Ribbon nav popup — navegación cuando sidebar colapsa

**Qué:** Al colapsar el sidebar izquierdo, aparece un popup flotante con los nav-items (páginas) al lado de la ribbon.

**Por qué:** El usuario necesita cambiar de página sin tener que expandir el sidebar primero.

**Archivos afectados:**
- `indexx.css` — 9 líneas: `.ribbon-nav-popup` y `.ribbon-nav-item` con estilos consistentes con el proyecto (mismo patrón que `.sidebar-user-dropdown`)
- `indexx.html` — 1 línea: `<div class="ribbon-nav-popup" id="ribbonNavPopup">` insertado después del user dropdown
- `indexx.js` — 40 líneas:
  - Toggle handler modificado: abre/cierra el popup cuando sidebar colapsa/expande
  - `buildRibbonNavPopup()`: construye los items desde los `.nav-item[data-page]` existentes
  - `updateRibbonNavPopup()`: sincroniza `.active` con `currentPage`
  - Outside-click handler extendido: cierra popup al hacer clic fuera
  - `updateRibbonNavPopup()` llamado en `loadPage()` para mantener sync

**Detalles técnicos:**
- Popup usa `position:fixed; left:42px; bottom:50px` — misma posición que el user dropdown
- Se cierra automáticamente al hacer clic en un nav-item (después de `loadPage()`)
- Se cierra al hacer clic fuera del popup o del toggle
- Se cierra al expandir el sidebar nuevamente
- Sincronización del `.active` igual que los nav-items del sidebar

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
