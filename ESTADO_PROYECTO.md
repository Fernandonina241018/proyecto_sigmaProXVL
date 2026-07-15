# Estado del Proyecto — SigmaProXVL

## Goal
Mantener y mejorar la SPA vanilla-JS de análisis de datos (SigmaProXVL) con spreadsheet, motor estadístico, ML y cumplimiento normativo; ML Service y backend Node.js desplegados en Fly.io.

## Constraints & Preferences
- Vanilla HTML/CSS/JS (sin frameworks); tema oscuro base con toggle a modo claro
- Auth session: username, role, loginTime, expiresAt (sin info sensible)
- ML Service: FastAPI, scikit-learn, xgboost, matplotlib con `MPLBACKEND=Agg` — Fly.io `https://sigmapro-ml.fly.dev`
- Node.js backend: Express — Fly.io `https://sigmaproxvl-backend.fly.dev`; usa **Supabase PostgreSQL** (`database.js` detecta `DATABASE_URL`)
- Backend CORS permite `https://fernandonina241018.github.io`, localhost
- ML frontend llama al ML Service directamente (no proxy)
- Project root: `/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/` — Google Drive mount
- CSS `body { zoom: N% }` rompe `position:fixed` con `transform:translateX(-50%)`
- Supabase Edge Functions **no viables** para ML Service (Deno/JS, 2MB limit)

### 2026-06-25: Admin 2FA Management + Rediseño tarjetas Usuarios

**Qué:** Gestión de 2FA desde página Usuarios + refactor visual completo con diseño usercard.html:
- **Backend:** 4 nuevos endpoints admin: `GET/POST /api/users/:id/2fa` (setup/enable/disable)
- **Frontend:** Nuevo diseño de tarjetas con:
  - Barra lateral coloreada según rol (rojo admin, amarillo supervisor, azul analista)
  - Avatar con pulso animado + dot verde si está en línea
  - Stats en grid 3 columnas: último acceso, sesiones, inactividad con nivel de riesgo
  - Tags con colores semánticos (td/tw/ta/ts/tp)
  - Botón 2FA compacto en barra de acciones
  - Fila resumen arriba: total usuarios, activos, con 2FA, sesiones

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `backend/server.js:641-723` | +84 líneas: 4 endpoints admin 2FA |
| `backend/database.js:135` | `totp_enabled` añadido a SELECT |
| `js/managers/UsuariosManager.js` | Refactor completo `_renderTabla`, CSS, helpers |
| `js/managers/UsuariosManager.js:260-310` | Funciones helper: riesgo inactividad, formato, online, roles |
| `js/managers/UsuariosManager.js:312-468` | Nueva `_renderTabla` con diseño usercard |
| `js/managers/UsuariosManager.js:153-211` | Nuevo CSS para tarjetas, grid, summary |

## URLs activas
| Servicio | URL | Estado |
|----------|-----|--------|
| Frontend (GitHub Pages) | `https://fernandonina241018.github.io` | ✅ |
| Backend API | `https://sigmaproxvl-backend.fly.dev/api/health` | ✅ `database:"connected"` |
| ML Service | `https://sigmapro-ml.fly.dev/api/ml/health` | ✅ `{"ok":true}` |

### 2026-07-11: Control de acceso por roles — permisos.js

**Qué:** Nuevo sistema de permisos basado en roles. Supervisor, gerente y coordinador solo pueden acceder a "Firmar Reporte". Analista y user mantienen acceso completo (análisis + reportes).

- Nuevo archivo `js/core/permisos.js` con matriz `ALLOWED_PAGES` y helpers (`_userCanAccessPage`, `_userCanAnalyze`, `_userCanGenerateReport`, `_getAllowedPages`)
- `loadPage()` redirige si la página no está permitida para el rol
- `buildRibbonNavPopup()` filtra usando la matriz en lugar de hardcode
- Sidebar nav items se ocultan según `_getAllowedPages()` en `onLogin()`
- `runSingleStat()`, `runBatchAnalysis()`, `runEDA()` bloquean con `_userCanAnalyze()`
- `buildReportesView()`, `descargar()`, y botón "Enviar a firma" bloquean con `_userCanGenerateReport()`
- `readonly` bloqueado de todas las páginas

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/permisos.js` | **NUEVO** — 50 líneas: matriz permisos + helpers |
| `indexx.html:344` | +`<script>` para permisos.js en loader secuencial |
| `js/core/indexx-ui.js:781-788` | +check permisos en `loadPage()` |
| `js/core/indexx-ui.js:877` | `buildRibbonNavPopup()` usa `_getAllowedPages()` |
| `js/core/indexx-analysis.js:661,766,787` | +`_userCanAnalyze()` en 3 funciones |
| `js/core/indexx-analysis.js:1113-1127` | `onLogin` usa `_getAllowedPages()` para sidebar |
| `js/managers/ReporteManager.js:2043-2046` | +check en `buildReportesView()` |
| `js/managers/ReporteManager.js:2018-2021` | +check en `descargar()` |
| `js/managers/ReporteManager.js:2292` | +check en botón "Enviar a firma" |

### 2026-07-14: Gráficos — límite ampliado + persistencia activa + restauración por hoja

**Qué:** 3 mejoras al sistema de gráficos:

1. **Límite de galería aumentado de 30 a 100** — Los gráficos ya no se sobrescriben silenciosamente al alcanzar 30.

2. **Persistencia del gráfico activo** — `vizRenderChart()` guarda `_V.type`, `_V.vals` y `_V.palette` en `sessionStorage`. Al volver a la página de Visualización, `initVizPage()` restaura el gráfico que estabas viendo, sin necesidad de re-configurarlo.

3. **Restauración por hoja de origen** — Cada gráfico guardado en galería ahora almacena `sourceSheetIndex` y `sourceSheetName`. Al abrirlo desde galería, se leen temporalmente los datos de la hoja original para renderizar correctamente, incluso si la hoja activa cambió.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-viz.js:927-928` | Límite 30→100 + `sourceSheetIndex/Name` al guardar |
| `js/core/indexx-viz.js:1057` | Límite 30→100 al cargar desde localStorage |
| `js/core/indexx-viz.js:1032-1035,1048-1051` | Persistencia de `sourceSheetIndex/Name` en `_V_saveGallery()` |
| `js/core/indexx-viz.js:824-828` | `vizRenderChart()` guarda estado en sessionStorage |
| `js/core/indexx-viz.js:308-322` | `initVizPage()` restaura gráfico activo desde sessionStorage |
| `js/core/indexx-viz.js:996-1013` | `_V_showGalleryChart()` usa hoja original si existe |

## CAMBIOS RECIENTES

### 2026-07-05: Fullscreen para vista previa de firmas

**Qué:** Se agregó botón ⛶ en el header del preview de firmas para expandir a pantalla completa (misma UX que los gráficos).

- Botón `tbtn tbtn-acc` en `.page-card-header` con `onclick="firmaToggleFS()"`
- Nueva función `firmaToggleFS()` en `indexx-firma.js` — usa Fullscreen API nativa sobre `#firmaPreview`
- Al entrar en fullscreen, da foco al iframe para que teclado funcione inmediato
- Navegación ↑↓ / PageUp/PageDown dentro del iframe funciona nativo

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-ui.js:769` | + botón ⛶ en header del preview de firmas |
| `js/core/indexx-firma.js:681-691` | + función `firmaToggleFS()` |

### 2026-07-05: Navegación entre gráficos con A/D + botones ◀ ▶

**Qué:** Nueva navegación secuencial entre gráficos de la galería, visible siempre (no solo en fullscreen).

- **Teclas `A`** (anterior) / **`D`** (siguiente) — sin conflicto con flechas ← → que navegan páginas
- **Botones ◀ ▶** en la toolbar, visibles solo si hay ≥2 gráficos guardados
- **Wrap circular:** al llegar al último, sigue al primero y viceversa
- Funciona en viewer normal y en fullscreen

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-viz.js:943-952` | Nueva `_V_galleryNavigate(delta)` con wrap-around |
| `js/core/indexx-viz.js:911-916` | Nueva `_V_updateGalleryNav()` — show/hide botones |
| `js/core/indexx-viz.js:308-309,312-319` | Listener `_V_galleryKeydown` para A/D en `initVizPage()` |
| `js/core/indexx-ui.js:755-758` | Botones ◀ ▶ en toolbar con `id="vizGalNav"` |

### 2026-07-05: Fix — paste directo (Ctrl+V) en Hoja de Trabajo roto

**Qué:** Se corrigió bug crítico en `handleCellPaste()` donde la variable `text` nunca se obtenía del portapapeles, causando TypeError silencioso al pegar datos.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-trabajo.js:615-618` | +lectura de `event.clipboardData.getData('text')`, +guard, `split(/\r?\n/)` para soportar CRLF de Excel |

### 2026-07-05: Cover del reporte muestra departamento — código de proyecto

**Qué:** El spacer de 40px entre el info grid y el TOC en la primera página fue reemplazado por el texto centrado `[Departamento] — [Código de Proyecto]` en fuente grande (16pt).

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:1345-1347` | Spacer → texto centrado con `meta.departamento` + `meta.codigoProyecto` |

### 2026-07-05: Reiniciar firma requiere credenciales — código + contraseña

**Qué:** Al presionar "↺ Reiniciar" en una firma, ahora se abre un modal que pide código de firma y contraseña. Solo si la API verifica las credenciales se procede al reset.

**Problema:** Cualquiera podía reiniciar una firma solo con un `confirm()` — sin acreditar identidad.

**Solución:**
- Nuevo modal `firmaRequestReset(role)` con inputs para código + contraseña
- `firmaVerifyReset(role, code, password)` llama `POST /api/verify-signature`
- Si la API valida → ejecuta `firmaResetRole(role)`
- Se eliminó el `confirm()` redundante de `firmaResetRole()` (la validación del modal ya confirma)

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-firma.js:310` | onclick cambia: `firmaResetRole` → `firmaRequestReset` |
| `js/core/indexx-firma.js:352` | `confirm()` eliminado de `firmaResetRole()` |
| `js/core/indexx-firma.js:579-651` | Nuevo `firmaRequestReset(role)` — modal credenciales |
| `js/core/indexx-firma.js:653-673` | Nuevo `firmaVerifyReset()` — verificación API |

### 2026-07-05: Conteo de firmas visible en sidebar + badge en reporte + filename

**Qué:** El progreso de firmas ahora es visible en 3 lugares:
1. **Filename** al descargar: `RPT-XXXX_firmado_2de3_2026-07-05.html`
2. **Sidebar status**: "✅ Reporte cargado: name (2/3 firmas)"
3. **Badge en el reporte**: barra fija abajo con "✍ 2/3 firmas" — visible en iframe y al abrir el .html directo

**Solución:**
- Nueva helper `_firmaCountSigned()` que computa signed/total
- `_firmaUpdateReportBadge()` inyecta/actualiza badge en `_firmaCurrentDoc.body`
- Badge se refresca al firmar, reiniciar rol, reiniciar todas y cargar reporte

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-firma.js:387-411` | Nueva `_firmaCountSigned()` + `_firmaUpdateReportBadge()` |
| `js/core/indexx-firma.js:420` | Filename incluye `_firmado_XdeY` en `firmaDownload()` |
| `js/core/indexx-firma.js:80,236` | Status bar muestra "2/3 firmas" |
| `js/core/indexx-firma.js:360,383,566` | Badge refrescado en reset role, reset all y firma verify |

### 2026-07-05: Per-role reset — cada firmante puede reiniciar su propia firma

**Qué:** Se agregó la capacidad de reiniciar una firma individual por rol, sin afectar las firmas de otros roles. Antes solo existía "Reiniciar todas las firmas" (oculto al cargar desde archivo). Ahora cada rol firmado muestra su propio botón "↺ Reiniciar".

**Problema:** Cuando un reporte con firmas se descarga como .html y lo abre un segundo firmante:
1. `_firmaIsNewSession = false` → botón global oculto
2. `firmaResetSignatures()` reseteaba TODAS las firmas indiscriminadamente

**Solución:**
- Nueva función `firmaResetRole(role)`: resetea solo el rol indicado, actualiza preview, re-renderiza editor, persiste estado
- Botón "↺ Reiniciar" por rol en el editor, visible solo cuando el rol está firmado (sin depender de `_firmaIsNewSession`)
- El botón global "Reiniciar todas las firmas" se mantiene solo para sesiones nuevas (desde ReporteManager)

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-firma.js:348-358` | Nueva función `firmaResetRole(role)` |
| `js/core/indexx-firma.js:303-307` | Botón "↺ Reiniciar" por rol en `firmaRenderEditor()` |

### 2026-07-04: Fix — navegación del TOC rota por Paged.js

**Qué:** Paged.js v0.4.3 elimina el atributo `id` del DOM durante la paginación y lo mueve a `data-id` (confirmado por GitHub Issue #240). Al hacer clic en `<a href="#sec02">`, el navegador buscaba `id="sec02"` y no lo encontraba en el contenido paginado visible, causando que no navegara correctamente.

**Fix:** Se agregó un script al final del `<body>` que intercepta clicks en `.toc-entry`, previene el comportamiento default del enlace, busca el target por `[data-id="secXX"]` (preservado por Paged.js) y hace `scrollIntoView()`.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:1992` | Script post-render que intercepta TOC clicks y navega por `data-id` |

### 2026-07-03: Índice (TOC) como sección 01 en reporte .html con ambos idiomas

**Qué:** Se agregó tabla de contenidos como sección 01 dentro del reporte, desplazando la numeración del resto (01→02, 02→03, ... 05B→07, 06→08, 07→09). Cada entrada del índice muestra ambos idiomas (ES / EN). Se agregó espacio de 40px para contenido futuro entre el recuadro de info general y el índice.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:1348-1360` | Nueva sección 01 con TOC bilingüe + `target-counter` para páginas |
| `js/managers/ReporteManager.js:1289` | Eliminado `page-break-after:always` del cover para que TOC quede en pág 1 |
| `js/managers/ReporteManager.js:1297-1306` | CSS `.toc-body`, `.toc-entry`, `.toc-num`, `.toc-label`, `.toc-lang`, `target-counter` |
| `js/managers/ReporteManager.js:1342-1343` | Spacer `<div style="height:40px">` entre info grid y cierre de cover |
| `js/managers/ReporteManager.js:1064-1070` | Pre-computo `hasHyp` y `hasGrafs` para entradas condicionales del TOC |
| `js/managers/ReporteManager.js` | Renumeración: 01→02, 02→03, 03→04, 04→05, 05→06, 05B→07, 06→08, 07→09 |
| `js/managers/ReporteManager.js` | IDs agregados: `#sec01` a `#sec09` en cada sección para anclas |

### 2026-07-03: Page numbers "1 de 56" con Paged.js en reporte preview + PDF

**Qué:** Se agregó numeración de páginas visible en preview y al imprimir, independiente de la configuración del navegador. Usa Paged.js polyfill + CSS `@page @bottom-center`.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:1307` | `@page` con `counter(page) " de " counter(pages)` en `@bottom-center` |
| `js/managers/ReporteManager.js:1310` | Script Paged.js polyfill agregado en `<head>` |
| `js/managers/ReporteManager.js:1976` | Delay 800ms antes de `w.print()` para esperar paginación |

### 2026-07-04: Fix — persistencia estadísticos + ancho Paged.js reporte

**Qué:** Se corrigieron 5 bugs:
1. **Persistencia de estadísticos seleccionados**: Los checkboxes del menú Statistical Analysis no se restauraban al recargar la página. Se agregó escritura/lectura síncrona a `localStorage` con key `sigmaPro_selectedStats`.
2. **Ancho de reporte con Paged.js**: La causa raíz era que Paged.js v0.4.3 usa un stylesheet inyectado con `width: var(--pagedjs-width)` en `.pagedjs_sheet` y `.pagedjs_page`. No usa inline styles ni las variables `--pagedjs-page-width` que se estaban removiendo. Se agregó `.pagedjs_sheet{width:100% !important}` al `@media screen`, y se eliminó el script polling incorrecto.
3. **Parpadeo al cargar Paged.js**: `body{visibility:hidden}` + `.pagedjs_pages{visibility:visible}`.
4. **Encabezados huérfanos**: +`.sec-title{page-break-after:avoid}` en `@media print`.
5. **TOC desincronizado**: Los nombres del índice no coincidían con los títulos reales de las secciones. Se reemplazaron hardcoded strings por llamadas `t('html_secN')` para que el TOC refleje exactamente los títulos.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-analysis.js:99` | `syncActiveStatsFromDOM()` — +`localStorage.setItem(...)` |
| `js/core/indexx-analysis.js:919-934` | `buildStatMenu()` — fallback a localStorage, +`updateBadge()` |
| `js/managers/ReporteManager.js:1310` | `@media print`: +`.sec-title{page-break-after:avoid}` |
| `js/managers/ReporteManager.js:1324` | +`.pagedjs_sheet{width:100% !important}` en `@media screen` |
| `js/managers/ReporteManager.js:1328` | Script post-Paged.js simplificado a solo fallback visibility |
| `js/managers/ReporteManager.js:1358-1365` | TOC: hardcoded strings → `t('html_sec1'...6)` |

### 2026-07-02: Scroll horizontal en Hoja de Trabajo + límite columnas 100→500 + inputs límites full-width

**Qué:** Se corrigió el ancho de columnas en la Hoja de Trabajo para que sean legibles al pegar muchas columnas. Se eliminó `table-layout:fixed` y `width:100%` de la tabla, y se fijó `width:120px` por columna, forzando scroll horizontal cuando hay muchas columnas. Además se aumentó el límite máximo de columnas de 100 a 500.

**Cambios:**

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `indexx-ui.js:528` | `min-width:100px` → `width:120px;min-width:120px` por columna |
| 2 | `indexx-ui.js:573` | `width:100%;table-layout:fixed;min-width:400px` → `min-width:100%` en la tabla |
| 3 | `StateManager.js:49` | `maxCols: 100` → `maxCols: 500` |
| 4 | `indexx-trabajo.js:323-325` | Inputs globales: `width:170px` → `width:100%;box-sizing:border-box` |
| 5 | `indexx.css:218` | Nueva regla `.info-item-value input { width:100%;box-sizing:border-box }` |

**Efecto:** Con muchas columnas, la tabla ahora mide `120px × N` de ancho, el contenedor muestra scroll horizontal, y cada columna mantiene 120px legibles. Los inputs de límites en el sidebar ocupan todo el ancho disponible.

### 2026-07-02 (2): Fix — inputs globales de límites se estiran al redimensionar sidebar

**Qué:** Los inputs de límites en modo global (LS/LI/LC) no se ajustaban al redimensionar el sidebar — quedaba un espacio vacío. Se cambió `.info-item-value` que contiene un `<input>` para que use `display:flex;width:100%` y el input use `flex:1;min-width:0;width:auto`, igualando el comportamiento del input de código de firma.

**Cambios:**

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `indexx.css:219-220` | `.info-item-value:has(> input)` → `display:flex;width:100%` + input → `flex:1;min-width:0;width:auto` |

**Efecto:** Al arrastrar el borde del sidebar para hacerlo más angosto o ancho, los inputs globales de límites ahora se estiran/contraen sin dejar espacio, igual que el input "Código de firma" en la página Firmar Reporte.

### 2026-07-02 (3): Rediseño completo sidebar trabajo al estilo SAP

**Qué:** Se reemplazó el diseño del sidebar de Hoja de Trabajo por el modelo SAP (`sap_sidebar_panel_v2.html`). Incluye:

- **Header**: Título "📋 Hoja de Trabajo" + botón ⋯
- **Botones de acción**: Grid 3-col para Acciones/Editar/Vista con dropdown menus (misma funcionalidad)
- **Selector de hoja**: Estilo SAP con label "Hoja", select pulido, botones ✕/+
- **Resumen**: Badge de estado (✓ Sin anomalías / ⚠ N vacías) + 6 métricas en grid (Filas, Columnas, Vacías, Mínimo, Media, Máximo)
- **Celda activa**: Ref + valor + estadísticas de columna (μ/σ) + barra visual de posición + flag "fuera de rango"
- **Límites**: Toggle switch animado + tarjetas LOD (rojo) / MDL (naranja) / LOQ (púrpura) + badge validación secuencia + inputs con labels en grid 2+1

**Cambios:**

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `indexx-ui.js:244-306` | `leftPanels.trabajo`: header, grid acciones, sheet selector, resumen/activa/limites sin `.info-list` |
| 2 | `indexx-trabajo.js:265-289` | `getTrabajoResumenHTML()`: badge estado + 6 métricas grid (agregó Mín/Media/Máx) |
| 3 | `indexx-trabajo.js:290-340` | `getTrabajoCeldaActivaHTML()`: ref + valor + col μ/σ + barra visual + flag fuera de rango |
| 4 | `indexx-trabajo.js:355-440` | `renderLimitsPanel()`: tarjetas LOD/MDL/LOQ coloreadas, badge validación, inputs con labels en grid |
| 5 | `indexx-trabajo.js:343-353` | `toggleLimitsMode()`: ahora también sincroniza toggle visual (`.toggle-bg`, `.toggle-thumb`) |

**IDs preservados** (no se rompen referencias): `sheetsSelect`, `limitsGlobalToggle`, `trabajoResumen`, `trabajoCeldaActiva`, `trabajoLimitsBody`, `limitGlobalLS/LI/LC`, `limitLS/LI/LC_${i}`, `ddFreezeCol`, `ddCondFormat`

**Efecto:** Sidebar más compacto, informativo y profesional. Las métricas de resumen ahora incluyen estadísticas descriptivas. La celda activa muestra contexto completo. Los límites tienen presentación tipo dashboard con validación visual. Toggle animado.

### 2026-07-01: Primer login — muestra contraseña temporal + configuración obligatoria de código de firma

**Qué:** Al primer login (password_temp=1), el modal de cambio forzado ahora:
1. Muestra la contraseña temporal del usuario (`sigma2026`)
2. Exige configurar el código de firma (mín 3 caracteres) junto con la nueva contraseña

**Cambios:**

| Archivo | Cambio |
|---------|--------|
| `backend/server.js:519` | +`defaultPassword` en respuesta login cuando `mustChangePassword=true` |
| `backend/server.js:956-959` | +acepta `signatureCode` en `PUT /api/users/password`, llama `db.updateUserProfile` |
| `js/core/auth.js:63` | Captura `data.defaultPassword` |
| `js/core/auth.js:624` | Pasa `defaultPassword` a `_onLoginSuccess` |
| `js/core/auth.js:757-761` | +badge "🔑 Tu contraseña temporal es: sigma2026" en modal |
| `js/core/auth.js:792-803` | +input "CÓDIGO DE FIRMA" obligatorio con validación min 3 chars |
| `js/core/auth.js:857-868` | Validación de código de firma en submit + envía `signatureCode` al backend |
| `js/core/auth.js:899-908` | `_changePassword()` acepta y envía `signatureCode` |

### 2026-06-30: Tendencia — modal ⚙ ya no pide columna innecesaria

**Qué:** El modal de configuración de Tendencia ya no muestra un selector de columna que era irrelevante (Tendencia siempre procesa todas las columnas numéricas). También se eliminó el label engañoso "Columna de temperatura (°C)" para Tendencia.

**Cambios:**
- `estadisticosConfig.js:1209`: +`columna: false` en la entry Tendencia
- `indexx-analysis.js:560-561`: `_mostrarModalParamConfig()` salta `colHTML` si `cfg.columna === false`
- `indexx-analysis.js:604-612`: El callback de confirmación también salta el guardado de columna si `cfg.columna === false`
- El modal ⚙ de Tendencia ahora solo muestra: Tipo, Pasos, Ventana — sin selector de columna

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/estadisticosConfig.js:1209` | +1 `columna: false` en Tendencia |
| `js/core/indexx-analysis.js:560-561` | +3 salto colHTML |
| `js/core/indexx-analysis.js:604-612` | +5 salto guardado columna |

### 2026-06-30: Menú Statistical Analysis — secciones con 1 test ya no muestran submenú redundante

**Qué:** Las secciones del menú Statistical Analysis con un solo test (ej. "📈 Tendencia" que contenía solo "Tendencia") ahora se renderizan como items planos sin submenú flyout, eliminando la duplicación visual donde sección y sub-item tenían el mismo nombre.

**Cambio:** en `buildStatAnalysisMenu()` (`indexx-analysis.js:837-858`): si `seccion.options.length === 1`, se renderiza el test como item directo con checkbox `child-check`, sin `submenu-wrapper`, `has-submenu` ni `dd-arrow`. Las secciones con 2+ tests mantienen el submenú jerárquico existente.

**Archivos afectados:**
| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `js/core/indexx-analysis.js:837-858` | ~22 | Nuevo branch `if (seccion.options.length === 1)` renderiza item plano; el else mantiene submenú existente |

### 2026-06-30: Análisis de Tendencia (Lineal, Exponencial, Media Móvil)

**Qué:** Nuevo estadístico "Tendencia" con 3 tipos de análisis (Lineal, Exponencial, Media Móvil), modal de configuración con selector de tipo + pasos a proyectar, y tabla de proyecciones.

**Detalle técnico:**
- **Lineal:** regresión por mínimos cuadrados → `y = mx + b` con R², pendiente e intercepto
- **Exponencial:** log-transform → `y = a·e^(bx)` con R² sobre escala log
- **Media Móvil:** ventana deslizante MA(k) → valores suavizados
- **Proyecciones:** tabla con N pasos futuros según el tipo de tendencia
- **Config modal:** selector tipo (select), pasos (number), ventana para MA (number) — extendido `_mostrarModalParamConfig` para soportar `type:select`
- **Sidebar:** nueva sección "📈 Tendencia" con categoría dedicada
- **Renderizado:** cards custom con fórmula, R², coeficientes, dirección, interpretación + tabla de proyecciones

**Archivos afectados:**
| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `estadisticosConfig.js:1200-1233` | +34 | Config entry Tendencia con `paramConfig` (tipo select, pasos, ventana) + `seccion:'tendencia'` |
| `estadisticosConfig.js:2739` | +1 | Nueva sección `tendencia` en `getSeccionesSidebar()` |
| `utils.js:157` | +1 | `'Tendencia'` agregado a `PARAM_CONFIG_SET` |
| `indexx-analysis.js:95` | +1 | `tendencia: '📈 Tendencia'` en `getSectionDisplayName()` |
| `indexx-analysis.js:539-560` | ~22 | Extendido `_mostrarModalParamConfig` para soportar `type:select` + parsing select en confirm |
| `EstadisticaDescriptiva.js:3790-3844` | +55 | Nueva función `calcularTendencia(values, tipo, pasos, ventana)` |
| `EstadisticaDescriptiva.js:4090-4098` | +9 | Nuevo `case 'Tendencia':` en `ejecutarAnalisis()` |
| `EstadisticaDescriptiva.js:5710-5765` | +56 | Renderizado custom en `kpiCards()` para Tendencia |

### 2026-06-30: Modal avanzado de generación de datos (reemplazo completo)

**Qué:** Se reemplazó el modal simple de `generateSampleData()` y `generarDatosNormales()` por un modal avanzado con distribuciones estadísticas, preview SVG, outliers/faltantes, correlación y seed reproducible.

**Nuevo modal incluye:**
- **Distribuciones:** Normal, Uniforme, Log-normal, Exponencial, t-Student, Beta
- **Parámetros dinámicos:** campos cambian según distribución (μ,σ / min,max / α,β / df,loc / λ)
- **Vista previa SVG:** curva de densidad se dibuja en tiempo real al cambiar parámetros
- **Muestra:** observaciones (n) + número de columnas
- **Opciones avanzadas** (collapsible):
  - Outliers % (0-20%) — reemplaza valores con extremos ±3σ
  - Valores faltantes % (0-30%)
  - Correlación entre columnas (-1 a 1) — implementación con transformación lineal
  - Precisión decimal (0-8)
  - Semilla fija LCG (reproducible)
- **Resumen dinámico:** "Generará 100 × 2 normales con μ=50, σ=10 · 5% outliers"
- **Generación numérica:** Box-Muller (Normal), Marsaglia-Tsang (Gamma→Beta), chi-squared (t-Student)

**Eliminado:**
- `generarDatosNormales()` — redundante, reemplazado por el modal
- `generateValue()`, `updateGdPlaceholder()` — del modal simple anterior
- Botón `🔢 Normal` en panel Datos → reemplazado por `🎲 Generar`

**Archivos afectados:**
| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `js/core/indexx-trabajo.js:652-781` | Reemplazada `generateSampleData()` (80→260 líneas) + eliminadas 3 funciones | Modal avanzado con 6 distribuciones, preview SVG, outliers, correlación, seed |
| `js/core/indexx-ui.js:310` | `generarDatosNormales()` → `generateSampleData()` | Botón `🔢 Normal` → `🎲 Generar` |
| `css/core/indexx.css:1011-1058` | +48 líneas | Estilos del modal avanzado (`.gen-mdl`, `.gen-row`, `.gen-slrow`, `.gen-adv-grid`, etc.) |

### 2026-06-29: Revertido comando /prompt a versión ligera (765→34 líneas)

**Qué:** El comando `/prompt` se había vuelto demasiado pesado (765 líneas, ~20KB) con sistema de rutas, Brain2, skills, auto-evaluación, etc. No completaba tareas por exceso de overhead.

**Cambios:**
| Archivo | Antes | Ahora |
|---------|-------|-------|
| `prompt.md` | 765 líneas, sistema de 3 rutas, Brain2, skills, autoeval | **34 líneas** — solo las 5 técnicas de optimización, sin subagente |
| `AGENTS.md` | `/prompt` obligatorio en todos los prompts | Solo cuando el usuario lo solicite |
| `AGENTS.md` | Sección skills, autogeneración, prioridades | Eliminada (ya no existe el sistema) |

### 2026-06-26: Botón ⚙ Config en cards de estadísticos

**Qué:** Se agregó botón ⚙ en las tarjetas de estadísticos (stat cards) para reabrir el modal de configuración sin necesidad de deseleccionar y volver a seleccionar el test. Aplica a tests en `HYPOTHESIS_SET` (config de columnas) y `PARAM_CONFIG_SET` (parámetros como F0, MKT).

**Comportamiento:**
- ⚙ se muestra solo para estadísticos que requieren configuración (hypothesis tests + param config)
- ⚙ **coloreado** (color accent) si ya hay configuración guardada → permite modificarla
- ⚙ **atenuado** (opacity 0.5) si no hay configuración guardada → permite configurar por primera vez
- Click abre el mismo modal que aparece al ejecutar el test (columna de datos o parámetros)
- Al confirmar cambios, se actualiza la configuración y se muestra toast de confirmación
- El botón ▶ ejecutar permanece separado — ⚙ solo configura, ▶ solo ejecuta

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-analysis.js:127-133` | Variable `configBtnHtml` + condicional: si está en `HYPOTHESIS_SET` o `PARAM_CONFIG_SET`, genera `<span class="sc-config ...">` con clase `saved`/`pending` según config existente |
| `js/core/indexx-analysis.js:143` | `+ configBtnHtml +` insertado entre botón ▶ y ✕ en el template HTML de cada card |
| `js/core/indexx-analysis.js:584-594` | Nueva función `reopenStatConfig(nombre)`: abre `_mostrarModalConfigTest` o `_mostrarModalParamConfig` según el set del estadístico |
| `css/core/indexx.css:539-550` | Nuevos estilos `.sc-config`, `.sc-config-saved` (accent), `.sc-config-pending` (faint + opacity 0.5), hover effect |

**Fix 2026-06-26:** ⚙ modal no precargaba la configuración guardada ni re-ejecutaba el análisis tras guardar.
- `_mostrarModalConfigTest` y `_mostrarModalParamConfig`: nuevo parámetro opcional `existingConfig` → precarga selects/inputs/checkboxes con valores guardados tras montar el modal
- `reopenStatConfig`: lee `StateManager.getHypothesisConfig(nombre)` / `getParamConfig(nombre)` antes de abrir, lo pasa al modal, y en el callback llama `runSingleStat(nombre)` para actualizar resultados

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `js/core/indexx-analysis.js:215` | `_mostrarModalConfigTest` | +param `existingConfig` |
| `js/core/indexx-analysis.js:436-449` | `_mostrarModalConfigTest` | +precarga selects + checkboxes desde `existingConfig` |
| `js/core/indexx-analysis.js:530` | `_mostrarModalParamConfig` | +param `existingConfig` |
| `js/core/indexx-analysis.js:577-588` | `_mostrarModalParamConfig` | +precarga columna + parámetros desde `existingConfig` |
| `js/core/indexx-analysis.js:611-627` | `reopenStatConfig` | Lee config, lo pasa, callback re-ejecuta `runSingleStat(nombre)` |

### 2026-06-26: Fix colores de gráficos en reporte HTML — texto negro legible

**Qué:** Los gráficos incrustados en el reporte HTML usaban los mismos colores de texto que la UI (gris claro en modo oscuro `rgba(200,200,220,.5)`), resultando en etiquetas, leyendas, títulos y ejes ilegibles al exportar/ imprimir.

**Fix:** Nueva función `_V_applyReportColors(config)` inyectada en el pipeline de generación de imágenes estáticas para reportes (`_V_generateStaticImage`). Sobrescribe todos los colores de texto a `#1e293b` (gris oscuro casi negro) y las líneas de grilla a `rgba(0,0,0,.12)` para contraste óptimo sobre fondo blanco, independientemente del tema claro/oscuro de la app.

| Archivo | Línea | Cambio |
|---------|-------|--------|
| `js/core/indexx-viz.js:810-828` | Nueva función `_V_applyReportColors(config)` | Sobrescribe `Chart.defaults.color`, legend labels, axis ticks/titles/grid, plugin title a colores oscuros |
| `js/core/indexx-viz.js:844` | `_V_generateStaticImage` | +`config = _V_applyReportColors(config)` antes de renderizar el chart offscreen |

### 2026-06-26: Filtro de gráficos antiguos en reportes — checkbox incluir todos

**Qué:** Los gráficos guardados en la galería se persistían indefinidamente en localStorage y se incluían **todos** en cada reporte nuevo, incluso los de sesiones anteriores, saturando el reporte con charts irrelevantes.

**Solución:** Sistema de filtro temporal con opción manual:
- Cada item de galería ahora guarda `createdAt` (timestamp)
- `getGraficosParaReporte()` acepta parámetro `includeAll`; por defecto filtra items con más de 30 min de antigüedad
- Nuevo checkbox "📊 Incluir todos los gráficos guardados" en la sección de formatos del reporte
- Checkbox OFF (default) → solo gráficos recientes (30 min)
- Checkbox ON → todos los gráficos guardados
- Checkbox se preserva entre recargas (save/restore como el resto del formulario)
- Traducciones EN/ES agregadas

**Archivos afectados:**
| Archivo | Línea | Cambio |
|---------|-------|--------|
| `js/core/indexx-viz.js:262` | `getGraficosParaReporte` | +param `includeAll`, +filtro `createdAt > cutoff` |
| `js/core/indexx-viz.js:889` | `vizSaveToGallery` | +`createdAt: Date.now()` |
| `js/core/indexx-viz.js:997,1008` | `_V_saveGallery` | Persiste `createdAt` en localStorage |
| `js/managers/ReporteManager.js:85,364` | i18n | +`ui_chartsRecent`, +`ui_chartsAll` EN/ES |
| `js/managers/ReporteManager.js:1955` | save/restore | +`rep-include-all-charts` al array |
| `js/managers/ReporteManager.js:1868` | `generarHTML` | Lee checkbox y pasa a `getGraficosParaReporte()` |
| `js/managers/ReporteManager.js:2283-2293` | UI | Nuevo checkbox con label + desc en formatos |

### 2026-06-26: Fix QR code no visible en reporte HTML — async + error correction H

**Qué:** El código QR en el reporte HTML aparecía vacío al escanear con celular. Dos causas:
1. `QRCode.toCanvas()` es asíncrono pero no se esperaba con `await` → `canvas.toDataURL()` se ejecutaba antes de que el QR se renderizara → imagen vacía
2. `errorCorrectionLevel: 'L'` (~7% recovery) insuficiente para el logo "SAP 2.0" superpuesto en el centro (~15% del área)

**Fix:** 6 cambios en `ReporteManager.js`:

| # | Línea | Cambio |
|---|-------|--------|
| 1 | 1052 | `function generarHTML` → `async function` |
| 2 | 1072 | +`await` antes de `QRCode.toCanvas()` |
| 3 | 1073 | `errorCorrectionLevel: 'L'` → `'H'` (30% recovery) |
| 4 | 1922 | `setTimeout` callback → `async` + `await generarHTML` para HTML |
| 5 | 1923 | Idem para PDF |
| 6 | 2161 | +`await` en preview (ya dentro de `async`) |

### 2026-06-26: Campo Observaciones en formulario de reportes

**Qué:** Nuevo campo de texto libre "Observaciones" en el formulario de reportes para que el usuario pueda agregar comentarios adicionales sobre el análisis. El texto se persiste en la metadata del reporte y se renderiza en los formatos HTML, TXT y CSV.

**Archivos afectados:**

| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:108` | +i18n EN `'Observations'` |
| `js/managers/ReporteManager.js:388` | +i18n ES `'Observaciones'` |
| `js/managers/ReporteManager.js:2109-2115` | +Nuevo card con `<textarea>` en formulario |
| `js/managers/ReporteManager.js:1959,2125` | +`rep-observaciones` en arrays save/restore |
| `js/managers/ReporteManager.js:2230` | +`observaciones` en `collectMeta()` |
| `js/managers/ReporteManager.js:1311` | +Render condicional en HTML Section 01 |
| `js/managers/ReporteManager.js:655` | +Render condicional en TXT Section 1 |
| `js/managers/ReporteManager.js:1014` | +Render condicional en CSV metadata |

### 2026-06-26: Contraseña predeterminada + creación de usuarios simplificada

**Qué:** Nueva política de creación de usuarios con contraseña predeterminada (`sigma2026`) que evita que el admin tenga que generar/conocer contraseñas. Al crear usuario:
- No se solicita contraseña en el formulario — se asigna automáticamente `sigma2026`
- Se forza `password_temp=1` → el usuario debe cambiarla en primer login
- Código de firma se autogenera (`3 primeras letras del username + 3 dígitos`) por defecto, con checkbox para ingreso manual
- Badge 🔄 Pendiente cambio en tarjetas de usuarios

**Archivos afectados:**

| Archivo | Cambio |
|---------|--------|
| `backend/server.js:25` | +`DEFAULT_USER_PASSWORD` env var (fallback `sigma2026`) |
| `backend/server.js:872-928` | `POST /api/users`: password opcional, usa default si no se envía, +`passwordTemp:1`, auto-genera `signatureCode` |
| `backend/database.js:116-128` | `createUser()` Postgres: +`passwordTemp` param, +`password_temp` en INSERT |
| `backend/database.js:135` | `getAllUsers()` Postgres: +`password_temp` en SELECT |
| `backend/database.js:443-455` | `createUser()` local JSON: +`passwordTemp` param |
| `js/managers/UsuariosManager.js:91-108` | `crearUsuario()`: sin password, envía solo username+role+perfil |
| `js/managers/UsuariosManager.js:709-778` | Modal crear: -campo password, +banner contraseña temporal, +checkbox autogenerar firma |
| `js/managers/UsuariosManager.js:357` | +badge `🔄 Pendiente cambio` si `password_temp===1` |

### 2026-06-25: Fase 0 — 2FA (TOTP), WORM, Backup, Monitoring

**Qué:** Implementación de la Fase 0 del roadmap hacia producción farmacéutica. Se agregó:
- **2FA (TOTP)**: Autenticación de dos factores con otplib + QR code. Nuevo flujo de login: paso 1 credenciales → paso 2 código TOTP. Endpoints: `/api/2fa/setup`, `/api/2fa/enable`, `/api/2fa/disable`, `/api/2fa/verify-login`, `/api/2fa/status`. El login devuelve `requires2FA: true` + `tempToken` cuando el usuario tiene 2FA habilitado.
- **WORM (Write Once Read Many)**: Preservación de datos originales con tabla `data_snapshots`. Snapshot inmutable al importar datos con hash SHA-256. Sin DELETE. Endpoints: `POST /api/snapshots`, `GET /api/snapshots`, `GET /api/snapshots/:id`.
- **Backup automation**: Scripts `scripts/backup.sh` (pg_dump + compresión + checksum + retención 90 días) y `scripts/backup-restore.sh` (restauración con verificación de integridad).
- **Monitoring**: Correlation ID en cada request, alerta de requests lentos (>3s), endpoint `/api/me` ahora incluye `has2FA` status.

**Archivos afectados:**

| Archivo | Cambio |
|---------|--------|
| `backend/package.json` | + `otplib`, + `qrcode` |
| `backend/database.js` | + columnas `totp_secret`, `totp_enabled` en users; + tabla `data_snapshots`; + funciones 2FA y snapshot (PostgreSQL + Local store) |
| `backend/server.js` | + Correlation ID logging; + `/api/2fa/*` endpoints (5); + `/api/snapshots/*` endpoints (3); + modificación login para `requires2FA`; + mejora `/api/me` con `has2FA` |
| `js/core/auth.js` | + flujo 2FA en login (paso 1 → TOTP input → paso 2); + `_verify2FA()`, `_show2FAInput()`, `_show2FASuccess()`; + API pública `get2FAStatus`, `setup2FA`, `enable2FA`, `disable2FA` |
| `scripts/backup.sh` | **NUEVO** — Backup automático PostgreSQL con pg_dump, checksum, retención 90 días |
| `scripts/backup-restore.sh` | **NUEVO** — Restauración con verificación de checksum y confirmación |

**Seguridad:**
- `POST /api/2fa/disable` requiere contraseña de admin + rol admin
- `POST /api/2fa/verify-login` tiene rate limiting propio (5 intentos/15min)
- Token temporal expira en 5 minutos
- Login 2FA registra evento `LOGIN_2FA_REQUIRED` + `LOGIN` en audit trail

**Pendiente:** Ejecutar `npm install` en backend/ para instalar `otplib` y `qrcode`.

### 2026-06-29: ROUTE SELECTION — comando prompt v2.1.0 con 3 niveles

**Qué:** El comando `/prompt` ahora evalúa el prompt y bifurca en 3 rutas según COMPLEXITY. Tareas simples (atomic → ruta rápida) ya no leen Brain2, skills, ni auto-evaluación. Ahorro estimado de 60-80% tokens en prompts cotidianos.

**Cambios en `prompt.md`:**
| Función | Antes | Ahora |
|---------|-------|-------|
| Brain2 | Siempre 6 archivos | fast: 0, medium: 1, full: 6 |
| Skills | Siempre escaneo completo | fast: no carga, medium: directas, full: completa+autogen |
| Auto-evaluación | Siempre 7 checks | fast: skip, medium: 3 checks, full: 7 checks |
| Documentación | Siempre completa | fast: no, medium: parcial, full: completa |
| Versión | v2.0.0 | **v2.1.0** |

**Detección automática:**
| Tipo de prompt | Ruta | Tokens |
|----------------|------|--------|
| "haz que el botón se vea mejor" | **fast** | ~500-1000 |
| "corrige error 401 en auth.js" | **medium** | ~2000-4000 |
| "migra 15 archivos de JS a TS" | **full** | ~6000-12000 |

### 2026-06-29: Ciclo de auto-aprendizaje integrado en AGENTS.md

**Qué:** Se creó la infraestructura de skills en `/mnt/skills/` (user/private/public/examples) y se documentó el ciclo completo de auto-aprendizaje en AGENTS.md.

**Cambios:**
| Archivo | Cambio |
|---------|--------|
| `AGENTS.md` | Añadida sección 🧠 CICLO DE AUTO-APRENDIZAJE (v2) con pipeline de 8 pasos, mecanismo de mejora continua, tabla de aprendizajes/archivos, prioridad de skills y autogeneración |
| `/mnt/skills/{user,private,public,examples}/` | **NUEVO** — Directorios para skills con prioridad de scope |

**Flujo de mejora continua:**
```
Interacción 1 → aprende A → guarda en Brain2
Interacción 2 → lee A + aprende B → guarda A+B
Interacción N → responde con N-1 aprendizajes ← CADA VEZ MEJOR
```

### 2026-06-24: DEBUG_MODE activado en comando prompt

**Qué:** Se activó `DEBUG_MODE: true` en el comando `/prompt` para mostrar el SKILL AUDIT (modo, errores, skills cargadas, Brain2 accesible) al usuario durante la ejecución.

**Archivo:** `/home/fernando/.opencode/commands/prompt.md` — línea 26

### 2026-06-24: Naruto - Clash of Ninja 2 extraído para Dolphin

**Qué:** Se descargó y extrajo Naruto - Clash of Ninja 2 (USA) para GameCube desde un .zip. Archivo RVZ de 525 MB organizado en su propia carpeta.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `/mnt/datos2/Games/GameCube/Naruto - Clash of Ninja 2/Naruto - Clash of Ninja 2.rvz` | **NUEVO** — ROM extraída del .zip y renombrada |
| `Naruto - Clash of Ninja 2 (USA).zip` | **ELIMINADO** — .zip original borrado tras extracción |

### 2026-06-24: Ultimate Spider-Man extraído para Dolphin

**Qué:** Se descargó y extrajo Ultimate Spider-Man (GUTS52, Rev.00) para GameCube desde un .rar. Archivo RVZ de 808 MB organizado en su propia carpeta.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `/mnt/datos2/Games/GameCube/Ultimate Spider-Man/Ultimate Spider-Man.rvz` | **NUEVO** — ROM extraída del .rar original y renombrada |
| VLTLMT3-SPLD34M4N.rar | **ELIMINADO** — .rar original borrado tras extracción |

### 2026-06-19: Barra de navegación inferior integrada — bottom-nav con workflow steps

**Qué:** Se integró una barra de navegación inferior (bottom-nav) en la app real, siguiendo el diseño prototipado en `nav-bar-design.html`. La barra muestra 6 pasos del workflow (Datos → Trabajo → Análisis → Visualización → Reportes → Firmar) con dots, botones Anterior/Siguiente, y el nombre de la página actual.

**Cambios en 3 archivos:**

| Archivo | Cambio |
|---------|--------|
| `indexx.html` | Nuevo bloque `.bottom-nav` dentro de `.content`, después del cierre de `.panes` (~60 líneas) |
| `css/core/indexx.css` | ~70 líneas CSS con variables del tema existentes: `--bg-panel`, `--border`, `--accent`, `--item-bg`, `--card-hover`, `--text-muted`, `--text-faint`, responsive (640px) |
| `js/core/indexx-ui.js` | Nueva `updateBottomNav(name)` llamada desde `loadPage()`, workflow de 6 pasos, eventos de botones, navegación por teclado (ArrowLeft/ArrowRight) |

**Comportamiento:**
- Páginas del workflow (datos, trabajo, analisis, visualizacion, reportes, firmarReporte) → dots active/done, prev/next habilitados
- Páginas externas (auditoria, usuarios, ml, modelo-estadistico, dispositivos) → dots neutros (todos sin active), prev/next deshabilitados
- Click en dot → navega a esa página
- Teclado ArrowLeft/ArrowRight → navega (excepto en inputs)
- La muesca del tab superior (`tab.active::after`) se conserva — propósito distinto (ventanas abiertas vs flujo de trabajo)
- El sidebar indicator (`nav-item.active::before`) se conserva

**CSS responsivo:** a <640px se ocultan labels, separador y nombre de página.

### 2026-06-20: Fixes H1 + H3 + H4 (alta prioridad del beta audit)

**Qué:** Se corrigieron 3 de los hallazgos de alta prioridad identificados en el beta readiness audit: Pareto bug, setInterval sin limpieza, y fetch sin timeout.

**H3 — Pareto bug (`EstadisticaDescriptiva.js:4255,4260`):**
- `data[0]` y `data.forEach` corregidos a `data.data[0]` y `data.data.forEach`
- `getDataForEjecutarAnalisis()` retorna `{ headers, data, rowCount }` pero el código del Pareto accedía directamente al objeto en vez del array interno
- **Riesgo:** ALTO — el Pareto no se ejecutaba nunca; mostraba error "Seleccione columna de categorías" aunque la columna existiera
- **Sintaxis:** ✅ `node -c`

**H1 — setInterval cleanup (`ml.js:1206,2780`):**
- Los intervalos de polling `train()` y `trainAll()` ahora verifican que la página ML siga activa (`document.getElementById('ml-results')`) antes de continuar
- Si el usuario navega a otra página durante entrenamiento, el intervalo se limpia inmediatamente
- **Riesgo:** ALTO — intervalos huérfanos seguían haciendo fetch al ML Service incluso con la página oculta
- **Sintaxis:** ✅ `node -c`

**H4 — fetch con timeout (`utils.js`, `auth.js`, `Logger.js`, `indexx-ui.js`, `indexx-firma.js`, `UsuariosManager.js`, `AuditoriaManager.js`, `DispositivosManager.js`):**
- Nueva función `fetchWithTimeout(url, options, timeoutMs=15000)` en `utils.js:189` que envuelve `fetch()` con `AbortController`
- Aplicada a TODAS las llamadas backend: login, cambio password, ML API key, registro dispositivo, /api/me, logout, audit event, verify-signature, y todos los CRUD de usuarios/auditoría/dispositivos
- ml.js ya tenía su propio AbortController (30s), no se modificó
- **Riesgo:** MEDIO — evita que requests huérfanas cuelguen la UI para siempre
- **Sintaxis:** ✅ `node -c` en los 9 archivos modificados

### 2026-06-20: H6 — Empty/error states en páginas de administración

**Qué:** Se mejoraron los estados vacíos y de error en las 4 páginas de administración: Dispositivos, Auditoría, Usuarios y ML. Se corrigió una inconsistencia arquitectónica donde `DispositivosManager.buildView()` reemplazaba todo `rightPaneBody` (perdiendo clase `page-body`).

**DispositivosManager — fix arquitectura + estados:**
- `buildView()` ahora usa `#dsp-container` en vez de `rightPaneBody` — consistente con el resto de managers
- Error state ahora incluye botón "🔄 Reintentar"
- Empty state mejorado: explica que los dispositivos se registran automáticamente al iniciar sesión
- **Riesgo:** BAJO (solo cambia target container, misma lógica)
- **Sintaxis:** ✅ `node -c`

**AuditoríaManager — KPIs stuck en "Cargando..." + estados:**
- Error state ahora pisa KPIs con mensaje "Error de conexión" en rojo (ya no queda "Cargando..." para siempre)
- Error state incluye botón "🔄 Reintentar" via `AuditoriaManager._onRefresh()` (nuevo, expuesto)
- Empty state distingue: "No hay registros de auditoría aún" vs "No hay registros que coincidan con los filtros" (detecta si hay filtros activos)
- **Sintaxis:** ✅ `node -c`

**UsuariosManager — error state:**
- Error state incluye botón "🔄 Reintentar" via `UsuariosManager._onRefresh()` (nuevo, expuesto)
- **Sintaxis:** ✅ `node -c`

**ML page — estados existentes OK:**
- Empty state inicial: instrucciones paso a paso (guía)
- Warm-up: "Despertando ML Service..."
- Model error: mensaje rojo con botón "Reintentar"
- Error en fetch de datasets/modelos: select muestra error + toast

### 2026-06-20: Responsive — layout adaptable a móvil/tablet + rendimiento + i18n admin

**Responsive (10% → ~50%):**
- Breakpoint ≤1024px: paneles izquierdos más angostos
- Breakpoint ≤768px (tablet/móvil horizontal): paneles apilados verticalmente, sidebar como overlay fijo con backdrop, ribbon compacto (32px), titlebar oculto
- Breakpoint ≤480px (teléfono): ribbon oculto, botón hamburguesa flotante `#mobileMenuBtn`, sidebar overlay toggle
- Sidebar usa overlay (`position:fixed;transform`) en lugar de collapse en móvil, con `#sidebarBackdrop` para cerrar al tocar fuera
- `toggleSidebar()` modificada para detectar `window.innerWidth ≤ 768` y usar overlay en lugar de collapse
- **Archivos:** `indexx.html` (+backdrop), `indexx.css` (+~80 líneas responsive), `indexx-ui.js` (+backdrop handler, toggle adaptativo)

**Performance (60% → ~70%):**
- Trabajo page: paginación añadida (default 200 rows/página), idéntica a Datos pero con índices offset para preservar edición
- Controles de paginación en footer: ⏮ ◀ 1/5 ▶ ⏭ + selector 100/200/500/1000
- `trabajoPage`, `trabajoPageSize` globales en `indexx-globals.js`
- `trabajoGoPage(page)`, `trabajoChangePageSize(size)` en `indexx-trabajo.js`
- Las columnas >200 ya no renderizan todo el DOM — solo la página visible
- **Archivos:** `indexx-globals.js`, `indexx-ui.js`, `indexx-trabajo.js`

**i18n (30% → ~50%):**
- Nuevo `js/core/i18n-core.js` — sistema de traducciones compartido para toda la app (no solo Reportes)
- `I18N.en` + `I18N.es` con ~75 keys cada uno: admin general, auditoría, usuarios, dispositivos
- `t(key, ...args)` global que usa `window._LANG` (`'es'` por defecto, persistido en localStorage)
- `setLang(lang)` para cambiar idioma desde cualquier página, recarga la página actual
- Aplicado a DispositivosManager, AuditoriaManager, UsuariosManager — reemplazadas strings hardcodeadas con llamadas `t()`
- Registrado en script loader de `indexx.html` (después de auth.js, antes de managers)
- **Archivos:** `i18n-core.js` (NUEVO), `indexx.html`, `DispositivosManager.js`, `AuditoriaManager.js`, `UsuariosManager.js`

**Sintaxis:** ✅ `node -c` en los 11 archivos modificados

### 2026-06-19: Traducciones español + preservar estado del formulario al cambiar idioma

**Qué:** Se agregó `I18N.es` completo con todas las claves traducidas al español (~80 strings + funciones). Ahora `t('ui_statusOk')` retorna "Análisis listo para exportar", `t('ui_formatHint')` retorna "Selecciona uno o más formatos...", etc.

**Además:** Se implementó guardado/restauración de estado del formulario al cambiar idioma. Ya no se pierden los valores de los inputs/selects/checkboxes al togglear entre español e inglés. `autoSyncProtocol` se ejecuta tras restaurar los valores.

**Archivo:** `js/managers/ReporteManager.js` (+163 líneas)

**Fix:** Al cambiar idioma ya no aparecían "segmentos de código" — ahora el idioma español tiene sus propias traducciones y el formulario preserva su estado completo.

### 2026-06-18: Reorganización de inputs en Reportes — auto-filled al fondo

**Qué:** Se reorganizó el formulario de la página Reportes para separar campos manuales de auto-completados. Los inputs auto-filled (Dataset, Archivo, Fecha) pasan a una tarjeta "Autocompletado" al final. Descripción y Ensayo dejaron de ser full-width para integrarse en la grilla de 2 columnas. Protocolo se movió al final de su tarjeta.

**Cambio:** `js/managers/ReporteManager.js` — función `buildReportesView()`

**Nuevo orden de la Card 2 (Información del reporte):**
1. Organización · Departamento
2. Ubicación · Descripción
3. Marca · Modelo
4. Serie · Fase
5. Código · Ensayo
6. Versión · Confidencialidad
7. Protocolo (readonly, auto)

**Nueva Card 3 (Autocompletado):**
- Dataset · Archivo · Fecha recolección

### 2026-06-18: Auto-busting de caché — nunca más Ctrl+F5

**Qué:** Se eliminó la necesidad de forzar refresco (Ctrl+F5) después de cada deploy. Ahora todos los JS locales se cargan dinámicamente con `?t={timestamp}` y los CSS se inyectan via `document.write` con `?t={timestamp}`, forzando al navegador a buscar la versión nueva automáticamente.

**Cambios (solo `indexx.html`):**

| Antes | Ahora |
|-------|-------|
| 26 `<script src="...">` estáticos (cacheados por el navegador) | 1 loader inline que carga todos los JS secuencialmente con `?t=Date.now()` |
| `estadisticosConfig.js` en `<head>` (bloqueante) | Incluido en el loader dinámico |
| 7 `<link rel="stylesheet">` estáticos (cacheados) | 1 script inline con `document.write` + `?t=_CACHE_BUST` |
| Ctrl+F5 obligatorio tras cada push | Page load normal trae todos los assets frescos |

**Mecanismo:**
- `window._CACHE_BUST = Date.now()` se define al inicio del `<head>`
- **CSS:** loader via `document.write` en `<head>` — sincrónico, bloquea render como `<link>` normal → cero FOUC
- **JS:** loader al final del `<body>` crea `<script>` tags secuencialmente con `?t=...`
- CDN scripts (Chart.js, QR code, Papaparse, XLSX) se mantienen como estáticos

### 2026-06-17: Columna de fórmulas en Reportes unificada contra estadisticosConfig

**Qué:** La columna "Formula" del reporte HTML se quedaba vacía para varios estadísticos porque solo consultaba `I18N.en.statFormulas` (mapa fijo). Se unificó contra `estadisticosConfig.formula` que ya existe en TODAS las entradas. Además se eliminaron **170 líneas hardcodeadas** de `txtStatsInfo` en la Sección 5 del TXT.

**Cambios en `js/managers/ReporteManager.js`:**
- **HTML `statsRows()`:** Nueva función `_getFormula(stat)` que resuelve `estadisticosConfig[stat]?.formula` → `t('statFormulas')[stat]` → `''`. Así cada stat con `formula` definida en el config la muestra en la columna.
- **TXT Sección 5 (`txtStatsInfo`):** Objeto hardcodeado de 170 líneas reemplazado por lookup dinámico: `estadisticosConfig[stat]` → `desc` + `formula`. Un mantenimiento: ya no hay que editar dos lugares al agregar un nuevo estadístico.

**Antes:** columna vacía para stats que no estaban en `I18N.en.statFormulas`.
**Después:** columna poblada para TODOS los stats con `formula` definida en `estadisticosConfig.js`.

### 2026-06-17: Advertencias de MKT visibles en Reportes (NaN corregido)

**Qué:** Las advertencias de MKT (Mean Kinetic Temperature) aparecían como `NaN` en el reporte. Se corrigió la causa raíz en `fmtNum()` y se mejoró la presentación como badges destacados.

**Cambios en `js/managers/ReporteManager.js`:**
- **Fix A — `fmtNum()` line 376:** Nuevo guard para arrays de objetos. Si el primer elemento es un objeto, extrae `.msg`/`.mensaje` en vez de llamar `Number()` que produce `NaN`
- **Fix B — TXT (line 537), HTML `statsRows()` (line 1140), CSV (line 1056):** Se salta la clave `advertencias` en el loop genérico de `Object.entries()` y se renderiza aparte:
  - **TXT:** Ícono `⚠`/`→` con el texto de la advertencia
  - **HTML:** Badge tipo chip con fondo rojo (exceso) o amarillo (aviso), texto y borde redondeado
  - **CSV:** Fila extra con tipo `ADVERTENCIA`

**Comportamiento antes:**
```
· advertencias: NaN
```

**Comportamiento después:**
```
[TXT]
  ⚠ MKT (28.5°C) excede el límite de 25°C

[HTML]
  ⚠ MKT (28.5°C) excede el límite de 25°C   ← badge rojo
```

### 2026-06-17: Trazabilidad auto-poblada en Reportes para datos manuales

**Qué:** La sección de Trazabilidad del Dataset en Reportes ahora se auto-llena cuando los datos fueron ingresados manualmente desde la página Trabajo. Se agregó un flag `datosSourceType` para tracking de origen de datos.

**Cambios:**
- `js/core/indexx-globals.js` — Nuevo global `datosSourceType` (`'none'|'file'|'paste'|'manual'`), persistido en localStorage
- `js/core/indexx-datos.js` — `finishLoad()` setea `datosSourceType = 'file'` o `'paste'` según origen
- `js/core/indexx-trabajo.js` — `addRow()`/`addColumn()` detectan entrada manual; `limpiarDataset()` resetea a `'none'`
- `js/managers/ReporteManager.js` — `buildReportesView()` usa `datosSourceType` para mostrar "Digitación manual" en campos de trazabilidad; `rep-collect` se auto-llena con la fecha de hoy; preview de fecha sincronizado

**Comportamiento:**
| Escenario | rep-dataset | rep-file | rep-collect |
|-----------|------------|----------|-------------|
| Archivo importado | nombre_sin_ext | archivo.csv | Hoy (auto) |
| Datos pegados | datos_pegados | datos_pegados.csv | Hoy (auto) |
| Digitación manual | Digitación manual | Digitación manual | Hoy (auto) |

### 2026-06-17: Soporte modo claro en Visualización + auto-re-render

**Qué:** Se corrigió la página de Visualización para que se adapte automáticamente al modo claro/oscuro de la app, tanto en CSS como en Chart.js. Se agregó re-render automático al cambiar de tema.

**Cambios:**
- `js/core/indexx-viz.js`:
  - **Paleta "Claro" agregada** — 5 colores saturados de alto contraste (`#2563eb`, `#dc2626`, `#16a34a`, `#d97706`, `#9333ea`) para fondos claros
  - **CSS variables** — Reemplazados valores fijos oscuros (`#0d0d1b`, `#121226`, etc.) por `var(--bg-primary)`, `var(--bg-panel)`, `var(--bg-secondary)`, `var(--text-primary)`, `var(--text-muted)`, `var(--border)`, etc. que respetan el tema de la app
  - **Chart.js theme-aware** — `_V_baseOpts()` detecta `data-theme="light"` y usa colores apropiados: grid `rgba(0,0,0,.08)`, texto `rgba(100,116,139,.8)`, tooltip blanco con texto oscuro
  - **Radar chart** — Grid/text colors ahora usan `_V_isLight()`
  - **Chart.defaults.color** — Ahora es tema-aware
  - **Circular/Dona borders** — Cambiados de `rgba(255,255,255,...)` a `rgba(0,0,0,...)` para visibilidad en ambos modos
  - **MutationObserver** — `_V_observeTheme()` escucha cambios en `data-theme` del `<html>` y re-renderiza automáticamente el chart si hay uno activo

### 2026-06-18: Galería interactiva — Chart.js real con hover/tooltip/DPR en lugar de PNG estáticos

**Qué:** Los gráficos generados en lote (batch) y guardados en galería ahora se muestran como instancias **Chart.js reales** con interactividad completa (hover, tooltip, animación), calidad retina (DPR automático) y adaptación al tema claro/oscuro. Se eliminó la captura de PNG full-res, reemplazada por thumbnails pequeños de 200×120 para la tira visual.

**Cambios (solo `js/core/indexx-viz.js`):**

| Función | Cambio |
|---------|--------|
| `initVizPage()` | Nuevo flag `_V._galleryMode = false` |
| `vizSelType()` | Resetea `_V._galleryMode` al seleccionar un tipo |
| `_V_observeTheme()` | MutationObserver re-aplica título de galería tras cambio de tema |
| `getGraficosParaReporte()` | Soporta items nuevos: genera PNG estático vía `_V_generateStaticImage()` |
| `_V_generateStaticImage()` | **NUEVA**: helper que renderiza chart en canvas off-DOM desde vars guardados y retorna PNG (para Reportes) |
| `vizSaveToGallery()` | Guarda `{ type, vars, palette, thumb }` en lugar de `url` (PNG full-res). Captura thumbnail 200×120 del canvas |
| `vizRefreshGallery()` | Muestra thumbnail de `g.thumb`, fallback a `g.url` (legacy), fallback a `.gal-noimg` |
| `_V_showGalleryChart()` | Si `g.vars` existe → reconstruye Chart.js real con `vizRenderChart()`. Si `g.url` (legacy) → muestra estático |
| `_V_saveGallery()` | Persiste estructura compacta: `{ id, title, type, vars, palette, thumb, url }`. En cuota excedida guarda sin thumb |
| `_V_batchGenerate()` | Canvas temporal reducido a 200×120 solo para thumbnail. Guarda `{ type, vars, palette, thumb }`. Ya no captura PNG full-res |
| `_V_injectCSS()` | Nueva regla `.gal-noimg` para thumbnails sin imagen |

**Características del nuevo sistema:**
- Gráficos en galería tienen **hover**, **tooltip**, **cambio de tema automático**
- Calidad **retina/DPR** igual que los renders individuales
- Thumbnails pequeños (~3-8 KB c/u vs ~100-300 KB del PNG full-res)
- Sin riesgo de exceder cuota de localStorage
- Backward compatible: items legacy con `url` se muestran como antes (estático)

### 2026-06-16: MKT (Mean Kinetic Temperature) — nuevo estadístico USP <659>

**Qué:** Se agregó el estadístico **MKT** (Mean Kinetic Temperature / Temperatura Cinética Media) según USP <659> para estudios de estabilidad. Calcula la temperatura única que representa el efecto acumulativo de temperaturas variables durante almacenamiento/transporte.

**Cambios:**

| Archivo | Cambio |
|---------|--------|
| `js/core/estadisticosConfig.js` | **NUEVA ENTRADA**: `'MKT (Mean Kinetic Temperature)'` en sección `calidad` con `multiCol: true`, `paramConfig` (ΔH/R, límite superior, límite inferior), interpretación con plantilla y referencia USP <659> |
| `js/core/EstadisticaDescriptiva.js` | **NUEVA FUNCIÓN**: `calcularMKT(temperaturas, options)` que aplica la fórmula USP y genera advertencias si las temperaturas exceden los límites configurados. **NUEVO CASE**: en `ejecutarAnalisis()` para ejecutar MKT por columna seleccionable |

**Características:**
- Fórmula: `MKT = -ΔH/R / ln(Σ e^(-ΔH/R/Tᵢ) / n)` con ΔH/R = 10000 K por defecto
- Selección múltiple de columnas (varios lotes/sensores simultáneamente)
- Parámetros configurables vía modal: ΔH/R, límite superior e inferior de temperatura (°C)
- Advertencias automáticas: si temperatura > límite_max, si MKT > límite_max, etc.
- Retorna: MKT en °C y K, T_max, T_min, advertencias, interpretación textual
- Aparece en sidebar de Análisis → sección **Calidad** (junto a F0 y Pareto)

**Verificación:** ✅ `node -c` en ambos archivos JS

---

### 2026-06-16: Dot Plot (Puntos) + Gráfico de Control — nuevos tipos en Visualización

**Qué:** Se agregó el tipo **Puntos** (dot plot / dispersión 1D) que muestra cada valor como un punto con jitter horizontal y una línea verde del promedio. Los puntos sobre el promedio se colorean con el color primario de la paleta, los debajo con el color terciario. También se agregó el tipo **Control** (Shewhart) con líneas UCL/LCL desde Trabajo.

**Cambios (Puntos):**

| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-viz.js` | Nuevo tipo `dotplot` en categoría `stat` con SVG thumbnail, slot de variable única, case en `_V_buildConfig()` (scatter con jitter + línea de promedio). Agregado a `_V_TYPE_MAP`, modal batch y handler de generación |

**Características (Puntos):**
- Un solo slot: Variable a analizar (columna numérica)
- Cada valor se grafica como un punto con jitter horizontal aleatorio para evitar solapamiento
- Línea verde discontinua del promedio
- Puntos ≥ promedio usan el color primario de la paleta; < promedio usan el terciario
- Soporta batch múltiple desde modal 🔁

---

### 2026-06-16: Gráfico de Control — nuevo tipo en Visualización

**Qué:** Se agregó el tipo de gráfico **Control** (Gráfico de Control/Shewhart) en la categoría Estadístico, que toma los límites configurados en la página Trabajo (`getLimits()`) y los dibuja como líneas horizontales UCL/LCL (rojo punteado) y Central (verde punteado) sobre una línea de datos. Los puntos fuera de límites se marcan en rojo.

**Cambios:**

| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-viz.js` | **MODIFICADO** (877→967 líneas). Nuevo tipo `control` en categoría `stat` con SVG thumbnail, slot de ejes (X opcional, Y), y case en `_V_buildConfig()` que construye dataset con líneas de límites. Agregado a `_V_TYPE_MAP` y al modal batch (`showBatchGraphModal`) |
| `js/core/indexx-ui.js` | **MODIFICADO**: Botón "📄 Reportes" agregado al action bar del left panel de Visualización |

**Características:**
- Usa `getLimits(columna)` para obtener UCL (LS), LCL (LI), Central (LC) desde Trabajo
- Si no hay Central configurada, calcula la media automáticamente
- Eje X opcional (columna tipo tiempo/muestra); por defecto usa índice (1,2,3...)
- Puntos fuera de UCL/LCL se pintan en rojo (#ef4444)
- Soporta renderizado batch múltiple desde el modal 🔁 (seleccionar varias columnas → un control chart por columna)
- Paletas, toggles (leyenda/grilla/animación/suavizado) compatibles

**Verificación:** ✅ `node -c` en `indexx-viz.js` | ✅ `getLimits()` disponible (cargado antes en `indexx-trabajo.js`)

---

### 2026-06-16: Rediseño completo de la página Visualización (diseño z_error.md)

**Qué:** Migración completa de la página de Visualización al diseño de `z_error.md`. Se reemplazó la UI antigua (botones en grilla + selects) por un panel izquierdo con categorías de gráficos con SVG thumbnails, configuración de ejes, paletas de colores y panel de estilo; y un panel derecho con galería strip + área de chart principal + toolbar.

**Cambios:**

| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-viz.js` | **REESCRITO** (774→877 líneas). Nuevo motor con 14 tipos de gráficos categorizados, SVG thumbnails, 6 paletas de colores, toggles (leyenda/grilla/animación/suavizado), galería con persistencia localStorage, exportación PNG, pantalla completa, detección automática de columnas numéricas vs categóricas de datos reales |
| `js/core/indexx-ui.js` | **MODIFICADO**: `leftPanels.visualizacion()` reemplazado con nuevo HTML (secciones colapsables: Tipo, Variables, Estilo, Action Bar). `rightPanels.visualizacion()` reemplazado con header + galería + chart area + toolbar |

**Qué cambió en la UI:**
- Panel izquierdo: categorías tipo Brave (Comparación, Distribución, Tendencia, Composición, Estadístico) con SVG thumbnails por cada tipo
- Selección de variables dinámica según el tipo de gráfico seleccionado
- Título personalizable, 6 paletas de colores (Violeta, Océano, Coral, Bosque, Rosa, Sunset)
- Toggles: Leyenda, Grilla, Animación, Suavizado
- Galería lateral con thumbnails de gráficos guardados (persistente entre sesiones)
- Exportación a PNG y pantalla completa
- Datos reales desde `getCurrentSheet()` con detección automática de tipos de columna

**Mantenido:**
- `showBatchGraphModal()` adaptado para guardar en galería
- `window.Visualizacion.getGraficosParaReporte()` para integración con Reportes
- `initVizPage()` como entry point (llamado desde `loadPage('visualizacion')`)

**Verificación:** ✅ `node -c` en ambos archivos JS | ✅ Sin referencias obsoletas (0 matches de IDs antiguos)

---

### 2026-06-15: Fix perfil 403 — /api/me ahora incluye profile, modal ya no llama /api/users

**Qué:** El modal de perfil de usuario (click en avatar) llamaba a `GET /api/users` (admin-only) para buscar el usuario actual → 403 para no-admin.

**Fixes:**
- `backend/server.js:509` — `/api/me` ahora hace `db.getUserByUsername()` y retorna `profile` con nombre, email, cargo, teléfono, firma, etc.
- `js/core/indexx-ui.js:127` — el modal de perfil ahora usa `/api/me` en vez de `/api/users`

**Verificación:** ✅ `node -c` en ambos archivos

---

### 2026-06-15: Nav items de Administración ocultos para no-admin

**Qué:** Los nav items Auditoría, Usuarios y Dispositivos (y el título "Administración") ahora se ocultan automáticamente si el usuario no tiene role `admin`.

**Cambio:** `indexx-analysis.js:977-990` — refactorizado el hide/show en `onLogin` para usar un array `adminPages` en vez de 2 variables sueltas; incluye `dispositivos` y el título "Administración".

---

### 2026-06-15: Fix logout 401 — faltaba Authorization header en POST /api/logout

**Qué:** `logout()` en auth.js llamaba `POST /api/logout` sin `Authorization` header. `requireAuth` exige header para POST (protección CSRF) → 401 en consola.

**Fix:** `auth.js:798` — agregado `headers:{Authorization:'Bearer '+(_token||'')}` al fetch.

---

### 2026-06-15: Fix 401 en Dispositivos + _registerDevice con _token null

**Qué:** La página Dispositivos quedaba en blanco sin mostrar errores. Causas:
1. `_registerDevice()` se disparaba en cada recarga de página aunque `_token` fuera `null` → enviaba `Authorization: Bearer null` → 401 en consola
2. `DispositivosManager.cargarDispositivos()` no tenía `try/catch` → si `res.json()` fallaba (respuesta vacía/ilegible), la Promise se rechazaba sin manejador → el spinner quedaba forever → página en blanco
3. Las requests enviaban `Bearer null` literal cuando `Auth.getToken()` retornaba `null`

**Fixes:**

| Archivo | Cambio |
|---------|--------|
| `js/core/auth.js:739` | +`if (!_token) return;` en `_registerDevice()` |
| `js/managers/DispositivosManager.js:17-23` | `apiGet`/`apiPost`/`apiPut`/`apiDelete`: `getToken()` → `(getToken() \|\| '')` |
| `js/managers/DispositivosManager.js:54-64` | `cargarDispositivos()` envuelto en `try/catch` — retorna `{ok:false, error}` igual que `UsuariosManager` |

**Verificación:** ✅ `node -c` en ambos archivos

---

### 2026-06-15: § 11.10(h) — Device Checks (verificación de dispositivos)

**Qué:** Implementado CFR 21 Part 11 § 11.10(h) — verificación de validez del origen de entrada de datos. Cada dispositivo es identificado por fingerprint (canvas + navegador), registrado al login, y admin puede marcarlo como confiado o no confiado.

**Componentes nuevos:**

| Archivo | Propósito |
|---------|-----------|
| `js/core/DeviceFingerprint.js` | Genera fingerprint SHA-256 del dispositivo (canvas fingerprint + userAgent + screen + timezone + language + platform) |
| `js/managers/DispositivosManager.js` | UI de administración de dispositivos (solo admin): cards con info, toggle trust, eliminar |
| `css/pages/dispositivos.css` | Estilos para la UI de dispositivos |

**Archivos modificados:**

| Archivo | Cambio |
|---------|--------|
| `backend/database.js` | +tabla `trusted_devices` (Postgres + local store), +métodos `registerDevice`, `isDeviceTrusted`, `getUserDevices`, `getAllDevices`, `setDeviceTrust`, `removeDevice` |
| `backend/server.js` | +4 endpoints: `POST /api/devices/register`, `GET /api/devices`, `PUT /api/devices/:id/trust`, `DELETE /api/devices/:id` |
| `js/core/auth.js` | `_onLoginSuccess()` ahora llama `_registerDevice()` para registrar fingerprint al iniciar sesión |
| `js/core/Logger.js` | Todos los eventos de auditoría incluyen `deviceFingerprint` en detalles |
| `js/core/indexx-ui.js` | +nav item `dispositivos` en pageIcons/pageTitles, +init en loadPage, +restricción admin |
| `indexx.html` | +nav link "Dispositivos" en sección Administración |

**Flujo:**
1. Usuario inicia sesión → `DeviceFingerprint.getFingerprint()` se ejecuta → `POST /api/devices/register` guarda/actualiza el dispositivo
2. Admin va a "Dispositivos" → lista de dispositivos con info de navegador, OS, pantalla, última vez
3. Admin puede confiar/desconfiar/eliminar dispositivos
4. Todos los eventos de auditoría llevan el fingerprint → trazabilidad completa

**Verificación:** ✅ `node -c` en los 9 archivos JS modificados/creados

---

### 2026-06-14: F0 multi-columna — seleccionar varias columnas de temperatura en el modal

**Qué:** F0 ahora permite seleccionar múltiples columnas de temperatura vía checkboxes en el modal paramétrico. Cada columna se procesa independientemente y se muestra con su propia card de resultado.

**Qué cambió:**
- `multiCol: true` agregado a la entry de F0 en `estadisticosConfig.js`
- `_mostrarModalParamConfig()` en `indexx-analysis.js`: cuando `cfg.multiCol === true`, renderiza checkboxes en vez de un `<select>` único; guarda `config.columnas` (array) en vez de `config.columna` (string)
- `ejecutarAnalisis()` caso F0: itera sobre `cfg.columnas` (o `numericCols` si no hay selección) y computa F0 para cada columna
- `kpiCards()`: nuevo render dedicado para F0 con card por columna mostrando F0 (grande), T máx, tiempo sobre umbral, n, y badge coloreado según umbrales

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/estadisticosConfig.js` | +`multiCol: true`, +`tipo: 'multiples-columnas'` en inputs de F0 |
| `js/core/indexx-analysis.js` | `_mostrarModalParamConfig()`: checkboxes multi-columna cuando cfg.multiCol, guarda array `columnas` |
| `js/core/EstadisticaDescriptiva.js` | `ejecutarAnalisis()` F0: itera sobre `cfg.columnas`. `kpiCards()`: +render dedicado F0 con badge color-coded |

**Verificación:** ✅ `node -c` en los 3 archivos JS modificados

---

### 2026-06-14: Umbrales F0 configurables desde modal paramétrico

**Qué:** Los umbrales de interpretación de F0 (objetivo=12, mínimo=8) ahora son configurables desde el modal de parámetros, en lugar de estar hardcodeados en `calcularFactorLetalidad()`.

**Qué cambió:**
- `umbral_F0` y `umbral_F0_min` agregados al `paramConfig` de F0 en `estadisticosConfig.js`
- `calcularFactorLetalidad()` ahora lee `options.umbral_F0` y `options.umbral_F0_min` en lugar de usar 12 y 8 fijos
- `ejecutarAnalisis()` forwardea los nuevos parámetros desde `hypothesisConfig` a `f0Opts`

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/estadisticosConfig.js` | +2 items en `paramConfig` de F0: `umbral_F0` (default 12) y `umbral_F0_min` (default 8) |
| `js/core/EstadisticaDescriptiva.js` | `calcularFactorLetalidad()`: reemplazados 12/8 hardcodeados por `options.umbral_F0`/`options.umbral_F0_min` (con fallback a 12/8). `ejecutarAnalisis()`: +forwarding `cfg.umbral_F0`/`cfg.umbral_F0_min` a `f0Opts` |

**Verificación:** ✅ `node -c` en ambos archivos modificados

---

### 2026-06-14: Stat dropdown — Brave-style flyout on hover en vez de accordion

**Qué:** El menú de estadísticos (dropdown "Estadísticos" en la ribbon) cambió de accordion (click para expandir/colapsar) a flyout hover (estilo menú Brave).

**Qué cambió:**
- Las secciones ya no requieren click para expandirse
- Al colocar el mouse sobre una sección, aparece un panel flotante a la derecha con los sub-items
- El panel tiene `box-shadow`, scroll propio (max-height: 400px) y no se clippea por el dropdown principal
- Un puente hover (`::after`) entre la sección y el flyout previene parpadeo al mover el mouse

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `css/core/indexx.css` | +23 líneas al final: `#statAnalysisDropdown` con overflow visible, flyout absolute, hover bridge, sin flecha |
| `js/core/indexx-analysis.js` | `buildStatAnalysisMenu()`: removido `onclick="toggleSubmenu(...)"` de headers de sección. Eliminada función `toggleSubmenu()` |

**Verificación:** ✅ `node -c indexx-analysis.js`

---

### 2026-06-14: Modal paramétrico para F0 — selector de columna + Δt, z, T_ref

**Qué:** Se agregó un modal de configuración paramétrica para "Factor de Letalidad (F0)" que permite al usuario seleccionar la columna de temperatura y ajustar los parámetros del cálculo antes de ejecutar.

**Problema:** F0 usaba defaults (Δt=1, z=10, T_ref=121) sin posibilidad de configuración. El usuario preguntó "cómo asume el tiempo de inicio y final" — no había forma de configurarlo.

**Solución:** Sistema genérico de configuración paramétrica para estadísticos que lo necesiten:
1. `paramConfig` en `estadisticosConfig.js` — define los campos editables
2. `PARAM_CONFIG_SET` en `utils.js` — lista de stats con parámetros editables
3. `_mostrarModalParamConfig()` en `indexx-analysis.js` — modal dinámico generado desde `cfg.paramConfig`
4. `StateManager.setParamConfig/getParamConfig` — persistencia de la configuración
5. Integración en `runSingleStat`, `runBatchAnalysis`, `onSubitemClick`, `onChildCheck`

**Archivos afectados:**

| Archivo | Cambio |
|---------|--------|
| `js/core/estadisticosConfig.js` | +4 líneas `paramConfig` en F0 (delta_t, z, T_ref con defaults, min, step) |
| `js/core/StateManager.js` | +Nuevo estado `paramConfig`, +métodos set/get/clear, +undo/redo, +serialización save/load |
| `js/core/utils.js` | +2 líneas `PARAM_CONFIG_SET = new Set(['Factor de Letalidad (F0)'])` |
| `js/core/indexx-analysis.js` | +Nueva función `_mostrarModalParamConfig()`, +check en `runSingleStat` y `runBatchAnalysis`, +check en sidebar clicks (`onSubitemClick`, `onChildCheck`) |
| `js/core/EstadisticaDescriptiva.js` | Case F0 ahora lee `hypothesisConfig[F0].columna` como columna seleccionable |

**Flujo usuario:**
1. Selecciona F0 → se abre modal con selector de columna temp + campos Δt, z, T_ref
2. Completa y da "Guardar y ejecutar"
3. Se ejecuta con los parámetros elegidos

**Verificación:** ✅ `node -c` en los 5 archivos JS modificados

---

### 2026-06-14: Fix F0 result structure — kpiCards no rendía por falta de key por columna

**Qué:** Al ejecutar "Factor de Letalidad (F0)" desde el sidebar, no se mostraba ningún resultado porque `kpiCards()` no encontraba la columna como key en el objeto de resultado.

**Problema:** El resultado del F0 se almacenaba como objeto plano `{ F0: 12.34, T_max: ..., columna: 'temp' }`. Pero `kpiCards()` itera sobre `cols` (columnas analizadas) y busca `data['temp']` → `undefined`. Todos los demás estadísticos (Media, Moda, IC, etc.) usan `resultados[stat][col] = valor`, con la columna como key.

**Solución:** Se reestructuró el caso F0 en `ejecutarAnalisis()` para usar `resultados['Factor de Letalidad (F0)'][numericCols[0]] = calcularFactorLetalidad(...)`, consistente con el resto de estadísticos.

**Archivos afectados:**
| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `js/core/EstadisticaDescriptiva.js` | 4230-4249 | Resultado F0 ahora envuelto en `{ [col]: { ... } }` en lugar de objeto plano |

**Verificación:** ✅ `node -c EstadisticaDescriptiva.js`

---

### 2026-06-08: Error isolation — global handlers, loadPage try/catch, ML timeout

**Qué:** Se implementó un sistema de aislamiento de errores en 6 medidas para garantizar que un error en cualquier página o fetch no rompa toda la aplicación.

**Medidas implementadas:**

| # | Medida | Archivo | Cambio |
|---|--------|---------|--------|
| 1 | `window.onerror` + `unhandledrejection` | `indexx.html` | Global handler que captura errores no atrapados, muestra barra de error dismissible al pie, previene que el error detenga otros scripts |
| 2 | try/catch en `loadPage()` | `indexx-ui.js` | Cada panel render y cada init diferido (analisis, datos, trabajo, ML, etc.) envuelto en su propio try/catch con fallback inline |
| 3 | Fix fetches silenciados | `auth.js` | `_fetchMlApiKey` y `/api/me` ahora loguean warnings en vez de tragar errores |
| 4 | Error boundary ML | `ml.js` | `_renderModelView` envuelto en try/catch con mensaje de error y botón "Reintentar" |
| 5 | Timeout 30s en ML fetch | `ml.js` | `_fetch()` usa AbortController con timeout; AbortError muestra mensaje claro al usuario |
| 6 | Timeout Auth retry | `indexx-analysis.js` | `_initIndexxApp` tiene límite de 300 reintentos (~15s) en vez de bucle infinito |

**Verificación:** ✅ `node -c` en los 5 archivos JS modificados

---### 2026-06-08: Backend + Frontend — Confusion Matrix, ROC Curve, Feature Importance

**Qué:** Se agregó soporte completo para matriz de confusión, curva ROC (SVG) e importancia de features. Backend retorna estos datos desde el entrenamiento y los persiste en el registro. Frontend los renderiza en los tabs de Rendimiento y Features.

**Backend — Python:**

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `Red_Neuronal/evaluator.py` | `_eval_binary()` ahora retorna `confusion_matrix` (list of lists) y `roc_data` (array de {fpr, tpr}) además de métricas escalares. `_eval_multiclass()` retorna `confusion_matrix`. |
| 2 | `Red_Neuronal/model_manager.py` | `_extract_metrics()` ahora guarda `confusion_matrix` y `roc_data` en el registro del modelo. Bugfix: `auc` → `auc_roc` (key correcta). |
| 3 | `ml_service/main.py` | `GET /api/ml/models` ahora incluye `best_params` de cada modelo. Endpoint `/api/ml/explain` reconstruido: extrae feature importance directamente del pipeline (tree: `feature_importances_`, linear: `coef_`) con nombres de features reales del preprocessor. |

**Frontend — JS:**

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `js/pages/ml.js:181-200` | `_mapModelViewData()` mapea `roc_data` y `feature_importance` desde los datos del modelo. |
| 2 | `js/pages/ml.js:335-405` | `_mvBuildViewHTML()` — **Rendimiento tab**: renderiza curva ROC SVG interactiva con grid, área sombreada, línea AUC y etiqueta. Se muestra lado a lado con matriz de confusión en layout g2. |
| 3 | `js/pages/ml.js:410-440` | `_mvBuildViewHTML()` — **Features tab**: renderiza barras horizontales de importancia con nombre de feature, barra proporcional y porcentaje. |
| 4 | `js/pages/ml.js:314-324` | Botones 🔮 Predecir y 🗑 Eliminar agregados al header del modelo. |

**Verificación:** ✅ `node -c ml.js` | ✅ `ast.parse` en los 3 Python files

---

### 2026-06-08: Features + Config tabs enriquecidos con datos reales

**Qué:** El tab Features ahora muestra SIEMPRE la lista de features (numéricas + categóricas) con valores de categorías, y carga asíncronamente la importancia desde un nuevo endpoint. El tab Config ahora muestra parámetros de entrenamiento, info del modelo, hiperparámetros y diagnóstico.

**Backend — Python:**

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `ml_service/main.py` | Nuevo endpoint `GET /api/ml/models/{id}/importance` — extrae `feature_importances_` o `coef_` del pipeline y retorna mapeado a nombres de features via `preprocessor.get_feature_names_out()` |
| 2 | `ml_service/main.py` | `GET /api/ml/models` ahora incluye `train_params` (test_size, cv_folds, search_type, etc.) y `file_size_mb` en cada modelo |
| 3 | `ml_service/main.py` | Response de `POST /api/ml/train` ahora incluye `train_params` y `file_size_mb` |
| 4 | `ml_service/main.py` | Para MLP (red neuronal), el endpoint retorna `feature_importance: {}` porque no tiene `feature_importances_` ni `coef_` |

**Frontend — JS:**

| # | Archivo | Líneas | Cambio |
|---|---------|--------|--------|
| 1 | `js/pages/ml.js` | `_mapModelViewData()` | Extrae `trainParams`, `fileSizeMb`, `numFeatures`, `catFeatures`, `catValues` del modelo |
| 2 | `js/pages/ml.js` | `_renderModelView()` + `_mvLoadFeatureImportance()` | Llama asíncronamente a `/api/ml/models/{id}/importance` después de renderizar la vista |
| 3 | `js/pages/ml.js` | `_mvBuildViewHTML()` Features tab | Muestra features numéricas y categóricas como tags con tooltips de valores. Muestra detalle de valores por categoría en card separada. Contenedor `#mlv-fi-container` para carga asíncrona de importancia. |
| 4 | `js/pages/ml.js` | `_mvBuildViewHTML()` Config tab | Sección "Parámetros de entrenamiento" (test_size, cv_folds, search_type, imbalance_strategy, ingeniería de features). Sección "Info del modelo" (algoritmo, tipo, model ID, tamaño archivo, dataset). Se mantienen Hiperparámetros y Diagnóstico. |
| 5 | `js/pages/ml.js` | CSS | Nuevos estilos: `.fi-type`, `.fi-tag-num`, `.fi-tag-cat`, `.fi-tag-val` |

**Verificación:** ✅ `node -c ml.js` | ✅ `ast.parse main.py`

---

---**Qué:** Se integró el template `ML.html` como la vista principal al seleccionar un modelo entrenado. Reemplaza la vista simple de tarjeta por una interfaz con 4 tabs (Resumen, Rendimiento, Features, Config) con métricas visuales, matriz de confusión, desglose de errores y diagnóstico automático.

**Cambios:**

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `js/pages/ml.js` | Nuevas funciones: `_injectModelViewCSS()`, `_mapModelViewData()`, `_mvMetricCard()`, `_mvBuildViewHTML()`, `_renderModelView()`. CSS inline scoped bajo `.mlv-wrap`. |
| 2 | `js/pages/ml.js:852` | `loadModelDetail()` reemplazado — ahora llama a `_renderModelView()` |
| 3 | `js/pages/ml.js:980` | `renderTrainingResult()` reemplazado — ahora llama a `_renderModelView()` |
| 4 | `ML.html` | **NUEVO** — Template standalone de referencia |

**Mapeo de datos API → vista:**
- `accuracy`, `f1_score`, `auc_roc`, `precision`, `recall`, `log_loss` → tarjetas con colores dinámicos
- `n_train`, `n_test`, `num_features`, `cat_features` → sección de entrenamiento
- `best_params` → hiperparámetros (desde training result)
- `confusion_matrix` → matriz + error breakdown
- `problem_type`, `model_key`, `dataset_name` → badges
- Diagnóstico automático generado desde métricas

**Verificación:** ✅ `node -c js/pages/ml.js`

---
### 2026-06-07: CFR 21 Part 11 — Cadena de hash blockchain en audit trail

**Qué:** Implementación de cadena SHA-256 en audit_log para integrity checking (21 CFR 11.10(e)).

**Cambios:**

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `backend/database.js` | Nuevas columnas `prev_hash`, `row_hash` en `audit_log`. `_computeRowHash()` calcula SHA256(prev_hash + username + action + success + ip + user_agent + module + details + duration_ms + timestamp). `logAccess()` y `logAuditEvent()` ahora encadenan hashes. `verifyAuditChain()` recorre toda la tabla verificando coherencia. `_migrateAuditHashes()` backfillea registros existentes. |
| 2 | `backend/server.js` | Nuevo endpoint `GET /api/audit/verify` (solo admin) que ejecuta `verifyAuditChain()`. |
| 3 | `js/managers/AuditoriaManager.js` | Nuevo KPI "Integridad" que muestra estado de la cadena (✓ Íntegra / ✕ Rota). Botón "🔗 Verificar" en la barra de filtros. Auto-verificación al cargar la página. |

### 2026-06-07: CFR 21 Part 11 — Forzar cambio contraseña + UX reset

**Qué:** Al login con contraseña temporal, se fuerza al usuario a cambiarla antes de acceder. El reset admin muestra la contraseña en modal con copia fácil.

**Cambios:**

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `js/core/auth.js` | `_onLoginSuccess` detecta `mustChangePassword:true` e invoca `_showForceChangePasswordModal()` en lugar de cargar la app. `init()` hace lo mismo si la sesión persistida tiene el flag. Nueva función `_changePassword()` que llama a `PUT /api/users/password` sin contraseña actual (backed permite para temp). Validación cliente: 8+ chars, mayúscula, minúscula, dígito, especial. Modal no se puede cerrar hasta cambiar. |
| 2 | `js/managers/UsuariosManager.js` | Botón "Generar nueva contraseña segura" ya no usa `confirm()`. Muestra inline un campo readonly con la contraseña + botón 📋 que copia al portapapeles + botón "Enviar contraseña" que ejecuta el reset. |

### 2026-06-07: CFR 21 Part 11 — Críticos Fase 1

**Qué:** Correcciones críticas de seguridad para cumplimiento 21 CFR 11.300 (controles de códigos/passwords).

**Cambios:**

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `js/managers/UsuariosManager.js` | Reset password ya no usa "user0000" hardcodeado. Nueva función `_generateSecurePassword()` que genera contraseña aleatoria de 14 caracteres con mayúsculas, minúsculas, dígitos y especiales usando `crypto.getRandomValues()` |
| 2 | `backend/database.js` | Eliminado fallback `|| 'admin123'`. Ahora exige `ADMIN_PASSWORD` en env var, sale con error si no está definida |
| 3 | `backend/server.js` | Nueva función `validatePasswordStrength()` que valida: >=8 chars, max 128, al menos 1 mayúscula, 1 minúscula, 1 dígito, 1 especial. Aplicada en creación, cambio y reset de contraseña. Reset admin siempre marca como temporal |

### 2026-06-07: Anomalías contextuales y recomendaciones inteligentes

**Qué:** Las anomalías y recomendaciones ahora usan la dirección real de feature_contributions para determinar si un valor fuera de rango es realmente problemático o beneficioso.

**Problema:** El sistema marcaba como ⚠️ anomalía cualquier valor fuera del rango de entrenamiento, sin importar si era beneficioso (ej: monto_prestamo más bajo que el mínimo = menos deuda = mejor para aprobación). Las recomendaciones usaban sorted_c[0] (feature con mayor delta absoluto) sin considerar si era a favor o en contra.

**Arquitectura:**

| Capa | Archivo | Cambio |
|------|---------|--------|
| Python | Red_Neuronal/evaluator.py | Anomalías: construye dir_map desde contribuciones[pos]; solo marca anomalía si direction != a_favor. Valores favorables type: info, desfavorables type: risk. Recomendaciones: top_favor = favor[0] para Mantener, top_contra = contra[0] para Trabajar en... |
| Frontend | js/pages/ml.js | _predCard() y _renderDashboard(): separan anomalías por type; info se muestra en verde sin alerta roja; risk mantiene estilo rojo original |

**Lógica:**
- Si monto_prestamo=30000 está por debajo del mínimo de entrenamiento pero contribución dice a_favor (menos deuda = más probabilidad de aprobación) -> se muestra como informativo, no como alerta
- Si ratio_deuda_ingreso=0.8 está por encima del máximo y contribución dice en_contra -> se muestra como riesgo (correcto)
- Recomendación Mantener usa el top feature a_favor en lugar de sorted_c[0]
- Recomendación Trabajar en... usa el top feature en_contra en lugar de sorted_c[0]

### 2026-06-07: Phase 5 — SHAP toggle en entrenamiento

**Qué:** Checkbox "🔬 SHAP Attribution" en el sidebar de ML que, al activarse, usa SHAP values (Shapley) en vez del método de perturbación contra la mediana para calcular las contribuciones de cada feature ("a favor"/"en contra").

**Arquitectura:**

| Capa | Archivo | Cambio |
|------|---------|--------|
| **NUEVO** | `Red_Neuronal/shap_explainer.py` | Módulo con `compute_feature_contributions()`, `select_background()` (k-means), `_compute_tree_shap()` (TreeExplainer), `_compute_kernel_shap()` (KernelExplainer), mapeo de features preprocesadas a originales |
| Python | `ml_service/main.py` | +`compute_shap: bool` en TrainRequest; almacena `X_background` (50 muestras k-means) en payload para modelos no-tree; guarda `meta["shap_enabled"]` |
| Python | `Red_Neuronal/evaluator.py` | `predict()` acepta `X_background`; `_add_local_feature_reasoning()` usa SHAP si `shap_enabled` y hay background |
| Python | `ml_service/requirements.txt` | +`shap>=0.45.0` |
| Frontend | `js/pages/ml.js` | +checkbox `ml-shap-toggle` en sidebar (~línea 138); envía `compute_shap` en train() y trainAll() |

**Cómo funciona por modelo:**

| Modelo | Explainer | Background data |
|--------|-----------|----------------|
| Random Forest | `TreeExplainer` (rápido) | No necesita |
| XGBoost | `TreeExplainer` (rápido) | No necesita |
| MLP | `KernelExplainer` (lento) | 50 muestras k-means almacenadas en pickle |
| Logistic/Linear | `KernelExplainer` | 50 muestras k-means |

**Formato de salida:** idéntico al actual — `feature_contributions` con `{feature, actual, baseline, delta, direction, abs_delta}`. Las barras verdes/rojas no requieren cambios.

**Fallback:** Si SHAP no está instalado o falla, se usa silenciosamente el método de perturbación.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `Red_Neuronal/shap_explainer.py` | **NUEVO** — 198 líneas |
| `ml_service/main.py` | +10 líneas (TrainRequest, training logic, predict) |
| `Red_Neuronal/evaluator.py` | +40 líneas (predict arg, _add_local_feature_reasoning shap branch, _compute_shap_effects) |
| `ml_service/requirements.txt` | +1 línea (`shap>=0.45.0`) |
| `js/pages/ml.js` | +3 líneas (checkbox sidebar, extraParams, trainAll body) |

**Verificación:** ✅ 107/107 tests | ✅ `node -c ml.js` | ✅ Python syntax all files | ✅ SHAP import OK

### 2026-06-06: Phase 4a — Fix CI fail + error msg engañoso + deploy condicional

**Qué:** Correcciones post-deploy: CI fallaba por falta de `FLY_API_TOKEN`, mensaje "puerto 8000" confundía al usuario, deploy se ejecutaba sin token.

**Fixes:**
- **`js/pages/ml.js:61`** — Error message ya no hardcodea "puerto 8000"; extrae el puerto real de `apiUrl` dinámicamente (443/80/localhost:8000 según corresponda)
- **`.github/workflows/deploy.yml`** — Ambos jobs ahora tienen `if: ${{ secrets.FLY_API_TOKEN != '' }}` para evitar fallos si el secret no está configurado
- **Verificado CORS:** Preflight 200 ✅, headers correctos (`access-control-allow-origin: https://fernandonina241018.github.io`), ML Service responde OK desde curl

**Nota para el usuario:** Si sigues viendo el error en el navegador, haz **Ctrl+F5** (caché del Service Worker). El CORS ya funciona correctamente.

### 2026-06-06: Phase 4 — CI/CD pipelines + npm audit fixes

**Qué:** Automatización de tests y deploys + parches de seguridad en dependencias.

**CI/CD:**
- `ci.yml`: Ejecuta `npm test` (107 tests) en cada push/PR a `main`
- `deploy.yml`: Auto-deploy del backend y ML Service a Fly.io al hacer push a `main`
  - Requiere `FLY_API_TOKEN` en GitHub Secrets
  - Backend: `flyctl deploy --strategy immediate`
  - ML Service: `flyctl deploy --config ml_service/fly.toml --strategy rolling`

**Seguridad:**
- `npm audit fix` en backend: 5 vulnerabilidades moderate corregidas
  - `ip-address` XSS via `express-rate-limit`
  - `qs` DoS via `body-parser` / `express`
- Total: 0 vulnerabilidades

**Cómo activar CD:**
1. Ir a GitHub → Settings → Secrets → Actions
2. Agregar `FLY_API_TOKEN` (generar con `flyctl tokens create deploy`)
3. Los deploys automáticos empezarán en el próximo push a `main`

### 2026-06-06: Phase 3 Deploy — Backend + ML Service desplegados con auth

**Qué:** Deploy de todos los cambios de seguridad a producción + health checks.

**Deploys realizados:**
| Servicio | URL | Cambios |
|----------|-----|---------|
| Backend | `https://sigmaproxvl-backend.fly.dev` | Rate limiting, body limit, input validation, SSL config (`DB_SSL_INSECURE=1`), `/api/ml-api-key` endpoint, health check cada 15s |
| ML Service | `https://sigmapro-ml.fly.dev` | API key auth (opt-in via `API_KEY` env var), checksum SHA-256 en modelos, health check cada 15s |

**API Key ML Service desplegada:**
- `API_KEY=f61fdf70...cd7dd1` (64 chars hex) en ambos servicios
- Sin key → `401 Unauthorized`
- Con key → `200 OK`
- Health check exento (`/api/ml/health`)

**Verificaciones:**
- Backend health: `{"database":"connected"}`
- ML Service: 2 modelos cargados correctamente
- Frontend: `HTTP 200` en GitHub Pages
- Tests: 107/107 pasan

**Pendiente (manual):** Rotar credenciales expuestas en historial git (Supabase, Fly.io, Groq, admin).

### 2026-06-06: Phase 2 Cleanup — Junk removal, DEMO purge, code quality

**Qué:** Limpieza profunda del codebase: archivos basura, scripts demo/test, y mejoras de calidad de código.

**Archivos eliminados (11 vía git rm --cached, 14 vía rm del disco):**

| Tipo | Archivos | Tamaño |
|------|----------|--------|
| DEMO Python | `DEMO_anomaly_detector.py`, `DEMO_AUTO_CSV_LOADER.py`, `DEMO_interpretability.py`, `DEMOSTRACION_MEJORAS.py` | ~37 KB |
| Diagnóstico | `DIAGNOSTICO_VALUEERROR_COLUMNS.py`, `DIAGNOSTICO_CREDITOS.md` | ~23 KB |
| Resúmenes TXT | `RESUMEN_IMPLEMENTACION.py`, `RESUMEN_COMPLETO_SESION.txt`, `RESUMEN_MEJORAS.txt`, `RESUMEN_SESION_18_ABRIL.txt` | ~58 KB |
| Test/Inicio | `INICIO_RAPIDO.py`, `TEST_MODULOS.py`, `test_model_persistence.py` | ~20 KB |
| Orphan | `analisis_creditos.py` | ~19 KB |
| TS sources | `StateManager.ts`, `StatsUtils.ts`, `Logger.ts`, `types.d.ts`, `tsconfig.json` | ~43 KB |
| Backup | `js/core/indexx.js.bak` | 262 KB |
| Varios | `supabase.png`, `fly.txt`, `link.txt`, `datos_prueba_duplicados.csv`, `prompt_optimizado.md`, `.prompt-optimized.md` | ~63 KB |

**Code quality:**
- `ml.js`: removed unused `probPct` y `metricKeys` variables
- `ml.js`: added `_filterMetricsKeys()` helper → eliminó 5 duplicaciones del patrón `y_pred`/`y_proba`
- `ReporteManager.js`: removed unused `refs` variable
- `.gitignore`: añadidos patrones para `DEMO_*`, `DIAGNOSTICO_*`, `RESUMEN_*`, `INICIO_RAPIDO*`, `TEST_MODULOS*`, `test_*`, `analisis_creditos.py`

### 2026-06-06: Phase 1 Seguridad — ML Service Auth, Pickle RCE, Input Validation

**Qué:** Implementación completa de seguridad en ML Service y backend.

**Items completados:**

| # | Item | Archivos | Detalle |
|---|------|----------|---------|
| 1 | Password en localStorage | `auth.js` | XOR-obfuscado con username como key |
| 2 | Body size limit | `server.js` | `express.json({ limit: '100kb' })` |
| 3 | Rate limit /verify-signature | `server.js` | 10 req / 15 min |
| 4 | Proxy ML con auth | `server.js` | `requireAuth` en `/api/ml/*` |
| 5 | SSL rejectUnauthorized | `database.js` | `true` por defecto (override `DB_SSL_INSECURE=1`) |
| 6 | Input validation | `server.js` | Longitud + email regex en create user y profile |
| 7 | ML Service API key | `main.py`, `server.js`, `auth.js`, `ml.js` | Middleware opcional (env `API_KEY`), backend sirve key a sesiones autenticadas, frontend la pasa en todas las requests |
| 8 | Pickle RCE mitigation | `main.py`, `model_manager.py` | Checksum SHA-256 al guardar, verificación antes de cada `joblib.load()`. Path traversal ya prevenido con `_safe_resolve()`. |

**Riesgo de rotura:** BAJO.
- API key en ML Service es opt-in (no rompe si no se configura)
- Checksum es backwards compatible (modelos sin checksum se cargan igual)
- Frontend añade header solo si la key existe (no rompe si no hay key)

### 2026-06-06: Plugin Consolidation — Single Source of Truth (Global Only)

**Qué:** Se eliminaron todos los plugins duplicados de `.opencode/plugins/` del proyecto. Ahora toda la lógica `auto-prompt`, `Brain2`, `Agent Brain` vive exclusivamente en `~/.config/opencode/plugins/` (global).

**Motivación:**
- Los plugins globales aplican a TODOS los proyectos de OpenCode automáticamente
- Elimina el riesgo de versiones divergentes (proyecto vs global)
- Elimina la necesidad de sincronizar archivos manualmente
- Las rutas absolutas (`~/proyecto_sigmaProXVL/Brain/Brain2/`) funcionan igual desde global

**Archivos eliminados del proyecto:**
- `.opencode/plugins/auto-prompt.ts`
- `.opencode/plugins/brain2-types.ts`
- `.opencode/plugins/gap-detector.ts`
- `.opencode/plugins/brain2-generator.ts`
- `.opencode/plugins/evolution-tracker.ts`
- `.opencode/plugins/brain2-initializer.ts`
- `.opencode/plugins/DIAGRAMA.md` (archivo no-plugin innecesario)

**Ubicación única ahora:**
- `~/.config/opencode/plugins/*.ts` — **Único origen de verdad**
- El directorio `.opencode/plugins/` del proyecto queda **vacío** (opencode usa global automáticamente)

**Verificación:**
- ✅ Todos los plugins existen en `~/.config/opencode/plugins/`
- ✅ `node -c *.ts` en global — sintaxis correcta
- ✅ Archivos del proyecto eliminados
- ✅ OpenCode carga plugins globales automáticamente

---

### 2026-06-06: Agent Brain v2.0 — Sistema Auto-Evolucionable de Conocimiento

**Qué:** Se creó un sistema completo de "cerebro" para el agente IA que integra los 12 archivos Brain2 con capacidades de auto-detección de lagunas, generación automática de nuevos archivos de conocimiento, versionado y seguimiento de evolución.

**Arquitectura del Sistema:**

```
Agent Brain v2.0
├── auto-prompt.ts → Orquestador principal (template + learning + skills + Brain2)
├── gap-detector.ts → Detecta lagunas de conocimiento en tiempo real
├── brain2-generator.ts → Crea nuevos archivos .md automáticamente
├── evolution-tracker.ts → Versiona y rastrea cada cambio
└── brain2-initializer.ts → Inicializa el sistema al cargar
```

**Nuevos Componentes:**

| Componente | Archivo | Función |
|------------|---------|---------|
| Gap Detector | `gap-detector.ts` | Analiza cada prompt del usuario y detecta qué información le falta al agente (9 patrones: bugs, seguridad, performance, etc.) |
| Auto-Generator | `brain2-generator.ts` | Crea nuevos archivos Brain2 (.md) cuando detecta lagunas críticas, con 8 templates (Implementation, Bug, Security, etc.) |
| Evolution Tracker | `evolution-tracker.ts` | Mantiene versionado de cada archivo, historial de cambios, checksums SHA-256, y métricas de crecimiento |
| Manifest | `brain2-manifest.json` | Índice centralizado con 12 archivos core, keywords, categorías, módulos y relaciones semánticas |
| Growth Log | `agent-brain-growth.md` | Bitácora de evolución del sistema (nuevos archivos, actualizaciones, métricas) |

**Capacidades del Sistema:**

1. **Detección Inteligente de Lagunas**
   - 9 patrones de detección (bugs, seguridad, integraciones, etc.)
   - Análisis por categorías (UI, datos, estadísticas, visualización, ML)
   - Scorer de severidad (high/medium/low)
   - Detección de frecuencia de gaps

2. **Auto-Generación de Conocimiento**
   - 8 templates de archivos (Implementation, Bug, Integration, Performance, Security, Process, Stats, Architecture)
   - Control de límite diario (3 por día máximo)
   - TTL de caché para no regenerar archivos duplicados
   - Metadata completa para cada archivo generado

3. **Versionado y Evolución**
   - Cada archivo tiene historial de versiones
   - Checksums SHA-256 para detectar cambios
   - Registro de autor (system/agent/user)
   - Métricas de crecimiento (success rate, average iterations, etc.)

4. **Crecimiento Constante**
   - `agent-brain-growth.md` registra cada evolución
   - Métricas de mejora continua
   - Patrones de aprendizaje descubiertos
   - Sistema se perfecciona con cada interacción

**Flujo completo de un prompt ahora:**

```
Usuario envía mensaje
  ↓
1. Template /prompt (mejores prácticas Anthropic)
2. Learning context (105 interacciones, 10 lecciones)
3. Skills context (top 3 skills, 3 lecciones cada uno)
4. Brain2 context (top 4 archivos detectados semánticamente)
  ↓
5. GAP DETECTION (Background - no bloquea):
   ├─ Analiza intent del usuario
   ├─ Detecta lagunas de conocimiento
   ├─ Si gaps críticos Y frecuentes → generar nuevo Brain2 file
   ├─ Actualizar manifest + evolution log + growth log
   └─ Sistema más inteligente para próxima vez
  ↓
Respuesta al usuario
```

**Ejemplo de Auto-Evolución:**

```
Usuario: "necesito integrar el ML Service con la API de predicción"
  ↓
Gap Detector detecta:
  - Categoría: Integration (medium severity)
  - Categoría: ML Integration (high severity)
  - Frecuencia: 3ra vez que se menciona
  ↓
Auto-Generator crea:
  → 13_ML_SERVICE_INTEGRATION.md
  ↓
Evolution Tracker:
  - Crea versión 1.0.0
  - Actualiza manifest con metadata
  - Agrega entrada en agent-brain-growth.md
  ↓
Próximo prompt similar:
  → Contexto Brain2 incluye #13 automáticamente
```

**Archivos creados/modificados:**

| Archivo | Cambio | Líneas |
|---------|--------|--------|
| `.opencode/plugins/brain2-types.ts` | **NUEVO** — 200 líneas de tipos | +200 |
| `.opencode/plugins/gap-detector.ts` | **NUEVO** — Detector de lagunas con 9 patrones | +250 |
| `.opencode/plugins/brain2-generator.ts` | **NUEVO** — 8 templates de archivos | +350 |
| `.opencode/plugins/evolution-tracker.ts` | **NUEVO** — Versionado, manifest, growth log | +300 |
| `.opencode/plugins/brain2-initializer.ts` | **NUEVO** — Inicialización del sistema | +200 |
| `.opencode/plugins/auto-prompt.ts` | **MODIFICADO** — +70 líneas (gap detection + generación) | +70 |
| `~/.config/opencode/plugins/*.ts` | **SINCRONIZADOS** — todos los plugins | - |
| `Brain/Brain2/agent-brain-growth.md` | **NUEVO** — Bitácora de evolución | +80 |
| `~/.config/opencode/brain2-manifest.json` | **NUEVO** — Índice centralizado | +150 |
| `~/.config/opencode/brain2-evolution.json` | **NUEVO** — Historial de versiones | +2 |
| `~/.config/opencode/brain2-growth-metrics.json` | **NUEVO** — Métricas de crecimiento | +1 |

**Estructura de archivos del sistema:**

```
.opencode/plugins/
├── auto-prompt.ts           ← Orquestador (template + learning + skills + Brain2 + gaps)
├── brain2-types.ts          ← Tipos centralizados (NEW)
├── gap-detector.ts          ← Detector de lagunas (NEW)
├── brain2-generator.ts      ← Generador de archivos (NEW)
├── evolution-tracker.ts     ← Versionado y tracking (NEW)
└── brain2-initializer.ts    ← Inicialización (NEW)

~/.config/opencode/
├── brain2-manifest.json     ← Índice semántico (NEW)
├── brain2-evolution.json    ← Historial de versiones (NEW)
└── brain2-growth-metrics.json  ← Métricas (NEW)

Brain/Brain2/
├── 01-12_*.md               ← 12 archivos core
└── agent-brain-growth.md    ← Bitácora de evolución (NEW)
```

**Verificación:**

✅ `node -c *.ts` — Sintaxis correcta en todos los archivos  
✅ Todos los plugins sincronizados proyecto/global  
✅ Manifest inicial creado con 12 archivos core  
✅ agent-brain-growth.md inicializado  
✅ Sistema self-contained (no depende de servicios externos)  

**Próximos pasos evolutivos:**
- [ ] Revisar y perfeccionar templates de auto-generación
- [ ] Agregar más patrones de detección de gaps
- [ ] Integrar con feedback loop del usuario
- [ ] Mejorar scoring de relevancia semántica

---

### 2026-06-06: Brain2 Integration — 12 Project Guidelines Integrated into Auto-Prompt

**Qué:** Se integró la base de conocimiento Brain2 (12 directrices del proyecto) directamente en el plugin auto-prompt, eliminando la necesidad de un plugin separado. Brain2 ahora enriquece automáticamente cada prompt con contexto relevante del proyecto.

**Cómo funciona:**

1. **Carga inteligente de Brain2**: Se carga al iniciar el primer mensaje; la caché TTL es de 1 hora
2. **Detección de contexto**: Analiza el prompt del usuario y detecta qué archivos Brain2 son relevantes (máx. 4)
3. **Inyección automática**: Agrega el contexto relevante entre learning context y user input

**Archivos Brain2 (12 directrices):**

| # | Archivo | Tema | Descripción |
|---|---------|------|-------------|
| 1 | 01_PROJECT.md | Proyecto | Identidad, stack, estructura general |
| 2 | 02_ESTADISTICOS.md | Estadísticos | Config y guía de estadísticos |
| 3 | 03_WORKFLOW.md | Workflow | Protocolo de 4 pasos con agente |
| 4 | 04_CODE_GUIDELINES.md | Código | Estándares ES6+, vanilla JS |
| 5 | 05_BUGS_AND_DECISIONS.md | Decisiones | Registro de bugs y decisiones |
| 6 | 06_POLICIES.md | Políticas | Bloqueantes de seguridad |
| 7 | 07_CONTEXTO_BASE.md | Contexto | Información general del proyecto |
| 8 | 08_GUIA_ESTADISTICO.md | Guía | Checklist para nuevo estadístico |
| 9 | 09_PLAN_SEGURIDAD.md | Seguridad | Plan de remediación (24 hallazgos) |
| 10 | 10_PROTOCOLO_SEGURIDAD.md | Protocolo | Evitar regresiones en cambios |
| 11 | 11_ADVANCE_AGENT.md | Agente AI | Constitución del agente autoevolutivo |
| 12 | 12_TECNICA_ADVANCE.md | Técnica | Prompt de comportamiento avanzado |

**Nuevas funciones en auto-prompt.ts:**

1. **`loadBrain2Entry()` y `loadAllBrain2Entries()`** (línea ~220-252)
   - Carga los 12 archivos Brain2 desde disco (`~/proyecto_sigmaProXVL/Brain/Brain2/`)
   - Implementa caché con TTL (1 hora)
   - Fallback graceful si archivos no existen

2. **`detectRelevantBrain2Entries(text, entries)`** (línea ~281-310)
   - Analiza el prompt del usuario y detecta keywords relevantes
   - Incluye máx. 4 archivos Brain2 más relevantes
   - Default (1, 4, 6, 11, 12) si no hay coincidencias específicas

3. **`buildBrain2Context(entries)`** (línea ~312-339)
   - Genera XML con los archivos Brain2 relevantes
   - Incluye título, descripción y snippet de contenido (primeras 200 chars)
   - Estructura clara para el LLM

**Cambios en Plugin Entry Point (línea ~690):**

```typescript
// ANTES:
const learningContext = buildLearningContext(mem)
const skillsContext = buildSkillsContext(mem)
output.parts = [{ type: "text", text: buildPromptWithFullContext(template, text, learningContext, skillsContext) }]

// DESPUÉS:
const learningContext = buildLearningContext(mem)
const skillsContext = buildSkillsContext(mem)

// Initialize Brain2 loading (fire-and-forget)
if (!brain2LoadPromise) {
  brain2LoadPromise = loadAllBrain2Entries(ctx.logger).catch(err => {
    ctx.logger?.error("AutoPrompt: Brain2 initialization failed:", err)
    return []
  })
}

const brain2Entries = await brain2LoadPromise
const relevantEntries = detectRelevantBrain2Entries(text, brain2Entries)
const brain2Context = buildBrain2Context(relevantEntries)

output.parts = [{ type: "text", text: buildPromptWithFullContext(template, text, learningContext, skillsContext, brain2Context) }]
```

**Archivos afectados:**

| Archivo | Cambio | Líneas |
|---------|--------|--------|
| `.opencode/plugins/auto-prompt.ts` | +Tipos + constantes + 6 funciones Brain2 + integración en chat.message hook | +130 |
| `~/.config/opencode/plugins/auto-prompt.ts` | **SINCRONIZADO** — mismos cambios | +130 |
| `/opencode.json` | Actualizado contexto "context" para documentar los 12 archivos Brain2 | contexto actualizado |
| `brain2-loader.ts` | ❌ **ELIMINADO** — funcionalidad integrada en auto-prompt | - |

**Ejemplo de flujo con Brain2:**

```
Usuario: "implementa un nuevo estadístico"
   ↓
1. Detecta keywords: "estadístico" → Brain2 #2, #8 relevantes
2. Incluye defaults: #1, #4, #6, #11, #12
3. Selecciona top 4: #1, #2, #4, #8
   ↓
4. Inyecta en prompt:
   - Template /prompt
   - Learning context (105 interacciones)
   - Skills context (top 3 skills)
   - ✨ Brain2 context: #1, #2, #4, #8
   - User input
   ↓
LLM recibe contexto completo → respuesta mucho más relevante
```

**Beneficios:**

✅ 12 directrices del proyecto siempre disponibles en prompts  
✅ Detección inteligente de contexto relevante (máx. 4 archivos)  
✅ Sin plugin extra; integrado en auto-prompt existente  
✅ Caché eficiente (TTL 1 hora)  
✅ Fire-and-forget loading (no bloquea primer mensaje)  
✅ Backward compatible con setup actual  

**Verificación:**

✅ `node -c auto-prompt.ts` — Sintaxis correcta  
✅ Ambos ficheros sincronizados (proyecto + global)  
✅ opencode.json actualizado con documentación Brain2

---

### 2026-06-06: Enhanced Auto-Prompt Plugin — Full /prompt Integration + Skills Context

**Qué:** Se mejoró el plugin `auto-prompt` para invocar automáticamente el comando `/prompt` con contexto completo en cada interacción. Ahora cada mensaje del usuario obtiene:
1. Template del `/prompt` (mejores prácticas de Anthropic)
2. Contexto de aprendizaje continuo (105 interacciones, 10 lecciones profesionales)
3. Contexto de skills (15 skills descargados con lecciones especializadas)
4. Entrada del usuario

**Mejoras principales:**

| Aspecto | Antes | Después |
|--------|-------|---------|
| **Context injection** | Solo 3 fases + learning | Template /prompt + learning + skills + usuario |
| **Skills disponibles** | Cargados pero no inyectados | Automáticamente incluidos en cada prompt |
| **Memory** | 105 interacciones, 10 lecciones | Mantenidas; ahora contextualizadas mejor |
| **Scope** | Proyecto solamente | **Proyecto + Global sincronizados** |

**Nuevas funciones:**

1. **`buildSkillsContext(mem: LearningMemory): string`** (línea ~234)
   - Extrae los 3 skills más relevantes (máx. 3 lecciones c/u)
   - Retorna XML con etiqueta `<available_skills>` que documenta cada skill disponible
   - Retorna string vacío si no hay skills (fallback graceful)

2. **`buildPromptWithFullContext()`** (línea ~250)
   - Combina: template /prompt + learning context + skills context + user input
   - Estructura XML clara con comentarios de secciones
   - Mantiene backward compatibility (buildAutoPrompt sigue existiendo pero no se usa)

**Cambios en Plugin Entry Point (línea ~545):**
```typescript
// ANTES:
const learningContext = buildLearningContext(mem)
output.parts = [{ type: "text", text: buildAutoPrompt(template, text, learningContext) }]

// DESPUÉS:
const learningContext = buildLearningContext(mem)
const skillsContext = buildSkillsContext(mem)
output.parts = [{ type: "text", text: buildPromptWithFullContext(template, text, learningContext, skillsContext) }]
```

**Archivos afectados:**

| Archivo | Cambio |
|---------|--------|
| `.opencode/plugins/auto-prompt.ts` | +45 líneas (buildSkillsContext + buildPromptWithFullContext) |
| `~/.config/opencode/plugins/auto-prompt.ts` | **SINCRONIZADO** — mismos cambios |

**Estructura de prompt mejorada:**

```
Template /prompt
│
├── CONTINUOUS LEARNING & SKILLS CONTEXT (Auto-Injected)
│   ├── Interaction count: 105
│   ├── Professional level: Expert
│   ├── Professional standards: 10 lecciones desbloqueadas
│   ├── User patterns: Code + Explanations
│   └── Available skills:
│       ├── architecture-patterns (3 lecciones)
│       ├── codebase-audit-pre-push (3 lecciones)
│       └── api-security-best-practices (3 lecciones)
│
└── USER INPUT

```

**Beneficios:**

✅ Cada prompt obtiene máximo contexto automáticamente  
✅ 15 skills descargados ahora se aprovechan en cada respuesta  
✅ Memory de 105 interacciones enriquece el análisis  
✅ Compatible con configuración existente de `/prompt`  
✅ Mejora progresiva: más interacciones = mejor contexto  
✅ **Sincronizado en ambos ficheros** (proyecto + global)

**Verificación:** ✅ `node -c auto-prompt.ts` (proyecto y global) | ✅ Sintaxis TypeScript válida | ✅ Sin cambios en comportamiento de exclusión (`/` y `__AUTO_PROMPT__`)

### 2026-06-04: Fix result dashboard light mode — hardcoded dark CSS variables in ml-predict.css

**Qué:** El dashboard de resultados de predicción no se adaptaba al modo claro porque `css/pages/ml-predict.css` definía variables CSS con colores oscuros hardcodeados (`--bg-panel: #0d1117`, `--border: #1e2d3d`, etc.) dentro de `.ml-predict-dashboard`, que sobrescribían las variables del tema incluso con `data-theme="light"`.

**Causa raíz:** `.ml-predict-dashboard` redefinía `--bg-panel`, `--border`, `--text-primary` y `--font-mono` con valores oscuros, shadoweando las definiciones de `:root` / `[data-theme="light"]`. Todos los paneles internos (dp-panel, dp-verdict, dp-bar-row, dp-stat, etc.) heredaban estos valores oscuros sin importar el tema activo.

**Solución:**
1. Se eliminaron de `.ml-predict-dashboard` las variables que ya existen en el tema global (`--bg-panel`, `--border`, `--text-primary`, `--font-mono`, `--font-sans`) para que hereden correctamente
2. Se agregó bloque `[data-theme="light"] .ml-predict-dashboard { ... }` con valores claros para las variables personalizadas del dashboard:
   - `--accent-green`: `#00e5a0` → `#10b981`
   - `--accent-cyan`: `#00c8e0` → `#06b6d4`
   - `--accent-red`: `#ff4757` → `#ef4444`
   - `--accent-amber`: `#ffa502` → `#f59e0b`
   - `--text-sec`: `#7a9ab5` → `#64748b`
   - `--text-dim`: `#3d5a73` → `#94a3b8`
   - `--bg-base`, `--bg-card`, `--bg-card2` → tonos claros
   - `--green-glow`, `--card-shadow` → adaptados a luz

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `css/pages/ml-predict.css:2-34` | Eliminadas vars que shadowean tema; agregado `[data-theme="light"]` override |

**Verificación:** ✅ Dashboard se adapta completamente a ambos temas (oscuro y claro)

### 2026-06-04: Fix — "Nueva predicción" now keeps prediction modal open

**Qué:** Al hacer clic en "Nueva predicción" después de un resultado, el modal de predicción se cerraba junto con el overlay de resultados. Ahora el modal de predicción permanece abierto para permitir modificar parámetros y predecir nuevamente.

**Causa raíz:** Tras una predicción exitosa, `overlay.remove()` destruía el modal de predicción completo (`.pd-root`). Cuando el usuario presionaba "Nueva predicción", solo se cerraba el overlay de resultados, pero el modal de predicción ya no existía.

**Solución:** Eliminar `overlay.remove()` después de renderizar el resultado. El modal de predicción permanece debajo del overlay de resultados y se revela al cerrar el overlay.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:1609` | Eliminada línea `overlay.remove()` |

**Verificación:** ✅ `node -c ml.js` | ✅ Modal de predicción permanece tras cerrar resultado

### 2026-06-04: Add "Recordarme" checkbox to login (persist credentials in localStorage)

**Qué:** Nuevo checkbox "Recordarme" en el formulario de login que guarda usuario y contraseña en localStorage. Al volver a la página de login, los campos se rellenan automáticamente.

**Cambios:**
- `auth.js:148-152` — Nuevo checkbox "Recordarme" en el modal de login
- `auth.js:172-178` — Al renderizar modal, carga credenciales guardadas de `localStorage.__auth_remembered`
- `auth.js:549-554` — Al iniciar sesión exitosamente, guarda o limpia según estado del checkbox

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/auth.js:148-152,172-178,549-554` | +checkbox, +pre-fill, +save/clear logic |

**Verificación:** ✅ `node -c auth.js`

### 2026-06-04: Switched to multi-provider AI config (Groq + DeepInfra + Ollama)

**Qué:** Se reemplazó Ollama local por Groq cloud (API gratuita) como provider principal, con DeepInfra como secundario y Ollama como fallback. Config detallada abajo en "Switched to Groq cloud — file-based API keys, multiple providers".

---

### 2026-06-04: Switched to Ollama qwen2.5-coder:0.5b (CPU-friendly)

**Qué:** Se reemplazó el modelo local de qwen2.5-coder:1.5b por qwen2.5-coder:0.5b porque el modelo 1.5B era demasiado lento en CPU (~7 tok/s, ~22s por prompt) y causaba timeouts en opencode.

**Cambio:**
| Archivo | Cambio |
|---------|--------|
| `opencode.json` | `model` y `small_model` cambiaron de `ollama/qwen2.5-coder:1.5b-fast` a `ollama/qwen2.5-coder:0.5b` |

**Rendimiento:** ~1.8s para respuestas simples (vs ~22s del 1.5B). Se eliminó el alias `-fast` porque 0.5B corre bien con configuración por defecto.

**Verificación:** ✅ curl a Ollama API responde en ~1.8s

---

### 2026-06-04: Acciones dinámicas + NLP Calibrator

**Qué:** Dos cambios profundos: (1) Las acciones sugeridas ya no son texto hardcodeado, sino dinámicas generadas desde las contribuciones reales de cada feature. (2) Nuevo NLP Calibrator: modelo LogisticRegression entrenado sobre [prob_base + embedding_384d] que ajusta la probabilidad base según el texto del usuario.

**Acciones dinámicas:**
- `_get_acciones_by_target` reemplazada por `_build_personalized_actions` que genera 3 acciones basadas en feature_contributions reales
- Cada acción menciona el feature específico, valor actual y delta vs baseline (ej: "ingresos_mensuales=5000 está más de 67% por encima del promedio (2995), favoreciendo la aprobación")
- Fallback a acciones estáticas si no hay feature_contributions
- Nuevo helper `_format_delta`, `_detect_domain`, `_get_static_actions`

**NLP Calibrator (nuevo módulo `Red_Neuronal/nlp_calibrator.py`):**
- `train_calibrator()`: Genera descripciones textuales de cada muestra de entrenamiento → fastembed → PCA a 8 dims → LogisticRegression sobre [prob_base, 8_pca_dims] → target
- `adjust_prediction()`: Aplica el calibrador durante predicción, retorna probabilidad ajustada + delta
- `generate_text_from_features()`: Convierte filas de features en texto plano para embedding
- Se guarda como `{modelo}_calibrator.pkl` al lado del modelo

**Integración NLP en training:**
- `trainer.py` ahora acepta `calibrate_nlp: bool`, entrena calibrador post-entrenamiento
- `main.py` PredictRequest acepta `texts: Optional[list[str]]`, carga calibrador si existe
- Si no hay texto, genera descripción desde features para el embedding
- Frontend: nuevo toggle "🧠 NLP Calibrator" en sidebar de entrenamiento

**Frontend:**
- Dashboard muestra ajuste NLP en el confidence card: "🤖 ajustado por NLP +2.3 pts"
- Predicciones multi-fila también envían texts array
- 107/107 tests pasando

**Archivos afectados:**
- `Red_Neuronal/evaluator.py`: +_apply_nlp_calibration, _build_personalized_actions, _format_delta, _parse_num, _detect_domain, _get_static_actions; predict() acepta texts+cal_payload
- `Red_Neuronal/nlp_calibrator.py`: **NUEVO** — train_calibrator, adjust_prediction, generate_text_from_features
- `Red_Neuronal/trainer.py`: train() acepta calibrate_nlp, entrena calibrador post-entreno
- `ml_service/main.py`: PredictRequest.texts, predict carga calibrador, train pasa calibrate_nlp
- `js/pages/ml.js`: nlp-toggle en sidebar, texts en predict request, NLP badge en dashboard

---

### 2026-06-04: Integración NLP en predicciones (análisis semántico en dashboard)

**Qué:** Se integró el análisis de texto NLP en el flujo de predicción. El usuario puede agregar un motivo/comentario opcional en el modal de predicción, y el dashboard muestra análisis semántico con riesgo detectado, sentimiento y palabras clave.

**Nuevo endpoint backend:**
| Endpoint | Descripción |
|----------|-------------|
| `POST /api/ml/analyze-text` | Analiza texto: embedding, keywords, nivel de riesgo, sentimiento |

**Frontend:**
- Textarea "🧠 Análisis semántico (opcional)" en el modal de predicción
- Antes de predecir, si hay texto, se llama a `/api/ml/analyze-text`
- Dashboard nuevo panel "🧠 Análisis semántico" con:
  - Nivel de riesgo (🟢 Bajo / 🟡 Moderado / 🔴 Alto) con porcentaje
  - Sentimiento (✅ Positivo / ❌ Negativo / ➖ Neutral)
  - Palabras clave extraídas como pills
- NLP analysis es **no-fatal**: si falla o no hay texto, la predicción funciona igual

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `ml_service/main.py` | +`TextAnalysisRequest`, +endpoint analyze-text, +diccionarios riesgo/sentimiento |
| `js/pages/ml.js` | +textarea en modal, +llamada analyze-text pre-predicción, +panel NLP en dashboard |

**Verificación:** ✅ `node -c ml.js` | ✅ `ast.parse(main.py)` | ✅ 107/107 tests | ✅ Push a GitHub

### 2026-06-04: NLP embeddings con fastembed (all-MiniLM-L6-v2, ONNX Runtime)

**Qué:** Se integró un modelo de embeddings semánticos ultra-ligero (all-MiniLM-L6-v2) usando `fastembed` con ONNX Runtime — sin PyTorch, ~22MB de modelo, ~45MB RAM en inferencia.

**Nuevos endpoints:**
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/ml/embeddings` | POST | Genera embeddings normalizados (384-d) para uno o más textos |
| `/api/ml/similarity` | POST | Calcula similitud coseno entre dos textos |
| `/api/ml/nlp/status` | GET | Estado del modelo NLP (cargado/disponible) |

**Arquitectura:**
- `nlp_models.py`: Módulo separado con `EmbeddingModel` singleton lazy-loaded
- No se carga al startup — solo cuando se llama por primera vez a un endpoint NLP
- Modelo se cachea en `Red_Neuronal/modelos_guardados/nlp/` (volumen persistente)
- `HAS_NLP` flag con graceful fallback si faltan dependencias

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `ml_service/nlp_models.py` | Nuevo — clase EmbeddingModel con fastembed |
| `ml_service/main.py` | +3 endpoints, +2 Pydantic models, +HAS_NLP flag, health actualizado |
| `ml_service/requirements.txt` | +`fastembed>=0.5.0` |

**Verificación:** ✅ `python3 -c "from nlp_models import EmbeddingModel"` | ✅ `node -c ml.js` | ✅ 107/107 tests | ✅ Push a GitHub

### 2026-06-04: Limpieza modelos locales — solo Fly.io

**Qué:** Se eliminaron todos los archivos `.pkl` y `modelo_registro.json` del directorio local `Red_Neuronal/modelos_guardados/` para evitar confusión. Los modelos activos viven únicamente en el volumen persistente `ml_models` de Fly.io.

**Modelos removidos:** 9 entradas de registro, 4 archivos `.pkl` (modelo_001, 003, 008, 009). Los otros 5 no tenían archivo en disco.

**Modelos vigentes en Fly.io:**
| Modelo | Algoritmo | Dataset |
|--------|-----------|---------|
| modelo_002 | MLP | prestamos_crediticios |
| modelo_001 | XGBoost | entrenamiento_estres_ml |

**Verificación:** ✅ `rm -v *.pkl modelo_registro.json` | ✅ Directorio vacío | ✅ Push a GitHub

### 2026-06-04: Modal prediccion con 3 columnas + inputs flexibles

**Qué:** El formulario de predicción ahora muestra las features en 3 columnas en vez de 2, con inputs que se adaptan al ancho disponible. Esto evita que el botón "🔮 Predecir" quede fuera de vista cuando hay muchas columnas.

**Cambios:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:1418` | `1fr 1fr` → `1fr 1fr 1fr` |
| `js/pages/ml.js:1438,1456` | `width:160px/140px` → `flex:1;min-width:0` |
| `js/pages/ml.js:1424` | `min-width:140px;flex-shrink:0` → `flex:1;min-width:0` |
| `js/pages/ml.js:1465-1467` | Botón eliminar más compacto |

**Verificación:** ✅ `node -c ml.js` | ✅ 107/107 tests | ✅ Push a GitHub

### 2026-06-04: Fix color verdicto basado en etiqueta (si=verde, no=rojo)

**Qué:** El color del texto de clasificación en el dashboard ahora refleja correctamente si es aprobado (verde) o no (rojo), basado en la etiqueta de predicción y no en la probabilidad.

**Problema:** `verColor` se determinaba con `prob >= 0.5`. Una predicción "no" con 99% de confianza se mostraba en verde, contradiciendo el resultado real.

**Solución:** `verColor` ahora evalua `predDisplay` ("si"/"1"/"true" → verde, cualquier otro → rojo). También se actualizó el color del label en la barra de probabilidad para que herede el mismo color.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:1018` | `isPosHigh` → `isApproved` basado en `predDisplay` |
| `js/pages/ml.js:1034` | `var(--accent-green)` hardcodeado → `verColor` dinámico |

**Verificación:** ✅ `node -c ml.js` | ✅ 107/107 tests | ✅ Push a GitHub

### 2026-06-04: Fix confianza 0.0% en dashboard de predicción

**Qué:** Se corrigió bug donde el indicador de confianza en el dashboard siempre mostraba 0.0% sin importar la probabilidad real.

**Problema:** `mainProb` (y `gaugePct`) se usaban en strings HTML antes de su declaración `var`. JavaScript hoistea la declaración pero el valor es `undefined` hasta la línea de asignación, causando `data-target="undefined"` → `parseFloat("undefined")` → 0.

**Solución:** Mover `var mainProb` y `var gaugePct` antes de su primer uso (junto a `confLabel`, después de calcular `prob`).

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:984-985` | Declaraciones movidas antes del HTML de verdict card |

**Verificación:** ✅ `node -c ml.js` | ✅ 107/107 tests | ✅ Push a GitHub

### 2026-06-04: Fix delete endpoint + volumen persistente Fly.io + naming display

**Qué:** Se agregó endpoint DELETE faltante, volumen persistente para no perder modelos en redeploys, y display del nombre personalizado en toda la UI.

**Problemas corregidos:**
1. **Delete "not found"**: No existía el endpoint `DELETE /api/ml/models/{model_id}` en `ml_service/main.py`. Se agregó usando `ModelManager.delete_model()`.
2. **Modelos perdidos en redeploy**: Fly.io usa disco efímero — cada deploy borra archivos. Se creó volumen persistente `ml_models` (1GB, `dfw`) montado en `/app/Red_Neuronal/modelos_guardados`. Ahora modelos `.pkl` y `modelo_registro.json` sobreviven redeploys.
3. **saved_at vacío**: El endpoint `GET /api/ml/models` leía `entry.saved_at` y `entry.eval_results`, pero `ModelManager` guarda `created_at` y `metrics`. Corregido el mapeo.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `ml_service/main.py:467` | Nuevo `DELETE /api/ml/models/{model_id}` |
| `ml_service/main.py:455` | Fix mapeo: `saved_at` → `created_at`, `metrics` → `eval_results` |
| `ml_service/fly.toml` | Nuevo `[[mounts]]` con volumen `ml_models` |
| `js/pages/ml.js:346` | Model selector muestra `custom_name` prioritario |
| `js/pages/ml.js:393-395` | Tarjeta detalle + resultado muestra nombre personalizado + ID interno |
| `js/pages/ml.js:221` | `ml-name-input` incluido en `_bindGuideEvents()` |

**Verificación:** ✅ `node -c ml.js` | ✅ `python3 -c main.py` | ✅ 107/107 tests | ✅ `curl DELETE /models/modelo_999 → 404`

### 2026-06-03: Fase 3 — Async training + polling progress + dataset upload

**Qué:** Sistema de entrenamiento asíncrono con background threads, polling de progreso,
y carga de datasets vía upload desde el navegador.

**Backend — Async task system (`ml_service/main.py`):**
- `_execute_training(req, progress_callback)` — core de entrenamiento extraído como función
  reutilizable, reporta progreso 0-100% en etapas (carga, preprocesamiento, entrenamiento,
  evaluación, guardado)
- `_run_training_thread(task_id, req)` — target para background thread, maneja errores
- `POST /api/ml/train/async` — lanza entrenamiento en daemon thread, devuelve `task_id` al instante
- `GET /api/ml/tasks` — lista todas las tareas con estado, progreso, texto de estado
- `GET /api/ml/tasks/{task_id}` — polling endpoint con resultado cuando `status === 'done'`
- `DELETE /api/ml/tasks/{task_id}` — limpia tareas completadas
- Límite de 50 tareas en memoria (FIFO); thread-safe con `_tasks_lock`
- `POST /api/ml/dataset/upload` — acepta multipart CSV, valida path traversal, guarda en `datos/`
  con previsualización de columnas y filas

**Frontend — UI Async (`js/pages/ml.js`):**
- `train()` ahora usa `/api/ml/train/async` con polling cada 2s + barra de progreso animada
  + texto de estado (ej: "Entrenando modelo... (45%)")
- Fallback automático a endpoint sync si async no está disponible
- `trainAll()` entrena cada modelo con async endpoint + barra de progreso por modelo
  + status individual (cada modelo tiene su propia barra y polling)
- `uploadDataset()` — input file oculto + submit a `/api/ml/dataset/upload`
- `handleUploadFile(event)` — via `fetch` directo con `FormData`, muestra resultado
  (columnas, filas, preview) y refresca selector de datasets

**Endpoints nuevos:**
| Método | Path | Propósito |
|--------|------|-----------|
| POST | `/api/ml/train/async` | Inicia entrenamiento async, devuelve task_id |
| GET | `/api/ml/tasks` | Lista todas las tareas |
| GET | `/api/ml/tasks/{task_id}` | Polling de progreso y resultado |
| DELETE | `/api/ml/tasks/{task_id}` | Elimina tarea |
| POST | `/api/ml/dataset/upload` | Subir CSV |

**Arquitectura:**
```
Frontend                          Backend (FastAPI)
   │                                   │
   ├── POST /train/async ──────────────┤→ _execute_training() en thread
   │ ← { task_id }                     │   │
   │                                   │   └── update _tasks[task_id]
   ├── GET /tasks/{id} (c/2s) ─────────┤
   │ ← { status, progress, status_text }│
   │                                   │
   │ [cuando status === 'done']        │
   │ ← { task.result }                 │
   └── renderTrainingResult() ─────────┘
```

**Verificación:** ✅ `node -c ml.js` | ✅ `python3 -c main.py` | ✅ 107/107 tests

### 2026-06-02: Fix panel hiperparámetros + sidebar ML más ancho + campos más grandes

**Qué:** Reparación del panel de hiperparámetros que no se abría, sidebar ML al 200% (480px),
y todos los campos escalados para mejor legibilidad.

**Archivos afectados:**
- `js/pages/ml.js` — fix: toggleHP, onModelChange, onTuningToggle no estaban en return público
  + todos los selects, inputs, botones aumentados a font-size:12-13px + padding mayor
- `css/core/indexx.css` — nuevo `#paneLeft.pane-ml { width: 480px; }`
- `js/core/indexx-ui.js` — toggle clase `pane-ml` al cargar página ML

**Fix (bug crítico):** Las funciones `toggleHP()`, `onModelChange()`, `onTuningToggle()` estaban
definidas pero no expuestas en el return del IIFE (`MLManager`). Al hacer click en "⚙️ Hiperparámetros"
se llamaba `MLManager.toggleHP()` que era `undefined`. Solución: agregar las 3 funciones al return.

**Sidebar:** Aumentado de 240px → 480px (200%) específicamente para la página ML. Usa la misma
técnica que `pane-reportes` (clase condicional en `#paneLeft`).

**Campos más grandes (toda la sidebar ML):**
| Elemento | Antes | Después |
|----------|-------|---------|
| selects | font-size:10px, padding:4px | font-size:13px, padding:6px |
| inputs | font-size:10px, padding:3px | font-size:13px, padding:5px |
| botones | font-size:9-10px, padding:3px | font-size:12px, padding:5px |
| labels | font-size:9px | font-size:12px |
| info-section-body | padding:6px 10px | padding:8px 12px |
| HP inputs | font-size:9px, width:60px | font-size:12px, width:80-100px |
| Checkbox tuning | tamaño estándar | 16x16px |

**Verificación:** ✅ node -c sin errores ✅ 107/107 tests pasan

### 2026-06-02: Dataset de estrés ML v2 (entrenamiento_estres_ml.csv)

**Qué:** Dataset sintético de 800 filas × 12 columnas para probar las nuevas capacidades.

| Propiedad | Valor |
|-----------|-------|
| Filas | 800 |
| Columnas | 12 (9 features + 2 ruido + 1 target) |
| Target | Binario (15.2% positivos vs 84.8% negativos) |
| Features numéricas | edad, antiguedad, ingresos, gastos_fijos, deudas, ruido_1, ruido_2 |
| Features categóricas | ciudad (6), sector (6), nivel_estudios (4) |
| Ruido | ruido_1, ruido_2 son uniformes aleatorios (sin correlación con target) |
| Relaciones no lineales | Target depende de interacciones edad×antiguedad, ingresos con rendimientos decrecientes |
| Desbalance | ~85/15 → prueba SMOTE/ADASYN |
| Ruido | 2 columnas irrelevantes → prueba SelectKBest/RFE |

**Cómo probar desde la UI:**
1. Refrescar datasets, seleccionar `entrenamiento_estres_ml.csv`
2. Target: `target`, modelo: Random Forest
3. Abrir ⚙️ Hiperparámetros, ajustar `n_estimators: 500`, `max_depth: 25`
4. Activar Tuning automático → Grid Search
5. Cambiar balanceo a SMOTE
6. Click 🎯 Entrenar — verás best_params en resultados
7. Click 🏆 Todos — compara 4 modelos lado a lado

### 2026-06-02: Fase 2 — UX de entrenamiento (Hiperparámetros + Comparación multi-modelo)

**Qué:** Panel interactivo de hiperparámetros en frontend, tuning automático, balanceo,
y entrenamiento multi-modelo con tabla comparativa.

**Archivo afectado:** `js/pages/ml.js` (+378/-28 líneas)

**F2a — Panel colapsable de hiperparámetros**
- Nuevo panel "⚙️ Hiperparámetros" debajo del selector de modelo
- Campos específicos por algoritmo: RF (n_estimators, max_depth, min_samples_split, min_samples_leaf),
  XGB (n_estimators, learning_rate, max_depth, subsample),
  MLP (hidden_layer_sizes, alpha, learning_rate_init)
- Logistic/Linear: muestra mensaje "No requiere hiperparámetros"
- Panel se oculta/muestra con toggle ▶/▼, se actualiza al cambiar de modelo

**F2b — Tuning y balanceo**
- Checkbox "Tuning automático" + selector Grid Search / Random Search
- Selector de estrategia de balanceo: Sin balanceo / SMOTE / ADASYN
- Al activar tuning, el panel de hiperparámetros se abre automáticamente

**F2c — Entrenamiento multi-modelo con tabla comparativa**
- Botón "🏆 Todos" al lado de "🎯 Entrenar"
- Entrena secuencialmente RF → XGB → MLP → Logistic con indicador de progreso
- Tabla comparativa con métricas lado a lado, mejor modelo resaltado ⭐
- Muestra `best_params` del mejor modelo si hubo tuning
- Botones para re-entrenar todos o entrenar uno individual desde la tabla

**F2d — Mejora visual de resultados**
- `renderTrainingResult()` muestra `best_params` (⭐ Mejores hiperparámetros)
- Muestra configuración de `feature_engineering` si está activa
- `loadModelDetail()` y `predictFromModel()` también muestran `best_params`

**Verificación:** ✅ `node -c` sin errores | ✅ 107/107 tests pasan

### 2026-06-02: Fase 1 — Pipeline ML v2 (Hyperparameter tuning + Feature Engineering + SMOTE)

**Qué:** Mejoras al pipeline de ML para futuros entrenamientos. 4 archivos modificados + 3 callers actualizados.

**F1a — Hyperparameter tuning (`Red_Neuronal/trainer.py`)**
- Nuevas funciones `tune_model()` y `_apply_smote()`
- GridSearchCV / RandomizedSearchCV con grids por defecto por modelo (RF, XGB, MLP, Logistic, Softmax, Linear)
- Scoring automático según problema: `roc_auc` (binary), `f1_weighted` (multiclass), `r2` (regression)
- `train()` acepta `search_type: "none"|"grid"|"random"`, `search_params: dict`, `imbalance_strategy: "none"|"smote"|"adasyn"`
- Retorna `best_params: dict` como 4º valor

**F1b — Feature engineering (`Red_Neuronal/preprocessor.py`)**
- `build_preprocessor()` acepta `feature_engineering: dict` con:
  - `polynomial_degree` (2+ activa PolynomialFeatures)
  - `interaction_only` (solo interacciones, sin cuadráticos)
  - `feature_selection.method`: `"kbest"` o `"rfe"` con `k` columnas a seleccionar
- SelectKBest usa `f_classif` (clasificación) o `f_regression` según `problem_type`
- RFE usa RandomForest (Classifier/Regressor) según problema
- Feature engineering steps se inyectan entre ColumnTransformer y el modelo

**F1c — SMOTE/ADASYN (`Red_Neuronal/trainer.py`)**
- `_apply_smote()` balancea clases vía imbalanced-learn (try/except opcional)
- Reporta conteo antes/después de clases
- Combinación tuning + SMOTE: clona y reajusta pipeline sobre datos balanceados
- CV siempre sobre datos originales (métricas realistas)

**F1d — API (`ml_service/main.py`, `Red_Neuronal/model_manager.py`)**
- `TrainRequest` nuevos campos: `search_type`, `search_params`, `imbalance_strategy`, `feature_engineering`
- `train_endpoint()` pasa parámetros a `train()` y `prepare_data()`
- `best_params` incluido en response y en payload guardado
- `model_manager.py` registry guarda `best_params`

**Archivos afectados:**
- `Red_Neuronal/trainer.py` (+120 líneas)
- `Red_Neuronal/preprocessor.py` (+75 líneas)
- `ml_service/main.py` (~20 líneas modificadas)
- `Red_Neuronal/model_manager.py` (+1 línea)
- `Red_Neuronal/main.py`, `TEST_MODULOS.py`, `DEMO_interpretability.py` (3→4 return unpack)

**Verificación:** ✅ 7/7 Python files compilan | ✅ 107/107 tests JS pasan

### 2026-06-02: Remediación 23 errores de flujo (4 CRITICAL + 6 HIGH + 6 MEDIUM + 5 LOW)

**Qué:** Implementados 19 fixes del análisis estático de flujo + 2 descartados
(eran pseudo-bugs) + 11 tests de regresión nuevos.

**1. CRITICAL — StateManager (`js/core/StateManager.js`)**

- **C1 — insertColumn generaba headers duplicados.** Al insertar en
  `colIndex=1` con headers `[A,B,C,D]`, el resultado era `[A,A,B,C,D]`.
  Causa: el loop renombraba con `indexToExcelColumn(i + 1)` (mismo índice,
  no desplazamiento) y la nueva columna recibía `indexToExcelColumn(colIndex)` =
  "A" colisionando con la posición 0.
  Fix: renumerar existentes con `indexToExcelColumn(i + 2)` (desplazamiento
  +1) y la nueva columna recibe `indexToExcelColumn(colIndex + 1)`.
  También: si se pasa `header` personalizado, NO renumerar existentes
  (decisión del usuario).

- **C2 — `_pushToHistory` desincronizaba `historyIndex` al alcanzar
  `maxHistorySize` en mid-undo.** Cuando el historial estaba al máximo
  (50) y `historyIndex` apuntaba al medio (e.g. 30), un `shift()` eliminaba
  la entrada más antigua pero el índice seguía apuntando a la misma
  posición numérica, que ahora contenía una entrada diferente.
  Fix: restar 1 al `historyIndex` cuando ocurre el shift (mantener
  coherencia del puntero).

**2. CRITICAL — ML Manager (`js/pages/ml.js`)**

- **C3 — `predictFromModel` crasheaba con input vacío.**
  `Object.keys(inputData[0])` lanzaba TypeError cuando el array estaba
  vacío o el primer elemento no era un objeto.
  Fix: validar `inputData.length > 0` y `inputData[0]` sea objeto antes
  de acceder a sus keys. Además: `cleanupPredictModal()` se llama también
  al finalizar la predicción (no solo al cancelar), resolviendo M6.

- **C4 — DOM ID duplicado en modales múltiples de predicción.**
  IDs hardcodeados (`ml-expert-toggle`, `ml-predict-input`, `ml-feature-list`,
  `ml-predict-form`, `ml-preview-json`) colisionaban al abrir 2 modales
  consecutivamente; `getElementById` siempre devolvía el primero.
  Fix: usar `className` para elementos internos, `createElement` para
  el toggle, y `Date.now() + random` para el datalist ID. Capturar
  referencias en closures en vez de lookup por ID.

**3. HIGH — StateManager**

- **H1 — Cache de `getNumericCols` retornaba datos obsoletos.** El cache
  key era solo `headers + length`; ediciones a celdas no invalidaban.
  Fix: incluir en el hash la primera y última fila (truncadas a 200 chars)
  como fingerprint del contenido.

- **H2 — `beforeunload` no esperaba `saveToLocalStorage()` async.**
  El callback era sync; el guardado a IndexedDB podía no completarse antes
  del cierre. Fix: escribir a `localStorage` (sync) como fallback final
  en `beforeunload`.

- **H5 — `setHypothesisConfig` no notificaba listeners.** Fix:
  añadir `notifyListeners('dataChange')` tras el cambio.

- **H6 — `undo()` / `redo()` no notificaban listeners.** Mismo fix.

**4. HIGH — ML Manager**

- **H3 — Retry de 404 amplificaba errores legítimos.** El cliente reintentaba
  3× cualquier 404, incluyendo 404 legítimos de recursos inexistentes
  (e.g. usuario pide dataset eliminado). Fix: reintentar 503 siempre, y 404
  solo para paths exactos `/api/ml/health|datasets|models` (las "listas"
  afectadas por cold start).

- **H4 — Keep-alive interval nunca se limpiaba.** Memory leak + pings
  innecesarios a Fly.io. Fix: nueva función `_stopKeepAlive()` + listener
  `beforeunload` y `pagehide`.

**5. MEDIUM — Backend (`backend/server.js` + `database.js`)**

- **M2 — Memory leak en `_userFailures` y `_ipFailures` Maps.** Nunca se
  purgaban; con el tiempo consumían RAM. Fix: `setInterval` cada 30 min
  que limpia entries con `lastFailure > 1h` y resetea counters expirados.

- **M3 — `blacklistToken` silenciaba errores con `catch {}`** (solo PG).
  Si la DB caía, el token seguía válido. Fix: loguear el error con
  contexto (sigue siendo graceful degradation, pero ahora visible).

**6. MEDIUM — ML preprocessing (`Red_Neuronal/`)**

- **M4 — `detect_problem_type` tenía `return "binary"` dos veces
  consecutivas.** Limpieza de código muerto, sin cambio funcional.

- **M5 — `_generate_filename` podía exceder 255 bytes (MAX_PATH).**
  Fix: truncar dataset name a 50 chars y sanitizar caracteres
  inseguros (`/\:*?"<>|`).

**7. LOW**

- **L1 — JWT sin claims estándar `iss`/`aud`.** Fix: añadir
  `issuer: 'sigmaproxvl'`, `audience: 'sigmaproxvl-api'` en
  `jwt.sign` y validar en `jwt.verify`. Tokens antiguos (sin claims)
  serán rechazados; usuarios deberán re-loguear tras el deploy.

- **L2 — `setImportedData` no validaba payload.** Fix: rechazar
  si no tiene `headers` o `data` como arrays.

- **L3 — `init()` mostraba página vacía durante 10s de warmup.** Fix:
  mostrar mensaje "Despertando ML Service..." en `#ml-results`.

- **L4 — `escapeHtml` duplicado en ml.js.** Ya existe en `js/core/utils.js`.
  Fix: eliminar la definición local.

**8. Descartados del análisis original**

- **M1 (deleteRow reindexa solo col 0):** No es bug, la app no soporta
  fórmulas. Documentado.
- **M6 (cleanupPredictModal on success):** Resuelto como parte de C3.
- **M7 (loadFromLocalStorage no restaura history):** NO es bug; el
  análisis original estaba errado. `saveToLocalStorage` NUNCA guardó
  history (es by design — undo es session-only).
- **L5 (`_ALGO_INFO` en scope global):** NO es bug; la variable está
  dentro del IIFE de `MLManager`.

**Archivos modificados:**

| Archivo | Cambios |
|---------|---------|
| `js/core/StateManager.js` | C1, C2, H1, H2, H5, H6, L2 (7 fixes) |
| `js/pages/ml.js` | C3, C4, H3, H4, L3, L4 (6 fixes) |
| `backend/server.js` | L1, M2 (2 fixes) |
| `backend/database.js` | M3 (1 fix) |
| `Red_Neuronal/preprocessor.py` | M4 (1 fix) |
| `Red_Neuronal/model_manager.py` | M5 (1 fix) |
| `tests/StateManager.test.js` | +11 tests de regresión |

**Tests de regresión nuevos (11):**

```
✓ insertColumn (regression C1)
  - secuencia A,B,C,D,E sin duplicados
  - insertColumn al final
  - header personalizado no renumera
✓ undo/redo history (regression C2)
  - historyIndex coherente al exceder maxHistorySize
✓ hypothesis listeners (regression H5+H6)
  - setHypothesisConfig notifica
  - undo notifica
  - redo notifica
✓ setImportedData (regression L2)
  - rechaza string
  - rechaza payload sin headers
  - acepta payload válido
  - null limpia
```

**Verificaciones finales:**

```
node -c backend/server.js                  → OK
node -c js/core/StateManager.js            → OK
node -c js/pages/ml.js                     → OK
python3 -m py_compile Red_Neuronal/*.py    → OK
npm test (vitest)                          → 107/107 PASSED (96 + 11 nuevos)
```

**Estadísticas:**

```
Test Files  5 passed (5)
     Tests  107 passed (107)
  Duration  ~810ms
```

### 2026-06-02: Remediación 6 hallazgos HIGH de auditoría de seguridad

**Qué:** Implementados los 6 fixes de severidad HIGH identificados en el mapeo de seguridad:
H1 (CORS wildcard ML), H2 (path traversal), H3 (joblib sandbox), H4 (JWT_SECRET fail-fast),
H5 (blacklist fail-closed), H6 (helmet security headers).

**1. H6 — helmet en backend (security headers)**
- `helmet@^8.1.0` añadido a `backend/package.json` (ya estaba en package-lock).
- Insertado en `server.js` entre CORS y `express.json()`.
- CSP desactivada (la SPA vanilla sirve su propia CSP en `<meta>`); HSTS activo
  con `maxAge=1 año, includeSubDomains, preload`.
- Headers que ahora se envían: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-DNS-Prefetch-Control`, `X-Download-Options`, `X-Permitted-Cross-Domain-Policies`.

**2. H1 — CORS whitelist en ML Service (no más wildcard)**
- `ml_service/main.py`: nueva constante `ALLOWED_ORIGINS` con la misma whitelist del backend
  (`fernandonina241018.github.io` + localhost dev).
- Middleware CORS manual ya no devuelve `*`; valida `Origin` contra la lista.
- `CORSMiddleware` cambiado de `allow_origins=["*"]` a la whitelist explícita.
- Métodos permitidos limitados a `GET, POST, DELETE, OPTIONS`.

**3. H2 — Validación de `dataset_name` con regex (anti path traversal)**
- `ml_service/main.py`: nuevo `DATASET_NAME_RE = ^[A-Za-z0-9_\-\.]+$`.
- Helper `_safe_dataset_name(name)` rechaza nombres con `..`, que empiecen con `.`,
  o con caracteres fuera del whitelist.
- Aplicado en `train_endpoint` y `preview_dataset`.

**4. H3 — Sandboxing de `joblib.load()`**
- Nuevo helper `_safe_resolve(base_dir, name, allowed_ext)` que:
  - Resuelve el path absoluto y verifica que esté dentro de `base_dir` (anti traversal).
  - Verifica que la extensión esté en la whitelist (`.csv`, `.joblib`, `.pkl`).
- Aplicado en 4 puntos: `predict_endpoint`, `list_models` (joblib lazy load),
  `explain_endpoint`, y los 2 lugares de `dataset_name`.
- También `MODEL_ID_RE = ^[A-Za-z0-9_\-]+$` para `model_id`.

**5. H4 — Fail-fast si `JWT_SECRET` no está definido**
- `backend/server.js:8-21`: si `JWT_SECRET` falta → `process.exit(1)` con instrucciones claras.
- Cambiado mínimo de 26 → **32 caracteres**.
- Eliminado fallback que generaba clave random al boot (causaba DoS de sesiones
  en cada reinicio e inconsistencias en multi-instance).

**6. H5 — Blacklist estricto (fail-closed)**
- `backend/server.js` (requireAuth): si `db.isTokenBlacklisted()` falla por error de DB,
  ahora responde **503** en vez de permitir el acceso (antes: `catch(() => next())`).
- Log explícito del error en consola.

**Archivos modificados:**

| Archivo | Cambio |
|---------|--------|
| `backend/server.js` | helmet middleware; JWT_SECRET fail-fast; blacklist fail-closed |
| `backend/package.json` | Añadido `helmet ^8.1.0` |
| `ml_service/main.py` | ALLOWED_ORIGINS; _safe_resolve / _safe_dataset_name / _safe_model_id; 5 endpoints protegidos |

**Verificaciones:**

```
node -c backend/server.js                          → SYNTAX OK
python3 -m py_compile ml_service/main.py           → SYNTAX OK
npm test (vitest, 96 tests)                        → 96/96 PASSED
npm install helmet                                 → 5 moderate CVEs en deps transitivas (audit fix disponible)
```

**Pendiente de rotación manual de secrets (de CRITICAL, fuera de scope de este commit):**
- Rotar `DATABASE_URL` de Supabase (está en ESTADO_PROYECTO.md histórico)
- Resetear `admin/admin123` y `f.nina/1234` (estaban documentadas)
- Purga del historial git con `git filter-repo`

### 2026-06-02: Token revocation + CSRF + StateManager fix + 60 tests (commit `fdb127b`)

**Qué:** 8 items completados del backlog de seguridad y tests.

**1. Logging safe mode**
- Eliminado bloque duplicado de validación JWT_SECRET (server.js:14-19 eliminados, ahorro ~6 líneas).

**2. Token revocation blacklist**
- Nueva tabla `token_blacklist` en PostgreSQL (y soporte en JSON store local).
- `hashToken()`, `blacklistToken()`, `isTokenBlacklisted()`, `cleanExpiredBlacklist()` en database.js.
- `requireAuth` verifica blacklist antes de procesar la request.
- `POST /api/logout` revoca el token actual.
- `setInterval` cada 1h limpia entradas expiradas (>24h).

**3. CSRF protection**
- `requireAuth` exige header `Authorization` (Bearer) para POST/PUT/DELETE, sin permitir fallback a cookie.

**4. StateManager fix — redo**
- `redo()` restauraba `oldValue` en vez de `newValue`. Corregido añadiendo `newValue` a la entry de historial.

**Archivos modificados:**

| Archivo | Cambio |
|---------|--------|
| `backend/server.js` | Eliminado duplicado JWT; `extractRawToken()` helper; blacklist check en requireAuth; CSRF enforcement; logout revoca token; cleanup interval |
| `backend/database.js` | `hashToken()`, `blacklistToken()`, `isTokenBlacklisted()`, `cleanExpiredBlacklist()` para PG y local store |
| `js/core/StateManager.js` | `_pushToHistory()` ahora guarda `newValue`; `redo()` restaura `newValue` |

**5. StateManager.test.js — 30 tests nuevos**
- Mocks: `StorageAdapter` (setItem/getItem/removeItem), `Logger` (logDataChange)
- Tests: sheets (init, create, rename, delete, max limit), data (updateCell, addRow/Col, deleteRow/Col, clear), importedData, activeStats, hypothesisConfig (undo/redo), persistence (save/load/clear), ultimosResultados, event system (addEventListener/removeEventListener), getStats

**6. EstadisticaDescriptiva.test.js — 30 tests migrados**
- Migración completa del antiguo `tests/test-estadistica.js` (405 líneas, browser) a vitest
- Tests: media, mediana, moda, varianza, DE, rango, CV, percentil, cuartiles, IQR, asimetría, curtosis, error estándar, Pearson, Spearman, Kendall, covarianza, RMSE, MAE, R², t-test, Jarque-Bera, Shapiro-Wilk, ANOVA, Mann-Whitney, Kruskal-Wallis, χ², IC95, outliers IQR

**Archivos creados:**

| Archivo | Líneas |
|---------|--------|
| `tests/StateManager.test.js` | 224 |
| `tests/EstadisticaDescriptiva.test.js` | 196 |

**Estadísticas de tests:**

```
Test Files  5 passed (5)
     Tests  96 passed (96)
```

**Items ya existentes (verificados):**
- `GET /api/me` ya existía en server.js y frontend auth.js lo llamaba en `init()`
- CORS whitelist ya implementado con middleware manual en server.js
- EDAManager JB p-value (`Math.exp(-jb/2)`) es exacto para χ²(2) — no requiere cambio

### 2026-05-30: Eliminados campos de firma del formulario de ReporteManager

**Qué:** Se eliminó la sección "✍️ Electronic Signatures — 21 CFR Part 11" del formulario de generación de reportes. Ahora las firmas solo pueden realizarse desde la página "firmarReporte" con verificación de contraseña.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:2079-2095` | Eliminado bloque completo de firmas (inputs de nombre/cargo/fecha para prep/rev/app) |
| `js/managers/ReporteManager.js:2197` | Eliminadas referencias a previews de fecha de firma (`rep-prep-date-preview`, etc.) |

 **Flujo final:**
```
ReporteManager → [✍️ Enviar a firma] → firmarReporte (sin campos de firma en el form)
                                           ↓
                                     Solo aquí se firma (con contraseña)
```

### 2026-05-30: Sidebar reportes + fix persistencia firma tras hard reset

**Qué:** 
1. Movidos Idioma/Language, Formatos, Regulatory Framework y botón "Enviar a firma" del right panel al left sidebar en ReporteManager.
2. Corregido bug: tras firmar un reporte y hacer hard reset, el preview se borraba pero el sidebar retenía estado "firmado", bloqueando re-firma. Causa: `_firmaCurrentHtml` no se actualizaba después de firmar, por lo que `localStorage` guardaba el HTML original sin firmas.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js` | Eliminado `<!-- DERECHA -->` de `buildReportesView()`. Nueva función `buildReportesSidebar(tieneRes)`. Render del sidebar en `#reportes-sidebar-container` |
| `js/core/indexx.js:511` | `leftPanels.reportes` ahora retorna `<div id="reportes-sidebar-container">` |
| `js/core/indexx.js:4124` | `firmaUpdatePreview()` ahora actualiza `_firmaCurrentHtml` tras modificar DOM |
| `css/core/indexx.css:192` | `#paneLeft.pane-reportes` ancho 320px. `.rep-layout` a 1fr |

**Bug fix:** `firmaUpdatePreview()` ahora actualiza `_firmaCurrentHtml = '<!DOCTYPE html>\n' + _firmaCurrentDoc.documentElement.outerHTML`, asegurando que `firmaPersistState()` guarde el HTML con firmas para restaurar correctamente tras hard reset.

### 2026-05-30: Botón "Reiniciar firmas" en sidebar de firmarReporte

**Qué:** Nuevo botón "🔄 Reiniciar firmas" en el sidebar de la página de firma. Permite reiniciar las 3 firmas al estado sin firmar, solo cuando el reporte es nuevo (nunca guardado en disco). Si el reporte fue cargado desde disco con firmas preexistentes, el botón se oculta automáticamente.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx.js:529` | Botón `#firmaResetBtn` agregado al template de `leftPanels.firmarReporte` |
| `js/core/indexx.js:3898` | Event listener `onclick = firmaResetSignatures` en `initFirmarReportePage()` |
| `js/core/indexx.js:4130-4141` | Nueva función `firmaUpdateResetBtn()`: oculta botón si alguna firma está firmada |
| `js/core/indexx.js:4144-4156` | Nueva función `firmaResetSignatures()`: reinicia estado, preview y persiste |
| `js/core/indexx.js:4127` | `firmaUpdateResetBtn()` llamado desde `firmaRenderEditor()` |

**Regla de negocio:** El botón se muestra solo cuando `_firmaIsNewSession === true` (reporte nuevo desde ReporteManager no guardado en disco).

### 2026-05-30: Fix bugs z_error.md + flag _firmaIsNewSession

**Qué:** 
1. **Reportes cargados de disco ya no muestran botón reset.** Se agregó flag `_firmaIsNewSession` para distinguir reportes nuevos (desde ReporteManager) de archivos cargados del disco. El botón "Reiniciar firmas" solo aparece en reportes nuevos.
2. **Estado huérfano:** `_firmaLoadHtml()` ahora limpia `_firmaSignatureState = {}` antes de auto-detectar.
3. **Duplicados:** Filename con timestamp `_firmado_2026-05-30-12-00-00.html`.
4. **Flag persistido** en localStorage (`__firma_is_new_session`) para restaurar correctamente tras hard reset.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx.js:3815` | Nueva variable `_firmaIsNewSession = false` |
| `js/core/indexx.js:3825` | Persistir flag en `firmaPersistState()` |
| `js/core/indexx.js:3838` | Limpiar flag en `firmaClearState()` |
| `js/core/indexx.js:3872` | Restaurar flag en `firmaRestoreState()` |
| `js/core/indexx.js:3927` | `_firmaIsNewSession = true` en carga desde sessionStorage (ReporteManager) |
| `js/core/indexx.js:4050` | `_firmaIsNewSession = false` en `firmaHandleFile()` |
| `js/core/indexx.js:3966` | `_firmaIsNewSession = false` en init normal |
| `js/core/indexx.js:4140-4143` | `firmaUpdateResetBtn()` usa `_firmaIsNewSession` |
| `js/core/indexx.js:4192` | Timestamp en filename de `firmaDownload()` |

### 2026-05-30: Fix detect_problem_type — targets continuos con ≤20 filas clasificados como multiclass

**Qué:** Al entrenar con datasets pequeños (≤20 filas), `detect_problem_type()` retornaba "multiclass" por la regla `n_unique <= 20`, incluso cuando los valores target eran continuos (floats con decimales). Scikit-learn lanzaba `Unknown label type`.

**Fix:** En `preprocessor.py:60`, antes de clasificar como multiclass, se verifica si los valores numéricos son continuos (`values % 1 != 0`). Si lo son → regression.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `Red_Neuronal/preprocessor.py:60-64` | Nueva condición: si dtype numérico con valores no enteros → regression |

### 2026-05-30: Fix train ML — worksheets ≤20 filas tratadas como preview de dataset servidor

**Qué:** Al cargar un CSV desde disco (page Dato → page Trabajo) y usarlo en ML Analysis con ≤20 filas, el entrenamiento fallaba con "Dataset '📋 nombre' not found". El backend interpretaba que `data` con ≤20 filas era un preview de servidor y buscaba el archivo en disco.

**Causa raíz:** La condición `len(req.data) <= 20` en `ml_service/main.py:147` no distinguía entre "preview de 10 filas de un dataset del servidor" vs "dataset completo cargado desde hoja de trabajo con pocas filas".

**Fix:** Cambiado a `len(req.data) == 0` — solo hace file lookup cuando el frontend no envió datos inline (caso de datasets del servidor que mandan `data: []`).

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `ml_service/main.py:147` | `len(req.data) <= 20` → `len(req.data) == 0` |

**Comportamiento:**
```
Antes:  data=[] (servidor) → file lookup ✓
        data≤20 filas (worksheet) → file lookup ✗ (bug)
Después: data=[] (servidor) → file lookup ✓
         data>0 filas (worksheet) → usa datos inline ✓
```

### 2026-05-30: Fix 404 en train ML — dataset_name sin extensión .csv

**Qué:** Todo intento de entrenar un modelo nuevo fallaba con `Dataset 'X' not found in /app/Red_Neuronal/datos` porque el backend construía `csv_path = DATOS_DIR / req.dataset_name` sin extensión `.csv`. Los datasets se registran con `csv_file.stem` (nombre sin extensión) en `get_available_datasets()`, pero al buscar el archivo físico faltaba el `.csv`.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `ml_service/main.py:148-152` | `csv_path` ahora intenta con `.csv` primero, luego sin extensión, luego glob con `.*` |
| `ml_service/main.py:304-307` | Mismo fix en endpoint `/api/ml/dataset/preview` |

**Flujo corregido:**
```
Antes:  csv_path = DATOS_DIR / "entren_temo_c_f"       → no existe ✗
Después: csv_path = DATOS_DIR / "entren_temo_c_f.csv"   → existe ✓
         fallback: DATOS_DIR / "entren_temo_c_f"         → sin extensión
         fallback: glob("**/entren_temo_c_f.*")          → cualquier extensión
```

### 2026-05-30: Fix deploy ML Service — .dockerignore bloqueaba ml_service/ y Red_Neuronal/

**Qué:** El build del ML Service fallaba con `"/Red_Neuronal": not found` porque el `.dockerignore` raíz excluía todo excepto `backend/`. Los directorios `ml_service/` y `Red_Neuronal/` no estaban en el build context (solo 2 bytes transferidos).

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `.dockerignore` | Agregadas excepciones `!ml_service/`, `!ml_service/**/*`, `!Red_Neuronal/`, `!Red_Neuronal/**/*` |

### 2026-05-30: Fix deploy ML Service — dockerfile path duplicado en fly.toml

**Qué:** El error `dockerfile 'ml_service/ml_service/Dockerfile' not found` ocurría porque `ml_service/fly.toml` tenía `dockerfile = 'ml_service/Dockerfile'`, pero la ruta es relativa a la ubicación del `fly.toml`. Como el fly.toml ya está dentro de `ml_service/`, la ruta resolvía a `ml_service/ml_service/Dockerfile`.

**Esto también explica el error 503 persistente:** la app `sigmapro-ml` en Fly.io tenía desplegado el backend Express (por deploy con config incorrecta) en vez del ML Service FastAPI. Al intentar proxy a `localhost:8000`, fallaba con `ECONNREFUSED`.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `ml_service/fly.toml:6` | `dockerfile = 'ml_service/Dockerfile'` → `dockerfile = 'Dockerfile'` |

**Comando correcto para redeploy:**
```bash
# Desde la raíz del proyecto:
flyctl deploy --app sigmapro-ml --config ml_service/fly.toml
```

### 2026-05-30: Solución definitiva 503 — Warm-up híbrido (health ping + keep-alive)

**Qué:** Se eliminó la causa raíz del 503 (cold start Fly.io) con un enfoque híbrido:
1. **`_warmUp()`**: Antes de cargar datasets/models, se hace ping a `/api/ml/health` con hasta 5 intentos (2s entre cada uno) para "despertar" la máquina.
2. **`_startKeepAlive()`**: `setInterval` cada 4 minutos (240s) que pinge `/api/ml/health`, manteniendo la máquina activa mientras el usuario usa ML (el timeout de Fly.io es 5 min).
3. **`init()`** pasa a `async`, llama a `_warmUp()` primero, luego `refreshDatasets()`, `refreshModels()`, y arranca el keep-alive.
4. Se mantiene el retry en 503/404 como safety net.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:10` | Nueva variable `_keepAliveId = null` |
| `js/pages/ml.js:51-67` | Nueva función `_warmUp()` con 5 intentos de health ping |
| `js/pages/ml.js:69-76` | Nueva función `_startKeepAlive()` con `setInterval` 240s |
| `js/pages/ml.js:157-161` | `init()` ahora es `async`, llama `await _warmUp()` y `_startKeepAlive()` |

**Flujo:**
```
init() → _warmUp() → refreshDatasets() + refreshModels() + _startKeepAlive()
           │                │                        │
           │                └── Retry 404/503 ────────┤
           │                                          │
           └── Hasta 5 intentos, 2s c/u ──────────────┘
                                                      ↓
                                           setInterval(/health, 240s)
```

### 2026-05-30: Fix retry ML Service — también reintentar en 503 (no solo 404)

**Qué:** El error `503 (Service Unavailable)` en `ml.js:28` no era capturado por el retry, que solo manejaba `404`. Fly.io responde con 503 durante el cold start de la máquina. Se agregó `|| res.status === 503` a la condición de reintento.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:29` | `if (res.status === 404 && _retries > 0)` → `if ((res.status === 404 \|\| res.status === 503) && _retries > 0)` |

### 2026-05-30: Cerrar tab redirige foco + bloqueo última pestaña

**Qué:** Al presionar "X" en una pestaña, ahora el foco se mueve automáticamente a la pestaña adyacente (derecha → izquierda). Si solo hay una pestaña abierta, no se puede cerrar. Si no quedan pestañas, se muestra un mensaje en los paneles.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx.js:282-304` | Nueva función `closeTab(tabEl, e)`: re-foco + bloqueo última tab |
| `js/core/indexx.js:310` | Handler Untitled usa `closeTab(t, e)` |
| `js/core/indexx.js:764` | Handler pageTab usa `closeTab(pageTab, e)` |

### 2026-05-30: Fix JWT_SECRET crash en Fly.io + CORS ML Service

**Qué:** 
1. **Backend** crasheaba con `process.exit(1)` si `JWT_SECRET` no estaba configurado en Fly.io. Ahora genera una clave temporal automáticamente si no existe (con warning), permitiendo que la app arranque en el primer deploy.
2. **ML Service**: middleware CORS manual para OPTIONS preflight.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `backend/server.js:8-16` | `JWT_SECRET` ausente → genera clave random en vez de `process.exit(1)` |
| `ml_service/main.py:47-64` | Nuevo middleware HTTP que maneja OPTIONS y agrega CORS headers |

### 2026-05-30: ReporteManager envía directo a firma (sin descarga intermedia)

**Qué:** Se eliminó el botón de descarga de ReporteManager. Ahora hay un botón "✍️ Enviar a firma" que genera el HTML y lo pasa directamente a la página de firma mediante `sessionStorage`, sin crear archivos intermedios en disco.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:2165-2167` | Botón `📥 Download Report` → `✍️ Enviar a firma` |
| `js/managers/ReporteManager.js:2213-2227` | Handler: guarda HTML en `sessionStorage` y navega a `firmarReporte` |
| `js/core/indexx.js:3939-4008` | Nueva función `firmaLoadHtml(html, name)` extraída de `firmaHandleFile` |
| `js/core/indexx.js:3889-3937` | `initFirmarReportePage()`: verifica `sessionStorage.__firma_pending_html` al inicio |

**Flujo nuevo:**
```
ReporteManager → [✍️ Enviar a firma] → sessionStorage → firmarReporte (auto-carga)
                                                          ↓
                                                          Firmar → descarga solo el firmado
```

**Ya no se genera archivo duplicado** porque no hay descarga desde ReporteManager. El único archivo que se descarga es el firmado desde firmarReporte.

### 2026-06-04: Target column in ML sidebar changed from text input to select dropdown

**Qué:** La columna target en el sidebar de ML ahora es un `<select>` que carga todas las columnas del dataset seleccionado, en vez de un `<input>` donde había que escribir el nombre manualmente.

**Cambios:**
- `ml-target-input`: `<input type="text">` → `<select>` con opciones cargadas automáticamente
- Nueva función `_populateTargetColumns()`: obtiene columnas del dataset seleccionado (servidor o worksheet local) y puebla el select
- Evento `change` en `ml-dataset-select` → dispara `_populateTargetColumns()`
- `refreshDatasets()` llama a `_populateTargetColumns()` al terminar
- Mensajes de validación actualizados: "Ingresa el nombre" → "Selecciona la columna target"

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:132` | HTML: input → select con option placeholder |
| `js/pages/ml.js:299-314` | Nueva `_populateTargetColumns()` (antes de `refreshDatasets`) |
| `js/pages/ml.js:369` | `refreshDatasets()` llama a `_populateTargetColumns()` al final |
| `js/pages/ml.js:229-231` | `_bindGuideEvents()` agrega listener change en dataset select |
| `js/pages/ml.js:465-467` | `train()`: target.value sin `.trim()`, toast actualizado |
| `js/pages/ml.js:665` | `trainAll()`: igual |
| `js/pages/ml.js:631` | Checklist: hint actualizado |

### 2026-06-04: Fix _renderDashboard theme — undefined vars + hardcoded gauge colors

**Qué:** El dashboard de resultados de predicción (result overlay) usaba nombres de variables CSS que no existen en el tema (`--accent-green`, `--accent-red`, `--accent-cyan`, `--text-sec`, `--text-dim`, `--bg-card`) y colores duros en el gauge SVG.

**Variables rotas corregidas:**
| Antes (undefined) | Después (existe) |
|---|---|
| `var(--accent-green)` | `var(--accent-alt)` |
| `var(--accent-red)` | `var(--accent-error)` |
| `var(--accent-cyan)` | `#00b8d4` |
| `var(--text-sec)` | `var(--text-muted)` |
| `var(--text-dim)` | `var(--text-faint)` |
| `var(--bg-card)` | `var(--card-bg)` |

**Colores duros en gauge SVG:**
- Track: `#1e2d3d` → `var(--border)`
- Gradient stops: `#ffa502` → `var(--accent-warn)`, `#00e5a0` → `var(--accent-alt)`
- Needle/circle: `#00e5a0` → `var(--accent-alt)`
- Labels 0/50/100: `#3d5a73` → `var(--text-faint)` + `font-family` → `var(--font-mono)`

**Alpha backgrounds:**
- `rgba(34,197,94,0.15)` → `color-mix(in srgb, var(--accent-alt) 15%, var(--item-bg))`
- `rgba(239,68,68,0.15)` → `color-mix(in srgb, var(--accent-error) 15%, var(--item-bg))`
- NLP risk color: `#f59e0b` → `var(--accent-warn)`

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:954-1271` | `_renderDashboard()` — corregidas ~15 referencias a variables inexistentes + colores duros |

**Verificación:** ✅ `node -c ml.js` | ✅ Dashboard se adapta a ambos temas

### 2026-06-04: Fix prediction modal theme — adapts to dark/light mode

**Qué:** El modal de predicción usaba colores oscuros hardcodeados (`#0e141b`, `#1c2a38`, `#131c26`, etc.) que no cambiaban al activar el modo claro. Se reemplazaron todas las referencias por CSS variables del sistema de temas (`var(--bg-panel)`, `var(--border)`, `var(--text-primary)`, etc.).

**Cambios en `getPredictModalCSS()` (~75 líneas de CSS):**
- Todos los colores de fondo: `#0e141b` → `var(--bg-panel)`, `#131c26` → `var(--item-bg)`, `#090d12` → `var(--bg-primary)`
- Todos los bordes: `#1c2a38` → `var(--border)`, `#2a3f56` → `var(--text-faint)`
- Todos los textos: `#dde8f0` → `var(--text-primary)`, `#6a8ba8` → `var(--text-muted)`, `#324d63` → `var(--text-faint)`
- Acentos: `#8b84ff/#6c63ff` → `var(--accent)`, `#00c896` → `var(--accent-alt)`, `#ffaa00` → `var(--accent-warn)`, `#ff4d6a` → `var(--accent-error)`
- Tintes con alpha (ej: `#6c63ff18`): reemplazados con `color-mix(in srgb, var(--accent) 8%, var(--bg-panel))`
- Tipografías: `'IBM Plex Sans'` → `var(--font-body)`, `'IBM Plex Mono'` → `var(--font-mono)`
- Select chevron: SVG hardcodeado reemplazado por triángulo CSS via `::after` pseudo-elemento con `var(--text-faint)`
- Fuente del overlay: eliminada (hereda del tema)

**Cambios en `buildPredictModalHTML()` (inline styles):**
- `color:#6a8ba8` → `color:var(--text-muted)`
- `color:#324d63` → `color:var(--text-faint)` (3 ocurrencias)
- `background:#324d63` → `background:var(--text-faint)`

**Cambios en result overlay (close button):**
- `background:rgba(255,255,255,0.05)` → `background:var(--item-bg)`

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:1594-1673` | `getPredictModalCSS()` reescrita con CSS variables + `color-mix()` |
| `js/pages/ml.js:1688-1706` | 4 inline styles en `buildPredictModalHTML()` reemplazados |
| `js/pages/ml.js:1521` | Close button bg: `rgba(...)` → `var(--item-bg)` |

**Verificación:** ✅ `node -c ml.js` | ✅ Modal se adapta a `data-theme="light"` en tiempo real

### 2026-06-04: New prediction modal design (dark theme, collapsible sections, chips, JSON preview)

**Qué:** Se reemplazó el modal de predicción antiguo (info grid + filas dinámicas con datalist) por un diseño oscuro moderno con secciones colapsables, barra de metadatos, chips de validación, preview JSON y animaciones.

**Nuevo modal (`predictFromModel()` ~1325-1592):**
- **Topbar** con modelo ID + toggle "Modo experto" que oculta la barra de metadatos y JSON preview
- **Meta strip** en 6 columnas: Algoritmo, Dataset, Guardado, Numéricas/Categóricas, Target, Tipo
- **Secciones colapsables** para features numéricas y categóricas con chevron animado, contadores de campos y botón "Agregar"
- **Campos en grid 3 columnas** con label truncado, input numérico/select, y botón eliminar con hover reveal
- **Área de análisis semántico** (textarea opcional)
- **JSON preview** con syntax highlighting (cyan) y fondo tenue
- **Chips de validación** dinámicos: conteo de campos, detección de valores vacíos
- **Action bar sticky** con botón Cancelar + Predecir con spinner y animación
- **Result overlay** con dashboard de predicción integrado (mismo estilo que el modal principal)

**Nuevas funciones auxiliares:**
- `getPredictModalCSS()` (~1594-1669): ~75 líneas de CSS scoped con clase `.pd-*`, diseño oscuro (#0e141b), tipografía IBM Plex Sans/Mono
- `buildPredictModalHTML()` (~1672+): Renderiza el HTML completo del modal con metadatos del modelo

**Mejoras UX:**
- Animaciones de entrada (opacity fade-in en filas nuevas)
- Animación de eliminación (scale + opacity)
- Secciones expandidas por defecto para numéricas y categóricas
- Cierre con click fuera del modal o tecla Escape
- Botón "Nueva predicción" en el result overlay

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:1325-1592` | `predictFromModel()` reemplazado completamente (~268 líneas, -73 líneas netas) |
| `js/pages/ml.js:1594-1669` | Nueva función `getPredictModalCSS()` |
| `js/pages/ml.js:1672+` | Nueva función `buildPredictModalHTML()` |

### 2026-06-04: Switched to Groq cloud — file-based API keys, multiple providers

**Qué:** Se configuraron proveedores cloud (Groq, DeepInfra) con API keys desde archivos locales para evitar commits de secrets.

**`opencode.json`:**
- Provider principal: `groq` con `llama-3.3-70b-versatile` (modelo grande) y `llama-3.1-8b-instant` (small)
- Provider secundario: `deepinfra` con `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`
- Fallback: `ollama` con `qwen2.5-coder:0.5b`
- API keys referenciadas como `{file:/home/fernando/.config/opencode/groq-key}` y `{file:.../deepinfra-key}` (absoluto)

**Archivos de key:**
| Archivo | Permisos |
|---------|----------|
| `~/.config/opencode/groq-key` | 56 bytes, `chmod 600` |
| `~/.config/opencode/deepinfra-key` | 32 bytes, `chmod 600` |

**Fix critical:** `{env:GROQ_API_KEY}` no resolvía en contexto de opencode. Cambiado a `{file:/...}` absoluto.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `opencode.json` | Providers, modelos, API keys, instrucciones |
| `~/.config/opencode/groq-key` | Nuevo — Groq API key |
| `~/.config/opencode/deepinfra-key` | Nuevo — DeepInfra API key |

### 2026-05-29: Persistencia de sesión de firma (cambio de página + hard reset)

**Qué:** Se implementó persistencia del estado de firma de reportes en `localStorage`. Ahora al cargar un reporte HTML para firmar, si el usuario cambia de página o hace hard reset (F5), la sesión de firma no se pierde. Al volver a la página "Firmar Reporte", la sesión se restaura automáticamente.

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx.js:3816-3861` | Nuevas funciones: `firmaPersistState()`, `firmaClearState()`, `firmaHasPersistedState()`, `firmaRestoreState()` |
| `js/core/indexx.js:3863` | `initFirmarReportePage()` modificada: verifica estado persistido antes de resetear |
| `js/core/indexx.js:4007` | `firmaHandleFile()` persiste estado al cargar reporte |
| `js/core/indexx.js:4132` | `firmaVerify()` persiste estado después de cada firma exitosa |
| `js/core/indexx.js:4115` | `firmaDownload()` limpia estado al descargar |

**Keys de localStorage:** `__firma_current_html`, `__firma_signature_data`, `__firma_signature_state`, `__firma_original_name`

**Comportamiento:**
- Cargar reporte → se persiste a localStorage
- Firmar una sección → se actualiza persistencia
- Cambiar de página → session preservada, se restaura al volver
- Hard reset (F5) → session preservada, se restaura al cargar
- Descargar reporte firmado → se limpia localStorage
- Estado corrupto → fallback a init normal con limpieza automática

**Riesgo:** Bajo (solo se añaden reads/writes a localStorage con try/catch y validación de datos)

### 2026-05-29: Migración Backend Node.js Render → Fly.io + Supabase PostgreSQL

**Qué:** Backend Express migró de Render (`proyecto-sigmaproxvl.onrender.com`) a Fly.io (`sigmaproxvl-backend.fly.dev`). Se configuró `DATABASE_URL` apuntando a Supabase PostgreSQL (session pooler, puerto 5432).

**Por qué:** Render free tier excedido. Se migró todo a Fly.io. El backend ahora usa PostgreSQL en vez del JSON store local cuando `DATABASE_URL` está definida.

**Usuarios en Supabase:**
| id | username | role |
|----|----------|------|
| 2 | d.jimenez | analista |
| 3 | f.nina | admin |
| 4 | a.ozuna | analista |
| 5 | a.h | user |
| 6 | a.nina | analista |
| 7 | c.nina | user |
| 9 | m.aguero | supervisor |
| 12 | admin | admin |

**Contraseñas conocidas:**
- `admin`/`admin123`
- `f.nina`/`1234`

**Archivos creados:**
| Archivo | Propósito |
|---------|-----------|
| `backend/Dockerfile` | Node 18-slim, expone 3000 |
| `backend/.dockerignore` | Excluye node_modules, .git, .env |

**Archivos modificados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/utils.js:12` | `API_URL` → `https://sigmaproxvl-backend.fly.dev` |
| `database.js:10` | `USE_PG = !!process.env.DATABASE_URL` (PostgreSQL vs JSON store) |

**Secrets en Fly.io:**
| Secret | Valor |
|--------|-------|
| `DATABASE_URL` | `postgresql://postgres.qfzrhlajliyqtjesixdh:m6fLLxl1pNWzdGUO@aws-0-us-west-2.pooler.supabase.com:5432/postgres` |
| `JWT_SECRET` | (generado) |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `admin123` |
| `ML_SERVICE_URL` | `https://sigmapro-ml.fly.dev` |

**Problemas resueltos:**
1. Conexión directa a `db.*.supabase.co` fallaba con `ECONNREFUSED` (IPv6 bloqueado por Supabase)
2. Session pooler (`pooler.supabase.com:5432`) funciona correctamente
3. Admin no se creaba automáticamente por falta de secrets `ADMIN_USERNAME`/`ADMIN_PASSWORD` → se insertó manualmente vía SQL directo
4. CORS configurado manualmente en server.js (sin librería `cors`) — funciona con GitHub Pages

**Costo estimado:** ~$1.94/mes (shared-cpu-1x, 1GB RAM, auto-stop)

### 2026-05-29: Migración ML Service Render → Fly.io

**Qué:** ML Service migró de Render (`sigmapro-ml.onrender.com`) a Fly.io (`sigmapro-ml.fly.dev`). Se renombró `Red Neuronal/` → `Red_Neuronal/`.

**Por qué:** Render free tier (750h/mes) agotado. Espacio en ruta causaba error en builder de Fly.io.

**Archivos:** `ml_service/Dockerfile`, `ml_service/main.py` (puerto 8080), `Red_Neuronal/` (renombrado), `indexx.html:312` (ML_API_URL actualizado)

### 2026-05-24: Dataset entrenamiento_mpg.csv + Fix predicciones ML

### 2026-05-22: Fase 1-3 — Reorganización CSS (raíz → css/core/ + css/pages/) y JS (raíz → js/core/ + js/managers/ + js/pages/)

### 2026-05-22: Múltiples fixes — IC95 t-critical, Chi-cuadrado, sidebar collapse, ribbon nav popup, EDA integration

## Features menores agregadas
- **Zoom persistence**: `document.body.style.zoom` + `localStorage` (zoomIn, zoomOut, applyZoom en `indexx.js:841-849`)
- **Ctrl+B / Cmd+B**: toggle sidebar
- **Toast fix**: `text-align:center` + inner span en vez de `transform:translateX(-50%)`
- **SheetJS CDN**: agregado en `indexx.html:10`
- **Compactación sidebar**: "Estado" arriba de "Recientes"; Recientes scrollable
- **4 blank-replicate limit tests** (LOD, LOQ, LQC, MDL) + **4 calibration curve tests** en `estadisticosConfig.js`
- **EDA button**: movido de sidebar a top menú

## Diferencia clave con Render
Render inyectaba el `PORT` como variable de entorno; Fly.io también (`process.env.PORT`). El backend escucha en `0.0.0.0:${PORT}`. ML Service escucha en `0.0.0.0:${PORT:-8080}`.

## Archivos relevantes
| Archivo | Propósito |
|---------|-----------|
| `backend/server.js` | Express API, auth JWT, CORS manual, health check |
| `backend/database.js` | PostgreSQL (DATABASE_URL) / JSON store (local) |
| `backend/data.json` | JSON store legacy (solo admin) |
| `backend/Dockerfile` | Build de backend para Fly.io |
| `ml_service/main.py` | FastAPI ML endpoints |
| `ml_service/Dockerfile` | Build de ML Service para Fly.io |
| `fly.toml` | Config Fly.io (backend, puerto 3000) |
| `.dockerignore` | Excluye todo excepto backend/ |
| `js/core/utils.js` | API_URL condicional |
| `js/core/auth.js` | Autenticación JWT |
| `js/core/indexx.js` | Shell app, menús, zoom, shortcuts |
| `js/core/EstadisticaDescriptiva.js` | Motor estadístico (6,562 líneas) |
| `js/core/estadisticosConfig.js` | Config de tests (8 limit tests incluidos) |
| `js/managers/ReporteManager.js` | Generación de reportes TXT/HTML |
| `js/pages/ml.js` | Frontend ML Analysis |

## Próximos pasos
1. ~~Fase 1 — Pipeline ML v2~~ ✅
2. ~~Fase 2 — UX de entrenamiento~~ ✅
3. ~~Fase 3 — Async tasks + dataset loading~~ ✅
4. **Fase 4 — Model Registry + Versioning:** versionado de experimentos, nunca sobreescribe, dataset fingerprinting
5. **Fase 5 — Drift monitoring:** endpoint POST /api/ml/drift/<id>, monitor programado en Fly.io Worker
6. Limpiar archivos temporales: `fly.txt`, `supabase.png`
7. Resetear contraseñas de usuarios restantes (d.jimenez, a.ozuna, a.h, a.nina, c.nina, m.aguero)
8. Redeploy ML Service en Fly.io para activar Fase 3 endpoints

---

### 2026-06-24: Gaming setup + boot optimizations + sysctl fix

**Qué:** Se instalaron emuladores de juegos, se optimizó el boot para <10s, y se corrigieron permisos de DATOS 2.

**Emuladores instalados:**
| Paquete | Propósito |
|---------|-----------|
| `ryujinx` | Emulador Nintendo Switch (Smash Ultimate, etc.) |
| `dolphin-emu` | Emulador GameCube/Wii (Smash Melee, Brawl) |

**Gaming stack adicional instalado (sesión anterior):**
| Paquete | Propósito |
|---------|-----------|
| `steam` + `steam-devices` | Tienda/lanzador |
| `proton-cachyos-slr` | Proton optimizado CachyOS |
| `wine` + `wine-cachyos-opt` | Wine doble (stock + optimizado) |
| `winetricks` + `protontricks` | Gestión de prefijos |
| `lutris` | Lanzador multi-plataforma |
| `heroic-games-launcher-bin` | Launcher Epic/GOG |
| `gamescope` | Micro-compositor gaming |
| `mangohud` + `lib32-mangohud` | Overlay rendimiento |
| `goverlay` | GUI para MangoHud |

**Directorios de juegos creados:**
- `/mnt/datos2/Games/Switch/` — ROMs de Switch
- `/mnt/datos2/Games/GameCube/` — ROMs de GameCube
- `/mnt/datos2/Games/Wii/` — ROMs de Wii
- `/mnt/datos2/Games/ROMs/` — ROMs generales

**Boot optimizations (para <10s):**
| # | Cambio | Ahorro estimado |
|---|--------|----------------|
| 1 | GRUB timeout: 5s → **1s** | ~2.5s |
| 2 | NM-wait-online: enabled → **masked** | ~3.3s |
| 3 | `tpm_tis.interrupts=0` en kernel cmdline | ~3.2s |
| 4 | `8250.nr_uarts=0` en kernel cmdline | ~3.1s |
| 5 | `nowatchdog` ya estaba configurado | — |

**Fixes:**
- **systemd-sysctl fix**: `net.core.netdev_budget_usecs = 300` era inválido en kernel BMQ+LTO (mínimo 2000). Se eliminó la línea de `/etc/sysctl.d/99-network-latency.conf`. Ahora `sysctl --system` aplica sin errores.
- **Permisos DATOS 2**: `/mnt/datos2` cambiado de `root:root` a `fernando:fernando` para permitir escritura.

**Archivos afectados (sistema, no proyecto):**
| Archivo | Cambio |
|---------|--------|
| `/etc/default/grub` | GRUB_TIMEOUT=1, +tpm_tis.interrupts=0 +8250.nr_uarts=0 |
| `/boot/grub/grub.cfg` | Regenerado |
| `/etc/sysctl.d/99-network-latency.conf` | Eliminada línea netdev_budget_usecs inválida |
| `/mnt/datos2` | chown a fernando:fernando |
| `/mnt/datos2/Games/` | Directorios creados |
| (systemd) | `NetworkManager-wait-online.service` masked |

**Verificación:** ✅ `sysctl --system` sin errores | ✅ GRUB regenerado con cmdline correcto | ✅ Sin servicios fallidos | ✅ Ryujinx 1.3.3 + Dolphin 2603 instalados | ✅ Todos los mounts OK | ✅ Red OK (ping 35ms)

### 2026-06-29: Fase 4 — Model Registry + Versioning (Model Manager, API, Frontend)

**Qué:** Implementación completa de versionado formal de modelos ML con esquema de IDs versionados, lineage, promoción, rollback y comparación side-by-side.

**Cambios en 3 capas:**

**Capa 1 — `Red_Neuronal/model_manager.py` (refactor completo):**
- **ID scheme**: `modelo_NNN` → `{model_key}/v{N}` (ej: `rf/v1`, `xgb/v2`, `mlp/v3`)
- **`_generate_model_id(model_key)`**: Genera auto-incremento por tipo de modelo
- **`_parse_model_id(model_id)`**: Parseo seguro de IDs versionados
- **`version_parent`**: Cada nueva versión guarda referencia a la versión inmediatamente anterior del mismo model_key
- **`promoted: bool`**: Primera versión se marca como promoted por defecto
- **`list_versions(model_key)`**: Lista todas las versiones de un mismo tipo de modelo
- **`get_promoted(model_key)`**: Obtiene la versión en producción
- **`promote_version(model_id)`**: Quita promoted de todas las versiones del mismo model_key y marca la seleccionada
- **`rollback_to(model_key, target_version)`**: Rollback a versión anterior o específica
- **`compare_versions(model_ids)`**: Compara métricas de N versiones, retorna dict plano
- **`print_models_table()`**: Incluye columnas `Versión` y `Prom.`
- **`interactive_menu()`**: Acepta IDs con formato `{key}/v{N}`
- **Backwards compatible**: IDs antiguos `modelo_NNN` aún existen en registro pero no reciben nuevas versiones

**Capa 2 — `ml_service/main.py` (5 nuevos endpoints):**
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/ml/models/{key}/versions` | GET | Lista versiones de un model_key |
| `/api/ml/models/{key}/promoted` | GET | Obtiene versión promovida |
| `/api/ml/models/{key}/promote` | POST | Promueve una versión |
| `/api/ml/models/{key}/rollback` | POST | Rollback a versión anterior |
| `/api/ml/models/compare` | POST | Compara N versiones side-by-side |

- Modelos Pydantic: `PromoteRequest`, `CompareRequest`, `RollbackRequest`
- `MODEL_KEY_RE` agregado para validación de model_key

**Capa 3 — `js/pages/ml.js` (frontend versiones):**
- Nueva pestaña **"◎ Versiones"** en el Model View (5to tab)
- **Timeline de versiones**: lista con versión, dataset, fecha, métricas, badges PROD/ACTUAL
- **Botón ▲ Promover**: aparece en versiones no-promovidas
- **Botón ↩ Rollback**: aparece en la versión promovida actual
- **Tabla comparativa**: cuando hay ≥2 versiones, se muestra tabla con métricas side-by-side y resaltado del mejor valor en verde
- Funciones públicas: `promoteVersion(modelId, modelKey)`, `rollbackVersion(modelKey)`
- Carga asíncrona de versiones al hacer clic en el tab

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `Red_Neuronal/model_manager.py` | **Reescrito**: 377→420 líneas. Nuevo ID scheme, version_parent, promoted, list_versions, get_promoted, promote_version, rollback_to, compare_versions |
| `ml_service/main.py` | +75 líneas: 5 nuevos endpoints, 3 modelos Pydantic, MODEL_KEY_RE |
| `js/pages/ml.js` | +200 líneas: 5to tab Versiones, timeline, promote/rollback buttons, tabla comparativa, load/promote/rollback functions |

**Riesgo de rotura:** BAJO — IDs antiguos `modelo_NNN` coexisten sin modificación. Backend backward compatible. Frontend solo agrega nuevo tab, no modifica tabs existentes.

### 2026-06-29: Fase 5 — Drift Monitoring (Data/Concept Drift Detection)

**Qué:** Sistema completo de monitoreo de deriva de datos para modelos ML en producción. Detecta cambios en la distribución de features entre los datos de entrenamiento y los nuevos datos.

**Capa 1 — `Red_Neuronal/drift_detector.py` (NUEVO):**
| Función | Descripción |
|---------|-------------|
| `_psi(expected, actual, buckets=10)` | Population Stability Index: PSI < 0.1 = sin cambio, 0.1-0.25 = moderado, > 0.25 = severo |
| `_ks_statistic(expected, actual)` | Kolmogorov-Smirnov test aproximado con D statistic y p-value |
| `_chi2_cramers(observed, expected, categories)` | Chi-cuadrado + V de Cramér para variables categóricas |
| `detect_drift(model_id, reference_df, new_df, meta)` | Orquestador: itera numéricas (KS+PSI) y categóricas (Chi²), genera severidad global |
| `save_drift_check(base_dir, model_id, result)` | Persiste chequeo en `drift_history.json` |
| `get_drift_history(base_dir, model_id, limit=20)` | Recupera historial (últimos 100 checks máx) |

**Criterios de severidad por feature:**
| Severidad | Numéricas | Categóricas |
|-----------|-----------|-------------|
| high | PSI > 0.25 o D > 0.3 | Cramér's V > 0.3 |
| medium | PSI > 0.1 o D > 0.2 | Cramér's V > 0.15 |
| low/none | PSI ≤ 0.1 | Cramér's V ≤ 0.15 |

**Capa 2 — `ml_service/main.py` (2 nuevos endpoints):**
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/ml/drift/{model_id}` | POST | Ejecuta chequeo de drift contra datos nuevos. Usa datos del dataset original como referencia (vía `load_data`), o columnas del meta. Persiste resultado en historial. |
| `/api/ml/drift/{model_id}/history` | GET | Historial de drift checks (limit param, default 20, max 100) |

**Capa 3 — `ml_service/drift_worker.py` (NUEVO):**
- Script programable para ejecución periódica (cron/6h)
- Itera modelos promovidos y ejecuta drift check contra sus datos de entrenamiento
- Reporta alertas por consola (capturadas en Fly.io logs)
- Summary final con conteo de checks, alerts por severidad

**Capa 4 — `js/pages/ml.js` (frontend drift UI):**
- **Nuevo tab "◉ Drift"** en el Model View (6to tab)
- **Indicador global**: badge con severidad (verde/amarillo/naranja/rojo) + PSI promedio + conteos
- **Tabla por feature**: nombre, tipo (num/cat), badge severidad, barra PSI, valores detalle (KS, medias, Δ%, Cramér V)
- **Historial**: timeline de chequeos previos con severidad, PSI, features chequeadas
- **Botones**: 🔍 Ejecutar chequeo (usa datos de hoja de trabajo actual), 📊 Historial
- Botones también replicados en la cabecera de acciones del modelo

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `Red_Neuronal/drift_detector.py` | **NUEVO** — 293 líneas: PSI, KS-test, Chi², detect_drift, persistencia, historial |
| `ml_service/main.py` | +75 líneas: 2 endpoints drift, DriftRequest model, HAS_DRIFT flag |
| `ml_service/drift_worker.py` | **NUEVO** — 127 líneas: worker programable para chequeo periódico |
| `ml_service/requirements.txt` | +1 línea: `scipy>=1.10.0` |
| `js/pages/ml.js` | +250 líneas: tab Drift, _renderDriftResults, _renderDriftHistory, _mvCheckDrift, checkDrift/loadDriftHistory públicos, CSS drift |

**Riesgo de rotura:** BAJO — drift_detector.py tiene HAS_DRIFT flag con graceful fallback si no se puede importar. Nuevo tab no modifica tabs existentes. Worker es standalone.

### 2026-06-29: Fix — checkDrift no detectaba datos de la hoja de trabajo

**Qué:** El botón "🔍 Ejecutar chequeo" en el tab Drift mostraba "No hay datos en la hoja de trabajo actual" aunque sí hubiera datos cargados.

**Causa:** `checkDrift()` en `js/pages/ml.js` verificaba propiedades `wsData.data` y `wsData.columns`, pero `getCurrentSheet()` devuelve un objeto con `rows` y `headers`. La condición nunca se cumplía.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/pages/ml.js:3305-3306` | Fix: `wsData.data` → `wsData.rows`, `wsData.columns` → `wsData.headers` |

**Riesgo:** MUY BAJO — solo cambio de nombres de propiedad en 2 líneas.

### 2026-06-30: Reporte .html — tabla de valores fuera de especificación

**Qué:** El reporte HTML ahora lista los valores específicos que están fuera de especificación (límites configurados), mostrando fila, valor, especificación excedida y diferencia.

**Cambios:**
- **`ParametrosManager.js:64-116`** — `verificarColumna()` ahora recibe `data.headers` para resolver columna por nombre, retorna `detalles[]` con cada valor fuera de rango (`fila`, `valor`, `especExcedida`, `valorEsperado`, `diferencia`)
- **`ReporteManager.js`** — Dos nuevas tablas de detalle:
  1. En sección **PARÁMETROS DE CONTROL** (tras cumplimiento): tabla con `Fila | Valor | Especificación excedida (Mínimo/Máximo) · Δ`
  2. En sección **ESPECIFICACIONES DEL USUARIO** (sidebar LS/LI): tabla con `Fila | Valor | LS/LI excedido · Δ`
  - Cada fila violada se muestra con el valor real, el límite que excedió y la diferencia (+/−)

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ParametrosManager.js:64-116` | `verificarColumna()` usa `headers.indexOf()` para acceso correcto a filas; retorna `detalles[]` con cada valor fuera de especificación |
| `js/managers/ReporteManager.js:1153-1159` | Nueva tabla de detalle en PARÁMETROS DE CONTROL |
| `js/managers/ReporteManager.js:1205-1211` | Nueva tabla de detalle en ESPECIFICACIONES DEL USUARIO |

**Riesgo:** BAJO — cambios aditivos (nuevos campos en objeto de retorno, HTML condicional). No se modifica lógica existente de análisis ni generación de datos.

### 2026-07-04: Fix RAÍZ — eliminar Paged.js del screen, reporte full-width nativo

**Qué:** Todos los fixes previos del ancho fallaban porque **Paged.js ES el problema**: su propósito es aplicar `@page{size:A4}` en screen, creando páginas de 794px de ancho. Cualquier fix post-render pelea contra el core de la librería y siempre pierde.

**Solución definitiva:**
1. **Eliminado** `<script src="paged.polyfill.js">` del HTML — Paged.js ya no se carga en screen
2. Movido `@page{margin:1.2cm;size:A4;...}` **dentro de `@media print`** — solo aplica al imprimir/PDF
3. Eliminado todo el CSS/JS anti-ancho (líneas obsoletas: `body{visibility:hidden}`, `@media screen{...}`, script MutationObserver/ResizeObserver/interval)
4. TOC handler actualizado con **fallback a `document.getElementById(id)`** para funcionar sin Paged.js (antes solo buscaba por `[data-id]`)
5. Añadido botón 🖨️ Imprimir / PDF flotante (esquina inferior derecha)

**Cómo funciona ahora:**
- **Screen:** reporte ocupa 100% del ancho, scroll vertical, sin paginación
- **Imprimir (Ctrl+P o botón 🖨️):** navegador aplica `@page{size:A4; margin:1.2cm}` nativamente con números de página

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:1301-1320` | `@page` movido dentro de `@media print` |
| `js/managers/ReporteManager.js:1322-1328` | Eliminados: `</style>`, script Paged.js, CSS obsoleto, script anti-ancho |
| `js/managers/ReporteManager.js:1986` | TOC handler: `document.querySelector('[data-id]')` ahora con fallback `document.getElementById(id)` |
| `js/managers/ReporteManager.js:1987` | Nuevo: botón flotante 🖨️ Imprimir / PDF |

### 2026-07-04: Fix definitivo v3 — ancho reporte con ResizeObserver + interval 200ms

**Qué:** Tras 4 intentos previos de fix del ancho, el problema persistía por:
1. **Selectores JS incompletos**: solo se forzaba width en `.pagedjs_sheet,.pagedjs_page` pero no en `.pagedjs_pages`, `.pagedjs_pagebox`, `.pagedjs_pagearea`. Paged.js posiblemente setea inline style en `.pagedjs_pages` que el CSS `!important` no vence.
2. **MutationObserver se desconectaba**: detectaba el primer `.pagedjs_sheet` y se desconectaba, dejando elementos creados después sin override.
3. **Paged.js sobrescribe post-render**: aplica inline style después de que el observer corre.

**Fix v2 (línea 1328):**
- Selectores incluyen TODOS: `.pagedjs_pages,.pagedjs_sheet,.pagedjs_page,.pagedjs_pagebox,.pagedjs_pagearea`
- `setInterval` persistente: 20 intentos cada 500ms
- MutationObserver **no se desconecta** hasta 15s
- Re-aplica width 100ms después del evento `rendered` de Paged.js

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:1328` | Script persistente con interval + observer + todos los selectores |

### 2026-07-04: Fix — navegación del TOC rota por Paged.js

**Qué:** Paged.js v0.4.3 elimina el atributo `id` del DOM durante la paginación y lo mueve a `data-id`. Al hacer clic en `<a href="#sec02">`, el navegador buscaba `id="sec02"` y no lo encontraba.

**Fix:** Event delegation en `document` con `e.target.closest('.toc-entry')` — navega por `[data-id]`.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:1992` | Direct listeners → event delegation |

### 2026-07-04: Formato fecha firma electrónica

**Qué:** La fecha que se inserta al firmar electrónicamente un reporte usaba formato largo `toLocaleDateString('es-ES')` que producía cadenas como "4 de julio de 2026 3:45 p. m.".

**Fix:** Cambiado a formato corto `dd/Mon/aaaa hh:mm a.m./p.m.` (ej: `04/Jul/2026 03:45 p.m.`).

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-firma.js:494-496` | Reemplazado `toLocaleDateString` por construcción manual con `padStart` + `a.m./p.m.` |

### 2026-07-04: Fix — botón Imprimir aparece en previsualización de impresión

**Qué:** El botón flotante 🖨️ Imprimir / PDF se mostraba en el diálogo de previsualización de impresión del navegador (`Ctrl+P`), tapando contenido y rompiendo la maquetación A4.

**Fix:** Se agregó `id="printButton"` al contenedor del botón y `#printButton{display:none!important}` dentro de `@media print`.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:1320` | Agregado `#printButton{display:none!important}` en `@media print` |
| `js/managers/ReporteManager.js:1988` | Agregado `id="printButton"` al `<div>` contenedor del botón |

### 2026-07-04: Feat — persistencia del formulario de reporte + alerta de sobrescritura + botón limpiar

**Qué:** Tres mejoras en la página de reportes:
1. **Persistencia:** Los campos del formulario (`rep-org`, `rep-dept`, `rep-modelo`, `rep-serie`, etc.) ahora se guardan automáticamente en `localStorage.__report_form_state` al cambiar cualquier campo, al recargar la página (`beforeunload`), y al regenerar la vista.
2. **Alerta de sobrescritura:** Al clickear "Enviar a firma", si existe un reporte firmado previo en `localStorage.__firma_current_html`, muestra un `confirm()` nativo ofreciendo descargar el reporte existente antes de que sea reemplazado.
3. **Botón Limpiar:** Nuevo botón "🧹 Limpiar formulario" en la barra lateral que borra todos los campos y elimina `__report_form_state` de localStorage.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:2034-2042` | `_saved` ahora se inicializa desde `localStorage` y se persiste |
| `js/managers/ReporteManager.js:2218-2219` | Restauración de `rep-include-all-charts` desde `_saved` |
| `js/managers/ReporteManager.js:2250-2263` | Auto-save en tiempo real (`input`/`change`/`beforeunload`) vía `_saveFormState` |
| `js/managers/ReporteManager.js:2267-2275` | Alerta `confirm()` si existe `__firma_current_html` antes de enviar a firma |
| `js/managers/ReporteManager.js:2419` | Botón "🧹 Limpiar formulario" en sidebar |

### 2026-07-04: Feat — ID del documento en esquina inferior derecha de cada página impresa

**Qué:** El identificador del documento (`RPT-{hash}`) ahora aparece en el margen inferior derecho de cada página al imprimir o generar PDF del reporte HTML, al mismo nivel que los números de página en el centro.

**Cómo:** Se agregó `@bottom-right{content:"RPT-${hash}"}` dentro de la regla `@page` en `@media print`. El hash se incrusta como string literal en CSS (generado estáticamente), lo que funciona en Chrome y Firefox (`content: string()` no tiene soporte en Chrome).

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:1319` | Agregado `@bottom-right{content:"RPT-${hash}"}` en `@page` |

### 2026-07-04: Fix — encabezado de Notas Metodológicas no se repetía al imprimir en múltiples páginas

**Qué:** La sección "06 Notas Metodológicas" del reporte HTML perdía su encabezado cuando el contenido ocupaba más de una página impresa.

**Fix:** Se envolvió la sección en un `<table class="sec-repeat-table">` con el título en `<thead>`. Los navegadores repiten `<thead>` de forma nativa en cada página al imprimir.

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/managers/ReporteManager.js:1300` | CSS `.sec-repeat-table{width:100%;border-collapse:collapse}` |
| `js/managers/ReporteManager.js:1474-1536` | sec06 envuelta en `<table><thead><tbody>` para repetición del header |
| `js/managers/ReporteManager.js:1926-1955` | sec07 (Pruebas de Hipótesis) — título en `<thead>` con colspan, nota H₀ en `<tbody>` |
| `js/managers/ReporteManager.js:1972-1985` | sec08 (Gráficos) — título en `<thead>`, contenido en `<tbody>` |

### 2026-07-04: Fix — gráficos de datasets anteriores aparecían en el reporte actual

**Qué:** Al generar un reporte para un dataset, se incluían gráficos creados para datasets anteriores porque la galería `_V.gallery` no discriminaba por origen de datos. Esto producía reportes con gráficos que no correspondían al análisis actual.

**Fix:**
1. Al guardar un gráfico (`indexx-viz.js:892`), se almacena `sourceFile: datosCurrentFileName || ''` para registrar el dataset de origen.
2. En `getGraficosParaReporte()` (`indexx-viz.js:270`), se filtra: si hay un dataset actual (`datosCurrentFileName`) y el gráfico tiene `sourceFile` de otro dataset, se omite.
3. Gráficos antiguos (sin `sourceFile`) se incluyen siempre (retrocompatibilidad).

**Archivos afectados:**
| Archivo | Cambio |
|---------|--------|
| `js/core/indexx-viz.js:892` | Agregado `sourceFile: datosCurrentFileName \|\| ''` al guardar gráfico |
| `js/core/indexx-viz.js:267,270` | Filtro `if (currentFile && g.sourceFile && g.sourceFile !== currentFile) return;` |
