let mockStore = {};

beforeEach(async () => {
  mockStore = {};
  globalThis.StorageAdapter = {
    setItem: (key, val) => { mockStore[key] = val; return Promise.resolve(); },
    getItem: (key) => Promise.resolve(mockStore[key] || null),
    removeItem: (key) => { delete mockStore[key]; return Promise.resolve(); },
    migrateFromLocalStorage: () => {},
  };
  globalThis.Logger = {
    logDataChange: () => {},
  };
  StateManager.resetState();
  delete mockStore['statAnalyzerState'];
  await StateManager.init();
});

afterEach(() => {
  delete globalThis.StorageAdapter;
  delete globalThis.Logger;
});

describe('StateManager — sheets', () => {
  test('init creates a default sheet', () => {
    const sheets = StateManager.getAllSheets();
    expect(sheets.length).toBe(1);
    expect(sheets[0].name).toBe('Sheet 1');
  });

  test('createSheet adds a new sheet', () => {
    const sheet = StateManager.createSheet('TestSheet', 5, 3);
    expect(sheet.name).toBe('TestSheet');
    expect(sheet.rows).toBe(5);
    expect(sheet.cols).toBe(3);
    expect(StateManager.getAllSheets().length).toBe(2);
  });

  test('createSheet throws when max sheets reached', () => {
    const max = StateManager.getState().config.maxSheets;
    for (let i = 1; i < max; i++) {
      StateManager.createSheet(`Sheet${i}`, 3, 3);
    }
    expect(StateManager.getAllSheets().length).toBe(max);
    expect(() => StateManager.createSheet('Overflow', 3, 3)).toThrow();
  });

  test('renameSheet updates sheet name', () => {
    const active = StateManager.getActiveSheet();
    StateManager.renameSheet(active.id, 'Renamed');
    expect(StateManager.getSheet(active.id).name).toBe('Renamed');
  });

  test('setActiveSheet switches active sheet', () => {
    const s1 = StateManager.createSheet('S1', 3, 3);
    const s2 = StateManager.createSheet('S2', 3, 3);
    StateManager.setActiveSheet(s1.id);
    expect(StateManager.getActiveSheet().id).toBe(s1.id);
    StateManager.setActiveSheet(s2.id);
    expect(StateManager.getActiveSheet().id).toBe(s2.id);
  });

  test('deleteSheet removes sheet', () => {
    const s1 = StateManager.createSheet('ToDelete', 3, 3);
    const id = s1.id;
    StateManager.deleteSheet(id);
    expect(StateManager.getSheet(id)).toBeUndefined();
  });

  test('deleteSheet throws on last sheet', () => {
    const active = StateManager.getActiveSheet();
    expect(() => StateManager.deleteSheet(active.id)).toThrow();
  });
});

describe('StateManager — data', () => {
  test('updateCell modifies cell value', () => {
    StateManager.updateCell(0, 1, '42');
    const data = StateManager.getSheetData();
    expect(data.data[0][1]).toBe('42');
  });

  test('updateHeader modifies column header', () => {
    StateManager.updateHeader(1, 'NuevoHeader');
    const data = StateManager.getSheetData();
    expect(data.headers[1]).toBe('NuevoHeader');
  });

  test('addRow appends a row', () => {
    const before = StateManager.getActiveSheet().rows;
    StateManager.addRow();
    expect(StateManager.getActiveSheet().rows).toBe(before + 1);
  });

  test('deleteRow removes a row', () => {
    StateManager.addRow();
    StateManager.addRow();
    const before = StateManager.getActiveSheet().rows;
    StateManager.deleteRow(0);
    expect(StateManager.getActiveSheet().rows).toBe(before - 1);
  });

  test('addColumn appends a column', () => {
    const before = StateManager.getActiveSheet().cols;
    StateManager.addColumn();
    expect(StateManager.getActiveSheet().cols).toBe(before + 1);
  });

  test('clearSheetData empties all cells', () => {
    StateManager.updateCell(0, 1, 'test');
    StateManager.clearSheetData();
    const data = StateManager.getSheetData();
    expect(data.data[0][1]).toBe('');
  });
});

describe('StateManager — imported data', () => {
  test('setImportedData stores data and filename', () => {
    StateManager.setImportedData({ headers: ['A'], data: [[1]] }, 'test.csv');
    expect(StateManager.getImportedData()).toEqual({ headers: ['A'], data: [[1]] });
  });

  test('clearImportedData resets', () => {
    StateManager.setImportedData({ headers: ['A'], data: [[1]] }, 'test.csv');
    StateManager.clearImportedData();
    expect(StateManager.getImportedData()).toBeNull();
  });
});

describe('StateManager — active stats', () => {
  test('addActiveStat adds to list', () => {
    StateManager.addActiveStat('tStudent');
    expect(StateManager.getActiveStats()).toContain('tStudent');
  });

  test('removeActiveStat removes from list', () => {
    StateManager.addActiveStat('anova');
    StateManager.removeActiveStat('anova');
    expect(StateManager.getActiveStats()).not.toContain('anova');
  });

  test('addActiveStat warns on duplicate', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    StateManager.addActiveStat('chi2');
    const result = StateManager.addActiveStat('chi2');
    expect(result).toBe(false);
    spy.mockRestore();
  });

  test('clearActiveStats empties list', () => {
    StateManager.addActiveStat('a');
    StateManager.addActiveStat('b');
    StateManager.clearActiveStats();
    expect(StateManager.getActiveStats()).toEqual([]);
  });
});

describe('StateManager — hypothesis config', () => {
  test('setHypothesisConfig stores config', () => {
    StateManager.setHypothesisConfig('tStudent', { alpha: 0.05 });
    expect(StateManager.getHypothesisConfig('tStudent')).toEqual({ alpha: 0.05 });
  });

  test('clearHypothesisConfig removes config', () => {
    StateManager.setHypothesisConfig('tStudent', { alpha: 0.05 });
    StateManager.clearHypothesisConfig('tStudent');
    expect(StateManager.getHypothesisConfig('tStudent')).toBeNull();
  });

  test('undo restores previous config', () => {
    StateManager.setHypothesisConfig('test', { a: 1 });
    StateManager.setHypothesisConfig('test', { a: 2 });
    StateManager.undo();
    expect(StateManager.getHypothesisConfig('test')).toEqual({ a: 1 });
  });

  test('redo restores next config', () => {
    StateManager.setHypothesisConfig('test', { a: 1 });
    StateManager.setHypothesisConfig('test', { a: 2 });
    StateManager.undo();
    StateManager.redo();
    expect(StateManager.getHypothesisConfig('test')).toEqual({ a: 2 });
  });
});

describe('StateManager — persistence', () => {
  test('saveToLocalStorage stores state', async () => {
    StateManager.addActiveStat('wilcoxon');
    await StateManager.saveToLocalStorage();
    expect(mockStore['statAnalyzerState']).toBeDefined();
    const parsed = JSON.parse(mockStore['statAnalyzerState']);
    expect(parsed.activeStats).toContain('wilcoxon');
  });

  test('clearLocalStorage removes statAnalyzerState', async () => {
    await StateManager.saveToLocalStorage();
    StateManager.clearLocalStorage();
    expect(mockStore['statAnalyzerState']).toBeUndefined();
  });
});

describe('StateManager — ultimosResultados', () => {
  beforeEach(() => {
    StateManager.setUltimosResultados(null);
  });

  test('setUltimosResultados stores results', () => {
    StateManager.setUltimosResultados({ p: 0.01, stat: 3.5 });
    expect(StateManager.getUltimosResultados()).toEqual({ p: 0.01, stat: 3.5 });
  });

  test('getUltimosResultados returns null initially', () => {
    expect(StateManager.getUltimosResultados()).toBeNull();
  });
});

describe('StateManager — event system', () => {
  test('addEventListener registers callback', () => {
    const cb = vi.fn();
    StateManager.addEventListener('dataChange', cb);
    StateManager.updateCell(0, 1, 'trigger');
    expect(cb).toHaveBeenCalled();
  });

  test('removeEventListener unregisters callback', () => {
    const cb = vi.fn();
    StateManager.addEventListener('sheetChange', cb);
    StateManager.removeEventListener('sheetChange', cb);
    StateManager.createSheet('EventTest', 3, 3);
    expect(cb).not.toHaveBeenCalled();
  });
});

describe('StateManager — getStats', () => {
  test('getStats returns summary object', () => {
    const stats = StateManager.getStats();
    expect(stats).toHaveProperty('totalSheets');
    expect(stats).toHaveProperty('activeSheet');
    expect(stats).toHaveProperty('totalRows');
    expect(stats).toHaveProperty('totalCells');
  });
});
