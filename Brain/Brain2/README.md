# 🧠 Brain2 — StatAnalyzer Pro

> **Propósito:** Contexto de sesión para el agente + documentación interna del proyecto.
> **Formato:** Denso/técnico. Cada archivo es autocontenido.

---

## Estado del Proyecto (Abril 2026)

- **Versión:** 2.5
- **Implementados:** 44 de 51 estadísticos (88%)
- **Pendientes:** 6 (K-Medias, LDA, MANOVA, Series Temporales, Supervivencia, Bayesiano)
- **Compleción:** ~92%

---

## Estructura

| Archivo | Contenido | Pegar al agente cuando... |
|---|---|---|
| `01_PROJECT.md` | Arquitectura, stack, módulos, archivos clave | **Siempre al iniciar sesión** |
| `02_ESTADISTICOS.md` | 51 tests: estado impl., prioridades, contratos | Se trabaja en implementación o config |
| `03_WORKFLOW.md` | Protocolo de trabajo, comandos útiles | **Siempre al iniciar sesión** |
| `04_CODE_GUIDELINES.md` | Convenciones JS/CSS, patrones, anti-patrones | Se escribe código nuevo |
| `05_BUGS_AND_DECISIONS.md` | Bugs resueltos, decisiones técnicas, deuda | Se debuggea o refactoriza |
| `06_POLICIES.md` | Políticas de calidad, seguridad, release | Se hace review o merge |

---

## Uso rápido como contexto para Claude

```
[Inicio de sesión estándar]
→ Pegar: 01_PROJECT.md + 03_WORKFLOW.md

[Sesión de implementación]
→ Pegar: 01_PROJECT.md + 02_ESTADISTICOS.md + 04_CODE_GUIDELINES.md + 03_WORKFLOW.md

[Sesión de debugging]
→ Pegar: 01_PROJECT.md + 05_BUGS_AND_DECISIONS.md + 03_WORKFLOW.md

[Review de código]
→ Pegar: 04_CODE_GUIDELINES.md + 06_POLICIES.md
```

---

## Rutas del Proyecto

```
/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/
├── script.js                    (~4200 líneas) - Lógica principal UI
├── EstadisticaDescriptiva.js   (~5660 líneas) - Funciones estadísticas
├── ReporteManager.js          (~2100 líneas) - Reportes HTML/TXT
├── estadisticosConfig.js      (~2500 líneas) - Config centralizada
├── StateManager.js            (~900 líneas)  - Estado
├── StatsUtils.js              (~520 líneas)  - Utilidades estadísticas
├── Visualizacion.js          (~2200 líneas) - Gráficos
├── utils.js                  (~150 líneas)  - Utilidades globales
│
├── Brain/
│   └── Brain2/
│       ├── README.md         (este archivo)
│       ├── 01_PROJECT.md    - Arquitectura
│       ├── 02_ESTADISTICOS.md - Inventario de tests
│       ├── 03_WORKFLOW.md  - Protocolo de trabajo
│       ├── 04_CODE_GUIDELINES.md - Convenciones
│       ├── 05_BUGS_AND_DECISIONS.md - Bugs y decisiones
│       └── 06_POLICIES.md  - Políticas
```

---

## Comandos útiles para debugging

```javascript
// Ver datos cargados
StateManager.getActiveSheet()

// Ver config de un test
StateManager.getHypothesisConfig('Nombre del Test')

// Ver últimos resultados
ultimosResultados

// Ver columnas numéricas detectadas
getDataForModal().headers

// Forzar regenerar HTML
EstadisticaDescriptiva.generarHTML(ultimosResultados)

// Ver estado actual
StateManager.getAllHypothesisConfig()
```

---

## Mantenimiento

- Actualizar `02_ESTADISTICOS.md` → cada vez que se implemente o corrija un test.
- Actualizar `05_BUGS_AND_DECISIONS.md` → después de cada sesión de debugging relevante.
- Actualizar `06_POLICIES.md` → cuando cambie una regla o política del proyecto.
- Revisar `03_WORKFLOW.md` → si cambia la forma de trabajar.

---

## Para el Agente: Reglas de Oro

1. **Nunca usar `innerHTML` con valores del usuario** — usar `textContent`
2. **Siempre validar `minMuestra`** antes de calcular
3. **No mutar arrays de entrada** — usar spread `...datos`
4. **Retornar `{ error: string }`** en caso de fallo
5. **Las claves de retorno deben coincidir con `config.salidas[]`**
6. **Antes de modificar código, pedir análisis profundo**
7. **Al finalizar cambios relevantes, actualizar el Brain**

---

## Estadísticos Implementados (44/51)

### ✅ Completados (44)
- **Descriptiva (13):** Media, Mediana, Moda, DE, Varianza, Percentiles, Rango, CV, Asimetría, Curtosis, Error Estándar, Intervalos de Confianza, Outliers
- **Hipótesis (11):** T-Test 1 muestra, T-Test 2 muestras, ANOVA One-Way, ANOVA Two-Way, Chi-Cuadrado, TOST, Test Normalidad, Shapiro-Wilk, Kolmogorov-Smirnov, Anderson-Darling, D'Agostino-Pearson
- **Correlación (4):** Pearson, Spearman, Kendall Tau, Covarianza
- **Regresión (7):** Lineal Simple, Lineal Múltiple, Polinomial, Logística, RMSE, MAE, R²
- **No Paramétricos (5):** Mann-Whitney, Kruskal-Wallis, Wilcoxon, Friedman, Test de Signos
- **Multivariado (2):** PCA, Análisis Factorial
- **Especificación (1):** Límites de Cuantificación
- **Extras (1):** Bootstrap
- **Calidad (1):** Diagrama de Pareto

### ❌ Pendientes (6)
- K-Medias (Clustering)
- LDA (Análisis Discriminante)
- MANOVA
- Series Temporales
- Análisis de Supervivencia
- Inferencia Bayesiana

---

*Última actualización: 24 Abril 2026*
