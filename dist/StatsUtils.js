"use strict";
/**
 * StatsUtils.ts - Utilidades Estadísticas Centralizadas
 * StatAnalyzer Pro v2.0
 * Migrado a TypeScript
 */
const StatsUtils = (function () {
    'use strict';
    /**
     * Extrae valores numéricos válidos de una columna
     */
    function getNumericValues(data, colName) {
        if (!data || !data.headers || !data.data)
            return [];
        const idx = data.headers.indexOf(colName);
        if (idx === -1)
            return [];
        return data.data
            .map(row => {
            const val = Array.isArray(row) ? row[idx] : row[colName];
            return parseFloat(String(val));
        })
            .filter(v => !isNaN(v) && isFinite(v));
    }
    /**
     * Identifica columnas numéricas en los datos
     */
    function getNumericColumns(data, options = {}) {
        if (!data || !data.headers || !data.data)
            return [];
        const { threshold = 0.8, excludeColumns = ['#', 'A', 'Row', 'row', 'INDEX', 'index', 'row_index'] } = options;
        return data.headers.filter(header => {
            if (excludeColumns.includes(header))
                return false;
            const values = data.data.map(row => {
                const idx = data.headers.indexOf(header);
                return Array.isArray(row) ? row[idx] : row[header];
            });
            const numericCount = values.filter(v => {
                const num = parseFloat(String(v));
                return !isNaN(num) && isFinite(num);
            }).length;
            return numericCount / values.length >= threshold;
        });
    }
    /**
     * Cuenta valores faltantes en el dataset
     */
    function countMissingValues(data) {
        if (!data || !data.headers || !data.data)
            return 0;
        let count = 0;
        data.data.forEach(row => {
            data.headers.forEach((h, idx) => {
                const val = Array.isArray(row) ? row[idx] : row[h];
                if (val === null || val === '' || val === undefined || isNaN(parseFloat(String(val))))
                    count++;
            });
        });
        return count;
    }
    /**
     * Calcula la media aritmética
     */
    function calcularMedia(values) {
        if (!values || values.length === 0)
            return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }
    /**
     * Calcula la mediana
     */
    function calcularMediana(values) {
        if (!values || values.length === 0)
            return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
    }
    /**
     * Calcula la moda
     */
    function calcularModa(values) {
        if (!values || values.length === 0)
            return [];
        const frequency = {};
        let maxFreq = 0;
        values.forEach(val => {
            const key = val.toString();
            frequency[key] = (frequency[key] || 0) + 1;
            if (frequency[key] > maxFreq)
                maxFreq = frequency[key];
        });
        const modes = Object.keys(frequency)
            .filter(key => frequency[key] === maxFreq)
            .map(key => parseFloat(key));
        if (modes.length === values.length)
            return [];
        return modes;
    }
    /**
     * Calcula la varianza
     */
    function calcularVarianza(values, esMuestral = true) {
        if (!values || values.length === 0)
            return 0;
        const mean = calcularMedia(values);
        const sqDiffs = values.map(v => Math.pow(v - mean, 2));
        const divisor = esMuestral ? values.length - 1 : values.length;
        return sqDiffs.reduce((a, b) => a + b, 0) / divisor;
    }
    /**
     * Calcula la desviación estándar
     */
    function calcularDesviacionEstandar(values, esMuestral = true) {
        return Math.sqrt(calcularVarianza(values, esMuestral));
    }
    /**
     * Calcula el rango
     */
    function calcularRango(values) {
        if (!values || values.length === 0)
            return 0;
        return Math.max(...values) - Math.min(...values);
    }
    /**
     * Calcula el coeficiente de variación (%)
     */
    function calcularCoeficienteVariacion(values) {
        const mean = calcularMedia(values);
        if (mean === 0)
            return 0;
        return (calcularDesviacionEstandar(values) / mean) * 100;
    }
    /**
     * Calcula un percentil específico
     */
    function calcularPercentil(values, p) {
        if (!values || values.length === 0)
            return 0;
        if (p < 0 || p > 100)
            throw new Error('El percentil debe estar entre 0 y 100');
        const sorted = [...values].sort((a, b) => a - b);
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        if (lower === upper)
            return sorted[lower];
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }
    /**
     * Calcula cuartiles (Q1, Q2, Q3)
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
     */
    function calcularIQR(values) {
        const q = calcularCuartiles(values);
        return q.Q3 - q.Q1;
    }
    /**
     * Calcula la asimetría (Skewness)
     */
    function calcularAsimetria(values, esMuestral = true) {
        if (!values || values.length < 3)
            return 0;
        const n = values.length;
        const mean = calcularMedia(values);
        const std = calcularDesviacionEstandar(values, esMuestral);
        if (std === 0)
            return 0;
        const sumCubed = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 3), 0);
        if (esMuestral && n > 2) {
            return (n / ((n - 1) * (n - 2))) * sumCubed;
        }
        return sumCubed / n;
    }
    /**
     * Calcula la curtosis
     */
    function calcularCurtosis(values, esMuestral = true) {
        if (!values || values.length < 4)
            return 0;
        const n = values.length;
        const mean = calcularMedia(values);
        const std = calcularDesviacionEstandar(values, esMuestral);
        if (std === 0)
            return 0;
        const sumFourth = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 4), 0);
        if (esMuestral && n > 3) {
            const kurt = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sumFourth;
            const correction = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
            return kurt - correction;
        }
        return (sumFourth / n) - 3;
    }
    /**
     * Calcula la correlación de Pearson
     */
    function calcularCorrelacionPearson(x, y) {
        if (!x || !y)
            return 0;
        const n = Math.min(x.length, y.length);
        if (n < 3)
            return 0;
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
     * Calcula la covarianza
     */
    function calcularCovarianza(x, y) {
        if (!x || !y || x.length !== y.length)
            return 0;
        if (x.length < 2)
            return 0;
        const meanX = calcularMedia(x);
        const meanY = calcularMedia(y);
        const n = x.length;
        return x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0) / (n - 1);
    }
    /**
     * Detecta outliers usando IQR
     */
    function detectarOutliersIQR(values, options = {}) {
        const emptySimple = [];
        if (!values || values.length === 0) {
            return options.detailed
                ? { outliers: [], cantidad: 0, porcentaje: 0, limiteInferior: 0, limiteSuperior: 0, porcentajeOutliers: '0', detalles: [] }
                : emptySimple;
        }
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
     * Detecta outliers usando Z-Score
     */
    function detectarOutliersZScore(values, options = {}) {
        const emptySimple = [];
        if (!values || values.length === 0) {
            return options.detailed
                ? { outliers: [], cantidad: 0, porcentaje: 0, umbralZScore: 3, porcentajeOutliers: '0', detalles: [] }
                : emptySimple;
        }
        const { umbral = 3, detailed = false } = options;
        const mean = calcularMedia(values);
        const std = calcularDesviacionEstandar(values, true);
        if (std === 0) {
            return detailed
                ? { outliers: [], cantidad: 0, porcentaje: 0, umbralZScore: umbral, porcentajeOutliers: '0', detalles: [] }
                : emptySimple;
        }
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
    /**
     * Calcula el error estándar
     */
    function calcularErrorEstandar(values) {
        if (!values || values.length < 2)
            return 0;
        return calcularDesviacionEstandar(values, true) / Math.sqrt(values.length);
    }
    /**
     * Genera un resumen estadístico completo
     */
    function resumenEstadistico(values) {
        if (!values || values.length === 0)
            return { error: 'No hay datos válidos' };
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
    return {
        getNumericValues,
        getNumericColumns,
        countMissingValues,
        calcularMedia,
        calcularMediana,
        calcularModa,
        calcularVarianza,
        calcularDesviacionEstandar,
        calcularRango,
        calcularCoeficienteVariacion,
        calcularPercentil,
        calcularCuartiles,
        calcularIQR,
        calcularAsimetria,
        calcularCurtosis,
        calcularCorrelacionPearson,
        calcularCovarianza,
        detectarOutliersIQR,
        detectarOutliersZScore,
        calcularErrorEstandar,
        resumenEstadistico
    };
})();
console.log('✅ StatsUtils.ts cargado');
