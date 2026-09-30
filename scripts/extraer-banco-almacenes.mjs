// Extrae el banco de Almacenes (docs/banco-ensayos/almacenes.html) a
// js/core/banco-almacenes-data.js (global BancoAlmacenes).
// Congela la versión del banco usada por el generador .docx.
// Uso: node scripts/extraer-banco-almacenes.mjs
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SRC = join(root, 'docs', 'banco-ensayos', 'almacenes.html');
const DST = join(root, 'js', 'core', 'banco-almacenes-data.js');

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
  // Secciones etiquetadas: <p><strong>Etiqueta:</strong>...contenido...</p>
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
      // Solo hijos directos del flujo de la fase (evita anidados)
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
  const js = '// Generado por scripts/extraer-banco-almacenes.mjs — NO EDITAR A MANO.\n'
    + '// Fuente: docs/banco-ensayos/almacenes.html (versión: ' + out.version + ').\n'
    + 'var BancoAlmacenes = ' + JSON.stringify(out, null, 1) + ';\n'
    + 'if (typeof module !== "undefined" && module.exports) module.exports = BancoAlmacenes;\n';
  writeFileSync(DST, js);
  console.log('OK: ' + DST + ' · ' + total + ' artículos · versión ' + out.version);
}

main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
