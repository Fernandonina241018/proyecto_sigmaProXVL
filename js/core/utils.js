/**
 * UTILIDADES COMPARTIDAS - StatAnalyzer Pro
 * 
 * Funciones comunes usadas en múltiples módulos.
 * Este archivo centraliza lógica duplicada para reducir código repetido.
 */

// ========================================
// API URL (centralizada)
// ========================================

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : 'https://sigmaproxvl-backend.fly.dev';

// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(unsafe) {
    if (unsafe == null) return '';
    return String(unsafe)
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
    // Forzar interpretación como UTC y convertir automáticamente a hora local del navegador
    const d = new Date(ts.includes('Z') ? ts : ts + 'Z');
    if (isNaN(d.getTime())) return ts;
    
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const day  = String(d.getDate()).padStart(2,'0');
    const mon  = months[d.getMonth()];
    const yr   = d.getFullYear();
    
    // Formato 12 horas con AM/PM
    let hh24 = d.getHours();
    const ampm = hh24 >= 12 ? 'PM' : 'AM';
    hh24 = hh24 % 12;
    if (hh24 === 0) hh24 = 12;
    const hh = String(hh24).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    const ss = String(d.getSeconds()).padStart(2,'0');
    
    switch(format) {
        case 'full':
            return `${day}/${mon}/${yr} ${hh}:${mm}:${ss} ${ampm}`;
        case 'short':
            return `${day}/${mon}/${yr}`;
        case 'time':
            return `${hh}:${mm}:${ss} ${ampm}`;
        case 'time24':
            const h24 = String(d.getHours()).padStart(2,'0');
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
    'Correlación Pearson', 'Correlación Spearman', 'Correlación Kendall Tau',
    'Regresión Lineal Simple', 'Regresión Lineal Múltiple',
    'Regresión Polinomial', 'Regresión Logística',
    'RMSE', 'MAE', 'R² (Coef. Determinación)',
    'Mann-Whitney U', 'Kruskal-Wallis',
    'Wilcoxon', 'Friedman', 'Test de Signos',
    'Bootstrap',
    'Análisis Factorial', 'PCA (Componentes Principales)',
    'Test TOST (Equivalencia)',
    'Análisis de Cluster',
    'Análisis Discriminante',
    'M-ANOVA',
    'Series Temporales',
    'Análisis de Supervivencia',
    'Modelos Mixtos',
    'Análisis Bayesiano',
    'LOD (Curva de Calibración)',
    'LOQ (Curva de Calibración)',
    'LQC (Curva de Calibración)',
    'MDL (Curva de Calibración)'
];

// Set para búsquedas O(1) — usado internamente por includes()
const HYPOTHESIS_SET = new Set(HYPOTHESIS_TESTS);

// Estadísticos que requieren parámetros configurables vía modal (F0, etc.)
const PARAM_CONFIG_SET = new Set([
    'Factor de Letalidad (F0)',
    'MKT (Mean Kinetic Temperature)',
    'Tendencia'
]);

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

// ========================================
// fetch con timeout (aborta si excede N ms)
// ========================================

function fetchWithTimeout(url, options, timeoutMs = 15000) {
    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, timeoutMs);
    return fetch(url, Object.assign({}, options, { signal: controller.signal }))
        .finally(function() { clearTimeout(timer); });
}

// ========================================
// DEBUG MODE (activar con ?debug en URL)
// ========================================

const DEBUG = /[?&]debug\b/.test(location.search);

function debugLog(...args) {
    if (DEBUG) console.log(...args);
}

// ========================================
// PDF REAL (html2canvas + jsPDF) — compartido entre Reportes y Firma
// ========================================

window.__cargarScript = function (src) {
    return new Promise(function (resolve) {
        if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
        var s = document.createElement('script');
        s.src = src;
        s.onload = function () { resolve(); };
        s.onerror = function () { resolve(); }; // resuelve igual; el caller hace fallback
        document.head.appendChild(s);
    });
};

window.__sha256Hex = async function (str) {
    try {
        if (!window.crypto || !window.crypto.subtle) return '';
        var data = new TextEncoder().encode(String(str || ''));
        var buf = await window.crypto.subtle.digest('SHA-256', data);
        var arr = Array.from(new Uint8Array(buf));
        return arr.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('').toUpperCase();
    } catch (e) { return ''; }
};

// Genera un PDF real (multi-página, rasterizado) desde un string HTML.
// Devuelve true si descargó, false si falló (el caller decide el fallback).
window.__generarPDF = async function (html, filename, hash) {
    try {
        await window.__cargarScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        await window.__cargarScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
        if (!window.html2canvas || !window.jspdf) throw new Error('librerías PDF no disponibles');

        var iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;background:#ffffff;';
        iframe.srcdoc = html;
        document.body.appendChild(iframe);
        await new Promise(function (r) {
            var done = false;
            iframe.onload = function () { if (!done) { done = true; r(); } };
            setTimeout(function () { if (!done) { done = true; r(); } }, 1500);
        });
        var ifdoc = iframe.contentDocument || iframe.contentWindow.document;
        var canvas = await window.html2canvas(ifdoc.body, {
            scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false
        });
        document.body.removeChild(iframe);

        var jsPDF = window.jspdf.jsPDF;
        var pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        pdf.setProperties({
            title: (filename || 'reporte').replace(/\.pdf$/, ''),
            subject: 'Reporte SigmaProXVL',
            creator: 'SigmaProXVL',
            keywords: 'integridad=' + (hash || '')
        });

        var pageW = 210, pageH = 297;
        var imgH = canvas.height * pageW / canvas.width;
        var imgData = canvas.toDataURL('image/jpeg', 0.92);
        var heightLeft = imgH;
        var position = 0;
        pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
        heightLeft -= pageH;
        while (heightLeft > 1) {
            position -= pageH;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
            heightLeft -= pageH;
        }
        pdf.save(filename);
        return true;
    } catch (e) {
        console.warn('[SigmaProXVL] generación PDF falló:', e);
        return false;
    }
};

