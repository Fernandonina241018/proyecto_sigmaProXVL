// ════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// indexx-globals.js — Global state variables
// ════════════════════════════════════════════════════════════════

var trabajoSheets = [{
  name: 'Hoja1',
  headers: ['Columna1','Columna2','Columna3','Columna4'],
  rows: Array.from({length:20}, function(){ return ['','','','']; })
}];
var trabajoActiveSheetIndex = 0;
var trabajoActiveCell = { row: 0, col: 0 };
var trabajoSelectionRange = null; // {r1,c1,r2,c2}
var trabajoImportedData = null;
var trabajoKeydownHandler = null;
var trabajoFreezeFirstCol = false;
var trabajoConditionalFormat = false;
// Undo/redo stacks — store deep snapshots of sheet rows+headers
var undoStack = [];
var redoStack = [];
var MAX_UNDO = 30;

var datosCurrentData = null;
var datosCurrentFileName = '';
var datosSourceType = 'none'; // 'none' | 'file' | 'paste' | 'manual'
var datosRecentFiles = [];
var datasetTooltip = null;
var currentPage = 'trabajo';
var _auditoriaInited = false;
var _usuariosInited = false;

function _persistAllData() {
  try {
    localStorage.setItem('sigmaPro_trabajoSheets', JSON.stringify(trabajoSheets));
    localStorage.setItem('sigmaPro_trabajoLimits', JSON.stringify({ limits: trabajoLimits, mode: trabajoLimitsMode }));
    if (datosCurrentData) {
      localStorage.setItem('sigmaPro_datosSourceType', JSON.stringify(datosSourceType));
    localStorage.setItem('sigmaPro_datosCurrentData', JSON.stringify({
        data: datosCurrentData,
        fileName: datosCurrentFileName,
        timestamp: Date.now()
      }));
    }
    updateAnalisisDatasetBadge();
  } catch(e) {
    console.warn('[Persist] Error saving data:', e);
  }
}

function _restoreAllData() {
  try {
    var ts = localStorage.getItem('sigmaPro_trabajoSheets');
    if (ts) {
      var parsed = JSON.parse(ts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        trabajoSheets = parsed;
      }
    }
    var tl = localStorage.getItem('sigmaPro_trabajoLimits');
    if (tl) {
      var parsedTL = JSON.parse(tl);
      trabajoLimits = parsedTL.limits || null;
      trabajoLimitsMode = parsedTL.mode || 'global';
    }
    var dst = localStorage.getItem('sigmaPro_datosSourceType');
    if(dst) datosSourceType = JSON.parse(dst);
    var dcd = localStorage.getItem('sigmaPro_datosCurrentData');
    if (dcd) {
      var parsed2 = JSON.parse(dcd);
      if (parsed2 && parsed2.data && parsed2.data.headers && Array.isArray(parsed2.data.rows)) {
        datosCurrentData = parsed2.data;
        datosCurrentFileName = parsed2.fileName || '';
      }
    }
  } catch(e) {
    console.warn('[Persist] Error restoring data:', e);
  }
}
// Analysis page state - dynamic tests
var analisisSelectedCategory = 'descriptiva';
var analisisSelectedTest = null;
var analisisLastResult = null;
var analisisResultContent = null;

// Column analysis config (used by getNumericColumns, ejecutarAnalisis)
var columnAnalysisConfig = {
    threshold: 0.5,
    forceInclude: false,
    imputeMissing: false,
    imputeMethod: 'media'
};
// Datos table state
var datosPage = 0;
var datosPageSize = 50;
var datosSortCol = -1;
var datosSortAsc = true;
var datosFilters = []; // [{col, op, val}]
var datosFilteredRows = [];

// Límites (especificaciones) para tests de capacidad
var trabajoLimits = null;
var trabajoLimitsMode = 'global';
var acCurrentCell = null;
var acItems = [];
var acIndex = -1;

