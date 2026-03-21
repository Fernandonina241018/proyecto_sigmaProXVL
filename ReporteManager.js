// ========================================
// ReporteManager.js
// Reportes estadísticos — FDA 21 CFR Part 11
// StatAnalyzer Pro v1.0
// ========================================

const ReporteManager = (() => {

    const REGULATORY = {
        standard:  'FDA 21 CFR Part 11',
        guideline: 'ICH E9 Statistical Principles for Clinical Trials',
        software:  'StatAnalyzer Pro v1.0',
        ciLevel:   '95%',
        alphaLevel:'0.05'
    };

    const FLAGS = {
        CV_HIGH: 30, CV_VERY_HIGH: 50,
        N_MIN: 30,   OUTLIER_IQR: 1.5, SKEW_MODERATE: 0.5
    };

    // ── Idioma activo ─────────────────────
    let currentLang = 'en'; // 'en' | 'es'

    const I18N = {
        en: {
            reportTitle:       'STATISTICAL ANALYSIS REPORT',
            compliant:         'COMPLIANT',
            docId:             'Document ID',
            generated:         'Generated',
            software:          'Software',
            regulatoryRef:     'Regulatory Ref',
            sec1:              'SECTION 1 — INSTITUTIONAL HEADER',
            sec2:              'SECTION 2 — DATASET TRACEABILITY',
            sec3:              'SECTION 3 — EXECUTIVE SUMMARY',
            sec4:              'SECTION 4 — STATISTICAL RESULTS BY VARIABLE',
            sec5:              'SECTION 5 — METHODOLOGICAL NOTES',
            sec6:              'SECTION 6 — AUDIT TRAIL & ELECTRONIC SIGNATURE',
            organization:      'Organization',
            department:        'Department',
            studyProtocol:     'Study/Protocol',
            phase:             'Phase',
            projectCode:       'Project Code',
            reportVersion:     'Report Version',
            confidentiality:   'Confidentiality',
            datasetName:       'Dataset Name',
            sourceFile:        'Source File',
            collectionDate:    'Collection Date',
            analysisDate:      'Analysis Date',
            totalRecords:      'Total Records',
            numericColumns:    'Numeric Columns',
            analyzed:          'Analyzed',
            statistics:        'Statistics',
            integrityHash:     'Integrity Hash',
            noFlags:           '✓  No automatic flags detected.',
            flagsDetected:     (n) => `⚠  ${n} flag(s) detected:`,
            variable:          'Variable',
            statistic:         'Statistic',
            value:             'Value',
            reference:         'Reference',
            cv:                'Coeff. of Variation (CV%)',
            cvRef:             'SD/Mean × 100',
            flagsLabel:        'FLAGS',
            preparedBy:        'Prepared by',
            reviewedBy:        'Reviewed by',
            approvedBy:        'Approved by',
            name:              'Name',
            title:             'Title / Position',
            date:              'Date',
            elecRecord:        'Electronic record',
            endOfReport:       'END OF REPORT',
            variance:          'Variance: s² = Σ(xᵢ - x̄)² / (n-1)  [Bessel correction]',
            percentiles:       'Percentiles: linear interpolation (NIST)',
            outliers:          (f) => `Outliers: Tukey fence Q1-${f}×IQR / Q3+${f}×IQR`,
            cvFlags:           (h, v) => `CV flags: >${h}% high  >${v}% extreme`,
            alpha:             (a, ci) => `α = ${a}  CI = ${ci}`,
            auditMeta:         'AUDIT METADATA',
            // UI labels
            ui_langToggle:     'Idioma / Language',
            ui_langBtn_es:     '🇪🇸 Español',
            ui_langBtn_en:     '🇺🇸 English',
            ui_instHeader:     '🏛️ Institutional Information',
            ui_traceability:   '🔗 Dataset Traceability',
            ui_signatures:     '✍️ Electronic Signatures — 21 CFR Part 11',
            ui_formatTitle:    '📥 Download Format',
            ui_formatHint:     'Select one or more formats. The button downloads all selected.',
            ui_formatCount:    (n) => `${n} format${n !== 1 ? 's' : ''} selected`,
            ui_download:       '📥 Download Report',
            ui_noData:         'Run a statistical analysis first to enable download.',
            ui_regTitle:       'Regulatory Framework',
            ui_statusOk:       'Analysis ready to export',
            ui_statusWarn:     'No analysis available',
            ui_statusSubWarn:  'Run a statistical analysis in the <strong>Analysis</strong> view first.',
            ui_statusSubOk:    (r, c, s) => `${r} records · ${c} variables · ${s} statistics`,
            ui_analysisLoaded: '📊 Loaded Analysis',
            ui_variables:      'Variables',
            ui_statsUsed:      'Statistics',
            ui_records:        'Records',
            ui_source:         'Source',
            ui_org:            'Organization',
            ui_dept:           'Department',
            ui_proto:          'Protocol / Study',
            ui_phase:          'Phase',
            ui_code:           'Project Code',
            ui_version:        'Version',
            ui_dataset:        'Dataset Name',
            ui_file:           'Source File',
            ui_collect:        'Collection Date',
            ui_conf:           'Confidentiality',
            ui_conf_internal:  'Confidential — Internal',
            ui_conf_strict:    'Strictly Confidential',
            ui_conf_prop:      'Proprietary',
            ui_conf_reg:       'Regulatory Submission Only',
            ui_phaseOptions:   ['Phase I','Phase II','Phase III','Phase IV','Pre-clinical','Post-market','Internal QC'],
            ui_prep:           'Prepared by',
            ui_rev:            'Reviewed by',
            ui_app:            'Approved by',
            ui_sigName:        'Name',
            ui_sigTitle:       'Title / Position',
            ui_sigDate:        'Date',
            ui_recommended:    'Recommended',
            ui_pdfReady:       'PDF-ready',
            ui_txtDesc:        'Structured FDA 21 CFR Part 11 report. Numbered sections, ASCII borders, traceability hash.',
            ui_csvDesc:        'Pipe-delimited (|). Compatible with SAS PROC IMPORT and R read.table. Metadata in commented header.',
            ui_htmlDesc:       'Visual report with cover, tables and signatures. Open in browser → Ctrl+P → Save as PDF.',
            ui_update:         '🔄 Update',
            ui_alertDownload:  (fmts, base, html) => `✅ Download started\n\nFormats: ${fmts}\nFile: ${base}${html ? '\n\nThe .html file can be printed as PDF from the browser.' : ''}`,
            ui_alertNoFmt:     '⚠️ Select at least one download format.',
            // HTML report labels
            html_cover_logo:   'StatAnalyzer Pro · Statistical Report',
            html_title:        'Statistical Analysis Report',
            html_sec1:         'Institutional Header',
            html_sec2:         'Dataset Traceability',
            html_sec3:         'Executive Summary',
            html_sec4:         'Statistical Results by Variable',
            html_sec5:         'Methodological Notes',
            html_sec6:         'Audit Trail & Electronic Signature',
            html_auditSubpart: '21 CFR Part 11 — Subpart C',
            html_statCol:      'Statistic',
            html_valCol:       'Value',
            html_refCol:       'Reference',
            html_flagsLabel:   'Flags',
            html_noFlags:      '✓ No flags for this variable',
            html_noFlagsGlobal:'✓ No automatic flags detected. All variables within expected ranges.',
            html_flagsGlobal:  (n) => `⚠ ${n} automatic flag(s) detected:`,
            html_auditMeta:    'AUDIT METADATA',
            html_method_v:     'Variance & SD', html_method_v_d: "Bessel's correction (n-1).",
            html_method_p:     'Percentile Interpolation', html_method_p_d: 'Linear interpolation (NIST).',
            html_method_o:     'Outlier Detection',
            html_method_s:     'Skewness', html_method_s_d: "Pearson 2nd coefficient.",
            html_method_cv:    'CV Thresholds',
            html_method_sig:   'Significance',
            html_rec_n:        'n =',
            html_execSummary:  (ds, rows, cols, std) => `Dataset <strong>"${ds}"</strong> · <strong>${rows}</strong> observations · <strong>${cols}</strong> numeric variable(s) · ${std}.`,
            statRefs: {
                'Media Aritmética':    'Central tendency',
                'Mediana':             'Robust to outliers',
                'Moda':                'Most frequent',
                'Desviación Estándar': 'Sample SD (n-1)',
                'Varianza':            'Sample s² (n-1)',
            }
        },

        es: {
            reportTitle:       'REPORTE DE ANÁLISIS ESTADÍSTICO',
            compliant:         'CUMPLIMIENTO',
            docId:             'ID del Documento',
            generated:         'Generado',
            software:          'Software',
            regulatoryRef:     'Referencia Regulatoria',
            sec1:              'SECCIÓN 1 — ENCABEZADO INSTITUCIONAL',
            sec2:              'SECCIÓN 2 — TRAZABILIDAD DEL DATASET',
            sec3:              'SECCIÓN 3 — RESUMEN EJECUTIVO',
            sec4:              'SECCIÓN 4 — RESULTADOS ESTADÍSTICOS POR VARIABLE',
            sec5:              'SECCIÓN 5 — NOTAS METODOLÓGICAS',
            sec6:              'SECCIÓN 6 — AUDITORÍA Y FIRMA ELECTRÓNICA',
            organization:      'Organización',
            department:        'Departamento',
            studyProtocol:     'Estudio/Protocolo',
            phase:             'Fase',
            projectCode:       'Código de Proyecto',
            reportVersion:     'Versión del Reporte',
            confidentiality:   'Confidencialidad',
            datasetName:       'Nombre del Dataset',
            sourceFile:        'Archivo Fuente',
            collectionDate:    'Fecha de Recolección',
            analysisDate:      'Fecha de Análisis',
            totalRecords:      'Total de Registros',
            numericColumns:    'Columnas Numéricas',
            analyzed:          'Analizadas',
            statistics:        'Estadísticos',
            integrityHash:     'Hash de Integridad',
            noFlags:           '✓  Sin alertas automáticas detectadas.',
            flagsDetected:     (n) => `⚠  ${n} alerta(s) detectada(s):`,
            variable:          'Variable',
            statistic:         'Estadístico',
            value:             'Valor',
            reference:         'Referencia',
            cv:                'Coef. de Variación (CV%)',
            cvRef:             'DE/Media × 100',
            flagsLabel:        'ALERTAS',
            preparedBy:        'Preparado por',
            reviewedBy:        'Revisado por',
            approvedBy:        'Aprobado por',
            name:              'Nombre',
            title:             'Cargo / Posición',
            date:              'Fecha',
            elecRecord:        'Registro electrónico',
            endOfReport:       'FIN DEL REPORTE',
            variance:          'Varianza: s² = Σ(xᵢ - x̄)² / (n-1)  [corrección de Bessel]',
            percentiles:       'Percentiles: interpolación lineal (NIST)',
            outliers:          (f) => `Valores atípicos: cerca de Tukey Q1-${f}×IQR / Q3+${f}×IQR`,
            cvFlags:           (h, v) => `Umbrales CV: >${h}% alto  >${v}% extremo`,
            alpha:             (a, ci) => `α = ${a}  IC = ${ci}`,
            auditMeta:         'METADATOS DE AUDITORÍA',
            // UI labels
            ui_langToggle:     'Idioma / Language',
            ui_langBtn_es:     '🇪🇸 Español',
            ui_langBtn_en:     '🇺🇸 English',
            ui_instHeader:     '🏛️ Información Institucional',
            ui_traceability:   '🔗 Trazabilidad del Dataset',
            ui_signatures:     '✍️ Firmas Electrónicas — 21 CFR Part 11',
            ui_formatTitle:    '📥 Formato de Descarga',
            ui_formatHint:     'Selecciona uno o más formatos. El botón descarga todos los seleccionados.',
            ui_formatCount:    (n) => `${n} formato${n !== 1 ? 's' : ''} seleccionado${n !== 1 ? 's' : ''}`,
            ui_download:       '📥 Descargar Reporte',
            ui_noData:         'Ejecuta un análisis estadístico primero para habilitar la descarga.',
            ui_regTitle:       'Marco Regulatorio',
            ui_statusOk:       'Análisis listo para exportar',
            ui_statusWarn:     'Sin análisis disponible',
            ui_statusSubWarn:  'Ejecuta un análisis estadístico en la vista <strong>Análisis</strong> primero.',
            ui_statusSubOk:    (r, c, s) => `${r} registros · ${c} variables · ${s} estadísticos`,
            ui_analysisLoaded: '📊 Análisis Cargado',
            ui_variables:      'Variables',
            ui_statsUsed:      'Estadísticos',
            ui_records:        'Registros',
            ui_source:         'Fuente',
            ui_org:            'Organización',
            ui_dept:           'Departamento',
            ui_proto:          'Protocolo / Estudio',
            ui_phase:          'Fase',
            ui_code:           'Código de Proyecto',
            ui_version:        'Versión',
            ui_dataset:        'Nombre del Dataset',
            ui_file:           'Archivo Fuente',
            ui_collect:        'Fecha de Recolección',
            ui_conf:           'Confidencialidad',
            ui_conf_internal:  'Confidencial — Interno',
            ui_conf_strict:    'Estrictamente Confidencial',
            ui_conf_prop:      'Propietario',
            ui_conf_reg:       'Solo para Presentación Regulatoria',
            ui_phaseOptions:   ['Fase I','Fase II','Fase III','Fase IV','Pre-clínico','Post-mercado','Control de Calidad Interno'],
            ui_prep:           'Preparado por',
            ui_rev:            'Revisado por',
            ui_app:            'Aprobado por',
            ui_sigName:        'Nombre',
            ui_sigTitle:       'Cargo / Posición',
            ui_sigDate:        'Fecha',
            ui_recommended:    'Recomendado',
            ui_pdfReady:       'Listo para PDF',
            ui_txtDesc:        'Reporte estructurado FDA 21 CFR Part 11. Secciones numeradas, bordes ASCII, hash de trazabilidad.',
            ui_csvDesc:        'Delimitado por pipes (|). Compatible con SAS PROC IMPORT y R read.table. Metadatos en cabecera comentada.',
            ui_htmlDesc:       'Reporte visual con portada, tablas y firmas. Abre en navegador → Ctrl+P → Guardar como PDF.',
            ui_update:         '🔄 Actualizar',
            ui_alertDownload:  (fmts, base, html) => `✅ Descarga iniciada\n\nFormatos: ${fmts}\nArchivo: ${base}${html ? '\n\nEl archivo .html puede imprimirse como PDF desde el navegador.' : ''}`,
            ui_alertNoFmt:     '⚠️ Selecciona al menos un formato de descarga.',
            // HTML report labels
            html_cover_logo:   'StatAnalyzer Pro · Reporte Estadístico',
            html_title:        'Reporte de Análisis Estadístico',
            html_sec1:         'Encabezado Institucional',
            html_sec2:         'Trazabilidad del Dataset',
            html_sec3:         'Resumen Ejecutivo',
            html_sec4:         'Resultados Estadísticos por Variable',
            html_sec5:         'Notas Metodológicas',
            html_sec6:         'Auditoría y Firma Electrónica',
            html_auditSubpart: '21 CFR Part 11 — Subparte C',
            html_statCol:      'Estadístico',
            html_valCol:       'Valor',
            html_refCol:       'Referencia',
            html_flagsLabel:   'Alertas',
            html_noFlags:      '✓ Sin alertas para esta variable',
            html_noFlagsGlobal:'✓ Sin alertas automáticas detectadas. Todas las variables dentro de rangos esperados.',
            html_flagsGlobal:  (n) => `⚠ ${n} alerta(s) automática(s) detectada(s):`,
            html_auditMeta:    'METADATOS DE AUDITORÍA',
            html_method_v:     'Varianza y DE', html_method_v_d: 'Corrección de Bessel (n-1).',
            html_method_p:     'Interpolación de Percentiles', html_method_p_d: 'Interpolación lineal (NIST).',
            html_method_o:     'Detección de Valores Atípicos',
            html_method_s:     'Asimetría', html_method_s_d: 'Coeficiente de Pearson (2do).',
            html_method_cv:    'Umbrales CV',
            html_method_sig:   'Significancia',
            html_rec_n:        'n =',
            html_execSummary:  (ds, rows, cols, std) => `Dataset <strong>"${ds}"</strong> · <strong>${rows}</strong> observaciones · <strong>${cols}</strong> variable(s) numérica(s) · ${std}.`,
            statRefs: {
                'Media Aritmética':    'Tendencia central',
                'Mediana':             'Resistente a valores atípicos',
                'Moda':                'Valor más frecuente',
                'Desviación Estándar': 'DE muestral (n-1)',
                'Varianza':            'Varianza muestral (n-1)',
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
    function doubleLine(n = 80) { return '═'.repeat(n); }
    function singleLine(n  = 80) { return '─'.repeat(n); }
    function timestamp() { return new Date().toISOString().replace('T',' ').slice(0,19)+' UTC'; }
    function shortDate() { return new Date().toISOString().slice(0,10); }

    function generateHash(meta, res) {
        const s = JSON.stringify({ meta, ts: timestamp(), r: res?.totalFilas });
        let h = 0;
        for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
        return Math.abs(h).toString(16).toUpperCase().padStart(8,'0');
    }

    function fmtNum(val, d = 4) {
        if (val === null || val === undefined) return 'N/A';
        if (Array.isArray(val)) return val.length ? val.map(v => Number(v).toFixed(d)).join('; ') : 'No mode';
        if (typeof val === 'number') return isFinite(val) ? val.toFixed(d) : 'N/A';
        return String(val);
    }

    // ── Flags automáticos ─────────────────
    function computeExtendedStats(resultados) {
        const ext = {};
        const res = resultados.resultados;

        resultados.columnasAnalizadas.forEach(col => {
            const flags = [], notes = [];
            const n       = resultados.totalFilas;
            const media   = res['Media Aritmética']?.[col];
            const sd      = res['Desviación Estándar']?.[col];
            const q1      = res['Percentiles']?.[col]?.P25;
            const q3      = res['Percentiles']?.[col]?.P75;
            const min     = res['Rango y Amplitud']?.[col]?.minimo;
            const max     = res['Rango y Amplitud']?.[col]?.maximo;
            const mediana = res['Mediana']?.[col] ?? res['Mediana y Moda']?.[col];
            let cv = null;

            if (media != null && sd != null && media !== 0) {
                cv = Math.abs((sd / media) * 100);
                if (cv > FLAGS.CV_VERY_HIGH)
                    flags.push(`[FLAG-CV-EXTREME] CV = ${cv.toFixed(1)}% exceeds ${FLAGS.CV_VERY_HIGH}%`);
                else if (cv > FLAGS.CV_HIGH)
                    flags.push(`[FLAG-CV-HIGH] CV = ${cv.toFixed(1)}% exceeds ${FLAGS.CV_HIGH}%`);
            }
            if (n < FLAGS.N_MIN)
                flags.push(`[FLAG-SMALL-N] n = ${n} < ${FLAGS.N_MIN}. Interpret with caution.`);
            if (q1 != null && q3 != null) {
                const iqr = q3 - q1;
                if (min < q1 - FLAGS.OUTLIER_IQR * iqr) flags.push('[FLAG-OUTLIER-LOW] Min below lower fence');
                if (max > q3 + FLAGS.OUTLIER_IQR * iqr) flags.push('[FLAG-OUTLIER-HIGH] Max above upper fence');
            }
            if (media != null && mediana != null && sd != null && sd > 0) {
                const skew = (3 * (media - mediana)) / sd;
                if (Math.abs(skew) > FLAGS.SKEW_MODERATE) {
                    flags.push(`[FLAG-SKEW] Pearson skewness ≈ ${skew.toFixed(2)} (${skew > 0 ? 'right' : 'left'} tail)`);
                    notes.push('Non-normal distribution suspected.');
                }
            }
            ext[col] = { cv, flags, notes };
        });
        return ext;
    }

    // ── Generador TXT (i18n) ─────────────
    function generarTXT(resultados, meta) {
        const hash = generateHash(meta, resultados);
        const ext  = computeExtendedStats(resultados);
        const W    = 80;
        const L    = [];
        const p    = s => L.push(s);
        const NA   = currentLang === 'es' ? 'NO ESPECIFICADO' : 'NOT SPECIFIED';

        p(doubleLine(W));
        p(`  ${t('reportTitle')}`);
        p(`  ${REGULATORY.standard} — ${t('compliant')}`);
        p(doubleLine(W));
        p('');
        p(`  ${pad(t('docId')+' :', 20)}: RPT-${hash}`);
        p(`  ${pad(t('generated')+' :', 20)}: ${timestamp()}`);
        p(`  ${pad(t('software')+' :', 20)}: ${REGULATORY.software}`);
        p(`  ${pad(t('regulatoryRef')+' :', 20)}: ${REGULATORY.standard}`);
        p('');

        p(singleLine(W));
        p(`  ${t('sec1')}`);
        p(singleLine(W));
        p(`  ${pad(t('organization')+' :', 22)}: ${meta.organizacion   || NA}`);
        p(`  ${pad(t('department')+' :', 22)}: ${meta.departamento   || NA}`);
        p(`  ${pad(t('studyProtocol')+' :', 22)}: ${meta.protocolo      || NA}`);
        p(`  ${pad(t('phase')+' :', 22)}: ${meta.fase           || NA}`);
        p(`  ${pad(t('projectCode')+' :', 22)}: ${meta.codigoProyecto || NA}`);
        p(`  ${pad(t('reportVersion')+' :', 22)}: ${meta.version        || '1.0'}`);
        p(`  ${pad(t('confidentiality')+' :', 22)}: ${meta.confidencialidad || 'CONFIDENTIAL'}`);
        p('');

        p(singleLine(W));
        p(`  ${t('sec2')}`);
        p(singleLine(W));
        p(`  ${pad(t('datasetName')+' :', 22)}: ${meta.nombreDataset   || NA}`);
        p(`  ${pad(t('sourceFile')+' :', 22)}: ${meta.archivoFuente   || NA}`);
        p(`  ${pad(t('collectionDate')+' :', 22)}: ${meta.fechaRecoleccion|| NA}`);
        p(`  ${pad(t('analysisDate')+' :', 22)}: ${shortDate()}`);
        p(`  ${pad(t('totalRecords')+' :', 22)}: ${resultados.totalFilas}`);
        p(`  ${pad(t('numericColumns')+' :', 22)}: ${resultados.totalColumnas}`);
        p(`  ${pad(t('analyzed')+' :', 22)}: ${resultados.columnasAnalizadas.join(', ')}`);
        p(`  ${pad(t('statistics')+' :', 22)}: ${resultados.estadisticos.join(', ')}`);
        p(`  ${pad(t('integrityHash')+' :', 22)}: RPT-${hash}`);
        p('');

        p(singleLine(W));
        p(`  ${t('sec3')}`);
        p(singleLine(W));
        const allFlags = Object.entries(ext).flatMap(([col, d]) => d.flags.map(f => `  ${col}: ${f}`));
        p(allFlags.length > 0 ? `  ${t('flagsDetected', allFlags.length)}` : `  ${t('noFlags')}`);
        allFlags.forEach(f => p(`     ${f}`));
        p('');

        p(singleLine(W));
        p(`  ${t('sec4')}`);
        p(singleLine(W));

        resultados.columnasAnalizadas.forEach(col => {
            p('');
            p(`  ┌${'─'.repeat(W-4)}┐`);
            p(`  │  ${t('variable')}: ${pad(col, W-18)}│`);
            p(`  └${'─'.repeat(W-4)}┘`);
            p(`  ${pad(t('statistic'), 28)}${pad(t('value'), 18)}${t('reference')}`);
            p(`  ${singleLine(W-4)}`);

            Object.entries(resultados.resultados).forEach(([stat, data]) => {
                const val = data[col];
                if (val === undefined) return;
                if (typeof val === 'object' && !Array.isArray(val)) {
                    p(`  ${pad(stat+':', 28)}`);
                    Object.entries(val).forEach(([k, v]) => p(`    ${pad('  · '+k, 28)}${pad(fmtNum(v), 18)}`));
                } else {
                    p(`  ${pad(stat+':', 28)}${pad(fmtNum(val), 18)}${t('statRefs')[stat] || ''}`);
                }
            });
            if (ext[col]?.cv != null)
                p(`  ${pad(t('cv')+':', 28)}${pad(ext[col].cv.toFixed(2)+'%', 18)}${t('cvRef')}`);
            if (ext[col].flags.length) {
                p('');
                p(`  ⚠  ${t('flagsLabel')}:`);
                ext[col].flags.forEach(f => p(`     ${f}`));
            }
            p('');
        });

        p(singleLine(W));
        p(`  ${t('sec5')}`);
        p(singleLine(W));
        p(`  ${t('variance')}`);
        p(`  ${t('percentiles')}`);
        p(`  ${t('outliers', FLAGS.OUTLIER_IQR)}`);
        p(`  ${t('cvFlags', FLAGS.CV_HIGH, FLAGS.CV_VERY_HIGH)}`);
        p(`  ${t('alpha', REGULATORY.alphaLevel, REGULATORY.ciLevel)}`);
        p('');

        p(singleLine(W));
        p(`  ${t('sec6')} (21 CFR Part 11)`);
        p(singleLine(W));
        [[t('preparedBy'), 'preparedBy','preparedTitle','preparedDate'],
         [t('reviewedBy'), 'reviewedBy','reviewedTitle','reviewedDate'],
         [t('approvedBy'), 'approvedBy','approvedTitle','approvedDate']].forEach(([role, kb, kt, kd]) => {
            p('');
            p(`  ${role}`);
            p(`    ${t('name')}  : ${meta[kb] || '_________________________'}`);
            p(`    ${t('title')} : ${meta[kt] || '_________________________'}`);
            p(`    ${t('date')}  : ${meta[kd] || '_________________________'}`);
        });
        p('');
        p(doubleLine(W));
        p(`  ${t('endOfReport')} — RPT-${hash}`);
        p(`  ${REGULATORY.software} | ${REGULATORY.standard} | ${timestamp()}`);
        p(doubleLine(W));

        return L.join('\n');
    }

    // ── Generador CSV (pipe-delimited) ────
    function generarCSV(resultados, meta) {
        const hash = generateHash(meta, resultados);
        const ext  = computeExtendedStats(resultados);
        const rows = [
            `## ${t('reportTitle')}`,
            `## ${t('docId')}|RPT-${hash}`,
            `## ${t('generated')}|${timestamp()}`,
            `## ${t('software')}|${REGULATORY.software}`,
            `## Standard|${REGULATORY.standard}`,
            `## ${t('organization')}|${meta.organizacion || ''}`,
            `## Protocol|${meta.protocolo || ''}`,
            `## ${t('datasetName')}|${meta.nombreDataset || ''}`,
            `## ${t('preparedBy')}|${meta.preparedBy || ''}`,
            `## ${t('totalRecords')}|${resultados.totalFilas}`,
            '##',
            `${t('variable')}|${t('statistic')}|SUB_KEY|${t('value')}|CV_PCT|FLAG_COUNT|FLAGS`
        ];

        resultados.columnasAnalizadas.forEach(col => {
            const cv       = ext[col]?.cv?.toFixed(4) ?? '';
            const flagCount= ext[col]?.flags?.length ?? 0;
            const flagsTxt = (ext[col]?.flags ?? []).join(' | ');

            Object.entries(resultados.resultados).forEach(([stat, data]) => {
                const val = data[col];
                if (val === undefined) return;
                if (typeof val === 'object' && !Array.isArray(val)) {
                    Object.entries(val).forEach(([k, v]) =>
                        rows.push([col, stat, k, fmtNum(v, 6), cv, flagCount, flagsTxt].join('|')));
                } else if (Array.isArray(val)) {
                    rows.push([col, stat, 'MODE', val.map(v => fmtNum(v,6)).join(';'), cv, flagCount, flagsTxt].join('|'));
                } else {
                    rows.push([col, stat, '', fmtNum(val, 6), cv, flagCount, flagsTxt].join('|'));
                }
            });
        });

        return rows.join('\n');
    }

    // ── Generador HTML ────────────────────
    function generarHTML(resultados, meta) {
        const hash = generateHash(meta, resultados);
        const ext  = computeExtendedStats(resultados);
        const totalFlags = Object.values(ext).reduce((a, d) => a + d.flags.length, 0);

        function statsRows(col) {
            const refs = t('statRefs');
            let h = '';
            Object.entries(resultados.resultados).forEach(([stat, data]) => {
                const val = data[col];
                if (val === undefined) return;
                if (typeof val === 'object' && !Array.isArray(val)) {
                    h += `<tr style="background:#f7f8fa"><td colspan="3" style="padding:5px 14px;font-size:8.5pt;color:#666"><em>${stat}</em></td></tr>`;
                    Object.entries(val).forEach(([k, v]) =>
                        h += `<tr><td style="padding-left:26px;color:#555">· ${k}</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${fmtNum(v)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">—</td></tr>`);
                } else {
                    const vf = Array.isArray(val) ? (val.length ? val.map(v => fmtNum(v)).join(', ') : '<em>No mode</em>') : fmtNum(val);
                    h += `<tr><td>${stat}</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${vf}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">${refs[stat]||''}</td></tr>`;
                }
            });
            if (ext[col]?.cv != null)
                h += `<tr style="background:#fffaf0"><td><strong>${t('cv')}</strong></td><td style="font-family:monospace;text-align:right;font-weight:600;color:#b7791f">${ext[col].cv.toFixed(2)}%</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">${t('cvRef')}</td></tr>`;
            return h;
        }

        function flagBadges(col) {
            if (!ext[col]?.flags?.length) return `<span style="background:#c6f6d5;color:#276749;font-family:monospace;font-size:7.5pt;padding:3px 8px;border-radius:3px">${t('html_noFlags')}</span>`;
            return ext[col].flags.map(f => {
                const c = f.includes('EXTREME')||f.includes('OUTLIER') ? '#fed7d7;color:#c53030' : f.includes('HIGH')||f.includes('SKEW') ? '#fefcbf;color:#b7791f' : '#bee3f8;color:#2b6cb0';
                return `<span style="background:${c};font-family:monospace;font-size:7.5pt;padding:3px 8px;border-radius:3px;display:inline-block;margin:2px 2px 2px 0">${f}</span>`;
            }).join('');
        }

        const roleLabels = [t('preparedBy'), t('reviewedBy'), t('approvedBy')];
        const roleKeys   = ['prepared','reviewed','approved'];
        const pending    = currentLang === 'es' ? 'Pendiente' : 'Pending';
        const sigBlocks  = roleKeys.map((k, i) => {
            const name  = meta[k+'By']    || '';
            const title = meta[k+'Title'] || '';
            const date  = meta[k+'Date']  || '';
            return `<div style="border:1px solid #e2e8f0;border-radius:6px;padding:14px">
              <div style="font-family:monospace;font-size:7pt;text-transform:uppercase;letter-spacing:1.5px;color:#1a3a6b;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:5px">${roleLabels[i]}</div>
              ${[[t('name'),name||pending],[t('title'),title||'—'],[t('date'),date||'—']].map(([l,v]) =>
                `<div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">${l}</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:${v===pending||v==='—'?'#cbd5e0':'#1a202c'};${v===pending||v==='—'?'font-style:italic':''}">${v}</span></div>`).join('')}
              <div style="border-top:1px solid #1a202c;margin-top:14px;padding-top:5px;font-size:7pt;color:#718096;font-family:monospace">${t('elecRecord')} · ${REGULATORY.standard}</div>
            </div>`;
        }).join('');

        return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Statistical Report — RPT-${hash}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;600&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Source Serif 4',Georgia,serif;font-size:11pt;color:#1a202c;background:white;line-height:1.6}
.cover{background:#1a3a6b;color:white;padding:60px 70px 50px;border-bottom:6px solid #c8a951}
.doc{max-width:880px;margin:0 auto;padding:50px 70px}
.sec{margin-bottom:40px}
.sec-title{font-family:'JetBrains Mono',monospace;font-size:7.5pt;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:#1a3a6b;border-bottom:2px solid #1a3a6b;padding-bottom:6px;margin-bottom:16px;display:flex;align-items:baseline;gap:10px}
.sec-num{background:#1a3a6b;color:white;font-size:7pt;padding:2px 7px;border-radius:2px}
.meta-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px 32px}
.ml{font-family:'JetBrains Mono',monospace;font-size:7pt;color:#718096;text-transform:uppercase;letter-spacing:.8px;display:block;margin-bottom:2px}
.mv{font-size:10.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;min-height:20px;display:block}
.var-block{margin-bottom:28px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden}
.var-hdr{background:#1a3a6b;color:white;padding:10px 16px;display:flex;justify-content:space-between;align-items:center}
table{width:100%;border-collapse:collapse;font-size:9.5pt}
th{background:#f0f4f8;color:#1a3a6b;font-family:'JetBrains Mono',monospace;font-size:7pt;letter-spacing:1px;text-transform:uppercase;padding:8px 14px;text-align:left;border-bottom:1px solid #e2e8f0}
td{padding:7px 14px;border-bottom:1px solid #edf2f7;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#f7faff}
.method-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px 28px}
.mi{border-left:3px solid #e2e8f0;padding:8px 14px}
.mi h4{font-size:9pt;font-weight:600;color:#1a3a6b;margin-bottom:3px}
.mi p{font-size:8.5pt;color:#4a5568;line-height:1.5}
.mi code{font-family:'JetBrains Mono',monospace;background:#f7f8fa;padding:1px 4px;border-radius:2px;display:block;margin-top:3px;color:#2c5282;font-size:8pt}
.sig-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.audit-box{background:#f7f8fa;border:1px solid #e2e8f0;border-radius:6px;padding:14px 18px;font-family:'JetBrains Mono',monospace;font-size:8pt;color:#718096;line-height:1.8}
.doc-footer{margin-top:44px;padding-top:18px;border-top:2px solid #1a3a6b;display:flex;justify-content:space-between;align-items:flex-end;font-family:'JetBrains Mono',monospace;font-size:7.5pt;color:#a0aec0}
@media print{body{font-size:9.5pt}.cover{padding:40px 50px}.doc{padding:30px 50px}.var-block,.sec{page-break-inside:avoid}@page{margin:1.5cm;size:A4}}
</style></head><body>

<div class="cover">
  <div style="font-family:'JetBrains Mono',monospace;font-size:9pt;letter-spacing:3px;color:rgba(255,255,255,.5);text-transform:uppercase;margin-bottom:34px">StatAnalyzer Pro · Statistical Report</div>
  <div style="font-size:26pt;font-weight:300;margin-bottom:6px">Statistical Analysis Report</div>
  <div style="font-size:11pt;color:#c8a951;font-weight:300;letter-spacing:1px;margin-bottom:44px">${REGULATORY.standard} Compliant</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 40px;font-family:'JetBrains Mono',monospace;font-size:8pt;color:rgba(255,255,255,.7);border-top:1px solid rgba(255,255,255,.2);padding-top:22px">
    <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Document ID</strong>RPT-${hash}</div>
    <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Organization</strong>${meta.organizacion||'—'}</div>
    <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Protocol / Study</strong>${meta.protocolo||'—'}</div>
    <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Version</strong>${meta.version||'1.0'}</div>
    <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Generated</strong>${timestamp()}</div>
    <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Records Analyzed</strong>${resultados.totalFilas}</div>
  </div>
</div>

<div class="doc">
  <div class="sec">
    <div class="sec-title"><span class="sec-num">01</span>Institutional Header</div>
    <div class="meta-grid">
      <div><span class="ml">Organization</span><span class="mv">${meta.organizacion||'—'}</span></div>
      <div><span class="ml">Department</span><span class="mv">${meta.departamento||'—'}</span></div>
      <div><span class="ml">Study / Protocol</span><span class="mv">${meta.protocolo||'—'}</span></div>
      <div><span class="ml">Phase</span><span class="mv">${meta.fase||'—'}</span></div>
      <div><span class="ml">Project Code</span><span class="mv">${meta.codigoProyecto||'—'}</span></div>
      <div><span class="ml">Report Version</span><span class="mv">${meta.version||'1.0'}</span></div>
      <div style="grid-column:1/-1"><span class="ml">Confidentiality</span><span class="mv">${meta.confidencialidad||'CONFIDENTIAL'}</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">02</span>Dataset Traceability</div>
    <div class="meta-grid">
      <div><span class="ml">Dataset Name</span><span class="mv">${meta.nombreDataset||'—'}</span></div>
      <div><span class="ml">Source File</span><span class="mv">${meta.archivoFuente||'—'}</span></div>
      <div><span class="ml">Collection Date</span><span class="mv">${meta.fechaRecoleccion||'—'}</span></div>
      <div><span class="ml">Analysis Date</span><span class="mv">${shortDate()}</span></div>
      <div><span class="ml">Total Records</span><span class="mv">${resultados.totalFilas}</span></div>
      <div><span class="ml">Numeric Variables</span><span class="mv">${resultados.totalColumnas}</span></div>
      <div style="grid-column:1/-1"><span class="ml">Variables Analyzed</span><span class="mv">${resultados.columnasAnalizadas.join(' · ')}</span></div>
      <div style="grid-column:1/-1"><span class="ml">Statistics Computed</span><span class="mv">${resultados.estadisticos.join(' · ')}</span></div>
      <div style="grid-column:1/-1"><span class="ml">Integrity Hash</span><span class="mv" style="font-family:monospace;font-size:9pt">RPT-${hash}</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">03</span>Executive Summary</div>
    <div style="background:#f7f8fa;border-left:4px solid #1a3a6b;border-radius:0 6px 6px 0;padding:16px 20px;font-size:10.5pt;line-height:1.7">
      Dataset <strong>"${meta.nombreDataset||'N/A'}"</strong> · <strong>${resultados.totalFilas}</strong> observations · <strong>${resultados.totalColumnas}</strong> numeric variable(s) · ${REGULATORY.standard}.<br>
      Statistics: ${resultados.estadisticos.join(' · ')}.
    </div>
    <div style="margin-top:14px;padding:12px 16px;border-radius:6px;${totalFlags > 0 ? 'background:#fffbeb;border:1px solid #f6e05e' : 'background:#f0fff4;border:1px solid #9ae6b4'}">
      ${totalFlags > 0
        ? `<strong>⚠ ${totalFlags} automatic flag(s) detected:</strong><br><br>${Object.entries(ext).flatMap(([col,d]) => d.flags.map(f => `<strong>${col}:</strong> ${f}`)).join('<br>')}`
        : '<strong>✓ No automatic flags detected.</strong> All variables within expected ranges.'}
    </div>
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">04</span>Statistical Results by Variable</div>
    ${resultados.columnasAnalizadas.map(col => `
    <div class="var-block">
      <div class="var-hdr">
        <span style="font-family:monospace;font-size:11pt;font-weight:500">${col}</span>
        <span style="font-family:monospace;font-size:8pt;color:rgba(255,255,255,.6)">n = ${resultados.totalFilas}</span>
      </div>
      <table><thead><tr><th>Statistic</th><th style="text-align:right">Value</th><th style="text-align:right">Reference</th></tr></thead>
      <tbody>${statsRows(col)}</tbody></table>
      ${ext[col]?.flags?.length
        ? `<div style="padding:12px 16px;background:#fffcf0;border-top:1px solid #fce8a0"><div style="font-family:monospace;font-size:7.5pt;color:#b7791f;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">⚠ Flags</div>${flagBadges(col)}</div>`
        : `<div style="padding:10px 16px;background:#f0fff4;border-top:1px solid #c6f6d5;color:#276749;font-size:9pt">✓ No flags for this variable</div>`}
    </div>`).join('')}
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">05</span>Methodological Notes</div>
    <div class="method-grid">
      <div class="mi"><h4>Variance & SD</h4><p>Bessel's correction (n-1).</p><code>s² = Σ(xᵢ - x̄)² / (n-1)</code></div>
      <div class="mi"><h4>Percentile Interpolation</h4><p>Linear interpolation (NIST).</p><code>i = k/100 × (n-1)</code></div>
      <div class="mi"><h4>Outlier Detection</h4><p>Tukey fence: Q1 − ${FLAGS.OUTLIER_IQR}×IQR / Q3 + ${FLAGS.OUTLIER_IQR}×IQR.</p></div>
      <div class="mi"><h4>Skewness</h4><p>Pearson 2nd coefficient.</p><code>g = 3(x̄ − median) / s</code></div>
      <div class="mi"><h4>CV Thresholds</h4><p>High &gt;${FLAGS.CV_HIGH}% · Extreme &gt;${FLAGS.CV_VERY_HIGH}%</p></div>
      <div class="mi"><h4>Significance</h4><p>α = ${REGULATORY.alphaLevel} · CI = ${REGULATORY.ciLevel}</p></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">06</span>Audit Trail & Electronic Signature <span style="font-size:7pt;font-weight:400;color:#a0aec0;margin-left:8px">21 CFR Part 11 — Subpart C</span></div>
    <div class="sig-grid">${sigBlocks}</div>
    <br>
    <div class="audit-box">
      <strong style="color:#1a3a6b">AUDIT METADATA</strong><br>
      Document ID: RPT-${hash} &nbsp;|&nbsp; Software: ${REGULATORY.software} &nbsp;|&nbsp; Generated: ${timestamp()}<br>
      Standard: ${REGULATORY.standard} &nbsp;|&nbsp; Guideline: ${REGULATORY.guideline}
    </div>
  </div>
  <div class="doc-footer">
    <div><strong style="color:#1a3a6b">RPT-${hash}</strong><br>${REGULATORY.software}</div>
    <div style="text-align:center">${meta.confidencialidad||'CONFIDENTIAL'}</div>
    <div style="text-align:right">${REGULATORY.standard}<br>${shortDate()}</div>
  </div>
</div>
</body></html>`;
    }

    // ── Descarga ──────────────────────────
    function downloadBlob(content, filename, type) {
        const blob = new Blob([content], { type });
        const link = document.createElement('a');
        link.href     = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function descargar(formatos, resultados, meta) {
        const hash = generateHash(meta, resultados);
        const base = `RPT-${hash}_${shortDate()}`;
        let delay  = 0;

        if (formatos.includes('txt')) {
            setTimeout(() => downloadBlob(generarTXT(resultados, meta), `${base}.txt`, 'text/plain;charset=utf-8'), delay);
            delay += 350;
        }
        if (formatos.includes('csv')) {
            setTimeout(() => downloadBlob(generarCSV(resultados, meta), `${base}.csv`, 'text/csv;charset=utf-8'), delay);
            delay += 350;
        }
        if (formatos.includes('html')) {
            setTimeout(() => downloadBlob(generarHTML(resultados, meta), `${base}.html`, 'text/html;charset=utf-8'), delay);
        }

        return { base, formatos };
    }

    // ── UI embebida en vista Reportes ─────
    function buildReportesView() {
        const container = document.getElementById('reportes-editor-container');
        if (!container) return;

        const state      = StateManager.getState();
        const resultados = (typeof ultimosResultados !== 'undefined') ? ultimosResultados : null;
        const tieneRes   = !!(resultados?.columnasAnalizadas?.length);
        const fileName   = state.fileName || '';

        container.innerHTML = `
        <div class="rep-layout">

          <!-- IZQUIERDA: metadatos -->
          <div class="rep-left">

            <!-- Banner estado análisis -->
            <div class="rep-status ${tieneRes ? 'rep-status-ok' : 'rep-status-warn'}">
              <div class="rep-status-icon">${tieneRes ? '✓' : '!'}</div>
              <div>
                <div class="rep-status-title">${tieneRes ? t('ui_statusOk') : t('ui_statusWarn')}</div>
                <div class="rep-status-sub">
                  ${tieneRes
                    ? t('ui_statusSubOk', resultados.totalFilas, resultados.totalColumnas, resultados.estadisticos.length)
                    : t('ui_statusSubWarn')}
                </div>
              </div>
            </div>

            ${tieneRes ? `
            <div class="rep-card">
              <div class="rep-card-title">${t('ui_analysisLoaded')}</div>
              <div class="rep-summary-rows">
                <div class="rep-summary-row"><span>${t('ui_variables')}</span><strong>${resultados.columnasAnalizadas.join(', ')}</strong></div>
                <div class="rep-summary-row"><span>${t('ui_statsUsed')}</span><strong>${resultados.estadisticos.join(', ')}</strong></div>
                <div class="rep-summary-row"><span>${t('ui_records')}</span><strong>${resultados.totalFilas}</strong></div>
                <div class="rep-summary-row"><span>${t('ui_source')}</span><strong>${fileName || 'dataset'}</strong></div>
              </div>
            </div>` : ''}

            <div class="rep-card">
              <div class="rep-card-title">${t('ui_instHeader')}</div>
              <div class="rep-form-grid">
              
                <div class="rep-field"><label>Organización</label>
                  <select id="rep-org">
                    <option value="">— Seleccionar —</option>
                    <option>Laboratorio SUED S.R.L.</option><option>Laboratorio X</option>
                  </select>
                </div>

                <div class="rep-field"><label>Departamento</label><input id="rep-dept" placeholder="Validaciones"></div>
                <div class="rep-field"><label>Protocolo / Estudio</label><input id="rep-proto" placeholder="PROTO-2024-001"></div>

                <div class="rep-field"><label>Fase</label>
                  <select id="rep-fase">
                    <option value="">— Seleccionar —</option>
                    <option>DQ</option><option>IQ</option><option>OQ</option><option>PQ</option>
                    <option>Phase IV</option><option>Pre-clinical</option><option>Post-market</option><option>Internal QC</option>
                  </select>
                </div>

                <div class="rep-field"><label>Código de proyecto</label><input id="rep-code" placeholder="PRJ-2024-XXX"></div>
                <div class="rep-field"><label>Versión</label><input id="rep-version" value="1.0"></div>
              </div>
            </div>

            <div class="rep-card">
              <div class="rep-card-title">${t('ui_traceability')}</div>
              <div class="rep-form-grid">
                <div class="rep-field"><label>Nombre del dataset</label><input id="rep-dataset" value="${fileName.replace(/\.[^.]+$/,'')}" placeholder="Nombre_Dataset"></div>
                <div class="rep-field"><label>Archivo fuente</label><input id="rep-file" value="${fileName}" placeholder="datos.csv"></div>
                <div class="rep-field"><label>Fecha de recolección</label><input id="rep-collect" type="date"></div>
                <div class="rep-field"><label>Confidencialidad</label>
                  <select id="rep-conf">
                    <option value="CONFIDENTIAL — FOR INTERNAL USE ONLY">Confidential — Internal</option>
                    <option value="STRICTLY CONFIDENTIAL — RESTRICTED ACCESS">Strictly Confidential</option>
                    <option value="PROPRIETARY — DO NOT DISTRIBUTE">Proprietary</option>
                    <option value="FOR REGULATORY SUBMISSION ONLY">Regulatory Submission Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="rep-card">
              <div class="rep-card-title">${t('ui_signatures')}</div>
              <div class="rep-sig-grid">
                ${['Prepared by','Reviewed by','Approved by'].map((role, i) => {
                    const pfx = ['prep','rev','app'][i];
                    return `
                    <div class="rep-sig-block">
                      <div class="rep-sig-role">${role}</div>
                      <div class="rep-field"><label>Nombre</label><input id="rep-${pfx}-name" placeholder="Dr. Nombre Apellido"></div>
                      <div class="rep-field"><label>Cargo</label><input id="rep-${pfx}-title" placeholder="Cargo / Posición"></div>
                      <div class="rep-field"><label>Fecha</label><input id="rep-${pfx}-date" type="date"></div>
                    </div>`;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- DERECHA: selector de formato + descarga -->
          <div class="rep-right">
            <div class="rep-card rep-format-card">

              <!-- Toggle de idioma -->
              <div class="rep-lang-toggle">
                <span class="rep-lang-label">🌐 Idioma / Language</span>
                <div class="rep-lang-btns">
                  <button class="rep-lang-btn ${currentLang === 'es' ? 'active' : ''}" id="rep-lang-es" data-lang="es">🇪🇸 Español</button>
                  <button class="rep-lang-btn ${currentLang === 'en' ? 'active' : ''}" id="rep-lang-en" data-lang="en">🇺🇸 English</button>
                </div>
              </div>

              <div class="rep-card-title">${t('ui_formatTitle')}</div>
              <p class="rep-format-hint">${t('ui_formatHint')}</p>
              <p class="rep-format-hint">Selecciona uno o más formatos. El botón descarga todos los seleccionados.</p>

              <div class="rep-format-list">
                <label class="rep-format-item" id="fmt-txt-wrap">
                  <input type="checkbox" id="fmt-txt" value="txt" checked>
                  <div class="rep-format-body">
                    <div class="rep-format-icon">📄</div>
                    <div class="rep-format-info">
                      <div class="rep-format-name">.TXT <span class="rep-fmt-badge-recommended">${t('ui_recommended')}</span></div>
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

                <label class="rep-format-item" id="fmt-html-wrap">
                  <input type="checkbox" id="fmt-html" value="html">
                  <div class="rep-format-body">
                    <div class="rep-format-icon">🌐</div>
                    <div class="rep-format-info">
                      <div class="rep-format-name">.HTML <span class="rep-fmt-badge-pdf">${t('ui_pdfReady')}</span></div>
                      <div class="rep-format-desc">${t('ui_htmlDesc')}</div>
                    </div>
                    <div class="rep-format-checkmark">✓</div>
                  </div>
                </label>
              </div>

              <div class="rep-fmt-count-row">
                <span class="rep-fmt-count" id="rep-fmt-count">${t('ui_formatCount', 1)}</span>
              </div>

              <button class="rep-btn-download" id="rep-btn-download" ${!tieneRes ? 'disabled' : ''}>
                ${t('ui_download')}
              </button>

              ${!tieneRes ? `<p class="rep-no-data-msg">${t('ui_noData')}</p>` : ''}

              <div class="rep-reg-box">
                <div class="rep-reg-title">${t('ui_regTitle')}</div>
                <div class="rep-reg-row">📋 ${REGULATORY.standard}</div>
                <div class="rep-reg-row">📐 ${REGULATORY.guideline}</div>
                <div class="rep-reg-row">⚗️ ${REGULATORY.software}</div>
              </div>
            </div>
          </div>
        </div>`;

        // Listeners checkboxes
        ['txt','csv','html'].forEach(fmt => {
            const cb   = document.getElementById(`fmt-${fmt}`);
            const wrap = document.getElementById(`fmt-${fmt}-wrap`);
            if (!cb || !wrap) return;
            updateFormatWrap(wrap, cb.checked);
            cb.addEventListener('change', () => {
                updateFormatWrap(wrap, cb.checked);
                updateFmtCount();
            });
        });
        updateFmtCount();

        // Toggle de idioma — reconstruye la vista completa al cambiar
        ['es','en'].forEach(lang => {
            document.getElementById(`rep-lang-${lang}`)?.addEventListener('click', () => {
                if (currentLang === lang) return;
                currentLang = lang;
                buildReportesView(); // reconstruir con el nuevo idioma
            });
        });

        // Botón descargar
        document.getElementById('rep-btn-download')?.addEventListener('click', () => {
            if (!tieneRes) return;
            const formatos = ['txt','csv','html'].filter(f => document.getElementById(`fmt-${f}`)?.checked);
            if (!formatos.length) { alert(t('ui_alertNoFmt')); return; }

            const meta   = collectMeta();
            const result = descargar(formatos, resultados, meta);

            setTimeout(() => {
                alert(t('ui_alertDownload', result.formatos.map(f => `.${f.toUpperCase()}`).join(' · '), result.base, formatos.includes('html')));
            }, formatos.length * 350 + 100);
        });
    }

    function updateFormatWrap(wrap, checked) {
        wrap.classList.toggle('rep-format-active', checked);
    }

    function updateFmtCount() {
        const n   = ['txt','csv','html'].filter(f => document.getElementById(`fmt-${f}`)?.checked).length;
        const el  = document.getElementById('rep-fmt-count');
        if (el) el.textContent = t('ui_formatCount', n);
    }

    function collectMeta() {
        const g = id => document.getElementById(id)?.value.trim() || '';
        return {
            organizacion:     g('rep-org'),
            departamento:     g('rep-dept'),
            protocolo:        g('rep-proto'),
            fase:             g('rep-fase'),
            codigoProyecto:   g('rep-code'),
            version:          g('rep-version') || '1.0',
            nombreDataset:    g('rep-dataset'),
            archivoFuente:    g('rep-file'),
            fechaRecoleccion: g('rep-collect'),
            confidencialidad: document.getElementById('rep-conf')?.value || 'CONFIDENTIAL',
            preparedBy:       g('rep-prep-name'),
            preparedTitle:    g('rep-prep-title'),
            preparedDate:     g('rep-prep-date'),
            reviewedBy:       g('rep-rev-name'),
            reviewedTitle:    g('rep-rev-title'),
            reviewedDate:     g('rep-rev-date'),
            approvedBy:       g('rep-app-name'),
            approvedTitle:    g('rep-app-title'),
            approvedDate:     g('rep-app-date'),
        };
    }

    // ── API pública ───────────────────────
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