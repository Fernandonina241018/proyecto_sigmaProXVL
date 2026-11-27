// E2E — Regresión: "Gestión de datos" → "Hoja de Trabajo".
//
// Bug reportado: tras cargar un archivo, el botón "📋 Trabajo" no hacía nada
// (los listeners del panel derecho se perdieron al migrar el panel izquierdo
// a data-act). Este test recorre el flujo real y comprueba que el dataset
// llega a la hoja de trabajo y se puede editar.
const { test, expect } = require('@playwright/test');

const ADMIN = { user: 'e2e_admin', pass: 'E2ePass123!' };

async function loginAdmin(page) {
  await page.goto('/indexx.html');
  await page.fill('#auth-user', ADMIN.user);
  await page.fill('#auth-pass', ADMIN.pass);
  await page.click('#auth-btn-login');
  const overlay = page.locator('#area-select-overlay');
  await expect(overlay).toBeVisible({ timeout: 15000 });
  await overlay.locator('[data-area="estadistica"]').click();
  await expect(overlay).toBeHidden({ timeout: 10000 });
  await expect(page.locator('#panelDatos')).toBeVisible({ timeout: 15000 });
  // initDatosPage() corre 60 ms después de renderizar el panel; sin esta
  // espera, setInputFiles puede disparar change antes de que exista listener.
  await expect(page.locator('#panelDatos')).toHaveAttribute('data-datos-init', '1', { timeout: 10000 });
}

test('cargar CSV y enviarlo a Hoja de Trabajo con el botón Trabajo', async ({ page }) => {
  const fatales = [];
  page.on('pageerror', (e) => fatales.push('pageerror: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const t = msg.text() || '';
    if (/api\/ml|Failed to load resource|net::ERR|401|403|404|504/.test(t)) return;
    fatales.push('console: ' + t);
  });

  await loginAdmin(page);

  await page.setInputFiles('#fileInput', {
    name: 'e2e_datos.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Grupo,Valor\nA,10\nA,12\nB,20\nB,22\n'),
  });
  await expect(page.locator('#datosRecordBadge')).toContainText('4 filas', { timeout: 10000 });

  await page.click('#btnSendToTrabajo');

  await expect(page.locator('#navCurrentPage')).toContainText('Hoja de Trabajo', { timeout: 10000 });
  await expect(page.locator('#trabajoTable')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#trabajoTable thead')).toContainText('Grupo');
  await expect(page.locator('body')).toContainText('4 filas');

  // P0 a11y: reutiliza este login para no agotar el rate limit (20/15 min).
  await page.click('.snav-card[data-page="datos"]');
  await expect(page.locator('main#panesContainer')).toHaveCount(1);
  await expect(page.locator('nav[aria-label="Módulos"]')).toHaveCount(1);
  await expect(page.locator('.snav-card[data-page="datos"]')).toHaveAttribute('aria-current', 'page');

  await page.locator('.skip-link').focus();
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#rightPaneTitle')).toBeFocused();
  await expect(page.locator('#rightPaneTitle')).toHaveText('Gestión de Datos');

  const trabajoTab = page.locator('[data-page-tab="trabajo"]');
  await trabajoTab.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#rightPaneTitle')).toHaveText('Hoja de Trabajo');
  await expect(trabajoTab).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Delete');
  await expect(page.locator('[data-page-tab="trabajo"]')).toHaveCount(0);
  await expect(page.locator('#rightPaneTitle')).toHaveText('Gestión de Datos');
  await expect(page.locator('[data-page-tab="datos"]')).toBeFocused();

  await page.locator('[data-act="pegar"]').click();
  const dialog = page.locator('.modal-box[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('[data-act="pegar"]')).toBeFocused();

  expect(fatales).toEqual([]);
});
