// ========================================
// totp.js — Helpers TOTP de StatAnalyzer Pro
// otplib v13 eliminó `authenticator`: la API es funcional y `verifySync`
// devuelve un objeto con `valid`. Se aíslan de server.js para que los tests
// ejerciten exactamente el código de producción (no una copia).
// ========================================
const { generateURI, verifySync } = require('otplib');

const ISSUER = 'StatAnalyzer Pro';

// Verificación síncrona. Cualquier token mal formado ('' , undefined, '123')
// cuenta como inválido: verifySync lanza y aquí se convierte en `false`.
function verifyTOTP(token, secret) {
    try {
        return verifySync({ token: String(token), secret }).valid === true;
    } catch {
        return false;
    }
}

// URI otpauth que consume el QR de enrolamiento.
function totpKeyuri(label, secret) {
    return generateURI({ issuer: ISSUER, label, secret });
}

module.exports = { verifyTOTP, totpKeyuri };
