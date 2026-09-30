// Pruebas del generador IQ/OQ/PQ basado en plantillas (vitest).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { resolve } from 'path';
import { cargarBanco } from '../scripts/cargar-banco.mjs';

const require = createRequire(import.meta.url);
const raiz = resolve(new URL('..', import.meta.url).pathname).replace(/^\/@fs/, '');
const P = require('../js/core/plantilla-docx.js');
const banco = cargarBanco(process.env.BANCO || resolve(raiz, 'js/core/banco-almacenes-data.js'));
const dec = (u8) => new TextDecoder().decode(u8);

const DRAFT = {
  codigo: 'CF-01', descripcion: 'Cuarto frío principal', ubicacion: 'Edificio A', tipo: 'Cuarto frío',
  temperaturaMin: '2', temperaturaMax: '8', fecha: '2026-09-30',
  duracionEstudio: '72 h', intervaloRegistro: '5 min', cantidadDataLoggers: '9',
};
const ENT = { id: 'cf-01', nombre: 'Cuarto frío' };
const pasa = (c, f) => f === 'ambas' || !c || c === 'ambas' || c === f;

describe.each(['IQ', 'OQ', 'PQ'])('%s con formato del modelo', (fase) => {
  const cond = fase === 'PQ' ? 'dina' : 'ambas';
  let r, arch;
  const prep = async () => {
    if (r) return;
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS[fase])));
    r = await P.generar(fase, u8, banco, DRAFT, ENT, cond);
    arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
  };

  it('incluye todos los ensayos del banco (bloques 2-3, filtrados por condición)', async () => {
    await prep();
    const esperados = (banco.fases[fase] || [])
      .filter((i) => i.kind === 'ensayo' && i.id && (i.bloque === 2 || i.bloque === 3) && pasa(i.cond, cond)
        && !/requisitos previos/i.test(i.titulo || ''))
      .map((i) => i.id);
    expect(r.ensayos).toEqual(esperados);
    for (const id of esperados) expect(arch['word/document.xml']).toContain(id);
  });

  it('una tabla de conclusión por ensayo + resumen', async () => {
    await prep();
    expect(r.conclusiones).toBeGreaterThanOrEqual(r.ensayos.length);
  });

  it('encabezado y portada completos, sin marcadores ni HTML', async () => {
    await prep();
    const hs = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('');
    expect(hs).not.toContain('400AAAA');
    expect(hs).not.toContain('DD/MMM/AAAA');
    expect(hs).toContain('30/Sep/2026');
    const doc = arch['word/document.xml'];
    expect(doc).not.toContain('NOMBRE DEL EQUIPO');
    expect(doc).not.toMatch(/&lt;\/?(span|strong|br|li|ul)\b/);
  });

  it('ids de marcadores únicos', async () => {
    await prep();
    const ids = [...arch['word/document.xml'].matchAll(/<w:bookmarkStart[^>]*w:id="(\d+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('ajustes del usuario: firmas, encabezado, control de cambios', () => {
  const D2 = { ...DRAFT, codigo: '1000625', controlCambios: 'CC-042', versionProtocolo: '02' };
  let r, arch;
  const prep = async () => {
    if (r) return;
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    r = await P.generar('PQ', u8, banco, D2, ENT, 'ambas');
    arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
  };

  it('encabezado: PQ-1000625 sin el 1/ del medio', async () => {
    await prep();
    const hs = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('');
    const txt = hs.replace(/<[^>]+>/g, '');
    expect(txt).toContain('PQ-1000625');
    expect(txt).not.toContain('1/400AAAA');
    expect(txt).not.toContain('400AAAA');
  });

  it('historial: control de cambios en la última página', async () => {
    await prep();
    expect(arch['word/document.xml']).toContain('Creación por control de cambios #CC-042');
  });

  it('versión del grid en cajetín y en historial', async () => {
    await prep();
    const hs = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('');
    expect(hs).toContain('>02<');
    expect(hs).not.toContain('>AA<');
    const doc = arch['word/document.xml'];
    const iH = doc.indexOf('HISTORIAL DE CAMBIOS');
    expect(doc.slice(iH, iH + 4000)).toContain('>02<');
  });

  it('historial sin número: conserva texto del modelo', async () => {
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.PQ)));
    const r0 = await P.generar('PQ', u8, banco, DRAFT, ENT, 'ambas');
    const a0 = Object.fromEntries((await P._interno.leerZip(r0.bytes)).map((a) => [a.nombre, dec(a.datos)]));
    expect(a0['word/document.xml']).toContain('Creación del documento por solicitud');
    expect(a0['word/document.xml']).not.toContain('control de cambios #');
  });

  it('firmas en Tahoma 11 blindado (nada en 12)', async () => {
    await prep();
    const xml = arch['word/document.xml'];
    const seg = xml.slice(xml.indexOf('FIRMA DE APROBACIÓN'), xml.indexOf('TABLA DE CONTENIDO'));
    expect(seg.length).toBeGreaterThan(1000);
    expect(seg).not.toContain('w:val="24"');
    expect(seg).toContain('w:val="22"');
    expect(arch['word/styles.xml']).not.toMatch(/<w:docDefaults>[\s\S]*?w:val="24"/);
  });
});
