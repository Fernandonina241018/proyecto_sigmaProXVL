"use strict";
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
        }
        catch {
            return _defaultState();
        }
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
        if (!_state.columns)
            _state.columns = {};
        _state.columns[col] = { min, max, esp };
        _persist();
    }
    // ── Getters ──────────────────────────
    // La columna específica tiene prioridad sobre el global
    function getParametros(col) {
        const g = _state.global || {};
        const c = (_state.columns || {})[col] || {};
        const resolve = (colVal, globalVal) => {
            const cv = String(colVal ?? '').trim();
            const gv = String(globalVal ?? '').trim();
            if (cv !== '')
                return parseFloat(cv);
            if (gv !== '')
                return parseFloat(gv);
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
        const p = getParametros(col);
        const tieneParametros = p.min !== null || p.max !== null || p.esp !== null;
        if (!tieneParametros)
            return null;
        const valores = data.data
            .map(row => parseFloat(row[col]))
            .filter(v => !isNaN(v));
        const fueraDeRango = valores.filter(v => {
            if (p.min !== null && !isNaN(p.min) && v < p.min)
                return true;
            if (p.max !== null && !isNaN(p.max) && v > p.max)
                return true;
            return false;
        });
        const media = valores.length > 0
            ? valores.reduce((a, b) => a + b, 0) / valores.length
            : null;
        return {
            col,
            parametros: p,
            total: valores.length,
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
    // ═══════════════════════════════════════════════════════════════════════════════
    // UMbrales DE DISPERSIÓN (Semáforo)
    // ═══════════════════════════════════════════════════════════════════════════════
    // Estado por defecto para umbrales de dispersión
    function _defaultDispersionState() {
        return {
            global: {
                'Desviación Estándar': { alerta: 2, critico: 4, enabled: true },
                'Varianza': { alerta: 4, critico: 16, enabled: true },
                'Coeficiente de Variación': { alerta: 15, critico: 30, enabled: true },
                'Intervalos de Confianza': { alerta: 10, critico: 20, enabled: false }
            },
            columns: {}
        };
    }
    let _dispersionState = (() => {
        try {
            const raw = sessionStorage.getItem('sa_umbrales_dispersion');
            return raw ? JSON.parse(raw) : _defaultDispersionState();
        }
        catch {
            return _defaultDispersionState();
        }
    })();
    function _persistDispersion() {
        sessionStorage.setItem('sa_umbrales_dispersion', JSON.stringify(_dispersionState));
    }
    // Configurar umbrales para un estadístico
    function setUmbralDispersion(statName, alerta, critico, enabled = true, columna = null) {
        const key = columna || '_global_';
        if (!_dispersionState.columns)
            _dispersionState.columns = {};
        if (!_dispersionState.columns[key])
            _dispersionState.columns[key] = {};
        _dispersionState.columns[key][statName] = {
            alerta: parseFloat(alerta),
            critico: parseFloat(critico),
            enabled: enabled
        };
        _persistDispersion();
    }
    // Obtener umbrales para un estadístico y columna
    function getUmbralDispersion(statName, columna = null) {
        // Primero buscar por columna específica
        const colData = (_dispersionState.columns || {})[columna || '_global_'];
        if (colData && colData[statName]) {
            return colData[statName];
        }
        // Si no existe, usar global
        return (_dispersionState.global || {})[statName] || null;
    }
    // Obtener todos los umbrales configurados
    function getAllUmbralesDispersion() {
        return JSON.parse(JSON.stringify(_dispersionState));
    }
    // Evaluar si un valor está dentro, en alerta o en crítico
    function evaluarDispersion(statName, valor, columna = null) {
        const umbral = getUmbralDispersion(statName, columna);
        if (!umbral || !umbral.enabled)
            return null;
        const val = parseFloat(valor);
        if (isNaN(val))
            return null;
        if (val < umbral.alerta) {
            return { status: 'ok', label: '✓ Dentro de parámetros', value: val, umbral };
        }
        else if (val < umbral.critico) {
            return { status: 'warn', label: '⚠️ Alerta', value: val, umbral };
        }
        else {
            return { status: 'danger', label: '✗ Fuera de parámetros', value: val, umbral };
        }
    }
    // Resetear umbrales de dispersión
    function resetUmbralesDispersion() {
        _dispersionState = _defaultDispersionState();
        _persistDispersion();
    }
    // ═══════════════════════════════════════════════════════════════════════════════
    // MODAL DE CONFIGURACIÓN DE UMBRALES
    // ═══════════════════════════════════════════════════════════════════════════════
    function openThresholdModal() {
        document.getElementById('threshold-config-modal')?.remove();
        const stats = [
            { key: 'Desviación Estándar', label: '📊 Desviación Estándar', defaultA: 2, defaultC: 4 },
            { key: 'Varianza', label: '📈 Varianza', defaultA: 4, defaultC: 16 },
            { key: 'Coeficiente de Variación', label: '📉 Coeficiente de Variación (%)', defaultA: 15, defaultC: 30 },
            { key: 'Intervalos de Confianza', label: '🔔 Intervalos de Confianza', defaultA: 10, defaultC: 20 }
        ];
        const modal = document.createElement('div');
        modal.id = 'threshold-config-modal';
        modal.innerHTML = `
            <div class="dm-modal-overlay" id="threshold-modal-overlay"></div>
            <div class="dm-modal-card" style="width: min(500px, 96vw); max-height: 90vh; overflow-y: auto;">
                <div class="dm-modal-header">
                    <h3>⚙️ Configurar Umbrales de Dispersión</h3>
                    <button class="dm-modal-close" id="threshold-modal-close">✕</button>
                </div>
                <div class="dm-modal-body">
                    <p style="font-size: 0.85rem; color: #666; margin-bottom: 16px;">
                        Configure los umbrales (límites) para el semáforo de dispersión. 
                        Los valores se evaluarán después de ejecutar el análisis.
                    </p>
                    ${stats.map(s => {
            const umb = getUmbralDispersion(s.key) || { alerta: s.defaultA, critico: s.defaultC, enabled: s.key !== 'Intervalos de Confianza' };
            return `
                        <div class="threshold-stat-group" style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <div class="threshold-stat-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <label style="font-weight: 600; color: #1e3a8a;">${s.label}</label>
                                <input type="checkbox" class="threshold-enabled" data-stat="${s.key}" ${umb.enabled ? 'checked' : ''}>
                            </div>
                            <div class="threshold-inputs" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <div>
                                    <label style="font-size: 0.75rem; color: #666;">🟢 Umbral Verde (&lt;)</label>
                                    <input type="number" class="threshold-alerta" data-stat="${s.key}" value="${umb.alerta}" step="0.1" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                                <div>
                                    <label style="font-size: 0.75rem; color: #666;">🔴 Umbral Rojo (≥)</label>
                                    <input type="number" class="threshold-critico" data-stat="${s.key}" value="${umb.critico}" step="0.1" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                            </div>
                        </div>
                        `;
        }).join('')}
                    <div style="display: flex; gap: 8px; margin-top: 16px;">
                        <button class="dm-btn dm-btn-secondary" id="threshold-reset-default" style="flex: 1;">🔄 Restablecer Valores</button>
                        <button class="dm-btn dm-btn-primary" id="threshold-save" style="flex: 1;">✅ Guardar Configuración</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('threshold-modal-close').onclick = () => modal.remove();
        document.getElementById('threshold-modal-overlay').onclick = () => modal.remove();
        document.getElementById('threshold-reset-default').onclick = () => {
            resetUmbralesDispersion();
            openThresholdModal();
        };
        document.getElementById('threshold-save').onclick = () => {
            stats.forEach(s => {
                const enabled = document.querySelector(`.threshold-enabled[data-stat="${s.key}"]`)?.checked;
                const alerta = document.querySelector(`.threshold-alerta[data-stat="${s.key}"]`)?.value;
                const critico = document.querySelector(`.threshold-critico[data-stat="${s.key}"]`)?.value;
                setUmbralDispersion(s.key, alerta, critico, enabled);
            });
            modal.remove();
            if (typeof _showToast === 'function') {
                _showToast('✅ Umbrales de dispersión guardados');
            }
            else {
                alert('✅ Umbrales de dispersión guardados');
            }
        };
    }
    return {
        setGlobal, setColumna, getParametros, getRawState, verificarColumna, reset, reload,
        setUmbralDispersion, getUmbralDispersion, getAllUmbralesDispersion, evaluarDispersion, resetUmbralesDispersion, openThresholdModal
    };
})();
console.log('✅ ParametrosManager cargado');
