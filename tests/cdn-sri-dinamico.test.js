// Auditoría ZAP 2026-11-18: los scripts de CDN cargados en tiempo de ejecución
// (jszip, jspdf, html2canvas) no llevaban SRI. Este chequeo impide agregar uno
// nuevo sin integrity. El SRI de indexx.html lo cubre tests/cdn-sri.test.js.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// importScripts (Web Worker) no admite integrity: única excepción documentada.
const EXENTOS = new Set(['xlsx-worker.js']);
const RE_CDN = /https:\/\/cdn\./;

describe('SRI de scripts dinámicos', () => {
  it('todo script de CDN cargado en runtime lleva SRI', () => {
    const faltan = [];
    for (const archivo of readdirSync('js/core').filter((f) => f.endsWith('.js'))) {
      if (EXENTOS.has(archivo)) continue;
      const lineas = readFileSync(join('js/core', archivo), 'utf8').split('\n');
      lineas.forEach((linea, i) => {
        if (!RE_CDN.test(linea)) return;
        // El hash puede estar en la misma línea o en la siguiente (llamada multilínea).
        if (!/sha384-/.test(linea + ' ' + (lineas[i + 1] || ''))) faltan.push(`${archivo}:${i + 1}`);
      });
    }
    expect(faltan).toEqual([]);
  });
});
