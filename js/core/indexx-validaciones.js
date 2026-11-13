// ========================================
// indexx-validaciones.js — StatAnalyzer Pro
// Área de Validaciones V7 (réplica "Admin Dashboard V7").
// Shell independiente: riel + saludo + stats + actividad + panel derecho.
// Mini-router por hash: #/banco · #/generador · #/protocolos · #/reportes.
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
  // `tipo` clasifica el equipo y de ahí se deriva la referencia normativa que
  // se imprime en el protocolo (ver REFS_NORMATIVAS):
  //   M = maquinaria enfocada a producción (no analítica)
  //   Q = cámaras/cuartos de estabilidad (ICH Q1A)
  //   L = instrumento analítico o de control de calidad (USP <1058>)
  const ENTIDADES = {
    almacenes: [
      { id: 'almacen-ambiente-a', nombre: 'Almacén 15–25 °C / HR < 65%' },
      { id: 'almacen-ambiente-b', nombre: 'Almacén 0–30 °C / HR < 80%' },
      { id: 'cuarto-frio', nombre: 'Cuarto frío (2–8 °C)' },
      { id: 'congelador', nombre: 'Congelador (−20 °C)' },
    ],
    equipos: [
      { id: 'tableteadora', nombre: 'Tableteadora rotativa', tipo: 'M' },
      { id: 'encapsuladora', nombre: 'Encapsuladora / capsuladora', tipo: 'M' },
      { id: 'mezclador', nombre: 'Mezclador (V / bins)', tipo: 'M' },
      { id: 'granulador', nombre: 'Granulador', tipo: 'M' },
      { id: 'lecho-fluido', nombre: 'Lecho fluido', tipo: 'M' },
      { id: 'llenadora', nombre: 'Llenadora de líquidos', tipo: 'M' },
      { id: 'llenadora-tubos', nombre: 'Llenadora y selladora de tubos', tipo: 'M' },
      { id: 'liofilizador', nombre: 'Liofilizador', tipo: 'M' },
      { id: 'autoclave', nombre: 'Autoclave', tipo: 'M' },
      { id: 'tunel-despirogenizacion', nombre: 'Túnel de despirogenización', tipo: 'M' },
      { id: 'etiquetadora', nombre: 'Etiquetadora', tipo: 'M' },
      { id: 'blistera', nombre: 'Blístera / encartonadora', tipo: 'M' },
      { id: 'recubridora', nombre: 'Recubridora', tipo: 'M' },
      { id: 'secador-bandejas', nombre: 'Secador de bandejas', tipo: 'M' },
      { id: 'secador-tambor', nombre: 'Secador de tambor', tipo: 'M' },
      { id: 'reactor', nombre: 'Reactor', tipo: 'M' },
      { id: 'sistema-cremas-vacio', nombre: 'Sistema de cremas al vacío', tipo: 'M' },
      { id: 'detector-metales', nombre: 'Detector de metales', tipo: 'M' },
      { id: 'balanza', nombre: 'Balanza analítica / precisión', tipo: 'L' },
      { id: 'phmetro', nombre: 'pH-metro', tipo: 'L' },
      { id: 'espectrofotometro', nombre: 'Espectrofotómetro UV-Vis', tipo: 'L' },
      { id: 'espectrofotometro-ir', nombre: 'Espectrofotómetro IR', tipo: 'L' },
      { id: 'espectrometro', nombre: 'Espectrómetro', tipo: 'L' },
      { id: 'hplc', nombre: 'HPLC', tipo: 'L' },
      { id: 'gc', nombre: 'Cromatógrafo de gases (GC)', tipo: 'L' },
      { id: 'disolutor', nombre: 'Disolutor', tipo: 'L' },
      { id: 'desintegrador', nombre: 'Desintegrador', tipo: 'L' },
      { id: 'friabilometro', nombre: 'Friabilómetro', tipo: 'L' },
      { id: 'durometro', nombre: 'Durómetro', tipo: 'L' },
      { id: 'karl-fischer', nombre: 'Karl Fischer', tipo: 'L' },
      { id: 'toc', nombre: 'TOC', tipo: 'L' },
      { id: 'viscosimetro', nombre: 'Viscosímetro', tipo: 'L' },
      { id: 'incubadora', nombre: 'Incubadora', tipo: 'L' },
      { id: 'refrigerador-lab', nombre: 'Refrigerador de laboratorio', tipo: 'M' },
      { id: 'congelador-lab', nombre: 'Congelador de laboratorio', tipo: 'M' },
      { id: 'centrifuga', nombre: 'Centrífuga', tipo: 'L' },
      { id: 'termometro', nombre: 'Termómetros / data loggers', tipo: 'L' },
      { id: 'horno-vacio', nombre: 'Horno de vacío', tipo: 'M' },
      { id: 'horno-secado', nombre: 'Horno de secado', tipo: 'M' },
      { id: 'cabina-flujo', nombre: 'Cabina de flujo laminar', tipo: 'M' },
      { id: 'cabina-bioseguridad', nombre: 'Cabina de bioseguridad', tipo: 'M' },
    ],
    sistemas: [
      { id: 'hvac', nombre: 'HVAC / Climatización' },
      { id: 'agua-purificada', nombre: 'Agua purificada / WFI' },
      { id: 'vapor-limpio', nombre: 'Vapor limpio' },
      { id: 'aire-comprimido', nombre: 'Aire comprimido' },
    ],
    estabilidad: [
      { id: 'cabina-est-acelerada', nombre: 'Cabina estabilidad acelerada (38–42 °C)', tipo: 'Q' },
      { id: 'cabina-est-real', nombre: 'Cabina estabilidad real (28–32 °C)', tipo: 'Q' },
      { id: 'cuarto-est-acelerada', nombre: 'Cuarto estabilidad acelerada', tipo: 'Q' },
      { id: 'cuarto-est-real', nombre: 'Cuarto estabilidad real', tipo: 'Q' },
      { id: 'incubadora-22-27', nombre: 'Incubadora (22–27 °C)', tipo: 'Q' },
      { id: 'incubadora-38-42', nombre: 'Incubadora (38–42 °C)', tipo: 'Q' },
    ],
    software: [
      { id: 'software-gxp', nombre: 'Sistema computarizado GxP' },
      { id: 'lims', nombre: 'LIMS' },
      { id: 'erp', nombre: 'ERP' },
      { id: 'excel-validado', nombre: 'Hojas de cálculo validadas' },
    ],
  };

  // Bloques de campos compartidos: una sola definición evita que las
  // categorías se desincronicen (antes estaban copiados hasta 5 veces).
  const _ident = [
    { k: 'descripcion', label: 'Descripción', tipo: 'text', req: true },
    { k: 'codigo', label: 'Código', tipo: 'text', req: true },
    { k: 'ubicacion', label: 'Ubicación física', tipo: 'text', req: true },
  ];
  const _fabricante = [
    { k: 'marca', label: 'Marca', tipo: 'text', req: true },
    { k: 'modelo', label: 'Modelo', tipo: 'text', req: true },
  ];
  const _protocolo = [
    { k: 'controlCambios', label: 'Control de cambios #', tipo: 'text', req: false },
    { k: 'versionProtocolo', label: 'Versión del protocolo', tipo: 'text', req: false },
  ];

  // Plantilla adaptativa: comunes + específicos por categoría.
  // tipo: text | select | date. req: obligatorio.
  const SCHEMAS = {
    _comun: [
      { k: 'responsable', 
        label: 'Responsable', 
        tipo: 'text', 
        req: true,
        auto: 'login' // se llena solo con el usuario logueado, como Realizado por
      },
      { k: 'fecha', 
        label: 'Fecha', 
        tipo: 'date', 
        req: true },
      // H-09 (auditoría FDA): URS y análisis de riesgo con código y versión.
      // No son `req` para no romper borradores viejos: se exigen al generar.
      { k: 'ursCodigo',
        label: 'URS (código)',
        tipo: 'text',
        req: false },
      { k: 'ursVersion',
        label: 'URS (versión)',
        tipo: 'text',
        req: false },
      { k: 'riesgoCodigo',
        label: 'Análisis de riesgo (código)',
        tipo: 'text',
        req: false },
      { k: 'riesgoVersion',
        label: 'Análisis de riesgo (versión)',
        tipo: 'text',
        req: false },
    ],
    almacenes: [
      ..._ident,
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
        req: true,
        min: -200,
        max: 300
      },
      {
        k: 'temperaturaMax',
        label: 'Temperatura máxima (°C)',
        tipo: 'number',
        req: true,
        min: -200,
        max: 300
      },
      {
        k: 'humedadMin',
        label: 'Humedad relativa mínima (%HR)',
        tipo: 'number',
        req: false,
        min: 0,
        max: 100
      },
      {
        k: 'humedadMax',
        label: 'Humedad relativa máxima (%HR)',
        tipo: 'number',
        req: false,
        min: 0,
        max: 100
      },
      ..._protocolo,
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
        req: false,
        min: 1,
        max: 1000,
        integer: true
      }
    ],
    
    estabilidad: [
      ..._ident,
      ..._fabricante,
      ..._protocolo,
    ],
    equipos: [
      ..._ident,
      ..._fabricante,
      ..._protocolo,
    ],
    sistemas: [
      ..._ident,
      ..._fabricante,
      { k: 'area', label: 'Área usuaria', tipo: 'text', req: true },
      ..._protocolo,
    ],
    software: [
      { k: 'descripcion', label: 'Descripción', tipo: 'text', req: true },
    ],
  };

  function getSchema(cat) {
    return (SCHEMAS._comun || []).concat(SCHEMAS[cat] || []);
  }

  function getEntidades(cat) {
    return ENTIDADES[cat] || [];
  }

  function draftKey(entId, catId) {
    // Por usuario + categoría: dos usuarios en el mismo navegador no comparten
    // borradores (el sessionStorage anterior filtraba el último borrador).
    return 'val-borrador-' + (currentUser() || 'anon') + '-' + (catId || '') + '-' + entId;
  }

  function _draftStore() {
    try { if (typeof localStorage !== 'undefined') return localStorage; } catch (e) {}
    try { if (typeof sessionStorage !== 'undefined') return sessionStorage; } catch (e) {}
    return null;
  }

  function saveDraft(entId, data, catId) {
    const store = _draftStore();
    try {
      if (store && entId) {
        store.setItem(draftKey(entId, catId), JSON.stringify(data || {}));
        return true;
      }
    } catch (e) {}
    return false;
  }

  function loadDraft(entId, catId) {
    const store = _draftStore();
    try {
      if (store && entId) return JSON.parse(store.getItem(draftKey(entId, catId)) || '{}');
    } catch (e) {}
    return {};
  }

  // Fase 1: el borrador vive en el backend (por usuario); localStorage queda
  // como copia para seguir trabajando si el API no responde.
  async function cargarBorrador(entId, catId) {
    const local = loadDraft(entId, catId);
    if (!entId) return local;
    try {
      const r = await apiGet('/api/val/v1/drafts/' + encodeURIComponent(catId || '') + '/' + encodeURIComponent(entId));
      if (r && r.ok && r.draft && r.draft.data && typeof r.draft.data === 'object') {
        saveDraft(entId, r.draft.data, catId);
        return r.draft.data;
      }
    } catch (e) {}
    return local;
  }

  async function guardarBorrador(entId, catId, data) {
    const local = saveDraft(entId, data, catId);
    let remoto = false;
    try {
      const r = await apiSend('/api/val/v1/drafts/' + encodeURIComponent(catId || '') + '/' + encodeURIComponent(entId), 'PUT', { data: data || {} });
      remoto = !!(r && r.ok);
    } catch (e) {}
    return { ok: local || remoto, local: local, remoto: remoto };
  }

  const ROUTES = [
    { id: 'banco', icono: '▦', label: 'Dashboard', grupo: 'main' },
    { id: 'protocolos', icono: '▤', label: 'Protocolos', grupo: 'main' },
    { id: 'generador', icono: '◈', label: 'Generador de protocolos', grupo: 'main' },
    // shortcut: Firmas vuelve al menú cuando exista la Fase 3 (firma
    // electrónica de protocolos); hoy se retira para no mostrar "En construcción".
    { id: 'documentacion', icono: '▣', label: 'Documentación', grupo: 'main' },
    { id: 'calendario', icono: '◷', label: 'Calendario', grupo: 'main' },
    { id: 'reportes', icono: '▥', label: 'Reportes', grupo: 'main' },
    { id: 'configuracion', icono: '⚙', label: 'Configuración', grupo: 'config' },
    { id: 'ayuda', icono: 'ⓘ', label: 'Ayuda y soporte', grupo: 'config' },
  ];

  // Fase 4: documentos publicados en el repositorio. La vigencia formal la
  // determina Calidad; aquí solo se enlaza lo que ya existe (sin inventar DMS).
  const DOCS = [
    { titulo: 'Protocolo maestro del banco de ensayos', tipo: 'Guía', version: '1.1', fecha: '2026-11-06', href: 'docs/banco-ensayos/PROTOCOLO_MAESTRO.md' },
    { titulo: 'Normas por familia de equipos', tipo: 'Guía', version: '1.1', fecha: '2026-11-06', href: 'docs/banco-ensayos/NORMAS_POR_FAMILIA.md' },
    { titulo: 'Mapa de diseño de la interfaz', tipo: 'Guía', version: '—', fecha: '2026-10-30', href: 'docs/MAPA_DISENO.md' },
    { titulo: 'Auditoría del módulo de estadística', tipo: 'Informe', version: '—', fecha: '2026-11-03', href: 'docs/AUDITORIA_MODULO_ESTADISTICA.md' },
    { titulo: 'Reporte de validación estadística', tipo: 'Informe', version: '—', fecha: '2026-05-22', href: 'VALIDATION_REPORT.md' },
    { titulo: 'Plantilla DQ', tipo: 'Plantilla', version: '—', fecha: '—', href: 'docs/plantillas/DQ-1-400AAAA.docx' },
    { titulo: 'Plantilla IQ', tipo: 'Plantilla', version: '—', fecha: '—', href: 'docs/plantillas/IQ-1-400AAAA.docx' },
    { titulo: 'Plantilla OQ', tipo: 'Plantilla', version: '—', fecha: '—', href: 'docs/plantillas/OQ-1-400AAAA.docx' },
    { titulo: 'Plantilla PQ', tipo: 'Plantilla', version: '—', fecha: '—', href: 'docs/plantillas/PQ-1-400AAAA.docx' },
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

  function _contarBanco(banco) {
    const out = { total: 0, fases: { DQ: 0, IQ: 0, OQ: 0, PQ: 0 } };
    if (!banco || !banco.fases) return out;
    ['DQ', 'IQ', 'OQ', 'PQ'].forEach(function (fase) {
      const items = Array.isArray(banco.fases[fase]) ? banco.fases[fase] : [];
      const n = items.filter(function (i) {
        return i && i.id && (i.bloque === 2 || i.bloque === 3);
      }).length;
      out.fases[fase] = n;
      out.total += n;
    });
    return out;
  }

  function manifest() {
    // Cómputo en runtime desde los bancos cargados. Evita que las cards
    // queden congeladas en validaciones-manifest.js (fallback de arranque).
    const fuentes = [
      ['almacenes', typeof BancoAlmacenes !== 'undefined' ? BancoAlmacenes : null],
      ['equipos', typeof BancoEquipos !== 'undefined' ? BancoEquipos : null],
      ['estabilidad', typeof BancoEstabilidad !== 'undefined' ? BancoEstabilidad : null],
      ['sistemas', typeof BancoSistemas !== 'undefined' ? BancoSistemas : null],
    ];
    const total = { total: 0, fases: { DQ: 0, IQ: 0, OQ: 0, PQ: 0 }, categorias: {} };
    let cargados = 0;
    fuentes.forEach(function (par) {
      const id = par[0];
      const banco = par[1];
      if (!banco || !banco.fases) return;
      cargados += 1;
      const c = _contarBanco(banco);
      total.categorias[id] = c.total;
      total.total += c.total;
      ['DQ', 'IQ', 'OQ', 'PQ'].forEach(function (fase) { total.fases[fase] += c.fases[fase]; });
    });
    if (cargados > 0) return total;
    // Sin bancos cargados (tests o HTML viejo en caché): fallback estático.
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

  function escAttr(s) {
    return esc(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
    return '<svg class="kpi-spark" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + rects + '</svg>';
  }

  function sparkPulse(color) {
    return '<svg class="kpi-spark" viewBox="0 0 100 30" aria-hidden="true">'
      + '<polyline points="0,18 18,18 26,8 34,24 42,14 55,18 63,18 70,5 78,25 86,16 100,16"'
      + ' fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function sparkRing(pct, color) {
    const c = 2 * Math.PI * 11;
    const off = (c * (100 - pct)) / 100;
    return '<svg class="kpi-ring" viewBox="0 0 30 30" aria-hidden="true">'
      + '<circle cx="15" cy="15" r="11" fill="none" stroke="#e3e6eb" stroke-width="4"/>'
      + '<circle cx="15" cy="15" r="11" fill="none" stroke="' + color + '" stroke-width="4"'
      + ' stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"'
      + ' transform="rotate(-90 15 15)" stroke-linecap="round"/></svg>';
  }

  // ── Dashboard (shell del prototipo V1) ──
  function fmtNum(n) {
    return Number(n || 0).toLocaleString('es-ES', { useGrouping: true });
  }

  function fechaCorte() {
    try {
      return new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) { return 'hoy'; }
  }

  function calendarHtml(events) {
    const ahora = new Date();
    const y = ahora.getFullYear();
    const mo = ahora.getMonth();
    const marks = events instanceof Set ? events : new Set();
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const primerDia = (new Date(y, mo, 1).getDay() + 6) % 7; // lunes = 0
    const dias = new Date(y, mo + 1, 0).getDate();
    const rows = [];
    let row = [];
    for (let i = 0; i < primerDia; i++) row.push('<td></td>');
    for (let d = 1; d <= dias; d++) {
      const hoy = d === ahora.getDate();
      const ev = marks.has(d);
      const cls = (hoy ? 'today' : '') + (ev ? ' event' : '');
      row.push('<td' + (cls.trim() ? ' class="' + cls.trim() + '"' : '')
        + (hoy ? ' aria-current="date"' : '') + (ev ? ' aria-label="Día con registros"' : '') + '>' + d + '</td>');
      if (row.length === 7) { rows.push('<tr>' + row.join('') + '</tr>'); row = []; }
    }
    if (row.length) {
      while (row.length < 7) row.push('<td></td>');
      rows.push('<tr>' + row.join('') + '</tr>');
    }
    return '<table class="calendar" aria-label="Calendario de ' + meses[mo] + ' de ' + y + '">'
      + '<thead><tr><th scope="col">L</th><th scope="col">M</th><th scope="col">M</th>'
      + '<th scope="col">J</th><th scope="col">V</th><th scope="col">S</th><th scope="col">D</th></tr></thead>'
      + '<tbody>' + rows.join('') + '</tbody></table>';
  }

  function fechaCorta(iso) {
    const s = String(iso || '');
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? m[3] + '/' + m[2] + '/' + m[1] : (s.slice(0, 16).replace('T', ' ') || '—');
  }

  function _dayKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function _lastDays(n) {
    const out = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      out.push({ key: _dayKey(d), label: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()] });
    }
    return out;
  }

  // Gráfico real de los últimos 7 días. Sin datos dibuja una línea plana en 0.
  function chartHtml(byDay) {
    const days = _lastDays(7);
    const map = new Map((byDay || []).map((x) => [String(x.day), Number(x.total) || 0]));
    const vals = days.map((d) => map.get(d.key) || 0);
    const max = Math.max(1, Math.max.apply(null, vals));
    const xs = [45, 130, 215, 300, 385, 470, 555];
    const ys = vals.map((v) => 160 - Math.round((v / max) * 120));
    let line = '';
    for (let i = 0; i < xs.length; i++) line += (i ? ' L' : 'M') + xs[i] + ' ' + ys[i];
    const dots = xs.map((x, i) => '<circle class="chart-dot" cx="' + x + '" cy="' + ys[i] + '" r="5"><title>'
      + days[i].label + ': ' + vals[i] + ' protocolo(s)</title></circle>').join('');
    const labels = xs.map((x, i) => '<text class="chart-label" text-anchor="middle" x="' + x + '" y="181">' + days[i].label + '</text>').join('');
    return '<svg class="chart" viewBox="0 0 600 190" role="img" aria-label="Protocolos registrados en los últimos 7 días">'
      + '<line class="chart-grid" x1="38" y1="25" x2="590" y2="25"/><line class="chart-grid" x1="38" y1="70" x2="590" y2="70"/>'
      + '<line class="chart-grid" x1="38" y1="115" x2="590" y2="115"/><line class="chart-grid" x1="38" y1="160" x2="590" y2="160"/>'
      + '<defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".28"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>'
      + '<path class="chart-area" d="' + line + ' L555 160 L45 160 Z"/>'
      + '<path class="chart-line" d="' + line + '"/>' + dots + labels + '</svg>';
  }

  function weekStatsHtml(byDay) {
    const days = _lastDays(7);
    const map = new Map((byDay || []).map((x) => [String(x.day), Number(x.total) || 0]));
    const vals = days.map((d) => map.get(d.key) || 0);
    const total = vals.reduce((a, b) => a + b, 0);
    const avg = (total / 7).toFixed(1).replace('.', ',');
    return '<small>Protocolos registrados</small><strong>' + fmtNum(total) + '</strong>'
      + '<span class="trend">Últimos 7 días</span>'
      + '<span class="muted">Promedio diario<br><b style="color:#dce5ee;font-size:16px">' + avg + '</b></span>';
  }

  function recentHtml(list) {
    const rows = Array.isArray(list) ? list : [];
    if (!rows.length) return '<p class="sub" style="margin:0">Sin protocolos registrados.</p>';
    return '<div class="task-list">' + rows.map((p) => {
      const titulo = (p.code || (p.phase + ' · ' + p.entity));
      return '<div class="task"><i class="task-mark" aria-hidden="true"></i><div><strong>' + esc(titulo) + '</strong>'
        + '<small>' + esc(fechaCorta(p.created_at)) + ' · ' + esc(p.username || '—') + '</small></div></div>';
    }).join('') + '</div>';
  }

  function reportTable(title, head, rows) {
    return '<section class="val-report-block"><h3 class="val-report-title">' + esc(title) + '</h3>'
      + '<div class="val-table-wrap"><table class="val-table"><thead><tr>'
      + head.map((h) => '<th>' + esc(h) + '</th>').join('')
      + '</tr></thead><tbody>' + rows.map((r) => '<tr>' + r.map((c) => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('')
      + '</tbody></table></div></section>';
  }

  function reportHtml(report) {
    const r = report || {};
    if (!r.total) return '<p class="sub" style="margin:0">Aún no hay protocolos registrados. Genere uno desde el generador para ver los conteos.</p>';
    const byPhase = (r.byPhase || []).map((x) => [x.phase, fmtNum(x.total)]);
    const byCat = (r.byCategory || []).map((x) => [x.category, fmtNum(x.total)]);
    const byEnt = (r.byEntity || []).slice(0, 15).map((x) => [x.category, x.entity, fmtNum(x.total)]);
    const byUser = (r.byUser || []).map((x) => [x.username, fmtNum(x.total)]);
    return '<p class="sub">Total registrado: <b>' + fmtNum(r.total) + '</b> · '
      + (r.byCategory || []).length + ' categoría(s) · ' + (r.byUser || []).length + ' usuario(s)</p>'
      + '<div class="val-report-grid">'
      + reportTable('Por fase', ['Fase', 'Protocolos'], byPhase)
      + reportTable('Por categoría', ['Categoría', 'Protocolos'], byCat)
      + reportTable('Por usuario', ['Usuario', 'Protocolos'], byUser)
      + '</div>'
      + reportTable('Por entidad (top 15)', ['Categoría', 'Entidad', 'Protocolos'], byEnt);
  }

  function viewBanco() {
    const m = manifest();
    const f = m.fases || {};
    const cats = m.categorias || {};
    const cards = [
      { t: 'Ensayos en el banco', v: m.total || 0, u: 'Total del banco', i: '▤', s: '--accent:var(--data-1);--glow:var(--data-1);--glowbg:var(--bg-accent)', g: sparkBars([4, 7, 5, 9, 6, 11, 8], 'var(--data-1)') },
      { t: 'DQ · Diseño', v: f.DQ || 0, u: 'Ensayos catalogados', i: '◇', s: '--accent:var(--data-2);--glow:var(--data-2);--glowbg:var(--bg-accent)', g: sparkPulse('var(--data-2)') },
      { t: 'IQ · Instalación', v: f.IQ || 0, u: 'Ensayos catalogados', i: '⌂', s: '--accent:var(--data-3);--glow:var(--data-3);--glowbg:var(--bg-accent)', g: sparkRing(72, 'var(--data-3)') },
      { t: 'OQ · Operación', v: f.OQ || 0, u: 'Ensayos catalogados', i: '⚙', s: '--accent:var(--data-5);--glow:var(--data-5);--glowbg:var(--bg-accent)', g: sparkBars([6, 3, 8, 5, 9, 4, 7], 'var(--data-5)') },
      { t: 'PQ · Desempeño', v: f.PQ || 0, u: 'Ensayos catalogados', i: '▥', s: '--accent:var(--data-4);--glow:var(--data-4);--glowbg:var(--bg-accent)', g: sparkPulse('var(--data-4)') },
    ];
    const catColor = { almacenes: 'var(--data-1)', equipos: 'var(--data-3)', sistemas: 'var(--data-5)', estabilidad: 'var(--data-2)', software: 'var(--data-4)' };
    const catCards = CATS.map(function (c) {
      const n = Number(cats[c.id] || 0);
      const detalle = c.id === 'software'
        ? (n ? fmtNum(n) + ' registros' : 'Sin banco')
        : (c.id === 'estabilidad' ? fmtNum(n) + ' estudios' : fmtNum(n) + ' registros');
      const color = catColor[c.id] || 'var(--data-1)';
      return '<a class="category" href="#/entidad/' + c.id + '" target="_self" data-name="' + esc(c.nombre) + '">'
        + '<div class="cat-icon" aria-hidden="true" style="background:' + color + '20;color:' + color + '">' + c.icono + '</div>'
        + '<strong>' + esc(c.nombre) + '</strong><small>' + esc(detalle) + '</small></a>';
    }).join('');
    return '<div class="v7-view"><div class="section-head"><h2>Resumen general</h2><span>¿Qué vas a calificar hoy? · Banco de ensayos · corte ' + esc(fechaCorte()) + '</span></div>'
      + '<section class="kpis">'
      + cards.map(function (c) {
        return '<article class="kpi" style="' + c.s + '"><div class="kpi-top">' + c.t + ' <span class="kpi-icon" aria-hidden="true">' + c.i + '</span></div>'
          + '<div class="kpi-value">' + fmtNum(c.v) + '</div>'
          + '<div class="kpi-foot">' + c.u + '</div>' + c.g + '</article>';
      }).join('')
      + '</section>'
      + '<section class="middle">'
      + '<article class="panel"><div class="panel-head"><div><h3>Protocolos registrados</h3><p>Últimos 7 días, desde el registro real</p></div></div>'
      + '<div class="chart-wrap"><div id="val-chart">' + chartHtml([]) + '</div><div class="week-stat" id="val-week-stat">' + weekStatsHtml([]) + '</div></div></article>'
      + '<article class="panel protocol"><div class="panel-head"><div><h3>Generador de protocolos</h3><p>Ensayos disponibles para generar</p></div><span style="color:var(--green);font-size:12px">● Activo</span></div>'
      + '<div class="protocol-count"><div class="ring"><strong>100%</strong></div><div><strong>' + fmtNum(m.total || 0) + '</strong><span>Ensayos disponibles</span></div></div>'
      + '<div class="progress-label"><span>Cobertura del banco</span><b>100%</b></div><div class="progress"><i style="width:100%"></i></div>'
      + '<a class="primary-btn" href="#/generador" target="_self">Abrir generador de protocolos →</a></article>'
      + '</section>'
      + '<section class="bottom"><article class="panel"><div class="panel-head"><div><h3>Áreas de trabajo</h3><p>Acceso rápido a los módulos principales</p></div><a href="#/generador" target="_self" style="color:var(--orange);font-size:12px;text-decoration:none">Ver todos →</a></div>'
      + '<div class="categories">' + catCards + '</div></article>'
      + '<article class="panel"><div class="right-lower"><div><div class="calendar-title"><strong>' + new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) + '</strong><span aria-hidden="true">‹ &nbsp; ›</span></div><div id="val-cal-dash">' + calendarHtml() + '</div></div>'
      + '<div><div class="calendar-title"><strong>Últimos protocolos</strong><span>Registro</span></div><div id="val-recent">' + recentHtml([]) + '</div></div></div>'
      + '<div class="status" role="status" aria-atomic="true"><i aria-hidden="true"></i> Todos los sistemas operativos</div></article></section>'
      + '<footer>StatAnalyzer Pro · Banco: ' + fmtNum(m.total || 0) + ' ensayos · Corte ' + esc(fechaCorte()) + '</footer></div>';
  }

  function viewGenerador() {
    const cards = CATS.filter(function (c) { return GEN_CATS.indexOf(c.id) >= 0; }).map(function (c) {
      return '<a class="category" href="#/entidad/' + c.id + '" target="_self" data-name="' + esc(c.nombre) + '">'
        + '<div class="cat-icon" aria-hidden="true" style="background:var(--bg-accent);color:var(--accent)">' + c.icono + '</div>'
        + '<strong>' + esc(c.nombre) + '</strong><small>' + esc(c.desc) + '</small></a>';
    }).join('');
    return '<div class="v7-view"><h1>Generador de protocolos</h1><p class="sub">Elija una categoría, cargue los datos de la entidad y genere el .docx.</p>'
      + '<div class="categories" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">' + cards + '</div></div>';
  }

  function viewCalendario() {
    return '<div class="v7-view"><h1>Calendario</h1><p class="sub">Protocolos registrados por día. Los vencimientos de firma se incorporan en la Fase 3.</p>'
      + '<div class="panel"><div class="calendar-title"><strong>' + new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) + '</strong><span aria-hidden="true">‹ &nbsp; ›</span></div>'
      + '<div id="val-calendar">' + calendarHtml() + '</div>'
      + '<div class="calendar-title" style="margin-top:18px"><strong>Registros del mes</strong><span id="val-cal-count">—</span></div>'
      + '<div id="val-cal-recent">Cargando…</div>'
      + '<div class="status" role="status" aria-atomic="true"><i aria-hidden="true"></i> Calendario actualizado desde el registro</div></div></div>';
  }

  function viewDocumentacion() {
    const rows = DOCS.map((d) => '<tr><td>' + esc(d.titulo) + '</td>'
      + '<td>' + esc(d.tipo) + '</td><td>' + esc(d.version) + '</td><td>' + esc(d.fecha) + '</td>'
      + '<td>Publicado</td><td><a class="val-link" href="' + escAttr(d.href) + '" target="_self" rel="noopener">Abrir</a></td></tr>').join('');
    return '<div class="v7-view"><h1>Documentación</h1>'
      + '<p class="sub">Documentos de referencia publicados en el repositorio. La vigencia formal la determina Calidad; esta vista no sustituye al gestor documental.</p>'
      + '<div class="val-table-wrap"><table class="val-table"><thead><tr><th>Documento</th><th>Tipo</th><th>Versión</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>'
      + '<tbody>' + rows + '</tbody></table></div></div>';
  }

  function viewReportes() {
    return '<div class="v7-view"><h1>Reportes</h1>'
      + '<p class="sub">Conteos del registro de protocolos por fase, categoría, entidad y usuario.</p>'
      + '<div class="val-report-actions"><button type="button" class="val-btn" id="val-report-refresh">Actualizar</button></div>'
      + '<div id="val-report">Cargando…</div>'
      + '<div id="val-report-msg" class="v7-form-msg" role="status"></div></div>';
  }

  function viewConfiguracion() {
    const roles = [['admin', 'Administrador'], ['supervisor', 'Supervisor'], ['analista', 'Analista'],
      ['gerente', 'Gerente'], ['coordinador', 'Coordinador'], ['user', 'Usuario'], ['readonly', 'Solo lectura']];
    const opts = (sel) => roles.map((r) => '<option value="' + r[0] + '"' + (sel.indexOf(r[0]) >= 0 ? ' selected' : '') + '>' + r[1] + '</option>').join('');
    return '<div class="v7-view"><h1>Configuración</h1>'
      + '<p class="sub">Ajustes mínimos del área de Validaciones. Se guardan en el servidor y los usa el flujo de firma de la Fase 3.</p>'
      + '<form class="v7-dataform" id="val-config-form">'
      + '<fieldset class="v7-fs"><legend>Organización</legend><div class="v7-grid">'
      + '<label class="v7-field"><span>Nombre de la organización <b>*</b></span><input type="text" data-cfg="orgName" maxlength="120" required></label>'
      + '<label class="v7-field"><span>URL del logo</span><input type="url" data-cfg="logoUrl" maxlength="500" placeholder="https://…"></label>'
      + '<label class="v7-field"><span>Prefijo de numeración</span><input type="text" data-cfg="numberingPrefix" maxlength="20" pattern="[A-Za-z0-9-]+"></label>'
      + '</div></fieldset>'
      + '<fieldset class="v7-fs"><legend>Firmas (Fase 3)</legend><div class="v7-grid">'
      + '<label class="v7-field"><span>Roles que revisan</span><select multiple size="4" data-cfg="reviewRoles">' + opts(['gerente']) + '</select></label>'
      + '<label class="v7-field"><span>Roles que aprueban</span><select multiple size="4" data-cfg="approveRoles">' + opts(['admin', 'supervisor']) + '</select></label>'
      + '</div></fieldset>'
      + '<div class="v7-form-actions"><span class="v7-form-msg" id="val-config-msg" role="status"></span>'
      + '<button type="submit" class="v7-btn-download">Guardar configuración</button></div></form>'
      + '<p class="sub" style="margin-top:14px">La firma húmeda no usa estos roles. La firma electrónica de protocolos llega en la Fase 3.</p></div>';
  }

  function viewAyuda() {
    return '<div class="v7-view"><h1>Ayuda y soporte</h1>'
      + '<p class="sub">Guía rápida del módulo de Validaciones.</p>'
      + '<div class="val-help-grid">'
      + '<article class="panel"><h3>Flujo en 5 pasos</h3><ol>'
      + '<li>Elija el área de trabajo (almacenes, equipos, estabilidad o sistemas).</li>'
      + '<li>Seleccione la entidad y complete la planilla de datos.</li>'
      + '<li>Guarde el borrador: queda en el servidor y no se pierde al cerrar.</li>'
      + '<li>Elija las fases y genere el protocolo .docx.</li>'
      + '<li>Consulte el protocolo en <a href="#/protocolos" target="_self">Protocolos</a> y descárguelo.</li>'
      + '</ol></article>'
      + '<article class="panel"><h3>Preguntas frecuentes</h3>'
      + '<details><summary>¿Dónde queda mi borrador?</summary><p>En el servidor, asociado a su usuario y a la entidad. También hay una copia local por si el API no responde.</p></details>'
      + '<details><summary>¿Por qué no puedo generar un protocolo?</summary><p>Revise los campos obligatorios, los rangos numéricos y que la URS y el análisis de riesgo estén completos. El generador indica qué falta.</p></details>'
      + '<details><summary>¿Qué pasa al descargar un protocolo?</summary><p>Queda registrado con su SHA-256 y el usuario que lo emitió. La firma electrónica se incorpora en la Fase 3.</p></details>'
      + '<details><summary>¿Quién puede entrar a Validaciones?</summary><p>El módulo está restringido a administradores. Los demás roles ven un aviso de acceso.</p></details>'
      + '</article>'
      + '<article class="panel"><h3>Contacto</h3>'
      + '<p>Para altas de usuario, cambios de rol o incidencias del registro, contacte al administrador del sistema o al área de Calidad.</p>'
      + '<p><a href="#/documentacion" target="_self">Ver documentación de referencia →</a></p></article>'
      + '</div></div>';
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
      + '<div><div class="pv">' + fmtNum(m.total) + '</div><div class="pl">Ensayos</div></div>'
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

  function fieldHtml(f, val) {
    const v = val == null ? '' : String(val);
    const req = f.req ? ' data-req="1"' : '';
    const auto = f.auto === 'login' ? ' readonly placeholder="Cargando usuario…"' : '';
    const lab = '<label class="v7-field" data-f="' + f.k + '"><span>' + esc(f.label) + (f.auto === 'login' ? ' (automático)' : '') + (f.req ? ' <b>*</b>' : '') + '</span>';
    if (f.tipo === 'select') {
      const opts = ['<option value="">— Seleccione —</option>'].concat(
        (f.opciones || []).map((o) => '<option value="' + esc(o) + '"' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>')
      ).join('');
      return lab + '<select data-k="' + f.k + '"' + req + auto + '>' + opts + '</select></label>';
    }
    if (f.tipo === 'date') {
      return lab + '<input type="date" class="v7-fecha" data-k="' + f.k + '"' + req + auto + ' value="' + esc(v) + '"></label>';
    }    if (f.tipo === 'number') {
      const lim = (f.min != null ? ' min="' + f.min + '"' : '')
        + (f.max != null ? ' max="' + f.max + '"' : '')
        + (f.integer ? ' step="1"' : ' step="any"');
      return lab + '<input type="number"' + lim + ' data-k="' + f.k + '"' + req + auto + ' value="' + esc(v) + '"></label>';
    }
    if (f.tipo === 'file') {
      return lab + '<input type="file" accept="image/*" data-k="' + f.k + '"' + req + auto + '></label>';
    }
    return lab + '<input type="text" data-k="' + f.k + '"' + req + auto + ' value="' + esc(v) + '"></label>';
  }

  // Calendario flotante (flatpickr, CDN): muestra dd/Mmm/aaaa y guarda aaaa-mm-dd.
  // Sin flatpickr (offline) el input date nativo sigue funcionando: mejora progresiva.
  function mejorarFecha(el) {
    try {
      if (!el || !el.getAttribute || el.getAttribute('type') !== 'date' || el._flatpickr) return false;
      const FP = (typeof flatpickr !== 'undefined') ? flatpickr
        : (typeof window !== 'undefined' && window.flatpickr) || null;
      if (!FP) return false;
      FP(el, {
        altInput: true, altFormat: 'd/M/Y', dateFormat: 'Y-m-d',
        locale: (FP.l10ns && FP.l10ns.es) ? 'es' : 'default',
        allowInput: true, defaultDate: el.value || null,
      });
      return true;
    } catch (e) { return false; }
  }

  const FASES_GEN = ['DQ', 'IQ', 'OQ', 'PQ'];
  const GEN_CATS = ['almacenes', 'equipos', 'estabilidad', 'sistemas'];
  // Fases con generador por categoría (equipos: IQ común + OQ/PQ por familia).
  const GEN_FASES = { almacenes: FASES_GEN.slice(), equipos: ['DQ', 'IQ', 'OQ', 'PQ'], estabilidad: ['DQ', 'IQ', 'OQ', 'PQ'], sistemas: ['DQ', 'IQ', 'OQ', 'PQ'] };

  // Gerencias sugeridas para el Revisor Gerente (T2). El campo acepta texto libre.
  const AREAS_GERENCIA = ['Gerente Validaciones', 'Gerente Gestión de Calidad', 'Gerente Sr. Producción',
    'Gerente de Logística', 'Gerente Control de Calidad', 'Gerente Servicios Generales', 'Gerente Investigación y Desarrollo', 
    'Gerente de Ingeniería', 'Gerente de Mantenimiento', 'Gerente de Auditoria'];

  function puestoGerente(area, cargoFb) {
    const a = String(area || '').trim();
    if (/^gerente\b/i.test(a)) return a;
    if (/^sr\.?\b/i.test(a)) return 'Gerente ' + a;
    if (a) return 'Gerente de ' + a.charAt(0).toUpperCase() + a.slice(1);
    return String(cargoFb || '').trim();
  }

  // Área derivada del cargo del gerente elegido: "Gerente de Calidad" → "Calidad".
  function areaDesdeCargo(cargo) {
    const c = String(cargo || '').trim();
    const m = c.match(/^gerente\s+(?:de\s+|del\s+)?(.+)$/i);
    return (m ? m[1] : c).trim();
  }

  function firmantesHtml() {
    return '<fieldset class="v7-fs"><legend>Firmantes</legend><div class="v7-grid">'
      + '<label class="v7-field" data-f="revisorGerente"><span>Revisor Gerente · nombre <b>*</b></span>'
      + '<select data-k="revisorGerente" data-req="1"><option value="">— Seleccione —</option></select></label>'
      + '<label class="v7-field" data-f="gerenciaArea"><span>Revisor Gerente · gerencia que revisa <b>*</b></span>'
      + '<input type="text" data-k="gerenciaArea" data-req="1" list="v7-areas-dl" placeholder="Ej. Calidad">'
      + '<datalist id="v7-areas-dl">' + AREAS_GERENCIA.map((a) => '<option value="' + esc(a) + '">').join('') + '</datalist></label>'
      + '</div></fieldset>';
  }

  function apiBase() {
    try { if (typeof API_URL !== 'undefined' && API_URL) return API_URL; } catch (e) {}
    return '';
  }

  function apiHeaders() {
    let t = '';
    try { if (typeof Auth !== 'undefined' && Auth.getToken) t = Auth.getToken() || ''; } catch (e) {}
    return { Authorization: 'Bearer ' + t };
  }

  async function apiGet(path) {
    const base = apiBase();
    const f = (typeof fetchWithTimeout !== 'undefined') ? fetchWithTimeout : fetch;
    const res = await f(base + path, { headers: apiHeaders(), credentials: 'include' });
    return res.json();
  }

  async function apiSend(path, method, body) {
    const base = apiBase();
    const f = (typeof fetchWithTimeout !== 'undefined') ? fetchWithTimeout : fetch;
    const headers = apiHeaders();
    headers['Content-Type'] = 'application/json';
    const res = await f(base + path, {
      method: method,
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(body || {}),
    });
    return res.json();
  }

  function bytesToBase64(bytes) {
    const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let bin = '';
    const chunk = 0x8000;
    for (let i = 0; i < u8.length; i += chunk) {
      bin += String.fromCharCode.apply(null, u8.subarray(i, i + chunk));
    }
    return btoa(bin);
  }

  async function apiDownload(path) {
    const base = apiBase();
    const f = (typeof fetchWithTimeout !== 'undefined') ? fetchWithTimeout : fetch;
    const res = await f(base + path, { headers: apiHeaders(), credentials: 'include' });
    if (!res.ok) throw new Error('No se pudo descargar el protocolo');
    const blob = await res.blob();
    const cd = res.headers.get('Content-Disposition') || '';
    const m = /filename=\"([^\"]+)\"/.exec(cd);
    const name = m ? m[1] : 'protocolo.docx';
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { try { URL.revokeObjectURL(url); a.remove(); } catch (e) {} }, 4000);
  }

  function viewProtocolos() {
    return '<div class="v7-view"><h1>Protocolos</h1>'
      + '<p class="sub">Registro inmutable de protocolos emitidos, con huella SHA-256 y usuario.</p>'
      + '<div class="val-table-wrap"><table class="val-table"><thead><tr>'
      + '<th>Fecha</th><th>Categoría</th><th>Entidad</th><th>Fase</th><th>Código</th><th>Versión</th><th>Usuario</th><th>SHA-256</th><th></th>'
      + '</tr></thead><tbody id="val-protocolos-body"><tr><td colspan="9">Cargando…</td></tr></tbody></table></div>'
      + '<div id="val-protocolos-msg" class="v7-form-msg" role="status"></div></div>';
  }

  async function cargarProtocolos(container) {
    const body = container && container.querySelector ? container.querySelector('#val-protocolos-body') : null;
    const msg = container && container.querySelector ? container.querySelector('#val-protocolos-msg') : null;
    if (!body) return;
    function setMsg(text, ok) {
      if (!msg) return;
      msg.textContent = text || '';
      msg.className = 'v7-form-msg' + (text ? (ok ? ' ok' : ' err') : '');
    }
    try {
      const r = await apiGet('/api/val/v1/protocols?limit=100');
      if (!document.body.contains(container)) return;
      if (!r || !r.ok) throw new Error((r && r.error) || 'No se pudo cargar el registro');
      const rows = r.protocols || [];
      if (!rows.length) {
        body.innerHTML = '<tr><td colspan="9">No hay protocolos registrados.</td></tr>';
        return;
      }
      body.innerHTML = rows.map(function (p) {
        const fecha = String(p.created_at || '').slice(0, 16).replace('T', ' ');
        return '<tr><td>' + esc(fecha) + '</td><td>' + esc(p.category) + '</td><td>' + esc(p.entity) + '</td>'
          + '<td>' + esc(p.phase) + '</td><td>' + esc(p.code || '—') + '</td><td>' + esc(p.version || '—') + '</td>'
          + '<td>' + esc(p.username) + '</td><td class="val-hash" title="' + esc(p.sha256) + '">' + esc(String(p.sha256 || '').slice(0, 12)) + '…</td>'
          + '<td><button type="button" class="val-btn" data-download="' + esc(p.id) + '">Descargar</button></td></tr>';
      }).join('');
      body.querySelectorAll('[data-download]').forEach(function (btn) {
        btn.addEventListener('click', async function () {
          const id = btn.getAttribute('data-download');
          btn.disabled = true;
          setMsg('Descargando…', true);
          try {
            await apiDownload('/api/val/v1/protocols/' + encodeURIComponent(id) + '/download');
            setMsg('Descarga iniciada.', true);
          } catch (e) {
            setMsg(e.message || 'No se pudo descargar.', false);
          }
          btn.disabled = false;
        });
      });
    } catch (e) {
      if (document.body.contains(container)) body.innerHTML = '<tr><td colspan="9">' + esc(e.message || 'Error al cargar.') + '</td></tr>';
      setMsg(e.message || 'Error al cargar.', false);
    }
  }

  function _eventDays(byDay) {
    const now = new Date();
    const prefix = _dayKey(now).slice(0, 8); // YYYY-MM-
    const set = new Set();
    (byDay || []).forEach((x) => {
      const d = String(x && x.day || '');
      if (d.slice(0, 8) === prefix) set.add(Number(d.slice(8, 10)));
    });
    return set;
  }

  async function _reportsData() {
    const r = await apiGet('/api/val/v1/reports');
    if (!r || !r.ok) throw new Error((r && r.error) || 'No se pudo leer el registro');
    return { report: r.report || {}, recent: r.recent || [] };
  }

  // Dashboard: gráfico, calendario y últimos protocolos desde el registro real.
  async function cargarResumen(container) {
    const chart = container.querySelector('#val-chart');
    const stats = container.querySelector('#val-week-stat');
    const recent = container.querySelector('#val-recent');
    const cal = container.querySelector('#val-cal-dash');
    if (!chart && !stats && !recent && !cal) return;
    try {
      const data = await _reportsData();
      if (chart && document.body.contains(chart)) chart.innerHTML = chartHtml(data.report.byDay || []);
      if (stats && document.body.contains(stats)) stats.innerHTML = weekStatsHtml(data.report.byDay || []);
      if (recent && document.body.contains(recent)) recent.innerHTML = recentHtml(data.recent);
      if (cal && document.body.contains(cal)) cal.innerHTML = calendarHtml(_eventDays(data.report.byDay));
    } catch (e) {
      if (recent && document.body.contains(recent)) recent.innerHTML = '<p class="sub" style="margin:0">Sin conexión con el registro.</p>';
    }
  }

  async function cargarCalendario(container) {
    const cal = container.querySelector('#val-calendar');
    const recent = container.querySelector('#val-cal-recent');
    const count = container.querySelector('#val-cal-count');
    if (!cal && !recent) return;
    try {
      const data = await _reportsData();
      const days = _eventDays(data.report.byDay);
      if (cal && document.body.contains(cal)) cal.innerHTML = calendarHtml(days);
      if (count && document.body.contains(count)) count.textContent = days.size + ' día(s) con registros';
      if (recent && document.body.contains(recent)) recent.innerHTML = recentHtml(data.recent);
    } catch (e) {
      if (recent && document.body.contains(recent)) recent.innerHTML = '<p class="sub" style="margin:0">No se pudo cargar el registro.</p>';
    }
  }

  async function cargarReportes(container) {
    const box = container.querySelector('#val-report');
    const msg = container.querySelector('#val-report-msg');
    if (!box) return;
    function setMsg(text, ok) {
      if (!msg) return;
      msg.textContent = text || '';
      msg.className = 'v7-form-msg' + (text ? (ok ? ' ok' : ' err') : '');
    }
    setMsg('Actualizando…', true);
    try {
      const data = await _reportsData();
      if (box && document.body.contains(box)) box.innerHTML = reportHtml(data.report);
      setMsg('Actualizado ' + new Date().toLocaleTimeString('es-ES'), true);
    } catch (e) {
      if (box && document.body.contains(box)) box.innerHTML = '<p class="sub" style="margin:0">No se pudo cargar el reporte.</p>';
      setMsg(e.message || 'Error al cargar.', false);
    }
  }

  async function bindConfiguracion(container) {
    const form = container.querySelector('#val-config-form');
    const msg = container.querySelector('#val-config-msg');
    if (!form) return;
    function setMsg(text, ok) {
      if (!msg) return;
      msg.textContent = text || '';
      msg.className = 'v7-form-msg' + (text ? (ok ? ' ok' : ' err') : '');
    }
    function fill(settings) {
      const s = settings || {};
      ['orgName', 'logoUrl', 'numberingPrefix'].forEach((k) => {
        const el = form.querySelector('[data-cfg="' + k + '"]');
        if (el) el.value = s[k] == null ? '' : String(s[k]);
      });
      ['reviewRoles', 'approveRoles'].forEach((k) => {
        const el = form.querySelector('[data-cfg="' + k + '"]');
        if (!el || !el.options) return;
        const sel = new Set(Array.isArray(s[k]) ? s[k] : []);
        for (let i = 0; i < el.options.length; i++) el.options[i].selected = sel.has(el.options[i].value);
      });
    }
    const defaults = { orgName: 'StatAnalyzer Pro', logoUrl: '', numberingPrefix: 'VAL', reviewRoles: ['gerente'], approveRoles: ['admin', 'supervisor'] };
    fill(defaults);
    try {
      const r = await apiGet('/api/val/v1/settings');
      if (!r || !r.ok) throw new Error((r && r.error) || 'No se pudo leer la configuración');
      if (document.body.contains(form)) fill(r.settings || {});
    } catch (e) {
      setMsg('No se pudo leer la configuración; se muestran los valores por defecto.', false);
    }
    form.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      const values = {};
      ['orgName', 'logoUrl', 'numberingPrefix'].forEach((k) => {
        const el = form.querySelector('[data-cfg="' + k + '"]');
        values[k] = el ? String(el.value || '').trim() : '';
      });
      ['reviewRoles', 'approveRoles'].forEach((k) => {
        const el = form.querySelector('[data-cfg="' + k + '"]');
        values[k] = el && el.selectedOptions ? Array.prototype.map.call(el.selectedOptions, (o) => o.value) : [];
      });
      if (!values.orgName) return setMsg('El nombre de la organización es obligatorio.', false);
      if (!values.reviewRoles.length || !values.approveRoles.length) return setMsg('Seleccione al menos un rol para revisar y uno para aprobar.', false);
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      setMsg('Guardando…', true);
      try {
        const r = await apiSend('/api/val/v1/settings', 'PUT', values);
        if (!r || !r.ok) throw new Error((r && r.error) || 'No se pudo guardar');
        if (document.body.contains(form)) fill(r.settings || values);
        setMsg('Configuración guardada.', true);
      } catch (e) {
        setMsg(e.message || 'Error al guardar.', false);
      }
      if (btn) btn.disabled = false;
    });
  }

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

    function loadGen(entId, catId) {
    const porDefecto = (catId && GEN_FASES[catId]) ? GEN_FASES[catId].slice() : FASES_GEN.slice();
    try {
      if (typeof sessionStorage !== 'undefined') {
        const s = JSON.parse(sessionStorage.getItem(genKey(entId)) || 'null');
        if (s && Array.isArray(s.fases)) return { fases: s.fases, cond: s.cond || 'ambas' };
      }
    } catch (e) {}
    return { fases: porDefecto, cond: 'ambas' };
  }

  // H-01 (auditoría FDA): OQ/PQ sin banco de familia no se emite — solo saldría
  // el artículo común y el protocolo no demostraría operación ni desempeño.
  // IQ siempre tiene núcleo común; estabilidad/almacenes tienen bancos completos.
  // H-01 + mejora #3 (fail-closed): tres estados en vez de booleano.
  // 'ok' = hay banco de familia; 'sin-banco' = la familia no tiene banco
  // (no se genera); 'no-cargado' = el banco no está disponible (tampoco
  // se genera: antes fallaba abierto devolviendo true).
  function estadoBancoFam(fase, catId, entId) {
    if (catId !== 'equipos' || (fase !== 'OQ' && fase !== 'PQ')) return 'ok';
    try {
      if (typeof BancoEquipos !== 'undefined' && BancoEquipos && BancoEquipos.fases) {
        const items = (BancoEquipos.fases[fase] || []).filter((i) => i.id && (i.bloque === 2 || i.bloque === 3));
        const ent = String(entId || '').trim();
        return items.some((i) => i.familia && (!ent || i.familia === ent)) ? 'ok' : 'sin-banco';
      }
    } catch (e) {}
    return 'no-cargado';
  }

  function tieneBancoFam(fase, catId, entId) {
    return estadoBancoFam(fase, catId, entId) === 'ok';
  }

  function contarGen(fase, cond, catId, entId) {
    try {
      // DQ es un documento base desde la plantilla (sin banco de ensayos);
      // almacenes conserva su DQ con contenido.
      if (fase === 'DQ' && catId !== 'almacenes') return null;
      // Equipos/estabilidad/sistemas: mismo criterio que generar() — bloques 2-3, condición y familia/entidad.
      const BB = catId === 'estabilidad'
        ? (typeof BancoEstabilidad !== 'undefined' ? BancoEstabilidad : null)
        : catId === 'sistemas'
          ? (typeof BancoSistemas !== 'undefined' ? BancoSistemas : null)
          : (typeof BancoEquipos !== 'undefined' ? BancoEquipos : null);
      if ((catId === 'equipos' || catId === 'estabilidad' || catId === 'sistemas') && BB && BB.fases) {
        // Núcleo compartido (igual que mezclarComun en descargar): estabilidad IQ
        // suma los ensayos comunes del IQ de equipos.
        let items = (BB.fases[fase] || []).filter((i) => i.id && (i.bloque === 2 || i.bloque === 3));
        if (catId === 'estabilidad' && fase === 'IQ' && typeof BancoEquipos !== 'undefined' && BancoEquipos.fases) {
          const nucleo = (BancoEquipos.fases[fase] || []).filter((i) => i.id && (i.bloque === 2 || i.bloque === 3) && !i.familia);
          items = nucleo.concat(items);
        }
        const flt = cond || 'ambas';
        const ent = String(entId || '').trim();
        return items.filter((i) => (flt === 'ambas' || i.cond === 'ambas' || i.cond === flt)
          && (!i.familia || !ent || i.familia === ent)).length;
      }
      if (typeof GeneradorDocx !== 'undefined' && GeneradorDocx.contarEnsayos) {
        return GeneradorDocx.contarEnsayos(fase, cond);
      }
    } catch (e) {}
    return null;
  }

  function paso3Html(catId) {
    const fases = GEN_FASES[catId] || FASES_GEN.slice();
    return '<div class="v7-genrow">'
      + fases.map((f) => '<label class="v7-check"><input type="checkbox" class="gen-fase" value="' + f + '" checked><span>' + f + '</span></label>').join('')
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

  // Paso 1: botones si hay pocas entidades, combobox con buscador si hay muchas.
  const UMBRAL_COMBO = 10;

  function entidadPorNombre(catId, nombre) {
    const n = String(nombre || '').trim().toLowerCase();
    if (!n) return null;
    const list = getEntidades(catId);
    for (let i = 0; i < list.length; i++) {
      if (String(list[i].nombre).trim().toLowerCase() === n) return list[i];
    }
    return null;
  }

  function paso1Html(catId, ents) {
    // Estabilidad usa combobox como equipos aunque tenga pocas entidades.
    if (ents.length > UMBRAL_COMBO || catId === 'estabilidad') {
      return '<div class="v7-combo">'
        + '<input type="text" class="v7-ent-input" list="v7-ents-dl" placeholder="Escriba para buscar el equipo…" autocomplete="off" aria-label="Buscar entidad">'
        + '<datalist id="v7-ents-dl">'
        + ents.map((e) => '<option value="' + esc(e.nombre) + '">').join('')
        + '</datalist></div>';
    }
    return '<div class="v7-ents">'
      + ents.map((e) => '<button type="button" class="v7-ent" data-ent="' + esc(e.id) + '">' + esc(e.nombre) + '</button>').join('')
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
      + paso1Html(catId, ents)
      + '</div>'
      + '<div class="v7-step" data-step="2" hidden>'
      + '<div class="gt">2 · Datos de la entidad</div>'
      + '<form class="v7-dataform" novalidate>'
      + '<fieldset class="v7-fs"><legend>Datos generales</legend><div class="v7-grid">'
      + comun.map((f) => fieldHtml(f, '')).join('')
      + '</div></fieldset>'
      + '<fieldset class="v7-fs"><legend>' + esc(cat.nombre) + ' · Datos específicos</legend><div class="v7-grid">'
      + espec.map((f) => fieldHtml(f, '')).join('')
      + '</div></fieldset>'
      + (conGen ? firmantesHtml() : '')
      + '<div class="v7-form-actions">'
      + '<span class="v7-form-msg" role="status"></span>'
      + '<button type="button" class="v7-btn-save">Guardar borrador</button>'
      + (conGen ? '' : '<button type="button" class="v7-btn-gen" disabled title="Próximamente">Generar (próximamente)</button>')
      + '</div></form>'
      + '</div>'
      + '<div class="v7-step" data-step="3" hidden>'
      + '<div class="gt">3 · Protocolos a generar</div>'
      + (conGen ? paso3Html(catId)
        : '<div class="v7-empty">Generador disponible próximamente para esta categoría.</div>')
      + '</div></div>';
  }

  // Validación compartida por guardar (solo informa pendientes) y generar
  // (bloquea). Mantiene los valores tal como los da el formulario.
  function validarDatos(schema, data) {
    const errores = [];
    const d = data || {};
    (schema || []).forEach(function (f) {
      const raw = d[f.k];
      const s = String(raw == null ? '' : raw).trim();
      if (f.req && !s) { errores.push(f.label + ' es obligatorio'); return; }
      if (!s) return;
      if (f.tipo === 'number') {
        const n = Number(s);
        if (!Number.isFinite(n)) { errores.push(f.label + ' debe ser numérico'); return; }
        if (f.integer && !Number.isInteger(n)) errores.push(f.label + ' debe ser entero');
        if (f.min != null && n < f.min) errores.push(f.label + ' no puede ser menor que ' + f.min);
        if (f.max != null && n > f.max) errores.push(f.label + ' no puede ser mayor que ' + f.max);
      }
      if (f.tipo === 'date') {
        // Parseo en UTC: `new Date('YYYY-MM-DDT00:00:00')` usa la zona local
        // y rechaza fechas válidas en zonas UTC+ (Madrid, etc.).
        const d = new Date(s + 'T00:00:00Z');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) {
          errores.push(f.label + ' no es una fecha válida');
        }
      }
      if (f.tipo === 'select' && f.opciones && f.opciones.indexOf(s) < 0) errores.push(f.label + ' tiene una opción no válida');
    });
    const num = function (k) {
      const v = Number(d[k]);
      return String(d[k] == null ? '' : d[k]).trim() !== '' && Number.isFinite(v) ? v : null;
    };
    const tmin = num('temperaturaMin');
    const tmax = num('temperaturaMax');
    if (tmin != null && tmax != null && tmin >= tmax) errores.push('La temperatura mínima debe ser menor que la máxima');
    const hmin = num('humedadMin');
    const hmax = num('humedadMax');
    if ((hmin == null) !== (hmax == null)) errores.push('Complete ambos extremos de humedad o deje los dos vacíos');
    if (hmin != null && hmax != null && hmin > hmax) errores.push('La humedad mínima no puede ser mayor que la máxima');
    return errores;
  }

  // Lógica pura del autofill de descripción (testeable sin DOM):
  // devuelve { valor, manual } dado el valor actual, el nombre de la entidad
  // elegida, el nombre de la entidad anterior y si ya era manual.
  function resolverDescripcion(val, nom, ult, manual) {
    const v = String(val == null ? '' : val);
    const n = String(nom || '');
    const u = String(ult || '');
    if (!v.trim() || v.trim() === n.trim() || (!manual && u.trim() && v.trim() === u.trim())) {
      return { valor: n, manual: false };
    }
    return { valor: v, manual: true };
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
    try {
      form.querySelectorAll('.v7-fecha').forEach((el) => mejorarFecha(el));
    } catch (e) {}

    function setMsg(text, ok) {
      if (msg) {
        msg.textContent = text || '';
        msg.className = 'v7-form-msg' + (text ? (ok ? ' ok' : ' err') : '');
      }
    }

    function validarErrores() {
      return validarDatos(schemaTotal(), recoger());
    }

    function recoger() {
      const data = {};
      schemaTotal().forEach((f) => {
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
      schemaTotal().forEach((f) => {
        const el = form.querySelector('[data-k="' + f.k + '"]');
        if (el && f.tipo !== 'file' && data[f.k] != null) el.value = data[f.k];
        // El calendario flotante no se entera de value directo: sincronizar.
        try {
          if (el && el._flatpickr) el._flatpickr.setDate(el.value || null);
        } catch (e) {}
      });
    }

    // ---- Parámetros de límites por entidad (mejora #1, H-05) ----
    // El Paso 2 pide cada valor del banco con su unidad; el motor los
    // inserta con fuente URS o bloquea la descarga si falta alguno.
    function famParams() {
      if (!conGen) return [];
      if (typeof PlantillaDocx === 'undefined' || !PlantillaDocx.parametrosFamilia) return [];
      const fam = catId === 'estabilidad' ? 'estabilidad' : entActual;
      try { return PlantillaDocx.parametrosFamilia(fam) || []; } catch (e) { return []; }
    }

    function schemaTotal() {
      const extra = famParams().map((p) => ({
        k: 'param_' + p.clave,
        label: p.label + ' (' + p.unidad + ')',
        tipo: 'text',
        req: true,
      }));
      return schema.concat(extra);
    }

    function pintarParametros(draft) {
      let box = form.querySelector('.v7-params');
      const ps = famParams();
      if (!ps.length) { if (box) box.hidden = true; return; }
      if (!box && form.insertAdjacentHTML) {
        const acts = form.querySelector('.v7-form-actions');
        const html = '<fieldset class="v7-fs v7-params"><legend>Parámetros del banco (fuente: URS aprobada)</legend><div class="v7-grid"></div></fieldset>';
        if (acts && acts.insertAdjacentHTML) acts.insertAdjacentHTML('beforebegin', html);
        else form.insertAdjacentHTML('beforeend', html);
        box = form.querySelector('.v7-params');
      }
      if (!box) return;
      box.hidden = false;
      const grid = box.querySelector('.v7-grid') || box;
      const d = draft || {};
      grid.innerHTML = ps.map((p) => {
        const k = 'param_' + p.clave;
        const v = d[k] != null ? String(d[k]) : '';
        return fieldHtml({ k, label: p.label + ' (' + p.unidad + ')', tipo: 'text', req: true }, v);
      }).join('');
    }

    // ---- Firmantes (T0 automático + T2 con 2 combobox) ----
    let firmMe = null;
    let firmGerentes = [];
    let firmCache = null;
    let firmListenerBound = false;
    let firmLoaded = false;

    function firmNombres(u) {
      return ([u.nombre, u.apellido].filter(Boolean).join(' ') || u.username || '').trim();
    }

    function pintarFirmantes(firm) {
      const f = firm || {};
      const rea = form.querySelector('[data-k="realizadoPor"]');
      const sel = form.querySelector('[data-k="revisorGerente"]');
      const area = form.querySelector('[data-k="gerenciaArea"]');
      if (rea && f.realizado && (f.realizado.nombre || f.realizado.username)) {
        rea.value = f.realizado.nombre + (f.realizado.cargo ? ' / (' + f.realizado.cargo + ')' : '');
        firmMe = f.realizado;
      }
      // Responsable automático: mismo usuario del login que Realizado por
      const resp = form.querySelector('[data-k="responsable"]');
      const me = (f.realizado && (f.realizado.nombre || f.realizado.username)) ? f.realizado : firmMe;
      if (resp && me && (me.nombre || me.username)) {
        resp.value = (me.nombre || me.username) + (me.cargo ? ' / (' + me.cargo + ')' : '');
      }
      if (sel) {
        const actual = sel.value || '';
        const elegido = (f.revisor && f.revisor.username) ? f.revisor.username : actual;
        sel.innerHTML = '<option value="">— Seleccione —</option>' + firmGerentes.map((u) =>
          '<option value="' + esc(u.username) + '"' + (elegido === u.username ? ' selected' : '') + '>'
          + esc(firmNombres(u)) + (u.cargo ? ' · ' + esc(u.cargo) : '') + '</option>').join('');
      }
      if (area && f.revisor && f.revisor.area != null) area.value = f.revisor.area;
      // Sin área guardada: se deriva del cargo del gerente ya seleccionado.
      if (area && !String(area.value || '').trim()) {
        const g = firmGerentes.filter((u) => u.username === (sel ? sel.value : ''))[0];
        const a = areaDesdeCargo(g && g.cargo);
        if (a) area.value = a;
      }
    }

    function leerFirmantes() {
      const rea = form.querySelector('[data-k="realizadoPor"]');
      const sel = form.querySelector('[data-k="revisorGerente"]');
      const area = form.querySelector('[data-k="gerenciaArea"]');
      const g = firmGerentes.filter((u) => sel && u.username === sel.value)[0] || null;
      const areaV = area ? String(area.value || '').trim() : '';
      return {
        realizado: firmMe,
        revisor: g ? {
          username: g.username,
          nombre: firmNombres(g),
          area: areaV,
          puesto: puestoGerente(areaV, g.cargo),
        } : { username: '', nombre: '', area: areaV, puesto: '' },
        _reaTxt: rea ? String(rea.value || '').trim() : '',
      };
    }

    function validarFirmantes() {
      if (!conGen) return 0;
      const f = leerFirmantes();
      let falta = 0;
      if (!f.realizado || !(f.realizado.nombre || f.realizado.username)) falta++;
      if (!f.revisor.username) falta++;
      if (!f.revisor.area) falta++;
      return falta;
    }

    async function cargarFirmantes(draft) {
      if (!conGen) return;
      const sel = form.querySelector('[data-k="revisorGerente"]');
      const rea = form.querySelector('[data-k="realizadoPor"]');
      const mine = entActual;
      const s = session() || {};
      const fallback = { username: s.username || '', nombre: s.username || '', cargo: '' };
      firmMe = firmMe || fallback;
      // Mientras responde el API ya hay un nombre (no se bloquea el flujo).
      if (rea && !String(rea.value || '').trim()) rea.value = firmMe.nombre || firmMe.username || '';
      const resp0 = form.querySelector('[data-k="responsable"]');
      if (resp0 && !String(resp0.value || '').trim()) resp0.value = rea ? String(rea.value || '') : (firmMe.nombre || '');
      // Cache local de revisores: si el API falla, el select sigue usable.
      if (!firmCache) {
        try {
          const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem('val-firmantes-cache') : null;
          firmCache = raw ? JSON.parse(raw) : null;
        } catch (e) { firmCache = null; }
      }
      if (Array.isArray(firmCache) && firmCache.length) {
        firmGerentes = firmCache;
        pintarFirmantes({ realizado: firmMe, revisor: (draft && draft.firmantes && draft.firmantes.revisor) || {} });
      }
      try {
        if (!firmLoaded) {
          const me = await apiGet('/api/me');
          if (entActual !== mine) return;
          const prof = (me && (me.profile || me)) || {};
          firmMe = {
            username: s.username || me.username || '',
            nombre: firmNombres(prof) || s.username || '',
            cargo: String(prof.cargo || '').trim(),
          };
          const ul = await apiGet('/api/users/list');
          if (entActual !== mine) return;
          const todos = (ul && ul.users) || [];
          const gerentes = todos.filter((u) => u.role === 'gerente');
          // Fallback: sin gerente configurado, admin/supervisor pueden revisar.
          firmGerentes = gerentes.length ? gerentes : todos.filter((u) => u.role === 'admin' || u.role === 'supervisor');
          firmCache = firmGerentes;
          firmLoaded = true;
          try { if (typeof localStorage !== 'undefined') localStorage.setItem('val-firmantes-cache', JSON.stringify(firmGerentes)); } catch (e) {}
        }
        pintarFirmantes({ realizado: firmMe, revisor: (draft && draft.firmantes && draft.firmantes.revisor) || {} });
      } catch (e) {
        if (sel && !firmGerentes.length) sel.innerHTML = '<option value="">(sin conexión)</option>';
        else pintarFirmantes({ realizado: firmMe, revisor: (draft && draft.firmantes && draft.firmantes.revisor) || {} });
      }
      // El cargo del gerente elegido llena siempre el área (incluye cambio de gerente).
      if (sel && !firmListenerBound) {
        firmListenerBound = true;
        sel.addEventListener('change', function () {
          const g = firmGerentes.filter((u) => u.username === sel.value)[0];
          const area = form.querySelector('[data-k="gerenciaArea"]');
          const a = areaDesdeCargo(g && g.cargo);
          if (area) area.value = a;
        });
      }
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
      // Fases sin banco de familia (o banco no cargado): se desmarcan,
      // se deshabilitan y se rotulan con el motivo.
      step3.querySelectorAll('.gen-fase').forEach((ch) => {
        const est = estadoBancoFam(ch.value, catId, entActual);
        const bloqueada = est !== 'ok';
        if (bloqueada) ch.checked = false;
        ch.disabled = bloqueada;
        if (bloqueada) ch.title = est === 'no-cargado'
          ? 'Banco de ensayos no cargado: no se puede generar.'
          : 'Sin banco de ensayos de esta familia: no se genera protocolo vacío.';
        else ch.removeAttribute('title');
        const lab = ch.closest ? ch.closest('.v7-check') : null;
        if (lab) lab.classList.toggle('sin-banco', bloqueada);
      });
      const sel = leerSel3();
      const box = step3.querySelector('.v7-genresumen');
      if (box) {
        // Badge con el borrador actual: lo confirmado sale de pendientes.
        let vista = null;
        try { vista = recoger(); } catch (e) { vista = null; }
        const parts = sel.fases.map((f) => {
          const n = contarGen(f, sel.cond, catId, entActual);
          let extra = '';
          // H-05: rotula límites provisionales o sin tabla (nunca silencioso).
          if (typeof PlantillaDocx !== 'undefined' && PlantillaDocx.limitesResumen) {
            try {
              const pend = PlantillaDocx.limitesResumen(f, catId, entActual, sel.cond, vista);
              if ((pend.sinEntrada || []).length) extra += ' · ⛔ ' + pend.sinEntrada.length + ' límite(s) sin tabla';
              else if ((pend.provisionales || []).length) extra += ' · ⚠ ' + pend.provisionales.length + ' límite(s) provisional(es)';
            } catch (e) {}
          }
          return f + (n == null ? '' : ' (' + n + ' ensayos)') + extra;
        });
        const todas = (GEN_FASES[catId] || FASES_GEN.slice());
        const sinBanco = todas.filter((f) => !tieneBancoFam(f, catId, entActual));
        box.innerHTML = '<strong>DOCUMENTOS A GENERAR:</strong> '
          + (parts.length ? esc(parts.join(' · ')) : 'ninguno seleccionado')
          + (sinBanco.length ? ' — <span class="v7-sin-banco">SIN BANCO DE FAMILIA: ' + esc(sinBanco.join(', ')) + '</span>' : '');
      }
      if (entActual) saveGen(entActual, sel);
    }

    function restaurarSel3() {
      if (!step3 || !conGen || !entActual) return;
      const sel = loadGen(entActual, catId);
      step3.querySelectorAll('.gen-fase').forEach((ch) => {
        // Nunca se restaura una fase sin banco (defensa en profundidad H-01).
        ch.checked = !ch.disabled && sel.fases.indexOf(ch.value) >= 0;
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
      const errores = validarErrores();
      const faltaFirm = validarFirmantes();
      if (errores.length || faltaFirm) {
        const prim = errores.slice(0, 2).join(' · ');
        setGenMsg((prim || 'Complete los firmantes (revisor y gerencia).')
          + (errores.length > 2 ? ' (+' + (errores.length - 2) + ' más)' : ''), false);
        return;
      }
      const sel = leerSel3();
      if (!sel.fases.length) { setGenMsg('Seleccione al menos un protocolo.', false); return; }
      // H-01: nunca emitir OQ/PQ sin banco de familia (defensa en profundidad).
      const bloqueadas = sel.fases.filter((f) => !tieneBancoFam(f, catId, entActual));
      let permitidas = sel.fases.filter((f) => tieneBancoFam(f, catId, entActual));
      if (!permitidas.length) {
        const motivo = bloqueadas.some((f) => estadoBancoFam(f, catId, entActual) === 'no-cargado')
          ? 'Banco de ensayos no cargado: recargue la página antes de generar.'
          : 'Sin banco de ensayos de la familia para ' + bloqueadas.join(', ') + ': no se genera protocolo vacío.';
        setGenMsg(motivo, false); return;
      }
      // H-05: fases con "[n]" sin entrada en la tabla de límites no se emiten.
      if (typeof PlantillaDocx !== 'undefined' && PlantillaDocx.limitesResumen) {
        const sinTabla = permitidas.filter((f) => {
          try {
            return (PlantillaDocx.limitesResumen(f, catId, entActual, sel.cond).sinEntrada || []).length > 0;
          } catch (e) { return false; }
        });
        if (sinTabla.length) {
          if (sinTabla.length === permitidas.length) {
            setGenMsg('Límites "[n]" sin tabla preaprobada en ' + sinTabla.join(', ') + ': complete la tabla de límites antes de generar.', false); return;
          }
          bloqueadas.push.apply(bloqueadas, sinTabla);
          permitidas = permitidas.filter((f) => sinTabla.indexOf(f) < 0);
        }
      }
      sel.fases = permitidas;
      saveGen(entActual, sel);
      const draft = recoger();
      draft.firmantes = leerFirmantes();
      // Blindaje: sin fecha o código no se genera (el .docx conservaría DD/MMM/AAAA)
      if (!String(draft.fecha || '').trim()) { setGenMsg('Complete la Fecha del paso 2 antes de generar.', false); return; }
      if (!String(draft.codigo || '').trim()) { setGenMsg('Complete el Código del paso 2 antes de generar.', false); return; }
      // H-09: URS y riesgo con código y versión son obligatorios para generar.
      if (!String(draft.ursCodigo || '').trim() || !String(draft.ursVersion || '').trim()
        || !String(draft.riesgoCodigo || '').trim() || !String(draft.riesgoVersion || '').trim()) {
        setGenMsg('Complete URS y análisis de riesgo (código y versión) del paso 2 antes de generar.', false); return;
      }
      // Mejora #1/#2: parámetros del banco sin valor en el borrador bloquean
      // la descarga (nunca un provisional silencioso en el .docx).
      if (typeof PlantillaDocx !== 'undefined' && PlantillaDocx.paramsFaltantes) {
        try {
          const falt = [];
          sel.fases.forEach((f) => {
            PlantillaDocx.paramsFaltantes(f, catId, entActual, sel.cond, draft).forEach((p) => falt.push(p));
          });
          if (falt.length) {
            const prim = falt.slice(0, 3).map((p) => p.id + ' [' + p.token + '] ' + p.label).join('; ');
            setGenMsg('Faltan ' + falt.length + ' parámetro(s) del banco en el paso 2: ' + prim + (falt.length > 3 ? '…' : ''), false); return;
          }
        } catch (e) {}
      }
      const ent = entidadObj();
      const registrar = async function (r) {
        const bytes = r && r.bytes;
        if (!bytes || !bytes.length) throw new Error('Documento vacío: no se registró.');
        const resp = await apiSend('/api/val/v1/protocols', 'POST', {
          category: catId, entity: entActual, phase: r.fase,
          code: draft.codigo, version: draft.versionProtocolo || '01',
          filename: r.filename, fileBase64: bytesToBase64(bytes),
        });
        if (!resp || !resp.ok) throw new Error((resp && resp.error) || 'No se pudo registrar el protocolo. No se descargó.');
        return resp;
      };
      const btn = step3.querySelector('.v7-btn-download');
      if (btn) btn.disabled = true;
      try {
        for (let i = 0; i < sel.fases.length; i++) {
          const f = sel.fases[i];
          setGenMsg('Generando ' + f + '… (' + (i + 1) + '/' + sel.fases.length + ')', true);
          // DQ de equipos/estabilidad/sistemas: scaffold desde la plantilla DQ
          // con los datos del borrador. Almacenes conserva su DQ con contenido.
          if (f === 'DQ' && catId !== 'almacenes' && typeof PlantillaDocx !== 'undefined' && PlantillaDocx.descargarDQ) {
            const rDQ = await PlantillaDocx.descargarDQ(draft, ent, registrar);
            if (rDQ && rDQ.avisos && rDQ.avisos.length) setGenMsg('[' + f + '] ' + rDQ.avisos[0], true);
          } else if (typeof PlantillaDocx !== 'undefined' && PlantillaDocx.soporta(f)) {
            if (typeof window !== 'undefined' && (typeof DecompressionStream === 'undefined' || typeof CompressionStream === 'undefined')) {
              throw new Error('El navegador no soporta compresión ZIP (use Edge/Chrome).');
            }
            const r = await PlantillaDocx.descargar(f, draft, ent, sel.cond, catId, registrar);
            if (r && r.avisos && r.avisos.length) setGenMsg('[' + f + '] ' + r.avisos[0], true);
          } else {
            if (typeof window !== 'undefined' && !window.docx) {
              throw new Error('Cargando librería docx… reintente en unos segundos.');
            }
            await GeneradorDocx.descargar(f, draft, ent, sel.cond, registrar);
          }
        }
        setGenMsg('Descargados ' + sel.fases.length + ' documento(s).', true);
        if (bloqueadas.length) setGenMsg('Descargados ' + sel.fases.length + ' documento(s). Sin banco de familia (no generados): ' + bloqueadas.join(', ') + '.', true);
      } catch (err) {
        setGenMsg('Error al generar: ' + (err && err.message ? err.message : err), false);
      }
      if (btn) btn.disabled = false;
    }

    // ---- Descripción automática desde la entidad (fuente única + override manual) ----
    // Al elegir entidad se rellena con su nombre salvo edición manual previa;
    // el preview muestra cómo saldrá en encabezado/portada (mayúsculas).
    function nombreEntidad() {
      const o = entidadObj();
      return String((o && o.nombre) || entActual || '');
    }
    function pintarDescripcion() {
      const inp = form.querySelector('[data-k="descripcion"]');
      if (!inp) return;
      let prev = form.querySelector('.v7-desc-preview');
      if (!prev && inp.parentNode && inp.parentNode.insertAdjacentHTML) {
        inp.parentNode.insertAdjacentHTML('beforeend', '<div class="v7-desc-preview" role="status"></div>');
        prev = form.querySelector('.v7-desc-preview');
      }
      const nom = nombreEntidad();
      const r = resolverDescripcion(inp.value, nom, ultEntNombre, !!(inp.dataset && inp.dataset.manual === '1'));
      inp.value = r.valor;
      try {
        if (r.manual) inp.dataset.manual = '1';
        else delete inp.dataset.manual;
      } catch (e) {}
      if (prev) {
        const v = String(inp.value || '').trim();
        prev.textContent = 'Saldrá como: ' + (v ? v.toUpperCase() : '—')
          + (inp.dataset && inp.dataset.manual ? ' (personalizado)' : '');
      }
      ultEntNombre = nom;
    }
    let ultEntNombre = '';

    let cargaToken = 0;

    async function elegirEntidad(entId) {
      if (!entId) return false;
      const token = ++cargaToken;
      main.querySelectorAll('.v7-ent').forEach((b) => b.classList.toggle('sel', b.getAttribute('data-ent') === entId));
      step2.hidden = false;
      setMsg('Cargando borrador…', true);
      const draft = await cargarBorrador(entId, catId);
      if (token !== cargaToken) return false;
      entActual = entId;
      pintarParametros(draft);
      cargar(draft);
      pintarDescripcion();
      setMsg(Object.keys(draft).length ? 'Borrador cargado' : '', true);
      if (conGen) {
        await cargarFirmantes(draft);
        if (token !== cargaToken) return false;
      }
      if (step3 && conGen) {
        step3.hidden = false;
        restaurarSel3();
      }
      try { step2.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (err) {}
      return true;
    }

    main.onclick = function (e) {
      const ent = e.target && e.target.closest ? e.target.closest('.v7-ent') : null;
      if (ent) {
        elegirEntidad(ent.getAttribute('data-ent'));
        return;
      }
      if (e.target && e.target.classList && e.target.classList.contains('v7-btn-save')) {
        e.preventDefault();
        if (!entActual) { setMsg('Seleccione una entidad antes de guardar.', false); return; }
        const data = recoger();
        data.firmantes = leerFirmantes();
        const pendientes = validarErrores().length + validarFirmantes();
        guardarBorrador(entActual, catId, data).then((res) => {
          if (!res.ok) { setMsg('No se pudo guardar el borrador.', false); return; }
          setMsg('Borrador guardado' + (res.remoto ? '' : ' en este equipo')
            + (pendientes ? ' · ' + pendientes + ' campo(s) pendiente(s) para generar' : ''), true);
        });
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
    };

    if (step3 && step3.addEventListener) {
      step3.addEventListener('change', function (e) {
        if (e.target && e.target.classList && e.target.classList.contains('gen-cond')) pintarResumen3();
      });
    }

    // Combobox con buscador (categorías con muchas entidades)
    const comboInput = main.querySelector('.v7-ent-input');
    if (comboInput && comboInput.addEventListener) {
      comboInput.addEventListener('change', function () {
        const found = entidadPorNombre(catId, comboInput.value);
        if (found) elegirEntidad(found.id);
        else setMsg('Escriba y seleccione una entidad de la lista.', false);
      });
    }

    if (form.addEventListener) {
      form.addEventListener('submit', function (e) { e.preventDefault(); });
      form.addEventListener('input', function () { setMsg(''); });
      // Edición manual de la descripción: se respeta ante cambios de entidad
      form.addEventListener('input', function (e) {
        const t = e && e.target;
        if (t && t.getAttribute && t.getAttribute('data-k') === 'descripcion') {
          try {
            if (String(t.value || '').trim() !== nombreEntidad().trim()) t.dataset.manual = '1';
            else delete t.dataset.manual;
          } catch (err) {}
          pintarDescripcionPreviewSolo();
        }
      });
    }

    function pintarDescripcionPreviewSolo() {
      const inp = form.querySelector('[data-k="descripcion"]');
      const prev = form.querySelector('.v7-desc-preview');
      if (inp && prev) {
        const v = String(inp.value || '').trim();
        prev.textContent = 'Saldrá como: ' + (v ? v.toUpperCase() : '—')
          + (inp.dataset && inp.dataset.manual ? ' (personalizado)' : '');
      }
    }
  }

  function render() {
    const root = document.getElementById('validaciones-app');
    if (!root) return;
    const content = /** @type {HTMLElement} */ (root.querySelector('.vd-content') || root.querySelector('.v7-main'));
    if (!content) return;
    // El nodo es persistente: sin esto el clic de la vista anterior sigue vivo
    // y "Generar y descargar" se ejecuta una vez por cada ficha visitada.
    content.onclick = null;
    if (!isAdmin()) {
      content.innerHTML = viewDev();
      return;
    }
    const route = parseRoute(window.location.hash);
    if (route.indexOf('entidad/') === 0) {
      const catId = route.slice('entidad/'.length);
      content.innerHTML = viewEntidad(catId);
      bindEntidad(content, catId);
    } else if (route === 'banco') {
      content.innerHTML = viewBanco();
      cargarResumen(content);
    } else if (route === 'generador') {
      content.innerHTML = viewGenerador();
    } else if (route === 'calendario') {
      content.innerHTML = viewCalendario();
      cargarCalendario(content);
    } else if (route === 'protocolos') {
      content.innerHTML = viewProtocolos();
      cargarProtocolos(content);
    } else if (route === 'documentacion') {
      content.innerHTML = viewDocumentacion();
    } else if (route === 'reportes') {
      content.innerHTML = viewReportes();
      cargarReportes(content);
      const refresh = content.querySelector('#val-report-refresh');
      if (refresh) refresh.addEventListener('click', function () { cargarReportes(content); });
    } else if (route === 'configuracion') {
      content.innerHTML = viewConfiguracion();
      bindConfiguracion(content);
    } else if (route === 'ayuda') {
      content.innerHTML = viewAyuda();
    } else {
      content.innerHTML = viewBanco();
      cargarResumen(content);
    }
    const activo = route.indexOf('entidad/') === 0 ? 'banco' : route;
    root.querySelectorAll('[data-route]').forEach(function (el) {
      if (el.getAttribute('data-route') === activo) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    });
  }

  let _valEscHandler = null;

  function show() {
    try {
      if (typeof document === 'undefined' || !document.createElement) return false;
      hide();
      // Entrada al módulo: siempre al dashboard (banco), nunca a la última vista.
      try {
        if (typeof window !== 'undefined' && window.location && window.location.hash !== '#/banco') window.location.hash = '#/banco';
      } catch (err) {}
      const user = currentUser() || 'usuario';
      const role = (session() || {}).role || '';
      const roleLabel = ({
        admin: 'Administrador', supervisor: 'Supervisor', analista: 'Analista',
        gerente: 'Gerente', coordinador: 'Coordinador', readonly: 'Solo lectura', user: 'Usuario',
      })[role] || role || 'Usuario';
      const navItem = function (r) {
        return '<a href="#/' + r.id + '" data-route="' + r.id + '" target="_self">'
          + '<span class="ico" aria-hidden="true">' + r.icono + '</span>' + esc(r.label) + '</a>';
      };
      const mainNav = ROUTES.filter(function (r) { return r.grupo === 'main'; }).map(navItem).join('');
      const confNav = ROUTES.filter(function (r) { return r.grupo === 'config'; }).map(navItem).join('');
      const ov = document.createElement('div');
      ov.id = 'validaciones-app';
      ov.innerHTML = '<a class="skip-link" href="#vd-content">Saltar al contenido</a>'
        + '<div class="app"><aside class="sidebar" id="vd-sidebar">'
        + '<div class="brand"><div class="brand-mark" aria-hidden="true">Σ</div><div class="brand-name">Stat<span>Analyzer</span> Pro</div></div>'
        + '<div><p class="nav-label">MENÚ PRINCIPAL</p><nav class="nav" aria-label="Menú principal">' + mainNav + '</nav></div>'
        + '<div><p class="nav-label">CONFIGURACIÓN</p><nav class="nav" aria-label="Configuración">' + confNav + '</nav></div>'
        + '<div class="side-bottom"><div class="help-card"><strong>¿Necesitas ayuda?</strong><p>Consulta la guía de usuario de StatAnalyzer Pro.</p>'
        + '<button type="button" data-route="ayuda">Ver documentación <span aria-hidden="true">↗</span></button></div></div>'
        + '</aside><div class="nav-overlay" id="vd-overlay"></div>'
        + '<main><header class="topbar">'
        + '<button class="icon-btn menu-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="vd-sidebar"><span aria-hidden="true">☰</span></button>'
        + '<div class="welcome"><h1>¡Bienvenido de nuevo!</h1><p>Este es el resumen de actividad de tu entorno StatAnalyzer Pro.</p></div>'
        + '<div class="top-actions"><input class="search" id="v7-search" placeholder="Buscar categoría o entidad…" aria-label="Buscar"></div>'
        + '<div class="top-tools"><button class="icon-btn" type="button" data-act="notifications" aria-label="Notificaciones"><span aria-hidden="true">♧</span><i class="dot" aria-hidden="true"></i></button>'
        + '<button class="profile" type="button" data-act="area" aria-label="Cambiar de área"><span class="avatar" aria-hidden="true">' + esc(firstLetter(user)) + '</span>'
        + '<span><strong>' + esc(user) + '</strong><small>' + esc(roleLabel) + '</small></span><span aria-hidden="true" style="color:#8291a3">⌄</span></button></div>'
        + '</header><div class="vd-content" id="vd-content" tabindex="-1"></div></main></div>';

      const sidebar = ov.querySelector('.sidebar');
      const overlay = ov.querySelector('.nav-overlay');
      const toggle = ov.querySelector('.menu-toggle');
      const media = (typeof window !== 'undefined' && window.matchMedia) ? window.matchMedia('(max-width:760px)') : { matches: false, addEventListener: null };
      function syncInert() {
        if (!sidebar || !sidebar.classList) return;
        const hidden = media.matches && !sidebar.classList.contains('open');
        if (hidden) sidebar.setAttribute('inert', '');
        else sidebar.removeAttribute('inert');
      }
      function setOpen(open) {
        if (!sidebar || !sidebar.classList || !overlay || !overlay.classList) return;
        sidebar.classList.toggle('open', open);
        overlay.classList.toggle('open', open);
        ov.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        syncInert();
      }
      if (toggle && toggle.addEventListener) {
        toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
      }
      if (overlay && overlay.addEventListener) overlay.addEventListener('click', function () { setOpen(false); });
      if (sidebar && sidebar.querySelectorAll) {
        sidebar.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', function () { setOpen(false); }); });
      }
      const escHandler = function (event) { if (event.key === 'Escape') setOpen(false); };
      document.addEventListener('keydown', escHandler);
      _valEscHandler = escHandler;
      if (media.addEventListener) media.addEventListener('change', syncInert);
      syncInert();

      ov.addEventListener('click', function (/** @type {MouseEvent} */ e) {
        const tgt = /** @type {HTMLElement|null} */ (e.target);
        const item = tgt && tgt.closest ? tgt.closest('[data-route], [data-act]') : null;
        if (!item) return;
        const route = item.getAttribute('data-route');
        if (route) {
          e.preventDefault();
          try { window.location.hash = '#/' + route; } catch (err) {}
          setOpen(false);
          return;
        }
        if (item.getAttribute('data-act') === 'area') {
          try {
            if (typeof Auth !== 'undefined' && Auth.selectArea) { Auth.selectArea(); return; }
            if (typeof AreaSelect !== 'undefined' && AreaSelect.showModal) AreaSelect.showModal();
          } catch (err) {}
          return;
        }
        if (item.getAttribute('data-act') === 'notifications') {
          try { if (typeof showToast === 'function') showToast('Sin notificaciones nuevas'); } catch (err) {}
        }
      });

      const search = /** @type {HTMLInputElement|null} */ (ov.querySelector('#v7-search'));
      if (search && search.addEventListener) {
        search.addEventListener('input', function () {
          const q = String(search.value || '').toLowerCase();
          ov.querySelectorAll('.category, .v7-cat, .v7-ent').forEach(function (el) {
            const node = /** @type {HTMLElement} */ (el);
            const n = (node.getAttribute('data-name') || node.textContent || '').toLowerCase();
            node.style.display = !q || n.indexOf(q) >= 0 ? '' : 'none';
          });
        });
      }

      document.body.appendChild(ov);
      render();
      return true;
    } catch (e) { return false; }
  }

  function hide() {
    try {
      if (_valEscHandler && document && document.removeEventListener) {
        document.removeEventListener('keydown', _valEscHandler);
        _valEscHandler = null;
      }
      document.getElementById('validaciones-view')?.remove();
      document.getElementById('validaciones-app')?.remove();
      return true;
    } catch (e) { return false; }
  }

  // Los bancos de ensayos y los generadores .docx (~2,6 MB) se cargan
  // bajo demanda (Opción D2): solo al entrar al área de Validaciones.
  // Sin loader (tests o HTML viejo en caché) se comporta como antes y
  // muestra el módulo al instante.
  function apply(area) {
    if (area !== 'validaciones') return hide();
    try {
      if (typeof window !== 'undefined' &&
          typeof window.__sigmaLoadGroup === 'function' &&
          typeof window.__sigmaGroupReady === 'function' &&
          !window.__sigmaGroupReady('validaciones')) {
        var abrir = function() {
          try {
            if (currentArea() !== 'validaciones') return;
            if (typeof BancoEquipos === 'undefined') {
              if (typeof showToast === 'function') showToast('❌ No se pudo cargar el banco de ensayos', 1);
              return;
            }
            show();
          } catch (e) {}
        };
        window.__sigmaLoadGroup('validaciones').then(abrir, abrir);
        try { if (typeof showToast === 'function') showToast('⏳ Cargando banco de ensayos…'); } catch (e) {}
        return true;
      }
    } catch (e) {}
    return show();
  }

  function onHash() {
    try {
      if (document.getElementById('validaciones-app')) render();
    } catch (e) {}
  }

  function init() {
    try {
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('sigma-area', function (/** @type {CustomEvent} */ e) {
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
    CATS, ROUTES, DOCS, ENTIDADES, SCHEMAS, FASES_GEN, GEN_FASES, AREAS_GERENCIA, parseRoute, catById, getSchema, getEntidades,
    entidadPorNombre,
    puestoGerente, areaDesdeCargo, firmantesHtml, saveDraft, loadDraft, cargarBorrador, guardarBorrador, validarDatos, saveGen, loadGen, viewEntidad, show, hide, apply, currentArea, render, contarGen, tieneBancoFam, estadoBancoFam, resolverDescripcion, mejorarFecha, manifest, viewProtocolos,
    viewDocumentacion, viewReportes, viewConfiguracion, viewAyuda, viewCalendario, chartHtml, reportHtml, calendarHtml, cargarResumen, cargarCalendario, cargarReportes, bindConfiguracion,
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Validaciones;
