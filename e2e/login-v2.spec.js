// E2E — Login V2 (rediseño) conviviendo con el login clásico.
// Activo solo con ?login=v2: el flujo real (credenciales → área → app)
// debe ser idéntico al de v1, incluido el error de credenciales.
const { test, expect } = require('@playwright/test');

const ADMIN = { user: 'e2e_admin', pass: 'E2ePass123!' };

test('login V2: credenciales incorrectas muestran error sin salir del rediseño', async ({ page }) => {
  await page.goto('/indexx.html?login=v2');

  const overlay = page.locator('#auth-overlay.auth-v2');
  await expect(overlay).toBeVisible();
  await expect(overlay.locator('.av2-control-chart')).toBeVisible();

  await page.fill('#auth-user', ADMIN.user);
  await page.fill('#auth-pass', 'clave-incorrecta');
  await page.click('#auth-btn-login');

  await expect(page.locator('#auth-error')).toBeVisible();
  await expect(page.locator('#auth-error')).toContainText('Credenciales incorrectas');
  await expect(overlay).toBeVisible();
});

test('login V2: entra a la app y conserva el flujo de área', async ({ page }) => {
  await page.goto('/indexx.html?login=v2');
  await expect(page.locator('#auth-overlay.auth-v2')).toBeVisible();

  await page.fill('#auth-user', ADMIN.user);
  await page.fill('#auth-pass', ADMIN.pass);
  await page.click('#auth-btn-login');

  // Puerta de área post-login (igual que en v1).
  const areaOverlay = page.locator('#area-select-overlay');
  await expect(areaOverlay).toBeVisible({ timeout: 15000 });
  await areaOverlay.locator('[data-area="estadistica"]').click();
  await expect(areaOverlay).toBeHidden({ timeout: 10000 });

  await expect(page.locator('.snav-card[data-page="datos"]')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('#auth-overlay')).toHaveCount(0);
});
