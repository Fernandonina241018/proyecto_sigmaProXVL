// P1-C — guardas estáticas de legibilidad y responsive.
// No sustituyen un E2E móvil; evitan que vuelvan los 8/9px o se pierdan
// los breakpoints mientras el rate limit de login no permita otra suite.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(root, file), 'utf-8');

describe('P1-C legibilidad y responsive', () => {
  test('sin 8/9px en shell, perfil y ML', () => {
    ['css/core/indexx.css', 'css/core/perfil-modal.css', 'css/pages/ml-predict.css'].forEach((file) => {
      expect(read(file), file).not.toMatch(/font-size:\s*(8|9)px/);
    });
  });

  test('dispositivos apila a una columna en móvil', () => {
    const css = read('css/pages/dispositivos.css');
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toContain('.dsp-grid { grid-template-columns: 1fr; }');
  });

  test('ML apila en 1100/760/520', () => {
    const css = read('css/pages/ml-predict.css');
    expect(css).toContain('@media (max-width: 1100px)');
    expect(css).toContain('@media (max-width: 760px)');
    expect(css).toContain('@media (max-width: 520px)');
  });
});
