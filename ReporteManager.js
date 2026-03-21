// ========================================
// ReporteManager.js
// Generación de reportes estadísticos
// Cumplimiento: FDA 21 CFR Part 11
// StatAnalyzer Pro
// ========================================

const ReporteManager = (() => {

    // ========================================
    // CONSTANTES REGULATORIAS
    // ========================================

    const REGULATORY = {
        standard:    'FDA 21 CFR Part 11',
        guideline:   'ICH E9 Statistical Principles for Clinical Trials',
        software:    'StatAnalyzer Pro v1.0',
        varianceType:'Sample variance (n-1) — Bessel\'s correction',
        ciLevel:     '95%',
        alphaLevel:  '0.05'
    };

    // Umbrales para flags automáticos
    const FLAGS = {
        CV_HIGH:        30,     // CV > 30% → alta variabilidad
        CV_VERY_HIGH:   50,     // CV > 50% → variabilidad extrema
        N_MIN:          30,     // n < 30 → muestra pequeña
        OUTLIER_IQR:    1.5,    // factor IQR estándar
        SKEW_MODERATE:  0.5,    // |skew| > 0.5 → asimetría moderada
    };

    // ========================================
    // UTILIDADES INTERNAS
    // ========================================

    function pad(str, len, char = ' ') {
        const s = String(str);
        return s.length >= len ? s.slice(0, len) : s + char.repeat(len - s.length);
    }

    function padLeft(str, len, char = ' ') {
        const s = String(str);
        return s.length >= len ? s.slice(0, len) : char.repeat(len - s.length) + s;
    }

    function line(char = '─', len = 80) {
        return char.repeat(len);
    }

    function doubleLine(len = 80) { return '═'.repeat(len); }
    function singleLine(len = 80) { return '─'.repeat(len); }

    function timestamp() {
        const d = new Date();
        return d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    }

    function shortDate() {
        return new Date().toISOString().slice(0, 10);
    }

    function generateAuditHash(meta, resultados) {
        // Hash determinístico simple para trazabilidad (no criptográfico)
        const str = JSON.stringify({ meta, ts: timestamp(), rows: resultados?.totalFilas });
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) - h + str.charCodeAt(i)) | 0;
        }
        return Math.abs(h).toString(16).toUpperCase().padStart(8, '0');
    }

    function fmtNum(val, decimals = 4) {
        if (val === null || val === undefined) return 'N/A';
        if (Array.isArray(val)) return val.length > 0 ? val.map(v => Number(v).toFixed(decimals)).join('; ') : 'No mode';
        if (typeof val === 'number') return isFinite(val) ? val.toFixed(decimals) : 'N/A';
        return String(val);
    }

    // ========================================
    // ANÁLISIS AUXILIAR PARA FLAGS
    // ========================================

    function computeExtendedStats(resultados) {
        const extended = {};
        const cols     = resultados.columnasAnalizadas;
        const res      = resultados.resultados;

        cols.forEach(col => {
            const flags   = [];
            const notes   = [];
            let   cv      = null;
            let   n       = resultados.totalFilas;

            // Extraer media y SD si están disponibles
            const media = res['Media Aritmética']?.[col];
            const sd    = res['Desviación Estándar']?.[col];
            const q1    = res['Percentiles']?.[col]?.P25;
            const q3    = res['Percentiles']?.[col]?.P75;
            const min   = res['Rango y Amplitud']?.[col]?.minimo;
            const max   = res['Rango y Amplitud']?.[col]?.maximo;

            // CV
            if (media != null && sd != null && media !== 0) {
                cv = Math.abs((sd / media) * 100);
                if (cv > FLAGS.CV_VERY_HIGH) {
                    flags.push(`[FLAG-CV-EXTREME] CV = ${cv.toFixed(1)}% exceeds ${FLAGS.CV_VERY_HIGH}% threshold`);
                } else if (cv > FLAGS.CV_HIGH) {
                    flags.push(`[FLAG-CV-HIGH] CV = ${cv.toFixed(1)}% exceeds ${FLAGS.CV_HIGH}% threshold`);
                }
            }

            // Muestra pequeña
            if (n < FLAGS.N_MIN) {
                flags.push(`[FLAG-SMALL-N] n = ${n} < ${FLAGS.N_MIN}. Interpret with caution.`);
            }

            // Outliers via IQR
            if (q1 != null && q3 != null) {
                const iqr = q3 - q1;
                const loFence = q1 - FLAGS.OUTLIER_IQR * iqr;
                const hiFence = q3 + FLAGS.OUTLIER_IQR * iqr;
                if (min < loFence) flags.push(`[FLAG-OUTLIER-LOW] Min = ${fmtNum(min)} below lower fence (${fmtNum(loFence)})`);
                if (max > hiFence) flags.push(`[FLAG-OUTLIER-HIGH] Max = ${fmtNum(max)} above upper fence (${fmtNum(hiFence)})`);
            }

            // Asimetría aproximada via mediana vs media
            const mediana = res['Mediana']?.[col] ?? res['Mediana y Moda']?.[col];
            if (media != null && mediana != null && sd != null && sd > 0) {
                const skew = (3 * (media - mediana)) / sd; // Pearson's skewness
                if (Math.abs(skew) > FLAGS.SKEW_MODERATE) {
                    const dir = skew > 0 ? 'positive (right tail)' : 'negative (left tail)';
                    flags.push(`[FLAG-SKEW] Pearson skewness ≈ ${skew.toFixed(2)} — ${dir}`);
                    notes.push('Non-normal distribution suspected. Consider non-parametric tests.');
                }
            }

            extended[col] = { cv, flags, notes };
        });

        return extended;
    }

    // ========================================
    // FORMATO TXT  (FDA 21 CFR Part 11)
    // ========================================

    function generarTXT(resultados, meta) {
        const hash = generateAuditHash(meta, resultados);
        const ext  = computeExtendedStats(resultados);
        const W    = 80;
        const lines = [];

        const L  = () => lines.push('');
        const D  = () => lines.push(doubleLine(W));
        const S  = () => lines.push(singleLine(W));
        const TL = (t, sub = '') => {
            lines.push(`  ${t}`);
            if (sub) lines.push(`  ${sub}`);
        };

        // ── PORTADA ──────────────────────────────
        D();
        lines.push(pad('', W));
        lines.push(pad(`  STATISTICAL ANALYSIS REPORT`, W));
        lines.push(pad(`  ${REGULATORY.standard} COMPLIANT`, W));
        lines.push(pad('', W));
        D();
        L();
        lines.push(`  Document ID     : RPT-${hash}`);
        lines.push(`  Generated       : ${timestamp()}`);
        lines.push(`  Software        : ${REGULATORY.software}`);
        lines.push(`  Regulatory Ref  : ${REGULATORY.standard}`);
        lines.push(`  Statistical Ref : ${REGULATORY.guideline}`);
        L();

        // ── SECCIÓN 1: ENCABEZADO INSTITUCIONAL ──
        S();
        lines.push('  SECTION 1 — INSTITUTIONAL HEADER');
        S();
        L();
        lines.push(`  Organization    : ${meta.organizacion   || 'NOT SPECIFIED'}`);
        lines.push(`  Department      : ${meta.departamento   || 'NOT SPECIFIED'}`);
        lines.push(`  Study / Protocol: ${meta.protocolo      || 'NOT SPECIFIED'}`);
        lines.push(`  Study Phase     : ${meta.fase           || 'NOT SPECIFIED'}`);
        lines.push(`  Project Code    : ${meta.codigoProyecto || 'NOT SPECIFIED'}`);
        lines.push(`  Report Version  : ${meta.version        || '1.0'}`);
        lines.push(`  Confidentiality : ${meta.confidencialidad || 'CONFIDENTIAL — FOR INTERNAL USE ONLY'}`);
        L();

        // ── SECCIÓN 2: TRAZABILIDAD DEL DATASET ──
        S();
        lines.push('  SECTION 2 — DATASET TRACEABILITY');
        S();
        L();
        lines.push(`  Dataset Name    : ${meta.nombreDataset  || 'NOT SPECIFIED'}`);
        lines.push(`  Source File     : ${meta.archivoFuente  || 'NOT SPECIFIED'}`);
        lines.push(`  Collection Date : ${meta.fechaRecoleccion|| 'NOT SPECIFIED'}`);
        lines.push(`  Analysis Date   : ${shortDate()}`);
        lines.push(`  Total Records   : ${resultados.totalFilas}`);
        lines.push(`  Numeric Columns : ${resultados.totalColumnas}`);
        lines.push(`  Analyzed Columns: ${resultados.columnasAnalizadas.join(', ')}`);
        lines.push(`  Statistics Run  : ${resultados.estadisticos.join(', ')}`);
        L();
        lines.push(`  Integrity Hash  : ${hash}`);
        lines.push(`  NOTE: This hash is generated from report metadata and timestamp.`);
        lines.push(`        It serves as a traceability marker, not a cryptographic signature.`);
        L();

        // ── SECCIÓN 3: RESUMEN EJECUTIVO ─────────
        S();
        lines.push('  SECTION 3 — EXECUTIVE SUMMARY');
        S();
        L();
        lines.push(`  This report presents descriptive statistics computed on dataset`);
        lines.push(`  "${meta.nombreDataset || 'N/A'}" containing ${resultados.totalFilas} observations`);
        lines.push(`  across ${resultados.totalColumnas} numeric variable(s).`);
        L();
        lines.push(`  Statistics computed: ${resultados.estadisticos.join(' | ')}`);
        L();

        // Flags globales
        const allFlags = Object.entries(ext).flatMap(([col, d]) =>
            d.flags.map(f => `  ${col}: ${f}`)
        );

        if (allFlags.length > 0) {
            lines.push(`  ⚠  AUTOMATIC FLAGS DETECTED (${allFlags.length}):`);
            allFlags.forEach(f => lines.push(`     ${f}`));
        } else {
            lines.push('  ✓  No automatic flags detected. Data appears within expected ranges.');
        }
        L();

        // ── SECCIÓN 4: TABLAS DE ESTADÍSTICOS ────
        S();
        lines.push('  SECTION 4 — STATISTICAL RESULTS BY VARIABLE');
        S();
        L();

        resultados.columnasAnalizadas.forEach(col => {
            lines.push(`  ┌${'─'.repeat(W - 4)}┐`);
            lines.push(`  │  Variable: ${pad(col, W - 16)}│`);
            lines.push(`  └${'─'.repeat(W - 4)}┘`);
            L();

            // Tabla de valores por estadístico
            const colW1 = 28;
            const colW2 = 18;
            const colW3 = W - colW1 - colW2 - 6;

            lines.push(`  ${pad('Statistic', colW1)}${pad('Value', colW2)}${pad('Reference', colW3)}`);
            lines.push(`  ${singleLine(W - 4)}`);

            const statsMap = {
                'Media Aritmética':   { label: 'Arithmetic Mean',       ref: 'Measure of central tendency' },
                'Mediana':            { label: 'Median (P50)',           ref: 'Resistant to outliers' },
                'Moda':               { label: 'Mode',                   ref: 'Most frequent value(s)' },
                'Desviación Estándar':{ label: 'Std Deviation (SD)',     ref: 'Sample SD (Bessel n-1)' },
                'Varianza':           { label: 'Variance (s²)',          ref: 'Sample variance (n-1)' },
            };

            Object.entries(resultados.resultados).forEach(([stat, data]) => {
                const val   = data[col];
                if (val === undefined) return;

                const label = statsMap[stat]?.label || stat;
                const ref   = statsMap[stat]?.ref   || '';

                if (typeof val === 'object' && !Array.isArray(val)) {
                    // Percentiles / Rango
                    lines.push(`  ${pad(label + ':', colW1)}${pad('', colW2)}${pad(ref, colW3)}`);
                    Object.entries(val).forEach(([k, v]) => {
                        lines.push(`    ${pad('  · ' + k, colW1)}${pad(fmtNum(v), colW2)}`);
                    });
                } else {
                    lines.push(`  ${pad(label + ':', colW1)}${pad(fmtNum(val), colW2)}${pad(ref, colW3)}`);
                }
            });

            // CV calculado
            if (ext[col]?.cv != null) {
                lines.push(`  ${pad('Coeff. of Variation (CV%):', colW1)}${pad(ext[col].cv.toFixed(2) + '%', colW2)}${pad('SD/Mean × 100', colW3)}`);
            }

            L();

            // Flags por variable
            if (ext[col].flags.length > 0) {
                lines.push(`  ⚠  FLAGS FOR "${col}":`);
                ext[col].flags.forEach(f => lines.push(`     ${f}`));
                L();
            }
            if (ext[col].notes.length > 0) {
                lines.push(`  ℹ  NOTES:`);
                ext[col].notes.forEach(n => lines.push(`     ${n}`));
                L();
            }

            L();
        });

        // ── SECCIÓN 5: NOTAS METODOLÓGICAS ───────
        S();
        lines.push('  SECTION 5 — METHODOLOGICAL NOTES');
        S();
        L();
        lines.push('  5.1  Variance Calculation');
        lines.push(`       ${REGULATORY.varianceType}.`);
        lines.push('       Formula: s² = Σ(xᵢ - x̄)² / (n-1)');
        L();
        lines.push('  5.2  Percentile Interpolation');
        lines.push('       Linear interpolation method (NIST recommended).');
        lines.push('       P(k) = x[⌊i⌋] + (i - ⌊i⌋) × (x[⌈i⌉] - x[⌊i⌋])');
        lines.push('       where i = k/100 × (n-1)');
        L();
        lines.push('  5.3  Outlier Detection');
        lines.push(`       Tukey\'s fence method: Q1 - ${FLAGS.OUTLIER_IQR}×IQR and Q3 + ${FLAGS.OUTLIER_IQR}×IQR.`);
        L();
        lines.push('  5.4  Skewness Approximation');
        lines.push('       Pearson\'s second skewness coefficient:');
        lines.push('       g = 3(x̄ - median) / s');
        L();
        lines.push('  5.5  Coefficient of Variation Thresholds');
        lines.push(`       CV > ${FLAGS.CV_HIGH}%  → High variability warning`);
        lines.push(`       CV > ${FLAGS.CV_VERY_HIGH}% → Extreme variability flag`);
        L();
        lines.push(`  5.6  Significance Level: α = ${REGULATORY.alphaLevel}`);
        lines.push(`       Confidence Interval Level: ${REGULATORY.ciLevel}`);
        L();

        // ── SECCIÓN 6: AUDITORÍA / FIRMA ─────────
        S();
        lines.push('  SECTION 6 — AUDIT TRAIL & ELECTRONIC SIGNATURE');
        lines.push('  (FDA 21 CFR Part 11 — Subpart C)');
        S();
        L();
        lines.push('  6.1  Prepared by');
        lines.push(`       Name     : ${meta.preparedBy    || '_________________________'}`);
        lines.push(`       Title    : ${meta.preparedTitle  || '_________________________'}`);
        lines.push(`       Date     : ${meta.preparedDate   || shortDate()}`);
        lines.push(`       Signature: [Electronic record — system authenticated]`);
        L();
        lines.push('  6.2  Reviewed by');
        lines.push(`       Name     : ${meta.reviewedBy    || '_________________________'}`);
        lines.push(`       Title    : ${meta.reviewedTitle  || '_________________________'}`);
        lines.push(`       Date     : ${meta.reviewedDate   || '_________________________'}`);
        lines.push(`       Signature: [Pending / ${meta.reviewedBy ? 'Completed' : 'Not yet reviewed'}]`);
        L();
        lines.push('  6.3  Approved by');
        lines.push(`       Name     : ${meta.approvedBy    || '_________________________'}`);
        lines.push(`       Title    : ${meta.approvedTitle  || '_________________________'}`);
        lines.push(`       Date     : ${meta.approvedDate   || '_________________________'}`);
        lines.push(`       Signature: [Pending / ${meta.approvedBy ? 'Completed' : 'Not yet approved'}]`);
        L();
        lines.push('  6.4  Audit Metadata');
        lines.push(`       Document ID     : RPT-${hash}`);
        lines.push(`       Software        : ${REGULATORY.software}`);
        lines.push(`       Generation Time : ${timestamp()}`);
        lines.push(`       Standard        : ${REGULATORY.standard}`);
        lines.push(`       Report Version  : ${meta.version || '1.0'}`);
        L();
        lines.push('  NOTE: This electronic record was generated by a validated software system.');
        lines.push('  Per 21 CFR Part 11.10(e), the system maintains audit trail entries');
        lines.push('  with date/time stamps for all record creation and modifications.');
        L();

        // ── PIE ──────────────────────────────────
        D();
        lines.push(`  END OF REPORT — Document ID: RPT-${hash}`);
        lines.push(`  ${REGULATORY.software} | ${REGULATORY.standard}`);
        lines.push(`  Generated: ${timestamp()}`);
        lines.push(`  ${meta.confidencialidad || 'CONFIDENTIAL — DO NOT DISTRIBUTE WITHOUT AUTHORIZATION'}`);
        D();

        return lines.join('\n');
    }

    // ========================================
    // FORMATO CSV (pipe-delimited para SAS/R)
    // ========================================

    function generarCSV(resultados, meta) {
        const hash = generateAuditHash(meta, resultados);
        const ext  = computeExtendedStats(resultados);
        const rows = [];

        // Cabecera de metadatos
        rows.push(['## STATISTICAL ANALYSIS REPORT']);
        rows.push([`## Document ID|RPT-${hash}`]);
        rows.push([`## Generated|${timestamp()}`]);
        rows.push([`## Software|${REGULATORY.software}`]);
        rows.push([`## Standard|${REGULATORY.standard}`]);
        rows.push([`## Organization|${meta.organizacion || ''}`]);
        rows.push([`## Protocol|${meta.protocolo || ''}`]);
        rows.push([`## Dataset|${meta.nombreDataset || ''}`]);
        rows.push([`## Prepared_By|${meta.preparedBy || ''}`]);
        rows.push([`## Reviewed_By|${meta.reviewedBy || ''}`]);
        rows.push([`## Total_Records|${resultados.totalFilas}`]);
        rows.push(['##']);

        // Encabezado tabla principal
        rows.push([
            'VARIABLE',
            'STATISTIC',
            'SUB_KEY',
            'VALUE',
            'CV_PCT',
            'FLAG_COUNT',
            'FLAGS',
            'NOTES'
        ].join('|'));

        resultados.columnasAnalizadas.forEach(col => {
            const cv       = ext[col]?.cv?.toFixed(4) ?? '';
            const flagCount= ext[col]?.flags?.length ?? 0;
            const flagsTxt = (ext[col]?.flags ?? []).join(' | ');
            const notesTxt = (ext[col]?.notes ?? []).join(' | ');

            Object.entries(resultados.resultados).forEach(([stat, data]) => {
                const val = data[col];
                if (val === undefined) return;

                if (typeof val === 'object' && !Array.isArray(val)) {
                    Object.entries(val).forEach(([k, v]) => {
                        rows.push([col, stat, k, fmtNum(v, 6), cv, flagCount, flagsTxt, notesTxt].join('|'));
                    });
                } else if (Array.isArray(val)) {
                    rows.push([col, stat, 'MODE', val.map(v => fmtNum(v, 6)).join(';'), cv, flagCount, flagsTxt, notesTxt].join('|'));
                } else {
                    rows.push([col, stat, '', fmtNum(val, 6), cv, flagCount, flagsTxt, notesTxt].join('|'));
                }
            });
        });

        return rows.map(r => Array.isArray(r) ? r.join('') : r).join('\n');
    }

    // ========================================
    // FORMATO HTML (imprimible como PDF)
    // ========================================

    function generarHTML(resultados, meta) {
        const hash = generateAuditHash(meta, resultados);
        const ext  = computeExtendedStats(resultados);

        const totalFlags = Object.values(ext).reduce((acc, d) => acc + d.flags.length, 0);

        // Helper para filas de tabla estadística
        function statsRows(col) {
            let html = '';
            Object.entries(resultados.resultados).forEach(([stat, data]) => {
                const val = data[col];
                if (val === undefined) return;

                if (typeof val === 'object' && !Array.isArray(val)) {
                    html += `<tr class="stat-group-header"><td colspan="3"><em>${stat}</em></td></tr>`;
                    Object.entries(val).forEach(([k, v]) => {
                        html += `<tr><td class="indent">· ${k}</td><td class="val">${fmtNum(v)}</td><td class="ref">—</td></tr>`;
                    });
                } else {
                    const valFmt = Array.isArray(val)
                        ? (val.length > 0 ? val.map(v => fmtNum(v)).join(', ') : '<em>No mode</em>')
                        : fmtNum(val);
                    const refs = {
                        'Media Aritmética':    'Central tendency',
                        'Mediana':             'Robust to outliers',
                        'Moda':                'Most frequent',
                        'Desviación Estándar': 'Sample SD (n-1)',
                        'Varianza':            'Sample s² (n-1)',
                    };
                    html += `<tr><td>${stat}</td><td class="val">${valFmt}</td><td class="ref">${refs[stat] || ''}</td></tr>`;
                }
            });
            // CV
            if (ext[col]?.cv != null) {
                html += `<tr class="cv-row"><td>Coefficient of Variation</td><td class="val">${ext[col].cv.toFixed(2)}%</td><td class="ref">SD/Mean × 100</td></tr>`;
            }
            return html;
        }

        function flagBadges(col) {
            if (!ext[col]?.flags?.length) return '<span class="badge badge-ok">✓ No flags</span>';
            return ext[col].flags.map(f => {
                const cls = f.includes('EXTREME') || f.includes('OUTLIER') ? 'badge-danger' :
                            f.includes('HIGH') || f.includes('SKEW')       ? 'badge-warn'   : 'badge-info';
                return `<span class="badge ${cls}">${f}</span>`;
            }).join('');
        }

        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Statistical Report — RPT-${hash}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --blue:    #1a3a6b;
    --blue-lt: #2c5282;
    --accent:  #c8a951;
    --gray:    #4a5568;
    --light:   #f7f8fa;
    --border:  #d1d9e0;
    --danger:  #c53030;
    --warn:    #b7791f;
    --ok:      #276749;
    --text:    #1a202c;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 11pt;
    color: var(--text);
    background: white;
    padding: 0;
    line-height: 1.6;
  }

  /* ── Portada ── */
  .cover {
    background: var(--blue);
    color: white;
    padding: 60px 70px 50px;
    position: relative;
    border-bottom: 6px solid var(--accent);
  }
  .cover-logo {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10pt;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.55);
    text-transform: uppercase;
    margin-bottom: 40px;
  }
  .cover-title {
    font-size: 26pt;
    font-weight: 300;
    letter-spacing: -0.5px;
    line-height: 1.2;
    margin-bottom: 8px;
  }
  .cover-subtitle {
    font-size: 12pt;
    color: var(--accent);
    font-weight: 300;
    letter-spacing: 1px;
    margin-bottom: 50px;
  }
  .cover-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 40px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    color: rgba(255,255,255,0.75);
    border-top: 1px solid rgba(255,255,255,0.2);
    padding-top: 24px;
  }
  .cover-meta-item strong { color: var(--accent); display: block; font-size: 7.5pt; letter-spacing: 1px; text-transform: uppercase; }

  /* ── Documento ── */
  .doc { max-width: 900px; margin: 0 auto; padding: 50px 70px; }

  /* ── Secciones ── */
  .section { margin-bottom: 44px; }
  .section-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--blue);
    border-bottom: 2px solid var(--blue);
    padding-bottom: 6px;
    margin-bottom: 20px;
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  .section-num {
    background: var(--blue);
    color: white;
    font-size: 7pt;
    padding: 2px 7px;
    border-radius: 2px;
  }

  /* ── Meta grid ── */
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 32px;
  }
  .meta-item {}
  .meta-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    color: var(--gray);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    display: block;
    margin-bottom: 2px;
  }
  .meta-value {
    font-size: 10.5pt;
    color: var(--text);
    font-weight: 400;
    border-bottom: 1px solid var(--border);
    padding-bottom: 4px;
  }

  /* ── Resumen ejecutivo ── */
  .exec-summary {
    background: var(--light);
    border-left: 4px solid var(--blue);
    border-radius: 0 6px 6px 0;
    padding: 18px 22px;
    font-size: 10.5pt;
    line-height: 1.7;
  }
  .exec-summary p { margin-bottom: 8px; }
  .exec-summary p:last-child { margin-bottom: 0; }

  /* ── Flags summary ── */
  .flags-summary {
    margin-top: 16px;
    padding: 14px 18px;
    border-radius: 6px;
    font-size: 9.5pt;
  }
  .flags-summary.has-flags { background: #fffbeb; border: 1px solid #f6e05e; }
  .flags-summary.no-flags  { background: #f0fff4; border: 1px solid #9ae6b4; }
  .flags-summary ul { margin-top: 8px; padding-left: 18px; }
  .flags-summary li { margin-bottom: 4px; }

  /* ── Tablas de estadísticos ── */
  .var-block {
    margin-bottom: 36px;
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }
  .var-header {
    background: var(--blue);
    color: white;
    padding: 10px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .var-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11pt;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  .var-n {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    color: rgba(255,255,255,0.65);
  }

  table.stats-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
  }
  .stats-table th {
    background: #f0f4f8;
    color: var(--blue);
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 8px 14px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .stats-table td {
    padding: 7px 14px;
    border-bottom: 1px solid #edf2f7;
    vertical-align: middle;
  }
  .stats-table tr:last-child td { border-bottom: none; }
  .stats-table tr:hover td { background: #f7faff; }
  .stats-table .val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    text-align: right;
    color: var(--blue-lt);
    font-weight: 500;
  }
  .stats-table .ref {
    color: #a0aec0;
    font-size: 8.5pt;
    font-style: italic;
    text-align: right;
  }
  .stats-table .indent { padding-left: 28px; color: var(--gray); }
  .stats-table .stat-group-header td {
    background: #f7f8fa;
    font-size: 8.5pt;
    color: var(--gray);
    padding: 5px 14px;
  }
  .stats-table .cv-row td {
    background: #fffaf0;
    font-weight: 500;
  }

  /* ── Flags por variable ── */
  .var-flags { padding: 12px 18px; background: #fffcf0; border-top: 1px solid #fce8a0; }
  .var-flags-ok { padding: 10px 18px; background: #f0fff4; border-top: 1px solid #c6f6d5; color: var(--ok); font-size: 9pt; }
  .var-flags-title { font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 1px; color: var(--warn); margin-bottom: 6px; }

  /* ── Badges ── */
  .badge {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    padding: 3px 8px;
    border-radius: 3px;
    margin: 2px 3px 2px 0;
    line-height: 1.4;
  }
  .badge-ok     { background: #c6f6d5; color: #276749; }
  .badge-danger { background: #fed7d7; color: #c53030; }
  .badge-warn   { background: #fefcbf; color: #b7791f; }
  .badge-info   { background: #bee3f8; color: #2b6cb0; }

  /* ── Notas metodológicas ── */
  .method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 32px; }
  .method-item { border-left: 3px solid var(--border); padding: 8px 14px; }
  .method-item h4 { font-size: 9pt; font-weight: 600; color: var(--blue); margin-bottom: 4px; }
  .method-item p  { font-size: 9pt; color: var(--gray); line-height: 1.5; }
  .method-item code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    background: var(--light);
    padding: 1px 4px;
    border-radius: 2px;
    display: block;
    margin-top: 4px;
    color: var(--blue-lt);
  }

  /* ── Firmas ── */
  .sig-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .sig-box {
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 16px;
  }
  .sig-role { font-family: 'JetBrains Mono', monospace; font-size: 7pt; text-transform: uppercase; letter-spacing: 1.5px; color: var(--blue); margin-bottom: 10px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
  .sig-field { margin-bottom: 10px; }
  .sig-field-label { font-size: 7.5pt; color: #a0aec0; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
  .sig-field-value { font-size: 9.5pt; border-bottom: 1px solid var(--border); padding-bottom: 3px; min-height: 20px; color: var(--text); }
  .sig-field-value.empty { color: #cbd5e0; font-style: italic; }
  .sig-line { border-top: 1px solid var(--text); margin-top: 20px; padding-top: 6px; font-size: 7.5pt; color: var(--gray); font-family: 'JetBrains Mono', monospace; }

  /* ── Audit footer ── */
  .audit-box {
    background: var(--light);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 16px 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    color: var(--gray);
    line-height: 1.8;
  }
  .audit-box strong { color: var(--blue); }

  /* ── Footer del doc ── */
  .doc-footer {
    margin-top: 50px;
    padding-top: 20px;
    border-top: 2px solid var(--blue);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    color: #a0aec0;
  }
  .doc-footer strong { color: var(--blue); }

  /* ── Print ── */
  @media print {
    body { font-size: 9.5pt; }
    .cover { padding: 40px 50px; }
    .doc { padding: 30px 50px; }
    .var-block { page-break-inside: avoid; }
    .section { page-break-inside: avoid; }
    .sig-grid { page-break-inside: avoid; }
    @page { margin: 1.5cm 1.5cm; size: A4; }
  }
</style>
</head>
<body>

<!-- PORTADA -->
<div class="cover">
  <div class="cover-logo">StatAnalyzer Pro · Statistical Report</div>
  <div class="cover-title">Statistical Analysis Report</div>
  <div class="cover-subtitle">${REGULATORY.standard} Compliant</div>
  <div class="cover-meta">
    <div class="cover-meta-item"><strong>Document ID</strong>RPT-${hash}</div>
    <div class="cover-meta-item"><strong>Organization</strong>${meta.organizacion || '—'}</div>
    <div class="cover-meta-item"><strong>Protocol / Study</strong>${meta.protocolo || '—'}</div>
    <div class="cover-meta-item"><strong>Version</strong>${meta.version || '1.0'}</div>
    <div class="cover-meta-item"><strong>Generated</strong>${timestamp()}</div>
    <div class="cover-meta-item"><strong>Records Analyzed</strong>${resultados.totalFilas}</div>
  </div>
</div>

<div class="doc">

  <!-- S1: ENCABEZADO INSTITUCIONAL -->
  <div class="section">
    <div class="section-title"><span class="section-num">01</span>Institutional Header</div>
    <div class="meta-grid">
      <div class="meta-item"><span class="meta-label">Organization</span><span class="meta-value">${meta.organizacion || '—'}</span></div>
      <div class="meta-item"><span class="meta-label">Department</span><span class="meta-value">${meta.departamento || '—'}</span></div>
      <div class="meta-item"><span class="meta-label">Study / Protocol</span><span class="meta-value">${meta.protocolo || '—'}</span></div>
      <div class="meta-item"><span class="meta-label">Study Phase</span><span class="meta-value">${meta.fase || '—'}</span></div>
      <div class="meta-item"><span class="meta-label">Project Code</span><span class="meta-value">${meta.codigoProyecto || '—'}</span></div>
      <div class="meta-item"><span class="meta-label">Report Version</span><span class="meta-value">${meta.version || '1.0'}</span></div>
      <div class="meta-item" style="grid-column:1/-1"><span class="meta-label">Confidentiality</span><span class="meta-value">${meta.confidencialidad || 'CONFIDENTIAL — FOR INTERNAL USE ONLY'}</span></div>
    </div>
  </div>

  <!-- S2: TRAZABILIDAD -->
  <div class="section">
    <div class="section-title"><span class="section-num">02</span>Dataset Traceability</div>
    <div class="meta-grid">
      <div class="meta-item"><span class="meta-label">Dataset Name</span><span class="meta-value">${meta.nombreDataset || '—'}</span></div>
      <div class="meta-item"><span class="meta-label">Source File</span><span class="meta-value">${meta.archivoFuente || '—'}</span></div>
      <div class="meta-item"><span class="meta-label">Collection Date</span><span class="meta-value">${meta.fechaRecoleccion || '—'}</span></div>
      <div class="meta-item"><span class="meta-label">Analysis Date</span><span class="meta-value">${shortDate()}</span></div>
      <div class="meta-item"><span class="meta-label">Total Records</span><span class="meta-value">${resultados.totalFilas}</span></div>
      <div class="meta-item"><span class="meta-label">Numeric Variables</span><span class="meta-value">${resultados.totalColumnas}</span></div>
      <div class="meta-item" style="grid-column:1/-1"><span class="meta-label">Variables Analyzed</span><span class="meta-value">${resultados.columnasAnalizadas.join(' · ')}</span></div>
      <div class="meta-item" style="grid-column:1/-1"><span class="meta-label">Statistics Computed</span><span class="meta-value">${resultados.estadisticos.join(' · ')}</span></div>
      <div class="meta-item" style="grid-column:1/-1"><span class="meta-label">Integrity Hash (traceability)</span><span class="meta-value" style="font-family:monospace;font-size:9pt;">RPT-${hash}</span></div>
    </div>
  </div>

  <!-- S3: RESUMEN EJECUTIVO -->
  <div class="section">
    <div class="section-title"><span class="section-num">03</span>Executive Summary</div>
    <div class="exec-summary">
      <p>This report presents descriptive statistics computed on dataset <strong>"${meta.nombreDataset || 'N/A'}"</strong>
      containing <strong>${resultados.totalFilas}</strong> observations across
      <strong>${resultados.totalColumnas}</strong> numeric variable(s),
      analyzed under <strong>${REGULATORY.standard}</strong> compliance framework.</p>
      <p>Statistics computed: ${resultados.estadisticos.join(' · ')}.</p>
    </div>
    <div class="flags-summary ${totalFlags > 0 ? 'has-flags' : 'no-flags'}">
      ${totalFlags > 0
        ? `<strong>⚠ ${totalFlags} automatic flag(s) detected across all variables.</strong>
           <ul>${Object.entries(ext).flatMap(([col, d]) => d.flags.map(f => `<li><strong>${col}:</strong> ${f}</li>`)).join('')}</ul>`
        : '<strong>✓ No automatic flags detected.</strong> All variables are within expected statistical ranges.'
      }
    </div>
  </div>

  <!-- S4: ESTADÍSTICOS POR VARIABLE -->
  <div class="section">
    <div class="section-title"><span class="section-num">04</span>Statistical Results by Variable</div>
    ${resultados.columnasAnalizadas.map(col => `
    <div class="var-block">
      <div class="var-header">
        <span class="var-name">${col}</span>
        <span class="var-n">n = ${resultados.totalFilas} obs.</span>
      </div>
      <table class="stats-table">
        <thead><tr><th>Statistic</th><th style="text-align:right">Value</th><th style="text-align:right">Reference</th></tr></thead>
        <tbody>${statsRows(col)}</tbody>
      </table>
      ${ext[col]?.flags?.length > 0
        ? `<div class="var-flags"><div class="var-flags-title">⚠ Automatic Flags</div>${flagBadges(col)}${ext[col].notes.length > 0 ? '<br><br><em style="font-size:8.5pt;color:#666;">' + ext[col].notes.join(' ') + '</em>' : ''}</div>`
        : `<div class="var-flags-ok">✓ No flags for this variable</div>`
      }
    </div>`).join('')}
  </div>

  <!-- S5: NOTAS METODOLÓGICAS -->
  <div class="section">
    <div class="section-title"><span class="section-num">05</span>Methodological Notes</div>
    <div class="method-grid">
      <div class="method-item">
        <h4>Variance &amp; Standard Deviation</h4>
        <p>Sample variance with Bessel's correction (n-1).</p>
        <code>s² = Σ(xᵢ - x̄)² / (n-1)</code>
      </div>
      <div class="method-item">
        <h4>Percentile Interpolation</h4>
        <p>Linear interpolation (NIST method).</p>
        <code>P(k): i = k/100 × (n-1), linear interp.</code>
      </div>
      <div class="method-item">
        <h4>Outlier Detection</h4>
        <p>Tukey's fence: Q1 − ${FLAGS.OUTLIER_IQR}×IQR and Q3 + ${FLAGS.OUTLIER_IQR}×IQR.</p>
      </div>
      <div class="method-item">
        <h4>Skewness Approximation</h4>
        <p>Pearson's second coefficient.</p>
        <code>g = 3(x̄ − median) / s</code>
      </div>
      <div class="method-item">
        <h4>CV Thresholds</h4>
        <p>High: CV &gt; ${FLAGS.CV_HIGH}% · Extreme: CV &gt; ${FLAGS.CV_VERY_HIGH}%</p>
      </div>
      <div class="method-item">
        <h4>Significance Level</h4>
        <p>α = ${REGULATORY.alphaLevel} · CI = ${REGULATORY.ciLevel}</p>
      </div>
    </div>
  </div>

  <!-- S6: AUDITORÍA / FIRMAS -->
  <div class="section">
    <div class="section-title"><span class="section-num">06</span>Audit Trail &amp; Electronic Signature <span style="font-size:7pt;font-weight:400;color:#a0aec0;margin-left:8px;">21 CFR Part 11 — Subpart C</span></div>
    <div class="sig-grid">
      ${['Prepared', 'Reviewed', 'Approved'].map(role => {
        const key = role.toLowerCase() + 'By';
        const name  = meta[key]            || '';
        const title = meta[role.toLowerCase() + 'Title'] || '';
        const date  = meta[role.toLowerCase() + 'Date']  || '';
        return `
        <div class="sig-box">
          <div class="sig-role">${role} by</div>
          <div class="sig-field"><span class="sig-field-label">Name</span><span class="sig-field-value ${!name ? 'empty' : ''}">${name || 'Pending'}</span></div>
          <div class="sig-field"><span class="sig-field-label">Title / Position</span><span class="sig-field-value ${!title ? 'empty' : ''}">${title || '—'}</span></div>
          <div class="sig-field"><span class="sig-field-label">Date</span><span class="sig-field-value ${!date ? 'empty' : ''}">${date || '—'}</span></div>
          <div class="sig-line">Electronic signature · ${REGULATORY.standard}</div>
        </div>`;
      }).join('')}
    </div>
    <br>
    <div class="audit-box">
      <strong>AUDIT METADATA</strong><br>
      Document ID: RPT-${hash} &nbsp;|&nbsp;
      Software: ${REGULATORY.software} &nbsp;|&nbsp;
      Generated: ${timestamp()}<br>
      Standard: ${REGULATORY.standard} &nbsp;|&nbsp;
      Guideline: ${REGULATORY.guideline}<br><br>
      Per 21 CFR Part 11.10(e), this system maintains audit trail entries with date/time stamps
      for all record creation and modifications. This electronic record was generated by a
      validated statistical software system.
    </div>
  </div>

  <!-- FOOTER -->
  <div class="doc-footer">
    <div><strong>RPT-${hash}</strong><br>${REGULATORY.software}</div>
    <div style="text-align:center">${meta.confidencialidad || 'CONFIDENTIAL — DO NOT DISTRIBUTE WITHOUT AUTHORIZATION'}</div>
    <div style="text-align:right">${REGULATORY.standard}<br>Generated ${shortDate()}</div>
  </div>

</div>
</body>
</html>`;
    }

    // ========================================
    // MODAL DE METADATOS
    // ========================================

    function buildModal() {
        // Eliminar modal previo si existe
        document.getElementById('reporte-modal')?.remove();

        const modal = document.createElement('div');
        modal.id    = 'reporte-modal';
        modal.innerHTML = `
        <div class="rm-overlay" id="rm-overlay"></div>
        <div class="rm-dialog">
          <div class="rm-header">
            <div>
              <h2 class="rm-title">Configurar Reporte</h2>
              <p class="rm-subtitle">FDA 21 CFR Part 11 — Metadatos institucionales</p>
            </div>
            <button class="rm-close" id="rm-close">✕</button>
          </div>

          <div class="rm-body">
            <div class="rm-section-label">Información Institucional</div>
            <div class="rm-grid">
              <div class="rm-field"><label>Organización / Empresa</label><input id="rm-org" placeholder="Pharma Corp S.A."></div>
              <div class="rm-field"><label>Departamento</label><input id="rm-dept" placeholder="Bioestadística Clínica"></div>
              <div class="rm-field"><label>Protocolo / Estudio</label><input id="rm-proto" placeholder="PROTO-2024-001"></div>
              <div class="rm-field"><label>Fase del estudio</label>
                <select id="rm-fase">
                  <option value="">— Seleccionar —</option>
                  <option>Phase I</option><option>Phase II</option>
                  <option>Phase III</option><option>Phase IV</option>
                  <option>Pre-clinical</option><option>Post-market</option>
                  <option>Internal QC</option>
                </select>
              </div>
              <div class="rm-field"><label>Código de proyecto</label><input id="rm-code" placeholder="PRJ-2024-XXX"></div>
              <div class="rm-field"><label>Versión del reporte</label><input id="rm-version" value="1.0" placeholder="1.0"></div>
            </div>

            <div class="rm-section-label" style="margin-top:20px">Trazabilidad del Dataset</div>
            <div class="rm-grid">
              <div class="rm-field"><label>Nombre del dataset</label><input id="rm-dataset" placeholder="Datos_Ensayo_Clinico_2024"></div>
              <div class="rm-field"><label>Archivo fuente</label><input id="rm-file" placeholder="datos.csv"></div>
              <div class="rm-field"><label>Fecha de recolección</label><input id="rm-collect" type="date"></div>
              <div class="rm-field"><label>Confidencialidad</label>
                <select id="rm-conf">
                  <option value="CONFIDENTIAL — FOR INTERNAL USE ONLY">Confidential — Internal</option>
                  <option value="STRICTLY CONFIDENTIAL — RESTRICTED ACCESS">Strictly Confidential</option>
                  <option value="PROPRIETARY — DO NOT DISTRIBUTE">Proprietary</option>
                  <option value="FOR REGULATORY SUBMISSION ONLY">Regulatory Submission Only</option>
                </select>
              </div>
            </div>

            <div class="rm-section-label" style="margin-top:20px">Auditoría / Firmas (21 CFR Part 11)</div>
            <div class="rm-grid rm-grid-3">
              <div class="rm-sig-block">
                <div class="rm-sig-role">Prepared by</div>
                <div class="rm-field"><label>Nombre</label><input id="rm-prep-name" placeholder="Dr. Ana García"></div>
                <div class="rm-field"><label>Cargo</label><input id="rm-prep-title" placeholder="Bioestadístico Senior"></div>
                <div class="rm-field"><label>Fecha</label><input id="rm-prep-date" type="date"></div>
              </div>
              <div class="rm-sig-block">
                <div class="rm-sig-role">Reviewed by</div>
                <div class="rm-field"><label>Nombre</label><input id="rm-rev-name" placeholder="Dr. Juan López"></div>
                <div class="rm-field"><label>Cargo</label><input id="rm-rev-title" placeholder="Director Estadística"></div>
                <div class="rm-field"><label>Fecha</label><input id="rm-rev-date" type="date"></div>
              </div>
              <div class="rm-sig-block">
                <div class="rm-sig-role">Approved by</div>
                <div class="rm-field"><label>Nombre</label><input id="rm-app-name" placeholder="Dr. María Torres"></div>
                <div class="rm-field"><label>Cargo</label><input id="rm-app-title" placeholder="VP Asuntos Regulatorios"></div>
                <div class="rm-field"><label>Fecha</label><input id="rm-app-date" type="date"></div>
              </div>
            </div>
          </div>

          <div class="rm-footer">
            <span class="rm-footer-note">Se generarán 3 formatos: .txt · .csv (pipe-delimited) · .html</span>
            <div class="rm-footer-btns">
              <button class="rm-btn-cancel" id="rm-cancel">Cancelar</button>
              <button class="rm-btn-export" id="rm-export">📥 Exportar Reporte</button>
            </div>
          </div>
        </div>`;

        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('rm-visible'));

        // Prerellenar con datos del StateManager si existen
        const state = StateManager.getState();
        if (state.fileName) {
            document.getElementById('rm-file').value    = state.fileName;
            document.getElementById('rm-dataset').value = state.fileName.replace(/\.[^.]+$/, '');
        }

        // Cerrar
        const close = () => {
            modal.classList.remove('rm-visible');
            setTimeout(() => modal.remove(), 300);
        };
        document.getElementById('rm-close').addEventListener('click', close);
        document.getElementById('rm-cancel').addEventListener('click', close);
        document.getElementById('rm-overlay').addEventListener('click', close);

        // Exportar
        document.getElementById('rm-export').addEventListener('click', () => {
            const meta = collectMeta();
            close();
            setTimeout(() => ejecutarExportacion(meta), 350);
        });
    }

    function collectMeta() {
        return {
            organizacion:     document.getElementById('rm-org')?.value.trim()        || '',
            departamento:     document.getElementById('rm-dept')?.value.trim()       || '',
            protocolo:        document.getElementById('rm-proto')?.value.trim()      || '',
            fase:             document.getElementById('rm-fase')?.value              || '',
            codigoProyecto:   document.getElementById('rm-code')?.value.trim()       || '',
            version:          document.getElementById('rm-version')?.value.trim()    || '1.0',
            nombreDataset:    document.getElementById('rm-dataset')?.value.trim()    || '',
            archivoFuente:    document.getElementById('rm-file')?.value.trim()       || '',
            fechaRecoleccion: document.getElementById('rm-collect')?.value           || '',
            confidencialidad: document.getElementById('rm-conf')?.value              || 'CONFIDENTIAL',
            preparedBy:       document.getElementById('rm-prep-name')?.value.trim()  || '',
            preparedTitle:    document.getElementById('rm-prep-title')?.value.trim() || '',
            preparedDate:     document.getElementById('rm-prep-date')?.value         || '',
            reviewedBy:       document.getElementById('rm-rev-name')?.value.trim()   || '',
            reviewedTitle:    document.getElementById('rm-rev-title')?.value.trim()  || '',
            reviewedDate:     document.getElementById('rm-rev-date')?.value          || '',
            approvedBy:       document.getElementById('rm-app-name')?.value.trim()   || '',
            approvedTitle:    document.getElementById('rm-app-title')?.value.trim()  || '',
            approvedDate:     document.getElementById('rm-app-date')?.value          || '',
        };
    }

    function downloadBlob(content, filename, type) {
        const blob = new Blob([content], { type });
        const link = document.createElement('a');
        link.href     = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function ejecutarExportacion(meta) {
        // ultimosResultados viene del scope global de script.js
        const resultados = (typeof ultimosResultados !== 'undefined') ? ultimosResultados : null;

        if (!resultados) {
            alert('⚠️ No hay resultados de análisis para exportar.\nEjecuta un análisis primero.');
            return;
        }

        const base = `RPT-${generateAuditHash(meta, resultados)}_${shortDate()}`;

        try {
            // 1. TXT
            downloadBlob(generarTXT(resultados, meta), `${base}.txt`, 'text/plain;charset=utf-8');

            setTimeout(() => {
                // 2. CSV pipe-delimited
                downloadBlob(generarCSV(resultados, meta), `${base}.csv`, 'text/csv;charset=utf-8');
            }, 400);

            setTimeout(() => {
                // 3. HTML
                downloadBlob(generarHTML(resultados, meta), `${base}.html`, 'text/html;charset=utf-8');
            }, 800);

            // Notificación
            setTimeout(() => {
                alert(`✅ Reporte exportado en 3 formatos:\n\n· ${base}.txt\n· ${base}.csv\n· ${base}.html\n\nEl archivo .html puede abrirse en el navegador e imprimirse como PDF.`);
            }, 1000);

        } catch (err) {
            console.error('Error al exportar:', err);
            alert('❌ Error al exportar el reporte:\n\n' + err.message);
        }
    }

    // ========================================
    // CSS DEL MODAL (se inyecta en el <head>)
    // ========================================

    function injectModalCSS() {
        if (document.getElementById('rm-styles')) return;
        const style = document.createElement('style');
        style.id = 'rm-styles';
        style.textContent = `
        #reporte-modal { display: none; }
        #reporte-modal.rm-visible { display: block; }

        .rm-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.55);
            backdrop-filter: blur(3px);
            z-index: 1000;
            animation: rmFadeIn 0.25s ease;
        }
        .rm-dialog {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1001;
            background: white;
            border-radius: 16px;
            width: min(860px, 95vw);
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 24px 64px rgba(0,0,0,0.25);
            animation: rmSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
            overflow: hidden;
        }
        @keyframes rmFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rmSlideIn { from { opacity: 0; transform: translate(-50%, -46%); } to { opacity: 1; transform: translate(-50%, -50%); } }

        .rm-header {
            padding: 20px 24px 16px;
            border-bottom: 2px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            background: linear-gradient(135deg, #1a3a6b 0%, #2c5282 100%);
        }
        .rm-title {
            color: white;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 2px;
        }
        .rm-subtitle {
            color: rgba(255,255,255,0.65);
            font-size: 0.78rem;
            font-family: monospace;
        }
        .rm-close {
            background: rgba(255,255,255,0.15);
            border: none;
            color: white;
            width: 30px; height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.2s;
        }
        .rm-close:hover { background: rgba(255,255,255,0.3); }

        .rm-body {
            padding: 22px 24px;
            overflow-y: auto;
            flex: 1;
        }
        .rm-section-label {
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #1a3a6b;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 6px;
            margin-bottom: 14px;
        }
        .rm-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px 20px;
            margin-bottom: 8px;
        }
        .rm-grid-3 {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
        }
        .rm-field { display: flex; flex-direction: column; gap: 4px; }
        .rm-field label {
            font-size: 0.72rem;
            font-weight: 600;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .rm-field input,
        .rm-field select {
            padding: 8px 10px;
            border: 1.5px solid #e0e0e0;
            border-radius: 7px;
            font-size: 0.85rem;
            font-family: 'Segoe UI', sans-serif;
            color: #333;
            transition: border-color 0.2s;
            background: white;
        }
        .rm-field input:focus,
        .rm-field select:focus {
            outline: none;
            border-color: #667eea;
        }
        .rm-sig-block {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 14px;
            border: 1.5px solid #e9ecef;
        }
        .rm-sig-role {
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #1a3a6b;
            margin-bottom: 10px;
        }

        .rm-footer {
            padding: 16px 24px;
            border-top: 2px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
        }
        .rm-footer-note {
            font-size: 0.78rem;
            color: #888;
            font-family: monospace;
        }
        .rm-footer-btns { display: flex; gap: 10px; }
        .rm-btn-cancel {
            padding: 9px 20px;
            background: white;
            border: 1.5px solid #e0e0e0;
            border-radius: 8px;
            color: #666;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        .rm-btn-cancel:hover { background: #f0f0f0; }
        .rm-btn-export {
            padding: 9px 22px;
            background: linear-gradient(135deg, #000, #211ed1);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .rm-btn-export:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(102,126,234,0.4);
        }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // API PÚBLICA
    // ========================================

    return {
        // Abrir modal y gestionar todo el flujo
        abrirModal() {
            injectModalCSS();
            buildModal();
        },
        // Acceso directo a generadores (para uso externo)
        generarTXT,
        generarCSV,
        generarHTML,
        computeExtendedStats,
    };

})();

console.log('✅ ReporteManager cargado — FDA 21 CFR Part 11');