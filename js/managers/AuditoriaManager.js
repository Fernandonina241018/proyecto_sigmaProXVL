// ========================================
// AuditoriaManager.js — StatAnalyzer Pro
// Vista de auditoría de accesos
// Solo visible para usuarios con rol admin
// ========================================

const AuditoriaManager = (() => {

    let _logs        = [];
    let _filteredLogs= [];
    let _apiUrl      = '';
    let _total       = 0;
    let _limit       = 50;
    let _offset      = 0;
    let _stats       = null;
    let _filters     = { module: '', action: '', username: '', from: '', to: '', success: '' };

    // ── Inicializar con la URL del backend ─
    function init(apiUrl) {
        _apiUrl = apiUrl;
    }

    // ── Formatear fecha legible ────────────
    // fmtDate() ahora está en utils.js

    function _queryString(limit, offset, filters) {
        const f = filters || {};
        const qs = new URLSearchParams();
        qs.set('limit', String(limit));
        qs.set('offset', String(offset));
        if (f.module) qs.set('module', f.module);
        if (f.action) qs.set('action', f.action);
        if (f.username) qs.set('username', f.username);
        if (f.from) qs.set('from', f.from);
        if (f.to) qs.set('to', f.to);
        if (f.success === '0' || f.success === '1' || f.success === 0 || f.success === 1) qs.set('success', String(f.success));
        return qs.toString();
    }

    // ── Página de logs (sin mutar el estado) ──
    async function _fetchPage(limit, offset, filters) {
        const token = Auth.getToken();
        if (!token) return { ok: false, error: t('admin_restricted') };
        try {
            const res = await fetchWithTimeout(`${_apiUrl}/api/audit?${_queryString(limit, offset, filters)}`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) return { ok: false, error: data.error };
            return {
                ok: true,
                logs: data.logs || [],
                total: (typeof data.total === 'number') ? data.total : (data.logs || []).length,
                limit: data.limit || limit,
                offset: data.offset || offset
            };
        } catch {
            return { ok: false, error: t('error_conn') };
        }
    }

    // ── Cargar logs desde el backend (compat: cargarLogs(limit)) ──
    async function cargarLogs(limit = _limit, offset = _offset, filters = _filters) {
        const r = await _fetchPage(limit, offset, filters);
        if (r.ok) {
            _logs = r.logs;
            _filteredLogs = [..._logs];
            _total = r.total;
            _limit = limit;
            _offset = offset;
        }
        return r.ok ? { ok: true, count: _logs.length, total: _total } : r;
    }

    // ── KPIs reales desde el servidor ──────
    async function cargarStats() {
        const token = Auth.getToken();
        if (!token) return { ok: false };
        try {
            const res = await fetchWithTimeout(`${_apiUrl}/api/audit/stats`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) return { ok: false, error: data.error };
            _stats = data;
            return { ok: true, stats: data };
        } catch {
            return { ok: false, error: t('error_conn') };
        }
    }

    // ── Estadísticas rápidas ───────────────
    function calcStats() {
        const total    = _logs.length;
        const exitosos = _logs.filter(l => l.success === 1).length;
        const fallidos = _logs.filter(l => l.success === 0).length;

        // Por módulo
        const byModule = {};
        _logs.forEach(l => {
            const m = l.module || 'SYSTEM';
            byModule[m] = (byModule[m] || 0) + 1;
        });

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

        // Actividad por día (últimos 7 días)
        const actByDay = {};
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            actByDay[key] = 0;
        }
        _logs.forEach(l => {
            const key = l.timestamp?.slice(0, 10);
            if (key && actByDay[key] !== undefined) {
                actByDay[key]++;
            }
        });

        return { total, exitosos, fallidos, failsByUser, actByUser, byModule, actByDay };
    }

    // ── Alertas de seguridad ───────────────
    function getAlertas() {
        const alertas = [];
        const s = calcStats();
        
        // FallsPorUsuario altos
        Object.entries(s.failsByUser).forEach(([user, count]) => {
            if (count >= 5) {
                alertas.push({ tipo: 'ALTO', msg: `${count} intentos fallidos del usuario "${escapeHtml(user)}"` });
            } else if (count >= 3) {
                alertas.push({ tipo: 'MEDIO', msg: `${count} intentos fallidos del usuario "${escapeHtml(user)}"` });
            }
        });
        
        return alertas;
    }

    // ── Actividad por día para gráfico ───
    function getActividadDiaria() {
        const s = calcStats();
        return Object.entries(s.actByDay).map(([fecha, cantidad]) => ({ fecha, cantidad }));
    }

    // ── Filtrar logs ───────────────────────
    function filtrar({ module = '', usuario = '', desde = '', hasta = '', soloFallidos = false }) {
        _filteredLogs = _logs.filter(l => {
            if (module && l.module !== module) return false;
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
    // Exporta TODOS los registros que cumplen el filtro (no solo la página).
    // Tope de seguridad: 5.000 filas.
    async function exportarCSV() {
        const btn = document.getElementById('aud-btn-export');
        if (btn) btn.textContent = '⏳';
        try {
            const all = [];
            const PAGE = 500;
            let off = 0;
            let total = null;
            while (off < 5000) {
                const r = await _fetchPage(PAGE, off, _filters);
                if (!r.ok) { showToast('❌ ' + r.error); return; }
                total = r.total;
                all.push(...r.logs);
                if (r.logs.length < PAGE || all.length >= total) break;
                off += PAGE;
            }
            if (!all.length) { showToast('⚠️ ' + t('no_data')); return; }

            const headers = ['ID','Módulo','Usuario','Acción','Resultado','Duración (ms)','Origen','Dispositivo','IP','User Agent','Fecha'];
            const rows = all.map(l => {
                let det = null;
                try { det = typeof l.details === 'string' ? JSON.parse(l.details) : l.details; } catch (e) {}
                return [
                    l.id,
                    l.module || 'SYSTEM',
                    l.username,
                    l.action,
                    l.success === 1 ? 'Exitoso' : 'Fallido',
                    (l.duration_ms == null ? '' : l.duration_ms),
                    (det && det.origin) || '',
                    (det && det.deviceFingerprint) || '',
                    l.ip || '',
                    '"' + String(l.user_agent || '').replace(/"/g, '') + '"',
                    fmtDate(l.timestamp)
                ];
            });
            const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href     = URL.createObjectURL(blob);
            link.download = `auditoria_${new Date().toISOString().slice(0,10)}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
            showToast(`✅ ${all.length} registro(s) exportados`);
        } finally {
            if (btn) btn.textContent = '📥 Exportar CSV';
        }
    }

    async function _verifyIntegrity() {
        const kpi = document.getElementById('aud-kpi-integrity');
        if (!kpi) return;
        const token = Auth.getToken();
        if (!token) { kpi.querySelector('.aud-kpi-value').textContent = '🔗 No auth'; return; }
        try {
            const res = await fetchWithTimeout(`${_apiUrl}/api/audit/verify`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.ok && data.valid) {
                kpi.innerHTML = `
                    <div class="aud-kpi-value" style="font-size:0.7rem;color:#16a34a;">🔗 ✓ Íntegra (${data.checked} reg.)</div>
                    <div class="aud-kpi-label">Cadena</div>`;
            } else if (data.ok) {
                kpi.innerHTML = `
                    <div class="aud-kpi-value" style="font-size:0.7rem;color:#dc2626;">🔗 ✕ Rota en #${data.brokenAt}</div>
                    <div class="aud-kpi-label">Cadena</div>`;
            } else {
                kpi.querySelector('.aud-kpi-value').textContent = '🔗 ' + (data.error || 'Error');
            }
        } catch {
            kpi.querySelector('.aud-kpi-value').textContent = '🔗 Error de conexión';
        }
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

            <!-- Gráfico de actividad -->
            <div class="aud-chart-section" id="aud-chart-container"></div>

            <!-- Alertas de seguridad -->
            <div class="aud-alerts-section" id="aud-alerts-container"></div>

            <!-- Filtros -->
            <div class="aud-filters-bar">
                <div class="aud-filter-group">
                    <label class="aud-filter-label">📂 Módulo</label>
                    <select class="aud-filter-input" id="aud-filter-module">
                        <option value="">Todos</option>
                        <option value="LOGIN">Login</option>
                        <option value="DATOS">Datos</option>
                        <option value="ANALISIS">Análisis</option>
                        <option value="GRAFICOS">Gráficos</option>
                        <option value="REPORTES">Reportes</option>
                        <option value="FIRMAS">Firmas</option>
                        <option value="USERS">Usuarios</option>
                        <option value="VALIDACIONES">Validaciones</option>
                        <option value="ML">ML</option>
                        <option value="SYSTEM">Sistema</option>
                    </select>
                </div>
                <div class="aud-filter-group">
                    <label class="aud-filter-label">🔎 Acción</label>
                    <input class="aud-filter-input" type="text" id="aud-filter-action" placeholder="Ej: DATASET:LOAD">
                </div>
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
                <button class="aud-btn-verify" id="aud-btn-verify" title="Verificar cadena de hash blockchain">🔗 Verificar</button>
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
        const result = await cargarLogs(_limit, _offset, _filters);
        await cargarStats();
        if (!result.ok) {
            document.getElementById('aud-table-wrap').innerHTML =
                `<div class="aud-error">❌ ${escapeHtml(result.error)}</div>` +
                `<div style="text-align:center;padding:8px"><button class="btn btn-sm btn-primary" onclick="AuditoriaManager._onRefresh()">🔄 Reintentar</button></div>`;
            var kpi = document.getElementById('aud-kpis');
            if (kpi) kpi.innerHTML = '<div class="aud-kpi"><div class="aud-kpi-value" style="color:#ef4444">—</div><div class="aud-kpi-label" style="color:#ef4444">Error de conexión</div></div>';
            return;
        }
        _renderKPIs();
        _renderTable(_logs);
        _renderFailsByUser();
        _verifyIntegrity();
    }

    function _renderKPIs() {
        const s   = _stats || {};
        const kpi = document.getElementById('aud-kpis');
        if (!kpi) return;

        const total    = s.total || 0;
        const today    = s.today || 0;
        const week     = s.week || 0;
        const failures = s.failures || 0;
        const okRate   = total ? Math.round(((total - failures) / total) * 100) : 0;

        kpi.innerHTML = `
            <div class="aud-kpi">
                <div class="aud-kpi-value">${total}</div>
                <div class="aud-kpi-label">Total registros</div>
            </div>
            <div class="aud-kpi aud-kpi-ok">
                <div class="aud-kpi-value">${today}</div>
                <div class="aud-kpi-label">Hoy</div>
            </div>
            <div class="aud-kpi">
                <div class="aud-kpi-value">${week}</div>
                <div class="aud-kpi-label">Últimos 7 días</div>
            </div>
            <div class="aud-kpi aud-kpi-fail">
                <div class="aud-kpi-value">${failures}</div>
                <div class="aud-kpi-label">Fallidos (total)</div>
            </div>
            <div class="aud-kpi aud-kpi-rate">
                <div class="aud-kpi-value">${okRate}%</div>
                <div class="aud-kpi-label">Tasa de éxito</div>
            </div>
            <div class="aud-kpi" id="aud-kpi-integrity">
                <div class="aud-kpi-value" style="font-size:0.75rem;word-break:break-all;">🔗 Verificando...</div>
                <div class="aud-kpi-label">Integridad</div>
            </div>
        `;

        // Renderizar gráfico de actividad si existe contenedor
        _renderGrafico();
        _renderAlertas();
    }

    // ── Gráfico de actividad ──────────────
    function _renderGrafico() {
        const container = document.getElementById('aud-chart-container');
        if (!container) return;
        
        let data;
        if (_stats && Array.isArray(_stats.byDay)) {
            const map = {};
            _stats.byDay.forEach(function (d) { map[d.date] = d.n; });
            data = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const k = d.toISOString().slice(0, 10);
                data.push({ fecha: k, cantidad: map[k] || 0 });
            }
        } else {
            data = getActividadDiaria();
        }
        if (!data.length) {
            container.innerHTML = '<div class="aud-empty">No hay datos para gráfico.</div>';
            return;
        }
        
        const max = Math.max(...data.map(d => d.cantidad), 1);
        const bars = data.map(d => {
            const height = Math.max(5, (d.cantidad / max) * 100);
            return `<div class="aud-bar-container">
                <div class="aud-bar" style="height: ${height}%" title="${d.fecha}: ${d.cantidad}"></div>
                <div class="aud-bar-label">${d.fecha.slice(5)}</div>
            </div>`;
        }).join('');
        
        container.innerHTML = `<div class="aud-chart">${bars}</div>`;
    }

    // ── Alertas de seguridad ─────────────
    function _renderAlertas() {
        const container = document.getElementById('aud-alerts-container');
        if (!container) return;
        
        const alertas = getAlertas();
        if (!alertas.length) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = alertas.map(a => 
            `<div class="aud-alert aud-alert-${a.tipo.toLowerCase()}">⚠️ ${escapeHtml(a.msg)}</div>`
        ).join('');
    }

    function _deviceOf(l) {
        try {
            const d = typeof l.details === 'string' ? JSON.parse(l.details) : l.details;
            const fp = d && d.deviceFingerprint;
            return fp ? String(fp).slice(0, 12) : '—';
        } catch (e) { return '—'; }
    }

    function _renderDetails(l) {
        if (!l.details) return '—';
        let d;
        try { d = typeof l.details === 'string' ? JSON.parse(l.details) : l.details; }
        catch (e) { return escapeHtml(String(l.details)).slice(0, 200); }
        if (!d || typeof d !== 'object') return escapeHtml(String(d));

        const rows = [];
        const add = (label, value, cls) => {
            rows.push('<div class="detail-row"><span class="detail-label">' + label + '</span><span class="detail-value' + (cls ? ' ' + cls : '') + '">' + escapeHtml(String(value)) + '</span></div>');
        };
        if (d.colName || d.oldValue !== undefined || d.newValue !== undefined) {
            if (d.colName) add('📊 Columna:', d.colName);
            if (d.row !== undefined) add('Fila:', d.row);
            if (d.oldValue !== undefined) add('Anterior:', d.oldValue, 'detail-old');
            if (d.newValue !== undefined) add('Nuevo:', d.newValue, 'detail-new');
        } else if (d.filename) add('📁 Archivo:', d.filename);
        else if (d.test) add('🧪 Test:', d.test);
        else if (d.stats) add('📈 Estadísticos:', Array.isArray(d.stats) ? d.stats.join(', ') : d.stats);
        else if (d.format) add('📄 Formato:', d.format);
        else if (d.error) add('❌ Error:', d.error);
        else {
            Object.keys(d).slice(0, 8).forEach((k) => {
                let v = d[k];
                if (v && typeof v === 'object') { try { v = JSON.stringify(v); } catch (e) { v = String(v); } }
                add(escapeHtml(k) + ':', String(v).slice(0, 120));
            });
        }
        return rows.length ? rows.join('') : '—';
    }

    function _renderTable(logs) {
        const wrap    = document.getElementById('aud-table-wrap');
        const infoEl  = document.getElementById('aud-results-info');
        if (!wrap) return;

        const from = _total ? (_offset + 1) : 0;
        const to   = Math.min(_offset + logs.length, _total);
        if (infoEl) infoEl.textContent = `Mostrando ${from}–${to} de ${_total} registro${_total !== 1 ? 's' : ''}`;

        if (!logs.length) {
            var filtered = _filters.module || _filters.action || _filters.username || _filters.from || _filters.to || _filters.success;
            wrap.innerHTML = '<div class="aud-empty">📋 ' + (filtered ? 'No hay registros que coincidan con los filtros.' : t('empty_general')) + '</div>';
            return;
        }

        const rows = logs.map(l => {
            const ok      = l.success === 1;
            const badgeCls= ok ? 'aud-badge-ok' : 'aud-badge-fail';
            const badge   = ok ? '✓ Exitoso' : '✕ Fallido';
            const module  = l.module || 'SYSTEM';
            const dur     = (l.duration_ms !== null && l.duration_ms !== undefined && l.duration_ms !== '') ? (l.duration_ms + ' ms') : '—';

            return `
            <tr>
                <td class="aud-td-mono">${l.id}</td>
                <td><span class="aud-badge aud-badge-module">${escapeHtml(module)}</span></td>
                <td><strong>${escapeHtml(l.username)}</strong></td>
                <td class="aud-td-action">${escapeHtml(l.action || '—')}</td>
                <td class="aud-td-details">${_renderDetails(l)}</td>
                <td class="aud-td-mono">${escapeHtml(dur)}</td>
                <td class="aud-td-mono aud-td-device">${escapeHtml(_deviceOf(l))}</td>
                <td><span class="aud-badge ${badgeCls}">${badge}</span></td>
                <td class="aud-td-mono aud-td-ip">${escapeHtml(l.ip || '—')}</td>
                <td class="aud-td-date">${fmtDate(l.timestamp)}</td>
            </tr>`;
        }).join('');

        const page  = Math.floor(_offset / _limit) + 1;
        const pages = Math.max(1, Math.ceil(_total / _limit));
        wrap.innerHTML = `
        <table class="aud-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Módulo</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Detalles</th>
                    <th>Duración</th>
                    <th>Dispositivo</th>
                    <th>Resultado</th>
                    <th>IP</th>
                    <th>Fecha y hora</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="aud-pagination">
            <button type="button" class="aud-btn-page" id="aud-page-prev" ${_offset <= 0 ? 'disabled' : ''}>‹ Anterior</button>
            <span class="aud-page-info">Página ${page} de ${pages}</span>
            <button type="button" class="aud-btn-page" id="aud-page-next" ${(_offset + logs.length) >= _total ? 'disabled' : ''}>Siguiente ›</button>
        </div>`;

        const prev = document.getElementById('aud-page-prev');
        if (prev) prev.onclick = function () { if (_offset > 0) { _offset = Math.max(0, _offset - _limit); _loadAndRender(); } };
        const next = document.getElementById('aud-page-next');
        if (next) next.onclick = function () { if (_offset + _limit < _total) { _offset += _limit; _loadAndRender(); } };
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
                    const risk    = count >= 5 ? t('audit_high') : count >= 3 ? t('audit_medium') : t('audit_low');
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
            _filters = {
                module:   document.getElementById('aud-filter-module')?.value || '',
                action:   document.getElementById('aud-filter-action')?.value || '',
                username: document.getElementById('aud-filter-user')?.value  || '',
                from:     document.getElementById('aud-filter-desde')?.value || '',
                to:       document.getElementById('aud-filter-hasta')?.value || '',
                success:  document.getElementById('aud-filter-fallidos')?.checked ? '0' : ''
            };
            _offset = 0;
            _loadAndRender();
        });

        document.getElementById('aud-btn-reset')?.addEventListener('click', () => {
            const inputs = ['aud-filter-module','aud-filter-action','aud-filter-user','aud-filter-desde','aud-filter-hasta'];
            inputs.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            const cb = document.getElementById('aud-filter-fallidos'); if (cb) cb.checked = false;
            _filters = { module: '', action: '', username: '', from: '', to: '', success: '' };
            _offset = 0;
            _loadAndRender();
        });

        document.getElementById('aud-btn-export')?.addEventListener('click', () => {
            exportarCSV();
        });

        document.getElementById('aud-btn-refresh')?.addEventListener('click', async () => {
            const btn = document.getElementById('aud-btn-refresh');
            if (btn) btn.textContent = '⏳';
            await _loadAndRender();
            if (btn) btn.textContent = t('refresh');
        });

        document.getElementById('aud-btn-verify')?.addEventListener('click', async () => {
            const btn = document.getElementById('aud-btn-verify');
            if (btn) btn.textContent = '⏳';
            await _verifyIntegrity();
            if (btn) btn.textContent = t('audit_verify');
        });

        // Filtrar con Enter en usuario/acción
        ['aud-filter-user', 'aud-filter-action'].forEach((id) => {
            document.getElementById(id)?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') document.getElementById('aud-btn-filter')?.click();
            });
        });
    }

    function _onRefresh() {
        _loadAndRender();
    }

    // escapeHtml() ahora está en utils.js

    return { init, buildView, cargarLogs, exportarCSV, _onRefresh };

})();

