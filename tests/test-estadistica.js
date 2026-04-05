/**
 * TESTS UNITARIOS - Motor Estadístico
 * 
 * Para ejecutar: abrir este archivo en el navegador o incluir en index.html
 * durante desarrollo. Los resultados se muestran en la consola y en el DOM.
 */

(function() {
    'use strict';

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const results = [];

    // ========================================
    // ASSERTION HELPERS
    // ========================================

    function assertEqual(actual, expected, tolerance = 1e-10, label = '') {
        totalTests++;
        const pass = typeof expected === 'number'
            ? Math.abs(actual - expected) < tolerance
            : actual === expected;

        if (pass) {
            passedTests++;
            results.push({ status: 'PASS', label, actual, expected });
        } else {
            failedTests++;
            results.push({ status: 'FAIL', label, actual, expected });
            console.error(`❌ FAIL: ${label} | Esperado: ${expected} | Obtenido: ${actual}`);
        }
    }

    function assertArrayEqual(actual, expected, tolerance = 1e-10, label = '') {
        totalTests++;
        if (actual.length !== expected.length) {
            failedTests++;
            results.push({ status: 'FAIL', label, actual: actual.join(','), expected: expected.join(',') });
            console.error(`❌ FAIL: ${label} | Longitudes diferentes: ${actual.length} vs ${expected.length}`);
            return;
        }
        let pass = true;
        for (let i = 0; i < actual.length; i++) {
            if (Math.abs(actual[i] - expected[i]) > tolerance) {
                pass = false;
                break;
            }
        }
        if (pass) {
            passedTests++;
            results.push({ status: 'PASS', label, actual, expected });
        } else {
            failedTests++;
            results.push({ status: 'FAIL', label, actual, expected });
            console.error(`❌ FAIL: ${label} | Arrays diferentes`);
        }
    }

    function assertTrue(condition, label = '') {
        totalTests++;
        if (condition) {
            passedTests++;
            results.push({ status: 'PASS', label });
        } else {
            failedTests++;
            results.push({ status: 'FAIL', label });
            console.error(`❌ FAIL: ${label}`);
        }
    }

    // ========================================
    // TEST DATA
    // ========================================

    // Datos simples
    const simpleData = [2, 4, 4, 4, 5, 5, 7, 9];
    // Media = 5, Mediana = 4.5, Moda = 4, Varianza = 4.571, DE = 2.138

    // Datos correlacionados
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 6, 8, 10]; // correlación perfecta r=1

    // Datos no correlacionados
    const z = [10, 2, 8, 1, 9];

    // Datos para regresión
    const xReg = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const yReg = [2.1, 4.0, 5.9, 8.1, 10.0, 12.1, 13.9, 16.0, 18.1, 20.0];

    // Datos normales (aproximados)
    const normalData = [48, 49, 50, 50, 50, 50, 50, 51, 52];

    // ========================================
    // TESTS
    // ========================================

    function runTests() {
        console.log('🧪 Iniciando tests del motor estadístico...\n');

        // ── Media ──
        console.group('📊 Media Aritmética');
        assertEqual(calcularMedia(simpleData), 5, 1e-6, 'Media de [2,4,4,4,5,5,7,9]');
        assertEqual(calcularMedia([1, 2, 3]), 2, 1e-6, 'Media de [1,2,3]');
        assertEqual(calcularMedia([10]), 10, 1e-6, 'Media de un solo valor');
        console.groupEnd();

        // ── Mediana ──
        console.group('📊 Mediana');
        assertEqual(calcularMediana(simpleData), 4.5, 1e-6, 'Mediana de [2,4,4,4,5,5,7,9]');
        assertEqual(calcularMediana([1, 2, 3]), 2, 1e-6, 'Mediana de [1,2,3]');
        assertEqual(calcularMediana([1, 2, 3, 4]), 2.5, 1e-6, 'Mediana de [1,2,3,4]');
        console.groupEnd();

        // ── Moda ──
        console.group('📊 Moda');
        assertEqual(calcularModa(simpleData), 4, 1e-6, 'Moda de [2,4,4,4,5,5,7,9]');
        assertEqual(calcularModa([1, 1, 2, 3]), 1, 1e-6, 'Moda de [1,1,2,3]');
        console.groupEnd();

        // ── Varianza ──
        console.group('📊 Varianza');
        assertEqual(calcularVarianza(simpleData, true), 4.571428571, 1e-6, 'Varianza muestral');
        assertEqual(calcularVarianza(simpleData, false), 4, 1e-6, 'Varianza poblacional');
        console.groupEnd();

        // ── Desviación Estándar ──
        console.group('📊 Desviación Estándar');
        assertEqual(calcularDesviacionEstandar(simpleData, true), 2.138089935, 1e-6, 'DE muestral');
        assertEqual(calcularDesviacionEstandar(simpleData, false), 2, 1e-6, 'DE poblacional');
        console.groupEnd();

        // ── Rango ──
        console.group('📊 Rango');
        assertEqual(calcularRango(simpleData), 7, 1e-6, 'Rango de [2,4,4,4,5,5,7,9]');
        console.groupEnd();

        // ── Coeficiente de Variación ──
        console.group('📊 Coeficiente de Variación');
        const cv = calcularCoeficienteVariacion(simpleData);
        assertEqual(cv, 42.7617987, 1e-3, 'CV de [2,4,4,4,5,5,7,9]');
        console.groupEnd();

        // ── Percentiles ──
        console.group('📊 Percentiles');
        assertEqual(calcularPercentil(simpleData, 50), 4.5, 1e-6, 'P50 (mediana)');
        assertEqual(calcularPercentil(simpleData, 25), 4, 1e-6, 'P25');
        assertEqual(calcularPercentil(simpleData, 75), 5.5, 1e-6, 'P75');
        console.groupEnd();

        // ── Cuartiles ──
        console.group('📊 Cuartiles');
        const cuartiles = calcularCuartiles(simpleData);
        assertEqual(cuartiles.Q1, 4, 1e-6, 'Q1');
        assertEqual(cuartiles.Q2, 4.5, 1e-6, 'Q2');
        assertEqual(cuartiles.Q3, 5.5, 1e-6, 'Q3');
        console.groupEnd();

        // ── IQR ──
        console.group('📊 IQR');
        assertEqual(calcularIQR(simpleData), 1.5, 1e-6, 'IQR');
        console.groupEnd();

        // ── Asimetría ──
        console.group('📊 Asimetría');
        const skew = calcularAsimetria(simpleData);
        assertTrue(skew > 0, 'Asimetría positiva para [2,4,4,4,5,5,7,9]');
        console.groupEnd();

        // ── Curtosis ──
        console.group('📊 Curtosis');
        const kurt = calcularCurtosis(simpleData);
        assertTrue(typeof kurt === 'number', 'Curtosis es un número');
        console.groupEnd();

        // ── Error Estándar ──
        console.group('📊 Error Estándar');
        const se = calcularErrorEstandar(simpleData);
        assertEqual(se, 2.138089935 / Math.sqrt(8), 1e-6, 'Error estándar');
        console.groupEnd();

        // ── Correlación Pearson ──
        console.group('📊 Correlación Pearson');
        const pearson = calcularCorrelacionPearson(x, y);
        assertEqual(pearson.r, 1, 1e-10, 'Pearson r=1 para correlación perfecta');
        assertTrue(pearson.pValue < 0.05, 'Pearson p < 0.05 para correlación perfecta');

        const pearsonZ = calcularCorrelacionPearson(x, z);
        assertTrue(Math.abs(pearsonZ.r) < 0.5, 'Pearson bajo para datos no correlacionados');
        console.groupEnd();

        // ── Correlación Spearman ──
        console.group('📊 Correlación Spearman');
        const spearman = calcularCorrelacionSpearman(x, y);
        assertEqual(spearman.rho, 1, 1e-10, 'Spearman rho=1 para correlación perfecta');
        console.groupEnd();

        // ── Covarianza ──
        console.group('📊 Covarianza');
        const cov = calcularCovarianza(x, y);
        assertEqual(cov, 2.5, 1e-6, 'Covarianza de [1,2,3,4,5] y [2,4,6,8,10]');
        console.groupEnd();

        // ── RMSE ──
        console.group('📊 RMSE');
        const rmse = calcularRMSE([1, 2, 3], [1.1, 2.1, 3.1]);
        assertEqual(rmse, 0.1, 1e-6, 'RMSE perfecto con error de 0.1');
        console.groupEnd();

        // ── MAE ──
        console.group('📊 MAE');
        const mae = calcularMAE([1, 2, 3], [1.1, 2.1, 3.1]);
        assertEqual(mae, 0.1, 1e-6, 'MAE perfecto con error de 0.1');
        console.groupEnd();

        // ── R² ──
        console.group('📊 R²');
        const r2 = calcularR2([1, 2, 3], [1, 2, 3]);
        assertEqual(r2, 1, 1e-10, 'R²=1 para predicción perfecta');
        console.groupEnd();

        // ── Regresión Lineal Simple ──
        console.group('📊 Regresión Lineal Simple');
        const reg = calcularRegresionLinealSimple(xReg, yReg);
        assertEqual(reg.r2, 0.9999, 1e-3, 'R² ≈ 1 para regresión casi perfecta');
        assertTrue(reg.significante, 'Regresión significativa');
        assertTrue(Math.abs(reg.pendiente - 2) < 0.01, 'Pendiente ≈ 2');
        console.groupEnd();

        // ── T-Test una muestra ──
        console.group('📊 T-Test (una muestra)');
        const tTest1 = calcularTTestUnaMuestra(normalData, 50);
        assertTrue(typeof tTest1.estadisticoT === 'number', 'T-Test devuelve estadístico');
        assertTrue(typeof tTest1.valorP === 'number', 'T-Test devuelve valor p');
        console.groupEnd();

        // ── Test de Normalidad ──
        console.group('📊 Test de Normalidad');
        const normalTest = calcularTestNormalidad(normalData);
        assertTrue(typeof normalTest.estadisticoJB === 'number', 'JB devuelve estadístico');
        assertTrue(typeof normalTest.esNormal === 'boolean', 'JB devuelve booleano');
        console.groupEnd();

        // ── Test de Shapiro-Wilk ──
        console.group('📊 Test de Shapiro-Wilk');
        const sw = calcularShapiroWilk(normalData);
        assertTrue(typeof sw.estadisticoW === 'number', 'SW devuelve estadístico W');
        assertTrue(typeof sw.valorP === 'number', 'SW devuelve valor p');
        assertTrue(sw.estadisticoW > 0.8, 'SW W > 0.8 para datos normales');
        console.groupEnd();

        // ── ANOVA ──
        console.group('📊 ANOVA One-Way');
        const anovaData = {
            grupo1: [1, 2, 3, 4, 5],
            grupo2: [6, 7, 8, 9, 10],
            grupo3: [11, 12, 13, 14, 15]
        };
        const anova = calcularANOVA(anovaData);
        assertTrue(typeof anova.estadisticoF === 'number', 'ANOVA devuelve F');
        assertTrue(anova.significativo, 'ANOVA significativo para grupos muy diferentes');
        console.groupEnd();

        // ── Mann-Whitney U ──
        console.group('📊 Mann-Whitney U');
        const mw = calcularMannWhitneyU([1, 2, 3, 4, 5], [6, 7, 8, 9, 10]);
        assertTrue(typeof mw.U === 'number', 'MW devuelve U');
        assertTrue(mw.significativo, 'MW significativo para grupos muy diferentes');
        console.groupEnd();

        // ── Kruskal-Wallis ──
        console.group('📊 Kruskal-Wallis');
        const kw = calcularKruskalWallis({
            grupo1: [1, 2, 3, 4, 5],
            grupo2: [6, 7, 8, 9, 10],
            grupo3: [11, 12, 13, 14, 15]
        });
        assertTrue(typeof kw.H === 'number', 'KW devuelve H');
        assertTrue(kw.significativo, 'KW significativo para grupos muy diferentes');
        console.groupEnd();

        // ── Chi-Cuadrado ──
        console.group('📊 Chi-Cuadrado');
        const chiData = {
            'A': { 'X': 20, 'Y': 30 },
            'B': { 'X': 30, 'Y': 20 }
        };
        const chi = calcularChiCuadrado(chiData);
        assertTrue(typeof chi.estadisticoChi2 === 'number', 'Chi² devuelve estadístico');
        console.groupEnd();

        // ── Kendall Tau ──
        console.group('📊 Kendall Tau');
        const kt = calcularKendallTau(x, y);
        assertEqual(kt.tau, 1, 1e-10, 'Kendall tau=1 para correlación perfecta');
        assertTrue(kt.significante, 'Kendall significativo para correlación perfecta');
        console.groupEnd();

        // ── Regresión Polinomial ──
        console.group('📊 Regresión Polinomial');
        const poly = calcularRegresionPolinomial([1, 2, 3, 4, 5], [1, 4, 9, 16, 25], 2);
        assertTrue(poly.r2 > 0.99, 'R² ≈ 1 para polinomio x² perfecto');
        console.groupEnd();

        // ── Intervalos de Confianza ──
        console.group('📊 Intervalos de Confianza');
        const ic = calcularIntervalosConfianza(simpleData);
        assertTrue(ic.limiteInferior < ic.limiteSuperior, 'IC: inferior < superior');
        assertEqual(ic.nivelConfianza, 0.95, 1e-6, 'IC: nivel 95%');
        console.groupEnd();

        // ── Outliers ──
        console.group('📊 Detección de Outliers');
        const outlierData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 100];
        const outlierResult = EstadisticaDescriptiva.calcularTodo(outlierData, 'test');
        assertTrue(outlierResult.outliers.length > 0, 'Detecta outlier (100)');
        console.groupEnd();

        // ========================================
        // RESUMEN
        // ========================================

        console.log('\n' + '='.repeat(60));
        console.log(`📊 RESULTADOS: ${passedTests}/${totalTests} PASSED | ${failedTests} FAILED`);
        console.log('='.repeat(60));

        if (failedTests === 0) {
            console.log('✅ TODOS LOS TESTS PASARON');
        } else {
            console.log(`❌ ${failedTests} test(s) fallaron:`);
            results.filter(r => r.status === 'FAIL').forEach(r => {
                console.log(`   - ${r.label}: esperado=${r.expected}, obtenido=${r.actual}`);
            });
        }

        // Mostrar en el DOM si estamos en un navegador
        if (typeof document !== 'undefined') {
            const container = document.createElement('div');
            container.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:10000;background:#1a1a2e;color:#eee;padding:16px;font-family:monospace;font-size:12px;max-height:50vh;overflow:auto;';
            container.innerHTML = `
                <h3 style="color:#c8a951;margin:0 0 8px">🧪 Tests del Motor Estadístico</h3>
                <p style="margin:0 0 8px">${passedTests}/${totalTests} PASSED | ${failedTests} FAILED</p>
                ${results.map(r => `<div style="color:${r.status === 'PASS' ? '#4ade80' : '#f87171'}">${r.status === 'PASS' ? '✅' : '❌'} ${r.label || ''}${r.expected !== undefined ? ` | esperado: ${r.expected} | obtenido: ${r.actual}` : ''}</div>`).join('')}
            `;
            document.body.prepend(container);
        }

        return { total: totalTests, passed: passedTests, failed: failedTests };
    }

    // ========================================
    // AUTO-EJECUCIÓN
    // ========================================

    // Esperar a que EstadisticaDescriptiva esté cargado
    function waitForModule() {
        if (typeof EstadisticaDescriptiva !== 'undefined') {
            // Exponer funciones para tests
            window.calcularMedia = EstadisticaDescriptiva.calcularMedia;
            window.calcularMediana = EstadisticaDescriptiva.calcularMediana;
            window.calcularModa = EstadisticaDescriptiva.calcularModa;
            window.calcularVarianza = EstadisticaDescriptiva.calcularVarianza;
            window.calcularDesviacionEstandar = EstadisticaDescriptiva.calcularDesviacionEstandar;
            window.calcularRango = EstadisticaDescriptiva.calcularRango;
            window.calcularCoeficienteVariacion = EstadisticaDescriptiva.calcularCoeficienteVariacion;
            window.calcularPercentil = EstadisticaDescriptiva.calcularPercentil;
            window.calcularCuartiles = EstadisticaDescriptiva.calcularCuartiles;
            window.calcularIQR = EstadisticaDescriptiva.calcularIQR;
            window.calcularAsimetria = EstadisticaDescriptiva.calcularAsimetria;
            window.calcularCurtosis = EstadisticaDescriptiva.calcularCurtosis;
            window.calcularErrorEstandar = EstadisticaDescriptiva.calcularErrorEstandar;
            window.calcularIntervalosConfianza = EstadisticaDescriptiva.calcularIntervalosConfianza;
            window.calcularCorrelacionPearson = EstadisticaDescriptiva.calcularCorrelacionPearson;
            window.calcularCorrelacionSpearman = EstadisticaDescriptiva.calcularCorrelacionSpearman;
            window.calcularKendallTau = EstadisticaDescriptiva.calcularKendallTau;
            window.calcularCovarianza = EstadisticaDescriptiva.calcularCovarianza;
            window.calcularRMSE = EstadisticaDescriptiva.calcularRMSE;
            window.calcularMAE = EstadisticaDescriptiva.calcularMAE;
            window.calcularR2 = EstadisticaDescriptiva.calcularR2;
            window.calcularRegresionLinealSimple = EstadisticaDescriptiva.calcularRegresionLinealSimple;
            window.calcularRegresionPolinomial = EstadisticaDescriptiva.calcularRegresionPolinomial;
            window.calcularTTestUnaMuestra = EstadisticaDescriptiva.calcularTTestUnaMuestra;
            window.calcularTestNormalidad = EstadisticaDescriptiva.calcularTestNormalidad;
            window.calcularShapiroWilk = EstadisticaDescriptiva.calcularShapiroWilk;
            window.calcularANOVA = EstadisticaDescriptiva.calcularANOVA;
            window.calcularMannWhitneyU = EstadisticaDescriptiva.calcularMannWhitneyU;
            window.calcularKruskalWallis = EstadisticaDescriptiva.calcularKruskalWallis;
            window.calcularChiCuadrado = EstadisticaDescriptiva.calcularChiCuadrado;

            console.log('✅ Tests cargados. Ejecutando...');
            runTests();
        } else {
            setTimeout(waitForModule, 100);
        }
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForModule);
    } else {
        waitForModule();
    }

})();
