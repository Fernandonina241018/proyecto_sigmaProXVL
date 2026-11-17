#!/usr/bin/env node
// Reporta, por familia, cuántos ensayos traen el contenido mínimo del protocolo:
// objetivo, procedimiento, criterio, referencia, plan estadístico (si analiza),
// criticidad e instrumentos/prerrequisitos. Solo reporta: no bloquea la emisión.
// Uso: npm run banco:check [-- --strict] (strict sale con código 1 si algo falta).
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const B = require('../js/core/banco-equipos-data.js');
const strict = process.argv.includes('--strict');

const texto = (e) => (e.secciones || []).map((s) => s.html).join(' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const seccion = (e, prefijo) => (e.secciones || []).find((s) => s.et.startsWith(prefijo));
const pasos = (e) => {
  const s = seccion(e, 'Procedimiento');
  return s ? (s.html.match(/\d\)/g) || []).length : 0;
};
const PENDIENTE = /pendiente|por definir|por evaluar/i;

const checks = {
  objetivo: (e) => (seccion(e, 'Objetivo')?.html || '').replace(/<[^>]+>/g, '').trim().length > 40,
  procedimiento: (e) => pasos(e) >= 3,
  criterio: (e) => {
    const s = seccion(e, 'Criterio');
    return Boolean(s) && !PENDIENTE.test(s.html) && s.html.replace(/<[^>]+>/g, '').trim().length > 30;
  },
  referencia: (e) => {
    const s = seccion(e, 'Referencia');
    return Boolean(s) && !PENDIENTE.test(s.html) && s.html.replace(/<[^>]+>/g, '').trim().length > 15;
  },
  plan: (e) => e.analisis !== 'si' || Boolean(seccion(e, 'Plan estadístico')),
  criticidad: (e) => Boolean(String(e.criticidad || '').trim()),
  instrumentos: (e) => Boolean(String(e.instrumentos || '').trim()),
};

const todos = Object.entries(B.fases)
  .flatMap(([fase, xs]) => xs.map((x) => ({ ...x, fase })))
  .filter((x) => x.kind === 'ensayo' && (x.bloque === 2 || x.bloque === 3));

const porFamilia = new Map();
for (const e of todos) {
  const fam = e.familia || 'sin-familia';
  if (!porFamilia.has(fam)) porFamilia.set(fam, []);
  porFamilia.get(fam).push(e);
}

const fallas = Object.fromEntries(Object.keys(checks).map((k) => [k, 0]));
const filas = [];
for (const [fam, ensayos] of [...porFamilia].sort()) {
  const faltan = Object.fromEntries(Object.keys(checks).map((k) => [k, 0]));
  for (const e of ensayos) {
    for (const [k, fn] of Object.entries(checks)) {
      if (fn(e)) continue;
      faltan[k]++;
      fallas[k]++;
    }
  }
  const completos = ensayos.filter((e) => Object.values(checks).every((fn) => fn(e))).length;
  filas.push({ fam, total: ensayos.length, completos, faltan });
}

const pct = (n, d) => (d ? Math.round((100 * n) / d) : 0);
console.log('banco:check — contenido mínimo por ensayo (reporte, no bloquea)\n');
console.log('familia'.padEnd(26), 'ensayos', 'completos', 'objet', 'proc', 'crit', 'ref', 'plan', 'critic', 'instr');
for (const f of filas.sort((a, b) => a.completos / a.total - b.completos / b.total)) {
  console.log(
    f.fam.padEnd(26),
    String(f.total).padStart(7), String(f.completos).padStart(9),
    String(f.faltan.objetivo).padStart(5), String(f.faltan.procedimiento).padStart(4),
    String(f.faltan.criterio).padStart(4), String(f.faltan.referencia).padStart(3),
    String(f.faltan.plan).padStart(4), String(f.faltan.criticidad).padStart(6),
    String(f.faltan.instrumentos).padStart(5),
  );
}

const completos = filas.reduce((s, f) => s + f.completos, 0);
console.log(`\ntotal: ${todos.length} ensayos · ${completos} completos (${pct(completos, todos.length)} %) · ${filas.length} familias`);
for (const [k, n] of Object.entries(fallas)) {
  if (n) console.log(`  falta ${k}: ${n} (${pct(n, todos.length)} %)`);
}
const criteriosConNumero = todos.filter((e) => /\d/.test(seccion(e, 'Criterio')?.html || '')).length;
console.log(`  criterio con valor numérico: ${criteriosConNumero}/${todos.length} (${pct(criteriosConNumero, todos.length)} %)`);

if (strict && completos < todos.length) {
  console.error('\nbanco:check FALLÓ (--strict).');
  process.exit(1);
}
