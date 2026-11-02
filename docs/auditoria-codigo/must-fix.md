# Auditoría de código — Estado de los must-fix

**Fecha original:** 2026-10-16 · **Última revisión:** 2026-11-01

Los tres hallazgos must-fix fueron corregidos:

| ID | Hallazgo | Estado | Corrección |
|---|---|---|---|
| MF-1 | XSS almacenado en vista previa de reportes | Mitigado | `iframe sandbox` sin `allow-scripts` en la vista previa |
| MF-2 | Carrera en la cadena de auditoría | Mitigado | Transacción + `pg_advisory_xact_lock` + test de concurrencia |
| MF-3 | Límite de 100 KB rompía `amend` y snapshots | Mitigado | Parser grande para `amend`, snapshots y PDF |

El detalle técnico, la evidencia y los informes de auditoría se mantienen en el repositorio privado de seguridad. Este archivo público solo conserva el estado.
