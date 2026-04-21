// ========================================
// Logger.ts — StatAnalyzer Pro
// Sistema de auditoría de operaciones del frontend
// Migrado a TypeScript
// ========================================

// ========================================
// VARIABLES GLOBALES (tipos para TypeScript)
// ========================================

interface Window {
  API_URL?: string;
  CFG?: { API_URL?: string; [key: string]: unknown };
  Auth?: { getToken(): string | null };
}

// ========================================
// TIPOS E INTERFACES
// ========================================

type LogModule = 
  | 'LOGIN' 
  | 'DATOS' 
  | 'ANALISIS' 
  | 'REPORTES' 
  | 'USERS' 
  | 'SYSTEM';

interface LogDetails {
  filename?: string;
  fileSize?: number;
  format?: string;
  hasGraphics?: boolean;
  error?: string;
  targetUser?: string;
  [key: string]: unknown;
}

interface LogResult {
  ok: boolean;
  error?: string;
  skipped?: boolean;
}

interface LogOptions {
  action: string;
  module: LogModule;
  details?: LogDetails | null;
  durationMs?: number | null;
}

// ========================================
// MÓDULO LOGGER (IIFE pattern)
// ========================================

const Logger = (() => {
  let _apiUrl = '';
  let _enabled = true;

  const MODULES: Record<LogModule, LogModule> = {
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

  function init(apiUrl: string): void {
    _apiUrl = apiUrl;
  }

  function setEnabled(enabled: boolean): void {
    _enabled = enabled;
  }

  function _getToken(): string | null {
    if (typeof Auth !== 'undefined') {
      return Auth.getToken();
    }
    return null;
  }

  async function log(
    action: string, 
    module: LogModule, 
    details: LogDetails | null = null, 
    durationMs: number | null = null
  ): Promise<LogResult> {
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Logger: Error al registrar evento:', errorMessage);
      return { ok: false, error: errorMessage };
    }
  }

  // ── Métodos convenience ────────────────────

  async function logImport(filename: string, fileSize?: number): Promise<LogResult> {
    const details = filename ? { filename, fileSize } : undefined;
    return log('IMPORT', MODULES.DATOS, details);
  }

  async function logExport(format: string, filename: string): Promise<LogResult> {
    return log(`EXPORT:${format.toUpperCase()}`, MODULES.DATOS, { format, filename });
  }

  async function logDataChange(actionType: string, details: LogDetails): Promise<LogResult> {
    return log(`DATA:${actionType}`, MODULES.DATOS, details);
  }

  async function logAnalysis(stats: string | string[], durationMs: number): Promise<LogResult> {
    const statsArray = Array.isArray(stats) ? stats : [stats];
    return log('ANALYSIS_RUN', MODULES.ANALISIS, { stats: statsArray }, durationMs);
  }

  async function logAnalysisConfig(statName: string, config: LogDetails): Promise<LogResult> {
    return log(`CONFIG:${statName}`, MODULES.ANALISIS, config);
  }

  async function logReportGenerate(format: string, hasGraphics = false): Promise<LogResult> {
    return log(`REPORT:${format.toUpperCase()}`, MODULES.REPORTES, { format, hasGraphics });
  }

  async function logReportDownload(format: string, filename: string): Promise<LogResult> {
    return log(`DOWNLOAD:${format.toUpperCase()}`, MODULES.REPORTES, { format, filename });
  }

  async function logError(errorType: string, errorMessage: string): Promise<LogResult> {
    return log(`ERROR:${errorType}`, MODULES.SYSTEM, { error: errorMessage });
  }

  async function logUserChange(action: string, targetUser: string): Promise<LogResult> {
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
// AUTO-INICIALIZACIÓN (usa API_URL de utils.js)
// ========================================

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // Las variables globales se definen en utils.js
    if (typeof API_URL !== 'undefined') {
      Logger.init(API_URL);
      console.log('✅ Logger inicializado con:', API_URL);
    // @ts-ignore - CFG es opcional
    } else if (typeof CFG !== 'undefined' && CFG?.API_URL) {
      // @ts-ignore
      Logger.init(CFG.API_URL);
      console.log('✅ Logger inicializado con CFG');
    } else {
      console.warn('⚠️ Logger: API_URL no disponible');
    }
  });
}

console.log('✅ Logger cargado');