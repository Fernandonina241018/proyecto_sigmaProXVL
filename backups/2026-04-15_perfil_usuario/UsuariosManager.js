// ========================================
// UsuariosManager.js — StatAnalyzer Pro
// Gestión de usuarios — Solo Admin
// ========================================

const UsuariosManager = (() => {

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
        const res = await fetch(`${_apiUrl}${path}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
            credentials: 'include'
        });
        return res.json();
    }

    async function apiPost(path, body) {
        const res = await fetch(`${_apiUrl}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(body),
            credentials: 'include'
        });
        return res.json();
    }

    async function apiPut(path, body) {
        const res = await fetch(`${_apiUrl}${path}`, {
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
    async function crearUsuario(username, password, role) {
        try {
            const data = await apiPost('/api/users', { username, password, role });
            if (!data.ok) return { ok: false, error: data.error };
            return { ok: true };
        } catch {
            return { ok: false, error: 'Error de conexión' };
        }
    }

    // ── Toggle activo/inactivo ────────────
    async function toggleUsuario(id, active) {
        try {
            const data = await apiPut(`/api/users/${id}/toggle`, { active });
            if (!data.ok) return { ok: false, error: data.error };
            return { ok: true };
        } catch {
            return { ok: false, error: 'Error de conexión' };
        }
    }

    // ── Cambiar contraseña (admin reset) ──
    async function resetPassword(username, newPassword) {
        // Usamos el endpoint de cambio de contraseña con una contraseña temporal
        // El admin puede resetear usando un endpoint especial
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
            return { ok: false, error: 'Error de conexión' };
        }
    }

    // ── Cambiar rol ───────────────────────
    async function cambiarRol(id, role) {
        try {
            const data = await apiPut(`/api/users/${id}/role`, { role });
            if (!data.ok) return { ok: false, error: data.error };
            return { ok: true };
        } catch {
            return { ok: false, error: 'Error de conexión' };
        }
    }

    // ── Construir vista ───────────────────
    function buildView() {
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

            <!-- Formulario crear usuario -->
            <div class="usr-create-card">
                <div class="usr-create-header">
                    <span class="usr-create-title">➕ Crear nuevo usuario</span>
                    <button class="usr-toggle-form" id="usr-toggle-form">▲ Ocultar</button>
                </div>
                <div class="usr-create-form" id="usr-create-form">
                    <div class="usr-form-grid">
                        <div class="usr-field">
                            <label>👤 Nombre de usuario</label>
                            <input id="usr-new-username" type="text" placeholder="usuario123" autocomplete="off">
                        </div>
                        <div class="usr-field">
                            <label>🔒 Contraseña</label>
                            <div class="usr-pass-wrap">
                                <input id="usr-new-password" type="password" placeholder="Mín. 8 caracteres" autocomplete="new-password">
                                <button class="usr-eye-btn" id="usr-eye" type="button">👁</button>
                            </div>
                        </div>
                        <div class="usr-field">
                            <label>🎭 Rol</label>
                            <select id="usr-new-role">
                                <option value="user">👤 Usuario</option>
                                <option value="admin">🔴 Admin</option>
                                <option value="supervisor">🟡 Supervisor</option>
                                <option value="analista">🔵 Analista</option>
                                <option value="gerente">🟣 Gerente</option>
                                <option value="coordinador">🟠 Coordinador</option>
                                <option value="readonly">👁 Solo lectura</option>
                            </select>
                        </div>
                        <div class="usr-field usr-field-btn">
                            <label style="opacity:0">—</label>
                            <button class="usr-btn-create" id="usr-btn-create">✓ Crear usuario</button>
                        </div>
                    </div>
                    <div class="usr-form-msg" id="usr-form-msg" style="display:none"></div>
                </div>
            </div>

            <!-- Barra de búsqueda + contador -->
            <div class="usr-toolbar">
                <input class="usr-search" id="usr-search" type="text" placeholder="🔍 Buscar usuario...">
                <div class="usr-count" id="usr-count">—</div>
                <button class="usr-btn-refresh" id="usr-btn-refresh" title="Recargar">🔄</button>
            </div>

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
                `<div class="usr-error">❌ ${escapeHtml(result.error)}</div>`;
            return;
        }
        _renderTabla(_usuarios);
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

        const rows = usuarios.map(u => {
            const isMe    = u.username === currentUser;
            const activo  = u.active === 1;
            //const rolLabel = { admin: '🔴 Admin', user: '👤 Usuario', readonly: '👁 Solo lectura' }[u.role] || u.role;
            //const rolClass = { admin: 'usr-role-admin', user: 'usr-role-user', readonly: 'usr-role-readonly' }[u.role] || '';
            const rolLabel = {
                admin:        '🔴 Admin',
                user:         '👤 Usuario',
                supervisor:   '🟡 Supervisor',
                analista:     '🔵 Analista',
                gerente:      '🟣 Gerente',
                coordinador:  '🟠 Coordinador',
                readonly:     '👁 Solo lectura'
            }[u.role] || u.role;

            const rolClass = {
                admin:        'usr-role-admin',
                user:         'usr-role-user',
                supervisor:   'usr-role-supervisor',
                analista:     'usr-role-analista',
                gerente:      'usr-role-gerente',
                coordinador:  'usr-role-coordinador',
                readonly:     'usr-role-readonly'
            }[u.role] || '';

            return `
            <tr class="${!activo ? 'usr-row-inactive' : ''}">
                <td><strong>${escapeHtml(u.username)}</strong>${isMe ? ' <span class="usr-me-badge">Tú</span>' : ''}</td>
                <td><span class="usr-role-badge ${rolClass}">${rolLabel}</span></td>
                <td>
                    <span class="usr-status-badge ${activo ? 'usr-status-ok' : 'usr-status-off'}">
                        ${activo ? '✓ Activo' : '✕ Inactivo'}
                    </span>
                </td>
                <td class="usr-td-date">${fmtDate(u.last_login)}</td>
                <td class="usr-td-date">${fmtDate(u.created_at)}</td>
                <td class="usr-td-logins">${u.login_count || 0}</td>
                <td class="usr-td-actions">
                    <!-- Cambiar rol -->
                    <select class="usr-role-select" data-id="${u.id}" data-current="${u.role}" ${isMe ? 'disabled' : ''} title="Cambiar rol">
                        <option value="user"        ${u.role==='user'        ?'selected':''}>👤 Usuario</option>
                        <option value="admin"       ${u.role==='admin'       ?'selected':''}>🔴 Admin</option>
                        <option value="supervisor"  ${u.role==='supervisor'  ?'selected':''}>🟡 Supervisor</option>
                        <option value="analista"    ${u.role==='analista'    ?'selected':''}>🔵 Analista</option>
                        <option value="gerente"     ${u.role==='gerente'     ?'selected':''}>🟣 Gerente</option>
                        <option value="coordinador" ${u.role==='coordinador' ?'selected':''}>🟠 Coordinador</option>
                        <option value="readonly"    ${u.role==='readonly'    ?'selected':''}>👁 Solo lectura</option>
                    </select>
                    <!-- Reset password -->
                    <button class="usr-btn-action usr-btn-pass" data-username="${escapeHtml(u.username)}" title="Resetear contraseña" ${isMe ? 'disabled' : ''}>
                        🔑
                    </button>
                    <!-- Toggle activo -->
                    <button class="usr-btn-action ${activo ? 'usr-btn-deactivate' : 'usr-btn-activate'}"
                            data-id="${u.id}" data-active="${activo ? 0 : 1}"
                            title="${activo ? 'Desactivar' : 'Activar'} usuario"
                            ${isMe ? 'disabled' : ''}>
                        ${activo ? '🔒' : '🔓'}
                    </button>
                </td>
            </tr>`;
        }).join('');

        wrap.innerHTML = `
        <table class="usr-table">
            <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Último acceso</th>
                    <th>Creado</th>
                    <th>Logins</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;

        // Listeners de acciones en la tabla
        wrap.querySelectorAll('.usr-role-select').forEach(sel => {
            sel.addEventListener('change', async () => {
                const id      = sel.dataset.id;
                const newRole = sel.value;
                const old     = sel.dataset.current;
                if (newRole === old) return;

                const result = await cambiarRol(id, newRole);
                if (result.ok) {
                    _showToast('✅ Rol actualizado correctamente');
                    await _loadAndRender();
                } else {
                    _showToast(`❌ ${result.error}`, true);
                    sel.value = old;
                }
            });
        });

        wrap.querySelectorAll('.usr-btn-pass').forEach(btn => {
            btn.addEventListener('click', () => {
                const username = btn.dataset.username;
                _showResetPasswordModal(username);
            });
        });

        wrap.querySelectorAll('.usr-btn-deactivate, .usr-btn-activate').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id     = btn.dataset.id;
                const active = parseInt(btn.dataset.active);
                const action = active === 1 ? 'activar' : 'desactivar';

                if (!confirm(`¿Deseas ${action} este usuario?`)) return;

                const result = await toggleUsuario(id, active);
                if (result.ok) {
                    _showToast(`✅ Usuario ${action === 'activar' ? 'activado' : 'desactivado'} correctamente`);
                    await _loadAndRender();
                } else {
                    _showToast(`❌ ${result.error}`, true);
                }
            });
        });
    }

    function _showResetPasswordModal(username) {
        // Eliminar modal previo
        document.getElementById('usr-reset-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'usr-reset-modal';
        modal.innerHTML = `
        <div class="usr-modal-overlay" id="usr-modal-overlay"></div>
        <div class="usr-modal-card">
            <div class="usr-modal-header">
                <h3>🔑 Resetear contraseña</h3>
                <button class="usr-modal-close" id="usr-modal-close">✕</button>
            </div>
            <div class="usr-modal-body">
                <p>Usuario: <strong>${escapeHtml(username)}</strong></p>
                <div class="usr-field" style="margin-top:16px">
                    <label>Nueva contraseña (mín. 8 caracteres)</label>
                    <div class="usr-pass-wrap">
                        <input id="usr-reset-pass" type="password" placeholder="Nueva contraseña" autocomplete="new-password">
                        <button class="usr-eye-btn" id="usr-reset-eye" type="button">👁</button>
                    </div>
                </div>
                <div class="usr-modal-msg" id="usr-modal-msg" style="display:none"></div>
            </div>
            <div class="usr-modal-footer">
                <button class="usr-btn-cancel" id="usr-modal-cancel">Cancelar</button>
                <button class="usr-btn-confirm" id="usr-modal-confirm">✓ Confirmar reset</button>
            </div>
        </div>`;

        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('usr-modal-visible'));

        const close = () => {
            modal.classList.remove('usr-modal-visible');
            setTimeout(() => modal.remove(), 250);
        };

        document.getElementById('usr-modal-close').addEventListener('click', close);
        document.getElementById('usr-modal-cancel').addEventListener('click', close);
        document.getElementById('usr-modal-overlay').addEventListener('click', close);

        // Toggle ojo
        document.getElementById('usr-reset-eye').addEventListener('click', () => {
            const inp = document.getElementById('usr-reset-pass');
            inp.type = inp.type === 'password' ? 'text' : 'password';
        });

        document.getElementById('usr-modal-confirm').addEventListener('click', async () => {
            const newPass = document.getElementById('usr-reset-pass').value;
            const msgEl   = document.getElementById('usr-modal-msg');

            if (!newPass || newPass.length < 8) {
                msgEl.textContent    = '⚠️ La contraseña debe tener al menos 8 caracteres.';
                msgEl.style.cssText  = 'display:block;color:#c53030;background:#fff5f5;padding:10px;border-radius:8px;margin-top:12px;font-size:0.85rem;';
                return;
            }

            const result = await resetPassword(username, newPass);
            if (result.ok) {
                close();
                _showToast(`✅ Contraseña de "${username}" reseteada correctamente`);
            } else {
                msgEl.textContent   = `❌ ${result.error}`;
                msgEl.style.cssText = 'display:block;color:#c53030;background:#fff5f5;padding:10px;border-radius:8px;margin-top:12px;font-size:0.85rem;';
            }
        });
    }

    function _showToast(msg, isError = false) {
        showToast(msg, isError);
    }

    function _attachListeners() {
        // Toggle formulario
        document.getElementById('usr-toggle-form')?.addEventListener('click', () => {
            const form = document.getElementById('usr-create-form');
            const btn  = document.getElementById('usr-toggle-form');
            const open = form.style.display !== 'none';
            form.style.display = open ? 'none' : 'block';
            btn.textContent    = open ? '▼ Mostrar' : '▲ Ocultar';
        });

        // Toggle ojo contraseña
        document.getElementById('usr-eye')?.addEventListener('click', () => {
            const inp = document.getElementById('usr-new-password');
            inp.type = inp.type === 'password' ? 'text' : 'password';
        });

        // Crear usuario
        document.getElementById('usr-btn-create')?.addEventListener('click', async () => {
            const username = document.getElementById('usr-new-username')?.value.trim();
            const password = document.getElementById('usr-new-password')?.value;
            const role     = document.getElementById('usr-new-role')?.value;
            const msgEl    = document.getElementById('usr-form-msg');

            if (!username || !password) {
                msgEl.textContent   = '⚠️ Completa usuario y contraseña.';
                msgEl.style.cssText = 'display:block;color:#c53030;background:#fff5f5;padding:10px;border-radius:8px;font-size:0.85rem;';
                return;
            }
            if (password.length < 8) {
                msgEl.textContent   = '⚠️ La contraseña debe tener al menos 8 caracteres.';
                msgEl.style.cssText = 'display:block;color:#c53030;background:#fff5f5;padding:10px;border-radius:8px;font-size:0.85rem;';
                return;
            }

            const btn = document.getElementById('usr-btn-create');
            btn.textContent = 'Creando...';
            btn.disabled    = true;

            const result = await crearUsuario(username, password, role);

            btn.textContent = '✓ Crear usuario';
            btn.disabled    = false;

            if (result.ok) {
                msgEl.textContent   = `✅ Usuario "${username}" creado correctamente.`;
                msgEl.style.cssText = 'display:block;color:#276749;background:#f0fff4;padding:10px;border-radius:8px;font-size:0.85rem;';
                document.getElementById('usr-new-username').value = '';
                document.getElementById('usr-new-password').value = '';
                document.getElementById('usr-new-role').value     = 'user';
                await _loadAndRender();
            } else {
                msgEl.textContent   = `❌ ${result.error}`;
                msgEl.style.cssText = 'display:block;color:#c53030;background:#fff5f5;padding:10px;border-radius:8px;font-size:0.85rem;';
            }
        });

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

    return { init, buildView };

})();

console.log('✅ UsuariosManager cargado');