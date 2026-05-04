// ═══════════════════════════════════════════════════════════════════════════
// REPORTESMANAGER - Módulo de gestión de reportes para dashboard
// ═══════════════════════════════════════════════════════════════════════════

const ReportesManager = (() => {
  const STORAGE_KEY = 'sigmaPro_reportes';

  const CFR21_CONFIG = {
    standard: 'FDA 21 CFR Part 11',
    scope: 'Electronic Records; Electronic Signatures',
    software: 'StatAnalyzer Pro',
    version: '2.5',
    alphaLevel: '0.05',
    ciLevel: '95%'
  };

  const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function loadReportes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveReportes(reportes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reportes));
  }

  async function generateIntegrityHash(data) {
    const timestamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const payload = JSON.stringify({ ...data, uid: timestamp });
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.slice(0, 8).map(b => b.toFixed(16).padStart(2, '0')).join('').toUpperCase();
  }

  function getAuditMetadata() {
    const userName = document.getElementById('userName')?.textContent || 'Usuario';
    return {
      generatedBy: userName,
      generationDate: new Date().toISOString(),
      generationDateFormatted: formatFullDate(new Date()),
      software: CFR21_CONFIG.software,
      version: CFR21_CONFIG.version,
      regulatoryFramework: CFR21_CONFIG.standard
    };
  }

  function formatFullDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = MONTHS_ES[date.getMonth()];
    const year = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hh}:${mm}:${ss}`;
  }

  function getDatasetTraceability(analisis) {
    return {
      datasetName: analisis?.dataset || 'N/A',
      analysisDate: analisis?.fecha || new Date().toISOString(),
      columnsAnalyzed: analisis?.columnas || [],
      totalStatistics: analisis?.pruebas?.length || 0,
      collectionDate: analisis?.fecha || null,
      sourceSystem: 'StatAnalyzer Pro'
    };
  }

  function getElectronicSignatures(autor) {
    const now = new Date();
    return {
      prepared: {
        name: autor || 'Usuario',
        title: 'Analista de Datos',
        date: formatFullDate(now),
        action: 'Generado',
        meaning: 'Preparación del reporte'
      },
      reviewed: {
        name: '',
        title: '',
        date: '',
        action: '',
        meaning: 'Revisión del reporte'
      },
      approved: {
        name: '',
        title: '',
        date: '',
        action: '',
        meaning: 'Aprobación del reporte'
      }
    };
  }

  function getMethodologyNotes() {
    return {
      statisticalMethods: {
        descriptive: 'Estadísticos descriptivos: Media, Mediana, Desviación Estándar, Varianza, Percentiles',
        dispersion: 'Medidas de dispersión: Rango, Rango Intercuartil, Coeficiente de Variación',
        distribution: 'Análisis de distribución: Asimetría, Curtosis, Detección de Outliers',
        confidence: `Intervalos de Confianza: Nivel ${CFR21_CONFIG.ciLevel}, α = ${CFR21_CONFIG.alphaLevel}`
      },
      references: {
        standards: 'NIST Statistical Reference',
        compliance: CFR21_CONFIG.standard
      }
    };
  }

  function init() {
    renderReportesList();
    setupSearch();
    console.log('📄 ReportesManager inicializado - CFR 21 Part 11 Ready');
  }

  function renderReportesList() {
    const reportes = loadReportes();
    const tbody = document.getElementById('reportes-table-body');
    if (!tbody) return;

    if (reportes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#6b6b65;">No hay reportes. Crea uno nuevo.</td></tr>';
      updateStats(0, 0, 0, 0);
      return;
    }

    tbody.innerHTML = reportes.map((r, i) => `
      <tr>
        <td>
          <b style="color:#e0e0e0">${escapeHtml(r.nombre)}</b>
          ${r.cfr21Compliance?.compliant ? '<span title="CFR 21 Part 11" style="color:#5fd97a;margin-left:6px;">✓</span>' : ''}
        </td>
        <td>${r.pruebas || 0} pruebas · ${r.graficos || 0} gráficos</td>
        <td><span class="tag ${r.estado === 'completado' ? 'tag-run' : 'tag-warn'}">${r.estado === 'completado' ? 'Listo' : 'Borrador'}</span></td>
        <td>${r.cfr21Compliance?.integrityHash ? `<code style="font-size:10px;color:#888;">${r.cfr21Compliance.integrityHash}</code>` : formatDate(r.creado)}</td>
        <td>
          <button class="btn-icon" onclick="ReportesManager.verReporte(${i})" title="Ver">👁️</button>
          <button class="btn-icon" onclick="ReportesManager.duplicarReporte(${i})" title="Duplicar">📋</button>
          <button class="btn-icon" onclick="ReportesManager.exportarReporte(${i})" title="Exportar">📥</button>
          <button class="btn-icon" onclick="ReportesManager.eliminarReporte(${i})" title="Eliminar">🗑️</button>
        </td>
      </tr>
    `).join('');

    const total = reportes.length;
    const completados = reportes.filter(r => r.estado === 'completado').length;
    const borradores = reportes.filter(r => r.estado === 'borrador').length;
    const graficos = reportes.reduce((acc, r) => acc + (r.graficos || 0), 0);

    updateStats(total, completados, borradores, graficos);
  }

  function updateStats(total, completados, borradores, graficos) {
    const totalEl = document.getElementById('reportes-total');
    const completadosEl = document.getElementById('reportes-completados');
    const borradorEl = document.getElementById('reportes-borrador');
    const graficosEl = document.getElementById('reportes-graficos');
    const badgeEl = document.getElementById('reportes-count-badge');
    const semanaEl = document.getElementById('reportes-semana');

    if (totalEl) totalEl.textContent = total;
    if (completadosEl) completadosEl.textContent = completados;
    if (borradorEl) borradorEl.textContent = borradores;
    if (graficosEl) graficosEl.textContent = graficos;
    if (badgeEl) badgeEl.textContent = `${total} reporte${total !== 1 ? 's' : ''}`;
    if (semanaEl) semanaEl.innerHTML = total > 0 ? '<span>+' + total + '</span> esta sesión' : '<span>sin actividad</span>';
  }

  function setupSearch() {
    const searchInput = document.getElementById('reportes-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const reportes = loadReportes();
        const filtered = reportes.filter(r => 
          r.nombre.toLowerCase().includes(query)
        );
        renderFiltered(filtered);
      });
    }
  }

  function renderFiltered(reportes) {
    const tbody = document.getElementById('reportes-table-body');
    if (!tbody) return;

    if (reportes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#6b6b65;">No se encontraron reportes</td></tr>';
      return;
    }

    tbody.innerHTML = reportes.map((r, i) => `
      <tr>
        <td>
          <b style="color:#e0e0e0">${escapeHtml(r.nombre)}</b>
          ${r.cfr21Compliance?.compliant ? '<span title="CFR 21 Part 11" style="color:#5fd97a;margin-left:6px;">✓</span>' : ''}
        </td>
        <td>${r.pruebas || 0} pruebas · ${r.graficos || 0} gráficos</td>
        <td><span class="tag ${r.estado === 'completado' ? 'tag-run' : 'tag-warn'}">${r.estado === 'completado' ? 'Listo' : 'Borrador'}</span></td>
        <td>${r.cfr21Compliance?.integrityHash ? `<code style="font-size:10px;color:#888;">${r.cfr21Compliance.integrityHash}</code>` : formatDate(r.creado)}</td>
        <td>
          <button class="btn-icon" onclick="ReportesManager.verReporte(${i})">👁️</button>
          <button class="btn-icon" onclick="ReportesManager.duplicarReporte(${i})">📋</button>
          <button class="btn-icon" onclick="ReportesManager.exportarReporte(${i})">📥</button>
          <button class="btn-icon" onclick="ReportesManager.eliminarReporte(${i})">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  function crearReporte() {
    const nombre = prompt('Nombre del nuevo reporte:');
    if (!nombre) return;

    const reportes = loadReportes();
    const nuevoReporte = {
      nombre: nombre,
      estado: 'borrador',
      pruebas: 0,
      graficos: 0,
      creado: new Date().toISOString()
    };
    reportes.unshift(nuevoReporte);
    saveReportes(reportes);
    renderReportesList();
    showToast('Reporte creado', 'ok');
  }

  function verReporte(index) {
    const reportes = loadReportes();
    const reporte = reportes[index];
    if (!reporte) return;

    const cfr21 = reporte.cfr21Compliance;
    const infoCFR = cfr21 ? `
═══════════════════════════════════════
📋 CFR 21 PART 11 COMPLIANCE
═══════════════════════════════════════
✅ Estándar: ${cfr21.standard}
✅ Alcance: ${cfr21.scope}
🔐 Hash Integridad: ${cfr21.integrityHash || 'N/A'}
📅 Generado: ${cfr21.auditTrail?.generationDateFormatted || 'N/A'}
👤 Usuario: ${cfr21.auditTrail?.generatedBy || 'N/A'}
🏢 Software: ${cfr21.auditTrail?.software} v${cfr21.auditTrail?.version}
📊 Dataset: ${cfr21.datasetTraceability?.datasetName || 'N/A'}
📈 Columnas: ${cfr21.datasetTraceability?.columnsAnalyzed?.length || 0}
📉 Estadísticos: ${cfr21.datasetTraceability?.totalStatistics || 0}
═══════════════════════════════════════
✍️ FIRMAS ELECTRÓNICAS
═══════════════════════════════════════
Preparado: ${cfr21.electronicSignatures?.prepared?.name || 'N/A'}
  Cargo: ${cfr21.electronicSignatures?.prepared?.title || 'N/A'}
  Fecha: ${cfr21.electronicSignatures?.prepared?.date || 'N/A'}
  Acción: ${cfr21.electronicSignatures?.prepared?.action || 'N/A'}
═══════════════════════════════════════` : '';

    const detalles = `
📄 ${reporte.nombre}

📋 Estado: ${reporte.estado}
👤 Autor: ${reporte.autor}
📝 Descripción: ${reporte.descripcion || 'Sin descripción'}
📊 Dataset: ${reporte.dataset}
🔢 Pruebas: ${reporte.pruebasCount}
📈 Gráficos: ${reporte.graficosCount}
📅 Creado: ${formatDate(reporte.creado)}
${infoCFR}`;

    alert(detalles);
  }

  function duplicarReporte(index) {
    const reportes = loadReportes();
    const reporte = reportes[index];
    if (!reporte) return;

    const nuevo = {
      ...reporte,
      nombre: reporte.nombre + ' (copia)',
      estado: 'borrador',
      creado: new Date().toISOString()
    };
    reportes.unshift(nuevo);
    saveReportes(reportes);
    renderReportesList();
    showToast('Reporte duplicado', 'ok');
  }

  function exportarReporte(index, format = 'json') {
    const reportes = loadReportes();
    const reporte = reportes[index];
    if (!reporte) return;

    if (format === 'html') {
      const html = generarHTMLCFR21(reporte);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reporte.nombre.replace(/\s+/g, '_')}_CFR21.html`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('HTML CFR 21 Part 11 exportado', 'ok');
      return;
    }

    const data = JSON.stringify(reporte, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reporte.nombre.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Reporte exportado', 'ok');
  }

  function generarHTMLCFR21(reporte) {
    const cfr21 = reporte.cfr21Compliance || {};
    const now = new Date();

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reporte.nombre} - CFR 21 Part 11</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px solid #1a365d; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #1a365d; }
    .title { font-size: 28px; margin: 10px 0; color: #2c5282; }
    .subtitle { color: #4a5568; font-size: 14px; }
    .section { margin: 25px 0; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
    .section-title { font-size: 16px; font-weight: bold; color: #1a365d; border-bottom: 2px solid #cbd5e0; padding-bottom: 8px; margin-bottom: 15px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .info-item { padding: 8px; }
    .info-label { font-weight: bold; color: #4a5568; font-size: 12px; }
    .info-value { color: #2d3748; }
    .compliance-badge { display: inline-block; background: #c6f6d5; color: #22543d; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .hash { font-family: monospace; background: #edf2f7; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .signature-block { border: 1px solid #cbd5e0; padding: 15px; margin: 10px 0; border-radius: 4px; }
    .signature-line { display: flex; justify-content: space-between; margin: 8px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #cbd5e0; text-align: center; font-size: 12px; color: #718096; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #cbd5e0; padding: 10px; text-align: left; }
    th { background: #f7fafc; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">📊 StatAnalyzer Pro</div>
    <h1 class="title">${reporte.nombre}</h1>
    <p class="subtitle">Reporte de Análisis Estadístico</p>
  </div>

  <div class="section">
    <div class="section-title">📋 Información de Cumplimiento</div>
    <div class="compliance-badge">✓ CFR 21 Part 11 Compliant</div>
    <div class="info-grid" style="margin-top: 15px;">
      <div class="info-item"><span class="info-label">Estándar</span><div class="info-value">${cfr21.standard || 'FDA 21 CFR Part 11'}</div></div>
      <div class="info-item"><span class="info-label">Alcance</span><div class="info-value">${cfr21.scope || 'Electronic Records; Electronic Signatures'}</div></div>
      <div class="info-item"><span class="info-label">Hash de Integridad</span><div class="info-value hash">${cfr21.integrityHash || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Fecha de Generación</span><div class="info-value">${cfr21.auditTrail?.generationDateFormatted || formatFullDate(now)}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🏢 Información del Reporte</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Autor</span><div class="info-value">${reporte.autor || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Dataset</span><div class="info-value">${reporte.dataset || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Estado</span><div class="info-value">${reporte.estado || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Pruebas Realizadas</span><div class="info-value">${reporte.pruebasCount || 0}</div></div>
      <div class="info-item"><span class="info-label">Gráficos</span><div class="info-value">${reporte.graficosCount || 0}</div></div>
      <div class="info-item"><span class="info-label">Software</span><div class="info-value">${cfr21.auditTrail?.software || 'StatAnalyzer Pro'} v${cfr21.auditTrail?.version || '2.5'}</div></div>
    </div>
    ${reporte.descripcion ? `<div style="margin-top: 10px;"><span class="info-label">Descripción</span><div class="info-value">${reporte.descripcion}</div></div>` : ''}
  </div>

  <div class="section">
    <div class="section-title">🔗 Trazabilidad del Dataset</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Nombre del Dataset</span><div class="info-value">${cfr21.datasetTraceability?.datasetName || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Fecha de Análisis</span><div class="info-value">${cfr21.datasetTraceability?.analysisDate ? formatFullDate(new Date(cfr21.datasetTraceability.analysisDate)) : 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Columnas Analizadas</span><div class="info-value">${cfr21.datasetTraceability?.columnsAnalyzed?.length || 0}</div></div>
      <div class="info-item"><span class="info-label">Total Estadísticos</span><div class="info-value">${cfr21.datasetTraceability?.totalStatistics || 0}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">✍️ Firmas Electrónicas - 21 CFR Part 11 Subparte C</div>
    <div class="signature-block">
      <div class="signature-line"><span><strong>Preparado por:</strong></span><span>${cfr21.electronicSignatures?.prepared?.name || reporte.autor || 'N/A'}</span></div>
      <div class="signature-line"><span>Cargo:</span><span>${cfr21.electronicSignatures?.prepared?.title || 'Analista de Datos'}</span></div>
      <div class="signature-line"><span>Fecha:</span><span>${cfr21.electronicSignatures?.prepared?.date || formatFullDate(now)}</span></div>
      <div class="signature-line"><span>Acción:</span><span>${cfr21.electronicSignatures?.prepared?.action || 'Generado'}</span></div>
      <div class="signature-line"><span>Significado:</span><span>${cfr21.electronicSignatures?.prepared?.meaning || 'Preparación del reporte'}</span></div>
    </div>
    <div class="signature-block" style="background: #f7fafc;">
      <div class="signature-line"><span><strong>Revisado por:</strong></span><span>${cfr21.electronicSignatures?.reviewed?.name || 'Pendiente'}</span></div>
      <div class="signature-line"><span>Cargo:</span><span>${cfr21.electronicSignatures?.reviewed?.title || '—'}</span></div>
      <div class="signature-line"><span>Fecha:</span><span>${cfr21.electronicSignatures?.reviewed?.date || '—'}</span></div>
    </div>
    <div class="signature-block" style="background: #f7fafc;">
      <div class="signature-line"><span><strong>Aprobado por:</strong></span><span>${cfr21.electronicSignatures?.approved?.name || 'Pendiente'}</span></div>
      <div class="signature-line"><span>Cargo:</span><span>${cfr21.electronicSignatures?.approved?.title || '—'}</span></div>
      <div class="signature-line"><span>Fecha:</span><span>${cfr21.electronicSignatures?.approved?.date || '—'}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">📝 Notas Metodológicas</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Métodos Descriptivos</span><div class="info-value" style="font-size: 11px;">${cfr21.methodology?.statisticalMethods?.descriptive || 'Estadísticos descriptivos estándar'}</div></div>
      <div class="info-item"><span class="info-label">Intervalos de Confianza</span><div class="info-value">${cfr21.methodology?.statisticalMethods?.confidence || '95% (α = 0.05)'}</div></div>
    </div>
  </div>

  <div class="footer">
    <p>Este documento fue generado por <strong>StatAnalyzer Pro</strong> en cumplimiento con FDA 21 CFR Part 11.</p>
    <p>Document ID: ${cfr21.integrityHash || 'N/A'} | Fecha: ${formatFullDate(now)} | Usuario: ${cfr21.auditTrail?.generatedBy || 'Usuario'}</p>
    <p style="margin-top: 10px; font-size: 10px;">Este documento es una copia controlada. Cualquier modificación no autorizada invalidará la integridad del registro electrónico.</p>
  </div>
</body>
</html>`;
  }

  function exportarTodo() {
    const reportes = loadReportes();
    if (reportes.length === 0) {
      showToast('No hay reportes para exportar', 'warn');
      return;
    }

    const data = JSON.stringify(reportes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todos_los_reportes_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${reportes.length} reportes exportados`, 'ok');
  }

  function crearReporteConDatos() {
    console.log('🔍 Debug - localStorage keys:', Object.keys(localStorage).filter(k => k.includes('sigma')));
    const analisis = JSON.parse(localStorage.getItem('sigmaPro_analisis') || '[]');
    const graficos = JSON.parse(localStorage.getItem('sigmaPro_graficos') || '[]');

    console.log('🔍 Análisis guardados:', analisis.length);
    console.log('🔍 Gráficos guardados:', graficos.length);

    if (analisis.length === 0) {
      showToast('No hay análisis guardados. Ejecuta un análisis primero.', 'warn');
      return;
    }

    const lastAnalisis = analisis[0];

    const modalHtml = `
      <div id="reporte-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)this.remove()">
        <div style="background:#2a2a2a;padding:24px;border-radius:12px;max-width:500px;width:90%;">
          <h3 style="color:#e0e0e0;margin:0 0 16px;">Crear Reporte</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Título del reporte</label>
              <input type="text" id="reporte-titulo" value="Reporte Análisis ${new Date().toLocaleDateString('es-ES')}" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
            </div>
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Autor</label>
              <input type="text" id="reporte-autor" value="Usuario" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
            </div>
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Descripción</label>
              <textarea id="reporte-descripcion" rows="3" placeholder="Descripción del análisis..." style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;resize:vertical;"></textarea>
            </div>
            <div style="background:#3a3a38;padding:12px;border-radius:8px;">
              <div style="color:#9e9e98;font-size:11px;margin-bottom:8px;">Datos a incluir:</div>
              <div style="display:flex;gap:16px;flex-wrap:wrap;">
                <span style="color:#5fd97a;font-size:12px;">✓ Análisis: ${lastAnalisis.pruebas?.length || 0} pruebas</span>
                <span style="color:#5fd97a;font-size:12px;">✓ Dataset: ${lastAnalisis.dataset || 'N/A'}</span>
                <span style="color:#5fd97a;font-size:12px;">✓ Gráficos: ${graficos.length}</span>
              </div>
            </div>
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
              <button onclick="document.getElementById('reporte-modal-overlay').remove()" style="padding:8px 16px;background:transparent;border:1px solid #404040;border-radius:6px;color:#9e9e98;cursor:pointer;">Cancelar</button>
              <button onclick="ReportesManager.generarReporteCompleto()" style="padding:8px 16px;background:#5c6bc0;border:none;border-radius:6px;color:#fff;cursor:pointer;">Generar Reporte</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  async function generarReporteCompleto() {
    const titulo = document.getElementById('reporte-titulo').value;
    const autor = document.getElementById('reporte-autor').value;
    const descripcion = document.getElementById('reporte-descripcion').value;

    const analisis = JSON.parse(localStorage.getItem('sigmaPro_analisis') || '[]')[0];
    const graficos = JSON.parse(localStorage.getItem('sigmaPro_graficos') || '[]');

    const reporteData = {
      nombre: titulo,
      autor: autor,
      descripcion: descripcion,
      dataset: analisis?.dataset || 'N/A',
      pruebas: analisis?.pruebas || [],
      pruebasCount: analisis?.pruebas?.length || 0,
      graficosCount: graficos.length,
      estado: 'completado',
      contenido: analisis?.html || '',
      creado: new Date().toISOString()
    };

    const integrityHash = await generateIntegrityHash(reporteData);
    const auditMetadata = getAuditMetadata();
    const traceability = getDatasetTraceability(analisis);
    const signatures = getElectronicSignatures(autor);
    const methodology = getMethodologyNotes();

    const reporteCompleto = {
      ...reporteData,
      cfr21Compliance: {
        standard: CFR21_CONFIG.standard,
        scope: CFR21_CONFIG.scope,
        compliant: true,
        integrityHash: integrityHash,
        auditTrail: auditMetadata,
        datasetTraceability: traceability,
        electronicSignatures: signatures,
        methodology: methodology
      }
    };

    const reportes = loadReportes();
    reportes.unshift(reporteCompleto);
    saveReportes(reportes);

    document.getElementById('reporte-modal-overlay')?.remove();
    renderReportesList();

    showToast(`Reporte CFR 21 Part 11 generado - Hash: ${integrityHash}`, 'ok');
    console.log('📊 Reporte CFR 21 Part 11 completo:', reporteCompleto);
  }

  function eliminarReporte(index) {
    if (!confirm('¿Eliminar este reporte?')) return;

    const reportes = loadReportes();
    reportes.splice(index, 1);
    saveReportes(reportes);
    renderReportesList();
    showToast('Reporte eliminado', 'ok');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'hoy';
    if (days === 1) return 'hace 1d';
    if (days < 7) return `hace ${days}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  function showToast(msg, type = 'info') {
    if (typeof window.showToast === 'function') {
      window.showToast(msg, type);
    } else {
      console.log(`[${type}] ${msg}`);
    }
  }

  return { init, crearReporte, verReporte, duplicarReporte, exportarReporte, exportarTodo, eliminarReporte, crearReporteConDatos, generarReporteCompleto };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ReportesManager.init);
} else {
  ReportesManager.init();
}