// ========================================
// PermisosManager.js — StatAnalyzer Pro
// Control de acceso basado en roles (RBAC)
// Matriz de permisos centralizada
// ========================================

const PermisosManager = (() => {

    // ── Matriz de permisos ────────────────
    const PERMISOS = {
        // Datos
        'importar_datos':       ['admin','gerente','supervisor','analista','coordinador','user'],
        'editar_datos':         ['admin','gerente','supervisor','analista','coordinador'],
        'ver_datos':            ['admin','gerente','supervisor','analista','coordinador','user','readonly'],

        // Análisis
        'ejecutar_analisis':    ['admin','gerente','supervisor','analista'],
        'ver_resultados':       ['admin','gerente','supervisor','analista','coordinador','user','readonly'],
        'usar_trabajo':         ['admin','gerente','supervisor','analista','coordinador'],

        // Reportes y visualización
        'exportar_reportes':    ['admin','gerente','supervisor','analista'],
        'usar_visualizacion':   ['admin','gerente','supervisor','analista','coordinador','user','readonly'],

        // Administración
        'ver_auditoria':        ['admin','gerente','supervisor'],
        'gestionar_usuarios':   ['admin'],
    };

    // ── Mensajes de acceso denegado ───────
    const MENSAJES = {
        'importar_datos':     'Solo usuarios con rol Coordinador o superior pueden importar datos.',
        'editar_datos':       'No tienes permisos para editar o transformar datos. Contacta a tu supervisor.',
        'ejecutar_analisis':  'Solo Analistas, Supervisores, Gerentes y Administradores pueden ejecutar análisis.',
        'exportar_reportes':  'No tienes permisos para exportar reportes. Requiere rol Analista o superior.',
        'usar_trabajo':       'La hoja de trabajo requiere rol Coordinador o superior.',
        'ver_auditoria':      'El registro de auditoría es accesible solo para Supervisores, Gerentes y Administradores.',
        'gestionar_usuarios': 'La gestión de usuarios es exclusiva del Administrador.',
        'default':            'No tienes permisos para realizar esta acción. Contacta al administrador.',
    };

    // ── Verificar permiso ─────────────────
    function puede(accion) {
        const session = Auth.getSession();
        if (!session) return false;
        const rol = session.role || 'readonly';
        const permitidos = PERMISOS[accion] || [];
        return permitidos.includes(rol);
    }

    // ── Obtener rol actual ─────────────────
    function getRol() {
        return Auth.getSession()?.role || 'readonly';
    }

    // ── Mostrar mensaje de acceso denegado ─
    function mostrarDenegado(accion) {
        const msg = MENSAJES[accion] || MENSAJES['default'];
        const rol = getRol();
        const rolLabel = {
            admin:        'Administrador',
            gerente:      'Gerente',
            supervisor:   'Supervisor',
            analista:     'Analista',
            coordinador:  'Coordinador',
            user:         'Usuario',
            readonly:     'Solo lectura',
        }[rol] || rol;

        // Eliminar modal previo
        document.getElementById('permisos-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'permisos-modal';
        modal.innerHTML = `
        <div class="pm-overlay" id="pm-overlay"></div>
        <div class="pm-card">
            <div class="pm-icon">🔒</div>
            <h3 class="pm-title">Acceso restringido</h3>
            <p class="pm-msg">${msg}</p>
            <div class="pm-role-row">
                <span class="pm-role-label">Tu rol actual:</span>
                <span class="pm-role-badge">${rolLabel}</span>
            </div>
            <button class="pm-btn" id="pm-close">Entendido</button>
        </div>`;

        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('pm-visible'));

        const close = () => {
            modal.classList.remove('pm-visible');
            setTimeout(() => modal.remove(), 250);
        };

        document.getElementById('pm-close').addEventListener('click', close);
        document.getElementById('pm-overlay').addEventListener('click', close);
    }

    // ── Proteger un botón ─────────────────
    // Uso: PermisosManager.proteger(btn, 'ejecutar_analisis', () => ejecutarAnalisis())
    function proteger(elemento, accion, callback) {
        if (!elemento) return;
        elemento.addEventListener('click', (e) => {
            if (puede(accion)) {
                callback(e);
            } else {
                e.stopPropagation();
                mostrarDenegado(accion);
            }
        });
    }

    // ── Proteger vista completa ───────────
    // Muestra mensaje en el contenedor si no tiene acceso
    function protegerVista(containerId, accion) {
        if (puede(accion)) return true;

        const container = document.getElementById(containerId);
        if (!container) return false;

        const rol = getRol();
        const rolLabel = {
            admin:'Administrador', gerente:'Gerente', supervisor:'Supervisor',
            analista:'Analista', coordinador:'Coordinador', user:'Usuario', readonly:'Solo lectura'
        }[rol] || rol;

        container.innerHTML = `
        <div class="pm-vista-denegada">
            <div class="pm-vista-icon">🔒</div>
            <h3>Acceso restringido</h3>
            <p>${MENSAJES[accion] || MENSAJES['default']}</p>
            <div class="pm-role-row" style="justify-content:center;margin-top:12px">
                <span class="pm-role-label">Tu rol:</span>
                <span class="pm-role-badge">${rolLabel}</span>
            </div>
        </div>`;
        return false;
    }

    // ── Ocultar/deshabilitar elementos ────
    // ── Ocultar/deshabilitar elementos ────
function aplicarUI(session) {
    if (!session) return;
    const rol = session.role || 'readonly';

    // ─────────────────────────────────────────────────────────
    // RESET: devolver TODOS los elementos a su estado neutro
    // antes de aplicar los permisos del nuevo rol.
    // Sin este reset, los estilos del usuario anterior persisten.
    // ─────────────────────────────────────────────────────────

    // Resetear btn-import
    document.querySelectorAll('.btn-import').forEach(btn => {
        btn.style.display = '';
    });

    // Resetear btn-run
    document.querySelectorAll('.btn-run').forEach(btn => {
        btn.style.opacity = '';
        btn.style.cursor  = '';
        btn.title         = '';
    });

    // Resetear botones de transformación en Datos
    document.querySelectorAll('.dm-btn-tool, #dm-btn-replace').forEach(btn => {
        btn.style.opacity = '';
        btn.style.cursor  = '';
        btn.title         = '';
    });

    // Resetear botones de Trabajo
    document.querySelectorAll([
        '.btn-add-row','.btn-add-column',
        '.btn-delete-row','.btn-delete-column',
        '.btn-clear-table','.btn-save-work',
        '.btn-generate-table','.btn-paste-data'
    ].join(',')).forEach(btn => {
        btn.style.opacity = '';
        btn.style.cursor  = '';
        btn.title         = '';
    });

    // ─────────────────────────────────────────────────────────
    // APLICAR permisos del rol actual (desde cero)
    // ─────────────────────────────────────────────────────────

    // Botón Importar Datos
    document.querySelectorAll('.btn-import').forEach(btn => {
        btn.style.display = PERMISOS['importar_datos'].includes(rol) ? '' : 'none';
    });

    // Botón Ejecutar Análisis
    document.querySelectorAll('.btn-run').forEach(btn => {
        if (!PERMISOS['ejecutar_analisis'].includes(rol)) {
            btn.style.opacity = '0.4';
            btn.style.cursor  = 'not-allowed';
            btn.title         = 'Sin permisos para ejecutar análisis';
        }
    });

    // Botones de transformación en Datos
    document.querySelectorAll('.dm-btn-tool, #dm-btn-replace').forEach(btn => {
        if (!PERMISOS['editar_datos'].includes(rol)) {
            btn.style.opacity = '0.4';
            btn.style.cursor  = 'not-allowed';
            btn.title         = 'Sin permisos para editar datos';
        }
    });

    // Botones de Trabajo
    document.querySelectorAll([
        '.btn-add-row','.btn-add-column',
        '.btn-delete-row','.btn-delete-column',
        '.btn-clear-table','.btn-save-work',
        '.btn-generate-table','.btn-paste-data'
    ].join(',')).forEach(btn => {
        if (!PERMISOS['usar_trabajo'].includes(rol)) {
            btn.style.opacity = '0.4';
            btn.style.cursor  = 'not-allowed';
            btn.title         = 'Sin permisos para editar la hoja de trabajo';
        }
    });

    // Pestaña Auditoría
    const audTab = document.getElementById('nav-auditoria');
    if (audTab) {
        audTab.style.display = PERMISOS['ver_auditoria'].includes(rol) ? '' : 'none';
    }

    // Pestaña Usuarios
    const usrTab = document.getElementById('nav-usuarios');
    if (usrTab) {
        usrTab.style.display = PERMISOS['gestionar_usuarios'].includes(rol) ? '' : 'none';
    }
}

    return {
        puede,
        getRol,
        mostrarDenegado,
        proteger,
        protegerVista,
        aplicarUI,
        PERMISOS,
    };

    })();

console.log('✅ PermisosManager cargado');