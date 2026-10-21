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

  test('la vista previa sigue en sandbox total (MF-1)', () => {
    expect((firma.match(/<iframe sandbox srcdoc=/g) || []).length).toBeGreaterThan(0);
    expect(firma).not.toMatch(/<iframe[^>]*sandbox="[^"]*allow-scripts/);
  });

  test('el #printButton del reporte se oculta SOLO en la vista previa', () => {
    expect(firma).toContain('#printButton{display:none!important}');
    expect(firma).toMatch(/iframe\.srcdoc = _firmaPreviewHtml\(/);
  });
});
