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
