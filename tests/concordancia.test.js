// Concordancia de artículo (el/la) según el género de la entidad.
// El banco escribe "el <span class=equipo>" de forma fija; al generar se
// reemplaza el span por el nombre y se ajusta el artículo.
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const P = require('../js/core/plantilla-docx.js');
const { ajustarArticulos, generoDe } = P._interno;

const SPAN = '<span class="equipo">equipo</span>';

describe('ajustarArticulos', () => {
  it('femenino singular: el/del/al/un → la/de la/a la/una', () => {
    expect(ajustarArticulos('el ' + SPAN, 'f', 's')).toBe('la ' + SPAN);
    expect(ajustarArticulos('del ' + SPAN, 'f', 's')).toBe('de la ' + SPAN);
    expect(ajustarArticulos('al ' + SPAN, 'f', 's')).toBe('a la ' + SPAN);
    expect(ajustarArticulos('un ' + SPAN, 'f', 's')).toBe('una ' + SPAN);
  });

  it('femenino conserva mayúscula inicial', () => {
    expect(ajustarArticulos('El ' + SPAN, 'f', 's')).toBe('La ' + SPAN);
  });

  it('masculino no se altera', () => {
    expect(ajustarArticulos('el ' + SPAN, 'm', 's')).toBe('el ' + SPAN);
    expect(ajustarArticulos('del ' + SPAN, 'm', 's')).toBe('del ' + SPAN);
  });

  it('plural usa los/de los/a los/unos', () => {
    expect(ajustarArticulos('el ' + SPAN, 'm', 'p')).toBe('los ' + SPAN);
    expect(ajustarArticulos('del ' + SPAN, 'm', 'p')).toBe('de los ' + SPAN);
  });

  it('no toca artículos sin span de equipo', () => {
    const texto = 'el equipo y del sistema';
    expect(ajustarArticulos(texto, 'f', 's')).toBe(texto);
  });
});

describe('generoDe', () => {
  it('marca las entidades femeninas conocidas', () => {
    ['tableteadora', 'encapsuladora', 'llenadora', 'etiquetadora', 'blistera',
      'recubridora', 'balanza', 'incubadora', 'centrifuga', 'cabina-flujo',
      'cabina-bioseguridad', 'cabina-est-acelerada', 'cabina-est-real',
      'incubadora-22-27', 'incubadora-38-42'].forEach((id) => {
      expect(generoDe({ id }).genero, id).toBe('f');
    });
  });

  it('deja el masculino por defecto', () => {
    ['autoclave', 'mezclador', 'reactor', 'horno-vacio', 'cuarto-est-real'].forEach((id) => {
      expect(generoDe({ id }).genero, id).toBe('m');
    });
  });

  it('reconoce el plural de termómetros', () => {
    expect(generoDe({ id: 'termometro' }).numero).toBe('p');
  });

  it('respeta el género explícito de la entidad', () => {
    expect(generoDe({ id: 'personalizado', genero: 'f' }).genero).toBe('f');
  });
});
