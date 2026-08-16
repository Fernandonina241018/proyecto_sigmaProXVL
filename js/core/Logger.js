// ========================================
// Logger.js — StatAnalyzer Pro
// Sistema de auditoría de operaciones del frontend
// ========================================

const Logger = (() => {
    let _apiUrl = '';
    let _enabled = true;

    // Módulos de auditoría
    const MODULES = {
        LOGIN: 'LOGIN',
        DATOS: 'DATOS',
        ANALISIS: 'ANALISIS',
        REPORTES: 'REPORTES',
        USERS: 'USERS',
        SYSTEM: 'SYSTEM',
    };

    // Inicializar con la URL del backend
    function init(apiUrl) {
        _apiUrl = apiUrl;
    }

    // Configurar enabled/disabled
    function setEnabled(enabled) {
        _enabled = enabled;
    }

    // Obtener token actual
    function _getToken() {
        if (typeof Auth !== 'undefined') {
            return Auth.getToken();
        }
        return null;
    }

    // Registrar un evento de auditoría
    async function log(action, module, details = null, durationMs = null) {
        if (!_enabled) return { ok: true, skipped: true };

        const token = _getToken();
        if (!token) {
            console.warn('⚠️ Logger: No hay token, evento no registrado:', action);
            return { ok: false, error: 'No autenticado' };
        }

        var deviceFingerprint = null;
        try {
            if (typeof DeviceFingerprint !== 'undefined') {
                deviceFingerprint = DeviceFingerprint.getFingerprint();
            }
        } catch (_e) {}

        try {
            const res = await fetchWithTimeout(`${_apiUrl}/api/audit/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    action,
                    module,
                    details: details ? (deviceFingerprint ? Object.assign({}, details, { deviceFingerprint: deviceFingerprint }) : details) : (deviceFingerprint ? { deviceFingerprint: deviceFingerprint } : null),
                    durationMs,
                }),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                console.warn('⚠️ Logger: Error del servidor:', res.status, errorText);
                return { ok: false, error: `HTTP ${res.status}` };
            }
            
            const text = await res.text();
            if (!text) {
                return { ok: true };
            }
            
            try {
                return JSON.parse(text);
            } catch {
                return { ok: true, raw: text };
            }
        } catch (err) {
            console.error('❌ Logger: Error al registrar evento:', err.message);
            return { ok: false, error: err.message };
        }
    }

    // ── Métodos convenience ────────────────────

    // Datos: Modificaciones
    async function logDataChange(actionType, details) {
        return log(`DATA:${actionType}`, MODULES.DATOS, details);
    }

    // Reportes: Generar
    async function logReportGenerate(format, hasGraphics = false) {
        return log(`REPORT:${format.toUpperCase()}`, MODULES.REPORTES, { format, hasGraphics });
    }

    // Sistema: Errores
    async function logError(errorType, errorMessage) {
        return log(`ERROR:${errorType}`, MODULES.SYSTEM, { error: errorMessage });
    }

    return {
        init,
        log,
        logDataChange,
        logReportGenerate,
        logError,
        MODULES,
    };
})();

// Auto-inicializar cuando Auth esté disponible
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        if (typeof API_URL !== 'undefined') {
            Logger.init(API_URL);
            console.log('✅ Logger inicializado con:', API_URL);
        } else if (typeof CFG !== 'undefined' && CFG.API_URL) {
            Logger.init(CFG.API_URL);
            console.log('✅ Logger inicializado con CFG');
        } else {
            console.warn('⚠️ Logger: API_URL no disponible');
        }
    });
}

