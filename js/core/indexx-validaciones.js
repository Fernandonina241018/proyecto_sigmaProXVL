// ========================================
// indexx-validaciones.js — SigmaProXVL
// Área de Validaciones V7 (réplica "Admin Dashboard V7").
// Shell independiente: riel + saludo + stats + actividad + panel derecho.
// Mini-router por hash: #/banco · #/generador · #/protocolos · #/firmas.
// Se activa con el evento 'sigma-area' (Auth/AreaSelect).
// ========================================

const Validaciones = (() => {
  const CATS = [
    { id: 'almacenes', nombre: 'Almacenes', icono: '📦', href: 'docs/banco-ensayos/almacenes.html', desc: '43 ensayos', hot: true },
    { id: 'equipos', nombre: 'Equipos', icono: '🔧', href: 'docs/banco-ensayos/equipos.html', desc: 'Banco de equipos' },
    { id: 'sistemas', nombre: 'Sistemas', icono: '🏭', href: 'docs/banco-ensayos/sistemas.html', desc: 'HVAC · agua · vapor' },
    { id: 'estabilidad', nombre: 'Estabilidad', icono: '🌡️', href: 'docs/banco-ensayos/estabilidad.html', desc: '60 ensayos · ICH Q1A' },
    { id: 'software', nombre: 'Software', icono: '💾', href: 'docs/banco-ensayos/software.html', desc: 'CSV / GAMP 5' },
  ];

  const ROUTES = [
    { id: 'banco', icono: '▦' },
    { id: 'generador', icono: '📄' },
    { id: 'protocolos', icono: '📋' },
    { id: 'firmas', icono: '✍️' },
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

  function session() {
    try {
      if (typeof Auth !== 'undefined' && Auth.getSession) return Auth.getSession() || null;
    } catch (e) {}
    return null;
  }

  function currentArea() {
    try {
      if (typeof Auth !== 'undefined' && Auth.getArea) return Auth.getArea();
      if (typeof AreaSelect !== 'undefined' && AreaSelect.getArea) return AreaSelect.getArea();
    } catch (e) {}
    return null;
  }

  function currentUser() {
    const s = session();
    return (s && (s.username || s.name)) || '';
  }

  function isAdmin() {
    const s = session();
    return !!(s && s.role === 'admin');
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function firstLetter(name) {
    const c = String(name || '?').trim().charAt(0).toUpperCase();
    return c || '?';
  }

  function dayPart() {
    try {
      const h = new Date().getHours();
      if (h < 12) return 'Buenos días';
      if (h < 19) return 'Buenas tardes';
      return 'Buenas noches';
    } catch (e) { return 'Hola'; }
  }

  // ── Sparklines SVG ──
  function sparkBars(vals, color) {
    const max = Math.max.apply(null, vals.concat([1]));
    const w = 100, h = 30;
    const bw = w / vals.length;
    const rects = vals.map((v, i) => {
      const bh = Math.max(3, Math.round((v / max) * (h - 4)));
      return '<rect x="' + (i * bw + 1).toFixed(1) + '" y="' + (h - bh) + '" width="' + (bw - 2).toFixed(1)
        + '" height="' + bh + '" rx="1.5" fill="' + color + '"/>';
    }).join('');
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + rects + '</svg>';
  }

  function sparkPulse(color) {
    return '<svg viewBox="0 0 100 30" aria-hidden="true">'
      + '<polyline points="0,18 18,18 26,8 34,24 42,14 55,18 63,18 70,5 78,25 86,16 100,16"'
      + ' fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function sparkRing(pct, color) {
    const c = 2 * Math.PI * 11;
    const off = (c * (100 - pct)) / 100;
    return '<svg viewBox="0 0 30 30" aria-hidden="true">'
      + '<circle cx="15" cy="15" r="11" fill="none" stroke="#e3e6eb" stroke-width="4"/>'
      + '<circle cx="15" cy="15" r="11" fill="none" stroke="' + color + '" stroke-width="4"'
      + ' stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"'
      + ' transform="rotate(-90 15 15)" stroke-linecap="round"/></svg>';
  }

  // ── Vista banco (réplica V7) ──
  function viewBanco() {
    const m = manifest();
    const f = m.fases || {};
    const cards = [
      { t: 'Ensayos totales', v: m.total || 0, u: 'banco', g: sparkBars([4, 7, 5, 9, 6, 11, 8], '#ff5c1a') },
      { t: 'DQ · Diseño', v: f.DQ || 0, u: 'fase', g: sparkPulse('#e13d8f') },
      { t: 'IQ · Instalación', v: f.IQ || 0, u: 'fase', g: sparkRing(72, '#34c98e') },
      { t: 'OQ · Operación', v: f.OQ || 0, u: 'fase', g: sparkBars([6, 3, 8, 5, 9, 4, 7], '#4f9cf7') },
      { t: 'PQ · Desempeño', v: f.PQ || 0, u: 'fase', g: sparkPulse('#7c5cf0') },
    ];
    const user = currentUser();
    return '<div class="v7-top">'
      + '<div class="v7-hello">' + dayPart() + ', ' + esc(user || 'usuario') + ' 👋<small>¿Qué vas a calificar hoy?</small></div>'
      + '<label class="v7-search">🔍<input id="v7-search" placeholder="Buscar categoría o entidad…" aria-label="Buscar"></label>'
      + '<button type="button" class="v7-bell" aria-label="Notificaciones">🔔<span class="dot"></span></button>'
      + '</div>'
      + '<div class="v7-stats">'
      + cards.map((c) => '<div class="v7-stat"><div class="t">' + c.t + '</div>'
        + '<div class="v">' + c.v + ' <small>' + c.u + '</small></div>' + c.g + '</div>').join('')
      + '</div>'
      + '<div class="v7-mid">'
      + '<div class="v7-panel"><div class="ph">Actividad de calificación'
      + '<select aria-label="Rango"><option>7 días</option><option>30 días</option></select></div>'
      + '<svg class="chart" viewBox="0 0 300 150" aria-hidden="true">'
      + '<path d="M0,120 C30,110 45,70 70,78 C95,86 105,50 130,58 C155,66 165,95 190,88 C215,81 225,45 250,52 C275,59 285,40 300,44 L300,150 L0,150 Z" fill="rgba(255,92,26,.18)"/>'
      + '<path d="M0,120 C30,110 45,70 70,78 C95,86 105,50 130,58 C155,66 165,95 190,88 C215,81 225,45 250,52 C275,59 285,40 300,44" fill="none" stroke="#ff5c1a" stroke-width="2.5" stroke-linecap="round"/>'
      + '<circle cx="130" cy="58" r="4" fill="#ff5c1a"/></svg></div>'
      + '<div class="v7-panel v7-gen"><div class="gt">Generador de protocolos</div>'
      + '<div class="big">' + (f.DQ + f.IQ + f.OQ + f.PQ || '—') + '</div>'
      + '<div class="sub">ensayos listos · 1 .docx por protocolo</div>'
      + '<button type="button" disabled>Próximamente</button></div>'
      + '</div>'
      + '<div class="v7-cats-head">Categorías <a href="#/banco">ver todo</a></div>'
      + '<div class="v7-cats" id="v7-cats">'
      + CATS.map((c) => '<a class="v7-cat' + (c.hot ? ' hot' : '') + '" href="' + c.href + '" target="_blank" rel="noopener" data-name="' + esc(c.nombre) + '">'
        + '<div class="ico">' + c.icono + '</div>'
        + '<div class="t">' + esc(c.nombre) + '</div>'
        + '<div class="d">' + esc(c.desc) + '</div></a>').join('')
      + '</div>';
  }

  function sidePanel() {
    const user = currentUser();
    const role = (session() || {}).role || '';
    const now = new Date();
    const y = now.getFullYear(), mo = now.getMonth();
    const first = new Date(y, mo, 1).getDay();
    const days = new Date(y, mo + 1, 0).getDate();
    const marks = { 7: 'mk', 14: 'mk', 21: 'mk', 28: 'mk2' };
    const names = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    let cells = '';
    for (let i = 0; i < first; i++) cells += '<td></td>';
    for (let d = 1; d <= days; d++) {
      cells += '<td' + (marks[d] ? ' class="' + marks[d] + '"' : '') + '>' + d + '</td>';
      if ((first + d) % 7 === 0) cells += '</tr><tr>';
    }
    const m = manifest();
    return '<div class="v7-profile"><div class="av">' + esc(firstLetter(user)) + '</div>'
      + '<div class="nm">' + esc(user || 'usuario') + '</div>'
      + '<div class="rl">' + esc(role) + '</div></div>'
      + '<div class="v7-pstats">'
      + '<div><div class="pv">' + (m.total || 0) + '</div><div class="pl">Ensayos</div></div>'
      + '<div><div class="pv">4</div><div class="pl">Fases</div></div>'
      + '<div><div class="pv">5</div><div class="pl">Categorías</div></div>'
      + '</div>'
      + '<div class="v7-cal">' + names[mo] + ' ' + y
      + '<table><tr><th>D</th><th>L</th><th>M</th><th>M</th><th>J</th><th>V</th><th>S</th></tr><tr>' + cells + '</tr></table></div>'
      + '<div class="v7-sched"><div class="sh">Programado <a href="#/firmas">ver todo</a></div>'
      + '<div class="v7-item"><div class="im">🌡️</div><div><div class="tt">Mapeo cuarto frío</div><div class="ts">Vence día 21</div></div></div>'
      + '<div class="v7-item"><div class="im">✍️</div><div><div class="tt">Firmas OQ pendientes</div><div class="ts">3 por revisar</div></div></div>'
      + '<div class="v7-item"><div class="im">📄</div><div><div class="tt">Protocolo PQ borrador</div><div class="ts">En edición</div></div></div>'
      + '</div>';
  }

  function viewDev() {
    return '<div class="v7-view"><h1>Área de Validaciones</h1>'
      + '<p class="sub">Calificación DQ · IQ · OQ · PQ</p>'
      + '<div class="v7-empty"><div style="font-size:44px">🚧</div>'
      + '<div style="font-size:18px;font-weight:700;margin:10px 0;color:var(--v7-ink)">En desarrollo</div>'
      + '<div>Esta área estará en funcionamiento próximamente.</div></div></div>';
  }

  function viewSoon(title, desc) {
    return '<div class="v7-view"><h1>' + esc(title) + '</h1>'
      + '<p class="sub">' + esc(desc) + '</p>'
      + '<div class="v7-empty">Vista en construcción — llegará con el módulo.</div></div>';
  }

  function render() {
    const root = document.getElementById('validaciones-app');
    if (!root) return;
    if (!isAdmin()) {
      const main = root.querySelector('.val-main, .v7-main');
      if (main) main.innerHTML = viewDev();
      return;
    }
    const route = parseRoute(window.location.hash);
    const mains = root.querySelectorAll('.v7-main');
    const main = mains && mains.length ? mains[mains.length - 1] : root.querySelector('.val-main');
    if (main) {
      main.innerHTML = route === 'banco' ? viewBanco()
        : route === 'generador' ? '<div class="v7-view"><h1>Generador de protocolos</h1><p class="sub">Un .docx independiente por protocolo</p><div class="v7-panel v7-gen"><div class="gt">📄 Generador (.docx)</div><button type="button" disabled>Próximamente</button></div></div>'
        : route === 'protocolos' ? viewSoon('Protocolos', 'Documentos generados y su estado')
        : viewSoon('Firmas', 'Flujo de firmas de protocolos');
      const si = document.getElementById('v7-search');
      if (si && si.addEventListener) {
        si.addEventListener('input', function () {
          const q = si.value.toLowerCase();
          root.querySelectorAll('.v7-cat').forEach((c) => {
            const n = (c.getAttribute('data-name') || '').toLowerCase();
            c.style.display = !q || n.indexOf(q) >= 0 ? '' : 'none';
          });
        });
      }
    }
    root.querySelectorAll('.v7-rail button, .val-rail button').forEach((b) => {
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
      ov.innerHTML = '<nav class="v7-rail" aria-label="Navegación de validaciones">'
        + '<div class="v7-dots">•••</div>'
        + ROUTES.map((r) => '<button type="button" data-route="' + r.id + '" aria-label="' + r.id + '">' + r.icono + '</button>').join('')
        + '<div class="v7-spacer"></div>'
        + '<button type="button" data-act="area" aria-label="Cambiar de área" title="Cambiar de área">⇄</button>'
        + '<div class="v7-avatar">' + esc(firstLetter(currentUser())) + '</div>'
        + '</nav>'
        + '<main class="v7-main"></main>'
        + '<aside class="v7-side"></aside>';
      ov.addEventListener('click', function (e) {
        const rb = e.target && e.target.closest ? e.target.closest('[data-route]') : null;
        if (rb) {
          try { window.location.hash = '#/' + rb.getAttribute('data-route'); } catch (err) {}
          return;
        }
        const sw = e.target && e.target.closest
          ? (e.target.closest('[data-act="area"]') || e.target.closest('.v7-avatar')) : null;
        if (sw) {
          try {
            if (typeof Auth !== 'undefined' && Auth.selectArea) { Auth.selectArea(); return; }
            if (typeof AreaSelect !== 'undefined' && AreaSelect.showModal) AreaSelect.showModal();
          } catch (err) {}
        }
      });
      document.body.appendChild(ov);
      const side = ov.querySelector('.v7-side');
      if (side && isAdmin()) side.innerHTML = sidePanel();
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
