// ========================================
// area-select.js — SigmaProXVL
// Selector de área post-login: Estadística | Validaciones.
// Estado en sessionStorage (sigmaPro_area). Sin dependencias.
// ========================================

const AreaSelect = (() => {
  const KEY = 'sigmaPro_area';
  const AREAS = [
    { id: 'estadistica', nombre: 'Estadística', icono: '\u{1F4CA}', desc: 'Análisis, spreadsheet y reportes' },
    { id: 'validaciones', nombre: 'Validaciones', icono: '\u2705', desc: 'Calificación DQ/IQ/OQ/PQ y protocolos' },
  ];

  function store() {
    try {
      if (typeof sessionStorage !== 'undefined') return sessionStorage;
    } catch (e) {}
    return null;
  }

  function isValid(id) {
    return AREAS.some((a) => a.id === id);
  }

  function getArea() {
    try {
      const v = store() && store().getItem(KEY);
      return isValid(v) ? v : null;
    } catch (e) { return null; }
  }

  function dispatch(id) {
    try {
      if (typeof window !== 'undefined' && typeof window.CustomEvent !== 'undefined') {
        window.dispatchEvent(new window.CustomEvent('sigma-area', { detail: { area: id } }));
      }
    } catch (e) {}
  }

  function setArea(id) {
    if (!isValid(id)) return false;
    try {
      const s = store();
      if (s) s.setItem(KEY, id);
    } catch (e) {}
    dispatch(id);
    return true;
  }

  function clearArea() {
    try {
      const s = store();
      if (s) s.removeItem(KEY);
    } catch (e) {}
  }

  function cardHTML(a) {
    return '<button type="button" class="area-card" data-area="' + a.id + '"'
      + ' style="cursor:pointer;border:1px solid var(--border);border-radius:12px;padding:24px 20px;'
      + 'background:var(--bg-panel);color:var(--text-primary);min-width:200px">'
      + '<div style="font-size:40px">' + a.icono + '</div>'
      + '<div style="font-size:18px;font-weight:700;margin-top:8px">' + a.nombre + '</div>'
      + '<div style="font-size:13px;color:var(--text-muted);margin-top:4px">' + a.desc + '</div>'
      + '</button>';
  }

  function showModal(next) {
    try {
      if (typeof document === 'undefined' || !document.createElement) return false;
      document.getElementById('area-select-overlay')?.remove();
      const ov = document.createElement('div');
      ov.id = 'area-select-overlay';
      ov.style.cssText = 'position:fixed;inset:0;z-index:99990;display:flex;align-items:center;'
        + 'justify-content:center;background:rgba(0,0,0,.55)';
      ov.innerHTML = '<div style="text-align:center">'
        + '<h2 style="color:#fff;margin-bottom:4px">Elige tu área de trabajo</h2>'
        + '<p style="color:#ccc;margin-bottom:20px">Puedes cambiarla cuando quieras desde tu usuario</p>'
        + '<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">'
        + AREAS.map(cardHTML).join('')
        + '</div></div>';
      ov.addEventListener('click', function (e) {
        const btn = e.target && e.target.closest ? e.target.closest('[data-area]') : null;
        if (!btn) return;
        const id = btn.getAttribute('data-area');
        if (!setArea(id)) return;
        ov.remove();
        if (next) next(id);
      });
      document.body.appendChild(ov);
      return true;
    } catch (e) { return false; }
  }

  function ensureArea(next) {
    const a = getArea();
    if (a) {
      dispatch(a);
      if (next) next(a);
      return true;
    }
    if (showModal(next)) return true;
    if (next) next(null);
    return false;
  }

  return { AREAS, KEY, getArea, setArea, clearArea, isValid, ensureArea, showModal };
})();
