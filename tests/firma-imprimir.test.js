// REGRESIÓN: vista previa y acciones de la página de firma.
//
// El reporte se muestra dentro de un iframe sandbox SIN allow-scripts (MF-1),
// así que ningún script del propio reporte se ejecuta. El botón "Imprimir"
// viejo se eliminó (la descarga en PDF cubre la impresión). Estos tests vigilan
// que:
//   1) el botón viejo y su función no vuelvan,
//   2) la vista previa siga en sandbox sin allow-scripts (MF-1),
//   3) la vista previa conserve el scroll al firmarse,
//   4) la vista previa muestre el reporte sin estilos inyectados.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');
const firma = readFileSync(join(core, 'indexx-firma.js'), 'utf-8');
const ui = readFileSync(join(core, 'indexx-ui.js'), 'utf-8');

describe('impresión del reporte en la página de firma', () => {
  test('el botón Imprimir viejo ya no existe', () => {
    expect(ui).not.toContain('onclick="firmaPrint()"');
    expect(ui).not.toContain('🖨️ Imprimir');
    expect(firma).not.toContain('function firmaPrint');
  });

  test('la vista previa sigue en sandbox sin allow-scripts (MF-1)', () => {
    expect((firma.match(/<iframe sandbox="allow-same-origin" srcdoc=/g) || []).length).toBeGreaterThan(0);
    expect(firma).not.toMatch(/<iframe[^>]*sandbox="[^"]*allow-scripts/);
  });

  test('la vista previa conserva el scroll al firmarse', () => {
    // Al firmarse, el srcdoc se re-evalúa y el iframe volvía al inicio
    // (medido: 2464px → 0): el apartado 09 (firmas, a ~2600px) quedaba
    // fuera de la vista y el usuario creía que el reporte no tenía firmas.
    // En impresión y descarga sí se ve, porque ahí va el documento completo.
    expect(firma).toContain('_firmaPreviewSetHtml');
    expect(firma).toMatch(/iframe\.addEventListener\('load'[\s\S]{0,300}?scrollTo\(0, y\)/);
    expect(firma).toMatch(/_firmaPreviewSetHtml\(iframe, _firmaCurrentHtml\)/);
  });

  test('la vista previa muestra el reporte tal cual (sin estilos inyectados)', () => {
    // El reporte ya no trae botón de imprimir propio (se borró de generarHTML),
    // así que la vista previa lo muestra sin parcheos.
    expect(firma).not.toContain('_firmaPreviewHtml');
  });
});
