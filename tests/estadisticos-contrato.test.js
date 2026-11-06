// Contrato + integración de los 62 estadísticos del catálogo.
// Lote 3 de la auditoría: un caso por estadístico, `salidas` alineado y
// render sin caídas al genérico ("Tipo de prueba no reconocido").
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const core = join(__dirname, '..', 'js', 'core');

vm.runInThisContext(readFileSync(join(core, 'EstadisticaDescriptiva.js'), 'utf-8'));
const ED = EstadisticaDescriptiva;
const CONFIG = globalThis.ESTADISTICOS_CONFIG;

// Dataset determinista: cubre numéricas continuas, categóricas, binaria,
// tiempo/evento y curva de calibración.
let _seed = 12345;
function rnd() {
  _seed = (_seed * 1103515245 + 12345) % 2147483648;
  return _seed / 2147483648;
}
const N = 40;
const rows = [];
for (let i = 0; i < N; i++) {
  const x = i + 1;
  rows.push({
    Num1: 10 + rnd() * 5,
    Num2: 20 + rnd() * 6,
    Num3: 30 + rnd() * 7,
    X: x,
    Y: 2 * x + 3 + (rnd() - 0.5),
    Obs: 2 * x + 3,
    Pred: 2 * x + 3,
    Cat1: ['A', 'B', 'C'][i % 3],
    Cat2: ['X', 'Y'][i % 2],
    Grupo: ['G1', 'G2', 'G3', 'G4'][i % 4],
    Bloques: 'B' + (i % 5),
    Bin: i % 2,
    Tiempo: x,
    Evento: i % 3 === 0 ? 0 : 1,
    Concentracion: x,
    Senal: 3 * x + 1,
  });
}
const data = { headers: Object.keys(rows[0]), data: rows, rowCount: N };

// Configuración mínima por estadístico (misma que usa la UI en sus modales).
function configPara(nombre, cfg) {
  const t = cfg.inputs && cfg.inputs.tipo;
  if (nombre === 'Bootstrap') return { numericCol: 'Num1', estadistico: 'media', iteraciones: 200, nivelConfianza: 0.95, semilla: 12345 };
  if (nombre === 'T-Test (una muestra)') return { numericCol: 'Num1', mediaHipotesis: 10, alternativa: 'bilateral' };
  if (nombre === 'Diagrama de Pareto') return { columnaCategoria: 'Cat1', columnaConteo: 'Num1' };
  if (nombre === 'Covarianza' || nombre === 'Test TOST (Equivalencia)'
      || /^Correlación/.test(nombre)) return { columnaX: 'X', columnaY: 'Y' };
  if (/Curva de Calibración/.test(nombre)) return { columnaX: 'Concentracion', columnaY: 'Senal' };
  if (nombre === 'RMSE' || nombre === 'MAE' || nombre === 'R² (Coef. Determinación)') return { columnaObservada: 'Obs', columnaPredicha: 'Pred' };
  if (nombre === 'Regresión Polinomial') return { columnaX: 'X', columnaY: 'Y', grado: 2 };
  if (nombre === 'Regresión Logística' || nombre === 'Regresión Lineal Múltiple') return { columnaY: 'Bin', columnasX: ['Num1', 'Num2'], columnas: ['Num1', 'Num2'] };
  if (nombre === 'Tendencia') return { tipo: 'lineal', pasos: 3 };
  if (nombre === 'Series Temporales') return { numericCol: 'X', periodo: 4 };
  if (nombre === 'Análisis de Supervivencia') return { columnaTiempo: 'Tiempo', columnaEvento: 'Evento', columnaGrupo: 'Cat2' };
  if (nombre === 'Modelos Mixtos') return { numericCol: 'Num1', categoricalCols: ['Grupo'] };
  if (nombre === 'Análisis Bayesiano') return { numericCol: 'Num1', priorMedia: 10 };
  if (nombre === 'T-Test (dos muestras)' || nombre === 'Mann-Whitney U') return { categoricalCols: ['Cat2'], numericCol: 'Num1' };
  if (nombre === 'ANOVA One-Way' || nombre === 'Kruskal-Wallis') return { categoricalCols: ['Grupo'], numericCol: 'Num1' };
  if (nombre === 'ANOVA Two-Way') return { categoricalCols: ['Cat1', 'Cat2'], numericCol: 'Num1' };
  if (nombre === 'Chi-Cuadrado') return { categoricalCols: ['Cat1', 'Cat2'] };
  if (nombre === 'Friedman') return { categoricalCols: ['Bloques'], numericCol: 'Num1' };
  if (nombre === 'Análisis Discriminante' || nombre === 'M-ANOVA') return { categoricalCols: ['Grupo'], columnas: ['Num1', 'Num2', 'Num3'] };
  if (nombre === 'Regresión Lineal Simple') return { columnaX: 'X', columnaY: 'Y' };
  if (nombre === 'Análisis de Cluster' || /PCA|Factorial/.test(nombre)) return { columnas: ['Num1', 'Num2', 'Num3'] };
  if (nombre === 'Wilcoxon' || nombre === 'Test de Signos') return { numericCols: ['Num1', 'Num2'] };
  if (/F0|MKT/.test(nombre)) return { columnas: ['Num1', 'Num2'] };
  if (t === 'una-columna') return { numericCol: 'Num1' };
  return {};
}

function ejecutar(nombre) {
  const cfg = CONFIG[nombre];
  return ED.ejecutarAnalisis(data, [nombre], { [nombre]: configPara(nombre, cfg) }).resultados[nombre];
}

function desanidar(nombre, res) {
  if (!res || typeof res !== 'object' || Array.isArray(res)) return res;
  const keys = Object.keys(res).filter(k => data.headers.includes(k));
  if (keys.length) return res[keys[0]];
  // T-Test de dos muestras anida el resultado bajo "grupo1 vs grupo2".
  const declaradas = CONFIG[nombre].salidas || [];
  let actual = res;
  for (let i = 0; i < 2; i++) {
    const ks = Object.keys(actual);
    const tieneClaves = declaradas.filter(k => ks.includes(k)).length;
    const anidados = ks
      .map(k => actual[k])
      .filter(v => v && typeof v === 'object' && !Array.isArray(v));
    const candidato = anidados.find(v => declaradas.filter(k => Object.keys(v).includes(k)).length > tieneClaves);
    if (!candidato) break;
    actual = candidato;
  }
  return actual;
}

const nombres = Object.keys(CONFIG);

describe('Catálogo de estadísticos — ejecución', () => {
  test('el catálogo tiene 62 entradas', () => {
    expect(nombres).toHaveLength(62);
  });

  test.each(nombres)('%s se ejecuta sin lanzar y sin error', (nombre) => {
    expect(() => ejecutar(nombre)).not.toThrow();
    const out = ejecutar(nombre);
    expect(out).toBeDefined();
    expect(out.error).toBeUndefined();
  });

  test.each(nombres)('%s se renderiza sin caer al genérico', (nombre) => {
    const out = ejecutar(nombre);
    const html = ED.generarHTML({
      resultados: { [nombre]: out },
      totalFilas: N, totalColumnas: 5,
      columnasAnalizadas: data.headers, estadisticos: [nombre],
    });
    const htmlNorm = html.replace(/&#0?39;/g, "'").replace(/&amp;/g, '&');
    expect(htmlNorm).toContain(nombre);
    expect(html).not.toContain('[object Object]');
    expect(html).not.toContain('Tipo de prueba no reconocido');
    expect(html).not.toContain('Configuración no encontrada');
    expect(html).not.toContain('ar-error');
  });
});

describe('Contrato `salidas`', () => {
  test.each(nombres)('%s declara las claves que devuelve', (nombre) => {
    const out = ejecutar(nombre);
    expect(out).toBeDefined();
    expect(out.error).toBeUndefined();
    const declaradas = CONFIG[nombre].salidas || [];
    const inner = desanidar(nombre, out);
    if (inner == null) return;
    if (typeof inner !== 'object' || Array.isArray(inner)) {
      // Estadístico escalar: el contrato documenta un único valor semántico.
      expect(declaradas).toHaveLength(1);
      return;
    }
    const claves = Object.keys(inner);
    declaradas.forEach(k => expect(claves).toContain(k));
  });
});

function buscarEfecto(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 3) return null;
  if (obj.efectoTamano) return obj.efectoTamano;
  for (const k of Object.keys(obj)) {
    const found = buscarEfecto(obj[k], depth + 1);
    if (found) return found;
  }
  return null;
}

describe('A7 — tamaño de efecto en los 27 estadísticos declarados', () => {
  const conEfecto = Object.keys(CONFIG).filter(n => CONFIG[n].efectoTamano);

  test('el catálogo declara 27 métricas de efecto', () => {
    expect(conEfecto).toHaveLength(27);
  });

  test.each(conEfecto)('%s calcula un efectoTamano finito', (nombre) => {
    const out = ejecutar(nombre);
    expect(out.error).toBeUndefined();
    const ef = buscarEfecto(out);
    expect(ef, `${nombre} no calculó tamaño de efecto`).not.toBeNull();
    expect(typeof ef.metrica).toBe('string');
    expect(ef.metrica.length).toBeGreaterThan(0);
    expect(Number.isFinite(ef.valor)).toBe(true);
    expect(typeof ef.formula).toBe('string');
  });
});
