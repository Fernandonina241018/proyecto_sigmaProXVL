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

        try {
            const res = await fetch(`${_apiUrl}/api/audit/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    action,
                    module,
                    details,
                    durationMs,
                }),
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.error('❌ Logger: Error al registrar evento:', err.message);
            return { ok: false, error: err.message };
        }
    }

    // ── Métodos convenience ────────────────────

    // Datos: Importar archivo
    async function logImport(filename, fileSize = null) {
        const details = filename ? { filename, fileSize } : null;
        return log('IMPORT', MODULES.DATOS, details);
    }

    // Datos: Exportar archivo
    async function logExport(format, filename) {
        return log(`EXPORT:${format.toUpperCase()}`, MODULES.DATOS, { format, filename });
    }

    // Datos: Modificaciones
    async function logDataChange(actionType, details) {
        return log(`DATA:${actionType}`, MODULES.DATOS, details);
    }

    // Análisis: Ejecutar analizar
    async function logAnalysis(stats, durationMs) {
        const details = { stats: Array.isArray(stats) ? stats : [stats] };
        return log('ANALYSIS_RUN', MODULES.ANALISIS, details, durationMs);
    }

    // Análisis: Cambiar configuración
    async function logAnalysisConfig(statName, config) {
        return log(`CONFIG:${statName}`, MODULES.ANALISIS, config);
    }

    // Reportes: Generar
    async function logReportGenerate(format, hasGraphics = false) {
        return log(`REPORT:${format.toUpperCase()}`, MODULES.REPORTES, { format, hasGraphics });
    }

    // Reportes: Descargar
    async function logReportDownload(format, filename) {
        return log(`DOWNLOAD:${format.toUpperCase()}`, MODULES.REPORTES, { format, filename });
    }

    // Sistema: Errores
    async function logError(errorType, errorMessage) {
        return log(`ERROR:${errorType}`, MODULES.SYSTEM, { error: errorMessage });
    }

    // Usuarios: Cambios de configuración
    async function logUserChange(action, targetUser) {
        return log(`USER:${action}`, MODULES.USERS, { targetUser });
    }

    return {
        init,
        setEnabled,
        log,
        logImport,
        logExport,
        logDataChange,
        logAnalysis,
        logAnalysisConfig,
        logReportGenerate,
        logReportDownload,
        logError,
        logUserChange,
        MODULES,
    };
})();

// Auto-inicializar cuando Auth esté disponible
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        if (typeof CFG !== 'undefined' && CFG.API_URL) {
            Logger.init(CFG.API_URL);
            console.log('✅ Logger inicializado');
        }
    });
}

console.log('✅ Logger cargado');