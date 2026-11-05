#!/usr/bin/env node
// Valida la estructura mínima de los protocolos OQ/PQ de las familias prioritarias.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dir = join(root, 'docs', 'banco-ensayos', 'equipos');
const familias = [
  'tableteadora', 'encapsuladora', 'granulador', 'recubridora', 'blistera',
  'detector-metales', 'etiquetadora', 'reactor', 'sistema-cremas-vacio',
];
const fases = ['oq', 'pq'];
const errors = [];
const warnings = [];

for (const fase of fases) {
  for (const fam of familias) {
    const file = join(dir, `${fase}-${fam}.html`);
    if (!existsSync(file)) {
      errors.push(`${fase}-${fam}.html: no existe`);
      continue;
    }
    const html = readFileSync(file, 'utf8');
    const tiene6 = /data-bloque="6"/.test(html);
    const tiene8 = /data-bloque="8"/.test(html);
    const usp1058 = /USP\s*(?:&lt;|<)\s*1058/i.test(html);
    if (!tiene6) errors.push(`${fase}-${fam}: falta bloque 6 (referencias)`);
    if (!tiene8) errors.push(`${fase}-${fam}: falta bloque 8 (anexos)`);
    if (usp1058) errors.push(`${fase}-${fam}: cita USP <1058> en maquinaria de producción`);
    if (html.includes('PENDIENTE DEL RESPONSABLE')) warnings.push(`${fase}-${fam}: referencia específica pendiente del responsable`);
    if (tiene8) {
      for (const letra of ['Anexo A', 'Anexo B', 'Anexo C', 'Anexo D']) {
        if (!html.includes(letra)) warnings.push(`${fase}-${fam}: falta ${letra}`);
      }
    }
  }
}

console.log('protocolo:check');
console.log(`  familias: ${familias.length} × ${fases.length} documentos`);
for (const w of warnings) console.log(`  ⚠️  ${w}`);
for (const e of errors) console.log(`  ❌ ${e}`);
if (errors.length) {
  console.error(`\nprotocolo:check FALLÓ (${errors.length} error${errors.length === 1 ? '' : 'es'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}).`);
  process.exit(1);
}
console.log(`\n✅ protocolo:check OK (${warnings.length} warning${warnings.length === 1 ? '' : 's'}).`);
