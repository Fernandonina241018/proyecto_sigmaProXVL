// Genera IQ/OQ/PQ con el formato de los modelos Word y el contenido del banco.
// Uso:  node scripts/generar-plantillas.mjs [borrador.json] [salida/]
//   borrador.json (opcional): { codigo, descripcion, ubicacion, tipo, temperaturaMin, temperaturaMax,
//   humedadMin, humedadMax, responsable, fecha, condicionEstudio, duracionEstudio,
//   intervaloRegistro, cantidadDataLoggers, usoPrevisto, marca, modelo, area }
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { createRequire } from 'module';
import { resolve } from 'path';
import { cargarBanco } from './cargar-banco.mjs';

const require = createRequire(import.meta.url);
const raiz = resolve(new URL('..', import.meta.url).pathname);
const P = require(resolve(raiz, 'js/core/plantilla-docx.js'));
const banco = cargarBanco(process.env.BANCO || resolve(raiz, 'js/core/banco-almacenes-data.js'));

const EJEMPLO = {
  codigo: 'CF-01', descripcion: 'Cuarto frío principal', ubicacion: 'Edificio A', tipo: 'Cuarto frío',
  temperaturaMin: '2', temperaturaMax: '8', responsable: '', fecha: new Date().toISOString().slice(0, 10),
  condicionEstudio: 'ambas', duracionEstudio: '72 h', intervaloRegistro: '5 min', cantidadDataLoggers: '9',
};
const draft = process.argv[2] && existsSync(process.argv[2]) ? JSON.parse(readFileSync(process.argv[2], 'utf8')) : EJEMPLO;
const salida = resolve(process.argv[3] || 'salida-protocolos');
mkdirSync(salida, { recursive: true });
const ent = { id: String(draft.codigo || 'entidad').toLowerCase(), nombre: draft.descripcion || '' };
const cond = draft.condicionEstudio || 'ambas';

for (const f of P.FASES) {
  const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS[f])));
  const r = await P.generar(f, u8, banco, draft, ent, cond);
  const out = resolve(salida, `${f}-${ent.id}.docx`);
  writeFileSync(out, r.bytes);
  console.log(`${f}: ${r.ensayos.length} ensayos (${r.ensayos.join(', ')}) · requisitos: ${r.requisitos || 'modelo'} → ${out}`);
  r.avisos.forEach((a) => console.log('   · ' + a));
}
