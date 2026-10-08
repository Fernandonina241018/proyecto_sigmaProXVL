// Extrae un banco de ensayos HTML a js/core/banco-<cat>-data.js.
// Misma lógica que scripts/extraer-banco-almacenes.mjs, parametrizada por categoría,
// y además lleva al JSON `tablaModelo` (data-tabla-modelo) y `tablaTipo` (data-tabla-tipo).
// Uso: node scripts/extraer-banco.mjs equipos [--estricto]
//   --estricto: además falla si quedan campos vacíos "[ ]" en ensayos de bloques 2-3.
// Validaciones (2026-10-05): IDs únicos en todo el banco, fases esperadas por archivo,
// data-analisis solo "si", y reporte de campos "[ ]" pendientes y valores por defecto "[n]".
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const BANCOS = {
  almacenes: { src: ['almacenes.html'], dst: 'banco-almacenes-data.js', global: 'BancoAlmacenes' },
  // equipos: banco común + un archivo por familia y fase (p. ej. IQ/OQ/PQ de lecho fluido).
  // Los artículos llevan `familia` (data-familia); ausente = común a todas.
  equipos: { src: ['equipos-comun.html', 'equipos/oq-comun.html', 'equipos/pq-comun.html', 'equipos/iq-autoclave.html', 'equipos/iq-tunel-despirogenizacion.html', 'equipos/iq-liofilizador.html', 'equipos/iq-reactor.html', 'equipos/iq-horno-vacio.html', 'equipos/iq-llenadora.html', 'equipos/iq-lecho-fluido.html', 'equipos/iq-tableteadora.html', 'equipos/oq-reactor.html', 'equipos/pq-reactor.html', 'equipos/oq-tableteadora.html', 'equipos/pq-tableteadora.html', 'equipos/oq-lecho-fluido.html', 'equipos/oq-autoclave.html', 'equipos/oq-mezclador.html', 'equipos/oq-horno.html', 'equipos/pq-lecho-fluido.html', 'equipos/pq-autoclave.html', 'equipos/pq-mezclador.html', 'equipos/pq-horno.html', 'equipos/pq-horno-vacio.html', 'equipos/oq-horno-vacio.html'], dst: 'banco-equipos-data.js', global: 'BancoEquipos' },
  // estabilidad: banco común de cámaras ICH Q1A (sin familias por ahora).
  estabilidad: { src: ['estabilidad/iq-camaras.html', 'estabilidad/oq-camaras.html', 'estabilidad/pq-camaras.html'], dst: 'banco-estabilidad-data.js', global: 'BancoEstabilidad' },
};
const cat = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'equipos';
const ESTRICTO = process.argv.includes('--estricto');
const cfg = BANCOS[cat];
if (!cfg) { console.error('Categoría desconocida: ' + cat + ' (' + Object.keys(BANCOS).join(', ') + ')'); process.exit(1); }
const DST = join(root, 'js', 'core', cfg.dst);

const FASES = ['dq', 'iq', 'oq', 'pq'];

// Contrato de fases por archivo: un archivo "oq-*.html" debe traer section#fase-oq, etc.
// Los bancos completos (almacenes) traen las cuatro; el común de equipos solo IQ.
const FASES_ARCHIVO = { 'almacenes.html': FASES, 'equipos-comun.html': ['iq'] };
function fasesEsperadas(s) {
 if (FASES_ARCHIVO[s]) return FASES_ARCHIVO[s];
 const m = s.match(/(?:^|\/)(dq|iq|oq|pq)-[^/]+\.html$/);
 return m ? [m[1]] : FASES;
}

function text(el) {
 return (el.textContent || '').replace(/\s+/g, ' ').trim();
}

function extractTable(table) {
 const rows = [...table.querySelectorAll('tr')].map((tr) =>
 [...tr.querySelectorAll('th,td')].map((c) => text(c))
 ).filter((r) => r.length);
 if (!rows.length) return null;
 return { headers: rows[0], rows: rows.slice(1) };
}

function extractArticle(art) {
 const id = art.getAttribute('data-id') || '';
 const bloque = parseInt(art.getAttribute('data-bloque') || '3', 10);
 const cond = art.getAttribute('data-cond') || 'ambas';
 const titulo = text(art.querySelector('h3') || { textContent: id });
 const item = { kind: 'ensayo', id, bloque, cond, titulo, secciones: [], tabla: null };
 if (bloque === 4) item.kind = 'resumen';
 if (art.classList.contains('tabla-info')) item.kind = 'tabla';
 const tm = art.getAttribute('data-tabla-modelo');
 if (tm) item.tablaModelo = tm;
 const tt = art.getAttribute('data-tabla-tipo');
 if (tt) item.tablaTipo = tt;
 // data-analisis="si": el ensayo documenta un parámetro que se sustenta con
 // análisis estadístico (paso + entregable de data cruda y reporte en el banco).
 // Solo se admite "si"; cualquier otro valor es un error de redacción del banco.
 const an = art.getAttribute('data-analisis');
 if (an !== null && an !== '') {
 if (an !== 'si') throw new Error('data-analisis="' + an + '" en ' + id + ': el único valor válido es "si" (o quitar el atributo)');
 item.analisis = an;
 }
 const fam = art.getAttribute('data-familia');
 if (fam) item.familia = fam;
 art.querySelectorAll('p').forEach((p) => {
 const strong = p.querySelector('strong');
 const html = p.innerHTML.trim();
 if (strong && /:$/.test(text(strong))) {
 item.secciones.push({ et: text(strong).replace(/:$/, ''), html });
 } else if (html) {
 item.secciones.push({ et: '', html });
 }
 });
 const table = art.querySelector('table');
 if (table) item.tabla = extractTable(table);
 return item;
}

async function main() {
 const out = { version: '', fases: {} };
 const versiones = [];
 const vistos = new Map(); // id -> "archivo (FASE)"
 const pendientes = []; // campos "[ ]" sin completar
 const porDefecto = []; // valores "[n]" por defecto
 for (const s of cfg.src) {
 const SRC = join(root, 'docs', 'banco-ensayos', s);
 const html = readFileSync(SRC, 'utf-8');
 const window = new Window();
 const doc = new window.DOMParser().parseFromString(html, 'text/html');
 const stamp = doc.querySelector('[data-banco-version]');
 if (stamp) versiones.push(text(stamp));
 for (const f of fasesEsperadas(s)) {
 if (!doc.querySelector('section[id="fase-' + f + '"]')) throw new Error(s + ': falta section#fase-' + f + ' (fase esperada para este archivo)');
 }
 for (const f of FASES) {
 const sec = doc.querySelector('section[id="fase-' + f + '"]');
 if (!sec) continue; // un archivo de familia solo trae su fase
 const famSec = sec.getAttribute('data-familia') || '';
 const items = [];
 sec.querySelectorAll('[data-bloque]').forEach((el) => {
 const tag = el.tagName.toLowerCase();
 // familia del ítem o, en su defecto, de la sección (archivos por familia)
 const famItem = el.getAttribute('data-familia') || famSec || '';
 if (tag === 'article') {
 const it = extractArticle(el);
 if (famItem && !it.familia) it.familia = famItem;
 if (it.id) {
 const donde = s + ' (' + f.toUpperCase() + ')';
 if (vistos.has(it.id)) throw new Error('ID duplicado ' + it.id + ': ' + vistos.get(it.id) + ' y ' + donde);
 vistos.set(it.id, donde);
 }
 if (it.kind === 'ensayo' && (it.bloque === 2 || it.bloque === 3)) {
 const plano = it.secciones.map((x) => x.html.replace(/<[^>]+>/g, ' ')).join(' ');
 const vacios = (plano.match(/\[(?:\s|&nbsp;)*\]/g) || []).length;
 const defs = (plano.match(/\[[0-9][^\]]*\]/g) || []);
 if (vacios) pendientes.push(it.id + ' (' + vacios + ')');
 if (defs.length) porDefecto.push(it.id + ' ' + defs.join(' '));
 }
 items.push(it);
 } else if (tag === 'div') {
 const div = {
 kind: 'div',
 clase: el.getAttribute('class') || '',
 bloque: parseInt(el.getAttribute('data-bloque') || '1', 10),
 html: el.innerHTML.trim(),
 };
 const fam = el.getAttribute('data-familia') || famSec;
 if (fam) div.familia = fam;
 items.push(div);
 }
 });
 out.fases[f.toUpperCase()] = (out.fases[f.toUpperCase()] || []).concat(items);
 }
 await window.close();
 }
 if (pendientes.length) {
 const msg = 'Campos "[ ]" sin completar en ' + pendientes.length + ' ensayos: ' + pendientes.join(', ');
 if (ESTRICTO) throw new Error(msg);
 console.warn('AVISO: ' + msg);
 }
 if (porDefecto.length) console.log('Valores por defecto "[n]" (revisar contra la URS): ' + porDefecto.length + ' ensayos');
 out.version = versiones.join(' + ') || 'sin-version';
 const total = Object.values(out.fases).flat().filter((i) => i.kind === 'ensayo' || i.kind === 'resumen' || i.kind === 'tabla').length;
 const js = '// Generado por scripts/extraer-banco.mjs ' + cat + ' — NO EDITAR A MANO.\n'
 + '// Fuente: docs/banco-ensayos/' + cfg.src.join(' + docs/banco-ensayos/') + ' (versión: ' + out.version + ').\n'
 + 'var ' + cfg.global + ' = ' + JSON.stringify(out, null, 1) + ';\n'
 + 'if (typeof module !== "undefined" && module.exports) module.exports = ' + cfg.global + ';\n';
 writeFileSync(DST, js);
 console.log('OK: ' + DST + ' · ' + total + ' artículos · ' + vistos.size + ' IDs únicos · versión ' + out.version);
}

main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
