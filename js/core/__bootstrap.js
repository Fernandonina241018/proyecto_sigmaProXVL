// Bootstrap: load StatsUtils + EstadisticaDescriptiva in Node.js
const fs = require('fs');
const path = require('path');

global.window = {};

// Load StatsUtils first (dependency)
const statsCode = fs.readFileSync(path.join(__dirname, 'StatsUtils.js'), 'utf8');
eval(statsCode);
global.StatsUtils = window.StatsUtils;

if (!global.StatsUtils) {
    console.error('❌ StatsUtils failed to load');
    process.exit(1);
}
console.log('✅ StatsUtils loaded');

// Load EstadisticaDescriptiva
const edCode = fs.readFileSync(path.join(__dirname, 'EstadisticaDescriptiva.js'), 'utf8');
eval(edCode);

const ED = window.EstadisticaDescriptiva;
if (!ED) {
    console.error('❌ EstadisticaDescriptiva failed to load');
    process.exit(1);
}
console.log('✅ EstadisticaDescriptiva loaded (' + Object.keys(ED).length + ' exports)');

module.exports = { ED };
