// ========================================
// DispositivosManager.js — StatAnalyzer Pro
// § 11.10(h) — Gestión de Dispositivos Confiados
// ========================================

const DispositivosManager = (() => {

    let _apiUrl = '';
    let _dispositivos = [];

    function init(apiUrl) {
        _apiUrl = apiUrl;
    }

    function getToken() { return Auth.getToken(); }

    async function apiGet(path) {
        var res = await fetchWithTimeout(_apiUrl + path, {
            headers: { Authorization: 'Bearer ' + (getToken() || '') },
            credentials: 'include'
        });
        return res.json();
    }

    async function apiPost(path, body) {
        var res = await fetchWithTimeout(_apiUrl + path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (getToken() || '') },
            body: JSON.stringify(body),
            credentials: 'include'
        });
        return res.json();
    }

    async function apiPut(path, body) {
        var res = await fetchWithTimeout(_apiUrl + path, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (getToken() || '') },
            body: JSON.stringify(body),
            credentials: 'include'
        });
        return res.json();
    }

    async function apiDelete(path) {
        var res = await fetchWithTimeout(_apiUrl + path, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + (getToken() || '') },
            credentials: 'include'
        });
        return res.json();
    }

    async function cargarDispositivos() {
        try {
            var result = await apiGet('/api/devices');
            if (result.ok) _dispositivos = result.devices || [];
            return result;
        } catch (err) {
            return { ok: false, error: err.message };
        }
    }

    async function toggleTrust(id, trusted) {
        return apiPut('/api/devices/' + id + '/trust', { trusted: trusted ? 1 : 0 });
    }

    async function eliminarDispositivo(id) {
        return apiDelete('/api/devices/' + id);
    }

    function escapeHtml(text) {
        if (!text) return '';
        return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function buildView() {
        var container = document.getElementById('rightPaneBody');
        if (!container) return;

        var session = Auth.getSession();
        if (!session || session.role !== 'admin') {
            container.innerHTML = '<div class="usr-layout"><div class="usr-no-access">' +
                '<div class="usr-no-access-icon">🔒</div>' +
                '<h3>Acceso restringido</h3>' +
                '<p>Esta sección es exclusiva para administradores.</p></div></div>';
            return;
        }

        container.innerHTML = '<div class="usr-layout">' +
            '<div class="usr-table-wrap" id="dsp-table-wrap">' +
            '<div class="usr-loading"><div class="usr-spinner"></div><p>Cargando dispositivos...</p></div>' +
            '</div></div>';

        _loadAndRender();
    }

    async function _loadAndRender() {
        var result = await cargarDispositivos();
        var wrap = document.getElementById('dsp-table-wrap');
        if (!wrap) return;
        if (!result.ok) {
            wrap.innerHTML = '<div class="usr-error">❌ ' + escapeHtml(result.error) + '</div>';
            return;
        }
        _renderTabla(_dispositivos);
    }

    function _renderTabla(dispositivos) {
        var wrap = document.getElementById('dsp-table-wrap');
        if (!wrap) return;

        if (!dispositivos.length) {
            wrap.innerHTML = '<div class="usr-empty">No hay dispositivos registrados.</div>';
            return;
        }

        var currentFP = typeof DeviceFingerprint !== 'undefined' ? DeviceFingerprint.getFingerprint() : null;

        var cards = dispositivos.map(function(d) {
            var isCurrent = currentFP && d.fingerprint_hash === currentFP;
            var isTrusted = d.trusted === 1;
            var lastSeen = d.last_seen ? _formatDate(d.last_seen) : '—';
            var created = d.created_at ? _formatDate(d.created_at) : '—';
            var browser = escapeHtml(d.browser || '—');
            var os = escapeHtml(d.os || '—');
            var screenRes = escapeHtml(d.screen_res || '—');
            var deviceName = escapeHtml(d.device_name || 'Dispositivo');

            return '<div class="dsp-card' + (isCurrent ? ' dsp-card-current' : '') + '">' +
                '<div class="dsp-card-header">' +
                    '<div class="dsp-card-title">' + (isCurrent ? '🖥️ ' : '💻 ') + deviceName + '</div>' +
                    '<div class="dsp-card-badge ' + (isTrusted ? 'dsp-badge-trusted' : 'dsp-badge-untrusted') + '">' +
                        (isTrusted ? '✓ Confiado' : '○ No confiado') +
                    '</div>' +
                '</div>' +
                '<div class="dsp-card-body">' +
                    '<div class="dsp-info-row"><span class="dsp-info-label">Navegador</span><span class="dsp-info-value">' + browser + '</span></div>' +
                    '<div class="dsp-info-row"><span class="dsp-info-label">Sistema</span><span class="dsp-info-value">' + os + '</span></div>' +
                    '<div class="dsp-info-row"><span class="dsp-info-label">Pantalla</span><span class="dsp-info-value">' + screenRes + '</span></div>' +
                    '<div class="dsp-info-row"><span class="dsp-info-label">Usuario</span><span class="dsp-info-value">' + escapeHtml(d.username) + '</span></div>' +
                    '<div class="dsp-info-row"><span class="dsp-info-label">Registrado</span><span class="dsp-info-value">' + created + '</span></div>' +
                    '<div class="dsp-info-row"><span class="dsp-info-label">Última vez</span><span class="dsp-info-value">' + lastSeen + '</span></div>' +
                    '<div class="dsp-info-row"><span class="dsp-info-label">Fingerprint</span><span class="dsp-info-value dsp-fp">' + escapeHtml(d.fingerprint_hash) + '</span></div>' +
                '</div>' +
                '<div class="dsp-card-actions">' +
                    '<button class="btn btn-sm ' + (isTrusted ? 'btn-secondary' : 'btn-primary') + '" onclick="DispositivosManager._onToggle(' + d.id + ', ' + (isTrusted ? '0' : '1') + ')">' +
                        (isTrusted ? '🔓 Desconfiar' : '🔒 Confiar') +
                    '</button>' +
                    '<button class="btn btn-sm btn-secondary" style="color:#e74c3c" onclick="DispositivosManager._onDelete(' + d.id + ')">🗑 Eliminar</button>' +
                    (isCurrent ? '<span class="dsp-current-tag">← Este dispositivo</span>' : '') +
                '</div>' +
            '</div>';
        }).join('');

        wrap.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
            '<div style="font-size:0.95rem;font-weight:600;color:var(--text-primary)">📱 Dispositivos registrados (' + dispositivos.length + ')</div>' +
            '<button class="btn btn-sm btn-primary" onclick="DispositivosManager._onRefresh()">🔄 Refrescar</button>' +
        '</div>' +
        '<div class="dsp-grid">' + cards + '</div>';
    }

    function _formatDate(iso) {
        if (!iso) return '—';
        try {
            var d = new Date(iso);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return iso; }
    }

    async function _onToggle(id, newTrusted) {
        var result = await toggleTrust(id, newTrusted);
        if (result.ok) {
            _loadAndRender();
        } else {
            showToast('⚠️ ' + (result.error || 'Error al cambiar estado'), 1);
        }
    }

    async function _onDelete(id) {
        if (!confirm('¿Eliminar este dispositivo de la lista de confiados?')) return;
        var result = await eliminarDispositivo(id);
        if (result.ok) {
            _loadAndRender();
        } else {
            showToast('⚠️ ' + (result.error || 'Error al eliminar'), 1);
        }
    }

    function _onRefresh() {
        _loadAndRender();
    }

    return {
        init: init,
        buildView: buildView,
        _onToggle: _onToggle,
        _onDelete: _onDelete,
        _onRefresh: _onRefresh,
    };
})();

if (typeof window !== 'undefined') {
    console.log('✅ DispositivosManager cargado');
}
