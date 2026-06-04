// ========================================
// MLManager.js — StatAnalyzer Pro
// Machine Learning integration with Python service
// ========================================

const MLManager = (() => {
    let _models = [];
    let _datasets = [];
    let _selectedModelId = null;
    let _trainingHistory = [];
    let _keepAliveId = null;

    function _getMlApiUrl() {
        if (typeof ML_API_URL !== 'undefined') return ML_API_URL;
        return 'http://localhost:8000';
    }

    // Endpoints donde un 404 puede ser síntoma de cold start (ruta no registrada
    // todavía porque la máquina de Fly.io está arrancando). En endpoints de
    // recursos específicos (predict, train, etc.) el 404 es legítimo y debe
    // fallar rápido. Se compara path EXACTO, no prefijo, para no aplicar retry
    // a `/api/ml/models/modelo_001` cuando el recurso realmente no existe.
    const COLD_START_PATHS = new Set(['/api/ml/health', '/api/ml/datasets', '/api/ml/models']);

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
            const isColdStart = COLD_START_PATHS.has(path.split('?')[0]);
            const shouldRetry = (res.status === 503) ||
                                (res.status === 404 && isColdStart);
            if (shouldRetry && _retries > 0) {
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

    async function _warmUp() {
        const apiUrl = _getMlApiUrl();
        for (let i = 0; i < 5; i++) {
            try {
                const res = await fetch(apiUrl + '/api/ml/health');
                if (res.ok) return true;
            } catch (e) {}
            await new Promise(r => setTimeout(r, 2000));
        }
        return false;
    }

    function _startKeepAlive() {
        if (_keepAliveId) clearInterval(_keepAliveId);
        const apiUrl = _getMlApiUrl();
        _keepAliveId = setInterval(() => {
            fetch(apiUrl + '/api/ml/health').catch(() => {});
        }, 240000);
    }

    function _stopKeepAlive() {
        if (_keepAliveId) {
            clearInterval(_keepAliveId);
            _keepAliveId = null;
        }
    }

    // Liberar el interval al cerrar la pestaña o recargar
    window.addEventListener('beforeunload', _stopKeepAlive);
    window.addEventListener('pagehide', _stopKeepAlive);

    function buildLeftPanel() {
        return '<div class="left-panel" style="gap:8px;height:100%;display:flex;flex-direction:column;min-height:0">' +
            '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">🧠 ML Analysis</div>' +
            '<div class="info-section-body" style="padding:8px 12px;font-size:13px;color:var(--text-faint)">' +
            'Entrena modelos, haz predicciones y detecta anomalías.</div></div>' +
            '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">📊 Dataset</div>' +
            '<div class="info-section-body" style="padding:8px 12px;display:flex;flex-direction:column;gap:6px">' +
            '<select id="ml-dataset-select" style="width:100%;padding:9px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-panel);color:var(--text-primary);font-size:14px">' +
            '<option value="">— Cargando datasets —</option></select>' +
            '<div style="display:flex;gap:4px">' +
            '<button class="btn btn-secondary" style="flex:1;justify-content:center;font-size:13px;padding:8px 10px" onclick="MLManager.refreshDatasets()">🔄 Refrescar</button>' +
            '<button class="btn btn-secondary" style="justify-content:center;font-size:13px;padding:8px 10px" onclick="MLManager.uploadDataset()">📤 Subir</button></div>' +
            '<input type="file" id="ml-dataset-upload-input" accept=".csv" style="display:none" onchange="MLManager.handleUploadFile(event)">' +
            '</div></div>' +
            '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">🤖 Modelo <span style="cursor:help;font-size:14px;margin-left:auto" onclick="MLManager.showAlgorithmInfo()" title="Ver detalles del algoritmo">ⓘ</span></div>' +
            '<div class="info-section-body" style="padding:8px 12px;display:flex;flex-direction:column;gap:6px">' +
            '<select id="ml-model-select" style="width:100%;padding:9px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-panel);color:var(--text-primary);font-size:14px" onchange="MLManager.onModelChange()">' +
            '<option value="rf">🌳 Random Forest</option>' +
            '<option value="xgb">⚡ XGBoost</option>' +
            '<option value="mlp">🧠 MLP Neural Net</option>' +
            '<option value="logistic">📈 Logistic Regression</option>' +
            '<option value="linear">📐 Linear Regression</option>' +
            '</select>' +
            '<div style="margin-top:2px">' +
            '<div onclick="MLManager.toggleHP()" style="cursor:pointer;display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text-faint);padding:4px 0;user-select:none">' +
            '<span id="ml-hp-toggle">▶</span> ⚙️ Hiperparámetros</div>' +
            '<div id="ml-hp-panel" style="display:none;padding:6px 0 6px 10px;font-size:14px;border-left:2px solid var(--border)">' +
            '</div></div>' +
            '<label style="font-size:13px;color:var(--text-faint);display:flex;align-items:center;gap:6px;margin-top:2px">' +
            '<input type="checkbox" id="ml-tuning-enable" onchange="MLManager.onTuningToggle()" style="width:18px;height:18px"> Tuning automático' +
            '<select id="ml-tuning-strategy" style="display:none;flex:1;padding:7px 6px;border:1.5px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:13px">' +
            '<option value="grid">Grid Search</option>' +
            '<option value="random">Random Search</option></select></label>' +
            '<select id="ml-imbalance-select" style="width:100%;padding:8px 8px;border:1.5px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:13px;margin:2px 0">' +
            '<option value="none">⚖️ Sin balanceo</option>' +
            '<option value="smote">SMOTE (oversampling)</option>' +
            '<option value="adasyn">ADASYN (adaptive)</option></select>' +
            '<label style="font-size:13px;color:var(--text-faint);display:flex;align-items:center;gap:6px">' +
            '<input type="text" id="ml-target-input" placeholder="columna target" style="flex:1;padding:8px 8px;border:1.5px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:14px"> Target</label>' +
            '<label style="font-size:13px;color:var(--text-faint);display:flex;align-items:center;gap:6px">' +
            '<input type="text" id="ml-name-input" placeholder="ej: credit_scoring" style="flex:1;padding:8px 8px;border:1.5px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:14px;font-family:var(--font-mono)"> 🏷️ Nombre</label>' +
            '<div style="display:flex;gap:6px;margin-top:2px">' +
            '<button class="btn btn-primary" style="flex:1;justify-content:center;font-size:13px;padding:8px 10px" onclick="MLManager.train()">🎯 Entrenar</button>' +
            '<button class="btn btn-secondary" style="justify-content:center;font-size:13px;padding:8px 10px" onclick="MLManager.trainAll()" title="Entrena RF+XGB+MLP+Logistic">🏆 Todos</button></div>' +
            '</div></div>' +
            '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">💾 Modelos guardados</div>' +
            '<div class="info-section-body" style="padding:8px 12px;display:flex;flex-direction:column;gap:6px">' +
            '<select id="ml-models-select" style="width:100%;padding:9px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-panel);color:var(--text-primary);font-size:14px" onchange="MLManager.onModelSelect(this.value)">' +
            '<option value="">— Sin modelos —</option></select>' +
            '<div style="display:flex;gap:6px">' +
            '<button class="btn btn-primary" style="flex:1;justify-content:center;font-size:13px;padding:8px 10px" onclick="MLManager.predictSelectedModel()">🔮 Predecir</button>' +
            '<button class="btn btn-secondary" style="justify-content:center;font-size:13px;padding:8px 10px;color:#ef4444" onclick="MLManager.deleteSelectedModel()">🗑</button>' +
            '</div></div></div>' +
            '<div class="info-section" style="flex-shrink:0"><div class="info-section-header">⚠️ Anomalías</div>' +
            '<div class="info-section-body" style="padding:8px 12px">' +
            '<button class="btn btn-secondary" style="width:100%;justify-content:center;font-size:13px;padding:8px 10px" onclick="MLManager.detectAnomalies()">🔍 Detectar anomalías</button></div></div>' +
            '</div>';
    }

    function onModelChange() {
        _hpUpdatePanel();
    }

    function toggleHP() {
        _hpToggle();
    }

    function onTuningToggle() {
        var cb = document.getElementById('ml-tuning-enable');
        var strat = document.getElementById('ml-tuning-strategy');
        if (cb && strat) strat.style.display = cb.checked ? 'inline-block' : 'none';
        var panel = document.getElementById('ml-hp-panel');
        var toggle = document.getElementById('ml-hp-toggle');
        if (cb && cb.checked && panel && toggle) {
            panel.style.display = 'block';
            toggle.textContent = '▼';
        }
        _hpUpdatePanel();
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

    function _bindGuideEvents() {
        var ids = ['ml-name-input', 'ml-dataset-select', 'ml-model-select', 'ml-target-input', 'ml-tuning-enable', 'ml-imbalance-select'];
        ids.forEach(function(id) {
            var el = document.getElementById(id);
            if (!el) return;
            var evt = el.tagName === 'INPUT' ? 'input' : 'change';
            el.addEventListener(evt, _updateGuide);
        });
    }

    async function init() {
        const results = document.getElementById('ml-results');
        if (results) {
            results.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text-faint)"><div style="font-size:36px;margin-bottom:10px">⏳</div><div style="font-size:13px;font-weight:600">Despertando ML Service...</div><div style="font-size:11px;margin-top:4px">Puede tardar hasta 10 segundos en el primer arranque.</div></div>';
        }
        await _warmUp();
        if (results && !results.querySelector('.ml-loaded')) {
            results.innerHTML = _renderGuide();
        }
        _bindGuideEvents();
        refreshDatasets();
        refreshModels();
        _startKeepAlive();
    }

    async function uploadDataset() {
        var input = document.getElementById('ml-dataset-upload-input');
        if (input) input.click();
    }

    async function handleUploadFile(event) {
        var file = event.target && event.target.files && event.target.files[0];
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.csv')) {
            showToast('Solo archivos .csv', 'error');
            event.target.value = '';
            return;
        }
        var results = document.getElementById('ml-results');
        if (results) {
            results.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-faint)">📤 Subiendo <strong>' + escapeHtml(file.name) + '</strong>...</div>';
        }
        try {
            var formData = new FormData();
            formData.append('file', file);
            var apiUrl = window._ML_API_URL || 'https://sigmapro-ml.fly.dev';
            var token = (typeof Auth !== 'undefined' && Auth.getToken) ? Auth.getToken() : null;
            var headers = {};
            if (token) headers['Authorization'] = 'Bearer ' + token;
            var resp = await fetch(apiUrl + '/api/ml/dataset/upload', {
                method: 'POST', headers: headers, body: formData,
            });
            if (!resp.ok) {
                var errBody = await resp.text();
                throw new Error(errBody || 'Error al subir dataset');
            }
            var data = await resp.json();
            showToast('✅ Dataset "' + data.filename + '" subido (' + data.nrows + ' filas)', 'ok');
            await refreshDatasets();
            if (results) {
                results.innerHTML = '<div class="page-card"><div class="page-card-header">📤 Dataset subido</div>' +
                    '<div class="page-card-body" style="padding:12px;font-size:12px">' +
                    '<div><strong>Archivo:</strong> ' + escapeHtml(data.filename) + '</div>' +
                    '<div><strong>Filas:</strong> ' + data.nrows + '</div>' +
                    '<div><strong>Columnas:</strong> ' + data.ncols + '</div>' +
                    '<div><strong>Nombres:</strong> ' + escapeHtml((data.columns || []).join(', ')) + '</div></div></div>';
            }
        } catch (e) {
            if (results) {
                results.innerHTML = '<div class="page-card"><div class="page-card-header" style="color:#ef4444">❌ Error al subir</div>' +
                    '<div class="page-card-body" style="padding:12px;font-size:12px">' + escapeHtml(e.message) + '</div></div>';
            }
            showToast('Error: ' + e.message, 'error');
        }
        event.target.value = '';
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
            sel.innerHTML = '<option value="">— Error: ' + escapeHtml(e.message) + ' —</option>';
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
                var label = m.custom_name || m.id;
                if (m.model_key && !m.custom_name) label += ' · ' + m.model_key;
                if (m.saved_at) label += ' · ' + m.saved_at.slice(0, 10);
                opt.textContent = label;
                sel.appendChild(opt);
            });
        } catch (e) {
            sel.innerHTML = '<option value="">— Error: ' + escapeHtml(e.message) + ' —</option>';
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
            '<div class="page-card-header" style="padding:8px 14px"><span class="page-card-icon">💾</span><span class="page-card-title" style="font-size:13px">' + escapeHtml(model.custom_name || model.id) + '</span></div>' +
            '<div class="page-card-body" style="padding:10px 14px;font-size:11px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">' +
            (model.custom_name ? '<div style="grid-column:1/-1"><strong>ID interno:</strong> <code style="font-size:10px;color:var(--text-faint)">' + escapeHtml(model.id) + '</code></div>' : '') +
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

        var hpParams = _hpCollect();
        var tuningEnabled = document.getElementById('ml-tuning-enable') && document.getElementById('ml-tuning-enable').checked;
        var searchType = tuningEnabled ? (document.getElementById('ml-tuning-strategy') ? document.getElementById('ml-tuning-strategy').value : 'grid') : 'none';
        var imbalanceSelect = document.getElementById('ml-imbalance-select');
        var imbalanceStrategy = imbalanceSelect ? imbalanceSelect.value : 'none';
        var hasCustomHP = Object.keys(hpParams).length > 0;

        var extraParams = {
            search_type: searchType,
            search_params: null,
            imbalance_strategy: imbalanceStrategy,
        };
        if (hasCustomHP) {
            if (tuningEnabled) {
                var wrapped = {};
                Object.keys(hpParams).forEach(function(k) {
                    wrapped[k] = [hpParams[k]];
                });
                extraParams.search_params = wrapped;
            } else {
                extraParams.search_params = hpParams;
            }
        }

        async function _makeBody() {
            var body = {
                target: target, model_key: modelKey,
                n_bootstraps: 0,
                dataset_name: datasetName,
            };
            var nameEl = document.getElementById('ml-name-input');
            var customName = nameEl ? nameEl.value.trim() : '';
            if (customName) body.custom_name = customName + '_' + modelKey;
            Object.keys(extraParams).forEach(function(k) { body[k] = extraParams[k]; });
            if (isWorksheet) {
                var wsData = _getWorksheetData(sheetName);
                if (!wsData || wsData.nrows === 0) throw new Error('La hoja de trabajo "' + sheetName + '" no tiene datos');
                if (wsData.columns.indexOf(target) === -1) throw new Error('Columna target "' + target + '" no encontrada en la hoja');
                body.data = wsData.data;
                body.columns = wsData.columns;
            } else {
                body.data = [];
                body.columns = [];
            }
            return body;
        }

        var modelLabels = { rf: '🌳 Random Forest', xgb: '⚡ XGBoost', mlp: '🧠 MLP Neural Net', logistic: '📈 Logistic Regression', linear: '📉 Linear Regression' };
        var modelLabel = modelLabels[modelKey] || modelKey;
        results.innerHTML =
            '<div class="page-card">' +
            '<div class="page-card-header"><span class="page-card-icon">⏳</span><span class="page-card-title">Entrenando ' + modelLabel + '</span></div>' +
            '<div class="page-card-body" style="padding:16px 14px">' +
            '<div id="ml-progress-bar-container" style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:8px">' +
            '<div id="ml-progress-bar" style="height:100%;width:0%;background:linear-gradient(90deg,var(--accent),#10b981);border-radius:3px;transition:width 0.4s ease"></div></div>' +
            '<div id="ml-progress-text" style="font-size:11px;color:var(--text-faint);text-align:center">Iniciando...</div>' +
            '</div></div>';

        try {
            var body = await _makeBody();
            var taskResp;
            try {
                taskResp = await _fetch('POST', '/api/ml/train/async', body);
            } catch (e) {
                var data = await _fetch('POST', '/api/ml/train', body);
                _trainingHistory.push(data);
                renderTrainingResult(data);
                refreshModels();
                showToast('✅ Modelo ' + data.model_id + ' entrenado', 'ok');
                return;
            }
            var taskId = taskResp.task_id;
            var pollInterval = setInterval(async function() {
                try {
                    var taskData = await _fetch('GET', '/api/ml/tasks/' + taskId);
                    var task = taskData.task;
                    var pct = task.progress || 0;
                    var statusText = task.status_text || '';
                    var bar = document.getElementById('ml-progress-bar');
                    var txt = document.getElementById('ml-progress-text');
                    if (bar) bar.style.width = Math.min(pct, 100) + '%';
                    if (txt) txt.textContent = statusText + ' (' + Math.round(pct) + '%)';
                    if (task.status === 'done') {
                        clearInterval(pollInterval);
                        _trainingHistory.push(task.result);
                        renderTrainingResult(task.result);
                        refreshModels();
                        showToast('✅ Modelo ' + task.result.model_id + ' entrenado', 'ok');
                    } else if (task.status === 'failed') {
                        clearInterval(pollInterval);
                        throw new Error(task.error || 'Error desconocido en entrenamiento');
                    }
                } catch (e) {
                    clearInterval(pollInterval);
                    results.innerHTML = '<div class="page-card"><div class="page-card-header" style="color:#ef4444">❌ Error</div>' +
                        '<div class="page-card-body" style="padding:12px;font-size:12px">' + escapeHtml(e.message) + '</div></div>';
                    showToast('Error: ' + e.message, 'error');
                }
            }, 2000);
        } catch (e2) {
            results.innerHTML = '<div class="page-card"><div class="page-card-header" style="color:#ef4444">❌ Error</div>' +
                '<div class="page-card-body" style="padding:12px;font-size:12px">' + escapeHtml(e2.message) + '</div></div>';
            showToast('Error: ' + e2.message, 'error');
        }
    }

    function renderTrainingResult(data) {
        const results = document.getElementById('ml-results');
        if (!results) return;
        var meta = data.meta || {};
        var metrics = data.metrics || {};
        var html = '<div class="page-card" style="margin-bottom:10px">' +
            '<div class="page-card-header" style="padding:8px 14px"><span class="page-card-icon">🎯</span><span class="page-card-title" style="font-size:13px">' + escapeHtml(data.custom_name || data.model_id) + '</span></div>' +
            '<div class="page-card-body" style="padding:10px 14px;font-size:11px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px">' +
            (data.custom_name ? '<div style="grid-column:1/-1"><strong>ID:</strong> <code style="font-size:10px;color:var(--text-faint)">' + escapeHtml(data.model_id) + '</code></div>' : '') +
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

        var bestParams = data.best_params;
        if (bestParams && Object.keys(bestParams).length > 0) {
            html += '<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">' +
                '<div style="font-weight:600;margin-bottom:4px;font-size:10px">⭐ Mejores hiperparámetros</div>' +
                '<div style="display:flex;flex-wrap:wrap;gap:4px 12px;font-size:10px">';
            Object.keys(bestParams).forEach(function(k) {
                html += '<div><span style="color:var(--text-faint)">' + k.replace('model__', '') + ':</span> <strong>' + bestParams[k] + '</strong></div>';
            });
            html += '</div></div>';
        }

        var trainParams = data.train_params || {};
        var fe = trainParams.feature_engineering;
        if (fe && (fe.polynomial_degree || (fe.feature_selection && fe.feature_selection.method))) {
            html += '<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">' +
                '<div style="font-weight:600;margin-bottom:4px;font-size:10px">🧮 Ingeniería de características</div>' +
                '<div style="font-size:10px;color:var(--text-primary)">';
            if (fe.polynomial_degree) html += 'PolynomialFeatures (grado ' + fe.polynomial_degree + ')<br>';
            if (fe.feature_selection && fe.feature_selection.method) {
                html += 'Selección: ' + fe.feature_selection.method.toUpperCase() + ' (k=' + (fe.feature_selection.k || '?') + ')';
            }
            html += '</div></div>';
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

    function _renderGuide() {
        var ds = document.getElementById('ml-dataset-select');
        var model = document.getElementById('ml-model-select');
        var target = document.getElementById('ml-target-input');
        var tuning = document.getElementById('ml-tuning-enable');
        var dsVal = ds ? ds.value : '';
        var modelVal = model ? model.value : '';
        var targetVal = target ? target.value.trim() : '';
        var tuningOn = tuning && tuning.checked;
        var modelLabels = { rf: '🌳 Random Forest', xgb: '⚡ XGBoost', mlp: '🧠 MLP', logistic: '📈 Logistic', linear: '📐 Linear' };
        var modelLabel = modelLabels[modelVal] || modelVal;

        var steps = [
            { label: 'Dataset', done: dsVal !== '', detail: dsVal || 'Selecciona un dataset', hint: !dsVal ? 'Usa 📤 Subir si no tienes' : '' },
            { label: 'Modelo', done: dsVal !== '' && modelVal !== '', detail: dsVal ? modelLabel : '—', hint: dsVal && !modelVal ? 'Recomendado: 🌳 Random Forest' : '' },
            { label: 'Target', done: targetVal !== '', detail: targetVal || 'Escribe la columna objetivo', hint: dsVal && !targetVal ? 'Debe existir en el dataset' : '' },
            { label: 'Balanceo', done: dsVal && modelVal && targetVal, detail: '⚖️ Opcional', hint: dsVal && targetVal ? 'SMOTE si hay desbalance' : '' },
            { label: '¡Entrenar!', done: dsVal && modelVal && targetVal, detail: (dsVal && modelVal && targetVal) ? '✅ Todo listo' : 'Completa los pasos', hint: '' },
        ];
        var current = 0;
        for (var i = 0; i < steps.length; i++) { if (!steps[i].done) break; current = i + 1; }
        if (current >= steps.length) current = steps.length - 1;

        var html = '<div id="ml-guide" class="page-card" style="border-left:3px solid var(--accent)">' +
            '<div class="page-card-header" style="padding:8px 14px"><span class="page-card-icon">🧭</span><span class="page-card-title" style="font-size:13px">Asistente de entrenamiento</span></div>' +
            '<div class="page-card-body" style="padding:10px 14px;font-size:11px">';
        steps.forEach(function(s, i) {
            var isCurrent = i === current && !s.done;
            var icon = s.done ? '✅' : (isCurrent ? '👉' : '⬜');
            var color = s.done ? '#10b981' : (isCurrent ? 'var(--text-primary)' : 'var(--text-faint)');
            html += '<div style="display:flex;align-items:center;gap:6px;padding:3px 0;color:' + color + ';font-weight:' + (isCurrent ? '600' : '400') + '">' +
                '<span style="min-width:18px;font-size:11px">' + icon + '</span>' +
                '<span style="min-width:60px;font-weight:600;font-size:11px">' + s.label + '</span>' +
                '<span style="flex:1;font-size:11px">' + (s.detail || '—') + '</span>' +
                (s.hint ? '<span style="font-size:10px;color:var(--text-faint)">' + s.hint + '</span>' : '') +
                '</div>';
        });
        html += '</div></div>';
        return html;
    }

    function _updateGuide() {
        var results = document.getElementById('ml-results');
        var guide = document.getElementById('ml-guide');
        if (results && guide) {
            var ds = document.getElementById('ml-dataset-select');
            var model = document.getElementById('ml-model-select');
            var target = document.getElementById('ml-target-input');
            if (ds && model && target) results.innerHTML = _renderGuide();
        }
    }

    function _renderPredictionsTable(predictions, model, modelMetrics) {
        if (!predictions || !predictions.length) return '<div style="font-size:13px;color:var(--text-faint);padding:20px;text-align:center">Sin resultados</div>';
        var modelMeta = (model && model.meta) || {};
        modelMetrics = modelMetrics || (model && model.metrics) || {};
        var isBinary = modelMeta.problem_type === 'binary';

        var html = '<div style="display:flex;flex-direction:column;gap:16px;max-height:75vh;overflow-y:auto;padding-right:4px">';
        for (var i = 0; i < predictions.length; i++) {
            html += _predCard(predictions[i], i, isBinary);
        }
        html += '</div>';
        return html;
    }

    function _predConfColor(prob) {
        if (prob == null) return 'var(--text-faint)';
        var p = typeof prob === 'number' ? prob : parseFloat(prob);
        if (isNaN(p)) return 'var(--text-faint)';
        if (p >= 0.8) return '#10b981';
        if (p >= 0.6) return '#f59e0b';
        return '#ef4444';
    }

    function _predConfLabel(prob) {
        if (prob == null) return 'desconocida';
        var p = typeof prob === 'number' ? prob : parseFloat(prob);
        if (isNaN(p)) return 'desconocida';
        if (p >= 0.9) return 'muy alta';
        if (p >= 0.75) return 'alta';
        if (p >= 0.6) return 'media';
        if (p >= 0.4) return 'baja';
        return 'muy baja';
    }

    function _predMeterBar(pct, color, label) {
        if (pct == null) return '';
        var p = typeof pct === 'number' ? pct : parseFloat(pct);
        if (isNaN(p)) return '';
        var w = Math.round(p * 100);
        var bg = color || _predConfColor(p);
        return '<div style="display:flex;align-items:center;gap:10px">' +
            '<div style="flex:1;height:10px;background:var(--item-bg);border-radius:5px;overflow:hidden;border:1px solid var(--border)">' +
            '<div style="height:100%;width:' + w + '%;background:' + bg + ';border-radius:5px;transition:width 0.4s ease"></div></div>' +
            '<span style="font-size:14px;font-weight:700;color:' + bg + ';min-width:50px;text-align:right">' + w + '%</span></div>';
    }

    function _predBadge(label, color) {
        return '<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;background:' + color + '22;color:' + color + ';border:1px solid ' + color + '44">' + escapeHtml(label) + '</span>';
    }

    function _predFactorsHtml(p) {
        var favorRaw = p['factores_a_favor'];
        var contraRaw = p['factores_en_contra'];
        var favor = favorRaw ? (typeof favorRaw === 'string' ? favorRaw.split('; ') : [favorRaw]) : [];
        var contra = contraRaw ? (typeof contraRaw === 'string' ? contraRaw.split('; ') : [contraRaw]) : [];
        if (!favor.length && !contra.length) return '';

        function factorCard(items, icon, color) {
            if (!items.length || (items.length === 1 && items[0].indexOf('Sin factores') !== -1)) return '';
            var card = '<div style="flex:1;padding:10px 12px;background:var(--item-bg);border-radius:8px;border:1px solid var(--border)">' +
                '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:' + color + ';margin-bottom:6px">' + icon + ' ' + (icon === '✅' ? 'A favor' : 'En contra') + '</div>';
            items.forEach(function(item) {
                if (item.indexOf('Sin factores') !== -1) return;
                var clean = item.replace(/^[^:]+:\s*/, '');
                var parts = item.split(':');
                var featName = parts.length > 1 ? parts[0].trim() : '';
                var featVal = parts.length > 1 ? parts.slice(1).join(':').trim() : item.trim();
                var deltaMatch = featVal.match(/([+-]\d+\.?\d*)/);
                var delta = deltaMatch ? deltaMatch[1] : '';
                var deltaColor = delta.startsWith('+') ? '#10b981' : delta.startsWith('-') ? '#ef4444' : color;
                card += '<div style="display:flex;align-items:center;justify-content:space-between;padding:3px 0;font-size:11px;border-bottom:1px solid var(--border);margin-bottom:2px">' +
                    '<span style="font-weight:600;color:var(--text-primary)">' + escapeHtml(featName || clean) + '</span>' +
                    (delta ? '<span style="font-weight:700;color:' + deltaColor + ';font-size:12px">' + delta + '</span>' : '') +
                    '</div>';
            });
            card += '</div>';
            return card;
        }

        var favorCard = factorCard(favor, '✅', '#10b981');
        var contraCard = factorCard(contra, '❌', '#ef4444');
        if (!favorCard && !contraCard) return '';

        return '<div style="display:flex;gap:10px">' +
            (favorCard || '<div style="flex:1;padding:10px 12px;background:var(--item-bg);border-radius:8px;border:1px solid var(--border);font-size:11px;color:var(--text-faint)">✅ Sin factores destacados a favor</div>') +
            (contraCard || '<div style="flex:1;padding:10px 12px;background:var(--item-bg);border-radius:8px;border:1px solid var(--border);font-size:11px;color:var(--text-faint)">❌ Sin factores destacados en contra</div>') +
            '</div>';
    }

    function _predMetricsStrip(metrics) {
        var keys = Object.keys(metrics).filter(function(k) { return !['y_pred', 'y_proba'].includes(k); });
        if (!keys.length) return '';
        var html = '<div style="display:flex;gap:6px;flex-wrap:wrap">';
        keys.slice(0, 6).forEach(function(k) {
            var v = metrics[k];
            if (typeof v === 'number') v = v.toFixed(4);
            html += '<div style="padding:4px 8px;background:var(--item-bg);border-radius:4px;border:1px solid var(--border);font-size:10px;display:flex;flex-direction:column;align-items:center;gap:1px">' +
                '<span style="color:var(--text-faint);text-transform:uppercase;letter-spacing:0.3px">' + k + '</span>' +
                '<span style="font-weight:700;color:var(--accent);font-size:12px">' + v + '</span></div>';
        });
        html += '</div>';
        return html;
    }

    function _predCard(p, index, isBinary) {
        var predLabel = p['prediccion_legible'] || p['clase_predicha'] || p['prediccion'] || '';
        var prob = p['probabilidad_predicha'];
        var confLabel = p['nivel_confianza'] || _predConfLabel(prob);
        var confColor = _predConfColor(prob);
        var altLabel = p['clase_alternativa_legible'] || p['segunda_clase_legible'] || '';
        var altProb = p['probabilidad_alternativa'] ?? p['probabilidad_segunda_clase'];
        var margin = p['margen_decision'] ?? p['margen_top_2'];
        var explText = p['explicacion'] || p['explicacion_factores'] || '';
        var icLow = p['ic_lower_95'];
        var icHigh = p['ic_upper_95'];

        var cardStyle = 'padding:0;background:transparent;border:1px solid var(--border);border-radius:12px;overflow:hidden';

        var headerBg = prob != null ? (prob >= 0.6 ? 'linear-gradient(135deg, #065f4622, #10b98111)' : prob >= 0.4 ? 'linear-gradient(135deg, #92400e22, #f59e0b11)' : 'linear-gradient(135deg, #991b1b22, #ef444411)') : 'var(--item-bg)';
        var isPositive = prob != null && prob >= 0.5;

        var predDisplay = predLabel;
        var emoji = isPositive ? '✅' : '❌';
        var predStr = String(predLabel).toLowerCase();
        if (predStr === '1' || predStr === 'si' || predStr === 'true') {
            predDisplay = 'Positivo';
            emoji = '✅';
        } else if (predStr === '0' || predStr === 'no' || predStr === 'false') {
            predDisplay = 'Negativo';
            emoji = '❌';
        }

        var html = '<div style="' + cardStyle + '">';

        html += '<div style="background:' + headerBg + ';padding:16px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:16px">';
        html += '<div style="flex:1;display:flex;flex-direction:column;gap:2px">' +
            '<div style="font-size:24px;font-weight:800;color:' + confColor + '">' + emoji + ' ' + escapeHtml(predDisplay) + '</div>' +
            '<div style="font-size:12px;color:var(--text-muted)">Confianza: <strong style="color:' + confColor + '">' + (prob != null ? (prob * 100).toFixed(1) + '%' : '—') + '</strong> · ' +
            '<span style="color:var(--text-faint)">' + confLabel.toUpperCase() + '</span></div></div>';
        html += '<div style="text-align:right;font-size:10px;color:var(--text-faint);flex-shrink:0">' +
            '<div style="font-weight:600">#' + (index + 1) + '</div>' +
            '<div>' + (altLabel ? 'Alt: ' + escapeHtml(altLabel) : '') + '</div></div></div>';

        html += '<div style="padding:12px 18px;background:var(--bg-panel)">';

        if (prob != null) {
            html += '<div style="margin-bottom:10px">' + _predMeterBar(prob, confColor) + '</div>';
        }

        if (altLabel && altProb != null) {
            html += '<div style="display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--text-muted);padding:4px 0">' +
                '<span>Alternativa: <strong style="color:var(--text-primary)">' + escapeHtml(altLabel) + '</strong> (' + (altProb * 100).toFixed(1) + '%)</span>' +
                (margin != null ? '<span style="font-weight:600;color:' + confColor + '">Margen: +' + (margin * 100).toFixed(1) + ' pts</span>' : '') +
                '</div>';
        }

        if (icLow != null && icHigh != null) {
            html += '<div style="font-size:10px;color:var(--text-faint);padding:2px 0">Intervalo de confianza 95%: [' +
                (icLow * 100).toFixed(1) + '% – ' + (icHigh * 100).toFixed(1) + '%]</div>';
        }

        html += '</div>';

        var factorsHtml = _predFactorsHtml(p);
        if (factorsHtml) {
            html += '<div style="padding:10px 18px;border-top:1px solid var(--border);background:var(--bg-panel)">' +
                '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-faint);margin-bottom:6px">📊 Factores determinantes</div>' +
                factorsHtml + '</div>';
        }

        if (explText) {
            explText = typeof explText === 'string' ? explText : (explText[index] || explText[0] || '');
            html += '<div style="padding:12px 18px;border-top:1px solid var(--border);background:var(--bg-panel)">' +
                '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-faint);margin-bottom:4px">💬 Explicación</div>' +
                '<div style="font-size:12px;color:var(--text-primary);line-height:1.6;padding:8px 10px;background:var(--item-bg);border-radius:6px;border-left:3px solid ' + confColor + '">' +
                escapeHtml(explText) + '</div></div>';
        }

        html += '<div style="padding:10px 18px;border-top:1px solid var(--border);background:var(--bg-panel);display:flex;gap:8px;flex-wrap:wrap;font-size:11px">';
        var valKeys = Object.keys(p).filter(function(k) {
            return !['index', 'prediccion', 'prediccion_legible', 'clase_predicha', 'probabilidad_predicha',
                     'nivel_confianza', 'clase_alternativa', 'clase_alternativa_legible',
                     'probabilidad_alternativa', 'margen_decision', 'explicacion', 'explicacion_factores',
                     'factores_a_favor', 'factores_en_contra', 'segunda_clase', 'segunda_clase_legible',
                     'probabilidad_segunda_clase', 'margen_top_2', 'ic_lower_95', 'ic_upper_95'].includes(k);
        });
        valKeys.forEach(function(k) {
            var v = p[k];
            if (v === null || v === undefined) return;
            if (typeof v === 'number') v = v.toFixed(4);
            html += '<div style="padding:3px 8px;background:var(--item-bg);border-radius:4px;font-size:10px"><span style="color:var(--text-faint)">' + k + ':</span> <strong>' + escapeHtml(String(v)) + '</strong></div>';
        });
        html += '</div></div>';

        return html;
    }

    function predictFromModel(modelId) {
        var model = null;
        for (var i = 0; i < _models.length; i++) {
            if (_models[i].id === modelId) { model = _models[i]; break; }
        }
        var isExpertMode = false;
        var meta = (model && model.meta) || {};
        var catFeatures = meta.cat_features || [];
        var catValues = meta.cat_values || {};
        var baselines = meta.feature_baselines || {};
        var allFeatures = (meta.num_features || []).concat(catFeatures);
        var rows = allFeatures.length ? allFeatures.map(function(f) { return { col: f, val: baselines[f] !== undefined && baselines[f] !== null ? String(baselines[f]) : '' }; }) : [{ col: '', val: '' }];

        function buildJsonFromForm() {
            var obj = {};
            allFeatures.forEach(function(f) {
                var row = rows.filter(function(r) { return r.col === f; })[0];
                var v = row ? row.val : '';
                if (catFeatures.indexOf(f) !== -1) {
                    obj[f] = v === '' ? null : v;
                } else {
                    obj[f] = v === '' ? 0 : Number(v);
                    if (isNaN(obj[f])) obj[f] = v;
                }
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
        title.innerHTML = '<span>🔮 Predecir con ' + escapeHtml(modelId) + '</span>';
        var toggleLabel = document.createElement('label');
        toggleLabel.style.cssText = 'font-size:10px;display:flex;align-items:center;gap:4px;cursor:pointer;color:var(--text-faint);user-select:none';
        var expertToggle = document.createElement('input');
        expertToggle.type = 'checkbox';
        expertToggle.className = 'ml-expert-toggle';
        toggleLabel.appendChild(expertToggle);
        toggleLabel.appendChild(document.createTextNode(' Modo experto'));
        title.appendChild(toggleLabel);
        box.appendChild(title);

        var content = document.createElement('div');
        content.style.cssText = 'padding:20px 24px;display:flex;flex-direction:column;gap:16px;max-height:80vh;overflow-y:auto';

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
        formContainer.className = 'ml-predict-form';
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
            var listId = 'ml-feature-list-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
            var dl = document.createElement('datalist');
            dl.id = listId;
            allFeatures.forEach(function(f) {
                var opt = document.createElement('option');
                opt.value = f;
                dl.appendChild(opt);
            });
            document.body.appendChild(dl);
            formContainer._datalistId = listId;
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
                var isCat = catFeatures.indexOf(r.col) !== -1 && catValues[r.col] && catValues[r.col].length > 0;
                var valInput;
                if (isCat) {
                    valInput = document.createElement('select');
                    valInput.style.cssText = 'width:160px;padding:7px 10px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:13px';
                    var emptyOpt = document.createElement('option');
                    emptyOpt.value = '';
                    emptyOpt.textContent = '— Selecciona —';
                    valInput.appendChild(emptyOpt);
                    catValues[r.col].forEach(function(optVal) {
                        var opt = document.createElement('option');
                        opt.value = optVal;
                        opt.textContent = optVal;
                        if (optVal === r.val) opt.selected = true;
                        valInput.appendChild(opt);
                    });
                    valInput.onchange = function() { r.val = valInput.value; updatePreview(); };
                } else {
                    valInput = document.createElement('input');
                    valInput.type = 'number';
                    valInput.step = 'any';
                    valInput.placeholder = '0';
                    valInput.style.cssText = 'width:140px;padding:7px 10px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:13px;font-weight:500';
                    valInput.oninput = function() { r.val = valInput.value; updatePreview(); };
                }
                if (valInput.value === undefined && r.val) valInput.value = r.val;
                if (!isCat) valInput.value = r.val;
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
        textarea.className = 'ml-predict-input';
        textarea.placeholder = 'Array de objetos con las columnas del modelo';
        textarea.style.cssText = 'width:100%;min-height:140px;padding:10px;border:1.5px solid var(--border);border-radius:8px;background:var(--bg-primary);color:var(--text-primary);font-size:12px;font-family:monospace;resize:vertical;display:none';
        textarea.value = JSON.stringify([{ "columna": 0 }], null, 2);
        content.appendChild(textarea);

        var previewLabel = document.createElement('div');
        previewLabel.style.cssText = 'font-size:11px;font-weight:600;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.5px';
        previewLabel.textContent = '📄 JSON generado:';
        content.appendChild(previewLabel);

        var previewEl = document.createElement('div');
        previewEl.className = 'ml-preview-json';
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
            resOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000';
            var resBox = document.createElement('div');
            resBox.style.cssText = 'width:92vw;max-width:1300px;max-height:90vh;background:var(--bg-panel);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.5);overflow:hidden;display:flex;flex-direction:column';
            var resTitle = document.createElement('div');
            resTitle.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:14px 20px;font-size:14px;font-weight:700;border-bottom:1px solid var(--border);background:var(--item-bg);flex-shrink:0';
            resTitle.innerHTML = '<span>🔮 Resultado de predicción con <span style="color:var(--accent)">' + escapeHtml(modelId) + '</span></span>';
            var closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = 'border:none;background:rgba(255,255,255,0.05);cursor:pointer;font-size:16px;color:var(--text-faint);padding:6px 12px;border-radius:8px;transition:all 0.15s';
            closeBtn.onmouseover = function() { this.style.background = 'rgba(255,255,255,0.1)'; this.style.color = '#fff'; };
            closeBtn.onmouseout = function() { this.style.background = 'rgba(255,255,255,0.05)'; this.style.color = 'var(--text-faint)'; };
            closeBtn.onclick = function() { resOverlay.remove(); };
            resTitle.appendChild(closeBtn);
            resBox.appendChild(resTitle);
            var resBody = document.createElement('div');
            resBody.style.cssText = 'padding:20px 22px;overflow-y:auto;flex:1';
            resBody.innerHTML = '<div style="text-align:center;padding:60px 40px;color:var(--text-faint)"><div style="font-size:36px;margin-bottom:12px">⏳</div><div style="font-size:14px;font-weight:600">Procesando predicción...</div><div style="font-size:11px;margin-top:4px">Consultando al modelo</div></div>';
            resBox.appendChild(resBody);
            var resActions = document.createElement('div');
            resActions.style.cssText = 'display:flex;gap:10px;justify-content:end;padding:10px 20px;border-top:1px solid var(--border);flex-shrink:0';
            var resNewBtn = document.createElement('button');
            resNewBtn.innerHTML = '🔮 Nueva predicción';
            resNewBtn.style.cssText = 'padding:7px 16px;border-radius:8px;font-size:12px;font-weight:600;border:1.5px solid var(--border);background:var(--item-bg);color:var(--text-primary);cursor:pointer;transition:all 0.15s';
            resNewBtn.onmouseover = function() { this.style.background = 'var(--accent)'; this.style.color = '#fff'; this.style.borderColor = 'var(--accent)'; };
            resNewBtn.onmouseout = function() { this.style.background = 'var(--item-bg)'; this.style.color = 'var(--text-primary)'; this.style.borderColor = 'var(--border)'; };
            resNewBtn.onclick = function() { resOverlay.remove(); };
            resActions.appendChild(resNewBtn);
            var resCloseBtn = document.createElement('button');
            resCloseBtn.textContent = '✕ Cerrar';
            resCloseBtn.style.cssText = 'padding:7px 16px;border-radius:8px;font-size:12px;font-weight:600;border:1.5px solid var(--border);background:var(--bg-panel);color:var(--text-faint);cursor:pointer;transition:all 0.15s';
            resCloseBtn.onmouseover = function() { this.style.color = 'var(--text-primary)'; };
            resCloseBtn.onmouseout = function() { this.style.color = 'var(--text-faint)'; };
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
                    raw = textarea.value.trim();
                } else {
                    raw = buildJsonFromForm();
                }
                if (!raw) { throw new Error('No hay datos para predecir'); }
                var parsed = JSON.parse(raw);
                var inputData = Array.isArray(parsed) ? parsed : [parsed];
                if (!inputData.length) { throw new Error('El array de datos está vacío. Agrega al menos una fila.'); }
                if (inputData[0] == null || typeof inputData[0] !== 'object') { throw new Error('Cada fila debe ser un objeto con las columnas del modelo.'); }
                var columns = Object.keys(inputData[0]);
                if (!columns.length) { throw new Error('El objeto no tiene columnas. Define al menos una feature.'); }
                var rows = inputData.map(function(row) { return columns.map(function(c) { return row[c]; }); });
                var result = await _fetch('POST', '/api/ml/predict', {
                    model_id: modelId, data: rows, columns: columns,
                });
                var modelMetrics_ = (model && model.metrics) || {};
                var resultHtml = _renderPredictionsTable(result.predictions, model, modelMetrics_);
                var metricsHtml = _predMetricsStrip(modelMetrics_);
                if (metricsHtml) {
                    resultHtml = '<div style="margin-bottom:12px;padding:10px 14px;background:var(--bg-panel);border:1px solid var(--border);border-radius:8px">' +
                        '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-faint);margin-bottom:6px">📈 Precisión del modelo</div>' +
                        metricsHtml + '</div>' + resultHtml;
                }
                resBody.innerHTML = resultHtml;
                cleanupPredictModal();
            } catch (e) {
                resBody.innerHTML = '<div style="text-align:center;padding:40px;color:#ef4444;font-size:14px;font-weight:500">❌ ' + escapeHtml(e.message) + '</div>';
            }
        };
        actions.appendChild(predictBtn);
        content.appendChild(actions);
        box.appendChild(content);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        expertToggle.onchange = function() {
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
            if (formContainer._datalistId) {
                var dl = document.getElementById(formContainer._datalistId);
                if (dl) dl.remove();
                formContainer._datalistId = null;
            }
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

    // ════════════════════════════════════════════════════════════════
    //  FASE 2 — HIPERPARÁMETROS Y COMPARACIÓN MULTI-MODELO
    // ════════════════════════════════════════════════════════════════

    var _HP_DEFAULTS = {
        rf: {
            n_estimators: 200, max_depth: 15, min_samples_split: 3, min_samples_leaf: 2,
        },
        xgb: {
            n_estimators: 200, learning_rate: 0.05, max_depth: 6, subsample: 0.8,
        },
        mlp: {
            hidden_layer_sizes: '64,32,16', alpha: 0.001, learning_rate_init: 0.001,
        },
        logistic: {},
        linear: {},
    };

    function _hpGetModelKey() {
        var sel = document.getElementById('ml-model-select');
        return sel ? sel.value : 'rf';
    }

    function _hpFieldsHtml(modelKey) {
        var defaults = _HP_DEFAULTS[modelKey] || {};
        var keys = Object.keys(defaults);
        if (keys.length === 0) return '<div style="font-size:13px;color:var(--text-faint);padding:4px 0">No requiere hiperparámetros.</div>';
        var tuningEl = document.getElementById('ml-tuning-enable');
        var tuningOn = tuningEl && tuningEl.checked;
        var hint = tuningOn ? ' (<span style="color:var(--accent)">separados por coma</span>)' : '';
        var html = '';
        keys.forEach(function(k) {
            var v = defaults[k];
            var label = k.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
            var input;
            if (k === 'hidden_layer_sizes') {
                input = '<input type="text" id="ml-hp-' + k + '" value="' + v + '" style="width:100px;padding:7px 6px;border:1.5px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:14px;text-align:right">';
            } else if (typeof v === 'number' && v < 1) {
                input = '<input type="text" id="ml-hp-' + k + '" value="' + v + '" style="width:90px;padding:7px 6px;border:1.5px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:14px;text-align:right">';
            } else {
                var max = k === 'n_estimators' ? 1000 : k === 'max_depth' ? 50 : 100;
                input = '<input type="text" id="ml-hp-' + k + '" value="' + v + '" style="width:90px;padding:7px 6px;border:1.5px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:14px;text-align:right">';
            }
            html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0"><span style="font-size:13px;color:var(--text-faint)">' + label + hint + '</span>' + input + '</div>';
        });
        return html;
    }

    function _hpCollect() {
        var modelKey = _hpGetModelKey();
        var defaults = _HP_DEFAULTS[modelKey] || {};
        var tuningEl = document.getElementById('ml-tuning-enable');
        var tuningOn = tuningEl && tuningEl.checked;
        var params = {};
        Object.keys(defaults).forEach(function(k) {
            var el = document.getElementById('ml-hp-' + k);
            if (!el) return;
            var raw = el.value.trim();
            if (k === 'hidden_layer_sizes') {
                var nums = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n) && n > 0; });
                if (nums.length) params[k] = nums;
            } else {
                var parts = raw.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s !== ''; });
                if (parts.length > 1 || tuningOn) {
                    var nums = parts.map(function(s) { return parseFloat(s); }).filter(function(n) { return !isNaN(n); });
                    if (nums.length === 1) params[k] = nums[0];
                    else if (nums.length > 1) params[k] = nums;
                } else {
                    var n = parseFloat(raw);
                    if (!isNaN(n)) params[k] = n;
                }
            }
        });
        return params;
    }

    function _hpToggle() {
        var panel = document.getElementById('ml-hp-panel');
        var toggle = document.getElementById('ml-hp-toggle');
        if (!panel || !toggle) return;
        var isOpen = panel.style.display !== 'none';
        if (!isOpen) _hpUpdatePanel();
        panel.style.display = isOpen ? 'none' : 'block';
        toggle.textContent = isOpen ? '▶' : '▼';
    }

    function _hpUpdatePanel() {
        var panel = document.getElementById('ml-hp-panel');
        if (!panel) return;
        var mk = _hpGetModelKey();
        panel.innerHTML = _hpFieldsHtml(mk);
    }

    function _hpReset() {
        var panel = document.getElementById('ml-hp-panel');
        if (!panel) return;
        var mk = _hpGetModelKey();
        panel.style.display = 'none';
        var toggle = document.getElementById('ml-hp-toggle');
        if (toggle) toggle.textContent = '▶';
        panel.innerHTML = _hpFieldsHtml(mk);
        var cb = document.getElementById('ml-tuning-enable');
        if (cb) cb.checked = false;
        var strat = document.getElementById('ml-tuning-strategy');
        if (strat) strat.style.display = 'none';
    }

    async function trainAll() {
        var results = document.getElementById('ml-results');
        if (!results) return;
        var datasetSelect = document.getElementById('ml-dataset-select');
        var targetInput = document.getElementById('ml-target-input');
        var datasetName = datasetSelect ? datasetSelect.value : '';
        var target = targetInput ? targetInput.value.trim() : '';
        if (!datasetName) { showToast('Selecciona un dataset', 'error'); return; }
        if (!target) { showToast('Ingresa el nombre de la columna target', 'error'); return; }

        var models = ['rf', 'xgb', 'mlp', 'logistic'];
        var labels = { rf: '🌳 Random Forest', xgb: '⚡ XGBoost', mlp: '🧠 MLP Neural Net', logistic: '📈 Logistic Regression' };
        var allResults = [];
        var isWorksheet = datasetName.indexOf('__ws__:') === 0;
        var sheetName = isWorksheet ? datasetName.slice(7) : null;

        results.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-faint)">🏆 Entrenando todos los modelos...</div>' +
            '<div id="ml-train-all-progress" style="display:flex;flex-direction:column;gap:6px;padding:10px 0"></div>';

        var progressDiv = document.getElementById('ml-train-all-progress');
        var modelBarIds = {};

        for (var i = 0; i < models.length; i++) {
            var mk = models[i];
            modelBarIds[mk] = 'ml-ta-progress-' + mk;
            var row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 8px;font-size:10px';
            row.innerHTML = '<span style="min-width:120px">' + labels[mk] + '</span>' +
                '<div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden">' +
                '<div id="' + modelBarIds[mk] + '" style="height:100%;width:0%;background:linear-gradient(90deg,var(--accent),#10b981);border-radius:2px;transition:width 0.3s ease"></div></div>' +
                '<span style="color:var(--text-faint);min-width:80px;text-align:right" id="ml-ts-' + mk + '">⏳ esperando...</span>';
            progressDiv.appendChild(row);
        }

        async function _trainOneModel(mk) {
            var statusEl = document.getElementById('ml-ts-' + mk);
            var barEl = document.getElementById(modelBarIds[mk]);
            try {
                var body = {
                    data: [], columns: [],
                    target: target, model_key: mk,
                    n_bootstraps: 0,
                    dataset_name: datasetName,
                    search_type: 'none',
                    imbalance_strategy: 'none',
                };
                if (isWorksheet) {
                    var wsData = _getWorksheetData(sheetName);
                    if (wsData && wsData.nrows > 0) {
                        body.data = wsData.data;
                        body.columns = wsData.columns;
                    }
                }
                var taskResp = await _fetch('POST', '/api/ml/train/async', body);
                var taskId = taskResp.task_id;
                return await new Promise(function(resolve, reject) {
                    var pi = setInterval(async function() {
                        try {
                            var td = await _fetch('GET', '/api/ml/tasks/' + taskId);
                            var t = td.task;
                            if (barEl) barEl.style.width = Math.min(t.progress || 0, 100) + '%';
                            if (statusEl) statusEl.textContent = (t.progress || 0) + '%';
                            if (t.status === 'done') {
                                clearInterval(pi);
                                if (barEl) barEl.style.width = '100%';
                                if (statusEl) statusEl.innerHTML = '✅ <strong>' + (t.result.metrics ? _hpBestMetric(t.result.metrics, t.result.meta) : 'OK') + '</strong>';
                                resolve({ model_key: mk, label: labels[mk], data: t.result });
                            } else if (t.status === 'failed') {
                                clearInterval(pi);
                                if (statusEl) statusEl.innerHTML = '❌ error';
                                reject(new Error(t.error || 'Error'));
                            }
                        } catch (e) {
                            clearInterval(pi);
                            if (statusEl) statusEl.innerHTML = '❌ ' + escapeHtml(e.message);
                            reject(e);
                        }
                    }, 2000);
                });
            } catch (e) {
                try {
                    var data = await _fetch('POST', '/api/ml/train', body);
                    if (statusEl) statusEl.innerHTML = '✅ <strong>' + (data.metrics ? _hpBestMetric(data.metrics, data.meta) : 'OK') + '</strong>';
                    if (barEl) barEl.style.width = '100%';
                    return { model_key: mk, label: labels[mk], data: data };
                } catch (e2) {
                    if (statusEl) statusEl.innerHTML = '❌ ' + escapeHtml(e2.message);
                    throw e2;
                }
            }
        }

        for (var i = 0; i < models.length; i++) {
            try {
                var result = await _trainOneModel(models[i]);
                allResults.push(result);
            } catch (e) {
                // error already shown in per-model status
            }
        }

        refreshModels();
        _hpRenderComparisonTable(allResults);
    }

    function _hpBestMetric(metrics, meta) {
        if (!metrics) return '—';
        var keys = Object.keys(metrics).filter(function(k) { return !['y_pred', 'y_proba'].includes(k); });
        if (keys.length === 0) return '—';
        var preferred = meta && meta.problem_type === 'binary' ? ['auc_roc', 'accuracy', 'f1_score'] :
                        meta && meta.problem_type === 'regression' ? ['r2_score', 'rmse', 'mae'] :
                        ['accuracy', 'f1_weighted'];
        for (var p = 0; p < preferred.length; p++) {
            if (metrics[preferred[p]] !== undefined && metrics[preferred[p]] !== null) {
                var v = metrics[preferred[p]];
                return typeof v === 'number' ? v.toFixed(4) : String(v);
            }
        }
        var v = metrics[keys[0]];
        return typeof v === 'number' ? v.toFixed(4) : String(v);
    }

    function _hpPrimaryMetric(meta) {
        if (!meta) return 'accuracy';
        if (meta.problem_type === 'binary') return 'auc_roc';
        if (meta.problem_type === 'regression') return 'r2_score';
        return 'accuracy';
    }

    function _hpMetricValue(metrics, key) {
        if (!metrics || !key) return null;
        var v = metrics[key];
        return (v !== undefined && v !== null) ? v : null;
    }

    function _hpRenderComparisonTable(allResults) {
        var results = document.getElementById('ml-results');
        if (!results) return;
        if (allResults.length === 0) {
            results.innerHTML = '<div class="page-card"><div class="page-card-header" style="color:#ef4444">❌ Error</div><div class="page-card-body" style="padding:12px;font-size:12px">No se pudo entrenar ningún modelo.</div></div>';
            return;
        }
        var meta = allResults[0].data && allResults[0].data.meta || {};
        var primaryKey = _hpPrimaryMetric(meta);
        var higherIsBetter = primaryKey !== 'rmse';

        var bestModel = null;
        var bestVal = higherIsBetter ? -Infinity : Infinity;
        allResults.forEach(function(r) {
            var metrics = r.data && r.data.metrics || {};
            var v = _hpMetricValue(metrics, primaryKey);
            if (v !== null) {
                if (higherIsBetter ? v > bestVal : v < bestVal) {
                    bestVal = v;
                    bestModel = r;
                }
            }
        });

        var allMetricKeys = new Set();
        allResults.forEach(function(r) {
            if (r.data && r.data.metrics) {
                Object.keys(r.data.metrics).forEach(function(k) {
                    if (k !== 'y_pred' && k !== 'y_proba') allMetricKeys.add(k);
                });
            }
        });
        var metricOrder = meta.problem_type === 'binary' ?
            ['accuracy', 'precision', 'recall', 'f1_score', 'auc_roc'] :
            meta.problem_type === 'regression' ?
            ['r2_score', 'rmse', 'mae'] :
            ['accuracy', 'f1_weighted'];
        var sortedKeys = metricOrder.filter(function(k) { return allMetricKeys.has(k); });
        allMetricKeys.forEach(function(k) {
            if (sortedKeys.indexOf(k) === -1) sortedKeys.push(k);
        });

        var html = '<div class="page-card"><div class="page-card-header" style="padding:8px 14px"><span class="page-card-icon">🏆</span><span class="page-card-title" style="font-size:13px">Comparación Multi-Modelo</span></div>' +
            '<div class="page-card-body" style="padding:10px 14px;font-size:10px;overflow-x:auto">' +
            '<div style="font-size:9px;color:var(--text-faint);margin-bottom:8px">Dataset: <strong>' + escapeHtml(meta.target_col || '—') + '</strong> · Tipo: <strong>' + (meta.problem_type || '—') + '</strong></div>' +
            '<table style="width:100%;border-collapse:collapse;font-size:10px"><thead><tr>' +
            '<th style="text-align:left;padding:4px 6px;border-bottom:1px solid var(--border);color:var(--text-faint);font-weight:600">Modelo</th>';

        sortedKeys.forEach(function(k) {
            var isPrimary = k === primaryKey;
            html += '<th style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);color:var(--text-faint);font-weight:600;' + (isPrimary ? 'text-decoration:underline' : '') + '">' + k + '</th>';
        });

        html += '</tr></thead><tbody>';

        allResults.forEach(function(r) {
            var isBest = r === bestModel;
            var metrics = r.data && r.data.metrics || {};
            html += '<tr style="' + (isBest ? 'background:rgba(34,197,94,0.08)' : '') + '">' +
                '<td style="padding:5px 6px;border-bottom:1px solid var(--border);font-weight:' + (isBest ? '700' : '400') + '">' +
                (isBest ? '⭐ ' : '') + r.label + '</td>';
            sortedKeys.forEach(function(k) {
                var v = _hpMetricValue(metrics, k);
                var display = v !== null ? (typeof v === 'number' ? v.toFixed(4) : String(v)) : '—';
                html += '<td style="text-align:right;padding:5px 6px;border-bottom:1px solid var(--border);' +
                    (isBest ? 'color:var(--accent);font-weight:700' : '') + '">' + display + '</td>';
            });
            html += '</tr>';
        });

        html += '</tbody></table>';

        if (bestModel && bestModel.data && bestModel.data.best_params && Object.keys(bestModel.data.best_params).length > 0) {
            html += '<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">' +
                '<div style="font-weight:600;font-size:10px;margin-bottom:4px">⭐ Mejores parámetros (' + bestModel.label + ')</div>' +
                '<div style="display:flex;flex-wrap:wrap;gap:4px 12px;font-size:10px">';
            Object.keys(bestModel.data.best_params).forEach(function(k) {
                html += '<div><span style="color:var(--text-faint)">' + k.replace('model__', '') + ':</span> <strong>' + bestModel.data.best_params[k] + '</strong></div>';
            });
            html += '</div></div>';
        }

        html += '<div style="margin-top:10px;display:flex;gap:6px;justify-content:center">' +
            '<button class="btn btn-primary" style="font-size:10px;padding:4px 12px" onclick="MLManager.train()">🎯 Entrenar uno</button>' +
            '<button class="btn btn-secondary" style="font-size:10px;padding:4px 12px" onclick="MLManager.trainAll()">🔄 Re-entrenar todos</button>' +
            '</div></div></div>';
        results.innerHTML = html;
    }

    return {
        init: init,
        buildLeftPanel: buildLeftPanel,
        buildRightPanel: buildRightPanel,
        refreshDatasets: refreshDatasets,
        refreshModels: refreshModels,
        train: train,
        trainAll: trainAll,
        toggleHP: toggleHP,
        onModelChange: onModelChange,
        onTuningToggle: onTuningToggle,
        predictFromModel: predictFromModel,
        detectAnomalies: detectAnomalies,
        deleteModel: deleteModel,
        onModelSelect: onModelSelect,
        predictSelectedModel: predictSelectedModel,
        deleteSelectedModel: deleteSelectedModel,
        showAlgorithmInfo: showAlgorithmInfo,
        uploadDataset: uploadDataset,
        handleUploadFile: handleUploadFile,
    };
})();
