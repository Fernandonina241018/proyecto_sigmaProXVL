// ========================================
// AuditoriaManager.js — StatAnalyzer Pro
// Vista de auditoría de accesos
// Solo visible para usuarios con rol admin
// ========================================

const AuditoriaManager = (() => {

    let _logs        = [];
    let _filteredLogs= [];
    let _apiUrl      = '';

    // ── Inicializar con la URL del backend ─
    function init(apiUrl) {
        _apiUrl = apiUrl;
    }

    // ── Formatear fecha legible ────────────
    // fmtDate() ahora está en utils.js

    // ── Cargar logs desde el backend ───────
    async function cargarLogs(limit = 200) {
        const token = Auth.getToken();
        if (!token) return { ok: false, error: 'No autenticado' };

        try {
            const res  = await fetch(`${_apiUrl}/api/audit?limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) return { ok: false, error: data.error };
            _logs         = data.logs || [];
            _filteredLogs = [..._logs];
            return { ok: true, count: _logs.length };
        } catch {
            return { ok: false, error: 'No se pudo conectar con el servidor.' };
        }
    }

    // ── Estadísticas rápidas ───────────────
    function calcStats() {
        const total    = _logs.length;
        const exitosos = _logs.filter(l => l.success === 1).length;
        const fallidos = _logs.filter(l => l.success === 0).length;

        // Intentos fallidos por usuario
        const failsByUser = {};
        _logs.filter(l => l.success === 0).forEach(l => {
            failsByUser[l.username] = (failsByUser[l.username] || 0) + 1;
        });

        // Usuario con más actividad
        const actByUser = {};
        _logs.forEach(l => {
            actByUser[l.username] = (actByUser[l.username] || 0) + 1;
        });

        return { total, exitosos, fallidos, failsByUser, actByUser };
    }

    // ── Filtrar logs ───────────────────────
    function filtrar({ usuario = '', desde = '', hasta = '', soloFallidos = false }) {
        _filteredLogs = _logs.filter(l => {
            if (usuario && !l.username.toLowerCase().includes(usuario.toLowerCase())) return false;
            if (soloFallidos && l.success !== 0) return false;
            if (desde) {
                const d = new Date(desde + 'T00:00:00');
                const t = new Date(l.timestamp.includes('T') ? l.timestamp : l.timestamp + 'Z');
                if (t < d) return false;
            }
            if (hasta) {
                const d = new Date(hasta + 'T23:59:59');
                const t = new Date(l.timestamp.includes('T') ? l.timestamp : l.timestamp + 'Z');
                if (t > d) return false;
            }
            return true;
        });
        return _filteredLogs;
    }

    // ── Exportar CSV ───────────────────────
    function exportarCSV() {
        if (!_filteredLogs.length) {
            alert('⚠️ No hay registros para exportar.');
            return;
        }

        const headers = ['ID','Usuario','Acción','Resultado','IP','User Agent','Fecha'];
        const rows    = _filteredLogs.map(l => [
            l.id,
            l.username,
            l.action,
            l.success === 1 ? 'Exitoso' : 'Fallido',
            l.ip || '—',
            `"${(l.user_agent || '').replace(/"/g,'')}"`,
            fmtDate(l.timestamp)
        ]);

        const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href     = URL.createObjectURL(blob);
        link.download = `auditoria_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    // ── Construir la UI ────────────────────
    function buildView() {
        const container = document.getElementById('auditoria-container');
        if (!container) return;

        const session = Auth.getSession();
        if (!session || session.role !== 'admin') {
            container.innerHTML = `
                <div class="aud-no-access">
                    <div class="aud-no-access-icon">🔒</div>
                    <h3>Acceso restringido</h3>
                    <p>Esta sección es exclusiva para administradores.</p>
                </div>`;
            return;
        }

        container.innerHTML = `
        <div class="aud-layout">

            <!-- KPIs superiores -->
            <div class="aud-kpis" id="aud-kpis">
                <div class="aud-kpi aud-kpi-loading">Cargando...</div>
            </div>

            <!-- Filtros -->
            <div class="aud-filters-bar">
                <div class="aud-filter-group">
                    <label class="aud-filter-label">👤 Usuario</label>
                    <input class="aud-filter-input" type="text" id="aud-filter-user" placeholder="Buscar usuario...">
                </div>
                <div class="aud-filter-group">
                    <label class="aud-filter-label">📅 Desde</label>
                    <input class="aud-filter-input" type="date" id="aud-filter-desde">
                </div>
                <div class="aud-filter-group">
                    <label class="aud-filter-label">📅 Hasta</label>
                    <input class="aud-filter-input" type="date" id="aud-filter-hasta">
                </div>
                <div class="aud-filter-group aud-filter-check">
                    <label class="aud-checkbox-row">
                        <input type="checkbox" id="aud-filter-fallidos">
                        <span class="aud-checkbox-custom"></span>
                        <span>Solo fallidos</span>
                    </label>
                </div>
                <button class="aud-btn-filter" id="aud-btn-filter">🔍 Filtrar</button>
                <button class="aud-btn-reset"  id="aud-btn-reset">✕ Limpiar</button>
                <button class="aud-btn-export" id="aud-btn-export">📥 Exportar CSV</button>
                <button class="aud-btn-refresh" id="aud-btn-refresh" title="Recargar">🔄</button>
            </div>

            <!-- Contador de resultados -->
            <div class="aud-results-info" id="aud-results-info">—</div>

            <!-- Tabla -->
            <div class="aud-table-wrap" id="aud-table-wrap">
                <div class="aud-loading">
                    <div class="aud-spinner"></div>
                    <p>Cargando registros de auditoría...</p>
                </div>
            </div>

            <!-- Tabla de intentos fallidos por usuario -->
            <div class="aud-fails-section" id="aud-fails-section" style="display:none">
                <div class="aud-fails-title">⚠️ Intentos fallidos por usuario</div>
                <div id="aud-fails-table"></div>
            </div>
        </div>`;

        _attachListeners();
        _loadAndRender();
    }

    async function _loadAndRender() {
        const result = await cargarLogs(500);
    if (!result.ok) {
        document.getElementById('aud-table-wrap').innerHTML =
            `<div class="aud-error">❌ ${escapeHtml(result.error)}</div>`;
            return;
        }
        _renderKPIs();
        _renderTable(_logs);
        _renderFailsByUser();
    }

    function _renderKPIs() {
        const s   = calcStats();
        const kpi = document.getElementById('aud-kpis');
        if (!kpi) return;

        kpi.innerHTML = `
            <div class="aud-kpi">
                <div class="aud-kpi-value">${s.total}</div>
                <div class="aud-kpi-label">Total registros</div>
            </div>
            <div class="aud-kpi aud-kpi-ok">
                <div class="aud-kpi-value">${s.exitosos}</div>
                <div class="aud-kpi-label">Accesos exitosos</div>
            </div>
            <div class="aud-kpi aud-kpi-fail">
                <div class="aud-kpi-value">${s.fallidos}</div>
                <div class="aud-kpi-label">Intentos fallidos</div>
            </div>
            <div class="aud-kpi aud-kpi-rate">
                <div class="aud-kpi-value">${s.total ? Math.round((s.exitosos/s.total)*100) : 0}%</div>
                <div class="aud-kpi-label">Tasa de éxito</div>
            </div>
        `;
    }

    function _renderTable(logs) {
        const wrap    = document.getElementById('aud-table-wrap');
        const infoEl  = document.getElementById('aud-results-info');
        if (!wrap) return;

        if (infoEl) {
            infoEl.textContent = `Mostrando ${logs.length} registro${logs.length !== 1 ? 's' : ''}`;
        }

        if (!logs.length) {
            wrap.innerHTML = '<div class="aud-empty">No hay registros que coincidan con los filtros.</div>';
            return;
        }

        const rows = logs.map(l => {
            const ok      = l.success === 1;
            const badgeCls= ok ? 'aud-badge-ok' : 'aud-badge-fail';
            const badge   = ok ? '✓ Exitoso' : '✕ Fallido';
            return `
            <tr>
                <td class="aud-td-mono">${l.id}</td>
                <td><strong>${escapeHtml(l.username)}</strong></td>
                <td class="aud-td-action">${escapeHtml(l.action || '—')}</td>
                <td><span class="aud-badge ${badgeCls}">${badge}</span></td>
                <td class="aud-td-mono aud-td-ip">${escapeHtml(l.ip || '—')}</td>
                <td class="aud-td-date">${fmtDate(l.timestamp)}</td>
            </tr>`;
        }).join('');

        wrap.innerHTML = `
        <table class="aud-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Resultado</th>
                    <th>IP</th>
                    <th>Fecha y hora</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
    }

    function _renderFailsByUser() {
        const s       = calcStats();
        const section = document.getElementById('aud-fails-section');
        const table   = document.getElementById('aud-fails-table');
        if (!section || !table) return;

        const entries = Object.entries(s.failsByUser)
            .sort((a, b) => b[1] - a[1]);

        if (!entries.length) { section.style.display = 'none'; return; }

        section.style.display = 'block';
        table.innerHTML = `
        <table class="aud-table aud-table-compact">
            <thead>
                <tr><th>Usuario</th><th>Intentos fallidos</th><th>Riesgo</th></tr>
            </thead>
            <tbody>
                ${entries.map(([user, count]) => {
                    const risk    = count >= 5 ? 'Alto' : count >= 3 ? 'Medio' : 'Bajo';
                    const riskCls = count >= 5 ? 'aud-risk-high' : count >= 3 ? 'aud-risk-med' : 'aud-risk-low';
                    return `<tr>
                        <td><strong>${escapeHtml(user)}</strong></td>
                        <td class="aud-td-mono">${count}</td>
                        <td><span class="aud-badge ${riskCls}">${risk}</span></td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    }

    function _attachListeners() {
        document.getElementById('aud-btn-filter')?.addEventListener('click', () => {
            const usuario    = document.getElementById('aud-filter-user')?.value  || '';
            const desde      = document.getElementById('aud-filter-desde')?.value || '';
            const hasta      = document.getElementById('aud-filter-hasta')?.value || '';
            const soloFallidos = document.getElementById('aud-filter-fallidos')?.checked || false;
            const filtered   = filtrar({ usuario, desde, hasta, soloFallidos });
            _renderTable(filtered);
        });

        document.getElementById('aud-btn-reset')?.addEventListener('click', () => {
            const inputs = ['aud-filter-user','aud-filter-desde','aud-filter-hasta'];
            inputs.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            const cb = document.getElementById('aud-filter-fallidos'); if (cb) cb.checked = false;
            _filteredLogs = [..._logs];
            _renderTable(_logs);
        });

        document.getElementById('aud-btn-export')?.addEventListener('click', () => {
            _filteredLogs = [...(_filteredLogs.length ? _filteredLogs : _logs)];
            exportarCSV();
        });

        document.getElementById('aud-btn-refresh')?.addEventListener('click', async () => {
            const btn = document.getElementById('aud-btn-refresh');
            if (btn) btn.textContent = '⏳';
            await _loadAndRender();
            if (btn) btn.textContent = '🔄';
        });

        // Filtrar con Enter en el campo de usuario
        document.getElementById('aud-filter-user')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('aud-btn-filter')?.click();
        });
    }

    // escapeHtml() ahora está en utils.js

    return { init, buildView, cargarLogs, exportarCSV };

})();

console.log('✅ AuditoriaManager cargado');