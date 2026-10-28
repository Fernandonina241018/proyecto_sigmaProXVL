// REGRESIÓN: clic en el índice (TOC) del reporte dentro de la vista previa
// de firma rompía el visor. Un srcdoc hereda la URL base del padre, así que
// href="#sec02" navegaba a indexx.html#sec02. La copia mostrada lleva
// <base href="about:srcdoc"> para que el enlace solo haga scroll.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const firma = readFileSync(join(__dirname, '..', 'js', 'core', 'indexx-firma.js'), 'utf-8');

function loadFn() {
  const i = firma.indexOf('function _firmaPreviewSrcdoc(');
  const j = firma.indexOf('\nfunction ', i + 10);
  // eslint-disable-next-line no-new-func
  return new Function(firma.slice(i, j) + '\nreturn _firmaPreviewSrcdoc;')();
}

describe('vista previa de firma: índice del reporte', () => {
  const fn = loadFn();
  test('inyecta <base href="about:srcdoc"> justo después de <head>', () => {
    const out = fn('<!DOCTYPE html>\n<html><head><title>R</title></head><body><a href="#sec02">x</a></body></html>');
    expect(out).toContain('<head><base href="about:srcdoc"><title>');
    expect(out.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(out).toContain('href="#sec02"');
  });
  test('respeta <head> con atributos y no duplica la base', () => {
    const once = fn('<html><head lang="es"></head><body></body></html>');
    expect(once).toContain('<head lang="es"><base href="about:srcdoc">');
    expect(fn(once)).toBe(once);
  });
  test('sin <head> la antepone', () => {
    expect(fn('<p>x</p>')).toBe('<base href="about:srcdoc"><p>x</p>');
  });
  test('se usa en los 3 sitios que pintan la vista previa', () => {
    expect((firma.match(/escapeHtml\(_firmaPreviewSrcdoc\(html\)\)/g) || []).length).toBe(2);
    expect(firma).toContain('iframe.srcdoc = _firmaPreviewSrcdoc(html)');
  });
  test('la descarga y la impresión usan el HTML original (sin la base)', () => {
    const d = firma.slice(firma.indexOf('async function firmaDownload'), firma.indexOf('async function firmaDownload') + 400);
    expect(d).toContain('_firmaCurrentDoc.documentElement.outerHTML');
    expect(d).not.toContain('_firmaPreviewSrcdoc');
    const p = firma.slice(firma.indexOf('function firmaPrint'), firma.indexOf('function firmaPrint') + 1200);
    expect(p).toContain('frame.srcdoc = _firmaCurrentHtml');
  });
});
