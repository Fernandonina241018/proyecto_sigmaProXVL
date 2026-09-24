// Aislamiento de datos locales por usuario (StorageScope).
// Sin sesión: claves legacy (conducta previa). Con sesión: base::username
// con siembra desde legacy. Limpieza solo del espacio propio.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

// La suite corre en entorno node (sin happy-dom): stub de localStorage.
const _memStore = new Map();
globalThis.localStorage = {
  getItem: (k) => (_memStore.has(String(k)) ? _memStore.get(String(k)) : null),
  setItem: (k, v) => { _memStore.set(String(k), String(v)); },
  removeItem: (k) => { _memStore.delete(String(k)); },
  clear: () => { _memStore.clear(); },
  get length() { return _memStore.size; },
  key: (i) => [..._memStore.keys()][i] ?? null,
};

let _user = null;
globalThis.Auth = { getSession: () => (_user ? { username: _user } : null) };
function loginAs(u) { _user = u; }
function logout() { _user = null; }

vm.runInThisContext(readFileSync(join(core, 'StorageScope.js'), 'utf-8') + ';globalThis.__SS=StorageScope;');
vm.runInThisContext('var updateAnalisisDatasetBadge=function(){}; function showToast(){};');
vm.runInThisContext(readFileSync(join(core, 'indexx-globals.js'), 'utf-8'));
vm.runInThisContext(readFileSync(join(core, 'StorageAdapter.js'), 'utf-8') + ';globalThis.__SA=StorageAdapter;');

const SS = globalThis.__SS;
const SA = globalThis.__SA;

beforeEach(() => {
  localStorage.clear();
  logout();
});

describe('StorageScope.key', () => {
  test('sin sesión usa clave legacy', () => {
    expect(SS.key('sigmaPro_trabajoSheets')).toBe('sigmaPro_trabajoSheets');
    expect(SS.currentUser()).toBe(null);
  });
  test('con sesión usa base::username', () => {
    loginAs('ana');
    expect(SS.key('sigmaPro_trabajoSheets')).toBe('sigmaPro_trabajoSheets::ana');
    expect(SS.currentUser()).toBe('ana');
  });
});

describe('aislamiento por usuario', () => {
  test('ana y beto no se ven ni se pisan', () => {
    loginAs('ana');
    SS.sSet('sigmaPro_trabajoSheets', 'HOJAS-ANA');
    loginAs('beto');
    expect(SS.sGet('sigmaPro_trabajoSheets')).toBe(null);
    SS.sSet('sigmaPro_trabajoSheets', 'HOJAS-BETO');
    loginAs('ana');
    expect(SS.sGet('sigmaPro_trabajoSheets')).toBe('HOJAS-ANA');
    expect(localStorage.getItem('sigmaPro_trabajoSheets::beto')).toBe('HOJAS-BETO');
  });
  test('migración: primer acceso siembra desde legacy y lo preserva', () => {
    localStorage.setItem('sigmaPro_trabajoSheets', 'LEGACY');
    loginAs('ana');
    expect(SS.sGet('sigmaPro_trabajoSheets')).toBe('LEGACY');
    expect(localStorage.getItem('sigmaPro_trabajoSheets::ana')).toBe('LEGACY');
    expect(localStorage.getItem('sigmaPro_trabajoSheets')).toBe('LEGACY');
    // Escrituras posteriores van al espacio propio, legacy intacto
    SS.sSet('sigmaPro_trabajoSheets', 'ANA-NEW');
    expect(localStorage.getItem('sigmaPro_trabajoSheets')).toBe('LEGACY');
  });
  test('clearMine borra solo el espacio propio', () => {
    localStorage.setItem('sigmaPro_trabajoSheets', 'LEGACY');
    loginAs('ana'); SS.sSet('sigmaPro_trabajoSheets', 'A');
    loginAs('beto'); SS.sSet('sigmaPro_trabajoSheets', 'B');
    loginAs('ana'); SS.clearMine();
    expect(SS.sGet('sigmaPro_trabajoSheets')).toBe('LEGACY'); // re-siembra desde legacy
    expect(localStorage.getItem('sigmaPro_trabajoSheets::beto')).toBe('B');
    expect(localStorage.getItem('sigmaPro_trabajoSheets')).toBe('LEGACY');
  });
});

describe('_restoreAllData / reset por usuario', () => {
  const sheetsJSON = JSON.stringify([{ name: 'H-ANA', headers: ['A'], rows: [['1']], locked: false }]);
  test('restore carga el espacio del usuario en sesión', () => {
    localStorage.setItem('sigmaPro_trabajoSheets::ana', sheetsJSON);
    localStorage.setItem('sigmaPro_trabajoSheets', JSON.stringify([{ name: 'LEG', headers: ['A'], rows: [['0']], locked: false }]));
    loginAs('ana');
    _restoreAllData();
    expect(globalThis.trabajoSheets[0].name).toBe('H-ANA');
    loginAs('beto');
    _restoreAllData();
    expect(globalThis.trabajoSheets[0].name).toBe('LEG'); // beto siembra desde legacy
  });
  test('resetTrabajoMemoryToDefault vuelve a Hoja1 vacía sin tocar storage', () => {
    loginAs('ana');
    SS.sSet('sigmaPro_trabajoSheets', sheetsJSON);
    globalThis.trabajoSheets = [{ name: 'SUCIA', headers: ['X'], rows: [['9']], locked: false }];
    resetTrabajoMemoryToDefault();
    expect(globalThis.trabajoSheets).toHaveLength(1);
    expect(globalThis.trabajoSheets[0].name).toBe('Hoja1');
    expect(globalThis.trabajoSheets[0].rows).toHaveLength(20);
    expect(globalThis.trabajoActiveSheetIndex).toBe(0);
    expect(globalThis.datosSourceType).toBe('none');
    // Storage intacto
    expect(SS.sGet('sigmaPro_trabajoSheets')).toBe(sheetsJSON);
  });
  test('_persistAllData escribe al espacio del usuario', () => {
    loginAs('ana');
    globalThis.trabajoSheets = [{ name: 'P-ANA', headers: ['A'], rows: [['7']], locked: false }];
    _persistAllData();
    expect(localStorage.getItem('sigmaPro_trabajoSheets::ana')).toContain('P-ANA');
    expect(localStorage.getItem('sigmaPro_trabajoSheets')).toBe(null);
  });
});

describe('StorageAdapter scoping (IndexedDB con fallback localStorage)', () => {
  test('getItemMigrated siembra y setItemScoped aísla', async () => {
    localStorage.setItem('sigmaPro_analisis', '["LEG"]');
    loginAs('ana');
    expect(await SA.getItemMigrated('sigmaPro_analisis')).toBe('["LEG"]');
    expect(localStorage.getItem('sigmaPro_analisis::ana')).toBe('["LEG"]');
    await SA.setItemScoped('sigmaPro_analisis', '["ANA"]');
    loginAs('beto');
    expect(await SA.getItemMigrated('sigmaPro_analisis')).toBe('["LEG"]');
    loginAs('ana');
    expect(await SA.getItemMigrated('sigmaPro_analisis')).toBe('["ANA"]');
  });
  test('scopedKey sin sesión es legacy', () => {
    expect(SA.scopedKey('sigmaPro_graficos')).toBe('sigmaPro_graficos');
  });
});
