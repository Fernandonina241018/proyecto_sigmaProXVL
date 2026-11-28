/**
 * StatsUtils.js - Utilidades Estadísticas Centralizadas
 * StatAnalyzer Pro v2.0
 *
 * Módulo centralizado que elimina duplicación de código entre:
 * - EDAManager.js
 * - EstadisticaDescriptiva.js
 * - Otros módulos que requieran cálculos estadísticos
 *
 * Todas las funciones son puras y testables.
 * Compatible con ambos formatos de datos (arrays y objetos).
 */

const StatsUtils = (function () {
    'use strict';

    // ========================================
    // VALIDACIÓN Y EXTRACCIÓN DE DATOS
    // ========================================

    /**
     * Extrae valores numéricos válidos de una columna
     * Compatible con datos en formato array de arrays o array de objetos
     *
     * @param {Object} data - { headers: string[], data: Array[]|Object[] }
     * @param {string} colName - Nombre de la columna
     * @returns {number[]} Array de valores numéricos válidos
     */
    // Política de parseo (auditoría EST-01): número completo con punto o
    // coma decimal (no ambos a la vez) y exponente opcional. "12abc" se
    // excluye y se cuenta; nunca se convierte en silencio.
    const _NUM_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
    let _exclusionesParseo = 0;

    // Columnas de índice que nunca son variables de análisis. Fuente única
    // para StatsUtils y el motor (indexx-stats-core).
    const BASE_INDEX_COLUMNS = ['#', 'A', 'Row', 'row', 'INDEX', 'index', 'row_index', 'No.', 'N°'];

    function parseNumeric(val) {
        if (typeof val === 'number') return isFinite(val) ? val : null;
        if (typeof val !== 'string') return null;
        const s = val.trim();
        if (!s) return null;
        const tieneComa = s.indexOf(',') >= 0;
        const tienePunto = s.indexOf('.') >= 0;
        // "1,000" puede ser 1000 o 1.000: no se adivina, se excluye.
        // Un cero a la izquierda ("0,500") descarta el separador de miles.
        // shortcut: coma con 3 dígitos se excluye siempre; si un dataset real
        // usa coma decimal con 3 dígitos, hay que declarar el formato por columna.
        if (tieneComa && !tienePunto && /^[+-]?[1-9]\d{0,2}(?:,\d{3})+$/.test(s)) return null;
        // Separadores mezclados (1.234,5 / 1,234.5) son ambiguos: se excluyen.
        const normalizado = tieneComa ? (tienePunto ? null : s.replace(/,/g, '.')) : s;
        if (normalizado == null || !_NUM_RE.test(normalizado)) return null;
        const n = Number(normalizado);
        return isFinite(n) ? n : null;
    }

    // Igual que parseNumeric, pero cuenta el texto no vacío que se excluye.
    function _extractNumeric(val) {
        const n = parseNumeric(val);
        if (n === null && val != null && String(val).trim() !== '') _exclusionesParseo++;
        return n;
    }

    function getExclusionesParseo() { return _exclusionesParseo; }
    function clearExclusionesParseo() { _exclusionesParseo = 0; }

    function getNumericValues(data, colName) {
        if (!data || !data.headers || !data.data) return [];
        const idx = data.headers.indexOf(colName);
        if (idx === -1) return [];
        return data.data
            .map(row => _extractNumeric(Array.isArray(row) ? row[idx] : row[colName]))
            .filter(v => v !== null);
    }

    /**
     * Identifica columnas numéricas en los datos.
     * Implementación canónica: todos los módulos (EstadisticaDescriptiva vía
     * indexx-stats-core, EDAManager, ModeloEstadistico, StateManager) delegan aquí.
     *
     * @param {Object} data - { headers: string[], data: Array[]|Object[] }
     * @param {Object} options - Configuración opcional
     * @param {number} options.threshold - Umbral mínimo de valores válidos (0-1, default 0.5)
     * @param {string[]} options.excludeColumns - Columnas a excluir (default: ['#', 'A', 'Row', 'index', etc.])
     * @param {number} options.sampleRows - Si > 0, solo evalúa las primeras N filas (fast-path para renders; default 0 = scan completo)
     * @returns {string[]} Array de nombres de columnas numéricas
     */
    // LOTE C: memo de columnas por fingerprint del dataset. Cada análisis
    // (descriptiva, EDA, modelo) re-parseaba todo por estadístico; con el
    // caché el 2º+ uso es O(1). LRU simple de 20 entradas; invalidación
    // explícita vía clearNumericColumnsCache() (StateManager lo llama al
    // importar/limpiar datos). Misma política de hash que getNumericCols.
    const _numColsCache = new Map();

    function _numColsFingerprint(data, threshold, excludeColumns, sampleRows) {
        const firstRow = data.data[0];
        const lastRow = data.data[data.data.length - 1];
        return [
            data.headers.join('|'), data.data.length,
            threshold, excludeColumns.join(','), sampleRows,
            firstRow ? JSON.stringify(firstRow).slice(0, 200) : '',
            lastRow ? JSON.stringify(lastRow).slice(0, 200) : '',
        ].join('~');
    }

    function clearNumericColumnsCache() {
        _numColsCache.clear();
    }

    function getNumericColumns(data, options = {}) {
        if (!data || !data.headers || !data.data) return [];

        const {
            threshold = 0.5,
            excludeColumns = BASE_INDEX_COLUMNS,
            sampleRows = 0
        } = options;

        const fp = _numColsFingerprint(data, threshold, excludeColumns, sampleRows);
        const hit = _numColsCache.get(fp);
        if (hit) {
            _numColsCache.delete(fp); // LRU: reinsertar al final
            _numColsCache.set(fp, hit);
            return hit.slice();
        }

        const rows = (sampleRows > 0) ? data.data.slice(0, sampleRows) : data.data;

        // Patrón para detectar fechas (ISO, YYYY-MM-DD, DD/MM/YYYY, etc.)
        const datePatterns = [
            /^\d{4}-\d{2}-\d{2}/, // ISO format: 2026-01-15
            /^\d{2}\/\d{2}\/\d{4}/, // DD/MM/YYYY or MM/DD/YYYY
            /^\d{1,2}-\d{1,2}-\d{2,4}/, // D-M-YY format
            /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}/i, // Named months
            /^\d{4}\/\d{2}\/\d{2}/ // YYYY/MM/DD
        ];

        const isDateLike = (val) => {
            const str = String(val).trim();
            return datePatterns.some(pattern => pattern.test(str));
        };

        const result = data.headers.filter(function(header) {
            if (excludeColumns.includes(header)) return false;
            const values = rows.map(function(row) {
                const idx = data.headers.indexOf(header);
                return Array.isArray(row) ? row[idx] : row[header];
            });
            const nonDateValues = values.filter(function(v) {
                const str = String(v).trim();
                return str !== '' && str !== null && !isDateLike(str);
            });
            if (nonDateValues.length === 0) return false;
            const numericCount = nonDateValues.filter(function(v) { return parseNumeric(v) !== null; }).length;
            return numericCount / nonDateValues.length >= threshold;
        });
        _numColsCache.set(fp, result.slice());
        if (_numColsCache.size > 20) {
            const oldest = _numColsCache.keys().next().value;
            _numColsCache.delete(oldest);
        }
        return result;
    }

    /**
     * Cuenta valores faltantes en el dataset
     *
     * @param {Object} data - { headers: string[], data: Array[]|Object[] }
     * @returns {number} Total de valores faltantes
     */
    function countMissingValues(data) {
        if (!data || !data.headers || !data.data) return 0;
        let count = 0;
        data.data.forEach(row => {
            data.headers.forEach((h, idx) => {
                const val = Array.isArray(row) ? row[idx] : row[h];
                if (val === null || val === '' || val === undefined || parseNumeric(val) === null) count++;
            });
        });
        return count;
    }

    /**
     * Analiza todas las columnas del dataset y reporta densidad, tipo, etc.
     *
     * @param {Object} data - { headers: string[], data: Array[]|Object[] }
     * @returns {Object[]} Array con { header, total, validos, numericRatio, density, type, viable }
     */
    function analyzeColumns(data) {
        if (!data || !data.headers || !data.data) return [];
        return data.headers.map(function(header) {
            const excludeCols = ['#', 'A', 'Row', 'row', 'INDEX', 'index', 'row_index'];
            if (excludeCols.includes(header)) return null;
            const idx = data.headers.indexOf(header);
            const values = data.data.map(function(row) {
                return Array.isArray(row) ? row[idx] : row[header];
            });
            const total = values.length;
            const validos = values.filter(function(v) {
                return v !== null && v !== '' && v !== undefined;
            }).length;
            const numericos = values.filter(function(v) {
                return parseNumeric(v) !== null;
            }).length;
            const density = validos / total;
            const numericRatio = total > 0 ? numericos / total : 0;
            let type = 'no-numerica';
            if (numericRatio >= 0.5) type = 'numerica';
            else if (numericRatio > 0) type = 'mixta';
            return {
                header: header,
                total: total,
                validos: validos,
                numericos: numericos,
                density: density,
                numericRatio: numericRatio,
                type: type,
                viable: numericRatio >= 0.5
            };
        }).filter(Boolean);
    }

    /**
     * Imputa valores no numéricos usando la media o la mediana de la columna.
     * Devuelve { metodo, celdasImputadas } para dejar traza del cambio.
     */
    function imputeColumn(data, colName, method) {
        method = method || 'media';
        const idx = data.headers.indexOf(colName);
        if (idx === -1) return null;
        const vals = data.data.map(function(row) {
            return parseNumeric(Array.isArray(row) ? row[idx] : row[colName]);
        }).filter(function(v) { return v !== null; });
        if (vals.length === 0) return null;
        let fill;
        if (method === 'mediana' || method === 'median') {
            const sorted = vals.slice().sort(function(a, b) { return a - b; });
            const mid = Math.floor(sorted.length / 2);
            fill = sorted.length % 2
                ? sorted[mid]
                : (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            fill = vals.reduce(function(a, b) { return a + b; }, 0) / vals.length;
        }
        let celdasImputadas = 0;
        data.data.forEach(function(row) {
            const v = Array.isArray(row) ? row[idx] : row[colName];
            if (parseNumeric(v) === null) {
                if (Array.isArray(row)) row[idx] = fill;
                else row[colName] = fill;
                celdasImputadas++;
            }
        });
        return { metodo: method, celdasImputadas: celdasImputadas };
    }

    // ========================================
    // MEDIDAS DE TENDENCIA CENTRAL
    // ========================================

    /**
     * Calcula la media aritmética
     * @param {number[]} values
     * @returns {number}
     */
    function calcularMedia(values) {
        if (!values || values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    /**
     * Calcula la mediana
     * @param {number[]} values
     * @returns {number}
     */
    function calcularMediana(values) {
        if (!values || values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    /**
     * Calcula la moda (puede retornar múltiples valores)
     * @param {number[]} values
     * @returns {number[]}
     */
    function calcularModa(values) {
        if (!values || values.length === 0) return [];

        const frequency = {};
        let maxFreq = 0;

        values.forEach(val => {
            const key = val.toString();
            frequency[key] = (frequency[key] || 0) + 1;
            if (frequency[key] > maxFreq) maxFreq = frequency[key];
        });

        const modes = Object.keys(frequency)
            .filter(key => frequency[key] === maxFreq)
            .map(key => parseFloat(key));

        if (modes.length === values.length) return [];
        return modes;
    }

    // ========================================
    // MEDIDAS DE DISPERSIÓN
    // ========================================

    /**
     * Calcula la varianza
     * @param {number[]} values
     * @param {boolean} esMuestral - true para varianza muestral (n-1), false para poblacional (n)
     * @returns {number}
     */
    function calcularVarianza(values, esMuestral = true) {
        if (!values || values.length === 0) return null;
        if (esMuestral && values.length < 2) return null;
        const mean = calcularMedia(values);
        const sqDiffs = values.map(v => Math.pow(v - mean, 2));
        const divisor = esMuestral ? values.length - 1 : values.length;
        return sqDiffs.reduce((a, b) => a + b, 0) / divisor;
    }

    /**
     * Calcula la desviación estándar
     * @param {number[]} values
     * @param {boolean} esMuestral
     * @returns {number}
     */
    function calcularDesviacionEstandar(values, esMuestral = true) {
        const varianza = calcularVarianza(values, esMuestral);
        return varianza == null ? null : Math.sqrt(varianza);
    }

    /**
     * Calcula el rango
     * @param {number[]} values
     * @returns {number}
     */
    function calcularRango(values) {
        if (!values || values.length === 0) return 0;
        return Math.max(...values) - Math.min(...values);
    }

    /**
     * Calcula el coeficiente de variación (%)
     * @param {number[]} values
     * @returns {number}
     */
    function calcularCoeficienteVariacion(values) {
        const mean = calcularMedia(values);
        if (mean === 0) return 0;
        const de = calcularDesviacionEstandar(values);
        return de == null ? null : (de / mean) * 100;
    }

    // ========================================
    // PERCENTILES Y CUARTILES
    // ========================================

    /**
     * Calcula un percentil específico usando interpolación lineal
     * @param {number[]} values
     * @param {number} p - Percentil (0-100)
     * @returns {number}
     */
    function calcularPercentil(values, p) {
        if (!values || values.length === 0) return 0;
        if (p < 0 || p > 100) throw new Error('El percentil debe estar entre 0 y 100');

        const sorted = [...values].sort((a, b) => a - b);
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        if (lower === upper) return sorted[lower];
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }

    /**
     * Calcula cuartiles (Q1, Q2, Q3)
     * @param {number[]} values
     * @returns {{Q1: number, Q2: number, Q3: number}}
     */
    function calcularCuartiles(values) {
        return {
            Q1: calcularPercentil(values, 25),
            Q2: calcularPercentil(values, 50),
            Q3: calcularPercentil(values, 75)
        };
    }

    /**
     * Calcula el rango intercuartílico (IQR)
     * @param {number[]} values
     * @returns {number}
     */
    function calcularIQR(values) {
        const q = calcularCuartiles(values);
        return q.Q3 - q.Q1;
    }

    // ========================================
    // MEDIDAS DE FORMA
    // ========================================

    /**
     * Calcula la asimetría (Skewness)
     * Usa corrección Fisher-Pearson para muestras
     *
     * @param {number[]} values
     * @param {boolean} esMuestral - true para corrección muestral
     * @returns {number}
     */
    function calcularAsimetria(values, esMuestral = true) {
        if (!values || values.length < 3) return 0;

        const n = values.length;
        const mean = calcularMedia(values);
        const std = calcularDesviacionEstandar(values, esMuestral);
        if (std === 0) return 0;

        const sumCubed = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 3), 0);

        if (esMuestral && n > 2) {
            // Corrección Fisher-Pearson para muestras
            return (n / ((n - 1) * (n - 2))) * sumCubed;
        }
        return sumCubed / n;
    }

    /**
     * Calcula la curtosis (exceso de curtosis, resta 3 para comparar con normal)
     *
     * @param {number[]} values
     * @param {boolean} esMuestral
     * @returns {number}
     */
    function calcularCurtosis(values, esMuestral = true) {
        if (!values || values.length < 4) return 0;

        const n = values.length;
        const mean = calcularMedia(values);
        const std = calcularDesviacionEstandar(values, esMuestral);
        if (std === 0) return 0;

        const sumFourth = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 4), 0);

        if (esMuestral && n > 3) {
            const kurt = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sumFourth;
            const correction = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
            return kurt - correction;
        }
        return (sumFourth / n) - 3;
    }

    // ========================================
    // CORRELACIÓN
    // ========================================

    /**
     * Calcula la correlación de Pearson entre dos variables
     *
     * @param {number[]} x
     * @param {number[]} y
     * @returns {number} Coeficiente de correlación (-1 a 1)
     */
    function calcularCorrelacionPearson(x, y) {
        if (!x || !y) return 0;
        const n = Math.min(x.length, y.length);
        if (n < 3) return 0;

        const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
        const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
        let num = 0, denX = 0, denY = 0;

        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            num += dx * dy;
            denX += dx * dx;
            denY += dy * dy;
        }

        const den = Math.sqrt(denX * denY);
        return den === 0 ? 0 : num / den;
    }

    /**
     * Calcula la covarianza entre dos variables
     * @param {number[]} x
     * @param {number[]} y
     * @returns {number}
     */
    function calcularCovarianza(x, y) {
        if (!x || !y || x.length !== y.length) return 0;
        if (x.length < 2) return 0;

        const meanX = calcularMedia(x);
        const meanY = calcularMedia(y);
        const n = x.length;

        return x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0) / (n - 1);
    }

    // ========================================
    // DETECCIÓN DE OUTLIERS
    // ========================================

    /**
     * Detecta outliers usando el método IQR
     * Outliers: valores fuera de [Q1 - 1.5*IQR, Q3 + 1.5*IQR]
     *
     * @param {number[]} values
     * @param {Object} options
     * @param {boolean} options.detailed - Si true, retorna objeto con metadata; si false, retorna array simple
     * @returns {Array|Object}
     */
    function detectarOutliersIQR(values, options = {}) {
        if (!values || values.length === 0) return options.detailed ? { outliers: [], cantidad: 0, porcentaje: 0, limiteInferior: 0, limiteSuperior: 0 } : [];

        const { detailed = false } = options;

        const q = calcularCuartiles(values);
        const iqr = q.Q3 - q.Q1;
        const lower = q.Q1 - 1.5 * iqr;
        const upper = q.Q3 + 1.5 * iqr;

        const outliers = [];
        values.forEach((v, i) => {
            if (v < lower || v > upper) {
                outliers.push({ index: i, value: v, method: 'IQR' });
            }
        });

        if (!detailed) {
            return outliers;
        }

        return {
            outliers: outliers.map(o => o.value),
            cantidad: outliers.length,
            porcentaje: (outliers.length / values.length) * 100,
            limiteInferior: lower,
            limiteSuperior: upper,
            porcentajeOutliers: ((outliers.length / values.length) * 100).toFixed(2),
            detalles: outliers
        };
    }

    /**
     * Detecta outliers usando el método Z-Score
     * Outliers: valores con |z-score| > umbral (default 3)
     *
     * @param {number[]} values
     * @param {Object} options
     * @param {number} options.umbral - Umbral Z-Score (default 3)
     * @param {boolean} options.detailed - Si true, retorna objeto con metadata
     * @returns {Array|Object}
     */
    function detectarOutliersZScore(values, options = {}) {
        if (!values || values.length === 0) return options.detailed ? { outliers: [], cantidad: 0, porcentaje: 0, umbralZScore: 3 } : [];

        const { umbral = 3, detailed = false } = options;

        const mean = calcularMedia(values);
        const std = calcularDesviacionEstandar(values, true);
        if (std === 0) return detailed ? { outliers: [], cantidad: 0, porcentaje: 0, umbralZScore: umbral } : [];

        const outliers = [];
        values.forEach((v, i) => {
            const z = Math.abs((v - mean) / std);
            if (z > umbral) {
                outliers.push({ index: i, value: v, zScore: parseFloat(z.toFixed(2)), method: 'Z-Score' });
            }
        });

        if (!detailed) {
            return outliers;
        }

        return {
            outliers: outliers.map(o => o.value),
            cantidad: outliers.length,
            porcentaje: (outliers.length / values.length) * 100,
            umbralZScore: umbral,
            porcentajeOutliers: ((outliers.length / values.length) * 100).toFixed(2),
            detalles: outliers
        };
    }

    // ========================================
    // ERRORES ESTADÍSTICOS
    // ========================================

    /**
     * Calcula el error estándar de la media
     * SE = desviación estándar / sqrt(n)
     *
     * @param {number[]} values
     * @returns {number}
     */
    function calcularErrorEstandar(values) {
        if (!values || values.length < 2) return 0;
        return calcularDesviacionEstandar(values, true) / Math.sqrt(values.length);
    }

    // ========================================
    // RESUMEN ESTADÍSTICO RÁPIDO
    // ========================================

    /**
     * Genera un resumen estadístico completo de una columna
     * Útil para dashboards y reportes rápidos
     *
     * @param {number[]} values
     * @returns {Object}
     */
    function resumenEstadistico(values) {
        if (!values || values.length === 0) return { error: 'No hay datos válidos' };

        const de = calcularDesviacionEstandar(values);
        const varianza = calcularVarianza(values);
        const cv = calcularCoeficienteVariacion(values);
        const redondear = (v) => v == null ? null : parseFloat(v.toFixed(4));
        return {
            n: values.length,
            media: redondear(calcularMedia(values)),
            mediana: redondear(calcularMediana(values)),
            moda: calcularModa(values),
            de: redondear(de),
            varianza: redondear(varianza),
            min: redondear(Math.min(...values)),
            max: redondear(Math.max(...values)),
            rango: redondear(calcularRango(values)),
            q1: redondear(calcularPercentil(values, 25)),
            q3: redondear(calcularPercentil(values, 75)),
            iqr: redondear(calcularIQR(values)),
            asimetria: redondear(calcularAsimetria(values)),
            curtosis: redondear(calcularCurtosis(values)),
            cv: redondear(cv),
            se: redondear(calcularErrorEstandar(values))
        };
    }

    /**
     * Columnas numéricas con la misma política que el motor de análisis
     * (umbral, exclusiones y "forzar" de columnAnalysisConfig).
     */
    function numericColumnsForAnalysis(data, config) {
        if (!data || !data.headers) return [];
        config = config || {};
        const excluded = BASE_INDEX_COLUMNS.concat(
            Array.isArray(config.excludeColumns) ? config.excludeColumns : []
        );
        if (config.forceInclude) {
            const info = analyzeColumns(data);
            const excludeSet = new Set(excluded);
            return info
                .filter(c => c.numericRatio > 0)
                .map(c => c.header)
                .filter(h => !excludeSet.has(h));
        }
        const threshold = Number.isFinite(Number(config.threshold)) ? Number(config.threshold) : 0.5;
        return getNumericColumns(data, { threshold, excludeColumns: excluded });
    }

    /**
     * Resumen de un resultado de test: p-valor y decisión según α.
     * No genera HTML; lo usan el panel de último resultado y los reportes.
     */
    function resumirResultado(resultado, alfa) {
        let pValue = null, sigTrue = false, sigFalse = false;
        const seen = new WeakSet();
        const scan = (o, depth) => {
            if (!o || typeof o !== 'object' || Array.isArray(o) || depth > 3 || seen.has(o)) return;
            seen.add(o);
            if (pValue === null && typeof o.valorP === 'number' && Number.isFinite(o.valorP)) pValue = o.valorP;
            if (pValue === null && typeof o.pValue === 'number' && Number.isFinite(o.pValue)) pValue = o.pValue;
            if (pValue === null && typeof o.p === 'number' && Number.isFinite(o.p)) pValue = o.p;
            if (o.significativo === true || o.significante === true) sigTrue = true;
            else if (o.significativo === false || o.significante === false) sigFalse = true;
            if (pValue === null) Object.keys(o).forEach(k => scan(o[k], depth + 1));
        };
        scan(resultado, 0);
        const a = Number.isFinite(Number(alfa)) ? Number(alfa) : 0.05;
        const significativo = sigTrue ? true : (sigFalse ? false : (pValue !== null ? pValue < a : null));
        return { pValue, significativo, alfa: a };
    }

    // ========================================
    // API PÚBLICA
    // ========================================

    return {
        // Extracción y validación
        BASE_INDEX_COLUMNS,
        getNumericValues,
        parseNumeric,
        getExclusionesParseo,
        clearExclusionesParseo,
        getNumericColumns,
        numericColumnsForAnalysis,
        resumirResultado,
        clearNumericColumnsCache,
        countMissingValues,

        // Tendencia central
        calcularMedia,
        calcularMediana,
        calcularModa,

        // Dispersión
        calcularVarianza,
        calcularDesviacionEstandar,
        calcularRango,
        calcularCoeficienteVariacion,

        // Percentiles
        calcularPercentil,
        calcularCuartiles,
        calcularIQR,

        // Forma
        calcularAsimetria,
        calcularCurtosis,

        // Correlación
        calcularCorrelacionPearson,
        calcularCovarianza,

        // Outliers
        detectarOutliersIQR,
        detectarOutliersZScore,

        // Errores
        calcularErrorEstandar,

        // Utilidades
        analyzeColumns,
        imputeColumn,
        resumenEstadistico
    };
})();

if (typeof window !== 'undefined') {
    window.StatsUtils = StatsUtils;
}
