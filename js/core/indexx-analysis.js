// ════════════════════════════════════════════════════════════════
// indexx-analysis.js — Analysis page: test selection, card system,
//                      stat execution, _initIndexxApp, escapeHtml
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// ANALYSIS PAGE - DYNAMIC TESTS
// ════════════════════════════════════════════════════════════════

function getAnalisisTestsHTML() {
  var testCategories = {
    descriptiva: [
      {id: 'media', name: '📐 Media Aritmética'},
      {id: 'mediana', name: '📊 Mediana'},
      {id: 'moda', name: '🎯 Moda'},
      {id: 'varianza', name: '📈 Varianza'},
      {id: 'desv', name: '📉 Desv. Estándar'},
      {id: 'cv', name: '📊 Coef. Variación'},
      {id: 'asimetria', name: '📐 Asimetría'},
      {id: 'kurtosis', name: '🔔 Curtosis'}
    ],
    hipotesis: [
      {id: 'ttest', name: '⚖️ t-Test'},
      {id: 'ztest', name: '📐 z-Test'},
      {id: 'ftest', name: '📊 F-Test'},
      {id: 'chisquare', name: '📐 Chi-cuadrado'},
      {id: 'shapiro', name: '🔔 Shapiro-Wilk'}
    ],
    correlacion: [
      {id: 'pearson', name: '🔗 Pearson'},
      {id: 'spearman', name: '📈 Spearman'},
      {id: 'kendall', name: '📊 Kendall'}
    ],
    regresion: [
      {id: 'lineal', name: '📈 Lineal Simple'},
      {id: 'multiple', name: '📊 Regresión Múltiple'},
      {id: 'logistica', name: '📦 Regresión Logística'}
    ],
    noParametricos: [
      {id: 'mann', name: '📉 Mann-Whitney'},
      {id: 'wilcoxon', name: '📊 Wilcoxon'},
      {id: 'kruskal', name: '📦 Kruskal-Wallis'}
    ],
    multivariado: [
      {id: 'pca', name: '📊 PCA'},
      {id: 'cluster', name: '📈 Cluster K-Means'},
      {id: 'lda', name: '📐 LDA'}
    ]
  };
  
  var tests = testCategories[analisisSelectedCategory] || testCategories.descriptiva;
  var html = '';
  tests.forEach(function(t) {
    var isActive = analisisSelectedTest === t.id ? ' active' : '';
    // SIN onclick — solo refleja la selección del menú superior
    html += '<div class="info-item' + isActive + '" style="cursor:default;opacity:' + (isActive ? '1' : '0.7') + '">' + t.name + '</div>';
  });
  return html;
}

function selectAnalisisTest(testId) {
  analisisSelectedTest = testId;
  analisisResultContent = null;
  loadPage('analisis');
  runSingleStat(testId);
}

function updateAnalisisLastResult(result) {
  analisisLastResult = result;
  var testEl = document.getElementById('analisisLastTest');
  var pValEl = document.getElementById('analisisLastPVal');
  var decEl = document.getElementById('analisisLastDecision');
  if (testEl) testEl.textContent = result.testName || '—';
  if (pValEl) pValEl.textContent = result.pValue != null ? result.pValue.toFixed(4) : '—';
  if (decEl) {
    var decision = result.significativo ? 'Rechazar H₀' : 'No rechazar H₀';
    decEl.textContent = decision;
    decEl.style.color = result.significativo ? 'var(--accent)' : 'var(--text-faint)';
  }
}

// ── Helpers para cards de estadísticos ──
function getSidebarSelectedTests() {
  var tests = [];
  document.querySelectorAll('.child-check:checked').forEach(function(chk) {
    if (chk.dataset.nombre) tests.push(chk.dataset.nombre);
  });
  return tests;
}

function getSectionDisplayName(key) {
  var names = {
    descriptiva: '📊 Descriptiva', hipotesis: '⚖️ Hipótesis',
    correlacion: '🔗 Correlación', regresion: '📈 Regresión',
    noParametricos: '📉 No Paramétricos', multivariado: '📦 Multivariado',
    extras: '✨ Extras', especificacion: '📐 Especificación', calidad: '⚙️ Calidad'
  };
  return names[key] || key;
}

function buildStatCardsHTML(testNames) {
  var cardsHtml = testNames.map(function(nombre) {
    var cfg = getEstadisticoConfig(nombre);
    if (!cfg) return '';
    var icono = cfg.icono || '📊';
    var meta = typeof getStatMetaConfig === 'function' ? (getStatMetaConfig()[nombre] || {}) : {};
    var formula = meta.formula || cfg.formula || '—';
    var desc = cfg.desc || '—';
    var sectionName = getSectionDisplayName(cfg.seccion || '');
    var inputs = cfg.inputs || {};
    var supuestos = meta.supuestos || cfg.supuestos || [];
    var ref = meta.referencia || cfg.referencia || null;

    var refStr = '—';
    if (ref) {
      var r = Array.isArray(ref) ? ref[0] : ref;
      var autor = r.autores || '';
      if (autor.length > 40) autor = autor.split(',')[0] + ' et al.';
      refStr = autor + (r.anio ? ' (' + r.anio + ')' : '');
    }

    var supHtml = supuestos.length > 0
      ? '<div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border)"><div class="sc-label">Supuestos</div>' +
        supuestos.map(function(s) { return '<div class="sc-item">· ' + escapeHtml(s) + '</div>'; }).join('') + '</div>'
      : '';

    var configBtnHtml = '';
    if (HYPOTHESIS_SET.has(nombre) || PARAM_CONFIG_SET.has(nombre)) {
      var _hasCfg = (HYPOTHESIS_SET.has(nombre) && StateManager.getHypothesisConfig(nombre)) ||
                    (PARAM_CONFIG_SET.has(nombre) && StateManager.getParamConfig(nombre));
      var _cfgCls = _hasCfg ? 'sc-config-saved' : 'sc-config-pending';
      configBtnHtml = '<span class="sc-config ' + _cfgCls + '" onclick="reopenStatConfig(\'' + nombre.replace(/'/g, "\\'") + '\')" title="Configurar ' + escapeHtml(nombre) + '">⚙</span>';
    }

    return '<div class="stat-card">' +
      '<div class="sc-header">' +
        '<span class="sc-icon">' + icono + '</span>' +
        '<div class="sc-title-group">' +
          '<div class="sc-title">' + escapeHtml(nombre) + '</div>' +
          '<div class="sc-section">' + escapeHtml(sectionName) + '</div>' +
        '</div>' +
        '<span class="sc-run" onclick="runSingleStat(\'' + nombre.replace(/'/g, "\\'") + '\')" title="Ejecutar ' + escapeHtml(nombre) + '">▶</span>' +
        configBtnHtml +
        '<span class="sc-close" onclick="deselectStatCard(\'' + nombre.replace(/'/g, "\\'") + '\')" title="Deseleccionar ' + escapeHtml(nombre) + '">✕</span>' +
      '</div>' +
      '<div class="sc-formula">' + escapeHtml(formula) + '</div>' +
      '<div class="sc-desc">' + escapeHtml(desc) + '</div>' +
      '<div class="sc-meta">' +
        '<span>🎯 <strong>Inputs:</strong> ' + escapeHtml(inputs.tipo || '—') + '</span>' +
        '<span>👥 <strong>Grupos:</strong> ' + (inputs.grupos || '—') + '</span>' +
        '<span>📏 <strong>Mín:</strong> ' + cfg.minMuestra + '</span>' +
      '</div>' +
      supHtml +
      '<div class="sc-ref">📖 ' + escapeHtml(refStr) + '</div>' +
    '</div>';
  }).join('');

  return '<div class="page-body">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
      '<span style="font-size:14px;font-weight:600;color:var(--text-primary)">📋 Tests seleccionados</span>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        '<span style="font-size:11px;color:var(--text-faint)">' + testNames.length + ' tests</span>' +
        '<button class="sc-run-all" onclick="runBatchAnalysis()">▶ Ejecutar seleccionados</button>' +
      '</div>' +
    '</div>' +
    '<div class="stat-cards-grid">' + cardsHtml + '</div>' +
  '</div>';
}

function toggleAcordeon(btn) {
  var item = btn.closest('.acordeon-item');
  if (item) item.classList.toggle('abierto');
}

function deselectStatCard(nombre) {
  var chk = document.querySelector('.child-check[data-nombre="' + nombre.replace(/"/g, '&quot;') + '"]');
  if (!chk) return;
  var seccionKey = chk.dataset.seccion;
  chk.checked = false;
  updateParentCheck(seccionKey);
  updateBadge(seccionKey);
  if (analisisSelectedTest === nombre) analisisSelectedTest = null;
  if (currentPage === 'analisis') {
    leftPaneBody.innerHTML = leftPanels.analisis();
    rightPaneBody.innerHTML = rightPanels.analisis();
    updateColumnAnalysisSummary();
  }
}

function getDataForEjecutarAnalisis() {
  var sheet = getCurrentSheet();
  if (!sheet || !sheet.rows || sheet.rows.length === 0) return null;
  var mapped = sheet.rows.map(function(row) {
    var obj = {};
    sheet.headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });
  return { headers: sheet.headers, data: mapped, rowCount: mapped.length };
}

function _detectColTypes(headers, data) {
  var catCols = [], numCols = [];
  headers.forEach(function(h) {
    var n = 0, t = 0;
    for (var i = 0; i < Math.min(data.length, 50); i++) {
      var v = data[i][h];
      if (v !== '' && v != null) { t++; if (!isNaN(parseFloat(v))) n++; }
    }
    if (t > 0 && n / t >= 0.8) numCols.push(h);
    else catCols.push(h);
  });
  return { catCols: catCols, numCols: numCols };
}

function _mostrarModalConfigTest(nombre, callback) {
  var cfg = getEstadisticoConfig(nombre);
  if (!cfg || !HYPOTHESIS_SET.has(nombre)) { callback(); return; }
  var data = getDataForEjecutarAnalisis();
  if (!data) { callback(); return; }
  var tipos = _detectColTypes(data.headers, data.data);
  if (tipos.numCols.length === 0) { showToast('⚠️ No hay columnas numéricas disponibles'); callback(); return; }
  var t = cfg.inputs && cfg.inputs.tipo;
  var necesitaCat = t === 'tabla-contingencia' || t === 'dos-columnas' || t === 'dos-grupos' || t === 'una-columna-grupo' || t === 'bloques-k-condiciones' || t === 'una-columna-dos-factores';
  var necesitaDosNumericas = false;
  var necesitaDosCat = t === 'tabla-contingencia' || t === 'una-columna-dos-factores';
  var modalTipo = 'single-num';
  if (t === 'dos-columnas' && cfg.seccion === 'correlacion') {
    necesitaCat = false;
    necesitaDosNumericas = true;
    modalTipo = 'xy';
  } else if (t === 'dos-columnas' && cfg.seccion === 'regresion') {
    necesitaCat = false;
    necesitaDosNumericas = true;
    if (nombre === 'RMSE' || nombre === 'MAE' || nombre === 'R\u00B2 (Coef. Determinaci\u00F3n)') {
      modalTipo = 'obspred';
    } else {
      modalTipo = 'xy';
    }
  } else if (t === 'dos-columnas' && cfg.seccion === 'especificacion') {
    necesitaCat = false;
    necesitaDosNumericas = true;
    modalTipo = 'xy';
  } else if (t === 'dos-columnas-mas-grado') {
    necesitaCat = false;
    necesitaDosNumericas = true;
    modalTipo = 'xy-grado';
  } else if (t === 'multiples-columnas') {
    necesitaCat = false;
    necesitaDosNumericas = false;
    modalTipo = 'y-multi-x';
  } else if (t === 'dos-columnas-pareadas') {
    necesitaCat = false;
    necesitaDosNumericas = true;
    modalTipo = 'dos-cols-pareadas';
  } else if (t === 'dos-columnas-mas-umbral') {
    necesitaCat = false;
    necesitaDosNumericas = true;
    modalTipo = 'xy-umbral';
  } else if (t === 'multiples-columnas-mas-grupo') {
    necesitaCat = true;
    necesitaDosNumericas = false;
    modalTipo = 'y-multi-x-grupo';
  } else if (t === 'una-columna-temporal') {
    necesitaCat = false;
    necesitaDosNumericas = false;
    modalTipo = 'single-num-periodo';
  } else if (t === 'tiempo-evento-grupo') {
    necesitaCat = false;
    necesitaDosNumericas = false;
    modalTipo = 'supervivencia';
  } else if (t === 'multiples-columnas-mas-grupo-anidado') {
    necesitaCat = true;
    necesitaDosNumericas = false;
    modalTipo = 'y-grupo';
  } else if (t === 'una-o-multiples-columnas-mas-prior') {
    necesitaCat = false;
    necesitaDosNumericas = false;
    modalTipo = 'bayesiano';
  }
  if (necesitaCat && tipos.catCols.length === 0) { showToast('⚠️ No hay columnas categóricas disponibles'); callback(); return; }
  if (necesitaDosCat && tipos.catCols.length < 2) { showToast('⚠️ Se necesitan al menos 2 columnas categóricas'); callback(); return; }
  if (necesitaDosNumericas && tipos.numCols.length < 2) { showToast('⚠️ Se necesitan al menos 2 columnas numéricas'); callback(); return; }
  if ((modalTipo === 'y-multi-x' || modalTipo === 'y-multi-x-grupo') && tipos.numCols.length < 2) { showToast('⚠️ Se necesitan al menos 2 columnas numéricas'); callback(); return; }
  var optsN = tipos.numCols.map(function(c) { return '<option value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</option>'; }).join('');
  var optsC = tipos.catCols.length ? tipos.catCols.map(function(c) { return '<option value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</option>'; }).join('') : '';
  // FEAT: modal-informativo — helper texts for each field type
  var hlp = {
    colObs: 'Valores reales observados en tus datos',
    colPred: 'Valores estimados o predichos por el modelo',
    colX: 'Variable independiente o predictora',
    colY: 'Variable dependiente o de respuesta',
    grado: 'Grado del polinomio (2=cuadrático, 3=cúbico, etc.)',
    col1: 'Primera columna del par (ej: pre-tratamiento)',
    col2: 'Segunda columna del par (ej: post-tratamiento)',
    delta: 'Diferencia máxima considerada irrelevante (límite de equivalencia)',
    colCat: 'Columna que define los grupos a comparar',
    defCat: 'Columna categórica de agrupación',
    colNum: 'Variable numérica a analizar',
    multiNum: 'Selecciona una o más variables numéricas predictoras',
    periodo: 'Longitud del ciclo estacional (4=trimestral, 12=mensual)',
    colTiempo: 'Tiempo hasta la ocurrencia del evento',
    colEvento: 'Indicador booleano: 1/0, Sí/No, True/False',
    colGrupoOp: 'Factor de agrupación opcional (comparar curvas de supervivencia)',
    colCat1: 'Primera variable categórica (filas de la tabla de contingencia)',
    colCat2: 'Segunda variable categórica (columnas de la tabla de contingencia)',
    factor1: 'Primer factor categórico del modelo',
    factor2: 'Segundo factor categórico del modelo',
    priorMedia: 'Media de la distribución a priori (conocimiento previo)',
    priorVar: 'Varianza a priori (dejar vacío = usar varianza muestral)',
    xyGrupo: 'Columna que define los grupos (e.g., tratamiento vs control)'
  };
  var headerInfo = '';
  if (cfg.desc) headerInfo += '<div style="font-size:12px;color:var(--text-primary);margin-bottom:6px;line-height:1.4">' + escapeHtml(cfg.desc) + '</div>';
  var reqParts = [];
  if (cfg.minMuestra) reqParts.push('mín. ' + cfg.minMuestra + ' obs.');
  if (cfg.maxMuestra) reqParts.push('máx. ' + cfg.maxMuestra + ' obs.');
  if (cfg.inputs && cfg.inputs.descripcion) reqParts.push(cfg.inputs.descripcion);
  if (reqParts.length) headerInfo += '<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;padding:6px 8px;background:var(--bg-card);border-radius:6px">📋 Requisitos: ' + reqParts.join(' | ') + '</div>';
  var accordionContent = '';
  if (cfg.hipotesis || (cfg.supuestos && cfg.supuestos.length) || cfg.formula) {
    accordionContent += '<details style="margin-top:8px;font-size:11px"><summary style="cursor:pointer;color:var(--accent);font-weight:500">📖 Ver más — detalles del test</summary><div style="margin-top:6px;padding:8px;background:var(--bg-card);border-radius:6px;line-height:1.5">';
    if (cfg.formula) accordionContent += '<div style="margin-bottom:4px"><strong>Fórmula:</strong> ' + escapeHtml(cfg.formula) + '</div>';
    if (cfg.hipotesis && cfg.hipotesis.h0) accordionContent += '<div><strong>H₀:</strong> ' + escapeHtml(cfg.hipotesis.h0) + '</div>';
    if (cfg.hipotesis && cfg.hipotesis.h1) accordionContent += '<div><strong>H₁:</strong> ' + escapeHtml(cfg.hipotesis.h1) + '</div>';
    if (cfg.supuestos && cfg.supuestos.length) accordionContent += '<div style="margin-top:4px"><strong>Supuestos:</strong><ul style="margin:2px 0 0 16px;padding:0">' + cfg.supuestos.map(function(s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ul></div>';
    accordionContent += '</div></details>';
  }
  var modalContent = '';
  if (modalTipo === 'obspred') {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna observada</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colObs + '</p><select id="cfgColObs" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna predicha</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colPred + '</p><select id="cfgColPred" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
      '</div>';
  } else if (modalTipo === 'xy') {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna X (predictor/variable 1)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colX + '</p><select id="cfgColX" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna Y (respuesta/variable 2)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colY + '</p><select id="cfgColY" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
      '</div>';
  } else if (modalTipo === 'xy-grado') {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna X (predictor)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colX + '</p><select id="cfgColX" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna Y (respuesta)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colY + '</p><select id="cfgColY" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Grado del polinomio</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.grado + '</p><input id="cfgGrado" type="number" value="2" min="2" max="10" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem"></div>' +
      '</div>';
  } else if (modalTipo === 'y-multi-x') {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Variable Y (respuesta)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colY + '</p><select id="cfgColY" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Variables X (predictoras)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.multiNum + '</p><div style="max-height:160px;overflow-y:auto;border:1px solid var(--border);border-radius:6px;padding:6px;background:var(--bg-primary)">' +
          tipos.numCols.map(function(c) { return '<label style="display:flex;align-items:center;gap:6px;padding:3px 4px;font-size:11px;color:var(--text-muted);cursor:pointer"><input type="checkbox" class="cfgColXChk" value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</label>'; }).join('') +
        '</div></div>' +
      '</div>';
  } else if (modalTipo === 'dos-cols-pareadas') {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna 1</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.col1 + '</p><select id="cfgCol1" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna 2</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.col2 + '</p><select id="cfgCol2" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
      '</div>';
  } else if (modalTipo === 'xy-umbral') {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna 1</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.col1 + '</p><select id="cfgCol1" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna 2</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.col2 + '</p><select id="cfgCol2" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Delta (límite de equivalencia)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.delta + '</p><input id="cfgDelta" type="number" value="0.5" min="0.01" step="0.1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem"></div>' +
      '</div>';
  } else if (modalTipo === 'y-multi-x-grupo') {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna de grupo (categórica)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.xyGrupo + '</p><select id="cfgColCat" class="btn" style="width:100%;text-align:left">' + optsC + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Variables numéricas</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.multiNum + '</p><div style="max-height:160px;overflow-y:auto;border:1px solid var(--border);border-radius:6px;padding:6px;background:var(--bg-primary)">' +
          tipos.numCols.map(function(c) { return '<label style="display:flex;align-items:center;gap:6px;padding:3px 4px;font-size:11px;color:var(--text-muted);cursor:pointer"><input type="checkbox" class="cfgColXChk" value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</label>'; }).join('') +
        '</div></div>' +
      '</div>';
  } else if (modalTipo === 'single-num-periodo') {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna de valores</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">Serie temporal a analizar (debe tener orden cronológico)</p><select id="cfgColNum" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Periodo (estacionalidad)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.periodo + '</p><input id="cfgPeriodo" type="number" value="4" min="2" max="52" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem"></div>' +
      '</div>';
  } else if (modalTipo === 'supervivencia') {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna de tiempo (numérica)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colTiempo + '</p><select id="cfgColTiempo" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        (tipos.catCols.length ? '<div><label style="font-size:11px;color:var(--text-primary)">Columna de evento (0/1 o Sí/No)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colEvento + '</p><select id="cfgColEvento" class="btn" style="width:100%;text-align:left">' + [...tipos.numCols, ...tipos.catCols].map(function(c) { return '<option value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</option>'; }).join('') + '</select></div>' : '<div><label style="font-size:11px;color:var(--text-primary)">Columna de evento</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colEvento + '</p><select id="cfgColEvento" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>') +
        (tipos.catCols.length ? '<div><label style="font-size:11px;color:var(--text-primary)">Columna de grupo (opcional)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colGrupoOp + '</p><select id="cfgColGrupo" class="btn" style="width:100%;text-align:left"><option value="">— Sin grupo —</option>' + optsC + '</select></div>' : '') +
      '</div>';
  } else if (modalTipo === 'y-grupo') {
    if (tipos.catCols.length === 0) { showToast('⚠️ No hay columnas categóricas disponibles'); callback(); return; }
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Variable Y (numérica)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colY + '</p><select id="cfgColNum" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna de grupo (categórica)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colCat + '</p><select id="cfgColCat" class="btn" style="width:100%;text-align:left">' + optsC + '</select></div>' +
      '</div>';
  } else if (modalTipo === 'bayesiano') {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Columna de valores (datos observados)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colNum + '</p><select id="cfgColNum" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Prior: media</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.priorMedia + '</p><input id="cfgPriorMedia" type="number" value="0" step="0.1" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem"></div>' +
        '<div><label style="font-size:11px;color:var(--text-primary)">Prior: varianza (opcional)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.priorVar + '</p><input id="cfgPriorVar" type="number" value="" step="0.1" placeholder="Usar varianza muestral" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem"></div>' +
      '</div>';
  } else if (necesitaCat) {
    if (t === 'tabla-contingencia') {
      modalContent =
        '<div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;color:var(--text-primary)">Columna categórica 1</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colCat1 + '</p><select id="cfgColCat1" class="btn" style="width:100%;text-align:left">' + optsC + '</select></div>' +
        '<div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;color:var(--text-primary)">Columna categórica 2</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colCat2 + '</p><select id="cfgColCat2" class="btn" style="width:100%;text-align:left">' + optsC + '</select></div>';
    } else if (t === 'una-columna-dos-factores') {
      modalContent =
        '<div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;color:var(--text-primary)">Factor 1 (categórica)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.factor1 + '</p><select id="cfgColCat1" class="btn" style="width:100%;text-align:left">' + optsC + '</select></div>' +
        '<div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;color:var(--text-primary)">Factor 2 (categórica)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.factor2 + '</p><select id="cfgColCat2" class="btn" style="width:100%;text-align:left">' + optsC + '</select></div>' +
        '<div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;color:var(--text-primary)">Columna de valores (numérica)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colNum + '</p><select id="cfgColNum" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>';
    } else {
      modalContent =
        '<div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;color:var(--text-primary)">Columna de agrupación (categórica)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.defCat + '</p><select id="cfgColCat" class="btn" style="width:100%;text-align:left">' + optsC + '</select></div>' +
        '<div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;color:var(--text-primary)">Columna de valores (numérica)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colNum + '</p><select id="cfgColNum" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>';
    }
  } else {
    modalContent =
      '<div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:11px;color:var(--text-primary)">Columna de valores (numérica)</label><p style="font-size:0.75rem;color:#666;margin:0 0 4px;line-height:1.3">' + hlp.colNum + '</p><select id="cfgColNum" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>';
  }
  var modal = document.createElement('div'); modal.className = 'modal-overlay';
  modal.innerHTML =
    '<div class="modal-box" style="max-width:480px">' +
      '<div class="modal-title">\u2699\uFE0F Configurar: ' + escapeHtml(nombre) + '</div>' +
      headerInfo +
      modalContent +
      accordionContent +
      '<div class="modal-actions">' +
        '<button class="btn btn-secondary" id="cfgCancel">Cancelar</button>' +
        '<button class="btn btn-primary" id="cfgConfirm">Confirmar</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);
  document.getElementById('cfgCancel').addEventListener('click', function() { modal.remove(); });
  document.getElementById('cfgConfirm').addEventListener('click', function() {
    var config = {};
    if (modalTipo === 'obspred') {
      config.columnaObservada = document.getElementById('cfgColObs').value;
      config.columnaPredicha = document.getElementById('cfgColPred').value;
    } else if (modalTipo === 'xy' || modalTipo === 'xy-grado') {
      config.columnaX = document.getElementById('cfgColX').value;
      config.columnaY = document.getElementById('cfgColY').value;
      if (modalTipo === 'xy-grado') {
        config.grado = parseInt(document.getElementById('cfgGrado').value) || 2;
      }
    } else if (modalTipo === 'y-multi-x') {
      config.columnaY = document.getElementById('cfgColY').value;
      var chkX = document.querySelectorAll('.cfgColXChk:checked');
      config.columnasX = Array.from(chkX).map(function(c) { return c.value; });
      if (config.columnasX.length === 0) { showToast('⚠️ Selecciona al menos una variable X'); return; }
      config.columnas = config.columnasX;
    } else if (modalTipo === 'dos-cols-pareadas') {
      config.numericCols = [document.getElementById('cfgCol1').value, document.getElementById('cfgCol2').value];
    } else if (modalTipo === 'xy-umbral') {
      config.columnaX = document.getElementById('cfgCol1').value;
      config.columnaY = document.getElementById('cfgCol2').value;
      config.delta = parseFloat(document.getElementById('cfgDelta').value) || 0.5;
    } else if (modalTipo === 'y-multi-x-grupo') {
      config.categoricalCols = [document.getElementById('cfgColCat').value];
      var chkX = document.querySelectorAll('.cfgColXChk:checked');
      config.columnas = Array.from(chkX).map(function(c) { return c.value; });
      if (config.columnas.length === 0) { showToast('⚠️ Selecciona al menos una variable numérica'); return; }
    } else if (modalTipo === 'single-num-periodo') {
      config.numericCol = document.getElementById('cfgColNum').value;
      config.periodo = parseInt(document.getElementById('cfgPeriodo').value) || 4;
    } else if (modalTipo === 'supervivencia') {
      config.columnaTiempo = document.getElementById('cfgColTiempo').value;
      config.columnaEvento = document.getElementById('cfgColEvento').value;
      var grupoEl = document.getElementById('cfgColGrupo');
      if (grupoEl && grupoEl.value) config.columnaGrupo = grupoEl.value;
    } else if (modalTipo === 'y-grupo') {
      config.numericCol = document.getElementById('cfgColNum').value;
      config.categoricalCols = [document.getElementById('cfgColCat').value];
    } else if (modalTipo === 'bayesiano') {
      config.numericCol = document.getElementById('cfgColNum').value;
      config.priorMedia = parseFloat(document.getElementById('cfgPriorMedia').value) || 0;
      var priorVar = document.getElementById('cfgPriorVar').value;
      if (priorVar) config.priorVarianza = parseFloat(priorVar);
    } else if (necesitaCat) {
      if (t === 'tabla-contingencia') {
        config.categoricalCols = [document.getElementById('cfgColCat1').value, document.getElementById('cfgColCat2').value];
      } else if (t === 'una-columna-dos-factores') {
        config.categoricalCols = [document.getElementById('cfgColCat1').value, document.getElementById('cfgColCat2').value];
        config.numericCol = document.getElementById('cfgColNum').value;
      } else {
        config.categoricalCols = [document.getElementById('cfgColCat').value];
        config.numericCol = document.getElementById('cfgColNum').value;
      }
    } else {
      config.numericCol = document.getElementById('cfgColNum').value;
    }
    StateManager.setHypothesisConfig(nombre, config);
    modal.remove();
    callback();
  });
}

function _configColumnsExist(saved, headers) {
  if (!saved) return false;
  var cols = [
    saved.columnaX, saved.columnaY,
    saved.columnaObservada, saved.columnaPredicha,
    saved.numericCol, saved.columnaTiempo,
    saved.columnaEvento, saved.columnaGrupo
  ].filter(Boolean);
  if (Array.isArray(saved.numericCols)) cols = cols.concat(saved.numericCols);
  if (Array.isArray(saved.columnasX)) cols = cols.concat(saved.columnasX);
  if (Array.isArray(saved.columnas)) cols = cols.concat(saved.columnas);
  if (Array.isArray(saved.categoricalCols)) cols = cols.concat(saved.categoricalCols);
  return cols.every(function(col) { return headers.indexOf(col) !== -1; });
}

// ── Modal de configuración paramétrica (F0, etc.) ──
function _mostrarModalParamConfig(nombre, callback) {
  var cfg = getEstadisticoConfig(nombre);
  if (!cfg || !cfg.paramConfig || !cfg.paramConfig.length) { callback(); return; }
  var data = getDataForEjecutarAnalisis();
  if (!data) { callback(); return; }
  var tipos = _detectColTypes(data.headers, data.data);
  if (tipos.numCols.length === 0) { showToast('\u26A0\uFE0F No hay columnas num\u00E9ricas disponibles'); callback(); return; }
  var optsN = tipos.numCols.map(function(c) { return '<option value="' + c.replace(/"/g,'&quot;') + '">' + escapeHtml(c) + '</option>'; }).join('');
  var descHTML = cfg.desc ? '<div style="font-size:12px;color:var(--text-primary);margin-bottom:10px;line-height:1.4">' + escapeHtml(cfg.desc) + '</div>' : '';
  var paramsHTML = cfg.paramConfig.map(function(p) {
    return '<div style="margin-bottom:8px">' +
      '<label style="display:block;font-size:11px;color:var(--text-primary);margin-bottom:2px">' + escapeHtml(p.label) + '</label>' +
      '<input type="' + p.type + '" id="cfg-' + p.key + '" value="' + (p.default || '') + '" ' +
        'min="' + (p.min || '') + '" step="' + (p.step || '') + '" ' +
        'style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:0.85rem">' +
      '</div>';
  }).join('');

  var multi = cfg.multiCol;
  var colHTML;
  if (multi) {
    colHTML = '<label style="display:block;font-size:11px;color:var(--text-primary);margin-bottom:4px">Columnas de temperatura (\u00B0C)</label>' +
      '<div style="max-height:180px;overflow-y:auto;border:1.5px solid var(--border);border-radius:6px;padding:6px 8px;background:var(--bg-primary)">' +
      tipos.numCols.map(function(c) {
        return '<label style="display:flex;align-items:center;gap:6px;padding:3px 0;font-size:0.82rem;cursor:pointer">' +
          '<input type="checkbox" class="cfg-col-chk" value="' + c.replace(/"/g,'&quot;') + '" checked>' +
          escapeHtml(c) + '</label>';
      }).join('') + '</div>';
  } else {
    colHTML = '<div style="margin-bottom:10px">' +
      '<label style="display:block;font-size:11px;color:var(--text-primary);margin-bottom:2px">Columna de temperatura (\u00B0C)</label>' +
      '<select id="cfg-columna" class="btn" style="width:100%;text-align:left">' + optsN + '</select></div>';
  }

  var modal = document.createElement('div'); modal.className = 'modal-overlay';
  modal.innerHTML =
    '<div class="modal-box" style="max-width:480px">' +
      '<div class="modal-title">\u2699\uFE0F Configurar par\u00E1metros: ' + escapeHtml(nombre) + '</div>' +
      descHTML +
      colHTML +
      paramsHTML +
      '<div class="modal-actions">' +
        '<button class="btn btn-secondary" id="pcgCancel">Cancelar</button>' +
        '<button class="btn btn-primary" id="pcgConfirm">Guardar y ejecutar</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);
  document.getElementById('pcgCancel').addEventListener('click', function() { modal.remove(); });
  document.getElementById('pcgConfirm').addEventListener('click', function() {
    var config = {};
    if (multi) {
      var chk = document.querySelectorAll('.cfg-col-chk:checked');
      config.columnas = Array.from(chk).map(function(c) { return c.value; });
    } else {
      config.columna = document.getElementById('cfg-columna').value;
    }
    cfg.paramConfig.forEach(function(p) {
      var el = document.getElementById('cfg-' + p.key);
      var val = p.type === 'number' ? parseFloat(el.value) : el.value;
      if (val !== undefined && val !== null && !isNaN(val)) config[p.key] = val;
    });
    StateManager.setParamConfig(nombre, config);
    modal.remove();
    callback();
  });
}

// ── Reabrir modal de configuración (botón ⚙) ──
function reopenStatConfig(nombre) {
  if (HYPOTHESIS_SET.has(nombre)) {
    _mostrarModalConfigTest(nombre, function() {
      showToast('✅ Configuración actualizada para ' + nombre);
    });
  } else if (PARAM_CONFIG_SET.has(nombre)) {
    _mostrarModalParamConfig(nombre, function() {
      showToast('✅ Parámetros actualizados para ' + nombre);
    });
  }
}

// ── Ejecutar un único estadístico ──
function runSingleStat(nombre) {
  var data = getDataForEjecutarAnalisis();
  if (!data) { showToast('⚠️ No hay datos en la hoja de trabajo'); return; }

  var cfg = getEstadisticoConfig(nombre);
  if (!cfg) { showToast('⚠️ Estadístico no encontrado: ' + nombre); return; }

  var numericCols = [];
  for (var j = 0; j < data.headers.length; j++) {
    var numCount = 0, total = 0;
    for (var i = 0; i < Math.min(data.data.length, 20); i++) {
      var val = data.data[i][data.headers[j]];
      if (val !== '' && val != null) {
        total++;
        if (!isNaN(parseFloat(val))) numCount++;
      }
    }
    if (total > 0 && numCount / total >= 0.8) {
      numericCols.push(data.headers[j]);
    }
  }

  var values = [];
  if (numericCols.length > 0) {
    data.data.forEach(function(row) {
      var v = parseFloat(row[numericCols[0]]);
      if (!isNaN(v) && isFinite(v)) values.push(v);
    });
  }
  if (values.length < cfg.minMuestra) {
    showToast('⚠️ ' + nombre + ' requiere al menos ' + cfg.minMuestra + ' observaciones');
    return;
  }
  if (cfg.requiereDosColumnas && numericCols.length < 2) {
    showToast('⚠️ ' + nombre + ' requiere al menos 2 columnas numéricas');
    return;
  }

  if (HYPOTHESIS_SET.has(nombre)) {
    var saved = StateManager.getHypothesisConfig(nombre);
    if (!saved || !_configColumnsExist(saved, data.headers)) {
      _mostrarModalConfigTest(nombre, function() {
        if (!StateManager.getHypothesisConfig(nombre)) {
          showToast('⚠️ Error al guardar configuración para ' + nombre);
          return;
        }
        runSingleStat(nombre);
      });
      return;
    }
  }

  // Estadísticos con parámetros configurables (F0, etc.)
  if (PARAM_CONFIG_SET.has(nombre)) {
    var paramSaved = StateManager.getParamConfig(nombre);
    if (!paramSaved) {
      _mostrarModalParamConfig(nombre, function() {
        if (!StateManager.getParamConfig(nombre)) {
          showToast('⚠️ Error al guardar configuración para ' + nombre);
          return;
        }
        runSingleStat(nombre);
      });
      return;
    }
  }

  analisisSelectedTest = nombre;
  analisisResultContent = null;
  rightPaneBody.innerHTML = rightPanels.analisis();

  try {
    var hc = {};
    var saved = StateManager.getHypothesisConfig(nombre);
    if (saved) hc[nombre] = saved;
    var paramSaved = StateManager.getParamConfig(nombre);
    if (paramSaved) hc[nombre] = paramSaved;
    var resultados = EstadisticaDescriptiva.ejecutarAnalisis(data, [nombre], hc);
    var html = EstadisticaDescriptiva.generarHTML(resultados);
    analisisResultContent = html;
    StateManager.setUltimosResultados(resultados);

    var resultInfo = { testName: nombre, pValue: null, significativo: false };
    var resObj = resultados.resultados[nombre];
    if (resObj && typeof resObj === 'object') {
      var firstKey = Object.keys(resObj)[0];
      if (resObj[firstKey] && typeof resObj[firstKey] === 'object') {
        var r = resObj[firstKey];
        if (r.valorP !== undefined) resultInfo.pValue = r.valorP;
        else if (r.p !== undefined) resultInfo.pValue = r.p;
        resultInfo.significativo = r.significativo || (resultInfo.pValue !== null && resultInfo.pValue < 0.05);
      }
    }
    updateAnalisisLastResult(resultInfo);
  } catch(e) {
    console.error('Error executing ' + nombre + ':', e);
    analisisResultContent = '<div class="page-card"><div class="page-card-body" style="padding:20px;color:#f87171"><strong>Error:</strong> ' + escapeHtml(e.message) + '</div></div>';
  }

  rightPaneBody.innerHTML = rightPanels.analisis();
}

function runEDA() {
  if (currentPage !== 'analisis') { loadPage('analisis'); }

  var data = getDataForEjecutarAnalisis();
  if (!data) { showToast('\u26A0\uFE0F No hay datos en la hoja de trabajo'); return; }

  analisisSelectedTest = 'An\u00E1lisis Exploratorio (EDA)';
  analisisResultContent = null;
  rightPaneBody.innerHTML = rightPanels.analisis();

  try {
    var html = EDAManager.renderDashboard(data);
    analisisResultContent = html;
    StateManager.setUltimosResultados(EDAManager.ejecutarEDA(data));
  } catch(e) {
    console.error('EDA Error:', e);
    analisisResultContent = '<div class="page-card"><div class="page-card-body" style="padding:20px;color:#f87171"><strong>Error en EDA:</strong> ' + escapeHtml(e.message) + '</div></div>';
  }

  rightPaneBody.innerHTML = rightPanels.analisis();
}

function runBatchAnalysis() {
  var data = getDataForEjecutarAnalisis();
  if (!data) { showToast('⚠️ No hay datos en la hoja de trabajo'); return; }

  var selected = getSidebarSelectedTests();
  if (selected.length === 0) { showToast('⚠️ Selecciona al menos un test'); return; }

  var numericCols = [];
  for (var j = 0; j < data.headers.length; j++) {
    var numCount = 0, total = 0;
    for (var i = 0; i < Math.min(data.data.length, 20); i++) {
      var val = data.data[i][data.headers[j]];
      if (val !== '' && val != null) {
        total++;
        if (!isNaN(parseFloat(val))) numCount++;
      }
    }
    if (total > 0 && numCount / total >= 0.8) {
      numericCols.push(data.headers[j]);
    }
  }
  if (numericCols.length === 0) {
    showToast('⚠️ No se encontraron columnas numéricas en la hoja de trabajo');
    return;
  }

  analisisResultContent = null;
  rightPaneBody.innerHTML = rightPanels.analisis();

  try {
    var hc = StateManager.getAllHypothesisConfig();
    selected.forEach(function(n) {
      if (PARAM_CONFIG_SET.has(n)) {
        var pc = StateManager.getParamConfig(n);
        if (pc) hc[n] = pc;
      }
    });
    var resultados = EstadisticaDescriptiva.ejecutarAnalisis(data, selected, hc);
    var html = EstadisticaDescriptiva.generarHTML(resultados);
    analisisResultContent = html;
    analisisSelectedTest = selected.join(', ');
    StateManager.setUltimosResultados(resultados);
    updateAnalisisLastResult({ testName: selected.length + ' tests', pValue: null, significativo: false });
  } catch(e) {
    console.error('Error in batch analysis:', e);
    analisisResultContent = '<div class="page-card"><div class="page-card-body" style="padding:20px;color:#f87171"><strong>Error:</strong> ' + escapeHtml(e.message) + '</div></div>';
  }

  rightPaneBody.innerHTML = rightPanels.analisis();
}

// ── Utility ──
function escapeHtml(text) {
  var d = document.createElement('div'); d.textContent = String(text == null ? '' : text); return d.innerHTML;
}

function buildStatAnalysisMenu() {
  if (typeof getSeccionesSidebar === 'undefined') return;
  var dropdown = document.getElementById('statAnalysisDropdown');
  if (!dropdown) return;

  var secciones = getSeccionesSidebar();
  var html = '<div class="dd-item" role="menuitem" onclick="runEDA()" style="font-weight:600">🔍 Análisis Exploratorio (EDA)</div><div class="dd-separator"></div>';
  var isFirst = true;

  Object.entries(secciones).forEach(function([seccionKey, seccion]) {
    if (!isFirst) html += '<div class="dd-separator"></div>';
    isFirst = false;

    html += '<div class="submenu-wrapper" data-seccion="' + seccionKey + '">';

    // ── Item padre con checkbox ──
    html += '<div class="dd-item has-submenu" '
          + 'style="display:flex;align-items:center;gap:6px">'
          + '<span style="flex:1;display:flex;align-items:center;gap:6px">'
          + seccion.icon + ' ' + seccion.label
          + '<span class="stat-selected-badge" id="badge-' + seccionKey + '">0</span>'
          + '</span>'
          + '<input type="checkbox" class="stat-check parent-check" '
          + 'id="chk-parent-' + seccionKey + '" '
          + 'data-seccion="' + seccionKey + '" '
          + 'onclick="onParentCheck(event,\'' + seccionKey + '\')">'
          + '<span class="dd-arrow">▶</span>'
          + '</div>';

    // ── Subitems con checkbox ──
    html += '<div class="submenu">';
    seccion.options.forEach(function(nombre) {
      var cfg = getEstadisticoConfig(nombre);
      var icono = cfg && cfg.icono ? cfg.icono : '📊';
      var id = 'chk-' + seccionKey + '-' + nombre.replace(/[^a-zA-Z0-9]/g, '_');
      var nombreEsc = nombre.replace(/'/g, "\\'");

      html += '<div class="dd-item" style="display:flex;align-items:center;gap:6px" '
            + 'onclick="onSubitemClick(event,\'' + nombreEsc + '\',\'' + seccionKey + '\')">'
            + '<span style="flex:1">' + icono + ' ' + nombre + '</span>'
            + '<input type="checkbox" class="stat-check child-check" '
            + 'id="' + id + '" '
            + 'data-nombre="' + nombre.replace(/"/g, '&quot;') + '" '
            + 'data-seccion="' + seccionKey + '" '
            + 'onclick="onChildCheck(event,\'' + seccionKey + '\')">'
            + '</div>';
    });
    html += '</div>'; // .submenu
    html += '</div>'; // .submenu-wrapper
  });

  dropdown.innerHTML = html;
  dropdown.addEventListener('mousedown', function(e) { e.stopPropagation(); });
}

// ── Click en checkbox hijo ──
function onChildCheck(event, seccionKey) {
  event.stopPropagation();
  var chk = event.target;
  var justChecked = chk.checked;
  var nombre = chk.dataset.nombre;
  analisisResultContent = null;
  updateParentCheck(seccionKey);
  updateBadge(seccionKey);
  if (currentPage === 'analisis') {
    rightPaneBody.innerHTML = rightPanels.analisis();
  }
  if (justChecked && HYPOTHESIS_SET.has(nombre) && !StateManager.getHypothesisConfig(nombre)) {
    _mostrarModalConfigTest(nombre, function() {});
  }
  if (justChecked && PARAM_CONFIG_SET.has(nombre) && !StateManager.getParamConfig(nombre)) {
    _mostrarModalParamConfig(nombre, function() {});
  }
}

function onParentCheck(event, seccionKey) {
  event.stopPropagation();
  var parentChk = document.getElementById('chk-parent-' + seccionKey);
  var checked = parentChk.checked;
  document.querySelectorAll('.child-check[data-seccion="' + seccionKey + '"]')
    .forEach(function(chk) { chk.checked = checked; });
  parentChk.classList.remove('partial');
  updateBadge(seccionKey);

  analisisSelectedCategory = seccionKey;
  analisisResultContent = null;

  if (currentPage === 'analisis') {
    leftPaneBody.innerHTML = leftPanels.analisis();
    rightPaneBody.innerHTML = rightPanels.analisis();
    updateColumnAnalysisSummary();
  }

  if (checked) {
    var needConfig = [];
    document.querySelectorAll('.child-check[data-seccion="' + seccionKey + '"]').forEach(function(chk) {
      var n = chk.dataset.nombre;
      if (HYPOTHESIS_SET.has(n) && !StateManager.getHypothesisConfig(n)) {
        needConfig.push(n);
      }
    });
    if (needConfig.length > 0) {
      _showModalSequence(needConfig, 0);
    }
  }
}

function _showModalSequence(tests, index) {
  if (index >= tests.length) return;
  _mostrarModalConfigTest(tests[index], function() {
    _showModalSequence(tests, index + 1);
  });
}

// ── Actualizar estado del padre según hijos ──
function updateParentCheck(seccionKey) {
  var parentChk = document.getElementById('chk-parent-' + seccionKey);
  if (!parentChk) return;
  var children = document.querySelectorAll(
    '.child-check[data-seccion="' + seccionKey + '"]'
  );
  var total    = children.length;
  var checked  = Array.from(children).filter(function(c){ return c.checked; }).length;

  parentChk.classList.remove('partial');
  if (checked === 0) {
    parentChk.checked = false;
  } else if (checked === total) {
    parentChk.checked = true;
  } else {
    parentChk.checked = false;
    parentChk.classList.add('partial'); // estado intermedio
  }
}

// ── Badge con contador de seleccionados ──
function updateBadge(seccionKey) {
  var badge = document.getElementById('badge-' + seccionKey);
  if (!badge) return;
  var checked = document.querySelectorAll(
    '.child-check[data-seccion="' + seccionKey + '"]:checked'
  ).length;
  badge.textContent = checked;
  badge.classList.toggle('visible', checked > 0);
}

// ── Click en el texto del subitem — ejecuta Y marca el checkbox ──
function selectAnalisisTestDirect(testId, category) {
  analisisSelectedCategory = category;
  analisisSelectedTest = testId;
  analisisResultContent = null;
  loadPage('analisis');
  setTimeout(function() { runSingleStat(testId); }, 50);
}

function onSubitemClick(event, nombre, seccionKey) {
  if (event.target.classList.contains('stat-check')) { return; }

  // 1. Marcar checkbox
  var id = 'chk-' + seccionKey + '-' + nombre.replace(/[^a-zA-Z0-9]/g, '_');
  var chk = document.getElementById(id);
  var justChecked = false;
  if (chk) {
    chk.checked = !chk.checked;
    justChecked = chk.checked;
    updateParentCheck(seccionKey);
    updateBadge(seccionKey);
  }

  // 2. Modal de configuración si aplica
  if (justChecked && HYPOTHESIS_SET.has(nombre) && !StateManager.getHypothesisConfig(nombre)) {
    _mostrarModalConfigTest(nombre, function() {});
  }
  if (justChecked && PARAM_CONFIG_SET.has(nombre) && !StateManager.getParamConfig(nombre)) {
    _mostrarModalParamConfig(nombre, function() {});
  }

  // 3. Actualizar estado global y limpiar resultado previo
  analisisSelectedCategory = seccionKey;
  analisisSelectedTest = nombre;
  analisisResultContent = null;

  // 4. Si NO estamos en análisis, navegar primero
  if (currentPage !== 'analisis') {
    loadPage('analisis');
  } else {
    // Solo actualizar el sidebar izquierdo sin tocar el panel derecho
    leftPaneBody.innerHTML = leftPanels.analisis();
    updateColumnAnalysisSummary();
  }

  // 5. Mostrar cards en panel derecho
  rightPaneBody.innerHTML = rightPanels.analisis();
}

// ── Auth + Initial load ──
var _initRetries = 0;
function _initIndexxApp() {
  if (typeof Auth === 'undefined') {
    if (++_initRetries > 300) {
      console.error("Auth module failed to load after 300 retries. Check script loading order.");
      return;
    }
    setTimeout(_initIndexxApp, 50); return;
  }
  // Migrar hypothesisConfig antiguos (pre-fix columnas X/Y)
  try {
    var oldCfg = StateManager && StateManager.getHypothesisConfig && StateManager.getAllHypothesisConfig();
    if (oldCfg) {
      for (var key in oldCfg) {
        if (oldCfg.hasOwnProperty(key)) {
          var c = oldCfg[key];
          if (c && !c.columnaX && !c.columnaY && c.categoricalCols && c.numericCol) {
            var estadCfg = getEstadisticoConfig(key);
            if (estadCfg && (estadCfg.seccion === 'correlacion' || estadCfg.seccion === 'regresion')) {
              StateManager.clearHypothesisConfig(key);
            }
          }
        }
      }
    }
  } catch(e) { console.warn('Migración hypothesisConfig:', e); }
  Auth.init({
    onLogin: function(session) {
      _restoreAllData();
      loadPage('datos');
      var isAdmin = session?.role === 'admin';
      var adminPages = ['auditoria','usuarios','dispositivos'];
      adminPages.forEach(function(p){
        var el = document.querySelector('[data-page="'+p+'"]');
        if (el) el.style.display = isAdmin ? '' : 'none';
      });
      var adminTitle = document.querySelector('.nav-section-title');
      if (adminTitle) adminTitle.style.display = isAdmin ? '' : 'none';
      buildRibbonNavPopup();
    }
  });
}
