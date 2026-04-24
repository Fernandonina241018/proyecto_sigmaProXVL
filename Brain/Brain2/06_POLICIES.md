# 06 — Políticas del Proyecto

## 1. Política de Seguridad

### 1.1 XSS — Regla de oro
> **Todo valor que provenga de datos del usuario, resultados calculados, o el config, debe usar `textContent` en lugar de `innerHTML`.**

- Severidad de violación: **🔴 BLOQUEANTE** — no se aprueba código que viole esta regla.
- Excepción: HTML estructurado generado enteramente por el sistema (sin interpolación de valores externos). Debe documentarse con comentario `// HTML ESTÁTICO — sin interpolación de usuario`.
- Si `innerHTML` es necesario con valores dinámicos: usar función `sanitizar()` de `04_CODE_GUIDELINES.md`. Sin excepción.

### 1.2 Prohibiciones absolutas
```
eval()                    → PROHIBIDO en cualquier contexto
new Function(código)      → PROHIBIDO
setTimeout(string, ...)   → PROHIBIDO
document.write()          → PROHIBIDO
```

### 1.3 Datos del usuario
- Nunca almacenar datos del usuario fuera de la sesión (no `localStorage`, no cookies) sin consentimiento explícito.
- Los datos cargados son procesados en memoria y descartados al cerrar la sesión.
- No enviar datos a ningún servidor externo.

---

## 2. Política de Corrección Estadística

### 2.1 Validación de fórmulas
- Toda implementación debe citar su referencia bibliográfica en comentario inline.
- Las fórmulas deben coincidir con el campo `formula` del config (o el config debe actualizarse).
- Si una fórmula tiene variantes (ej: curtosis con o sin `−3`), documentar cuál se usa y por qué.

### 2.2 Valores críticos y tablas
- Las tablas estadísticas (Shapiro-Wilk, Lilliefors, Anderson-Darling) deben estar tabuladas con precisión suficiente.
- Indicar fuente de los valores críticos en comentario.
- Si se usan aproximaciones, documentar el rango de validez.

### 2.3 Límites de muestra
- `minMuestra` en el config es autoritativo. La implementación DEBE validarlo.
- `maxMuestra` cuando existe (Shapiro-Wilk: 5000) es igualmente autoritativo.
- No calcular fuera del rango válido — retornar `{ error, codigo: 'FUERA_DE_RANGO' }`.

### 2.4 Manejo de edge cases obligatorios

| Caso | Comportamiento esperado |
|---|---|
| Array vacío | `{ error: 'Sin datos', codigo: 'MIN_MUESTRA' }` |
| n < minMuestra | `{ error: '...', codigo: 'MIN_MUESTRA' }` |
| Todos los valores iguales | Manejar división por cero en DE, s⁴, etc. |
| NaN / null en datos | Filtrar + advertir en `advertencias[]` |
| Media = 0 en CV | `{ error: '...', codigo: 'MEDIA_CERO' }` |
| n > maxMuestra | `{ error: '...', codigo: 'EXCEDE_MAXIMO' }` |

---

## 3. Política de Código

### 3.1 Integridad del contrato
- El objeto de retorno de cada `calcular*()` DEBE contener todas las claves de `config.salidas[]`.
- Cambiar las claves de retorno = cambio de contrato = requiere actualizar el config + notificarlo en `05_BUGS_AND_DECISIONS.md`.
- Añadir claves extra está permitido sin ser cambio de contrato.

### 3.2 Inmutabilidad de inputs
- **Ninguna función puede mutar el array `datos` de entrada.**
- Usar `[...datos].sort(...)` en lugar de `datos.sort(...)`.
- Usar `datos.slice()` o spread cuando se necesite modificar.

### 3.3 Cambios en `estadisticosConfig.js`
- El config es la **fuente de verdad**. Cambios deben ser explícitos y justificados.
- Antes de cambiar cualquier campo de un test existente:
  1. Confirmar que no rompe la implementación existente.
  2. Documentar en `05_BUGS_AND_DECISIONS.md`.
- Añadir nuevos tests: OK en cualquier momento.
- Cambiar `calcular`, `minMuestra`, o `salidas` de un test existente: requiere verificar `EstadisticaDescriptiva.js`.

### 3.4 Compatibilidad
- Mantener compatibilidad con los helpers exportados (`getSeccionesSidebar`, `buildInterpretacion`, etc.).
- Cambios de firma de helpers = breaking change = versionar o comunicar a todos los consumidores.

---

## 4. Política de Revisión de Código

### 4.1 Orden de prioridad en revisiones
```
1. Seguridad (XSS, eval, datos sensibles)
2. Corrección estadística (fórmulas, supuestos)
3. Contratos de módulo (retornos, validaciones)
4. Corrección funcional (lógica, edge cases)
5. Performance (solo si es bloqueante)
6. Estilo y nomenclatura
```

### 4.2 Tipos de cambio

| Tipo | Requiere | Ejemplo |
|---|---|---|
| 🔴 Crítico | Fix inmediato, archivo completo | XSS, bug que rompe cálculos |
| 🟡 Mayor | Fix en la sesión actual | Contrato incorrecto, minMuestra erróneo |
| 🟢 Menor | Puede quedar en deuda técnica | Nomenclatura, comentario incorrecto |

### 4.3 Nunca aprobar código que
- Use `innerHTML` con valores no sanitizados.
- No valide `minMuestra`.
- Mute el array de entrada.
- Retorne claves que no coincidan con `config.salidas[]`.
- Use `eval()` o equivalentes.

---

## 5. Política de Documentación

### 5.1 Brain (este sistema)
- El Brain es la documentación de referencia. Si algo no está en el Brain, no es oficial.
- Actualizar el Brain es parte del workflow, no opcional.
- Si el código y el Brain discrepan, el código tiene razón — actualizar el Brain.

### 5.2 Comentarios en código
- Fórmulas matemáticas: **siempre** con referencia bibliográfica inline.
- Decisiones no obvias: comentar el porqué, no el qué.
- Fixes aplicados: `// FIX BUG N: descripción breve`.
- Código pendiente: `// TODO: descripción` con contexto de por qué no se implementó ahora.

### 5.3 `05_BUGS_AND_DECISIONS.md`
- Registrar todo bug 🟡 o 🔴 que se resuelva.
- Registrar toda decisión técnica que afecte la arquitectura.
- Mantener la tabla de deuda técnica actualizada.

---

## 6. Política de Implementación de Tests Estadísticos

### 6.1 Antes de implementar
1. Leer el config completo del test en `ESTADISTICOS_CONFIG`.
2. Verificar la referencia bibliográfica.
3. Identificar el edge case principal (¿qué puede fallar matemáticamente?).
4. Confirmar las claves de `config.salidas[]` — son el contrato.

### 6.2 Durante la implementación
- Comentar cada parte no trivial con la fórmula matemática.
- Implementar todos los edge cases del checklist de `04_CODE_GUIDELINES.md`.
- El nivel alfa viene de `config.nivelAlfa`, no hardcodeado.

### 6.3 Prioridades de implementación
Ver `02_ESTADISTICOS.md` → sección "Prioridades de implementación".

### 6.4 Tests de normalidad — prioridad especial
Los 5 tests de normalidad son **desbloqueadores** del pipeline EDA automático.

---

## 7. Política de Testing

### 7.1 Debugging en navegador
Cuando se trabaja en el navegador:
- Usar `console.log()` para verificar valores
- Verificar `StateManager.getActiveSheet()` para datos
- Verificar `ultimosResultados` para resultados
- Usar `getDataForModal()` para datos del análisis

### 7.2 Verificación de cambios
Después de cada cambio:
1. Hard refresh (Ctrl+Shift+R)
2. Ejecutar análisis
3. Verificar en consola que no hay errores
4. Verificar que los resultados son correctos

---

## Para el Agente: Resumen de Prioridades

1. **SEGURIDAD** — XSS es bloqueante
2. **CORRECCIÓN** — Fórmulas correctas, minMuestra validado
3. **CONTRATO** — Claves de retorno = config.salidas[]
4. **INMUTABILIDAD** — No mutar arrays de entrada
5. **DOCUMENTACIÓN** — Actualizar Brain después de cambios relevantes
