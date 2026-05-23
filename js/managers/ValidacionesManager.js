// ═══════════════════════════════════════════════════════════════════════════
// VALIDACIONESMANAGER - Módulo de validación y calibración de sistemas/métodos/equipos
// ═══════════════════════════════════════════════════════════════════════════

const ValidacionesManager = (() => {
  const STORAGE_KEY = 'sigmaPro_validaciones';

  const TIPOS_VALIDACION = [
    { value: 'sistema', label: 'Sistema', icon: '⚙️' },
    { value: 'metodo', label: 'Método', icon: '📐' },
    { value: 'equipo', label: 'Equipo', icon: '🔧' },
    { value: 'proceso', label: 'Proceso', icon: '🔄' },
    { value: 'instrumento', label: 'Instrumento', icon: '📟' }
  ];

  function loadValidaciones() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveValidaciones(validaciones) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validaciones));
  }

  function init() {
    console.log('📋 ValidacionesManager inicializado');
  }

  function renderValidacionesUI(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const validaciones = loadValidaciones();

    container.innerHTML = `
      <div class="validaciones-container">
        <div class="validaciones-header">
          <h3>📋 Validaciones y Calibraciones</h3>
          <div class="validaciones-actions">
            <button class="btn-crystal" onclick="ValidacionesManager.abrirModalNuevaValidacion()">➕ Nueva Validación</button>
            <button class="btn-crystal" onclick="ValidacionesManager.abrirModalImportar()">📥 Importar CSV</button>
            <button class="btn-crystal" onclick="ValidacionesManager.abrirModalCorrelacion()">📊 Correlacionar con Análisis</button>
          </div>
        </div>
        ${validaciones.length === 0 ? `
          <div class="empty-state">
            <p>No hay validaciones cargadas.</p>
            <p style="font-size:12px;color:#888;">Carga datos de calibración de sistemas, métodos o equipos para correlacionar con resultados de análisis.</p>
          </div>
        ` : `
          <div class="validaciones-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Calificación</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${validaciones.map((v, i) => `
                  <tr>
                    <td><b>${escapeHtml(v.nombre)}</b></td>
                    <td><span class="tag tag-info">${getTipoLabel(v.tipo)}</span></td>
                    <td>
                      <div class="calificacion-bar">
                        <div class="calificacion-fill" style="width:${v.calificacion}%"></div>
                        <span class="calificacion-text">${v.calificacion}%</span>
                      </div>
                    </td>
                    <td>${formatDate(v.fecha)}</td>
                    <td><span class="tag ${v.calificacion >= 80 ? 'tag-run' : v.calificacion >= 60 ? 'tag-warn' : 'tag-error'}">${getEstadoLabel(v.calificacion)}</span></td>
                    <td>
                      <button class="btn-icon" onclick="ValidacionesManager.editarValidacion(${i})" title="Editar">✏️</button>
                      <button class="btn-icon" onclick="ValidacionesManager.eliminarValidacion(${i})" title="Eliminar">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="validaciones-summary">
            <span>Total: ${validaciones.length}</span>
            <span>Aprobadas: ${validaciones.filter(v => v.calificacion >= 80).length}</span>
            <span>En revisión: ${validaciones.filter(v => v.calificacion >= 60 && v.calificacion < 80).length}</span>
            <span>Reprobadas: ${validaciones.filter(v => v.calificacion < 60).length}</span>
          </div>
        `}
      </div>
    `;
  }

  function getTipoLabel(tipo) {
    const found = TIPOS_VALIDACION.find(t => t.value === tipo);
    return found ? `${found.icon} ${found.label}` : tipo;
  }

  function getEstadoLabel(calificacion) {
    if (calificacion >= 80) return 'Aprobado';
    if (calificacion >= 60) return 'En Revisión';
    return 'Reprobado';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function abrirModalNuevaValidacion(existingIndex = null) {
    const validaciones = loadValidaciones();
    const existing = existingIndex !== null ? validaciones[existingIndex] : null;

    const modalHtml = `
      <div class="validation-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)this.remove()">
        <div style="background:#2a2a2a;padding:24px;border-radius:12px;max-width:500px;width:90%;max-height:90vh;overflow-y:auto;">
          <h3 style="color:#e0e0e0;margin:0 0 16px;">${existing ? '✏️ Editar' : '➕ Nueva'} Validación</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Nombre del sistema/método/equipo *</label>
              <input type="text" id="val-nombre" value="${existing?.nombre || ''}" placeholder="Ej: Sistema de HPLC, Método Karl Fischer, Equipo espectrómetro..." style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
            </div>
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Tipo de validación *</label>
              <select id="val-tipo" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                ${TIPOS_VALIDACION.map(t => `<option value="${t.value}" ${existing?.tipo === t.value ? 'selected' : ''}>${t.icon} ${t.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Calificación (0-100) *</label>
              <input type="number" id="val-calificacion" value="${existing?.calificacion || 0}" min="0" max="100" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
              <input type="range" id="val-calificacion-slider" value="${existing?.calificacion || 0}" min="0" max="100" style="width:100%;margin-top:8px;" oninput="document.getElementById('val-calificacion').value=this.value">
            </div>
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Fecha de validación</label>
              <input type="date" id="val-fecha" value="${existing?.fecha || new Date().toISOString().slice(0,10)}" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
            </div>
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Descripción / Notas</label>
              <textarea id="val-notas" rows="3" placeholder="Detalles de la validación, criterios usados, observaciones..." style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;resize:vertical;">${existing?.notas || ''}</textarea>
            </div>
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Criterio de aceptación</label>
              <input type="number" id="val-criterio" value="${existing?.criterio || 80}" min="0" max="100" placeholder="Por defecto 80%" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
            </div>
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
              <button onclick="document.querySelector('.validation-modal-overlay').remove()" style="padding:8px 16px;background:transparent;border:1px solid #404040;border-radius:6px;color:#9e9e98;cursor:pointer;">Cancelar</button>
              <button onclick="ValidacionesManager.guardarValidacion(${existingIndex})" style="padding:8px 16px;background:#5c6bc0;border:none;border-radius:6px;color:#fff;cursor:pointer;">💾 Guardar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  function guardarValidacion(existingIndex = null) {
    const nombre = document.getElementById('val-nombre').value.trim();
    const tipo = document.getElementById('val-tipo').value;
    const calificacion = parseFloat(document.getElementById('val-calificacion').value);
    const fecha = document.getElementById('val-fecha').value;
    const notas = document.getElementById('val-notas').value.trim();
    const criterio = parseFloat(document.getElementById('val-criterio').value) || 80;

    if (!nombre) {
      showToast('El nombre es obligatorio', 'error');
      return;
    }

    if (calificacion < 0 || calificacion > 100) {
      showToast('La calificación debe estar entre 0 y 100', 'error');
      return;
    }

    const validaciones = loadValidaciones();
    const validacion = {
      nombre,
      tipo,
      calificacion,
      fecha,
      notas,
      criterio,
      creado: existingIndex !== null ? validaciones[existingIndex].creado : new Date().toISOString(),
      actualizado: new Date().toISOString()
    };

    if (existingIndex !== null) {
      validaciones[existingIndex] = validacion;
    } else {
      validaciones.unshift(validacion);
    }

    saveValidaciones(validaciones);
    document.querySelector('.validation-modal-overlay')?.remove();
    renderValidacionesUI('validaciones-container');
    showToast(existingIndex !== null ? 'Validación actualizada' : 'Validación guardada', 'ok');
  }

  function editarValidacion(index) {
    abrirModalNuevaValidacion(index);
  }

  function eliminarValidacion(index) {
    if (!confirm('¿Eliminar esta validación?')) return;
    const validaciones = loadValidaciones();
    validaciones.splice(index, 1);
    saveValidaciones(validaciones);
    renderValidacionesUI('validaciones-container');
    showToast('Validación eliminada', 'ok');
  }

  function abrirModalImportar() {
    const modalHtml = `
      <div class="validation-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)this.remove()">
        <div style="background:#2a2a2a;padding:24px;border-radius:12px;max-width:500px;width:90%;">
          <h3 style="color:#e0e0e0;margin:0 0 16px;">📥 Importar Validaciones</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="background:#1a1a18;padding:16px;border-radius:8px;">
              <p style="color:#9e9e98;font-size:12px;margin-bottom:8px;">Formatos aceptados:</p>
              <ul style="color:#888;font-size:11px;margin-left:16px;">
                <li>CSV: nombre,tipo,calificacion,fecha,notas</li>
                <li>Excel: Copiar y pegar datos</li>
              </ul>
            </div>
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Pegar datos (CSV o tabulares)</label>
              <textarea id="val-import-data" rows="8" placeholder="nombre,tipo,calificacion,fecha,notas
Sistema HPLC,sistema,95,2026-01-15,Mantenimiento preventivo
Método Cromatografía,metodo,88,2026-02-01,Validación completada
Espectrómetro XRF,equipo,92,2026-03-10,Calibración OK" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;resize:vertical;font-family:monospace;font-size:11px;"></textarea>
            </div>
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
              <button onclick="document.querySelector('.validation-modal-overlay').remove()" style="padding:8px 16px;background:transparent;border:1px solid #404040;border-radius:6px;color:#9e9e98;cursor:pointer;">Cancelar</button>
              <button onclick="ValidacionesManager.importarDatos()" style="padding:8px 16px;background:#5c6bc0;border:none;border-radius:6px;color:#fff;cursor:pointer;">📥 Importar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  function importarDatos() {
    const data = document.getElementById('val-import-data').value.trim();
    if (!data) {
      showToast('No hay datos para importar', 'error');
      return;
    }

    const validaciones = loadValidaciones();
    const lines = data.split('\n');
    let imported = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      let parts;
      if (trimmed.includes(',')) {
        parts = trimmed.split(',').map(p => p.trim());
      } else if (trimmed.includes('\t')) {
        parts = trimmed.split('\t').map(p => p.trim());
      } else {
        continue;
      }

      if (parts.length >= 3) {
        const nombre = parts[0];
        const tipo = normalizeTipo(parts[1]);
        const calificacion = parseFloat(parts[2]);
        const fecha = parts[3] || new Date().toISOString().slice(0, 10);
        const notas = parts[4] || '';

        if (nombre && !isNaN(calificacion) && calificacion >= 0 && calificacion <= 100) {
          validaciones.unshift({
            nombre,
            tipo,
            calificacion,
            fecha,
            notas,
            criterio: 80,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString()
          });
          imported++;
        }
      }
    }

    if (imported > 0) {
      saveValidaciones(validaciones);
      document.querySelector('.validation-modal-overlay')?.remove();
      renderValidacionesUI('validaciones-container');
      showToast(`${imported} validación(es) importada(s)`, 'ok');
    } else {
      showToast('No se pudieron importar datos. Verifica el formato.', 'error');
    }
  }

  function normalizeTipo(tipo) {
    const normalized = tipo.toLowerCase().trim();
    if (normalized.includes('sistema')) return 'sistema';
    if (normalized.includes('metodo') || normalized.includes('método')) return 'metodo';
    if (normalized.includes('equipo')) return 'equipo';
    if (normalized.includes('proceso')) return 'proceso';
    if (normalized.includes('instrumento')) return 'instrumento';
    return 'sistema';
  }

  function abrirModalCorrelacion() {
    const validaciones = loadValidaciones();
    const analisis = typeof StateManager !== 'undefined'
      ? StateManager.getAnalisisHistory()
      : JSON.parse(localStorage.getItem('sigmaPro_analisis') || '[]');

    if (validaciones.length === 0) {
      showToast('No hay validaciones cargadas. Primero importa o crea validaciones.', 'warn');
      return;
    }

    if (analisis.length === 0) {
      showToast('No hay análisis ejecutados. Ejecuta un análisis primero.', 'warn');
      return;
    }

    const lastAnalisis = analisis[0];
    const numericColumns = getNumericColumnsFromAnalisis(lastAnalisis);

    const modalHtml = `
      <div class="validation-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)this.remove()">
        <div style="background:#2a2a2a;padding:24px;border-radius:12px;max-width:500px;width:90%;">
          <h3 style="color:#e0e0e0;margin:0 0 16px;">📊 Correlacionar Validaciones con Análisis</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="background:#1a1a18;padding:12px;border-radius:8px;">
              <p style="color:#9e9e98;font-size:11px;">
                <strong>Dataset:</strong> ${lastAnalisis.dataset || 'N/A'}<br>
                <strong>Validaciones:</strong> ${validaciones.length}<br>
                <strong>Columnas numéricas:</strong> ${numericColumns.length}
              </p>
            </div>
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Seleccionar columna del análisis *</label>
              <select id="correlacion-columna" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                ${numericColumns.map(col => `<option value="${col}">${col}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="color:#9e9e98;font-size:12px;display:block;margin-bottom:4px;">Estadístico a correlacionar *</label>
              <select id="correlacion-estadistico" style="width:100%;padding:8px;background:#1a1a18;border:1px solid #404040;border-radius:6px;color:#e0e0e0;">
                <option value="Media Aritmética">Media Aritmética</option>
                <option value="Desviación Estándar">Desviación Estándar</option>
                <option value="Mediana">Mediana</option>
                <option value="Coeficiente de Variación">Coeficiente de Variación</option>
              </select>
            </div>
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
              <button onclick="document.querySelector('.validation-modal-overlay').remove()" style="padding:8px 16px;background:transparent;border:1px solid #404040;border-radius:6px;color:#9e9e98;cursor:pointer;">Cancelar</button>
              <button onclick="ValidacionesManager.calcularCorrelacion()" style="padding:8px 16px;background:#5c6bc0;border:none;border-radius:6px;color:#fff;cursor:pointer;">📈 Calcular Correlación</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  function getNumericColumnsFromAnalisis(analisis) {
    if (!analisis?.resultados?.resultados) return [];
    return Object.keys(analisis.resultados.resultados);
  }

  function calcularCorrelacion() {
    const columna = document.getElementById('correlacion-columna').value;
    const estadistico = document.getElementById('correlacion-estadistico').value;

    const validaciones = loadValidaciones();
    const analisis = (typeof StateManager !== 'undefined'
      ? StateManager.getAnalisisHistory()
      : JSON.parse(localStorage.getItem('sigmaPro_analisis') || '[]'))[0];

    if (!analisis?.resultados?.resultados?.[columna]?.[estadistico]) {
      showToast('No se encontró el estadístico seleccionado', 'error');
      return;
    }

    const valorAnalisis = analisis.resultados.resultados[columna][estadistico];

    const x = validaciones.map(v => v.calificacion);
    const y = Array(validaciones.length).fill(valorAnalisis);

    const correlation = calculatePearsonCorrelation(x, y);
    const r2 = correlation * correlation;

    document.querySelector('.validation-modal-overlay')?.remove();
    mostrarResultadosCorrelacion(validaciones, columna, estadistico, valorAnalisis, correlation, r2);
  }

  function calculatePearsonCorrelation(x, y) {
    const n = x.length;
    if (n === 0) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return numerator / denominator;
  }

  function mostrarResultadosCorrelacion(validaciones, columna, estadistico, valorAnalisis, correlation, r2) {
    const strength = getCorrelationStrength(correlation);
    const direction = correlation >= 0 ? 'positiva' : 'negativa';

    const resultHtml = `
      <div class="validation-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)this.remove()">
        <div style="background:#2a2a2a;padding:24px;border-radius:12px;max-width:600px;width:90%;">
          <h3 style="color:#e0e0e0;margin:0 0 16px;">📈 Resultados de Correlación</h3>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div style="background:#1a1a18;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:48px;color:${correlation > 0 ? '#5fd97a' : '#f57c7c'};">${correlation >= 0 ? '↗️' : '↘️'}</div>
              <div style="font-size:32px;font-weight:bold;color:#e0e0e0;">r = ${correlation.toFixed(4)}</div>
              <div style="font-size:14px;color:#9e9e98;">R² = ${r2.toFixed(4)} (${(r2 * 100).toFixed(1)}% de varianza explicada)</div>
            </div>
            <div style="background:#1a1a18;padding:16px;border-radius:8px;">
              <h4 style="color:#e0e0e0;margin-bottom:12px;">Interpretación</h4>
              <p style="color:#9e9e98;font-size:14px;">
                <strong>Correlación ${direction} ${strength}.</strong><br>
                La calificación de las validaciones se correlaciona ${direction === 'positiva' ? 'directamente' : 'inversamente'} 
                con el estadístico <em>${estadistico}</em> de la columna <em>${columna}</em>.
              </p>
            </div>
            <div style="background:#1a1a18;padding:16px;border-radius:8px;">
              <h4 style="color:#e0e0e0;margin-bottom:12px;">Detalles</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">
                <div><span style="color:#888;">Columna:</span> <span style="color:#e0e0e0;">${columna}</span></div>
                <div><span style="color:#888;">Estadístico:</span> <span style="color:#e0e0e0;">${estadistico}</span></div>
                <div><span style="color:#888;">Valor análisis:</span> <span style="color:#e0e0e0;">${typeof valorAnalisis === 'number' ? valorAnalisis.toFixed(4) : 'N/A'}</span></div>
                <div><span style="color:#888;">Validaciones:</span> <span style="color:#e0e0e0;">${validaciones.length}</span></div>
              </div>
            </div>
            <div style="display:flex;gap:8px;justify-content:flex-end;">
              <button onclick="ValidacionesManager.generarGraficoCorrelacion('${columna}', '${estadistico}', ${correlation})" style="padding:8px 16px;background:#5c6bc0;border:none;border-radius:6px;color:#fff;cursor:pointer;">📊 Ver Gráfico</button>
              <button onclick="document.querySelector('.validation-modal-overlay').remove()" style="padding:8px 16px;background:transparent;border:1px solid #404040;border-radius:6px;color:#9e9e98;cursor:pointer;">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', resultHtml);
  }

  function getCorrelationStrength(r) {
    const abs = Math.abs(r);
    if (abs >= 0.9) return 'muy fuerte';
    if (abs >= 0.7) return 'fuerte';
    if (abs >= 0.5) return 'moderada';
    if (abs >= 0.3) return 'débil';
    return 'muy débil o nula';
  }

  function generarGraficoCorrelacion(columna, estadistico, correlation) {
    const validaciones = loadValidaciones();
    const analisis = (typeof StateManager !== 'undefined'
      ? StateManager.getAnalisisHistory()
      : JSON.parse(localStorage.getItem('sigmaPro_analisis') || '[]'))[0];
    const valorAnalisis = analisis?.resultados?.resultados?.[columna]?.[estadistico];

    const canvasId = 'correlacion-chart';
    const chartContainer = document.createElement('div');
    chartContainer.id = 'chart-modal';
    chartContainer.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    chartContainer.innerHTML = `
      <div style="position:absolute;top:20px;right:20px;">
        <button onclick="this.closest('#chart-modal').remove()" style="padding:8px 16px;background:#5c6bc0;border:none;border-radius:6px;color:#fff;cursor:pointer;">✕ Cerrar</button>
      </div>
      <h3 style="color:#e0e0e0;margin-bottom:16px;">📊 Gráfico de Correlación: Validaciones vs ${estadistico}</h3>
      <div style="width:90%;max-width:600px;height:400px;">
        <canvas id="${canvasId}"></canvas>
      </div>
      <p style="color:#9e9e98;font-size:12px;margin-top:16px;">Eje X: Calificación de Validación (%) | Eje Y: Valor del estadístico (constante: ${typeof valorAnalisis === 'number' ? valorAnalisis.toFixed(4) : 'N/A'})</p>
    `;
    document.body.appendChild(chartContainer);

    setTimeout(() => {
      const ctx = document.getElementById(canvasId).getContext('2d');
      new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Validaciones',
            data: validaciones.map(v => ({ x: v.calificacion, y: typeof valorAnalisis === 'number' ? valorAnalisis : 0 })),
            backgroundColor: validaciones.map(v => v.calificacion >= 80 ? '#5fd97a' : v.calificacion >= 60 ? '#f0ad4e' : '#f57c7c'),
            borderColor: '#888',
            pointRadius: 8,
            pointHoverRadius: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e0e0e0' } },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const v = validaciones[ctx.dataIndex];
                  return `${v.nombre}: ${v.calificacion}%`;
                }
              }
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Calificación (%)', color: '#e0e0e0' },
              min: 0, max: 100,
              ticks: { color: '#9e9e98' },
              grid: { color: '#333' }
            },
            y: {
              title: { display: true, text: estadistico, color: '#e0e0e0' },
              ticks: { color: '#9e9e98' },
              grid: { color: '#333' }
            }
          }
        }
      });
    }, 100);

    document.querySelector('.validation-modal-overlay')?.remove();
  }

  return {
    init,
    renderValidacionesUI,
    abrirModalNuevaValidacion,
    guardarValidacion,
    editarValidacion,
    eliminarValidacion,
    abrirModalImportar,
    importarDatos,
    abrirModalCorrelacion,
    calcularCorrelacion,
    generarGraficoCorrelacion
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ValidacionesManager.init);
} else {
  ValidacionesManager.init();
}