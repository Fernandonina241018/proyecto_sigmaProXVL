// backend/notifications/index.js — Enqueue + delivery (solo publish, título+firmante)
// No toca verifyAuditChain; idempotente por (session, recipient, channel).

const { sendMailtrap } = require('./mailtrap');

function buildEmailContent({ session, preparer }) {
  const title = session.name || 'Reporte';
  const who = [preparer.nombre, preparer.apellido].filter(Boolean).join(' ') || preparer.username || 'Usuario';
  const code = preparer.signature_code ? ` (${preparer.signature_code})` : '';
  const frontend = (process.env.FRONTEND_URL || 'https://fernandonina241018.github.io/proyecto_sigmaProXVL').replace(/\/$/, '');
  const link = `${frontend}/#firmarReporte?id=${session.id}`;
  const subject = `[SigmaProXVL] Nueva publicación: "${title}" — por ${who}${code}`;
  const html = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#111827"><tr><td style="padding:18px 22px 14px;border-bottom:1px solid #e5e7eb"><div style="font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:#6b7280;font-weight:700">◈ SigmaProXVL — Nueva publicación</div></td></tr><tr><td style="padding:22px 22px 10px"><div style="font-size:18px;font-weight:800;line-height:1.25;color:#111827">${escapeHtml(title)}</div><div style="margin-top:6px;font-size:13px;color:#4b5563;line-height:1.5">Publicado por <b style="color:#111827">${escapeHtml(who)}</b>${code ? ` · <span style="font-family:ui-monospace,monospace;background:#f3f4f6;border:1px solid #e5e7eb;padding:1px 6px;border-radius:999px;font-size:12px">${escapeHtml(code.trim().replace(/[()]/g,''))}</span>` : ''}</div></td></tr><tr><td style="padding:10px 22px 18px"><a href="${link}" style="display:inline-block;text-decoration:none;background:#111827;color:white;padding:10px 16px;border-radius:999px;font-size:13px;font-weight:700">Ver en bandeja →</a><div style="margin-top:14px;padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;font-size:12px;color:#6b7280">Solo ves título y firmante. Documento completo en la bandeja (firma 21 CFR 11).</div></td></tr><tr><td style="padding:14px 22px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:11px;color:#6b7280">Recibes esto por tener acceso en SigmaProXVL. Gestionar en Perfil → Notificaciones.<br><span style="color:#9ca3af">ID: ${session.id}</span></td></tr></table>`;
  const text = `SigmaProXVL — Nueva publicación\n"${title}"\nPublicado por ${who}${code}\nVer: ${link}\nSolo título y firmante.`;
  return { subject, html, text };
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Encola entregas para todos los usuarios con on_publish=true (default), excluyendo al creador.
// Llamar sin await: void enqueueNotifications(db, session, preparer)
async function enqueueNotifications(db, session) {
  try {
    const users = await db.getAllUsers(500, 0);
    const eligible = users.filter(u => u.active === 1 && u.username !== session.created_by && u.email && u.email.includes('@'));
    // Filtrar por preferencia (default true si no existe fila)
    const deliveries = [];
    for (const u of eligible) {
      const pref = await db.getNotificationPreference(u.username).catch(() => null);
      const enabled = pref ? !!pref.on_publish : true;
      if (!enabled) {
        const d = await db.createNotificationDelivery({
          signSessionId: session.id,
          recipientUsername: u.username,
          recipientEmail: u.email,
          channel: 'email',
          status: 'skipped_optout',
          error: null,
        });
        deliveries.push(d);
        await db.logAuditEvent({ username: 'system', action: 'NOTIFICATION_SKIPPED_OPTOUT', success: 1, ip: '', userAgent: '', module: 'NOTIF', details: { sessionId: session.id, recipient: u.username } }).catch(()=>{});
        continue;
      }
      // Idempotencia: si ya existe delivery sent/queued para esta sesión+destinatario, skip
      const existing = await db.getNotificationDelivery(session.id, u.username, 'email').catch(()=>null);
      if (existing && (existing.status === 'sent' || existing.status === 'queued')) {
        deliveries.push(existing);
        continue;
      }
      const d = await db.createNotificationDelivery({
        signSessionId: session.id,
        recipientUsername: u.username,
        recipientEmail: u.email,
        channel: 'email',
        status: 'queued',
        error: null,
      });
      deliveries.push(d);
      await db.logAuditEvent({ username: 'system', action: 'NOTIFICATION_ENQUEUED', success: 1, ip: '', userAgent: '', module: 'NOTIF', details: { sessionId: session.id, recipient: u.username } }).catch(()=>{});
    }

    // Enviar async sin bloquear (fire-and-forget por entrega)
    for (const d of deliveries) {
      if (d.status !== 'queued') continue;
      const recipient = eligible.find(u => u.username === d.recipient_username);
      if (!recipient) continue;
      // Obtener preparer para contenido
      const preparerUser = await db.getUserByUsername(session.created_by).catch(()=>null);
      const preparer = preparerUser || { username: session.created_by, nombre: session.created_by, apellido: '', signature_code: '' };
      const content = buildEmailContent({ session, preparer });
      sendMailtrap({ to: recipient.email, subject: content.subject, html: content.html, text: content.text }).then(async (res) => {
        if (res.ok) {
          await db.updateNotificationDelivery(d.id, { status: 'sent', provider_msg_id: res.providerMsgId }).catch(()=>{});
          await db.logAuditEvent({ username: 'system', action: 'NOTIFICATION_SENT', success: 1, ip: '', userAgent: '', module: 'NOTIF', details: { sessionId: session.id, recipient: recipient.username, providerMsgId: res.providerMsgId } }).catch(()=>{});
        } else {
          await db.updateNotificationDelivery(d.id, { status: 'bounced', error: res.error }).catch(()=>{});
          await db.logAuditEvent({ username: 'system', action: 'NOTIFICATION_BOUNCED', success: 0, ip: '', userAgent: '', module: 'NOTIF', details: { sessionId: session.id, recipient: recipient.username, error: res.error } }).catch(()=>{});
        }
      }).catch(async (err) => {
        await db.updateNotificationDelivery(d.id, { status: 'bounced', error: String(err) }).catch(()=>{});
      });
    }
    return deliveries;
  } catch (err) {
    console.error('enqueueNotifications error:', err.message);
    return [];
  }
}

module.exports = { buildEmailContent, enqueueNotifications };
