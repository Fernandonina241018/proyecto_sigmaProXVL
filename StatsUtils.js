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
    function getNumericValues(data, colName) {
        if (!data || !data.headers || !data.data) return [];
        const idx = data.headers.indexOf(colName);
        if (idx === -1) return [];
        return data.data
            .map(row => {
                const val = Array.isArray(row) ? row[idx] : row[colName];
                return parseFloat(val);
            })
            .filter(v => !isNaN(v) && isFinite(v));
    }

    /**
     * Identifica columnas numéricas en los datos
     *
     * @param {Object} data - { headers: string[], data: Array[]|Object[] }
     * @param {Object} options - Configuración opcional
     * @param {number} options.threshold - Umbral mínimo de valores válidos (0-1, default 0.8)
     * @param {string[]} options.excludeColumns - Columnas a excluir (default: ['#', 'A', 'Row', 'index', etc.])
     * @returns {string[]} Array de nombres de columnas numéricas
     */
    function getNumericColumns(data, options = {}) {
        if (!data || !data.headers || !data.data) return [];

        const {
            threshold = 0.5,
            excludeColumns = ['#', 'A', 'Row', 'row', 'INDEX', 'index', 'row_index']
        } = options;

        return data.headers.filter(header => {
            if (excludeColumns.includes(header)) return false;

            const values = data.data.map(row => {
                const idx = data.headers.indexOf(header);
                return Array.isArray(row) ? row[idx] : row[header];
            });
            const numericCount = values.filter(v => !isNaN(parseFloat(v)) && isFinite(parseFloat(v))).length;

            return numericCount / values.length >= threshold;
        });
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
                if (val === null || val === '' || val === undefined || isNaN(parseFloat(val))) count++;
            });
        });
        return count;
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
        if (!values || values.length === 0) return 0;
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
        return Math.sqrt(calcularVarianza(values, esMuestral));
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
        return (calcularDesviacionEstandar(values) / mean) * 100;
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

        return {
            n: values.length,
            media: parseFloat(calcularMedia(values).toFixed(4)),
            mediana: parseFloat(calcularMediana(values).toFixed(4)),
            moda: calcularModa(values),
            de: parseFloat(calcularDesviacionEstandar(values).toFixed(4)),
            varianza: parseFloat(calcularVarianza(values).toFixed(4)),
            min: parseFloat(Math.min(...values).toFixed(4)),
            max: parseFloat(Math.max(...values).toFixed(4)),
            rango: parseFloat(calcularRango(values).toFixed(4)),
            q1: parseFloat(calcularPercentil(values, 25).toFixed(4)),
            q3: parseFloat(calcularPercentil(values, 75).toFixed(4)),
            iqr: parseFloat(calcularIQR(values).toFixed(4)),
            asimetria: parseFloat(calcularAsimetria(values).toFixed(4)),
            curtosis: parseFloat(calcularCurtosis(values).toFixed(4)),
            cv: parseFloat(calcularCoeficienteVariacion(values).toFixed(4)),
            se: parseFloat(calcularErrorEstandar(values).toFixed(4))
        };
    }

    // ========================================
    // API PÚBLICA
    // ========================================

    return {
        // Extracción y validación
        getNumericValues,
        getNumericColumns,
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
        resumenEstadistico
    };
})();
