import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

// Harness mínimo del panel .datos: solo la lógica nueva (delegación + sync).
function loadDatosHarness() {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML =
    '<div id="panelDatos">' +
    '<div class="estado" id="estado"><span class="pt"></span><span class="nom">Sin dataset</span><span class="cnt"></span></div>' +
    '<div class="drop" id="drop" role="button" tabindex="0" data-act="abrir"></div>' +
    '<input type="file" id="fileInput">' +
    '<div class="mr" role="button" tabindex="0" data-act="csv"></div>' +
    '<div class="mr" role="button" tabindex="0" data-act="json"></div>' +
    '<div class="mr" role="button" tabindex="0" data-act="excel"></div>' +
    '<div class="mr" role="button" tabindex="0" data-act="pegar"></div>' +
    '<div class="mr" role="button" tabindex="0" data-act="generar"></div>' +
    '<div class="mr" role="button" tabindex="0" data-act="ampliar"></div>' +
    '<div class="mr dis" id="filaLimpiar" role="button" tabindex="-1" data-act="limpiar"></div>' +
    '<div id="listaRec"></div>' +
    '</div>';
  const calls = [];
  const sandbox = {
    console,
    window, document,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    setTimeout, clearTimeout, setInterval, clearInterval,
    showToast: (m) => { calls.push(['toast', String(m)]); },
    escapeHtml: (s) => String(s),
    handleFile: (f) => { calls.push(['handleFile', f && f.name]); },
    showPasteModal: () => { calls.push(['pegar']); },
    generateSampleData: () => { calls.push(['generar']); },
    ampliarDatos: () => { calls.push(['ampliar']); },
    limpiarDataset: () => { calls.push(['limpiar']); },
    clearRecentFiles: () => { calls.push(['borrar-todo']); },
    showExportModal: () => {}, showFilterModal: () => {}, sendToTrabajo: () => {},
    _persistAllData: () => {},
    datosCurrentData: null,
    datosCurrentFileName: '',
    datosRecentFiles: [],
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-datos.js'), 'utf-8'), sandbox);
  return { sandbox, document, calls };
}

describe('Panel datos F1: delegación data-act', () => {
  test('filas csv/json/excel fijan el accept del selector', async () => {
    const { sandbox, document } = loadDatosHarness();
    await vm.runInContext('initDatosPage()', sandbox);
    const fi = document.getElementById('fileInput');
    document.querySelector('[data-act="csv"]').click();
    expect(fi.accept).toBe('.csv');
    document.querySelector('[data-act="json"]').click();
    expect(fi.accept).toBe('.json');
    document.querySelector('[data-act="excel"]').click();
    expect(fi.accept).toBe('.xlsx,.xls');
  });

  test('pegar abre el modal real; generar/ampliar/limpiar delegan', async () => {
    const { sandbox, document, calls } = loadDatosHarness();
    await vm.runInContext('initDatosPage()', sandbox);
    document.querySelector('[data-act="pegar"]').click();
    expect(document.getElementById('pasteTA')).not.toBeNull();
    document.querySelector('[data-act="generar"]').click();
    document.querySelector('[data-act="ampliar"]').click();
    document.querySelector('[data-act="limpiar"]').click();
    await new Promise((r) => setTimeout(r, 30));
    expect(calls).toContainEqual(['generar']);
    expect(calls).toContainEqual(['ampliar']);
    expect(calls).toContainEqual(['limpiar']);
  });

  test('drop enruta al handleFile real (rechaza extensión mala) y quita .over', async () => {
    const { sandbox, document, calls } = loadDatosHarness();
    await vm.runInContext('initDatosPage()', sandbox);
    const drop = document.getElementById('drop');
    drop.dispatchEvent(new sandbox.window.Event('dragover', { bubbles: true }));
    expect(drop.classList.contains('over')).toBe(true);
    const ev = new sandbox.window.Event('drop', { bubbles: true });
    ev.dataTransfer = { files: [{ name: 'a.xyz', size: 10 }] };
    drop.dispatchEvent(ev);
    expect(drop.classList.contains('over')).toBe(false);
    expect(calls.some((c) => c[0] === 'toast' && c[1].includes('Formato no soportado'))).toBe(true);
  });
});

describe('Panel datos F3: recientes', () => {
  const SEED = '[{"name":"a.csv","type":"CSV","size":2048,"rows":[[1]],"headers":["h"],"totalRows":100},' +
    '{"name":"b.json","type":"JSON","size":512,"rows":[],"headers":[]}]';
  async function seedHarness() {
    const h = loadDatosHarness();
    await vm.runInContext('datosRecentFiles = ' + SEED + ';', h.sandbox);
    await vm.runInContext('renderRecentFiles();', h.sandbox);
    return h;
  }
  test('renderiza filas .rr con icono, tipo y quitar', async () => {
    const { document } = await seedHarness();
    const rows = document.querySelectorAll('#listaRec .rr');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('.nm b').textContent).toBe('a.csv');
    expect(rows[0].querySelector('.tp').textContent).toBe('CSV');
    expect(rows[1].querySelector('.tp-json')).not.toBeNull();
    expect(rows[0].querySelector('[data-quitar]')).not.toBeNull();
    expect(rows[0].querySelector('use').getAttribute('href')).toBe('#i-file');
  });

  test('quitar elimina y persiste', async () => {
    const { sandbox, document } = await seedHarness();
    await vm.runInContext('initDatosPage()', sandbox);
    document.querySelector('[data-quitar="a.csv"]').click();
    const len = await vm.runInContext('datosRecentFiles.length', sandbox);
    expect(len).toBe(1);
    expect(JSON.parse(sandbox.localStorage.getItem('datosRecentFiles')).length).toBe(1);
    expect(document.querySelectorAll('#listaRec .rr').length).toBe(1);
  });

  test('clic en fila carga el reciente (marca act)', async () => {
    const { sandbox, document } = await seedHarness();
    await vm.runInContext('initDatosPage()', sandbox);
    document.querySelector('[data-load="a.csv"]').click();
    await new Promise((r) => setTimeout(r, 30));
    const cur = await vm.runInContext('datosCurrentFileName', sandbox);
    expect(cur).toBe('a.csv');
    expect(document.querySelector('#listaRec .rr.act')).not.toBeNull();
  });

  test('sin recientes muestra vacío', async () => {
    const { sandbox, document } = loadDatosHarness();
    await vm.runInContext('renderRecentFiles();', sandbox);
    expect(document.querySelector('#listaRec .vacio')).not.toBeNull();
  });
});

describe('Panel datos F1: sync de estado', () => {
  test('sin datos: apagado y limpiar deshabilitado', async () => {
    const { sandbox, document } = loadDatosHarness();
    await vm.runInContext('initDatosPage()', sandbox);
    expect(document.getElementById('estado').classList.contains('on')).toBe(false);
    expect(document.querySelector('#estado .nom').textContent).toBe('Sin dataset');
    const fila = document.getElementById('filaLimpiar');
    expect(fila.classList.contains('dis')).toBe(true);
    expect(fila.getAttribute('aria-disabled')).toBe('true');
  });

  test('con datos: encendido, nombre, conteo y limpiar habilitado', async () => {
    const { sandbox, document } = loadDatosHarness();
    await vm.runInContext(
      'datosCurrentData = { headers: ["a","b"], rows: [[1,2],[3,4],[5,6]] }; datosCurrentFileName = "x.csv";',
      sandbox,
    );
    await vm.runInContext('datosSyncPanel()', sandbox);
    expect(document.getElementById('estado').classList.contains('on')).toBe(true);
    expect(document.querySelector('#estado .nom').textContent).toBe('x.csv');
    expect(document.querySelector('#estado .cnt').textContent).toBe('3 filas · 2 col');
    const fila = document.getElementById('filaLimpiar');
    expect(fila.classList.contains('dis')).toBe(false);
    expect(fila.tabIndex).toBe(0);
  });
});
