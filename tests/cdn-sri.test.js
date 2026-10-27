// Opción D3 — integridad de los CDN (SRI).
//
// Todo <script src> / <link href> externo de indexx.html debe llevar
// `integrity` + `crossorigin="anonymous"`: si el CDN sirve otro contenido
// (o se compromete), el navegador lo rechaza en vez de ejecutarlo.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, '..', 'indexx.html'), 'utf-8');

function etiquetasExternas() {
  const re = /<(script|link)\b[^>]*?(?:src|href)="(https:\/\/[^"]+)"[^>]*>/g;
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push({ tag: m[0], url: m[2] });
  return out;
}

describe('SRI de CDNs (D3)', () => {
  test('todos los recursos externos tienen integrity + crossorigin', () => {
    const tags = etiquetasExternas();
    expect(tags.length).toBeGreaterThanOrEqual(8);
    for (const { tag, url } of tags) {
      expect(tag, url).toContain('integrity="sha384-');
      expect(tag, url).toContain('crossorigin="anonymous"');
    }
  });

  test('qrcode está pinneado (una versión fija, no "latest")', () => {
    expect(html).toContain('qrcode@1.5.1/build/qrcode.min.js');
    expect(html).not.toContain('npm/qrcode/build/');
  });
});
