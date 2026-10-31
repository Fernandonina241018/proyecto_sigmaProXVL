# Mapa de diseño — SigmaProXVL

Estado del sistema visual y reglas para que los módulos se vean iguales sin romper
comportamientos. Última actualización: 2026-10-30 (F0–F2 del módulo estadístico).

## 1. Tokens (fuente única)

`css/core/indexx.css:3-82` (`:root`, tema oscuro) y `797+` (`[data-theme="light"]`).

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

Regla: **no introducir hex nuevos**; si falta un color, se añade token.

## 2. Componentes

| Componente | Dónde | Uso |
|---|---|---|
| `.side-card` + `_sideCard()` / `sideToggleCard()` | `css/core/indexx.css:1577+`, `js/core/indexx-ui.js:359+` | Cards de sidebar: Trabajo, Reportes, Análisis |
| `.viz-card` | inyectado en `js/core/indexx-viz.js` | Visualización (pendiente: alias de `.side-card`) |
| `.datos .gl` | `css/core/indexx.css:1344+` | Paneles "glass" de Datos (legacy) |
| `.page-card` | `css/core/indexx.css:314+` | Resultados de página (Análisis) |
| `.acordeon-*` / `.ar-kpi-*` | `css/core/indexx.css:677+` | Resultados estadísticos |
| `.fbandeja-*` | `css/core/indexx.css:1252+` | Bandeja de firmas |
| `.rep-card` | `css/core/indexx.css` | Reportes (legacy) |

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

1. Un solo acento (violeta); degradados solo en el botón primario.
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

## 5. Pendiente (fases futuras)

- **F3 · EDA**: quitar gradiente del header, superficies `--surface-2`, iconos SVG.
- **F4 · Modelo/ML**: sustituir hex por tokens, panel con `.side-card`, migrar
  `.viz-card` a alias de `.side-card` y normalizar radios/sombras.

Cada fase va en commit propio y con `npx vitest run` + `backend npm test` verdes.
