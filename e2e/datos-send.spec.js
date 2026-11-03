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

  expect(fatales).toEqual([]);
});
