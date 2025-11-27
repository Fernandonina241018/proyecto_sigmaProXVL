// state.js

const StateManager = (() => {
    // ----------------------------------------
    // VARIABLES PRIVADAS (El estado encapsulado)
    // Nadie fuera de este bloque puede acceder a ellas directamente
    let importedData = null;
    let fileName = '';
    let allSheets = [];
    let activeSheetId = null;
    let sheetCounter = 0;
    
    // Estado de la hoja de trabajo actual
    let workTableData = {
        headers: [],
        data: [],
        rows: 10,
        cols: 5
    };
    // ----------------------------------------
    
    // ----------------------------------------
    // MÉTODOS PÚBLICOS (La única forma de interactuar)
    return {
        // Método para obtener una copia inmutable de los datos
        getWorkTableData: () => ({...workTableData}), 
        
        // Método para actualizar una celda de forma controlada
        updateCell: (row, col, value) => {
            if (workTableData.data[row] && workTableData.data[row][col] !== undefined) {
                workTableData.data[row][col] = value;
                return true;
            }
            return false;
        },
        
        // Método para establecer la data de una hoja al cargarla
        setWorkTableData: (newData) => {
            Object.assign(workTableData, newData); // Copia todas las propiedades de una vez
        },
        
        // Exponer el resto del estado (hojas, archivos, etc.)
        getAllSheets: () => allSheets,
        getActiveSheetId: () => activeSheetId,
        setActiveSheetId: (id) => { activeSheetId = id; }
    };
})();

export default StateManager;

// En un módulo moderno, harías: export default StateManager;