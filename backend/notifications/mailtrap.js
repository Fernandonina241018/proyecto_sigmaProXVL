// backend/notifications/mailtrap.js — Mailtrap Email Provider
// Usa MAILTRAP_API_TOKEN + MAILTRAP_INBOX_ID (sandbox) o dominio verificado en prod.
// No hardcodea credenciales; retorna { ok, providerMsgId } o { ok:false, error }.

async function sendMailtrap({ to, subject, html, text, category }) {
  const token = process.env.MAILTRAP_API_TOKEN;
  const inboxId = process.env.MAILTRAP_INBOX_ID;
  if (!token) return { ok: false, error: 'MAILTRAP_API_TOKEN no configurado' };
  if (!to || !to.includes('@')) return { ok: false, error: 'destinatario inválido' };

  const fromEmail = process.env.MAIL_FROM_EMAIL || 'noreply@sigmaproxvl.fly.dev';
  const fromName = process.env.MAIL_FROM_NAME || 'SigmaProXVL';

  // Sandbox en dev (captura sin entregar), producción con dominio verificado.
  const isSandbox = !!inboxId && process.env.NODE_ENV !== 'production';
  const url = isSandbox
    ? `https://sandbox.api.mailtrap.io/api/send/${inboxId}`
    : 'https://send.api.mailtrap.io/api/send';

  const payload = {
    from: { email: fromEmail, name: fromName },
    to: [{ email: to }],
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
    category: category || 'SigmaProXVL Notification',
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      const err = data.errors ? data.errors.join('; ') : `HTTP ${res.status}`;
      return { ok: false, error: err, status: res.status, data };
    }
    const providerMsgId = (data.message_ids && data.message_ids[0]) || data.message_id || null;
    return { ok: true, providerMsgId, data };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

module.exports = { sendMailtrap };
