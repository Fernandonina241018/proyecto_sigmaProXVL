"use strict";
/**
 * UTILIDADES COMPARTIDAS - StatAnalyzer Pro
 *
 * Funciones comunes usadas en múltiples módulos.
 * Este archivo centraliza lógica duplicada para reducir código repetido.
 */
// ========================================
// API URL (centralizada)
// ========================================
const API_URL = 'https://proyecto-sigmaproxvl.onrender.com';
// ========================================
// ESCAPE HTML
// ========================================
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(msg, isError = false) {
    document.getElementById('utils-toast')?.remove();
    const t = document.createElement('div');
    t.id = 'utils-toast';
    t.className = `datos-toast ${isError ? 'datos-toast-error' : 'datos-toast-ok'}`;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('datos-toast-visible'));
    setTimeout(() => { t.classList.remove('datos-toast-visible'); setTimeout(() => t.remove(), 300); }, 3000);
}
// ========================================
// FORMATO DE FECHA
// ========================================
function formatDate(ts, format = 'full') {
    if (!ts)
        return '—';
    // Forzar interpretación como UTC y convertir automáticamente a hora local del navegador
    const d = new Date(ts.includes('Z') ? ts : ts + 'Z');
    if (isNaN(d.getTime()))
        return ts;
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const day = String(d.getDate()).padStart(2, '0');
    const mon = months[d.getMonth()];
    const yr = d.getFullYear();
    // Formato 12 horas con AM/PM
    let hh24 = d.getHours();
    const ampm = hh24 >= 12 ? 'PM' : 'AM';
    hh24 = hh24 % 12;
    if (hh24 === 0)
        hh24 = 12;
    const hh = String(hh24).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    switch (format) {
        case 'full':
            return `${day}/${mon}/${yr} ${hh}:${mm}:${ss} ${ampm}`;
        case 'short':
            return `${day}/${mon}/${yr}`;
        case 'time':
            return `${hh}:${mm}:${ss} ${ampm}`;
        case 'time24':
            const h24 = String(d.getHours()).padStart(2, '0');
            return `${h24}:${mm}:${ss}`;
        default:
            return `${day}/${mon}/${yr} ${hh}:${mm}:${ss} ${ampm}`;
    }
}
// ========================================
// NOMBRE DE ROL
// ========================================
const ROLE_LABELS = {
    admin: 'Administrador',
    gerente: 'Gerente',
    supervisor: 'Supervisor',
    analista: 'Analista',
    coordinador: 'Coordinador',
    user: 'Usuario',
    readonly: 'Solo lectura'
};
function getRolLabel(rol) {
    return ROLE_LABELS[rol] || rol;
}
// ========================================
// CONSTANTES DE PRUEBAS ESTADÍSTICAS
// ========================================
// Lista unificada de todas las pruebas de hipótesis que requieren configuración
const HYPOTHESIS_TESTS = [
    'ANOVA One-Way', 'ANOVA Two-Way', 'Chi-Cuadrado',
    'T-Test (dos muestras)', 'T-Test (una muestra)',
    'Test de Normalidad', 'Test de Shapiro-Wilk',
    'Límites de Cuantificación',
    'Correlación Pearson', 'Correlación Spearman', 'Correlación Kendall Tau',
    'Covarianza',
    'Regresión Lineal Simple', 'Regresión Lineal Múltiple',
    'Regresión Polinomial', 'Regresión Logística',
    'RMSE', 'MAE', 'R² (Coef. Determinación)',
    'Mann-Whitney U', 'Kruskal-Wallis',
    'Wilcoxon', 'Friedman', 'Test de Signos',
    'Bootstrap',
    'Análisis Factorial', 'PCA (Componentes Principales)'
];
// Set para búsquedas O(1) — usado internamente por includes()
const HYPOTHESIS_SET = new Set(HYPOTHESIS_TESTS);
// ========================================
// BACKWARD COMPATIBILITY
// ========================================
// Mantener _showToast como alias para showToast
function _showToast(msg, isError = false) {
    showToast(msg, isError);
}
// Mantener fmtDate como alias para formatDate
function fmtDate(ts, format = 'full') {
    return formatDate(ts, format);
}
// ========================================
// DEBOUNCE
// ========================================
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
console.log('✅ Utils cargado correctamente');
