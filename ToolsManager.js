/**
 * ToolsManager.js - Funciones del menú Tools para StatAnalyzer Pro
 * Cargado: ✓
 */
console.log('=== ToolsManager.js cargado ===');
 /* 
 * Implementación de herramientas de procesamiento de datos para la hoja de trabajo.
 * Estas funciones operan sobre los datos del grid en indexx.html.
 * 
 * @version 1.0
 * @date Mayo 2026
 */

// ════════════════════════════════════════════════════════════════
// HERRAMIENTAS DE PROCESAMIENTO DE DATOS
// ════════════════════════════════════════════════════════════════

/**
 * Obtiene los datos actuales de la hoja de trabajo activa
 * @returns {Object|null} { headers: string[], rows: any[][] } o null si no hay datos
 */
function getTrabajoData() {
  if (typeof getCurrentSheet !== 'function') {
    console.error('ToolsManager: getCurrentSheet no está disponible. ¿Está cargado el script de indexx.html?');
    return null;
  }
  var sheet = getCurrentSheet();
  if (!sheet) {
    console.warn('ToolsManager: No hay hoja activa');
    return null;
  }
  if (!sheet.headers || sheet.headers.length === 0) {
    console.warn('ToolsManager: La hoja no tiene headers');
    return null;
  }
  if (!sheet.rows || sheet.rows.length === 0) {
    console.warn('ToolsManager: La hoja no tiene filas');
    return null;
  }
  var dataRows = sheet.rows.filter(function(row) {
    return row.some(function(cell) { return cell !== null && cell !== undefined && cell !== ''; });
  });
  if (dataRows.length === 0) {
    console.warn('ToolsManager: La hoja no tiene datos (solo celdas vacías)');
    return null;
  }
  console.log('ToolsManager: Datos obtenidos - Headers:', sheet.headers.length, 'Filas:', dataRows.length);
  return {
    headers: sheet.headers,
    rows: dataRows
  };
}

/**
 * Detecta valores atípicos (outliers) usando el método IQR
 * @param {number[]} datos - Array de valores numéricos
 * @param {Object} opciones - { method: 'iqr'|'zscore', threshold: number }
 * @returns {Object} { outliers: number[], indices: number[], metodo: string }
 */
function detectarOutliers(datos, opciones) {
  var metodo = opciones && opciones.method ? opciones.method : 'iqr';
  var threshold = opciones && opciones.threshold ? opciones.threshold : 1.5;
  
  if (!datos || datos.length < 4) {
    return { error: 'Se requieren al menos 4 observaciones', codigo: 'MIN_MUESTRA' };
  }
  
  var valores = datos.filter(function(v) {
    return typeof v === 'number' && !isNaN(v);
  });
  
  if (valores.length < 4) {
    return { error: 'Datos insuficientes o inválidos', codigo: 'DATOS_INVALIDOS' };
  }
  
  var resultado = { outliers: [], indices: [], metodo: metodo, n: valores.length };
  
  if (metodo === 'iqr') {
    var ordenados = [...valores].sort(function(a, b) { return a - b; });
    var q1 = ordenados[Math.floor(ordenados.length * 0.25)];
    var q3 = ordenados[Math.floor(ordenados.length * 0.75)];
    var iqr = q3 - q1;
    var limiteInferior = q1 - threshold * iqr;
    var limiteSuperior = q3 + threshold * iqr;
    
    valores.forEach(function(v, i) {
      if (v < limiteInferior || v > limiteSuperior) {
        resultado.outliers.push(v);
        resultado.indices.push(i);
      }
    });
  } else if (metodo === 'zscore') {
    var media = valores.reduce(function(a, b) { return a + b; }, 0) / valores.length;
    var varianza = valores.reduce(function(acc, v) { return acc + Math.pow(v - media, 2); }, 0) / valores.length;
    var desvEst = Math.sqrt(varianza);
    
    valores.forEach(function(v, i) {
      var zscore = Math.abs((v - media) / desvEst);
      if (zscore > threshold) {
        resultado.outliers.push(v);
        resultado.indices.push(i);
      }
    });
  }
  
  return resultado;
}

/**
 * Imputa valores faltantes usando el método especificado
 * @param {any[]} datos - Array de valores (puede contener null/undefined/'')
 * @param {Object} opciones - { method: 'media'|'mediana'|'moda'|'forward'|'backward', columna: number }
 * @returns {Object} { datos: any[], imputaciones: number, metodo: string }
 */
function imputarValoresFaltantes(datos, opciones) {
  var method = opciones && opciones.method ? opciones.method : 'media';
  
  if (!datos || datos.length === 0) {
    return { error: 'No hay datos para procesar', codigo: 'SIN_DATOS' };
  }
  
  var resultado = {
    datos: [...datos],
    imputaciones: 0,
    metodo: method
  };
  
  var valoresValidos = datos.filter(function(v) {
    return v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v));
  });
  
  if (valoresValidos.length === 0) {
    return { error: 'No hay valores válidos para imputar', codigo: 'DATOS_INVALIDOS' };
  }
  
  var valorImputacion;
  
  switch (method) {
    case 'media':
      var suma = valoresValidos.reduce(function(a, b) { return a + parseFloat(b); }, 0);
      valorImputacion = suma / valoresValidos.length;
      break;
    case 'mediana':
      var ordenados = [...valoresValidos].sort(function(a, b) { return parseFloat(a) - parseFloat(b); });
      var mid = Math.floor(ordenados.length / 2);
      valorImputacion = ordenados.length % 2 !== 0 ? parseFloat(ordenados[mid]) : (parseFloat(ordenados[mid - 1]) + parseFloat(ordenados[mid])) / 2;
      break;
    case 'moda':
      var freq = {};
      valoresValidos.forEach(function(v) { freq[v] = (freq[v] || 0) + 1; });
      var maxFreq = 0;
      valoresValidos.forEach(function(v) { if (freq[v] > maxFreq) { maxFreq = freq[v]; valorImputacion = parseFloat(v); } });
      break;
    case 'forward':
      for (var i = 0; i < resultado.datos.length; i++) {
        if (resultado.datos[i] === null || resultado.datos[i] === undefined || resultado.datos[i] === '') {
          if (i > 0 && resultado.datos[i - 1] !== null && resultado.datos[i - 1] !== undefined && resultado.datos[i - 1] !== '') {
            resultado.datos[i] = resultado.datos[i - 1];
            resultado.imputaciones++;
          }
        }
      }
      return resultado;
    case 'backward':
      for (var j = resultado.datos.length - 1; j >= 0; j--) {
        if (resultado.datos[j] === null || resultado.datos[j] === undefined || resultado.datos[j] === '') {
          if (j < resultado.datos.length - 1 && resultado.datos[j + 1] !== null && resultado.datos[j + 1] !== undefined && resultado.datos[j + 1] !== '') {
            resultado.datos[j] = resultado.datos[j + 1];
            resultado.imputaciones++;
          }
        }
      }
      return resultado;
    default:
      valorImputacion = 0;
  }
  
  resultado.datos = resultado.datos.map(function(v) {
    if (v === null || v === undefined || v === '') {
      resultado.imputaciones++;
      return valorImputacion;
    }
    return v;
  });
  
  return resultado;
}

/**
 * Codifica variables categóricas
 * @param {string[]} datos - Array de valores categóricos
 * @param {Object} opciones - { method: 'label'|'onehot'|'ordinal' }
 * @returns {Object} { codificacion: Object, categories: string[], method: string }
 */
function codificarCategoricas(datos, opciones) {
  var method = opciones && opciones.method ? opciones.method : 'label';
  
  if (!datos || datos.length === 0) {
    return { error: 'No hay datos para codificar', codigo: 'SIN_DATOS' };
  }
  
  var unicos = [];
  datos.forEach(function(v) {
    if (v !== null && v !== undefined && v !== '' && unicos.indexOf(v) === -1) {
      unicos.push(v);
    }
  });
  
  if (unicos.length === 0) {
    return { error: 'No hay categorías válidas', codigo: 'SIN_DATOS' };
  }
  
  var resultado = {
    categories: unicos,
    method: method,
    n: datos.length
  };
  
  if (method === 'label') {
    resultado.codificacion = {};
    unicos.forEach(function(cat, i) {
      resultado.codificacion[cat] = i;
    });
    resultado.encoded = datos.map(function(v) {
      return resultado.codificacion[v] !== undefined ? resultado.codificacion[v] : null;
    });
  } else if (method === 'onehot') {
    resultado.onehot = datos.map(function(v) {
      var row = new Array(unicos.length).fill(0);
      var idx = unicos.indexOf(v);
      if (idx !== -1) row[idx] = 1;
      return row;
    });
    resultado.columns = unicos.map(function(c) { return 'is_' + c; });
  } else if (method === 'ordinal') {
    resultado.codificacion = {};
    unicos.sort();
    unicos.forEach(function(cat, i) {
      resultado.codificacion[cat] = i;
    });
    resultado.encoded = datos.map(function(v) {
      return resultado.codificacion[v] !== undefined ? resultado.codificacion[v] : null;
    });
  }
  
  return resultado;
}

/**
 * Escala y normaliza datos
 * @param {number[]} datos - Array de valores numéricos
 * @param {Object} opciones - { method: 'minmax'|'zscore'|'robust', min: number, max: number }
 * @returns {Object} { datos: number[], metodo: string, params: Object }
 */
function escalarNormalizar(datos, opciones) {
  var method = opciones && opciones.method ? opciones.method : 'minmax';
  
  if (!datos || datos.length === 0) {
    return { error: 'No hay datos para escalar', codigo: 'SIN_DATOS' };
  }
  
  var valores = datos.filter(function(v) {
    return typeof v === 'number' && !isNaN(v);
  });
  
  if (valores.length === 0) {
    return { error: 'No hay valores numéricos válidos', codigo: 'DATOS_INVALIDOS' };
  }
  
  var resultado = { datos: [], method: method, n: valores.length };
  
  if (method === 'minmax') {
    var min = Math.min.apply(null, valores);
    var max = Math.max.apply(null, valores);
    var range = max - min;
    resultado.params = { min: min, max: max };
    resultado.datos = valores.map(function(v) {
      return range === 0 ? 0.5 : (v - min) / range;
    });
  } else if (method === 'zscore') {
    var media = valores.reduce(function(a, b) { return a + b; }, 0) / valores.length;
    var varianza = valores.reduce(function(acc, v) { return acc + Math.pow(v - media, 2); }, 0) / valores.length;
    var desvEst = Math.sqrt(varianza);
    resultado.params = { media: media, desvEst: desvEst };
    resultado.datos = valores.map(function(v) {
      return desvEst === 0 ? 0 : (v - media) / desvEst;
    });
  } else if (method === 'robust') {
    var ordenados = [...valores].sort(function(a, b) { return a - b; });
    var q1 = ordenados[Math.floor(ordenados.length * 0.25)];
    var q3 = ordenados[Math.floor(ordenados.length * 0.75)];
    var iqr = q3 - q1;
    resultado.params = { q1: q1, q3: q3, iqr: iqr };
    resultado.datos = valores.map(function(v) {
      return iqr === 0 ? 0 : (v - q1) / iqr;
    });
  }
  
  return resultado;
}

/**
 * Calcula la matriz de correlación entre columnas
 * @param {any[][]} datos - Matriz de datos (filas x columnas)
 * @param {Object} opciones - { method: 'pearson'|'spearman'|'kendall' }
 * @returns {Object} { matrix: number[][], columnas: string[], method: string }
 */
function calcularMatrizCorrelacion(datos, opciones) {
  var method = opciones && opciones.method ? opciones.method : 'pearson';
  
  if (!datos || datos.length < 2) {
    return { error: 'Se requieren al menos 2 filas de datos', codigo: 'MIN_MUESTRA' };
  }
  
  var numCols = datos[0].length;
  if (numCols < 2) {
    return { error: 'Se requieren al menos 2 columnas', codigo: 'DATOS_INVALIDOS' };
  }
  
  var cols = [];
  for (var c = 0; c < numCols; c++) {
    var colData = datos.map(function(row) { return parseFloat(row[c]); }).filter(function(v) { return !isNaN(v); });
    if (colData.length >= 2) {
      cols.push(colData);
    }
  }
  
  if (cols.length < 2) {
    return { error: 'No hay suficientes columnas numéricas', codigo: 'DATOS_INVALIDOS' };
  }
  
  var matrix = [];
  for (var i = 0; i < cols.length; i++) {
    var row = [];
    for (var j = 0; j < cols.length; j++) {
      if (i === j) {
        row.push(1);
      } else if (j < i) {
        row.push(matrix[j][i]);
      } else {
        var corr = calcularCorrelacionDosColumnas(cols[i], cols[j], method);
        row.push(corr);
      }
    }
    matrix.push(row);
  }
  
  return {
    matrix: matrix,
    columnas: cols.map(function(_, i) { return 'Col' + (i + 1); }),
    method: method,
    n: cols[0].length
  };
}

function calcularCorrelacionDosColumnas(col1, col2, method) {
  var n = Math.min(col1.length, col2.length);
  if (n < 2) return 0;
  
  var c1 = col1.slice(0, n);
  var c2 = col2.slice(0, n);
  
  if (method === 'pearson') {
    var media1 = c1.reduce(function(a, b) { return a + b; }, 0) / n;
    var media2 = c2.reduce(function(a, b) { return a + b; }, 0) / n;
    var num = 0, den1 = 0, den2 = 0;
    for (var i = 0; i < n; i++) {
      var diff1 = c1[i] - media1;
      var diff2 = c2[i] - media2;
      num += diff1 * diff2;
      den1 += diff1 * diff1;
      den2 += diff2 * diff2;
    }
    var den = Math.sqrt(den1 * den2);
    return den === 0 ? 0 : num / den;
  } else if (method === 'spearman') {
    var rank1 = obtenerRank(c1);
    var rank2 = obtenerRank(c2);
    return calcularCorrelacionDosColumnas(rank1, rank2, 'pearson');
  }
  return 0;
}

function obtenerRank(arr) {
  var sorted = arr.map(function(v, i) { return { v: v, i: i }; }).sort(function(a, b) { return a.v - b.v; });
  var ranks = new Array(arr.length);
  sorted.forEach(function(item, i) { ranks[item.i] = i + 1; });
  return ranks;
}

/**
 * Particiona datos en entrenamiento y prueba
 * @param {any[][]} datos - Matriz de datos
 * @param {Object} opciones - { testSize: number (0-1), shuffle: boolean }
 * @returns {Object} { train: any[][], test: any[][], trainSize: number, testSize: number }
 */
function particionarTrainTest(datos, opciones) {
  var testSize = opciones && opciones.testSize ? opciones.testSize : 0.2;
  var shuffle = opciones && opciones.shuffle !== undefined ? opciones.shuffle : true;
  
  if (!datos || datos.length < 2) {
    return { error: 'Se requieren al menos 2 filas', codigo: 'MIN_MUESTRA' };
  }
  
  var datosCopia = [...datos];
  if (shuffle) {
    datosCopia.sort(function() { return Math.random() - 0.5; });
  }
  
  var testCount = Math.floor(datosCopia.length * testSize);
  testCount = Math.max(1, Math.min(testCount, datosCopia.length - 1));
  
  var trainCount = datosCopia.length - testCount;
  
  return {
    train: datosCopia.slice(0, trainCount),
    test: datosCopia.slice(trainCount),
    trainSize: trainCount,
    testSize: testCount
  };
}

/**
 * Selecciona las mejores variables usando correlación
 * @param {any[][]} datos - Matriz de datos
 * @param {Object} opciones - { threshold: number, targetCol: number }
 * @returns {Object} { selected: number[], correlations: Object }
 */
function seleccionarVariables(datos, opciones) {
  var threshold = opciones && opciones.threshold ? opciones.threshold : 0.3;
  var targetCol = opciones && opciones.targetCol !== undefined ? opciones.targetCol : 0;
  
  if (!datos || datos.length < 2) {
    return { error: 'Se requieren al menos 2 filas', codigo: 'MIN_MUESTRA' };
  }
  
  var numCols = datos[0].length;
  if (numCols < 2) {
    return { error: 'Se requieren al menos 2 columnas', codigo: 'DATOS_INVALIDOS' };
  }
  
  var cols = [];
  for (var c = 0; c < numCols; c++) {
    var colData = datos.map(function(row) { return parseFloat(row[c]); }).filter(function(v) { return !isNaN(v); });
    if (colData.length >= 2) cols.push(colData);
  }
  
  if (cols.length < 2) {
    return { error: 'No hay suficientes columnas numéricas', codigo: 'DATOS_INVALIDOS' };
  }
  
  if (targetCol >= cols.length) targetCol = 0;
  
  var correlations = {};
  var selected = [];
  
  for (var i = 0; i < cols.length; i++) {
    if (i === targetCol) {
      selected.push(i);
      continue;
    }
    var corr = Math.abs(calcularCorrelacionDosColumnas(cols[targetCol], cols[i], 'pearson'));
    correlations['Col' + (i + 1)] = corr;
    if (corr >= threshold) {
      selected.push(i);
    }
  }
  
  return {
    selected: selected,
    correlations: correlations,
    threshold: threshold,
    n: datos.length
  };
}

/**
 * Exporta datos a formato CSV
 * @param {Object} datos - { headers: string[], rows: any[][] }
 * @param {Object} opciones - { delimiter: string, filename: string }
 * @returns {string} CSV formateado
 */
function exportarCSV(datos, opciones) {
  var delimiter = opciones && opciones.delimiter ? opciones.delimiter : ',';
  
  if (!datos || !datos.headers || !datos.rows) {
    return '';
  }
  
  var lines = [];
  lines.push(datos.headers.join(delimiter));
  
  datos.rows.forEach(function(row) {
    var rowStr = row.map(function(cell) {
      var val = String(cell === null || cell === undefined ? '' : cell);
      if (val.indexOf(delimiter) !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1) {
        val = '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    }).join(delimiter);
    lines.push(rowStr);
  });
  
  return lines.join('\n');
}

/**
 * Descarga CSV como archivo
 * @param {string} csv - Contenido CSV
 * @param {string} filename - Nombre del archivo
 */
function descargarCSV(csv, filename) {
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement('a');
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Elimina filas duplicadas
 * @param {any[][]} datos - Matriz de datos
 * @param {Object} opciones - { columns: number[] }
 * @returns {Object} { rows: any[][], eliminadas: number }
 */
function eliminarDuplicados(datos, opciones) {
  var cols = opciones && opciones.columns ? opciones.columns : null;
  
  if (!datos || datos.length === 0) {
    return { error: 'No hay datos', codigo: 'SIN_DATOS' };
  }
  
  console.log('eliminarDuplicados: recibido', datos.length, 'filas');
  console.log('Primera fila:', datos[0]);
  
  var seen = [];
  var unique = [];
  var eliminadas = 0;
  
  datos.forEach(function(row, idx) {
    var rowClean = row.map(function(v) { return String(v === null || v === undefined ? '' : v).trim(); });
    if (rowClean.length > 1) rowClean.shift();
    var key = rowClean.join('|');
    
    if (seen.indexOf(key) === -1) {
      seen.push(key);
      unique.push(row);
    } else {
      eliminadas++;
      console.log('Duplicado encontrado en fila', idx, ':', key.substring(0, 30));
    }
  });
  
  console.log('Total eliminadas:', eliminadas);
  return { rows: unique, eliminadas: eliminadas };
}

/**
 * Filtra filas según condición
 * @param {any[][]} datos - Matriz de datos
 * @param {Object} opciones - { column: number, operator: string, value: any }
 * @returns {Object} { rows: any[][], filtradas: number }
 */
function filtrarFilas(datos, opciones) {
  var colIdx = opciones && opciones.column !== undefined ? opciones.column : 0;
  var operator = opciones && opciones.operator ? opciones.operator : 'equals';
  var value = opciones.value;
  
  if (!datos || datos.length === 0) {
    return { error: 'No hay datos', codigo: 'SIN_DATOS' };
  }
  
  if (colIdx >= datos[0].length) {
    return { error: 'Índice de columna inválido', codigo: 'COLUMNA_INVALIDA' };
  }
  
  var filtered = [];
  var filtradas = 0;
  
  datos.forEach(function(row) {
    var cellValue = row[colIdx];
    var matches = false;
    
    switch (operator) {
      case 'equals':
        matches = String(cellValue) === String(value);
        break;
      case 'contains':
        matches = String(cellValue).toLowerCase().indexOf(String(value).toLowerCase()) !== -1;
        break;
      case 'gt':
        matches = parseFloat(cellValue) > parseFloat(value);
        break;
      case 'lt':
        matches = parseFloat(cellValue) < parseFloat(value);
        break;
      case 'gte':
        matches = parseFloat(cellValue) >= parseFloat(value);
        break;
      case 'lte':
        matches = parseFloat(cellValue) <= parseFloat(value);
        break;
      case 'empty':
        matches = !cellValue || cellValue === '' || cellValue === null || cellValue === undefined;
        break;
      case 'notempty':
        matches = cellValue && cellValue !== '' && cellValue !== null && cellValue !== undefined;
        break;
      default:
        matches = false;
    }
    
    if (matches) {
      filtered.push(row);
    } else {
      filtradas++;
    }
  });
  
  return { rows: filtered, filtradas: filtradas };
}

// ════════════════════════════════════════════════════════════════
// HANDLER CENTRAL PARA TOOLS MENU
// ════════════════════════════════════════════════════════════════

function handleToolsAction(action, opciones) {
  console.log('=== ToolsManager: handleToolsAction llamado ===', action);
  console.log('getCurrentSheet disponible:', typeof getCurrentSheet);
  if (typeof getCurrentSheet === 'undefined') {
    alert('Error: getCurrentSheet no está definido. Recarga la página.');
    return;
  }
  
  var data = getTrabajoData();
  if (!data) {
    console.warn('No hay datos en la hoja de trabajo');
    alert('No hay datos en la hoja de trabajo. Importa datos desde la página Datos y envíalos a Trabajo.');
    return null;
  }
  console.log('Datos obtenidos:', data.headers.length, 'headers,', data.rows.length, 'filas');
  
  var resultado = null;
  
  console.log('Procesando acción:', action);
  
  var resultado = null;
  var mensaje = '';
  
  switch (action) {
    case 'remove-duplicates':
      resultado = eliminarDuplicados(data.rows, opciones);
      mensaje = 'Filas duplicadas eliminadas: ' + (resultado.eliminadas || 0);
      break;
    case 'filter-rows':
      resultado = filtrarFilas(data.rows, opciones);
      mensaje = 'Filas filtradas: ' + (resultado.filtradas || 0) + ' | Resultado: ' + resultado.rows.length + ' filas';
      break;
    case 'outlier-detection':
      var colIdx = opciones && opciones.column !== undefined ? opciones.column : 0;
      var colData = data.rows.map(function(r) { return parseFloat(r[colIdx]); }).filter(function(v) { return !isNaN(v); });
      resultado = detectarOutliers(colData, opciones);
      mensaje = 'Outliers detectados: ' + (resultado.outliers ? resultado.outliers.length : 0);
      break;
    case 'handle-missing':
      var colIdx2 = opciones && opciones.column !== undefined ? opciones.column : 0;
      var colData2 = data.rows.map(function(r) { return r[colIdx2]; });
      resultado = imputarValoresFaltantes(colData2, opciones);
      mensaje = 'Valores imputador: ' + (resultado.imputaciones || 0);
      break;
    case 'encode-categorical':
      var colIdx3 = opciones && opciones.column !== undefined ? opciones.column : 0;
      var colData3 = data.rows.map(function(r) { return String(r[colIdx3] || ''); });
      resultado = codificarCategoricas(colData3, opciones);
      mensaje = 'Categorías encontradas: ' + (resultado.categories ? resultado.categories.length : 0);
      break;
    case 'scale-normalize':
      var colIdx4 = opciones && opciones.column !== undefined ? opciones.column : 0;
      var colData4 = data.rows.map(function(r) { return parseFloat(r[colIdx4]); }).filter(function(v) { return !isNaN(v); });
      resultado = escalarNormalizar(colData4, opciones);
      mensaje = 'Datos normalizados: ' + resultado.datos.length + ' valores';
      break;
    case 'correlation-matrix':
      resultado = calcularMatrizCorrelacion(data.rows, opciones);
      mensaje = 'Matriz de correlación calculada: ' + resultado.matrix.length + 'x' + resultado.matrix[0].length;
      break;
    case 'train-test-split':
      resultado = particionarTrainTest(data.rows, opciones);
      mensaje = 'Train: ' + resultado.trainSize + ' | Test: ' + resultado.testSize;
      break;
    case 'feature-selection':
      resultado = seleccionarVariables(data.rows, opciones);
      mensaje = 'Variables seleccionadas: ' + resultado.selected.length;
      break;
    case 'export-csv':
      var csv = exportarCSV(data, opciones);
      var filename = opciones && opciones.filename ? opciones.filename : 'export.csv';
      descargarCSV(csv, filename);
      resultado = { success: true, filename: filename };
      mensaje = 'Archivo descargado: ' + filename;
      break;
    default:
      alert('Acción no implementada: ' + action);
  }
  
  if (resultado && mensaje) {
    console.log('Resultado:', resultado);
    
    if (resultado.rows) {
      var sheet = getCurrentSheet();
      if (sheet) {
        sheet.rows = resultado.rows;
        loadPage('trabajo');
        console.log('Grid actualizado con', resultado.rows.length, 'filas');
      }
    }
    
    alert(mensaje);
  }
  
  return resultado;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTrabajoData: getTrabajoData,
    detectarOutliers: detectarOutliers,
    imputarValoresFaltantes: imputarValoresFaltantes,
    codificarCategoricas: codificarCategoricas,
    escalarNormalizar: escalarNormalizar,
    calcularMatrizCorrelacion: calcularMatrizCorrelacion,
    particionarTrainTest: particionarTrainTest,
    seleccionarVariables: seleccionarVariables,
    exportarCSV: exportarCSV,
    descargarCSV: descargarCSV,
    eliminarDuplicados: eliminarDuplicados,
    filtrarFilas: filtrarFilas,
    handleToolsAction: handleToolsAction
  };
}