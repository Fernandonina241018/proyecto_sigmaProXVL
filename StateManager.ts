/**
 * StateManager.ts - Sistema de Gestión de Estado
 * StatAnalyzer Pro v2.0
 * Migrado a TypeScript
 */

// ========================================
// TIPOS E INTERFACES
// ========================================

interface Sheet {
  id: string;
  name: string;
  headers: string[];
  data: unknown[][];
}

interface AppState {
  sheets: Sheet[];
  activeSheetId: string | null;
  sheetCounter: number;
  importedData: Dataset | null;
  fileName: string;
  activeStats: string[];
  ultimosResultados: unknown;
  hypothesisConfig: Record<string, HypothesisConfig>;
  config: AppConfig;
  history: unknown[];
  historyIndex: number;
  maxHistorySize: number;
}

interface AppConfig {
  autoSave: boolean;
  autoSaveInterval: number;
  maxSheets: number;
  maxRows: number;
  maxCols: number;
}

interface Dataset {
  headers: string[];
  data: unknown[][];
}

interface HypothesisConfig {
  column1?: string;
  column2?: string;
  groups?: string[];
  alpha?: number;
}

type EventType = 'sheetChange' | 'dataChange' | 'statsChange' | 'stateLoad';
type EventCallback = (state: AppState) => void;

// ========================================
// STATE MANAGER (IIFE pattern)
// ========================================

const StateManager = (() => {
  // ========================================
  // ESTADO PRIVADO
  // ========================================
  
  let state: AppState = {
    sheets: [],
    activeSheetId: null,
    sheetCounter: 0,
    importedData: null,
    fileName: '',
    activeStats: [],
    ultimosResultados: null,
    hypothesisConfig: {},
    config: {
      autoSave: true,
      autoSaveInterval: 5000,
      maxSheets: 20,
      maxRows: 10000,
      maxCols: 100
    },
    history: [],
    historyIndex: -1,
    maxHistorySize: 50
  };
  
  const listeners: Record<EventType, EventCallback[]> = {
    sheetChange: [],
    dataChange: [],
    statsChange: [],
    stateLoad: []
  };
  
  let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
  let debounceSaveTimer: ReturnType<typeof setTimeout> | null = null;

  // ========================================
  // UTILIDADES PRIVADAS
  // ========================================

  function generateId(): string {
    return 'sheet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function cloneDeep<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  function notifyListeners(event: EventType): void {
    if (!listeners[event]) return;
    
    listeners[event].forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error(`Error en listener de ${event}:`, error);
      }
    });
  }

  // ========================================
  // INICIALIZACIÓN
  // ========================================
  
  function init(): void {
    console.log('🚀 StateManager: Inicializando...');
    
    if (loadFromLocalStorage()) {
      console.log('✅ Estado restaurado desde localStorage');
      notifyListeners('stateLoad');
    } else {
      console.log('📝 Creando nuevo estado inicial');
      createDefaultSheet();
    }
    
    if (state.config.autoSave) {
      startAutoSave();
    }
    
    console.log('✅ StateManager inicializado');
  }

  function createDefaultSheet(): Sheet {
    const sheet: Sheet = {
      id: generateId(),
      name: 'Hoja 1',
      headers: [] as string[],
      data: [] as unknown[][]
    } as Sheet;
    
    // @ts-ignore - compatibilidad legacy
    sheet.rows = sheet.data;
    
    state.sheets = [sheet];
    state.activeSheetId = sheet.id;
    state.sheetCounter = 1;
    
    return sheet;
  }

  function createSheet(name?: string): Sheet {
    if (state.sheets.length >= state.config.maxSheets) {
      throw new Error(`Máximo de hojas alcanzado (${state.config.maxSheets})`);
    }
    
    state.sheetCounter++;
    const sheet: Sheet = {
      id: generateId(),
      name: name || `Hoja ${state.sheetCounter}`,
      headers: [] as string[],
      data: [] as unknown[][]
    } as Sheet;
    
    // @ts-ignore - compatibilidad legacy
    sheet.rows = sheet.data;
    
    state.sheets.push(sheet);
    state.activeSheetId = sheet.id;
    
    notifyListeners('sheetChange');
    
    return sheet;
  }

  function deleteSheet(sheetId: string): boolean {
    const index = state.sheets.findIndex(s => s.id === sheetId);
    
    if (index === -1) {
      return false;
    }
    
    if (state.sheets.length === 1) {
      createDefaultSheet();
      state.sheets = [state.sheets[0]];
    } else {
      state.sheets.splice(index, 1);
    }
    
    if (state.activeSheetId === sheetId) {
      state.activeSheetId = state.sheets[0].id;
    }
    
    notifyListeners('sheetChange');
    
    return true;
  }

  function renameSheet(sheetId: string, newName: string): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet) {
      return false;
    }
    
    sheet.name = newName;
    notifyListeners('sheetChange');
    
    return true;
  }

  function setActiveSheet(sheetId: string): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet) {
      return false;
    }
    
    state.activeSheetId = sheetId;
    notifyListeners('sheetChange');
    
    return true;
  }

  function getActiveSheet(): Sheet | null {
    return state.sheets.find(s => s.id === state.activeSheetId) || null;
  }

  function getAllSheets(): Sheet[] {
    return [...state.sheets];
  }

  function getSheet(sheetId: string): Sheet | null {
    return state.sheets.find(s => s.id === sheetId) || null;
  }

  // ========================================
  // GESTIÓN DE DATOS
  // ========================================

  function updateCell(sheetId: string, row: number, col: number, value: unknown): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet) {
      return false;
    }
    
    if (row >= sheet.data.length) {
      while (sheet.data.length <= row) {
        sheet.data.push(new Array(sheet.headers.length).fill(null));
      }
    }
    
    if (col >= sheet.headers.length) {
      for (let i = sheet.headers.length; i <= col; i++) {
        sheet.headers.push(String.fromCharCode(65 + i));
      }
      sheet.data.forEach(row => {
        while (row.length < sheet.headers.length) {
          row.push(null);
        }
      });
    }
    
    sheet.data[row][col] = value;
    
    notifyListeners('dataChange');
    
    return true;
  }

  function updateHeader(sheetId: string, col: number, newHeader: string): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet || col < 0 || col >= sheet.headers.length) {
      return false;
    }
    
    sheet.headers[col] = newHeader;
    notifyListeners('dataChange');
    
    return true;
  }

  function addRow(sheetId: string): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet || sheet.data.length >= state.config.maxRows) {
      return false;
    }
    
    sheet.data.push(new Array(sheet.headers.length).fill(null));
    notifyListeners('dataChange');
    
    return true;
  }

  function insertRow(sheetId: string, rowIndex: number): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet || rowIndex < 0 || rowIndex > sheet.data.length) {
      return false;
    }
    
    sheet.data.splice(rowIndex, 0, new Array(sheet.headers.length).fill(null));
    notifyListeners('dataChange');
    
    return true;
  }

  function deleteRow(sheetId: string, rowIndex: number): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet || rowIndex < 0 || rowIndex >= sheet.data.length) {
      return false;
    }
    
    sheet.data.splice(rowIndex, 1);
    notifyListeners('dataChange');
    
    return true;
  }

  function addColumn(sheetId: string, header?: string): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet || sheet.headers.length >= state.config.maxCols) {
      return false;
    }
    
    const newHeader = header || String.fromCharCode(65 + sheet.headers.length);
    sheet.headers.push(newHeader);
    sheet.data.forEach(row => row.push(null));
    notifyListeners('dataChange');
    
    return true;
  }

  function insertColumn(sheetId: string, colIndex: number, header?: string): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet || colIndex < 0 || colIndex > sheet.headers.length) {
      return false;
    }
    
    const newHeader = header || String.fromCharCode(65 + colIndex);
    sheet.headers.splice(colIndex, 0, newHeader);
    sheet.data.forEach(row => row.splice(colIndex, 0, null));
    notifyListeners('dataChange');
    
    return true;
  }

  function deleteColumn(sheetId: string, colIndex: number): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet || colIndex < 0 || colIndex >= sheet.headers.length) {
      return false;
    }
    
    sheet.headers.splice(colIndex, 1);
    sheet.data.forEach(row => row.splice(colIndex, 1));
    notifyListeners('dataChange');
    
    return true;
  }

  function clearSheetData(sheetId: string): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet) {
      return false;
    }
    
    sheet.headers = [];
    sheet.data = [];
    notifyListeners('dataChange');
    
    return true;
  }

  function setSheetData(sheetId: string, headers: string[], rows: unknown[][]): boolean {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet) {
      return false;
    }
    
    sheet.headers = headers;
    sheet.data = rows;
    notifyListeners('dataChange');
    
    return true;
  }

  function getSheetData(sheetId: string): { headers: string[]; rows: unknown[][] } | null {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet) {
      return null;
    }
    
    return {
      headers: [...sheet.headers],
      rows: sheet.data.map(row => [...row])
    };
  }

  // ========================================
  // DATOS IMPORTADOS
  // ========================================

  function setImportedData(data: Dataset, fileName: string): void {
    state.importedData = data;
    state.fileName = fileName;
    notifyListeners('dataChange');
  }

  function getImportedData(): { data: Dataset; fileName: string } | null {
    if (!state.importedData) {
      return null;
    }
    
    return {
      data: {
        headers: [...state.importedData.headers],
        data: state.importedData.data.map(row => [...row])
      },
      fileName: state.fileName
    };
  }

  function clearImportedData(): void {
    state.importedData = null;
    state.fileName = '';
    notifyListeners('dataChange');
  }

  // ========================================
  // ESTADÍSTICOS
  // ========================================

  function addActiveStat(stat: string): void {
    if (!state.activeStats.includes(stat)) {
      state.activeStats.push(stat);
      notifyListeners('statsChange');
    }
  }

  function removeActiveStat(stat: string): boolean {
    const index = state.activeStats.indexOf(stat);
    
    if (index === -1) {
      return false;
    }
    
    state.activeStats.splice(index, 1);
    notifyListeners('statsChange');
    
    return true;
  }

  function getActiveStats(): string[] {
    return [...state.activeStats];
  }

  function clearActiveStats(): void {
    state.activeStats = [];
    notifyListeners('statsChange');
  }

  // ========================================
  // CONFIGURACIÓN DE HIPÓTESIS
  // ========================================

  function setHypothesisConfig(statName: string, config: HypothesisConfig): void {
    state.hypothesisConfig[statName] = config;
  }

  function getHypothesisConfig(statName: string): HypothesisConfig | null {
    return state.hypothesisConfig[statName] || null;
  }

  function clearHypothesisConfig(statName: string): boolean {
    if (!state.hypothesisConfig[statName]) {
      return false;
    }
    
    delete state.hypothesisConfig[statName];
    return true;
  }

  function getAllHypothesisConfig(): Record<string, HypothesisConfig> {
    return { ...state.hypothesisConfig };
  }

  // ========================================
  // PERSISTENCIA
  // ========================================

  function saveToLocalStorage(): boolean {
    try {
      const dataToSave = {
        sheets: state.sheets,
        activeSheetId: state.activeSheetId,
        sheetCounter: state.sheetCounter,
        importedData: state.importedData,
        fileName: state.fileName,
        activeStats: state.activeStats,
        hypothesisConfig: state.hypothesisConfig,
        config: state.config
      };
      
      localStorage.setItem('sigmaProState', JSON.stringify(dataToSave));
      
      return true;
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
      return false;
    }
  }

  function loadFromLocalStorage(): boolean {
    try {
      const savedData = localStorage.getItem('sigmaProState');
      
      if (!savedData) {
        return false;
      }
      
      const parsed = JSON.parse(savedData);
      
      if (parsed.sheets && Array.isArray(parsed.sheets)) {
        state.sheets = parsed.sheets.map(sheet => {
          // @ts-ignore - compatibilidad legacy con código que usa rows
          if (sheet.data && !sheet.rows) {
            sheet.rows = sheet.data;
          }
          return sheet;
        });
        state.activeSheetId = parsed.activeSheetId;
        state.sheetCounter = parsed.sheetCounter;
        state.importedData = parsed.importedData;
        state.fileName = parsed.fileName || '';
        state.activeStats = parsed.activeStats || [];
        state.hypothesisConfig = parsed.hypothesisConfig || {};
        state.config = parsed.config || state.config;
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error cargando desde localStorage:', error);
      return false;
    }
  }

  function clearLocalStorage(): void {
    try {
      localStorage.removeItem('sigmaProState');
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  // ========================================
  // AUTO-GUARDADO
  // ========================================

  function startAutoSave(): void {
    stopAutoSave();
    
    if (state.config.autoSave) {
      autoSaveTimer = setInterval(() => {
        saveToLocalStorage();
      }, state.config.autoSaveInterval);
    }
  }

  function stopAutoSave(): void {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  }

  // ========================================
  // UTILIDADES
  // ========================================

  function getStats(): { sheets: number; rows: number; cols: number; cells: number } {
    let totalRows = 0;
    let totalCols = 0;
    let totalCells = 0;
    
    state.sheets.forEach(sheet => {
      totalRows += sheet.data.length;
      totalCols += sheet.headers.length;
      sheet.data.forEach(row => {
        totalCells += row.filter(cell => cell !== null && cell !== '').length;
      });
    });
    
    return {
      sheets: state.sheets.length,
      rows: totalRows,
      cols: totalCols,
      cells: totalCells
    };
  }

  function getNumericCols(sheetId: string): string[] {
    const sheet = state.sheets.find(s => s.id === sheetId);
    
    if (!sheet) {
      return [];
    }
    
    return sheet.headers.filter((header, colIndex) => {
      const values = sheet.data.map(row => row[colIndex]).filter(v => v !== null && v !== '');
      const numericCount = values.filter(v => !isNaN(parseFloat(String(v)))).length;
      
      return numericCount / values.length >= 0.8;
    });
  }

  function exportState(): string {
    const exportData = {
      sheets: state.sheets,
      activeSheetId: state.activeSheetId,
      sheetCounter: state.sheetCounter,
      importedData: state.importedData,
      fileName: state.fileName,
      activeStats: state.activeStats,
      config: state.config
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  function importState(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString);
      
      if (imported.sheets) {
        state.sheets = imported.sheets;
        state.activeSheetId = imported.activeSheetId;
        state.sheetCounter = imported.sheetCounter;
        state.importedData = imported.importedData;
        state.fileName = imported.fileName || '';
        state.activeStats = imported.activeStats || [];
        state.config = imported.config || state.config;
        
        notifyListeners('stateLoad');
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error importando estado:', error);
      return false;
    }
  }

  function resetState(): void {
    stopAutoSave();
    clearLocalStorage();
    
    state.sheets = [];
    state.activeSheetId = null;
    state.sheetCounter = 0;
    state.importedData = null;
    state.fileName = '';
    state.activeStats = [];
    state.ultimosResultados = null;
    state.hypothesisConfig = {};
    state.history = [];
    state.historyIndex = -1;
    
    createDefaultSheet();
    startAutoSave();
  }

  // ========================================
  // EVENT LISTENERS
  // ========================================

  function addEventListener(event: EventType, callback: EventCallback): void {
    if (!listeners[event]) {
      return;
    }
    
    listeners[event].push(callback);
  }

  function removeEventListener(event: EventType, callback: EventCallback): boolean {
    if (!listeners[event]) {
      return false;
    }
    
    const index = listeners[event].indexOf(callback);
    if (index !== -1) {
      listeners[event].splice(index, 1);
      return true;
    }
    
    return false;
  }

  // ========================================
  // API PÚBLICA
  // ========================================

  return {
    init,
    createSheet,
    deleteSheet,
    renameSheet,
    setActiveSheet,
    getActiveSheet,
    getAllSheets,
    getSheet,
    updateCell,
    updateHeader,
    addRow,
    insertRow,
    deleteRow,
    addColumn,
    insertColumn,
    deleteColumn,
    clearSheetData,
    setSheetData,
    getSheetData,
    setImportedData,
    getImportedData,
    clearImportedData,
    addActiveStat,
    removeActiveStat,
    getActiveStats,
    clearActiveStats,
    setHypothesisConfig,
    getHypothesisConfig,
    clearHypothesisConfig,
    getAllHypothesisConfig,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    startAutoSave,
    stopAutoSave,
    getStats,
    getNumericCols,
    exportState,
    importState,
    resetState,
    setUltimosResultados: (results: unknown) => { state.ultimosResultados = results; },
    getUltimosResultados: () => state.ultimosResultados,
    addEventListener,
    removeEventListener,
    getState: () => ({ ...state })
  };
})();

console.log('✅ StateManager.ts cargado correctamente');