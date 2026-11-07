// Banco OQ del viscosímetro rotacional (tipo L, sin PQ).
// Decisiones del responsable técnico (2026-11-06):
// - Los ensayos 21 y 22 del listado original se eliminaron porque no aplicaban.
// - Se consolidan 2+3, 5+6, 16+17 y 20+23; el ensayo 1 queda cubierto por EQ-OQ-REQ.
// - Equipo rotacional tipo Brookfield (husillos, torque y RPM).
// - Sin gestión de usuarios, audit trail ni respaldo electrónico en la configuración actual.
// - El viscosímetro no lleva PQ: reproducibilidad se evalúa en OQ.
// - Referencias aprobadas por el responsable.
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const raiz = join(__dirname, '..');
const B = require('../js/core/banco-equipos-data.js');

const plano = (x) => (x.secciones || []).map((s) => s.html).join(' ')
  .replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

const oq = B.fases.OQ.filter((x) => x.familia === 'viscosimetro');
const ensayos = oq.filter((x) => x.kind === 'ensayo' && (x.bloque === 2 || x.bloque === 3));

describe('viscosímetro: banco OQ (tipo L)', () => {
  it('tiene 17 ensayos propios y no tiene PQ', () => {
    expect(ensayos.length).toBe(17);
    expect((B.fases.PQ || []).filter((x) => x.familia === 'viscosimetro')).toEqual([]);
    expect(existsSync(join(raiz, 'docs', 'banco-ensayos', 'equipos', 'pq-viscosimetro.html'))).toBe(false);
  });

  it('los IDs son contiguos de VS-001 a VS-017', () => {
    const ids = ensayos.map((x) => x.id).sort();
    const esperados = Array.from({ length: 17 }, (_, i) => 'EQ-OQ-VS-' + String(i + 1).padStart(3, '0'));
    expect(ids).toEqual(esperados);
  });

  it('conserva la consolidación aprobada (17 ensayos, sin duplicar requisitos previos)', () => {
    const textos = ensayos.map((x) => (x.titulo + ' ' + plano(x)).toLowerCase());
    expect(textos.some((t) => t.includes('nivelación') && t.includes('encendido'))).toBe(true);
    expect(textos.some((t) => t.includes('identificación') && t.includes('husillos'))).toBe(true);
    expect(textos.some((t) => t.includes('impresión') && t.includes('transferencia'))).toBe(true);
    expect(textos.some((t) => t.includes('seguridad eléctrica') && t.includes('paro'))).toBe(true);
    expect(textos.some((t) => t.includes('inspección previa a la operación'))).toBe(false);
  });

  it('incluye bloques 6 y 8 con los cuatro anexos mínimos', () => {
    const html = JSON.stringify(oq);
    expect(oq.some((x) => x.bloque === 6)).toBe(true);
    expect(oq.some((x) => x.bloque === 8)).toBe(true);
    ['Anexo A', 'Anexo B', 'Anexo C', 'Anexo D'].forEach((a) => expect(html).toContain(a));
  });

  it('las referencias están aprobadas y no quedan pendientes del responsable', () => {
    const ref = oq.find((x) => x.id === 'EQ-OQ-VS-REF');
    expect(ref).toBeTruthy();
    const html = JSON.stringify(ref);
    expect(html).not.toContain('PENDIENTE DEL RESPONSABLE');
    ['USP <1058>', 'USP <912>', 'ISO 2555', 'ISO 3219-1', 'ASTM D2196', 'IEC 61010-1', '21 CFR Part 11', 'EU GMP Anexo 15']
      .forEach((r) => expect(html).toContain(r));
    // Rotacional, no capilar: no debe citar USP <911>.
    expect(html).not.toContain('USP <911>');
  });

  it('documenta que el viscosímetro no lleva PQ y que la reproducibilidad va en OQ', () => {
    const texto = oq.map((x) => (x.titulo || '') + ' ' + plano(x)).join(' ').toLowerCase();
    expect(texto).toContain('no lleva pq');
    expect(texto).toContain('reproducibilidad');
    expect(texto).toContain('eq-oq-vs-009');
  });

  it('los ensayos sin software declaran no aplica con justificación', () => {
    const usuarios = plano(ensayos.find((x) => x.id === 'EQ-OQ-VS-014')).toLowerCase();
    const respaldo = plano(ensayos.find((x) => x.id === 'EQ-OQ-VS-015')).toLowerCase();
    const impresion = plano(ensayos.find((x) => x.id === 'EQ-OQ-VS-013')).toLowerCase();
    expect(usuarios).toContain('no aplica');
    expect(respaldo).toContain('no aplica');
    expect(impresion).toContain('no aplica');
  });

  it('todo ensayo con data-analisis trae plan estadístico y data cruda', () => {
    const conAnalisis = ensayos.filter((x) => x.analisis === 'si');
    expect(conAnalisis.length).toBe(8);
    conAnalisis.forEach((x) => {
      const t = plano(x);
      expect(t).toMatch(/an[aá]lisis estad[ií]stico/i);
      expect(t).toMatch(/data cruda/i);
      expect(t).toMatch(/plan estad[ií]stico/i);
    });
  });

  it('controla la temperatura conforme a USP <912> (±0,1 °C)', () => {
    const temp = plano(ensayos.find((x) => x.id === 'EQ-OQ-VS-010'));
    expect(temp).toContain('±0,1 °C');
    expect(temp).toContain('USP <912>');
  });
});
