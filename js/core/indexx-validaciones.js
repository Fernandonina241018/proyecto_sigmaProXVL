// ========================================
// indexx-validaciones.js — SigmaProXVL
// Área de Validaciones: panel de categorías del banco + punto de
// entrada reservado para el generador de protocolos (.docx).
// Se activa con el evento 'sigma-area' (Auth/AreaSelect).
// ========================================

const Validaciones = (() => {
  const CATS = [
    { id: 'equipos', nombre: 'Equipos e Instrumentos', icono: '🔧', href: 'docs/banco-ensayos/equipos.html', desc: 'Calificación de equipos e instrumentos' },
    { id: 'sistemas', nombre: 'Sistemas', icono: '🏭', href: 'docs/banco-ensayos/sistemas.html', desc: 'HVAC, agua, vapor, aire' },
    { id: 'almacenes', nombre: 'Almacenes', icono: '📦', href: 'docs/banco-ensayos/almacenes.html', desc: 'Banco compartido DQ/IQ/OQ/PQ' },
    { id: 'estabilidad', nombre: 'Estabilidad (ICH Q1A)', icono: '🌡️', href: 'docs/banco-ensayos/estabilidad.html', desc: 'Cámaras de estabilidad' },
    { id: 'software', nombre: 'Software', icono: '💾', href: 'docs/banco-ensayos/software.html', desc: 'Validación CSV / GAMP 5' },
  ];

  function currentArea() {
    try {
      if (typeof Auth !== 'undefined' && Auth.getArea) return Auth.getArea();
      if (typeof AreaSelect !== 'undefined' && AreaSelect.getArea) return AreaSelect.getArea();
    } catch (e) {}
    return null;
  }

  function catCard(c) {
    return '<a href="' + c.href + '" target="_blank" rel="noopener"'
      + ' style="text-decoration:none;border:1px solid var(--border);border-radius:12px;'
      + 'padding:20px 16px;background:var(--bg-panel);color:var(--text-primary);min-width:180px">'
      + '<div style="font-size:34px">' + c.icono + '</div>'
      + '<div style="font-size:16px;font-weight:700;margin-top:8px">' + c.nombre + '</div>'
      + '<div style="font-size:12px;color:var(--text-muted);margin-top:4px">' + c.desc + '</div>'
      + '</a>';
  }

  function show() {
    try {
      if (typeof document === 'undefined' || !document.createElement) return false;
      hide();
      const ov = document.createElement('div');
      ov.id = 'validaciones-view';
      ov.style.cssText = 'position:fixed;inset:0;z-index:90000;overflow-y:auto;'
        + 'background:var(--bg-app);padding:32px 16px;';
      ov.innerHTML = '<div style="max-width:1000px;margin:0 auto;text-align:center">'
        + '<h1 style="margin-bottom:4px">Área de Validaciones</h1>'
        + '<p style="color:var(--text-muted);margin-bottom:20px">Banco de ensayos y calificación DQ / IQ / OQ / PQ</p>'
        + '<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">'
        + CATS.map(catCard).join('')
        + '</div>'
        + '<div id="generador-entry" style="margin-top:28px;border:1px dashed var(--border);'
        + 'border-radius:12px;padding:20px;background:var(--bg-panel)">'
        + '<div style="font-size:20px;font-weight:700">📄 Generador de protocolos (.docx)</div>'
        + '<p style="color:var(--text-muted);font-size:13px">Elige entidad + protocolos y genera un documento independiente por fase</p>'
        + '<button type="button" id="generador-btn" disabled'
        + ' style="opacity:.55;cursor:not-allowed;padding:10px 22px;border-radius:8px;border:none">Próximamente</button>'
        + '</div>'
        + '<button type="button" id="cambiar-area-btn"'
        + ' style="margin-top:20px;cursor:pointer;background:none;border:none;'
        + 'color:var(--text-muted);text-decoration:underline">← Cambiar de área</button>'
        + '</div>';
      const back = ov.querySelector('#cambiar-area-btn');
      if (back && back.addEventListener) {
        back.addEventListener('click', function () {
          try {
            if (typeof Auth !== 'undefined' && Auth.selectArea) { Auth.selectArea(); return; }
            if (typeof AreaSelect !== 'undefined' && AreaSelect.showModal) AreaSelect.showModal();
          } catch (e) {}
        });
      }
      document.body.appendChild(ov);
      return true;
    } catch (e) { return false; }
  }

  function hide() {
    try {
      document.getElementById('validaciones-view')?.remove();
      return true;
    } catch (e) { return false; }
  }

  function apply(area) {
    if (area === 'validaciones') return show();
    return hide();
  }

  function init() {
    try {
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('sigma-area', function (e) {
          apply(e && e.detail ? e.detail.area : null);
        });
      }
      if (typeof document !== 'undefined') {
        const run = () => apply(currentArea());
        if (document.readyState === 'loading' && document.addEventListener) {
          document.addEventListener('DOMContentLoaded', run);
        } else {
          run();
        }
      }
    } catch (e) {}
  }

  try { init(); } catch (e) {}

  return { CATS, show, hide, apply, currentArea };
})();
