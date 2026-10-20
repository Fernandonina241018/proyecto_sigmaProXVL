#!/usr/bin/env node
// Preflight — la MISMA batería que corre en CI, para ejecutar ANTES de
// `git push`. Si algo va a romper, que se entere aquí y no en producción.
//
// Uso:  npm run preflight
//
// Por qué existe: un bug del frontend llegó a producción porque
// deploy.yml solo gateaba backend y ML. Este script replica el gate local.

import { spawn } from 'child_process';
import { rmSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const STEPS = [
  {
    name: 'Frontend unit (vitest)',
    cmd: 'npm',
    args: ['test'],
  },
  {
    name: 'Backend (node --test)',
    cmd: 'npm',
    args: ['test', '--prefix', 'backend'],
    // El store local persiste entre corridas: hay que partir limpio.
    before: () => rmSync(join(ROOT, 'backend/data.json'), { force: true }),
  },
  {
    name: 'E2E (playwright)',
    cmd: 'npx',
    args: ['playwright', 'test'],
    before: () => rmSync(join(ROOT, 'backend/data.json'), { force: true }),
  },
];

function run(step) {
  return new Promise((resolve, reject) => {
    if (step.before) step.before();
    console.log('\n──────────────────────────────────────────');
    console.log(`▶ ${step.name}`);
    console.log('──────────────────────────────────────────');
    const child = spawn(step.cmd, step.args, {
      cwd: ROOT,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${step.name} falló (código ${code})`));
    });
  });
}

try {
  for (const step of STEPS) await run(step);
  console.log('\n✅ Preflight OK — listo para push.');
} catch (err) {
  console.error('\n❌ Preflight FALLÓ: ' + err.message);
  console.error('   NO hagas push hasta corregirlo.');
  process.exit(1);
}
