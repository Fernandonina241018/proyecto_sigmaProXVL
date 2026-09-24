// ════════════════════════════════════════════════════════════════
// StorageScope.js — Aislamiento de datos locales por usuario
// ════════════════════════════════════════════════════════════════
// Sin este módulo, datasets/hojas, historiales, galería y modelo ML se
// guardaban en claves globales del navegador: dos cuentas en el mismo
// navegador veían y pisaban los mismos datos.
//
// Clave efectiva = base + '::' + username cuando hay sesión; si no hay
// sesión (o Auth no existe) se usa la clave legacy sin cambios, por lo
// que la conducta previa se conserva intacta.
//
// Migración: la primera lectura con sesión copia el valor legacy al
// espacio del usuario (el legacy se conserva como respaldo).
// Sin dependencias; Auth se consulta de forma perezosa (lazy).
// ════════════════════════════════════════════════════════════════

var StorageScope = (function() {
  var SEP = '::';

  // Claves que participan del aislamiento por usuario.
  var KNOWN_KEYS = [
    'sigmaPro_trabajoSheets',
    'sigmaPro_trabajoLimits',
    'sigmaPro_datosSourceType',
    'sigmaPro_datosCurrentData', // legacy (ya no se escribe; solo limpieza)
    'sigmaPro_vizGallery',
    'sigmaPro_vizGalleryMeta',
    'sigmaPro_mlStatsModel',
    'statAnalyzerState',
    'sigmaPro_analisis',
    'sigmaPro_graficos'
  ];

  // Usuario de la sesión actual o null (sin sesión / Auth ausente).
  function currentUser() {
    try {
      if (typeof Auth !== 'undefined' && Auth && typeof Auth.getSession === 'function') {
        var s = Auth.getSession();
        if (s && s.username) return String(s.username);
      }
    } catch (e) {}
    return null;
  }

  // Clave efectiva para la base dada.
  function key(base) {
    var u = currentUser();
    return u ? base + SEP + u : base;
  }

  function rawGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function rawSet(k, v) {
    try { localStorage.setItem(k, v); return true; } catch (e) { return false; }
  }
  function rawRemove(k) {
    try { localStorage.removeItem(k); } catch (e) {}
  }

  // Siembra el espacio del usuario desde legacy (una sola vez).
  // Retorna la clave efectiva.
  function migrate(base) {
    var u = currentUser();
    if (!u) return base;
    var sk = base + SEP + u;
    try {
      if (localStorage.getItem(sk) === null) {
        var legacy = localStorage.getItem(base);
        if (legacy !== null) localStorage.setItem(sk, legacy);
      }
    } catch (e) {}
    return sk;
  }

  // Lectura/escritura con migración incluida.
  function sGet(base) { return rawGet(migrate(base)); }
  function sSet(base, value) { return rawSet(migrate(base), value); }
  function sRemove(base) { rawRemove(key(base)); }

  // Borra SOLO el espacio del usuario actual (nunca el de otros ni legacy).
  function clearMine() {
    var u = currentUser();
    for (var i = 0; i < KNOWN_KEYS.length; i++) {
      rawRemove(u ? KNOWN_KEYS[i] + SEP + u : KNOWN_KEYS[i]);
    }
  }

  return {
    SEP: SEP,
    KNOWN_KEYS: KNOWN_KEYS,
    currentUser: currentUser,
    key: key,
    migrate: migrate,
    sGet: sGet,
    sSet: sSet,
    sRemove: sRemove,
    clearMine: clearMine
  };
})();
