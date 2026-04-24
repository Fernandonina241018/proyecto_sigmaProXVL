# 03 — Flujo de Trabajo con el Agente

## Protocolo estándar de sesión

### Paso 1 — Contexto inicial
Pegar siempre al inicio:
- `01_PROJECT.md` (arquitectura)
- `03_WORKFLOW.md` (este archivo)
- + archivo relevante según tipo de sesión (ver README)

### Paso 2 — Solicitar análisis profundo PRIMERO
**Nunca pedir el archivo corregido directamente.**
Primero pedir:
```
"Analiza [archivo/módulo] en profundidad. 
Prioriza hallazgos por severidad. 
No generes código aún."
```
Evaluar el análisis, hacer preguntas, confirmar el alcance.

### Paso 3 — Solicitar archivo completo corregido
Solo después de validar el análisis:
```
"Genera el archivo completo con todos los fixes aplicados."
```
Siempre pedir el **archivo completo** — nunca parches sueltos.

### Paso 4 — Verificación
- Claude debe incluir un script de verificación o checklist de los fixes.
- Confirmar que no se introdujeron regresiones.
- Probar en el navegador si es necesario.

---

## Tipos de sesión

### Sesión de debugging
```
Contexto: 01_PROJECT.md + 05_BUGS_AND_DECISIONS.md + 03_WORKFLOW.md
Prompt patrón: "Tengo este bug: [descripción + código]. 
               Analiza causa raíz antes de proponer solución."
```

### Sesión de implementación
```
Contexto: 01_PROJECT.md + 02_ESTADISTICOS.md + 04_CODE_GUIDELINES.md + 03_WORKFLOW.md
Prompt patrón: "Voy a implementar [nombre del test]. 
               El contrato de retorno debe ser: [salidas del config].
               Sigue las convenciones de 04_CODE_GUIDELINES.md."
```

### Sesión de revisión de código
```
Contexto: 04_CODE_GUIDELINES.md + 06_POLICIES.md
Prompt patrón: "Revisa este código contra las guidelines. 
               Prioriza: seguridad > corrección estadística > performance > estilo."
```

### Sesión de análisis estático (Python)
```
Contexto: 01_PROJECT.md + 02_ESTADISTICOS.md
Prompt patrón: "Escribe un script Python que analice [archivo JS] 
               y detecte [patrón específico]."
```

---

## Reglas de interacción

### El Agente DEBE
- Hacer análisis profundo antes de generar código.
- Identificar bugs por severidad: 🔴 crítico → 🟡 mayor → 🟢 menor.
- Señalar implicaciones de seguridad explícitamente (XSS, injection, etc.).
- Verificar corrección estadística (fórmulas, supuestos, rangos válidos).
- Generar archivos completos, nunca fragmentos cuando se pide el archivo final.
- Incluir comentarios inline en los fixes indicando qué bug resuelve (`// FIX BUG N:`).

### El Agente NO DEBE
- Proponer soluciones parciales si se pidió el archivo completo.
- Asumir que un algoritmo está implementado correctamente sin verlo.
- Ignorar advertencias de seguridad por "estar en contexto de desarrollo".
- Cambiar la estructura del config sin confirmación explícita.

---

## Prioridad de revisión de código

```
1. Seguridad (XSS, eval(), innerHTML sin sanitizar)
2. Corrección estadística (fórmulas, supuestos, límites de muestra)
3. Corrección funcional (bugs de lógica, edge cases)
4. Contratos de módulo (retornos, validaciones)
5. Performance (solo si es bloqueante)
6. Estilo y nomenclatura
```

---

## Convenciones de comunicación

- **Severidad de bugs:** usar emojis 🔴/🟡/🟢 en análisis.
- **Referencias al config:** mencionar siempre el campo exacto (`config.minMuestra`, `config.salidas`, etc.).
- **Cambios de contrato:** advertir explícitamente si un fix cambia la firma de una función.
- **Decisiones técnicas:** documentar en `05_BUGS_AND_DECISIONS.md` después de la sesión.

---

## Anti-patrones a evitar

| Anti-patrón | Consecuencia |
|---|---|
| Pedir "arregla el bug" sin contexto | Soluciones genéricas, puede introducir regresiones |
| Pedir solo el fragmento modificado | Riesgo de inconsistencias con el resto del archivo |
| No validar el análisis antes del código | Fixes incompletos o mal priorizados |
| Omitir el archivo de guidelines en impl. | Código que no sigue las convenciones del proyecto |
| No actualizar el Brain tras la sesión | El contexto se desincroniza con el estado real |

---

## Workflow para implementar nuevo estadístico

```
1. Leer config existente en estadisticosConfig.js
2. Agregar entrada en ESTADISTICOS_CONFIG:
   - seccion, calcular, formula, desc, minMuestra, supuestos, inputs, salidas
3. Implementar función en EstadisticaDescriptiva.js
4. Agregar caso en ejecutarAnalisis() switch
5. Agregar plantilla en generarHTML() para UI
6. Agregar caso en ReporteManager.js para reportes
7. Probar en navegador
8. Actualizar 02_ESTADISTICOS.md
```

---

## Actualización del Brain

Al final de cada sesión relevante:
```
"Actualiza 05_BUGS_AND_DECISIONS.md con:
- Bug: [descripción]
- Causa raíz: [causa]
- Fix aplicado: [solución]
- Archivo afectado: [archivo]
- Fecha: [fecha]"
```

---

## Comandos útiles para debugging

```javascript
// Ver datos cargados
StateManager.getActiveSheet()

// Ver config de un test
StateManager.getHypothesisConfig('Nombre del Test')

// Ver últimos resultados
ultimosResultados

// Ver columnas numéricas
getDataForModal().headers

// Forzar regeneration de HTML
EstadisticaDescriptiva.generarHTML(ultimosResultados)
```

---

## Rutas importantes del proyecto

```
/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/
├── script.js                    (~4200 líneas) - Lógica principal
├── EstadisticaDescriptiva.js    (~5660 líneas) - Funciones estadísticas
├── ReporteManager.js           (~2100 líneas) - Reportes HTML/TXT
├── estadisticosConfig.js        (~2500 líneas) - Config centralizada
├── StateManager.js             (~900 líneas)  - Estado
├── StatsUtils.js               (~520 líneas)  - Utilidades
├── Visualizacion.js            (~2200 líneas) - Gráficos
├── utils.js                    (~150 líneas)  - Utilidades globales
├── Brain/
│   └── Brain2/
│       ├── 01_PROJECT.md
│       ├── 02_ESTADISTICOS.md
│       ├── 03_WORKFLOW.md
│       ├── 04_CODE_GUIDELINES.md
│       ├── 05_BUGS_AND_DECISIONS.md
│       └── 06_POLICIES.md
```
