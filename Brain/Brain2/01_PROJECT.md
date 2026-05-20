# 01 — Proyecto

## Identidad

| Campo | Valor |
|-------|-------|
| Nombre | StatAnalyzer Pro |
| Tipo | Web estadística, cliente 100% |
| Stack | ES6+ vanilla, HTML5, CSS3 |
| UI | DOM nativo — sin React/Vue |
| Prod | Navegador · `backend/` solo persistencia |

**Ruta:** `G:\My Drive\SigmaProWeb\proyecto_sigmaProXVL\`

## Árbol de archivos

```
├── index.html, app.js
├── script.js                 # UI, modales, ejecutarAnalisis (~4200 L)
├── estadisticosConfig.js     # ESTADISTICOS_CONFIG — 51 tests
├── EstadisticaDescriptiva.js # calcular* / detectar* (~5660 L)
├── ReporteManager.js         # Reportes HTML/TXT/PDF
├── StateManager.js           # Estado, undo (50), hipótesis
├── StatsUtils.js, ValidacionesManager.js
├── Visualizacion.js, EDAManager.js, VizControls.js
├── DatosManager.js, TrabajoManager.js, UsuariosManager.js
├── PermisosManager.js, ParametrosManager.js, AuditoriaManager.js
├── auth.js, Logger.js, utils.js
├── dist/                     # Builds minificados
├── backend/                  # Node — persistencia
└── Brain/Brain2/             # Docs agente
```

## Módulos — contratos

### `estadisticosConfig.js` (solo describe, no calcula)

| Helper | Retorno | Uso |
|--------|---------|-----|
| `getSeccionesSidebar()` | `{seccion: {icon, label, options[]}}` | Sidebar |
| `getEstadisticosList()` | `string[]` | Nombres |
| `getStatMetaConfig()` | metadatos | Ayuda |
| `getEstadisticoConfig(n)` | config \| null | Individual |
| `getEstadisticosPorSeccion(sec)` | `string[]` | Filtro |
| `getEstadisticosEDA()` | mapa EDA | EDAManager |
| `getEstadisticosDobleColumna()` | `string[]` | UI 2 cols |
| `getNivelAlfa(n)` | number (0.05 def.) | Reportes |
| `buildInterpretacion(n, sig, vals)` | string | Texto reporte |

Export: `window.*` + `module.exports` condicional.

### `EstadisticaDescriptiva.js`

- Métodos: `calcularXxx`, `detectarXxx`
- Retorno: `{}` con claves ∈ `config.salidas[]` + `n`
- Error: `{ error, codigo }` — sin `throw`
- Validar `minMuestra` / `maxMuestra` antes de calcular

### `script.js` — globals UI

| Función | Rol |
|---------|-----|
| `ejecutarAnalisis()` | Ejecuta tests seleccionados |
| `mostrarResultados(html)` | DOM resultados |
| `getDataForModal()` | Datos + headers |
| `switchView(vista)` | Navegación módulos |
| `StateManager.getActiveStats()` | Selección actual |
| `StateManager.getHypothesisConfig()` | Config hipótesis |

## Flujo UI

```
CSV/Excel → script detecta columnas
→ getEstadisticosDobleColumna() deshabilita tests 1 col
→ usuario selecciona test(s) → modal si hipótesis/multivariado
→ StateManager.setHypothesisConfig()
→ ejecutarAnalisis() → EstadisticaDescriptiva
→ generarHTML() + ReporteManager → render
```

## Secciones UI (9)

| Key | Label | Tests | OK |
|-----|-------|-------|-----|
| descriptiva | Descriptiva | 13 | 13 |
| hipotesis | Hipótesis | 11 | 11 |
| correlacion | Correlación | 4 | 4 |
| regresion | Regresión | 7 | 7 |
| noParametricos | No paramétricos | 5 | 5 |
| multivariado | Multivariado | 5 | 2 |
| extras | Extras | 5 | 1 |
| especificacion | Especificación | 1 | 1 |
| calidad | Calidad | 1 | 1 |
| **Total** | | **51** | **44** |

## UX implementada

| Feature | Detalle |
|---------|---------|
| Tema claro/oscuro | ~40 CSS vars, anti-FOUC en `<head>` |
| Atajos | Ver tabla abajo |
| Undo/redo | StateManager, 50 entradas |
| Tutorial | 6 pasos, localStorage |
| Asistente análisis | Wizard selección test |
| Multi-gráfico batch | Generar N gráficos en lote (propuesto May 2026) |
| Import | Drag-drop File API |
| Sidebars | Glass collapse (May 2026) |

## Atajos

| Atajo | Acción |
|-------|--------|
| Ctrl+Shift+D | Tema |
| Ctrl+Shift+A | Asistente |
| Ctrl+Shift+T/R/S | Trabajo / Reportes / Estadísticos |
| Ctrl+Z / Y | Undo / Redo |
| Escape | Cerrar modales |
| ? | Ayuda atajos |

## `window` expuesto

`ESTADISTICOS_CONFIG`, helpers config, `StateManager`, `ReporteManager`, `EstadisticaDescriptiva`, `showToast`, `formatDate`, etc.

## Desarrollo

- Sesiones: análisis → archivo completo corregido
- Sin Jest; validación manual + scripts Python estáticos opcionales
- Reglas detalladas: `04_CODE_GUIDELINES.md`, `06_POLICIES.md`
