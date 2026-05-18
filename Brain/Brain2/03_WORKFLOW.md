# 03 — Workflow con el agente

## Protocolo (4 pasos)

| # | Acción | Detalle |
|---|--------|---------|
| 1 | Contexto | `CONTEXTO_BASE.md` + docs según tabla README |
| 2 | Análisis | Pedir revisión por severidad — **sin código** |
| 3 | Implementación | Archivo **completo** tras validar alcance |
| 4 | Verificación | Checklist fixes + prueba navegador |

### Prompts patrón

```
Análisis:  "Analiza [archivo]. Prioriza por severidad. No generes código."
Código:    "Genera el archivo completo con todos los fixes. Marca // FIX BUG N:"
Debug:     "Bug: [desc]. Causa raíz antes de solución."
Impl test: "Implementar [test]. Contrato: config.salidas = [...]. Sigue 04_CODE_GUIDELINES."
Review:    "Revisa vs 04 + 06. Prioridad: seguridad > estadística > lógica > perf > estilo."
```

## Contexto por tipo de sesión

| Tipo | Archivos |
|------|----------|
| Inicio | `01` + `03` |
| Debug | + `05` |
| Implementación | + `02` + `04` |
| Review | `04` + `06` |
| Análisis estático Python | `01` + `02` |

## El agente DEBE

- Análisis profundo antes de código
- Severidad: 🔴 crítico → 🟡 mayor → 🟢 menor
- Señalar XSS explícitamente
- Verificar fórmulas y supuestos
- Archivo completo cuando se pida
- `// FIX BUG N:` en correcciones

## El agente NO DEBE

- Parches si pidieron archivo completo
- Asumir algoritmos correctos sin leer código
- Relajar seguridad por "es dev"
- Cambiar config sin confirmación

## Prioridad revisión

```
1. Seguridad (XSS, eval, innerHTML)
2. Estadística (fórmulas, supuestos, n)
3. Lógica / edge cases
4. Contratos (retornos, config.salidas)
5. Performance (si bloquea)
6. Estilo
```

## Implementar estadístico

Ver checklist en `02_ESTADISTICOS.md` y `GUIA_ESTADISTICO.md`.

## Actualizar Brain (fin de sesión)

```
Actualiza 05_BUGS_AND_DECISIONS.md:
- Bug / decisión, causa, fix, archivo, fecha
```

## Anti-patrones

| Mal | Efecto |
|-----|--------|
| "Arregla el bug" sin contexto | Regresiones |
| Solo fragmento de archivo | Inconsistencia |
| Código sin validar análisis | Fixes incompletos |
| Omitir `04` en implementación | Rompe convenciones |
| No actualizar Brain | Contexto obsoleto |

## Debug consola

```js
StateManager.getActiveSheet()
StateManager.getHypothesisConfig('Nombre del Test')
ultimosResultados
getDataForModal().headers
EstadisticaDescriptiva.generarHTML(ultimosResultados)
StateManager.undo() / redo() / canUndo() / canRedo()
mostrarTutorial()  // forzar tutorial
```

## StateManager / atajos

Atajos: ver `01_PROJECT.md`. Undo: 50 entradas en `StateManager`.

## Refactor / renombres

Antes de renombrar funciones: `PROTOCOLO_SEGURIDAD.md` (buscar dependencias, checklist pre-commit).
