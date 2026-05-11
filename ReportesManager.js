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
    return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
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
        <td>${r.cfr21Compliance?.integrityHash ? `<code style="font-size:10px;color:#888;">RPT-${r.cfr21Compliance.integrityHash}</code>` : formatDate(r.creado)}</td>
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
        <td>${r.cfr21Compliance?.integrityHash ? `<code style="font-size:10px;color:#888;">RPT-${r.cfr21Compliance.integrityHash}</code>` : formatDate(r.creado)}</td>
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
        <div style="background:#252525;padding:28px;border-radius:16px;max-width:1000px;width:100%;max-height:95vh;overflow-y:auto;">
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
                  <code style="color:#5fd97a;font-size:12px;">RPT-${cfr21?.integrityHash || 'N/A'}</code>
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

          <div style="display:flex;gap:8px;justify-content:flex-end;padding-top:16px;border-top:1px solid #404040;margin-top:16px;flex-wrap:wrap;">
            <button onclick="ReportesManager.exportarReporte(${index}, 'pdf')" style="padding:8px 14px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;cursor:pointer;font-size:12px;">📄 PDF</button>
            <button onclick="ReportesManager.exportarReporte(${index}, 'html')" style="padding:8px 14px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;cursor:pointer;font-size:12px;">🌐 HTML</button>
            <button onclick="ReportesManager.exportarReporte(${index}, 'csv')" style="padding:8px 14px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;cursor:pointer;font-size:12px;">📊 CSV</button>
            <button onclick="ReportesManager.exportarReporte(${index}, 'txt')" style="padding:8px 14px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;cursor:pointer;font-size:12px;">📝 TXT</button>
            <button onclick="ReportesManager.exportarReporte(${index}, 'json')" style="padding:8px 14px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;cursor:pointer;font-size:12px;">📦 JSON</button>
            <button onclick="document.getElementById('reporte-view-overlay').remove()" style="padding:8px 14px;background:#667eea;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;">Cerrar</button>
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

    if (format === 'csv') {
      const csv = generarCSV(reporte);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reporte.nombre.replace(/\s+/g, '_')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('CSV exportado', 'ok');
      return;
    }

    if (format === 'txt') {
      const txt = generarTXT(reporte);
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reporte.nombre.replace(/\s+/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('TXT exportado', 'ok');
      return;
    }

    if (format === 'pdf') {
      const html = generarHTMLCFR21(reporte);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
      showToast('Imprime y guarda como PDF desde el navegador', 'ok');
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
    const docId = 'RPT-' + (cfr21.integrityHash || 'N/A');
    const dataset = reporte.dataset || 'N/A';
    const columnas = cfr21.datasetTraceability?.columnsAnalyzed || [];
    const totalRegistros = cfr21.datasetTraceability?.totalStatistics || reporte.pruebasCount || 0;
    
    const statsData = reporte.resultados || {};
    const numericCols = Object.keys(statsData);
    
    const getStatsForVar = (varName) => {
      const varStats = statsData[varName] || {};
      return {
        mean: varStats.media ?? '—',
        median: varStats.mediana ?? '—',
        mode: varStats.moda ?? '—',
        std: varStats.desviacionEstandar ?? varStats.desviacion ?? '—',
        variance: varStats.varianza ?? '—',
        cv: varStats.coeficienteVariacion ?? '—',
        skew: varStats.asimetria ?? '—',
        kurt: varStats.curtosis ?? '—',
        min: varStats.min ?? '—',
        max: varStats.max ?? '—',
        range: varStats.rango ?? '—',
        p10: varStats.p10 ?? '—',
        p25: varStats.p25 ?? '—',
        p50: varStats.p50 ?? '—',
        p75: varStats.p75 ?? '—',
        p90: varStats.p90 ?? '—',
        n: varStats.n ?? 0,
        alerts: []
      };
    };
    
    const buildAlerts = (varName) => {
      const stats = getStatsForVar(varName);
      const alerts = [];
      if (stats.n > 0 && stats.n < 30) alerts.push('[FLAG-SMALL-N] n=' + stats.n + ' < 30');
      if (stats.cv !== '—' && parseFloat(stats.cv) > 30) alerts.push('[FLAG-CV-HIGH] CV=' + stats.cv + '% > 30%');
      if (stats.skew !== '—') {
        const skewVal = parseFloat(stats.skew);
        if (skewVal > 0.5) alerts.push('[FLAG-SKEW] Asimetría≈' + stats.skew.toFixed(2) + ' (cola derecha)');
        else if (skewVal < -0.5) alerts.push('[FLAG-SKEW] Asimetría≈' + stats.skew.toFixed(2) + ' (cola izquierda)');
      }
      if (stats.min !== '—' && stats.max !== '—') {
        if (parseFloat(stats.min) < 0) alerts.push('[FLAG-OUTLIER-LOW] Mín bajo límite inferior');
        if (parseFloat(stats.max) > 200) alerts.push('[FLAG-OUTLIER-HIGH] Máx sobre límite superior');
      }
      return alerts;
    };
    
    const formatNum = (val) => {
      if (val === '—' || val === undefined) return val;
      const num = parseFloat(val);
      return isNaN(num) ? val : num.toFixed(4);
    };

    let varsHTML = '';
    numericCols.forEach(col => {
      const stats = getStatsForVar(col);
      const alerts = buildAlerts(col);
      varsHTML += `
      <div class="var-block" style="page-break-before:always">
        <div class="var-hdr">
          <span style="font-family:monospace;font-size:11pt;font-weight:500">${col}</span>
          <span style="font-family:monospace;font-size:8pt;color:rgba(255,255,255,.6)">n = ${stats.n}</span>
        </div>
        <table><thead><tr>
          <th>Estadístico</th>
          <th style="text-align:right">Valor</th>
          <th style="text-align:right">Fórmula</th>
        </tr></thead><tbody>
          <tr><td>Media Aritmética</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.mean)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">x̄ = Σxᵢ / n</td></tr>
          <tr><td>Mediana</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.median)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">P₅₀ = valor central</td></tr>
          <tr><td>Moda</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${stats.mode === '—' ? '<em>—</em>' : stats.mode}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">valor más frecuente</td></tr>
          <tr><td>Desviación Estándar</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.std)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">s = √[Σ(xᵢ − x̄)² / (n−1)]</td></tr>
          <tr><td>Varianza</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.variance)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">s² = Σ(xᵢ − x̄)² / (n−1)</td></tr>
          <tr style="background:#f7f8fa"><td colspan="3" style="padding:5px 14px;font-size:8.5pt;color:#666"><em>Percentiles</em></td></tr>
          <tr><td style="padding-left:26px;color:#555">· P10</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.p10)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">Pk = valor en posición k/100×(n+1)</td></tr>
          <tr><td style="padding-left:26px;color:#555">· P25</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.p25)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">k∈{10,25,50,75,90}</td></tr>
          <tr><td style="padding-left:26px;color:#555">· P50</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.p50)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right"></td></tr>
          <tr><td style="padding-left:26px;color:#555">· P75</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.p75)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right"></td></tr>
          <tr><td style="padding-left:26px;color:#555">· P90</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.p90)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right"></td></tr>
          <tr style="background:#f7f8fa"><td colspan="3" style="padding:5px 14px;font-size:8.5pt;color:#666"><em>Distribución</em></td></tr>
          <tr><td style="padding-left:26px;color:#555">Rango</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.range)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">Máx − Mín</td></tr>
          <tr><td style="padding-left:26px;color:#555">Coef. Variación</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${stats.cv === '—' ? '—' : stats.cv + '%'}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">(s / x̄) × 100</td></tr>
          <tr><td style="padding-left:26px;color:#555">Asimetría</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.skew)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">g₁ = Σ(xᵢ−x̄)³/(n·s³)</td></tr>
          <tr><td style="padding-left:26px;color:#555">Curtosis</td><td style="font-family:monospace;text-align:right;color:#2c5282;font-weight:500">${formatNum(stats.kurt)}</td><td style="color:#a0aec0;font-size:8.5pt;font-style:italic;text-align:right">g₂ = Σ(xᵢ−x̄)⁴/(n·s⁴)−3</td></tr>
        </tbody></table>
        <div style="padding:12px 16px;background:#fffcf0;border-top:1px solid #fce8a0">
          <div style="font-family:monospace;font-size:7.5pt;color:#b7791f;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">⚠ Alertas</div>
          ${alerts.length > 0 ? alerts.map(a => {
            const bg = a.includes('OUTLIER') ? '#fed7d7' : a.includes('CV-HIGH') || a.includes('SKEW') ? '#fefcbf' : '#bee3f8';
            const color = a.includes('OUTLIER') ? '#c53030' : a.includes('CV-HIGH') || a.includes('SKEW') ? '#b7791f' : '#2b6cb0';
            return `<span style="background:${bg};color:${color};font-family:monospace;font-size:7.5pt;padding:3px 8px;border-radius:3px;display:inline-block;margin:2px 2px 2px 0">${a}</span>`;
          }).join('') : '<span style="color:#718096;font-size:8pt;font-style:italic">Sin alertas</span>'}
        </div>
      </div>`;
    });

    return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
<title>Reporte de Análisis Estadístico — ${docId}</title>
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
    <div class="logo" style="font-family:'JetBrains Mono',monospace;font-size:9pt;letter-spacing:3px;color:rgba(255,255,255,.5);text-transform:uppercase;margin-bottom:34px">StatAnalyzer Pro · Reporte Estadístico</div>
    <div class="title" style="font-size:26pt;font-weight:300;margin-bottom:6px">Reporte de Análisis Estadístico</div>
    <div class="subtitle" style="font-size:11pt;color:#c8a951;font-weight:300;letter-spacing:1px;margin-bottom:44px">FDA 21 CFR Part 11 — CUMPLIMIENTO</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 40px;font-family:'JetBrains Mono',monospace;font-size:8pt;color:rgba(255,255,255,.7);border-top:1px solid rgba(255,255,255,.2);padding-top:22px">
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">ID del Documento</strong>${docId}</div>
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Organización</strong>${reporte.organizacion || '—'}</div>
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Ensayo / Prueba</strong>${reporte.ensayo || reporte.descripcion || '—'}</div>
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Fase</strong>${reporte.fase || '—'}</div>
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Generado</strong>${cfr21.auditTrail?.generationDateFormatted || formatFullDateTime(now)} UTC</div>
      <div><strong style="color:#c8a951;display:block;font-size:7pt;letter-spacing:1px;text-transform:uppercase">Total de Registros</strong>${totalRegistros}</div>
    </div>
  </div>
</div>

<div class="doc">
  <div class="sec">
    <div class="sec-title"><span class="sec-num">01</span>Descripción General</div>
    <div class="meta-grid">
      <div><span class="ml">Versión del Reporte</span><span class="mv">${reporte.version || '1.0'}</span></div>
      <div style="grid-column:1/-1"></div>
      <div style="grid-column:1/-1"><div><span class="ml">Confidencialidad</span><span class="mv">${reporte.confidencial || 'CONFIDENTIAL — FOR INTERNAL USE ONLY'}</span></div></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">02</span>Trazabilidad del Dataset</div>
    <div class="meta-grid">
      <div><span class="ml">Nombre del Dataset</span><span class="mv">${dataset}</span></div>
      <div><span class="ml">Archivo Fuente</span><span class="mv">${reporte.archivo || dataset + '.csv'}</span></div>
      <div><span class="ml">Fecha de Recolección</span><span class="mv">${reporte.fechaFabricacion || '—'}</span></div>
      <div><span class="ml">Fecha de Análisis</span><span class="mv">${cfr21.datasetTraceability?.analysisDate ? formatFullDate(new Date(cfr21.datasetTraceability.analysisDate)) : formatFullDate(now)}</span></div>
      <div><span class="ml">Total de Registros</span><span class="mv">${totalRegistros}</span></div>
      <div><span class="ml">Columnas Numéricas</span><span class="mv">${numericCols.length}</span></div>
      <div style="grid-column:1/-1"><div><span class="ml">Analizadas</span><span class="mv">${numericCols.map(c => c).join(' · ')}</span></div></div>
      <div style="grid-column:1/-1"><div><span class="ml">Estadísticos</span><span class="mv">Media Aritmética · Mediana · Moda · Desviación Estándar · Varianza · Percentiles · Rango y Amplitud · Coeficiente de Variación · Asimetría (Skewness) · Curtosis (Kurtosis) · Error Estándar · Intervalos de Confianza</span></div></div>
      <div style="grid-column:1/-1"><span class="ml">Hash de Integridad</span><span class="mv" style="font-family:monospace;font-size:9pt">${docId}</span></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">03</span>Resumen Ejecutivo</div>
    <div style="background:#f7f8fa;border-left:4px solid #1a3a6b;border-radius:0 6px 6px 0;padding:16px 20px;font-size:10.5pt;line-height:1.7">
      Dataset <strong>"${dataset}"</strong> · <strong>${totalRegistros}</strong> observaciones · <strong>${numericCols.length}</strong> variable(s) numérica(s) · FDA 21 CFR Part 11.<br>
      Estadísticos: Media Aritmética · Mediana · Moda · Desviación Estándar · Varianza · Percentiles · Rango y Amplitud · Coeficiente de Variación · Asimetría (Skewness) · Curtosis (Kurtosis) · Error Estándar · Intervalos de Confianza.
    </div>
    ${numericCols.some(c => buildAlerts(c).length > 0) ? `
    <div style="margin-top:14px;padding:12px 16px;border-radius:6px;background:#fffbeb;border:1px solid #f6e05e">
      <strong>⚠ alerta(s) automática(s) detectada(s):</strong><br><br>
      ${numericCols.map(col => {
        const alerts = buildAlerts(col);
        return alerts.length > 0 ? alerts.map(a => `<strong>${col}:</strong> ${a}`).join('<br>') : '';
      }).filter(x => x).join('<br>')}
    </div>` : ''}
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">04</span>Resultados Estadísticos por Variable</div>
    ${varsHTML}
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">05</span>Notas Metodológicas</div>
    <div class="method-grid">
      <div class="mi"><h4>Media Aritmética</h4><p>Tendencia central de la distribución. Suma de todos los valores dividida entre el número de observaciones.</p><code>x̄ = Σxᵢ / n</code><div style="margin-top:4px;padding:4px 8px;background:#f8f9fa;border-radius:3px;font-size:7pt;font-style:italic;color:#6c757d"><strong>Ref:</strong> Freedman, D., Pisani, R. & Purves, R. (2007). Statistics. W.W. Norton</div></div>
      <div class="mi"><h4>Desviación Estándar</h4><p>Dispersión típica respecto a la media con corrección de Bessel (n−1). Principal indicador de variabilidad del proceso.</p><code>s = √[Σ(xᵢ − x̄)² / (n−1)]</code><div style="margin-top:4px;padding:4px 8px;background:#f8f9fa;border-radius:3px;font-size:7pt;font-style:italic;color:#6c757d"><strong>Ref:</strong> Bessel, F. (1838). Correction to the estimation of variance. Astronomische Nachrichten</div></div>
      <div class="mi"><h4>Percentiles</h4><p>Valores que dividen la distribución en porcentajes iguales. P50 es la mediana.</p><code>Pk = valor en posición k/100×(n+1)</code><div style="margin-top:4px;padding:4px 8px;background:#f8f9fa;border-radius:3px;font-size:7pt;font-style:italic;color:#6c757d"><strong>Ref:</strong> Hyndman, R.J. & Fan, Y. (1996). Sample Quantiles in Statistical Packages. The American Statistician</div></div>
      <div class="mi"><h4>Coeficiente de Variación</h4><p>Medida relativa de dispersión. Permite comparar variabilidad entre variables con diferentes escalas.</p><code>CV = (s / x̄) × 100%</code><div style="margin-top:4px;padding:4px 8px;background:#f8f9fa;border-radius:3px;font-size:7pt;font-style:italic;color:#6c757d"><strong>Ref:</strong> ASTM E177 Standard Practice for Use of the Terms Precision and Bias in ASTM Test Methods</div></div>
      <div class="mi"><h4>Asimetría (Skewness)</h4><p>Mide la asimetría de la distribución. Valores positivos indican cola a la derecha.</p><code>g₁ = Σ(xᵢ−x̄)³/(n·s³)</code><div style="margin-top:4px;padding:4px 8px;background:#f8f9fa;border-radius:3px;font-size:7pt;font-style:italic;color:#6c757d"><strong>Ref:</strong> Joanes, D.N. & Gill, C.A. (1998). Comparing measures of sample skewness and kurtosis. The Statistician</div></div>
      <div class="mi"><h4>Curtosis (Kurtosis)</h4><p>Mide la "cola pesada" de la distribución. Curtosis=0 indica distribución normal.</p><code>g₂ = Σ(xᵢ−x̄)⁴/(n·s⁴)−3</code><div style="margin-top:4px;padding:4px 8px;background:#f8f9fa;border-radius:3px;font-size:7pt;font-style:italic;color:#6c757d"><strong>Ref:</strong> Joanes, D.N. & Gill, C.A. (1998). Comparing measures of sample skewness and kurtosis. The Statistician</div></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-title"><span class="sec-num">06</span>Auditoría y Firma Electrónica <span style="font-size:7pt;font-weight:400;color:#a0aec0;margin-left:8px">21 CFR Part 11 — Subparte C</span></div>
    <div class="sig-grid">
      <div style="border:1px solid #e2e8f0;border-radius:6px;padding:14px">
        <div style="font-family:monospace;font-size:7pt;text-transform:uppercase;letter-spacing:1.5px;color:#1a3a6b;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:5px">Preparado por</div>
        <div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">Nombre</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:#2d3748">${cfr21.electronicSignatures?.prepared?.name || reporte.autor || '—'}</span></div>
        <div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">Cargo / Posición</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:#2d3748">${cfr21.electronicSignatures?.prepared?.title || 'Analista de Datos'}</span></div>
        <div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">Fecha</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:#2d3748">${cfr21.electronicSignatures?.prepared?.date || formatFullDate(now)}</span></div>
        <div style="border-top:1px solid #1a202c;margin-top:14px;padding-top:5px;font-size:7pt;color:#718096;font-family:monospace">Registro electrónico · FDA 21 CFR Part 11</div>
      </div>
      <div style="border:1px solid #e2e8f0;border-radius:6px;padding:14px">
        <div style="font-family:monospace;font-size:7pt;text-transform:uppercase;letter-spacing:1.5px;color:#1a3a6b;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:5px">Revisado por</div>
        <div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">Nombre</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:#cbd5e0;font-style:italic">${cfr21.electronicSignatures?.reviewed?.name || '—'}</span></div>
        <div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">Cargo / Posición</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:#cbd5e0;font-style:italic">${cfr21.electronicSignatures?.reviewed?.title || '—'}</span></div>
        <div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">Fecha</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:#cbd5e0;font-style:italic">${cfr21.electronicSignatures?.reviewed?.date || '—'}</span></div>
        <div style="border-top:1px solid #1a202c;margin-top:14px;padding-top:5px;font-size:7pt;color:#718096;font-family:monospace">Registro electrónico · FDA 21 CFR Part 11</div>
      </div>
      <div style="border:1px solid #e2e8f0;border-radius:6px;padding:14px">
        <div style="font-family:monospace;font-size:7pt;text-transform:uppercase;letter-spacing:1.5px;color:#1a3a6b;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:5px">Aprobado por</div>
        <div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">Nombre</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:#cbd5e0;font-style:italic">${cfr21.electronicSignatures?.approved?.name || '—'}</span></div>
        <div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">Cargo / Posición</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:#cbd5e0;font-style:italic">${cfr21.electronicSignatures?.approved?.title || '—'}</span></div>
        <div style="margin-bottom:8px"><span style="font-size:7pt;color:#a0aec0;font-family:monospace;text-transform:uppercase;display:block">Fecha</span><span style="font-size:9.5pt;border-bottom:1px solid #e2e8f0;padding-bottom:3px;display:block;color:#cbd5e0;font-style:italic">${cfr21.electronicSignatures?.approved?.date || '—'}</span></div>
        <div style="border-top:1px solid #1a202c;margin-top:14px;padding-top:5px;font-size:7pt;color:#718096;font-family:monospace">Registro electrónico · FDA 21 CFR Part 11</div>
      </div>
    </div>
    <br>
    <div class="audit-box">
      <strong style="color:#1a3a6b">METADATOS DE AUDITORÍA</strong><br>
      ID del Documento: ${docId} &nbsp;|&nbsp; Software: ${cfr21.auditTrail?.software || 'StatAnalyzer Pro'} v${cfr21.auditTrail?.version || '2.5'} &nbsp;|&nbsp; Generado: ${cfr21.auditTrail?.generationDateFormatted || formatFullDateTime(now)} UTC<br>
      Standard: ${cfr21.standard || 'FDA 21 CFR Part 11'} &nbsp;|&nbsp; Guideline: ICH E9 Statistical Principles for Clinical Trials
    </div>
  </div>

  <div class="doc-footer">
    <div><strong style="color:#1a3a6b">${docId}</strong><br>StatAnalyzer Pro v${cfr21.auditTrail?.version || '2.5'}</div>
    <div style="text-align:center">${reporte.confidencial || 'CONFIDENTIAL — FOR INTERNAL USE ONLY'}</div>
    <div style="text-align:right">FDA 21 CFR Part 11<br>${formatFullDate(now)}</div>
  </div>
</div>
</body></html>`;
  }

  function generarCSV(reporte) {
    const cfr21 = reporte.cfr21Compliance || {};
    let csv = '# Reporte CFR 21 Part 11 - StatAnalyzer Pro\n';
    csv += '# ======================================\n\n';
    csv += `Titulo,${reporte.nombre}\n`;
    csv += `Autor,${reporte.autor}\n`;
    csv += `Version,${reporte.version || '1.0'}\n`;
    csv += `Estado,${reporte.estado}\n`;
    csv += `Dataset,${reporte.dataset}\n`;
    csv += `Pruebas,${reporte.pruebasCount}\n`;
    csv += `Graficos,${reporte.graficosCount}\n`;
    csv += `Hash,RPT-${cfr21.integrityHash || 'N/A'}\n`;
    csv += `Fecha,${formatDate(reporte.creado)}\n\n`;

    if (reporte.fase || reporte.equipo) {
      csv += '# Cualificacion Farmaceutica\n';
      csv += `Tipo Cualificacion,${reporte.fase || 'N/A'}\n`;
      csv += `Lote,${reporte.lote || 'N/A'}\n`;
      csv += `Equipo,${reporte.equipo || 'N/A'}\n`;
      csv += `Serie,${reporte.serie || 'N/A'}\n`;
      csv += `Modelo,${reporte.modelo || 'N/A'}\n`;
      csv += `Protocolo,${reporte.protocolo || 'N/A'}\n`;
      csv += `Confidencialidad,${reporte.confidencial || 'N/A'}\n\n`;
    }

    csv += '# Firmas Electronicas\n';
    csv += `PreparadoNombre,${reporte.firmaPreparado?.nombre || ''}\n`;
    csv += `PreparadoCargo,${reporte.firmaPreparado?.cargo || ''}\n`;
    csv += `PreparadoFecha,${reporte.firmaPreparado?.fecha || ''}\n`;
    csv += `RevisadoNombre,${reporte.firmaRevisado?.nombre || ''}\n`;
    csv += `RevisadoCargo,${reporte.firmaRevisado?.cargo || ''}\n`;
    csv += `RevisadoFecha,${reporte.firmaRevisado?.fecha || ''}\n`;
    csv += `AprobadoNombre,${reporte.firmaAprobado?.nombre || ''}\n`;
    csv += `AprobadoCargo,${reporte.firmaAprobado?.cargo || ''}\n`;
    csv += `AprobadoFecha,${reporte.firmaAprobado?.fecha || ''}\n`;

    return csv;
  }

  function generarTXT(reporte) {
    const cfr21 = reporte.cfr21Compliance || {};
    const W = 60;
    const line = (s) => s.repeat(W);

    let txt = '';
    txt += line('=') + '\n';
    txt += `  REPORTE CFR 21 PART 11 - StatAnalyzer Pro\n`;
    txt += line('=') + '\n\n';
    txt += `Titulo: ${reporte.nombre}\n`;
    txt += `Autor: ${reporte.autor}\n`;
    txt += `Version: ${reporte.version || '1.0'}\n`;
    txt += `Estado: ${reporte.estado}\n`;
    txt += `Dataset: ${reporte.dataset}\n`;
    txt += `Pruebas: ${reporte.pruebasCount}\n`;
    txt += `Hash: RPT-${cfr21.integrityHash || 'N/A'}\n`;
    txt += `Fecha: ${formatDate(reporte.creado)}\n\n`;

    if (reporte.fase || reporte.equipo) {
      txt += line('-') + '\n';
      txt += 'CUALIFICACION FARMACEUTICA\n';
      txt += line('-') + '\n';
      txt += `Tipo: ${reporte.fase || 'N/A'}\n`;
      txt += `Lote: ${reporte.lote || 'N/A'}\n`;
      txt += `Equipo: ${reporte.equipo || 'N/A'}\n`;
      txt += `Serie: ${reporte.serie || 'N/A'}\n`;
      txt += `Modelo: ${reporte.modelo || 'N/A'}\n`;
      txt += `Protocolo: ${reporte.protocolo || 'N/A'}\n\n`;
    }

    txt += line('-') + '\n';
    txt += 'FIRMAS ELECTRONICAS\n';
    txt += line('-') + '\n';
    txt += `Preparado: ${reporte.firmaPreparado?.nombre || ''} | ${reporte.firmaPreparado?.cargo || ''} | ${reporte.firmaPreparado?.fecha || ''}\n`;
    txt += `Revisado: ${reporte.firmaRevisado?.nombre || ''} | ${reporte.firmaRevisado?.cargo || ''} | ${reporte.firmaRevisado?.fecha || ''}\n`;
    txt += `Aprobado: ${reporte.firmaAprobado?.nombre || ''} | ${reporte.firmaAprobado?.cargo || ''} | ${reporte.firmaAprobado?.fecha || ''}\n\n`;
    txt += line('=') + '\n';
    txt += 'FIN DEL REPORTE\n';
    txt += line('=') + '\n';

    return txt;
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
        <div style="background:#252525;padding:28px;border-radius:16px;max-width:1000px;width:100%;max-height:95vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #404040;padding-bottom:16px;">
            <h2 style="color:#e0e0e0;margin:0;">📋 Nuevo Reporte CFR 21 Part 11</h2>
            <button onclick="document.getElementById('reporte-modal-overlay').remove()" style="background:none;border:none;color:#888;font-size:24px;cursor:pointer;">✕</button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:16px;margin-bottom:20px;width:100%;box-sizing:border-box;">
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
                    <button type="button" onclick="document.getElementById('reporte-fabrica-hidden').showPicker()" style="display:inline-flex;align-items:center;gap:4px;padding:8px 10px;border-radius:4px;border:0.5px solid rgba(74,144,217,0.2);font-size:12px;cursor:pointer;backdrop-filter:blur(8px);background:rgba(74,144,217,0.08);color:#6cb4f5;">📅</button>
                  </div>
                </div>
                <div>
                  <label style="color:#9e9e98;font-size:11px;display:block;margin-bottom:4px;">Fecha Expiración</label>
                  <div style="display:flex;gap:8px;align-items:center;">
                    <input type="text" id="reporte-expiracion-text" placeholder="dd/mmm/aaaa" style="flex:1;padding:10px;background:#2a2a28;border:1px solid #404040;border-radius:6px;color:#e0e0e0;" onchange="handleManualDateInput('reporte-expiracion-text', null)">
                    <input type="date" id="reporte-expiracion-hidden" style="display:none;" onchange="syncDateFromPicker('reporte-expiracion-hidden', 'reporte-expiracion-text', null)">
                    <button type="button" onclick="document.getElementById('reporte-expiracion-hidden').showPicker()" style="display:inline-flex;align-items:center;gap:4px;padding:8px 10px;border-radius:4px;border:0.5px solid rgba(74,144,217,0.2);font-size:12px;cursor:pointer;backdrop-filter:blur(8px);background:rgba(74,144,217,0.08);color:#6cb4f5;">📅</button>
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
                    <button type="button" onclick="document.getElementById('reporte-firma-preparado-fecha-hidden').showPicker()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 8px;border-radius:4px;border:0.5px solid rgba(74,144,217,0.2);font-size:12px;cursor:pointer;backdrop-filter:blur(8px);background:rgba(74,144,217,0.08);color:#6cb4f5;">📅</button>
                  </div>
                </div>
                <div style="padding:12px;background:#2a2a28;border-radius:8px;">
                  <div style="color:#f0ad4e;font-weight:bold;font-size:12px;margin-bottom:8px;">👁️ Revisado por</div>
                  <input type="text" id="reporte-firma-revisado" placeholder="Nombre" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px;">
                  <input type="text" id="reporte-firma-revisado-cargo" placeholder="Cargo" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px;">
                  <div style="display:flex;gap:4px;align-items:center;">
                    <input type="text" id="reporte-firma-revisado-fecha-text" placeholder="dd/mmm/aaaa" style="flex:1;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;" onchange="handleManualDateInput('reporte-firma-revisado-fecha-text', null)">
                    <input type="date" id="reporte-firma-revisado-fecha-hidden" style="display:none;" onchange="syncDateFromPicker('reporte-firma-revisado-fecha-hidden', 'reporte-firma-revisado-fecha-text', null)">
                    <button type="button" onclick="document.getElementById('reporte-firma-revisado-fecha-hidden').showPicker()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 8px;border-radius:4px;border:0.5px solid rgba(74,144,217,0.2);font-size:12px;cursor:pointer;backdrop-filter:blur(8px);background:rgba(74,144,217,0.08);color:#6cb4f5;">📅</button>
                  </div>
                </div>
                <div style="padding:12px;background:#2a2a28;border-radius:8px;">
                  <div style="color:#667eea;font-weight:bold;font-size:12px;margin-bottom:8px;">✅ Aprobado por</div>
                  <input type="text" id="reporte-firma-aprobado" placeholder="Nombre" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px;">
                  <input type="text" id="reporte-firma-aprobado-cargo" placeholder="Cargo" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px;">
                  <div style="display:flex;gap:4px;align-items:center;">
                    <input type="text" id="reporte-firma-aprobado-fecha-text" placeholder="dd/mmm/aaaa" style="flex:1;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:4px;color:#e0e0e0;font-size:12px;" onchange="handleManualDateInput('reporte-firma-aprobado-fecha-text', null)">
                    <input type="date" id="reporte-firma-aprobado-fecha-hidden" style="display:none;" onchange="syncDateFromPicker('reporte-firma-aprobado-fecha-hidden', 'reporte-firma-aprobado-fecha-text', null)">
                    <button type="button" onclick="document.getElementById('reporte-firma-aprobado-fecha-hidden').showPicker()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 8px;border-radius:4px;border:0.5px solid rgba(74,144,217,0.2);font-size:12px;cursor:pointer;backdrop-filter:blur(8px);background:rgba(74,144,217,0.08);color:#6cb4f5;">📅</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:16px;border-top:1px solid #404040;">
            <button onclick="document.getElementById('reporte-modal-overlay').remove()" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:6px;border:0.5px solid rgba(180,180,175,0.2);font-size:14px;cursor:pointer;font-family:inherit;backdrop-filter:blur(8px);transition:all .2s ease;background:rgba(180,180,175,0.12);border-color:rgba(180,180,175,0.2);color:#b4b4af;">Cancelar</button>
            <button onclick="ReportesManager.generarReporteCompleto()" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:6px;border:0.5px solid transparent;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;backdrop-filter:blur(8px);transition:all .2s ease;background:rgba(74,144,217,0.12);border-color:rgba(74,144,217,0.2);color:#6cb4f5;box-shadow:0 2px 8px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1);">💾 Generar Reporte CFR 21</button>
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
      resultados: analisis?.resultados || {},
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

    showToast(`Reporte CFR 21 Part 11 generado - Hash: RPT-${integrityHash}`, 'ok');
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