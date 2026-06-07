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

    function _filterMetricsKeys(metrics) {
        return Object.keys(metrics).filter(function(k) { return k !== 'y_pred' && k !== 'y_proba'; });
    }

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
        var mlApiKey = (typeof Auth !== 'undefined' && Auth.getMlApiKey) ? Auth.getMlApiKey() : null;
        if (mlApiKey) opts.headers['X-API-Key'] = mlApiKey;
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
                const port = new URL(apiUrl).port || (apiUrl.startsWith('https') ? '443' : '80');
                throw new Error('ML Service no disponible (' + apiUrl + '). Asegúrate de que el servicio esté corriendo y sea accesible desde ' + apiUrl);
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
            '<label style="font-size:13px;color:var(--text-faint);display:flex;align-items:center;gap:6px;margin-top:1px">' +
            '<input type="checkbox" id="ml-nlp-toggle" style="width:18px;height:18px"> 🧠 NLP Calibrator</label>' +
            '<label style="font-size:13px;color:var(--text-faint);display:flex;align-items:center;gap:6px;margin-top:1px">' +
            '<input type="checkbox" id="ml-shap-toggle" style="width:18px;height:18px"> 🔬 SHAP Attribution</label>' +
            '<label style="font-size:13px;color:var(--text-faint);display:flex;align-items:center;gap:6px">' +
            '<select id="ml-target-input" style="flex:1;padding:8px 8px;border:1.5px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:14px"><option value="">— Selecciona dataset primero —</option></select> 🎯 Target</label>' +
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
        var ids = ['ml-name-input', 'ml-dataset-select', 'ml-model-select', 'ml-target-input', 'ml-tuning-enable', 'ml-imbalance-select', 'ml-nlp-toggle'];
        ids.forEach(function(id) {
            var el = document.getElementById(id);
            if (!el) return;
            var evt = el.tagName === 'INPUT' ? 'input' : 'change';
            el.addEventListener(evt, _updateGuide);
        });
        var dsSel = document.getElementById('ml-dataset-select');
        if (dsSel) dsSel.addEventListener('change', _populateTargetColumns);
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
            var mlApiKey = (typeof Auth !== 'undefined' && Auth.getMlApiKey) ? Auth.getMlApiKey() : null;
            var headers = {};
            if (token) headers['Authorization'] = 'Bearer ' + token;
            if (mlApiKey) headers['X-API-Key'] = mlApiKey;
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

    function _populateTargetColumns() {
        var dsSelect = document.getElementById('ml-dataset-select');
        var targetSelect = document.getElementById('ml-target-input');
        if (!dsSelect || !targetSelect) return;
        var dsName = dsSelect.value;
        if (!dsName) {
            targetSelect.innerHTML = '<option value="">— Selecciona dataset primero —</option>';
            return;
        }
        var columns = [];
        var isWorksheet = dsName.indexOf('__ws__:') === 0;
        if (isWorksheet) {
            var wsData = _getWorksheetData(dsName.slice(7));
            columns = wsData ? wsData.columns : [];
        } else {
            for (var i = 0; i < _datasets.length; i++) {
                if (_datasets[i].name === dsName) {
                    columns = _datasets[i].columns || [];
                    break;
                }
            }
        }
        targetSelect.innerHTML = '<option value="">— Selecciona target —</option>';
        columns.forEach(function(col) {
            var opt = document.createElement('option');
            opt.value = col;
            opt.textContent = col;
            targetSelect.appendChild(opt);
        });
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
            _populateTargetColumns();
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
            var keys = _filterMetricsKeys(metrics);
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
        const target = targetInput ? targetInput.value : '';
        if (!datasetName) { showToast('Selecciona un dataset', 'error'); results.innerHTML = buildEmptyState(); return; }
        if (!target) { showToast('Selecciona la columna target', 'error'); results.innerHTML = buildEmptyState(); return; }

        var isWorksheet = datasetName.indexOf('__ws__:') === 0;
        var sheetName = isWorksheet ? datasetName.slice(7) : null;

        var hpParams = _hpCollect();
        var tuningEnabled = document.getElementById('ml-tuning-enable') && document.getElementById('ml-tuning-enable').checked;
        var searchType = tuningEnabled ? (document.getElementById('ml-tuning-strategy') ? document.getElementById('ml-tuning-strategy').value : 'grid') : 'none';
        var imbalanceSelect = document.getElementById('ml-imbalance-select');
        var imbalanceStrategy = imbalanceSelect ? imbalanceSelect.value : 'none';
        var hasCustomHP = Object.keys(hpParams).length > 0;

        var shapToggle = document.getElementById('ml-shap-toggle');
        var extraParams = {
            search_type: searchType,
            search_params: null,
            imbalance_strategy: imbalanceStrategy,
            calibrate_nlp: document.getElementById('ml-nlp-toggle') && document.getElementById('ml-nlp-toggle').checked,
            compute_shap: shapToggle ? shapToggle.checked : false,
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
        var keys = _filterMetricsKeys(metrics);
        keys.forEach(function(k) {
            var v = metrics[k];
            if (typeof v === 'number') v = v.toFixed ? v.toFixed(4) : v;
            html += '<div style="display:flex;justify-content:space-between;padding:1px 0;font-size:10px">' +
                '<span>' + k + '</span><span style="font-weight:500;color:var(--accent)">' + v + '</span></div>';
        });
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
            { label: 'Target', done: targetVal !== '', detail: targetVal || 'Selecciona la columna objetivo', hint: dsVal && !targetVal ? 'Selecciona el target del dataset' : '' },
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
        var keys = _filterMetricsKeys(metrics);
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

        var riesgo = p['nivel_riesgo'];
        var recText = p['recomendacion'];
        var accionesRaw = p['acciones_sugeridas'];
        if (riesgo || recText || accionesRaw) {
            var riesgoColor = '#10b981';
            var riesgoIcon = '🟢';
            if (riesgo === 'Moderado') { riesgoColor = '#f59e0b'; riesgoIcon = '🟡'; }
            else if (riesgo === 'Alto' || riesgo === 'Muy Alto') { riesgoColor = '#ef4444'; riesgoIcon = '🔴'; }

            html += '<div style="padding:12px 18px;border-top:1px solid var(--border);background:var(--bg-panel)">';
            html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
                '<span style="font-size:16px">' + riesgoIcon + '</span>' +
                '<span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-faint)">Nivel de riesgo</span>' +
                (riesgo ? '<span style="margin-left:auto;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;background:' + riesgoColor + '22;color:' + riesgoColor + ';border:1px solid ' + riesgoColor + '44">' + escapeHtml(riesgo) + '</span>' : '') +
                '</div>';
            if (recText) {
                html += '<div style="font-size:12px;color:var(--text-primary);line-height:1.5;padding:8px 10px;background:var(--item-bg);border-radius:6px;border-left:3px solid ' + riesgoColor + ';margin-bottom:8px">' +
                    escapeHtml(recText) + '</div>';
            }
            if (accionesRaw) {
                var acts = typeof accionesRaw === 'string' ? JSON.parse(accionesRaw) : (Array.isArray(accionesRaw) ? accionesRaw : []);
                if (acts.length) {
                    html += '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-faint);margin-bottom:4px">📋 Acciones sugeridas</div>';
                    html += '<div style="display:flex;flex-direction:column;gap:3px">';
                    acts.forEach(function(a) {
                        html += '<div style="display:flex;align-items:start;gap:6px;font-size:11px;color:var(--text-primary);padding:3px 0">' +
                            '<span style="color:var(--accent);flex-shrink:0">▸</span>' +
                            '<span>' + escapeHtml(a) + '</span></div>';
                    });
                    html += '</div>';
                }
            }
            html += '</div>';
        }

        var contribs = p['feature_contributions'];
        if (contribs && Array.isArray(contribs) && contribs.length) {
            html += '<div style="padding:12px 18px;border-top:1px solid var(--border);background:var(--bg-panel)">';
            html += '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-faint);margin-bottom:8px">📊 Contribución de features</div>';

            var sorted = contribs.slice().sort(function(a, b) { return b.abs_delta - a.abs_delta; });
            var maxDelta = sorted.length ? sorted[0].abs_delta : 1;
            if (maxDelta === 0) maxDelta = 1;

            sorted.forEach(function(c) {
                var pct = (c.abs_delta / maxDelta) * 100;
                var isFavor = c.direction === 'a_favor';
                var barColor = isFavor ? '#10b981' : '#ef4444';
                var icon = isFavor ? '🟢' : '🔴';
                html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">' +
                    '<span style="font-size:11px;font-weight:600;min-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary)" title="' + escapeHtml(c.feature) + '">' + escapeHtml(c.feature) + '</span>' +
                    '<div style="flex:1;height:14px;background:var(--item-bg);border-radius:7px;overflow:hidden;border:1px solid var(--border);position:relative">' +
                    '<div style="height:100%;width:' + pct.toFixed(0) + '%;background:' + barColor + ';border-radius:7px;transition:width 0.3s ease;opacity:0.8"></div></div>' +
                    '<span style="font-size:11px;font-weight:700;color:' + barColor + ';min-width:60px;text-align:right">' + (c.delta > 0 ? '+' : '') + c.delta.toFixed(4) + '</span>' +
                    icon + '</div>';
            });

            var expandId = 'feat-table-' + index + '-' + Date.now();
            html += '<div style="margin-top:6px"><button class="btn btn-secondary" style="width:100%;justify-content:center;font-size:10px;padding:4px 8px;background:none;border:1px dashed var(--border);color:var(--text-faint);cursor:pointer" onclick="var e=document.getElementById(\'' + expandId + '\');e.style.display=e.style.display===\'none\'?\'\':\'none\'">📋 Ver tabla comparativa (valor actual vs baseline)</button></div>';
            html += '<div id="' + expandId + '" style="display:none;margin-top:6px;border:1px solid var(--border);border-radius:6px;overflow:hidden;font-size:10px">';
            html += '<div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;background:var(--item-bg);padding:4px 8px;font-weight:700;color:var(--text-faint);border-bottom:1px solid var(--border)">' +
                '<div>Feature</div><div>Actual</div><div>Baseline</div><div>Δ</div></div>';
            sorted.forEach(function(c) {
                var deltaStr = (c.delta > 0 ? '+' : '') + c.delta.toFixed(4);
                var deltaColor = c.delta > 0 ? '#10b981' : c.delta < 0 ? '#ef4444' : 'var(--text-faint)';
                html += '<div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;padding:3px 8px;border-bottom:1px solid var(--border);background:var(--bg-panel)">' +
                    '<div style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escapeHtml(c.feature) + '</div>' +
                    '<div style="color:var(--text-primary)">' + escapeHtml(c.actual) + '</div>' +
                    '<div style="color:var(--text-faint)">' + escapeHtml(c.baseline) + '</div>' +
                    '<div style="color:' + deltaColor + ';font-weight:700">' + deltaStr + '</div></div>';
            });
            html += '</div></div>';
        }

        var anomalies = p['feature_anomalies'];
        if (anomalies && Array.isArray(anomalies) && anomalies.length) {
            html += '<div style="padding:10px 18px;border-top:1px solid var(--border);background:var(--bg-panel)">' +
                '<div style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:#ef444411;border:1px solid #ef444433;border-radius:6px;font-size:11px">' +
                '<span style="font-size:14px">⚠️</span><span style="font-weight:600;color:#ef4444">Valores fuera de rango de entrenamiento</span></div>';
            anomalies.forEach(function(a) {
                html += '<div style="display:flex;align-items:start;gap:6px;padding:4px 0 0 24px;font-size:11px;color:var(--text-muted)">' +
                    '<span style="color:#ef4444;flex-shrink:0">▸</span>' +
                    '<span><strong>' + escapeHtml(a.feature) + '</strong>: ' + escapeHtml(a.reason) + '</span></div>';
            });
            html += '</div>';
        }

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
                     'probabilidad_segunda_clase', 'margen_top_2', 'ic_lower_95', 'ic_upper_95',
                     'nivel_riesgo', 'recomendacion', 'acciones_sugeridas',
                     'feature_contributions', 'feature_anomalies'].includes(k);
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

    function _renderDashboard(predictions, model, modelMetrics) {
        if (!predictions || !predictions.length) return '<div style="padding:20px;text-align:center;color:var(--text-faint)">Sin resultados</div>';
        var modelMeta = (model && model.meta) || {};
        var p = predictions[0];

        var predLabel = p['prediccion_legible'] || p['clase_predicha'] || p['prediccion'] || '';
        var prob = p['probabilidad_predicha'];
        var altLabel = p['clase_alternativa_legible'] || p['segunda_clase_legible'] || '';
        var altProb = p['probabilidad_alternativa'] ?? p['probabilidad_segunda_clase'];
        var predDisplay = String(predLabel).toLowerCase();
        var isPositive = predDisplay.endsWith('=si') || predDisplay === '1' || predDisplay === 'si' || predDisplay === 'true' || predDisplay === 'aprobado';
        var probPos = isPositive ? prob : (prob != null ? 1 - prob : null);
        var nlpProbPos = p['probabilidad_nlp'];
        var nlpActive = p['nlp_active'];
        var nlpAjuste = p['ajuste_nlp'];
        var useNlp = nlpActive && nlpProbPos != null && !isNaN(nlpProbPos);
        var displayProb = useNlp ? nlpProbPos : probPos;
        if (useNlp) {
            isPositive = displayProb >= 0.5;
        }
        var emoji = isPositive ? '✅' : '❌';

        var riesgo = p['nivel_riesgo'] || '—';
        var riesgoClass = 'dp-risk-green';
        if (riesgo === 'Moderado') riesgoClass = 'dp-risk-amber';
        else if (riesgo === 'Alto' || riesgo === 'Muy Alto') riesgoClass = 'dp-risk-red';

        var recText = p['recomendacion'] || '';
        var accionesRaw = p['acciones_sugeridas'];
        var acts = typeof accionesRaw === 'string' ? JSON.parse(accionesRaw) : (Array.isArray(accionesRaw) ? accionesRaw : []);

        var contribs = p['feature_contributions'] || [];
        var anomalies = p['feature_anomalies'] || [];
        var margin = p['margen_decision'] ?? p['margen_top_2'];

        var altProbPct = altProb != null ? (altProb * 100).toFixed(1) + '%' : '—';
        var marginPts = margin != null ? (margin * 100).toFixed(1) : '—';
        var confLabel = p['nivel_confianza'] || '—';
        var mainProb = displayProb != null ? (displayProb * 100).toFixed(0) : '0';
        var gaugePct = displayProb != null ? (displayProb * 100).toFixed(1) : '0';

        var acc = modelMetrics && modelMetrics.accuracy != null ? (modelMetrics.accuracy * 100).toFixed(1) + '%' : '—';
        var f1 = modelMetrics && modelMetrics.f1_score != null ? modelMetrics.f1_score.toFixed(3) : '—';
        var auc = modelMetrics && modelMetrics.auc_roc != null ? modelMetrics.auc_roc.toFixed(3) : '—';
        var numFeat = (modelMeta.num_features || []).length + (modelMeta.cat_features || []).length;
        var nTrain = modelMeta.n_train || '—';
        var nTest = modelMeta.n_test || '—';
        var nFeatures = modelMeta.n_features_in || numFeat || '—';

        var classLabels = [];
        var classProbs = [];
        for (var k in p) {
            if (k.indexOf('prob_') === 0 && k !== 'probabilidad_predicha') {
                classLabels.push(k.replace('prob_', ''));
                classProbs.push({ label: k.replace('prob_', ''), prob: p[k] });
            }
        }

        var html = '<div class="ml-predict-dashboard" style="display:flex;flex-direction:column;gap:14px;padding:4px">';

        /* ═══ Header ═══ */
        html += '<div class="dp-header dp-anim dp-anim-1">' +
            '<div class="dp-header-left">' +
            '<span class="dp-model-badge">' + escapeHtml(model && (model.custom_name || model.id)) + '</span>' +
            '<span class="dp-header-title">Resultado de Predicción</span></div>' +
            '<div class="dp-header-meta">' +
            '<span><span class="dp-live-dot"></span> LIVE</span>' +
            '<span>ID: #' + (p.index != null ? p.index + 1 : '1') + '</span>' +
            (model && model.saved_at ? '<span>' + model.saved_at.slice(0, 10) + '</span>' : '') +
            '</div></div>';

        /* ═══ Verdict ═══ */
        var isApproved = useNlp ? isPositive : (predDisplay.endsWith('=si') || predDisplay === 'si' || predDisplay === '1' || predDisplay === 'true' || predDisplay === 'aprobado');
        var verColor = isApproved ? 'var(--accent-alt)' : 'var(--accent-error)';
        var verBorder = isApproved ? 'var(--accent-alt)' : 'var(--accent-error)';
        html += '<div class="dp-verdict dp-anim dp-anim-2" style="border-left-color:' + verBorder + '">' +
            '<div class="dp-verdict-icon">' + emoji + '</div>' +
            '<div><div class="dp-verdict-label">Clasificación</div>' +
            '<div class="dp-verdict-value" style="color:' + verColor + '">' + escapeHtml(predLabel) + '</div>' +
            (altLabel ? '<div class="dp-alt-pill"><span style="color:var(--text-faint)">Alt:</span> ' + escapeHtml(altLabel) + ' · ' + altProbPct + '</div>' : '') +
            '</div>' +
            '<div class="dp-conf-block"><div class="dp-conf-num dp-conf-anim" data-target="' + mainProb + '" style="color:' + verColor + '">0.0%</div><div class="dp-conf-label">CONFIANZA</div>' +
            (useNlp ? '<div style="font-size:9px;color:#00b8d4;margin-top:2px">🤖 ajustado por NLP <span style="color:' + (nlpAjuste >= 0 ? 'var(--accent-alt)' : 'var(--accent-error)') + '">' + (nlpAjuste >= 0 ? '+' : '') + (nlpAjuste * 100).toFixed(1) + ' pts</span></div>' : '') +
            '</div>' +
            '<div class="dp-margin-block"><div class="dp-margin-num" style="color:' + verColor + '">+' + marginPts + ' pts</div>' +
            '<div class="dp-margin-label">MARGEN VS ALT.</div>' +
            '<div style="margin-top:6px">' +
            (useNlp ? '<div style="font-size:10px;font-weight:600;margin-bottom:4px;padding:2px 8px;border-radius:4px;background:color-mix(in srgb,' + (isApproved ? 'var(--accent-alt)' : 'var(--accent-error)') + ' 15%,var(--item-bg));color:' + verColor + '">' + (isApproved ? '🟢' : '🔴') + ' ' + (isApproved ? 'APROBADO' : 'RECHAZADO') + ' por NLP</div>' : '') +
            '<span class="dp-risk-pill ' + riesgoClass + '">' + escapeHtml(riesgo) + '</span></div></div></div>';

        /* ═══ Confidence Bar ═══ */
        html += '<div class="dp-bar-row dp-anim dp-anim-2">' +
            '<div class="dp-bar-labels"><span style="color:' + verColor + '">' + escapeHtml(predLabel) + '</span>' +
            '<span style="color:var(--text-muted)">Distribución de probabilidad</span>' +
            (altLabel ? '<span style="color:var(--text-muted)">' + escapeHtml(altLabel) + '</span>' : '') + '</div>' +
            '<div class="dp-bar-track"><div class="dp-bar-fill dp-bar-anim" data-pct="' + mainProb + '"></div></div>' +
            '<div class="dp-bar-ticks"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div></div>';

        /* ═══ Stats Row ═══ */
        html += '<div class="dp-stats dp-anim dp-anim-3">' +
            '<div class="dp-stat"><div class="dp-stat-label">Precisión Modelo</div><div class="dp-stat-value">' + acc + '</div><div class="dp-stat-sub">Test set · n=' + nTest + '</div></div>' +
            '<div class="dp-stat"><div class="dp-stat-label">F1 Score</div><div class="dp-stat-value">' + f1 + '</div><div class="dp-stat-sub">weighted avg</div></div>' +
            '<div class="dp-stat"><div class="dp-stat-label">AUC-ROC</div><div class="dp-stat-value">' + auc + '</div><div class="dp-stat-sub">binary class</div></div>' +
            '<div class="dp-stat"><div class="dp-stat-label">Features</div><div class="dp-stat-value">' + nFeatures + '</div><div class="dp-stat-sub">de ' + nFeatures + ' disponibles</div></div>' +
            '<div class="dp-stat"><div class="dp-stat-label">Entrenamiento</div><div class="dp-stat-value">' + nTrain + '</div><div class="dp-stat-sub">filas · ' + (model && model.model_key || '—') + '</div></div></div>';

        /* ═══ Grid: main col + sidebar ═══ */
        html += '<div class="dp-grid dp-anim dp-anim-4"><div class="dp-main-col">';

        /* ═══ Feature Contributions ═══ */
        html += '<div class="dp-panel"><div class="dp-panel-header"><div class="dp-panel-title">Contribución de Features</div>' +
            (contribs.length ? '<span class="dp-panel-badge dp-badge-amber">' + contribs.length + ' features</span>' : '') + '</div><div class="dp-panel-body">';
        if (contribs.length) {
            var sorted = contribs.slice().sort(function(a, b) { return b.abs_delta - a.abs_delta; });
            var maxDelta = Math.max(sorted[0].abs_delta, 0.0001);
            html += '<div class="dp-feat-header"><span>Feature</span><span>Impacto relativo</span><span>Valor</span><span></span></div><div class="dp-feat-list">';
            sorted.forEach(function(c) {
                var pct = (c.abs_delta / maxDelta) * 100;
                var fillClass = c.direction === 'a_favor' ? 'dp-fill-pos' : (c.direction === 'en_contra' ? 'dp-fill-neg' : 'dp-fill-neu');
                var valClass = c.direction === 'a_favor' ? 'dp-val-pos' : (c.direction === 'en_contra' ? 'dp-val-neg' : 'dp-val-neu');
                var dotClass = c.direction === 'a_favor' ? 'dp-dot-pos' : (c.direction === 'en_contra' ? 'dp-dot-neg' : 'dp-dot-neu');
                var sign = c.delta >= 0 ? '+' : '';
                html += '<div class="dp-feat-row"><span class="dp-feat-name" title="' + escapeHtml(c.feature) + '">' + escapeHtml(c.feature) + '</span>' +
                    '<div class="dp-feat-track"><div class="dp-feat-fill ' + fillClass + '" data-pct="' + pct.toFixed(0) + '"></div></div>' +
                    '<span class="dp-feat-val ' + valClass + '">' + sign + c.delta.toFixed(4) + '</span>' +
                    '<span class="dp-feat-dot ' + dotClass + '"></span></div>';
            });
            html += '</div>';
        } else {
            html += '<div style="font-size:11px;color:var(--text-muted)">No hay datos de contribución disponibles para este modelo.</div>';
        }
        html += '</div></div>';

        /* ═══ Factors ═══ */
        var favorRaw = p['factores_a_favor'];
        var contraRaw = p['factores_en_contra'];
        var favor = favorRaw ? (typeof favorRaw === 'string' ? favorRaw.split('; ') : [favorRaw]) : [];
        var contra = contraRaw ? (typeof contraRaw === 'string' ? contraRaw.split('; ') : [contraRaw]) : [];
        var hasFactors = favor.length > 0 || contra.length > 0;
        if (hasFactors) {
            function parseFactorItem(items) {
                return items.filter(function(i) { return i.indexOf('Sin factores') === -1; }).map(function(i) {
                    var parts = i.split(':');
                    var name = parts.length > 1 ? parts[0].trim() : '';
                    var detail = parts.length > 1 ? parts.slice(1).join(':').trim() : i;
                    return { name: name, detail: detail };
                });
            }
            var favItems = parseFactorItem(favor);
            var conItems = parseFactorItem(contra);
            if (favItems.length || conItems.length) {
                html += '<div class="dp-panel"><div class="dp-panel-header"><div class="dp-panel-title">Factores Determinantes</div></div><div class="dp-panel-body"><div class="dp-factors">';
                html += '<div class="dp-factor-group"><div class="dp-factor-title" style="color:var(--accent-alt)">✅ A FAVOR</div>';
                if (favItems.length) {
                    favItems.forEach(function(f) {
                        html += '<div class="dp-factor-item"><div><div class="dp-factor-name">' + escapeHtml(f.name) + '</div><div class="dp-factor-detail">' + escapeHtml(f.detail) + '</div></div></div>';
                    });
                } else {
                    html += '<div style="font-size:10px;color:var(--text-faint)">Sin factores destacados</div>';
                }
                html += '</div>';
                html += '<div class="dp-factor-group"><div class="dp-factor-title" style="color:var(--accent-error)">❌ EN CONTRA</div>';
                if (conItems.length) {
                    conItems.forEach(function(f) {
                        html += '<div class="dp-factor-item"><div><div class="dp-factor-name">' + escapeHtml(f.name) + '</div><div class="dp-factor-detail">' + escapeHtml(f.detail) + '</div></div></div>';
                    });
                } else {
                    html += '<div style="font-size:10px;color:var(--text-faint)">Sin factores destacados</div>';
                }
                html += '</div></div></div></div>';
            }
        }

        /* ═══ Comparison Table ═══ */
        if (contribs.length) {
            html += '<div class="dp-panel"><div class="dp-panel-header"><div class="dp-panel-title">Valores Actuales vs Baseline</div>' +
                '<span class="dp-panel-badge" style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted)">ref: mediana/moda histórica</span></div>' +
                '<div class="dp-panel-body" style="overflow-x:auto"><table class="dp-comp-table"><thead><tr>' +
                '<th>Feature</th><th>Valor Actual</th><th>Baseline</th><th>Δ Absoluto</th><th>Δ %</th></tr></thead><tbody>';
            var sorted2 = contribs.slice().sort(function(a, b) { return b.abs_delta - a.abs_delta; });
            sorted2.forEach(function(c) {
                var actualNum = parseFloat(c.actual);
                var baseNum = parseFloat(c.baseline);
                var isNum = !isNaN(actualNum) && !isNaN(baseNum) && baseNum !== 0;
                var deltaAbs = isNum ? (actualNum - baseNum >= 0 ? '+' : '') + (actualNum - baseNum).toFixed(2) : '—';
                var deltaPct = isNum ? (((actualNum - baseNum) / baseNum) * 100 >= 0 ? '+' : '') + (((actualNum - baseNum) / baseNum) * 100).toFixed(1) + '%' : '—';
                var deltaClass = isNum ? (actualNum - baseNum >= 0 ? 'dp-delta-pos' : 'dp-delta-neg') : '';
                html += '<tr><td class="dp-feat-label">' + escapeHtml(c.feature) + '</td>' +
                    '<td class="dp-val-actual">' + escapeHtml(c.actual) + '</td>' +
                    '<td class="dp-val-base">' + escapeHtml(c.baseline) + '</td>' +
                    '<td class="' + deltaClass + '">' + deltaAbs + '</td>' +
                    '<td class="' + deltaClass + '">' + deltaPct + '</td></tr>';
            });
            html += '</tbody></table></div></div>';
        }

        html += '</div>'; /* /dp-main-col */

        /* ═══ Sidebar ═══ */
        html += '<div class="dp-sidebar">';

        /* ─── Gauge ─── */
        html += '<div class="dp-panel"><div class="dp-panel-header"><div class="dp-panel-title">Score de Confianza</div></div>' +
            '<div class="dp-gauge-wrap">' +
            '<svg class="dp-gauge-svg" viewBox="0 0 160 90">' +
            '<path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="var(--border)" stroke-width="10" stroke-linecap="round"/>' +
            '<path id="dp-gauge-arc" data-pct="' + gaugePct + '" d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="url(#dpGaugeGrad)" stroke-width="10" stroke-linecap="round" stroke-dasharray="189" stroke-dashoffset="189"/>' +
            '<defs><linearGradient id="dpGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="var(--accent-warn)"/><stop offset="60%" stop-color="#00c8e0"/><stop offset="100%" stop-color="var(--accent-alt)"/></linearGradient></defs>' +
            '<line id="dp-gauge-needle" data-pct="' + gaugePct + '" x1="80" y1="80" x2="80" y2="28" stroke="var(--accent-alt)" stroke-width="2" stroke-linecap="round" style="transform-origin:80px 80px;transform:rotate(-90deg)"/>' +
            '<circle cx="80" cy="80" r="4" fill="var(--accent-alt)"/>' +
            '<text x="18" y="92" fill="var(--text-faint)" font-size="7" font-family="var(--font-mono)">0</text>' +
            '<text x="72" y="18" fill="var(--text-faint)" font-size="7" font-family="var(--font-mono)">50</text>' +
            '<text x="137" y="92" fill="var(--text-faint)" font-size="7" font-family="var(--font-mono)">100</text></svg>' +
            '<div class="dp-gauge-val"><div class="dp-gauge-num dp-gauge-anim" data-target="' + gaugePct + '">0</div><div class="dp-gauge-sub">' + confLabel.toUpperCase() + '</div></div></div></div>';

        /* ─── Probability Distribution ─── */
        if (classProbs.length) {
            html += '<div class="dp-panel"><div class="dp-panel-header"><div class="dp-panel-title">Distribución de Probabilidad</div></div><div class="dp-panel-body"><div class="dp-dist-list">';
            classProbs.forEach(function(cp) {
                var cpPct = cp.prob != null ? (cp.prob * 100).toFixed(1) : '0';
                var cpColor = cp.prob >= 0.5 ? 'var(--accent-alt)' : 'var(--accent-error)';
                html += '<div class="dp-dist-row"><div class="dp-dist-label"><span class="dp-dist-name">target = ' + escapeHtml(cp.label) + '</span>' +
                    '<span class="dp-dist-pct" style="color:' + cpColor + '">' + cpPct + '%</span></div>' +
                    '<div class="dp-dist-track"><div class="dp-dist-fill dp-dist-anim" style="background:' + cpColor + '" data-pct="' + cpPct + '"></div></div></div>';
            });
            html += '</div></div></div>';
        }

        /* ─── Model Info ─── */
        var savedDate = model && model.saved_at ? model.saved_at.slice(0, 10) : '—';
        html += '<div class="dp-panel"><div class="dp-panel-header"><div class="dp-panel-title">Info del Modelo</div></div>' +
            '<div class="dp-panel-body" style="padding:10px 16px"><div class="dp-info-list">' +
            '<div class="dp-info-row"><span class="dp-info-key">Algoritmo</span><span class="dp-info-val">' + escapeHtml(model && model.model_key || '—') + '</span></div>' +
            '<div class="dp-info-row"><span class="dp-info-key">Dataset</span><span class="dp-info-val">' + escapeHtml(model && model.dataset_name || '—') + '</span></div>' +
            '<div class="dp-info-row"><span class="dp-info-key">Guardado</span><span class="dp-info-val">' + escapeHtml(savedDate) + '</span></div>' +
            '<div class="dp-info-row"><span class="dp-info-key">Train size</span><span class="dp-info-val">' + nTrain + ' obs.</span></div>' +
            '<div class="dp-info-row"><span class="dp-info-key">Features</span><span class="dp-info-val">' + nFeatures + ' vars</span></div>' +
            '<div class="dp-info-row"><span class="dp-info-key">Target</span><span class="dp-info-val">' + escapeHtml(modelMeta.target_col || '—') + '</span></div>' +
            '</div></div></div>';

        /* ─── Risk + Actions ─── */
        html += '<div class="dp-panel"><div class="dp-panel-header"><div class="dp-panel-title">Nivel de Riesgo</div>' +
            '<span class="dp-panel-badge ' + riesgoClass.replace('dp-risk', 'dp-badge') + '">' + escapeHtml(riesgo) + '</span></div>' +
            '<div class="dp-panel-body">';
        if (recText) {
            html += '<div class="dp-risk-alert">' + escapeHtml(recText) + '</div>';
        }
        if (acts.length) {
            html += '<div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Acciones sugeridas</div>' +
                '<div class="dp-actions">';
            acts.forEach(function(a, i) {
                var num = (i + 1).toString().padStart(2, '0');
                html += '<div class="dp-action"><span class="dp-action-num">' + num + '</span>' + escapeHtml(a) + '</div>';
            });
            html += '</div>';
        }
        if (anomalies.length) {
            html += '<div style="margin-top:12px"><div class="dp-anomaly"><span style="font-size:12px">⚠️</span><span style="font-weight:600;color:var(--accent-error)">Valores fuera de rango de entrenamiento</span></div>';
            anomalies.forEach(function(a) {
                html += '<div class="dp-anomaly-item"><span style="color:var(--accent-error)">▸</span> <strong>' + escapeHtml(a.feature) + '</strong>: ' + escapeHtml(a.reason) + '</div>';
            });
        }

        /* ═══ NLP Analysis ═══ */
        var nlpA = p.nlpAnalysis;
        if (nlpA && nlpA.ok) {
            var nlpRiskColor = 'var(--accent-alt)';
            if (nlpA.risk_level === 'moderado') nlpRiskColor = 'var(--accent-warn)';
            else if (nlpA.risk_level === 'alto') nlpRiskColor = 'var(--accent-error)';
            html += '<div class="dp-panel" style="margin-top:12px">' +
                '<div class="dp-panel-header"><div class="dp-panel-title">🧠 Análisis semántico</div></div>' +
                '<div class="dp-panel-body" style="padding:12px 14px">';
            html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">' +
                '<div style="background:var(--item-bg);padding:10px;border-radius:6px;border:1px solid var(--border)">' +
                '<div style="font-size:9px;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Riesgo detectado</div>' +
                '<div style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:' + nlpRiskColor + '"></span>' +
                '<span style="font-weight:700;font-size:13px;color:' + nlpRiskColor + '">' + nlpA.risk_level.toUpperCase() + '</span>' +
                '<span style="font-size:10px;color:var(--text-faint)">(' + (nlpA.risk_score * 100).toFixed(0) + '%)</span></div></div>' +
                '<div style="background:var(--item-bg);padding:10px;border-radius:6px;border:1px solid var(--border)">' +
                '<div style="font-size:9px;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Sentimiento</div>' +
                '<div style="font-weight:700;font-size:13px">' +
                (nlpA.sentiment === 'positivo' ? '✅ Positivo' : nlpA.sentiment === 'negativo' ? '❌ Negativo' : '➖ Neutral') +
                '</div></div></div>';
            if (nlpA.keywords && nlpA.keywords.length) {
                html += '<div style="margin-bottom:6px"><span style="font-size:9px;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.5px">Palabras clave</span>' +
                    '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">';
                nlpA.keywords.forEach(function(kw) {
                    html += '<span style="background:var(--card-bg);padding:2px 8px;border-radius:10px;font-size:10px;color:#00b8d4;border:1px solid var(--border)">' + escapeHtml(kw) + '</span>';
                });
                html += '</div></div>';
            }
            html += '</div></div>';
        }

        html += '</div></div></div>'; /* /dp-sidebar + /dp-panel */
        html += '</div>'; /* /dp-grid */

        /* Additional predictions */
        if (predictions.length > 1) {
            html += '<details class="dp-more-pred"><summary>Ver ' + (predictions.length - 1) + ' predicción(es) adicional(es)</summary><div style="margin-top:10px">';
            for (var i = 1; i < predictions.length; i++) {
                var subP = predictions[i];
                var subLabel = String(subP['prediccion_legible'] || subP['clase_predicha'] || subP['prediccion'] || '—');
                var subProb = subP['probabilidad_predicha'];
                var subPct = subProb != null ? (subProb * 100).toFixed(1) + '%' : '—';
                var subEmoji = subProb != null && subProb >= 0.5 ? '✅' : '❌';
                html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--card-bg);border:1px solid var(--border);border-radius:4px;margin-bottom:6px;font-size:11px">' +
                    '<span>' + subEmoji + ' ' + escapeHtml(subLabel) + '</span>' +
                    '<span style="font-family:var(--font-mono);font-weight:600;color:#00b8d4">' + subPct + '</span></div>';
            }
            html += '</div></details>';
        }

        html += '</div>'; /* /ml-predict-dashboard */

        return html;
    }

    function _animateDashboard() {
        requestAnimationFrame(function() {
            setTimeout(function() {
                var confEl = document.querySelector('.dp-conf-anim');
                if (confEl) {
                    var target = parseFloat(confEl.dataset.target) || 0;
                    var v = 0;
                    var t = setInterval(function() {
                        v = Math.min(v + 2.5, target);
                        confEl.textContent = v.toFixed(1) + '%';
                        if (v >= target) clearInterval(t);
                    }, 20);
                }
                var mainBar = document.querySelector('.dp-bar-anim');
                if (mainBar) mainBar.style.width = mainBar.dataset.pct + '%';

                document.querySelectorAll('.dp-feat-fill[data-pct]').forEach(function(el, i) {
                    setTimeout(function() { el.style.width = el.dataset.pct + '%'; }, i * 60);
                });

                setTimeout(function() {
                    document.querySelectorAll('.dp-dist-anim').forEach(function(el) {
                        el.style.width = el.dataset.pct + '%';
                    });
                }, 300);

                var arc = document.getElementById('dp-gauge-arc');
                if (arc) {
                    var gpct = parseFloat(arc.dataset.pct) || 0;
                    var offset = 189 - (189 * gpct / 100);
                    arc.style.strokeDashoffset = offset;
                }
                var needle = document.getElementById('dp-gauge-needle');
                if (needle) {
                    var npct = parseFloat(needle.dataset.pct) || 0;
                    var angle = -90 + (180 * npct / 100);
                    needle.style.transform = 'rotate(' + angle + 'deg)';
                }
                var gaugeNum = document.querySelector('.dp-gauge-anim');
                if (gaugeNum) {
                    var gtgt = parseFloat(gaugeNum.dataset.target) || 0;
                    var gv = 0;
                    var gt = setInterval(function() {
                        gv = Math.min(gv + 2.5, gtgt);
                        gaugeNum.textContent = gv.toFixed(1);
                        if (gv >= gtgt) clearInterval(gt);
                    }, 20);
                }
            }, 200);
        });
    }

    function predictFromModel(modelId) {
        var model = null;
        for (var i = 0; i < _models.length; i++) {
            if (_models[i].id === modelId) { model = _models[i]; break; }
        }
        var meta = (model && model.meta) || {};
        var catFeatures = meta.cat_features || [];
        var catValues = meta.cat_values || {};
        var numFeatures = meta.num_features || [];
        var baselines = meta.feature_baselines || {};
        var metrics = (model && model.metrics) || {};
        var expertMode = false;

        function buildJsonFromForm(container) {
            var obj = {};
            container.querySelectorAll('.pd-field-row').forEach(function(row) {
                var label = row.querySelector('.pd-label')?.title || '';
                var isNum = row.classList.contains('pd-numeric');
                var input = row.querySelector(isNum ? '.pd-input' : '.pd-select');
                if (!label) return;
                var v = input ? input.value : '';
                obj[label] = isNum ? (v === '' ? 0 : Number(v)) : (v || null);
                if (isNum && isNaN(obj[label])) obj[label] = v;
            });
            var sem = container.querySelector('.pd-semantic')?.value;
            if (sem && sem.trim()) obj._texto_semantico = sem.trim();
            return JSON.stringify([obj], null, 2);
        }

        var overlay = document.createElement('div');
        overlay.className = 'pd-overlay';
        overlay.innerHTML = '<style>' + getPredictModalCSS() + '</style><div class="pd-root">' + buildPredictModalHTML(modelId, model, meta, catFeatures, catValues, numFeatures, baselines, metrics) + '</div>';
        document.body.appendChild(overlay);

        var root = overlay.querySelector('.pd-root');
        var numericWrap = root.querySelector('#pd-fields-numeric');
        var categWrap = root.querySelector('#pd-fields-categ');
        var semanticEl = root.querySelector('.pd-semantic');
        var jsonPre = root.querySelector('.pd-json');
        var countN = root.querySelector('#pd-count-n');
        var countC = root.querySelector('#pd-count-c');
        var countTotal = root.querySelector('#pd-count-total');
        var chipsRow = root.querySelector('.pd-chips');

        function updateCounts() {
            var n = numericWrap.querySelectorAll('.pd-field-row').length;
            var c = categWrap.querySelectorAll('.pd-field-row').length;
            if (countN) countN.textContent = n;
            if (countC) countC.textContent = c;
            if (countTotal) countTotal.textContent = (n + c) + ' features';
        }

        function generateJson() {
            if (!jsonPre) return;
            jsonPre.textContent = buildJsonFromForm(root);
        }

        function updateChips() {
            var chips = [];
            var n = numericWrap.querySelectorAll('.pd-field-row').length + categWrap.querySelectorAll('.pd-field-row').length;
            chips.push({ text: '\u2713 ' + n + ' campos completados', cls: 'pd-chip-ok' });
            var hasNull = false;
            numericWrap.querySelectorAll('.pd-input').forEach(function(inp) { if (inp.value === '') hasNull = true; });
            chips.push({ text: hasNull ? '\u26a0 Valores vac\u00edos' : '\u2713 Sin valores nulos', cls: hasNull ? 'pd-chip-warn' : 'pd-chip-ok' });
            if (chipsRow) {
                chipsRow.innerHTML = chips.map(function(c) { return '<span class="pd-chip ' + c.cls + '">' + c.text + '</span>'; }).join('');
            }
        }

        function refreshAll() { updateCounts(); generateJson(); updateChips(); }

        function addField(type) {
            var wrap = type === 'numeric' ? numericWrap : categWrap;
            var row = document.createElement('div');
            row.className = 'pd-field-row' + (type === 'numeric' ? ' pd-numeric' : '');
            var idx = wrap.querySelectorAll('.pd-field-row').length + 1;
            var name = 'nueva_feature_' + Date.now() + '_' + idx;
            if (type === 'numeric') {
                row.innerHTML = '<span class="pd-label" title="' + name + '">' + name + '</span><input class="pd-input" type="number" step="any" placeholder="0"/><div class="pd-del" title="Eliminar">\u2715</div>';
            } else {
                row.innerHTML = '<span class="pd-label" title="' + name + '">' + name + '</span><select class="pd-select"><option value="">\u2014 seleccionar \u2014</option></select><div class="pd-del" title="Eliminar">\u2715</div>';
            }
            row.style.opacity = '0';
            wrap.appendChild(row);
            requestAnimationFrame(function() { row.style.transition = 'opacity .2s'; row.style.opacity = '1'; });
            row.querySelector('.pd-del').addEventListener('click', function() { removeField(row); });
            var inp = row.querySelector('.pd-input, .pd-select');
            if (inp) inp.addEventListener('input', refreshAll);
            if (inp) inp.addEventListener('change', refreshAll);
            refreshAll();
        }

        function removeField(row) {
            row.style.opacity = '0';
            row.style.transform = 'scale(.97)';
            row.style.transition = 'opacity .15s, transform .15s';
            setTimeout(function() { row.remove(); refreshAll(); }, 150);
        }

        // Populate numeric fields
        numFeatures.forEach(function(f) {
            var row = document.createElement('div');
            row.className = 'pd-field-row pd-numeric';
            var val = baselines[f] !== undefined && baselines[f] !== null ? baselines[f] : '';
            var step = typeof val === 'number' && val % 1 !== 0 ? '0.0001' : '1';
            row.innerHTML = '<span class="pd-label" title="' + escapeHtml(f) + '">' + escapeHtml(f) + '</span><input class="pd-input" type="number" step="' + step + '" value="' + val + '"/><div class="pd-del" title="Eliminar">\u2715</div>';
            numericWrap.appendChild(row);
            row.querySelector('.pd-del').addEventListener('click', function() { removeField(row); });
            row.querySelector('.pd-input').addEventListener('input', refreshAll);
            row.querySelector('.pd-input').addEventListener('change', refreshAll);
        });

        // Populate categorical fields
        catFeatures.forEach(function(f) {
            var row = document.createElement('div');
            row.className = 'pd-field-row';
            var opts = catValues[f] || [];
            var currentVal = baselines[f] !== undefined && baselines[f] !== null ? String(baselines[f]) : '';
            var html = '<span class="pd-label" title="' + escapeHtml(f) + '">' + escapeHtml(f) + '</span><select class="pd-select">';
            html += '<option value="">\u2014 seleccionar \u2014</option>';
            opts.forEach(function(o) { html += '<option value="' + escapeHtml(o) + '"' + (o === currentVal ? ' selected' : '') + '>' + escapeHtml(o) + '</option>'; });
            html += '</select><div class="pd-del" title="Eliminar">\u2715</div>';
            row.innerHTML = html;
            categWrap.appendChild(row);
            row.querySelector('.pd-del').addEventListener('click', function() { removeField(row); });
            row.querySelector('.pd-select').addEventListener('change', refreshAll);
        });

        // Section toggles
        root.querySelectorAll('.pd-section-header').forEach(function(hdr) {
            hdr.addEventListener('click', function(e) {
                if (e.target.closest('.pd-add-btn')) return;
                var body = hdr.nextElementSibling;
                var chev = hdr.querySelector('.pd-chevron');
                var isOpen = body.style.maxHeight !== '0px' && body.style.maxHeight !== '';
                if (isOpen) {
                    body.style.maxHeight = body.scrollHeight + 'px';
                    requestAnimationFrame(function() { body.style.maxHeight = '0px'; });
                    chev.classList.remove('pd-open');
                    hdr.classList.add('pd-collapsed');
                } else {
                    body.style.maxHeight = (body.scrollHeight + 200) + 'px';
                    chev.classList.add('pd-open');
                    hdr.classList.remove('pd-collapsed');
                    setTimeout(function() { body.style.maxHeight = 'none'; }, 260);
                }
            });
        });

        // Add buttons
        root.querySelectorAll('.pd-add-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var type = btn.dataset.type || 'numeric';
                addField(type);
            });
        });

        // Semantic textarea
        if (semanticEl) semanticEl.addEventListener('input', generateJson);

        // Expert toggle
        var expertToggle = root.querySelector('.pd-toggle-track');
        var metaStrip = root.querySelector('.pd-meta-strip');
        var jsonSection = root.querySelector('#pd-sec-json');
        if (expertToggle) {
            expertToggle.addEventListener('click', function() {
                expertMode = !expertMode;
                var thumb = expertToggle.querySelector('.pd-toggle-thumb');
                expertToggle.style.background = expertMode ? 'var(--accent)' : 'var(--text-faint)';
                thumb.style.right = expertMode ? '3px' : 'calc(100% - 15px)';
                if (jsonSection) jsonSection.style.display = expertMode ? 'none' : '';
                if (metaStrip) metaStrip.style.display = expertMode ? 'none' : '';
            });
        }

        // Cancel
        root.querySelector('.pd-cancel').addEventListener('click', function() {
            overlay.remove();
        });

        // Predict
        root.querySelector('.pd-predict').addEventListener('click', async function() {
            var btn = root.querySelector('.pd-predict');
            btn.disabled = true;
            btn.innerHTML = '<span style="animation:pd-spin .7s linear infinite;display:inline-block">\u27f3</span> Procesando...';

            var resOverlay = document.createElement('div');
            resOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10001';
            var resBox = document.createElement('div');
            resBox.style.cssText = 'width:92vw;max-width:1300px;max-height:90vh;background:var(--bg-panel);border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,0.5);overflow:hidden;display:flex;flex-direction:column';
            var resTitle = document.createElement('div');
            resTitle.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:14px 20px;font-size:14px;font-weight:700;border-bottom:1px solid var(--border);background:var(--item-bg);flex-shrink:0';
            resTitle.innerHTML = '<span>\ud83d\udd2e Resultado de predicci\u00f3n con <span style="color:var(--accent)">' + escapeHtml(modelId) + '</span></span>';
            var closeBtn = document.createElement('button');
            closeBtn.innerHTML = '\u2715';
            closeBtn.style.cssText = 'border:none;background:var(--item-bg);cursor:pointer;font-size:16px;color:var(--text-faint);padding:6px 12px;border-radius:8px';
            closeBtn.onclick = function() { resOverlay.remove(); };
            resTitle.appendChild(closeBtn);
            resBox.appendChild(resTitle);
            var resBody = document.createElement('div');
            resBody.style.cssText = 'padding:20px 22px;overflow-y:auto;flex:1';
            resBody.innerHTML = '<div style="text-align:center;padding:60px 40px;color:var(--text-faint)"><div style="font-size:36px;margin-bottom:12px">\u23f3</div><div style="font-size:14px;font-weight:600">Procesando predicci\u00f3n...</div><div style="font-size:11px;margin-top:4px">Consultando al modelo</div></div>';
            resBox.appendChild(resBody);
            var resActions = document.createElement('div');
            resActions.style.cssText = 'display:flex;gap:10px;justify-content:end;padding:10px 20px;border-top:1px solid var(--border);flex-shrink:0';
            var resNewBtn = document.createElement('button');
            resNewBtn.innerHTML = '\ud83d\udd2e Nueva predicci\u00f3n';
            resNewBtn.style.cssText = 'padding:7px 16px;border-radius:8px;font-size:12px;font-weight:600;border:1.5px solid var(--border);background:var(--item-bg);color:var(--text-primary);cursor:pointer';
            resNewBtn.onclick = function() { resOverlay.remove(); };
            resActions.appendChild(resNewBtn);
            var resCloseBtn = document.createElement('button');
            resCloseBtn.textContent = '\u2715 Cerrar';
            resCloseBtn.style.cssText = 'padding:7px 16px;border-radius:8px;font-size:12px;font-weight:600;border:1.5px solid var(--border);background:var(--bg-panel);color:var(--text-faint);cursor:pointer';
            resCloseBtn.onclick = function() { resOverlay.remove(); };
            resActions.appendChild(resCloseBtn);
            resBox.appendChild(resActions);
            resOverlay.appendChild(resBox);
            document.body.appendChild(resOverlay);
            resOverlay.addEventListener('click', function(e) { if (e.target === resOverlay) resOverlay.remove(); });
            document.addEventListener('keydown', function _resKey(e) { if (e.key === 'Escape' && resOverlay.parentNode) { resOverlay.remove(); document.removeEventListener('keydown', _resKey); } });

            try {
                var raw = buildJsonFromForm(root);
                if (!raw) throw new Error('No hay datos para predecir');
                var parsed = JSON.parse(raw);
                var inputData = Array.isArray(parsed) ? parsed : [parsed];
                if (!inputData.length) throw new Error('El array de datos est\u00e1 vac\u00edo');
                if (inputData[0] == null || typeof inputData[0] !== 'object') throw new Error('Cada fila debe ser un objeto');
                var columns = Object.keys(inputData[0]);
                if (!columns.length) throw new Error('Define al menos una feature');
                var dataRows = inputData.map(function(row) { return columns.map(function(c) { return row[c]; }); });
                var nlpText = semanticEl ? semanticEl.value.trim() : '';
                var textsArr = nlpText ? dataRows.map(function() { return nlpText; }) : null;
                var nlpAnalysis = null;
                if (nlpText) {
                    try {
                        var apiUrl = window._ML_API_URL || 'https://sigmapro-ml.fly.dev';
                        var mlKey = (typeof Auth !== 'undefined' && Auth.getMlApiKey) ? Auth.getMlApiKey() : null;
                        var nlpHeaders = {'Content-Type': 'application/json'};
                        if (mlKey) nlpHeaders['X-API-Key'] = mlKey;
                        var nlpRes = await fetch(apiUrl + '/api/ml/analyze-text', { method: 'POST', headers: nlpHeaders, body: JSON.stringify({text: nlpText}) });
                        if (nlpRes.ok) nlpAnalysis = await nlpRes.json();
                    } catch (_e) {}
                }
                var result = await _fetch('POST', '/api/ml/predict', { model_id: modelId, data: dataRows, columns: columns, texts: textsArr });
                var modelMetrics_ = (model && model.metrics) || {};
                if (nlpAnalysis && result.predictions && result.predictions.length) {
                    result.predictions.forEach(function(p) { p.nlpAnalysis = nlpAnalysis; });
                }
                var resultHtml = _renderDashboard(result.predictions, model, modelMetrics_);
                resBody.innerHTML = resultHtml;
                setTimeout(_animateDashboard, 50);
            } catch (e) {
                resBody.innerHTML = '<div style="text-align:center;padding:40px;color:#ef4444;font-size:14px;font-weight:500">\u274c ' + escapeHtml(e.message) + '</div>';
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<span class="pd-predict-icon">\ud83d\udd2e</span> Predecir';
            }
        });

        // Close on overlay click
        overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
        document.addEventListener('keydown', function _onKey(e) { if (e.key === 'Escape' && overlay.parentNode) { overlay.remove(); document.removeEventListener('keydown', _onKey); } });

        // Init
        refreshAll();
        root.querySelector('#pd-sec-numeric .pd-collapsible').style.maxHeight = 'none';
        root.querySelector('#pd-sec-categ .pd-collapsible').style.maxHeight = 'none';
    }

    function getPredictModalCSS() {
        return `/* ── Predict Modal Styles (theme-aware) ── */
.pd-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999}
.pd-overlay *{box-sizing:border-box;margin:0;padding:0}
.pd-root{width:96vw;max-width:1360px;max-height:94vh;background:var(--bg-panel);border-radius:8px;overflow:hidden;display:flex;flex-direction:column;border:1px solid var(--border);color:var(--text-primary);font-size:13px}
.pd-topbar{display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:52px;background:var(--bg-panel);border-bottom:1px solid var(--border);flex-shrink:0}
.pd-topbar-left{display:flex;align-items:center;gap:10px}
.pd-topbar-title{font-size:14px;font-weight:500}
.pd-topbar-model{font-family:var(--font-mono);font-size:12px;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--bg-panel));border:1px solid color-mix(in srgb,var(--accent) 18%,var(--bg-panel));padding:2px 8px;border-radius:3px}
.pd-toggle-wrap{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--text-muted);cursor:pointer}
.pd-toggle-track{width:32px;height:18px;border-radius:9px;background:var(--accent);position:relative;cursor:pointer;transition:background .2s;flex-shrink:0}
.pd-toggle-thumb{width:12px;height:12px;border-radius:50%;background:#fff;position:absolute;top:3px;right:3px;transition:right .2s}
.pd-meta-strip{display:grid;grid-template-columns:repeat(6,1fr);gap:1px;background:var(--border);border-bottom:1px solid var(--border);flex-shrink:0}
.pd-mcell{background:var(--bg-panel);padding:10px 18px;display:flex;flex-direction:column;gap:3px}
.pd-mlabel{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-faint)}
.pd-mval{font-family:var(--font-mono);font-size:12px;font-weight:500;color:var(--text-primary)}
.pd-macc{color:var(--accent)}
.pd-mcya{color:#00b8d4}
.pd-mgrn{color:var(--accent-alt)}
.pd-mamb{color:var(--accent-warn)}
.pd-body{flex:1;overflow-y:auto;padding:16px 24px 0}
.pd-section{margin-bottom:12px}
.pd-section-header{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--item-bg);border:1px solid var(--border);border-radius:6px 6px 0 0;cursor:pointer;user-select:none}
.pd-section-header.pd-collapsed{border-radius:6px}
.pd-sleft{display:flex;align-items:center;gap:10px}
.pd-sdot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.pd-scyan{background:#00b8d4;box-shadow:0 0 6px #00b8d4}
.pd-samb{background:var(--accent-warn);box-shadow:0 0 6px var(--accent-warn)}
.pd-spur{background:var(--accent);box-shadow:0 0 6px var(--accent)}
.pd-sname{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)}
.pd-scount{font-family:var(--font-mono);font-size:11px;color:var(--text-faint);background:var(--bg-primary);border:1px solid var(--border);padding:1px 7px;border-radius:10px}
.pd-sright{display:flex;align-items:center;gap:10px}
.pd-add-btn{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,var(--bg-panel));border:1px solid color-mix(in srgb,var(--accent) 16%,var(--bg-panel));padding:4px 10px;border-radius:3px;cursor:pointer;transition:background .15s}
.pd-add-btn:hover{background:color-mix(in srgb,var(--accent) 14%,var(--bg-panel));border-color:color-mix(in srgb,var(--accent) 30%,var(--bg-panel))}
.pd-chevron{font-size:14px;color:var(--text-faint);transition:transform .2s}
.pd-chevron.pd-open{transform:rotate(180deg)}
.pd-collapsible{overflow:hidden;transition:max-height .25s ease}
.pd-fields{background:var(--bg-panel);border:1px solid var(--border);border-top:none;border-radius:0 0 6px 6px;padding:4px 8px 8px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.pd-fields.pd-cols2{grid-template-columns:repeat(2,1fr)}
.pd-field-row{display:flex;align-items:center;gap:0;border:1px solid var(--border);border-radius:4px;background:var(--item-bg);overflow:hidden;transition:border-color .15s}
.pd-field-row:hover{border-color:var(--text-faint)}
.pd-field-row:focus-within{border-color:var(--accent)}
.pd-label{flex:0 0 auto;min-width:120px;max-width:150px;padding:0 10px;font-size:11px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-right:1px solid var(--border);height:34px;display:flex;align-items:center;background:var(--item-bg);cursor:default}
.pd-input{flex:1;min-width:0;background:var(--bg-primary);border:none;outline:none;color:var(--text-primary);font-family:var(--font-mono);font-size:12px;padding:0 10px;height:34px}
.pd-input::placeholder{color:var(--text-faint)}
.pd-select{flex:1;min-width:0;background:var(--bg-primary);border:none;outline:none;color:var(--text-primary);font-family:var(--font-body);font-size:12px;padding:0 8px;height:34px;cursor:pointer;appearance:none;padding-right:24px}
.pd-field-row{position:relative}
.pd-field-row.pd-numeric .pd-select,
.pd-field-row .pd-select{background:none;background-color:var(--bg-primary)}
.pd-field-row:has(.pd-select)::after{content:'';position:absolute;right:30px;top:50%;transform:translateY(-50%);width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid var(--text-faint);pointer-events:none}
.pd-select option{background:var(--bg-panel);color:var(--text-primary)}
.pd-del{flex:0 0 24px;height:34px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--border);background:var(--item-bg);cursor:pointer;opacity:0;transition:opacity .15s;font-size:11px;color:var(--text-faint)}
.pd-field-row:hover .pd-del{opacity:1}
.pd-del:hover{background:color-mix(in srgb,var(--accent-error) 10%,var(--item-bg));color:var(--accent-error)}
.pd-semantic-body{background:var(--bg-panel);border:1px solid var(--border);border-top:none;border-radius:0 0 6px 6px;padding:12px 16px}
.pd-semantic-hint{font-size:11px;color:var(--text-faint);margin-bottom:10px}
.pd-semantic{width:100%;min-height:80px;background:var(--bg-primary);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-family:var(--font-body);font-size:12px;padding:10px 12px;outline:none;resize:vertical;line-height:1.6;transition:border-color .15s}
.pd-semantic:focus{border-color:var(--accent)}
.pd-semantic::placeholder{color:var(--text-faint)}
.pd-json-body{background:var(--bg-panel);border:1px solid var(--border);border-top:none;border-radius:0 0 6px 6px;padding:0;overflow:hidden}
.pd-json{font-family:var(--font-mono);font-size:11px;color:#00b8d4;background:color-mix(in srgb,#00b8d4 3%,var(--bg-panel));padding:14px 16px;margin:0;max-height:160px;overflow-y:auto;white-space:pre;line-height:1.7}
.pd-json-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:8px 14px;border-top:1px solid var(--border);background:var(--item-bg)}
.pd-icon-btn{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-muted);background:none;border:1px solid var(--border);padding:4px 10px;border-radius:3px;cursor:pointer;transition:background .15s}
.pd-icon-btn:hover{background:var(--item-bg);color:var(--text-primary)}
.pd-chips{display:flex;gap:8px;flex-wrap:wrap;padding:0 24px 10px;flex-shrink:0}
.pd-chip{font-size:10px;font-family:var(--font-mono);letter-spacing:.05em;padding:3px 9px;border-radius:10px;display:flex;align-items:center;gap:4px}
.pd-chip-ok{background:color-mix(in srgb,var(--accent-alt) 8%,var(--bg-panel));color:var(--accent-alt);border:1px solid color-mix(in srgb,var(--accent-alt) 16%,var(--bg-panel))}
.pd-chip-warn{background:color-mix(in srgb,var(--accent-warn) 8%,var(--bg-panel));color:var(--accent-warn);border:1px solid color-mix(in srgb,var(--accent-warn) 16%,var(--bg-panel))}
.pd-action-bar{position:sticky;bottom:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:var(--bg-panel);border-top:1px solid var(--border);flex-shrink:0}
.pd-action-left{font-size:11px;color:var(--text-faint);display:flex;align-items:center;gap:16px}
.pd-status-dot{width:6px;height:6px;border-radius:50%;background:var(--accent-alt);display:inline-block;margin-right:5px;box-shadow:0 0 6px var(--accent-alt)}
.pd-action-right{display:flex;align-items:center;gap:10px}
.pd-cancel{padding:9px 20px;border-radius:4px;cursor:pointer;font-family:var(--font-body);font-size:13px;font-weight:400;color:var(--text-muted);background:none;border:1px solid var(--border);transition:background .15s,color .15s}
.pd-cancel:hover{background:var(--item-bg);color:var(--text-primary);border-color:var(--text-faint)}
.pd-predict{display:flex;align-items:center;gap:8px;padding:9px 24px;border-radius:4px;cursor:pointer;font-family:var(--font-body);font-size:13px;font-weight:500;color:#fff;background:var(--accent);border:1px solid var(--accent);transition:background .15s,transform .1s}
.pd-predict:hover{background:var(--accent-hover)}
.pd-predict:active{transform:scale(.98)}
.pd-predict:disabled{opacity:.5;cursor:not-allowed}
@keyframes pd-spin{to{transform:rotate(360deg)}}
`;
    }

    function buildPredictModalHTML(modelId, model, meta, catFeatures, catValues, numFeatures, baselines, metrics) {
        var algo = model ? (model.model_key || '—') : '—';
        var ds = model ? (model.dataset_name || '—') : '—';
        var saved = model && model.saved_at ? model.saved_at.slice(0, 16) : '—';
        var target = meta.target_col || '—';
        var probType = meta.problem_type || '—';
        var nNum = numFeatures.length;
        var nCat = catFeatures.length;

        var html = '';
        html += '<div class="pd-topbar"><div class="pd-topbar-left"><span style="font-size:18px">\ud83d\udd2e</span><span class="pd-topbar-title">Predecir con</span><span class="pd-topbar-model">' + escapeHtml(modelId) + '</span></div><div class="pd-toggle-wrap"><span>Modo experto</span><div class="pd-toggle-track"><div class="pd-toggle-thumb"></div></div></div></div>';

        html += '<div class="pd-meta-strip">';
        html += '<div class="pd-mcell"><span class="pd-mlabel">Algoritmo</span><span class="pd-mval pd-macc">' + escapeHtml(algo) + '</span></div>';
        html += '<div class="pd-mcell"><span class="pd-mlabel">Dataset</span><span class="pd-mval pd-mcya">' + escapeHtml(ds) + '</span></div>';
        html += '<div class="pd-mcell"><span class="pd-mlabel">Guardado</span><span class="pd-mval" style="color:var(--text-muted)">' + escapeHtml(saved) + '</span></div>';
        html += '<div class="pd-mcell"><span class="pd-mlabel">Num\u00e9ricas / Categ\u00f3ricas</span><span class="pd-mval">' + nNum + ' <span style="color:var(--text-faint)">/</span> ' + nCat + '</span></div>';
        html += '<div class="pd-mcell"><span class="pd-mlabel">Target</span><span class="pd-mval pd-mgrn">' + escapeHtml(target) + '</span></div>';
        html += '<div class="pd-mcell"><span class="pd-mlabel">Tipo</span><span class="pd-mval pd-mamb">' + escapeHtml(probType) + '</span></div>';
        html += '</div>';

        html += '<div class="pd-body">';

        // Numeric section
        html += '<div class="pd-section" id="pd-sec-numeric"><div class="pd-section-header"><div class="pd-sleft"><span class="pd-sdot pd-scyan"></span><span class="pd-sname">Features num\u00e9ricas</span><span class="pd-scount" id="pd-count-n">' + nNum + '</span></div><div class="pd-sright"><div class="pd-add-btn" data-type="numeric"><span>+</span> Agregar campo</div><span class="pd-chevron pd-open">\u25be</span></div></div><div class="pd-collapsible"><div class="pd-fields" id="pd-fields-numeric"></div></div></div>';

        // Categorical section
        html += '<div class="pd-section" id="pd-sec-categ"><div class="pd-section-header"><div class="pd-sleft"><span class="pd-sdot pd-samb"></span><span class="pd-sname">Features categ\u00f3ricas</span><span class="pd-scount" id="pd-count-c">' + nCat + '</span></div><div class="pd-sright"><div class="pd-add-btn" data-type="categ"><span>+</span> Agregar campo</div><span class="pd-chevron pd-open">\u25be</span></div></div><div class="pd-collapsible"><div class="pd-fields pd-cols2" id="pd-fields-categ"></div></div></div>';

        // Semantic section
        html += '<div class="pd-section" id="pd-sec-sem"><div class="pd-section-header"><div class="pd-sleft"><span class="pd-sdot pd-spur"></span><span class="pd-sname">An\u00e1lisis sem\u00e1ntico</span><span style="font-size:10px;color:var(--text-faint);margin-left:4px">opcional</span></div><div class="pd-sright"><span class="pd-chevron">\u25be</span></div></div><div class="pd-collapsible" style="max-height:0"><div class="pd-semantic-body"><p class="pd-semantic-hint">Describe el motivo o comentario para enriquecer la predicci\u00f3n con an\u00e1lisis de texto.</p><textarea class="pd-semantic" placeholder="Ej: Solicito un pr\u00e9stamo para consolidar mis deudas y mejorar mi historial crediticio..."></textarea></div></div></div>';

        // JSON preview section
        html += '<div class="pd-section" id="pd-sec-json"><div class="pd-section-header"><div class="pd-sleft"><span class="pd-sdot" style="background:var(--text-faint)"></span><span class="pd-sname">JSON generado</span></div><div class="pd-sright"><span class="pd-chevron">\u25be</span></div></div><div class="pd-collapsible" style="max-height:0"><div class="pd-json-body"><pre class="pd-json" id="pd-json-preview">{\n  "placeholder": true\n}</pre><div class="pd-json-actions"><button class="pd-icon-btn" onclick="var t=this.closest(\'.pd-json-body\').querySelector(\'.pd-json\');navigator.clipboard?.writeText(t.textContent).catch(function(){})">\u2398 Copiar JSON</button></div></div></div></div>';

        html += '<div style="height:8px"></div></div>';

        // Chips
        html += '<div class="pd-chips"><span class="pd-chip pd-chip-ok">\u2713 0 campos completados</span><span class="pd-chip pd-chip-ok">\u2713 Sin valores nulos</span></div>';

        // Action bar
        html += '<div class="pd-action-bar"><div class="pd-action-left"><span><span class="pd-status-dot"></span>' + escapeHtml(modelId) + ' \u00b7 listo</span><span class="pd-fcount" id="pd-count-total">' + (nNum + nCat) + ' features</span></div><div class="pd-action-right"><button class="pd-cancel">Cancelar</button><button class="pd-predict"><span class="pd-predict-icon">\ud83d\udd2e</span> Predecir</button></div></div>';

        return html;
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
        var target = targetInput ? targetInput.value : '';
        if (!datasetName) { showToast('Selecciona un dataset', 'error'); return; }
        if (!target) { showToast('Selecciona la columna target', 'error'); return; }

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
                var shapCb = document.getElementById('ml-shap-toggle');
                var body = {
                    data: [], columns: [],
                    target: target, model_key: mk,
                    n_bootstraps: 0,
                    dataset_name: datasetName,
                    search_type: 'none',
                    imbalance_strategy: 'none',
                    compute_shap: shapCb ? shapCb.checked : false,
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
        var keys = _filterMetricsKeys(metrics);
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
                _filterMetricsKeys(r.data.metrics).forEach(function(k) {
                    allMetricKeys.add(k);
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
