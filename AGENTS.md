# AGENTS.md - Reglas para asistente AI

## Reglas obligatorias

### 1. Consultar antes de modificar
- Antes de cualquier cambio en código, presentar el problema identificado
- Proponer la solución con detalles técnicos
- Esperar aprobación del usuario antes de ejecutar cambios

### 2. Actualizar ESTADO_PROYECTO.md
- Después de cada modificación autorizada, actualizar automáticamente el archivo `ESTADO_PROYECTO.md`
- Documentar: qué cambió, por qué, archivos afectados, líneas modificadas
- Incluir en la sección "CAMBIOS RECIENTES"

### 3. Commit + Push automático
- Después de cada cambio autorizado, hacer commit con mensaje descriptivo
- Hacer push inmediato a GitHub
- Incluir tanto los archivos modificados como el `.md` actualizado en el mismo commit (o commits relacionados)

## Flujo de trabajo

```
1. Usuario pide cambio o reporta problema
2. Asistente investiga y presenta hallazgos
3. Asistente propone solución y pide aprobación
4. Usuario aprueba
5. Asistente ejecuta cambios
6. Asistente actualiza ESTADO_PROYECTO.md
7. Asistente hace commit + push
8. Asistente confirma al usuario
```

## Notas
- No hacer cambios proactivos sin consulta
- Mantener commits descriptivos y organizados
- Usar formato convencional: `fix:`, `feat:`, `docs:`, `refactor:`
