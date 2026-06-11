/* MLStatsManager.js - Orquestador del modelo estadistico
 * Conecta ModeloEstadistico con el flujo de EDA y la UI
 */
var MLStatsManager = (function () {
    'use strict';

    var _model = null;
    var _initialized = false;
    var _lastFeatures = null;
    var _lastPredictions = null;

    function init() {
        if (_initialized) return;
        if (typeof ModeloEstadistico === 'undefined') {
            console.warn('[MLStatsManager] ModeloEstadistico no disponible');
            return;
        }
        _model = ModeloEstadistico.getInstance();
        _model.init();
        _initialized = true;
    }

    function extractFeatures(data) {
        if (!_model) init();
        if (!_model) return {};
        _lastFeatures = _model.extractFeatures(data);
        return _lastFeatures;
    }

    function predict(features) {
        if (!_model) init();
        if (!_model) return {};
        features = features || _lastFeatures;
        if (!features) return {};
        _lastPredictions = _model.predict(features);
        return _lastPredictions;
    }

    function train(features, decisions, approved) {
        if (!_model) init();
        if (!_model) return;
        _model.train(features || _lastFeatures, decisions, approved);
    }

    function getStats() {
        if (!_model) init();
        if (!_model) return null;
        return _model.getStats();
    }

    function getLastDecisions(limit) {
        if (!_model) init();
        if (!_model) return [];
        return _model.getLastDecisions(limit);
    }

    function exportModel() {
        if (!_model) init();
        if (!_model) return '{}';
        return _model.exportModel();
    }

    function importModel(jsonStr) {
        if (!_model) init();
        if (!_model) return { error: 'Modelo no disponible' };
        return _model.importModel(jsonStr);
    }

    function clear() {
        if (!_model) init();
        if (!_model) return;
        _model.clear();
    }

    /* ── Generar HTML de recomendaciones para resultados de EDA ── */
    function renderRecommendations(predictions) {
        if (!predictions) {
            predictions = _lastPredictions;
        }
        if (!predictions) return '';

        var labels = {
            central_tendency: 'Tendencia central',
            correlation: 'Correlacion',
            normality: 'Normalidad',
            comparison: 'Comparacion',
            variability: 'Variabilidad'
        };

        var displayNames = {
            media: 'Media',
            mediana: 'Mediana',
            moda: 'Moda',
            pearson: 'Pearson',
            spearman: 'Spearman',
            kendall: 'Kendall',
            'shapiro-wilk': 'Shapiro-Wilk',
            'anderson-darling': 'Anderson-Darling',
            'd-agostino': "D'Agostino-Pearson",
            't-test': 'T-Test',
            'mann-whitney': 'Mann-Whitney U',
            'desviacion-estandar': 'Desviacion Estandar',
            mad: 'MAD',
            'rango-intercuartil': 'Rango Intercuartil'
        };

        var html = '<div class="mlrec-wrap" style="margin-top:16px;padding:12px;background:var(--bg-dark,#1e1e2e);border:1px solid #2a2a3a;border-radius:8px;">';
        html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">';
        html += '<span style="font-size:18px;">🧠</span>';
        html += '<strong style="font-size:13px;color:#dcddde;">Recomendaciones del modelo estadistico</strong>';
        html += '</div>';

        Object.keys(predictions).forEach(function (cat) {
            var pred = predictions[cat];
            if (!pred || !pred.recommended) return;

            var conf = pred.confidence || 0;
            var confClass = conf >= 70 ? 'mlrec-high' : conf >= 40 ? 'mlrec-med' : 'mlrec-low';
            var displayName = displayNames[pred.recommended] || pred.recommended;

            html += '<div class="mlrec-row" style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12px;">';
            html += '<span style="min-width:130px;color:#b0b0b0;">' + (labels[cat] || cat) + ':</span>';
            html += '<span style="font-weight:600;color:#7ec7ff;">' + escHtml(displayName) + '</span>';
            html += '<span class="' + confClass + '" style="margin-left:auto;font-size:11px;padding:2px 6px;border-radius:4px;">';
            html += conf + '% confianza</span>';
            html += '<button class="mlrec-btn mlrec-like" data-cat="' + cat + '" data-opt="' + pred.recommended + '" style="background:none;border:1px solid #3a3a4a;border-radius:4px;padding:2px 6px;cursor:pointer;font-size:11px;color:#8f8;" title="Aceptar recomendacion">👍</button>';
            html += '<button class="mlrec-btn mlrec-dislike" data-cat="' + cat + '" style="background:none;border:1px solid #3a3a4a;border-radius:4px;padding:2px 6px;cursor:pointer;font-size:11px;color:#f88;" title="Rechazar recomendacion">👎</button>';
            html += '</div>';
        });

        html += '<div style="margin-top:8px;font-size:10px;color:#666;display:flex;justify-content:space-between;">';
        html += '<span>🤖 Ensemble k-NN + Arbol de decision</span>';
        html += '<span><a href="#" onclick="loadPage(\'modelo-estadistico\');return false;" style="color:#7ec7ff;">📊 Ver estadisticas del modelo</a></span>';
        html += '</div>';
        html += '</div>';

        return html;
    }

    function escHtml(str) {
        if (typeof escapeHtml === 'function') return escapeHtml(str);
        var d = document.createElement('div');
        d.textContent = String(str);
        return d.innerHTML;
    }

    function bindFeedbackButtons(container) {
        if (!container) container = document;
        container.querySelectorAll('.mlrec-like').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var cat = this.dataset.cat;
                var opt = this.dataset.opt;
                var decisions = {};
                decisions[cat] = opt;
                train(null, decisions, true);
                showToast('Recomendacion aceptada! El modelo aprendio.', 'success');
                this.disabled = true;
                this.style.opacity = '0.5';
                var dislike = this.parentNode.querySelector('.mlrec-dislike');
                if (dislike) { dislike.disabled = true; dislike.style.opacity = '0.5'; }
            });
        });
        container.querySelectorAll('.mlrec-dislike').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var cat = this.dataset.cat;
                showToast('Gracias por el feedback!', 'info');
                this.disabled = true;
                this.style.opacity = '0.5';
                var like = this.parentNode.querySelector('.mlrec-like');
                if (like) { like.disabled = true; like.style.opacity = '0.5'; }
            });
        });
    }

    /* ── Render page del modelo estadistico ──────────────────── */
    function renderModelPage() {
        var stats = getStats();
        if (!stats) {
            return '<div style="padding:20px;color:#888;">Modelo no disponible</div>';
        }

        var html = '<div class="mlstat-wrap" style="padding:16px;max-width:700px;margin:0 auto;">';

        html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">';
        html += '<span style="font-size:28px;">🧠</span>';
        html += '<div><h2 style="margin:0;font-size:18px;color:#dcddde;">Modelo Estadistico</h2>';
        html += '<p style="margin:2px 0 0;font-size:12px;color:#888;">Ensemble k-NN + CART · Aprende de cada analisis</p></div>';
        html += '</div>';

        /* KPI */
        html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;">';
        html += kpiBox('📊', 'Analisis aprendidos', stats.totalAnalyses);
        html += kpiBox('🎯', 'Recomendaciones', stats.totalRecommendations);
        html += kpiBox('✅', 'Precision global', stats.overallAccuracy + '%');
        html += '</div>';

        /* Precisión por categoría */
        html += '<div style="background:var(--bg-card,#252535);border-radius:8px;padding:14px;margin-bottom:16px;">';
        html += '<h3 style="margin:0 0 12px;font-size:14px;color:#dcddde;">Precision por categoria</h3>';
        Object.keys(stats.byCategory).forEach(function (cat) {
            var c = stats.byCategory[cat];
            var barW = c.accuracy || 0;
            html += '<div style="margin-bottom:10px;">';
            html += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;">';
            html += '<span style="color:#b0b0b0;">' + escHtml(c.label) + '</span>';
            html += '<span style="color:#dcddde;">' + c.accepted + '/' + c.total + ' (' + c.accuracy + '%)</span>';
            html += '</div>';
            html += '<div style="height:6px;background:#2a2a3a;border-radius:3px;overflow:hidden;">';
            html += '<div style="height:100%;width:' + barW + '%;background:linear-gradient(90deg,#4ade80,#22d3ee);border-radius:3px;transition:width 0.5s;"></div>';
            html += '</div></div>';
        });
        html += '</div>';

        /* Pesos ensemble */
        html += '<div style="background:var(--bg-card,#252535);border-radius:8px;padding:14px;margin-bottom:16px;">';
        html += '<h3 style="margin:0 0 8px;font-size:14px;color:#dcddde;">Pesos del ensemble</h3>';
        html += '<div style="display:flex;gap:20px;font-size:12px;">';
        html += '<span>k-NN: <strong>' + Math.round(stats.weights.knn * 100) + '%</strong></span>';
        html += '<span>Arbol: <strong>' + Math.round(stats.weights.tree * 100) + '%</strong></span>';
        html += '</div></div>';

        /* Últimas decisiones */
        var last = getLastDecisions(10);
        if (last && last.length > 0) {
            html += '<div style="background:var(--bg-card,#252535);border-radius:8px;padding:14px;margin-bottom:16px;">';
            html += '<h3 style="margin:0 0 12px;font-size:14px;color:#dcddde;">Ultimas decisiones aprendidas</h3>';
            last.forEach(function (rec, idx) {
                if (!rec.decisions) return;
                var decs = [];
                Object.keys(rec.decisions).forEach(function (cat) {
                    decs.push(rec.decisions[cat]);
                });
                html += '<div style="display:flex;gap:8px;font-size:11px;padding:4px 0;border-bottom:1px solid #2a2a3a;">';
                html += '<span style="color:#666;min-width:70px;">#' + (idx + 1) + '</span>';
                html += '<span style="color:#7ec7ff;">' + escHtml(decs.join(', ')) + '</span>';
                html += '<span style="margin-left:auto;color:#666;">' + (rec.user_approved ? '✅' : '') + '</span>';
                html += '</div>';
            });
            html += '</div>';
        }

        /* Acciones */
        html += '<div style="display:flex;gap:10px;flex-wrap:wrap;">';
        html += '<button class="btn btn-secondary" onclick="MLStatsManager.exportModelAction()" style="font-size:11px;">📥 Exportar modelo</button>';
        html += '<button class="btn btn-secondary" onclick="document.getElementById(\'mlstat-import-input\').click()" style="font-size:11px;">📤 Importar modelo</button>';
        html += '<input type="file" id="mlstat-import-input" accept=".json" style="display:none" onchange="MLStatsManager.importModelAction(this)">';
        html += '<button class="btn btn-danger" onclick="if(confirm(\'Borrar todo el modelo? Perderas todos los analisis aprendidos.\')){MLStatsManager.clearModel();loadPage(\'modelo-estadistico\')}" style="font-size:11px;">🗑 Reiniciar modelo</button>';
        html += '</div>';

        html += '<div style="margin-top:16px;padding:10px;background:#1a1a2a;border-radius:6px;font-size:11px;color:#888;">';
        html += '<strong style="color:#b0b0b0;">¿Como funciona?</strong><br>';
        html += 'Cada vez que ejecutas un analisis, el modelo extrae 11 caracteristicas del dataset (tamaño, distribucion, outliers, etc.) y las compara con analisis previos usando k-NN + CART. Cuando aceptas o rechazas una recomendacion, el modelo aprende y mejora para el proximo analisis.';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function kpiBox(icon, label, value) {
        return '<div style="background:var(--bg-card,#252535);border-radius:8px;padding:12px;text-align:center;">' +
            '<div style="font-size:20px;margin-bottom:4px;">' + icon + '</div>' +
            '<div style="font-size:22px;font-weight:700;color:#dcddde;">' + value + '</div>' +
            '<div style="font-size:11px;color:#888;margin-top:2px;">' + escHtml(label) + '</div></div>';
    }

    function exportModelAction() {
        var json = exportModel();
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'modelo-estadistico-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
        if (typeof showToast === 'function') showToast('Modelo exportado', 'success');
    }

    function importModelAction(input) {
        var file = input.files && input.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var result = importModel(e.target.result);
            if (result.error) {
                if (typeof showToast === 'function') showToast('Error: ' + result.error, 'error');
            } else {
                if (typeof showToast === 'function') showToast('Modelo importado: ' + result.count + ' analisis', 'success');
                loadPage('modelo-estadistico');
            }
        };
        reader.readAsText(file);
    }

    function clearModel() {
        clear();
    }

    return {
        init: init,
        extractFeatures: extractFeatures,
        predict: predict,
        train: train,
        getStats: getStats,
        getLastDecisions: getLastDecisions,
        exportModel: exportModel,
        importModel: importModel,
        clear: clear,
        renderRecommendations: renderRecommendations,
        bindFeedbackButtons: bindFeedbackButtons,
        renderModelPage: renderModelPage,
        exportModelAction: exportModelAction,
        importModelAction: importModelAction,
        clearModel: clearModel,
        getLastFeatures: function () { return _lastFeatures; },
        getLastPredictions: function () { return _lastPredictions; }
    };
})();
