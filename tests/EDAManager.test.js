describe('EDAManager — ejecutarEDA', () => {
  const EM = EDAManager;

  beforeEach(() => {
    EM.clearCache();
  });

  test('returns error for empty data', () => {
    const result = EM.ejecutarEDA(null);
    expect(result.error).toBeDefined();
  });

  test('returns error for no numeric columns', () => {
    const result = EM.ejecutarEDA({ headers: ['A'], data: [['x'], ['y']] });
    expect(result.error).toBeDefined();
  });

  test('computes descriptive stats for numeric columns', () => {
    const data = { headers: ['val'], data: [[1], [2], [3], [4], [5]] };
    const result = EM.ejecutarEDA(data);
    expect(result.error).toBeUndefined();
    expect(result.descriptivas.val).toBeDefined();
    expect(result.descriptivas.val.media).toBeCloseTo(3, 1);
    expect(result.descriptivas.val.n).toBe(5);
    expect(result.descriptivas.val.min).toBe(1);
    expect(result.descriptivas.val.max).toBe(5);
  });

  test('computes resumen correctly', () => {
    const data = {
      headers: ['val', 'cat'],
      data: [[1, 'a'], [2, 'b'], [3, 'c']]
    };
    const result = EM.ejecutarEDA(data);
    expect(result.resumen.totalFilas).toBe(3);
    expect(result.resumen.totalColumnas).toBe(2);
    expect(result.resumen.columnasNumericas).toBe(1);
    expect(result.resumen.columnasCategoricas).toBe(1);
  });

  test('detects outliers', () => {
    const data = { headers: ['val'], data: [[1],[2],[3],[4],[5],[6],[7],[8],[9],[100]] };
    const result = EM.ejecutarEDA(data);
    expect(result.resumen.totalOutliers).toBeGreaterThan(0);
  });

  test('correlation matrix with 2 numeric columns', () => {
    const data = { headers: ['x', 'y'], data: [[1,2],[2,4],[3,6]] };
    const result = EM.ejecutarEDA(data);
    expect(result.correlaciones).toBeDefined();
    expect(result.correlaciones.columnas).toEqual(['x', 'y']);
    expect(result.correlaciones.matrix[0][1]).toBeCloseTo(1, 4);
  });

  test('generates recommendations', () => {
    const data = { headers: ['val'], data: [[1],[2],[3],[4],[5]] };
    const result = EM.ejecutarEDA(data);
    expect(result.recomendaciones.length).toBeGreaterThan(0);
  });

  test('renderDashboard returns HTML string', () => {
    const data = { headers: ['val'], data: [[1],[2],[3],[4],[5]] };
    const html = EM.renderDashboard(data);
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(100);
    expect(html).toContain('eda-dashboard');
  });

  test('renderDashboard returns error HTML when no data', () => {
    const html = EM.renderDashboard(null);
    expect(html).toContain('⚠️');
  });
});
