// REGRESIÓN: los campos del bloque de firma sin dato deben mostrar el mismo
// placeholder ('—', gris claro, cursiva) que usa el reporte generado.
// Antes: firmaUpdatePreview escribía '' y forzaba color oscuro → el campo
// quedaba EN BLANCO y parecía que la firma no se había aplicado.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, '..', 'js', 'core', 'indexx-firma.js'), 'utf-8');

// Se ejecuta la función real (no una copia) para que el test detecte cambios.
const start = src.indexOf('function firmaUpdatePreview(');
const end = src.indexOf('\nfunction ', start + 10);
if (start < 0 || end < 0) throw new Error('no se encontró firmaUpdatePreview en indexx-firma.js');
const fnSource = src.slice(start, end);

function ejecutar(value) {
  const el = { textContent: 'original', style: {} };
  const sandbox = {
    _firmaCurrentDoc: {
      querySelector: () => el,
      documentElement: { outerHTML: '<html><body></body></html>' },
    },
    _firmaCurrentHtml: '',
    document: { getElementById: () => null },
    showToast: () => {},
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fnSource, sandbox);
  sandbox.firmaUpdatePreview('reviewed', 'title', value);
  return el;
}

describe('firmaUpdatePreview — campos de firma', () => {
  test('con valor: escribe el valor con el estilo de dato', () => {
    const el = ejecutar('Analista Senior');
    expect(el.textContent).toBe('Analista Senior');
    expect(el.style.color).toBe('#1a202c');
    expect(el.style.fontStyle).toBe('normal');
  });

  test('sin valor: muestra el placeholder del reporte, no un campo en blanco', () => {
    const el = ejecutar('');
    expect(el.textContent).toBe('—');
    expect(el.textContent).not.toBe('');
    expect(el.style.color).toBe('#cbd5e0');
    expect(el.style.fontStyle).toBe('italic');
  });

  test('el placeholder explícito "—" se trata como campo sin dato', () => {
    const el = ejecutar('—');
    expect(el.textContent).toBe('—');
    expect(el.style.color).toBe('#cbd5e0');
    expect(el.style.fontStyle).toBe('italic');
  });
});
