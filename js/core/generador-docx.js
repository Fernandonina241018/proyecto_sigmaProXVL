// ========================================
// generador-docx.js — SigmaProXVL · Área de Validaciones
// Ensambla protocolos .docx (Almacenes v1) con el esqueleto del modelo
// DQ-1-400AAAA: firmas 2x2, TOC con páginas, objetivo, alcance,
// responsabilidades, descripción, procedimiento (1 ensayo = 1 página),
// resumen, registro 17x4, referencias, anexos, historial + footer SUED.
// Textos fijos copiados del modelo. Parte pura testeable; el render usa
// `docx` (window en navegador, require en node).
// ========================================

const GeneradorDocx = (() => {
  const FASE_NOMBRE = { DQ: 'DISEÑO', IQ: 'INSTALACIÓN', OQ: 'OPERACIÓN', PQ: 'DESEMPEÑO' };
  const COND_TXT = { est: 'estática', dina: 'dinámica', ambas: 'estática y dinámica' };
  const FOOTER_TXT = 'PARA USO EXCLUSIVO DE LABORATORIOS SUED, S.R.L.';

  // ---- Textos fijos del modelo DQ-1-400AAAA ----
  const T = {
    firmaIntro: 'Los firmantes del presente documento certifican que han revisado y aprobado el protocolo de calificación para su ejecución. Cualquier modificación al alcance, contenido, metodología o criterios establecidos en este protocolo deberá ser documentada, justificada y aprobada formalmente antes de su implementación por parte de los responsables correspondientes.',
    objetivo: 'Describir las verificaciones y criterios de evaluación utilizados para determinar que el equipo seleccionado, el proveedor y la configuración especificados pueden satisfacer las necesidades de cumplimiento para su uso previsto, según los requisitos del usuario y Laboratorios Sued, S.R.L.',
    roles: [
      { rol: 'Es Responsabilidad del Analista de Validaciones:', items: [
        'Redactar el protocolo de calificación conforme con las regulaciones, guías y procedimientos vigentes aplicables.',
        'Revisar las condiciones para la ejecución del protocolo, asegurando que las utilidades y materiales necesarios estén disponibles.',
        'Ejecutar las actividades de calificación descritas en el protocolo, siguiendo las instrucciones y criterios de aceptación establecidos.',
        'Registrar, verificar y documentar los resultados obtenidos durante la ejecución de las pruebas, asegurando la integridad y trazabilidad de los datos generados.',
        'Revisar toda la documentación y evidencia generada durante la ejecución del protocolo para garantizar su exactitud, integridad y cumplimiento con los requisitos establecidos.',
        'Identificar, documentar y comunicar cualquier desviación, incidencia o resultado fuera de especificación detectado durante la ejecución de la calificación.',
        'Redactar el informe final de calificación, incluyendo los resultados obtenidos, las desviaciones identificadas, las acciones implementadas y la conclusión correspondiente.',
      ] },
      { rol: 'Es Responsabilidad del Coordinador Validaciones:', items: [
        'Revisar el protocolo para Calificación de Diseño del equipo.',
        'Revisar la documentación resultante de la ejecución del protocolo.',
        'Revisar cualquier reporte de desviación generado durante la ejecución del protocolo.',
      ] },
      { rol: 'Es Responsabilidad del Gerente de Área:', items: [
        'Revisar el protocolo para Calificación de Diseño del equipo.',
        'Revisar la documentación resultante de la ejecución del protocolo.',
        'Revisar cualquier reporte de desviación generado durante la ejecución del protocolo.',
      ] },
      { rol: 'Es Responsabilidad del Gerente Gestión de Calidad:', items: [
        'Aprobar el protocolo para Calificación del Diseño.',
        'Aprobar la documentación resultante de la ejecución del protocolo.',
        'Aprobar cualquier reporte de desviación generado durante la ejecución del protocolo.',
      ] },
    ],
    reqPrevios: 'Objetivo: verificar que toda la documentación, información técnica y requisitos necesarios para la ejecución de la Calificación de Diseño (DQ) se encuentren disponibles, vigentes y aprobados, asegurando que existen los elementos requeridos para evaluar la adecuación del diseño del equipo, su uso previsto y el cumplimiento de los requisitos del usuario y regulatorios aplicables.',
    resumen: 'Objetivo: presentar de manera consolidada los resultados obtenidos durante la ejecución de la calificación, a fin de confirmar que el equipo cumple con los requisitos técnicos y operativos definidos en el protocolo, y que es adecuado para su uso previsto.',
    registroIntro: 'El personal relacionado en la calificación de este equipo debe firmar en la siguiente tabla.',
    refModelo: [
      ['9.1', '(1058) CALIFICACIÓN DE INSTRUMENTOS ANALÍTICOS'],
      ['9.2', 'EUROPEAN DIRECTORATE FOR THE QUALITY OF MEDICINES & HEALTHCARE'],
      ['9.3', ''],
      ['9.4', ''],
    ],
    firmas: [
      { t: 'Realizado Por:', nombre: 'Nombre Personal / ()' },
      { t: 'Revisado Por:', nombre: 'Nombre Personal / ()' },
      { t: 'Revisado Por:', nombre: 'Nombre Personal / ()' },
      { t: 'Aprobado Por:', nombre: 'Nombre Personal / ()' },
    ],
  };

  // T0 (Realizado) y T2 (Revisor Gerente) dinámicos; T1/T3 fijos del modelo.
  function firmantesModelo(draft) {
    const f = ((draft || {}).firmantes) || {};
    const r0 = f.realizado || {};
    const r2 = f.revisor || {};
    const n0 = [String(r0.nombre || '').trim(), r0.cargo ? '(' + String(r0.cargo).trim() + ')' : '']
      .filter(Boolean).join(' ');
    let puesto2 = String(r2.puesto || '').trim();
    if (!puesto2 && r2.area) puesto2 = 'Gerente de ' + String(r2.area).trim();
    const n2 = String(r2.nombre || '').trim() + (puesto2 ? ' / (' + puesto2 + ')' : '');
    const base = T.firmas.map((x) => ({ t: x.t, nombre: x.nombre }));
    if (n0) base[0] = { t: 'Realizado Por:', nombre: n0.replace(/^(.+?) \(/, '$1 / (') };
    if (String(r2.nombre || '').trim()) base[2] = { t: 'Revisado Por:', nombre: n2 };
    return base;
  }

  function lib() {
    try {
      if (typeof window !== 'undefined' && window.docx) return window.docx;
      if (typeof globalThis !== 'undefined' && globalThis.docx) return globalThis.docx;
      if (typeof require !== 'undefined') {
        try { return require('docx'); } catch (e) { /* sigue */ }
      }
    } catch (e) { /* sigue */ }
    return null;
  }

  function banco() {
    try {
      if (typeof BancoAlmacenes !== 'undefined') return BancoAlmacenes;
      if (typeof require !== 'undefined') {
        try { return require('./banco-almacenes-data.js'); } catch (e) { /* sigue */ }
      }
    } catch (e) { /* sigue */ }
    return { version: '', fases: {} };
  }

  function pasaCondicion(cond, filtro) {
    if (filtro === 'ambas') return true;
    return cond === 'ambas' || cond === filtro;
  }

  function rangoTexto(draft) {
    const d = draft || {};
    const tmin = String(d.temperaturaMin || '').trim();
    const tmax = String(d.temperaturaMax || '').trim();
    const hmin = String(d.humedadMin || '').trim();
    const hmax = String(d.humedadMax || '').trim();
    let r = '';
    if (tmin || tmax) r = (tmin || '?') + '–' + (tmax || '?') + ' °C';
    if (hmin || hmax) r += (r ? ' / ' : '') + 'HR ' + (hmin || '?') + '–' + (hmax || '?') + ' %';
    return r || '—';
  }

  function entidadTexto(draft, entidad) {
    const d = draft || {};
    return String(d.descripcion || '').trim()
      || (entidad && entidad.nombre) || 'almacén';
  }

  function congelarMarcas(html, ctx) {
    let s = String(html || '');
    s = s.replace(/<span class="equipo">[\s\S]*?<\/span>/g, ctx.entidad);
    s = s.replace(/<span class="rango">[\s\S]*?<\/span>/g, ctx.rango);
    s = s.replace(/<span class="cond">[\s\S]*?<\/span>/g, ctx.cond);
    s = s.replace(/<span class="lista-resumen"[^>]*>[\s\S]*?<\/span>/g, ctx.listaResumen);
    s = s.replace(/<img class="ent-logo"[^>]*>/g, '[Logo]');
    s = s.replace(/<span class="ent-[a-z]+">([\s\S]*?)<\/span>/g, '$1');
    return s;
  }

  function htmlAParrafos(html) {
    const withNl = String(html || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|li|h[1-6]|tr)>/gi, '\n')
      .replace(/<(p|li|h[1-6]|ul|ol|div)[^>]*>/gi, function (m) {
        return /^<li/i.test(m) ? '• ' : '';
      });
    const out = [];
    withNl.split('\n').forEach((chunk) => {
      const runs = [];
      const re = /(<strong>[\s\S]*?<\/strong>)|(<[^>]+>)|([^<]+)/g;
      let m;
      const push = (t, b) => {
        const dec = t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
        if (dec.trim()) runs.push({ t: dec, b: !!b });
      };
      while ((m = re.exec(chunk)) !== null) {
        if (m[1]) push(m[1].replace(/<\/?strong>/gi, ''), true);
        else if (m[3]) push(m[3], false);
      }
      if (runs.length) out.push({ runs });
    });
    return out;
  }

  function lineasTexto(html) {
    return htmlAParrafos(html).map((p) => p.runs.map((r) => r.t).join('').trim()).filter(Boolean);
  }

  // Puntos numerados del procedimiento → filas de la tabla de evidencia.
  function puntosEvidencia(articulo) {
    const proc = (articulo.secciones || []).filter((s) => /procedimiento/i.test(s.et || ''));
    const lineas = proc.flatMap((s) => lineasTexto(s.html));
    const pts = [];
    lineas.forEach((ln) => {
      const m = ln.match(/^\s*(?:\d+\)|[a-z]\))\s*(.+)$/i);
      if (m && m[1].trim().length > 3) pts.push(m[1].trim());
    });
    if (!pts.length) {
      const crit = (articulo.secciones || []).filter((s) => /criterio/i.test(s.et || ''));
      crit.flatMap((s) => lineasTexto(s.html)).forEach((ln) => {
        if (ln.length > 10 && pts.length < 12) pts.push(ln);
      });
    }
    return pts.slice(0, 14);
  }

  function alcanceTexto(draft, entidad) {
    const d = draft || {};
    const desc = String(d.descripcion || '').trim() || (entidad && entidad.nombre) || 'almacén';
    const cod = String(d.codigo || '').trim();
    const ubi = String(d.ubicacion || '').trim();
    return 'Esta calificación aplica a ' + desc
      + (cod ? ', código ' + cod : '')
      + (ubi ? ', ubicado en ' + ubi : '')
      + ' de Laboratorios Sued, S.R.L.';
  }

  function portadaCampos(draft) {
    const d = draft || {};
    const g = (k) => String(d[k] || '').trim() || '—';
    return [
      ['Código', g('codigo')],
      ['Descripción', g('descripcion')],
      ['Ubicación', g('ubicacion')],
      ['Tipo de almacén', g('tipo')],
      ['Rango T°/HR', rangoTexto(d)],
      ['Responsable', g('responsable')],
      ['Fecha', g('fecha')],
      ['Tipo de calificación', g('tipoCalificacion')],
      ['Tipo de estudio', g('estudio')],
      ['Condición del estudio', g('condicionEstudio')],
      ['Duración del estudio', g('duracionEstudio')],
      ['Intervalo de registro', g('intervaloRegistro')],
      ['Cantidad de data loggers', g('cantidadDataLoggers')],
    ];
  }

  // ---- Modelo puro ----
  // secciones: [{h1, saltos, contenido:[{t:'h2'|'p'|'bul'|'tablaEvid'|'tablaConc'|'tabla'|'toc', ...}]}]
  function buildModelo(fase, draft, entidad, filtroCond) {
    const B = banco();
    const items = (B.fases && B.fases[fase]) || [];
    const filtro = filtroCond || 'ambas';
    const ctx = {
      entidad: entidadTexto(draft, entidad),
      rango: rangoTexto(draft),
      cond: COND_TXT[filtro] || COND_TXT.ambas,
      listaResumen: '',
    };
    const articulos = items.filter((i) => i.id && pasaCondicion(i.cond, filtro));
    ctx.listaResumen = articulos.map((a) => a.id).join(', ');
    const secs = [];
    const H1 = (titulo, contenido, primera) => secs.push({ h1: titulo, primera: !!primera, contenido: contenido || [] });

    // 1. FIRMA DE APROBACIÓN
    H1('FIRMA DE APROBACIÓN:', [
      { t: 'h2', texto: T.firmaIntro },
      { t: 'firmas' },
    ], true);
    // 2. TABLA DE CONTENIDO
    H1('TABLA DE CONTENIDO:', [{ t: 'toc' }]);
    // 3. OBJETIVO
    H1('OBJETIVO:', [{ t: 'h2', texto: T.objetivo }]);
    // 4. ALCANCE
    H1('ALCANCE:', [{ t: 'h2', texto: alcanceTexto(draft, entidad) }]);
    // 5. RESPONSABILIDADES (título del gerente dinámico según T2)
    const resp = [];
    const _rg = ((draft || {}).firmantes || {}).revisor || {};
    let _pg = String(_rg.puesto || '').trim();
    if (!_pg && _rg.area) _pg = 'Gerente de ' + String(_rg.area).trim();
    T.roles.forEach((r) => {
      const titulo = (r.rol === 'Es Responsabilidad del Gerente de Área:' && _pg)
        ? 'Es Responsabilidad del ' + _pg + ':' : r.rol;
      // Gerencia dinámica en negrita (como el modelo); el resto igual
      const dyn = (r.rol === 'Es Responsabilidad del Gerente de Área:' && _pg)
        ? { t: 'h2', texto: 'Es Responsabilidad del ', negrita: _pg + ':' } : null;
      resp.push(dyn || { t: 'h2', texto: titulo });
      r.items.forEach((it) => resp.push({ t: 'bul', texto: it }));
    });
    H1('RESPONSABILIDADES:', resp);
    // 6. DESCRIPCIÓN + DATOS
    const desc = [
      { t: 'h2', texto: 'REQUISITOS PREVIOS A LA CALIFICACION:' },
      { t: 'bul', texto: T.reqPrevios },
      { t: 'h2', texto: 'DESCRIPCIÓN Y USO PREVISTO DEL EQUIPO:' },
      { t: 'bul', texto: 'DESCRIPCIÓN:' },
      { t: 'bul', texto: ctx.entidad },
      { t: 'h2', texto: 'DATOS DE LA ENTIDAD:' },
      { t: 'tablaDatos', filas: portadaCampos(draft) },
    ];
    H1('DESCRIPCIÓN DEL EQUIPO Y REQUISITOS PREVIOS A LA CALIFICACIÓN:', desc);
    // 7. PROCEDIMIENTO (preliminares + ensayos + resumen, 1 página cada ensayo)
    const proc = [];
    const nums = {};
    const numera = (a) => {
      nums[a.bloque] = (nums[a.bloque] || 0) + 1;
      return 'ENSAYO ' + a.bloque + '.' + nums[a.bloque] + ' DE ' + a.bloque;
    };
    items.filter((i) => i.id && i.bloque === 2 && pasaCondicion(i.cond, filtro)).forEach((a) => {
      proc.push({ t: 'ensayo', num: numera(a), titulo: a.titulo, articulo: a });
    });
    articulos.filter((a) => a.bloque === 3).forEach((a) => {
      proc.push({ t: 'ensayo', num: numera(a), titulo: a.titulo, articulo: a });
    });
    proc.push({ t: 'h2', texto: 'RESUMEN:', salto: true });
    proc.push({ t: 'bul', texto: T.resumen });
    articulos.filter((a) => a.bloque === 4).forEach((a) => {
      proc.push({ t: 'ensayo', num: numera(a), titulo: a.titulo, articulo: a, sinConclusion: true });
    });
    H1('PROCEDIMIENTO DE CALIFICACIÓN DE ' + (FASE_NOMBRE[fase] || fase) + ':', proc);
    // 8. REGISTRO DE FIRMAS
    H1('REGISTRO DE FIRMAS:', [
      { t: 'h2', texto: T.registroIntro },
      { t: 'registro' },
    ]);
    // 9. REFERENCIAS (banco si tiene contenido, si no modelo)
    const refBank = articulos.find((a) => a.bloque === 6 && a.tabla);
    let refFilas = T.refModelo;
    if (refBank) {
      const nb = refBank.tabla.rows.filter((r) => (r[0] || r[1] || '').trim());
      if (nb.length) refFilas = nb.map((r) => [r[0] || '', r[1] || '']);
    }
    H1('REFERENCIAS:', [{ t: 'tablaRef', filas: refFilas }]);
    // 10. ANEXOS (banco)
    const anex = [];
    items.filter((i) => !i.id && i.bloque === 8).forEach((dv) => {
      htmlAParrafos(congelarMarcas(dv.html, ctx)).forEach((p) => anex.push({ t: 'p', runs: p.runs }));
    });
    if (!anex.length) anex.push({ t: 'p', runs: [{ t: '—', b: false }] });
    H1('ANEXOS:', anex);
    // 11. HISTORIAL
    const fecha = String((draft || {}).fecha || '').trim() || '—';
    const ccDQ = String((draft || {}).controlCambios || '').trim();
    const verDQ = String((draft || {}).versionProtocolo || '').trim() || '1.0';
    H1('HISTORIAL DE CAMBIOS:', [{ t: 'historial', fecha, version: verDQ, cambios: ccDQ ? 'Creación por control de cambios #' + ccDQ : 'Creación del documento' }]);
    return {
      fase, version: B.version || '', condicion: filtro,
      entidad: ctx.entidad, ctx,
      titulo: 'PROTOCOLO DE CALIFICACIÓN ' + fase + ' — ' + ctx.entidad.toUpperCase(),
      firmantes: firmantesModelo(draft),
      secciones: secs,
    };
  }

  function contarEnsayos(fase, filtroCond) {
    const B = banco();
    const items = ((B.fases && B.fases[fase]) || []).filter((i) => i.id);
    const filtro = filtroCond || 'ambas';
    return items.filter((i) => pasaCondicion(i.cond, filtro)).length;
  }

  // ---- Render a docx ----
  function estilosBase() {
    return [
      { id: 'Normal', name: 'Normal', basedOn: 'Normal', next: 'Normal', run: { font: 'Tahoma', size: 22, color: '0D0D0D' }, paragraph: {} },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { font: 'Tahoma', size: 22, bold: true, color: '0F4761' }, paragraph: { spacing: { before: 240, after: 120 } } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { font: 'Tahoma', size: 22, color: '0D0D0D' }, paragraph: { spacing: { before: 120, after: 120 } } },
      { id: 'ListParagraph', name: 'List Paragraph', basedOn: 'Normal', next: 'Normal', run: { font: 'Tahoma', size: 22, color: '0D0D0D' }, paragraph: {} },
    ];
  }

  function modeloADocx(modelo) {
    const D = lib();
    if (!D) throw new Error('Librería docx no cargada');
    const kids = [];
    const H1 = (texto, primera) => kids.push(new D.Paragraph({
      heading: D.HeadingLevel.HEADING_1,
      pageBreakBefore: !primera,
      children: [new D.TextRun({ text: texto, bold: true, font: 'Tahoma', size: 22, color: '0F4761' })],
    }));
    const H2 = (texto, salto, negrita) => kids.push(new D.Paragraph({
      heading: D.HeadingLevel.HEADING_2,
      pageBreakBefore: !!salto,
      children: negrita
        ? [new D.TextRun({ text: texto, font: 'Tahoma', size: 22, color: '0D0D0D' }),
           new D.TextRun({ text: negrita, bold: true, font: 'Tahoma', size: 22, color: '0D0D0D' })]
        : [new D.TextRun({ text: texto, font: 'Tahoma', size: 22, color: '0D0D0D' })],
    }));
    const P = (runs) => kids.push(new D.Paragraph({
      children: runs.map((r) => new D.TextRun({ text: r.t, bold: !!r.b, font: 'Tahoma', size: 22, color: '0D0D0D' })),
    }));
    const BUL = (texto) => kids.push(new D.Paragraph({
      style: 'List Paragraph',
      numbering: { reference: 'bull', level: 0 },
      children: [new D.TextRun({ text: texto, font: 'Tahoma', size: 22, color: '0D0D0D' })],
    }));
    const cellTxt = (t, bold, shade) => new D.TableCell({
      children: [new D.Paragraph({ children: [new D.TextRun({ text: String(t == null ? '' : t), bold: !!bold, font: 'Tahoma', size: 22 })] })],
      shading: shade ? { fill: 'D9D9D9' } : undefined,
    });
    const TABLA = (headers, rows) => {
      const rs = [headers].concat(rows).map((r, ri) => new D.TableRow({
        children: r.map((c) => cellTxt(c, ri === 0, ri === 0)),
      }));
      kids.push(new D.Table({ rows: rs }));
    };
    const TABLA_FIRMAS = () => {
      (modelo.firmantes || T.firmas).forEach((f) => {
        kids.push(new D.Table({ rows: [
          new D.TableRow({ children: [cellTxt(f.t, true), cellTxt('', false)] }),
          new D.TableRow({ children: [cellTxt(f.nombre, false), cellTxt('Fecha', false)] }),
        ] }));
        kids.push(new D.Paragraph({ children: [new D.TextRun('')] }));
      });
    };
    const TABLA_CONC = () => {
      const R = (cells) => new D.TableRow({
        children: cells.map(([t, span]) => new D.TableCell({
          children: [new D.Paragraph({ children: [new D.TextRun({ text: t, font: 'Tahoma', size: 22 })] })],
          columnSpan: span > 1 ? span : undefined,
        })),
      });
      kids.push(new D.Table({ rows: [
        R([['CONCLUSIÓN DE LA PRUEBA', 8]]),
        R([['Resultado:', 1], ['Cumple ☐', 3], ['No Cumple ☐  *', 3], ['No Aplica ☐', 1]]),
        R([['* Número de Desviación:', 3], ['', 2], ['Estatus', 2], ['Cerrada ☐  No Cerrada ☐', 1]]),
        R([['Observaciones:', 8]]),
        R([['FIRMA', 5], ['FECHA', 3]]),
        R([['Realizado Por:', 2], ['', 3], ['Fecha:', 1], ['', 2]]),
        R([['Verificado Por:', 2], ['', 3], ['Fecha:', 1], ['', 2]]),
      ] }));
    };
    const ensayoADoc = (it, ctx) => {
      H2(it.num + ' — ' + it.titulo, true);
      (it.articulo.secciones || []).forEach((s) => {
        htmlAParrafos(congelarMarcas(s.html.replace(/^<strong>[^<]*:<\/strong><br>\s*/i, ''), ctx))
          .forEach((p) => {
            const txt = p.runs.map((r) => r.t).join('');
            if (/^• /.test(txt)) BUL(txt.replace(/^• /, ''));
            else P(p.runs);
          });
      });
      if (it.articulo.tabla && !it.sinConclusion) {
        const tb = it.articulo.tabla;
        TABLA(tb.headers, tb.rows);
      }
      if (!it.sinConclusion) {
        const pts = puntosEvidencia(it.articulo);
        const titulo = 'Tabla — ' + it.num;
        const filas = pts.length ? pts.map((p) => [p, p, 'C   NC   NA']) : [['Ver criterios del ensayo', 'Ver criterios del ensayo', 'C   NC   NA']];
        TABLA([titulo, it.titulo, 'Cumple (C) / No Cumple (NC)'], filas);
        TABLA_CONC();
      } else if (it.articulo.tabla) {
        const tb = it.articulo.tabla;
        TABLA(tb.headers, tb.rows);
      }
    };

    modelo.secciones.forEach((sec) => {
      H1(sec.h1, sec.primera);
      sec.contenido.forEach((it) => {
        if (it.t === 'h2') H2(it.texto, it.salto, it.negrita);
        else if (it.t === 'p') P(it.runs);
        else if (it.t === 'bul') BUL(it.texto);
        else if (it.t === 'toc') {
          try {
            kids.push(new D.TableOfContents('Índice', { headingStyleRange: '1-2' }));
          } catch (e) {
            kids.push(new D.Paragraph({ children: [new D.TextRun('Índice (actualizar en Word)')] }));
          }
        }
        else if (it.t === 'firmas') TABLA_FIRMAS();
        else if (it.t === 'ensayo') ensayoADoc(it, modelo.ctx);
        else if (it.t === 'tablaDatos') TABLA(['CAMPO', 'VALOR'], it.filas);
        else if (it.t === 'registro') {
          const rows = [];
          for (let i = 0; i < 16; i++) rows.push(['', '', '', '']);
          TABLA(['NOMBRE', 'DEPARTAMENTO', 'FIRMA', 'FECHA'], rows);
        }
        else if (it.t === 'tablaRef') TABLA(['SECCIÓN', 'TÍTULO'], it.filas);
        else if (it.t === 'historial') TABLA(['VERSIÓN', 'FECHAS', 'CAMBIOS'], [[it.version || '1.0', it.fecha, it.cambios || 'Creación del documento']]);
      });
    });

    const doc = new D.Document({
      styles: { paragraphStyles: estilosBase() },
      numbering: { config: [{ reference: 'bull', levels: [{ level: 0, format: D.LevelFormat.BULLET, text: '•', alignment: D.AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
      sections: [{
        footers: { default: new D.Footer({ children: [new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: [new D.TextRun({ text: FOOTER_TXT, font: 'Tahoma', size: 18, color: '808080' })] })] }) },
        children: kids,
      }],
    });
    return doc;
  }

  async function descargar(fase, draft, entidad, filtroCond) {
    const D = lib();
    if (!D) throw new Error('Librería docx no cargada');
    const modelo = buildModelo(fase, draft, entidad, filtroCond);
    const doc = modeloADocx(modelo);
    const blob = await D.Packer.toBlob(doc);
    const entId = (entidad && entidad.id) ? entidad.id : 'entidad';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fase + '-' + entId + '.docx';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { try { URL.revokeObjectURL(a.href); a.remove(); } catch (e) {} }, 4000);
    return modelo;
  }

  return {
    FASE_NOMBRE, COND_TXT, FOOTER_TXT, T, lib, banco, pasaCondicion, rangoTexto, entidadTexto,
    congelarMarcas, htmlAParrafos, portadaCampos, alcanceTexto, puntosEvidencia, firmantesModelo,
    buildModelo, contarEnsayos, estilosBase, modeloADocx, descargar,
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = GeneradorDocx;
