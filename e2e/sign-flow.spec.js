// LOTE E — E2E flujo crítico: login → bandeja pendientes → abrir → firmar.
// Semilla vía API (backend real, store local efímero).
const { test, expect } = require('@playwright/test');

const API = 'http://localhost:3000';
const PASS = 'Pass123!';
let E2E_USERS = { pub: 'e2e_pub', rev: 'e2e_rev', sup: 'e2e_sup' };
let sessionName;

async function api(request, method, path, token, body) {
  const res = await request.fetch(API + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  const adminTok = login.json.token;

  // Usuarios únicos por run: evita estado heredado de data.json local
  const SFX = Date.now().toString(36);
  E2E_USERS = {
    pub: 'e2e_pub_' + SFX, rev: 'e2e_rev_' + SFX, sup: 'e2e_sup_' + SFX,
  };
  const U = E2E_USERS;
  const mk = async (u) => api(request, 'POST', '/api/users', adminTok, u);
  await mk({ username: U.pub, password: PASS, role: 'analista', signatureCode: 'PUB-' + SFX });
  await mk({ username: U.rev, password: PASS, role: 'analista', signatureCode: 'REV-' + SFX });
  await mk({ username: U.sup, password: PASS, role: 'supervisor', signatureCode: 'SUP-' + SFX });

  sessionName = 'RPT-E2E-' + Date.now();
  const blk = (role, label) =>
    `<div data-signature-role="${role}"><div>${label}</div>` +
    ['name', 'title', 'firma', 'date'].map((f) =>
      `<span data-signature-field="${f}" data-signature-role="${role}">—</span>`).join('') +
    `</div>`;
  const html = `<html><body>${blk('prepared', 'Preparado por')}${blk('reviewed', 'Revisado por')}${blk('approved', 'Aprobado por')}</body></html>`;
  const pub = await api(request, 'POST', '/api/sign-sessions', adminTok, {
    name: sessionName, html,
    assignedReviewer: E2E_USERS.rev, assignedApprover: E2E_USERS.sup,
    signatureCode: 'PUB-' + SFX, password: PASS,
  });
  if (!pub.json.ok) throw new Error('publish E2E falló: ' + JSON.stringify(pub.json));
});

async function loginAs(page, username, password) {
  const pw = password || PASS;
  await page.goto('/indexx.html');
  await page.fill('#auth-user', username);
  await page.fill('#auth-pass', pw);
  await page.click('#auth-btn-login');
  // Cambio forzado en primer login: reemplaza password Y signatureCode
  const forced = await maybeForcePassword(page, pw);
  const creds = forced || { password: pw, sigCode: null };
  await expect(page.locator('.nav-item[data-page="datos"]')).toBeVisible({ timeout: 15000 });
  return creds;
}

async function maybeForcePassword(page, pw) {
  const forceModal = page.locator('#force-pwd-modal');
  try {
    await expect(forceModal).toBeVisible({ timeout: 12000 });
  } catch {
    return null; // sin modal
  }
  await page.fill('#force-pwd-new', 'New' + pw);
  await page.fill('#force-pwd-confirm', 'New' + pw);
  const fsig = 'FSG-' + Date.now().toString(36);
  await page.fill('#force-pwd-sig', fsig);
  await page.click('#force-pwd-submit');
  await expect(forceModal).toBeHidden({ timeout: 15000 });
  return { password: 'New' + pw, sigCode: fsig };
}

async function clickNav(page, name, creds) {
  for (let i = 0; i < 3; i++) {
    // Si el modal forzado apareció tarde, resolverlo primero (con la
    // password ORIGINAL: el modal solo sale si nunca se cambió)
    const late = await maybeForcePassword(page, PASS);
    if (late) creds = late;
    try {
      await page.click(`.nav-item[data-page="${name}"]`, { timeout: 8000 });
      return creds;
    } catch (e) {
      if (i === 2) throw e;
    }
  }
  return creds;
}

test('revisor ve pendiente, abre y firma; sale de sus pendientes', async ({ page }) => {
  let creds = await loginAs(page, E2E_USERS.rev);
  creds = await clickNav(page, 'firmarReporte', creds);

  const item = page.locator('#firmaBandejaList', { hasText: sessionName });
  await expect(item).toBeVisible({ timeout: 15000 });
  await item.click();

  const editor = page.locator('#firmaSignatureEditor');
  await expect(editor.getByText('Revisado', { exact: false }).first()).toBeVisible({ timeout: 15000 });

  await page.fill('#firmaCodeInput-reviewed', creds.sigCode);
  await editor.getByRole('button', { name: /Firmar/ }).click();

  const modal = page.locator('.modal-overlay').last();
  await modal.locator('input[type="password"]').fill(creds.password);
  await modal.getByRole('button', { name: /Verificar/ }).click();

  // Modal post-firma con resumen y dismiss
  const done = page.locator('.modal-overlay', { hasText: 'Revisión registrada' });
  await expect(done).toBeVisible({ timeout: 15000 });
  await done.getByRole('button', { name: /Entendido/ }).click();

  // Ya no aparece en sus pendientes
  await expect(page.locator('#firmaBandejaList', { hasText: sessionName })).toHaveCount(0, { timeout: 15000 });
});
