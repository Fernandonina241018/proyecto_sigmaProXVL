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
    async function crearUsuario(username, password, role, perfil = {}) {
        try {
            const data = await apiPost('/api/users', { 
                username, 
                password, 
                role,
                nombre: perfil.nombre,
                apellido: perfil.apellido,
                email: perfil.email,
                telefono: perfil.telefono
            });
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
        // Agregar estilos si no existen
        if (!document.getElementById('usr-card-styles')) {
            const styles = `
                .usr-cards-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; padding: 4px; }
                .usr-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s; border: 2px solid transparent; }
                .usr-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateY(-2px); }
                .usr-card-inactive { opacity: 0.65; }
                .usr-card-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
                .usr-card-avatar { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem; flex-shrink: 0; }
                .usr-card-info { flex: 1; min-width: 0; }
                .usr-card-nombre { font-size: 1.05rem; font-weight: 600; color: #1e293b; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .usr-card-email { font-size: 0.85rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .usr-card-phone { font-size: 0.8rem; color: #64748b; margin-top: 4px; }
                .usr-card-me { background: #3046ac; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 6px; }
                .usr-card-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
                .usr-card-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
                .usr-card-rol-admin { background: #fef2f2; color: #dc2626; }
                .usr-card-rol-gerente { background: #faf5ff; color: #9333ea; }
                .usr-card-rol-analista { background: #eff6ff; color: #2563eb; }
                .usr-card-rol-supervisor { background: #fefce8; color: #ca8a04; }
                .usr-card-rol-coordinador { background: #fff7ed; color: #ea580c; }
                .usr-card-rol-usuario { background: #f0fdf4; color: #16a34a; }
                .usr-card-rol-readonly { background: #f8fafc; color: #64748b; }
                .usr-card-estado-activo { background: #f0fdf4; color: #16a34a; }
                .usr-card-estado-inactivo { background: #fef2f2; color: #dc2626; }
                .usr-card-meta { display: flex; gap: 16px; font-size: 0.8rem; color: #64748b; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #e2e8f0; }
                .usr-card-meta-item { display: flex; align-items: center; gap: 4px; }
                .usr-card-actions { display: flex; gap: 8px; }
                .usr-card-actions select { flex: 1; padding: 8px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.8rem; background: #f8fafc; }
                .usr-card-actions button { padding: 8px 12px; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
                .usr-btn-pass { background: #f1f5f9; color: #475569; }
                .usr-btn-pass:hover { background: #e2e8f0; }
                .usr-btn-deactivate { background: #fef2f2; color: #dc2626; }
                .usr-btn-deactivate:hover { background: #dc2626; color: white; }
                .usr-btn-activate { background: #f0fdf4; color: #16a34a; }
                .usr-btn-activate:hover { background: #16a34a; color: white; }
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

            <!-- Formulario crear usuario -->
            <div class="usr-create-card">
                <div class="usr-create-header">
                    <span class="usr-create-title">➕ Crear nuevo usuario</span>
                    <button class="usr-toggle-form" id="usr-toggle-form">▲ Ocultar</button>
                </div>
                <div class="usr-create-form" id="usr-create-form">
                    <!-- BOTÓN PARA ABRIR MODAL DE CREAR USUARIO -->
                    <button class="usr-btn-create" id="usr-btn-create" onclick="abrirModalCrearUsuario()" style="background:#10b981;color:white;padding:12px 24px;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:1rem;width:100%;">
                        ➕ Créar Nuevo Usuario
                    </button>
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

        const cards = usuarios.map(u => {
            const isMe    = u.username === currentUser;
            const activo  = u.active === 1;
            
            // Nombre completo
            const nombreCompleto = [u.nombre, u.apellido].filter(Boolean).join(' ') || u.username;
            const iniciales = nombreCompleto.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
            
            // Labels
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
                admin:        'usr-card-rol-admin',
                user:         'usr-card-rol-usuario',
                supervisor:   'usr-card-rol-supervisor',
                analista:     'usr-card-rol-analista',
                gerente:      'usr-card-rol-gerente',
                coordinador:  'usr-card-rol-coordinador',
                readonly:     'usr-card-rol-readonly'
            }[u.role] || 'usr-card-rol-usuario';
            
            // Estado
            const estadoClass = activo ? 'usr-card-estado-activo' : 'usr-card-estado-inactivo';
            const estadoLabel = activo ? '✓ Activo' : '✕ Inactivo';
            
            // Fecha formateada
            const lastLogin = u.last_login ? ((typeof fmtDate === 'function') ? fmtDate(u.last_login) : u.last_login.slice(0, 16).replace('T', ' ')) : 'Nunca';
            
            // Avatar color based on first letter
            const firstLetter = nombreCompleto[0].toUpperCase();
            const avatarColor = _getAvatarColor(nombreCompleto);
            
            return `
            <div class="usr-card ${!activo ? 'usr-card-inactive' : ''}">
                <div class="usr-card-header">
                    <div class="usr-card-avatar" style="background: ${avatarColor}">${iniciales}</div>
                    <div class="usr-card-info">
                        <div class="usr-card-nombre">${escapeHtml(nombreCompleto)}${isMe ? ' <span class="usr-card-me">Tú</span>' : ''}</div>
                        <div class="usr-card-email">${u.email || '-'}</div>
                        <div class="usr-card-phone">📱 ${u.telefono || 'No registrado'}</div>
                    </div>
                </div>
                <div class="usr-card-badges">
                    <span class="usr-card-badge ${rolClass}">${rolLabel}</span>
                    <span class="usr-card-badge ${estadoClass}">${estadoLabel}</span>
                </div>
                <div class="usr-card-meta">
                    <span class="usr-card-meta-item">🕐 ${lastLogin}</span>
                    <span class="usr-card-meta-item">🔑 ${u.login_count || 0} logins</span>
                </div>
                <div class="usr-card-actions">
                    <select class="usr-role-select" data-id="${u.id}" data-current="${u.role}" ${isMe ? 'disabled' : ''} title="Cambiar rol">
                        <option value="user"        ${u.role==='user'        ?'selected':''}>👤 Usuario</option>
                        <option value="admin"       ${u.role==='admin'       ?'selected':''}>🔴 Admin</option>
                        <option value="supervisor"  ${u.role==='supervisor'  ?'selected':''}>🟡 Supervisor</option>
                        <option value="analista"    ${u.role==='analista'    ?'selected':''}>🔵 Analista</option>
                        <option value="gerente"     ${u.role==='gerente'     ?'selected':''}>🟣 Gerente</option>
                        <option value="coordinador" ${u.role==='coordinador' ?'selected':''}>🟠 Coordinador</option>
                        <option value="readonly"    ${u.role==='readonly'    ?'selected':''}>👁 Solo lectura</option>
                    </select>
                    <button class="usr-btn-pass" data-username="${escapeHtml(u.username)}" title="Resetear contraseña" ${isMe ? 'disabled' : ''}>🔑</button>
                    <button class="${activo ? 'usr-btn-deactivate' : 'usr-btn-activate'}"
                            data-id="${u.id}" data-active="${activo ? 0 : 1}"
                            title="${activo ? 'Desactivar' : 'Activar'} usuario"
                            ${isMe ? 'disabled' : ''}>
                        ${activo ? '🔒' : '🔓'}
                    </button>
                </div>
            </div>`;
        }).join('');

        wrap.innerHTML = `<div class="usr-cards-container">${cards}</div>`;

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
                    <div style="display:grid;gap:16px;">
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">👤 USUARIO *</label>
                            <input type="text" id="usr-modal-username" required placeholder="usuario123" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
                        </div>
                        <div>
                            <label style="display:block;font-size:0.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">🔐 CONTRASEÑA *</label>
                            <input type="password" id="usr-modal-password" required placeholder="Mín. 8 caracteres" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:0.9rem;">
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
        const password = document.getElementById('usr-modal-password').value.trim();
        const role = document.getElementById('usr-modal-role').value;
        const nombre = document.getElementById('usr-modal-nombre').value.trim();
        const apellido = document.getElementById('usr-modal-apellido').value.trim();
        const email = document.getElementById('usr-modal-email').value.trim();
        const telefono = document.getElementById('usr-modal-telefono').value.trim();
        
        if (!username || !password) {
            const msg = document.getElementById('usr-modal-msg');
            msg.textContent = '❌ Usuario y contraseña son requeridos';
            msg.style.display = 'block';
            msg.style.color = '#c53030';
            return;
        }
        
        try {
            const result = await crearUsuario(username, password, role, { nombre, apellido, email, telefono });
            
            const msg = document.getElementById('usr-modal-msg');
            if (result.ok) {
                msg.textContent = '✅ Usuario creado correctamente';
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

return { init, buildView, abrirModalCrearUsuario, guardarUsuarioModal, cerrarModalCrearUsuarioTest };
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