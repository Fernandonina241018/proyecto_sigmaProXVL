// Correcciones de la revisión de bancos OQ/PQ del 2026-10-05.
// Cada operación actúa sobre UN artículo (por data-id) de UN archivo; los IDs no se renumeran.
// op: texto (reemplazo puntual) · seccion (reemplaza el contenido de una etiqueta) · nota (agrega Nota)
//     titulo · retirar · insertar (artículo nuevo clonando atributos del de referencia) · fila (referencias) · version
// opcional: true -> si no se encuentra, se informa pero no bloquea la escritura.
export const FECHA = '2026-10-05';

const OQLF = 'equipos/oq-lecho-fluido.html';
const OQAU = 'equipos/oq-autoclave.html';
const OQMZ = 'equipos/oq-mezclador.html';
const PQLF = 'equipos/pq-lecho-fluido.html';
const PQAU = 'equipos/pq-autoclave.html';
const PQMZ = 'equipos/pq-mezclador.html';

export const OPS = [
  // ================= OQ LECHO FLUIDO =================
  { f: OQLF, id: 'EQ-OQ-LF-006', op: 'texto', de: 'Tiempo de respuesta dentro del límite del fabricante.',
    a: 'Tiempo de respuesta menor o igual al declarado por el fabricante (registrar el valor y su fuente antes de iniciar).' },
  { f: OQLF, id: 'EQ-OQ-LF-008', op: 'texto', de: 'El 100% de las lecturas está dentro de la especificación de diseño',
    a: 'El 100% de las lecturas está dentro de la especificación de diseño (registrar el rango de ΔP y su fuente antes de iniciar)' },
  { f: OQLF, op: 'insertar', saltar: true, despuesDe: 'EQ-OQ-LF-011', nuevo: {
    id: 'EQ-OQ-LF-012', titulo: 'Sistema de aspersión (si aplica)', analisis: true, secciones: [
      { et: 'Objetivo', lineas: ['Verificar el caudal de la bomba, la presión de atomización y el patrón de aspersión de las boquillas del {EQUIPO} cuando cuenta con sistema de aspersión (granulación o recubrimiento); si no lo tiene, declarar No Aplica con justificación.'] },
      { et: 'Procedimiento', lineas: [
        '1) Confirmar en el diseño si el equipo cuenta con sistema de aspersión; si no existe, pasar al paso 8)',
        '2) Disponer de balanza calibrada, cronómetro, manómetro patrón calibrado para el aire de atomización y agua purificada como líquido de prueba',
        '3) Fijar el caudal de la bomba en mínimo, nominal y máximo del rango de la receta; en cada punto recoger el líquido durante 1 minuto en recipiente tarado y pesarlo, por triplicado',
        'a) El caudal medido está dentro de ±5% del setpoint en los tres puntos, con RSD menor o igual a 5% por punto',
        '4) Fijar la presión de aire de atomización en mínimo, nominal y máximo y comparar la indicación del equipo contra el manómetro patrón',
        'a) La diferencia es menor o igual a ±0,1 bar o ±5% del valor, lo mayor',
        '5) Con la cámara abierta en condición segura, aspersar sobre una superficie de contraste y verificar patrón uniforme por boquilla, sin goteo ni chorro',
        '6) Sin flujo de aire de proceso o sin aire de atomización, intentar arrancar la bomba y confirmar que queda inhibida o se detiene',
        '7) Detener la aspersión y confirmar que no hay goteo residual por las boquillas durante 2 minutos',
        '8) Sin sistema de aspersión: redactar la justificación de No Aplica con firma del ejecutor y del revisor',
        '9) Cuando aplique este ensayo, procesar los datos crudos de caudal de aspersión y presión de atomización en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo.'] },
      { et: 'Criterio de aceptación', lineas: [
        'Con sistema: caudal ±5% del setpoint con RSD ≤5%; presión de atomización ±0,1 bar o ±5%; patrón uniforme sin goteo; interlock de la bomba operativo.',
        'Sin sistema: No Aplica justificado y firmado.'] },
      { et: 'Documentos entregables', lineas: [
        '- Tabla de caudal de aspersión por punto con pesadas y RSD',
        '- Tabla de presión de atomización equipo contra patrón',
        '- Registro del patrón de aspersión y del interlock, o justificación de No Aplica firmada',
        '- Data cruda y reporte estadístico del análisis de caudal de aspersión y presión de atomización'] },
      { et: 'Referencia', lineas: ['Manual del fabricante; EU GMP Anexo 15; USP <1058> (instrumentos asociados).'] },
    ] } },
  { f: OQLF, op: 'insertar', saltar: true, despuesDe: 'EQ-OQ-LF-012', nuevo: {
    id: 'EQ-OQ-LF-013', titulo: 'Protección contra explosión de polvo (si aplica)', secciones: [
      { et: 'Objetivo', lineas: ['Verificar la operatividad de los dispositivos de protección contra explosión del {EQUIPO} (paneles de venteo, supresión, aislamiento o diseño resistente a la presión), sus enclavamientos y la puesta a tierra, según la evaluación de riesgo de atmósferas explosivas; si el equipo no los requiere, declarar No Aplica con justificación.'] },
      { et: 'Procedimiento', lineas: [
        '1) Revisar la evaluación de riesgo de atmósferas explosivas (zonificación) y el concepto de protección del fabricante; si el equipo no requiere protección, pasar al paso 7)',
        '2) Verificar que los paneles de venteo o discos de ruptura están íntegros, con presión de apertura en placa y certificado vigente, y que la zona de descarga está libre y señalizada',
        '3) Simular la apertura del sensor de integridad del panel (si existe) y confirmar la detención del equipo y la alarma en el HMI',
        '4) Con sistema de supresión: verificar el panel de control sin fallas, la presión de los cilindros y la vigencia del servicio del proveedor; simular la señal de falla y confirmar la inhibición del arranque, sin disparar el supresor',
        '5) Medir con óhmetro calibrado la continuidad a tierra del contenedor, las mangas antiestáticas y las partes conductoras',
        'a) Resistencia a tierra menor o igual a 10 Ω, o el valor de la evaluación de riesgo si es más estricto',
        '6) Verificar que el equipamiento eléctrico en zona clasificada tiene el marcado ATEX correspondiente a la zona',
        '7) Sin requerimiento: redactar la justificación de No Aplica con referencia a la evaluación de riesgo, con firma del ejecutor y del revisor'] },
      { et: 'Criterio de aceptación', lineas: [
        'Dispositivos íntegros, certificados y con enclavamientos operativos; puesta a tierra ≤10 Ω; marcado ATEX acorde a la zona.',
        'Sin requerimiento: No Aplica justificado y firmado.'] },
      { et: 'Documentos entregables', lineas: [
        '- Checklist de dispositivos de protección con certificados',
        '- Registro de pruebas de enclavamiento y de puesta a tierra',
        '- Evaluación de riesgo de atmósferas explosivas o justificación de No Aplica firmada'] },
      { et: 'Referencia', lineas: ['Directiva 2014/34/UE (ATEX); EN 14491 (venteo de explosiones de polvo); IEC TS 60079-32-1 (electricidad estática).'] },
    ] } },
  { f: OQLF, id: 'EQ-OQ-LF-RES', op: 'texto', saltar: true, de: 'EQ-OQ-LF-011', a: 'EQ-OQ-LF-013', opcional: true },
  { f: OQLF, id: 'EQ-OQ-LF-RES', op: 'texto', saltar: true, de: 'Los 11 ensayos', a: 'Los 13 ensayos', opcional: true },
  { f: OQLF, id: 'EQ-OQ-LF-REF', op: 'fila', saltar: true, celdas: ['', 'Directiva 2014/34/UE (ATEX) — Equipos y sistemas de protección para atmósferas explosivas', 'VIGENTE'], opcional: true },
  { f: OQLF, id: 'EQ-OQ-LF-REF', op: 'fila', saltar: true, celdas: ['', 'EN 14491 — Sistemas de venteo de explosiones de polvo', 'VIGENTE'], opcional: true },
  { f: OQLF, op: 'version' },

  // ================= OQ AUTOCLAVE =================
  { f: OQAU, id: 'EQ-OQ-AU-010', op: 'seccion', et: 'Criterio de aceptación', lineas: [
    'Tasa de fuga menor o igual a 0,13 kPa/min (EN 285), o el criterio más estricto de la URS registrado en el protocolo antes de la ejecución.'] },
  { f: OQAU, id: 'EQ-OQ-AU-011', op: 'texto', de: 'paquete Bowie-Dick textil o el indicador Clase B según ISO 11140',
    a: 'paquete Bowie-Dick textil estándar (EN 285) con hoja indicadora clase 2 según ISO 11140-5, o el dispositivo alternativo clase 2 según ISO 11140-4' },
  { f: OQAU, id: 'EQ-OQ-AU-011', op: 'seccion', et: 'Referencia', lineas: ['EN 285 §17; ISO 11140-4 e ISO 11140-5 (indicadores clase 2 para remoción de aire).'] },
  { f: OQAU, id: 'EQ-OQ-AU-014', op: 'nota', texto: 'El número y la ubicación de los termopares se justifican en el plano según el volumen útil y la geometría de la cámara (drenaje, entrada de vapor, zona de puerta y esquinas); 10 es el mínimo del banco y se aumenta en cámaras grandes.' },
  { f: OQAU, id: 'EQ-OQ-AU-014', op: 'seccion', et: 'Referencia', lineas: ['EN 285 §16 (termometría); ISO 17665-1; USP <1229.1>; PDA TR-01.'] },
  { f: OQAU, op: 'version' },

  // ================= OQ MEZCLADOR =================
  { f: OQMZ, id: 'EQ-OQ-MZ-005', op: 'texto', de: 'carga máxima declarada [ ] kg según la URS',
    a: 'carga máxima declarada en la URS (registrar el valor en kg y su fuente antes de iniciar)' },
  { f: OQMZ, id: 'EQ-OQ-MZ-005', op: 'seccion', et: 'Criterio de aceptación', lineas: [
    'Tiempo y distancia de frenado dentro del límite del fabricante en las 3 repeticiones con carga máxima, sin patinaje (límite y fuente registrados antes de iniciar).'] },
  { f: OQMZ, id: 'EQ-OQ-MZ-006', op: 'texto', de: 'mínimo, nominal y máximo [ ] rpm',
    a: 'mínimo, nominal y máximo (registrar los valores en rpm según la URS o el manual del fabricante)' },
  { f: OQMZ, id: 'EQ-OQ-MZ-007', op: 'texto', de: 'número de revoluciones [ ]',
    a: 'número de revoluciones (100 o el valor de la receta, registrado antes de iniciar)' },
  { f: OQMZ, id: 'EQ-OQ-MZ-009', op: 'texto', de: '(±[ ] cm o grados)',
    a: '(tolerancia del fabricante registrada en cm o grados antes de iniciar)' },
  // MZ-010 es un ensayo de desempeño: la uniformidad de mezcla se demuestra en EQ-PQ-MZ-001 a 006.
  // El ID queda retirado (no se reutiliza).
  { f: OQMZ, id: 'EQ-OQ-MZ-010', op: 'retirar', saltar: true },
  { f: OQMZ, id: 'EQ-OQ-MZ-RES', op: 'texto', saltar: true, de: 'Los 13 ensayos',
    a: 'Los 12 ensayos (EQ-OQ-MZ-010 retirado: la uniformidad de mezcla se demuestra en el PQ)' },
  { f: OQMZ, op: 'version' },

  // ================= PQ LECHO FLUIDO =================
  { f: PQLF, id: 'EQ-PQ-LF-001', op: 'texto', de: 'carga habitual [ ] kg', a: 'carga habitual (registrar en kg según el BMR)' },
  { f: PQLF, id: 'EQ-PQ-LF-002', op: 'texto', de: 'carga mínima [ ] kg y la carga máxima [ ] kg del rango declarado en la URS',
    a: 'carga mínima y la carga máxima del rango declarado en la URS (registrar ambos valores en kg)' },
  { f: PQLF, id: 'EQ-PQ-LF-002', op: 'nota', texto: 'Se ejecuta una corrida por extremo porque la repetibilidad se demuestra en los tres lotes nominales del ensayo EQ-PQ-LF-001 (bracketing). Si el análisis de riesgo no sustenta el bracketing, repetir cada extremo en tres corridas.' },
  { f: PQLF, id: 'EQ-PQ-LF-003', op: 'texto', de: 'humedad inicial máxima [ ]%, flujo en límite bajo [ ] m³/h y temperatura en el límite ([alto/bajo] según riesgo)',
    a: 'humedad inicial máxima, flujo en el límite bajo y temperatura en el límite alto o bajo según el riesgo (registrar los valores en %, m³/h y °C con su fuente: BMR, desarrollo o URS)' },
  { f: PQLF, id: 'EQ-PQ-LF-003', op: 'nota', texto: 'Una corrida en peor caso es suficiente cuando el análisis de riesgo lo justifica y la repetibilidad está demostrada en EQ-PQ-LF-001; en caso contrario, ejecutar tres corridas.' },
  { f: PQLF, id: 'EQ-PQ-LF-004', op: 'texto', de: 'punto final por humedad [ ]% LOD según la especificación del producto',
    a: 'punto final por humedad según la especificación del producto (registrar el límite en % LOD)' },
  { f: PQLF, id: 'EQ-PQ-LF-006', op: 'seccion', et: 'Referencia', lineas: ['USP <786> (tamizado); USP <429> (difracción láser); USP <616> (densidad aparente y compactada).'] },
  { f: PQLF, id: 'EQ-PQ-LF-012', op: 'texto', de: 'producto [ ] °C y salida [ ] °C',
    a: 'producto y salida según la receta aprobada (registrar ambos límites en °C antes de iniciar)' },
  { f: PQLF, op: 'version' },

  // ================= PQ AUTOCLAVE =================
  { f: PQAU, id: 'EQ-PQ-AU-004', op: 'texto', de: 'Correr un ciclo por tipo de carga registrando la temperatura interna',
    a: 'Correr 3 ciclos consecutivos por tipo de carga registrando la temperatura interna (un ciclo por tipo solo si el bracketing está justificado en el análisis de riesgo y el tipo queda cubierto por EQ-PQ-AU-008)' },
  { f: PQAU, id: 'EQ-PQ-AU-004', op: 'seccion', et: 'Criterio de aceptación', lineas: [
    'Penetración demostrada en el punto difícil de cada tipo de carga en los 3 ciclos consecutivos, o bracketing justificado.'] },
  { f: PQAU, id: 'EQ-PQ-AU-005', op: 'seccion', et: 'Criterio de aceptación', lineas: [
    'F0 físico en el punto frío mayor o igual al mínimo definido (12 minutos por defecto, enfoque de sobremuerte) y coherente con el F0 biológico, demostrando un SAL menor o igual a 10⁻⁶.'] },
  { f: PQAU, id: 'EQ-PQ-AU-005', op: 'nota', texto: 'El F0 mínimo se justifica según el enfoque: sobremuerte (reducción de 12 log de un indicador con D121 de 1 minuto, F0 = 12 min) o basado en biocarga (F0 = D121 × (log N0 − log SAL), con N0 la biocarga máxima y D121 del organismo más resistente). Anexar la memoria de cálculo con el enfoque elegido.' },
  { f: PQAU, id: 'EQ-PQ-AU-007', op: 'texto', de: 'Disponer de indicadores biológicos con población y valor D conocidos',
    a: 'Disponer de indicadores biológicos de Geobacillus stearothermophilus con población certificada (habitualmente 10⁶ esporas por unidad; mínimo 10⁵ según ISO 11138-3) y D121 de 1,5 minutos o más, registrando lote y vencimiento' },
  { f: PQAU, id: 'EQ-PQ-AU-007', op: 'texto', de: 'expuestos negativos, positivo positivo y negativo negativo',
    a: 'expuestos sin crecimiento; control positivo con crecimiento; control negativo sin crecimiento' },
  { f: PQAU, id: 'EQ-PQ-AU-007', op: 'seccion', et: 'Referencia', lineas: ['USP <1229.5>; ISO 11138-1 e ISO 11138-3 (indicadores biológicos para calor húmedo).'] },
  { f: PQAU, id: 'EQ-PQ-AU-012', op: 'titulo', saltar: true, titulo: 'Bowie-Dick diario durante el PQ (si aplica, poroso)' },
  { f: PQAU, id: 'EQ-PQ-AU-012', op: 'texto', saltar: true, de: 'Verificar la remoción de aire con carga porosa',
    a: 'Verificar, en cámara vacía y antes de procesar cargas porosas, la remoción de aire' },
  { f: PQAU, id: 'EQ-PQ-AU-012', op: 'texto', saltar: true, de: 'Ubicar el paquete Bowie-Dick en el punto definido con la carga presente',
    a: 'Ubicar el paquete Bowie-Dick en el punto definido con la cámara vacía (solo el paquete), antes de la primera carga porosa de cada día del PQ' },
  { f: PQAU, id: 'EQ-PQ-AU-012', op: 'nota', saltar: true, texto: 'El Bowie-Dick se ejecuta en cámara vacía; la eficacia con carga porosa se demuestra en EQ-PQ-AU-004 y EQ-PQ-AU-006. Tras el PQ, el ensayo diario antes de la primera carga porosa queda en el procedimiento de rutina.' },
  { f: PQAU, id: 'EQ-PQ-AU-012', op: 'seccion', saltar: true, et: 'Referencia', lineas: ['EN 285 §17; ISO 11140-5 (indicadores clase 2); ISO 17665-1 (control de rutina).'] },
  { f: PQAU, id: 'EQ-PQ-AU-015', op: 'seccion', et: 'Referencia', lineas: ['EU GMP Anexo 1 (tiempos de almacenamiento del material estéril); ISO 11607-1 (sistemas de barrera estéril); práctica 7–30 días según empaque.'] },
  { f: PQAU, id: 'EQ-PQ-AU-REF', op: 'fila', celdas: ['', 'ISO 11138-3 — Indicadores biológicos para procesos de esterilización por calor húmedo', 'VIGENTE'] },
  { f: PQAU, id: 'EQ-PQ-AU-REF', op: 'fila', celdas: ['', 'ISO 11140-5 — Indicadores clase 2 para ensayos de remoción de aire tipo Bowie-Dick', 'VIGENTE'] },
  { f: PQAU, id: 'EQ-PQ-AU-REF', op: 'fila', celdas: ['', 'ISO 11607-1 — Envases para productos sanitarios esterilizados terminalmente', 'VIGENTE'] },
  { f: PQAU, op: 'version' },

  // ================= PQ MEZCLADOR =================
  { f: PQMZ, id: 'EQ-PQ-MZ-003', op: 'nota', texto: '10 puntos es el mínimo para mezcladores de volteo (V, bins, doble cono). En mezcladores convectivos (cinta, planetario, alto corte) usar 20 puntos como mínimo.' },
  { f: PQMZ, id: 'EQ-PQ-MZ-005', op: 'seccion', et: 'Criterio de aceptación', lineas: [
    'Varianza dentro del punto (método y muestreo) menor que la varianza entre puntos según ANOVA de un factor (α = 0,05), o ambas con RSD dentro del criterio de EQ-PQ-MZ-003; o No Aplica justificado y firmado.'] },
  { f: PQMZ, id: 'EQ-PQ-MZ-007', op: 'texto', de: 'llenado mínimo [ ]% y máximo [ ]% del rango declarado en la URS',
    a: 'llenado mínimo y máximo del rango declarado en la URS (registrar ambos en % del volumen útil)' },
  { f: PQMZ, id: 'EQ-PQ-MZ-010', op: 'texto', de: 'tiempo máximo de espera propuesto [ ] horas en el contenedor de proceso',
    a: 'tiempo máximo de espera propuesto en el contenedor de proceso (registrar en horas, con la temperatura y humedad de almacenamiento)' },
  { f: PQMZ, id: 'EQ-PQ-MZ-010', op: 'seccion', et: 'Referencia', lineas: ['EU GMP Anexo 15 (tiempos de espera); 21 CFR 211.111 (límites de tiempo en producción).'] },
  { f: PQMZ, id: 'EQ-PQ-MZ-014', op: 'seccion', et: 'Criterio de aceptación', lineas: [
    'Rendimiento mayor o igual al límite de la receta (98% por defecto) en todos los lotes, con la pérdida por adherencia o polvo cuantificada.'] },
  { f: PQMZ, id: 'EQ-PQ-MZ-REF', op: 'texto', de: 'USP <1211> — Tiempos de espera entre operaciones',
    a: '21 CFR 211.111 — Límites de tiempo en producción (tiempos de espera)' },
  { f: PQMZ, op: 'version' },
];
