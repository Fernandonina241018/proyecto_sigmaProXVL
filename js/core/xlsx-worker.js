// ════════════════════════════════════════════════════════════════
// xlsx-worker.js — Parseo de Excel fuera del hilo principal (OPT-4)
// Recibe: { buffer: ArrayBuffer } (clonado, NO transferido: el hilo
// principal lo conserva para el fallback síncrono).
// Responde: { ok, headers, rows, cells } | { ok:false, error }
// La transformación replica _xlsxSheetToRows() de indexx-datos.js —
// mantener paridad si cualquiera de las dos cambia.
// SheetJS pinnned a la misma versión que indexx.html (0.18.5).
// ════════════════════════════════════════════════════════════════
var XLSX_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
try {
  importScripts(XLSX_CDN);
} catch (e) {
  // importScripts falló (offline/CSP): se reporta al hilo principal vía mensaje
}

self.onmessage = function(e) {
  var payload = e.data || {};
  try {
    if (typeof XLSX === 'undefined') {
      self.postMessage({ ok: false, error: 'xlsx-unavailable' });
      return;
    }
    var wb = XLSX.read(new Uint8Array(payload.buffer), { type: 'array' });
    var ws = wb.Sheets[wb.SheetNames[0]];
    var jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (!jsonData.length) {
      self.postMessage({ ok: false, error: 'empty' });
      return;
    }
    var headers = jsonData[0].map(function(h) { return String(h || ''); });
    var rows = jsonData.slice(1)
      .filter(function(r) { return r.some(function(c) { return c !== ''; }); })
      .map(function(r) {
        return headers.map(function(_, i) { return r[i] == null ? '' : String(r[i]); });
      });
    self.postMessage({ ok: true, headers: headers, rows: rows, cells: headers.length * rows.length });
  } catch (err) {
    self.postMessage({ ok: false, error: String((err && err.message) || err) });
  }
};
