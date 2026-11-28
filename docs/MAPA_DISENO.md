# Mapa de diseño — StatAnalyzer Pro

Estado del sistema visual y reglas para que los módulos se vean iguales sin romper
comportamientos. Última actualización: 2026-11-28 (P1-A…P1-J).

## 1. Tokens (fuente única)

`css/core/indexx.css:3-83` (`:root`, tema oscuro) y `834+` (`[data-theme="light"]`).

| Grupo | Tokens |
|---|---|
| Superficies | `--bg-primary`, `--bg-secondary`, `--bg-panel`, `--card-bg`, `--item-bg`, `--item-hover` |
| Semánticos de superficie | `--surface-0/1/2/3` (alias de las anteriores) |
| Texto | `--text-primary`, `--text-muted`, `--text-faint` |
| Acento | `--accent`, `--accent-hover`, `--accent-alt`, `--on-accent` |
| Estado | `--ok`, `--warn`, `--danger` + `--ok-bg`, `--warn-bg`, `--danger-bg` + `--*-border` |
| Radios | `--radius-xs 6`, `--radius-sm 8`, `--radius-md 12`, `--radius-lg 16`, `--radius-xl 20` |
| Espaciado | `--space-1 4`, `--space-2 8`, `--space-3 12`, `--space-4 16`, `--space-5 20` |
| Sombras | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| Iconos | `--icon-stroke: 1.8` |
| Foco | `--focus-ring` (alias de `--accent`, contraste ≥3:1 en ambos temas) |
| Tipografía | `--text-2xs 10`, `--text-xs 11`, `--text-sm 12`, `--text-base 13`, `--text-md 14`, `--text-lg 16` |
| Capas | `--z-toast 99999`, `--z-skip 100000` |
| Motion | `--motion-fast .15s`, `--motion-base .22s`, `--ease-standard` |
| Breakpoints | 640/768/1024/1100 documentados; CSS no permite `var()` en `@media` |

Regla: **no introducir hex nuevos**; si falta un color, se añade token.

## 2. Componentes

| Componente | Dónde | Uso |
|---|---|---|
| `.side-card` + `_sideCard()` / `sideToggleCard()` | `css/core/indexx.css:1577+`, `js/core/indexx-ui.js:359+` | Cards de sidebar: Trabajo, Reportes, Análisis |
| `.viz-card` | inyectado en `js/core/indexx-viz.js` | Visualización; alias de `.side-card` desde P1-J |
| `.datos .gl` | `css/core/indexx.css:1344+` | Paneles "glass" de Datos (legacy) |
| `.page-card` | `css/core/indexx.css:314+` | Resultados de página (Análisis) |
| `.acordeon-*` / `.ar-kpi-*` | `css/core/indexx.css:677+` | Resultados estadísticos |
| `.fbandeja-*` | `css/core/indexx.css:1252+` | Bandeja de firmas |
| `.rep-card` | `css/core/indexx.css` | Reportes (legacy) |
| Diálogos | `a11yModal()` en `js/core/indexx-ui.js` | role/aria-modal, foco inicial, Tab atrapado, Escape y retorno |
| Navegación | `SIGMA_PAGES` + `buildSidebarNav()` | `js/core/pages.js`, `js/core/indexx-ui.js` | Fuente única de nav, títulos, iconos, permisos, workflow y lazy |

### Anatomía de `.side-card`

```
.side-card
├─ .side-card-head
│  ├─ .side-card-title-wrap (.side-card-icon + título/subtítulo)
│  └─ .side-card-collapse  (onclick="sideToggleCard(this)")
└─ .side-card-content      (oculto si .side-card.collapsed)
```

Estados iniciales: Trabajo solo "Hoja de Trabajo" colapsada; Reportes solo
"Formatos"; Análisis todas abiertas; Visualización solo "Tipo de gráfico".

## 3. Reglas "sobrio"

1. Un solo acento (azul `#2f81f7` / `#0969da` en claro); degradados solo en el botón primario.
2. Máximo dos niveles de sombra (`--shadow-sm`, `--shadow-md`).
3. Radios de la escala (6/8/12/16/20).
4. Títulos 13.5–14 px / 750; subtítulos 10.5 px.
5. Sin `translateY` en contenedores grandes (solo hover de opciones pequeñas).
6. Color de estado en punto, badge o borde; nunca fondo completo saturado.
7. Emoji solo como icono funcional; el resto SVG stroke `--icon-stroke`.

## 4. Módulo estadístico (F1/F2 aplicado)

- **Panel** (`js/core/indexx-ui.js:521-560`): 3 `.side-card` → **Dataset**,
  **Último resultado**, **Test seleccionado** (`.side-card.grow` con scroll).
- **Resultados** (`js/core/indexx-ui.js:880-940`): clase `.anl-results-scope`;
  `.page-card` transparente, sin hover-lift, acordeón plano y KPIs unificados.
- Estilos en `css/core/indexx.css:1609+`, todos con prefijo `.anl-` (scope propio).

### IDs que NO se pueden renombrar

`analisisDsName`, `analisisDsRows`, `analisisDsCols`, `analisisStatNumeric`,
`colThresholdSlider`, `colThresholdVal`, `colForceInclude`, `colImputeMissing`,
`analisisExcludedTags`, `analisisLastResultList`, `analisisLastTest`,
`analisisLastPVal`, `analisisLastDecision`, `analisisSelectedTestsScroll`.

### P1-H — correctitud del flujo de análisis (2026-11-28)

- El resumen de resultado usa el `nivelAlfa` del test y el `significativo` que calcula el motor; no cae a 0.05 fijo. El panel muestra α.
- EDA y batch actualizan el último resultado; muestran `—` en decisión cuando no hay p-valor.
- `StatsUtils.numericColumnsForAnalysis`, `resumirResultado` y `BASE_INDEX_COLUMNS` unifican detección y resumen; el run y el modal de configuración usan la misma política.
- Iconos de tests desde `getEstadisticoConfig`; se eliminó `getAnalisisTestsHTML`/`selectAnalisisTest` (lista legacy de 22 tests).

### P1-I — UI de Análisis y EDA en Reportes (2026-11-28)

- Barra de resumen del resultado con **n, p, α y decisión**; `—` cuando no hay decisión (EDA/batch).
- Modal de configuración con chequeo de datos: filas, numéricas, categóricas, faltantes y mínimo requerido.
- Buscador de tests en el menú (62 tests); filtra ítems y abre el submenú con coincidencias.
- El HTML de resultados ya no fija “p < 0.05” en las etiquetas; los p-valores usan `<0.0001`.
- EDA → Reportes: el resultado EDA expone `tipo`, `columnasAnalizadas`, totales y `estadisticos`; `ReporteManager` genera HTML/TXT/CSV exploratorios, sin pasar por el pipeline de estadísticos.
- E2E de Datos cubre buscador, barra de resumen, EDA→Reportes y Análisis a 390px.

### P1-J — F3/F4 aplicado (2026-11-28)

- **EDA**: header `--surface-2` con borde, texto en tokens y sin gradiente; iconos SVG en header, KPIs, secciones y export.
- **Modelo Stats**: 0 hex inline; paneles, KPIs y nota con `.side-card`; tokens en colores/estados.
- **Detalle ML** (`js/pages/ml.js`): variables y colores directos a tokens; queda solo `#fff` para texto sobre color.
- **`.viz-card`**: alias real de `.side-card` (clase en el markup + base compartida); se eliminó la base duplicada.
- Capturas after revisadas: EDA sobrio, MLStats con cards del sistema y Visualización con el alias.

## 5. P0 aplicado (2026-11-26)

- Marca: favicon/PWA en azul, `theme-color` alineado; foco unificado en `--focus-ring`.
- Texto de resultados y tablas seleccionable; los controles conservan `user-select:none`.
- Toasts con `role=status/alert` y `aria-live`.
- Chrome muerto retirado: semáforos macOS, iconos decorativos del ribbon, `⌄ ⋯` del tabbar, “Obsidian Vault” y placeholders.
- Shell: `<aside>` + `<nav>` + `<main>`, títulos `h1/h2`, skip link a `#rightPaneTitle` y `aria-current` en nav/tabs.
- Teclado: tabs (Enter/Espacio, Supr), dots del workflow, ribbon y footer; foco visible tokenizado.
- Modales: `a11yModal()` (role dialog, aria-modal, nombre, foco inicial, Tab atrapado, Escape y retorno) en análisis, datos, viz, firma y ayuda/configuración; límites con trap manual.

## 6. Registro de páginas (P1-A, 2026-11-27)

- `js/core/pages.js` es la fuente única: `id`, `label`, `title`, `icon`, `desc`, `group`, `roles`, `paneWidth`, `workflow`, `workflowName` y `lazyGroup`.
- `indexx-ui.js` deriva `pageIcons`, `pageTitles`, `WORKFLOW`, `_SIGMA_PAGE_GROUP` y `paneMinWidthFor`; `buildSidebarNav()` genera la nav en boot.
- `permisos.js` deriva `ALLOWED_PAGES` de `roles`; ya no hay matriz duplicada.
- Los renderers `leftPanels`/`rightPanels` siguen en `indexx-ui.js`; `tests/pages-registry.test.js` vigila ids, metadatos, workflow, lazy y permisos.
- Agregar una página = una entrada en `pages.js` + su renderer. No hay que tocar nav, iconos, títulos, permisos ni workflow.

## 7. Tokens y tema (P1-B, 2026-11-27)

- Tokens usables: tipografía, `--z-toast`/`--z-skip` y `--motion-*`/`--ease-standard`; aplicados al skip link, toast, sidebar y título de panel. Sin migración masiva de los hex/inline styles existentes.
- Breakpoints canónicos 640/768/1024/1100 documentados; no se crean variables CSS porque `@media` no las acepta.
- Tema: si no hay `theme` guardado, se respeta `prefers-color-scheme`; la elección del sistema no se persiste. El toggle manual sí persiste.
- Reduced motion: guard global para animaciones sin regla propia (`page-card`, `metric-card`, `list-item`, dropdowns, toasts).
- Zoom propio retirado (`body.zoom`, menú y funciones); queda el zoom del navegador.

## 8. Legibilidad y responsive (P1-C, 2026-11-27)

- Legibilidad: los 8/9px del shell, perfil y dashboard ML pasan a `--text-2xs` (10px). Los labels de 10px/10.5px se mantienen por densidad.
- Dispositivos: grilla de una columna por debajo de 600px; cards y huellas se ajustan.
- ML: el dashboard apila `dp-grid`/sidebar en ≤1100, veredicto y stats en ≤760, y veredicto/factores/features en ≤520.
- Tabs: retirado el `+` (`#tabNew`); creaba una pestaña “Untitled” sin página. Las pestañas se crean al navegar. Los botones “Nueva hoja” del spreadsheet no se tocaron: crean hoja con grilla.
- E2E móvil: overflow a 390px en Datos, ML/Dispositivos, firma y Validaciones; interacción con bottom nav en Datos, menú móvil en Validaciones y flujo completo de firma (bandeja → firmar → post-firma → reapertura) a 390px. Reutiliza logins existentes.

## 9. Módulos fuera del shell

### Auth v2

- Entrada `#auth-overlay.auth-v2` (`js/core/auth.js`) y `css/core/auth-v2.css`; no comparte el layout de dos paneles.
- Alias `--av2-*` sobre los tokens globales; login, 2FA y passkeys; toggle claro/oscuro; `role=dialog`/`aria-modal`; foco visible con el acento.

### Validaciones v7

- Entrada `#validaciones-app` (`js/core/indexx-validaciones.js`), `css/validaciones-v7.css` + `validaciones-dashboard.css`.
- Alias `--v7-*`; router por hash (`#/banco`, `#/protocolos`, `#/generador`, etc.); skip link, `<main>`, `<nav>`, `inert` y `aria-current`; responsive propio a 760px; solo admin.

### Perfil y passkeys

- `showPerfilModal()` en `js/core/indexx-ui.js`, `css/core/perfil-modal.css`.
- Muesca bajo el titlebar; cambio de tema; cambio de módulo Estadística/Validaciones; passkeys y logout; `a11yModal()`/`trapFocus()` para el foco.

## 10. Decisiones de diseño y pendiente

### Decisiones (2026-11-28)

- `.viz-card`: alias de `.side-card` desde P1-J; conserva sus clases internas y su scope `.viz-root`.
- Modales: la conducta ya está unificada con `a11yModal()`; las variantes visuales (perfil, firmas, límites) son intencionales.
- Navegaciones: sidebar, ribbon popup y tabs cubren roles distintos; no se elimina ninguna.
- Emoji vs SVG: se mantiene el emoji funcional; reemplazarlo requiere un set SVG y revisión visual.
- 10/10.5px: se mantienen por densidad; los 8/9px se eliminaron.
- F3/F4: EDA/ML ya aliasan los tokens globales en sus bases; los hex restantes son legado visual, no un defecto de producción. Quedan como backlog estético.

### Pestañas del tabbar (sheets)

| Criterio | Bajo demanda (actual) | Todas al inicio |
|---|---|---|
| Descubrimiento del flujo | 3/5 (sidebar + bottom nav) | 5/5 |
| Un clic a cualquier paso | 4/5 | 5/5 |
| Espacio desktop | 5/5 | 2/5 (6 × 100 px) |
| Móvil 390px | 5/5 | 1/5 (overflow) |
| Permisos/roles | 5/5 (solo visitadas) | 2/5 (habría que filtrar) |
| Ruido/cierre | 5/5 | 2/5 |
| Persistencia tras reload | 2/5 (ninguna) | 3/5 (siempre) |

**Decisión:** se mantiene la creación bajo demanda. El bottom nav ya es el mapa del flujo de 6 pasos; precrear todas las pestañas duplicaría esa navegación, las haría desbordar en móvil y mostraría páginas no permitidas. Si el descubrimiento es un problema, se mejora el estado vacío/bottom nav, no el tabbar. Las “hojas” del spreadsheet son datos, no pasos del flujo: una hoja por defecto y las nuevas se crean a mano.

### Pendiente

- Consolidación de navegaciones, variantes de modal y emoji: se mantienen por rol/identidad; no hay rediseño pendiente de F3/F4.

Cada fase va en commit propio y con `npx vitest run` + `backend npm test` verdes.
