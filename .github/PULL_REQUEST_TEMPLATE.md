<!--
Template de PR — StatAnalyzer Pro
Borrar las secciones que no apliquen. Mantener "Qué cambió" y "Cómo se probó".
-->

## Qué cambió

<!-- Qué hace este PR, en una o dos frases. El "por qué" va en la sección siguiente. -->

## Por qué

<!-- El problema que resuelve. Si es un fix: qué se rompía y en qué condiciones. -->

## Qué NO cambia

<!-- Explícitamente qué dejé intacto. Reduce el miedo a revisar. -->

## Cómo se probó

<!--
Comandos ejecutados y su resultado. Ejemplo:

  npm run preflight     → ✅ Vitest 503/503 · backend 81/81 · Playwright 1/1

Si el cambio es visual, incluye antes/después (captura pegada en la PR).
Si tocó backend, indica el endpoint y la respuesta nueva.
-->

- [ ] `npm run preflight` en verde
- [ ] Tests nuevos o actualizados que cubran el cambio
- [ ] Sin cambios en el alcance no relacionados (fuera del tema de la PR)

## Riesgo / alcance

<!--
Nivel 0 — solo texto/estilo, sin lógica
Nivel 1 — lógica de UI, reversible con un revert
Nivel 2 — toca lógica de negocio o el pipeline de reportes/firmas
Nivel 3 — toca backend, base de datos o auditoría (21 CFR Part 11)

Para Nivel 2/3, deja constancia de cómo se revierte.
-->

- [ ] Nivel de riesgo: <!-- 0 / 1 / 2 / 3 -->
- [ ] Cómo se revierte si sale mal: <!-- p. ej. git revert <sha> -->

<!--
Checklist de 21 CFR Part 11 — marcar solo si el PR toca firmas/auditoría/registros:
  - [ ] La cadena de auditoría sigue siendo verificable
  - [ ] No se alteran registros ya firmados
  - [ ] Los cambios son trazables (commit + esta PR)
-->
