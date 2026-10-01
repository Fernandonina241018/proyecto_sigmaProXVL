// ========================================
// plantilla-docx.js — SigmaProXVL · Área de Validaciones
// Genera los protocolos IQ / OQ / PQ usando como PLANTILLA los modelos
// Word originales (docs/plantillas/*.docx): se conservan encabezado,
// portada, estilos, numeración, firmas, tablas de conclusión, referencias,
// anexos, historial y pie. Solo se reemplaza el contenido de los ensayos
// del procedimiento por los ensayos del banco (BancoAlmacenes).
//
// Sin dependencias: el ZIP y el XML se manejan aquí. Inflate/deflate usan
// zlib en Node (tests) o Compression Streams en el navegador.
// El DQ sigue en generador-docx.js.
// ========================================

const PlantillaDocx = (() => {
  const FASES = ['IQ', 'OQ', 'PQ'];
  const PLANTILLAS = {
    IQ: 'docs/plantillas/IQ-1-400AAAA.docx',
    OQ: 'docs/plantillas/OQ-1-400AAAA.docx',
    PQ: 'docs/plantillas/PQ-1-400AAAA.docx',
  };
  const COND_TXT = { est: 'estática', dina: 'dinámica', ambas: 'estática y dinámica' };
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const MIME_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const OPC = {
    incluirCodigoEnsayo: true, // línea "Código del ensayo en el banco: ALM-IQ-001" (trazabilidad)
    itemsRegistroPorDefecto: 12, // filas de la tabla de registro (modelo OQ/PQ)
    maxItemsRegistro: 60,
    // Ensayos OQ/PQ que usan la tabla de registro del modelo (Área / Tiempo /
    // Frecuencia / Límite + ítems). El resto usa lista de verificación C/NC.
    // Un artículo del banco puede forzarlo con `tablaTipo: 'registro' | 'verificacion'`.
    reRegistro: /mapeo|distribuci[oó]n de (temperatura|humedad)|perfil t[eé]rmico|estudio t[eé]rmico/i,
  };

  let zipProv = null; // { inflate(u8)->Promise<u8>, deflate(u8)->Promise<u8> | null }

  // ---------------------------------------------------------------
  // ZIP (lectura de plantillas y escritura del .docx)
  // ---------------------------------------------------------------
  const u16 = (b, o) => b[o] | (b[o + 1] << 8);
  const u32 = (b, o) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
  const enc = (s) => new TextEncoder().encode(s);
  const dec = (u8) => new TextDecoder('utf-8').decode(u8);

  function proveedorZip() {
    if (zipProv) return zipProv;
    try {
      if (typeof process !== 'undefined' && process.versions && process.versions.node && typeof require === 'function') {
        const z = require('zlib');
        zipProv = {
          inflate: async (u8) => new Uint8Array(z.inflateRawSync(u8)),
          deflate: async (u8) => new Uint8Array(z.deflateRawSync(u8)),
        };
        return zipProv;
      }
    } catch (e) { /* sigue */ }
    if (typeof DecompressionStream !== 'undefined' && typeof Response !== 'undefined' && typeof Blob !== 'undefined') {
      const pasar = (u8, S) => new Response(new Blob([u8]).stream().pipeThrough(new S('deflate-raw')))
        .arrayBuffer().then((b) => new Uint8Array(b));
      zipProv = {
        inflate: (u8) => pasar(u8, DecompressionStream),
        deflate: typeof CompressionStream !== 'undefined' ? (u8) => pasar(u8, CompressionStream) : null,
      };
      return zipProv;
    }
    throw new Error('El navegador no soporta descompresión (DecompressionStream). Actualice el navegador.');
  }

  function configurar(o) {
    if (o && o.zip) zipProv = o.zip;
    if (o && o.opciones) Object.assign(OPC, o.opciones);
  }

  async function leerZip(u8) {
    let e = -1;
    for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) {
      if (u32(u8, i) === 0x06054b50) { e = i; break; }
    }
    if (e < 0) throw new Error('Plantilla .docx inválida (sin directorio ZIP).');
    const n = u16(u8, e + 10);
    let p = u32(u8, e + 16);
    const prov = proveedorZip();
    const out = [];
    for (let k = 0; k < n; k++) {
      if (u32(u8, p) !== 0x02014b50) throw new Error('Plantilla .docx dañada (directorio ZIP).');
      const metodo = u16(u8, p + 10);
      const tamC = u32(u8, p + 20);
      const ln = u16(u8, p + 28), lx = u16(u8, p + 30), lc = u16(u8, p + 32);
      const loc = u32(u8, p + 42);
      const nombre = dec(u8.subarray(p + 46, p + 46 + ln));
      const ini = loc + 30 + u16(u8, loc + 26) + u16(u8, loc + 28);
      const crudo = u8.subarray(ini, ini + tamC);
      let datos;
      if (metodo === 0) datos = crudo.slice();
      else if (metodo === 8) datos = await prov.inflate(crudo);
      else throw new Error('Compresión ZIP no soportada en la plantilla: ' + metodo);
      out.push({ nombre, datos });
      p += 46 + ln + lx + lc;
    }
    return out;
  }

  let CRC_T = null;
  function crc32(u8) {
    if (!CRC_T) {
      CRC_T = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        CRC_T[i] = c >>> 0;
      }
    }
    let c = 0xffffffff;
    for (let i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  async function escribirZip(archivos) {
    const prov = proveedorZip();
    const trozos = [];
    const central = [];
    let off = 0;
    const w16 = (a, o, v) => { a[o] = v & 0xff; a[o + 1] = (v >>> 8) & 0xff; };
    const w32 = (a, o, v) => { a[o] = v & 0xff; a[o + 1] = (v >>> 8) & 0xff; a[o + 2] = (v >>> 16) & 0xff; a[o + 3] = (v >>> 24) & 0xff; };
    for (const f of archivos) {
      const nombre = enc(f.nombre);
      const crc = crc32(f.datos);
      let comp = f.datos, metodo = 0;
      if (prov.deflate) {
        try {
          const c = await prov.deflate(f.datos);
          if (c.length < f.datos.length) { comp = c; metodo = 8; }
        } catch (e) { /* se guarda sin comprimir */ }
      }
      const h = new Uint8Array(30);
      w32(h, 0, 0x04034b50); w16(h, 4, 20); w16(h, 6, 0x0800); w16(h, 8, metodo);
      w16(h, 10, 0); w16(h, 12, 0x21); w32(h, 14, crc); w32(h, 18, comp.length);
      w32(h, 22, f.datos.length); w16(h, 26, nombre.length); w16(h, 28, 0);
      trozos.push(h, nombre, comp);
      const c = new Uint8Array(46);
      w32(c, 0, 0x02014b50); w16(c, 4, 20); w16(c, 6, 20); w16(c, 8, 0x0800); w16(c, 10, metodo);
      w16(c, 12, 0); w16(c, 14, 0x21); w32(c, 16, crc); w32(c, 20, comp.length);
      w32(c, 24, f.datos.length); w16(c, 28, nombre.length); w32(c, 42, off);
      central.push(c, nombre);
      off += 30 + nombre.length + comp.length;
    }
    const tamCentral = central.reduce((s, a) => s + a.length, 0);
    const fin = new Uint8Array(22);
    w32(fin, 0, 0x06054b50); w16(fin, 8, archivos.length); w16(fin, 10, archivos.length);
    w32(fin, 12, tamCentral); w32(fin, 16, off);
    const todo = trozos.concat(central, [fin]);
    const total = todo.reduce((s, a) => s + a.length, 0);
    const out = new Uint8Array(total);
    let p = 0;
    for (const a of todo) { out.set(a, p); p += a.length; }
    return out;
  }

  // ---------------------------------------------------------------
  // Utilidades XML (texto WordprocessingML)
  // ---------------------------------------------------------------
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const desc = (s) => String(s || '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d))
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

  function finElemento(xml, ini, tag) {
    const re = new RegExp('<(/?)' + tag + '(?=[\\s>/])[^>]*?(/?)>', 'g');
    re.lastIndex = ini;
    let d = 0, m;
    while ((m = re.exec(xml))) {
      if (m[1]) { d--; if (d === 0) return re.lastIndex; }
      else if (m[2]) { if (d === 0) return re.lastIndex; }
      else d++;
    }
    throw new Error('XML de plantilla mal formado (' + tag + ').');
  }

  function hijos(xml) {
    const out = [];
    let i = 0;
    while (i < xml.length) {
      const lt = xml.indexOf('<', i);
      if (lt < 0) break;
      const m = /^<([\w:]+)/.exec(xml.slice(lt, lt + 64));
      if (!m) { i = lt + 1; continue; }
      const fin = finElemento(xml, lt, m[1]);
      out.push({ tag: m[1], xml: xml.slice(lt, fin) });
      i = fin;
    }
    return out;
  }

  const texto = (xml) => {
    let s = '';
    const re = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
    let m;
    while ((m = re.exec(xml))) s += desc(m[1]);
    return s;
  };
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  const sinEsp = (s) => String(s || '').replace(/\s+/g, '');

  function pPrDe(p) {
    const m = /^<w:p\b[^>]*>\s*(<w:pPr>[\s\S]*?<\/w:pPr>)/.exec(p);
    return m ? m[1] : '';
  }
  function info(parte) {
    if (parte.tag !== 'w:p') return { tag: parte.tag, texto: norm(texto(parte.xml)) };
    const ppr = pPrDe(parte.xml);
    const est = /<w:pStyle w:val="([^"]+)"/.exec(ppr);
    const il = /<w:ilvl w:val="(\d+)"/.exec(ppr);
    const ni = /<w:numId w:val="(\d+)"/.exec(ppr);
    return {
      tag: 'w:p',
      estilo: est ? est[1] : '',
      ilvl: il ? +il[1] : null,
      numId: ni ? ni[1] : null,
      texto: norm(texto(parte.xml)),
    };
  }

  const limpiarRPr = (r) => String(r || '')
    .replace(/<w:color w:val="FF0000"[^>]*\/>/g, '')
    .replace(/<w:highlight[^>]*\/>/g, '');

  function rPrRun(p, n) {
    // rPr del n-ésimo run (0 = primero); si no hay runs, el rPr de la marca de párrafo.
    const re = /<w:r(?:\s[^>]*)?>\s*(<w:rPr>[\s\S]*?<\/w:rPr>)?/g;
    let m, k = 0, ult = null;
    while ((m = re.exec(p))) { ult = m[1] || ''; if (k === n) return ult; k++; }
    if (ult !== null) return ult;
    const mp = /<w:pPr>[\s\S]*?(<w:rPr>[\s\S]*?<\/w:rPr>)[\s\S]*?<\/w:pPr>/.exec(p);
    return mp ? mp[1] : '';
  }

  function negrita(rpr, si) {
    let r = limpiarRPr(rpr) || '<w:rPr></w:rPr>';
    r = r.replace(/<w:bCs\/>/g, '').replace(/<w:b\/>/g, '');
    if (si) {
      if (/<w:rFonts[^>]*\/>/.test(r)) r = r.replace(/(<w:rFonts[^>]*\/>)/, '$1<w:b/><w:bCs/>');
      else r = r.replace('<w:rPr>', '<w:rPr><w:b/><w:bCs/>');
    }
    return r;
  }

  const run = (rpr, t) => '<w:r>' + rpr + '<w:t xml:space="preserve">' + esc(t) + '</w:t></w:r>';

  function ajustarPPr(ppr, o) {
    let s = ppr || '<w:pPr></w:pPr>';
    if (o.ilvl != null) s = s.replace(/<w:ilvl w:val="\d+"\/>/, '<w:ilvl w:val="' + o.ilvl + '"/>');
    if (o.numId != null) s = s.replace(/<w:numId w:val="\d+"\/>/, '<w:numId w:val="' + o.numId + '"/>');
    if (o.sinNum) s = s.replace(/<w:numPr>[\s\S]*?<\/w:numPr>/, '');
    s = s.replace(/<w:pageBreakBefore[^>]*\/>/g, '');
    if (o.salto) {
      const m = /^<w:pPr>(<w:pStyle[^>]*\/>)?(<w:keepNext[^>]*\/>)?(<w:keepLines[^>]*\/>)?/.exec(s);
      s = s.slice(0, m[0].length) + '<w:pageBreakBefore/>' + s.slice(m[0].length);
    }
    return s;
  }

  let BM = 90000;
  function parrafo(tpl, segs, o) {
    o = o || {};
    const ppr = ajustarPPr(pPrDe(tpl), o);
    const rNormal = rPrRun(tpl, o.runNormal == null ? 0 : o.runNormal);
    const runs = segs.map((s) => run(negrita(s.rpr || rNormal, !!s.b), s.t)).join('');
    let bm = '', bmFin = '';
    if (o.marcador) {
      const id = BM++;
      bm = '<w:bookmarkStart w:id="' + id + '" w:name="' + o.marcador + '"/>';
      bmFin = '<w:bookmarkEnd w:id="' + id + '"/>';
    }
    return '<w:p>' + ppr + bm + runs + bmFin + '</w:p>';
  }

  function conMarcador(pXml, nombre) {
    const id = BM++;
    const ppr = pPrDe(pXml);
    const abre = /^<w:p\b[^>]*>/.exec(pXml)[0];
    const resto = pXml.slice(abre.length).replace(ppr, '');
    return abre + ppr + '<w:bookmarkStart w:id="' + id + '" w:name="' + nombre + '"/>'
      + resto.replace(/<\/w:p>$/, '<w:bookmarkEnd w:id="' + id + '"/></w:p>');
  }

  function textoParrafo(pXml, t, o) {
    // Reemplaza todo el texto del párrafo conservando pPr y el formato del primer run.
    o = o || {};
    const abre = /^<w:p\b[^>]*>/.exec(pXml)[0];
    const ppr = pPrDe(pXml);
    const rpr = limpiarRPr(rPrRun(pXml, 0));
    return abre + ppr + (o.bold != null ? run(negrita(rpr, o.bold), t) : run(rpr, t)) + '</w:p>';
  }

  let SDT = 700000000;
  function clonar(xml) {
    // Clon apto para insertar varias veces: ids de controles únicos, sin paraId ni marcadores.
    return xml
      .replace(/ w14:(paraId|textId)="[^"]*"/g, '')
      .replace(/<w:bookmark(Start|End)\b[^>]*\/>/g, '')
      .replace(/<w:id w:val="-?\d+"\/>/g, () => '<w:id w:val="' + (SDT++) + '"/>');
  }

  // Reemplazo de texto dentro de párrafos (aunque el texto esté partido en varios runs).
  function reemplazarEnParrafo(p, buscar, valor, despuesDe) {
    const re = /(<w:t(?:\s[^>]*)?>)([^<]*)(<\/w:t>)/g;
    const nodos = [];
    let m;
    while ((m = re.exec(p))) nodos.push({ i: m.index, len: m[0].length, open: m[1], txt: desc(m[2]), close: m[3] });
    const full = nodos.map((n) => n.txt).join('');
    let desde = 0;
    if (despuesDe) {
      const k = full.indexOf(despuesDe);
      if (k < 0) return p;
      desde = k + despuesDe.length;
    }
    const idx = full.indexOf(buscar, desde);
    if (idx < 0) return p;
    const fin = idx + buscar.length;
    let pos = 0, primero = null;
    nodos.forEach((n) => {
      const a = pos, b = pos + n.txt.length;
      pos = b;
      n.nuevo = n.txt;
      if (b <= idx || a >= fin || (a === b)) return;
      const antes = idx > a ? n.txt.slice(0, idx - a) : '';
      const despues = fin < b ? n.txt.slice(fin - a) : '';
      n.nuevo = antes + (primero ? '' : valor) + despues;
      if (!primero) primero = n;
    });
    if (!primero) return p;
    let out = p;
    for (let k = nodos.length - 1; k >= 0; k--) {
      const n = nodos[k];
      if (n.nuevo === n.txt) continue;
      const open = /xml:space/.test(n.open) ? n.open : n.open.replace('<w:t', '<w:t xml:space="preserve"');
      out = out.slice(0, n.i) + open + esc(n.nuevo) + n.close + out.slice(n.i + n.len);
    }
    const iniRun = Math.max(out.lastIndexOf('<w:r>', primero.i), out.lastIndexOf('<w:r ', primero.i));
    if (iniRun >= 0) out = out.slice(0, iniRun) + limpiarRPr(out.slice(iniRun, primero.i)) + out.slice(primero.i);
    return out;
  }

  function reemplazarTexto(xml, buscar, valor, despuesDe) {
    let n = 0;
    const out = xml.replace(/<w:p[ >](?:(?!<w:p[ >])[\s\S])*?<\/w:p>/g, (p) => {
      const r = reemplazarEnParrafo(p, buscar, valor, despuesDe);
      if (r !== p) n++;
      return r;
    });
    return { xml: out, n };
  }

  // Tablas
  const filas = (tbl) => hijos(tbl.slice(tbl.indexOf('>') + 1, tbl.lastIndexOf('</w:tbl>'))).filter((h) => h.tag === 'w:tr').map((h) => h.xml);
  const celdas = (tr) => hijos(tr.slice(tr.indexOf('>') + 1, tr.lastIndexOf('</w:tr>'))).filter((h) => h.tag === 'w:tc').map((h) => h.xml);
  function conFilas(tbl, nuevas) {
    const cuerpo = tbl.slice(tbl.indexOf('>') + 1, tbl.lastIndexOf('</w:tbl>'));
    const partes = hijos(cuerpo);
    const iniTr = partes.findIndex((h) => h.tag === 'w:tr');
    const antes = partes.slice(0, iniTr).map((h) => h.xml).join('');
    const despues = partes.filter((h, i) => i > iniTr && h.tag !== 'w:tr').map((h) => h.xml).join('');
    return tbl.slice(0, tbl.indexOf('>') + 1) + antes + nuevas.join('') + despues + '</w:tbl>';
  }
  function conCeldas(tr, nuevas) {
    const cuerpo = tr.slice(tr.indexOf('>') + 1, tr.lastIndexOf('</w:tr>'));
    const partes = hijos(cuerpo);
    let k = 0;
    const out = partes.map((h) => (h.tag === 'w:tc' ? nuevas[k++] : h.xml)).join('');
    return tr.slice(0, tr.indexOf('>') + 1) + out + '</w:tr>';
  }
  function textoCelda(tc, t, o) {
    const i = tc.search(/<w:p[ >]/);
    if (i < 0) return tc;
    const f = finElemento(tc, i, 'w:p');
    return tc.slice(0, i) + textoParrafo(tc.slice(i, f), t, o) + tc.slice(f);
  }
  function camposCelda(tc, runsXml) {
    const i = tc.search(/<w:p[ >]/);
    const f = finElemento(tc, i, 'w:p');
    const p = tc.slice(i, f);
    const abre = /^<w:p\b[^>]*>/.exec(p)[0];
    return tc.slice(0, i) + abre + pPrDe(p) + runsXml + '</w:p>' + tc.slice(f);
  }

  // ---------------------------------------------------------------
  // Contenido del banco → estructura del ensayo
  // ---------------------------------------------------------------
  function pasaCondicion(cond, filtro) {
    if (!filtro || filtro === 'ambas') return true;
    return !cond || cond === 'ambas' || cond === filtro;
  }

  function rangoTexto(d) {
    d = d || {};
    const g = (k) => String(d[k] == null ? '' : d[k]).trim();
    let r = '';
    if (g('temperaturaMin') || g('temperaturaMax')) r = (g('temperaturaMin') || '?') + '–' + (g('temperaturaMax') || '?') + ' °C';
    if (g('humedadMin') || g('humedadMax')) r += (r ? ' / ' : '') + 'HR ' + (g('humedadMin') || '?') + '–' + (g('humedadMax') || '?') + ' %';
    return r;
  }

  function contexto(draft, entidad, filtro, articulos) {
    const d = draft || {};
    const nombre = String(d.descripcion || '').trim() || (entidad && entidad.nombre) || '';
    return {
      entidad: nombre || 'almacén',
      rango: rangoTexto(d),
      cond: COND_TXT[filtro] || COND_TXT.ambas,
      lista: (articulos || []).map((a) => a.id).join(', '),
    };
  }

  const reClase = (c) => new RegExp('<span[^>]*class="[^"]*\\b' + c + '\\b[^"]*"[^>]*>[\\s\\S]*?<\\/span>', 'g');
  function congelar(html, ctx) {
    let s = String(html || '');
    const pon = (v) => (m, off, str) => {
      const prev = str.charAt(off - 1);
      return (/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(prev) ? ' ' : '') + esc(v);
    };
    s = s.replace(reClase('equipo'), pon(ctx.entidad));
    s = s.replace(reClase('rango'), (m, off, str) => (ctx.rango ? pon(ctx.rango)(m, off, str) : m.replace(/<[^>]+>/g, '')));
    s = s.replace(reClase('cond'), pon(ctx.cond));
    s = s.replace(reClase('lista-resumen'), pon(ctx.lista));
    s = s.replace(/<img[^>]*>/g, '');
    return s;
  }

  function lineas(html) {
    return desc(String(html || '')
      .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|div|tr)>/gi, '\n').replace(/<[^>]+>/g, ''))
      .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
  }

  function seccion(art, re) {
    return (art.secciones || []).filter((s) => re.test(s.et || ''));
  }
  function cuerpo(sec, ctx) {
    // Quita la etiqueta "<strong>Etiqueta:</strong>" y devuelve líneas.
    return lineas(congelar(String(sec.html || '').replace(/^\s*<strong>[^<]*:\s*<\/strong>\s*/i, ''), ctx))
      .map((l) => l.replace(/^(Objetivo|Procedimiento|Criterios? de aceptaci[oó]n|Documentos entregables|Nota|Referencia)\s*:\s*/i, ''))
      .filter(Boolean);
  }
  function niveles(ls) {
    return ls.map((l) => {
      let m = /^(\d+)[).]\s*(.+)$/.exec(l);
      if (m) return { nivel: 0, t: m[2] };
      m = /^[a-z][).]\s*(.+)$/i.exec(l);
      if (m) return { nivel: 1, t: m[1] };
      m = /^[-•–]\s*(.+)$/.exec(l);
      if (m) return { nivel: 0, t: m[1] };
      return { nivel: 0, t: l };
    });
  }

  function estructura(art, ctx) {
    const una = (re) => seccion(art, re).flatMap((s) => cuerpo(s, ctx));
    return {
      objetivo: una(/^objetivo/i).join(' '),
      procedimiento: niveles(una(/^procedimiento/i)),
      criterios: una(/^criterio/i),
      entregables: niveles(una(/entregable/i)),
      notas: una(/^nota/i),
      referencia: una(/^referencia/i).join(' '),
      otros: (art.secciones || []).filter((s) => !(s.et || '').trim()).flatMap((s) => lineas(congelar(s.html, ctx))),
    };
  }

  function puntosVerificacion(e) {
    // Hojas del procedimiento (los pasos con sub-ítems se representan por sus sub-ítems).
    const pts = [];
    e.procedimiento.forEach((it, i) => {
      const sig = e.procedimiento[i + 1];
      if (it.nivel === 0 && sig && sig.nivel === 1) return;
      pts.push(it.t);
    });
    if (!pts.length) e.criterios.forEach((c) => pts.push(c));
    return pts.map((t) => t.replace(/:$/, ''));
  }

  const tituloLimpio = (art) => String(art.titulo || art.id || '')
    .replace(/^[A-Z]{2,5}-[A-Z]{2}-\d{2,4}\s*[—–-]\s*/, '').trim();

  function fechaTexto(f) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(f || ''));
    if (!m) return '';
    return m[3] + '/' + MESES[+m[2] - 1] + '/' + m[1];
  }

  // ---------------------------------------------------------------
  // Generación
  // ---------------------------------------------------------------
  function localizarProcedimiento(parts, inf) {
    const iProc = inf.findIndex((x) => x.estilo === 'Heading1' && /^PROCEDIMIENTO/.test(sinEsp(x.texto).toUpperCase()));
    if (iProc < 0) throw new Error('La plantilla no tiene la sección "PROCEDIMIENTO DE CALIFICACIÓN".');
    let iFin = inf.findIndex((x, i) => i > iProc && x.estilo === 'Heading1');
    if (iFin < 0) iFin = parts.length - 1;
    const subs = [];
    for (let i = iProc + 1; i < iFin; i++) {
      if (inf[i].estilo === 'Heading2' && inf[i].numId) {
        if (subs.length) subs[subs.length - 1].fin = i;
        const t = sinEsp(inf[i].texto).toUpperCase();
        const tipo = /^DEFINICI[ÓO]NUSP/.test(t) ? 'usp'
          : /REQUISITOSPREVIO/.test(t) ? 'req'
            : /^RESUMEN/.test(t) ? 'resumen' : 'ensayo';
        subs.push({ ini: i, fin: iFin, tipo });
      }
    }
    return { iProc, iFin, subs };
  }

  function plantillasEnsayo(parts, inf, subs, mainNum) {
    const T = {};
    const rango = [];
    subs.filter((s) => s.tipo === 'ensayo').forEach((s) => { for (let i = s.ini; i < s.fin; i++) rango.push(i); });
    const busca = (f) => { const i = rango.find(f); return i == null ? null : parts[i].xml; };
    T.h2 = parts[subs.find((s) => s.tipo === 'ensayo').ini].xml;
    T.objetivo = busca((i) => inf[i].ilvl === 2 && /^Objetivo:/.test(inf[i].texto));
    T.etiqueta = busca((i) => inf[i].ilvl === 2 && /^Procedimiento:?$/.test(inf[i].texto));
    T.paso = busca((i) => inf[i].ilvl === 3 && inf[i].numId === mainNum && inf[i].texto);
    T.sub = busca((i) => inf[i].tag === 'w:p' && inf[i].numId && inf[i].numId !== mainNum && inf[i].texto);
    T.nota = busca((i) => inf[i].tag === 'w:p' && !inf[i].numId && /^Nota/.test(inf[i].texto));
    T.vacio = busca((i) => inf[i].tag === 'w:p' && !inf[i].texto && !/<w:drawing|<w:pict/.test(parts[i].xml));
    T.conclusion = busca((i) => inf[i].tag === 'w:tbl' && /^CONCLUSI[ÓO]N DE LA PRUEBA/.test(inf[i].texto));
    T.registro = busca((i) => inf[i].tag === 'w:tbl' && /^Tabla\s*#/.test(inf[i].texto));
    const res = subs.find((s) => s.tipo === 'resumen');
    if (res) {
      for (let i = res.ini; i < res.fin; i++) {
        if (inf[i].tag === 'w:tbl' && /^Tabla/.test(inf[i].texto)) { T.verificacion = parts[i].xml; break; }
      }
    }
    const faltan = ['objetivo', 'etiqueta', 'paso', 'conclusion', 'verificacion'].filter((k) => !T[k]);
    if (faltan.length) throw new Error('La plantilla no tiene los elementos de ensayo: ' + faltan.join(', '));
    if (!T.vacio) T.vacio = '<w:p/>';
    if (!T.nota) T.nota = T.paso.replace(/<w:numPr>[\s\S]*?<\/w:numPr>/, '');
    return T;
  }

  function tablaVerificacion(tpl, caption, titulo, puntos) {
    const fs = filas(tpl);
    const cab = celdas(fs[0]);
    cab[0] = textoCelda(cab[0], caption);
    if (cab.length > 1 && titulo) cab[1] = textoCelda(cab[1], titulo);
    const base = fs[2] || fs[fs.length - 1];
    const datos = (puntos.length ? puntos : ['']).map((pt, i) => {
      const c = celdas(clonar(base));
      c[0] = textoCelda(c[0], String(i + 1));
      if (c.length > 2) c[1] = textoCelda(c[1], pt);
      return conCeldas(clonar(base), c);
    });
    return conFilas(clonar(tpl), [conCeldas(fs[0], cab), fs[1]].concat(datos));
  }

  function tablaRegistro(tpl, caption, titulo, draft, ctx) {
    const d = draft || {};
    const fs = filas(tpl);
    const cab = celdas(fs[0]);
    cab[0] = textoCelda(cab[0], caption);
    cab[1] = textoCelda(cab[1], titulo);
    const valores = [
      String(d.ubicacion || ctx.entidad || ''),
      String(d.duracionEstudio || ''),
      String(d.intervaloRegistro || ''),
      ctx.rango || '',
    ];
    const params = fs.slice(1, 5).map((f, k) => {
      const c = celdas(f);
      if (c.length > 1 && valores[k]) c[1] = textoCelda(c[1], valores[k]);
      return conCeldas(f, c);
    });
    let n = parseInt(d.cantidadDataLoggers, 10);
    if (!(n > 0)) n = OPC.itemsRegistroPorDefecto;
    n = Math.min(n, OPC.maxItemsRegistro);
    const primera = fs[6], resto = fs[7] || fs[6];
    const items = [];
    for (let i = 0; i < n; i++) {
      const base = i === 0 ? primera : resto;
      const c = celdas(clonar(base));
      c[0] = textoCelda(c[0], String(i + 1));
      items.push(conCeldas(clonar(base), c));
    }
    return conFilas(clonar(tpl), [conCeldas(fs[0], cab)].concat(params, [fs[5]], items));
  }

  // Firmantes T0 (Realizado, automático) y T2 (Revisor Gerente, combobox).
  // T1 y T3 quedan fijos como en el modelo. Devuelve avisos.
  function llenarFirmas(parts, inf, draft) {
    const avisos = [];
    const f = (draft && draft.firmantes) || {};
    const r0 = f.realizado || {};
    const r2 = f.revisor || {};
    const n0 = [String(r0.nombre || '').trim(), r0.cargo ? '(' + String(r0.cargo).trim() + ')' : ''].filter(Boolean).join(' ');
    const nombre0 = n0 ? n0.replace(/^(.+?) \(/, '$1 / (') : '';
    let puesto2 = String(r2.puesto || '').trim();
    if (!puesto2 && r2.area) puesto2 = 'Gerente de ' + String(r2.area).trim();
    const nombre2 = String(r2.nombre || '').trim() ? String(r2.nombre).trim() + (puesto2 ? ' / (' + puesto2 + ')' : '') : '';
    const iF = inf.findIndex((x) => x.estilo === 'Heading1' && /^FIRMA/.test(sinEsp(x.texto).toUpperCase()));
    if (iF < 0) return avisos;
    const tbls = [];
    for (let i = iF + 1; i < parts.length && tbls.length < 4; i++) {
      if (parts[i].tag === 'w:tbl') tbls.push(i);
      if (inf[i].estilo === 'Heading1') break;
    }
    const poner = (ti, nombre) => {
      if (ti == null || !nombre) return false;
      const fs = filas(parts[ti].xml);
      if (fs.length < 2) return false;
      const c = celdas(fs[1]);
      if (!c.length) return false;
      // La celda del modelo trae 2 párrafos (nombre + cargo viejo): se reemplaza
      // TODO el contenido por un solo párrafo con el nombre real, en negro.
      const tcPr = (/<w:tcPr>[\s\S]*?<\/w:tcPr>/.exec(c[0]) || [''])[0];
      const primerP = /<w:p[ >][\s\S]*?<\/w:p>/.exec(c[0]);
      const nuevoP = primerP ? textoParrafo(primerP[0], nombre)
        : '<w:p><w:r><w:t xml:space="preserve">' + esc(nombre) + '</w:t></w:r></w:p>';
      c[0] = c[0].slice(0, c[0].indexOf('>') + 1) + tcPr + nuevoP + '</w:tc>';
      c[0] = c[0].replace(/w:val="FF0000"/g, 'w:val="000000"');
      parts[ti] = { tag: 'w:tbl', xml: conFilas(parts[ti].xml, [fs[0], conCeldas(fs[1], c)].concat(fs.slice(2))) };
      return true;
    };
    if (nombre0) poner(tbls[0], nombre0);
    else avisos.push('Sin Realizado automático: la tabla de firmas conserva el modelo.');
    if (nombre2) poner(tbls[2], nombre2);
    else avisos.push('Sin Revisor Gerente: la tabla T2 conserva el modelo.');
    return avisos;
  }

  // Firmas en Tahoma 11 blindado: reescribe fuentes+tamaño de cada run de la
  // sección FIRMA DE APROBACIÓN (conserva negrita, color y resto del rPr).
  const TAHOMA11 = '<w:rFonts w:ascii="Tahoma" w:hAnsi="Tahoma" w:cs="Tahoma"/><w:sz w:val="22"/><w:szCs w:val="22"/>';
  function fijarTahoma11(xml) {
    let out = String(xml || '').replace(/<w:rPr>([\s\S]*?)<\/w:rPr>/g, (m, inner) => {
      const limpio = inner
        .replace(/<w:rFonts\b[^>]*\/>/g, '')
        .replace(/<w:sz\b[^>]*\/>/g, '')
        .replace(/<w:szCs\b[^>]*\/>/g, '');
      return '<w:rPr>' + TAHOMA11 + limpio + '</w:rPr>';
    });
    out = out.replace(/<w:r(\s[^>]*)?>(<w:t)/g, '<w:r$1><w:rPr>' + TAHOMA11 + '</w:rPr>$2');
    return out;
  }

  function blindarFirmas(parts, inf) {
    const iF = inf.findIndex((x) => x.estilo === 'Heading1' && /^FIRMA/.test(sinEsp(x.texto).toUpperCase()));
    if (iF < 0) return 0;
    let n = 0;
    for (let i = iF; i < parts.length; i++) {
      if (i > iF && inf[i].estilo === 'Heading1') break;
      const antes = parts[i].xml;
      parts[i] = { tag: parts[i].tag, xml: fijarTahoma11(antes) };
      if (parts[i].xml !== antes) n++;
    }
    return n;
  }

  async function generar(fase, plantillaU8, banco, draft, entidad, filtroCond) {
    if (FASES.indexOf(fase) < 0) throw new Error('Fase no soportada por plantilla: ' + fase);
    const filtro = filtroCond || 'ambas';
    const d = draft || {};
    const avisos = [];
    BM = 90000;

    // ---- banco ----
    const items = (banco && banco.fases && banco.fases[fase]) || [];
    const ensayosTodos = items.filter((i) => i.id && (i.bloque === 2 || i.bloque === 3) && i.kind !== 'tabla' && pasaCondicion(i.cond, filtro));
    const artReq = ensayosTodos.find((a) => /requisitos previos/i.test(a.titulo || ''));
    const ensayos = ensayosTodos.filter((a) => a !== artReq);
    const ctx = contexto(d, entidad, filtro, ensayosTodos);
    if (!ctx.rango) avisos.push('Sin rango de temperatura/HR en el borrador: se imprime el rango del banco.');
    if (!ensayos.length) avisos.push('El banco no tiene ensayos ' + fase + ' para la condición seleccionada.');

    // ---- plantilla ----
    const archivos = await leerZip(plantillaU8);
    const get = (n) => archivos.find((a) => a.nombre === n);
    const setTxt = (n, s) => { get(n).datos = enc(s); };
    const docXml = dec(get('word/document.xml').datos);
    const iBody = docXml.indexOf('<w:body>') + 8;
    const fBody = docXml.lastIndexOf('</w:body>');
    let parts = hijos(docXml.slice(iBody, fBody));
    let inf = parts.map(info);
    const H1s = inf.map((x, i) => (x.estilo === 'Heading1' ? i : -1)).filter((i) => i >= 0);
    const mainNum = inf[H1s[0]].numId;
    const loc = localizarProcedimiento(parts, inf);
    const T = plantillasEnsayo(parts, inf, loc.subs, mainNum);

    // numeración de la sección de procedimiento (H1 n.º)
    const nProc = H1s.indexOf(loc.iProc) + 1;

    // numbering.xml: listas de sub-ítems que reinician (a, b, c…) por grupo
    let numXml = dec(get('word/numbering.xml').datos);
    let subNumAbs = null, subIlvl = null, nextNum = 0;
    if (T.sub) {
      const sid = /<w:numId w:val="(\d+)"/.exec(pPrDe(T.sub))[1];
      subIlvl = +/<w:ilvl w:val="(\d+)"/.exec(pPrDe(T.sub))[1];
      const mm = new RegExp('<w:num w:numId="' + sid + '"[^>]*>\\s*<w:abstractNumId w:val="(\\d+)"').exec(numXml);
      subNumAbs = mm ? mm[1] : null;
      nextNum = Math.max.apply(null, (numXml.match(/<w:num w:numId="(\d+)"/g) || ['0']).map((x) => +x.replace(/\D/g, ''))) + 1;
    }
    const numsNuevos = [];
    function nuevaListaSub() {
      if (!subNumAbs) return null;
      const id = nextNum++;
      numsNuevos.push('<w:num w:numId="' + id + '"><w:abstractNumId w:val="' + subNumAbs + '"/><w:lvlOverride w:ilvl="' + subIlvl
        + '"><w:startOverride w:val="1"/></w:lvlOverride></w:num>');
      return String(id);
    }

    // ---- construir procedimiento ----
    const recortar = (arr) => { while (arr.length && arr[arr.length - 1].tag === 'w:p' && !info(arr[arr.length - 1]).texto && !/<w:drawing|<w:pict/.test(arr[arr.length - 1].xml)) arr.pop(); return arr; };
    const nuevo = [];
    const toc = {}; // marcador -> texto de índice
    let nSub = 0;
    let conclusiones = 0;

    const P = (xml) => nuevo.push({ tag: 'w:p', xml });
    const TBL = (xml) => nuevo.push({ tag: 'w:tbl', xml });

    nuevo.push(parts[loc.iProc]);
    loc.subs.filter((s) => s.tipo === 'usp' || s.tipo === 'req').forEach((s) => {
      nSub++;
      const seg = recortar(parts.slice(s.ini, s.fin).map((x) => ({ tag: x.tag, xml: x.xml })));
      const bm = '_SigmaSec' + nProc + '_' + nSub;
      seg[0] = { tag: 'w:p', xml: conMarcador(seg[0].xml, bm) };
      toc[bm] = s.tipo === 'usp' ? 'Definición USP' : 'Evaluación de requisitos previos a la calificación';
      nuevo.push(...seg);
      conclusiones += seg.filter((x) => x.tag === 'w:tbl' && /^CONCLUSI/.test(norm(texto(x.xml)))).length;
    });

    const resumenFilas = [];
    ensayos.forEach((art) => {
      nSub++;
      const e = estructura(art, ctx);
      const tit = tituloLimpio(art);
      const bm = '_SigmaSec' + nProc + '_' + nSub;
      toc[bm] = tit;
      resumenFilas.push(tit);
      P(parrafo(T.h2, [{ t: tit.toUpperCase() + ':', b: true }], { salto: true, marcador: bm }));
      if (OPC.incluirCodigoEnsayo) {
        P(parrafo(T.nota, [{ t: 'Código del ensayo en el banco: ', b: true }, { t: art.id }], { sinNum: true, runNormal: 1 }));
      }
      if (e.objetivo) P(parrafo(T.objetivo, [{ t: 'Objetivo: ', b: true }, { t: e.objetivo }], { runNormal: 1 }));
      const lista = (etq, its) => {
        if (!its.length) return;
        P(parrafo(T.etiqueta, [{ t: etq, b: true }]));
        let subId = null;
        its.forEach((it, k) => {
          if (it.nivel === 1) {
            if (T.sub) {
              if (!subId || (its[k - 1] && its[k - 1].nivel !== 1)) subId = nuevaListaSub();
              P(parrafo(T.sub, [{ t: it.t }], { numId: subId }));
            } else P(parrafo(T.paso, [{ t: it.t }], { ilvl: 4 }));
          } else P(parrafo(T.paso, [{ t: it.t }]));
        });
      };
      lista('Procedimiento:', e.procedimiento);
      lista('Criterios de aceptación:', e.criterios.map((t) => ({ nivel: 0, t })));
      lista('Documentos entregables:', e.entregables);
      e.otros.forEach((t) => P(parrafo(T.nota, [{ t }], { sinNum: true, runNormal: 1 })));
      e.notas.forEach((t) => P(parrafo(T.nota, [{ t: 'Nota: ', b: true }, { t }], { sinNum: true, runNormal: 1 })));
      if (e.referencia) P(parrafo(T.nota, [{ t: 'Referencia: ', b: true }, { t: e.referencia }], { sinNum: true, runNormal: 1 }));
      if (art.tabla) avisos.push(art.id + ': tiene una tabla propia en el banco que no se incluye (se usa la tabla del modelo).');
      P(clonar(T.vacio));
      const caption = 'Tabla ' + nProc + '.' + nSub + '-1';
      const usaRegistro = art.tablaTipo ? art.tablaTipo === 'registro'
        : (fase !== 'IQ' && !!T.registro && OPC.reRegistro.test(tit + ' ' + e.objetivo));
      if (usaRegistro && T.registro) TBL(tablaRegistro(T.registro, caption, tit, d, ctx));
      else TBL(tablaVerificacion(T.verificacion, caption, tit, puntosVerificacion(e)));
      P(clonar(T.vacio));
      TBL(clonar(T.conclusion));
      conclusiones++;
    });

    // Resumen (modelo) con una fila por ensayo
    const sRes = loc.subs.find((s) => s.tipo === 'resumen');
    if (sRes) {
      nSub++;
      const seg = parts.slice(sRes.ini, sRes.fin).map((x) => ({ tag: x.tag, xml: x.xml }));
      const bm = '_SigmaSec' + nProc + '_' + nSub;
      toc[bm] = 'Resumen';
      seg[0] = { tag: 'w:p', xml: conMarcador(ajustarPPrEn(seg[0].xml, { salto: true }), bm) };
      const it = seg.findIndex((x) => x.tag === 'w:tbl' && /^Tabla/.test(norm(texto(x.xml))));
      if (it >= 0) {
        const tb = seg[it].xml;
        const fs = filas(tb);
        const cab = celdas(fs[0]);
        cab[0] = textoCelda(cab[0], 'Tabla ' + nProc + '.' + nSub + '-1');
        const base = fs[2] || fs[fs.length - 1];
        const datos = resumenFilas.map((t, i) => {
          const c = celdas(clonar(base));
          c[0] = textoCelda(c[0], String(i + 1));
          if (c.length > 2) c[1] = textoCelda(c[1], t);
          return conCeldas(clonar(base), c);
        });
        seg[it] = { tag: 'w:tbl', xml: conFilas(tb, [conCeldas(fs[0], cab), fs[1]].concat(datos)) };
      }
      conclusiones += seg.filter((x) => x.tag === 'w:tbl' && /^CONCLUSI/.test(norm(texto(x.xml)))).length;
      nuevo.push(...seg);
    }

    parts = parts.slice(0, loc.iProc).concat(nuevo, parts.slice(loc.iFin));
    inf = parts.map(info);

    // ---- requisitos previos (IQ/PQ sección 6 · OQ en el procedimiento) ----
    const iReq = inf.findIndex((x) => x.estilo === 'Heading2' && /REQUISITOSPREVIO/.test(sinEsp(x.texto).toUpperCase()));
    if (iReq >= 0 && artReq) {
      const e = estructura(artReq, ctx);
      const pts = puntosVerificacion(e);
      for (let i = iReq + 1; i < parts.length && inf[i].estilo !== 'Heading1' && inf[i].estilo !== 'Heading2'; i++) {
        if (inf[i].tag === 'w:p' && /^Objetivo:/.test(inf[i].texto) && e.objetivo) {
          parts[i] = { tag: 'w:p', xml: parrafo(parts[i].xml, [{ t: 'Objetivo: ', b: true }, { t: e.objetivo }], { runNormal: 1 }) };
        }
        if (inf[i].tag === 'w:tbl' && /^Tabla/.test(inf[i].texto) && /Requisito/i.test(inf[i].texto)) {
          const fs = filas(parts[i].xml);
          const base = fs[2];
          const datos = pts.map((t, k) => {
            const c = celdas(clonar(base));
            if (c.length > 2) { c[0] = textoCelda(c[0], String(k + 1)); c[1] = textoCelda(c[1], t); }
            else c[0] = textoCelda(c[0], t);
            return conCeldas(clonar(base), c);
          });
          parts[i] = { tag: 'w:tbl', xml: conFilas(parts[i].xml, fs.slice(0, 2).concat(datos)) };
          break;
        }
      }
    } else if (iReq >= 0) {
      avisos.push('El banco no tiene un ensayo "Requisitos previos" ' + fase + ': se mantiene la tabla de requisitos del modelo.');
    }
    inf = parts.map(info);

    // ---- datos de la entidad (portada, alcance, descripción, historial) ----
    const nombre = String(d.descripcion || '').trim() || (entidad && entidad.nombre) || '';
    const fecha = fechaTexto(d.fecha);
    const codigo = String(d.codigo || '').trim();
    const version = String(d.versionProtocolo || '').trim();
    const iPrimerH1 = H1s.length ? inf.findIndex((x) => x.estilo === 'Heading1') : 0;
    for (let i = 0; i < iPrimerH1; i++) {
      let x = parts[i].xml;
      if (nombre) x = reemplazarTexto(x, 'NOMBRE DEL EQUIPO', nombre.toUpperCase()).xml;
      x = reemplazarTexto(x, 'MARCA', String(d.marca || 'N/A'), 'MARCA:').xml;
      x = reemplazarTexto(x, 'MODELO', String(d.modelo || 'N/A'), 'MODELO:').xml;
      const area = String(d.area || d.ubicacion || '').trim();
      if (area) x = reemplazarTexto(x, 'ÁREA', area, 'ÁREA:').xml;
      if (codigo) x = reemplazarTexto(x, 'CÓDIGO', codigo, 'CÓDIGO:').xml;
      parts[i] = { tag: parts[i].tag, xml: x };
    }
    if (!nombre) avisos.push('Sin descripción de la entidad: la portada conserva "NOMBRE DEL EQUIPO".');
    if (!(d.area || d.ubicacion)) avisos.push('Sin área/ubicación: la portada conserva "ÁREA".');

    const iAlc = inf.findIndex((x) => x.estilo === 'Heading1' && /^ALCANCE/.test(sinEsp(x.texto).toUpperCase()));
    if (iAlc >= 0 && inf[iAlc + 1] && inf[iAlc + 1].tag === 'w:p' && nombre) {
      const alc = 'Esta calificación aplica a ' + nombre
        + (d.modelo ? ', modelo ' + d.modelo : '')
        + (codigo ? ', código ' + codigo : '')
        + (d.ubicacion ? ', ubicado en el área de ' + d.ubicacion : '')
        + ' de Laboratorios Sued, S.R.L.';
      parts[iAlc + 1] = { tag: 'w:p', xml: textoParrafo(parts[iAlc + 1].xml, alc) };
    }

    const iDesc = inf.findIndex((x) => x.tag === 'w:p' && /^DESCRIPCI[ÓO]N:?$/i.test(sinEsp(x.texto)));
    if (iDesc >= 0) {
      const iT = inf.findIndex((x, i) => i > iDesc && x.tag === 'w:p' && sinEsp(x.texto) === 'Texto');
      const dtxt = [nombre, d.tipo ? 'Tipo: ' + d.tipo : '', ctx.rango ? 'Rango de operación: ' + ctx.rango : ''].filter(Boolean).join('. ');
      if (iT >= 0 && dtxt) parts[iT] = { tag: 'w:p', xml: textoParrafo(parts[iT].xml, dtxt + '.') };
      const iUso = inf.findIndex((x, i) => i > iDesc && x.tag === 'w:p' && /^USO:?$/i.test(sinEsp(x.texto)));
      const iT2 = iUso >= 0 ? inf.findIndex((x, i) => i > iUso && x.tag === 'w:p' && sinEsp(x.texto) === 'Texto') : -1;
      if (iT2 >= 0 && d.usoPrevisto) parts[iT2] = { tag: 'w:p', xml: textoParrafo(parts[iT2].xml, String(d.usoPrevisto)) };
      else avisos.push('Sin uso previsto en el borrador: la sección 6 conserva "Texto" en USO.');
      avisos.push('La imagen de la entidad no se inserta automáticamente ("Imagen del equipo").');
    }

    // ---- referencias y anexos del banco ----
    const iRef = inf.findIndex((x) => x.estilo === 'Heading1' && /^REFERENCIAS/.test(sinEsp(x.texto).toUpperCase()));
    const refArt = items.find((i) => i.bloque === 6 && i.tabla && pasaCondicion(i.cond, filtro));
    const nRef = H1s.length ? inf.filter((x, i) => x.estilo === 'Heading1' && i <= iRef).length : 9;
    if (iRef >= 0 && refArt && parts[iRef + 1] && parts[iRef + 1].tag === 'w:tbl') {
      const vacio = (s) => !String(s || '').replace(/[_\s—-]/g, '');
      const refs = refArt.tabla.rows.filter((r) => !vacio(r[1])).map((r) => {
        const v = r[2] && !vacio(r[2]) ? ' — ' + r[2] : '';
        return String(r[1]).toUpperCase() + v.toUpperCase();
      });
      if (refs.length) {
        const fs = filas(parts[iRef + 1].xml);
        const base = fs[1];
        const datos = refs.map((t, k) => {
          const c = celdas(clonar(base));
          c[0] = textoCelda(c[0], nRef + '.' + (k + 1));
          c[1] = textoCelda(c[1], t);
          return conCeldas(clonar(base), c);
        });
        parts[iRef + 1] = { tag: 'w:tbl', xml: conFilas(parts[iRef + 1].xml, [fs[0]].concat(datos)) };
      }
    }
    const iAnx = inf.findIndex((x) => x.estilo === 'Heading1' && /^ANEXOS/.test(sinEsp(x.texto).toUpperCase()));
    const anxDiv = items.find((i) => !i.id && i.bloque === 8);
    if (iAnx >= 0 && anxDiv && parts[iAnx + 1] && parts[iAnx + 1].tag === 'w:tbl') {
      const anx = lineas(congelar(anxDiv.html, ctx)).filter((l) => !/^ANEXOS$/i.test(l));
      const fs = filas(parts[iAnx + 1].xml);
      const base = fs[1];
      const total = anx.length || (fs.length - 1);
      const datos = [];
      for (let k = 0; k < total; k++) {
        const c = celdas(clonar(base));
        c[0] = textoCelda(c[0], (nRef + 1) + '.' + (k + 1));
        c[1] = textoCelda(c[1], anx[k] || '');
        datos.push(conCeldas(clonar(base), c));
      }
      parts[iAnx + 1] = { tag: 'w:tbl', xml: conFilas(parts[iAnx + 1].xml, [fs[0]].concat(datos)) };
    }
    const iHist = inf.findIndex((x) => x.estilo === 'Heading1' && /^HISTORIAL/.test(sinEsp(x.texto).toUpperCase()));
    const ccHist = String(d.controlCambios || '').trim();
    if (iHist >= 0 && (fecha || ccHist)) {
      for (let i = iHist + 1; i < parts.length; i++) {
        if (parts[i].tag === 'w:tbl') {
          let hxml = fecha ? reemplazarTexto(parts[i].xml, 'DD/Mmm/AAAA', fecha).xml : parts[i].xml;
          // Control de cambios del grid → celda CAMBIOS de la última página
          if (ccHist) {
            const fs = filas(hxml);
            if (fs.length > 1) {
              const c = celdas(fs[1]);
              if (c.length > 2) {
                if (version) c[0] = textoCelda(c[0], version);
                c[2] = textoCelda(c[2], 'Creación por control de cambios #' + ccHist);
                hxml = conFilas(hxml, [fs[0], conCeldas(fs[1], c)].concat(fs.slice(2)));
              }
            }
          } else if (version) {
            const fs = filas(hxml);
            if (fs.length > 1) {
              const c = celdas(fs[1]);
              if (c.length > 0) {
                c[0] = textoCelda(c[0], version);
                hxml = conFilas(hxml, [fs[0], conCeldas(fs[1], c)].concat(fs.slice(2)));
              }
            }
          }
          parts[i] = { tag: 'w:tbl', xml: hxml };
          break;
        }
      }
    }

    // ---- índice (tabla manual del modelo con números de página por campo PAGEREF) ----
    inf = parts.map(info);
    const iToc = inf.findIndex((x) => x.tag === 'w:tbl' && /^ACÁPITE/.test(x.texto));
    if (iToc >= 0) {
      const fs = filas(parts[iToc].xml);
      const tpl1 = fs.find((f, k) => k > 0 && celdas(f).length === 3) || fs[1];
      const tpl2 = fs.find((f) => celdas(f).length === 4 && /^\d+\.\d+$/.test(norm(texto(celdas(f)[1])))) || tpl1;
      const nombresModelo = {};
      fs.forEach((f) => {
        const c = celdas(f).map((x) => norm(texto(x)));
        if (c.length === 3 && /^\d+$/.test(c[0])) nombresModelo[c[0]] = c[1];
        if (c.length === 4 && /^6\.\d+$/.test(c[1])) nombresModelo[c[1]] = c[2];
      });
      const entradas = [];
      let h1 = 0, h2 = 0, h1Texto = '';
      parts.forEach((x, i) => {
        const y = inf[i];
        if (y.estilo === 'Heading1' && y.numId) {
          h1++; h2 = 0; h1Texto = sinEsp(y.texto).toUpperCase();
          const bm = '_SigmaH1_' + h1;
          parts[i] = { tag: 'w:p', xml: /_SigmaSec/.test(x.xml) ? x.xml : conMarcador(x.xml, bm) };
          entradas.push({ nivel: 1, num: String(h1), texto: nombresModelo[String(h1)] || y.texto.replace(/\s*:\s*$/, ''), bm });
        } else if (y.estilo === 'Heading2' && y.numId) {
          h2++;
          if (!/^(DESCRIPCI|PROCEDIMIENTO)/.test(h1Texto)) return;
          const num = h1 + '.' + h2;
          let bm = (/w:name="(_SigmaSec[^"]+)"/.exec(x.xml) || [])[1];
          if (!bm) { bm = '_SigmaH2_' + h1 + '_' + h2; parts[i] = { tag: 'w:p', xml: conMarcador(x.xml, bm) }; }
          entradas.push({ nivel: 2, num, texto: toc[bm] || nombresModelo[num] || y.texto.replace(/\s*:\s*$/, ''), bm });
        }
      });
      const campo = (rpr, bm) => {
        const r = limpiarRPr(rpr);
        return '<w:r>' + r + '<w:fldChar w:fldCharType="begin"/></w:r><w:r>' + r
          + '<w:instrText xml:space="preserve"> PAGEREF ' + bm + ' \\h </w:instrText></w:r><w:r>' + r
          + '<w:fldChar w:fldCharType="separate"/></w:r><w:r>' + r + '<w:t>#</w:t></w:r><w:r>' + r
          + '<w:fldChar w:fldCharType="end"/></w:r>';
      };
      const nuevas = entradas.map((e) => {
        const tpl = e.nivel === 1 ? tpl1 : tpl2;
        const c = celdas(clonar(tpl));
        if (e.nivel === 1) {
          c[0] = textoCelda(c[0], e.num);
          c[1] = textoCelda(c[1], e.texto);
          c[2] = camposCelda(c[2], campo(rPrRun(c[2], 0), e.bm));
        } else {
          c[0] = textoCelda(c[0], '');
          c[1] = textoCelda(c[1], e.num);
          c[2] = textoCelda(c[2], e.texto);
          c[3] = camposCelda(c[3], campo(rPrRun(c[3], 0), e.bm));
        }
        return conCeldas(clonar(tpl), c);
      });
      parts[iToc] = { tag: 'w:tbl', xml: conFilas(parts[iToc].xml, [fs[0]].concat(nuevas)) };
    }

    // ---- firmas T0/T2 dinámicas (T1/T3 fijas) + Tahoma 11 blindado ----
    llenarFirmas(parts, inf, d).forEach((a) => avisos.push(a));
    blindarFirmas(parts, inf);
    inf = parts.map(info);

    // ---- encabezado ----
    archivos.filter((a) => /^word\/header\d+\.xml$/.test(a.nombre)).forEach((a) => {
      let x = dec(a.datos);
      // DOCUMENTO NO.: FASE-CÓDIGO (el modelo trae "PQ-1/400AAAA" → queda "PQ-1000625")
      if (codigo) x = reemplazarTexto(x, '1/400AAAA', codigo).xml;
      // VERSIÓN del cajetín: run exacto ">AA<" (buscar "AA" a secas rompería "DD/MMM/AAAA")
      if (version) x = x.split('>AA<').join('>' + esc(version) + '<');
      // Fecha del cajetín en mayúsculas (30/SEP/2026); el historial queda como está
      if (fecha) x = reemplazarTexto(x, 'DD/MMM/AAAA', fecha.toUpperCase()).xml;
      if (nombre) x = reemplazarTexto(x, 'NOMBRE DEL EQUIPO', nombre.toUpperCase()).xml;
      x = reemplazarTexto(x, ' SIN MARCA NI MODELO', '').xml;
      x = reemplazarTexto(x, 'CALIFICACION DE ', 'CALIFICACIÓN DE ').xml; // tilde ausente en el encabezado de los modelos
      // Encabezado 100% negro: los valores del modelo vienen en rojo (FF0000)
      x = x.replace(/w:val="FF0000"/g, 'w:val="000000"');
      a.datos = enc(x);
    });
    if (!codigo) avisos.push('Sin código: el número de documento conserva "1/400AAAA".');
    if (!version) avisos.push('Sin versión: el cajetín y el historial conservan "AA"/"01".');
    if (!fecha) avisos.push('Sin fecha: la fecha de emisión conserva "DD/MMM/AAAA".');
    avisos.push('Versión del documento ("AA") y número de solicitud del historial se completan manualmente.');

    // ---- ensamblar ----
    const cuerpoXml = parts.map((x) => x.xml).join('');
    setTxt('word/document.xml', docXml.slice(0, iBody) + cuerpoXml + docXml.slice(fBody));
    if (numsNuevos.length) setTxt('word/numbering.xml', numXml.replace('</w:numbering>', numsNuevos.join('') + '</w:numbering>'));
    // docDefaults a 11pt: ningún run heredado puede mostrar 12pt en Word
    const stGet = get('word/styles.xml');
    if (stGet) {
      const stx = dec(stGet.datos).replace(/<w:docDefaults>[\s\S]*?<\/w:docDefaults>/, (m) =>
        m.replace(/w:sz w:val="24"/g, 'w:sz w:val="22"').replace(/w:szCs w:val="24"/g, 'w:szCs w:val="22"'));
      setTxt('word/styles.xml', stx);
    }
    let sett = dec(get('word/settings.xml').datos);
    if (!/<w:updateFields\b/.test(sett)) {
      const ancla = ['<w:hdrShapeDefaults', '<w:footnotePr', '<w:endnotePr', '<w:compat', '<w:docVars', '<w:rsids', '</w:settings>']
        .find((t) => sett.indexOf(t) >= 0);
      sett = sett.replace(ancla, '<w:updateFields w:val="true"/>' + ancla);
      setTxt('word/settings.xml', sett);
    }
    const bytes = await escribirZip(archivos);
    return {
      bytes, fase, avisos,
      ensayos: ensayos.map((a) => a.id),
      requisitos: artReq ? artReq.id : null,
      conclusiones,
    };

    function ajustarPPrEn(pXml, o) {
      const ppr = pPrDe(pXml);
      return pXml.replace(ppr, ajustarPPr(ppr, o));
    }
  }

  function soporta(fase) {
    return FASES.indexOf(fase) >= 0;
  }

  function banco() {
    try {
      if (typeof BancoAlmacenes !== 'undefined') return BancoAlmacenes;
      if (typeof GeneradorDocx !== 'undefined' && GeneradorDocx.banco) return GeneradorDocx.banco();
    } catch (e) { /* sigue */ }
    return { version: '', fases: {} };
  }

  async function descargar(fase, draft, entidad, filtroCond) {
    const resp = await fetch(PLANTILLAS[fase], { cache: 'no-store' });
    if (!resp.ok) throw new Error('No se encontró la plantilla ' + PLANTILLAS[fase] + ' (' + resp.status + ').');
    const u8 = new Uint8Array(await resp.arrayBuffer());
    const r = await generar(fase, u8, banco(), draft, entidad, filtroCond);
    const blob = new Blob([r.bytes], { type: MIME_DOCX });
    const entId = (entidad && entidad.id) ? entidad.id : 'entidad';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fase + '-' + entId + '.docx';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { try { URL.revokeObjectURL(a.href); a.remove(); } catch (e) { /* nada */ } }, 4000);
    return r;
  }

  return {
    FASES, PLANTILLAS, OPC, soporta, configurar, generar, descargar, banco,
    _interno: { leerZip, escribirZip, hijos, texto, reemplazarEnParrafo, congelar, lineas, estructura, puntosVerificacion, fechaTexto, crc32, llenarFirmas, fijarTahoma11 },
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = PlantillaDocx;
