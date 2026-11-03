// E2E — Login V2 (rediseño) conviviendo con el login clásico.
// Activo solo con ?login=v2: el flujo real (credenciales → área → app)
// debe ser idéntico al de v1, incluido el error de credenciales.
const { test, expect } = require('@playwright/test');

const ADMIN = { user: 'e2e_admin', pass: 'E2ePass123!' };

test('login V2: credenciales incorrectas muestran error sin salir del rediseño', async ({ page }) => {
  await page.goto('/indexx.html?login=v2');

  const overlay = page.locator('#auth-overlay.auth-v2');
  await expect(overlay).toBeVisible();
  await expect(overlay.locator('#av2-card-title')).toHaveText('StatAnalyzer Pro');
  await expect(overlay.locator('#av2-info-toggle')).toBeVisible();

  await page.fill('#auth-user', ADMIN.user);
  await page.fill('#auth-pass', 'clave-incorrecta');
  await page.click('#auth-btn-login');

  await expect(page.locator('#auth-error')).toBeVisible();
  await expect(page.locator('#auth-error')).toContainText('Credenciales incorrectas');
  await expect(overlay).toBeVisible();
});

test('login V2: muestra las fases de conexión y verificación en la base de datos', async ({ page }) => {
  await page.goto('/indexx.html?login=v2');
  await expect(page.locator('#auth-overlay.auth-v2')).toBeVisible();

  // Retrasa la respuesta del backend para que las fases sean observables.
  await page.route('**/api/login', async (route) => {
    await new Promise((r) => setTimeout(r, 1200));
    await route.continue();
  });

  await page.fill('#auth-user', ADMIN.user);
  await page.fill('#auth-pass', ADMIN.pass);
  await page.click('#auth-btn-login');

  const progress = page.locator('#auth-progress');
  await expect(progress).toBeVisible();
  await expect(progress).toContainText('Conectando con el servidor');
  await expect(progress).toContainText('Verificando usuario y contraseña', { timeout: 2500 });
  await expect(progress).toContainText('base de datos');

  // El login real sigue funcionando después de las fases.
  await expect(page.locator('#area-select-overlay')).toBeVisible({ timeout: 15000 });
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

test('login V2: Recordar usuario marcado por defecto y opt-out persistente', async ({ page }) => {
  await page.goto('/indexx.html?login=v2');
  await expect(page.locator('#auth-overlay.auth-v2')).toBeVisible();
  await expect(page.locator('#auth-remember')).toBeChecked();

  await page.uncheck('#auth-remember');
  await page.reload();
  await expect(page.locator('#auth-overlay.auth-v2')).toBeVisible();
  await expect(page.locator('#auth-remember')).not.toBeChecked();

  await page.check('#auth-remember');
  await page.reload();
  await expect(page.locator('#auth-overlay.auth-v2')).toBeVisible();
  await expect(page.locator('#auth-remember')).toBeChecked();
});

test('login V2: al cerrar sesión reaparece la tarjeta recordada', async ({ page }) => {
  await page.goto('/indexx.html?login=v2');
  await expect(page.locator('#auth-overlay.auth-v2')).toBeVisible();

  await page.fill('#auth-user', ADMIN.user);
  await page.fill('#auth-pass', ADMIN.pass);
  await page.click('#auth-btn-login');

  const areaOverlay = page.locator('#area-select-overlay');
  await expect(areaOverlay).toBeVisible({ timeout: 15000 });
  await areaOverlay.locator('[data-area="estadistica"]').click();
  await expect(areaOverlay).toBeHidden({ timeout: 10000 });
  await page.waitForTimeout(1200); // deja completar la caché de /api/me

  await page.evaluate(() => Auth.logout());
  await expect(page.locator('#auth-overlay.auth-v2')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#av2-remembered')).toBeVisible();
  await expect(page.locator('#av2-remembered-name')).not.toHaveText('—');
});
