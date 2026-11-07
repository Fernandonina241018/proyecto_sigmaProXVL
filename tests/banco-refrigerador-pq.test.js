// PQ de refrigerador y congelador de laboratorio (2026-11-06).
// Decisiones del responsable técnico:
// - La lista fuente de 20 ensayos se mantiene consolidada en 16 ensayos de banco.
// - Se agregan repetibilidad del desempeño (015) y revisión de registros (016).
// - El congelador usa el mismo protocolo porque solo cambia el rango de temperatura.
// - El viscosímetro sigue sin PQ (tipo L).
import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';

const require = createRequire(import.meta.url);
const B = require('../js/core/banco-equipos-data.js');

const plano = (x) => (x.secciones ? x.secciones.map((s) => s.html).join(' ') : (x.html || ''))
  .replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

const ensayosDe = (familia) => (B.fases.PQ || [])
  .filter((x) => x.familia === familia && x.kind === 'ensayo' && (x.bloque === 2 || x.bloque === 3));

describe.each([
  ['refrigerador-lab', 'RF'],
  ['congelador-lab', 'CG'],
])('PQ %s: consolidación de 20 a 16 ensayos', (familia, prefijo) => {
  const ensayos = ensayosDe(familia);

  it('tiene 16 ensayos propios', () => {
    expect(ensayos).toHaveLength(16);
  });

  it('los IDs son contiguos de 001 a 016', () => {
    const ids = ensayos.map((x) => x.id).sort();
    const esperados = Array.from({ length: 16 }, (_, i) => `EQ-PQ-${prefijo}-` + String(i + 1).padStart(3, '0'));
    expect(ids).toEqual(esperados);
  });

  it('agrega repetibilidad del desempeño con análisis estadístico', () => {
    const x = ensayos.find((e) => e.id === `EQ-PQ-${prefijo}-015`);
    expect(x).toBeTruthy();
    expect(x.analisis).toBe('si');
    const t = plano(x);
    expect(t).toMatch(/repetibilidad/i);
    expect(t).toMatch(/plan estad[ií]stico/i);
    expect(t).toMatch(/data cruda/i);
    expect(t).toMatch(/tres ciclos/i);
  });

  it('agrega revisión de registros sin análisis estadístico', () => {
    const x = ensayos.find((e) => e.id === `EQ-PQ-${prefijo}-016`);
    expect(x).toBeTruthy();
    expect(x.analisis).toBeUndefined();
    const t = plano(x);
    expect(t).toMatch(/ALCOA\+/i);
    expect(t).toMatch(/100 %/);
  });

  it('la tabla resumen declara los 16 ensayos', () => {
    const res = (B.fases.PQ || []).find((x) => x.id === `EQ-PQ-${prefijo}-RES`);
    expect(res).toBeTruthy();
    const t = plano(res);
    expect(t).toContain('001 a EQ-PQ-' + prefijo + '-016');
    expect(t).toContain('16 ensayos');
  });

  it('documenta la consolidación y el protocolo compartido por rango de temperatura', () => {
    const texto = (B.fases.PQ || [])
      .filter((x) => x.familia === familia && x.bloque === 1)
      .map((x) => plano(x)).join(' ');
    expect(texto).toContain('20 ensayos');
    expect(texto).toContain('16 ensayos');
    expect(texto.toLowerCase()).toContain('solo cambia el rango de temperatura');
  });
});

describe('decisiones del 2026-11-06', () => {
  it('el viscosímetro sigue sin PQ', () => {
    expect((B.fases.PQ || []).filter((x) => x.familia === 'viscosimetro')).toEqual([]);
  });
});
