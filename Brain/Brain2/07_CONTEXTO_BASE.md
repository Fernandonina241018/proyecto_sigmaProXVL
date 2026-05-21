# Contexto base — pegar al iniciar sesión

> Proyecto: **StatAnalyzer Pro** v2.5 · Cliente 100% (JS vanilla, sin frameworks UI)
> **Ruta:** `G:\My Drive\SigmaProWeb\proyecto_sigmaProXVL\`

## Estado

- **44/51** estadísticos · Pendientes: K-Medias, LDA, MANOVA, Series Temporales, Supervivencia, Modelos Mixtos, Bayesiano
- Sin test suite formal — validación manual en navegador

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `estadisticosConfig.js` | Config 51 tests — **fuente de verdad** |
| `EstadisticaDescriptiva.js` | `calcular*` / `detectar*` |
| `script.js` | UI, `ejecutarAnalisis()`, modales |
| `ReporteManager.js` | Reportes HTML/TXT |
| `StateManager.js` | Estado, undo/redo |
| `StatsUtils.js` | Utilidades, umbral columnas numéricas (50%) |

## Reglas no negociables

```js
// XSS
elemento.textContent = valor;  // ✅  |  innerHTML + interpolación ❌

// Validación
if (datos.length < config.minMuestra)
  return { error: '...', codigo: 'MIN_MUESTRA' };

// Inmutabilidad
const ordenados = [...datos].sort((a, b) => a - b);

// Contrato: claves = config.salidas[], siempre incluir n
return { media, n, advertencias?: [] };
```

## Workflow agente

1. **Analizar** (severidad 🔴🟡🟢) — sin código aún
2. Confirmar alcance con usuario
3. **Entregar archivo completo** con `// FIX BUG N:` en cambios
4. Verificar en navegador (Ctrl+Shift+R)
5. Actualizar `02` / `05` en Brain si aplica

## Implementar estadístico (7 pasos)

`estadisticosConfig.js` → `EstadisticaDescriptiva.js` → `ejecutarAnalisis()` → `generarHTML()` → `ReporteManager.js` → probar → `02_ESTADISTICOS.md`

## Debug consola

```js
StateManager.getActiveSheet()
StateManager.getHypothesisConfig('Test')
ultimosResultados
getDataForModal().headers
```

## Bugs recientes (referencia)

| Síntoma | Causa / fix |
|---------|-------------|
| Eigenvalores e+72 (PCA/AF) | Jacobi en lugar de QR inestable |
| h² vacío | Clave `communality` (no `communities`) |
| KMO "—" | Clave `kmo` minúscula |
| 1 columna en reporte | Umbral numérico 50% (antes 80%) |
| Multi-select PCA+AF | Mapear botones `pca-save` / `af-save` |
| Viz sin datos | Fallback `ultimosResultados` en VizControls |

## Atajos

| Atajo | Acción |
|-------|--------|
| Ctrl+Shift+D | Tema |
| Ctrl+Shift+A | Asistente análisis |
| Ctrl+Shift+T/R/S | Trabajo / Reportes / Estadísticos |
| Ctrl+Z / Y | Undo / Redo |
| ? | Ayuda atajos |

## Docs completas

`01` arquitectura · `02` inventario · `03` workflow · `04` código · `05` bugs · `06` políticas

## Feature propuesta — Multi-gráfico batch

| Aspecto | Detalle |
|---------|---------|
| Qué | Seleccionar N columnas → generar mismo tipo de gráfico para todas |
| UX | Checkbox/selector múltiple en modal de gráficos, layout grilla |
| Límite | Advertencia si >20 gráficos, umbral numérico 50% por columna |
| Archivos | `script.js` (UI modal), `ReporteManager.js` / nuevo `MultiGraphManager.js` |
| Prioridad | 🟡 Media — discutida May 2026 |

---

## 📝 Aprendizajes Prompt Engineering

*Sección para documentar insights del comando `/prompt`*

| Fecha | Qué salió bien | Qué mejorar | Aplicar en |
|-------|----------------|-------------|------------|
| 2026-05-19 | Estructura XML clara con etiquetas semánticas | Añadir más ejemplos few-shot | Próximas optimizaciones |
| 2026-05-19 | Contexto y motivación explícitos | Evitar instrucciones ambiguas | Todos los prompts |
| 2026-05-20 | Prompt vago optimizado con contexto del proyecto + ejemplos | Falta validar contra reporte real | Usar contexto Brain2 en todas las optimizaciones |

*Mayo 2026*
