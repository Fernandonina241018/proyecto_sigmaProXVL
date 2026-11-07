// Manifiesto de respaldo (fallback). La vista de Validaciones calcula los
// conteos en runtime desde banco-almacenes/equipos/estabilidad/sistemas.
// Este archivo solo se usa si los bancos no están cargados (tests o caché vieja).
const ValidacionesManifest = {
  "total": 1230,
  "fases": {
    "DQ": 1,
    "IQ": 174,
    "OQ": 604,
    "PQ": 451
  },
  "categorias": {
    "almacenes": 27,
    "equipos": 902,
    "estabilidad": 40,
    "sistemas": 261
  },
  "_nota": "Fallback al 2026-11-07; manifest() calcula en runtime desde los bancos."
};
