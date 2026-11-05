# Protocolo maestro IQ/OQ/PQ — equipos

**Versión:** 1.0 · 2026-11-04
**Alcance:** protocolos IQ/OQ/PQ de equipos de producción y laboratorio.
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
- **Normas específicas de familia:** las define el responsable técnico. Hasta entonces, la fila 6.6 queda como `PENDIENTE DEL RESPONSABLE`.
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

Las 9 restantes se backfillean después con el mismo shell.

## 5. Validación

```bash
npm run protocolo:check
```

El validador comprueba:

- que cada familia prioritaria tenga bloques 6 y 8;
- que el bloque 6 no cite USP <1058>;
- que las referencias específicas pendientes estén marcadas;
- que el bloque 8 tenga los cuatro anexos mínimos.

## 6. Criterios de aceptación

- [ ] Las 9 familias prioritarias tienen bloques 6 y 8.
- [ ] Ningún equipo de producción cita USP <1058>.
- [ ] Cada ensayo tiene criterios y registro C/NC/NA.
- [ ] La tabla de resultados replica criterios, no pasos.
- [ ] `npm run protocolo:check` sin errores.
- [ ] `npm test` y `npm run preflight` verdes.
