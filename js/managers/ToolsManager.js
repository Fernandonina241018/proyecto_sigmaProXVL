/**
 * ToolsManager.js — SAP 2.0
 * Versión corregida y completa
 * ─────────────────────────────────────────────────────────────
 * CAMBIOS VS VERSIÓN ANTERIOR
 *  1. eliminarDuplicados   → eliminado el .shift() que ignoraba col 0
 *  2. escalarNormalizar    → robust ahora usa mediana (no Q1) como centro
 *  3. codificarCategoricas → onehot agrega columnas reales al sheet
 *  4. correlation-matrix   → tabla renderizada en panel derecho
 *  5. train-test-split     → crea hojas Hoja_Train / Hoja_Test
 *  6. outlier-detection    → opciones: marcar | eliminar | exportar
 *  7. Todas las acciones   → modal de parámetros antes de ejecutar
 *  8. imputarValoresFaltantes → sin side-effects en .map()
 * ─────────────────────────────────────────────────────────────
 */
// ════════════════════════════════════════════════════════════════
// UTILIDADES COMPARTIDAS
// ════════════════════════════════════════════════════════════════

/** Escapa HTML básico para mostrar texto en el DOM */
function tmEscape(text) {
  var d = document.createElement('div');
  d.textContent = String(text == null ? '' : text);
  return d.innerHTML;
}

/**
 * Muestra un modal genérico de parámetros.
 * @param {Object} cfg
 *   title       {string}
 *   description {string}
 *   fields      {Array<{id,label,type,options,default,placeholder}>}
 *   onApply     {function(values)} — valores como { [id]: value }
 */
function showToolModal(cfg) {
  var existing = document.getElementById('toolModalOverlay');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'toolModalOverlay';
  modal.style.cssText = [
    'position:fixed;top:0;left:0;right:0;bottom:0',
    'background:rgba(0,0,0,.72)',
    'display:flex;align-items:center;justify-content:center',
    'z-index:2000'
  ].join(';');

  var fieldsHTML = (cfg.fields || []).map(function(f) {
    var ctrl = '';
    if (f.type === 'select') {
      var opts = (f.options || []).map(function(o) {
        var sel = (o.value === f.default) ? ' selected' : '';
        return '<option value="' + tmEscape(o.value) + '"' + sel + '>' + tmEscape(o.label) + '</option>';
      }).join('');
      ctrl = '<select id="tmf_' + f.id + '" style="' + inputStyle + '">' + opts + '</select>';
    } else if (f.type === 'number') {
      ctrl = '<input type="number" id="tmf_' + f.id + '" value="' + (f.default || '') + '" placeholder="' + (f.placeholder || '') + '" style="' + inputStyle + '">';
    } else if (f.type === 'text') {
      ctrl = '<input type="text" id="tmf_' + f.id + '" value="' + (f.default || '') + '" placeholder="' + (f.placeholder || '') + '" style="' + inputStyle + '">';
    } else if (f.type === 'checkbox') {
      var chk = f.default ? ' checked' : '';
      ctrl = '<label style="display:flex;align-items:center;gap:8px;cursor:pointer">' +
        '<input type="checkbox" id="tmf_' + f.id + '"' + chk + ' style="accent-color:#7c6af7;width:14px;height:14px">' +
        '<span style="font-size:12px;color:#dcddde">' + tmEscape(f.checkLabel || '') + '</span></label>';
    }
    return '<div style="display:flex;flex-direction:column;gap:5px">' +
      (f.type !== 'checkbox' ? '<label style="font-size:11px;color:#888">' + tmEscape(f.label) + '</label>' : '') +
      ctrl + '</div>';
  }).join('');

  var inputStyle = 'background:#1e1e1e;border:1px solid #3a3a3a;border-radius:5px;color:#dcddde;font-size:12px;padding:6px 10px;width:100%;font-family:inherit';

  // Rebuild fields HTML now that inputStyle is defined
  fieldsHTML = (cfg.fields || []).map(function(f) {
    var ctrl = '';
    if (f.type === 'select') {
      var opts = (f.options || []).map(function(o) {
        var sel = (o.value === f.default) ? ' selected' : '';
        return '<option value="' + tmEscape(o.value) + '"' + sel + '>' + tmEscape(o.label) + '</option>';
      }).join('');
      ctrl = '<select id="tmf_' + f.id + '" style="' + inputStyle + '">' + opts + '</select>';
    } else if (f.type === 'number') {
      ctrl = '<input type="number" id="tmf_' + f.id + '" value="' + (f.default != null ? f.default : '') + '" placeholder="' + (f.placeholder || '') + '" step="any" style="' + inputStyle + '">';
    } else if (f.type === 'text') {
      ctrl = '<input type="text" id="tmf_' + f.id + '" value="' + (f.default || '') + '" placeholder="' + (f.placeholder || '') + '" style="' + inputStyle + '">';
    } else if (f.type === 'checkbox') {
      var chk = f.default ? ' checked' : '';
      ctrl = '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:4px 0">' +
        '<input type="checkbox" id="tmf_' + f.id + '"' + chk + ' style="accent-color:#7c6af7;width:14px;height:14px">' +
        '<span style="font-size:12px;color:#dcddde">' + tmEscape(f.checkLabel || f.label || '') + '</span></label>';
    }
    return '<div style="display:flex;flex-direction:column;gap:5px">' +
      (f.type !== 'checkbox' ? '<label style="font-size:11px;color:#888">' + tmEscape(f.label) + '</label>' : '') +
      ctrl + '</div>';
  }).join('');

  modal.innerHTML = '<div style="background:#2a2a2a;border:1px solid #3a3a3a;border-radius:12px;padding:22px;width:90%;max-width:440px;display:flex;flex-direction:column;gap:14px;box-shadow:0 16px 48px rgba(0,0,0,.7)">' +
    '<div style="font-size:15px;font-weight:600;color:#dcddde">' + tmEscape(cfg.title || '') + '</div>' +
    (cfg.description ? '<div style="font-size:11px;color:#555;line-height:1.5">' + tmEscape(cfg.description) + '</div>' : '') +
    (fieldsHTML ? '<div style="display:flex;flex-direction:column;gap:10px">' + fieldsHTML + '</div>' : '') +
    '<div style="display:flex;gap:8px;justify-content:flex-end;padding-top:4px">' +
      '<button id="tmCancel" style="padding:6px 16px;border-radius:6px;border:none;cursor:pointer;font-size:12px;font-family:inherit;background:#3a3a3a;color:#888">Cancelar</button>' +
      '<button id="tmApply" style="padding:6px 16px;border-radius:6px;border:none;cursor:pointer;font-size:12px;font-family:inherit;background:#7c6af7;color:#fff">Aplicar</button>' +
    '</div>' +
  '</div>';

  document.body.appendChild(modal);

  document.getElementById('tmCancel').addEventListener('click', function() { modal.remove(); });
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

  document.getElementById('tmApply').addEventListener('click', function() {
    var values = {};
    (cfg.fields || []).forEach(function(f) {
      var el = document.getElementById('tmf_' + f.id);
      if (!el) return;
      if (f.type === 'checkbox') values[f.id] = el.checked;
      else if (f.type === 'number') values[f.id] = parseFloat(el.value);
      else values[f.id] = el.value;
    });
    modal.remove();
    if (cfg.onApply) cfg.onApply(values);
  });
}

/** Muestra un toast de resultado en la barra inferior */
function showResultToast(msg, isError) {
  var t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);' +
    'background:' + (isError ? 'rgba(248,113,113,.15)' : 'rgba(74,222,128,.12)') + ';' +
    'border:1px solid ' + (isError ? '#f87171' : '#4ade80') + ';' +
    'border-radius:8px;padding:8px 18px;font-size:12px;' +
    'color:' + (isError ? '#f87171' : '#4ade80') + ';' +
    'z-index:3000;box-shadow:0 4px 16px rgba(0,0,0,.4);white-space:nowrap';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 3500);
}

// ════════════════════════════════════════════════════════════════
// ACCESO A DATOS DEL SHEET
// ════════════════════════════════════════════════════════════════

function getTrabajoData() {
  if (typeof getCurrentSheet !== 'function') {
    showResultToast('Error: getCurrentSheet no disponible', true);
    return null;
  }
  var sheet = getCurrentSheet();
  if (!sheet) { showResultToast('No hay hoja activa', true); return null; }
  if (!sheet.headers || !sheet.headers.length) { showResultToast('La hoja no tiene columnas', true); return null; }
  var dataRows = sheet.rows.filter(function(r) {
    return r.some(function(c) { return c !== null && c !== undefined && c !== ''; });
  });
  if (!dataRows.length) { showResultToast('La hoja no tiene datos. Importa desde Datos → Trabajo', true); return null; }
  return { headers: sheet.headers, rows: dataRows };
}

/** Devuelve opciones {value, label} para cada columna del sheet actual */
function getColOptions(includeAll) {
  var sheet = typeof getCurrentSheet === 'function' ? getCurrentSheet() : null;
  var opts = [];
  if (includeAll) opts.push({ value: '-1', label: '— Todas las columnas —' });
  if (sheet && sheet.headers) {
    sheet.headers.forEach(function(h, i) {
      opts.push({ value: String(i), label: h });
    });
  }
  return opts;
}

// ════════════════════════════════════════════════════════════════
// 1. ELIMINAR DUPLICADOS  (FIX: eliminado el .shift() incorrecto)
// ════════════════════════════════════════════════════════════════

function eliminarDuplicados(rows, colsToCompare) {
  var seen = new Set();
  var unique = [];
  var eliminadas = 0;

  rows.forEach(function(row) {
    // Si colsToCompare es null → comparamos TODAS las columnas
    var key;
    if (!colsToCompare || colsToCompare.length === 0) {
      key = row.map(function(v) {
        return String(v === null || v === undefined ? '' : v).trim();
      }).join('|||');
    } else {
      key = colsToCompare.map(function(ci) {
        return String(row[ci] === null || row[ci] === undefined ? '' : row[ci]).trim();
      }).join('|||');
    }

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(row);
    } else {
      eliminadas++;
    }
  });

  return { rows: unique, eliminadas: eliminadas };
}

// ════════════════════════════════════════════════════════════════
// 2. FILTRAR FILAS
// ════════════════════════════════════════════════════════════════

function filtrarFilas(rows, colIdx, operator, value) {
  var kept = [], removed = 0;
  rows.forEach(function(row) {
    var cell = String(row[colIdx] === null || row[colIdx] === undefined ? '' : row[colIdx]);
    var match = false;
    var numCell = parseFloat(cell), numVal = parseFloat(value);
    switch (operator) {
      case 'equals':   match = cell.toLowerCase() === String(value).toLowerCase(); break;
      case 'contains': match = cell.toLowerCase().indexOf(String(value).toLowerCase()) !== -1; break;
      case 'gt':       match = !isNaN(numCell) && !isNaN(numVal) && numCell > numVal; break;
      case 'lt':       match = !isNaN(numCell) && !isNaN(numVal) && numCell < numVal; break;
      case 'gte':      match = !isNaN(numCell) && !isNaN(numVal) && numCell >= numVal; break;
      case 'lte':      match = !isNaN(numCell) && !isNaN(numVal) && numCell <= numVal; break;
      case 'notempty': match = cell.trim() !== ''; break;
      case 'empty':    match = cell.trim() === ''; break;
    }
    if (match) kept.push(row); else removed++;
  });
  return { rows: kept, eliminadas: removed };
}

// ════════════════════════════════════════════════════════════════
// 3. IMPUTAR VALORES FALTANTES  (FIX: sin side-effects en .map())
// ════════════════════════════════════════════════════════════════

function imputarValoresFaltantes(colData, method) {
  var isNull = function(v) { return v === null || v === undefined || String(v).trim() === ''; };
  var validos = colData.filter(function(v) { return !isNull(v) && !isNaN(parseFloat(v)); });

  if (!validos.length) return { datos: colData.slice(), imputaciones: 0 };

  var fillValue;

  if (method === 'mean') {
    var sum = validos.reduce(function(a, b) { return a + parseFloat(b); }, 0);
    fillValue = (sum / validos.length).toFixed(4);

  } else if (method === 'median') {
    var sorted = validos.slice().sort(function(a, b) { return parseFloat(a) - parseFloat(b); });
    var mid = Math.floor(sorted.length / 2);
    fillValue = sorted.length % 2 === 0
      ? ((parseFloat(sorted[mid - 1]) + parseFloat(sorted[mid])) / 2).toFixed(4)
      : parseFloat(sorted[mid]).toFixed(4);

  } else if (method === 'mode') {
    var freq = {};
    validos.forEach(function(v) { freq[v] = (freq[v] || 0) + 1; });
    fillValue = Object.keys(freq).reduce(function(a, b) { return freq[a] >= freq[b] ? a : b; });

  } else if (method === 'zero') {
    fillValue = '0';

  } else if (method === 'forward') {
    var result = colData.slice();
    var count = 0;
    for (var i = 0; i < result.length; i++) {
      if (isNull(result[i]) && i > 0 && !isNull(result[i - 1])) {
        result[i] = result[i - 1];
        count++;
      }
    }
    return { datos: result, imputaciones: count };

  } else if (method === 'backward') {
    var result = colData.slice();
    var count = 0;
    for (var i = result.length - 2; i >= 0; i--) {
      if (isNull(result[i]) && !isNull(result[i + 1])) {
        result[i] = result[i + 1];
        count++;
      }
    }
    return { datos: result, imputaciones: count };
  }

  // For mean/median/mode/zero — no side-effects: build new array
  var imputaciones = 0;
  var datos = colData.map(function(v) {
    if (isNull(v)) { imputaciones++; return fillValue; }
    return v;
  });
  return { datos: datos, imputaciones: imputaciones };
}

// ════════════════════════════════════════════════════════════════
// 4. OUTLIER DETECTION  (FIX: acciones reales — marcar/eliminar)
// ════════════════════════════════════════════════════════════════

function detectarOutliers(colData, method, threshold) {
  var nums = colData.map(function(v) { return parseFloat(v); });
  var validNums = nums.filter(function(v) { return !isNaN(v); });
  if (validNums.length < 4) return { outlierIndices: [], q1: null, q3: null, iqr: null };

  var lo, hi, q1, q3, iqr, mean, std;

  if (method === 'iqr') {
    var sorted = validNums.slice().sort(function(a, b) { return a - b; });
    q1 = sorted[Math.floor(sorted.length * 0.25)];
    q3 = sorted[Math.floor(sorted.length * 0.75)];
    iqr = q3 - q1;
    lo = q1 - threshold * iqr;
    hi = q3 + threshold * iqr;
  } else {
    // z-score
    mean = validNums.reduce(function(a, b) { return a + b; }, 0) / validNums.length;
    std = Math.sqrt(validNums.reduce(function(a, b) { return a + Math.pow(b - mean, 2); }, 0) / validNums.length);
  }

  var outlierIndices = [];
  nums.forEach(function(v, i) {
    if (isNaN(v)) return;
    var isOut = method === 'iqr' ? (v < lo || v > hi) : (Math.abs((v - mean) / (std || 1)) > threshold);
    if (isOut) outlierIndices.push(i);
  });

  return { outlierIndices: outlierIndices, q1: q1, q3: q3, iqr: iqr, lo: lo, hi: hi, mean: mean, std: std };
}

// ════════════════════════════════════════════════════════════════
// 5. CODIFICAR CATEGÓRICAS  (FIX: onehot agrega columnas reales)
// ════════════════════════════════════════════════════════════════

function codificarCategoricas(sheet, colIdx, method) {
  var colData = sheet.rows.map(function(r) { return String(r[colIdx] === null || r[colIdx] === undefined ? '' : r[colIdx]); });
  var unique = [];
  colData.forEach(function(v) { if (v !== '' && unique.indexOf(v) === -1) unique.push(v); });
  unique.sort();

  if (method === 'label') {
    var map = {};
    unique.forEach(function(v, i) { map[v] = i; });
    sheet.rows.forEach(function(row) {
      row[colIdx] = map[row[colIdx]] !== undefined ? String(map[row[colIdx]]) : '';
    });
    return { categories: unique, newCols: 0, type: 'label', map: map };

  } else if (method === 'onehot') {
    // Add one new column per category, insert after colIdx
    var insertAt = colIdx + 1;
    unique.forEach(function(cat, catI) {
      var newColName = sheet.headers[colIdx] + '_is_' + cat;
      sheet.headers.splice(insertAt + catI, 0, newColName);
      sheet.rows.forEach(function(row) {
        var val = String(row[colIdx] === null || row[colIdx] === undefined ? '' : row[colIdx]);
        row.splice(insertAt + catI, 0, val === cat ? '1' : '0');
      });
    });
    // Remove original column (now shifted)
    var originalCol = colIdx;
    sheet.headers.splice(originalCol, 1);
    sheet.rows.forEach(function(row) { row.splice(originalCol, 1); });
    return { categories: unique, newCols: unique.length, type: 'onehot' };

  } else if (method === 'ordinal') {
    var orderedMap = {};
    unique.forEach(function(v, i) { orderedMap[v] = i; });
    sheet.rows.forEach(function(row) {
      row[colIdx] = orderedMap[row[colIdx]] !== undefined ? String(orderedMap[row[colIdx]]) : '';
    });
    return { categories: unique, newCols: 0, type: 'ordinal', map: orderedMap };
  }

  return { categories: [], newCols: 0 };
}

// ════════════════════════════════════════════════════════════════
// 6. ESCALAR / NORMALIZAR  (FIX: robust usa mediana, no Q1)
// ════════════════════════════════════════════════════════════════

function escalarNormalizar(colData, method) {
  var nums = colData.map(function(v) { return parseFloat(v); });
  var valid = nums.filter(function(v) { return !isNaN(v); });
  if (!valid.length) return { datos: colData.slice(), params: {} };

  var params = {}, result;

  if (method === 'minmax') {
    var min = Math.min.apply(null, valid);
    var max = Math.max.apply(null, valid);
    var range = max - min;
    params = { min: min, max: max };
    result = nums.map(function(v) {
      return isNaN(v) ? '' : (range === 0 ? '0.5' : ((v - min) / range).toFixed(6));
    });

  } else if (method === 'zscore') {
    var mean = valid.reduce(function(a, b) { return a + b; }, 0) / valid.length;
    var std = Math.sqrt(valid.reduce(function(a, b) { return a + Math.pow(b - mean, 2); }, 0) / valid.length);
    params = { mean: mean.toFixed(4), std: std.toFixed(4) };
    result = nums.map(function(v) {
      return isNaN(v) ? '' : (std === 0 ? '0' : ((v - mean) / std).toFixed(6));
    });

  } else if (method === 'robust') {
    // FIX: centro = mediana, escala = IQR
    var sorted = valid.slice().sort(function(a, b) { return a - b; });
    var mid = Math.floor(sorted.length / 2);
    var median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    var q1 = sorted[Math.floor(sorted.length * 0.25)];
    var q3 = sorted[Math.floor(sorted.length * 0.75)];
    var iqr = q3 - q1;
    params = { median: median.toFixed(4), q1: q1.toFixed(4), q3: q3.toFixed(4), iqr: iqr.toFixed(4) };
    result = nums.map(function(v) {
      return isNaN(v) ? '' : (iqr === 0 ? '0' : ((v - median) / iqr).toFixed(6));
    });
  }

  return { datos: result, params: params };
}

// ════════════════════════════════════════════════════════════════
// 7. MATRIZ DE CORRELACIÓN  (FIX: nombres reales + renderizado)
// ════════════════════════════════════════════════════════════════

function pearsonCorr(a, b) {
  var n = Math.min(a.length, b.length);
  var ma = a.reduce(function(s, v) { return s + v; }, 0) / n;
  var mb = b.reduce(function(s, v) { return s + v; }, 0) / n;
  var num = 0, da = 0, db = 0;
  for (var i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) * (a[i] - ma);
    db += (b[i] - mb) * (b[i] - mb);
  }
  var den = Math.sqrt(da * db);
  return den === 0 ? 0 : num / den;
}

function spearmanCorr(a, b) {
  function rank(arr) {
    var sorted = arr.map(function(v, i) { return { v: v, i: i }; }).sort(function(x, y) { return x.v - y.v; });
    var ranks = new Array(arr.length);
    sorted.forEach(function(item, pos) { ranks[item.i] = pos + 1; });
    return ranks;
  }
  return pearsonCorr(rank(a), rank(b));
}

function calcularMatrizCorrelacion(data, method) {
  // Collect numeric columns only
  var numCols = [];
  data.headers.forEach(function(h, ci) {
    var vals = data.rows.map(function(r) { return parseFloat(r[ci]); }).filter(function(v) { return !isNaN(v); });
    if (vals.length >= 3) numCols.push({ name: h, idx: ci, vals: vals });
  });

  if (numCols.length < 2) return null;

  var corrFn = method === 'spearman' ? spearmanCorr : pearsonCorr;
  var n = numCols.length;
  var matrix = [];
  for (var i = 0; i < n; i++) {
    var row = [];
    for (var j = 0; j < n; j++) {
      if (i === j) { row.push(1); }
      else if (j < i) { row.push(matrix[j][i]); }
      else { row.push(corrFn(numCols[i].vals, numCols[j].vals)); }
    }
    matrix.push(row);
  }
  return { matrix: matrix, cols: numCols.map(function(c) { return c.name; }), method: method };
}

function renderCorrelationMatrix(result) {
  if (!result) { showResultToast('No hay suficientes columnas numéricas (mínimo 2)', true); return; }

  var n = result.cols.length;
  // Color cell: strong negative = red, zero = neutral, strong positive = green
  function cellColor(v) {
    if (v >= 0.7)  return 'rgba(74,222,128,.25)';
    if (v >= 0.4)  return 'rgba(74,222,128,.12)';
    if (v <= -0.7) return 'rgba(248,113,113,.25)';
    if (v <= -0.4) return 'rgba(248,113,113,.12)';
    return 'transparent';
  }
  function cellTextColor(v) {
    if (Math.abs(v) >= 0.7) return v > 0 ? '#4ade80' : '#f87171';
    if (Math.abs(v) >= 0.4) return v > 0 ? '#86efac' : '#fca5a5';
    return '#888';
  }

  var headerCells = '<th style="background:#1e1e1e;padding:8px 6px;font-size:10px;color:#555;border:1px solid #3a3a3a;position:sticky;top:0;left:0;z-index:3"></th>' +
    result.cols.map(function(c) {
      return '<th style="background:#1e1e1e;padding:8px 10px;font-size:10px;color:#888;font-weight:500;border:1px solid #3a3a3a;white-space:nowrap;position:sticky;top:0;z-index:2;max-width:100px;overflow:hidden;text-overflow:ellipsis" title="' + tmEscape(c) + '">' + tmEscape(c) + '</th>';
    }).join('');

  var bodyRows = result.matrix.map(function(row, i) {
    var cells = '<td style="background:#1e1e1e;padding:6px 10px;font-size:10px;color:#888;font-weight:500;border:1px solid #3a3a3a;white-space:nowrap;position:sticky;left:0;z-index:1;max-width:100px;overflow:hidden;text-overflow:ellipsis" title="' + tmEscape(result.cols[i]) + '">' + tmEscape(result.cols[i]) + '</td>';
    cells += row.map(function(v, j) {
      var display = i === j ? '1.000' : v.toFixed(3);
      var bg = i === j ? 'rgba(124,106,247,.15)' : cellColor(v);
      var tc = i === j ? '#7c6af7' : cellTextColor(v);
      return '<td style="padding:6px 8px;text-align:center;font-size:11px;font-family:monospace;border:1px solid #3a3a3a;background:' + bg + ';color:' + tc + ';font-weight:' + (i === j ? '700' : '400') + '" title="' + result.cols[i] + ' × ' + result.cols[j] + '">' + display + '</td>';
    }).join('');
    return '<tr>' + cells + '</tr>';
  }).join('');

  var legend = '<div style="display:flex;gap:12px;align-items:center;padding:8px 12px;font-size:10px;color:#555">' +
    '<span>Correlación:</span>' +
    '<span style="color:#4ade80">■ fuerte positiva ≥0.7</span>' +
    '<span style="color:#86efac">■ moderada ≥0.4</span>' +
    '<span style="color:#888">■ débil</span>' +
    '<span style="color:#fca5a5">■ moderada negativa</span>' +
    '<span style="color:#f87171">■ fuerte negativa ≤−0.7</span>' +
    '<span style="margin-left:auto">Método: ' + result.method + '</span>' +
  '</div>';

  var html = '<div style="display:flex;flex-direction:column;height:100%;background:#1e1e1e">' +
    '<div style="padding:10px 14px;border-bottom:1px solid #3a3a3a;flex-shrink:0;display:flex;align-items:center;gap:10px;background:#2d2d2d">' +
      '<span style="font-size:14px;font-weight:600;color:#dcddde;flex:1">🔗 Matriz de Correlación</span>' +
      '<span style="font-size:10px;background:#7c6af7;color:#fff;padding:2px 8px;border-radius:10px">' + n + 'x' + n + '</span>' +
      '<button onclick="loadPage(\'trabajo\')" style="padding:4px 10px;border-radius:5px;border:none;cursor:pointer;font-size:11px;font-family:inherit;background:#3a3a3a;color:#888">← Volver</button>' +
    '</div>' +
    legend +
    '<div style="flex:1;overflow:auto;padding:12px">' +
      '<table style="border-collapse:collapse;font-family:monospace"><thead><tr>' + headerCells + '</tr></thead><tbody>' + bodyRows + '</tbody></table>' +
    '</div>' +
  '</div>';

  var rightPaneBody = document.getElementById('rightPaneBody');
  if (rightPaneBody) {
    rightPaneBody.classList.add('flush');
    rightPaneBody.innerHTML = html;
  }
}

// ════════════════════════════════════════════════════════════════
// 8. TRAIN / TEST SPLIT  (FIX: crea hojas reales en el sheet)
// ════════════════════════════════════════════════════════════════

function particionarTrainTest(data, testRatio, shuffle, stratifyCol) {
  var rows = data.rows.slice();
  if (shuffle) rows.sort(function() { return Math.random() - 0.5; });

  var testCount = Math.max(1, Math.round(rows.length * testRatio));
  testCount = Math.min(testCount, rows.length - 1);

  return {
    train: rows.slice(0, rows.length - testCount),
    test:  rows.slice(rows.length - testCount)
  };
}

// ════════════════════════════════════════════════════════════════
// 9. FEATURE SELECTION
// ════════════════════════════════════════════════════════════════

function seleccionarVariables(data, targetColIdx, threshold) {
  var target = data.rows.map(function(r) { return parseFloat(r[targetColIdx]); }).filter(function(v) { return !isNaN(v); });
  if (target.length < 3) return { selected: [], correlations: {} };

  var correlations = {};
  data.headers.forEach(function(h, ci) {
    if (ci === targetColIdx) return;
    var col = data.rows.map(function(r) { return parseFloat(r[ci]); }).filter(function(v) { return !isNaN(v); });
    if (col.length < 3) return;
    correlations[h] = Math.abs(pearsonCorr(target, col));
  });

  var selected = Object.keys(correlations).filter(function(h) { return correlations[h] >= threshold; });
  selected.sort(function(a, b) { return correlations[b] - correlations[a]; });

  return { selected: selected, correlations: correlations };
}

// ════════════════════════════════════════════════════════════════
// HANDLER CENTRAL — con modales para cada acción
// ════════════════════════════════════════════════════════════════

function handleToolsAction(action) {
  if (typeof getCurrentSheet === 'undefined') {
    showResultToast('Error: recarga la página', true); return;
  }

  var data = getTrabajoData();
  if (!data) return;
  var colOpts = getColOptions(false);
  var colOptsAll = getColOptions(true);

  // ── Remove duplicates ──
  if (action === 'remove-duplicates') {
    showToolModal({
      title: '⊟ Eliminar duplicados',
      description: 'Elimina filas idénticas. Puedes comparar todas las columnas o solo una específica.',
      fields: [
        { id: 'col', label: 'Comparar por columna', type: 'select', options: colOptsAll, default: '-1' }
      ],
      onApply: function(v) {
        if (typeof pushUndo === 'function') pushUndo();
        var sheet = getCurrentSheet();
        var colsToCompare = (v.col === '-1' || v.col == null || isNaN(parseInt(v.col))) ? null : [parseInt(v.col)];
        var result = eliminarDuplicados(sheet.rows, colsToCompare);
        sheet.rows = result.rows;
        loadPage('trabajo');
        showResultToast('✓ ' + result.eliminadas + ' filas duplicadas eliminadas · ' + result.rows.length + ' filas restantes');
      }
    });
    return;
  }

  // ── Filter rows ──
  if (action === 'filter-rows') {
    showToolModal({
      title: '🔍 Filtrar filas',
      description: 'Mantiene solo las filas que cumplan la condición. Las demás se eliminan del sheet.',
      fields: [
        { id: 'col', label: 'Columna', type: 'select', options: colOpts, default: colOpts[0] && colOpts[0].value },
        { id: 'op', label: 'Operador', type: 'select', options: [
          { value: 'contains', label: 'Contiene' },
          { value: 'equals',   label: 'Igual a' },
          { value: 'gt',       label: 'Mayor que (>)' },
          { value: 'lt',       label: 'Menor que (<)' },
          { value: 'gte',      label: 'Mayor o igual (≥)' },
          { value: 'lte',      label: 'Menor o igual (≤)' },
          { value: 'notempty', label: 'No vacío' },
          { value: 'empty',    label: 'Vacío' }
        ], default: 'contains' },
        { id: 'val', label: 'Valor', type: 'text', placeholder: 'ej. 50' }
      ],
      onApply: function(v) {
        if (typeof pushUndo === 'function') pushUndo();
        var sheet = getCurrentSheet();
        var result = filtrarFilas(sheet.rows, parseInt(v.col), v.op, v.val);
        sheet.rows = result.rows;
        loadPage('trabajo');
        showResultToast('✓ ' + result.eliminadas + ' filas eliminadas · ' + result.rows.length + ' filas restantes');
      }
    });
    return;
  }

  // ── Handle missing ──
  if (action === 'handle-missing') {
    showToolModal({
      title: '↩ Imputar valores faltantes',
      description: 'Rellena celdas vacías de la columna seleccionada con el método elegido.',
      fields: [
        { id: 'col', label: 'Columna', type: 'select', options: colOpts, default: colOpts[0] && colOpts[0].value },
        { id: 'method', label: 'Método de imputación', type: 'select', options: [
          { value: 'mean',     label: 'Media aritmética' },
          { value: 'median',   label: 'Mediana' },
          { value: 'mode',     label: 'Moda (valor más frecuente)' },
          { value: 'zero',     label: 'Cero (0)' },
          { value: 'forward',  label: 'Forward fill (valor anterior)' },
          { value: 'backward', label: 'Backward fill (valor siguiente)' }
        ], default: 'mean' }
      ],
      onApply: function(v) {
        if (typeof pushUndo === 'function') pushUndo();
        var sheet = getCurrentSheet();
        var ci = parseInt(v.col);
        var colData = sheet.rows.map(function(r) { return r[ci]; });
        var result = imputarValoresFaltantes(colData, v.method);
        sheet.rows.forEach(function(row, i) { row[ci] = result.datos[i]; });
        loadPage('trabajo');
        showResultToast('✓ ' + result.imputaciones + ' valores imputados en "' + sheet.headers[ci] + '" con método ' + v.method);
      }
    });
    return;
  }

  // ── Outlier detection ──
  if (action === 'outlier-detection') {
    showToolModal({
      title: '⚡ Detectar / Tratar outliers',
      description: 'Detecta valores atípicos y permite eliminarlos o marcararlos.',
      fields: [
        { id: 'col', label: 'Columna numérica', type: 'select', options: colOpts, default: colOpts[0] && colOpts[0].value },
        { id: 'method', label: 'Método de detección', type: 'select', options: [
          { value: 'iqr',    label: 'IQR (Rango intercuartílico)' },
          { value: 'zscore', label: 'Z-Score' }
        ], default: 'iqr' },
        { id: 'threshold', label: 'Umbral (IQR: 1.5 | Z: 3.0)', type: 'number', default: 1.5, placeholder: '1.5' },
        { id: 'action', label: 'Acción', type: 'select', options: [
          { value: 'mark',   label: 'Marcar en nueva columna (OUTLIER)' },
          { value: 'remove', label: 'Eliminar filas con outliers' },
          { value: 'cap',    label: 'Winsorize: reemplazar con límite' }
        ], default: 'mark' }
      ],
      onApply: function(v) {
        if (typeof pushUndo === 'function') pushUndo();
        var sheet = getCurrentSheet();
        var ci = parseInt(v.col);
        var thr = isNaN(v.threshold) ? 1.5 : v.threshold;
        var colData = sheet.rows.map(function(r) { return r[ci]; });
        var result = detectarOutliers(colData, v.method, thr);
        var idx = new Set(result.outlierIndices);

        if (!idx.size) {
          showResultToast('✓ No se detectaron outliers con estos parámetros');
          return;
        }

        if (v.action === 'remove') {
          sheet.rows = sheet.rows.filter(function(_, i) { return !idx.has(i); });
          showResultToast('✓ ' + idx.size + ' filas con outliers eliminadas en "' + sheet.headers[ci] + '"');

        } else if (v.action === 'mark') {
          var markCol = sheet.headers[ci] + '_outlier';
          sheet.headers.push(markCol);
          sheet.rows.forEach(function(row, i) { row.push(idx.has(i) ? 'OUTLIER' : ''); });
          showResultToast('✓ ' + idx.size + ' outliers marcados en columna "' + markCol + '"');

        } else if (v.action === 'cap') {
          // Winsorize: replace with Q1 - k*IQR or Q3 + k*IQR
          sheet.rows.forEach(function(row, i) {
            if (idx.has(i)) {
              var n = parseFloat(row[ci]);
              if (result.lo !== null && n < result.lo) row[ci] = result.lo.toFixed(4);
              else if (result.hi !== null && n > result.hi) row[ci] = result.hi.toFixed(4);
            }
          });
          showResultToast('✓ ' + idx.size + ' outliers reemplazados por límites en "' + sheet.headers[ci] + '"');
        }

        loadPage('trabajo');
      }
    });
    return;
  }

  // ── Encode categorical ──
  if (action === 'encode-categorical') {
    showToolModal({
      title: '🏷 Codificar variable categórica',
      description: 'Label: 0,1,2…  |  One-Hot: crea columnas binarias  |  Ordinal: igual a label pero ordenado alfabético',
      fields: [
        { id: 'col', label: 'Columna categórica', type: 'select', options: colOpts, default: colOpts[0] && colOpts[0].value },
        { id: 'method', label: 'Método', type: 'select', options: [
          { value: 'label',   label: 'Label encoding (0, 1, 2…)' },
          { value: 'onehot',  label: 'One-Hot (crea columnas binarias)' },
          { value: 'ordinal', label: 'Ordinal (orden alfabético)' }
        ], default: 'label' }
      ],
      onApply: function(v) {
        if (typeof pushUndo === 'function') pushUndo();
        var sheet = getCurrentSheet();
        var ci = parseInt(v.col);
        var result = codificarCategoricas(sheet, ci, v.method);
        loadPage('trabajo');
        if (v.method === 'onehot') {
          showResultToast('✓ One-Hot: ' + result.categories.length + ' columnas nuevas creadas para "' + data.headers[ci] + '"');
        } else {
          showResultToast('✓ ' + result.categories.length + ' categorías codificadas (' + v.method + ') en "' + sheet.headers[ci] + '"');
        }
      }
    });
    return;
  }

  // ── Scale / Normalize ──
  if (action === 'scale-normalize') {
    showToolModal({
      title: '⇥ Escalar / Normalizar',
      description: 'Min-Max → [0,1]  |  Z-Score → μ=0 σ=1  |  Robust → mediana/IQR (resistente a outliers)',
      fields: [
        { id: 'col', label: 'Columna numérica', type: 'select', options: colOpts, default: colOpts[0] && colOpts[0].value },
        { id: 'method', label: 'Método', type: 'select', options: [
          { value: 'minmax',  label: 'Min-Max [0, 1]' },
          { value: 'zscore',  label: 'Z-Score (μ=0, σ=1)' },
          { value: 'robust',  label: 'Robust Scaling (mediana / IQR)' }
        ], default: 'minmax' }
      ],
      onApply: function(v) {
        if (typeof pushUndo === 'function') pushUndo();
        var sheet = getCurrentSheet();
        var ci = parseInt(v.col);
        var colData = sheet.rows.map(function(r) { return r[ci]; });
        var result = escalarNormalizar(colData, v.method);
        sheet.rows.forEach(function(row, i) { row[ci] = result.datos[i]; });
        var paramsStr = Object.entries ? Object.entries(result.params).map(function(e) { return e[0] + '=' + e[1]; }).join(', ') : '';
        loadPage('trabajo');
        showResultToast('✓ Columna "' + sheet.headers[ci] + '" normalizada (' + v.method + ')' + (paramsStr ? ' · ' + paramsStr : ''));
      }
    });
    return;
  }

  // ── Correlation matrix ──
  if (action === 'correlation-matrix') {
    showToolModal({
      title: '🔗 Matriz de correlación',
      description: 'Calcula la correlación entre todas las columnas numéricas y la renderiza como tabla interactiva.',
      fields: [
        { id: 'method', label: 'Método', type: 'select', options: [
          { value: 'pearson',  label: 'Pearson (lineal)' },
          { value: 'spearman', label: 'Spearman (rangos, no lineal)' }
        ], default: 'pearson' }
      ],
      onApply: function(v) {
        var result = calcularMatrizCorrelacion(data, v.method);
        renderCorrelationMatrix(result);
      }
    });
    return;
  }

  // ── Train / Test split ──
  if (action === 'train-test-split') {
    showToolModal({
      title: '✂ Particionar Train / Test',
      description: 'Divide el dataset en dos hojas nuevas: una para entrenamiento y otra para prueba.',
      fields: [
        { id: 'testSize', label: 'Proporción de prueba (0.1 – 0.5)', type: 'number', default: 0.2, placeholder: '0.2' },
        { id: 'shuffle',  type: 'checkbox', label: 'Aleatorizar orden antes de dividir', checkLabel: 'Mezclar filas (shuffle)', default: true }
      ],
      onApply: function(v) {
        var ratio = Math.max(0.1, Math.min(0.5, isNaN(v.testSize) ? 0.2 : v.testSize));
        var result = particionarTrainTest(data, ratio, v.shuffle, -1);

        // Create two new sheets
        var baseName = (typeof datosCurrentFileName !== 'undefined' ? datosCurrentFileName : 'datos').replace(/\.[^.]+$/, '');
        var trainName = baseName + '_train';
        var testName  = baseName + '_test';

        // Remove old versions if exist
        if (typeof trabajoSheets !== 'undefined') {
          trabajoSheets = trabajoSheets.filter(function(s) { return s.name !== trainName && s.name !== testName; });
          trabajoSheets.push({ name: trainName, headers: data.headers.slice(), rows: result.train.map(function(r) { return r.slice(); }) });
          trabajoSheets.push({ name: testName,  headers: data.headers.slice(), rows: result.test.map(function(r) { return r.slice(); }) });
          trabajoActiveSheetIndex = trabajoSheets.length - 2; // go to train sheet
        }
        loadPage('trabajo');
        showResultToast('✓ Train: ' + result.train.length + ' filas · Test: ' + result.test.length + ' filas · Hojas creadas: "' + trainName + '", "' + testName + '"');
      }
    });
    return;
  }

  // ── Feature selection ──
  if (action === 'feature-selection') {
    showToolModal({
      title: '📌 Selección de variables',
      description: 'Calcula la correlación de cada columna contra la variable objetivo. Las columnas por debajo del umbral se eliminan.',
      fields: [
        { id: 'target', label: 'Variable objetivo (Y)', type: 'select', options: colOpts, default: colOpts[colOpts.length - 1] && colOpts[colOpts.length - 1].value },
        { id: 'threshold', label: 'Umbral mínimo de correlación |r|', type: 'number', default: 0.3, placeholder: '0.3' },
        { id: 'drop', type: 'checkbox', label: 'Eliminar columnas por debajo del umbral', checkLabel: 'Sí, eliminar las no seleccionadas', default: false }
      ],
      onApply: function(v) {
        var targetIdx = parseInt(v.target);
        var thr = Math.max(0, Math.min(1, isNaN(v.threshold) ? 0.3 : v.threshold));
        var result = seleccionarVariables(data, targetIdx, thr);

        // Build report string
        var lines = ['Correlaciones con "' + data.headers[targetIdx] + '":'];
        var allCols = Object.keys(result.correlations).sort(function(a, b) { return result.correlations[b] - result.correlations[a]; });
        allCols.forEach(function(h) {
          var r = result.correlations[h];
          var mark = r >= thr ? '✓' : '✗';
          lines.push(mark + ' ' + h + ': |r| = ' + r.toFixed(4));
        });

        if (v.drop && result.selected !== undefined) {
          if (typeof pushUndo === 'function') pushUndo();
          var sheet = getCurrentSheet();
          var keepIndices = [targetIdx];
          data.headers.forEach(function(_, ci) {
            if (ci === targetIdx) return;
            if (result.selected.indexOf(data.headers[ci]) !== -1) keepIndices.push(ci);
          });
          keepIndices.sort(function(a, b) { return a - b; });
          sheet.headers = keepIndices.map(function(ci) { return sheet.headers[ci]; });
          sheet.rows = sheet.rows.map(function(row) { return keepIndices.map(function(ci) { return row[ci]; }); });
          loadPage('trabajo');
          showResultToast('✓ Seleccionadas ' + keepIndices.length + ' / ' + data.headers.length + ' columnas (umbral |r| ≥ ' + thr + ')');
        } else {
          showResultToast('Seleccionadas: ' + result.selected.length + ' / ' + allCols.length + ' cols · Activa "Eliminar" para aplicar');
        }

      }
    });
    return;
  }

  // ── Export CSV ──
  if (action === 'export-csv') {
    showToolModal({
      title: '💾 Exportar CSV',
      description: 'Exporta la hoja activa como archivo CSV.',
      fields: [
        { id: 'delimiter', label: 'Delimitador', type: 'select', options: [
          { value: ',',  label: 'Coma (,) — estándar' },
          { value: ';',  label: 'Punto y coma (;) — europeo' },
          { value: '\t', label: 'Tabulación (TSV)' }
        ], default: ',' },
        { id: 'filename', label: 'Nombre del archivo', type: 'text', default: 'export', placeholder: 'nombre_archivo' }
      ],
      onApply: function(v) {
        var sheet = getCurrentSheet();
        if (!sheet) { showResultToast('No hay datos', true); return; }
        var sep = v.delimiter === '\\t' ? '\t' : v.delimiter;
        var csv = sheet.headers.join(sep) + '\n';
        sheet.rows.forEach(function(row) {
          csv += row.map(function(c) {
            var s = String(c == null ? '' : c);
            return (s.indexOf(sep) !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) ? '"' + s.replace(/"/g, '""') + '"' : s;
          }).join(sep) + '\n';
        });
        var fname = (v.filename || 'export').replace(/\.[^.]*$/, '') + (sep === '\t' ? '.tsv' : '.csv');
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fname;
        link.click();
        URL.revokeObjectURL(link.href);
        showResultToast('✓ Descargado: ' + fname);
      }
    });
    return;
  }

  showResultToast('Acción no implementada: ' + action, true);
}

// ── Node.js export (opcional) ──
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    eliminarDuplicados: eliminarDuplicados,
    filtrarFilas: filtrarFilas,
    imputarValoresFaltantes: imputarValoresFaltantes,
    detectarOutliers: detectarOutliers,
    codificarCategoricas: codificarCategoricas,
    escalarNormalizar: escalarNormalizar,
    calcularMatrizCorrelacion: calcularMatrizCorrelacion,
    particionarTrainTest: particionarTrainTest,
    seleccionarVariables: seleccionarVariables,
    handleToolsAction: handleToolsAction
  };
}