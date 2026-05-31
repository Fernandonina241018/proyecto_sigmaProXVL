// ========================================
// MLManager.js — StatAnalyzer Pro
// Machine Learning integration with Python service
// ========================================

const MLManager = (() => {
    let _models = [];
    let _datasets = [];
    let _selectedModelId = null;
    let _trainingHistory = [];

    function _getMlApiUrl() {
        if (typeof ML_API_URL !== 'undefined') return ML_API_URL;
        return 'http://localhost:8000';
    }

    async function _fetch(method, path, body, _retries) {
        if (_retries === undefined) _retries = 3;
        const token = typeof Auth !== 'undefined' ? Auth.getToken() : null;
        const apiUrl = _getMlApiUrl();
        const opts = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (token) opts.headers['Authorization'] = 'Bearer ' + token;
        if (body) opts.body = JSON.stringify(body);
        try {
            const res = await fetch(apiUrl + path, opts);
            if (res.status === 404 && _retries > 0) {
                await new Promise(r => setTimeout(r, 1500));
                return _fetch(method, path, body, _retries - 1);
            }
            if (!res.ok) {
                const text = await res.text();
                let msg;
                try { const j = JSON.parse(text); msg = j.detail || j.error || 'Error ' + res.status; }
                catch (e) { msg = 'Error ' + res.status + ': el servidor respondió con HTML (posiblemente el ML Service no está corriendo)'; }
                throw new Error(msg);
            }
            const data = await res.json();
            return data;
        } catch (e) {
            if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError') || e.message.includes('ERR_CONNECTION_REFUSED')) {
                throw new Error('ML Service no disponible (' + apiUrl + '). Asegúrate de que el servicio Python esté corriendo en puerto 8000.');
            }
            throw e;
        }
    }

    function buildLeftPanel() {
        return '<div class="left-panel" style="gap:8px;height:100%;display:flex;flex-direction:column;min-height:0">' +
            '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">🧠 ML Analysis</div>' +
            '<div class="info-section-body" style="padding:6px 10px;font-size:10px;color:var(--text-faint)">' +
            'Entrena modelos, haz predicciones y detecta anomalías.</div></div>' +
            '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">📊 Dataset</div>' +
            '<div class="info-section-body" style="padding:6px 10px;display:flex;flex-direction:column;gap:4px">' +
            '<select id="ml-dataset-select" style="width:100%;padding:4px 6px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-panel);color:var(--text-primary);font-size:10px">' +
            '<option value="">— Cargando datasets —</option></select>' +
            '<button class="btn btn-secondary" style="width:100%;justify-content:center;font-size:10px;padding:3px 8px" onclick="MLManager.refreshDatasets()">🔄 Refrescar</button>' +
            '</div></div>' +
            '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">🤖 Modelo <span style="cursor:help;font-size:11px;margin-left:auto" onclick="MLManager.showAlgorithmInfo()" title="Ver detalles del algoritmo">ⓘ</span></div>' +
            '<div class="info-section-body" style="padding:6px 10px;display:flex;flex-direction:column;gap:4px">' +
            '<select id="ml-model-select" style="width:100%;padding:4px 6px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-panel);color:var(--text-primary);font-size:10px">' +
            '<option value="rf">🌳 Random Forest</option>' +
            '<option value="xgb">⚡ XGBoost</option>' +
            '<option value="mlp">🧠 MLP Neural Net</option>' +
            '<option value="logistic">📈 Logistic Regression</option>' +
            '<option value="linear">📐 Linear Regression</option>' +
            '</select>' +
            '<label style="font-size:9px;color:var(--text-faint);display:flex;align-items:center;gap:4px">' +
            '<input type="text" id="ml-target-input" placeholder="columna target" style="flex:1;padding:3px 5px;border:1px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:10px"> Target</label>' +
            '<button class="btn btn-primary" style="width:100%;justify-content:center;font-size:10px;padding:3px 8px" onclick="MLManager.train()">🎯 Entrenar</button>' +
            '</div></div>' +
            '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">💾 Modelos guardados</div>' +
            '<div class="info-section-body" style="padding:6px 10px;display:flex;flex-direction:column;gap:4px">' +
            '<select id="ml-models-select" style="width:100%;padding:4px 6px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-panel);color:var(--text-primary);font-size:10px" onchange="MLManager.onModelSelect(this.value)">' +
            '<option value="">— Sin modelos —</option></select>' +
            '<div style="display:flex;gap:4px">' +
            '<button class="btn btn-primary" style="flex:1;justify-content:center;font-size:10px;padding:3px 8px" onclick="MLManager.predictSelectedModel()">🔮 Predecir</button>' +
            '<button class="btn btn-secondary" style="justify-content:center;font-size:10px;padding:3px 8px;color:#ef4444" onclick="MLManager.deleteSelectedModel()">🗑</button>' +
            '</div></div></div>' +
            '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">⚠️ Anomalías</div>' +
            '<div class="info-section-body" style="padding:6px 10px">' +
            '<button class="btn btn-secondary" style="width:100%;justify-content:center;font-size:10px;padding:3px 8px" onclick="MLManager.detectAnomalies()">🔍 Detectar anomalías</button></div></div>' +
            '</div>';
    }

    function buildRightPanel() {
        return '<div class="page-body" style="display:flex;flex-direction:column;gap:12px;height:100%;min-height:0">' +
            '<div class="page-card" style="flex:1;display:flex;flex-direction:column;min-height:0">' +
            '<div class="page-card-header" style="padding:10px 16px"><span class="page-card-icon">📊</span><span class="page-card-title">ML Results</span></div>' +
            '<div class="page-card-body" id="ml-results" style="flex:1;overflow:auto;padding:12px;font-size:12px;color:var(--text-primary);min-height:0">' +
            '<div style="text-align:center;padding:40px 20px;color:var(--text-faint)">' +
            '<div style="font-size:48px;margin-bottom:12px">🧠</div>' +
            '<div style="font-size:14px;font-weight:600;margin-bottom:6px">Machine Learning</div>' +
            '<div style="font-size:11px">Carga un dataset, selecciona el target y entrena un modelo.<br>' +
            'Usa modelos guardados para predecir nuevos datos.</div></div></div></div></div>';
    }

    function _getWorksheetData(sheetName) {
        if (typeof window.trabajoSheets === 'undefined' || !window.trabajoSheets.length) return null;
        var sheet = null;
        for (var i = 0; i < window.trabajoSheets.length; i++) {
            if (window.trabajoSheets[i].name === sheetName) { sheet = window.trabajoSheets[i]; break; }
        }
        if (!sheet) return null;
        var headers = sheet.headers || [];
        var rows = sheet.rows || [];
        var filtered = [];
        for (var r = 0; r < rows.length; r++) {
            var row = rows[r];
            var hasData = false;
            for (var c = 0; c < row.length; c++) {
                if (row[c] != null && String(row[c]).trim() !== '') { hasData = true; break; }
            }
            if (hasData) filtered.push(row);
        }
        if (filtered.length === 0) return { columns: headers, data: [], nrows: 0 };
        var data = [];
        for (var r = 0; r < filtered.length; r++) {
            var obj = {};
            for (var c = 0; c < headers.length; c++) {
                var val = filtered[r][c];
                if (val != null && String(val).trim() !== '') {
                    var num = Number(val);
                    obj[headers[c]] = isFinite(num) ? num : val;
                } else {
                    obj[headers[c]] = null;
                }
            }
            data.push(obj);
        }
        return { columns: headers, data: data, nrows: filtered.length };
    }

    function init() {
        refreshDatasets();
        refreshModels();
    }

    async function refreshDatasets() {
        const sel = document.getElementById('ml-dataset-select');
        if (!sel) return;
        sel.innerHTML = '<option value="">Cargando...</option>';
        try {
            var data = await _fetch('GET', '/api/ml/datasets');
            _datasets = data.datasets || [];
            sel.innerHTML = '<option value="">— Selecciona dataset —</option>';
            _datasets.forEach(function(ds) {
                var opt = document.createElement('option');
                opt.value = ds.name;
                opt.textContent = ds.name + ' (' + ds.nrows + 'r x ' + ds.ncols + 'c)';
                sel.appendChild(opt);
            });
            if (typeof window.trabajoSheets !== 'undefined') {
                for (var i = 0; i < window.trabajoSheets.length; i++) {
                    var ws = window.trabajoSheets[i];
                    var wsHeaders = ws.headers || [];
                    var wsRows = (ws.rows || []).filter(function(r) {
                        for (var c = 0; c < r.length; c++) {
                            if (r[c] != null && String(r[c]).trim() !== '') return true;
                        }
                        return false;
                    });
                    if (wsRows.length > 0) {
                        var opt = document.createElement('option');
                        opt.value = '__ws__:' + ws.name;
                        opt.textContent = '📋 ' + ws.name + ' (' + wsRows.length + 'r x ' + wsHeaders.length + 'c)';
                        sel.appendChild(opt);
                    }
                }
            }
            if (_datasets.length === 0 && (!sel.options || sel.options.length <= 1)) {
                sel.innerHTML = '<option value="">— No hay datasets —</option>';
            }
        } catch (e) {
            sel.innerHTML = '<option value="">— Error: ' + e.message + ' —</option>';
            showToast('Error al cargar datasets: ' + e.message, 'error');
        }
    }

    async function refreshModels() {
        const sel = document.getElementById('ml-models-select');
        if (!sel) return;
        try {
            const data = await _fetch('GET', '/api/ml/models');
            _models = data.models || [];
            sel.innerHTML = '<option value="">— ' + (_models.length === 0 ? 'Sin modelos entrenados' : 'Selecciona un modelo') + ' —</option>';
            _models.forEach(function(m) {
                var opt = document.createElement('option');
                opt.value = m.id;
                var label = m.id;
                if (m.model_key) label += ' · ' + m.model_key;
                if (m.saved_at) label += ' · ' + m.saved_at.slice(0, 10);
                opt.textContent = label;
                sel.appendChild(opt);
            });
        } catch (e) {
            sel.innerHTML = '<option value="">— Error: ' + e.message + ' —</option>';
            showToast('Error al cargar modelos: ' + e.message, 'error');
        }
    }

    function onModelSelect(modelId) {
        if (!modelId) return;
        _selectedModelId = modelId;
        for (var i = 0; i < _models.length; i++) {
            if (_models[i].id === modelId) { loadModelDetail(_models[i]); return; }
        }
    }

    function predictSelectedModel() {
        if (!_selectedModelId) { showToast('Selecciona un modelo primero', 'error'); return; }
        predictFromModel(_selectedModelId);
    }

    async function deleteSelectedModel() {
        if (!_selectedModelId) { showToast('Selecciona un modelo primero', 'error'); return; }
        if (!confirm('¿Eliminar modelo ' + _selectedModelId + '?')) return;
        try {
            await _fetch('DELETE', '/api/ml/models/' + _selectedModelId);
            _selectedModelId = null;
            refreshModels();
            document.getElementById('ml-results').innerHTML = buildEmptyState();
            showToast('🗑 Modelo eliminado', 'ok');
        } catch (e) {
            showToast('Error: ' + e.message, 'error');
        }
    }

    function loadModelDetail(model) {
        const results = document.getElementById('ml-results');
        if (!results) return;
        var metrics = model.metrics || {};
        var meta = model.meta || {};
        var html = '<div class="page-card" style="margin-bottom:10px">' +
            '<div class="page-card-header" style="padding:8px 14px"><span class="page-card-icon">💾</span><span class="page-card-title" style="font-size:13px">' + escapeHtml(model.id) + '</span></div>' +
            '<div class="page-card-body" style="padding:10px 14px;font-size:11px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">' +
            '<div><strong>Algoritmo:</strong> ' + escapeHtml(model.model_key) + '</div>' +
            '<div><strong>Dataset:</strong> ' + escapeHtml(model.dataset_name || '—') + '</div>' +
            '<div><strong>Tipo:</strong> ' + escapeHtml(meta.problem_type || '—') + '</div>' +
            '<div><strong>Guardado:</strong> ' + (model.saved_at ? model.saved_at.slice(0, 16) : '—') + '</div>' +
            '</div>';
        if (Object.keys(metrics).length > 0) {
            html += '<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">' +
                '<div style="font-weight:600;margin-bottom:4px;font-size:10px">📊 Métricas</div>';
            var keys = Object.keys(metrics).filter(function(k) { return !['y_pred', 'y_proba'].includes(k); });
            html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 12px">';
            keys.forEach(function(k) {
                var v = metrics[k];
                if (typeof v === 'number') v = v.toFixed ? v.toFixed(4) : v;
                html += '<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px"><span>' + k + '</span><span style="font-weight:500;color:var(--accent)">' + v + '</span></div>';
            });
            html += '</div></div>';
        }
        html += '<div style="margin-top:8px;display:flex;gap:6px">' +
            '<button class="btn btn-primary" style="flex:1;justify-content:center;font-size:10px;padding:4px 8px" onclick="MLManager.predictFromModel(\'' + model.id + '\')">🔮 Predecir</button>' +
            '<button class="btn btn-secondary" style="justify-content:center;font-size:10px;padding:4px 8px;color:#ef4444" onclick="MLManager.deleteModel(\'' + model.id + '\')">🗑 Eliminar</button>' +
            '</div></div></div>';
        results.innerHTML = html;
    }

    async function train() {
        const results = document.getElementById('ml-results');
        if (!results) return;
        results.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-faint)">⏳ Entrenando modelo...</div>';
        const datasetSelect = document.getElementById('ml-dataset-select');
        const modelSelect = document.getElementById('ml-model-select');
        const targetInput = document.getElementById('ml-target-input');
        const datasetName = datasetSelect ? datasetSelect.value : '';
        const modelKey = modelSelect ? modelSelect.value : 'rf';
        const target = targetInput ? targetInput.value.trim() : '';
        if (!datasetName) { showToast('Selecciona un dataset', 'error'); results.innerHTML = buildEmptyState(); return; }
        if (!target) { showToast('Ingresa el nombre de la columna target', 'error'); results.innerHTML = buildEmptyState(); return; }

        var isWorksheet = datasetName.indexOf('__ws__:') === 0;
        var sheetName = isWorksheet ? datasetName.slice(7) : null;

        async function doTrain(bootstrap) {
            if (isWorksheet) {
                var wsData = _getWorksheetData(sheetName);
                if (!wsData || wsData.nrows === 0) throw new Error('La hoja de trabajo "' + sheetName + '" no tiene datos');
                if (wsData.columns.indexOf(target) === -1) throw new Error('Columna target "' + target + '" no encontrada en la hoja');
                return await _fetch('POST', '/api/ml/train', {
                    data: wsData.data, columns: wsData.columns,
                    target: target, model_key: modelKey,
                    n_bootstraps: bootstrap ? 3 : 0,
                    dataset_name: '📋 ' + sheetName,
                });
            } else {
                return await _fetch('POST', '/api/ml/train', {
                    data: [], columns: [],
                    target: target, model_key: modelKey,
                    n_bootstraps: bootstrap ? 3 : 0,
                    dataset_name: datasetName,
                });
            }
        }

        try {
            var data = await doTrain(true);
            _trainingHistory.push(data);
            renderTrainingResult(data);
            refreshModels();
            showToast('✅ Modelo ' + data.model_id + ' entrenado', 'ok');
        } catch (e) {
            try {
                var data = await doTrain(false);
                _trainingHistory.push(data);
                renderTrainingResult(data);
                refreshModels();
                showToast('✅ Modelo ' + data.model_id + ' entrenado (sin bootstrap)', 'ok');
            } catch (e2) {
                results.innerHTML = '<div class="page-card"><div class="page-card-header" style="color:#ef4444">❌ Error</div>' +
                    '<div class="page-card-body" style="padding:12px;font-size:12px">' + escapeHtml(e2.message) + '</div></div>';
                showToast('Error: ' + e2.message, 'error');
            }
        }
    }

    function renderTrainingResult(data) {
        const results = document.getElementById('ml-results');
        if (!results) return;
        var meta = data.meta || {};
        var metrics = data.metrics || {};
        var html = '<div class="page-card" style="margin-bottom:10px">' +
            '<div class="page-card-header" style="padding:8px 14px"><span class="page-card-icon">🎯</span><span class="page-card-title" style="font-size:13px">Modelo: ' + escapeHtml(data.model_id) + '</span></div>' +
            '<div class="page-card-body" style="padding:10px 14px;font-size:11px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px">' +
            '<div><strong>Tipo:</strong> ' + escapeHtml(meta.problem_type || '—') + '</div>' +
            '<div><strong>Target:</strong> ' + escapeHtml(meta.target_col || '—') + '</div>' +
            '<div><strong>Features num:</strong> ' + (meta.num_features || []).join(', ') + '</div>' +
            '<div><strong>Features cat:</strong> ' + (meta.cat_features || []).join(', ') + '</div>' +
            '<div><strong>Train:</strong> ' + (meta.n_train || '—') + ' filas</div>' +
            '<div><strong>Test:</strong> ' + (meta.n_test || '—') + ' filas</div>' +
            '</div>';
        html += '<div style="border-top:1px solid var(--border);padding-top:8px">' +
            '<div style="font-weight:600;margin-bottom:4px;font-size:10px">📊 Métricas</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 12px">';
        for (var k in metrics) {
            if (['y_pred', 'y_proba'].includes(k)) continue;
            var v = metrics[k];
            if (typeof v === 'number') v = v.toFixed ? v.toFixed(4) : v;
            html += '<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px">' +
                '<span>' + k + '</span><span style="font-weight:500;color:var(--accent)">' + v + '</span></div>';
        }
        html += '</div></div>';
        if (meta.target_classes && meta.target_classes.length) {
            html += '<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">' +
                '<div style="font-weight:600;margin-bottom:2px;font-size:10px">🎯 Clases target</div>' +
                '<div style="font-size:10px;color:var(--text-primary)">' + meta.target_classes.join(', ') + '</div></div>';
        }
        html += '<div style="margin-top:8px;display:flex;gap:6px">' +
            '<button class="btn btn-primary" style="flex:1;justify-content:center;font-size:10px;padding:4px 8px" onclick="MLManager.predictFromModel(\'' + data.model_id + '\')">🔮 Predecir</button>' +
            '</div></div></div>';
        results.innerHTML = html;
    }

    function buildEmptyState() {
        return '<div style="text-align:center;padding:40px 20px;color:var(--text-faint)">' +
            '<div style="font-size:48px;margin-bottom:12px">🧠</div>' +
            '<div style="font-size:14px;font-weight:600;margin-bottom:6px">Machine Learning</div>' +
            '<div style="font-size:11px">Carga un dataset, selecciona el target y entrena un modelo.</div></div>';
    }

    function _renderPredictionsTable(predictions) {
        if (!predictions || !predictions.length) return '<div style="font-size:13px;color:var(--text-faint);padding:20px;text-align:center">Sin resultados</div>';
        var rows = '';
        for (var i = 0; i < predictions.length; i++) {
            var p = predictions[i];
            var mainVal = p['prediccion_legible'] || p['clase_predicha'] || p['prediccion'] || '';
            var prob = p['probabilidad_predicha'] ?? p['nivel_confianza'] ?? '';
            var cells = '';
            for (var key in p) {
                if (key === 'index') continue;
                if (key === 'explicacion_factores' || key === 'factores_a_favor' || key === 'factores_en_contra') continue;
                if (key === 'prediccion_legible' || key === 'clase_predicha') continue;
                var val = p[key];
                if (typeof val === 'number') val = val.toFixed ? val.toFixed(4) : val;
                if (val === null || val === undefined) val = '—';
                var label = key
                    .replace('prediccion', 'Predicción')
                    .replace('ic_lower_95', 'IC inferior (95%)')
                    .replace('ic_upper_95', 'IC superior (95%)')
                    .replace('clase_predicha', 'Clase')
                    .replace('prediccion_legible', 'Predicción')
                    .replace('probabilidad_predicha', 'Probabilidad')
                    .replace('nivel_confianza', 'Confianza')
                    .replace('clase_alternativa', 'Clase alt.')
                    .replace('clase_alternativa_legible', 'Alternativa')
                    .replace('probabilidad_alternativa', 'Prob. alt.')
                    .replace('margen_decision', 'Margen')
                    .replace('segunda_clase', '2da clase')
                    .replace('segunda_clase_legible', '2da opción')
                    .replace('probabilidad_segunda_clase', 'Prob. 2da')
                    .replace(/^explicacion$/, 'Explicación')
                    .replace(/_/g, ' ');
                cells += '<div style="display:flex;gap:8px;padding:3px 0"><span style="font-weight:500;min-width:120px;font-size:12px;color:var(--text-faint)">' + label + ':</span><span style="font-size:12px;font-weight:500">' + escapeHtml(String(val)) + '</span></div>';
            }
            var expl = p['explicacion'] || p['explicacion_factores'] || '';
            if (expl) {
                cells += '<div style="margin-top:6px;padding:8px 10px;background:var(--item-bg);border-radius:6px;font-size:11px;color:var(--text-muted);line-height:1.5">' + escapeHtml(expl) + '</div>';
            }
            var headerHtml = '<div style="font-weight:700;font-size:13px;margin-bottom:6px;color:var(--accent)">📊 Predicción ' + (i + 1) + '</div>';
            if (mainVal) {
                headerHtml += '<div style="font-size:22px;font-weight:700;margin-bottom:8px;color:var(--text-primary)">' + escapeHtml(String(mainVal)) + (prob ? ' <span style="font-size:14px;font-weight:500;color:var(--text-faint)">(' + (typeof prob === 'number' ? (prob * 100).toFixed(1) + '%' : prob) + ')</span>' : '') + '</div>';
            }
            rows += '<div style="padding:14px 16px;background:var(--item-bg);border-radius:8px;border:1px solid var(--border)">' +
                headerHtml +
                cells + '</div>';
        }
        return '<div style="display:flex;flex-direction:column;gap:8px;max-height:360px;overflow-y:auto">' + rows + '</div>';
    }

    function predictFromModel(modelId) {
        var model = null;
        for (var i = 0; i < _models.length; i++) {
            if (_models[i].id === modelId) { model = _models[i]; break; }
        }
        var isExpertMode = false;
        var allFeatures = ((model && model.meta && model.meta.num_features) || []).concat((model && model.meta && model.meta.cat_features) || []);
        var rows = allFeatures.length ? allFeatures.map(function(f) { return { col: f, val: '' }; }) : [{ col: '', val: '' }];

        function buildJsonFromForm() {
            var obj = {};
            allFeatures.forEach(function(f) {
                var row = rows.filter(function(r) { return r.col === f; })[0];
                var v = row ? row.val : '';
                obj[f] = v === '' ? 0 : Number(v);
                if (isNaN(obj[f])) obj[f] = v;
            });
            return JSON.stringify([obj], null, 2);
        }

        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999';
        var box = document.createElement('div');
        box.className = 'modal-box';
        box.style.cssText = 'width:92vw;max-width:1320px;background:var(--bg-panel);border-radius:14px;box-shadow:0 12px 48px rgba(0,0,0,0.35);overflow:hidden';
        var title = document.createElement('div');
        title.className = 'modal-title';
        title.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 24px;font-size:15px;font-weight:700;border-bottom:1px solid var(--border);background:var(--item-bg)';
        title.innerHTML = '<span>🔮 Predecir con ' + modelId + '</span>';
        var toggleLabel = document.createElement('label');
        toggleLabel.style.cssText = 'font-size:10px;display:flex;align-items:center;gap:4px;cursor:pointer;color:var(--text-faint);user-select:none';
        toggleLabel.innerHTML = '<input type="checkbox" id="ml-expert-toggle"> Modo experto';
        title.appendChild(toggleLabel);
        box.appendChild(title);

        var content = document.createElement('div');
        content.style.cssText = 'padding:20px 24px;display:flex;flex-direction:column;gap:16px;max-height:80vh;overflow-y:auto';

        var meta = (model && model.meta) || {};
        var metrics = (model && model.metrics) || {};
        var infoGrid = document.createElement('div');
        infoGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:10px';

        function infoCard(title, lines) {
            var card = document.createElement('div');
            card.style.cssText = 'padding:12px 14px;background:var(--item-bg);border-radius:8px;font-size:11px;border:1px solid var(--border)';
            var t = document.createElement('div');
            t.style.cssText = 'font-weight:700;margin-bottom:6px;font-size:10px;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.5px';
            t.textContent = title;
            card.appendChild(t);
            lines.forEach(function(l) {
                var d = document.createElement('div');
                d.style.cssText = 'display:flex;justify-content:space-between;padding:2px 0';
                d.innerHTML = '<span style="color:var(--text-faint)">' + l[0] + '</span><span style="font-weight:600;color:var(--accent)">' + l[1] + '</span>';
                card.appendChild(d);
            });
            return card;
        }

        var metricKeys = Object.keys(metrics).filter(function(k) { return !['y_pred', 'y_proba'].includes(k); });
        var metricLines = metricKeys.slice(0, 4).map(function(k) {
            var v = metrics[k];
            if (typeof v === 'number') v = v.toFixed ? v.toFixed(4) : v;
            return [k, String(v)];
        });
        if (!metricLines.length) metricLines = [['—', 'Sin métricas']];

        infoGrid.appendChild(infoCard('🤖 Identidad', [
            ['Algoritmo', model.model_key || '—'],
            ['Dataset', model.dataset_name || '—'],
            ['Guardado', model.saved_at ? model.saved_at.slice(0, 16) : '—'],
        ]));
        infoGrid.appendChild(infoCard('📊 Métricas', metricLines));
        infoGrid.appendChild(infoCard('📐 Features', [
            ['Numéricas', String((meta.num_features || []).length)],
            ['Categóricas', String((meta.cat_features || []).length)],
            ['Target', meta.target_col || '—'],
        ]));
        infoGrid.appendChild(infoCard('📋 Datos', [
            ['Tipo', meta.problem_type || '—'],
            ['Train', String(meta.n_train || '—') + ' filas'],
            ['Test', String(meta.n_test || '—') + ' filas'],
        ]));
        content.appendChild(infoGrid);

        var sep = document.createElement('div');
        sep.style.cssText = 'height:1px;background:var(--border);margin:2px 0';
        content.appendChild(sep);

        var formContainer = document.createElement('div');
        formContainer.id = 'ml-predict-form';
        formContainer.style.cssText = 'display:flex;flex-direction:column;gap:10px;background:var(--item-bg);border-radius:8px;padding:16px;border:1px solid var(--border)';

        function makeRowInput(placeholder, onChange) {
            var input = document.createElement('input');
            input.type = 'text';
            input.placeholder = placeholder;
            input.style.cssText = 'flex:1;padding:5px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:11px;min-width:0';
            input.oninput = function() { onChange(input.value); updatePreview(); };
            return input;
        }

        function makeValueInput(onChange) {
            var input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.placeholder = '0';
            input.style.cssText = 'width:140px;padding:7px 10px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:13px;font-weight:500';
            input.oninput = function() { onChange(input.value); updatePreview(); };
            return input;
        }

        function renderRows() {
            formContainer.innerHTML = '';
            var listId = 'ml-feature-list';
            var existingDl = document.getElementById(listId);
            if (!existingDl) {
                var dl = document.createElement('datalist');
                dl.id = listId;
                allFeatures.forEach(function(f) {
                    var opt = document.createElement('option');
                    opt.value = f;
                    dl.appendChild(opt);
                });
                document.body.appendChild(dl);
            }
            var grid = document.createElement('div');
            grid.style.cssText = 'display:grid;grid-template-columns:' + (allFeatures.length > 4 ? '1fr 1fr' : '1fr') + ';gap:8px';
            rows.forEach(function(r, idx) {
                var rowDiv = document.createElement('div');
                rowDiv.style.cssText = 'display:flex;align-items:center;gap:8px';
                if (r.col && allFeatures.indexOf(r.col) !== -1) {
                    var colSpan = document.createElement('span');
                    colSpan.style.cssText = 'font-size:13px;font-weight:600;color:var(--text-primary);min-width:140px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
                    colSpan.textContent = r.col;
                    rowDiv.appendChild(colSpan);
                } else {
                    var colInput = makeRowInput('columna', function(v) { r.col = v; });
                    colInput.value = r.col;
                    colInput.setAttribute('list', listId);
                    colInput.style.cssText = 'flex:1;padding:7px 10px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:13px;min-width:0';
                    rowDiv.appendChild(colInput);
                }
                var valInput = makeValueInput(function(v) { r.val = v; });
                valInput.value = r.val;
                rowDiv.appendChild(valInput);
                if (rows.length > 1) {
                    var delBtn = document.createElement('button');
                    delBtn.textContent = '✕';
                    delBtn.style.cssText = 'border:none;background:var(--item-bg);cursor:pointer;font-size:12px;color:var(--danger,#e74c3c);padding:4px 8px;border-radius:4px;flex-shrink:0';
                    delBtn.onclick = function() { rows.splice(idx, 1); renderRows(); updatePreview(); };
                    rowDiv.appendChild(delBtn);
                }
                grid.appendChild(rowDiv);
            });
            formContainer.appendChild(grid);
            var addBtn = document.createElement('button');
            addBtn.textContent = '➕ Agregar columna';
            addBtn.style.cssText = 'border:1px dashed var(--border);background:none;cursor:pointer;font-size:12px;color:var(--text-faint);padding:8px;border-radius:6px;width:100%';
            addBtn.onclick = function() { rows.push({ col: '', val: '' }); renderRows(); updatePreview(); };
            formContainer.appendChild(addBtn);
        }
        renderRows();
        content.appendChild(formContainer);

        var textarea = document.createElement('textarea');
        textarea.id = 'ml-predict-input';
        textarea.placeholder = 'Array de objetos con las columnas del modelo';
        textarea.style.cssText = 'width:100%;min-height:140px;padding:10px;border:1.5px solid var(--border);border-radius:8px;background:var(--bg-primary);color:var(--text-primary);font-size:12px;font-family:monospace;resize:vertical;display:none';
        textarea.value = JSON.stringify([{ "columna": 0 }], null, 2);
        content.appendChild(textarea);

        var previewLabel = document.createElement('div');
        previewLabel.style.cssText = 'font-size:11px;font-weight:600;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.5px';
        previewLabel.textContent = '📄 JSON generado:';
        content.appendChild(previewLabel);

        var previewEl = document.createElement('div');
        previewEl.id = 'ml-preview-json';
        previewEl.style.cssText = 'font-size:11px;padding:10px 12px;background:var(--bg-primary);border-radius:6px;white-space:pre-wrap;font-family:monospace;color:var(--text-primary);max-height:120px;overflow:auto;border:1px solid var(--border)';
        previewEl.textContent = buildJsonFromForm();
        content.appendChild(previewEl);

        function updatePreview() {
            if (isExpertMode) return;
            previewEl.textContent = buildJsonFromForm();
        }

        var actions = document.createElement('div');
        actions.style.cssText = 'display:flex;gap:12px;justify-content:end;padding-top:4px';
        var cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.style.cssText = 'padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;border:1.5px solid var(--border);background:var(--item-bg);color:var(--text-primary);cursor:pointer';
        cancelBtn.onclick = function() { overlay.remove(); cleanupPredictModal(); };
        actions.appendChild(cancelBtn);
        var predictBtn = document.createElement('button');
        predictBtn.className = 'btn btn-primary';
        predictBtn.textContent = '🔮 Predecir';
        predictBtn.style.cssText = 'padding:8px 24px;border-radius:8px;font-size:13px;font-weight:700;border:none;background:var(--accent,#6366f1);color:#fff;cursor:pointer';
        predictBtn.onclick = async function() {
            var resOverlay = document.createElement('div');
            resOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:10000';
            var resBox = document.createElement('div');
            resBox.style.cssText = 'width:84vw;max-width:1100px;max-height:85vh;background:var(--bg-panel);border-radius:14px;box-shadow:0 12px 48px rgba(0,0,0,0.4);overflow:hidden;display:flex;flex-direction:column';
            var resTitle = document.createElement('div');
            resTitle.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 24px;font-size:15px;font-weight:700;border-bottom:1px solid var(--border);background:var(--item-bg)';
            resTitle.innerHTML = '<span>🔮 Resultado de predicción</span>';
            var closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = 'border:none;background:none;cursor:pointer;font-size:18px;color:var(--text-faint);padding:4px 8px;border-radius:6px';
            closeBtn.onclick = function() { resOverlay.remove(); };
            resTitle.appendChild(closeBtn);
            resBox.appendChild(resTitle);
            var resBody = document.createElement('div');
            resBody.style.cssText = 'padding:20px 24px;overflow-y:auto;flex:1';
            resBody.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-faint)">⏳ Prediciendo...</div>';
            resBox.appendChild(resBody);
            var resActions = document.createElement('div');
            resActions.style.cssText = 'display:flex;gap:12px;justify-content:end;padding:12px 24px;border-top:1px solid var(--border)';
            var resCloseBtn = document.createElement('button');
            resCloseBtn.textContent = 'Cerrar';
            resCloseBtn.style.cssText = 'padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;border:1.5px solid var(--border);background:var(--item-bg);color:var(--text-primary);cursor:pointer';
            resCloseBtn.onclick = function() { resOverlay.remove(); };
            resActions.appendChild(resCloseBtn);
            resBox.appendChild(resActions);
            resOverlay.appendChild(resBox);
            document.body.appendChild(resOverlay);
            resOverlay.addEventListener('click', function(e) { if (e.target === resOverlay) resOverlay.remove(); });
            document.addEventListener('keydown', function _resKey(e) { if (e.key === 'Escape' && resOverlay.parentNode) { resOverlay.remove(); document.removeEventListener('keydown', _resKey); } });
            try {
                var raw;
                if (isExpertMode) {
                    raw = document.getElementById('ml-predict-input').value.trim();
                } else {
                    raw = buildJsonFromForm();
                }
                if (!raw) { throw new Error('No hay datos para predecir'); }
                var parsed = JSON.parse(raw);
                var inputData = Array.isArray(parsed) ? parsed : [parsed];
                var columns = Object.keys(inputData[0]);
                var data = inputData.map(function(row) { return columns.map(function(c) { return row[c]; }); });
                var result = await _fetch('POST', '/api/ml/predict', {
                    model_id: modelId, data: data, columns: columns,
                });
                resBody.innerHTML = _renderPredictionsTable(result.predictions);
            } catch (e) {
                resBody.innerHTML = '<div style="text-align:center;padding:40px;color:#ef4444;font-size:14px;font-weight:500">❌ ' + escapeHtml(e.message) + '</div>';
            }
        };
        actions.appendChild(predictBtn);
        content.appendChild(actions);
        box.appendChild(content);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('ml-expert-toggle').onchange = function() {
            isExpertMode = this.checked;
            formContainer.style.display = isExpertMode ? 'none' : '';
            textarea.style.display = isExpertMode ? '' : 'none';
            previewLabel.style.display = isExpertMode ? 'none' : '';
            previewEl.style.display = isExpertMode ? 'none' : '';
            if (isExpertMode) {
                textarea.value = buildJsonFromForm();
            } else {
                updatePreview();
            }
        };

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) { overlay.remove(); cleanupPredictModal(); }
        });
        document.addEventListener('keydown', function _onKey(e) {
            if (e.key === 'Escape' && overlay.parentNode) {
                overlay.remove();
                document.removeEventListener('keydown', _onKey);
                cleanupPredictModal();
            }
        });

        function cleanupPredictModal() {
            var dl = document.getElementById('ml-feature-list');
            if (dl) dl.remove();
        }

        }

    async function detectAnomalies() {
        const results = document.getElementById('ml-results');
        if (!results) return;
        const datasetSelect = document.getElementById('ml-dataset-select');
        const datasetName = datasetSelect ? datasetSelect.value : '';
        if (!datasetName) { showToast('Selecciona un dataset primero', 'error'); return; }
        results.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-faint)">⏳ Detectando anomalías...</div>';
        try {
            var isWorksheet = datasetName.indexOf('__ws__:') === 0;
            var anomalyData, anomalyCols;
            if (isWorksheet) {
                var wsData = _getWorksheetData(datasetName.slice(7));
                if (!wsData || wsData.nrows === 0) throw new Error('La hoja de trabajo no tiene datos');
                anomalyData = wsData.data;
                anomalyCols = wsData.columns;
            } else {
                var preview = await _fetch('POST', '/api/ml/dataset/preview', { filename: datasetName });
                anomalyData = preview.preview;
                anomalyCols = preview.columns;
            }
            var data = await _fetch('POST', '/api/ml/anomaly', {
                data: anomalyData, columns: anomalyCols,
            });
            renderAnomalyResult(data);
        } catch (e) {
            results.innerHTML = '<div class="page-card"><div class="page-card-header" style="color:#ef4444">❌ Error</div>' +
                '<div class="page-card-body" style="padding:12px;font-size:12px">' + escapeHtml(e.message) + '</div></div>';
        }
    }

    function renderAnomalyResult(data) {
        const results = document.getElementById('ml-results');
        if (!results) return;
        var o = data.outliers || {};
        var q = data.quality || {};
        var im = data.imbalance || {};
        results.innerHTML = '<div class="page-card" style="margin-bottom:10px">' +
            '<div class="page-card-header" style="padding:8px 14px"><span class="page-card-icon">⚠️</span><span class="page-card-title" style="font-size:13px">Anomalías detectadas</span></div>' +
            '<div class="page-card-body" style="padding:10px 14px;font-size:11px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
            '<div style="padding:8px;background:var(--item-bg);border-radius:6px"><div style="font-weight:600;margin-bottom:3px;font-size:10px">🔍 Outliers</div>' +
            '<div style="font-size:10px">Método: ' + escapeHtml(o.method || '—') + '</div>' +
            '<div style="font-size:10px">Detectados: <strong>' + (o.n_outliers || 0) + '</strong></div></div>' +
            '<div style="padding:8px;background:var(--item-bg);border-radius:6px"><div style="font-weight:600;margin-bottom:3px;font-size:10px">📋 Calidad</div>' +
            '<div style="font-size:10px">Filas: ' + (q.n_rows || 0) + '</div>' +
            '<div style="font-size:10px">Columnas: ' + (q.n_cols || 0) + '</div>' +
            '<div style="font-size:10px">Nulos: ' + (q.missing_cells || 0) + ' (' + (typeof q.missing_pct === 'number' ? q.missing_pct.toFixed(1) : '—') + '%)</div></div>' +
            '</div>' +
            (im.recommendation ? '<div style="margin-top:8px;padding:8px;background:var(--item-bg);border-radius:6px;font-size:10px">' +
                '<div style="font-weight:600;margin-bottom:3px">⚖️ Imbalance</div>' +
                '<div>' + escapeHtml(im.recommendation) + '</div></div>' : '') +
            '</div></div>';
    }

    async function deleteModel(modelId) {
        if (!confirm('¿Eliminar modelo ' + modelId + '?')) return;
        try {
            await _fetch('DELETE', '/api/ml/models/' + modelId);
            refreshModels();
            document.getElementById('ml-results').innerHTML = buildEmptyState();
            showToast('🗑 Modelo eliminado', 'ok');
        } catch (e) {
            showToast('Error: ' + e.message, 'error');
        }
    }

    function escapeHtml(str) {
        if (str == null) return '';
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(String(str)));
        return div.innerHTML;
    }

    var _ALGO_INFO = {
        rf: {
            name: '🌳 Random Forest',
            desc: 'Ensemble de árboles de decisión. Cada árbol vota y se toma la mayoría (clasificación) o el promedio (regresión).',
            pros: [
                'Muy robusto ante outliers y datos faltantes',
                'No requiere escalado de features',
                'Maneja bien features numéricas y categóricas',
                'Difícil de overfittear (promedia múltiples árboles)',
                'Da importancia de features como output nativo',
            ],
            cons: [
                'Modelo grande en memoria (muchos árboles)',
                'Lento en inferencia comparado con modelos simples',
                'No extrapola bien en regresión (predicciones limitadas al rango de entrenamiento)',
                'Poco interpretable (caja negra con cientos de árboles)',
            ],
            bestFor: 'Clasificación y regresión con datos tabulares, datasets medianos (100-100K filas), cuando importa la robustez',
            considerations: 'Es el mejor punto de partida. No requiere preprocessing complejo. Ajustá n_estimators (100-500) y max_depth para controlar el balance velocidad/precisión.',
        },
        xgb: {
            name: '⚡ XGBoost',
            desc: 'Gradient boosting optimizado con árboles secuenciales. Cada árbol nuevo corrige errores del anterior.',
            pros: [
                'Estado del arte en datos tabulares (gana competencias Kaggle)',
                'Muy rápido comparado con otros boosting (paralelización nativa)',
                'Maneja valores nulos automáticamente',
                'Regularización incorporada (L1/L2) para evitar overfitting',
                'Soporta entrenamiento con GPU',
            ],
            cons: [
                'Muy sensible a hiperparámetros (learning_rate, max_depth, subsample)',
                'Requiere más tuning que Random Forest',
                'Puede overfittear si hay poco datos y muchas features',
                'Modelos grandes en disco si se guardan muchos árboles',
            ],
            bestFor: 'Datos tabulares con 1K-1M filas, competencias de ML, cuando la precisión máxima es prioridad',
            considerations: 'Requiere más tuning que RF. Ajustá learning_rate (0.01-0.3), max_depth (3-10), n_estimators (100-2000). Usá early_stopping_rounds para evitar overfitting.',
        },
        mlp: {
            name: '🧠 MLP Neural Net',
            desc: 'Red neuronal feed-forward con capas ocultas. Cada capa aprende representaciones no lineales.',
            pros: [
                'Captura relaciones no lineales complejas',
                'Escalable: funciona bien con muchos datos y muchas features',
                'Transfer learning: podés reusar capas pre-entrenadas',
                'Flexible en arquitectura (capas, dropout, activaciones)',
            ],
            cons: [
                'Requiere escalado de features (StandardScaler)',
                'Muchos hiperparámetros para tunear (capas, neuronas, learning rate, batch size)',
                'Lento de entrenar sin GPU en datasets grandes',
                'Poco interpretable (caja negra)',
                'Puede overfittear si hay poco datos',
            ],
            bestFor: 'Datasets medianos-grandes (5K+ filas), relaciones no lineales, cuando hay GPU disponible',
            considerations: 'SIEMPRE escalá los datos. Empezá con 1-2 capas ocultas de 64-128 neuronas. Usá ReLU, Adam optimizer, y early stopping. Con pocos datos (<1K filas), no es recomendable.',
        },
        logistic: {
            name: '📈 Logistic Regression',
            desc: 'Modelo lineal para clasificación binaria y multiclase. Calcula probabilidades usando la función sigmoide/softmax.',
            pros: [
                'Muy rápido de entrenar e inferir',
                'Altamente interpretable (coeficientes = peso de cada feature)',
                'Da probabilidades calibradas (no solo clases)',
                'Funciona bien con pocos datos',
                'No requiere mucho tuning',
            ],
            cons: [
                'Solo captura relaciones lineales entre features y target',
                'Requiere escalado de features',
                'Sensible a outliers',
                'Rinde mal con muchas features correlacionadas (multicolinealidad)',
                'No maneja interacciones complejas entre features',
            ],
            bestFor: 'Clasificación binaria, datasets pequeños (<10K filas), cuando la interpretabilidad es crítica (medicina, finanzas)',
            considerations: 'Escalá los datos. Verificá multicolinealidad. Empezá con C=1.0 y ajustá la regularización. Sirve como baseline para comparar con modelos más complejos.',
        },
        linear: {
            name: '📐 Linear Regression',
            desc: 'Modelo lineal para regresión. Predice valores continuos minimizando el error cuadrático medio.',
            pros: [
                'El más rápido de entrenar e inferir',
                'Muy interpretable (coeficientes = impacto de cada feature)',
                'No requiere tuning de hiperparámetros',
                'Funciona bien con datasets chicos (incluso <100 filas)',
                'Base teórica sólida, fácil de diagnosticar (R², residuos)',
            ],
            cons: [
                'SOLO para regresión (no clasificación)',
                'Asume relación lineal entre features y target',
                'Muy sensible a outliers',
                'Requiere escalado de features',
                'Rinde mal si la relación es no lineal o hay interacciones complejas',
            ],
            bestFor: 'Regresión simple con relaciones lineales, datasets chicos, baseline obligatorio para comparar',
            considerations: 'Verificá los supuestos: linealidad, independencia de errores, homocedasticidad, normalidad de residuos. Si los residuos muestran patrones, pasá a Random Forest o XGBoost.',
        },
    };

    function showAlgorithmInfo() {
        var sel = document.getElementById('ml-model-select');
        var key = sel ? sel.value : 'rf';
        var info = _ALGO_INFO[key];
        if (!info) return;

        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        var box = document.createElement('div');
        box.className = 'modal-box';
        box.style.cssText = 'max-width:480px';

        var title = document.createElement('div');
        title.className = 'modal-title';
        title.textContent = info.name;
        box.appendChild(title);

        var body = document.createElement('div');
        body.style.cssText = 'padding:8px 16px 16px;display:flex;flex-direction:column;gap:10px;font-size:11px;color:var(--text-primary)';

        var desc = document.createElement('div');
        desc.style.cssText = 'padding:8px;background:var(--item-bg);border-radius:6px;font-size:10px;color:var(--text-muted)';
        desc.textContent = info.desc;
        body.appendChild(desc);

        var prosHtml = '<div style="font-weight:600;font-size:10px;margin-bottom:4px">✅ Pros</div>';
        prosHtml += '<div style="display:flex;flex-direction:column;gap:2px">';
        info.pros.forEach(function(p) { prosHtml += '<div style="font-size:10px;padding:1px 0">• ' + p + '</div>'; });
        prosHtml += '</div>';

        var consHtml = '<div style="font-weight:600;font-size:10px;margin-bottom:4px;margin-top:6px">❌ Contras</div>';
        consHtml += '<div style="display:flex;flex-direction:column;gap:2px">';
        info.cons.forEach(function(c) { consHtml += '<div style="font-size:10px;padding:1px 0">• ' + c + '</div>'; });
        consHtml += '</div>';

        var detailsDiv = document.createElement('div');
        detailsDiv.style.cssText = 'padding:6px 8px;background:var(--item-bg);border-radius:6px';
        detailsDiv.innerHTML = prosHtml + consHtml;
        body.appendChild(detailsDiv);

        var best = document.createElement('div');
        best.style.cssText = 'padding:6px 8px;background:var(--item-bg);border-radius:6px;font-size:10px';
        best.innerHTML = '<span style="font-weight:600">🎯 Mejor para:</span> ' + info.bestFor;
        body.appendChild(best);

        var consider = document.createElement('div');
        consider.style.cssText = 'padding:6px 8px;background:rgba(124,106,247,0.08);border:1px solid rgba(124,106,247,0.2);border-radius:6px;font-size:10px';
        consider.innerHTML = '<span style="font-weight:600">💡 Consideraciones:</span> ' + info.considerations;
        body.appendChild(consider);

        var actions = document.createElement('div');
        actions.style.cssText = 'display:flex;gap:6px;justify-content:end';
        var closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-secondary';
        closeBtn.textContent = 'Cerrar';
        closeBtn.onclick = function() { overlay.remove(); };
        actions.appendChild(closeBtn);
        body.appendChild(actions);

        box.appendChild(body);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    return {
        init: init,
        buildLeftPanel: buildLeftPanel,
        buildRightPanel: buildRightPanel,
        refreshDatasets: refreshDatasets,
        refreshModels: refreshModels,
        train: train,
        predictFromModel: predictFromModel,
        detectAnomalies: detectAnomalies,
        deleteModel: deleteModel,
        onModelSelect: onModelSelect,
        predictSelectedModel: predictSelectedModel,
        deleteSelectedModel: deleteSelectedModel,
        showAlgorithmInfo: showAlgorithmInfo,
    };
})();
