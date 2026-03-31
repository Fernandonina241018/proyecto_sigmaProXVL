/**
 * UTILIDADES COMPARTIDAS - StatAnalyzer Pro
 * 
 * Funciones comunes usadas en múltiples módulos.
 * Este archivo centraliza lógica duplicada para reducir código repetido.
 */

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
    if (!ts) return '—';
    const d = new Date(ts.includes('T') ? ts : ts + 'Z');
    if (isNaN(d)) return ts;
    
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const day  = String(d.getDate()).padStart(2,'0');
    const mon  = months[d.getMonth()];
    const yr   = d.getFullYear();
    const hh   = String(d.getHours()).padStart(2,'0');
    const mm   = String(d.getMinutes()).padStart(2,'0');
    const ss   = String(d.getSeconds()).padStart(2,'0');
    
    switch(format) {
        case 'full':
            return `${day}/${mon}/${yr} ${hh}:${mm}:${ss}`;
        case 'short':
            return `${day}/${mon}/${yr}`;
        case 'time':
            return `${hh}:${mm}:${ss}`;
        default:
            return `${day}/${mon}/${yr} ${hh}:${mm}:${ss}`;
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

console.log('✅ Utils cargado correctamente');
// PRUEBA VSCODE - comentario de prueba 31/03/2026
