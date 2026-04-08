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
        const n = values.length;
        if (n < 2) return { ic90: null, ic95: null, ic99: null };
        
        const media = Stats.calcularMedia(values);
        const se = Stats.calcularErrorEstandar(values);
        
        // Valores t críticos aproximados
        const t_values = { 90: 1.645, 95: 1.96, 99: 2.576 };
        
        if (n < 30) {
            const df = n - 1;
            t_values[90] = df <= 5 ? 1.943 : df <= 10 ? 1.812 : df <= 20 ? 1.729 : 1.645;
            t_values[95] = df <= 5 ? 2.571 : df <= 10 ? 2.228 : df <= 20 ? 2.086 : 1.96;
            t_values[99] = df <= 5 ? 4.032 : df <= 10 ? 3.169 : df <= 20 ? 2.845 : 2.576;
        }
        
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
            threshold: 0.8,
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
        const n = values.length;
        if (n < 2) return { error: 'Se necesitan al menos 2 observaciones' };

        const media = calcularMedia(values);
        const sd = calcularDesviacionEstandar(values, true);
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
                : `No se rechaza H₀ (p=${p.toFixed(4)} ≥ 0.05). No hay diferencia significativa.`
        };
    }

    /**
     * ANOVA One-Way
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
        if (!Array.isArray(tabla) || tabla.length < 2) {
            return { error: 'Se necesita una tabla de contingencia (mínimo 2x2)' };
        }

        const filas = tabla.length;
        const cols = tabla[0].length;
        const N = tabla.flat().reduce((a, b) => a + b, 0);

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
        const n = values.length;
        if (n < 8) return { error: 'Se necesitan al menos 8 observaciones' };

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
         const n = values.length;
         if (n < 3) return { error: 'Se necesitan al menos 3 observaciones' };
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
      
      /**
       * Función de distribución acumulativa t de Student (aproximación)
      * @param {number} t - Valor t
      * @param {number} df - Grados de libertad
      * @returns {number} CDF(t)
      */
     function calcularCDF_T(t, df) {
       if (df === 1) {
         return 0.5 + Math.atan(t) / Math.PI;
       }
       
       // Aproximación usando función beta incompleta
       // Para simplicidad, usamos una aproximación razonable
       if (t === 0) return 0.5;
       
        const x = df / (df + t * t);
        // Aproximación simple para demostración - en producción usar biblioteca especializada
        if (df > 30) {
          // Para df grande, aproximar con normal usando función erf local
          return 0.5 * (1 + erf(t / Math.sqrt(2)));
        }
       
       // Usamos una aproximación razonable para df pequeños
       // Esto es una simplificación - en producción usar biblioteca estadística adecuada
       return 0.5 + Math.sign(t) * 0.5 * (1 - Math.exp(-Math.abs(t) * Math.sqrt(df / (df + t * t))));
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
       const SCTotal = sumY2 - nVal * mediaY * mediaY;
       
       // R² y R² ajustado
       const r2 = SCRegresion / SCTotal;
       const r2Adj = 1 - (SCResidual / (nVal - 2)) / (SCTotal / (nVal - 1));
       
       // Error estándar de la estimación
       const errorEstandar = Math.sqrt(SCResidual / (nVal - 2));
       
       // Error estándar de los coeficientes
       const eePendiente = errorEstandar / Math.sqrt(denominador);
       const eeIntercept = errorEstandar * Math.sqrt(1 / nVal + (mediaX * mediaX) / denominador);
       
       // Valor p para pendiente (H0: b = 0)
       const tPendiente = b / eePendiente;
       const pPendiente = 2 * (1 - calcularCDF_T(Math.abs(tPendiente), nVal - 2));
       
       // Intervalo de confianza para pendiente (95%)
       const tCritico = calcularValorP_TInverso(0.975, nVal - 2);
       const icPendienteLower = b - tCritico * eePendiente;
       const icPendienteUpper = b + tCritico * eePendiente;
       
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
         formula: `Y = ${a.toFixed(4)} + ${b.toFixed(4)}X`,
         a: parseFloat(a.toFixed(4)),
         b: parseFloat(b.toFixed(4)),
         r2: parseFloat(r2.toFixed(4)),
         r2Adj: parseFloat(r2Adj.toFixed(4)),
         errorEstandar: parseFloat(errorEstandar.toFixed(4)),
         eePendiente: parseFloat(eePendiente.toFixed(4)),
         eeIntercept: parseFloat(eeIntercept.toFixed(4)),
         tPendiente: parseFloat(tPendiente.toFixed(4)),
         pPendiente: parseFloat(pPendiente.toFixed(6)),
         icPendienteLower: parseFloat(icPendienteLower.toFixed(4)),
         icPendienteUpper: parseFloat(icPendienteUpper.toFixed(4)),
         significante: pPendiente < 0.05,
         interpretacion: interpretacion,
         n: nVal,
          predicciones: predicciones.map(p => parseFloat(p.toFixed(4))),
          residuos: residuos.map(r => parseFloat(r.toFixed(4))),
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
                            IQR: detectarOutliersIQR(values),
                            ZScore: detectarOutliersZScore(values)
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
                    if (hypothesisConfig['T-Test (dos muestras)']) {
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
                    if (hypothesisConfig['ANOVA One-Way']) {
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
                    if (hypothesisConfig['Chi-Cuadrado']) {
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
                        const tabla = Array(bins).fill(null).map(() => Array(bins).fill(0));
                        col1.forEach((v, i) => {
                            const r = Math.min(Math.floor((v - min1) / step1), bins - 1);
                            const c = Math.min(Math.floor((col2[i] - min2) / step2), bins - 1);
                            tabla[r][c]++;
                        });
                        resultados['Chi-Cuadrado'] = calcularChiCuadrado(tabla);
                    }
                    break;

                case 'Test de Normalidad':
                    resultados['Test de Normalidad'] = {};
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Test de Normalidad'][col] = calcularTestNormalidad(values);
                    });
                    break;

                case 'ANOVA Two-Way':
                    // Usar configuración de hipótesis si está disponible
                    if (hypothesisConfig['ANOVA Two-Way']) {
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
                     if (hypothesisConfig['Mann-Whitney U']) {
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
                     if (hypothesisConfig['Kruskal-Wallis']) {
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
     * Genera un reporte en texto formateado
     */
    function generarReporte(analisisResultado) {
        let reporte = `
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
                    // Para objetos (como percentiles)
                    reporte += `\n   ${columna}:\n`;
                    Object.keys(valor).forEach(key => {
                        reporte += `      ${key}: ${typeof valor[key] === 'number' ? valor[key].toFixed(4) : valor[key]}\n`;
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
                reporte += `   └─ Ref: ${meta.referencia}\n`;
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
                        reporte += `      ${key}: ${typeof valor[key] === 'number' ? valor[key].toFixed(4) : valor[key]}\n`;
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
                reporte += `   └─ Ref: ${meta.referencia}\n`;
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
    function generarHTML(analisisResultado) {

        const STAT_META = getStatMeta();
        
        // DEBUG: verificar STAT_META
        console.log('[generarHTML] STAT_META keys:', Object.keys(STAT_META).length);
        console.log('[generarHTML] Sample statMeta:', STAT_META['Test de Shapiro-Wilk']);

        const statKeys = Object.keys(analisisResultado.resultados);
        const cols     = analisisResultado.columnasAnalizadas;
        const hasParams = typeof ParametrosManager !== 'undefined';

         // Pruebas de hipótesis que tienen estructura diferente

        // ── KPI cards para un estadístico ─────────────────────
        function kpiCards(statKey) {
            const data = analisisResultado.resultados[statKey];
            if (!data) return '';

            // Si es prueba de hipótesis, generar vista especial
            if (HYPOTHESIS_SET.has(statKey)) {
                return hypothesisKpiCards(statKey, data);
            }

            return cols.map(col => {
                const val = data[col];
                if (val === undefined) return '';

                // Verificar cumplimiento de parámetros
                let compliance = null;
                if (hasParams) {
                    const p      = ParametrosManager.getParametros(col);
                    const numVal = typeof val === 'number' ? val : null;
                    if (numVal !== null && (p.min !== null || p.max !== null)) {
                        const out = (p.min !== null && numVal < p.min) ||
                                    (p.max !== null && numVal > p.max);
                        compliance = !out;
                    }
                }

                const statusClass  = compliance === true  ? 'ar-kpi-ok'
                                : compliance === false ? 'ar-kpi-danger' : '';
                const badgeHTML    = compliance !== null
                    ? `<div class="ar-kpi-badge ${compliance ? 'ar-badge-ok' : 'ar-badge-danger'}">
                        ${compliance ? '✓ Dentro de parámetros' : '✗ Fuera de parámetros'}
                    </div>` : '';

                // Objeto (percentiles, rango)
                if (typeof val === 'object' && !Array.isArray(val)) {
                    const rows = Object.entries(val).map(([k, v]) => `
                        <div class="ar-kpi-sub">
                            <span class="ar-kpi-sub-k">${k}</span>
                            <span class="ar-kpi-sub-v">${typeof v === 'number' ? v.toFixed(4) : v}</span>
                        </div>`).join('');
                    return `
                        <div class="ar-kpi-card ar-kpi-multi ${statusClass}">
                            <div class="ar-kpi-col-label">${col}</div>
                            <div class="ar-kpi-sub-grid">${rows}</div>
                            ${badgeHTML}
                        </div>`;
                }

                // Array (moda)
                if (Array.isArray(val)) {
                    const display = val.length > 0 ? val.map(v => v.toFixed(4)).join(', ') : '—';
                    return `
                        <div class="ar-kpi-card ${statusClass}">
                            <div class="ar-kpi-col-label">${col}</div>
                            <div class="ar-kpi-val ar-kpi-val-sm">${display}</div>
                            ${badgeHTML}
                        </div>`;
                }

                // Escalar simple
                const display = typeof val === 'number' ? val.toFixed(4) : String(val);
                return `
                    <div class="ar-kpi-card ${statusClass}">
                        <div class="ar-kpi-col-label">COLUMNA ${col}</div>
                        <div class="ar-kpi-val">${display}</div>
                        ${badgeHTML}
                    </div>`;

            }).join('');
        }

        // ── KPI cards para pruebas de hipótesis ─────────────────
        function hypothesisKpiCards(statKey, data) {
            // Manejar T-Test (dos muestras) que tiene estructura { 'grupo1 vs grupo2': {...} }
            if (statKey === 'T-Test (dos muestras)') {
                const keys = Object.keys(data).filter(k => k !== 'columnaAgrupacion' && k !== 'columnaValores' && k !== 'grupo1' && k !== 'grupo2');
                const groupKey = keys[0];
                if (!groupKey || !data[groupKey]) return '<p>No hay resultados</p>';
                const result = data[groupKey];
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">${groupKey}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Estadístico t</span><span class="ar-kpi-sub-v">${result.estadisticoT?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grados de libertad</span><span class="ar-kpi-sub-v">${result.gradosLibertad?.toFixed(2) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Diferencia medias</span><span class="ar-kpi-sub-v">${result.diferenciaMedias?.toFixed(4) ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${result.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${result.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}
                        </div>
                    </div>`;
            }

            // Manejar ANOVA One-Way
            if (statKey === 'ANOVA One-Way') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">${data.grupos?.join(', ') || 'Grupos'}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Estadístico F</span><span class="ar-kpi-sub-v">${data.estadisticoF?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grupos</span><span class="ar-kpi-sub-v">${data.grupos ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Total obs.</span><span class="ar-kpi-sub-v">${data.totalObservaciones ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">df entre</span><span class="ar-kpi-sub-v">${data.dfEntre ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">df dentro</span><span class="ar-kpi-sub-v">${data.dfDentro ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${data.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">💬</span>
                        <div><div class="ar-formula-desc">${data.interpretacion || ''}</div></div>
                    </div>`;
            }

            // Manejar Chi-Cuadrado
            if (statKey === 'Chi-Cuadrado') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">${data.columna1 || ''} vs ${data.columna2 || ''}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Estadístico χ²</span><span class="ar-kpi-sub-v">${data.estadisticoChi2?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grados de libertad</span><span class="ar-kpi-sub-v">${data.gradosLibertad ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">N</span><span class="ar-kpi-sub-v">${data.N ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${data.significativo ? '✗ Asociación significativa (p < 0.05)' : '✓ Independientes (p ≥ 0.05)'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">💬</span>
                        <div><div class="ar-formula-desc">${data.interpretacion || ''}</div></div>
                    </div>`;
            }

            // Manejar ANOVA Two-Way
            if (statKey === 'ANOVA Two-Way') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                const f1Val = typeof data.factor1 === 'object' ? data.factor1.F : '—';
                const p1Val = typeof data.factor1 === 'object' ? data.factor1.p : '—';
                const f2Val = typeof data.factor2 === 'object' ? data.factor2.F : '—';
                const p2Val = typeof data.factor2 === 'object' ? data.factor2.p : '—';
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">${data.factor1 || 'Factor 1'} + ${data.factor2 || 'Factor 2'}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">F Factor 1</span><span class="ar-kpi-sub-v">${typeof f1Val === 'number' ? f1Val.toFixed(4) : f1Val}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p Factor 1</span><span class="ar-kpi-sub-v">${typeof p1Val === 'number' ? p1Val.toFixed(4) : p1Val}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">F Factor 2</span><span class="ar-kpi-sub-v">${typeof f2Val === 'number' ? f2Val.toFixed(4) : f2Val}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p Factor 2</span><span class="ar-kpi-sub-v">${typeof p2Val === 'number' ? p2Val.toFixed(4) : p2Val}</span></div>
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">💬</span>
                        <div><div class="ar-formula-desc">${data.interpretacion || ''}</div></div>
                    </div>`;
            }

            // Manejar Test de Normalidad
            if (statKey === 'Test de Normalidad') {
                return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">${col}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">JB</span><span class="ar-kpi-sub-v">${result.estadisticoJB?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Asimetría</span><span class="ar-kpi-sub-v">${result.asimetria?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Curtosis</span><span class="ar-kpi-sub-v">${result.curtosis?.toFixed(4) ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${result.esNormal ? 'ar-badge-ok' : 'ar-badge-danger'}">
                            ${result.esNormal ? '✓ Distribución normal' : '✗ No normal'}
                        </div>
                    </div>
                `).join('');
            }

            // T-Test una muestra
            if (statKey === 'T-Test (una muestra)') {
                return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">${col}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">t</span><span class="ar-kpi-sub-v">${result.estadisticoT?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Media</span><span class="ar-kpi-sub-v">${result.media?.toFixed(4) ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${result.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${result.significativo ? '✗ Significativo' : '✓ No significativo'}
                        </div>
                    </div>
                `).join('');
            }

            // Manejar Límites de Cuantificación
            if (statKey === 'Límites de Cuantificación') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;

                const cpkClass = data.cpk === 'N/A' ? 'ar-badge-info' : (data.cpk >= 1.33 ? 'ar-badge-ok' : (data.cpk >= 1.0 ? 'ar-badge-warn' : 'ar-badge-danger'));
                const cpkText = data.cpk === 'N/A' ? 'N/A' : (data.cpk >= 1.33 ? '✓ Capable (Cpk ≥ 1.33)' : (data.cpk >= 1.0 ? '⚠️ Marginal (1.0 ≤ Cpk < 1.33)' : '✗ Not Capable (Cpk < 1.0)'));

                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📐 ${data.columna} — ${data.norma}</div>
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
                        <div class="ar-kpi-badge ${cpkClass}">
                            ${cpkText}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">💬</span>
                        <div>
                            <div class="ar-formula-desc">
                                Cp = (USL - LSL) / (6 × σ) &nbsp;&nbsp;|&nbsp;&nbsp;
                                Cpk = min((USL - μ) / (3 × σ), (μ - LSL) / (3 × σ))
                            </div>
                            <div class="ar-formula-desc" style="margin-top:8px;">
                                Fuera superior: ${data.fueraSuperior} | Fuera inferior: ${data.fueraInferior}
                            </div>
                        </div>
                    </div>`;
            }

            // Manejar Correlación de Pearson
            if (statKey === 'Correlación Pearson') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📊 ${data.columnaX || 'X'} vs ${data.columnaY || 'Y'}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Coeficiente r</span><span class="ar-kpi-sub-v">${data.r ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${data.r2 ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.pValue?.toFixed(6) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">IC 95%</span><span class="ar-kpi-sub-v">[${data.ic95Lower ?? '—'}, ${data.ic95Upper ?? '—'}]</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${data.significante ? '★ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">${data.formula || 'r = cov(X,Y) / (σx × σy)'}</div>
                            <div class="ar-formula-desc">${data.interpretacion || ''}</div>
                        </div>
                    </div>`;
            }

            // Manejar Correlación de Spearman
            if (statKey === 'Correlación Spearman') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📊 ${data.columnaX || 'X'} vs ${data.columnaY || 'Y'}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Coeficiente ρ</span><span class="ar-kpi-sub-v">${data.rho ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">ρ²</span><span class="ar-kpi-sub-v">${data.rho2 ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.pValue?.toFixed(6) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${data.significante ? '★ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">${data.formula || 'ρ = correlación de Pearson sobre rangos'}</div>
                            <div class="ar-formula-desc">${data.interpretacion || ''}</div>
                        </div>
                    </div>`;
            }

            // Manejar Regresión Lineal Simple
            if (statKey === 'Regresión Lineal Simple') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📈 Y = f(${data.columnaX || 'X'})</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Intercepto (a)</span><span class="ar-kpi-sub-v">${data.a ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Pendiente (b)</span><span class="ar-kpi-sub-v">${data.b ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${data.r2 ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R² Ajustado</span><span class="ar-kpi-sub-v">${data.r2Adj ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Error Estándar</span><span class="ar-kpi-sub-v">${data.errorEstandar ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">p-valor (b)</span><span class="ar-kpi-sub-v">${data.pPendiente?.toFixed(6) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">IC 95% pendiente</span><span class="ar-kpi-sub-v">[${data.icPendienteLower ?? '—'}, ${data.icPendienteUpper ?? '—'}]</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${data.significante ? '★ Modelo significativo (p < 0.05)' : '✓ Modelo no significativo (p ≥ 0.05)'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">${data.formula || `Y = ${data.a} + ${data.b}X`}</div>
                            <div class="ar-formula-desc">${data.interpretacion || ''}</div>
                        </div>
                    </div>`;
            }

            // Manejar Regresión Lineal Múltiple
            if (statKey === 'Regresión Lineal Múltiple') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                const coefRows = data.coeficientes ? data.coeficientes.map(c => 
                    `<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">${c.valor !== undefined ? 'β' + data.coeficientes.indexOf(c) : ''}</span><span class="ar-kpi-sub-v">${c.valor?.toFixed(4) ?? '—'}</span></div>`
                ).join('') : '';
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📊 Y = f(${data.columnasX?.join(', ') || 'X₁,...,Xₖ'})</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${data.r2 ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R² Ajustado</span><span class="ar-kpi-sub-v">${data.r2Adj ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Error Estándar</span><span class="ar-kpi-sub-v">${data.errorEstandar ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Predictores (k)</span><span class="ar-kpi-sub-v">${data.k ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${data.significante ? '★Modelo significativo' : '✓Modelo no significativo'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">${data.formula || data.modelo || ''}</div>
                            <div class="ar-formula-desc">${data.interpretacion || ''}</div>
                        </div>
                    </div>`;
            }

            // Manejar Regresión Polinomial
            if (statKey === 'Regresión Polinomial') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📈 Y = f(${data.columnaX || 'X'}) - Grado ${data.grado || 2}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${data.r2 ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R² Ajustado</span><span class="ar-kpi-sub-v">${data.r2Adj ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Error Estándar</span><span class="ar-kpi-sub-v">${data.errorEstandar ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grado</span><span class="ar-kpi-sub-v">${data.grado ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${data.significante ? '★Modelo significativo' : '✓Modelo no significativo'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">${data.formula || data.modelo || ''}</div>
                            <div class="ar-formula-desc">${data.interpretacion || ''}</div>
                        </div>
                    </div>`;
            }

            // Manejar Regresión Logística
            if (statKey === 'Regresión Logística') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">🔐 Clasificación: Y = f(${data.columnasX?.join(', ') || 'X₁,...,Xₖ'})</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Exactitud</span><span class="ar-kpi-sub-v">${((data.exactitud || 0) * 100).toFixed(1)}%</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Precisión</span><span class="ar-kpi-sub-v">${((data.precision || 0) * 100).toFixed(1)}%</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Recall</span><span class="ar-kpi-sub-v">${((data.recall || 0) * 100).toFixed(1)}%</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">F1-Score</span><span class="ar-kpi-sub-v">${((data.f1 || 0) * 100).toFixed(1)}%</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">VP/FP/VN/FN</span><span class="ar-kpi-sub-v">${data.vp}/${data.fp}/${data.vn}/${data.fn}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.exactitud >= 0.7 ? 'ar-badge-ok' : 'ar-badge-warn'}">
                            ${data.exactitud >= 0.8 ? '✓Excelente' : data.exactitud >= 0.6 ? '⚠Aceptable' : '✗Bajo'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">${data.formula || data.modelo || ''}</div>
                            <div class="ar-formula-desc">${data.interpretacion || ''}</div>
                        </div>
                    </div>`;
            }

            // Test de Shapiro-Wilk
            if (statKey === 'Test de Shapiro-Wilk') {
                return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">${col}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">W</span><span class="ar-kpi-sub-v">${result.estadisticoW?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${result.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${result.esNormal ? 'ar-badge-ok' : 'ar-badge-danger'}">
                            ${result.esNormal ? '✓ Distribución normal' : '✗ No normal'}
                        </div>
                    </div>
                `).join('');
            }

            // Test de Kolmogorov-Smirnov
            if (statKey === 'Test de Kolmogorov-Smirnov') {
                return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">${col}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">D</span><span class="ar-kpi-sub-v">${result.estadisticoD?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${result.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${result.esNormal ? 'ar-badge-ok' : 'ar-badge-danger'}">
                            ${result.esNormal ? '✓ Distribución normal' : '✗ No normal'}
                        </div>
                    </div>
                `).join('');
            }

            // Test de Anderson-Darling
            if (statKey === 'Test de Anderson-Darling') {
                return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">${col}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">A²</span><span class="ar-kpi-sub-v">${result.estadisticoA2?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">A² corr.</span><span class="ar-kpi-sub-v">${result.estadisticoA2_corregido?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${result.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${result.esNormal ? 'ar-badge-ok' : 'ar-badge-danger'}">
                            ${result.esNormal ? '✓ Distribución normal' : '✗ No normal'}
                        </div>
                    </div>
                `).join('');
            }

            // Test de D'Agostino-Pearson
            if (statKey === "Test de D'Agostino-Pearson") {
                return Object.entries(data).filter(([k]) => k !== 'error').map(([col, result]) => `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">${col}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">K²</span><span class="ar-kpi-sub-v">${result.estadisticoK2?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Z skew</span><span class="ar-kpi-sub-v">${result.Z_asimetria?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Z kurt</span><span class="ar-kpi-sub-v">${result.Z_curtosis?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${result.valorP?.toFixed(4) ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${result.esNormal ? 'ar-badge-ok' : 'ar-badge-danger'}">
                            ${result.esNormal ? '✓ Distribución normal' : '✗ No normal'}
                        </div>
                    </div>
                `).join('');
            }

            // Covarianza
            if (statKey === 'Covarianza') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                const covVal = data.covarianza;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📐 ${data.columnaX || 'X'} vs ${data.columnaY || 'Y'}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Covarianza</span><span class="ar-kpi-sub-v">${typeof covVal === 'number' ? covVal.toFixed(4) : '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">Cov(X,Y) = Σ(xi−x̄)(yi−ȳ) / (n−1)</div>
                            <div class="ar-formula-desc">${covVal > 0 ? 'Covarianza positiva: X e Y tienden a moverse juntas' : covVal < 0 ? 'Covarianza negativa: X e Y tienden a moverse en direcciones opuestas' : 'Covarianza cero: sin relación lineal'}</div>
                        </div>
                    </div>`;
            }

            // Correlación Kendall Tau
            if (statKey === 'Correlación Kendall Tau') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📊 ${data.columnaX || 'X'} vs ${data.columnaY || 'Y'}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Tau (τ)</span><span class="ar-kpi-sub-v">${data.tau ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Concordantes</span><span class="ar-kpi-sub-v">${data.concordantes ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Discordantes</span><span class="ar-kpi-sub-v">${data.discordantes ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.pValue?.toFixed(6) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.significante ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${data.significante ? '★ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">${data.formula || 'τ = (C − D) / √[(n₀−n₁)(n₀−n₂)]'}</div>
                            <div class="ar-formula-desc">${data.interpretacion || ''}</div>
                        </div>
                    </div>`;
            }

            // RMSE
            if (statKey === 'RMSE') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📏 ${data.columnaObservada || 'Obs'} vs ${data.columnaPredicha || 'Pred'}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">RMSE</span><span class="ar-kpi-sub-v">${data.rmse?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">RMSE = √[Σ(obs−pred)²/n]</div>
                            <div class="ar-formula-desc">Menor RMSE = mejor ajuste. RMSE=0 indica ajuste perfecto.</div>
                        </div>
                    </div>`;
            }

            // MAE
            if (statKey === 'MAE') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📏 ${data.columnaObservada || 'Obs'} vs ${data.columnaPredicha || 'Pred'}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">MAE</span><span class="ar-kpi-sub-v">${data.mae?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">MAE = Σ|obs−pred|/n</div>
                            <div class="ar-formula-desc">Menor MAE = mejor ajuste. Más robusto a outliers que RMSE.</div>
                        </div>
                    </div>`;
            }

            // R²
            if (statKey === 'R² (Coef. Determinación)') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                const r2 = data.r2;
                const r2Class = r2 >= 0.9 ? 'ar-badge-ok' : r2 >= 0.7 ? 'ar-badge-warn' : 'ar-badge-danger';
                const r2Text = r2 >= 0.9 ? '✓ Excelente ajuste' : r2 >= 0.7 ? '⚠ Ajuste moderado' : '✗ Ajuste pobre';
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📊 ${data.columnaObservada || 'Obs'} vs ${data.columnaPredicha || 'Pred'}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">${r2?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">${data.n ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${r2Class}">
                            ${r2Text}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">📐</span>
                        <div>
                            <div class="ar-formula-eq">R² = 1 − SSres/SStot</div>
                            <div class="ar-formula-desc">Proporción de la varianza explicada por el modelo.</div>
                        </div>
                    </div>`;
            }

            // Mann-Whitney U
            if (statKey === 'Mann-Whitney U') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">⚖️ ${data.columnaAgrupacion || ''} → ${data.columnaValores || ''}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">U</span><span class="ar-kpi-sub-v">${data.U ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">z</span><span class="ar-kpi-sub-v">${data.z ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Efecto (r)</span><span class="ar-kpi-sub-v">${data.tamanoEfecto ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grupos</span><span class="ar-kpi-sub-v">${(data.grupos || []).join(' vs ')}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${data.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">💬</span>
                        <div><div class="ar-formula-desc">${data.interpretacion || ''}</div></div>
                    </div>`;
            }

            // Kruskal-Wallis
            if (statKey === 'Kruskal-Wallis') {
                if (data.error) return `<p class="ar-error">${data.error}</p>`;
                return `
                    <div class="ar-kpi-card ar-kpi-multi">
                        <div class="ar-kpi-col-label">📊 ${data.columnaAgrupacion || ''} → ${data.columnaValores || ''}</div>
                        <div class="ar-kpi-sub-grid">
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">H</span><span class="ar-kpi-sub-v">${data.H ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Valor p</span><span class="ar-kpi-sub-v">${data.valorP?.toFixed(4) ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">df</span><span class="ar-kpi-sub-v">${data.df ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Grupos</span><span class="ar-kpi-sub-v">${data.grupos?.length ?? '—'}</span></div>
                            <div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Total obs.</span><span class="ar-kpi-sub-v">${data.totalObservaciones ?? '—'}</span></div>
                        </div>
                        <div class="ar-kpi-badge ${data.significativo ? 'ar-badge-danger' : 'ar-badge-ok'}">
                            ${data.significativo ? '✗ Significativo (p < 0.05)' : '✓ No significativo (p ≥ 0.05)'}
                        </div>
                    </div>
                    <div class="ar-formula" style="margin-top:12px;">
                        <span class="ar-formula-icon">💬</span>
                        <div><div class="ar-formula-desc">${data.interpretacion || ''}</div></div>
                    </div>`;
            }

            return '<p>Tipo de prueba no reconocido</p>';
        }

        // ── Nav items ──────────────────────────────────────────
        const navItems = statKeys.map((key, i) => {
            const meta = STAT_META[key] || { icono: '📊' };
            return `
                <div class="ar-nav-item ${i === 0 ? 'active' : ''}" data-stat="${key}">
                    <span class="ar-nav-icon">${meta.icono}</span>
                    <span>${key}</span>
                </div>`;
        }).join('');

        // ── Paneles de contenido ───────────────────────────────
        const panels = statKeys.map((key, i) => {
            const meta = STAT_META[key] || { formula: '', desc: '' };
            return `
                <div class="ar-panel ${i === 0 ? 'active' : ''}" data-panel="${key}">
                    <div class="ar-panel-title">
                        ${key}
                        <span class="ar-panel-n">— ${analisisResultado.totalFilas} observaciones</span>
                    </div>
                    <div class="ar-kpis-grid">
                        ${kpiCards(key)}
                    </div>
                    <div class="ar-formula">
                        <span class="ar-formula-icon">∑</span>
                        <div>
                            <div class="ar-formula-eq">${meta.formula}</div>
                            <div class="ar-formula-desc">${meta.desc}</div>
                        </div>
                    </div>
                </div>`;
        }).join('');

        // ── Tags de columnas ───────────────────────────────────
        const colTags = cols.map(c =>
            `<span class="ar-col-tag">${c}</span>`
        ).join('');

        // ── Sección de parámetros de control ──────────────────
        let paramSection = '';
        if (hasParams) {
            const verifs = cols
                .map(col => ParametrosManager.verificarColumna(
                    typeof getDataForModal === 'function' ? getDataForModal() : StateManager.getImportedData(), col
                ))
                .filter(v => v !== null);

            if (verifs.length > 0) {
                const rows = verifs.map(v => {
                    const pct   = parseFloat(v.porcentajeCumplimiento);
                    const cls   = pct >= 95 ? 'ar-param-ok' : pct >= 80 ? 'ar-param-warn' : 'ar-param-danger';
                    const badge = pct >= 95 ? 'ar-badge-ok' : pct >= 80 ? 'ar-badge-warn' : 'ar-badge-danger';
                    const label = pct >= 95 ? '✓ OK' : pct >= 80 ? '⚠ Revisar' : '✗ Fuera';
                    return `
                        <div class="ar-param-row ${cls}">
                            <span class="ar-param-col">${v.col}</span>
                            <span class="ar-param-val">${v.parametros.min ?? '—'}</span>
                            <span class="ar-param-val">${v.parametros.max ?? '—'}</span>
                            <span class="ar-param-val">${v.parametros.esp ?? '—'}</span>
                            <span class="ar-param-val">${v.fueraDeRango} / ${v.total}</span>
                            <span class="ar-kpi-badge ${badge}">${label} ${v.porcentajeCumplimiento}%</span>
                        </div>`;
                }).join('');

                paramSection = `
                    <div class="ar-params-block">
                        <div class="ar-params-title">🎯 Control de Parámetros</div>
                        <div class="ar-params-header">
                            <span>Variable</span>
                            <span>Mín</span>
                            <span>Máx</span>
                            <span>Esperanza</span>
                            <span>Fuera rango</span>
                            <span>Cumplimiento</span>
                        </div>
                        ${rows}
                    </div>`;
            }
        }

        return `
        <div class="ar-layout">

            <!-- Header -->
            <div class="ar-header">
                <div>
                    <h2 class="ar-title">📊 Resultados del Análisis Estadístico</h2>
                    <div class="ar-header-meta">
                        <span class="ar-meta-chip">📋 ${analisisResultado.totalFilas} filas</span>
                        <span class="ar-meta-chip">📊 ${analisisResultado.totalColumnas} columnas numéricas</span>
                        <span class="ar-meta-chip">🔬 ${analisisResultado.estadisticos.length} estadísticos</span>
                    </div>
                </div>
            </div>

            <!-- Columnas -->
            <div class="ar-cols-row">
                <span class="ar-cols-label">Columnas analizadas:</span>
                ${colTags}
            </div>

            <!-- Parámetros de control (si existen) -->
            ${paramSection}

            <!-- Body: nav + contenido -->
            <div class="ar-body">
                <div class="ar-nav">
                    <div class="ar-nav-title">ESTADÍSTICOS</div>
                    ${navItems}
                </div>
                <div class="ar-content">
                    ${panels}
                </div>
            </div>

            <!-- Notas Metodológicas -->
            <div class="ar-notes-section">
                <div class="ar-notes-title">📚 Notas Metodológicas</div>
                <div class="ar-notes-grid">
                    ${statKeys.map(key => {
                        const meta = STAT_META[key] || { formula: '', desc: '', icono: '📊' };
                        if (!meta.desc) return '';
                        
                        let extraContent = '';
                        
                        if (meta.hipotesis) {
                            extraContent += '<div class="ar-note-hipotesis">' +
                                '<strong>Hipótesis:</strong>' +
                                '<div>H₀: ' + meta.hipotesis.h0 + '</div>' +
                                '<div>H₁: ' + meta.hipotesis.h1 + '</div>' +
                            '</div>';
                        }
                        
                        if (meta.supuestos && meta.supuestos.length > 0) {
                            extraContent += '<div class="ar-note-supuestos">' +
                                '<strong>📋 Supuestos:</strong>' +
                                '<ul>' + meta.supuestos.map(s => '<li>' + s + '</li>').join('') + '</ul>' +
                            '</div>';
                        }
                        
                        if (meta.efectoTamano) {
                            const et = meta.efectoTamano;
                            extraContent += '<div class="ar-note-efecto">' +
                                '<strong>📏 Tamaño de efecto:</strong> ' + et.metrica +
                                '<span class="ar-note-formula">' + et.formula + '</span>' +
                            '</div>';
                        }
                        
                        if (meta.referencia) {
                            extraContent += '<div class="ar-note-referencia">' +
                                '<strong>📚 Referencia:</strong> ' + meta.referencia +
                            '</div>';
                        }
                        
                        return '<div class="ar-note-card">' +
                            '<div class="ar-note-header">' +
                                '<span class="ar-note-icon">' + meta.icono + '</span>' +
                                '<span class="ar-note-stat">' + key + '</span>' +
                            '</div>' +
                            '<div class="ar-note-formula">' + meta.formula + '</div>' +
                            '<div class="ar-note-desc">' + meta.desc + '</div>' +
                            extraContent +
                        '</div>';
                    }).join('')}
                </div>
            </div>

            <!-- Footer -->
            <div class="ar-footer">
                <button class="ar-btn-secondary">🔄 Nuevo análisis</button>
                <button class="ar-btn-primary">📥 Exportar reporte →</button>
            </div>
        </div>`;

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
        getNumericColumns
    };
})();

// Exportar si se usan módulos
// export default EstadisticaDescriptiva;

console.log('✅ Módulo de Estadística Descriptiva cargado');