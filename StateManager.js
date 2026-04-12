// ========================================
// STATE MANAGER - Sistema de Gestión de Estado
// ========================================

/**
 * StateManager: Gestiona todo el estado de la aplicación de forma centralizada
 * - Sheets (hojas de trabajo)
 * - Datos importados
 * - Estadísticos activos
 * - Persistencia en localStorage
 */

const StateManager = (() => {
    // ========================================
    // ESTADO PRIVADO
    // ========================================
    
    let state = {
        // Sistema de hojas
        sheets: [],
        activeSheetId: null,
        sheetCounter: 0,
        
        // Datos importados
        importedData: null,
        fileName: '',
        
        // Estadísticos seleccionados
        activeStats: [],
        
        // Resultados del último análisis
        ultimosResultados: null,
        
        // Configuración de pruebas de hipótesis
        hypothesisConfig: {},
        
        // Configuración
        config: {
            autoSave: true,
            autoSaveInterval: 5000, // 5 segundos
            maxSheets: 20,
            maxRows: 10000,
            maxCols: 100
        },
        
        // Historial para undo/redo (opcional)
        history: [],
        historyIndex: -1,
        maxHistorySize: 50
    };
    
    // Listeners para cambios de estado
    const listeners = {
        sheetChange: [],
        dataChange: [],
        statsChange: [],
        stateLoad: []
    };
    
    let autoSaveTimer = null;
    let debounceSaveTimer = null;

    // ========================================
    // INICIALIZACIÓN
    // ========================================
    
    function init() {
        console.log('🚀 StateManager: Inicializando...');
        
        // Intentar cargar estado guardado
        if (loadFromLocalStorage()) {
            console.log('✅ Estado restaurado desde localStorage');
            notifyListeners('stateLoad');
        } else {
            console.log('📝 Creando nuevo estado inicial');
            createDefaultSheet();
        }
        
        // Configurar auto-guardado
        if (state.config.autoSave) {
            startAutoSave();
        }
        
        // Listener para cerrar ventana (guardar antes de salir)
        window.addEventListener('beforeunload', () => {
            saveToLocalStorage();
        });
        
        console.log('✅ StateManager inicializado correctamente');
    }
    
    // ========================================
    // GESTIÓN DE HOJAS (SHEETS)
    // ========================================
    
    function createSheet(name = null, rows = 13, cols = 11, headers = null, data = null) {
        // Validar límite de hojas
        if (state.sheets.length >= state.config.maxSheets) {
            throw new Error(`Límite de ${state.config.maxSheets} hojas alcanzado`);
        }
        
        // Generar nombre automático si no se proporciona
        const sheetName = name || getNextSheetName();
        
        // Validar nombre único
        if (state.sheets.some(s => s.name === sheetName)) {
            throw new Error(`Ya existe una hoja con el nombre "${sheetName}"`);
        }
        
        // Generar headers por defecto usando letras estilo Excel
        const defaultHeaders = ['#', ...Array.from({length: cols - 1}, (_, i) => indexToExcelColumn(i + 1))];
        
        // Generar datos vacíos por defecto
        const defaultData = Array.from({length: rows}, (_, i) => [
            i + 1,
            ...Array(cols - 1).fill('')
        ]);
        
        // Crear objeto sheet
        const newSheet = {
            id: Date.now() + Math.random(), // ID único
            name: sheetName,
            headers: headers || defaultHeaders,
            data: data || defaultData,
            rows: rows,
            cols: cols,
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };
        
        state.sheets.push(newSheet);
        state.activeSheetId = newSheet.id;
        state.sheetCounter++;
        
        notifyListeners('sheetChange');
        scheduleAutoSave();
        
        console.log(`✅ Hoja "${sheetName}" creada (ID: ${newSheet.id})`);
        return newSheet;
    }
    
    function deleteSheet(sheetId) {
        if (state.sheets.length <= 1) {
            throw new Error('Debe haber al menos una hoja');
        }
        
        const sheetIndex = state.sheets.findIndex(s => s.id === sheetId);
        if (sheetIndex === -1) {
            throw new Error('Hoja no encontrada');
        }
        
        const deletedSheet = state.sheets.splice(sheetIndex, 1)[0];
        
        // Si era la hoja activa, cambiar a otra
        if (state.activeSheetId === sheetId) {
            state.activeSheetId = state.sheets[0].id;
        }
        
        notifyListeners('sheetChange');
        scheduleAutoSave();
        
        console.log(`🗑️ Hoja "${deletedSheet.name}" eliminada`);
        return deletedSheet;
    }
    
    function renameSheet(sheetId, newName) {
        if (!newName || newName.trim() === '') {
            throw new Error('El nombre no puede estar vacío');
        }
        
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet) {
            throw new Error('Hoja no encontrada');
        }
        
        // Validar nombre único (excepto la misma hoja)
        if (state.sheets.some(s => s.name === newName.trim() && s.id !== sheetId)) {
            throw new Error(`Ya existe una hoja con el nombre "${newName}"`);
        }
        
        const oldName = sheet.name;
        sheet.name = newName.trim();
        sheet.modified = new Date().toISOString();
        
        notifyListeners('sheetChange');
        scheduleAutoSave();
        
        console.log(`✏️ Hoja renombrada: "${oldName}" → "${sheet.name}"`);
        return sheet;
    }
    
    function setActiveSheet(sheetId) {
        const sheet = state.sheets.find(s => s.id === sheetId);
        if (!sheet) {
            throw new Error('Hoja no encontrada');
        }
        
        state.activeSheetId = sheetId;
        notifyListeners('sheetChange');
        
        console.log(`📄 Hoja activa: "${sheet.name}"`);
        return sheet;
    }
    
    function getActiveSheet() {
        return state.sheets.find(s => s.id === state.activeSheetId);
    }
    
    function getAllSheets() {
        return [...state.sheets]; // Retornar copia para evitar mutaciones
    }
    
    function getSheet(sheetId) {
        return state.sheets.find(s => s.id === sheetId);
    }
    
    // ========================================
    // GESTIÓN DE DATOS DE HOJA
    // ========================================
    
    function updateCell(row, col, value) {
        const sheet = getActiveSheet();
        if (!sheet) {
            throw new Error('No hay hoja activa');
        }
        
        if (row < 0 || row >= sheet.data.length) {
            throw new Error('Índice de fila inválido');
        }
        
        if (col < 0 || col >= sheet.data[row].length) {
            throw new Error('Índice de columna inválido');
        }
        
        // Registrar cambio en auditoría antes de hacerlo
        const oldValue = sheet.data[row][col];
        if (oldValue !== value && typeof Logger !== 'undefined') {
            Logger.logDataChange('UPDATE', { 
                row: row, 
                col: col,
                colName: sheet.headers[col] || col,
                oldValue: oldValue,
                newValue: value
            });
        }
        
        sheet.data[row][col] = value;
        sheet.modified = new Date().toISOString();
        
        notifyListeners('dataChange');
        scheduleAutoSave();
    }
    
    function updateHeader(col, value) {
        const sheet = getActiveSheet();
        if (!sheet) {
            throw new Error('No hay hoja activa');
        }
        
        if (col < 0 || col >= sheet.headers.length) {
            throw new Error('Índice de columna inválido');
        }
        
        sheet.headers[col] = value;
        sheet.modified = new Date().toISOString();
        
        notifyListeners('dataChange');
        scheduleAutoSave();
    }
    
    function addRow(values = null) {
        const sheet = getActiveSheet();
        if (!sheet) {
            throw new Error('No hay hoja activa');
        }
        
        if (sheet.data.length >= state.config.maxRows) {
            throw new Error(`Límite de ${state.config.maxRows} filas alcanzado`);
        }
        
        const newIndex = sheet.data.length + 1;
        const newRow = values || [newIndex, ...Array(sheet.cols - 1).fill('')];
        
        sheet.data.push(newRow);
        sheet.rows = sheet.data.length;
        sheet.modified = new Date().toISOString();
        
        notifyListeners('dataChange');
        scheduleAutoSave();
        
        return newRow;
    }
    
    function deleteRow(rowIndex = null) {
        const sheet = getActiveSheet();
        if (!sheet) {
            throw new Error('No hay hoja activa');
        }
        
        if (sheet.data.length <= 1) {
            throw new Error('Debe haber al menos una fila');
        }
        
        // Si no se especifica índice, eliminar la última fila
        const indexToDelete = rowIndex !== null ? rowIndex : sheet.data.length - 1;
        
        if (indexToDelete < 0 || indexToDelete >= sheet.data.length) {
            throw new Error('Índice de fila inválido');
        }
        
        const deletedRow = sheet.data.splice(indexToDelete, 1)[0];
        
        // Reindexar primera columna
        sheet.data.forEach((row, i) => {
            row[0] = i + 1;
        });
        
        sheet.rows = sheet.data.length;
        sheet.modified = new Date().toISOString();
        
        notifyListeners('dataChange');
        scheduleAutoSave();
        
        return deletedRow;
    }

    function indexToExcelColumn(index) {
        let column = '';
        while (index > 0) {
            const remainder = (index - 1) % 26;
            column = String.fromCharCode(65 + remainder) + column;
            index = Math.floor((index - 1) / 26);
        }
        return column;
    }
    
    function generateUniqueColumnName(existingHeaders) {
        let counter = 1;
        let newName = 'A';
        while (existingHeaders.includes(newName)) {
            newName = indexToExcelColumn(counter);
            counter++;
        }
        return newName;
    }
    
    function addColumn(header = null) {
        const sheet = getActiveSheet();
        if (!sheet) {
            throw new Error('No hay hoja activa');
        }
        
        if (sheet.cols >= state.config.maxCols) {
            throw new Error(`Límite de ${state.config.maxCols} columnas alcanzado`);
        }
        
        const newColNum = sheet.headers.length;
        const newHeader = header || generateUniqueColumnName(sheet.headers);
        
        sheet.headers.push(newHeader);
        sheet.data.forEach(row => row.push(''));
        sheet.cols = sheet.headers.length;
        sheet.modified = new Date().toISOString();
        
        notifyListeners('dataChange');
        scheduleAutoSave();
        
        return newHeader;
    }
    
    function deleteColumn(colIndex = null) {
        const sheet = getActiveSheet();
        if (!sheet) {
            throw new Error('No hay hoja activa');
        }
        
        if (sheet.cols <= 2) { // Mínimo 2: # + 1 columna de datos
            throw new Error('Debe haber al menos una columna de datos');
        }
        
        // Si no se especifica índice, eliminar la última columna
        const indexToDelete = colIndex !== null ? colIndex : sheet.headers.length - 1;
        
        if (indexToDelete < 1 || indexToDelete >= sheet.headers.length) {
            throw new Error('Índice de columna inválido');
        }
        
        const deletedHeader = sheet.headers.splice(indexToDelete, 1)[0];
        sheet.data.forEach(row => row.splice(indexToDelete, 1));
        sheet.cols = sheet.headers.length;
        sheet.modified = new Date().toISOString();
        
        notifyListeners('dataChange');
        scheduleAutoSave();
        
        return deletedHeader;
    }
    
    function insertRow(rowIndex) {
        const sheet = getActiveSheet();
        if (!sheet) {
            throw new Error('No hay hoja activa');
        }
        
        if (sheet.data.length >= state.config.maxRows) {
            throw new Error(`Límite de ${state.config.maxRows} filas alcanzado`);
        }
        
        if (rowIndex < 0 || rowIndex > sheet.data.length) {
            throw new Error('Índice de fila inválido');
        }
        
        const newRow = [rowIndex + 1, ...Array(sheet.cols - 1).fill('')];
        sheet.data.splice(rowIndex, 0, newRow);
        
        // Reindexar primera columna
        sheet.data.forEach((row, i) => {
            row[0] = i + 1;
        });
        
        sheet.rows = sheet.data.length;
        sheet.modified = new Date().toISOString();
        
        notifyListeners('dataChange');
        scheduleAutoSave();
        
        return newRow;
    }
    
    function insertColumn(colIndex, header = null) {
        const sheet = getActiveSheet();
        if (!sheet) {
            throw new Error('No hay hoja activa');
        }
        
        if (sheet.cols >= state.config.maxCols) {
            throw new Error(`Límite de ${state.config.maxCols} columnas alcanzado`);
        }
        
        if (colIndex < 1 || colIndex > sheet.headers.length) {
            throw new Error('Índice de columna inválido');
        }
        
        // La nueva columna toma el nombre correspondiente a su posición
        const newHeader = header || indexToExcelColumn(colIndex);
        
        // Renombrar columnas existentes desde colIndex para mantener secuencia
        for (let i = colIndex; i < sheet.headers.length; i++) {
            sheet.headers[i] = indexToExcelColumn(i + 1);
        }
        
        sheet.headers.splice(colIndex, 0, newHeader);
        sheet.data.forEach(row => row.splice(colIndex, 0, ''));
        
        sheet.cols = sheet.headers.length;
        sheet.modified = new Date().toISOString();
        
        notifyListeners('dataChange');
        scheduleAutoSave();
        
        return newHeader;
    }
    
    function clearSheetData() {
        const sheet = getActiveSheet();
        if (!sheet) {
            throw new Error('No hay hoja activa');
        }
        
        sheet.data = Array.from({length: sheet.rows}, (_, i) => [
            i + 1,
            ...Array(sheet.cols - 1).fill('')
        ]);
        sheet.modified = new Date().toISOString();
        
        notifyListeners('dataChange');
        scheduleAutoSave();
        
        console.log(`🗑️ Datos de hoja "${sheet.name}" limpiados`);
    }
    
    function setSheetData(data, headers = null) {
        const sheet = getActiveSheet();
        if (!sheet) {
            throw new Error('No hay hoja activa');
        }
        
        sheet.data = data;
        if (headers) {
            sheet.headers = headers;
        }
        sheet.rows = data.length;
        sheet.cols = sheet.headers.length;
        sheet.modified = new Date().toISOString();
        
        notifyListeners('dataChange');
        scheduleAutoSave();
    }
    
    function getSheetData() {
        const sheet = getActiveSheet();
        if (!sheet) {
            return null;
        }
        
        return {
            headers: [...sheet.headers],
            data: sheet.data.map(row => [...row]),
            rows: sheet.rows,
            cols: sheet.cols
        };
    }
    
    // ========================================
    // GESTIÓN DE DATOS IMPORTADOS
    // ========================================
    
    function setImportedData(data, filename = 'datos.csv') {
        state.importedData = data;
        state.fileName = filename;
        invalidateNumericColsCache();

        notifyListeners('dataChange');
        scheduleAutoSave();

        console.log(`📥 Datos importados: ${filename}`);
    }
    
    function getImportedData() {
        return state.importedData;
    }
    
    function clearImportedData() {
        state.importedData = null;
        state.fileName = '';
        invalidateNumericColsCache();

        notifyListeners('dataChange');
        scheduleAutoSave();
        
        console.log('🗑️ Datos importados eliminados');
    }
    
    // ========================================
    // GESTIÓN DE ESTADÍSTICOS ACTIVOS
    // ========================================
    
    function addActiveStat(statName) {
        if (state.activeStats.includes(statName)) {
            console.warn(`Estadístico "${statName}" ya está activo`);
            return false;
        }
        
        state.activeStats.push(statName);
        notifyListeners('statsChange');
        scheduleAutoSave();
        
        console.log(`📊 Estadístico añadido: "${statName}"`);
        return true;
    }
    
    function removeActiveStat(statName) {
        const index = state.activeStats.indexOf(statName);
        if (index === -1) {
            console.warn(`Estadístico "${statName}" no está activo`);
            return false;
        }
        
        state.activeStats.splice(index, 1);
        notifyListeners('statsChange');
        scheduleAutoSave();
        
        console.log(`🗑️ Estadístico eliminado: "${statName}"`);
        return true;
    }
    
    function getActiveStats() {
        return [...state.activeStats];
    }
    
    function clearActiveStats() {
        state.activeStats = [];
        notifyListeners('statsChange');
        scheduleAutoSave();
        
        console.log('🗑️ Todos los estadísticos eliminados');
    }
    
    // ========================================
    // CONFIGURACIÓN DE PRUEBAS DE HIPÓTESIS
    // ========================================
    
    function setHypothesisConfig(statName, config) {
        state.hypothesisConfig[statName] = config;
        scheduleAutoSave();
        console.log(`⚙️ Configuración guardada para ${statName}`);
    }
    
    function getHypothesisConfig(statName) {
        return state.hypothesisConfig[statName] || null;
    }
    
    function clearHypothesisConfig(statName) {
        delete state.hypothesisConfig[statName];
        scheduleAutoSave();
    }
    
    function getAllHypothesisConfig() {
        return { ...state.hypothesisConfig };
    }
    
    // ========================================
    // PERSISTENCIA (LocalStorage)
    // ========================================
    
    function saveToLocalStorage() {
        try {
            const serialized = JSON.stringify({
                sheets: state.sheets,
                activeSheetId: state.activeSheetId,
                sheetCounter: state.sheetCounter,
                importedData: state.importedData,
                fileName: state.fileName,
                activeStats: state.activeStats,
                hypothesisConfig: state.hypothesisConfig,
                savedAt: new Date().toISOString()
            });
            
            localStorage.setItem('statAnalyzerState', serialized);
            console.log('💾 Estado guardado en localStorage');
            return true;
        } catch (error) {
            console.error('❌ Error al guardar estado:', error);
            return false;
        }
    }
    
    function loadFromLocalStorage() {
        try {
            const serialized = localStorage.getItem('statAnalyzerState');
            if (!serialized) {
                return false;
            }
            
            const loaded = JSON.parse(serialized);
            
            // Restaurar estado
            state.sheets = loaded.sheets || [];
            state.activeSheetId = loaded.activeSheetId || null;
            state.sheetCounter = loaded.sheetCounter || 0;
            state.importedData = loaded.importedData || null;
            state.fileName = loaded.fileName || '';
            state.activeStats = loaded.activeStats || [];
            state.hypothesisConfig = loaded.hypothesisConfig || {};
            
            console.log(`📂 Estado cargado (guardado: ${loaded.savedAt})`);
            return true;
        } catch (error) {
            console.error('❌ Error al cargar estado:', error);
            return false;
        }
    }
    
    function clearLocalStorage() {
        localStorage.removeItem('statAnalyzerState');
        console.log('🗑️ LocalStorage limpiado');
    }
    
    // ========================================
    // AUTO-GUARDADO
    // ========================================
    
    function startAutoSave() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
        }
        
        autoSaveTimer = setInterval(() => {
            saveToLocalStorage();
        }, state.config.autoSaveInterval);
        
        console.log(`⏰ Auto-guardado activado (cada ${state.config.autoSaveInterval / 1000}s)`);
    }
    
    function stopAutoSave() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
            autoSaveTimer = null;
            console.log('⏸️ Auto-guardado desactivado');
        }
    }
    
    function scheduleAutoSave() {
        // Debounce: espera 400ms antes de guardar.
        // Agrupa múltiples cambios rápidos (como escribir en celdas)
        // en una sola serialización a localStorage.
        if (state.config.autoSave) {
            clearTimeout(debounceSaveTimer);
            debounceSaveTimer = setTimeout(() => {
                saveToLocalStorage();
            }, 400);
        }
    }
    
    // ========================================
    // UTILIDADES
    // ========================================
    
    function getNextSheetName() {
        const existingNames = state.sheets.map(s => s.name);
        let i = 1;
        while (existingNames.includes(`Sheet ${i}`)) {
            i++;
        }
        return `Sheet ${i}`;
    }
    
    function createDefaultSheet() {
        createSheet('Sheet 1', 13, 11);
    }
    
    // Caché de columnas numéricas (evita recalcular en cada render)
    let _numericColsCache = null;

    function getNumericCols(imported) {
        if (!imported || !imported.headers) return [];
        const dataHash = imported.headers.join('|') + '|' + (imported.data?.length || 0);
        if (_numericColsCache && _numericColsCache.hash === dataHash) {
            return _numericColsCache.result;
        }
        const result = imported.headers.filter(h => {
            const vals = imported.data.slice(0, 20).map(r => parseFloat(r[h]));
            return vals.filter(v => !isNaN(v)).length >= vals.length * 0.7;
        });
        _numericColsCache = { hash: dataHash, result };
        return result;
    }

    function invalidateNumericColsCache() {
        _numericColsCache = null;
    }

    function getStats() {
        return {
            totalSheets: state.sheets.length,
            activeSheet: getActiveSheet()?.name || 'Ninguna',
            totalRows: state.sheets.reduce((sum, s) => sum + s.rows, 0),
            totalCells: state.sheets.reduce((sum, s) => sum + (s.rows * s.cols), 0),
            hasImportedData: !!state.importedData,
            activeStatsCount: state.activeStats.length,
            lastSaved: localStorage.getItem('statAnalyzerState') ? 
                JSON.parse(localStorage.getItem('statAnalyzerState')).savedAt : 'Nunca'
        };
    }
    
    function exportState() {
        return JSON.stringify(state, null, 2);
    }
    
    function importState(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            state = { ...state, ...imported };
            notifyListeners('stateLoad');
            scheduleAutoSave();
            console.log('✅ Estado importado correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error al importar estado:', error);
            return false;
        }
    }
    
    function resetState() {
        state.sheets = [];
        state.activeSheetId = null;
        state.sheetCounter = 0;
        state.importedData = null;
        state.fileName = '';
        state.activeStats = [];
        
        createDefaultSheet();
        clearLocalStorage();
        
        notifyListeners('stateLoad');
        console.log('🔄 Estado reiniciado');
    }
    
    // ========================================
    // SISTEMA DE LISTENERS
    // ========================================
    
    function addEventListener(event, callback) {
        if (!listeners[event]) {
            console.warn(`Evento "${event}" no existe`);
            return;
        }
        
        listeners[event].push(callback);
    }
    
    function removeEventListener(event, callback) {
        if (!listeners[event]) {
            return;
        }
        
        const index = listeners[event].indexOf(callback);
        if (index !== -1) {
            listeners[event].splice(index, 1);
        }
    }
    
    function notifyListeners(event) {
        if (!listeners[event]) {
            return;
        }
        
        listeners[event].forEach(callback => {
            try {
                callback(state);
            } catch (error) {
                console.error(`Error en listener de ${event}:`, error);
            }
        });
    }
    
    
    // ========================================
    // API PÚBLICA
    // ========================================
    
    return {
        // Inicialización
        init,
        
        // Gestión de hojas
        createSheet,
        deleteSheet,
        renameSheet,
        setActiveSheet,
        getActiveSheet,
        getAllSheets,
        getSheet,
        
        // Gestión de datos
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
        
        // Datos importados
        setImportedData,
        getImportedData,
        clearImportedData,
        
        // Estadísticos
        addActiveStat,
        removeActiveStat,
        getActiveStats,
        clearActiveStats,
        
        // Configuración de hipótesis
        setHypothesisConfig,
        getHypothesisConfig,
        clearHypothesisConfig,
        getAllHypothesisConfig,
        
        // Persistencia
        saveToLocalStorage,
        loadFromLocalStorage,
        clearLocalStorage,
        
        // Auto-guardado
        startAutoSave,
        stopAutoSave,
        
        // Utilidades
        getStats,
        getNumericCols,
        exportState,
        importState,
        resetState,
        
        // Resultados de análisis
        setUltimosResultados: (results) => { state.ultimosResultados = results; },
        getUltimosResultados: () => state.ultimosResultados,
        
        // Listeners
        addEventListener,
        removeEventListener,
        
        // Acceso directo al estado (solo lectura)
        getState: () => ({ ...state })
    };
})();

// ========================================
// EXPORTAR (si usas módulos)
// ========================================

// Si usas módulos ES6:
// export default StateManager;

// Si usas CommonJS:
// module.exports = StateManager;

console.log('✅ StateManager cargado correctamente');