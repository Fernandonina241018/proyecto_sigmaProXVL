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

describe('parseServerDate', () => {
  test('timestamp sin zona del servidor se interpreta como UTC', () => {
    expect(parseServerDate('2026-11-02T03:17:00').getTime())
      .toBe(Date.parse('2026-11-02T03:17:00Z'));
  });

  test('respeta Z y offsets explícitos', () => {
    expect(parseServerDate('2026-11-02T03:17:00Z').getTime())
      .toBe(Date.parse('2026-11-02T03:17:00Z'));
    expect(parseServerDate('2026-11-02T05:17:00+02:00').getTime())
      .toBe(Date.parse('2026-11-02T05:17:00+02:00'));
  });

  test('fecha sin hora se conserva como fecha local', () => {
    const d = parseServerDate('2026-11-02');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(10);
    expect(d.getDate()).toBe(2);
  });

  test('valor inválido devuelve null', () => {
    expect(parseServerDate('not-a-date')).toBeNull();
    expect(parseServerDate('')).toBeNull();
  });
});

describe('formatDate', () => {
  test('convierte timestamp UTC sin Z a hora local', () => {
    const r = formatDate('2026-11-02T03:17:00', 'time24');
    const d = new Date('2026-11-02T03:17:00Z');
    const expected = String(d.getHours()).padStart(2, '0') + ':17:00';
    expect(r).toBe(expected);
  });

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
