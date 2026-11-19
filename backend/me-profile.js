// Perfil público que devuelve GET /api/me.
// Auditoría ZAP 2026-11-18: el endpoint hacía `...profile` sobre la fila de
// `SELECT *` y devolvía `password` (bcrypt), `totp_secret` y `signature_code`.
// El destructuring excluía `password_hash`, pero la columna se llama `password`
// (database.js:235), así que no excluía nada. Allowlist explícita de ahora en más.
'use strict';

const CAMPOS_PERFIL = [
    'id', 'username', 'nombre', 'apellido', 'email', 'telefono', 'avatar', 'cargo',
    'role', 'active', 'created_by', 'created_at', 'last_login', 'login_count',
    'updated_at', 'signature', 'last_ip_masked',
];

function perfilPublico(user) {
    const src = user && typeof user === 'object' ? user : {};
    const out = {};
    for (const campo of CAMPOS_PERFIL) {
        if (Object.prototype.hasOwnProperty.call(src, campo)) out[campo] = src[campo];
    }
    return out;
}

module.exports = { perfilPublico, CAMPOS_PERFIL };
