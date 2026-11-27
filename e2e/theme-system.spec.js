// P1-B — tema del sistema y reduced motion. No inicia sesión: no consume
// el rate limit de login (20/15 min) que ya usan los demás E2E.
const { test, expect } = require('@playwright/test');

test('tema: sigue prefers-color-scheme si no hay preferencia guardada', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/indexx.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(null);

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');

  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('reduced motion: el shell no anima transiciones', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/indexx.html');
  const duration = await page.locator('#sidebar').evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(parseFloat(duration)).toBeLessThan(0.01);
});
