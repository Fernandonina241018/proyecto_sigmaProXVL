# 📋 Contexto Base para StatAnalyzer Pro

> Este archivo debe pegarse al inicio de cada sesión con el agente.

---

## 🧠 RESUMEN EJECUTIVO

- **Proyecto:** StatAnalyzer Pro
- **Stack:** JavaScript ES6+ vanilla, HTML5, CSS3 (sin frameworks)
- **Estado:** 44/51 estadísticos implementados (88%)
- **Pendientes:** K-Medias, LDA, MANOVA, Series Temporales, Supervivencia, Bayesiano

---

## 📁 ARCHIVOS CLAVE

```
/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/
├── script.js                  (~4200 líneas) - Lógica principal UI
├── EstadisticaDescriptiva.js  (~5660 líneas) - Funciones estadísticas
├── ReporteManager.js          (~2100 líneas) - Reportes HTML/TXT
├── estadisticosConfig.js      (~2500 líneas) - Config centralizada
├── StateManager.js            (~900 líneas)  - Estado
├── StatsUtils.js             (~520 líneas)  - Utilidades
├── Brain/Brain2/                         - Documentación del agente
```

---

## ⚠️ REGLAS DE ORO (NO NEGOCIABLES)

### 1. SEGURIDAD - XSS
```js
// ✅ CORRECTO
elemento.textContent = valorUsuario;

// ❌ PROHIBIDO
elemento.innerHTML = `<span>${valorUsuario}</span>`;
```

### 2. VALIDACIÓN
```js
// ✅ SIEMPRE validar minMuestra
if (datos.length < config.minMuestra) {
    return { error: 'Se requieren al menos X observaciones', codigo: 'MIN_MUESTRA' };
}
```

### 3. INMUTABILIDAD
```js
// ✅ CORRECTO - no mutar
const ordenados = [...datos].sort((a, b) => a - b);

// ❌ PROHIBIDO
datos.sort(...);
```

### 4. CONTRATO DE RETORNO
```js
// ✅ Las claves DEBEN coincidir con config.salidas[]
return {
    media: valor,
    n: datos.length,
    // ...
};
```

---

## 🔧 FLUJO DE TRABAJO

### Para implementar un nuevo estadístico:

1. **Agregar config** en `estadisticosConfig.js`
2. **Implementar función** en `EstadisticaDescriptiva.js`
3. **Agregar caso** en `ejecutarAnalisis()` switch
4. **Agregar plantilla** en `generarHTML()`
5. **Agregar al reporte** en `ReporteManager.js`
6. **Probar** en navegador
7. **Actualizar Brain** (`02_ESTADISTICOS.md`)

### Para debugging:

```javascript
// Ver datos cargados
StateManager.getActiveSheet()

// Ver config de un test
StateManager.getHypothesisConfig('Nombre del Test')

// Ver últimos resultados
ultimosResultados

// Ver columnas numéricas
getDataForModal().headers
```

---

## 🐛 BUGS RECIENTES (Abril 2026)

| Bug | Fix |
|-----|-----|
| Eigenvalores e+72 en PCA/AF | Método de Jacobi implementado |
| Communalities no aparecían | Cambiado a `communality` (singular) |
| KMO no aparecía | Cambiado a `kmo` minúscula |
| Solo 1 columna en reportes | Umbral降至 50% |
| Selección múltiples fallaba | Interceptores de botones agregados |

---

## ✨ FEATURES DE UX IMPLEMENTADAS

| Feature | Atajo | Implementación |
|---------|------|---------------|
| Tema claro/oscuro | `Ctrl+Shift+D` | CSS variables (~40) + toggle + script anti-FOUC |
| Keyboard shortcuts | `?` | `mostrarAyudaKeyboard()` |
| Undo/Redo | `Ctrl+Z/Y` | `StateManager.undo()/redo()` |
| Tutorial in-app | (auto) | Modal 6 pasos en primer login |

---

## 📊 ESTADÍSTICOS IMPLEMENTADOS

| Sección | Total | Estado |
|---------|-------|--------|
| Descriptiva | 13 | ✅ |
| Hipótesis | 11 | ✅ |
| Correlación | 4 | ✅ |
| Regresión | 7 | ✅ |
| No Paramétricos | 5 | ✅ |
| Multivariado | 5 | 2/5 |
| Especificación | 1 | ✅ |
| Extras | 5 | 1/5 |
| Calidad | 1 | ✅ |

---

## 📖 REFERENCIAS RÁPIDAS

### estadisticosConfig.js
- `getSeccionesSidebar()` → sidebar
- `getEstadisticosList()` → lista de nombres
- `getStatMetaConfig()` → metadatos
- `getEstadisticoConfig(nombre)` → config individual

### EstadisticaDescriptiva.js
- Función: `calcularXxx(datos, opciones)`
- Retorno: `{ ...salidas, n, advertencias? }`
- Error: `{ error: string, codigo: string }`

---

## 🎯 PRIORIDADES ACTUALES

1. **Completar multivariado:** K-Medias → LDA → MANOVA
2. **Series Temporales**
3. **Análisis de Supervivencia**
4. **Modelos Mixtos**
5. **Inferencia Bayesiana**

---

*Documento generado automáticamente. Actualizado: 23 Abril 2026*
