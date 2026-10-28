// REGRESIÓN: las miniaturas de gráficos renderizados de forma individual
// salían con fondo blanco fijo en el carrusel (modo oscuro). Ahora ambas rutas
// (individual y "Generar múltiples") usan el fondo del tema.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const viz = readFileSync(join(__dirname, '..', 'js', 'core', 'indexx-viz.js'), 'utf-8');

function slice(from, len) { const i = viz.indexOf(from); return viz.slice(i, i + len); }

describe('miniaturas de la galería según el tema', () => {
  test('guardado individual pinta el fondo del tema, no #ffffff', () => {
    const body = slice('function vizSaveToGallery', 1400);
    expect(body).toContain('thumbCtx.fillStyle = _V_thumbBg()');
    expect(body).not.toContain("thumbCtx.fillStyle = '#ffffff'");
  });
  test('generación múltiple repinta el fondo con plugin (Chart.js limpia el canvas)', () => {
    expect(viz).toContain('_V_thumbBgPlugin()');
    expect(viz).toContain('new Chart(tctx, thumbCfg)');
  });
  test('_V_thumbBg: usa --bg-secondary y cae a un color por tema', () => {
    const i = viz.indexOf('function _V_thumbBg()');
    const j = viz.indexOf('function _V_thumbBgPlugin()');
    const make = (theme, cssVal) => new Function('document', 'getComputedStyle',
      'function _V_isLight(){return document.documentElement.getAttribute("data-theme")==="light";}\n' +
      viz.slice(i, j) + '\nreturn _V_thumbBg;')(
      { documentElement: { getAttribute: () => theme } },
      () => ({ getPropertyValue: () => cssVal })
    );
    expect(make('dark', ' #1a1a24 ')()).toBe('#1a1a24');
    expect(make('light', '#f4f5f7')()).toBe('#f4f5f7');
    expect(make('dark', '')()).toBe('#1a1a24');
    expect(make('light', 'var(--x)')()).toBe('#ffffff');
  });
  test('el render para reportes (offscreen) sigue en blanco', () => {
    expect(viz).toContain("var whiteBgPlugin = { id: 'whiteBg'");
  });
});
