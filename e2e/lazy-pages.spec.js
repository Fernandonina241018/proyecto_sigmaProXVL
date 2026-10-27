// E2E — Opción D (carga bajo demanda): las páginas pesadas se descargan al
// entrar (no en el núcleo) y, al cargarse, la app NO se rompe.
//
// Cubre el hueco que dejaba el E2E de firma: aquí se ejercitan en navegador
// real las 4 páginas diferidas:
//   · Reportes   (js/managers/ReporteManager.js)
//   · ML         (js/pages/ml.js)
//   · Validaciones (bancos de ensayos + docx; solo admin)
//   · EDA        (js/managers/EDAManager.js, al ejecutar el análisis)
//
// Cada test comprueba además que no haya errores fatales de JS (pageerror o
// console.error no esperados). Los 401/403/red de /api/ml se ignoran porque
// el ML Service local no está levantado en el preflight.
const { test, expect } = require('@playwright/test');

const ADMIN = { user: 'e2e_admin', pass: 'E2ePass123!' };

// Login como admin + selección de área (sessionStorage fresco por contexto).
async function loginAdmin(page, area) {
  await page.goto('/indexx.html');
  await page.fill('#auth-user', ADMIN.user);
  await page.fill('#auth-pass', ADMIN.pass);
  await page.click('#auth-btn-login');

  const overlay = page.locator('#area-select-overlay');
  await expect(overlay).toBeVisible({ timeout: 15000 });
  await overlay.locator(`[data-area="${area}"]`).click();
  await expect(overlay).toBeHidden({ timeout: 10000 });
}

// Recolecta errores fatales. Ignora los esperables en local (sin ML Service).
function collectFatal(page) {
  const fatales = [];
  page.on('pageerror', (e) => {
    fatales.push('pageerror: ' + (e && e.message ? e.message : String(e)));
  });
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const t = msg.text() || '';
    if (/api\/ml|Failed to load resource|net::ERR|401|403|404|504/.test(t)) return;
    fatales.push('console: ' + t);
  });
  return fatales;
}

test('Reportes se descarga bajo demanda y renderiza', async ({ page }) => {
  const fatales = collectFatal(page);
  await loginAdmin(page, 'estadistica');
  await expect(page.locator('.snav-card[data-page="datos"]')).toBeVisible({ timeout: 15000 });

  // El módulo NO está en el núcleo: se descarga al entrar.
  expect(await page.evaluate(() => typeof ReporteManager !== 'undefined')).toBe(false);

  await page.click('.snav-card[data-page="reportes"]');
  await expect(page.locator('#reportes-editor-container .rep-layout')).toBeVisible({ timeout: 25000 });
  expect(await page.evaluate(() => typeof ReporteManager !== 'undefined')).toBe(true);
  expect(fatales).toEqual([]);
});

test('ML se descarga bajo demanda y renderiza', async ({ page }) => {
  const fatales = collectFatal(page);
  await loginAdmin(page, 'estadistica');
  await expect(page.locator('.snav-card[data-page="datos"]')).toBeVisible({ timeout: 15000 });

  expect(await page.evaluate(() => typeof MLManager !== 'undefined')).toBe(false);

  await page.click('.snav-card[data-page="ml"]');
  await expect(page.locator('#ml-dataset-select')).toBeVisible({ timeout: 25000 });
  expect(await page.evaluate(() => typeof MLManager !== 'undefined')).toBe(true);
  expect(fatales).toEqual([]);
});

test('Validaciones descarga el banco de ensayos (admin)', async ({ page }) => {
  const fatales = collectFatal(page);
  await loginAdmin(page, 'validaciones');

  // El banco (~2,6 MB) se descarga al entrar al área.
  await expect(page.locator('.v7-view, .v7-top').first()).toBeVisible({ timeout: 35000 });
  expect(await page.evaluate(() => typeof BancoEquipos !== 'undefined')).toBe(true);
  expect(fatales).toEqual([]);
});

test('EDA se descarga bajo demanda al ejecutar el análisis', async ({ page }) => {
  const fatales = collectFatal(page);
  await loginAdmin(page, 'estadistica');
  await expect(page.locator('.snav-card[data-page="datos"]')).toBeVisible({ timeout: 15000 });

  expect(await page.evaluate(() => typeof EDAManager !== 'undefined')).toBe(false);

  // runEDA carga el grupo antes de necesitar datos; sin dataset muestra un
  // aviso, pero el módulo debe quedar disponible y no romper la app.
  await page.evaluate(() => { try { runEDA(); } catch (e) { /* sin datos */ } });
  await page.waitForFunction(() => typeof EDAManager !== 'undefined', null, { timeout: 25000 });
  expect(fatales).toEqual([]);
});
