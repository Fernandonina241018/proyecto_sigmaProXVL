const S = StatsUtils;

describe('getNumericValues', () => {
  const data = {
    headers: ['colA', 'colB'],
    data: [
      ['1', 'x'],
      ['2.5', 'y'],
      ['abc', 'z'],
      ['', 'w'],
      ['3', null],
    ]
  };

  test('extracts valid numbers from column', () => {
    const vals = S.getNumericValues(data, 'colA');
    expect(vals).toEqual([1, 2.5, 3]);
  });

  test('returns empty array when column has no numbers', () => {
    const vals = S.getNumericValues(data, 'colB');
    expect(vals).toEqual([]);
  });

  test('returns [] for null data', () => {
    expect(S.getNumericValues(null, 'colA')).toEqual([]);
  });
});

describe('getNumericColumns', () => {
  const data = {
    headers: ['nums', 'mix', 'text'],
    data: [
      ['1.0', '1.0', 'foo'],
      ['2.0', 'abc', 'bar'],
      ['3.0', '3.0', 'baz'],
    ]
  };

  test('identifies purely numeric columns', () => {
    const cols = S.getNumericColumns(data, { threshold: 0.5 });
    expect(cols).toContain('nums');
  });

  test('excludes known index columns', () => {
    const cols = S.getNumericColumns({ headers: ['Row', 'val'], data: [['1', '2']] });
    expect(cols).toEqual(['val']);
  });
});

describe('getNumericColumns caché (LOTE C)', () => {
  const data = {
    headers: ['nums', 'text'],
    data: [['1', 'a'], ['2', 'b'], ['3', 'c']],
  };

  test('segundo llamado devuelve lo mismo (hit)', () => {
    S.clearNumericColumnsCache();
    const r1 = S.getNumericColumns(data, { threshold: 0.5 });
    const r2 = S.getNumericColumns(data, { threshold: 0.5 });
    expect(r2).toEqual(r1);
    expect(r2).toContain('nums');
  });

  test('threshold distinto no colisiona', () => {
    S.clearNumericColumnsCache();
    const strict = S.getNumericColumns(data, { threshold: 0.99 });
    const loose = S.getNumericColumns(data, { threshold: 0.1 });
    expect(loose).toContain('nums');
    expect(strict).toEqual(loose); // mismo dataset 100% numérico
  });

  test('cambio intermedio no se detecta por fingerprint hasta clear', () => {
    S.clearNumericColumnsCache();
    const d = { headers: ['x'], data: Array.from({ length: 10 }, (_, i) => [String(i)]) };
    expect(S.getNumericColumns(d)).toEqual(['x']);
    for (let i = 1; i < 9; i++) d.data[i][0] = 'texto';
    expect(S.getNumericColumns(d)).toEqual(['x']);
    S.clearNumericColumnsCache();
    expect(S.getNumericColumns(d)).toEqual([]);
  });

  test('clear invalida (recomputa tras cambio simulado)', () => {
    S.clearNumericColumnsCache();
    const d2 = { headers: ['c'], data: [['x']] };
    expect(S.getNumericColumns(d2)).toEqual([]);
    S.clearNumericColumnsCache();
    expect(S.getNumericColumns(data, { threshold: 0.5 })).toContain('nums');
  });
});

describe('fase 2 — imputación y varianza', () => {
  test('getNumericValues acepta punto y coma decimal y cuenta exclusiones', () => {
    S.clearExclusionesParseo();
    const d = { headers: ['x'], data: [['2.5'], ['2,0'], ['1e3'], ['12abc'], ['']] };
    expect(S.getNumericValues(d, 'x')).toEqual([2.5, 2, 1000]);
    expect(S.getExclusionesParseo()).toBe(1);
  });

  test('imputeColumn interpreta coma decimal', () => {
    const d = { headers: ['x'], data: [['2,5'], ['3,5'], ['']] };
    S.imputeColumn(d, 'x', 'mediana');
    expect(d.data[2][0]).toBe(3);
  });

  test('imputeColumn usa la mediana cuando se pide', () => {
    const d = { headers: ['x'], data: [[1], [2], [100], ['']] };
    S.imputeColumn(d, 'x', 'mediana');
    expect(d.data[3][0]).toBe(2);
    const m = { headers: ['x'], data: [[1], [2], [100], ['']] };
    S.imputeColumn(m, 'x', 'media');
    expect(m.data[3][0]).toBeCloseTo(34.3333, 3);
  });

  test('varianza muestral no calculable con n<2', () => {
    expect(S.calcularVarianza([5])).toBe(null);
    expect(S.calcularVarianza([])).toBe(null);
    expect(S.calcularVarianza([5], false)).toBe(0);
    expect(S.calcularDesviacionEstandar([5])).toBe(null);
    expect(S.calcularCoeficienteVariacion([5])).toBe(null);
  });

  test('resumenEstadistico no rompe con una sola observación', () => {
    const r = S.resumenEstadistico([5]);
    expect(r.varianza).toBe(null);
    expect(r.de).toBe(null);
    expect(r.cv).toBe(null);
  });
});

describe('fase 3 — parseo estricto e imputación trazable', () => {
  test('parseNumeric acepta punto y coma decimal, y rechaza texto parcial', () => {
    expect(S.parseNumeric('12abc')).toBe(null);
    expect(S.parseNumeric('2.5')).toBe(2.5);
    expect(S.parseNumeric('2,5')).toBe(2.5);
    expect(S.parseNumeric('2,0')).toBe(2);
    expect(S.parseNumeric('0,500')).toBe(0.5);
    expect(S.parseNumeric('1234,567')).toBe(1234.567);
    expect(S.parseNumeric('1.234,5')).toBe(null);
    expect(S.parseNumeric('1,234.5')).toBe(null);
    expect(S.parseNumeric('0x10')).toBe(null);
    expect(S.parseNumeric(Infinity)).toBe(null);
    expect(S.parseNumeric(' 4 ')).toBe(4);
    expect(S.parseNumeric('1e3')).toBe(1000);
    expect(S.parseNumeric('.5')).toBe(0.5);
  });

  test('coma con tres dígitos es ambigua: se excluye, no se adivina', () => {
    ['1,000', '2,000', '12,345', '1,234,567'].forEach((v) => expect(S.parseNumeric(v)).toBe(null));
    expect(S.parseNumeric('1,0000')).toBe(1);
    expect(S.parseNumeric('1,00')).toBe(1);
  });

  test('getNumericValues excluye y cuenta valores inválidos', () => {
    S.clearExclusionesParseo();
    const d = { headers: ['x'], data: [['12abc'], ['2.5'], [''], ['Infinity'], ['1,000']] };
    expect(S.getNumericValues(d, 'x')).toEqual([2.5]);
    expect(S.getExclusionesParseo()).toBe(3);
  });

  test('imputeColumn devuelve la traza de lo imputado', () => {
    const d = { headers: ['x'], data: [[1], [2], [100], ['']] };
    expect(S.imputeColumn(d, 'x', 'mediana')).toEqual({ metodo: 'mediana', celdasImputadas: 1 });
    expect(S.imputeColumn({ headers: ['y'], data: [['a']] }, 'y')).toBe(null);
  });
});

describe('calcularMedia', () => {
  test('correct mean', () => {
    expect(S.calcularMedia([1, 2, 3, 4, 5])).toBe(3);
  });

  test('single value', () => {
    expect(S.calcularMedia([10])).toBe(10);
  });
});

describe('calcularMediana', () => {
  test('odd length', () => {
    expect(S.calcularMediana([1, 3, 2])).toBe(2);
  });

  test('even length', () => {
    expect(S.calcularMediana([1, 2, 3, 4])).toBe(2.5);
  });
});

describe('calcularDesviacionEstandar', () => {
  test('standard deviation', () => {
    const std = S.calcularDesviacionEstandar([1, 2, 3, 4, 5]);
    expect(std).toBeCloseTo(1.5811, 3);
  });
});

describe('detectarOutliersIQR', () => {
  test('detects outliers using IQR method', () => {
    const vals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 100];
    const out = S.detectarOutliersIQR(vals);
    expect(out.length).toBeGreaterThan(0);
    expect(out[0].index).toBe(9);
    expect(out[0].value).toBe(100);
  });
});

describe('detectarOutliersZScore', () => {
  test('detects outliers with extreme values', () => {
    const vals = [10, 10, 10, 10, 10, 10, 10, 10, 10, 1000];
    const out = S.detectarOutliersZScore(vals, { umbral: 2 });
    expect(out.length).toBeGreaterThan(0);
    expect(out.some(o => o.value === 1000)).toBe(true);
  });

  test('returns empty for uniform data', () => {
    const out = S.detectarOutliersZScore([5, 5, 5, 5, 5]);
    expect(out).toEqual([]);
  });
});

describe('calcularCorrelacionPearson', () => {
  test('perfect positive correlation', () => {
    expect(S.calcularCorrelacionPearson([1,2,3], [2,4,6])).toBeCloseTo(1, 5);
  });

  test('no correlation with constant', () => {
    const r = S.calcularCorrelacionPearson([1,2,3], [5,5,5]);
    expect(r).toBe(0);
  });
});

describe('calcularPercentil', () => {
  test('median via percentile 50', () => {
    expect(S.calcularPercentil([1, 2, 3, 4, 5], 50)).toBe(3);
  });
});

describe('getNumericColumns sampleRows (fast-path unificado)', () => {
  const data = {
    headers: ['nums', 'mix', 'text'],
    data: [
      ['1.0', '1.0', 'foo'],
      ['2.0', 'abc', 'bar'],
      ['3.0', '3.0', 'baz'],
      ['4.0', '4.0', 'qux'],
    ]
  };

  test('sampleRows=0 equivale a scan completo', () => {
    const full = S.getNumericColumns(data, { threshold: 0.5 });
    const sampled = S.getNumericColumns(data, { threshold: 0.5, sampleRows: 0 });
    expect(sampled).toEqual(full);
  });

  test('sampleRows grande equivale a scan completo', () => {
    const full = S.getNumericColumns(data, { threshold: 0.5 });
    const sampled = S.getNumericColumns(data, { threshold: 0.5, sampleRows: 100 });
    expect(sampled).toEqual(full);
  });

  test('sampleRows respeta threshold sobre la muestra', () => {
    // mix: 3/4 numéricos en muestra completa, 1/2 en muestra de 2 filas
    const cols2 = S.getNumericColumns(data, { threshold: 0.7, sampleRows: 2, excludeColumns: [] });
    expect(cols2).toContain('nums');
    expect(cols2).not.toContain('mix');
    expect(cols2).not.toContain('text');
  });

  test('StateManager.getNumericCols delega al canónico', () => {
    const objData = {
      headers: ['nums', 'mix', 'text'],
      data: [
        { nums: '1', mix: '1', text: 'a' },
        { nums: '2', mix: 'x', text: 'b' },
        { nums: '3', mix: '3', text: 'c' },
      ]
    };
    const viaState = StateManager.getNumericCols(objData);
    const viaCanonical = S.getNumericColumns(objData, { threshold: 0.7, excludeColumns: [], sampleRows: 20 });
    expect(viaState).toEqual(viaCanonical);
    expect(viaState).toContain('nums');
    expect(viaState).not.toContain('text');
  });

  test('StateManager.getNumericCols usa caché por hash', () => {
    const d = { headers: ['a'], data: [{ a: '1' }] };
    const r1 = StateManager.getNumericCols(d);
    const r2 = StateManager.getNumericCols(d);
    expect(r2).toEqual(r1);
  });
});

describe('analyzeColumns', () => {
  const data = {
    headers: ['Nums', 'Text'],
    data: [['1', 'x'], ['2', 'y'], ['3', 'z']]
  };

  test('identifies viable numeric column', () => {
    const result = S.analyzeColumns(data);
    const numsCol = result.find(c => c.header === 'Nums');
    expect(numsCol).toBeDefined();
    expect(numsCol.viable).toBe(true);
  });

  test('identifies non-numeric column', () => {
    const result = S.analyzeColumns(data);
    const textCol = result.find(c => c.header === 'Text');
    expect(textCol).toBeDefined();
    expect(textCol.viable).toBe(false);
  });
});

describe('numericColumnsForAnalysis (P1 estadística)', () => {
  const data = {
    headers: ['nums', 'mix', 'text', 'Row'],
    data: [
      ['1', '1', 'a', '1'],
      ['2', '2', 'b', '2'],
      ['3', '3', 'c', '3'],
      ['4', 'x', 'd', '4'],
      ['5', 'y', 'e', '5'],
    ],
  };

  test('aplica el umbral configurado y excluye índices', () => {
    expect(S.numericColumnsForAnalysis(data, { threshold: 0.5 })).toContain('mix');
    expect(S.numericColumnsForAnalysis(data, { threshold: 0.8 })).not.toContain('mix');
    expect(S.numericColumnsForAnalysis(data, { threshold: 0.5 })).not.toContain('Row');
  });

  test('forceInclude incluye mixtas con al menos un número y respeta exclusiones', () => {
    const cols = S.numericColumnsForAnalysis(data, { forceInclude: true, excludeColumns: ['text'] });
    expect(cols).toContain('mix');
    expect(cols).not.toContain('text');
    expect(cols).not.toContain('Row');
  });
});

describe('resumirResultado (P1 estadística)', () => {
  test('respeta la decisión del motor aunque el p-valor sea menor que 0.05', () => {
    const r = S.resumirResultado({ valorP: 0.03, significativo: false }, 0.01);
    expect(r.pValue).toBe(0.03);
    expect(r.significativo).toBe(false);
    expect(r.alfa).toBe(0.01);
  });

  test('usa alfa cuando el resultado no trae significativo', () => {
    expect(S.resumirResultado({ prueba: { pValue: 0.03 } }, 0.05).significativo).toBe(true);
    expect(S.resumirResultado({ prueba: { pValue: 0.03 } }, 0.01).significativo).toBe(false);
  });

  test('un true anidado gana sobre un false contenedor', () => {
    const r = S.resumirResultado({ significativo: false, prueba: { valorP: 0.03, significativo: true } }, 0.01);
    expect(r.pValue).toBe(0.03);
    expect(r.significativo).toBe(true);
  });

  test('sin p ni significativo devuelve null', () => {
    const r = S.resumirResultado({}, 0.05);
    expect(r.pValue).toBeNull();
    expect(r.significativo).toBeNull();
  });
});
