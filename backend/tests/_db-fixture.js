// Store local aislado por archivo de test (hermético).
// Sin esto, `npm test` fallaba por un backend/data.json sucio (usuarios,
// auditoría y sesiones de ejecuciones anteriores). Aquí cada proceso de test
// usa su propio DB_FILE en un directorio temporal, y lo borra al salir.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

delete process.env.DATABASE_URL;

if (!process.env.DB_FILE) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'statanalyzer-test-'));
    process.env.DB_FILE = path.join(dir, 'data.json');
    process.on('exit', () => {
        try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ }
    });
}

module.exports = require('../database');
