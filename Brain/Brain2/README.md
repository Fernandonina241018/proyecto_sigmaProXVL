# Brain2 — StatAnalyzer Pro

> Contexto denso para el agente. Formato técnico, autocontenido por archivo.
> **Ruta proyecto:** `G:\My Drive\SigmaProWeb\proyecto_sigmaProXVL\`

## Estado (Mayo 2026)

| Métrica | Valor |
|---------|-------|
| Versión | 2.5 |
| Estadísticos | **44 / 51** (86%) |
| Pendientes (7) | K-Medias, LDA, MANOVA, Series Temporales, Supervivencia, Modelos Mixtos, Bayesiano |

## Inicio de sesión (copiar al agente)

| Tipo | Archivos |
|------|----------|
| **Mínimo** | `CONTEXTO_BASE.md` o `SESION_BASE.md` |
| Estándar | `01_PROJECT.md` + `03_WORKFLOW.md` |
| Implementación | + `02_ESTADISTICOS.md` + `04_CODE_GUIDELINES.md` |
| Debugging | + `05_BUGS_AND_DECISIONS.md` |
| Review / merge | + `06_POLICIES.md` |
| Nuevo estadístico (detalle) | + `GUIA_ESTADISTICO.md` |
| Seguridad / refactor | + `PLAN_SEGURIDAD.md` + `PROTOCOLO_SEGURIDAD.md` |

## Mapa de archivos

| Archivo | Contenido |
|---------|-----------|
| `CONTEXTO_BASE.md` | Paste único: reglas + rutas + estado |
| `SESION_BASE.md` | Alias corto de `CONTEXTO_BASE.md` |
| `01_PROJECT.md` | Arquitectura, módulos, flujo UI |
| `02_ESTADISTICOS.md` | Inventario 51 tests, contratos |
| `03_WORKFLOW.md` | Protocolo agente, prompts, anti-patrones |
| `04_CODE_GUIDELINES.md` | JS/CSS, patrones, XSS |
| `05_BUGS_AND_DECISIONS.md` | Log bugs, decisiones, deuda |
| `06_POLICIES.md` | Políticas bloqueantes |
| `GUIA_ESTADISTICO.md` | Checklist implementación test |
| `PLAN_SEGURIDAD.md` | Hallazgos XSS/remediación |
| `PROTOCOLO_SEGURIDAD.md` | Refactor sin romper dependencias |

## Reglas de oro (resumen)

1. `textContent` — nunca `innerHTML` con datos usuario/resultados/config
2. Validar `config.minMuestra` y `maxMuestra` antes de calcular
3. No mutar `datos` — `[...datos].sort(...)`
4. Retorno: claves = `config.salidas[]` + `n`; error = `{ error, codigo }`
5. Análisis profundo **antes** de generar código
6. Archivo **completo** al corregir (no parches sueltos)
7. Actualizar Brain tras cambios relevantes

## Archivos de código críticos

```
proyecto_sigmaProXVL/
├── index.html, app.js, script.js          # UI (~4200 L en script.js)
├── estadisticosConfig.js                  # Fuente de verdad — 51 tests
├── EstadisticaDescriptiva.js              # calcular* (~5660 L)
├── ReporteManager.js                      # Reportes HTML/TXT
├── StateManager.js, StatsUtils.js
├── Visualizacion.js, EDAManager.js
└── Brain/Brain2/                          # Este directorio
```

## Debug rápido (consola)

```js
StateManager.getActiveSheet()
StateManager.getHypothesisConfig('Nombre del Test')
ultimosResultados
getDataForModal().headers
EstadisticaDescriptiva.generarHTML(ultimosResultados)
```

## Mantenimiento Brain

| Evento | Actualizar |
|--------|------------|
| Nuevo/corregido test | `02_ESTADISTICOS.md` |
| Bug o decisión arquitectura | `05_BUGS_AND_DECISIONS.md` |
| Cambio de proceso | `03_WORKFLOW.md` |
| Hallazgo seguridad | `PLAN_SEGURIDAD.md` |

*Última actualización: Mayo 2026*
