---
description: Optimizar un prompt usando mejores prácticas de Anthropic
agent: general
---

# 📋 Contexto del Proyecto StatAnalyzer Pro

## PASO 1 - LEER BRAIN2 (antes de optimizar)

**Lee los archivos de contexto en este orden:**
1. **Sesión base:** `/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/Brain/Brain2/SESION_BASE.md`
2. **Contexto base:** `/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/Brain/Brain2/07_CONTEXTO_BASE.md`
3. **Workflow:** `/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/Brain/Brain2/03_WORKFLOW.md`
4. **Bugs y decisiones:** `/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/Brain/Brain2/05_BUGS_AND_DECISIONS.md`
5. **Protocolo de Seguridad:** `/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/Brain/Brain2/10_PROTOCOLO_SEGURIDAD.md`

**Identifica aprendizajes previos** de sesiones anteriores que puedas aplicar a la optimización actual.

---

## PASO 2 - AUTO-EVALUACIÓN Y APRENDIZAJE (después de optimizar)

**Después de entregar la respuesta optimizada, evalúa tu propio trabajo:**

### 2.1 Auto-evalúa tu optimización:
- ¿El prompt optimizado es claro y específico?
- ¿Se aplicaron todas las técnicas de Anthropic relevantes?
- ¿El formato de salida es el apropiado para el caso de uso?
- ¿Hay ambigüedades que podrían mejorarse?

### 2.2 Identifica mejoras potenciales:
- ¿Qué técnica funcionó bien que podrías reuse?
- ¿Qué error cometiste que debes evitar en el futuro?
- ¿Hay algún insight sobre prompt engineering que valga documentar?

### 2.3 Documenta aprendizajes en Brain2:
**SI IDENTIFICAS UNA MEJORA**, escribe en el archivo apropiado:
- **Errores/Mejoras técnicas** → `05_BUGS_AND_DECISIONS.md` (nueva entrada en tabla)
- **Insights de optimización** → Crear entrada en `07_CONTEXTO_BASE.md` sección "Aprendizajes Prompt"
- **Nuevas mejores prácticas** → `04_CODE_GUIDELINES.md`

**Formato para documentar aprendizaje:**
```markdown
### [FECHA] — Aprendizaje Prompt Engineering

**Prompt optimizado:** [resumen breve]
**Qué salió bien:** [técnica aplicada con éxito]
**Qué mejorar:** [error o área de oportunidad]
**Aplicar en futuros prompts:** [acción concreta]
```

---

## 🧠 MECANISMO DE AUTO-APRENDIZAJE

El sistema mantiene crecimiento constante mediante:

1. **Lectura previa** → Aplicar aprendizajes de sesiones anteriores
2. **Auto-evaluación** → Criticar tu propia respuesta
3. **Documentación** → Escribir insights en Brain2
4. **Reuso** → En siguientes ejecuciones, estos aprendizajes influirán en las optimizaciones

---

Eres un experto en prompt engineering especializado en las mejores prácticas de Anthropic. Tu tarea es optimizar el siguiente prompt para maximizar la calidad de las respuestas del modelo.

**PASO 1 - TRADUCCIÓN:**
Primero traduce el prompt del usuario al INGLÉS (excepto si ya está en inglés).

**Prompt original (del usuario):**
$ARGUMENTS

**Paso 2 - OPTIMIZACIÓN:**
Ahora optimiza la versión en inglés del prompt usando las técnicas a continuación.

**Aplica TODAS estas técnicas de optimización según corresponda:**

### 1. CLARIDAD Y DIRECTITUD
- Elimina ambigüedad completamente
- Especifica exactamente qué formato de salida deseas
- Usa instrucciones secuenciales con listas numeradas o viñetas
- Sé explícito sobre restricciones y requisitos
- Recuerda: "Muestra tu prompt a un colega con mínimo contexto; si está confundido, Claude también lo estará"

### 2. CONTEXTO Y MOTIVACIÓN
- Explica el "por qué" detrás de cada instrucción importante
- Proporciona contexto sobre el objetivo final del prompt
- Incluye información sobre el usuario objetivo o caso de uso
- Ejemplo: En lugar de "Nunca uses markdown", di "Tu respuesta será leída por un motor de texto-a-voz, así que nunca uses markdown ya que el motor no sabrá cómo pronunciarlo"

### 3. EJEMPLOS (FEW-SHOT)
- Incluye 2-3 ejemplos relevantes y diversos
- Usa <example> tags para individuales, <examples> tags para múltiples
- Los ejemplos deben ser relevantes, diversos y estructurados
- Cubre casos edge y variaciones importantes

### 4. ESTRUCTURA XML
- Envuelve cada tipo de contenido en sus propias etiquetas:
  - <instructions> para instrucciones
  - <context> para contexto
  - <input> para datos de entrada
  - <output> para formato de salida deseado
  - <examples> para ejemplos
  - <constraints> para restricciones
- Usa etiquetas consistentes y descriptivas
- Anida etiquetas cuando el contenido tenga jerarquía natural

### 5. ROL ESPECÍFICO
- Asigna un rol claro al modelo si aplica
- El rol debe ser relevante para la tarea
- Ejemplo: "Eres un ingeniero de software senior especializado en React"
- Incluye el rol dentro de <role> tags

### 6. FORMATO DE SALIDA
- Especifica explícitamente el formato deseado (JSON, markdown, prose, etc.)
- Usa indicadores de formato XML si es necesario
- Proporciona instrucciones detalladas sobre estilo y estructura
- Controla la verbosidad y estilo de comunicación

### 7. HERRAMIENTAS Y ACCIONES
- Si el prompt implica usar herramientas, sé explícito sobre cuándo usarlas
- Para acciones paralelas, indica claramente cuándo ejecutar en paralelo
- Especifica si se debe actuar o solo sugerir cambios

### 8. PENSAMIENTO Y RAZONAMIENTO
- Si la tarea requiere razonamiento complejo, indica cuándo pensar extensamente
- Para tareas simples, pide respuesta directa sin pensamiento excesivo
- Usa <thinking> tags si es necesario mostrar razonamiento

**Estructura tu respuesta optimizada con:**

<optimized_prompt>
[El prompt completamente optimizado aquí, estructurado con XML tags]
</optimized_prompt>

<explanation>
[Explicación detallada de:
1. Qué técnicas aplicaste específicamente
2. Por qué cada cambio mejora el prompt
3. Cómo se alinea con las mejores prácticas de Anthropic
4. Posibles mejoras adicionales si aplican]
</explanation>

<best_practices_applied>
[Listas de las mejores prácticas aplicadas:
- [x] Claridad y directitud
- [x] Contexto y motivación
- [x] Ejemplos (few-shot)
- [x] Estructura XML
- [x] Rol específico
- [x] Formato de salida
- [x] Herramientas y acciones
- [x] Pensamiento y razonamiento
- [x] Migración JS → TS (cuando aplique)]
</best_practices_applied>

---

### 9. MIGRACIÓN JAVASCRIPT A TYPESCRIPT (cuando aplique)

Cuando trabajes en migraciones de archivos JS a TS, SIEMPRE seguir este checklist:

#### 9.1 DEPENDENCIAS EXTERNAS (documentar ANTES de migrar)
- [ ] Variables globales (API_URL, CFG, Auth, etc.) → declarar en types.d.ts o con @ts-ignore
- [ ] Módulos importados
- [ ] Configuración necesaria (localStorage, window, etc.)
- [ ] Dependencias de browser (fetch, DOM, etc.)

#### 9.2 AUTO-INICIALIZACIÓN
- [ ] ¿Tiene DOMContentLoaded? → Verificar que use variables globales correctas
- [ ] ¿Inicializa con variables como API_URL?
- [ ] Testing: mensaje en consola debe mostrar la URL correcta

#### 9.3 VERIFICACIONES OBLIGATORIAS
| Paso | Verificación |
|------|------------|
| 1 | Compila sin errores: `tsc --project tsconfig.json` |
| 2 | Auto-init funciona → Browser console |
| 3 | Funcionalidad probada |
| 4 | Sin errores 405/404 en network |

#### 9.4 PROTECCIÓN
- [ ] SIEMPRE mantener .js original como backup
- [ ] NO borrar .js hasta que .ts funcione 100%
- [ ] Probar en browser antes de confirmar migración
- [ ] Verificar que HTML cargue dist/[nombre].js

#### 9.5 ERRORES COMUNES A EVITAR
- ApiUrl vacía → no inicializa correctamente
- Variables no declaradas → @ts-ignore o declare
- any implícito → definir interfaces
- Missing return types → especificar tipos
- 405 Method Not Allowed → API_URL no está inicializado
