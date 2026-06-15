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
