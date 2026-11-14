// DQ: scaffold desde la plantilla DQ-1-400AAAA con datos del schema.
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const P = require('../js/core/plantilla-docx.js');
const dec = (u8) => new TextDecoder().decode(u8);

const DRAFT = {
  codigo: '400999',
  descripcion: 'Autoclave de prueba',
  marca: 'COMASA',
  modelo: 'AU-500',
  ubicacion: 'PLANTA 3',
  fecha: '2026-11-02',
  versionProtocolo: '03',
  responsable: 'Ana Pérez',
};

const visible = (xml) => [...String(xml).matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join(' ');

describe('DQ scaffold desde plantilla', () => {
  let out, doc, headers, settings;

  beforeAll(async () => {
    const u8 = new Uint8Array(readFileSync(resolve(process.cwd(), 'docs/plantillas/DQ-1-400AAAA.docx')));
    out = await P.generarDQScaffold(u8, DRAFT, { id: 'autoclave', nombre: 'Autoclave' });
    const partes = await P._interno.leerZip(out.bytes);
    const get = (n) => dec(partes.find((p) => p.nombre === n).datos);
    doc = get('word/document.xml');
    headers = partes.filter((p) => /^word\/header\d+\.xml$/.test(p.nombre)).map((p) => dec(p.datos)).join(' ');
    settings = get('word/settings.xml');
  });

  it('reemplaza los datos del schema', () => {
    expect(visible(doc)).toContain('AUTOCLAVE DE PRUEBA');
    expect(visible(doc)).toContain('COMASA');
    expect(visible(doc)).toContain('AU-500');
    expect(visible(doc)).toContain('400999');
    expect(visible(doc)).toContain('PLANTA 3');
    expect(visible(headers)).toContain('02/Nov/2026');
  });

  it('no deja placeholders visibles', () => {
    expect(visible(doc)).not.toContain('NOMBRE DEL EQUIPO');
    expect(visible(doc)).not.toContain('SELECCIONA EL ÁREA');
    expect(visible(doc)).not.toContain('SIN MARCA NI MODELO');
    expect(visible(headers)).not.toContain('SIN MARCA NI MODELO');
    expect(visible(headers)).toMatch(/VERSIÓN\s*:?\s*03/);
  });

  it('cajetín: usa el Código del schema (DQ-400999, sin 1/400AAAA)', () => {
    const plano = visible(headers).replace(/\s+/g, '');
    expect(plano).toContain('DQ-400999');
    expect(plano).not.toContain('1/400AAAA');
  });

  it('no conserva referencias a la Definición USP en el índice', () => {
    expect(visible(doc)).not.toContain('Deinicion');
    expect(visible(doc)).not.toContain('DEFINICIÓN USP');
  });

  it('conserva la estructura DQ para completar después', () => {
    expect(doc).toContain('FIRMA DE APROBACIÓN');
    expect(doc).toContain('PROCEDIMIENTO DE CALIFICACIÓN');
  });

  it('el índice es un campo TOC que Word actualiza al abrir', () => {
    expect(doc).toContain('TOC \\o "1-2"');
    expect(doc).toContain('w:fldCharType="begin"');
    expect(doc).not.toContain('ACÁPITE');
    expect(settings).toContain('updateFields');
  });

  it('no incorpora contenido de almacén', () => {
    expect(visible(doc).toLowerCase()).not.toContain('almacén');
  });

  it('produce un DOCX válido', () => {
    expect(out.bytes.length).toBeGreaterThan(1000);
    expect(out.avisos[0]).toContain('documento base');
  });
});
