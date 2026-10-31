import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Guardas de estructura (F1/F2): el panel de Análisis debe usar .side-card
// y conservar los IDs que otros módulos actualizan en caliente.
const ui = readFileSync(join(root, 'js', 'core', 'indexx-ui.js'), 'utf8');
const css = readFileSync(join(root, 'css', 'core', 'indexx.css'), 'utf8');

const start = ui.indexOf('analisis: function() {');
const end = ui.indexOf('visualizacion: function()', start);
const panel = ui.slice(start, end);

describe('Panel de Análisis · F1 (.side-card)', () => {
  it('usa exactamente 3 cards y ninguna sección .gl antigua', () => {
    expect(panel).toContain('id="panelAnalisis"');
    expect((panel.match(/_sideCard\(/g) || []).length).toBe(3);
    expect(panel).not.toContain('<section class="gl"');
  });

  it('conserva los IDs que otros módulos escriben', () => {
    [
      'analisisDsName', 'analisisDsRows', 'analisisDsCols',
      'analisisStatNumeric', 'colThresholdSlider', 'colThresholdVal',
      'colForceInclude', 'colImputeMissing', 'analisisExcludedTags',
      'analisisLastResultList', 'analisisLastTest', 'analisisLastPVal', 'analisisLastDecision',
      'analisisSelectedTestsScroll'
    ].forEach((id) => {
      expect(panel).toContain('id="' + id + '"');
    });
  });

  it('conserva handlers y expresiones inline', () => {
    expect(panel).toContain('columnAnalysisConfig.threshold=this.value/100');
    expect(panel).toContain('columnAnalysisConfig.forceInclude=this.checked');
    expect(panel).toContain('columnAnalysisConfig.imputeMissing=this.checked');
    expect(panel).toContain('showColumnExclusionModal()');
  });
});

describe('Resultados de Análisis · F2 (scope propio)', () => {
  it('marca los resultados con .anl-results-scope y un solo marco', () => {
    expect(ui).toContain('page-body anl-results-scope');
    expect(ui).toContain('page-card anl-result-card');
    expect(ui).toContain('page-card-body anl-result-body');
    expect(ui).toContain('anl-result-inline anl-results-scope');
  });

  it('el CSS neutraliza hover-lift solo dentro del scope', () => {
    expect(css).toContain('.anl-results-scope .page-card:hover{transform:none;box-shadow:none}');
    expect(css).toMatch(/\.anl-result-inline\{[^}]*border-radius:var\(--radius-lg\)/);
  });

  it('define los tokens F0', () => {
    ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--space-3', '--surface-2', '--ok', '--warn', '--danger', '--icon-stroke']
      .forEach((token) => expect(css).toContain(token + ':'));
  });
});
