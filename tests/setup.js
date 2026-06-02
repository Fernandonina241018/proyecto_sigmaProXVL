import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

// Load utils.js into global scope via vm.runInThisContext
// (Functions use plain function declarations, no 'use strict', so they become globals)
vm.runInThisContext(readFileSync(join(core, 'utils.js'), 'utf-8'));
vm.runInThisContext(readFileSync(join(core, 'StatsUtils.js'), 'utf-8'));
