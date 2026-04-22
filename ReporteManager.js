const ReporteManager = (() => {

    const REGULATORY = {
        standard:  'FDA 21 CFR Part 11',
        guideline: 'ICH E9 Statistical Principles for Clinical Trials',
        software:  'StatAnalyzer Pro v1.0',
        ciLevel:   '95%',
        alphaLevel:'0.05'
    };

    const EXCLUDE_KEYS = new Set(['columnaAgrupacion','columnaValores','grupo1','grupo2']);

    const FLAGS = {
        CV_HIGH: 30, CV_VERY_HIGH: 50,
        N_MIN: 30,   OUTLIER_IQR: 1.5, SKEW_MODERATE: 0.5
    };

    let currentLang = 'es';

    const I18N = {
        en: {
            reportTitle:    'STATISTICAL ANALYSIS REPORT',
            compliant:      'COMPLIANT',
            docId:          'Document ID',
            generated:      'Generated',
            software:       'Software',
            regulatoryRef:  'Regulatory Ref',
            sec1:           'SECTION 1 — INSTITUTIONAL HEADER',
            sec2:           'SECTION 2 — DATASET TRACEABILITY',
            sec3:           'SECTION 3 — EXECUTIVE SUMMARY',
            sec4:           'SECTION 4 — STATISTICAL RESULTS BY VARIABLE',
            sec5:           'SECTION 5 — METHODOLOGICAL NOTES',
            sec6:           'SECTION 6 — AUDIT TRAIL & ELECTRONIC SIGNATURE',
            organization:   'Organization',
            department:     'Department',
            location:       'Location',
            description:    'Description',
            assay:          'Assay / Test',
            studyProtocol:  'Study/Protocol',
            phase:          'Phase',
            projectCode:    'Project Code',
            reportVersion:  'Report Version',
            confidentiality:'Confidentiality',
            datasetName:    'Dataset Name',
            sourceFile:     'Source File',
            collectionDate: 'Collection Date',
            analysisDate:   'Analysis Date',
            totalRecords:   'Total Records',
            numericColumns: 'Numeric Columns',
            analyzed:       'Analyzed',
            statistics:     'Statistics',
            integrityHash:  'Integrity Hash',
            noFlags:        '✓  No automatic flags detected.',
            flagsDetected:  (n) => `⚠  ${n} flag(s) detected:`,
            variable:       'Variable',
            statistic:      'Statistic',
            value:          'Value',
            reference:      'Reference',
            cv:             'Coeff. of Variation (CV%)',
            cvRef:          'SD/Mean × 100',
            flagsLabel:     'FLAGS',
            preparedBy:     'Prepared by',
            reviewedBy:     'Reviewed by',
            approvedBy:     'Approved by',
            name:           'Name',
            title:          'Title / Position',
            date:           'Date',
            elecRecord:     'Electronic record',
            endOfReport:    'END OF REPORT',
            variance:       'Variance: s² = Σ(xᵢ - x̄)² / (n-1)  [Bessel correction]',
            percentiles:    'Percentiles: linear interpolation (NIST)',
            outliers:       (f) => `Outliers: Tukey fence Q1-${f}×IQR / Q3+${f}×IQR`,
            cvFlags:        (h, v) => `CV flags: >${h}% high  >${v}% extreme`,
            alpha:          (a, ci) => `α = ${a}  CI = ${ci}`,
            auditMeta:      'AUDIT METADATA',
            ui_langToggle:  'Idioma / Language',
            ui_langBtn_es:  '🇪🇸 Español',
            ui_langBtn_en:  '🇺🇸 English',
            ui_instHeader:  '🏛️ Institutional Information',
            ui_traceability:'🔗 Dataset Traceability',
            ui_signatures:  '✍️ Electronic Signatures — 21 CFR Part 11',
            ui_formatTitle: '📥 Download Format',
            ui_formatHint:  'Select one or more formats. The button downloads all selected.',
            ui_formatCount: (n) => `${n} format${n!==1?'s':''} selected`,
            ui_download:    '📥 Download Report',
            ui_noData:      'Run a statistical analysis first to enable download.',
            ui_regTitle:    'Regulatory Framework',
            ui_statusOk:    'Analysis ready to export',
            ui_statusWarn:  'No analysis available',
            ui_statusSubWarn: 'Run a statistical analysis in the <strong>Analysis</strong> view first.',
            ui_statusSubOk: (r,c,s) => `${r} records · ${c} variables · ${s} statistics`,
            ui_analysisLoaded:'📊 Loaded Analysis',
            ui_variables:   'Variables',
            ui_statsUsed:   'Statistics',
            ui_records:     'Records',
            ui_source:      'Source',
            ui_org:         'Organization',
            ui_dept:        'Department',
            ui_location:    'Location',
            ui_description: 'Description',
            ui_serial:       'Serial number',
            ui_assay:       'Assay / Test',
            ui_modelo:      'Equipment Model',
            ui_marca:       'Equipment Brand',
            ui_proto:       'Protocol / Study',
            ui_phase:       'Phase',
            ui_code:        'Project Code',
            ui_version:     'Version',
            ui_dataset:     'Dataset Name',
            ui_file:        'Source File',
            ui_collect:     'Collection Date',
            ui_conf:        'Confidentiality',
            ui_conf_internal:'Confidential — Internal',
            ui_conf_strict: 'Strictly Confidential',
            ui_conf_prop:   'Proprietary',
            ui_conf_reg:    'Regulatory Submission Only',
            ui_prep:        'Prepared by',
            ui_rev:         'Reviewed by',
            ui_app:         'Approved by',
            ui_sigName:     'Name',
            ui_sigTitle:    'Title / Position',
            ui_sigDate:     'Date',
            ui_recommended: 'Recommended',
            ui_pdfReady:    'PDF-ready',
            ui_txtDesc:     'Structured FDA 21 CFR Part 11 report. Numbered sections, ASCII borders, traceability hash.',
            ui_csvDesc:     'Pipe-delimited (|). Compatible with SAS PROC IMPORT and R read.table. Metadata in commented header.',
            ui_htmlDesc:    'Visual report with cover, tables and signatures. Open in browser → Ctrl+P → Save as PDF.',
            ui_pdfDesc:     'Report in PDF format ready to print. Generated from HTML report.',
            ui_alertDownload:(fmts,base,html) => `✅ Download started\n\nFormats: ${fmts}\nFile: ${base}${html?'\n\nThe .html file can be printed as PDF from the browser.':''}`,
            ui_alertNoFmt:  '⚠️ Select at least one download format.',
            html_cover_logo:'StatAnalyzer Pro · Statistical Report',
            html_title:     'Statistical Analysis Report',
            html_sec1:      'Overview',
            html_sec2:      'Dataset Traceability',
            html_sec3:      'Executive Summary',
            html_sec4:      'Statistical Results by Variable',
            html_sec5:      'Methodological Notes',
            html_sec6:      'Audit Trail & Electronic Signature',
            html_auditSubpart:'21 CFR Part 11 — Subpart C',
            html_statCol:   'Statistic',
            html_valCol:    'Value',
            html_refCol:    'Formula',
            html_flagsLabel:'Flags',
            html_noFlags:   '✓ No flags for this variable',
            html_noFlagsGlobal:'✓ No automatic flags detected. All variables within expected ranges.',
            html_flagsGlobal:(n) => `⚠ ${n} automatic flag(s) detected:`,
            html_auditMeta: 'AUDIT METADATA',

            html_method_v:    'Variance & SD',
            html_method_v_d:  "Bessel's correction (n-1).",
            html_method_v_why:"Quantifies data dispersion around the mean. A high SD indicates low process reproducibility; it is the primary variability indicator in analytical validations and quality control.",

            html_method_p:    'Percentile Interp.',
            html_method_p_d:  'Linear interpolation (NIST).',
            html_method_p_why:'Reveals the actual data distribution without assuming normality. P25, P50, and P75 expose asymmetries and are essential for defining acceptance limit specifications in regulated processes.',

            html_method_o:    'Outlier Detection',
            html_method_o_why:'Outliers can distort all central tendency and dispersion statistics. Early identification is critical to determine whether a data point is a measurement error, contamination, or an out-of-control process signal.',

            html_method_s:    'Skewness',
            html_method_s_d:  "Pearson 2nd coefficient.",
            html_method_s_why:'A skewed distribution indicates the mean does not adequately represent the dataset. In purity, concentration, or dissolution time data, skewness can reveal systematic issues in the manufacturing process.',

            html_method_cv:   'CV Thresholds',
            html_method_cv_why:'The Coefficient of Variation normalizes dispersion relative to the mean magnitude, enabling variability comparisons between columns with different units or scales. CV > 30% typically signals an out-of-control process.',

            html_method_sig:  'Significance',
            html_method_sig_why:'The α = 0.05 level defines the accepted Type I error threshold. It establishes the certainty with which a null hypothesis can be rejected — the international standard in clinical trials (ICH E9) and analytical method validations.',

            html_execSummary:(ds,rows,cols,std) => `Dataset <strong>"${ds}"</strong> · <strong>${rows}</strong> observations · <strong>${cols}</strong> numeric variable(s) · ${std}.`,
            statRefs: {
                'Media Aritmética':   'Freedman, D., Pisani, R. & Purves, R. (2007). Statistics (4ª ed.). W.W. Norton.',
                'Mediana':            'Freedman, D., Pisani, R. & Purves, R. (2007). Statistics (4ª ed.). W.W. Norton.',
                'Moda':               'Freedman, D., Pisani, R. & Purves, R. (2007). Statistics (4ª ed.). W.W. Norton.',
                'Desviación Estándar': 'Bessel, F. (1838). Correction to the estimation of variance. Astronomische Nachrichten.',
                'Varianza':           'Bessel, F. (1838). Correction to the estimation of variance. Astronomische Nachrichten.',
                'Percentiles':        'Hyndman, R.J. & Fan, Y. (1996). Sample quantiles in statistical packages. The American Statistician, 50(4):361–365.',
                'Rango y Amplitud':   'Freedman, D., Pisani, R. & Purves, R. (2007). Statistics (4ª ed.). W.W. Norton.',
                'Coeficiente de Variación': 'Everitt, B.S. (2002). The Cambridge Dictionary of Statistics (2ª ed.). Cambridge University Press.',
                'Asimetría (Skewness)': 'Joanes, D.N. & Gill, C.A. (1998). Comparing measures of sample skewness and kurtosis. The Statistician, 47(1):183–189.',
                'Curtosis (Kurtosis)': 'DeCarlo, L.T. (1997). On the meaning and use of kurtosis. Psychological Methods, 2(3):292–307.',
                'Error Estándar':     'Cumming, G., Fidler, F. & Vaux, D.L. (2007). Error bars in experimental biology. J Cell Biol, 177(1):7–11.',
                'Intervalos de Confianza': 'Neyman, J. (1937). Outline of a theory of statistical estimation. Phil Trans R Soc, 236:333–380.',
                'Detección de Outliers': 'Tukey, J.W. (1977). Exploratory Data Analysis. Addison-Wesley.',
                'Jarque-Bera':        'Jarque, C.M. & Bera, A.K. (1987). A test for normality of observations and regression residuals. Int Stat Rev, 55(2):163–172.',
                'Shapiro-Wilk':       'Shapiro, S.S. & Wilk, M.B. (1965). An analysis of variance test for normality. Biometrika, 52(3–4):591–611.',
                'Kolmogorov-Smirnov': 'Lilliefors, H.W. (1967). On the Kolmogorov-Smirnov test for normality with mean and variance unknown. JASA, 62(318):399–402.',
                'Anderson-Darling':   'Anderson, T.W. & Darling, D.A. (1952). Asymptotic theory of certain goodness of fit criteria. Ann Math Statist, 23(2):193–212.',
                "D'Agostino-Pearson": "D'Agostino, R.B., Belanger, A. & D'Agostino Jr, R.B. (1990). A suggestion for using powerful and informative tests of normality. The American Statistician, 44(4):316–321.",
                'T-Test (una muestra)': "Student [W.S. Gosset] (1908). The probable error of a mean. Biometrika, 6(1):1–25.",
                'T-Test (dos muestras)': "Welch, B.L. (1947). The generalization of Student's problem when several different population variances are involved. Biometrika, 34(1–2):28–35.",
                'ANOVA One-Way':      'Fisher, R.A. (1925). Statistical Methods for Research Workers. Oliver & Boyd.',
                'ANOVA Two-Way':      'Fisher, R.A. (1925). Statistical Methods for Research Workers. Oliver & Boyd.',
                'Chi-Cuadrado':       'Pearson, K. (1900). On the criterion that a given system of deviations from the probable in the case of a correlated system of variables is such that it can be reasonably supposed to have arisen from random sampling. Phil Mag, 50(302):157–175.',
                'TOST':               'Schuirmann, D.J. (1987). A comparison of the two one-sided tests procedure and the power approach for assessing the equivalence of average bioavailability. J Pharmacokinet Biopharm, 15(6):657–680.',
                'Correlación Pearson': 'Pearson, K. (1895). Notes on regression and inheritance in the case of two parents. Proc R Soc Lond, 58:240–242.',
                'Correlación Spearman': 'Spearman, C. (1904). The proof and measurement of association between two things. Am J Psychol, 15(1):72–101.',
                'Correlación Kendall Tau': "Kendall, M.G. (1938). A new measure of rank correlation. Biometrika, 30(1–2):81–93.",
                'Covarianza':         'Freedman, D., Pisani, R. & Purves, R. (2007). Statistics (4ª ed.). W.W. Norton.',
                'Regresión Lineal Simple': 'Galton, F. (1886). Regression towards mediocrity in hereditary stature. J Anthropological Inst, 15:246–263.',
                'Regresión Lineal Múltiple': 'Draper, N.R. & Smith, H. (1998). Applied Regression Analysis (3ª ed.). Wiley.',
                'Regresión Polinomial': 'Draper, N.R. & Smith, H. (1998). Applied Regression Analysis (3ª ed.). Wiley.',
                'Regresión Logística': 'Cox, D.R. (1958). The regression analysis of binary sequences. J R Stat Soc B, 20(2):215–242.',
                'RMSE':               'Hyndman, R.J. & Koehler, A.B. (2006). Another look at measures of forecast accuracy. Int J Forecasting, 22(4):679–688.',
                'MAE':                'Willmott, C.J. & Matsuura, K. (2005). Advantages of the mean absolute error (MAE) over the root mean square error (RMSE). Climate Research, 30(1):79–82.',
                'R² (Coef. Determinación)': 'Wright, S. (1921). Correlation and causation. J Agric Res, 20(7):557–585.',
                'Mann-Whitney U':    'Mann, H.B. & Whitney, D.R. (1947). On a test of whether one of two random variables is stochastically larger than the other. Ann Math Statist, 18(1):50–60.',
                'Kruskal-Wallis':     'Kruskal, W.H. & Wallis, W.A. (1952). Use of ranks in one-criterion variance analysis. JASA, 47(260):583–621.',
                'Wilcoxon':           'Wilcoxon, F. (1945). Individual comparisons by ranking methods. Biometrics Bulletin, 1(6):80–83.',
                'Friedman':           'Friedman, M. (1937). The use of ranks to avoid the assumption of normality implicit in the analysis of variance. JASA, 32(200):675–701.',
                'Test de Signos':     'Dixon, W.J. & Mood, A.M. (1946). The statistical sign test. JASA, 41(236):557–566.',
                'ACP':                'Pearson, K. (1901). On lines and planes of closest fit to systems of points in space. Phil Mag, 2(11):559–572.',
                'Análisis Factorial': 'Thurstone, L.L. (1931). Multiple factor analysis. Psychological Review, 38(5):406–427.',
                'K-Medias':           'MacQueen, J. (1967). Some methods for classification and analysis of multivariate observations. Proc 5th Berkeley Symp Math Stat Prob, 1:281–297.',
                'LDA':                "Fisher, R.A. (1936). The use of multiple measurements in taxonomic problems. Ann Eugenics, 7(2):179–188.",
                'MANOVA':             "Wilks, S.S. (1932). Certain generalizations in the analysis of variance. Biometrika, 24(3–4):471–494.",
                'Análisis de Series Temporales': 'Box, G.E.P. & Jenkins, G.M. (1976). Time Series Analysis: Forecasting and Control. Holden-Day.',
                'Bootstrap':          'Efron, B. (1979). Bootstrap methods: Another look at the jackknife. Ann Statist, 7(1):1–26.',
                'Análisis de Supervivencia': 'Kaplan, E.L. & Meier, P. (1958). Nonparametric estimation from incomplete observations. JASA, 53(282):457–481.',
                'Modelos Mixtos':     'Laird, N.M. & Ware, J.H. (1982). Random-effects models for longitudinal data. Biometrics, 38(4):963–974.',
                'Inferencia Bayesiana': 'Bayes, T. (1763). An essay towards solving a problem in the doctrine of chances. Phil Trans R Soc, 53:370–418.',
                'Límites de Cuantificación': 'ICH Q2(R1) (2005). Validation of Analytical Procedures: Text and Methodology. International Council for Harmonisation.',
            },
            statFormulas: {
                'Media Aritmética':   'x̄ = Σxᵢ / n',
                'Mediana':            'P₅₀ = central value',
                'Moda':               'most frequent value',
                'Desviación Estándar': 's = √[Σ(xᵢ − x̄)² / (n−1)]',
                'Varianza':           's² = Σ(xᵢ − x̄)² / (n−1)',
                'Percentiles':        'Pk = valor en posición k/100×(n+1), k∈{10,25,50,75,90}',
                'Rango y Amplitud':   'R = máx−mín | min = min(xi) | max = max(xi)',
                'Coeficiente de Variación': 'CV = (s / |x̄|) × 100%',
                'Asimetría (Skewness)': 'g₁ = Σ(xᵢ − x̄)³ / (n × s³)',
                'Curtosis (Kurtosis)': 'g₂ = [Σ(xᵢ − x̄)⁴ / (n × s⁴)] − 3',
                'Error Estándar':     'SE = s / √n',
                'Intervalos de Confianza': 'IC = x̄ ± t(α/2) × SE',
                'Detección de Outliers': 'IQR: [Q1−1.5×IQR, Q3+1.5×IQR] | Z-Score: |z| > 3',
                'Jarque-Bera':        'JB = (n/6)(S² + K²/4)',
                'Shapiro-Wilk':       'W ∈ [0, 1]',
                'Kolmogorov-Smirnov': 'D = max|Fₙ(x) − F(x)|',
                'Anderson-Darling':  'A² = −n − (1/n)Σ(2i−1)[ln(Fᵢ)+ln(1−Fₙ₊₁₋ᵢ)]',
                "D'Agostino-Pearson": 'K² = Z_skew² + Z_kurt²',
                'T-Test (una muestra)': 't = (x̄ − μ₀) / (s/√n)',
                'T-Test (dos muestras)': 't = (x̄₁ − x̄₂) / √(s₁²/n₁ + s₂²/n₂)',
                'ANOVA One-Way':     'F = MSB / MSW',
                'ANOVA Two-Way':      'F₁ = MSF₁/MSE, F₂ = MSF₂/MSE',
                'Chi-Cuadrado':       'χ² = Σ(O − E)² / E',
                'TOST':               '|δ| < Δ',
                'Correlación Pearson': 'r = cov(X,Y)/(σx × σy)',
                'Correlación Spearman': 'ρ = Pearson correlation on ranks',
                'Correlación Kendall Tau': 'τ = (C − D) / √[(n₀−n₁)(n₀−n₂)]',
                'Covarianza':         'Cov(X,Y) = Σ(xi−x̄)(yi−ȳ) / (n−1)',
                'Regresión Lineal Simple': 'Y = a + bX',
                'Regresión Lineal Múltiple': 'Y = β₀ + β₁X₁ + ... + βₖXₖ',
                'Regresión Polinomial': 'Y = a₀ + a₁X + a₂X² + ...',
                'Regresión Logística': 'P = 1/(1+e^(−z))',
                'RMSE':               'RMSE = √[Σ(obs−pred)²/n]',
                'MAE':                'MAE = Σ|obs−pred|/n',
                'R² (Coef. Determinación)': 'R² = 1 − SSres/SStot',
                'Mann-Whitney U':    'U = min(U₁, U₂)',
                'Kruskal-Wallis':     'H = [12/(N(N+1))]Σ(Rᵢ²/nᵢ) − 3(N+1)',
                'Wilcoxon':           'W = sum of signed ranks',
                'Friedman':           'χ²_r = [12/(nk(k+1))]ΣRᵢ² − 3n(k+1)',
                'Test de Signos':     'signs = count(+)/count(−)',
                'ACP':                'PC = w₁X₁ + w₂X₂ + ...',
                'Análisis Factorial': 'X = LF + ε',
                'K-Medias':           'Distance between clusters',
                'LDA':                'D = wX + b',
                'MANOVA':             'Λ = |E|/|H+E|',
                'Análisis de Series Temporales': 'Y_t = f(Y_{t-1}, Y_{t-2}, ...) + ε_t',
                'Bootstrap':          'θ* = estimator(bootstrap)',
                'Análisis de Supervivencia': 'S(t) = P(T > t)',
                'Modelos Mixtos':     'Y = Xβ + Zu + ε',
                'Inferencia Bayesiana': 'P(θ|D) ∝ P(D|θ) × P(θ)',
                'Límites de Cuantificación': 'LQC = 10×σ_blank',
            }
        },
        es: {
            reportTitle:    'REPORTE DE ANÁLISIS ESTADÍSTICO',
            compliant:      'CUMPLIMIENTO',
            docId:          'ID del Documento',
            generated:      'Generado',
            software:       'Software',
            regulatoryRef:  'Referencia Regulatoria',
            sec1:           'SECCIÓN 1 — DESCRIPCIÓN GENERAL',
            sec2:           'SECCIÓN 2 — TRAZABILIDAD DEL DATASET',
            sec3:           'SECCIÓN 3 — RESUMEN EJECUTIVO',
            sec4:           'SECCIÓN 4 — RESULTADOS ESTADÍSTICOS POR VARIABLE',
            sec5:           'SECCIÓN 5 — NOTAS METODOLÓGICAS',
            sec6:           'SECCIÓN 6 — AUDITORÍA Y FIRMA ELECTRÓNICA',
            organization:   'Organización',
            department:     'Departamento',
            location:       'Ubicación',
            description:    'Descripción',
            assay:          'Ensayo / Prueba',
            studyProtocol:  'Estudio/Protocolo',
            phase:          'Fase',
            projectCode:    'Código de Proyecto',
            reportVersion:  'Versión del Reporte',
            confidentiality:'Confidencialidad',
            datasetName:    'Nombre del Dataset',
            sourceFile:     'Archivo Fuente',
            collectionDate: 'Fecha de Recolección',
            analysisDate:   'Fecha de Análisis',
            totalRecords:   'Total de Registros',
            numericColumns: 'Columnas Numéricas',
            analyzed:       'Analizadas',
            statistics:     'Estadísticos',
            integrityHash:  'Hash de Integridad',
            noFlags:        '✓  Sin alertas automáticas detectadas.',
            flagsDetected:  (n) => `⚠  ${n} alerta(s) detectada(s):`,
            variable:       'Variable',
            statistic:      'Estadístico',
            value:          'Valor',
            reference:      'Referencia',
            cv:             'Coef. de Variación (CV%)',
            cvRef:          'DE/Media × 100',
            flagsLabel:     'ALERTAS',
            preparedBy:     'Preparado por',
            reviewedBy:     'Revisado por',
            approvedBy:     'Aprobado por',
            name:           'Nombre',
            title:          'Cargo / Posición',
            date:           'Fecha',
            elecRecord:     'Registro electrónico',
            endOfReport:    'FIN DEL REPORTE',
            variance:       'Varianza: s² = Σ(xᵢ - x̄)² / (n-1)  [corrección de Bessel]',
            percentiles:    'Percentiles: interpolación lineal (NIST)',
            outliers:       (f) => `Valores atípicos: Tukey Q1-${f}×IQR / Q3+${f}×IQR`,
            cvFlags:        (h,v) => `Umbrales CV: >${h}% alto  >${v}% extremo`,
            alpha:          (a,ci) => `α = ${a}  IC = ${ci}`,
            auditMeta:      'METADATOS DE AUDITORÍA',
            ui_langToggle:  'Idioma / Language',
            ui_langBtn_es:  '🇪🇸 Español',
            ui_langBtn_en:  '🇺🇸 English',
            ui_instHeader:  '🏛️ Información Institucional',
            ui_traceability:'🔗 Trazabilidad del Dataset',
            ui_signatures:  '✍️ Firmas Electrónicas — 21 CFR Part 11',
            ui_formatTitle: '📥 Formato de Descarga',
            ui_formatHint:  'Selecciona uno o más formatos. El botón descarga todos los seleccionados.',
            ui_formatCount: (n) => `${n} formato${n!==1?'s':''} seleccionado${n!==1?'s':''}`,
            ui_download:    '📥 Descargar Reporte',
            ui_noData:      'Ejecuta un análisis estadístico primero para habilitar la descarga.',
            ui_regTitle:    'Marco Regulatorio',
            ui_statusOk:    'Análisis listo para exportar',
            ui_statusWarn:  'Sin análisis disponible',
            ui_statusSubWarn:'Ejecuta un análisis estadístico en la vista <strong>Análisis</strong> primero.',
            ui_statusSubOk: (r,c,s) => `${r} registros · ${c} variables · ${s} estadísticos`,
            ui_analysisLoaded:'📊 Análisis Cargado',
            ui_variables:   'Variables',
            ui_statsUsed:   'Estadísticos',
            ui_records:     'Registros',
            ui_source:      'Fuente',
            ui_org:         'Organización',
            ui_dept:        'Departamento',
            ui_location:    'Ubicación',
            ui_description: 'Descripción',
            ui_serial:       'Número de Serie',
            ui_assay:       'Ensayo / Prueba',
            ui_modelo:      'Modelo del Equipo',
            ui_marca:       'Marca del Equipo',
            ui_proto:       'Protocolo / Estudio',
            ui_phase:       'Fase',
            ui_code:        'Código de Proyecto',
            ui_version:     'Versión',
            ui_dataset:     'Nombre del Dataset',
            ui_file:        'Archivo Fuente',
            ui_collect:     'Fecha de Recolección',
            ui_conf:        'Confidencialidad',
            ui_conf_internal:'Confidencial — Interno',
            ui_conf_strict: 'Estrictamente Confidencial',
            ui_conf_prop:   'Propietario',
            ui_conf_reg:    'Solo para Presentación Regulatoria',
            ui_prep:        'Preparado por',
            ui_rev:         'Revisado por',
            ui_app:         'Aprobado por',
            ui_sigName:     'Nombre',
            ui_sigTitle:    'Cargo / Posición',
            ui_sigDate:     'Fecha',
            ui_recommended: 'Recomendado',
            ui_pdfReady:    'Listo para PDF',
            ui_txtDesc:     'Reporte estructurado FDA 21 CFR Part 11. Secciones numeradas, bordes ASCII, hash de trazabilidad.',
            ui_csvDesc:     'Delimitado por pipes (|). Compatible con SAS PROC IMPORT y R read.table. Metadatos en cabecera comentada.',
            ui_htmlDesc:    'Reporte visual con portada, tablas y firmas. Abre en navegador → Ctrl+P → Guardar como PDF.',
            ui_pdfDesc:     'Reporte en formato PDF listo para imprimir. Se genera a partir del reporte HTML.',
            ui_alertDownload:(fmts,base,html) => `✅ Descarga iniciada\n\nFormatos: ${fmts}\nArchivo: ${base}${html?'\n\nEl archivo .html puede imprimirse como PDF desde el navegador.':''}`,
            ui_alertNoFmt:  '⚠️ Selecciona al menos un formato de descarga.',
            html_cover_logo:'StatAnalyzer Pro · Reporte Estadístico',
            html_title:     'Reporte de Análisis Estadístico',
            html_sec1:      'Descripción General',
            html_sec2:      'Trazabilidad del Dataset',
            html_sec3:      'Resumen Ejecutivo',
            html_sec4:      'Resultados Estadísticos por Variable',
            html_sec5:      'Notas Metodológicas',
            html_sec6:      'Auditoría y Firma Electrónica',
            html_auditSubpart:'21 CFR Part 11 — Subparte C',
            html_statCol:   'Estadístico',
            html_valCol:    'Valor',
            html_refCol:    'Fórmula',
            html_flagsLabel:'Alertas',
            html_noFlags:   '✓ Sin alertas para esta variable',
            html_noFlagsGlobal:'✓ Sin alertas automáticas detectadas. Todas las variables dentro de rangos esperados.',
            html_flagsGlobal:(n) => `⚠ ${n} alerta(s) automática(s) detectada(s):`,
            html_auditMeta: 'METADATOS DE AUDITORÍA',
            html_method_v:  'Varianza y DE',            html_method_v_d:'Corrección de Bessel (n-1).',
            html_method_v_why:'Cuantifica la dispersión de los datos respecto a la media. Una DE alta indica baja reproducibilidad del proceso; es el indicador principal de variabilidad en validaciones analíticas y control de calidad.',

            html_method_p:  'Interpolación Percentiles',html_method_p_d:'Interpolación lineal (NIST).',
            html_method_p_why:'Permite identificar la distribución real de los datos sin asumir normalidad. P25, P50 y P75 revelan asimetrías y son fundamentales para especificaciones de límites de aceptación en procesos regulados.',

            html_method_o:  'Detección Valores Atípicos',
            html_method_o_why:'Los outliers pueden distorsionar todos los estadísticos de tendencia central y dispersión. Su identificación temprana es crítica para decidir si un dato es un error de medición, una contaminación o una señal de proceso fuera de control.',

            html_method_s:  'Asimetría',               html_method_s_d:'Coeficiente de Pearson (2do).',
            html_method_s_why:'Una distribución asimétrica indica que la media no representa bien al conjunto. En datos de pureza, concentración o tiempo de disolución, la asimetría puede revelar problemas sistemáticos en el proceso de manufactura.',

            html_method_cv: 'Umbrales CV',
            html_method_cv_why:'El Coeficiente de Variación normaliza la dispersión respecto a la magnitud de la media, permitiendo comparar variabilidad entre columnas con diferentes unidades o escalas. CV > 30% suele indicar proceso fuera de control.',

            html_method_sig:'Significancia',
            html_method_sig_why:'El nivel α = 0.05 define el umbral de error tipo I aceptable. Establece con qué certeza se puede rechazar una hipótesis nula, siendo el estándar internacional en ensayos clínicos (ICH E9) y validaciones de métodos analíticos.',
            html_execSummary:(ds,rows,cols,std) => `Dataset <strong>"${ds}"</strong> · <strong>${rows}</strong> observaciones · <strong>${cols}</strong> variable(s) numérica(s) · ${std}.`,
            statRefs: {
                'Media Aritmética':   'Freedman, D., Pisani, R. & Purves, R. (2007). Statistics (4ª ed.). W.W. Norton.',
                'Mediana':            'Freedman, D., Pisani, R. & Purves, R. (2007). Statistics (4ª ed.). W.W. Norton.',
                'Moda':               'Freedman, D., Pisani, R. & Purves, R. (2007). Statistics (4ª ed.). W.W. Norton.',
                'Desviación Estándar': 'Bessel, F. (1838). Correction to the estimation of variance. Astronomische Nachrichten.',
                'Varianza':           'Bessel, F. (1838). Correction to the estimation of variance. Astronomische Nachrichten.',
                'Percentiles':        'Hyndman, R.J. & Fan, Y. (1996). Sample quantiles in statistical packages. The American Statistician, 50(4):361–365.',
                'Rango y Amplitud':   'Freedman, D., Pisani, R. & Purves, R. (2007). Statistics (4ª ed.). W.W. Norton.',
                'Coeficiente de Variación': 'Everitt, B.S. (2002). The Cambridge Dictionary of Statistics (2ª ed.). Cambridge University Press.',
                'Asimetría (Skewness)': 'Joanes, D.N. & Gill, C.A. (1998). Comparing measures of sample skewness and kurtosis. The Statistician, 47(1):183–189.',
                'Curtosis (Kurtosis)': 'DeCarlo, L.T. (1997). On the meaning and use of kurtosis. Psychological Methods, 2(3):292–307.',
                'Error Estándar':     'Cumming, G., Fidler, F. & Vaux, D.L. (2007). Error bars in experimental biology. J Cell Biol, 177(1):7–11.',
                'Intervalos de Confianza': 'Neyman, J. (1937). Outline of a theory of statistical estimation. Phil Trans R Soc, 236:333–380.',
                'Detección de Outliers': 'Tukey, J.W. (1977). Exploratory Data Analysis. Addison-Wesley.',
                'Jarque-Bera':        'Jarque, C.M. & Bera, A.K. (1987). A test for normality of observations and regression residuals. Int Stat Rev, 55(2):163–172.',
                'Shapiro-Wilk':       'Shapiro, S.S. & Wilk, M.B. (1965). An analysis of variance test for normality. Biometrika, 52(3–4):591–611.',
                'Kolmogorov-Smirnov': 'Lilliefors, H.W. (1967). On the Kolmogorov-Smirnov test for normality with mean and variance unknown. JASA, 62(318):399–402.',
                'Anderson-Darling':   'Anderson, T.W. & Darling, D.A. (1952). Asymptotic theory of certain goodness of fit criteria. Ann Math Statist, 23(2):193–212.',
                "D'Agostino-Pearson": "D'Agostino, R.B., Belanger, A. & D'Agostino Jr, R.B. (1990). A suggestion for using powerful and informative tests of normality. The American Statistician, 44(4):316–321.",
                'T-Test (una muestra)': "Student [W.S. Gosset] (1908). The probable error of a mean. Biometrika, 6(1):1–25.",
                'T-Test (dos muestras)': "Welch, B.L. (1947). The generalization of Student's problem when several different population variances are involved. Biometrika, 34(1–2):28–35.",
                'ANOVA One-Way':      'Fisher, R.A. (1925). Statistical Methods for Research Workers. Oliver & Boyd.',
                'ANOVA Two-Way':      'Fisher, R.A. (1925). Statistical Methods for Research Workers. Oliver & Boyd.',
                'Chi-Cuadrado':       'Pearson, K. (1900). On the criterion that a given system of deviations from the probable in the case of a correlated system of variables is such that it can be reasonably supposed to have arisen from random sampling. Phil Mag, 50(302):157–175.',
                'TOST':               'Schuirmann, D.J. (1987). A comparison of the two one-sided tests procedure and the power approach for assessing the equivalence of average bioavailability. J Pharmacokinet Biopharm, 15(6):657–680.',
                'Correlación Pearson': 'Pearson, K. (1895). Notes on regression and inheritance in the case of two parents. Proc R Soc Lond, 58:240–242.',
                'Correlación Spearman': 'Spearman, C. (1904). The proof and measurement of association between two things. Am J Psychol, 15(1):72–101.',
                'Correlación Kendall Tau': "Kendall, M.G. (1938). A new measure of rank correlation. Biometrika, 30(1–2):81–93.",
                'Covarianza':         'Freedman, D., Pisani, R. & Purves, R. (2007). Statistics (4ª ed.). W.W. Norton.',
                'Regresión Lineal Simple': 'Galton, F. (1886). Regression towards mediocrity in hereditary stature. J Anthropological Inst, 15:246–263.',
                'Regresión Lineal Múltiple': 'Draper, N.R. & Smith, H. (1998). Applied Regression Analysis (3ª ed.). Wiley.',
                'Regresión Polinomial': 'Draper, N.R. & Smith, H. (1998). Applied Regression Analysis (3ª ed.). Wiley.',
                'Regresión Logística': 'Cox, D.R. (1958). The regression analysis of binary sequences. J R Stat Soc B, 20(2):215–242.',
                'RMSE':               'Hyndman, R.J. & Koehler, A.B. (2006). Another look at measures of forecast accuracy. Int J Forecasting, 22(4):679–688.',
                'MAE':                'Willmott, C.J. & Matsuura, K. (2005). Advantages of the mean absolute error (MAE) over the root mean square error (RMSE). Climate Research, 30(1):79–82.',
                'R² (Coef. Determinación)': 'Wright, S. (1921). Correlation and causation. J Agric Res, 20(7):557–585.',
                'Mann-Whitney U':    'Mann, H.B. & Whitney, D.R. (1947). On a test of whether one of two random variables is stochastically larger than the other. Ann Math Statist, 18(1):50–60.',
                'Kruskal-Wallis':     'Kruskal, W.H. & Wallis, W.A. (1952). Use of ranks in one-criterion variance analysis. JASA, 47(260):583–621.',
                'Wilcoxon':           'Wilcoxon, F. (1945). Individual comparisons by ranking methods. Biometrics Bulletin, 1(6):80–83.',
                'Friedman':           'Friedman, M. (1937). The use of ranks to avoid the assumption of normality implicit in the analysis of variance. JASA, 32(200):675–701.',
                'Test de Signos':     'Dixon, W.J. & Mood, A.M. (1946). The statistical sign test. JASA, 41(236):557–566.',
                'ACP':                'Pearson, K. (1901). On lines and planes of closest fit to systems of points in space. Phil Mag, 2(11):559–572.',
                'Análisis Factorial': 'Thurstone, L.L. (1931). Multiple factor analysis. Psychological Review, 38(5):406–427.',
                'K-Medias':           'MacQueen, J. (1967). Some methods for classification and analysis of multivariate observations. Proc 5th Berkeley Symp Math Stat Prob, 1:281–297.',
                'LDA':                "Fisher, R.A. (1936). The use of multiple measurements in taxonomic problems. Ann Eugenics, 7(2):179–188.",
                'MANOVA':             "Wilks, S.S. (1932). Certain generalizations in the analysis of variance. Biometrika, 24(3–4):471–494.",
                'Análisis de Series Temporales': 'Box, G.E.P. & Jenkins, G.M. (1976). Time Series Analysis: Forecasting and Control. Holden-Day.',
                'Bootstrap':          'Efron, B. (1979). Bootstrap methods: Another look at the jackknife. Ann Statist, 7(1):1–26.',
                'Análisis de Supervivencia': 'Kaplan, E.L. & Meier, P. (1958). Nonparametric estimation from incomplete observations. JASA, 53(282):457–481.',
                'Modelos Mixtos':     'Laird, N.M. & Ware, J.H. (1982). Random-effects models for longitudinal data. Biometrics, 38(4):963–974.',
                'Inferencia Bayesiana': 'Bayes, T. (1763). An essay towards solving a problem in the doctrine of chances. Phil Trans R Soc, 53:370–418.',
                'Límites de Cuantificación': 'ICH Q2(R1) (2005). Validation of Analytical Procedures: Text and Methodology. International Council for Harmonisation.',
            },
            statFormulas: {
                'Media Aritmética':   'x̄ = Σxᵢ / n',
                'Mediana':            'P₅₀ = valor central',
                'Moda':               'valor más frecuente',
                'Desviación Estándar': 's = √[Σ(xᵢ − x̄)² / (n−1)]',
                'Varianza':           's² = Σ(xᵢ − x̄)² / (n−1)',
                'Percentiles':        'Pk = valor en posición k/100×(n+1), k∈{10,25,50,75,90}',
                'Rango y Amplitud':   'R = máx−mín | min = min(xi) | max = max(xi)',
                'Coeficiente de Variación': 'CV = (s / |x̄|) × 100%',
                'Asimetría (Skewness)': 'g₁ = Σ(xᵢ − x̄)³ / (n × s³)',
                'Curtosis (Kurtosis)': 'g₂ = [Σ(xᵢ − x̄)⁴ / (n × s⁴)] − 3',
                'Error Estándar':     'SE = s / √n',
                'Intervalos de Confianza': 'IC = x̄ ± t(α/2) × SE',
                'Detección de Outliers': 'IQR: [Q1−1.5×IQR, Q3+1.5×IQR] | Z-Score: |z| > 3',
                'Jarque-Bera':        'JB = (n/6)(S² + K²/4)',
                'Shapiro-Wilk':       'W ∈ [0, 1]',
                'Kolmogorov-Smirnov': 'D = max|Fₙ(x) − F(x)|',
                'Anderson-Darling':  'A² = −n − (1/n)Σ(2i−1)[ln(Fᵢ)+ln(1−Fₙ₊₁₋ᵢ)]',
                "D'Agostino-Pearson": 'K² = Z_skew² + Z_kurt²',
                'T-Test (una muestra)': 't = (x̄ − μ₀) / (s/√n)',
                'T-Test (dos muestras)': 't = (x̄₁ − x̄₂) / √(s₁²/n₁ + s₂²/n₂)',
                'ANOVA One-Way':     'F = MSB / MSW',
                'ANOVA Two-Way':      'F₁ = MSF₁/MSE, F₂ = MSF₂/MSE',
                'Chi-Cuadrado':       'χ² = Σ(O − E)² / E',
                'TOST':               '|δ| < Δ',
                'Correlación Pearson': 'r = cov(X,Y)/(σx × σy)',
                'Correlación Spearman': 'ρ = correlación de Pearson sobre rangos',
                'Correlación Kendall Tau': 'τ = (C − D) / √[(n₀−n₁)(n₀−n₂)]',
                'Covarianza':         'Cov(X,Y) = Σ(xi−x̄)(yi−ȳ) / (n−1)',
                'Regresión Lineal Simple': 'Y = a + bX',
                'Regresión Lineal Múltiple': 'Y = β₀ + β₁X₁ + ... + βₖXₖ',
                'Regresión Polinomial': 'Y = a₀ + a₁X + a₂X² + ...',
                'Regresión Logística': 'P = 1/(1+e^(−z))',
                'RMSE':               'RMSE = √[Σ(obs−pred)²/n]',
                'MAE':                'MAE = Σ|obs−pred|/n',
                'R² (Coef. Determinación)': 'R² = 1 − SSres/SStot',
                'Mann-Whitney U':    'U = min(U₁, U₂)',
                'Kruskal-Wallis':     'H = [12/(N(N+1))]Σ(Rᵢ²/nᵢ) − 3(N+1)',
                'Wilcoxon':           'W = suma de rangos con signo',
                'Friedman':           'χ²_r = [12/(nk(k+1))]ΣRᵢ² − 3n(k+1)',
                'Test de Signos':     'signos = count(+)/count(−)',
                'ACP':                'PC = w₁X₁ + w₂X₂ + ...',
                'Análisis Factorial': 'X = LF + ε',
                'K-Medias':           'Distancia entre clusters',
                'LDA':                'D = wX + b',
                'MANOVA':             'Λ = |E|/|H+E|',
                'Análisis de Series Temporales': 'Y_t = f(Y_{t-1}, Y_{t-2}, ...) + ε_t',
                'Bootstrap':          'θ* = estimador(remuestreo)',
                'Análisis de Supervivencia': 'S(t) = P(T > t)',
                'Modelos Mixtos':     'Y = Xβ + Zu + ε',
                'Inferencia Bayesiana': 'P(θ|D) ∝ P(D|θ) × P(θ)',
                'Límites de Cuantificación': 'LQC = 10×σ_blanco',
            }
        }
    };

    function t(key, ...args) {
        const dict = I18N[currentLang];
        const val  = dict[key];
        if (typeof val === 'function') return val(...args);
        return val ?? I18N['en'][key] ?? key;
    }

    // ── Utilidades ────────────────────────
    function pad(str, len) {
        const s = String(str);
        return s.length >= len ? s.slice(0, len) : s + ' '.repeat(len - s.length);
    }
    function doubleLine(n=80) { return '═'.repeat(n); }
    function singleLine(n=80)  { return '─'.repeat(n); }

    // Formato de fecha: "20/Mar/2026"
    const MONTHS = {
        en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        es: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
    };
    function formatDate(isoDate) {
        if (!isoDate) return '—';
        const d = new Date(isoDate + 'T00:00:00');
        if (isNaN(d)) return isoDate;
        const day = String(d.getDate()).padStart(2,'0');
        const mon = MONTHS[currentLang][d.getMonth()];
        return `${day}/${mon}/${d.getFullYear()}`;
    }
    function nowDateFormatted() {
        const d = new Date();
        const day = String(d.getDate()).padStart(2,'0');
        const mon = MONTHS[currentLang][d.getMonth()];
        return `${day}/${mon}/${d.getFullYear()}`;
    }
    function nowFormatted() {
        const d   = new Date();
        const day = String(d.getDate()).padStart(2,'0');
        const mon = MONTHS[currentLang][d.getMonth()];
        const hh  = String(d.getHours()).padStart(2,'0');
        const mm  = String(d.getMinutes()).padStart(2,'0');
        const ss  = String(d.getSeconds()).padStart(2,'0');
        return `${day}/${mon}/${d.getFullYear()} ${hh}:${mm}:${ss} UTC`;
    }
    function todayFormatted() {
        return formatDate(new Date().toISOString().slice(0,10));
    }

    // Store generated hashes to ensure uniqueness
    async function generateHash(meta, res) {
        const timestamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        const s = JSON.stringify({ meta, r: res?.totalFilas, uid: timestamp });
        const data = new TextEncoder().encode(s);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
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
    
    function fmtNum(val, d=4) {
        if (val===null||val===undefined) return 'N/A';
        if (Array.isArray(val)) return val.length ? val.map(v=>Number(v).toFixed(d)).join('; ') : '—';
        if (typeof val==='number') return isFinite(val) ? val.toFixed(d) : 'N/A';
        
        // Manejar objetos (como Detección de Outliers o Intervalos de Confianza)
        if (typeof val === 'object' && !Array.isArray(val)) {
            // Caso: Intervalos de Confianza {inferior, superior, margen}
            if (val.inferior !== undefined && val.superior !== undefined) {
                const lower = val.inferior?.toFixed(4) ?? '—';
                const upper = val.superior?.toFixed(4) ?? '—';
                const margen = val.margen?.toFixed(4) ?? '';
                return `[${lower}, ${upper}]${margen ? ' ±' + margen : ''}`;
            }
            
            // Caso: Outliers {cantidad, porcentaje, limiteInferior, limiteSuperior} o {cantidad, porcentaje, umbralZScore}
            const cant = val.cantidad ?? val.cantidadOutliers ?? 0;
            const pct = val.porcentaje ?? val.porcentajeOutliers ?? 0;
            const pctStr = typeof pct === 'number' ? pct.toFixed(2) + '%' : pct;
            
            // Verificar si existen límites IQR
            const hasIQR = val.limiteInferior !== undefined && val.limiteSuperior !== undefined && 
                          val.limiteInferior !== null && val.limiteSuperior !== null;
            // Verificar si existe umbral Z-Score
            const hasZScore = val.umbralZScore !== undefined && val.umbralZScore !== null;
            
            if (hasIQR) {
                const lower = val.limiteInferior.toFixed(4);
                const upper = val.limiteSuperior.toFixed(4);
                return `${cant} (${pctStr}) [${lower}, ${upper}]`;
            } else if (hasZScore) {
                return `${cant} (${pctStr}) umbral: ${val.umbralZScore.toFixed(4)}`;
            }
            return `${cant} (${pctStr})`;
        }
        
        return String(val);
    }

    // ── Flags automáticos ─────────────────
    function computeExtendedStats(resultados) {
        const ext = {};
        const res = resultados.resultados;
        resultados.columnasAnalizadas.forEach(col => {
            const flags=[], notes=[];
            const n       = resultados.totalFilas;
            const media   = res['Media Aritmética']?.[col];
            const sd      = res['Desviación Estándar']?.[col];
            const q1      = res['Percentiles']?.[col]?.P25;
            const q3      = res['Percentiles']?.[col]?.P75;
            const min     = res['Rango y Amplitud']?.[col]?.minimo;
            const max     = res['Rango y Amplitud']?.[col]?.maximo;
            const mediana = res['Mediana']?.[col] ?? res['Mediana y Moda']?.[col];
            let cv = null;

            if (media!=null && sd!=null && media!==0) {
                cv = Math.abs((sd/media)*100);
                if (cv>FLAGS.CV_VERY_HIGH) flags.push(`[FLAG-CV-EXTREME] CV=${cv.toFixed(1)}% > ${FLAGS.CV_VERY_HIGH}%`);
                else if (cv>FLAGS.CV_HIGH) flags.push(`[FLAG-CV-HIGH] CV=${cv.toFixed(1)}% > ${FLAGS.CV_HIGH}%`);
            }
            if (n<FLAGS.N_MIN) flags.push(`[FLAG-SMALL-N] n=${n} < ${FLAGS.N_MIN}`);
            if (q1!=null && q3!=null) {
                const iqr=q3-q1;
                if (min < q1-FLAGS.OUTLIER_IQR*iqr) flags.push('[FLAG-OUTLIER-LOW] Mín bajo límite inferior');
                if (max > q3+FLAGS.OUTLIER_IQR*iqr) flags.push('[FLAG-OUTLIER-HIGH] Máx sobre límite superior');
            }
            if (media!=null && mediana!=null && sd!=null && sd>0) {
                const skew=(3*(media-mediana))/sd;
                if (Math.abs(skew)>FLAGS.SKEW_MODERATE) {
                    flags.push(`[FLAG-SKEW] Asimetría≈${skew.toFixed(2)} (cola ${skew>0?'derecha':'izquierda'})`);
                    notes.push('Distribución no normal sospechada.');
                }
             }
             // ★ Integración ParametrosManager
            let paramVerificacion = null;
            if (typeof ParametrosManager !== 'undefined') {
                const _imported = (typeof StateManager !== 'undefined') ? (typeof getDataForModal === 'function' ? getDataForModal() : StateManager.getImportedData()) : null;
                if (_imported) {
                    paramVerificacion = ParametrosManager.verificarColumna(_imported, col);
                    if (paramVerificacion && paramVerificacion.fueraDeRango > 0) {
                        const p = paramVerificacion.parametros;
                        const limites = [
                            p.min !== null ? `Mín=${p.min}` : null,
                            p.max !== null ? `Máx=${p.max}` : null,
                            p.esp !== null ? `Esp=${p.esp}` : null,
                        ].filter(Boolean).join(' · ');
                        flags.push(`[FLAG-PARAM] ${paramVerificacion.fueraDeRango}/${paramVerificacion.total} valores fuera de parámetros (${limites})`);
                    }
                }
            }
            ext[col] = { cv, flags, notes, paramVerificacion };
        });
        return ext;
    }

    // ── Generador TXT ─────────────────────
    function generarTXT(resultados, meta, hash) {
        const ext=computeExtendedStats(resultados);
        const W=80, L=[], p=s=>L.push(s);
        const lang=currentLang;
        const NA=currentLang==='es'?'NO ESPECIFICADO':'NOT SPECIFIED';

        p(doubleLine(W));
        p(`  ${t('reportTitle')}`);
        p(`  ${REGULATORY.standard} — ${t('compliant')}`);
        p(doubleLine(W));p('');
        p(`  ${pad(t('docId')+' :',24)}: RPT-${hash}`);
        p(`  ${pad(t('generated')+' :',24)}: ${nowFormatted()}`);
        p(`  ${pad(t('software')+' :',24)}: ${REGULATORY.software}`);
        p(`  ${pad(t('regulatoryRef')+' :',24)}: ${REGULATORY.standard}`);
        p('');
        p(singleLine(W)); p(`  ${t('sec1')}`); p(singleLine(W));
        p(`  ${pad(t('organization')+' :',24)}: ${meta.organizacion    ||NA}`);
        p(`  ${pad(t('department')+' :',24)}: ${meta.departamento    ||NA}`);
        p(`  ${pad(t('location')+' :',24)}: ${meta.ubicacion        ||NA}`);
        p(`  ${pad(t('description')+' :',24)}: ${meta.descripcion     ||NA}`);
        p(`  ${pad(t('assay')+' :',24)}: ${meta.ensayo           ||NA}`);
        p(`  ${pad(t('ui_modelo')+' :',24)}: ${meta.modelo          ||NA}`);
        p(`  ${pad(t('ui_serial'),24)}: ${meta.serie || NA}`);
        p(`  ${pad(t('ui_marca')+' :',24)}: ${meta.marca           ||NA}`);
        p(`  ${pad(t('studyProtocol')+' :',24)}: ${meta.protocolo       ||NA}`);
        p(`  ${pad(t('phase')+' :',24)}: ${meta.fase             ||NA}`);
        p(`  ${pad(t('projectCode')+' :',24)}: ${meta.codigoProyecto  ||NA}`);
        p(`  ${pad(t('reportVersion')+' :',24)}: ${meta.version         ||'1.0'}`);
        p(`  ${pad(t('confidentiality')+' :',24)}: ${meta.confidencialidad||'CONFIDENTIAL'}`);
        p('');
        p(singleLine(W)); p(`  ${t('sec2')}`); p(singleLine(W));
        p(`  ${pad(t('datasetName')+' :',24)}: ${meta.nombreDataset   ||NA}`);
        p(`  ${pad(t('sourceFile')+' :',24)}: ${meta.archivoFuente   ||NA}`);
        p(`  ${pad(t('collectionDate')+' :',24)}: ${formatDate(meta.fechaRecoleccion)}`);
        p(`  ${pad(t('analysisDate')+' :',24)}: ${todayFormatted()}`);
        p(`  ${pad(t('totalRecords')+' :',24)}: ${resultados.totalFilas}`);
        p(`  ${pad(t('numericColumns')+' :',24)}: ${resultados.totalColumnas}`);
        p(`  ${pad(t('analyzed')+' :',24)}: ${resultados.columnasAnalizadas.join(', ')}`);
        p(`  ${pad(t('statistics')+' :',24)}: ${resultados.estadisticos.join(', ')}`);
        p(`  ${pad(t('integrityHash')+' :',24)}: RPT-${hash}`);
        p('');
        p(singleLine(W)); p(`  ${t('sec3')}`); p(singleLine(W));
        const allFlags=Object.entries(ext).flatMap(([col,d])=>d.flags.map(f=>`  ${col}: ${f}`));
        p(allFlags.length>0?`  ${t('flagsDetected',allFlags.length)}`:`  ${t('noFlags')}`);
        allFlags.forEach(f=>p(`     ${f}`));
        p('');
        p(singleLine(W)); p(`  ${t('sec4')}`); p(singleLine(W));
        resultados.columnasAnalizadas.forEach(col=>{
            p('');
            p(`  ┌${'─'.repeat(W-4)}┐`);
            p(`  │  ${t('variable')}: ${pad(col,W-18)}│`);
            p(`  └${'─'.repeat(W-4)}┘`);
            p(`  ${pad(t('statistic'),28)}${pad(t('value'),18)}${t('reference')}`);
            p(`  ${singleLine(W-4)}`);
            const hypothesisTests = HYPOTHESIS_SET;
            Object.entries(resultados.resultados).forEach(([stat,data])=>{
                if (hypothesisTests.has(stat)) return;
                // Skip hypothesisTests, handled separately
                const val=data[col]; if(val===undefined)return;
                if(typeof val==='object'&&!Array.isArray(val)){
                    p(`  ${pad(stat+':',28)}`);
                    Object.entries(val).forEach(([k,v])=>p(`    ${pad('  · '+k,28)}${pad(fmtNum(v),18)}`));
                } else {
                    // Buscar referencia en estadisticosConfig.js (primera opción) o statRefs (fallback)
                    const rawRef = (typeof estadisticosConfig !== 'undefined' && estadisticosConfig[stat]?.referencia) 
                        ? estadisticosConfig[stat].referencia 
                        : t('statRefs')[stat] || '';
                    const ref = formatReferencia(rawRef);
                    p(`  ${pad(stat+':',28)}${pad(fmtNum(val),18)}${ref}`);
                }
            });
             if(ext[col]?.cv!=null) p(`  ${pad(t('cv')+':',28)}${pad(ext[col].cv.toFixed(2)+'%',18)}${t('cvRef')}`);

             // Parámetros de control definidos por el usuario
            if (ext[col]?.paramVerificacion) {
                const pv = ext[col].paramVerificacion;
                const p_ = pv.parametros;
                p('');
                p(`  ${singleLine(W-4)}`);
                p(`  PARÁMETROS DE CONTROL DEFINIDOS`);
                if (p_.min !== null) p(`  ${pad('  Límite Mínimo :',28)}${pad(String(p_.min),18)}`);
                if (p_.max !== null) p(`  ${pad('  Límite Máximo :',28)}${pad(String(p_.max),18)}`);
                if (p_.esp !== null) p(`  ${pad('  Esperanza     :',28)}${pad(String(p_.esp),18)}`);
                p(`  ${pad('  Fuera de rango:',28)}${pv.fueraDeRango} / ${pv.total} valores`);
                p(`  ${pad('  Cumplimiento  :',28)}${pv.porcentajeCumplimiento}%`);
                p(`  ${pad('  Media real    :',28)}${pv.mediaReal !== null ? Number(pv.mediaReal).toFixed(4) : '—'}`);
            }

             if(ext[col].flags.length){p('');p(`  ⚠  ${t('flagsLabel')}:`);ext[col].flags.forEach(f=>p(`     ${f}`));}
             p('');


        });
        
        // ── Pruebas de Hipótesis ──
        const hypothesisTests = HYPOTHESIS_SET;
        const hypResults = Object.entries(resultados.resultados).filter(([stat]) => hypothesisTests.has(stat));
        if (hypResults.length > 0) {
            p(singleLine(W)); p(`  ${lang === 'es' ? 'PRUEBAS DE HIPÓTESIS Y ESPECIFICACIÓN' : 'HYPOTHESIS AND SPECIFICATION TESTS'} (α = 0.05)`); p(singleLine(W));
            p('');
            hypResults.forEach(([stat, data]) => {
                if (stat === 'T-Test (dos muestras)') {
                    const keys = Object.keys(data).filter(k => !EXCLUDE_KEYS.has(k));
                    const gk = keys[0];
                    const r = data[gk] || {};
                    p(`  ${stat} (${gk})`);
                    p(`    t = ${fmtNum(r.estadisticoT)}, df = ${fmtNum(r.gradosLibertad)}, p = ${fmtNum(r.valorP)}`);
                    p(`    Decisión: ${r.significativo ? '✗ Rechazar H₀ (significativo)' : '✓ No rechazar H₀'}`);
                } else if (stat === 'ANOVA One-Way') {
                    p(`  ${stat}`);
                    p(`    F = ${fmtNum(data.estadisticoF)}, df = ${data.dfEntre}/${data.dfDentro}, p = ${fmtNum(data.valorP)}`);
                    p(`    Decisión: ${data.significativo ? '✗ Rechazar H₀ (significativo)' : '✓ No rechazar H₀'}`);
                } else if (stat === 'Chi-Cuadrado') {
                    p(`  ${stat} (${data.columna1} vs ${data.columna2})`);
                    p(`    χ² = ${fmtNum(data.estadisticoChi2)}, df = ${data.gradosLibertad}, p = ${fmtNum(data.valorP)}`);
                    p(`    Decisión: ${data.significativo ? '✗ Asociación significativa' : '✓ Variables independientes'}`);
                } else if (stat === 'ANOVA Two-Way') {
                    p(`  ${stat}`);
                    p(`    Factor 1: F = ${fmtNum(data.factor1?.F)}, p = ${fmtNum(data.factor1?.p)}`);
                    p(`    Factor 2: F = ${fmtNum(data.factor2?.F)}, p = ${fmtNum(data.factor2?.p)}`);
                } else if (stat === 'Test de Normalidad') {
                    Object.entries(data).filter(([k]) => k !== 'error').forEach(([col, r]) => {
                        p(`  ${stat} (${col})`);
                        p(`    JB = ${fmtNum(r.estadisticoJB)}, p = ${fmtNum(r.valorP)}`);
                        p(`    Decisión: ${r.esNormal ? '✓ Distribución normal' : '✗ No normal'}`);
                    });
                } else if (stat === 'T-Test (una muestra)') {
                    Object.entries(data).filter(([k]) => k !== 'error').forEach(([col, r]) => {
                        p(`  ${stat} (${col})`);
                        p(`    t = ${fmtNum(r.estadisticoT)}, p = ${fmtNum(r.valorP)}`);
                        p(`    Decisión: ${r.significativo ? '✗ Rechazar H₀' : '✓ No rechazar H₀'}`);
                    });
                } else if (stat === 'Límites de Cuantificación') {
                    if (data.error) {
                        p(`  ${stat}: ERROR - ${data.error}`);
                    } else {
                        p(`  ${stat} (${data.columna}) — ${data.norma}`);
                        p(`    LSL = ${data.lsl} | USL = ${data.usl}`);
                        p(`    N = ${data.n} | Media = ${data.media} | DE = ${data.std}`);
                        p(`    Min = ${data.min} | Max = ${data.max}`);
                        p(`    Dentro límites: ${data.dentro} (${data.porcentajeDentro}%)`);
                        p(`    OOS: ${data.fuera} (${data.porcentajeFuera}%) [Sup: ${data.fueraSuperior} | Inf: ${data.fueraInferior}]`);
                        p(`    Cp = ${fmtNum(data.cp)} | Cpk = ${fmtNum(data.cpk)}`);
                        const cpkText = data.cpk === 'N/A' ? 'N/A' : (data.cpk >= 1.33 ? '✓ Capable (Cpk ≥ 1.33)' : (data.cpk >= 1.0 ? '⚠ Marginal' : '✗ Not Capable'));
                        p(`    Decisión: ${cpkText}`);
                    }
                } else if (stat === 'Correlación Pearson') {
                    if (data.error) {
                        p(`  ${stat}: ERROR - ${data.error}`);
                    } else {
                        p(`  ${stat} (${data.columnaX} vs ${data.columnaY})`);
                        p(`    r = ${fmtNum(data.r)} | R² = ${fmtNum(data.r2)}`);
                        p(`    Valor p = ${fmtNum(data.pValue)} | IC 95% = [${fmtNum(data.ic95Lower)}, ${fmtNum(data.ic95Upper)}]`);
                        p(`    n = ${data.n} | ${data.significante ? '★ Significativo' : '✓ No significativo'}`);
                        p(`    Interpretación: ${data.interpretacion}`);
                    }
                } else if (stat === 'Correlación Spearman') {
                    if (data.error) {
                        p(`  ${stat}: ERROR - ${data.error}`);
                    } else {
                        p(`  ${stat} (${data.columnaX} vs ${data.columnaY})`);
                        p(`    ρ = ${fmtNum(data.rho)} | ρ² = ${fmtNum(data.rho2)}`);
                        p(`    Valor p = ${fmtNum(data.pValue)}`);
                        p(`    n = ${data.n} | ${data.significante ? '★ Significativo' : '✓ No significativo'}`);
                        p(`    Interpretación: ${data.interpretacion}`);
                    }
                } else if (stat === 'Regresión Lineal Simple') {
                    if (data.error) {
                        p(`  ${stat}: ERROR - ${data.error}`);
                    } else {
                        p(`  ${stat} (${data.columnaX} → ${data.columnaY})`);
                        p(`    Modelo: ${data.formula}`);
                        p(`    Intercepto (a) = ${fmtNum(data.a)} | Pendiente (b) = ${fmtNum(data.b)}`);
                        p(`    R² = ${fmtNum(data.r2)} | R² ajustado = ${fmtNum(data.r2Adj)}`);
                        p(`    Error estándar = ${fmtNum(data.errorEstandar)}`);
                        p(`    p-valor (pendiente) = ${fmtNum(data.pPendiente)}`);
                        p(`    IC 95% pendiente = [${fmtNum(data.icPendienteLower)}, ${fmtNum(data.icPendienteUpper)}]`);
                        p(`    n = ${data.n} | ${data.significante ? '★ Modelo significativo' : '✓ Modelo no significativo'}`);
                        p(`    Interpretación: ${data.interpretacion}`);
                    }
                } else if (stat === 'Regresión Lineal Múltiple') {
                    if (data.error) {
                        p(`  ${stat}: ERROR - ${data.error}`);
                    } else {
                        p(`  ${stat} (Y = ${data.columnaY}, X = [${data.columnasX?.join(', ')}])`);
                        p(`    R² = ${fmtNum(data.r2)} | R² ajustado = ${fmtNum(data.r2Adj)}`);
                        p(`    Error estándar = ${fmtNum(data.errorEstandar)}`);
                        p(`    Predictores = ${data.k} | Observaciones = ${data.n}`);
                        p(`    Coeficientes: ${data.betas?.join(', ') || 'N/A'}`);
                        p(`    ${data.significante ? '★ Al menos un predictor significativo' : '✓ Ningún predictor significativo'}`);
                        p(`    Interpretación: ${data.interpretacion}`);
                    }
                } else if (stat === 'Regresión Polinomial') {
                    if (data.error) {
                        p(`  ${stat}: ERROR - ${data.error}`);
                    } else {
                        p(`  ${stat} (${data.columnaX} → ${data.columnaY}, grado ${data.grado})`);
                        p(`    Modelo: ${data.formula}`);
                        p(`    R² = ${fmtNum(data.r2)} | R² ajustado = ${fmtNum(data.r2Adj)}`);
                        p(`    Error estándar = ${fmtNum(data.errorEstandar)}`);
                        p(`    Observaciones = ${data.n} | Grado = ${data.grado}`);
                        p(`    ${data.significante ? '★ Modelo significativo' : '✓ Modelo no significativo'}`);
                        p(`    Interpretación: ${data.interpretacion}`);
                    }
                } else if (stat === 'Regresión Logística') {
                    if (data.error) {
                        p(`  ${stat}: ERROR - ${data.error}`);
                    } else {
                        p(`  ${stat} (Y = ${data.columnaY}, X = [${data.columnasX?.join(', ')}])`);
                        p(`    Exactitud = ${fmtNum(data.exactitud * 100)}% | Precisión = ${fmtNum(data.precision * 100)}%`);
                        p(`    Recall = ${fmtNum(data.recall * 100)}% | F1 = ${fmtNum(data.f1 * 100)}%`);
                        p(`    VP=${data.vp} FP=${data.fp} VN=${data.vn} FN=${data.fn}`);
                        p(`    Variables = ${data.k} | Observaciones = ${data.n}`);
                        p(`    Interpretación: ${data.interpretacion}`);
                    }
                }
                p('');
            });
        }
        
        p(singleLine(W)); p(`  ${t('sec5')}`); p(singleLine(W));
        const txtStatsInfo = {
          'Media Aritmética': {
            name: lang === 'es' ? 'Media Aritmética' : 'Arithmetic Mean',
            desc: lang === 'es' ? 'Suma de valores / n observaciones' : 'Sum of values / n observations',
            formula: 'x̄ = Σxᵢ / n'
          },
          'Mediana y Moda': {
            name: lang === 'es' ? 'Mediana' : 'Median',
            desc: lang === 'es' ? 'Valor central de datos ordenados' : 'Central value of sorted data',
            formula: lang === 'es' ? 'Si n impar: x₍(n+1)/2₎ · Si n par: (x₍n/2₎ + x₍n/2+1₎) / 2' : 'If n odd: x₍(n+1)/2₎ · If n even: (x₍n/2₎ + x₍n/2+1₎) / 2'
          },
          'Desviación Estándar': {
            name: lang === 'es' ? 'Desviación Estándar' : 'Standard Deviation',
            desc: lang === 'es' ? 'Raíz cuadrada de la varianza' : 'Square root of variance',
            formula: 's = √[Σ(xᵢ - x̄)² / (n-1)]'
          },
          'Varianza': {
            name: lang === 'es' ? 'Varianza' : 'Variance',
            desc: lang === 'es' ? 'Cuadrado de la desviación estándar' : 'Square of standard deviation',
            formula: 's² = Σ(xᵢ - x̄)² / (n-1)'
          },
          'Percentiles': {
            name: lang === 'es' ? 'Percentiles' : 'Percentiles',
            desc: lang === 'es' ? 'Valores que dividen la distribución en 100 partes' : 'Values dividing distribution into 100 parts',
            formula: lang === 'es' ? 'Posición = (p/100) × (n+1)' : 'Position = (p/100) × (n+1)'
          },
          'Rango y Amplitud': {
            name: lang === 'es' ? 'Rango' : 'Range',
            desc: lang === 'es' ? 'Diferencia entre máximo y mínimo' : 'Difference between max and min',
            formula: 'R = xₘₐₓ - xₘᵢₙ'
          },
          'Coeficiente de Variación': {
            name: lang === 'es' ? 'Coeficiente de Variación' : 'Coefficient of Variation',
            desc: lang === 'es' ? 'Dispersión relativa respecto a la media (en porcentaje)' : 'Relative dispersion relative to mean (percentage)',
            formula: 'CV = (s / x̄) × 100%'
          },
          'Asimetría (Skewness)': {
            name: lang === 'es' ? 'Asimetría' : 'Skewness',
            desc: lang === 'es' ? 'Falta de simetría de la distribución' : 'Distribution asymmetry',
            formula: 'g₁ = [Σ(xᵢ - x̄)³ / n] / s³'
          },
          'Curtosis (Kurtosis)': {
            name: lang === 'es' ? 'Curtosis' : 'Kurtosis',
            desc: lang === 'es' ? 'Apuntamiento de la distribución' : 'Distribution peakedness',
            formula: 'g₂ = [Σ(xᵢ - x̄)⁴ / n] / s⁴ - 3'
          },
          'Error Estándar': {
            name: lang === 'es' ? 'Error Estándar' : 'Standard Error',
            desc: lang === 'es' ? 'Variabilidad de la media muestral' : 'Sample mean variability',
            formula: 'SE = s / √n'
          },
          'Intervalos de Confianza': {
            name: lang === 'es' ? 'Intervalos de Confianza' : 'Confidence Intervals',
            desc: lang === 'es' ? 'Rango del parámetro poblacional' : 'Population parameter range',
            formula: 'IC = x̄ ± t(α/2, n-1) × SE'
          },
          'Detección de Outliers': {
            name: lang === 'es' ? 'Detección de Outliers' : 'Outlier Detection',
            desc: lang === 'es' ? 'Identifica valores atípicos (IQR)' : 'Identifies outliers (IQR)',
            formula: lang === 'es' ? '[Q1-1.5×IQR, Q3+1.5×IQR]' : '[Q1-1.5×IQR, Q3+1.5×IQR]'
          },
          'Correlación Pearson': {
            name: lang === 'es' ? 'Correlación de Pearson' : 'Pearson Correlation',
            desc: lang === 'es' ? 'Mide relación lineal entre dos variables' : 'Measures linear relationship between two variables',
            formula: 'r = cov(X,Y) / (σx × σy)'
          },
          'Correlación Spearman': {
            name: lang === 'es' ? 'Correlación de Spearman' : 'Spearman Correlation',
            desc: lang === 'es' ? 'Mide relación monotónica basada en rangos' : 'Measures monotonic relationship based on ranks',
            formula: 'ρ = correlación de Pearson sobre rangos'
          },
          'Regresión Lineal Simple': {
            name: lang === 'es' ? 'Regresión Lineal Simple' : 'Simple Linear Regression',
            desc: lang === 'es' ? 'Modelo predictivo Y = a + bX' : 'Predictive model Y = a + bX',
            formula: 'Y = a + bX'
          },
          'Regresión Lineal Múltiple': {
            name: lang === 'es' ? 'Regresión Lineal Múltiple' : 'Multiple Linear Regression',
            desc: lang === 'es' ? 'Modelo con múltiples predictores' : 'Model with multiple predictors',
            formula: 'Y = β₀ + β₁X₁ + ... + βₖXₖ'
          },
          'Regresión Polinomial': {
            name: lang === 'es' ? 'Regresión Polinomial' : 'Polynomial Regression',
            desc: lang === 'es' ? 'Modelo de ajuste polinomial' : 'Polynomial curve fitting model',
            formula: 'Y = a₀ + a₁X + a₂X² + ...'
          },
          'Regresión Logística': {
            name: lang === 'es' ? 'Regresión Logística' : 'Logistic Regression',
            desc: lang === 'es' ? 'Clasificación binaria' : 'Binary classification',
            formula: 'P = 1/(1+e^(-z))'
          },
          'Test de Shapiro-Wilk': {
            name: lang === 'es' ? 'Test de Shapiro-Wilk' : 'Shapiro-Wilk Test',
            desc: lang === 'es' ? 'Verifica distribución normal (más potente para n<50)' : 'Verifies normal distribution (more powerful for n<50)',
            formula: 'W = (Σaᵢx₍ᵢ₎)² / Σ(xᵢ − x̄)²'
          },
          'Correlación Kendall Tau': {
            name: lang === 'es' ? 'Correlación de Kendall Tau' : 'Kendall Tau Correlation',
            desc: lang === 'es' ? 'Asociación ordinal entre dos variables' : 'Ordinal association between two variables',
            formula: 'τ = (C − D) / √[(n₀−n₁)(n₀−n₂)]'
          },
          'Covarianza': {
            name: lang === 'es' ? 'Covarianza' : 'Covariance',
            desc: lang === 'es' ? 'Relación lineal entre dos variables' : 'Linear relationship between two variables',
            formula: 'Cov(X,Y) = Σ(xi−x̄)(yi−ȳ) / (n−1)'
          },
          'RMSE': {
            name: 'RMSE',
            desc: lang === 'es' ? 'Error cuadrático medio' : 'Root Mean Square Error',
            formula: 'RMSE = √[Σ(obs−pred)²/n]'
          },
          'MAE': {
            name: 'MAE',
            desc: lang === 'es' ? 'Error absoluto medio' : 'Mean Absolute Error',
            formula: 'MAE = Σ|obs−pred|/n'
          },
          'R² (Coef. Determinación)': {
            name: lang === 'es' ? 'R² (Coef. de Determinación)' : 'R² (Coefficient of Determination)',
            desc: lang === 'es' ? 'Varianza explicada por el modelo' : 'Variance explained by the model',
            formula: 'R² = 1 − SSres/SStot'
          },
          'Mann-Whitney U': {
            name: 'Mann-Whitney U',
            desc: lang === 'es' ? 'Alternativa no-paramétrica al t-test' : 'Non-parametric alternative to t-test',
            formula: 'U = min(U₁, U₂)'
          },
          'Kruskal-Wallis': {
            name: 'Kruskal-Wallis',
            desc: lang === 'es' ? 'Alternativa no-paramétrica al ANOVA' : 'Non-parametric alternative to ANOVA',
            formula: 'H = [12/(N(N+1))]Σ(Rᵢ²/nᵢ) − 3(N+1)'
          }
        };
        const usedTxtStats = resultados.estadisticos || [];
        usedTxtStats.forEach(stat => {
          const info = txtStatsInfo[stat];
          if (info) {
            p('');
            p(`  ${info.name}`);
            p(`    ${info.desc}`);
            p(`    Fórmula: ${info.formula}`);
          }
        });
        p('');
        p(singleLine(W)); p(`  ${t('sec6')} (21 CFR Part 11)`); p(singleLine(W));
        [[t('preparedBy'),'preparedBy','preparedTitle','preparedDate'],
         [t('reviewedBy'),'reviewedBy','reviewedTitle','reviewedDate'],
         [t('approvedBy'),'approvedBy','approvedTitle','approvedDate']].forEach(([role,kb,kt,kd])=>{
            p('');p(`  ${role}`);
            p(`    ${t('name')}  : ${meta[kb]||''}`);
            p(`    ${t('title')} : ${meta[kt]||''}`);
            p(`    ${t('date')}  : ${formatDate(meta[kd])}`);
        });
        p('');p(doubleLine(W));
        p(`  ${t('endOfReport')} — RPT-${hash}`);
        p(`  ${REGULATORY.software} | ${REGULATORY.standard} | ${nowFormatted()}`);
        p(doubleLine(W));
        return L.join('\n');
    }

    // ── Generador CSV ─────────────────────
    function generarCSV(resultados, meta, hash) {
        const ext=computeExtendedStats(resultados);
        const rows=[
            `## ${t('reportTitle')}`,
            `## ${t('docId')}|RPT-${hash}`,
            `## ${t('generated')}|${nowFormatted()}`,
            `## ${t('software')}|${REGULATORY.software}`,
            `## Standard|${REGULATORY.standard}`,
            `## ${t('organization')}|${meta.organizacion||''}`,
            `## ${t('department')}|${meta.departamento||''}`,
            `## ${t('location')}|${meta.ubicacion||''}`,
            `## ${t('assay')}|${meta.ensayo||''}`,
            `## ${t('ui_modelo')}|${meta.modelo||''}`,
            `## ${t('ui_serial')}|${meta.serie||''}`,
            `## ${t('ui_marca')}|${meta.marca||''}`,
            `## Protocol|${meta.protocolo||''}`,
            `## ${t('datasetName')}|${meta.nombreDataset||''}`,
            `## ${t('preparedBy')}|${meta.preparedBy||''}`,
            `## ${t('totalRecords')}|${resultados.totalFilas}`,
            '##',
             `${t('variable')}|${t('statistic')}|SUB_KEY|${t('value')}|CV_PCT|PARAM_MIN|PARAM_MAX|PARAM_ESP|PARAM_FUERA|PARAM_CUMPLIMIENTO_PCT|FLAG_COUNT|FLAGS`
         ];

         resultados.columnasAnalizadas.forEach(col=>{
            const cv          = ext[col]?.cv?.toFixed(4) ?? '';
            const flagCount   = ext[col]?.flags?.length  ?? 0;
            const flagsTxt    = (ext[col]?.flags ?? []).join(' | ');
            const pv          = ext[col]?.paramVerificacion;
            const paramMin    = pv?.parametros?.min  ?? '';
            const paramMax    = pv?.parametros?.max  ?? '';
            const paramEsp    = pv?.parametros?.esp  ?? '';
            const paramFuera  = pv != null ? pv.fueraDeRango  : '';
            const paramCumpl  = pv != null ? pv.porcentajeCumplimiento : '';

            Object.entries(resultados.resultados).forEach(([stat,data])=>{
                const val=data[col]; if(val===undefined)return;
                if(typeof val==='object'&&!Array.isArray(val)){
                    Object.entries(val).forEach(([k,v])=>rows.push(
                        [col,stat,k,fmtNum(v,6),cv,paramMin,paramMax,paramEsp,paramFuera,paramCumpl,flagCount,flagsTxt].join('|')
                    ));
                } else if(Array.isArray(val)){
                    rows.push([col,stat,'MODE',val.map(v=>fmtNum(v,6)).join(';'),cv,paramMin,paramMax,paramEsp,paramFuera,paramCumpl,flagCount,flagsTxt].join('|'));
                } else {
                    rows.push([col,stat,'',fmtNum(val,6),cv,paramMin,paramMax,paramEsp,paramFuera,paramCumpl,flagCount,flagsTxt].join('|'));
                }
            });
        });
        return rows.join('\n');
    }

    // ── Generador HTML ────────────────────
    function generarHTML(resultados, meta, hash) {
        const ext=computeExtendedStats(resultados);
        const totalFlags=Object.values(ext).reduce((a,d)=>a+d.flags.length,0);
        const lang=currentLang;
        
        // Generar contenido del QR - con toda la info
        const qrContent = [
            'RPT-' + hash.substring(0, 12),
            nowDateFormatted(),
            resultados.totalFilas,
            resultados.totalColumnas,
            (meta.nombreDataset || '-').substring(0, 15),
            (meta.organizacion || '-').substring(0, 18),
            (meta.preparedBy || '-').substring(0, 18)
        ].join('|');
        
        // Generar QR con logo en el centro
        let qrDataUrl = '';
        try {
            const canvas = document.createElement('canvas');
            QRCode.toCanvas(canvas, qrContent, {
                errorCorrectionLevel: 'L',
                width: 150,
                margin: 1,
                color: { dark: '#000000', light: '#ffffff' }
            });
            
            // Agregar logo SAP2.0
            const ctx = canvas.getContext('2d');
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            
            // Fondo blanco redondo
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cx, cy, 18, 0, Math.PI * 2);
            ctx.fill();
            
            // Texto azul
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('SAP', cx, cy - 6);
            ctx.fillText('2.0', cx, cy + 6);
            
            qrDataUrl = canvas.toDataURL('image/png');
        } catch (e) {
            qrDataUrl = '';
        }

        function statsRows(col){
            const refs=t('statRefs');
            const formulas=t('statFormulas');
            let h='';
            const hypothesisTests = HYPOTHESIS_SET;
            Object.entries(resultados.resultados).forEach(([stat,data])=>{
                if (hypothesisTests.has(stat)) return; // Skip hypothesis tests - shown separately
                const val=data[col]; if(val===undefined)return;
                if(typeof val==='object'&&!Array.isArray(val)){
                    const formula = formulas[stat] || '';
                    h+=`<tr style="background:#f7f8fa"><td colspan="3" style="padding:5px 14px;font-size:8.5pt;color:#666"><em>${escapeHtml(stat)}</em></td></tr>`;
                    Object.entries(val).forEach(([k,v])=>h+=`<tr><td style="padding-left:26px;color:#555">· ${escapeHtml(k)}</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${fmtNum(v)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">${formula}</td></tr>`);
                } else {
                    const vf=Array.isArray(val)?(val.length?val.map(v=>fmtNum(v)).join(', '):'<em>—</em>'):fmtNum(val);
                    const formula = formulas[stat] || '';
                    h+=`<tr><td>${escapeHtml(stat)}</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${vf}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">${formula}</td></tr>`;
                }
            });
            if(ext[col]?.cv!=null) h+=`<tr style="background:#fffaf0"><td><strong>${t('cv')}</strong></td><td style="font-family:monospace;text-align:right;font-weight:600;color:#b7791f">${ext[col].cv.toFixed(2)}%</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">${t('cvRef')}</td></tr>`;
            // ★ Parámetros de control
            const pv = ext[col]?.paramVerificacion;
            if (pv) {
                const p_ = pv.parametros;
                const cumplPct = parseFloat(pv.porcentajeCumplimiento);
                const cumplColor = cumplPct >= 95 ? '#276749' : cumplPct >= 80 ? '#b7791f' : '#c53030';
                const cumplBg    = cumplPct >= 95 ? '#f0fff4' : cumplPct >= 80 ? '#fffbeb' : '#fff5f5';
                h += `<tr style="background:#eef2ff"><td colspan="3" style="padding:5px 14px;font-size:8pt;color:#3730a3;font-weight:600;letter-spacing:.5px">🎯 PARÁMETROS DE CONTROL</td></tr>`;
                if (p_.min !== null) h += `<tr><td style="padding-left:26px;color:#555">· Límite Mínimo</td><td style="font-family:monospace;text-align:right;color:#3730a3;font-weight:500">${p_.min}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">Definido por usuario</td></tr>`;
                if (p_.max !== null) h += `<tr><td style="padding-left:26px;color:#555">· Límite Máximo</td><td style="font-family:monospace;text-align:right;color:#3730a3;font-weight:500">${p_.max}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">Definido por usuario</td></tr>`;
                if (p_.esp !== null) h += `<tr><td style="padding-left:26px;color:#555">· Esperanza</td><td style="font-family:monospace;text-align:right;color:#3730a3;font-weight:500">${p_.esp}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">Definido por usuario</td></tr>`;
                h += `<tr><td style="padding-left:26px;color:#555">· Fuera de rango</td><td style="font-family:monospace;text-align:right;font-weight:600;color:${pv.fueraDeRango > 0 ? '#c53030' : '#276749'}">${pv.fueraDeRango} / ${pv.total}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">valores</td></tr>`;
                h += `<tr style="background:${cumplBg}"><td style="padding-left:26px;color:#555;font-weight:600">· Cumplimiento</td><td style="font-family:monospace;text-align:right;font-weight:700;color:${cumplColor}">${pv.porcentajeCumplimiento}%</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">Media real: ${pv.mediaReal !== null ? Number(pv.mediaReal).toFixed(4) : '—'}</td></tr>`;
            }
            return h;
        }
        function flagBadges(col){
            if(!ext[col]?.flags?.length) return `<span style="background:#c6f6d5;color:#276749;font-family:monospace;font-size:7.5pt;padding:3px 8px;border-radius:3px">${t('html_noFlags')}</span>`;
            return ext[col].flags.map(f=>{
                const c=f.includes('EXTREME')||f.includes('OUTLIER')?'#fed7d7;color:#c53030':f.includes('HIGH')||f.includes('SKEW')?'#fefcbf;color:#b7791f':'#bee3f8;color:#2b6cb0';
                return `<span style="background:${c};font-family:monospace;font-size:7.5pt;padding:3px 8px;border-radius:3px;display:inline-block;margin:2px 2px 2px 0">${escapeHtml(f)}</span>`;
            }).join('');
        }
        const roleLabels=[t('preparedBy'),t('reviewedBy'),t('approvedBy')];
        const roleKeys=['prepared','reviewed','approved'];
        const sigBlocks=roleKeys.map((k,i)=>{
            const name=escapeHtml(meta[k+'By']||''), title=escapeHtml(meta[k+'Title']||'—'), date=escapeHtml(formatDate(meta[k+'Date']||''));
            return `<div style="border:1px solid #e2e8f0;border-radius:6px;padding:14px">
              <div style="font-family:monospace;font-size:7pt;text-transform:uppercase;letter-spacing:1.5px;color:#1a3a6b;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:5px">${roleLabels[i]}</div>
              ${[[t('name'),name],[t('title'),title||'—'],[t('date'),date]].map(([l,v])=>
                `<div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">${l}</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:${!v||v==='—'?'#cbd5e0':'#1a202c'};${!v||v==='—'?'font-style:italic':''}">${v||''}</span></div>`).join('')}
              <div style="border-top:1px solid #1a202c;margin-top:14px;padding-top:5px;font-size:7pt;color:#718096;font-family:monospace">${t('elecRecord')} · ${REGULATORY.standard}</div>
            </div>`;
        }).join('');

        const mRow=(label,val)=>val?`<div><span class="ml">${escapeHtml(label)}</span><span class="mv">${escapeHtml(val)}</span></div>`:'';

        return `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="UTF-8">
<title>${t('html_title')} — RPT-${hash}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;600&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Source Serif 4',Georgia,serif;font-size:11pt;color:#1a202c;background:white;line-height:1.6}

.cover{background:#1a3a6b;color:white;padding:32px 50px 28px;border-bottom:6px solid #c8a951}

.doc{max-width:880px;margin:0 auto;padding:28px 50px}
.sec{margin-bottom:20px}
.sec-title{font-family:'JetBrains Mono',monospace;font-size:7.5pt;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:#1a3a6b;border-bottom:2px solid #1a3a6b;padding-bottom:6px;margin-bottom:16px;display:flex;align-items:baseline;gap:10px}
.sec-num{background:#1a3a6b;color:white;font-size:7pt;padding:2px 7px;border-radius:2px}
.meta-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px 32px}
.ml{font-family:'JetBrains Mono',monospace;font-size:7pt;color:#718096;text-transform:uppercase;letter-spacing:.8px;display:block;margin-bottom:2px}
.mv{font-size:10.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;min-height:20px;display:block}

.var-block{margin-bottom:14px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden}

.var-hdr{background:#1a3a6b;color:white;padding:10px 16px;display:flex;justify-content:space-between;align-items:center}
table{width:100%;border-collapse:collapse;font-size:9.5pt}
th{background:#f0f4f8;color:#1a3a6b;font-family:'JetBrains Mono',monospace;font-size:7pt;letter-spacing:1px;text-transform:uppercase;padding:8px 14px;text-align:left;border-bottom:1px solid #e2e8f0}
td{padding:4px 12px;border-bottom:1px solid #edf2f7;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#f7faff}
.method-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px 28px}
.mi{border-left:3px solid #e2e8f0;padding:8px 14px}
.mi h4{font-size:9pt;font-weight:600;color:#1a3a6b;margin-bottom:3px}
.mi p{font-size:8.5pt;color:#4a5568;line-height:1.5}
.mi code{font-family:'JetBrains Mono',monospace;background:#f7f8fa;padding:1px 4px;border-radius:2px;display:block;margin-top:3px;color:#2c5282;font-size:8pt}
.mi-why{font-size:8pt;color:#718096;line-height:1.55;margin-top:6px;padding-top:6px;border-top:1px dashed #e2e8f0;font-style:italic}

.sig-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.audit-box{background:#f7f8fa;border:1px solid #e2e8f0;border-radius:6px;padding:14px 18px;font-family:'JetBrains Mono',monospace;font-size:8pt;color:#718096;line-height:1.8}
.doc-footer{margin-top:44px;padding-top:18px;border-top:2px solid #1a3a6b;display:flex;justify-content:space-between;align-items:flex-end;font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:#a0aec0}

@media print{
    body{font-size:9pt}
    .cover{padding:24px 40px;page-break-after:always}
    .cover .title{font-size:22pt !important}
    .cover .subtitle{font-size:9pt !important}
    .cover .logo{font-size:8pt !important;margin-bottom:28px}
    .doc{padding:20px 40px}
    .sec{page-break-before:always;page-break-inside:auto}
    .sec:first-of-type{page-break-before:avoid}

    .var-block{page-break-inside:avoid}

    .param-detail-section{page-break-before:always}
    .param-control-section{page-break-before:always}
    .method-grid{page-break-inside:avoid}
    .mi{page-break-inside:avoid}
    .sig-grid{page-break-inside:avoid}
    .audit-box{page-break-inside:avoid}
    .doc-footer{page-break-inside:avoid;page-break-before:avoid}
    @page{margin:1.2cm;size:A4}
}

</style></head><body>

<div class="cover">
  <div style="position:relative">
    <!-- QR Code en esquina superior derecha -->
    ${qrDataUrl ? `<div style="position:absolute;top:0;right:0;background:white;padding:4px;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
      <img src="${qrDataUrl}" style="width:150px;height:150px;display:block" alt="QR Code">
    </div>` : ''}
    
    <div class="logo" style="font-family:'JetBrains Mono',monospace;font-size:9pt;letter-spacing:3px;color:rgba(255,255,255,.5);text-transform:uppercase;margin-bottom:34px">${t('html_cover_logo')}</div>
    <div class="title" style="font-size:26pt;font-weight:300;margin-bottom:6px">${t('html_title')}</div>
    <div class="subtitle" style="font-size:11pt;color:#c8a951;font-weight:300;letter-spacing:1px;margin-bottom:44px">${REGULATORY.standard} — ${t('compliant')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 40px;font-family:'JetBrains Mono',monospace;font-size:8pt;color:rgba(255,255,255,.7);border-top:1px solid rgba(255,255,255,.2);padding-top:22px">
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">${t('docId')}</strong>RPT-${hash}</div>
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">${t('organization')}</strong>${escapeHtml(meta.organizacion)||'—'}</div>
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">${t('assay')}</strong>${escapeHtml(meta.ensayo)||'—'}</div>
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">${t('phase')}</strong>${escapeHtml(meta.fase)||'—'}</div>
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">${t('generated')}</strong>${nowFormatted()}</div>
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">${t('totalRecords')}</strong>${resultados.totalFilas}</div>
    </div>
  </div>
</div>

<div class="doc">
  <div class="sec">
    <div class="sec-title"><span class="sec-num">01</span>${t('html_sec1')}</div>
    <div class="meta-grid">
      ${mRow(t('organization'),  meta.organizacion)}
      ${mRow(t('department'),    meta.departamento)}
      ${mRow(t('location'),      meta.ubicacion)}
      ${mRow(t('studyProtocol'), meta.protocolo)}
      ${mRow(t('phase'),         meta.fase)}
      ${mRow(t('projectCode'),   meta.codigoProyecto)}
      ${mRow(t('reportVersion'), meta.version||'1.0')}
      <div style="grid-column:1/-1">${mRow(t('assay'),          meta.ensayo)}</div>
      <div style="grid-column:1/-1">${mRow(t('description'),    meta.descripcion)}</div>
      ${mRow(t('ui_modelo'),       meta.modelo)}
      ${mRow(t('ui_marca'),        meta.marca)}
      ${mRow(t('ui_serial'),          meta.serie)}
      <div style="grid-column:1/-1">${mRow(t('confidentiality'),meta.confidencialidad||'CONFIDENTIAL')}</div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">02</span>${t('html_sec2')}</div>
    <div class="meta-grid">
      ${mRow(t('datasetName'),   meta.nombreDataset)}
      ${mRow(t('sourceFile'),    meta.archivoFuente)}
      ${mRow(t('collectionDate'),formatDate(meta.fechaRecoleccion))}
      ${mRow(t('analysisDate'),  todayFormatted())}
      ${mRow(t('totalRecords'),  String(resultados.totalFilas))}
      ${mRow(t('numericColumns'),String(resultados.totalColumnas))}
      <div style="grid-column:1/-1">${mRow(t('analyzed'),  resultados.columnasAnalizadas.join(' · '))}</div>
      <div style="grid-column:1/-1">${mRow(t('statistics'),resultados.estadisticos.join(' · '))}</div>
      <div style="grid-column:1/-1"><span class="ml">${t('integrityHash')}</span><span class="mv" style="font-family:monospace;font-size:9pt">RPT-${hash}</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">03</span>${t('html_sec3')}</div>
    <div style="background:#f7f8fa;border-left:4px solid #1a3a6b;border-radius:0 6px 6px 0;padding:16px 20px;font-size:10.5pt;line-height:1.7">
      ${t('html_execSummary',meta.nombreDataset||'N/A',resultados.totalFilas,resultados.totalColumnas,REGULATORY.standard)}<br>
      ${t('statistics')}: ${resultados.estadisticos.join(' · ')}.
      ${meta.descripcion?`<br><br><em style="font-size:10pt;color:#4a5568">${escapeHtml(meta.descripcion)}</em>`:''}
    </div>
    <div style="margin-top:14px;padding:12px 16px;border-radius:6px;${totalFlags>0?'background:#fffbeb;border:1px solid #f6e05e':'background:#f0fff4;border:1px solid #9ae6b4'}">
      ${totalFlags>0
        ?`<strong>${t('html_flagsGlobal',totalFlags)}</strong><br><br>${Object.entries(ext).flatMap(([col,d])=>d.flags.map(f=>`<strong>${escapeHtml(col)}:</strong> ${escapeHtml(f)}`)).join('<br>')}`
        :`<strong>${t('html_noFlagsGlobal')}</strong>`}
    </div>
    ${(() => {
      const colsConParam = resultados.columnasAnalizadas
          .map(col => ext[col]?.paramVerificacion)
          .filter(pv => pv !== null && pv !== undefined);
      if (colsConParam.length === 0) return '';
      const totalFuera = colsConParam.reduce((a, pv) => a + pv.fueraDeRango, 0);
      const rows = colsConParam.map(pv => {
          const cumplPct = parseFloat(pv.porcentajeCumplimiento);
          const color = cumplPct >= 95 ? '#276749' : cumplPct >= 80 ? '#b7791f' : '#c53030';
          const bg    = cumplPct >= 95 ? '#f0fff4' : cumplPct >= 80 ? '#fffbeb' : '#fff5f5';
          return `<tr style="background:${bg}">
              <td style="font-weight:600">${escapeHtml(pv.col)}</td>
              <td style="font-family:monospace;text-align:center">${pv.parametros.min ?? '—'}</td>
              <td style="font-family:monospace;text-align:center">${pv.parametros.max ?? '—'}</td>
              <td style="font-family:monospace;text-align:center">${pv.parametros.esp ?? '—'}</td>
              <td style="font-family:monospace;text-align:right;font-weight:600;color:${pv.fueraDeRango > 0 ? '#c53030' : '#276749'}">${pv.fueraDeRango} / ${pv.total}</td>
              <td style="font-family:monospace;text-align:right;font-weight:700;color:${color}">${pv.porcentajeCumplimiento}%</td>
          </tr>`;
      }).join('');
      return `
       <div style="margin-top:14px;border:1px solid #c7d2fe;border-radius:6px;overflow:hidden">
           <div style="background:#3730a3;color:white;padding:8px 14px;font-family:monospace;font-size:8pt;letter-spacing:1px">
               🎯 CONTROL DE PARÁMETROS — ${totalFuera === 0 ? '✓ TODOS DENTRO DE LÍMITES' : `⚠ ${totalFuera} VALORES FUERA DE LÍMITES`}
           </div>
           <table style="width:100%;border-collapse:collapse;font-size:9pt">
               <thead><tr style="background:#eef2ff">
                   <th style="padding:7px 12px;text-align:left;font-family:monospace;font-size:7pt;color:#3730a3">VARIABLE</th>
                   <th style="padding:7px 12px;text-align:center;font-family:monospace;font-size:7pt;color:#3730a3">MÍN</th>
                   <th style="padding:7px 12px;text-align:center;font-family:monospace;font-size:7pt;color:#3730a3">MÁX</th>
                   <th style="padding:7px 12px;text-align:center;font-family:monospace;font-size:7pt;color:#3730a3">ESPERANZA</th>
                   <th style="padding:7px 12px;text-align:right;font-family:monospace;font-size:7pt;color:#3730a3">FUERA RANGO</th>
                   <th style="padding:7px 12px;text-align:right;font-family:monospace;font-size:7pt;color:#3730a3">CUMPLIMIENTO</th>
               </tr></thead>
               <tbody>${rows}</tbody>
           </table>
       </div>`;
   })()}
   </div>
   <div class="sec">
     <div class="sec-title"><span class="sec-num">04</span>${t('html_sec4')}</div>
     ${resultados.columnasAnalizadas.map((col, _varIdx)=>`
     <div class="var-block" style="${_varIdx === 0 ? 'page-break-before:avoid' : 'page-break-before:always'}">
       <div class="var-hdr">
         <span style="font-family:monospace;font-size:11pt;font-weight:500">${escapeHtml(col)}</span>
         <span style="font-family:monospace;font-size:8pt;color:rgba(255,255,255,.6)">n = ${resultados.totalFilas}</span>
       </div>
       <table><thead><tr>
         <th>${t('html_statCol')}</th>
         <th style="text-align:right">${t('html_valCol')}</th>
         <th style="text-align:right">${t('html_refCol')}</th>
       </tr></thead><tbody>${statsRows(col)}</tbody></table>
       ${ext[col]?.flags?.length
         ?`<div style="padding:12px 16px;background:#fffcf0;border-top:1px solid #fce8a0"><div style="font-family:monospace;font-size:7.5pt;color:#b7791f;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">⚠ ${t('html_flagsLabel')}</div>${flagBadges(col)}</div>`
         :`<div style="padding:10px 16px;background:#f0fff4;border-top:1px solid #c6f6d5;color:#276749;font-size:9pt">${t('html_noFlags')}</div>`}
     </div>`).join('')}
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">05</span>${t('html_sec5')}</div>
    <div class="method-grid">
      ${(() => {
        // Obtener metadata desde estadisticosConfig.js si está disponible
        let statsInfo = {};
        
        if (typeof getStatMetaConfig === 'function') {
          const metaConfig = getStatMetaConfig();
          Object.entries(metaConfig).forEach(([key, val]) => {
            statsInfo[key] = {
              title: key,
              desc: val.desc || '',
              formula: val.formula || '',
              hipotesis: val.hipotesis || null,
              supuestos: val.supuestos || [],
              efectoTamano: val.efectoTamano || null,
              referencia: formatReferencia(val.referencia) || ''
            };
          });
        } else {
          // Fallback: objeto hardcoded - si getStatMetaConfig no está disponible
          // Usar objeto vacío para evitar errores
          statsInfo = {};
        }
        
        const usedStats = resultados.estadisticos || [];
        
        const methodItems = usedStats
          .filter(stat => statsInfo[stat])
          .map(stat => {
            const info = statsInfo[stat];
            
            // Construir contenido adicional
            let extraHtml = '';
            
            if (info.hipotesis) {
                extraHtml += `<div style="margin-top:6px;padding:4px 8px;background:#e7f3ff;border-radius:3px;font-size:7.5pt"><strong>Hipótesis:</strong> H₀: ${info.hipotesis.h0}</div>`;
            }
            
            if (info.supuestos && info.supuestos.length > 0) {
                extraHtml += `<div style="margin-top:4px;padding:4px 8px;background:#fff3cd;border-radius:3px;font-size:7.5pt"><strong>Supuestos:</strong> ${info.supuestos.join(', ')}</div>`;
            }
            
            if (info.efectoTamano) {
                extraHtml += `<div style="margin-top:4px;padding:4px 8px;background:#d1ecf1;border-radius:3px;font-size:7.5pt"><strong>Efecto:</strong> ${info.efectoTamano.metrica} (${info.efectoTamano.formula})</div>`;
            }
            
            if (info.referencia) {
                extraHtml += `<div style="margin-top:4px;padding:4px 8px;background:#f8f9fa;border-radius:3px;font-size:7pt;font-style:italic;color:#6c757d"><strong>Ref:</strong> ${info.referencia}</div>`;
            }
            
            return `<div class="mi"><h4>${info.title}</h4><p>${info.desc}</p><code>${info.formula}</code>${extraHtml}</div>`;
          })
          .join('');
        
        return methodItems || `<div class="mi"><p>${lang === 'es' ? 'No se seleccionaron estadísticos para el análisis.' : 'No statistics selected for analysis.'}</p></div>`;
      })()}
    </div>
  </div>
  ${(() => {
      const hypothesisTests = HYPOTHESIS_SET;
      const hypResults = Object.entries(resultados.resultados).filter(([stat]) => hypothesisTests.has(stat));
      if (hypResults.length === 0) return '';

      const hypRows = hypResults.map(([stat, data]) => {
          let content = '';
          if (stat === 'T-Test (dos muestras)') {
              const keys = Object.keys(data).filter(k => !EXCLUDE_KEYS.has(k));
              const gk = keys[0];
              const r = data[gk] || {};
              content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(gk)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">t=${fmtNum(r.estadisticoT)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(r.valorP)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${r.significativo?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${r.significativo?'✗ Significativo':'✓ No significativo'}</span></td></tr>`;
          } else if (stat === 'ANOVA One-Way') {
              content = `<tr><td>${escapeHtml(stat)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">F=${fmtNum(data.estadisticoF)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(data.valorP)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.significativo?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${data.significativo?'✗ Significativo':'✓ No significativo'}</span></td></tr>`;
          } else if (stat === 'Chi-Cuadrado') {
              content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columna1)} vs ${escapeHtml(data.columna2)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">χ²=${fmtNum(data.estadisticoChi2)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(data.valorP)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.significativo?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${data.significativo?'✗ Asociación significativa':'✓ Independientes'}</span></td></tr>`;
          } else if (stat === 'ANOVA Two-Way') {
              content = `<tr><td>${escapeHtml(stat)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">F1=${fmtNum(data.factor1?.F)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p1=${fmtNum(data.factor1?.p)}</td><td style="text-align:center">—</td></tr>`;
          } else if (stat === 'Test de Normalidad') {
              content = Object.entries(data).filter(([k]) => k !== 'error').map(([col, r]) => `<tr><td>${escapeHtml(stat)} (${escapeHtml(col)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">JB=${fmtNum(r.estadisticoJB)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(r.valorP)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${!r.esNormal?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${!r.esNormal?'✗ No normal':'✓ Normal'}</span></td></tr>`).join('');
          } else if (stat === 'Test de Shapiro-Wilk') {
              content = Object.entries(data).filter(([k]) => k !== 'error').map(([col, r]) => `<tr><td>${escapeHtml(stat)} (${escapeHtml(col)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">W=${fmtNum(r.estadisticoW)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(r.valorP)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${!r.esNormal?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${!r.esNormal?'✗ No normal':'✓ Normal'}</span></td></tr>`).join('');
          } else if (stat === 'T-Test (una muestra)') {
              content = Object.entries(data).filter(([k]) => k !== 'error').map(([col, r]) => `<tr><td>${escapeHtml(stat)} (${escapeHtml(col)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">t=${fmtNum(r.estadisticoT)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(r.valorP)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${r.significativo?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${r.significativo?'✗ Significativo':'✓ No significativo'}</span></td></tr>`).join('');
          } else if (stat === 'Límites de Cuantificación') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  const cpkClass = data.cpk === 'N/A' ? 'background:#e2e8f0;color:#4a5568' : (data.cpk >= 1.33 ? 'background:#c6f6d5;color:#276749' : (data.cpk >= 1.0 ? 'background:#fefcbf;color:#b7791f' : 'background:#fed7d7;color:#c53030'));
                  const cpkText = data.cpk === 'N/A' ? 'N/A' : (data.cpk >= 1.33 ? '✓ Capable' : (data.cpk >= 1.0 ? '⚠ Marginal' : '✗ Not Capable'));
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columna)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">Cpk=${fmtNum(data.cpk)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">${data.porcentajeFuera}% OOS</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${cpkClass}">${cpkText}</span></td></tr>`;
              }
          } else if (stat === 'Correlación Pearson') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columnaX)} vs ${escapeHtml(data.columnaY)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">r=${fmtNum(data.r)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(data.pValue)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.significante?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${data.significante?'★ Significativo':'✓ No significativo'}</span></td></tr>`;
              }
          } else if (stat === 'Correlación Spearman') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columnaX)} vs ${escapeHtml(data.columnaY)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">ρ=${fmtNum(data.rho)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(data.pValue)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.significante?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${data.significante?'★ Significativo':'✓ No significativo'}</span></td></tr>`;
              }
          } else if (stat === 'Regresión Lineal Simple') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columnaX)} → ${escapeHtml(data.columnaY)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">R²=${fmtNum(data.r2)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(data.pPendiente)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.significante?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${data.significante?'★ Significativo':'✓ No significativo'}</span></td></tr>`;
              }
          } else if (stat === 'Regresión Lineal Múltiple') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (${data.columnasX?.map(escapeHtml).join(', ')})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">R²=${fmtNum(data.r2)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">k=${data.k}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.significante?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${data.significante?'★ Significativo':'✓ No significativo'}</span></td></tr>`;
              }
          } else if (stat === 'Regresión Polinomial') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (grado ${data.grado})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">R²=${fmtNum(data.r2)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">g=${data.grado}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.significante?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${data.significante?'★ Significativo':'✓ No significativo'}</span></td></tr>`;
              }
          } else if (stat === 'Regresión Logística') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">ACC=${fmtNum(data.exactitud*100)}%</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">F1=${fmtNum(data.f1*100)}%</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.exactitud >= 0.7 ? 'background:#c6f6d5;color:#276749' : 'background:#fefcbf;color:#b7791f'}">${data.exactitud >= 0.8 ? '✓Excelente' : data.exactitud >= 0.6 ? '⚠Aceptable' : '✗Bajo'}</span></td></tr>`;
              }
          } else if (stat === 'R² (Coef. Determinación)') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  const r2 = data.r2;
                  const r2Class = r2 >= 0.9 ? 'background:#c6f6d5;color:#276749' : r2 >= 0.7 ? 'background:#fefcbf;color:#b7791f' : 'background:#fed7d7;color:#c53030';
                  const r2Text = r2 >= 0.9 ? '✓Excelente' : r2 >= 0.7 ? '⚠Moderado' : '✗Pobre';
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columnaObservada)} vs ${escapeHtml(data.columnaPredicha)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">R²=${fmtNum(data.r2)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">n=${data.n}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${r2Class}">${r2Text}</span></td></tr>`;
              }
          } else if (stat === 'RMSE') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columnaObservada)} vs ${escapeHtml(data.columnaPredicha)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">RMSE=${fmtNum(data.rmse)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">n=${data.n}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;background:#e2e8f0;color:#4a5568">—</span></td></tr>`;
              }
          } else if (stat === 'MAE') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columnaObservada)} vs ${escapeHtml(data.columnaPredicha)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">MAE=${fmtNum(data.mae)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">n=${data.n}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;background:#e2e8f0;color:#4a5568">—</span></td></tr>`;
              }
          } else if (stat === 'Covarianza') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columnaX)} vs ${escapeHtml(data.columnaY)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">Cov=${fmtNum(data.covarianza)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">n=${data.n}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;background:#e2e8f0;color:#4a5568">—</span></td></tr>`;
              }
          } else if (stat === 'Correlación Kendall Tau') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columnaX)} vs ${escapeHtml(data.columnaY)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">τ=${fmtNum(data.tau)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(data.pValue)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.significante?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${data.significante?'★ Significativo':'✓ No significativo'}</span></td></tr>`;
              }
          } else if (stat === 'Mann-Whitney U') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columnaAgrupacion)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">U=${fmtNum(data.U)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(data.valorP)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.significativo?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${data.significativo?'✗ Significativo':'✓ No significativo'}</span></td></tr>`;
              }
          } else if (stat === 'Análisis Factorial') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  const nFact = data.nFactores || 0;
                  const kmoVal = data.KMO || 0;
                  content = `<tr><td>${escapeHtml(stat)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">${nFact} factores</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">KMO=${kmoVal.toFixed(3)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${kmoVal >= 0.6 ? 'background:#c6f6d5;color:#276749' : 'background:#fed7d7;color:#c53030'}">${kmoVal >= 0.6 ? '✓ Aceptable' : '⚠ Bajo'}</span></td></tr>`;
              }
          } else if (stat === 'PCA (Componentes Principales)') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  const nComp = data.nComponentes || 0;
                  const cumVar = data.cumulativeVariance || [];
                  const totalVar = cumVar.length > 0 ? cumVar[cumVar.length - 1].toFixed(1) : 0;
                  content = `<tr><td>${escapeHtml(stat)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">${nComp} PC</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">Var=${totalVar}%</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;background:#c6f6d5;color:#276749">✓ Completado</span></td></tr>`;
              }
          } else if (stat === 'Kruskal-Wallis') {
              if (data.error) {
                  content = `<tr><td>${escapeHtml(stat)}</td><td colspan="3" style="color:#c53030;font-style:italic">${escapeHtml(data.error)}</td></tr>`;
              } else {
                  content = `<tr><td>${escapeHtml(stat)} (${escapeHtml(data.columnaAgrupacion)})</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">H=${fmtNum(data.H)}</td><td style="font-family:monospace;text-align:right;font-weight:500;color:#2c5282">p=${fmtNum(data.valorP)}</td><td style="text-align:center"><span style="padding:2px 8px;border-radius:3px;font-size:8pt;font-weight:600;${data.significativo?'background:#fed7d7;color:#c53030':'background:#c6f6d5;color:#276749'}">${data.significativo?'✗ Significativo':'✓ No significativo'}</span></td></tr>`;
              }
          }
          return content;
      }).join('');

      return `
      <div class="sec">
        <div class="sec-title"><span class="sec-num">05B</span>${lang === 'es' ? 'Pruebas de Hipótesis' : 'Hypothesis Tests'} <span style="font-size:7pt;font-weight:400;color:#a0aec0;margin-left:8px">α = 0.05</span></div>
        <table style="width:100%;border-collapse:collapse;font-size:9pt">
          <thead><tr style="background:#f0f4f8">
            <th style="padding:7px 12px;text-align:left;font-family:monospace;font-size:7pt;color:#1a3a6b">${lang === 'es' ? 'PRUEBA' : 'TEST'}</th>
            <th style="padding:7px 12px;text-align:right;font-family:monospace;font-size:7pt;color:#1a3a6b">${lang === 'es' ? 'ESTADÍSTICO' : 'STATISTIC'}</th>
            <th style="padding:7px 12px;text-align:right;font-family:monospace;font-size:7pt;color:#1a3a6b">${lang === 'es' ? 'VALOR p' : 'p-VALUE'}</th>
            <th style="padding:7px 12px;text-align:center;font-family:monospace;font-size:7pt;color:#1a3a6b">${lang === 'es' ? 'DECISIÓN' : 'DECISION'}</th>
          </tr></thead>
          <tbody>${hypRows}</tbody>
        </table>
        <div style="margin-top:10px;padding:10px 14px;background:#f7f8fa;border-radius:4px;font-size:8.5pt;color:#555">
          ${lang === 'es' ? 'H₀: Hipótesis nula. Si p < 0.05, se rechaza H₀ con 95% de confianza.' : 'H₀: Null hypothesis. If p < 0.05, H₀ is rejected with 95% confidence.'}
        </div>
      </div>`;
  })()}
  <div class="sec">
    <div class="sec-title"><span class="sec-num">06</span>${t('html_sec6')} <span style="font-size:7pt;font-weight:400;color:#a0aec0;margin-left:8px">${t('html_auditSubpart')}</span></div>
    <div class="sig-grid">${sigBlocks}</div><br>
    <div class="audit-box">
      <strong style="color:#1a3a6b">${t('html_auditMeta')}</strong><br>
      ${t('docId')}: RPT-${hash} &nbsp;|&nbsp; ${t('software')}: ${REGULATORY.software} &nbsp;|&nbsp; ${t('generated')}: ${nowFormatted()}<br>
      Standard: ${REGULATORY.standard} &nbsp;|&nbsp; Guideline: ${REGULATORY.guideline}
    </div>
  </div>
  
  ${(() => {
      const graficos = (typeof Visualizacion !== 'undefined')
          ? Visualizacion.getGraficosParaReporte()
          : [];
      if (!graficos || graficos.length === 0) return '';

      const filas = graficos.map((g, i) => `
          <div style="margin-bottom:20px;border:1px solid #e2e8f0;border-radius:6px;
                      overflow:hidden;page-break-inside:avoid">
              <div style="background:#1a3a6b;color:white;padding:8px 14px;
                          display:flex;justify-content:space-between;align-items:center">
                  <span style="font-family:'JetBrains Mono',monospace;font-size:9pt;font-weight:500">
                      ${currentLang === 'es' ? 'Figura' : 'Figure'} ${i + 1} — ${g.titulo}
                  </span>
                  <span style="font-family:'JetBrains Mono',monospace;font-size:7.5pt;
                              color:rgba(255,255,255,0.55)">${g.tipo}</span>
              </div>
              <div style="padding:14px;text-align:center;background:#fafafa">
                  <img src="${g.imagen}"
                      style="max-width:100%;height:auto;border-radius:4px;
                              box-shadow:0 1px 6px rgba(0,0,0,0.1)"
                      alt="${g.titulo}">
              </div>
          </div>`).join('');

      return `
      <div class="sec" style="page-break-before:always">
          <div class="sec-title">
              <span class="sec-num">07</span>
              ${currentLang === 'es' ? 'Gráficos y Visualizaciones' : 'Charts & Visualizations'}
          </div>
          ${filas}
      </div>`;
  })()}

  <div class="doc-footer">
    <div><strong style="color:#1a3a6b">RPT-${hash}</strong><br>${REGULATORY.software}</div>
    <div style="text-align:center">${meta.confidencialidad||'CONFIDENTIAL'}</div>
    <div style="text-align:right">${REGULATORY.standard}<br>${todayFormatted()}</div>
  </div>
</div>
</body></html>`;
    }

    // ── Descarga ──────────────────────────
    function downloadBlob(content, filename, type) {
        const blob=new Blob([content],{type});
        const link=document.createElement('a');
        link.href=URL.createObjectURL(blob);
        link.download=filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
    async function descargar(formatos, resultados, meta) {
        const hash = await generateHash(meta, resultados);
        const base = `RPT-${hash}_${new Date().toISOString().slice(0,10)}`;
        let delay = 0;
        if(formatos.includes('html')){setTimeout(()=>downloadBlob(generarHTML(resultados,meta,hash),`${base}.html`,'text/html;charset=utf-8'),delay);delay+=350;}
        if(formatos.includes('pdf')){setTimeout(()=>{const html=generarHTML(resultados,meta,hash);const w=window.open('','_blank');w.document.write(html);w.document.close();w.print();},delay);delay+=350;}
        if(formatos.includes('txt')){setTimeout(()=>downloadBlob(generarTXT(resultados,meta,hash),`${base}.txt`,'text/plain;charset=utf-8'),delay);delay+=350;}
        if(formatos.includes('csv')){setTimeout(()=>downloadBlob(generarCSV(resultados,meta,hash),`${base}.csv`,'text/csv;charset=utf-8'),delay);}
        
        // Registrar en auditoría
        if (typeof Logger !== 'undefined') {
            Logger.logReportGenerate(formatos.join(','), base);
        }
        
        return {base, formatos};
    }

    // ── UI embebida ───────────────────────
    function buildReportesView() {
        const container=document.getElementById('reportes-editor-container');
        if(!container)return;

        const state     =StateManager.getState();
        const resultados=(typeof ultimosResultados!=='undefined')?ultimosResultados:null;
        const tieneRes  =!!(resultados?.columnasAnalizadas?.length);
        const fileName  =state.fileName||'';
        const sel       =(lbl)=>`— ${currentLang==='es'?'Seleccionar':'Select'}: ${lbl} —`;

        container.innerHTML=`
        <div class="rep-layout">
          <div class="rep-left">

            <!-- Banner estado -->
            <div class="rep-status ${tieneRes?'rep-status-ok':'rep-status-warn'}">
              <div class="rep-status-icon">${tieneRes?'✓':'!'}</div>
              <div>
                <div class="rep-status-title">${tieneRes?t('ui_statusOk'):t('ui_statusWarn')}</div>
                <div class="rep-status-sub">${tieneRes?t('ui_statusSubOk',resultados.totalFilas,resultados.totalColumnas,resultados.estadisticos.length):t('ui_statusSubWarn')}</div>
              </div>
            </div>

            ${tieneRes?`
            <div class="rep-card">
              <div class="rep-card-title">${t('ui_analysisLoaded')}</div>
              <div class="rep-summary-rows">
                <div class="rep-summary-row"><span>${t('ui_variables')}</span><strong>${resultados.columnasAnalizadas.join(', ')}</strong></div>
                <div class="rep-summary-row"><span>${t('ui_statsUsed')}</span><strong>${resultados.estadisticos.join(', ')}</strong></div>
                <div class="rep-summary-row"><span>${t('ui_records')}</span><strong>${resultados.totalFilas}</strong></div>
                <div class="rep-summary-row"><span>${t('ui_source')}</span><strong>${fileName||'dataset'}</strong></div>
              </div>
            </div>`:''}

            <!-- Información institucional -->
            <div class="rep-card">
              <div class="rep-card-title">${t('ui_instHeader')}</div>
              <div class="rep-form-grid">

                <div class="rep-field">
                  <label>${t('ui_org')}</label>
                  <select id="rep-org">
                    <option value="">— ${currentLang==='es'?'Seleccionar':'Select'} —</option>
                    <option>Laboratorio SUED S.R.L.</option>
                    <option>Laboratorio X</option>
                  </select>
                </div>

                <div class="rep-field">
                  <label>${t('ui_dept')}</label>
                  <select id="rep-dept">
                    <option value="">— ${currentLang==='es'?'Seleccionar':'Select'} —</option>
                    <option>Validaciones</option>
                    <option>Producción</option>
                    <option>Control de Calidad</option>
                    <option>Investigación y Desarrollo</option>
                    <option>Logística</option>
                  </select>
                </div>

                <div class="rep-field">
                  <label>${t('ui_location')}</label>
                  <input id="rep-ubicacion" placeholder="${currentLang==='es'?'Ej: Santo Domingo, DO':'E.g.: Santo Domingo, DO'}">
                </div>

                 <div class="rep-field">
                   <label>${t('ui_serial')}</label>
                   <input id="rep-serie" placeholder="123456789">
                 </div>

                <div class="rep-field">
                  <label>${t('ui_proto')}</label>
                  <input id="rep-proto" placeholder="PROTO-2024-001">
                </div>

                <div class="rep-field">
                  <label>${t('ui_modelo')}</label>
                  <input id="rep-modelo" placeholder="VANQUISH">
                </div>

                <div class="rep-field">
                  <label>${t('ui_marca')}</label>
                  <input id="rep-marca" placeholder="THERMO FISHER">
                </div>

                <div class="rep-field">
                  <label>${t('ui_phase')}</label>
                  <select id="rep-fase">
                    <option value="">— ${currentLang==='es'?'Seleccionar':'Select'} —</option>
                    <option>DQ</option><option>IQ</option><option>OQ</option><option>PQ</option>
                    <option>Phase I</option><option>Phase II</option><option>Phase III</option><option>Phase IV</option>
                    <option>Pre-clinical</option><option>Post-market</option><option>Internal QC</option>
                  </select>
                </div>

                <div class="rep-field">
                  <label>${t('ui_code')}</label>
                  <input id="rep-code" placeholder="PRJ-2024-XXX">
                </div>

                <div class="rep-field rep-field-full">
                  <label>${t('ui_assay')}</label>
                  <input id="rep-ensayo" placeholder="${currentLang==='es'?'Ej: Determinación de pH, Ensayo de disolución':'E.g.: pH Determination, Dissolution Test'}">
                </div>

                <div class="rep-field rep-field-full">
                  <label>${t('ui_description')}</label>
                  <input id="rep-descripcion" placeholder="${currentLang==='es'?'Descripción breve del análisis o Equipo...':'Description of the analysis or Equipment...'}">
                </div>

                <div class="rep-field">
                  <label>${t('ui_version')}</label>
                  <input id="rep-version" value="1.0">
                </div>

                <div class="rep-field">
                  <label>${t('ui_conf')}</label>
                  <select id="rep-conf">
                    <option value="CONFIDENTIAL — FOR INTERNAL USE ONLY">${t('ui_conf_internal')}</option>
                    <option value="STRICTLY CONFIDENTIAL — RESTRICTED ACCESS">${t('ui_conf_strict')}</option>
                    <option value="PROPRIETARY — DO NOT DISTRIBUTE">${t('ui_conf_prop')}</option>
                    <option value="FOR REGULATORY SUBMISSION ONLY">${t('ui_conf_reg')}</option>
                  </select>
                </div>

              </div>
            </div>

            <!-- Trazabilidad -->
            <div class="rep-card">
              <div class="rep-card-title">${t('ui_traceability')}</div>
              <div class="rep-form-grid">
                <div class="rep-field"><label>${t('ui_dataset')}</label><input id="rep-dataset" value="${fileName.replace(/\.[^.]+$/,'')}" placeholder="Nombre_Dataset"></div>
                <div class="rep-field"><label>${t('ui_file')}</label><input id="rep-file" value="${fileName}" placeholder="datos.csv"></div>
                <div class="rep-field">
                  <label>${t('ui_collect')}</label>
                  <input id="rep-collect" type="date">
                </div>
                <div class="rep-field">
                  <label style="opacity:0">—</label>
                  <div class="rep-date-display" id="rep-collect-preview">—</div>
                </div>
              </div>
            </div>

            <!-- Firmas -->
            <div class="rep-card">
              <div class="rep-card-title">${t('ui_signatures')}</div>
              <div class="rep-sig-grid">
                ${['prep','rev','app'].map((pfx,i)=>{
                    const roles=[t('ui_prep'),t('ui_rev'),t('ui_app')];
                    return `
                    <div class="rep-sig-block">
                      <div class="rep-sig-role">${roles[i]}</div>
                      <div class="rep-field"><label>${t('ui_sigName')}</label><input id="rep-${pfx}-name" placeholder="Dr. Nombre Apellido"></div>
                      <div class="rep-field"><label>${t('ui_sigTitle')}</label><input id="rep-${pfx}-title" placeholder="${currentLang==='es'?'Cargo / Posición':'Title / Position'}"></div>
                      <div class="rep-field"><label>${t('ui_sigDate')}</label><input id="rep-${pfx}-date" type="date"></div>
                      <div class="rep-date-display" id="rep-${pfx}-date-preview">—</div>
                    </div>`;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- DERECHA -->
          <div class="rep-right">
            <div class="rep-card rep-format-card">

              <!-- Toggle idioma -->
              <div class="rep-lang-toggle">
                <span class="rep-lang-label">🌐 Idioma / Language</span>
                <div class="rep-lang-btns">
                  <button class="rep-lang-btn ${currentLang==='es'?'active':''}" id="rep-lang-es">🇪🇸 Español</button>
                  <button class="rep-lang-btn ${currentLang==='en'?'active':''}" id="rep-lang-en">🇺🇸 English</button>
                </div>
              </div>

              <div class="rep-card-title">${t('ui_formatTitle')}</div>
              <p class="rep-format-hint">${t('ui_formatHint')}</p>

              <div class="rep-format-list">
                <label class="rep-format-item" id="fmt-html-wrap">
                  <input type="checkbox" id="fmt-html" value="html" checked>
                  <div class="rep-format-body">
                    <div class="rep-format-icon">🌐</div>
                    <div class="rep-format-info">
                      <div class="rep-format-name">.HTML <span class="rep-fmt-badge-recommended">${t('ui_recommended')}</span> <span class="rep-fmt-badge-pdf">${t('ui_pdfReady')}</span></div>
                      <div class="rep-format-desc">${t('ui_htmlDesc')}</div>
                    </div>
                    <div class="rep-format-checkmark">✓</div>
                  </div>
                </label>
                <label class="rep-format-item" id="fmt-pdf-wrap">
                  <input type="checkbox" id="fmt-pdf" value="pdf">
                  <div class="rep-format-body">
                    <div class="rep-format-icon">📄</div>
                    <div class="rep-format-info">
                      <div class="rep-format-name">.PDF</div>
                      <div class="rep-format-desc">${t('ui_pdfDesc') || 'Reporte en formato PDF listo para imprimir.'}</div>
                    </div>
                    <div class="rep-format-checkmark">✓</div>
                  </div>
                </label>
                <label class="rep-format-item" id="fmt-txt-wrap">
                  <input type="checkbox" id="fmt-txt" value="txt">
                  <div class="rep-format-body">
                    <div class="rep-format-icon">📄</div>
                    <div class="rep-format-info">
                      <div class="rep-format-name">.TXT</div>
                      <div class="rep-format-desc">${t('ui_txtDesc')}</div>
                    </div>
                    <div class="rep-format-checkmark">✓</div>
                  </div>
                </label>
                <label class="rep-format-item" id="fmt-csv-wrap">
                  <input type="checkbox" id="fmt-csv" value="csv">
                  <div class="rep-format-body">
                    <div class="rep-format-icon">🗃️</div>
                    <div class="rep-format-info">
                      <div class="rep-format-name">.CSV</div>
                      <div class="rep-format-desc">${t('ui_csvDesc')}</div>
                    </div>
                    <div class="rep-format-checkmark">✓</div>
                  </div>
                </label>
              </div>

              <div class="rep-fmt-count-row">
                <span class="rep-fmt-count" id="rep-fmt-count">${t('ui_formatCount',1)}</span>
              </div>

              <button class="rep-btn-download" id="rep-btn-download" ${!tieneRes?'disabled':''}>
                ${t('ui_download')}
              </button>

              ${!tieneRes?`<p class="rep-no-data-msg">${t('ui_noData')}</p>`:''}

              <div class="rep-reg-box">
                <div class="rep-reg-title">${t('ui_regTitle')}</div>
                <div class="rep-reg-row">📋 ${REGULATORY.standard}</div>
                <div class="rep-reg-row">📐 ${REGULATORY.guideline}</div>
                <div class="rep-reg-row">⚗️ ${REGULATORY.software}</div>
              </div>
            </div>
          </div>
        </div>`;

        // ── Checkboxes ──
        ['html','pdf','txt','csv'].forEach(fmt=>{
            const cb=document.getElementById(`fmt-${fmt}`);
            const wrap=document.getElementById(`fmt-${fmt}-wrap`);
            if(!cb||!wrap)return;
            updateFormatWrap(wrap,cb.checked);
            cb.addEventListener('change',()=>{updateFormatWrap(wrap,cb.checked);updateFmtCount();});
        });
        updateFmtCount();

        // ── Preview de fechas ──
        [['rep-collect','rep-collect-preview'],
         ['rep-prep-date','rep-prep-date-preview'],
         ['rep-rev-date', 'rep-rev-date-preview'],
         ['rep-app-date', 'rep-app-date-preview']].forEach(([inputId,previewId])=>{
            const input=document.getElementById(inputId);
            const prev =document.getElementById(previewId);
            if(!input||!prev)return;
            input.addEventListener('change',()=>{
                prev.textContent=input.value?formatDate(input.value):'—';
            });
        });

        // ── Toggle idioma ──
        ['es','en'].forEach(lang=>{
            document.getElementById(`rep-lang-${lang}`)?.addEventListener('click',()=>{
                if(currentLang===lang)return;
                currentLang=lang;
                buildReportesView();
            });
        });

        // ── Botón descargar ──
        document.getElementById('rep-btn-download')?.addEventListener('click', async () => {
            if(!tieneRes) return;
            const formatos=['html','pdf','txt','csv'].filter(f=>document.getElementById(`fmt-${f}`)?.checked);
            if(!formatos.length){alert(t('ui_alertNoFmt'));return;}
            const meta=collectMeta();
            const result=await descargar(formatos,resultados,meta);
            setTimeout(()=>alert(t('ui_alertDownload',
                result.formatos.map(f=>`.${f.toUpperCase()}`).join(' · '),
                result.base,
                formatos.includes('html')
            )),formatos.length*350+100);
        });
    }

    function updateFormatWrap(wrap,checked){wrap.classList.toggle('rep-format-active',checked);}
    function updateFmtCount(){
        const n=['html','pdf','txt','csv'].filter(f=>document.getElementById(`fmt-${f}`)?.checked).length;
        const el=document.getElementById('rep-fmt-count');
        if(el)el.textContent=t('ui_formatCount',n);
    }
    function collectMeta(){
        const g=id=>document.getElementById(id)?.value.trim()||'';
        const gOrFallback=(id1,id2)=>document.getElementById(id1)?.value.trim()||document.getElementById(id2)?.value.trim()||'';
        return {
            organizacion:    g('rep-org'),
            departamento:    g('rep-dept'),
            ubicacion:       g('rep-ubicacion'),
            descripcion:     document.getElementById('rep-descripcion')?.value.trim()||'',
            ensayo:          g('rep-ensayo'),
            modelo:          g('rep-modelo'),
            serie:           gOrFallback('rep-serie','rep-serial'),
            marca:           g('rep-marca'),
            protocolo:       g('rep-proto'),
            fase:            g('rep-fase'),
            codigoProyecto:  g('rep-code'),
            version:         g('rep-version')||'1.0',
            nombreDataset:   g('rep-dataset'),
            archivoFuente:   g('rep-file'),
            fechaRecoleccion:g('rep-collect'),
            confidencialidad:document.getElementById('rep-conf')?.value||'CONFIDENTIAL',
            preparedBy:      g('rep-prep-name'),
            preparedTitle:   g('rep-prep-title'),
            preparedDate:    g('rep-prep-date'),
            reviewedBy:      g('rep-rev-name'),
            reviewedTitle:   g('rep-rev-title'),
            reviewedDate:    g('rep-rev-date'),
            approvedBy:      g('rep-app-name'),
            approvedTitle:   g('rep-app-title'),
            approvedDate:    g('rep-app-date'),
        };
    }

    return {
        buildReportesView,
        generarTXT,
        generarCSV,
        generarHTML,
        descargar,
        computeExtendedStats,
    };

})();
console.log('✅ ReporteManager cargado — FDA 21 CFR Part 11');
