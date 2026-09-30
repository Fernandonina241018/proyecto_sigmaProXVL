// ========================================
// indexx-validaciones.js — SigmaProXVL
// Área de Validaciones V7 (réplica "Admin Dashboard V7").
// Shell independiente: riel + saludo + stats + actividad + panel derecho.
// Mini-router por hash: #/banco · #/generador · #/protocolos · #/firmas.
// Se activa con el evento 'sigma-area' (Auth/AreaSelect).
// ========================================

const Validaciones = (() => {
  const CATS = [
    { id: 'almacenes', nombre: 'Almacenes', icono: '📦', desc: 'Frío · ambiente · congelador', hot: true },
    { id: 'equipos', nombre: 'Equipos', icono: '🔧', desc: 'Producción y laboratorio' },
    { id: 'sistemas', nombre: 'Sistemas', icono: '🏭', desc: 'HVAC · agua · vapor' },
    { id: 'estabilidad', nombre: 'Estabilidad', icono: '🌡️', desc: 'Cámaras · ICH Q1A' },
    { id: 'software', nombre: 'Software', icono: '💾', desc: 'CSV / GAMP 5' },
  ];

  // Entidades calificables por categoría (el usuario nunca ve ensayos, solo esto).
  const ENTIDADES = {
    almacenes: [
      { id: 'almacen-ambiente-a', nombre: 'Almacén 15–25 °C / HR < 65%' },
      { id: 'almacen-ambiente-b', nombre: 'Almacén 0–30 °C / HR < 80%' },
      { id: 'cuarto-frio', nombre: 'Cuarto frío (2–8 °C)' },
      { id: 'congelador', nombre: 'Congelador (−20 °C)' },
    ],
    equipos: [
      { id: 'tableteadora', nombre: 'Tableteadora rotativa' },
      { id: 'encapsuladora', nombre: 'Encapsuladora / capsuladora' },
      { id: 'mezclador', nombre: 'Mezclador (V / bins)' },
      { id: 'granulador', nombre: 'Granulador' },
      { id: 'lecho-fluido', nombre: 'Lecho fluido' },
      { id: 'llenadora', nombre: 'Llenadora de líquidos' },
      { id: 'liofilizador', nombre: 'Liofilizador' },
      { id: 'autoclave', nombre: 'Autoclave' },
      { id: 'horno-estufa', nombre: 'Horno / estufa' },
      { id: 'tunel-despirogenizacion', nombre: 'Túnel de despirogenización' },
      { id: 'etiquetadora', nombre: 'Etiquetadora' },
      { id: 'blistera', nombre: 'Blístera / encartonadora' },
      { id: 'recubridora', nombre: 'Recubridora' },
      { id: 'secador-bandejas', nombre: 'Secador de bandejas' },
      { id: 'secador-tambor', nombre: 'Secador de tambor' },
      { id: 'reactor', nombre: 'Reactor' },
      { id: 'detector-metales', nombre: 'Detector de metales' },
      { id: 'balanza', nombre: 'Balanza analítica / precisión' },
      { id: 'phmetro', nombre: 'pH-metro' },
      { id: 'espectrofotometro', nombre: 'Espectrofotómetro UV-Vis' },
      { id: 'espectrofotometro-ir', nombre: 'Espectrofotómetro IR' },
      { id: 'espectrometro', nombre: 'Espectrómetro' },
      { id: 'hplc', nombre: 'HPLC' },
      { id: 'gc', nombre: 'Cromatógrafo de gases (GC)' },
      { id: 'disolutor', nombre: 'Disolutor' },
      { id: 'desintegrador', nombre: 'Desintegrador' },
      { id: 'friabilometro', nombre: 'Friabilómetro' },
      { id: 'durometro', nombre: 'Durómetro' },
      { id: 'karl-fischer', nombre: 'Karl Fischer' },
      { id: 'toc', nombre: 'TOC' },
      { id: 'viscosimetro', nombre: 'Viscosímetro' },
      { id: 'incubadora', nombre: 'Incubadora' },
      { id: 'refrigerador-lab', nombre: 'Refrigerador de laboratorio' },
      { id: 'congelador-lab', nombre: 'Congelador de laboratorio' },
      { id: 'centrifuga', nombre: 'Centrífuga' },
      { id: 'termometro', nombre: 'Termómetros / data loggers' },
      { id: 'horno-vacio', nombre: 'Horno de vacío' },
      { id: 'cabina-flujo', nombre: 'Cabina de flujo laminar' },
      { id: 'cabina-bioseguridad', nombre: 'Cabina de bioseguridad' },
      { id: 'cabina-estabilidad', nombre: 'Cabina de estabilidad' },
    ],
    sistemas: [
      { id: 'hvac', nombre: 'HVAC / Climatización' },
      { id: 'agua-purificada', nombre: 'Agua purificada / WFI' },
      { id: 'vapor-limpio', nombre: 'Vapor limpio' },
      { id: 'aire-comprimido', nombre: 'Aire comprimido' },
    ],
    estabilidad: [
      { id: 'cabina-est-acelerada', nombre: 'Cabina estabilidad acelerada (38–42 °C)' },
      { id: 'cabina-est-real', nombre: 'Cabina estabilidad real (28–32 °C)' },
      { id: 'cuarto-est-acelerada', nombre: 'Cuarto estabilidad acelerada' },
      { id: 'cuarto-est-real', nombre: 'Cuarto estabilidad real' },
      { id: 'incubadora-22-27', nombre: 'Incubadora (22–27 °C)' },
      { id: 'incubadora-38-42', nombre: 'Incubadora (38–42 °C)' },
      { id: 'horno-secado', nombre: 'Horno de secado' },
    ],
    software: [
      { id: 'software-gxp', nombre: 'Sistema computarizado GxP' },
      { id: 'lims', nombre: 'LIMS' },
      { id: 'erp', nombre: 'ERP' },
      { id: 'excel-validado', nombre: 'Hojas de cálculo validadas' },
    ],
  };

  // Plantilla adaptativa: comunes + específicos por categoría.
  // tipo: text | select | date. req: obligatorio.
  const SCHEMAS = {
    _comun: [
      { k: 'logo', label: 'Logo', tipo: 'file', req: false },
      { k: 'responsable', label: 'Responsable', tipo: 'text', req: true },
      { k: 'fecha', label: 'Fecha', tipo: 'date', req: true },
    ],
    almacenes: [
      {
        k: 'codigo',
        label: 'Código',
        tipo: 'text',
        req: true
      },
      {
        k: 'descripcion',
        label: 'Descripción',
        tipo: 'text',
        req: true
      },
      {
        k: 'ubicacion',
        label: 'Ubicación',
        tipo: 'text',
        req: true
      },
      {
        k: 'tipo',
        label: 'Tipo de almacén',
        tipo: 'select',
        req: true,
        opciones: [
          'Ambiente',
          'Temperatura controlada',
          'Cuarto frío',
          'Congelador'
        ]
      },
      {
        k: 'temperaturaMin',
        label: 'Temperatura mínima (°C)',
        tipo: 'number',
        req: true
      },
      {
        k: 'temperaturaMax',
        label: 'Temperatura máxima (°C)',
        tipo: 'number',
        req: true
      },
      {
        k: 'humedadMin',
        label: 'Humedad relativa mínima (%HR)',
        tipo: 'number',
        req: false
      },
      {
        k: 'cantidadDataLoggers',
        label: 'Cantidad de data loggers',
        tipo: 'number',
        req: false
      },
      {
        k: 'controlCambios',
        label: 'Control de cambios #',
        tipo: 'text',
        req: false
      },
      {
  k: 'tipoCalificacion',
  label: 'Tipo de calificación',
  tipo: 'select',
  req: true,
  opciones: [
    'Calificación inicial',
    'Recalificación',
    'Calificación posterior a modificación',
    'Calificación posterior a traslado'
  ]
},
{
  k: 'estudio',
  label: 'Tipo de estudio',
  tipo: 'select',
  req: true,
  opciones: [
    'Distribución de temperatura',
    'Distribución de temperatura y humedad',
    'Mapeo térmico',
    'Mapeo térmico bajo carga',
    'Mapeo térmico sin carga'
  ]
    },
    {
      k: 'condicionEstudio',
      label: 'Condición del estudio',
      tipo: 'select',
      req: true,
      opciones: [
        'Sin carga',
        'Carga mínima',
        'Carga normal',
        'Carga máxima',
        'Carga representativa'
      ]
    },
    {
      k: 'duracionEstudio',
      label: 'Duración del estudio',
      tipo: 'text',
      req: true
    },
    {
      k: 'intervaloRegistro',
      label: 'Intervalo de registro',
      tipo: 'text',
      req: true
    },
    {
      k: 'cantidadDataLoggers',
      label: 'Cantidad de data loggers',
      tipo: 'number',
      req: false
    }

    ],
    
    estabilidad: [
      { k: 'descripcion', label: 'Descripción', tipo: 'text', req: true },
      { k: 'setpoint', label: 'Setpoint T°/HR', tipo: 'text', req: true },
      { k: 'camara', label: 'Cámara', tipo: 'text', req: true },
      { k: 'norma', label: 'Norma', tipo: 'select', req: true, opciones: ['ICH Q1A', 'Otra'] },
    ],
    equipos: [
      { k: 'descripcion', label: 'Descripción', tipo: 'text', req: true },
      { k: 'marca', label: 'Marca', tipo: 'text', req: true },
      { k: 'modelo', label: 'Modelo', tipo: 'text', req: true },
      { k: 'serie', label: 'Serie', tipo: 'text', req: false },
      { k: 'codigo', label: 'Código', tipo: 'text', req: true },
      { k: 'ubicacion', label: 'Ubicación', tipo: 'text', req: true },
    ],
    sistemas: [
      { k: 'descripcion', label: 'Descripción', tipo: 'text', req: true },
      { k: 'sistema', label: 'Sistema', tipo: 'select', req: true, opciones: ['HVAC', 'Agua purificada', 'Vapor limpio', 'Aire comprimido'] },
      { k: 'area', label: 'Área que atiende', tipo: 'text', req: true },
      { k: 'setpoints', label: 'Setpoints', tipo: 'text', req: true },
    ],
    software: [
      { k: 'descripcion', label: 'Descripción', tipo: 'text', req: true },
      { k: 'version', label: 'Versión / build', tipo: 'text', req: true },
      { k: 'modulos', label: 'Módulos en alcance', tipo: 'text', req: true },
      { k: 'gamp', label: 'Categoría GAMP 5', tipo: 'select', req: true, opciones: ['1', '3', '4', '5'] },
    ],
  };

  function getSchema(cat) {
    return (SCHEMAS._comun || []).concat(SCHEMAS[cat] || []);
  }

  function getEntidades(cat) {
    return ENTIDADES[cat] || [];
  }

  function draftKey(entId) {
    return 'val-borrador-' + entId;
  }

  function saveDraft(entId, data) {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(draftKey(entId), JSON.stringify(data || {}));
        return true;
      }
    } catch (e) {}
    return false;
  }

  function loadDraft(entId) {
    try {
      if (typeof sessionStorage !== 'undefined') {
        return JSON.parse(sessionStorage.getItem(draftKey(entId)) || '{}');
      }
    } catch (e) {}
    return {};
  }

  const ROUTES = [
    { id: 'banco', icono: '▦' },
    { id: 'generador', icono: '📄' },
    { id: 'protocolos', icono: '📋' },
    { id: 'firmas', icono: '✍️' },
  ];

  const VALID_ROUTES = ROUTES.map((r) => r.id);

  function parseRoute(hash) {
    const h = String(hash || '').replace(/^#\/?/, '').split('?')[0];
    if (VALID_ROUTES.indexOf(h) >= 0) return h;
    const m = h.match(/^entidad\/([a-z-]+)$/);
    if (m && ENTIDADES[m[1]]) return h;
    return 'banco';
  }

  function catById(id) {
    return CATS.filter((c) => c.id === id)[0] || null;
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
      + '<div class="v7-cats-head">Categorías <a href="#/banco" target="_self">ver todo</a></div>'
      + '<div class="v7-cats" id="v7-cats">'
      + CATS.map((c) => '<a class="v7-cat' + (c.hot ? ' hot' : '') + '" href="#/entidad/' + c.id + '" target="_self" data-name="' + esc(c.nombre) + '">'
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

  function fieldHtml(f, val) {
    const v = val == null ? '' : String(val);
    const req = f.req ? ' data-req="1"' : '';
    const lab = '<label class="v7-field" data-f="' + f.k + '"><span>' + esc(f.label) + (f.req ? ' <b>*</b>' : '') + '</span>';
    if (f.tipo === 'select') {
      const opts = ['<option value="">— Seleccione —</option>'].concat(
        (f.opciones || []).map((o) => '<option value="' + esc(o) + '"' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>')
      ).join('');
      return lab + '<select data-k="' + f.k + '"' + req + '>' + opts + '</select></label>';
    }
    if (f.tipo === 'date') {
      return lab + '<input type="date" data-k="' + f.k + '"' + req + ' value="' + esc(v) + '"></label>';
    }
    if (f.tipo === 'number') {
      return lab + '<input type="number" step="any" data-k="' + f.k + '"' + req + ' value="' + esc(v) + '"></label>';
    }
    if (f.tipo === 'file') {
      return lab + '<input type="file" accept="image/*" data-k="' + f.k + '"' + req + '></label>';
    }
    return lab + '<input type="text" data-k="' + f.k + '"' + req + ' value="' + esc(v) + '"></label>';
  }

  const FASES_GEN = ['DQ', 'IQ', 'OQ', 'PQ'];
  const GEN_CATS = ['almacenes'];

  function genKey(entId) {
    return 'val-gen-' + entId;
  }

  function saveGen(entId, sel) {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(genKey(entId), JSON.stringify(sel || {}));
        return true;
      }
    } catch (e) {}
    return false;
  }

  function loadGen(entId) {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const s = JSON.parse(sessionStorage.getItem(genKey(entId)) || 'null');
        if (s && Array.isArray(s.fases)) return { fases: s.fases, cond: s.cond || 'ambas' };
      }
    } catch (e) {}
    return { fases: FASES_GEN.slice(), cond: 'ambas' };
  }

  function contarGen(fase, cond) {
    try {
      if (typeof GeneradorDocx !== 'undefined' && GeneradorDocx.contarEnsayos) {
        return GeneradorDocx.contarEnsayos(fase, cond);
      }
    } catch (e) {}
    return null;
  }

  function paso3Html() {
    return '<div class="v7-genrow">'
      + FASES_GEN.map((f) => '<label class="v7-check"><input type="checkbox" class="gen-fase" value="' + f + '" checked><span>' + f + '</span></label>').join('')
      + '<label class="v7-cond">Condición '
      + '<select class="gen-cond"><option value="ambas">Estática + dinámica</option>'
      + '<option value="est">Solo estática</option><option value="dina">Solo dinámica</option></select></label>'
      + '</div>'
      + '<div class="v7-genresumen" role="status"></div>'
      + '<div class="v7-form-actions">'
      + '<span class="v7-gen-msg" role="status"></span>'
      + '<button type="button" class="v7-btn-download">Generar y descargar</button>'
      + '</div>';
  }

  function viewEntidad(catId) {
    const cat = catById(catId);
    if (!cat) return viewBanco();
    const ents = getEntidades(catId);
    const comun = SCHEMAS._comun || [];
    const espec = SCHEMAS[catId] || [];
    const conGen = GEN_CATS.indexOf(catId) >= 0;
    return '<div class="v7-view v7-form-flow">'
      + '<div class="v7-crumb"><a href="#/banco" target="_self">Banco</a> <span>›</span> ' + esc(cat.nombre) + '</div>'
      + '<h1>' + esc(cat.nombre) + ' · Planilla de datos</h1>'
      + '<p class="sub">Cargue los datos de la entidad. No se muestran ensayos: el protocolo se genera después con estos datos.</p>'
      + '<div class="v7-step" data-step="1">'
      + '<div class="gt">1 · Seleccione la entidad</div>'
      + '<div class="v7-ents">'
      + ents.map((e) => '<button type="button" class="v7-ent" data-ent="' + esc(e.id) + '">' + esc(e.nombre) + '</button>').join('')
      + '</div></div>'
      + '<div class="v7-step" data-step="2" hidden>'
      + '<div class="gt">2 · Datos de la entidad</div>'
      + '<form class="v7-dataform" novalidate>'
      + '<fieldset class="v7-fs"><legend>Datos generales</legend><div class="v7-grid">'
      + comun.map((f) => fieldHtml(f, '')).join('')
      + '</div></fieldset>'
      + '<fieldset class="v7-fs"><legend>' + esc(cat.nombre) + ' · Datos específicos</legend><div class="v7-grid">'
      + espec.map((f) => fieldHtml(f, '')).join('')
      + '</div></fieldset>'
      + '<div class="v7-form-actions">'
      + '<span class="v7-form-msg" role="status"></span>'
      + '<button type="button" class="v7-btn-save">Guardar borrador</button>'
      + (conGen ? '' : '<button type="button" class="v7-btn-gen" disabled title="Próximamente">Generar (próximamente)</button>')
      + '</div></form>'
      + '</div>'
      + '<div class="v7-step" data-step="3" hidden>'
      + '<div class="gt">3 · Protocolos a generar</div>'
      + (conGen ? paso3Html()
        : '<div class="v7-empty">Generador disponible próximamente para esta categoría.</div>')
      + '</div></div>';
  }

  function bindEntidad(main, catId) {
    const schema = getSchema(catId);
    const step2 = main.querySelector('.v7-step[data-step="2"]');
    const step3 = main.querySelector('.v7-step[data-step="3"]');
    const form = main.querySelector('.v7-dataform');
    if (!step2 || !form) return;
    const conGen = GEN_CATS.indexOf(catId) >= 0;
    let entActual = null;
    const msg = form.querySelector('.v7-form-msg');

    function setMsg(text, ok) {
      if (msg) {
        msg.textContent = text || '';
        msg.className = 'v7-form-msg' + (text ? (ok ? ' ok' : ' err') : '');
      }
    }

    function validar() {
      let falta = 0;
      schema.forEach((f) => {
        if (!f.req) return;
        const el = form.querySelector('[data-k="' + f.k + '"]');
        if (!el || (el.type !== 'file' && !String(el.value || '').trim())) falta++;
      });
      return falta;
    }

    function recoger() {
      const data = {};
      schema.forEach((f) => {
        const el = form.querySelector('[data-k="' + f.k + '"]');
        if (!el) return;
        if (f.tipo === 'file') { if (el.files && el.files[0]) data[f.k] = el.files[0].name; return; }
        data[f.k] = String(el.value || '');
      });
      data._entidad = entActual;
      data._cat = catId;
      return data;
    }

    function cargar(data) {
      schema.forEach((f) => {
        const el = form.querySelector('[data-k="' + f.k + '"]');
        if (el && f.tipo !== 'file' && data[f.k] != null) el.value = data[f.k];
      });
    }

    function entidadObj() {
      const list = getEntidades(catId);
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === entActual) return list[i];
      }
      return { id: entActual, nombre: entActual };
    }

    function leerSel3() {
      const fases = [];
      if (step3) {
        step3.querySelectorAll('.gen-fase').forEach((ch) => { if (ch.checked) fases.push(ch.value); });
      }
      const condEl = step3 ? step3.querySelector('.gen-cond') : null;
      return { fases: fases, cond: condEl ? condEl.value : 'ambas' };
    }

    function pintarResumen3() {
      if (!step3 || !conGen) return;
      const sel = leerSel3();
      const box = step3.querySelector('.v7-genresumen');
      if (box) {
        const parts = sel.fases.map((f) => {
          const n = contarGen(f, sel.cond);
          return f + (n == null ? '' : ' (' + n + ' ensayos)');
        });
        box.innerHTML = '<strong>DOCUMENTOS A GENERAR:</strong> '
          + (parts.length ? esc(parts.join(' · ')) : 'ninguno seleccionado');
      }
      if (entActual) saveGen(entActual, sel);
    }

    function restaurarSel3() {
      if (!step3 || !conGen || !entActual) return;
      const sel = loadGen(entActual);
      step3.querySelectorAll('.gen-fase').forEach((ch) => {
        ch.checked = sel.fases.indexOf(ch.value) >= 0;
      });
      const condEl = step3.querySelector('.gen-cond');
      if (condEl) condEl.value = sel.cond;
      pintarResumen3();
    }

    function setGenMsg(text, ok) {
      const gm = step3 ? step3.querySelector('.v7-gen-msg') : null;
      if (gm) {
        gm.textContent = text || '';
        gm.className = 'v7-gen-msg' + (text ? (ok ? ' ok' : ' err') : '');
      }
    }

    async function generarDescargar() {
      if (!conGen || typeof GeneradorDocx === 'undefined') {
        setGenMsg('Generador no disponible.', false);
        return;
      }
      const falta = validar();
      if (falta) { setGenMsg('Complete el borrador del paso 2 (' + falta + ' campo(s)).', false); return; }
      const sel = leerSel3();
      if (!sel.fases.length) { setGenMsg('Seleccione al menos un protocolo.', false); return; }
      saveGen(entActual, sel);
      const draft = recoger();
      const ent = entidadObj();
      const btn = step3.querySelector('.v7-btn-download');
      if (btn) btn.disabled = true;
      try {
        for (let i = 0; i < sel.fases.length; i++) {
          const f = sel.fases[i];
          setGenMsg('Generando ' + f + '… (' + (i + 1) + '/' + sel.fases.length + ')', true);
          // IQ/OQ/PQ: plantilla real del modelo; DQ: ensamblador propio.
          if (typeof PlantillaDocx !== 'undefined' && PlantillaDocx.soporta(f)) {
            if (typeof window !== 'undefined' && (typeof DecompressionStream === 'undefined' || typeof CompressionStream === 'undefined')) {
              throw new Error('El navegador no soporta compresión ZIP (use Edge/Chrome).');
            }
            const r = await PlantillaDocx.descargar(f, draft, ent, sel.cond);
            if (r && r.avisos && r.avisos.length) setGenMsg('[' + f + '] ' + r.avisos[0], true);
          } else {
            if (typeof window !== 'undefined' && !window.docx) {
              throw new Error('Cargando librería docx… reintente en unos segundos.');
            }
            await GeneradorDocx.descargar(f, draft, ent, sel.cond);
          }
        }
        setGenMsg('Descargados ' + sel.fases.length + ' documento(s).', true);
      } catch (err) {
        setGenMsg('Error al generar: ' + (err && err.message ? err.message : err), false);
      }
      if (btn) btn.disabled = false;
    }

    main.addEventListener('click', function (e) {
      const ent = e.target && e.target.closest ? e.target.closest('.v7-ent') : null;
      if (ent) {
        entActual = ent.getAttribute('data-ent');
        main.querySelectorAll('.v7-ent').forEach((b) => b.classList.toggle('sel', b === ent));
        step2.hidden = false;
        const draft = loadDraft(entActual);
        cargar(draft);
        setMsg(Object.keys(draft).length ? 'Borrador cargado' : '', true);
        if (step3 && conGen) {
          step3.hidden = false;
          restaurarSel3();
        }
        try { step2.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (err) {}
        return;
      }
      if (e.target && e.target.classList && e.target.classList.contains('v7-btn-save')) {
        e.preventDefault();
        const falta = validar();
        if (falta) { setMsg('Complete ' + falta + ' campo(s) obligatorio(s).', false); return; }
        const ok = saveDraft(entActual, recoger());
        setMsg(ok ? 'Borrador guardado' : 'No se pudo guardar', ok);
        return;
      }
      if (e.target && e.target.classList && e.target.classList.contains('v7-btn-gen')) {
        e.preventDefault();
        return;
      }
      if (e.target && e.target.classList && e.target.classList.contains('v7-btn-download')) {
        e.preventDefault();
        generarDescargar();
        return;
      }
      if (e.target && e.target.classList && e.target.classList.contains('gen-fase')) {
        pintarResumen3();
      }
    });

    if (step3 && step3.addEventListener) {
      step3.addEventListener('change', function (e) {
        if (e.target && e.target.classList && e.target.classList.contains('gen-cond')) pintarResumen3();
      });
    }

    if (form.addEventListener) {
      form.addEventListener('submit', function (e) { e.preventDefault(); });
      form.addEventListener('input', function () { setMsg(''); });
    }
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
      const isEnt = route.indexOf('entidad/') === 0;
      if (isEnt) {
        const catId = route.slice('entidad/'.length);
        main.innerHTML = viewEntidad(catId);
        bindEntidad(main, catId);
      } else {
        main.innerHTML = route === 'banco' ? viewBanco()
          : route === 'generador' ? '<div class="v7-view"><h1>Generador de protocolos</h1><p class="sub">Un .docx independiente por protocolo</p><div class="v7-panel v7-gen"><div class="gt">📄 Generador (.docx)</div><button type="button" disabled>Próximamente</button></div></div>'
          : route === 'protocolos' ? viewSoon('Protocolos', 'Documentos generados y su estado')
          : viewSoon('Firmas', 'Flujo de firmas de protocolos');
      }
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

  return {
    CATS, ROUTES, ENTIDADES, SCHEMAS, FASES_GEN, parseRoute, catById, getSchema, getEntidades,
    saveDraft, loadDraft, saveGen, loadGen, viewEntidad, show, hide, apply, currentArea, render,
  };
})();
