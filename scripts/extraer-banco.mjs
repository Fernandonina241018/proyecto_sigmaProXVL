// Extrae un banco de ensayos HTML a js/core/banco-<categoria>-data.js.
// Misma lógica que scripts/extraer-banco-almacenes.mjs, parametrizada por categoría,
// y además lleva al JSON `tablaModelo` (data-tabla-modelo) y `tablaTipo` (data-tabla-tipo).
// Uso: node scripts/extraer-banco.mjs equipos
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const BANCOS = {
  almacenes: { src: ['almacenes.html'], dst: 'banco-almacenes-data.js', global: 'BancoAlmacenes' },
  // equipos: banco común + un archivo por familia y fase (p. ej. OQ/PQ de lecho fluido).
  // Los artículos llevan `familia` (data-familia); ausente = común a todas.
  equipos: { src: ['equipos-comun.html', 'equipos/oq-comun.html', 'equipos/oq-lecho-fluido.html', 'equipos/oq-autoclave.html', 'equipos/pq-lecho-fluido.html'], dst: 'banco-equipos-data.js', global: 'BancoEquipos' },
};
const cat = process.argv[2] || 'equipos';
const cfg = BANCOS[cat];
if (!cfg) { console.error('Categoría desconocida: ' + cat + ' (' + Object.keys(BANCOS).join(', ') + ')'); process.exit(1); }
const DST = join(root, 'js', 'core', cfg.dst);

const FASES = ['dq', 'iq', 'oq', 'pq'];

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
  // análisis estadístico (paso + entregable de data cruda y reporte en el banco)
  const an = art.getAttribute('data-analisis');
  if (an) item.analisis = an;
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
  for (const s of cfg.src) {
    const SRC = join(root, 'docs', 'banco-ensayos', s);
    const html = readFileSync(SRC, 'utf-8');
    const window = new Window();
    const doc = new window.DOMParser().parseFromString(html, 'text/html');
    const stamp = doc.querySelector('[data-banco-version]');
    if (stamp) versiones.push(text(stamp));
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
  out.version = versiones.join(' + ') || 'sin-version';
  const total = Object.values(out.fases).flat().filter((i) => i.kind === 'ensayo' || i.kind === 'resumen' || i.kind === 'tabla').length;
  const js = '// Generado por scripts/extraer-banco.mjs ' + cat + ' — NO EDITAR A MANO.\n'
    + '// Fuente: docs/banco-ensayos/' + cfg.src.join(' + docs/banco-ensayos/') + ' (versión: ' + out.version + ').\n'
    + 'var ' + cfg.global + ' = ' + JSON.stringify(out, null, 1) + ';\n'
    + 'if (typeof module !== "undefined" && module.exports) module.exports = ' + cfg.global + ';\n';
  writeFileSync(DST, js);
  console.log('OK: ' + DST + ' · ' + total + ' artículos · versión ' + out.version);
}

main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
