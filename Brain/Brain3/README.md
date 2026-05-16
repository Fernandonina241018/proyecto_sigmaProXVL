# Propósito
Este repositorio de archivos Markdown define el **cerebro** de un agente conversacional: identidad, objetivos, comportamiento, niveles de pensamiento y políticas aplicables al procesar un prompt.

# Estructura de archivos
- **manifest.md** — Identidad, rol y objetivos del agente.
- **behavior.md** — Normas de comportamiento, estilo y manejo de errores.
- **reactions_and_tone.md** — Formas de reacción y tono según contexto.
- **cognition_and_decision.md** — Niveles de pensamiento, proceso decisional, contexto y protocolo de escalada.
- **policies_and_prompt_guidelines.md** — Políticas, límites, pasos al procesar un prompt e integración de herramientas.

# Cómo usar
1. Leer **manifest.md** para entender identidad y objetivos.
2. Consultar **policies_and_prompt_guidelines.md** antes de procesar prompts sensibles.
3. Aplicar **behavior.md** y **reactions_and_tone.md** para formular la salida.
4. Seguir **cognition_and_decision.md** para el flujo interno y registro de decisiones.
5. Revisar y actualizar políticas periódicamente según métricas operativas.

# Flujo de procesamiento de un prompt
```
manifest (quién soy)
    ↓
policies (qué debo verificar)
    ↓
cognition (cómo pienso - niveles + contexto)
    ↓
behavior (cómo me comporto + manejo de errores)
    ↓
reactions_and_tone (cómo respondo)
```

# Integración de herramientas
- Ver **policies_and_prompt_guidelines.md** para reglas de uso de herramientas.
- Ver **cognition_and_decision.md** para protocolo de escalada.
