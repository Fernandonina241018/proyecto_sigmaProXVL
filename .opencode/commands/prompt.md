---
description: Optimizar un prompt usando mejores prácticas de Anthropic
agent: general
---

Optimiza el siguiente prompt usando las mejores prácticas de prompt engineering de Anthropic:

**Prompt a optimizar:**
$ARGUMENTS

**Aplica estas técnicas de optimización:**

1. **Sé claro y directo** - Elimina ambigüedad, especifica el formato de salida deseado
2. **Agrega contexto** - Explica el "por qué" detrás de las instrucciones
3. **Usa ejemplos** - Include 2-3 ejemplos relevantes (wrap en <example> tags)
4. **Estructura con XML** - Usa <instructions>, <context>, <input>, <output> tags
5. **Dale un rol** - Asigna un rol específico al modelo si aplica
6. **Controla el formato** - Especifica explícitamente el formato de salida (JSON, markdown, prose, etc.)

**Devuelve:**
- El prompt optimizado
- Una explicación breve de qué técnicas aplicaste y por qué
- Sugerencias adicionales de mejora si aplica

Formato de respuesta:
<optimized_prompt>
[Tu prompt optimizado aquí]
</optimized_prompt>

<explanation>
[Explicación breve de los cambios]
</explanation>
