// REGRESIÓN: el botón Imprimir de la página de firma.
//
// El reporte se muestra dentro de un iframe sandbox SIN allow-scripts (MF-1),
// así que el onclick="window.print()" que trae el propio reporte nunca se
// ejecuta: por eso la app ofrece su propio botón. Estos tests vigilan que:
//   1) el iframe de impresión NO gane allow-scripts (nada de JS del reporte),
//   2) el botón exista en la UI y se invoque desde el documento principal,
//   3) el #printButton del reporte se oculte SOLO en la vista previa.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');
const firma = readFileSync(join(core, 'indexx-firma.js'), 'utf-8');
const ui = readFileSync(join(core, 'indexx-ui.js'), 'utf-8');

describe('impresión del reporte en la página de firma', () => {
  test('la UI ofrece el botón Imprimir junto a la vista previa', () => {
    expect(ui).toContain('onclick="firmaPrint()"');
    expect(ui).toContain('🖨️ Imprimir');
  });

  test('firmaPrint imprime con un iframe sandbox SIN allow-scripts', () => {
    const m = firma.match(/setAttribute\(\s*'sandbox'\s*,\s*'([^']+)'/);
    expect(m).not.toBeNull();
    expect(m[1]).not.toMatch(/allow-scripts/);
    // allow-same-origin: sin esto el padre no puede invocar print() sobre el frame
    expect(m[1]).toMatch(/allow-same-origin/);
    expect(firma).toMatch(/contentWindow[\s\S]{0,600}?\.print\(\)/);
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
