# Auditoría de código — Hallazgos MUST FIX

**Fecha:** 2026-10-16 · **Commit base:** `5b9da0b` (main)
**Alcance:** repo completo (revisión estática, sin ejecutar código nuevo).
**Carga asumida:** equipo pequeño (analistas, revisor, aprobador, admin), 1 backend en Fly.io, PostgreSQL en Supabase, frontend estático en GitHub Pages.

Estos 3 hallazgos son los únicos clasificados **Must fix** (bug / seguridad / pérdida de datos / se rompe con la carga esperada). Ninguno fue corregido aún. Cada uno se analiza individualmente con decisión pendiente al final.

---

## MF-1 — XSS almacenado en la vista previa de reportes

**Severidad:** crítica (seguridad) · **Archivos:** `js/core/indexx-firma.js:105`, `js/core/indexx-firma.js:288`

### Qué es
La vista previa de un reporte se renderiza como `<iframe srcdoc="...">` **sin atributo `sandbox`**. Un iframe `srcdoc` hereda el origen de la página padre; sin `sandbox`, cualquier `<script>` dentro del reporte se ejecuta con acceso total a la app.

### Caso concreto (ataque)
1. Un usuario autenticado cualquiera (rol analista) publica o importa un reporte que trae un `<script>` (la ruta `POST /api/sign-sessions/import` acepta cualquier HTML; `POST /api/sign-sessions` igual).
2. El revisor o el admin abre esa sesión desde la bandeja → `_firmaOpenSession` → `firmaLoadHtml` → iframe sin sandbox.
3. El script corre en el origen de la app (GitHub Pages) y puede:
   - leer `sessionStorage['auth_token']` → llamar la API como la víctima (bandeja, usuarios, dispositivos, auditoría; si es admin: purga, roles, 2FA);
   - leer el DOM del padre mientras el revisor escribe su **código de firma + contraseña** en el modal → esas credenciales permiten firmar *como* esa persona.

### Fix mínimo propuesto
Añadir `sandbox` (sin `allow-scripts` ni `allow-same-origin`) a los dos sitios que crean el iframe:

```js
// js/core/indexx-firma.js:105 y :288
preview.innerHTML = '<iframe sandbox srcdoc="' + escapeHtml(html).replace(/"/g,'&quot;') + '" style="width:100%;height:100%;border:none;min-height:70vh"></iframe>';
```

(opcional) insertar `sandbox` también donde se crea el iframe por `document.createElement`, si se migra más adelante.
Los reportes son HTML estático (imágenes/tablas, sin JS necesario), así que el sandbox no debería romper la vista previa.

### Verificación
- Test unitario en `tests/firma-open.test.js` (o nuevo): renderizar el preview y afirmar que el HTML contiene `iframe sandbox`.
- Prueba manual: publicar un reporte con `<script>alert(document.domain)</script>` y abrirlo → no debe ejecutarse.
- Confirmar que un reporte real (el de producción con JPEGs) sigue mostrándose en el preview.

### Si se omite
Un usuario interno puede robar la sesión del revisor o del admin y sus credenciales de firma. Es explotable hoy, sin herramientas raras.

### Decisión pendiente
- [ ] Aplicar fix (sandbox en ambos sitios + test)
- [ ] Alternativa: sanitizar el HTML al cargar (quitar `<script>`) — más código, mismo efecto
- [ ] Aceptar riesgo (documentar por qué)

---

## MF-2 — Carrera en la cadena de auditoría (hash chain)

**Severidad:** crítica (integridad de datos GxP) · **Archivo:** `backend/database.js:333-359` (y mismo patrón en `createSnapshot` → `logAuditEvent`, `database.js:539-551`)

### Qué es
Cada escritura de auditoría hace **dos queries separadas y sin transacción**: `_getLastRowHash()` (lee el último `row_hash`) y luego el `INSERT` que encadena con ese hash. La ruta PG es `buildPostgres()`; el store local (tests) no puede reproducir la carrera porque es un solo proceso serial.

### Caso concreto (fallo)
1. Dos usuarios (o dos pestañas, o login + firma en paralelo) escriben auditoría casi al mismo tiempo.
2. Ambos `SELECT` leen el **mismo** `prev_hash` (id N-2).
3. La segunda fila insertada queda con `prev_hash` del N-2, pero la primera fila ya ocupa ese lugar → `verifyAuditChain` recalcula y **falla**: `{ valid: false, brokenAt: <id>, reason: 'row_hash mismatch' }` → `/api/audit/verify` reporta cadena rota (parece manipulación).
4. Remediar requiere re-migrar hashes manualmente.

### Fix mínimo propuesto
Serializar lectura + inserción en una transacción por escritura. Con `pg`:

```js
// dentro de buildPostgres(): helper para logAccess/logAuditEvent
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(824543)'); // serializa la cadena
  const prev = await client.query('SELECT row_hash FROM audit_log ORDER BY id DESC LIMIT 1');
  // ...calcular rowHash con prev.rows[0]?.row_hash || null...
  await client.query('INSERT INTO audit_log (...) VALUES (...)', [...]);
  await client.query('COMMIT');
} catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
```

Alternativa equivalente: `LOCK TABLE audit_log IN EXCLUSIVE MODE` dentro de la transacción.
La carga (pocas escrituras/segundo) hace que serializar no cueste nada.

### Verificación
- Test de integración contra PostgreSQL real (docker en CI): lanzar 2 (o 10) escrituras concurrentes con `Promise.all` y luego `verifyAuditChain()` → `valid: true`.
- Sin PG: script manual contra staging (Supabase) con el mismo patrón.
- **Nota:** los 67 tests backend pasan hoy con la carrera presente (store local). No hay test que la cubra.

### Si se omite
Cualquier día con dos personas trabajando seguido, la verificación de auditoría da "cadena rota" — la evidencia que se muestra en inspecciones.

### Decisión pendiente
- [ ] Aplicar fix en `logAccess` + `logAuditEvent` (+ snapshot)
- [ ] Añadir además test de integración con PG (¿docker en CI?)
- [ ] Aceptar riesgo (documentar por qué)

---

## MF-3 — El límite de 100 KB rompe `amend` y snapshots WORM

**Severidad:** alta (funcionalidad rota en datos reales) · **Archivos:** `backend/server.js:127-137` (selección de parser), rutas afectadas: `POST /api/sign-sessions/:id/amend` (`server.js:1231`), `POST /api/snapshots` (`server.js:815`)

### Qué es
Solo dos rutas aceptan cuerpos grandes (>100 KB); todo lo demás usa el parser de 100 KB:

```js
// server.js:132-137
if (req.method === 'POST' && (req.path === '/api/sign-sessions' || req.path === '/api/sign-sessions/import')) {
    return _jsonReport(req, res, next);   // 5mb
}
return _jsonSmall(req, res, next);        // 100kb
```

`amend` reenvía el **HTML completo del reporte** (≈1 MB con JPEGs según el comentario de `server.js:127`). `/api/snapshots` guarda hojas de cálculo completas como JSON. Ambos mueren con **413** antes de entrar a la ruta.

### Caso concreto (fallo)
1. Reporte generado con imágenes (~1 MB).
2. Llamada a `POST /api/sign-sessions/:id/amend` con ese HTML → 413 Payload Too Large; la ruta nunca corre.
3. Igual para `POST /api/snapshots` con un xlsx real (el feature WORM de la Fase 0).
Los tests backend no lo detectan porque llaman a las funciones de `database.js` directamente, no por HTTP.

### Fix mínimo propuesto
Extender la condición del parser (dos rutas más):

```js
const _esAmend = /^\/api\/sign-sessions\/\d+\/amend$/.test(req.path);
if (req.method === 'POST' && (req.path === '/api/sign-sessions' || req.path === '/api/sign-sessions/import' || req.path === '/api/snapshots' || _esAmend)) {
    return _jsonReport(req, res, next);
}
```

Hoy `amend` no tiene botón en la UI (hallazgo aparte), así que el fix se nota al cablear la función o al probar la ruta con curl.

### Verificación
- Test backend (store local): POST a `/api/sign-sessions/:id/amend` con body de ~1 MB → debe responder 200/409/422, nunca 413.
- Smoke manual: publicar un reporte real grande, llamar `amend` por curl con su HTML y confirmar que actualiza y cambia el `doc_hash`.

### Si se omite
La enmienda de reportes es inusable el día que se cablee su botón, y el WORM (snapshots) no puede guardar ninguna hoja real. Feature documentado como existente que no funciona.

### Decisión pendiente
- [ ] Aplicar fix (ampliar condición del parser + test de tamaño)
- [ ] Aceptar riesgo (documentar por qué)

---

## Orden sugerido y dependencias

| Orden | Hallazgo | Dependencias | Esfuerzo estimado |
|---|---|---|---|
| 1 | MF-1 (XSS) | ninguna | ~4 líneas + test |
| 2 | MF-2 (cadena auditoría) | decidir si se agrega test con PG | ~30 líneas + decisión de infra |
| 3 | MF-3 (413) | ninguna (se nota más si se cablea `amend`) | ~3 líneas + test |

Regla de la casa antes de tocar: informe de seguridad (`node -c`, referencias, dependencias, riesgo de rotura) y verificación con extractor/suites según corresponda. Al aprobar cada uno: aplicar → `ESTADO_PROYECTO.md` → commit + push.

---

*Fuente: auditoría de repo del 2026-10-16 (informe completo en el historial de sesión). Este archivo solo cubre los 3 Must fix; los Should fix / Nice to have quedaron en el informe verbal.*
