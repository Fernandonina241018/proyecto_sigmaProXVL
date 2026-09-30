// Generador .docx de Almacenes: extractor + modelo puro (sin lib docx).
import { describe, test, expect } from 'vitest';
import GeneradorDocx from '../js/core/generador-docx.js';

const DRAFT = {
  codigo: 'CF-01', descripcion: 'Cuarto frío principal', ubicacion: 'Edificio A',
  tipo: 'Cuarto frío', temperaturaMin: '2', temperaturaMax: '8',
  humedadMin: '', humedadMax: '', responsable: 'J. Pérez', fecha: '2026-09-29',
  tipoCalificacion: 'Calificación inicial', estudio: 'Mapeo térmico',
  condicionEstudio: 'Sin carga', duracionEstudio: '72 h',
  intervaloRegistro: '5 min', cantidadDataLoggers: '12',
};
const ENT = { id: 'cuarto-frio', nombre: 'Cuarto frío (2–8 °C)' };

describe('banco extraído', () => {
  test('43 artículos con IDs únicos y bloques válidos', () => {
    const B = GeneradorDocx.banco();
    const arts = ['DQ', 'IQ', 'OQ', 'PQ'].flatMap((f) => B.fases[f].filter((i) => i.id));
    expect(arts).toHaveLength(43);
    expect(new Set(arts.map((a) => a.id)).size).toBe(43);
    for (const a of arts) {
      expect(a.bloque).toBeGreaterThanOrEqual(1);
      expect(a.bloque).toBeLessThanOrEqual(8);
      expect(['DQ', 'IQ', 'OQ', 'PQ']).toContain(a.id.split('-')[1]);
    }
  });

  test('conteos por fase: DQ 5 · IQ 16 · OQ 12 · PQ 10', () => {
    expect(GeneradorDocx.contarEnsayos('DQ', 'ambas')).toBe(5);
    expect(GeneradorDocx.contarEnsayos('IQ', 'ambas')).toBe(16);
    expect(GeneradorDocx.contarEnsayos('OQ', 'ambas')).toBe(12);
    expect(GeneradorDocx.contarEnsayos('PQ', 'ambas')).toBe(10);
  });
});

describe('filtros y marcas', () => {
  test('pasaCondicion: ambas incluye todo', () => {
    expect(GeneradorDocx.pasaCondicion('est', 'ambas')).toBe(true);
    expect(GeneradorDocx.pasaCondicion('dina', 'dina')).toBe(true);
    expect(GeneradorDocx.pasaCondicion('est', 'dina')).toBe(false);
    expect(GeneradorDocx.pasaCondicion('ambas', 'est')).toBe(true);
  });

  test('rangoTexto arma rango del borrador', () => {
    expect(GeneradorDocx.rangoTexto(DRAFT)).toBe('2–8 °C');
    expect(GeneradorDocx.rangoTexto({ ...DRAFT, humedadMin: '10', humedadMax: '60' }))
      .toBe('2–8 °C / HR 10–60 %');
  });

  test('congelarMarcas elimina spans dinámicos', () => {
    const ctx = { entidad: 'CF', rango: 'R', cond: 'C', listaResumen: 'L' };
    const out = GeneradorDocx.congelarMarcas(
      'del <span class="equipo">almacén</span> rango <span class="rango">x</span> ' +
      'cond <span class="cond">y</span> lista <span class="lista-resumen" data-fase-lista="DQ"></span>',
      ctx
    );
    expect(out).toBe('del CF rango R cond C lista L');
    expect(out).not.toContain('class=');
  });
});

describe('modelo del documento', () => {
  test('DQ: portada 13 campos, índice, bloques en orden 1→8', () => {
    const m = GeneradorDocx.buildModelo('DQ', DRAFT, ENT, 'ambas');
    expect(m.titulo).toContain('DQ');
    expect(m.portada).toHaveLength(13);
    expect(m.portada[0]).toEqual(['Código', 'CF-01']);
    expect(m.indice).toHaveLength(5);
    expect(m.indice[0].num).toBe('ENSAYO 3.1 DE 3');
    const orden = m.bloques.map((b) => b.n);
    expect(orden).toEqual([...orden].sort((a, b) => a - b));
    expect(orden[0]).toBe(1);
  });

  test('ningún texto conserva marcas sin congelar', () => {
    for (const f of ['DQ', 'IQ', 'OQ', 'PQ']) {
      const m = GeneradorDocx.buildModelo(f, DRAFT, ENT, 'ambas');
      const textos = [];
      m.bloques.forEach((b) => b.items.forEach((it) => {
        if (it.t === 'p') textos.push(it.runs.map((r) => r.t).join(''));
        if (it.t === 'ensayo' || it.t === 'h3') textos.push(it.titulo || it.texto);
      }));
      const todo = textos.join(' ');
      expect(todo).not.toContain('class="equipo"');
      expect(todo).not.toContain('class="rango"');
      expect(todo).not.toContain('lista-resumen');
    }
  });

  test('htmlAParrafos: negritas y saltos', () => {
    const ps = GeneradorDocx.htmlAParrafos('<strong>Objetivo:</strong><br>Aprobar el lay');
    expect(ps.length).toBeGreaterThanOrEqual(2);
    expect(ps[0].runs[0]).toMatchObject({ t: 'Objetivo:', b: true });
  });
});
