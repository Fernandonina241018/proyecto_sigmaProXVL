# Estado del Proyecto — SigmaProXVL

## CAMBIOS RECIENTES

### 2026-05-22: Fase 1 — Reorganización CSS (raíz → css/core/ + css/pages/)

**Qué:** Los 13 archivos CSS que estaban en la raíz del proyecto se movieron a subdirectorios organizados por dominio: `css/core/` (estilos base compartidos por toda la app) y `css/pages/` (estilos específicos de página/módulo).

**Por qué:** Reducir dispersión de archivos en raíz y agrupar por propósito (core vs página), facilitando escalabilidad futura.

**Criterio de agrupación:**
- `css/core/` — Estilos que aplican globalmente o son infraestructura visual: `indexx.css` (shell app), `styles.css` (globales), `auth.css` (login), `eda-dashboard.css` (EDA)
- `css/pages/` — Estilos de página/módulo individual: `dashboard.css`, `analisis-dashboard.css`, `auditoria.css`, `usuarios.css`, `datos.css`, `parametros.css`, `permisos.css`, `reportes.css`, `visualizacion.css`

**Archivos afectados:**
- 13 archivos CSS movidos de raíz → `css/core/` o `css/pages/`
- `indexx.html:11-15` — 5 `<link>` tags actualizados con nuevo path
- `dashboard.html:8` — 1 `<link>` tag actualizado con nuevo path

**Procedimiento:**
- Copia primero (con verificación MD5), luego eliminación de originales
- Sin cambios de contenido en los CSS (solo rutas)
- Sin cambios en JS (ningún JS referencia CSS directamente)

**Riesgo:** Bajo (solo rutas de `<link>` en HTML)

### 2026-05-22: Fase 2 — Reorganización JS (raíz → js/core/ + js/managers/ + js/pages/)

**Qué:** Los 27 archivos JS que estaban en la raíz del proyecto se movieron a subdirectorios organizados por dominio, y los 5 archivos de `pages/` se unificaron en `js/pages/`.

**Criterio de agrupación:**
- `js/core/` (9) — Infraestructura que se carga siempre y es requisito del resto: `estadisticosConfig.js`, `indexx.js`, `utils.js`, `StatsUtils.js`, `EstadisticaDescriptiva.js`, `StateManager.js`, `auth.js`, `Logger.js`, `__bootstrap.js`
- `js/managers/` (17) — Módulos de negocio y features: `ToolsManager.js`, `ReporteManager.js`, `EDAManager.js`, `AuditoriaManager.js`, `UsuariosManager.js`, `ParametrosManager.js`, `PermisosManager.js`, `ReportesManager.js`, `DatosManager.js`, `TrabajoManager.js`, `AsistenteAnalisis.js`, `ValidacionesManager.js`, `Visualizacion.js`, `VizControls.js`, `app.js`, `script.js`, `check.js`
- `js/pages/` (6) — Páginas y entry points: `dashboard.js` (desde raíz), `analisis.js`, `datos.js`, `reportes.js`, `trabajo.js`, `visualizacion.js` (desde `pages/`)

**Archivos afectados:**
- 27 JS movidos de raíz → `js/core/` o `js/managers/` o `js/pages/`
- 5 JS movidos de `pages/**/*.js` → `js/pages/*.js`
- `indexx.html:5,291-302` — 12 `<script>` tags actualizados con nuevo path
- `dashboard.html:670-678` — 9 `<script>` tags actualizados con nuevo path (incluye cambio de `dist/StatsUtils.js` a `js/core/StatsUtils.js`)
- `pages/` quedó vacío (subdirectorios preservados intactos)

**Verificaciones:**
- `node -c` pasado en los 9 core, 17 managers y 6 pages JS después de copia
- Copia primero con verificación MD5, luego eliminación de originales
- Orden de carga en `<script>` tags se mantiene idéntico (solo cambian paths)
- `dist/StatsUtils.js` ya no se referencia desde ningún HTML (se usará `js/core/StatsUtils.js`)
- Backups (`.bak*`, `.ts`, `.backup`) preservados

**Riesgo:** Medio (cambio masivo de rutas de `<script>`)

### 2026-05-22: Fase 3 — Limpieza de dist/ y tsconfig.json

**Qué:** Se limpiaron los 19 archivos duplicados obsoletos en `dist/` que eran versiones viejas de los JS ahora en `js/core/` y `js/managers/`. Se actualizó `tsconfig.json` para reflejar la nueva estructura y se agregó `.gitignore`.

**Por qué:** `dist/` contenía 19 archivos JS que eran versiones antiguas de los archivos reorganizados en `js/`. Al migrar los JS de raíz a `js/`, `dist/` quedó huérfano y sus contenidos estaban desactualizados. Ningún HTML referencia `dist/` desde la Fase 2.

**Detalles:**
- 19 archivos en `dist/` eliminados
- `tsconfig.json`: se removió `*.js` de `include` (ya no hay JS en raíz)
- `.gitignore`: creado con entradas para `node_modules/`, `dist/`, `.venv/`, `__pycache__/`, `.opencode/`
- `dist/` marcado en `.gitignore` para evitar que futuras compilaciones TS se trackeen accidentalmente

**Nota:** La recompilación de los 3 `.ts` (Logger.ts, StateManager.ts, StatsUtils.ts) a `dist/` no pudo ejecutarse debido a errores de extracción tar en el Google Drive al instalar TypeScript. Esto no afecta la funcionalidad — ningún HTML carga desde `dist/`.

**Archivos afectados:**
- 19 archivos en `dist/` eliminados
- `tsconfig.json:25` — `include` cambiado de `["*.ts", "*.d.ts", "*.js"]` a `["*.ts", "*.d.ts"]`
- `.gitignore` — nuevo archivo con exclusiones estándar

### 2026-05-22: Persistencia del estado colapsado del sidebar

**Qué:** El estado colapsado/expandido del sidebar ahora se guarda en `localStorage` y se restaura al cargar la página, incluso tras cerrar y reabrir el navegador o hacer hard reset.

**Archivos afectados:**
- `indexx.js:148` — `localStorage.setItem('sidebar_collapsed', isNowCollapsed)` agregado en el toggle handler
- `indexx.js:742-748` — Bloque de restauración: lee `localStorage.getItem('sidebar_collapsed')` y aplica las clases `.collapsed` + `.rotated` si corresponde

**Comportamiento:**
- Al hacer clic en el toggle → se persiste el estado en `localStorage`
- Al recargar la página → se restaura el estado guardado
- Hard reset (Ctrl+Shift+R) → preservado
- Cerrar/reabrir navegador → preservado
- Primera visita sin clave → expandido por defecto (`null === 'true'` → `false`)
- `node -c` sin errores

### 2026-05-22: Bug 1 — IC95 t-critical off-by-1-df corregido (tabla lookup)

**Qué:** Se reemplazó la aproximación por buckets (valores t críticos hardcodeados con rangos `df <= 5 | <=10 | <=20`) por una función `tCritical()` con tabla de lookup exacta para df 1–29 en los 3 niveles de confianza (90%, 95%, 99%). Para df ≥ 30 se usan valores z.

**Por qué:** Los buckets causaban errores severos:
- df=1 (n=2): t₉₅ código=2.571 vs real=12.706 (**error 5×**)
- df=6 (n=7): t₉₅ código=2.228 vs real=2.447 (**error −9%**)
- df=29 (n=30): caía a valor z=1.96 en vez de t=2.045 (**error −4%**) porque `if (n < 30)` excluía df=29

**Archivos afectados:**
- `EstadisticaDescriptiva.js:48-62` — `calcularIntervalosConfianza()` reescrita con:
  - `df = n - 1` movido fuera del condicional
  - Función `tCritical(df, conf)` con arrays lookup de 29 valores cada uno (t90, t95, t99)
  - Fallback a z-values (1.645, 1.96, 2.576) para df ≥ 30

**Riesgo:** Bajo (valores tabulados estándar, `node -c` OK)

### 2026-05-22: Bug 2 — Chi-Cuadrado crash corregido (validación + guard zero-variance)

**Qué:** Se aplicaron 2 correcciones:
1. **Validación robusta en `calcularChiCuadrado()`:** ahora verifica que todas las filas sean arrays, que tengan ≥ 2 columnas, que todas las filas tengan el mismo largo, y que la suma total (N) no sea 0
2. **Guard en fallback de binning:** si `step1 === 0` o `step2 === 0` (columna con varianza cero), retorna error descriptivo en vez de crashear con TypeError

**Por qué:** El fallback numérico de Chi-Cuadrado hacía `(v - min) / step = 0 / 0 = NaN` cuando todos los valores de una columna son iguales, causando `tabla[NaN][c] → TypeError: cannot read property of undefined`. La validación adicional protege contra malformaciones de tabla.

**Archivos afectados:**
- `EstadisticaDescriptiva.js:1026-1037` — Validación añadida en `calcularChiCuadrado()`: `!tabla.every(row => Array.isArray(row))`, `cols < 2`, `!tabla.every(row => row.length === cols)`, `N === 0`
- `EstadisticaDescriptiva.js:3848-3859` — Guard `if (step1 === 0 || step2 === 0)` en fallback de binning

**Riesgo:** Bajo (solo se añaden early returns para edge cases, `node -c` OK)

### 2026-05-22: Unificar persistencia sigmaPro_analisis/graficos en StateManager

**Qué:** Se centralizó el acceso a las keys `sigmaPro_analisis` y `sigmaPro_graficos` en StateManager, eliminando el acceso directo a localStorage desde 4 módulos distintos.

**Por qué:** ReportesManager, ValidacionesManager, dashboard.js y VizControls.js leían/escribían las mismas keys de forma independiente, sin coordinación ni manejo de errores consistente. StateManager ahora sirve como única capa de persistencia para estos datos.

**Cambios en StateManager.js:**
- Nuevas funciones: `getAnalisisHistory()`, `setAnalisisHistory(arr)`, `getGraficosHistory()`, `setGraficosHistory(arr)`
- `clearLocalStorage()` ahora también limpia `sigmaPro_analisis` y `sigmaPro_graficos`
- Las 4 funciones expuestas en API pública con `try/catch` y fallback `[]`
- Compatibilidad hacia atrás: si StateManager no está disponible, cada consumidor cae a `JSON.parse(localStorage.getItem(...))`

**Consumidores refactorizados:**

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `dashboard.js:3439-3446` | `guardarResultadoAnalisis()` | Usa `StateManager.get/setAnalisisHistory()`, slice(0,10) |
| `VizControls.js:364-372` | `guardarGraficosEnLocal()` | Usa `StateManager.get/setGraficosHistory()`, slice(0,50) |
| `ReportesManager.js:832-834` | `crearReporteConDatos()` | Usa `StateManager.getAnalisis/GraficosHistory()` |
| `ReportesManager.js:1070-1071` | `generarReporteCompleto()` | Usa `StateManager.getAnalisis/GraficosHistory()` |
| `ValidacionesManager.js:322` | `abrirModalCorrelacion()` | Usa `StateManager.getAnalisisHistory()` |
| `ValidacionesManager.js:385` | `calcularCorrelacion()` | Usa `StateManager.getAnalisisHistory()` |
| `ValidacionesManager.js:474` | `generarGraficoCorrelacion()` | Usa `StateManager.getAnalisisHistory()` |

**Riesgo:** Bajo-medium (refactor mecánico, todos con fallback a localStorage directo, `node -c` OK en los 5 archivos)

### 2026-05-22: Reportes detail format — TXT y HTML extendidos (5 tests)

**Qué:** Se extendió el formato detallado en `generarTXT()` y `generarHTML()` para 5 pruebas de hipótesis que tenían salidas pobres en el reporte: Regresión Lineal Múltiple, Regresión Polinomial, Regresión Logística, ANOVA One-Way, T-Test (una y dos muestras).

**Por qué:** Los reportes TXT/HTML generados por ReporteManager mostraban solo los estadísticos básicos (t, F, R², p) sin los detalles adicionales que ya estaban disponibles en los objetos resultado de EstadisticaDescriptiva.js.

**Extensiones por test:**

| Test | TXT añadido | HTML añadido |
|------|------------|-------------|
| **T-Test una muestra** | Media muestral, H₀, DE, EE | Misma info en tabla expandida |
| **T-Test dos muestras** | Grupo 1/2 (n, media, varianza), diferencia medias | Misma info + tabla expandida |
| **ANOVA One-Way** | Tabla ANOVA (SSB, SSW, MSB, MSW, gl, F, p), η² | Misma info + η² |
| **Regresión Lineal Múltiple** | Tabla coeficientes (β, EE, t, p), fórmula | Tabla coef expandida con details, badges |
| **Regresión Polinomial** | Tabla coeficientes por término | Tabla expandida con details |
| **Regresión Logística** | Coeficientes (β), Odds Ratios, fórmula | Tabla coef + OR expandida con details |

**Riesgo:** Bajo (solo se añaden líneas de formato, no se modifica lógica de negocio, `node -c` OK)

### 2026-05-22: Label "Find" → "Help" + eliminar legacy `_recentFiles`

**Qué:** 
1. Se renombró el ítem del menú Edit que decía "Find" (pero abría ayuda) a "Help" con shortcut ⌘H
2. Se eliminó `localStorage.removeItem('_recentFiles')` en `nuevoProyecto()` — clave nunca leída/esccrita, solo eliminada

**Por qué:** El label "Find" era engañoso (llamaba a `showHelpModal()`). `_recentFiles` era legacy sin propósito real.

**Archivos afectados:**
- `indexx.html:52` — "Find ⌘F" → "Help ⌘H"
- `indexx.js:819` — línea `removeItem('_recentFiles')` eliminada

**Riesgo:** Muy bajo

### 2026-05-22: Role-based visibility en ribbon nav popup

**Qué:** Se aplicó la misma política de módulos por rol al popup de navegación del ribbon. Usuarios no-admin ya no ven "Auditoría" ni "Usuarios".

**Archivos afectados:**
- `indexx.js:714` — `buildRibbonNavPopup()` ahora consulta `Auth.getSession()` y filtra `auditoria`/`usuarios` si el rol no es admin
- `indexx.js:3612` — Se agrega llamada a `buildRibbonNavPopup()` dentro del callback `onLogin` para reconstruir el popup cuando se conoce el rol del usuario

**Comportamiento:**
- Mismo patrón que el nav del sidebar (líneas 3607-3611)
- Si no hay sesión (usuario no logueado), el popup muestra todos los módulos (comportamiento conservador)
- Al loguearse, se reconstruye automáticamente con los módulos permitidos según el rol
- `node -c` sin errores

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
