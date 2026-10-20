// Vista admin "Todas" de la bandeja de firmas (Paso 5 plan control reportes).
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

function loadBandHarness(role, sessions) {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML =
    '<div id="firmaTabs">' +
    '<button class="firma-tab" data-scope="pending"></button>' +
    '<button class="firma-tab" data-scope="mine"></button>' +
    '<button class="firma-tab" data-scope="cargado"></button>' +
    '<button class="firma-tab" data-scope="all" style="display:none"></button>' +
    '</div>' +
    '<div id="firmaBandejaList"></div>' +
    '<span id="firmaPendingBadge"></span>';
  const sandbox = {
    console, window, document,
    DOMParser: window.DOMParser,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    showToast: () => {},
    escapeHtml: (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    fetchWithTimeout: async (url) => {
      if (String(url).includes('scope=all')) return { json: async () => ({ ok: true, sessions }) };
      if (String(url).includes('count=1')) return { json: async () => ({ ok: true, count: 0 }) };
      throw new Error('offline:' + url);
    },
    Auth: { getToken: () => 't', getSession: () => ({ username: 'admin1', role }) },
    API_URL: 'http://x',
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(core, 'indexx-firma.js'), 'utf-8'), sandbox);
  return { sandbox, document };
}

describe('vista admin "Todas" de la bandeja', () => {
  test('la tab 🗂 solo se muestra para admin', () => {
    const admin = loadBandHarness('admin', []);
    vm.runInContext('initFirmarReportePage(); firmaStopPolling();', admin.sandbox);
    expect(admin.document.querySelector('#firmaTabs .firma-tab[data-scope="all"]').style.display).toBe('');
    const analista = loadBandHarness('analista', []);
    vm.runInContext('initFirmarReportePage(); firmaStopPolling();', analista.sandbox);
    expect(analista.document.querySelector('#firmaTabs .firma-tab[data-scope="all"]').style.display).toBe('none');
  });

  test('lista todo: dueño, canceladas etiquetadas y 🗑 para abiertas ajenas', async () => {
    const sessions = [
      { id: 21, name: 'RPT-A', status: 'partial', signed_count: 1, next_role: 'reviewed', created_by: 'ana', assigned_reviewer: 'beto' },
      { id: 20, name: 'RPT-B', status: 'complete', signed_count: 3, created_by: 'beto' },
      { id: 19, name: 'RPT-C', status: 'deleted', signed_count: 1, created_by: 'ana', deleted_reason: 'Cancelada por cupo (10 en firma)' },
    ];
    const { sandbox, document } = loadBandHarness('admin', sessions);
    await vm.runInContext('firmaLoadBandeja("all")', sandbox);
    const html = document.getElementById('firmaBandejaList').innerHTML;
    expect(html).toMatch('de ana');
    expect(html).toMatch('Cancelada');
    expect(html).toMatch('data-del="21"');            // abierta ajena: admin puede eliminar
    expect(html).toMatch('data-del-complete="20"');   // completa: con descarga previa
    expect(html).not.toMatch('data-del="19"');        // cancelada: sin botón de eliminar
  });
});
