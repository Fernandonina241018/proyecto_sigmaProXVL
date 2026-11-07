# Normas específicas por familia — control de completitud

**Versión:** 1.1 · 2026-11-06
**Alcance:** familias de equipos de producción y laboratorio con protocolo de calificación (OQ/PQ), e instrumentos analíticos tipo L con protocolo OQ.
**Propósito:** dejar trazable qué norma específica respalda cada familia (fila 6.6 del bloque de referencias) y qué queda pendiente de decisión del responsable técnico.

> **Regla de validación:** este documento **no inventa normas**. Si una familia no tiene norma específica aprobada, se marca `PENDIENTE DEL RESPONSABLE` y el protocolo conserva la fila 6.6 con ese estado. Completarla requiere fuente, versión y aprobación del área técnica.

## 1. Estado por familia

| Familia | Tipo | Documentos | Norma específica declarada (6.6 o equivalente) | Estado |
|---|---|---|---|---|
| Tableteadora | M | `oq-tableteadora.html`, `pq-tableteadora.html` | — | `PENDIENTE DEL RESPONSABLE` |
| Encapsuladora | M | `oq-encapsuladora.html`, `pq-encapsuladora.html` | — | `PENDIENTE DEL RESPONSABLE` |
| Granulador | M | `oq-granulador.html`, `pq-granulador.html` | — | `PENDIENTE DEL RESPONSABLE` |
| Recubridora | M | `oq-recubridora.html`, `pq-recubridora.html` | — | `PENDIENTE DEL RESPONSABLE` |
| Blistera / encartonadora | M | `oq-blistera.html`, `pq-blistera.html` | — | `PENDIENTE DEL RESPONSABLE` |
| Detector de metales | M | `oq-detector-metales.html`, `pq-detector-metales.html` | — | `PENDIENTE DEL RESPONSABLE` |
| Etiquetadora | M | `oq-etiquetadora.html`, `pq-etiquetadora.html` | — | `PENDIENTE DEL RESPONSABLE` |
| Reactor | M | `oq-reactor.html`, `pq-reactor.html` | — | `PENDIENTE DEL RESPONSABLE` |
| Sistema de cremas al vacío | M | `oq-sistema-cremas-vacio.html`, `pq-sistema-cremas-vacio.html` | — | `PENDIENTE DEL RESPONSABLE` |
| Autoclave | M | `oq-autoclave.html`, `pq-autoclave.html` | EN 285 · ISO 17665-1 · USP \<1229\> · PDA TR-01 · normativa local de recipientes a presión | `DECLARADA` |
| Congelador de laboratorio | M | `oq-congelador-lab.html`, `pq-congelador-lab.html` | Manual del fabricante · URS aprobada · EU GMP Anexo 15 | `DECLARADA` |
| Horno de secado | M | `oq-horno.html`, `pq-horno.html` | OMS TRS 1010 Anexo 7 · ISPE Baseline Guide Vol. 5 · EU GMP Anexo 15 · GAMP 5 · 21 CFR Part 11 | `DECLARADA` |
| Horno de vacío | M | `oq-horno-vacio.html`, `pq-horno-vacio.html` | DIN 12880 · ISPE Baseline Guide Vol. 5 · EU GMP Anexo 15 · GAMP 5 · 21 CFR Part 11 | `DECLARADA` |
| Lecho fluido | M | `oq-lecho-fluido.html`, `pq-lecho-fluido.html` | GAMP 5 · ISPE Baseline Guide Vol. 5 C&Q · EU GMP Anexo 15 · OMS TRS 1010 Anexo 7 | `DECLARADA` |
| Llenadora de líquidos | M | `oq-llenadora.html`, `pq-llenadora.html` | EU GMP Anexo 15 · GAMP 5 · 21 CFR Part 11 · ISPE Baseline Guide Vol. 5 · USP \<671\> (si aplica) · URS | `DECLARADA` |
| Llenadora y selladora de tubos | M | `oq-llenadora-tubos.html`, `pq-llenadora-tubos.html` | EU GMP Anexo 15 · 21 CFR 211.100/211.110/211.130 · 21 CFR Part 11 · GAMP 5 · ISPE Baseline Guide Vol. 5 · URS y especificación del tubo | `DECLARADA` |
| Mezclador | M | `oq-mezclador.html`, `pq-mezclador.html` | FDA/PQRI (uniformidad de mezcla) · EU GMP Anexo 15 · GAMP 5 · ISPE Baseline Guide Vol. 5 · manual del fabricante | `DECLARADA` |
| Refrigerador de laboratorio | M | `oq-refrigerador-lab.html`, `pq-refrigerador-lab.html` | Manual del fabricante · URS aprobada · EU GMP Anexo 15 | `DECLARADA` |
| Balanza analítica / precisión | L | `oq-balanza.html` | USP \<1058\> · USP \<41\>/\<1251\> según alcance · ISO/IEC 17025 (calibración) | `DECLARADA` |
| Viscosímetro rotacional (Brookfield) | L | `oq-viscosimetro.html` (sin PQ) | USP \<1058\> · USP \<912\> · ISO 2555 · ISO 3219-1/-2 · ASTM D2196 · IEC 61010-1 · EU GMP Anexo 15 · 21 CFR Part 11 / EU GMP Anexo 11 | `DECLARADA` |

**Leyenda:** `M` = maquinaria de producción; `L` = instrumento analítico o de control de calidad. Los instrumentos tipo L se califican con OQ; el PQ solo aplica si el responsable técnico lo determina.

## 2. Qué falta exactamente (punto 1)

Las **9 familias prioritarias** (tableteadora, encapsuladora, granulador, recubridora, blistera, detector de metales, etiquetadora, reactor y sistema de cremas al vacío) mantienen la fila **6.6** como `PENDIENTE DEL RESPONSABLE` en sus 18 documentos OQ/PQ. No se completaron por inferencia.

**Viscosímetro rotacional (cerrado el 2026-11-06):** el responsable técnico aprobó las referencias específicas y confirmó que el equipo es rotacional tipo Brookfield. Se implementó un banco OQ de **17 ensayos** (`EQ-OQ-VS-001` a `EQ-OQ-VS-017`) y **no lleva PQ**: la reproducibilidad se evalúa en el OQ (`EQ-OQ-VS-009`). Los ensayos de gestión de usuarios (`EQ-OQ-VS-014`) y respaldo (`EQ-OQ-VS-015`) se declaran **NO APLICA** para la configuración actual sin software de gestión, con justificación documentada.

Para cerrarlas, el responsable técnico debe entregar por familia:

1. Norma o guía específica (código, título y año/versión).
2. Fuente verificable (documento controlado, link oficial o copia en el expediente).
3. Justificación de aplicabilidad al tipo de equipo.
4. Aprobación (nombre, cargo y fecha).

Con esos cuatro datos se sustituye la fila 6.6 en el OQ y en el PQ de la familia, y se actualiza esta tabla.

## 3. Verificación automática

```bash
npm run protocolo:check
```

El validador comprueba, para las 18 familias de maquinaria con protocolo OQ/PQ:

- bloques 6 (referencias) y 8 (anexos) presentes;
- anexos A, B, C y D presentes;
- ausencia de `USP <1058>` en maquinaria de producción (tipo M);
- fila 6.6 pendiente marcada explícitamente (no vacía).

Los instrumentos analíticos tipo L (balanza y viscosímetro) quedan fuera de ese conteo: su banco es OQ y la ausencia de PQ es una decisión declarada, no un hueco de cobertura.

## 4. Familias sin protocolo OQ/PQ todavía

Estas familias existen en el catálogo pero aún no tienen banco OQ/PQ propio; no se listan como "declaradas" para no dar una cobertura falsa:

- Secador de bandejas
- Secador de tambor
- Cabina de flujo laminar
- Cabina de bioseguridad

Su incorporación requiere banco de ensayos por familia (no basta con el artículo común).
