// ════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// indexx-globals.js — Global state variables
// ════════════════════════════════════════════════════════════════

var trabajoSheets = [{
  name: 'Hoja1',
  headers: ['Columna1','Columna2','Columna3','Columna4'],
  rows: Array.from({length:20}, function(){ return ['','','','']; }),
  locked: false
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
var trabajoPage = 0;
var trabajoPageSize = 200;
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
  var quotaStep = 0;
  var maxSteps = 4;
  while (quotaStep < maxSteps) {
    try {
      localStorage.setItem('sigmaPro_trabajoSheets', JSON.stringify(trabajoSheets));
      localStorage.setItem('sigmaPro_trabajoLimits', JSON.stringify({ limits: trabajoLimits, mode: trabajoLimitsMode }));
      // FIX: Remover datosCurrentData de localStorage para evitar duplicación con 19K+ filas
      // datosCurrentData ya está incluido en trabajoSheets, guardarla por separado era redundante
      // y causaba QuotaExceededError en datasets grandes (19K+ rows)
      if (datosCurrentData) {
        if (quotaStep < 2) {
          localStorage.setItem('sigmaPro_datosSourceType', JSON.stringify(datosSourceType));
          // ELIMINADO: localStorage.setItem('sigmaPro_datosCurrentData', ...) — redundante
        }
      }
      if (typeof _V_saveGallery === 'function' && quotaStep < 2) _V_saveGallery();
      updateAnalisisDatasetBadge();
      return;
    } catch(e) {
      if (e.name !== 'QuotaExceededError') {
        console.warn('[Persist] Error saving data:', e);
        return;
      }
      quotaStep++;
      if (quotaStep === 1) {
        if (typeof _V !== 'undefined' && _V.gallery) _V.gallery.forEach(function(g) { delete g.thumb; });
      } else if (quotaStep === 2) {
        localStorage.removeItem('sigmaPro_datosCurrentData');
        localStorage.removeItem('sigmaPro_datosSourceType');
      } else if (quotaStep === 3) {
        if (trabajoSheets && trabajoSheets.length > 1) {
          var removed = trabajoSheets.pop();
          showToast('⚠️ Cuota de almacenamiento excedida. Se eliminó la hoja "' + removed.name + '" para liberar espacio.', true);
        }
      }
    }
  }
  showToast('⚠️ No se pudo guardar: el almacenamiento local está lleno. Exporta tus datos para no perderlos.', true);
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
    // FIX: Remover lectura de sigmaPro_datosCurrentData — ya no se guarda (eliminado para evitar QuotaExceededError)
    // datosCurrentData ahora se restaura desde trabajoSheets si es necesario
    // var dcd = localStorage.getItem('sigmaPro_datosCurrentData');
    // if (dcd) { ... }
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
    imputeMethod: 'media',
    excludeColumns: []
};

function _saveColumnAnalysisConfig() {
    try {
        localStorage.setItem('sigma_columnAnalysisConfig', JSON.stringify(columnAnalysisConfig));
    } catch(e) { console.warn('[Persist] Error saving columnAnalysisConfig:', e); }
}
function _loadColumnAnalysisConfig() {
    try {
        var saved = localStorage.getItem('sigma_columnAnalysisConfig');
        if (saved) {
            var parsed = JSON.parse(saved);
            Object.assign(columnAnalysisConfig, parsed);
        }
    } catch(e) { console.warn('[Persist] Error loading columnAnalysisConfig:', e); }
}
_loadColumnAnalysisConfig();
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

