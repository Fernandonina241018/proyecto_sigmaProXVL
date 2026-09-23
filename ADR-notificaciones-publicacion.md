# ADR: Notificaciones por publicación (solo usuarios con acceso)

**Fecha:** 2026-09-23
**Estado:** Aprobado (preview validado con Mailtrap sandbox ID 5719043772)
**Decisión:** Email + campana in-app, solo evento `publish` (createSignSession), payload `título + firmante`, opt-in por usuario, retención 182d.

## Contexto
- Publicación = `POST /api/sign-sessions` crea sesión `prepared` con `doc_hash`, `name`, `signatures.prepared`.
- Requisitos confirmados: destinatarios = solo usuarios con acceso (tienen `users.email`); canal = email+campana; eventos = solo publicaciones; contenido = solo título+quien firmó; preferencias = opt-in por usuario.

## Decisión
1. **Destinatarios:** `SELECT username,email FROM users WHERE active=1` filtrado por `notification_preferences.on_publish = true` (default true) y excluyendo `createdBy`. Para reportes con visibilidad futura, intersectar con RBAC.
2. **Canales:** `email` vía Mailtrap (sandbox `sandbox.api.mailtrap.io/api/send/{inboxId}` en dev, `send.api.mailtrap.io` con dominio verificado en prod). Campana in-app vía polling `/api/notifications/deliveries` (no WebSocket).
3. **Eventos:** Solo `SIGN_SESSION_CREATE` (publish). No en `reviewed/approved/rejected/unsign`.
4. **Payload:** `subject: [SigmaProXVL] Nueva publicación: "{name}" — por {nombre} ({signature_code})`, `html/text` con título+firmante+link `/#firmarReporte?id={id}`. Sin `doc_hash`, sin `html` del reporte, sin PHI.
5. **Preferencias:** `notification_preferences(username PK, on_publish BOOLEAN DEFAULT 1, updated_at)` — toggle en Perfil (`PUT /api/me/notifications`). Default true, `false` => `skipped_optout` logueado.
6. **Entregas:** `notification_deliveries(id PK, sign_session_id FK, recipient_username, recipient_email, channel, status queued|sent|bounced|skipped_optout, provider_msg_id, error, created_at, updated_at)` — único por (session, recipient, channel). Purge 182d con `report_signatures` (cron 03:00 UTC).
7. **Hook:** post-`createSignSession` exitoso, `void enqueueNotifications(session)` async (no bloquea 200). Idempotente por unique constraint. Audit: `logAuditEvent action NOTIFICATION_ENQUEUED / SENT / SKIPPED_OPT OUT` sin tocar `verifyAuditChain`.

## Alternativas descartadas
- Webhook/SMS/Push: más superficie, coste, sin audit 21 CFR 11. Fase 3 opcional.
- Tabla `external_subscribers`: no necesaria (solo usuarios con acceso).

## Consecuencias
- Sin breaking changes: `sign-sessions.test.js` debe seguir 422 en flujos existentes.
- Nuevos env: `MAILTRAP_API_TOKEN`, `MAILTRAP_INBOX_ID` (dev), `FRONTEND_URL` (link), `MAIL_FROM_EMAIL/NAME`.
- Tests: 5 nuevos (publish ok, opt-out skip, idempotencia, RBAC, retención).

## Validación
- `node --check` backend + frontend, `vitest 214+5`, `backend 60+5`, `check mailtrap inbox 4925922` preview, `fly secrets set` para prod.
