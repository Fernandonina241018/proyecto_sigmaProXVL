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

**IMPORTANTE:** Al optimizar con /prompt, también se aplica la Ley de No Romperse:
- Verificar sintaxis del código a modificar
- Verificar referencias y dependencias
- Mostrar Informe de Seguridad antes de proceder
- Si hay riesgo medio/alto, pedir confirmación antes de ejecutar

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
<security_check>
- Sintaxis: a verificar antes del edit
- Referencias: verificar que elementos existen
- Dependencias: revisar qué usa el código
</security_check>
```

## Notas
- No hacer cambios proactivos sin consulta
- Mantener commits descriptivos y organizados
- Usar formato convencional: `fix:`, `feat:`, `docs:`, `refactor:`
- La optimización de prompts mejora significativamente la calidad de las respuestas

---

## 🔒 LEY DE NO ROMPERSE (Obligatoria)

**Principio Fundamental:** Antes de cualquier cambio en el código, MUST verificar que el proyecto no se rompa.

### Verificaciones Obligatorias ANTES de cada cambio:

| # | Verificación | Cómo hacerlo |
|---|--------------|------------|
| 1 | **Sintaxis** | `node -c archivo.js` antes de cada edit |
| 2 | **Referencias** | Verificar con grep que funciones/variables existen |
| 3 | **Dependencias** | Ver qué otras funciones usan el código a modificar |
| 4 | **Contexto** | Leer código circundante antes de modificar |

### Informe de Seguridad (mostrar antes de proceder):

```
✅ Verificaciones realizadas:
- Sintaxis: [OK/ERROR]
- Referencias: [OK/ERROR]
- Dependencias: [OK/ERROR]
- Riesgo de rotura: [BAJO/MEDIO/ALTO]
```

### Procedimiento ante Incertidumbre:

- Si no estás seguro de algo: **PREGUNTAR** antes de asumir
- Si el código no existe: **BUSCAR** primero, no inventar
- Si riesgo alto: **RECHAZAR** hasta tener más información

### Para Tests de Verificación:

Después de cada cambio, verificar:
1. Ejecutar `node -c` en archivos modificados
2. Si hay errores de sintaxis: **CORREGIR** antes de continuar
3. Probar manualmente la funcionalidad afectada
