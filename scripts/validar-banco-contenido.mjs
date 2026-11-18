#!/usr/bin/env node
// Reporta, por banco y familia, cuántos ensayos traen el contenido mínimo del
// protocolo: objetivo, procedimiento, criterio, referencia, plan estadístico
// (si analiza), criticidad e instrumentos/prerrequisitos.
// Solo reporta: no bloquea la emisión. Uso: npm run banco:check [-- --strict]
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const BANCOS = [
  ['equipos', require('../js/core/banco-equipos-data.js')],
  ['sistemas', require('../js/core/banco-sistemas-data.js')],
  ['almacenes', require('../js/core/banco-almacenes-data.js')],
  ['estabilidad', require('../js/core/banco-estabilidad-data.js')],
];
const strict = process.argv.includes('--strict');

// Sin regex de etiquetas: CodeQL marca el strip con `[^>]+` como sanitización
// incompleta, y aquí no se sanitiza nada (el HTML es del repo, no del usuario).
function textoPlano(html) {
  let out = '';
  for (let i = 0; i < html.length;) {
    const abre = html.indexOf('<', i);
    if (abre < 0) { out += html.slice(i); break; }
    out += html.slice(i, abre);
    const cierra = html.indexOf('>', abre);
    if (cierra < 0) break;
    i = cierra + 1;
  }
  return out;
}
const seccion = (e, prefijo) => (e.secciones || []).find((s) => s.et.startsWith(prefijo));
const cuerpo = (e, prefijo) => textoPlano(seccion(e, prefijo)?.html || '').trim();
const PENDIENTE = /pendiente|por definir|por evaluar/i;

const checks = {
  objetivo: (e) => cuerpo(e, 'Objetivo').length > 40,
  // La sección existe o no: el número de pasos no mide calidad del procedimiento.
  procedimiento: (e) => cuerpo(e, 'Procedimiento').length > 30,
  criterio: (e) => cuerpo(e, 'Criterio').length > 30 && !PENDIENTE.test(cuerpo(e, 'Criterio')),
  referencia: (e) => cuerpo(e, 'Referencia').length > 8 && !PENDIENTE.test(cuerpo(e, 'Referencia')),
  entregables: (e) => cuerpo(e, 'Documentos entregables').length > 10,
  plan: (e) => e.analisis !== 'si' || cuerpo(e, 'Plan estadístico').length > 30,
  criticidad: (e) => Boolean(String(e.criticidad || '').trim()),
  instrumentos: (e) => Boolean(String(e.instrumentos || '').trim()),
};

const pct = (n, d) => (d ? Math.round((100 * n) / d) : 0);
const filas = [];
const fallas = Object.fromEntries(Object.keys(checks).map((k) => [k, 0]));
let total = 0;
let completos = 0;
let conNumero = 0;
const criterios = [];

for (const [banco, B] of BANCOS) {
  const ensayos = Object.entries(B.fases || {})
    .flatMap(([fase, xs]) => xs.map((x) => ({ ...x, fase })))
    .filter((x) => x.kind === 'ensayo' && (x.bloque === 2 || x.bloque === 3));
  const grupos = new Map();
  for (const e of ensayos) {
    const fam = `${banco}/${e.familia || e.fase}`;
    if (!grupos.has(fam)) grupos.set(fam, []);
    grupos.get(fam).push(e);
  }
  for (const [fam, xs] of grupos) {
    const faltan = Object.fromEntries(Object.keys(checks).map((k) => [k, 0]));
    for (const e of xs) {
      for (const [k, fn] of Object.entries(checks)) if (!fn(e)) { faltan[k]++; fallas[k]++; }
    }
    const ok = xs.filter((e) => Object.values(checks).every((fn) => fn(e))).length;
    completos += ok;
    total += xs.length;
    conNumero += xs.filter((e) => /\d/.test(cuerpo(e, 'Criterio'))).length;
    for (const e of xs) criterios.push({ id: e.id, fam, texto: cuerpo(e, 'Criterio').toLowerCase().replace(/\s+/g, ' ') });
    filas.push({ fam, total: xs.length, completos: ok, faltan });
  }
}

console.log('banco:check — contenido mínimo por ensayo (reporte, no bloquea)\n');
console.log('familia'.padEnd(30), 'ensayos', 'completos', 'objet', 'proc', 'crit', 'ref', 'entr', 'plan', 'critic', 'instr');
for (const f of filas.sort((a, b) => a.completos / a.total - b.completos / b.total)) {
  console.log(
    f.fam.padEnd(30),
    String(f.total).padStart(7), String(f.completos).padStart(9),
    String(f.faltan.objetivo).padStart(5), String(f.faltan.procedimiento).padStart(4),
    String(f.faltan.criterio).padStart(4), String(f.faltan.referencia).padStart(3),
    String(f.faltan.entregables).padStart(4),
    String(f.faltan.plan).padStart(4), String(f.faltan.criticidad).padStart(6),
    String(f.faltan.instrumentos).padStart(5),
  );
}
console.log(`\ntotal: ${total} ensayos · ${completos} completos (${pct(completos, total)} %) · ${filas.length} grupos`);
for (const [k, n] of Object.entries(fallas)) if (n) console.log(`  falta ${k}: ${n} (${pct(n, total)} %)`);
console.log(`  criterio con valor numérico: ${conNumero}/${total} (${pct(conNumero, total)} %)`);

// El esqueleto se comparte; el criterio debe ser de cada ensayo.
const grupos = new Map();
for (const c of criterios) {
  if (!grupos.has(c.texto)) grupos.set(c.texto, []);
  grupos.get(c.texto).push(c);
}
const clonados = [...grupos.values()].filter((g) => g.length > 1).sort((a, b) => b.length - a.length);
const afectados = clonados.reduce((s, g) => s + g.length, 0);
console.log(`  criterio clonado: ${afectados} ensayos en ${clonados.length} grupos`);
for (const g of clonados.slice(0, 3)) {
  console.log(`    ${g.length}x ${g.slice(0, 4).map((c) => c.id).join(', ')}${g.length > 4 ? ' …' : ''} — ${g[0].texto.slice(0, 60)}`);
}

if (!total) {
  console.error('\nbanco:check FALLÓ: no se encontraron ensayos (¿cambió la forma de los bancos?).');
  process.exit(1);
}

if (strict && completos < total) {
  console.error('\nbanco:check FALLÓ (--strict).');
  process.exit(1);
}
