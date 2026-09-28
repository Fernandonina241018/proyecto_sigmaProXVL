// ========================================
// indexx-validaciones.js — SigmaProXVL
// Área de Validaciones: shell independiente (NO usa el multipage de
// estadística). Base visual propia en css/validaciones.css.
// Mini-router por hash: #/banco · #/generador · #/protocolos · #/firmas.
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

  const ROUTES = [
    { id: 'banco', nombre: 'Banco', icono: '📚' },
    { id: 'generador', nombre: 'Generador', icono: '📄' },
    { id: 'protocolos', nombre: 'Protocolos', icono: '📋' },
    { id: 'firmas', nombre: 'Firmas', icono: '✍️' },
  ];

  const VALID_ROUTES = ROUTES.map((r) => r.id);

  function parseRoute(hash) {
    const h = String(hash || '').replace(/^#\/?/, '').split('?')[0];
    return VALID_ROUTES.indexOf(h) >= 0 ? h : 'banco';
  }

  function manifest() {
    try {
      if (typeof ValidacionesManifest !== 'undefined') return ValidacionesManifest;
    } catch (e) {}
    return { total: 0, fases: {}, categorias: {} };
  }

  function currentArea() {
    try {
      if (typeof Auth !== 'undefined' && Auth.getArea) return Auth.getArea();
      if (typeof AreaSelect !== 'undefined' && AreaSelect.getArea) return AreaSelect.getArea();
    } catch (e) {}
    return null;
  }

  function currentUser() {
    try {
      if (typeof Auth !== 'undefined' && Auth.getSession) {
        const s = Auth.getSession();
        if (s) return s.username || s.name || '';
      }
    } catch (e) {}
    return '';
  }

  function isAdmin() {
    try {
      if (typeof Auth !== 'undefined' && Auth.getSession) {
        const s = Auth.getSession();
        if (s) return s.role === 'admin';
      }
    } catch (e) {}
    return false;
  }

  function viewDev() {
    return '<h1>Área de Validaciones</h1>'
      + '<p class="val-sub">Calificación DQ · IQ · OQ · PQ</p>'
      + '<div class="val-empty">'
      + '<div style="font-size:44px">🚧</div>'
      + '<div style="font-size:18px;font-weight:700;margin:10px 0;color:var(--val-text)">En desarrollo</div>'
      + '<div>Esta área estará en funcionamiento próximamente.</div>'
      + '</div>';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function viewBanco() {
    const m = manifest();
    const stats = [
      { n: m.total || 0, l: 'Ensayos en banco' },
      { n: (m.fases && m.fases.DQ) || 0, l: 'DQ' },
      { n: (m.fases && m.fases.IQ) || 0, l: 'IQ' },
      { n: (m.fases && m.fases.OQ) || 0, l: 'OQ' },
      { n: (m.fases && m.fases.PQ) || 0, l: 'PQ' },
    ];
    return '<h1>Banco de ensayos</h1>'
      + '<p class="val-sub">Calificación DQ / IQ / OQ / PQ por categoría</p>'
      + '<div class="val-stats">'
      + stats.map((s) => '<div class="val-stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div></div>').join('')
      + '</div>'
      + '<div class="val-grid">'
      + CATS.map((c) => '<a class="val-card" href="' + c.href + '" target="_blank" rel="noopener">'
        + '<div class="ico">' + c.icono + '</div>'
        + '<div class="t">' + esc(c.nombre) + '</div>'
        + '<div class="d">' + esc(c.desc) + '</div>'
        + '<div class="c">Abrir banco →</div></a>').join('')
      + '</div>';
  }

  function viewGenerador() {
    return '<h1>Generador de protocolos</h1>'
      + '<p class="val-sub">Un documento .docx independiente por protocolo</p>'
      + '<div class="val-gen">'
      + '<div class="t">📄 Generador de protocolos (.docx)</div>'
      + '<p class="d">Elige entidad + protocolos y genera un documento independiente por fase</p>'
      + '<button type="button" disabled>Próximamente</button>'
      + '</div>';
  }

  function viewSoon(title, desc) {
    return '<h1>' + esc(title) + '</h1>'
      + '<p class="val-sub">' + esc(desc) + '</p>'
      + '<div class="val-empty">Vista en construcción — llegará con el módulo.</div>';
  }

  function render() {
    const root = document.getElementById('validaciones-app');
    if (!root) return;
    if (!isAdmin()) {
      const main = root.querySelector('.val-main');
      if (main) main.innerHTML = viewDev();
      return;
    }
    const route = parseRoute(window.location.hash);
    const main = root.querySelector('.val-main');
    if (main) {
      main.innerHTML = route === 'banco' ? viewBanco()
        : route === 'generador' ? viewGenerador()
        : route === 'protocolos' ? viewSoon('Protocolos', 'Documentos generados y su estado')
        : viewSoon('Firmas', 'Flujo de firmas de protocolos');
    }
    root.querySelectorAll('.val-rail button').forEach((b) => {
      if (b.getAttribute('data-route') === route) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
  }

  function show() {
    try {
      if (typeof document === 'undefined' || !document.createElement) return false;
      hide();
      const ov = document.createElement('div');
      ov.id = 'validaciones-app';
      ov.innerHTML = '<header class="val-head">'
        + '<div class="val-logo">✅</div>'
        + '<div class="val-title">Validaciones<small>Calificación DQ · IQ · OQ · PQ</small></div>'
        + '<div class="val-head-spacer"></div>'
        + '<span class="val-user">' + esc(currentUser()) + '</span>'
        + '<button type="button" class="val-linkbtn" data-act="area">Cambiar de área</button>'
        + '<button type="button" class="val-linkbtn" data-act="salir">Salir</button>'
        + '</header>'
        + '<nav class="val-rail" aria-label="Navegación de validaciones">'
        + ROUTES.map((r) => '<button type="button" data-route="' + r.id + '">'
          + '<span class="ico">' + r.icono + '</span>' + r.nombre + '</button>').join('')
        + '</nav>'
        + '<main class="val-main"></main>';
      ov.addEventListener('click', function (e) {
        const rb = e.target && e.target.closest ? e.target.closest('[data-route]') : null;
        if (rb) {
          try { window.location.hash = '#/' + rb.getAttribute('data-route'); } catch (err) {}
          return;
        }
        const ab = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
        if (!ab) return;
        try {
          if (ab.getAttribute('data-act') === 'area') {
            if (typeof Auth !== 'undefined' && Auth.selectArea) { Auth.selectArea(); return; }
            if (typeof AreaSelect !== 'undefined' && AreaSelect.showModal) AreaSelect.showModal();
          } else if (ab.getAttribute('data-act') === 'salir') {
            if (typeof Auth !== 'undefined' && Auth.logout) Auth.logout();
          }
        } catch (err) {}
      });
      document.body.appendChild(ov);
      render();
      return true;
    } catch (e) { return false; }
  }

  function hide() {
    try {
      document.getElementById('validaciones-view')?.remove();
      document.getElementById('validaciones-app')?.remove();
      return true;
    } catch (e) { return false; }
  }

  function apply(area) {
    if (area === 'validaciones') return show();
    return hide();
  }

  function onHash() {
    try {
      if (document.getElementById('validaciones-app')) render();
    } catch (e) {}
  }

  function init() {
    try {
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('sigma-area', function (e) {
          apply(e && e.detail ? e.detail.area : null);
        });
        window.addEventListener('hashchange', onHash);
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

  return { CATS, ROUTES, parseRoute, show, hide, apply, currentArea };
})();
