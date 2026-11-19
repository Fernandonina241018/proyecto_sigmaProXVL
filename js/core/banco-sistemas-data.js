// Generado por scripts/extraer-banco.mjs sistemas — NO EDITAR A MANO.
// Fuente: docs/banco-ensayos/sistemas/iq-agua-purificada.html + docs/banco-ensayos/sistemas/iq-hvac.html + docs/banco-ensayos/sistemas/iq-vapor-limpio.html + docs/banco-ensayos/sistemas/iq-aire-comprimido.html + docs/banco-ensayos/sistemas/oq-agua-purificada.html + docs/banco-ensayos/sistemas/pq-agua-purificada.html + docs/banco-ensayos/sistemas/oq-hvac.html + docs/banco-ensayos/sistemas/pq-hvac.html + docs/banco-ensayos/sistemas/oq-vapor-limpio.html + docs/banco-ensayos/sistemas/pq-vapor-limpio.html + docs/banco-ensayos/sistemas/oq-aire-comprimido.html + docs/banco-ensayos/sistemas/pq-aire-comprimido.html (versión: SIS-IQ-AP 2026-11-18 v2 + SIS-IQ-HV 2026-10-24 v1 + SIS-IQ-VL 2026-10-24 v1 + SIS-IQ-AC 2026-10-24 v1 + SIS-OQ-AP 2026-11-18 v2 + SIS-PQ-AP 2026-11-18 v2 + SIS-OQ-HV 2026-10-14 v1 + SIS-PQ-HV 2026-10-14 v1 + SIS-OQ-VL 2026-10-14 v1 + SIS-PQ-VL 2026-10-14 v1 + SIS-OQ-AC 2026-10-15 v1 + SIS-PQ-AC 2026-10-15 v1).
var BancoSistemas = {
 "version": "SIS-IQ-AP 2026-11-18 v2 + SIS-IQ-HV 2026-10-24 v1 + SIS-IQ-VL 2026-10-24 v1 + SIS-IQ-AC 2026-10-24 v1 + SIS-OQ-AP 2026-11-18 v2 + SIS-PQ-AP 2026-11-18 v2 + SIS-OQ-HV 2026-10-14 v1 + SIS-PQ-HV 2026-10-14 v1 + SIS-OQ-VL 2026-10-14 v1 + SIS-PQ-VL 2026-10-14 v1 + SIS-OQ-AC 2026-10-15 v1 + SIS-PQ-AC 2026-10-15 v1",
 "fases": {
  "IQ": [
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Este protocolo cubre agua purificada (PW) y agua para inyección (WFI). El tipo de agua se declara en la portada antes de la ejecución; los ensayos marcados «solo WFI» se declaran No Aplica con aprobación previa de Calidad cuando el sistema no produce WFI, y no se eliminan del protocolo aprobado.</p>",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AP-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AP-001 — Verificación de red de distribución y materiales",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la red de distribución de agua purificada está construida con materiales compatibles, sin puntos muertos y con pendiente adecuada para drenaje."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar materiales de tuberías, válvulas y accesorios (acero inoxidable 316L o equivalente aprobado)<br>\n  2) Verificar ausencia de puntos muertos (legs ciegos) en la red de distribución<br>\n  3) Verificar pendiente de tuberías hacia puntos de drenaje (mínimo 1-3% según diseño)<br>\n  4) Verificar soldaduras y uniones: terminación sanitaria, sin grietas ni porosidad<br>\n  5) Verificar identificaciones de tuberías: contenido, dirección de flujo, número de línea<br>\n  6) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Materiales de tuberías, válvulas y accesorios en acero inoxidable 316L o equivalente aprobado, con certificados de material disponibles.<br>Rugosidad interna Ra ≤ <span class=\"por-confirmar\">0,8 µm</span> (ASME BPE) en superficies de contacto.<br>Soldaduras sanitarias, sin puntos muertos (L/D ≤ 3) y pendiente ≥ 1 % hacia el drenaje.<br>Sin fugas visibles en uniones, válvulas ni accesorios."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz material-diseño-vs-instalado<br>\n  - Registro fotográfico de tuberías y uniones (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La rugosidad y la pendiente en rojo deben confirmarse contra la especificación de diseño y el plano isométrico aprobado."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; ASME BPE; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AP-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AP-002 — Verificación de puntos de uso y tomas de muestra",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los puntos de uso y tomas de muestra están instalados en ubicaciones correctas, con válvulas de purga y drenaje adecuadas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar cada punto de uso y toma de muestra contra el plano de distribución<br>\n  2) Verificar ubicación, altura y accesibilidad para operación y muestreo<br>\n  3) Verificar válvulas de purga y drenaje en cada punto de uso<br>\n  4) Verificar dispositivos de retorno (si aplican) para mantener circulación en circuito cerrado<br>\n  5) Verificar identificaciones y etiquetas en cada punto de uso<br>\n  6) Registrar cada punto de uso en la tabla correspondiente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>El 100 % de los puntos de uso y tomas de muestra coincide con el plano isométrico aprobado.<br>Cada punto tiene válvula sanitaria de diafragma y drenaje previo al muestreo.<br>Identificación completa: contenido, dirección de flujo y número de línea.<br>Altura y accesibilidad permiten muestrear sin riesgo de contaminación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de puntos de uso (ubicación, tipo, válvula de purga)<br>\n  - Plano de distribución con puntos de uso marcados"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los puntos que no coincidan con el plano se registran como desviación; no se reimplan sin control de cambios."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; PDA TR-64; ISPE Baseline Guide Vol. 4; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AP-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AP-003 — Verificación de sistema de sanitización",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema de sanitización (ozono, agua caliente, productos químicos) está instalado y configurado para mantener la calidad microbiológica del agua."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar método de sanitización: agua caliente (≥80°C), ozono o desinfectante químico aprobado<br>\n  2) Verificar equipo de sanitización instalado: generador de ozono, intercambiador de calor, dosificadora<br>\n  3) Verificar puntos de inyección y contacto con el agua<br>\n  4) Verificar registros de parámetros de sanitización: temperatura, concentración, tiempo de contacto<br>\n  5) Verificar procedimiento de sanitización escrito y aprobado<br>\n  6) Registrar configuración del sistema de sanitización"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Método de sanitización instalado y declarado: agua caliente ≥ <span class=\"por-confirmar\">80 °C</span>, ozono o desinfectante químico aprobado.<br>Capacidad del sistema verificada para alcanzar la condición en todos los puntos, incluido el retorno.<br>Instrumentos de control (temperatura, ozono, concentración) instalados y calibrados.<br>Procedimiento de sanitización escrito y aprobado, disponible para el ejecutor."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Descripción del sistema de sanitización instalado<br>\n  - Procedimiento de sanitización aprobado<br>\n  - Registro de parámetros de sanitización"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La temperatura en rojo debe adoptarse del procedimiento de sanitización del sitio; el IQ verifica que el sistema pueda alcanzarla, no la ejecuta."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4; EU GMP Anexo 15; 21 CFR 211.67."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AP-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AP-004 — Verificación de estanqueidad de la red",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la red de distribución de agua purificada no presenta fugas y mantiene la presión de operación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Realizar prueba de presión de la red con agua o aire según procedimiento de ingeniería<br>\n  2) Verificar manómetros: calibración vigente, rango adecuado<br>\n  3) Monitorear caída de presión durante el período de prueba definido<br>\n  4) Inspeccionar uniones, válvulas y accesorios en busca de fugas visibles<br>\n  5) Registrar presión inicial, final y duración de la prueba<br>\n  6) Registrar cualquier fuga detectada con ubicación y medida correctiva"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Prueba de estanqueidad a <span class=\"por-confirmar\">1,5 × presión de operación</span> durante 30 min, o a la presión de diseño documentada.<br>Caída de presión ≤ <span class=\"por-confirmar\">5 %</span> del valor inicial y sin fugas visibles.<br>Registro con presión inicial y final, hora, instrumento y responsable.<br>Sin deformación ni movimiento de soportes durante la prueba."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de prueba de estanqueidad (presión inicial/final, duración)<br>\n  - Reporte de fugas detectadas y medidas correctivas (si aplica)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La presión de prueba y la caída aceptable en rojo dependen del diseño hidráulico; se confirman antes de ejecutar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE; EU GMP Anexo 15; 21 CFR 211.63."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AP-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AP-005 — Verificación de instrumentos de medición (conductividad, TOC)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los instrumentos de medición en línea (conductividad, TOC, temperatura) están instalados, identificados y con calibración vigente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar instrumentos en línea: conductividad, TOC, temperatura, pH (si aplica)<br>\n  2) Verificar ubicación: puntos representativos de la red (distal, proximal, puntos críticos)<br>\n  3) Verificar etiqueta de calibración vigente por instrumento<br>\n  4) Verificar conexión al sistema de control/registro de datos<br>\n  5) Verificar alarmas configuradas: límites de alerta y acción para cada parámetro<br>\n  6) Registrar cada instrumento en la tabla de instrumentos de medición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>El 100 % de los instrumentos en línea (conductividad, TOC, temperatura, flujo) está instalado en ubicación representativa del agua usada.<br>Certificado de calibración vigente (≤ <span class=\"por-confirmar\">12 meses</span>) y trazable a patrón nacional.<br>Alarmas configuradas en el límite de alerta y de acción (<span class=\"por-confirmar\">1,3 µS/cm</span> y <span class=\"por-confirmar\">500 ppb</span>).<br>Identificación del instrumento y de su punto de instalación en el plano."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de instrumentos en línea (modelo/serie/ubicación/certificado)<br>\n  - Copias de certificados de calibración<br>\n  - Captura de pantalla de alarmas configuradas"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites en rojo corresponden a USP &lt;645&gt; y &lt;643&gt;; la vigencia de calibración es la del programa del sitio y debe confirmarse."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;645&gt;; USP &lt;643&gt;; ISO/IEC 17025; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AP-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AP-006 — Verificación de válvulas y puntos muertos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las válvulas están instaladas correctamente, sin puntos muertos que comprometan la calidad del agua, y con función de drenaje adecuada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar cada válvula: tipo, ubicación, función (corte, control, purga, drenaje)<br>\n  2) Verificar operación: apertura/cierre suave, sin fugas en asiento ni empaque<br>\n  3) Verificar ausencia de puntos muertos en configuración de válvulas<br>\n  4) Verificar válvulas de drenaje en puntos bajos de la red<br>\n  5) Verificar válvulas de alivio de presión (si aplica)<br>\n  6) Registrar cada válvula en la tabla correspondiente con su estatus"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Válvulas sanitarias de diafragma, sin cavidades ni sellos que retengan agua.<br>L/D ≤ <span class=\"por-confirmar\">3</span> en cada ramal; sin bolsas ni contrapendientes.<br>Válvulas de drenaje en los puntos bajos y en el retorno.<br>El 100 % de las válvulas inspeccionadas contra plano, con operación verificada y sin fugas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de válvulas (tipo/ubicación/función/estatus)<br>\n  - Registro fotográfico de válvulas críticas (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El criterio L/D en rojo debe adoptarse antes de medir (2D o 3D); se registra la medición real por ramal."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE; ISPE Baseline Guide Vol. 4; USP &lt;1231&gt;."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AP-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AP-007 — Verificación de registros y trazabilidad del sistema de agua",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema genera registros de calidad del agua (conductividad, TOC, temperatura, flujo) con trazabilidad y que los datos están protegidos según 21 CFR Parte 11."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar sistema de registro de datos: servidor, base de datos, software de adquisición<br>\n  2) Verificar parámetros registrados: conductividad, TOC, temperatura, caudal, presión<br>\n  3) Verificar frecuencia de registro y periodo de retención de datos<br>\n  4) Verificar integridad de datos: audit trail, acceso restringido, firma electrónica (si aplica)<br>\n  5) Verificar copias de seguridad y recuperación de datos<br>\n  6) Registrar configuración del sistema de registro"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Registro automático de los parámetros críticos: conductividad, TOC, temperatura y flujo.<br>Audit trail activo con usuario único, fecha, hora y valor anterior y nuevo; sin posibilidad de borrado.<br>Respaldo definido y restauración probada al menos una vez.<br>Acceso restringido por rol y retención de registros ≥ <span class=\"por-confirmar\">1 año</span> o la política del sitio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Configuración del sistema de registro de datos<br>\n  - Evidencia de audit trail activo<br>\n  - Procedimiento de copias de seguridad"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La retención en rojo debe confirmarse con la política de registros; el respaldo se prueba, no se declara."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR Parte 11; EU GMP Anexo 11; ALCOA+; 21 CFR 211.180."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "resumen",
    "id": "SIS-IQ-AP-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-IQ-AP-RES — Tabla resumen de los ensayos del IQ de agua purificada",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar en una matriz el resultado de todos los ensayos IQ de agua purificada como acta de cierre de la fase."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar los ensayos del protocolo (<span class=\"lista-resumen\" data-fase-lista=\"IQ\"></span>) con su veredicto (C/NC/NA) y fecha de ejecución<br>\n  2) Justificar cada ensayo declarado No Aplica<br>\n  3) Listar desviaciones abiertas con su estado y plan de cierre<br>\n  4) Firmar el acta de cierre IQ de agua purificada"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100% de ensayos IQ de agua purificada ejecutados o justificados como No Aplica; cero desviaciones críticas abiertas; acta firmada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz resumen IQ de agua purificada firmada<br>\n  - Acta de cierre de fase IQ de agua purificada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EU GMP Anexo 15 — Calificación y validación</span>."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "tabla",
    "id": "SIS-IQ-AP-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-IQ-AP-REF — Referencias del IQ de agua purificada",
    "secciones": [],
    "tabla": {
     "headers": [
      "N°",
      "Documento",
      "Código / Versión"
     ],
     "rows": [
      [
       "1",
       "USP <1231> — Agua para usos farmacéuticos",
       "Edición vigente"
      ],
      [
       "2",
       "EU GMP Parte II — Requisitos para agua purificada y WFI",
       "Vigente"
      ],
      [
       "3",
       "PDA TR-64 — Qualification Guidance",
       "Edición vigente"
      ],
      [
       "4",
       "21 CFR Parte 11 — Registros electrónicos y firmas electrónicas",
       "Vigente"
      ],
      [
       "5",
       "EU GMP Anexo 11 — Sistemas informatizados",
       "Vigente"
      ],
      [
       "6",
       "EU GMP Anexo 15 — Calificación y validación",
       "Vigente"
      ],
      [
       "7",
       "______",
       "______"
      ]
     ]
    },
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<ul>\n  <li>Anexo A — Matriz material-diseño-vs-instalado de la red</li>\n  <li>Anexo B — Certificados de calibración de instrumentos en línea</li>\n  <li>Anexo C — Plano de distribución con puntos de uso y tomas de muestra</li>\n  <li>Anexo D — Registro de prueba de estanqueidad</li>\n</ul>",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "HVAC-IQ-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "HVAC-IQ-002 — Verificación de UMA y componentes mecánicos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las Unidades de Tratamiento de Aire (UMA), ventiladores, serpentines y componentes mecánicos están instalados conforme al diseño y las especificaciones del fabricante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar modelo, número de serie y capacidad de cada UMA<br>\n  2) Verificar instalación física contra plano as-built: ubicación, anclaje, accesibilidad para mantenimiento<br>\n  3) Inspeccionar serpentines de calefacción, refrigeración y humidificación: sin fugas, sin daños, fijados correctamente<br>\n  4) Verificar ventiladores: dirección de giro, correas, poleas, cojinetes lubricados<br>\n  5) Verificar drenajes de bandeja de condensados con pendiente adecuada y sifón funcionando<br>\n  6) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los componentes mecánicos corresponden al diseño aprobado.<br>\n  Sin fugas, daños ni componentes sueltos.<br>\n  Accesibilidad para mantenimiento garantizada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico de UMA y componentes (anexo del informe)<br>\n  - Checklist de verificación mecánica firmado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EU GMP Anexo 1 — Fabricación de productos estériles</span>; ISO 14644-1."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "HVAC-IQ-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "HVAC-IQ-003 — Verificación de filtros HEPA y clasificación de aire",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los filtros HEPA instalados corresponden a la clase de filtración especificada y que la clasificación de área (grado A/B/C/D) se mantiene según el diseño."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar cada filtro HEPA: ubicación, posición en el plenum o terminal de difusor<br>\n  2) Verificar certificado de fábrica de cada filtro: clase EN 1822 (H13/H14), número de serie, prueba de fuga integridad<br>\n  3) Verificar marcos y juntas: sin daños, asentamiento correcto, sin vías de derivación (bypass)<br>\n  4) Verificar etiquetado de filtros con fecha de instalación y fecha de reemplazo prevista<br>\n  5) Confirmar que la clasificación de aire del área coincide con el grado especificado en la URS"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada filtro HEPA cuenta con certificado de fábrica trazable a su número de serie.<br>\n  Marcos y juntas sin daños, sin vías de derivación.<br>\n  Clasificación de aire conforme al grado especificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Certificados de fábrica de filtros HEPA<br>\n  - Registro de filtros instalados (ubicación, serie, fecha de instalación)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EN 1822 — Filtros de partículas de alta eficiencia (EPA, HEPA, ULPA)</span>; ISO 14644-3."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "HVAC-IQ-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "HVAC-IQ-004 — Verificación de sensores de temperatura, humedad y presión diferencial",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los sensores T/H y de presión diferencial están instalados en las ubicaciones correctas, identificados y con calibración vigente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inventariar sensores: modelo, número de serie, ubicación, rango de medida<br>\n  2) Verificar ubicación contra plano de puntos de monitoreo: retornos, suministro, áreas críticas<br>\n  3) Verificar etiqueta de calibración vigente por sensor<br>\n  4) Confirmar setpoints configurados en el sistema de control (BMS/SCADA): temperatura, humedad relativa, presión diferencial<br>\n  5) Verificar conectividad y transmisión de señal al sistema de control central<br>\n  6) Registrar cada sensor en la tabla de instrumentos de medición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100% de sensores instalados en ubicación correcta según plano.<br>\n  Etiqueta de calibración vigente por sensor.<br>\n  Setpoints configurados coinciden con la URS."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de instrumentos de medición (modelo/serie/ubicación/certificado)<br>\n  - Copias de certificados de calibración<br>\n  - Captura de pantalla de setpoints en BMS/SCADA"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO/IEC 17025 — Competencia de laboratorios de ensayo y calibración</span>; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "HVAC-IQ-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "HVAC-IQ-005 — Verificación de ductos y distribución de aire",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los ductos, difusores, retornos y registro de aire están instalados conforme al plano as-built, sin fugas ni obstrucciones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recorrido con plano as-built identificando ductos de suministro, retorno y extracción<br>\n  2) Verificar diámetro, material y aislamiento de ductos contra especificaciones<br>\n  3) Inspeccionar difusores, rejillas y retornos: ubicación, orientación, sin obstrucciones<br>\n  4) Verificar registros de volumen y cortafuegos: funcionamiento, identificación<br>\n  5) Verificar estanqueidad de uniones y conexiones (sin fugas visibles)<br>\n  6) Registrar diferencias plano-vs-instalado con justificación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ductos y componentes corresponden al plano as-built.<br>\n  Sin fugas, obstrucciones ni componentes sin identificar.<br>\n  Diferencias documentadas y justificadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano as-built con ductos verificados y firmado<br>\n  - Matriz ducto-vs-instalado<br>\n  - Registro fotográfico de difusores y retornos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EU GMP Anexo 1 — Fabricación de productos estériles</span>; ASHRAE Handbook HVAC Applications."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "HVAC-IQ-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "HVAC-IQ-006 — Verificación de sistemas de control y alarmas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema de control (BMS/SCADA/PLC) del HVAC opera correctamente, con alarmas configuradas y funciones de seguridad activas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar lógica de control: secuenciamiento de arranque/parada, modos de operación<br>\n  2) Verificar alarmas configuradas: alta/baja temperatura, alta/baja HR, alta/baja presión diferencial, falla de filtro<br>\n  3) Verificar simulación de alarma: activación, visualización en BMS, notificación al responsable<br>\n  4) Verificar interconexión con sistema de gestión de edificios (BMS) o SCADA<br>\n  5) Verificar respaldo de energía (UPS/generador) para equipos críticos de control<br>\n  6) Registrar configuración de alarmas y resultados de pruebas"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Lógica de control opera según especificación.<br>\n  Alarmas configuradas y funcionales para todos los parámetros críticos.<br>\n  Respaldo de energía verificado para equipos de control."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de configuración de alarmas (BMS/SCADA)<br>\n  - Pruebas de activación de alarma (captura de pantalla/log)<br>\n  - Verificación de respaldo de energía"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EU GMP Anexo 11 — Sistemas informatizados</span>; 21 CFR Parte 11."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "HVAC-IQ-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "HVAC-IQ-007 — Verificación de renovaciones de aire y flujo unidireccional",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las renovaciones de aire por hora (ACH) y el patrón de flujo (unidireccional o turbulento) corresponden al grado de clasificación del área."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar número de renovaciones de aire calculado contra diseño (ACH = caudal/volumen)<br>\n  2) Verificar velocidad de aire en difusores de suministro (m/s)<br>\n  3) Verificar patrón de flujo visual (cintas de humo o similar) en áreas de grado A/B<br>\n  4) Verificar dirección del flujo de aire entre zonas de diferente clasificación (de más limpio a menos limpio)<br>\n  5) Registrar mediciones y observaciones de flujo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Renovaciones de aire dentro del rango especificado para el grado del área.<br>\n  Patrón de flujo conforme al diseño (unidireccional en grado A/B).<br>\n  Dirección de flujo de aire entre zonas correcta."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de mediciones de caudal y velocidad de aire<br>\n  - Prueba visual de patrón de flujo (fotos/video)<br>\n  - Cálculo de ACH por área"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO 14644-1 — Clasificación de limpieza del aire en salas limpias</span>; EU GMP Anexo 1."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "HVAC-IQ-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "HVAC-IQ-008 — Verificación de registros de calibración de instrumentos HVAC",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que todos los instrumentos de medición asociados al HVAC (manómetros, termómetros, higrómetros, transmisores de presión) cuentan con calibración vigente y trazable."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar todos los instrumentos de medición del sistema HVAC<br>\n  2) Verificar certificado de calibración vigente por instrumento (no vencido)<br>\n  3) Verificar trazabilidad a patrones nacionales o internacionales<br>\n  4) Verificar incertidumbre declarada en el certificado<br>\n  5) Anexar certificados al legajo de calificación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100% de instrumentos con certificado de calibración vigente.<br>\n  Trazabilidad a patrones reconocidos.<br>\n  Incertidumbre declarada compatible con el uso previsto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de instrumentos HVAC con certificado de calibración<br>\n  - Copias de certificados de calibración (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO/IEC 17025 — Calibración trazable a patrones nacionales o internacionales</span>."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "resumen",
    "id": "HVAC-IQ-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "HVAC-IQ-RES — Tabla resumen de los ensayos del IQ de HVAC",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar en una matriz el resultado de todos los ensayos IQ de HVAC como acta de cierre de la fase."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar los ensayos del protocolo (<span class=\"lista-resumen\" data-fase-lista=\"IQ\"></span>) con su veredicto (C/NC/NA) y fecha de ejecución<br>\n  2) Justificar cada ensayo declarado No Aplica<br>\n  3) Listar desviaciones abiertas con su estado y plan de cierre<br>\n  4) Firmar el acta de cierre IQ de HVAC"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100% de ensayos IQ de HVAC ejecutados o justificados como No Aplica; cero desviaciones críticas abiertas; acta firmada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz resumen IQ de HVAC firmada<br>\n  - Acta de cierre de fase IQ de HVAC"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EU GMP Anexo 15 — Calificación y validación</span>."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "tabla",
    "id": "HVAC-IQ-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "HVAC-IQ-REF — Referencias del IQ de HVAC",
    "secciones": [],
    "tabla": {
     "headers": [
      "N°",
      "Documento",
      "Código / Versión"
     ],
     "rows": [
      [
       "1",
       "EU GMP Anexo 1 — Fabricación de productos estériles",
       "Vigente"
      ],
      [
       "2",
       "ISO 14644-1 — Clasificación de limpieza del aire en salas limpias",
       "Edición vigente"
      ],
      [
       "3",
       "ISO 14644-3 — Métodos de ensayo para salas limpias",
       "Edición vigente"
      ],
      [
       "4",
       "EN 1822 — Filtros de partículas de alta eficiencia",
       "Edición vigente"
      ],
      [
       "5",
       "ASHRAE Handbook — HVAC Applications",
       "Edición vigente"
      ],
      [
       "6",
       "EU GMP Anexo 15 — Calificación y validación",
       "Vigente"
      ],
      [
       "7",
       "______",
       "______"
      ]
     ]
    },
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<ul>\n  <li>Anexo A — Certificados de fábrica de filtros HEPA</li>\n  <li>Anexo B — Certificados de calibración de sensores e instrumentos</li>\n  <li>Anexo C — Plano as-built de ductos y distribución de aire</li>\n  <li>Anexo D — Registro de configuración de alarmas (BMS/SCADA)</li>\n</ul>",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-VL-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-VL-001 — Verificación de generador de vapor limpio",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el generador de vapor limpio está instalado conforme al diseño, con materiales adecuados y capacidad suficiente para la demanda del sistema."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar modelo, número de serie y capacidad del generador de vapor limpio<br>\n  2) Verificar materiales de construcción (acero inoxidable 316L o equivalente aprobado para contacto con vapor)<br>\n  3) Verificar instalación física: ubicación, anclaje, accesibilidad para mantenimiento<br>\n  4) Verificar conexión de agua de alimentación: calidad, presión, caudal<br>\n  5) Verificar conexión de energía: eléctrica o según tipo de generador<br>\n  6) Verificar salidas de vapor: diámetro, material, aislamiento<br>\n  7) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Generador de vapor limpio instalado conforme a especificaciones.<br>\n  Materiales compatibles con vapor limpio (contacto con producto).<br>\n  Capacidad suficiente para la demanda del sistema."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico del generador de vapor limpio (anexo del informe)<br>\n  - Ficha técnica y certificado del fabricante"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EN 285 — Esterilizadores a vapor de gran capacidad</span>; EU GMP Anexo 1."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-VL-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-VL-002 — Verificación de red de distribución de vapor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la red de distribución de vapor limpio está instalada con materiales compatibles, pendiente adecuada y puntos de drenaje para evitar acumulados de condensado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar materiales de tuberías y válvulas (acero inoxidable 316L o equivalente)<br>\n  2) Verificar pendiente de tuberías hacia puntos de drenaje (mínimo 1-3% según diseño)<br>\n  3) Verificar trampas de vapor (steam traps) en puntos bajos y finales de ramal<br>\n  4) Verificar válvulas de alivio y seguridad en la red<br>\n  5) Verificar identificaciones de tuberías: contenido, dirección de flujo, número de línea<br>\n  6) Verificar ausencia de puntos muertos en la red de distribución<br>\n  7) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Materiales conforme a especificación de diseño.<br>\n  Pendiente y drenaje adecuados hacia puntos de drenaje.<br>\n  Trampas de vapor instaladas en puntos bajos y finales de ramal.<br>\n  Sin puntos muertos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz material-diseño-vs-instalado de la red de vapor<br>\n  - Registro fotográfico de trampas de vapor y válvulas (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EN 285 — Esterilizadores a vapor de gran capacidad</span>; EU GMP Parte II."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-VL-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-VL-003 — Verificación de puntos de uso y trampas de vapor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los puntos de uso de vapor limpio están instalados con válvulas de corte, drenaje y trampas adecuadas para entregar vapor de calidad al proceso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar cada punto de uso contra el plano de distribución<br>\n  2) Verificar válvula de corte en cada punto de uso<br>\n  3) Verificar trampa de vapor o drenaje en cada punto de uso para eliminar condensado<br>\n  4) Verificar filtros de vapor (si aplican) en puntos críticos<br>\n  5) Verificar identificaciones y etiquetas en cada punto de uso<br>\n  6) Registrar cada punto de uso en la tabla correspondiente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Puntos de uso con válvula de corte y drenaje/trampa.<br>\n  Identificaciones y etiquetas presentes.<br>\n  Puntos de uso accesibles para operación y mantenimiento."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de puntos de uso de vapor (ubicación, tipo, válvula de corte, trampa)<br>\n  - Plano de distribución con puntos de uso marcados"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EN 285 — Esterilizadores a vapor de gran capacidad</span>; EU GMP Anexo 1."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-VL-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-VL-004 — Verificación de calidad de agua de alimentación del generador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el agua de alimentación del generador de vapor limpio cumple con las especificaciones de calidad para evitar contaminación del vapor."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar fuente de agua de alimentación: agua purificada, agua de red o agua desionizada<br>\n  2) Verificar sistema de pretratamiento (filtros, suavizante, desionizador si aplica)<br>\n  3) Verificar instrumentos de medición de calidad de entrada: conductividad, temperatura<br>\n  4) Verificar especificaciones de calidad de agua de alimentación según diseño del generador<br>\n  5) Verificar registros de calidad de agua de alimentación<br>\n  6) Registrar resultados y desviaciones"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Calidad de agua de alimentación conforme a especificaciones del generador.<br>\n  Instrumentos de medición de calidad instalados y operativos.<br>\n  Registros de calidad disponibles."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Especificaciones de calidad de agua de alimentación<br>\n  - Registros de calidad de agua de entrada (primeros resultados)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">USP &lt;1231&gt; — Agua para usos farmacéuticos</span>; manual del fabricante del generador."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-VL-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-VL-005 — Verificación de instrumentos de medición (temperatura, presión)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los instrumentos de medición del sistema de vapor limpio (temperatura, presión, caudal) están instalados, identificados y con calibración vigente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar instrumentos: manómetros, termómetros, transmisores de presión, medidores de caudal<br>\n  2) Verificar ubicación: puntos representativos (salida del generador, puntos de uso distal)<br>\n  3) Verificar etiqueta de calibración vigente por instrumento<br>\n  4) Verificar conexión al sistema de control/registro de datos<br>\n  5) Verificar alarmas configuradas: límites de alta/baja presión y temperatura<br>\n  6) Registrar cada instrumento en la tabla de instrumentos de medición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100% de instrumentos instalados en ubicación representativa.<br>\n  Etiqueta de calibración vigente por instrumento.<br>\n  Alarmas configuradas para límites de alta/baja."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de instrumentos de medición (modelo/serie/ubicación/certificado)<br>\n  - Copias de certificados de calibración<br>\n  - Captura de pantalla de alarmas configuradas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO/IEC 17025 — Competencia de laboratorios de ensayo y calibración</span>; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-VL-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-VL-006 — Verificación de válvulas de alivio y seguridad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las válvulas de alivio y seguridad del sistema de vapor limpio están instaladas, identificadas y con certificado de calibración vigente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar válvulas de alivio y seguridad: ubicación, presión de ajuste, capacidad<br>\n  2) Verificar certificado de calibración de válvula de seguridad vigente<br>\n  3) Verificar presión de ajuste contra especificación de diseño del generador y red<br>\n  4) Verificar descarga de válvulas de alivio conducida a zona segura<br>\n  5) Verificar identificación y etiquetado de cada válvula<br>\n  6) Registrar cada válvula en la tabla correspondiente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Válvulas de alivio y seguridad con certificado de calibración vigente.<br>\n  Presión de ajuste conforme al diseño del sistema.<br>\n  Descarga conducida a zona segura."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de válvulas de alivio (ubicación/presión de ajuste/certificado)<br>\n  - Copias de certificados de calibración de válvulas de seguridad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ASME BPVC Sección VIII — Recipientes a presión</span>; EN 285."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-VL-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-VL-007 — Verificación de registros de calibración de instrumentos de vapor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que todos los instrumentos de medición asociados al sistema de vapor limpio cuentan con calibración vigente y trazable a patrones reconocidos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar todos los instrumentos de medición del sistema de vapor limpio<br>\n  2) Verificar certificado de calibración vigente por instrumento (no vencido)<br>\n  3) Verificar trazabilidad a patrones nacionales o internacionales<br>\n  4) Verificar incertidumbre declarada en el certificado<br>\n  5) Anexar certificados al legajo de calificación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100% de instrumentos con certificado de calibración vigente.<br>\n  Trazabilidad a patrones reconocidos.<br>\n  Incertidumbre declarada compatible con el uso previsto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de instrumentos de vapor con certificado de calibración<br>\n  - Copias de certificados de calibración (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO/IEC 17025 — Calibración trazable a patrones nacionales o internacionales</span>."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "resumen",
    "id": "SIS-IQ-VL-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-IQ-VL-RES — Tabla resumen de los ensayos del IQ de vapor limpio",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar en una matriz el resultado de todos los ensayos IQ de vapor limpio como acta de cierre de la fase."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar los ensayos del protocolo (<span class=\"lista-resumen\" data-fase-lista=\"IQ\"></span>) con su veredicto (C/NC/NA) y fecha de ejecución<br>\n  2) Justificar cada ensayo declarado No Aplica<br>\n  3) Listar desviaciones abiertas con su estado y plan de cierre<br>\n  4) Firmar el acta de cierre IQ de vapor limpio"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100% de ensayos IQ de vapor limpio ejecutados o justificados como No Aplica; cero desviaciones críticas abiertas; acta firmada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz resumen IQ de vapor limpio firmada<br>\n  - Acta de cierre de fase IQ de vapor limpio"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EU GMP Anexo 15 — Calificación y validación</span>."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "tabla",
    "id": "SIS-IQ-VL-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-IQ-VL-REF — Referencias del IQ de vapor limpio",
    "secciones": [],
    "tabla": {
     "headers": [
      "N°",
      "Documento",
      "Código / Versión"
     ],
     "rows": [
      [
       "1",
       "EN 285 — Esterilizadores a vapor de gran capacidad",
       "Edición vigente"
      ],
      [
       "2",
       "EU GMP Anexo 1 — Fabricación de productos estériles",
       "Vigente"
      ],
      [
       "3",
       "USP <1231> — Agua para usos farmacéuticos",
       "Edición vigente"
      ],
      [
       "4",
       "ASME BPVC Sección VIII — Recipientes a presión",
       "Edición vigente"
      ],
      [
       "5",
       "EU GMP Anexo 15 — Calificación y validación",
       "Vigente"
      ],
      [
       "6",
       "ISO/IEC 17025 — Competencia de laboratorios de ensayo y calibración",
       "Edición vigente"
      ],
      [
       "7",
       "______",
       "______"
      ]
     ]
    },
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<ul>\n  <li>Anexo A — Ficha técnica y certificado del generador de vapor limpio</li>\n  <li>Anexo B — Certificados de calibración de válvulas de seguridad</li>\n  <li>Anexo C — Plano de distribución de vapor con trampas y puntos de uso</li>\n  <li>Anexo D — Certificados de calibración de instrumentos de vapor</li>\n</ul>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AC-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AC-001 — Verificación de compresor y equipo de generación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el compresor de aire y el equipo de generación están instalados conforme al diseño, con capacidad suficiente y ubicación adecuada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar modelo, número de serie y capacidad del compresor (caudal, presión)<br>\n  2) Verificar tipo de compresor: sin aceite (oil-free) o con aceite y sistema de eliminación de residuos<br>\n  3) Verificar instalación física: ubicación, anclaje, accesibilidad para mantenimiento, ventilación<br>\n  4) Verificar conexión de entrada de aire: filtro de admisión, ubicación libre de contaminantes<br>\n  5) Verificar conexión de salida de aire: diámetro, material, válvula de corte<br>\n  6) Verificar drenaje de condensado del compresor<br>\n  7) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Compresor instalado conforme a especificaciones de diseño.<br>\n  Capacidad suficiente para la demanda del sistema de aire comprimido.<br>\n  Ubicación con ventilación adecuada y acceso para mantenimiento."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico del compresor y equipo de generación (anexo del informe)<br>\n  - Ficha técnica y certificado del fabricante"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO 8573-1 — Calidad del aire comprimido</span>; EU GMP Parte II."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AC-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AC-002 — Verificación de sistema de filtración",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema de filtración del aire comprimido (filtros de partículas, coalescentes, carbón activado) está instalado según el diseño y las clases de calidad requeridas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar cada filtro: tipo (partículas, coalescente, carbón activado), ubicación, grado de filtración<br>\n  2) Verificar certificado de fábrica de cada filtro: grado, clase de filtración, número de serie<br>\n  3) Verificar marcos y juntas: sin daños, asentamiento correcto, sin vías de derivación<br>\n  4) Verificar indicadores de diferencial de presión (si aplican)<br>\n  5) Verificar válvulas de drenaje automático o manual en filtros<br>\n  6) Registrar cada filtro en la tabla correspondiente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Filtros instalados conforme al grado de filtración especificado.<br>\n  Certificados de fábrica trazables a número de serie.<br>\n  Sin vías de derivación ni daños en marcos y juntas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Certificados de fábrica de filtros<br>\n  - Registro de filtros instalados (tipo/ubicación/serie/fecha de instalación)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO 8573-1 — Calidad del aire comprimido — Parte 1: Contaminantes y clases de pureza</span>; EU GMP Parte II."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AC-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AC-003 — Verificación de secado y punto de rocío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema de secado de aire comprimido (secador por adsorción, refrigerado o de membrana) está instalado y configurado para alcanzar el punto de rocío requerido."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar tipo de secador: adsorción, refrigeración o membrana<br>\n  2) Verificar instalación física: ubicación, anclaje, conexiones de entrada y salida<br>\n  3) Verificar sistema de purgas y drenaje de condensado del secador<br>\n  4) Verificar instrumento de medición de punto de rocío (higrómetro, sensor de humedad)<br>\n  5) Verificar punto de rocío configurado contra especificación de diseño (ej. -40°C pdb)<br>\n  6) Registrar configuración del secador y resultados iniciales"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Secador instalado y operativo.<br>\n  Punto de rocío configurado conforme a especificación de diseño.<br>\n  Instrumento de medición de punto de rocío instalado y con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Descripción del sistema de secado instalado<br>\n  - Registro de punto de rocío configurado y medido<br>\n  - Certificado de calibración del sensor de humedad/punto de rocío"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO 8573-1 — Calidad del aire comprimido</span>; manual del fabricante del secador."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AC-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AC-004 — Verificación de red de distribución de aire comprimido",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la red de distribución de aire comprimido está instalada con materiales compatibles, pendiente adecuada y puntos de drenaje para eliminar condensado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar materiales de tuberías y válvulas (acero inoxidable, cobre, aluminio o plástico aprobado)<br>\n  2) Verificar pendiente de tuberías hacia puntos de drenaje<br>\n  3) Verificar válvulas de purga y drenaje en puntos bajos y finales de ramal<br>\n  4) Verificar identificaciones de tuberías: contenido, dirección de flujo, número de línea<br>\n  5) Verificar ausencia de puntos muertos en la red de distribución<br>\n  6) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Materiales conforme a especificación de diseño.<br>\n  Pendiente y drenaje adecuados hacia puntos de drenaje.<br>\n  Válvulas de purga en puntos bajos y finales de ramal.<br>\n  Sin puntos muertos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz material-diseño-vs-instalado de la red de aire comprimido<br>\n  - Registro fotográfico de válvulas de purga y drenaje (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO 8573-1 — Calidad del aire comprimido</span>; EU GMP Parte II."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AC-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AC-005 — Verificación de puntos de uso y válvulas de purga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los puntos de uso de aire comprimido están instalados con válvulas de corte, reguladores y purga adecuados para entregar aire de calidad al proceso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar cada punto de uso contra el plano de distribución<br>\n  2) Verificar válvula de corte en cada punto de uso<br>\n  3) Verificar regulador de presión y lubricador (si aplica) en cada punto de uso<br>\n  4) Verificar válvula de purga o drenaje en cada punto de uso<br>\n  5) Verificar filtros de punto de uso (si aplican)<br>\n  6) Verificar identificaciones y etiquetas en cada punto de uso<br>\n  7) Registrar cada punto de uso en la tabla correspondiente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Puntos de uso con válvula de corte, regulador y purga.<br>\n  Identificaciones y etiquetas presentes.<br>\n  Puntos de uso accesibles para operación y mantenimiento."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de puntos de uso de aire comprimido (ubicación, tipo, válvula de corte, regulador, purga)<br>\n  - Plano de distribución con puntos de uso marcados"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO 8573-1 — Calidad del aire comprimido</span>; EU GMP Parte II."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AC-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AC-006 — Verificación de instrumentos de medición (presión, caudal, punto de rocío)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los instrumentos de medición del sistema de aire comprimido (manómetros, medidores de caudal, sensores de punto de rocío) están instalados, identificados y con calibración vigente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar instrumentos: manómetros, medidores de caudal, sensores de punto de rocío/humedad<br>\n  2) Verificar ubicación: puntos representativos (salida del compresor, después de secador, puntos de uso distal)<br>\n  3) Verificar etiqueta de calibración vigente por instrumento<br>\n  4) Verificar conexión al sistema de control/registro de datos<br>\n  5) Verificar alarmas configuradas: límites de alta/baja presión, punto de rocío alto<br>\n  6) Registrar cada instrumento en la tabla de instrumentos de medición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100% de instrumentos instalados en ubicación representativa.<br>\n  Etiqueta de calibración vigente por instrumento.<br>\n  Alarmas configuradas para límites de alta/baja y punto de rocío."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de instrumentos de medición (modelo/serie/ubicación/certificado)<br>\n  - Copias de certificados de calibración<br>\n  - Captura de pantalla de alarmas configuradas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">ISO/IEC 17025 — Competencia de laboratorios de ensayo y calibración</span>; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-IQ-AC-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-IQ-AC-007 — Verificación de registros de calidad del aire comprimido",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema genera registros de calidad del aire (partículas, aceite, humedad, punto de rocío) con trazabilidad y que los datos están protegidos según 21 CFR Parte 11 cuando el aire está en contacto con producto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar sistema de registro de datos de calidad del aire<br>\n  2) Verificar parámetros registrados: partículas, contenido de aceite, punto de rocío, presión, caudal<br>\n  3) Verificar frecuencia de registro y periodo de retención de datos<br>\n  4) Verificar integridad de datos: audit trail, acceso restringido (si aplica)<br>\n  5) Verificar copias de seguridad y recuperación de datos<br>\n  6) Registrar configuración del sistema de registro"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sistema de registro operativo con parámetros críticos capturados (cuando el aire contacta producto).<br>\n  Audit trail activo y acceso restringido (cuando aplique 21 CFR Parte 11).<br>\n  Copias de seguridad definidas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Configuración del sistema de registro de calidad del aire<br>\n  - Evidencia de audit trail activo (si aplica)<br>\n  - Procedimiento de copias de seguridad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">21 CFR Parte 11 — Registros electrónicos y firmas electrónicas</span>; ISO 8573-1."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "resumen",
    "id": "SIS-IQ-AC-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-IQ-AC-RES — Tabla resumen de los ensayos del IQ de aire comprimido",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar en una matriz el resultado de todos los ensayos IQ de aire comprimido como acta de cierre de la fase."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar los ensayos del protocolo (<span class=\"lista-resumen\" data-fase-lista=\"IQ\"></span>) con su veredicto (C/NC/NA) y fecha de ejecución<br>\n  2) Justificar cada ensayo declarado No Aplica<br>\n  3) Listar desviaciones abiertas con su estado y plan de cierre<br>\n  4) Firmar el acta de cierre IQ de aire comprimido"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100% de ensayos IQ de aire comprimido ejecutados o justificados como No Aplica; cero desviaciones críticas abiertas; acta firmada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz resumen IQ de aire comprimido firmada<br>\n  - Acta de cierre de fase IQ de aire comprimido"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br><span class=\"refnorma\">EU GMP Anexo 15 — Calificación y validación</span>."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "tabla",
    "id": "SIS-IQ-AC-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-IQ-AC-REF — Referencias del IQ de aire comprimido",
    "secciones": [],
    "tabla": {
     "headers": [
      "N°",
      "Documento",
      "Código / Versión"
     ],
     "rows": [
      [
       "1",
       "ISO 8573-1 — Calidad del aire comprimido — Parte 1: Contaminantes y clases de pureza",
       "Edición vigente"
      ],
      [
       "2",
       "EU GMP Parte II — Requisitos para aire comprimido en contacto con producto",
       "Vigente"
      ],
      [
       "3",
       "21 CFR Parte 11 — Registros electrónicos y firmas electrónicas",
       "Vigente"
      ],
      [
       "4",
       "EU GMP Anexo 11 — Sistemas informatizados",
       "Vigente"
      ],
      [
       "5",
       "EU GMP Anexo 15 — Calificación y validación",
       "Vigente"
      ],
      [
       "6",
       "ISO/IEC 17025 — Competencia de laboratorios de ensayo y calibración",
       "Edición vigente"
      ],
      [
       "7",
       "______",
       "______"
      ]
     ]
    },
    "familia": "aire-comprimido"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<ul>\n  <li>Anexo A — Ficha técnica y certificado del compresor</li>\n  <li>Anexo B — Certificados de fábrica de filtros de aire comprimido</li>\n  <li>Anexo C — Plano de distribución de aire con válvulas de purga y puntos de uso</li>\n  <li>Anexo D — Certificados de calibración de instrumentos de aire comprimido</li>\n</ul>",
    "familia": "aire-comprimido"
   }
  ],
  "OQ": [
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO OQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Operación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Operación con producción, control de calidad e ingeniería, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar la siguiente fase.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice. Este protocolo cubre agua purificada (PW) y agua para inyección (WFI). El tipo de agua se declara en la portada antes de la ejecución; los ensayos marcados «solo WFI» se declaran No Aplica con aprobación previa de Calidad cuando el sistema no produce WFI, y no se eliminan del protocolo aprobado.</p>",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-001 — Parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la parada de emergencia del sistema de agua."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar cada parada de emergencia del sistema y su ubicación<br>\n  2) Accionar la parada y registrar el tiempo hasta el estado seguro<br>\n  3) Verificar cierre de alimentación, apertura de drenaje y ausencia de reinicio automático<br>\n  4) Repetir 3 veces y confirmar que el rearme es manual"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = estado del sistema tras la parada de emergencia; unidad = pasa/no pasa por repetición. Tipo de dato = atributo. n = 3 repeticiones por condición de parada. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = las 3 repeticiones deben pasar; 1 falla invalida el ensayo. Atípicos: no aplica a datos de atributo; toda exclusión de una repetición se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>La parada detiene la alimentación y abre el drenaje en ≤ <span class=\"por-confirmar\">5 s (tiempo de diseño)</span>.<br>El sistema queda en estado seguro y exige rearme manual; no reinicia solo.<br>El evento queda registrado con fecha, hora, usuario y causa."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo de respuesta en rojo es una propuesta de diseño: el responsable debe confirmarlo contra la especificación del fabricante antes de firmar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-002 — Interlocks de protección",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los interlocks: nivel mínimo del tanque, alta temperatura, y presión y caudal mínimos de la bomba."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular nivel mínimo del tanque y verificar que la bomba no opera en seco<br>\n  2) Simular alta temperatura y verificar la protección<br>\n  3) Simular presión y caudal mínimos de la bomba y verificar la respuesta"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = actuación de cada interlock ante su condición; unidad = pasa/no pasa por repetición. Tipo de dato = atributo. n = 3 repeticiones por cada interlock. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = cada interlock debe actuar en las 3 repeticiones. Atípicos: no aplica a datos de atributo; toda exclusión de una repetición se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cada interlock actúa sobre su condición: nivel mínimo de tanque, alta temperatura, baja presión y bajo caudal de bomba.<br>La acción asociada (detener bomba o desviar a drenaje) ocurre en ≤ <span class=\"por-confirmar\">5 s</span> desde la condición.<br>El rearme es manual y queda registrado por interlock."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de interlocks simulados (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo de actuación en rojo debe confirmarse contra el diseño del sistema; cada interlock se prueba y se registra por separado."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-003 — Alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma dispara y que ocurre la acción asociada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar conductividad alta y verificar disparo y acción<br>\n  2) Provocar TOC alto, caudal bajo en el loops, diferencial de filtros, bajo nivel, cloro residual alto en la entrada de la RO y falla de UV, y verificar cada disparo<br>\n  3) Verificar el desvío a drenaje del agua fuera de especificación"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = disparo de alarma y acción asociada; unidad = pasa/no pasa por alarma. Tipo de dato = atributo. n = 3 repeticiones por alarma. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = cada alarma debe disparar y ejecutar su acción en las 3 repeticiones. Atípicos: no aplica a datos de atributo; toda exclusión de una repetición se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cada alarma dispara en HMI/SCADA y ejecuta su acción asociada.<br>El agua fuera de especificación se desvía a drenaje y se cierra la válvula de producto.<br>El registro conserva fecha, hora, valor, límite y usuario."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de alarmas y acciones (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Se prueban todas las alarmas del sistema, no una muestra; la lista sale del análisis de riesgo del sistema."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-004 — Falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar estado seguro ante falla de energía, recirculación al reiniciar y ausencia de estancamiento prolongado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cortar la energía y verificar el estado seguro<br>\n  2) Restablecer y verificar la recirculación<br>\n  3) Verificar que no hay estancamiento prolongado"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = estado tras corte de energía y recuperación; unidad = pasa/no pasa por condición. Tipo de dato = atributo. n = 3 cortes controlados. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = las 3 repeticiones deben recuperar sin estancamiento. Atípicos: no aplica a datos de atributo; toda exclusión de una repetición se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Ante corte de energía el sistema queda en estado seguro, sin retorno de agua ni sifonaje.<br>Al reiniciar, la recirculación se restablece en ≤ <span class=\"por-confirmar\">10 min</span> y no hay estancamiento &gt; <span class=\"por-confirmar\">30 min</span>.<br>El corte y la recuperación quedan registrados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los tiempos en rojo son propuestas: deben confirmarse contra el diseño y el procedimiento de arranque del sitio."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-005 — Respaldo y redundancia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la bomba de loops duplicada y el cambio automático (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el punto de operación de la bomba principal (caudal y presión)<br>\n  2) Simular la falla de la bomba principal (si aplica) y medir el tiempo de transferencia<br>\n  3) Verificar que la presión del loop no cae por debajo del mínimo durante el cambio<br>\n  4) Confirmar la alarma de bomba detenida y repetir 3 veces"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = cambio automático a bomba de respaldo; unidad = pasa/no pasa por repetición. Tipo de dato = atributo. n = 3 cambios forzados. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = el cambio debe completarse en las 3 repeticiones. Atípicos: no aplica a datos de atributo; toda exclusión de una repetición se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>El cambio a la bomba de respaldo es automático y completa en ≤ <span class=\"por-confirmar\">30 s</span> sin caída de presión por debajo del mínimo del loop.<br>La alarma de bomba detenida queda registrada.<br>Si el sistema no tiene bomba duplicada, se declara No Aplica con aprobación previa de Calidad."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo de transferencia en rojo requiere confirmación del fabricante; la condición de No Aplica se decide antes de ejecutar, no durante la corrida."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-006 — Filtro multimedia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar caudal, caída de presión y retrolavado del filtro multimedia."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el caudal y la caída de presión<br>\n  2) Ejecutar el retrolavado y verificar secuencia y tiempos<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = caída de presión del filtro multimedia; unidad = bar. Tipo de dato = continua. n = 3 lecturas al caudal de diseño y 3 ciclos de retrolavado. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media e IC 95 % dentro del criterio. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>ΔP inicial ≤ <span class=\"por-confirmar\">0,5 bar</span> al caudal de diseño y caudal ≥ 95 % del diseño.<br>Retrolavado con la secuencia y tiempos del fabricante; 3 ciclos sin arrastre de medio filtrante.<br>Sin bypass ni fuga interna."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del filtro multimedia"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El ΔP de aceptación en rojo es una propuesta; debe confirmarse con la curva del fabricante para esta instalación."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-007 — Ablandador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar ciclos de regeneración, dureza a la salida y consumo de sal."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar los ciclos de regeneración y registrarlos<br>\n  2) Medir la dureza a la salida y el consumo de sal<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = dureza a la salida del ablandador; unidad = ppm como CaCO3. Tipo de dato = continua. n = 3 muestras por ciclo en 3 ciclos. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada muestra e IC 95 % deben cumplir el límite. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Dureza a la salida ≤ <span class=\"por-confirmar\">1 ppm como CaCO3</span> durante los 3 ciclos evaluados.<br>Consumo de sal por regeneración dentro de ±5 % del especificado.<br>Sin fuga de resina al colector."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del ablandador"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El límite de dureza en rojo es una propuesta típica de pretratamiento; debe adoptarse con la especificación del diseño."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-008 — Carbón activado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar eliminación de cloro, caudal y retrolavado; la verificación de cloro residual a la salida es crítica para proteger la RO."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la eliminación de cloro y el caudal<br>\n  2) Ejecutar el retrolavado<br>\n  3) Verificar el cloro residual a la salida<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = cloro residual a la salida del carbón; unidad = ppm. Tipo de dato = continua. n = 3 muestras tras cada retrolavado. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada muestra debe cumplir; el promedio no compensa un valor alto. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cloro residual a la salida ≤ <span class=\"por-confirmar\">0,1 ppm</span> en el 100 % de las muestras.<br>ΔP ≤ <span class=\"por-confirmar\">0,5 bar</span> y caudal ≥ 95 % del diseño.<br>Sin agotamiento del lecho evidenciado por aumento de cloro entre muestras."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del carbón activado"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El cloro residual es crítico para proteger las membranas de RO; el límite en rojo debe confirmarse con la especificación de la membrana."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-009 — Dosificación química",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de las bombas dosificadoras y la alarma de nivel de químico (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la exactitud de las bombas dosificadoras de antiscalante o bisulfito (si aplica)<br>\n  2) Verificar la alarma de nivel de químico<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = caudal de dosificación por bomba; unidad = mL/min o L/h. Tipo de dato = continua. n = 3 puntos de ajuste (20/50/100 %) con 3 repeticiones cada uno. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = desviación media ≤ ±5 % del caudal ajustado en cada punto. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cada bomba dosificadora entrega su caudal con desviación ≤ <span class=\"por-confirmar\">±5 %</span> en los 3 puntos de ajuste.<br>La alarma de nivel de químico es operativa y queda registrada.<br>Sin goteo, aireación ni sifonaje en la línea de dosificación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de dosificación"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La tolerancia de dosificación en rojo debe confirmarse con el fabricante de la bomba y el procedimiento de preparación de químicos."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-010 — Filtros de cartucho",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la caída de presión y el estado de los filtros de cartucho."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la caída de presión<br>\n  2) Verificar el estado de los cartuchos<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = caída de presión en filtros de cartucho; unidad = bar. Tipo de dato = continua. n = 3 lecturas al caudal de diseño. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media e IC 95 % dentro del criterio. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>ΔP inicial ≤ <span class=\"por-confirmar\">0,3 bar</span> al caudal de diseño y cambio de cartucho a <span class=\"por-confirmar\">1,0 bar</span>.<br>Sin bypass ni paso directo.<br>Cartuchos íntegros, sin daño ni canalización."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cartuchos"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los valores de ΔP en rojo son propuestas; el criterio de cambio debe salir del fabricante y del histórico del sitio."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-011 — Caudales de ósmosis inversa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar caudales de permeado, rechazo y recirculación, con la relación de recuperación dentro del criterio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir caudales de permeado, rechazo y recirculación<br>\n  2) Calcular la relación de recuperación<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = caudales de permeado, rechazo y recirculación; unidad = L/h. Tipo de dato = continua. n = 3 lecturas estabilizadas por condición. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = medias dentro de ±5 % del diseño y recuperación dentro del rango. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Caudales dentro de ±5 % del diseño y recuperación de <span class=\"por-confirmar\">60-75 %</span> según diseño.<br>Relación de rechazo y recirculación dentro del rango del fabricante.<br>Sin fluctuación &gt; 5 % durante 10 min de operación estable."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de caudales"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El rango de recuperación en rojo depende del diseño de membranas; must confirmarse contra la hoja de datos del sistema."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-012 — Presiones de ósmosis inversa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la presión de la bomba de alta presión y las presiones por etapa."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la presión de la bomba de alta presión<br>\n  2) Medir las presiones por etapa<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = presión de alimentación por etapa de RO; unidad = bar. Tipo de dato = continua. n = 3 lecturas por etapa y condición. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media dentro de ±5 % del setpoint; ΔP por etapa dentro del límite. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Presión de alta presión dentro de ±5 % del setpoint de diseño.<br>ΔP por etapa ≤ <span class=\"por-confirmar\">1 bar</span>.<br>Sin fluctuación &gt; 5 % en 10 min ni golpe de ariete al arrancar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de presiones"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El ΔP por etapa en rojo debe confirmarse con la hoja de datos de los elementos de membrana."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-013 — Conductividad del permeado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el rendimiento de rechazo de sales a las condiciones de diseño."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la conductividad del permeado a las condiciones de diseño<br>\n  2) Calcular el rechazo de sales<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = conductividad del permeado y rechazo de sales; unidad = µS/cm a 25 °C y %. Tipo de dato = continua. n = 3 muestras por condición. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada muestra dentro del criterio; RSD ≤ 5 %. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Rechazo de sales ≥ <span class=\"por-confirmar\">95 %</span> calculado con la conductividad de alimentación y permeado.<br>Conductividad de permeado ≤ <span class=\"por-confirmar\">10 µS/cm</span> a 25 °C.<br>RSD de las 3 lecturas ≤ 5 %."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del permeado"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Rechazo y conductividad en rojo son valores de diseño: deben confirmarse contra la especificación de las membranas instaladas."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-014 — Segundo paso de ósmosis",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el funcionamiento del segundo paso y la conductividad resultante (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar el segundo paso (si aplica)<br>\n  2) Medir la conductividad resultante<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = conductividad a la salida del segundo paso; unidad = µS/cm a 25 °C. Tipo de dato = continua. n = 3 muestras por condición. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada muestra debe cumplir el límite. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Conductividad ≤ <span class=\"por-confirmar\">1,3 µS/cm a 25 °C</span> (USP &lt;645&gt;, etapa 1) a la salida del segundo paso.<br>Sin deriva entre las 3 muestras.<br>Si el sistema no tiene segundo paso, se declara No Aplica con aprobación previa."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del segundo paso"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El límite de 1,3 µS/cm corresponde a USP &lt;645&gt; estágio 1 y queda pendiente de adopción por el responsable."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-015 — Sanitización de la RO y de la EDI",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar ciclo, temperaturas, concentraciones y tiempos, con enjuague completo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar la sanitización química o por agua caliente según el procedimiento<br>\n  2) Registrar ciclo, temperaturas, concentraciones y tiempos<br>\n  3) Verificar el enjuague completo<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura y tiempo de sanitización, o concentración y tiempo químico; unidad = °C, min o ppm. Tipo de dato = analitico. n = 3 ciclos completos con registro por punto. Estadísticos = mediana, mínimo, máximo e IC 95 %; concentraciones en escala log10. Regla de decisión = todos los ciclos deben alcanzar el parámetro y el tiempo. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala log10; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Sanitización térmica: <span class=\"por-confirmar\">80 °C durante ≥ 60 min</span> en la etapa de calor.<br>Sanitización química: concentración y tiempo del fabricante, documentados.<br>Enjuague final con conductividad ≤ 1,3 µS/cm y ausencia del sanitizante."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de sanitización"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Temperatura, tiempo y concentración en rojo son propuestas; el responsable debe adoptar el ciclo del fabricante y del procedimiento de sanitización."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-016 — Tanque de almacenamiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar nivel, sensores, alarmas de nivel alto y bajo, y control de reposición."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar sensores y control de nivel<br>\n  2) Provocar nivel alto y bajo y verificar sus alarmas<br>\n  3) Verificar el control de reposición"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = nivel y control de reposición del tanque; unidad = pasa/no pasa por ciclo. Tipo de dato = atributo. n = 3 ciclos de llenado y vaciado. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = las 3 repeticiones deben pasar. Atípicos: no aplica a datos de atributo; toda exclusión de una repetición se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Alarmas de nivel alto y bajo operativas y registradas.<br>Reposición automática sin desborde ni entrada de aire sin filtrar.<br>Sensores de nivel calibrados contra patrón."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Se prueban los 3 ciclos completos; una alarma que no dispara invalida el ensayo aunque el nivel se controle por otro medio."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-017 — Filtro de venteo hidrofóbico",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la integridad del filtro de venteo hidrofóbico de 0,2 µm."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar número de parte, lote y horas de servicio del cartucho<br>\n  2) Ejecutar la prueba de integridad (bubble point o difusión) según el fabricante<br>\n  3) Comparar el resultado con el valor de aceptación del certificado<br>\n  4) Verificar ausencia de humedad, daño y sello vencido; repetir 3 pruebas"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = integridad del filtro de venteo hidrofóbico; unidad = pasa/no pasa. Tipo de dato = atributo. n = 3 pruebas de integridad. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = las 3 pruebas deben pasar con el criterio del fabricante. Atípicos: no aplica a datos de atributo; toda exclusión de una repetición se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Integridad del filtro de 0,2 µm confirmada con la prueba del fabricante (bubble point o difusión) y el valor de aceptación documentado (<span class=\"por-confirmar\">valor del fabricante</span>).<br>Sin humedad, daño ni sello vencido.<br>Cartucho dentro de su vida útil declarada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de integridad (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El valor de aceptación en rojo debe tomarse del certificado del fabricante; no se puede fijar por defecto sin ese dato."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-018 — Bola de aspersión del tanque",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar cobertura y caudal de la bola de aspersión para mantener húmedas las superficies superiores (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar la bola de aspersión (si aplica)<br>\n  2) Verificar cobertura y medir el caudal<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = cobertura y caudal de la bola de aspersión; unidad = pasa/no pasa y m³/h. Tipo de dato = continua. n = 1 ensayo de cobertura y 3 lecturas de caudal. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cobertura completa sin zonas secas y caudal ≥ mínimo del fabricante. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cobertura completa de la superficie interior del tanque, sin zonas secas, con ensayo de cobertura documentado.<br>Caudal y presión ≥ el mínimo del fabricante (<span class=\"por-confirmar\">valor del fabricante</span>).<br>Boquilla sin obstrucción ni desgaste."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de aspersión"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El caudal mínimo en rojo depende del modelo de bola de aspersión; se toma del catálogo y se registra el número de parte."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-019 — Temperatura del tanque",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar control y estabilidad de la temperatura del tanque (si aplica a sistema caliente o con enfriamiento)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la temperatura del tanque en operación (si aplica)<br>\n  2) Verificar control y estabilidad<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura del tanque; unidad = °C. Tipo de dato = continua. n = registro continuo de 60 min con 3 verificaciones manuales. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media dentro de ±2 °C del setpoint y sin excursiones. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Temperatura dentro de ±2 °C del setpoint (<span class=\"por-confirmar\">setpoint de diseño</span>) durante 60 min.<br>Registro continuo sin excursiones no registradas.<br>Sensor de temperatura calibrado contra patrón."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de temperatura"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El setpoint en rojo depende de la estrategia de control microbiológico del sitio (agua fría o loop caliente)."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-020 — Bomba del loops",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar caudal, presión y velocidad (VFD) de la bomba en el rango operativo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir caudal y presión en el rango operativo<br>\n  2) Verificar la velocidad del variador<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = caudal, presión y velocidad de la bomba del loop; unidad = m³/h, bar, Hz. Tipo de dato = continua. n = 3 lecturas por punto de operación. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media dentro de ±5 % del diseño. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Caudal ≥ 95 % del diseño y presión de descarga dentro de ±5 % del setpoint.<br>La VFD responde al setpoint sin oscilación.<br>Sin cavitación, ruido anormal ni fuga en el sello."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de la bomba"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El punto de operación de diseño debe tomarse de la curva de la bomba instalada y de la URS del sistema."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-021 — Velocidad de flujo en el loops",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el caudal en el retorno y la velocidad mínima definida en el URS, con todos los puntos de uso abiertos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el caudal en el retorno<br>\n  2) Abrir todos los puntos de uso y verificar que la velocidad no baja del mínimo (mínimo del URS; régimen turbulento)<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = velocidad del agua en el loop; unidad = m/s. Tipo de dato = continua. n = 3 mediciones de caudal con todos los puntos de uso abiertos. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = velocidad calculada ≥ mínimo adoptado en todas las mediciones. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Velocidad ≥ <span class=\"por-confirmar\">1,5 m/s (mínimo del URS)</span> con todos los puntos de uso abiertos.<br>Cálculo documentado con caudal medido y diámetro interno real.<br>Sin tramos en régimen laminar en la distribución."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El mínimo en rojo debe adoptarse desde la URS; el cálculo usa el diámetro interno real, no el nominal."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-022 — Presión positiva en la red",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar presión positiva en toda la red, incluida la de retorno, y en el punto más lejano."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la presión en la red y en el retorno<br>\n  2) Medir la presión en el punto más lejano<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = presión en la red y en el retorno; unidad = bar. Tipo de dato = continua. n = 3 lecturas por punto, incluido el más desfavorable. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = presión positiva en el 100 % de los puntos. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Presión positiva en todos los puntos, incluido el más desfavorable y el retorno (≥ <span class=\"por-confirmar\">0,5 bar</span>).<br>Sin zonas en depresión ni riesgo de ingreso de contaminante.<br>Manómetros calibrados y con rango adecuado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de presión"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El mínimo de presión en rojo debe confirmarse contra el diseño hidráulico y la altura del punto más desfavorable."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-023 — Lámpara UV",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar intensidad, vida útil de la lámpara y alarma; si es de 254 nm para desinfección, el sensor debe calibrarse."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la intensidad UV<br>\n  2) Verificar la vida útil de la lámpara y su alarma<br>\n  3) Calibrar el sensor si es de 254 nm para desinfección<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = dosis UV o intensidad de lámpara; unidad = mJ/cm² o %. Tipo de dato = analitico. n = 3 lecturas con lámpara nueva y al final de vida útil. Estadísticos = mediana, mínimo, máximo e IC 95 %; concentraciones en escala log10. Regla de decisión = cada lectura debe cumplir la dosis o intensidad mínima. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala log10; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Dosis ≥ <span class=\"por-confirmar\">30 mJ/cm² a 254 nm</span> o intensidad ≥ 70 % con alarma operativa.<br>Lámpara dentro de su vida útil declarada; horas registradas.<br>Sensor UV calibrado contra referencia."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis UV"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La dosis en rojo es una propuesta de diseño para desinfección; debe confirmarse con el fabricante del equipo UV y el fabricante de la lámpara."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-024 — Ozono en el loops",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar generación, concentración en el loops, destrucción previa a los puntos de uso y ausencia en el agua usada (si se usa)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la generación y la concentración en el loops (si se usa)<br>\n  2) Verificar la destrucción previa a los puntos de uso<br>\n  3) Verificar la ausencia en el agua usada<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = ozono en el loop y en el agua de uso; unidad = ppm. Tipo de dato = analitico. n = 3 muestras en el loop y 3 en puntos de uso. Estadísticos = mediana, mínimo, máximo e IC 95 %; concentraciones en escala log10. Regla de decisión = ozono en el loop ≥ mínimo y en el agua de uso ≤ máximo. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala log10; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Ozono en el loop ≥ <span class=\"por-confirmar\">0,05 ppm</span> durante la sanitización.<br>Destrucción previa a los puntos de uso efectiva: ≤ <span class=\"por-confirmar\">0,05 ppm</span> en el agua de uso.<br>Sin ozono detectable en el agua destinada a producto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de ozono"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites de ozono en rojo son propuestas operativas; deben adoptarse con el fabricante del generador y del destructor UV."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-025",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-025 — Intercambiador de calor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar enfriamiento o calentamiento del loops, con control de temperatura y barrera de doble pared o presión diferencial (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el control de temperatura del intercambiador (si aplica)<br>\n  2) Verificar la barrera de doble pared o la presión diferencial<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura de salida del intercambiador; unidad = °C. Tipo de dato = continua. n = 3 lecturas por condición. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media dentro de ±2 °C del setpoint. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Temperatura de salida dentro de ±2 °C del setpoint (<span class=\"por-confirmar\">setpoint de diseño</span>).<br>Barrera de doble pared o presión diferencial verificada, si aplica.<br>Sin mezcla cruzada entre servicio y producto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del intercambiador"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El setpoint y el tipo de barrera dependen del diseño; se confirman antes de ejecutar el ensayo."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-026",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-026 — Pendiente y drenabilidad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar en campo que el loops se drena y no queda agua retenida."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Drenar el loops y verificar el drenaje completo en campo<br>\n  2) Verificar que no queda agua retenida<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = pendiente y drenaje del loop; unidad = pasa/no pasa por tramo. Tipo de dato = atributo. n = inspección del 100 % de los tramos y 1 prueba de drenaje. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = todos los tramos deben cumplir. Atípicos: no aplica a datos de atributo; toda exclusión de una repetición se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Pendiente ≥ <span class=\"por-confirmar\">1 %</span> hacia el punto de drenaje en el 100 % de los tramos.<br>Drenaje completo sin agua retenida en 15 min.<br>Sin bolsas ni contrapendientes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de drenabilidad"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La pendiente mínima en rojo debe confirmarse contra el plano isométrico aprobado; se verifica en campo, no solo en plano."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-027",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-027 — Ramales muertos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir la longitud de cada ramal en relación con su diámetro (regla de 3D o el criterio adoptado) y revisar válvulas de diafragma y de punto de uso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir cada ramal y su diámetro y aplicar la regla de 3D o el criterio adoptado<br>\n  2) Revisar válvulas de diafragma y de punto de uso<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = relación longitud/diámetro de cada ramal; unidad = L/D. Tipo de dato = continua. n = medición del 100 % de los ramales. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = L/D ≤ 3 en todos los ramales. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>L/D ≤ <span class=\"por-confirmar\">3</span> en cada ramal (criterio adoptado).<br>Válvulas sanitarias de diafragma operativas y sin puntos muertos.<br>Medición registrada por ramal, con diámetro interno real."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de ramales"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La regla 3D es una propuesta; si el sitio adopta otra (p. ej. 2D), debe declararse antes de medir."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-028",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-028 — Sanitización del loops",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que todos los puntos, incluidos los de uso y el retorno, alcancen la temperatura o la concentración y el tiempo definidos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar la sanitización térmica (80 °C) o química según el procedimiento aprobado<br>\n  2) Registrar temperatura o concentración y tiempo en cada punto, incluido el retorno<br>\n  3) Identificar con datos el punto más frío o de menor concentración<br>\n  4) Repetir 3 ciclos y comparar el punto más desfavorable contra el criterio"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura o concentración y tiempo de sanitización por punto; unidad = °C, min o ppm. Tipo de dato = analitico. n = registro por punto en 3 ciclos. Estadísticos = mediana, mínimo, máximo e IC 95 %; concentraciones en escala log10. Regla de decisión = todos los puntos deben alcanzar el parámetro en los 3 ciclos. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala log10; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Todos los puntos, incluido el retorno y el más frío, alcanzan <span class=\"por-confirmar\">80 °C durante ≥ 60 min</span> o la concentración/tiempo químico definido.<br>Registro por punto, no solo en el sensor de referencia.<br>Sin puntos que no alcancen la condición."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la sanitización (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La condición en rojo debe adoptarse del procedimiento de sanitización del sitio; el punto más frío se identifica con datos, no por suposición."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-029",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-029 — Enjuague posterior a sanitización",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la ausencia de residuos del sanitizante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tomar muestra en cada punto representativo tras el enjuague<br>\n  2) Medir conductividad, TOC y ausencia del sanitizante por el método específico<br>\n  3) Repetir hasta obtener 3 muestras consecutivas conformes<br>\n  4) Liberar el sistema solo con las 3 muestras conformes registradas"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = residuos del sanitizante tras el enjuague; unidad = µS/cm, ppb y ausencia. Tipo de dato = analitico. n = 3 muestras consecutivas por punto representativo. Estadísticos = mediana, mínimo, máximo e IC 95 %; concentraciones en escala log10. Regla de decisión = las 3 muestras deben cumplir. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala log10; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Conductividad ≤ <span class=\"por-confirmar\">1,3 µS/cm</span> y TOC ≤ <span class=\"por-confirmar\">500 ppb</span> tras el enjuague.<br>Ausencia del sanitizante por el método específico del químico usado.<br>3 muestras consecutivas conformes antes de liberar el sistema."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del enjuague (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites en rojo corresponden a USP &lt;645&gt; y &lt;643&gt; y quedan pendientes de adopción; el método de ausencia depende del sanitizante."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-030",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-030 — Conductividad y TOC en línea",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar exactitud frente a un patrón o a medición de laboratorio, y alarmas (si aplica a TOC en línea)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Comparar conductividad y TOC en línea contra patrón o laboratorio (si aplica)<br>\n  2) Verificar el factor de respuesta y la correlación del TOC con el laboratorio<br>\n  3) Verificar las alarmas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = exactitud de conductividad y TOC en línea; unidad = µS/cm y ppb. Tipo de dato = continua. n = 3 comparaciones contra patrón o laboratorio por rango. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = desviación media dentro de la tolerancia en cada rango. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Exactitud ≤ ±2 % de la lectura para conductividad y ≤ ±5 % para TOC (<span class=\"por-confirmar\">tolerancias de diseño</span>) contra patrón o laboratorio.<br>Alarmas operativas en el límite de acción.<br>Tiempo de respuesta ≤ 60 s."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis en línea"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Las tolerancias en rojo deben confirmarse con las especificaciones de los instrumentos instalados y su certificado."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-031",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-031 — Temperatura en el loops",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar sensores y registro de temperatura en el loops (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar calibración vigente de los sensores de temperatura del loop<br>\n  2) Registrar temperatura continua durante 60 min y comparar con 3 lecturas manuales<br>\n  3) Revisar que no haya huecos de registro ni excursiones no registradas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura del loop; unidad = °C. Tipo de dato = continua. n = registro continuo de 60 min con 3 verificaciones manuales. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media dentro de ±2 °C y sin excursiones. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Registro continuo de temperatura dentro de ±2 °C del setpoint (<span class=\"por-confirmar\">setpoint de diseño</span>) durante 60 min.<br>Sensores calibrados contra patrón.<br>Sin excursiones no registradas ni huecos de registro."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de temperatura"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El setpoint en rojo depende de la estrategia del sitio; se confirma antes de la corrida."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-032",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-032 — Puntos de muestreo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar identificación, accesibilidad, diseño sanitario, drenaje previo y válvulas de muestreo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar identificación y accesibilidad de cada punto<br>\n  2) Verificar diseño sanitario, drenaje previo y válvulas<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = condición de cada punto de muestreo; unidad = pasa/no pasa por punto. Tipo de dato = atributo. n = inspección del 100 % de los puntos. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = todos los puntos deben cumplir. Atípicos: no aplica a datos de atributo; toda exclusión de una repetición se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cada punto identificado, accesible y con diseño sanitario.<br>Drenaje previo y válvula de muestreo operativa en el 100 % de los puntos.<br>Listado completo contra plano, sin puntos sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de puntos"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Se revisan todos los puntos; un punto inaccesible o sin drenaje invalida el ensayo aunque el resto cumpla."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AP-033",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-033 — Operación continua del sistema",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la operación continua del sistema completo durante el período de prueba, con agua de producto dentro de los límites."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar el sistema completo durante el período definido (72 h propuestas)<br>\n  2) Registrar conductividad y TOC en cada intervalo definido, sin resúmenes<br>\n  3) Registrar cada alarma y desviación con su tratamiento<br>\n  4) Verificar que no haya paradas no programadas ni estancamiento"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = operación continua del sistema; unidad = pasa/no pasa por registro y variables continuas. Tipo de dato = continua. n = 72 h continuas con registro cada 15 min. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = sin alarmas no tratadas y todas las variables dentro de límite. Atípicos = Grubbs solo si n ≥ 7 y sobre la escala de la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>72 h de operación continua (<span class=\"por-confirmar\">período de diseño</span>) sin alarmas no tratadas ni desviaciones abiertas.<br>Conductividad y TOC dentro de límite en cada registro.<br>Sin paradas no programadas ni estancamiento."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la operación (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La duración en rojo debe confirmarse con el plan de validación del sistema; el período se registra completo, sin resúmenes."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; USP &lt;1231&gt;; ISPE Baseline Guide Vol. 4 (Water and Steam Systems); EU GMP Anexo 15; 21 CFR 211.160(b)."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "resumen",
    "id": "SIS-OQ-AP-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-RES — Tabla resumen de los ensayos del OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del OQ del sistema de agua para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos SIS-OQ-AP-001 a SIS-OQ-AP-033 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 33 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "tabla",
    "id": "SIS-OQ-AP-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-OQ-AP-REF — Referencias del OQ del sistema de agua",
    "secciones": [],
    "tabla": {
     "headers": [
      "SECCIÓN",
      "TÍTULO",
      "ESTADO"
     ],
     "rows": [
      [
       "6.1",
       "Manual del fabricante del sistema — Etapas, setpoints y límites de diseño",
       "VIGENTE"
      ],
      [
       "6.2",
       "URS aprobada — Calidad del agua, caudales y criterios de aceptación",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: el OQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "USP 1231 — Agua para uso farmacéutico: validación del sistema y niveles de alerta y acción",
       "VIGENTE"
      ],
      [
       "6.5",
       "ISPE Baseline Guide Vol. 4 — Sistemas de agua y vapor, 3.ª ed.: diseño, operación y ciclo de vida",
       "VIGENTE"
      ],
      [
       "6.6",
       "FDA — Guide to Inspections of High Purity Water Systems: criterios de inspección",
       "VIGENTE"
      ]
     ]
    },
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de operación, curvas y tendencias por etapa</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de calibración de instrumentos en línea y patrones</td></tr>\n<tr><td>8.3</td><td>Anexo C — Registros de sanitizaciones, alarmas y excursiones</td></tr>\n</tbody></table>",
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO OQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Operación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Operación con producción, control de calidad e ingeniería, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar la siguiente fase.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-001 — Dampers cortafuego",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el cierre de los dampers cortafuego al activar la alarma y su rearme."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Activar la alarma y verificar el cierre de cada damper cortafuego<br>\n  2) Verificar el rearme según el diseño y la normativa local"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cierre total ante la alarma.<br>\n  Rearme según diseño y normativa local."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-002 — Interlocks de la UMA",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los interlocks: calefacción sin flujo de aire, humidificador sin flujo, protección anticongelante y extracción vs. suministro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular calefacción sin flujo de aire y verificar el bloqueo<br>\n  2) Simular humidificador sin flujo y verificar el bloqueo<br>\n  3) Simular condición anticongelante de serpentines y verificar la protección<br>\n  4) Verificar la coordinación del ventilador de extracción frente al suministro"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada interlock actúa ante su condición."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de interlocks simulados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-003 — Alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma dispara y que ocurre la acción asociada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar presión diferencial fuera de rango y verificar disparo y acción<br>\n  2) Provocar alta y baja temperatura y humedad relativa y verificar<br>\n  3) Provocar diferencial de filtros, pérdida de flujo y falla de ventilador y verificar"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada alarma dispara y ejecuta su acción."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de alarmas y acciones (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-004 — Falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar estado seguro, reinicio ordenado de ventiladores y extracción, y efecto sobre la cascada de presiones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cortar la energía y verificar el estado seguro<br>\n  2) Restablecer y verificar el reinicio ordenado de ventiladores y extracción<br>\n  3) Verificar el efecto sobre la cascada de presiones"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estado seguro ante la falla.<br>\n  Reinicio ordenado con cascada recuperada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-005 — Redundancia de ventiladores",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el cambio automático al ventilador de reserva, con registro del tiempo y de la presión durante la transferencia (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular la falla del ventilador principal (si aplica)<br>\n  2) Verificar el cambio automático y registrar tiempo y presión durante la transferencia"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cambio automático con tiempo y presión dentro de lo definido en el protocolo aprobado (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la transferencia (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-006 — Caudal de aire de la UMA",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el caudal de suministro, retorno y aire fresco, con la relación frecuencia del ventilador vs. caudal."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el caudal de suministro, retorno y aire fresco<br>\n  2) Registrar la relación frecuencia del ventilador vs. caudal<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Caudales dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de caudales"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-007 — Proporción de aire fresco y recirculación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el ajuste y la repetibilidad de la proporción de aire fresco y recirculación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la proporción y verificar el punto alcanzado<br>\n  2) Repetir y verificar repetibilidad"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ajuste repetible según lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-008 — Serpentines",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar capacidad, control y respuesta de los serpentines de enfriamiento, calefacción y poscalentamiento."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la capacidad de cada serpentín<br>\n  2) Verificar control y respuesta"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Capacidad y respuesta según lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-009 — Deshumidificación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la capacidad de remoción y el control de punto de rocío, con carga térmica y de humedad simulada (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar carga térmica y de humedad simulada (si aplica)<br>\n  2) Medir la remoción y el punto de rocío<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Remoción y punto de rocío dentro de lo definido en el protocolo aprobado (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de deshumidificación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-010 — Humidificador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar capacidad, control y calidad del agua o vapor del humidificador (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la capacidad y el control (si aplica)<br>\n  2) Verificar la calidad del agua o vapor<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Capacidad y control dentro de lo definido en el protocolo aprobado (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del humidificador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-011 — Filtros de la UMA",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la caída de presión inicial de prefiltros y filtros finos, con alarma al límite definido."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la caída de presión inicial de prefiltros y finos<br>\n  2) Verificar la alarma al límite definido<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Alarma al límite definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de filtros"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-012 — Dampers y actuadores",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar carrera, hermeticidad y respuesta de dampers y actuadores."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la carrera de cada damper<br>\n  2) Verificar hermeticidad y respuesta del actuador"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Carrera completa, cierre hermético y respuesta según lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-013 — Motor y ventilador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar corriente, vibración y temperatura del motor y el ventilador."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir corriente, vibración y temperatura<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Valores dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del ventilador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-014 — Integridad de filtros HEPA",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la integridad con aerosol de PAO o DEHP con fotómetro, con escaneo de toda la superficie y del marco."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar el aerosol aguas arriba y escanear toda la superficie y el marco con fotómetro<br>\n  2) Registrar la penetración local<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La penetración local no supera el límite definido (referencia habitual 0,01% de la concentración aguas arriba, verifica tu norma)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del escaneo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de integridad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-015 — Concentración del aerosol aguas arriba",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la concentración del aerosol es suficiente y uniforme, verificada y registrada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la concentración aguas arriba en varios puntos<br>\n  2) Verificar suficiencia y uniformidad<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Concentración suficiente y uniforme, verificada y registrada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del aerosol"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-016 — Hermeticidad de carcasa y marco",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la hermeticidad de la carcasa y del marco, si no se cubrió en IQ."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar y probar la hermeticidad de carcasa y marco, si no se cubrió en IQ<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin fugas en carcasa ni marco."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de hermeticidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-017 — Velocidad y uniformidad en el filtro",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la velocidad y la uniformidad en la cara del filtro (si aplica a flujo unidireccional)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la velocidad en la cara del filtro (si aplica)<br>\n  2) Verificar la uniformidad<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Velocidad y uniformidad según lo definido (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-018 — Caudal por cuarto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el caudal por difusor o filtro terminal y el caudal total por cuarto, frente al diseño."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el caudal por difusor o filtro terminal<br>\n  2) Totalizar por cuarto y comparar contra el diseño<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Caudales conformes al diseño."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de caudales"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema. URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-019 — Cambios de aire por hora",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los cambios de aire por hora calculados, dentro del criterio del URS."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Calcular los cambios de aire por hora por cuarto<br>\n  2) Comparar contra el criterio del URS<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro del criterio del URS."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de ACH"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-020 — Cascada de presiones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el diferencial entre cuartos adyacentes, con todas las puertas cerradas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el diferencial entre cuartos adyacentes con puertas cerradas<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Diferencial según el URS (referencia habitual de 10 a 15 Pa entre clases distintas, o el valor del URS)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cascada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios); OMS TRS 937 Anexo 2 (cascada de presiones)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-021 — Esclusas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar interlocks de puertas, tiempo de recuperación y diferencial con una puerta abierta y con la secuencia normal de paso (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar los interlocks de puertas de la esclusa (si aplica)<br>\n  2) Medir el tiempo de recuperación y el diferencial con una puerta abierta y con la secuencia normal<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Interlocks efectivos y recuperación dentro de lo definido en el protocolo aprobado (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de esclusas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-022 — Sentido del flujo de aire",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar con humo que el aire va de la zona más limpia a la menos limpia."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Visualizar con humo en puertas, esclusas y pasamuros<br>\n  2) Confirmar el sentido del flujo<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Flujo de la zona más limpia a la menos limpia."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico y de observaciones con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de flujo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-023 — Extracción de polvo y campanas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el caudal de captura y el efecto sobre la presión del cuarto con los equipos en marcha (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el caudal de captura con los equipos en marcha (si aplica)<br>\n  2) Verificar el efecto sobre la presión del cuarto<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Captura efectiva sin invertir la cascada (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de extracción"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-024 — Control de temperatura y humedad por cuarto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar exactitud, estabilidad y tiempo de respuesta ante un cambio de setpoint, en reposo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar exactitud y estabilidad de temperatura y humedad en cada cuarto<br>\n  2) Cambiar el setpoint y medir el tiempo de respuesta<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud y estabilidad dentro de lo definido en el protocolo aprobado en reposo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis ambiental"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-025",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-025 — Mapeo de temperatura y humedad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el mapeo de cuartos críticos, con sensores en varios puntos, durante el tiempo justificado (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ubicar sensores en varios puntos de los cuartos críticos (si aplica)<br>\n  2) Ejecutar el mapeo durante el tiempo justificado<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura y duración según lo justificado (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de mapeo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-026",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-026 — Carga térmica simulada",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema mantiene el rango ante una carga térmica simulada (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Encender equipos o calentadores según lo definido (si aplica)<br>\n  2) Verificar que se mantiene el rango<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Rango mantenido con la carga simulada (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de carga"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-027",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-027 — Ruido e iluminación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el nivel de ruido e iluminación, si el URS lo exige."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir ruido e iluminación si el URS lo exige<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de lo exigido por el URS, si aplica."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de ruido e iluminación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-028",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-028 — Conteo de partículas en reposo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el conteo de partículas de 0,5 µm y 5 µm en reposo, con puntos y volumen conforme a ISO 14644-1, en cada cuarto clasificado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear los puntos definidos con el volumen de ISO 14644-1, en cada cuarto clasificado<br>\n  2) Comparar contra los límites<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Límites conformes (referencia: ISO 8 = 3 520 000 e ISO 7 = 352 000 partículas por m3 en 0,5 µm; verifica contra tu edición de la norma)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de conteo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de partículas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios). ISO 14644-1 (clasificación por partículas)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-029",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-029 — Recuperación del cuarto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el tiempo que tarda el cuarto en recuperar la clase tras generar partículas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Generar partículas y medir el tiempo de recuperación de la clase<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Recuperación dentro de lo definido en el protocolo aprobado (referencia habitual de 15 a 20 min para reducir 100 veces)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de recuperación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-030",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-030 — Fuga o contención entre cuartos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar con trazador o conteo en cuarto adyacente (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar trazador o conteo en el cuarto adyacente (si aplica)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin paso entre cuartos (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de contención"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-031",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-031 — Flujo unidireccional en zona A",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar velocidad y uniformidad del flujo unidireccional en zona A, y estudios de humo con el movimiento de operarios (solo áreas estériles, si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir velocidad y uniformidad en zona A (solo áreas estériles, si aplica)<br>\n  2) Ejecutar estudios de humo con movimiento de operarios<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Flujo unidireccional conforme (solo áreas estériles, si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis unidireccional"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios). EU GMP Anexo 1 (áreas estériles, si aplica)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-032",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-032 — Diferencial entre grados",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el diferencial de presión entre grados adyacentes (solo áreas estériles, si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el diferencial entre grados adyacentes (solo áreas estériles, si aplica)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Diferencial según lo definido (solo áreas estériles, si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de diferenciales"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-033",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-033 — HEPA en áreas estériles",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar integridad de HEPA con escaneo completo y prueba de hermeticidad del marco (solo áreas estériles, si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Escanear la superficie completa y probar la hermeticidad del marco (solo áreas estériles, si aplica)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Integridad y hermeticidad conformes (solo áreas estériles, si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis HEPA"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-034",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-034 — Viables en reposo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar partículas viables en reposo y partículas de 5 µm con muestreo continuo (solo áreas estériles, si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear viables en reposo y 5 µm en continuo (solo áreas estériles, si aplica)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites adoptados (solo áreas estériles, si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de viables"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-035",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-035 — Sensores del monitoreo ambiental",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar exactitud frente a patrón y alarmas de los sensores de presión, temperatura y humedad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Comparar cada sensor contra su patrón<br>\n  2) Verificar sus alarmas<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud dentro de lo definido en el protocolo aprobado con alarmas operativas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de sensores"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-036",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-036 — Intervalo de registro y marca de tiempo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el intervalo de registro y la marca de tiempo del monitoreo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el intervalo de registro<br>\n  2) Verificar la exactitud de fecha y hora<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Intervalo y marca exactos según lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de registro"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-037",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-037 — Servicios a la UMA",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar agua helada o refrigerante, vapor y electricidad en rango operativo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar cada servicio en su rango operativo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Servicios en rango operativo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de servicios (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-HV-038",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-038 — Aire comprimido de actuadores",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el aire comprimido para actuadores neumáticos (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir presión y calidad del aire de actuadores (si aplica)"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de lo definido (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "resumen",
    "id": "SIS-OQ-HV-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-RES — Tabla resumen de los ensayos del OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del OQ del HVAC para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos SIS-OQ-HV-001 a SIS-OQ-HV-038 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 38 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "tabla",
    "id": "SIS-OQ-HV-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-OQ-HV-REF — Referencias del OQ del HVAC",
    "secciones": [],
    "tabla": {
     "headers": [
      "SECCIÓN",
      "TÍTULO",
      "ESTADO"
     ],
     "rows": [
      [
       "6.1",
       "Manual del fabricante del sistema — UMA, filtros y controles",
       "VIGENTE"
      ],
      [
       "6.2",
       "URS aprobada — Caudales, presiones, clases y criterios de aceptación",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: el OQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "ISO 14644-1 — Salas limpias: clasificación por concentración de partículas",
       "VIGENTE"
      ],
      [
       "6.5",
       "EU GMP Anexo 1 — Áreas estériles (solo si aplica al alcance)",
       "VIGENTE"
      ],
      [
       "6.6",
       "OMS TRS 937 Anexo 2 — HVAC: cascada de presiones y diferenciales",
       "VIGENTE"
      ]
     ]
    },
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de caudales, presiones y conteos por cuarto</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de calibración de instrumentos y patrones</td></tr>\n<tr><td>8.3</td><td>Anexo C — Reportes de integridad HEPA, humo y excursiones</td></tr>\n</tbody></table>",
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO OQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Operación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Operación con producción, control de calidad e ingeniería, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar la siguiente fase.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-001 — Válvulas de seguridad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el certificado vigente y la prueba de apertura a la presión de tarado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el certificado vigente de cada válvula<br>\n  2) Probar la apertura a la presión de tarado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Certificado vigente.<br>\n  Apertura a la presión de tarado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro y certificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-002 — Parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la despresurización y el estado seguro ante parada de emergencia."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Accionar la parada de emergencia<br>\n  2) Verificar despresurización y estado seguro"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Despresurización completa y estado seguro."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-003 — Interlocks del generador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar nivel mínimo con calefacción inhibida, sobrepresión, sobretemperatura y falta de agua de alimentación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular nivel mínimo y verificar calefacción inhibida<br>\n  2) Simular sobrepresión y sobretemperatura y verificar la respuesta<br>\n  3) Simular falta de agua de alimentación y verificar el bloqueo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada interlock actúa ante su condición."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de interlocks simulados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-004 — Alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma dispara y que ocurre la acción asociada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar conductividad alta del condensado y verificar disparo y acción<br>\n  2) Provocar presión alta o baja, nivel, falla de bomba de alimentación y falla de purgador, y verificar<br>\n  3) Verificar el desvío de vapor fuera de especificación a drenaje"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada alarma dispara.<br>\n  El vapor fuera de especificación se desvía a drenaje."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de alarmas y acciones (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-005 — Falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar estado seguro, sin arranque espontáneo, y ausencia de retorno de condensado al generador."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cortar la energía y verificar el estado seguro<br>\n  2) Restablecer y verificar que no hay arranque espontáneo<br>\n  3) Verificar que no retorna condensado al generador"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estado seguro sin arranque espontáneo.<br>\n  Sin retorno de condensado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-006 — Redundancia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el cambio a la bomba o generador de reserva (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular la falla del equipo principal (si aplica)<br>\n  2) Verificar el cambio a la reserva"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cambio efectivo a la reserva (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-007 — Alimentación del generador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el caudal y la presión de alimentación de agua y de vapor de calefacción."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el caudal y la presión de alimentación de agua<br>\n  2) Medir el caudal y la presión del vapor de calefacción<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Alimentación dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de alimentación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-008 — Capacidad del generador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la producción de vapor puro a la demanda nominal y a la máxima declarada, con presión de salida estable."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar a la demanda nominal y medir la producción con presión estable<br>\n  2) Operar a la máxima declarada y verificar estabilidad<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Producción conforme con presión estable en ambas demandas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de capacidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-009 — Respuesta a variaciones de demanda",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el aumento brusco y la caída de demanda, con tiempo de recuperación y estabilidad de presión."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar aumento brusco (por ejemplo apertura simultánea de varios usuarios)<br>\n  2) Provocar la caída y medir el tiempo de recuperación y la estabilidad<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Recuperación y estabilidad dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de demanda"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-010 — Nivel y purga del generador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el control de nivel y la purga continua o de fondo, con secuencia y tiempos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el control de nivel<br>\n  2) Verificar la secuencia y los tiempos de la purga continua o de fondo<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Nivel controlado con purga según secuencia y tiempos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de nivel"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-011 — Separador de gotas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la eficiencia de separación de gotas, con verificación por caída de presión y por el condensado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la caída de presión en el separador o trampa de arrastre<br>\n  2) Verificar la eficiencia por el condensado<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Separación efectiva según lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del separador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-012 — Temperatura y presión de salida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud del control en el rango operativo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir temperatura y presión de salida en el rango operativo<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Control exacto en el rango operativo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de salida"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-013 — Enfriamiento y drenaje del condensado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el sistema de enfriamiento y drenaje del condensado del generador."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el enfriamiento del condensado<br>\n  2) Verificar su drenaje<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Enfriamiento y drenaje efectivos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de drenaje"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-014 — Pendiente y drenabilidad de líneas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar en campo que el condensado fluye hacia los purgadores, sin tramos con contrapendiente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recorrer las líneas y verificar la pendiente en campo<br>\n  2) Verificar que el condensado fluye hacia los purgadores"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin tramos con contrapendiente.<br>\n  Flujo hacia purgadores confirmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de campo (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-015 — Purgadores",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el funcionamiento de cada purgador, su ubicación en puntos bajos y al final de ramales, con prueba individual."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Probar individualmente cada purgador: descarga de condensado sin fuga de vapor vivo<br>\n  2) Verificar ubicación en puntos bajos y al final de ramales"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada purgador descarga sin fuga de vapor vivo.<br>\n  Ubicación conforme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro individual por purgador (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-016 — Ramales muertos de vapor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la longitud respecto al diámetro (regla de 3D) en puntos de uso y válvulas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir cada ramal y su diámetro en puntos de uso y válvulas<br>\n  2) Aplicar la regla de 3D o el criterio adoptado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de la regla de 3D o del criterio adoptado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de ramales (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-017 — Caída de presión en distribución",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la caída de presión hasta el punto más lejano con todos los usuarios operando."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar todos los usuarios a la vez<br>\n  2) Medir la presión en el punto más lejano"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Presión dentro de lo definido en el protocolo aprobado en el punto más lejano."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-018 — Venteo de aire en el arranque",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la eliminación de aire en líneas y equipos, sin bolsas de gas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Arrancar y verificar el venteo de aire en líneas y equipos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin bolsas de gas en el arranque."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-019 — Aislamiento térmico",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar temperatura superficial segura y pérdida de calor dentro del criterio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la temperatura superficial<br>\n  2) Verificar la pérdida de calor contra el criterio definido en el protocolo aprobado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Superficie segura con pérdida dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-020 — Puntos de muestreo de vapor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el diseño sanitario, el condensador de muestreo con enfriamiento, la válvula y la conexión estéril."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el diseño sanitario de cada punto<br>\n  2) Verificar el serpentín de enfriamiento, la válvula y la conexión estéril<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Puntos sanitarios con enfriamiento efectivo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de puntos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-021 — Reductoras de presión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el control de la presión aguas abajo y que no generan sobrecalentamiento excesivo (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar cada reguladora y reductora y su presión aguas abajo (si aplica)<br>\n  2) Verificar que no genera sobrecalentamiento excesivo<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Presión aguas abajo controlada sin sobrecalentamiento excesivo (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de reductoras"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-022 — Calidad del vapor en régimen",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar sequedad, gases no condensables y sobrecalentamiento en la salida del generador con el sistema en régimen."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir sequedad, gases no condensables y sobrecalentamiento en un punto de referencia<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites definidos en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de calidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema. EN 285 (calidad del vapor y del condensado; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-023 — Calidad del condensado de arranque",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que tras la puesta en marcha el condensado alcanza el límite en un tiempo definido."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Arrancar y muestrear el condensado en el tiempo<br>\n  2) Registrar el tiempo hasta alcanzar el límite (cuánto purgar antes de usar)<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Límite alcanzado en el tiempo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de arranque"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-024 — Arranque tras paro prolongado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar purga, calentamiento de líneas y tiempo hasta vapor en especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Purgar y calentar las líneas tras el paro prolongado<br>\n  2) Medir el tiempo hasta vapor en especificación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tiempo dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del arranque (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-025",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-025 — Purga de condensado tras paro",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que no hay acumulación en puntos bajos tras la purga."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Purgar tras el paro y revisar puntos bajos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin acumulación en puntos bajos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la purga (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-VL-026",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-026 — Operación continua del sistema",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la operación continua del sistema completo durante un período definido, a demanda variable, sin alarmas ni desviaciones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar 72 h (o el período definido) a demanda variable<br>\n  2) Verificar ausencia de alarmas y desviaciones<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Operación continua sin alarmas ni desviaciones no tratadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de operación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "resumen",
    "id": "SIS-OQ-VL-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-RES — Tabla resumen de los ensayos del OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del OQ del vapor limpio para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos SIS-OQ-VL-001 a SIS-OQ-VL-026 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 26 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "tabla",
    "id": "SIS-OQ-VL-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-OQ-VL-REF — Referencias del OQ del vapor limpio",
    "secciones": [],
    "tabla": {
     "headers": [
      "SECCIÓN",
      "TÍTULO",
      "ESTADO"
     ],
     "rows": [
      [
       "6.1",
       "Manual del fabricante del sistema — Generador, distribución y trampas",
       "VIGENTE"
      ],
      [
       "6.2",
       "URS aprobada — Presiones, calidad del vapor y criterios de aceptación",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: el OQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "EN 285 — Esterilizadores a vapor: calidad del vapor y del condensado",
       "VIGENTE"
      ],
      [
       "6.5",
       "ISPE Baseline Guide Vol. 4 — Sistemas de agua y vapor, 3.ª ed. (parte de vapor)",
       "VIGENTE"
      ]
     ]
    },
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de presiones, temperaturas y calidad por punto</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de calibración y de válvulas de seguridad</td></tr>\n<tr><td>8.3</td><td>Anexo C — Análisis de condensado, alarmas y excursiones</td></tr>\n</tbody></table>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO OQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Operación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "aire-comprimido"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "aire-comprimido"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Operación con producción, control de calidad e ingeniería, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar la siguiente fase.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "aire-comprimido"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-001 — Válvulas de seguridad de los receptores",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el certificado vigente y la prueba de apertura."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el certificado vigente de cada válvula<br>\n  2) Probar la apertura"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Certificado vigente.<br>\n  Apertura conforme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro y certificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-002 — Parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la parada de emergencia y la despresurización a estado seguro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Accionar la parada de emergencia<br>\n  2) Verificar la despresurización a estado seguro"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Despresurización completa y estado seguro."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-003 — Interlocks del compresor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar alta temperatura, baja presión de aceite o refrigerante, sobrecarga del motor y presión máxima."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular cada condición de protección<br>\n  2) Verificar la respuesta del interlock"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada interlock actúa ante su condición."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de interlocks simulados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-004 — Alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma dispara y que ocurre la acción asociada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar punto de rocío alto, diferencial alto de filtros, baja presión, alta temperatura, falla de drenaje y falla del secador<br>\n  2) Verificar cada disparo y su acción"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada alarma dispara y ejecuta su acción."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de alarmas y acciones (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-005 — Falla del secador en marcha",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema alarma y aísla o inhibe la entrega de aire húmedo a los puntos críticos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular la falla del secador con el compresor en marcha<br>\n  2) Verificar alarma y aislamiento o inhibición de la entrega a puntos críticos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ningún punto crítico recibe aire húmedo sin alarma y bloqueo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-006 — Falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar estado seguro, secuencia de reinicio ordenada y presión estable antes de entregar aire."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cortar la energía y verificar el estado seguro<br>\n  2) Restablecer con secuencia ordenada y verificar presión estable antes de entregar"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Reinicio ordenado con presión estable."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-007 — Redundancia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el cambio automático entre compresores y entre torres del secador, con registro de presión y punto de rocío (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular la falla del equipo líder (si aplica)<br>\n  2) Verificar el cambio automático con registro de presión y rocío"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Transferencia automática con variables dentro de lo definido en el protocolo aprobado (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la transferencia (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-008 — Capacidad del compresor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el caudal entregado a presión nominal y a máxima demanda declarada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el caudal entregado a presión nominal<br>\n  2) Medir a máxima demanda declarada<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Caudal dentro de lo definido en el protocolo aprobado en ambas condiciones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de capacidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-009 — Control de presión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la banda de carga y descarga o el control por variador, sin ciclado excesivo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la banda de carga y descarga o el variador<br>\n  2) Verificar ausencia de ciclado excesivo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Control estable sin ciclado excesivo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-010 — Temperatura del posenfriador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la temperatura de salida está dentro del rango de diseño del secador."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la temperatura de salida del posenfriador<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro del rango de diseño del secador."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de temperatura"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-011 — Drenajes de condensado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar cada drenaje, sin fuga de aire ni retención de agua, en receptor, posenfriador y filtros."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Probar cada drenaje del receptor, posenfriador y filtros"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin fuga de aire ni retención de agua."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro por drenaje (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-012 — Tanque receptor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar volumen suficiente para picos sin caída de presión, y drenaje desde el punto bajo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar picos de demanda y verificar que no cae la presión<br>\n  2) Verificar el drenaje desde el punto bajo<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin caída de presión ante picos.<br>\n  Drenaje efectivo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del receptor"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-013 — Punto de rocío de salida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el punto de rocío a presión en demanda nominal y máxima, con las condiciones de entrada de diseño."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el rocío a demanda nominal y máxima con temperatura y humedad de entrada de diseño<br>\n  2) Comparar contra un sensor de referencia calibrado<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro del límite del URS en ambas demandas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de rocío"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-014 — Regeneración del desecante",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar tiempos, caudal de purga, sin sobrecalentamiento y consumo de purga dentro del criterio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar tiempos y caudal de purga del ciclo<br>\n  2) Verificar ausencia de sobrecalentamiento y consumo dentro del criterio<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ciclo dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de regeneración"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-015 — Conmutación de torres",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el punto de rocío no sube por encima del límite durante el cambio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el rocío en continuo durante la conmutación<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin picos sobre el límite durante el cambio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de conmutación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-016 — Alarma de punto de rocío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar umbral y retardo definidos, con respuesta verificada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar el umbral y medir el retardo<br>\n  2) Verificar la respuesta<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Umbral y retardo dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de alarma"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-017 — Secador refrigerativo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar temperatura de evaporador y drenaje, si hay uno antes del desecante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la temperatura del evaporador si hay secador refrigerativo previo<br>\n  2) Verificar su drenaje<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de lo definido si aplica."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del secador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-018 — Caída de presión de filtros",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la caída de cada filtro nuevo dentro de la especificación del fabricante, y alarma al límite."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la caída de cada filtro nuevo contra la especificación del fabricante<br>\n  2) Verificar la alarma al límite definido<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de especificación con alarma al límite."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de filtros"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-019 — Carcasas y drenajes de filtros",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar ausencia de fuga y de acumulación de condensado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar carcasas y drenajes"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin fuga ni acumulación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la inspección (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-020 — Carbón activado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la eliminación de vapor de aceite aguas abajo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el vapor de aceite aguas abajo del carbón<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Eliminación dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de carbón"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-021 — Filtros terminales",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar integridad, disposición y caída en servicio de los filtros de 0,2 µm en puntos críticos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Probar la integridad por punto de burbuja, difusión o intrusión de agua<br>\n  2) Verificar la disposición del filtro y la caída en servicio<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Integridad confirmada con caída dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de terminales"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-022 — Posición de filtros tras el secador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la filtración de partículas posterior al secador retiene el polvo del desecante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la posición de la filtración respecto al secador<br>\n  2) Verificar la retención del polvo del desecante<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Retención efectiva del polvo del desecante."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de posición"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-023 — Caída de presión en distribución",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la caída desde el receptor hasta el punto más lejano a máxima demanda, con todos los usuarios operando."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar todos los usuarios a máxima demanda<br>\n  2) Medir hasta el punto más lejano<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Caída dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de distribución"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-024 — Pendiente y drenabilidad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el condensado fluye a drenajes y no queda retenido."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recorrer las líneas y verificar pendiente y drenajes"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin condensado retenido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de campo (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-025",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-025 — Ramales muertos y puntos bajos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar longitud respecto al diámetro, y ubicación de drenajes y filtros."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir ramales y puntos bajos contra su diámetro<br>\n  2) Verificar drenajes y filtros asociados"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ramales conformes con drenaje y filtrado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de campo (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-026",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-026 — Prueba de fugas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la caída de presión con el sistema aislado y la detección por ultrasonido, con criterio de fuga máxima del URS."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aislar el sistema y medir la caída de presión<br>\n  2) Localizar fugas por ultrasonido<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Fuga total dentro del máximo del URS."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de fugas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-027",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-027 — Identificación y conexiones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar línea rotulada con sentido de flujo, sin conexión cruzada con aire sin calidad definida, y acoples incompatibles con otros gases."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar rotulado y sentido de flujo<br>\n  2) Verificar ausencia de conexión cruzada con aire de planta o instrumentación<br>\n  3) Verificar acoples incompatibles con otros gases"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Línea identificada sin cruzadas y con acoples dedicados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico y de verificación (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-028",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-028 — Reguladores de punto de uso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar control de presión y ausencia de contaminación por desgaste (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar cada regulador y válvula de punto de uso (si aplica)<br>\n  2) Verificar ausencia de contaminación por desgaste"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Control efectivo sin contaminación (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-029",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-029 — Limpieza de la tubería",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar ausencia de partículas, aceite y residuos de soldadura tras purga o soplado, si no se cubrió en IQ."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Purgar o soplar y verificar partículas, aceite y residuos, si no se cubrió en IQ<br>\n  2) Registrar el resultado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tubería limpia según criterio si aplica."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de limpieza (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-030",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-030 — Calidad del aire en línea base",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir a la salida del secador y tras los filtros finales: rocío, partículas, aceite y vapor, con límites del URS."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir punto de rocío a presión<br>\n  2) Medir partículas (ISO 8573-4) y aceite total, aerosol y vapor (ISO 8573-2 y 8573-5)<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites del URS."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de línea base"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios). ISO 8573 (aire comprimido: calidad y métodos; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-031",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-031 — Gases en el aire",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar CO, CO2, SO2 y NOx, si el aire contacta producto y el URS lo exige (ISO 8573-6)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir los gases si hay contacto directo y el URS lo exige<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites si aplica."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de gases"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-032",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-032 — Sensor de rocío en línea",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar exactitud frente a patrón, y registro continuo con alarma."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Comparar el sensor contra su patrón<br>\n  2) Verificar registro continuo y alarma<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud dentro de lo definido en el protocolo aprobado con alarma operativa."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del sensor"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-033",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-033 — Contadores y sensores en línea",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar exactitud y alarmas del contador de partículas o sensores de presión en línea."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Comparar contra referencia y verificar alarmas<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud dentro de lo definido en el protocolo aprobado con alarmas operativas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis en línea"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-034",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-034 — Intervalo de registro y marca de tiempo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el intervalo de registro y la exactitud de la marca de tiempo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el intervalo de registro<br>\n  2) Verificar fecha y hora<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Intervalo y marca exactos según lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de registro"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-035",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-035 — Suministro eléctrico y enfriamiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar caudal y temperatura en rango, y ventilación y admisión de la sala (el aire aspirado debe estar libre de contaminantes)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar suministro eléctrico y agua de enfriamiento si el compresor es refrigerado por agua<br>\n  2) Verificar ventilación, temperatura y admisión libre de escape, solventes y vapores"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Servicios en rango con admisión limpia."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de servicios (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-036",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-036 — Sala de compresores",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar espacio y condiciones de admisión."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar espacio y admisión de la sala"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Condiciones dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la verificación (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-037",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-037 — Operación continua del sistema",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la operación continua durante un período definido con demanda variable."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar 72 h (o el período definido) con demanda variable<br>\n  2) Verificar presión estable, rocío en límite y sin alarmas<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Operación continua sin alarmas no tratadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de operación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-OQ-AC-038",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-038 — Aumento brusco de demanda",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar caída de presión, tiempo de recuperación y estabilidad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar el aumento brusco y medir caída y recuperación<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Recuperación y estabilidad dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de demanda"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "resumen",
    "id": "SIS-OQ-AC-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-RES — Tabla resumen de los ensayos del OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del OQ del aire comprimido para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos SIS-OQ-AC-001 a SIS-OQ-AC-038 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 38 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "tabla",
    "id": "SIS-OQ-AC-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-OQ-AC-REF — Referencias del OQ del aire comprimido",
    "secciones": [],
    "tabla": {
     "headers": [
      "SECCIÓN",
      "TÍTULO",
      "ESTADO"
     ],
     "rows": [
      [
       "6.1",
       "Manual del fabricante del sistema — Compresor, secador y filtros",
       "VIGENTE"
      ],
      [
       "6.2",
       "URS aprobada — Punto de rocío, presiones y clases ISO 8573",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: el OQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "ISO 8573 — Aire comprimido: calidad y métodos de medición",
       "VIGENTE"
      ],
      [
       "6.5",
       "ISO 8573-1 — Clases de pureza del aire comprimido",
       "VIGENTE"
      ]
     ]
    },
    "familia": "aire-comprimido"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de rocío, presiones y calidad por punto</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de calibración de sensores y patrones</td></tr>\n<tr><td>8.3</td><td>Anexo C — Análisis de laboratorio, alarmas y excursiones</td></tr>\n</tbody></table>",
    "familia": "aire-comprimido"
   }
  ],
  "PQ": [
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO PQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Desempeño de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Desempeño con producción, control de calidad e ingeniería, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar la siguiente fase.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice. Este protocolo cubre agua purificada (PW) y agua para inyección (WFI). El tipo de agua se declara en la portada antes de la ejecución; los ensayos marcados «solo WFI» se declaran No Aplica con aprobación previa de Calidad cuando el sistema no produce WFI, y no se eliminan del protocolo aprobado.</p>",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-001 — Monitoreo intensivo de Fase 1",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar con muestreo diario de todos los puntos que el sistema produce agua conforme en la Fase 1 y establecer la línea base de alerta y acción."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear a diario todos los puntos del loop y de uso: conductividad, TOC y microbiología<br>\n  2) Muestrear el pretratamiento con frecuencia menor pero regular<br>\n  3) Registrar cada muestra con punto, fecha, hora, instrumento y analista<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Cobertura y línea base. Variable = conductividad (µS/cm), TOC (ppb) y recuento microbiano (UFC/mL o UFC/100 mL) por punto. n = todos los días de la Fase 1 (14 a 28 días) por cada punto. Cobertura = muestras válidas / muestras programadas con IC 95 % binomial exacto. Por parámetro y punto: media, DE, RSD, mínimo, máximo e IC 95 %. Línea de alerta = media + 2 DE de la Fase 1; línea de acción = límite farmacopeico. Tendencia = regresión lineal contra día. Sin exclusión de datos sin investigación documentada."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura del 100 % de los puntos programados durante 14 a 28 días.<br>\n  0 días sin cobertura y 0 resultados por encima del límite de acción."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros diarios con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de la línea base de Fase 1"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada; USP &lt;1231&gt; (validación del sistema y niveles de alerta y acción)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-002 — Restricción de uso en Fase 1",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que el agua no se libera para producto, o se usa solo con restricción documentada, durante la Fase 1."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar la restricción de uso definida<br>\n  2) Registrar cada autorización de uso restringido con responsable, fecha y justificación<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Estudio de atributo. Variable = uso liberado (sí/no) y autorización documentada (sí/no). n = todos los eventos de uso de la Fase 1. Proporción de usos restringidos con autorización con IC 95 % binomial exacto; criterio de cero liberaciones no autorizadas."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  0 liberaciones a producto durante la Fase 1.<br>\n  100 % de los usos restringidos con autorización documentada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de restricción con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del uso restringido"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-003 — Confirmación de parámetros de operación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar con los datos de la Fase 1 que caudales, temperaturas, sanitizaciones y SOPs operan dentro del diseño."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar caudal y temperatura de recirculación por turno<br>\n  2) Registrar cada sanitización con fecha, temperatura o concentración, duración y puntos alcanzados<br>\n  3) Confirmar los SOPs aplicados<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variables continuas (caudal m³/h, velocidad m/s, temperatura °C, duración min) y atributos (sanitización ejecutada sí/no). n = registros por turno de la Fase 1. Por variable: media, DE, mínimo, máximo e IC 95 %; comparación contra el valor de diseño de la URS con prueba t de una muestra o intervalo de confianza. Sanitizaciones: proporción ejecutada / programada con IC 95 % binomial exacto."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Caudal y velocidad ≥ <span class=\"por-confirmar\">el valor de diseño de la URS (referencia 1,5 m/s)</span>.<br>\n  Temperatura de sanitización ≥ <span class=\"por-confirmar\">80 °C durante ≥ 60 min</span>.<br>\n  100 % de las sanitizaciones registradas y 0 parámetros fuera de diseño."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de confirmación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de parámetros de operación"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los valores en rojo son referencias de diseño y quedan pendientes de confirmación contra la URS y el manual del fabricante antes de firmar el protocolo."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada; manual del fabricante; USP &lt;1231&gt;."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-004 — Puntos críticos y frecuencias de sanitización",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Definir con los datos de la Fase 1 los puntos críticos y la frecuencia de sanitización que sostiene el control."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Analizar por punto la frecuencia y magnitud de las excursiones de Fase 1<br>\n  2) Identificar los puntos críticos y proponer la frecuencia de sanitización<br>\n  3) Documentar la justificación con los datos y aprobarla antes de ejecutar<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Estudio de conteo por punto. Variable = número de excursiones por punto y por intervalo entre sanitizaciones. n = intervalos observados en la Fase 1. Tasa de excursiones por 100 muestras con IC 95 % de Poisson. Se elige la frecuencia que produce 0 excursiones en 3 ciclos consecutivos. Punto crítico = punto con tasa ≥ 2 veces la mediana del sistema."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Frecuencia de sanitización ≤ <span class=\"por-confirmar\">7 días</span> para PW y ≤ <span class=\"por-confirmar\">7 días</span> para WFI, o la que demuestre 0 excursiones en 3 ciclos consecutivos.<br>\n  100 % de los puntos críticos identificados y justificados con datos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Documento de definición con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de criticidad y frecuencias"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La frecuencia en rojo es una referencia; la frecuencia final se aprueba con los datos de la Fase 1 antes de ejecutar la sanitización."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-005 — Monitoreo de Fase 2",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar control con monitoreo continuo a frecuencia reducida y todos los puntos incluidos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Monitorear con frecuencia reducida respecto a la Fase 1, con todos los puntos incluidos<br>\n  2) Usar el agua para producto de forma controlada si la Fase 1 fue satisfactoria<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Cobertura y comparación con la línea base. Variable = conductividad, TOC y recuento microbiano por punto. n = todas las muestras de la Fase 2 (14 a 28 días). Cobertura semanal con IC 95 % binomial exacto. Comparación de medias contra la Fase 1 con prueba t o Mann-Whitney; tendencia con regresión lineal."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100 % de los puntos muestreados en cada semana de la Fase 2.<br>\n  Máximo 1 muestra omitida por punto con justificación documentada.<br>\n  0 resultados por encima del límite de acción."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de la Fase 2"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada; USP &lt;1231&gt;."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-006 — Excursiones de Fase 2",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que no quedan excursiones de límite de acción abiertas al cierre de la Fase 2."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar los límites de acción en toda la Fase 2<br>\n  2) Investigar y cerrar cada excursión con causa y disposición<br>\n  3) Registrar el tiempo de cierre de cada evento<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Estudio de conteo. Variable = número de excursiones de límite de acción. n = todas las muestras de la Fase 2. Tasa por 100 muestras con IC 95 % de Poisson; tiempo a cierre en días (mediana, mínimo, máximo); proporción cerrada con IC 95 % binomial exacto."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  0 excursiones de límite de acción abiertas al cierre de la Fase 2.<br>\n  100 % investigadas y cerradas; tiempo de cierre ≤ <span class=\"por-confirmar\">30 días</span>."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de excursiones con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de excursiones"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El plazo en rojo es una referencia y queda pendiente de confirmación por Calidad antes de la ejecución."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.192; URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-007 — Eficacia de la sanitización",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada sanitización reduce la carga microbiana de forma demostrable."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la carga microbiana antes de sanitizar en los puntos definidos<br>\n  2) Medir después de sanitizar en los mismos puntos<br>\n  3) Registrar temperatura o concentración y duración de la sanitización<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Comparación pareada antes/después. Variable = log10 UFC/mL o log10 UFC/100 mL por punto. n ≥ 3 puntos por sanitización. Diferencia de medias en log10 con IC 95 %; prueba t pareada si Shapiro-Wilk p &gt; 0,05, si no Wilcoxon. Reducción = media antes − media después."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Reducción ≥ <span class=\"por-confirmar\">3 log10</span> tras cada sanitización, o recuento posterior ≤ <span class=\"por-confirmar\">10 UFC/100 mL</span>.<br>\n  0 puntos con aumento de carga microbiana."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros antes/después con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de eficacia"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La reducción objetivo y el recuento posterior en rojo quedan pendientes de confirmación contra la USP adoptada y el SOP de sanitización antes de ejecutar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; SOP de sanitización."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-008 — Tendencia de Fase 2",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que conductividad, TOC y microbiología no presentan deriva durante la Fase 2."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Graficar la tendencia de conductividad, TOC y log10 del recuento microbiano por punto<br>\n  2) Evaluar la pendiente y las reglas de carta de control<br>\n  3) Investigar toda señal de deriva antes de cerrar la fase<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Tendencia por parámetro y punto. Variable = conductividad, TOC y log10 del recuento. n = todas las muestras de la Fase 2. Regresión lineal contra tiempo: pendiente, IC 95 % y p; sin deriva = p &gt; 0,05 y pendiente dentro de ±<span class=\"por-confirmar\">5 %</span> del valor medio por semana. Reglas de carta: 2 de 3 puntos &gt; 2 DE u 8 consecutivos al mismo lado."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin deriva estadísticamente significativa (p &gt; 0,05) en conductividad, TOC ni recuento microbiano.<br>\n  0 reglas de carta disparadas sin investigación cerrada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Gráficos con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de tendencia"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El porcentaje en rojo es una referencia de práctica y queda pendiente de confirmación por el responsable antes de ejecutar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-009 — Monitoreo de rutina de Fase 3",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar a largo plazo que el sistema sostiene el desempeño con la frecuencia de rutina y la rotación de puntos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear con la frecuencia definida, rotando los puntos de uso<br>\n  2) Registrar cada muestra con punto, fecha, hora e instrumento<br>\n  3) Comparar la media mensual contra la línea base de la Fase 1<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Cobertura y estabilidad a largo plazo. n = todas las muestras del ciclo de Fase 3. Cobertura por punto con IC 95 % binomial exacto. Media mensual contra la línea base de Fase 1 con prueba t o Mann-Whitney; tendencia por regresión lineal."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100 % de los puntos muestreados según la frecuencia definida (<span class=\"por-confirmar\">semanal</span> por punto, con rotación).<br>\n  0 muestras vencidas; medias mensuales dentro de ±<span class=\"por-confirmar\">2 DE</span> de la línea base."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de la Fase 3"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La frecuencia y el margen en rojo son referencias y quedan pendientes de confirmación por el responsable antes de ejecutar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-010 — Variaciones estacionales",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que el sistema sostiene la calidad frente a los cambios estacionales del agua de alimentación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar temperatura, cloro, carga orgánica y microorganismos del agua de alimentación por estación<br>\n  2) Verificar el desempeño del sistema en cada estación<br>\n  3) Comparar las medias entre estaciones<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Comparación entre estaciones. Variable = temperatura, cloro, carga orgánica y microorganismos del agua de alimentación, y desempeño del sistema. n ≥ 4 muestras por estación. ANOVA de una vía o Kruskal-Wallis según normalidad; diferencia entre estaciones con IC 95 %; umbral práctico ±<span class=\"por-confirmar\">20 %</span> en TOC y conductividad."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Desempeño dentro de los límites en las 4 estaciones.<br>\n  Diferencia de media entre estaciones ≤ <span class=\"por-confirmar\">20 %</span> en TOC y conductividad.<br>\n  0 excursiones microbiológicas de causa estacional sin investigación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico estacional"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El umbral en rojo es una referencia y queda pendiente de confirmación por el responsable antes de ejecutar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-011 — Tendencias, excursiones y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Revisar las tendencias y excursiones acumuladas y ajustar los límites de alerta y acción con los datos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar tendencias y excursiones acumuladas de las tres fases<br>\n  2) Calcular los límites de alerta y acción con la línea base<br>\n  3) Documentar y aprobar el ajuste antes de aplicarlo<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Ajuste de límites con datos acumulados. n = todas las muestras de las Fases 1 a 3. Límite de alerta = media + 2 DE de la línea base; límite de acción = límite farmacopeico. Proporción de resultados entre alerta y acción con IC 95 % binomial exacto; tendencia por regresión lineal."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Límite de alerta = media de Fase 1 + 2 DE; límite de acción = límite farmacopeico.<br>\n  100 % de los resultados por debajo del límite de acción.<br>\n  100 % de los resultados en alerta investigados y documentados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Documento de límites con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de límites"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-012 — Sanitización y mantenimiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar que la sanitización y el mantenimiento se ejecutan dentro de los intervalos definidos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el cambio de membranas, lámparas UV y filtros dentro de los intervalos<br>\n  2) Confirmar la frecuencia de sanitización<br>\n  3) Registrar cada vencimiento y su disposición<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Estudio de atributo y de intervalo. n = todos los mantenimientos y sanitizaciones del período. Cumplimiento = ejecutados dentro del intervalo / programados, con IC 95 % binomial exacto; días de vencimiento (mediana, máximo); tendencia de presión diferencial e intensidad UV."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100 % de los mantenimientos (membranas, lámparas UV y filtros) dentro del intervalo definido (<span class=\"por-confirmar\">según manual del fabricante</span>).<br>\n  0 vencimientos y 100 % de las sanitizaciones según la frecuencia aprobada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de mantenimiento"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El intervalo en rojo queda pendiente de confirmación contra el manual del fabricante antes de ejecutar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-013 — Conductividad y TOC",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar conductividad y TOC en todas las fases contra la especificación farmacopeica adoptada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir conductividad sin compensación de temperatura (USP &lt;645&gt;, tres etapas)<br>\n  2) Medir TOC (USP &lt;643&gt;)<br>\n  3) Comparar cada resultado contra el límite de acción y registrar el instrumento usado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variables continuas por punto. n = todas las muestras válidas de PW y WFI en las tres fases. Conductividad y TOC: media, DE, RSD, mínimo, máximo e IC 95 %. Tendencia por regresión contra tiempo. Límite de alerta = media de Fase 1 + 2 DE; límite de acción = <span class=\"por-confirmar\">1,3 µS/cm</span> y <span class=\"por-confirmar\">500 ppb</span>. Grubbs solo con investigación documentada."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Conductividad ≤ <span class=\"por-confirmar\">1,3 µS/cm a 25 °C sin compensación</span> (USP &lt;645&gt;, etapa 1).<br>\n  TOC ≤ <span class=\"por-confirmar\">500 ppb (0,5 mg/L)</span> (USP &lt;643&gt;) en el 100 % de las muestras de PW y WFI."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de conductividad y TOC"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los valores en rojo corresponden a USP &lt;645&gt; y &lt;643&gt; y quedan pendientes de confirmación de adopción por el responsable antes de firmar; si se adopta otra farmacopea, se actualizan antes de la ejecución."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;645&gt; (conductividad); USP &lt;643&gt; (TOC); USP &lt;1231&gt;."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-014 — Recuento microbiano total",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el recuento microbiano total se mantiene por debajo del límite de acción adoptado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el recuento microbiano total por punto con el método compendial adoptado<br>\n  2) Comparar cada resultado contra el límite de acción de PW o WFI<br>\n  3) Registrar el método, el medio y el tiempo de incubación<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Recuento microbiológico por punto. n = todas las muestras de PW y WFI. Los recuentos se transforman a log10. Por punto: media geométrica, DE de log10, mínimo, máximo e IC 95 %. Límite de acción = <span class=\"por-confirmar\">100 UFC/mL</span> (PW) o <span class=\"por-confirmar\">10 UFC/100 mL</span> (WFI). Proporción sobre el límite con IC 95 % binomial exacto; tendencia por regresión de log10. Grubbs solo sobre log10 y con n ≥ 7."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  PW ≤ <span class=\"por-confirmar\">100 UFC/mL</span> y WFI ≤ <span class=\"por-confirmar\">10 UFC/100 mL</span> (límites de acción USP &lt;1231&gt;) en el 100 % de las muestras.<br>\n  0 resultados por encima del límite de acción."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del recuento microbiano"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites en rojo corresponden a USP &lt;1231&gt; y quedan pendientes de confirmación de adopción por el responsable antes de firmar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt; (criterios microbiológicos); USP &lt;61&gt; (métodos)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-015 — Endotoxinas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el agua para inyección cumple el límite de endotoxinas adoptado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir endotoxinas en cada punto de WFI con el método compendial adoptado<br>\n  2) Comparar cada resultado individual contra el límite y registrar LOD/LOQ<br>\n  3) No promediar resultados para declarar cumplimiento<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Método analítico. n = todas las muestras de WFI. Cada resultado se compara contra <span class=\"por-confirmar\">0,25 UE/mL</span>; por punto: mediana, mínimo, máximo e IC 95 %; tendencia por regresión de log10; LOD/LOQ del método declarados."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  WFI ≤ <span class=\"por-confirmar\">0,25 UE/mL</span> (USP &lt;85&gt;/&lt;1231&gt;) en el 100 % de las muestras.<br>\n  0 resultados ≥ límite."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de endotoxinas"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El límite en rojo corresponde a USP &lt;85&gt;/&lt;1231&gt; y queda pendiente de confirmación de adopción por el responsable antes de firmar. El ensayo solo aplica a WFI."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;85&gt;; USP &lt;1231&gt;; URS aprobada."
     }
    ],
    "tabla": null,
    "aplica": "WFI",
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-016 — Nitratos, metales pesados y oxidantes",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los parámetros fisicoquímicos que exija la monografía adoptada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar qué parámetros exige la monografía adoptada (USP, Ph. Eur., IP o BP)<br>\n  2) Medir nitratos, metales pesados y sustancias oxidables solo si la monografía los exige<br>\n  3) Registrar el método y el LOD/LOQ de cada parámetro<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Métodos analíticos según la monografía adoptada. n = 1 muestra por punto y fase. Cada resultado se compara con el límite de la monografía; se reportan LOD/LOQ y método. Si la monografía no exige el parámetro, el ensayo se declara No Aplica con justificación."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Si la monografía adoptada los exige: nitrato ≤ <span class=\"por-confirmar\">0,2 ppm</span>, metales pesados ≤ <span class=\"por-confirmar\">0,1 ppm</span> y sustancias oxidables conformes a la prueba de permanganato.<br>\n  En USP, nitrato y metales pesados no se exigen en agua a granel."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico fisicoquímico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites en rojo provienen de IP/BP y quedan pendientes de confirmación de la monografía aplicable; USP no exige nitrato ni metales pesados en agua a granel."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Monografía adoptada (USP/Ph. Eur./IP/BP); URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-017 — Microorganismos objetables",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la ausencia de microorganismos objetables según el uso del agua."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Investigar los patógenos específicos definidos para el uso del agua<br>\n  2) Registrar el método de identificación y el volumen filtrado<br>\n  3) Documentar la acción ante cualquier positivo<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Estudio de atributo (presencia/ausencia). n = 1 muestra por punto y fase. Proporción de muestras con ausencia con IC 95 % binomial exacto; criterio de cero positivos; identificación del microorganismo y acción documentada si hay positivo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  0 UFC de Pseudomonas aeruginosa, Escherichia coli, Staphylococcus aureus y Burkholderia cepacia en <span class=\"por-confirmar\">100 mL</span> de muestra (o ausencia según el uso del agua)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de objetables"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El volumen en rojo es una referencia y queda pendiente de confirmación contra la USP adoptada y el uso del agua."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; USP &lt;62&gt; (identificación); URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-018 — Cloro residual en pretratamiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el cloro residual en la alimentación protege las membranas de la RO sin exceder el rango del fabricante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el cloro libre residual en la alimentación a la RO (si aplica)<br>\n  2) Registrar la medición con hora, instrumento y analista<br>\n  3) Activar la alarma y la acción si el valor sale del rango<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable continua. n = todas las mediciones de cloro residual en la alimentación a la RO. Media, DE, mínimo, máximo e IC 95 %; comparación con el rango del fabricante; tendencia y conteo de alarmas. Límite de alerta = <span class=\"por-confirmar\">0,1 ppm</span>; límite inferior = <span class=\"por-confirmar\">0,05 ppm</span>."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cloro libre residual en la alimentación a la RO ≤ <span class=\"por-confirmar\">0,1 ppm</span> y ≥ <span class=\"por-confirmar\">0,05 ppm</span> (o el rango del fabricante) en el 100 % de las mediciones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de cloro residual"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El rango en rojo es una referencia y queda pendiente de confirmación contra el manual del fabricante antes de ejecutar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-019 — Velocidad y presión en el loop",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la velocidad y la presión del loop se mantienen en diseño durante todo el período."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar velocidad y presión del loop en continuo<br>\n  2) Registrar cada alarma con hora, punto y causa<br>\n  3) Evaluar el efecto de cada evento fuera de rango<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variables continuas registradas en continuo. n = todos los registros del período. Por día: mínimo, media y máximo de velocidad y presión con IC 95 %; comparación contra el diseño; conteo de alarmas y tiempo fuera de rango. Límite = <span class=\"por-confirmar\">1,5 m/s</span> o el de diseño de la URS."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Velocidad de recirculación ≥ <span class=\"por-confirmar\">1,5 m/s</span> (o el valor de diseño de la URS) en el 100 % de los registros.<br>\n  Presión positiva en el loop y 100 % de las alarmas documentadas y evaluadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico hidráulico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La velocidad en rojo es una referencia y queda pendiente de confirmación contra la URS y el diseño del loop antes de ejecutar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada; manual del fabricante."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-020 — Eficacia de la sanitización en PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la sanitización alcanza todos los puntos y que el resultado microbiológico posterior es conforme."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar temperatura o concentración del sanitizante en todos los puntos<br>\n  2) Registrar la duración y el punto más desfavorable<br>\n  3) Medir el recuento microbiológico posterior<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variables continuas (temperatura °C, tiempo min, concentración ppm) y atributo microbiológico posterior. n = todos los puntos y eventos. Temperatura y tiempo: mínimo, media e IC 95 %; micro: proporción conforme con IC 95 % binomial exacto; comparación pre/post con prueba pareada."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Temperatura ≥ <span class=\"por-confirmar\">80 °C</span> durante ≥ <span class=\"por-confirmar\">60 min</span> en todos los puntos (o concentración de sanitizante <span class=\"por-confirmar\">según fabricante</span>).<br>\n  Recuento microbiológico posterior ≤ <span class=\"por-confirmar\">10 UFC/100 mL</span>."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de eficacia"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Las condiciones y el límite en rojo quedan pendientes de confirmación contra la USP adoptada, el SOP de sanitización y el manual del fabricante antes de ejecutar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; SOP de sanitización; manual del fabricante."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-021 — Respuesta ante excursiones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que toda excursión se aísla, investiga, corrige y remuestrea antes de liberar."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aislar el punto o el sistema ante la excursión<br>\n  2) Investigar, aplicar la acción correctiva y repetir el muestreo<br>\n  3) Registrar el cierre y la autorización de liberación<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Estudio de atributo y de tiempo. n = todas las excursiones del período. Proporción de excursiones aisladas, investigadas y cerradas con IC 95 % binomial exacto; tiempo a cierre en días (mediana, mínimo, máximo); criterio de cero liberaciones con excursión abierta."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100 % de las excursiones aisladas, investigadas y cerradas antes de liberar.<br>\n  0 liberaciones con excursión abierta y remuestreo conforme en el 100 %."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de excursiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.192; URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-022 — Paros y reinicios",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que tras un paro prolongado el sistema vuelve a servicio solo con muestreo conforme."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tras un paro, purgar y reponer el sistema según el SOP<br>\n  2) Muestrear antes de liberar el agua<br>\n  3) Aplicar el criterio de vuelta a servicio y registrar el evento<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Estudio de atributo por evento de paro/reinicio. n = todos los paros &gt; <span class=\"por-confirmar\">72 h</span>. Proporción de reinicios conformes con IC 95 % binomial exacto; comparación pre/post con prueba de McNemar si hay pares; tiempo de reposición en horas."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tras un paro &gt; <span class=\"por-confirmar\">72 h</span>, liberar solo con muestreo conforme: conductividad ≤ <span class=\"por-confirmar\">1,3 µS/cm</span>, TOC ≤ <span class=\"por-confirmar\">500 ppb</span> y micro ≤ <span class=\"por-confirmar\">100 UFC/mL</span> (PW) o ≤ <span class=\"por-confirmar\">10 UFC/100 mL</span> (WFI)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de paros y reinicios"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El plazo y los límites en rojo son referencias y quedan pendientes de confirmación contra la USP adoptada y el SOP de paros antes de ejecutar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1231&gt;; URS aprobada; SOP de paros y reinicios."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AP-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-023 — Retrolavados, regeneraciones y consumibles",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada retrolavado, regeneración o cambio de consumible no degrada la calidad del agua."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar cada retrolavado, regeneración o cambio de consumible<br>\n  2) Medir conductividad, TOC y microbiología antes y después del evento<br>\n  3) Comparar el efecto y documentar cualquier desvío<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Comparación pre/post por evento. n = todos los retrolavados, regeneraciones y cambios de consumibles. Variables: conductividad, TOC y recuento microbiológico antes y después; diferencia de medias con IC 95 %; prueba t pareada o Wilcoxon según normalidad; proporción de eventos conformes con IC 95 % binomial exacto."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Calidad conforme tras cada evento: conductividad ≤ <span class=\"por-confirmar\">1,3 µS/cm</span>, TOC ≤ <span class=\"por-confirmar\">500 ppb</span> y micro ≤ <span class=\"por-confirmar\">100 UFC/mL</span>.<br>\n  100 % de los eventos con muestra post-evento."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de eventos"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites en rojo corresponden a la USP adoptada y quedan pendientes de confirmación por el responsable antes de firmar el protocolo."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; USP &lt;1231&gt;; URS aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "agua-purificada"
   },
   {
    "kind": "resumen",
    "id": "SIS-PQ-AP-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-RES — Tabla resumen de los ensayos del PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del PQ del sistema de agua para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos SIS-PQ-AP-001 a SIS-PQ-AP-023 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 23 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "agua-purificada"
   },
   {
    "kind": "tabla",
    "id": "SIS-PQ-AP-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-PQ-AP-REF — Referencias del PQ del sistema de agua",
    "secciones": [],
    "tabla": {
     "headers": [
      "SECCIÓN",
      "TÍTULO",
      "ESTADO"
     ],
     "rows": [
      [
       "6.1",
       "Manual del fabricante del sistema — Etapas, setpoints y límites de diseño",
       "VIGENTE"
      ],
      [
       "6.2",
       "URS aprobada — Calidad del agua, caudales y criterios de aceptación",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: el PQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "USP 1231 — Agua para uso farmacéutico: validación del sistema y niveles de alerta y acción",
       "VIGENTE"
      ],
      [
       "6.5",
       "ISPE Baseline Guide Vol. 4 — Sistemas de agua y vapor, 3.ª ed.: diseño, operación y ciclo de vida",
       "VIGENTE"
      ],
      [
       "6.6",
       "FDA — Guide to Inspections of High Purity Water Systems: criterios de inspección",
       "VIGENTE"
      ]
     ]
    },
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de operación, curvas y tendencias por etapa</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de calibración de instrumentos en línea y patrones</td></tr>\n<tr><td>8.3</td><td>Anexo C — Registros de sanitizaciones, alarmas y excursiones</td></tr>\n</tbody></table>",
    "familia": "agua-purificada"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO PQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Desempeño de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Desempeño con producción, control de calidad e ingeniería, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar la siguiente fase.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-001 — Conteo dinámico de partículas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el conteo de 0,5 µm y 5 µm con los equipos funcionando y el personal presente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear en los mismos puntos del OQ y en los críticos cercanos a los equipos de mayor generación (tableteadora, granulador, mezclador, llenado)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro del criterio definido para operación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de conteo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis dinámico"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios). ISO 14644-1 (clasificación por partículas); ISO 14644-2 (monitoreo en operación)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-002 — Matriz de muestreo dinámico",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Cubrir varios días y turnos, en cada cuarto clasificado, o justificar matriz de cuartos equivalentes."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear en varios días y turnos cada cuarto clasificado, o aplicar la matriz justificada<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura completa o matriz justificada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cobertura"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-003 — Polvo alto en sólidos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Definir de antemano el criterio y su justificación, con análisis de riesgo, para cuartos con alta generación de polvo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el criterio operativo y su justificación con análisis de riesgo antes de medir<br>\n  2) Medir y comparar<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Criterio previo cumplido y justificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Criterio y riesgo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de polvo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-004 — Monitoreo viable",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar aire activo, sedimentación, contacto y personal."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear aire activo (UFC por m3), placas de sedimentación (UFC por placa y tiempo), contacto en superficies y equipos (UFC por 25 cm2) y personal<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites adoptados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis viable"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-005 — Duración del monitoreo viable",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la duración y frecuencia: varios días consecutivos por cuarto más monitoreo ampliado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar varios días consecutivos en cada cuarto según lo definido<br>\n  2) Continuar con el período ampliado<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Duración cumplida según lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de duración"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-006 — Identificación y tendencia viable",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Identificar los aislamientos por encima de alerta y evaluar la tendencia."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar cada aislamiento sobre el límite de alerta<br>\n  2) Evaluar la tendencia<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Aislamientos identificados con tendencia evaluada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de tendencia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-007 — Límites de alerta y acción",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Partir de la guía adoptada y ajustarlos con los datos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar los límites iniciales de la guía que adoptes<br>\n  2) Ajustarlos con los datos acumulados<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Límites ajustados con datos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Documento de límites con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de límites"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-008 — Registro continuo ambiental",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Registrar presión diferencial, temperatura y humedad en todos los cuartos durante un período representativo, con puertas en uso real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar en continuo durante 2 a 4 semanas (o el período definido) con puertas en uso real<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Registro continuo completo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis continuo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-009 — Excursiones del período",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que no hay excursiones fuera de límites, o que cada una está investigada y cerrada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar los límites en todo el período<br>\n  2) Investigar y cerrar cada excursión<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin excursiones abiertas al cierre."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de excursiones con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de excursiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-010 — Cascada en operación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el efecto de la apertura de puertas, de los equipos de extracción y del movimiento de materiales."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la cascada con puertas en uso, extracción en marcha y movimiento de materiales<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cascada mantenida en operación real."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cascada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-011 — Reto de puertas y esclusas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar aperturas simultáneas, secuencia incorrecta y tiempo de recuperación (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar aperturas simultáneas y secuencia incorrecta (si aplica)<br>\n  2) Medir el tiempo de recuperación<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Recuperación dentro de lo definido en el protocolo aprobado (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de retos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-012 — Equipos de extracción y calor en operación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Operar los equipos de mayor extracción o generación de calor y polvo, midiendo presión y conteo durante la operación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar los equipos definidos con medición de presión del cuarto y conteo<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Presión y conteo dentro de lo definido en el protocolo aprobado en operación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de interacción"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-013 — Humo en operación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar flujo de aire y visualización con humo en operación (si aplica en áreas críticas)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Visualizar con humo en operación (si aplica)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Flujo confirmado en operación (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de humo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-014 — Contención y contaminación cruzada",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar con trazador o marcador que no pasa polvo a cuartos adyacentes (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar trazador o producto marcador (si aplica)<br>\n  2) Verificar ausencia de paso a adyacentes<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin paso a cuartos adyacentes (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de contención"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-015 — Peor caso exterior",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar con las condiciones exteriores más exigentes; si no, definir verificación posterior y riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con mayor temperatura y punto de rocío exteriores si coinciden con el estudio<br>\n  2) Si no, definir la verificación posterior y la evaluación de riesgo<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Carga cubierta o verificación posterior definida."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-016 — Máxima ocupación y actividad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar con todos los equipos funcionando a la vez (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con máxima ocupación y actividad con todos los equipos a la vez (si aplica)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Desempeño dentro de lo definido en el protocolo aprobado (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de ocupación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-017 — Falla de la UMA",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar apagado o falla de la UMA con áreas ocupadas, tiempo de recuperación y reanudación (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Apagar o simular la falla de la UMA con áreas ocupadas (si aplica)<br>\n  2) Medir recuperación y reanudar la producción según criterio<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Recuperación y reanudación según criterio (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de falla"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-018 — Alarmas en operación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que disparan dentro del retardo y el aviso llega al responsable, con personal y producción."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar alarmas en operación y medir el retardo<br>\n  2) Verificar la recepción del aviso<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Disparo en retardo con aviso recibido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de alarmas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-019 — Procedimiento de excursión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar detección, aislamiento del área, evaluación del impacto en el producto, acción correctiva y documentación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Detectar y aislar el área ante la excursión<br>\n  2) Evaluar el impacto, aplicar correctiva y documentar<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Excursión cerrada con impacto evaluado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de excursiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-020 — Revisión de registros",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Revisar partículas, microbiología, presión, temperatura y humedad, alarmas y excursiones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Compilar y revisar todos los registros del PQ<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Revisión completa documentada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Compilado con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de la revisión"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-021 — Monitoreo de rutina al SOP",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Derivar del PQ el programa de monitoreo de rutina y llevarlo al SOP."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el programa de rutina desde los resultados<br>\n  2) Incorporarlo al SOP<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Programa en SOP vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - SOP actualizado con data de respaldo<br>\n  - Data cruda y reporte estadístico de respaldo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-HV-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-022 — Recalificación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la frecuencia de recalificación y los cambios que la disparan."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar la frecuencia habitual (conteo, HEPA, caudales y presiones cada 12 meses en Grado C y D y cada 6 meses en Grado A y B; verifica la guía que adoptes)<br>\n  2) Verificar los disparadores: cambio de HEPA, ductos o cuartos, reparación mayor de la UMA, equipos que alteren la carga<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Frecuencia y disparadores definidos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Programa con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de respaldo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema. EU GMP Anexo 1 (frecuencias, verifica la guía)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "hvac"
   },
   {
    "kind": "resumen",
    "id": "SIS-PQ-HV-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-RES — Tabla resumen de los ensayos del PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del PQ del HVAC para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos SIS-PQ-HV-001 a SIS-PQ-HV-022 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 22 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "hvac"
   },
   {
    "kind": "tabla",
    "id": "SIS-PQ-HV-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-PQ-HV-REF — Referencias del PQ del HVAC",
    "secciones": [],
    "tabla": {
     "headers": [
      "SECCIÓN",
      "TÍTULO",
      "ESTADO"
     ],
     "rows": [
      [
       "6.1",
       "Manual del fabricante del sistema — UMA, filtros y controles",
       "VIGENTE"
      ],
      [
       "6.2",
       "URS aprobada — Caudales, presiones, clases y criterios de aceptación",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: el PQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "ISO 14644-1 — Salas limpias: clasificación por concentración de partículas",
       "VIGENTE"
      ],
      [
       "6.5",
       "EU GMP Anexo 1 — Áreas estériles (solo si aplica al alcance)",
       "VIGENTE"
      ],
      [
       "6.6",
       "OMS TRS 937 Anexo 2 — HVAC: cascada de presiones y diferenciales",
       "VIGENTE"
      ],
      [
       "6.7",
       "ISO 14644-2 — Monitoreo de la limpieza del aire en operación",
       "VIGENTE"
      ]
     ]
    },
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de caudales, presiones y conteos por cuarto</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de calibración de instrumentos y patrones</td></tr>\n<tr><td>8.3</td><td>Anexo C — Reportes de integridad HEPA, humo y excursiones</td></tr>\n</tbody></table>",
    "familia": "hvac"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO PQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Desempeño de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Desempeño con producción, control de calidad e ingeniería, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar la siguiente fase.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-001 — Muestreo intensivo del condensado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Muestrear a diario el condensado en todos los puntos de uso y en la salida del generador."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear a diario cada punto de uso y la salida<br>\n  2) Analizar conductividad, pH, TOC y apariencia<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura diaria completa en la fase intensiva (de 2 a 4 semanas)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros diarios con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis intensivo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-002 — Calidad a demanda normal y máxima",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir sequedad, gases no condensables y sobrecalentamiento en cada autoclave y punto crítico."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir los tres parámetros a demanda normal<br>\n  2) Repetir a demanda máxima<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites en ambas demandas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de calidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (calidad del vapor y del condensado; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-003 — Restricción de uso en fase intensiva",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar que el vapor no se usa para producto sin autorización hasta cerrar esta fase, o con restricción y riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar la restricción definida<br>\n  2) Evaluar el riesgo si hay uso restringido<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin uso no autorizado, o restricción con riesgo evaluado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de respaldo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-004 — Muestreo de demostración",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Muestrear con frecuencia reducida y rotación de puntos, hasta cubrir todos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Reducir la frecuencia y rotar puntos hasta cubrirlos todos<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura total en la fase de demostración (de 2 a 4 semanas)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de demostración"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-005 — Excursiones de demostración",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que no hay excursiones de límite de acción, o que cada una está investigada y cerrada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar los límites de acción en la fase<br>\n  2) Investigar y cerrar cada excursión<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin excursiones abiertas al cierre."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de excursiones con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de excursiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-006 — Tendencia de conductividad y TOC",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la tendencia sin deriva."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Graficar conductividad y TOC<br>\n  2) Verificar ausencia de deriva<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin deriva."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Gráficos con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de tendencia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-007 — Condensado: conductividad, pH, TOC y apariencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar contra los límites de tu norma en todas las fases."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir conductividad, pH, TOC y apariencia (referencia habitual de EN 285 para esterilizadores: conductividad 3 µS por cm como máximo y pH entre 5 y 7; verifica la edición que adoptes)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites adoptados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del condensado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (calidad del vapor y del condensado; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-008 — Endotoxinas del condensado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar 0,25 UE por mL como máximo, el mismo límite del WFI."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir endotoxinas bacterianas del condensado<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro del límite adoptado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de endotoxinas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-009 — Carga microbiana del condensado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar según el uso; el condensado contaminado revela biopelícula o ingreso desde la alimentación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la carga microbiana del condensado según el uso<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro del límite adoptado para el uso."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis microbiano"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-010 — Sequedad del vapor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar 0,95 como mínimo para cargas metálicas y 0,90 para otras (referencia habitual de EN 285)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la sequedad en los puntos definidos<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de la referencia adoptada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de sequedad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (calidad del vapor y del condensado; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-011 — Gases no condensables",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar 3,5 mL por 100 mL de condensado como máximo (referencia habitual de EN 285)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir los gases no condensables<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de la referencia adoptada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de gases"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (calidad del vapor y del condensado; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-012 — Sobrecalentamiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar 25 K como máximo al expandir a presión atmosférica (referencia habitual)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el sobrecalentamiento a presión atmosférica<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de la referencia adoptada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de sobrecalentamiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (calidad del vapor y del condensado; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-013 — Metales y aniones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar hierro, cadmio, plomo, cloruros, fosfatos y silicatos en el análisis completo del condensado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar el análisis completo del condensado<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites adoptados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Análisis completo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis completo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-014 — Demanda máxima real",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Probar con todos los usuarios operando a la vez, con presión estable en el punto más lejano y calidad en especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar todos los usuarios a la vez<br>\n  2) Verificar presión estable en el punto más lejano y calidad en especificación<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Presión estable con calidad conforme (aquí suele aparecer el arrastre de gotas)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de demanda"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-015 — Calidad en el arranque",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que tras un fin de semana o mantenimiento el vapor alcanza la especificación en el tiempo y tras la purga definidos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Arrancar tras el paro y aplicar la purga definida<br>\n  2) Verificar el tiempo hasta la especificación<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Especificación en el tiempo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de arranque"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-016 — Estabilidad en ciclos reales",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar presión y temperatura en los puntos de uso durante ciclos reales de autoclave y SIP."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar presión y temperatura durante ciclos reales<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estables dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-017 — Efecto sobre la carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar sin humedad excesiva en los paquetes y sin manchas ni residuos (si aplica; se verifica con el PQ de cada esterilizador)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar paquetes tras el ciclo (si aplica)<br>\n  2) Verificar ausencia de manchas y residuos<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin humedad excesiva ni residuos (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de carga"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-018 — Alarmas en producción",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que disparan dentro del retardo y el aviso llega al responsable."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar alarmas en producción y medir el retardo<br>\n  2) Verificar la recepción del aviso<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Disparo en retardo con aviso recibido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de alarmas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-019 — Prueba de falla",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar contaminación de la alimentación o falla de un purgador, con tiempo de detección y recuperación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular contaminación de la alimentación o falla de purgador<br>\n  2) Medir detección y recuperación<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Detección y recuperación dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de falla"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-020 — Procedimiento de excursión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar aislamiento del punto, investigación, acción correctiva y repetición del muestreo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aislar el punto ante la excursión<br>\n  2) Investigar, aplicar correctiva y repetir el muestreo<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Excursión cerrada con remuestreo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de excursiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-021 — Programa de purgadores y calibraciones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar purgadores, filtros, válvulas de seguridad y calibraciones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar el programa de verificación definido<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Programa cumplido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de respaldo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-022 — Mantenimiento mayor y consumibles",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el efecto sobre la calidad tras cada evento."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tras cada mantenimiento mayor o cambio de consumibles, medir el efecto<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Calidad conforme tras cada evento."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de eventos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-023 — Revisión de registros",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Revisar calidad, alarmas, excursiones y mantenimiento."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Compilar y revisar todos los registros del PQ<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Revisión completa documentada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Compilado con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de la revisión"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-024 — Monitoreo de rutina al SOP",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Derivar puntos, frecuencia y límites, y llevarlos al SOP."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir puntos, frecuencia y límites desde los resultados<br>\n  2) Incorporarlos al SOP<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  SOP actualizado y vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - SOP con data de respaldo<br>\n  - Data cruda y reporte estadístico de respaldo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-VL-025",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-025 — Requalificación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la frecuencia y los cambios que la disparan."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar la frecuencia definida<br>\n  2) Verificar los disparadores: modificación del lazo, nuevo punto de uso, cambio de fuente de agua, reparación mayor del generador<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Frecuencia y disparadores definidos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Programa con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de respaldo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "vapor-limpio"
   },
   {
    "kind": "resumen",
    "id": "SIS-PQ-VL-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-RES — Tabla resumen de los ensayos del PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del PQ del vapor limpio para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos SIS-PQ-VL-001 a SIS-PQ-VL-025 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 25 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "vapor-limpio"
   },
   {
    "kind": "tabla",
    "id": "SIS-PQ-VL-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-PQ-VL-REF — Referencias del PQ del vapor limpio",
    "secciones": [],
    "tabla": {
     "headers": [
      "SECCIÓN",
      "TÍTULO",
      "ESTADO"
     ],
     "rows": [
      [
       "6.1",
       "Manual del fabricante del sistema — Generador, distribución y trampas",
       "VIGENTE"
      ],
      [
       "6.2",
       "URS aprobada — Presiones, calidad del vapor y criterios de aceptación",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: el PQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "EN 285 — Esterilizadores a vapor: calidad del vapor y del condensado",
       "VIGENTE"
      ],
      [
       "6.5",
       "ISPE Baseline Guide Vol. 4 — Sistemas de agua y vapor, 3.ª ed. (parte de vapor)",
       "VIGENTE"
      ]
     ]
    },
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de presiones, temperaturas y calidad por punto</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de calibración y de válvulas de seguridad</td></tr>\n<tr><td>8.3</td><td>Anexo C — Análisis de condensado, alarmas y excursiones</td></tr>\n</tbody></table>",
    "familia": "vapor-limpio"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO PQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Desempeño de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "aire-comprimido"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "aire-comprimido"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Desempeño con producción, control de calidad e ingeniería, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar la siguiente fase.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "aire-comprimido"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-001 — Muestreo intensivo de Fase 1",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Muestrear punto de rocío continuo y todos los puntos críticos con frecuencia alta."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el rocío continuo en línea<br>\n  2) Muestrear en todos los puntos críticos: partículas, aceite y viables (ISO 8573-7, con muestreador de impacto y flujo definido)<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura total en la Fase 1 (de 2 a 4 semanas)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis intensivo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios). ISO 8573 (aire comprimido: calidad y métodos; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-002 — Restricción de uso en Fase 1",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mantener el aire fuera de puntos críticos sin autorización, o con restricción y riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar la restricción definida<br>\n  2) Evaluar el riesgo si hay uso restringido<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin uso no autorizado, o restricción con riesgo evaluado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de respaldo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-003 — Confirmación de parámetros",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar presión, caudal, regeneración y mantenimiento."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar presión y caudal contra lo definido<br>\n  2) Confirmar ciclos de regeneración y frecuencias de mantenimiento<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Parámetros confirmados con datos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de parámetros"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-004 — Muestreo de demostración",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Muestrear con frecuencia reducida, rotando los puntos hasta cubrir todos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Reducir la frecuencia y rotar puntos hasta cubrirlos todos<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura total en la Fase 2 (de 2 a 4 semanas)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de demostración"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-005 — Excursiones de demostración",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que no hay excursiones de límite de acción, o que cada una está investigada y cerrada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar los límites de acción en la fase<br>\n  2) Investigar y cerrar cada excursión<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin excursiones abiertas al cierre."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de excursiones con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de excursiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-006 — Tendencia de rocío y filtros",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la tendencia de punto de rocío y de caída de filtros sin deriva."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Graficar rocío y caída de filtros<br>\n  2) Verificar ausencia de deriva<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin deriva."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Gráficos con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de tendencia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-007 — Monitoreo de rutina de Fase 3",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar a largo plazo con la frecuencia definida y las cuatro estaciones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear con la frecuencia definida cubriendo las cuatro estaciones<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura estacional completa (hasta 1 año)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de Fase 3"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-008 — Tendencias y alertas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Revisar tendencias y ajustar los límites de alerta con los datos acumulados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar tendencias acumuladas<br>\n  2) Ajustar los límites de alerta con los datos<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Límites ajustados con datos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Documento de límites con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de límites"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-009 — Frecuencias de cambio",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar las frecuencias de cambio de filtros, desecante y drenajes."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar cada frecuencia contra los intervalos<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Frecuencias confirmadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de frecuencias"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-010 — Punto de rocío en línea e independiente",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar en línea y con medición independiente de verificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el rocío en línea<br>\n  2) Verificar con medición independiente<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ambas lecturas dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de rocío"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios); ISO 8573-3 (medición de humedad)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-011 — Partículas sólidas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar por tamaños o por masa."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir por tamaños (ISO 8573-4) o por masa (ISO 8573-8)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites adoptados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de partículas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios). ISO 8573 (aire comprimido: calidad y métodos; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-012 — Aceite total",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar aerosol, líquido y vapor."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir aerosol, líquido y vapor (ISO 8573-2 y 8573-5)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites adoptados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de aceite"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios). ISO 8573 (aire comprimido: calidad y métodos; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-013 — Viables en contacto directo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar en puntos con contacto directo, con identificación de aislamientos sobre alerta."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear viables (ISO 8573-7) en puntos de contacto directo<br>\n  2) Identificar aislamientos sobre el límite de alerta<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites con aislamientos identificados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de viables"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios). ISO 8573 (aire comprimido: calidad y métodos; verifica la edición que adoptes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-014 — Gases",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar CO, CO2, SO2 y NOx (ISO 8573-6)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir los gases<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de los límites adoptados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de gases"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-015 — Agua líquida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar en puntos bajos y tras apagados (ISO 8573-9)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar puntos bajos y tras apagados<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin agua líquida fuera de lo previsto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de agua"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios); ISO 8573-9 (agua líquida)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-016 — Demanda máxima real",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Probar con todos los usuarios a la vez, con presión estable en el punto más lejano y calidad en especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar todos los usuarios a la vez<br>\n  2) Verificar presión estable y calidad en especificación<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Presión estable con calidad conforme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de demanda"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-017 — Peor caso ambiental",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar con temperatura y humedad exteriores más altas; si no, verificación posterior y riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar en el peor caso exterior si coincide con el estudio<br>\n  2) Si no, definir la verificación posterior y la evaluación de riesgo<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Carga cubierta o verificación posterior definida."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-018 — Cambio de compresor o torre",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar calidad y presión durante y después del cambio con carga real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cambiar de compresor o de torre con carga real<br>\n  2) Verificar calidad y presión durante y después<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin pérdida de calidad ni presión en el cambio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cambio"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-019 — Arranque tras paro prolongado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el tiempo hasta que rocío y presión cumplen, con purga previa de líneas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Purgar las líneas tras el paro prolongado<br>\n  2) Medir el tiempo hasta cumplimiento<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cumplimiento en el tiempo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de arranque"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-020 — Falla de secador en PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar detección, aislamiento de los puntos críticos y recuperación, sin aire húmedo en críticos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular la falla del secador<br>\n  2) Verificar detección, aislamiento y recuperación<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ningún punto crítico recibe aire húmedo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de falla"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-021 — Cambio de filtros o desecante",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la calidad tras cada evento y el tiempo antes de volver a servicio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tras el cambio, medir la calidad<br>\n  2) Verificar el tiempo de vuelta a servicio<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Calidad conforme para volver a servicio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cambios"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-022 — Efecto sobre el producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar sin humedad, aceite ni partículas en el producto o la superficie de contacto, en usos con contacto directo (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar producto o superficie en usos de contacto directo como soplado, transporte neumático o llenado (si aplica)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin afectación al producto (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de efecto"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-023 — Alarmas en producción",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que disparan dentro del retardo y el aviso llega al responsable."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar alarmas en producción y medir el retardo<br>\n  2) Verificar la recepción del aviso<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Disparo en retardo con aviso recibido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de alarmas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-024 — Procedimiento de excursión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar aislamiento del punto, evaluación del impacto sobre lotes, acción correctiva y repetición del muestreo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aislar el punto ante la excursión<br>\n  2) Evaluar el impacto sobre lotes, aplicar correctiva y repetir el muestreo<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Excursión cerrada con impacto evaluado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de excursiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-025",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-025 — Programa de drenajes y calibraciones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar drenajes, filtros, desecante, fugas y calibraciones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar el programa definido (cada 6 a 12 meses, por ejemplo) con calibraciones<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Programa cumplido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de respaldo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-026",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-026 — Consumibles y mantenimiento mayor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el efecto sobre la calidad tras cada evento."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tras cada evento, medir el efecto en la calidad<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Calidad conforme tras cada evento."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de eventos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-027",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-027 — Revisión de registros",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Revisar rocío, caída, alarmas, mantenimiento, excursiones y laboratorio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Compilar y revisar todos los registros del PQ<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Revisión completa documentada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Compilado con data cruda y reporte<br>\n  - Data cruda y reporte estadístico de la revisión"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "ensayo",
    "id": "SIS-PQ-AC-028",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-028 — Monitoreo de rutina al SOP",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Derivar puntos, frecuencia y límites, y llevarlos al SOP."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir puntos, frecuencia y límites desde los resultados<br>\n  2) Incorporarlos al SOP<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  SOP actualizado y vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - SOP con data de respaldo<br>\n  - Data cruda y reporte estadístico de respaldo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "aire-comprimido"
   },
   {
    "kind": "resumen",
    "id": "SIS-PQ-AC-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-RES — Tabla resumen de los ensayos del PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del PQ del aire comprimido para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos SIS-PQ-AC-001 a SIS-PQ-AC-028 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 28 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "aire-comprimido"
   },
   {
    "kind": "tabla",
    "id": "SIS-PQ-AC-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "SIS-PQ-AC-REF — Referencias del PQ del aire comprimido",
    "secciones": [],
    "tabla": {
     "headers": [
      "SECCIÓN",
      "TÍTULO",
      "ESTADO"
     ],
     "rows": [
      [
       "6.1",
       "Manual del fabricante del sistema — Compresor, secador y filtros",
       "VIGENTE"
      ],
      [
       "6.2",
       "URS aprobada — Punto de rocío, presiones y clases ISO 8573",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: el PQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "ISO 8573 — Aire comprimido: calidad y métodos de medición",
       "VIGENTE"
      ],
      [
       "6.5",
       "ISO 8573-1 — Clases de pureza del aire comprimido",
       "VIGENTE"
      ]
     ]
    },
    "familia": "aire-comprimido"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de rocío, presiones y calidad por punto</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de calibración de sensores y patrones</td></tr>\n<tr><td>8.3</td><td>Anexo C — Análisis de laboratorio, alarmas y excursiones</td></tr>\n</tbody></table>",
    "familia": "aire-comprimido"
   }
  ]
 }
};
if (typeof module !== "undefined" && module.exports) module.exports = BancoSistemas;
