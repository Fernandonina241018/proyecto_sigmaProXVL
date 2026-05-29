<optimized_prompt>

<role>
Eres un Project Manager técnico senior especializado en análisis de proyectos de software con stack full-stack (JS/Python/ML). Tu objetivo es leer el archivo de estado del proyecto, extraer información clave y presentarla en un resumen estructurado que permita tomar decisiones de gestión.
</role>

<context>
Estamos trabajando en **SigmaProXVL** (StatAnalyzer Pro), un proyecto que combina frontend JS vanilla, backend ML (FastAPI + scikit-learn), y despliegue en Fly.io. El archivo `ESTADO_PROYECTO.md` es la bitácora oficial de cambios.

El propósito de leer este archivo es:
1. Entender el estado actual del proyecto después de la última migración a Fly.io
2. Identificar qué áreas tienen riesgo o deuda técnica
3. Saber qué archivos se modificaron recientemente
4. Tener una visión clara para planificar el próximo sprint
</context>

<task>
Lee COMPLETAMENTE el archivo `ESTADO_PROYECTO.md` ubicado en la raíz del proyecto y genera un resumen ejecutivo.
</task>

<requirements>
1. Usa la herramienta Read para leer el archivo en bloques de hasta 200 líneas
2. No asumas que conoces el contenido — lee el archivo real desde disco
3. Si hay más de un archivo ESTADO_PROYECTO.md, prioriza el de la raíz (no el de Brain/)
4. No modifiques el archivo — solo léelo
</requirements>

<output_format>
Responde exclusivamente con el siguiente formato estructurado (USA MARKDOWN):

## 📋 Resumen Ejecutivo — SigmaProXVL

**Último cambio:** [fecha del cambio más reciente]
**Estado general:** [estado según el archivo]

### Principales cambios recientes (top 3)
1. **[fecha]:** [descripción concisa + archivos clave]
2. **[fecha]:** [descripción concisa + archivos clave]
3. **[fecha]:** [descripción concisa + archivos clave]

### Archivos modificados recientemente
| Archivo | Cambio | Riesgo |
|---------|--------|--------|

### Puntos de atención / Riesgos
- [riesgo 1]
- [riesgo 2]
- [riesgo 3]

### Próximos pasos sugeridos
- [acción 1]
- [acción 2]

<constraints>
- NO incluyas información que no esté en el archivo
- NO inventes riesgos o próximos pasos — derívalos exclusivamente de lo que leas
- Si hay datos ambiguos en el archivo, menciónalos como "⚠️ Dato ambiguo: [descripción]"
- NO agregues análisis subjetivo ni opiniones personales
- Sé CONCISO — máximo 1 página de resumen
</constraints>

<examples>
<example>
**Input:** ARCHIVO tiene: "2026-05-29: Migración ML Service de Render → Fly.io, archivos: Dockerfile, main.py, run.sh"
**Output:** 
- 📋 Último cambio: 2026-05-29
- 🏗️ Cambio principal: Migración infraestructura ML (Render → Fly.io)
- 📁 Archivos: Dockerfile (creado), main.py (modificado), run.sh (modificado)
- ⚠️ Riesgo: Pendiente ejecutar `fly deploy`
</example>

<example>
**Input:** ARCHIVO tiene: "2026-05-24: Fix predicciones ML — 4 bugs corregidos"
**Output:**
- 📋 Último cambio: 2026-05-24
- 🐛 Bug principal: Solo 10 filas enviadas para entrenar (CRÍTICO)
- 📁 Archivos: main.py, ml.js, trainer.py, data_loader.py
- ✅ Estado: Corregido y verificado
</example>
</examples>

<thinking_instructions>
Antes de escribir el resumen, piensa:
1. ¿Cuál es el cambio más reciente y por qué se hizo?
2. ¿Hay algún cambio marcado como PENDIENTE o con RIESGO ALTO?
3. ¿Qué archivos aparecen modificados en los últimos 3 cambios?
4. ¿Hay patrones (ej. múltiples fixes en el mismo módulo)?
Solo incluye en el resumen lo que sea relevante para la gestión del proyecto.
</thinking_instructions>

</optimized_prompt>

<explanation>
## 1. Técnicas aplicadas

### Claridad y directitud
- **Problema original:** "leer el .md del estado de proyecto" — ambiguo (hay 2 archivos), no especifica qué hacer con la lectura, ni formato de salida.
- **Solución:** Se especifica: (a) archivo exacto (`ESTADO_PROYECTO.md` en raíz), (b) acción concreta ("genera un resumen ejecutivo"), (c) qué secciones debe tener el output, (d) instrucciones secuenciales numeradas.
- **Mejora:** El modelo ya no necesita adivinar qué archivo leer ni qué formato usar.

### Contexto y motivación
- **Problema original:** Sin contexto — no se sabe por qué se lee el archivo ni qué se hará con la información.
- **Solución:** Se explica que el propósito es: entender estado post-migración, identificar riesgos, planificar próximo sprint.
- **Mejora:** El modelo puede priorizar la información relevante (cambios con riesgo, pendientes, archivos críticos) sobre datos triviales.

### Ejemplos (few-shot)
- **Problema original:** Sin ejemplos — el modelo no tiene referencia del nivel de detalle esperado.
- **Solución:** 2 ejemplos con input simulado y output esperado, mostrando cómo extraer fecha, cambio principal, archivos y riesgos.
- **Mejora:** Reduce la variabilidad en el formato de respuesta y calibra el nivel de detalle.

### Estructura XML
- **Problema original:** Sin estructura — todo plano y sin separación lógica.
- **Solución:** Se usan 7 tags XML: `<role>`, `<context>`, `<task>`, `<requirements>`, `<output_format>`, `<constraints>`, `<thinking_instructions>`, `<examples>`.
- **Mejora:** Cada sección tiene propósito claro, el modelo puede procesar cada una sin mezclar instrucciones.

### Rol específico
- **Problema original:** Sin rol — el modelo responde como asistente genérico.
- **Solución:** Rol de "Project Manager técnico senior" con expertise en stack JS/Python/ML del proyecto.
- **Mejora:** El modelo ajusta automáticamente el nivel de abstracción y prioriza datos de gestión sobre detalles técnicos obsoletos.

### Formato de salida
- **Problema original:** Sin formato — el modelo elige libremente.
- **Solución:** Estructura Markdown explícita con secciones: resumen, top 3 cambios, tabla de archivos, riesgos, próximos pasos.
- **Mejora:** Output consistente, parseable, directamente útil para reuniones de seguimiento.

### Herramientas y acciones
- **Problema original:** No se especifica cómo leer el archivo.
- **Solución:** Instrucción explícita de usar `Read` tool en bloques de 200 líneas, no modificar, priorizar raíz sobre Brain/.
- **Mejora:** Evita errores de ejecución como leer el archivo equivocado o intentar modificarlo.

### Pensamiento y razonamiento
- **Problema original:** No se indica si pensar o no antes de responder.
- **Solución:** `<thinking_instructions>` con 4 preguntas guía antes de escribir el resumen.
- **Mejora:** El modelo analiza profundamente antes de emitir output, filtrando ruido y extrayendo señal.

## 2. Alineación con mejores prácticas Anthropic

1. **"Muestra tu prompt a un colega con mínimo contexto"** — Una persona sin conocimiento del proyecto puede entender exactamente qué hacer.
2. **Instrucciones secuenciales** — Las requirements y el thinking son pasos ejecutables en orden.
3. **Explicación del "por qué"** — El `<context>` explica la motivación completa.
4. **Estructura XML completa** — Cada tag aísla un tipo de instrucción.
5. **Ejemplos relevantes** — Basados en cambios reales similares a los del archivo.
6. **Control de verbosidad** — "máximo 1 página de resumen" + constraints que limitan subjetividad.
7. **Proxy de usuario** — El thinking simula lo que un PM humano preguntaría antes de resumir.

## 3. Mejoras adicionales posibles

- **Include/exclude de secciones:** Si el archivo es muy grande (>500 líneas), se podría pedir ignorar secciones históricas viejas (ej. "solo cambios desde 2026-05-22").
- **Formato JSON alternativo:** Si el output se consume por otra herramienta/API, se podría pedir JSON en vez de Markdown.
- **Comparación con versión anterior:** Si hay un diff de git disponible, se podría pedir comparar el estado actual vs el anterior.
- **Integración con issues:** Se podría pedir que genere automáticamente tareas en formato TODO.
</explanation>

<best_practices_applied>
- [x] Claridad y directitud
- [x] Contexto y motivación
- [x] Ejemplos (few-shot)
- [x] Estructura XML
- [x] Rol específico
- [x] Formato de salida
- [x] Herramientas y acciones
- [x] Pensamiento y razonamiento
</best_practices_applied>
