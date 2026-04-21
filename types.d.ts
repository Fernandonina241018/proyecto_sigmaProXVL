/**
 * types.d.ts - Declaraciones de variables globales para TypeScript
 * 
 * Este archivo centraliza las declaraciones de variables globales
 * usadas en el proyecto para evitar errores de compilación.
 * 
 * Uso: Incluir en tsconfig.json include o reference
 */

declare const API_URL: string;
declare const CFG: {
  API_URL?: string;
  [key: string]: unknown;
};
declare const Auth: {
  getToken(): string | null;
};
declare const lang: string;

// ========================================
// Window Extensions
// ========================================

interface Window {
  API_URL?: string;
  CFG?: { API_URL?: string; [key: string]: unknown };
  Auth?: { getToken(): string | null };
  lang?: string;
}

// ========================================
// Dataset Types (para StatsUtils, EDAManager, etc.)
// ========================================

interface Dataset {
  headers: string[];
  data: unknown[][];
}

interface ColumnResult {
  name: string;
  type: 'numeric' | 'categorical' | 'date' | 'unknown';
  count: number;
  missing: number;
  values?: unknown[];
}

interface SummaryResult {
  rows: number;
  columns: number;
  missingCells: number;
  numericColumns: string[];
  categoricalColumns: string[];
}

// ========================================
// Sheet Types (para StateManager)
// ========================================

interface Sheet {
  id: string;
  name: string;
  headers: string[];
  rows: unknown[][];
}

interface AppState {
  sheets: Sheet[];
  activeSheetId: string | null;
  importedData: Dataset | null;
  fileName: string;
  activeStats: string[];
  ultimosResultados: unknown;
}