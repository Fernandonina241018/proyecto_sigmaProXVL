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
    
    
    // ========================================
    // REF-2: Importar funciones del módulo core
    // ========================================
    const __core = window.__StatsCore;
    const {
        sortNumbers, getNumericValues, getNumericColumns,
        calcularIntervalosConfianza, calcularRMSE, calcularMAE, calcularR2,
        lgamma, calcularValorP_T, betaIncomplete, normalCDF,
        calcularValorP_ChiCuadrado, gammaIncomplete, normalInverseCDF,
        calcularTTestUnaMuestra, calcularTTestDosMuestras,
        calcularMannWhitneyU, calcularKruskalWallis,
        calcularWilcoxon, calcularFriedman, calcularTestSignos,
        calcularBootstrap, calcularANOVA, calcularValorP_F,
        calcularANOVA2Factores, calcularChiCuadrado,
        calcularTestNormalidad, calcularShapiroWilk,
        calcularCoeficientesSW, calcularValorP_ShapiroWilk,
        calcularKolmogorovSmirnov, calcularAndersonDarling,
        calcularDAgostinoPearson,
        calcularPareto, calcularLimitesCuantificacion,
        calcularLimitesCalibracion, calcularTOST,
        calcularCluster, calcularDiscriminante, calcularMANOVA,
        calcularSupervivencia, calcularSeriesTemporales,
        calcularModelosMixtos, calcularBayesiano, randomNormal,
        calcularFactorLetalidad, calcularMKT, calcularTendencia,
        calcularCorrelacionPearson, calcularCorrelacionSpearman, calcularKendallTau,
        calcularRegresionLinealSimple, calcularRegresionMultiple,
        calcularRegresionPolinomial, calcularRegresionLogistica,
        calcularPCA, calcularAnalisisFactorial,
        numericAdd, numericDeterminant,
        analizarColumna, analizarTodasLasColumnas,
        formatReferencia, generarReporte, getStatMeta
    } = __core;
    
    function ejecutarAnalisis(data, estadisticos, hypothesisConfig = {}) {
        // Imputación si está configurada
        if (typeof columnAnalysisConfig !== 'undefined' && columnAnalysisConfig && columnAnalysisConfig.imputeMissing) {
            data.headers.forEach(function(h) {
                Stats.imputeColumn(data, h, columnAnalysisConfig.imputeMethod || 'media');
            });
        }
        
        const numericCols = getNumericColumns(data);
        
        if (numericCols.length === 0) {
            throw new Error('No se encontraron columnas numéricas para analizar');
        }
        
        const resultados = {};
        
        estadisticos.forEach(stat => {
            try {
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

                case 'Tendencia':
                    resultados['Tendencia'] = {};
                    var tenCfg = hypothesisConfig['Tendencia'] || {};
                    var tenTipo = tenCfg.tipo || 'lineal';
                    var tenPasos = parseInt(tenCfg.pasos) || 5;
                    var tenVentana = parseInt(tenCfg.ventana) || 3;
                    numericCols.forEach(col => {
                        const values = getNumericValues(data, col);
                        resultados['Tendencia'][col] = calcularTendencia(values, tenTipo, tenPasos, tenVentana);
                    });
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
                          
                          if (!colCategorias || !data.data || !data.data[0] || !data.data[0].hasOwnProperty(colCategorias)) {
                              resultados['Diagrama de Pareto'] = { error: 'Seleccione columna de categorías' };
                          } else {
                              // Preparar datos para Pareto
                              const conteos = {};
                              data.data.forEach(row => {
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

                     case 'Factor de Letalidad (F0)':
                        resultados['Factor de Letalidad (F0)'] = {};
                        var f0Cfg = hypothesisConfig['Factor de Letalidad (F0)'] || {};
                        var f0Cols = f0Cfg.columnas && f0Cfg.columnas.length ? f0Cfg.columnas : numericCols;
                        if (!f0Cols.length) break;
                        var f0Opts = {};
                        if (f0Cfg.delta_t) f0Opts.delta_t = parseFloat(f0Cfg.delta_t);
                        if (f0Cfg.z) f0Opts.z = parseFloat(f0Cfg.z);
                        if (f0Cfg.T_ref) f0Opts.T_ref = parseFloat(f0Cfg.T_ref);
                        if (f0Cfg.umbral_F0) f0Opts.umbral_F0 = parseFloat(f0Cfg.umbral_F0);
                        if (f0Cfg.umbral_F0_min) f0Opts.umbral_F0_min = parseFloat(f0Cfg.umbral_F0_min);
                        f0Cols.forEach(function(col) {
                            var f0Values = getNumericValues(data, col);
                            if (f0Values.length < 2) {
                                resultados['Factor de Letalidad (F0)'][col] = { error: 'Se necesitan al menos 2 lecturas de temperatura' };
                            } else {
                                resultados['Factor de Letalidad (F0)'][col] = calcularFactorLetalidad(f0Values, f0Opts);
                            }
                        });
                        break;

                     case 'MKT (Mean Kinetic Temperature)':
                        resultados['MKT (Mean Kinetic Temperature)'] = {};
                        var mktCfg = hypothesisConfig['MKT (Mean Kinetic Temperature)'] || {};
                        var mktCols = mktCfg.columnas && mktCfg.columnas.length ? mktCfg.columnas : numericCols;
                        if (!mktCols.length) break;
                        var mktOpts = {};
                        if (mktCfg.delta_HR) mktOpts.delta_HR = parseFloat(mktCfg.delta_HR);
                        if (mktCfg.limite_max != null) mktOpts.limite_max = parseFloat(mktCfg.limite_max);
                        if (mktCfg.limite_min != null) mktOpts.limite_min = parseFloat(mktCfg.limite_min);
                        mktCols.forEach(function(col) {
                            var mktValues = getNumericValues(data, col);
                            if (mktValues.length < 2) {
                                resultados['MKT (Mean Kinetic Temperature)'][col] = { error: 'Se necesitan al menos 2 lecturas de temperatura' };
                            } else {
                                resultados['MKT (Mean Kinetic Temperature)'][col] = calcularMKT(mktValues, mktOpts);
                            }
                        });
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
                        
                        debugLog('[PCA] pcaColumns:', pcaColumns);
                        
                        if (pcaColumns.length < 2) {
                            resultados['PCA (Componentes Principales)'] = { error: 'Seleccione al menos 2 columnas para PCA en la configuración' };
                        } else {
                            const dataMatrix = [];
                            const lengths = pcaColumns.map(col => getNumericValues(data, col).length);
                            const validLengths = lengths.filter(l => l > 0);
                            
                            debugLog('[PCA] validLengths:', validLengths);
                            
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
                                
                                debugLog('[PCA] dataMatrix.length:', dataMatrix.length, 'dataMatrix[0]:', dataMatrix[0]);
                                
                                if (dataMatrix.length < 10) {
                                    resultados['PCA (Componentes Principales)'] = { error: 'Se necesitan al menos 10 observaciones para PCA' };
                                } else {
                                    const pcaResult = calcularPCA(dataMatrix, pcaColumns.length);
                                    debugLog('[PCA] resultado:', pcaResult);
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
            } catch (e) {
                resultados[stat] = { error: e.message || 'Error desconocido al ejecutar ' + stat };
            }
        });
        
        // Auto-training: el modelo aprende de los tests seleccionados
        try {
            if (typeof MLStatsManager !== 'undefined' && data && data.headers) {
                MLStatsManager.autoTrainFromAnalisis(estadisticos, data);
            }
        } catch (e) {
            console.warn('[EstadisticaDescriptiva] Error en auto-training:', e.message);
        }
        
        return {
            columnasAnalizadas: numericCols,
            totalColumnas: numericCols.length,
            totalFilas: data.rowCount,
            estadisticos: estadisticos,
            resultados: resultados
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

        // F0 — Factor de Letalidad
        if (statKey === 'Factor de Letalidad (F0)') {
            var f0Cols = Object.keys(data).filter(function(c) { return data[c] && !data[c].error; });
            if (!f0Cols.length) return '<p class="ar-error">Sin resultados</p>';
            return f0Cols.map(function(col) {
                var val = data[col];
                var umbralObj = val.umbral_F0 || 12;
                var umbralMin = val.umbral_F0_min || 8;
                var badgeClass = val.F0 >= umbralObj ? 'ar-badge-ok' : val.F0 >= umbralMin ? 'ar-badge-warn' : 'ar-badge-danger';
                var badgeText = val.interpretacion || '';
                return '<div class="ar-kpi-card ar-kpi-multi">' +
                    '<div class="ar-kpi-col-label">🔥 ' + escapeHtml(col) + '</div>' +
                    '<div class="ar-kpi-sub-grid" style="grid-template-columns:1fr 1fr">' +
                        '<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">F0</span><span class="ar-kpi-sub-v" style="font-size:1.2rem;font-weight:700">' + (val.F0 ?? '—') + '</span></div>' +
                        '<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">T máx</span><span class="ar-kpi-sub-v">' + (val.T_max ?? '—') + '°C</span></div>' +
                        '<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Tiempo sobre umbral</span><span class="ar-kpi-sub-v">' + (val.tiempo_sobre_umbral ?? '—') + ' min</span></div>' +
                        '<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">' + (val.n ?? '—') + '</span></div>' +
                    '</div>' +
                    '<div class="ar-kpi-badge ' + badgeClass + '">' + escapeHtml(badgeText) + '</div>' +
                    '<div class="ar-formula" style="margin-top:8px"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">F0 = ' + (val.F0 ?? '—') + ' min (Δt=' + (val.delta_t ?? '?') + ', z=' + (val.z ?? '?') + ', T_ref=' + (val.T_ref ?? '?') + '°C)</div></div></div>' +
                '</div>';
            }).join('');
        }

        if (statKey === 'Tendencia') {
            var tenCols = Object.keys(data).filter(function(c) { return data[c] && !data[c].error; });
            if (!tenCols.length) return '<p class="ar-error">Sin resultados</p>';
            return tenCols.map(function(col) {
                var val = data[col];
                if (val.error) return '<div class="ar-kpi-card ar-kpi-multi"><div class="ar-kpi-col-label">' + escapeHtml(col) + '</div><p class="ar-error">' + escapeHtml(val.error) + '</p></div>';
                var proyHtml = '';
                if (val.proyecciones && val.proyecciones.length > 0) {
                    proyHtml = '<div style="margin-top:10px"><div class="ar-kpi-col-label" style="font-size:0.8rem">🔮 Proyecciones</div>' +
                        '<table style="width:100%;border-collapse:collapse;font-size:0.75rem;margin-top:4px">' +
                        '<tr style="background:rgba(124,58,237,.1)"><th style="padding:4px;text-align:center">Paso</th><th style="padding:4px;text-align:right">Valor</th></tr>';
                    val.proyecciones.forEach(function(p) {
                        proyHtml += '<tr style="border-bottom:.5px solid var(--border)"><td style="padding:3px;text-align:center">' + p.paso + '</td><td style="padding:3px;text-align:right;font-weight:500">' + p.valor + '</td></tr>';
                    });
                    proyHtml += '</table></div>';
                }
                var suavHtml = '';
                if (val.suavizados && val.suavizados.length > 0) {
                    suavHtml = '<div style="margin-top:10px;max-height:200px;overflow-y:auto"><div class="ar-kpi-col-label" style="font-size:0.8rem">📊 Serie suavizada (MA)</div>' +
                        '<table style="width:100%;border-collapse:collapse;font-size:0.7rem;margin-top:4px">' +
                        '<tr style="background:rgba(124,58,237,.1)"><th style="padding:3px;text-align:center">#</th><th style="padding:3px;text-align:right">Valor</th></tr>';
                    val.suavizados.forEach(function(s, i) {
                        suavHtml += '<tr style="border-bottom:.5px solid var(--border)"><td style="padding:2px;text-align:center">' + (i + 1) + '</td><td style="padding:2px;text-align:right">' + s + '</td></tr>';
                    });
                    suavHtml += '</table></div>';
                }
                return '<div class="ar-kpi-card ar-kpi-multi">' +
                    '<div class="ar-kpi-col-label">📈 ' + escapeHtml(col) + ' (' + (val.tipo === 'lineal' ? 'Lineal' : val.tipo === 'exponencial' ? 'Exponencial' : 'Media Móvil') + ')</div>' +
                    '<div class="ar-kpi-sub-grid" style="grid-template-columns:1fr 1fr">' +
                        '<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Fórmula</span><span class="ar-kpi-sub-v" style="font-size:0.8rem">' + escapeHtml(val.formula || '—') + '</span></div>' +
                        (val.r2 !== undefined ? '<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">R²</span><span class="ar-kpi-sub-v">' + val.r2.toFixed(4) + '</span></div>' : '') +
                        (val.pendiente !== undefined ? '<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Pendiente</span><span class="ar-kpi-sub-v">' + val.pendiente.toFixed(4) + '</span></div>' : '') +
                        (val.intercepto !== undefined ? '<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Intercepto</span><span class="ar-kpi-sub-v">' + val.intercepto.toFixed(4) + '</span></div>' : '') +
                        (val.direccion ? '<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">Dirección</span><span class="ar-kpi-sub-v">' + escapeHtml(val.direccion) + '</span></div>' : '') +
                        '<div class="ar-kpi-sub"><span class="ar-kpi-sub-k">n</span><span class="ar-kpi-sub-v">' + val.n + '</span></div>' +
                    '</div>' +
                    (val.interpretacion ? '<div class="ar-formula" style="margin-top:8px"><span class="ar-formula-icon">💬</span><div><div class="ar-formula-desc">' + escapeHtml(val.interpretacion) + '</div></div></div>' : '') +
                    proyHtml + suavHtml +
                '</div>';
            }).join('');
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
            Reporte generado automáticamente por StatLab · ${(function(_d){var _m='Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic'.split(',');return ('0'+_d.getDate()).slice(-2)+'/'+_m[_d.getMonth()]+'/'+_d.getFullYear()+' '+_d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit',hour12:true});})(new Date())}
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

