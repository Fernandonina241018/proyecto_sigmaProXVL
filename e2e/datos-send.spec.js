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

  // P1-L2: el menú de tests se puede buscar.
  await page.click('.menu-item[data-submenu="Statistical Analysis"]');
  await expect(page.locator('#statAnalysisDropdown')).toBeVisible();
  await page.fill('#statMenuSearch', 'shapiro');
  await expect(page.locator('[data-stat-item]').filter({ hasText: 'Shapiro' })).toBeVisible();
  await expect(page.locator('[data-stat-item]').filter({ hasText: 'Media Aritmética' })).toBeHidden();
  await page.evaluate(() => document.body.click());

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
  await expect(page.locator('#panelDatos')).toHaveAttribute('data-datos-init', '1', { timeout: 10000 });
  await expect(page.locator('main#panesContainer')).toHaveCount(1);
  await expect(page.locator('nav[aria-label="Módulos"]')).toHaveCount(1);
  await expect(page.locator('#tabNew')).toHaveCount(0);
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

  await expect(page.locator('#panelDatos')).toHaveAttribute('data-datos-init', '1', { timeout: 10000 });
  await page.locator('[data-act="pegar"]').click();
  const dialog = page.locator('.modal-box[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('[data-act="pegar"]')).toBeFocused();

  // P1 estadística: EDA actualiza el resumen y no inventa una decisión.
  await page.click('.snav-card[data-page="analisis"]');
  await expect(page.locator('#rightPaneTitle')).toHaveText('Análisis Estadístico');
  await page.evaluate(() => { if (typeof runEDA === 'function') runEDA(); });
  await expect(page.locator('.eda-header')).toBeVisible({ timeout: 25000 });
  await expect(page.locator('#analisisLastTest')).toHaveText('Análisis Exploratorio (EDA)');
  await expect(page.locator('#analisisLastDecision')).toHaveText('—');
  await expect(page.locator('.anl-result-summary .anl-sum-decision')).toHaveText('—');

  const edaReport = await page.evaluate(async () => {
    if (typeof ReporteManager === 'undefined' && window.__sigmaLoadGroup) {
      await window.__sigmaLoadGroup('reportes');
    }
    const r = StateManager.getUltimosResultados();
    const meta = { organizacion: 'E2E', nombreDataset: 'viz' };
    return {
      tipo: r && r.tipo,
      columnas: r && r.columnasAnalizadas ? r.columnasAnalizadas.length : 0,
      html: await ReporteManager.generarHTML(r, meta, 'hash-e2e'),
      txt: ReporteManager.generarTXT(r, meta, 'hash-e2e'),
      csv: ReporteManager.generarCSV(r, meta, 'hash-e2e')
    };
  });
  expect(edaReport.tipo).toBe('EDA');
  expect(edaReport.columnas).toBeGreaterThan(0);
  expect(edaReport.html).toContain('Análisis Exploratorio');
  expect(edaReport.txt).toContain('ANÁLISIS EXPLORATORIO');
  expect(edaReport.csv).toContain('Resumen');

  await page.click('.snav-card[data-page="datos"]');
  await expect(page.locator('#panelDatos')).toHaveAttribute('data-datos-init', '1', { timeout: 10000 });

  // P1-D: el shell no debe desbordar horizontalmente en móvil.
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

  // P1-F: interacción móvil real con el bottom nav (el sidebar no se usa en móvil).
  await page.click('#btnNext');
  await expect(page.locator('#rightPaneTitle')).toHaveText('Hoja de Trabajo');
  await page.click('#btnPrev');
  await expect(page.locator('#rightPaneTitle')).toHaveText('Gestión de Datos');

  // P1-L3: Análisis también responde a 390px.
  await page.click('#btnNext');
  await page.click('#btnNext');
  await expect(page.locator('#rightPaneTitle')).toHaveText('Análisis Estadístico');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

  expect(fatales).toEqual([]);
});
