#!/usr/bin/env node
// Genera el par URS + AR de los cuatro sistemas. El contenido variable vive
// aquí; la estructura y el mapa de complementariedad son comunes.
// Uso: node scripts/generar-urs-ar-sistemas.mjs
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.cwd(), 'docs', 'banco-ensayos', 'sistemas');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const roles = [
  ['autor', 'Autor — Ingeniería / dueño del sistema', 'Redacta requisitos, criterios y dependencias', 'FASE:IQ', 'Todos los ensayos IQ del sistema y los documentos de entrada de §3'],
  ['proceso', 'Revisor de proceso — Producción / usuario', 'Confirma que los requisitos representan el uso real y el peor caso', 'FASE:OQ', 'Todos los ensayos OQ del sistema'],
  ['calidad', 'Revisor de calidad — Validación / QA', 'Verifica criterios, trazabilidad y cierre de desviaciones', 'FASE:PQ', 'Todos los ensayos PQ del sistema'],
  ['aprobador', 'Aprobador — Dirección de QA', 'Aprueba el documento y libera el sistema para uso GMP', 'TODOS', 'Todos los ensayos IQ/OQ/PQ y la matriz de trazabilidad'],
];

const sistemas = [
  {
    id: 'hvac', code: 'HV', nombre: 'HVAC / Climatización',
    objetivo: 'Definir los requisitos de usuario del sistema de climatización que sirve a las áreas clasificadas, para que el diseño, la calificación y la operación demuestren el grado de limpieza, la cascada de presiones y el control ambiental exigidos por el proceso.',
    alcance: 'Unidades de tratamiento de aire, filtros HEPA, ductos, difusores, retornos, esclusas y sistema de control/monitoreo ambiental del HVAC. No cubre los equipos de proceso instalados en las áreas.',
    normas: ['EU GMP Anexo 1 — Fabricación de productos estériles', 'EU GMP Anexo 15 — Calificación y validación', 'ISO 14644-1/-2/-3 — Salas limpias y ensayos', 'EN 1822 — Filtros HEPA'],
    docs: [
      ['P&ID-HVAC', 'Plano de tuberías e instrumentación del HVAC y de las UMA', 'Frontera del sistema, componentes, filtros y puntos de medición'],
      ['LAYOUT-HVAC', 'Layout de áreas clasificadas y matriz de grados, presiones, T y HR', 'Grado, renovaciones, cascada y rangos por área'],
      ['SOP-BMS', 'Procedimiento de operación y administración del BMS', 'Roles, alarmas, registros y retención'],
      ['PLAN-VAL-HVAC', 'Plan de validación del sistema HVAC', 'Estrategia IQ/OQ/PQ, criterios de muestreo y tiempos de recuperación'],
    ],
    reqs: [
      ['Clasificación de áreas', 'Funcional / regulatorio', 'Cada área clasificada alcanza y mantiene el grado asignado en LAYOUT-HVAC (ISO 14644-1).', ['LAYOUT-HVAC', 'PLAN-VAL-HVAC'], ['HVAC-IQ-003']],
      ['Renovaciones y caudal de aire', 'Funcional', 'Cada área recibe el caudal y las renovaciones/h definidos en LAYOUT-HVAC.', ['LAYOUT-HVAC', 'P&ID-HVAC'], ['SIS-OQ-HV-006', 'SIS-OQ-HV-019']],
      ['Cascada de presiones', 'Funcional / seguridad', 'Los diferenciales entre áreas cumplen la cascada aprobada en LAYOUT-HVAC y no se invierten en operación.', ['LAYOUT-HVAC'], ['SIS-OQ-HV-020', 'SIS-PQ-HV-010']],
      ['Filtración HEPA e integridad', 'Funcional / regulatorio', 'Los filtros son de la clase declarada en P&ID-HVAC y no presentan fuga detectable (EN 1822 / ISO 14644-3).', ['P&ID-HVAC'], ['HVAC-IQ-003', 'SIS-OQ-HV-014']],
      ['Temperatura y humedad por área', 'Funcional', 'Cada área mantiene T y HR dentro del rango aprobado en LAYOUT-HVAC.', ['LAYOUT-HVAC'], ['SIS-OQ-HV-024']],
      ['Control, alarmas y registros', 'No funcional / regulatorio', 'Setpoints, alarmas y registros del BMS son trazables (usuario, fecha, valor) y cubren el 100 % de los puntos críticos de LAYOUT-HVAC.', ['SOP-BMS', 'LAYOUT-HVAC'], ['HVAC-IQ-006', 'SIS-OQ-HV-036']],
      ['Tolerancia a falla', 'No funcional / seguridad', 'Ante falla de UMA o de energía, el sistema mantiene o restaura la cascada y las condiciones en el tiempo definido en PLAN-VAL-HVAC.', ['PLAN-VAL-HVAC', 'P&ID-HVAC'], ['SIS-OQ-HV-004', 'SIS-OQ-HV-005', 'SIS-PQ-HV-017']],
      ['Monitoreo ambiental continuo', 'No funcional / regulatorio', 'El sistema registra T, HR y ΔP de forma continua con la frecuencia definida en LAYOUT-HVAC.', ['LAYOUT-HVAC', 'SOP-BMS'], ['SIS-OQ-HV-035', 'SIS-PQ-HV-008']],
      ['Contención y flujo unidireccional', 'Funcional / seguridad', 'Las zonas grado A mantienen flujo unidireccional y no hay contaminación cruzada entre áreas de distinto grado.', ['LAYOUT-HVAC'], ['SIS-OQ-HV-031', 'SIS-PQ-HV-014']],
      ['Cierre de calificación', 'Regulatorio', 'IQ/OQ/PQ completos, desviaciones cerradas y matriz URS→ensayo aprobada antes de liberar el sistema.', ['PLAN-VAL-HVAC'], ['SIS-PQ-HV-020']],
    ],
    risks: [
      ['Clasificación insuficiente: partículas fuera de grado en producto estéril', 'Diseño de filtración y renovaciones conforme a LAYOUT-HVAC; verificación en IQ y PQ'],
      ['Caudal o renovaciones bajas por obstrucción o ajuste', 'Balanceo, alarmas de caudal y ensayos de caudal/renovaciones'],
      ['Inversión de diferencial: contaminación cruzada', 'Cascada con alarmas y prueba de reto de puertas en operación'],
      ['Fuga en HEPA o marco: bypass de filtración', 'Certificación de filtros y prueba de integridad in situ'],
      ['Deriva de T/HR fuera del rango aprobado', 'Control por cuarto, mapeo T/HR y alarmas'],
      ['Registro faltante o alterado: pérdida de trazabilidad', 'Audit trail, roles y respaldo según SOP-BMS (Part 11)'],
      ['Falla de energía o de UMA', 'Redundancia, recuperación y prueba de falla'],
      ['Punto de monitoreo no representativo', 'Ubicación y calibración de sensores; verificación de sensores'],
      ['Flujo no unidireccional en zona A', 'Diseño de difusores y cortinas; prueba de humo'],
      ['Cierre sin evidencia completa', 'RTM y revisión de registros; no liberar con desviaciones abiertas'],
    ],
  },
  {
    id: 'agua-purificada', code: 'AP', nombre: 'Agua purificada / WFI',
    objetivo: 'Definir los requisitos de usuario del sistema de generación, almacenamiento y distribución de agua purificada/WFI, para que la calidad química y microbiológica se mantenga en todos los puntos de uso durante la vida del sistema.',
    alcance: 'Pretratamiento, ósmosis inversa, EDI, tanque, loop de distribución, sanitización, puntos de muestreo y uso, e instrumentación en línea. No cubre los equipos que consumen el agua.',
    normas: ['EU GMP Anexo 1 — Fabricación de productos estériles', 'EU GMP Anexo 15 — Calificación y validación', 'USP <1231> — Agua para uso farmacéutico', 'USP <645> — Conductividad del agua', 'ISPE Baseline Guide Vol. 4 — Water and Steam Systems'],
    docs: [
      ['P&ID-AP', 'Plano de tuberías e instrumentación del sistema de agua', 'Frontera, materiales, instrumentos y componentes'],
      ['LAYOUT-AP', 'Layout de la red y ubicación de puntos de uso y muestreo', 'Recorrido, pendientes y puntos críticos'],
      ['ESP-AGUA', 'Especificación de calidad de agua purificada/WFI aprobada', 'Límites químicos, microbiológicos y de endotoxinas'],
      ['PLAN-MUESTREO-AP', 'Plan de muestreo y frecuencias', 'Puntos, frecuencia y criterios de alerta/acción'],
      ['SOP-SANITIZACION-AP', 'Procedimiento de sanitización del sistema', 'Agente, temperatura, tiempo y frecuencia'],
      ['PLAN-VAL-AP', 'Plan de validación del sistema de agua', 'Fases PQ, muestreo y criterios de aceptación'],
    ],
    reqs: [
      ['Calidad química en continuo', 'Funcional / regulatorio', 'Conductividad y TOC cumplen los límites de ESP-AGUA en todos los puntos de uso.', ['ESP-AGUA', 'PLAN-MUESTREO-AP'], ['SIS-OQ-AP-013', 'SIS-PQ-AP-013']],
      ['Calidad microbiológica y endotoxinas', 'Funcional / regulatorio', 'El agua cumple los límites microbiológicos y de endotoxinas de ESP-AGUA.', ['ESP-AGUA', 'PLAN-MUESTREO-AP'], ['SIS-PQ-AP-014', 'SIS-PQ-AP-015']],
      ['Caudal y presión del loop', 'Funcional', 'El loop mantiene el caudal y la presión mínimos de ESP-AGUA en todos los puntos de uso.', ['ESP-AGUA', 'P&ID-AP'], ['SIS-OQ-AP-021', 'SIS-OQ-AP-022']],
      ['Sanitización periódica', 'Funcional / regulatorio', 'La sanitización se ejecuta según SOP-SANITIZACION-AP y su eficacia se demuestra en cada ciclo.', ['SOP-SANITIZACION-AP', 'PLAN-VAL-AP'], ['SIS-OQ-AP-028', 'SIS-PQ-AP-020']],
      ['Materiales y puntos muertos', 'No funcional / calidad', 'Materiales y acabados corresponden a P&ID-AP y no existen ramales muertos fuera del límite aprobado.', ['P&ID-AP'], ['SIS-IQ-AP-001', 'SIS-IQ-AP-006']],
      ['Puntos de muestreo representativos', 'No funcional / regulatorio', 'La red dispone de los puntos de muestreo definidos en PLAN-MUESTREO-AP, accesibles y representativos.', ['PLAN-MUESTREO-AP', 'LAYOUT-AP'], ['SIS-IQ-AP-002', 'SIS-OQ-AP-032']],
      ['Instrumentación en línea', 'No funcional / regulatorio', 'Conductividad, TOC y temperatura en línea están calibrados, alarmados y registrados.', ['P&ID-AP', 'PLAN-VAL-AP'], ['SIS-IQ-AP-005', 'SIS-OQ-AP-030']],
      ['Alarmas, excursiones y tendencias', 'No funcional / regulatorio', 'Toda excursión queda registrada y notificada; la tendencia se evalúa según PLAN-MUESTREO-AP.', ['PLAN-MUESTREO-AP', 'SOP-SANITIZACION-AP'], ['SIS-OQ-AP-003', 'SIS-PQ-AP-011']],
      ['Continuidad ante falla', 'No funcional / seguridad', 'La falla de energía o de un componente no compromete la calidad; la redundancia es la de P&ID-AP.', ['P&ID-AP'], ['SIS-OQ-AP-004', 'SIS-OQ-AP-005']],
      ['PQ por fases', 'Regulatorio', 'El PQ se ejecuta en las fases y con el muestreo definidos en PLAN-VAL-AP.', ['PLAN-VAL-AP', 'PLAN-MUESTREO-AP'], ['SIS-PQ-AP-001', 'SIS-PQ-AP-009']],
    ],
    risks: [
      ['Conductividad o TOC fuera de límite', 'Monitoreo en continuo, alarmas y respuesta a excursión'],
      ['Contaminación microbiológica o endotoxinas', 'Sanitización periódica, muestreo y tendencia microbiológica'],
      ['Caudal o presión insuficientes en puntos de uso', 'Diseño del loop, alarmas de presión y verificación en OQ'],
      ['Sanitización ineficaz', 'Validación del ciclo y verificación de eficacia'],
      ['Materiales inadecuados o puntos muertos', 'Revisión de P&ID, certificados y verificación de ramales'],
      ['Punto de muestreo no representativo', 'Diseño de muestreo y verificación de accesibilidad'],
      ['Instrumento descalibrado o sin alarma', 'Calibración, verificación y alarmas de rango'],
      ['Excursión no detectada o no registrada', 'Audit trail, alarmas y revisión de tendencias'],
      ['Pérdida de calidad por falla de energía', 'Redundancia y recuperación verificadas en OQ'],
      ['PQ incompleto o con muestreo insuficiente', 'Plan de validación y revisión de cierre'],
    ],
  },
  {
    id: 'vapor-limpio', code: 'VL', nombre: 'Vapor limpio',
    objetivo: 'Definir los requisitos de usuario del sistema de vapor limpio para esterilización y contacto con producto, de modo que la calidad del vapor y del condensado se mantenga en todos los puntos de uso.',
    alcance: 'Generador de vapor limpio, separador de gotas, distribución, purgadores, puntos de muestreo y uso, y tratamiento del agua de alimentación. No cubre los esterilizadores que consumen el vapor.',
    normas: ['EU GMP Anexo 1 — Fabricación de productos estériles', 'EU GMP Anexo 15 — Calificación y validación', 'EN 285 — Esterilización por vapor', 'ISPE Baseline Guide Vol. 4 — Water and Steam Systems'],
    docs: [
      ['P&ID-VL', 'Plano de tuberías e instrumentación del vapor limpio', 'Frontera, componentes, purgadores y puntos de muestreo'],
      ['ESP-VAPOR', 'Especificación de calidad de vapor limpio y condensado', 'Límites de sequedad, gases no condensables, sobrecalentamiento y calidad del condensado'],
      ['ESP-AGUA-ALIM', 'Especificación del agua de alimentación del generador', 'Límites químicos y microbiológicos'],
      ['PLAN-MUESTREO-VL', 'Plan de muestreo de vapor y condensado', 'Puntos, frecuencia y criterios de aceptación'],
      ['PLAN-VAL-VL', 'Plan de validación del sistema de vapor', 'Estrategia IQ/OQ/PQ y prueba de arranque'],
    ],
    reqs: [
      ['Calidad del vapor en uso', 'Funcional / regulatorio', 'Sequedad, gases no condensables y sobrecalentamiento cumplen ESP-VAPOR.', ['ESP-VAPOR', 'PLAN-MUESTREO-VL'], ['SIS-PQ-VL-010', 'SIS-PQ-VL-011', 'SIS-PQ-VL-012']],
      ['Calidad del condensado', 'Funcional / regulatorio', 'Conductividad, TOC, endotoxinas y carga microbiana del condensado cumplen ESP-VAPOR.', ['ESP-VAPOR', 'PLAN-MUESTREO-VL'], ['SIS-PQ-VL-007', 'SIS-PQ-VL-008', 'SIS-PQ-VL-009']],
      ['Capacidad y respuesta a demanda', 'Funcional', 'El sistema cubre la demanda máxima de ESP-VAPOR sin caer bajo el mínimo de presión o caudal.', ['ESP-VAPOR', 'P&ID-VL'], ['SIS-OQ-VL-008', 'SIS-OQ-VL-009']],
      ['Presión y temperatura en puntos de uso', 'Funcional', 'Cada punto de uso recibe la presión y temperatura definidas en ESP-VAPOR.', ['ESP-VAPOR', 'P&ID-VL'], ['SIS-OQ-VL-012']],
      ['Distribución sin retenciones', 'No funcional / calidad', 'La red tiene la pendiente, purgadores y ausencia de ramales muertos definidos en P&ID-VL.', ['P&ID-VL'], ['SIS-IQ-VL-002', 'SIS-OQ-VL-014', 'SIS-OQ-VL-016']],
      ['Agua de alimentación', 'Funcional / regulatorio', 'El agua de alimentación cumple ESP-AGUA-ALIM antes de entrar al generador.', ['ESP-AGUA-ALIM'], ['SIS-IQ-VL-004']],
      ['Seguridad y alarmas', 'No funcional / seguridad', 'Válvulas de alivio y alarmas están calibradas, probadas y con consigna aprobada.', ['P&ID-VL', 'PLAN-VAL-VL'], ['SIS-OQ-VL-001', 'SIS-OQ-VL-004']],
      ['Calidad tras paro prolongado', 'Funcional / regulatorio', 'Tras un paro, el vapor alcanza la calidad de ESP-VAPOR antes del primer uso.', ['ESP-VAPOR', 'PLAN-VAL-VL'], ['SIS-OQ-VL-024', 'SIS-PQ-VL-015']],
      ['Muestreo representativo', 'No funcional / regulatorio', 'Los puntos de muestreo de vapor y condensado son los de PLAN-MUESTREO-VL.', ['PLAN-MUESTREO-VL', 'P&ID-VL'], ['SIS-OQ-VL-020']],
      ['Registros y tendencias', 'No funcional / regulatorio', 'La calidad, las alarmas y el mantenimiento quedan registrados con trazabilidad.', ['PLAN-VAL-VL', 'PLAN-MUESTREO-VL'], ['SIS-PQ-VL-023', 'SIS-PQ-VL-024']],
    ],
    risks: [
      ['Vapor húmedo o con gases no condensables', 'Separador de gotas, purga y ensayos de calidad'],
      ['Condensado fuera de especificación', 'Muestreo, tendencia y respuesta a excursión'],
      ['Capacidad insuficiente en demanda máxima', 'Diseño de capacidad y prueba a demanda máxima'],
      ['Presión o temperatura baja en punto de uso', 'Reductoras, aislamiento y verificación en OQ'],
      ['Retención de condensado o ramal muerto', 'Pendiente, purgadores y revisión de P&ID'],
      ['Agua de alimentación fuera de límite', 'Tratamiento y verificación de calidad de alimentación'],
      ['Falla de válvula de alivio o alarma', 'Calibración y prueba de seguridad'],
      ['Vapor fuera de calidad tras paro', 'Procedimiento de arranque y muestreo antes del uso'],
      ['Muestreo no representativo', 'Diseño de puntos y verificación en OQ'],
      ['Pérdida de registros o tendencias', 'Registro continuo y revisión documentada'],
    ],
  },
  {
    id: 'aire-comprimido', code: 'AC', nombre: 'Aire comprimido grado proceso',
    objetivo: 'Definir los requisitos de usuario del sistema de aire comprimido en contacto con producto o con superficies del producto, para que la calidad ISO 8573 se mantenga en todos los puntos de uso.',
    alcance: 'Compresor, posenfriador, secadores, cadena de filtración, tanque receptor, distribución, puntos de uso y purgas. No cubre los equipos neumáticos que consumen el aire.',
    normas: ['EU GMP Anexo 1 — Fabricación de productos estériles', 'EU GMP Anexo 15 — Calificación y validación', 'ISO 8573-1 — Calidad del aire comprimido', 'ISO 8573-2/-3/-4 — Ensayos de aceite, humedad y partículas'],
    docs: [
      ['P&ID-AC', 'Plano de tuberías e instrumentación del aire comprimido', 'Frontera, componentes, filtros y puntos de uso'],
      ['ESP-AIRE', 'Especificación de calidad ISO 8573 por punto de uso', 'Clase de partículas, agua y aceite'],
      ['PLAN-MUESTREO-AC', 'Plan de muestreo de aire comprimido', 'Puntos, frecuencia y criterios de alerta/acción'],
      ['PLAN-VAL-AC', 'Plan de validación del sistema de aire', 'Estrategia IQ/OQ/PQ y prueba de demanda máxima'],
    ],
    reqs: [
      ['Calidad ISO 8573', 'Funcional / regulatorio', 'Partículas, agua y aceite cumplen la clase de ESP-AIRE en cada punto de uso.', ['ESP-AIRE', 'PLAN-MUESTREO-AC'], ['SIS-PQ-AC-011', 'SIS-PQ-AC-012']],
      ['Punto de rocío', 'Funcional / regulatorio', 'El punto de rocío se mantiene dentro del límite de ESP-AIRE, medido en continuo e independiente.', ['ESP-AIRE', 'P&ID-AC'], ['SIS-OQ-AC-013', 'SIS-PQ-AC-010']],
      ['Presión y capacidad', 'Funcional', 'El sistema cubre la demanda máxima sin caer bajo la presión mínima de ESP-AIRE.', ['ESP-AIRE', 'P&ID-AC'], ['SIS-OQ-AC-008', 'SIS-OQ-AC-009']],
      ['Cadena de filtración', 'Funcional / calidad', 'La cadena de filtros corresponde a P&ID-AC, está completa y sin bypass.', ['P&ID-AC'], ['SIS-IQ-AC-002', 'SIS-OQ-AC-021']],
      ['Distribución estanca', 'No funcional / calidad', 'La red no presenta fugas, retenciones ni ramales muertos según P&ID-AC.', ['P&ID-AC'], ['SIS-OQ-AC-023', 'SIS-OQ-AC-026']],
      ['Puntos de uso y purgas', 'No funcional / calidad', 'Cada punto de uso tiene regulador, purga e identificación conforme a P&ID-AC.', ['P&ID-AC'], ['SIS-IQ-AC-005', 'SIS-OQ-AC-028']],
      ['Instrumentación de calidad', 'No funcional / regulatorio', 'Presión, caudal y punto de rocío están calibrados, alarmados y registrados.', ['P&ID-AC', 'PLAN-VAL-AC'], ['SIS-IQ-AC-006', 'SIS-OQ-AC-032']],
      ['Falla del secador', 'No funcional / seguridad', 'Ante falla del secador, la alarma se activa y el uso se restringe o la calidad se mantiene.', ['PLAN-VAL-AC', 'P&ID-AC'], ['SIS-OQ-AC-005', 'SIS-PQ-AC-020']],
      ['Contacto con producto', 'Funcional / regulatorio', 'El aire en contacto directo cumple los límites de viables de ESP-AIRE.', ['ESP-AIRE', 'PLAN-MUESTREO-AC'], ['SIS-PQ-AC-013']],
      ['Registros y monitoreo de rutina', 'No funcional / regulatorio', 'El monitoreo de rutina y las tendencias se ejecutan según PLAN-MUESTREO-AC.', ['PLAN-MUESTREO-AC', 'PLAN-VAL-AC'], ['SIS-OQ-AC-034', 'SIS-PQ-AC-028']],
    ],
    risks: [
      ['Partículas, agua o aceite fuera de clase', 'Cadena de filtración, secado y muestreo de calidad'],
      ['Punto de rocío fuera de límite', 'Secador, alarma de rocío y verificación en continuo'],
      ['Presión insuficiente en demanda máxima', 'Capacidad, control de presión y prueba de demanda'],
      ['Bypass o filtro faltante', 'Revisión de P&ID y verificación de la cadena de filtros'],
      ['Fuga o retención en la red', 'Prueba de fugas, pendiente y revisión de ramales'],
      ['Punto de uso sin regulador o purga', 'Verificación de puntos de uso y purgas'],
      ['Instrumento descalibrado o sin registro', 'Calibración, alarmas y registro continuo'],
      ['Falla del secador no detectada', 'Alarma de rocío y prueba de falla'],
      ['Viables en contacto con producto', 'Muestreo microbiológico y control de humedad'],
      ['Monitoreo de rutina no ejecutado', 'Plan de muestreo y revisión de tendencias'],
    ],
  },
];

const E = (s) => esc(s);
const deps = (arr) => arr.map(E).join('<br>');

function filaReq(s, r, n) {
  const id = `URS-${s.code}-${String(n + 1).padStart(3, '0')}`;
  return { id, texto: r[0], tipo: r[1], criterio: r[2], depende: r[3], verifica: r[4] };
}

function filaRisk(s, r, n, req) {
  return {
    id: `AR-${s.code}-${String(n + 1).padStart(3, '0')}`,
    req,
    peligro: r[0],
    control: r[1],
    depende: [req.id, req.verifica[0]],
    verifica: req.verifica,
  };
}

function cabecera(s, tipo) {
  const otro = tipo === 'URS' ? 'AR' : 'URS';
  return `<p><a href="../sistemas.html">← Sistemas</a> · <a href="${s.id}.html">Ficha</a> · <a href="${tipo === 'URS' ? 'ar' : 'urs'}-${s.id}.html">${otro}-${s.code}-001</a></p>`;
}

function mapa(s, tipo) {
  const filas = [
    ['sec-3', 'Documentos de entrada y dependencias', 'Mismos documentos de entrada: las dependencias declaradas en la URS son las que alimentan el análisis de riesgos.'],
    ['sec-5', 'Requisitos / Riesgos', 'Correspondencia 1:1 por ID: cada URS-xx tiene su AR-xx y ningún AR evalúa un requisito que no exista en la URS.'],
    ['sec-6', 'Trazabilidad / Resumen', 'Los ensayos de verificación citados deben coincidir; la matriz de la URS y el resumen del AR se revisan juntos.'],
    ['sec-7', 'Flujo de firmas', 'Mismos roles, mismo alcance de revisión de ensayos y mismo orden de firma en ambos documentos.'],
    ['sec-8', 'Control de cambios', 'Un cambio aprobado en cualquiera de los dos documentos obliga a revisar el otro.'],
  ];
  const local = tipo === 'URS' ? 'URS' : 'AR';
  const remoto = `${tipo === 'URS' ? 'ar' : 'urs'}-${s.id}.html`;
  return filas.map(([sec, titulo, texto]) => {
    const ursLink = tipo === 'URS' ? `#${sec}` : `${remoto}#${sec}`;
    const arLink = tipo === 'URS' ? `${remoto}#${sec}` : `#${sec}`;
    return `<tr data-urs="${sec}" data-ar="${sec}">
  <td><a href="${ursLink}">URS · ${E(titulo)}</a></td>
  <td><a href="${arLink}">AR · ${E(titulo)}</a></td>
  <td>${E(texto)}</td>
</tr>`;
  }).join('\n');
}

function firmas(s) {
  return roles.map(([rol, nombre, responsabilidad, revisa, alcance]) => `<tr data-rol="${rol}" data-revisa="${revisa}">
  <td><strong>${E(nombre)}</strong></td>
  <td>${E(responsabilidad)}</td>
  <td>${E(alcance)}</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
</tr>`).join('\n');
}

const planVal = (s) => s.docs.find((d) => d[0].startsWith('PLAN-VAL-'))[0];

function documentos(s) {
  return s.docs.map(([code, nombre, relacion]) => `<tr data-ref="${code}">
  <td>${E(code)}</td>
  <td>${E(nombre)}</td>
  <td>PENDIENTE</td>
  <td>${E(relacion)}</td>
</tr>`).join('\n');
}

function urs(s) {
  const reqs = s.reqs.map((r, n) => filaReq(s, r, n));
  const risks = s.risks.map((r, n) => filaRisk(s, r, n, reqs[n]));
  const filas = reqs.map((r) => `<tr id="${r.id}" data-req="${r.id}" data-tipo="${r.tipo}" data-depende="${r.depende.join(' ')}" data-verifica="${r.verifica.join(' ')}" data-estado="PENDIENTE DE VALOR">
  <td><strong>${r.id}</strong></td>
  <td>${E(r.texto)}</td>
  <td>${E(r.tipo)}</td>
  <td>${E(r.criterio)}</td>
  <td class="dep">${deps(r.depende)}</td>
  <td class="ver">${deps(r.verifica)}</td>
  <td class="estado">PENDIENTE DE VALOR</td>
</tr>`).join('\n');
  const rtm = reqs.map((r) => `<tr><td>${r.id}</td><td>${r.verifica.filter((v) => v.includes('-IQ-')).join(', ') || '—'}</td><td>${r.verifica.filter((v) => v.includes('-OQ-')).join(', ') || '—'}</td><td>${r.verifica.filter((v) => v.includes('-PQ-')).join(', ') || '—'}</td></tr>`).join('\n');
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Tahoma, sans-serif; font-size: 11pt; }
  strong { text-transform: uppercase; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #999; padding: 4px; vertical-align: top; }
  th { background: #eee; }
  .pendiente, .estado { background: #fff4d6; }
</style>
<title>URS — ${E(s.nombre)}</title>
</head>
<body>
${cabecera(s, 'URS')}
<article class="documento" data-doc="URS" data-sistema="${s.id}" data-codigo="URS-${s.code}-001" data-version="1.0" data-estado="BORRADOR">
<h1>URS — ${E(s.nombre)}</h1>
<p><strong>Código:</strong> URS-${s.code}-001 · <strong>Versión:</strong> 1.0 · <strong>Estado:</strong> BORRADOR</p>
<p>Documento complementario: <a href="ar-${s.id}.html">AR-${s.code}-001 — Análisis de riesgos</a>. El mapa de §4 declara qué apartados se complementan y cada campo con dependencia la nombra en su columna.</p>

<section id="sec-1">
<h2>1. Objetivo</h2>
<p>${E(s.objetivo)}</p>
</section>

<section id="sec-2">
<h2>2. Alcance</h2>
<p>${E(s.alcance)}</p>
<p><strong>Referencias normativas:</strong> ${s.normas.map(E).join('; ')}.</p>
</section>

<section id="sec-3">
<h2>3. Documentos de entrada y dependencias</h2>
<p>Los requisitos toman valores, límites y ubicaciones de estos documentos. Si un documento no está aprobado, el requisito queda PENDIENTE DE VALOR y no se libera el sistema.</p>
<table>
<tr><th>Código</th><th>Documento</th><th>Versión</th><th>Qué aporta al requisito</th></tr>
${documentos(s)}
</table>
</section>

<section id="sec-4">
<h2>4. Mapa de complementariedad URS ↔ AR</h2>
<p>La URS define <strong>qué debe cumplir</strong> el sistema; el AR define <strong>qué puede fallar</strong> y cómo se controla. No se duplican: cada documento referencia al otro por sección.</p>
<table>
<tr><th>Apartado URS</th><th>Apartado AR</th><th>Cómo se complementan</th></tr>
${mapa(s, 'URS')}
</table>
</section>

<section id="sec-5">
<h2>5. Requisitos</h2>
<p>Toda fila declara en <strong>Depende de</strong> los documentos o IDs de los que toma el valor, y en <strong>Verificación</strong> el ensayo del protocolo que lo demuestra.</p>
<table>
<tr><th>ID</th><th>Requisito</th><th>Tipo</th><th>Criterio de aceptación</th><th>Depende de</th><th>Verificación</th><th>Estado</th></tr>
${filas}
</table>
</section>

<section id="sec-6">
<h2>6. Matriz de trazabilidad URS → protocolo</h2>
<table>
<tr><th>Requisito</th><th>IQ</th><th>OQ</th><th>PQ</th></tr>
${rtm}
</table>
</section>

<section id="sec-7">
<h2>7. Flujo de firmas y revisión</h2>
<p>Cada rol revisa los ensayos de su alcance antes de firmar. La firma no sustituye la revisión: el revisor deja constancia de los ensayos revisados en el expediente.</p>
<table>
<tr><th>Rol</th><th>Responsabilidad</th><th>Ensayos que revisa</th><th>Nombre</th><th>Firma</th><th>Fecha</th></tr>
${firmas(s)}
</table>
</section>

<section id="sec-8">
<h2>8. Control de cambios</h2>
<table>
<tr><th>Versión</th><th>Fecha</th><th>Cambio</th><th>Aprobado por</th></tr>
<tr><td>1.0</td><td>2026-11-17</td><td>Emisión inicial del par URS/AR del sistema.</td><td>PENDIENTE</td></tr>
</table>
</section>
</article>
</body>
</html>
`;
  return { reqs, risks, html };
}

function ar(s) {
  const { reqs, risks } = urs(s);
  const filas = risks.map((r) => `<tr data-risk="${r.id}" data-req="${r.req.id}" data-depende="${r.depende.join(' ')}" data-verifica="${r.verifica.join(' ')}" data-estado="POR EVALUAR">
  <td><strong>${r.id}</strong></td>
  <td>${E(r.peligro)}</td>
  <td><a href="urs-${s.id}.html#${r.req.id}">${r.req.id}</a></td>
  <td>POR EVALUAR</td>
  <td>POR EVALUAR</td>
  <td>POR EVALUAR</td>
  <td>POR EVALUAR</td>
  <td>${E(r.control)}</td>
  <td>${deps(r.verifica)}</td>
  <td class="dep">${deps(r.depende)}</td>
  <td class="estado">POR EVALUAR</td>
</tr>`).join('\n');
  const porFase = ['IQ', 'OQ', 'PQ'].map((f) => {
    const n = reqs.filter((r) => r.verifica.some((v) => v.includes(`-${f}-`))).length;
    return `<tr><td>${f}</td><td>${n}</td></tr>`;
  }).join('\n');
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Tahoma, sans-serif; font-size: 11pt; }
  strong { text-transform: uppercase; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #999; padding: 4px; vertical-align: top; }
  th { background: #eee; }
  .pendiente, .estado { background: #fff4d6; }
</style>
<title>AR — ${E(s.nombre)}</title>
</head>
<body>
${cabecera(s, 'AR')}
<article class="documento" data-doc="AR" data-sistema="${s.id}" data-codigo="AR-${s.code}-001" data-version="1.0" data-estado="BORRADOR">
<h1>AR — Análisis de riesgos — ${E(s.nombre)}</h1>
<p><strong>Código:</strong> AR-${s.code}-001 · <strong>Versión:</strong> 1.0 · <strong>Estado:</strong> BORRADOR</p>
<p>Documento complementario: <a href="urs-${s.id}.html">URS-${s.code}-001 — Requisitos de usuario</a>. El mapa de §4 declara qué apartados se complementan y cada campo con dependencia la nombra en su columna.</p>

<section id="sec-1">
<h2>1. Objetivo</h2>
<p>Evaluar los riesgos asociados a los requisitos de la URS de ${E(s.nombre)} y declarar el control que los reduce a un nivel aceptable, antes de la calificación.</p>
</section>

<section id="sec-2">
<h2>2. Alcance</h2>
<p>${E(s.alcance)}</p>
</section>

<section id="sec-3">
<h2>3. Metodología</h2>
<p>FMEA por requisito. Escalas de 1 a 5:</p>
<table>
<tr><th>Escala</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
<tr><td>Severidad (S)</td><td>Sin impacto en producto</td><td>Impacto menor</td><td>Impacto en calidad</td><td>Impacto en seguridad o producto estéril</td><td>Impacto crítico / regulatorio</td></tr>
<tr><td>Probabilidad (P)</td><td>Remota</td><td>Poco probable</td><td>Posible</td><td>Probable</td><td>Frecuente</td></tr>
<tr><td>Detectabilidad (D)</td><td>Detectado siempre</td><td>Alta detección</td><td>Detección media</td><td>Baja detección</td><td>No detectable</td></tr>
</table>
<p>Nivel de riesgo = S × P × D. Los umbrales de aceptación y la necesidad de acción se definen en el plan de validación del sistema (${planVal(s)}); hasta su aprobación, el nivel queda POR EVALUAR.</p>
</section>

<section id="sec-4">
<h2>4. Mapa de complementariedad AR ↔ URS</h2>
<p>El AR no crea requisitos: cada fila nace de un requisito de la URS y declara el control y el ensayo que lo verifica.</p>
<table>
<tr><th>Apartado URS</th><th>Apartado AR</th><th>Cómo se complementan</th></tr>
${mapa(s, 'AR')}
</table>
</section>

<section id="sec-5">
<h2>5. Riesgos por requisito</h2>
<p>Sev., Prob. y Detec. quedan POR EVALUAR hasta que el responsable técnico los califique y apruebe. La columna <strong>Depende de</strong> nombra el requisito y el ensayo de los que toma el control.</p>
<table>
<tr><th>ID</th><th>Peligro / modo de falla</th><th>Requisito URS</th><th>Sev.</th><th>Prob.</th><th>Detec.</th><th>Nivel</th><th>Control / requisito derivado</th><th>Verificación</th><th>Depende de</th><th>Estado</th></tr>
${filas}
</table>
</section>

<section id="sec-6">
<h2>6. Resumen</h2>
<table>
<tr><th>Fase que verifica el control</th><th>Requisitos cubiertos</th></tr>
${porFase}
<tr><td>Riesgos registrados</td><td>${risks.length}</td></tr>
<tr><td>Riesgos evaluados</td><td>0 (todos POR EVALUAR)</td></tr>
</table>
</section>

<section id="sec-7">
<h2>7. Flujo de firmas y revisión</h2>
<p>Cada rol revisa las filas de su alcance y los ensayos citados antes de firmar; el aprobador no firma con riesgos sin evaluar o sin control.</p>
<table>
<tr><th>Rol</th><th>Responsabilidad</th><th>Ensayos que revisa</th><th>Nombre</th><th>Firma</th><th>Fecha</th></tr>
${firmas(s)}
</table>
</section>

<section id="sec-8">
<h2>8. Control de cambios</h2>
<table>
<tr><th>Versión</th><th>Fecha</th><th>Cambio</th><th>Aprobado por</th></tr>
<tr><td>1.0</td><td>2026-11-17</td><td>Emisión inicial del par URS/AR del sistema.</td><td>PENDIENTE</td></tr>
</table>
</section>
</article>
</body>
</html>
`;
  return { html };
}

for (const s of sistemas) {
  const u = urs(s);
  const a = ar(s);
  writeFileSync(join(out, `urs-${s.id}.html`), u.html);
  writeFileSync(join(out, `ar-${s.id}.html`), a.html);
  console.log(`urs-${s.id}.html · ar-${s.id}.html — ${u.reqs.length} requisitos, ${u.risks.length} riesgos`);
}
