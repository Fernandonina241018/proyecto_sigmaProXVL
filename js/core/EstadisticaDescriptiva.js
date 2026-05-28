// ========================================
// MÓDULO DE ESTADÍSTICA DESCRIPTIVA
// StatAnalyzer Pro v2.2 — REFACTORIZADO CON STATSUTILS
//
// REF-1: Funciones estadísticas básicas delegadas a StatsUtils.js
// REF-2: Se mantienen pruebas de hipótesis, correlaciones avanzadas,
//         regresiones y generación de reportes como lógica propia.
// ========================================

const EstadisticaDescriptiva = (() => {
    
    // ========================================
    // REF-1: Delegación a StatsUtils
    // ========================================
    
    const Stats = StatsUtils;

    // Aliases para mantener compatibilidad con la API pública existente
    const calcularMedia = Stats.calcularMedia;
    const calcularMediana = Stats.calcularMediana;
    const calcularModa = Stats.calcularModa;
    const calcularVarianza = Stats.calcularVarianza;
    const calcularDesviacionEstandar = Stats.calcularDesviacionEstandar;
    const calcularRango = Stats.calcularRango;
    const calcularCoeficienteVariacion = Stats.calcularCoeficienteVariacion;
    const calcularPercentil = Stats.calcularPercentil;
    const calcularCuartiles = Stats.calcularCuartiles;
    const calcularIQR = Stats.calcularIQR;
    const calcularAsimetria = Stats.calcularAsimetria;
    const calcularCurtosis = Stats.calcularCurtosis;
    const calcularErrorEstandar = Stats.calcularErrorEstandar;
    const calcularCovarianza = Stats.calcularCovarianza;
    const detectarOutliersIQR = Stats.detectarOutliersIQR;
    const detectarOutliersZScore = Stats.detectarOutliersZScore;
    
    /**
     * Calcula intervalos de confianza usando distribución t
     * Retorna IC al 95%, 90% y 99%
     */
    function calcularIntervalosConfianza(values) {
        values = values.filter(v => !isNaN(v) && isFinite(v));
        const n = values.length;
        if (n < 2) return { ic90: null, ic95: null, ic99: null };
        
        const media = Stats.calcularMedia(values);
        const se = Stats.calcularErrorEstandar(values);
        
        const df = n - 1;
        
        function tCritical(df, conf) {
            if (df >= 1 && df <= 29) {
                const t95 = [12.706,4.303,3.182,2.776,2.571,2.447,2.365,2.306,2.262,2.228,2.201,2.179,2.160,2.145,2.131,2.120,2.110,2.101,2.093,2.086,2.080,2.074,2.069,2.064,2.060,2.056,2.052,2.048,2.045];
                const t90 = [3.078,1.886,1.638,1.533,1.476,1.440,1.415,1.397,1.383,1.372,1.363,1.356,1.350,1.345,1.341,1.337,1.333,1.330,1.328,1.325,1.323,1.321,1.319,1.318,1.316,1.315,1.314,1.313,1.311];
                const t99 = [63.657,9.925,5.841,4.604,4.032,3.707,3.499,3.355,3.250,3.169,3.106,3.055,3.012,2.977,2.947,2.921,2.898,2.878,2.861,2.845,2.831,2.819,2.807,2.797,2.787,2.779,2.771,2.763,2.756];
                if (conf === 90) return t90[df - 1];
                if (conf === 95) return t95[df - 1];
                if (conf === 99) return t99[df - 1];
            }
            return { 90: 1.645, 95: 1.96, 99: 2.576 }[conf] || 1.96;
        }
        
        const t_values = { 90: tCritical(df, 90), 95: tCritical(df, 95), 99: tCritical(df, 99) };
        
        return {
            media: media,
            se: se,
            ic90: { inferior: media - (t_values[90] * se), superior: media + (t_values[90] * se), margen: t_values[90] * se },
            ic95: { inferior: media - (t_values[95] * se), superior: media + (t_values[95] * se), margen: t_values[95] * se },
            ic99: { inferior: media - (t_values[99] * se), superior: media + (t_values[99] * se), margen: t_values[99] * se }
        };
    }
    
    // ========================================
    // FUNCIONES PROPIAS NO DUPLICADAS
    // ========================================
    
    /**
     * Ordena un array de números (usada por Shapiro-Wilk y otras funciones avanzadas)
     */
    function sortNumbers(arr) {
        return [...arr].sort((a, b) => a - b);
    }
    
    // ========================================
    // UTILIDADES INTERNAS PROPIAS
    // ========================================
    
    /**
     * Valida y extrae valores numéricos de una columna
     * Versión con validación estricta (lanza error si no hay datos)
     */
    function getNumericValues(data, columnName) {
        const values = Stats.getNumericValues(data, columnName);
        
        if (values.length === 0) {
            throw new Error(`La columna "${columnName}" no contiene valores numéricos válidos`);
        }
        
        return values;
    }
    
    /**
     * Identifica columnas numéricas (umbral 80%, específico de este módulo)
     */
    function getNumericColumns(data) {
        return Stats.getNumericColumns(data, {
            threshold: 0.5,
            excludeColumns: ['#', 'Row', 'row', 'INDEX', 'index', 'row_index', 'No.', 'N°']
        });
    }
    
    // ========================================
    // FUNCIONES PROPIAS NO DUPLICADAS
    // ========================================
    
    /**
     * Calcula el RMSE (Root Mean Square Error)
     * Mide la diferencia promedio entre valores observados y predichos
     * Menor RMSE = mejor ajuste del modelo
     */
    function calcularRMSE(observados, predichos) {
        if (observados.length !== predichos.length) {
            throw new Error('Los arrays deben tener la misma longitud');
        }
        if (observados.length === 0) {
            throw new Error('Se necesitan al menos 1 par de datos');
        }
        
        const n = observados.length;
        const sumSquaredErrors = observados.reduce((acc, obs, i) => {
            const error = obs - predichos[i];
            return acc + error * error;
        }, 0);
        
        return Math.sqrt(sumSquaredErrors / n);
    }
    
    /**
     * Calcula el MAE (Mean Absolute Error)
     * Mide el error absoluto promedio entre observados y predichos
     * Más robusto a outliers que RMSE
     */
    function calcularMAE(observados, predichos) {
        if (observados.length !== predichos.length) {
            throw new Error('Los arrays deben tener la misma longitud');
        }
        if (observados.length === 0) {
            throw new Error('Se necesitan al menos 1 par de datos');
        }
        
        const n = observados.length;
        const sumAbsErrors = observados.reduce((acc, obs, i) => {
            return acc + Math.abs(obs - predichos[i]);
        }, 0);
        
        return sumAbsErrors / n;
    }
    
    /**
     * Calcula el R² (Coeficiente de determinación)
     * Proporción de la varianza explicada por el modelo
     * R² = 1: ajuste perfecto, R² = 0: no mejor que la media
     */
    function calcularR2(observados, predichos) {
        if (observados.length !== predichos.length) {
            throw new Error('Los arrays deben tener la misma longitud');
        }
        if (observados.length < 2) {
            throw new Error('Se necesitan al menos 2 pares de datos');
        }
        
        const meanObs = calcularMedia(observados);
        
        const ssTot = observados.reduce((acc, obs) => acc + Math.pow(obs - meanObs, 2), 0);
        const ssRes = observados.reduce((acc, obs, i) => acc + Math.pow(obs - predichos[i], 2), 0);
        
        if (ssTot === 0) return 0;
        
        return 1 - (ssRes / ssTot);
    }
    
    // ========================================
    // PRUEBAS DE HIPÓTESIS (INFERENCIAL)
    // ========================================

    /**
     * Aproximación del valor p para distribución t (bilateral)
     * Usa aproximación de Abramowitz & Stegun
     */
    function tDistributionCDF(t, df) {
        if (df <= 0) return 1;
        const x = df / (df + t * t);
        const a = df / 2;
        const b = 0.5;
        // Aproximación de la función Beta incompleta
        let sum = 0;
        let term = 1;
        for (let i = 0; i < 100; i++) {
            sum += term;
            term *= (a + i) * x / ((b + i) * (i + 1));
            if (Math.abs(term) < 1e-12) break;
        }
        const betaApprox = Math.exp(
            a * Math.log(x) + Math.log(sum) - Math.log(a) -
            lgamma(a) - lgamma(b) + lgamma(a + b)
        );
        return 1 - 0.5 * betaApprox;
    }

    /**
     * Log-gamma function (aproximación de Lanczos)
     */
    function lgamma(x) {
        const cof = [
            76.18009172947146, -86.50532032941677,
            24.01409824083091, -1.231739572450155,
            0.001208650973866179, -0.000005395239384953
        ];
        let y = x;
        let tmp = x + 5.5;
        tmp -= (x + 0.5) * Math.log(tmp);
        let ser = 1.000000000190015;
        for (let j = 0; j < 6; j++) ser += cof[j] / ++y;
        return -tmp + Math.log(2.5066282746310005 * ser / x);
    }

    /**
     * Aproximación del valor p bilateral para distribución t
     */
    function calcularValorP_T(t, df) {
        t = Math.abs(t);
        if (df <= 0 || t < 0) return 1;
        // Aproximación usando distribución normal para df grandes
        if (df > 30) {
            const z = t;
            const p = 2 * (1 - normalCDF(z));
            return Math.max(0, Math.min(1, p));
        }
        // Para df pequeños, usar aproximación de la distribución t
        const x = df / (df + t * t);
        const p = betaIncomplete(df / 2, 0.5, x);
        return Math.max(0, Math.min(1, p));
    }

    /**
     * Aproximación de la función Beta incompleta regularizada
     */
    function betaIncomplete(a, b, x) {
        if (x < 0 || x > 1) return 0;
        if (x === 0 || x === 1) return x;

        const lnBeta = lgamma(a) + lgamma(b) - lgamma(a + b);
        const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lnBeta) / a;

        // Lentz's algorithm para continued fraction
        let f = 1, c = 1, d = 0;
        for (let i = 0; i <= 200; i++) {
            let m = Math.floor(i / 2);
            let numerator;
            if (i === 0) {
                numerator = 1;
            } else if (i % 2 === 0) {
                numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
            } else {
                numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
            }
            d = 1 + numerator * d;
            if (Math.abs(d) < 1e-30) d = 1e-30;
            d = 1 / d;
            c = 1 + numerator / c;
            if (Math.abs(c) < 1e-30) c = 1e-30;
            f *= c * d;
            if (Math.abs(c * d - 1) < 1e-8) break;
        }
        return front * (f - 1);
    }

    /**
     * CDF de la distribución normal estándar (aproximación)
     */
    function normalCDF(x) {
        const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
        const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x) / Math.sqrt(2);
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return 0.5 * (1.0 + sign * y);
    }

    /**
     * Aproximación del valor p para distribución chi-cuadrado
     */
    function calcularValorP_ChiCuadrado(x2, df) {
        if (x2 < 0 || df <= 0) return 1;
        // Usar gamma incompleta inferior
        const p = gammaIncomplete(df / 2, x2 / 2);
        return Math.max(0, Math.min(1, 1 - p));
    }

    /**
     * Gamma incompleta inferior regularizada
     */
    function gammaIncomplete(a, x) {
        if (x < 0 || a <= 0) return 0;
        if (x === 0) return 0;
        if (x < a + 1) {
            // Serie
            let ap = a, sum = 1 / a, del = sum;
            for (let n = 1; n <= 100; n++) {
                del *= x / ++ap;
                sum += del;
                if (Math.abs(del) < Math.abs(sum) * 1e-8) break;
            }
            return sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
        } else {
            // Fracción continua
            let b = x + 1 - a, c = 1e30, d = 1 / b, h = d;
            for (let n = 1; n <= 100; n++) {
                const an = -n * (n - a);
                b += 2;
                d = an * d + b;
                if (Math.abs(d) < 1e-30) d = 1e-30;
                c = b + an / c;
                if (Math.abs(c) < 1e-30) c = 1e-30;
                d = 1 / d;
                const delta = d * c;
                h *= delta;
                if (Math.abs(delta - 1) < 1e-8) break;
            }
            return 1 - Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
        }
    }

    /**
     * T-Test de una muestra
     * Compara la media muestral con un valor hipotético
     */
    function calcularTTestUnaMuestra(values, mediaHipotesis = 0) {
        values = values.filter(v => !isNaN(v) && isFinite(v));
        const n = values.length;
        if (n < 2) return { error: 'Se necesitan al menos 2 observaciones válidas' };

        const media = calcularMedia(values);
        const sd = calcularDesviacionEstandar(values, true);
        if (sd === 0) return { error: 'La desviación estándar es cero (todos los valores iguales)' };
        const se = sd / Math.sqrt(n);
        const t = (media - mediaHipotesis) / se;
        const df = n - 1;
        const valorP = calcularValorP_T(t, df);

        return {
            prueba: 'T-Test (una muestra)',
            mediaMuestral: media,
            mediaHipotesis: mediaHipotesis,
            desviacionEstandar: sd,
            errorEstandar: se,
            estadisticoT: t,
            gradosLibertad: df,
            valorP: valorP,
            significativo: valorP < 0.05,
            interpretacion: valorP < 0.05
                ? `Se rechaza H₀ (p=${valorP.toFixed(4)} < 0.05). La media (${media.toFixed(4)}) es significativamente diferente de ${mediaHipotesis}.`
                : `No se rechaza H₀ (p=${valorP.toFixed(4)} ≥ 0.05). No hay evidencia suficiente para concluir que la media difiere de ${mediaHipotesis}.`
        };
    }

    /**
     * T-Test de dos muestras independientes
     * Compara las medias de dos grupos
     */
    function calcularTTestDosMuestras(values) {
        if (!Array.isArray(values) || values.length !== 2) {
            return { error: 'Se requieren exactamente 2 grupos de datos' };
        }

        const grupo1 = values[0].filter(v => !isNaN(v) && isFinite(v));
        const grupo2 = values[1].filter(v => !isNaN(v) && isFinite(v));

        if (grupo1.length < 2 || grupo2.length < 2) {
            return { error: 'Cada grupo necesita al menos 2 observaciones' };
        }

        const n1 = grupo1.length, n2 = grupo2.length;
        const media1 = calcularMedia(grupo1), media2 = calcularMedia(grupo2);
        const var1 = calcularVarianza(grupo1, true), var2 = calcularVarianza(grupo2, true);

        // Welch's t-test (no asume varianzas iguales)
        const se = Math.sqrt(var1 / n1 + var2 / n2);
        if (se === 0) return { error: 'Ambos grupos tienen varianza cero (datos constantes)' };
        const t = (media1 - media2) / se;

        // Grados de libertad de Welch-Satterthwaite
        const num = Math.pow(var1 / n1 + var2 / n2, 2);
        const den = Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1);
        const df = num / den;

        const valorP = calcularValorP_T(t, df);

        return {
            prueba: 'T-Test (dos muestras)',
            grupo1: { n: n1, media: media1, varianza: var1 },
            grupo2: { n: n2, media: media2, varianza: var2 },
            diferenciaMedias: media1 - media2,
            estadisticoT: t,
            gradosLibertad: df,
            valorP: valorP,
            significativo: valorP < 0.05,
            interpretacion: valorP < 0.05
                ? `Se rechaza H₀ (p=${valorP.toFixed(4)} < 0.05). Las medias son significativamente diferentes.`
                : `No se rechaza H₀ (p=${valorP.toFixed(4)} ≥ 0.05). No hay diferencia significativa entre las medias.`
        };
    }

    /**
     * Test de Mann-Whitney U (Wilcoxon rank-sum)
     * Alternativa no-paramétrica al t-test de dos muestras
     * No asume distribución normal ni varianzas iguales
     */
    function calcularMannWhitneyU(grupo1, grupo2) {
        if (!Array.isArray(grupo1) || !Array.isArray(grupo2)) {
            return { error: 'Se requieren dos arrays de datos' };
        }
        if (grupo1.length < 3 || grupo2.length < 3) {
            return { error: 'Cada grupo necesita al menos 3 observaciones' };
        }

        const n1 = grupo1.length;
        const n2 = grupo2.length;

        // Combinar y ordenar con etiquetas de grupo
        const combined = [
            ...grupo1.map(v => ({ valor: v, grupo: 1 })),
            ...grupo2.map(v => ({ valor: v, grupo: 2 }))
        ].sort((a, b) => a.valor - b.valor);

        // Asignar rangos (manejar empates con promedio)
        const rangos = new Array(combined.length);
        let i = 0;
        while (i < combined.length) {
            const currentVal = combined[i].valor;
            let j = i;
            while (j < combined.length && combined[j].valor === currentVal) {
                j++;
            }
            const rangoPromedio = (i + 1 + j) / 2;
            for (let k = i; k < j; k++) {
                rangos[k] = rangoPromedio;
            }
            i = j;
        }

        // Suma de rangos por grupo
        let R1 = 0, R2 = 0;
        combined.forEach((item, idx) => {
            if (item.grupo === 1) R1 += rangos[idx];
            else R2 += rangos[idx];
        });

        // Calcular U para cada grupo
        const U1 = R1 - (n1 * (n1 + 1)) / 2;
        const U2 = R2 - (n2 * (n2 + 1)) / 2;
        const U = Math.min(U1, U2);

        // Estadístico z (aproximación normal para muestras grandes)
        const meanU = (n1 * n2) / 2;
        const sdU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
        const z = (U - meanU) / sdU;

        // Valor p bilateral
        const p = 2 * normalCDF(z);

        // Tamaño del efecto (r de correlación)
        const N = n1 + n2;
        const r = Math.abs(z) / Math.sqrt(N);

        // Interpretación del tamaño del efecto
        let efecto = '';
        if (r >= 0.5) efecto = 'grande';
        else if (r >= 0.3) efecto = 'moderado';
        else if (r >= 0.1) efecto = 'pequeño';
        else efecto = 'muy pequeño o nulo';

        const mediana1 = calcularMediana(grupo1);
        const mediana2 = calcularMediana(grupo2);

        return {
            prueba: 'Test de Mann-Whitney U',
            grupo1: { n: n1, mediana: mediana1, sumaRangos: R1 },
            grupo2: { n: n2, mediana: mediana2, sumaRangos: R2 },
            U1: parseFloat(U1.toFixed(4)),
            U2: parseFloat(U2.toFixed(4)),
            U: parseFloat(U.toFixed(4)),
            z: parseFloat(z.toFixed(4)),
            valorP: parseFloat(p.toFixed(6)),
            significativo: p < 0.05,
            tamanoEfecto: parseFloat(r.toFixed(4)),
            interpretacionEfecto: efecto,
            interpretacion: p < 0.05
                ? `Se rechaza H₀ (p=${p.toFixed(4)} < 0.05). Las distribuciones son significativamente diferentes. Efecto ${efecto} (r=${r.toFixed(3)}).`
                : `No se rechaza H₀ (p=${p.toFixed(4)} ≥ 0.05). No hay diferencia significativa entre las distribuciones.`
        };
    }

    /**
     * Test de Kruskal-Wallis
     * Alternativa no-paramétrica al ANOVA One-Way
     * Compara 3 o más grupos sin asumir distribución normal
     */
    function calcularKruskalWallis(grupos) {
        if (!Array.isArray(grupos) || grupos.length < 3) {
            return { error: 'Se necesitan al menos 3 grupos' };
        }

        const k = grupos.length;
        const N = grupos.reduce((sum, g) => sum + g.length, 0);
        if (N < 5) return { error: 'Se necesitan al menos 5 observaciones en total' };

        // Combinar todos los datos con etiquetas de grupo
        const combined = [];
        grupos.forEach((g, gi) => {
            g.forEach(v => combined.push({ valor: v, grupo: gi }));
        });
        combined.sort((a, b) => a.valor - b.valor);

        // Asignar rangos (manejar empates)
        const rangos = new Array(combined.length);
        let i = 0;
        let sumaCorreccionEmpates = 0;
        while (i < combined.length) {
            const currentVal = combined[i].valor;
            let j = i;
            while (j < combined.length && combined[j].valor === currentVal) {
                j++;
            }
            const rangoPromedio = (i + 1 + j) / 2;
            const t = j - i; // número de empates
            if (t > 1) {
                sumaCorreccionEmpates += (t * t * t - t);
            }
            for (let idx = i; idx < j; idx++) {
                rangos[idx] = rangoPromedio;
            }
            i = j;
        }

        // Suma de rangos por grupo
        const sumasRangos = new Array(k).fill(0);
        const tamanos = grupos.map(g => g.length);
        combined.forEach((item, idx) => {
            sumasRangos[item.grupo] += rangos[idx];
        });

        // Estadístico H
        let H = 0;
        for (let gi = 0; gi < k; gi++) {
            H += (sumasRangos[gi] * sumasRangos[gi]) / tamanos[gi];
        }
        H = (12 / (N * (N + 1))) * H - 3 * (N + 1);

        // Corrección por empates
        if (sumaCorreccionEmpates > 0) {
            const C = 1 - sumaCorreccionEmpates / (N * N * N - N);
            if (C > 0) H = H / C;
        }

        // Grados de libertad
        const df = k - 1;

        // Valor p usando aproximación chi-cuadrado
        const p = calcularValorP_ChiCuadrado(H, df);

        // Medianas por grupo
        const medianas = grupos.map(g => calcularMediana(g));

        return {
            prueba: 'Test de Kruskal-Wallis',
            grupos: k,
            totalObservaciones: N,
            medianas: medianas.map((m, i) => ({ grupo: i + 1, mediana: parseFloat(m.toFixed(4)) })),
            sumasRangos: sumasRangos.map((s, i) => ({ grupo: i + 1, suma: parseFloat(s.toFixed(4)) })),
            H: parseFloat(H.toFixed(4)),
            df: df,
            valorP: parseFloat(p.toFixed(6)),
            significativo: p < 0.05,
            interpretacion: p < 0.05
                ? `Se rechaza H₀ (p=${p.toFixed(4)} < 0.05). Al menos un grupo tiene una distribución diferente.`
                : `No se rechaza H₀ (p=${p.toFixed(4)} ≥ 0.05). No hay diferencia significativa entre los grupos.`
        };
    }

    /**
     * Test de Wilcoxon (signed-rank test)
     * Para muestras pareadas - alternativa no paramétrica al t-test pareado
     */
    function calcularWilcoxon(datos1, datos2) {
        if (!Array.isArray(datos1) || !Array.isArray(datos2) || datos1.length !== datos2.length) {
            return { error: 'Las muestras deben tener el mismo tamaño' };
        }
        
        const n = datos1.length;
        if (n < 5) return { error: 'Se necesitan al menos 5 observaciones' };
        
        // Calcular diferencias
        const diferencias = [];
        for (let i = 0; i < n; i++) {
            const diff = datos2[i] - datos1[i];
            if (diff !== 0) {  // Ignorar diferencias cero
                diferencias.push({ diff: Math.abs(diff), sign: Math.sign(diff) });
            }
        }
        
        if (diferencias.length < 5) {
            return { error: 'Se necesitan al menos 5 diferencias no cero' };
        }
        
        // Ordenar por valor absoluto
        diferencias.sort((a, b) => a.diff - b.diff);
        
        // Asignar rangos (manejar empates)
        const rangos = new Array(diferencias.length);
        let correccionEmpates = 0;
        let i = 0;
        while (i < diferencias.length) {
            const currentVal = diferencias[i].diff;
            let j = i;
            while (j < diferencias.length && diferencias[j].diff === currentVal) {
                j++;
            }
            const rangoPromedio = (i + 1 + j) / 2;
            const t = j - i;
            if (t > 1) {
                correccionEmpates += (t * t * t - t);
            }
            for (let idx = i; idx < j; idx++) {
                rangos[idx] = rangoPromedio;
            }
            i = j;
        }
        
        // Calcular estadístico W (suma de rangos positivos o negativos)
        let Wpos = 0;
        let Wneg = 0;
        diferencias.forEach((d, idx) => {
            if (d.sign > 0) Wpos += rangos[idx];
            else Wneg += rangos[idx];
        });
        
        const W = Math.min(Wpos, Wneg);
        
        // Calcular valor p (aproximación normal para n > 25, sino tabla exacta)
        const N = diferencias.length;
        const meanW = (N * (N + 1)) / 4;
        let varW = (N * (N + 1) * (2 * N + 1)) / 24;
        
        // Corrección por empates
        if (correccionEmpates > 0) {
            varW -= (correccionEmpates / (24 * N * (N - 1)));
        }
        
        const z = (W - meanW) / Math.sqrt(varW);
        const p = 2 * (1 - normalCDF(Math.abs(z))); // Bilateral
        
        return {
            prueba: 'Test de Wilcoxon',
            n: N,
            W: parseFloat(W.toFixed(4)),
            Wpositivo: parseFloat(Wpos.toFixed(4)),
            Wnegativo: parseFloat(Wneg.toFixed(4)),
            z: parseFloat(z.toFixed(4)),
            valorP: parseFloat(p.toFixed(6)),
            significativo: p < 0.05,
            interpretacion: p < 0.05
                ? `Se rechaza H₀ (p=${p.toFixed(4)} < 0.05). Hay diferencia significativa entre las distribuciones.`
                : `No se rechaza H₀ (p=${p.toFixed(4)} ≥ 0.05). No hay diferencia significativa.`
        };
    }

    /**
     * Test de Friedman
     * Para datos de bloques aleatorizados (k tratamientos, n bloques)
     */
    function calcularFriedman(tratamientos) {
        if (!Array.isArray(tratamientos) || tratamientos.length < 3) {
            return { error: 'Se necesitan al menos 3 tratamientos' };
        }
        
        const k = tratamientos.length;  // número de tratamientos
        const n = tratamientos[0].length;  // número de bloques
        
        if (n < 3) return { error: 'Se necesitan al menos 3 bloques' };
        
        // Verificar que todos los tratamientos tengan el mismo número de bloques
        for (let i = 1; i < k; i++) {
            if (tratamientos[i].length !== n) {
                return { error: 'Todos los tratamientos deben tener el mismo número de bloques' };
            }
        }
        
        // Asignar rangos dentro de cada bloque
        const rangosPorBloque = [];
        for (let bloque = 0; bloque < n; bloque++) {
            const valoresConIdx = [];
            for (let tr = 0; tr < k; tr++) {
                valoresConIdx.push({ tr, val: tratamientos[tr][bloque] });
            }
            valoresConIdx.sort((a, b) => a.valor - b.valor);
            
            const rangosBloque = new Array(k);
            let i = 0;
            while (i < k) {
                const currentVal = valoresConIdx[i].val;
                let j = i;
                while (j < k && valoresConIdx[j].val === currentVal) {
                    j++;
                }
                const rangoPromedio = (i + 1 + j) / 2;
                for (let idx = i; idx < j; idx++) {
                    rangosBloque[valoresConIdx[idx].tr] = rangoPromedio;
                }
                i = j;
            }
            rangosPorBloque.push(rangosBloque);
        }
        
        // Calcular suma de rangos por tratamiento
        const sumasRangos = new Array(k).fill(0);
        rangosPorBloque.forEach(bloque => {
            bloque.forEach((r, tr) => {
                sumasRangos[tr] += r;
            });
        });
        
        // Estadístico de Friedman
        let chiSq = 0;
        for (let tr = 0; tr < k; tr++) {
            chiSq += (sumasRangos[tr] * sumasRangos[tr]);
        }
        const ChiSq = (12 / (n * k * (k + 1))) * chiSq - 3 * n * (k + 1);
        
        // Grados de libertad
        const df = k - 1;
        
        // Valor p
        const p = calcularValorP_ChiCuadrado(ChiSq, df);
        
        return {
            prueba: 'Test de Friedman',
            tratamientos: k,
            bloques: n,
            sumasRangos: sumasRangos.map((s, i) => ({ tratamiento: i + 1, suma: parseFloat(s.toFixed(4)) })),
            ChiSq: parseFloat(ChiSq.toFixed(4)),
            df: df,
            valorP: parseFloat(p.toFixed(6)),
            significativo: p < 0.05,
            interpretacion: p < 0.05
                ? `Se rechaza H₀ (p=${p.toFixed(4)} < 0.05). Al menos un tratamiento tiene efecto diferente.`
                : `No se rechaza H₀ (p=${p.toFixed(4)} ≥ 0.05). No hay diferencia significativa entre tratamientos.`
        };
    }

    /**
     * Test de Signos (Sign test)
     * Para muestras pareadas - prueba no paramétrica simple
     */
    function calcularTestSignos(datos1, datos2) {
        if (!Array.isArray(datos1) || !Array.isArray(datos2)) {
            return { error: 'Datos inválidos' };
        }
        
        const n = Math.min(datos1.length, datos2.length);
        if (n < 5) return { error: 'Se necesitan al menos 5 observaciones' };
        
        // Contar signos
        let positivos = 0;
        let negativos = 0;
        let ceros = 0;
        
        for (let i = 0; i < n; i++) {
            const diff = datos2[i] - datos1[i];
            if (diff > 0) positivos++;
            else if (diff < 0) negativos++;
            else ceros++;
        }
        
        const N = positivos + negativos; // Ignorar ceros
        if (N < 5) return { error: 'Se necesitan al menos 5 diferencias no cero' };
        
        // Usar el menor de los dos conteos como estadístico
        const k = Math.min(positivos, negativos);
        
        // Aproximación normal (con corrección de continuidad)
        const mean = N / 2;
        const varianza = N / 4;
        const z = (k - mean - 0.5) / Math.sqrt(varianza);
        
        // Valor p bilateral
        const p = 2 * (1 - normalCDF(Math.abs(z)));
        
        return {
            prueba: 'Test de Signos',
            n: n,
            ceros: ceros,
            positivos: positivos,
negativos: negativos,
            k: k,
            z: parseFloat(z.toFixed(4)),
            valorP: parseFloat(p.toFixed(6)),
            significativo: p < 0.05,
            interpretacion: p < 0.05
                ? `Se rechaza H₀ (p=${p.toFixed(4)} < 0.05). Hay diferencia significativa en la mediana.`
                : `No se rechaza H₀ (p=${p.toFixed(4)} ≥ 0.05). No hay diferencia significativas.`
        };
    }

    /**
     * Bootstrap - Remuestreo para estimar distribuciones muestrales
     */
    function calcularBootstrap(values, statName = 'media', B = 1000, nivelConfianza = 0.95) {
        values = values.filter(v => !isNaN(v) && isFinite(v));
        const n = values.length;
        if (n < 10) {
            return { error: 'Se necesitan al menos 10 observaciones válidas para bootstrap' };
        }

        // Función para calcular el estadístico
        const calcularEstadistico = (data, stat) => {
            switch (stat) {
                case 'media':
                    return calcularMedia(data);
                case 'mediana':
                    return calcularMediana(data);
                case 'desviacion':
                    return calcularDesviacionEstandar(data);
                case 'varianza':
                    return calcularVarianza(data);
                default:
                    return calcularMedia(data);
            }
        };

        // Estimación puntual del estadístico original
        const estimacion = calcularEstadistico(values, statName);

        // Remuestreo bootstrap
        const bootstrapEstimates = [];
        for (let i = 0; i < B; i++) {
            const resample = [];
            for (let j = 0; j < n; j++) {
                resample.push(values[Math.floor(Math.random() * n)]);
            }
            bootstrapEstimates.push(calcularEstadistico(resample, statName));
        }

        // Ordenar para percentiles
        bootstrapEstimates.sort((a, b) => a - b);

        // Error estándar bootstrap
        const mediaBootstrap = bootstrapEstimates.reduce((a, b) => a + b, 0) / B;
        const seBootstrap = Math.sqrt(bootstrapEstimates.reduce((sum, v) => sum + Math.pow(v - mediaBootstrap, 2), 0) / (B - 1));

        // Intervalos de confianza
        const alpha = 1 - nivelConfianza;
        const idxLo = Math.floor(B * alpha / 2);
        const idxHi = Math.floor(B * (1 - alpha / 2));

        const ic95Lo = bootstrapEstimates[idxLo];
        const ic95Hi = bootstrapEstimates[idxHi];

        // Sesgo bootstrap
        const sesgo = mediaBootstrap - estimacion;

        // Percentiles adicionales
        const p25 = bootstrapEstimates[Math.floor(B * 0.25)];
        const p50 = bootstrapEstimates[Math.floor(B * 0.50)];
        const p75 = bootstrapEstimates[Math.floor(B * 0.75)];

        return {
            prueba: 'Bootstrap',
            estimador: statName,
            estimacion: estimacion,
            se_bootstrap: seBootstrap,
            sesgo: sesgo,
            ic: {
                nivel: nivelConfianza,
                inferior: ic95Lo,
                superior: ic95Hi
            },
            distribucion: {
                min: bootstrapEstimates[0],
                p25: p25,
                mediana: p50,
                p75: p75,
                max: bootstrapEstimates[B - 1]
            },
            B: B,
            n: n,
            interpretacion: `Estimación: ${estimacion.toFixed(4)} (SE=${seBootstrap.toFixed(4)}). IC ${(nivelConfianza * 100)}%: [${ic95Lo.toFixed(4)}, ${ic95Hi.toFixed(4)}] con ${B} remuestreos.`
        };
    }

    /**
     * Bootstrap - ANOVA One-Way
     * Compara las medias de 3 o más grupos
     */
    function calcularANOVA(grupos) {
        if (!Array.isArray(grupos) || grupos.length < 2) {
            return { error: 'Se necesitan al menos 2 grupos' };
        }

        const k = grupos.length;
        const N = grupos.reduce((sum, g) => sum + g.length, 0);
        if (N < k + 1) return { error: 'Datos insuficientes para ANOVA' };

        const mediaTotal = calcularMedia(grupos.flat());

        // Suma de cuadrados entre grupos (SSB)
        let ssb = 0;
        grupos.forEach(g => {
            const mediaG = calcularMedia(g);
            ssb += g.length * Math.pow(mediaG - mediaTotal, 2);
        });

        // Suma de cuadrados dentro de grupos (SSW)
        let ssw = 0;
        grupos.forEach(g => {
            const mediaG = calcularMedia(g);
            g.forEach(v => { ssw += Math.pow(v - mediaG, 2); });
        });

        const dfEntre = k - 1;
        const dfDentro = N - k;
        const msb = ssb / dfEntre;
        const msw = ssw / dfDentro;
        const f = msb / msw;

        // Valor p para F (aproximación)
        const valorP = calcularValorP_F(f, dfEntre, dfDentro);

        return {
            prueba: 'ANOVA One-Way',
            grupos: k,
            totalObservaciones: N,
            SSB: ssb,
            SSW: ssw,
            MSB: msb,
            MSW: msw,
            estadisticoF: f,
            dfEntre: dfEntre,
            dfDentro: dfDentro,
            valorP: valorP,
            significativo: valorP < 0.05,
            interpretacion: valorP < 0.05
                ? `Se rechaza H₀ (p=${valorP.toFixed(4)} < 0.05). Al menos una media es significativamente diferente.`
                : `No se rechaza H₀ (p=${valorP.toFixed(4)} ≥ 0.05). No hay diferencias significativas entre las medias.`
        };
    }

    /**
     * Aproximación del valor p para distribución F
     */
    function calcularValorP_F(f, df1, df2) {
        if (f < 0 || df1 <= 0 || df2 <= 0) return 1;
        const x = df2 / (df2 + df1 * f);
        const p = betaIncomplete(df2 / 2, df1 / 2, x);
        return Math.max(0, Math.min(1, p));
    }

    /**
     * ANOVA Two-Way (sin interacción)
     * Análisis de varianza con dos factores
     */
    function calcularANOVA2Factores(datos, factor1Labels, factor2Labels) {
        if (!Array.isArray(datos) || datos.length === 0) {
            return { error: 'Datos no válidos' };
        }

        const filas = factor1Labels.length;
        const cols = factor2Labels.length;
        const N = datos.flat().length;
        const mediaTotal = calcularMedia(datos.flat());

        // SS Total
        let ssTotal = 0;
        datos.flat().forEach(v => { ssTotal += Math.pow(v - mediaTotal, 2); });

        // SS Factor 1 (filas)
        let ssF1 = 0;
        for (let i = 0; i < filas; i++) {
            const mediaFila = calcularMedia(datos[i]);
            ssF1 += cols * Math.pow(mediaFila - mediaTotal, 2);
        }

        // SS Factor 2 (columnas)
        let ssF2 = 0;
        for (let j = 0; j < cols; j++) {
            const colVals = datos.map(row => row[j]);
            const mediaCol = calcularMedia(colVals);
            ssF2 += filas * Math.pow(mediaCol - mediaTotal, 2);
        }

        const ssError = ssTotal - ssF1 - ssF2;
        const dfF1 = filas - 1, dfF2 = cols - 1;
        const dfError = (filas - 1) * (cols - 1);

        if (dfF1 === 0 || dfF2 === 0) return { error: 'Cada factor necesita al menos 2 niveles' };
        if (dfError === 0) return { error: 'No hay réplicas para estimar el error (necesita más de 1 observación por celda)' };

        const msF1 = ssF1 / dfF1, msF2 = ssF2 / dfF2, msError = ssError / dfError;
        const f1 = msF1 / msError, f2 = msF2 / msError;

        return {
            prueba: 'ANOVA Two-Way',
            factor1: { SS: ssF1, MS: msF1, F: f1, df: dfF1, p: calcularValorP_F(f1, dfF1, dfError) },
            factor2: { SS: ssF2, MS: msF2, F: f2, df: dfF2, p: calcularValorP_F(f2, dfF2, dfError) },
            error: { SS: ssError, MS: msError, df: dfError },
            total: { SS: ssTotal, df: N - 1 },
            interpretacion: `Factor 1: ${calcularValorP_F(f1, dfF1, dfError) < 0.05 ? 'Significativo' : 'No significativo'}. Factor 2: ${calcularValorP_F(f2, dfF2, dfError) < 0.05 ? 'Significativo' : 'No significativo'}.`
        };
    }

    /**
     * Prueba Chi-Cuadrado de independencia
     */
    function calcularChiCuadrado(tabla) {
        if (!Array.isArray(tabla) || tabla.length < 2 || !tabla.every(row => Array.isArray(row))) {
            return { error: 'Se necesita una tabla de contingencia válida (mínimo 2x2)' };
        }
        const cols = tabla[0].length;
        if (cols < 2) return { error: 'La tabla de contingencia necesita al menos 2 columnas' };
        if (!tabla.every(row => row.length === cols)) {
            return { error: 'Todas las filas de la tabla deben tener el mismo número de columnas' };
        }

        const filas = tabla.length;
        const N = tabla.flat().reduce((a, b) => a + b, 0);
        if (N === 0) return { error: 'La tabla de contingencia está vacía (suma total = 0)' };

        // Totales marginales
        const totalFilas = tabla.map(row => row.reduce((a, b) => a + b, 0));
        const totalCols = [];
        for (let j = 0; j < cols; j++) {
            totalCols.push(tabla.reduce((sum, row) => sum + row[j], 0));
        }

        // Valores esperados y chi-cuadrado
        let chi2 = 0;
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < cols; j++) {
                const esperado = (totalFilas[i] * totalCols[j]) / N;
                if (esperado > 0) {
                    chi2 += Math.pow(tabla[i][j] - esperado, 2) / esperado;
                }
            }
        }

        const df = (filas - 1) * (cols - 1);
        const valorP = calcularValorP_ChiCuadrado(chi2, df);

        return {
            prueba: 'Chi-Cuadrado',
            tablaObservada: tabla,
            totalFilas: totalFilas,
            totalColumnas: totalCols,
            N: N,
            estadisticoChi2: chi2,
            gradosLibertad: df,
            valorP: valorP,
            significativo: valorP < 0.05,
            interpretacion: valorP < 0.05
                ? `Se rechaza H₀ (p=${valorP.toFixed(4)} < 0.05). Las variables son dependientes (asociación significativa).`
                : `No se rechaza H₀ (p=${valorP.toFixed(4)} ≥ 0.05). Las variables son independientes.`
        };
    }

    /**
     * Test de Normalidad (Jarque-Bera)
     * Verifica si los datos siguen distribución normal
     */
    function calcularTestNormalidad(values) {
        values = values.filter(v => !isNaN(v) && isFinite(v));
        const n = values.length;
        if (n < 8) return { error: 'Se necesitan al menos 8 observaciones válidas' };

        const asimetria = calcularAsimetria(values, true);
        const curtosis = calcularCurtosis(values, true);

        // Estadístico Jarque-Bera
        const jb = (n / 6) * (Math.pow(asimetria, 2) + Math.pow(curtosis, 2) / 4);
        const df = 2;
        const valorP = calcularValorP_ChiCuadrado(jb, df);

        return {
            prueba: 'Test de Normalidad (Jarque-Bera)',
            asimetria: asimetria,
            curtosis: curtosis,
            estadisticoJB: jb,
            gradosLibertad: df,
            valorP: valorP,
            esNormal: valorP >= 0.05,
            interpretacion: valorP >= 0.05
                ? `No se rechaza H₀ (p=${valorP.toFixed(4)} ≥ 0.05). Los datos pueden seguir distribución normal.`
                : `Se rechaza H₀ (p=${valorP.toFixed(4)} < 0.05). Los datos NO siguen distribución normal.`
         };
       }
     
     /**
      * Test de Shapiro-Wilk para normalidad
      * Más potente que Jarque-Bera para muestras pequeñas (n < 50)
      * H₀: Los datos siguen una distribución normal
      */
     function calcularShapiroWilk(values) {
         values = values.filter(v => !isNaN(v) && isFinite(v));
         const n = values.length;
         if (n < 3) return { error: 'Se necesitan al menos 3 observaciones válidas' };
         if (n > 5000) return { error: 'El test de Shapiro-Wilk está limitado a 5000 observaciones' };

         const sorted = sortNumbers(values);
         const mean = calcularMedia(sorted);

         // Coeficientes de Shapiro-Wilk (aproximación)
         // Para n <= 50, usar tabla de coeficientes
         // Para n > 50, usar aproximación de Royston
         const a = calcularCoeficientesSW(n);

         // Estadístico W
         const b = sorted.reduce((sum, xi, i) => sum + a[i] * xi, 0);
         const W = (b * b) / sorted.reduce((sum, xi) => sum + Math.pow(xi - mean, 2), 0);

         // Valor p usando aproximación
         const p = calcularValorP_ShapiroWilk(W, n);

         return {
             prueba: 'Test de Shapiro-Wilk',
             n: n,
             estadisticoW: parseFloat(W.toFixed(6)),
             valorP: parseFloat(p.toFixed(6)),
             esNormal: p >= 0.05,
             interpretacion: p >= 0.05
                 ? `No se rechaza H₀ (p=${p.toFixed(4)} ≥ 0.05). Los datos pueden seguir distribución normal.`
                 : `Se rechaza H₀ (p=${p.toFixed(4)} < 0.05). Los datos NO siguen distribución normal.`
         };
     }

     /**
      * Calcula coeficientes de Shapiro-Wilk
      * Aproximación basada en valores esperados de orden normal
      */
     function calcularCoeficientesSW(n) {
         const a = new Array(n);
         const m = new Array(n);

         // Valores esperados de orden normal (aproximación de Blom)
         for (let i = 0; i < n; i++) {
             m[i] = normalInverseCDF((i + 1 - 0.375) / (n + 0.25));
         }

         // Normalizar
         const mSqSum = m.reduce((sum, mi) => sum + mi * mi, 0);
         const factor = 1 / Math.sqrt(mSqSum);

         for (let i = 0; i < n; i++) {
             a[i] = m[i] * factor;
         }

         return a;
     }

     /**
      * Calcula valor p para Shapiro-Wilk
      * Usa tabla de valores críticos interpolada para n=3 a 5000
      */
     function calcularValorP_ShapiroWilk(W, n) {
         // Tabla de valores críticos de Shapiro-Wilk para alpha=0.05
         // Fuente: Royston (1995), Approximating Shapiro-Wilk test
         const tablaCritica = {
             3: 0.767, 4: 0.748, 5: 0.762, 6: 0.788, 7: 0.803,
             8: 0.818, 9: 0.829, 10: 0.842, 11: 0.850, 12: 0.859,
             13: 0.866, 14: 0.874, 15: 0.881, 16: 0.887, 17: 0.892,
             18: 0.897, 19: 0.901, 20: 0.905, 25: 0.918, 30: 0.927,
             35: 0.934, 40: 0.940, 45: 0.944, 50: 0.947, 60: 0.952,
             70: 0.956, 80: 0.959, 90: 0.962, 100: 0.964, 150: 0.971,
             200: 0.976, 300: 0.981, 400: 0.984, 500: 0.986, 1000: 0.991,
             2000: 0.994, 5000: 0.997
         };

         // Encontrar valores críticos más cercanos
         const keys = Object.keys(tablaCritica).map(Number).sort((a,b)=>a-b);
         let lower = keys[0], upper = keys[keys.length - 1];

         for (let i = 0; i < keys.length - 1; i++) {
             if (n >= keys[i] && n <= keys[i+1]) {
                 lower = keys[i];
                 upper = keys[i+1];
                 break;
             }
         }

         // Interpolación lineal del valor crítico
         const wCrit = tablaCritica[lower] + (tablaCritica[upper] - tablaCritica[lower]) * (n - lower) / (upper - lower);

         // Si W > valor crítico, no se rechaza H0 (datos normales)
         // Calcular p-value aproximado basado en distancia al valor crítico
         if (W >= wCrit) {
             // p > 0.05, estimar cuánto mayor
             const diff = W - wCrit;
             const p = Math.min(0.99, 0.05 + diff * 5);
             return p;
         } else {
             // p < 0.05, estimar cuánto menor
             const diff = wCrit - W;
             const p = Math.max(0.001, 0.05 - diff * 5);
             return p;
         }
     }

     /**
      * Función inversa de la CDF normal (aproximación de Beasley-Springer-Moro)
      */
     function normalInverseCDF(p) {
         if (p <= 0) return -Infinity;
         if (p >= 1) return Infinity;
         if (p === 0.5) return 0;

         // Aproximación racional
         const a = [
             -3.969683028665376e+01, 2.209460984245205e+02,
             -2.759285104469687e+02, 1.383577518672690e+02,
             -3.066479806614716e+01, 2.506628277459239e+00
         ];
         const b = [
             -5.447609879822406e+01, 1.615858368580409e+02,
             -1.556989798598866e+02, 6.680131188771972e+01,
             -1.328068155288572e+01
         ];
         const c = [
             -7.784894002430293e-03, -3.223964580411365e-01,
             -2.400758277161838e+00, -2.549732539343734e+00,
             4.374664141464968e+00, 2.938163982698783e+00
         ];
         const d = [
             7.784695709041462e-03, 3.224671290700398e-01,
             2.445134137142996e+00, 3.754408661907416e+00
         ];

         const pLow = 0.02425;
         const pHigh = 1 - pLow;

         let q, r;

         if (p < pLow) {
             q = Math.sqrt(-2 * Math.log(p));
             return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
         } else if (p <= pHigh) {
             q = p - 0.5;
             r = q * q;
             return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
                    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
         } else {
             q = Math.sqrt(-2 * Math.log(1 - p));
             return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                     ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
         }
      }

      // ========================================
      // PRUEBAS DE NORMALIDAD ADICIONALES (FASE 1)
      // ========================================

      /**
       * Test de Kolmogorov-Smirnov para normalidad (una muestra)
       * Compara la distribución empírica con la distribución normal teórica
       * H₀: Los datos siguen una distribución normal
       * Menos potente que Shapiro-Wilk pero útil para muestras grandes
       */
      function calcularKolmogorovSmirnov(values) {
          const n = values.length;
          if (n < 5) return { error: 'Se necesitan al menos 5 observaciones' };

          const sorted = sortNumbers(values);
          const mean = calcularMedia(values);
          const std = calcularDesviacionEstandar(values, true);

          if (std === 0) return { error: 'Desviación estándar cero (todos los valores iguales)' };

          // Calcular estadístico D = max|F_n(x) - F(x)|
          let D = 0;
          for (let i = 0; i < n; i++) {
              const z = (sorted[i] - mean) / std;
              const Fx = normalCDF(z);
              const Fn_upper = (i + 1) / n;
              const Fn_lower = i / n;
              D = Math.max(D, Math.abs(Fn_upper - Fx), Math.abs(Fn_lower - Fx));
          }

          // Aproximación del p-value (Lilliefors correction)
          // Usando la aproximación de Dallal-Wilkinson-Lilliefors
          const sqrtN = Math.sqrt(n);
          let p;
          if (D > 0) {
              // Aproximación de la distribución de Kolmogorov-Smirnov con corrección de Lilliefors
              const lambda = (sqrtN + 0.12 + 0.11 / sqrtN) * D;
              // Serie de Kolmogorov
              let sum = 0;
              for (let k = 1; k <= 20; k++) {
                  sum += Math.pow(-1, k - 1) * Math.exp(-2 * k * k * lambda * lambda);
              }
              p = Math.max(0, Math.min(1, 2 * sum));
          } else {
              p = 1;
          }

          // Corrección para muestras pequeñas (Lilliefors)
          if (n < 30) {
              p = Math.pow(p, 0.85); // Ajuste empírico
          }

          return {
              prueba: 'Test de Kolmogorov-Smirnov (Lilliefors)',
              n: n,
              estadisticoD: parseFloat(D.toFixed(6)),
              valorP: parseFloat(p.toFixed(6)),
              esNormal: p >= 0.05,
              interpretacion: p >= 0.05
                  ? `No se rechaza H₀ (p=${p.toFixed(4)} ≥ 0.05). Los datos pueden seguir distribución normal.`
                  : `Se rechaza H₀ (p=${p.toFixed(4)} < 0.05). Los datos NO siguen distribución normal.`,
              nota: 'Versión con corrección de Lilliefors para normalidad'
          };
      }

      /**
       * Test de Anderson-Darling para normalidad
       * Más potente que K-S para detectar desviaciones en las colas
       * H₀: Los datos siguen una distribución normal
       */
      function calcularAndersonDarling(values) {
          const n = values.length;
          if (n < 8) return { error: 'Se necesitan al menos 8 observaciones' };

          const sorted = sortNumbers(values);
          const mean = calcularMedia(values);
          const std = calcularDesviacionEstandar(values, true);

          if (std === 0) return { error: 'Desviación estándar cero (todos los valores iguales)' };

          // Calcular estadístico A²
          // Fórmula correcta: A² = -n - (1/n) * Σ(2i-1)[ln(F(X_i)) + ln(1-F(X_{n+1-i}))]
          let sum = 0;
          for (let i = 1; i <= n; i++) {
              const Fi = normalCDF((sorted[i - 1] - mean) / std);
              const Fn_i = normalCDF((sorted[n - i] - mean) / std); // F(X_{n+1-i})
              sum += (2 * i - 1) * (Math.log(Math.max(Fi, 1e-10)) + Math.log(Math.max(1 - Fn_i, 1e-10)));
          }

          let A2 = -n - sum / n;

          // Corrección para muestras pequeñas (Stephens, 1974)
          const A2_corrected = A2 * (1 + 0.75 / n + 2.25 / (n * n));

          // Aproximación del p-value usando la fórmula de Lewis (1961)
          // Más precisa y estable numéricamente
          // Basada en la tabla de valores críticos de Stephens (1974)
          let p;
          if (A2_corrected < 0.200) {
              p = 1.0 - Math.exp(-13.436 + 101.14 * A2_corrected - 223.73 * A2_corrected * A2_corrected);
          } else if (A2_corrected < 0.340) {
              p = 1.0 - Math.exp(-8.318 + 42.796 * A2_corrected - 59.938 * A2_corrected * A2_corrected);
          } else if (A2_corrected < 0.600) {
              p = Math.exp(0.9177 - 4.279 * A2_corrected - 1.38 * A2_corrected * A2_corrected);
          } else if (A2_corrected < 1.000) {
              p = Math.exp(1.2937 - 5.709 * A2_corrected + 0.0186 * A2_corrected);
          } else {
              p = Math.exp(0.8809 - 4.901 * A2_corrected);
          }

          p = Math.max(0.0001, Math.min(0.9999, p));

          return {
              prueba: 'Test de Anderson-Darling',
              n: n,
              estadisticoA2: parseFloat(A2.toFixed(6)),
              estadisticoA2_corregido: parseFloat(A2_corrected.toFixed(6)),
              valorP: parseFloat(p.toFixed(6)),
              esNormal: p >= 0.05,
              interpretacion: p >= 0.05
                  ? `No se rechaza H₀ (p=${p.toFixed(4)} ≥ 0.05). Los datos pueden seguir distribución normal.`
                  : `Se rechaza H₀ (p=${p.toFixed(4)} < 0.05). Los datos NO siguen distribución normal.`,
              nota: 'Más sensible a desviaciones en las colas de la distribución'
          };
      }

      /**
       * Test de D'Agostino-Pearson para normalidad
       * Basado en la asimetría y curtosis de la distribución
       * H₀: Los datos siguen una distribución normal
       * Combina tests de skewness y kurtosis en un estadístico omnibus
       */
      // ════════════════════════════════════════
    // DIAGRAMA DE PARETO (Control de Calidad)
    // ════════════════════════════════════════
    function calcularPareto(datos) {
        if (!datos || datos.length === 0) {
            return { error: 'No hay datos para analizar' };
        }
        
        let categorias = [];
        
        if (Array.isArray(datos)) {
            if (datos[0] && typeof datos[0] === 'object') {
                const keys = Object.keys(datos[0]);
                const catKey = keys.find(k => k.toLowerCase().includes('categoria') || k.toLowerCase().includes('defecto') || k.toLowerCase().includes('tipo') || k.toLowerCase().includes('nombre'));
                const countKey = keys.find(k => k.toLowerCase().includes('conteo') || k.toLowerCase().includes('count') || k.toLowerCase().includes('frecuencia'));
                
                if (catKey && countKey) {
                    categorias = datos.map(d => ({ nombre: String(d[catKey]), conteo: parseFloat(d[countKey]) || 0 }));
                } else {
                    categorias = datos.map(d => ({ nombre: String(Object.values(d)[0]), conteo: parseFloat(Object.values(d)[1]) || 0 }));
                }
            } else {
                categorias = datos.map(d => ({ nombre: String(Array.isArray(d) ? d[0] : d), conteo: Array.isArray(d) ? (parseFloat(d[1]) || 1) : 1 }));
            }
        } else if (typeof datos === 'object') {
            categorias = Object.entries(datos).map(([nombre, conteo]) => ({ nombre: String(nombre), conteo: parseFloat(conteo) || 0 }));
        }
        
        if (categorias.length < 2) return { error: 'Se requieren al menos 2 categorías para Pareto' };
        
        categorias.sort((a, b) => b.conteo - a.conteo);
        const total = categorias.reduce((sum, c) => sum + c.conteo, 0);
        if (total === 0) return { error: 'La suma de conteos es cero' };
        
        let acumulado = 0;
        const resultados = categorias.map(c => {
            acumulado += c.conteo;
            const porcentaje = (c.conteo / total) * 100;
            const acumuladoPct = (acumulado / total) * 100;
            return { categoria: c.nombre, conteo: c.conteo, porcentaje: Math.round(porcentaje * 100) / 100, acumulado: Math.round(acumuladoPct * 100) / 100 };
        });
        
        constidxPareto80 = resultados.findIndex(r => r.acumulado >= 80);
        const pareto80 = idxPareto80 >= 0 ? resultados[idxPareto80].acumulado : 100;
        
        return {
            categorias: resultados.map(r => r.categoria),
            conteos: resultados.map(r => r.conteo),
            porcentajes: resultados.map(r => r.porcentaje),
            acumulado: resultados.map(r => r.acumulado),
            pareto80: pareto80,
            vitales: idxPareto80 >= 0 ? idxPareto80 + 1 : resultados.length,
            triviales: idxPareto80 >= 0 ? resultados.length - idxPareto80 - 1 : 0,
            total: total,
            datosCompletos: resultados
        };
    }

    function calcularDAgostinoPearson(values) {
          const n = values.length;
          if (n < 8) return { error: 'Se necesitan al menos 8 observaciones' };

          const skew = calcularAsimetria(values, true);
          const kurt = calcularCurtosis(values, true);

          // Test de asimetría de D'Agostino
          // Transformación a Z usando la aproximación de Srivastava (1984)
          const Y1 = skew * Math.sqrt(((n + 1) * (n + 3)) / (6 * (n - 2)));
          const beta2_skew = 6 * (n * n - 5 * n + 2) / ((n + 1) * (n + 3)) *
                             (24 * n * (n - 2) * (n - 3)) / ((n + 1) * (n + 1) * (n + 3) * (n + 5));
          const alpha_skew = 6 + 8 / beta2_skew * (2 / beta2_skew + Math.sqrt(1 + 4 / (beta2_skew * beta2_skew)));
          const Z1 = Y1 * Math.sqrt(2 / (9 * alpha_skew)) * (1 - 2 / (9 * alpha_skew));
          // Aproximación más simple y robusta
          const Z_skew = skew / Math.sqrt(6 / n);

          // Test de curtosis de Anscombe-Glynn
          const mean_kurt = -6 * (n + 1) / ((n + 1) * (n + 3));
          const var_kurt = 24 * n * (n - 2) * (n - 3) / ((n + 1) * (n + 1) * (n + 3) * (n + 5));
          const se_kurt = Math.sqrt(Math.max(var_kurt, 1e-10));
          const Z_kurt = (kurt - mean_kurt) / se_kurt;

          // Estadístico omnibus K² = Z_skew² + Z_kurt² ~ Chi²(2)
          const K2 = Z_skew * Z_skew + Z_kurt * Z_kurt;
          const p = calcularValorP_ChiCuadrado(K2, 2);

          return {
              prueba: "Test de D'Agostino-Pearson (Omnibus)",
              n: n,
              asimetria: parseFloat(skew.toFixed(6)),
              curtosis: parseFloat(kurt.toFixed(6)),
              Z_asimetria: parseFloat(Z_skew.toFixed(6)),
              Z_curtosis: parseFloat(Z_kurt.toFixed(6)),
              estadisticoK2: parseFloat(K2.toFixed(6)),
              gradosLibertad: 2,
              valorP: parseFloat(p.toFixed(6)),
              esNormal: p >= 0.05,
              interpretacion: p >= 0.05
                  ? `No se rechaza H₀ (p=${p.toFixed(4)} ≥ 0.05). Los datos pueden seguir distribución normal.`
                  : `Se rechaza H₀ (p=${p.toFixed(4)} < 0.05). Los datos NO siguen distribución normal.`,
              nota: 'Combina tests de asimetría y curtosis en un estadístico omnibus'
          };
      }

      // ========================================
      // FUNCIONES DE CORRELACIÓN
      // ========================================
     
     /**
      * Calcula la correlación de Pearson entre dos variables
      * @param {Array<number>} x - Primera variable
      * @param {Array<number>} y - Segunda variable
      * @returns {Object} Resultados de la correlación
      */
     function calcularCorrelacionPearson(x, y) {
       if (x.length !== y.length || x.length < 3) {
         return { error: 'Se necesitan al menos 3 pares de datos válidos' };
       }
       
       const n = x.length;
       
       // Eliminar pares donde alguno sea NaN o infinito
       const paresValidos = [];
       for (let i = 0; i < n; i++) {
         if (!isNaN(x[i]) && !isNaN(y[i]) && isFinite(x[i]) && isFinite(y[i])) {
           paresValidos.push([x[i], y[i]]);
         }
       }
       
       if (paresValidos.length < 3) {
         return { error: 'Se necesitan al menos 3 pares de datos válidos después de limpiar' };
       }
       
       const nVal = paresValidos.length;
       const xVals = paresValidos.map(p => p[0]);
       const yVals = paresValidos.map(p => p[1]);
       
       // Calcular sumas necesarias
       let sumX = 0, sumY = 0, sumXY = 0;
       let sumX2 = 0, sumY2 = 0;
       
       for (let i = 0; i < nVal; i++) {
         sumX += xVals[i];
         sumY += yVals[i];
         sumXY += xVals[i] * yVals[i];
         sumX2 += xVals[i] * xVals[i];
         sumY2 += yVals[i] * yVals[i];
       }
       
       // Calcular correlación de Pearson
       const numerator = nVal * sumXY - sumX * sumY;
       const denominator = Math.sqrt(
         (nVal * sumX2 - sumX * sumX) * (nVal * sumY2 - sumY * sumY)
       );
       
       if (denominator === 0) {
         return { 
           r: 0, 
           r2: 0, 
           t: 0, 
           df: nVal - 2, 
           p: 1, 
           error: 'Desviación estándar cero en una o ambas variables' 
         };
       }
       
       const r = numerator / denominator;
       const r2 = r * r;
       
       // Estadístico t para prueba de significancia
       const t = r * Math.sqrt((nVal - 2) / (1 - r * r));
       const df = nVal - 2;
       
       // Valor p usando distribución t
       const p = 2 * (1 - calcularCDF_T(Math.abs(t), df));
       
       // Intervalo de confianza usando transformación de Fisher
       const z = 0.5 * Math.log((1 + r) / (1 - r));
       const seZ = 1 / Math.sqrt(nVal - 3);
       const zCrit = calcularValorP_TInverso(0.975, nVal - 2); // Aproximación para 95%
       const zLower = z - zCrit * seZ;
       const zUpper = z + zCrit * seZ;
       const rLower = (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1);
       const rUpper = (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1);
       
       // Interpretación
       let interpretacion = '';
       const absR = Math.abs(r);
       if (absR >= 0.8) {
         interpretacion = r > 0 ? 'Correlación positiva MUY FUERTE' : 'Correlación negativa MUY FUERTE';
       } else if (absR >= 0.6) {
         interpretacion = r > 0 ? 'Correlación positiva FUERTE' : 'Correlación negativa FUERTE';
       } else if (absR >= 0.4) {
         interpretacion = r > 0 ? 'Correlación positiva MODERADA' : 'Correlación negativa MODERADA';
       } else if (absR >= 0.2) {
         interpretacion = r > 0 ? 'Correlación positiva DÉBIL' : 'Correlación negativa DÉBIL';
       } else {
         interpretacion = r > 0 ? 'Correlación positiva MUY DÉBIL' : 'Correlación negativa MUY DÉBIL';
       }
       
       return {
         prueba: 'Correlación de Pearson',
         r: parseFloat(r.toFixed(4)),
         r2: parseFloat(r2.toFixed(4)),
         t: parseFloat(t.toFixed(4)),
         df: df,
         p: parseFloat(p.toFixed(6)),
         pValue: parseFloat(p.toFixed(6)),
         ic95Lower: parseFloat(rLower.toFixed(4)),
         ic95Upper: parseFloat(rUpper.toFixed(4)),
         significante: p < 0.05,
         interpretacion: interpretacion,
         n: nVal,
         formula: 'r = cov(X,Y)/(σx * σy)',
         variables: ['X', 'Y']
       };
     }
     
     /**
      * Calcula la correlación de Spearman entre dos variables
      * @param {Array<number>} x - Primera variable
      * @param {Array<number>} y - Segunda variable
      * @returns {Object} Resultados de la correlación
      */
     function calcularCorrelacionSpearman(x, y) {
       if (x.length !== y.length || x.length < 3) {
         return { error: 'Se necesitan al menos 3 pares de datos válidos' };
       }
       
       const n = x.length;
       
       // Eliminar pares donde alguno sea NaN o infinito
       const paresValidos = [];
       for (let i = 0; i < n; i++) {
         if (!isNaN(x[i]) && !isNaN(y[i]) && isFinite(x[i]) && isFinite(y[i])) {
           paresValidos.push([x[i], y[i]]);
         }
       }
       
       if (paresValidos.length < 3) {
         return { error: 'Se necesitan al menos 3 pares de datos válidos después de limpiar' };
       }
       
       const nVal = paresValidos.length;
       
       // Convertir a rangos (manejar empates con promedio)
       const xRanks = obtenerRangos(paresValidos.map(p => p[0]));
       const yRanks = obtenerRangos(paresValidos.map(p => p[1]));
       
       // Calcular correlación de Pearson sobre los rangos
       let sumX = 0, sumY = 0, sumXY = 0;
       let sumX2 = 0, sumY2 = 0;
       
       for (let i = 0; i < nVal; i++) {
         sumX += xRanks[i];
         sumY += yRanks[i];
         sumXY += xRanks[i] * yRanks[i];
         sumX2 += xRanks[i] * xRanks[i];
         sumY2 += yRanks[i] * yRanks[i];
       }
       
       const numerator = nVal * sumXY - sumX * sumY;
       const denominator = Math.sqrt(
         (nVal * sumX2 - sumX * sumX) * (nVal * sumY2 - sumY * sumY)
       );
       
       if (denominator === 0) {
         return { 
           rho: 0, 
           rho2: 0, 
           t: 0, 
           df: nVal - 2, 
           p: 1, 
           error: 'Desviación estándar cero en rangos' 
         };
       }
       
       const rho = numerator / denominator;
       const rho2 = rho * rho;
       
       // Estadístico t para prueba de significancia
       const t = rho * Math.sqrt((nVal - 2) / (1 - rho * rho));
       const df = nVal - 2;
       
       // Valor p usando distribución t
       const p = 2 * (1 - calcularCDF_T(Math.abs(t), df));
       
       // Interpretación
       let interpretacion = '';
       const absRho = Math.abs(rho);
       if (absRho >= 0.8) {
         interpretacion = rho > 0 ? 'Correlación positiva MUY FUERTE' : 'Correlación negativa MUY FUERTE';
       } else if (absRho >= 0.6) {
         interpretacion = rho > 0 ? 'Correlación positiva FUERTE' : 'Correlación negativa FUERTE';
       } else if (absRho >= 0.4) {
         interpretacion = rho > 0 ? 'Correlación positiva MODERADA' : 'Correlación negativa MODERADA';
       } else if (absRho >= 0.2) {
         interpretacion = rho > 0 ? 'Correlación positiva DÉBIL' : 'Correlación negativa DÉBIL';
       } else {
         interpretacion = rho > 0 ? 'Correlación positiva MUY DÉBIL' : 'Correlación negativa MUY DÉBIL';
       }
       
       return {
         prueba: 'Correlación de Spearman',
         rho: parseFloat(rho.toFixed(4)),
         rho2: parseFloat(rho2.toFixed(4)),
         t: parseFloat(t.toFixed(4)),
         df: df,
         p: parseFloat(p.toFixed(6)),
         pValue: parseFloat(p.toFixed(6)),
         significante: p < 0.05,
         interpretacion: interpretacion,
         n: nVal,
         formula: 'ρ = correlación de Pearson sobre rangos',
         variables: ['X', 'Y']
       };
     }
     
     /**
      * Obtiene los rangos de un array (maneja empates con promedio)
      * @param {Array<number>} values - Array de valores
      * @returns {Array<number>} Array de rangos
      */
     function obtenerRangos(values) {
       const n = values.length;
       const indices = [...Array(n).keys()];
       indices.sort((a, b) => values[a] - values[b]);
       
       const ranks = new Array(n);
       let i = 0;
       
       while (i < n) {
         const currentValue = values[indices[i]];
         let j = i;
         while (j < n && values[indices[j]] === currentValue) {
           j++;
         }
         // Promedio de las posiciones para empates
         const avgRank = (i + 1 + j) / 2;
         for (let k = i; k < j; k++) {
           ranks[indices[k]] = avgRank;
         }
         i = j;
       }
       
        return ranks;
      }
      
      /**
       * Calcula la correlación de Kendall Tau-b
       * Mide la asociación ordinal entre dos variables
       * Más robusta que Spearman para datos con muchos empates
       */
      function calcularKendallTau(x, y) {
          if (x.length !== y.length) {
              throw new Error('Los arrays deben tener la misma longitud');
          }
          if (x.length < 3) {
              throw new Error('Se necesitan al menos 3 pares de datos');
          }
          
          const n = x.length;
          let concordantes = 0;
          let discordantes = 0;
          let empatesX = 0;
          let empatesY = 0;
          
          for (let i = 0; i < n; i++) {
              for (let j = i + 1; j < n; j++) {
                  const dx = x[i] - x[j];
                  const dy = y[i] - y[j];
                  
                  if (dx === 0 && dy === 0) continue; // Empate en ambos
                  
                  if (dx === 0) {
                      empatesX++;
                  } else if (dy === 0) {
                      empatesY++;
                  } else if ((dx > 0 && dy > 0) || (dx < 0 && dy < 0)) {
                      concordantes++;
                  } else {
                      discordantes++;
                  }
              }
          }
          
          const n0 = n * (n - 1) / 2;
          const n1 = empatesX;
          const n2 = empatesY;
          
          // Tau-b (corrige empates)
          const tauB = (concordantes - discordantes) / Math.sqrt((n0 - n1) * (n0 - n2));
          
          // Estadístico z para prueba de significancia
          const varTau = (2 * (2 * n + 5)) / (9 * n * (n - 1));
          const z = Math.abs(tauB) / Math.sqrt(varTau);
          
          // Valor p usando distribución normal
          const p = 2 * (1 - normalCDF(z));
          
          // Interpretación
          let interpretacion = '';
          const absTau = Math.abs(tauB);
          if (absTau >= 0.8) {
              interpretacion = tauB > 0 ? 'Correlación positiva MUY FUERTE' : 'Correlación negativa MUY FUERTE';
          } else if (absTau >= 0.6) {
              interpretacion = tauB > 0 ? 'Correlación positiva FUERTE' : 'Correlación negativa FUERTE';
          } else if (absTau >= 0.4) {
              interpretacion = tauB > 0 ? 'Correlación positiva MODERADA' : 'Correlación negativa MODERADA';
          } else if (absTau >= 0.2) {
              interpretacion = tauB > 0 ? 'Correlación positiva DÉBIL' : 'Correlación negativa DÉBIL';
          } else {
              interpretacion = tauB > 0 ? 'Correlación positiva MUY DÉBIL' : 'Correlación negativa MUY DÉBIL';
          }
          
          return {
              prueba: 'Correlación de Kendall Tau-b',
              tau: parseFloat(tauB.toFixed(4)),
              concordantes: concordantes,
              discordantes: discordantes,
              empatesX: empatesX,
              empatesY: empatesY,
              z: parseFloat(z.toFixed(4)),
              p: parseFloat(p.toFixed(6)),
              pValue: parseFloat(p.toFixed(6)),
              significante: p < 0.05,
              interpretacion: interpretacion,
              n: n,
              formula: 'τ = (C - D) / √[(n₀ - n₁)(n₀ - n₂)]'
          };
      }
      
      // --- Helper: Log-Gamma (Stirling-Lanczos, precisión ~1e-11) ---
      function logGamma(x) {
        if (x <= 0) return NaN;
        if (x < 0.5) {
          return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
        }
        x -= 1;
        const g = 7;
        const c = [
          0.99999999999980993, 676.5203681218851, -1259.1392167224028,
          771.32342877765313, -176.61502916214059, 12.507343278686905,
          -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
        ];
        let sum = c[0];
        for (let i = 1; i <= g + 1; i++) {
          sum += c[i] / (x + i);
        }
        const t = x + g + 0.5;
        return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(sum);
      }

      // --- Helper: Fracción continua de I(x;a,b) — método de Lentz ---
      function betaIncCF(x, a, b) {
        const MAX_ITER = 300;
        const EPS = 3e-12;
        const qab = a + b;
        const qap = a + 1;
        const qam = a - 1;
        let c = 1;
        let d = 1 - qab * x / qap;
        if (Math.abs(d) < 1e-30) d = 1e-30;
        d = 1 / d;
        let h = d;

        for (let m = 1; m <= MAX_ITER; m++) {
          const m2 = 2 * m;
          let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
          d = 1 + aa * d;
          if (Math.abs(d) < 1e-30) d = 1e-30;
          c = 1 + aa / c;
          if (Math.abs(c) < 1e-30) c = 1e-30;
          d = 1 / d;
          h *= d * c;

          aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
          d = 1 + aa * d;
          if (Math.abs(d) < 1e-30) d = 1e-30;
          c = 1 + aa / c;
          if (Math.abs(c) < 1e-30) c = 1e-30;
          d = 1 / d;
          const del = d * c;
          h *= del;
          if (Math.abs(del - 1) < EPS) break;
        }
        return h;
      }

      // --- Helper: Función beta incompleta regularizada I(x; a, b) ---
      function betaInc(x, a, b) {
        if (x < 0 || x > 1) return NaN;
        if (x === 0 || x === 1) return x;
        if (x > (a + 1) / (a + b + 2)) return 1 - betaInc(1 - x, b, a);

        const lbeta = logGamma(a) + logGamma(b) - logGamma(a + b);
        const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta - Math.log(a));
        return front * betaIncCF(x, a, b);
      }

      /**
       * Función de distribución acumulativa t de Student
       * Usa la relación CDF-t → I(x; df/2, 0.5) con función beta incompleta.
       * @param {number} t - Valor t
       * @param {number} df - Grados de libertad (> 0)
       * @returns {number} P(T ≤ t)
       */
      function calcularCDF_T(t, df) {
        if (t === 0) return 0.5;
        if (!isFinite(t)) return t > 0 ? 1 : 0;
        if (!isFinite(df) || df <= 0) return NaN;
        if (df > 120) return 0.5 * (1 + erf(t / Math.sqrt(2)));

        const x = df / (df + t * t);
        const a = df / 2;
        const ib = betaInc(x, a, 0.5);
        return t >= 0 ? 1 - 0.5 * ib : 0.5 * ib;
      }
     
     /**
      * Función inversa de distribución t para valores críticos
      * @param {number} p - Probabilidad acumulada
      * @param {number} df - Grados de libertad
      * @returns {number} Valor t crítico
      */
     function calcularValorP_TInverso(p, df) {
       // Aproximación simple para valores críticos comunes
       // Para producción, usar tabla o biblioteca adecuada
       if (df >= 30) {
         // Aproximación normal para df grande
         if (p === 0.975) return 1.96;
         if (p === 0.95) return 1.645;
         if (p === 0.99) return 2.576;
       }
       
       // Valores críticos aproximados para df pequeños
       const tTable = {
         1: { 0.95: 6.314, 0.975: 12.706, 0.99: 31.821, 0.995: 63.657 },
         2: { 0.95: 2.920, 0.975: 4.303, 0.99: 6.965, 0.995: 9.925 },
         3: { 0.95: 2.353, 0.975: 3.182, 0.99: 4.541, 0.995: 5.841 },
         4: { 0.95: 2.132, 0.975: 2.776, 0.99: 3.747, 0.995: 4.604 },
         5: { 0.95: 2.015, 0.975: 2.571, 0.99: 3.365, 0.995: 4.032 },
         6: { 0.95: 1.943, 0.975: 2.447, 0.99: 3.143, 0.995: 3.707 },
         7: { 0.95: 1.895, 0.975: 2.365, 0.99: 2.998, 0.995: 3.499 },
         8: { 0.95: 1.860, 0.975: 2.306, 0.99: 2.896, 0.995: 3.355 },
         9: { 0.95: 1.833, 0.975: 2.262, 0.99: 2.821, 0.995: 3.250 },
         10: { 0.95: 1.812, 0.975: 2.228, 0.99: 2.764, 0.995: 3.169 },
         20: { 0.95: 1.725, 0.975: 2.086, 0.99: 2.528, 0.995: 2.845 },
         30: { 0.95: 1.697, 0.975: 2.042, 0.99: 2.457, 0.995: 2.750 }
       };
       
       const dfKey = df <= 30 ? df : 30;
       if (tTable[dfKey] && tTable[dfKey][p]) {
         return tTable[dfKey][p];
       }
       
       // Interpolación lineal para valores intermedios (simplificada)
       return 1.96; // Valor por defecto para 95%
     }
     
     /**
      * Función de error (erf) para aproximaciones
      * @param {number} x - Valor de entrada
      * @returns {number} erf(x)
      */
     function erf(x) {
       // Aproximación de la función error
       const sign = x >= 0 ? 1 : -1;
       x = Math.abs(x);
       
       // Constantes para aproximación
       const a1 =  0.254829592;
       const a2 = -0.284496736;
       const a3 =  1.421413741;
       const a4 = -1.453152027;
       const a5 =  1.061405429;
       const p  =  0.3275911;
       
       // Aproximación de Abramowitz y Stegun: erf(x) = 1 - (a₁t + a₂t² + a₃t³ + a₄t⁴ + a₅t⁵)exp(-x²)
       const t = 1.0 / (1.0 + p * x);
       let y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * t * t * t * t;
       y = y * Math.exp(-x * x);
       
        return sign * y; // erf(-x) = -erf(x);
      }
     
     /**
      * Calcula la regresión lineal simple (Y = a + bX)
      * @param {Array<number>} x - Variable independiente
      * @param {Array<number>} y - Variable dependiente
      * @returns {Object} Resultados de la regresión
      */
     function calcularRegresionLinealSimple(x, y) {
       if (x.length !== y.length || x.length < 3) {
         return { error: 'Se necesitan al menos 3 pares de datos válidos' };
       }
       
       const n = x.length;
       
       // Eliminar pares donde alguno sea NaN o infinito
       const paresValidos = [];
       for (let i = 0; i < n; i++) {
         if (!isNaN(x[i]) && !isNaN(y[i]) && isFinite(x[i]) && isFinite(y[i])) {
           paresValidos.push([x[i], y[i]]);
         }
       }
       
       if (paresValidos.length < 3) {
         return { error: 'Se necesitan al menos 3 pares de datos válidos después de limpiar' };
       }
       
       const nVal = paresValidos.length;
       const xVals = paresValidos.map(p => p[0]);
       const yVals = paresValidos.map(p => p[1]);
       
       // Calcular sumas necesarias
       let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
       
       for (let i = 0; i < nVal; i++) {
         sumX += xVals[i];
         sumY += yVals[i];
         sumXY += xVals[i] * yVals[i];
         sumX2 += xVals[i] * xVals[i];
         sumY2 += yVals[i] * yVals[i];
       }
       
       // Calcular pendientes e intercept
       const mediaX = sumX / nVal;
       const mediaY = sumY / nVal;
       
       const numerador = sumXY - nVal * mediaX * mediaY;
       const denominador = sumX2 - nVal * mediaX * mediaX;
       
       if (denominador === 0) {
         return { error: 'La variable X tiene varianza cero (todos los valores iguales)' };
       }
       
       const b = numerador / denominador; // Pendiente
       const a = mediaY - b * mediaX; // Intercept
       
       // Calcular predicciones y residuos
       const predicciones = xVals.map(xi => a + b * xi);
       const residuos = yVals.map((yi, i) => yi - predicciones[i]);
       
       // Calcular suma de cuadrados
       const SCRegresion = predicciones.reduce((sum, pred) => sum + Math.pow(pred - mediaY, 2), 0);
       const SCResidual = residuos.reduce((sum, res) => sum + res * res, 0);
       //const SCTotal = sumY2 - nVal * mediaY * mediaY;
       const SCTotal = yVals.reduce((sum, yi) => sum + Math.pow(yi - mediaY, 2), 0);
       
        // R² y R² ajustado
        if (SCTotal === 0) return { error: 'La variable Y tiene varianza cero (todos los valores iguales)' };
        //const r2 = SCRegresion / SCTotal;
        const r2 = 1 - (SCResidual / SCTotal); // fórmula más robusta
        const r2Adj = 1 - (SCResidual / (nVal - 2)) / (SCTotal / (nVal - 1));
       
       // Error estándar de la estimación
       const errorEstandar = Math.sqrt(SCResidual / (nVal - 2));
       
        // Error estándar de los coeficientes
        const eePendiente = errorEstandar / Math.sqrt(denominador);
        const eeIntercept = errorEstandar * Math.sqrt(1 / nVal + (mediaX * mediaX) / denominador);
        
        // Valor p para pendiente (H0: b = 0)
        if (eePendiente === 0) {
            return { error: 'Ajuste perfecto (error estándar cero) — no es posible calcular el valor p de la pendiente' };
        }
        const tPendiente = b / eePendiente;
       const pPendiente = 2 * (1 - calcularCDF_T(Math.abs(tPendiente), nVal - 2));
       
        // Intervalo de confianza para pendiente (95%)
        const tCritico = calcularValorP_TInverso(0.975, nVal - 2);
        const icPendienteLower = b - tCritico * eePendiente;
        const icPendienteUpper = b + tCritico * eePendiente;
        
        // Intervalo de confianza para intercepto (95%)
        const icInterceptLower = a - tCritico * eeIntercept;
        const icInterceptUpper = a + tCritico * eeIntercept;
        
        // Criterios ICH Q2(R1) y FDA Bioanalytical
        const cumpleICH = r2 >= 0.999;
        const cumpleFDA = r2 >= 0.995;
        
        // Tabla de desviaciones por nivel (área retrocalculada vs observada)
        const desviaciones = xVals.map((xi, i) => {
            const areaRetro = a + b * xi;
            const areaReal = yVals[i];
            const desvPct = areaReal !== 0 ? ((areaReal - areaRetro) / areaRetro) * 100 : 0;
            return {
                concentracion: parseFloat(xi.toFixed(10)),
                areaObservada: parseFloat(areaReal.toFixed(10)),
                areaRetrocalculada: parseFloat(areaRetro.toFixed(10)),
                desviacionPct: parseFloat(desvPct.toFixed(10))
            };
        });
        const maxDesviacion = Math.max(...desviaciones.map(d => Math.abs(d.desviacionPct)));
        
        // Interpretación
        let interpretacion = '';
        if (pPendiente < 0.001) {
          interpretacion = 'La relación lineal es altamente significativa (p < 0.001)';
        } else if (pPendiente < 0.01) {
          interpretacion = 'La relación lineal es muy significativa (p < 0.01)';
        } else if (pPendiente < 0.05) {
          interpretacion = 'La relación lineal es significativa (p < 0.05)';
        } else if (pPendiente < 0.1) {
          interpretacion = 'La relación lineal es marginalmente significativa (p < 0.1)';
        } else {
          interpretacion = 'La relación lineal NO es significativa (p >= 0.1)';
        }
        
        return {
          prueba: 'Regresión Lineal Simple',
          modelo: 'Y = a + bX',
          formula: `Y = ${a.toFixed(10)} + ${b.toFixed(10)}X`,
          a: parseFloat(a.toFixed(10)),
          b: parseFloat(b.toFixed(10)),
          r2: parseFloat(r2.toFixed(10)),
          r2Adj: parseFloat(r2Adj.toFixed(10)),
          errorEstandar: parseFloat(errorEstandar.toFixed(10)),
          eePendiente: parseFloat(eePendiente.toFixed(10)),
          eeIntercept: parseFloat(eeIntercept.toFixed(10)),
          tPendiente: parseFloat(tPendiente.toFixed(10)),
          pPendiente: parseFloat(pPendiente.toFixed(10)),
          icPendienteLower: parseFloat(icPendienteLower.toFixed(10)),
          icPendienteUpper: parseFloat(icPendienteUpper.toFixed(10)),
          icInterceptLower: parseFloat(icInterceptLower.toFixed(10)),
          icInterceptUpper: parseFloat(icInterceptUpper.toFixed(10)),
          cumpleICH: cumpleICH,
          cumpleFDA: cumpleFDA,
          desviaciones: desviaciones,
          maxDesviacion: parseFloat(maxDesviacion.toFixed(10)),
          significante: pPendiente < 0.05,
          interpretacion: interpretacion,
          n: nVal,
           predicciones: predicciones.map(p => parseFloat(p.toFixed(10))),
           residuos: residuos.map(r => parseFloat(r.toFixed(10))),
           variables: ['X', 'Y']
         };
       }
     
     /**
      * Calcula la regresión lineal múltiple (Y = β₀ + β₁X₁ + ... + βₖXₖ)
      * @param {Array<Array<number>>} X - Matriz de variables independientes
      * @param {Array<number>} y - Variable dependiente
      * @returns {Object} Resultados de la regresión múltiple
      */
     function calcularRegresionMultiple(X, y) {
       if (!X || X.length === 0 || X[0].length === 0) {
         return { error: 'Se necesita una matriz de variables independientes' };
       }
       if (X.length !== y.length) {
         return { error: 'Las dimensiones de X e Y no coinciden' };
       }
       if (y.length < X[0].length + 2) {
         return { error: 'Se necesitan más observaciones que variables independientes' };
       }
       
       const n = y.length;
       const k = X[0].length; // número de predictores
       
       // Preparar datos: añadir columna de 1s para intercepto
       const XWithIntercept = X.map(row => [1, ...row]);
       
       // Transponer X
       const Xt = transpose(XWithIntercept);
       
       // Calcular X'X
       const XtX = multiplyMatrices(Xt, XWithIntercept);
       
       // Calcular X'y
       const Xty = multiplyMatrixVector(Xt, y);
       
       // Invertir X'X usando método de Gauss-Jordan
       const XtXInv = inverseMatrix(XtX);
       
       if (!XtXInv) {
         return { error: 'La matriz no es invertible (multicolinealidad)' };
       }
       
       // Calcular coeficientes: β = (X'X)⁻¹ X'y
       const betas = multiplyMatrixVector(XtXInv, Xty);
       
       // Predicciones
       const predicciones = XWithIntercept.map(row => 
         row.reduce((sum, val, i) => sum + val * betas[i], 0)
       );
       
       // Residuos
       const residuos = y.map((yi, i) => yi - predicciones[i]);
       
       // Calcular estadísticas
       const mediaY = y.reduce((a, b) => a + b, 0) / n;
       const SCTotal = y.reduce((sum, yi) => sum + Math.pow(yi - mediaY, 2), 0);
       const SCResidual = residuos.reduce((sum, r) => sum + r * r, 0);
       
       const r2 = SCTotal > 0 ? 1 - SCResidual / SCTotal : 0;
       const r2Adj = n > k + 1 ? 1 - (SCResidual / (n - k - 1)) / (SCTotal / (n - 1)) : 0;
       const errorEstandar = Math.sqrt(SCResidual / (n - k - 1));
       
       // Error estándar de coeficientes
       const eeCoef = XtXInv.map(row => Math.sqrt(row[row.length - 1] * SCResidual / (n - k - 1)));
       
       // Valores t y p para cada coeficiente
       const tStats = betas.map((b, i) => eeCoef[i] !== 0 ? b / eeCoef[i] : 0);
       const pValues = tStats.map(t => 2 * (1 - calcularCDF_T(Math.abs(t), n - k - 1)));
       
       // Determinar significancia
       const coeficientes = betas.map((b, i) => ({
         valor: parseFloat(b.toFixed(4)),
         ee: parseFloat(eeCoef[i].toFixed(4)),
         t: parseFloat(tStats[i].toFixed(4)),
         p: parseFloat(pValues[i].toFixed(6)),
         significativo: pValues[i] < 0.05
       }));
       
       // Interpretación general
       const significativoGlobal = pValues.slice(1).some(p => p < 0.05);
       const interpretacion = significativoGlobal 
         ? 'Al menos un predictor es significativo (p < 0.05)'
         : 'Ningún predictor es significativo (p ≥ 0.05)';
       
       return {
         prueba: 'Regresión Lineal Múltiple',
         modelo: `Y = β₀ + β₁X₁ + ... + βₖXₖ`,
         formula: `Y = ${betas.map((b, i) => `${b.toFixed(4)}${i === 0 ? '' : 'X' + i}`).join(' + ')}`,
         betas: betas.map(b => parseFloat(b.toFixed(4))),
         coeficientes: coeficientes,
         r2: parseFloat(r2.toFixed(4)),
         r2Adj: parseFloat(r2Adj.toFixed(4)),
         errorEstandar: parseFloat(errorEstandar.toFixed(4)),
         significante: significativoGlobal,
         interpretacion: interpretacion,
         n: n,
         k: k,
         predicciones: predicciones.map(p => parseFloat(p.toFixed(4))),
         residuos: residuos.map(r => parseFloat(r.toFixed(4)))
       };
     }
     
     /**
      * Calcula la regresión polinomial (Y = a₀ + a₁X + a₂X² + ... + aₖXᵏ)
      * @param {Array<number>} x - Variable independiente
      * @param {Array<number>} y - Variable dependiente
      * @param {number} grado - Grado del polinomio
      * @returns {Object} Resultados de la regresión polinomial
      */
     function calcularRegresionPolinomial(x, y, grado) {
       if (x.length !== y.length || x.length < grado + 2) {
         return { error: 'Se necesitan al menos ' + (grado + 2) + ' datos para ajuste polinomial' };
       }
       
       const n = x.length;
       
       // Crear matriz de diseño con términos polinómicos
       const X = x.map(xi => {
         const row = [];
         for (let i = 0; i <= grado; i++) {
           row.push(Math.pow(xi, i));
         }
         return row;
       });
       
       // Transponer X
       const Xt = transpose(X);
       
       // Calcular X'X
       const XtX = multiplyMatrices(Xt, X);
       
       // Calcular X'y
       const Xty = multiplyMatrixVector(Xt, y);
       
       // Invertir X'X
       const XtXInv = inverseMatrix(XtX);
       
       if (!XtXInv) {
         return { error: 'La matriz no es invertible' };
       }
       
       // Calcular coeficientes
       const coefs = multiplyMatrixVector(XtXInv, Xty);
       
       // Predicciones
       const predicciones = x.map(xi => {
         let pred = 0;
         for (let i = 0; i <= grado; i++) {
           pred += coefs[i] * Math.pow(xi, i);
         }
         return pred;
       });
       
       // Residuos
       const residuos = y.map((yi, i) => yi - predicciones[i]);
       
       // Estadísticas
       const mediaY = y.reduce((a, b) => a + b, 0) / n;
       const SCTotal = y.reduce((sum, yi) => sum + Math.pow(yi - mediaY, 2), 0);
       const SCResidual = residuos.reduce((sum, r) => sum + r * r, 0);
       
       const r2 = SCTotal > 0 ? 1 - SCResidual / SCTotal : 0;
       const r2Adj = n > grado + 1 ? 1 - (SCResidual / (n - grado - 1)) / (SCTotal / (n - 1)) : 0;
       const errorEstandar = Math.sqrt(SCResidual / (n - grado - 1));
       
       // Formato de coeficientes
       const coefFormat = coefs.map((c, i) => ({
         term: i === 0 ? 'a₀ (intercepto)' : `a${i} (X^${i})`,
         valor: parseFloat(c.toFixed(4))
       }));
       
       // Construir fórmula
       let formulaStr = 'Y = ';
       formulaStr += coefs.map((c, i) => {
         if (i === 0) return c.toFixed(4);
         return (c >= 0 ? ' + ' : ' - ') + Math.abs(c).toFixed(4) + (i === 1 ? 'X' : 'X^' + i);
       }).join('');
       
       const interpretacion = r2 >= 0.7 
         ? `El modelo polinomial de grado ${grado} tiene buen ajuste (R² = ${r2.toFixed(4)})`
         : r2 >= 0.4 
           ? `El modelo polinomial de grado ${grado} tiene ajuste moderado (R² = ${r2.toFixed(4)})`
           : `El modelo polinomial de grado ${grado} tiene ajuste débil (R² = ${r2.toFixed(4)})`;
       
       return {
         prueba: 'Regresión Polinomial',
         modelo: `Y = a₀ + a₁X + a₂X² + ... + a${grado}X^${grado}`,
         formula: formulaStr,
         grado: grado,
         coeficientes: coefFormat,
         r2: parseFloat(r2.toFixed(4)),
         r2Adj: parseFloat(r2Adj.toFixed(4)),
         errorEstandar: parseFloat(errorEstandar.toFixed(4)),
         significante: r2 > 0.3,
         interpretacion: interpretacion,
         n: n,
         predicciones: predicciones.map(p => parseFloat(p.toFixed(4))),
         residuos: residuos.map(r => parseFloat(r.toFixed(4)))
       };
     }
     
     /**
      * Calcula la regresión logística (clasificación binaria)
      * @param {Array<Array<number>>} X - Matriz de variables independientes
      * @param {Array<number>} y - Variable dependiente binaria (0/1)
      * @returns {Object} Resultados de la regresión logística
      */
     function calcularRegresionLogistica(X, y) {
       if (!X || X.length === 0) {
         return { error: 'Se necesita una matriz de variables independientes' };
       }
       if (X.length !== y.length) {
         return { error: 'Las dimensiones de X e Y no coinciden' };
       }
       
       const n = y.length;
       const k = X[0].length;
       
       // Verificar que y sea binario
       const uniqueVals = [...new Set(y)];
       if (uniqueVals.length !== 2 || !uniqueVals.includes(0) || !uniqueVals.includes(1)) {
         return { error: 'La variable dependiente debe ser binaria (0 y 1)' };
       }
       
       // Añadir intercepto
       const XWithIntercept = X.map(row => [1, ...row]);
       const numParams = k + 1;
       
       // Inicializar coeficientes con ceros
       let betas = new Array(numParams).fill(0);
       
       // Optimización usando gradiente descendente
       const learningRate = 0.01;
       const maxIter = 1000;
       const tolerance = 1e-6;
       
       for (let iter = 0; iter < maxIter; iter++) {
         const gradient = new Array(numParams).fill(0);
         
         // Calcular gradiente
         for (let i = 0; i < n; i++) {
           const xi = XWithIntercept[i];
           const z = xi.reduce((sum, xj, j) => sum + xj * betas[j], 0);
           const p = 1 / (1 + Math.exp(-z));
           const error = y[i] - p;
           
           for (let j = 0; j < numParams; j++) {
             gradient[j] += error * xi[j];
           }
         }
         
         // Actualizar betas
         let maxChange = 0;
         for (let j = 0; j < numParams; j++) {
           const change = learningRate * gradient[j];
           betas[j] += change;
           maxChange = Math.max(maxChange, Math.abs(change));
         }
         
         if (maxChange < tolerance) break;
       }
       
       // Predicciones
       const predicciones = XWithIntercept.map(xi => {
         const z = xi.reduce((sum, xj, j) => sum + xj * betas[j], 0);
         return z >= 0 ? 1 : 0;
       });
       
       // Calcular métricas
       const vp = y.reduce((sum, yi, i) => sum + (yi === 1 && predicciones[i] === 1 ? 1 : 0), 0);
       const fp = y.reduce((sum, yi, i) => sum + (yi === 0 && predicciones[i] === 1 ? 1 : 0), 0);
       const vn = y.reduce((sum, yi, i) => sum + (yi === 0 && predicciones[i] === 0 ? 1 : 0), 0);
       const fn = y.reduce((sum, yi, i) => sum + (yi === 1 && predicciones[i] === 0 ? 1 : 0), 0);
       
       const exactitud = (vp + vn) / n;
       const precision = vp / (vp + fp) || 0;
       const recall = vp / (vp + fn) || 0;
       const f1 = 2 * precision * recall / (precision + recall) || 0;
       
       // Odds ratios
       const oddsRatios = betas.slice(1).map(b => Math.exp(b));
       
       const interpretacion = exactitud >= 0.8 
         ? `Modelo con buena exactitud (${(exactitud * 100).toFixed(1)}%)`
         : exactitud >= 0.6 
           ? `Modelo con exactitud moderada (${(exactitud * 100).toFixed(1)}%)`
           : `Modelo con exactitud baja (${(exactitud * 100).toFixed(1)}%). Considera más datos o predictores.`;
       
       return {
         prueba: 'Regresión Logística',
         modelo: 'P(Y=1) = 1 / (1 + e^(-z))',
         formula: `z = ${betas[0].toFixed(4)} + ${betas.slice(1).map((b, i) => `${b.toFixed(4)}X${i+1}`).join(' + ')}`,
         betas: betas.map(b => parseFloat(b.toFixed(4))),
         oddsRatios: oddsRatios.map(or => parseFloat(or.toFixed(4))),
         exactitud: parseFloat(exactitud.toFixed(4)),
         precision: parseFloat(precision.toFixed(4)),
         recall: parseFloat(recall.toFixed(4)),
         f1: parseFloat(f1.toFixed(4)),
         vp: vp,
         fp: fp,
         vn: vn,
         fn: fn,
         n: n,
         k: k,
interpretacion: interpretacion,
          predicciones: predicciones
        };
      }

      // ========================================
      // ANÁLISIS DE COMPONENTES PRINCIPALES (PCA)
      // ========================================

      /**
       * Calcula el Análisis de Componentes Principales (PCA)
       * @param {Array<Array<number>>} data - Matriz de datos (filas=observaciones, columnas=variables)
       * @param {number} nComponentes - Número de componentes a extraer (opcional, por defecto todos)
       * @returns {Object} Resultados del PCA
       */
      function calcularPCA(data, nComponentes = null) {
        try {
          if (!data || !Array.isArray(data)) {
            return { error: 'Se necesitan datos válidos para realizar PCA' };
          }
          
          const n = data.length;
          if (n < 2) {
            return { error: 'Se necesitan al menos 2 observaciones para PCA' };
          }
          
          // Filtrar filas vacías y obtener número de columnas
          const validRows = data.filter(row => row && Array.isArray(row) && row.length > 0);
          if (validRows.length < 2) {
            return { error: 'Se necesitan al menos 2 observaciones válidas para PCA' };
          }
          
          const p = validRows[0].length;
          if (p < 2) {
            return { error: 'Se necesitan al menos 2 variables para PCA' };
          }

          if (n < 10) {
            return { error: 'Se necesitan al menos 10 observaciones para PCA' };
          }

          const warnings = [];

          // 1. Estandarizar los datos (media=0, DE=1)
          const means = [];
          const stds = [];
          const standardized = [];

          for (let j = 0; j < p; j++) {
            const col = validRows.map(row => row[j]).filter(v => v !== null && v !== undefined && !isNaN(v));
            if (col.length < 2) {
              return { error: 'La variable ' + j + ' no tiene suficientes datos válidos' };
            }
            const mean = col.reduce((a, b) => a + b, 0) / col.length;
            const variance = col.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (col.length - 1);
            const std = Math.sqrt(variance);

            means.push(mean);
            stds.push(std === 0 ? 1 : std);
          }

          for (let i = 0; i < validRows.length; i++) {
            const row = [];
            for (let j = 0; j < p; j++) {
              const val = validRows[i][j];
              if (val === null || val === undefined || isNaN(val)) {
                row.push(0);
              } else {
                row.push((val - means[j]) / stds[j]);
              }
            }
            standardized.push(row);
          }

          // 2. Calcular matriz de covarianza
          const covMatrix = [];
          for (let i = 0; i < p; i++) {
            covMatrix[i] = [];
            for (let j = 0; j < p; j++) {
              let sum = 0;
              for (let k = 0; k < n; k++) {
                sum += standardized[k][i] * standardized[k][j];
              }
              covMatrix[i][j] = sum / (n - 1);
            }
          }

          // 3. Calcular autovalores y autovectores
          const eigenResult = powerIterationEigen(covMatrix, p);
          const eigenvalues = eigenResult.values || [];
          const eigenvectors = eigenResult.vectors || [];

          if (eigenvalues.length === 0) {
            return { error: 'Error al calcular autovalores' };
          }

          if (eigenResult.converged === false) {
            warnings.push('El algoritmo de autovalores no convergió en 100 iteraciones. Los resultados pueden ser inexactos.');
          }

          // 4. Ordenar por autovalor (mayor a menor)
          const indices = eigenvalues.map((_, i) => i).sort((a, b) => eigenvalues[b] - eigenvalues[a]);
          const sortedEigenvalues = indices.map(i => eigenvalues[i]);
          const sortedEigenvectors = indices.map(i => eigenvectors[i]);

          // 5. Calcular varianza explicada
          const totalVariance = sortedEigenvalues.reduce((a, b) => a + b, 0);
          const varianceExplained = sortedEigenvalues.map(ev => (ev / totalVariance) * 100);
          const cumulativeVariance = [];
          let cumsum = 0;
          for (const ve of varianceExplained) {
            cumsum += ve;
            cumulativeVariance.push(cumsum);
          }

          // 6. Determinar número de componentes
          const nComp = nComponentes || p;
          const nFinal = Math.min(nComp, p);

          // 7. Calcular cargas factoriales (loadings)
          const loadings = [];
          for (let i = 0; i < nFinal; i++) {
            const ev = sortedEigenvectors[i];
            if (ev && Array.isArray(ev)) {
              const loading = ev.map(v => v * Math.sqrt(sortedEigenvalues[i]));
              loadings.push(loading.map(v => parseFloat(v.toFixed(4))));
            }
          }

          // 8. Calcular scores (proyecciones)
          const scores = [];
          for (let i = 0; i < n; i++) {
            const score = [];
            for (let j = 0; j < nFinal; j++) {
              if (sortedEigenvectors[j]) {
                let sum = 0;
                for (let k = 0; k < p; k++) {
                  if (standardized[i] && standardized[i][k]) {
                    sum += standardized[i][k] * sortedEigenvectors[j][k];
                  }
                }
                score.push(parseFloat(sum.toFixed(4)));
              }
            }
            scores.push(score);
          }

          // 9. Interpretación
          const interpretacion = `${nFinal} componentes principales explican el ${cumulativeVariance[nFinal - 1]?.toFixed(1)}% de la varianza total. ` +
            `PC1: ${varianceExplained[0]?.toFixed(1)}%, PC2: ${varianceExplained[1]?.toFixed(1)}%. ` +
            (cumulativeVariance[nFinal - 1] >= 70 ? 'Varianza acumulada aceptable (≥70%).' : 'Varianza acumulada baja. Considere más componentes.');

          return {
            prueba: 'PCA (Componentes Principales)',
            nObservaciones: n,
            nVariables: p,
            nComponentes: nFinal,
            eigenvalues: sortedEigenvalues.slice(0, nFinal).map(v => parseFloat(v.toFixed(4))),
            loadings: loadings,
            varianceExplained: varianceExplained.slice(0, nFinal).map(v => parseFloat(v.toFixed(2))),
            cumulativeVariance: cumulativeVariance.slice(0, nFinal).map(v => parseFloat(v.toFixed(2))),
            scores: scores,
            means: means.map(v => parseFloat(v.toFixed(4))),
            stds: stds.map(v => parseFloat(v.toFixed(4))),
            interpretacion: interpretacion,
            warning: varianceExplained[0] < 10 ? 'La varianza está muy dispersa entre componentes.' : null,
            warnings: warnings.length > 0 ? warnings : undefined
          };
        } catch (err) {
          return { error: 'Error en PCA: ' + (err.message || 'Error desconocido') };
        }
      }

      /**
       * Método de potencia para calcular autovalores y autovectores
       */
      function powerIterationEigen(matrix) {
        if (!matrix || !Array.isArray(matrix) || matrix.length < 2) {
          return { values: [1], vectors: [[1]], converged: true };
        }
        
        const n = matrix.length;
        
        // Verificar que la matriz sea válida
        const isValid = matrix.every(row => row && Array.isArray(row) && row.length === n);
        if (!isValid) {
          return { values: Array(n).fill(1), vectors: Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0)), converged: true };
        }
        
        // Usar método QR (Jacobi) para calcular todos los autovalores
        const result = qrEigenvalues(matrix, n);
        return result;
      }

      // Método de Jacobi para calcular autovalores y autovectores (más estable numéricamente)
      function jacobiEigenvalues(A, n) {
        let a = A.map(row => [...row]);
        const maxIter = 100;
        const tolerance = 1e-10;
        
        // Inicializar autovectores como identidad
        let V = Array(n).fill(0).map(() => Array(n).fill(0));
        for (let i = 0; i < n; i++) V[i][i] = 1;
        
        let converged = false;
        
        for (let iter = 0; iter < maxIter; iter++) {
          // Encontrar el elemento fuera de diagonal más grande
          let maxOff = 0;
          let p = 0, q = 1;
          for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
              if (Math.abs(a[i][j]) > maxOff) {
                maxOff = Math.abs(a[i][j]);
                p = i;
                q = j;
              }
            }
          }
          
          if (maxOff < tolerance) { converged = true; break; }
          
          // Calcular el ángulo de rotación
          const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
          const t = theta >= 0 ? 1 / (theta + Math.sqrt(1 + theta * theta)) : 1 / (theta - Math.sqrt(1 + theta * theta));
          const c = 1 / Math.sqrt(1 + t * t);
          const s = t * c;
          
          // Actualizar la matriz A
          const app = a[p][p];
          const aqq = a[q][q];
          a[p][p] = c * c * app - 2 * c * s * a[p][q] + s * s * aqq;
          a[q][q] = s * s * app + 2 * c * s * a[p][q] + c * c * aqq;
          a[p][q] = 0;
          a[q][p] = 0;
          
          for (let i = 0; i < n; i++) {
            if (i !== p && i !== q) {
              const api = a[p][i];
              const aqi = a[q][i];
              a[p][i] = c * api - s * aqi;
              a[i][p] = a[p][i];
              a[q][i] = s * api + c * aqi;
              a[i][q] = a[q][i];
            }
          }
          
          // Actualizar autovectores
          for (let i = 0; i < n; i++) {
            const vip = V[i][p];
            const viq = V[i][q];
            V[i][p] = c * vip - s * viq;
            V[i][q] = s * vip + c * viq;
          }
        }
        
        // Extraer autovalores de la diagonal
        const eigenvalues = a.map((row, i) => row[i]);
        return { values: eigenvalues, vectors: V, converged };
      }
      
      // Alias para compatibilidad
      const qrEigenvalues = jacobiEigenvalues;
      
      // Descomposición QR (método de Gram-Schmidt modificado)
      function qrDecomposition(A) {
        const n = A.length;
        const Q = Array(n).fill(0).map(() => Array(n).fill(0));
        const R = Array(n).fill(0).map(() => Array(n).fill(0));
        
        for (let j = 0; j < n; j++) {
          // Columna j de Q
          let v = A.map(row => row[j]);
          
          for (let i = 0; i < j; i++) {
            // Proyección de columna j sobre columna i de Q
            let dot = 0;
            for (let k = 0; k < n; k++) {
              dot += Q[k][i] * A[k][j];
            }
            R[i][j] = dot;
            for (let k = 0; k < n; k++) {
              v[k] -= R[i][j] * Q[k][i];
            }
          }
          
          // Normalizar para obtener Q[:, j]
          let norm = 0;
          for (let k = 0; k < n; k++) {
            norm += v[k] * v[k];
          }
          norm = Math.sqrt(norm);
          
          if (norm < 1e-10) {
            R[j][j] = 0;
            for (let k = 0; k < n; k++) Q[k][j] = 0;
          } else {
            R[j][j] = norm;
            for (let k = 0; k < n; k++) {
              Q[k][j] = v[k] / norm;
            }
          }
          
          // Calcular R[i,j] para i > j
          for (let i = j + 1; i < n; i++) {
            let dot = 0;
            for (let k = 0; k < n; k++) {
              dot += Q[k][j] * A[k][i];
            }
            R[j][i] = dot;
          }
        }
        
        return { Q, R };
      }

      // ========================================
      // ANÁLISIS FACTORIAL
      // ========================================

      /**
       * Calcula el Análisis Factorial
       * @param {Array<Array<number>>} data - Matriz de datos
       * @param {number} nFactores - Número de factores a extraer
       * @returns {Object} Resultados del Análisis Factorial
       */
      function calcularAnalisisFactorial(data, nFactores = null) {
        try {
          if (!data || !Array.isArray(data) || data.length < 10) {
            return { error: 'Se necesitan al menos 10 observaciones para Análisis Factorial' };
          }

          const n = data.length;
          const p = data[0].length;

          if (p < 3) {
            return { error: 'Se necesitan al menos 3 variables para Análisis Factorial' };
          }

          if (n < p * 2) {
            return { error: 'Se necesitan al menos 2n observaciones que variables (n > p) paraAnálisis Factorial válido' };
          }

          // 1. Estandarizar los datos
          const means = [];
          const stds = [];
          const standardized = [];

          for (let j = 0; j < p; j++) {
            const col = data.map(row => row[j]).filter(v => v !== null && v !== undefined && !isNaN(v));
            const mean = col.reduce((a, b) => a + b, 0) / col.length;
            const variance = col.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (col.length - 1);
            const std = Math.sqrt(variance);
            means.push(mean);
            stds.push(std === 0 ? 1 : std);
          }

          for (let i = 0; i < n; i++) {
            const row = [];
            for (let j = 0; j < p; j++) {
              const val = data[i][j];
              row.push(val === null || val === undefined || isNaN(val) ? 0 : (val - means[j]) / stds[j]);
            }
            standardized.push(row);
          }

          // 2. Calcular matriz de correlaciones
          const corrMatrix = [];
          for (let i = 0; i < p; i++) {
            corrMatrix[i] = [];
            for (let j = 0; j < p; j++) {
              let sum = 0;
              for (let k = 0; k < n; k++) {
                sum += standardized[k][i] * standardized[k][j];
              }
              corrMatrix[i][j] = sum / (n - 1);
            }
          }

          // 3. Calcular autovalores y autovectores
          const eigenResult = qrEigenvalues(corrMatrix, p);
          const eigenvalues = eigenResult.values || [];
          const eigenvectors = eigenResult.vectors || [];

          // Ordenar por autovalor (mayor a menor)
          const indices = eigenvalues.map((_, i) => i).sort((a, b) => eigenvalues[b] - eigenvalues[a]);
          const sortedEigenvalues = indices.map(i => eigenvalues[i]);
          const sortedEigenvectors = indices.map(i => eigenvectors[i]);

          // 4. Calcular varianza explicada
          const totalVariance = sortedEigenvalues.reduce((a, b) => a + b, 0);
          const varianceExplained = sortedEigenvalues.map(ev => (ev / totalVariance) * 100);
          const cumulativeVariance = [];
          let cumsum = 0;
          for (const ve of varianceExplained) {
            cumsum += ve;
            cumulativeVariance.push(cumsum);
          }

          // 5. Número de factores (usando Kaiser: autovalor > 1)
          const nFactoresKaiser = sortedEigenvalues.filter(ev => ev > 1).length;
          const nComp = nFactores || nFactoresKaiser;
          const nFinal = Math.min(nComp, p);

          // 6. Calcular loadings (cargas factoriales)
          const loadings = [];
          for (let i = 0; i < nFinal; i++) {
            const loading = sortedEigenvectors[i].map(v => v * Math.sqrt(sortedEigenvalues[i]));
            loadings.push(loading.map(v => parseFloat(v.toFixed(4))));
          }

          // 7. Calcular communalidades
          const communalities = [];
          for (let j = 0; j < p; j++) {
            let sum = 0;
            for (let i = 0; i < nFinal; i++) {
              sum += loadings[i][j] * loadings[i][j];
            }
            communalities.push(parseFloat(sum.toFixed(4)));
          }

          // 8. Calcular KMO (simplificado)
          const detCorr = Math.abs(corrMatrix.reduce((acc, row, i) => 
            acc + row[i] * corrMatrix.map((r, j) => j !== i ? 1 / corrMatrix[i][i] * corrMatrix[j][i] : 0).reduce((a, b) => a + b, 0), 0));
          const kmo = detCorr > 0 ? Math.min(0.9, detCorr / (detCorr + 0.1)) : 0.5;
          const kmoValue = parseFloat(kmo.toFixed(3));

          // 9. Interpretación
          const kmoInterpretation = kmoValue >= 0.9 ? 'Excelente' :
                                  kmoValue >= 0.8 ? 'Meritorio' :
                                  kmoValue >= 0.7 ? 'Medio' :
                                  kmoValue >= 0.6 ? 'Mediocre' :
                                  kmoValue >= 0.5 ? 'Pobre' : 'Inaceptable';

          const interpretacion = `Análisis Factorial con ${nFinal} factores. ` +
            `KMO = ${kmoValue} (${kmoInterpretation}). ` +
            `${nFinal} factores explican el ${cumulativeVariance[nFinal - 1]?.toFixed(1)}% de la varianza total. ` +
            `Communalidades promedio: ${(communalities.reduce((a, b) => a + b, 0) / p).toFixed(2)}`;

          return {
            prueba: 'Análisis Factorial',
            nObservaciones: n,
            nVariables: p,
            nFactores: nFinal,
            eigenvalues: sortedEigenvalues.slice(0, nFinal).map(v => parseFloat(v.toFixed(4))),
            loadings: loadings,
            communality: communalities,
            varianceExplained: varianceExplained.slice(0, nFinal).map(v => parseFloat(v.toFixed(2))),
            cumulativeVariance: cumulativeVariance.slice(0, nFinal).map(v => parseFloat(v.toFixed(2))),
            kmo: kmoValue,
            kmoInterpretation: kmoInterpretation,
            nFactoresKaiser: nFactoresKaiser,
            interpretacion: interpretacion,
            warning: kmoValue < 0.6 ? 'KMO bajo. Considere más datos o menos variables.' : null
          };
        } catch (err) {
          return { error: 'Error en Análisis Factorial: ' + (err.message || 'Error desconocido') };
        }
      }

      // ========================================
      // FUNCIONES AUXILIARES DE ÁLGEBRA LINEAL
      // ========================================
     
     /**
      * Multiplica dos matrices
      */
     function multiplyMatrices(A, B) {
       const rowsA = A.length;
       const colsA = A[0].length;
       const colsB = B[0].length;
       
       const result = new Array(rowsA).fill(0).map(() => new Array(colsB).fill(0));
       
       for (let i = 0; i < rowsA; i++) {
         for (let j = 0; j < colsB; j++) {
           for (let k = 0; k < colsA; k++) {
             result[i][j] += A[i][k] * B[k][j];
           }
         }
       }
       
       return result;
     }
     
     /**
      * Multiplica matriz por vector
      */
     function multiplyMatrixVector(A, v) {
       return A.map(row => row.reduce((sum, val, i) => sum + val * v[i], 0));
     }
     
     /**
      * Transpone una matriz
      */
     function transpose(matrix) {
       return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
     }
     
     /**
      * Invierte una matriz usando Gauss-Jordan
      */
     function inverseMatrix(matrix) {
       const n = matrix.length;
       const augmented = matrix.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);
       
       for (let i = 0; i < n; i++) {
         // Buscar pivote
         let maxRow = i;
         for (let j = i + 1; j < n; j++) {
           if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
             maxRow = j;
           }
         }
         
         if (Math.abs(augmented[maxRow][i]) < 1e-10) {
           return null; // Matriz singular
         }
         
         // Intercambiar filas
         [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
         
         // Normalizar fila pivote
         const pivot = augmented[i][i];
         for (let j = 0; j < 2 * n; j++) {
           augmented[i][j] /= pivot;
         }
         
         // Eliminar otras filas
         for (let j = 0; j < n; j++) {
           if (j !== i) {
             const factor = augmented[j][i];
             for (let k = 0; k < 2 * n; k++) {
               augmented[j][k] -= factor * augmented[i][k];
             }
           }
         }
       }
       
       return augmented.map(row => row.slice(n));
     }
       
     // ========================================
     // FUNCIONES PRINCIPALES (API PÚBLICA)
     // ========================================
    
    /**
     * Calcula todas las estadísticas para una columna específica
     */
    function analizarColumna(data, columnName) {
        try {
            const values = getNumericValues(data, columnName);
            const quartiles = calcularCuartiles(values);
            const moda = calcularModa(values);
            const ic = calcularIntervalosConfianza(values);
            const outliersIQR = detectarOutliersIQR(values);
            const outliersZScore = detectarOutliersZScore(values);
            
            return {
                columna: columnName,
                n: values.length,
                valoresOriginales: data.data.length,
                valoresValidos: values.length,
                
                // Tendencia central
                media: calcularMedia(values),
                mediana: calcularMediana(values),
                moda: moda.length > 0 ? moda : null,
                
                // Dispersión
                varianza: calcularVarianza(values),
                desviacionEstandar: calcularDesviacionEstandar(values),
                coeficienteVariacion: calcularCoeficienteVariacion(values),
                
                // Rango
                minimo: Math.min(...values),
                maximo: Math.max(...values),
                rango: calcularRango(values),
                
                // Cuartiles
                Q1: quartiles.Q1,
                Q2: quartiles.Q2,
                Q3: quartiles.Q3,
                IQR: calcularIQR(values),
                
                // Forma de la distribución
                asimetria: calcularAsimetria(values),
                curtosis: calcularCurtosis(values),
                
                // Errores e Intervalos de Confianza
                errorEstandar: calcularErrorEstandar(values),
                intervalosConfianza: ic,
                
                // Outliers
                outliersIQR: outliersIQR,
                outliersZScore: outliersZScore
            };
        } catch (error) {
            return {
                columna: columnName,
                error: error.message
            };
        }
    }
    
    /**
     * Analiza todas las columnas numéricas
     */
    function analizarTodasLasColumnas(data) {
        const numericCols = getNumericColumns(data);
        
        if (numericCols.length === 0) {
            return {
                error: 'No se encontraron columnas numéricas en los datos'
            };
        }
        
        const resultados = {};
        numericCols.forEach(col => {
            resultados[col] = analizarColumna(data, col);
        });
        
        return {
            columnasAnalizadas: numericCols.length,
            columnas: numericCols,
            resultados: resultados
        };
    }
    
    /**
     * TOST (Two One-Sided Tests) para equivalencia
     */
    function calcularTOST(values1, values2, delta) {
        const n1 = values1.length, n2 = values2.length;
        if (n1 < 2 || n2 < 2) return { error: 'Cada grupo necesita al menos 2 observaciones' };
        const mean1 = calcularMedia(values1), mean2 = calcularMedia(values2);
        const var1 = calcularVarianza(values1, true), var2 = calcularVarianza(values2, true);
        const se = Math.sqrt(var1 / n1 + var2 / n2);
        const df = Math.pow(var1 / n1 + var2 / n2, 2) / (Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1));
        const tLower = (mean1 - mean2 + delta) / se;
        const tUpper = (mean1 - mean2 - delta) / se;
        const pLower = 1 - calcularCDF_T(tLower, df);
        const pUpper = calcularCDF_T(tUpper, df);
        const pTOST = Math.max(pLower, pUpper);
        const tCrit = calcularValorP_TInverso(0.95, df);
        return {
            tInferior: tLower, tSuperior: tUpper,
            pInferior: pLower, pSuperior: pUpper,
            pTOST: pTOST,
            ic90: { inferior: (mean1 - mean2) - tCrit * se, superior: (mean1 - mean2) + tCrit * se },
            esEquivalente: pTOST < 0.05,
            delta: delta, diferencia: mean1 - mean2,
            n1: n1, n2: n2,
            interpretacion: pTOST < 0.05
                ? `Las medias son equivalentes (TOST p=${pTOST.toFixed(4)} < 0.05, Δ=${delta})`
                : `No se concluye equivalencia (TOST p=${pTOST.toFixed(4)} ≥ 0.05, Δ=${delta})`
        };
    }

    /**
     * K-Medias (Clustering)
     */
    function calcularCluster(dataMatrix, k) {
        if (!dataMatrix || dataMatrix.length < k) return { error: `Se necesitan al menos ${k} observaciones para ${k} clusters` };
        const n = dataMatrix.length, p = dataMatrix[0].length;
        k = Math.max(2, Math.min(k || 3, n - 1));
        // Inicializar centroides (k-means++)
        let centroids = [];
        centroids.push(dataMatrix[Math.floor(Math.random() * n)]);
        for (let c = 1; c < k; c++) {
            const dist = dataMatrix.map(pt => Math.min(...centroids.map(cent => {
                let d = 0; for (let j = 0; j < p; j++) d += (pt[j] - cent[j]) ** 2; return d;
            })));
            const totalDist = dist.reduce((a, b) => a + b, 0);
            let r = Math.random() * totalDist;
            for (let i = 0; i < n; i++) { r -= dist[i]; if (r <= 0) { centroids.push(dataMatrix[i]); break; } }
        }
        // Iterar hasta convergencia
        let labels = new Array(n).fill(0), iterations = 0;
        while (iterations++ < 100) {
            let changed = false;
            for (let i = 0; i < n; i++) {
                let minDist = Infinity, best = 0;
                for (let c = 0; c < k; c++) {
                    let d = 0; for (let j = 0; j < p; j++) d += (dataMatrix[i][j] - centroids[c][j]) ** 2;
                    if (d < minDist) { minDist = d; best = c; }
                }
                if (labels[i] !== best) { labels[i] = best; changed = true; }
            }
            if (!changed) break;
            // Recalcular centroides
            for (let c = 0; c < k; c++) {
                const pts = dataMatrix.filter((_, i) => labels[i] === c);
                if (pts.length === 0) continue;
                for (let j = 0; j < p; j++) centroids[c][j] = pts.reduce((s, pt) => s + pt[j], 0) / pts.length;
            }
        }
        // Calcular inercia total
        let inertia = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < p; j++) inertia += (dataMatrix[i][j] - centroids[labels[i]][j]) ** 2;
        }
        // Silhouette score simplificado
        let silhouette = 0;
        for (let i = 0; i < Math.min(n, 200); i++) {
            const a = labels[i] === -1 ? 0 : (() => {
                const same = dataMatrix.filter((_, idx) => labels[idx] === labels[i] && idx !== i);
                if (same.length === 0) return 0;
                return same.reduce((s, pt) => { let d = 0; for (let j = 0; j < p; j++) d += (dataMatrix[i][j] - pt[j]) ** 2; return s + Math.sqrt(d); }, 0) / same.length;
            })();
            const b = (() => {
                let minB = Infinity;
                for (let c = 0; c < k; c++) {
                    if (c === labels[i]) continue;
                    const other = dataMatrix.filter((_, idx) => labels[idx] === c);
                    if (other.length === 0) continue;
                    const avg = other.reduce((s, pt) => { let d = 0; for (let j = 0; j < p; j++) d += (dataMatrix[i][j] - pt[j]) ** 2; return s + Math.sqrt(d); }, 0) / other.length;
                    if (avg < minB) minB = avg;
                }
                return minB === Infinity ? 0 : minB;
            })();
            silhouette += (b - a) / Math.max(a, b, 0.001);
        }
        silhouette /= Math.min(n, 200);
        const clusterSizes = Array.from({ length: k }, (_, c) => labels.filter(l => l === c).length);
        return {
            k: k, labels: labels, clusterSizes: clusterSizes,
            centroids: centroids.map(c => c.map(v => parseFloat(v.toFixed(4)))),
            inertia: parseFloat(inertia.toFixed(4)),
            silhouette: parseFloat(silhouette.toFixed(4)),
            interpretacion: silhouette > 0.5 ? `${k} clusters con buena separación (silhouette=${silhouette.toFixed(3)})`
                : silhouette > 0.25 ? `${k} clusters con separación moderada (silhouette=${silhouette.toFixed(3)})`
                : `${k} clusters con baja separación (silhouette=${silhouette.toFixed(3)})`
        };
    }

    /**
     * Análisis Discriminante (LDA simplificado)
     */
    function calcularDiscriminante(dataMatrix, labels) {
        const classes = [...new Set(labels)].filter(c => c !== null && c !== undefined);
        const classData = classes.map(cls => dataMatrix.filter((_, i) => labels[i] === cls));
        const nClasses = classes.length;
        if (nClasses < 2) return { error: 'Se necesitan al menos 2 clases' };
        const n = dataMatrix.length, p = dataMatrix[0].length;
        // Medias por clase y media global
        const classMeans = classData.map(cls => {
            const m = []; for (let j = 0; j < p; j++) m.push(cls.reduce((s, r) => s + r[j], 0) / cls.length); return m;
        });
        const globalMean = []; for (let j = 0; j < p; j++) globalMean.push(dataMatrix.reduce((s, r) => s + r[j], 0) / n);
        // Matrices within-class (Sw) y between-class (Sb)
        const Sw = Array.from({ length: p }, () => Array(p).fill(0));
        const Sb = Array.from({ length: p }, () => Array(p).fill(0));
        for (let c = 0; c < nClasses; c++) {
            for (const row of classData[c]) {
                for (let i = 0; i < p; i++) for (let j = 0; j < p; j++) Sw[i][j] += (row[i] - classMeans[c][i]) * (row[j] - classMeans[c][j]);
            }
            for (let i = 0; i < p; i++) for (let j = 0; j < p; j++) Sb[i][j] += classData[c].length * (classMeans[c][i] - globalMean[i]) * (classMeans[c][j] - globalMean[j]);
        }
        // Calcular autovalores de Sw⁻¹Sb usando QR iterativo simplificado
        const SwInv = inverseMatrix(Sw);
        if (!SwInv) return { error: 'Matriz de dispersión intra-clase no invertible (singular)' };
        const A = multiplyMatrices(SwInv, Sb);
        const eigen = powerIterationEigen(A);
        const eigenvals = (eigen.values || []).filter(v => v > 1e-6).sort((a, b) => b - a);
        const warningsDisc = eigen.converged === false ? ['El algoritmo de autovalores no convergió en 100 iteraciones. Los resultados pueden ser inexactos.'] : [];
        const nFunciones = Math.min(eigenvals.length, nClasses - 1, p);
        const lambda = eigenvals[0] || 0;
        // Wilks' Lambda aproximado
        const wilks = eigenvals.reduce((prod, ev) => prod * (1 / (1 + ev)), 1);
        // Chi-cuadrado para significancia
        const chi2 = -(n - 1 - (p + nClasses) / 2) * Math.log(wilks);
        const gl = p * (nClasses - 1);
        const pValue = 1 - calcularValorP_ChiCuadrado(chi2, gl);
        // Clasificación simple (distancia de Mahalanobis)
        const classified = dataMatrix.map((row, idx) => {
            let minDist = Infinity, best = 0;
            for (let c = 0; c < nClasses; c++) {
                let d = 0; for (let j = 0; j < p; j++) d += (row[j] - classMeans[c][j]) ** 2 / (Sw[c]?.[c] || 1);
                if (d < minDist) { minDist = d; best = c; }
            }
            return best;
        });
        const correctos = classified.filter((c, i) => c === labels.indexOf(classes[labels[i]])).length;
        const accuracy = n > 0 ? correctos / n : 0;
        // Matriz de confusión
        const confusion = Array.from({ length: nClasses }, () => Array(nClasses).fill(0));
        for (let i = 0; i < n; i++) confusion[labels.indexOf(classes[labels[i]])][classified[i]]++;
        return {
            funcionesDiscriminantes: nFunciones,
            cargas: eigenvals.slice(0, nFunciones).map(v => parseFloat(v.toFixed(4))),
            lambda: parseFloat(wilks.toFixed(4)),
            chi2: parseFloat(chi2.toFixed(4)),
            gl: gl,
            p: parseFloat((1 - pValue).toFixed(4)),
            clasificacion: classified.map(c => classes[c]),
            accuracy: parseFloat(accuracy.toFixed(4)),
            matrizConfusion: confusion,
            warnings: warningsDisc.length > 0 ? warningsDisc : undefined,
            interpretacion: pValue < 0.05
                ? `Función discriminante significativa (χ²=${chi2.toFixed(2)}, p=${(1-pValue).toFixed(4)}, Λ=${wilks.toFixed(4)}), accuracy=${(accuracy*100).toFixed(1)}%`
                : `Función discriminante no significativa (p=${(1-pValue).toFixed(4)} ≥ 0.05)`
        };
    }

    /**
     * MANOVA simplificado (Pillai's trace)
     */
    function calcularMANOVA(dataMatrix, labels) {
        const classes = [...new Set(labels)].filter(c => c !== null && c !== undefined);
        const classData = classes.map(cls => dataMatrix.filter((_, i) => labels[i] === cls));
        const nClasses = classes.length;
        if (nClasses < 2) return { error: 'Se necesitan al menos 2 grupos' };
        const n = dataMatrix.length, p = dataMatrix[0].length;
        if (n < p + nClasses) return { error: 'Se necesitan más observaciones que variables + grupos' };
        const classMeans = classData.map(cls => {
            const m = []; for (let j = 0; j < p; j++) m.push(cls.reduce((s, r) => s + r[j], 0) / cls.length); return m;
        });
        const globalMean = []; for (let j = 0; j < p; j++) globalMean.push(dataMatrix.reduce((s, r) => s + r[j], 0) / n);
        // SSCP matrices
        const H = Array.from({ length: p }, () => Array(p).fill(0));
        const E = Array.from({ length: p }, () => Array(p).fill(0));
        for (let c = 0; c < nClasses; c++) {
            for (let i = 0; i < p; i++) for (let j = 0; j < p; j++) H[i][j] += classData[c].length * (classMeans[c][i] - globalMean[i]) * (classMeans[c][j] - globalMean[j]);
            for (const row of classData[c]) {
                for (let i = 0; i < p; i++) for (let j = 0; j < p; j++) E[i][j] += (row[i] - classMeans[c][i]) * (row[j] - classMeans[c][j]);
            }
        }
        // Pillai's trace = tr((E+H)⁻¹H)
        const EH = numericAdd(E, H);
        const EHinv = inverseMatrix(EH);
        if (!EHinv) return { error: 'Matriz de dispersión total (E+H) no invertible (singular)' };
        const pillaiMat = multiplyMatrices(EHinv, H);
        let pillai = 0; for (let i = 0; i < p; i++) pillai += pillaiMat[i][i];
        // Wilks' Lambda = det(E) / det(E+H)
        const detE = numericDeterminant(E);
        const detEH = numericDeterminant(EH);
        const wilksLambda = detEH !== 0 ? detE / detEH : 1;
        // F aproximado (Rao's F approximation)
        const s = Math.min(p, nClasses - 1);
        const m = (Math.abs(p - (nClasses - 1)) - 1) / 2;
        const N = (n - p - 1) / 2;
        const df1 = p * (nClasses - 1);
        const df2 = (n - 1 - (p + nClasses) / 2) * s - (p * (nClasses - 1) - 2) / 2;
        // F aproximado desde Pillai
        const F = (nClasses - 1) !== 0 ? ((n - p) / (nClasses - 1)) * (pillai / (s - pillai)) : 0;
        const grados = df2 || n - p - 1;
        const pValue = calcularValorP_F(Math.abs(F), df1, Math.max(1, Math.round(grados)));
        const etaCuadrado = pillai / s;
        return {
            lambda: parseFloat(wilksLambda.toFixed(4)),
            F: parseFloat(F.toFixed(4)),
            gl1: df1,
            gl2: Math.round(grados),
            p: parseFloat(pValue.toFixed(4)),
            pillai: parseFloat(pillai.toFixed(4)),
            etaCuadradoP: parseFloat(etaCuadrado.toFixed(4)),
            significativo: pValue < 0.05,
            interpretacion: pValue < 0.05
                ? `MANOVA significativo (F(${df1},${Math.round(grados)}) = ${F.toFixed(2)}, p = ${pValue.toFixed(4)}, η²p = ${etaCuadrado.toFixed(3)})`
                : `MANOVA no significativo (p = ${pValue.toFixed(4)} ≥ 0.05)`
        };
    }

    /**
     * Análisis de Supervivencia (Kaplan-Meier + Log-Rank)
     */
    function calcularSupervivencia(tiempos, eventos, grupos) {
        if (!tiempos || tiempos.length < 5) return { error: 'Se necesitan al menos 5 observaciones' };
        const hasGroups = grupos && [...new Set(grupos)].length > 1;
        const uniqueGroups = hasGroups ? [...new Set(grupos)] : ['Global'];
        // Kaplan-Meier por grupo
        const curvas = uniqueGroups.map(g => {
            const times = hasGroups ? tiempos.filter((_, i) => grupos[i] === g) : [...tiempos];
            const evts = hasGroups ? eventos.filter((_, i) => grupos[i] === g) : [...eventos];
            const sorted = times.map((t, i) => ({ t, e: evts[i] })).filter(x => x.t > 0).sort((a, b) => a.t - b.t);
            const n = sorted.length;
            let atRisk = n, surv = 1;
            const km = [{ t: 0, surv: 1, atRisk: n }];
            for (let i = 0; i < n; i++) {
                const t = sorted[i].t;
                const events = sorted.filter((x, j) => x.t === t && x.e == 1).length;
                const censored = sorted.filter((x, j) => x.t === t && x.e == 0).length;
                if (events > 0 && atRisk > 0) surv *= (1 - events / atRisk);
                km.push({ t, surv: parseFloat(surv.toFixed(4)), atRisk, events, censored });
                atRisk -= (events + censored);
            }
            const medianT = km.find(p => p.surv <= 0.5)?.t || null;
            return { grupo: g, km, mediana: medianT, n };
        });
        // Log-Rank test entre grupos
        let logRank = null;
        if (hasGroups && uniqueGroups.length === 2) {
            const g1 = curvas[0], g2 = curvas[1];
            const allTimes = [...new Set([...g1.km.map(p => p.t), ...g2.km.map(p => p.t)])].sort((a, b) => a - b);
            let O1 = 0, E1 = 0, O2 = 0, E2 = 0;
            for (const t of allTimes) {
                if (t === 0) continue;
                const n1 = g1.km.find(p => p.t === t)?.atRisk || 0;
                const n2 = g2.km.find(p => p.t === t)?.atRisk || 0;
                const N = n1 + n2;
                const e1 = g1.km.find(p => p.t === t)?.events || 0;
                const e2 = g2.km.find(p => p.t === t)?.events || 0;
                const E = e1 + e2;
                if (N > 0 && E > 0) { O1 += e1; E1 += n1 * E / N; O2 += e2; E2 += n2 * E / N; }
            }
            const chi2 = (O1 - E1) ** 2 / Math.max(E1, 0.001) + (O2 - E2) ** 2 / Math.max(E2, 0.001);
            const pLogRank = 1 - calcularValorP_ChiCuadrado(chi2, 1);
            logRank = { chi2: parseFloat(chi2.toFixed(4)), p: parseFloat((1 - pLogRank).toFixed(4)), significativo: (1 - pLogRank) < 0.05 };
        }
        return {
            curvas: curvas,
            logRank: logRank,
            interpretacion: logRank
                ? logRank.significativo
                    ? `Diferencias significativas entre curvas de supervivencia (log-rank χ²=${logRank.chi2.toFixed(2)}, p=${logRank.p.toFixed(4)})`
                    : `No hay diferencias significativas entre curvas (log-rank p=${logRank.p.toFixed(4)} ≥ 0.05)`
                : `Curva de supervivencia Kaplan-Meier (${curvas[0].n} observaciones${curvas[0].mediana ? `, mediana=${curvas[0].mediana}` : ''})`
        };
    }

    /**
     * Series Temporales (descomposición clásica + ACF + pronóstico)
     */
    function calcularSeriesTemporales(values, period) {
        if (!values || values.length < 10) return { error: 'Se necesitan al menos 10 observaciones' };
        const n = values.length;
        period = period || Math.max(2, Math.min(Math.floor(Math.sqrt(n)), n / 2));
        // Tendencia (media móvil centrada)
        const trend = [];
        for (let i = 0; i < n; i++) {
            const half = Math.floor(period / 2);
            const start = Math.max(0, i - half), end = Math.min(n, i + half + 1);
            trend.push(values.slice(start, end).reduce((s, v) => s + v, 0) / (end - start));
        }
        // Estacionalidad (promedio por posición)
        const seasonal = Array(n).fill(0);
        const detrended = values.map((v, i) => v - trend[i]);
        if (period > 1 && period < n) {
            const seasonalPattern = Array(period).fill(0);
            const seasonalCount = Array(period).fill(0);
            for (let i = 0; i < n; i++) { seasonalPattern[i % period] += detrended[i]; seasonalCount[i % period]++; }
            for (let p = 0; p < period; p++) seasonalPattern[p] = seasonalCount[p] > 0 ? seasonalPattern[p] / seasonalCount[p] : 0;
            const meanSP = seasonalPattern.reduce((s, v) => s + v, 0) / period;
            for (let p = 0; p < period; p++) seasonalPattern[p] -= meanSP;
            for (let i = 0; i < n; i++) seasonal[i] = seasonalPattern[i % period];
        }
        // Residuos
        const residuals = values.map((v, i) => v - (trend[i] + seasonal[i]));
        // ACF hasta lag 20
        const mean = values.reduce((s, v) => s + v, 0) / n;
        const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
        const maxLag = Math.min(20, n - 2);
        const acf = [];
        for (let lag = 0; lag <= maxLag; lag++) {
            let num = 0, den = 0;
            for (let i = 0; i < n - lag; i++) { num += (values[i] - mean) * (values[i + lag] - mean); }
            acf.push({ lag, value: parseFloat((num / (n * variance)).toFixed(4)) });
        }
        // PACF (Yule-Walker aproximado)
        const pacf = [{ lag: 0, value: 1 }];
        for (let lag = 1; lag <= maxLag; lag++) {
            const r = acf.slice(1, lag + 1).map(a => a.value);
            if (r.length < 2) { pacf.push({ lag, value: r[0] || 0 }); continue; }
            const m = r.length;
            const phi = Array(m).fill(0);
            phi[m - 1] = r[m - 1];
            for (let k = m - 1; k >= 1; k--) {
                let sum = 0; for (let j = 1; j <= k - 1; j++) sum += phi[j - 1] * r[k - j - 1];
                phi[k - 1] = r[k - 1] - sum;
                phi[k - 1] /= (1 - r.reduce((s, v) => s + v, 0) / m);
            }
            pacf.push({ lag, value: parseFloat(phi[m - 1].toFixed(4)) });
        }
        // Pronóstico simple (tendencia lineal)
        const xMean = (n - 1) / 2;
        const x2Sum = Array.from({ length: n }, (_, i) => (i - xMean) ** 2).reduce((s, v) => s + v, 0);
        const slope = values.reduce((s, v, i) => s + (i - xMean) * v, 0) / x2Sum;
        const intercept = mean - slope * xMean;
        const forecast = Array.from({ length: Math.min(period, 12) }, (_, i) => ({
            paso: i + 1,
            valor: parseFloat((intercept + slope * (n + i)).toFixed(4))
        }));
        // Estadística de Ljung-Box
        const lbQ = acf.slice(1, Math.min(11, acf.length)).reduce((s, a) => s + a.value ** 2 / (n - a.lag), 0) * n * (n + 2);
        const lbP = 1 - calcularValorP_ChiCuadrado(lbQ, Math.min(10, acf.length - 1));
        return {
            tendencia: trend.map(v => parseFloat(v.toFixed(4))),
            estacionalidad: seasonal.map(v => parseFloat(v.toFixed(4))),
            residuos: residuals.map(v => parseFloat(v.toFixed(4))),
            acf: acf,
            pacf: pacf,
            pronostico: forecast,
            lbQ: parseFloat(lbQ.toFixed(4)),
            lbP: parseFloat((1 - lbP).toFixed(4)),
            period: period,
            n: n,
            interpretacion: (1 - lbP) < 0.05
                ? `Serie con autocorrelación significativa (Ljung-Box p=${(1 - lbP).toFixed(4)})`
                : `Serie sin autocorrelación residual (Ljung-Box p=${(1 - lbP).toFixed(4)} ≥ 0.05)`
        };
    }

    /**
     * Modelos Mixtos lineales simplificados (efectos fijos + aleatorios)
     */
    function calcularModelosMixtos(Y, X, grupos) {
        if (!Y || Y.length < 10) return { error: 'Se necesitan al menos 10 observaciones' };
        const n = Y.length;
        const uniqueGroups = [...new Set(grupos)].filter(g => g != null);
        const nGroups = uniqueGroups.length;
        if (nGroups < 2) return { error: 'Se necesitan al menos 2 grupos' };
        // Efectos fijos (modelo lineal simple)
        const meanY = Y.reduce((s, v) => s + v, 0) / n;
        const ssTotal = Y.reduce((s, v) => s + (v - meanY) ** 2, 0);
        // Efectos aleatorios (medias por grupo)
        const groupMeans = uniqueGroups.map(g => {
            const vals = Y.filter((_, i) => grupos[i] === g);
            return { grupo: g, media: vals.reduce((s, v) => s + v, 0) / vals.length, n: vals.length };
        });
        // Varianza entre grupos (random effects)
        const gm = groupMeans.reduce((s, g) => s + g.media, 0) / nGroups;
        const varEntre = groupMeans.reduce((s, g) => s + (g.media - gm) ** 2, 0) / (nGroups - 1);
        // Varianza dentro de grupos (residual)
        let varDentro = 0;
        for (const gm of groupMeans) {
            const vals = Y.filter((_, i) => grupos[i] === gm.grupo);
            const mg = gm.media;
            varDentro += vals.reduce((s, v) => s + (v - mg) ** 2, 0);
        }
        varDentro /= (n - nGroups);
        // ICC
        const totalVar = varEntre + varDentro;
        const icc = totalVar > 0 ? varEntre / totalVar : 0;
        // Log-verosimilitud (aproximación normal)
        const rss = Y.reduce((s, v, i) => {
            const gMean = groupMeans.find(g => g.grupo === grupos[i])?.media || meanY;
            return s + (v - gMean) ** 2;
        }, 0);
        const logLik = -n / 2 * Math.log(2 * Math.PI * rss / n) - rss / (2 * rss / n);
        const k = 2 + nGroups; // parámetros: intercept + var + nGroup random effects
        const aic = 2 * k - 2 * logLik;
        const bic = k * Math.log(n) - 2 * logLik;
        // Efectos fijos
        const fixedEffects = { intercept: parseFloat(meanY.toFixed(4)) };
        const Betas = groupMeans.map(g => parseFloat((g.media - meanY).toFixed(4)));
        return {
            betasFijos: fixedEffects,
            varianzasAleatorias: { entre: parseFloat(varEntre.toFixed(4)), dentro: parseFloat(varDentro.toFixed(4)) },
            aic: parseFloat(aic.toFixed(2)),
            bic: parseFloat(bic.toFixed(2)),
            logLik: parseFloat(logLik.toFixed(4)),
            icc: parseFloat(icc.toFixed(4)),
            n: n, nGrupos: nGroups,
            groupEffects: groupMeans.map(g => ({ grupo: g.grupo, efecto: parseFloat((g.media - meanY).toFixed(4)), n: g.n })),
            interpretacion: icc > 0.1
                ? `Efecto de grupo significativo (ICC = ${icc.toFixed(3)} > 0.1, AIC = ${aic.toFixed(1)})`
                : `Efecto de grupo bajo (ICC = ${icc.toFixed(3)} ≤ 0.1, AIC = ${aic.toFixed(1)})`
        };
    }

    /**
     * Límites de Cuantificación según ICH Q2(R1) y FDA
     * Calcula LOD (límite de detección), LOQ (límite de cuantificación),
     * LQC (límite de control de calidad) y MDL (método de detección)
     * a partir de réplicas de blanco o desviación estándar de la columna.
     */
    function calcularLimitesCuantificacion(values) {
        if (!values || values.length < 3) return { error: 'Se necesitan al menos 3 valores' };
        var nums = values.filter(function(v){ return v != null && v !== '' && !isNaN(parseFloat(v)); }).map(function(v){ return parseFloat(v); });
        if (nums.length < 3) return { error: 'Se necesitan al menos 3 valores numéricos' };
        var n = nums.length;
        var media = calcularMedia(nums);
        var sigma = calcularDesviacionEstandar(nums, true);
        var lod = 3 * sigma;
        var loq = 10 * sigma;
        var lqc = 10 * sigma;
        var mdl = 3.3 * sigma;
        // Advertencias
        var advertencias = [];
        if (n < 10) advertencias.push({ condicion: 'n_menor_10', mensaje: 'ICH Q2(R1) recomienda al menos 10 réplicas de blanco para LOD/LOQ fiables.' });
        return {
            LOD: parseFloat(lod.toFixed(4)),
            LOQ: parseFloat(loq.toFixed(4)),
            LQC: parseFloat(lqc.toFixed(4)),
            MDL: parseFloat(mdl.toFixed(4)),
            mediaBlancos: parseFloat(media.toFixed(4)),
            deBlancos: parseFloat(sigma.toFixed(4)),
            n: n,
            interpretacion: 'LOD = ' + lod.toFixed(4) + ' (3σ), LOQ = ' + loq.toFixed(4) + ' (10σ). Valores por debajo de LOQ no deben reportarse cuantitativamente.',
            advertencias: advertencias
        };
    }

    /**
     * Límites de Cuantificación por Curva de Calibración (ICH Q2(R1))
     * Calcula LOD, LOQ, LQC y MDL usando regresión lineal de la curva de calibración:
     *   LOD = 3.3 × σ_res / pendiente
     *   LOQ = 10 × σ_res / pendiente
     *   LQC = 3 × σ_res / pendiente
     *   MDL = 2.5 × σ_res / pendiente
     */
    function calcularLimitesCalibracion(xValues, yValues) {
        if (!xValues || !yValues || xValues.length < 3 || yValues.length < 3) {
            return { error: 'Se necesitan al menos 3 pares (X, Y) para la regresión' };
        }
        var pairs = [];
        for (var i = 0; i < Math.min(xValues.length, yValues.length); i++) {
            var x = parseFloat(xValues[i]);
            var y = parseFloat(yValues[i]);
            if (!isNaN(x) && isFinite(x) && !isNaN(y) && isFinite(y)) {
                pairs.push({ x: x, y: y });
            }
        }
        if (pairs.length < 3) return { error: 'Se necesitan al menos 3 pares numéricos (X, Y)' };
        var n = pairs.length;
        var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
        for (var p = 0; p < n; p++) {
            sumX += pairs[p].x;
            sumY += pairs[p].y;
            sumXY += pairs[p].x * pairs[p].y;
            sumX2 += pairs[p].x * pairs[p].x;
            sumY2 += pairs[p].y * pairs[p].y;
        }
        var pendiente = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        var intercepto = (sumY - pendiente * sumX) / n;
        var ssRes = 0, ssTot = 0;
        var meanY = sumY / n;
        var resValues = [];
        var predicciones = [];
        for (var r = 0; r < n; r++) {
            var yPred = intercepto + pendiente * pairs[r].x;
            var res = pairs[r].y - yPred;
            predicciones.push(parseFloat(yPred.toFixed(6)));
            resValues.push(parseFloat(res.toFixed(6)));
            ssRes += res * res;
            ssTot += (pairs[r].y - meanY) * (pairs[r].y - meanY);
        }
        var sigmaRes = Math.sqrt(ssRes / (n - 2));
        var r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
        var lod = 3.3 * sigmaRes / pendiente;
        var loq = 10 * sigmaRes / pendiente;
        var lqc = 3 * sigmaRes / pendiente;
        var mdl = 2.5 * sigmaRes / pendiente;
        var sorted = resValues.slice().sort(function(a,b){ return a - b; });
        var q1 = sorted[Math.floor(n * 0.25)];
        var q3 = sorted[Math.floor(n * 0.75)];
        var resumenResiduos = {
            min: parseFloat(sorted[0].toFixed(6)),
            q1: parseFloat(q1.toFixed(6)),
            mediana: parseFloat(sorted[Math.floor(n / 2)].toFixed(6)),
            q3: parseFloat(q3.toFixed(6)),
            max: parseFloat(sorted[n - 1].toFixed(6)),
            sse: parseFloat(ssRes.toFixed(6))
        };
        var advertencias = [];
        if (r2 < 0.99) advertencias.push({ condicion: 'r2_menor_099', mensaje: 'R² < 0.99 — la linealidad puede ser insuficiente para límites fiables.' });
        if (n < 6) advertencias.push({ condicion: 'n_menor_6', mensaje: 'ICH Q2(R1) recomienda mínimo 6 niveles de concentración.' });
        if (pendiente <= 0) advertencias.push({ condicion: 'pendiente_no_positiva', mensaje: 'La pendiente debe ser positiva para una curva de calibración válida.' });
        return {
            LOD: parseFloat(lod.toFixed(6)),
            LOQ: parseFloat(loq.toFixed(6)),
            LQC: parseFloat(lqc.toFixed(6)),
            MDL: parseFloat(mdl.toFixed(6)),
            pendiente: parseFloat(pendiente.toFixed(6)),
            intercepto: parseFloat(intercepto.toFixed(6)),
            sigmaResidual: parseFloat(sigmaRes.toFixed(6)),
            r2: parseFloat(r2.toFixed(6)),
            n: n,
            residuos: resValues,
            predicciones: predicciones,
            resumenResiduos: resumenResiduos,
            interpretacion: 'LOD = ' + lod.toFixed(6) + ' (3.3×S_res/m), LOQ = ' + loq.toFixed(6) + ' (10×S_res/m), R² = ' + r2.toFixed(4),
            advertencias: advertencias
        };
    }

    /**
     * Inferencia Bayesiana (conjugada normal-normal)
     */
    function calcularBayesiano(values, prior) {
        if (!values || values.length < 5) return { error: 'Se necesitan al menos 5 observaciones' };
        const n = values.length;
        const mediaMuestral = calcularMedia(values);
        const varMuestral = calcularVarianza(values, true);
        // Prior conjugado Normal (media_0, var_0)
        const mu0 = prior?.media !== undefined ? prior.media : 0;
        const sigma20 = prior?.varianza !== undefined ? prior.varianza : varMuestral;
        const sigma2 = varMuestral;
        // Posterior Normal
        const precision0 = 1 / sigma20;
        const precision = n / sigma2;
        const mediaPost = (precision0 * mu0 + precision * mediaMuestral) / (precision0 + precision);
        const varPost = 1 / (precision0 + precision);
        const sdPost = Math.sqrt(varPost);
        // IC Credible 95%
        const z = 1.96;
        const ic95 = { inferior: mediaPost - z * sdPost, superior: mediaPost + z * sdPost };
        // Factor de Bayes (aproximación BIC)
        // BF10 = evidencia a favor de H1 vs H0 (mu=mu0)
        const t = (mediaMuestral - mu0) / Math.sqrt(sigma2 / n);
        const bf10 = Math.exp(-0.5 * Math.log(1 + n * sigma20 / sigma2) + (n * t * t) / (2 * (1 + sigma2 / (n * sigma20))));
        // MCMC simulado (Gibbs sampling normal-normal)
        const mcmcSamples = [];
        let currentMu = mediaMuestral;
        for (let iter = 0; iter < 2000; iter++) {
            const muPrecision = 1 / sigma20 + n / sigma2;
            const muMean = (mu0 / sigma20 + n * mediaMuestral / sigma2) / muPrecision;
            currentMu = muMean + randomNormal() * Math.sqrt(1 / muPrecision);
            if (iter >= 1000) mcmcSamples.push(currentMu); // burn-in 1000
        }
        const postMean = mcmcSamples.reduce((s, v) => s + v, 0) / mcmcSamples.length;
        const postSd = Math.sqrt(mcmcSamples.reduce((s, v) => s + (v - postMean) ** 2, 0) / mcmcSamples.length);
        // Convergencia (R-hat aproximado)
        const rHat = postSd > 0 && sdPost > 0 ? postSd / sdPost : 1;
        return {
            posterior: { media: parseFloat(mediaPost.toFixed(4)), sd: parseFloat(sdPost.toFixed(4)) },
            media_posterior: parseFloat(mediaPost.toFixed(4)),
            ic95_credible: { inferior: parseFloat(ic95.inferior.toFixed(4)), superior: parseFloat(ic95.superior.toFixed(4)) },
            factorBayes: parseFloat(bf10.toFixed(2)),
            mediaMuestral: parseFloat(mediaMuestral.toFixed(4)),
            n: n,
            mcmc: { nSamples: mcmcSamples.length, media: parseFloat(postMean.toFixed(4)), sd: parseFloat(postSd.toFixed(4)), rHat: parseFloat(rHat.toFixed(4)) },
            interpretacion: bf10 > 10 ? `Evidencia muy fuerte para H₁ (BF₁₀ = ${bf10.toFixed(1)})`
                : bf10 > 3 ? `Evidencia sustancial para H₁ (BF₁₀ = ${bf10.toFixed(1)})`
                : bf10 > 1 ? `Evidencia anecdótica para H₁ (BF₁₀ = ${bf10.toFixed(1)})`
                : bf10 < 0.1 ? `Evidencia muy fuerte para H₀ (BF₁₀ = ${bf10.toFixed(2)})`
                : bf10 < 0.33 ? `Evidencia sustancial para H₀ (BF₁₀ = ${bf10.toFixed(2)})`
                : `Evidencia anecdótica para H₀ (BF₁₀ = ${bf10.toFixed(2)})`
        };
    }

    function randomNormal() {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    // ── Helpers de matrices ──

    function numericAdd(a, b) {
        return a.map((row, i) => row.map((v, j) => v + b[i][j]));
    }

    function numericDeterminant(m) {
        const n = m.length;
        if (n === 1) return m[0][0];
        if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
        let det = 0;
        const mat = m.map(row => [...row]);
        for (let i = 0; i < n; i++) {
            let pivot = i;
            while (pivot < n && Math.abs(mat[pivot][i]) < 1e-10) pivot++;
            if (pivot === n) return 0;
            if (pivot !== i) { [mat[i], mat[pivot]] = [mat[pivot], mat[i]]; det *= -1; }
            det *= mat[i][i];
            const div = mat[i][i];
            for (let j = i; j < n; j++) mat[i][j] /= div;
            for (let row = i + 1; row < n; row++) {
                const factor = mat[row][i];
                for (let j = i; j < n; j++) mat[row][j] -= factor * mat[i][j];
            }
        }
        return det;
    }

    /**
     * Ejecuta análisis según estadísticos seleccionados
     * @param {Object} data - Datos importados
     * @param {Array} estadisticos - Lista de estadísticos a calcular
     * @param {Object} hypothesisConfig - Configuración de pruebas de hipótesis (opcional)
     */
    function ejecutarAnalisis(data, estadisticos, hypothesisConfig = {}) {
        const numericCols = getNumericColumns(data);
        
        if (numericCols.length === 0) {
            throw new Error('No se encontraron columnas numéricas para analizar');
        }
        
        const resultados = {};
        
        estadisticos.forEach(stat => {
            switch (stat) {
                case 'Media Aritmética':
                    resultados['Media Aritmética'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Media Aritmética'][col] = calcularMedia(values);
                    });
                    break;
                    
                case 'Mediana':
                    resultados['Mediana'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Mediana'][col] = calcularMediana(values);
                    });
                    break;
                
                case 'Moda':
                    resultados['Moda'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Moda'][col] = calcularModa(values);
                    });
                    break;
                
                case 'Mediana y Moda':
                    resultados['Mediana'] = {};
                    resultados['Moda'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Mediana'][col] = calcularMediana(values);
                        resultados['Moda'][col] = calcularModa(values);
                    });
                    break;
                    
                case 'Desviación Estándar':
                    resultados['Desviación Estándar'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Desviación Estándar'][col] = calcularDesviacionEstandar(values);
                    });
                    break;
                    
                case 'Varianza':
                    resultados['Varianza'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Varianza'][col] = calcularVarianza(values);
                    });
                    break;
                    
                case 'Percentiles':
                    resultados['Percentiles'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Percentiles'][col] = {
                            P10: calcularPercentil(values, 10),
                            P25: calcularPercentil(values, 25),
                            P50: calcularPercentil(values, 50),
                            P75: calcularPercentil(values, 75),
                            P90: calcularPercentil(values, 90)
                        };
                    });
                    break;
                    
                case 'Rango y Amplitud':
                    resultados['Rango y Amplitud'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Rango y Amplitud'][col] = {
                            minimo: Math.min(...values),
                            maximo: Math.max(...values),
                            rango: calcularRango(values),
                            amplitud: calcularRango(values)
                        };
                    });
                    break;

                case 'Asimetría (Skewness)':
                    resultados['Asimetría (Skewness)'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Asimetría (Skewness)'][col] = calcularAsimetria(values);
                    });
                    break;

                case 'Curtosis (Kurtosis)':
                    resultados['Curtosis (Kurtosis)'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Curtosis (Kurtosis)'][col] = calcularCurtosis(values);
                    });
                    break;

                case 'Error Estándar':
                    resultados['Error Estándar'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Error Estándar'][col] = calcularErrorEstandar(values);
                    });
                    break;

                case 'Intervalos de Confianza':
                    resultados['Intervalos de Confianza'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Intervalos de Confianza'][col] = calcularIntervalosConfianza(values);
                    });
                    break;

                case 'Detección de Outliers':
                    resultados['Detección de Outliers'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Detección de Outliers'][col] = {
                            IQR: detectarOutliersIQR(values, { detailed: true }),
                            ZScore: detectarOutliersZScore(values, { detailed: true })
                        };
                    });
                    break;

                case 'Coeficiente de Variación':
                    resultados['Coeficiente de Variación'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Coeficiente de Variación'][col] = calcularCoeficienteVariacion(values);
                    });
                    break;

                case 'T-Test (una muestra)':
                    resultados['T-Test (una muestra)'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['T-Test (una muestra)'][col] = calcularTTestUnaMuestra(values, 0);
                    });
                    break;

                case 'T-Test (dos muestras)':
                    // Usar configuración de hipótesis si está disponible
                    if (hypothesisConfig['T-Test (dos muestras)'] && hypothesisConfig['T-Test (dos muestras)'].categoricalCols?.length >= 1) {
                        const cfg = hypothesisConfig['T-Test (dos muestras)'];
                        const catCol = cfg.categoricalCols[0];
                        const numCol = cfg.numericCol;
                        
                        // Obtener los 2 grupos únicos
                        const gruposUnicos = [...new Set(data.data.map(row => row[catCol]).filter(v => v !== null && v !== ''))];
                        
                        if (gruposUnicos.length !== 2) {
                            resultados['T-Test (dos muestras)'] = { error: `Se requieren exactamente 2 grupos. Se encontraron ${gruposUnicos.length} en "${catCol}".` };
                        } else {
                            const grupo1 = gruposUnicos[0];
                            const grupo2 = gruposUnicos[1];
                            
                            const values1 = data.data
                                .filter(row => row[catCol] === grupo1)
                                .map(row => parseFloat(row[numCol]))
                                .filter(v => !isNaN(v) && isFinite(v));
                            
                            const values2 = data.data
                                .filter(row => row[catCol] === grupo2)
                                .map(row => parseFloat(row[numCol]))
                                .filter(v => !isNaN(v) && isFinite(v));
                            
                            resultados['T-Test (dos muestras)'] = {
                                [`${grupo1} vs ${grupo2}`]: calcularTTestDosMuestras([values1, values2])
                            };
                            resultados['T-Test (dos muestras)'].columnaAgrupacion = catCol;
                            resultados['T-Test (dos muestras)'].columnaValores = numCol;
                            resultados['T-Test (dos muestras)'].grupo1 = grupo1;
                            resultados['T-Test (dos muestras)'].grupo2 = grupo2;
                        }
                    } else if (numericCols.length >= 2) {
                        // Fallback: usar columnas numéricas (comportamiento anterior)
                        const values1 = getNumericValues(data, numericCols[0]);
                        const values2 = getNumericValues(data, numericCols[1]);
                        resultados['T-Test (dos muestras)'] = {
                            [`${numericCols[0]} vs ${numericCols[1]}`]: calcularTTestDosMuestras([values1, values2])
                        };
                    }
                    break;

                case 'ANOVA One-Way':
                    // Usar configuración de hipótesis si está disponible
                    if (hypothesisConfig['ANOVA One-Way'] && hypothesisConfig['ANOVA One-Way'].categoricalCols?.length >= 1) {
                        const cfg = hypothesisConfig['ANOVA One-Way'];
                        const catCol = cfg.categoricalCols[0];
                        const numCol = cfg.numericCol;
                        
                        // Obtener grupos únicos
                        const gruposUnicos = [...new Set(data.data.map(row => row[catCol]).filter(v => v !== null && v !== ''))];
                        
                        // Crear grupos con valores numéricos
                        const grupos = gruposUnicos.map(grupo => {
                            const values = data.data
                                .filter(row => row[catCol] === grupo)
                                .map(row => parseFloat(row[numCol]))
                                .filter(v => !isNaN(v) && isFinite(v));
                            return values;
                        });
                        
                        resultados['ANOVA One-Way'] = calcularANOVA(grupos);
                        resultados['ANOVA One-Way'].columnaAgrupacion = catCol;
                        resultados['ANOVA One-Way'].columnaValores = numCol;
                        resultados['ANOVA One-Way'].grupos = gruposUnicos;
                    } else if (numericCols.length >= 2) {
                        // Fallback: usar columnas numéricas como grupos (comportamiento anterior)
                        const grupos = numericCols.map(col => getNumericValues(data, col));
                        resultados['ANOVA One-Way'] = calcularANOVA(grupos);
                    }
                    break;

                case 'Chi-Cuadrado':
                    // Usar configuración de hipótesis si está disponible
                    if (hypothesisConfig['Chi-Cuadrado'] && hypothesisConfig['Chi-Cuadrado'].categoricalCols?.length >= 2) {
                        const cfg = hypothesisConfig['Chi-Cuadrado'];
                        const catCol1 = cfg.categoricalCols[0];
                        const catCol2 = cfg.categoricalCols[1];
                        
                        // Obtener valores únicos de cada columna categórica
                        const valores1 = [...new Set(data.data.map(row => row[catCol1]).filter(v => v !== null && v !== ''))];
                        const valores2 = [...new Set(data.data.map(row => row[catCol2]).filter(v => v !== null && v !== ''))];
                        
                        // Crear tabla de contingencia
                        const tabla = valores1.map(v1 => 
                            valores2.map(v2 => 
                                data.data.filter(row => row[catCol1] === v1 && row[catCol2] === v2).length
                            )
                        );
                        
                        resultados['Chi-Cuadrado'] = calcularChiCuadrado(tabla);
                        resultados['Chi-Cuadrado'].columna1 = catCol1;
                        resultados['Chi-Cuadrado'].columna2 = catCol2;
                        resultados['Chi-Cuadrado'].valores1 = valores1;
                        resultados['Chi-Cuadrado'].valores2 = valores2;
                    } else if (numericCols.length >= 2) {
                        // Fallback: usar columnas numéricas con binning (comportamiento anterior)
                        const col1 = getNumericValues(data, numericCols[0]);
                        const col2 = getNumericValues(data, numericCols[1]);
                        const bins = 4;
                        const min1 = Math.min(...col1), max1 = Math.max(...col1);
                        const min2 = Math.min(...col2), max2 = Math.max(...col2);
                        const step1 = (max1 - min1) / bins, step2 = (max2 - min2) / bins;
                        if (step1 === 0 || step2 === 0) {
                            resultados['Chi-Cuadrado'] = { error: 'No se puede calcular Chi-Cuadrado: una o más columnas tienen varianza cero (todos los valores iguales)' };
                        } else {
                            const tabla = Array(bins).fill(null).map(() => Array(bins).fill(0));
                            col1.forEach((v, i) => {
                                const r = Math.min(Math.floor((v - min1) / step1), bins - 1);
                                const c = Math.min(Math.floor((col2[i] - min2) / step2), bins - 1);
                                tabla[r][c]++;
                            });
                            resultados['Chi-Cuadrado'] = calcularChiCuadrado(tabla);
                        }
                    }
                    break;

                case 'Test de Normalidad':
                    resultados['Test de Normalidad'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Test de Normalidad'][col] = calcularTestNormalidad(values);
                    });
                    break;

                 case 'LOD (Curva de Calibración)':
                 case 'LOQ (Curva de Calibración)':
                 case 'LQC (Curva de Calibración)':
                 case 'MDL (Curva de Calibración)':
                     const calibKey = stat;
                     const calibCfg = hypothesisConfig[calibKey];
                     if (!calibCfg || !calibCfg.columnaX || !calibCfg.columnaY) {
                         resultados[calibKey] = { error: 'Configuración de curva de calibración incompleta. Seleccione columnaX (concentración) y columnaY (señal).' };
                         break;
                     }
                     const xVals = getNumericValues(data, calibCfg.columnaX);
                     const yVals = getNumericValues(data, calibCfg.columnaY);
                     if (xVals.length < 3 || yVals.length < 3) {
                         resultados[calibKey] = { error: 'Se necesitan al menos 3 pares de valores numéricos (X, Y).' };
                         break;
                     }
                     const calib = calcularLimitesCalibracion(xVals, yVals);
                     if (calib.error) {
                         resultados[calibKey] = calib;
                         break;
                     }
                      const calibKeyMap = {
                          'LOD (Curva de Calibración)': 'LOD',
                          'LOQ (Curva de Calibración)': 'LOQ',
                          'LQC (Curva de Calibración)': 'LQC',
                          'MDL (Curva de Calibración)': 'MDL'
                      };
                      const calibOutKey = calibKeyMap[calibKey];
                      resultados[calibKey] = {
                          valor: calib[calibOutKey],
                          pendiente: calib.pendiente,
                          intercepto: calib.intercepto,
                          sigmaResidual: calib.sigmaResidual,
                          r2: calib.r2,
                          n: calib.n,
                          columnaX: calibCfg.columnaX,
                          columnaY: calibCfg.columnaY,
                          residuos: calib.residuos || [],
                          predicciones: calib.predicciones || [],
                          resumenResiduos: calib.resumenResiduos || null,
                          interpretacion: calibOutKey + ' = ' + calib[calibOutKey] + ' (S_res=' + calib.sigmaResidual + ', pendiente=' + calib.pendiente + ', R²=' + calib.r2 + ')'
                      };
                      break;

                case 'ANOVA Two-Way':
                    // Usar configuración de hipótesis si está disponible
                    if (hypothesisConfig['ANOVA Two-Way'] && hypothesisConfig['ANOVA Two-Way'].categoricalCols && hypothesisConfig['ANOVA Two-Way'].categoricalCols.length >= 2) {
                        const cfg = hypothesisConfig['ANOVA Two-Way'];
                        const catCol1 = cfg.categoricalCols[0];
                        const catCol2 = cfg.categoricalCols[1];
                        const numCol = cfg.numericCol;
                        
                        // Obtener valores únicos de cada factor
                        const factor1Labels = [...new Set(data.data.map(row => row[catCol1]).filter(v => v !== null && v !== ''))];
                        const factor2Labels = [...new Set(data.data.map(row => row[catCol2]).filter(v => v !== null && v !== ''))];
                        
                        // Crear estructura de datos para ANOVA two-way
                        // Necesitamos una matriz donde cada fila corresponde a una combinación de factores
                        const datos = factor1Labels.map(f1 => 
                            factor2Labels.map(f2 => {
                                const values = data.data
                                    .filter(row => row[catCol1] === f1 && row[catCol2] === f2)
                                    .map(row => parseFloat(row[numCol]))
                                    .filter(v => !isNaN(v) && isFinite(v));
                                return values.length > 0 ? values[0] : 0;
                            })
                        );
                        
                        resultados['ANOVA Two-Way'] = calcularANOVA2Factores(datos, factor1Labels, factor2Labels);
                        resultados['ANOVA Two-Way'].factor1 = catCol1;
                        resultados['ANOVA Two-Way'].factor2 = catCol2;
                        resultados['ANOVA Two-Way'].columnaValores = numCol;
                    } else if (numericCols.length >= 3) {
                        // Fallback: usar columnas numéricas (comportamiento anterior)
                        const grupos = numericCols.map(col => getNumericValues(data, col));
                        resultados['ANOVA Two-Way'] = calcularANOVA2Factores(grupos, numericCols.slice(0, 2), numericCols.slice(2));
                    }
                    break;

                 case 'LOD (Límite de Detección)':
                 case 'LOQ (Límite de Cuantificación)':
                 case 'LQC (Límite de Control de Calidad)':
                 case 'MDL (Mínimo Detectable)':
                     const limiteKey = stat;
                     if (!resultados[limiteKey]) resultados[limiteKey] = {};
                     numericCols.forEach(col => {
                         const values = getNumericValues(data, col);
                         if (values.length < 3) {
                             resultados[limiteKey][col] = { error: 'Se necesitan al menos 3 valores numéricos' };
                             return;
                         }
                         const calc = calcularLimitesCuantificacion(values);
                         if (calc.error) {
                             resultados[limiteKey][col] = calc;
                             return;
                         }
                         const keyMap = {
                             'LOD (Límite de Detección)': 'LOD',
                             'LOQ (Límite de Cuantificación)': 'LOQ',
                             'LQC (Límite de Control de Calidad)': 'LQC',
                             'MDL (Mínimo Detectable)': 'MDL'
                         };
                         const outKey = keyMap[limiteKey];
                         resultados[limiteKey][col] = {
                             valor: calc[outKey],
                             sigma: calc.deBlancos,
                             mediaBlancos: calc.mediaBlancos,
                             n: calc.n,
                             interpretacion: outKey + ' = ' + calc[outKey] + ' (' + (outKey === 'MDL' ? '3.3' : outKey === 'LOD' ? '3' : '10') + 'σ)'
                         };
                     });
                     break;

                 case 'Límites de Cuantificación':
                     if (hypothesisConfig['Límites de Cuantificación']) {
                         const cfg = hypothesisConfig['Límites de Cuantificación'];
                         const col = cfg.columna;
                         const lsl = parseFloat(cfg.lsl);
                         const usl = parseFloat(cfg.usl);
                         const norma = cfg.norma;
                         const nivelConfianza = parseFloat(cfg.nivelConfianza);
 
                         const values = getNumericValues(data, col);
                         if (values.length === 0) {
                             resultados['Límites de Cuantificación'] = { error: `No se encontraron valores numéricos en "${col}".` };
                         } else {
                             const n = values.length;
                             const media = calcularMedia(values);
                             const std = calcularDesviacionEstandar(values);
                             const min = Math.min(...values);
                             const max = Math.max(...values);
 
                             const dentro = values.filter(v => v >= lsl && v <= usl);
                             const fuera = values.filter(v => v < lsl || v > usl);
                             const fueraSuperior = values.filter(v => v > usl);
                             const fueraInferior = values.filter(v => v < lsl);
 
                             const cp = std > 0 ? (usl - lsl) / (6 * std) : Infinity;
 
                             const cpk = std > 0 ?
                                 Math.min(
                                     (usl - media) / (3 * std),
                                     (media - lsl) / (3 * std)
                                 ) : Infinity;
 
                             resultados['Límites de Cuantificación'] = {
                                 columna: col,
                                 lsl: lsl,
                                 usl: usl,
                                 norma: norma,
                                 nivelConfianza: nivelConfianza,
                                 n: n,
                                 media: parseFloat(media.toFixed(4)),
                                 std: parseFloat(std.toFixed(4)),
                                 min: min,
                                 max: max,
                                 dentro: dentro.length,
                                 fuera: fuera.length,
                                 fueraSuperior: fueraSuperior.length,
                                 fueraInferior: fueraInferior.length,
                                 porcentajeDentro: parseFloat(((dentro.length / n) * 100).toFixed(2)),
                                 porcentajeFuera: parseFloat(((fuera.length / n) * 100).toFixed(2)),
                                 cp: isFinite(cp) ? parseFloat(cp.toFixed(4)) : 'N/A',
                                 cpk: isFinite(cpk) ? parseFloat(cpk.toFixed(4)) : 'N/A'
                             };
                         }
                     } else {
resultados['Límites de Cuantificación'] = { error: 'Configuración no encontrada. Seleccione columna, LSL, USL y norma.' };
                      }
                      break;
                  
                  case 'Diagrama de Pareto':
                      if (hypothesisConfig['Diagrama de Pareto']) {
                          const cfg = hypothesisConfig['Diagrama de Pareto'];
                          const colCategorias = cfg.columnaCategoria;
                          const colConteo = cfg.columnaConteo;
                          
                          if (!colCategorias || !data[0] || !data[0].hasOwnProperty(colCategorias)) {
                              resultados['Diagrama de Pareto'] = { error: 'Seleccione columna de categorías' };
                          } else {
                              // Preparar datos para Pareto
                              const conteos = {};
                              data.forEach(row => {
                                  const cat = String(row[colCategorias] || '').trim();
                                  if (cat) {
                                      const conteo = colConteo && row[colConteo] ? parseFloat(row[colConteo]) || 1 : 1;
                                      conteos[cat] = (conteos[cat] || 0) + conteo;
                                  }
                              });
                              
                              const resultadoPareto = calcularPareto(conteos);
                              
                              if (resultadoPareto.error) {
                                  resultados['Diagrama de Pareto'] = { error: resultadoPareto.error };
                              } else {
                                  resultados['Diagrama de Pareto'] = resultadoPareto;
                              }
                          }
                      } else {
                          resultados['Diagrama de Pareto'] = { error: 'Configure las columnas de categorías y conteo' };
                      }
                      break;
                  
                  case 'Correlación Pearson':
                     if (hypothesisConfig['Correlación Pearson']) {
                         const cfg = hypothesisConfig['Correlación Pearson'];
                         const colX = cfg.columnaX;
                         const colY = cfg.columnaY;
                         
                         if (!colX || !colY) {
                             resultados['Correlación Pearson'] = { error: 'Seleccione ambas columnas X e Y' };
                         } else if (colX === colY) {
                             resultados['Correlación Pearson'] = { error: 'Las columnas X e Y deben ser diferentes' };
                         } else {
                             const valuesX = getNumericValues(data, colX);
                             const valuesY = getNumericValues(data, colY);
                             
                             if (valuesX.length === 0 || valuesY.length === 0) {
                                 resultados['Correlación Pearson'] = { error: 'Una o ambas columnas no tienen valores numéricos válidos' };
                             } else {
                                 // Tomar la longitud mínima para emparejar valores
                                 const minLength = Math.min(valuesX.length, valuesY.length);
                                 const xValues = valuesX.slice(0, minLength);
                                 const yValues = valuesY.slice(0, minLength);
                                 
                                 resultados['Correlación Pearson'] = calcularCorrelacionPearson(xValues, yValues);
                                 resultados['Correlación Pearson'].columnaX = colX;
                                 resultados['Correlación Pearson'].columnaY = colY;
                             }
                         }
                     } else {
                         resultados['Correlación Pearson'] = { error: 'Configuración no encontrada. Configure la correlación en el menú de hipótesis.' };
                     }
                     break;
                 case 'Correlación Spearman':
                     if (hypothesisConfig['Correlación Spearman']) {
                         const cfg = hypothesisConfig['Correlación Spearman'];
                         const colX = cfg.columnaX;
                         const colY = cfg.columnaY;
                         
                         if (!colX || !colY) {
                             resultados['Correlación Spearman'] = { error: 'Seleccione ambas columnas X e Y' };
                         } else if (colX === colY) {
                             resultados['Correlación Spearman'] = { error: 'Las columnas X e Y deben ser diferentes' };
                         } else {
                             const valuesX = getNumericValues(data, colX);
                             const valuesY = getNumericValues(data, colY);
                             
                             if (valuesX.length === 0 || valuesY.length === 0) {
                                 resultados['Correlación Spearman'] = { error: 'Una o ambas columnas no tienen valores numéricos válidos' };
                             } else {
                                 // Tomar la longitud mínima para emparejar valores
                                 const minLength = Math.min(valuesX.length, valuesY.length);
                                 const xValues = valuesX.slice(0, minLength);
                                 const yValues = valuesY.slice(0, minLength);
                                 
                                 resultados['Correlación Spearman'] = calcularCorrelacionSpearman(xValues, yValues);
                                 resultados['Correlación Spearman'].columnaX = colX;
                                 resultados['Correlación Spearman'].columnaY = colY;
                             }
                         }
                     } else {
                         resultados['Correlación Spearman'] = { error: 'Configuración no encontrada. Configure la correlación en el menú de hipótesis.' };
                     }
                     break;
                 case 'Regresión Lineal Simple':
                     if (hypothesisConfig['Regresión Lineal Simple']) {
                         const cfg = hypothesisConfig['Regresión Lineal Simple'];
                         const colX = cfg.columnaX;
                         const colY = cfg.columnaY;
                         
                         if (!colX || !colY) {
                             resultados['Regresión Lineal Simple'] = { error: 'Seleccione columnas X e Y' };
                         } else if (colX === colY) {
                             resultados['Regresión Lineal Simple'] = { error: 'Las columnas X e Y deben ser diferentes' };
                         } else {
                             const valuesX = getNumericValues(data, colX);
                             const valuesY = getNumericValues(data, colY);
                             
                             if (valuesX.length === 0 || valuesY.length === 0) {
                                 resultados['Regresión Lineal Simple'] = { error: 'Una o ambas columnas no tienen valores numéricos válidos' };
                             } else {
                                 const minLength = Math.min(valuesX.length, valuesY.length);
                                 const xValues = valuesX.slice(0, minLength);
                                 const yValues = valuesY.slice(0, minLength);
                                 
                                 resultados['Regresión Lineal Simple'] = calcularRegresionLinealSimple(xValues, yValues);
                                 resultados['Regresión Lineal Simple'].columnaX = colX;
                                 resultados['Regresión Lineal Simple'].columnaY = colY;
                             }
                         }
                      } else {
                          resultados['Regresión Lineal Simple'] = { error: 'Configure la regresión en el menú de correlación.' };
                      }
                      break;
                  case 'Regresión Lineal Múltiple':
                      if (hypothesisConfig['Regresión Lineal Múltiple']) {
                          const cfg = hypothesisConfig['Regresión Lineal Múltiple'];
                          const colY = cfg.columnaY;
                          const colsX = cfg.columnasX;
                          
                          if (!colY || !colsX || colsX.length === 0) {
                              resultados['Regresión Lineal Múltiple'] = { error: 'Seleccione variable Y y al menos una X' };
                          } else {
                              const yValues = getNumericValues(data, colY);
                              const xValues = colsX.map(col => getNumericValues(data, col));
                              
                              if (yValues.length === 0 || xValues.some(arr => arr.length === 0)) {
                                  resultados['Regresión Lineal Múltiple'] = { error: 'Una o más columnas no tienen valores numéricos válidos' };
                              } else {
                                  const minLength = Math.min(yValues.length, ...xValues.map(arr => arr.length));
                                  const ySlice = yValues.slice(0, minLength);
                                  
                                  // CORRECCIÓN: Transponer X para que cada array interno sea una observación
                                  const xTransposed = [];
                                  for (let i = 0; i < minLength; i++) {
                                      const row = xValues.map(arr => arr[i]);
                                      xTransposed.push(row);
                                  }
                                  
                                  if (xTransposed.length !== ySlice.length) {
                                      resultados['Regresión Lineal Múltiple'] = { error: 'Las dimensiones de X e Y no coinciden: ' + xTransposed.length + ' vs ' + ySlice.length };
                                  } else {
                                      resultados['Regresión Lineal Múltiple'] = calcularRegresionMultiple(xTransposed, ySlice);
                                      resultados['Regresión Lineal Múltiple'].columnaY = colY;
                                      resultados['Regresión Lineal Múltiple'].columnasX = colsX;
                                  }
                              }
                          }
                      } else {
                          resultados['Regresión Lineal Múltiple'] = { error: 'Configure la regresión múltiple en el menú.' };
                      }
                      break;
                  case 'Regresión Polinomial':
                      if (hypothesisConfig['Regresión Polinomial']) {
                          const cfg = hypothesisConfig['Regresión Polinomial'];
                          const colX = cfg.columnaX;
                          const colY = cfg.columnaY;
                          const grado = cfg.grado || 2;
                          
                          if (!colX || !colY) {
                              resultados['Regresión Polinomial'] = { error: 'Seleccione columnas X e Y' };
                          } else if (colX === colY) {
                              resultados['Regresión Polinomial'] = { error: 'Las columnas X e Y deben ser diferentes' };
                          } else {
                              const valuesX = getNumericValues(data, colX);
                              const valuesY = getNumericValues(data, colY);
                              
                              if (valuesX.length === 0 || valuesY.length === 0) {
                                  resultados['Regresión Polinomial'] = { error: 'Una o ambas columnas no tienen valores numéricos válidos' };
                              } else {
                                  const minLength = Math.min(valuesX.length, valuesY.length);
                                  const xValues = valuesX.slice(0, minLength);
                                  const yValues = valuesY.slice(0, minLength);
                                  
                                  resultados['Regresión Polinomial'] = calcularRegresionPolinomial(xValues, yValues, grado);
                                  resultados['Regresión Polinomial'].columnaX = colX;
                                  resultados['Regresión Polinomial'].columnaY = colY;
                              }
                          }
                      } else {
                          resultados['Regresión Polinomial'] = { error: 'Configure la regresión polinomial en el menú.' };
                      }
                      break;
                  case 'Regresión Logística':
                      if (hypothesisConfig['Regresión Logística']) {
                          const cfg = hypothesisConfig['Regresión Logística'];
                          const colY = cfg.columnaY;
                          const colsX = cfg.columnasX;
                          
                          if (!colY || !colsX || colsX.length === 0) {
                              resultados['Regresión Logística'] = { error: 'Seleccione variable Y y al menos una X' };
                          } else {
                              const yValues = getNumericValues(data, colY);
                              const xValues = colsX.map(col => getNumericValues(data, col));
                              
                              if (yValues.length === 0 || xValues.some(arr => arr.length === 0)) {
                                  resultados['Regresión Logística'] = { error: 'Una o más columnas no tienen valores numéricos válidos' };
                              } else {
                                  // Verificar que Y sea binario
                                  const uniqueY = [...new Set(yValues)];
                                  const isBinary = uniqueY.length === 2 && uniqueY.includes(0) && uniqueY.includes(1);
                                  
                                  if (!isBinary) {
                                      resultados['Regresión Logística'] = { error: 'La variable Y debe ser binaria (solo 0 y 1)' };
                                  } else {
                                      const minLength = Math.min(yValues.length, ...xValues.map(arr => arr.length));
                                      const ySlice = yValues.slice(0, minLength);
                                      
                                      // CORRECCIÓN: Transponer X para que cada array interno sea una observación
                                      const xTransposed = [];
                                      for (let i = 0; i < minLength; i++) {
                                          const row = xValues.map(arr => arr[i]);
                                          xTransposed.push(row);
                                      }
                                      
                                      if (xTransposed.length !== ySlice.length) {
                                          resultados['Regresión Logística'] = { error: 'Las dimensiones de X e Y no coinciden' };
                                      } else {
                                          resultados['Regresión Logística'] = calcularRegresionLogistica(xTransposed, ySlice);
                                          resultados['Regresión Logística'].columnaY = colY;
                                          resultados['Regresión Logística'].columnasX = colsX;
                                      }
                                  }
                              }
                          }
                      } else {
                          resultados['Regresión Logística'] = { error: 'Configure la regresión logística en el menú.' };
                      }
                       break;

                  case 'Test de Shapiro-Wilk':
                      resultados['Test de Shapiro-Wilk'] = {};
                      numericCols.forEach(col => {
                          const values = getNumericValues(data, col);
                          resultados['Test de Shapiro-Wilk'][col] = calcularShapiroWilk(values);
                      });
                      break;

                  case 'Test de Kolmogorov-Smirnov':
                      resultados['Test de Kolmogorov-Smirnov'] = {};
                      numericCols.forEach(col => {
                          const values = getNumericValues(data, col);
                          resultados['Test de Kolmogorov-Smirnov'][col] = calcularKolmogorovSmirnov(values);
                      });
                      break;

                  case 'Test de Anderson-Darling':
                      resultados['Test de Anderson-Darling'] = {};
                      numericCols.forEach(col => {
                          const values = getNumericValues(data, col);
                          resultados['Test de Anderson-Darling'][col] = calcularAndersonDarling(values);
                      });
                      break;

                  case "Test de D'Agostino-Pearson":
                      resultados["Test de D'Agostino-Pearson"] = {};
                      numericCols.forEach(col => {
                          const values = getNumericValues(data, col);
                          resultados["Test de D'Agostino-Pearson"][col] = calcularDAgostinoPearson(values);
                      });
                      break;

                  case 'Covarianza':
                     if (hypothesisConfig['Covarianza']) {
                         const cfg = hypothesisConfig['Covarianza'];
                         const colX = cfg.columnaX;
                         const colY = cfg.columnaY;
                         if (!colX || !colY) {
                             resultados['Covarianza'] = { error: 'Seleccione ambas columnas X e Y' };
                         } else if (colX === colY) {
                             resultados['Covarianza'] = { error: 'Las columnas X e Y deben ser diferentes' };
                         } else {
                             const valuesX = getNumericValues(data, colX);
                             const valuesY = getNumericValues(data, colY);
                             const minLength = Math.min(valuesX.length, valuesY.length);
                             const cov = calcularCovarianza(valuesX.slice(0, minLength), valuesY.slice(0, minLength));
                             resultados['Covarianza'] = {
                                 covarianza: cov,
                                 columnaX: colX,
                                 columnaY: colY,
                                 n: minLength
                             };
                         }
                     } else {
                         resultados['Covarianza'] = { error: 'Configuración no encontrada. Seleccione dos columnas numéricas.' };
                     }
                     break;

                 case 'Correlación Kendall Tau':
                     if (hypothesisConfig['Correlación Kendall Tau']) {
                         const cfg = hypothesisConfig['Correlación Kendall Tau'];
                         const colX = cfg.columnaX;
                         const colY = cfg.columnaY;
                         if (!colX || !colY) {
                             resultados['Correlación Kendall Tau'] = { error: 'Seleccione ambas columnas X e Y' };
                         } else if (colX === colY) {
                             resultados['Correlación Kendall Tau'] = { error: 'Las columnas X e Y deben ser diferentes' };
                         } else {
                             const valuesX = getNumericValues(data, colX);
                             const valuesY = getNumericValues(data, colY);
                             const minLength = Math.min(valuesX.length, valuesY.length);
                             resultados['Correlación Kendall Tau'] = calcularKendallTau(valuesX.slice(0, minLength), valuesY.slice(0, minLength));
                             resultados['Correlación Kendall Tau'].columnaX = colX;
                             resultados['Correlación Kendall Tau'].columnaY = colY;
                         }
                     } else {
                         resultados['Correlación Kendall Tau'] = { error: 'Configuración no encontrada. Seleccione dos columnas numéricas.' };
                     }
                     break;

                 case 'RMSE':
                     if (hypothesisConfig['RMSE']) {
                         const cfg = hypothesisConfig['RMSE'];
                         const colObs = cfg.columnaObservada;
                         const colPred = cfg.columnaPredicha;
                         const indexColumns = ['#', 'A', 'Row', 'row', 'INDEX', 'index', 'row_index'];
                         if (!colObs || !colPred) {
                             resultados['RMSE'] = { error: 'Seleccione ambas columnas (observada y predicha)' };
                         } else if (indexColumns.includes(colObs) || indexColumns.includes(colPred)) {
                             resultados['RMSE'] = { error: 'Las columnas seleccionadas no son válidas. Reconfigure las métricas de error.' };
                         } else if (colObs === colPred) {
                             resultados['RMSE'] = { error: 'Las columnas deben ser diferentes' };
                         } else {
                             const obs = getNumericValues(data, colObs);
                             const pred = getNumericValues(data, colPred);
                             const minLength = Math.min(obs.length, pred.length);
                             resultados['RMSE'] = {
                                 rmse: calcularRMSE(obs.slice(0, minLength), pred.slice(0, minLength)),
                                 columnaObservada: colObs,
                                 columnaPredicha: colPred,
                                 n: minLength
                             };
                         }
                     } else {
                         resultados['RMSE'] = { error: 'Configuración no encontrada. Seleccione columnas observada y predicha.' };
                     }
                     break;

                 case 'MAE':
                     if (hypothesisConfig['MAE']) {
                         const cfg = hypothesisConfig['MAE'];
                         const colObs = cfg.columnaObservada;
                         const colPred = cfg.columnaPredicha;
                         const indexColumns = ['#', 'A', 'Row', 'row', 'INDEX', 'index', 'row_index'];
                         if (!colObs || !colPred) {
                             resultados['MAE'] = { error: 'Seleccione ambas columnas (observada y predicha)' };
                         } else if (indexColumns.includes(colObs) || indexColumns.includes(colPred)) {
                             resultados['MAE'] = { error: 'Las columnas seleccionadas no son válidas. Reconfigure las métricas de error.' };
                         } else if (colObs === colPred) {
                             resultados['MAE'] = { error: 'Las columnas deben ser diferentes' };
                         } else {
                             const obs = getNumericValues(data, colObs);
                             const pred = getNumericValues(data, colPred);
                             const minLength = Math.min(obs.length, pred.length);
                             resultados['MAE'] = {
                                 mae: calcularMAE(obs.slice(0, minLength), pred.slice(0, minLength)),
                                 columnaObservada: colObs,
                                 columnaPredicha: colPred,
                                 n: minLength
                             };
                         }
                     } else {
                         resultados['MAE'] = { error: 'Configuración no encontrada. Seleccione columnas observada y predicha.' };
                     }
                     break;

                 case 'R² (Coef. Determinación)':
                     if (hypothesisConfig['R² (Coef. Determinación)']) {
                         const cfg = hypothesisConfig['R² (Coef. Determinación)'];
                         const colObs = cfg.columnaObservada;
                         const colPred = cfg.columnaPredicha;
                         const indexColumns = ['#', 'A', 'Row', 'row', 'INDEX', 'index', 'row_index'];
                         if (!colObs || !colPred) {
                             resultados['R² (Coef. Determinación)'] = { error: 'Seleccione ambas columnas (observada y predicha)' };
                         } else if (indexColumns.includes(colObs) || indexColumns.includes(colPred)) {
                             resultados['R² (Coef. Determinación)'] = { error: 'Las columnas seleccionadas no son válidas. Reconfigure las métricas de error.' };
                         } else if (colObs === colPred) {
                             resultados['R² (Coef. Determinación)'] = { error: 'Las columnas deben ser diferentes' };
                         } else {
                             const obs = getNumericValues(data, colObs);
                             const pred = getNumericValues(data, colPred);
                             const minLength = Math.min(obs.length, pred.length);
                             resultados['R² (Coef. Determinación)'] = {
                                 r2: calcularR2(obs.slice(0, minLength), pred.slice(0, minLength)),
                                 columnaObservada: colObs,
                                 columnaPredicha: colPred,
                                 n: minLength
                             };
                         }
                     } else {
                         resultados['R² (Coef. Determinación)'] = { error: 'Configuración no encontrada. Seleccione columnas observada y predicha.' };
                     }
                     break;

                 case 'Mann-Whitney U':
                     if (hypothesisConfig['Mann-Whitney U'] && hypothesisConfig['Mann-Whitney U'].categoricalCols?.length >= 1) {
                         const cfg = hypothesisConfig['Mann-Whitney U'];
                         const catCol = cfg.categoricalCols[0];
                         const numCol = cfg.numericCol;
                         if (!catCol || !numCol) {
                             resultados['Mann-Whitney U'] = { error: 'Seleccione columna categórica y numérica' };
                         } else {
                             const groups = {};
                             data.data.forEach(row => {
                                 const g = row[catCol];
                                 const v = parseFloat(row[numCol]);
                                 if (g !== null && g !== '' && !isNaN(v) && isFinite(v)) {
                                     if (!groups[g]) groups[g] = [];
                                     groups[g].push(v);
                                 }
                             });
                             const groupKeys = Object.keys(groups);
                             if (groupKeys.length !== 2) {
                                 resultados['Mann-Whitney U'] = { error: `Se necesitan exactamente 2 grupos (encontrados: ${groupKeys.length})` };
                             } else {
                                 resultados['Mann-Whitney U'] = calcularMannWhitneyU(groups[groupKeys[0]], groups[groupKeys[1]]);
                                 resultados['Mann-Whitney U'].columnaAgrupacion = catCol;
                                 resultados['Mann-Whitney U'].columnaValores = numCol;
                                 resultados['Mann-Whitney U'].grupos = groupKeys;
                             }
                         }
                     } else {
                         resultados['Mann-Whitney U'] = { error: 'Configuración no encontrada. Seleccione columna categórica (2 grupos) y numérica.' };
                     }
                     break;

                 case 'Kruskal-Wallis':
                     if (hypothesisConfig['Kruskal-Wallis'] && hypothesisConfig['Kruskal-Wallis'].categoricalCols?.length >= 1) {
                         const cfg = hypothesisConfig['Kruskal-Wallis'];
                         const catCol = cfg.categoricalCols[0];
                         const numCol = cfg.numericCol;
                         if (!catCol || !numCol) {
                             resultados['Kruskal-Wallis'] = { error: 'Seleccione columna categórica y numérica' };
                         } else {
                             const groups = {};
                             data.data.forEach(row => {
                                 const g = row[catCol];
                                 const v = parseFloat(row[numCol]);
                                 if (g !== null && g !== '' && !isNaN(v) && isFinite(v)) {
                                     if (!groups[g]) groups[g] = [];
                                     groups[g].push(v);
                                 }
                             });
                             const groupKeys = Object.keys(groups);
                             if (groupKeys.length < 3) {
                                 resultados['Kruskal-Wallis'] = { error: `Se necesitan al menos 3 grupos (encontrados: ${groupKeys.length})` };
                             } else {
                                 const grupos = groupKeys.map(k => groups[k]);
                                 resultados['Kruskal-Wallis'] = calcularKruskalWallis(grupos);
                                 resultados['Kruskal-Wallis'].columnaAgrupacion = catCol;
                                 resultados['Kruskal-Wallis'].columnaValores = numCol;
                                 resultados['Kruskal-Wallis'].grupos = groupKeys;
                             }
                         }
                     } else {
                         resultados['Kruskal-Wallis'] = { error: 'Configuración no encontrada. Seleccione columna categórica (3+ grupos) y numérica.' };
                      }
                      break;

                  // ========================================
                  // NO PARAMÉTRICOS - Tests adicionales
                  // ========================================

                  case 'Wilcoxon':
                      if (hypothesisConfig['Wilcoxon']) {
                          const cfg = hypothesisConfig['Wilcoxon'];
                          const col1 = cfg.numericCols?.[0];
                          const col2 = cfg.numericCols?.[1];
                          if (!col1 || !col2) {
                              resultados['Wilcoxon'] = { error: 'Seleccione dos columnas numéricas pareadas' };
                          } else {
                              const values1 = getNumericValues(data, col1);
                              const values2 = getNumericValues(data, col2);
                              if (values1.length < 5 || values2.length < 5) {
                                  resultados['Wilcoxon'] = { error: 'Se necesitan al menos 5 observaciones por muestra' };
                              } else if (values1.length !== values2.length) {
                                  resultados['Wilcoxon'] = { error: 'Las muestras deben tener el mismo tamaño (muestras pareadas)' };
                              } else {
                                  resultados['Wilcoxon'] = calcularWilcoxon(values1, values2);
                                  resultados['Wilcoxon'].columna1 = col1;
                                  resultados['Wilcoxon'].columna2 = col2;
                              }
                          }
                      } else {
                          resultados['Wilcoxon'] = { error: 'Seleccione dos columnas numéricas pareadas' };
                      }
                      break;

                  case 'Friedman':
                      if (hypothesisConfig['Friedman']) {
                          const cfg = hypothesisConfig['Friedman'];
                          const catCol = cfg.categoricalCols?.[0];
                          const numCol = cfg.numericCol;
                          if (!catCol || !numCol) {
                              resultados['Friedman'] = { error: 'Seleccione columna de bloques y columna de tratamientos' };
                          } else {
                              const grupos = {};
                              data.data.forEach(row => {
                                  const g = row[catCol];
                                  const v = parseFloat(row[numCol]);
                                  if (g !== null && g !== '' && !isNaN(v)) {
                                      if (!grupos[g]) grupos[g] = [];
                                      grupos[g].push(v);
                                  }
                              });
                              const blockKeys = Object.keys(grupos);
                              if (blockKeys.length < 3) {
                                  resultados['Friedman'] = { error: 'Se necesitan al menos 3 bloques' };
                              } else {
                                  const k = grupos[blockKeys[0]].length;
                                  if (k < 3) {
                                      resultados['Friedman'] = { error: 'Se necesitan al menos 3 tratamientos por bloque' };
                                  } else {
                                      const treatments = [];
                                      for (let i = 0; i < k; i++) {
                                          treatments.push(blockKeys.map(b => grupos[b][i]));
                                      }
                                      resultados['Friedman'] = calcularFriedman(treatments);
                                      resultados['Friedman'].bloques = blockKeys.length;
                                      resultados['Friedman'].tratamientos = k;
                                  }
                              }
                          }
                      } else {
                          resultados['Friedman'] = { error: 'Seleccione columna de bloques (mínimo 3) y numérica' };
                      }
                      break;

                  case 'Test de Signos':
                      if (hypothesisConfig['Test de Signos']) {
                          const cfg = hypothesisConfig['Test de Signos'];
                          const col1 = cfg.numericCols?.[0];
                          const col2 = cfg.numericCols?.[1];
                          if (!col1 || !col2) {
                              resultados['Test de Signos'] = { error: 'Seleccione dos columnas numéricas pareadas' };
                          } else {
                              const values1 = getNumericValues(data, col1);
                              const values2 = getNumericValues(data, col2);
                              if (values1.length < 5) {
                                  resultados['Test de Signos'] = { error: 'Se necesitan al menos 5 observaciones' };
                              } else {
                                  resultados['Test de Signos'] = calcularTestSignos(values1, values2);
resultados['Test de Signos'].columna1 = col1;
                                    resultados['Test de Signos'].columna2 = col2;
                                }
                            }
                        } else {
                            resultados['Test de Signos'] = { error: 'Seleccione dos columnas numéricas pareadas' };
                        }
                        break;

                    // ============================================================
                    // BOOTSTRAP
                    // ============================================================
                    case 'Bootstrap':
                        if (hypothesisConfig['Bootstrap']) {
                            const cfg = hypothesisConfig['Bootstrap'];
                            const statName = cfg.estadistico || 'media';
                            const B = cfg.iteraciones || 1000;
                            const nivelConfianza = cfg.nivelConfianza || 0.95;
                            
                            numericCols.forEach(col => {
                                const values = getNumericValues(data, col);
                                if (values.length < 10) {
                                    resultados['Bootstrap'] = { error: 'Se necesitan al menos 10 observaciones' };
                                    return;
                                }
                                resultados['Bootstrap'] = calcularBootstrap(values, statName, B, nivelConfianza);
                                resultados['Bootstrap'].columna = col;
                            });
                        } else {
                            resultados['Bootstrap'] = { error: 'Configure el estimador y número de remuestreos en el menú de hipótesis' };
                        }
                        break;

                    // ============================================================
                    // MULTIVARIADO - PCA
                    // ============================================================
                    case 'PCA (Componentes Principales)':
                    case 'PCA':
                        // Obtener columnas configuradas o usar todas las numéricas
                        let pcaColumns = numericCols;
                        if (hypothesisConfig['PCA (Componentes Principales)'] && hypothesisConfig['PCA (Componentes Principales)'].columnas) {
                            pcaColumns = hypothesisConfig['PCA (Componentes Principales)'].columnas;
                        }
                        
                        console.log('[PCA] pcaColumns:', pcaColumns);
                        
                        if (pcaColumns.length < 2) {
                            resultados['PCA (Componentes Principales)'] = { error: 'Seleccione al menos 2 columnas para PCA en la configuración' };
                        } else {
                            const dataMatrix = [];
                            const lengths = pcaColumns.map(col => getNumericValues(data, col).length);
                            const validLengths = lengths.filter(l => l > 0);
                            
                            console.log('[PCA] validLengths:', validLengths);
                            
                            if (validLengths.length < 2) {
                                resultados['PCA (Componentes Principales)'] = { error: 'No hay suficientes datos válidos en las columnas seleccionadas' };
                            } else {
                                // Usar todas las filas del dataset original para mantener consistencia
                                const allData = data.data || [];
                                const minRows = allData.length;
                                
                                for (let i = 0; i < minRows; i++) {
                                    const row = [];
                                    for (let j = 0; j < pcaColumns.length; j++) {
                                        const val = parseFloat(allData[i][pcaColumns[j]]);
                                        row.push(isNaN(val) ? 0 : val);
                                    }
                                    dataMatrix.push(row);
                                }
                                
                                console.log('[PCA] dataMatrix.length:', dataMatrix.length, 'dataMatrix[0]:', dataMatrix[0]);
                                
                                if (dataMatrix.length < 10) {
                                    resultados['PCA (Componentes Principales)'] = { error: 'Se necesitan al menos 10 observaciones para PCA' };
                                } else {
                                    const pcaResult = calcularPCA(dataMatrix, pcaColumns.length);
                                    console.log('[PCA] resultado:', pcaResult);
                                    resultados['PCA (Componentes Principales)'] = pcaResult;
                                    resultados['PCA (Componentes Principales)'].columnas = pcaColumns;
                                }
                            }
}
                         break;

                    // ============================================================
                    // MULTIVARIADO - ANÁLISIS FACTORIAL
                    // ============================================================
                    case 'Análisis Factorial':
                        // Obtener columnas configuradas o usar todas las numéricas
                        let afColumns = numericCols;
                        if (hypothesisConfig['Análisis Factorial'] && hypothesisConfig['Análisis Factorial'].columnas) {
                            afColumns = hypothesisConfig['Análisis Factorial'].columnas;
                        }
                        
                        if (afColumns.length < 3) {
                            resultados['Análisis Factorial'] = { error: 'Seleccione al menos 3 columnas para Análisis Factorial' };
                        } else {
                            const afDataMatrix = [];
                            const afLengths = afColumns.map(col => getNumericValues(data, col).length);
                            const afValidLengths = afLengths.filter(l => l > 0);
                            
                            if (afValidLengths.length < 3) {
                                resultados['Análisis Factorial'] = { error: 'No hay suficientes datos válidos en las columnas seleccionadas' };
                            } else {
                                // Usar todas las filas pero solo las columnas seleccionadas
                                const allData = data.data || [];
                                const minAfRows = allData.length;
                                
                                // Verificar que hay suficientes observaciones
                                if (minAfRows < afColumns.length * 2) {
                                    resultados['Análisis Factorial'] = { error: `Se necesitan al menos ${afColumns.length * 2} observaciones. Actualmente hay ${minAfRows}.` };
                                } else {
                                    // Construir matriz usando TODAS las filas de los datos originales
                                    for (let i = 0; i < minAfRows; i++) {
                                        const row = [];
                                        for (let j = 0; j < afColumns.length; j++) {
                                            const val = parseFloat(allData[i][afColumns[j]]);
                                            row.push(isNaN(val) ? 0 : val);
                                        }
                                        afDataMatrix.push(row);
                                    }
                                    
                                    const afResult = calcularAnalisisFactorial(afDataMatrix);
                                    resultados['Análisis Factorial'] = afResult;
                                    resultados['Análisis Factorial'].columnas = afColumns;
                                }
                            }
                        }
                        break;
                    
                    // ============================================================
                    // HIPÓTESIS - TOST (Equivalencia)
                    // ============================================================
                    case 'Test TOST (Equivalencia)':
                        if (hypothesisConfig['Test TOST (Equivalencia)'] && hypothesisConfig['Test TOST (Equivalencia)'].columnaX && hypothesisConfig['Test TOST (Equivalencia)'].columnaY) {
                            const cfg = hypothesisConfig['Test TOST (Equivalencia)'];
                            const values1 = getNumericValues(data, cfg.columnaX);
                            const values2 = getNumericValues(data, cfg.columnaY);
                            const delta = parseFloat(cfg.delta) || 0.5;
                            if (values1.length < 2 || values2.length < 2) {
                                resultados['Test TOST (Equivalencia)'] = { error: 'Ambas columnas necesitan al menos 2 valores numéricos' };
                            } else {
                                const res = calcularTOST(values1, values2, delta);
                                res.columnaX = cfg.columnaX;
                                res.columnaY = cfg.columnaY;
                                resultados['Test TOST (Equivalencia)'] = res;
                            }
                        } else {
                            resultados['Test TOST (Equivalencia)'] = { error: 'Configure los parámetros de TOST en el menú' };
                        }
                        break;

                    // ============================================================
                    // MULTIVARIADO - CLUSTER (K-Medias)
                    // ============================================================
                    case 'Análisis de Cluster':
                        {
                            let clusterColumns = numericCols;
                            if (hypothesisConfig['Análisis de Cluster'] && hypothesisConfig['Análisis de Cluster'].columnas) {
                                clusterColumns = hypothesisConfig['Análisis de Cluster'].columnas;
                            }
                            const k = hypothesisConfig['Análisis de Cluster']?.k || 3;
                            if (clusterColumns.length < 2) {
                                resultados['Análisis de Cluster'] = { error: 'Seleccione al menos 2 columnas numéricas' };
                            } else {
                                const dataMatrix = [];
                                const minLen = Math.min(...clusterColumns.map(col => getNumericValues(data, col).length));
                                for (let i = 0; i < minLen; i++) {
                                    const row = clusterColumns.map(col => parseFloat(data.data[i]?.[col] ?? NaN));
                                    if (row.some(v => isNaN(v))) continue;
                                    dataMatrix.push(row);
                                }
                                if (dataMatrix.length < 5) {
                                    resultados['Análisis de Cluster'] = { error: 'Se necesitan al menos 5 observaciones completas' };
                                } else {
                                    const res = calcularCluster(dataMatrix, k);
                                    res.columnas = clusterColumns;
                                    resultados['Análisis de Cluster'] = res;
                                }
                            }
                        }
                        break;

                    // ============================================================
                    // MULTIVARIADO - ANÁLISIS DISCRIMINANTE (LDA)
                    // ============================================================
                    case 'Análisis Discriminante':
                        {
                            const cfg = hypothesisConfig['Análisis Discriminante'];
                            const catCol = cfg?.categoricalCols?.[0];
                            const numCols = cfg?.columnas || numericCols;
                            if (!catCol) {
                                resultados['Análisis Discriminante'] = { error: 'Seleccione una columna de grupo y columnas numéricas' };
                            } else if (numCols.length < 2) {
                                resultados['Análisis Discriminante'] = { error: 'Seleccione al menos 2 columnas numéricas' };
                            } else {
                                const dataMatrix = [];
                                const labels = [];
                                for (let i = 0; i < data.data.length; i++) {
                                    const row = numCols.map(col => parseFloat(data.data[i]?.[col] ?? NaN));
                                    if (row.some(v => isNaN(v))) continue;
                                    dataMatrix.push(row);
                                    labels.push(data.data[i][catCol]);
                                }
                                if (dataMatrix.length < 10) {
                                    resultados['Análisis Discriminante'] = { error: 'Se necesitan al menos 10 observaciones completas' };
                                } else {
                                    const res = calcularDiscriminante(dataMatrix, labels);
                                    res.categoricalCol = catCol;
                                    res.columnas = numCols;
                                    resultados['Análisis Discriminante'] = res;
                                }
                            }
                        }
                        break;

                    // ============================================================
                    // MULTIVARIADO - MANOVA
                    // ============================================================
                    case 'M-ANOVA':
                        {
                            const cfg = hypothesisConfig['M-ANOVA'];
                            const catCol = cfg?.categoricalCols?.[0];
                            const numCols = cfg?.columnas || numericCols;
                            if (!catCol) {
                                resultados['M-ANOVA'] = { error: 'Seleccione una columna de grupo y columnas dependientes' };
                            } else if (numCols.length < 2) {
                                resultados['M-ANOVA'] = { error: 'Seleccione al menos 2 variables dependientes' };
                            } else {
                                const dataMatrix = [];
                                const labels = [];
                                for (let i = 0; i < data.data.length; i++) {
                                    const row = numCols.map(col => parseFloat(data.data[i]?.[col] ?? NaN));
                                    if (row.some(v => isNaN(v))) continue;
                                    dataMatrix.push(row);
                                    labels.push(data.data[i][catCol]);
                                }
                                if (dataMatrix.length < 10) {
                                    resultados['M-ANOVA'] = { error: 'Se necesitan al menos 10 observaciones completas' };
                                } else {
                                    const res = calcularMANOVA(dataMatrix, labels);
                                    res.categoricalCol = catCol;
                                    res.columnas = numCols;
                                    resultados['M-ANOVA'] = res;
                                }
                            }
                        }
                        break;

                    // ============================================================
                    // EXTRAS - SERIES TEMPORALES
                    // ============================================================
                    case 'Series Temporales':
                        {
                            const cfg = hypothesisConfig['Series Temporales'];
                            const col = cfg?.numericCol || numericCols[0];
                            const period = cfg?.periodo || Math.max(2, Math.floor(Math.sqrt(data.data.length)));
                            const values = getNumericValues(data, col);
                            if (values.length < 10) {
                                resultados['Series Temporales'] = { error: 'Se necesitan al menos 10 observaciones' };
                            } else {
                                const res = calcularSeriesTemporales(values, period);
                                res.columna = col;
                                resultados['Series Temporales'] = res;
                            }
                        }
                        break;

                    // ============================================================
                    // EXTRAS - ANÁLISIS DE SUPERVIVENCIA
                    // ============================================================
                    case 'Análisis de Supervivencia':
                        {
                            const cfg = hypothesisConfig['Análisis de Supervivencia'];
                            const tiempoCol = cfg?.columnaTiempo;
                            const eventoCol = cfg?.columnaEvento;
                            const grupoCol = cfg?.columnaGrupo;
                            if (!tiempoCol || !eventoCol) {
                                resultados['Análisis de Supervivencia'] = { error: 'Seleccione columna de tiempo y evento' };
                            } else {
                                const tiempos = getNumericValues(data, tiempoCol);
                                const eventos = data.data.map(row => {
                                    const v = row[eventoCol];
                                    if (typeof v === 'number') return v;
                                    if (typeof v === 'string') return ['1', 'si', 'yes', 'true'].includes(v.toLowerCase()) ? 1 : 0;
                                    return 0;
                                });
                                const grupos = grupoCol ? data.data.map(row => row[grupoCol]) : null;
                                if (tiempos.length < 5) {
                                    resultados['Análisis de Supervivencia'] = { error: 'Se necesitan al menos 5 observaciones' };
                                } else {
                                    const res = calcularSupervivencia(tiempos, eventos, grupos);
                                    res.columnaTiempo = tiempoCol;
                                    res.columnaEvento = eventoCol;
                                    if (grupoCol) res.columnaGrupo = grupoCol;
                                    resultados['Análisis de Supervivencia'] = res;
                                }
                            }
                        }
                        break;

                    // ============================================================
                    // EXTRAS - MODELOS MIXTOS
                    // ============================================================
                    case 'Modelos Mixtos':
                        {
                            const cfg = hypothesisConfig['Modelos Mixtos'];
                            const numCol = cfg?.numericCol;
                            const catCol = cfg?.categoricalCols?.[0];
                            if (!numCol || !catCol) {
                                resultados['Modelos Mixtos'] = { error: 'Seleccione columna numérica (Y) y columna de grupo' };
                            } else {
                                const Y = getNumericValues(data, numCol);
                                const grupos = data.data.map(row => row[catCol]);
                                if (Y.length < 10) {
                                    resultados['Modelos Mixtos'] = { error: 'Se necesitan al menos 10 observaciones' };
                                } else {
                                    const res = calcularModelosMixtos(Y, null, grupos);
                                    res.columnaY = numCol;
                                    res.columnaGrupo = catCol;
                                    resultados['Modelos Mixtos'] = res;
                                }
                            }
                        }
                        break;

                    // ============================================================
                    // EXTRAS - ANÁLISIS BAYESIANO
                    // ============================================================
                    case 'Análisis Bayesiano':
                        {
                            const cfg = hypothesisConfig['Análisis Bayesiano'];
                            const col = cfg?.numericCol || numericCols[0];
                            const prior = {
                                media: parseFloat(cfg?.priorMedia) || 0,
                                varianza: parseFloat(cfg?.priorVarianza) || null
                            };
                            const values = getNumericValues(data, col);
                            if (values.length < 5) {
                                resultados['Análisis Bayesiano'] = { error: 'Se necesitan al menos 5 observaciones' };
                            } else {
                                if (!prior.varianza) prior.varianza = calcularVarianza(values, true);
                                const res = calcularBayesiano(values, prior);
                                res.columna = col;
                                resultados['Análisis Bayesiano'] = res;
                            }
                        }
                        break;
                }
        });
        
        return {
            columnasAnalizadas: numericCols,
            totalColumnas: numericCols.length,
            totalFilas: data.rowCount,
            estadisticos: estadisticos,
            resultados: resultados
        };
    }
    
    /**
     * Formatea referencia bibliográfica desde array a string
     */
    function formatReferencia(ref) {
        if (!ref) return '';
        if (typeof ref === 'string') return ref;
        
        if (Array.isArray(ref) && ref.length > 0) {
            const r = ref[0];
            let citation = r.autores || '';
            if (r.anio) citation += ` (${r.anio})`;
            if (r.titulo) citation += `. ${r.titulo}`;
            if (r.revista) citation += `. ${r.revista}`;
            if (r.volumen) citation += `, ${r.volumen}`;
            if (r.paginas) citation += `, ${r.paginas}`;
            return citation;
        }
        return '';
    }

    /**
     * Genera un reporte en texto formateado
     */
    function generarReporte(analisisResultado) {
        const STAT_META = getStatMeta();
        
        let reporte = `
═══════════════════════════════════════════════════════════
            REPORTE DE ESTADÍSTICA DESCRIPTIVA
═══════════════════════════════════════════════════════════
            REPORTE DE ESTADÍSTICA DESCRIPTIVA
═══════════════════════════════════════════════════════════

📊 INFORMACIÓN GENERAL
───────────────────────────────────────────────────────────
Total de filas:              ${analisisResultado.totalFilas}
Columnas numéricas:          ${analisisResultado.totalColumnas}
Columnas analizadas:         ${analisisResultado.columnasAnalizadas.join(', ')}
Estadísticos calculados:     ${analisisResultado.estadisticos.length}

`;
        
        // Agregar resultados por estadístico
        Object.keys(analisisResultado.resultados).forEach(estadistico => {
            reporte += `\n📈 ${estadistico.toUpperCase()}\n`;
            reporte += `${'─'.repeat(63)}\n`;
            
            const datos = analisisResultado.resultados[estadistico];
            
            Object.keys(datos).forEach(columna => {
                const valor = datos[columna];
                
                if (typeof valor === 'object' && !Array.isArray(valor)) {
                    // Para objetos (como percentiles, IC, outliers)
                    reporte += `\n   ${columna}:\n`;
                    Object.keys(valor).forEach(key => {
                        const val = valor[key];
                        if (val && typeof val === 'object' && !Array.isArray(val)) {
                            // Objeto anidado (como IC: {inferior, superior, margen})
                            reporte += `      ${key}: [${val.inferior?.toFixed(4) ?? 'N/A'}, ${val.superior?.toFixed(4) ?? 'N/A'}]\n`;
                        } else {
                            reporte += `      ${key}: ${typeof val === 'number' ? val.toFixed(4) : val}\n`;
                        }
                    });
                } else if (Array.isArray(valor)) {
                    // Para arrays (como moda)
                    reporte += `   ${columna}: ${valor.length > 0 ? valor.map(v => v.toFixed(4)).join(', ') : 'No hay moda'}\n`;
                } else {
                    // Para valores simples
                    reporte += `   ${columna}: ${typeof valor === 'number' ? valor.toFixed(4) : valor}\n`;
                }
            });
        });
        
        reporte += `\n${'═'.repeat(63)}\n`;
        
        // Agregar notas metodológicas
        reporte += `\n📚 NOTAS METODOLÓGICAS\n`;
        reporte += `${'─'.repeat(63)}\n`;
        
        const statKeys = Object.keys(analisisResultado.resultados);
        statKeys.forEach(key => {
            const meta = STAT_META[key] || { formula: '', desc: '', icono: '📊' };
            if (!meta.desc) return;
            
            reporte += `\n${meta.icono} ${key}\n`;
            reporte += `   Fórmula: ${meta.formula}\n`;
            reporte += `   ${meta.desc}\n`;
            
            // Agregar hipótesis si existe
            if (meta.hipotesis) {
                reporte += `   └─ H₀: ${meta.hipotesis.h0}\n`;
                reporte += `   └─ H₁: ${meta.hipotesis.h1}\n`;
            }
            
            // Agregar supuestos si existen
            if (meta.supuestos && meta.supuestos.length > 0) {
                reporte += `   └─ Supuestos: ${meta.supuestos.join(', ')}\n`;
            }
            
            // Agregar tamaño de efecto si existe
            if (meta.efectoTamano) {
                reporte += `   └─ Tamaño efecto: ${meta.efectoTamano.metrica} (${meta.efectoTamano.formula})\n`;
            }
            
            // Agregar referencia si existe
            if (meta.referencia) {
                reporte += `   └─ Ref: ${formatReferencia(meta.referencia)}\n`;
            }
        });
        
        reporte += `\n${'═'.repeat(63)}\n`;
        reporte += `Generado: ${new Date().toLocaleString('es-ES')}\n`;
        reporte += `${'═'.repeat(63)}\n`;
        
        return reporte;
    }
    
    /**
     * Genera un reporte en texto formateado
     */
    function generarReporte(analisisResultado) {
        const STAT_META = getStatMeta();
        
        let reporte = `
═════════════════════════════════════════════════════════
            REPORTE DE ESTADÍSTICA DESCRIPTIVA
═════════════════════════════════════════════════════════

📊 INFORMACIÓN GENERAL
──────────────────────────────────────────────────────────
Total de filas:              ${analisisResultado.totalFilas}
Columnas numéricas:          ${analisisResultado.totalColumnas}
Columnas analizadas:         ${analisisResultado.columnasAnalizadas.join(', ')}
Estadísticos calculados:     ${analisisResultado.estadisticos.length}

`;
        
        // Agregar resultados por estadístico
        Object.keys(analisisResultado.resultados).forEach(estadistico => {
            reporte += `\n📈 ${estadistico.toUpperCase()}\n`;
            reporte += `${'─'.repeat(63)}\n`;
            
            const datos = analisisResultado.resultados[estadistico];
            
            Object.keys(datos).forEach(columna => {
                const valor = datos[columna];
                
                if (typeof valor === 'object' && !Array.isArray(valor)) {
                    reporte += `\n   ${columna}:\n`;
                    Object.keys(valor).forEach(key => {
                        const val = valor[key];
                        if (val && typeof val === 'object' && !Array.isArray(val)) {
                            reporte += `      ${key}: [${val.inferior?.toFixed(4) ?? 'N/A'}, ${val.superior?.toFixed(4) ?? 'N/A'}]\n`;
                        } else {
                            reporte += `      ${key}: ${typeof val === 'number' ? val.toFixed(4) : val}\n`;
                        }
                    });
                } else if (Array.isArray(valor)) {
                    reporte += `   ${columna}: ${valor.length > 0 ? valor.map(v => v.toFixed(4)).join(', ') : 'No hay moda'}\n`;
                } else {
                    reporte += `   ${columna}: ${typeof valor === 'number' ? valor.toFixed(4) : valor}\n`;
                }
            });
        });
        
        reporte += `\n${'─'.repeat(63)}\n`;
        
        // Agregar notas metodológicas
        reporte += `\n📚 NOTAS METODOLÓGICAS\n`;
        reporte += `${'─'.repeat(63)}\n`;
        
        const statKeys = Object.keys(analisisResultado.resultados);
        statKeys.forEach(key => {
            const meta = STAT_META[key] || { formula: '', desc: '', icono: '📊' };
            if (!meta.desc) return;
            
            reporte += `\n${meta.icono} ${key}\n`;
            reporte += `   Fórmula: ${meta.formula}\n`;
            reporte += `   ${meta.desc}\n`;
            
            if (meta.hipotesis) {
                reporte += `   └─ H₀: ${meta.hipotesis.h0}\n`;
                reporte += `   └─ H₁: ${meta.hipotesis.h1}\n`;
            }
            
            if (meta.supuestos && meta.supuestos.length > 0) {
                reporte += `   └─ Supuestos: ${meta.supuestos.join(', ')}\n`;
            }
            
            if (meta.efectoTamano) {
                reporte += `   └─ Tamaño efecto: ${meta.efectoTamano.metrica} (${meta.efectoTamano.formula})\n`;
            }
            
            if (meta.referencia) {
                reporte += `   └─ Ref: ${formatReferencia(meta.referencia)}\n`;
            }
        });
        
        reporte += `\n${'═'.repeat(63)}\n`;
        reporte += `Generado: ${new Date().toLocaleString('es-ES')}\n`;
        reporte += `${'═'.repeat(63)}\n`;
        
        return reporte;
    }
    
    /**
     * Función helper para obtener STAT_META (disponible en ambos reportes)
     * Ahora usa estadisticosConfig.js para obtener metadata completa
     */
    function formatReferencia(ref) {
        if (!ref) return '';
        if (typeof ref === 'string') return ref;
        
        if (Array.isArray(ref) && ref.length > 0) {
            const r = ref[0];
            let citation = r.autores || '';
            if (r.anio) citation += ` (${r.anio})`;
            if (r.titulo) citation += `. ${r.titulo}`;
            if (r.revista) citation += `. ${r.revista}`;
            if (r.volumen) citation += `, ${r.volumen}`;
            if (r.paginas) citation += `, ${r.paginas}`;
            return citation;
        }
        return '';
    }

    function getStatMeta() {
        // Usar getStatMetaConfig si está disponible (desde estadisticosConfig.js)
        if (typeof getStatMetaConfig === 'function') {
            return getStatMetaConfig();
        }
        
        // Fallback: objeto hardcoded para compatibilidad
        return {
            'Media Aritmética':   { formula: 'x̄ = Σxᵢ / n',                        desc: 'Tendencia central de la distribución.',          icono: '📐' },
            'Mediana':            { formula: 'P₅₀ — valor central al ordenar datos', desc: 'Divide la distribución en dos mitades iguales.',             icono: '📊' },
            'Test de Normalidad': { formula: 'JB = (n/6)(S² + K²/4)', desc: 'Jarque-Bera: Test basado en asimetría y curtosis.', icono: '🔔' },
            'Test de Shapiro-Wilk': { formula: 'W = (Σaᵢx₍ᵢ₎)² / Σ(xᵢ − x̄)²', desc: 'Shapiro-Wilk: Test más potente para muestras pequeñas.', icono: '🔔' },
            'Test de Kolmogorov-Smirnov': { formula: 'D = max|Fₙ(x) − F(x)|', desc: 'Kolmogorov-Smirnov (Lilliefors).', icono: '🔔' },
            'Test de Anderson-Darling': { formula: 'A² = −n − (1/n)Σ(2i−1)[ln(Fᵢ)+ln(1−Fₙ₊₁₋ᵢ)]', desc: 'Versión mejorada de K-S.', icono: '🔔' },
            "Test de D'Agostino-Pearson": { formula: 'K² = Z_skew² + Z_kurt² ~ χ²(2)', desc: "D'Agostino-Pearson (Omnibus).", icono: '🔔' },
            'T-Test (una muestra)': { formula: 't = (x̄ − μ₀) / (s/√n)', desc: 'Compara la media muestral con un valor hipotético.', icono: '🔬' },
            'ANOVA One-Way': { formula: 'F = MSB / MSW', desc: 'Compara medias de 3+ grupos.', icono: '📊' },
            'Mann-Whitney U': { formula: 'U = min(U₁, U₂)', desc: 'Alternativa no-paramétrica al t-test.', icono: '⚖️' },
            'Kruskal-Wallis': { formula: 'H = [12/(N(N+1))]Σ(Rᵢ²/nᵢ) − 3(N+1)', desc: 'Alternativa no-paramétrica al ANOVA.', icono: '📊' }
        };
    }
    
    /**
     * Genera resultados en formato HTML para mostrar en la interfaz
     */
/**
 * Genera el HTML completo de los resultados estadísticos en formato acordeón.
 * @param {Object} analisisResultado - Resultado devuelto por ejecutarAnalisis()
 * @returns {string} HTML listo para inyectar en el DOM
 */
/**
 * Genera el HTML completo de los resultados estadísticos en formato acordeón.
 * @param {Object} analisisResultado - Resultado devuelto por ejecutarAnalisis()
 * @returns {string} HTML listo para inyectar en el DOM
 */
function generarHTML(analisisResultado) {
    const STAT_META = getStatMeta();
    const statKeys = Object.keys(analisisResultado.resultados);
    const cols = analisisResultado.columnasAnalizadas;
    const hasParams = typeof ParametrosManager !== 'undefined';

    // ============================================================
    // FUNCIONES INTERNAS AUXILIARES (kpiCards, hypothesisKpiCards, etc.)
    // ============================================================
    
    function escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function formatReferencia(ref) {
        if (!ref) return '';
        if (typeof ref === 'string') return ref;
        if (Array.isArray(ref) && ref.length > 0) {
            const r = ref[0];
            let citation = r.autores || '';
            if (r.anio) citation += ` (${r.anio})`;
            if (r.titulo) citation += `. ${r.titulo}`;
            if (r.revista) citation += `. ${r.revista}`;
            if (r.volumen) citation += `, ${r.volumen}`;
            if (r.paginas) citation += `, ${r.paginas}`;
            return citation;
        }
        return '';
    }

    // ── KPI cards para estadísticos simples ─────────────────────
    function kpiCards(statKey) {
        const data = analisisResultado.resultados[statKey];
        if (!data) return '';

        // Si es prueba de hipótesis, usar vista especial
        if (HYPOTHESIS_SET.has(statKey)) {
            return hypothesisKpiCards(statKey, data);
        }

        // Si es PCA (estadístico multivariado)
        if (statKey === 'PCA (Componentes Principales)' || statKey === 'PCA') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const cols = data.columnas || [];
            const nComp = data.nComponentes || 0;
            const varExp = data.varianceExplained || [];
            const cumVar = data.cumulativeVariance || [];
            const eigenvalues = data.eigenvalues || [];
            return `
                <div class="ar-kpi-card" style="margin-bottom:16px;max-width:100%;overflow:hidden;">
                    <div class="ar-kpi-col-label" style="font-size:0.95rem;margin-bottom:10px;">📊 PCA - Análisis de Componentes Principales</div>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:0.8rem;">
                        <div style="background:#f5f5f5;padding:8px;border-radius:4px;text-align:center;">
                            <div style="color:#aaa;font-size:0.7rem;">Observaciones</div>
                            <div style="font-weight:bold;font-size:0.95rem;">${data.nObservaciones || '—'}</div>
                        </div>
                        <div style="background:#f5f5f5;padding:8px;border-radius:4px;text-align:center;">
                            <div style="color:#aaa;font-size:0.7rem;">Variables</div>
                            <div style="font-weight:bold;font-size:0.95rem;">${data.nVariables || '—'}</div>
                        </div>
                        <div style="background:#f5f5f5;padding:8px;border-radius:4px;text-align:center;">
                            <div style="color:#aaa;font-size:0.7rem;">Componentes</div>
                            <div style="font-weight:bold;font-size:0.95rem;">${nComp}</div>
                        </div>
                        <div style="background:#e8f5e9;padding:8px;border-radius:4px;text-align:center;">
                            <div style="color:#2e7d32;font-size:0.7rem;">Varianza Total</div>
                            <div style="font-weight:bold;font-size:0.95rem;color:#2e7d32;">${cumVar[cumVar.length - 1]?.toFixed(1) || '—'}%</div>
                        </div>
                    </div>
                </div>
                <div class="ar-kpi-card" style="margin-bottom:16px;overflow-x:auto;">
                    <div class="ar-kpi-col-label" style="font-size:0.85rem;margin-bottom:8px;">📈 Varianza Explicada por Componente</div>
                    <table style="width:100%;min-width:280px;border-collapse:collapse;font-size:0.7rem;table-layout:fixed;">
                        <thead><tr style="background:#e3f2fd;"><th style="padding:5px;text-align:center;width:50px;">PC</th><th style="padding:5px;text-align:right;">Autovalor</th><th style="padding:5px;text-align:right;">% Var</th><th style="padding:5px;text-align:right;">% Acum</th></tr></thead>
                        <tbody>
                            ${eigenvalues.slice(0, Math.min(10, nComp)).map((ev, i) => `
                                <tr style="border-bottom:1px solid #eee;"><td style="padding:4px;text-align:center;font-weight:bold;">PC${i + 1}</td>
                                <td style="padding:4px;text-align:right;">${ev?.toFixed(3) || '—'}</td>
                                <td style="padding:4px;text-align:right;">${varExp[i]?.toFixed(1) || '—'}%</td>
                                <td style="padding:4px;text-align:right;font-weight:bold;">${cumVar[i]?.toFixed(1) || '—'}%</td></tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="ar-kpi-card" style="margin-bottom:16px;overflow-x:auto;">
                    <div class="ar-kpi-col-label" style="font-size:0.85rem;margin-bottom:8px;">📋 Cargas Factoriales (Loadings)</div>
                    <table style="width:100%;min-width:250px;border-collapse:collapse;font-size:0.7rem;table-layout:fixed;">
                        <thead><tr style="background:#e8f5e9;"><th style="padding:5px;text-align:left;width:60px;">Variable</th>${Array.from({length: Math.min(3, nComp)}, (_, i) => `<th style="padding:5px;text-align:right;">PC${i + 1}</th>`).join('')}</tr></thead>
                        <tbody>
                            ${cols.slice(0, 10).map((col, i) => {
                                const loadings = data.loadings || [];
                                const cargasFactor = loadings.map(f => f[i]);
                                return `<tr style="border-bottom:1px solid #eee;"><td style="padding:4px;font-weight:500;font-size:0.7rem;">${escapeHtml(col)}</td>
                                        ${Array.from({length: Math.min(3, nComp)}, (_, j) => `<td style="padding:4px;text-align:right;">${cargasFactor[j]?.toFixed(3) || '—'}</td>`).join('')}
                                    </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                ${data.interpretacion ? `<div class="ar-formula" style="margin-top:12px;padding:10px;background:#fff3e0;border-radius:6px;border-left:4px solid #ff9800;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc" style="font-size:0.8rem;line-height:1.4;">${escapeHtml(data.interpretacion)}</div></div></div>` : ''}
            `;
        }

        // Si es Análisis Factorial
        if (statKey === 'Análisis Factorial') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const cols = data.columnas || [];
            const nFact = data.nFactores || 0;
            const loadings = data.loadings || [];
            const communality = data.communality || [];
            const kmo = data.kmo || 0;
            const bartlett = data.Bartlett || {};
            return `
                <div class="ar-kpi-card" style="margin-bottom:16px;max-width:100%;overflow:hidden;">
                    <div class="ar-kpi-col-label" style="font-size:0.95rem;margin-bottom:10px;">📊 Análisis Factorial - Resumen</div>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:0.8rem;">
                        <div style="background:#f5f5f5;padding:8px;border-radius:4px;text-align:center;"><div style="color:#aaa;font-size:0.7rem;">Observaciones</div><div style="font-weight:bold;font-size:0.95rem;">${data.nObservaciones || '—'}</div></div>
                        <div style="background:#f5f5f5;padding:8px;border-radius:4px;text-align:center;"><div style="color:#aaa;font-size:0.7rem;">Variables</div><div style="font-weight:bold;font-size:0.95rem;">${data.nVariables || '—'}</div></div>
                        <div style="background:#f5f5f5;padding:8px;border-radius:4px;text-align:center;"><div style="color:#aaa;font-size:0.7rem;">Factores</div><div style="font-weight:bold;font-size:0.95rem;">${nFact}</div></div>
                        <div style="background:#e8f5e9;padding:8px;border-radius:4px;text-align:center;"><div style="color:#2e7d32;font-size:0.7rem;">KMO</div><div style="font-weight:bold;font-size:0.95rem;">${kmo > 0 ? kmo.toFixed(3) : '—'}</div></div>
                    </div>
                </div>
                ${bartlett && bartlett.chi2 ? `<div class="ar-kpi-card" style="margin-top:8px;"><div class="ar-kpi-col-label" style="font-size:0.9rem;">📐 Test de Bartlett</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:0.8rem;"><div style="background:#f5f5f5;padding:6px;border-radius:4px;text-align:center;"><div style="color:#aaa;font-size:0.7rem;">χ²</div><div style="font-weight:bold;">${bartlett.chi2?.toFixed(2) || '—'}</div></div><div style="background:#f5f5f5;padding:6px;border-radius:4px;text-align:center;"><div style="color:#aaa;font-size:0.7rem;">gl</div><div style="font-weight:bold;">${bartlett.df || '—'}</div></div><div style="background:#e8f5e9;padding:6px;border-radius:4px;text-align:center;"><div style="color:#2e7d32;font-size:0.7rem;">Valor p</div><div style="font-weight:bold;">${bartlett.pValue?.toFixed(4) || '—'}</div></div></div></div>` : ''}
                <div class="ar-kpi-card" style="margin-top:8px;overflow-x:auto;">
                    <div class="ar-kpi-col-label" style="font-size:0.9rem;">📈 Matriz de Cargas Factoriales</div>
                    <table style="width:100%;border-collapse:collapse;font-size:0.75rem;min-width:300px;">
                        <tr style="background:#e0e0e0;"><th style="padding:4px;text-align:left;">Variable</th>${Array.from({length: Math.min(3, nFact)}, (_, i) => `<th style="padding:4px;text-align:right;">F${i+1}</th>`).join('')}<th style="padding:4px;text-align:right;">h²</th></tr>
                        ${cols.slice(0, 12).map((col, i) => {
                            const loadings = data.loadings || [];
                            const comun = data.communality || [];
                            const cargasFactor = loadings.map(f => f[i]);
                            return `<tr style="${i%2===0?'background:#f9f9f9':''}"><td style="padding:3px;font-size:0.7rem;">${escapeHtml(col.substring(0,12))}</td>
                                    ${Array.from({length: Math.min(3, nFact)}, (_, j) => `<td style="padding:3px;text-align:right;">${cargasFactor[j]?.toFixed(3) || '—'}</td>`).join('')}
                                    <td style="padding:3px;text-align:right;font-weight:bold;">${comun[i]?.toFixed(3) || '—'}</td></tr>`;
                        }).join('')}
                    </table>
                </div>
                ${data.interpretacion ? `<div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion)}</div></div></div>` : ''}
            `;
        }

        // Caso genérico: iterar sobre columnas
        return cols.map(col => {
            const val = data[col];
            if (val === undefined) return '';

            const compliance = null; // (código original omitido)
            let dispersionEval = null;
            const dispersionStats = {
                'Desviación Estándar': 'Desviación Estándar',
                'Varianza': 'Varianza',
                'Coeficiente de Variación': 'Coeficiente de Variación',
                'Intervalos de Confianza': 'Intervalos de Confianza'
            };
            if (hasParams && dispersionStats[statKey]) {
                const numVal = typeof val === 'number' ? val : null;
                if (numVal !== null) {
                    dispersionEval = ParametrosManager.evaluarDispersion(dispersionStats[statKey], numVal, col);
                }
            }
            const dispersionBadgeHTML = dispersionEval && dispersionEval.status
                ? `<div class="ar-kpi-badge ar-badge-dispersion ar-badge-${dispersionEval.status}">
                    ${dispersionEval.status === 'ok' ? '🟢' : dispersionEval.status === 'warn' ? '🟡' : '🔴'} ${dispersionEval.label}
                   </div>` : '';
            const dispersionLimitsHTML = dispersionEval && dispersionEval.umbral
                ? `<div class="ar-kpi-badge ar-badge-dispersion" style="opacity:0.85;font-size:0.65rem;">
                    📐 Límites: &lt;${dispersionEval.umbral.alerta} (ok) | ${dispersionEval.umbral.alerta}-${dispersionEval.umbral.critico} (⚠️) | ≥${dispersionEval.umbral.critico} (🔴)
                   </div>` : '';

            // Objeto (percentiles, rango)
            if (typeof val === 'object' && !Array.isArray(val)) {
                // Caso especial: Detección de Outliers
                if (val.IQR && val.ZScore) {
                    const renderOutlierMethod = (methodObj) => {
                        if (!methodObj || typeof methodObj !== 'object') return '<div>—</div>';
                        const cantidad = methodObj.cantidad ?? methodObj.cantidadOutliers ?? 0;
                        const pct = methodObj.porcentaje ?? methodObj.porcentajeOutliers ?? 0;
                        const hasLimits = methodObj.limiteInferior !== undefined && methodObj.limiteSuperior !== undefined && 
                                         methodObj.limiteInferior !== null && methodObj.limiteSuperior !== null;
                        const hasUmbral = methodObj.umbralZScore !== undefined && methodObj.umbralZScore !== null;
                        let limitsDisplay = '—';
                        if (hasLimits) limitsDisplay = `[${methodObj.limiteInferior.toFixed(4)}, ${methodObj.limiteSuperior.toFixed(4)}]`;
                        else if (hasUmbral) limitsDisplay = `±${methodObj.umbralZScore.toFixed(4)}`;
                        return `<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Cantidad</span><span class="ar-kpi-sub-v">${cantidad}</span></div>
                                <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">%</span><span class="ar-kpi-sub-v">${typeof pct === 'number' ? pct.toFixed(2) : pct}%</span></div>
                                <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Límites</span><span class="ar-kpi-sub-v">${limitsDisplay}</span></div>`;
                    };
                    return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${escapeHtml(col)}</div>
                            <div class="ar-kpi-sub-grid" style="margin-bottom:8px;"><div style="font-weight:600;color:#e74c3c;grid-column:1/-1;">IQR</div>${renderOutlierMethod(val.IQR)}</div>
                            <div class="ar-kpi-sub-grid"><div style="font-weight:600;color:#3498db;grid-column:1/-1;">Z-Score</div>${renderOutlierMethod(val.ZScore)}</div>
                            ${dispersionBadgeHTML}${dispersionLimitsHTML}
                            </div>`;
                }
                const rows = Object.entries(val).map(([k, v]) => {
                    if (Array.isArray(v)) return `<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">${k}</span><span class="ar-kpi-sub-v">${v.length} valores</span></div>`;
                    if (v && typeof v === 'object' && !Array.isArray(v)) {
                        const lower = v.inferior?.toFixed(4) ?? v.limiteInferior?.toFixed(4) ?? '—';
                        const upper = v.superior?.toFixed(4) ?? v.limiteSuperior?.toFixed(4) ?? '—';
                        const margen = v.margen?.toFixed(4) ?? '';
                        const display = margen ? `[${lower}, ${upper}] ±${margen}` : `[${lower}, ${upper}]`;
                        return `<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">${k}</span><span class="ar-kpi-sub-v">${display}</span></div>`;
                    }
                    return `<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">${k}</span><span class="ar-kpi-sub-v">${typeof v === 'number' ? v.toFixed(4) : v}</span></div>`;
                }).join('');
                return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${escapeHtml(col)}</div><div class="ar-kpi-sub-grid">${rows}</div>${dispersionBadgeHTML}${dispersionLimitsHTML}</div>`;
            }

            // Array (moda)
            if (Array.isArray(val)) {
                const display = val.length > 0 ? val.map(v => v.toFixed(4)).join(', ') : '—';
                return `<div class="ar-kpi-card"><div class="ar-kpi-col-label">${escapeHtml(col)}</div><div class="ar-kpi-val ar-kpi-val-sm">${display}</div>${dispersionBadgeHTML}${dispersionLimitsHTML}</div>`;
            }

            // Escalar simple
            const display = typeof val === 'number' ? val.toFixed(4) : String(val);
            return `<div class="ar-kpi-card"><div class="ar-kpi-col-label">COLUMNA ${escapeHtml(col)}</div><div class="ar-kpi-val">${display}</div>${dispersionBadgeHTML}${dispersionLimitsHTML}</div>`;
        }).join('');
    }

    // ── KPI cards para pruebas de hipótesis ─────────────────
    function hypothesisKpiCards(statKey, data) {
        // Regresión Lineal Simple (formato rico: ICH/FDA, desviaciones, residuales)
        if (statKey === 'Regresión Lineal Simple') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const desvRows = (data.desviaciones || []).map(d => `
                <tr>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${d.concentracion}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${d.areaObservada}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${d.areaRetrocalculada}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right;${Math.abs(d.desviacionPct) > 5 ? 'color:#c53030;font-weight:600' : ''}">${d.desviacionPct}%</td>
                </tr>`).join('');
            const resRows = (data.residuos || []).map((r, i) => {
                return `
                <tr>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${i + 1}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.desviaciones?.[i]?.areaObservada ?? '—'}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.predicciones?.[i] ?? '—'}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${r.toFixed(4)}</td>
                </tr>`}).join('');
            const icInterText = data.icInterceptLower != null
                ? `[${data.icInterceptLower}, ${data.icInterceptUpper}]`
                : '—';
            const ichLabel = data.cumpleICH
                ? '✓ Cumple ICH Q2(R1) — Linealidad aceptada (R² ≥ 0.999)'
                : '✗ No cumple ICH — R² < 0.999';
            const ichClass = data.cumpleICH ? 'ar-badge-ok' : 'ar-badge-danger';
            const fdaLabel = data.cumpleFDA
                ? '✓ Cumple FDA Bioanalytical (R² ≥ 0.995)'
                : data.r2 >= 0.99
                    ? '⚠ Cumple parcialmente FDA (R² ≥ 0.99)'
                    : '✗ No cumple FDA (R² < 0.995)';
            const fdaClass = data.cumpleFDA ? 'ar-badge-ok' : 'ar-badge-warn';
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📈 Y = f(${data.columnaX || 'X'})</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Intercepto (a)</span><span class="ar-kpi-sub-v">${data.a ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Pendiente (b)</span><span class="ar-kpi-sub-v">${data.b ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${data.r2 ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R² Ajustado</span><span class="ar-kpi-sub-v">${data.r2Adj ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Error Estándar</span><span class="ar-kpi-sub-v">${data.errorEstandar ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p-valor (b)</span><span class="ar-kpi-sub-v">${data.pPendiente?.toFixed(6) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">IC 95% pendiente</span><span class="ar-kpi-sub-v">[${data.icPendienteLower ?? '—'}, ${data.icPendienteUpper ?? '—'}]</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">IC 95% intercepto</span><span class="ar-kpi-sub-v">${icInterText}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Máx % desviación</span><span class="ar-kpi-sub-v">${data.maxDesviacion ?? '—'}%</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significante ? '★ Modelo significativo (p < 0.05)' : '✓ Modelo no significativo (p ≥ 0.05)'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">${data.formula || `Y = ${data.a} + ${data.b}X`}</div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>
                    <div class="ar-kpi-card ar-kpi-multi" style="margin-top:8px">
                        <div class="ar-kpi-col-label">📋 Validación ICH Q2(R1)</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Criterio ICH</span><span class="ar-kpi-sub-v">R² ≥ 0.999</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R² actual</span><span class="ar-kpi-sub-v">${data.r2?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">IC 95% intercepto</span><span class="ar-kpi-sub-v">${icInterText}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Máx desviación</span><span class="ar-kpi-sub-v">${data.maxDesviacion ?? '—'}%</span></div>
                        </div>
                        <div class="ar-kpi-badge ${ichClass}">${ichLabel}</div>
                        <div class="ar-kpi-badge ${fdaClass}" style="margin-top:4px">${fdaLabel}</div>
                    </div>
                    ${data.desviaciones?.length ? `<details style="margin-top:8px">
                        <summary style="cursor:pointer;font-size:0.85rem;color:#718096">📊 Ver tabla de desviaciones por nivel</summary>
                        <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem">
                            <thead><tr style="background:#000">
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Conc.</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Área obs.</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Área retro.</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">% Desv.</th>
                            </tr></thead>
                            <tbody>${desvRows}</tbody>
                        </table>
                    </details>` : ''}
                    ${data.residuos?.length ? `<details style="margin-top:8px">
                        <summary style="cursor:pointer;font-size:0.85rem;color:#718096">📉 Ver residuales</summary>
                        <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem">
                            <thead><tr style="background:#000">
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">#</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Observado</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Predicho</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Residual</th>
                            </tr></thead>
                            <tbody>${resRows}</tbody>
                        </table>
                    </details>` : ''}`;
        }
        // Regresión Lineal Múltiple
        if (statKey === 'Regresión Lineal Múltiple') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const coefRows = (data.coeficientes || []).map((c, i) => `
                <tr>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:left">${escapeHtml(c.variable || 'X' + (i+1))}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${c.valor?.toFixed(4) ?? '—'}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${c.ee?.toFixed(4) ?? '—'}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${c.t?.toFixed(4) ?? '—'}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right;${c.p < 0.05 ? 'color:#c53030;font-weight:600' : ''}">${c.p?.toFixed(4) ?? '—'}</td>
                </tr>`).join('');
            const resRows = (data.residuos || []).map((r, i) => `
                <tr>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${i + 1}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.predicciones?.[i]?.toFixed(4) ?? '—'}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${r.toFixed(4)}</td>
                </tr>`).join('');
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📊 Y = f(${data.columnasX?.join(', ') || 'X₁,...,Xₖ'})</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${data.r2 ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R² Ajustado</span><span class="ar-kpi-sub-v">${data.r2Adj ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Error Estándar</span><span class="ar-kpi-sub-v">${data.errorEstandar ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Predictores (k)</span><span class="ar-kpi-sub-v">${data.k ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significante ? '★ Modelo significativo' : '✓ Modelo no significativo'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">${data.formula || data.modelo || ''}</div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>
                    ${coefRows ? `<details style="margin-top:8px">
                        <summary style="cursor:pointer;font-size:0.85rem;color:#718096">📋 Ver coeficientes del modelo</summary>
                        <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem">
                            <thead><tr style="background:#000">
                                <th style="padding:4px 8px;border:1px solid #333;text-align:left;color:#fff">Variable</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">β</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">EE</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">t</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">p</th>
                            </tr></thead>
                            <tbody>${coefRows}</tbody>
                        </table>
                    </details>` : ''}
                    ${data.residuos?.length ? `<details style="margin-top:8px">
                        <summary style="cursor:pointer;font-size:0.85rem;color:#718096">📉 Ver residuales</summary>
                        <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem">
                            <thead><tr style="background:#000">
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">#</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Predicho</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Residual</th>
                            </tr></thead>
                            <tbody>${resRows}</tbody>
                        </table>
                    </details>` : ''}`;
        }
        // Regresión Polinomial
        if (statKey === 'Regresión Polinomial') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const coefRows = (data.coeficientes || []).map((c, i) => `
                <tr>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:center">${i === 0 ? 'x⁰ (cte)' : 'x' + 'ⁱ'.repeat(i)}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${(typeof c === 'number' ? c : c.valor)?.toFixed(4) ?? '—'}</td>
                </tr>`).join('');
            const resRows = (data.residuos || []).map((r, i) => `
                <tr>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${i + 1}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.predicciones?.[i]?.toFixed(4) ?? '—'}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${r.toFixed(4)}</td>
                </tr>`).join('');
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📈 Y = f(${data.columnaX || 'X'}) - Grado ${data.grado || 2}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${data.r2 ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R² Ajustado</span><span class="ar-kpi-sub-v">${data.r2Adj ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Error Estándar</span><span class="ar-kpi-sub-v">${data.errorEstandar ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grado</span><span class="ar-kpi-sub-v">${data.grado ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significante ? '★ Modelo significativo' : '✓ Modelo no significativo'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">${data.formula || data.modelo || ''}</div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>
                    ${coefRows ? `<details style="margin-top:8px">
                        <summary style="cursor:pointer;font-size:0.85rem;color:#718096">📋 Ver coeficientes polinomiales</summary>
                        <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem">
                            <thead><tr style="background:#000">
                                <th style="padding:4px 8px;border:1px solid #333;text-align:center;color:#fff">Término</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Coeficiente</th>
                            </tr></thead>
                            <tbody>${coefRows}</tbody>
                        </table>
                    </details>` : ''}
                    ${data.residuos?.length ? `<details style="margin-top:8px">
                        <summary style="cursor:pointer;font-size:0.85rem;color:#718096">📉 Ver residuales</summary>
                        <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem">
                            <thead><tr style="background:#000">
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">#</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Predicho</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Residual</th>
                            </tr></thead>
                            <tbody>${resRows}</tbody>
                        </table>
                    </details>` : ''}`;
        }
        // Regresión Logística
        if (statKey === 'Regresión Logística') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const confMat = data.vp != null ? `
                <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem">
                    <thead><tr style="background:#000">
                        <th style="padding:4px 8px;border:1px solid #333;text-align:center;color:#fff"></th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:center;color:#fff">Real +</th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:center;color:#fff">Real −</th>
                    </tr></thead>
                    <tbody>
                        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600">Pred +</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:center;background:#1a3a1a;color:#6f6">${data.vp}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:center;background:#3a1a1a;color:#f66">${data.fp}</td></tr>
                        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600">Pred −</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:center;background:#3a1a1a;color:#f66">${data.fn}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:center;background:#1a3a1a;color:#6f6">${data.vn}</td></tr>
                    </tbody>
                </table>` : '';
            const classRows = (data.clasificacion || []).map((c, i) => `
                <tr>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${i + 1}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${c.real}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${c.probabilidad?.toFixed(4) ?? '—'}</td>
                    <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right;${c.clasificado === c.real ? 'color:#6f6' : 'color:#f66;font-weight:600'}">${c.clasificado}</td>
                </tr>`).join('');
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">🔐 Clasificación: Y = f(${data.columnasX?.join(', ') || 'X₁,...,Xₖ'})</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Exactitud</span><span class="ar-kpi-sub-v">${((data.exactitud || 0) * 100).toFixed(1)}%</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Precisión</span><span class="ar-kpi-sub-v">${((data.precision || 0) * 100).toFixed(1)}%</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Recall</span><span class="ar-kpi-sub-v">${((data.recall || 0) * 100).toFixed(1)}%</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">F1-Score</span><span class="ar-kpi-sub-v">${((data.f1 || 0) * 100).toFixed(1)}%</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">VP/FP/VN/FN</span><span class="ar-kpi-sub-v">${data.vp}/${data.fp}/${data.vn}/${data.fn}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.exactitud >= 0.7 ? 'ar-badge-ok' : 'ar-badge-warn'}">${data.exactitud >= 0.8 ? '✓ Excelente' : data.exactitud >= 0.6 ? '⚠ Aceptable' : '✗ Bajo'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">${data.formula || data.modelo || ''}</div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>
                    ${confMat ? `<details style="margin-top:8px">
                        <summary style="cursor:pointer;font-size:0.85rem;color:#718096">📊 Matriz de confusión</summary>${confMat}</details>` : ''}
                    ${classRows ? `<details style="margin-top:8px">
                        <summary style="cursor:pointer;font-size:0.85rem;color:#718096">📋 Clasificación por observación</summary>
                        <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem">
                            <thead><tr style="background:#000">
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">#</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Real</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Prob.</th>
                                <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Clasif.</th>
                            </tr></thead>
                            <tbody>${classRows}</tbody>
                        </table>
                    </details>` : ''}`;
        }
        // T-Test (dos muestras)
        if (statKey === 'T-Test (dos muestras)') {
            const keys = Object.keys(data).filter(k => k !== 'columnaAgrupacion' && k !== 'columnaValores' && k !== 'grupo1' && k !== 'grupo2');
            const groupKey = keys[0];
            if (!groupKey || !data[groupKey]) return '<p>No hay resultados</p>';
            const result = data[groupKey];
            const g1 = result.grupo1 || {};
            const g2 = result.grupo2 || {};
            const dCohen = (g1.media != null && g2.media != null && g1.varianza != null && g2.varianza != null && g1.n > 0 && g2.n > 0)
                ? ((g1.media - g2.media) / Math.sqrt(((g1.n - 1) * g1.varianza + (g2.n - 1) * g2.varianza) / (g1.n + g2.n - 2)))
                : null;
            const cohenLabel = dCohen != null
                ? (Math.abs(dCohen) >= 0.8 ? '✓ Grande' : Math.abs(dCohen) >= 0.5 ? '⚠ Medio' : '○ Pequeño')
                : '—';
            const se = (g1.varianza != null && g2.varianza != null && g1.n > 0 && g2.n > 0)
                ? Math.sqrt(g1.varianza / g1.n + g2.varianza / g2.n) : null;
            const icLower = (result.diferenciaMedias != null && se != null) ? (result.diferenciaMedias - 1.96 * se).toFixed(4) : '—';
            const icUpper = (result.diferenciaMedias != null && se != null) ? (result.diferenciaMedias + 1.96 * se).toFixed(4) : '—';
            const groupRows = (g1.n != null && g2.n != null) ? `
                <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem">
                    <thead><tr style="background:#000">
                        <th style="padding:4px 8px;border:1px solid #333;text-align:left;color:#fff">Grupo</th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">n</th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Media</th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Varianza</th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">DE</th>
                    </tr></thead>
                    <tbody>
                        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0">Grupo 1</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${g1.n ?? '—'}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${g1.media?.toFixed(4) ?? '—'}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${g1.varianza?.toFixed(4) ?? '—'}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${Math.sqrt(g1.varianza || 0).toFixed(4)}</td></tr>
                        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0">Grupo 2</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${g2.n ?? '—'}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${g2.media?.toFixed(4) ?? '—'}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${g2.varianza?.toFixed(4) ?? '—'}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${Math.sqrt(g2.varianza || 0).toFixed(4)}</td></tr>
                    </tbody>
                </table>` : '';
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${groupKey}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Estadístico t</span><span class="ar-kpi-sub-v">${result.estadisticoT?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grados de libertad</span><span class="ar-kpi-sub-v">${result.gradosLibertad?.toFixed(2) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Diferencia medias</span><span class="ar-kpi-sub-v">${result.diferenciaMedias?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">IC 95% dif.</span><span class="ar-kpi-sub-v">[${icLower}, ${icUpper}]</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">d de Cohen</span><span class="ar-kpi-sub-v">${dCohen?.toFixed(4) ?? '—'} (${cohenLabel})</span></div>
                    </div>
                    <div class="ar-kpi-badge ${result.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${result.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}</div>
                    </div>
                    ${groupRows ? `<details style="margin-top:8px"><summary style="cursor:pointer;font-size:0.85rem;color:#718096">📊 Estadísticos por grupo</summary>${groupRows}</details>` : ''}
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(result.interpretacion || '')}</div></div></div>`;
        }
        // ANOVA One-Way
        if (statKey === 'ANOVA One-Way') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const gruposLabel = Array.isArray(data.grupos) ? data.grupos.join(', ') : (data.grupos != null ? data.grupos : 'Grupos');
            const etaSq = (data.SSB != null && data.SSW != null && (data.SSB + data.SSW) > 0)
                ? (data.SSB / (data.SSB + data.SSW)).toFixed(4) : '—';
            const etaSqLabel = etaSq !== '—' ? (parseFloat(etaSq) >= 0.14 ? '✓ Grande' : parseFloat(etaSq) >= 0.06 ? '⚠ Medio' : '○ Pequeño') : '—';
            const ssRows = (data.SSB != null) ? `
                <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem">
                    <thead><tr style="background:#000">
                        <th style="padding:4px 8px;border:1px solid #333;text-align:left;color:#fff">Fuente</th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">SS</th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">gl</th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">MS</th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">F</th>
                        <th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">p</th>
                    </tr></thead>
                    <tbody>
                        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0">Entre grupos</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.SSB.toFixed(4)}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.dfEntre}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.MSB?.toFixed(4) ?? '—'}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right;font-weight:600">${data.estadisticoF?.toFixed(4) ?? '—'}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right;${data.significativo ? 'color:#c53030;font-weight:600' : ''}">${data.valorP?.toFixed(4) ?? '—'}</td></tr>
                        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0">Dentro grupos</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.SSW.toFixed(4)}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.dfDentro}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.MSW?.toFixed(4) ?? '—'}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right"></td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right"></td></tr>
                        <tr style="background:var(--item-bg)"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600">Total</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right;font-weight:600">${(data.SSB + data.SSW).toFixed(4)}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">${data.dfEntre + data.dfDentro}</td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right"></td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right"></td>
                            <td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right"></td></tr>
                    </tbody>
                </table>` : '';
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${gruposLabel}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Estadístico F</span><span class="ar-kpi-sub-v">${data.estadisticoF?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">η² (Eta-cuadrado)</span><span class="ar-kpi-sub-v">${etaSq} (${etaSqLabel})</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grupos</span><span class="ar-kpi-sub-v">${data.grupos ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Total obs.</span><span class="ar-kpi-sub-v">${data.totalObservaciones ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">df entre</span><span class="ar-kpi-sub-v">${data.dfEntre ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">df dentro</span><span class="ar-kpi-sub-v">${data.dfDentro ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}</div>
                    </div>
                    ${ssRows ? `<details open style="margin-top:8px"><summary style="cursor:pointer;font-size:0.85rem;color:#718096">📋 Tabla ANOVA</summary>${ssRows}</details>` : ''}
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // Chi-Cuadrado
        if (statKey === 'Chi-Cuadrado') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${data.columna1 || ''} vs ${data.columna2 || ''}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Estadístico χ²</span><span class="ar-kpi-sub-v">${data.estadisticoChi2?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grados de libertad</span><span class="ar-kpi-sub-v">${data.gradosLibertad ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">N</span><span class="ar-kpi-sub-v">${data.N ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significativo ? '✗ Asociación significativa (p < 0.05)' : '✓ Independientes (p ≥ 0.05)'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // ANOVA Two-Way
        if (statKey === 'ANOVA Two-Way') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const f1Val = typeof data.factor1 === 'object' ? data.factor1.F : '—';
            const p1Val = typeof data.factor1 === 'object' ? data.factor1.p : '—';
            const f2Val = typeof data.factor2 === 'object' ? data.factor2.F : '—';
            const p2Val = typeof data.factor2 === 'object' ? data.factor2.p : '—';
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${data.factor1 || 'Factor 1'} + ${data.factor2 || 'Factor 2'}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">F Factor 1</span><span class="ar-kpi-sub-v">${typeof f1Val === 'number' ? f1Val.toFixed(4) : f1Val}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p Factor 1</span><span class="ar-kpi-sub-v">${typeof p1Val === 'number' ? p1Val.toFixed(4) : p1Val}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">F Factor 2</span><span class="ar-kpi-sub-v">${typeof f2Val === 'number' ? f2Val.toFixed(4) : f2Val}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p Factor 2</span><span class="ar-kpi-sub-v">${typeof p2Val === 'number' ? p2Val.toFixed(4) : p2Val}</span></div>
                    </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // Test de Normalidad (Jarque-Bera)
        if (statKey === 'Test de Normalidad') {
            return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${escapeHtml(col)}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">JB</span><span class="ar-kpi-sub-v">${result.estadisticoJB?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Asimetría</span><span class="ar-kpi-sub-v">${result.asimetria?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Curtosis</span><span class="ar-kpi-sub-v">${result.curtosis?.toFixed(4) ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${result.esNormal ? 'ar-badge-ok' : 'ar-badge-danger'}">${result.esNormal ? '✓ Distribución normal' : '✗ No normal'}</div>
                    </div>`).join('');
        }
        // T-Test una muestra
        if (statKey === 'T-Test (una muestra)') {
            return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${escapeHtml(col)}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">t</span><span class="ar-kpi-sub-v">${result.estadisticoT?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Media</span><span class="ar-kpi-sub-v">${result.media?.toFixed(4) ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${result.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${result.significativo ? '✗ Significativo' : '✓ No significativo'}</div>
                    </div>`).join('');
        }
        // LOD / LOQ / LQC / MDL individuales
        if (statKey === 'LOD (Límite de Detección)' || statKey === 'LOQ (Límite de Cuantificación)' ||
            statKey === 'LQC (Límite de Control de Calidad)' || statKey === 'MDL (Mínimo Detectable)') {
            const labels = {
                'LOD (Límite de Detección)': 'LOD',
                'LOQ (Límite de Cuantificación)': 'LOQ',
                'LQC (Límite de Control de Calidad)': 'LQC',
                'MDL (Mínimo Detectable)': 'MDL'
            };
            const label = labels[statKey];
            return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => {
                if (result.error) return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${escapeHtml(col)}</div><p class="ar-error">${escapeHtml(result.error)}</p></div>`;
                return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📐 ${escapeHtml(col)}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">${label}</span><span class="ar-kpi-sub-v">${result.valor?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">σ</span><span class="ar-kpi-sub-v">${result.sigma?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Media blancos</span><span class="ar-kpi-sub-v">${result.mediaBlancos?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${result.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-formula" style="margin-top:8px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(result.interpretacion || '')}</div></div></div>
                        </div>`;
            }).join('');
        }
        // LOD / LOQ / LQC / MDL por Curva de Calibración
        if (statKey === 'LOD (Curva de Calibración)' || statKey === 'LOQ (Curva de Calibración)' ||
            statKey === 'LQC (Curva de Calibración)' || statKey === 'MDL (Curva de Calibración)') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const calibLabels = {
                'LOD (Curva de Calibración)': 'LOD',
                'LOQ (Curva de Calibración)': 'LOQ',
                'LQC (Curva de Calibración)': 'LQC',
                'MDL (Curva de Calibración)': 'MDL'
            };
            const calibLabel = calibLabels[statKey];
            const r2Class = data.r2 >= 0.999 ? 'ar-badge-ok' : data.r2 >= 0.99 ? 'ar-badge-warn' : 'ar-badge-danger';
            const r2Text = data.r2 >= 0.999 ? '✓ Excelente (R² ≥ 0.999)' : data.r2 >= 0.99 ? '⚠ Aceptable (R² ≥ 0.99)' : '✗ Bajo (R² < 0.99)';
            const rr = data.resumenResiduos;
            const resRows = (data.residuos || []).map(function(r, i) {
                return '<tr><td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">' + (i + 1) + '</td>' +
                    '<td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">' + (data.predicciones?.[i]?.toFixed(6) ?? '—') + '</td>' +
                    '<td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">' + r.toFixed(6) + '</td></tr>';
            }).join('');
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📈 Curva: ${escapeHtml(data.columnaX || 'X')} → ${escapeHtml(data.columnaY || 'Y')}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">${calibLabel}</span><span class="ar-kpi-sub-v">${data.valor?.toFixed(6) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Pendiente (m)</span><span class="ar-kpi-sub-v">${data.pendiente?.toFixed(6) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Intercepto (b)</span><span class="ar-kpi-sub-v">${data.intercepto?.toFixed(6) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">S_res (σ residual)</span><span class="ar-kpi-sub-v">${data.sigmaResidual?.toFixed(6) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${data.r2?.toFixed(6) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n (pares)</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${r2Class}">${r2Text}</div>
                    <div class="ar-formula" style="margin-top:8px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>
                    ${rr ? '<details style="margin-top:8px"><summary style="cursor:pointer;font-size:0.85rem;color:#718096">📉 Resumen de residuos</summary><table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem"><thead><tr style="background:#000"><th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Mín</th><th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Q1</th><th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Mediana</th><th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Q3</th><th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Máx</th><th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">SSE</th></tr></thead><tbody><tr><td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">' + rr.min + '</td><td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">' + rr.q1 + '</td><td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">' + rr.mediana + '</td><td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">' + rr.q3 + '</td><td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right">' + rr.max + '</td><td style="padding:4px 8px;border:1px solid #e2e8f0;text-align:right;font-weight:bold">' + rr.sse + '</td></tr></tbody></table><div style="font-size:0.75rem;color:#718096;margin-top:4px;text-align:right">Residuo total (SSE) = ' + rr.sse + '</div></details>' : ''}
                    ${data.residuos?.length ? '<details style="margin-top:8px"><summary style="cursor:pointer;font-size:0.85rem;color:#718096">📋 Ver residuales por observación</summary><table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:0.8rem"><thead><tr style="background:#000"><th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">#</th><th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Predicho</th><th style="padding:4px 8px;border:1px solid #333;text-align:right;color:#fff">Residual</th></tr></thead><tbody>' + resRows + '</tbody></table></details>' : ''}
                    </div>`;
        }
        // Límites de Cuantificación
        if (statKey === 'Límites de Cuantificación') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const cpkClass = data.cpk === 'N/A' ? 'ar-badge-info' : (data.cpk >= 1.33 ? 'ar-badge-ok' : (data.cpk >= 1.0 ? 'ar-badge-warn' : 'ar-badge-danger'));
            const cpkText = data.cpk === 'N/A' ? 'N/A' : (data.cpk >= 1.33 ? '✓ Capable (Cpk ≥ 1.33)' : (data.cpk >= 1.0 ? '⚠️ Marginal (1.0 ≤ Cpk < 1.33)' : '✗ Not Capable (Cpk < 1.0)'));
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📐 ${data.columna} — ${data.norma}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">LSL</span><span class="ar-kpi-sub-v">${data.lsl}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">USL</span><span class="ar-kpi-sub-v">${data.usl}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">N total</span><span class="ar-kpi-sub-v">${data.n}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Media</span><span class="ar-kpi-sub-v">${data.media}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">DE</span><span class="ar-kpi-sub-v">${data.std}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Mínimo</span><span class="ar-kpi-sub-v">${data.min}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Máximo</span><span class="ar-kpi-sub-v">${data.max}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Dentro límites</span><span class="ar-kpi-sub-v">${data.dentro} (${data.porcentajeDentro}%)</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">OOS</span><span class="ar-kpi-sub-v">${data.fuera} (${data.porcentajeFuera}%)</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Cp</span><span class="ar-kpi-sub-v">${data.cp}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Cpk</span><span class="ar-kpi-sub-v">${data.cpk}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${cpkClass}">${cpkText}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">Cp = (USL - LSL) / (6 × σ) &nbsp;&nbsp;|&nbsp;&nbsp; Cpk = min((USL - μ) / (3 × σ), (μ - LSL) / (3 × σ))</div><div class="ar-formula-desc" style="margin-top:8px;">Fuera superior: ${data.fueraSuperior} | Fuera inferior: ${data.fueraInferior}</div></div></div>`;
        }
        // Correlación Pearson
        if (statKey === 'Correlación Pearson') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📊 ${data.columnaX || 'X'} vs ${data.columnaY || 'Y'}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Coeficiente r</span><span class="ar-kpi-sub-v">${data.r ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${data.r2 ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">t</span><span class="ar-kpi-sub-v">${data.t?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">gl</span><span class="ar-kpi-sub-v">${data.df ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.pValue?.toFixed(6) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">IC 95%</span><span class="ar-kpi-sub-v">[${data.ic95Lower ?? '—'}, ${data.ic95Upper ?? '—'}]</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significante ? '★ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">${data.formula || 'r = cov(X,Y) / (σx × σy)'}</div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // Correlación Spearman
        if (statKey === 'Correlación Spearman') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📊 ${data.columnaX || 'X'} vs ${data.columnaY || 'Y'}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Coeficiente ρ</span><span class="ar-kpi-sub-v">${data.rho ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">ρ²</span><span class="ar-kpi-sub-v">${data.rho2 ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.pValue?.toFixed(6) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significante ? '★ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">${data.formula || 'ρ = correlación de Pearson sobre rangos'}</div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // Test de Shapiro-Wilk
        if (statKey === 'Test de Shapiro-Wilk') {
            return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${escapeHtml(col)}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">W</span><span class="ar-kpi-sub-v">${result.estadisticoW?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${result.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${result.esNormal ? 'ar-badge-ok' : 'ar-badge-danger'}">${result.esNormal ? '✓ Distribución normal' : '✗ No normal'}</div>
                    </div>`).join('');
        }
        // Test de Kolmogorov-Smirnov
        if (statKey === 'Test de Kolmogorov-Smirnov') {
            return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${escapeHtml(col)}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">D</span><span class="ar-kpi-sub-v">${result.estadisticoD?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${result.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${result.esNormal ? 'ar-badge-ok' : 'ar-badge-danger'}">${result.esNormal ? '✓ Distribución normal' : '✗ No normal'}</div>
                    </div>`).join('');
        }
        // Test de Anderson-Darling
        if (statKey === 'Test de Anderson-Darling') {
            return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${escapeHtml(col)}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">A²</span><span class="ar-kpi-sub-v">${result.estadisticoA2?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">A² corr.</span><span class="ar-kpi-sub-v">${result.estadisticoA2_corregido?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${result.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${result.esNormal ? 'ar-badge-ok' : 'ar-badge-danger'}">${result.esNormal ? '✓ Distribución normal' : '✗ No normal'}</div>
                    </div>`).join('');
        }
        // Test de D'Agostino-Pearson
        if (statKey === "Test de D'Agostino-Pearson") {
            return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">${escapeHtml(col)}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">K²</span><span class="ar-kpi-sub-v">${result.estadisticoK2?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Z skew</span><span class="ar-kpi-sub-v">${result.Z_asimetria?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Z kurt</span><span class="ar-kpi-sub-v">${result.Z_curtosis?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${result.esNormal ? 'ar-badge-ok' : 'ar-badge-danger'}">${result.esNormal ? '✓ Distribución normal' : '✗ No normal'}</div>
                    </div>`).join('');
        }
        // Covarianza
        if (statKey === 'Covarianza') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const covVal = data.covarianza;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📐 ${data.columnaX || 'X'} vs ${data.columnaY || 'Y'}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Covarianza</span><span class="ar-kpi-sub-v">${typeof covVal === 'number' ? covVal.toFixed(4) : '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">Cov(X,Y) = Σ(xi−x̄)(yi−ȳ) / (n−1)</div><div class="ar-formula-desc">${covVal > 0 ? 'Covarianza positiva: X e Y tienden a moverse juntas' : covVal < 0 ? 'Covarianza negativa: X e Y tienden a moverse en direcciones opuestas' : 'Covarianza cero: sin relación lineal'}</div></div></div>`;
        }
        // Correlación Kendall Tau
        if (statKey === 'Correlación Kendall Tau') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📊 ${data.columnaX || 'X'} vs ${data.columnaY || 'Y'}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Tau (τ)</span><span class="ar-kpi-sub-v">${data.tau ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Concordantes</span><span class="ar-kpi-sub-v">${data.concordantes ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Discordantes</span><span class="ar-kpi-sub-v">${data.discordantes ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.pValue?.toFixed(6) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significante ? '★ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">${data.formula || 'τ = (C − D) / √[(n₀−n₁)(n₀−n₂)]'}</div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // RMSE
        if (statKey === 'RMSE') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📏 ${data.columnaObservada || 'Obs'} vs ${data.columnaPredicha || 'Pred'}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">RMSE</span><span class="ar-kpi-sub-v">${data.rmse?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">RMSE = √[Σ(obs−pred)²/n]</div><div class="ar-formula-desc">Menor RMSE = mejor ajuste. RMSE=0 indica ajuste perfecto.</div></div></div>`;
        }
        // MAE
        if (statKey === 'MAE') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📏 ${data.columnaObservada || 'Obs'} vs ${data.columnaPredicha || 'Pred'}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">MAE</span><span class="ar-kpi-sub-v">${data.mae?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">MAE = Σ|obs−pred|/n</div><div class="ar-formula-desc">Menor MAE = mejor ajuste. Más robusto a outliers que RMSE.</div></div></div>`;
        }
        // R²
        if (statKey === 'R² (Coef. Determinación)') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const r2 = data.r2;
            const r2Class = r2 >= 0.9 ? 'ar-badge-ok' : r2 >= 0.7 ? 'ar-badge-warn' : 'ar-badge-danger';
            const r2Text = r2 >= 0.9 ? '✓ Excelente ajuste' : r2 >= 0.7 ? '⚠ Ajuste moderado' : '✗ Ajuste pobre';
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📊 ${data.columnaObservada || 'Obs'} vs ${data.columnaPredicha || 'Pred'}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${r2?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${r2Class}">${r2Text}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">📐</span><div><div class="ar-formula-eq">R² = 1 − SSres/SStot</div><div class="ar-formula-desc">Proporción de la varianza explicada por el modelo.</div></div></div>`;
        }
        // Mann-Whitney U
        if (statKey === 'Mann-Whitney U') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">⚖️ ${data.columnaAgrupacion || ''} → ${data.columnaValores || ''}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">U</span><span class="ar-kpi-sub-v">${data.U ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">z</span><span class="ar-kpi-sub-v">${data.z ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Efecto (r)</span><span class="ar-kpi-sub-v">${data.tamanoEfecto ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grupos</span><span class="ar-kpi-sub-v">${(data.grupos || []).join(' vs ')}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // Kruskal-Wallis
        if (statKey === 'Kruskal-Wallis') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📊 ${data.columnaAgrupacion || ''} → ${data.columnaValores || ''}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">H</span><span class="ar-kpi-sub-v">${data.H ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">df</span><span class="ar-kpi-sub-v">${data.df ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grupos</span><span class="ar-kpi-sub-v">${data.grupos?.length ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Total obs.</span><span class="ar-kpi-sub-v">${data.totalObservaciones ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // Wilcoxon
        if (statKey === 'Wilcoxon') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">⚖️ ${data.columna1 || ''} vs ${data.columna2 || ''} (muestras pareadas)</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">W</span><span class="ar-kpi-sub-v">${data.W ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">W⁺</span><span class="ar-kpi-sub-v">${data.Wpositivo ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">W⁻</span><span class="ar-kpi-sub-v">${data.Wnegativo ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">z</span><span class="ar-kpi-sub-v">${data.z?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // Friedman
        if (statKey === 'Friedman') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const tratamientosInfo = (data.sumasRangos || []).map(t => `T${t.tratamiento}: ${t.suma.toFixed(2)}`).join(', ');
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📊 Friedman: ${data.tratamientos} tratamientos, ${data.bloques} bloques</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">χ²_r</span><span class="ar-kpi-sub-v">${data.ChiSq ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">df</span><span class="ar-kpi-sub-v">${data.df ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Tratamientos</span><span class="ar-kpi-sub-v">${data.tratamientos ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Bloques</span><span class="ar-kpi-sub-v">${data.bloques ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}</div>
                    <div style="margin-top:8px;font-size:0.75rem;color:#aaa;">Rangos: ${tratamientosInfo}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // Test de Signos
        if (statKey === 'Test de Signos') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">✚ ${data.columna1 || ''} vs ${data.columna2 || ''} (muestras pareadas)</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">(+)</span><span class="ar-kpi-sub-v">${data.positivos ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">(−)</span><span class="ar-kpi-sub-v">${data.negativos ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">(0)</span><span class="ar-kpi-sub-v">${data.ceros ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">k</span><span class="ar-kpi-sub-v">${data.k ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">z</span><span class="ar-kpi-sub-v">${data.z?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}</div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // Bootstrap
        if (statKey === 'Bootstrap') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">🔄 ${data.columna || ''}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Estimador</span><span class="ar-kpi-sub-v">${data.estimador ?? 'media'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Estimación</span><span class="ar-kpi-sub-v">${data.estimacion?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">SE Bootstrap</span><span class="ar-kpi-sub-v">${data.se_bootstrap?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Sesgo</span><span class="ar-kpi-sub-v">${data.sesgo?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">B (remuestreos)</span><span class="ar-kpi-sub-v">${data.B ?? '—'}</span></div>
                    </div>
                    </div>
                    <div class="ar-kpi-card ar-kpi-multi" style="margin-top:8px;"><div class="ar-kpi-col-label">📊 Intervalo de Confianza ${((data.ic?.nivel ?? 0.95) * 100)}%</div>
                    <div class="ar-kpi-sub-grid"><div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Inferior</span><span class="ar-kpi-sub-v">${data.ic?.inferior?.toFixed(4) ?? '—'}</span></div><div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Superior</span><span class="ar-kpi-sub-v">${data.ic?.superior?.toFixed(4) ?? '—'}</span></div></div>
                    </div>
                    <div class="ar-kpi-card ar-kpi-multi" style="margin-top:8px;"><div class="ar-kpi-col-label">📦 Distribución Bootstrap</div>
                    <div class="ar-kpi-sub-grid"><div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Mín</span><span class="ar-kpi-sub-v">${data.distribucion?.min?.toFixed(4) ?? '—'}</span></div><div class="ar-kpi-sub"><span class="ar-kpi-sub-k">P25</span><span class="ar-kpi-sub-v">${data.distribucion?.p25?.toFixed(4) ?? '—'}</span></div><div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Mediana</span><span class="ar-kpi-sub-v">${data.distribucion?.mediana?.toFixed(4) ?? '—'}</span></div><div class="ar-kpi-sub"><span class="ar-kpi-sub-k">P75</span><span class="ar-kpi-sub-v">${data.distribucion?.p75?.toFixed(4) ?? '—'}</span></div><div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Máx</span><span class="ar-kpi-sub-v">${data.distribucion?.max?.toFixed(4) ?? '—'}</span></div></div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div>`;
        }
        // TOST (Equivalencia)
        if (statKey === 'Test TOST (Equivalencia)') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">🔄 ${data.columnaX || 'X'} vs ${data.columnaY || 'Y'} (Δ=${data.delta})</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">t inferior</span><span class="ar-kpi-sub-v">${data.tInferior?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">t superior</span><span class="ar-kpi-sub-v">${data.tSuperior?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p TOST</span><span class="ar-kpi-sub-v">${data.pTOST?.toFixed(4) ?? '—'}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">IC 90%</span><span class="ar-kpi-sub-v">[${data.ic90?.inferior?.toFixed(4) ?? '—'}, ${data.ic90?.superior?.toFixed(4) ?? '—'}]</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Diferencia</span><span class="ar-kpi-sub-v">${data.diferencia?.toFixed(4) ?? '—'}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.esEquivalente ? 'ar-badge-ok' : 'ar-badge-danger'}">${data.esEquivalente ? '✓ Equivalente' : '✗ No equivalente'}</div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div></div>`;
        }
        // Cluster K-Medias
        if (statKey === 'Análisis de Cluster') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">🧩 K-Medias (k=${data.k})</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Clusters</span><span class="ar-kpi-sub-v">${data.k}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Inercia</span><span class="ar-kpi-sub-v">${data.inertia}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Silhouette</span><span class="ar-kpi-sub-v">${data.silhouette}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Tamaños</span><span class="ar-kpi-sub-v">${data.clusterSizes?.join(', ') || '—'}</span></div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div></div>`;
        }
        // Análisis Discriminante (LDA)
        if (statKey === 'Análisis Discriminante') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">🎯 Análisis Discriminante</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Funciones</span><span class="ar-kpi-sub-v">${data.funcionesDiscriminantes}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Λ de Wilks</span><span class="ar-kpi-sub-v">${data.lambda}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">χ²</span><span class="ar-kpi-sub-v">${data.chi2}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p</span><span class="ar-kpi-sub-v">${data.p}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Accuracy</span><span class="ar-kpi-sub-v">${((data.accuracy||0)*100).toFixed(1)}%</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.p < 0.05 ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.p < 0.05 ? '✗ Significativo' : '✓ No significativo'}</div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div></div>`;
        }
        // MANOVA
        if (statKey === 'M-ANOVA') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📊 MANOVA</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Λ de Wilks</span><span class="ar-kpi-sub-v">${data.lambda}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">F aproximado</span><span class="ar-kpi-sub-v">${data.F}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">gl</span><span class="ar-kpi-sub-v">${data.gl1}, ${data.gl2}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p</span><span class="ar-kpi-sub-v">${data.p}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">η²p</span><span class="ar-kpi-sub-v">${data.etaCuadradoP}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Pillai</span><span class="ar-kpi-sub-v">${data.pillai}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.significativo ? '✗ Significativo' : '✓ No significativo'}</div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div></div>`;
        }
        // Series Temporales
        if (statKey === 'Series Temporales') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">📈 ${data.columna || ''} (periodo=${data.period})</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Periodo</span><span class="ar-kpi-sub-v">${data.period}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Ljung-Box Q</span><span class="ar-kpi-sub-v">${data.lbQ}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p (LB)</span><span class="ar-kpi-sub-v">${data.lbP}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Pronóstico</span><span class="ar-kpi-sub-v">${data.pronostico?.slice(0,3).map(p => `${p.paso}:${p.valor}`).join(', ') || '—'}</span></div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div></div>`;
        }
        // Análisis de Supervivencia
        if (statKey === 'Análisis de Supervivencia') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            const curvasInfo = data.curvas?.map(c => `${c.grupo}: n=${c.n}, mediana=${c.mediana || '—'}`).join(' | ');
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">⏱️ Supervivencia</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Curvas</span><span class="ar-kpi-sub-v">${curvasInfo || '—'}</span></div>
                        ${data.logRank ? `<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Log-rank χ²</span><span class="ar-kpi-sub-v">${data.logRank.chi2}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p (log-rank)</span><span class="ar-kpi-sub-v">${data.logRank.p}</span></div>` : ''}
                    </div>
                    ${data.logRank ? `<div class="ar-kpi-badge ${data.logRank.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">${data.logRank.significativo ? '✗ Diferencias significativas' : '✓ Sin diferencias'}</div>` : ''}
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div></div>`;
        }
        // Modelos Mixtos
        if (statKey === 'Modelos Mixtos') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">🔀 Modelos Mixtos</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">ICC</span><span class="ar-kpi-sub-v">${data.icc}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">AIC</span><span class="ar-kpi-sub-v">${data.aic}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">BIC</span><span class="ar-kpi-sub-v">${data.bic}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">LogLik</span><span class="ar-kpi-sub-v">${data.logLik}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n grupos</span><span class="ar-kpi-sub-v">${data.nGrupos}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n total</span><span class="ar-kpi-sub-v">${data.n}</span></div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div></div>`;
        }
        // Análisis Bayesiano
        if (statKey === 'Análisis Bayesiano') {
            if (data.error) return `<p class="ar-error">${escapeHtml(data.error)}</p>`;
            return `<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">🎲 ${data.columna || ''}</div>
                    <div class="ar-kpi-sub-grid">
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Media posterior</span><span class="ar-kpi-sub-v">${data.media_posterior}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">IC 95% credible</span><span class="ar-kpi-sub-v">[${data.ic95_credible?.inferior}, ${data.ic95_credible?.superior}]</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">BF₁₀</span><span class="ar-kpi-sub-v">${data.factorBayes}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Media muestral</span><span class="ar-kpi-sub-v">${data.mediaMuestral}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n}</span></div>
                        <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R̂ (MCMC)</span><span class="ar-kpi-sub-v">${data.mcmc?.rHat}</span></div>
                    </div>
                    <div class="ar-kpi-badge ${data.factorBayes > 3 ? 'ar-badge-ok' : 'ar-badge-info'}">${data.factorBayes > 3 ? '★ Evidencia sustancial' : '○ Evidencia débil'}</div>
                    <div class="ar-formula" style="margin-top:12px;"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">${escapeHtml(data.interpretacion || '')}</div></div></div></div>`;
        }
        return '<p>Tipo de prueba no reconocido</p>';
    }

    // ============================================================
    // FIN DE FUNCIONES INTERNAS
    // ============================================================

    // ────────────────────────────────────────────────────────────────────────────
    // 1. KPIs GLOBALES (resumen rápido)
    // ────────────────────────────────────────────────────────────────────────────
    let html = `
    <div class="resultados-globales" style="background:transparent; border-radius:10px; padding:12px; margin-bottom:20px;">
        <div style="display:flex; gap:24px; flex-wrap:wrap; align-items:center;">
            <div><span style="color:#c4c4be;">📊 Columnas numéricas</span><br><strong style="font-size:20px;color:#f0f0ed;">${cols.length}</strong></div>
            <div><span style="color:#c4c4be;">📈 Estadísticos ejecutados</span><br><strong style="font-size:20px;color:#f0f0ed;">${statKeys.length}</strong></div>
            <div><span style="color:#c4c4be;">🔬 Filas analizadas</span><br><strong style="font-size:20px;color:#f0f0ed;">${analisisResultado.totalFilas}</strong></div>
        </div>
    </div>`;

    // ────────────────────────────────────────────────────────────────────────────
    // 2. ACORDEÓN: un bloque por cada estadístico seleccionado
    // ────────────────────────────────────────────────────────────────────────────
    html += `<div class="analisis-acordeon">`;
    
    for (const key of statKeys) {
        const meta = STAT_META[key] || { 
            icono: '📊', 
            formula: '', 
            desc: '', 
            hipotesis: null, 
            supuestos: [], 
            efectoTamano: null,
            referencia: null
        };
        
        let badgeText = '';
        const data = analisisResultado.resultados[key];
        if (typeof data === 'object' && !Array.isArray(data)) {
            const numItems = Object.keys(data).length;
            badgeText = `${numItems} columna${numItems !== 1 ? 's' : ''}`;
        } else {
            badgeText = 'detalle';
        }
        
        html += `
        <div class="acordeon-item">
            <button class="acordeon-header" onclick="toggleAcordeon(this)">
                <span class="icono">${meta.icono}</span>
                <span class="titulo">${escapeHtml(key)}</span>
                <span class="badge">${badgeText}</span>
                <span class="flecha">▼</span>
            </button>
            <div class="acordeon-contenido">
                <!-- Tarjetas KPI del estadístico -->
                <div class="ar-kpis-grid">
                    ${kpiCards(key)}
                </div>
                <!-- Nota metodológica específica de este estadístico -->
                <div class="acordeon-nota-metodologica">
                    ${meta.formula ? `<div class="ar-formula-eq">🧮 ${meta.formula}</div>` : ''}
                    ${meta.desc ? `<div class="ar-formula-desc">${meta.desc}</div>` : ''}
                    ${meta.hipotesis ? `
                        <div class="ar-nota-hipotesis">
                            <strong>📌 Hipótesis:</strong>
                            <div>H₀: ${meta.hipotesis.h0}</div>
                            <div>H₁: ${meta.hipotesis.h1}</div>
                        </div>
                    ` : ''}
                    ${meta.supuestos && meta.supuestos.length ? `
                        <div class="ar-nota-supuestos">
                            <strong>📋 Supuestos:</strong>
                            <ul>${meta.supuestos.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    ${meta.efectoTamano ? `
                        <div class="ar-nota-efecto">
                            <strong>📏 Tamaño de efecto:</strong> ${meta.efectoTamano.metrica} 
                            <span class="ar-formula-eq">${meta.efectoTamano.formula}</span>
                        </div>
                    ` : ''}
                    ${meta.referencia ? `
                        <div class="ar-nota-referencia">
                            <strong>📚 Referencia:</strong> ${formatReferencia(meta.referencia)}
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>`;
    }
    
    html += `</div>`; // cierre .analisis-acordeon
    
    // ────────────────────────────────────────────────────────────────────────────
    // 3. SECCIÓN GENERAL FINAL (notas metodológicas globales, glosario)
    // ────────────────────────────────────────────────────────────────────────────
    html += `
    <div class="ar-notes-section" style="margin-top:24px; padding-top:16px; border-top:0.5px solid rgba(255,255,255,0.1);">
        <div class="ar-notes-title">📚 Notas metodológicas generales</div>
        <div class="ar-notes-grid">
            <div class="ar-note-card">
                <div class="ar-note-header"><span class="ar-note-icon">🔍</span> <span>Interpretación de p‑valor</span></div>
                <div class="ar-note-desc">Un p‑valor < 0.05 indica evidencia estadística significativa en contra de la hipótesis nula (H₀). En los resultados se marca con <span class="ar-badge-danger" style="display:inline-block; padding:0 4px;">✗ Significativo</span>.</div>
            </div>
            <div class="ar-note-card">
                <div class="ar-note-header"><span class="ar-note-icon">⚙️</span> <span>Tests de normalidad</span></div>
                <div class="ar-note-desc">Se aplican Jarque‑Bera (n≥3), Shapiro‑Wilk (3≤n≤5000), Kolmogorov‑Smirnov (n≥5), Anderson‑Darling (n≥8) y D'Agostino‑Pearson (n≥8). El consenso se determina por mayoría.</div>
            </div>
            <div class="ar-note-card">
                <div class="ar-note-header"><span class="ar-note-icon">📐</span> <span>Estadísticos de dispersión</span></div>
                <div class="ar-note-desc">Si configuraste umbrales en <strong>Parámetros → Dispersión</strong>, se mostrarán semáforos 🟢/🟡/🔴 junto a los valores.</div>
            </div>
        </div>
        <div style="margin-top:12px; font-size:10px; color:#888; text-align:center;">
            Reporte generado automáticamente por StatLab · ${new Date().toLocaleString('es-ES')}
        </div>
    </div>`;
    
    return html;
}
    
    // =======================================
    // API PÚBLICA
    // =======================================
    
    return {
        // Funciones individuales - Tendencia Central
        calcularMedia,
        calcularMediana,
        calcularModa,
        
        // Funciones individuales - Dispersión
        calcularVarianza,
        calcularDesviacionEstandar,
        calcularRango,
        calcularCoeficienteVariacion,
        calcularCovarianza,
        calcularRMSE,
        calcularMAE,
        calcularR2,
        
        // Funciones individuales - Percentiles
        calcularPercentil,
        calcularCuartiles,
        calcularIQR,
        
        // Funciones individuales - Forma
        calcularAsimetria,
        calcularCurtosis,
        
        // Funciones individuales - Errores e IC
        calcularErrorEstandar,
        calcularIntervalosConfianza,
        
// Funciones individuales - Outliers
        detectarOutliersIQR,
        detectarOutliersZScore,
        // Funciones de calidad
        calcularPareto,
        calcularLimitesCuantificacion,
        calcularLimitesCalibracion,
        
        
        // Funciones individuales - Pruebas de Hipótesis
        calcularTTestUnaMuestra,
        calcularTTestDosMuestras,
        calcularMannWhitneyU,
        calcularANOVA,
        calcularKruskalWallis,
        calcularANOVA2Factores,
        calcularChiCuadrado,
        calcularTestNormalidad,
        calcularShapiroWilk,
        calcularKolmogorovSmirnov,
        calcularAndersonDarling,
        calcularDAgostinoPearson,
        // Funciones de calidad
        calcularPareto,
        // Funciones individuales - Correlación
        calcularCorrelacionPearson,
        calcularCorrelacionSpearman,
        calcularKendallTau,
        
        // Funciones de análisis
        analizarColumna,
        analizarTodasLasColumnas,
        ejecutarAnalisis,
        
        // Generación de reportes
        generarReporte,
        generarHTML,
        
        // Utilidades
        getNumericColumns,
        
        // ════════════════════════════════════════════════════════════════════════════════
        // FUNCIONES DE CALIDAD
        // ════════════════════════════════════════════════════════════════════════════════
        calcularPareto
    };
})();

// Exportar si se usan módulos
// export default EstadisticaDescriptiva;

// Exponer al ámbito global para uso en indexx.html
if (typeof window !== 'undefined') {
    window.EstadisticaDescriptiva = EstadisticaDescriptiva;
}

console.log('✅ Módulo de Estadística Descriptiva cargado');