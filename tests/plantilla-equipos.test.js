// Generador IQ de Equipos (banco común EQ-IQ) con formato del modelo.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { resolve } from 'path';
import { cargarBanco } from '../scripts/cargar-banco.mjs';

const require = createRequire(import.meta.url);
const raiz = resolve(new URL('..', import.meta.url).pathname).replace(/^\/@fs/, '');
const P = require('../js/core/plantilla-docx.js');
const banco = cargarBanco(process.env.BANCO || resolve(raiz, 'js/core/banco-equipos-data.js'));
const dec = (u8) => new TextDecoder().decode(u8);

const DRAFT = {
  codigo: '4001234', descripcion: 'Balanza analítica Mettler Toledo XPR205', ubicacion: 'Lab', tipo: 'Instrumento',
  marca: 'Mettler Toledo', modelo: 'XPR205', fecha: '2026-10-01',
  versionProtocolo: '02', controlCambios: 'CC-007',
};
const ENT = { id: 'balanza', nombre: 'Balanza analítica' };

describe('IQ equipos con banco común', () => {
  let r, arch;
  const prep = async () => {
    if (r) return;
    const u8 = new Uint8Array(readFileSync(resolve(raiz, P.PLANTILLAS.IQ)));
    r = await P.generar('IQ', u8, banco, DRAFT, ENT, 'ambas');
    arch = Object.fromEntries((await P._interno.leerZip(r.bytes)).map((a) => [a.nombre, dec(a.datos)]));
  };

  it('18 ensayos y requisitos EQ-IQ-001', async () => {
    await prep();
    expect(r.ensayos).toHaveLength(18);
    expect(r.requisitos).toBe('EQ-IQ-001');
    expect(r.ensayos).toContain('EQ-IQ-003');
    const doc = arch['word/document.xml'];
    for (const id of r.ensayos) expect(doc).toContain(id);
  });

  it('tablas del modelo presentes', async () => {
    await prep();
    const doc = arch['word/document.xml'].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(doc).toContain('Equipos/Instrumento');
    expect(doc).toContain('Descripción (SAP)');
    expect(doc).toContain('ALIMENTACIÓN ELÉCTRICA');
  });

  it('datos del borrador congelados y conclusión sin cortar', async () => {
    await prep();
    const doc = arch['word/document.xml'];
    const hs = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('').replace(/<[^>]+>/g, ' ');
    const hsFlat = hs.replace(/\s+/g, '');
    expect(hsFlat).toContain('IQ-4001234');
    expect(hsFlat).not.toContain('1/400AAAA');
    // Título genérico: solo descripción, nunca marca/modelo en el encabezado
    expect(hs).not.toContain('MARCA Mettler');
    expect(hs).not.toContain('MODELO XPR205');
    expect(hs).not.toContain('SIN MARCA NI MODELO');
    const hsRaw = Object.keys(arch).filter((n) => /^word\/header\d+\.xml$/.test(n)).map((n) => arch[n]).join('');
    expect(hsRaw).not.toContain('>AA<');
    expect(/>\s*02\s*</.test(hsRaw)).toBe(true);
    expect(doc).toContain('BALANZA ANALÍTICA METTLER TOLEDO XPR205');
    expect(doc).toContain('cantSplit');
    expect(doc).toContain('Creación por control de cambios #CC-007');
  });
});
