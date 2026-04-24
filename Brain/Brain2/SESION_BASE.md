# 📋 Contexto para Sesiones de StatAnalyzer Pro

> **AL INICIAR CUALQUIER SESIÓN, PEGAR ESTE CONTEXTO**

---

## 🧠 Estado del Proyecto

- **Nombre:** StatAnalyzer Pro
- **Versión:** 2.5
- **Implementados:** 44 de 51 estadísticos (88%)
- **Pendientes:** 6 (K-Medias, LDA, MANOVA, Series Temporales, Supervivencia, Bayesiano)

---

## ⚠️ REGLAS DE ORO

1. **XSS:** Siempre `textContent`, nunca `innerHTML` con valores de usuario
2. **Validación:** Siempre `minMuestra` antes de calcular
3. **Inmutabilidad:** Nunca `datos.sort()`, usar `[...datos]`
4. **Contrato:** Claves de retorno = `config.salidas[]`

---

## 📁 Archivos Principales

```
/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/
├── script.js              (~4200 líneas)
├── EstadisticaDescriptiva.js  (~5660 líneas)
├── ReporteManager.js      (~2100 líneas)
├── estadisticosConfig.js  (~2500 líneas)
├── StateManager.js        (~900 líneas)
├── Brain/Brain2/         (documentación)
```

---

## 🔧 Workflow para Nuevos Estadísticos

```
1. Agregar config en estadisticosConfig.js
2. Implementar función en EstadisticaDescriptiva.js
3. Agregar caso en ejecutarAnalisis()
4. Agregar plantilla en generarHTML()
5. Agregar al reporte en ReporteManager.js
6. Probar en navegador
7. Actualizar Brain
```

---

## 🐛 Debugging

```javascript
StateManager.getActiveSheet()           // Datos cargados
StateManager.getHypothesisConfig('X')   // Config de test
ultimosResultados                      // Resultados
getDataForModal().headers              // Columnas
```

---

## 📊 Estadísticos

| Sección | Implementados |
|---------|---------------|
| Descriptiva | 13 ✅ |
| Hipótesis | 11 ✅ |
| Correlación | 4 ✅ |
| Regresión | 7 ✅ |
| No Paramétricos | 5 ✅ |
| Multivariado | 2/5 |
| Especificación | 1 ✅ |
| Extras | 1/5 |
| Calidad | 1 ✅ |

---

## 📖 Documentación (Brain2)

| Archivo | Para qué |
|--------|----------|
| 01_PROJECT.md | Arquitectura |
| 02_ESTADISTICOS.md | Inventario tests |
| 03_WORKFLOW.md | Protocolo trabajo |
| 04_CODE_GUIDELINES.md | Convenciones código |
| 05_BUGS_AND_DECISIONS.md | Bugs resueltos |
| 06_POLICIES.md | Políticas |

---

*Actualizado: 24 Abril 2026*
