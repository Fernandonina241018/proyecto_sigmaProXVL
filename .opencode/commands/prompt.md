cat > /mnt/user-data/outputs/prompt_optimizer_v2.md << 'MDEOF'
---
description: Optimizar un prompt usando mejores prácticas de Anthropic
agent: general
version: 2.0.0
last_updated: 2026-05-24
changelog:
  - "2.0.0: Error handling, token budget, skill autogen, session state, validación aprendizaje, version control"
  - "1.0.0: Versión original"
---

# 📋 Contexto del Proyecto StatAnalyzer Pro
## Versión del comando: 2.0.0
## Estado de sesión: NUEVA

---

## ⚙️ CONFIGURACIÓN GLOBAL

```yaml
TOKEN_BUDGET:
  atomic:    2000    # tareas simples, 1 archivo
  composite: 6000    # tareas medias, 2-4 archivos
  systemic:  12000   # tareas complejas, 5+ archivos

DEBUG_MODE: false    # true → muestra SKILL AUDIT visible al usuario

SESSION_STATE:
  persist_brain2: true      # guardar aprendizajes entre sesiones
  max_skills_loaded: 8      # máximo de skills simultáneas
  skill_cache_ttl: 3600     # segundos antes de re-evaluar skills

VALIDATION:
  require_tests_before_brain2_write: true
  min_confidence_to_document: 0.8   # 0-1
  block_conflicting_writes: true
```

---

## PASO 0 — SESSION BOOTSTRAP (NUEVO)

Antes de cualquier otra cosa, ejecuta este bloque de inicialización:

```
SESSION_ID     = timestamp_ms + random_4char
COMMAND_VERSION = "2.0.0"
COMPLEXITY     = null  (se asigna en PASO 1.1)
TOKEN_USED     = 0
TOKEN_LIMIT    = null  (se asigna según COMPLEXITY)
SKILLS_LOADED  = []
BRAIN2_WRITES  = []
ERRORS         = []
```

### 0.1 — Verificar disponibilidad de Brain2

```
TRY:
  verificar acceso a /mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/Brain/Brain2/
  IF acceso OK → continuar con PASO 1
  IF acceso FAIL → 
    ERRORS.push("Brain2 no disponible")
    MODE = "DEGRADED"  ← funciona sin contexto histórico
    WARN usuario: "Brain2 no está disponible. Continuaré sin contexto de sesiones previas."
    saltar PASO 1, ir directo a PASO 1.1
CATCH any_error:
  registrar en ERRORS[]
  continuar en modo DEGRADED
```

### 0.2 — Verificar versión del comando

```
IF brain2_disponible:
  leer SESION_BASE.md → buscar campo "command_version_last_used"
  IF version_guardada != COMMAND_VERSION:
    WARN: "Versión del comando cambió de {version_guardada} a {COMMAND_VERSION}"
    documentar cambio en Brain2 → 07_CONTEXTO_BASE.md
```

---

## PASO 1 — LEER BRAIN2

**Solo ejecutar si Brain2 disponible (no en modo DEGRADED)**

Lee los archivos de contexto en este orden:

| Prioridad | Archivo | Propósito |
|-----------|---------|-----------|
| 1 | `SESION_BASE.md` | Estado general del proyecto |
| 2 | `07_CONTEXTO_BASE.md` | Contexto y aprendizajes previos |
| 3 | `03_WORKFLOW.md` | Flujo de trabajo establecido |
| 4 | `05_BUGS_AND_DECISIONS.md` | Errores y decisiones documentadas |
| 5 | `10_PROTOCOLO_SEGURIDAD.md` | Restricciones de seguridad |
| 6 | `11_ADVANCE_AGENT.md` | Capacidades avanzadas del agente |

**Para cada archivo:**

```
TRY:
  leer archivo
  extraer aprendizajes relevantes al prompt actual
  TOKEN_USED += tokens_consumidos
  IF TOKEN_USED > TOKEN_LIMIT * 0.3:
    WARN: "30% del presupuesto consumido en lectura de Brain2"
CATCH file_not_found:
  ERRORS.push("Archivo no encontrado: {nombre}")
  continuar con siguiente archivo
CATCH permission_error:
  ERRORS.push("Sin permisos: {nombre}")
  continuar con siguiente archivo
```

**Identificar aprendizajes previos aplicables** al prompt recibido antes de continuar.

---

## PASO 1.1 — SKILL ACQUISITION & CAPABILITY MAPPING

### 1.1.0 — PRE-SCAN OBLIGATORIO

Antes de seleccionar cualquier skill, ejecuta este análisis:

```
INTENT_CLASS  → { build | fix | optimize | explain | design | migrate | audit }
DOMAIN        → { frontend | backend | fullstack | data | infra | ai/ml | docs }
COMPLEXITY    → { atomic | composite | systemic }
ARTIFACT_TYPE → { code | config | architecture | content | pipeline }
CONSTRAINTS   → { framework, language, runtime, environment, style_guide }
```

**Asignar presupuesto de tokens según COMPLEXITY:**

```
SWITCH COMPLEXITY:
  "atomic"    → TOKEN_LIMIT = 2000
  "composite" → TOKEN_LIMIT = 6000
  "systemic"  → TOKEN_LIMIT = 12000
  default     → TOKEN_LIMIT = 6000

IF COMPLEXITY == "systemic":
  cargar mínimo 3 skills antes de responder

IF TOKEN_USED >= TOKEN_LIMIT * 0.8:
  WARN usuario: "Cerca del límite de tokens. Priorizando respuesta."
  omitir skills no críticas
  omitir auto-evaluación extendida

IF TOKEN_USED >= TOKEN_LIMIT:
  STOP: "Límite de tokens alcanzado para esta complejidad."
  entregar respuesta parcial con lo disponible
  documentar en Brain2: "respuesta truncada por token budget"
```

Si CONSTRAINTS está parcialmente definido → inferir desde contexto del repo/conversación.

---

### 1.1.1 — SKILL SELECTION MATRIX

Selecciona skills usando la siguiente matriz. Carga **TODAS** las que apliquen.

#### FRONTEND
| Señal en el prompt | Skills requeridas |
|--------------------|-------------------|
| UI, componente, layout, pantalla | `[frontend-design]` `[accessibility-patterns]` |
| React, Next.js, Vite | `[frontend-design]` `[vercel-react-best-practices]` |
| Estado global, Zustand, Redux | `[frontend-design]` `[state-management-patterns]` |
| Rendimiento, LCP, CLS, bundle | `[frontend-design]` `[web-performance]` |
| Formularios, validación | `[frontend-design]` `[form-patterns]` |
| Animaciones, transiciones | `[frontend-design]` `[motion-design]` |

#### BACKEND
| Señal en el prompt | Skills requeridas |
|--------------------|-------------------|
| API, endpoint, servidor | `[nodejs-backend-patterns]` `[api-design]` |
| Autenticación, JWT, OAuth | `[nodejs-backend-patterns]` `[auth-security]` |
| Base de datos, queries, ORM | `[nodejs-backend-patterns]` `[database-patterns]` |
| Queue, workers, jobs | `[nodejs-backend-patterns]` `[async-patterns]` |
| WebSockets, tiempo real | `[nodejs-backend-patterns]` `[realtime-patterns]` |

#### AI / PROMPTS
| Señal en el prompt | Skills requeridas |
|--------------------|-------------------|
| Prompt, instrucción, system prompt | `[prompt-optimization]` |
| Agente, tool use, function calling | `[prompt-optimization]` `[agent-patterns]` |
| RAG, embeddings, contexto | `[prompt-optimization]` `[rag-patterns]` |
| Evaluación, evals, benchmarks | `[prompt-optimization]` `[eval-design]` |

#### INFRAESTRUCTURA / DEPLOY
| Señal en el prompt | Skills requeridas |
|--------------------|-------------------|
| Deploy, CI/CD, pipeline | `[vercel-react-best-practices]` `[devops-patterns]` |
| Variables de entorno, secrets | `[vercel-react-best-practices]` `[secrets-management]` |
| Docker, contenedores | `[devops-patterns]` `[containerization]` |
| Monitoreo, logs, errores | `[observability-patterns]` |

#### DATA / ANÁLISIS
| Señal en el prompt | Skills requeridas |
|--------------------|-------------------|
| Dataset, CSV, análisis | `[data-processing]` `[statistical-patterns]` |
| Visualización, gráficos | `[data-viz]` `[frontend-design]` |
| ETL, transformación | `[data-processing]` `[pipeline-patterns]` |

---

### 1.1.2 — SKILL LOADING PROTOCOL (CON AUTOGENERACIÓN)

```
FOR each skill IN selected_skills:

  PATH_PRIORITY = [
    /mnt/skills/user/{skill}/SKILL.md,      ← MÁXIMA PRIORIDAD
    /mnt/skills/private/{skill}/SKILL.md,   ← Alta prioridad
    /mnt/skills/public/{skill}/SKILL.md,    ← Base
    /mnt/skills/examples/{skill}/SKILL.md   ← Solo referencia
  ]

  skill_loaded = false

  FOR each path IN PATH_PRIORITY:
    TRY:
      VIEW path
      EXTRACT: constraints, patterns, anti-patterns, examples
      INTERNALIZE: aplicar en silencio
      VALIDATE: ¿conflicto con skill ya cargada?
        IF conflict:
          prioridad: user > private > public > examples
          documentar conflicto en ERRORS[]
      SKILLS_LOADED.push(skill)
      skill_loaded = true
      BREAK
    CATCH not_found:
      continuar al siguiente path

  IF NOT skill_loaded:
    ← NUEVO: AUTOGENERACIÓN DE SKILL
    WARN: "Skill '{skill}' no encontrada. Autogenerando..."
    
    skill_content = inferir_desde_conocimiento_base(skill)
    
    skill_draft = {
      nombre: skill,
      inferido_de: "conocimiento base + contexto del proyecto",
      confianza: calcular_confianza(),  # 0.0 - 1.0
      constraints: [],
      patterns: [],
      anti_patterns: [],
      generado_en: SESSION_ID,
      pendiente_revision: true
    }
    
    IF skill_draft.confianza >= 0.6:
      aplicar skill_draft temporalmente
      WARN usuario: "Aplicando skill autogenerada para '{skill}' (confianza: {confianza}). Pendiente revisión humana."
      
      IF brain2_disponible:
        guardar skill_draft en /mnt/skills/user/{skill}/SKILL_DRAFT.md
        documentar en Brain2: "skill autogenerada pendiente de revisión"
    ELSE:
      WARN usuario: "No pude generar skill confiable para '{skill}'. Usando criterio general."
      documentar en Brain2: "skill faltante: {skill}"
```

**Reglas de prioridad de scope (sin cambios):**
```
/mnt/skills/user/     ← MÁXIMA PRIORIDAD
/mnt/skills/private/  ← Alta prioridad
/mnt/skills/public/   ← Base
/mnt/skills/examples/ ← Solo referencia
```

---

### 1.1.3 — SKILL COMBINATION RULES

Algunas combinaciones generan comportamiento especial:

```
[frontend-design] + [vercel-react-best-practices]
→ Server Components por defecto en Next.js 13+
→ No usar useState en componentes que pueden ser async

[prompt-optimization] + [agent-patterns]
→ Incluir sección de tool definitions
→ Manejo explícito de errores y fallbacks

[nodejs-backend-patterns] + [auth-security]
→ Nunca hardcodear secrets, siempre process.env
→ Rate limiting en endpoints de autenticación

[data-processing] + [frontend-design]
→ Virtualización para tablas con más de 500 filas
→ Separar lógica de transformación de presentación
```

---

### 1.1.4 — SKILL AUDIT (OUTPUT)

Reportar antes de generar respuesta técnica.
Visible al usuario **solo si** `DEBUG_MODE = true` o si hay conflictos/errores.

```
SKILLS LOADED:
✓ [skill-name]    — /ruta/encontrada/SKILL.md
✗ [skill-name]    — NOT FOUND, autogenerada (confianza: 0.X)
✗ [skill-name]    — NOT FOUND, criterio general aplicado

DOMAIN DETECTED:    {domain} › {sub-domain} › {framework}
INTENT:             {intent_class} › {artifact_type}
COMPLEXITY:         {complexity}
TOKEN_BUDGET:       {TOKEN_USED} / {TOKEN_LIMIT}
CONSTRAINTS:        {lista}
CONFLICTS:          {ninguno | descripción}
SESSION_ID:         {SESSION_ID}
COMMAND_VERSION:    2.0.0
MODE:               {NORMAL | DEGRADED}
ERRORS:             {ninguno | lista}
```

---

### 1.1.5 — ERRORES COMUNES A EVITAR

```
✗ Cargar solo la skill más obvia e ignorar complementarias
✗ Narrar el proceso de carga ("Ahora voy a leer el SKILL.md de...")
✗ Asumir que una skill cargada anteriormente sigue vigente
  → Cada tarea nueva requiere re-evaluar el set de skills
✗ Ignorar /mnt/skills/user/ cuando existe
  → Las instrucciones del usuario tienen prioridad absoluta
✗ Inventar contenido de un skill que no se pudo leer
  → Usar autogeneración con confianza declarada, nunca inventar silenciosamente
✗ Exceder TOKEN_LIMIT sin avisar al usuario
✗ Escribir en Brain2 sin validar el aprendizaje primero
✗ Documentar aprendizajes con confianza < 0.8
```

---

## PASO 2 — GENERAR RESPUESTA

Con las skills cargadas, el contexto de Brain2 y el presupuesto asignado:

**Aplica TODAS estas técnicas de optimización según corresponda:**

### 2.1 CLARIDAD Y DIRECTITUD
- Elimina ambigüedad completamente
- Especifica exactamente qué formato de salida deseas
- Usa instrucciones secuenciales numeradas
- Sé explícito sobre restricciones y requisitos

### 2.2 CONTEXTO Y MOTIVACIÓN
- Explica el "por qué" detrás de cada instrucción importante
- Proporciona contexto sobre el objetivo final
- Incluye información sobre el usuario objetivo o caso de uso

### 2.3 EJEMPLOS (FEW-SHOT)
- Incluye 2-3 ejemplos relevantes y diversos
- Usa `<example>` para individuales, `<examples>` para múltiples
- Cubre casos edge y variaciones importantes

### 2.4 ESTRUCTURA XML
```xml
<instructions> instrucciones principales </instructions>
<context>      contexto relevante        </context>
<input>        datos de entrada          </input>
<output>       formato de salida         </output>
<examples>     ejemplos few-shot         </examples>
<constraints>  restricciones             </constraints>
```

### 2.5 ROL ESPECÍFICO
- Asignar rol claro si aplica
- Ejemplo: "Eres un ingeniero de software senior especializado en React"
- Envolver en `<role>` tags

### 2.6 FORMATO DE SALIDA
- Especificar formato explícito (JSON, markdown, prose, etc.)
- Controlar verbosidad y estilo

### 2.7 HERRAMIENTAS Y ACCIONES
- Ser explícito sobre cuándo usar herramientas
- Indicar acciones paralelas cuando aplique

### 2.8 PENSAMIENTO Y RAZONAMIENTO
- Para razonamiento complejo → `<thinking>` tags
- Para tareas simples → respuesta directa

**Estructura de salida:**

```xml
<optimized_prompt>
  [Prompt completamente optimizado con XML tags]
</optimized_prompt>

<explanation>
  1. Técnicas aplicadas
  2. Por qué cada cambio mejora el prompt
  3. Alineación con mejores prácticas de Anthropic
  4. Mejoras adicionales posibles
</explanation>

<best_practices_applied>
  [Lista de prácticas aplicadas con checkboxes]
</best_practices_applied>
```

---

## PASO 3 — AUTO-EVALUACIÓN CON VALIDACIÓN (MEJORADO)

### 3.1 — Auto-evalúa tu respuesta

Antes de documentar, responde internamente:

```
CHECKLIST DE CALIDAD:
□ ¿El prompt optimizado es claro y específico?
□ ¿Se aplicaron todas las técnicas de Anthropic relevantes?
□ ¿El formato de salida es apropiado?
□ ¿Hay ambigüedades que podrían mejorarse?
□ ¿La respuesta está dentro del TOKEN_BUDGET?
□ ¿Se usaron las skills cargadas realmente?
□ ¿Los ejemplos cubren casos edge?

SCORE_CALIDAD = suma_checks / total_checks  # 0.0 - 1.0
```

### 3.2 — Identificar mejoras potenciales

```
APRENDIZAJE = {
  prompt_optimizado: "resumen breve",
  que_salio_bien: "técnica aplicada con éxito",
  que_mejorar: "error o área de oportunidad",
  aplicar_en_futuros: "acción concreta",
  skills_mas_utiles: [lista],
  skills_faltantes: [lista],
  confianza: SCORE_CALIDAD,
  session_id: SESSION_ID,
  fecha: fecha_actual,
  tokens_usados: TOKEN_USED,
  command_version: "2.0.0"
}
```

### 3.3 — Validación antes de documentar (NUEVO)

```
IF APRENDIZAJE.confianza < 0.8:
  NO escribir en Brain2
  WARN interno: "Aprendizaje con baja confianza ({confianza}), no documentado"
  registrar en log temporal de sesión

IF APRENDIZAJE.confianza >= 0.8 AND brain2_disponible:
  verificar que el aprendizaje no contradice documentación existente
  IF contradicción detectada:
    WARN usuario: "El aprendizaje contradice '{archivo}:{línea}'. ¿Quieres actualizar?"
    esperar confirmación antes de escribir
    IF no_confirmación_en_30s:
      NO escribir, registrar como "pendiente de revisión"

IF BLOCK_CONFLICTING_WRITES AND conflicto_detectado:
  NO escribir automáticamente
  proponer merge al usuario
```

### 3.4 — Documentar aprendizajes validados en Brain2

**Solo ejecutar si validación superada:**

| Tipo de aprendizaje | Archivo destino |
|---------------------|----------------|
| Errores / mejoras técnicas | `05_BUGS_AND_DECISIONS.md` |
| Insights de optimización | `07_CONTEXTO_BASE.md` sección "Aprendizajes Prompt" |
| Nuevas mejores prácticas | `04_CODE_GUIDELINES.md` |
| Skills autogeneradas | `/mnt/skills/user/{skill}/SKILL_DRAFT.md` |
| Estado de sesión | `SESION_BASE.md` campo `last_session` |

**Formato de documentación:**

```markdown
### [{FECHA}] — Aprendizaje Prompt Engineering
**Session ID:** {SESSION_ID}
**Command version:** 2.0.0
**Confianza:** {SCORE_CALIDAD}
**Tokens usados:** {TOKEN_USED} / {TOKEN_LIMIT}

**Prompt optimizado:** [resumen breve]
**Qué salió bien:** [técnica aplicada con éxito]
**Qué mejorar:** [error o área de oportunidad]
**Aplicar en futuros prompts:** [acción concreta]
**Skills más útiles:** [lista]
**Skills faltantes detectadas:** [lista → candidatas a autogenerar]
```

### 3.5 — Actualizar estado de sesión

```
IF brain2_disponible:
  actualizar SESION_BASE.md:
    last_session_id: SESSION_ID
    last_command_version: "2.0.0"
    last_run: fecha_actual
    total_sessions: +1
    skills_autogeneradas_pendientes: [lista]
    errors_acumulados: ERRORS[]
```

---

## 🔄 MECANISMO DE AUTO-APRENDIZAJE (v2)

El sistema mantiene crecimiento constante mediante:

```
1. BOOTSTRAP     → Verificar Brain2 + versión del comando
2. LECTURA       → Aplicar aprendizajes de sesiones anteriores
3. SKILL SCAN    → Detectar skills faltantes → autogenerar si confianza ≥ 0.6
4. EJECUCIÓN     → Responder dentro del token budget
5. EVALUACIÓN    → Auto-crítica con score de confianza
6. VALIDACIÓN    → Solo documentar si confianza ≥ 0.8 y sin conflictos
7. DOCUMENTACIÓN → Escribir aprendizajes validados en Brain2
8. ESTADO        → Actualizar sesión para siguiente ejecución
```

**Diagrama de flujo simplificado:**
```
NUEVA EJECUCIÓN
      ↓
[0] Bootstrap + verificar Brain2
      ↓ OK              ↓ FAIL
[1] Leer Brain2    [MODO DEGRADED]
      ↓                  ↓
[1.1] Skill scan ←───────┘
      ↓
¿Skill existe? → SÍ → Cargar
      ↓ NO
¿Confianza ≥ 0.6? → SÍ → Autogenerar + avisar
      ↓ NO
Criterio general + documentar como faltante
      ↓
[2] Generar respuesta (dentro de TOKEN_LIMIT)
      ↓
[3] Auto-evaluar → SCORE_CALIDAD
      ↓
¿Confianza ≥ 0.8? → SÍ → Validar conflictos → Documentar
      ↓ NO
Registrar como pendiente
      ↓
[3.5] Actualizar estado de sesión
```

---

## SECCIÓN 9 — MIGRACIÓN JAVASCRIPT A TYPESCRIPT

Cuando trabajes en migraciones de archivos JS a TS, sigue este checklist:

### 9.1 DEPENDENCIAS EXTERNAS
- [ ] Variables globales (API_URL, CFG, Auth, etc.) → declarar en `types.d.ts` o con `@ts-ignore`
- [ ] Módulos importados
- [ ] Configuración necesaria (localStorage, window, etc.)
- [ ] Dependencias de browser (fetch, DOM, etc.)

### 9.2 AUTO-INICIALIZACIÓN
- [ ] ¿Tiene DOMContentLoaded? → Verificar que use variables globales correctas
- [ ] ¿Inicializa con variables como API_URL?
- [ ] Testing: mensaje en consola debe mostrar la URL correcta

### 9.3 VERIFICACIONES OBLIGATORIAS

| Paso | Verificación |
|------|-------------|
| 1 | Compila sin errores: `tsc --project tsconfig.json` |
| 2 | Auto-init funciona → Browser console |
| 3 | Funcionalidad probada end-to-end |
| 4 | Sin errores 405/404 en network |

### 9.4 PROTECCIÓN
- [ ] SIEMPRE mantener `.js` original como backup
- [ ] NO borrar `.js` hasta que `.ts` funcione 100%
- [ ] Probar en browser antes de confirmar migración
- [ ] Verificar que HTML cargue `dist/[nombre].js`

### 9.5 ERRORES COMUNES A EVITAR
- ApiUrl vacía → no inicializa correctamente
- Variables no declaradas → `@ts-ignore` o `declare`
- `any` implícito → definir interfaces
- Missing return types → especificar tipos
- 405 Method Not Allowed → API_URL no está inicializado

---

## 📊 MÉTRICAS DE SESIÓN (NUEVO)

Al final de cada ejecución, calcular internamente:

```yaml
session_metrics:
  id: {SESSION_ID}
  command_version: "2.0.0"
  duration_estimate: "N tokens / velocidad_estimada"
  tokens:
    used: {TOKEN_USED}
    limit: {TOKEN_LIMIT}
    efficiency: {TOKEN_USED/TOKEN_LIMIT * 100}%
  skills:
    loaded: {count}
    autogenerated: {count}
    failed: {count}
  brain2:
    mode: "NORMAL | DEGRADED"
    files_read: {count}
    writes_made: {count}
    writes_blocked: {count}
  quality:
    score: {SCORE_CALIDAD}
    documented: {true/false}
  errors:
    count: {len(ERRORS)}
    list: {ERRORS}
```

Mostrar métricas al usuario **solo si** `DEBUG_MODE = true`.

---

*StatAnalyzer Pro — Agent Command v2.0.0*
*Mejoras: Error handling · Token budget · Skill autogen · Session state · Validación aprendizaje · Version control*
MDEOF
echo "Archivo generado: $(wc -l < /mnt/user-data/outputs/prompt_optimizer_v2.md) líneas"