import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const ui = readFileSync(join(root, 'js', 'core', 'indexx-ui.js'), 'utf8');
const viz = readFileSync(join(root, 'js', 'core', 'indexx-viz.js'), 'utf8');
const css = readFileSync(join(root, 'css', 'core', 'indexx.css'), 'utf8');

// Guarda del botón "Borrar todo" de la cabecera de Visualización:
// debe usar el sistema de diseño (.viz-clear-btn) y deshabilitarse sin gráficos.
describe('Visualización · botón Borrar todo', () => {
  it('usa la clase del sistema y no estilos inline', () => {
    expect(ui).toContain('class="viz-clear-btn"');
    expect(ui).toContain('id="vizGalClear"');
    expect(ui).not.toContain('✕ Todo');
    expect(ui).toContain('Borrar todos los gráficos guardados');
  });

  it('se deshabilita cuando la galería está vacía', () => {
    expect(viz).toMatch(/clearBtn\.disabled\s*=\s*_V\.gallery\.length === 0/);
  });

  it('tiene estilos y estado disabled en el CSS', () => {
    expect(css).toContain('.viz-clear-btn{');
    expect(css).toContain('.viz-clear-btn:disabled');
    expect(css).toContain('.viz-clear-btn:hover:not(:disabled)');
  });
});
