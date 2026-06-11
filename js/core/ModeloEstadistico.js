/* ModeloEstadistico.js - Ensemble k-NN + CART
 * Aprende de cada analisis para recomendar la mejor prueba estadistica
 * Persistencia: localStorage bajo clave "sigmaPro_mlStatsModel"
 */
var ModeloEstadistico = (function () {
    'use strict';

    var CATEGORIES = {
        central_tendency: { label: 'Tendencia central', options: ['media', 'mediana', 'moda'] },
        correlation:      { label: 'Correlacion',       options: ['pearson', 'spearman', 'kendall'] },
        normality:        { label: 'Normalidad',        options: ['shapiro-wilk', 'anderson-darling', 'd-agostino'] },
        comparison:       { label: 'Comparacion',       options: ['t-test', 'mann-whitney'] },
        variability:      { label: 'Variabilidad',      options: ['desviacion-estandar', 'mad', 'rango-intercuartil'] }
    };

    var FEATURE_NAMES = [
        'n_rows', 'n_numeric_cols', 'n_cat_cols', 'ratio_cat_num',
        'has_outliers', 'distribution', 'shapiro_p', 'coef_variacion',
        'variance_ratio', 'correlation_strength', 'skewness_avg'
    ];

    var STORAGE_KEY = 'sigmaPro_mlStatsModel';
    var MAX_ANALYSES = 10000;
    var TREE_MAX_DEPTH = 4;
    var TREE_MIN_SAMPLES = 2;

    /* ── Seed academico (cold start) ──────────────────────────── */
    function seedData() {
        return [
            { n_rows: 20,  n_numeric_cols: 3, n_cat_cols: 1, ratio_cat_num: 0.33, has_outliers: 1, distribution: 0, shapiro_p: 0.01, coef_variacion: 45, variance_ratio: 8,  correlation_strength: 1, skewness_avg: 1.2,
              decisions: { central_tendency: 'mediana', correlation: 'spearman', normality: 'shapiro-wilk', comparison: 'mann-whitney', variability: 'mad' }, user_approved: true },
            { n_rows: 100, n_numeric_cols: 5, n_cat_cols: 2, ratio_cat_num: 0.40, has_outliers: 0, distribution: 1, shapiro_p: 0.45, coef_variacion: 18, variance_ratio: 2.5,correlation_strength: 2, skewness_avg: 0.15,
              decisions: { central_tendency: 'media', correlation: 'pearson', normality: 'd-agostino', comparison: 't-test', variability: 'desviacion-estandar' }, user_approved: true },
            { n_rows: 50,  n_numeric_cols: 4, n_cat_cols: 3, ratio_cat_num: 0.75, has_outliers: 0, distribution: 0, shapiro_p: 0.03, coef_variacion: 32, variance_ratio: 5,  correlation_strength: 1, skewness_avg: 0.8,
              decisions: { central_tendency: 'mediana', correlation: 'spearman', normality: 'anderson-darling', comparison: 'mann-whitney', variability: 'mad' }, user_approved: true },
            { n_rows: 200, n_numeric_cols: 6, n_cat_cols: 1, ratio_cat_num: 0.17, has_outliers: 1, distribution: 1, shapiro_p: 0.30, coef_variacion: 22, variance_ratio: 3,  correlation_strength: 2, skewness_avg: 0.3,
              decisions: { central_tendency: 'media', correlation: 'pearson', normality: 'shapiro-wilk', comparison: 't-test', variability: 'desviacion-estandar' }, user_approved: true },
            { n_rows: 15,  n_numeric_cols: 2, n_cat_cols: 2, ratio_cat_num: 1.00, has_outliers: 1, distribution: 0, shapiro_p: 0.005,coef_variacion: 55, variance_ratio: 12, correlation_strength: 0, skewness_avg: 1.8,
              decisions: { central_tendency: 'moda', correlation: 'kendall', normality: 'shapiro-wilk', comparison: 'mann-whitney', variability: 'mad' }, user_approved: true },
            { n_rows: 500, n_numeric_cols: 8, n_cat_cols: 0, ratio_cat_num: 0.00, has_outliers: 0, distribution: 1, shapiro_p: 0.62, coef_variacion: 12, variance_ratio: 1.8,correlation_strength: 2, skewness_avg: -0.1,
              decisions: { central_tendency: 'media', correlation: 'pearson', normality: 'd-agostino', comparison: 't-test', variability: 'desviacion-estandar' }, user_approved: true },
            { n_rows: 30,  n_numeric_cols: 3, n_cat_cols: 1, ratio_cat_num: 0.33, has_outliers: 0, distribution: 0, shapiro_p: 0.04, coef_variacion: 28, variance_ratio: 4,  correlation_strength: 1, skewness_avg: 0.7,
              decisions: { central_tendency: 'mediana', correlation: 'spearman', normality: 'anderson-darling', comparison: 'mann-whitney', variability: 'mad' }, user_approved: true },
            { n_rows: 300, n_numeric_cols: 7, n_cat_cols: 4, ratio_cat_num: 0.57, has_outliers: 1, distribution: 1, shapiro_p: 0.18, coef_variacion: 20, variance_ratio: 2.8,correlation_strength: 2, skewness_avg: 0.2,
              decisions: { central_tendency: 'media', correlation: 'spearman', normality: 'shapiro-wilk', comparison: 't-test', variability: 'desviacion-estandar' }, user_approved: true },
            { n_rows: 10,  n_numeric_cols: 2, n_cat_cols: 0, ratio_cat_num: 0.00, has_outliers: 0, distribution: 0, shapiro_p: 0.20, coef_variacion: 30, variance_ratio: 3,  correlation_strength: 1, skewness_avg: 0.5,
              decisions: { central_tendency: 'mediana', correlation: 'spearman', normality: 'shapiro-wilk', comparison: 'mann-whitney', variability: 'rango-intercuartil' }, user_approved: true },
            { n_rows: 1000,n_numeric_cols: 10,n_cat_cols: 2, ratio_cat_num: 0.20, has_outliers: 0, distribution: 1, shapiro_p: 0.55, coef_variacion: 10, variance_ratio: 1.5,correlation_strength: 2, skewness_avg: 0.05,
              decisions: { central_tendency: 'media', correlation: 'pearson', normality: 'd-agostino', comparison: 't-test', variability: 'desviacion-estandar' }, user_approved: true },
            { n_rows: 80,  n_numeric_cols: 4, n_cat_cols: 5, ratio_cat_num: 1.25, has_outliers: 1, distribution: 0, shapiro_p: 0.02, coef_variacion: 40, variance_ratio: 7,  correlation_strength: 0, skewness_avg: 1.5,
              decisions: { central_tendency: 'mediana', correlation: 'kendall', normality: 'anderson-darling', comparison: 'mann-whitney', variability: 'mad' }, user_approved: true },
            { n_rows: 150, n_numeric_cols: 5, n_cat_cols: 3, ratio_cat_num: 0.60, has_outliers: 0, distribution: 1, shapiro_p: 0.38, coef_variacion: 15, variance_ratio: 2,  correlation_strength: 2, skewness_avg: 0.1,
              decisions: { central_tendency: 'media', correlation: 'pearson', normality: 'shapiro-wilk', comparison: 't-test', variability: 'desviacion-estandar' }, user_approved: true },
            { n_rows: 25,  n_numeric_cols: 3, n_cat_cols: 1, ratio_cat_num: 0.33, has_outliers: 0, distribution: 1, shapiro_p: 0.50, coef_variacion: 14, variance_ratio: 2.2,correlation_strength: 1, skewness_avg: 0.2,
              decisions: { central_tendency: 'media', correlation: 'pearson', normality: 'shapiro-wilk', comparison: 't-test', variability: 'desviacion-estandar' }, user_approved: true },
            { n_rows: 75,  n_numeric_cols: 4, n_cat_cols: 0, ratio_cat_num: 0.00, has_outliers: 1, distribution: 0, shapiro_p: 0.008,coef_variacion: 48, variance_ratio: 9,  correlation_strength: 1, skewness_avg: 2.1,
              decisions: { central_tendency: 'mediana', correlation: 'spearman', normality: 'anderson-darling', comparison: 'mann-whitney', variability: 'mad' }, user_approved: true },
            { n_rows: 400, n_numeric_cols: 6, n_cat_cols: 2, ratio_cat_num: 0.33, has_outliers: 0, distribution: 1, shapiro_p: 0.48, coef_variacion: 16, variance_ratio: 2.1,correlation_strength: 3, skewness_avg: -0.05,
              decisions: { central_tendency: 'media', correlation: 'pearson', normality: 'd-agostino', comparison: 't-test', variability: 'desviacion-estandar' }, user_approved: true }
        ];
    }

    /* ── Feature extraction ───────────────────────────────────── */
    function extractFeatures(data) {
        var Stats = typeof StatsUtils !== 'undefined' ? StatsUtils : null;
        var features = {};
        var numericCols = [];
        var categoricalCols = [];

        if (Stats && data && data.headers) {
            numericCols = Stats.getNumericColumns ? Stats.getNumericColumns(data) : [];
            categoricalCols = data.headers.filter(function (h) { return numericCols.indexOf(h) === -1; });
        }

        features.n_rows = data && data.data ? data.data.length : 0;
        features.n_numeric_cols = numericCols.length;
        features.n_cat_cols = categoricalCols.length;
        features.ratio_cat_num = features.n_numeric_cols > 0 ? (features.n_cat_cols / features.n_numeric_cols) : 0;

        var allValues = [];
        numericCols.forEach(function (col) {
            var vals = Stats ? Stats.getNumericValues(data, col) : [];
            allValues = allValues.concat(vals);
        });

        features.has_outliers = 0;
        features.distribution = 1;
        features.shapiro_p = 0.5;
        features.coef_variacion = 20;
        features.variance_ratio = 1;
        features.correlation_strength = 1;
        features.skewness_avg = 0;

        if (allValues.length > 3) {
            if (Stats) {
                var outliers = Stats.detectarOutliersIQR ? Stats.detectarOutliersIQR(allValues) : [];
                features.has_outliers = outliers.length > 0 ? 1 : 0;
                features.skewness_avg = Stats.calcularAsimetria ? Stats.calcularAsimetria(allValues) : 0;
                var media = Stats.calcularMedia ? Stats.calcularMedia(allValues) : 0;
                var de = Stats.calcularDesviacionEstandar ? Stats.calcularDesviacionEstandar(allValues) : 1;
                features.coef_variacion = Math.abs(media) > 0.001 ? (de / Math.abs(media)) * 100 : 50;

                if (numericCols.length >= 2) {
                    var maxVar = -Infinity, minVar = Infinity;
                    numericCols.forEach(function (col) {
                        var v = Stats.getNumericValues(data, col);
                        if (v.length > 1) {
                            var varCol = Stats.calcularVarianza ? Stats.calcularVarianza(v) : 1;
                            if (isFinite(varCol) && varCol > 0) {
                                maxVar = Math.max(maxVar, varCol);
                                minVar = Math.min(minVar, varCol);
                            }
                        }
                    });
                    features.variance_ratio = minVar > 0 && isFinite(maxVar / minVar) ? maxVar / minVar : 1;
                }
            }

            var sorted = allValues.slice().sort(function (a, b) { return a - b; });
            var n = sorted.length;
            var mean = sorted.reduce(function (s, v) { return s + v; }, 0) / n;
            var sqSum = 0;
            for (var i = 0; i < n; i++) { sqSum += (sorted[i] - mean) * (sorted[i] - mean); }
            var variance = sqSum / (n - 1);
            var stdDev = Math.sqrt(variance);
            var skewNum = 0;
            for (var j = 0; j < n; j++) { skewNum += Math.pow((sorted[j] - mean) / Math.max(stdDev, 1e-10), 3); }
            var skew = (n / ((n - 1) * (n - 2))) * skewNum;

            var ksStat = 0;
            for (var k = 0; k < n; k++) {
                var ecdf = (k + 1) / n;
                var ncdf = normalCDF((sorted[k] - mean) / Math.max(stdDev, 1e-10));
                ksStat = Math.max(ksStat, Math.abs(ecdf - ncdf));
            }
            var pKS = Math.exp(-2 * ksStat * ksStat * n);
            features.shapiro_p = Math.min(1, Math.max(0.001, pKS));
            features.distribution = pKS > 0.05 ? 1 : 0;
            features.skewness_avg = skew;

            if (numericCols.length >= 2) {
                var firstCol = Stats ? Stats.getNumericValues(data, numericCols[0]) : [];
                var secondCol = Stats ? Stats.getNumericValues(data, numericCols[1]) : [];
                var minLen = Math.min(firstCol.length, secondCol.length);
                if (minLen > 2) {
                    var m1 = firstCol.reduce(function (s, v) { return s + v; }, 0) / minLen;
                    var m2 = secondCol.reduce(function (s, v) { return s + v; }, 0) / minLen;
                    var covNum = 0;
                    for (var ci = 0; ci < minLen; ci++) {
                        covNum += (firstCol[ci] - m1) * (secondCol[ci] - m2);
                    }
                    var cov = covNum / (minLen - 1);
                    var v1 = 0, v2 = 0;
                    for (var di = 0; di < minLen; di++) {
                        v1 += (firstCol[di] - m1) * (firstCol[di] - m1);
                        v2 += (secondCol[di] - m2) * (secondCol[di] - m2);
                    }
                    var r = Math.sqrt(v1 * v2) > 1e-10 ? cov / Math.sqrt((v1 / (minLen - 1)) * (v2 / (minLen - 1))) : 0;
                    features.correlation_strength = Math.abs(r) > 0.5 ? 2 : Math.abs(r) > 0.3 ? 1 : 0;
                }
            }
        }

        return features;
    }

    function normalCDF(x) {
        var a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
        var sign = x < 0 ? -1 : 1;
        x = Math.abs(x) / Math.sqrt(2);
        var t = 1 / (1 + p * x);
        var y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return 0.5 * (1 + sign * y);
    }

    /* ── Distancia entre features ─────────────────────────────── */
    function featureDistance(a, b) {
        var sum = 0;
        FEATURE_NAMES.forEach(function (name) {
            var diff = (a[name] || 0) - (b[name] || 0);
            sum += diff * diff;
        });
        return Math.sqrt(sum);
    }

    /* ── CART Decision Tree ───────────────────────────────────── */
    function buildTree(examples, category, depth) {
        if (!examples || examples.length === 0) {
            return { isLeaf: true, distribution: {}, count: 0 };
        }

        var counts = {};
        examples.forEach(function (ex) {
            var val = ex.decisions[category];
            if (val) { counts[val] = (counts[val] || 0) + 1; }
        });

        var uniqueClasses = Object.keys(counts);
        if (uniqueClasses.length <= 1 || depth >= TREE_MAX_DEPTH || examples.length <= TREE_MIN_SAMPLES) {
            var total = examples.length;
            var dist = {};
            uniqueClasses.forEach(function (c) { dist[c] = counts[c] / total; });
            return { isLeaf: true, distribution: dist, count: total, majority: uniqueClasses.reduce(function (a, b) { return counts[a] > counts[b] ? a : b; }, uniqueClasses[0]) };
        }

        var bestGini = Infinity, bestFeature = null, bestThreshold = null, bestLeft = [], bestRight = [];
        FEATURE_NAMES.forEach(function (feat) {
            var values = examples.map(function (ex) { return ex.features[feat] || 0; }).sort(function (a, b) { return a - b; });
            var thresholds = [];
            for (var i = 0; i < values.length - 1; i++) {
                if (values[i + 1] > values[i]) { thresholds.push((values[i] + values[i + 1]) / 2); }
            }
            thresholds.forEach(function (th) {
                var left = [], right = [];
                examples.forEach(function (ex) {
                    ((ex.features[feat] || 0) <= th ? left : right).push(ex);
                });
                if (left.length < TREE_MIN_SAMPLES || right.length < TREE_MIN_SAMPLES) return;

                var gini = 0;
                [left, right].forEach(function (group) {
                    var gCounts = {}, gTotal = group.length;
                    group.forEach(function (ex) { var v = ex.decisions[category]; if (v) gCounts[v] = (gCounts[v] || 0) + 1; });
                    var impurity = 1;
                    Object.keys(gCounts).forEach(function (c) { var p = gCounts[c] / gTotal; impurity -= p * p; });
                    gini += (gTotal / examples.length) * impurity;
                });

                if (gini < bestGini) {
                    bestGini = gini; bestFeature = feat; bestThreshold = th;
                    bestLeft = left; bestRight = right;
                }
            });
        });

        if (bestFeature === null || bestLeft.length < TREE_MIN_SAMPLES || bestRight.length < TREE_MIN_SAMPLES) {
            var ttl = examples.length;
            var dst = {};
            uniqueClasses.forEach(function (c) { dst[c] = counts[c] / ttl; });
            return { isLeaf: true, distribution: dst, count: ttl, majority: uniqueClasses.reduce(function (a, b) { return counts[a] > counts[b] ? a : b; }, uniqueClasses[0]) };
        }

        return {
            isLeaf: false,
            feature: bestFeature,
            threshold: bestThreshold,
            left: buildTree(bestLeft, category, depth + 1),
            right: buildTree(bestRight, category, depth + 1),
            gini: bestGini
        };
    }

    function predictTree(tree, features) {
        if (tree.isLeaf) return tree.distribution || {};
        var val = features[tree.feature] || 0;
        return val <= tree.threshold ? predictTree(tree.left, features) : predictTree(tree.right, features);
    }

    /* ── Constructor ──────────────────────────────────────────── */
    function ModeloEstadistico() {
        this.analyses = [];
        this.trees = {};
        this.weights = { knn: 0.5, tree: 0.5 };
        this.performance = { total: 0, accepted: 0, byCategory: {} };
        this._dirty = false;
        this._loaded = false;

        Object.keys(CATEGORIES).forEach(function (cat) {
            this.performance.byCategory[cat] = { total: 0, accepted: 0 };
            this.trees[cat] = null;
        }, this);
    }

    ModeloEstadistico.prototype.init = function () {
        if (!this._loaded) {
            var saved = this._load();
            if (saved) {
                this.analyses = saved.analyses || [];
                this.weights = saved.weights || { knn: 0.5, tree: 0.5 };
                this.performance = saved.performance || { total: 0, accepted: 0, byCategory: {} };
            } else {
                this.analyses = seedData();
                this._rebuildTrees();
                this._save();
            }
            this._loaded = true;
        }
        return this;
    };

    ModeloEstadistico.prototype.extractFeatures = function (data) {
        return extractFeatures(data);
    };

    /* ── Prediccion ───────────────────────────────────────────── */
    ModeloEstadistico.prototype.predict = function (features) {
        var results = {};
        var self = this;

        Object.keys(CATEGORIES).forEach(function (cat) {
            var knnProbs = self._predictKNN(cat, features);
            var treeProbs = self.trees[cat] ? predictTree(self.trees[cat], features) : {};
            var combined = {};
            var allOpts = CATEGORIES[cat].options;

            allOpts.forEach(function (opt) {
                var knnP = knnProbs[opt] || 0;
                var treeP = treeProbs[opt] || 0;
                combined[opt] = self.weights.knn * knnP + self.weights.tree * treeP;
            });

            var best = null, bestP = 0;
            allOpts.forEach(function (opt) {
                if (combined[opt] > bestP) { bestP = combined[opt]; best = opt; }
            });

            var entropy = 0;
            allOpts.forEach(function (opt) {
                var p = combined[opt] || 0;
                if (p > 0) entropy -= p * Math.log2(p);
            });
            var maxEntropy = Math.log2(allOpts.length);
            var confidence = maxEntropy > 0 ? bestP * (1 - entropy / maxEntropy) : bestP;

            results[cat] = {
                recommended: best,
                confidence: Math.round(confidence * 100),
                probabilities: combined,
                nNeighbors: Math.min(self.analyses.length, 20)
            };
        });

        return results;
    };

    /* ── k-NN ─────────────────────────────────────────────────── */
    ModeloEstadistico.prototype._predictKNN = function (category, features) {
        var self = this;
        var k = Math.max(3, Math.min(20, Math.floor(Math.sqrt(this.analyses.length))));
        var n = this.analyses.length;

        var distances = [];
        for (var i = 0; i < n; i++) {
            var dist = featureDistance(features, this.analyses[i].features);
            distances.push({ dist: dist, idx: i });
        }
        distances.sort(function (a, b) { return a.dist - b.dist; });

        var neighbors = distances.slice(0, k);
        var weights = {};
        var totalW = 0;

        neighbors.forEach(function (nb) {
            var w = 1 / (1 + nb.dist * nb.dist);
            var decision = self.analyses[nb.idx].decisions[category];
            if (decision) {
                weights[decision] = (weights[decision] || 0) + w;
                totalW += w;
            }
        });

        var probs = {};
        CATEGORIES[category].options.forEach(function (opt) {
            probs[opt] = totalW > 0 ? (weights[opt] || 0) / totalW : 1 / CATEGORIES[category].options.length;
        });

        return probs;
    };

    /* ── Entrenamiento (feedback loop) ────────────────────────── */
    ModeloEstadistico.prototype.train = function (features, decisions, approved) {
        var record = {
            features: features,
            decisions: decisions,
            user_approved: approved,
            timestamp: Date.now()
        };
        this.analyses.push(record);
        this.performance.total++;
        if (approved) { this.performance.accepted++; }

        Object.keys(decisions || {}).forEach(function (cat) {
            if (!this.performance.byCategory[cat]) {
                this.performance.byCategory[cat] = { total: 0, accepted: 0 };
            }
            this.performance.byCategory[cat].total++;
            if (approved) { this.performance.byCategory[cat].accepted++; }
        }, this);

        if (this.analyses.length > MAX_ANALYSES) {
            this.analyses = this.analyses.slice(-MAX_ANALYSES);
        }

        this._rebuildTrees();
        this._dirty = true;
        this._save();
    };

    /* ── Reconstruir arboles ──────────────────────────────────── */
    ModeloEstadistico.prototype._rebuildTrees = function () {
        var self = this;
        Object.keys(CATEGORIES).forEach(function (cat) {
            self.trees[cat] = buildTree(self.analyses, cat, 0);
        });
    };

    /* ── Persistencia ─────────────────────────────────────────── */
    ModeloEstadistico.prototype._save = function () {
        try {
            var data = {
                version: 1,
                analyses: this.analyses,
                weights: this.weights,
                performance: this.performance
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('[ModeloEstadistico] Error al guardar:', e.message);
        }
    };

    ModeloEstadistico.prototype._load = function () {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('[ModeloEstadistico] Error al cargar:', e.message);
            return null;
        }
    };

    /* ── API publica ──────────────────────────────────────────── */
    ModeloEstadistico.prototype.getStats = function () {
        var byCat = {};
        var self = this;
        Object.keys(CATEGORIES).forEach(function (cat) {
            var p = self.performance.byCategory[cat] || { total: 0, accepted: 0 };
            byCat[cat] = {
                label: CATEGORIES[cat].label,
                options: CATEGORIES[cat].options,
                total: p.total,
                accepted: p.accepted,
                accuracy: p.total > 0 ? Math.round((p.accepted / p.total) * 100) : 0
            };
        });

        return {
            totalAnalyses: this.analyses.length,
            totalRecommendations: this.performance.total,
            overallAccuracy: this.performance.total > 0 ? Math.round((this.performance.accepted / this.performance.total) * 100) : 0,
            byCategory: byCat,
            weights: this.weights,
            version: 1
        };
    };

    ModeloEstadistico.prototype.exportModel = function () {
        return JSON.stringify({
            version: 1,
            analyses: this.analyses,
            weights: this.weights,
            performance: this.performance,
            exportedAt: new Date().toISOString()
        }, null, 2);
    };

    ModeloEstadistico.prototype.importModel = function (jsonStr) {
        try {
            var data = JSON.parse(jsonStr);
            if (!data.analyses || !data.version) return { error: 'Formato invalido' };
            this.analyses = data.analyses;
            this.weights = data.weights || { knn: 0.5, tree: 0.5 };
            this.performance = data.performance || { total: 0, accepted: 0, byCategory: {} };
            this._rebuildTrees();
            this._save();
            return { success: true, count: this.analyses.length };
        } catch (e) {
            return { error: 'Error al importar: ' + e.message };
        }
    };

    ModeloEstadistico.prototype.clear = function () {
        this.analyses = [];
        this.performance = { total: 0, accepted: 0, byCategory: {} };
        this._rebuildTrees();
        this._save();
    };

    ModeloEstadistico.prototype.getLastDecisions = function (limit) {
        limit = limit || 10;
        return this.analyses.slice(-limit).reverse();
    };

    ModeloEstadistico.prototype.getCategories = function () {
        return CATEGORIES;
    };

    ModeloEstadistico.prototype.getFeatureNames = function () {
        return FEATURE_NAMES.slice();
    };

    /* ── Singleton ────────────────────────────────────────────── */
    var instance = null;
    return {
        getInstance: function () {
            if (!instance) { instance = new ModeloEstadistico(); }
            return instance;
        }
    };
})();
