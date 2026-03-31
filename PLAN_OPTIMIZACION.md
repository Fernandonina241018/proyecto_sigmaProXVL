# 📋 Plan de Optimización - SigmaProXVL

**Fecha de creación:** 30 de Marzo de 2026  
**Última actualización:** 30 de Marzo de 2026 22:00  
**Estado actual:** 2/7 etapas completadas + fix sidebar hipótesis

---

## 🔧 FIXES REALIZADOS (fuera del plan de optimización)

### Fix: Sidebar conectado con modal de configuración de hipótesis
- **Commit:** `472400f`
- **Fecha:** 30/03/2026 22:00
- **Problema:** Las pruebas de hipótesis (ANOVA, T-Test, Chi-Cuadrado) no mostraban modal de configuración de columnas al seleccionarse desde el nuevo sidebar con iconos
- **Solución:** Modificado `applyStatSelection()` para detectar pruebas de hipótesis y abrir modal de configuración en secuencia
- **Archivos:** script.js (+41 líneas)
- **Funciones afectadas:** applyStatSelection(), _abrirModalesHipotesisSecuencia() (nueva)

---

## ✅ ETAPAS COMPLETADAS

### Etapa 1: Eliminar endpoint inseguro y state.js muerto
- **Commit:** `081955d`
- **Fecha:** 30/03/2026
- **Cambios:**
  - ✅ Eliminado endpoint inseguro en `backend/server.js`
  - ✅ Eliminado archivo `state.js` (código muerto)
  - ✅ Movido `ultimosResultados` a `StateManager.js`
- **Archivos:** StateManager.js, backend/server.js, script.js, state.js

### Etapa 2: Crear utils.js y eliminar funciones duplicadas
- **Commit:** `2219b3c`
- **Fecha:** 30/03/2026
- **Cambios:**
  - ✅ Creado archivo `utils.js` con utilidades centralizadas
  - ✅ Eliminado `escapeHtml()` duplicado de 5 archivos
  - ✅ Eliminado `showToast()` duplicado
  - ✅ Eliminado `fmtDate()` duplicado
  - ✅ Eliminado `getRolLabel()` duplicado
- **Archivos:** utils.js, AuditoriaManager.js, DatosManager.js, PermisosManager.js, UsuariosManager.js, script.js, index.html

---

## 🔄 ETAPAS PENDIENTES

### Etapa 3: Eliminar Duplicaciones y Código Muerto

| # | Tarea | Archivo | Líneas | Prioridad | Estado |
|---|-------|---------|--------|-----------|--------|
| 3.1 | Eliminar `_showToast()` duplicado | UsuariosManager.js:405, DatosManager.js:22 | - | Alta | ⏳ Pendiente |
| 3.2 | Unificar `formatDate()` | ReporteManager.js:352 → utils.js | - | Alta | ⏳ Pendiente |
| 3.3 | Eliminar `tDistributionCDF()` | EstadisticaDescriptiva.js:386 | - | Alta | ⏳ Pendiente |
| 3.4 | Migrar `ultimosResultados` a StateManager | script.js:14, ReporteManager.js:1152, Visualizacion.js:904 | - | Alta | ⏳ Pendiente |
| 3.5 | Crear Logger condicional para 99 `console.log` | Múltiples archivos | - | Media | ⏳ Pendiente |

**Detalle:**
- **3.1** → Reemplazar `_showToast()` por `showToast()` de utils.js
- **3.2** → Extender `utils.formatDate` para soporte multilenguaje (es/en)
- **3.3** → Función nunca invocada, eliminar completamente
- **3.4** → Migrar referencias a `StateManager.getUltimosResultados()`
- **3.5** → Crear Logger.debug/info/error para deshabilitar logs en producción

---

### Etapa 4: Extraer Utilidades Comunes

| # | Tarea | Archivo | Líneas | Prioridad | Estado |
|---|-------|---------|--------|-----------|--------|
| 4.1 | Unificar `getNumericColumns()` | EstadisticaDescriptiva.js:29 + Visualizacion.js:41 → utils.js | - | Media | ⏳ Pendiente |
| 4.2 | Extraer funciones de fecha | ReporteManager.js (pad, nowFormatted, todayFormatted) → utils.js | - | Media | ⏳ Pendiente |
| 4.3 | Evaluar reutilización de `_calcOutliers()` | DatosManager.js:27 | - | Baja | ⏳ Pendiente |

**Detalle:**
- **4.1** → Crear función genérica en utils.js con threshold configurable (0.8 por defecto)
- **4.2** → Mover funciones de fecha a utils.js para reutilización
- **4.3** → Evaluar si outliers en DatosManager usa misma lógica que EstadisticaDescriptiva

---

### Etapa 5: Mejoras de Seguridad

| # | Tarea | Ubicación | Líneas | Prioridad | Estado |
|---|-------|-----------|--------|-----------|--------|
| 5.1 | Auditoría de 54 `innerHTML` | script.js, Visualizacion.js, otros | - | Alta | ⏳ Pendiente |
| 5.2 | Logging seguro | backend/server.js:55-56 | - | Alta | ⏳ Pendiente |
| 5.3 | Reemplazar `hashSync` por `hash` async | backend/database.js:83 | - | Alta | ⏳ Pendiente |

**Detalle:**
- **5.1** → Verificar que cada uso de `innerHTML` escape datos de usuario con `escapeHtml()`
- **5.2** → Evitar loggear información sensible (passwords, tokens)
- **5.3** → Usar bcrypt hash async en lugar de sync para mejor rendimiento

---

### Etapa 6: Optimizaciones de Rendimiento

| # | Tarea | Ubicación | Líneas | Prioridad | Estado |
|---|-------|-----------|--------|-----------|--------|
| 6.1 | Cachear consultas DOM | script.js, Visualizacion.js, DatosManager.js | - | Media | ⏳ Pendiente |
| 6.2 | Delegación de eventos | script.js:83-127 | - | Media | ⏳ Pendiente |
| 6.3 | Reemplazar 49 `alert()` por `showToast()` | Múltiples archivos | - | Baja | ⏳ Pendiente |
| 6.4 | Memoización de cálculos estadísticos | EstadisticaDescriptiva.js | - | Baja | ⏳ Pendiente |

**Detalle:**
- **6.1** → Almacenar referencias a elementos DOM frecuentemente accedidos
- **6.2** → Un listener en contenedor padre para `.nav-item` en lugar de múltiples
- **6.3** → 49 usos de `alert()` → usar `showToast()` o modales no bloqueantes
- **6.4** → Cache LRU para funciones estadísticas puras

---

### Etapa 7: Calidad de Código

| # | Tarea | Ubicación | Líneas | Prioridad | Estado |
|---|-------|-----------|--------|-----------|--------|
| 7.1 | Estandarización de nombres | Múltiples archivos | - | Baja | ⏳ Pendiente |
| 7.2 | Mejorar manejo de errores | script.js, DatosManager.js, ReporteManager.js | - | Baja | ⏳ Pendiente |
| 7.3 | Eliminar comentarios obsoletos | Múltiples archivos | - | Baja | ⏳ Pendiente |

---

## 📊 MÉTRICAS DE IMPACTO ESTIMADAS

| Etapa | Reducción Código | Mejora Rendimiento | Riesgo Seguridad | Tiempo Estimado |
|-------|------------------|-------------------|------------------|-----------------|
| 3 | 15-20% | 5-10% | Medio | 2-3 horas |
| 4 | 5-10% | 10-15% | Bajo | 1-2 horas |
| 5 | 0% | 5% | **Alto** | 2-3 horas |
| 6 | 0% | **20-30%** | Bajo | 3-4 horas |
| 7 | 5% | 5% | Bajo | 1-2 horas |

**Total estimado:** 9-14 horas

---

## 🎯 RECOMENDACIÓN DE IMPLEMENTACIÓN

**Fase 1 (Inmediata):**
1. Etapa 5 (Seguridad) - Riesgo alto
2. Etapa 3.1-3.3 (Duplicaciones críticas)

**Fase 2 (Siguiente):**
3. Etapa 4 (Utilidades comunes)
4. Etapa 6 (Rendimiento)

**Fase 3 (Continua):**
5. Etapa 7 (Calidad de código)
6. Etapa 3.5 (Logger condicional)

---

## ⚠️ NOTAS IMPORTANTES

1. **Etapa 3.4 requiere pruebas exhaustivas** - `ultimosResultados` es usado en 3 archivos críticos (script.js, Visualizacion.js, ReporteManager.js)

2. **Etapa 5.1 es crítica** - 54 usos de `innerHTML` deben verificarse para prevenir XSS

3. **Etapa 6.3 es grande** - 49 `alert()` distribuidos en múltiples archivos

---

## 📝 HISTORIAL DE CAMBIOS

| Fecha | Etapa | Acción |
|-------|-------|--------|
| 30/03/2026 | 1 | ✅ Completada - Commit `081955d` |
| 30/03/2026 | 2 | ✅ Completada - Commit `2219b3c` |
| 30/03/2026 | - | Plan documentado en PLAN_OPTIMIZACION.md |
