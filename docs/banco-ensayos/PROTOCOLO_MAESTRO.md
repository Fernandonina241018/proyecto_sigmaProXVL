# Protocolo maestro IQ/OQ/PQ — equipos

**Versión:** 1.1 · 2026-11-06
**Alcance:** protocolos IQ/OQ/PQ de equipos de producción y laboratorio, e instrumentos analíticos tipo L con protocolo OQ.
**Objetivo:** una estructura única para todos los documentos, sin depender de la familia.

## 1. Estructura del documento (8 bloques → 11 secciones Word)

| Bloque | Secciones Word | Contenido |
|---|---|---|
| 1. Identificación y aprobación | 1–6 | portada, firmas, índice, objetivo, alcance, RACI, definiciones |
| 2. Preliminares | 6.1–6.2 | requisitos previos, instrumentos, sensores, utilidades, uso previsto |
| 3. Calificación | 7 | ensayos 7.1…7.N |
| 4. Resumen | 7.x | matriz C/NC/NA, desviaciones y conclusión |
| 5. Firmas del personal | 8 | ejecutores y revisores |
| 6. Referencias | 9 | normas y documentos por ensayo |
| 7. Historial | 11 | control de cambios |
| 8. Anexos | 10 | certificados, planos, data cruda, RTM |

## 2. Ficha homogénea por ensayo

Cada ensayo debe incluir, en este orden:

1. Código — título.
2. Fase, condición y criticidad.
3. Objetivo.
4. Prerrequisitos.
5. Instrumentos y materiales.
6. Procedimiento numerado.
7. Criterios de aceptación (una fila por criterio).
8. Registro de resultados: C / NC / NA + evidencia + n.º de desviación.
9. Documentos entregables.
10. Referencia.

## 3. Reglas de referencias y anexos

- **Referencias base** para equipos de producción:
  - EU GMP Anexo 15.
  - GAMP 5, 2.ª ed.
  - 21 CFR Part 11 / EU GMP Anexo 11.
  - Manual del fabricante.
  - Procedimientos internos de validación, desviaciones y CAPA.
- **Normas específicas de familia:** las define el responsable técnico. Hasta entonces, la fila 6.6 queda como `PENDIENTE DEL RESPONSABLE`. El control de completitud por familia vive en [`NORMAS_POR_FAMILIA.md`](NORMAS_POR_FAMILIA.md); no se completan por inferencia.
- **No usar USP <1058>** en maquinaria de producción: es una norma de calificación de instrumentos analíticos (tipo M ≠ analítico).
- **Anexos mínimos:** calibraciones, planos/especificaciones, data cruda/cálculos, desviaciones/CAPA y RTM.

## 4. Familias prioritarias (F1)

1. Tableteadora
2. Encapsuladora
3. Granulador
4. Recubridora
5. Blistera
6. Detector de metales
7. Etiquetadora
8. Reactor
9. Sistema cremas/vacío

**Backfill completado (F1.1):** autoclave, congelador de laboratorio, horno de secado, horno de vacío, lecho fluido, llenadora de líquidos, llenadora y selladora de tubos, mezclador y refrigerador de laboratorio. Los 9 ya tienen bloques 6 y 8 y normas específicas declaradas; el validador los cubre desde esta versión.

**Refrigerador y congelador de laboratorio (2026-11-06):** el PQ de ambas familias queda consolidado en **16 ensayos** (`EQ-PQ-RF-001…016` y `EQ-PQ-CG-001…016`), con la repetibilidad del desempeño (`015`) y la revisión de registros y datos (`016`) incorporadas desde la lista fuente de 20 ensayos. Se mantiene un solo protocolo por familia porque los equipos **solo difieren en el rango de temperatura** (2–8 °C frente a −20 °C); setpoints y criterios provienen de la URS de cada equipo.

### 4.1 Instrumentos analíticos tipo L (excepción declarada)

La balanza analítica/precisión y el viscosímetro rotacional son instrumentos analíticos **tipo L**. Se califican con **OQ** y no llevan PQ salvo que el responsable técnico lo determine. Les aplica `USP <1058>`; el validador de familias M no los cuenta como familias de producción.

- **Viscosímetro rotacional (Brookfield):** banco `oq-viscosimetro.html` con 17 ensayos (`EQ-OQ-VS-001` a `EQ-OQ-VS-017`), **sin PQ**. La reproducibilidad se evalúa en OQ (`EQ-OQ-VS-009`). Referencias aprobadas el 2026-11-06: `USP <1058>`, `USP <912>`, `ISO 2555`, `ISO 3219-1/-2`, `ASTM D2196`, `IEC 61010-1`, `EU GMP Anexo 15` y `21 CFR Part 11 / EU GMP Anexo 11`. Los ensayos de usuarios y respaldo se declaran no aplica para la configuración actual sin software de gestión.

## 5. Validación

```bash
npm run protocolo:check
```

El validador comprueba, para las 18 familias con protocolo (9 prioritarias + 9 backfill):

- que cada familia tenga bloques 6 y 8;
- que el bloque 6 no cite USP <1058> en maquinaria de producción (tipo M);
- que las referencias específicas pendientes estén marcadas (fila 6.6);
- que el bloque 8 tenga los cuatro anexos mínimos (A–D).

### 5.1 F2 — tabla de resultados

- La tabla de resultados replica los **criterios de aceptación** (una fila por criterio), no los pasos del procedimiento. Si un ensayo no declara criterios, se conserva el procedimiento como respaldo para no dejar la tabla vacía.
- La cabecera del resultado declara **criticidad, prerrequisitos e instrumentos**. Si el banco no los declara, el generador escribe una referencia explícita al bloque 2 (requisitos previos / tabla de instrumentos) y no inventa el dato.
- Los campos opcionales del banco son `data-criticidad`, `data-prerrequisitos` y `data-instrumentos`.

### 5.2 Sistemas IQ

- Los IQ de sistemas (`docs/banco-ensayos/sistemas/iq-*.html`) están cableados al banco `BancoSistemas` y la fase IQ está habilitada para la categoría `sistemas`: HVAC, agua purificada/WFI, vapor limpio y aire comprimido.
- La generación de IQ de sistemas usa el mismo núcleo de plantilla que equipos y no hereda los ensayos comunes de equipos.

## 6. Criterios de aceptación

- [x] Las 18 familias con protocolo tienen bloques 6 y 8 (9 prioritarias + 9 backfill).
- [x] Ningún equipo de producción cita USP <1058>.
- [ ] Cada ensayo tiene criterios y registro C/NC/NA.
- [x] La tabla de resultados replica criterios, no pasos.
- [x] Los IQ de sistemas están cableados (HVAC, agua, vapor y aire).
- [x] El viscosímetro rotacional tiene banco OQ propio de 17 ensayos, sin PQ y con referencias aprobadas.
- [x] El PQ de refrigerador y congelador de laboratorio queda consolidado en 16 ensayos por familia, con repetibilidad y revisión de registros.
- [x] Los ensayos sin software (usuarios y respaldo) declaran no aplica con justificación.
- [ ] `npm run protocolo:check` sin errores.
- [ ] `npm test` y `npm run preflight` verdes.
