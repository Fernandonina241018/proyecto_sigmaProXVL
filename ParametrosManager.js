// ========================================
// ParametrosManager.js — StatAnalyzer Pro
// Parámetros de control por columna
// ========================================

const ParametrosManager = (() => {
    const STORAGE_KEY = 'sa_parametros_control';

    function _defaultState() {
        return { global: { min: '', max: '', esp: '' }, columns: {} };
    }

    function _load() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : _defaultState();
        } catch { return _defaultState(); }
    }

    let _state = _load();

    function _persist() {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
    }

    // ── Setters ──────────────────────────
    function setGlobal(min, max, esp) {
        _state.global = { min, max, esp };
        _persist();
    }

    function setColumna(col, min, max, esp) {
        if (!_state.columns) _state.columns = {};
        _state.columns[col] = { min, max, esp };
        _persist();
    }

    // ── Getters ──────────────────────────
    // La columna específica tiene prioridad sobre el global
    function getParametros(col) {
        const g = _state.global  || {};
        const c = (_state.columns || {})[col] || {};

        const resolve = (colVal, globalVal) => {
            const cv = String(colVal   ?? '').trim();
            const gv = String(globalVal ?? '').trim();
            if (cv !== '') return parseFloat(cv);
            if (gv !== '') return parseFloat(gv);
            return null;
        };

        return {
            min: resolve(c.min, g.min),
            max: resolve(c.max, g.max),
            esp: resolve(c.esp, g.esp),
        };
    }

    function getRawState() {
        return JSON.parse(JSON.stringify(_state));
    }

    // ── Verificar columna completa ────────
    function verificarColumna(data, col) {
        const p      = getParametros(col);
        const tieneParametros = p.min !== null || p.max !== null || p.esp !== null;
        if (!tieneParametros) return null;

        const valores = data.data
            .map(row => parseFloat(row[col]))
            .filter(v => !isNaN(v));

        const fueraDeRango = valores.filter(v => {
            if (p.min !== null && !isNaN(p.min) && v < p.min) return true;
            if (p.max !== null && !isNaN(p.max) && v > p.max) return true;
            return false;
        });

        const media = valores.length > 0
            ? valores.reduce((a, b) => a + b, 0) / valores.length
            : null;

        return {
            col,
            parametros: p,
            total:       valores.length,
            fueraDeRango: fueraDeRango.length,
            porcentajeCumplimiento: valores.length > 0
                ? ((valores.length - fueraDeRango.length) / valores.length * 100).toFixed(1)
                : '100.0',
            mediaReal: media,
        };
    }

    // ── Reset ─────────────────────────────
    function reset() {
        _state = _defaultState();
        _persist();
    }

    // ── Reload (tras cambio de sesión) ────
    function reload() {
        _state = _load();
    }

    return { setGlobal, setColumna, getParametros, getRawState, verificarColumna, reset, reload };
})();

console.log('✅ ParametrosManager cargado');