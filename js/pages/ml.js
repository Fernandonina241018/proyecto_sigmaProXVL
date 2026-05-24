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
        return 'http://localhost:8000';
    }

    async function _fetch(method, path, body) {
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
        return '<div class="left-panel" style="gap:10px">' +
            '<div class="info-section"><div class="info-section-header">🧠 ML Analysis</div>' +
            '<div class="info-section-body" style="padding:8px 12px;font-size:11px;color:var(--text-faint)">' +
            'Entrena modelos de ML con tus datos, haz predicciones y detecta anomalías.</div></div>' +
            '<div class="info-section"><div class="info-section-header">📊 Dataset</div>' +
            '<div class="info-section-body" style="padding:8px 12px;display:flex;flex-direction:column;gap:6px">' +
            '<select id="ml-dataset-select" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-panel);color:var(--text-primary);font-size:11px">' +
            '<option value="">— Cargando datasets —</option></select>' +
            '<button class="btn btn-secondary" style="width:100%;justify-content:center;font-size:11px" onclick="MLManager.refreshDatasets()">🔄 Refrescar</button>' +
            '</div></div>' +
            '<div class="info-section"><div class="info-section-header">🤖 Modelo</div>' +
            '<div class="info-section-body" style="padding:8px 12px;display:flex;flex-direction:column;gap:6px">' +
            '<select id="ml-model-select" style="width:100%;padding:6px 8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-panel);color:var(--text-primary);font-size:11px">' +
            '<option value="rf">🌳 Random Forest</option>' +
            '<option value="xgb">⚡ XGBoost</option>' +
            '<option value="mlp">🧠 MLP Neural Net</option>' +
            '<option value="logistic">📈 Logistic Regression</option>' +
            '<option value="linear">📐 Linear Regression</option>' +
            '</select>' +
            '<label style="font-size:10px;color:var(--text-faint);display:flex;align-items:center;gap:4px">' +
            '<input type="text" id="ml-target-input" placeholder="columna target" style="flex:1;padding:4px 6px;border:1px solid var(--border);border-radius:4px;background:var(--bg-primary);color:var(--text-primary);font-size:11px"> Target</label>' +
            '<button class="btn btn-primary" style="width:100%;justify-content:center;font-size:11px" onclick="MLManager.train()">🎯 Entrenar modelo</button>' +
            '</div></div>' +
            '<div class="info-section"><div class="info-section-header">💾 Modelos guardados</div>' +
            '<div class="info-section-body" style="padding:6px 8px;display:flex;flex-direction:column;gap:4px" id="ml-models-list">' +
            '<div style="font-size:10px;color:var(--text-faint);padding:4px">Cargando...</div></div></div>' +
            '<div class="info-section"><div class="info-section-header">⚠️ Anomalías</div>' +
            '<div class="info-section-body" style="padding:8px 12px">' +
            '<button class="btn btn-secondary" style="width:100%;justify-content:center;font-size:11px" onclick="MLManager.detectAnomalies()">🔍 Detectar anomalías</button></div></div>' +
            '</div>';
    }

    function buildRightPanel() {
        return '<div class="page-body" style="display:flex;flex-direction:column;gap:12px;height:100%">' +
            '<div class="page-card" style="flex:1;display:flex;flex-direction:column;min-height:0">' +
            '<div class="page-card-header"><span class="page-card-icon">📊</span><span class="page-card-title">ML Results</span></div>' +
            '<div class="page-card-body" id="ml-results" style="flex:1;overflow:auto;padding:12px;font-size:12px;color:var(--text-primary)">' +
            '<div style="text-align:center;padding:40px 20px;color:var(--text-faint)">' +
            '<div style="font-size:48px;margin-bottom:12px">🧠</div>' +
            '<div style="font-size:14px;font-weight:600;margin-bottom:6px">Machine Learning</div>' +
            '<div style="font-size:11px">Carga un dataset, selecciona el target y entrena un modelo.<br>' +
            'Usa modelos guardados para predecir nuevos datos.</div></div></div></div></div>';
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
            const data = await _fetch('GET', '/api/ml/datasets');
            _datasets = data.datasets || [];
            sel.innerHTML = '<option value="">— Selecciona dataset —</option>';
            _datasets.forEach(function(ds) {
                const opt = document.createElement('option');
                opt.value = ds.name;
                opt.textContent = ds.name + ' (' + ds.nrows + 'r x ' + ds.ncols + 'c)';
                sel.appendChild(opt);
            });
            if (_datasets.length === 0) {
                sel.innerHTML = '<option value="">— No hay datasets —</option>';
            }
        } catch (e) {
            sel.innerHTML = '<option value="">— Error: ' + e.message + ' —</option>';
            showToast('Error al cargar datasets: ' + e.message, 'error');
        }
    }

    async function refreshModels() {
        const container = document.getElementById('ml-models-list');
        if (!container) return;
        try {
            const data = await _fetch('GET', '/api/ml/models');
            _models = data.models || [];
            if (_models.length === 0) {
                container.innerHTML = '<div style="font-size:10px;color:var(--text-faint);padding:4px">Sin modelos entrenados</div>';
                return;
            }
            container.innerHTML = '';
            _models.forEach(function(m) {
                const div = document.createElement('div');
                div.style.cssText = 'padding:6px 8px;border:1px solid var(--border);border-radius:4px;cursor:pointer;font-size:10px;transition:all .15s';
                div.innerHTML = '<div style="font-weight:600;color:var(--accent)">' + escapeHtml(m.id) + '</div>' +
                    '<div style="color:var(--text-primary)">' + escapeHtml(m.model_key) + ' · ' + escapeHtml(m.dataset_name || '?') + '</div>' +
                    '<div style="color:var(--text-faint)">' + (m.saved_at ? m.saved_at.slice(0, 16) : '') + '</div>';
                div.addEventListener('click', function() {
                    _selectedModelId = m.id;
                    loadModelDetail(m);
                });
                container.appendChild(div);
            });
        } catch (e) {
            container.innerHTML = '<div style="font-size:10px;color:#ef4444;padding:4px">Error: ' + e.message + '</div>';
            showToast('Error al cargar modelos: ' + e.message, 'error');
        }
    }

    function loadModelDetail(model) {
        const results = document.getElementById('ml-results');
        if (!results) return;
        var metrics = model.metrics || {};
        var meta = model.meta || {};
        var html = '<div class="page-card" style="margin-bottom:12px">' +
            '<div class="page-card-header"><span class="page-card-icon">💾</span><span class="page-card-title">' + escapeHtml(model.id) + '</span></div>' +
            '<div class="page-card-body" style="padding:12px;font-size:11px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">' +
            '<div><strong>Algoritmo:</strong> ' + escapeHtml(model.model_key) + '</div>' +
            '<div><strong>Dataset:</strong> ' + escapeHtml(model.dataset_name || '—') + '</div>' +
            '<div><strong>Tipo:</strong> ' + escapeHtml(meta.problem_type || '—') + '</div>' +
            '<div><strong>Guardado:</strong> ' + (model.saved_at ? model.saved_at.slice(0, 16) : '—') + '</div>' +
            '</div>';
        if (Object.keys(metrics).length > 0) {
            html += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">' +
                '<div style="font-weight:600;margin-bottom:6px">📊 Métricas</div>';
            for (var k in metrics) {
                if (['y_pred', 'y_proba'].includes(k)) continue;
                var v = metrics[k];
                if (typeof v === 'number') v = v.toFixed ? v.toFixed(4) : v;
                html += '<div style="display:flex;justify-content:space-between;padding:2px 0"><span>' + k + '</span><span style="font-weight:500;color:var(--accent)">' + v + '</span></div>';
            }
            html += '</div>';
        }
        html += '<div style="margin-top:12px;display:flex;gap:6px">' +
            '<button class="btn btn-primary" style="flex:1;justify-content:center;font-size:10px" onclick="MLManager.predictFromModel(\'' + model.id + '\')">🔮 Predecir</button>' +
            '<button class="btn btn-secondary" style="justify-content:center;font-size:10px;color:#ef4444" onclick="MLManager.deleteModel(\'' + model.id + '\')">🗑</button>' +
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
        try {
            const preview = await _fetch('POST', '/api/ml/dataset/preview', { filename: datasetName });
            const data = await _fetch('POST', '/api/ml/train', {
                data: preview.preview, columns: preview.columns,
                target: target, model_key: modelKey, n_bootstraps: 3, dataset_name: datasetName,
            });
            _trainingHistory.push(data);
            renderTrainingResult(data);
            refreshModels();
            showToast('✅ Modelo ' + data.model_id + ' entrenado', 'ok');
        } catch (e) {
            try {
                const fullData = await _fetch('POST', '/api/ml/dataset/preview', { filename: datasetName });
                const data = await _fetch('POST', '/api/ml/train', {
                    data: fullData.preview, columns: fullData.columns,
                    target: target, model_key: modelKey, n_bootstraps: 0, dataset_name: datasetName,
                });
                renderTrainingResult(data);
                refreshModels();
                showToast('✅ Modelo ' + data.model_id + ' entrenado', 'ok');
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
        var html = '<div class="page-card" style="margin-bottom:12px">' +
            '<div class="page-card-header"><span class="page-card-icon">🎯</span><span class="page-card-title">Modelo: ' + escapeHtml(data.model_id) + '</span></div>' +
            '<div class="page-card-body" style="padding:12px;font-size:11px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">' +
            '<div><strong>Tipo:</strong> ' + escapeHtml(meta.problem_type || '—') + '</div>' +
            '<div><strong>Target:</strong> ' + escapeHtml(meta.target_col || '—') + '</div>' +
            '<div><strong>Features num:</strong> ' + (meta.num_features || []).join(', ') + '</div>' +
            '<div><strong>Features cat:</strong> ' + (meta.cat_features || []).join(', ') + '</div>' +
            '<div><strong>Train:</strong> ' + (meta.n_train || '—') + ' filas</div>' +
            '<div><strong>Test:</strong> ' + (meta.n_test || '—') + ' filas</div>' +
            '</div>';
        html += '<div style="border-top:1px solid var(--border);padding-top:10px">' +
            '<div style="font-weight:600;margin-bottom:6px">📊 Métricas</div>';
        for (var k in metrics) {
            if (['y_pred', 'y_proba'].includes(k)) continue;
            var v = metrics[k];
            if (typeof v === 'number') v = v.toFixed ? v.toFixed(4) : v;
            html += '<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.04)">' +
                '<span>' + k + '</span><span style="font-weight:500;color:var(--accent)">' + v + '</span></div>';
        }
        html += '</div>';
        if (meta.target_classes && meta.target_classes.length) {
            html += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">' +
                '<div style="font-weight:600;margin-bottom:4px">🎯 Clases target</div>' +
                '<div style="font-size:10px;color:var(--text-primary)">' + meta.target_classes.join(', ') + '</div></div>';
        }
        html += '<div style="margin-top:12px;display:flex;gap:6px">' +
            '<button class="btn btn-primary" style="flex:1;justify-content:center;font-size:10px" onclick="MLManager.predictFromModel(\'' + data.model_id + '\')">🔮 Predecir con este modelo</button>' +
            '</div></div></div>';
        results.innerHTML = html;
    }

    function buildEmptyState() {
        return '<div style="text-align:center;padding:40px 20px;color:var(--text-faint)">' +
            '<div style="font-size:48px;margin-bottom:12px">🧠</div>' +
            '<div style="font-size:14px;font-weight:600;margin-bottom:6px">Machine Learning</div>' +
            '<div style="font-size:11px">Carga un dataset, selecciona el target y entrena un modelo.</div></div>';
    }

    function predictFromModel(modelId) {
        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        var box = document.createElement('div');
        box.className = 'modal-box';
        box.style.cssText = 'max-width:500px';
        var title = document.createElement('div');
        title.className = 'modal-title';
        title.textContent = '🔮 Predecir con ' + modelId;
        box.appendChild(title);
        var content = document.createElement('div');
        content.style.cssText = 'padding:12px 16px;display:flex;flex-direction:column;gap:10px';
        var textarea = document.createElement('textarea');
        textarea.id = 'ml-predict-input';
        textarea.placeholder = 'Ingresa datos JSON para predecir...\nEj: [{"feat1": 5.1, "feat2": 3.5}]';
        textarea.style.cssText = 'width:100%;min-height:150px;padding:8px;border:1.5px solid var(--border);border-radius:6px;background:var(--bg-primary);color:var(--text-primary);font-size:11px;font-family:monospace;resize:vertical';
        content.appendChild(textarea);
        var errorEl = document.createElement('div');
        errorEl.style.cssText = 'font-size:10px;color:#ef4444;min-height:14px';
        content.appendChild(errorEl);
        var resultEl = document.createElement('div');
        resultEl.id = 'ml-predict-result';
        resultEl.style.cssText = 'font-size:11px;padding:8px;background:var(--item-bg);border-radius:4px;min-height:30px;white-space:pre-wrap;font-family:monospace';
        resultEl.textContent = 'Los resultados aparecerán aquí';
        content.appendChild(resultEl);
        var actions = document.createElement('div');
        actions.style.cssText = 'display:flex;gap:8px;justify-content:end';
        var cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.onclick = function() { overlay.remove(); };
        actions.appendChild(cancelBtn);
        var predictBtn = document.createElement('button');
        predictBtn.className = 'btn btn-primary';
        predictBtn.textContent = '🔮 Predecir';
        predictBtn.onclick = async function() {
            errorEl.textContent = '';
            resultEl.textContent = '⏳ Prediciendo...';
            try {
                var raw = document.getElementById('ml-predict-input').value.trim();
                var parsed = JSON.parse(raw);
                var inputData = Array.isArray(parsed) ? parsed : [parsed];
                var columns = Object.keys(inputData[0]);
                var data = inputData.map(function(row) { return columns.map(function(c) { return row[c]; }); });
                var result = await _fetch('POST', '/api/ml/predict', {
                    model_id: modelId, data: data, columns: columns,
                });
                resultEl.textContent = JSON.stringify(result.predictions, null, 2);
            } catch (e) {
                errorEl.textContent = '❌ ' + e.message;
                resultEl.textContent = '';
            }
        };
        actions.appendChild(predictBtn);
        content.appendChild(actions);
        box.appendChild(content);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        textarea.focus();
    }

    async function detectAnomalies() {
        const results = document.getElementById('ml-results');
        if (!results) return;
        const datasetSelect = document.getElementById('ml-dataset-select');
        const datasetName = datasetSelect ? datasetSelect.value : '';
        if (!datasetName) { showToast('Selecciona un dataset primero', 'error'); return; }
        results.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-faint)">⏳ Detectando anomalías...</div>';
        try {
            const preview = await _fetch('POST', '/api/ml/dataset/preview', { filename: datasetName });
            const data = await _fetch('POST', '/api/ml/anomaly', {
                data: preview.preview, columns: preview.columns,
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
        results.innerHTML = '<div class="page-card" style="margin-bottom:12px">' +
            '<div class="page-card-header"><span class="page-card-icon">⚠️</span><span class="page-card-title">Anomalías detectadas</span></div>' +
            '<div class="page-card-body" style="padding:12px;font-size:11px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
            '<div style="padding:10px;background:var(--item-bg);border-radius:6px"><div style="font-weight:600;margin-bottom:4px">🔍 Outliers</div>' +
            '<div>Método: ' + escapeHtml(o.method || '—') + '</div>' +
            '<div>Detectados: <strong>' + (o.n_outliers || 0) + '</strong></div></div>' +
            '<div style="padding:10px;background:var(--item-bg);border-radius:6px"><div style="font-weight:600;margin-bottom:4px">📋 Calidad de datos</div>' +
            '<div>Filas: ' + (q.n_rows || 0) + '</div>' +
            '<div>Columnas: ' + (q.n_cols || 0) + '</div>' +
            '<div>Faltantes: ' + (q.missing_cells || 0) + ' (' + (typeof q.missing_pct === 'number' ? q.missing_pct.toFixed(1) : '—') + '%)</div></div>' +
            '</div>' +
            (im.recommendation ? '<div style="margin-top:10px;padding:10px;background:var(--item-bg);border-radius:6px">' +
                '<div style="font-weight:600;margin-bottom:4px">⚖️ Imbalance</div>' +
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
    };
})();
