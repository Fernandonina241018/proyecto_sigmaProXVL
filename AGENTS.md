# AGENTS.md - Reglas para asistente AI

## Reglas obligatorias

### 1. Optimizar prompts con /prompt
- **Todos los prompts del usuario deben ser optimizados automáticamente**
- Usar el comando `/prompt` para optimizar antes de procesar
- Aplicar mejores prácticas de Anthropic:
  - Claridad y directitud
  - Contexto y motivación
  - Estructura XML
  - Ejemplos cuando sea necesario
  - Roles específicos
  - Formato de salida explícito
- Si el usuario no usa `/prompt`, aplicar optimización internamente

### 2. Consultar antes de modificar
- Antes de cualquier cambio en código, presentar el problema identificado
- Proponer la solución con detalles técnicos
- Esperar aprobación del usuario antes de ejecutar cambios

### 3. Actualizar ESTADO_PROYECTO.md
- Después de cada modificación autorizada, actualizar automáticamente el archivo `ESTADO_PROYECTO.md`
- Documentar: qué cambió, por qué, archivos afectados, líneas modificadas
- Incluir en la sección "CAMBIOS RECIENTES"

### 4. Commit + Push automático
- Después de cada cambio autorizado, hacer commit con mensaje descriptivo
- Hacer push inmediato a GitHub
- Incluir tanto los archivos modificados como el `.md` actualizado en el mismo commit (o commits relacionados)

## Flujo de trabajo

```
1. Usuario envía prompt
2. Asistente optimiza el prompt internamente (si no usa /prompt explícitamente)
3. Asistente investiga y presenta hallazgos
4. Asistente propone solución y pide aprobación
5. Usuario aprueba
6. Asistente ejecuta cambios
7. Asistente actualiza ESTADO_PROYECTO.md
8. Asistente hace commit + push
9. Asistente confirma al usuario
```

## Comandos disponibles

### /prompt [texto]
Optimiza el prompt usando mejores prácticas de Anthropic.

**Ejemplo:**
```
/prompt haz que el botón se vea mejor
```

**Resultado:**
```xml
<role>Eres un experto en UI/UX y desarrollo frontend</role>
<task>Mejora la apariencia visual del botón</task>
<context>El botón actual necesita mejor diseño para mejor experiencia de usuario</context>
<requirements>
1. Mantén la funcionalidad existente
2. Mejora solo la apariencia visual
3. Usa CSS moderno y responsive
4. Asegura accesibilidad (contraste, tamaño)
</requirements>
<output_format>Código CSS limpio con explicaciones breves</output_format>
```

## Notas
- No hacer cambios proactivos sin consulta
- Mantener commits descriptivos y organizados
- Usar formato convencional: `fix:`, `feat:`, `docs:`, `refactor:`
- La optimización de prompts mejora significativamente la calidad de las respuestas
