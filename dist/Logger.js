"use strict";
// ========================================
// Logger.ts — StatAnalyzer Pro
// Sistema de auditoría de operaciones del frontend
// Migrado a TypeScript
// ========================================
// ========================================
// MÓDULO LOGGER (IIFE pattern)
// ========================================
const Logger = (() => {
    let _apiUrl = '';
    let _enabled = true;
    const MODULES = {
        LOGIN: 'LOGIN',
        DATOS: 'DATOS',
        ANALISIS: 'ANALISIS',
        REPORTES: 'REPORTES',
        USERS: 'USERS',
        SYSTEM: 'SYSTEM',
    };
    // ========================================
    // MÉTODOS PÚBLICOS
    // ========================================
    function init(apiUrl) {
        _apiUrl = apiUrl;
    }
    function setEnabled(enabled) {
        _enabled = enabled;
    }
    function _getToken() {
        if (typeof Auth !== 'undefined') {
            return Auth.getToken();
        }
        return null;
    }
    async function log(action, module, details = null, durationMs = null) {
        if (!_enabled) {
            return { ok: true, skipped: true };
        }
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('❌ Logger: Error al registrar evento:', errorMessage);
            return { ok: false, error: errorMessage };
        }
    }
    // ── Métodos convenience ────────────────────
    async function logImport(filename, fileSize) {
        const details = filename ? { filename, fileSize } : undefined;
        return log('IMPORT', MODULES.DATOS, details);
    }
    async function logExport(format, filename) {
        return log(`EXPORT:${format.toUpperCase()}`, MODULES.DATOS, { format, filename });
    }
    async function logDataChange(actionType, details) {
        return log(`DATA:${actionType}`, MODULES.DATOS, details);
    }
    async function logAnalysis(stats, durationMs) {
        const statsArray = Array.isArray(stats) ? stats : [stats];
        return log('ANALYSIS_RUN', MODULES.ANALISIS, { stats: statsArray }, durationMs);
    }
    async function logAnalysisConfig(statName, config) {
        return log(`CONFIG:${statName}`, MODULES.ANALISIS, config);
    }
    async function logReportGenerate(format, hasGraphics = false) {
        return log(`REPORT:${format.toUpperCase()}`, MODULES.REPORTES, { format, hasGraphics });
    }
    async function logReportDownload(format, filename) {
        return log(`DOWNLOAD:${format.toUpperCase()}`, MODULES.REPORTES, { format, filename });
    }
    async function logError(errorType, errorMessage) {
        return log(`ERROR:${errorType}`, MODULES.SYSTEM, { error: errorMessage });
    }
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
// ========================================
// AUTO-INICIALIZACIÓN
// ========================================
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Las variables globales se definen en utils.js
        // Se deja para inicialización manual via Logger.init(url)
        console.log('⚠️ Logger: Usa Logger.init(url) para inicializar');
    });
}
console.log('✅ Logger cargado');
