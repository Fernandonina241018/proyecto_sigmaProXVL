import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');
const code = readFileSync(join(core, 'indexx-trabajo.js'), 'utf8');

function makeSheet() {
  return {
    name: 'Hoja1',
    headers: ['Temperatura', 'Humedad', 'Lote', 'Peso'],
    rows: [
      ['20', '40', 'A1', '10'],
      ['22', '45', 'A2', '12'],
      ['24', '50', 'A3', '14'],
      ['26', '55', 'A4', '16'],
      ['28', '60', 'A5', '18']
    ]
  };
}

// Harness mínimo: DOM del panel + stubs de las dependencias de la página.
function loadHarness() {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML =
    '<div class="left-panel datos" id="panelTrabajo">' +
    '<div id="trabajoLimitsBody"></div>' +
    '</div>';

  const persisted = [];
  const toasts = [];
  const sheet = makeSheet();

  const sandbox = {
    console,
    window,
    document,
    requestAnimationFrame: (fn) => { fn(); return 1; },
    setTimeout,
    clearTimeout,
    escapeHtml: (s) => String(s == null ? '' : s),
    showToast: (m) => { toasts.push(String(m)); },
    _persistAllData: () => { persisted.push(1); },
    getCurrentSheet: () => sheet,
    trabajoSheets: [sheet],
    trabajoActiveSheetIndex: 0,
    trabajoLimits: null,
    trabajoLimitsMode: 'global',
    EstadisticaDescriptiva: {
      calcularLimitesCuantificacion: (vals) => {
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        return { LOD: mean * 0.1, MDL: mean * 0.2, LOQ: mean * 0.3 };
      }
    }
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'indexx-trabajo.js' });

  return { sandbox, document, persisted, toasts, sheet };
}

let h;
beforeEach(() => { h = loadHarness(); });

// El modal solo tiene sentido en modo Por columna (el panel debe estar montado).
function openCol(harness) {
  harness.sandbox.renderLimitsPanel();
  harness.sandbox.setLimitsMode('col');
}

describe('Panel de Límites · sidebar', () => {
  it('renderiza estado, modo, chips LOD/MDL/LOQ y guardado', () => {
    h.sandbox.renderLimitsPanel();
    const body = h.document.getElementById('trabajoLimitsBody');
    expect(body.querySelector('#limStatus')).toBeTruthy();
    expect(body.querySelectorAll('.lim-seg').length).toBe(2);
    expect(body.querySelectorAll('.lim-chip').length).toBe(3);
    expect(body.querySelector('#limitGlobalLI')).toBeTruthy();
    expect(body.querySelector('#limitGlobalLS')).toBeTruthy();
    expect(body.querySelector('#limitGlobalLC')).toBeTruthy();
    expect(body.textContent).toContain('Sin límites definidos');
  });

  it('arranca en Global con panel de columnas oculto', () => {
    h.sandbox.renderLimitsPanel();
    expect(h.sandbox.trabajoLimitsMode).toBe('global');
    expect(h.document.getElementById('limGlobalPanel')).toBeTruthy();
    expect(h.document.getElementById('limColPanel').hidden).toBe(true);
    expect(h.document.querySelector('.lim-seg.act').textContent).toBe('Global');
  });
});

describe('Límites · modo Por columna (modal)', () => {
  it('cambia de modo, persiste y abre el modal con las columnas numéricas', () => {
    h.sandbox.renderLimitsPanel();
    h.sandbox.setLimitsMode('col');
    expect(h.sandbox.trabajoLimitsMode).toBe('independent');
    expect(h.persisted.length).toBeGreaterThan(0);

    const modal = h.document.getElementById('limModal');
    expect(modal).toBeTruthy();
    expect(modal.classList.contains('open')).toBe(true);

    const rows = h.document.querySelectorAll('#limList .lim-row');
    expect(rows.length).toBe(3); // Temperatura, Humedad, Peso (Lote es texto)
  });

  it('el buscador filtra y el filtro numérico mantiene solo numéricas', () => {
    h.sandbox.limitsOpenModal();
    h.sandbox.limitsSetQuery('hum');
    expect(h.document.querySelectorAll('#limList .lim-row').length).toBe(1);
    h.sandbox.limitsSetQuery('');
    h.sandbox.limitsSetNumeric(false);
    expect(h.document.querySelectorAll('#limList .lim-row').length).toBe(4);
    h.sandbox.limitsSetNumeric(true);
    expect(h.document.querySelectorAll('#limList .lim-row').length).toBe(3);
  });

  it('Auto min/máx rellena LI/LS con el rango real de cada columna', () => {
    openCol(h);
    h.sandbox.limitsAutoFill();
    const t = h.sandbox.trabajoLimits.cols['Temperatura'];
    expect(t.li).toBe('20');
    expect(t.ls).toBe('28');
    expect(t.lc).toBe('24');
    expect(h.document.getElementById('limStatus').classList.contains('pending')).toBe(true);
  });

  it('editar un input actualiza estado y badge sin recargar la lista', () => {
    openCol(h);
    const inp = h.document.querySelector('#limList .lim-row[data-idx="0"] [data-k="li"]');
    inp.value = '21';
    h.sandbox.limitsSetColFromInput(inp);
    expect(h.sandbox.trabajoLimits.cols['Temperatura'].li).toBe('21');
    const badge = h.document.querySelector('#limList .lim-row[data-idx="0"] .lim-badge');
    expect(badge.classList.contains('bad')).toBe(true); // límites incompletos
  });
});

describe('Límites · guardado y acciones globales', () => {
  it('guarda, persiste y marca el estado como guardado', () => {
    openCol(h);
    h.sandbox.limitsAutoFill();
    const before = h.persisted.length;
    const ok = h.sandbox.limitsSave();
    expect(ok).toBe(true);
    expect(h.persisted.length).toBeGreaterThan(before);
    expect(h.document.getElementById('limStatus').classList.contains('ok')).toBe(true);
    expect(h.document.getElementById('limStatusText').textContent).toContain('Límites guardados');
  });

  it('avisa cuando no hay límites que guardar', () => {
    h.sandbox.renderLimitsPanel();
    const ok = h.sandbox.limitsSave();
    expect(ok).toBe(false);
    const toast = h.document.getElementById('limToast');
    expect(toast.classList.contains('warn')).toBe(true);
    expect(toast.textContent).toContain('No hay límites definidos');
  });

  it('Aplicar a todas copia LI/LC/LS globales a cada columna', () => {
    h.sandbox.renderLimitsPanel();
    h.document.getElementById('limitGlobalLI').value = '5';
    h.document.getElementById('limitGlobalLC').value = '10';
    h.document.getElementById('limitGlobalLS').value = '15';
    h.sandbox.limitsGlobalInput();
    h.sandbox.limitsApplyGlobal();
    expect(h.sandbox.trabajoLimits.cols['Temperatura'].li).toBe('5');
    expect(h.sandbox.trabajoLimits.cols['Peso'].ls).toBe('15');
    expect(h.document.getElementById('limStatus').classList.contains('pending')).toBe(true);
  });

  it('Limpiar vacía los límites globales y deja el estado sin límites', () => {
    h.sandbox.renderLimitsPanel();
    h.document.getElementById('limitGlobalLI').value = '5';
    h.sandbox.limitsGlobalInput();
    h.sandbox.limitsClearGlobal();
    expect(h.sandbox.trabajoLimits.global.li).toBe('');
    expect(h.document.getElementById('limStatus').classList.contains('idle')).toBe(true);
    expect(h.document.getElementById('limStatusText').textContent).toContain('Sin límites');
  });

  it('el aviso de éxito desaparece al volver a editar', () => {
    h.sandbox.renderLimitsPanel();
    h.document.getElementById('limitGlobalLI').value = '5';
    h.sandbox.limitsGlobalInput();
    h.sandbox.limitsSave();
    expect(h.document.getElementById('limToast').classList.contains('ok')).toBe(true);
    h.document.getElementById('limitGlobalLI').value = '6';
    h.sandbox.limitsGlobalInput();
    expect(h.document.getElementById('limToast').classList.contains('show')).toBe(false);
    expect(h.document.getElementById('limStatus').classList.contains('pending')).toBe(true);
  });
});
