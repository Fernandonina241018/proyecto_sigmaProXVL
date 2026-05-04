// ═══════════════════════════════════════════════════════════════════════════
// REPORTESMANAGER - Módulo de gestión de reportes para dashboard
// ═══════════════════════════════════════════════════════════════════════════

const ReportesManager = (() => {
  const STORAGE_KEY = 'sigmaPro_reportes';

  function loadReportes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveReportes(reportes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reportes));
  }

  function init() {
    renderReportesList();
    setupSearch();
    console.log('📄 ReportesManager inicializado');
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
        <td><b style="color:#e0e0e0">${escapeHtml(r.nombre)}</b></td>
        <td>${r.pruebas || 0} pruebas · ${r.graficos || 0} gráficos</td>
        <td><span class="tag ${r.estado === 'completado' ? 'tag-run' : 'tag-warn'}">${r.estado === 'completado' ? 'Listo' : 'Borrador'}</span></td>
        <td>${formatDate(r.creado)}</td>
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
        <td><b style="color:#e0e0e0">${escapeHtml(r.nombre)}</b></td>
        <td>${r.pruebas || 0} pruebas · ${r.graficos || 0} gráficos</td>
        <td><span class="tag ${r.estado === 'completado' ? 'tag-run' : 'tag-warn'}">${r.estado === 'completado' ? 'Listo' : 'Borrador'}</span></td>
        <td>${formatDate(r.creado)}</td>
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
    if (reporte) {
      alert(`📄 ${reporte.nombre}\n\nEstado: ${reporte.estado}\nPruebas: ${reporte.pruebas}\nGráficos: ${reporte.graficos}\nCreado: ${formatDate(reporte.creado)}`);
    }
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

  function exportarReporte(index) {
    const reportes = loadReportes();
    const reporte = reportes[index];
    if (!reporte) return;

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

  return { init, crearReporte, verReporte, duplicarReporte, exportarReporte, exportarTodo, eliminarReporte };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ReportesManager.init);
} else {
  ReportesManager.init();
}