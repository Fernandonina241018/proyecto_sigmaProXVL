# Plan de remediación seguridad

**Auditoría:** 2026-04-05 · **24 hallazgos** (8 HIGH, 12 MEDIUM, 4 LOW)  
**Relacionado:** `04_CODE_GUIDELINES.md` (XSS) · `06_POLICIES.md` (bloqueantes)

## Prioridad inmediata

| P | Sev | Archivo | Problema | Fix |
|---|-----|---------|----------|-----|
| 1 | HIGH | ReporteManager.js ~1012-1108 | `meta.*`, `${col}` en HTML sin escape | Envolver con `escapeHtml()` |
| 2 | HIGH | script.js ~619 | Columnas en `<li>${c}</li>` | `escapeHtml(c)` |
| 8 | HIGH | auth.js, PermisosManager | Sesión en sessionStorage manipulable | Validar JWT servidor / firmar sesión |
| 3 | MED | index.html ~463 | Chart.js CDN sin SRI | `integrity` + `crossorigin` |
| 4 | MED | auth.js, script.js | API_URL duplicada 3× | Centralizar en `utils.js` → `window.API_URL` |
| 5 | MED | ReporteManager ~376 | Hash djb2 no criptográfico | `crypto.subtle.digest('SHA-256', ...)` |
| 6 | MED | script.js ~269 | Sin límite tamaño archivo | Max 10MB antes de `readAsText` |
| 7 | LOW | script.js ~783,1155 | `console.log` datos/sesión | Eliminar o `DEBUG` flag |

### P1 — escapeHtml en reportes

```js
// ❌ `${meta.descripcion}`
// ✅ `${escapeHtml(meta.descripcion)}`
```

Campos: `organizacion`, `ensayo`, `fase`, `protocolo`, `codigoProyecto`, `version`, `confidencialidad`, `departamento`, `ubicacion`, `modelo`, `marca`, `serial`, `descripcion`, headers `${col}`.

### P5 — hash SHA-256 (esquema)

```js
async function generateHash(meta, res) {
    const data = new TextEncoder().encode(JSON.stringify({ meta, r: res?.totalFilas }));
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).slice(0,8)
        .map(b => b.toString(16).padStart(2,'0')).join('').toUpperCase();
}
```

### P6 — límite archivo

```js
if (file.size > 10 * 1024 * 1024) {
    _showToast('Máx. 10MB', true); return;
}
```

## Backlog (post-P1–P8)

| Sev | Finding | Ubicación |
|-----|---------|-----------|
| MED | CORS wildcard sin Origin | backend/server.js:49 |
| MED | Sin CSRF en cookies | backend |
| MED | Datos sensibles localStorage | StateManager.js:604-624 |
| MED | Sin token revocation | auth |
| MED | `credentials: 'include'` + CORS wildcard | fetch |
| MED | Sin CSP | global |
| LOW | 28+ inline onclick | index.html |
| LOW | onclick en HTML dinámico | script.js, auth.js |
| LOW | Google Fonts externas en reportes | ReporteManager |
| LOW | HTTP origins CORS dev | backend |

## Estimación

| Bloque | Tiempo |
|--------|--------|
| P1–P3, P6–P7 | ~1 h |
| P4–P5 | ~25 min |
| P8 (auth) | ~1 h (arquitectura) |
| **Total core** | **~2.5 h** |

## Estado tracking

Marcar aquí al completar: `[ ]` P1 · `[ ]` P2 · `[ ]` P3 · `[ ]` P4 · `[ ]` P5 · `[ ]` P6 · `[ ]` P7 · `[ ]` P8

Al cerrar P1/P2: actualizar `05_BUGS_AND_DECISIONS.md` y bajar DT-006.
