"use strict";
/**
 * StateManager.ts - Sistema de Gestión de Estado
 * StatAnalyzer Pro v2.0
 * Migrado a TypeScript
 */
// ========================================
// STATE MANAGER (IIFE pattern)
// ========================================
const StateManager = (() => {
    // ========================================
    // ESTADO PRIVADO
    // ========================================
    let state = {
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
    const listeners = {
        sheetChange: [],
        dataChange: [],
        statsChange: [],
        stateLoad: []
    };
    let autoSaveTimer = null;
    let debounceSaveTimer = null;
    // ========================================
    // UTILIDADES PRIVADAS
    // ========================================
    function generateId() {
        return 'sheet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    function cloneDeep(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    function notifyListeners(event) {
        if (!listeners[event])
            return;
        listeners[event].forEach(callback => {
            try {
                callback(state);
            }
            catch (error) {
                console.error(`Error en listener de ${event}:`, error);
            }
        });
    }
    // ========================================
    // INICIALIZACIÓN
    // ========================================
    function init() {
        console.log('🚀 StateManager: Inicializando...');
        if (loadFromLocalStorage()) {
            console.log('✅ Estado restaurado desde localStorage');
            notifyListeners('stateLoad');
        }
        else {
            console.log('📝 Creando nuevo estado inicial');
            createDefaultSheet();
        }
        if (state.config.autoSave) {
            startAutoSave();
        }
        console.log('✅ StateManager inicializado');
    }
    function createDefaultSheet() {
        const sheet = {
            id: generateId(),
            name: 'Hoja 1',
            headers: [],
            data: []
        };
        // @ts-ignore - compatibilidad legacy
        sheet.rows = sheet.data;
        state.sheets = [sheet];
        state.activeSheetId = sheet.id;
        state.sheetCounter = 1;
        return sheet;
    }
    function createSheet(name) {
        if (state.sheets.length >= state.config.maxSheets) {
            throw new Error(`Máximo de hojas alcanzado (${state.config.maxSheets})`);
        }
        state.sheetCounter++;
        const sheet = {
            id: generateId(),
            name: name || `Hoja ${state.sheetCounter}`,
            headers: [],
            data: []
        };
        // @ts-ignore - compatibilidad legacy
        sheet.rows = sheet.data;
        state.sheets.push(sheet);
        state.activeSheetId = sheet.id;
        notifyListeners('sheetChange');
        return sheet;
    }
    function deleteSheet(sheetId) {
        const index = state.sheets.findIndex(s => s.id === sheetId);
        if (index === -1) {
            return false;
        }
        if (state.sheets.length === 1) {
            createDefaultSheet();
            state.sheets = [state.sheets[0]];
        }
        else {
            state.sheets.splice(index, 1);
        }
        if (state.activeSheetId === sheetId) {
            state.activeSheetId = state.sheets[0].id;
        }
        notifyListeners('sheetChange');
        return true;
    }
    function renameSheet(sheetId, newName) {
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet) {
            return false;
        }
        sheet.name = newName;
        notifyListeners('sheetChange');
        return true;
    }
    function setActiveSheet(sheetId) {
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet) {
            return false;
        }
        state.activeSheetId = sheetId;
        notifyListeners('sheetChange');
        return true;
    }
    function getActiveSheet() {
        return state.sheets.find(s => s.id === state.activeSheetId) || null;
    }
    function getAllSheets() {
        return [...state.sheets];
    }
    function getSheet(sheetId) {
        return state.sheets.find(s => s.id === sheetId) || null;
    }
    // ========================================
    // GESTIÓN DE DATOS
    // ========================================
    function updateCell(sheetId, row, col, value) {
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
    function updateHeader(sheetId, col, newHeader) {
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet || col < 0 || col >= sheet.headers.length) {
            return false;
        }
        sheet.headers[col] = newHeader;
        notifyListeners('dataChange');
        return true;
    }
    function addRow(sheetId) {
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet || sheet.data.length >= state.config.maxRows) {
            return false;
        }
        sheet.data.push(new Array(sheet.headers.length).fill(null));
        notifyListeners('dataChange');
        return true;
    }
    function insertRow(sheetId, rowIndex) {
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet || rowIndex < 0 || rowIndex > sheet.data.length) {
            return false;
        }
        sheet.data.splice(rowIndex, 0, new Array(sheet.headers.length).fill(null));
        notifyListeners('dataChange');
        return true;
    }
    function deleteRow(sheetId, rowIndex) {
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet || rowIndex < 0 || rowIndex >= sheet.data.length) {
            return false;
        }
        sheet.data.splice(rowIndex, 1);
        notifyListeners('dataChange');
        return true;
    }
    function addColumn(sheetId, header) {
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
    function insertColumn(sheetId, colIndex, header) {
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
    function deleteColumn(sheetId, colIndex) {
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet || colIndex < 0 || colIndex >= sheet.headers.length) {
            return false;
        }
        sheet.headers.splice(colIndex, 1);
        sheet.data.forEach(row => row.splice(colIndex, 1));
        notifyListeners('dataChange');
        return true;
    }
    function clearSheetData(sheetId) {
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet) {
            return false;
        }
        sheet.headers = [];
        sheet.data = [];
        notifyListeners('dataChange');
        return true;
    }
    function setSheetData(sheetId, headers, rows) {
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet) {
            return false;
        }
        sheet.headers = headers;
        sheet.data = rows;
        notifyListeners('dataChange');
        return true;
    }
    function getSheetData(sheetId) {
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
    function setImportedData(data, fileName) {
        state.importedData = data;
        state.fileName = fileName;
        notifyListeners('dataChange');
    }
    function getImportedData() {
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
    function clearImportedData() {
        state.importedData = null;
        state.fileName = '';
        notifyListeners('dataChange');
    }
    // ========================================
    // ESTADÍSTICOS
    // ========================================
    function addActiveStat(stat) {
        if (!state.activeStats.includes(stat)) {
            state.activeStats.push(stat);
            notifyListeners('statsChange');
        }
    }
    function removeActiveStat(stat) {
        const index = state.activeStats.indexOf(stat);
        if (index === -1) {
            return false;
        }
        state.activeStats.splice(index, 1);
        notifyListeners('statsChange');
        return true;
    }
    function getActiveStats() {
        return [...state.activeStats];
    }
    function clearActiveStats() {
        state.activeStats = [];
        notifyListeners('statsChange');
    }
    // ========================================
    // CONFIGURACIÓN DE HIPÓTESIS
    // ========================================
    function setHypothesisConfig(statName, config) {
        state.hypothesisConfig[statName] = config;
    }
    function getHypothesisConfig(statName) {
        return state.hypothesisConfig[statName] || null;
    }
    function clearHypothesisConfig(statName) {
        if (!state.hypothesisConfig[statName]) {
            return false;
        }
        delete state.hypothesisConfig[statName];
        return true;
    }
    function getAllHypothesisConfig() {
        return { ...state.hypothesisConfig };
    }
    // ========================================
    // PERSISTENCIA
    // ========================================
    function saveToLocalStorage() {
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
        }
        catch (error) {
            console.error('Error guardando en localStorage:', error);
            return false;
        }
    }
    function loadFromLocalStorage() {
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
        }
        catch (error) {
            console.error('Error cargando desde localStorage:', error);
            return false;
        }
    }
    function clearLocalStorage() {
        try {
            localStorage.removeItem('sigmaProState');
        }
        catch (error) {
            console.error('Error limpiando localStorage:', error);
        }
    }
    // ========================================
    // AUTO-GUARDADO
    // ========================================
    function startAutoSave() {
        stopAutoSave();
        if (state.config.autoSave) {
            autoSaveTimer = setInterval(() => {
                saveToLocalStorage();
            }, state.config.autoSaveInterval);
        }
    }
    function stopAutoSave() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
            autoSaveTimer = null;
        }
    }
    // ========================================
    // UTILIDADES
    // ========================================
    function getStats() {
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
    function getNumericCols(sheetId) {
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
    function exportState() {
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
    function importState(jsonString) {
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
        }
        catch (error) {
            console.error('Error importando estado:', error);
            return false;
        }
    }
    function resetState() {
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
    function addEventListener(event, callback) {
        if (!listeners[event]) {
            return;
        }
        listeners[event].push(callback);
    }
    function removeEventListener(event, callback) {
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
        setUltimosResultados: (results) => { state.ultimosResultados = results; },
        getUltimosResultados: () => state.ultimosResultados,
        addEventListener,
        removeEventListener,
        getState: () => ({ ...state })
    };
})();
console.log('✅ StateManager.ts cargado correctamente');
