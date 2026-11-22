// Token muerto (JWT de 8 h vencido, secreto rotado o revocado) → login.
// El backend marca esos 401 con code=AUTH_INVALID; el frontend debe salir,
// no quedarse con la app abierta que no carga nada.
const { test, expect } = require('@playwright/test');

const ADMIN = { user: 'e2e_admin', pass: 'E2ePass123!' };

test('token inválido: vuelve al login y retira el módulo', async ({ page }) => {
  await page.goto('/indexx.html');
  const rem = page.locator('#av2-remembered');
  if (await rem.isVisible().catch(() => false)) await rem.click();
  await page.fill('#auth-user', ADMIN.user);
  await page.fill('#auth-pass', ADMIN.pass);
  await page.click('#auth-btn-login');

  const area = page.locator('#area-select-overlay');
  await expect(area).toBeVisible({ timeout: 15000 });
  await area.locator('[data-area="validaciones"]').click();
  await expect(page.locator('#validaciones-app')).toBeVisible({ timeout: 30000 });

  // La sesión de cliente sigue vigente, pero el token ya no vale.
  await page.evaluate(async () => {
    const bad = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImUyZV9hZG1pbiJ9.firma-falsa';
    sessionStorage.setItem('auth_token', bad);
    await fetchWithTimeout(API_URL + '/api/me', { headers: { Authorization: 'Bearer ' + bad } });
  });

  await expect(page.locator('#auth-overlay')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#auth-overlay')).toContainText('sesión expiró');
  await expect(page.locator('#validaciones-app')).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.getItem('auth_token'))).toBeNull();
});
