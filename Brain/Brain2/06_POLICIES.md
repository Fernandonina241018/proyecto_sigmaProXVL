# 06 — Políticas

## 1. Seguridad

### XSS — bloqueante 🔴

Todo valor de usuario, resultados o config en DOM → **`textContent`**.

- Excepción HTML estático: comentario `// HTML ESTÁTICO — sin interpolación`
- `innerHTML` dinámico → `sanitizar()` (`04_CODE_GUIDELINES.md`)

### Prohibido siempre

`eval()` · `new Function(código)` · `setTimeout(string)` · `document.write()`

### Datos

- No persistir datos análisis sin consentimiento
- Procesamiento en memoria; sin envío a terceros
- Remediación reportes: `PLAN_SEGURIDAD.md`

## 2. Estadística

- Fórmula con referencia bibliográfica en comentario
- Alineada con `config.formula` (o actualizar config)
- `minMuestra` / `maxMuestra` del config son autoritativos
- Fuera de rango → `{ error, codigo: 'FUERA_DE_RANGO'|'EXCEDE_MAXIMO' }`

### Edge cases obligatorios

| Caso | Respuesta |
|------|-----------|
| Array vacío / n < min | `{ error, codigo: 'MIN_MUESTRA' }` |
| n > maxMuestra | `{ error, codigo: 'EXCEDE_MAXIMO' }` |
| NaN/null | Filtrar + `advertencias[]` |
| Todos iguales | Evitar div/0 en DE, curtosis |
| media=0 en CV | `{ error, codigo: 'MEDIA_CERO' }` |

## 3. Código

- Retorno contiene **todas** las claves de `config.salidas[]` + `n`
- Cambiar claves = breaking → actualizar config + `05`
- Claves extra permitidas
- **No mutar** array `datos` de entrada
- Cambios en `estadisticosConfig`: justificados; campos `calcular`, `minMuestra`, `salidas` → verificar implementación
- Helpers exportados: no romper firmas sin aviso

## 4. Revisión

```
Seguridad → Estadística → Contratos → Lógica → Performance → Estilo
```

| Tipo | Acción |
|------|--------|
| 🔴 Crítico | Fix inmediato, archivo completo |
| 🟡 Mayor | Fix en sesión |
| 🟢 Menor | Deuda aceptable |

**No aprobar:** innerHTML sin sanitizar · sin minMuestra · mutación datos · claves ≠ salidas · eval

## 5. Documentación

- Brain = referencia oficial; código manda si hay conflicto → actualizar Brain
- Fórmulas: referencia inline
- Fixes: `// FIX BUG N:`
- TODO: con contexto
- Bugs 🟡🔴 y decisiones arquitectura → `05`

## 6. Nuevos tests

1. Leer config completa del test
2. Confirmar `salidas[]` y referencia
3. Edge case matemático principal
4. Implementar con checklist `04`
5. `nivelAlfa` desde config, no hardcode
6. Prioridades: `02_ESTADISTICOS.md`
7. Tests normalidad = desbloqueadores EDA

## 7. Verificación manual

1. Hard refresh (Ctrl+Shift+R)
2. Ejecutar análisis
3. Consola sin errores
4. Resultados coherentes

```js
StateManager.getActiveSheet()
ultimosResultados
getDataForModal()
```

## Prioridades agente

1. Seguridad · 2. Corrección · 3. Contrato · 4. Inmutabilidad · 5. Documentar Brain
