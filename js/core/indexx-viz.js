// ════════════════════════════════════════════════════════════════
// indexx-viz.js — Visualización (rediseño z_error.md adaptado)
// ════════════════════════════════════════════════════════════════

// ══ STATE ═══════════════════════════════════════════════════════
var _V = {
  cat: 'comp',
  type: null,
  vals: {},
  palette: 'violet',
  opts: { legend: true, grid: true, anim: true, smooth: true },
  chart: null,
  gallery: [],
};

// ══ CONSTANTS ════════════════════════════════════════════════════
var _V_ACC = '#7b6fe0';
var _V_ACC2 = '#9d94f5';
var _V_ACCL = 'rgba(123,111,224,.25)';
var _V_SEP = 'rgba(255,255,255,.06)';

var _V_PALETTES = [
  { id: 'violet', lbl: 'Violeta', c: ['#7b6fe0','#a397f7','#c5bcff','#4a40a0','#d4d0ff'] },
  { id: 'ocean',  lbl: 'Océano',  c: ['#0ea5e9','#38bdf8','#7dd3fc','#0369a1','#bae6fd'] },
  { id: 'coral',  lbl: 'Coral',   c: ['#f97316','#fb923c','#fdba74','#c2410c','#fed7aa'] },
  { id: 'forest', lbl: 'Bosque',  c: ['#22c55e','#4ade80','#86efac','#15803d','#bbf7d0'] },
  { id: 'rose',   lbl: 'Rosa',    c: ['#ec4899','#f472b6','#fbcfe8','#9d174d','#fce7f3'] },
  { id: 'sunset', lbl: 'Sunset',  c: ['#f97316','#eab308','#84cc16','#06b6d4','#8b5cf6'] },
  { id: 'claro',  lbl: 'Claro',   c: ['#2563eb','#dc2626','#16a34a','#d97706','#9333ea'] },
];

var _V_CATS = [
  { id: 'comp',  lbl: 'Comparación', types: ['barras','agrupadas','apiladas'] },
  { id: 'dist',  lbl: 'Distribución', types: ['histograma','dispersion','burbuja'] },
  { id: 'tend',  lbl: 'Tendencia',   types: ['lineas','area','multi'] },
  { id: 'comp2', lbl: 'Composición', types: ['circular','dona','polar'] },
  { id: 'stat',  lbl: 'Estadístico', types: ['radar','linealidad','control','dotplot'] },
];

var _V_TYPES = {
  barras:     { lbl: 'Barras',      cat: 'comp',  svg: _V_svgBarras() },
  agrupadas:  { lbl: 'Agrupadas',   cat: 'comp',  svg: _V_svgAgrupadas() },
  apiladas:   { lbl: 'Apiladas',    cat: 'comp',  svg: _V_svgApiladas() },
  histograma: { lbl: 'Histograma',  cat: 'dist',  svg: _V_svgHistograma() },
  dispersion: { lbl: 'Dispersión',  cat: 'dist',  svg: _V_svgDispersion() },
  burbuja:    { lbl: 'Burbuja',     cat: 'dist',  svg: _V_svgBurbuja() },
  lineas:     { lbl: 'Líneas',      cat: 'tend',  svg: _V_svgLineas() },
  area:       { lbl: 'Área',        cat: 'tend',  svg: _V_svgArea() },
  multi:      { lbl: 'Multi',       cat: 'tend',  svg: _V_svgMulti() },
  circular:   { lbl: 'Circular',    cat: 'comp2', svg: _V_svgCircular() },
  dona:       { lbl: 'Dona',        cat: 'comp2', svg: _V_svgDona() },
  polar:      { lbl: 'Polar',       cat: 'comp2', svg: _V_svgPolar() },
  radar:      { lbl: 'Radar',       cat: 'stat',  svg: _V_svgRadar() },
  linealidad: { lbl: 'Linealidad',  cat: 'stat',  svg: _V_svgLinealidad() },
  control:    { lbl: 'Control',     cat: 'stat',  svg: _V_svgControl() },
  dotplot:    { lbl: 'Puntos',      cat: 'stat',  svg: _V_svgDotplot() },
};

var _V_AXIS = {
  barras:     [{ k: 'x', lbl: 'Eje X (Categoría)' }, { k: 'y', lbl: 'Eje Y (Valor)' }],
  agrupadas:  [{ k: 'x', lbl: 'Eje X' }, { k: 'y', lbl: 'Eje Y' }, { k: 'grupo', lbl: 'Variable de Grupo' }],
  apiladas:   [{ k: 'x', lbl: 'Eje X' }, { k: 'y', lbl: 'Eje Y' }, { k: 'pila', lbl: 'Variable de Pila' }],
  histograma: [{ k: 'variable', lbl: 'Variable a analizar' }],
  dispersion: [{ k: 'x', lbl: 'Variable X' }, { k: 'y', lbl: 'Variable Y' }],
  burbuja:    [{ k: 'x', lbl: 'Eje X' }, { k: 'y', lbl: 'Eje Y' }, { k: 'r', lbl: 'Radio (tamaño)' }],
  lineas:     [{ k: 'x', lbl: 'Eje X (Tiempo)' }, { k: 'y', lbl: 'Eje Y' }],
  area:       [{ k: 'x', lbl: 'Eje X' }, { k: 'y', lbl: 'Eje Y' }],
  multi:      [{ k: 'x', lbl: 'Eje X' }, { k: 'y1', lbl: 'Serie 1' }, { k: 'y2', lbl: 'Serie 2' }, { k: 'y3', lbl: 'Serie 3 (opcional)' }],
  circular:   [{ k: 'etq', lbl: 'Etiquetas' }, { k: 'val', lbl: 'Valores' }],
  dona:       [{ k: 'etq', lbl: 'Etiquetas' }, { k: 'val', lbl: 'Valores' }],
  polar:      [{ k: 'etq', lbl: 'Categorías' }, { k: 'val', lbl: 'Valores' }],
  radar:      [{ k: 'etq', lbl: 'Categorías' }, { k: 'y', lbl: 'Serie' }],
  linealidad: [{ k: 'x', lbl: 'Variable Independiente (X)' }, { k: 'y', lbl: 'Variable Dependiente (Y)' }],
  control:    [{ k: 'x', lbl: 'Eje X (Tiempo, opcional)' }, { k: 'y', lbl: 'Variable a controlar' }],
  dotplot:    [{ k: 'variable', lbl: 'Variable a analizar' }],
};

// ══ CSS INJECTION ════════════════════════════════════════════════
var _V_CSS_INJECTED = false;

function _V_injectCSS() {
  if (_V_CSS_INJECTED) return;
  _V_CSS_INJECTED = true;
  var css = '.viz-root{--bg0:var(--bg-primary);--bg1:var(--bg-panel);--bg2:var(--bg-secondary);--bg3:var(--item-bg);--bg4:var(--item-hover);--acc:#7b6fe0;--acc2:#9d94f5;--accDim:rgba(123,111,224,.12);--accBorder:rgba(123,111,224,.35);--t1:var(--text-primary);--t2:var(--text-muted);--t3:var(--text-faint);--sep:var(--border);--sepH:var(--border);--sans:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;--r:8px;--rs:5px;font-family:var(--sans);font-size:13px;color:var(--t1)}'
    + '.viz-root .sec{border-bottom:1px solid var(--sep);flex-shrink:0}'
    + '.viz-root .sec-hdr{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;cursor:pointer;user-select:none}'
    + '.viz-root .sec-hdr-label{font-size:10px;font-weight:700;letter-spacing:.9px;color:var(--t2);text-transform:uppercase}'
    + '.viz-root .sec-hdr .chev{color:var(--t3);font-size:10px;transition:transform .2s}'
    + '.viz-root .sec-hdr.closed .chev{transform:rotate(-90deg)}'
    + '.viz-root .sec-body{overflow:hidden;max-height:500px;transition:max-height .25s ease}'
    + '.viz-root .sec-body.closed{max-height:0}'
    + '.viz-root .cat-tabs{display:flex;gap:2px;padding:10px 14px 2px;overflow-x:auto;scrollbar-width:none;flex-shrink:0}'
    + '.viz-root .cat-tabs::-webkit-scrollbar{display:none}'
    + '.viz-root .cat-tab{flex-shrink:0;padding:5px 11px;border-radius:var(--rs);font-size:11px;font-weight:600;cursor:pointer;color:var(--t2);background:transparent;border:none;transition:all .15s;white-space:nowrap}'
    + '.viz-root .cat-tab:hover{color:var(--t1);background:var(--bg3)}'
    + '.viz-root .cat-tab.act{color:var(--acc2);background:var(--accDim)}'
    + '.viz-root .chart-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding:10px 14px 14px;overflow-y:auto;max-height:195px;scrollbar-width:thin;scrollbar-color:var(--bg4) transparent}'
    + '.viz-root .ct{display:flex;flex-direction:column;align-items:center;gap:5px;padding:8px 4px 7px;border-radius:var(--r);border:1.5px solid var(--sep);cursor:pointer;background:var(--bg2);transition:all .14s}'
    + '.viz-root .ct:hover{border-color:var(--accBorder);background:var(--bg3);transform:translateY(-1px)}'
    + '.viz-root .ct.sel{border-color:var(--acc);background:var(--accDim);box-shadow:0 0 0 3px rgba(123,111,224,.08)}'
    + '.viz-root .ct svg{width:42px;height:30px;display:block}'
    + '.viz-root .ct-lbl{font-size:10px;font-weight:600;color:var(--t2);text-align:center}'
    + '.viz-root .ct.sel .ct-lbl{color:var(--acc2)}'
    + '.viz-root .axis-body{padding:10px 14px 14px;display:flex;flex-direction:column;gap:9px;overflow-y:auto;max-height:180px;scrollbar-width:thin;scrollbar-color:var(--bg4) transparent}'
    + '.viz-root .axis-hint{color:var(--t3);font-size:11px;padding:2px 0}'
    + '.viz-root .slot{display:flex;flex-direction:column;gap:4px}'
    + '.viz-root .slot-lbl{font-size:11px;font-weight:600;color:var(--t2);display:flex;align-items:center;gap:5px}'
    + '.viz-root .slot-badge{font-size:9px;padding:1px 5px;border-radius:99px;background:var(--accDim);color:var(--acc2);font-weight:700}'
    + '.viz-root .slot-sel{width:100%;padding:7px 28px 7px 10px;background:var(--bg2);border:1.5px solid var(--sep);border-radius:var(--rs);color:var(--t1);font-size:12px;cursor:pointer;outline:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%237878a0\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;transition:border-color .14s;font-family:var(--sans)}'
    + '.viz-root .slot-sel:hover{border-color:var(--sepH)}'
    + '.viz-root .slot-sel:focus{border-color:var(--acc)}'
    + '.viz-root .slot-sel option{background:var(--bg2)}'
    + '.viz-root .style-body{padding:10px 14px 14px;display:flex;flex-direction:column;gap:10px}'
    + '.viz-root .style-row{display:flex;flex-direction:column;gap:4px}'
    + '.viz-root .style-lbl{font-size:11px;font-weight:600;color:var(--t2)}'
    + '.viz-root .style-inp{width:100%;padding:7px 10px;background:var(--bg2);border:1.5px solid var(--sep);border-radius:var(--rs);color:var(--t1);font-size:12px;outline:none;transition:border-color .14s;font-family:var(--sans)}'
    + '.viz-root .style-inp:focus{border-color:var(--acc)}'
    + '.viz-root .style-inp::placeholder{color:var(--t3)}'
    + '.viz-root .palettes{display:flex;gap:6px;flex-wrap:wrap}'
    + '.viz-root .pal{padding:5px;border-radius:var(--rs);border:2px solid transparent;cursor:pointer;display:flex;gap:2px;transition:border-color .14s}'
    + '.viz-root .pal.act{border-color:var(--acc)}'
    + '.viz-root .pal-sw{width:13px;height:13px;border-radius:3px}'
    + '.viz-root .toggles{display:flex;gap:6px;flex-wrap:wrap}'
    + '.viz-root .tog{padding:5px 11px;border-radius:var(--rs);font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid var(--sep);background:var(--bg2);color:var(--t2);transition:all .14s}'
    + '.viz-root .tog.on{background:var(--accDim);border-color:var(--accBorder);color:var(--acc2)}'
    + '.viz-root .action-bar{margin-top:auto;padding:12px 14px;display:flex;gap:7px;border-top:1px solid var(--sep);background:var(--bg1);flex-shrink:0}'
    + '.viz-root .btn-viz{padding:9px 6px;border-radius:var(--rs);font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px;font-family:var(--sans)}'
    + '.viz-root .btn-prim{flex:2;background:var(--acc);color:#fff}'
    + '.viz-root .btn-prim:hover{background:var(--acc2);box-shadow:0 2px 16px rgba(123,111,224,.4)}'
    + '.viz-root .btn-sec{flex:1;background:var(--bg3);color:var(--t2);border:1.5px solid var(--sep)}'
    + '.viz-root .btn-sec:hover{background:var(--bg4);color:var(--t1)}'
    + '.viz-root .gallery{display:none;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--sep);background:var(--bg1);overflow-x:auto;flex-shrink:0;scrollbar-width:thin;scrollbar-color:var(--bg4) transparent}'
    + '.viz-root .gallery.visible{display:flex}'
    + '.viz-root .gal-label{flex-shrink:0;font-size:10px;font-weight:700;letter-spacing:.8px;color:var(--t3);text-transform:uppercase;padding-right:6px;border-right:1px solid var(--sep);margin-right:4px}'
    + '.viz-root .gal-thumb{flex-shrink:0;width:90px;height:62px;background:var(--bg2);border:1.5px solid var(--sep);border-radius:var(--rs);overflow:hidden;position:relative;cursor:pointer;transition:border-color .14s}'
    + '.viz-root .gal-thumb:hover{border-color:var(--acc)}'
    + '.viz-root .gal-thumb.active{border-color:var(--acc);box-shadow:0 0 0 2px var(--accDim)}'
    + '.viz-root .gal-thumb img{width:100%;height:100%;object-fit:cover;display:block}'
    + '.viz-root .gal-noimg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:var(--t3);background:var(--bg3)}'
    + '.viz-root .gal-del{position:absolute;top:3px;right:3px;width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,.75);border:none;color:#fff;font-size:9px;cursor:pointer;display:none;align-items:center;justify-content:center}'
    + '.viz-root .gal-thumb:hover .gal-del{display:flex}'
    + '.viz-root .gal-name{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.65);font-size:9px;color:var(--t2);padding:2px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + '.viz-root .chart-area{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;overflow:hidden;position:relative;background:var(--bg0)}'
    + '.viz-root .empty-state{display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}'
    + '.viz-root .empty-icon{width:72px;height:72px;border-radius:50%;background:var(--accDim);border:1.5px solid var(--accBorder);display:flex;align-items:center;justify-content:center;font-size:30px}'
    + '.viz-root .empty-state h3{font-size:15px;font-weight:700;color:var(--t2)}'
    + '.viz-root .empty-state p{font-size:12px;color:var(--t3);line-height:1.7;max-width:300px}'
    + '.viz-root .empty-steps{display:flex;gap:8px;margin-top:4px}'
    + '.viz-root .estep{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 14px;border-radius:var(--r);border:1px solid var(--sep);background:var(--bg2);font-size:11px;color:var(--t2);min-width:80px}'
    + '.viz-root .estep-num{width:22px;height:22px;border-radius:50%;background:var(--accDim);color:var(--acc2);font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center}'
    + '.viz-root .chart-wrapper{width:100%;height:100%;display:none;flex-direction:column;gap:10px}'
    + '.viz-root .chart-wrapper.vis{display:flex}'
    + '.viz-root .chart-ttl{font-size:15px;font-weight:700;text-align:center;color:var(--t1);flex-shrink:0;letter-spacing:-.2px}'
    + '.viz-root .chart-type-tag{font-size:10px;font-weight:700;letter-spacing:.6px;color:var(--acc2);background:var(--accDim);padding:2px 8px;border-radius:99px;display:inline-block;margin:0 auto;flex-shrink:0;width:fit-content;align-self:center}'
    + '.viz-root .canvas-wrap{flex:1;position:relative;min-height:0;min-width:0}'
    + '.viz-root .canvas-wrap canvas{position:absolute;top:0;left:0;width:100%!important;height:100%!important}'
    + '.viz-root .toolbar{display:flex;align-items:center;gap:8px;padding:10px 16px;border-top:1px solid var(--sep);background:var(--bg1);flex-shrink:0}'
    + '.viz-root .toolbar-info{flex:1;font-size:11px;color:var(--t3)}'
    + '.viz-root .toolbar-info strong{color:var(--t2);font-weight:600}'
    + '.viz-root .tbtn{padding:6px 12px;border-radius:var(--rs);font-size:11px;font-weight:700;cursor:pointer;background:var(--bg3);color:var(--t2);border:1.5px solid var(--sep);transition:all .14s;font-family:var(--sans)}'
    + '.viz-root .tbtn:hover{background:var(--bg4);color:var(--t1)}'
    + '.viz-root .tbtn-acc{background:var(--accDim);color:var(--acc2);border-color:var(--accBorder)}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

// ══ SVG THUMBNAILS ════════════════════════════════════════════════
function _V_svg(html) { return '<svg viewBox="0 0 48 36" xmlns="http://www.w3.org/2000/svg">' + html + '</svg>'; }

function _V_svgBarras() { return _V_svg('<rect x="3" y="22" width="8" height="12" rx="1.5" fill="' + _V_ACC + '" opacity=".65"/><rect x="14" y="14" width="8" height="20" rx="1.5" fill="' + _V_ACC + '"/><rect x="25" y="8" width="8" height="26" rx="1.5" fill="' + _V_ACC + '" opacity=".85"/><rect x="36" y="18" width="8" height="16" rx="1.5" fill="' + _V_ACC + '" opacity=".7"/><line x1="1" y1="34" x2="47" y2="34" stroke="' + _V_SEP + '" stroke-width="1"/>'); }
function _V_svgLineas() { return _V_svg('<polyline points="2,28 10,18 20,23 30,10 40,15 47,9" stroke="' + _V_ACC + '" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="2" cy="28" r="2.2" fill="' + _V_ACC2 + '"/><circle cx="10" cy="18" r="2.2" fill="' + _V_ACC2 + '"/><circle cx="20" cy="23" r="2.2" fill="' + _V_ACC2 + '"/><circle cx="30" cy="10" r="2.2" fill="' + _V_ACC2 + '"/><circle cx="40" cy="15" r="2.2" fill="' + _V_ACC2 + '"/><circle cx="47" cy="9" r="2.2" fill="' + _V_ACC2 + '"/>'); }
function _V_svgArea() { return _V_svg('<path d="M2,28 L10,18 L20,23 L30,10 L40,15 L47,9 L47,34 L2,34Z" fill="' + _V_ACCL + '"/><polyline points="2,28 10,18 20,23 30,10 40,15 47,9" stroke="' + _V_ACC + '" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'); }
function _V_svgMulti() { return _V_svg('<polyline points="2,28 12,18 22,23 32,11 42,16 47,10" stroke="' + _V_ACC + '" fill="none" stroke-width="1.8" stroke-linecap="round"/><polyline points="2,32 12,26 22,28 32,20 42,24 47,19" stroke="#0ea5e9" fill="none" stroke-width="1.8" stroke-linecap="round"/><polyline points="2,30 12,22 22,18 32,25 42,16 47,22" stroke="#22c55e" fill="none" stroke-width="1.8" stroke-linecap="round"/>'); }
function _V_svgApiladas() { return _V_svg('<rect x="3" y="24" width="8" height="10" rx="1" fill="' + _V_ACC + '"/><rect x="3" y="16" width="8" height="8" rx="1" fill="' + _V_ACC2 + '" opacity=".75"/><rect x="14" y="18" width="8" height="16" rx="1" fill="' + _V_ACC + '"/><rect x="14" y="10" width="8" height="8" rx="1" fill="' + _V_ACC2 + '" opacity=".75"/><rect x="25" y="12" width="8" height="22" rx="1" fill="' + _V_ACC + '"/><rect x="25" y="4" width="8" height="8" rx="1" fill="' + _V_ACC2 + '" opacity=".75"/><rect x="36" y="20" width="8" height="14" rx="1" fill="' + _V_ACC + '"/><rect x="36" y="12" width="8" height="8" rx="1" fill="' + _V_ACC2 + '" opacity=".75"/>'); }
function _V_svgAgrupadas() { return _V_svg('<rect x="3" y="16" width="5" height="18" rx="1" fill="' + _V_ACC + '"/><rect x="9" y="22" width="5" height="12" rx="1" fill="' + _V_ACC2 + '" opacity=".8"/><rect x="18" y="10" width="5" height="24" rx="1" fill="' + _V_ACC + '"/><rect x="24" y="18" width="5" height="16" rx="1" fill="' + _V_ACC2 + '" opacity=".8"/><rect x="33" y="14" width="5" height="20" rx="1" fill="' + _V_ACC + '"/><rect x="39" y="20" width="5" height="14" rx="1" fill="' + _V_ACC2 + '" opacity=".8"/>'); }
function _V_svgHistograma() { return _V_svg('<rect x="2" y="27" width="6" height="7" rx="1" fill="' + _V_ACC + '" opacity=".55"/><rect x="9" y="20" width="6" height="14" rx="1" fill="' + _V_ACC + '" opacity=".7"/><rect x="16" y="10" width="6" height="24" rx="1" fill="' + _V_ACC + '"/><rect x="23" y="14" width="6" height="20" rx="1" fill="' + _V_ACC + '" opacity=".85"/><rect x="30" y="20" width="6" height="14" rx="1" fill="' + _V_ACC + '" opacity=".7"/><rect x="37" y="26" width="6" height="8" rx="1" fill="' + _V_ACC + '" opacity=".55"/><rect x="44" y="30" width="3" height="4" rx="1" fill="' + _V_ACC + '" opacity=".4"/><line x1="1" y1="34" x2="47" y2="34" stroke="' + _V_SEP + '" stroke-width="1"/>'); }
function _V_svgDispersion() { return _V_svg([[5,30],[9,24],[14,28],[18,18],[22,25],[26,14],[30,21],[34,10],[38,18],[43,7]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.5" fill="' + _V_ACC + '" opacity=".8"/>'; }).join('')); }
function _V_svgLinealidad() { return _V_svg([[4,31],[8,26],[13,24],[18,20],[23,18],[28,15],[33,11],[38,9]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2" fill="' + _V_ACC + '" opacity=".7"/>'; }).join('') + '<line x1="2" y1="33" x2="46" y2="6" stroke="' + _V_ACC2 + '" stroke-width="1.8" stroke-linecap="round" opacity=".9"/>'); }
function _V_svgBurbuja() { return _V_svg('<circle cx="12" cy="24" r="7" fill="' + _V_ACC + '" opacity=".55"/><circle cx="32" cy="13" r="10" fill="' + _V_ACC + '" opacity=".45"/><circle cx="40" cy="27" r="4" fill="' + _V_ACC + '" opacity=".7"/><circle cx="20" cy="29" r="3" fill="' + _V_ACC2 + '" opacity=".8"/><circle cx="22" cy="10" r="5" fill="' + _V_ACC + '" opacity=".5"/>'); }
function _V_svgCircular() { return _V_svg('<circle cx="24" cy="18" r="14" fill="none" stroke="' + _V_ACCL + '" stroke-width="14"/><circle cx="24" cy="18" r="14" fill="none" stroke="' + _V_ACC + '" stroke-width="14" stroke-dasharray="36 52" stroke-dashoffset="0"/><circle cx="24" cy="18" r="14" fill="none" stroke="' + _V_ACC2 + '" stroke-width="14" stroke-dasharray="22 66" stroke-dashoffset="-36"/><circle cx="24" cy="18" r="14" fill="none" stroke="rgba(123,111,224,.5)" stroke-width="14" stroke-dasharray="14 74" stroke-dashoffset="-58"/>'); }
function _V_svgDona() { return _V_svg('<circle cx="24" cy="18" r="13" fill="none" stroke="' + _V_ACC + '" stroke-width="8" stroke-dasharray="36 46" stroke-dashoffset="0"/><circle cx="24" cy="18" r="13" fill="none" stroke="' + _V_ACC2 + '" stroke-width="8" stroke-dasharray="24 58" stroke-dashoffset="-36"/><circle cx="24" cy="18" r="13" fill="none" stroke="rgba(123,111,224,.45)" stroke-width="8" stroke-dasharray="16 66" stroke-dashoffset="-60"/><circle cx="24" cy="18" r="7" fill="#1a1a30"/>'); }
function _V_svgPolar() { return _V_svg('<circle cx="24" cy="18" r="14" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1"/><circle cx="24" cy="18" r="8" fill="none" stroke="rgba(255,255,255,.04)" stroke-width="1"/><circle cx="24" cy="18" r="14" fill="none" stroke="' + _V_ACC + '" stroke-width="14" stroke-dasharray="20 68" stroke-dashoffset="0" opacity=".6"/><circle cx="24" cy="18" r="14" fill="none" stroke="' + _V_ACC2 + '" stroke-width="11" stroke-dasharray="16 72" stroke-dashoffset="-25" opacity=".5"/><circle cx="24" cy="18" r="14" fill="none" stroke="' + _V_ACCL + '" stroke-width="8" stroke-dasharray="12 76" stroke-dashoffset="-48" opacity=".7"/>'); }
function _V_svgRadar() { return _V_svg('<polygon points="24,4 38,14 33,30 15,30 10,14" fill="' + _V_ACCL + '" stroke="' + _V_ACC + '" stroke-width="1.5"/><polygon points="24,10 33,17 29,27 19,27 15,17" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1"/>' + [['24,4'],['38,14'],['33,30'],['15,30'],['10,14']].map(function(p){ var coords = p[0].split(','); return '<circle cx="' + coords[0] + '" cy="' + coords[1] + '" r="2.5" fill="' + _V_ACC2 + '"/>'; }).join('')); }
function _V_svgControl() { return _V_svg('<polyline points="2,28 8,22 14,26 20,14 26,20 32,8 38,16 44,12" stroke="' + _V_ACC + '" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<line x1="2" y1="12" x2="46" y2="12" stroke="rgba(239,68,68,.7)" stroke-width="1.5" stroke-dasharray="4,3"/>' +
  '<line x1="2" y1="28" x2="46" y2="28" stroke="rgba(239,68,68,.7)" stroke-width="1.5" stroke-dasharray="4,3"/>' +
  '<line x1="2" y1="20" x2="46" y2="20" stroke="rgba(34,197,94,.7)" stroke-width="1.5" stroke-dasharray="4,3"/>'); }
function _V_svgDotplot() { return _V_svg([[5,26],[8,20],[12,24],[15,14],[19,22],[22,10],[26,19],[30,8],[34,17],[39,6],[42,14],[46,11]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.2" fill="' + _V_ACC + '"/>'; }).join('') + '<line x1="2" y1="17" x2="47" y2="17" stroke="rgba(34,197,94,.8)" stroke-width="1.8" stroke-dasharray="4,3"/>'); }

// ══ DATA HELPERS ═════════════════════════════════════════════════
function _V_getSheet() {
  try { return getCurrentSheet() || { headers: [], rows: [] }; } catch(e) { return { headers: [], rows: [] }; }
}

function _V_cols() {
  var sheet = _V_getSheet();
  if (!sheet.headers || !sheet.rows) return { all: [], num: [], cat: [] };
  var num = [], cat = [];
  sheet.headers.forEach(function(col, ci) {
    if (col == null) return;
    var numCount = 0, total = Math.min(sheet.rows.length, 100);
    if (total === 0) { cat.push(String(col)); return; }
    for (var ri = 0; ri < total; ri++) {
      if (ci < sheet.rows[ri].length) {
        var v = sheet.rows[ri][ci];
        if (v !== null && v !== '' && !isNaN(parseFloat(String(v).replace(',', '.'))) && isFinite(v)) numCount++;
      }
    }
    if (numCount > total * 0.5) num.push(String(col));
    else cat.push(String(col));
  });
  return { all: sheet.headers.slice(), num: num, cat: cat };
}

function _V_colData(col, maxLen) {
  if (!col) return [];
  var sheet = _V_getSheet();
  var ci = sheet.headers.indexOf(col);
  if (ci < 0) return [];
  var data = [];
  var limit = maxLen || sheet.rows.length;
  for (var ri = 0; ri < sheet.rows.length && data.length < limit; ri++) {
    if (ci < sheet.rows[ri].length) {
      var v = parseFloat(String(sheet.rows[ri][ci]).replace(',', '.'));
      if (!isNaN(v)) data.push(v);
    }
  }
  return data;
}

function _V_colLabels(col, maxLen) {
  if (!col) return [];
  var sheet = _V_getSheet();
  var ci = sheet.headers.indexOf(col);
  if (ci < 0) return [];
  var labels = [];
  var limit = maxLen || sheet.rows.length;
  for (var ri = 0; ri < sheet.rows.length && labels.length < limit; ri++) {
    if (ci < sheet.rows[ri].length) {
      labels.push(String(sheet.rows[ri][ci]));
    }
  }
  return labels;
}

function _V_numCols() { return _V_cols().num; }
function _V_catCols() { return _V_cols().cat; }

function _V_idxLabels() {
  return _V_getSheet().rows.map(function(_, i) { return String(i + 1); });
}
function _V_idxData(maxLen) {
  var sheet = _V_getSheet();
  var limit = maxLen || sheet.rows.length;
  var data = [];
  for (var i = 0; i < sheet.rows.length && data.length < limit; i++) data.push(i + 1);
  return data;
}

// ══ EXTERNAL API (Reportes) ═══════════════════════════════════
window.Visualizacion = {
  getGraficosParaReporte: function(includeAll) {
    var graficos = [];
    try {
      var cutoff = Date.now() - 30 * 60 * 1000;
      var currentFile = typeof datosCurrentFileName !== 'undefined' ? datosCurrentFileName : null;
      _V.gallery.forEach(function(g) {
        if (!includeAll && g.createdAt && g.createdAt < cutoff) return;
        if (currentFile && g.sourceFile && g.sourceFile !== currentFile) return;
        if (g && g.url) graficos.push({ imagen: g.url, titulo: g.title, tipo: g.type || 'desconocido' });
        else if (g && g.vars) {
          var staticImg = _V_generateStaticImage(g);
          if (staticImg) graficos.push({ imagen: staticImg, titulo: g.title, tipo: g.type || 'desconocido' });
        }
      });
      if (graficos.length === 0 && _V.chart && _V.chart.canvas) {
        graficos.push({ imagen: _V.chart.canvas.toDataURL('image/png'), titulo: (document.getElementById('vizChartTtl') || {}).textContent || 'Gráfico', tipo: _V.type || 'desconocido' });
      }
    } catch(e) { console.warn('[Viz] Error en getGraficosParaReporte:', e); }
    return graficos;
  }
};

// ══ INIT ═════════════════════════════════════════════════════════
function initVizPage() {
  _V_injectCSS();

  if (_V.chart) { try { _V.chart.destroy(); } catch(e) {} _V.chart = null; }

  _V.cat = 'comp';
  _V.type = null;
  _V.vals = {};
  _V.vals.x = '__index__';
  _V.palette = 'violet';
  _V._galleryMode = false;

  vizBuildCatTabs();
  vizBuildChartGrid();
  vizBuildPalettes();
  vizBuildAxisConfig();
  _V_loadGallery();
  vizRefreshGallery();

  _V_observeTheme();
  _V_syncAutoIdxUI();
}

function _V_observeTheme() {
  var html = document.documentElement;
  var observer = new MutationObserver(function() {
    if (_V.chart && _V.chart.canvas) {
      vizRenderChart();
      if (_V._galleryMode) {
        var ttlEl = document.getElementById('vizChartTtl');
        if (ttlEl && _V._galleryTitle) ttlEl.textContent = _V._galleryTitle;
      }
    }
  });
  observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  _V._themeObserver = observer;
}

// ══ UI BUILDERS ════════════════════════════════════════════════
function vizBuildCatTabs() {
  var el = document.getElementById('vizCatTabs');
  if (!el) return;
  el.innerHTML = _V_CATS.map(function(c) {
    return '<button class="cat-tab' + (c.id === _V.cat ? ' act' : '') + '" onclick="vizSelCat(\'' + c.id + '\')">' + c.lbl + '</button>';
  }).join('');
}

function vizBuildChartGrid() {
  var el = document.getElementById('vizChartGrid');
  if (!el) return;
  var cat = null;
  for (var i = 0; i < _V_CATS.length; i++) {
    if (_V_CATS[i].id === _V.cat) { cat = _V_CATS[i]; break; }
  }
  if (!cat) return;
  el.innerHTML = cat.types.map(function(t) {
    var typeDef = _V_TYPES[t];
    if (!typeDef) return '';
    return '<div class="ct' + (_V.type === t ? ' sel' : '') + '" onclick="vizSelType(\'' + t + '\')" title="' + typeDef.lbl + '">' +
      typeDef.svg +
      '<div class="ct-lbl">' + typeDef.lbl + '</div></div>';
  }).join('');
}

function vizBuildPalettes() {
  var el = document.getElementById('vizPalettes');
  if (!el) return;
  el.innerHTML = _V_PALETTES.map(function(p) {
    return '<div class="pal' + (p.id === _V.palette ? ' act' : '') + '" onclick="vizSelPalette(\'' + p.id + '\')" title="' + p.lbl + '">' +
      p.c.map(function(c) { return '<div class="pal-sw" style="background:' + c + '"></div>'; }).join('') +
      '</div>';
  }).join('');
}

function vizBuildAxisConfig() {
  var el = document.getElementById('vizAxisBody');
  if (!el) return;
  if (!_V.type) {
    el.innerHTML = '<div class="axis-hint">Selecciona un tipo de gráfico primero</div>';
    return;
  }
  var slots = _V_AXIS[_V.type];
  if (!slots) { el.innerHTML = '<div class="axis-hint">Configuración no disponible</div>'; return; }
  var cols = _V_cols().all;
  var hasX = slots.some(function(s) { return s.k === 'x'; });
  var useIndex = _V.vals.x === '__index__';

  var html = '';

  if (hasX) {
    html += '<label class="auto-idx-cb" style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--t2);cursor:pointer;padding:4px 0 8px;border-bottom:1px solid var(--sep);margin-bottom:6px">' +
      '<input type="checkbox" id="vizAutoIdx"' + (useIndex ? ' checked' : '') + '> 🔢 Índice automático (1, 2, 3...)</label>';
  }

  html += slots.map(function(slot) {
    var isX = slot.k === 'x';
    var disabled = isX && useIndex;
    return '<div class="slot">' +
      '<label class="slot-lbl">' + slot.lbl +
        (slot.k.indexOf('3') >= 0 || slot.lbl.indexOf('opcional') >= 0 ? '<span class="slot-badge">opcional</span>' : '') +
      '</label>' +
      '<select class="slot-sel" id="vizAx_' + slot.k + '"' +
        (disabled ? ' disabled style="opacity:.4;pointer-events:none"' : '') +
        ' onchange="_V.vals[\'' + slot.k + '\']=this.value">' +
        '<option value="">— Seleccionar —</option>' +
        cols.map(function(c) {
          var sel = (!useIndex && _V.vals[slot.k] === c) ? ' selected' : '';
          return '<option value="' + c.replace(/"/g, '&quot;') + '"' + sel + '>' + escapeHtml(c) + '</option>';
        }).join('') +
      '</select></div>';
  }).join('');

  el.innerHTML = html;

  if (hasX) {
    var cb = document.getElementById('vizAutoIdx');
    if (cb) cb.onchange = function() {
      _V.vals.x = this.checked ? '__index__' : '';
      _V_syncAutoIdxUI();
      vizBuildAxisConfig();
    };
  }
}

// ══ INTERACTIONS ═══════════════════════════════════════════════
function vizSelCat(id) {
  _V.cat = id;
  vizBuildCatTabs();
  vizBuildChartGrid();
}

function vizSelType(type) {
  _V.type = type;
  _V.vals = {};
  _V._galleryMode = false;
  vizBuildChartGrid();
  vizBuildAxisConfig();
  var axisEl = document.getElementById('vizAxisBody');
  if (axisEl) axisEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function vizSelPalette(id) {
  _V.palette = id;
  vizBuildPalettes();
}

function vizFlipToggle(key, btnId) {
  _V.opts[key] = !_V.opts[key];
  var btn = document.getElementById(btnId);
  if (btn) btn.classList.toggle('on', _V.opts[key]);
}

function vizToggleSec(hdr) {
  if (!hdr) return;
  var body = hdr.nextElementSibling;
  if (!body) return;
  var closed = body.style.maxHeight === '0px';
  body.style.maxHeight = closed ? '500px' : '0px';
  hdr.classList.toggle('closed', !closed);
  var chev = hdr.querySelector('.chev');
  if (chev) chev.textContent = closed ? '▼' : '▶';
}

// ══ CHART HELPERS ═══════════════════════════════════════════════
function _V_isLight() {
  return document.documentElement.getAttribute('data-theme') === 'light';
}

function _V_palette() {
  for (var i = 0; i < _V_PALETTES.length; i++) {
    if (_V_PALETTES[i].id === _V.palette) return _V_PALETTES[i].c;
  }
  return _V_PALETTES[0].c;
}

function _V_baseOpts() {
  var isLight = _V_isLight();
  var gc = isLight ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.06)';
  var tc = isLight ? 'rgba(100,116,139,.8)' : 'rgba(200,200,220,.5)';
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: _V.opts.anim ? 700 : 0 },
    plugins: {
      legend: {
        display: _V.opts.legend,
        labels: { color: tc, font: { size: 11 }, boxWidth: 12, padding: 12 },
      },
      tooltip: {
        backgroundColor: isLight ? 'rgba(255,255,255,.96)' : 'rgba(18,18,38,.95)',
        titleColor: isLight ? '#0f172a' : '#eaeaf8',
        bodyColor: isLight ? '#64748b' : '#7878a0',
        borderColor: isLight ? 'rgba(100,116,139,.25)' : 'rgba(123,111,224,.3)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: _V.opts.grid ? gc : 'transparent', drawTicks: false },
        ticks: { color: tc, font: { size: 11 }, padding: 6 },
        border: { display: false },
      },
      y: {
        grid: { color: _V.opts.grid ? gc : 'transparent' },
        ticks: { color: tc, font: { size: 11 }, padding: 6 },
        border: { display: false },
      },
    },
  };
}

function _V_buildConfig() {
  var c = _V_palette();
  var v = _V.vals;
  var opts = _V_baseOpts();

  switch (_V.type) {
    case 'barras': {
      var lbl = v.x === '__index__' ? _V_idxLabels() : _V_colLabels(v.x || _V_catCols()[0] || '');
      var dat = _V_colData(v.y || _V_numCols()[0] || '', lbl.length);
      if (!dat.length) { showToast('No hay datos para Barras'); return null; }
      return { type: 'bar', data: { labels: lbl, datasets: [{ label: v.y || 'Valor', data: dat, backgroundColor: c[0] + 'cc', borderColor: c[0], borderWidth: 1, borderRadius: 5, borderSkipped: false }] }, options: opts };
    }
    case 'agrupadas': {
      var lbl = v.x === '__index__' ? _V_idxLabels() : _V_colLabels(v.x || _V_catCols()[0] || '');
      var d1 = _V_colData(v.y || _V_numCols()[0] || '', lbl.length);
      var d2 = _V_colData(v.grupo || (_V_numCols()[1] || ''), lbl.length);
      if (!d1.length) { showToast('No hay datos para Agrupadas'); return null; }
      return { type: 'bar', data: { labels: lbl, datasets: [
        { label: v.y || 'Grupo A', data: d1, backgroundColor: c[0] + 'cc', borderRadius: 4 },
        { label: v.grupo || 'Grupo B', data: d2.length ? d2 : d1.map(function(n){ return Math.round(n * 0.7); }), backgroundColor: c[1] + 'cc', borderRadius: 4 },
      ]}, options: opts };
    }
    case 'apiladas': {
      var lbl = v.x === '__index__' ? _V_idxLabels() : _V_colLabels(v.x || _V_catCols()[0] || '');
      var d1 = _V_colData(v.y || _V_numCols()[0] || '', lbl.length);
      var d2 = _V_colData(v.pila || (_V_numCols()[1] || ''), lbl.length);
      var nc = _V_numCols();
      var d3 = _V_colData(nc[2] || '', lbl.length);
      if (!d1.length) { showToast('No hay datos para Apiladas'); return null; }
      var o2 = JSON.parse(JSON.stringify(opts));
      o2.scales.x.stacked = true; o2.scales.y.stacked = true;
      return { type: 'bar', data: { labels: lbl, datasets: [
        { label: 'Capa A', data: d1, backgroundColor: c[0] + 'cc', borderRadius: 2 },
        { label: 'Capa B', data: d2.length ? d2 : d1.map(function(n){ return Math.round(n * 0.5); }), backgroundColor: c[1] + 'cc', borderRadius: 2 },
        { label: 'Capa C', data: d3.length ? d3 : d1.map(function(n){ return Math.round(n * 0.3); }), backgroundColor: c[2] + 'cc', borderRadius: 2 },
      ]}, options: o2 };
    }
    case 'lineas': {
      var lbl = v.x === '__index__' ? _V_idxLabels() : _V_colLabels(v.x || _V_catCols()[0] || '');
      var dat = _V_colData(v.y || _V_numCols()[0] || '', lbl.length);
      if (!dat.length) { showToast('No hay datos para Líneas'); return null; }
      return { type: 'line', data: { labels: lbl, datasets: [{ label: v.y || 'Valor', data: dat, borderColor: c[0], backgroundColor: 'transparent', pointBackgroundColor: c[1], pointRadius: 4, pointHoverRadius: 6, tension: _V.opts.smooth ? 0.4 : 0.1 }]}, options: opts };
    }
    case 'area': {
      var lbl = v.x === '__index__' ? _V_idxLabels() : _V_colLabels(v.x || _V_catCols()[0] || '');
      var dat = _V_colData(v.y || _V_numCols()[0] || '', lbl.length);
      if (!dat.length) { showToast('No hay datos para Área'); return null; }
      return { type: 'line', data: { labels: lbl, datasets: [{ label: v.y || 'Valor', data: dat, borderColor: c[0], backgroundColor: c[0] + '33', fill: true, tension: _V.opts.smooth ? 0.4 : 0.1, pointBackgroundColor: c[1], pointRadius: 3, pointHoverRadius: 5 }]}, options: opts };
    }
    case 'multi': {
      var lbl = v.x === '__index__' ? _V_idxLabels() : _V_colLabels(v.x || _V_catCols()[0] || '');
      var nc = _V_numCols();
      var ds = [v.y1 || nc[0], v.y2 || nc[1], v.y3 || nc[2]].filter(function(x){ return x; }).map(function(col, i) {
        return { label: col, data: _V_colData(col, lbl.length), borderColor: c[i], backgroundColor: 'transparent', tension: _V.opts.smooth ? 0.35 : 0.1, pointRadius: 3, pointHoverRadius: 5 };
      });
      if (!ds.length || !ds[0].data.length) { showToast('No hay datos para Multi'); return null; }
      return { type: 'line', data: { labels: lbl, datasets: ds }, options: opts };
    }
    case 'histograma': {
      var raw = _V_colData(v.variable || _V_numCols()[0] || '');
      if (!raw.length) { showToast('No hay datos para Histograma'); return null; }
      var bins = Math.min(Math.max(Math.round(Math.sqrt(raw.length)), 5), 30);
      var mn = Math.min.apply(null, raw), mx = Math.max.apply(null, raw);
      if (mn === mx) { showToast('Todos los valores son iguales'); return null; }
      var step = (mx - mn) / bins;
      var counts = Array(bins).fill(0);
      raw.forEach(function(val) { var i = Math.min(Math.floor((val - mn) / step), bins - 1); counts[i]++; });
      var lbl = counts.map(function(_, i) { return (mn + i * step).toFixed(1); });
      return { type: 'bar', data: { labels: lbl, datasets: [{ label: 'Frecuencia', data: counts, backgroundColor: c[0] + 'cc', borderColor: c[0], borderWidth: 1, borderRadius: 2, barPercentage: 0.95, categoryPercentage: 1 }]}, options: opts };
    }
    case 'dispersion': {
      var xd = v.x === '__index__' ? _V_idxData() : _V_colData(v.x || _V_numCols()[0] || '');
      var yd = _V_colData(v.y || (_V_numCols()[1] || _V_numCols()[0] || ''), xd.length);
      if (!xd.length || !yd.length) { showToast('No hay datos para Dispersión'); return null; }
      var pts = [];
      var minLen = Math.min(xd.length, yd.length);
      for (var i = 0; i < minLen; i++) pts.push({ x: xd[i], y: yd[i] });
      var no = JSON.parse(JSON.stringify(opts));
      return { type: 'scatter', data: { datasets: [{ label: 'Datos', data: pts, backgroundColor: c[0] + '99', pointRadius: 6, pointHoverRadius: 8 }]}, options: no };
    }
    case 'linealidad': {
      var xd = v.x === '__index__' ? _V_idxData() : _V_colData(v.x || _V_numCols()[0] || '');
      var yd = _V_colData(v.y || (_V_numCols()[1] || _V_numCols()[0] || ''), xd.length);
      if (!xd.length || !yd.length) { showToast('No hay datos para Linealidad'); return null; }
      var minLen = Math.min(xd.length, yd.length);
      var pts = [];
      for (var i = 0; i < minLen; i++) pts.push({ x: xd[i], y: yd[i] });
      var n = pts.length;
      var sx = 0, sy = 0, sxy = 0, sx2 = 0;
      for (var i = 0; i < n; i++) { sx += pts[i].x; sy += pts[i].y; sxy += pts[i].x * pts[i].y; sx2 += pts[i].x * pts[i].x; }
      var den = n * sx2 - sx * sx;
      if (den === 0) { showToast('Varianza cero en X'); return null; }
      var m = (n * sxy - sx * sy) / den;
      var b = (sy - m * sx) / n;
      var xMin = Math.min.apply(null, xd);
      var xMax = Math.max.apply(null, xd);
      var ssTot = 0, ssRes = 0;
      for (var i = 0; i < n; i++) {
        ssTot += (pts[i].y - sy / n) * (pts[i].y - sy / n);
        ssRes += (pts[i].y - (m * pts[i].x + b)) * (pts[i].y - (m * pts[i].x + b));
      }
      var r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
      if (!isFinite(r2)) r2 = 0;
      var no = JSON.parse(JSON.stringify(opts));
      return { type: 'scatter', data: { datasets: [
        { label: 'Datos', data: pts, backgroundColor: c[0] + '99', pointRadius: 5, order: 2 },
        { label: 'Regresión (R²=' + r2.toFixed(4) + ')', data: [{ x: xMin, y: m * xMin + b }, { x: xMax, y: m * xMax + b }], type: 'line', borderColor: c[1], backgroundColor: 'transparent', pointRadius: 0, borderWidth: 2, order: 1 },
      ]}, options: no };
    }
    case 'burbuja': {
      var xd = v.x === '__index__' ? _V_idxData() : _V_colData(v.x || _V_numCols()[0] || '');
      var yd = _V_colData(v.y || (_V_numCols()[1] || _V_numCols()[0] || ''), xd.length);
      var rd = _V_colData(v.r || (_V_numCols()[2] || _V_numCols()[0] || ''), xd.length);
      if (!xd.length || !yd.length) { showToast('No hay datos para Burbuja'); return null; }
      var bMinLen = Math.min(xd.length, yd.length, rd.length || xd.length);
      var bData = [];
      for (var i = 0; i < bMinLen; i++) {
        bData.push({ x: xd[i], y: yd[i], r: Math.max(Math.abs(rd[i] || xd[i]) / 10 + 2, 2) });
      }
      return { type: 'bubble', data: { datasets: [{ label: 'Datos', data: bData, backgroundColor: c[0] + '88', borderColor: c[0], borderWidth: 1 }]}, options: opts };
    }
    case 'circular': {
      var lbl = _V_colLabels(v.etq || _V_catCols()[0] || '', 10);
      var dat = _V_colData(v.val || _V_numCols()[0] || '');
      if (!dat.length || !lbl.length) { showToast('No hay datos para Circular'); return null; }
      var vals = lbl.map(function(_, i) { return dat[i] != null ? dat[i] : Math.round(10 + Math.random() * 80); });
      var noScales = JSON.parse(JSON.stringify(opts));
      delete noScales.scales;
      return { type: 'pie', data: { labels: lbl, datasets: [{ data: vals, backgroundColor: c.slice(0, lbl.length), borderColor: 'rgba(0,0,0,.07)', borderWidth: 2, hoverOffset: 8 }]}, options: noScales };
    }
    case 'dona': {
      var lbl = _V_colLabels(v.etq || _V_catCols()[0] || '', 10);
      var dat = _V_colData(v.val || _V_numCols()[0] || '');
      if (!dat.length || !lbl.length) { showToast('No hay datos para Dona'); return null; }
      var vals = lbl.map(function(_, i) { return dat[i] != null ? dat[i] : Math.round(10 + Math.random() * 80); });
      var noScales = JSON.parse(JSON.stringify(opts));
      delete noScales.scales;
      return { type: 'doughnut', data: { labels: lbl, datasets: [{ data: vals, backgroundColor: c.slice(0, lbl.length), borderColor: 'rgba(0,0,0,.05)', borderWidth: 2, hoverOffset: 6 }]}, options: Object.assign(noScales, { cutout: '62%' }) };
    }
    case 'polar': {
      var lbl = _V_colLabels(v.etq || _V_catCols()[0] || '', 8);
      var dat = _V_colData(v.val || _V_numCols()[0] || '');
      if (!dat.length || !lbl.length) { showToast('No hay datos para Polar'); return null; }
      var vals = lbl.map(function(_, i) { return dat[i] != null ? dat[i] : Math.round(20 + Math.random() * 80); });
      var noScales = JSON.parse(JSON.stringify(opts));
      delete noScales.scales;
      return { type: 'polarArea', data: { labels: lbl, datasets: [{ data: vals, backgroundColor: c.slice(0, lbl.length).map(function(cl){ return cl + '99'; }), borderColor: c.slice(0, lbl.length), borderWidth: 1 }]}, options: noScales };
    }
    case 'radar': {
      var lbl = _V_colLabels(v.etq || _V_catCols()[0] || '', 12);
      var d1 = _V_colData(v.y || _V_numCols()[0] || '');
      if (!d1.length || !lbl.length) { showToast('No hay datos para Radar'); return null; }
      var vals = lbl.map(function(_, i) { return d1[i] != null ? d1[i] : Math.round(40 + Math.random() * 60); });
      var d2 = _V_colData(_V_numCols()[1] || '', lbl.length);
      var vals2 = d2.length ? d2 : lbl.map(function() { return Math.round(30 + Math.random() * 60); });
      var noScales = JSON.parse(JSON.stringify(opts));
      delete noScales.scales;
      var gc = _V_isLight() ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.07)';
      var tc2 = _V_isLight() ? 'rgba(100,116,139,.7)' : 'rgba(200,200,220,.5)';
      return { type: 'radar', data: { labels: lbl, datasets: [
        { label: 'Serie A', data: vals, borderColor: c[0], backgroundColor: c[0] + '33', pointBackgroundColor: c[0], pointRadius: 3 },
        { label: 'Serie B', data: vals2, borderColor: c[1], backgroundColor: c[1] + '22', pointBackgroundColor: c[1], pointRadius: 3 },
      ]}, options: Object.assign(noScales, { scales: { r: { grid: { color: gc }, angleLines: { color: gc }, ticks: { color: tc2, font: { size: 10 }, backdropColor: 'transparent' }, pointLabels: { color: tc2, font: { size: 11 } } } } }) };
    }
    case 'dotplot': {
      var col = v.variable || _V_numCols()[0] || '';
      var raw = _V_colData(col);
      if (!raw.length) { showToast('No hay datos para Puntos'); return null; }
      var n = raw.length;
      var mean = raw.reduce(function(a, b) { return a + b; }, 0) / n;
      var pts = raw.map(function(val) {
        return { x: (Math.random() - 0.5) * 1.4, y: val };
      });
      var o = JSON.parse(JSON.stringify(opts));
      o.scales.x = Object.assign(o.scales.x || {}, {
        type: 'linear', min: -1.2, max: 1.2,
        grid: { display: false },
        ticks: { display: false },
        title: { display: false },
      });
      return { type: 'scatter', data: { datasets: [
        { label: col, data: pts, backgroundColor: raw.map(function(v) { return v >= mean ? c[0] + '99' : c[2] + '99'; }), pointRadius: 5, pointHoverRadius: 7, order: 2 },
        { label: 'Promedio (' + mean.toFixed(2) + ')', data: [{ x: -1.2, y: mean }, { x: 1.2, y: mean }], type: 'line', borderColor: '#22c55e', borderWidth: 2, borderDash: [4, 3], pointRadius: 0, order: 1 },
      ]}, options: o };
    }
    case 'control': {
      var xCol = v.x;
      var yCol = v.y || _V_numCols()[0] || '';
      var lbl, dat;

      if (xCol && xCol !== '__index__') {
        lbl = _V_colLabels(xCol);
        dat = _V_colData(yCol, lbl.length);
        var minLen = Math.min(lbl.length, dat.length);
        lbl = lbl.slice(0, minLen);
        dat = dat.slice(0, minLen);
      } else {
        dat = _V_colData(yCol);
        lbl = dat.map(function(_, i) { return String(i + 1); });
      }

      if (!dat.length) { showToast('No hay datos para Gráfico de Control'); return null; }

      var limits = null;
      try { limits = typeof getLimits === 'function' ? getLimits(yCol) : null; } catch(e) {}

      var ucl = limits && limits.ls != null ? limits.ls : null;
      var lcl = limits && limits.li != null ? limits.li : null;
      var cl = limits && limits.lc != null ? limits.lc : null;

      if (cl == null) {
        cl = dat.reduce(function(a, b) { return a + b; }, 0) / dat.length;
      }

      var halfRange = (ucl != null && lcl != null) ? Math.max(ucl - cl, cl - lcl) : 0;
      if (ucl == null && halfRange > 0) ucl = cl + halfRange;
      if (lcl == null && halfRange > 0) lcl = cl - halfRange;

      var datasets = [{
        label: yCol,
        data: dat,
        borderColor: c[0],
        backgroundColor: 'transparent',
        pointBackgroundColor: dat.map(function(v) {
          if ((ucl != null && v > ucl) || (lcl != null && v < lcl)) return '#ef4444';
          return c[1];
        }),
        pointBorderColor: dat.map(function(v) {
          if ((ucl != null && v > ucl) || (lcl != null && v < lcl)) return '#ef4444';
          return c[1];
        }),
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: _V.opts.smooth ? 0.25 : 0.05,
        fill: false,
        order: 2,
      }];

      var limStyle = { borderWidth: 1.5, pointRadius: 0, fill: false, order: 1 };

      if (ucl != null) {
        datasets.push(Object.assign({
          label: 'UCL (' + ucl.toFixed(2) + ')',
          data: lbl.map(function() { return ucl; }),
          borderColor: '#ef4444',
          borderDash: [6, 3],
        }, limStyle));
      }

      if (lcl != null) {
        datasets.push(Object.assign({
          label: 'LCL (' + lcl.toFixed(2) + ')',
          data: lbl.map(function() { return lcl; }),
          borderColor: '#ef4444',
          borderDash: [6, 3],
        }, limStyle));
      }

      datasets.push(Object.assign({
        label: 'Central (' + cl.toFixed(2) + ')',
        data: lbl.map(function() { return cl; }),
        borderColor: '#22c55e',
        borderDash: [4, 3],
      }, limStyle));

      return { type: 'line', data: { labels: lbl, datasets: datasets }, options: opts };
    }
    default: return null;
  }
}

// ══ RENDER ═══════════════════════════════════════════════════════
function vizRenderChart() {
  if (!_V.type) { showToast('Selecciona un tipo de gráfico'); return; }

  var config = _V_buildConfig();
  if (!config) return;

  var titleInput = document.getElementById('vizChartTitle');
  var title = titleInput ? titleInput.value.trim() : '';
  if (!title) {
    title = _V_autoTitle();
  }

  var ttlEl = document.getElementById('vizChartTtl');
  var tagEl = document.getElementById('vizChartTypeTag');
  var emptyEl = document.getElementById('vizEmptyState');
  var wrapperEl = document.getElementById('vizChartWrapper');
  if (ttlEl) ttlEl.textContent = title;
  if (tagEl && _V_TYPES[_V.type]) tagEl.textContent = _V_TYPES[_V.type].lbl.toUpperCase();
  if (emptyEl) emptyEl.style.display = 'none';
  if (wrapperEl) wrapperEl.classList.add('vis');

  if (_V.chart) { try { _V.chart.destroy(); } catch(e) {} _V.chart = null; }

  var canvas = document.getElementById('vizMainChart');
  if (!canvas) { showToast('Error: canvas no encontrado'); return; }

  try {
    Chart.defaults.color = _V_isLight() ? 'rgba(100,116,139,.7)' : 'rgba(200,200,220,.5)';
    _V.chart = new Chart(canvas.getContext('2d'), config);
  } catch(e) { showToast('Error al renderizar: ' + e.message); return; }

  var axCount = 0;
  for (var k in _V.vals) { if (_V.vals[k]) axCount++; }
  var infoEl = document.getElementById('vizToolbarInfo');
  if (infoEl) {
    var paletteLabel = '';
    for (var i = 0; i < _V_PALETTES.length; i++) {
      if (_V_PALETTES[i].id === _V.palette) { paletteLabel = _V_PALETTES[i].lbl; break; }
    }
    infoEl.innerHTML = '<strong>' + (_V_TYPES[_V.type] ? _V_TYPES[_V.type].lbl : '') + '</strong> · Paleta: ' + paletteLabel + ' · ' + axCount + ' variable(s) configurada(s)';
  }

  showToast('✓ Gráfico renderizado');
}

function _V_applyReportColors(config) {
  var dark = '#1e293b';
  Chart.defaults.color = dark;
  if (config.options && config.options.plugins) {
    var p = config.options.plugins;
    if (p.legend && p.legend.labels) p.legend.labels.color = dark;
    if (p.title) p.title.color = dark;
  }
  if (config.options && config.options.scales) {
    ['x', 'y'].forEach(function(axis) {
      var s = config.options.scales[axis];
      if (!s) return;
      if (s.ticks) s.ticks.color = dark;
      if (s.title) s.title.color = dark;
      if (s.grid) s.grid.color = 'rgba(0,0,0,.12)';
    });
  }
  return config;
}

function _V_generateStaticImage(g) {
  if (g.url) return g.url;
  if (!g.vars) return null;
  var savedType = _V.type;
  var savedVals = JSON.parse(JSON.stringify(_V.vals));
  var savedPalette = _V.palette;
  _V.type = g.type;
  _V.vals = JSON.parse(JSON.stringify(g.vars));
  if (g.palette) _V.palette = g.palette;
  var config = _V_buildConfig();
  if (!config) {
    _V.type = savedType; _V.vals = savedVals; _V.palette = savedPalette;
    return null;
  }
  config = _V_applyReportColors(config);
  config.options.responsive = false;
  config.options.animation = false;
  var tc = document.createElement('canvas');
  tc.width = 800; tc.height = 500;
  var tctx = tc.getContext('2d');
  try {
    var tch = new Chart(tctx, config);
    var url = tc.toDataURL('image/png');
    tch.destroy();
    _V.type = savedType; _V.vals = savedVals; _V.palette = savedPalette;
    return url;
  } catch(e) {
    _V.type = savedType; _V.vals = savedVals; _V.palette = savedPalette;
    return null;
  }
}

function _V_formatDate(d) {
  var ms = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return ('0' + d.getDate()).slice(-2) + '/' + ms[d.getMonth()] + '/' + d.getFullYear();
}
function _V_autoTitle() {
  var col = _V.vals.variable || _V.vals.y || _V.vals.y1 || '';
  var typeDef = _V_TYPES[_V.type];
  return (col ? col + ' · ' : '') + (typeDef ? typeDef.lbl : 'Gráfico') + ' · ' + _V_formatDate(new Date());
}

// ══ GALLERY ════════════════════════════════════════════════════
function vizSaveToGallery() {
  if (!_V.chart) { showToast('Renderiza un gráfico primero'); return; }
  var canvas = document.getElementById('vizMainChart');
  if (!canvas) return;
  var ttlEl = document.getElementById('vizChartTtl');
  var title = ttlEl ? (ttlEl.textContent || (_V_TYPES[_V.type] ? _V_TYPES[_V.type].lbl : 'Gráfico')) : 'Gráfico';

  var thumbC = document.createElement('canvas');
  thumbC.width = 200; thumbC.height = 120;
  var thumbCtx = thumbC.getContext('2d');
  thumbCtx.drawImage(canvas, 0, 0, 200, 120);
  var thumb = thumbC.toDataURL('image/png');

  var id = Date.now();
  _V.gallery.unshift({ id: id, title: title, type: _V.type || '', vars: JSON.parse(JSON.stringify(_V.vals)), palette: _V.palette, thumb: thumb, createdAt: Date.now(), sourceFile: datosCurrentFileName || '' });
  if (_V.gallery.length > 30) _V.gallery = _V.gallery.slice(0, 30);
  vizRefreshGallery();
  _V_saveGallery();
  showToast('✓ Guardado en galería');
}

function vizRefreshGallery() {
  var strip = document.getElementById('vizGallery');
  var countEl = document.getElementById('vizGalCount');
  if (!strip) return;
  if (countEl) countEl.textContent = _V.gallery.length;

  if (!_V.gallery.length) { strip.classList.remove('visible'); return; }
  strip.classList.add('visible');

  var existing = strip.querySelectorAll('.gal-thumb');
  existing.forEach(function(el) { el.remove(); });

  _V.gallery.forEach(function(g) {
    var div = document.createElement('div');
    div.className = 'gal-thumb' + (_V._activeGalleryId === g.id ? ' active' : '');
    var thumbSrc = g.thumb || g.url || '';
    div.innerHTML = (thumbSrc ? '<img src="' + thumbSrc + '" alt="' + g.title.replace(/"/g, '&quot;') + '">' : '<div class="gal-noimg">' + (g.type ? g.type[0].toUpperCase() : '?') + '</div>') +
      '<button class="gal-del" onclick="event.stopPropagation();vizDelGallery(' + g.id + ')">✕</button>' +
      '<div class="gal-name">' + escapeHtml(g.title) + '</div>';
    div.onclick = function() { _V_showGalleryChart(g); };
    strip.appendChild(div);
  });
}

function _V_showGalleryChart(g) {
  _V._activeGalleryId = g.id;
  vizRefreshGallery();
  var emptyEl = document.getElementById('vizEmptyState');
  var wrapperEl = document.getElementById('vizChartWrapper');
  var ttlEl = document.getElementById('vizChartTtl');
  var tagEl = document.getElementById('vizChartTypeTag');
  var infoEl = document.getElementById('vizToolbarInfo');

  if (emptyEl) emptyEl.style.display = 'none';
  if (wrapperEl) wrapperEl.classList.add('vis');

  if (g.vars) {
    _V.type = g.type;
    _V.vals = JSON.parse(JSON.stringify(g.vars));
    if (g.palette) _V.palette = g.palette;
    _V._galleryMode = true;
    _V._galleryTitle = g.title;

    vizBuildCatTabs();
    vizBuildChartGrid();
    vizBuildAxisConfig();
    vizBuildPalettes();

    vizRenderChart();

    if (ttlEl) ttlEl.textContent = g.title;
    if (tagEl) tagEl.textContent = g.type ? g.type.toUpperCase() : 'GRÁFICO';
    if (infoEl) infoEl.innerHTML = '<strong>' + escapeHtml(g.title) + '</strong> · Desde galería';

  } else {
    if (ttlEl) ttlEl.textContent = g.title;
    if (tagEl) tagEl.textContent = g.type ? g.type.toUpperCase() : 'GRÁFICO';
    if (infoEl) infoEl.innerHTML = '<strong>' + escapeHtml(g.title) + '</strong> · Desde galería (estático)';

    if (_V.chart) { try { _V.chart.destroy(); } catch(e) {} _V.chart = null; }
    _V._galleryMode = false;

    if (g.url) {
      var canvas = document.getElementById('vizMainChart');
      if (canvas) {
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.onload = function() {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = g.url;
      }
    }
  }
}

function vizDelGallery(id) {
  _V.gallery = _V.gallery.filter(function(g) { return g.id !== id; });
  vizRefreshGallery();
  _V_saveGallery();
}

function vizClearGallery() {
  if (!_V.gallery.length) { showToast('No hay gráficos guardados'); return; }
  if (!confirm('¿Borrar todos los ' + _V.gallery.length + ' gráficos guardados?')) return;
  _V.gallery = [];
  localStorage.removeItem('sigmaPro_vizGallery');
  localStorage.removeItem('sigmaPro_vizGalleryMeta');
  vizRefreshGallery();
  showToast('🗑 Galería limpiada');
}

function _V_saveGallery() {
  try {
    localStorage.setItem('sigmaPro_vizGallery', JSON.stringify(_V.gallery.map(function(g) {
      var item = { id: g.id, title: g.title, type: g.type };
      if (g.vars) item.vars = g.vars;
      if (g.palette) item.palette = g.palette;
      if (g.thumb) item.thumb = g.thumb;
      if (g.url) item.url = g.url;
      if (g.createdAt) item.createdAt = g.createdAt;
      return item;
    })));
  } catch(e) {
    if (e.name === 'QuotaExceededError') {
      try {
        localStorage.setItem('sigmaPro_vizGallery', JSON.stringify(_V.gallery.map(function(g) {
          var item = { id: g.id, title: g.title, type: g.type };
          if (g.vars) item.vars = g.vars;
          if (g.palette) item.palette = g.palette;
          if (g.url) item.url = g.url;
          if (g.createdAt) item.createdAt = g.createdAt;
          return item;
        })));
      } catch(e2) { /* ignore */ }
    }
  }
}

function _V_loadGallery() {
  try {
    var saved = localStorage.getItem('sigmaPro_vizGallery');
    if (saved) {
      var parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) _V.gallery = parsed.slice(0, 30);
    }
  } catch(e) { /* ignore */ }
}

// ══ EXPORT ═══════════════════════════════════════════════════════
function vizExportPNG() {
  var canvas = document.getElementById('vizMainChart');
  if (!canvas) { showToast('Renderiza un gráfico primero'); return; }

  if (_V.chart && _V.chart.canvas) {
    var ttl = ((document.getElementById('vizChartTtl') || {}).textContent || 'grafico').replace(/\s+/g, '_');
    var a = document.createElement('a');
    a.download = ttl + '_' + (_V.type || 'chart') + '.png';
    a.href = _V.chart.canvas.toDataURL('image/png', 1.0);
    a.click();
    showToast('✓ Exportado como PNG');
    return;
  }

  try {
    var a = document.createElement('a');
    a.download = 'grafico.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    showToast('✓ Exportado como PNG');
  } catch(e) { showToast('Error al exportar'); }
}

function vizToggleFS() {
  var el = document.querySelector('.viz-root .chart-area');
  if (!el) return;
  if (!document.fullscreenElement) {
    if (el.requestFullscreen) el.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

// ══ BATCH GRAPH (mantener por compatibilidad) ═══════════════════
var _V_TYPE_MAP = {
  bar: 'barras', line: 'lineas', area: 'area',
  histogram: 'histograma', scatter: 'dispersion',
  control: 'control',
  dotplot: 'dotplot'
};

function showBatchGraphModal() {
  var sheet = _V_getSheet();
  if (!sheet || !sheet.headers || !sheet.headers.length) { showToast('No hay datos cargados'); return; }
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  var colOpts = '<option value="">— Seleccionar —</option>';
  sheet.headers.forEach(function(c) { colOpts += '<option value="' + c.replace(/"/g, '&quot;') + '">' + escapeHtml(c) + '</option>'; });
  var colChkHtml = sheet.headers.map(function(col) {
    var safeId = 'vizModalChk-' + String(col).replace(/[^a-zA-Z0-9_-]/g, '_');
    return '<label style="font-size:11px;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;gap:2px;padding:2px 0">' +
      '<input type="checkbox" class="viz-modal-batch-chk" data-col="' + col.replace(/"/g, '&quot;') + '" id="' + safeId + '" checked> ' + escapeHtml(col) + '</label>';
  }).join('');
  modal.innerHTML = '<div class="modal-box" style="min-width:420px">' +
    '<div class="modal-title">🔁 Generar múltiples gráficos</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0">' +
      '<div class="modal-row"><span class="modal-label">Tipo</span>' +
        '<select id="vizModalType" class="modal-select" style="min-width:120px">' +
          '<option value="histogram">▦ Histograma</option>' +
          '<option value="bar">📊 Barras</option>' +
          '<option value="line">📈 Líneas</option>' +
          '<option value="area">📉 Área</option>' +
          '<option value="scatter">⬡ Dispersión</option>' +
          '<option value="control">📈 Control</option>' +
          '<option value="dotplot">● Puntos</option>' +
        '</select></div>' +
      '<div class="modal-row" id="vizModalXRow"><span class="modal-label">Eje X</span>' +
        '<select id="vizModalColX" class="modal-select" style="min-width:120px">' + colOpts + '</select></div>' +
    '</div>' +
    '<label style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text-muted);cursor:pointer;padding:2px 0 6px" id="vizModalAutoIdxRow">' +
      '<input type="checkbox" id="vizModalAutoIdx"' + (_V.vals.x === '__index__' ? ' checked' : '') + '> 🔢 Índice automático (1, 2, 3...)</label>' +
    '<div style="font-size:11px;color:var(--text-faint);margin:4px 0 2px">Columnas a graficar:</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:4px 12px;max-height:200px;overflow-y:auto;padding:4px 0">' + colChkHtml + '</div>' +
    '<div class="modal-actions" style="margin-top:10px">' +
      '<button class="btn btn-secondary" id="vizModalCancel">Cancelar</button>' +
      '<button class="btn btn-primary" id="vizModalGenerate">🎨 Generar</button>' +
    '</div></div>';
  document.body.appendChild(modal);
  document.getElementById('vizModalAutoIdx').onchange = function() {
    _V.vals.x = this.checked ? '__index__' : '';
    _V_syncAutoIdxUI();
  };
  document.getElementById('vizModalCancel').onclick = function() { modal.remove(); };
  document.getElementById('vizModalGenerate').onclick = function() {
    var type = document.getElementById('vizModalType').value;
    var autoIdx = document.getElementById('vizModalAutoIdx').checked;
    var colX = autoIdx ? '__index__' : document.getElementById('vizModalColX').value;
    var checkboxes = document.querySelectorAll('.viz-modal-batch-chk:checked');
    var selected = [];
    checkboxes.forEach(function(cb) { if (cb.checked) selected.push(cb.dataset.col); });
    if (!selected.length) { showToast('Selecciona al menos una columna'); return; }
    if (type !== 'histogram' && type !== 'dotplot' && !autoIdx && !colX) { showToast('Selecciona Eje X o activa índice automático'); return; }
    modal.remove();
    loadPage('visualizacion');
    setTimeout(function() { _V_batchGenerate(type, colX, selected); }, 150);
  };
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  document.getElementById('vizModalType').onchange = function() {
    var hide = this.value === 'histogram' || this.value === 'dotplot';
    document.getElementById('vizModalXRow').style.display = hide ? 'none' : 'flex';
    document.getElementById('vizModalAutoIdxRow').style.display = hide ? 'none' : 'flex';
  };
  document.getElementById('vizModalType').dispatchEvent(new Event('change'));
}

function _V_batchGenerate(type, colX, selectedCols) {
  var mappedType = _V_TYPE_MAP[type] || 'barras';
  var count = 0;
  var errs = 0;
  var oldAnim = _V.opts.anim;
  _V.opts.anim = false;
  Chart.defaults.color = _V_isLight() ? 'rgba(100,116,139,.7)' : 'rgba(200,200,220,.5)';

  selectedCols.forEach(function(col) {
    if (!col) return;
    var sheet = _V_getSheet();
    if (sheet.headers.indexOf(col) < 0) return;

    if (type === 'histogram') {
      _V.type = 'histograma';
      _V.vals = { variable: col };
    } else if (type === 'dotplot') {
      _V.type = 'dotplot';
      _V.vals = { variable: col };
    } else if (type === 'scatter') {
      if (col === colX) return;
      _V.type = 'dispersion';
      _V.vals = { x: colX, y: col };
    } else {
      if (col === colX) return;
      _V.type = mappedType;
      _V.vals = { x: colX, y: col };
    }

    var config = _V_buildConfig();
    if (!config) return;
    config.options.responsive = false;
    config.options.animation = false;

    var savedVars = JSON.parse(JSON.stringify(_V.vals));
    var savedType = _V.type;

    var thumb = '';
    try {
      var tc = document.createElement('canvas');
      tc.width = 200; tc.height = 120;
      var tctx = tc.getContext('2d');
      var tch = new Chart(tctx, config);
      thumb = tc.toDataURL('image/png');
      tch.destroy();
    } catch(e) { /* thumbnail optional */ }

    var title = _V_autoTitle();
    var id = Date.now() + count;
    _V.gallery.unshift({ id: id, title: title, type: savedType, vars: savedVars, palette: _V.palette, thumb: thumb });
    count++;
  });

  _V.opts.anim = oldAnim;

  if (_V.gallery.length > 0) {
    _V_showGalleryChart(_V.gallery[0]);
  }

  vizRefreshGallery();
  _V_saveGallery();

  var msg = '';
  if (count > 0) msg = '✅ ' + count + ' gráfico(s) generado(s) y guardados en galería';
  else msg = 'No se generaron gráficos';
  if (errs > 0) msg += ' (' + errs + ' error(es))';
  showToast(msg);
}

function _V_syncAutoIdxUI() {
  var active = _V.vals.x === '__index__';
  var menuCb = document.getElementById('menuAutoIdx');
  if (menuCb) menuCb.checked = active;
  var modalCb = document.getElementById('vizModalAutoIdx');
  if (modalCb) modalCb.checked = active;
}
