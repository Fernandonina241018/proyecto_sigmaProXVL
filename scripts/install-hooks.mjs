#!/usr/bin/env node
// Instala el hook pre-push versionado en .git/hooks/.
//
// Por qué NO usamos core.hooksPath: ese ajuste replaces TODOS los hooks, y
// este repo ya tiene un pre-commit activo (react-doctor) que dejaría de
// ejecutarse. Este instalador solo añade/actualiza el pre-push.
//
// Uso:  npm run setup:hooks

import { copyFileSync, chmodSync, existsSync, mkdirSync } from 'fs';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, '.githooks', 'pre-push');
const HOOKS_DIR = join(ROOT, '.git', 'hooks');
const DEST = join(HOOKS_DIR, 'pre-push');

if (!existsSync(SRC)) {
  console.error('❌ No existe ' + SRC + ' — ¿estás en la raíz del repo?');
  process.exit(1);
}

try {
  mkdirSync(HOOKS_DIR, { recursive: true });
} catch (e) {
  console.error('❌ No se pudo crear ' + HOOKS_DIR + ': ' + e.message);
  process.exit(1);
}

try {
  copyFileSync(SRC, DEST);
  chmodSync(DEST, 0o755);
} catch (e) {
  console.error('❌ No se pudo instalar el hook: ' + e.message);
  process.exit(1);
}

console.log('✅ Hook pre-push instalado en .git/hooks/pre-push');
console.log('   · Se ejecuta antes de cada push (vitest + backend + E2E).');
console.log('   · Para saltarlo: SKIP_PREFLIGHT=1 git push');
console.log('   · El pre-commit de react-doctor NO se tocó.');

try {
  const hooksPath = execFileSync('git', ['config', '--get', 'core.hooksPath'], { cwd: ROOT })
    .toString().trim();
  if (hooksPath) {
    console.log('');
    console.log('⚠️  Tu repo tiene core.hooksPath=' + hooksPath + '.');
    console.log('   Con ese ajuste Git IGNORA .git/hooks/ y este hook no correrá.');
    console.log('   Para arreglarlo:  git config --unset core.hooksPath');
  }
} catch {
  // sin core.hooksPath → todo bien
}
