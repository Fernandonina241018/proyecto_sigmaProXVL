# 01 — Proyecto: StatAnalyzer Pro

## Identidad

- **Nombre:** StatAnalyzer Pro
- **Tipo:** Aplicación web de análisis estadístico — cliente 100% (sin backend)
- **Stack:** JavaScript ES6+ vanilla, HTML5, CSS3
- **Entorno:** Navegador (no Node en producción)
- **Sin frameworks UI** (no React, no Vue). DOM nativo.

---

## Arquitectura de archivos

```
StatAnalyzer Pro/
│
├── index.html                        # Entry point
│
├── app.js                           # App principal
├── script.js                        # Lógica principal UI (~4200 líneas)
├── StateManager.js                  # Gestión de estado
│
├── EstadisticaDescriptiva.js        # IMPLEMENTACIONES (~5660 líneas)
│                                    # Todas las funciones calcular*
│
├── ReporteManager.js               # Generación de reportes HTML/TXT/PDF
│
├── estadisticosConfig.js            # CONFIG CENTRALIZADA — 51 tests, 9 secciones
│                                    # Exporta: ESTADISTICOS_CONFIG + helpers
│
├── StatsUtils.js                   # Utilidades estadísticas
│
├── Visualizacion.js                # Gráficos y visualizaciones
│
├── EDAManager.js                   # MOTOR EDA AUTOMÁTICO
│
├── DatosManager.js                 # Manejo de datos
├── TrabajoManager.js                # Gestión de hojas de trabajo
├── UsuariosManager.js               # Gestión de usuarios
├── PermisosManager.js              # Permisos y Roles
├── ParametrosManager.js            # Parámetros de calidad
├── AuditoriaManager.js             # Auditoría de acciones
│
├── auth.js                         # Autenticación
├── Logger.js                       # Logging
│
├── utils.js                        # Utilidades generales
│
├── dist/                          # Archivos compilados/minificados
│
├── backend/                       # Servidor Node.js (solo para persistencia)
│
└── Brain/                        # Documentación del agente
```

---

## Módulos críticos: contratos

### `estadisticosConfig.js`
- **Fuente de verdad** de todo el sistema. No implementa lógica, solo describe.
- `ESTADISTICOS_CONFIG`: objeto con 51 entradas
- Helpers exportados globalmente (`window.*` y `module.exports`):

| Helper | Retorna | Uso |
|---|---|---|
| `getSeccionesSidebar()` | `{seccion: {icon, label, options[]}}` | Renderizar sidebar |
| `getEstadisticosList()` | `string[]` | Lista de nombres |
| `getStatMetaConfig()` | `{nombre: {formula, desc, hipotesis...}}` | Panel info/ayuda |
| `getEstadisticoConfig(nombre)` | `config` o `null` | Config individual |
| `getEstadisticosPorSeccion(sec)` | `string[]` | Filtrar por sección |
| `getEstadisticosEDA()` | `{edaKey: nombre}` | Mapa para EDAManager |
| `getEstadisticosDobleColumna()` | `string[]` | UI: deshabilitar opciones |
| `getNivelAlfa(nombre)` | `number` (def. 0.05) | Umbral para reportes |
| `buildInterpretacion(n, sig, vals)` | `string` | Texto de reporte |

### `EstadisticaDescriptiva.js`
- Cada método nombrado como `calcularXxx` o `detectarXxx`.
- **Contrato de retorno:** objeto plano `{}` con las claves listadas en `config.salidas[]`.
- No lanza excepciones: retorna `{ error: string }` en caso de fallo.
- Validación interna: verificar `n >= config.minMuestra` antes de calcular.

### `script.js` — Funciones globales clave

| Función | Descripción |
|---|---|
| `ejecutarAnalisis()` | Ejecuta todos los análisis seleccionados |
| `mostrarResultados(html)` | Renderiza resultados en el DOM |
| `getDataForModal()` | Obtiene datos actualmente cargados |
| `StateManager.getActiveStats()` | Obtiene stats seleccionados |
| `StateManager.getHypothesisConfig()` | Obtiene config de pruebas de hipótesis |
| `switchView(vista)` | Cambia entre vistas |

---

## Flujo de datos en el UI

```
Usuario carga datos (CSV/Excel)
      ↓
script.js detecta columnas disponibles
      ↓
getEstadisticosDobleColumna() → deshabilita tests que necesitan 2 cols
      ↓
Usuario selecciona test(s)
      ↓
Modal de configuración (si es hipótesis o multivariado)
      ↓
StateManager.setHypothesisConfig() guarda configuración
      ↓
ejecutarAnalisis() → EstadisticaDescriptiva.ejecutarAnalisis()
      ↓
generarHTML() → ReporteManager genera visualización
      ↓
Renderiza resultado + metadatos
```

---

## Secciones del UI (9)

| Key | Label | Tests | Estado |
|---|---|---|---|
| `descriptiva` | Descriptiva | 13 | ✅ |
| `hipotesis` | Hipótesis | 11 | ✅ |
| `correlacion` | Correlación | 4 | ✅ |
| `regresion` | Regresión | 7 | ✅ |
| `noParametricos` | No Paramétricos | 5 | ✅ |
| `multivariado` | Multivariado | 5 | 2/5 ✅ |
| `extras` | Extras | 5 | 1/5 ✅ |
| `especificacion` | Especificación | 1 | ✅ |
| `calidad` | Calidad | 1 | ✅ |
| **Total** | | **51** | **44 ✅** |

---

## Estado Actual (Abril 2026)

- **Versión:** 2.5
- **Implementados:** 44 de 51 (88%)
- **Pendientes:** 6 (K-Medias, LDA, MANOVA, Series Temporales, Supervivencia, Bayesiano)
- **Compleción:** ~92%

---

## Features de UX

| Feature | Estado | Implementación |
|---------|--------|---------------|
| Tema claro/oscuro | ✅ | CSS variables + toggle en navbar |
| Keyboard shortcuts | ✅ | Ctrl+Shift+D/A/T/R/S, Ctrl+Z/Y, Escape, ? |
| Undo/Redo | ✅ | StateManager con historial (50 entries) |
| Tutorial in-app | ✅ | Modal step-by-step, 6 pasos, localStorage |
| Asistente de análisis | ✅ | Wizard guiado para pemilihan test |
| Importación drag-and-drop | ✅ | HTML5 File API |

---

## Atajos de Teclado

| Atajo | Acción |
|-------|-------|
| `Ctrl+Shift+D` | Toggle tema claro/oscuro |
| `Ctrl+Shift+A` | Abrir asistente de análisis |
| `Ctrl+Shift+T` | Ir a módulo Trabajo |
| `Ctrl+Shift+R` | Ir a módulo Reportes |
| `Ctrl+Shift+S` | Ir a módulo Estadísticos |
| `Ctrl+Z` | Deshacer última acción |
| `Ctrl+Y` | Rehacer acción |
| `Escape` | Cerrar todos los modales |
| `?` | Mostrar ayuda de atajos |

---

## Variables globales expuestas en `window`

Todos los módulos principales exponen funciones a `window`:
- `ESTADISTICOS_CONFIG`
- `getSeccionesSidebar()`, `getEstadisticosList()`, etc.
- `StateManager`, `ReporteManager`, `EstadisticaDescriptiva`
- `showToast()`, `formatDate()`, etc.

---

## Contexto de desarrollo

- Trabajo en sesiones iterativas: análisis profundo → archivo corregido completo.
- Revisiones cubren: bugs lógicos, XSS, configuración estadística incorrecta, CSS.
- Scripts Python usados para análisis estático entre sesiones.
- Sin test suite formal — validación manual + revisión de código.

---

## Para el Agente: Reglas de Oro

1. **Nunca usar `innerHTML` con valores del usuario** — usar `textContent`
2. **Siempre validar `minMuestra`** antes de calcular
3. **No mutar arrays de entrada** — usar spread `...datos`
4. **Retornar `{ error: string }`** en caso de fallo, nunca lanzar excepciones
5. **Las claves de retorno deben coincidir con `config.salidas[]`**
6. **Antes de modificar código, pedir análisis profundo**
7. **Al finalizar cambios relevantes, actualizar el Brain**
8. **Para nuevos features de UX, agregar a keyboard shortcuts si aplica**
