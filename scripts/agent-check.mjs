#!/usr/bin/env node
// agent-check.mjs — valida el contrato del comando /prompt y sus recursos.
//
// No bloquea tests de la app: se ejecuta con `npm run agent:check`.
// Falla solo por errores estructurales; las ausencias recuperables son warnings.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];

const commandPath = join(root, '.opencode/commands/prompt.md');
if (!existsSync(commandPath)) {
  console.error('❌ Falta .opencode/commands/prompt.md');
  process.exit(1);
}
const command = readFileSync(commandPath, 'utf8');

// ── Versión: frontmatter vs cuerpo ─────────────────────────────
const fmVersion = command.match(/^---\r?\n[\s\S]*?\nversion:\s*([^\r\n]+)/);
const bodyVersion = command.match(/COMMAND_VERSION\s*=\s*"([^"]+)"/);
if (!fmVersion || !bodyVersion) {
  errors.push('No se pudo leer la versión del comando (frontmatter o COMMAND_VERSION).');
} else if (fmVersion[1].trim() !== bodyVersion[1].trim()) {
  errors.push(`Versión inconsistente: frontmatter ${fmVersion[1].trim()} vs cuerpo ${bodyVersion[1].trim()}.`);
}

// ── Brain2: cadena de fallback ─────────────────────────────────
const brainCandidates = [
  process.env.SIGMA_BRAIN2,
  './Brain/Brain2',
  '/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/Brain/Brain2',
].filter(Boolean);
const brainRoot = brainCandidates.map((p) => resolve(root, p)).find((p) => existsSync(p));
if (!brainRoot) {
  warnings.push('Brain2 no encontrado; el comando operará en modo DEGRADED.');
} else {
  for (const f of ['SESION_BASE.md', '07_CONTEXTO_BASE.md']) {
    if (!existsSync(join(brainRoot, f))) warnings.push(`Brain2 sin ${f}.`);
  }
  const statsPath = join(brainRoot, '02_ESTADISTICOS.md');
  if (existsSync(statsPath)) {
    const raw = readFileSync(statsPath, 'utf8');
    const total = raw.match(/\|\s*Total\s*\|\s*(\d+)\s*\|/);
    const configPath = join(root, 'js/core/estadisticosConfig.js');
    if (total && existsSync(configPath)) {
      const keys = (readFileSync(configPath, 'utf8').match(/^    '[^']+': \{/gm) || []).length;
      if (Number(total[1]) !== keys) {
        warnings.push(`Brain2 dice ${total[1]} estadísticos; estadisticosConfig.js tiene ${keys}.`);
      }
    }
  }
}

// ── Skills: alias + archivos ───────────────────────────────────
const skillsDir = resolve(root, process.env.SIGMA_SKILLS || '.opencode/skills');
if (!existsSync(skillsDir)) {
  errors.push(`No existe el directorio de skills: ${skillsDir}`);
}

const aliases = {
  'api-design': 'api-design-principles',
  'nodejs-backend-patterns': 'backend-architect',
  'auth-security': 'api-security-best-practices',
  'web-performance': 'performance-optimizer',
  'pipeline-patterns': 'data-engineering-data-pipeline',
  'data-processing': 'data-quality-frameworks',
  'database-patterns': 'database-architect',
  'observability-patterns': 'error-diagnostics-error-analysis',
  'eval-design': 'javascript-testing-patterns',
  'containerization': 'appdeploy',
  'devops-patterns': 'appdeploy',
  'async-patterns': 'backend-architect',
  'realtime-patterns': 'backend-architect',
  'secrets-management': 'api-security-best-practices',
  'vercel-react-best-practices': 'code-review-excellence',
  'statistical-patterns': 'analista-senior-validaciones-farmaceutica',
  'frontend-design': 'code-review-excellence',
  'accessibility-patterns': 'code-review-excellence',
  'agent-patterns': 'architecture-patterns',
  'data-viz': 'performance-optimizer',
  'form-patterns': 'code-review-excellence',
  'motion-design': 'code-review-excellence',
  'prompt-optimization': 'analista-senior-validaciones-farmaceutica',
  'rag-patterns': 'data-engineering-data-pipeline',
  'state-management-patterns': 'architecture-patterns',
};

const start = command.indexOf('### 1.1.1');
const end = command.indexOf('### 1.1.2');
if (start === -1 || end === -1) {
  errors.push('No se encontró la matriz de skills (1.1.1 … 1.1.2).');
} else {
  const matrix = command.slice(start, end);
  const tokens = [...new Set([...matrix.matchAll(/\[([a-z][a-z0-9-]+)\]/g)].map((m) => m[1]))]
    .filter((t) => !['lista', 'nombre', 'skill-name'].includes(t));
  for (const token of tokens) {
    const target = aliases[token] || token;
    const file = join(skillsDir, target, 'SKILL.md');
    if (!existsSync(file)) {
      if (aliases[token]) errors.push(`Alias "${token}" → "${target}" sin SKILL.md.`);
      else warnings.push(`Skill sin archivo ni alias: "${token}".`);
    }
  }
}

// ── Portabilidad y duplicados ──────────────────────────────────
if (!command.includes('./Brain/Brain2')) errors.push('Falta el fallback ./Brain/Brain2.');
if (!command.includes('.opencode/skills/{skill}/SKILL.md')) errors.push('Falta la prioridad .opencode/skills en PATH_PRIORITY.');

const globalPrompt = join(process.env.HOME || '', '.opencode/commands/prompt.md');
if (globalPrompt && existsSync(globalPrompt)) {
  warnings.push('Existe un /prompt global duplicado; el canónico es el del proyecto.');
}

// ── Reporte ────────────────────────────────────────────────────
console.log('agent:check');
if (bodyVersion) console.log(`  comando: v${bodyVersion[1]}`);
console.log(`  Brain2:  ${brainRoot || 'no encontrado (DEGRADED)'}`);
try {
  const skills = readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, 'SKILL.md')))
    .map((d) => d.name);
  console.log(`  skills:  ${skills.length}`);
} catch { /* el error ya se registró arriba */ }
for (const w of warnings) console.log(`  ⚠️  ${w}`);
for (const e of errors) console.log(`  ❌ ${e}`);

if (errors.length) {
  console.error(`\nagent:check FALLÓ (${errors.length} error${errors.length === 1 ? '' : 'es'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}).`);
  process.exit(1);
}
console.log(`\n✅ agent:check OK${warnings.length ? ` (${warnings.length} warning${warnings.length === 1 ? '' : 's'})` : ''}.`);
