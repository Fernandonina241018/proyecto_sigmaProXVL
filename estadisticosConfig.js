// ========================================
// estadisticosConfig.js - CONFIGURACIÓN CENTRALIZADA DE ESTADÍSTICOS
// StatAnalyzer Pro
// ========================================
//
// ESTRUCTURA DE CADA ENTRADA:
//
// ESTRUCTURA DE CADA ENTRADA:
// {
//   seccion:               Sección del UI
//   calcular:              Función en EstadisticaDescriptiva.js
//   formula:               Fórmula matemática simbólica
//   desc:                  Descripción breve del estadístico
//   icono:                 Emoji para UI
//   minMuestra:            Mínimo de observaciones requerido
//   maxMuestra:            Máximo de observaciones (opcional)
//   edaKey:                Clave para EDA automático (opcional)
//   requiereDosColumnas:   true si necesita 2 columnas
//
//   — CAMPOS EXTENDIDOS (propuesta) —
//   hipotesis:             { h0, h1 } — hipótesis nula y alternativa
//   supuestos:             string[] — condiciones de validez del test
//   inputs:                { tipo, grupos, descripcion } — qué variables espera
//   salidas:               string[] — contrato de retorno del método calcular
//   tipoTest:              { defecto, opciones } — uni/bilateral (solo tests)
//   nivelAlfa:             number — umbral de significancia por defecto (solo tests)
//   efectoTamano:          { metrica, formula, umbrales } — medida de efecto aplicable
//   interpretacion:        { significativo?, noSignificativo?, plantilla? } — texto de reporte
//   alternativaParametrica / alternativaNoParametrica — referencia cruzada
//   advertencias:          [{ condicion, mensaje }] — avisos no bloqueantes
//   referencia:            string — cita canónica
// }

const ESTADISTICOS_CONFIG = {

    // ════════════════════════════════════════
    // SECCIÓN: DESCRIPTIVA
    // ════════════════════════════════════════

    'Media Aritmética': {
        seccion:   'descriptiva',
        calcular:  'calcularMedia',
        formula:   'x̄ = Σxᵢ / n',
        desc:      'Tendencia central de la distribución. Suma de todos los valores dividida entre el número de observaciones.',
        icono:     '📐',
        minMuestra: 1,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico de cualquier longitud',
        },
        salidas: ['media', 'n', 'suma'],
        interpretacion: {
            plantilla: 'La media aritmética es {media}. Resume el valor central típico de los {n} datos.',
        },
        advertencias: [
            { condicion: 'outliers_detectados', mensaje: 'Se detectaron valores atípicos. La media puede estar influenciada; considere complementar con la mediana.' },
            { condicion: 'asimetria_alta',      mensaje: 'Distribución asimétrica: la media puede no representar bien la tendencia central.' },
        ],
        referencia: [
            {
                autores:  'Freedman, D., Pisani, R. & Purves, R.',
                anio:     2007,
                titulo:   'Statistics',
                revista:  'W.W. Norton',
                edition:  '4ª ed.'
            }
        ],
    },

    'Mediana': {
        seccion:   'descriptiva',
        calcular:  'calcularMedianaModa',
        formula:   'Mediana: P₅₀ = valor central',
        desc:      'Mediana: divide la distribución en dos mitades iguales. Resistente a valores atípicos. Moda: valor con mayor frecuencia.',
        icono:     '📊',
        minMuestra: 1,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico o categórico',
        },
        salidas: ['mediana', 'esModoMultiple', 'n'],
        interpretacion: {
            plantilla: 'Mediana: {mediana}. Si mediana ≠ media, la distribución es asimétrica.',
        },
        advertencias: [
            { condicion: 'moda_multiple', mensaje: 'Existen múltiples modas (distribución multimodal). Se reportan todas.' },
        ],
        referencia: [
            {
                autores:  'Freedman, D., Pisani, R. & Purves, R.',
                anio:     2007,
                titulo:   'Statistics',
                revista:  'W.W. Norton',
                edition:  '4ª ed.'
            }
        ],
    },

        'Moda': {
        seccion:   'descriptiva',
        calcular:  'calcularMedianaModa',
        formula:   'Moda: valor más frecuente',
        desc:      'Moda: valor con mayor frecuencia.',
        icono:     '📊',
        minMuestra: 1,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico o categórico',
        },
        salidas: ['moda', 'esModoMultiple', 'n'],
        interpretacion: {
            plantilla: 'Moda: {moda}. Si hay múltiples modas, se reportan todas. Indica el valor o categoría más común en los datos.',
        },
        advertencias: [
            { condicion: 'moda_multiple', mensaje: 'Existen múltiples modas (distribución multimodal). Se reportan todas.' },
        ],
        referencia: [
            {
                autores:  'Freedman, D., Pisani, R. & Purves, R.',
                anio:     2007,
                titulo:   'Statistics',
                revista:  'W.W. Norton',
                edition:  '4ª ed.'
            }
        ],
    },

    'Desviación Estándar': {
        seccion:   'descriptiva',
        calcular:  'calcularDesviacionEstandar',
        formula:   's = √[Σ(xᵢ − x̄)² / (n−1)]',
        desc:      'Dispersión típica respecto a la media con corrección de Bessel (n−1). Principal indicador de variabilidad del proceso.',
        icono:     '📉',
        minMuestra: 2,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico de al menos 2 observaciones',
        },
        salidas: ['de', 'varianza', 'n', 'media'],
        interpretacion: {
            plantilla: 'Desviación estándar: {de}. El {pct68}% de los datos cae dentro de x̄ ± s bajo normalidad.',
        },
        advertencias: [
            { condicion: 'n_menor_30', mensaje: 'Con n<30 la estimación de σ puede tener alta incertidumbre.' },
        ],
        referencia: [
            {
                autores:  'Bessel, F.',
                anio:     1838,
                titulo:   'Correction to the estimation of variance',
                revista:  'Astronomische Nachrichten',
            }
        ],
    },

    'Varianza': {
        seccion:   'descriptiva',
        calcular:  'calcularVarianza',
        formula:   's² = Σ(xᵢ − x̄)² / (n−1)',
        desc:      'Dispersión cuadrática media. Base para el cálculo de la desviación estándar y análisis de varianza (ANOVA).',
        icono:     '📈',
        minMuestra: 2,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico de al menos 2 observaciones',
        },
        salidas: ['varianza', 'de', 'n', 'media'],
        interpretacion: {
            plantilla: 'Varianza muestral: {varianza} (en unidades²). Equivale a DE² = {de}².',
        },
        advertencias: [
            { condicion: 'unidades_cuadradas', mensaje: 'La varianza está en unidades al cuadrado. Para interpretación directa use la desviación estándar.' },
        ],
        referencia: [
            {
                autores:  'Bessel, F.',
                anio:     1838,
                titulo:   'Correction to the estimation of variance',
                revista:  'Astronomische Nachrichten',
            }
        ],
    },

    'Percentiles': {
        seccion:   'descriptiva',
        calcular:  'calcularPercentiles',
        formula:   'i = k/100 × (n−1) [interpolación lineal NIST]',
        desc:      'Dividen la distribución en 100 partes iguales. P25, P50 y P75 definen los cuartiles y el rango intercuartílico.',
        icono:     '📶',
        minMuestra: 1,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico; se calculan P5, P10, P25, P50, P75, P90, P95 por defecto',
        },
        salidas: ['p5', 'p10', 'p25', 'p50', 'p75', 'p90', 'p95', 'iqr'],
        interpretacion: {
            plantilla: 'El {k}% de los datos está por debajo de {valor}. IQR = {iqr} indica la dispersión central.',
        },
        advertencias: [
            { condicion: 'n_menor_10', mensaje: 'Con menos de 10 observaciones los percentiles extremos (P5, P95) son poco fiables.' },
        ],
        referencia: [
            {
                autores:  'Hyndman, R.J. & Fan, Y.',
                anio:     1996,
                titulo:   'Sample quantiles in statistical packages',
                revista:  'The American Statistician',
                volumen:   '50',
                numero:    '4',
                paginas:   '361–365',
            }

        ],
    },

    'Rango y Amplitud': {
        seccion:   'descriptiva',
        calcular:  'calcularRango',
        formula:   'R = Máx − Mín',
        desc:      'Extensión total de la distribución. Sensible a valores extremos, complementa la desviación estándar.',
        icono:     '↔️',
        minMuestra: 1,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico',
        },
        salidas: ['rango', 'min', 'max', 'n'],
        interpretacion: {
            plantilla: 'Rango total: {rango} (de {min} a {max}). Un rango muy amplio respecto a la DE sugiere outliers.',
        },
        referencias: [
            {
                autores:  'Freedman, D., Pisani, R. & Purves, R.',
                anio:     2007,
                titulo:   'Statistics',
                edicion:  '4ª ed.',
                edition:  'W.W. Norton',
            }
        ],
    },

    'Coeficiente de Variación': {
        seccion:   'descriptiva',
        calcular:  'calcularCoeficienteVariacion',
        formula:   'CV = (s / |x̄|) × 100%',
        desc:      'Dispersión relativa respecto a la media expresada en porcentaje. Permite comparar variabilidad entre variables con diferentes unidades o escalas.',
        icono:     '📊',
        minMuestra: 2,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico con media distinta de cero',
        },
        salidas: ['cv', 'de', 'media', 'n'],
        interpretacion: {
            plantilla: 'CV = {cv}%. Valores <10% indican baja variabilidad; >30% indican alta variabilidad relativa.',
        },
        advertencias: [
            { condicion: 'media_cercana_cero', mensaje: 'La media es cercana a cero; el CV puede ser inestable o no interpretable.' },
            { condicion: 'valores_negativos',  mensaje: 'Los datos contienen valores negativos; el CV pierde su interpretación habitual.' },
        ],
        referencia: [
            {
                autores:  'Everitt, B.S.',
                anio:     2002,
                titulo:   'The Cambridge Dictionary of Statistics',
                revista:  'Cambridge University Press',
                edition:  '2ª ed.'
            }
        ],
    },

    'Asimetría (Skewness)': {
        seccion:   'descriptiva',
        calcular:  'calcularAsimetria',
        formula:   'g₁ = Σ(xᵢ − x̄)³ / (n × s³)',
        desc:      'Simetría de la distribución. >0 cola derecha, <0 cola izquierda, ≈0 simétrica.',
        icono:     '📐',
        minMuestra: 3,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico de al menos 3 observaciones',
        },
        salidas: ['asimetria', 'interpretacion', 'n'],
        interpretacion: {
            plantilla: 'Asimetría: {asimetria}. {interpretacion} (|g₁|<0.5 simétrica, 0.5–1 moderada, >1 pronunciada).',
        },
        advertencias: [
            { condicion: 'n_menor_30', mensaje: 'Con n<30 el estimador de asimetría tiene varianza elevada; interprete con cautela.' },
        ],
        referencia: [
            {
                autores:  'Joanes, D.N. & Gill, C.A.',
                anio:     1998,
                titulo:   'Comparing measures of sample skewness and kurtosis',
                revista:  'The Statistician',
                volumen:  47,
                paginas:  '183–189'
            }
        ],
    },

    'Curtosis (Kurtosis)': {
        seccion:   'descriptiva',
        calcular:  'calcularCurtosis',
        formula:   'g₂ = [Σ(xᵢ − x̄)⁴ / (n × s⁴)] − 3',
        desc:      'Apuntamiento de la distribución. >0 leptocúrtica, <0 platicúrtica, ≈0 mesocúrtica (normal).',
        icono:     '🔺',
        minMuestra: 3,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico de al menos 3 observaciones',
        },
        salidas: ['curtosis', 'interpretacion', 'n'],
        interpretacion: {
            plantilla: 'Curtosis exceso: {curtosis}. {interpretacion} (>0 colas pesadas, <0 colas ligeras respecto a normal).',
        },
        advertencias: [
            { condicion: 'n_menor_30', mensaje: 'Con n<30 el estimador de curtosis es muy sensible a valores extremos.' },
        ],
        referencia: [
            {
                autores:  'DeCarlo, L.T.',
                anio:     1997,
                titulo:   'On the meaning and use of kurtosis',
                revista:  'Psychological Methods',
                volumen:  2,
                paginas:  '292–307'
            }
        ],
    },

    'Error Estándar': {
        seccion:   'descriptiva',
        calcular:  'calcularErrorEstandar',
        formula:   'SE = s / √n',
        desc:      'Error estándar de la media. Estima la variabilidad de la media muestral. Base para intervalos de confianza.',
        icono:     '📏',
        minMuestra: 2,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico de al menos 2 observaciones',
        },
        salidas: ['se', 'de', 'n', 'media'],
        interpretacion: {
            plantilla: 'SE = {se}. A mayor n, menor SE: la media se vuelve más precisa con más datos.',
        },
        advertencias: [
            { condicion: 'n_menor_10', mensaje: 'SE con n<10 tiene alta incertidumbre. Amplíe la muestra si es posible.' },
        ],
        referencia: [
            {
                autores:  'Cumming, G., Fidler, F. & Vaux, D.L.',
                anio:     2007,
                titulo:   'Error bars in experimental biology',
                revista:  'J Cell Biol',
                volumen:  177,
                paginas:  '7–11'
            }
        ],
    },

    'Intervalos de Confianza': {
        seccion:   'descriptiva',
        calcular:  'calcularIntervalosConfianza',
        formula:   'IC = x̄ ± t(α/2) × SE',
        desc:      'Rango donde se espera que esté el parámetro poblacional con cierto nivel de confianza (90%, 95%, 99%).',
        icono:     '📊',
        minMuestra: 2,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico; nivel de confianza configurable (defecto 95%)',
        },
        salidas: ['ic90', 'ic95', 'ic99', 'media', 'se', 'n', 'gl'],
        interpretacion: {
            plantilla: 'IC {alfa}%: [{limInf}, {limSup}]. Si se repitiera el muestreo, el {alfa}% de los intervalos contendrían el verdadero parámetro.',
        },
        advertencias: [
            { condicion: 'no_normalidad',      mensaje: 'Los datos no son normales. Con n<30 el IC basado en t puede ser inexacto; considere Bootstrap.' },
            { condicion: 'n_menor_10',         mensaje: 'IC muy amplio con muestras pequeñas. Interprete con cautela.' },
        ],
        referencia: [
            {
                autores:  'Neyman, J.',
                anio:     1937,
                titulo:   'Outline of a theory of statistical estimation',
                revista:  'Phil Trans R Soc',
                volumen:  236,
                paginas:  '333–380'
            }
        ],
    },

    'Detección de Outliers': {
        seccion:   'descriptiva',
        calcular:  'detectarOutliers',
        formula:   'IQR: [Q1−1.5×IQR, Q3+1.5×IQR]',
        desc:      'Identifica valores atípicos usando IQR (Tukey fence) y Z-score (|z|>3). Útil para detectar errores o datos extremos.',
        icono:     '🎯',
        minMuestra: 4,

        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico de al menos 4 observaciones',
        },
        salidas: ['outliersIQR', 'outliersZScore', 'totalOutliers', 'limInfIQR', 'limSupIQR', 'n'],
        interpretacion: {
            plantilla: '{totalOutliers} outlier(s) detectados de {n} observaciones. Verifique si son errores de medición o datos legítimos.',
        },
        advertencias: [
            { condicion: 'distribucion_asimetrica', mensaje: 'Con distribuciones muy asimétricas el método IQR puede sobredetectar outliers en la cola larga.' },
            { condicion: 'n_menor_10',              mensaje: 'Con muestras muy pequeñas los métodos de detección tienen baja fiabilidad.' },
        ],
        referencia: [
            {
                autores:  'Tukey, J.W.',
                anio:     1977,
                titulo:   'Exploratory Data Analysis',
                revista:  'Addison-Wesley'
            }
        ],
    },

    // ════════════════════════════════════════
    // SECCIÓN: HIPÓTESIS — TESTS DE NORMALIDAD
    // ════════════════════════════════════════

    'Test de Normalidad': {
        seccion:   'hipotesis',
        calcular:  'calcularTestNormalidad',
        formula:   'JB = (n/6)(S² + K²/4)',
        desc:      'Jarque-Bera: Test basado en asimetría (S) y curtosis (K). H₀: los datos son normales. Aproximación χ²(2). Recomendado para n≥8.',
        icono:     '🔔',
        minMuestra: 3,
        edaKey:    'normalidad',

        hipotesis: {
            h0: 'Los datos siguen una distribución normal (asimetría=0, curtosis exceso=0)',
            h1: 'Los datos no siguen una distribución normal',
        },
        supuestos: [
            'Variable continua',
            'Observaciones independientes',
            'Recomendado n≥8 para aproximación χ² fiable',
        ],
        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico continuo',
        },
        salidas: ['JB', 'p', 'esNormal', 'skew', 'kurt', 'n'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        interpretacion: {
            significativo:   'Los datos no son normales (JB={JB}, p={p}). Use tests no paramétricos o transformaciones.',
            noSignificativo: 'No hay evidencia de no-normalidad (JB={JB}, p={p}). Puede asumir distribución normal.',
        },
        advertencias: [
            { condicion: 'n_menor_8',    mensaje: 'Con n<8 la aproximación χ² no es fiable. Use Shapiro-Wilk.' },
            { condicion: 'n_mayor_2000', mensaje: 'Con n muy grande JB detecta desviaciones triviales. Evalúe también la magnitud (skewness, kurtosis).' },
        ],
        referencia: [
            {
                autores:  'Jarque, C.M. & Bera, A.K.',
                anio:     1987,
                titulo:   'A test for normality of observations and regression residuals',
                revista:  'Int Stat Rev',
                volumen:  55,
                paginas:  '163–172'
            }
        ],
    },

    'Test de Shapiro-Wilk': {
        seccion:    'hipotesis',
        calcular:   'calcularShapiroWilk',
        formula:    'W = (Σaᵢx₍ᵢ₎)² / Σ(xᵢ − x̄)²',
        desc:       'Test más potente para muestras pequeñas (n<50). Compara cuantiles muestrales con cuantiles normales teóricos. Rango válido: 3≤n≤5000.',
        icono:      '🔔',
        minMuestra: 3,
        maxMuestra: 5000,
        edaKey:     'normalidadShapiro',

        hipotesis: {
            h0: 'Los datos provienen de una distribución normal',
            h1: 'Los datos no provienen de una distribución normal',
        },
        supuestos: [
            'Variable continua',
            'Observaciones independientes',
            'Tamaño de muestra 3 ≤ n ≤ 5000',
        ],
        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico continuo con 3–5000 observaciones',
        },
        salidas: ['W', 'p', 'esNormal', 'n'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'W',
            formula:  'W ∈ [0, 1]; valores cercanos a 1 indican normalidad',
            umbrales: { bueno: 0.95, aceptable: 0.90, pobre: 0.80 },
        },
        interpretacion: {
            significativo:   'Rechazada H₀: datos no normales (W={W}, p={p}). Use tests no paramétricos.',
            noSignificativo: 'No se rechaza H₀: datos compatibles con normalidad (W={W}, p={p}).',
        },
        alternativaNoParametrica: 'Mann-Whitney U, Wilcoxon',
        advertencias: [
            { condicion: 'n_mayor_5000', mensaje: 'Shapiro-Wilk no está definido para n>5000. Use Kolmogorov-Smirnov o Anderson-Darling.' },
            { condicion: 'n_mayor_50',   mensaje: 'Con n>50 la potencia es alta; diferencias triviales pueden ser significativas.' },
        ],
        referencia: [
            {
                autores:  'Shapiro, S.S. & Wilk, M.B.',
                anio:     1965,
                titulo:   'An analysis of variance test for normality',
                revista:  'Biometrika',
                volumen:  52,
                paginas:  '591–611'
            }
        ],
    },

    'Test de Kolmogorov-Smirnov': {
        seccion:   'hipotesis',
        calcular:  'calcularKolmogorovSmirnov',
        formula:   'D = max|Fₙ(x) − F(x)|',
        desc:      'Kolmogorov-Smirnov (Lilliefors): Compara la función de distribución empírica con la normal teórica. Corrección de Lilliefors para parámetros estimados. Sensible al centro de la distribución.',
        icono:     '🔔',
        minMuestra: 5,
        edaKey:    'normalidadKS',

        hipotesis: {
            h0: 'Los datos siguen una distribución normal (con corrección de Lilliefors)',
            h1: 'Los datos no siguen una distribución normal',
        },
        supuestos: [
            'Variable continua',
            'Observaciones independientes',
            'Parámetros estimados de la muestra (corrección Lilliefors aplicada)',
        ],
        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico continuo de al menos 5 observaciones',
        },
        salidas: ['D', 'p', 'esNormal', 'n', 'correctionLilliefors'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        interpretacion: {
            significativo:   'Los datos no son normales (D={D}, p={p}). La función de distribución empírica difiere significativamente de la normal.',
            noSignificativo: 'No hay evidencia de no-normalidad (D={D}, p={p}).',
        },
        advertencias: [
            { condicion: 'n_menor_20', mensaje: 'Con n<20 prefiera Shapiro-Wilk, que tiene mayor potencia.' },
            { condicion: 'datos_discretos', mensaje: 'K-S es para datos continuos; con datos discretos el p-value es conservador.' },
        ],
        referencia: [
            {
                autores:  'Lilliefors, H.W.',
                anio:     1967,
                titulo:   'On the Kolmogorov-Smirnov test for normality with mean and variance unknown',
                revista:  'JASA',
                volumen:  62,
                paginas:  '399–402'
            }
        ],
    },

    'Test de Anderson-Darling': {
        seccion:   'hipotesis',
        calcular:  'calcularAndersonDarling',
        formula:   'A² = −n − (1/n)Σ(2i−1)[ln(Fᵢ)+ln(1−Fₙ₊₁₋ᵢ)]',
        desc:      'Versión mejorada de K-S que pondera más las colas de la distribución. Más potente para detectar desviaciones en los extremos. Recomendado cuando se sospecha anomalías en colas. Requiere n≥8.',
        icono:     '🔔',
        minMuestra: 8,
        edaKey:    'normalidadAD',

        hipotesis: {
            h0: 'Los datos siguen una distribución normal',
            h1: 'Los datos no siguen una distribución normal (especialmente en las colas)',
        },
        supuestos: [
            'Variable continua',
            'Observaciones independientes',
            'n ≥ 8 para tablas de valores críticos fiables',
        ],
        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico continuo de al menos 8 observaciones',
        },
        salidas: ['A2', 'p', 'esNormal', 'n'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        interpretacion: {
            significativo:   'Los datos no son normales (A²={A2}, p={p}). Hay desviaciones significativas, especialmente en colas.',
            noSignificativo: 'No hay evidencia de no-normalidad (A²={A2}, p={p}).',
        },
        advertencias: [
            { condicion: 'n_menor_8', mensaje: 'Con n<8 los valores críticos de Anderson-Darling no son fiables.' },
        ],
        referencia: [
            {
                autores:  'Anderson, T.W. & Darling, D.A.',
                anio:     1952,
                titulo:   'Asymptotic theory of certain goodness of fit criteria',
                revista:  'Ann Math Statist',
                volumen:  23,
                paginas:  '193–212'
            }
        ],
    },

    "Test de D'Agostino-Pearson": {
        seccion:   'hipotesis',
        calcular:  'calcularDAgostinoPearson',
        formula:   'K² = Z_skew² + Z_kurt² ~ χ²(2)',
        desc:      "D'Agostino-Pearson (Omnibus): Combina tests de asimetría y curtosis en K² ~ χ²(2). Detecta desviaciones por forma (no solo por colas). Útil para distribuciones simétricas pero platicúrticas o leptocúrticas. Requiere n≥8.",
        icono:     '🔔',
        minMuestra: 8,
        edaKey:    'normalidadDP',

        hipotesis: {
            h0: 'Los datos son normales (asimetría poblacional=0 y curtosis poblacional=3)',
            h1: 'Los datos no son normales por forma (asimetría y/o curtosis distintas de la normal)',
        },
        supuestos: [
            'Variable continua',
            'Observaciones independientes',
            'n ≥ 8 (recomendado n ≥ 20 para buena aproximación)',
        ],
        inputs: {
            tipo:        'una-columna',
            grupos:      1,
            descripcion: 'Un vector numérico continuo de al menos 8 observaciones',
        },
        salidas: ['K2', 'p', 'esNormal', 'Zskew', 'Zkurt', 'skew', 'kurt', 'n'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        interpretacion: {
            significativo:   'Los datos no son normales por forma (K²={K2}, p={p}). Revise asimetría (Z={Zskew}) y curtosis (Z={Zkurt}).',
            noSignificativo: 'No hay evidencia de no-normalidad por forma (K²={K2}, p={p}).',
        },
        advertencias: [
            { condicion: 'n_menor_20', mensaje: 'Con n<20 la aproximación χ² de K² puede ser imprecisa.' },
        ],
        referencia: [
            {
                autores:  'D Agostino, R.B., Belanger, A. & D Agostino Jr, R.B.',
                anio:     1990,
                titulo:   'A suggestion for using powerful and informative tests of normality',
                revista:  'The American Statistician',
                volumen:  44,
                paginas:  '316–321'
            }
        ],
    },

    // ════════════════════════════════════════
    // SECCIÓN: HIPÓTESIS — OTRAS PRUEBAS
    // ════════════════════════════════════════

    'T-Test (una muestra)': {
        seccion:   'hipotesis',
        calcular:  'calcularTTestUnaMuestra',
        formula:   't = (x̄ − μ₀) / (s/√n)',
        desc:      'Compara la media muestral con un valor hipotético (μ₀). Prueba bilateral para detectar diferencias significativas.',
        icono:     '🔬',
        minMuestra: 2,

        hipotesis: {
            h0: 'La media poblacional es igual al valor de referencia (μ = μ₀)',
            h1: 'La media poblacional es diferente del valor de referencia (μ ≠ μ₀)',
        },
        supuestos: [
            'Variable continua',
            'Distribución aproximadamente normal (o n≥30 por TCL)',
            'Observaciones independientes',
        ],
        inputs: {
            tipo:        'una-columna-mas-valor',
            grupos:      1,
            descripcion: 'Un vector numérico y un valor de referencia μ₀',
        },
        salidas: ['t', 'gl', 'p', 'media', 'se', 'ic95', 'significativo', 'd'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral', 'unilateral-mayor', 'unilateral-menor'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  "d de Cohen",
            formula:  'd = (x̄ − μ₀) / s',
            umbrales: { pequeno: 0.2, mediano: 0.5, grande: 0.8 },
        },
        interpretacion: {
            significativo:   'La media ({media}) difiere significativamente de μ₀={mu0} (t={t}, gl={gl}, p={p}, d={d}).',
            noSignificativo: 'No hay diferencia significativa respecto a μ₀={mu0} (t={t}, gl={gl}, p={p}).',
        },
        alternativaNoParametrica: 'Wilcoxon (una muestra)',
        advertencias: [
            { condicion: 'no_normalidad', mensaje: 'Los datos no son normales. Con n≥30 el TCL protege el test; de lo contrario use Wilcoxon.' },
        ],
        referencia: [
            {
                autores:  'Student [W.S. Gosset]',
                anio:     1908,
                titulo:   'The probable error of a mean',
                revista:  'Biometrika',
                volumen:  6,
                paginas:  '1–25'
            }
        ],
    },

    'T-Test (dos muestras)': {
        seccion:   'hipotesis',
        calcular:  'calcularTTestDosMuestras',
        formula:   't = (x̄₁ − x̄₂) / √(s₁²/n₁ + s₂²/n₂)',
        desc:      'Compara las medias de dos grupos independientes usando Welch (sin asumir varianzas iguales).',
        icono:     '⚖️',
        minMuestra: 2,
        requiereDosColumnas: true,

        hipotesis: {
            h0: 'Las medias de los dos grupos son iguales (μ₁ = μ₂)',
            h1: 'Las medias de los dos grupos son diferentes (μ₁ ≠ μ₂)',
        },
        supuestos: [
            'Variable continua',
            'Muestras independientes entre sí',
            'Distribución aproximadamente normal en cada grupo (o n≥30 por TCL)',
            'Varianzas no necesariamente iguales (corrección de Welch aplicada)',
        ],
        inputs: {
            tipo:        'dos-columnas',
            grupos:      2,
            descripcion: 'Dos vectores numéricos independientes',
        },
        salidas: ['t', 'gl', 'p', 'media1', 'media2', 'diferencia', 'ic95', 'significativo', 'd'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral', 'unilateral-mayor', 'unilateral-menor'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  "d de Cohen",
            formula:  'd = (x̄₁ − x̄₂) / s_pooled',
            umbrales: { pequeno: 0.2, mediano: 0.5, grande: 0.8 },
        },
        interpretacion: {
            significativo:   'Las medias difieren significativamente (t={t}, gl={gl}, p={p}, d={d}). Diferencia: {diferencia}.',
            noSignificativo: 'No hay diferencia significativa entre medias (t={t}, gl={gl}, p={p}).',
        },
        alternativaNoParametrica: 'Mann-Whitney U',
        advertencias: [
            { condicion: 'no_normalidad_alguno', mensaje: 'Al menos un grupo no es normal. Considere Mann-Whitney U.' },
            { condicion: 'n_muy_desigual',       mensaje: 'Tamaños muy desiguales pueden afectar la robustez incluso con Welch.' },
        ],
        referencia: [
            {
                autores:  'Welch, B.L.',
                anio:     1947,
                titulo:   'The generalization of Students problem when several different population variances are involved',
                revista:  'Biometrika',
                volumen:  34,
                paginas:  '28–35'
            }
        ],
    },

    'ANOVA One-Way': {
        seccion:   'hipotesis',
        calcular:  'calcularANOVAOneWay',
        formula:   'F = MSB / MSW',
        desc:      'Compara medias de 3+ grupos. Si F es significativo, al menos una media difiere de las demás.',
        icono:     '📊',
        minMuestra: 2,

        hipotesis: {
            h0: 'Las medias de todos los grupos son iguales (μ₁ = μ₂ = ... = μₖ)',
            h1: 'Al menos una media difiere de las demás',
        },
        supuestos: [
            'Variable dependiente continua',
            'Grupos independientes',
            'Distribución normal dentro de cada grupo',
            'Homogeneidad de varianzas (homocedasticidad)',
        ],
        inputs: {
            tipo:        'una-columna-grupo',
            grupos:      'k≥3',
            descripcion: 'Variable numérica + variable de grupo categórica (k ≥ 3 niveles)',
        },
        salidas: ['F', 'glEntre', 'glDentro', 'p', 'MSB', 'MSW', 'SSB', 'SSW', 'significativo', 'etaCuadrado'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'η² (eta cuadrado)',
            formula:  'η² = SSB / SST',
            umbrales: { pequeno: 0.01, mediano: 0.06, grande: 0.14 },
        },
        interpretacion: {
            significativo:   'Al menos una media difiere (F={F}, gl={glEntre},{glDentro}, p={p}, η²={etaCuadrado}). Realice pruebas post-hoc.',
            noSignificativo: 'No hay diferencias significativas entre grupos (F={F}, p={p}).',
        },
        alternativaNoParametrica: 'Kruskal-Wallis',
        advertencias: [
            { condicion: 'no_homocedasticidad', mensaje: 'Las varianzas no son homogéneas (Levene significativo). Considere Welch ANOVA o Kruskal-Wallis.' },
            { condicion: 'no_normalidad',       mensaje: 'Algún grupo no es normal. Considere Kruskal-Wallis.' },
        ],
        referencia: [
            {
                autores:  'Fisher, R.A.',
                anio:     1925,
                titulo:   'Statistical Methods for Research Workers',
                revista:  'Oliver & Boyd'
            }
        ],
    },

    'ANOVA Two-Way': {
        seccion:   'hipotesis',
        calcular:  'calcularANOVATwoWay',
        formula:   'F₁ = MSF₁/MSE, F₂ = MSF₂/MSE',
        desc:      'Análisis de varianza con dos factores simultáneos. Evalúa efectos principales de cada factor.',
        icono:     '📐',
        minMuestra: 2,

        hipotesis: {
            h0: 'Ni el factor A, ni el factor B, ni su interacción afectan la media de la variable dependiente',
            h1: 'Al menos un efecto principal o la interacción AxB es significativo',
        },
        supuestos: [
            'Variable dependiente continua',
            'Grupos independientes',
            'Normalidad dentro de cada celda',
            'Homogeneidad de varianzas entre celdas',
            'Diseño balanceado (misma n por celda) para mayor robustez',
        ],
        inputs: {
            tipo:        'una-columna-dos-factores',
            grupos:      'k×j',
            descripcion: 'Variable numérica + dos variables categóricas de factor',
        },
        salidas: ['FA', 'FB', 'FAB', 'pA', 'pB', 'pAB', 'etaCuadradoA', 'etaCuadradoB', 'etaCuadradoAB', 'significativoA', 'significativoB', 'significativoAB'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'η² parcial por factor',
            formula:  'η²_A = SSA / (SSA + SSE)',
            umbrales: { pequeno: 0.01, mediano: 0.06, grande: 0.14 },
        },
        interpretacion: {
            plantilla: 'Factor A: F={FA}, p={pA}. Factor B: F={FB}, p={pB}. Interacción AxB: F={FAB}, p={pAB}.',
        },
        alternativaNoParametrica: 'Friedman (para diseños de bloques)',
        advertencias: [
            { condicion: 'diseno_desbalanceado', mensaje: 'Diseño no balanceado: los SS de tipo III son los adecuados.' },
            { condicion: 'interaccion_significativa', mensaje: 'Con interacción significativa, los efectos principales deben interpretarse con precaución.' },
        ],
        referencia: [
            {
                autores:  'Fisher, R.A.',
                anio:     1925,
                titulo:   'Statistical Methods for Research Workers',
                revista:  'Oliver & Boyd'
            }
        ],
    },

    'Chi-Cuadrado': {
        seccion:   'hipotesis',
        calcular:  'calcularChiCuadrado',
        formula:   'χ² = Σ(O − E)² / E',
        desc:      'Prueba de independencia para variables categóricas. Compara frecuencias observadas vs esperadas.',
        icono:     '📋',
        minMuestra: 5,

        hipotesis: {
            h0: 'Las dos variables categóricas son independientes',
            h1: 'Las dos variables categóricas están asociadas',
        },
        supuestos: [
            'Variables categóricas (nominales u ordinales)',
            'Observaciones independientes',
            'Frecuencias esperadas ≥ 5 en al menos el 80% de las celdas',
            'Ninguna frecuencia esperada = 0',
        ],
        inputs: {
            tipo:        'tabla-contingencia',
            grupos:      2,
            descripcion: 'Tabla de contingencia o dos vectores categóricos',
        },
        salidas: ['chi2', 'gl', 'p', 'V', 'frecEsperadas', 'significativo'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'V de Cramér',
            formula:  'V = √(χ²/n·min(r−1,c−1))',
            umbrales: { pequeno: 0.1, mediano: 0.3, grande: 0.5 },
        },
        interpretacion: {
            significativo:   'Hay asociación significativa entre las variables (χ²={chi2}, gl={gl}, p={p}, V={V}).',
            noSignificativo: 'No hay evidencia de asociación entre las variables (χ²={chi2}, gl={gl}, p={p}).',
        },
        advertencias: [
            { condicion: 'frec_esperada_menor_5', mensaje: 'Hay celdas con frecuencia esperada <5. Considere la prueba exacta de Fisher o combinar categorías.' },
            { condicion: 'tabla_2x2',             mensaje: 'Para tablas 2×2 con n<20, use la prueba exacta de Fisher.' },
        ],
        referencia: [
            {
                autores:  'Pearson, K.',
                anio:     1900,
                titulo:   'On the criterion that a given system of deviations from the probable in the case of a correlated system of variables is such that it can be reasonably supposed to have arisen from random sampling',
                revista:  'Phil Mag',
                volumen:  50,
                paginas:  '157–175'
            }
        ],
    },

    'Test TOST (Equivalencia)': {
        seccion:   'hipotesis',
        calcular:  'calcularTOST',
        formula:   'Equivalencia: |δ| < Δ (delta máximo)',
        desc:      'Test de equivalencia Two One-Sided Tests. Determina si la diferencia entre grupos es menor a un umbral predefinido (Δ).',
        icono:     '🔄',
        minMuestra: 2,

        hipotesis: {
            h0: 'La diferencia entre grupos supera el umbral de equivalencia (|μ₁−μ₂| ≥ Δ)',
            h1: 'Los grupos son equivalentes (|μ₁−μ₂| < Δ)',
        },
        supuestos: [
            'Variable continua',
            'Distribución aproximadamente normal',
            'El umbral de equivalencia (Δ) debe especificarse a priori con justificación clínica o práctica',
        ],
        inputs: {
            tipo:        'dos-columnas-mas-umbral',
            grupos:      2,
            descripcion: 'Dos vectores numéricos y un umbral de equivalencia Δ definido por el usuario',
        },
        salidas: ['tInferior', 'tSuperior', 'pInferior', 'pSuperior', 'pTOST', 'ic90', 'esEquivalente', 'delta'],
        tipoTest: {
            defecto:  'dos-unilaterales',
            opciones: ['dos-unilaterales'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  "d de Cohen",
            formula:  'd = (x̄₁ − x̄₂) / s_pooled',
            umbrales: { pequeno: 0.2, mediano: 0.5, grande: 0.8 },
        },
        interpretacion: {
            significativo:   'Los grupos son equivalentes: la diferencia cae dentro de [−{delta}, +{delta}] (p={pTOST}, IC90%: {ic90}).',
            noSignificativo: 'No se puede concluir equivalencia: la diferencia podría superar el umbral (p={pTOST}).',
        },
        advertencias: [
            { condicion: 'delta_no_justificado', mensaje: 'El umbral Δ debe definirse con criterios sustantivos antes de ver los datos.' },
            { condicion: 'n_insuficiente',       mensaje: 'Con muestras pequeñas el test TOST tiene poca potencia para detectar equivalencia.' },
        ],
        referencia: [
            {
                autores:  'Schuirmann, D.J.',
                anio:     1987,
                titulo:   'A comparison of the two one-sided tests procedure and the power approach for assessing the equivalence of average bioavailability',
                revista:  'J Pharmacokinet Biopharm',
                volumen:  15,
                paginas:  '657–680'
            }
        ],
    },

    // ════════════════════════════════════════
    // SECCIÓN: CORRELACIÓN
    // ════════════════════════════════════════

    'Correlación Pearson': {
        seccion:   'correlacion',
        calcular:  'calcularCorrelacionPearson',
        formula:   'r = cov(X,Y)/(σx × σy)',
        desc:      'Mide la relación lineal entre dos variables. Valores entre −1 y 1. Cercano a ±1 indica fuerte relación lineal.',
        icono:     '🔗',
        minMuestra: 2,
        requiereDosColumnas: true,

        hipotesis: {
            h0: 'La correlación poblacional es cero (ρ = 0)',
            h1: 'La correlación poblacional es distinta de cero (ρ ≠ 0)',
        },
        supuestos: [
            'Ambas variables continuas',
            'Relación lineal entre X e Y',
            'Normalidad bivariada (aproximada)',
            'Observaciones independientes',
            'Sin outliers influyentes',
        ],
        inputs: {
            tipo:        'dos-columnas',
            grupos:      2,
            descripcion: 'Dos vectores numéricos del mismo largo',
        },
        salidas: ['r', 't', 'gl', 'p', 'ic95', 'significativo', 'n'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral', 'unilateral-mayor', 'unilateral-menor'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'r de Pearson',
            formula:  'r ∈ [−1, 1]',
            umbrales: { pequeno: 0.1, mediano: 0.3, grande: 0.5 },
        },
        interpretacion: {
            significativo:   'Correlación lineal significativa (r={r}, p={p}). {magnitud}.',
            noSignificativo: 'Sin evidencia de correlación lineal (r={r}, p={p}).',
        },
        alternativaNoParametrica: 'Correlación Spearman',
        advertencias: [
            { condicion: 'outliers_detectados', mensaje: 'Hay outliers que pueden inflar o deflactar r artificialmente.' },
            { condicion: 'no_linealidad',       mensaje: 'La relación no parece lineal. Considere Spearman o transformación de variables.' },
        ],
        referencia: [
            {
                autores:  'Pearson, K.',
                anio:     1895,
                titulo:   'Notes on regression and inheritance in the case of two parents',
                revista:  'Proc R Soc Lond',
                volumen:  '58',
                paginas:  '240–242',
            }
        ],
    },

    'Correlación Spearman': {
        seccion:   'correlacion',
        calcular:  'calcularCorrelacionSpearman',
        formula:   'ρ = correlación de Pearson sobre rangos',
        desc:      'Mide la relación monotónica entre dos variables basada en rangos. Menos sensible a outliers que Pearson.',
        icono:     '🔗',
        minMuestra: 3,
        requiereDosColumnas: true,

        hipotesis: {
            h0: 'No existe relación monotónica entre las variables (ρ = 0)',
            h1: 'Existe relación monotónica entre las variables (ρ ≠ 0)',
        },
        supuestos: [
            'Variables al menos ordinales',
            'Relación monotónica (no necesariamente lineal)',
            'Observaciones independientes',
        ],
        inputs: {
            tipo:        'dos-columnas',
            grupos:      2,
            descripcion: 'Dos vectores numéricos u ordinales del mismo largo',
        },
        salidas: ['rho', 't', 'gl', 'p', 'significativo', 'n'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral', 'unilateral-mayor', 'unilateral-menor'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'ρ de Spearman',
            formula:  'ρ ∈ [−1, 1]',
            umbrales: { pequeno: 0.1, mediano: 0.3, grande: 0.5 },
        },
        interpretacion: {
            significativo:   'Relación monotónica significativa (ρ={rho}, p={p}). {magnitud}.',
            noSignificativo: 'Sin evidencia de relación monotónica (ρ={rho}, p={p}).',
        },
        alternativaParametrica: 'Correlación Pearson',
        advertencias: [
            { condicion: 'muchos_empates', mensaje: 'Muchos valores repetidos afectan la precisión de ρ. Considere Kendall τ.' },
        ],
        referencia: [
            {
                autores:  'Spearman, C.',
                anio:     1904,
                titulo:   'The proof and measurement of association between two things',
                revista:  'Am J Psychol',
                volumen:  '15',
                paginas:  '72–101',
            }
        ],
    },

    'Correlación Kendall Tau': {
        seccion:   'correlacion',
        calcular:  'calcularCorrelacionKendall',
        formula:   'τ = (C − D) / √[(n₀−n₁)(n₀−n₂)]',
        desc:      'Mide la asociación ordinal entre dos variables. Más robusta que Spearman para datos con muchos empates.',
        icono:     '🔗',
        minMuestra: 3,
        requiereDosColumnas: true,

        hipotesis: {
            h0: 'No existe asociación ordinal entre las variables (τ = 0)',
            h1: 'Existe asociación ordinal entre las variables (τ ≠ 0)',
        },
        supuestos: [
            'Variables al menos ordinales',
            'Observaciones independientes',
        ],
        inputs: {
            tipo:        'dos-columnas',
            grupos:      2,
            descripcion: 'Dos vectores ordinales o numéricos del mismo largo',
        },
        salidas: ['tau', 'z', 'p', 'concordantes', 'discordantes', 'significativo', 'n'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral', 'unilateral-mayor', 'unilateral-menor'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'τ de Kendall',
            formula:  'τ ∈ [−1, 1]',
            umbrales: { pequeno: 0.1, mediano: 0.3, grande: 0.5 },
        },
        interpretacion: {
            significativo:   'Asociación ordinal significativa (τ={tau}, p={p}). {magnitud}.',
            noSignificativo: 'Sin evidencia de asociación ordinal (τ={tau}, p={p}).',
        },
        alternativaParametrica: 'Correlación Pearson',
        advertencias: [
            { condicion: 'n_grande', mensaje: 'Con n>100 Spearman es equivalente y más eficiente computacionalmente.' },
        ],
        referencia: [
            {
                autores:  "Kendall, M.G.",
                anio:     1938,
                titulo:   'A new measure of rank correlation',
                revista:  'Biometrika',
                volumen:  '30',
                paginas:  '81–93',
            }
        ],
    },

    'Covarianza': {
        seccion:   'correlacion',
        calcular:  'calcularCovarianza',
        formula:   'Cov(X,Y) = Σ(xi−x̄)(yi−ȳ) / (n−1)',
        desc:      'Mide la tendencia de dos variables a variar juntas. Positiva: se mueven en la misma dirección; negativa: en direcciones opuestas.',
        icono:     '📐',
        minMuestra: 2,
        requiereDosColumnas: true,

        inputs: {
            tipo:        'dos-columnas',
            grupos:      2,
            descripcion: 'Dos vectores numéricos del mismo largo',
        },
        salidas: ['covarianza', 'n', 'mediaX', 'mediaY'],
        interpretacion: {
            plantilla: 'Cov(X,Y) = {covarianza}. El signo indica dirección; la magnitud depende de las unidades (use r para comparaciones).',
        },
        advertencias: [
            { condicion: 'unidades_diferentes', mensaje: 'La covarianza depende de las unidades de X e Y. Para comparar con otras variables, use la correlación de Pearson.' },
        ],
        referencia: [
            {
                autores:  'Freedman, D., Pisani, R. & Purves, R.',
                anio:     2007,
                titulo:   'Statistics (4ª ed.)',
                revista:  'W.W. Norton',
            }
        ],
    },

    // ════════════════════════════════════════
    // SECCIÓN: REGRESIÓN
    // ════════════════════════════════════════

    'Regresión Lineal Simple': {
        seccion:   'regresion',
        calcular:  'calcularRegresionLinealSimple',
        formula:   'Y = a + bX',
        desc:      'Modelo predictivo lineal simple. Estima la variable dependiente Y a partir de una variable independiente X usando mínimos cuadrados.',
        icono:     '📈',
        minMuestra: 3,
        requiereDosColumnas: true,

        hipotesis: {
            h0: 'La pendiente es cero (β₁ = 0): X no predice linealmente a Y',
            h1: 'La pendiente es distinta de cero (β₁ ≠ 0)',
        },
        supuestos: [
            'Relación lineal entre X e Y',
            'Residuos normalmente distribuidos',
            'Homocedasticidad (varianza constante de residuos)',
            'Independencia de residuos',
            'Sin multicolinealidad (no aplica en simple)',
        ],
        inputs: {
            tipo:        'dos-columnas',
            grupos:      2,
            descripcion: 'Vector X (predictor) y vector Y (respuesta) del mismo largo',
        },
        salidas: ['a', 'b', 'r2', 'r2ajustado', 'F', 'p', 'se_b', 't_b', 'residuos', 'predicciones'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'R²',
            formula:  'R² = 1 − SSres/SStot',
            umbrales: { pequeno: 0.02, mediano: 0.13, grande: 0.26 },
        },
        interpretacion: {
            significativo:   'Y = {a} + {b}·X explica el {r2pct}% de la varianza de Y (R²={r2}, F={F}, p={p}).',
            noSignificativo: 'El modelo no es significativo (F={F}, p={p}). X no predice linealmente a Y.',
        },
        alternativaNoParametrica: 'Regresión de Theil-Sen',
        advertencias: [
            { condicion: 'no_normalidad_residuos', mensaje: 'Los residuos no son normales. Las inferencias sobre β pueden ser inexactas.' },
            { condicion: 'heterocedasticidad',      mensaje: 'Varianza no constante en residuos (heterocedasticidad). Use errores estándar robustos.' },
            { condicion: 'outliers_influyentes',     mensaje: 'Hay puntos con alta influencia (Cook\'s D). Verifique su validez.' },
        ],
        referencia: [
            {
                autores:  'Galton, F.',
                anio:     1886,
                titulo:   'Regression towards mediocrity in hereditary stature',
                revista:  'J Anthropological Inst',
                volumen:  '15',
                paginas:  '246–263',
            }
        ],
    },

    'Regresión Lineal Múltiple': {
        seccion:   'regresion',
        calcular:  'calcularRegresionLinealMultiple',
        formula:   'Y = β₀ + β₁X₁ + ... + βₖXₖ',
        desc:      'Modelo con múltiples predictores. Estima Y usando múltiples variables independientes simultáneamente.',
        icono:     '📊',
        minMuestra: 5,

        hipotesis: {
            h0: 'Ningún predictor tiene efecto sobre Y (todos los βᵢ = 0)',
            h1: 'Al menos un predictor tiene efecto significativo sobre Y',
        },
        supuestos: [
            'Relación lineal entre cada Xᵢ e Y (controlando el resto)',
            'Residuos normalmente distribuidos',
            'Homocedasticidad',
            'Independencia de residuos',
            'Sin multicolinealidad severa entre predictores (VIF < 10)',
        ],
        inputs: {
            tipo:        'multiples-columnas',
            grupos:      'k+1',
            descripcion: 'Variables predictoras X₁…Xₖ y variable respuesta Y',
        },
        salidas: ['betas', 'r2', 'r2ajustado', 'F', 'p', 'vif', 'residuos', 'predicciones', 'aic', 'bic'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'R² ajustado',
            formula:  'R²adj = 1 − (1−R²)(n−1)/(n−k−1)',
            umbrales: { pequeno: 0.02, mediano: 0.13, grande: 0.26 },
        },
        interpretacion: {
            plantilla: 'El modelo explica el {r2ajpct}% de la varianza (R²adj={r2ajustado}, F={F}, p={p}).',
        },
        advertencias: [
            { condicion: 'vif_alto',           mensaje: 'VIF>10 en algún predictor: multicolinealidad severa. Considere eliminar variables redundantes.' },
            { condicion: 'n_a_predictores',    mensaje: 'Regla general: al menos 10–20 observaciones por predictor.' },
            { condicion: 'heterocedasticidad', mensaje: 'Residuos heterocedásticos detectados. Use errores estándar robustos (HC3).' },
        ],
        referencia: [
            {
                autores:  'Draper, N.R. & Smith, H.',
                anio:     1998,
                titulo:   'Applied Regression Analysis',
                editorial: 'Wiley',
                edicion: '3ª ed.',
            }
        ],
    },

    'Regresión Polinomial': {
        seccion:   'regresion',
        calcular:  'calcularRegresionPolinomial',
        formula:   'Y = a₀ + a₁X + a₂X² + ...',
        desc:      'Modelo de regresión no lineal que ajusta un polinomio de grado especificado a los datos.',
        icono:     '📈',
        minMuestra: 4,
        requiereDosColumnas: true,

        hipotesis: {
            h0: 'Los términos polinomiales de grado >1 no mejoran el ajuste (βᵢ = 0 para i>1)',
            h1: 'Al menos un término polinomial contribuye significativamente al modelo',
        },
        supuestos: [
            'Relación curvilínea entre X e Y',
            'Residuos normalmente distribuidos',
            'Homocedasticidad',
            'Independencia de residuos',
        ],
        inputs: {
            tipo:        'dos-columnas-mas-grado',
            grupos:      2,
            descripcion: 'Vector X y vector Y; grado del polinomio configurable (defecto 2)',
        },
        salidas: ['coeficientes', 'r2', 'r2ajustado', 'F', 'p', 'residuos', 'predicciones', 'grado'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'R² ajustado',
            formula:  'R²adj = 1 − (1−R²)(n−1)/(n−k−1)',
            umbrales: { pequeno: 0.02, mediano: 0.13, grande: 0.26 },
        },
        interpretacion: {
            plantilla: 'Polinomio grado {grado}: R²={r2}, R²adj={r2ajustado}. Compare con modelo lineal usando F-test de cambio en R².',
        },
        advertencias: [
            { condicion: 'grado_alto',    mensaje: 'Grados >4 pueden producir sobreajuste. Valide con datos de prueba o validación cruzada.' },
            { condicion: 'extrapolacion', mensaje: 'Los polinomios oscilan fuertemente fuera del rango de entrenamiento. No extrapole.' },
        ],
        referencia: [
            {
                autores:  'Draper, N.R. & Smith, H.',
                anio:     1998,
                titulo:   'Applied Regression Analysis',
                editorial: 'Wiley',
                edicion: '3ª ed.',
            }
        ],
    },

    'Regresión Logística': {
        seccion:   'regresion',
        calcular:  'calcularRegresionLogistica',
        formula:   'P = 1/(1+e^(−z))',
        desc:      'Modelo de clasificación binaria. Estima la probabilidad de pertenencia a una clase (0/1).',
        icono:     '🔐',
        minMuestra: 10,

        hipotesis: {
            h0: 'Los predictores no mejoran la predicción respecto al modelo nulo (todos los βᵢ = 0)',
            h1: 'Al menos un predictor mejora la predicción de la clase',
        },
        supuestos: [
            'Variable dependiente binaria (0/1)',
            'Independencia de observaciones',
            'Sin multicolinealidad severa entre predictores',
            'Relación lineal entre log-odds y predictores',
            'Tamaño de muestra suficiente (≥10 eventos por variable)',
        ],
        inputs: {
            tipo:        'multiples-columnas',
            grupos:      'k+1',
            descripcion: 'Variables predictoras Xᵢ y variable dependiente binaria Y (0/1)',
        },
        salidas: ['betas', 'oddsRatios', 'ic95OR', 'p', 'devianza', 'auc', 'accuraccy', 'sensibilidad', 'especificidad', 'aic'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  "AUC-ROC (área bajo la curva)",
            formula:  'AUC ∈ [0.5, 1]',
            umbrales: { pobre: 0.6, aceptable: 0.7, bueno: 0.8, excelente: 0.9 },
        },
        interpretacion: {
            plantilla: 'AUC={auc}. OR={oddsRatios} por variable. Devianza nula vs residual: χ²={chi2dev}, p={pdev}.',
        },
        advertencias: [
            { condicion: 'clase_desbalanceada', mensaje: 'Las clases están desbalanceadas. Accuracy puede ser engañosa; evalúe F1-score o AUC.' },
            { condicion: 'separacion_perfecta', mensaje: 'Separación perfecta detectada: los coeficientes tienden a infinito. Use penalización (Ridge logístico).' },
        ],
        referencia: [
            {
                autores:  'Cox, D.R.',
                anio:     1958,
                titulo:   'The regression analysis of binary sequences',
                revista:  'J R Stat Soc B',
                volumen:  '20(2)',
                paginas:  '215–242',
            }
        ],
    },

    'RMSE': {
        seccion:   'regresion',
        calcular:  'calcularRMSE',
        formula:   'RMSE = √[Σ(obs−pred)²/n]',
        desc:      'Error cuadrático medio. Mide la diferencia promedio entre valores observados y predichos en las mismas unidades que Y.',
        icono:     '📏',
        minMuestra: 2,

        inputs: {
            tipo:        'dos-columnas',
            grupos:      2,
            descripcion: 'Vector de valores observados y vector de predicciones del mismo largo',
        },
        salidas: ['rmse', 'mse', 'n'],
        interpretacion: {
            plantilla: 'RMSE = {rmse} (en unidades de Y). Penaliza errores grandes más que MAE.',
        },
        advertencias: [
            { condicion: 'outliers_residuos', mensaje: 'RMSE es sensible a outliers en los residuos. Complemente con MAE para una evaluación robusta.' },
        ],
        referencia: [
            {
                autores:  'Hyndman, R.J. & Koehler, A.B.',
                anio:     2006,
                titulo:   'Another look at measures of forecast accuracy',
                revista:  'Int J Forecasting',
                volumen:  '22(4)',
                paginas:  '679–688',
            }
        ],
    },

    'MAE': {
        seccion:   'regresion',
        calcular:  'calcularMAE',
        formula:   'MAE = Σ|obs−pred|/n',
        desc:      'Error absoluto medio. Más robusto a outliers que RMSE. Fácil de interpretar en las unidades de Y.',
        icono:     '📏',
        minMuestra: 2,

        inputs: {
            tipo:        'dos-columnas',
            grupos:      2,
            descripcion: 'Vector de valores observados y vector de predicciones del mismo largo',
        },
        salidas: ['mae', 'n'],
        interpretacion: {
            plantilla: 'MAE = {mae} (en unidades de Y). Error absoluto promedio de las predicciones.',
        },
        advertencias: [
            { condicion: 'comparar_con_rmse', mensaje: 'Si MAE << RMSE, hay outliers grandes en los residuos que inflan el RMSE.' },
        ],
        referencia: [
            {
                autores:  'Willmott, C.J. & Matsuura, K.',
                anio:     2005,
                titulo:   'Advantages of the mean absolute error (MAE) over the root mean square error (RMSE)',
                revista:  'Climate Research',
                volumen:  '30(1)',
                paginas:  '79–82',
            }
        ],
    },

    'R² (Coef. Determinación)': {
        seccion:   'regresion',
        calcular:  'calcularR2',
        formula:   'R² = 1 − SSres/SStot',
        desc:      'Proporción de la varianza de Y explicada por el modelo. R²=1: ajuste perfecto, R²=0: no mejor que la media.',
        icono:     '📊',
        minMuestra: 2,

        inputs: {
            tipo:        'dos-columnas',
            grupos:      2,
            descripcion: 'Vector de valores observados y vector de predicciones',
        },
        salidas: ['r2', 'r2ajustado', 'SSres', 'SStot', 'n', 'k'],
        interpretacion: {
            plantilla: 'R² = {r2}: el modelo explica el {r2pct}% de la varianza. R²adj = {r2ajustado} corrige por el número de predictores.',
        },
        advertencias: [
            { condicion: 'r2_alto_sin_sentido', mensaje: 'R² alto no garantiza que el modelo sea correcto; verifique supuestos de residuos.' },
            { condicion: 'comparar_modelos',     mensaje: 'Para comparar modelos con distinto k, use R² ajustado, AIC o BIC.' },
        ],
        referencia: [
            {
                autores:  'Wright, S.',
                anio:     1921,
                titulo:   'Correlation and causation',
                revista:  'J Agric Res',
                volumen:  '20(7)',
                paginas:  '557–585',
            }
        ],
    },

    // ════════════════════════════════════════
    // SECCIÓN: NO PARAMÉTRICOS
    // ════════════════════════════════════════

    'Mann-Whitney U': {
        seccion:   'noParametricos',
        calcular:  'calcularMannWhitney',
        formula:   'U = min(U₁, U₂)',
        desc:      'Alternativa no-paramétrica al t-test independiente. Compara distribuciones de dos grupos sin asumir normalidad.',
        icono:     '⚖️',
        minMuestra: 3,

        hipotesis: {
            h0: 'Las distribuciones de los dos grupos son iguales (ninguno tiende a producir valores mayores)',
            h1: 'Las distribuciones de los dos grupos difieren',
        },
        supuestos: [
            'Variable al menos ordinal',
            'Muestras independientes entre sí',
            'Misma forma de distribución en ambos grupos (para interpretar como diferencia de medianas)',
        ],
        inputs: {
            tipo:        'dos-grupos',
            grupos:      2,
            descripcion: 'Dos vectores numéricos independientes',
        },
        salidas: ['U', 'U1', 'U2', 'z', 'p', 'r', 'n1', 'n2', 'significativo'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral', 'unilateral-mayor', 'unilateral-menor'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'r (rank-biserial)',
            formula:  'r = Z / √N',
            umbrales: { pequeno: 0.1, mediano: 0.3, grande: 0.5 },
        },
        interpretacion: {
            significativo:   'Diferencia significativa entre grupos (U={U}, p={p}, r={r}).',
            noSignificativo: 'Sin evidencia de diferencia entre grupos (U={U}, p={p}).',
        },
        alternativaParametrica: 'T-Test (dos muestras)',
        advertencias: [
            { condicion: 'n_menor_20',    mensaje: 'Con n<20 la aproximación normal puede ser imprecisa; se recomienda el p-value exacto.' },
            { condicion: 'muchos_empates', mensaje: 'Muchos empates detectados: Z fue corregido automáticamente por empates.' },
        ],
        referencia: [
            {
                autores:  'Mann, H.B. & Whitney, D.R.',
                anio:     1947,
                titulo:   'On a test of whether one of two random variables is stochastically larger than the other',
                revista:  'Ann Math Statist',
                volumen:  '18(1)',
                paginas:  '50–60',
            }
        ],
    },

    'Kruskal-Wallis': {
        seccion:   'noParametricos',
        calcular:  'calcularKruskalWallis',
        formula:   'H = [12/(N(N+1))]Σ(Rᵢ²/nᵢ) − 3(N+1)',
        desc:      'Alternativa no-paramétrica al ANOVA. Compara distribuciones de 3+ grupos sin asumir normalidad.',
        icono:     '📊',
        minMuestra: 3,

        hipotesis: {
            h0: 'Las distribuciones de todos los grupos son iguales',
            h1: 'Al menos una distribución difiere de las demás',
        },
        supuestos: [
            'Variable al menos ordinal',
            'Grupos independientes',
            'Al menos 3 grupos',
            'Misma forma de distribución en todos los grupos (para interpretar medianas)',
        ],
        inputs: {
            tipo:        'una-columna-grupo',
            grupos:      'k≥3',
            descripcion: 'Variable numérica + variable de grupo categórica (k ≥ 3)',
        },
        salidas: ['H', 'gl', 'p', 'etaCuadrado', 'significativo', 'n'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'η² (eta cuadrado)',
            formula:  'η² = (H − k + 1) / (n − k)',
            umbrales: { pequeno: 0.01, mediano: 0.06, grande: 0.14 },
        },
        interpretacion: {
            significativo:   'Al menos una distribución difiere (H={H}, gl={gl}, p={p}, η²={etaCuadrado}). Realice comparaciones post-hoc (Dunn).',
            noSignificativo: 'Sin evidencia de diferencia entre grupos (H={H}, gl={gl}, p={p}).',
        },
        alternativaParametrica: 'ANOVA One-Way',
        advertencias: [
            { condicion: 'muchos_empates', mensaje: 'Hay muchos empates; H fue corregido por empates automáticamente.' },
            { condicion: 'n_por_grupo_menor_5', mensaje: 'Grupos con menos de 5 observaciones reducen la potencia del test.' },
        ],
        referencia: [
            {
                autores:  'Kruskal, W.H. & Wallis, W.A.',
                anio:     1952,
                titulo:   'Use of ranks in one-criterion variance analysis',
                revista:  'JASA',
                volumen:  '47(260)',
                paginas:  '583–621',
            }
        ],
    },

    'Wilcoxon': {
        seccion:   'noParametricos',
        calcular:  'calcularWilcoxon',
        formula:   'W = suma de rangos con signo',
        desc:      'Test de rangos con signo para muestras pareadas. Alternativa no-paramétrica al t-test pareado.',
        icono:     '📊',
        minMuestra: 5,

        hipotesis: {
            h0: 'La mediana de las diferencias pareadas es cero',
            h1: 'La mediana de las diferencias pareadas es distinta de cero',
        },
        supuestos: [
            'Variable continua o al menos ordinal',
            'Pares de observaciones relacionadas',
            'Distribución de diferencias simétrica alrededor de la mediana',
        ],
        inputs: {
            tipo:        'dos-columnas-pareadas',
            grupos:      2,
            descripcion: 'Dos vectores numéricos del mismo largo con observaciones emparejadas',
        },
        salidas: ['W', 'z', 'p', 'r', 'n', 'significativo'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral', 'unilateral-mayor', 'unilateral-menor'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'r (rank-biserial)',
            formula:  'r = Z / √n',
            umbrales: { pequeno: 0.1, mediano: 0.3, grande: 0.5 },
        },
        interpretacion: {
            significativo:   'La mediana de diferencias es significativamente distinta de cero (W={W}, p={p}, r={r}).',
            noSignificativo: 'Sin evidencia de diferencia sistemática entre pares (W={W}, p={p}).',
        },
        alternativaParametrica: 'T-Test (una muestra sobre diferencias)',
        advertencias: [
            { condicion: 'n_menor_10',     mensaje: 'Con n<10 use el p-value exacto; la aproximación normal puede ser imprecisa.' },
            { condicion: 'muchos_empates', mensaje: 'Empates entre diferencias reducen la potencia. Se aplicó corrección.' },
        ],
        referencia: [
            {
                autores:  'Wilcoxon, F.',
                anio:     1945,
                titulo:   'Individual comparisons by ranking methods',
                revista:  'Biometrics Bulletin',
                volumen:  '1(6)',
                paginas:  '80–83',
            }
        ],
    },

    'Friedman': {
        seccion:   'noParametricos',
        calcular:  'calcularFriedman',
        formula:   'χ²_r = [12/(nk(k+1))]ΣRᵢ² − 3n(k+1)',
        desc:      'Test no paramétrico para diseños de bloques aleatorizados. Alternativa al ANOVA de medidas repetidas.',
        icono:     '📊',
        minMuestra: 4,

        hipotesis: {
            h0: 'Las k condiciones o tratamientos producen distribuciones idénticas',
            h1: 'Al menos una condición difiere de las demás',
        },
        supuestos: [
            'Variable al menos ordinal',
            'Diseño de bloques aleatorizados (observaciones independientes entre bloques)',
            'Al menos 3 condiciones (columnas)',
            'Al menos 2 bloques (filas)',
        ],
        inputs: {
            tipo:        'bloques-k-condiciones',
            grupos:      'k≥3',
            descripcion: 'Matriz n×k: n bloques (sujetos/unidades) × k condiciones (tratamientos)',
        },
        salidas: ['chi2r', 'gl', 'p', 'W', 'significativo', 'n', 'k'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'W de Kendall (concordancia)',
            formula:  'W = χ²_r / (n(k−1))',
            umbrales: { pequeno: 0.1, mediano: 0.3, grande: 0.5 },
        },
        interpretacion: {
            significativo:   'Al menos una condición difiere (χ²r={chi2r}, gl={gl}, p={p}, W={W}). Aplique post-hoc de Conover o Nemenyi.',
            noSignificativo: 'Sin diferencias significativas entre condiciones (χ²r={chi2r}, p={p}).',
        },
        alternativaParametrica: 'ANOVA de medidas repetidas',
        advertencias: [
            { condicion: 'n_menor_5',  mensaje: 'Con n<5 bloques los valores críticos de χ²_r son aproximados.' },
            { condicion: 'k_menor_3',  mensaje: 'Friedman requiere al menos 3 condiciones. Para 2 use Wilcoxon.' },
        ],
        referencia: [
            {
                autores:  'Friedman, M.',
                anio:     1937,
                titulo:   'The use of ranks to avoid the assumption of normality implicit in the analysis of variance',
                revista:  'JASA',
                volumen:  '32(200)',
                paginas:  '675–701',
            }
        ],
    },

    'Test de Signos': {
        seccion:   'noParametricos',
        calcular:  'calcularTestSignos',
        formula:   'signos = count(+)/count(−)',
        desc:      'Test no paramétrico simple basado en signos de diferencias para muestras pareadas. No requiere supuestos de simetría.',
        icono:     '✚',
        minMuestra: 5,

        hipotesis: {
            h0: 'La probabilidad de diferencia positiva es igual a 0.5 (mediana de diferencias = 0)',
            h1: 'La probabilidad de diferencia positiva es distinta de 0.5',
        },
        supuestos: [
            'Variable al menos ordinal',
            'Pares de observaciones relacionadas',
            'Sin requerir simetría de diferencias (más simple que Wilcoxon)',
        ],
        inputs: {
            tipo:        'dos-columnas-pareadas',
            grupos:      2,
            descripcion: 'Dos vectores numéricos del mismo largo con observaciones emparejadas',
        },
        salidas: ['nPositivos', 'nNegativos', 'nEmpates', 'p', 'significativo', 'n'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral', 'unilateral-mayor', 'unilateral-menor'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'r (binomial)',
            formula:  'r = (n+ − n−) / (n+ + n−)',
            umbrales: { pequeno: 0.1, mediano: 0.3, grande: 0.5 },
        },
        interpretacion: {
            significativo:   'Diferencia sistemática entre pares (n+={nPositivos}, n−={nNegativos}, p={p}).',
            noSignificativo: 'Sin evidencia de diferencia sistemática (n+={nPositivos}, n−={nNegativos}, p={p}).',
        },
        alternativaParametrica: 'T-Test pareado',
        advertencias: [
            { condicion: 'potencia_baja', mensaje: 'El test de signos tiene menos potencia que Wilcoxon. Úselo solo cuando no se pueda asumir simetría de diferencias.' },
            { condicion: 'muchos_empates', mensaje: 'Los empates (diferencia = 0) son excluidos del análisis; un alto número reduce la potencia.' },
        ],
        referencia: [
            {
                autores:  'Dixon, W.J. & Mood, A.M.',
                anio:     1946,
                titulo:   'The statistical sign test',
                revista:  'JASA',
                volumen:  '41(236)',
                paginas:  '557–566',
            }
        ],
    },

    // ════════════════════════════════════════
    // SECCIÓN: MULTIVARIADO
    // ════════════════════════════════════════

    'PCA (Componentes Principales)': {
        seccion:   'multivariado',
        calcular:  'calcularPCA',
        formula:   'PC = w₁X₁ + w₂X₂ + ...',
        desc:      'Reducción de dimensionalidad que maximiza la varianza explicada. Transforma variables correlacionadas en componentes ortogonales.',
        icono:     '🎯',
        minMuestra: 10,

        supuestos: [
            'Variables numéricas continuas estandarizadas',
            'Relaciones lineales entre variables',
            'Sin valores faltantes (o imputados previamente)',
            'n >> p recomendado (al menos 5–10 observaciones por variable)',
        ],
        inputs: {
            tipo:        'multiples-columnas',
            grupos:      'p≥2',
            descripcion: 'Matriz de datos n×p con variables numéricas (se estandarizan automáticamente)',
        },
        salidas: ['componentes', 'cargas', 'varianzaExplicada', 'varianzaAcumulada', 'autovalores', 'scores'],
        efectoTamano: {
            metrica:  'Varianza explicada acumulada',
            formula:  'VE% = Σλᵢ / Σλ × 100',
            umbrales: { aceptable: 70, bueno: 80, excelente: 90 },
        },
        interpretacion: {
            plantilla: '{nComp} componentes explican el {varAcum}% de la varianza total. PC1: {var1}%, PC2: {var2}%.',
        },
        advertencias: [
            { condicion: 'variables_no_correlacionadas', mensaje: 'Si las variables no están correlacionadas, PCA no reduce la dimensionalidad efectivamente.' },
            { condicion: 'escala_diferente',             mensaje: 'Variables en distintas escalas. Se aplicó estandarización (media=0, DE=1).' },
        ],
        referencia: [
            {
                autores:  'Pearson, K.',
                anio:     1901,
                titulo:   'On lines and planes of closest fit to systems of points in space',
                revista:  'Phil Mag',
                volumen:  '2(11)',
                paginas:  '559–572',
            }
        ],
    },

    'Análisis Factorial': {
        seccion:   'multivariado',
        calcular:  'calcularAnalisisFactorial',
        formula:   'X = LF + ε',
        desc:      'Identifica estructura latente (factores) que explica las correlaciones entre variables observadas.',
        icono:     '🔍',
        minMuestra: 10,

        supuestos: [
            'Variables numéricas continuas',
            'Correlaciones entre variables (|r|>0.3 recomendado)',
            'KMO ≥ 0.6 (adecuación muestral)',
            'Test de esfericidad de Bartlett significativo',
            'n ≥ 5–10 observaciones por variable',
        ],
        inputs: {
            tipo:        'multiples-columnas',
            grupos:      'p≥3',
            descripcion: 'Matriz de datos n×p con variables numéricas correlacionadas',
        },
        salidas: ['cargas', 'comunalidades', 'varianzaExplicada', 'kmo', 'bartlett', 'nFactores', 'rotacion'],
        interpretacion: {
            plantilla: '{nFactores} factores explican el {varAcum}% de varianza. KMO={kmo}. Rotación: {rotacion}.',
        },
        advertencias: [
            { condicion: 'kmo_bajo',      mensaje: 'KMO<0.6: la estructura de correlaciones no es adecuada para análisis factorial.' },
            { condicion: 'n_insuficiente', mensaje: 'n<100 puede producir soluciones inestables. Aumente la muestra o reduzca variables.' },
        ],
        referencia: [
            {
                autores:  'Thurstone, L.L.',
                anio:     1931,
                titulo:   'Multiple factor analysis',
                revista:  'Psychological Review',
                volumen:  '38(5)',
                paginas:  '406–427',
            }
        ],
    },

    'Análisis de Cluster': {
        seccion:   'multivariado',
        calcular:  'calcularCluster',
        formula:   'Distancia entre clusters',
        desc:      'Agrupamiento de observaciones en clusters homogéneos internamente y heterogéneos entre sí. Métodos: k-medias, jerárquico.',
        icono:     '🧩',
        minMuestra: 5,

        supuestos: [
            'Variables numéricas estandarizadas',
            'Sin valores faltantes (o imputados)',
            'El número de clusters k debe especificarse (k-medias) o determinarse por dendrograma (jerárquico)',
        ],
        inputs: {
            tipo:        'multiples-columnas',
            grupos:      'libre',
            descripcion: 'Matriz de datos n×p; número de clusters configurable',
        },
        salidas: ['etiquetasCluster', 'centroides', 'inercia', 'silhouette', 'dendrograma', 'k'],
        efectoTamano: {
            metrica:  'Coeficiente de Silhouette',
            formula:  's(i) = (b−a)/max(a,b)',
            umbrales: { pobre: 0.25, razonable: 0.5, bueno: 0.7 },
        },
        interpretacion: {
            plantilla: '{k} clusters detectados. Silhouette promedio: {silhouette} (>0.5 buena separación).',
        },
        advertencias: [
            { condicion: 'k_no_especificado', mensaje: 'Use el método del codo (inercia vs k) o Silhouette para seleccionar k óptimo.' },
            { condicion: 'escala_diferente',  mensaje: 'Variables en distintas escalas pueden dominar la métrica de distancia. Se aplicó estandarización.' },
        ],
        referencia: [
            {
                autores:  'MacQueen, J.',
                anio:     1967,
                titulo:   'Some methods for classification and analysis of multivariate observations',
                revista:  'Proc 5th Berkeley Symp Math Stat Prob',
                volumen:  '1',
                paginas:  '281–297',
            }
        ],
    },

    'Análisis Discriminante': {
        seccion:   'multivariado',
        calcular:  'calcularDiscriminante',
        formula:   'D = wX + b',
        desc:      'Clasifica observaciones en grupos predefinidos usando funciones discriminantes lineales (LDA). Maximiza la separación entre grupos.',
        icono:     '🎯',
        minMuestra: 10,

        hipotesis: {
            h0: 'Las funciones discriminantes no mejoran la clasificación respecto al azar',
            h1: 'Las funciones discriminantes clasifican significativamente mejor que el azar',
        },
        supuestos: [
            'Variable dependiente categórica (grupos predefinidos)',
            'Variables predictoras numéricas continuas',
            'Normalidad multivariada en cada grupo',
            'Homogeneidad de matrices de covarianza entre grupos (para LDA)',
            'n >> p (al menos 5 observaciones por variable por grupo)',
        ],
        inputs: {
            tipo:        'multiples-columnas-mas-grupo',
            grupos:      'k≥2',
            descripcion: 'Variables predictoras numéricas + variable de grupo categórica',
        },
        salidas: ['funcionesDiscriminantes', 'cargas', 'lambda', 'chi2', 'p', 'clasificacion', 'accuracy', 'matrizConfusion'],
        efectoTamano: {
            metrica:  'Lambda de Wilks (Λ)',
            formula:  'Λ = |W|/|T| ∈ [0,1]; valores cercanos a 0 indican buena separación',
            umbrales: { bueno: 0.5, moderado: 0.7, pobre: 0.9 },
        },
        interpretacion: {
            plantilla: 'Λ={lambda}, χ²={chi2}, p={p}. Accuracy: {accuracy}%. {nFunciones} función(es) discriminante(s) significativa(s).',
        },
        alternativaNoParametrica: 'Análisis discriminante cuadrático (QDA) si no hay homocedasticidad',
        advertencias: [
            { condicion: 'no_homocedasticidad', mensaje: 'Matrices de covarianza no homogéneas: use QDA en lugar de LDA.' },
            { condicion: 'multicolinealidad',   mensaje: 'Alta correlación entre predictores puede inestabilizar las funciones discriminantes.' },
        ],
        referencia: "Fisher, R.A. (1936). The use of multiple measurements in taxonomic problems. Ann Eugenics, 7(2):179–188.",
    },

    'M-ANOVA': {
        seccion:   'multivariado',
        calcular:  'calcularMANOVA',
        formula:   'Λ = |E|/|H+E|',
        desc:      'ANOVA multivariado. Evalúa efectos de uno o más factores sobre múltiples variables dependientes simultáneamente.',
        icono:     '📊',
        minMuestra: 10,

        hipotesis: {
            h0: 'Los vectores de medias de todas las variables dependientes son iguales en todos los grupos',
            h1: 'Al menos un grupo difiere en el vector de medias',
        },
        supuestos: [
            'Variables dependientes numéricas continuas',
            'Normalidad multivariada por grupo',
            'Homogeneidad de matrices de covarianza (Box M)',
            'Independencia de observaciones',
            'n por grupo > número de variables dependientes',
        ],
        inputs: {
            tipo:        'multiples-columnas-mas-grupo',
            grupos:      'k≥2',
            descripcion: 'Múltiples variables dependientes numéricas + variable de grupo',
        },
        salidas: ['lambda', 'F', 'gl1', 'gl2', 'p', 'etaCuadradoP', 'pillai', 'significativo'],
        tipoTest: {
            defecto:  'bilateral',
            opciones: ['bilateral'],
        },
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'η² parcial multivariado (Pillai)',
            formula:  "Pillai's trace = Σ(λᵢ/(1+λᵢ))",
            umbrales: { pequeno: 0.01, mediano: 0.06, grande: 0.14 },
        },
        interpretacion: {
            significativo:   'Diferencias multivariadas significativas entre grupos (Λ={lambda}, F={F}, p={p}, η²p={etaCuadradoP}). Analice ANOVAs univariados con corrección de Bonferroni.',
            noSignificativo: 'Sin diferencias multivariadas significativas entre grupos (Λ={lambda}, p={p}).',
        },
        alternativaNoParametrica: 'PERMANOVA (no implementado en esta versión)',
        advertencias: [
            { condicion: 'box_m_significativo', mensaje: 'Box M significativo: matrices de covarianza no son homogéneas. Λ de Wilks puede no ser óptimo; considere Pillai.' },
            { condicion: 'n_insuficiente',      mensaje: 'n por grupo debe ser mayor que el número de variables dependientes para que Λ sea invertible.' },
        ],
        referencia: "Wilks, S.S. (1932). Certain generalizations in the analysis of variance. Biometrika, 24(3–4):471–494.",
    },

    // ════════════════════════════════════════
    // SECCIÓN: EXTRAS
    // ════════════════════════════════════════

    'Series Temporales': {
        seccion:   'extras',
        calcular:  'calcularSeriesTemporales',
        formula:   'Y_t = f(Y_{t-1}, Y_{t-2}, ...) + ε_t',
        desc:      'Análisis de datos ordenados en tiempo. Detecta tendencias, estacionalidad y genera pronósticos.',
        icono:     '📈',
        minMuestra: 20,

        supuestos: [
            'Observaciones ordenadas cronológicamente con intervalos regulares',
            'Estacionariedad para modelos ARIMA (o diferenciación previa)',
            'Sin valores faltantes en la serie (o interpolados)',
        ],
        inputs: {
            tipo:        'una-columna-temporal',
            grupos:      1,
            descripcion: 'Vector numérico ordenado cronológicamente; frecuencia de la serie configurable',
        },
        salidas: ['tendencia', 'estacionalidad', 'residuos', 'acf', 'pacf', 'pronostico', 'ic95Pronostico'],
        interpretacion: {
            plantilla: 'Tendencia: {tendencia}. Estacionalidad: {estacionalidad}. Pronóstico {h} pasos: {pronostico}.',
        },
        advertencias: [
            { condicion: 'no_estacionaria', mensaje: 'La serie no es estacionaria (ADF significativo). Aplique diferenciación antes de modelos ARIMA.' },
            { condicion: 'n_menor_50',      mensaje: 'Con menos de 50 observaciones la estimación de componentes estacionales es poco fiable.' },
        ],
        referencia: [
            {
                autores:  'Box, G.E.P. & Jenkins, G.M.',
                anio:     1976,
                titulo:   'Time Series Analysis: Forecasting and Control',
                editorial: 'Holden-Day',
            }
        ],
    },

    'Bootstrap': {
        seccion:   'extras',
        calcular:  'calcularBootstrap',
        formula:   'θ* = estimador(remuestreo)',
        desc:      'Método de remuestreo para estimar distribuciones muestrales y errores estándar sin supuestos distribucionales.',
        icono:     '🔄',
        minMuestra: 10,

        supuestos: [
            'La muestra original es representativa de la población',
            'Observaciones independientes e idénticamente distribuidas (i.i.d.)',
            'Número de remuestreos suficiente (recomendado B≥1000)',
        ],
        inputs: {
            tipo:        'una-columna-mas-estimador',
            grupos:      1,
            descripcion: 'Un vector numérico; estadístico de interés y número de iteraciones B configurables',
        },
        salidas: ['estimacion', 'se_bootstrap', 'ic95', 'ic99', 'distribucionBootstrap', 'B'],
        efectoTamano: {
            metrica:  'Amplitud del IC bootstrap',
            formula:  'IC = [θ*_(α/2), θ*_(1−α/2)]',
            umbrales: { preciso: 'IC estrecho', impreciso: 'IC amplio' },
        },
        interpretacion: {
            plantilla: 'Estimación: {estimacion} (SE={se_bootstrap}). IC 95% bootstrap: [{ic95Lo}, {ic95Hi}] (B={B} remuestreos).',
        },
        advertencias: [
            { condicion: 'n_menor_30',   mensaje: 'Con n pequeño el bootstrap puede no representar bien la distribución muestral.' },
            { condicion: 'b_menor_1000', mensaje: 'Se recomienda B≥1000 para IC estables. Aumente el número de remuestreos.' },
        ],
        referencia: [
            {
                autores:  'Efron, B.',
                anio:     1979,
                titulo:   'Bootstrap methods: Another look at the jackknife',
                revista:  'Ann Statist',
                volumen:  '7(1)',
                paginas:  '1–26',
            }
        ],
    },

    'Análisis de Supervivencia': {
        seccion:   'extras',
        calcular:  'calcularSupervivencia',
        formula:   'S(t) = P(T > t)',
        desc:      'Análisis de tiempo hasta evento. Incluye estimador Kaplan-Meier y modelo de riesgos proporcionales de Cox para datos censurados.',
        icono:     '⏱️',
        minMuestra: 20,

        hipotesis: {
            h0: 'Las curvas de supervivencia de los grupos son iguales (log-rank)',
            h1: 'Al menos una curva de supervivencia difiere',
        },
        supuestos: [
            'Variable de tiempo positiva',
            'Variable de evento/censura binaria (1=evento, 0=censurado)',
            'Censura independiente del tiempo de supervivencia',
            'Riesgos proporcionales entre grupos (para Cox)',
        ],
        inputs: {
            tipo:        'tiempo-evento-grupo',
            grupos:      'k≥1',
            descripcion: 'Vector de tiempos, vector de eventos (1/0) y opcional variable de grupo',
        },
        salidas: ['curvaKM', 'ic95KM', 'medianaTiempo', 'logRankChi2', 'logRankP', 'hrCox', 'ic95HR'],
        nivelAlfa: 0.05,
        efectoTamano: {
            metrica:  'Hazard Ratio (Cox)',
            formula:  'HR = exp(β)',
            umbrales: { noEfecto: 1.0, efectoModerado: 2.0, efectoGrande: 3.0 },
        },
        interpretacion: {
            plantilla: 'Mediana de supervivencia: {mediana}. Log-rank: χ²={chi2}, p={pLogrank}. HR={hr} (IC95%: {icHR}).',
        },
        advertencias: [
            { condicion: 'no_proporcionalidad', mensaje: 'Riesgos no proporcionales (Schoenfeld residuals): el modelo de Cox puede ser inapropiado.' },
            { condicion: 'pocos_eventos',       mensaje: 'Regla general: al menos 10 eventos por covariable en el modelo de Cox.' },
        ],
        referencia: [
            {
                autores:  'Kaplan, E.L. & Meier, P.',
                anio:     1958,
                titulo:   'Nonparametric estimation from incomplete observations',
                revista:  'JASA',
                volumen:  '53(282)',
                paginas:  '457–481',
            }
        ],
    },

    'Modelos Mixtos': {
        seccion:   'extras',
        calcular:  'calcularModelosMixtos',
        formula:   'Y = Xβ + Zu + ε',
        desc:      'Modelos con efectos fijos y aleatorios para datos agrupados, longitudinales o con estructura jerárquica.',
        icono:     '🔀',
        minMuestra: 20,

        supuestos: [
            'Variable dependiente continua (LMM) o no continua con link apropiado (GLMM)',
            'Efectos aleatorios normalmente distribuidos: u ~ N(0, G)',
            'Residuos normales e independientes condicionales: ε ~ N(0, R)',
            'Estructura de agrupamiento identificada (sujeto, sitio, cluster)',
        ],
        inputs: {
            tipo:        'multiples-columnas-mas-grupo-anidado',
            grupos:      'anidados',
            descripcion: 'Variables predictoras + variable respuesta + variable(s) de agrupamiento',
        },
        salidas: ['betasFijos', 'varianzasAleatorias', 'aic', 'bic', 'logLik', 'icc', 'residuos'],
        efectoTamano: {
            metrica:  'ICC (Intraclass Correlation Coefficient)',
            formula:  'ICC = τ²/(τ²+σ²)',
            umbrales: { bajo: 0.05, moderado: 0.1, alto: 0.3 },
        },
        interpretacion: {
            plantilla: 'Efectos fijos: {betasFijos}. ICC={icc} ({pctAgrupado}% de varianza explicada por agrupamiento). AIC={aic}.',
        },
        advertencias: [
            { condicion: 'icc_muy_bajo',           mensaje: 'ICC<0.05: la estructura jerárquica explica muy poca varianza; un modelo simple puede ser suficiente.' },
            { condicion: 'n_grupos_insuficiente',   mensaje: 'Se recomiendan ≥10–20 grupos de nivel superior para estimar varianzas aleatorias fiablemente.' },
        ],
        referencia: [
            {
                autores:  'Laird, N.M. & Ware, J.H.',
                anio:     1982,
                titulo:   'Random-effects models for longitudinal data',
                revista:  'Biometrics',
                volumen:  '38(4)',
                paginas:  '963–974',
            }
        ],
    },

    'Análisis Bayesiano': {
        seccion:   'extras',
        calcular:  'calcularBayesiano',
        formula:   'P(θ|D) ∝ P(D|θ) × P(θ)',
        desc:      'Inferencia estadística que actualiza distribuciones previas con los datos para obtener distribuciones posteriores.',
        icono:     '🎲',
        minMuestra: 15,

        supuestos: [
            'Se debe especificar una distribución previa (prior) para cada parámetro',
            'El modelo generativo (verosimilitud) debe ser coherente con los datos',
            'Convergencia de las cadenas MCMC verificada (R̂ ≈ 1)',
        ],
        inputs: {
            tipo:        'una-o-multiples-columnas-mas-prior',
            grupos:      'configurable',
            descripcion: 'Datos y especificación de priors (distribución y parámetros)',
        },
        salidas: ['posterior', 'media_posterior', 'ic95_credible', 'factorBayes', 'diagnosticoMCMC'],
        efectoTamano: {
            metrica:  'Factor de Bayes (BF₁₀)',
            formula:  'BF₁₀ = P(D|H₁) / P(D|H₀)',
            umbrales: { anecdotico: 3, moderado: 10, fuerte: 30, muyFuerte: 100 },
        },
        interpretacion: {
            plantilla: 'Media posterior: {media_posterior}. IC 95% creíble: [{icLo}, {icHi}]. BF₁₀={bf}: {interpretacionBF}.',
        },
        advertencias: [
            { condicion: 'prior_influyente',  mensaje: 'Con n pequeño el prior tiene alta influencia. Realice análisis de sensibilidad al prior.' },
            { condicion: 'no_convergencia',   mensaje: 'R̂>1.01 en algún parámetro: las cadenas MCMC no convergieron. Aumente iteraciones.' },
        ],
        referencia: [
            {
                autores:  'Bayes, T.',
                anio:     1763,
                titulo:   'An essay towards solving a problem in the doctrine of chances',
                revista:  'Phil Trans R Soc',
                volumen:  '53',
                paginas:  '370–418',
            }
        ],
    },

    // ════════════════════════════════════════
    // SECCIÓN: ESPECIFICACIÓN
    // ════════════════════════════════════════

    'Límites de Cuantificación': {
        seccion:   'especificacion',
        calcular:  'calcularLimitesCuantificacion',
        formula:   'LQC = 10×σ_blanco',
        desc:      'Límites de cuantificación según lineamientos ICH Q2(R1) y FDA. Incluye LOQ, LQC y MDL.',
        icono:     '📐',
        minMuestra: 10,

        supuestos: [
            'Datos de blancos (señal de fondo) con al menos 10 réplicas',
            'Relación señal/ruido estable en el rango de cuantificación',
            'Curva de calibración lineal en el rango de interés',
        ],
        inputs: {
            tipo:        'una-columna-blancos',
            grupos:      1,
            descripcion: 'Vector de mediciones de blanco (background) con al menos 10 réplicas',
        },
        salidas: ['LOD', 'LOQ', 'LQC', 'MDL', 'mediaBlancos', 'deBlancos', 'n'],
        interpretacion: {
            plantilla: 'LOD = {LOD} (3σ), LOQ = {LOQ} (10σ). Valores por debajo de LOQ no deben reportarse cuantitativamente.',
        },
        advertencias: [
            { condicion: 'n_menor_10',           mensaje: 'ICH Q2(R1) recomienda al menos 10 réplicas de blanco para LOD/LOQ fiables.' },
            { condicion: 'blancos_no_normales',   mensaje: 'Los blancos no tienen distribución normal. Los límites basados en 3σ y 10σ pueden ser conservadores.' },
            { condicion: 'drift_instrumental',    mensaje: 'Se detectó deriva en la señal del blanco a lo largo del tiempo. Verifique estabilidad del instrumento.' },
        ],
        referencia: [
            {
                autores:  'ICH Q2(R1)',
                anio:     2005,
                titulo:   'Validation of Analytical Procedures: Text and Methodology',
                editorial: 'International Council for Harmonisation',
            }
        ],
    },

};

// ════════════════════════════════════════
// HELPERS — GENERAR DESDE CONFIG
// ════════════════════════════════════════

function getSeccionesSidebar() {
    const secciones = {
        descriptiva:    { icon: '📊', label: 'Descriptiva',     description: 'Análisis de tendencias centrales, dispersión y forma de datos',           options: [] },
        hipotesis:      { icon: '🧪', label: 'Hipótesis',       description: 'Pruebas estadísticas para validar suposiciones sobre los datos',          options: [] },
        correlacion:    { icon: '📈', label: 'Correlación',     description: 'Medidas de asociación y dependencia entre variables',                     options: [] },
        regresion:      { icon: '📉', label: 'Regresión',       description: 'Modelos predictivos y métricas de ajuste',                                options: [] },
        noParametricos: { icon: '🔬', label: 'No Paramétricos', description: 'Tests sin distribución normal requerida para muestras pequeñas',          options: [] },
        multivariado:   { icon: '🎯', label: 'Multivariado',    description: 'Análisis de múltiples variables simultáneamente',                         options: [] },
        extras:         { icon: '✨', label: 'Extras',          description: 'Técnicas avanzadas de análisis estadístico',                              options: [] },
        especificacion: { icon: '📐', label: 'Especificación',  description: 'Límites de cuantificación y capacidad del proceso',                       options: [] },
    };

    Object.entries(ESTADISTICOS_CONFIG).forEach(([nombre, config]) => {
        if (secciones[config.seccion]) {
            secciones[config.seccion].options.push(nombre);
        }
    });

    Object.keys(secciones).forEach(key => {
        if (secciones[key].options.length === 0) delete secciones[key];
    });

    return secciones;
}

function getEstadisticosList() {
    return Object.keys(ESTADISTICOS_CONFIG);
}

function getStatMetaConfig() {
    const meta = {};
    Object.entries(ESTADISTICOS_CONFIG).forEach(([nombre, config]) => {
        meta[nombre] = {
            formula:        config.formula,
            desc:           config.desc,
            icono:          config.icono,
            hipotesis:      config.hipotesis      || null,
            supuestos:      config.supuestos      || [],
            efectoTamano:   config.efectoTamano   || null,
            interpretacion: config.interpretacion || null,
            referencia:     config.referencia     || null,
        };
    });
    return meta;
}

function getEstadisticoConfig(nombre) {
    return ESTADISTICOS_CONFIG[nombre] || null;
}

function getEstadisticosPorSeccion(seccion) {
    return Object.entries(ESTADISTICOS_CONFIG)
        .filter(([, config]) => config.seccion === seccion)
        .map(([nombre]) => nombre);
}

function getEstadisticosEDA() {
    const edaMap = {};
    Object.entries(ESTADISTICOS_CONFIG).forEach(([nombre, config]) => {
        if (config.edaKey) edaMap[config.edaKey] = nombre;
    });
    return edaMap;
}

/**
 * Devuelve todos los estadísticos que requieren dos columnas.
 * Útil para deshabilitar opciones en el UI cuando solo hay una columna cargada.
 */
function getEstadisticosDobleColumna() {
    return Object.entries(ESTADISTICOS_CONFIG)
        .filter(([, config]) => config.requiereDosColumnas)
        .map(([nombre]) => nombre);
}

/**
 * Devuelve el nivel alfa configurado para un estadístico.
 * Útil para reportes donde el umbral puede variar por test.
 * @param {string} nombre
 * @returns {number} Nivel alfa (defecto 0.05)
 */
function getNivelAlfa(nombre) {
    return ESTADISTICOS_CONFIG[nombre]?.nivelAlfa ?? 0.05;
}

/**
 * Construye el texto de interpretación a partir de la plantilla del config
 * y un objeto de valores calculados.
 * @param {string} nombre      - Nombre del estadístico
 * @param {boolean} significativo - true si p < alfa
 * @param {Object}  valores    - Valores calculados { p, t, r, ... }
 * @returns {string} Texto de interpretación listo para el reporte
 */
function buildInterpretacion(nombre, significativo, valores) {
    const config = ESTADISTICOS_CONFIG[nombre];
    if (!config?.interpretacion) return '';

    const interp = config.interpretacion;
    let plantilla = '';

    if (interp.plantilla) {
        plantilla = interp.plantilla;
    } else if (significativo && interp.significativo) {
        plantilla = interp.significativo;
    } else if (!significativo && interp.noSignificativo) {
        plantilla = interp.noSignificativo;
    }

    return plantilla.replace(/\{(\w+)\}/g, (_, key) =>
        valores[key] !== undefined ? valores[key] : `{${key}}`
    );
}

// ════════════════════════════════════════
// EXPORTAR PARA USO GLOBAL
// ════════════════════════════════════════

// Asignar directamente al objeto global (funciona en navegador y Node)
const globalObj = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);

globalObj.ESTADISTICOS_CONFIG = ESTADISTICOS_CONFIG;
globalObj.getSeccionesSidebar = getSeccionesSidebar;
globalObj.getEstadisticosList = getEstadisticosList;
globalObj.getStatMetaConfig = getStatMetaConfig;
globalObj.getEstadisticoConfig = getEstadisticoConfig;
globalObj.getEstadisticosPorSeccion = getEstadisticosPorSeccion;
globalObj.getEstadisticosEDA = getEstadisticosEDA;
globalObj.getEstadisticosDobleColumna = getEstadisticosDobleColumna;
globalObj.getNivelAlfa = getNivelAlfa;
globalObj.buildInterpretacion = buildInterpretacion;

// Para CommonJS / Node.js (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ESTADISTICOS_CONFIG,
        getSeccionesSidebar,
        getEstadisticosList,
        getStatMetaConfig,
        getEstadisticoConfig,
        getEstadisticosPorSeccion,
        getEstadisticosEDA,
        getEstadisticosDobleColumna,
        getNivelAlfa,
        buildInterpretacion
    };
}