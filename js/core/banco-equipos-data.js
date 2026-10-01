// Generado por scripts/extraer-banco.mjs equipos — NO EDITAR A MANO.
// Fuente: docs/banco-ensayos/equipos-comun.html (versión: EQ-COMUN 2026-10-01 v2).
var BancoEquipos = {
 "version": "EQ-COMUN 2026-10-01 v2",
 "fases": {
  "DQ": [],
  "IQ": [
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO IQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Instalación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Instalación con las áreas involucradas, asegurando la disponibilidad del personal, el <span class=\"equipo\">equipo</span>, los instrumentos de medición y la documentación necesaria.</li><li>Verificar previamente que los instrumentos de medición utilizados se encuentren identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar las verificaciones del protocolo de acuerdo con los procedimientos y criterios de aceptación aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Identificar y documentar las desviaciones de acuerdo con los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos de evidencia.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos con las áreas involucradas.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final de calificación y autorizar el inicio de la OQ.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos necesarios para la ejecución de las verificaciones.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo IQ, y cubre los ensayos listados en el índice.</p>"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Instalación: conjunto documentado de actividades necesarias para establecer que un instrumento se entrega según su diseño y especificación, y que está correctamente instalado en el entorno seleccionado y es adecuado para él (USP &lt;1058&gt;).</p>"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-001",
    "bloque": 2,
    "cond": "ambas",
    "titulo": "EQ-IQ-001 — Requisitos previos a la Calificación de Instalación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la documentación, la información técnica y las condiciones previas necesarias para ejecutar la Calificación de Instalación del <span class=\"equipo\">equipo</span> se encuentran disponibles, vigentes y aprobadas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Calificación de Diseño (DQ) aprobada, o justificación documentada cuando no aplique (equipo estándar de catálogo)<br>\n  2) Especificación de requisitos de usuario (URS) aprobada<br>\n  3) Clasificación del equipo según USP &lt;1058&gt; (grupo A, B o C) o análisis de riesgo documentado<br>\n  4) Manual de instalación, operación y mantenimiento del fabricante disponible<br>\n  5) Equipo registrado en SAP con su código interno<br>\n  6) Instructivo de operación y limpieza vigente o en borrador aprobado para la calificación<br>\n  7) Personal ejecutor capacitado en el presente protocolo<br>\n  8) Sin desviaciones ni controles de cambio abiertos que impidan iniciar la IQ"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los requisitos previos cumplen o cuentan con justificación documentada de No Aplica.<br>\n  La IQ no se inicia con requisitos en estado No Cumple."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de requisitos previos completada<br>\n  - Referencia del DQ / URS aprobados<br>\n  - Registro de capacitación del personal ejecutor"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Todo requisito No Cumple se registra en el reporte de desviación de la sección de requisitos antes de continuar con la calificación."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-002",
    "bloque": 2,
    "cond": "ambas",
    "titulo": "EQ-IQ-002 — Verificación de los instrumentos de medición a utilizar",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Asegurar que todos los equipos e instrumentos de medición utilizados en la calificación están correctamente identificados y cuentan con calibración vigente, garantizando la confiabilidad y trazabilidad de los resultados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar cada instrumento requerido para las verificaciones de calificación<br>\n  2) Inspeccionar la etiqueta de calibración de cada instrumento y comprobar que su vigencia cubre el periodo de la calificación<br>\n  3) Registrar en la tabla correspondiente los datos de cada instrumento:<br>\n     a) Nombre del instrumento o equipo<br>\n     b) Fabricante y modelo<br>\n     c) Número de serie y código interno<br>\n     d) Fecha de última calibración y fecha de vencimiento<br>\n  4) Recopilar los certificados de calibración para su inclusión en los anexos del informe"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los instrumentos presentan etiqueta de calibración vigente que cubre la fecha de ejecución de la calificación.<br>\n  La información registrada coincide con los certificados de calibración.<br>\n  Los certificados están disponibles y anexados al informe."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de instrumentos de medición completada<br>\n  - Copias de los certificados de calibración"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "tablaModelo": "INSTRUMENTOS DE MEDICIÓN"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-003 — Verificación de recepción y entrega del equipo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el <span class=\"equipo\">equipo</span>, sus accesorios, software, manuales y documentación fueron entregados conforme a la orden de compra y sin daños de transporte."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Comparar lo recibido contra la orden de compra y la lista de empaque del fabricante:<br>\n     a) Equipo principal y número de serie coinciden con la orden de compra<br>\n     b) Accesorios, repuestos y consumibles iniciales completos<br>\n     c) Software, firmware y licencias entregados (si aplica)<br>\n     d) Manuales, certificado de conformidad o FAT y certificados de materiales entregados (si aplica)<br>\n  2) Inspeccionar el embalaje y el equipo en busca de daños de transporte (golpes, humedad, indicadores de impacto o inclinación activados)<br>\n  3) Registrar faltantes o daños y notificarlos al proveedor y a Compras<br>\n  4) Conservar evidencia fotográfica del estado de recepción"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Lo recibido coincide con la orden de compra y la lista de empaque.<br>\n  No existen daños que afecten el funcionamiento o la calidad; los hallazgos están documentados y evaluados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Lista de empaque verificada y firmada<br>\n  - Registro fotográfico de recepción<br>\n  - Reporte de faltantes o daños (si aplica)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-004 — Verificación de identificación del equipo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la identificación del <span class=\"equipo\">equipo</span> está correctamente colocada, es legible y corresponde con la información técnica y documental disponible, garantizando su trazabilidad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Realizar una inspección visual del equipo<br>\n  2) Verificar la presencia y legibilidad de la placa de identificación del fabricante<br>\n  3) Confirmar que la información de la placa coincide con la documentación técnica y con el registro en SAP:<br>\n     a) Nombre del equipo<br>\n     b) Fabricante y marca<br>\n     c) Modelo<br>\n     d) Número de serie<br>\n     e) Código o identificación interna<br>\n  4) Registrar la información obtenida en la tabla correspondiente<br>\n  5) Documentar cualquier discrepancia identificada"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La placa de identificación está instalada, visible y en buen estado.<br>\n  La información de la placa es legible y coincide con la documentación técnica (SAP).<br>\n  El equipo posee una identificación interna única que permite su trazabilidad."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de identificación completada<br>\n  - Fotografía de la placa de identificación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;."
     }
    ],
    "tabla": null,
    "tablaModelo": "IDENTIFICACIÓN DEL EQUIPO"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-005 — Verificación de la ubicación de instalación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar que el <span class=\"equipo\">equipo</span> está instalado en el área física autorizada y que el espacio circundante cumple con los requerimientos de diseño, flujos, mantenimiento y seguridad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Solicitar el plano de distribución de planta (layout) vigente y aprobado del área de instalación<br>\n  2) Inspeccionar visualmente la ubicación del equipo y constatar que corresponde a la sala y posición indicadas en el plano<br>\n  3) Verificar que las distancias perimetrales permiten el acceso a paneles eléctricos, puntos de mantenimiento y remoción de partes<br>\n  4) Confirmar que la ubicación no interfiere con salidas de emergencia, flujos de aire del HVAC ni pasillos de tránsito de personal o materiales<br>\n  5) Registrar el número y la versión del plano utilizado y las observaciones en la tabla correspondiente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El equipo se encuentra en la sala y posición especificadas en el plano vigente.<br>\n  El espacio circundante cumple los espacios mínimos de mantenimiento indicados por el fabricante.<br>\n  No se identifican interferencias físicas ni riesgos de contaminación cruzada por la ubicación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Copia o referencia del plano de distribución vigente<br>\n  - Tabla de ubicación completada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "tablaModelo": "UBICACIÓN DE INSTALACIÓN"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-020 — Verificación de montaje, nivelación, anclaje y conexiones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el <span class=\"equipo\">equipo</span> está montado, nivelado, fijado y conectado según las instrucciones del fabricante, sin fugas ni conexiones provisionales."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la nivelación del equipo con su indicador de nivel o con un nivel de burbuja, según el manual del fabricante<br>\n  2) Verificar la fijación del equipo, según aplique:<br>\n     a) Anclaje al piso o a la estructura<br>\n     b) Mesa antivibratoria o base de pesaje (balanzas, disolutores)<br>\n     c) Ruedas bloqueadas o soportes regulables ajustados<br>\n  3) Verificar las conexiones de utilidades (eléctrica, aire, agua, vapor, gases, vacío, drenaje y extracción): identificadas, sin conexiones provisionales y de acuerdo con el plano o el manual<br>\n  4) Verificar la ausencia de fugas en conexiones hidráulicas, neumáticas, de gases o de fase móvil<br>\n  5) Verificar que el cableado y las mangueras están canalizados, sin tensión mecánica ni riesgo de tropiezo<br>\n  6) Registrar las verificaciones y documentar cualquier ajuste realizado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El equipo está nivelado dentro de la tolerancia del fabricante.<br>\n  El equipo está fijado o asentado según su manual; no hay vibraciones transmitidas que afecten su funcionamiento.<br>\n  Todas las conexiones son definitivas, están identificadas y no presentan fugas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de nivelación y fijación<br>\n  - Registro de verificación de conexiones y fugas<br>\n  - Evidencia fotográfica"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Si el equipo es portátil o no requiere nivelación, fijación ni conexiones, el ensayo se declara No Aplica con justificación."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt; (Montaje e instalación); manual del fabricante."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-006 — Verificación de mantenimiento preventivo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar en SAP la existencia y correcta creación del plan de mantenimiento preventivo del <span class=\"equipo\">equipo</span>, asegurando que se encuentra vigente y alineado con las recomendaciones del fabricante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Consultar en SAP el plan y la orden de mantenimiento asociados al equipo<br>\n  2) Confirmar que el plan de mantenimiento preventivo está creado, aprobado y vigente<br>\n  3) Revisar que los intervalos programados corresponden a las recomendaciones del fabricante y a los requerimientos internos<br>\n  4) Registrar en la tabla correspondiente los datos del último servicio efectuado<br>\n  5) Conservar como evidencia el plan de mantenimiento generado en SAP"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El equipo cuenta con un plan de mantenimiento preventivo vigente en SAP.<br>\n  La información registrada es exacta, completa y corresponde al equipo evaluado.<br>\n  La evidencia del plan de mantenimiento está anexada al informe."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Impresión o reporte del plan de mantenimiento en SAP<br>\n  - Tabla de mantenimiento completada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; EU GMP Capítulo 3."
     }
    ],
    "tabla": null,
    "tablaModelo": "MANTENIMIENTO PREVENTIVO"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-007 — Verificación de la calibración",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar, mediante inspección visual y revisión documental, que la calibración del <span class=\"equipo\">equipo</span> está vigente y es trazable a patrones nacionales o internacionales."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar la etiqueta de calibración del equipo y confirmar que está vigente a la fecha de ejecución<br>\n  2) Revisar que la etiqueta indica código del equipo, fecha de calibración, fecha de vencimiento y responsable<br>\n  3) Registrar en la tabla correspondiente los datos de calibración (código, fechas, orden de calibración)<br>\n  4) Verificar el certificado de calibración: fecha de emisión, trazabilidad metrológica e incertidumbre declarada<br>\n  5) Anexar el certificado de calibración al informe"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La etiqueta de calibración está vigente, legible y adherida al equipo.<br>\n  Los datos registrados coinciden con el certificado de calibración.<br>\n  El certificado es válido, trazable y está anexado al informe."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Copia del certificado de calibración<br>\n  - Tabla de calibración completada"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Si el equipo no posee elementos de medición sujetos a calibración, el ensayo se declara No Aplica con justificación."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; ISO/IEC 17025."
     }
    ],
    "tabla": null,
    "tablaModelo": "VERIFICACIÓN DE LA CALIBRACIÓN"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-008 — Verificación de componentes principales",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los componentes principales del <span class=\"equipo\">equipo</span> están presentes y correctamente instalados, de acuerdo con las especificaciones del fabricante y la documentación técnica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Consultar el manual del equipo, el listado oficial de piezas o la documentación técnica del fabricante<br>\n  2) Identificar los componentes principales, piezas y accesorios críticos del equipo<br>\n  3) Confirmar por inspección visual y documental la instalación, fijación y ubicación de cada componente<br>\n  4) Verificar que no existen daños físicos, partes faltantes ni desviaciones respecto al diseño original<br>\n  5) En equipos con sistema de refrigeración, verificar en la placa el tipo y la carga de refrigerante, y que el condensador y el compresor tienen ventilación libre<br>\n  6) Registrar el estatus de cada componente (C/NC) en el listado de componentes"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los componentes principales están presentes, instalados y en condiciones adecuadas.<br>\n  No existen piezas faltantes, daños visibles ni desviaciones respecto a la documentación técnica."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de componentes principales verificado (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  El listado de componentes se incluye como anexo para dar flexibilidad al número de componentes de cada equipo."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-009 — Verificación de utilidades y condiciones ambientales",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las utilidades requeridas para el funcionamiento del <span class=\"equipo\">equipo</span> y las condiciones ambientales del área de instalación cumplen con las especificaciones del fabricante y los requerimientos del proceso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar, con base en la información del fabricante y la URS, las utilidades y condiciones ambientales que aplican al equipo<br>\n  2) Medir y registrar en la tabla correspondiente las que apliquen, entre ellas:<br>\n     a) Alimentación eléctrica: voltaje, frecuencia, fases y puesta a tierra<br>\n     b) Aire comprimido: presión, caudal y calidad<br>\n     c) Vapor, agua purificada o agua helada: presión, temperatura y caudal<br>\n     d) Vacío y gases de proceso<br>\n     e) Temperatura y humedad relativa ambiental<br>\n     f) Diferenciales de presión y clasificación del área<br>\n     g) Iluminación y nivel de ruido<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar el reporte generado<br>\n  4) Declarar No Aplica, con justificación, las utilidades que el equipo no requiere"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las utilidades y condiciones ambientales aplicables están disponibles y cumplen las especificaciones del fabricante y del proceso.<br>\n  Cada tabla se evalúa con sus propios límites."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tablas de utilidades y condiciones ambientales completadas<br>\n  - Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Los niveles de iluminación y ruido fuera de especificación se tratan como desviación menor y se notifican al departamento de Seguridad Industrial."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; ISPE Baseline Guide Vol. 5."
     }
    ],
    "tabla": null,
    "tablaModelo": "UTILIDADES"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-021 — Verificación de recipientes a presión y dispositivos de alivio (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los recipientes a presión del <span class=\"equipo\">equipo</span> y sus dispositivos de alivio están certificados, identificados y son adecuados para las condiciones de operación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar los recipientes, cámaras o camisas sometidos a presión o vacío<br>\n  2) Verificar la placa o estampado del recipiente: fabricante, número de serie, código de diseño, presión y temperatura de diseño<br>\n  3) Verificar el certificado de diseño y de prueba hidrostática del recipiente<br>\n  4) Verificar los dispositivos de alivio instalados:<br>\n     a) Válvulas de seguridad: presión de tarado, certificado de tarado vigente y precinto<br>\n     b) Discos de ruptura: presión de rotura y certificado<br>\n     c) Paneles de venteo o supresión de explosión, cuando el equipo maneja polvos o solventes<br>\n  5) Confirmar que la presión de tarado es menor o igual a la presión máxima de trabajo del recipiente y mayor que la presión de operación<br>\n  6) Verificar que la descarga de los dispositivos de alivio está dirigida a una zona segura"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los recipientes a presión cuentan con placa legible y certificado de diseño y prueba.<br>\n  Los dispositivos de alivio están instalados, identificados, con certificado de tarado vigente y presión de tarado coherente con el diseño.<br>\n  La descarga de los dispositivos de alivio no representa riesgo para el personal ni para el producto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Certificado de diseño y prueba hidrostática del recipiente<br>\n  - Certificados de tarado de válvulas de seguridad o discos de ruptura<br>\n  - Registro fotográfico de placas"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Aplica a autoclaves, liofilizadores, reactores, lechos fluidos, secadores con vapor o vacío y equipos similares; en los demás casos se declara No Aplica."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPVC Sección VIII; normativa nacional de recipientes a presión; manual del fabricante."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-022 — Verificación de filtros HEPA y filtros de proceso instalados (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los filtros HEPA y los filtros de proceso del <span class=\"equipo\">equipo</span> corresponden a la especificación, están certificados por el fabricante y correctamente instalados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar los filtros del equipo (suministro, extracción, venteo o aire de proceso)<br>\n  2) Registrar para cada filtro:<br>\n     a) Fabricante, modelo y número de serie<br>\n     b) Clase de filtración (por ejemplo, H13 o H14 según EN 1822) o grado de retención<br>\n     c) Dimensiones y posición de instalación<br>\n  3) Verificar el certificado de prueba de fábrica de cada filtro<br>\n  4) Verificar visualmente que el filtro, el marco y las juntas no presentan daños y que el filtro está instalado en la orientación correcta<br>\n  5) Verificar que el filtro de venteo de cámaras estériles (autoclave, liofilizador) es hidrofóbico y de grado esterilizante, cuando aplique"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los filtros instalados coinciden con la especificación del fabricante y de la URS.<br>\n  Cada filtro cuenta con certificado de prueba de fábrica trazable a su número de serie.<br>\n  Los filtros, marcos y juntas no presentan daños y están instalados en la orientación correcta."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de filtros instalados<br>\n  - Certificados de fábrica de los filtros"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  La prueba de integridad de los filtros (DOP/PAO) y el conteo de partículas se ejecutan en la OQ."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ISO 14644-3; EN 1822; EU GMP Anexo 1."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-010 — Verificación de software, firmware, red y almacenamiento de datos (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el software y firmware del <span class=\"equipo\">equipo</span> están instalados en la versión especificada, y que su configuración de seguridad, red y almacenamiento de datos garantiza la integridad de los datos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el nombre y la versión del software y del firmware instalados, y compararlos con la versión especificada por el fabricante o la URS<br>\n  2) Verificar la configuración de acceso:<br>\n     a) Usuarios individuales con contraseña, sin cuentas genéricas compartidas<br>\n     b) Perfiles y privilegios asignados según el rol<br>\n  3) Verificar que la pista de auditoría (audit trail) está habilitada y no puede ser desactivada por usuarios operativos<br>\n  4) Verificar la sincronización de fecha y hora del sistema<br>\n  5) Verificar la conexión a red y la ruta de almacenamiento de datos, cuando aplique<br>\n  6) Verificar que existe procedimiento de respaldo y restauración de datos<br>\n  7) Verificar la clasificación GAMP del software y su evaluación de 21 CFR Part 11"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las versiones instaladas coinciden con las especificadas.<br>\n  El acceso es individual y por perfiles; la pista de auditoría está activa.<br>\n  Fecha y hora del sistema correctas; respaldo de datos definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Captura de pantalla de versiones de software y firmware<br>\n  - Listado de usuarios y perfiles configurados<br>\n  - Evidencia de pista de auditoría activa"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Si el equipo no tiene software ni firmware configurable (USP &lt;1058&gt; grupo A), el ensayo se declara No Aplica."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; GAMP 5; 21 CFR Part 11; EU GMP Anexo 11."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-011 — Verificación de instalación: encendido y diagnóstico inicial",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el <span class=\"equipo\">equipo</span> enciende correctamente y supera las pruebas de diagnóstico inicial del fabricante tras su instalación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que las utilidades del equipo fueron verificadas y están conectadas<br>\n  2) Encender el equipo según el manual del fabricante<br>\n  3) Ejecutar las pruebas de autodiagnóstico o de arranque disponibles<br>\n  4) Verificar que no se presentan alarmas, mensajes de error ni ruidos o vibraciones anormales<br>\n  5) Registrar el resultado y anexar el reporte de diagnóstico, cuando el equipo lo genere"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El equipo enciende y completa el diagnóstico inicial sin errores ni alarmas.<br>\n  El reporte de diagnóstico, cuando aplique, está anexado al informe."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Reporte de autodiagnóstico o registro de arranque"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-012 — Verificación de rugosidad en superficies en contacto con el producto (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las superficies del <span class=\"equipo\">equipo</span> en contacto directo con el producto cumplen con la rugosidad superficial especificada, garantizando su limpiabilidad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar las superficies en contacto directo con el producto que requieren verificación<br>\n  2) Confirmar que las superficies están limpias, secas y libres de residuos<br>\n  3) Verificar que el rugosímetro cuenta con certificado de calibración vigente<br>\n  4) Medir la rugosidad (Ra) en los puntos definidos, según el instructivo vigente (IT-VAL-0014)<br>\n  5) Registrar el valor de cada punto en la tabla correspondiente<br>\n  6) Realizar el reporte estadístico de los datos y anexar los gráficos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las superficies en contacto con el producto cumplen la rugosidad especificada por diseño o por el fabricante.<br>\n  Sin especificación del fabricante: Ra ≤ 0,8 µm.<br>\n  No se observan poros, fisuras, rayaduras profundas ni rebabas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de rugosidad completada<br>\n  - Reporte estadístico y gráficos"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Aplica solo a equipos con superficies en contacto con el producto; en los demás casos se declara No Aplica."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE; EU GMP Capítulo 3."
     }
    ],
    "tabla": null,
    "tablaModelo": "RUGOSIDAD"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-013 — Verificación preliminar del tipo de acero inoxidable mediante imán (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar de forma cualitativa que las superficies en contacto con el producto presentan un comportamiento magnético compatible con acero inoxidable austenítico (AISI 316L)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar las superficies del equipo en contacto directo con el producto<br>\n  2) Acercar un imán permanente de intensidad conocida (preferiblemente de neodimio) a cada superficie, evitando golpes o rayaduras<br>\n  3) Registrar el comportamiento del material frente al imán<br>\n  4) Comparar el resultado con los certificados de materiales (MTC) del fabricante"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las superficies de acero inoxidable AISI 316L no presentan atracción magnética significativa, o solo una atracción débil atribuible a zonas trabajadas en frío o soldaduras.<br>\n  Toda atracción fuerte se investiga contra los MTC o mediante identificación positiva del material (PMI)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la verificación con imán<br>\n  - Certificados de materiales (MTC)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Es una verificación preliminar; no sustituye los certificados de materiales."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-023 — Verificación de materiales no metálicos y lubricantes en contacto con el producto (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los materiales no metálicos en contacto con el producto y los lubricantes que puedan entrar en contacto con él son aptos para uso farmacéutico."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar los componentes no metálicos en contacto con el producto (juntas, sellos, empaques, mangueras, membranas, plásticos)<br>\n  2) Verificar para cada material el certificado de conformidad del fabricante, según aplique:<br>\n     a) FDA 21 CFR 177 (materiales en contacto con alimentos)<br>\n     b) USP &lt;88&gt; Clase VI y/o USP &lt;87&gt; (citotoxicidad)<br>\n     c) Libre de origen animal (TSE/BSE), cuando aplique<br>\n  3) Identificar los lubricantes usados en zonas con riesgo de contacto con el producto<br>\n  4) Verificar que los lubricantes son de grado alimenticio NSF H1 y registrar marca, referencia y ficha técnica<br>\n  5) Registrar los materiales y lubricantes verificados en el listado correspondiente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los materiales no metálicos en contacto con el producto cuentan con certificado de conformidad.<br>\n  Los lubricantes con riesgo de contacto con el producto son grado NSF H1.<br>\n  El listado de materiales y lubricantes está completo y trazable a sus certificados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de materiales no metálicos y lubricantes<br>\n  - Certificados de conformidad y fichas técnicas"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Complementa EQ-IQ-013 (acero inoxidable). Aplica solo a equipos con contacto con el producto; en los demás casos se declara No Aplica."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Capítulo 3 (3.39); FDA 21 CFR 177; USP &lt;88&gt;; NSF H1."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-014 — Verificación de seguridad industrial",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el <span class=\"equipo\">equipo</span> cumple con los lineamientos de seguridad industrial del fabricante y de Laboratorios Sued, S.R.L."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar el equipo y el área de instalación para confirmar los elementos de seguridad indicados en la tabla correspondiente<br>\n  2) Verificar las protecciones eléctricas: puesta a tierra, fusibles, breakers y parada de emergencia<br>\n  3) Confirmar las señalizaciones de advertencia, etiquetas de seguridad y accesos libres a dispositivos de emergencia<br>\n  4) Revisar la disponibilidad de instructivos de operación segura, limpieza y mantenimiento<br>\n  5) Confirmar que los operadores asignados están entrenados en el uso seguro del equipo<br>\n  6) Registrar los resultados y adjuntar evidencia fotográfica o documental"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las medidas de seguridad física y operativa están implementadas y funcionales.<br>\n  Las señalizaciones son visibles, legibles y están en los puntos requeridos.<br>\n  Los instructivos y registros de capacitación están disponibles y vigentes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de seguridad industrial completada<br>\n  - Evidencia fotográfica"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Políticas de Seguridad Industrial de Laboratorios Sued, S.R.L.; manual del fabricante."
     }
    ],
    "tabla": null,
    "tablaModelo": "SEGURIDAD INDUSTRIAL"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-015 — Disponibilidad de documentos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la documentación técnica, administrativa y de soporte del <span class=\"equipo\">equipo</span> está disponible, vigente y aprobada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar la documentación aplicable al equipo, incluyendo:<br>\n     a) Manual de instalación, operación y mantenimiento (IOM)<br>\n     b) Plan de mantenimiento preventivo y correctivo<br>\n     c) Protocolos e informes de calificación previos<br>\n     d) Instructivo de operación y limpieza<br>\n     e) Bitácora de uso y limpieza<br>\n  2) Revisar que cada documento está vigente, firmado y controlado en el sistema de gestión documental<br>\n  3) Registrar título, código, revisión y fecha de cada documento en la tabla correspondiente<br>\n  4) Anexar copias o referencias digitales de los documentos relevantes"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los documentos requeridos están disponibles, vigentes y aprobados.<br>\n  La información registrada es correcta, completa y trazable."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de documentos completada<br>\n  - Referencias digitales o copias anexadas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Capítulo 4."
     }
    ],
    "tabla": null,
    "tablaModelo": "DISPONIBILIDAD DE DOCUMENTOS"
   },
   {
    "kind": "resumen",
    "id": "EQ-IQ-016",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-IQ-016 — Tabla resumen de los ensayos del IQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar en una matriz el resultado de todos los ensayos IQ como acta de cierre de la fase."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar los ensayos del protocolo (<span class=\"lista-resumen\" data-fase-lista=\"IQ\"></span>) con su veredicto (C/NC/NA) y fecha de ejecución<br>\n  2) Justificar cada ensayo declarado No Aplica<br>\n  3) Listar desviaciones abiertas con su estado y plan de cierre<br>\n  4) Firmar el acta de cierre IQ"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  100% de ensayos IQ ejecutados o justificados como No Aplica; cero desviaciones críticas abiertas; acta firmada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz resumen IQ firmada<br>\n  - Acta de cierre de fase IQ"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Sin la matriz resumen firmada no se autoriza el inicio de la OQ."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "tabla",
    "id": "EQ-IQ-017",
    "bloque": 5,
    "cond": "ambas",
    "titulo": "EQ-IQ-017 — Firmas del personal involucrado en la ejecución",
    "secciones": [],
    "tabla": {
     "headers": [
      "Nombre",
      "Área",
      "Firma",
      "Fecha"
     ],
     "rows": [
      [
       "________________________",
       "________________________",
       "________________________",
       "________________________"
      ],
      [
       "________________________",
       "________________________",
       "________________________",
       "________________________"
      ],
      [
       "________________________",
       "________________________",
       "________________________",
       "________________________"
      ],
      [
       "________________________",
       "________________________",
       "________________________",
       "________________________"
      ],
      [
       "________________________",
       "________________________",
       "________________________",
       "________________________"
      ],
      [
       "________________________",
       "________________________",
       "________________________",
       "________________________"
      ],
      [
       "________________________",
       "________________________",
       "________________________",
       "________________________"
      ],
      [
       "________________________",
       "________________________",
       "________________________",
       "________________________"
      ]
     ]
    }
   },
   {
    "kind": "tabla",
    "id": "EQ-IQ-018",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-IQ-018 — Referencias",
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
       "USP <1058> Analytical Instrument Qualification",
       "USP vigente"
      ],
      [
       "2",
       "EU GMP Anexo 15 — Calificación y validación",
       "2015"
      ],
      [
       "3",
       "EU GMP Anexo 11 — Sistemas informatizados",
       "2011"
      ],
      [
       "4",
       "ISPE GAMP 5 — A Risk-Based Approach to Compliant GxP Computerized Systems",
       "2.ª edición, 2022"
      ],
      [
       "5",
       "21 CFR Part 11 — Electronic Records; Electronic Signatures",
       "Vigente"
      ],
      [
       "6",
       "ISPE Baseline Guide Vol. 5 — Commissioning and Qualification",
       "2.ª edición, 2019"
      ],
      [
       "7",
       "ASME BPE — Bioprocessing Equipment",
       "Edición vigente"
      ],
      [
       "8",
       "ASME BPVC Sección VIII — Recipientes a presión",
       "Edición vigente"
      ],
      [
       "9",
       "ISO 14644-3 / EN 1822 — Salas limpias y filtros de alta eficiencia",
       "Edición vigente"
      ],
      [
       "10",
       "FDA 21 CFR 177 / USP <88> — Materiales poliméricos en contacto",
       "Vigente"
      ],
      [
       "11",
       "______",
       "______"
      ]
     ]
    }
   },
   {
    "kind": "tabla",
    "id": "EQ-IQ-019",
    "bloque": 7,
    "cond": "ambas",
    "titulo": "EQ-IQ-019 — Historial de cambios",
    "secciones": [],
    "tabla": {
     "headers": [
      "Versión",
      "Fecha",
      "Código",
      "Descripción del cambio"
     ],
     "rows": [
      [
       "01",
       "______",
       "______",
       "Creación del documento"
      ]
     ]
    }
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS</strong></p>\n<ul>\n  <li>Anexo A — Certificados de calibración de los instrumentos utilizados</li>\n  <li>Anexo B — Lista de empaque y registro fotográfico de recepción</li>\n  <li>Anexo C — Listado de componentes principales verificados</li>\n  <li>Anexo D — Data cruda y reporte estadístico de utilidades</li>\n  <li>Anexo E — Evidencias de software, firmware y diagnóstico inicial</li>\n  <li>Anexo F — Certificados de recipientes a presión, dispositivos de alivio y filtros</li>\n  <li>Anexo G — Certificados de materiales en contacto y fichas de lubricantes</li>\n</ul>"
   }
  ],
  "OQ": [],
  "PQ": []
 }
};
if (typeof module !== "undefined" && module.exports) module.exports = BancoEquipos;
