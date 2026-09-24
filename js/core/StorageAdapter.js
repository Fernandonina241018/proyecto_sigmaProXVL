var StorageAdapter = (function() {
  var DB_NAME = 'SigmaProDB';
  var STORE_NAME = 'appState';
  var DB_VERSION = 1;
  var _db = null;

  function isAvailable() {
    return typeof indexedDB !== 'undefined';
  }

  function openDB() {
    return new Promise(function(resolve, reject) {
      if (_db) { resolve(_db); return; }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function(e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      req.onsuccess = function(e) {
        _db = e.target.result;
        resolve(_db);
      };
      req.onerror = function(e) {
        reject(e.target.error);
      };
    });
  }

  function migrateFromLocalStorage() {
    var data = localStorage.getItem('statAnalyzerState');
    if (data) {
      return setItem(scopedKey('statAnalyzerState'), data).then(function() {
        localStorage.removeItem('statAnalyzerState');
      });
    }
    return Promise.resolve();
  }

  // Clave efectiva según el usuario en sesión (aislamiento por cuenta).
  // Sin sesión o sin StorageScope: clave legacy (conducta previa).
  function scopedKey(base) {
    try {
      if (typeof StorageScope !== 'undefined' && StorageScope) return StorageScope.key(base);
    } catch (e) {}
    return base;
  }

  // Lectura con siembra: si el espacio del usuario está vacío y existe
  // valor legacy, se copia una vez al espacio propio.
  function getItemMigrated(base) {
    var sk = scopedKey(base);
    return getItem(sk).then(function(v) {
      if (v !== null && v !== undefined) return v;
      if (sk === base) return v;
      return getItem(base).then(function(legacy) {
        if (legacy === null || legacy === undefined) return legacy;
        return setItem(sk, legacy).then(function() { return legacy; });
      });
    });
  }

  function setItemScoped(base, value) {
    return setItem(scopedKey(base), value);
  }

  function removeItemScoped(base) {
    return removeItem(scopedKey(base));
  }

  function setItem(key, value) {
    if (!isAvailable()) {
      try { localStorage.setItem(key, value); } catch(e) {}
      return Promise.resolve();
    }
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        store.put({ key: key, value: value });
        tx.oncomplete = function() { resolve(); };
        tx.onerror = function(e) { reject(e.target.error); };
      });
    });
  }

  function getItem(key) {
    if (!isAvailable()) {
      return Promise.resolve(localStorage.getItem(key));
    }
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.get(key);
        req.onsuccess = function() {
          resolve(req.result ? req.result.value : null);
        };
        req.onerror = function(e) { reject(e.target.error); };
      });
    });
  }

  function removeItem(key) {
    if (!isAvailable()) {
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        store.delete(key);
        tx.oncomplete = function() { resolve(); };
        tx.onerror = function(e) { reject(e.target.error); };
      });
    });
  }

  function clear() {
    if (!isAvailable()) {
      localStorage.clear();
      return Promise.resolve();
    }
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        store.clear();
        tx.oncomplete = function() { resolve(); };
        tx.onerror = function(e) { reject(e.target.error); };
      });
    });
  }

  return {
    isAvailable: isAvailable,
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem,
    clear: clear,
    migrateFromLocalStorage: migrateFromLocalStorage,
    scopedKey: scopedKey,
    getItemMigrated: getItemMigrated,
    setItemScoped: setItemScoped,
    removeItemScoped: removeItemScoped
  };
})();
