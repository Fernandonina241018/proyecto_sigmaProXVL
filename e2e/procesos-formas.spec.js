// Regresión: el combobox de Procesos mostraba todas las formas aunque el
// grupo elegido fuera Sólidos. El atributo `hidden` de las opciones lo pisaba
// `display:block` en CSS, así que había que comprobar píxeles, no `hidden`.
const { test, expect } = require('@playwright/test');

const ADMIN = { user: 'e2e_admin', pass: 'E2ePass123!' };

test('procesos: el combobox solo lista formas del grupo elegido', async ({ page }) => {
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

  await page.goto('/indexx.html#/entidad/procesos');
  await expect(page.locator('.v7-grupo')).toBeVisible({ timeout: 15000 });

  const visibles = () => page.locator('.v7-ent-opt').evaluateAll((els) =>
    els.filter((e) => e.getBoundingClientRect().height > 0).map((e) => e.textContent.trim()));

  await page.locator('.v7-grupo').selectOption('solidos');
  await page.waitForTimeout(300);
  expect(await visibles()).toEqual(['Comprimidos', 'Cápsulas', 'Granulados', 'Polvos']);

  await page.locator('.v7-grupo').selectOption('semisolidos');
  await page.waitForTimeout(300);
  expect(await visibles()).toEqual(['Cremas', 'Pomadas', 'Geles']);

  await page.locator('.v7-grupo').selectOption('solidos');
  await page.waitForTimeout(300);
  expect(await visibles()).not.toContain('Cremas');
  expect(await visibles()).not.toContain('Soluciones');

  await page.locator('[data-ent="comprimidos"]').click();
  await expect(page.locator('.v7-field[data-f="tipoGranulacion"]')).toBeVisible();

  await page.locator('.v7-grupo').selectOption('semisolidos');
  await page.waitForTimeout(300);
  await page.locator('[data-ent="cremas"]').click();
  await expect(page.locator('.v7-field[data-f="tipoGranulacion"]')).toBeHidden();
});
