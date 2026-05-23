# 05 — Bugs y decisiones

## Formato log

```
### FECHA — archivo — severidad
Bug/Decisión · Causa · Fix · Impacto · Regresiones a vigilar
```

## Bugs resueltos (índice)

| Fecha | Archivo | Sev | Resumen |
|-------|---------|-----|---------|
| 2026-05-05 | styles.css | 🟢 | Glass sidebar: backdrop-filter, blur, transiciones |
| 2026-05-05 | styles.css | 🟡 | Collapsed sidebar sin glass — fix en 3 bloques `.sidebar-collapsed` |
| 2026-05-05 | script.js, styles.css | 🟢 | Toggle integrado en sidebars (28px, ◀/▶) |
| 2026-05-05 | index.html | 🟢 | Limpieza `data:,` og/favicon, código comentado |
| 2026-05-03 | ReportesManager, dashboard | 🟡 | Reportes vacíos — clave `sigmaPro_analisis` en localStorage |
| 2026-05-02 | VizControls.js | 🟡 | Sin datos en gráficos — fallback `ultimosResultados` |
| 2026-04-24 | EstadisticaDescriptiva | 🔴 | PCA/AF eigenvalores e+72 — **Jacobi** vs QR inestable |
| 2026-04-24 | ReporteManager, utils | 🟡 | AF/PCA usaban plantilla hipótesis — set `multivariadoTests` |
| 2026-04-24 | EstadisticaDescriptiva | 🟡 | h² vacío — estandarizar `communality` |
| 2026-04-24 | EstadisticaDescriptiva | 🟡 | KMO "—" — `data.kmo` no `data.KMO` |
| 2026-04-24 | StatsUtils, EstadisticaDescriptiva | 🟡 | 1 columna reporte — umbral numérico **50%** (era 80%) |
| 2026-04-24 | script.js | 🟡 | Multi-select PCA+AF — mapear `pca-save`, `af-save` |
| 2025 | estadisticosConfig | 🔴🟡 | Ver historial previo en repo (config/validación) |

### Detalle crítico — PCA eigenvalores (2026-04-24)

**Causa:** QR inestable → valores ~e+72. **Fix:** `jacobiEigenvalues()`. **Vigilar:** otras rutas matriciales.

### Detalle — selección múltiple multivariado (2026-04-24)

**Causa:** `_abrirModalesHipotesisSecuencia` solo escuchaba `hypo-modal-confirm` / `correlacion-modal-confirm`. **Fix:** mapeo IDs por tipo de test (~L2052 script.js).

## Decisiones técnicas

| ID | Decisión | Razón |
|----|----------|-------|
| DEC-001 | `calcularMedianaModa` compartida | Mismo paso algorítmico |
| DEC-002 | Jacobi para eigenvalores | Estabilidad numérica |
| DEC-003 | Umbral columnas 50% | Datos con vacíos válidos |
| DEC-004 | Modales PCA/AF secuenciales | Config columnas independiente |
| DEC-005 | Atajos globales | UX power users |
| DEC-006 | Tutorial 6 pasos + localStorage | Onboarding |
| DEC-007 | Dark mode + anti-FOUC | ~40 CSS vars, script en head |
| DEC-008 | Multi-gráfico batch propuesto | UX: generar N gráficos en lote evita 16 clics individuales |

## Deuda técnica

| ID | Item | Sev |
|----|------|-----|
| DT-001 | Sin validación automática `salidas[]` vs retorno | 🟡 |
| DT-002 | EDAManager revisión pendiente | 🟡 |
| DT-003 | `styles.css` estructura | 🟢 |
| DT-004 | Sin test suite | 🟡 |
| DT-005 | 7 tests sin implementar | 🔴 |
| DT-006 | XSS en ReporteManager — ver `PLAN_SEGURIDAD.md` | 🔴 |

## Al cerrar bug

1. Causa raíz · 2. Fix · 3. Probar navegador · 4. Sin regresión · 5. Entrada en tabla arriba

## Al implementar test

Checklist `02_ESTADISTICOS.md` + documentar si cambia contrato o arquitectura.

---

## 🧠 Errores y decisiones — Prompt Engineering

| Fecha | Error / Decisión | Causa | Fix | Impacto |
|-------|------------------|-------|-----|---------|
| 2026-05-19 | Agregar auto-aprendizaje al comando prompt | Prompt no evolucionaba entre sesiones | Leer Brain2 antes + documentar aprendizajes después | Mejor calidad progresiva |
| 2026-05-19 | Estructura XML inconsistente | Etiquetas sin jerarquía clara | Usar <role>, <context>, <instructions> | Prompts más legibles |
| 2026-05-19 | Falta de ejemplos few-shot | Prompts demasiado abstractos | Incluir 2-3 ejemplos relevantes | Mayor precisión |
| 2026-05-20 | Prompt sin contexto del proyecto | Usuario dijo "cambiar aspecto del reporte" sin detalle | Optimización: rol + contexto Brain2 + ejemplos específicos de ReporteManager | Prompts más accionables |
| 2026-05-22 | Statement "R² diferente por otra vía" → prompt de verificación con mapeo completo de funciones + severidades | No incluir diff (before/after) explícito | Traducir statements post-cambio a prompts de "verificación de corrección" | Evita ambigüedad al especificar formato exacto de salida |
| 2026-05-22 | Prompt "dataset en top sidebar" — olvidé incluir caso de múltiples datasets en el ejemplo | STATE.analysisData es array pero ejemplo solo muestra `[0]?.name` | Mencionar explícitamente en instrucciones que se usa el primer elemento del array | Bajo — el código ya usaba `[0]` pero convenía ser explícito sobre por qué |
| 2026-05-22 | Prompt de verificación vago "verifica eso" para popup + botón colapsar | No especificar archivo HTML objetivo (index vs dashboard) ni traducir "justo arriba" a posición DOM exacta | Traducir lenguaje coloquial a términos DOM precisos ("hermano anterior inmediato") + forzar formato de salida tabular fijo + exigir archivo:línea en toda conclusión | Medio — prompts de posicionamiento sin lenguaje DOM exacto producen resultados ambiguos |
| 2026-05-22 | Optimización prompt "implementa todos prioridad alta, dejar más esfuerzo final" | Prompt ultra-vago sin contexto de proyecto ni lista específica | Mapear a datos reales del proyecto (7 tests, P1/P2 de 02_ESTADISTICOS.md, Bayesiano como más costoso) + incluir checklist completo de 08_GUIA_ESTADISTICO.md + ejemplos few-shot del dominio | Alto — el mapeo semántico de "implementa todo" a los 7 tests específicos con priorización documentada eliminó ambigüedad total |

### Protocolo de auto-mejora ( comando `/prompt` )

1. **Antes** → Leer Brain2 para aplicar aprendizajes previos
2. **Durante** → Optimizar usando técnicas de Anthropic
3. **Después** → Auto-evaluar y documentar en Brain2
4. **Siguiente** → Los nuevos aprendizajes influirán en la próxima optimización
