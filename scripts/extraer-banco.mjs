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
  almacenes: { src: 'almacenes.html', dst: 'banco-almacenes-data.js', global: 'BancoAlmacenes' },
  equipos: { src: 'equipos-comun.html', dst: 'banco-equipos-data.js', global: 'BancoEquipos' },
};
const cat = process.argv[2] || 'equipos';
const cfg = BANCOS[cat];
if (!cfg) { console.error('Categoría desconocida: ' + cat + ' (' + Object.keys(BANCOS).join(', ') + ')'); process.exit(1); }
const SRC = join(root, 'docs', 'banco-ensayos', cfg.src);
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
  const html = readFileSync(SRC, 'utf-8');
  const window = new Window();
  const doc = new window.DOMParser().parseFromString(html, 'text/html');
  const out = { version: '', fases: {} };
  const stamp = doc.querySelector('[data-banco-version]');
  out.version = stamp ? text(stamp) : 'sin-version';
  for (const f of FASES) {
    const sec = doc.querySelector('section[id="fase-' + f + '"]');
    if (!sec) throw new Error('Falta section fase-' + f);
    const items = [];
    sec.querySelectorAll('[data-bloque]').forEach((el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'article') {
        items.push(extractArticle(el));
      } else if (tag === 'div') {
        items.push({
          kind: 'div',
          clase: el.getAttribute('class') || '',
          bloque: parseInt(el.getAttribute('data-bloque') || '1', 10),
          html: el.innerHTML.trim(),
        });
      }
    });
    out.fases[f.toUpperCase()] = items;
  }
  await window.close();
  const total = Object.values(out.fases).flat().filter((i) => i.kind === 'ensayo' || i.kind === 'resumen' || i.kind === 'tabla').length;
  const js = '// Generado por scripts/extraer-banco.mjs ' + cat + ' — NO EDITAR A MANO.\n'
    + '// Fuente: docs/banco-ensayos/' + cfg.src + ' (versión: ' + out.version + ').\n'
    + 'var ' + cfg.global + ' = ' + JSON.stringify(out, null, 1) + ';\n'
    + 'if (typeof module !== "undefined" && module.exports) module.exports = ' + cfg.global + ';\n';
  writeFileSync(DST, js);
  console.log('OK: ' + DST + ' · ' + total + ' artículos · versión ' + out.version);
}

main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
