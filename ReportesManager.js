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
      generationDateFormatted: formatFullDateTime(new Date()),
      software: CFR21_CONFIG.software,
      version: CFR21_CONFIG.version,
      regulatoryFramework: CFR21_CONFIG.standard
    };
  }

  function formatFullDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = MONTHS_ES[date.getMonth()];
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatFullDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = MONTHS_ES[date.getMonth()];
    const year = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hh}:${mm}`;
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
        date: formatFullDateTime(now),
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
    const pharma = cfr21?.pharmaceuticalFields || {};

    const viewHtml = `
      <div id="reporte-view-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px;" onclick="if(event.target===this)this.remove()">
        <div style="background:#252525;padding:28px;border-radius:16px;max-width:800px;width:100%;max-height:95vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #404040;padding-bottom:16px;">
            <div>
              <h2 style="color:#e0e0e0;margin:0;">📄 ${escapeHtml(reporte.nombre)}</h2>
              <span style="color:#5fd97a;font-size:12px;">✓ CFR 21 Part 11</span>
            </div>
            <button onclick="document.getElementById('reporte-view-overlay').remove()" style="background:none;border:none;color:#888;font-size:24px;cursor:pointer;">✕</button>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <!-- Hash y Estado -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;grid-column:1/-1;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <div style="color:#9e9e98;font-size:11px;">Hash de Integridad</div>
                  <code style="color:#5fd97a;font-size:12px;">${cfr21?.integrityHash || 'N/A'}</code>
                </div>
                <div style="text-align:right;">
                  <div style="color:#9e9e98;font-size:11px;">Estado</div>
                  <span class="tag ${reporte.estado === 'completado' ? 'tag-run' : 'tag-warn'}">${reporte.estado === 'completado' ? 'Completado' : 'Borrador'}</span>
                </div>
              </div>
            </div>

            <!-- Info Básica -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">📝 INFORMACIÓN</h4>
              <div style="font-size:12px;color:#9e9e98;">
                <div><span>Autor:</span> <span style="color:#e0e0e0;">${reporte.autor || 'N/A'}</span></div>
                <div><span>Versión:</span> <span style="color:#e0e0e0;">${reporte.version || '1.0'}</span></div>
                <div><span>Dataset:</span> <span style="color:#e0e0e0;">${reporte.dataset || 'N/A'}</span></div>
                <div><span>Pruebas:</span> <span style="color:#e0e0e0;">${reporte.pruebasCount || 0}</span></div>
                <div><span>Gráficos:</span> <span style="color:#e0e0e0;">${reporte.graficosCount || 0}</span></div>
              </div>
            </div>

            <!-- Cualificación -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">💊 CUALIFICACIÓN</h4>
              <div style="font-size:12px;color:#9e9e98;">
                <div><span>Tipo:</span> <span style="color:#e0e0e0;">${getFaseLabel(reporte.fase)}</span></div>
                <div><span>Lote:</span> <span style="color:#e0e0e0;">${reporte.lote || 'N/A'}</span></div>
                <div><span>Protocolo:</span> <span style="color:#e0e0e0;">${reporte.protocolo || 'N/A'}</span></div>
                <div><span>Código:</span> <span style="color:#e0e0e0;">${reporte.codigo || 'N/A'}</span></div>
              </div>
            </div>

            <!-- Equipo -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">🔧 EQUIPO/MÉTODO</h4>
              <div style="font-size:12px;color:#9e9e98;">
                <div><span>Nombre:</span> <span style="color:#e0e0e0;">${reporte.equipo || 'N/A'}</span></div>
                <div><span>Serie:</span> <span style="color:#e0e0e0;">${reporte.serie || 'N/A'}</span></div>
                <div><span>Modelo:</span> <span style="color:#e0e0e0;">${reporte.modelo || 'N/A'}</span></div>
              </div>
            </div>

            <!-- Parámetros -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">🌡️ PARÁMETROS</h4>
              <div style="font-size:12px;color:#9e9e98;">
                <div><span>Temperatura:</span> <span style="color:#e0e0e0;">${reporte.temperatura || 'N/A'}</span></div>
                <div><span>Humedad:</span> <span style="color:#e0e0e0;">${reporte.humedad || 'N/A'}</span></div>
                <div><span>Fabricación:</span> <span style="color:#e0e0e0;">${reporte.fechaFabricacion || 'N/A'}</span></div>
                <div><span>Expiración:</span> <span style="color:#e0e0e0;">${reporte.fechaExpiracion || 'N/A'}</span></div>
              </div>
            </div>

            <!-- Firmas -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;grid-column:1/-1;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">✍️ FIRMAS ELECTRÓNICAS</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
                <div style="padding:10px;background:#2a2a28;border-radius:6px;">
                  <div style="color:#5fd97a;font-size:11px;font-weight:bold;margin-bottom:8px;">👤 Preparado</div>
                  <div style="font-size:11px;color:#9e9e98;">${reporte.firmaPreparado?.nombre || 'N/A'}</div>
                  <div style="font-size:10px;color:#666;">${reporte.firmaPreparado?.cargo || ''}</div>
                  <div style="font-size:10px;color:#666;">${reporte.firmaPreparado?.fecha || ''}</div>
                </div>
                <div style="padding:10px;background:#2a2a28;border-radius:6px;">
                  <div style="color:#f0ad4e;font-size:11px;font-weight:bold;margin-bottom:8px;">👁️ Revisado</div>
                  <div style="font-size:11px;color:#9e9e98;">${reporte.firmaRevisado?.nombre || 'Pendiente'}</div>
                  <div style="font-size:10px;color:#666;">${reporte.firmaRevisado?.cargo || ''}</div>
                  <div style="font-size:10px;color:#666;">${reporte.firmaRevisado?.fecha || ''}</div>
                </div>
                <div style="padding:10px;background:#2a2a28;border-radius:6px;">
                  <div style="color:#667eea;font-size:11px;font-weight:bold;margin-bottom:8px;">✅ Aprobado</div>
                  <div style="font-size:11px;color:#9e9e98;">${reporte.firmaAprobado?.nombre || 'Pendiente'}</div>
                  <div style="font-size:10px;color:#666;">${reporte.firmaAprobado?.cargo || ''}</div>
                  <div style="font-size:10px;color:#666;">${reporte.firmaAprobado?.fecha || ''}</div>
                </div>
              </div>
            </div>

            <!-- Descripción -->
            ${reporte.descripcion ? `
            <div style="background:#1a1a18;padding:16px;border-radius:12px;grid-column:1/-1;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">📝 DESCRIPCIÓN</h4>
              <p style="font-size:12px;color:#9e9e98;margin:0;">${escapeHtml(reporte.descripcion)}</p>
            </div>
            ` : ''}
          </div>

          <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:16px;border-top:1px solid #404040;margin-top:16px;">
            <button onclick="ReportesManager.exportarReporte(${index}, 'html')" style="padding:10px 20px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;cursor:pointer;">📥 Exportar HTML</button>
            <button onclick="ReportesManager.exportarReporte(${index}, 'json')" style="padding:10px 20px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;cursor:pointer;">📦 Exportar JSON</button>
            <button onclick="document.getElementById('reporte-view-overlay').remove()" style="padding:10px 20px;background:#667eea;border:none;border-radius:6px;color:#fff;cursor:pointer;">Cerrar</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', viewHtml);
  }

  function getFaseLabel(fase) {
    const fases = {
      'DQ': 'DQ - Design Qualification',
      'IQ': 'IQ - Installation Qualification',
      'OQ': 'OQ - Operational Qualification',
      'PQ': 'PQ - Performance Qualification',
      'PQ-Metodo': 'PQ - Validación de Método',
      'PPQ': 'PPQ - Process Performance Qualification'
    };
    return fases[fase] || fase || 'No especificado';
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
      <div class="info-item"><span class="info-label">Fecha de Generación</span><div class="info-value">${cfr21.auditTrail?.generationDateFormatted || formatFullDateTime(now)}</div></div>
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

  ${(reporte.fase || reporte.equipo || reporte.protocolo) ? `
  <div class="section">
    <div class="section-title">💊 Cualificación Farmacéutica</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Tipo de Cualificación</span><div class="info-value">${getFaseLabel(reporte.fase)}</div></div>
      <div class="info-item"><span class="info-label">Número de Lote</span><div class="info-value">${reporte.lote || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Número de Protocolo</span><div class="info-value">${reporte.protocolo || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Código de Proyecto</span><div class="info-value">${reporte.codigo || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Confidencialidad</span><div class="info-value">${reporte.confidencial || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Versión</span><div class="info-value">${reporte.version || '1.0'}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🔧 Equipo / Método</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Nombre</span><div class="info-value">${reporte.equipo || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Número de Serie</span><div class="info-value">${reporte.serie || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Modelo</span><div class="info-value">${reporte.modelo || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Organización</span><div class="info-value">${reporte.organizacion || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Departamento</span><div class="info-value">${reporte.departamento || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Ubicación</span><div class="info-value">${reporte.ubicacion || 'N/A'}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🌡️ Parámetros de Operación</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Temperatura</span><div class="info-value">${reporte.temperatura || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Humedad</span><div class="info-value">${reporte.humedad || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Fecha de Fabricación</span><div class="info-value">${reporte.fechaFabricacion || 'N/A'}</div></div>
      <div class="info-item"><span class="info-label">Fecha de Expiración</span><div class="info-value">${reporte.fechaExpiracion || 'N/A'}</div></div>
    </div>
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">✍️ Firmas Electrónicas - 21 CFR Part 11 Subparte C</div>
    <div class="signature-block">
      <div class="signature-line"><span><strong>Preparado por:</strong></span><span>${cfr21.electronicSignatures?.prepared?.name || reporte.autor || 'N/A'}</span></div>
      <div class="signature-line"><span>Cargo:</span><span>${cfr21.electronicSignatures?.prepared?.title || 'Analista de Datos'}</span></div>
      <div class="signature-line"><span>Fecha:</span><span>${cfr21.electronicSignatures?.prepared?.date || formatFullDateTime(now)}</span></div>
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
    <p>Document ID: ${cfr21.integrityHash || 'N/A'} | Fecha: ${formatFullDateTime(now)} | Usuario: ${cfr21.auditTrail?.generatedBy || 'Usuario'}</p>
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
    const analisis = JSON.parse(localStorage.getItem('sigmaPro_analisis') || '[]');
    const graficos = JSON.parse(localStorage.getItem('sigmaPro_graficos') || '[]');

    if (analisis.length === 0) {
      showToast('No hay análisis guardados. Ejecuta un análisis primero.', 'warn');
      return;
    }

    const lastAnalisis = analisis[0];
    const userName = document.getElementById('userName')?.textContent || 'Usuario';

    const modalHtml = `
      <div id="reporte-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px;" onclick="if(event.target===this)this.remove()">
        <div style="background:#252525;padding:28px;border-radius:16px;max-width:800px;width:100%;max-height:95vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #404040;padding-bottom:16px;">
            <h2 style="color:#e0e0e0;margin:0;">📋 Nuevo Reporte CFR 21 Part 11</h2>
            <button onclick="document.getElementById('reporte-modal-overlay').remove()" style="background:none;border:none;color:#888;font-size:24px;cursor:pointer;">✕</button>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
            <!-- Estado del análisis -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;grid-column:1/-1;">
              <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:32px;">✓</span>
                <div>
                  <div style="color:#5fd97a;font-weight:bold;">Análisis Listo</div>
                  <div style="color:#9e9e98;font-size:12px;">${lastAnalisis.pruebas?.length || 0} pruebas · ${lastAnalisis.dataset || 'N/A'} · ${graficos.length} gráficos</div>
                </div>
              </div>
            </div>

            <!-- Información Básica -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">📝 INFORMACIÓN BÁSICA</h4>
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Título del Reporte *</label>
                  <input type="text" id="reporte-titulo" value="Reporte Análisis ${new Date().toLocaleDateString('es-ES')}" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Autor *</label>
                  <input type="text" id="reporte-autor" value="${userName}" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Versión</label>
                  <input type="text" id="reporte-version" value="1.0" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
              </div>
            </div>

            <!-- Información Institucional -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">🏛️ INSTITUCIÓN</h4>
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Organización</label>
                  <input type="text" id="reporte-organizacion" placeholder="Laboratorio Farmacéutico" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Departamento</label>
                  <select id="reporte-departamento" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                    <option value="">-- Seleccionar --</option>
                    <option>Control de Calidad</option>
                    <option>Validaciones</option>
                    <option>Producción</option>
                    <option>I+D</option>
                    <option>Garantía de Calidad</option>
                  </select>
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Ubicación</label>
                  <input type="text" id="reporte-ubicacion" placeholder="Santo Domingo, RD" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
              </div>
            </div>

            <!-- Cualificación Farmacéutica -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">💊 CUALIFICACIÓN (IQ/OQ/PQ)</h4>
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Tipo de Cualificación</label>
                  <select id="reporte-fase" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                    <option value="">-- Seleccionar --</option>
                    <option value="DQ">DQ - Design Qualification</option>
                    <option value="IQ">IQ - Installation Qualification</option>
                    <option value="OQ">OQ - Operational Qualification</option>
                    <option value="PQ">PQ - Performance Qualification</option>
                    <option value="PQ-Metodo">PQ - Validación de Método</option>
                    <option value="PPQ">PPQ - Process Performance Qualification</option>
                  </select>
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Número de Lote</label>
                  <input type="text" id="reporte-lote" placeholder="LOT-2026-001" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
              </div>
            </div>

            <!-- Equipo/Método -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">🔧 EQUIPO / MÉTODO</h4>
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Nombre Equipo/Método</label>
                  <input type="text" id="reporte-equipo" placeholder="HPLC, Espectrómetro, Método Karl Fischer..." style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Número de Serie</label>
                  <input type="text" id="reporte-serie" placeholder="SN-123456789" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Modelo</label>
                  <input type="text" id="reporte-modelo" placeholder="VANQUISH, ISO 9001..." style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
              </div>
            </div>

            <!-- Parámetros de Operación -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">🌡️ PARÁMETROS DE OPERACIÓN</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Temperatura (°C)</label>
                  <input type="text" id="reporte-temperatura" placeholder="20-25°C" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Humedad (%)</label>
                  <input type="text" id="reporte-humedad" placeholder="40-60%" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Fecha Fabricación</label>
                  <div style="display:flex;gap:8px;align-items:center;">
                    <input type="text" id="reporte-fabrica-text" placeholder="dd/mmm/aaaa" style="flex:1;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;" onchange="handleManualDateInput('reporte-fabrica-text', null)">
                    <input type="date" id="reporte-fabrica-hidden" style="display:none;" onchange="syncDateFromPicker('reporte-fabrica-hidden', 'reporte-fabrica-text', null)">
                    <button type="button" onclick="document.getElementById('reporte-fabrica-hidden').showPicker()" style="padding:8px;background:#2a2a28;border:1px solid #404040;border-radius:4px;cursor:pointer;">📅</button>
                  </div>
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Fecha Expiración</label>
                  <div style="display:flex;gap:8px;align-items:center;">
                    <input type="text" id="reporte-expiracion-text" placeholder="dd/mmm/aaaa" style="flex:1;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;" onchange="handleManualDateInput('reporte-expiracion-text', null)">
                    <input type="date" id="reporte-expiracion-hidden" style="display:none;" onchange="syncDateFromPicker('reporte-expiracion-hidden', 'reporte-expiracion-text', null)">
                    <button type="button" onclick="document.getElementById('reporte-expiracion-hidden').showPicker()" style="padding:8px;background:#2a2a28;border:1px solid #404040;border-radius:4px;cursor:pointer;">📅</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Protocolo y Confidencialidad -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">📋 PROTOCOLO</h4>
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Número de Protocolo</label>
                  <input type="text" id="reporte-protocolo" placeholder="PROTO-IQ-2026-001" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Código de Proyecto</label>
                  <input type="text" id="reporte-codigo" placeholder="PRJ-2026-XXX" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Nivel de Confidencialidad</label>
                  <select id="reporte-confidencial" style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                    <option value="CONFIDENTIAL — FOR INTERNAL USE ONLY">Confidencial — Uso Interno</option>
                    <option value="STRICTLY CONFIDENTIAL">Estrictamente Confidencial</option>
                    <option value="PROPRIETARY">Propietario</option>
                    <option value="FOR REGULATORY SUBMISSION">Para Submission Regulatorio</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Descripción -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;grid-column:1/-1;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">📝 DESCRIPCIÓN</h4>
              <div>
                <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Descripción del Análisis / Cualificación</label>
                <textarea id="reporte-descripcion" rows="3" placeholder="Descripción del análisis estadístico o motivo de la cualificación..." style="width:100%;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;resize:vertical;"></textarea>
              </div>
            </div>

            <!-- Firmas Electrónicas -->
            <div style="background:#1a1a18;padding:16px;border-radius:12px;grid-column:1/-1;">
              <h4 style="color:#667eea;margin:0 0 12px;font-size:13px;">✍️ FIRMAS ELECTRÓNICAS (21 CFR Part 11)</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
                <div style="padding:12px;background:#2a2a28;border-radius:8px;">
                  <div style="color:#5fd97a;font-weight:bold;font-size:12px;margin-bottom:8px;">👤 Preparado por</div>
                  <input type="text" id="reporte-firma-preparado" value="${userName}" placeholder="Nombre" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px;">
                  <input type="text" id="reporte-firma-preparado-cargo" placeholder="Cargo" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px;">
                  <div style="display:flex;gap:4px;align-items:center;">
                    <input type="text" id="reporte-firma-preparado-fecha-text" placeholder="dd/mmm/aaaa" value="${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).replace('.', '')}/${new Date().getFullYear()}" style="flex:1;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;" onchange="handleManualDateInput('reporte-firma-preparado-fecha-text', null)">
                    <input type="date" id="reporte-firma-preparado-fecha-hidden" style="display:none;" onchange="syncDateFromPicker('reporte-firma-preparado-fecha-hidden', 'reporte-firma-preparado-fecha-text', null)">
                    <button type="button" onclick="document.getElementById('reporte-firma-preparado-fecha-hidden').showPicker()" style="padding:6px;background:#1a1a18;border:1px solid #404040;border-radius:4px;cursor:pointer;font-size:12px;">📅</button>
                  </div>
                </div>
                <div style="padding:12px;background:#2a2a28;border-radius:8px;">
                  <div style="color:#f0ad4e;font-weight:bold;font-size:12px;margin-bottom:8px;">👁️ Revisado por</div>
                  <input type="text" id="reporte-firma-revisado" placeholder="Nombre" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px;">
                  <input type="text" id="reporte-firma-revisado-cargo" placeholder="Cargo" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px;">
                  <div style="display:flex;gap:4px;align-items:center;">
                    <input type="text" id="reporte-firma-revisado-fecha-text" placeholder="dd/mmm/aaaa" style="flex:1;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;" onchange="handleManualDateInput('reporte-firma-revisado-fecha-text', null)">
                    <input type="date" id="reporte-firma-revisado-fecha-hidden" style="display:none;" onchange="syncDateFromPicker('reporte-firma-revisado-fecha-hidden', 'reporte-firma-revisado-fecha-text', null)">
                    <button type="button" onclick="document.getElementById('reporte-firma-revisado-fecha-hidden').showPicker()" style="padding:6px;background:#1a1a18;border:1px solid #404040;border-radius:4px;cursor:pointer;font-size:12px;">📅</button>
                  </div>
                </div>
                <div style="padding:12px;background:#2a2a28;border-radius:8px;">
                  <div style="color:#667eea;font-weight:bold;font-size:12px;margin-bottom:8px;">✅ Aprobado por</div>
                  <input type="text" id="reporte-firma-aprobado" placeholder="Nombre" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px;">
                  <input type="text" id="reporte-firma-aprobado-cargo" placeholder="Cargo" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px;">
                  <div style="display:flex;gap:4px;align-items:center;">
                    <input type="text" id="reporte-firma-aprobado-fecha-text" placeholder="dd/mmm/aaaa" style="flex:1;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;" onchange="handleManualDateInput('reporte-firma-aprobado-fecha-text', null)">
                    <input type="date" id="reporte-firma-aprobado-fecha-hidden" style="display:none;" onchange="syncDateFromPicker('reporte-firma-aprobado-fecha-hidden', 'reporte-firma-aprobado-fecha-text', null)">
                    <button type="button" onclick="document.getElementById('reporte-firma-aprobado-fecha-hidden').showPicker()" style="padding:6px;background:#1a1a18;border:1px solid #404040;border-radius:4px;cursor:pointer;font-size:12px;">📅</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:16px;border-top:1px solid #404040;">
            <button onclick="document.getElementById('reporte-modal-overlay').remove()" style="padding:12px 24px;background:transparent;border:1px solid #404040;border-radius:8px;color:#9e9e98;cursor:pointer;font-size:14px;">Cancelar</button>
            <button onclick="ReportesManager.generarReporteCompleto()" style="padding:12px 24px;background:linear-gradient(135deg, #667eea, #764ba2);border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:14px;font-weight:bold;">💾 Generar Reporte CFR 21</button>
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
      creado: new Date().toISOString(),

      // Campos adicionales CFR 21 / Farmacéuticos
      version: document.getElementById('reporte-version')?.value || '1.0',
      organizacion: document.getElementById('reporte-organizacion')?.value || '',
      departamento: document.getElementById('reporte-departamento')?.value || '',
      ubicacion: document.getElementById('reporte-ubicacion')?.value || '',

      // Cualificación
      fase: document.getElementById('reporte-fase')?.value || '',
      lote: document.getElementById('reporte-lote')?.value || '',

      // Equipo/Método
      equipo: document.getElementById('reporte-equipo')?.value || '',
      serie: document.getElementById('reporte-serie')?.value || '',
      modelo: document.getElementById('reporte-modelo')?.value || '',

      // Parámetros
      temperatura: document.getElementById('reporte-temperatura')?.value || '',
      humedad: document.getElementById('reporte-humedad')?.value || '',
      fechaFabricacion: document.getElementById('reporte-fabrica-text')?.value || '',
      fechaExpiracion: document.getElementById('reporte-expiracion-text')?.value || '',

      // Protocolo
      protocolo: document.getElementById('reporte-protocolo')?.value || '',
      codigo: document.getElementById('reporte-codigo')?.value || '',
      confidencial: document.getElementById('reporte-confidencial')?.value || 'CONFIDENTIAL — FOR INTERNAL USE ONLY',

      // Firmas
      firmaPreparado: {
        nombre: document.getElementById('reporte-firma-preparado')?.value || autor,
        cargo: document.getElementById('reporte-firma-preparado-cargo')?.value || '',
        fecha: document.getElementById('reporte-firma-preparado-fecha-text')?.value || new Date().toISOString().slice(0,10)
      },
      firmaRevisado: {
        nombre: document.getElementById('reporte-firma-revisado')?.value || '',
        cargo: document.getElementById('reporte-firma-revisado-cargo')?.value || '',
        fecha: document.getElementById('reporte-firma-revisado-fecha-text')?.value || ''
      },
      firmaAprobado: {
        nombre: document.getElementById('reporte-firma-aprobado')?.value || '',
        cargo: document.getElementById('reporte-firma-aprobado-cargo')?.value || '',
        fecha: document.getElementById('reporte-firma-aprobado-fecha-text')?.value || ''
      }
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
        electronicSignatures: {
          prepared: reporteData.firmaPreparado,
          reviewed: reporteData.firmaRevisado,
          approved: reporteData.firmaAprobado
        },
        methodology: methodology,
        pharmaceuticalFields: {
          qualificationType: reporteData.fase,
          batchNumber: reporteData.lote,
          equipmentName: reporteData.equipo,
          serialNumber: reporteData.serie,
          model: reporteData.modelo,
          operatingTemp: reporteData.temperatura,
          humidity: reporteData.humedad,
          manufacturingDate: reporteData.fechaFabricacion,
          expirationDate: reporteData.fechaExpiracion,
          protocolNumber: reporteData.protocolo,
          projectCode: reporteData.codigo,
          confidentiality: reporteData.confidencial
        }
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
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = MONTHS_ES[date.getMonth()];
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

function updateDateDisplay(inputId, displayId) {
  const input = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (input && display && input.value) {
    const date = new Date(input.value + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    display.textContent = `${day}/${month}/${year}`;
  } else if (display) {
    display.textContent = '—';
  }
}

function handleManualDateInput(textInputId, displayId) {
  const textInput = document.getElementById(textInputId);
  const display = displayId ? document.getElementById(displayId) : null;
  const hiddenInputId = textInputId.replace('-text', '-hidden');
  const hiddenInput = document.getElementById(hiddenInputId);

  if (!textInput || !textInput.value) return;

  const monthsMap = {
    'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
    'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12'
  };

  const parts = textInput.value.trim().split(/[\/\-\.]/);
  if (parts.length === 3) {
    let day = parts[0], month = parts[1], year = parts[2];

    if (isNaN(parseInt(month)) && monthsMap[month.toLowerCase()]) {
      month = monthsMap[month.toLowerCase()];
    }

    if (year.length === 2) year = '20' + year;
    if (day.length === 1) day = '0' + day;
    if (month.length === 1) month = '0' + month;

    const isoDate = `${year}-${month}-${day}`;
    if (hiddenInput) hiddenInput.value = isoDate;
    if (display) {
      const date = new Date(isoDate + 'T00:00:00');
      const dayStr = String(date.getDate()).padStart(2, '0');
      const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      display.textContent = `${dayStr}/${months[date.getMonth()]}/${date.getFullYear()}`;
    }
  }
}

function syncDateFromPicker(hiddenInputId, textInputId, displayId) {
  const hiddenInput = document.getElementById(hiddenInputId);
  const textInput = document.getElementById(textInputId);
  const display = displayId ? document.getElementById(displayId) : null;

  if (!hiddenInput || !hiddenInput.value) return;

  const date = new Date(hiddenInput.value + 'T00:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (textInput) textInput.value = `${day}/${month}/${year}`;
  if (display) display.textContent = `${day}/${month}/${year}`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ReportesManager.init);
} else {
  ReportesManager.init();
}