// ========================================
// UsuariosManager.js — StatAnalyzer Pro
// Gestión de usuarios — Solo Admin
// ========================================

const UsuariosManager = (() => {


function _generateSecurePassword(length) {
    length = length || 14;
    var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lower = "abcdefghijklmnopqrstuvwxyz";
    var digits = "0123456789";
    var special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    var all = upper + lower + digits + special;
    var randArr = new Uint32Array(1);
    var pwd = "";
    // Ensure at least one of each type
    crypto.getRandomValues(randArr); pwd += upper[randArr[0] % upper.length];
    crypto.getRandomValues(randArr); pwd += lower[randArr[0] % lower.length];
    crypto.getRandomValues(randArr); pwd += digits[randArr[0] % digits.length];
    crypto.getRandomValues(randArr); pwd += special[randArr[0] % special.length];
    // Fill remaining
    for (var i = pwd.length; i < length; i++) {
        crypto.getRandomValues(randArr); pwd += all[randArr[0] % all.length];
    }
    // Fisher-Yates shuffle
    var arr = pwd.split("");
    for (var i = arr.length - 1; i > 0; i--) {
        crypto.getRandomValues(randArr);
        var j = randArr[0] % (i + 1);
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr.join("");
}

    let _apiUrl  = '';
    let _usuarios = [];

    function init(apiUrl) {
        _apiUrl = apiUrl;
    }

    // ── Utilidades ────────────────────────
    function getToken() { return Auth.getToken(); }

    // fmtDate() y escapeHtml() ahora están en utils.js

    // ── API calls ─────────────────────────
    async function apiGet(path) {
        const res = await fetchWithTimeout(`${_apiUrl}${path}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
            credentials: 'include'
        });
        return res.json();
    }

    async function apiPost(path, body) {
        const res = await fetchWithTimeout(`${_apiUrl}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(body),
            credentials: 'include'
        });
        return res.json();
    }

    async function apiPut(path, body) {
        const res = await fetchWithTimeout(`${_apiUrl}${path}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(body),
            credentials: 'include'
        });
        return res.json();
    }

    // ── Cargar usuarios ───────────────────
    async function cargarUsuarios() {
        try {
            const data = await apiGet('/api/users');
            if (!data.ok) throw new Error(data.error);
            _usuarios = data.users || [];
            return { ok: true };
        } catch (err) {
            return { ok: false, error: err.message };
        }
    }

    // ── Crear usuario ─────────────────────
    async function crearUsuario(username, role, perfil = {}) {
        try {
            const data = await apiPost('/api/users', { 
                username, 
                role,
                nombre: perfil.nombre,
                apellido: perfil.apellido,
                email: perfil.email,
                telefono: perfil.telefono,
                signatureCode: perfil.signatureCode,
                cargo: perfil.cargo
            });
            if (!data.ok) return { ok: false, error: data.error };
            return { ok: true, defaultPassword: data.defaultPassword, signatureCode: data.signatureCode };
        } catch {
            return { ok: false, error: t('error_conn') };
        }
    }

    // ── Toggle activo/inactivo ────────────
    async function toggleUsuario(id, active) {
        try {
            const data = await apiPut(`/api/users/${id}/toggle`, { active });
            if (!data.ok) return { ok: false, error: data.error };
            return { ok: true };
        } catch {
            return { ok: false, error: t('error_conn') };
        }
    }

// ── Cambiar contraseña (admin reset) ──
    async function resetPassword(username, newPassword) {
        try {
            const res = await fetch(`${_apiUrl}/api/users/reset-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ username, newPassword })
            });
            const data = await res.json();
            if (!data.ok) return { ok: false, error: data.error };
            return { ok: true };
        } catch {
            return { ok: false, error: t('error_conn') };
        }
    }

    // ── Cambiar rol ───────────────────────
    async function cambiarRol(id, role) {
        try {
            const data = await apiPut(`/api/users/${id}/role`, { role });
            if (!data.ok) return { ok: false, error: data.error };
            return { ok: true };
        } catch {
            return { ok: false, error: t('error_conn') };
        }
    }

    // ── Construir vista ───────────────────
    function buildView() {
        // Agregar estilos si no existen
        if (!document.getElementById('usr-card-styles')) {
            const styles = `
                .usr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:10px}
                .uc{background:var(--bg-panel);border-radius:12px;border:.5px solid var(--border);position:relative;overflow:hidden;transition:border-color .15s ease}
                .uc::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;z-index:1}
                .uc.rd::before{background:#ef4444}.uc.rw::before{background:#f59e0b}.uc.ra::before{background:#6366f1}.uc.ts::before{background:#22c55e}
                .uc.rd:hover{border-color:#ef444466}.uc.rw:hover{border-color:#f59e0b66}.uc.ra:hover{border-color:#6366f166}
                .uc.me{border-color:#6366f1}
                .uc-inactive{opacity:.65}
                .ch{padding:1rem 1rem .875rem 1.375rem;display:flex;gap:11px}
                .avw{position:relative;flex-shrink:0}
                .av{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500;color:#fff}
                .av.rd{background:#3d1e1e;color:#fc8181}.av.rw{background:#3d2e0e;color:#f6e05e}.av.ra{background:#1e2a3d;color:#63b3ed}
                @keyframes pr{0%{transform:scale(1);opacity:.6}70%{opacity:0;transform:scale(1.65)}100%{opacity:0}}
                .avw.on::after{content:'';position:absolute;inset:-4px;border-radius:50%;animation:pr 3s ease-out infinite;pointer-events:none}
                .avw.on.rd::after{border:1.5px solid #ef4444}
                .avw.on.rw::after{border:1.5px solid #f59e0b}
                .avw.on.ra::after{border:1.5px solid #6366f1}
                .sdot{position:absolute;bottom:1px;right:1px;width:10px;height:10px;border-radius:50%;background:#22c55e;border:2px solid var(--bg-panel)}
                .um{flex:1;min-width:0}
                .unr{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
                .un{font-size:14px;font-weight:500;color:var(--text-primary)}
                .mebg{font-size:10px;padding:1px 5px;border-radius:4px;background:#1e2a3d;color:#63b3ed;border:.5px solid #6366f166;letter-spacing:.05em;text-transform:uppercase}
                .ue{margin-top:2px;font-size:11px;color:var(--text-muted);font-family:var(--font-mono,monospace);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
                .uph{margin-top:2px;font-size:11px;display:flex;align-items:center;gap:4px;color:var(--text-muted)}
                .tags{display:flex;gap:4px;margin-top:7px;flex-wrap:wrap}
                .tag{font-size:11px;padding:2px 6px;border-radius:4px;display:flex;align-items:center;gap:3px;line-height:1.4}
                .td{background:#3d1e1e;color:#fc8181;border:.5px solid #ef444466}
                .tw{background:#3d2e0e;color:#f6e05e;border:.5px solid #f59e0b66}
                .ta{background:#1e2a3d;color:#63b3ed;border:.5px solid #6366f166}
                .ts{background:#1e3d2a;color:#4ade80;border:.5px solid #22c55e66}
                .tp{background:#1e3d3d;color:#4dd4ac;border:.5px solid #4dd4ac66}
                .cs{margin:0 1.375rem;padding:.725rem 0;border-top:.5px solid var(--border);display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
                .sl{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.065em;color:var(--text-muted)}
                .sv{font-size:13px;font-weight:500;color:var(--text-primary);margin-top:2px;font-variant-numeric:tabular-nums}
                .sv.ac{color:#6366f1}.sv.sc{color:#22c55e}.sv.wc{color:#f59e0b}.sv.dc{color:#ef4444}
                .ssb{font-size:10px;color:var(--text-muted);margin-top:1px}
                .ca{margin:0 1rem 0 1.375rem;padding:.6rem 0 .725rem;border-top:.5px solid var(--border);display:flex;gap:5px;align-items:center;flex-wrap:wrap}
                .ca button,.ca select{height:28px;font-size:12px;border-radius:6px;border:.5px solid var(--border);background:var(--bg-panel);color:var(--text-primary);cursor:pointer;display:flex;align-items:center;gap:4px}
                .ca select{flex:1;min-width:0;padding:0 7px;border-radius:6px}
                .ca .sep{width:.5px;height:16px;background:var(--border);margin:0 1px;flex-shrink:0}
                .usr-btn-2fa-on{background:#1e3d3d;color:#4dd4ac;border-color:#4dd4ac66;padding:0 7px}
                .usr-btn-2fa-off{color:#a0aec0;padding:0 7px}
                .usr-btn-2fa-off:hover{background:#1e3d3d;color:#4dd4ac;border-color:#4dd4ac66}
                .usr-btn-act{color:var(--text-muted);padding:0 9px}
                .usr-btn-act:hover{background:var(--border)}
                .usr-btn-deact{color:#fc8181;padding:0}
                .usr-btn-deact:hover{background:#3d1e1e}
                .usr-btn-react{color:#4ade80;padding:0}
                .usr-btn-react:hover{background:#1e3d2a}
                .usr-2fa-modal-qr{text-align:center;padding:16px 0}
                .usr-2fa-modal-qr img{max-width:200px;border-radius:8px}
                .usr-2fa-modal-secret{font-family:monospace;font-size:.9rem;background:var(--bg-panel);padding:8px;border-radius:6px;text-align:center;letter-spacing:2px;margin:8px 0}
                .usr-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:1.25rem}
                .usr-sum-item{background:var(--bg-panel);border-radius:10px;padding:.7rem 1rem;border:.5px solid var(--border)}
                .usr-sum-val{font-size:20px;font-weight:500;color:var(--text-primary);line-height:1.2}
                .usr-sum-lbl{font-size:11px;color:var(--text-muted);margin-top:2px}
                .usr-search-wrap{margin-bottom:10px;display:flex;gap:8px;align-items:center}
                .usr-search-wrap input{flex:1;padding:8px 12px;border:.5px solid var(--border);border-radius:8px;font-size:12px;background:var(--bg-panel);color:var(--text-primary)}
                .usr-search-wrap button{padding:8px 12px;border:.5px solid var(--border);border-radius:8px;background:var(--bg-panel);color:var(--text-muted);cursor:pointer;font-size:12px}
            `;
            const styleEl = document.createElement('style');
            styleEl.id = 'usr-card-styles';
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);
        }

        const container = document.getElementById('usuarios-container');
        if (!container) return;

        const session = Auth.getSession();
        if (!session || session.role !== 'admin') {
            container.innerHTML = `
                <div class="usr-no-access">
                    <div class="usr-no-access-icon">🔒</div>
                    <h3>Acceso restringido</h3>
                    <p>Esta sección es exclusiva para administradores.</p>
                </div>`;
            return;
        }

        container.innerHTML = `
        <div class="usr-layout">

            <!-- Tabla de usuarios -->
            <div class="usr-table-wrap" id="usr-table-wrap">
                <div class="usr-loading">
                    <div class="usr-spinner"></div>
                    <p>Cargando usuarios...</p>
                </div>
            </div>
        </div>`;

        _attachListeners();
        _loadAndRender();
    }

    async function _loadAndRender() {
        const result = await cargarUsuarios();
        if (!result.ok) {
            document.getElementById('usr-table-wrap').innerHTML =
                `<div class="usr-error">❌ ${escapeHtml(result.error)}</div>` +
                `<div style="text-align:center;padding:8px"><button class="btn btn-sm btn-primary" onclick="UsuariosManager._onRefresh()">🔄 Reintentar</button></div>`;
            return;
        }
        _renderTabla(_usuarios);
    }

    function _calcInactivityRisk(lastLogin) {
        if (!lastLogin) return { label: 'Nunca', days: 999, cls: 'dc', risk: 'riesgo alto' };
        const now = new Date();
        const then = new Date(lastLogin);
        const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return { label: 'Hoy', days: 0, cls: 'sc', risk: 'sin riesgo' };
        if (diffDays === 1) return { label: '1 día', days: 1, cls: 'sc', risk: 'sin riesgo' };
        if (diffDays <= 3) return { label: diffDays + ' días', days: diffDays, cls: 'sc', risk: 'sin riesgo' };
        if (diffDays <= 7) return { label: diffDays + ' días', days: diffDays, cls: 'wc', risk: 'precaución' };
        return { label: diffDays + ' días', days: diffDays, cls: 'dc', risk: 'riesgo alto' };
    }

    function _formatDate(d) {
        if (!d) return '—';
        try {
            const dt = new Date(d);
            const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
            return dt.getDate() + ' ' + months[dt.getMonth()];
        } catch { return d.slice(0, 10); }
    }

    function _formatTime(d) {
        if (!d) return '';
        try {
            const dt = new Date(d);
            return ('0' + dt.getHours()).slice(-2) + ':' + ('0' + dt.getMinutes()).slice(-2) + ' ' + (dt.getHours() >= 12 ? 'PM' : 'AM');
        } catch { return ''; }
    }

    function _isOnline(lastLogin) {
        if (!lastLogin) return false;
        try {
            return (Date.now() - new Date(lastLogin).getTime()) < 5 * 60 * 1000;
        } catch { return false; }
    }

    function _roleToUcClass(role) {
        return { admin: 'rd', gerente: 'rw', supervisor: 'rw', analista: 'ra', coordinador: 'rw', user: 'ra', readonly: 'ts' }[role] || 'ra';
    }

    function _roleToTagClass(role) {
        return { admin: 'td', gerente: 'tw', supervisor: 'tw', analista: 'ta', coordinador: 'tw', user: 'ts', readonly: 'ta' }[role] || 'ta';
    }

    function _roleIcon(role) {
        return { admin: '🛡️', gerente: '⭐', supervisor: '👁️', analista: '👤', coordinador: '📋', user: '👤', readonly: '👁️' }[role] || '👤';
    }

    function _roleLabel(role) {
        return { admin: 'Admin', user: 'Usuario', supervisor: 'Supervisor', analista: 'Analista', gerente: 'Gerente', coordinador: 'Coordinador', readonly: 'Solo lectura' }[role] || role;
    }

    function _renderTabla(usuarios) {
        const wrap    = document.getElementById('usr-table-wrap');
        const countEl = document.getElementById('usr-count');
        if (!wrap) return;

        if (countEl) countEl.textContent = `${usuarios.length} usuario${usuarios.length !== 1 ? 's' : ''}`;

        if (!usuarios.length) {
            wrap.innerHTML = '<div class="usr-empty">No hay usuarios que coincidan.</div>';
            return;
        }

        const currentUser = Auth.getSession()?.username;
        const nActive = usuarios.filter(u => u.active === 1).length;
        const n2FA = usuarios.filter(u => u.totp_enabled === 1).length;
        const nTotalSessions = usuarios.reduce((s, u) => s + (u.login_count || 0), 0);

        const cards = usuarios.map(u => {
            const isMe    = u.username === currentUser;
            const activo  = u.active === 1;
            const online  = _isOnline(u.last_login);
            
            const nombreCompleto = [u.nombre, u.apellido].filter(Boolean).join(' ') || u.username;
            const iniciales = nombreCompleto.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
            
            const ucClass = _roleToUcClass(u.role);
            const tagRoleClass = _roleToTagClass(u.role);
            const rolLabel = _roleLabel(u.role);
            const roleIcon = _roleIcon(u.role);
            
            const lastLoginFormatted = u.last_login ? _formatDate(u.last_login) : '—';
            const lastTimeFormatted = u.last_login ? _formatTime(u.last_login) : '';
            const inactivity = _calcInactivityRisk(u.last_login);
            
            return `
            <div class="uc ${ucClass}${isMe ? ' me' : ''}${!activo ? ' uc-inactive' : ''}">
                <div class="ch">
                    <div class="avw${online ? ' on' : ''} ${ucClass}"><div class="av ${ucClass}">${iniciales}</div>${online ? '<div class="sdot"></div>' : ''}</div>
                    <div class="um">
                        <div class="unr"><span class="un">${escapeHtml(nombreCompleto)}</span>${isMe ? '<span class="mebg">tú</span>' : ''}</div>
                        <div class="ue">${escapeHtml(u.email || u.username)}</div>
                        <div class="uph">${u.telefono ? '📱 ' + escapeHtml(u.telefono) : '📵 ' + t('users_not_registered')}</div>
                        <div class="tags">
                            <span class="tag ${tagRoleClass}">${roleIcon} ${rolLabel}</span>
                            <span class="tag ${activo ? 'ts' : 'td'}">${activo ? '✅ Activo' : '🔴 Inactivo'}</span>
                            ${u.totp_enabled === 1 ? '<span class="tag tp">🔐 2FA</span>' : '<span class="tag">🔓 Sin 2FA</span>'}
                            ${u.password_temp === 1 ? '<span class="tag tw">🔄 Pendiente cambio</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="cs">
                    <div><div class="sl">Último acceso</div><div class="sv">${escapeHtml(lastLoginFormatted)}</div><div class="ssb">${escapeHtml(lastTimeFormatted)}</div></div>
                    <div><div class="sl">Sesiones</div><div class="sv ac">${u.login_count || 0}</div><div class="ssb">acumuladas</div></div>
                    <div><div class="sl">Inactividad</div><div class="sv ${inactivity.cls}">${inactivity.label}</div><div class="ssb">${inactivity.risk}</div></div>
                </div>
                <div class="ca">
                    <button class="usr-btn-act usr-btn-edit" data-id="${u.id}" data-username="${escapeHtml(u.username)}" data-nombre="${escapeHtml(u.nombre || '')}" data-apellido="${escapeHtml(u.apellido || '')}" data-email="${escapeHtml(u.email || '')}" data-telefono="${escapeHtml(u.telefono || '')}" data-cargo="${escapeHtml(u.cargo || '')}" data-signaturecode="${escapeHtml(u.signature_code || '')}" data-rol="${escapeHtml(u.role)}" title="Editar usuario">✏️ Editar</button>
                    <select class="usr-role-select" data-id="${u.id}" data-current="${escapeHtml(u.role)}" ${isMe ? 'disabled' : ''} title="Cambiar rol">
                        <option value="user"        ${u.role==='user'        ?'selected':''}>👤 Usuario</option>
                        <option value="admin"       ${u.role==='admin'       ?'selected':''}>🛡️ Admin</option>
                        <option value="supervisor"  ${u.role==='supervisor'  ?'selected':''}>👁️ Supervisor</option>
                        <option value="analista"    ${u.role==='analista'    ?'selected':''}>👤 Analista</option>
                        <option value="gerente"     ${u.role==='gerente'     ?'selected':''}>⭐ Gerente</option>
                        <option value="coordinador" ${u.role==='coordinador' ?'selected':''}>📋 Coordinador</option>
                        <option value="readonly"    ${u.role==='readonly'    ?'selected':''}>👁️ Solo lectura</option>
                    </select>
                    <div class="sep"></div>
                    <button class="usr-btn-act" data-username="${escapeHtml(u.username)}" title="Resetear contraseña" ${isMe ? 'disabled' : ''} style="width:28px;justify-content:center">🔑</button>
                    <button class="${u.totp_enabled === 1 ? 'usr-btn-2fa-on' : 'usr-btn-2fa-off'}"
                            data-id="${u.id}" data-username="${escapeHtml(u.username)}" data-enabled="${u.totp_enabled === 1 ? 1 : 0}"
                            title="${u.totp_enabled === 1 ? 'Desactivar 2FA' : 'Activar 2FA'}" ${isMe ? 'disabled' : ''}
                            style="height:28px;border-radius:6px;border:.5px solid;display:flex;align-items:center;gap:3px;cursor:pointer;font-size:11px">
                        ${u.totp_enabled === 1 ? '🔐' : '🔑'}
                    </button>
                    <button class="${activo ? 'usr-btn-deact' : 'usr-btn-react'}"
                            data-id="${u.id}" data-active="${activo ? 0 : 1}"
                            title="${activo ? 'Desactivar' : 'Activar'} usuario"
                            ${isMe ? 'disabled' : ''}
                            style="width:28px;height:28px;border-radius:6px;border:.5px solid;display:flex;align-items:center;justify-content:center;cursor:pointer">
                        ${activo ? '🔒' : '🔓'}
                    </button>
                </div>
            </div>`;
        }).join('');

        wrap.innerHTML = `
            <div class="usr-summary">
                <div class="usr-sum-item"><div class="usr-sum-val">${usuarios.length}</div><div class="usr-sum-lbl">Usuarios totales</div></div>
                <div class="usr-sum-item"><div class="usr-sum-val" style="color:#22c55e">${nActive}</div><div class="usr-sum-lbl">Cuentas activas</div></div>
                <div class="usr-sum-item"><div class="usr-sum-val" style="color:#4dd4ac">${n2FA}</div><div class="usr-sum-lbl">Con 2FA activo</div></div>
                <div class="usr-sum-item"><div class="usr-sum-val">${nTotalSessions}</div><div class="usr-sum-lbl">Sesiones totales</div></div>
            </div>
            <div class="usr-grid">${cards}</div>`;

        // Listeners de acciones
        wrap.querySelectorAll('.usr-role-select').forEach(sel => {
            sel.addEventListener('change', async () => {
                const id      = sel.dataset.id;
                const newRole = sel.value;
                const old     = sel.dataset.current;
                if (newRole === old) return;
                const result = await cambiarRol(id, newRole);
                if (result.ok) {
                    showToast('✅ Rol actualizado correctamente');
                    await _loadAndRender();
                } else {
                    showToast(`❌ ${result.error}`, true);
                    sel.value = old;
                }
            });
        });

        wrap.querySelectorAll('[data-username]').forEach(btn => {
            if (btn.classList.contains('usr-btn-2fa-on') || btn.classList.contains('usr-btn-2fa-off')) return;
            if (btn.classList.contains('usr-btn-deact') || btn.classList.contains('usr-btn-react')) return;
            if (btn.title === 'Resetear contraseña') {
                btn.addEventListener('click', () => {
                    _showResetPasswordModal(btn.dataset.username);
                });
            }
        });

        wrap.querySelectorAll('.usr-btn-deact, .usr-btn-react').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id     = btn.dataset.id;
                const active = parseInt(btn.dataset.active);
                const action = active === 1 ? 'activar' : 'desactivar';
                if (!confirm(`¿Deseas ${action} este usuario?`)) return;
                const result = await toggleUsuario(id, active);
                if (result.ok) {
                    showToast(`✅ Usuario ${action === 'activar' ? 'activado' : 'desactivado'} correctamente`);
                    await _loadAndRender();
                } else {
                    showToast(`❌ ${result.error}`, true);
                }
            });
        });

        wrap.querySelectorAll('[data-enabled]').forEach(btn => {
            const enabled = parseInt(btn.dataset.enabled);
            btn.addEventListener('click', () => {
                if (enabled === 1) _show2faDisableConfirm(btn.dataset.id, btn.dataset.username);
                else _show2faSetupModal(btn.dataset.id, btn.dataset.username);
            });
        });

        wrap.querySelectorAll('.usr-btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                _showEditModal({
                    id: btn.dataset.id, username: btn.dataset.username,
                    nombre: btn.dataset.nombre, apellido: btn.dataset.apellido,
                    email: btn.dataset.email, telefono: btn.dataset.telefono,
                    cargo: btn.dataset.cargo, signatureCode: btn.dataset.signaturecode,
                    role: btn.dataset.rol
                });
            });
        });
    }

    function _showResetPasswordModal(username) {
        // Eliminar modal previo
        document.getElementById('usr-reset-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'usr-reset-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
            <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);" id="usr-reset-overlay"></div>
            <div style="position:relative;background:white;border-radius:16px;padding:24px;max-width:380px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.4);text-align:center;">
                <button id="usr-reset-close" style="position:absolute;top:12px;right:12px;background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
                <div style="font-size:3rem;margin-bottom:12px;">🔑</div>
                <h2 style="margin:0 0 8px 0;color:#1e293b;">Resetear contraseña</h2>
                <p style="margin:0 0 20px 0;color:#64748b;font-size:0.9rem;">Usuario: <strong>${escapeHtml(username)}</strong></p>
                
                <button type="button" id="usr-reset-quick" style="margin-bottom:16px;padding:16px 20px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;border:none;border-radius:12px;cursor:pointer;font-weight:600;width:100%;font-size:1rem;">
                    ⚡ Generar nueva contraseña segura
                </button>
                
                <p style="margin:0;color:#64748b;font-size:0.8rem;">El usuario podrá iniciar sesión con esta contraseña y deberá cambiarla al primer acceso.</p>
                
                <div id="usr-reset-msg" style="display:none;"></div>
                
                <button id="usr-reset-cancel" style="margin-top:20px;padding:12px;border:none;background:none;color:#64748b;font-size:0.9rem;cursor:pointer;width:100%;">Cancelar</button>
            </div>`;

        document.body.appendChild(modal);

        const close = () => document.getElementById('usr-reset-modal')?.remove();

        document.getElementById('usr-reset-close').addEventListener('click', close);
        document.getElementById('usr-reset-cancel').addEventListener('click', close);
        document.getElementById('usr-reset-overlay').addEventListener('click', close);

        document.getElementById('usr-reset-quick').addEventListener('click', async () => {
            var newPwd = _generateSecurePassword();
            const msgEl = document.getElementById('usr-reset-msg');
            const genBtn = document.getElementById('usr-reset-quick');
            const infoP = genBtn.nextElementSibling;

            genBtn.style.display = 'none';
            if (infoP && infoP.tagName === 'P') infoP.style.display = 'none';

            msgEl.style.cssText = 'display:block;margin-top:12px;';
            msgEl.innerHTML = `
                <div style="background:var(--bg-input,#f8fafc);border:2px solid var(--border-color,#e2e8f0);border-radius:10px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:0.75rem;font-weight:600;color:var(--text-secondary,#64748b);margin-bottom:4px;">CONTRASEÑA GENERADA</div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <input type="text" readonly value="${escapeHtml(newPwd)}" id="usr-reset-pwd-display" style="flex:1;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-family:monospace;font-size:0.9rem;background:var(--bg-card,#fff);color:var(--text-primary,#1e293b);">
                        <button id="usr-reset-copy-btn" style="padding:10px 14px;background:var(--bg-input,#e2e8f0);border:none;border-radius:8px;cursor:pointer;font-size:1.1rem;" title="Copiar">📋</button>
                    </div>
                </div>
                <button id="usr-reset-send" style="padding:14px 20px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;border:none;border-radius:12px;cursor:pointer;font-weight:600;width:100%;font-size:1rem;">📤 Enviar contraseña</button>
            `;

            document.getElementById('usr-reset-copy-btn').addEventListener('click', () => {
                const input = document.getElementById('usr-reset-pwd-display');
                input.select();
                navigator.clipboard.writeText(input.value).then(() => {
                    showToast('✅ Contraseña copiada');
                }).catch(() => {
                    document.execCommand('copy');
                    showToast('✅ Contraseña copiada');
                });
            });

            document.getElementById('usr-reset-send').addEventListener('click', async () => {
                const result = await resetPassword(username, newPwd);
                if (result.ok) {
                    close();
                    showToast('✅ Contraseña de "' + username + '" reseteada');
                } else {
                    msgEl.innerHTML = '<div style="color:#dc2626;background:#fef2f2;padding:12px;border-radius:10px;font-size:0.85rem;margin-bottom:12px;">❌ ' + escapeHtml(result.error) + '</div>' + msgEl.innerHTML;
                }
            });
        });
    }

    // ── Modal de edición de usuario ────────
    function _showEditModal(usuario) {
        document.getElementById('usr-edit-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'usr-edit-modal';
        modal.innerHTML = `
            <div class="usr-modal-overlay" id="usr-edit-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;"></div>
            <div class="usr-modal-card" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:10000;max-height:90vh;overflow-y:auto;">
                <button class="usr-modal-close" id="usr-edit-close" style="position:absolute;top:12px;right:12px;background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
                <h2 style="margin:0 0 20px 0;color:#1e293b;">✏️ Editar Usuario</h2>
                
                <form id="usr-edit-form">
                    <div style="display:grid;gap:16px;">
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">👤 USUARIO</label>
                            <input type="text" id="usr-edit-username" value="${escapeHtml(usuario.username)}" disabled style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;background:#f1f5f9;color:#64748b;">
                        </div>
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">🎭 ROL</label>
                            <select id="usr-edit-role" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                                <option value="user"        ${usuario.role==='user'        ?'selected':''}>👤 Usuario</option>
                                <option value="admin"       ${usuario.role==='admin'       ?'selected':''}>🔴 Admin</option>
                                <option value="supervisor"  ${usuario.role==='supervisor'  ?'selected':''}>🟡 Supervisor</option>
                                <option value="analista"    ${usuario.role==='analista'    ?'selected':''}>🔵 Analista</option>
                                <option value="gerente"     ${usuario.role==='gerente'     ?'selected':''}>🟣 Gerente</option>
                                <option value="coordinador" ${usuario.role==='coordinador' ?'selected':''}>🟠 Coordinador</option>
                                <option value="readonly"    ${usuario.role==='readonly'    ?'selected':''}>👁 Solo lectura</option>
                            </select>
                        </div>
                        <hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 0;">
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">👤 NOMBRE</label>
                            <input type="text" id="usr-edit-nombre" value="${escapeHtml(usuario.nombre || '')}" readonly style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;background:#f1f5f9;color:#64748b;cursor:not-allowed;" title="El nombre no puede ser modificado">
                        </div>
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">👤 APELLIDO</label>
                            <input type="text" id="usr-edit-apellido" value="${escapeHtml(usuario.apellido || '')}" readonly style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;background:#f1f5f9;color:#64748b;cursor:not-allowed;" title="El apellido no puede ser modificado">
                        </div>
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">📧 EMAIL</label>
                            <input type="email" id="usr-edit-email" value="${escapeHtml(usuario.email || '')}" placeholder="juan@empresa.com" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                        </div>
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">📱 TELÉFONO</label>
                            <input type="tel" id="usr-edit-telefono" value="${escapeHtml(usuario.telefono || '')}" placeholder="+1234567890" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                        </div>
                        <hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 0;">
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">💼 CARGO</label>
                            <input type="text" id="usr-edit-cargo" value="${escapeHtml(usuario.cargo || '')}" placeholder="Director de Laboratorio" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                        </div>
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">🔑 CÓDIGO DE FIRMA</label>
                            <input type="text" id="usr-edit-signaturecode" value="${escapeHtml(usuario.signatureCode || '')}" placeholder="Ej: ABC-123" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                            <div style="font-size:0.7rem;color:#94a3b8;margin-top:4px;">Código único para firmar reportes electrónicos</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:12px;margin-top:24px;">
                        <button type="button" id="usr-edit-cancel" style="flex:1;padding:14px;border:2px solid #e2e8f0;border-radius:10px;background:#f1f5f9;color:#64748b;font-weight:600;cursor:pointer;">Cancelar</button>
                        <button type="submit" id="usr-edit-save" style="flex:1;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#3046ac,#4338ca);color:white;font-weight:600;cursor:pointer;">✓ Guardar Cambios</button>
                    </div>
                    <div id="usr-edit-msg" style="margin-top:12px;display:none;"></div>
                </form>
            </div>`;

        document.body.appendChild(modal);

        const close = () => document.getElementById('usr-edit-modal')?.remove();

        document.getElementById('usr-edit-close').addEventListener('click', close);
        document.getElementById('usr-edit-cancel').addEventListener('click', close);
        document.getElementById('usr-edit-overlay').addEventListener('click', close);

        document.getElementById('usr-edit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('usr-edit-save');
            btn.textContent = t('loading');
            btn.disabled = true;

            const perfil = {
                email: document.getElementById('usr-edit-email').value.trim(),
                telefono: document.getElementById('usr-edit-telefono').value.trim(),
                cargo: document.getElementById('usr-edit-cargo').value.trim(),
                signatureCode: document.getElementById('usr-edit-signaturecode').value.trim()
            };
            const role = document.getElementById('usr-edit-role').value;

            try {
                const result = await apiPut(`/api/users/${usuario.id}/profile`, { ...perfil, role });
                const msgEl = document.getElementById('usr-edit-msg');

                if (result.ok) {
                    msgEl.textContent = '✅ Usuario actualizado correctamente';
                    msgEl.style.color = '#10b981';
                    msgEl.style.background = '#f0fdf4';
                    msgEl.style.padding = '12px';
                    msgEl.style.borderRadius = '8px';
                    msgEl.style.display = 'block';

                    setTimeout(() => {
                        close();
                        _loadAndRender();
                    }, 1500);
                } else {
                    msgEl.textContent = '❌ ' + (result.error || 'Error al actualizar');
                    msgEl.style.color = '#c53030';
                    msgEl.style.background = '#fff5f5';
                    msgEl.style.padding = '12px';
                    msgEl.style.borderRadius = '8px';
                    msgEl.style.display = 'block';
                    btn.textContent = '✓ Guardar Cambios';
                    btn.disabled = false;
                }
            } catch (err) {
                const msgEl = document.getElementById('usr-edit-msg');
                msgEl.textContent = '❌ Error de conexión';
                msgEl.style.color = '#c53030';
                msgEl.style.display = 'block';
                btn.textContent = '✓ Guardar Cambios';
                btn.disabled = false;
            }
        });
    }

    // ── Función para editar usuario (externa) ───
    async function editarUsuario(id, perfil, role) {
        try {
            const data = await apiPut(`/api/users/${id}/profile`, { ...perfil, role });
            if (!data.ok) return { ok: false, error: data.error };
            return { ok: true };
        } catch {
            return { ok: false, error: t('error_conn') };
        }
    }

    function _attachListeners() {
        // Buscar usuario
        document.getElementById('usr-search')?.addEventListener('input', (e) => {
            const q       = e.target.value.toLowerCase();
            const filtred = _usuarios.filter(u => u.username.toLowerCase().includes(q));
            _renderTabla(filtred);
        });

        // Recargar
        document.getElementById('usr-btn-refresh')?.addEventListener('click', async () => {
            const btn = document.getElementById('usr-btn-refresh');
            if (btn) btn.textContent = '⏳';
            await _loadAndRender();
            if (btn) btn.textContent = '🔄';
        });
    }

    // ========================================
    // MODAL DE CREAR USUARIO (TESTING)
    // ========================================
    async function abrirModalCrearUsuario() {
        document.getElementById('usr-test-modal')?.remove();
        
        const modal = document.createElement('div');
        modal.id = 'usr-test-modal';
        modal.innerHTML = `
            <div class="usr-modal-overlay" onclick="cerrarModalCrearUsuarioTest()" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;"></div>
            <div class="usr-modal-card" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:10000;max-height:90vh;overflow-y:auto;">
                <button class="usr-modal-close" onclick="cerrarModalCrearUsuarioTest()" style="position:absolute;top:12px;right:12px;background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
                <h2 style="margin:0 0 20px 0;color:#1e293b;">➕ Crear Nuevo Usuario</h2>
                
                <form id="usr-form-modal" onsubmit="guardarUsuarioModal(event)">
                    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.8rem;color:#166534;">
                        🔐 Se asignará una <strong>contraseña temporal</strong>. El usuario deberá cambiarla en su primer inicio de sesión.
                    </div>
                    <div style="display:grid;gap:16px;">
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">👤 USUARIO *</label>
                            <input type="text" id="usr-modal-username" required placeholder="usuario123" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                        </div>
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">🎭 ROL *</label>
                            <select id="usr-modal-role" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                                <option value="user">👤 Usuario</option>
                                <option value="admin">🔴 Admin</option>
                                <option value="supervisor">🟡 Supervisor</option>
                                <option value="analista">🔵 Analista</option>
                                <option value="gerente">🟣 Gerente</option>
                                <option value="coordinador">🟠 Coordinador</option>
                                <option value="readonly">👁 Solo lectura</option>
                            </select>
                        </div>
                        <hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 0;">
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">👤 NOMBRE</label>
                            <input type="text" id="usr-modal-nombre" placeholder="Juan" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                        </div>
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">👤 APELLIDO</label>
                            <input type="text" id="usr-modal-apellido" placeholder="Pérez" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                        </div>
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">📧 EMAIL</label>
                            <input type="email" id="usr-modal-email" placeholder="juan@empresa.com" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                        </div>
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">📱 TELÉFONO</label>
                            <input type="tel" id="usr-modal-telefono" placeholder="+1234567890" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                        </div>
                        <hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 0;">
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">💼 CARGO</label>
                            <input type="text" id="usr-modal-cargo" placeholder="Director de Laboratorio" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                        </div>
                        <div>
                            <label style="display:flex;align-items:center;gap:8px;font-size:0.8rem;font-weight:500;color:#475569;cursor:pointer;">
                                <input type="checkbox" id="usr-modal-auto-signature" checked onchange="document.getElementById('usr-modal-signaturecode-wrap').style.display=this.checked?'none':'block'">
                                ☑ Autogenerar código de firma
                            </label>
                            <div id="usr-modal-signaturecode-wrap" style="display:none;margin-top:8px;">
                                <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">🔑 CÓDIGO DE FIRMA</label>
                                <input type="text" id="usr-modal-signaturecode" placeholder="Ej: ABC-123" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                                <div style="font-size:0.7rem;color:#94a3b8;margin-top:4px;">Código único para firmar reportes electrónicos</div>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;gap:12px;margin-top:24px;">
                        <button type="button" onclick="cerrarModalCrearUsuarioTest()" style="flex:1;padding:14px;border:2px solid #e2e8f0;border-radius:10px;background:#f1f5f9;color:#64748b;font-weight:600;cursor:pointer;">Cancelar</button>
                        <button type="submit" style="flex:1;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#3046ac,#4338ca);color:white;font-weight:600;cursor:pointer;">✓ Crear Usuario</button>
                    </div>
                    <div id="usr-modal-msg" style="margin-top:12px;display:none;"></div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    window.cerrarModalCrearUsuarioTest = function() {
        document.getElementById('usr-test-modal')?.remove();
    };
    
    window.guardarUsuarioModal = async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('usr-modal-username').value.trim();
        const role = document.getElementById('usr-modal-role').value;
        const nombre = document.getElementById('usr-modal-nombre').value.trim();
        const apellido = document.getElementById('usr-modal-apellido').value.trim();
        const email = document.getElementById('usr-modal-email').value.trim();
        const telefono = document.getElementById('usr-modal-telefono').value.trim();
        const cargo = document.getElementById('usr-modal-cargo').value.trim();
        const autoSig = document.getElementById('usr-modal-auto-signature').checked;
        const signatureCode = autoSig ? '' : document.getElementById('usr-modal-signaturecode')?.value.trim() || '';
        
        if (!username) {
            const msg = document.getElementById('usr-modal-msg');
            msg.textContent = '❌ Usuario es requerido';
            msg.style.display = 'block';
            msg.style.color = '#c53030';
            return;
        }
        
        try {
            const result = await crearUsuario(username, role, { nombre, apellido, email, telefono, cargo, signatureCode });
            
            const msg = document.getElementById('usr-modal-msg');
            if (result.ok) {
                var sigText = result.signatureCode ? ` | Código firma: <strong>${result.signatureCode}</strong>` : '';
                msg.innerHTML = '✅ Usuario creado.<br><span style="font-size:0.75rem">🔐 Contraseña temporal: <strong>sigma2026</strong>' + sigText + '</span>';
                msg.style.color = '#10b981';
                msg.style.background = '#f0fdf4';
                msg.style.padding = '12px';
                msg.style.borderRadius = '8px';
                msg.style.display = 'block';
                
                setTimeout(() => {
                    cerrarModalCrearUsuarioTest();
                    _loadAndRender();
                }, 1500);
            } else {
                msg.textContent = '❌ ' + (result.error || 'Error al crear');
                msg.style.color = '#c53030';
                msg.style.background = '#fff5f5';
                msg.style.padding = '12px';
                msg.style.borderRadius = '8px';
                msg.style.display = 'block';
            }
        } catch (err) {
            const msg = document.getElementById('usr-modal-msg');
            msg.textContent = '❌ Error de conexión';
            msg.style.color = '#c53030';
            msg.style.display = 'block';
        }
    };

    // ── Modal de activación 2FA ────────────────
    function _show2faSetupModal(userId, username) {
        document.getElementById('usr-2fa-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'usr-2fa-modal';
        modal.innerHTML = `
            <div class="usr-modal-overlay" id="usr-2fa-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;"></div>
            <div class="usr-modal-card" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:16px;padding:24px;max-width:460px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:10000;max-height:90vh;overflow-y:auto;">
                <button class="usr-modal-close" id="usr-2fa-close" style="position:absolute;top:12px;right:12px;background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
                <h2 style="margin:0 0 8px 0;color:#1e293b;">🔐 Activar 2FA</h2>
                <p style="margin:0 0 16px 0;color:#64748b;font-size:0.9rem;">Usuario: <strong>${escapeHtml(username)}</strong></p>
                <div id="usr-2fa-loading" style="text-align:center;padding:20px;color:#64748b;">Generando código QR...</div>
                <div id="usr-2fa-content" style="display:none;">
                    <div class="usr-2fa-modal-qr" id="usr-2fa-qr"></div>
                    <p style="font-size:0.85rem;color:#64748b;text-align:center;margin:8px 0;">O ingresa este secreto manualmente en tu app autenticadora:</p>
                    <div class="usr-2fa-modal-secret" id="usr-2fa-secret"></div>
                    <div style="margin-top:16px;">
                        <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">CÓDIGO DE VERIFICACIÓN</label>
                        <input type="text" id="usr-2fa-totp" maxlength="6" placeholder="000000" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:1.2rem;text-align:center;letter-spacing:6px;font-weight:700;box-sizing:border-box;">
                    </div>
                    <div id="usr-2fa-msg" style="margin-top:8px;display:none;"></div>
                    <div style="display:flex;gap:12px;margin-top:16px;">
                        <button type="button" id="usr-2fa-cancel" style="flex:1;padding:14px;border:2px solid #e2e8f0;border-radius:10px;background:#f1f5f9;color:#64748b;font-weight:600;cursor:pointer;">Cancelar</button>
                        <button type="button" id="usr-2fa-activate" style="flex:1;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#059669,#10b981);color:white;font-weight:600;cursor:pointer;">✓ Activar 2FA</button>
                    </div>
                </div>
            </div>`;

        document.body.appendChild(modal);

        const close = () => document.getElementById('usr-2fa-modal')?.remove();
        document.getElementById('usr-2fa-close').addEventListener('click', close);
        document.getElementById('usr-2fa-cancel').addEventListener('click', close);
        document.getElementById('usr-2fa-overlay').addEventListener('click', close);

        // Cargar QR
        (async () => {
            try {
                const data = await apiPost(`/api/users/${userId}/2fa/setup`, {});
                if (!data.ok) throw new Error(data.error || 'Error al generar QR');
                document.getElementById('usr-2fa-loading').style.display = 'none';
                const content = document.getElementById('usr-2fa-content');
                content.style.display = 'block';
                document.getElementById('usr-2fa-qr').innerHTML = `<img src="${data.qr}" alt="QR 2FA">`;
                document.getElementById('usr-2fa-secret').textContent = data.secret;
            } catch (err) {
                document.getElementById('usr-2fa-loading').innerHTML =
                    `<div style="color:#dc2626;">❌ ${escapeHtml(err.message)}</div>`;
            }
        })();

        document.getElementById('usr-2fa-activate').addEventListener('click', async () => {
            const totp = document.getElementById('usr-2fa-totp').value.trim();
            if (!totp || totp.length !== 6) {
                const msg = document.getElementById('usr-2fa-msg');
                msg.textContent = '❌ Ingresa el código de 6 dígitos';
                msg.style.display = 'block';
                msg.style.color = '#dc2626';
                return;
            }
            const btn = document.getElementById('usr-2fa-activate');
            btn.disabled = true;
            btn.textContent = '⏳ Verificando...';
            try {
                const result = await apiPost(`/api/users/${userId}/2fa/enable`, { token: totp });
                const msg = document.getElementById('usr-2fa-msg');
                if (result.ok) {
                    msg.textContent = '✅ 2FA activado correctamente';
                    msg.style.color = '#10b981';
                    msg.style.background = '#f0fdf4';
                    msg.style.padding = '8px';
                    msg.style.borderRadius = '6px';
                    msg.style.display = 'block';
                    setTimeout(() => { close(); _loadAndRender(); }, 1500);
                } else {
                    msg.textContent = '❌ ' + (result.error || 'Error');
                    msg.style.color = '#dc2626';
                    msg.style.display = 'block';
                    btn.disabled = false;
                    btn.textContent = '✓ Activar 2FA';
                }
            } catch (err) {
                const msg = document.getElementById('usr-2fa-msg');
                msg.textContent = '❌ Error de conexión';
                msg.style.color = '#dc2626';
                msg.style.display = 'block';
                btn.disabled = false;
                btn.textContent = '✓ Activar 2FA';
            }
        });
    }

    // ── Confirmación para desactivar 2FA ────────
    function _show2faDisableConfirm(userId, username) {
        document.getElementById('usr-2fa-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'usr-2fa-modal';
        modal.innerHTML = `
            <div class="usr-modal-overlay" id="usr-2fa-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;"></div>
            <div class="usr-modal-card" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:16px;padding:24px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:10000;">
                <button class="usr-modal-close" id="usr-2fa-close" style="position:absolute;top:12px;right:12px;background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
                <div style="text-align:center;font-size:3rem;margin-bottom:12px;">🔓</div>
                <h2 style="margin:0 0 8px 0;color:#1e293b;text-align:center;">Desactivar 2FA</h2>
                <p style="margin:0 0 20px 0;color:#64748b;font-size:0.9rem;text-align:center;">
                    ¿Estás seguro de desactivar la autenticación de dos factores para <strong>${escapeHtml(username)}</strong>?
                </p>
                <div id="usr-2fa-msg" style="display:none;"></div>
                <div style="display:flex;gap:12px;">
                    <button type="button" id="usr-2fa-cancel" style="flex:1;padding:14px;border:2px solid #e2e8f0;border-radius:10px;background:#f1f5f9;color:#64748b;font-weight:600;cursor:pointer;">Cancelar</button>
                    <button type="button" id="usr-2fa-disable-btn" style="flex:1;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#dc2626,#ef4444);color:white;font-weight:600;cursor:pointer;">✓ Desactivar</button>
                </div>
            </div>`;

        document.body.appendChild(modal);

        const close = () => document.getElementById('usr-2fa-modal')?.remove();
        document.getElementById('usr-2fa-close').addEventListener('click', close);
        document.getElementById('usr-2fa-cancel').addEventListener('click', close);
        document.getElementById('usr-2fa-overlay').addEventListener('click', close);

        document.getElementById('usr-2fa-disable-btn').addEventListener('click', async () => {
            const btn = document.getElementById('usr-2fa-disable-btn');
            btn.disabled = true;
            btn.textContent = '⏳ Desactivando...';
            try {
                const result = await apiPost(`/api/users/${userId}/2fa/disable`, {});
                const msg = document.getElementById('usr-2fa-msg');
                if (result.ok) {
                    msg.textContent = '✅ 2FA desactivado correctamente';
                    msg.style.color = '#10b981';
                    msg.style.background = '#f0fdf4';
                    msg.style.padding = '8px';
                    msg.style.borderRadius = '6px';
                    msg.style.display = 'block';
                    setTimeout(() => { close(); _loadAndRender(); }, 1500);
                } else {
                    msg.textContent = '❌ ' + (result.error || 'Error');
                    msg.style.color = '#dc2626';
                    msg.style.display = 'block';
                    btn.disabled = false;
                    btn.textContent = '✓ Desactivar';
                }
            } catch (err) {
                const msg = document.getElementById('usr-2fa-msg');
                msg.textContent = '❌ Error de conexión';
                msg.style.color = '#dc2626';
                msg.style.display = 'block';
                btn.disabled = false;
                btn.textContent = '✓ Desactivar';
            }
        });
    }

    function _onRefresh() {
        _loadAndRender();
    }

return { init, buildView, abrirModalCrearUsuario, guardarUsuarioModal, cerrarModalCrearUsuarioTest, _onRefresh };
})();

// ========================================
// HELPER: Color de avatar basado en nombre
// ========================================
function _getAvatarColor(nombre) {
    if (!nombre) return 'linear-gradient(135deg, #3046ac, #6366f1)';
    const firstChar = nombre[0].toUpperCase();
    const colors = {
        'A': 'linear-gradient(135deg, #dc2626, #ef4444)',  // Rojo
        'B': 'linear-gradient(135deg, #ea580c, #f97316)', // Naranja
        'C': 'linear-gradient(135deg, #ca8a04, #eab308)', // Amarillo
        'D': 'linear-gradient(135deg, #16a34a, #22c55e)', // Verde
        'E': 'linear-gradient(135deg, #059669, #10b981)', // Verde esmeralda
        'F': 'linear-gradient(135deg, #0891b2, #06b6d4)', // Cyan
        'G': 'linear-gradient(135deg, #2563eb, #3b82f6)', // Azul
        'H': 'linear-gradient(135deg, #4338ca, #6366f1)', // Indigo
        'I': 'linear-gradient(135deg, #7c3aed, #8b5cf6)', // Violeta
        'J': 'linear-gradient(135deg, #db2777, #ec4899)', // Rosa
        'K': 'linear-gradient(135deg, #be185d, #db2777)', // Rosa oscuro
        'L': 'linear-gradient(135deg, #9333ea, #a855f7)', // Púrpura
        'M': 'linear-gradient(135deg, #dc2626, #ef4444)', // Rojo
        'N': 'linear-gradient(135deg, #ea580c, #f97316)', // Naranja
        'O': 'linear-gradient(135deg, #ca8a04, #eab308)', // Amarillo
        'P': 'linear-gradient(135deg, #16a34a, #22c55e)', // Verde
        'Q': 'linear-gradient(135deg, #0891b2, #06b6d4)', // Cyan
        'R': 'linear-gradient(135deg, #2563eb, #3b82f6)', // Azul
        'S': 'linear-gradient(135deg, #4338ca, #6366f1)', // Indigo
        'T': 'linear-gradient(135deg, #7c3aed, #8b5cf6)', // Violeta
        'U': 'linear-gradient(135deg, #059669, #10b981)', // Verde
        'V': 'linear-gradient(135deg, #be185d, #db2777)', // Rosa
        'W': 'linear-gradient(135deg, #9333ea, #a855f7)', // Púrpura
        'X': 'linear-gradient(135deg, #dc2626, #ef4444)', // Rojo
        'Y': 'linear-gradient(135deg, #ea580c, #f97316)', // Naranja
        'Z': 'linear-gradient(135deg, #9333ea, #a855f7)'  // Púrpura
    };
    return colors[firstChar] || 'linear-gradient(135deg, #3046ac, #6366f1)';
}

// Exponer funciones al window para que funcionen los onclick
window.abrirModalCrearUsuario = UsuariosManager.abrirModalCrearUsuario;
window.guardarUsuarioModal = UsuariosManager.guardarUsuarioModal;
window.cerrarModalCrearUsuarioTest = UsuariosManager.cerrarModalCrearUsuarioTest;

console.log('✅ UsuariosManager cargado');