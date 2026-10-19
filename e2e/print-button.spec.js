// LOTE E — E2E: botón "Imprimir" de la página de firma debe abrir una ventana
// con el reporte. El #printButton que viaja dentro del HTML NO sirve en el
// preview: el reporte vive en un iframe sandbox y sin allow-scripts los
// onclick inline no se ejecutan (comprobado en Chromium).
const { test, expect } = require('@playwright/test');

const HTML_REPORTE = `<!DOCTYPE html><html><head><title>R</title></head><body>
<div class="doc">
  <div data-signature-role="prepared"><div>Preparado</div>
    <div><span data-signature-field="name" data-signature-role="prepared">Ana</span></div>
    <div><span data-signature-field="title" data-signature-role="prepared">—</span></div>
    <div><span data-signature-field="firma" data-signature-role="prepared">—</span></div>
    <div><span data-signature-field="date" data-signature-role="prepared">—</span></div>
  </div>
  <div id="printButton"><button onclick="window.print()">🖨️ Imprimir / PDF</button></div>
</div></body></html>`;

test('el botón Imprimir de la página de firma abre el reporte en una ventana', async ({ page }) => {
  await page.goto('/indexx.html');
  await page.fill('#auth-user', 'e2e_admin');
  await page.fill('#auth-pass', 'E2ePass123!');
  await page.click('#auth-btn-login');

  const overlay = page.locator('#area-select-overlay');
  try {
    await expect(overlay).toBeVisible({ timeout: 10000 });
    await overlay.locator('[data-area="estadistica"]').click();
    await expect(overlay).toBeHidden({ timeout: 5000 });
  } catch { /* área ya elegida */ }

  await page.click('.snav-card[data-page="firmarReporte"]');
  await expect(page.locator('#firmaPrintBtn')).toBeVisible({ timeout: 15000 });

  // Cargar el reporte en el preview
  await page.evaluate((html) => { window.firmaLoadHtml(html, 'probe.html'); }, HTML_REPORTE);
  await page.waitForTimeout(400);

  // El botón muerto del HTML no debe quedar dentro del iframe (sandbox)
  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue;
    expect(await f.locator('#printButton').count()).toBe(0);
  }

  // Click en el botón de la app → ventana con el reporte
  const popupPromise = page.waitForEvent('popup', { timeout: 8000 });
  await page.locator('#firmaPrintBtn').click();
  const popup = await popupPromise;
  expect(await popup.locator('.doc').count()).toBeGreaterThan(0);
  await popup.close();
});
