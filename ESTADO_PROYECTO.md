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
