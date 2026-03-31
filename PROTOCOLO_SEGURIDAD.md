# 🛡️ Protocolo de Seguridad - Prevenir Rotura de Código

**Creado:** 30 de Marzo de 2026  
**Última actualización:** 30 de Marzo de 2026  
**Propósito:** Evitar que cambios en una parte del código rompan otra parte

---

## ⚠️ Problema Identificado

Al hacer refactoring (renombrar funciones, extraer código a utils.js, etc.), se han roto:
- `fmtDate` → `formatDate` rompió UsuariosManager y AuditoriaManager
- Eliminación de funciones duplicadas sin verificar dependencias

---

## 🚨 REGLAS DE ORO

### Regla 1: Nunca Cambiar Nombres de Funciones Existentes
| Acción | Permitido |
|--------|-----------|
| Cambiar el **contenido** de una función | ✅ Sí |
| Agregar **nuevas** funciones | ✅ Sí |
| Renombrar funciones existentes | ❌ NO |
| Agregar alias para funciones antiguas | ✅ Sí |

### Regla 2: Antes de Cambiar, Buscar Dependencias
```
# En PowerShell, buscar todos los usos de una función:
Select-String -Path "*.js" -Pattern "nombreDeLaFuncion" -Recurse
```

### Regla 3: Después de Cada Cambio, Probar
Antes de hacer commit:
1. Recargar la app (F5)
2. Login/logout
3. Importar datos
4. Ejecutar análisis
5. Probar vistas: Usuarios, Auditoría, Datos
6. Revisar `error.log`

### Regla 4: Commits Pequeños
- Un cambio = Un commit
- Mensaje descriptivo
- Fácil rollback

---

## 📋 CHECKLIST PRE-COMMIT

Antes de cada commit, verificar:

```
□ Login/logout funciona
□ Importar datos funciona
□ Ejecutar análisis funciona
□ Vista Usuarios carga
□ Vista Auditoría carga
□ Vista Datos funciona
□ Vista Reportes funciona
□ Vista Visualización funciona
□ No hay errores en error.log
□ No hay errores en consola del navegador
```

---

## 🔍 ANÁLISIS DE IMPACTO

### Antes de Modificar Cualquier Función

**Paso 1: Encontrar todos los usos**
```powershell
# En PowerShell:
cd "G:\My Drive\SigmaProWeb\proyecto_sigmaProXVL"
Select-String -Path "*.js" -Pattern "nombreFuncion" -Recurse | Format-Table Filename, LineNumber, Line -AutoSize
```

**Paso 2: Identificar dependencias**
- ¿En qué archivos se usa?
- ¿En qué funciones se llama?
- ¿Hay IIFE que la usen?

**Paso 3: Decisión**
| Resultado | Acción |
|-----------|--------|
| Solo 1 archivo la usa | Cambiar directamente |
| Múltiples archivos la usan | Agregar alias o mantener nombre |
| Estás renombrando | NO renombrar, agregar alias |

---

## 🛠️ FLUJO SEGURO DE CAMBIOS

### Para cambios pequeños:
1. Hacer el cambio
2. Probar en navegador
3. Revisar error.log
4. Commit con mensaje descriptivo

### Para cambios grandes:
1. Crear rama: `git checkout -b feature/nombre-cambio`
2. Hacer el cambio
3. Probar exhaustivamente
4. Si todo funciona: `git checkout main && git merge feature/nombre-cambio`
5. Si se rompe: `git checkout main` (descartar rama)

---

## 📝 EJEMPLOS

### ❌ INCORRECTO: Renombrar función
```javascript
// utils.js - ANTES
function formatDate(ts, format = 'full') { ... }

// ✗ MAL - Renombrar rompe otros módulos
function fmtDate(ts, format = 'full') { ... }
```

### ✅ CORRECTO: Agregar alias
```javascript
// utils.js
function formatDate(ts, format = 'full') { ... }

// ✓ BIEN - Mantener compatibilidad
function fmtDate(ts, format = 'full') {
    return formatDate(ts, format);
}
```

### ❌ INCORRECTO: Eliminar sin verificar
```javascript
// ✗ MAL - Otro módulo podría necesitar esto
// Eliminar función _showToast de UsuariosManager.js
```

### ✅ CORRECTO: Reemplazar con alias
```javascript
// ✓ BIEN - Cambiar implementación, mantener nombre
function _showToast(msg, isError = false) {
    showToast(msg, isError);  // Llama a la versión centralizada
}
```

---

## 🚨 PROCEDIMIENTO SI SE ROMPE ALGO

1. **Detenerse inmediatamente**
2. **Identificar el commit que rompió**
   ```powershell
   git log --oneline -10
   git show <commit-hash>:archivo-afectado.js | Select-String -Pattern "funciónRota"
   ```
3. **Rollback al commit anterior**
   ```powershell
   git reset --hard <commit-anterior>
   git push --force origin main
   ```
4. **Analizar qué salió mal**
5. **Hacer el cambio de nuevo con precaución**

---

## 📊 REFERENCIAS

### Funciones Críticas (NUNCA renombrar)
| Función | Archivo | Usada en |
|---------|---------|----------|
| `escapeHtml()` | utils.js | Todos los managers |
| `showToast()` | utils.js | Todos los managers |
| `formatDate()` | utils.js | UsuariosManager, AuditoriaManager |
| `fmtDate()` | utils.js | UsuariosManager, AuditoriaManager |
| `_showToast()` | utils.js | UsuariosManager, DatosManager |
| `getRolLabel()` | utils.js | UsuariosManager, script.js |

### Archivos que DEBEN ser verificados siempre
| Archivo | Dependencias |
|---------|--------------|
| script.js | Utils, StateManager, Todos los managers |
| UsuariosManager.js | Utils, Auth |
| AuditoriaManager.js | Utils, Auth |
| DatosManager.js | Utils, StateManager |
| ReporteManager.js | Utils, StateManager |
| EstadisticaDescriptiva.js | StateManager |
| Visualizacion.js | EstadisticaDescriptiva, StateManager |

---

## ✅ RESUMEN

| Regla | Descripción |
|-------|-------------|
| 1 | Nunca renombrar funciones existentes |
| 2 | Buscar dependencias antes de cambiar |
| 3 | Probar en navegador después de cada cambio |
| 4 | Commits pequeños y frecuentes |
| 5 | Usar branches para cambios grandes |
| 6 | Si se rompe, rollback inmediatamente |

**La seguridad del código es más importante que la elegancia del refactor.**
