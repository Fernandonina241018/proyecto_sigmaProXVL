// Aplica las correcciones de la revisión 2026-10-05 a los bancos OQ/PQ por familia.
// Trabaja sobre el texto HTML (sin re-serializar el DOM) para no alterar el resto del archivo.
// Uso:
//   node scripts/aplicar-correcciones-bancos.mjs            -> simula y muestra el informe (no escribe)
//   node scripts/aplicar-correcciones-bancos.mjs --aplicar  -> escribe si TODAS las operaciones obligatorias resolvieron
//   node scripts/aplicar-correcciones-bancos.mjs --aplicar --forzar -> escribe lo que resolvió y lista lo pendiente
// Es idempotente: una segunda pasada reporta "ya aplicado".
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { OPS, FECHA } from './correcciones-2026-10-05.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, '..', 'docs', 'banco-ensayos');
const APLICAR = process.argv.includes('--aplicar');
const FORZAR = process.argv.includes('--forzar');

// ---------- utilidades de texto ----------
const ENT = { '<': '(?:<|&lt;)', '>': '(?:>|&gt;)', '—': '(?:—|&mdash;|&#8212;)', '°': '(?:°|&deg;|&#176;)',
  '³': '(?:³|&sup3;)', '±': '(?:±|&plusmn;)', '≤': '(?:≤|&le;)', '≥': '(?:≥|&ge;)', 'Δ': '(?:Δ|&Delta;)', '&': '(?:&|&amp;)' };
// texto plano -> regex tolerante a espacios, &nbsp; y entidades
function pat(txt) {
  let r = '';
  for (const ch of txt) {
    if (/\s/.test(ch)) { if (!r.endsWith('(?:\\s|&nbsp;)+')) r += '(?:\\s|&nbsp;)+'; continue; }
    if (ENT[ch]) { r += ENT[ch]; continue; }
    r += ch.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
  }
  return new RegExp(r, 'g');
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plano = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

// ---------- localizar artículos ----------
function articulo(html, id) {
  const re = new RegExp('data-id="' + id.replace(/[-]/g, '\\-') + '"', 'g');
  const hits = [...html.matchAll(re)];
  if (hits.length === 0) return null;
  if (hits.length > 1) throw new Error('ID repetido en el archivo: ' + id);
  const ini = html.lastIndexOf('<article', hits[0].index);
  const finTag = html.indexOf('</article>', hits[0].index);
  if (ini < 0 || finTag < 0) throw new Error('No se pudo delimitar <article> de ' + id);
  const fin = finTag + '</article>'.length;
  return { ini, fin, txt: html.slice(ini, fin) };
}
function reemplazarArticulo(html, a, nuevo) { return html.slice(0, a.ini) + nuevo + html.slice(a.fin); }

const reSeccion = (et) => new RegExp('(<p[^>]*>\\s*<strong>\\s*' + et.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ':?\\s*</strong>\\s*(?:<br\\s*/?>)?\\s*)([\\s\\S]*?)(\\s*</p>)', 'i');

function separadores(art) {
  const proc = (art.match(reSeccion('Procedimiento')) || [])[2] || '';
  const paso = (proc.match(/(<br\s*\/?>\s*)(?=2\))/) || [])[1] || '<br>\n';
  const sub = (proc.match(/(<br\s*\/?>(?:\s|&nbsp;|&#160;|\u00a0)*)(?=a\))/) || [])[1] || paso;
  const ent = ((art.match(reSeccion('Documentos entregables')) || [])[2] || '').match(/(<br\s*\/?>\s*)(?=-\s)/);
  const refConBr = /<strong>\s*Referencia:\s*<\/strong>\s*<br/i.test(art);
  const eq = (art.match(/<span[^>]*class="[^"]*\bequipo\b[^"]*"[^>]*>[\s\S]*?<\/span>/) || [])[0] || null;
  const dash = /&mdash;/.test((art.match(/<h3[^>]*>[\s\S]*?<\/h3>/) || [''])[0]) ? '&mdash;' : '—';
  return { paso, sub, linea: ent ? ent[1] : '<br>\n', refConBr, eq, dash };
}
function lineasHTML(lineas, sep, eq) {
  return lineas.map((l, i) => {
    const t = esc(l).replace(/\{EQUIPO\}/g, eq || 'equipo');
    if (i === 0) return t;
    return (/^[a-z]\)\s/.test(l) ? sep.sub : sep.paso) + t;
  }).join('');
}

// ---------- operaciones ----------
const log = [];
let pendientesObligatorios = 0;
function reporte(o, estado, det = '') {
  log.push({ f: o.f, id: o.id || '', op: o.op, estado, det });
  if (estado === 'FALTA' && !o.opcional) pendientesObligatorios++;
}

function aplicarOp(html, o) {
  if (o.op === 'version') {
    const m = html.match(/(EQ-(?:IQ|OQ|PQ)-[A-Z]{2,3}) (\d{4}-\d{2}-\d{2}) v(\d+)/);
    if (!m) { reporte(o, 'FALTA', 'sello de versión no encontrado'); return html; }
    if (m[2] === FECHA) { reporte(o, 'ya aplicado', m[0]); return html; }
    const nuevo = m[1] + ' ' + FECHA + ' v' + (parseInt(m[3], 10) + 1);
    reporte(o, 'OK', m[0] + ' → ' + nuevo);
    return html.replace(m[0], nuevo);
  }
  if (o.op === 'insertar') {
    if (articulo(html, o.nuevo.id)) { reporte(o, 'ya aplicado', o.nuevo.id + ' existe'); return html; }
    const ref = articulo(html, o.despuesDe);
    if (!ref) { reporte(o, 'FALTA', 'no existe ' + o.despuesDe); return html; }
    const s = separadores(ref.txt);
    let tag = ref.txt.match(/^<article[^>]*>/)[0]
      .split(o.despuesDe).join(o.nuevo.id)
      .replace(/\s+data-(?:analisis|tabla-modelo|tabla-tipo)="[^"]*"/g, '');
    if (o.nuevo.analisis) tag = tag.replace(/>$/, ' data-analisis="si">');
    const h3tag = (ref.txt.match(/<h3[^>]*>/) || ['<h3>'])[0];
    const ind = (ref.txt.match(/>\n(\s*)<h3/) || [, ' '])[1];
    const partes = [tag, ind + h3tag + o.nuevo.id + ' ' + s.dash + ' ' + esc(o.nuevo.titulo) + '</h3>'];
    for (const sec of o.nuevo.secciones) {
      const conBr = sec.et !== 'Referencia' || s.refConBr;
      const sep = sec.et === 'Procedimiento' ? s : { paso: s.linea, sub: s.linea };
      partes.push(ind + '<p><strong>' + sec.et + ':</strong>' + (conBr ? '<br>' : ' ') + lineasHTML(sec.lineas, sep, s.eq) + '</p>');
    }
    const nuevo = partes.join('\n') + '\n' + ind.replace(/ $/, '') + '</article>';
    const pre = (html.slice(0, ref.ini).match(/\n([ \t]*)$/) || [, ''])[1];
    reporte(o, 'OK', 'insertado ' + o.nuevo.id + ' después de ' + o.despuesDe);
    return html.slice(0, ref.fin) + '\n\n' + pre + nuevo + html.slice(ref.fin);
  }
  const a = articulo(html, o.id);
  if (!a && o.op === 'retirar') { reporte(o, 'ya aplicado', 'el artículo no existe'); return html; }
  if (!a) { reporte(o, 'FALTA', 'artículo no encontrado'); return html; }
  let t = a.txt;
  if (o.op === 'retirar') {
    reporte(o, 'OK', 'artículo retirado (' + plano(t).slice(0, 60) + '…)');
    let h = reemplazarArticulo(html, a, '');
    return h.replace(/\n[ \t]*\n[ \t]*\n+/g, '\n\n');
  }
  if (o.op === 'texto') {
    if (plano(t).includes(o.a)) { reporte(o, 'ya aplicado'); return html; }
    const re = pat(o.de);
    const n = (t.match(re) || []).length;
    if (n === 0) { reporte(o, 'FALTA', 'no se encontró: "' + o.de + '"'); return html; }
    if (n > 1 && !o.todas) { reporte(o, 'FALTA', n + ' coincidencias de "' + o.de + '" (se esperaba 1)'); return html; }
    t = t.replace(re, () => esc(o.a));
    reporte(o, 'OK', '"' + o.de + '" → "' + o.a + '"');
    return reemplazarArticulo(html, a, t);
  }
  if (o.op === 'seccion') {
    const re = reSeccion(o.et);
    const m = t.match(re);
    if (!m) { reporte(o, 'FALTA', 'sección "' + o.et + '" no encontrada'); return html; }
    const s = separadores(t);
    const nuevo = lineasHTML(o.lineas, { paso: s.linea, sub: s.linea }, s.eq);
    if (plano(m[2]) === plano(nuevo)) { reporte(o, 'ya aplicado'); return html; }
    t = t.replace(re, (_, p1, _c, p3) => p1 + nuevo + p3);
    reporte(o, 'OK', o.et + ' reemplazado');
    return reemplazarArticulo(html, a, t);
  }
  if (o.op === 'nota') {
    if (plano(t).includes(plano(esc(o.texto)))) { reporte(o, 'ya aplicado'); return html; }
    const s = separadores(t);
    const reNota = reSeccion('Nota');
    if (reNota.test(t)) {
      t = t.replace(reNota, (_, p1, c, p3) => p1 + c + s.linea + esc(o.texto) + p3);
    } else {
      const reRef = /(\s*)(<p[^>]*>\s*<strong>\s*Referencia:)/i;
      const p = '<p><strong>Nota:</strong><br>' + esc(o.texto) + '</p>';
      t = reRef.test(t) ? t.replace(reRef, (_, ws, r) => ws + p + ws + r) : t.replace(/(\s*<\/article>)$/, '\n' + p + '$1');
    }
    reporte(o, 'OK', 'nota agregada');
    return reemplazarArticulo(html, a, t);
  }
  if (o.op === 'titulo') {
    const m = t.match(/(<h3[^>]*>)([\s\S]*?)(<\/h3>)/);
    if (!m) { reporte(o, 'FALTA', 'h3 no encontrado'); return html; }
    const dash = /&mdash;/.test(m[2]) ? '&mdash;' : '—';
    const nuevo = o.id + ' ' + dash + ' ' + esc(o.titulo);
    if (plano(m[2]) === plano(nuevo)) { reporte(o, 'ya aplicado'); return html; }
    t = t.replace(m[0], m[1] + nuevo + m[3]);
    reporte(o, 'OK', 'título → ' + o.titulo);
    return reemplazarArticulo(html, a, t);
  }
  if (o.op === 'fila') {
    const tb = t.match(/<table[\s\S]*?<\/table>/);
    if (!tb) { reporte(o, 'FALTA', 'tabla no encontrada'); return html; }
    if (plano(tb[0]).includes(plano(esc(o.celdas[1])))) { reporte(o, 'ya aplicado'); return html; }
    const filas = [...tb[0].matchAll(/<tr[\s\S]*?<\/tr>/g)];
    const ult = filas[filas.length - 1][0];
    const celdas = [...ult.matchAll(/(<t[dh][^>]*>)([\s\S]*?)(<\/t[dh]>)/g)];
    if (celdas.length !== o.celdas.length) { reporte(o, 'FALTA', 'la fila modelo tiene ' + celdas.length + ' celdas'); return html; }
    const vals = o.celdas.slice();
    if (!vals[0]) {
      const m = plano(celdas[0][2]).match(/^(\d+)\.(\d+)$/);
      vals[0] = m ? m[1] + '.' + (parseInt(m[2], 10) + 1) : '';
    }
    let i = 0;
    const fila = ult.replace(/(<t[dh][^>]*>)([\s\S]*?)(<\/t[dh]>)/g, (_, a1, _c, a3) => a1 + esc(vals[i++]) + a3);
    const ind = (tb[0].slice(0, tb[0].lastIndexOf(ult)).match(/\n([ \t]*)$/) || [, ''])[1];
    const nuevaTabla = tb[0].replace(ult, ult + '\n' + ind + fila);
    t = t.replace(tb[0], nuevaTabla);
    reporte(o, 'OK', 'fila ' + vals[0] + ' ' + o.celdas[1].slice(0, 50));
    return reemplazarArticulo(html, a, t);
  }
  throw new Error('Operación desconocida: ' + o.op);
}

// ---------- ejecución ----------
const porArchivo = new Map();
for (const o of OPS) { if (!porArchivo.has(o.f)) porArchivo.set(o.f, []); porArchivo.get(o.f).push(o); }
const resultado = new Map();
for (const [f, ops] of porArchivo) {
  const ruta = join(BASE, f);
  let html;
  try { html = readFileSync(ruta, 'utf-8'); } catch { for (const o of ops) reporte(o, 'FALTA', 'archivo no existe'); continue; }
  const orig = html;
  for (const o of ops) {
    // saltar: true = excluida por decisión del usuario (pendiente, ver ESTADO_PROYECTO).
    // Se reporta como omitida y no toca el archivo. (Agregado local, no del kit.)
    if (o.saltar) { reporte(o, 'omitida', 'pendiente decisión usuario'); continue; }
    try { html = aplicarOp(html, o); } catch (e) { reporte(o, 'FALTA', e.message); }
  }
  if (html !== orig) resultado.set(ruta, html);
}

const ancho = (s, n) => (s + ' '.repeat(n)).slice(0, n);
console.log('\n' + ancho('archivo', 26) + ancho('id', 16) + ancho('op', 9) + ancho('estado', 13) + 'detalle');
for (const r of log) console.log(ancho(r.f.replace('equipos/', ''), 26) + ancho(r.id, 16) + ancho(r.op, 9) + ancho(r.estado, 13) + r.det);
const ok = log.filter((r) => r.estado === 'OK').length;
const ya = log.filter((r) => r.estado === 'ya aplicado').length;
const falta = log.filter((r) => r.estado === 'FALTA');
console.log('\nOK: ' + ok + ' · ya aplicado: ' + ya + ' · falta: ' + falta.length + ' (obligatorias: ' + pendientesObligatorios + ')');

if (!APLICAR) { console.log('Simulación: no se escribió nada. Usa --aplicar para escribir.'); process.exit(pendientesObligatorios ? 2 : 0); }
if (pendientesObligatorios && !FORZAR) {
  console.error('No se escribió nada: hay ' + pendientesObligatorios + ' operaciones obligatorias sin resolver. Revisa las filas FALTA o usa --forzar.');
  process.exit(2);
}
for (const [ruta, html] of resultado) { writeFileSync(ruta, html); console.log('escrito: ' + ruta); }
console.log('Listo. Ahora: node scripts/extraer-banco.mjs equipos && npm test');
