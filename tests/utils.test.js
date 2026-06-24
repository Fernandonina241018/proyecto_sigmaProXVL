describe('escapeHtml', () => {
  test('escapes < > & " \'', () => {
    expect(escapeHtml('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  test('returns empty string for null/undefined', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  test('passes through safe strings', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
    expect(escapeHtml('12345')).toBe('12345');
  });

  test('handles ampersands first', () => {
    expect(escapeHtml('a&b<c')).toBe('a&amp;b&lt;c');
  });
});

describe('formatDate', () => {
  test('returns — for null input', () => {
    expect(formatDate(null)).toBe('—');
  });

  test('returns raw string for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });

  test('formats date correctly', () => {
    const r = formatDate('2026-06-02T12:30:00Z', 'full');
    expect(r).toContain('Jun');
    expect(r).toContain('2026');
  });
});

describe('debounce', () => {
  test('delays function execution', async () => {
    let called = 0;
    const fn = debounce(() => { called++; }, 50);
    fn(); fn(); fn();
    expect(called).toBe(0);
    await new Promise(r => setTimeout(r, 100));
    expect(called).toBe(1);
  });
});

describe('getRolLabel', () => {
  test('returns correct labels', () => {
    expect(getRolLabel('admin')).toBe('Administrador');
    expect(getRolLabel('user')).toBe('Usuario');
    expect(getRolLabel('unknown')).toBe('unknown');
  });
});
