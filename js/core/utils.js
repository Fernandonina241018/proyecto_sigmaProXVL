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

// ── PDF EN SERVIDOR (Chromium headless, mismo motor que "Imprimir") ──
// Respeta @media print / page-break / @page y deja texto seleccionable.
// Devuelve true si descargó; false ante CUALQUIER problema (sin sesión,
// servidor sin Chromium → 503, red, timeout, respuesta no-PDF) para que el
// caller use el generador anterior. Nunca lanza excepción.
var __PDF_SERVER_MAX_BYTES = 4.5 * 1024 * 1024; // backend acepta 5 MB de JSON

window.__generarPDFServidor = async function (html, filename, opts) {
    opts = opts || {};
    try {
        if (typeof fetch !== 'function' || typeof API_URL === 'undefined' || !API_URL) return false;
        if (typeof html !== 'string' || !html.trim()) return false;
        var token = '';
        try { if (typeof Auth !== 'undefined' && Auth.getToken) token = Auth.getToken() || ''; } catch (e) { token = ''; }
        if (!token) return false; // el backend exige Bearer en POST
        var payload = JSON.stringify({
            html: html,
            filename: filename || 'reporte.pdf',
            sessionId: (opts.sessionId === undefined || opts.sessionId === null) ? null : opts.sessionId,
            kind: opts.kind || 'reporte'
        });
        if (typeof Blob === 'function' && new Blob([payload]).size > __PDF_SERVER_MAX_BYTES) return false;
        var res = await fetchWithTimeout(API_URL + '/api/pdf/render', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
            body: payload
        }, opts.timeoutMs || 60000);
        if (!res || !res.ok) {
            debugLog('[SigmaProXVL] PDF servidor no disponible (HTTP ' + (res && res.status) + '), uso generador local');
            return false;
        }
        var ct = (res.headers && res.headers.get && res.headers.get('Content-Type')) || '';
        if (ct.indexOf('application/pdf') === -1) return false;
        var blob = await res.blob();
        if (!blob || !blob.size) return false;
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename || 'reporte.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) {} }, 1500);
        return true;
    } catch (e) {
        console.warn('[SigmaProXVL] PDF servidor falló, uso generador local:', e && e.message);
        return false;
    }
};

// Quita contenido activo de un HTML SIN ejecutarlo (DOMParser no corre
// scripts): <script>, iframes/objetos, <base>, meta refresh, on*="..." y
// URLs javascript:. Lo usa el generador local para no reabrir MF-1.
// Devuelve null si no pudo sanear (el caller debe abortar: fail-closed).
window.__htmlSinScripts = function (html) {
    try {
        if (typeof DOMParser !== 'function') return null;
        var d = new DOMParser().parseFromString(String(html || ''), 'text/html');
        var kill = d.querySelectorAll('script, iframe, frame, frameset, object, embed, base, meta[http-equiv]');
        for (var i = 0; i < kill.length; i++) { if (kill[i].parentNode) kill[i].parentNode.removeChild(kill[i]); }
        var all = d.querySelectorAll('*');
        for (var j = 0; j < all.length; j++) {
            var el = all[j];
            var attrs = Array.prototype.slice.call(el.attributes || []);
            for (var k = 0; k < attrs.length; k++) {
                var n = String(attrs[k].name || '').toLowerCase();
                var v = String(attrs[k].value || '');
                if (n.indexOf('on') === 0) el.removeAttribute(attrs[k].name);
                else if (/^(href|src|xlink:href|action|formaction|srcdoc)$/.test(n) && (n === 'srcdoc' || /^\s*javascript:/i.test(v))) el.removeAttribute(attrs[k].name);
            }
        }
        return '<!DOCTYPE html>\n' + d.documentElement.outerHTML;
    } catch (e) { return null; }
};

// Genera un PDF real (multi-página, rasterizado) desde un string HTML.
// Devuelve true si descargó, false si falló (el caller decide el fallback).
window.__generarPDF = async function (html, filename, hash) {
    try {
        await window.__cargarScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        await window.__cargarScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
        if (!window.html2canvas || !window.jspdf) throw new Error('librerías PDF no disponibles');

        var scale = 2;
        var pageW = 210, pageH = 297;

        var iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;background:#ffffff;';
        // MF-1: el HTML puede venir de un reporte importado → sin scripts.
        var safeHtml = window.__htmlSinScripts(html);
        if (!safeHtml) throw new Error('no se pudo sanear el HTML del reporte');
        iframe.srcdoc = safeHtml;
        document.body.appendChild(iframe);
        await new Promise(function (r) {
            var done = false;
            iframe.onload = function () { if (!done) { done = true; r(); } };
            setTimeout(function () { if (!done) { done = true; r(); } }, 1500);
        });
        var ifdoc = iframe.contentDocument || iframe.contentWindow.document;

        // Bordes "seguros" de corte: tops de elementos que no deben partirse.
        // Se leen antes de rasterizar; el corte ya no es a cada 297mm ciegos.
        var noSplitSel = '.sec, .sec-title, .var-block, .method-grid, .mi, .sig-grid, .audit-box, .doc-footer, table, tr, img, .cover, h1, h2, h3';
        var topsCss = [];
        try {
            var els = ifdoc.querySelectorAll(noSplitSel);
            for (var i = 0; i < els.length; i++) {
                var t = els[i].getBoundingClientRect().top;
                if (t == null || isNaN(t) || t < 2) continue;
                topsCss.push(t);
            }
        } catch (e) { /* sin bordes seguros → corte fijo */ }

        var canvas = await window.html2canvas(ifdoc.body, {
            scale: scale, useCORS: true, backgroundColor: '#ffffff', logging: false
        });
        document.body.removeChild(iframe);

        var imgH = canvas.height * pageW / canvas.width;
        var mmPerCssPx = (pageW / canvas.width) * scale;

        // Convertir bordes a mm, ordenar y deduplicar líneas muy próximas (< 8mm).
        var safeLines = [];
        topsCss.forEach(function (top) {
            var mm = top * mmPerCssPx;
            if (mm > 2 && mm < imgH - 2) safeLines.push(mm);
        });
        safeLines.sort(function (a, b) { return a - b; });
        var uniq = [];
        safeLines.forEach(function (mm) {
            if (uniq.length && (mm - uniq[uniq.length - 1]) < 8) return;
            uniq.push(mm);
        });
        safeLines = uniq;

        // Inicios de página: cortar en el borde seguro más cercano al límite A4.
        // Si no hay borde seguro en el rango, cae al corte fijo (target).
        var starts = [0];
        var pos = 0;
        var minGap = pageH * 0.55;
        while (pos + pageH < imgH - 1) {
            var target = pos + pageH;
            var best = target;
            for (var j = 0; j < safeLines.length; j++) {
                var s = safeLines[j];
                if (s <= pos + minGap) continue;
                if (s > target) break;
                best = s;
            }
            if (best - pos < 1) break; // sin avance: evita loop infinito
            pos = best;
            starts.push(pos);
        }

        var jsPDF = window.jspdf.jsPDF;
        var pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        pdf.setProperties({
            title: (filename || 'reporte').replace(/\.pdf$/, ''),
            subject: 'Reporte SigmaProXVL',
            creator: 'SigmaProXVL',
            keywords: 'integridad=' + (hash || '')
        });

        var imgData = canvas.toDataURL('image/jpeg', 0.92);
        for (var k = 0; k < starts.length; k++) {
            if (k === 0) {
                pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgH);
            } else {
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, -starts[k], pageW, imgH);
            }
        }
        pdf.save(filename);
        return true;
    } catch (e) {
        console.warn('[SigmaProXVL] generación PDF falló:', e);
        return false;
    }
};

