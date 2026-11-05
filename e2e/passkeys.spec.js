// E2E — Passkeys (WebAuthn) como segundo factor rápido, con TOTP de respaldo.
// Usa el autenticador virtual de Chromium (CDP): no requiere hardware real.
// Requisitos del entorno: localhost es contexto seguro y el backend arranca
// con WEBAUTHN_RP_ID=localhost y WEBAUTHN_ORIGIN=http://localhost:5510.
//
// IMPORTANTE: el test crea un usuario propio. Activar 2FA en e2e_admin
// rompería los demás E2E que comparten el mismo backend.
const path = require('path');
const { test, expect } = require('@playwright/test');
const { generateSync } = require(path.join(__dirname, '..', 'backend', 'node_modules', 'otplib'));

const API = 'http://localhost:3000';
const PASS = 'PkPass123!';
let PK = { user: null, pass: PASS };

// Evita generar el TOTP justo antes del límite de 30 s y verificarlo después:
// el código cambiaría y el servidor (sin ventana) lo rechazaría.
async function codigoTOTP(secret) {
  const restante = 30000 - (Date.now() % 30000);
  if (restante < 3000) await new Promise((r) => setTimeout(r, restante + 100));
  return generateSync({ secret });
}

async function api(request, method, pathName, token, body) {
  const res = await request.fetch(API + pathName, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    data: body,
  });
  return { status: res.status(), json: await res.json().catch(() => ({})) };
}

test.beforeAll(async ({ request }) => {
  const login = await api(request, 'POST', '/api/login', null, {
    username: 'e2e_admin', password: 'E2ePass123!',
  });
  if (login.status !== 200) throw new Error('login admin E2E falló: ' + login.status);

  const sfx = Date.now().toString(36);
  PK.user = 'e2e_pk_' + sfx;
  const created = await api(request, 'POST', '/api/users', login.json.token, {
    username: PK.user,
    password: PK.pass,
    role: 'analista',
    signatureCode: 'PK-' + sfx,
  });
  if (created.status >= 400) throw new Error('crear usuario passkey falló: ' + JSON.stringify(created.json));

  // El usuario nace con contraseña temporal: se confirma vía API para que el
  // login por UI no muestre el modal de cambio obligatorio.
  const userLogin = await api(request, 'POST', '/api/login', null, {
    username: PK.user, password: PK.pass,
  });
  if (userLogin.status !== 200) throw new Error('login usuario passkey falló: ' + userLogin.status);
  const changed = await api(request, 'PUT', '/api/users/password', userLogin.json.token, {
    newPassword: PK.pass,
  });
  if (changed.status >= 400) throw new Error('confirmar contraseña falló: ' + JSON.stringify(changed.json));
});

async function rellenarCredenciales(page) {
  // Si la tarjeta recordada está visible, "Cambiar" revela el campo usuario.
  const change = page.locator('#av2-change-user');
  if (await change.isVisible().catch(() => false)) await change.click();
  await page.fill('#auth-user', PK.user);
  await page.fill('#auth-pass', PK.pass);
  await page.click('#auth-btn-login');
}

async function login(page) {
  await page.goto('/indexx.html?login=v2');
  await expect(page.locator('#auth-overlay.auth-v2')).toBeVisible();
  await rellenarCredenciales(page);
}

async function entrarAlArea(page) {
  const areaOverlay = page.locator('#area-select-overlay');
  await expect(areaOverlay).toBeVisible({ timeout: 20000 });
  await areaOverlay.locator('[data-area="estadistica"]').click();
  await expect(areaOverlay).toBeHidden({ timeout: 10000 });
}

test('passkey: registro con autenticador virtual, login sin TOTP y respaldo TOTP', async ({ page, request }) => {
  await login(page);
  await entrarAlArea(page);

  // 1) Activar TOTP (respaldo obligatorio antes de registrar la passkey).
  const token = await page.evaluate(() => Auth.getToken());
  const auth = { Authorization: 'Bearer ' + token };

  const setupRes = await request.post(API + '/api/2fa/setup', { headers: auth });
  expect(setupRes.ok()).toBeTruthy();
  const setup = await setupRes.json();
  const secret = setup.secret;

  const enableRes = await request.post(API + '/api/2fa/enable', {
    headers: auth,
    data: { token: await codigoTOTP(secret) },
  });
  expect(enableRes.ok()).toBeTruthy();

  // 2) Autenticador virtual de Chromium.
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  });
  expect(authenticatorId).toBeTruthy();

  // 3) Registrar la passkey desde la sesión (contraseña actual + WebAuthn).
  const registro = await page.evaluate((pass) => Auth.registrarPasskey(pass, 'Autenticador virtual'), PK.pass);
  expect(registro.ok, JSON.stringify(registro)).toBe(true);

  const listado = await page.evaluate(() => Auth.listarPasskeys());
  expect(listado.ok).toBe(true);
  expect(listado.credentials.length).toBe(1);
  expect(listado.credentials[0].deviceName).toBe('Autenticador virtual');

  // 4) Login: el segundo factor ofrece passkey.
  await page.evaluate(() => Auth.logout());
  await expect(page.locator('#auth-overlay.auth-v2')).toBeVisible({ timeout: 10000 });
  await rellenarCredenciales(page);

  await expect(page.locator('#auth-passkey-area')).toBeVisible({ timeout: 15000 });
  await page.click('#auth-btn-passkey');
  await expect(page.locator('#auth-progress')).toContainText('Passkey verificada', { timeout: 15000 });
  await entrarAlArea(page);

  // 5) Respaldo: el TOTP sigue funcionando si no se usa la passkey.
  await page.evaluate(() => Auth.logout());
  await expect(page.locator('#auth-overlay.auth-v2')).toBeVisible({ timeout: 10000 });
  await rellenarCredenciales(page);

  await expect(page.locator('#auth-totp')).toBeVisible({ timeout: 15000 });
  await page.fill('#auth-totp', await codigoTOTP(secret));
  // El auto-submit del sexto dígito hace el resto.
  await entrarAlArea(page);
});
