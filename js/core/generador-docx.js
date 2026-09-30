// ========================================
// generador-docx.js — SigmaProXVL · Área de Validaciones
// Ensambla protocolos .docx (Almacenes v1) a partir de BancoAlmacenes.
// Parte pura (modelo) testeable sin la lib `docx`; el render usa
// window.docx (UMD por CDN) solo al descargar.
// ========================================

const GeneradorDocx = (() => {
  const BLOQUES = {
    1: 'PORTADA · FIRMAS · RESPONSABILIDADES · ALCANCE',
    2: 'PRELIMINARES',
    3: 'CALIFICACIÓN',
    4: 'RESUMEN',
    5: 'FIRMAS DEL PERSONAL',
    6: 'REFERENCIAS',
    7: 'HISTORIAL',
    8: 'ANEXOS',
  };

  const COND_TXT = { est: 'estática', dina: 'dinámica', ambas: 'estática y dinámica' };

  function banco() {
    try {
      if (typeof BancoAlmacenes !== 'undefined') return BancoAlmacenes;
      if (typeof module !== 'undefined' && module.exports) {
        try { return require('./banco-almacenes-data.js'); } catch (e) { /* sigue */ }
      }
    } catch (e) { /* sigue */ }
    return { version: '', fases: {} };
  }

  // Filtro de condición: 'ambas' incluye todo; 'est'/'dina' incluyen su marca + 'ambas'.
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

  // Congela marcas dinámicas a texto con los datos del borrador.
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

  // HTML simple → lista de párrafos: [{runs:[{t,b}], bullet}]
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
      let buf = '';
      const push = (t, b) => {
        const dec = t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
        if (dec.trim()) runs.push({ t: dec, b: !!b });
      };
      while ((m = re.exec(chunk)) !== null) {
        if (m[1]) push(m[1].replace(/<\/?strong>/gi, ''), true);
        else if (m[3]) push(m[3], false);
      }
      void buf;
      if (runs.length) out.push({ runs });
    });
    return out;
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

  // Modelo puro del documento: {titulo, portada, indice, bloques:[{n,nombre,items}]}
  // items: {t:'h2'|'p'|'tabla'|'ensayo', ...}
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
    const porBloque = {};
    articulos.forEach((a) => {
      (porBloque[a.bloque] = porBloque[a.bloque] || []).push(a);
    });
    // Numeración visible por bloque: ENSAYO b.n DE b
    const numeros = {};
    articulos.forEach((a) => {
      const b = a.bloque;
      numeros[b] = (numeros[b] || 0) + 1;
      a._num = 'ENSAYO ' + b + '.' + numeros[b] + ' DE ' + b;
    });
    const modelo = {
      fase,
      version: B.version || '',
      condicion: filtro,
      entidad: ctx.entidad,
      titulo: 'PROTOCOLO DE CALIFICACIÓN ' + fase + ' — ' + ctx.entidad.toUpperCase(),
      portada: portadaCampos(draft),
      indice: articulos.map((a) => ({ num: a._num, titulo: a.titulo, bloque: a.bloque })),
      bloques: [],
    };
    for (let b = 1; b <= 8; b++) {
      const contenido = [];
      items.filter((i) => i.bloque === b && !i.id).forEach((dv) => {
        htmlAParrafos(congelarMarcas(dv.html, ctx)).forEach((p) => contenido.push({ t: 'p', runs: p.runs }));
      });
      (porBloque[b] || []).forEach((a) => {
        contenido.push({ t: 'ensayo', num: a._num, titulo: a.titulo });
        a.secciones.forEach((s) => {
          if (s.et) contenido.push({ t: 'h3', texto: s.et });
          htmlAParrafos(congelarMarcas(s.html.replace(/^<strong>[^<]*:<\/strong><br>\s*/i, ''), ctx))
            .forEach((p) => contenido.push({ t: 'p', runs: p.runs }));
        });
        if (a.tabla) {
          contenido.push({ t: 'tabla', headers: a.tabla.headers, rows: a.tabla.rows });
        }
      });
      if (contenido.length) modelo.bloques.push({ n: b, nombre: BLOQUES[b], items: contenido });
    }
    return modelo;
  }

  function contarEnsayos(fase, filtroCond) {
    const B = banco();
    const items = ((B.fases && B.fases[fase]) || []).filter((i) => i.id);
    const filtro = filtroCond || 'ambas';
    return items.filter((i) => pasaCondicion(i.cond, filtro)).length;
  }

  // ---- Render a docx (requiere window.docx) ----
  function modeloADocx(modelo) {
    const D = (typeof window !== 'undefined' && window.docx) || (typeof globalThis !== 'undefined' && globalThis.docx);
    if (!D) throw new Error('Librería docx no cargada');
    const P = (texto, o) => new D.Paragraph(Object.assign({ children: [new D.TextRun(texto)] }, o || {}));
    const runsP = (runs) => new D.Paragraph({
      children: runs.map((r) => new D.TextRun({ text: r.t, bold: !!r.b })),
    });
    const kids = [];
    kids.push(new D.Paragraph({ heading: D.HeadingLevel.TITLE, children: [new D.TextRun({ text: modelo.titulo, bold: true })] }));
    kids.push(P('Entidad: ' + modelo.entidad));
    kids.push(P('Condición: ' + (COND_TXT[modelo.condicion] || modelo.condicion) + '  ·  Banco v: ' + (modelo.version || '—')));
    kids.push(P(''));
    modelo.portada.forEach(([k, v]) => {
      kids.push(new D.Paragraph({ children: [new D.TextRun({ text: k + ': ', bold: true }), new D.TextRun(String(v))] }));
    });
    kids.push(P(''));
    kids.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, children: [new D.TextRun('ÍNDICE')] }));
    modelo.indice.forEach((e) => {
      kids.push(P(e.num + ' — ' + e.titulo));
    });
    modelo.bloques.forEach((b) => {
      kids.push(new D.Paragraph({
        heading: D.HeadingLevel.HEADING_1,
        children: [new D.TextRun('BLOQUE ' + b.n + ' · ' + b.nombre)],
      }));
      b.items.forEach((it) => {
        if (it.t === 'p') kids.push(runsP(it.runs));
        else if (it.t === 'h3') kids.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_3, children: [new D.TextRun({ text: it.texto, bold: true })] }));
        else if (it.t === 'ensayo') {
          kids.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_2, children: [new D.TextRun({ text: it.num + ' — ' + it.titulo, bold: true })] }));
        } else if (it.t === 'tabla') {
          const rows = [it.headers].concat(it.rows).map((r, ri) => new D.TableRow({
            children: r.map((c) => new D.TableCell({
              children: [new D.Paragraph({ children: [new D.TextRun({ text: String(c == null ? '' : c), bold: ri === 0 })] })],
              shading: ri === 0 ? { fill: 'D9D9D9' } : undefined,
            })),
          }));
          kids.push(new D.Table({ rows }));
        }
      });
    });
    return new D.Document({ sections: [{ children: kids }] });
  }

  async function descargar(fase, draft, entidad, filtroCond) {
    const modelo = buildModelo(fase, draft, entidad, filtroCond);
    const doc = modeloADocx(modelo);
    const D = (typeof window !== 'undefined' && window.docx) || globalThis.docx;
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
    BLOQUES, COND_TXT, banco, pasaCondicion, rangoTexto, entidadTexto,
    congelarMarcas, htmlAParrafos, portadaCampos, buildModelo, contarEnsayos,
    modeloADocx, descargar,
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = GeneradorDocx;
