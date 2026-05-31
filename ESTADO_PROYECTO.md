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

## URLs activas
| Servicio | URL | Estado |
|----------|-----|--------|
| Frontend (GitHub Pages) | `https://fernandonina241018.github.io` | ✅ |
| Backend API | `https://sigmaproxvl-backend.fly.dev/api/health` | ✅ `database:"connected"` |
| ML Service | `https://sigmapro-ml.fly.dev/api/ml/health` | ✅ `{"ok":true}` |

## CAMBIOS RECIENTES

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
1. Verificar end-to-end: frontend → login → ML Analysis, Statistical Analysis, EDA
2. Limpiar archivos temporales: `fly.txt`, `supabase.png`
3. Commit y push
4. Resetear contraseñas de usuarios restantes (d.jimenez, a.ozuna, a.h, a.nina, c.nina, m.aguero)
