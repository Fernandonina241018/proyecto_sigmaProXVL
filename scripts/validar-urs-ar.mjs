#!/usr/bin/env node
// Valida el par URS/AR de cada sistema: existencia, mapa de complementariedad,
// dependencias declaradas y resolubles, trazabilidad con protocolos y firmas.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const base = join(process.cwd(), 'docs', 'banco-ensayos', 'sistemas');
const sistemas = ['hvac', 'agua-purificada', 'vapor-limpio', 'aire-comprimido'];
const fases = ['iq', 'oq', 'pq'];
const rolesEsperados = ['autor', 'proceso', 'calidad', 'aprobador'];
const seccionesEsperadas = ['sec-3', 'sec-5', 'sec-6', 'sec-7', 'sec-8'];
const errors = [];
const warnings = [];

const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1] || '';
const rows = (html, name) =>
  [...html.matchAll(new RegExp(`<tr\\b[^>]*\\b${name}="[^"]+"[^>]*>[\\s\\S]*?<\\/tr>`, 'g'))].map((m) => m[0]);
const ids = (html, name) => rows(html, name).map((r) => attr(r, name));
const anchors = (html) => new Set([...html.matchAll(/<section\s+id="([^"]+)"/g)].map((m) => m[1]));
const tokens = (value) => value.split(/[\s;]+/).filter(Boolean);
const ENTIDADES = { nbsp: ' ', amp: '&', lt: '<', gt: '>' };
const texto = (row) => row.replace(/<[^>]+>/g, ' ')
  .replace(/&(nbsp|amp|lt|gt);/g, (_, k) => ENTIDADES[k]).replace(/\s+/g, ' ');

for (const sistema of sistemas) {
  const archivos = {
    URS: join(base, `urs-${sistema}.html`),
    AR: join(base, `ar-${sistema}.html`),
  };
  for (const [doc, file] of Object.entries(archivos)) {
    if (!existsSync(file)) {
      errors.push(`${sistema}: falta ${doc}`);
      continue;
    }
    const html = readFileSync(file, 'utf8');
    const codigo = attr((html.match(/<article[^>]*data-codigo="[^"]+"/) || [''])[0], 'data-codigo');
    if (!codigo.startsWith(`${doc}-`)) errors.push(`${sistema}/${doc}: data-codigo inválido`);
    if (attr((html.match(/<article[^>]*data-sistema="[^"]+"/) || [''])[0], 'data-sistema') !== sistema) {
      errors.push(`${sistema}/${doc}: data-sistema no coincide`);
    }
    const secs = anchors(html);
    for (let n = 1; n <= 8; n++) if (!secs.has(`sec-${n}`)) errors.push(`${sistema}/${doc}: falta §${n}`);
    const pendientes = (html.match(/PENDIENTE DE VALOR|POR EVALUAR|PENDIENTE DEL RESPONSABLE/g) || []).length;
    if (pendientes) warnings.push(`${sistema}/${doc}: ${pendientes} campos por aprobar (declarados, no vacíos)`);
    // El mapa debe cubrir los apartados que se complementan.
    const mapa = rows(html, 'data-urs').filter((r) => attr(r, 'data-ar'));
    const cubiertos = new Set(mapa.map((r) => attr(r, 'data-urs')));
    for (const sec of seccionesEsperadas) {
      if (!cubiertos.has(sec)) errors.push(`${sistema}/${doc}: mapa URS↔AR sin ${sec}`);
    }
  }
  if (errors.some((e) => e.startsWith(`${sistema}: falta`))) continue;

  const urs = readFileSync(archivos.URS, 'utf8');
  const ar = readFileSync(archivos.AR, 'utf8');
  const protocolIds = new Set();
  for (const fase of fases) {
    const file = join(base, `${fase}-${sistema}.html`);
    if (!existsSync(file)) {
      errors.push(`${sistema}: falta el protocolo ${fase}`);
      continue;
    }
    for (const m of readFileSync(file, 'utf8').matchAll(/data-id="([^"]+)"/g)) protocolIds.add(m[1]);
  }

  const reqRows = rows(urs, 'data-req');
  const riskRows = rows(ar, 'data-risk');
  const reqIds = reqRows.map((r) => attr(r, 'data-req'));
  const riskIds = riskRows.map((r) => attr(r, 'data-risk'));
  const docRefs = new Set(ids(urs, 'data-ref'));
  const duplicado = (xs) => xs.filter((x, i) => xs.indexOf(x) !== i);
  if (duplicado(reqIds).length) errors.push(`${sistema}: URS repetida ${duplicado(reqIds).join(', ')}`);
  if (duplicado(riskIds).length) errors.push(`${sistema}: AR repetido ${duplicado(riskIds).join(', ')}`);

  const verifica = new Set();
  for (const row of reqRows) {
    const id = attr(row, 'data-req');
    const depende = tokens(attr(row, 'data-depende'));
    const ver = tokens(attr(row, 'data-verifica'));
    if (!depende.length) errors.push(`${sistema}/${id}: campo Depende de vacío`);
    if (!ver.length) errors.push(`${sistema}/${id}: campo Verificación vacío`);
    for (const token of depende) {
      if (!reqIds.includes(token) && !riskIds.includes(token) && !protocolIds.has(token) && !docRefs.has(token)) {
        errors.push(`${sistema}/${id}: dependencia no declarada "${token}"`);
      }
    }
    for (const v of ver) {
      if (!protocolIds.has(v)) errors.push(`${sistema}/${id}: verificación inexistente "${v}"`);
      verifica.add(v);
    }
    // El campo con dependencia debe decirlo también en el texto visible.
    for (const token of depende) {
      if (!texto(row).includes(token)) errors.push(`${sistema}/${id}: dependencia "${token}" no visible en la tabla`);
    }
  }

  for (const row of riskRows) {
    const id = attr(row, 'data-risk');
    const req = attr(row, 'data-req');
    if (!reqIds.includes(req)) errors.push(`${sistema}/${id}: requisito URS inexistente "${req}"`);
    const ver = tokens(attr(row, 'data-verifica'));
    for (const v of ver) if (!protocolIds.has(v)) errors.push(`${sistema}/${id}: verificación inexistente "${v}"`);
    for (const token of tokens(attr(row, 'data-depende'))) {
      if (!reqIds.includes(token) && !riskIds.includes(token) && !protocolIds.has(token) && !docRefs.has(token)) {
        errors.push(`${sistema}/${id}: dependencia no declarada "${token}"`);
      }
    }
  }
  for (const req of reqIds) {
    if (!riskRows.some((r) => attr(r, 'data-req') === req)) errors.push(`${sistema}: ${req} sin fila en el AR`);
  }

  for (const [doc, html] of [['URS', urs], ['AR', ar]]) {
    const firmas = rows(html, 'data-rol');
    const roles = firmas.map((r) => attr(r, 'data-rol'));
    if (roles.length !== rolesEsperados.length || rolesEsperados.some((r) => !roles.includes(r))) {
      errors.push(`${sistema}/${doc}: flujo de firmas incompleto (${roles.join(', ') || 'vacío'})`);
    }
    const cubiertos = new Set();
    for (const row of firmas) {
      for (const token of tokens(attr(row, 'data-revisa'))) {
        if (token === 'TODOS') for (const v of verifica) cubiertos.add(v);
        else if (token.startsWith('FASE:')) {
          const fase = `-${token.slice(5)}-`;
          for (const v of verifica) if (v.includes(fase)) cubiertos.add(v);
        } else if (protocolIds.has(token)) cubiertos.add(token);
        else errors.push(`${sistema}/${doc}: alcance de revisión no resoluble "${token}"`);
      }
    }
    const sinRevisor = [...verifica].filter((v) => !cubiertos.has(v));
    if (sinRevisor.length) errors.push(`${sistema}/${doc}: ensayos sin revisor asignado ${sinRevisor.join(', ')}`);
  }
}

console.log('urs-ar:check');
console.log(`  sistemas: ${sistemas.length} × 2 documentos`);
for (const w of warnings) console.log(`  ⚠️  ${w}`);
for (const e of errors) console.log(`  ❌ ${e}`);
if (errors.length) {
  console.error(`\nurs-ar:check FALLÓ (${errors.length} error${errors.length === 1 ? '' : 'es'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}).`);
  process.exit(1);
}
console.log(`\n✅ urs-ar:check OK (${warnings.length} warning${warnings.length === 1 ? '' : 's'}).`);
