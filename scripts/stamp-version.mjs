#!/usr/bin/env node
// Sella version.json + <meta name="build-revision"> con una versión única
// por despliegue. Lo usa el workflow .github/workflows/version.yml en cada
// push a main y también se puede correr a mano antes de un despliegue:
//
//   npm run version:stamp            # usa el SHA corto de HEAD
//   npm run version:stamp -- <sha>   # usa el SHA indicado (CI)
//
// Por qué: el cargador de indexx.html pide los JS/CSS con `?v=<versión>`.
// Con una versión estable dentro del mismo despliegue, el navegador cachea
// los ~4 MB y la segunda carga es casi instantánea; al desplegar cambia la
// versión y se descarga lo nuevo sin esperar al caché de 10 min de Pages.

import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VERSION_FILE = join(ROOT, 'version.json');
const HTML_FILE = join(ROOT, 'indexx.html');

function gitSha() {
  try {
    return execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { cwd: ROOT })
      .toString().trim();
  } catch (e) {
    return '';
  }
}

const arg = process.argv[2];
const sha = String(arg || gitSha() || '').trim();
if (!/^[0-9a-f]{7,40}$/i.test(sha)) {
  console.error('❌ SHA inválido: "' + sha + '" (se esperaba 7-40 hex).');
  process.exit(1);
}

const version = { v: sha.toLowerCase(), t: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z') };

try {
  writeFileSync(VERSION_FILE, JSON.stringify(version), 'utf-8');
  console.log('✅ version.json → ' + version.v + ' (' + version.t + ')');
} catch (e) {
  console.error('❌ No se pudo escribir version.json: ' + e.message);
  process.exit(1);
}

// El meta es informativo (trazabilidad de la build en el HTML). Si no está,
// no es un error: el versionado real es version.json.
try {
  const html = readFileSync(HTML_FILE, 'utf-8');
  const next = html.replace(
    /<meta name="build-revision" content="[^"]*">/,
    '<meta name="build-revision" content="' + version.v + '">'
  );
  if (next !== html) {
    writeFileSync(HTML_FILE, next, 'utf-8');
    console.log('✅ indexx.html → build-revision ' + version.v);
  }
} catch (e) {
  console.warn('⚠️  No se pudo actualizar build-revision: ' + e.message);
}
