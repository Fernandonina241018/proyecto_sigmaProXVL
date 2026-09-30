// Carga js/core/banco-almacenes-data.js (script de navegador) en Node sin tocarlo.
import { readFileSync } from 'fs';
import vm from 'vm';

export function cargarBanco(ruta) {
  const code = readFileSync(ruta, 'utf8');
  const ctx = { module: { exports: {} }, exports: {}, window: {}, console };
  ctx.globalThis = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  const b = vm.runInContext(code + `
;(typeof BancoAlmacenes !== 'undefined' ? BancoAlmacenes
  : (window.BancoAlmacenes || (module.exports && module.exports.fases ? module.exports : null)))`, ctx);
  if (!b || !b.fases) throw new Error('No se encontró BancoAlmacenes.fases en ' + ruta);
  return b;
}
