// Generado por scripts/extraer-banco.mjs equipos — NO EDITAR A MANO.
// Fuente: docs/banco-ensayos/equipos-comun.html + docs/banco-ensayos/equipos/oq-comun.html + docs/banco-ensayos/equipos/pq-comun.html + docs/banco-ensayos/equipos/iq-autoclave.html + docs/banco-ensayos/equipos/iq-tunel-despirogenizacion.html + docs/banco-ensayos/equipos/iq-liofilizador.html + docs/banco-ensayos/equipos/iq-reactor.html + docs/banco-ensayos/equipos/iq-horno-vacio.html + docs/banco-ensayos/equipos/iq-llenadora.html + docs/banco-ensayos/equipos/iq-lecho-fluido.html + docs/banco-ensayos/equipos/iq-tableteadora.html + docs/banco-ensayos/equipos/iq-encapsuladora.html + docs/banco-ensayos/equipos/iq-granulador.html + docs/banco-ensayos/equipos/oq-reactor.html + docs/banco-ensayos/equipos/pq-reactor.html + docs/banco-ensayos/equipos/oq-tableteadora.html + docs/banco-ensayos/equipos/pq-tableteadora.html + docs/banco-ensayos/equipos/oq-encapsuladora.html + docs/banco-ensayos/equipos/pq-encapsuladora.html + docs/banco-ensayos/equipos/oq-granulador.html + docs/banco-ensayos/equipos/pq-granulador.html + docs/banco-ensayos/equipos/oq-recubridora.html + docs/banco-ensayos/equipos/pq-recubridora.html + docs/banco-ensayos/equipos/oq-lecho-fluido.html + docs/banco-ensayos/equipos/oq-autoclave.html + docs/banco-ensayos/equipos/oq-mezclador.html + docs/banco-ensayos/equipos/oq-horno.html + docs/banco-ensayos/equipos/pq-lecho-fluido.html + docs/banco-ensayos/equipos/pq-autoclave.html + docs/banco-ensayos/equipos/pq-mezclador.html + docs/banco-ensayos/equipos/pq-horno.html + docs/banco-ensayos/equipos/pq-horno-vacio.html + docs/banco-ensayos/equipos/oq-horno-vacio.html (versión: EQ-COMUN 2026-10-01 v2 + EQ-OQ-COM 2026-10-03 v1 + EQ-PQ-COM 2026-10-03 v1 + EQ-IQ-AU 2026-10-07 v1 + EQ-IQ-TD 2026-10-07 v1 + EQ-IQ-LI 2026-10-07 v1 + EQ-IQ-RC 2026-10-07 v1 + EQ-IQ-VA 2026-10-07 v1 + EQ-IQ-LL 2026-10-07 v1 + EQ-IQ-LF 2026-10-07 v1 + EQ-IQ-TB 2026-10-08 v1 + EQ-IQ-EN 2026-10-08 v1 + EQ-IQ-GR 2026-10-08 v1 + EQ-OQ-RC 2026-10-07 v1 + EQ-PQ-RC 2026-10-07 v1 + EQ-OQ-TB 2026-10-08 v1 + EQ-PQ-TB 2026-10-08 v1 + EQ-OQ-EN 2026-10-08 v1 + EQ-PQ-EN 2026-10-08 v1 + EQ-OQ-GR 2026-10-08 v1 + EQ-PQ-GR 2026-10-08 v1 + EQ-OQ-RB 2026-10-09 v1 + EQ-PQ-RB 2026-10-09 v1 + EQ-OQ-LF 2026-10-05 v2 + EQ-OQ-AU 2026-10-05 v2 + EQ-OQ-MZ 2026-10-05 v2 + EQ-OQ-HO 2026-10-06 v1 + EQ-PQ-LF 2026-10-05 v2 + EQ-PQ-AU 2026-10-05 v2 + EQ-PQ-MZ 2026-10-05 v2 + EQ-PQ-HO 2026-10-06 v1 + EQ-PQ-VA 2026-10-06 v1 + EQ-OQ-VA 2026-10-06 v1).
var BancoEquipos = {
 "version": "EQ-COMUN 2026-10-01 v2 + EQ-OQ-COM 2026-10-03 v1 + EQ-PQ-COM 2026-10-03 v1 + EQ-IQ-AU 2026-10-07 v1 + EQ-IQ-TD 2026-10-07 v1 + EQ-IQ-LI 2026-10-07 v1 + EQ-IQ-RC 2026-10-07 v1 + EQ-IQ-VA 2026-10-07 v1 + EQ-IQ-LL 2026-10-07 v1 + EQ-IQ-LF 2026-10-07 v1 + EQ-IQ-TB 2026-10-08 v1 + EQ-IQ-EN 2026-10-08 v1 + EQ-IQ-GR 2026-10-08 v1 + EQ-OQ-RC 2026-10-07 v1 + EQ-PQ-RC 2026-10-07 v1 + EQ-OQ-TB 2026-10-08 v1 + EQ-PQ-TB 2026-10-08 v1 + EQ-OQ-EN 2026-10-08 v1 + EQ-PQ-EN 2026-10-08 v1 + EQ-OQ-GR 2026-10-08 v1 + EQ-PQ-GR 2026-10-08 v1 + EQ-OQ-RB 2026-10-09 v1 + EQ-PQ-RB 2026-10-09 v1 + EQ-OQ-LF 2026-10-05 v2 + EQ-OQ-AU 2026-10-05 v2 + EQ-OQ-MZ 2026-10-05 v2 + EQ-OQ-HO 2026-10-06 v1 + EQ-PQ-LF 2026-10-05 v2 + EQ-PQ-AU 2026-10-05 v2 + EQ-PQ-MZ 2026-10-05 v2 + EQ-PQ-HO 2026-10-06 v1 + EQ-PQ-VA 2026-10-06 v1 + EQ-OQ-VA 2026-10-06 v1",
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar, con base en la información del fabricante y la URS, las utilidades y condiciones ambientales que aplican al equipo<br>\n  2) Medir y registrar en la tabla correspondiente las que apliquen, entre ellas:<br>\n     a) Alimentación eléctrica: voltaje, frecuencia, fases y puesta a tierra<br>\n     b) Aire comprimido: presión, caudal y calidad<br>\n     c) Vapor, agua purificada o agua helada: presión, temperatura y caudal<br>\n     d) Vacío y gases de proceso<br>\n     e) Temperatura y humedad relativa ambiental<br>\n     f) Diferenciales de presión y clasificación del área<br>\n     g) Iluminación y nivel de ruido<br>\n  3) Procesar los datos crudos de utilidades y condiciones ambientales en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  4) Declarar No Aplica, con justificación, las utilidades que el equipo no requiere"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las utilidades y condiciones ambientales aplicables están disponibles y cumplen las especificaciones del fabricante y del proceso.<br>\n  Cada tabla se evalúa con sus propios límites."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tablas de utilidades y condiciones ambientales completadas<br>\n  - Data cruda y reporte estadístico del análisis de utilidades y condiciones ambientales"
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
    "tablaModelo": "UTILIDADES",
    "analisis": "si"
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar las superficies en contacto directo con el producto que requieren verificación<br>\n  2) Confirmar que las superficies están limpias, secas y libres de residuos<br>\n  3) Verificar que el rugosímetro cuenta con certificado de calibración vigente<br>\n  4) Medir la rugosidad (Ra) en los puntos definidos, según el instructivo vigente (IT-VAL-0014)<br>\n  5) Registrar el valor de cada punto en la tabla correspondiente<br>\n  6) Procesar los datos crudos de rugosidad (Ra) en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las superficies en contacto con el producto cumplen la rugosidad especificada por diseño o por el fabricante.<br>\n  Sin especificación del fabricante: Ra ≤ 0,8 µm.<br>\n  No se observan poros, fisuras, rayaduras profundas ni rebabas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de rugosidad completada<br>\n  - Data cruda y reporte estadístico del análisis de rugosidad (Ra)"
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
    "tablaModelo": "RUGOSIDAD",
    "analisis": "si"
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
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-AU-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-AU-001 — Verificación del P&I y del diagrama de flujo contra lo instalado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el diagrama de tuberías e instrumentación (P&amp;I) y el diagrama de flujo del autoclave corresponden con la instalación física real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Obtener la revisión vigente del P&amp;I y del diagrama de flujo aprobados<br>\n  2) Recorrer la instalación identificando cámara, camisa, generador de vapor (si aplica), trampas, válvulas, instrumentos y drenajes<br>\n  3) Confirmar tag, diámetro, material y pendiente de cada línea contra el P&amp;I<br>\n  4) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El P&amp;I y el diagrama de flujo corresponden con lo instalado en su revisión vigente.<br>\n  No existen líneas, válvulas ni instrumentos sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - P&amp;I y diagrama de flujo verificados y firmados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ISPE Baseline Guide: Sterile Product Manufacturing Facilities."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-AU-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-AU-002 — Verificación de conexiones de utilidades del autoclave",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las utilidades del autoclave están conectadas según especificación: vapor, agua, drenaje, energía eléctrica y aire de instrumentos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la acometida de vapor: presión de suministro, reductor, filtro y trampa en la línea de alimentación<br>\n  2) Verificar la acometida de agua de alimentación y enfriamiento con sus válvulas de corte<br>\n  3) Verificar el drenaje con trampa y pendiente hacia el punto de descarga, sin sifones indebidos<br>\n  4) Verificar la acometida eléctrica: voltaje, fases, calibre de conductores y protección termomagnética<br>\n  5) Verificar el aire de instrumentos para válvulas neumáticas: presión, filtro y regulador<br>\n  6) Registrar los parámetros de cada utilidad en la tabla de utilidades"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las utilidades están conectadas y sus parámetros están dentro de lo especificado por el fabricante.<br>\n  Cada utilidad cuenta con su elemento de corte y medición accesible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de utilidades verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del autoclave."
     }
    ],
    "tabla": null,
    "tablaModelo": "UTILIDADES AUTOCLAVE",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-AU-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-AU-003 — Verificación de cámara, puerta y empaque del autoclave",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la cámara, la puerta y su empaque cumplen el material, los acabados y el mecanismo de cierre especificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el material de la cámara y de la puerta contra el certificado del fabricante<br>\n  2) Inspeccionar visualmente los acabados internos: ausencia de picaduras, grietas y zonas de corrosión<br>\n  3) Verificar el empaque de la puerta: material, asentamiento uniforme y ausencia de daños<br>\n  4) Verificar el mecanismo de cierre y su enclavamiento: la puerta no abre con cámara presurizada<br>\n  5) Verificar rieles o carros de carga instalados y nivelados"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cámara, puerta y empaque corresponden a lo especificado y están en condiciones adecuadas.<br>\n  El enclavamiento de puerta opera correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico de cámara, puerta y empaque (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (esterilizadores a vapor de gran capacidad)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-AU-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-AU-004 — Verificación del recipiente a presión y sus dispositivos de alivio",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el autoclave como recipiente a presión cuenta con placa de datos, memoria de cálculo y dispositivos de alivio calibrados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la placa de datos del recipiente: presión y temperatura de diseño, año y número de serie<br>\n  2) Verificar la memoria de cálculo y el certificado de fabricación del recipiente<br>\n  3) Verificar la válvula de seguridad: capacidad, presión de ajuste y certificado de calibración vigente<br>\n  4) Verificar el manómetro de cámara: rango, certificado de calibración vigente e identificación<br>\n  5) Confirmar que la descarga de la válvula de seguridad está conducida a zona segura"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El recipiente cuenta con placa, memoria de cálculo y dispositivos de alivio calibrados y vigentes.<br>\n  La presión de ajuste de la válvula de seguridad no supera la presión máxima admisible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Copia de placa, memoria de cálculo y certificados de calibración (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPVC Sección VIII (recipientes a presión)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-AU-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-AU-005 — Verificación de componentes críticos del autoclave",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los componentes críticos del autoclave están instalados, identificados y con su documentación de soporte."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar trampas de vapor de cámara y camisa: tipo, tamaño y sentido de flujo<br>\n  2) Verificar válvulas de control y solenoides: tag, posición y conexión al PLC<br>\n  3) Verificar sensores de temperatura y presión de control y monitoreo, con calibración vigente<br>\n  4) Verificar el sistema de vacío (si aplica): bomba, conexiones y válvula antirretorno<br>\n  5) Verificar filtros de venteo y de aire de ruptura de vacío (si aplican): grado y certificado<br>\n  6) Registrar cada componente con su estatus en la tabla de componentes críticos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los componentes críticos están instalados, identificados y documentados.<br>\n  Los instrumentos de control y monitoreo cuentan con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de componentes críticos verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1229&gt; (esterilización por vapor)."
     }
    ],
    "tabla": null,
    "tablaModelo": "COMPONENTES CRÍTICOS AUTOCLAVE",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-AU-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-AU-006 — Verificación del sistema de control, alarmas y enclavamientos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el PLC del autoclave, sus programas, alarmas y enclavamientos corresponden a lo especificado y están operativos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar modelo y versión de firmware del PLC y de la pantalla de operación<br>\n  2) Verificar los programas de esterilización cargados contra la lista aprobada (nombre, parámetros y versión)<br>\n  3) Verificar la lista de alarmas configuradas: sobretemperatura, falla de sensor, falla de vapor, falla de vacío<br>\n  4) Verificar enclavamientos: no inicia ciclo con puerta abierta, no abre puerta con presión residual<br>\n  5) Verificar usuarios, niveles de acceso y registro electrónico de eventos (si aplica 21 CFR Parte 11)<br>\n  6) Verificar respaldo del programa y procedimiento de restauración"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de control corresponde a lo especificado con programas y alarmas aprobados.<br>\n  Los enclavamientos de seguridad operan correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de programas, alarmas y usuarios verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR Parte 11 (registros electrónicos, si aplica)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-AU-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-AU-007 — Verificación de soldaduras sanitarias y rugosidad de la cámara",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las soldaduras en contacto con vapor puro y condensado son sanitarias y que la rugosidad de la cámara cumple lo especificado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el mapa de soldaduras y los registros de soldador calificado con sus certificados<br>\n  2) Inspeccionar visualmente las soldaduras: uniformes, sin poros, socavados ni decoloración excesiva<br>\n  3) Medir la rugosidad (Ra) en los puntos definidos del mapa con rugosímetro calibrado, por triplicado<br>\n  4) Verificar pasivado de la cámara con su certificado (si aplica)<br>\n  5) Procesar los datos crudos de rugosidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las soldaduras son sanitarias y continuas, con soldadores calificados.<br>\n  La rugosidad promedio cumple Ra ≤0,8 µm en superficies en contacto con producto (o el valor de la URS aprobada) en cada punto medido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Mapa de soldaduras, certificados de soldador y reporte de rugosidad con data cruda (anexo del informe)<br>\n  - Data cruda y reporte estadístico del análisis de rugosidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE (equipos de bioprocesamiento)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-AU-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-AU-008 — Verificación de puertos de validación y documentación del fabricante",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el autoclave cuenta con los puertos para termopares de validación y con el paquete documental completo del fabricante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el puerto de validación y su prensaestopas: ubicación, diámetro y sellado<br>\n  2) Verificar manuales de operación y mantenimiento en su revisión vigente<br>\n  3) Verificar certificados de materiales de cámara y componentes en contacto con vapor<br>\n  4) Verificar protocolos FAT/SAT (si se ejecutaron) con sus desviaciones cerradas<br>\n  5) Verificar lista de repuestos críticos recomendados por el fabricante"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El puerto de validación existe, sella correctamente y permite el paso de termopares.<br>\n  El paquete documental del fabricante está completo y vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Lista de verificación documental diligenciada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR 01 (validación de esterilización por vapor)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TD-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TD-001 — Verificación de zonas, flujo y P&I del túnel",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las zonas del túnel (carga, calentamiento, enfriamiento, descarga), el sentido de flujo y el P&amp;I corresponden con lo instalado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Obtener la revisión vigente del P&amp;I y del plano de zonas aprobados<br>\n  2) Recorrer el túnel identificando zona de carga, zona caliente, zona de enfriamiento y zona de descarga<br>\n  3) Confirmar el sentido de flujo del producto y la segregación entre zona sucia y zona limpia<br>\n  4) Confirmar tag, ubicación y conexión de cada instrumento contra el P&amp;I<br>\n  5) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las zonas, el flujo y el P&amp;I corresponden con lo instalado en su revisión vigente.<br>\n  La segregación entre zona sucia y zona limpia es física y verificable."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - P&amp;I y plano de zonas verificados y firmados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ISPE Baseline Guide: Sterile Product Manufacturing Facilities."
     }
    ],
    "tabla": null,
    "familia": "tunel-despirogenizacion"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TD-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TD-002 — Verificación de conexiones de utilidades del túnel",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las utilidades del túnel están conectadas según especificación: energía eléctrica, aire, agua de enfriamiento y extracción."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la acometida eléctrica por zona: voltaje, fases, calibre y protección termomagnética<br>\n  2) Verificar el suministro de aire de proceso e instrumentos: presión, filtro y regulador<br>\n  3) Verificar el agua de enfriamiento de la zona fría: caudal, válvulas de corte y retorno<br>\n  4) Verificar el ducto de extracción: trazado, compuertas y conexión al sistema de extracción<br>\n  5) Registrar los parámetros de cada utilidad en la tabla de utilidades"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las utilidades están conectadas y sus parámetros están dentro de lo especificado.<br>\n  Cada utilidad cuenta con su elemento de corte accesible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de utilidades verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del túnel."
     }
    ],
    "tabla": null,
    "tablaModelo": "UTILIDADES TÚNEL",
    "familia": "tunel-despirogenizacion"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TD-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TD-003 — Verificación de cámara, cinta transportadora y puertas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la cámara del túnel, la cinta transportadora y las puertas cumplen material, acabados y mecanismos especificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el material de la cámara y de la cinta contra el certificado del fabricante<br>\n  2) Inspeccionar acabados internos: ausencia de picaduras, grietas y zonas de corrosión<br>\n  3) Verificar la cinta: tensión, alineación, malla íntegra y variador de velocidad instalado<br>\n  4) Verificar puertas de acceso e inspección: cierre hermético y enclavamiento entre zona sucia y limpia<br>\n  5) Verificar guías y rieles de vialería (si aplican): nivelación y ausencia de puntos de atascamiento"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cámara, cinta y puertas corresponden a lo especificado y están en condiciones adecuadas.<br>\n  El enclavamiento entre zonas opera correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico de cámara, cinta y puertas (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del túnel."
     }
    ],
    "tabla": null,
    "familia": "tunel-despirogenizacion"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TD-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TD-004 — Verificación de filtros HEPA y diferenciales de presión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los filtros HEPA del túnel y los medidores de diferencial están instalados con sus certificados y con la clasificación especificada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar cada filtro HEPA: ubicación, clasificación, número de serie y certificado de integridad de fábrica<br>\n  2) Verificar el asentamiento y sellado de cada filtro en su marco, sin fugas visibles de bypass<br>\n  3) Verificar los medidores de presión diferencial por zona: rango, calibración vigente e identificación<br>\n  4) Verificar prefiltros (si aplican): tipo y programa de recambio<br>\n  5) Registrar cada filtro y medidor en la tabla de filtros"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los filtros corresponden a la clasificación especificada y cuentan con certificado.<br>\n  Los medidores de diferencial están calibrados y vigentes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de filtros con certificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ISO 14644-3 (ensayos de salas limpias)."
     }
    ],
    "tabla": null,
    "tablaModelo": "FILTROS TÚNEL",
    "familia": "tunel-despirogenizacion"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TD-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TD-005 — Verificación de componentes críticos del túnel",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los componentes críticos del túnel están instalados, identificados y con su documentación de soporte."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar resistencias o baterías de calentamiento por zona: potencia, conexión y tag<br>\n  2) Verificar ventiladores de recirculación y de enfriamiento: modelo, sentido de giro y guardas<br>\n  3) Verificar sensores de temperatura de control y monitoreo por zona, con calibración vigente<br>\n  4) Verificar variador de velocidad de la cinta: modelo, parametrización base y respaldo<br>\n  5) Verificar válvulas y dampers de balanceo de aire: posición de diseño y bloqueo<br>\n  6) Registrar cada componente con su estatus en la tabla de componentes críticos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los componentes críticos están instalados, identificados y documentados.<br>\n  Los sensores de temperatura cuentan con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de componentes críticos verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1228.1&gt; (despirogenización por calor seco)."
     }
    ],
    "tabla": null,
    "tablaModelo": "COMPONENTES CRÍTICOS TÚNEL",
    "familia": "tunel-despirogenizacion"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TD-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TD-006 — Verificación del sistema de control, recetas, alarmas y enclavamientos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el PLC del túnel, sus recetas, alarmas y enclavamientos corresponden a lo especificado y están operativos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar modelo y versión de firmware del PLC y de la pantalla de operación<br>\n  2) Verificar las recetas cargadas contra la lista aprobada (temperatura por zona, velocidad de cinta y versión)<br>\n  3) Verificar la lista de alarmas: sobretemperatura, falla de sensor, falla de flujo, paro de cinta<br>\n  4) Verificar enclavamientos: no calienta sin flujo de aire, paro de cinta detiene el conteo de exposición<br>\n  5) Verificar usuarios, niveles de acceso y registro electrónico de eventos (si aplica 21 CFR Parte 11)<br>\n  6) Verificar respaldo de recetas y procedimiento de restauración"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de control corresponde a lo especificado con recetas y alarmas aprobadas.<br>\n  Los enclavamientos de seguridad operan correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de recetas, alarmas y usuarios verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR Parte 11 (registros electrónicos, si aplica)."
     }
    ],
    "tabla": null,
    "familia": "tunel-despirogenizacion"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TD-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TD-007 — Verificación de acabados sanitarios y rugosidad de la zona caliente",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las superficies de la zona caliente cumplen el acabado sanitario y la rugosidad especificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar visualmente las superficies internas de la zona caliente: uniformes, sin poros ni decoloración excesiva<br>\n  2) Medir la rugosidad (Ra) en los puntos definidos del mapa con rugosímetro calibrado, por triplicado<br>\n  3) Verificar los registros de soldador calificado de las uniones sanitarias (si aplican)<br>\n  4) Procesar los datos crudos de rugosidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las superficies cumplen el acabado sanitario especificado.<br>\n  La rugosidad promedio cumple Ra ≤0,8 µm en superficies en contacto con producto (o el valor de la URS aprobada) en cada punto medido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Mapa de puntos y reporte de rugosidad con data cruda (anexo del informe)<br>\n  - Data cruda y reporte estadístico del análisis de rugosidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE (equipos de bioprocesamiento)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tunel-despirogenizacion"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TD-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TD-008 — Verificación de termopares de validación y documentación del fabricante",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el túnel cuenta con los accesos para termopares de validación y con el paquete documental completo del fabricante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar los puertos o accesos para termopares de validación por zona y su sellado<br>\n  2) Verificar manuales de operación y mantenimiento en su revisión vigente<br>\n  3) Verificar certificados de materiales de cámara y cinta<br>\n  4) Verificar protocolos FAT/SAT (si se ejecutaron) con sus desviaciones cerradas<br>\n  5) Verificar lista de repuestos críticos recomendados por el fabricante"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los accesos para termopares existen y sellan correctamente.<br>\n  El paquete documental del fabricante está completo y vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Lista de verificación documental diligenciada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR 03 (túneles de despirogenización)."
     }
    ],
    "tabla": null,
    "familia": "tunel-despirogenizacion"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LI-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LI-001 — Verificación del P&I contra lo instalado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el P&amp;I del liofilizador (cámara, condensador, refrigeración, vacío, hidráulico) corresponde con la instalación física real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Obtener la revisión vigente del P&amp;I aprobado<br>\n  2) Recorrer la instalación identificando cámara de producto, condensador, grupo frigorífico, bomba de vacío, central hidráulica y líneas asociadas<br>\n  3) Confirmar tag, diámetro, material y aislamiento de cada línea contra el P&amp;I<br>\n  4) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El P&amp;I corresponde con lo instalado en su revisión vigente.<br>\n  No existen líneas, válvulas ni instrumentos sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - P&amp;I verificado y firmado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ISPE Baseline Guide: Sterile Product Manufacturing Facilities."
     }
    ],
    "tabla": null,
    "familia": "liofilizador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LI-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LI-002 — Verificación de conexiones de utilidades del liofilizador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las utilidades del liofilizador están conectadas según especificación: energía eléctrica, agua de proceso y enfriamiento, aire y drenajes."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la acometida eléctrica: voltaje, fases, calibre, protección y puesta a tierra<br>\n  2) Verificar el agua de proceso y de enfriamiento del grupo frigorífico: caudal, válvulas de corte y retorno<br>\n  3) Verificar el aire de instrumentos: presión, filtro y regulador<br>\n  4) Verificar drenajes de cámara, condensador y sala técnica con pendiente y trampa adecuadas<br>\n  5) Verificar el suministro de nitrógeno o gas inerte (si aplica) con su regulador<br>\n  6) Registrar los parámetros de cada utilidad en la tabla de utilidades"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las utilidades están conectadas y sus parámetros están dentro de lo especificado.<br>\n  Cada utilidad cuenta con su elemento de corte accesible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de utilidades verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del liofilizador."
     }
    ],
    "tabla": null,
    "tablaModelo": "UTILIDADES LIOFILIZADOR",
    "familia": "liofilizador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LI-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LI-003 — Verificación de cámara, bandejas y puerta",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la cámara de producto, las bandejas y la puerta cumplen material, acabados y mecanismos especificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el material de la cámara y de las bandejas contra el certificado del fabricante<br>\n  2) Inspeccionar acabados internos: ausencia de picaduras, grietas y zonas de corrosión<br>\n  3) Verificar la puerta: cierre hermético, empaque íntegro y enclavamiento con cámara bajo vacío<br>\n  4) Verificar planitud y nivelación de bandejas y del sistema de carga (si aplica)<br>\n  5) Verificar iluminación interior y mirillas (si aplican)"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cámara, bandejas y puerta corresponden a lo especificado y están en condiciones adecuadas.<br>\n  El enclavamiento de puerta bajo vacío opera correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico de cámara, bandejas y puerta (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del liofilizador."
     }
    ],
    "tabla": null,
    "familia": "liofilizador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LI-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LI-004 — Verificación del sistema de refrigeración",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el grupo frigorífico del liofilizador está instalado según especificación con su refrigerante, placa y seguridades."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar compresores: modelo, número de serie y montaje antivibratorio<br>\n  2) Verificar en placa el tipo y la carga de refrigerante instalada<br>\n  3) Verificar condensadores y ventilación de la sala técnica con espacio libre especificado<br>\n  4) Verificar presostatos de alta y baja con sus ajustes y certificados<br>\n  5) Verificar aislamiento de líneas frías y ausencia de condensación en puntos indebidos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de refrigeración corresponde a lo especificado con refrigerante declarado en placa.<br>\n  Las seguridades de presión están ajustadas y documentadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del sistema de refrigeración con placa y ajustes (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del grupo frigorífico."
     }
    ],
    "tabla": null,
    "familia": "liofilizador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LI-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LI-005 — Verificación del sistema de vacío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la bomba de vacío y sus líneas están instaladas según especificación con protección antirretorno de aceite."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la bomba de vacío: modelo, número de serie, tipo y nivel de aceite<br>\n  2) Verificar la válvula antirretorno o de aislamiento entre bomba y condensador<br>\n  3) Verificar el trazado de la línea de vacío: pendiente hacia la bomba, sin sifones que atrapen aceite<br>\n  4) Verificar la extracción o venteo de la bomba hacia zona segura<br>\n  5) Verificar medidores de vacío (Pirani, capacitancia): rango, ubicación y calibración vigente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de vacío corresponde a lo especificado con protección antirretorno instalada.<br>\n  Los medidores de vacío están calibrados y vigentes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del sistema de vacío verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del liofilizador."
     }
    ],
    "tabla": null,
    "familia": "liofilizador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LI-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LI-006 — Verificación de componentes críticos del liofilizador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los componentes críticos del liofilizador están instalados, identificados y con su documentación de soporte."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar válvulas de aislamiento cámara-condensador: tipo, actuador y posición<br>\n  2) Verificar sensores de temperatura de bandejas y de producto, con calibración vigente<br>\n  3) Verificar el sistema hidráulico de tapones: central, cilindros, mangueras y nivel de aceite<br>\n  4) Verificar filtros de venteo y de ruptura de vacío: grado y certificado<br>\n  5) Verificar sondas de presión y control de punto final (si aplican)<br>\n  6) Registrar cada componente con su estatus en la tabla de componentes críticos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los componentes críticos están instalados, identificados y documentados.<br>\n  Los sensores de temperatura y vacío cuentan con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de componentes críticos verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR 45 (liofilización, si aplica)."
     }
    ],
    "tabla": null,
    "tablaModelo": "COMPONENTES CRÍTICOS LIOFILIZADOR",
    "familia": "liofilizador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LI-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LI-007 — Verificación del sistema de control, recetas y registros electrónicos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el SCADA/PLC del liofilizador, sus recetas, usuarios y registros electrónicos corresponden a lo especificado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar modelo y versión de firmware del controlador y del SCADA<br>\n  2) Verificar las recetas cargadas contra la lista aprobada (etapas, rampas, presiones y versión)<br>\n  3) Verificar la lista de alarmas: falla de vacío, falla de refrigeración, desviación de bandeja, falla hidráulica<br>\n  4) Verificar usuarios, niveles de acceso, firmas electrónicas y pista de auditoría (21 CFR Parte 11)<br>\n  5) Verificar respaldo de recetas y procedimiento de restauración<br>\n  6) Verificar sincronización de fecha y hora con la red (si aplica)"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de control corresponde a lo especificado con recetas y alarmas aprobadas.<br>\n  Los controles de registros electrónicos cumplen 21 CFR Parte 11."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de recetas, alarmas y usuarios verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR Parte 11 (registros y firmas electrónicas)."
     }
    ],
    "tabla": null,
    "familia": "liofilizador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LI-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LI-008 — Verificación de soldaduras sanitarias y rugosidad de la cámara",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las soldaduras de la cámara de producto son sanitarias y que la rugosidad cumple lo especificado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el mapa de soldaduras y los registros de soldador calificado con sus certificados<br>\n  2) Inspeccionar visualmente las soldaduras: uniformes, sin poros, socavados ni decoloración excesiva<br>\n  3) Medir la rugosidad (Ra) en los puntos definidos del mapa con rugosímetro calibrado, por triplicado<br>\n  4) Verificar pasivado de la cámara con su certificado (si aplica)<br>\n  5) Procesar los datos crudos de rugosidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las soldaduras son sanitarias y continuas, con soldadores calificados.<br>\n  La rugosidad promedio cumple Ra ≤0,8 µm en superficies en contacto con producto (o el valor de la URS aprobada) en cada punto medido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Mapa de soldaduras, certificados de soldador y reporte de rugosidad con data cruda (anexo del informe)<br>\n  - Data cruda y reporte estadístico del análisis de rugosidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE (equipos de bioprocesamiento)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "liofilizador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LI-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LI-009 — Verificación de accesos de validación y documentación del fabricante",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el liofilizador cuenta con los accesos para sensores de validación y con el paquete documental completo del fabricante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar los puertos para termopares y sensores de validación en cámara y condensador, con su sellado<br>\n  2) Verificar manuales de operación y mantenimiento en su revisión vigente<br>\n  3) Verificar certificados de materiales de cámara, bandejas y condensador<br>\n  4) Verificar protocolos FAT/SAT (si se ejecutaron) con sus desviaciones cerradas<br>\n  5) Verificar lista de repuestos críticos recomendados por el fabricante"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los accesos para validación existen y sellan correctamente bajo vacío.<br>\n  El paquete documental del fabricante está completo y vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Lista de verificación documental diligenciada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR 45 (liofilización, si aplica)."
     }
    ],
    "tabla": null,
    "familia": "liofilizador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-RC-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-RC-001 — Verificación del P&I contra lo instalado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el P&amp;I del reactor (vaso, chaqueta o serpentín, agitación, adición, venteo y drenaje) corresponde con la instalación física real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Obtener la revisión vigente del P&amp;I aprobado<br>\n  2) Recorrer la instalación identificando vaso, chaqueta o serpentín, agitador, líneas de adición, venteo, filtros y drenaje<br>\n  3) Confirmar tag, diámetro, material y pendiente de cada línea contra el P&amp;I<br>\n  4) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El P&amp;I corresponde con lo instalado en su revisión vigente.<br>\n  No existen líneas, válvulas ni instrumentos sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - P&amp;I verificado y firmado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>P&amp;I y URS aprobados del proyecto; ASME BPE (materiales y acabados sanitarios)."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-RC-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-RC-002 — Verificación de conexiones de utilidades del reactor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las utilidades del reactor están conectadas según especificación: medio calefactor y refrigerante, energía eléctrica, aire de instrumentos y drenajes."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la acometida del medio calefactor (vapor o agua caliente): presión, reductor, filtro y trampa<br>\n  2) Verificar la acometida del medio refrigerante: caudal, válvulas de corte y retorno<br>\n  3) Verificar la acometida eléctrica del agitador y del control: voltaje, fases, calibre y protección<br>\n  4) Verificar el aire de instrumentos: presión, filtro y regulador<br>\n  5) Verificar drenajes de vaso y chaqueta con pendiente y trampa adecuadas<br>\n  6) Registrar los parámetros de cada utilidad en la tabla de utilidades"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las utilidades están conectadas y sus parámetros están dentro de lo especificado.<br>\n  Cada utilidad cuenta con su elemento de corte accesible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de utilidades verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "tablaModelo": "UTILIDADES REACTOR",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-RC-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-RC-003 — Verificación del recipiente a presión y sus dispositivos de alivio",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el vaso del reactor como recipiente a presión cuenta con placa de datos, memoria de cálculo y dispositivos de alivio calibrados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la placa de datos del vaso: presión y temperatura de diseño, año y número de serie<br>\n  2) Verificar la memoria de cálculo y el certificado de fabricación del vaso y de la chaqueta<br>\n  3) Verificar la válvula de seguridad y el disco de ruptura (si aplica): capacidad, presión de ajuste y certificado<br>\n  4) Verificar el manómetro del vaso: rango, certificado de calibración vigente e identificación<br>\n  5) Confirmar que la descarga de los alivios está conducida a zona segura"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El vaso cuenta con placa, memoria de cálculo y dispositivos de alivio calibrados y vigentes.<br>\n  La presión de ajuste no supera la presión máxima admisible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Copia de placa, memoria de cálculo y certificados de calibración (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPVC Sección VIII (recipientes a presión)."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-RC-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-RC-004 — Verificación del sistema de agitación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema de agitación (motor, reductor, eje, impulsor y sello) está instalado según especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar motor y reductor: modelo, potencia, número de serie y montaje<br>\n  2) Verificar el eje y el impulsor: tipo, material, fijación y concentricidad visual<br>\n  3) Verificar el sello mecánico o empaquetadura: tipo, conexiones de lubricación o barrera (si aplican)<br>\n  4) Verificar el variador de velocidad: modelo, parametrización base y respaldo<br>\n  5) Verificar deflectores internos (si aplican): presencia, fijación y material"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de agitación corresponde a lo especificado y gira libremente sin roces.<br>\n  El sello no presenta fugas visibles en inspección estática."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del sistema de agitación verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-RC-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-RC-005 — Verificación de componentes críticos del reactor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los componentes críticos del reactor están instalados, identificados y con su documentación de soporte."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar válvulas de fondo, adición y transferencia: tipo, tag y actuador<br>\n  2) Verificar sensores de temperatura, presión, nivel y pH (si aplican), con calibración vigente<br>\n  3) Verificar celdas de carga (si aplican): capacidad, certificado y lectura inicial<br>\n  4) Verificar filtro de venteo y rompedor de vacío: grado, certificado y ubicación<br>\n  5) Verificar mirillas, luces y tomamuestras: integridad y sellado<br>\n  6) Registrar cada componente con su estatus en la tabla de componentes críticos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los componentes críticos están instalados, identificados y documentados.<br>\n  Los instrumentos de control y monitoreo cuentan con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de componentes críticos verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;."
     }
    ],
    "tabla": null,
    "tablaModelo": "COMPONENTES CRÍTICOS REACTOR",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-RC-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-RC-006 — Verificación del sistema de control, alarmas y enclavamientos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema de control del reactor, sus lazos, alarmas y enclavamientos corresponden a lo especificado y están operativos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar modelo y versión de firmware del controlador<br>\n  2) Verificar los lazos de control configurados: temperatura de vaso y chaqueta, agitación, presión<br>\n  3) Verificar la lista de alarmas: sobrepresión, sobretemperatura, falla de agitación, bajo nivel<br>\n  4) Verificar enclavamientos: corte de calentamiento por sobretemperatura, paro de agitación por nivel bajo (si aplican)<br>\n  5) Verificar usuarios y niveles de acceso (si aplica 21 CFR Parte 11)<br>\n  6) Verificar respaldo de la configuración y procedimiento de restauración"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de control corresponde a lo especificado con lazos y alarmas aprobados.<br>\n  Los enclavamientos de seguridad operan correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de lazos, alarmas y usuarios verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema de control."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-RC-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-RC-007 — Verificación de hermeticidad del vaso y la chaqueta",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el vaso y la chaqueta son herméticos a la presión de prueba especificada, con registro de presión contra tiempo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar la presión de prueba aprobada y el medio de prueba (neumática o hidrostática)<br>\n  2) Presurizar el vaso y la chaqueta por separado hasta la presión de prueba<br>\n  3) Registrar la presión a intervalos definidos durante el tiempo de sostenimiento<br>\n  4) Inspeccionar uniones, bridas y conexiones con solución espumante (prueba neumática) o visual (hidrostática)<br>\n  5) Procesar los datos crudos de presión contra tiempo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La caída de presión durante el sostenimiento no supera el límite especificado.<br>\n  No se detectan fugas en uniones, bridas ni conexiones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de presión contra tiempo con data cruda y reporte (anexo del informe)<br>\n  - Data cruda y reporte estadístico del análisis de hermeticidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPVC Sección VIII (pruebas de recipientes)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-RC-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-RC-008 — Verificación de materiales en contacto, soldaduras y documentación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los materiales en contacto con el producto, las soldaduras sanitarias y el paquete documental cumplen lo especificado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar certificados de materiales del vaso, tapa, agitador y líneas de producto<br>\n  2) Verificar el mapa de soldaduras y los registros de soldador calificado<br>\n  3) Inspeccionar acabados internos: uniformes, sin poros ni decoloración excesiva<br>\n  4) Verificar manuales de operación y mantenimiento en su revisión vigente<br>\n  5) Verificar protocolos FAT/SAT (si se ejecutaron) con sus desviaciones cerradas"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los materiales y soldaduras cumplen lo especificado con soldadores calificados.<br>\n  El paquete documental del fabricante está completo y vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Certificados de materiales, mapa de soldaduras y lista documental (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE (equipos de bioprocesamiento)."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-VA-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-VA-001 — Verificación del P&I contra lo instalado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el P&amp;I del horno de vacío (cámara, vacío, calentamiento y control) corresponde con la instalación física real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Obtener la revisión vigente del P&amp;I aprobado<br>\n  2) Recorrer la instalación identificando cámara, bomba de vacío, resistencias, sensores y líneas asociadas<br>\n  3) Confirmar tag, diámetro, material y trazado de cada línea contra el P&amp;I<br>\n  4) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El P&amp;I corresponde con lo instalado en su revisión vigente.<br>\n  No existen líneas, válvulas ni instrumentos sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - P&amp;I verificado y firmado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del horno."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-VA-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-VA-002 — Verificación de conexiones de utilidades del horno",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las utilidades del horno de vacío están conectadas según especificación: energía eléctrica, agua de enfriamiento, aire y extracción."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la acometida eléctrica: voltaje, fases, calibre, protección y puesta a tierra<br>\n  2) Verificar el agua de enfriamiento de la bomba y de la camisa (si aplica): caudal y válvulas de corte<br>\n  3) Verificar el aire de instrumentos (si aplica): presión, filtro y regulador<br>\n  4) Verificar la extracción o venteo de la bomba hacia zona segura<br>\n  5) Registrar los parámetros de cada utilidad en la tabla de utilidades"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las utilidades están conectadas y sus parámetros están dentro de lo especificado.<br>\n  Cada utilidad cuenta con su elemento de corte accesible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de utilidades verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del horno."
     }
    ],
    "tabla": null,
    "tablaModelo": "UTILIDADES HORNO VACÍO",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-VA-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-VA-003 — Verificación de cámara, puerta y protección contra implosión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la cámara, la puerta y sus protecciones cumplen material, acabados y seguridad contra implosión especificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el material de la cámara y de la puerta contra el certificado del fabricante<br>\n  2) Inspeccionar acabados internos: ausencia de picaduras, grietas y zonas de corrosión<br>\n  3) Verificar el vidrio o mirilla (si aplica): laminado de seguridad, marco y protección contra implosión<br>\n  4) Verificar el empaque de la puerta: material, asentamiento uniforme y ausencia de daños<br>\n  5) Verificar el mecanismo de cierre y su enclavamiento: no abre con cámara bajo vacío"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cámara, puerta y protecciones corresponden a lo especificado y están en condiciones adecuadas.<br>\n  El enclavamiento de puerta bajo vacío opera correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico de cámara, puerta y protecciones (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del horno."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-VA-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-VA-004 — Verificación de la bomba de vacío y su protección antirretorno",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la bomba de vacío está instalada según especificación con protección antirretorno de aceite hacia la cámara."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la bomba de vacío: modelo, número de serie, tipo y nivel de aceite<br>\n  2) Verificar la válvula antirretorno o de aislamiento entre bomba y cámara<br>\n  3) Verificar el trazado de la línea de vacío: pendiente hacia la bomba, sin sifones que atrapen aceite<br>\n  4) Verificar el filtro de neblina de aceite en la descarga (si aplica)<br>\n  5) Verificar anclaje antivibratorio y guardas de la bomba"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La bomba corresponde a lo especificado con protección antirretorno instalada.<br>\n  La línea de vacío tiene trazado correcto sin puntos de atrapamiento."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la bomba de vacío verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la bomba."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-VA-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-VA-005 — Verificación de componentes críticos del horno",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los componentes críticos del horno de vacío están instalados, identificados y con su documentación de soporte."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar resistencias o elementos calefactores: potencia, conexión y tag por zona<br>\n  2) Verificar sensores de temperatura de control y monitoreo, con calibración vigente<br>\n  3) Verificar el vacuómetro o medidor de vacío: rango, ubicación y calibración vigente<br>\n  4) Verificar válvulas de vacío, venteo y ruptura con filtro: tipo y actuador<br>\n  5) Verificar el termostato o limitador independiente de sobretemperatura<br>\n  6) Registrar cada componente con su estatus en la tabla de componentes críticos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los componentes críticos están instalados, identificados y documentados.<br>\n  Los sensores y el medidor de vacío cuentan con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de componentes críticos verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;."
     }
    ],
    "tabla": null,
    "tablaModelo": "COMPONENTES CRÍTICOS HORNO VACÍO",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-VA-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-VA-006 — Verificación del sistema de control, alarmas y enclavamientos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el controlador del horno, sus programas, alarmas y enclavamientos corresponden a lo especificado y están operativos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar modelo y versión de firmware del controlador<br>\n  2) Verificar los programas cargados contra la lista aprobada (rampas, mesetas, vacío y versión)<br>\n  3) Verificar la lista de alarmas: sobretemperatura, falla de sensor, falla de vacío, falla de energía<br>\n  4) Verificar la protección independiente de sobretemperatura: ajuste y corte efectivo<br>\n  5) Verificar enclavamientos: no calienta sin vacío mínimo (si aplica), no abre puerta bajo vacío<br>\n  6) Verificar respaldo de programas y procedimiento de restauración"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de control corresponde a lo especificado con programas y alarmas aprobados.<br>\n  La protección de sobretemperatura y los enclavamientos operan correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de programas y alarmas verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del horno."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-VA-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-VA-007 — Verificación de hermeticidad de la cámara (tasa de fuga base)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la hermeticidad de la cámara del horno mediante la tasa de aumento de presión con cámara aislada, como línea base de instalación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Evacuar la cámara vacía hasta el nivel de vacío definido para la prueba<br>\n  2) Aislar la cámara cerrando la válvula hacia la bomba<br>\n  3) Registrar la presión a intervalos definidos durante el tiempo de observación<br>\n  4) Calcular la tasa de aumento de presión por unidad de tiempo<br>\n  5) Procesar los datos crudos de presión contra tiempo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La tasa de aumento de presión no supera el límite especificado por el fabricante.<br>\n  El empaque y las conexiones no presentan fugas detectables."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de presión contra tiempo con data cruda y reporte (anexo del informe)<br>\n  - Data cruda y reporte estadístico del análisis de hermeticidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del horno."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-VA-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-VA-008 — Verificación de puertos de validación y documentación del fabricante",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el horno cuenta con los accesos para termopares de validación y con el paquete documental completo del fabricante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el puerto de validación y su prensaestopas: ubicación, diámetro y sellado bajo vacío<br>\n  2) Verificar manuales de operación y mantenimiento en su revisión vigente<br>\n  3) Verificar certificados de materiales de cámara y componentes internos<br>\n  4) Verificar protocolos FAT/SAT (si se ejecutaron) con sus desviaciones cerradas<br>\n  5) Verificar lista de repuestos críticos recomendados por el fabricante"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El puerto de validación existe y sella correctamente bajo vacío.<br>\n  El paquete documental del fabricante está completo y vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Lista de verificación documental diligenciada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del horno."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LL-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LL-001 — Verificación del diagrama de flujo contra lo instalado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el diagrama de flujo de la llenadora (tanque, línea de producto, dosificación, tapado y salida) corresponde con la instalación física real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Obtener la revisión vigente del diagrama de flujo aprobado<br>\n  2) Recorrer la línea identificando tanque pulmón, línea de producto, estaciones de llenado, tapado y banda de salida<br>\n  3) Confirmar tag, diámetro y material de cada tramo contra el diagrama<br>\n  4) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El diagrama de flujo corresponde con lo instalado en su revisión vigente.<br>\n  No existen tramos, válvulas ni estaciones sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Diagrama de flujo verificado y firmado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ISPE Baseline Guide: Sterile Product Manufacturing Facilities (si aplica proceso aséptico)."
     }
    ],
    "tabla": null,
    "familia": "llenadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LL-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LL-002 — Verificación de conexiones de utilidades de la llenadora",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las utilidades de la llenadora están conectadas según especificación: energía eléctrica, aire comprimido, vacío y drenajes."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la acometida eléctrica: voltaje, fases, calibre, protección y puesta a tierra<br>\n  2) Verificar el aire comprimido: presión, filtro, regulador y punto de uso por estación<br>\n  3) Verificar el vacío (si aplica): conexión, válvula antirretorno y medición<br>\n  4) Verificar drenajes de la zona de llenado con pendiente adecuada<br>\n  5) Registrar los parámetros de cada utilidad en la tabla de utilidades"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las utilidades están conectadas y sus parámetros están dentro de lo especificado.<br>\n  Cada utilidad cuenta con su elemento de corte accesible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de utilidades verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la llenadora."
     }
    ],
    "tabla": null,
    "tablaModelo": "UTILIDADES LLENADORA",
    "familia": "llenadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LL-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LL-003 — Verificación de materiales en contacto y acabados sanitarios",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los materiales en contacto con el producto y los acabados sanitarios de la línea cumplen lo especificado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar certificados de materiales del tanque, línea de producto, agujas y válvulas dosificadoras<br>\n  2) Inspeccionar acabados de superficies en contacto: uniformes, sin poros ni decoloración excesiva<br>\n  3) Verificar conexiones sanitarias (clamp, orbitales): tipo, empaques y apriete<br>\n  4) Verificar mangueras de producto (si aplican): grado, certificado y fecha de vigencia<br>\n  5) Verificar lubricantes en contacto incidental con su grado alimenticio o farmacéutico (si aplican)"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los materiales en contacto cumplen lo especificado con certificados vigentes.<br>\n  Las conexiones sanitarias están completas y en condiciones adecuadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Certificados de materiales recopilados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE (equipos de bioprocesamiento)."
     }
    ],
    "tabla": null,
    "familia": "llenadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LL-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LL-004 — Verificación de componentes críticos de dosificación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los componentes críticos de dosificación están instalados, identificados y con su documentación de soporte."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar bombas o cilindros dosificadores: modelo, número de serie y capacidad<br>\n  2) Verificar agujas o boquillas de llenado: calibre, cantidad y estado<br>\n  3) Verificar válvulas de producto: tipo, tag y actuador<br>\n  4) Verificar sensores de nivel, presencia de envase y torque (si aplican), con calibración vigente<br>\n  5) Verificar el sistema de rechazo o conteo (si aplica): instalación y conexión al control<br>\n  6) Registrar cada componente con su estatus en la tabla de componentes críticos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los componentes críticos están instalados, identificados y documentados.<br>\n  Los sensores cuentan con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de componentes críticos verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la llenadora."
     }
    ],
    "tabla": null,
    "tablaModelo": "COMPONENTES CRÍTICOS LLENADORA",
    "familia": "llenadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LL-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LL-005 — Verificación de filtros de línea y venteos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los filtros de la línea de producto, del gas de cobertura y los venteos están instalados con sus certificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el filtro de línea de producto: grado, número de serie y certificado<br>\n  2) Verificar el filtro de gas de cobertura o nitrógeno (si aplica): grado y certificado<br>\n  3) Verificar filtros de venteo del tanque: grado y certificado<br>\n  4) Verificar carcasas: material, drenaje, venteo y conexiones sanitarias<br>\n  5) Verificar programa de recambio y prueba de integridad inicial documentada (punto de burbuja o difusión, según el fabricante del filtro)"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los filtros corresponden al grado especificado y cuentan con certificado.<br>\n  La integridad cumple el límite del fabricante del filtro (punto de burbuja o difusión).<br>\n  Las carcasas drenan y ventean correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de filtros con certificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR 26 (filtración esterilizante, si aplica)."
     }
    ],
    "tabla": null,
    "familia": "llenadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LL-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LL-006 — Verificación del sistema de control, formatos, alarmas y enclavamientos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el PLC de la llenadora, sus formatos, alarmas y enclavamientos corresponden a lo especificado y están operativos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar modelo y versión de firmware del PLC y de la pantalla de operación<br>\n  2) Verificar los formatos cargados contra la lista aprobada (envase, volumen y versión)<br>\n  3) Verificar la lista de alarmas: sin envase, nivel bajo, falla de dosificación, paro de emergencia<br>\n  4) Verificar enclavamientos: no dosifica sin envase presente, paro ante guarda abierta<br>\n  5) Verificar usuarios y niveles de acceso (si aplica 21 CFR Parte 11)<br>\n  6) Verificar respaldo de formatos y procedimiento de restauración"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de control corresponde a lo especificado con formatos y alarmas aprobados.<br>\n  Los enclavamientos de seguridad operan correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de formatos, alarmas y usuarios verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR Parte 11 (registros electrónicos, si aplica)."
     }
    ],
    "tabla": null,
    "familia": "llenadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LL-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LL-007 — Verificación dimensional de partes de formato instaladas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las partes de formato instaladas (guías, estrella, boquillas) corresponden al formato declarado y cumplen sus dimensiones críticas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar el formato instalado y su código contra la lista aprobada<br>\n  2) Medir las dimensiones críticas de las partes de formato con instrumento calibrado, por triplicado<br>\n  3) Verificar el montaje y ajuste de guías y estrella sin juegos excesivos<br>\n  4) Procesar los datos crudos dimensionales en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las partes instaladas corresponden al formato declarado.<br>\n  Las dimensiones críticas están dentro de tolerancia en todas las réplicas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro dimensional con data cruda y reporte (anexo del informe)<br>\n  - Data cruda y reporte estadístico del análisis dimensional de partes de formato"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Planos del fabricante de las partes de formato."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "llenadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LL-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LL-008 — Verificación de seguridades y documentación del fabricante",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las guardas y paros de emergencia están instalados y que el paquete documental del fabricante está completo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar guardas de partes móviles: presencia, fijación e interruptores de guarda<br>\n  2) Verificar paros de emergencia: ubicación, identificación y rearme<br>\n  3) Verificar manuales de operación y mantenimiento en su revisión vigente<br>\n  4) Verificar protocolos FAT/SAT (si se ejecutaron) con sus desviaciones cerradas<br>\n  5) Verificar lista de repuestos críticos recomendados por el fabricante"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las guardas y paros están instalados y operativos.<br>\n  El paquete documental del fabricante está completo y vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Lista de verificación documental diligenciada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la llenadora."
     }
    ],
    "tabla": null,
    "familia": "llenadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LF-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LF-001 — Verificación del P&I contra lo instalado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el P&amp;I del lecho fluido (impulsión, calentamiento, cámara de producto, filtros y extracción) corresponde con la instalación física real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Obtener la revisión vigente del P&amp;I aprobado<br>\n  2) Recorrer la instalación identificando impulsor, batería de calentamiento, plenum, cámara de producto, filtros de mangas y ducto de extracción<br>\n  3) Confirmar tag, diámetro, material y trazado de cada tramo contra el P&amp;I<br>\n  4) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El P&amp;I corresponde con lo instalado en su revisión vigente.<br>\n  No existen tramos, válvulas ni instrumentos sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - P&amp;I verificado y firmado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del lecho fluido."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LF-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LF-002 — Verificación de conexiones de utilidades del lecho fluido",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las utilidades del lecho fluido están conectadas según especificación: energía eléctrica, vapor o agua caliente, aire comprimido y extracción."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la acometida eléctrica: voltaje, fases, calibre, protección y puesta a tierra<br>\n  2) Verificar el medio calefactor (vapor o agua caliente): presión o temperatura, reductor, filtro y trampa<br>\n  3) Verificar el aire comprimido para boquillas y sacudido de mangas: presión, filtro y regulador<br>\n  4) Verificar el ducto de extracción: trazado, compuertas y conexión al sistema de extracción<br>\n  5) Registrar los parámetros de cada utilidad en la tabla de utilidades"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las utilidades están conectadas y sus parámetros están dentro de lo especificado.<br>\n  Cada utilidad cuenta con su elemento de corte accesible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de utilidades verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del lecho fluido."
     }
    ],
    "tabla": null,
    "tablaModelo": "UTILIDADES LECHO FLUIDO",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LF-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LF-003 — Verificación de cámara, distribuidor y carro de producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la cámara de producto, el distribuidor de aire y el carro cumplen material, acabados y mecanismos especificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el material de la cámara, el distribuidor y el carro contra el certificado del fabricante<br>\n  2) Inspeccionar acabados internos: ausencia de picaduras, grietas y zonas de corrosión<br>\n  3) Verificar el distribuidor: integridad de la malla, asentamiento y sellado perimetral<br>\n  4) Verificar el carro de producto: rodaje, freno, nivelación y acople hermético a la cámara<br>\n  5) Verificar empaques de cámara: material, asentamiento uniforme y ausencia de daños"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cámara, distribuidor y carro corresponden a lo especificado y están en condiciones adecuadas.<br>\n  El acople del carro sella correctamente sin fugas visibles de aire."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico de cámara, distribuidor y carro (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del lecho fluido."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LF-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LF-004 — Verificación de filtros de mangas y sistema antipolvo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los filtros de mangas y el sistema de sacudido están instalados con sus certificados y con la clasificación especificada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar cada manga: material, clasificación, número de lote y certificado<br>\n  2) Verificar el montaje de las mangas en su placa: asentamiento, sellado y ausencia de roturas<br>\n  3) Verificar el sistema de sacudido (aire comprimido o mecánico): conexiones, temporización base y operación manual<br>\n  4) Verificar el medidor de presión diferencial de filtros: rango, calibración vigente e identificación<br>\n  5) Verificar la conexión equipotencial y puesta a tierra del conjunto (control de polvo, si aplica ATEX)<br>\n  6) Registrar cada manga y medidor en la tabla de filtros"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las mangas corresponden a lo especificado y cuentan con certificado.<br>\n  El sistema de sacudido y el diferencial están operativos y calibrados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de filtros con certificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del lecho fluido."
     }
    ],
    "tabla": null,
    "tablaModelo": "FILTROS LECHO FLUIDO",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LF-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LF-005 — Verificación de componentes críticos del lecho fluido",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los componentes críticos del lecho fluido están instalados, identificados y con su documentación de soporte."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar ventiladores de impulsión y extracción: modelo, sentido de giro, variadores y guardas<br>\n  2) Verificar batería de calentamiento: potencia, conexiones y seguridades térmicas<br>\n  3) Verificar sensores de temperatura, humedad y flujo, con calibración vigente<br>\n  4) Verificar boquillas de aspersión y bomba de solución (si aplican): modelo, conexiones y filtros de línea<br>\n  5) Verificar válvulas y dampers de balanceo: posición de diseño y bloqueo<br>\n  6) Registrar cada componente con su estatus en la tabla de componentes críticos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los componentes críticos están instalados, identificados y documentados.<br>\n  Los sensores cuentan con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de componentes críticos verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del lecho fluido."
     }
    ],
    "tabla": null,
    "tablaModelo": "COMPONENTES CRÍTICOS LECHO FLUIDO",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LF-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LF-006 — Verificación del sistema de control, recetas, alarmas y enclavamientos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el PLC del lecho fluido, sus recetas, alarmas y enclavamientos corresponden a lo especificado y están operativos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar modelo y versión de firmware del PLC y de la pantalla de operación<br>\n  2) Verificar las recetas cargadas contra la lista aprobada (temperaturas, flujos, tiempos y versión)<br>\n  3) Verificar la lista de alarmas: sobretemperatura, falla de sensor, falla de flujo, diferencial alto de filtros<br>\n  4) Verificar enclavamientos: no calienta sin flujo de aire, paro por sobretemperatura independiente<br>\n  5) Verificar usuarios y niveles de acceso (si aplica 21 CFR Parte 11)<br>\n  6) Verificar respaldo de recetas y procedimiento de restauración"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de control corresponde a lo especificado con recetas y alarmas aprobadas.<br>\n  Los enclavamientos de seguridad operan correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Listado de recetas, alarmas y usuarios verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR Parte 11 (registros electrónicos, si aplica)."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LF-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LF-007 — Verificación de soldaduras sanitarias y rugosidad de la cámara",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las soldaduras de la cámara de producto son sanitarias y que la rugosidad cumple lo especificado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el mapa de soldaduras y los registros de soldador calificado con sus certificados<br>\n  2) Inspeccionar visualmente las soldaduras: uniformes, sin poros, socavados ni decoloración excesiva<br>\n  3) Medir la rugosidad (Ra) en los puntos definidos del mapa con rugosímetro calibrado, por triplicado<br>\n  4) Procesar los datos crudos de rugosidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las soldaduras son sanitarias y continuas, con soldadores calificados.<br>\n  La rugosidad promedio cumple Ra ≤0,8 µm en superficies en contacto con producto (o el valor de la URS aprobada) en cada punto medido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Mapa de soldaduras, certificados de soldador y reporte de rugosidad con data cruda (anexo del informe)<br>\n  - Data cruda y reporte estadístico del análisis de rugosidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE (equipos de bioprocesamiento)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-LF-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-LF-008 — Verificación de puertos de validación y documentación del fabricante",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el lecho fluido cuenta con los accesos para sensores de validación y con el paquete documental completo del fabricante."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar los puertos para termopares y sensores de validación en cámara y ductos, con su sellado<br>\n  2) Verificar manuales de operación y mantenimiento en su revisión vigente<br>\n  3) Verificar certificados de materiales de cámara, distribuidor y carro<br>\n  4) Verificar protocolos FAT/SAT (si se ejecutaron) con sus desviaciones cerradas<br>\n  5) Verificar lista de repuestos críticos recomendados por el fabricante"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los accesos para validación existen y sellan correctamente.<br>\n  El paquete documental del fabricante está completo y vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Lista de verificación documental diligenciada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del lecho fluido."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TB-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TB-001 — Verificación del diagrama de flujo contra lo instalado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el diagrama de flujo de la tableteadora (tolva, alimentador, torreta, descarga, rechazo y extracción) corresponde con la instalación física real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Obtener la revisión vigente del diagrama de flujo aprobado<br>\n  2) Recorrer la línea identificando tolva, alimentador forzado, torreta, canal de descarga, desviador de rechazo y ducto de extracción<br>\n  3) Confirmar tag, ubicación y conexión de cada componente contra el diagrama<br>\n  4) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El diagrama de flujo corresponde con lo instalado en su revisión vigente.<br>\n  No existen componentes, líneas ni instrumentos sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Diagrama de flujo verificado y firmado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TB-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TB-002 — Verificación de torreta, estaciones y juego de punzones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la torreta, el número de estaciones y el juego de punzones y matrices instalado corresponden a lo especificado con sus certificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el número de estaciones de la torreta contra la especificación de compra<br>\n  2) Verificar el juego de punzones y matrices: tipo (TSM/EU), cantidad y código<br>\n  3) Verificar los certificados del juego de punzones: material, dureza y trazabilidad<br>\n  4) Verificar el montaje de punzones superiores e inferiores y matrices: asentamiento correcto sin daños<br>\n  5) Registrar cada componente en la tabla de torreta y punzones"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La torreta y el juego instalado corresponden a lo especificado con certificados vigentes.<br>\n  Sin punzones ni matrices dañados o sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de torreta y punzones con certificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del fabricante de punzones y matrices (TSM/EU)."
     }
    ],
    "tabla": null,
    "tablaModelo": "TORRETA Y PUNZONES",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TB-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TB-003 — Verificación del sistema de control de fuerza, peso y rechazo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las celdas de fuerza, el control de peso y el desviador de rechazo están instalados y conectados al control."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar las celdas de fuerza de compresión principal, precompresión y eyección: ubicación, tag y conexión al control<br>\n  2) Verificar el control automático de peso (si aplica): módulo instalado y conectado<br>\n  3) Verificar el desviador o compuerta de rechazo: actuador, conexión y recipiente de rechazo identificado<br>\n  4) Verificar el muestreador y el contador (si aplican): instalación y conexión<br>\n  5) Verificar calibración vigente de las celdas instaladas"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los componentes están instalados, identificados y conectados.<br>\n  Las celdas cuentan con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del sistema de control y rechazo verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TB-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TB-004 — Verificación de extracción de polvo y desempolvador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema de extracción de polvo y el desempolvador están instalados con sus conexiones, filtros y certificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el ducto de extracción: trazado, conexiones a cámara de compresión y desempolvador<br>\n  2) Verificar los filtros del sistema: clasificación, certificados y programa de recambio<br>\n  3) Verificar el desempolvador (si aplica): montaje, tamices íntegros y conexión de aspiración<br>\n  4) Verificar el medidor de diferencial (si aplica): rango y calibración vigente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La extracción y el desempolvador corresponden a lo especificado.<br>\n  Los filtros cuentan con certificado y programa de recambio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de extracción y desempolvador (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-TB-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-TB-005 — Verificación de guardas, sobrecarga y seguridades instaladas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las guardas con sus interruptores, el sistema de sobrecarga y los paros de emergencia están instalados y operativos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar guardas de torreta y transmisión: presencia, fijación e interruptores conectados<br>\n  2) Verificar el sistema de sobrecarga (hidráulico o mecánico): instalado con su ajuste de diseño<br>\n  3) Verificar paros de emergencia: ubicación, identificación y acceso<br>\n  4) Verificar la placa de datos de la máquina: modelo, serie, estaciones y fuerza máxima"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Guardas, sobrecarga y paros instalados y operativos.<br>\n  La placa de datos corresponde a la especificación de compra."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de seguridades y placa de datos (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-EN-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-EN-001 — Verificación del diagrama de flujo contra lo instalado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el diagrama de flujo de la encapsuladora (tolva, orientación, separación, dosificación, cierre, rechazo y extracción) corresponde con la instalación física real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Obtener la revisión vigente del diagrama de flujo aprobado<br>\n  2) Recorrer la línea identificando tolva de cápsulas, orientador, estación de separación, dosificadores, cabezal de cierre, desviador de rechazo y ducto de extracción<br>\n  3) Confirmar tag, ubicación y conexión de cada componente contra el diagrama<br>\n  4) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El diagrama de flujo corresponde con lo instalado en su revisión vigente.<br>\n  No existen componentes, líneas ni instrumentos sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Diagrama de flujo verificado y firmado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-EN-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-EN-002 — Verificación de cabezal, dosificadores y piezas de formato",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el cabezal de dosificación, los dosificadores y las piezas de formato instaladas corresponden a lo especificado con sus certificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el cabezal de dosificación: modelo, número de serie y montaje<br>\n  2) Verificar los dosificadores (discos o pistones): cantidad, tipo y código<br>\n  3) Verificar las piezas de formato por tamaño de cápsula: juego completo, identificación y estado<br>\n  4) Verificar segmentos de orientación y separación: montaje y ausencia de daños<br>\n  5) Registrar cada componente en la tabla de cabezal y dosificadores"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El cabezal, los dosificadores y las piezas corresponden a lo especificado.<br>\n  Sin piezas dañadas, intercambiadas o sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de cabezal y dosificadores con certificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "tablaModelo": "CABEZAL Y DOSIFICADORES",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-EN-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-EN-003 — Verificación del sistema de vacío y control de peso y rechazo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema de vacío para separación, el control de peso y el desviador de rechazo están instalados y conectados al control."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la bomba o conexión de vacío: modelo, conexiones y medición con calibración vigente<br>\n  2) Verificar el control de peso en línea o muestreador (si aplica): instalación y conexión<br>\n  3) Verificar el desviador o compuerta de rechazo: actuador, conexión y recipiente de rechazo identificado<br>\n  4) Verificar el contador de cápsulas (si aplica): instalación y conexión<br>\n  5) Verificar calibración vigente de los instrumentos instalados"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los componentes están instalados, identificados y conectados.<br>\n  Los instrumentos cuentan con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del sistema de vacío, control y rechazo verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-EN-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-EN-004 — Verificación de extracción de polvo y desempolvado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el sistema de extracción de polvo y el pulidor o desempolvador están instalados con sus conexiones, filtros y certificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el ducto de extracción: trazado y conexiones a cámara de llenado y desempolvador<br>\n  2) Verificar los filtros del sistema: clasificación, certificados y programa de recambio<br>\n  3) Verificar el pulidor o desempolvador (si aplica): montaje y conexión de aspiración<br>\n  4) Verificar el medidor de diferencial (si aplica): rango y calibración vigente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La extracción y el desempolvado corresponden a lo especificado.<br>\n  Los filtros cuentan con certificado y programa de recambio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de extracción y desempolvado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-EN-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-EN-005 — Verificación de guardas, seguridades y placa de datos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las guardas con sus interruptores y los paros de emergencia están instalados, y que la placa de datos corresponde a la especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar guardas de partes móviles: presencia, fijación e interruptores conectados<br>\n  2) Verificar paros de emergencia: ubicación, identificación y acceso<br>\n  3) Verificar la placa de datos de la máquina: modelo, serie, velocidad máxima y tamaños de cápsula<br>\n  4) Verificar que la placa corresponde a la especificación de compra"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Guardas y paros instalados y operativos.<br>\n  La placa de datos corresponde a la especificación de compra."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de seguridades y placa de datos (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-GR-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-GR-001 — Verificación del P&I contra lo instalado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el P&amp;I del granulador (cuba, impulsor, chopper, adición de aglutinante, camisa, descarga y molino) corresponde con la instalación física real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Obtener la revisión vigente del P&amp;I aprobado<br>\n  2) Recorrer la instalación identificando cuba, impulsor, chopper, línea de aglutinante con boquilla, camisa, válvula de descarga y molino<br>\n  3) Confirmar tag, diámetro, material y trazado de cada línea contra el P&amp;I<br>\n  4) Registrar toda desviación como hallazgo con su disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El P&amp;I corresponde con lo instalado en su revisión vigente.<br>\n  No existen líneas, válvulas ni instrumentos sin identificar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - P&amp;I verificado y firmado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-GR-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-GR-002 — Verificación de cuba, impulsor y chopper",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la cuba, el impulsor y el chopper instalados corresponden a lo especificado con sus materiales y certificados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el material de la cuba, el impulsor y el chopper contra el certificado del fabricante<br>\n  2) Inspeccionar acabados internos: ausencia de picaduras, grietas y zonas de corrosión<br>\n  3) Verificar el montaje del impulsor y el chopper: fijación, concentricidad visual y giro libre<br>\n  4) Verificar el sello del eje: tipo instalado y conexiones de aire de sello o barrera<br>\n  5) Registrar cada componente en la tabla de cuba e impulsor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cuba, impulsor y chopper corresponden a lo especificado y giran libremente.<br>\n  El sello instalado corresponde al especificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de cuba e impulsor con certificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "tablaModelo": "CUBA E IMPULSOR",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-GR-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-GR-003 — Verificación del sistema de adición de aglutinante",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la bomba, la línea y la boquilla de adición de aglutinante están instaladas según especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la bomba de adición: modelo, número de serie y montaje<br>\n  2) Verificar la línea de líquido: trazado, material y conexiones sanitarias<br>\n  3) Verificar la boquilla o tubo de adición: tipo, posición y fijación sobre la cuba<br>\n  4) Verificar el aire de atomización (si aplica): conexión, filtro y regulador"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema de adición corresponde a lo especificado.<br>\n  La boquilla está posicionada según el diseño."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del sistema de adición verificado (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-GR-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-GR-004 — Verificación de camisa, descarga y molino",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la camisa (si aplica), la válvula de descarga y el molino o calibrador están instalados según especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la camisa (si aplica): conexiones de entrada y salida del medio térmico<br>\n  2) Verificar la válvula de descarga: tipo, actuador y asentamiento<br>\n  3) Verificar el molino o calibrador (si aplica): modelo, malla instalada y montaje<br>\n  4) Verificar celdas de carga (si aplican): montaje y conexión al control"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Camisa, descarga y molino corresponden a lo especificado.<br>\n  La válvula cierra herméticamente en inspección estática."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de camisa, descarga y molino (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-IQ-GR-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-IQ-GR-005 — Verificación del control, seguridades y placa de datos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el panel de control con sus seguridades está instalado y que la placa de datos corresponde a la especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el panel de control: modelo, versión y conexión de impulsor, chopper y bomba<br>\n  2) Verificar guardas y tapa con sus interruptores conectados<br>\n  3) Verificar paros de emergencia: ubicación, identificación y acceso<br>\n  4) Verificar la placa de datos: modelo, serie, capacidad y potencias"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Control y seguridades instalados y operativos.<br>\n  La placa de datos corresponde a la especificación de compra."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de control, seguridades y placa (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "familia": "granulador"
   }
  ],
  "OQ": [
   {
    "kind": "ensayo",
    "id": "EQ-OQ-COM-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-COM-001 — Verificación de los instrumentos de medición a utilizar en el OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Asegurar que todos los equipos e instrumentos de medición y los patrones utilizados en la Calificación de Operación del <span class=\"equipo\">equipo</span> están correctamente identificados y cuentan con calibración vigente que cubre toda la ejecución del OQ."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar cada instrumento requerido por los ensayos del OQ: patrones de temperatura y presión, termopares, manómetros diferenciales, anemómetros, higrómetros y cronómetros<br>\n  2) Inspeccionar la etiqueta de calibración de cada instrumento y comprobar que su vigencia cubre todo el periodo de ejecución del OQ, aunque haya estado vigente durante la IQ<br>\n  3) Registrar en la tabla correspondiente los datos de cada instrumento:<br>\n  a) Nombre del instrumento o equipo<br>\n  b) Fabricante y modelo<br>\n  c) Número de serie y código interno<br>\n  d) Fecha de última calibración y fecha de vencimiento<br>\n  4) Recopilar los certificados de calibración para su inclusión en los anexos del informe"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los instrumentos presentan calibración vigente que cubre la fecha de ejecución del OQ.<br>\n  La información registrada coincide con los certificados de calibración.<br>\n  Los certificados están disponibles y anexados al informe."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de instrumentos de medición del OQ completada<br>\n  - Copias de los certificados de calibración"
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
    "id": "EQ-OQ-RC-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-001 — Verificación de parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia detiene el agitador, la calefacción y las bombas del reactor de forma segura."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con el reactor en operación simulada (agitación, calentamiento y bomba en marcha), accionar la parada de emergencia<br>\n  2) Verificar la detención del agitador, el corte de calefacción y la parada de las bombas<br>\n  3) Verificar la señalización del paro y el requerimiento de rearme manual<br>\n  4) Restablecer y verificar el rearranque controlado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La parada de emergencia detiene agitador, calefacción y bombas.<br>\n  El rearranque exige rearme manual deliberado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de accionamiento de parada de emergencia (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-002 — Verificación de interlocks del reactor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los interlocks del reactor impiden condiciones inseguras: tapa abierta, agitador sin nivel mínimo, válvula de fondo abierta y presión de camisa."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con tapa o boca de hombre abierta, intentar arrancar la agitación y el calentamiento: no debe permitirlo<br>\n  2) Con nivel por debajo del mínimo, intentar arrancar el agitador: no debe girar en seco ni con las aspas descubiertas<br>\n  3) Con la válvula de fondo abierta durante el proceso, verificar la acción del interlock según diseño<br>\n  4) Simular presión de camisa fuera de rango y verificar la acción del interlock<br>\n  5) Registrar cada interlock con su respuesta"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los interlocks impiden la condición insegura correspondiente.<br>\n  Ningún interlock puede puentearse sin herramienta o clave."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de interlocks con respuesta verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-003 — Verificación de alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma del reactor dispara ante su condición y que la acción asociada ocurre: temperatura, nivel, sobrecorriente, sello y presión."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Forzar o simular alta y baja temperatura y verificar el disparo de cada alarma con su acción<br>\n  2) Forzar o simular alto y bajo nivel y verificar el disparo con su acción<br>\n  3) Simular sobrecorriente del motor del agitador y verificar la alarma y la protección<br>\n  4) Simular falla del sello mecánico (si aplica monitoreo) y verificar la alarma<br>\n  5) Simular alta presión (si aplica) y verificar la alarma y la acción<br>\n  6) Verificar el registro de cada alarma en el histórico de eventos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada alarma dispara ante su condición y ejecuta su acción asociada.<br>\n  Todas las alarmas quedan registradas en el histórico."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con disparo y acción verificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema de control."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-004 — Verificación de válvula de seguridad o alivio",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la válvula de seguridad o alivio del tanque o la camisa (si presurizan) cuenta con certificado y abre a su presión de ajuste."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el certificado de la válvula de seguridad con su presión de ajuste (si el tanque o la camisa presurizan)<br>\n  2) Verificar la prueba de apertura documentada (banco o en sitio según procedimiento)<br>\n  3) Verificar que la descarga está conducida a zona segura<br>\n  4) Registrar el ajuste contra la presión máxima admisible del recipiente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La válvula cuenta con certificado vigente y abre a su presión de ajuste.<br>\n  El ajuste no supera la presión máxima admisible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Certificado de la válvula de seguridad (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPVC Sección VIII (recipientes a presión)."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-005 — Verificación de falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que ante una falla de energía el reactor queda en estado seguro y no rearranca espontáneamente al retornar."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con el reactor en operación simulada, interrumpir la energía<br>\n  2) Verificar el estado seguro: agitación detenida, calentamiento cortado, válvulas en posición segura<br>\n  3) Restablecer la energía y verificar que no hay arranque espontáneo<br>\n  4) Verificar el rearranque manual controlado y el registro del evento"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ante la falla el reactor queda en estado seguro.<br>\n  No existe arranque espontáneo al retornar la energía."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de falla y recuperación de energía (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-006 — Verificación de exactitud de velocidad de agitación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de la velocidad del agitador en mínimo, nominal y máximo frente a un tacómetro independiente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la velocidad mínima, nominal y máxima desde el control<br>\n  2) Medir cada punto con un tacómetro independiente calibrado, por triplicado<br>\n  3) Registrar la lectura del control y la del tacómetro en cada punto<br>\n  4) Procesar los datos crudos de velocidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La velocidad indicada está dentro de la tolerancia especificada en los tres puntos.<br>\n  La repetibilidad cumple el criterio en cada punto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de velocidades con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad de agitación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-007 — Verificación de sentido de giro y rampas del agitador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el sentido de giro del agitador y sus rampas de aceleración y desaceleración."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Arrancar el agitador y verificar visualmente el sentido de giro contra el indicado en placa o manual<br>\n  2) Medir el tiempo de aceleración hasta la velocidad nominal<br>\n  3) Medir el tiempo de desaceleración hasta la detención<br>\n  4) Verificar ausencia de golpes o vibración anormal durante las rampas"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sentido de giro corresponde al especificado.<br>\n  Las rampas están dentro de los tiempos especificados sin anomalías."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de sentido de giro y rampas (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-008 — Verificación de corriente del motor con agua a volumen mínimo y máximo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la corriente del motor del agitador con agua a volumen mínimo y máximo no presenta picos anormales."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cargar agua al volumen mínimo y operar a la velocidad nominal registrando la corriente<br>\n  2) Cargar agua al volumen máximo y operar a la velocidad nominal registrando la corriente<br>\n  3) Registrar la corriente de arranque en ambos casos<br>\n  4) Comparar contra la corriente nominal de placa del motor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La corriente de operación no supera la nominal de placa en ningún volumen.<br>\n  No existen picos anormales durante la operación estable."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de corrientes por volumen (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Placa del motor del agitador."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-009 — Verificación de vibración, ruido y estado del sello mecánico",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar vibración y ruido del conjunto de agitación (si aplica medición) y el estado del sello mecánico sin fugas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar a velocidad nominal y registrar vibración y ruido (si aplica medición con instrumento)<br>\n  2) Inspeccionar el sello mecánico: ausencia de fugas de producto o de fluido de barrera<br>\n  3) Verificar el fluido de barrera (si lo hay): nivel, presión y conexiones correctas<br>\n  4) Verificar temperatura del sello al tacto o con instrumento (sin sobrecalentamiento)"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vibración y ruido dentro de lo esperado, sin anomalías.<br>\n  El sello no presenta fugas y el fluido de barrera es correcto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de vibración y estado del sello (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-010 — Verificación visual del vórtice y sumersión del impulsor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar visualmente el vórtice y la sumersión del impulsor a volumen mínimo, que define el límite real de operación del tanque."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cargar agua al volumen mínimo de operación<br>\n  2) Operar a la velocidad de rutina y observar el vórtice formado<br>\n  3) Verificar que el impulsor permanece sumergido sin aspiración de aire<br>\n  4) Registrar el nivel mínimo operativo real confirmado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  A volumen mínimo el impulsor opera sumergido sin aspiración de aire.<br>\n  El nivel mínimo operativo queda establecido y documentado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro fotográfico del vórtice y nivel mínimo (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación del reactor."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-011 — Verificación del homogeneizador o sistema de alto cizallamiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el homogeneizador o sistema de alto cizallamiento (si aplica): velocidad, sentido de giro y enclavamiento."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la velocidad del homogeneizador frente a instrumento independiente (si aplica), por triplicado<br>\n  2) Verificar el sentido de giro contra lo especificado<br>\n  3) Verificar el enclavamiento: no opera sin nivel mínimo ni con tapa abierta<br>\n  4) Procesar los datos crudos de velocidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La velocidad está dentro de tolerancia y el sentido es correcto.<br>\n  El enclavamiento impide la operación en condiciones inseguras."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del homogeneizador con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad del homogeneizador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del homogeneizador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-012 — Verificación de exactitud del sensor de control de temperatura",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud del sensor de control de temperatura frente a un patrón, en setpoints bajo, medio y alto del rango del proceso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Estabilizar el reactor con agua en el setpoint bajo, medio y alto del rango del proceso<br>\n  2) Medir cada punto con un patrón de referencia calibrado, por triplicado<br>\n  3) Registrar la lectura del control y la del patrón en cada punto<br>\n  4) Procesar los datos crudos de temperatura en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sensor de control está dentro de la tolerancia especificada en los tres setpoints.<br>\n  La repetibilidad cumple el criterio en cada punto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de exactitud con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de exactitud del sensor de temperatura"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Certificado del patrón de referencia."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-013 — Verificación de velocidad de calentamiento y enfriamiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la velocidad de calentamiento y de enfriamiento con agua, a volumen mínimo y máximo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con agua a volumen mínimo, registrar la curva de calentamiento hasta el setpoint y luego la de enfriamiento<br>\n  2) Repetir con agua a volumen máximo<br>\n  3) Calcular las velocidades promedio de calentamiento y enfriamiento en cada caso<br>\n  4) Procesar los datos crudos de temperatura contra tiempo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las velocidades de calentamiento y enfriamiento cumplen lo especificado a ambos volúmenes.<br>\n  Las curvas son reproducibles entre réplicas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de calentamiento y enfriamiento con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad de calentamiento y enfriamiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación del reactor."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-014 — Verificación de estabilidad y sobreimpulso en el setpoint",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad y el sobreimpulso de la temperatura en el setpoint, con la agitación de rutina."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Estabilizar el reactor con agua en el setpoint de rutina con la agitación de rutina<br>\n  2) Registrar la temperatura a intervalos definidos durante el tiempo de observación<br>\n  3) Determinar el sobreimpulso máximo y la banda de estabilidad alcanzada<br>\n  4) Procesar los datos crudos de temperatura en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sobreimpulso no supera el límite especificado.<br>\n  La temperatura se mantiene dentro de la banda de estabilidad especificada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de estabilidad con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad y sobreimpulso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación del reactor."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-015 — Mapeo de temperatura del líquido",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la uniformidad de temperatura del líquido con termopares en varios puntos (superior, medio, inferior y cerca de pared), a volumen mínimo y máximo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Instalar termopares calibrados en superior, medio, inferior y cerca de pared<br>\n  2) Mapear con agua a volumen mínimo en el setpoint de rutina<br>\n  3) Mapear con agua a volumen máximo en el setpoint de rutina<br>\n  4) Procesar los datos crudos de mapeo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La dispersión entre puntos no supera el límite especificado a ambos volúmenes.<br>\n  No existen puntos fríos o calientes fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Mapas de temperatura con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de mapeo de temperatura"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación del reactor."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-016 — Verificación de suministro y retorno de medio térmico",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el suministro y retorno de vapor, agua de enfriamiento o fluido térmico: presión, caudal y trampas de vapor (si aplican)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la presión y el caudal de suministro del medio térmico en operación<br>\n  2) Verificar el retorno: temperatura o presión de retorno dentro de lo esperado<br>\n  3) Verificar las trampas de vapor (si aplican): tipo, descarga y ausencia de vapor vivo<br>\n  4) Procesar los datos crudos de presión y caudal en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Presión y caudal de suministro cumplen lo especificado.<br>\n  Las trampas descargan condensado sin paso de vapor vivo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de suministro y retorno con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de suministro de medio térmico"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-017 — Verificación de volumen o peso y calibración de medición",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el volumen o peso con agua en varios niveles; si hay celdas de carga, calibración con pesas patrón; si hay sensor de nivel, calibración volumétrica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cargar agua en varios niveles y registrar la indicación del sistema<br>\n  2) Si hay celdas de carga, calibrar con pesas patrón trazables en varios puntos<br>\n  3) Si hay sensor de nivel, verificar contra volumen medido (calibración volumétrica)<br>\n  4) Procesar los datos crudos de volumen o peso en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La indicación de volumen o peso está dentro de tolerancia en todos los niveles.<br>\n  Las pesas patrón cuentan con certificado vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de calibración con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de volumen o peso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Certificados de pesas patrón."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-018 — Verificación de exactitud de las adiciones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de las adiciones por peso o por volumen (si aplica sistema de adición)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar adiciones de prueba por peso o por volumen en los rangos de uso (si aplica)<br>\n  2) Pesar o medir cada adición con instrumento independiente, por triplicado<br>\n  3) Registrar la cantidad programada contra la realmente adicionada<br>\n  4) Procesar los datos crudos de adiciones en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada adición está dentro de la tolerancia especificada.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de adiciones con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de exactitud de adiciones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación del reactor."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-019 — Prueba de fuga con presión o vacío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la hermeticidad del tanque con presión o vacío (si opera a presión distinta de la atmosférica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Presurizar o evacuar el tanque (si opera a presión distinta de la atmosférica) hasta el valor de prueba<br>\n  2) Aislar y registrar la presión o el vacío a intervalos definidos<br>\n  3) Inspeccionar uniones, bridas y conexiones<br>\n  4) Calcular la tasa de cambio y compararla contra el límite"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La tasa de cambio no supera el límite especificado.<br>\n  No se detectan fugas en uniones ni conexiones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de prueba de fuga (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-020 — Verificación de válvula de fondo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la apertura, el cierre y la ausencia de goteo de la válvula de fondo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con el tanque cargado, abrir la válvula de fondo y verificar descarga libre<br>\n  2) Cerrar la válvula y verificar ausencia de goteo durante el tiempo de observación<br>\n  3) Verificar el accionamiento (manual o automático) y su enclavamiento si aplica"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La válvula abre y cierra completamente.<br>\n  No existe goteo con la válvula cerrada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de válvula de fondo (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del reactor."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-021 — Verificación de bomba de transferencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la bomba de transferencia (si aplica): caudal, presión y recirculación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar la bomba de transferencia (si aplica) con agua al volumen de rutina<br>\n  2) Medir el caudal y la presión de descarga<br>\n  3) Verificar la recirculación al tanque sin fugas en sellos ni conexiones<br>\n  4) Verificar el sentido de giro y la ausencia de cavitación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El caudal y la presión cumplen lo especificado.<br>\n  No existen fugas ni cavitación sostenida."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de bomba de transferencia (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la bomba."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-022 — Verificación de venteo y filtro de venteo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el venteo del tanque y la integridad del filtro de venteo hidrofóbico (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el venteo del tanque: trazado libre sin obstrucciones<br>\n  2) Verificar el filtro de venteo hidrofóbico (si aplica): grado, instalación y certificado<br>\n  3) Verificar la prueba de integridad del filtro documentada<br>\n  4) Verificar que el venteo no permite ingreso de contaminantes"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El venteo está libre y el filtro corresponde al grado especificado.<br>\n  La integridad del filtro está verificada y documentada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de venteo y certificado del filtro (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR 26 (filtración, si aplica)."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-023 — Verificación de drenabilidad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el tanque, las líneas y la válvula de fondo se vacían sin retención, con pendientes y puntos bajos adecuados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cargar agua al volumen de rutina y drenar completamente por la válvula de fondo<br>\n  2) Inspeccionar el tanque, las líneas y la válvula: ausencia de retención o charcos<br>\n  3) Verificar pendientes hacia el drenaje y ausencia de puntos bajos indebidos<br>\n  4) Medir el volumen residual si el diseño lo exige"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El sistema drena completamente sin retención.<br>\n  Las pendientes conducen al punto de drenaje."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de drenabilidad (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ASME BPE (diseño sanitario)."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-024 — Verificación de cobertura del CIP",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la cobertura de limpieza del CIP (si aplica): prueba con riboflavina o equivalente en bolas de aspersión, con caudal y presión definidos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar riboflavina o equivalente en las superficies internas (si aplica CIP)<br>\n  2) Ejecutar el ciclo CIP con el caudal y la presión definidos<br>\n  3) Inspeccionar con luz ultravioleta la remoción completa en bolas de aspersión y superficies<br>\n  4) Registrar el ensayo en un solo protocolo (OQ o PQ de limpieza, sin duplicar)"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura completa sin puntos sin enjuagar.<br>\n  Caudal y presión dentro de lo definido durante el ciclo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de cobertura CIP (anexo del informe)"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Si la empresa ejecuta este ensayo en el PQ de limpieza, se asigna a un solo protocolo para no duplicarlo."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR 29 (limpieza, si aplica)."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-025",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-025 — Verificación de integridad del filtro de proceso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la integridad del filtro de proceso (si aplica) mediante prueba de burbuja o difusión."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar el filtro de proceso instalado (si aplica) con su grado y certificado<br>\n  2) Ejecutar la prueba de integridad (burbuja o difusión) según el procedimiento del fabricante del filtro<br>\n  3) Registrar el valor obtenido contra el límite del certificado<br>\n  4) Verificar la carcasa: drenaje, venteo y conexiones sanitarias"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La prueba de integridad cumple el límite del fabricante.<br>\n  El filtro instalado corresponde al grado especificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de integridad del filtro (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR 26 (filtración esterilizante, si aplica)."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RC-026",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RC-026 — Ciclo completo con agua a volumen máximo y mínimo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar un ciclo completo con agua al volumen máximo y al mínimo: carga, calentamiento, agitación, enfriamiento y descarga, sin alarmas ni desviaciones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar el ciclo completo con agua al volumen máximo registrando cada etapa<br>\n  2) Ejecutar el ciclo completo con agua al volumen mínimo registrando cada etapa<br>\n  3) Verificar la secuencia: carga, calentamiento, agitación, enfriamiento y descarga<br>\n  4) Registrar alarmas, intervenciones y desviaciones (no debe haber ninguna no justificada)"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ambos ciclos se completan según la secuencia aprobada.<br>\n  Sin alarmas ni desviaciones no justificadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de ciclo a volumen máximo y mínimo (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación del reactor."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-001 — Verificación de parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia detiene la torreta en un tiempo seguro y deja la máquina en estado seguro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con la torreta girando a velocidad nominal sin producto, accionar la parada de emergencia<br>\n  2) Medir el tiempo de detención de la torreta<br>\n  3) Verificar el estado seguro: torreta detenida, alimentador parado, sin rearranque espontáneo<br>\n  4) Restablecer y verificar el rearranque controlado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La torreta se detiene dentro del tiempo especificado.<br>\n  No existe rearranque espontáneo tras el restablecimiento de energía."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de parada de emergencia (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-002 — Verificación de interlocks",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los interlocks impiden el arranque o detienen la máquina ante puertas y guardas abiertas, ventana de compresión, tolva y contención aislada (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con cada puerta o guarda abierta, intentar arrancar: no debe permitirlo<br>\n  2) Con la ventana de compresión abierta (si aplica), intentar operar: no debe permitirlo<br>\n  3) Con la tolva retirada o sin nivel (si aplica sensor), verificar la acción del interlock<br>\n  4) Con la contención aislada abierta (si aplica), verificar que no arranca<br>\n  5) Registrar cada interlock con su respuesta"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ningún interlock permite la operación en condición insegura.<br>\n  Ningún interlock puede puentearse sin herramienta o clave."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de interlocks con respuesta verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-003 — Verificación de protección de sobrecarga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la protección de sobrecarga corta la compresión al superar la fuerza máxima de diseño o de punzones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar el sistema de sobrecarga (hidráulico o mecánico) y su ajuste<br>\n  2) Simular o provocar la condición de sobrecarga según el procedimiento del fabricante<br>\n  3) Verificar el corte de la compresión y la señalización<br>\n  4) Verificar el rearme y la recuperación de la operación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La protección actúa al superar la fuerza máxima sin daño a punzones ni matriz.<br>\n  La máquina señaliza la sobrecarga y permite el rearme controlado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de protección de sobrecarga (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-004 — Verificación de alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma dispara ante su condición y que la acción ocurre: sobrecorriente, fuerza fuera de límites, falla del alimentador, falla de extracción de polvo y nivel bajo de tolva (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular sobrecorriente del motor y verificar alarma y protección<br>\n  2) Simular fuerza fuera de límites y verificar alarma y acción (rechazo o paro)<br>\n  3) Simular falla del alimentador y verificar la alarma<br>\n  4) Simular falla de extracción de polvo y verificar la alarma<br>\n  5) Simular nivel bajo de tolva (si aplica sensor) y verificar la alarma<br>\n  6) Verificar el registro de cada alarma en el histórico"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada alarma dispara ante su condición y ejecuta su acción asociada.<br>\n  Todas las alarmas quedan registradas en el histórico."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con disparo y acción verificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-005 — Verificación de falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que ante una falla de energía la tableteadora queda en estado seguro y sin arranque espontáneo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con la torreta girando, interrumpir la energía<br>\n  2) Verificar el estado seguro: torreta detenida, alimentador parado, sin movimientos residuales peligrosos<br>\n  3) Restablecer la energía y verificar que no hay arranque espontáneo<br>\n  4) Verificar el rearranque manual controlado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ante la falla la máquina queda en estado seguro.<br>\n  No existe arranque espontáneo al retornar la energía."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de falla y recuperación de energía (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-006 — Verificación de exactitud de velocidad de la torreta",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de la velocidad de la torreta en mínimo, nominal y máximo frente a un tacómetro independiente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la velocidad mínima, nominal y máxima desde el control<br>\n  2) Medir cada punto con un tacómetro independiente calibrado, por triplicado<br>\n  3) Registrar la lectura del control y la del tacómetro en cada punto<br>\n  4) Procesar los datos crudos de velocidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La velocidad indicada está dentro de la tolerancia especificada en los tres puntos.<br>\n  La repetibilidad cumple el criterio en cada punto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de velocidades con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad de torreta"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-007 — Verificación de velocidad del alimentador forzado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud y el sentido de giro de la velocidad del alimentador forzado (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la velocidad del alimentador en mínimo, nominal y máximo (si aplica)<br>\n  2) Medir cada punto con instrumento independiente, por triplicado<br>\n  3) Verificar el sentido de giro contra lo especificado<br>\n  4) Procesar los datos crudos de velocidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La velocidad está dentro de tolerancia y el sentido es correcto.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del alimentador con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad del alimentador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-008 — Verificación de concentricidad de torreta y holgura punzón-matriz",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la concentricidad de la torreta (TIR) y la holgura punzón-matriz dentro de especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la concentricidad (TIR) de la torreta con comparador en los puntos definidos<br>\n  2) Medir la holgura punzón-matriz en una muestra de estaciones<br>\n  3) Comparar contra la especificación del fabricante y del juego de punzones<br>\n  4) Registrar desgaste o daño visible en punzones y matrices"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El TIR y la holgura están dentro de especificación.<br>\n  Sin punzones ni matrices dañados en la muestra."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de concentricidad y holguras (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del fabricante de punzones y matrices (TSM/EU)."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-009 — Verificación de regulación de profundidad de llenado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la respuesta y repetibilidad de la regulación de profundidad de llenado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la profundidad de llenado en mínimo, medio y máximo<br>\n  2) Medir la profundidad resultante con instrumento calibrado, por triplicado en cada punto<br>\n  3) Verificar la respuesta del ajuste (sin juego excesivo ni saltos)<br>\n  4) Procesar los datos crudos de profundidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La profundidad responde al ajuste dentro de tolerancia en los tres puntos.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de profundidad con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de profundidad de llenado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-010 — Verificación de regulación de espesor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el ajuste de la altura de compresión y la repetibilidad de la regulación de espesor."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la altura de compresión en varios puntos del rango<br>\n  2) Comprimir placebo y medir el espesor resultante con micrómetro calibrado<br>\n  3) Verificar repetibilidad en el punto nominal<br>\n  4) Verificar ausencia de juego excesivo en el mecanismo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El espesor responde al ajuste dentro de tolerancia.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de espesor por ajuste (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-011 — Verificación de corriente del motor principal",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la corriente del motor principal a velocidad mínima y máxima, sin picos anormales."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar a velocidad mínima y registrar la corriente estable y de arranque<br>\n  2) Operar a velocidad máxima y registrar la corriente estable y de arranque<br>\n  3) Comparar contra la corriente nominal de placa<br>\n  4) Verificar ausencia de picos anormales en operación estable"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La corriente no supera la nominal de placa en ningún punto.<br>\n  Sin picos anormales en operación estable."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de corrientes (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Placa del motor principal."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-012 — Verificación de vibración, ruido y temperatura",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar vibración, ruido y temperatura de cojinetes y motor (si aplica medición)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar a velocidad nominal y registrar vibración y ruido (si aplica medición)<br>\n  2) Medir la temperatura de cojinetes principales y del motor tras la estabilización<br>\n  3) Comparar contra los límites del fabricante<br>\n  4) Verificar ausencia de ruidos anormales localizados"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vibración, ruido y temperatura dentro de lo esperado.<br>\n  Sin puntos calientes ni ruidos anormales."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de vibración y temperaturas (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-013 — Verificación de lubricación del sistema de punzones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la lubricación del sistema de punzones (si aplica sistema automático)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el nivel y tipo de lubricante contra lo especificado (si aplica)<br>\n  2) Verificar la dosificación del sistema automático en los puntos de lubricación<br>\n  3) Verificar ausencia de exceso de lubricante que contamine el producto<br>\n  4) Verificar la alarma de nivel bajo (si aplica)"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La lubricación corresponde a lo especificado sin exceso contaminante.<br>\n  La alarma de nivel (si aplica) opera."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de lubricación (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-014 — Verificación de exactitud de la fuerza de compresión principal",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de la fuerza de compresión principal frente a la celda de referencia, en varios puntos del rango declarado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Instalar la celda de referencia calibrada según el procedimiento del fabricante<br>\n  2) Medir la fuerza indicada contra la referencia en varios puntos del rango declarado, por triplicado<br>\n  3) Registrar la lectura del control y la de la celda en cada punto<br>\n  4) Procesar los datos crudos de fuerza en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La fuerza indicada está dentro de la tolerancia especificada en todos los puntos.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de fuerzas con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de fuerza de compresión"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Certificado de la celda de referencia."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-015 — Verificación de exactitud de precompresión y fuerza de eyección",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de la precompresión y de la fuerza de eyección frente a referencia."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la precompresión indicada contra referencia en varios puntos, por triplicado<br>\n  2) Medir la fuerza de eyección contra referencia en varios puntos, por triplicado<br>\n  3) Registrar lecturas del control y de referencia<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Precompresión y eyección dentro de tolerancia en todos los puntos.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de precompresión y eyección"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Certificado de la celda de referencia."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-016 — Verificación de linealidad entre ajuste y fuerza medida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la linealidad entre el ajuste de profundidad o espesor y la fuerza medida."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Variar el ajuste de profundidad o espesor en al menos cinco puntos del rango<br>\n  2) Registrar la fuerza medida en cada punto, por triplicado<br>\n  3) Ajustar la recta de regresión ajuste contra fuerza<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La relación es lineal dentro del criterio (coeficiente de correlación aprobado).<br>\n  Sin histéresis significativa al subir y bajar el ajuste."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curva de linealidad con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de linealidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-017 — Verificación de estabilidad de la fuerza en operación continua",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad de la fuerza en operación continua a cada velocidad probada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar en continuo a cada velocidad probada durante el tiempo definido<br>\n  2) Registrar la fuerza principal a intervalos definidos<br>\n  3) Evaluar deriva y variabilidad en cada velocidad<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La fuerza se mantiene dentro de la banda especificada sin deriva.<br>\n  La variabilidad cumple el criterio a cada velocidad."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de estabilidad con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad de fuerza"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-018 — Verificación del control automático de peso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la respuesta del lazo de control automático de peso (si aplica) ante una variación inducida, y su tiempo de corrección."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con placebo a velocidad nominal con el control automático activo (si aplica)<br>\n  2) Inducir una variación de peso (cambio de ajuste) y registrar la respuesta del lazo<br>\n  3) Medir el tiempo de corrección hasta retornar a la banda<br>\n  4) Verificar ausencia de oscilación sostenida<br>\n  5) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El lazo corrige la variación dentro del tiempo especificado.<br>\n  Sin oscilación sostenida tras la corrección."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de respuesta del lazo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de control de peso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema de control."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-019 — Verificación del mecanismo de rechazo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las tabletas fuera de límites se desvían al rechazo, con conteo correcto y sin que ninguna mala pase al recipiente de buenas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inducir tabletas fuera de límites (ajuste de fuerza fuera de banda) de forma controlada<br>\n  2) Verificar el desvío de cada tableta mala al recipiente de rechazo<br>\n  3) Verificar el conteo de rechazadas contra las inducidas<br>\n  4) Inspeccionar el recipiente de buenas: ninguna mala debe estar presente<br>\n  5) Procesar los datos crudos de conteo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de las tabletas malas inducidas se rechaza.<br>\n  Ninguna tableta mala llega al recipiente de buenas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de rechazo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de rechazo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-020 — Verificación del muestreador automático",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el funcionamiento y la representatividad del muestreador automático (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con placebo y activar el muestreador automático (si aplica)<br>\n  2) Verificar la toma en los intervalos programados<br>\n  3) Comparar la muestra automática contra muestreo manual simultáneo<br>\n  4) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El muestreador toma en los intervalos programados.<br>\n  La muestra automática es representativa (sin sesgo contra el manual)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del muestreador con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del muestreador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-021 — Verificación del contador de tabletas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud del contador de tabletas (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar una cantidad conocida de ciclos con el contador activo (si aplica)<br>\n  2) Contar manualmente o por método independiente el mismo lote<br>\n  3) Comparar ambas cuentas, por triplicado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El conteo automático coincide con el independiente dentro de tolerancia.<br>\n  Sin tabletas contadas de más ni de menos fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de conteo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del contador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-022 — Verificación de extracción y control de polvo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la presión negativa y el caudal de extracción en la cámara de compresión y en el desempolvador."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la presión negativa en la cámara de compresión con instrumento calibrado<br>\n  2) Medir el caudal de extracción en los puntos definidos<br>\n  3) Verificar el desempolvador: operación y puntos de aspiración libres<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Presión negativa y caudal dentro de lo especificado.<br>\n  Sin acumulación visible de polvo en la cámara."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de extracción con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de extracción"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-023 — Verificación de integridad de filtros de extracción",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la integridad de los filtros del sistema de extracción (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar los filtros del sistema de extracción (si aplica) con su clasificación<br>\n  2) Verificar certificados y programa de recambio<br>\n  3) Verificar asentamiento y sellado sin bypass<br>\n  4) Verificar el diferencial de presión con calibración vigente"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los filtros corresponden a lo especificado con certificados vigentes.<br>\n  Sin bypass y con diferencial dentro de rango."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de filtros de extracción (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema de extracción."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-024 — Verificación del desempolvador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el funcionamiento del desempolvador (si aplica) y la ausencia de polvo residual sobre la tableta."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con placebo y activar el desempolvador (si aplica)<br>\n  2) Inspeccionar visualmente las tabletas a la salida: ausencia de polvo residual<br>\n  3) Verificar perforaciones o tamices del desempolvador libres y sin daño<br>\n  4) Verificar la aspiración conectada al desempolvador"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las tabletas salen sin polvo residual visible.<br>\n  El desempolvador opera sin daño a las tabletas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del desempolvador (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-025",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-025 — Corrida con placebo a tres velocidades",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar una corrida con granulado placebo a velocidad mínima, nominal y máxima: peso, espesor, dureza y friabilidad dentro de lo esperado, sin alarmas ni desviaciones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Correr granulado placebo a velocidad mínima registrando peso, espesor, dureza y friabilidad<br>\n  2) Repetir a velocidad nominal y a velocidad máxima<br>\n  3) Registrar alarmas e intervenciones en cada corrida<br>\n  4) Procesar los datos crudos de atributos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Peso, espesor, dureza y friabilidad dentro de lo esperado a las tres velocidades.<br>\n  Sin alarmas ni desviaciones no justificadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de corrida con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de corrida con placebo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-TB-026",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-TB-026 — Cambio de ajuste de fuerza con la máquina en marcha",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la respuesta estable y sin saltos ante un cambio de ajuste de fuerza con la máquina en marcha."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con placebo a velocidad nominal de forma estable<br>\n  2) Cambiar el ajuste de fuerza en escalones definidos sin detener la máquina<br>\n  3) Registrar la fuerza y los atributos resultantes en cada escalón<br>\n  4) Verificar ausencia de saltos o inestabilidad en la transición<br>\n  5) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La fuerza responde al ajuste de forma estable y sin saltos.<br>\n  Los atributos se mantienen dentro de lo esperado en cada escalón."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de cambios de ajuste con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cambio de ajuste"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-001 — Verificación de parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia detiene la máquina en un tiempo seguro y la deja en estado seguro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con la máquina en marcha sin producto, accionar la parada de emergencia<br>\n  2) Medir el tiempo de detención<br>\n  3) Verificar el estado seguro sin rearranque espontáneo<br>\n  4) Restablecer y verificar el rearranque controlado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La máquina se detiene dentro del tiempo especificado.<br>\n  No existe rearranque espontáneo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de parada de emergencia (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-002 — Verificación de interlocks",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los interlocks impiden el arranque ante guardas y puertas abiertas, tolva y cabezal de dosificación mal posicionado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con cada guarda o puerta abierta, intentar arrancar: no debe permitirlo<br>\n  2) Con la tolva retirada o sin nivel (si aplica sensor), verificar la acción<br>\n  3) Con el cabezal de dosificación mal posicionado, verificar que no arranca<br>\n  4) Registrar cada interlock con su respuesta"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ningún interlock permite la operación en condición insegura.<br>\n  Ningún interlock puede puentearse sin herramienta o clave."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de interlocks con respuesta verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-003 — Verificación de alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma dispara y ejecuta su acción: falta de cápsulas, nivel bajo de polvo, falla de vacío, sobrecorriente, cápsula atascada, falla de cierre y falla de extracción."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular falta de cápsulas y verificar alarma y acción<br>\n  2) Simular nivel bajo de polvo y verificar alarma<br>\n  3) Simular falla de vacío y verificar alarma<br>\n  4) Simular sobrecorriente y verificar protección<br>\n  5) Simular cápsula atascada, falla de cierre y falla de extracción, verificando cada alarma<br>\n  6) Verificar el registro en el histórico"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada alarma dispara ante su condición y ejecuta su acción.<br>\n  Todas quedan registradas en el histórico."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con disparo y acción verificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-004 — Verificación de falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el estado seguro ante falla de energía, sin arranque espontáneo, y el comportamiento de las cápsulas en proceso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con la máquina en marcha, interrumpir la energía<br>\n  2) Verificar el estado seguro y la ausencia de arranque espontáneo al retornar<br>\n  3) Verificar el comportamiento de las cápsulas en proceso (retención sin daño indebido)<br>\n  4) Verificar el rearranque manual controlado y el descarte definido si aplica"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estado seguro sin arranque espontáneo.<br>\n  Las cápsulas en proceso se tratan según lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de falla y recuperación de energía (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-005 — Verificación de exactitud de velocidad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de la velocidad (cápsulas por minuto) en mínimo, nominal y máximo frente a contador o cronómetro independiente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la velocidad mínima, nominal y máxima desde el control<br>\n  2) Medir cada punto con contador o cronómetro independiente, por triplicado<br>\n  3) Registrar la lectura del control y la independiente<br>\n  4) Procesar los datos crudos de velocidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La velocidad indicada está dentro de tolerancia en los tres puntos.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de velocidades con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-006 — Verificación de corriente del motor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la corriente del motor en cada velocidad, sin picos anormales."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar en cada velocidad y registrar la corriente estable y de arranque<br>\n  2) Comparar contra la corriente nominal de placa<br>\n  3) Verificar ausencia de picos anormales"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La corriente no supera la nominal de placa.<br>\n  Sin picos anormales en operación estable."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de corrientes (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Placa del motor principal."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-007 — Verificación de vibración, ruido y temperatura",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar vibración, ruido y temperatura de cojinetes (si aplica medición)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar a velocidad nominal y registrar vibración y ruido (si aplica)<br>\n  2) Medir la temperatura de cojinetes tras la estabilización<br>\n  3) Comparar contra los límites del fabricante"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vibración, ruido y temperatura dentro de lo esperado.<br>\n  Sin puntos calientes ni ruidos anormales."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de vibración y temperaturas (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-008 — Verificación de piezas de cambio de formato",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada tamaño de cápsula se monta con sus piezas de formato, con ajuste y alineación correctos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Montar las piezas de formato de cada tamaño de cápsula declarado<br>\n  2) Verificar ajuste y alineación de segmentos, dosificadores y cabezal<br>\n  3) Verificar la identificación de cada juego de piezas<br>\n  4) Registrar el tiempo de cambio si el procedimiento lo exige"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada tamaño monta con ajuste y alineación correctos.<br>\n  Juegos identificados sin piezas intercambiadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de cambio de formato (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-009 — Verificación de orientación de cápsulas vacías",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la orientación con cápsulas vacías: porcentaje correctamente orientado contra el criterio mínimo definido."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Correr cápsulas vacías a velocidad nominal<br>\n  2) Contar cápsulas correctamente orientadas contra el total en muestras definidas<br>\n  3) Calcular el porcentaje de orientación correcta<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El porcentaje de orientación cumple el mínimo definido.<br>\n  Sin deterioro del porcentaje a velocidad máxima."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de orientación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de orientación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-010 — Verificación de separación de tapa y cuerpo por vacío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el porcentaje de cápsulas bien separadas y el nivel de vacío en cada posición."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Correr cápsulas vacías registrando el nivel de vacío por posición<br>\n  2) Contar cápsulas bien separadas contra el total<br>\n  3) Calcular el porcentaje de separación correcta<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El porcentaje de separación cumple el mínimo definido.<br>\n  El vacío por posición está dentro de rango."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de separación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de separación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-011 — Verificación de cierre de cápsula",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la longitud de la cápsula cerrada y el bloqueo (locking) correcto en una muestra, sin cápsulas abolladas o perforadas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Correr cápsulas vacías y tomar una muestra definida<br>\n  2) Medir la longitud de cierre con instrumento calibrado<br>\n  3) Verificar el bloqueo (locking) correcto por tracción o inspección definida<br>\n  4) Inspeccionar abolladuras y perforaciones<br>\n  5) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La longitud de cierre está dentro de especificación.<br>\n  Bloqueo correcto sin abolladuras ni perforaciones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de cierre con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cierre"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de la cápsula vacía."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-012 — Verificación de fuerza o presión de cierre",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el ajuste y la repetibilidad de la fuerza o presión de cierre (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la fuerza o presión de cierre en varios puntos (si aplica)<br>\n  2) Medir el valor resultante con instrumento independiente, por triplicado<br>\n  3) Verificar repetibilidad en el punto nominal<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La fuerza o presión responde al ajuste dentro de tolerancia.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de fuerza de cierre"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-013 — Verificación del agitador de tolva y alimentador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el giro y la velocidad del agitador de tolva y del alimentador (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el giro del agitador de tolva y del alimentador (si aplica)<br>\n  2) Medir la velocidad en los puntos de ajuste, por triplicado<br>\n  3) Verificar el sentido de giro contra lo especificado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Giro correcto con velocidad dentro de tolerancia.<br>\n  Sentido de giro conforme a especificación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del agitador y alimentador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-014 — Verificación del ajuste del volumen de dosificación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la respuesta y repetibilidad del ajuste del volumen de dosificación (altura del disco o de los pistones) al cambiarlo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar el volumen de dosificación en mínimo, medio y máximo<br>\n  2) Dosificar placebo y pesar el llenado resultante, por triplicado<br>\n  3) Verificar la respuesta del ajuste sin juego excesivo<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El llenado responde al ajuste dentro de tolerancia.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de volumen de dosificación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-015 — Verificación de fuerza de compactación del tamping",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de la fuerza de compactación del tamping (si aplica) frente a un patrón."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la fuerza de compactación indicada contra referencia (si aplica), por triplicado<br>\n  2) Registrar en varios puntos del rango<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La fuerza indicada está dentro de tolerancia.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de tamping"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-016 — Verificación de linealidad entre ajuste y peso de llenado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la linealidad entre el ajuste y el peso de llenado, con placebo en varios puntos del rango."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Variar el ajuste de dosificación en al menos cinco puntos del rango<br>\n  2) Dosificar placebo y pesar el llenado, por triplicado<br>\n  3) Ajustar la recta de regresión ajuste contra peso<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La relación es lineal dentro del criterio.<br>\n  Sin histéresis significativa."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curva de linealidad con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de linealidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-017 — Verificación de estabilidad del llenado en continuo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad del llenado en operación continua a cada velocidad probada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar en continuo a cada velocidad probada durante el tiempo definido<br>\n  2) Pesar el llenado a intervalos definidos<br>\n  3) Evaluar deriva y variabilidad<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El llenado se mantiene en banda sin deriva.<br>\n  La variabilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad de llenado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-018 — Verificación de balanza en línea o muestreador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de la balanza en línea o del muestreador (si aplica) frente a pesas patrón."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la balanza en línea con pesas patrón trazables en varios puntos (si aplica)<br>\n  2) Verificar el muestreador: toma en intervalos programados y representatividad (si aplica)<br>\n  3) Registrar por triplicado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La balanza está dentro de tolerancia en todos los puntos.<br>\n  El muestreador es representativo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de balanza o muestreador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Certificados de pesas patrón."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-019 — Verificación del mecanismo de rechazo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las cápsulas fuera de límites, vacías o mal cerradas se desvían al rechazo, con conteo correcto y sin que ninguna mala llegue al recipiente de buenas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inducir cápsulas malas de forma controlada (vacías, mal cerradas, fuera de peso)<br>\n  2) Verificar el desvío de cada una al recipiente de rechazo<br>\n  3) Verificar el conteo de rechazadas contra las inducidas<br>\n  4) Inspeccionar el recipiente de buenas: ninguna mala presente<br>\n  5) Procesar los datos crudos de conteo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de las cápsulas malas inducidas se rechaza.<br>\n  Ninguna mala llega al recipiente de buenas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de rechazo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de rechazo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-020 — Verificación del lazo de corrección automático",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la respuesta del lazo de corrección automático (si aplica) ante una variación inducida y su tiempo de corrección."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con placebo con el lazo activo (si aplica)<br>\n  2) Inducir una variación de peso y registrar la respuesta<br>\n  3) Medir el tiempo de corrección hasta retornar a la banda<br>\n  4) Verificar ausencia de oscilación sostenida<br>\n  5) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El lazo corrige dentro del tiempo especificado.<br>\n  Sin oscilación sostenida."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del lazo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del lazo de corrección"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema de control."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-021 — Verificación de extracción en cámara y desempolvador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la presión negativa y el caudal de extracción en la cámara de llenado y en el desempolvador."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la presión negativa en la cámara de llenado con instrumento calibrado<br>\n  2) Medir el caudal de extracción en los puntos definidos<br>\n  3) Verificar el desempolvador: operación y aspiración conectada<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Presión negativa y caudal dentro de lo especificado.<br>\n  Sin acumulación visible de polvo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de extracción con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de extracción"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-022 — Verificación del pulidor o desempolvador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el funcionamiento del pulidor o desempolvador (si aplica) y la ausencia de polvo residual sobre la cápsula."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con placebo y activar el pulidor o desempolvador (si aplica)<br>\n  2) Inspeccionar las cápsulas a la salida: ausencia de polvo residual<br>\n  3) Verificar elementos pulidores sin daño a las cápsulas<br>\n  4) Procesar los datos crudos de inspección en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las cápsulas salen sin polvo residual visible.<br>\n  Sin daño a las cápsulas por el pulido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del pulidor"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-023 — Verificación de integridad de filtros de extracción",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la integridad de los filtros de extracción (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar los filtros del sistema de extracción (si aplica) con su clasificación<br>\n  2) Verificar certificados y programa de recambio<br>\n  3) Verificar asentamiento sin bypass y diferencial con calibración vigente<br>\n  4) Procesar los datos crudos de diferencial en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los filtros corresponden a lo especificado con certificados vigentes.<br>\n  Diferencial dentro de rango sin bypass."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de filtros"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema de extracción."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-024 — Corrida con placebo a tres velocidades",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar una corrida con placebo a velocidad mínima, nominal y máxima: peso de llenado, cierre y rechazo dentro de lo esperado, sin alarmas ni desviaciones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Correr placebo a velocidad mínima registrando llenado, cierre y rechazo<br>\n  2) Repetir a velocidad nominal y a velocidad máxima<br>\n  3) Registrar alarmas e intervenciones<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Llenado, cierre y rechazo dentro de lo esperado a las tres velocidades.<br>\n  Sin alarmas ni desviaciones no justificadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de corrida con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de corrida con placebo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-EN-025",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-EN-025 — Cambio de ajuste con la máquina en marcha",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la respuesta estable ante un cambio de ajuste con la máquina en marcha."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con placebo de forma estable<br>\n  2) Cambiar el ajuste en escalones definidos sin detener la máquina<br>\n  3) Registrar el llenado resultante en cada escalón<br>\n  4) Verificar ausencia de saltos o inestabilidad<br>\n  5) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El llenado responde de forma estable y sin saltos.<br>\n  Los atributos se mantienen dentro de lo esperado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cambio de ajuste"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-001 — Verificación de parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia detiene el impulsor y el chopper en un tiempo seguro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con impulsor y chopper girando sin producto, accionar la parada de emergencia<br>\n  2) Medir el tiempo de detención de ambos<br>\n  3) Verificar el estado seguro sin rearranque espontáneo<br>\n  4) Restablecer y verificar el rearranque controlado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Impulsor y chopper se detienen dentro del tiempo especificado.<br>\n  No existe rearranque espontáneo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de parada de emergencia (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-002 — Verificación de interlocks",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que ni impulsor ni chopper giran con tapa abierta, cuba mal posicionada o sin bloquear, o válvula de descarga abierta durante el proceso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con la tapa abierta, intentar arrancar impulsor y chopper: no debe permitirlo<br>\n  2) Con la cuba mal posicionada o sin bloquear, intentar arrancar: no debe permitirlo<br>\n  3) Con la válvula de descarga abierta durante el proceso, verificar la acción del interlock<br>\n  4) Registrar cada interlock con su respuesta"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ningún interlock permite el giro en condición insegura.<br>\n  Ningún interlock puede puentearse sin herramienta o clave."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de interlocks con respuesta verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-003 — Verificación de alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma dispara y ejecuta su acción: sobrecorriente o sobrecarga del motor, falla del sello, alta temperatura, falla de aire de sello y sobrepresión de la cuba (si aplican)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular sobrecorriente o sobrecarga del motor y verificar alarma y protección<br>\n  2) Simular falla del sello y verificar la alarma<br>\n  3) Simular alta temperatura (si aplica sensor) y verificar la alarma<br>\n  4) Simular falla de aire de sello y sobrepresión de cuba (si aplican) y verificar cada alarma<br>\n  5) Verificar el registro en el histórico"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada alarma dispara ante su condición y ejecuta su acción.<br>\n  Todas quedan registradas en el histórico."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con disparo y acción verificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-004 — Verificación de falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el estado seguro ante falla de energía, sin arranque espontáneo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con impulsor y chopper girando, interrumpir la energía<br>\n  2) Verificar el estado seguro y la ausencia de arranque espontáneo al retornar<br>\n  3) Verificar el rearranque manual controlado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estado seguro sin arranque espontáneo.<br>\n  Rearranque manual controlado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de falla y recuperación de energía (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-005 — Verificación de exactitud de velocidad del impulsor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la velocidad del impulsor en mínimo, nominal y máximo frente a un tacómetro independiente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la velocidad mínima, nominal y máxima desde el control<br>\n  2) Medir cada punto con un tacómetro independiente calibrado, por triplicado<br>\n  3) Registrar la lectura del control y la del tacómetro<br>\n  4) Procesar los datos crudos de velocidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La velocidad indicada está dentro de tolerancia en los tres puntos.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de velocidades con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad del impulsor"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-006 — Verificación de velocidad del chopper",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la velocidad del chopper (si aplica) en las mismas condiciones que el impulsor."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la velocidad del chopper en mínimo, nominal y máximo (si aplica)<br>\n  2) Medir cada punto con instrumento independiente, por triplicado<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La velocidad está dentro de tolerancia en los tres puntos.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad del chopper"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-007 — Verificación de sentido de giro y rampas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el sentido de giro y las rampas de aceleración y desaceleración del impulsor y el chopper."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el sentido de giro de impulsor y chopper contra lo especificado<br>\n  2) Medir los tiempos de aceleración y desaceleración<br>\n  3) Verificar ausencia de golpes o vibración anormal en las rampas<br>\n  4) Procesar los datos crudos de tiempos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sentidos de giro correctos con rampas dentro de lo especificado.<br>\n  Sin anomalías durante las rampas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de rampas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-008 — Verificación dimensional de holguras impulsor-cuba y chopper-cuba",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar dimensionalmente la holgura impulsor-cuba y chopper-cuba."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la holgura impulsor-cuba en los puntos definidos con instrumento calibrado<br>\n  2) Medir la holgura chopper-cuba en los puntos definidos<br>\n  3) Comparar contra la especificación del fabricante<br>\n  4) Procesar los datos crudos dimensionales en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las holguras están dentro de especificación en todos los puntos.<br>\n  Sin roces ni desgaste anormal."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro dimensional con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de holguras"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-009 — Verificación de consumo de potencia o torque",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el consumo de potencia o torque en vacío y con carga inerte, con exactitud frente a un patrón. Es la señal que muchas plantas usan como punto final."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la potencia o torque en vacío a las velocidades de uso<br>\n  2) Registrar con carga inerte a las velocidades de uso<br>\n  3) Verificar la exactitud de la lectura frente a un patrón<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La lectura es exacta frente al patrón en vacío y con carga.<br>\n  La señal es estable y repetible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de potencia con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de potencia o torque"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-010 — Verificación de vibración, ruido y temperatura",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar vibración, ruido y temperatura del motor y reductor (si aplica medición)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar a velocidad nominal y registrar vibración y ruido (si aplica)<br>\n  2) Medir la temperatura del motor y reductor tras la estabilización<br>\n  3) Comparar contra los límites del fabricante<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vibración, ruido y temperatura dentro de lo esperado.<br>\n  Sin puntos calientes ni ruidos anormales."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de vibración y temperatura"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-011 — Verificación del sello del eje y aire de sello",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el sello del eje: sin fugas de producto ni de aire, con presión de aire de sello en rango (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar el sello del eje: ausencia de fugas de producto y de aire<br>\n  2) Medir la presión del aire de sello y verificar que está en rango (si aplica)<br>\n  3) Verificar el fluido de barrera si lo hay: nivel y conexiones<br>\n  4) Procesar los datos crudos de presión en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin fugas en el sello del eje.<br>\n  La presión de aire de sello está en rango."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del sello"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-012 — Verificación de exactitud del caudal de aglutinante",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud del caudal de la bomba o línea de líquido en el rango de uso, con agua, en varios puntos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar el caudal en varios puntos del rango de uso<br>\n  2) Medir el caudal real con agua por método gravimétrico o volumétrico, por triplicado<br>\n  3) Registrar el ajuste contra el caudal medido<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El caudal está dentro de tolerancia en todos los puntos.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de caudales con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de caudal"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la bomba."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-013 — Verificación de boquilla de adición y patrón de aspersión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el tipo y la posición de la boquilla o del tubo de adición: patrón de aspersión y punto de impacto sobre el lecho."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el tipo de boquilla instalada y su posición contra el diseño<br>\n  2) Verificar el patrón de aspersión con agua sobre superficie de prueba<br>\n  3) Verificar el punto de impacto sobre el lecho<br>\n  4) Procesar los datos crudos de cobertura en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El patrón de aspersión es uniforme y cubre el lecho.<br>\n  La posición corresponde al diseño."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de aspersión"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-014 — Verificación de repetibilidad del caudal entre corridas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la repetibilidad del caudal entre corridas y su estabilidad durante la adición."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar adiciones de agua de igual duración en corridas sucesivas<br>\n  2) Registrar el caudal durante cada adición a intervalos definidos<br>\n  3) Evaluar la estabilidad intra-adición y la repetibilidad entre corridas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El caudal es estable durante la adición.<br>\n  La repetibilidad entre corridas cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de repetibilidad de caudal"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la bomba."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-015 — Verificación de presión del aire de atomización",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la presión del aire de atomización (si hay boquilla neumática)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la presión del aire de atomización en el rango de uso (si aplica boquilla neumática)<br>\n  2) Medir la presión real con instrumento independiente, por triplicado<br>\n  3) Verificar estabilidad durante la aspersión<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La presión está dentro de tolerancia y es estable.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de aire de atomización"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-016 — Verificación del control de temperatura de la camisa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el control de temperatura de la camisa (si aplica): exactitud, velocidad de calentamiento y enfriamiento con agua, a volumen mínimo y máximo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Estabilizar con agua a volumen mínimo y verificar exactitud en setpoints definidos (si aplica camisa)<br>\n  2) Registrar las curvas de calentamiento y enfriamiento a volumen mínimo y máximo<br>\n  3) Calcular velocidades y estabilidad<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud dentro de tolerancia a ambos volúmenes.<br>\n  Velocidades de calentamiento y enfriamiento según lo especificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis térmico de camisa"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-017 — Verificación del sistema de vacío o presión de la cuba",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el sistema de vacío o presión de la cuba (si aplica): nivel alcanzable y prueba de fuga."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Evacuar o presurizar la cuba (si aplica) hasta el nivel de prueba<br>\n  2) Registrar el nivel alcanzable contra lo especificado<br>\n  3) Aislar y ejecutar la prueba de fuga con registro a intervalos<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El nivel alcanzable cumple lo especificado.<br>\n  La fuga no supera el límite."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de vacío o presión"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-018 — Verificación de inertización con nitrógeno",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la inertización con nitrógeno (si se usa): caudal y sensor de O₂."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar el caudal de nitrógeno en el rango de uso (si aplica inertización)<br>\n  2) Medir el caudal real y registrar la lectura del sensor de O₂<br>\n  3) Verificar que el O₂ baja al nivel especificado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El caudal está dentro de tolerancia.<br>\n  El O₂ alcanza el nivel especificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de inertización"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-019 — Verificación de suministros en rango operativo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el suministro de aire comprimido, agua y electricidad en rango operativo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la presión del aire comprimido en operación<br>\n  2) Verificar el suministro de agua (presión y caudal si aplica)<br>\n  3) Verificar el voltaje de alimentación en operación<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los suministros están dentro de su rango operativo.<br>\n  Sin caídas fuera de rango durante la operación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de suministros"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-020 — Calibración de celdas de carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar las celdas de carga (si aplican): calibración con pesas patrón en varios niveles."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Calibrar las celdas de carga con pesas patrón trazables en varios niveles (si aplican)<br>\n  2) Registrar la indicación contra el patrón, por triplicado<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La indicación está dentro de tolerancia en todos los niveles.<br>\n  Las pesas cuentan con certificado vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de calibración con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de celdas de carga"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Certificados de pesas patrón."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-021 — Verificación de válvula de descarga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la válvula de descarga: apertura, cierre, estanqueidad y ausencia de retención de material."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar la válvula de descarga: apertura y cierre completos<br>\n  2) Verificar estanqueidad con la válvula cerrada<br>\n  3) Descargar placebo y verificar ausencia de retención de material<br>\n  4) Procesar los datos crudos de retención en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Apertura y cierre completos con estanqueidad.<br>\n  Sin retención de material fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de descarga"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-022 — Verificación del molino de descarga o calibrador integrado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el molino de descarga o calibrador integrado (si aplica): velocidad, malla y sentido de giro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la velocidad del molino contra lo especificado (si aplica)<br>\n  2) Verificar la malla instalada: tipo, número e integridad<br>\n  3) Verificar el sentido de giro<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Velocidad y sentido correctos con malla íntegra.<br>\n  La malla instalada corresponde a la especificada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del molino"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-023 — Corrida con placebo a volumen mínimo y máximo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar una corrida con polvo placebo al volumen mínimo y máximo: mezcla en seco, adición de líquido y amasado, sin alarmas ni desviaciones, con movimiento del lecho e impulsor cubierto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Correr placebo al volumen mínimo: mezcla en seco, adición y amasado<br>\n  2) Correr placebo al volumen máximo con la misma secuencia<br>\n  3) Verificar visualmente el movimiento del lecho y que el impulsor no quede descubierto<br>\n  4) Registrar alarmas e intervenciones<br>\n  5) Procesar los datos crudos de potencia en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ambas corridas se completan sin alarmas ni desviaciones no justificadas.<br>\n  Movimiento del lecho adecuado con impulsor cubierto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de corrida con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de corrida con placebo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-GR-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-GR-024 — Perfil de potencia con placebo y agua",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el perfil de potencia con placebo y agua: la señal responde a la adición y es repetible entre corridas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el perfil de potencia durante la adición de agua al placebo<br>\n  2) Repetir en corridas sucesivas<br>\n  3) Comparar la forma y los valores entre corridas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La señal responde a la adición de forma consistente.<br>\n  Los perfiles son repetibles entre corridas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Perfiles de potencia con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de perfil de potencia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-001 — Verificación de parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia detiene el bombo, el spray y la calefacción de forma segura."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con bombo girando, spray y calefacción activos sin producto, accionar la parada de emergencia<br>\n  2) Verificar la detención del bombo y el corte de spray y calefacción<br>\n  3) Verificar el estado seguro sin rearranque espontáneo<br>\n  4) Restablecer y verificar el rearranque controlado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Bombo, spray y calefacción se detienen o cortan correctamente.<br>\n  No existe rearranque espontáneo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de parada de emergencia (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-002 — Verificación de interlocks",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que no hay spray sin flujo de aire, ni calefacción sin ventilador, ni giro del bombo con la puerta abierta, y el modo de giro lento (inching) para carga y limpieza."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con la puerta abierta, intentar girar el bombo: no debe permitirlo<br>\n  2) Sin flujo de aire, intentar activar el spray: no debe permitirlo<br>\n  3) Sin ventilador, intentar activar la calefacción: no debe permitirlo<br>\n  4) Verificar el modo de giro lento (inching) para carga y limpieza<br>\n  5) Registrar cada interlock con su respuesta"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los interlocks impiden la condición insegura.<br>\n  El inching opera solo en su modo previsto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de interlocks con respuesta verificada (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-003 — Verificación de alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma dispara y ejecuta su acción: alta temperatura de entrada, bajo flujo de aire, falla de bomba, baja presión de atomización, pistola obstruida, alto ΔP del filtro y sobrecorriente del motor (si aplican)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular cada condición de alarma aplicable y verificar disparo y acción<br>\n  2) Verificar la alarma de pistola obstruida (si aplica detección)<br>\n  3) Verificar la alarma de alto ΔP del filtro<br>\n  4) Verificar el registro de cada alarma en el histórico"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada alarma dispara ante su condición y ejecuta su acción.<br>\n  Todas quedan registradas en el histórico."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con disparo y acción verificados (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-004 — Verificación de falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el estado seguro ante falla de energía, sin arranque espontáneo y con corte inmediato del spray."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con el equipo en operación simulada, interrumpir la energía<br>\n  2) Verificar el corte inmediato del spray y el estado seguro<br>\n  3) Restablecer y verificar que no hay arranque espontáneo<br>\n  4) Verificar el rearranque manual controlado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Corte inmediato del spray ante la falla.<br>\n  Sin arranque espontáneo al retornar la energía."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de falla y recuperación de energía (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-005 — Verificación de exactitud de velocidad del bombo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la velocidad del bombo en mínimo, nominal y máximo frente a un tacómetro independiente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar la velocidad mínima, nominal y máxima desde el control<br>\n  2) Medir cada punto con un tacómetro independiente calibrado, por triplicado<br>\n  3) Registrar la lectura del control y la del tacómetro<br>\n  4) Procesar los datos crudos de velocidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La velocidad indicada está dentro de tolerancia en los tres puntos.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de velocidades con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad del bombo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-006 — Verificación de sentido de giro, rampas y parada",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el sentido de giro (recubrimiento y descarga), las rampas y la parada del bombo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar el sentido de giro de recubrimiento y el de descarga<br>\n  2) Medir los tiempos de aceleración y parada<br>\n  3) Verificar ausencia de golpes o vibración anormal<br>\n  4) Procesar los datos crudos de tiempos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sentidos de giro correctos con rampas y parada dentro de lo especificado.<br>\n  Sin anomalías."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de giro y rampas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-007 — Verificación de corriente del motor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la corriente del motor con carga inerte mínima y máxima, sin picos anormales."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con carga inerte mínima y registrar la corriente estable y de arranque<br>\n  2) Operar con carga inerte máxima y registrar la corriente<br>\n  3) Comparar contra la corriente nominal de placa<br>\n  4) Verificar ausencia de picos anormales"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La corriente no supera la nominal de placa.<br>\n  Sin picos anormales en operación estable."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de corrientes (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Placa del motor del bombo."
     }
    ],
    "tabla": null,
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-008 — Verificación de vibración, ruido y sellos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar vibración y ruido (si aplica medición), y el estado de los sellos del bombo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar a velocidad nominal y registrar vibración y ruido (si aplica)<br>\n  2) Inspeccionar los sellos del bombo: integridad y ausencia de fugas<br>\n  3) Comparar contra los límites del fabricante"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vibración y ruido dentro de lo esperado.<br>\n  Sellos íntegros sin fugas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de vibración y sellos (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-009 — Verificación de flujo de aire y relación ventilador-caudal",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el flujo de aire de entrada y de escape en mínimo, nominal y máximo, y la relación frecuencia del ventilador contra caudal."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar el ventilador en mínimo, nominal y máximo<br>\n  2) Medir el caudal de entrada y de escape en cada punto, por triplicado<br>\n  3) Determinar la relación frecuencia contra caudal<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los caudales cumplen lo especificado en los tres puntos.<br>\n  La relación frecuencia-caudal es consistente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de caudales con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de flujo de aire"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-010 — Verificación del control de temperatura del aire de entrada",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el control de temperatura del aire de entrada: exactitud, estabilidad y sobreimpulso en setpoints bajo, medio y alto, y tiempo de respuesta."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Estabilizar en setpoint bajo, medio y alto del rango de proceso<br>\n  2) Medir exactitud contra patrón, estabilidad y sobreimpulso en cada punto<br>\n  3) Medir el tiempo de respuesta ante cambio de setpoint<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud dentro de tolerancia en los tres setpoints.<br>\n  Sobreimpulso y tiempo de respuesta dentro de lo especificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros térmicos con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de control de temperatura"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-011 — Verificación del control de humedad del aire de entrada",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el control de humedad o punto de rocío del aire de entrada (si hay deshumidificación)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar el sistema de deshumidificación (si aplica) en sus puntos de ajuste<br>\n  2) Medir la humedad o punto de rocío con instrumento independiente, por triplicado<br>\n  3) Verificar estabilidad en cada punto<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La humedad o punto de rocío está dentro de tolerancia.<br>\n  Estabilidad dentro de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de humedad del aire"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema de tratamiento de aire."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-012 — Verificación de presión diferencial del bombo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la presión diferencial (ligeramente negativa) en el bombo y su alarma de desvío."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar el bombo con extracción nominal y medir el diferencial<br>\n  2) Verificar que se mantiene ligeramente negativo de forma estable<br>\n  3) Forzar el desvío y verificar la alarma<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El diferencial se mantiene en la banda especificada.<br>\n  La alarma de desvío dispara correctamente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de diferencial"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-013 — Verificación de limpieza o sacudido de filtros de escape",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la secuencia de limpieza o sacudido de filtros de escape: secuencia, tiempos y respuesta ante alto ΔP."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la secuencia programada de limpieza o sacudido<br>\n  2) Medir los tiempos de cada etapa<br>\n  3) Simular alto ΔP y verificar la respuesta del sistema<br>\n  4) Verificar el diferencial antes y después del ciclo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La secuencia y los tiempos corresponden a lo programado.<br>\n  El diferencial se recupera tras el ciclo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de limpieza de filtros (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-014 — Verificación de exactitud del caudal de spray",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la calibración y exactitud del caudal de la bomba en el rango de uso, con agua, en varios puntos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar el caudal en varios puntos del rango de uso<br>\n  2) Medir el caudal real con agua por método gravimétrico o volumétrico, por triplicado<br>\n  3) Registrar el ajuste contra el caudal medido<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El caudal está dentro de tolerancia en todos los puntos.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de caudales con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de caudal de spray"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la bomba."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-015 — Verificación de presiones de atomización y patrón",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la presión del aire de atomización y de patrón (abanico) en cada pistola, con repetibilidad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ajustar las presiones de atomización y patrón en cada pistola<br>\n  2) Medir con instrumento independiente, por triplicado por pistola<br>\n  3) Verificar repetibilidad entre pistolas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las presiones están dentro de tolerancia en cada pistola.<br>\n  La repetibilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de presiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-016 — Verificación del patrón de spray con agua",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el patrón de spray con agua: ancho, forma y uniformidad de las pistolas, y ausencia de goteo al cerrar."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Asperjar agua sobre superficie de prueba con cada pistola<br>\n  2) Medir el ancho y evaluar la forma y uniformidad del patrón<br>\n  3) Cerrar y verificar ausencia de goteo durante el tiempo definido<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El patrón es uniforme con ancho dentro de especificación.<br>\n  Sin goteo al cerrar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de patrones con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de patrón de spray"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-017 — Verificación de posición documentada de pistolas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la posición de las pistolas: distancia y ángulo respecto al lecho, y separación entre ellas. Debe quedar documentada y reproducible."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la distancia y el ángulo de cada pistola respecto al lecho<br>\n  2) Medir la separación entre pistolas (si hay más de una)<br>\n  3) Documentar las posiciones con croquis acotado<br>\n  4) Desmontar y remontar verificando reproducibilidad<br>\n  5) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las posiciones están dentro de lo definido y documentadas.<br>\n  La posición es reproducible tras desmontar y remontar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Croquis acotado con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de posición de pistolas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-018 — Verificación de distribución del caudal entre pistolas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la distribución del caudal entre pistolas (si hay más de una)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el caudal individual de cada pistola con agua (si hay más de una)<br>\n  2) Calcular la participación porcentual de cada una<br>\n  3) Comparar contra el criterio de uniformidad de reparto"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El reparto entre pistolas está dentro del criterio.<br>\n  Sin pistola con caudal significativamente distinto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de reparto entre pistolas (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-019 — Verificación de agitación y recirculación del tanque",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la agitación del tanque de suspensión y la recirculación (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar la agitación del tanque: operación continua sin zonas muertas visibles<br>\n  2) Verificar la recirculación (si aplica): caudal y retorno al tanque<br>\n  3) Verificar ausencia de sedimentación en el tiempo de espera definido<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Agitación continua sin zonas muertas.<br>\n  Sin sedimentación en el tiempo de espera definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de agitación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-020 — Verificación de repetibilidad del caudal entre corridas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la repetibilidad del caudal entre corridas y su estabilidad durante la aspersión."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar aspersiones de agua de igual duración en corridas sucesivas<br>\n  2) Registrar el caudal durante cada aspersión a intervalos definidos<br>\n  3) Evaluar estabilidad intra-aspersión y repetibilidad entre corridas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El caudal es estable durante la aspersión.<br>\n  La repetibilidad entre corridas cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de repetibilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la bomba."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-021",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-021 — Mapeo de temperatura del aire en el bombo vacío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear la temperatura del aire en el bombo vacío con termopares en varios puntos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Instalar termopares calibrados en los puntos definidos del bombo vacío<br>\n  2) Mapear en el setpoint de rutina durante el tiempo definido<br>\n  3) Determinar la dispersión entre puntos<br>\n  4) Procesar los datos crudos de mapeo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La dispersión entre puntos no supera el límite especificado.<br>\n  Sin puntos fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Mapa de temperatura con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de mapeo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-022",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-022 — Correlación de temperaturas con carga inerte",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la correlación entre temperatura de entrada, de escape y del lecho con carga inerte."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar con carga inerte registrando entrada, escape y lecho<br>\n  2) Variar la entrada en el rango de uso y registrar las respuestas<br>\n  3) Establecer la correlación entre las tres temperaturas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La correlación es consistente y reproducible.<br>\n  Las tres temperaturas responden según lo esperado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de correlación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de correlación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-023",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-023 — Capacidad de evaporación (techo de velocidad de spray)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Determinar la capacidad de evaporación: aspersión de agua al caudal máximo declarado con carga inerte, verificando que el escape no se satura ni cambia el comportamiento del lecho. Es el ensayo que fija el techo real de velocidad de spray."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Asperjar agua al caudal máximo declarado con carga inerte<br>\n  2) Registrar la humedad o temperatura del escape durante la aspersión<br>\n  3) Verificar que el escape no se satura y el lecho no cambia su comportamiento<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Al caudal máximo el escape no se satura.<br>\n  El lecho mantiene su comportamiento (sin sobrehumectación)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de capacidad con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de capacidad de evaporación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-RB-024",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-RB-024 — Corrida con placebo a carga mínima y máxima",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar una corrida completa con tabletas placebo y agua a carga mínima y máxima: movimiento del lecho, ausencia de pegado, rotura o erosión, sin alarmas ni desviaciones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Correr placebo con agua a carga mínima registrando el comportamiento del lecho<br>\n  2) Correr placebo con agua a carga máxima<br>\n  3) Inspeccionar pegado, rotura o erosión en ambas cargas<br>\n  4) Registrar alarmas e intervenciones<br>\n  5) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Movimiento del lecho adecuado en ambas cargas.<br>\n  Sin pegado, rotura, erosión, alarmas ni desviaciones no justificadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de corrida con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de corrida con placebo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación de la recubridora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO OQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Operación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Operación con las áreas involucradas, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar el inicio de la PQ.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Operación: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en el entorno seleccionado (USP &lt;1058&gt;).</p>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-001 — Parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada parada de emergencia del <span class=\"equipo\">equipo</span> detiene de inmediato el ventilador, la calefacción y los movimientos, exige rearme manual y señaliza el estado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar IQ aprobada y <span class=\"equipo\">equipo</span> liberado para OQ; identificar todas las paradas de emergencia (panel principal y perimetrales) y anotar su ubicación en la tabla<br>\n  2) Avisar a los operadores del área que se ejecutará la prueba y disponer de cronómetro y formato de registro<br>\n  3) Arrancar el <span class=\"equipo\">equipo</span> y llevarlo a marcha nominal con ventilador y calefacción activos según el setpoint medio del BMR<br>\n  4) Accionar la parada de emergencia y medir con cronómetro el tiempo hasta la detención total del ventilador y el corte de la calefacción<br>\n  a) El tiempo medido es menor o igual a 3 segundos<br>\n  b) El HMI muestra el mensaje \"EMERGENCY STOP ACTIVE\" o equivalente<br>\n  5) Sin rearmar, intentar arrancar desde el HMI y confirmar que el arranque queda impedido<br>\n  6) Rearmar la parada según el procedimiento del fabricante y confirmar que el <span class=\"equipo\">equipo</span> queda en condición segura sin arrancar solo<br>\n  7) Repetir los pasos 3) a 6) por cada parada de emergencia del <span class=\"equipo\">equipo</span><br>\n  8) Dejar el <span class=\"equipo\">equipo</span> en condición segura y anotar cualquier desviación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las paradas detienen el ventilador y la calefacción en 3 segundos o menos.<br>\n  Sin rearme manual el arranque es imposible y el estado queda señalizado en el HMI."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de paradas de emergencia con ubicación y tiempos medidos<br>\n  - Registro de mensajes del HMI por cada prueba"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; GAMP5 2.ª ed. (challenge de funciones de seguridad)."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-002 — Interlocks de proceso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el <span class=\"equipo\">equipo</span> impide el arranque o detiene la operación ante cada condición insegura (contenedor, filtros, puerta, ventilador y calefacción)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Dejar el <span class=\"equipo\">equipo</span> detenido en condición segura y disponer de la matriz de interlocks (condición y respuesta esperada)<br>\n  2) Desinflar el gasket del contenedor e intentar arrancar el ciclo<br>\n  a) El arranque queda inhibido y el HMI muestra el mensaje de interlock<br>\n  3) Desplazar el contenedor de su posición e intentar arrancar<br>\n  a) El arranque queda inhibido y el HMI muestra el mensaje de interlock<br>\n  4) Retirar una manga o filtro e intentar arrancar<br>\n  a) El arranque queda inhibido y el HMI muestra el mensaje de interlock<br>\n  5) Abrir la puerta de la cámara e intentar arrancar<br>\n  a) El arranque queda inhibido y el HMI muestra el mensaje de interlock<br>\n  6) Con el ventilador detenido, demandar calefacción y confirmar que la calefacción no energiza<br>\n  7) Arrancar en condición normal, abrir la puerta durante la marcha y confirmar la detención del ciclo<br>\n  8) Restituir todas las condiciones a normal, confirmar marcha permitida y cerrar la matriz con hora y respuesta de cada prueba"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de los interlocks ensayados inhibe el arranque o detiene la marcha con mensaje en el HMI.<br>\n  La calefacción no energiza sin ventilador en marcha."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de interlocks con condición provocada, respuesta del equipo y mensaje del HMI"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>GAMP5 2.ª ed.; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-003 — Alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma del <span class=\"equipo\">equipo</span> dispara en su límite configurado y ejecuta su acción asociada (alta temperatura de entrada, alta temperatura de producto, alto ΔP en filtros y bajo flujo de aire)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar las alarmas con su límite configurado según el HMI y el BMR, y confirmar calibración vigente de los sensores asociados<br>\n  2) Disponer de cronómetro y formato con columnas: alarma, límite, hora del evento, tiempo de respuesta, acción ejecutada y acuse<br>\n  3) Forzar o simular alta temperatura de entrada por encima del límite y confirmar alarma visual y audible, corte o inhibición de la calefacción y registro en el histórico<br>\n  a) El tiempo entre el evento y la alarma es menor a 5 segundos<br>\n  4) Simular alta temperatura de producto por encima del límite del BMR y confirmar la alarma y su acción configurada<br>\n  5) Simular alto diferencial de presión en filtros por encima del límite del fabricante y confirmar el aviso o la alarma según el diseño<br>\n  6) Bajar la consigna de flujo bajo el mínimo y confirmar la alarma con inhibición de la calefacción<br>\n  7) Acusar cada alarma, verificar que el acuse queda registrado, normalizar la condición y confirmar el retorno a operación<br>\n  8) Verificar en el histórico y el audit trail que las alarmas quedaron registradas con fecha, hora y acuse, y devolver los setpoints a sus valores aprobados"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de las alarmas dispara en su límite, ejecuta su acción en menos de 5 segundos y queda registrada con acuse."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con límite, acción, tiempo de respuesta y acuse<br>\n  - Extracto del histórico de alarmas del HMI"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; USP &lt;1058&gt; (sensores asociados)."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-004 — Falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que ante un corte de energía el <span class=\"equipo\">equipo</span> queda en estado seguro, no rearranca solo y los datos del proceso se conservan íntegros."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Poner el <span class=\"equipo\">equipo</span> en marcha nominal con la receta de prueba cargada y coordinar el corte con mantenimiento y eléctrica<br>\n  2) Interrumpir la alimentación principal (real o simulada según el procedimiento de planta) y anotar la hora exacta del evento<br>\n  3) Confirmar el estado seguro: calefacción desenergizada, alarmas correspondientes activas y posición de dampers según el diseño<br>\n  4) Esperar 5 minutos sin energía<br>\n  5) Restablecer la energía y confirmar que el <span class=\"equipo\">equipo</span> no rearranca solo y exige una acción deliberada del operador en el HMI<br>\n  6) Rearrancar manualmente y confirmar la operación normal del ciclo<br>\n  7) Revisar el lote de datos: receta, registros de proceso, audit trail y alarmas, confirmando continuidad sin corrupción ni huecos injustificados según ALCOA+<br>\n  8) Anexar el registro del evento y la verificación de datos al protocolo, documentando las desviaciones si las hubo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Al corte el equipo queda en estado seguro; no hay rearranque automático.<br>\n  Los datos del proceso están íntegros y trazables tras la recuperación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del evento de corte y recuperación con horas<br>\n  - Verificación de integridad de datos (receta, registros, audit trail)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>GAMP5 2.ª ed.; EU GMP Anexo 15; 21 CFR Part 11 (datos)."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-005 — Flujo de aire y curva del ventilador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el caudal de aire en mínimo, nominal y máximo, y establecer la relación entre la frecuencia del ventilador y el caudal del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Disponer de anemómetro o tubo Pitot con calibración vigente cuyo rango cubra el caudal del <span class=\"equipo\">equipo</span>, e identificar el punto de medición en el ducto de impulsión según el plano<br>\n  2) Poner el <span class=\"equipo\">equipo</span> en marcha sin producto, con los dampers en posición de trabajo, y disponer del formato frecuencia contra caudal<br>\n  3) Fijar el variador en la frecuencia del caudal mínimo, esperar estabilización de 5 minutos como mínimo y tomar 3 lecturas de caudal<br>\n  4) Repetir la medición en caudal nominal y en caudal máximo, con 3 lecturas en cada punto<br>\n  5) Tomar 2 puntos intermedios adicionales hasta completar 5 puntos como mínimo de frecuencia contra caudal<br>\n  6) Calcular el promedio y el RSD por punto<br>\n  a) El RSD de cada punto es menor o igual a 5%<br>\n  7) Graficar la curva frecuencia contra caudal y confirmar que es monótona creciente y que los 3 puntos están dentro de la especificación del fabricante ±5%<br>\n  8) Archivar la curva como referencia para la PQ<br>\n  9) Procesar los datos crudos de caudal de aire y curva del ventilador en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los caudales mínimo, nominal y máximo están dentro de la especificación del fabricante ±5% con RSD ≤5%.<br>\n  La curva frecuencia contra caudal queda documentada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de frecuencia contra caudal con promedios y RSD<br>\n  - Gráfica de la curva del ventilador<br>\n  - Certificado del instrumento de medición<br>\n  - Data cruda y reporte estadístico del análisis de caudal de aire y curva del ventilador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-006 — Control de temperatura del aire de entrada",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud, la estabilidad y el tiempo de respuesta del lazo de temperatura del aire de entrada del <span class=\"equipo\">equipo</span> en setpoints bajo, medio y alto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ubicar el sensor patrón calibrado (exactitud igual o mejor a ±0,2 °C) junto al sensor del <span class=\"equipo\">equipo</span>, sin contacto con superficies calientes, y fijar el caudal nominal durante toda la prueba<br>\n  2) Fijar el setpoint bajo, esperar estabilización hasta obtener 3 lecturas consecutivas del patrón dentro de ±0,3 °C en 10 minutos, y registrar equipo contra patrón<br>\n  a) La diferencia entre el equipo y el patrón es menor o igual a ±0,5 °C<br>\n  3) Mantener el setpoint bajo 30 minutos registrando cada 5 minutos<br>\n  a) La variación durante la estabilidad es menor o igual a ±1 °C<br>\n  4) Repetir los pasos 2) y 3) en setpoint medio y en setpoint alto<br>\n  5) Desde el setpoint bajo estable, cambiar al setpoint alto y medir con cronómetro el tiempo hasta que el patrón esté dentro de ±1 °C del nuevo setpoint, registrando la curva de temperatura contra tiempo<br>\n  6) Devolver el setpoint al valor de reposo aprobado y anexar los gráficos y la tabla de exactitud<br>\n  7) Procesar los datos crudos de temperatura del aire de entrada en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud ±0,5 °C en los tres setpoints; estabilidad ±1 °C durante 30 minutos.<br>\n  Tiempo de respuesta menor o igual al declarado por el fabricante (registrar el valor y su fuente antes de iniciar)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de exactitud equipo contra patrón en 3 setpoints<br>\n  - Gráficos de temperatura contra tiempo y de tiempo de respuesta<br>\n  - Certificado del sensor patrón<br>\n  - Data cruda y reporte estadístico del análisis de temperatura del aire de entrada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-007 — Control de humedad del aire de entrada (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el control de humedad o punto de rocío del aire de entrada cuando el <span class=\"equipo\">equipo</span> cuenta con deshumidificación; si no cuenta con ella, declarar No Aplica con justificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar en el diseño si el <span class=\"equipo\">equipo</span> cuenta con sistema de deshumidificación; si no existe, pasar al paso 6)<br>\n  2) Disponer del higrómetro patrón calibrado en el ducto de entrada y fijar el setpoint de receta<br>\n  3) Esperar estabilización de 15 minutos como mínimo<br>\n  4) Registrar la humedad relativa o el punto de rocío cada 5 minutos durante 30 minutos<br>\n  a) La variación durante la estabilidad está dentro de ±3% HR<br>\n  5) Provocar una desviación cambiando el setpoint ±10%, confirmar la alarma de desviación de humedad y normalizar verificando el retorno<br>\n  6) Con sistema: anexar el registro de humedad contra tiempo; sin sistema: redactar la justificación de No Aplica indicando que el equipo no cuenta con deshumidificación y que el parámetro no existe en el diseño, con firma del ejecutor y del revisor<br>\n  7) Cuando aplique este ensayo, procesar los datos crudos de humedad del aire de entrada en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Con sistema: estabilidad ±3% HR y alarma de desviación operativa.<br>\n  Sin sistema: No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de humedad contra tiempo o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de humedad del aire de entrada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-008 — Presión diferencial de la cámara de producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la presión negativa o diferencial de la cámara de producto del <span class=\"equipo\">equipo</span> según el diseño, incluyendo su recuperación y su alarma."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Conectar el manómetro diferencial calibrado a la toma de la cámara y al ambiente, verificando mangueras sin fugas ni dobleces, con puertas cerradas y el <span class=\"equipo\">equipo</span> en marcha nominal<br>\n  2) Registrar el ΔP cada 5 minutos durante 30 minutos en marcha nominal<br>\n  a) El 100% de las lecturas está dentro de la especificación de diseño (registrar el rango de ΔP y su fuente antes de iniciar)<br>\n  3) Abrir la puerta 10 segundos y cerrarla, midiendo el tiempo de recuperación del ΔP<br>\n  4) Simular la pérdida del diferencial según el diseño y confirmar la alarma correspondiente<br>\n  5) Normalizar, confirmar el retorno del ΔP y el silencio de la alarma<br>\n  6) Anexar la tabla de ΔP por condición con el instrumento utilizado y su certificado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  ΔP dentro de la especificación en marcha nominal, con recuperación tras apertura y alarma operativa."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de ΔP por condición (nominal, apertura, pérdida simulada)<br>\n  - Certificado del manómetro diferencial"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; OMS TRS 1010 Anexo 7 (contención)."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-009 — Sistema de sacudido de filtros",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la secuencia, los tiempos y los intervalos del sacudido de mangas del <span class=\"equipo\">equipo</span>, y la recuperación del diferencial de presión."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Copiar del manual y del HMI la secuencia diseñada de válvulas o solenoides con sus setpoints de tiempo ON e intervalo<br>\n  2) Disponer de cronómetro y formato con columnas: válvula, orden, tiempo medido en 3 ciclos<br>\n  3) En modo manual, disparar un sacudido y confirmar que cada válvula actúa en el orden diseñado<br>\n  4) En modo automático, dejar correr 3 ciclos completos midiendo tiempos ON e intervalos por válvula<br>\n  a) Los tiempos medidos están dentro de ±10% del setpoint<br>\n  5) Medir el ΔP de los filtros antes y después del sacudido y confirmar su recuperación tras cada ciclo<br>\n  6) Observar el lecho durante el sacudido y confirmar que la fluidización no se interrumpe de forma anormal<br>\n  7) Dejar el modo automático o de reposo según el procedimiento y anexar la tabla de tiempos medidos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Secuencia igual al diseño; tiempos ±10% del setpoint; el ΔP se recupera tras el sacudido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de secuencia y tiempos medidos por válvula<br>\n  - Registros de ΔP antes y después del sacudido"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-010 — Sellado del gasket inflable con retención de presión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el sellado del contenedor mediante el gasket inflable, su retención de presión y su interlock con la marcha del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Posicionar el contenedor e inspeccionar visualmente el gasket (sin grietas ni deformaciones); disponer del manómetro del circuito de sellado calibrado y legible<br>\n  2) Inflar el gasket a la presión de trabajo, registrarla y aislar el circuito cerrando la alimentación<br>\n  3) Medir la caída de presión durante 10 minutos registrando hora y presión<br>\n  a) La caída de presión es menor o igual a 0,1 bar<br>\n  4) Con el gasket desinflado, intentar arrancar y confirmar que la marcha queda inhibida con mensaje en el HMI<br>\n  5) Sangrar hasta quedar bajo la presión mínima y confirmar la alarma de baja presión de sellado<br>\n  6) Re-inflar a la presión de trabajo y confirmar el permiso de marcha<br>\n  7) Anexar el registro de retención y dejar constancia del estado del gasket (apto o reporte de reemplazo)"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Retención de presión dentro del límite; sin sellado no hay marcha; alarma de baja presión operativa."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de retención de presión con hora y lecturas<br>\n  - Constancia del estado del gasket"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; GAMP5 2.ª ed. (interlock)."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-LF-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-011 — Posicionamiento y bloqueo del contenedor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el posicionamiento correcto y el bloqueo mecánico del contenedor como condición para la marcha del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Disponer del contenedor vacío y limpio, identificar los sensores o switches de posición y de bloqueo con sus señales en el HMI, y preparar la matriz de 4 casos<br>\n  2) Caso 1: posicionar el contenedor visiblemente descentrado e intentar arrancar<br>\n  a) La marcha queda inhibida<br>\n  3) Caso 2: centrar correctamente sin activar el bloqueo e intentar arrancar<br>\n  a) La marcha queda inhibida<br>\n  4) Caso 3: centrar y bloquear, confirmar en el HMI las señales de contenedor en posición y bloqueo activo, y confirmar que la marcha se permite<br>\n  5) Caso 4: con el <span class=\"equipo\">equipo</span> en marcha nominal sin producto, simular el desbloqueo según lo permita el diseño sin riesgo y confirmar la detención o inhibición inmediata<br>\n  6) Registrar cada caso con hora, acción ejecutada y respuesta del <span class=\"equipo\">equipo</span><br>\n  7) Dejar el contenedor bloqueado o según indique el procedimiento de reposo, y cerrar la matriz con firma"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La marcha solo se permite con el contenedor posicionado y bloqueado; el desbloqueo en marcha detiene o inhibe."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de los 4 casos con hora, acción y respuesta del equipo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>GAMP5 2.ª ed.; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "resumen",
    "id": "EQ-OQ-LF-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-RES — Tabla resumen de los ensayos del OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del OQ del lecho fluido para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EQ-OQ-LF-001 a EQ-OQ-LF-011 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 11 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "tabla",
    "id": "EQ-OQ-LF-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-OQ-LF-REF — Referencias del OQ de lecho fluido",
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
       "GAMP5 2.ª ed. — A Risk-Based Approach to Compliant GxP Computerized Systems — Enfoque de challenge a funciones de seguridad e interlocks",
       "VIGENTE"
      ],
      [
       "6.2",
       "ISPE Baseline Guide Vol. 5 C&Q 2.ª ed. — Commissioning and Qualification con gestión de riesgo",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: la OQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "USP <1058> — Analytical Instrument Qualification: exactitud de sensores e instrumentos asociados",
       "VIGENTE"
      ],
      [
       "6.5",
       "OMS TRS 1010 Anexo 7 — Buenas prácticas de almacenamiento y contención",
       "VIGENTE"
      ],
      [
       "6.6",
       "Manual del fabricante del lecho fluido — Setpoints, secuencias y límites de diseño",
       "VIGENTE"
      ]
     ]
    },
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros crudos, gráficos y curvas (frecuencia-caudal, temperatura-tiempo, retención de presión)</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de calibración de instrumentos y sensores patrón</td></tr>\n<tr><td>8.3</td><td>Anexo C — Matrices de interlocks, alarmas y posicionamiento completadas</td></tr>\n</tbody></table>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO OQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Operación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Operación con las áreas involucradas, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar el inicio de la PQ.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Operación: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en el entorno seleccionado (USP &lt;1058&gt;).</p>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-001 — Parada de emergencia y aborto de ciclo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia o el aborto del ciclo deja la cámara en estado seguro, despresuriza de forma controlada y mantiene la puerta bloqueada hasta presión segura en el <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar IQ aprobada y <span class=\"equipo\">equipo</span> liberado para OQ, con ciclo de prueba programado en cámara vacía<br>\n  2) Arrancar el ciclo y esperar a la fase de esterilización<br>\n  3) Accionar la parada de emergencia o el aborto y medir con cronómetro el tiempo hasta el corte del vapor<br>\n  4) Confirmar la despresurización controlada sin apertura de la puerta<br>\n  5) Intentar abrir la puerta con la cámara presurizada o por encima de 80 °C<br>\n  a) La puerta queda bloqueada hasta presión menor o igual a 0,2 bar y temperatura segura<br>\n  6) Confirmar que el rearranque exige una acción deliberada del operador y que el equipo no continúa el ciclo solo<br>\n  7) Dejar el <span class=\"equipo\">equipo</span> en condición segura y anotar cualquier desviación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estado seguro con despresurización controlada; puerta bloqueada hasta condición segura.<br>\n  Sin rearranque automático ni continuación del ciclo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de tiempos, presiones y temperaturas del aborto<br>\n  - Constancia del bloqueo de puerta"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (control y seguridades); GAMP5 2.ª ed."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-002 — Interlocks de puertas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los bloqueos de puerta del <span class=\"equipo\">equipo</span> por presión o temperatura alta, la inhibición con puerta mal cerrada y la exclusión mutua en doble puerta."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Dejar el <span class=\"equipo\">equipo</span> detenido en condición segura y disponer de la matriz de interlocks<br>\n  2) Presurizar la cámara a 1 bar o calentarla por encima de 80 °C e intentar abrir la puerta<br>\n  a) La apertura queda bloqueada<br>\n  3) Dejar la puerta mal cerrada e intentar iniciar el ciclo<br>\n  a) El inicio queda inhibido con mensaje en el HMI<br>\n  4) En autoclave de doble puerta: abrir el lado de carga e intentar abrir el lado de descarga<br>\n  a) La segunda puerta queda bloqueada, y viceversa<br>\n  5) Cerrar correctamente y confirmar el permiso de marcha<br>\n  6) Registrar cada intento con hora, condición y respuesta del <span class=\"equipo\">equipo</span>"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de los bloqueos ensayados es efectivo, incluyendo la exclusión mutua en doble puerta."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de interlocks con intentos y respuestas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 §4.3.2 (puertas); GAMP5 2.ª ed."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-003 — Válvula de seguridad y recipiente a presión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el certificado vigente de la válvula de seguridad, su prueba de alivio y la conformidad del recipiente a presión del <span class=\"equipo\">equipo</span> según la normativa local."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recopilar el certificado de la válvula de seguridad (presión de tarado y vigencia) y el expediente del recipiente<br>\n  2) Confirmar la placa del recipiente con su norma de diseño y fabricación<br>\n  3) Presenciar o documentar la prueba de alivio a la presión de tarado, verificando apertura y recierre<br>\n  4) Verificar los manómetros del <span class=\"equipo\">equipo</span> contra patrón en el rango de trabajo<br>\n  a) Los certificados están vigentes y archivados<br>\n  5) Anexar los certificados y el acta de la prueba de alivio al protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Válvula certificada, vigente y funcional; recipiente conforme a la normativa local."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Certificado de la válvula de seguridad y expediente del recipiente<br>\n  - Acta de la prueba de alivio"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Normativa local de recipientes a presión; EN 764-1."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-004 — Alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma del <span class=\"equipo\">equipo</span> dispara en su límite y ejecuta su acción (alta y baja temperatura, alta presión, falla de vacío, tiempo excedido y falla de vapor)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar las alarmas con sus límites según el HMI y la receta, y disponer de cronómetro y formato de registro<br>\n  2) Provocar o simular alta temperatura por encima del límite y confirmar alarma con su acción<br>\n  a) El tiempo entre el evento y la alarma es menor a 5 segundos<br>\n  3) Provocar o simular baja temperatura por debajo del límite y confirmar alarma con su acción<br>\n  4) Provocar o simular alta presión por encima del límite y confirmar alarma con su acción<br>\n  5) Interrumpir la bomba de vacío y confirmar la alarma de falla de vacío con su acción<br>\n  6) Reducir el setpoint de tiempo para forzar tiempo de ciclo excedido y confirmar la alarma<br>\n  7) Cerrar el suministro de vapor y confirmar la alarma de falla de vapor con su acción<br>\n  8) Acusar cada alarma, verificar que el acuse queda registrado, normalizar y confirmar el retorno a operación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de las alarmas dispara en su límite, ejecuta su acción en menos de 5 segundos y queda registrada con acuse."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con límite, acción, tiempo de respuesta y acuse<br>\n  - Extracto del histórico de alarmas del HMI"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; GAMP5 2.ª ed."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-005 — Falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el estado del <span class=\"equipo\">equipo</span> y del ciclo en curso ante un corte de energía y su recuperación sin pérdida de datos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Poner el <span class=\"equipo\">equipo</span> en ciclo de prueba en fase de esterilización y coordinar el corte real o simulado<br>\n  2) Cortar la energía, anotar la hora exacta y la fase del ciclo<br>\n  3) Confirmar el estado seguro: vapor cortado, puerta bloqueada y alarmas correspondientes activas<br>\n  4) Esperar 5 minutos sin energía<br>\n  5) Restablecer la energía y confirmar que el <span class=\"equipo\">equipo</span> no rearranca solo ni continúa el ciclo como si nada: el ciclo se aborta o se reanuda manualmente según el diseño<br>\n  6) Revisar el lote de datos: registro del ciclo completo hasta el corte, sin corrupción ni huecos injustificados según ALCOA+<br>\n  7) Anexar el registro del evento y la verificación de datos, documentando las desviaciones si las hubo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estado seguro al corte; sin rearranque automático; ciclo invalidado o reanudado según procedimiento.<br>\n  Datos íntegros y trazables tras la recuperación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del evento con hora y fase del ciclo<br>\n  - Verificación de integridad de datos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>GAMP5 2.ª ed.; 21 CFR Part 11."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-006 — Registro del ciclo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la impresora o el registrador independiente del <span class=\"equipo\">equipo</span> coincide con la lectura del equipo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Correr un ciclo de prueba con el registro impresor o independiente activo<br>\n  2) Comparar punto por punto la temperatura, la presión, los tiempos de fase y las alarmas entre el equipo y el registro independiente<br>\n  a) Las diferencias de temperatura y presión están dentro de la exactitud declarada del registrador<br>\n  3) Confirmar la identificación del ciclo (número, fecha y programa) en ambos registros<br>\n  4) Anexar la tira o gráfica firmada al protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Coincidencia total entre el equipo y el registro independiente, con el ciclo identificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tira o gráfica del registro independiente anexada y firmada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (medición y registro); EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-007 — Exactitud y correlación temperatura contra presión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los sensores de control e independiente del <span class=\"equipo\">equipo</span> y su correlación según las tablas de vapor saturado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ubicar el sensor patrón calibrado (exactitud igual o mejor a ±0,2 °C) junto al sensor de control<br>\n  2) En meseta a 121 °C, comparar el sensor de control contra el patrón y calcular la temperatura teórica de saturación a la presión medida<br>\n  a) La diferencia entre control y patrón es menor o igual a ±0,5 °C<br>\n  b) La temperatura medida es coherente con la saturación, sin sobrecalentamiento significativo<br>\n  3) Repetir en 134 °C si el <span class=\"equipo\">equipo</span> opera ese programa<br>\n  4) Confirmar la calibración vigente de ambos canales y anexar la tabla de temperatura, presión y teórica<br>\n  5) Procesar los datos crudos de temperatura y presión (correlación con vapor saturado) en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud ±0,5 °C y correlación con vapor saturado conformes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de temperatura, presión y teórica de saturación<br>\n  - Certificados de los sensores<br>\n  - Data cruda y reporte estadístico del análisis de temperatura y presión (correlación con vapor saturado)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; EN 285 (termometría)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-008 — Temporizadores de las fases",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los tiempos de acondicionamiento, esterilización y secado del <span class=\"equipo\">equipo</span> contra sus setpoints."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Programar un ciclo de prueba con tiempos conocidos y disponer de cronómetro independiente<br>\n  2) Medir cada fase (acondicionamiento, esterilización y secado) y comparar con el HMI<br>\n  a) La diferencia es menor o igual a ±1% o ±5 segundos, lo mayor<br>\n  3) Repetir en un segundo programa si el <span class=\"equipo\">equipo</span> lo tiene calificado<br>\n  4) Anexar la tabla de setpoint contra medido por fase"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Temporizadores exactos dentro de la tolerancia en todos los programas ensayados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de setpoint contra medido por fase y programa"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-009 — Programas de ciclo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la transición entre fases, los setpoints y los tiempos de cada programa calificado del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar los programas a calificar según las recetas aprobadas<br>\n  2) Correr cada programa en vacío y confirmar la secuencia de fases según su receta<br>\n  3) Confirmar que los setpoints ejecutados de temperatura, presión, tiempos y pulsos de vacío son los programados<br>\n  4) Confirmar el fin de ciclo, la impresión del registro y la liberación de la puerta solo al final<br>\n  a) Cada programa ejecuta su receta completa sin desvíos<br>\n  5) Completar el checklist por programa con sus registros anexados"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de los programas ejecuta su receta completa sin desvíos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Checklist por programa con registros de ciclo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; recetas aprobadas."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-010 — Prueba de fuga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la tasa de aumento de presión de la cámara del <span class=\"equipo\">equipo</span> está dentro del criterio de la URS o de la norma adoptada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Dejar la cámara vacía, seca y fría, y estabilizarla con un ciclo de calentamiento previo según EN 285<br>\n  2) Evacuar al nivel del ensayo, aislar la cámara y estabilizar 300 segundos<br>\n  3) Medir el aumento de presión durante 600 segundos con instrumento calibrado<br>\n  4) Calcular la tasa en kPa por minuto<br>\n  a) La tasa es menor o igual a 0,13 kPa por minuto, o al criterio de la URS si es más estricto<br>\n  5) Si no cumple, investigar fugas en puerta, sellos y válvulas, corregir y repetir<br>\n  6) Anexar la curva de presión contra tiempo con el cálculo de la tasa<br>\n  7) Procesar los datos crudos de presión de la prueba de fuga (tasa y curva) en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tasa de fuga menor o igual a 0,13 kPa/min (EN 285), o el criterio más estricto de la URS registrado en el protocolo antes de la ejecución."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curva de presión contra tiempo con cálculo de tasa<br>\n  - Certificado del instrumento de medición<br>\n  - Data cruda y reporte estadístico del análisis de presión de la prueba de fuga (tasa y curva)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 §18."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-011 — Bowie-Dick o equivalente",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la penetración de vapor y la remoción de aire en cargas porosas del <span class=\"equipo\">equipo</span> con paquete de prueba."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Preparar el paquete Bowie-Dick textil estándar (EN 285) con hoja indicadora clase 2 según ISO 11140-5, o el dispositivo alternativo clase 2 según ISO 11140-4, y ubicarlo en el punto definido (típicamente centro-bajo, sobre el drenaje)<br>\n  2) Correr el ciclo Bowie-Dick a 134 °C por 3,5 minutos o el programa del <span class=\"equipo\">equipo</span><br>\n  3) Evaluar la hoja indicadora inmediatamente después del ciclo: viraje uniforme sin zonas sin procesar<br>\n  4) Repetir en 3 corridas según el procedimiento<br>\n  a) Viraje uniforme en todas las corridas<br>\n  5) Ante cualquier falla, investigar aire residual (fuga, vapor o vacío) antes de continuar con la calificación<br>\n  6) Anexar las hojas indicadoras firmadas al protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Viraje uniforme en todas las corridas; pasa o no pasa por uniformidad."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Hojas indicadoras anexadas y firmadas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 §17; ISO 11140-4 e ISO 11140-5 (indicadores clase 2 para remoción de aire)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-012 — Detector de aire (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el detector de aire del <span class=\"equipo\">equipo</span> desafía el ciclo y registra pasa o falla; si el equipo no lo tiene, declarar No Aplica con justificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el <span class=\"equipo\">equipo</span> cuenta con detector de aire; si no existe, pasar al paso 4)<br>\n  2) Correr un ciclo con ingreso dosificado de aire de 1,0 ±0,1 kPa por minuto y confirmar que el detector lo registra como falla<br>\n  3) Correr un ciclo sin ingreso de aire y confirmar el registro de pasa<br>\n  a) El detector discrimina pasa y falla correctamente<br>\n  4) Sin detector: redactar la justificación de No Aplica indicando que el equipo no cuenta con detector de aire, con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Detector funcional que discrimina pasa y falla, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros del detector o justificación de No Aplica firmada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 §19 (provisión opcional)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-013 — Integridad y estado del sello de la puerta",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la integridad y el estado del sello o empaque de la puerta del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar visualmente el sello: cortes, deformación, endurecimiento y residuos<br>\n  2) Confirmar el asentamiento uniforme con la puerta cerrada, sin fugas audibles ni visibles de vapor en ciclo<br>\n  3) Si el diseño lo permite, correr una retención de vacío corta como evidencia complementaria<br>\n  4) Registrar el estado del sello como apto o programar su reemplazo<br>\n  a) Sin daños y sin fugas durante el ciclo<br>\n  5) Anexar la constancia con evidencia fotográfica"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sello íntegro y funcional, sin fugas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Constancia del estado del sello con evidencia fotográfica"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EN 285 §18 (prueba global de fugas)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-014 — Mapeo de temperatura en cámara vacía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la uniformidad y la estabilidad de la temperatura durante la esterilización en cámara vacía, el ΔT entre sensores y respecto al control, e identificar el punto frío para el PQ."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Distribuir 10 termopares calibrados como mínimo (esquinas, centro, drenaje y niveles alto, medio y bajo) según el plano de ubicación<br>\n  2) Correr el ciclo a 121 °C en vacío, registrando la temperatura cada 30 segundos<br>\n  3) En meseta, calcular por sensor el promedio, el máximo y el mínimo; el ΔT entre sensores; y el ΔT contra el sensor de control<br>\n  a) Todos los sensores entre 121 y 124 °C en meseta, o dentro de la banda de la URS<br>\n  b) El ΔT entre sensores está dentro de ±1 °C<br>\n  4) Repetir en 134 °C si el <span class=\"equipo\">equipo</span> opera ese programa<br>\n  5) Identificar y registrar el punto frío para el PQ<br>\n  6) Anexar el plano de termopares, las curvas y la tabla por sensor<br>\n  7) Procesar los datos crudos de temperatura del mapeo en cámara vacía en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Uniformidad y estabilidad conformes en meseta; punto frío identificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de ubicación de termopares<br>\n  - Curvas de temperatura y tabla por sensor con ΔT<br>\n  - Certificados de los termopares<br>\n  - Data cruda y reporte estadístico del análisis de temperatura del mapeo en cámara vacía"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El número y la ubicación de los termopares se justifican en el plano según el volumen útil y la geometría de la cámara (drenaje, entrada de vapor, zona de puerta y esquinas); 10 es el mínimo del banco y se aumenta en cámaras grandes."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 §16 (termometría); ISO 17665-1; USP &lt;1229.1&gt;; PDA TR-01."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-015 — Sobrecalentamiento y condensado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el vapor en la cámara del <span class=\"equipo\">equipo</span> corresponde a saturación a la presión medida, sin sobrecalentamiento relevante, y que el condensado drena correctamente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Durante la meseta del mapeo, calcular la temperatura teórica de saturación a la presión de cámara con las tablas de vapor<br>\n  2) Comparar la temperatura medida menos la teórica en cada sensor<br>\n  a) La diferencia está dentro de ±2 °C (vapor saturado, no sobrecalentado)<br>\n  3) Confirmar trampas de vapor y drenaje operativos, sin encharcamiento, revisando mirilla y drenaje<br>\n  4) Anexar la tabla de temperatura medida contra teórica por sensor<br>\n  5) Procesar los datos crudos de temperatura de saturación (medida contra teórica) en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vapor saturado y condensado drenado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de temperatura medida contra teórica por sensor<br>\n  - Data cruda y reporte estadístico del análisis de temperatura de saturación (medida contra teórica)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (calidad de vapor); PDA TR-01."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-016 — Calidad de vapor (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la fracción de sequedad, los gases no condensables y el sobrecalentamiento cuando el vapor del <span class=\"equipo\">equipo</span> es de proceso; si la empresa los ejecuta en PQ, dejar justificada su ubicación en el protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el vapor es de proceso y si la calidad se ejecuta en este OQ o en el PQ; si va en PQ, pasar al paso 4) con la justificación<br>\n  2) Con el kit según EN 285, medir la fracción de sequedad, los gases no condensables y el sobrecalentamiento<br>\n  a) Sequedad mayor o igual a 0,95<br>\n  b) Gases no condensables menor o igual a 3,5 ml por 100 ml de condensado<br>\n  c) Sobrecalentamiento menor a 25 °C a presión atmosférica<br>\n  3) Anexar el reporte de calidad de vapor<br>\n  4) Si va en PQ: redactar la justificación de su ubicación en el protocolo con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Parámetros conformes o ubicación en PQ justificada y firmada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Reporte de calidad de vapor o justificación de ubicación firmada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (vapor); ISPE (sequedad ≥0,95)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-017 — Secado en cámara vacía o carga inerte",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la efectividad del secado del <span class=\"equipo\">equipo</span> en cámara vacía o con carga inerte, sin humedad residual atribuible al equipo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Dejar la cámara vacía o con la carga inerte definida, como bandejas metálicas<br>\n  2) Correr el ciclo completo con su fase de secado según el programa<br>\n  3) Al abrir, inspeccionar superficies y trampas al tacto y visualmente, sin gotas ni humedad<br>\n  4) Si aplica, pesar los elementos testigo antes y después<br>\n  a) Sin humedad residual atribuible al equipo; diferencia de pesada dentro del criterio de la URS<br>\n  5) Anexar el registro de inspección o de pesadas"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Secado efectivo sin humedad residual del equipo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de inspección o de pesadas de secado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (sequedad de carga)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-AU-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-018 — Enfriamiento y control de presión (si aplica, líquidos)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la fase de enfriado y el control de presión en ciclos de líquidos del <span class=\"equipo\">equipo</span>, si opera esos ciclos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el <span class=\"equipo\">equipo</span> opera ciclos de líquidos; si no, pasar al paso 5)<br>\n  2) Preparar la carga líquida simulada con botellas con agua en volumen representativo<br>\n  3) Correr el programa de líquidos y verificar la rampa de enfriamiento sin ebullición violenta, con la sobrepresión de apoyo según el diseño<br>\n  4) Confirmar el diferencial de temperatura y el tiempo de enfriado dentro de la receta, con tapones y cierres íntegros<br>\n  a) Enfriamiento controlado sin daño a la carga<br>\n  5) Sin ciclos de líquidos: redactar la justificación de No Aplica con firma del ejecutor y del revisor<br>\n  6) Anexar la curva de enfriamiento o la justificación<br>\n  7) Cuando aplique este ensayo, procesar los datos crudos de temperatura de la curva de enfriamiento en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Enfriamiento controlado conforme, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curva de enfriamiento o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de temperatura de la curva de enfriamiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1229.2&gt; (líquidos); receta aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "resumen",
    "id": "EQ-OQ-AU-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-RES — Tabla resumen de los ensayos del OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del OQ del autoclave para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EQ-OQ-AU-001 a EQ-OQ-AU-018 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 18 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "tabla",
    "id": "EQ-OQ-AU-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-OQ-AU-REF — Referencias del OQ de autoclave",
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
       "EN 285:2015+A1:2021 — Esterilización, esterilizadores a vapor, grandes esterilizadores: Bowie-Dick, fuga, detector de aire, termometría y calidad de vapor",
       "VIGENTE"
      ],
      [
       "6.2",
       "ISO 17665-1 — Esterilización de productos sanitarios por calor húmedo: desarrollo, validación y control",
       "VIGENTE"
      ],
      [
       "6.3",
       "USP <1229> / <1229.1> / <1229.2> — Esterilización de artículos compendiales, F0 y líquidos acuosos",
       "VIGENTE"
      ],
      [
       "6.4",
       "PDA TR-01 — Esterilización por calor húmedo: cinética D/z y estudios de distribución y penetración",
       "VIGENTE"
      ],
      [
       "6.5",
       "EU GMP Anexo 15 — Cualificación y validación: la OQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.6",
       "GAMP5 2.ª ed. — Challenge a funciones de seguridad, interlocks, alarmas e integridad de datos",
       "VIGENTE"
      ],
      [
       "6.7",
       "Normativa local de recipientes a presión — Conformidad del recipiente y válvula de seguridad",
       "VIGENTE"
      ],
      [
       "6.8",
       "Manual del fabricante del autoclave — Setpoints, secuencias, programas y límites de diseño",
       "VIGENTE"
      ]
     ]
    },
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de ciclo, curvas de temperatura y presión, y cálculos (tasa de fuga, F0 de referencia)</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de calibración de termopares, manómetros e instrumentos patrón</td></tr>\n<tr><td>8.3</td><td>Anexo C — Hojas Bowie-Dick, matrices de interlocks y alarmas, y certificados de válvula de seguridad</td></tr>\n</tbody></table>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO OQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Operación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Operación con las áreas involucradas, asegurando personal, <span class=\"equipo\">equipo</span>, bins, placebo o excipiente, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar el inicio de la PQ.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Operación: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en el entorno seleccionado (USP &lt;1058&gt;).</p>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-001 — Parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia del <span class=\"equipo\">equipo</span> detiene la rotación en el tiempo previsto y deja el equipo en estado seguro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar IQ aprobada y <span class=\"equipo\">equipo</span> liberado para OQ, con el bin acoplado y cargado según el procedimiento<br>\n  2) Arrancar la rotación a velocidad nominal y confirmar marcha estable<br>\n  3) Accionar la parada de emergencia y medir con cronómetro el tiempo hasta la detención total<br>\n  4) Confirmar el estado seguro: sin rotación, variador en falla o reposo según diseño, y mensaje en el HMI<br>\n  a) Tiempo de detención dentro del límite del fabricante<br>\n  5) Sin rearmar, intentar arrancar y confirmar que queda impedido<br>\n  6) Rearmar según el fabricante y confirmar condición segura sin arranque solo<br>\n  7) Repetir por cada parada de emergencia y dejar el <span class=\"equipo\">equipo</span> en condición segura"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Detención en el tiempo previsto; estado seguro; sin arranque sin rearme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de paradas con tiempos de detención medidos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; GAMP5 2.ª ed."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-002 — Interlocks de seguridad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el <span class=\"equipo\">equipo</span> no arranca ni continúa con la jaula o guarda abierta, el contenedor sin bloquear, el bin ausente o la puerta de carga abierta."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Dejar el <span class=\"equipo\">equipo</span> detenido en condición segura y disponer de la matriz de interlocks<br>\n  2) Abrir la jaula o guarda e intentar arrancar<br>\n  a) El arranque queda inhibido con mensaje en el HMI<br>\n  3) Desbloquear el contenedor o retirar el bin e intentar arrancar<br>\n  a) El arranque queda inhibido con mensaje en el HMI<br>\n  4) Abrir la puerta de carga e intentar arrancar<br>\n  a) El arranque queda inhibido con mensaje en el HMI<br>\n  5) Arrancar en condición normal y abrir la guarda durante la marcha, confirmando la detención<br>\n  6) Restituir todo a normal, confirmar marcha permitida y cerrar la matriz"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de los interlocks inhibe el arranque o detiene la marcha."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de interlocks con condición, respuesta y mensaje"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>GAMP5 2.ª ed.; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-003 — Alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma del <span class=\"equipo\">equipo</span> dispara en su límite y ejecuta su acción (sobrecorriente o sobrecarga del motor, sobrevelocidad, falla del variador y freno)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar las alarmas con sus límites según el HMI y el manual, con cronómetro y formato de registro<br>\n  2) Provocar o simular sobrecorriente o sobrecarga del motor y confirmar alarma con su acción<br>\n  a) Tiempo de respuesta menor a 5 segundos con acuse registrado<br>\n  3) Provocar o simular sobrevelocidad y confirmar alarma con su acción<br>\n  4) Simular falla del variador y confirmar alarma con detención segura<br>\n  5) Verificar la alarma o estado del freno según el diseño<br>\n  6) Acusar cada alarma, normalizar y confirmar el retorno a operación con el histórico completo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de las alarmas dispara, ejecuta su acción y queda registrada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con límite, acción, tiempo y acuse"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; GAMP5 2.ª ed."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-004 — Falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que ante un corte de energía el <span class=\"equipo\">equipo</span> queda en estado seguro, sin arranque espontáneo, y los datos se conservan."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Poner el <span class=\"equipo\">equipo</span> en rotación nominal con receta de prueba y coordinar el corte real o simulado<br>\n  2) Cortar la energía, anotar la hora y confirmar el estado seguro (sin rotación, freno según diseño, alarmas)<br>\n  3) Esperar 5 minutos sin energía<br>\n  4) Restablecer y confirmar que no arranca solo y exige acción deliberada del operador<br>\n  5) Rearrancar manualmente, confirmar operación normal y verificar integridad de registros y contadores (ALCOA+)<br>\n  6) Anexar el registro del evento y la verificación de datos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estado seguro al corte; sin arranque espontáneo; datos íntegros."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del evento con hora y verificación de datos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>GAMP5 2.ª ed.; 21 CFR Part 11."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-005 — Freno con carga máxima",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el tiempo y la distancia de frenado del <span class=\"equipo\">equipo</span> con carga máxima."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cargar el bin a la carga máxima declarada en la URS (registrar el valor en kg y su fuente antes de iniciar)<br>\n  2) Rotar a velocidad nominal hasta marcha estable<br>\n  3) Ordenar la detención y medir con cronómetro el tiempo hasta detención total, repitiendo 3 veces<br>\n  4) Medir la distancia o vueltas de frenado (marcas de referencia en el bin y la estructura) en cada repetición<br>\n  a) Tiempo y distancia dentro del límite del fabricante en las 3 repeticiones<br>\n  5) Confirmar que el freno no patina ni genera ruidos anormales<br>\n  6) Anexar la tabla de tiempos y distancias por repetición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tiempo y distancia de frenado dentro del límite del fabricante en las 3 repeticiones con carga máxima, sin patinaje (límite y fuente registrados antes de iniciar)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de tiempos y distancias de frenado por repetición"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-006 — Velocidad de rotación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de la velocidad de rotación del <span class=\"equipo\">equipo</span> en mínimo, nominal y máximo contra tacómetro independiente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Disponer de tacómetro con calibración vigente y definir los setpoints mínimo, nominal y máximo (registrar los valores en rpm según la URS o el manual del fabricante)<br>\n  2) Fijar la velocidad mínima, esperar estabilización y medir 3 lecturas con el tacómetro contra la indicación del equipo<br>\n  3) Repetir en velocidad nominal y en velocidad máxima<br>\n  4) Calcular el error porcentual por punto contra el tacómetro<br>\n  a) Error menor o igual a ±[2]% en los tres puntos<br>\n  5) Procesar los datos crudos de velocidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud ±2% en mínimo, nominal y máximo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de velocidad equipo contra tacómetro por punto<br>\n  - Data cruda y reporte estadístico del análisis de velocidad de rotación<br>\n  - Certificado del tacómetro"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; manual del fabricante."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-007 — Temporizador y contador de revoluciones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud del temporizador y del contador de revoluciones del <span class=\"equipo\">equipo</span> frente a un cronómetro de referencia."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Disponer de cronómetro de referencia calibrado o trazable<br>\n  2) Programar 3 tiempos (corto, medio y largo: [1], [10] y [30] min) y medir cada uno con el cronómetro<br>\n  3) Programar un número de revoluciones (100 o el valor de la receta, registrado antes de iniciar) y contarlas de forma independiente (tacómetro con conteo o conteo manual asistido)<br>\n  4) Comparar tiempos y revoluciones del equipo contra la referencia<br>\n  a) Diferencia de tiempo menor o igual a ±[1]% o ±5 segundos, lo mayor<br>\n  b) Revoluciones exactas sin pérdidas de conteo<br>\n  5) Procesar los datos crudos de tiempos y revoluciones en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Temporizador y contador exactos en los puntos ensayados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de tiempos y revoluciones equipo contra referencia<br>\n  - Data cruda y reporte estadístico del análisis de temporizador y revoluciones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-008 — Sentido de giro y rampas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el sentido de giro y las rampas de aceleración y desaceleración del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Marcar el sentido de giro de diseño en el bin y en la estructura<br>\n  2) Arrancar y confirmar visualmente el sentido correcto en ambos sentidos si el equipo es reversible<br>\n  3) Medir con cronómetro los tiempos de rampa de aceleración (reposo a nominal) y de desaceleración (nominal a reposo)<br>\n  4) Confirmar arranque y parada suaves, sin sacudidas ni sobrecorriente de arranque fuera de lo previsto<br>\n  a) Sentido correcto y rampas dentro de lo previsto por el fabricante<br>\n  5) Registrar tiempos de rampa y sentido por prueba"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sentido correcto y rampas conformes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de sentido de giro y tiempos de rampa"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-009 — Posición de parada",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la precisión de la parada en posición de carga y de descarga del <span class=\"equipo\">equipo</span>, repetida varias veces."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Marcar las posiciones de carga y de descarga con referencias fijas medibles (regla o goniómetro)<br>\n  2) Ordenar la parada en posición de carga 5 veces y medir la desviación en cada una<br>\n  3) Repetir 5 veces en posición de descarga<br>\n  4) Calcular la desviación máxima y promedio por posición<br>\n  a) Desviación dentro de la tolerancia que permite el acople y la descarga (tolerancia del fabricante registrada en cm o grados antes de iniciar)<br>\n  5) Anexar la tabla de desviaciones por repetición y posición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Parada repetible en ambas posiciones dentro de tolerancia."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de desviaciones por repetición y posición"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-010 — Uniformidad de mezcla con placebo (prueba previa al PQ)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la uniformidad de mezcla del <span class=\"equipo\">equipo</span> con placebo o excipiente trazador, con muestreo estratificado y criterio RSD."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cargar placebo o excipiente con trazador cuantificable a la carga de trabajo, según plan de mezcla aprobado (tiempo y velocidad nominales)<br>\n  2) Definir 10 puntos de muestreo como mínimo en dos profundidades del eje del bin, incluyendo zonas de riesgo (fondo, tapa, descarga)<br>\n  3) Tomar 3 réplicas por punto con muestreador validado, sin segregar la muestra<br>\n  4) Analizar el trazador por método validado y calcular media, SD y RSD del conjunto<br>\n  a) RSD menor o igual a 5,0% e individuales dentro de ±10% absoluto de la media<br>\n  5) Procesar los datos crudos de uniformidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Mezcla uniforme según criterio RSD."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de puntos de muestreo con resultados por punto y réplica<br>\n  - Data cruda y reporte estadístico del análisis de uniformidad de mezcla<br>\n  - Método analítico del trazador"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>\n  Ensayo de caracterización previa al PQ: demuestra la capacidad de mezcla con placebo; la uniformidad con producto se demuestra en el PQ."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA/PQRI (uniformidad de mezcla en polvos); EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-011 — Bloqueo y acoplamiento del bin",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el mecanismo de bloqueo y acoplamiento del bin con carga máxima, sin holgura ni desacople durante la rotación; si hay varios bins, cada uno se califica o se justifica un agrupamiento."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cargar el bin a la carga máxima declarada y acoplarlo según el procedimiento<br>\n  2) Activar el bloqueo y verificar retención: intentar el desacople manual (no debe soltarse) y medir holguras con galgas<br>\n  3) Rotar un ciclo completo observando el acople (sin ruidos, desplazamientos ni holgura progresiva)<br>\n  4) Repetir con cada bin del sitio, o documentar el agrupamiento justificado (mismo diseño, tolerancias y uso)<br>\n  a) Retención firme sin holgura fuera de tolerancia en todos los bins calificados<br>\n  5) Registrar bin por bin con su identificación y resultado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Bloqueo y acople firmes en todos los bins calificados o agrupamiento justificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro por bin con holguras medidas o justificación de agrupamiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-012 — Válvula de descarga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la apertura, el cierre y la estanqueidad de la válvula de descarga del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con el bin cargado con placebo, accionar la apertura y confirmar descarga completa sin atascos<br>\n  2) Cerrar y verificar estanqueidad: sin goteo ni fuga de polvo por la válvula cerrada durante la rotación<br>\n  3) Repetir apertura y cierre 3 veces<br>\n  4) Pesar el retenido en la válvula y zonas muertas, si aplica<br>\n  a) Apertura y cierre correctos con estanqueidad total<br>\n  5) Registrar cada accionamiento con su resultado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Válvula operativa y estanca."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de accionamientos de la válvula con resultados"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-MZ-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-013 — Sellos y juntas de la tapa (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los sellos y juntas de la tapa no fugan polvo con rotación y carga de placebo; si el diseño no lleva sellos, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el <span class=\"equipo\">equipo</span> lleva sellos o juntas en la tapa; si no, pasar al paso 4)<br>\n  2) Cargar placebo, cerrar y rotar un ciclo completo a velocidad nominal<br>\n  3) Inspeccionar tapa, sellos y alrededores: papel oscuro o paño para detectar fuga de polvo<br>\n  a) Sin fuga de polvo en sellos ni juntas<br>\n  4) Sin sellos en el diseño: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin fugas, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de inspección de sellos o justificación de No Aplica firmada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "resumen",
    "id": "EQ-OQ-MZ-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-RES — Tabla resumen de los ensayos del OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del OQ del mezclador para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EQ-OQ-MZ-001 a EQ-OQ-MZ-013 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 13 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "tabla",
    "id": "EQ-OQ-MZ-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-OQ-MZ-REF — Referencias del OQ de mezclador",
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
       "FDA/PQRI — Guía de uniformidad de mezcla en polvos: muestreo estratificado, RSD ≤5,0% e individuales ±10%",
       "VIGENTE"
      ],
      [
       "6.2",
       "EU GMP Anexo 15 — Cualificación y validación: la OQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.3",
       "GAMP5 2.ª ed. — Challenge a funciones de seguridad, interlocks, alarmas e integridad de datos",
       "VIGENTE"
      ],
      [
       "6.4",
       "USP <1058> — Analytical Instrument Qualification: tacómetros, cronómetros e instrumentos asociados",
       "VIGENTE"
      ],
      [
       "6.5",
       "Manual del fabricante del mezclador — Velocidades, freno, bloqueo de bin y límites de diseño",
       "VIGENTE"
      ]
     ]
    },
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de ciclos, tiempos, velocidades y revoluciones por ensayo</td></tr>\n<tr><td>8.2</td><td>Anexo B — Datos de uniformidad de mezcla, reportes analíticos y certificados de instrumentos</td></tr>\n<tr><td>8.3</td><td>Anexo C — Matrices de interlocks y alarmas, y registros por bin</td></tr>\n</tbody></table>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO OQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Operación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Operación con las áreas involucradas, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos patrón y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar el inicio de la PQ.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Operación: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en el entorno seleccionado (USP &lt;1058&gt;).</p>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-001 — Parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia del <span class=\"equipo\">equipo</span> corta la calefacción y deja el horno en estado seguro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar IQ aprobada y <span class=\"equipo\">equipo</span> liberado para OQ, en calentamiento nominal<br>\n  2) Accionar la parada de emergencia y medir con cronómetro el tiempo hasta el corte de calefacción y paro de ventilación<br>\n  3) Confirmar el estado seguro y el mensaje en el controlador<br>\n  a) Corte efectivo dentro del límite del fabricante<br>\n  4) Sin rearmar, intentar arrancar y confirmar que queda impedido<br>\n  5) Rearmar según el fabricante y confirmar condición segura sin arranque solo<br>\n  6) Repetir por cada parada y dejar el <span class=\"equipo\">equipo</span> en condición segura"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Corte efectivo; estado seguro; sin arranque sin rearme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba con tiempos medidos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; GAMP5 2.ª ed."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-002 — Protección independiente de sobretemperatura",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la protección independiente de sobretemperatura corta la calefacción al llegar al límite, con el control principal inhabilitado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar el termostato o controlador independiente y su setpoint (registrar el valor en °C y su fuente antes de iniciar)<br>\n  2) Inhabilitar el control principal según el procedimiento del fabricante, bajo supervisión<br>\n  3) Elevar la temperatura de forma controlada hasta el límite de seguridad<br>\n  4) Confirmar el corte de la calefacción por el dispositivo independiente y su alarma<br>\n  a) Corte efectivo al límite con el control principal inhabilitado<br>\n  5) Restituir el control principal, normalizar y confirmar operación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Protección independiente funcional al límite declarado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba con setpoint y respuesta"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-003 — Interlocks de puerta y ventilación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los interlocks del <span class=\"equipo\">equipo</span>: puerta abierta y falla de ventilación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Dejar el <span class=\"equipo\">equipo</span> en calentamiento nominal y disponer de la matriz de interlocks<br>\n  2) Abrir la puerta y confirmar la respuesta diseñada (corte de calefacción, alarma o detención)<br>\n  3) Simular falla de ventilación y confirmar la inhibición de la calefacción<br>\n  4) Intentar arrancar con la puerta abierta y confirmar que queda impedido<br>\n  a) Cada interlock ejecuta su acción diseñada con mensaje<br>\n  5) Restituir todo a normal y cerrar la matriz"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de los interlocks ejecuta su acción."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de interlocks con condición y respuesta"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>GAMP5 2.ª ed.; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-004 — Alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma del <span class=\"equipo\">equipo</span> dispara en su límite y ejecuta su acción (alta temperatura, desviación, falla de sensor)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar las alarmas con sus límites según el controlador, con cronómetro y formato<br>\n  2) Provocar o simular alta temperatura y confirmar alarma con su acción<br>\n  a) Tiempo de respuesta menor a 5 segundos con acuse registrado<br>\n  3) Provocar o simular desviación de temperatura y falla de sensor (desconexión)<br>\n  4) Acusar cada alarma, normalizar y confirmar el retorno a operación con el histórico completo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de las alarmas dispara, ejecuta su acción y queda registrada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con límite, acción, tiempo y acuse"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; GAMP5 2.ª ed."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-005 — Falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que ante un corte de energía el <span class=\"equipo\">equipo</span> queda en estado seguro, sin arranque espontáneo, y los registros se conservan."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Poner el <span class=\"equipo\">equipo</span> en calentamiento nominal y coordinar el corte real o simulado<br>\n  2) Cortar la energía, anotar la hora y confirmar el estado seguro y las alarmas<br>\n  3) Esperar 5 minutos sin energía<br>\n  4) Restablecer y confirmar que no arranca solo y exige acción deliberada del operador<br>\n  5) Rearrancar manualmente, confirmar operación normal y verificar integridad de registros (ALCOA+)<br>\n  6) Anexar el registro del evento y la verificación de datos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estado seguro al corte; sin arranque espontáneo; datos íntegros."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del evento con hora y verificación de datos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>GAMP5 2.ª ed.; 21 CFR Part 11."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-006 — Exactitud del sensor frente a patrón por setpoint",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud del sensor de control del <span class=\"equipo\">equipo</span> frente a un patrón de referencia en cada setpoint de la tabla."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Disponer del patrón de referencia calibrado y de la tabla de setpoints aprobada del horno<br>\n  2) Estabilizar en cada setpoint de la tabla y comparar control contra patrón<br>\n  3) Registrar por setpoint ambas lecturas y la diferencia<br>\n  a) Diferencia menor o igual a ±0,5 °C o la tolerancia del URS<br>\n  4) Repetir en todos los setpoints de la tabla<br>\n  5) Procesar los datos crudos de exactitud en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud conforme en todos los setpoints de la tabla."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de setpoints con control contra patrón<br>\n  - Data cruda y reporte estadístico del análisis de exactitud<br>\n  - Certificado del patrón de referencia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; manual del fabricante."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-007 — Estabilidad y sobreimpulso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad del control del <span class=\"equipo\">equipo</span> en setpoints bajo, medio y alto del rango, y su sobreimpulso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fijar el setpoint bajo del rango, estabilizar y registrar cada 5 minutos durante 30 minutos como mínimo<br>\n  2) Medir el sobreimpulso al alcanzar cada setpoint desde ambiente<br>\n  3) Repetir en setpoint medio y en setpoint alto<br>\n  4) Calcular por setpoint el promedio, el rango y el sobreimpulso máximo<br>\n  a) Estabilidad dentro de ±1 °C y sobreimpulso menor o igual al límite del fabricante<br>\n  5) Procesar los datos crudos de estabilidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estabilidad y sobreimpulso conformes en los tres setpoints."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de estabilidad y sobreimpulso por setpoint<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; manual del fabricante."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-008 — Tiempos de calentamiento y enfriamiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir el tiempo de calentamiento del <span class=\"equipo\">equipo</span> hasta el setpoint y el tiempo de enfriamiento hasta temperatura segura para descarga."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Partir del horno a temperatura ambiente registrada y fijar el setpoint de trabajo<br>\n  2) Medir con cronómetro el tiempo hasta entrar en banda y estabilizar<br>\n  3) Apagar o llevar a reposo y medir el tiempo de enfriamiento hasta temperatura segura de descarga [40] °C<br>\n  4) Repetir en un segundo setpoint representativo<br>\n  a) Tiempos dentro de lo previsto por el fabricante o la receta<br>\n  5) Procesar los datos crudos de tiempos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tiempos de calentamiento y enfriamiento conformes y repetibles."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de calentamiento y enfriamiento por setpoint<br>\n  - Data cruda y reporte estadístico del análisis de tiempos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-009 — Temporizador y rampas o mesetas (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el temporizador y los programas de rampa o meseta del <span class=\"equipo\">equipo</span> frente a un cronómetro de referencia; si no tiene programas, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el horno tiene temporizador y programas de rampa o meseta; si no, pasar al paso 5)<br>\n  2) Programar 3 tiempos y medir cada uno con el cronómetro de referencia<br>\n  3) Programar una rampa y una meseta, y verificar segmentos contra tiempo real<br>\n  4) Comparar tiempos del equipo contra la referencia<br>\n  a) Diferencia menor o igual a ±1% o ±5 segundos, lo mayor<br>\n  5) Sin programas: redactar la justificación de No Aplica con firma del ejecutor y del revisor<br>\n  6) Procesar los datos crudos de tiempos en el módulo de análisis estadístico (cuando aplique) y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Temporizador y programas exactos, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de tiempos equipo contra referencia, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de tiempos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-010 — Recuperación tras apertura de puerta",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir la recuperación del <span class=\"equipo\">equipo</span> tras apertura de puerta, con duración definida según el uso real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Estabilizar el horno en su setpoint de trabajo y definir la duración de apertura según el uso real<br>\n  2) Abrir la puerta el tiempo definido, cerrarla y medir el tiempo de retorno a banda<br>\n  3) Repetir 3 veces y registrar cada recuperación<br>\n  4) Confirmar que el uso real queda cubierto por lo ensayado<br>\n  a) Recuperación dentro del límite en las 3 repeticiones<br>\n  5) Procesar los datos crudos de recuperación en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Recuperación en el tiempo previsto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de recuperación por repetición<br>\n  - Data cruda y reporte estadístico del análisis de recuperación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-011 — Mapeo en cada setpoint a calificar",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear el <span class=\"equipo\">equipo</span> en cada setpoint a calificar, con termopares distribuidos en esquinas, centro, cerca de puerta, de resistencias y de la salida de aire; el número de sensores se justifica por el volumen de la cámara."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Justificar el número de sensores por el volumen y distribuirlos según el plano (esquinas, centro, puerta, resistencias, salida de aire)<br>\n  2) Correr el mapeo por setpoint durante el periodo definido, registrando al intervalo establecido<br>\n  3) Calcular por sensor promedio, máximo y mínimo; ΔT entre sensores<br>\n  a) Uniformidad dentro de la tolerancia en todos los setpoints<br>\n  4) Procesar los datos crudos del mapeo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Mapeo conforme en todos los setpoints con sensores justificados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de sensores con justificación por volumen<br>\n  - Curvas y tabla por sensor y setpoint<br>\n  - Data cruda y reporte estadístico del análisis del mapeo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>OMS TRS 1010 Anexo 7; manual del fabricante."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-012 — Duración del estudio por setpoint",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Definir y justificar la duración del estudio con la cámara estable para cada setpoint."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fijar la duración por setpoint con su justificación (mínimo 24 h salvo justificación)<br>\n  2) Ejecutar el periodo completo sin interrupciones injustificadas<br>\n  3) Confirmar estabilidad sostenida durante todo el periodo<br>\n  a) Periodo completo ejecutado con estabilidad sostenida<br>\n  4) Procesar los datos crudos de duración en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Duración justificada y ejecutada con estabilidad sostenida."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación de la duración por setpoint<br>\n  - Data cruda y reporte estadístico del análisis de duración"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS del equipo; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-013 — Puntos frío y caliente y sensores representativos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Identificar el punto frío y el punto caliente del <span class=\"equipo\">equipo</span>, y verificar que el sensor de control y el de monitoreo están en posiciones representativas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con los datos del mapeo del ensayo EQ-OQ-HO-011, identificar los puntos extremos<br>\n  2) Declarar el punto frío y el caliente con su justificación<br>\n  3) Verificar la posición del sensor de control y del monitoreo contra los extremos<br>\n  4) Reubicar el monitoreo si no está en posición representativa y registrar la nueva posición<br>\n  a) Puntos identificados con sensores en posiciones representativas<br>\n  5) Procesar los datos crudos de extremos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Puntos identificados con monitoreo representativo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano con puntos extremos y posición de sensores<br>\n  - Data cruda y reporte estadístico del análisis de extremos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>OMS TRS 1010 Anexo 7."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-014 — Criterio sin excursiones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que todos los termopares están dentro de los límites del URS durante todo el estudio, con ΔT máximo entre sensores definido."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recopilar todos los registros de termopares del estudio<br>\n  2) Verificar punto por punto contra los límites del URS y el ΔT máximo definido<br>\n  3) Listar cualquier excursión con su investigación y disposición<br>\n  a) Cero excursiones fuera de URS, o excursiones investigadas y dispuestas<br>\n  4) Procesar los datos crudos de cumplimiento en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cumplimiento total URS sin excursiones abiertas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de cumplimiento por sensor y setpoint<br>\n  - Data cruda y reporte estadístico del análisis de cumplimiento<br>\n  - Investigaciones de excursión, si las hubo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS del equipo."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-015 — Registrador independiente frente a control y patrón",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Comparar el registrador independiente del <span class=\"equipo\">equipo</span> frente al sensor de control y al patrón de referencia, con diferencia dentro del criterio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar en paralelo control, registrador independiente y patrón durante una corrida nominal de 24 h<br>\n  2) Calcular las diferencias punto a punto entre las tres fuentes<br>\n  3) Confirmar que el registrador refleja fielmente el control y el patrón<br>\n  a) Diferencia del registrador dentro del criterio (±0,5 °C)<br>\n  4) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Registrador fiel al control y al patrón dentro del criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Comparativa de las tres fuentes con diferencias<br>\n  - Data cruda y reporte estadístico del análisis comparativo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-HO-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-016 — Intervalo de registro y marca de tiempo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el intervalo de registro y la exactitud de la marca de tiempo del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Configurar el intervalo declarado y correr 24 h<br>\n  2) Descargar el registro y verificar la regularidad del intervalo en todo el periodo<br>\n  3) Comparar la marca de tiempo contra hora oficial al inicio y al fin<br>\n  4) Confirmar que no hay huecos ni duplicados injustificados<br>\n  a) Intervalo regular con marca exacta<br>\n  5) Procesar los datos crudos de intervalos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Intervalo regular y marca de tiempo exacta."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Verificación de intervalos y deriva del reloj<br>\n  - Data cruda y reporte estadístico del análisis de intervalos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR Part 11; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "resumen",
    "id": "EQ-OQ-HO-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-RES — Tabla resumen de los ensayos del OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del OQ del horno de secado para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EQ-OQ-HO-001 a EQ-OQ-HO-016 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 16 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "tabla",
    "id": "EQ-OQ-HO-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-OQ-HO-REF — Referencias del OQ de horno de secado",
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
       "OMS TRS 1010 Anexo 7 — Mapeo, uniformidad y monitoreo de cámaras y hornos",
       "VIGENTE"
      ],
      [
       "6.2",
       "USP <1058> — Analytical Instrument Qualification: sensores y patrones asociados",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: la OQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "GAMP5 2.ª ed. — Challenge a funciones de seguridad, interlocks, alarmas e integridad de datos",
       "VIGENTE"
      ],
      [
       "6.5",
       "21 CFR Part 11 — Registros electrónicos: intervalo, marca de tiempo e integridad de datos",
       "VIGENTE"
      ],
      [
       "6.6",
       "Manual del fabricante del horno — Setpoints, alarmas, temporizador y límites de diseño",
       "VIGENTE"
      ]
     ]
    },
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de ciclos, curvas de temperatura y mapeos por setpoint</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de patrones e instrumentos, y planos de sensores</td></tr>\n<tr><td>8.3</td><td>Anexo C — Matrices de interlocks y alarmas, y evidencias de notificaciones</td></tr>\n</tbody></table>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO OQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Operación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Operación con las áreas involucradas, asegurando personal, <span class=\"equipo\">equipo</span>, bomba de vacío, instrumentos patrón y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar el inicio de la PQ.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Operación: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en el entorno seleccionado (USP &lt;1058&gt;).</p>",
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-001 — Parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia del <span class=\"equipo\">equipo</span> corta la calefacción y deja el horno en estado seguro, sin aporte de vacío inseguro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar IQ aprobada y <span class=\"equipo\">equipo</span> liberado para OQ, en calentamiento nominal con vacío aplicado<br>\n  2) Accionar la parada de emergencia y medir con cronómetro el tiempo hasta el corte de calefacción<br>\n  3) Confirmar el estado seguro (sin calentamiento, bomba según diseño fail-safe) y el mensaje en el controlador<br>\n  a) Corte efectivo dentro del límite del fabricante<br>\n  4) Sin rearmar, intentar arrancar y confirmar que queda impedido<br>\n  5) Rearmar según el fabricante y confirmar condición segura sin arranque solo<br>\n  6) Repetir por cada parada y dejar el <span class=\"equipo\">equipo</span> en condición segura"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Corte efectivo; estado seguro; sin arranque sin rearme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba con tiempos medidos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; GAMP5 2.ª ed."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-002 — Protección de sobretemperatura independiente",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la protección de sobretemperatura del <span class=\"equipo\">equipo</span> es independiente del control principal y corta la calefacción al llegar al límite."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar el termostato o controlador independiente y su setpoint (registrar el valor en °C y su fuente antes de iniciar)<br>\n  2) Inhabilitar el control principal según el procedimiento del fabricante, bajo supervisión<br>\n  3) Elevar la temperatura de forma controlada hasta el límite de seguridad<br>\n  4) Confirmar el corte de la calefacción por el dispositivo independiente y su alarma<br>\n  a) Corte efectivo al límite con el control principal inhabilitado<br>\n  5) Restituir el control principal, normalizar y confirmar operación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Protección independiente funcional al límite declarado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba con setpoint y respuesta"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-003 — Alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que cada alarma del <span class=\"equipo\">equipo</span> dispara en su límite y ejecuta su acción (alta y baja temperatura, falla de sensor y falla de vacío, si el equipo las tiene)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar las alarmas disponibles en el equipo con sus límites, con cronómetro y formato<br>\n  2) Provocar o simular alta temperatura y confirmar alarma con su acción<br>\n  a) Tiempo de respuesta menor a 5 segundos con acuse registrado<br>\n  3) Provocar o simular baja temperatura, falla de sensor (desconexión) y falla de vacío, según apliquen al modelo<br>\n  4) Acusar cada alarma disponible, normalizar y confirmar el retorno a operación con el histórico completo<br>\n  5) Registrar las alarmas que el modelo no tiene como No Aplica con justificación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las alarmas disponibles disparan, ejecutan su acción y quedan registradas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con límite, acción, tiempo y acuse"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; GAMP5 2.ª ed."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-004 — Puerta y vidrio de seguridad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el cierre, el enclavamiento y la protección contra implosión de la puerta y el vidrio del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar el vidrio (sin fisuras, rayaduras profundas ni delaminación) y su marco de protección<br>\n  2) Cerrar y confirmar el enclavamiento mecánico de la puerta antes de aplicar vacío<br>\n  3) Intentar arrancar el ciclo de vacío con la puerta mal cerrada y confirmar que queda impedido<br>\n  4) Con vacío aplicado, intentar abrir y confirmar el bloqueo<br>\n  a) Enclavamiento efectivo y vidrio íntegro<br>\n  5) Registrar el resultado con evidencia fotográfica del vidrio"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Puerta enclavada y vidrio íntegro con protección."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba con evidencia fotográfica"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-005 — Falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el estado seguro del <span class=\"equipo\">equipo</span> ante falla de energía y el comportamiento del vacío (la válvula no debe retroalimentar aceite de la bomba a la cámara)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Poner el <span class=\"equipo\">equipo</span> en calentamiento nominal con vacío aplicado y coordinar el corte real o simulado<br>\n  2) Cortar la energía, anotar la hora y confirmar el estado: calefacción cortada, alarmas y posición de válvulas<br>\n  3) Confirmar que no hay retroalimentación de aceite de la bomba hacia la cámara (válvula antirretorno o diseño)<br>\n  4) Esperar 5 minutos sin energía<br>\n  5) Restablecer y confirmar que no arranca solo y exige acción deliberada del operador<br>\n  6) Rearrancar manualmente, confirmar operación normal y verificar integridad de registros (ALCOA+)<br>\n  7) Anexar el registro del evento y la verificación de datos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estado seguro sin retroalimentación de aceite; sin arranque espontáneo; datos íntegros."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del evento con hora y verificación de datos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; GAMP5 2.ª ed.; 21 CFR Part 11."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-006 — Nivel de vacío y tiempo de evacuación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la presión mínima alcanzable del <span class=\"equipo\">equipo</span> y el tiempo de evacuación hasta el valor requerido por los métodos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con la cámara vacía, limpia y seca, cerrar y arrancar la evacuación registrando presión contra tiempo<br>\n  2) Medir la presión mínima sostenida y el tiempo hasta el valor requerido por los métodos<br>\n  3) Repetir 3 veces y comparar repetibilidad<br>\n  4) Confirmar que el vacío requerido por los métodos se alcanza con margen<br>\n  a) Presión mínima y tiempo dentro de lo previsto en las 3 repeticiones<br>\n  5) Procesar los datos crudos de evacuated en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vacío y tiempo conformes y repetibles."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de evacuación por repetición<br>\n  - Data cruda y reporte estadístico del análisis de evacuación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; métodos del laboratorio."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-007 — Exactitud del manómetro de vacío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud del manómetro del <span class=\"equipo\">equipo</span> frente a un patrón de referencia en varios puntos del rango."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Disponer del patrón de vacío calibrado conectado a la cámara o a toma equivalente<br>\n  2) Estabilizar en al menos 3 puntos del rango (alto, medio y bajo vacío) y comparar equipo contra patrón<br>\n  3) Registrar por punto ambas lecturas y la diferencia<br>\n  a) Diferencia dentro de la tolerancia del URS o del fabricante en los 3 puntos<br>\n  4) Procesar los datos crudos de exactitud en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud conforme en todo el rango."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de equipo contra patrón por punto<br>\n  - Data cruda y reporte estadístico del análisis de exactitud<br>\n  - Certificado del patrón de vacío"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; manual del fabricante."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-008 — Prueba de fuga (tasa de aumento de presión)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir el aumento de presión del <span class=\"equipo\">equipo</span> tras aislar la cámara, durante un tiempo definido, con criterio tomado de la URS."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Evacuar al nivel de trabajo, aislar la cámara (cerrar válvula a la bomba) y anotar la hora<br>\n  2) Registrar la presión a intervalos definidos durante el tiempo del ensayo (por ejemplo 10 min)<br>\n  3) Calcular la tasa de aumento (mbar/min) por regresión o diferencia<br>\n  4) Comparar contra el criterio de la URS registrado antes de iniciar<br>\n  a) Tasa menor o igual al criterio URS<br>\n  5) Procesar los datos crudos de fuga en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tasa de fuga dentro del criterio URS."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curva de aumento de presión con cálculo de tasa<br>\n  - Data cruda y reporte estadístico del análisis de fuga"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS del equipo; ASTM F2338 (concepto de decaimiento de vacío)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-009 — Estabilidad del vacío con calentamiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad del vacío del <span class=\"equipo\">equipo</span> durante el calentamiento y a la temperatura máxima."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Evacuar al nivel de trabajo y calentar hasta la temperatura máxima de uso<br>\n  2) Mantener 30 minutos registrando presión y temperatura cada 5 minutos<br>\n  3) Confirmar que el vacío se mantiene dentro de banda pese al desgasificado inicial<br>\n  a) Vacío estable dentro de banda durante el mantenimiento a T máxima<br>\n  4) Procesar los datos crudos de estabilidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vacío estable a temperatura máxima."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de presión y temperatura del mantenimiento<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-010 — Ventilación y purga con gas seco (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la válvula de ventilación y la purga con gas seco del <span class=\"equipo\">equipo</span> (nitrógeno): control, filtro y velocidad de ventilación sin remover el material."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el horno tiene purga con gas seco; si no, pasar al paso 6)<br>\n  2) Verificar el filtro de la línea de gas y su estado<br>\n  3) Ventilar de forma controlada midiendo el tiempo hasta presión atmosférica<br>\n  4) Confirmar que la velocidad de ventilación no remueve ni desplaza el material (prueba con placebo si aplica)<br>\n  a) Ventilación controlada sin remoción de material, con filtro íntegro<br>\n  5) Procesar los datos crudos de ventilación en el módulo de análisis estadístico (cuando aplique) y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  6) Sin purga: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ventilación controlada con filtro íntegro, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de ventilación con filtro, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de ventilación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-011 — Bomba de vacío y trampa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la bomba del <span class=\"equipo\">equipo</span>: estado del aceite o tipo de bomba seca, trampa fría y compatibilidad con los solventes que se evaporan."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar el tipo de bomba (aceite o seca) y registrar marca, modelo y mantenimiento vigente<br>\n  2) Si es de aceite: verificar nivel, color y fecha de cambio; si es seca: verificar horas y mantenimiento<br>\n  3) Verificar la trampa fría (si existe): temperatura, capacidad y drenaje<br>\n  4) Confirmar la compatibilidad con los solventes evaporados (tabla del fabricante o evaluación de riesgo)<br>\n  a) Bomba mantenida con trampa operativa y compatibilidad confirmada<br>\n  5) Registrar el resultado con el plan de mantenimiento asociado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Bomba apta y compatible con el uso previsto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Ficha de bomba y trampa con mantenimiento<br>\n  - Evaluación de compatibilidad con solventes"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; plan de mantenimiento."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-012 — Exactitud de temperatura por setpoint",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud del sensor de control del <span class=\"equipo\">equipo</span> frente a un patrón en cada setpoint de la tabla."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Disponer del patrón de referencia calibrado y de la tabla de setpoints aprobada<br>\n  2) Estabilizar en cada setpoint de la tabla (con vacío aplicado según método) y comparar control contra patrón<br>\n  3) Registrar por setpoint ambas lecturas y la diferencia<br>\n  a) Diferencia menor o igual a ±0,5 °C o la tolerancia del URS<br>\n  4) Repetir en todos los setpoints de la tabla<br>\n  5) Procesar los datos crudos de exactitud en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud conforme en todos los setpoints."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de setpoints con control contra patrón<br>\n  - Data cruda y reporte estadístico del análisis de exactitud<br>\n  - Certificado del patrón"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; manual del fabricante."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-013 — Estabilidad y sobreimpulso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad del control del <span class=\"equipo\">equipo</span> en setpoints bajo, medio y alto, y su sobreimpulso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fijar el setpoint bajo del rango, estabilizar y registrar cada 5 minutos durante 30 minutos<br>\n  2) Medir el sobreimpulso al alcanzar cada setpoint desde ambiente<br>\n  3) Repetir en setpoint medio y en setpoint alto<br>\n  4) Calcular por setpoint el promedio, el rango y el sobreimpulso máximo<br>\n  a) Estabilidad dentro de ±1 °C y sobreimpulso menor o igual al límite del fabricante<br>\n  5) Procesar los datos crudos de estabilidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estabilidad y sobreimpulso conformes en los tres setpoints."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de estabilidad y sobreimpulso por setpoint<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; manual del fabricante."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-014 — Calentamiento y recuperación con vacío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir el tiempo de calentamiento del <span class=\"equipo\">equipo</span> hasta el setpoint con vacío aplicado y el tiempo de recuperación tras ventilar y reabrir la puerta."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Partir del horno a temperatura ambiente, aplicar el vacío de trabajo y fijar el setpoint<br>\n  2) Medir con cronómetro el tiempo hasta entrar en banda y estabilizar<br>\n  3) Ventilar, abrir la puerta el tiempo definido, cerrar, re-evaporar y medir el tiempo de recuperación<br>\n  4) Repetir en un segundo setpoint representativo<br>\n  a) Tiempos dentro de lo previsto por el fabricante<br>\n  5) Procesar los datos crudos de tiempos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tiempos de calentamiento y recuperación conformes y repetibles."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de calentamiento y recuperación por setpoint<br>\n  - Data cruda y reporte estadístico del análisis de tiempos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-015 — Temporizador (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el temporizador del <span class=\"equipo\">equipo</span> frente a un cronómetro de referencia; si no tiene temporizador programable, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el horno tiene temporizador programable; si no, pasar al paso 4)<br>\n  2) Programar 3 tiempos y medir cada uno con el cronómetro de referencia<br>\n  3) Comparar tiempos del equipo contra la referencia<br>\n  a) Diferencia menor o igual a ±1% o ±5 segundos, lo mayor<br>\n  4) Sin temporizador: redactar la justificación de No Aplica con firma del ejecutor y del revisor<br>\n  5) Procesar los datos crudos de tiempos en el módulo de análisis estadístico (cuando aplique) y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Temporizador exacto, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de tiempos equipo contra referencia, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de tiempos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-016 — Mapeo con vacío de trabajo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear el <span class=\"equipo\">equipo</span> con el vacío de trabajo definido, en cada setpoint a calificar, con termopares distribuidos en bandejas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Justificar el número de sensores por el volumen y distribuirlos según el plano (esquinas, centro, cerca de puerta y de la fuente de calor)<br>\n  2) Aplicar el vacío de trabajo definido y correr el mapeo por setpoint durante el periodo establecido<br>\n  3) Calcular por sensor promedio, máximo y mínimo; ΔT entre sensores<br>\n  a) Uniformidad dentro de la tolerancia en todos los setpoints<br>\n  4) Procesar los datos crudos del mapeo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Mapeo conforme en todos los setpoints con sensores justificados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de sensores con justificación por volumen<br>\n  - Curvas y tabla por sensor y setpoint<br>\n  - Data cruda y reporte estadístico del análisis del mapeo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>DIN 12880 (hornos); OMS TRS 1010 Anexo 7."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-017 — Duración justificada por setpoint",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Definir y justificar la duración del mapeo del <span class=\"equipo\">equipo</span> por setpoint, con la cámara estable."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fijar la duración por setpoint con su justificación (mínimo 24 h salvo justificación)<br>\n  2) Ejecutar el periodo completo sin interrupciones injustificadas<br>\n  3) Confirmar estabilidad sostenida durante todo el periodo<br>\n  a) Periodo completo ejecutado con estabilidad sostenida<br>\n  4) Procesar los datos crudos de duración en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Duración justificada y ejecutada con estabilidad sostenida."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación de la duración por setpoint<br>\n  - Data cruda y reporte estadístico del análisis de duración"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS del equipo; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-OQ-VA-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-018 — Puntos frío y caliente con vacío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Identificar el punto frío y el caliente del <span class=\"equipo\">equipo</span> con vacío de trabajo, y ubicar el sensor de control respecto a ellos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con los datos del mapeo del ensayo EQ-OQ-VA-016, identificar los puntos extremos<br>\n  2) Declarar el punto frío y el caliente con su justificación<br>\n  3) Verificar la posición del sensor de control y del monitoreo contra los extremos<br>\n  4) Reubicar el monitoreo si no está en posición representativa y registrar la nueva posición<br>\n  a) Puntos identificados con sensores en posiciones representativas<br>\n  5) Procesar los datos crudos de extremos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Puntos identificados con monitoreo representativo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano con puntos extremos y posición de sensores<br>\n  - Data cruda y reporte estadístico del análisis de extremos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>DIN 12880 (hornos); OMS TRS 1010 Anexo 7."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "resumen",
    "id": "EQ-OQ-VA-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-RES — Tabla resumen de los ensayos del OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del OQ del horno de vacío para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EQ-OQ-VA-001 a EQ-OQ-VA-018 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 18 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "tabla",
    "id": "EQ-OQ-VA-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-OQ-VA-REF — Referencias del OQ de horno de vacío",
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
       "DIN 12880 — Aparatos eléctricos de laboratorio: hornos e incubadoras, desempeño térmico",
       "VIGENTE"
      ],
      [
       "6.2",
       "USP <1058> — Analytical Instrument Qualification: sensores y patrones asociados",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: la OQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.4",
       "GAMP5 2.ª ed. — Challenge a funciones de seguridad, interlocks, alarmas e integridad de datos",
       "VIGENTE"
      ],
      [
       "6.5",
       "21 CFR Part 11 — Registros electrónicos: intervalo, marca de tiempo e integridad de datos",
       "VIGENTE"
      ],
      [
       "6.6",
       "Manual del fabricante del horno de vacío — Vacío, setpoints, alarmas y límites de diseño",
       "VIGENTE"
      ]
     ]
    },
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de vacío, curvas de temperatura y mapeos por setpoint</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de patrones e instrumentos, y planos de sensores</td></tr>\n<tr><td>8.3</td><td>Anexo C — Matrices de interlocks y alarmas, y ficha de bomba y trampa</td></tr>\n</tbody></table>",
    "familia": "horno-vacio"
   }
  ],
  "PQ": [
   {
    "kind": "ensayo",
    "id": "EQ-PQ-COM-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-COM-001 — Verificación de los instrumentos y equipos a utilizar en el PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Asegurar que todos los equipos e instrumentos de medición, patrones y equipos de laboratorio utilizados en la Calificación de Desempeño del <span class=\"equipo\">equipo</span> están correctamente identificados y cuentan con calibración vigente que cubre toda la ejecución del PQ."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar cada instrumento requerido por los ensayos del PQ: patrones de temperatura y presión, termopares, manómetros, balanzas, equipos de laboratorio analítico y cronómetros<br>\n  2) Inspeccionar la etiqueta de calibración de cada instrumento y comprobar que su vigencia cubre todo el periodo de ejecución del PQ, aunque haya estado vigente durante la IQ y la OQ<br>\n  3) Registrar en la tabla correspondiente los datos de cada instrumento:<br>\n  a) Nombre del instrumento o equipo<br>\n  b) Fabricante y modelo<br>\n  c) Número de serie y código interno<br>\n  d) Fecha de última calibración y fecha de vencimiento<br>\n  4) Recopilar los certificados de calibración para su inclusión en los anexos del informe"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los instrumentos presentan calibración vigente que cubre la fecha de ejecución del PQ.<br>\n  La información registrada coincide con los certificados de calibración.<br>\n  Los certificados están disponibles y anexados al informe."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de instrumentos y equipos del PQ completada<br>\n  - Copias de los certificados de calibración"
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
    "id": "EQ-PQ-RC-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-001 — Tres lotes consecutivos a tamaño nominal y condiciones de rutina",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño consistente del reactor con tres lotes consecutivos a tamaño nominal y condiciones de rutina."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el protocolo de fabricación de rutina y sus parámetros de control<br>\n  2) Fabricar tres lotes consecutivos a tamaño nominal registrando todos los parámetros críticos<br>\n  3) Muestrear cada lote según el plan de muestreo aprobado<br>\n  4) Evaluar los atributos de calidad de cada lote contra especificación<br>\n  5) Procesar los datos crudos de los tres lotes en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los tres lotes cumplen todos los atributos de calidad.<br>\n  La variabilidad entre lotes está dentro de lo esperado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de los tres lotes con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de lotes consecutivos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-002 — Lote a volumen mínimo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño del reactor al volumen mínimo (donde más falla la mezcla, por el vórtice, la sumersión del impulsor y los puntos muertos)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fabricar un lote al volumen mínimo con el protocolo de rutina<br>\n  2) Registrar parámetros críticos con énfasis en mezcla y temperatura<br>\n  3) Muestrear superior, medio e inferior evaluando uniformidad<br>\n  4) Procesar los datos crudos del lote mínimo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El lote a volumen mínimo cumple todos los atributos de calidad.<br>\n  La uniformidad superior, medio e inferior cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del lote mínimo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de lote a volumen mínimo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-003 — Lote de peor caso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño del reactor en el peor caso definido (mayor viscosidad, mayor carga de sólidos, activo menos soluble o menor temperatura)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir y justificar el peor caso (mayor viscosidad, mayor carga de sólidos, activo menos soluble o menor temperatura)<br>\n  2) Fabricar el lote de peor caso registrando los parámetros críticos<br>\n  3) Muestrear según el plan de muestreo aprobado con énfasis en uniformidad<br>\n  4) Procesar los datos crudos del peor caso en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El lote de peor caso cumple todos los atributos de calidad.<br>\n  La justificación del peor caso está documentada y aprobada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación del peor caso y registro del lote con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Análisis de riesgo del proceso."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-004 — Tiempo de disolución del activo y de los excipientes",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Determinar el tiempo de disolución del activo y de los excipientes hasta ausencia de partículas visibles al final de la mezcla."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con el protocolo de rutina, registrar el tiempo desde la adición hasta la disolución completa<br>\n  2) Verificar ausencia de partículas visibles al final de la mezcla en cada lote PQ<br>\n  3) Repetir en los lotes de rutina, mínimo y peor caso<br>\n  4) Procesar los datos crudos de tiempos de disolución en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ausencia de partículas visibles al final de la mezcla en todos los lotes.<br>\n  Los tiempos de disolución están dentro de lo establecido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de tiempos de disolución con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de tiempo de disolución"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-005 — Uniformidad de mezcla en tanque y descarga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la uniformidad con muestras en superior, medio e inferior, y después de la descarga al inicio, a la mitad y al final, con criterio sobre la valoración (media y RSD)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear el tanque en superior, medio e inferior al final de la mezcla<br>\n  2) Muestrear la descarga al inicio, a la mitad y al final del lote<br>\n  3) Valorar cada muestra por el método aprobado<br>\n  4) Calcular media y RSD por punto y global<br>\n  5) Procesar los datos crudos de valoración en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La media y el RSD de cada punto cumplen el criterio de valoración.<br>\n  No existe tendencia significativa entre inicio, mitad y final de descarga."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plan de muestreo y valoraciones con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de uniformidad de mezcla"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de calidad del producto a granel."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-006 — Caracterización de suspensiones y emulsiones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar en suspensiones y emulsiones (si aplica): tamaño de partícula o de gota, viscosidad, redispersabilidad, sedimentación y estabilidad física a lo largo de la descarga."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el tamaño de partícula o de gota al inicio, mitad y final de la descarga (si aplica)<br>\n  2) Medir la viscosidad del granel en cada lote PQ<br>\n  3) Evaluar redispersabilidad y sedimentación según el método aprobado<br>\n  4) Verificar la estabilidad física a lo largo de la descarga<br>\n  5) Procesar los datos crudos de caracterización en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tamaño de partícula o gota, viscosidad y redispersabilidad cumplen especificación.<br>\n  Sin separación de fases durante la descarga."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de caracterización con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de suspensiones y emulsiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de calidad del producto a granel."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-007 — Atributos del producto a granel",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los atributos del producto a granel: pH, densidad, viscosidad, aspecto y claridad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir pH, densidad y viscosidad del granel en cada lote PQ con instrumentos calibrados<br>\n  2) Evaluar aspecto y claridad contra el patrón visual aprobado<br>\n  3) Registrar cada atributo por lote<br>\n  4) Procesar los datos crudos de atributos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los atributos cumplen la especificación del granel en cada lote.<br>\n  Aspecto y claridad conformes al patrón."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de atributos con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de atributos del granel"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de calidad del producto a granel."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-008 — Perfil de temperatura del producto real",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Registrar el perfil de temperatura del producto real durante calentamiento, mantenimiento y enfriamiento: tiempos y ausencia de sobrecalentamiento local en la pared."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Instrumentar el lote con termopares en producto y cerca de pared<br>\n  2) Registrar el perfil completo: calentamiento, mantenimiento y enfriamiento<br>\n  3) Determinar los tiempos de cada etapa y verificar ausencia de sobrecalentamiento local en la pared<br>\n  4) Procesar los datos crudos del perfil en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los tiempos de cada etapa cumplen lo establecido.<br>\n  Sin sobrecalentamiento local en la pared fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Perfiles de temperatura con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de perfil térmico del producto"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-009 — Degradación en activos termolábiles",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los productos de degradación al final del ciclo más exigente (si aplica, activos termolábiles)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar el ciclo más exigente térmicamente (si aplica, activos termolábiles)<br>\n  2) Muestrear el producto al final de dicho ciclo<br>\n  3) Cuantificar los productos de degradación por el método aprobado<br>\n  4) Procesar los datos crudos de degradación en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los productos de degradación no superan el límite especificado.<br>\n  El balance de masas es consistente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Cromatogramas y cuantificación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de degradación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de impurezas del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-010 — Uniformidad durante la transferencia y el llenado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la uniformidad durante la transferencia y el llenado con muestras al inicio, mitad y final del lote."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear el producto transferido al inicio, mitad y final del lote<br>\n  2) Valorar cada muestra por el método aprobado<br>\n  3) Calcular media y RSD por punto<br>\n  4) Procesar los datos crudos de valoración en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La media y el RSD de cada punto cumplen el criterio.<br>\n  Sin tendencia significativa durante la transferencia."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Valoraciones de transferencia con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de uniformidad en transferencia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de calidad del producto a granel."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-011 — Volumen residual y rendimiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Determinar el volumen residual (heel) en el tanque y las líneas, y el rendimiento del lote."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Al final de la descarga, recuperar y medir el volumen residual del tanque y las líneas<br>\n  2) Calcular el rendimiento del lote (producto obtenido contra teórico)<br>\n  3) Repetir en cada lote PQ<br>\n  4) Procesar los datos crudos de residual y rendimiento en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El volumen residual no supera el límite establecido.<br>\n  El rendimiento cumple el rango especificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de residual y rendimiento con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de volumen residual y rendimiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-012 — Formación de espuma e incorporación de aire",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Evaluar la formación de espuma e incorporación de aire (si aplica): densidad antes y después de la agitación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la densidad del producto antes de la agitación (si aplica evaluación de espuma)<br>\n  2) Medir la densidad después de la agitación de rutina<br>\n  3) Evaluar visualmente la espuma formada y su tiempo de colapso<br>\n  4) Procesar los datos crudos de densidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La diferencia de densidad está dentro de lo aceptado.<br>\n  La espuma colapsa dentro del tiempo establecido sin afectar la descarga."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de densidades con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de espuma e incorporación de aire"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de calidad del producto a granel."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-013 — Desempeño del filtro de proceso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el desempeño del filtro de proceso (si aplica): caudal, presión diferencial y ausencia de pérdida de activo por adsorción."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el caudal y la presión diferencial del filtro durante la transferencia del lote (si aplica)<br>\n  2) Valorar el activo antes y después del filtro para descartar pérdida por adsorción<br>\n  3) Verificar la integridad del filtro después del uso<br>\n  4) Procesar los datos crudos de caudal, diferencial y valoración en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Caudal y diferencial dentro de lo especificado durante la transferencia.<br>\n  Sin pérdida de activo por adsorción fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de filtración con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de desempeño del filtro"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR 26 (filtración, si aplica)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RC-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RC-014 — Control microbiológico y tiempo de espera del granel",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la carga microbiana del producto a granel y del agua (si aplica), y el tiempo de espera del granel antes de envasar."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear el granel para carga microbiana según el plan (si aplica)<br>\n  2) Verificar la calidad microbiológica del agua utilizada (si aplica)<br>\n  3) Registrar el tiempo de espera del granel antes de envasar contra el límite establecido<br>\n  4) Evaluar resultados contra la especificación microbiológica"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La carga microbiana cumple la especificación.<br>\n  El tiempo de espera no supera el límite validado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados microbiológicos y registro de tiempos de espera (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1111&gt; (límites microbianos, si aplica)."
     }
    ],
    "tabla": null,
    "familia": "reactor"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-001 — Tres lotes consecutivos a velocidad nominal",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño consistente de la tableteadora con tres lotes consecutivos a velocidad nominal, con el número justificado por análisis de riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Justificar el número de lotes con el análisis de riesgo aprobado<br>\n  2) Fabricar tres lotes consecutivos a velocidad nominal registrando los parámetros críticos<br>\n  3) Muestrear cada lote según el plan de muestreo aprobado<br>\n  4) Evaluar los atributos de calidad de cada lote contra especificación<br>\n  5) Procesar los datos crudos de los tres lotes en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los tres lotes cumplen todos los atributos de calidad.<br>\n  La variabilidad entre lotes está dentro de lo esperado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de los tres lotes con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de lotes consecutivos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt; (uniformidad de unidades de dosificación); EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-002 — Corrida a velocidad mínima y máxima",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño en los extremos del rango declarado (a mayor velocidad baja el tiempo de residencia y cambia el llenado), si aplica al rango operativo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fabricar una corrida a velocidad mínima registrando atributos críticos<br>\n  2) Fabricar una corrida a velocidad máxima registrando atributos críticos<br>\n  3) Muestrear inicio, mitad y final de cada corrida<br>\n  4) Procesar los datos crudos de ambas corridas en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ambas corridas cumplen todos los atributos de calidad.<br>\n  Sin deriva de peso atribuible a la velocidad fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de corridas extremas con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad mínima y máxima"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-003 — Lote de peor caso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño en el peor caso definido (granulado de menor fluidez, mayor finos, dureza máxima, fuerza más alta, o tableta más fina o con mayor tendencia a laminar)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir y justificar el peor caso con el análisis de riesgo aprobado<br>\n  2) Fabricar el lote de peor caso registrando los parámetros críticos<br>\n  3) Muestrear según el plan de muestreo aprobado<br>\n  4) Procesar los datos crudos del peor caso en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El lote de peor caso cumple todos los atributos de calidad.<br>\n  La justificación del peor caso está documentada y aprobada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación del peor caso y registro del lote con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Análisis de riesgo del proceso; USP &lt;905&gt;."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-004 — Muestreo al inicio, mitad y final de la corrida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los atributos con muestreo al inicio, a la mitad y al final de la corrida, y tras paros o ajustes."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear al inicio, a la mitad y al final de cada corrida PQ<br>\n  2) Muestrear adicionalmente tras cada paro o ajuste de la máquina<br>\n  3) Evaluar peso, espesor, dureza y friabilidad por punto<br>\n  4) Procesar los datos crudos por punto en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los puntos cumplen los atributos dentro de especificación.<br>\n  Sin tendencia significativa entre inicio, mitad y final."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plan de muestreo y resultados con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de muestreo por punto"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt;; plan de muestreo aprobado."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-005 — Peso individual y promedio, espesor, dureza y friabilidad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar peso individual y promedio (variación de peso), espesor, dureza y friabilidad en cada lote PQ."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pesar tabletas individuales y calcular promedio y variación de peso por lote<br>\n  2) Medir espesor y dureza con instrumentos calibrados<br>\n  3) Determinar la friabilidad según el método aprobado<br>\n  4) Procesar los datos crudos de atributos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Peso, espesor, dureza y friabilidad cumplen especificación en cada lote.<br>\n  La variación de peso cumple el criterio aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de atributos con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de atributos de tableta"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1216&gt; (friabilidad); USP &lt;1217&gt; (dureza); especificación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-006 — Uniformidad de dosis",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la uniformidad de dosis por variación de peso o uniformidad de contenido, según la especificación del producto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar el método de la especificación (variación de peso o uniformidad de contenido)<br>\n  2) Evaluar las unidades requeridas por lote según USP &lt;905&gt;<br>\n  3) Calcular el valor de aceptación en cada lote<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El valor de aceptación cumple USP &lt;905&gt; en cada lote.<br>\n  Sin unidades fuera de los límites individuales."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Valoraciones y cálculo de aceptación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de uniformidad de dosis"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt; (uniformidad de unidades de dosificación)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-007 — Desintegración y disolución del producto terminado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la desintegración y la disolución del producto terminado en cada lote PQ."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Determinar la desintegración según el método aprobado en cada lote<br>\n  2) Determinar el perfil de disolución según el método aprobado en cada lote<br>\n  3) Registrar los resultados por lote y punto de muestreo<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Desintegración y disolución cumplen especificación en cada lote.<br>\n  Sin diferencias significativas entre lotes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados de desintegración y disolución con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de desintegración y disolución"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;701&gt; (desintegración); USP &lt;711&gt; (disolución)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-008 — Aspecto de la tableta",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el aspecto: sin laminación, capping, pegado (sticking, picking), descostrado ni manchas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar visualmente las muestras de cada lote contra el patrón de defectos<br>\n  2) Clasificar y contar defectos por tipo (laminación, capping, sticking, picking, descostrado, manchas)<br>\n  3) Registrar los defectos por lote y punto de muestreo<br>\n  4) Procesar los datos crudos de defectos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los defectos están dentro del nivel aceptado por tipo.<br>\n  Sin defectos críticos en ningún lote."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de defectos con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de aspecto"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Patrón de defectos aprobado; especificación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-009 — Uniformidad entre estaciones (variación por punzón)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la variación de peso y de dureza por estación de punzón (todas las estaciones o una muestra justificada), para detectar punzones con desgaste, holgura o llenado desigual."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir las estaciones a evaluar (todas o muestra justificada por riesgo)<br>\n  2) Recoger tabletas por estación identificada durante la corrida<br>\n  3) Medir peso y dureza por estación<br>\n  4) Procesar los datos crudos por estación en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las estaciones evaluadas cumplen peso y dureza.<br>\n  Ninguna estación se desvía significativamente del promedio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados por estación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis entre estaciones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt;; análisis de riesgo (muestra de estaciones)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-010 — Estabilidad de la fuerza durante la corrida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad de la fuerza de compresión, precompresión y eyección durante toda la corrida, con tendencia y sin deriva."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la fuerza de compresión, precompresión y eyección a intervalos definidos durante la corrida<br>\n  2) Graficar la tendencia de cada fuerza contra el tiempo<br>\n  3) Evaluar deriva y variabilidad<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las fuerzas se mantienen en banda sin deriva durante la corrida.<br>\n  La variabilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tendencias de fuerza con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad de fuerza"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-011 — Control automático de peso con producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el control automático de peso con producto (si aplica) mantiene el peso dentro de límites durante la corrida y corrige derivas sin oscilar."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar la corrida con el control automático activo (si aplica)<br>\n  2) Registrar el peso promedio reportado por el sistema contra verificaciones manuales<br>\n  3) Verificar la corrección de derivas sin oscilación<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El peso se mantiene dentro de límites durante toda la corrida.<br>\n  Las correcciones no generan oscilación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del control con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de control de peso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema de control."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-012 — Fluidez del granulado en tolva y alimentador",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la fluidez y el flujo del granulado en tolva y alimentador: sin puentes, sin canalización y sin variación de llenado por nivel bajo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Observar el flujo en tolva y alimentador durante la corrida<br>\n  2) Registrar eventos de puentes, canalización o interrupciones de flujo<br>\n  3) Verificar el llenado con nivel bajo de tolva<br>\n  4) Procesar los datos crudos de peso contra nivel en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Flujo continuo sin puentes ni canalización.<br>\n  Sin variación de llenado atribuible al nivel bajo fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de flujo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de fluidez"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del granulado; análisis de riesgo."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-013 — Segregación en tolva",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la segregación en tolva (si aplica): contenido del activo al inicio, medio y final de la corrida."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear el granulado o las tabletas al inicio, medio y final de la corrida (si aplica evaluación de segregación)<br>\n  2) Valorar el contenido de activo en cada punto<br>\n  3) Comparar los tres puntos entre sí<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin diferencia significativa de contenido entre inicio, medio y final.<br>\n  El contenido cumple especificación en los tres puntos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Valoraciones por punto con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de segregación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt;; análisis de riesgo."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-014 — Rechazo automático con producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que con producto las tabletas fuera de límites se rechazan y las buenas no."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Durante la corrida PQ, registrar las tabletas rechazadas por el sistema automático<br>\n  2) Verificar una muestra de rechazadas: corresponden a causa real (fuera de límites)<br>\n  3) Verificar que las tabletas buenas no se desvían al rechazo<br>\n  4) Procesar los datos crudos de rechazo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las rechazadas corresponden a causa real verificable.<br>\n  Sin desvío indebido de tabletas buenas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de rechazo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de rechazo con producto"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-015 — Generación de polvo y desempeño de la extracción",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la generación de polvo y finos durante la corrida con producto, y el desempeño de la extracción."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la presión negativa y el caudal de extracción durante la corrida<br>\n  2) Recoger y pesar el polvo retenido en el sistema de extracción por lote<br>\n  3) Inspeccionar la cámara de compresión al final: sin acumulación indebida<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La extracción mantiene los parámetros durante toda la corrida.<br>\n  El polvo generado está dentro de lo esperado sin acumulación indebida."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de extracción y polvo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de polvo y extracción"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-016 — Rendimiento y balance de masa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el rendimiento y el balance de masa: carga contra tabletas buenas, rechazos y pérdida de polvo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pesar la carga inicial de granulado de cada lote<br>\n  2) Pesar tabletas buenas, rechazos y polvo recogido al final<br>\n  3) Calcular el rendimiento y cerrar el balance de masa<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El rendimiento cumple el rango especificado.<br>\n  El balance de masa cierra dentro de tolerancia."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Balances de masa con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de rendimiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-017 — Operación continua durante la duración máxima del lote",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la operación continua durante la duración más larga prevista de un lote (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar de forma continua durante la duración más larga prevista (si aplica)<br>\n  2) Registrar parámetros críticos y atributos a intervalos definidos<br>\n  3) Registrar intervenciones, paros y alarmas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La máquina sostiene la operación continua sin deriva fuera de criterio.<br>\n  Los atributos se mantienen en especificación durante toda la duración."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de operación continua con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de operación continua"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-018 — Paros y reinicios",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el comportamiento tras una detención y reanudación (si aplica): descarte del material afectado y retorno a especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar una detención controlada durante la corrida (si aplica evaluación)<br>\n  2) Registrar el material afectado y aplicar el descarte definido<br>\n  3) Reanudar y verificar el retorno a especificación<br>\n  4) Procesar los datos crudos del antes y después en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El material afectado se descarta según lo definido.<br>\n  Tras la reanudación los atributos retornan a especificación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de paro y reanudación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de paros y reinicios"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Procedimiento de operación de la tableteadora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-TB-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-TB-019 — Variación de humedad ambiental en producto higroscópico",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el efecto de la variación de humedad ambiental (si aplica, producto higroscópico) sobre los atributos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la humedad ambiental durante cada corrida PQ (si aplica, producto higroscópico)<br>\n  2) Correlacionar humedad contra peso, dureza y friabilidad<br>\n  3) Verificar el control ambiental del área durante las corridas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro del rango ambiental controlado los atributos cumplen especificación.<br>\n  El rango ambiental queda establecido y documentado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros ambientales con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de humedad ambiental"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; control ambiental del área."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "tableteadora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-001 — Tres lotes consecutivos a velocidad nominal",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño consistente con tres lotes consecutivos a velocidad nominal, justificado por análisis de riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Justificar el número de lotes con el análisis de riesgo aprobado<br>\n  2) Fabricar tres lotes consecutivos a velocidad nominal registrando parámetros críticos<br>\n  3) Muestrear cada lote según el plan de muestreo aprobado<br>\n  4) Evaluar los atributos de calidad de cada lote contra especificación<br>\n  5) Procesar los datos crudos de los tres lotes en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los tres lotes cumplen todos los atributos de calidad.<br>\n  La variabilidad entre lotes está dentro de lo esperado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de los tres lotes con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de lotes consecutivos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt; (uniformidad de unidades de dosificación); EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-002 — Corrida a velocidad mínima y máxima",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño en los extremos del rango declarado (a mayor velocidad baja el tiempo de llenado del orificio de dosificación), si aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fabricar una corrida a velocidad mínima registrando atributos críticos<br>\n  2) Fabricar una corrida a velocidad máxima registrando atributos críticos<br>\n  3) Muestrear inicio, mitad y final de cada corrida<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ambas corridas cumplen todos los atributos de calidad.<br>\n  Sin llenado incompleto atribuible a la velocidad fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de corridas extremas con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad mínima y máxima"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-003 — Lote de peor caso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño en el peor caso definido (polvo de menor fluidez o menor densidad aparente, tamaño de cápsula más pequeño o más grande, peso de llenado mínimo y máximo)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir y justificar el peor caso con el análisis de riesgo aprobado<br>\n  2) Fabricar el lote de peor caso registrando los parámetros críticos<br>\n  3) Muestrear según el plan de muestreo aprobado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El lote de peor caso cumple todos los atributos de calidad.<br>\n  La justificación del peor caso está documentada y aprobada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación del peor caso y registro del lote con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Análisis de riesgo del proceso; USP &lt;905&gt;."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-004 — Muestreo al inicio, mitad y final de la corrida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los atributos con muestreo al inicio, a la mitad y al final de la corrida, y tras paros o ajustes."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear al inicio, a la mitad y al final de cada corrida PQ<br>\n  2) Muestrear adicionalmente tras cada paro o ajuste<br>\n  3) Evaluar peso de llenado, cierre y aspecto por punto<br>\n  4) Procesar los datos crudos por punto en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los puntos cumplen los atributos dentro de especificación.<br>\n  Sin tendencia significativa entre inicio, mitad y final."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plan de muestreo y resultados con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de muestreo por punto"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt;; plan de muestreo aprobado."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-005 — Peso neto de llenado individual y promedio",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el peso neto de llenado individual y promedio: cápsula llena menos la tara de la cápsula vacía del mismo lote."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tarar cápsulas vacías del mismo lote<br>\n  2) Pesar cápsulas llenas y calcular el neto individual y promedio<br>\n  3) Evaluar la variación de peso contra el criterio<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El peso neto cumple especificación individual y promedio.<br>\n  La variación de peso cumple el criterio aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de peso neto con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de peso de llenado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-006 — Uniformidad de unidades de dosificación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la uniformidad por variación de peso o uniformidad de contenido, según la farmacopea y la especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar el método de la especificación (variación de peso o uniformidad de contenido)<br>\n  2) Evaluar las unidades requeridas por lote según USP &lt;905&gt;<br>\n  3) Calcular el valor de aceptación en cada lote<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El valor de aceptación cumple USP &lt;905&gt; en cada lote.<br>\n  Sin unidades fuera de los límites individuales."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Valoraciones y cálculo de aceptación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de uniformidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt; (uniformidad de unidades de dosificación)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-007 — Longitud de cierre y aspecto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la longitud de cierre y el aspecto: sin separación, abolladuras, perforaciones, polvo en el exterior ni cápsulas sin tapa."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la longitud de cierre en la muestra de cada lote<br>\n  2) Inspeccionar aspecto contra el patrón de defectos<br>\n  3) Clasificar y contar defectos por tipo<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La longitud de cierre está dentro de especificación.<br>\n  Los defectos están dentro del nivel aceptado sin defectos críticos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de cierre y aspecto con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cierre y aspecto"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Patrón de defectos aprobado; especificación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-008 — Desintegración y disolución del producto terminado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la desintegración y la disolución del producto terminado en cada lote PQ."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Determinar la desintegración según el método aprobado en cada lote<br>\n  2) Determinar el perfil de disolución según el método aprobado en cada lote<br>\n  3) Registrar los resultados por lote y punto de muestreo<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Desintegración y disolución cumplen especificación en cada lote.<br>\n  Sin diferencias significativas entre lotes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de desintegración y disolución"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;701&gt; (desintegración); USP &lt;711&gt; (disolución)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-009 — Uniformidad entre estaciones de dosificación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el peso por segmento o por estación de dosificación (si aplica): detecta orificios o pistones con desgaste o llenado desigual que el promedio oculta."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir los segmentos o estaciones a evaluar (si aplica)<br>\n  2) Recoger cápsulas por segmento durante la corrida<br>\n  3) Pesar el llenado neto por segmento<br>\n  4) Procesar los datos crudos por segmento en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los segmentos evaluados cumplen el peso de llenado.<br>\n  Ningún segmento se desvía significativamente del promedio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados por segmento con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis entre estaciones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt;; análisis de riesgo."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-010 — Estabilidad del peso de llenado durante la corrida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad del peso de llenado durante toda la corrida, con tendencia y sin deriva."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el peso de llenado a intervalos definidos durante la corrida<br>\n  2) Graficar la tendencia contra el tiempo<br>\n  3) Evaluar deriva y variabilidad<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El peso se mantiene en banda sin deriva.<br>\n  La variabilidad cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tendencia de peso con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad de llenado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-011 — Flujo del polvo en la tolva",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el flujo del polvo en la tolva: sin puentes ni canalización, y llenado estable al bajar el nivel."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Observar el flujo en tolva durante la corrida<br>\n  2) Registrar eventos de puentes o canalización<br>\n  3) Verificar el llenado con nivel bajo de tolva<br>\n  4) Procesar los datos crudos de peso contra nivel en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Flujo continuo sin puentes ni canalización.<br>\n  Sin variación de llenado atribuible al nivel bajo fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de flujo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de flujo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del polvo; análisis de riesgo."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-012 — Segregación en tolva",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la segregación en tolva (si aplica): contenido del activo al inicio, medio y final."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear al inicio, medio y final de la corrida (si aplica evaluación)<br>\n  2) Valorar el contenido de activo en cada punto<br>\n  3) Comparar los tres puntos entre sí<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin diferencia significativa entre inicio, medio y final.<br>\n  El contenido cumple especificación en los tres puntos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Valoraciones por punto con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de segregación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt;; análisis de riesgo."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-013 — Rechazo automático con producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que con producto se rechazan las cápsulas fuera de límites y no las buenas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Durante la corrida PQ, registrar las cápsulas rechazadas por el sistema<br>\n  2) Verificar una muestra de rechazadas: corresponden a causa real<br>\n  3) Verificar que las cápsulas buenas no se desvían al rechazo<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las rechazadas corresponden a causa real verificable.<br>\n  Sin desvío indebido de cápsulas buenas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de rechazo con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de rechazo con producto"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-014 — Generación de polvo y desempeño de extracción",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la generación de polvo durante la corrida con producto y el desempeño de la extracción y del desempolvado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la presión negativa y el caudal durante la corrida<br>\n  2) Recoger y pesar el polvo retenido por lote<br>\n  3) Inspeccionar la cámara al final: sin acumulación indebida<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La extracción mantiene los parámetros durante la corrida.<br>\n  El polvo generado está dentro de lo esperado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de polvo y extracción"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-015 — Rendimiento y balance de masa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el rendimiento y el balance de masa: carga contra cápsulas buenas, rechazos (incluidas las vacías) y pérdida de polvo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pesar la carga inicial de polvo y las cápsulas vacías de cada lote<br>\n  2) Contar y pesar cápsulas buenas, rechazos (incluidas vacías) y polvo recogido<br>\n  3) Cerrar el balance de masa<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El rendimiento cumple el rango especificado.<br>\n  El balance de masa cierra dentro de tolerancia."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Balances de masa con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de rendimiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-016 — Operación continua durante la duración máxima del lote",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la operación continua durante la duración más larga prevista de un lote (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar de forma continua durante la duración más larga prevista (si aplica)<br>\n  2) Registrar parámetros críticos y atributos a intervalos definidos<br>\n  3) Registrar intervenciones, paros y alarmas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Operación continua sin deriva fuera de criterio.<br>\n  Los atributos se mantienen en especificación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de operación continua"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-017 — Paros y reinicios",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el comportamiento tras una detención y reanudación (si aplica) y el descarte del material afectado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Provocar una detención controlada durante la corrida (si aplica evaluación)<br>\n  2) Registrar el material afectado y aplicar el descarte definido<br>\n  3) Reanudar y verificar el retorno a especificación<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El material afectado se descarta según lo definido.<br>\n  Tras la reanudación los atributos retornan a especificación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de paros y reinicios"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Procedimiento de operación de la encapsuladora."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-EN-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-EN-018 — Humedad ambiental en cápsulas de gelatina",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el efecto de la humedad ambiental baja o alta (si aplica): las cápsulas de gelatina se vuelven frágiles o blandas fuera de su rango, y eso afecta la separación y el cierre."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la humedad ambiental durante cada corrida PQ (si aplica)<br>\n  2) Correlacionar humedad contra separación, cierre y defectos<br>\n  3) Verificar el control ambiental del área<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro del rango ambiental controlado los atributos cumplen especificación.<br>\n  El rango ambiental queda establecido y documentado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros ambientales con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de humedad ambiental"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de la cápsula; control ambiental del área."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "encapsuladora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-001 — Tres lotes consecutivos a tamaño nominal",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño consistente con tres lotes consecutivos a tamaño nominal, con el número justificado por análisis de riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Justificar el número de lotes con el análisis de riesgo aprobado<br>\n  2) Fabricar tres lotes consecutivos a tamaño nominal registrando parámetros críticos<br>\n  3) Muestrear cada lote según el plan de muestreo aprobado<br>\n  4) Evaluar los atributos del granulado de cada lote contra especificación<br>\n  5) Procesar los datos crudos de los tres lotes en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los tres lotes cumplen todos los atributos de calidad.<br>\n  La variabilidad entre lotes está dentro de lo esperado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de los tres lotes con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de lotes consecutivos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; análisis de riesgo del proceso."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-002 — Lote mínimo y máximo del rango declarado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño en los extremos del rango declarado (el mínimo es el más crítico porque el impulsor puede quedar parcialmente descubierto), si aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fabricar un lote al tamaño mínimo registrando el cubrimiento del impulsor<br>\n  2) Fabricar un lote al tamaño máximo<br>\n  3) Muestrear según el plan de muestreo aprobado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ambos lotes cumplen todos los atributos de calidad.<br>\n  A tamaño mínimo el impulsor opera cubierto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de lotes extremos con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de rango declarado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-003 — Lote de peor caso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño en el peor caso definido (materia prima más higroscópica, mayor humedad de entrada, activo de menor fluidez, mayor concentración de aglutinante, o mayor tiempo de adición)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir y justificar el peor caso con el análisis de riesgo aprobado<br>\n  2) Fabricar el lote de peor caso registrando los parámetros críticos<br>\n  3) Muestrear según el plan de muestreo aprobado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El lote de peor caso cumple todos los atributos de calidad.<br>\n  La justificación del peor caso está documentada y aprobada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación del peor caso y registro del lote con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Análisis de riesgo del proceso."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-004 — Perfil de potencia o torque durante la granulación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el perfil de potencia o torque durante toda la granulación: forma, valor al punto final y repetibilidad entre lotes."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el perfil de potencia o torque en cada lote PQ<br>\n  2) Determinar la forma del perfil y el valor al punto final<br>\n  3) Comparar los perfiles entre lotes<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La forma del perfil es consistente entre lotes.<br>\n  El valor al punto final está dentro de la banda aprobada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Perfiles de potencia con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de perfil de potencia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-005 — Adición del aglutinante con producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la adición del aglutinante: tiempo, caudal real y cantidad total, sin acumulación en paredes ni formación de masas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el tiempo, el caudal real y la cantidad total adicionada en cada lote<br>\n  2) Inspeccionar paredes y tapa: sin acumulación ni formación de masas<br>\n  3) Comparar contra lo definido en el protocolo de fabricación<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tiempo, caudal y cantidad cumplen lo definido.<br>\n  Sin acumulación en paredes ni masas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de adición con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de adición"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-006 — Confirmación del criterio de punto final",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar el criterio de punto final: por potencia, por tiempo o por una combinación. Debe responder a variaciones de humedad o de materia prima, y no ser solo un valor fijo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar el criterio de punto final definido (potencia, tiempo o combinación)<br>\n  2) Verificar su respuesta ante variaciones de humedad o materia prima entre lotes<br>\n  3) Confirmar que el criterio discrimina el punto correcto (atributos del granulado)<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El criterio responde a variaciones y no es un valor fijo ciego.<br>\n  El granulado en el punto final cumple atributos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación del punto final con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de punto final"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-007 — Temperatura de la masa durante el amasado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la temperatura de la masa durante el amasado (si aplica, especialmente si el activo es termolábil)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la temperatura de la masa durante el amasado en cada lote (si aplica)<br>\n  2) Verificar que no supera el límite para activos termolábiles<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La temperatura de la masa no supera el límite especificado.<br>\n  Sin excursiones fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros térmicos con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de temperatura de masa"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto (activos termolábiles)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-008 — Muestreo del granulado en cuba y descarga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los atributos con muestreo en varias ubicaciones al final (superior, medio, inferior y cerca de pared) y durante la descarga (inicio, medio y fin)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear superior, medio, inferior y cerca de pared al final del amasado<br>\n  2) Muestrear la descarga al inicio, medio y fin<br>\n  3) Evaluar humedad y aspecto por punto<br>\n  4) Procesar los datos crudos por punto en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los puntos cumplen dentro de especificación.<br>\n  Sin diferencias significativas entre ubicaciones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plan de muestreo y resultados con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de muestreo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Plan de muestreo aprobado."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-009 — Humedad del granulado húmedo y residual",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la humedad del granulado húmedo y, tras el secado, la humedad residual (con referencia cruzada al protocolo del secador)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la humedad del granulado húmedo al final del amasado<br>\n  2) Medir la humedad residual tras el secado según el protocolo del secador<br>\n  3) Referenciar los resultados al protocolo del secador correspondiente<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La humedad del granulado húmedo está en el rango definido.<br>\n  La humedad residual cumple especificación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de humedad con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de humedad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo del secador (referencia cruzada)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-010 — Distribución de tamaño, densidades y fluidez",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la distribución de tamaño de partícula, densidad aparente y compactada, y fluidez del granulado seco o calibrado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Determinar la distribución de tamaño de partícula por tamizado<br>\n  2) Medir densidad aparente, compactada y calcular el índice de compresibilidad<br>\n  3) Medir la fluidez (ángulo de reposo o caudal por orificio)<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Distribución, densidades y fluidez cumplen especificación.<br>\n  Sin finos excesivos fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Granulometrías y densidades con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis granulométrico"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;786&gt; (tamizado); USP &lt;616&gt; (densidad)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-011 — Uniformidad de contenido del activo en granulado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la uniformidad de contenido del activo (valoración en granulado, media y RSD) para demostrar que no hay segregación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Valorar el activo en las muestras de cuba y descarga<br>\n  2) Calcular media y RSD por lote<br>\n  3) Comparar contra el criterio de uniformidad<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La media y el RSD cumplen el criterio en cada lote.<br>\n  Sin evidencia de segregación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Valoraciones con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de uniformidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt; (criterio aplicable)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-012 — Aspecto del granulado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el aspecto: sin grumos, sin material pegado a las paredes y sin zonas sobrehúmedas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar visualmente el granulado de cada lote<br>\n  2) Inspeccionar paredes y tapa de la cuba tras la descarga<br>\n  3) Clasificar hallazgos (grumos, pegado, zonas sobrehúmedas)<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin grumos ni zonas sobrehúmedas fuera de criterio.<br>\n  Sin pegado significativo en paredes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de aspecto con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de aspecto"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del granulado."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-013 — Estado del lecho durante el amasado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el estado del lecho durante el amasado: sin adherencia excesiva al impulsor ni a la cuba, sin sobrecarga de motor."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Observar el movimiento del lecho durante el amasado<br>\n  2) Verificar ausencia de adherencia excesiva al impulsor y a la cuba<br>\n  3) Registrar la corriente del motor durante el amasado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Movimiento del lecho adecuado sin adherencia excesiva.<br>\n  Sin sobrecarga del motor."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del lecho"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de operación del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-014 — Descarga y rendimiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la descarga y el rendimiento: balance de masa entre carga y descarga, material residual en la cuba y pérdida de polvo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pesar la carga inicial de cada lote<br>\n  2) Pesar el granulado descargado, el residual de cuba y el polvo recogido<br>\n  3) Cerrar el balance de masa<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El rendimiento cumple el rango especificado.<br>\n  El balance de masa cierra dentro de tolerancia."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Balances de masa con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de descarga y rendimiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-015 — Molino o calibrador de descarga con producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el molino o calibrador de descarga (si aplica): rendimiento y distribución de tamaño tras la molienda en húmedo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pasar el granulado húmedo por el molino o calibrador (si aplica)<br>\n  2) Determinar el rendimiento de la molienda<br>\n  3) Medir la distribución de tamaño tras la molienda<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El rendimiento de molienda cumple lo especificado.<br>\n  La distribución tras la molienda está en especificación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de molienda con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del molino"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del granulador."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-GR-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-GR-016 — Aptitud del granulado para la siguiente etapa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la compresibilidad o aptitud del granulado para la siguiente etapa (si aplica): fluidez, dureza de tabletas o llenado de cápsulas en una prueba de desafío."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar la prueba de desafío definida (compresión de tabletas o llenado de cápsulas con el granulado, si aplica)<br>\n  2) Medir fluidez y atributos resultantes<br>\n  3) Comparar contra los criterios de aptitud<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El granulado es apto para la siguiente etapa según la prueba de desafío.<br>\n  Los atributos resultantes cumplen especificación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados de la prueba de desafío con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de aptitud"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "granulador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-001 — Tres lotes consecutivos a carga nominal",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño consistente con tres lotes consecutivos a carga nominal, con el número justificado por análisis de riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Justificar el número de lotes con el análisis de riesgo aprobado<br>\n  2) Fabricar tres lotes consecutivos a carga nominal registrando parámetros críticos<br>\n  3) Muestrear cada lote según el plan de muestreo aprobado<br>\n  4) Evaluar los atributos de calidad de cada lote contra especificación<br>\n  5) Procesar los datos crudos de los tres lotes en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los tres lotes cumplen todos los atributos de calidad.<br>\n  La variabilidad entre lotes está dentro de lo esperado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de los tres lotes con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de lotes consecutivos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; análisis de riesgo del proceso."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-002 — Carga mínima y máxima",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño en los extremos de carga (con poca carga el lecho no cubre la sonda ni se mueve bien, y con mucha carga la aspersión llega menos a las tabletas inferiores), si aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fabricar un lote a carga mínima registrando el movimiento del lecho<br>\n  2) Fabricar un lote a carga máxima<br>\n  3) Muestrear según el plan de muestreo aprobado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ambos lotes cumplen todos los atributos de calidad.<br>\n  Movimiento del lecho adecuado en ambos extremos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de cargas extremas con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de carga mínima y máxima"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-003 — Lote de peor caso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño en el peor caso definido (núcleo más friable o higroscópico, mayor aumento de peso, mayor caudal de spray, y condiciones ambientales más húmedas)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir y justificar el peor caso con el análisis de riesgo aprobado<br>\n  2) Fabricar el lote de peor caso registrando los parámetros críticos<br>\n  3) Muestrear según el plan de muestreo aprobado<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El lote de peor caso cumple todos los atributos de calidad.<br>\n  La justificación del peor caso está documentada y aprobada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación del peor caso y registro del lote con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Análisis de riesgo del proceso."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-004 — Aumento de peso promedio",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el aumento de peso promedio: peso de una muestra grande (por ejemplo 100 tabletas) antes y después del recubrimiento."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pesar la muestra grande antes del recubrimiento<br>\n  2) Pesar la misma muestra después del recubrimiento<br>\n  3) Calcular el aumento de peso porcentual<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El aumento de peso está dentro del rango especificado.<br>\n  La repetibilidad entre lotes cumple el criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de aumento de peso con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de aumento de peso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto recubierto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-005 — Uniformidad entre tabletas (dispersión del recubrimiento)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la uniformidad entre tabletas: peso individual de una muestra al final, para ver la dispersión del recubrimiento (RSD) y no solo el promedio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pesar tabletas individuales de la muestra final<br>\n  2) Calcular media, desviación y RSD del aumento de peso<br>\n  3) Comparar contra el criterio de uniformidad<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El RSD entre tabletas cumple el criterio especificado.<br>\n  Sin tabletas fuera de los límites individuales."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Pesos individuales con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de uniformidad entre tabletas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto recubierto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-006 — Uniformidad de color entre ubicaciones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la uniformidad de color (si aplica): colorímetro (ΔE) entre tabletas de ubicaciones distintas del lote."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tomar tabletas de distintas ubicaciones del lote (si aplica evaluación de color)<br>\n  2) Medir el color con colorímetro calibrado y calcular ΔE<br>\n  3) Comparar entre ubicaciones<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El ΔE entre ubicaciones cumple el criterio especificado.<br>\n  Sin diferencias visuales fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Mediciones de color con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de color"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de color del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-007 — Uniformidad entre ubicaciones del bombo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la uniformidad entre ubicaciones: muestras tomadas de distintas zonas del bombo al final."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear distintas zonas del bombo al final del recubrimiento<br>\n  2) Determinar el aumento de peso por zona<br>\n  3) Comparar las zonas entre sí<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todas las zonas cumplen el aumento de peso.<br>\n  Sin zona significativamente distinta."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados por zona con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis entre ubicaciones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Plan de muestreo aprobado."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-008 — Aspecto de la tableta recubierta",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el aspecto: sin pegado entre tabletas (twinning), piel de naranja, erosión de bordes, pérdida de logotipo (bridging), grietas ni manchas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Inspeccionar visualmente las muestras de cada lote contra el patrón de defectos<br>\n  2) Clasificar y contar defectos por tipo<br>\n  3) Registrar los defectos por lote"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los defectos están dentro del nivel aceptado por tipo.<br>\n  Sin defectos críticos en ningún lote."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de defectos (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Patrón de defectos aprobado; especificación del producto."
     }
    ],
    "tabla": null,
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-009 — Humedad del núcleo y del producto recubierto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la humedad del núcleo y del producto recubierto: el spray acuoso incorpora humedad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la humedad del núcleo antes del recubrimiento<br>\n  2) Medir la humedad del producto recubierto al final<br>\n  3) Comparar contra los límites especificados<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La humedad del producto recubierto cumple especificación.<br>\n  Sin ganancia de humedad fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de humedad con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de humedad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto recubierto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-010 — Disolución y desintegración del recubierto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la disolución y desintegración del producto recubierto. En recubrimientos entéricos o de liberación modificada, esto es el criterio crítico (resistencia en medio ácido o perfil de liberación)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Determinar la desintegración según el método aprobado en cada lote<br>\n  2) Determinar el perfil de disolución (incluida resistencia en medio ácido si aplica entérico)<br>\n  3) Registrar los resultados por lote<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Desintegración y disolución cumplen especificación en cada lote.<br>\n  Resistencia en medio ácido (si aplica) dentro de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de disolución"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;701&gt; (desintegración); USP &lt;711&gt; (disolución)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-011 — Valoración y degradación en recubierto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la valoración y los productos de degradación (si aplica, activos termolábiles o sensibles a humedad)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Valorar el activo en el producto recubierto de cada lote (si aplica)<br>\n  2) Cuantificar los productos de degradación por el método aprobado<br>\n  3) Comparar contra especificación<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La valoración cumple especificación.<br>\n  Los productos de degradación no superan el límite."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Valoraciones y degradación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de valoración"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de valoración e impurezas."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-012 — Friabilidad y desgaste en el bombo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la friabilidad y el desgaste en el bombo (si aplica): fragmentos o tabletas rotas al final."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Determinar la friabilidad del producto recubierto (si aplica)<br>\n  2) Recoger y pesar fragmentos y tabletas rotas al final del lote<br>\n  3) Comparar contra el criterio<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La friabilidad cumple especificación.<br>\n  Fragmentos y rotas dentro del nivel aceptado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de friabilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1216&gt; (friabilidad)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-013 — Perfil térmico y de flujo durante el ciclo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el perfil de temperatura del producto, de escape y de entrada, y del flujo de aire durante todo el ciclo, sin desvíos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar temperaturas de producto, escape y entrada durante todo el ciclo<br>\n  2) Registrar el flujo de aire durante el ciclo<br>\n  3) Verificar ausencia de desvíos contra las bandas definidas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los perfiles se mantienen en banda durante todo el ciclo.<br>\n  Sin desvíos fuera de criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Perfiles con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de perfiles"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-014 — Caudal de spray real contra programado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el caudal de spray real contra el programado, con estabilidad durante la aspersión y sin obstrucción de pistolas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el caudal real durante la aspersión a intervalos definidos<br>\n  2) Comparar contra el caudal programado<br>\n  3) Verificar estabilidad y ausencia de obstrucción de pistolas<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El caudal real sigue al programado dentro de tolerancia.<br>\n  Sin obstrucción de pistolas durante la aspersión."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de caudal con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de caudal de spray"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-015 — Eficiencia de recubrimiento y balance",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la eficiencia de recubrimiento: balance entre sólidos aplicados y recubrimiento recuperado en las tabletas, con pérdida en paredes, filtros y pistolas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pesar los sólidos de suspensión aplicados en cada lote<br>\n  2) Determinar el recubrimiento recuperado en las tabletas por aumento de peso<br>\n  3) Estimar las pérdidas en paredes, filtros y pistolas<br>\n  4) Calcular la eficiencia y cerrar el balance<br>\n  5) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La eficiencia cumple el rango especificado.<br>\n  El balance cierra dentro de tolerancia."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Balances de recubrimiento con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de eficiencia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-016 — Secado final y enfriamiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el tiempo de secado final y enfriamiento: la humedad y la temperatura del lecho alcanzan los criterios antes de descargar."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar el secado final y enfriamiento según el protocolo<br>\n  2) Medir la humedad y la temperatura del lecho al final<br>\n  3) Verificar que alcanzan los criterios antes de descargar<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Humedad y temperatura del lecho en criterio antes de la descarga.<br>\n  Tiempo de secado dentro de lo establecido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de secado con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de secado final"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-017 — Comportamiento de la suspensión y hold time",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el comportamiento de la suspensión: viscosidad, agitación y estabilidad durante la aspersión, y límite de tiempo de espera (hold time) de la suspensión preparada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la viscosidad de la suspensión antes y durante la aspersión<br>\n  2) Verificar la agitación continua sin sedimentación<br>\n  3) Verificar el hold time: comportamiento al límite del tiempo de espera definido<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Viscosidad estable durante la aspersión.<br>\n  La suspensión es apta hasta el hold time definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de suspensión con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de suspensión"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación de la suspensión de recubrimiento."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-RB-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-RB-018 — Rotura en descarga, rendimiento y balance de masa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la descarga: rotura o daño, rendimiento y balance de masa."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Descargar el lote e inspeccionar rotura o daño por la descarga<br>\n  2) Pesar el producto descargado y calcular el rendimiento<br>\n  3) Cerrar el balance de masa del lote<br>\n  4) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin rotura o daño atribuible a la descarga fuera de criterio.<br>\n  Rendimiento y balance dentro de lo especificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de descarga con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de descarga"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Protocolo de fabricación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "recubridora"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO PQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Desempeño de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Desempeño con producción y control de calidad, asegurando personal, <span class=\"equipo\">equipo</span>, producto o simulado, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente durante todo el PQ.</li><li>Ejecutar y/o supervisar las corridas del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos con producción.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y dictaminar el desempeño del equipo.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span>, del producto o simulado y de los accesos para la ejecución.</li><li>Facilitar la documentación de proceso (BMR, especificaciones) y del fabricante.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Desempeño: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en las condiciones reales de uso (USP &lt;1058&gt;).</p>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-001 — Tres lotes consecutivos a condiciones nominales",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que el <span class=\"equipo\">equipo</span> produce granulado conforme de forma repetible en tres lotes consecutivos a condiciones nominales y carga habitual, con el número de lotes justificado por análisis de riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aprobar el análisis de riesgo que justifica el número de lotes (mínimo tres consecutivos) y anexarlo al protocolo<br>\n  2) Definir la carga habitual (registrar en kg según el BMR), la receta nominal (temperatura, flujo, tiempos) y los atributos a medir por lote<br>\n  3) Ejecutar el lote 1 a condiciones nominales registrando todos los parámetros críticos del ciclo<br>\n  4) Repetir en forma consecutiva los lotes 2 y 3 sin cambios al proceso entre ellos<br>\n  5) Medir en cada lote los atributos de calidad (humedad, granulometría, densidad) según los ensayos EQ-PQ-LF-004 a EQ-PQ-LF-006<br>\n  6) Comparar los tres lotes entre sí<br>\n  a) Los tres lotes cumplen todos los atributos dentro de especificación<br>\n  b) No hay tendencias ni desviaciones sin causa asignable entre lotes<br>\n  7) Documentar cualquier desviación, alarma o intervención ocurrida durante las corridas"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tres lotes consecutivos conformes en todos los atributos, sin desviaciones abiertas.<br>\n  Justificación por riesgo del número de lotes anexada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Análisis de riesgo que justifica el número de lotes<br>\n  - Registros de ciclo y resultados de atributos por lote"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 §§4.16–4.19 (tres lotes consecutivos salvo justificación)."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-002 — Corrida con carga mínima y máxima",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que el <span class=\"equipo\">equipo</span> seca en forma conforme en los extremos del rango de carga declarado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir la carga mínima y la carga máxima del rango declarado en la URS (registrar ambos valores en kg)<br>\n  2) Ejecutar una corrida completa con carga mínima registrando parámetros y atributos (humedad, uniformidad)<br>\n  3) Ejecutar una corrida completa con carga máxima registrando los mismos atributos<br>\n  4) Comparar ambas corridas contra la corrida nominal del ensayo EQ-PQ-LF-001<br>\n  a) Carga mínima y máxima cumplen humedad y uniformidad dentro de especificación<br>\n  5) Registrar tiempos de secado por carga y confirmar que están dentro de lo previsto en la receta"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ambas cargas extremas conformes en humedad y uniformidad."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de ciclo y atributos por carga extrema<br>\n  - Comparativa contra corrida nominal"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Se ejecuta una corrida por extremo porque la repetibilidad se demuestra en los tres lotes nominales del ensayo EQ-PQ-LF-001 (bracketing). Si el análisis de riesgo no sustenta el bracketing, repetir cada extremo en tres corridas."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 (rango previsto y peor caso); URS del equipo."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-003 — Corrida en condiciones de peor caso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que el <span class=\"equipo\">equipo</span> seca en forma conforme en la combinación más retadora: masa con mayor humedad inicial, flujo de aire en el límite bajo y temperatura en el límite alto o bajo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el peor caso con el análisis de riesgo: humedad inicial máxima, flujo en el límite bajo y temperatura en el límite alto o bajo según el riesgo (registrar los valores en %, m³/h y °C con su fuente: BMR, desarrollo o URS)<br>\n  2) Preparar la masa con la mayor humedad inicial del rango y verificarla antes de cargar<br>\n  3) Ejecutar la corrida completa en peor caso registrando parámetros, alarmas y atributos<br>\n  4) Medir humedad final y uniformidad en múltiples ubicaciones según el ensayo EQ-PQ-LF-004<br>\n  5) Confirmar que el tiempo de secado está dentro del máximo previsto<br>\n  a) Humedad y uniformidad conformes aun en peor caso<br>\n  6) Documentar alarmas o intervenciones y su tratamiento"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Peor caso conforme en humedad, uniformidad y tiempo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Definición del peor caso con análisis de riesgo<br>\n  - Registro de ciclo y atributos del peor caso"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Una corrida en peor caso es suficiente cuando el análisis de riesgo lo justifica y la repetibilidad está demostrada en EQ-PQ-LF-001; en caso contrario, ejecutar tres corridas."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 (peor caso justificado); URS del equipo."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-004 — Humedad residual y uniformidad en múltiples ubicaciones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la humedad residual al punto final y su uniformidad en el lecho (superior, medio, inferior y lateral). Es el ensayo central del PQ."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el punto final por humedad según la especificación del producto (registrar el límite en % LOD) y el método (balanza halógena o Karl Fischer)<br>\n  2) Al alcanzar el punto final en cada corrida (nominal, extremos y peor caso), tomar muestras por triplicado en 4 ubicaciones: superior, medio, inferior y lateral del lecho<br>\n  3) Medir la humedad de cada muestra con instrumento calibrado y registrar con identificación de ubicación y hora<br>\n  4) Calcular por corrida el promedio, el rango y el RSD entre ubicaciones<br>\n  a) Todas las ubicaciones dentro de la especificación de humedad<br>\n  b) El RSD entre ubicaciones es menor o igual a [5]%<br>\n  5) Repetir el muestreo en los tres lotes nominales y comparar la repetibilidad entre lotes<br>\n  6) Procesar los datos crudos de humedad residual y uniformidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Humedad conforme en el 100% de las ubicaciones y lotes; uniformidad dentro del criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de puntos de muestreo en el lecho<br>\n  - Tabla de humedad por ubicación, corrida y lote con estadística<br>\n  - Data cruda y reporte estadístico del análisis de humedad residual y uniformidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;731&gt; (pérdida por secado); especificación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-005 — Curva de secado y punto final",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Establecer la curva de secado (humedad contra tiempo) con temperatura de producto, de salida y de entrada, para fijar y confirmar el punto final y la repetibilidad entre lotes."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Durante una corrida nominal, tomar muestras de humedad cada [10] minutos desde el inicio hasta pasado el punto final<br>\n  2) Registrar en paralelo la temperatura de producto, del aire de salida y del aire de entrada con la misma base de tiempo<br>\n  3) Graficar humedad contra tiempo y temperaturas contra tiempo en un solo eje temporal<br>\n  4) Identificar el punto final (humedad dentro de especificación sostenida) y el tiempo de secado correspondiente<br>\n  5) Repetir la curva en los tres lotes y superponerlas<br>\n  a) Las tres curvas son superponibles dentro de ±[10]% del tiempo de secado<br>\n  b) El punto final queda confirmado y es repetible<br>\n  6) Fijar el punto final y el tiempo de secado en la receta o en el informe<br>\n  7) Procesar los datos crudos de curva de secado en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Curva de secado establecida, punto final confirmado y repetible entre lotes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de secado por lote con temperaturas asociadas<br>\n  - Punto final y tiempo de secado fijados<br>\n  - Data cruda y reporte estadístico del análisis de curva de secado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Desarrollo de proceso; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-006 — Granulometría y densidades del granulado seco",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la distribución de tamaño de partícula, la densidad aparente y la densidad compactada del granulado seco del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tomar muestra representativa del granulado seco de cada lote (nominal, extremos y peor caso) según el plan de muestreo<br>\n  2) Medir la distribución de tamaño de partícula por tamizado o difracción láser con método validado<br>\n  3) Medir la densidad aparente y la densidad compactada, y calcular el índice de Carr o Hausner<br>\n  4) Comparar contra la especificación del producto granulado<br>\n  a) Granulometría dentro de especificación en todos los lotes<br>\n  b) Densidades e índices dentro de especificación<br>\n  5) Anexar los reportes del laboratorio con los métodos utilizados<br>\n  6) Procesar los datos crudos de granulometría y densidades en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Granulometría y densidades conformes en todos los lotes y condiciones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Reportes de granulometría y densidades por lote<br>\n  - Métodos analíticos utilizados<br>\n  - Data cruda y reporte estadístico del análisis de granulometría y densidades"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;786&gt; (tamizado); USP &lt;429&gt; (difracción láser); USP &lt;616&gt; (densidad aparente y compactada)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-007 — Valoración y degradación (si aplica, termolábil)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la valoración del activo y sus productos de degradación cuando el activo es termolábil; si no lo es, declarar No Aplica con justificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar en el dossier si el activo es termolábil; si no lo es, pasar al paso 5)<br>\n  2) Tomar muestras del granulado seco de cada lote y analizar valoración y productos de degradación por método validado<br>\n  3) Comparar contra la especificación del producto y contra el material antes del secado<br>\n  4) Evaluar el impacto térmico del ciclo sobre el activo<br>\n  a) Valoración y degradación dentro de especificación en todos los lotes<br>\n  5) Si no aplica: redactar la justificación de No Aplica (activo no termolábil según dossier) con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Conforme en valoración y degradación, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Reportes analíticos por lote o justificación de No Aplica firmada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; dossier del activo."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-008 — Aspecto del granulado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el aspecto del granulado seco: sin grumos, sin sobresecado ni material pegado a la malla."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Al descargar cada lote, inspeccionar visualmente el granulado con luz adecuada<br>\n  2) Buscar grumos, finos en exceso, cambio de color por sobresecado y material adherido a la malla del contenedor<br>\n  3) Registrar el aspecto por lote con evidencia fotográfica<br>\n  4) Si hay hallazgos, evaluar su impacto y documentar la disposición<br>\n  a) Aspecto conforme en todos los lotes<br>\n  5) Anexar las fotografías con identificación de lote y fecha"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Aspecto conforme en el 100% de los lotes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de aspecto por lote con evidencia fotográfica"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; BMR."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-009 — Fluidización con producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la fluidización con producto a lo largo del ciclo: sin canalización, sin zonas muertas ni colapso del lecho."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Durante cada corrida, observar el lecho por la mirilla en 3 momentos: inicio (masa húmeda), mitad y punto final<br>\n  2) Buscar canalización (chorros localizados), zonas muertas (material estático) y colapso del lecho<br>\n  3) Confirmar la expansión uniforme del lecho y el movimiento homogéneo del producto<br>\n  4) Registrar la observación por momento y corrida, con hora y operador<br>\n  5) Ante cualquier anomalía, detener, investigar causa (carga, flujo, humedad) y documentar<br>\n  a) Fluidización uniforme en todos los momentos y corridas<br>\n  6) Anexar el registro de observaciones por corrida"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Lecho fluidizado uniforme sin canalización, zonas muertas ni colapso."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de observaciones de fluidización por corrida"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Desarrollo de proceso; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-010 — ΔP del filtro durante el ciclo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Monitorear el diferencial de presión del filtro durante el ciclo: sin obstrucción que afecte el flujo ni pérdida de producto por el sacudido."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el ΔP del filtro cada [15] minutos durante cada corrida, con el sacudido en automático según receta<br>\n  2) Graficar el ΔP contra el tiempo e identificar tendencias de obstrucción<br>\n  3) Confirmar que el flujo de aire se mantiene dentro de lo previsto pese al aumento de ΔP<br>\n  4) Verificar que el sacudido no arrastra producto fuera del contenedor (inspección de mangas y ductos)<br>\n  a) ΔP siempre por debajo del límite de alarma durante el ciclo<br>\n  b) Sin pérdida de producto atribuible al sacudido<br>\n  5) Anexar las curvas de ΔP por corrida"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  ΔP bajo control todo el ciclo, sin obstrucción crítica ni pérdida de producto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de ΔP contra tiempo por corrida"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Receta aprobada; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-011 — Rendimiento y pérdida de finos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el rendimiento del <span class=\"equipo\">equipo</span> y la pérdida de finos mediante balance de masa entre carga y descarga, incluyendo el material en filtros."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pesar la carga inicial (masa húmeda) con instrumento calibrado y registrar<br>\n  2) Descargar el granulado seco, pesar la descarga total y registrar<br>\n  3) Recuperar y pesar el material retenido en mangas y filtros<br>\n  4) Calcular el rendimiento: descarga contra carga ajustada por humedad, y la pérdida de finos<br>\n  5) Comparar contra el criterio de la receta<br>\n  a) Rendimiento mayor o igual a [95]%<br>\n  b) Pérdida de finos menor o igual a [2]%<br>\n  6) Repetir el balance en cada lote y corrida, y anexar las pesadas<br>\n  7) Procesar los datos crudos de rendimiento y balance de masa en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Rendimiento y pérdida de finos dentro de lo previsto en todos los lotes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Balances de masa por lote con pesadas de carga, descarga y filtros<br>\n  - Data cruda y reporte estadístico del análisis de rendimiento y balance de masa"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>BMR; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-012 — Temperatura de producto y aire de salida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el control de la temperatura de producto y del aire de salida frente a lo definido en el proceso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la temperatura de producto (sonda en lecho) y del aire de salida cada [10] minutos durante cada corrida<br>\n  2) Comparar contra los límites del proceso: producto y salida según la receta aprobada (registrar ambos límites en °C antes de iniciar)<br>\n  3) Confirmar que no se exceden los límites en ningún momento del ciclo<br>\n  4) Correlacionar con la curva de secado del ensayo EQ-PQ-LF-005 (meseta de temperatura al punto final)<br>\n  a) Temperaturas dentro de límites durante todo el ciclo<br>\n  5) Anexar las curvas de temperatura por corrida<br>\n  6) Procesar los datos crudos de temperatura de producto y aire de salida en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Temperaturas de producto y salida dentro de lo definido en el proceso."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de temperatura de producto y salida por corrida<br>\n  - Data cruda y reporte estadístico del análisis de temperatura de producto y aire de salida"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Receta aprobada; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-013 — Mapeo de temperatura del lecho con carga (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear la temperatura del lecho con carga mediante sondas dentro del producto, cuando el activo es termolábil o el proceso es crítico a la temperatura."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el activo es termolábil o el proceso es crítico a la temperatura; si no, pasar al paso 6)<br>\n  2) Distribuir sondas calibradas dentro del producto (superior, medio, inferior y lateral) con plano de ubicación<br>\n  3) Correr una corrida nominal registrando temperatura por sonda cada [5] minutos<br>\n  4) Calcular por sonda promedio, máximo y mínimo, y el ΔT entre sondas<br>\n  a) ΔT entre sondas menor o igual a [3] °C<br>\n  b) Ninguna sonda excede la temperatura máxima del activo<br>\n  5) Anexar el plano, las curvas y la tabla por sonda<br>\n  6) Si no aplica: redactar la justificación de No Aplica con firma del ejecutor y del revisor<br>\n  7) Cuando aplique este ensayo, procesar los datos crudos de temperatura del mapeo con carga en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Uniformidad térmica con carga conforme, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de sondas, curvas y tabla por sonda, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de temperatura del mapeo con carga"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Dossier del activo; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-014 — Estado de mangas filtrantes tras el ciclo (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Revisar el estado de las mangas o bolsas filtrantes tras el ciclo: sin roturas ni pérdida de integridad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Al finalizar cada corrida, inspeccionar visualmente las mangas con luz adecuada<br>\n  2) Buscar roturas, descosidos, adelgazamiento y deformaciones<br>\n  3) Confirmar la limpieza o el reemplazo según el procedimiento antes del siguiente lote<br>\n  4) Registrar el estado por corrida con evidencia fotográfica si hay hallazgos<br>\n  a) Mangas íntegras en todas las corridas<br>\n  5) Si hay rotura, investigar pérdida de producto y contaminación cruzada, y documentar la disposición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Mangas íntegras, o hallazgo investigado y dispuesto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del estado de mangas por corrida"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Procedimiento de limpieza y mantenimiento; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-015 — Repetibilidad entre operarios o turnos (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la repetibilidad del proceso entre operarios o turnos cuando el proceso es manual en parte."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el proceso tiene pasos manuales (carga, muestreo, descarga); si es totalmente automático, pasar al paso 5)<br>\n  2) Asignar operarios o turnos distintos a los lotes de la PQ<br>\n  3) Comparar atributos críticos (humedad, tiempo de secado, rendimiento) entre operarios o turnos<br>\n  4) Evaluar estadísticamente si hay efecto del operario o turno<br>\n  a) Sin efecto significativo del operario o turno en los atributos<br>\n  5) Si no aplica: redactar la justificación de No Aplica (proceso automático) con firma del ejecutor y del revisor<br>\n  6) Cuando aplique este ensayo, procesar los datos crudos de atributos críticos por operario o turno en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Proceso repetible entre operarios o turnos, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Comparativa de atributos por operario o turno, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de atributos críticos por operario o turno"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 (personal capacitado, §3.11)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "lecho-fluido"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-LF-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-016 — Revisión de registros de lote",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Revisar los registros de lote de la PQ: parámetros críticos dentro de límites, alarmas ocurridas y acciones tomadas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recopilar los registros de lote (BMR) de todas las corridas de la PQ<br>\n  2) Verificar que los parámetros críticos están dentro de límites y firmados en cada etapa<br>\n  3) Listar las alarmas ocurridas, sus causas y las acciones tomadas con su cierre<br>\n  4) Confirmar la revisión por producción y por calidad con firmas y fechas<br>\n  5) Verificar la trazabilidad entre registros de equipo, análisis de laboratorio y registros de lote<br>\n  a) Registros completos, coherentes y cerrados<br>\n  6) Anexar la lista de verificación de registros diligenciada"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Registros completos y coherentes, alarmas cerradas y trazabilidad total."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Lista de verificación de registros de lote diligenciada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.180/211.188 (registros de lote); EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "resumen",
    "id": "EQ-PQ-LF-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-RES — Tabla resumen de los ensayos del PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del PQ del lecho fluido para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EQ-PQ-LF-001 a EQ-PQ-LF-016 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 16 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "lecho-fluido"
   },
   {
    "kind": "tabla",
    "id": "EQ-PQ-LF-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-PQ-LF-REF — Referencias del PQ de lecho fluido",
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
       "EU GMP Anexo 15 — Cualificación y validación: PQ tras IQ/OQ; tres lotes consecutivos salvo justificación por riesgo",
       "VIGENTE"
      ],
      [
       "6.2",
       "USP <731> — Pérdida por secado: humedad residual del granulado",
       "VIGENTE"
      ],
      [
       "6.3",
       "USP <786> — Distribución de tamaño de partícula del granulado",
       "VIGENTE"
      ],
      [
       "6.4",
       "USP <616> — Densidad aparente y compactada, índice de Carr/Hausner",
       "VIGENTE"
      ],
      [
       "6.5",
       "21 CFR 211.180/211.188 — Registros de lote: revisión, alarmas y trazabilidad",
       "VIGENTE"
      ],
      [
       "6.6",
       "BMR y especificación del producto — Atributos, receta nominal y punto final de secado",
       "VIGENTE"
      ],
      [
       "6.7",
       "Manual del fabricante del lecho fluido — Rangos de carga, curva del ventilador y límites de diseño",
       "VIGENTE"
      ]
     ]
    },
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de ciclo, curvas de secado, ΔP y temperaturas por lote</td></tr>\n<tr><td>8.2</td><td>Anexo B — Reportes analíticos (humedad, granulometría, densidades, valoración) y certificados de instrumentos</td></tr>\n<tr><td>8.3</td><td>Anexo C — Balances de masa, matrices de uniformidad y análisis de riesgo del número de lotes</td></tr>\n</tbody></table>",
    "familia": "lecho-fluido"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO PQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Desempeño de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Desempeño con producción y microbiología, asegurando personal, <span class=\"equipo\">equipo</span>, cargas, indicadores biológicos, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente durante todo el PQ.</li><li>Ejecutar y/o supervisar los ciclos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y dictaminar el desempeño del equipo.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span>, de las cargas y de los accesos para la ejecución.</li><li>Facilitar la documentación de proceso y del fabricante.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Desempeño: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en las condiciones reales de uso (USP &lt;1058&gt;).</p>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-001 — Mapeo de la cámara con carga de referencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Determinar la distribución de temperatura con carga de referencia, el ΔT entre sondas y respecto al sensor de control, y definir el punto frío del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir la carga de referencia (composición, masa y patrón de carga validado) y disponer de termopares calibrados<br>\n  2) Distribuir 12 termopares como mínimo en la carga, el drenaje y junto al sensor de control, según el plano de ubicación<br>\n  3) Correr el ciclo a 121 °C registrando la temperatura cada 30 segundos<br>\n  4) En meseta, calcular por sonda el promedio, el máximo y el mínimo; el ΔT entre sondas; y el ΔT contra el sensor de control<br>\n  a) Todas las sondas entre 121 y 124 °C en meseta, o dentro de la banda de la URS<br>\n  b) El ΔT entre sondas está dentro de ±1 °C<br>\n  5) Definir y registrar el punto frío de la carga de referencia<br>\n  6) Procesar los datos crudos de temperatura del mapeo con carga en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Uniformidad en banda en meseta; punto frío definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de ubicación de termopares en la carga<br>\n  - Curvas de temperatura y tabla por sonda con ΔT<br>\n  - Data cruda y reporte estadístico del análisis de temperatura del mapeo con carga"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 §16.2 (termometría con carga); ISO 17665-1."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-002 — Tiempo de equilibrio",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Determinar cuánto tarda la carga en alcanzar la temperatura de esterilización frente al sensor de cámara del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con los datos del mapeo del ensayo EQ-PQ-AU-001, medir por sonda el tiempo desde que el sensor de control alcanza la temperatura hasta que cada punto de la carga la alcanza<br>\n  2) Determinar el tiempo de equilibrio como el mayor tiempo medido (punto frío)<br>\n  3) Confirmar que el tiempo de mantenimiento programado cubre el equilibrio más la exposición requerida<br>\n  a) Equilibrio dentro del límite del diseño y mantenimiento posterior completo<br>\n  4) Procesar los datos crudos de tiempos de equilibrio por posición en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Equilibrio conocido y cubierto por el tiempo de mantenimiento del ciclo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de tiempos de equilibrio por sonda y posición<br>\n  - Data cruda y reporte estadístico del análisis de tiempos de equilibrio"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 §3.13–3.14 (equilibrio y mantenimiento); OMS TRS 961 §6.2."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-003 — El drenaje o sensor de control representa a la carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la temperatura del drenaje o del sensor de control del <span class=\"equipo\">equipo</span> representa lo que ocurre en la carga."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Comparar la curva del sensor de control contra la del punto frío en 3 ciclos con carga<br>\n  2) Calcular la diferencia máxima y el retraso entre ambas curvas<br>\n  3) Confirmar que el control nunca libera el ciclo antes de que la carga complete su exposición<br>\n  a) La diferencia está dentro de lo previsto en el diseño del ciclo<br>\n  4) Anexar la comparativa control contra punto frío por ciclo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El control representa a la carga en todos los ciclos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Comparativa control contra punto frío por ciclo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>OMS TRS 961 §6 (punto más frío)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-004 — Sondas en el punto más difícil por tipo de carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la penetración de calor en el punto más difícil de cada tipo de carga del <span class=\"equipo\">equipo</span> (poroso, lumen, denso)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir los tipos de carga del sitio y el punto más difícil de cada uno<br>\n  2) Ubicar sondas calibradas y retos (PCD) en el punto difícil de cada tipo, con plano<br>\n  3) Correr 3 ciclos consecutivos por tipo de carga registrando la temperatura interna (un ciclo por tipo solo si el bracketing está justificado en el análisis de riesgo y el tipo queda cubierto por EQ-PQ-AU-008)<br>\n  4) Confirmar meseta completa en el punto difícil de cada tipo<br>\n  a) El punto difícil alcanza la banda y la mantiene toda la meseta<br>\n  5) Procesar los datos crudos de penetración por tipo de carga en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Penetración demostrada en el punto difícil de cada tipo de carga en los 3 ciclos consecutivos, o bracketing justificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de penetración por tipo de carga con curvas<br>\n  - Data cruda y reporte estadístico del análisis de penetración por tipo de carga"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR-01 (cargas porosas y duras); EN 285 (cargas de prueba)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-005 — F0 en el punto frío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Calcular el F0 o equivalencia letal en el punto frío del <span class=\"equipo\">equipo</span> con el criterio mínimo definido en el protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con los datos de temperatura del punto frío, calcular el F0 por integración (z igual a 10, Tref 121,1 °C)<br>\n  2) Comparar contra el F0 mínimo del protocolo (12 minutos o el definido)<br>\n  3) Comparar el F0 físico contra el F0 biológico (acuerdo físico-biológico)<br>\n  a) F0 físico mayor o igual al mínimo y coherente con el biológico<br>\n  4) Procesar los datos crudos de letalidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Anexar la memoria de cálculo del F0"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  F0 físico en el punto frío mayor o igual al mínimo definido (12 minutos por defecto, enfoque de sobremuerte) y coherente con el F0 biológico, demostrando un SAL menor o igual a 10⁻⁶."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Memoria de cálculo del F0 en el punto frío<br>\n  - Data cruda y reporte estadístico del análisis de letalidad"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El F0 mínimo se justifica según el enfoque: sobremuerte (reducción de 12 log de un indicador con D121 de 1 minuto, F0 = 12 min) o basado en biocarga (F0 = D121 × (log N0 − log SAL), con N0 la biocarga máxima y D121 del organismo más resistente). Anexar la memoria de cálculo con el enfoque elegido."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1229&gt;; PDA TR-01 (F0 físico y biológico)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-006 — Penetración de vapor en poroso o lúmenes",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Detectar aire residual en material poroso o con lúmenes del <span class=\"equipo\">equipo</span> mediante retos definidos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Preparar el reto (hélix o lumen definido) con indicador químico y sonda interna<br>\n  2) Correr el ciclo y evaluar el viraje del indicador con la temperatura interna<br>\n  3) Repetir en 3 ciclos<br>\n  a) Viraje completo y temperatura en banda en el reto, en todos los ciclos<br>\n  4) Anexar los retos evaluados con su lectura"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin aire residual en el reto en los 3 ciclos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Retos (PCD) evaluados por ciclo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (cargas huecas y porosas); ISO 11140."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-007 — Indicadores biológicos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Desafiar el ciclo del <span class=\"equipo\">equipo</span> con <span class=\"equipo\">Geobacillus stearothermophilus</span> junto a las sondas en el punto frío, con controles positivos y negativos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Disponer de indicadores biológicos de Geobacillus stearothermophilus con población certificada (habitualmente 10⁶ esporas por unidad; mínimo 10⁵ según ISO 11138-3) y D121 de 1,5 minutos o más, registrando lote y vencimiento, más controles positivos (sin exponer) y negativos (medio)<br>\n  2) Ubicar los expuestos junto a las sondas del punto frío en 3 ciclos con carga<br>\n  3) Incubar según el fabricante (55 a 60 °C por 7 días)<br>\n  4) Leer: expuestos sin crecimiento; control positivo con crecimiento; control negativo sin crecimiento<br>\n  a) Muerte completa en expuestos con controles válidos<br>\n  5) Registrar los indicadores por ciclo con lote y posición"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Eficacia demostrada con controles válidos en los 3 ciclos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de indicadores biológicos por ciclo con controles"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1229.5&gt;; ISO 11138-1 e ISO 11138-3 (indicadores biológicos para calor húmedo)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-008 — Tres ciclos consecutivos por configuración",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la repetibilidad del <span class=\"equipo\">equipo</span> con los mismos criterios en tres ciclos consecutivos por configuración de carga."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir las configuraciones de carga del sitio (porosa, mixta y líquidos si aplica)<br>\n  2) Correr 3 ciclos consecutivos por configuración sin cambios al proceso<br>\n  3) Comparar parámetros críticos y atributos entre los 3 ciclos de cada configuración<br>\n  a) Los 3 ciclos cumplen idénticos criterios por configuración<br>\n  4) Procesar los datos crudos inter-ciclo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Repetibilidad demostrada por configuración."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Comparativa de los 3 ciclos por configuración<br>\n  - Data cruda y reporte estadístico del análisis inter-ciclo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 §§4.16–4.19."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-009 — Carga mínima y carga máxima",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño del <span class=\"equipo\">equipo</span> en los extremos de carga mínima y máxima."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir la carga mínima y la carga máxima según la URS<br>\n  2) Correr un ciclo completo con cada extremo, con mapeo reducido (5 sondas como mínimo más el control)<br>\n  3) Comparar uniformidad, equilibrio y F0 de cada extremo contra la corrida nominal<br>\n  a) Extremos conformes en uniformidad, equilibrio y F0<br>\n  4) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Extremos de carga conformes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de ciclo de cada extremo con mapeo reducido<br>\n  - Data cruda y reporte estadístico del análisis comparativo de extremos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS del equipo; EU GMP Anexo 15 (rango y bracketing)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-010 — Peor caso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño del <span class=\"equipo\">equipo</span> en el peor caso: carga más densa, envoltorio más difícil o paquete con mayor masa térmica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el peor caso con el análisis de riesgo y anexar su justificación<br>\n  2) Instrumentar el peor caso completo y correr con indicadores biológicos<br>\n  3) Confirmar meseta, F0 y muerte en el peor caso<br>\n  a) Peor caso conforme en meseta, F0 e indicadores<br>\n  4) Procesar los datos crudos del peor caso en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Peor caso conforme en todo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Definición del peor caso con análisis de riesgo<br>\n  - Registros del peor caso con indicadores<br>\n  - Data cruda y reporte estadístico del análisis del peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 (peor caso); PDA TR-01."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-011 — Tiempo de enfriamiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Determinar el tiempo de enfriamiento del <span class=\"equipo\">equipo</span> hasta temperatura segura para manipulación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Al fin del ciclo, registrar la temperatura de la carga cada 5 minutos hasta 40 °C o menos<br>\n  2) Medir el tiempo total de enfriamiento en 3 ciclos<br>\n  3) Confirmar la integridad de los empaques (sin condensación interna)<br>\n  a) Tiempo dentro del límite y empaques secos<br>\n  4) Procesar los datos crudos de enfriamiento en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Enfriamiento definido y repetible con empaques íntegros."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de enfriamiento por ciclo<br>\n  - Data cruda y reporte estadístico del análisis de enfriamiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Receta aprobada; OMS TRS 961 §6.21."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-012 — Bowie-Dick con carga (si aplica, poroso)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la remoción de aire con carga porosa del <span class=\"equipo\">equipo</span>; si no hay cargas porosas, declarar No Aplica con justificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el sitio procesa cargas porosas; si no, pasar al paso 4)<br>\n  2) Ubicar el paquete Bowie-Dick en el punto definido con la carga presente<br>\n  3) Correr el ciclo Bowie-Dick y evaluar el viraje uniforme, repitiendo en 3 corridas<br>\n  a) Viraje uniforme en todas las corridas<br>\n  4) Sin cargas porosas: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Conforme con carga porosa, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Hojas Bowie-Dick evaluadas o justificación de No Aplica firmada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 §17."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-013 — Estabilidad de presión y temperatura",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la estabilidad de la presión y la temperatura del <span class=\"equipo\">equipo</span> durante la esterilización, sin desviaciones de alarma."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la presión y la temperatura cada 30 segundos en meseta, en 3 ciclos con carga<br>\n  2) Calcular la estabilidad (rango y SD) y listar las alarmas ocurridas<br>\n  a) Dentro de banda el 100% del tiempo, con cero alarmas no gestionadas<br>\n  3) Procesar los datos crudos de estabilidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Meseta estable sin alarmas no gestionadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de presión y temperatura en meseta<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (bandas); EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-014 — Vacío y pulsos con carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el vacío y los pulsos del <span class=\"equipo\">equipo</span> alcanzan el nivel requerido con carga."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar el nivel de vacío por pulso (número de pulsos y presión mínima) en 3 ciclos con carga<br>\n  2) Comparar contra el setpoint y contra el vacío para confirmar el efecto de la carga<br>\n  3) Confirmar la remoción de aire por la vía asociada (Bowie-Dick o mapeo del ciclo)<br>\n  a) Niveles conformes en todos los ciclos<br>\n  4) Procesar los datos crudos de vacío en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vacío conforme con carga en todos los ciclos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de vacío por pulso y ciclo<br>\n  - Data cruda y reporte estadístico del análisis de vacío"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Receta aprobada; EN 285."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-015 — Tiempo de espera de material estéril",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Validar el tiempo de espera del material estéril del <span class=\"equipo\">equipo</span> tras el ciclo (validez del almacenado)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el tiempo propuesto en días por tipo de empaque y almacén<br>\n  2) Almacenar en las condiciones definidas y evaluar la integridad del empaque al vencimiento (inspección más prueba de integridad)<br>\n  3) Opcional: desafío microbiológico del contenido al vencimiento<br>\n  4) Registrar la validez aprobada por tipo de empaque<br>\n  a) Empaque íntegro al vencimiento del tiempo declarado<br>\n  5) Anexar el estudio con la validez declarada"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tiempo de espera validado por empaque."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Estudio de tiempo de espera con validez declarada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 1 (tiempos de almacenamiento del material estéril); ISO 11607-1 (sistemas de barrera estéril); práctica 7–30 días según empaque."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-016 — No estéril y liberación de la carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Establecer los criterios y registros del material no esterilizado y de la liberación de la carga del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir los criterios de segregación: cinta indicadora, etiquetas y área de no estéril<br>\n  2) Verificar que ninguna carga sale sin ciclo completo y sin registro aprobado<br>\n  3) Definir la liberación por calidad (revisión del registro del ciclo más indicadores si aplica)<br>\n  4) Simular un hallazgo de ciclo abortado y confirmar la segregación efectiva<br>\n  a) Cero mezclas; liberación solo con registro aprobado<br>\n  5) Anexar el procedimiento y el registro del simulacro"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sistema a prueba de mezcla de estéril con no estéril."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Procedimiento de segregación y liberación<br>\n  - Registro del simulacro de hallazgo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>OMS TRS 961 §§5.9–5.10 (patrones de carga y registros por corrida)."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-AU-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-017 — Secado de la carga (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el secado de la carga del <span class=\"equipo\">equipo</span> cuando el programa incluye fase de secado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si los programas califican fase de secado; si no, declarar No Aplica<br>\n  2) Al abrir, inspeccionar la carga: sin humedad visible ni empaques mojados<br>\n  3) Pesar elementos testigo antes y después cuando aplique<br>\n  a) Carga seca en todos los ciclos con secado<br>\n  4) Anexar el registro de inspección"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Secado efectivo o No Aplica justificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de inspección de secado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 (sequedad de carga); receta aprobada."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "resumen",
    "id": "EQ-PQ-AU-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-RES — Tabla resumen de los ensayos del PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del PQ del autoclave para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EQ-PQ-AU-001 a EQ-PQ-AU-017 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 17 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "autoclave"
   },
   {
    "kind": "tabla",
    "id": "EQ-PQ-AU-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-PQ-AU-REF — Referencias del PQ de autoclave",
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
       "EN 285:2015+A1:2021 — Esterilizadores a vapor: tiempo de equilibrio, meseta, termometría con carga y calidad de vapor",
       "VIGENTE"
      ],
      [
       "6.2",
       "ISO 17665-1 — Calor húmedo: desarrollo, validación y control de la esterilización",
       "VIGENTE"
      ],
      [
       "6.3",
       "USP <1229> / <1229.1> / <1229.5> — Esterilización, F0 e indicadores biológicos",
       "VIGENTE"
      ],
      [
       "6.4",
       "PDA TR-01 — Calor húmedo: equilibrio, F0 físico y biológico, y penetración por tipo de carga",
       "VIGENTE"
      ],
      [
       "6.5",
       "OMS TRS 961 Anexo 6 — Patrones de carga validados, punto más frío y registros por corrida",
       "VIGENTE"
      ],
      [
       "6.6",
       "EU GMP Anexo 1 — Fabricación de medicamentos estériles: almacenamiento y barrera del material estéril",
       "VIGENTE"
      ],
      [
       "6.7",
       "EU GMP Anexo 15 — PQ con cargas de producción: repetibilidad en tres ciclos salvo justificación",
       "VIGENTE"
      ],
      [
       "6.8",
       "Manual del fabricante del autoclave — Programas, setpoints y límites de diseño",
       "VIGENTE"
      ],
      [
       "6.9",
       "ISO 11138-3 — Indicadores biológicos para procesos de esterilización por calor húmedo",
       "VIGENTE"
      ],
      [
       "6.10",
       "ISO 11140-5 — Indicadores clase 2 para ensayos de remoción de aire tipo Bowie-Dick",
       "VIGENTE"
      ],
      [
       "6.11",
       "ISO 11607-1 — Envases para productos sanitarios esterilizados terminalmente",
       "VIGENTE"
      ]
     ]
    },
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de ciclo, curvas de temperatura y presión, y cálculos (equilibrio, F0)</td></tr>\n<tr><td>8.2</td><td>Anexo B — Indicadores biológicos y químicos, y certificados de termopares e instrumentos</td></tr>\n<tr><td>8.3</td><td>Anexo C — Planos de carga y sondas, memorias de cálculo y estudio de tiempo de espera</td></tr>\n</tbody></table>",
    "familia": "autoclave"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO PQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Desempeño de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Desempeño con producción y control de calidad, asegurando personal, <span class=\"equipo\">equipo</span>, producto o placebo, instrumentos y documentación.</li><li>Verificar que los instrumentos y balanzas estén identificados y con calibración vigente durante todo el PQ.</li><li>Ejecutar y/o supervisar las corridas del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y dictaminar el desempeño del equipo.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span>, del producto o placebo y de los accesos para la ejecución.</li><li>Facilitar la documentación de proceso (BMR, especificaciones) y del fabricante.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Desempeño: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en las condiciones reales de uso (USP &lt;1058&gt;).</p>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-001 — Estudio de tiempo de mezcla",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Identificar cuándo se alcanza la homogeneidad mediante muestreo a varios tiempos y confirmar que no hay desmezcla por exceso de tiempo en el <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cargar el producto o placebo a la carga de trabajo con la receta nominal y arrancar el ciclo<br>\n  2) Detener a los 5, 10, 15 y 20 minutos (o tiempos del estudio) y tomar muestras en puntos fijos en cada parada, reanudando hasta completar el perfil<br>\n  3) Analizar el activo o trazador por método validado en cada tiempo<br>\n  4) Graficar RSD contra tiempo e identificar el punto de homogeneidad y la meseta<br>\n  a) RSD menor o igual a 5,0% desde el tiempo de homogeneidad en adelante<br>\n  b) Sin aumento de RSD por exceso de tiempo (sin desmezcla)<br>\n  5) Procesar los datos crudos del perfil de mezcla en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tiempo de homogeneidad identificado, sin desmezcla posterior."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Perfil de RSD contra tiempo por punto de muestreo<br>\n  - Data cruda y reporte estadístico del análisis del perfil de mezcla"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA/PQRI (uniformidad de mezcla); desarrollo de proceso."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-002 — Tiempo y velocidad de rutina con margen",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Fijar el tiempo y la velocidad de mezcla de rutina del <span class=\"equipo\">equipo</span> con base en el estudio, más un margen justificado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tomar el tiempo de homogeneidad del ensayo EQ-PQ-MZ-001 y la velocidad nominal calificada en OQ<br>\n  2) Fijar el tiempo de rutina como homogeneidad más un margen justificado (por ejemplo +20% o +5 min, el mayor)<br>\n  3) Correr una corrida de confirmación al tiempo y velocidad fijados con muestreo completo<br>\n  4) Confirmar RSD menor o igual a 5,0% en la corrida de confirmación<br>\n  a) La corrida de confirmación cumple con el tiempo y velocidad fijados<br>\n  5) Procesar los datos crudos de confirmación en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  6) Registrar el tiempo, la velocidad y el margen en la receta o en el informe"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Parámetros de rutina fijados, confirmados y con margen justificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación del margen con la corrida de confirmación<br>\n  - Data cruda y reporte estadístico del análisis de confirmación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Desarrollo de proceso; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-003 — Muestreo en múltiples ubicaciones con zonas de peor mezcla",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la uniformidad con muestreo en múltiples ubicaciones del <span class=\"equipo\">equipo</span>, incluyendo obligatoriamente las zonas de peor mezcla, con réplicas por ubicación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir 10 puntos de muestreo como mínimo en dos profundidades del eje, incluyendo zonas de peor mezcla (fondo, descarga, tapa y paredes)<br>\n  2) Correr el ciclo a parámetros de rutina fijados en el ensayo EQ-PQ-MZ-002<br>\n  3) Tomar las muestras con muestreador validado, sin segregar, e identificar punto, profundidad y réplica<br>\n  4) Analizar el activo o trazador por método validado<br>\n  5) Calcular media, SD y RSD del conjunto e individuales contra la media<br>\n  a) RSD menor o igual a 5,0% e individuales dentro de ±10% absoluto de la media<br>\n  6) Procesar los datos crudos de ubicaciones en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Uniformidad demostrada incluyendo zonas de peor mezcla."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de puntos con resultados por punto y réplica<br>\n  - Data cruda y reporte estadístico del análisis de uniformidad por ubicación"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>10 puntos es el mínimo para mezcladores de volteo (V, bins, doble cono). En mezcladores convectivos (cinta, planetario, alto corte) usar 20 puntos como mínimo."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA/PQRI (≥10 puntos, 2 profundidades, réplicas)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-004 — Criterio sobre el contenido del activo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la media del contenido del activo está dentro del rango de la especificación y el RSD dentro del límite definido en el <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con las muestras del ensayo EQ-PQ-MZ-003, calcular la media del contenido del activo contra la especificación (por ejemplo 90,0 a 110,0% del nominal)<br>\n  2) Calcular el RSD del conjunto contra el límite definido (por ejemplo menor o igual a 5%)<br>\n  3) Evaluar cada individual contra su criterio (por ejemplo dentro de ±10% de la media)<br>\n  a) Media dentro de especificación, RSD dentro del límite e individuales conformes<br>\n  4) Procesar los datos crudos del contenido en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Contenido del activo conforme en media, RSD e individuales."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de contenido por muestra con media, RSD e individuales<br>\n  - Data cruda y reporte estadístico del análisis de contenido del activo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; FDA/PQRI."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-005 — Réplicas independientes por punto (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Separar la variabilidad del muestreo de la del método con al menos tres réplicas independientes por punto; si el método ya lo resuelve, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si se requieren réplicas independientes adicionales a las del ensayo EQ-PQ-MZ-003; si no, pasar al paso 5)<br>\n  2) Tomar 3 réplicas independientes por punto en los puntos críticos<br>\n  3) Analizar cada réplica por separado con el método validado<br>\n  4) Descomponer la varianza: entre puntos contra dentro del punto (repetibilidad del método)<br>\n  a) Variabilidad del método menor que la variabilidad entre puntos, o ambas dentro de lo previsto<br>\n  5) Procesar los datos crudos de réplicas en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  6) Si no aplica: redactar la justificación de No Aplica (proceso automático) con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Varianza dentro del punto (método y muestreo) menor que la varianza entre puntos según ANOVA de un factor (α = 0,05), o ambas con RSD dentro del criterio de EQ-PQ-MZ-003; o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de réplicas por punto con descomposición de varianza, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de réplicas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA/PQRI (réplicas y errores de muestreo)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-006 — Tres lotes consecutivos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar repetibilidad en tres lotes consecutivos a condiciones nominales, con el número justificado por análisis de riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aprobar el análisis de riesgo que justifica el número de lotes (mínimo tres consecutivos) y anexarlo<br>\n  2) Ejecutar los tres lotes a receta nominal sin cambios al proceso entre ellos<br>\n  3) Medir en cada lote la uniformidad (RSD) y los atributos definidos<br>\n  4) Comparar los tres lotes entre sí<br>\n  a) Los tres lotes cumplen uniformidad y atributos dentro de especificación<br>\n  b) Sin tendencias ni desviaciones sin causa asignable<br>\n  5) Procesar los datos crudos inter-lote en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  6) Documentar desviaciones, alarmas o intervenciones de las corridas"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Tres lotes consecutivos conformes, sin desviaciones abiertas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Análisis de riesgo del número de lotes<br>\n  - Resultados por lote con comparativa<br>\n  - Data cruda y reporte estadístico del análisis inter-lote"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 §§4.16–4.19."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-007 — Llenado mínimo y máximo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Probar el rango de llenado declarado con llenado mínimo y máximo, que es el ensayo que de verdad prueba el rango."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el llenado mínimo y máximo del rango declarado en la URS (registrar ambos en % del volumen útil)<br>\n  2) Ejecutar una corrida completa con llenado mínimo y muestreo completo de uniformidad<br>\n  3) Ejecutar una corrida completa con llenado máximo y muestreo completo de uniformidad<br>\n  4) Comparar ambas contra la corrida nominal<br>\n  a) Mínimo y máximo cumplen RSD menor o igual a 5,0%<br>\n  5) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Extremos de llenado conformes en uniformidad."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados de uniformidad por llenado extremo con comparativa<br>\n  - Data cruda y reporte estadístico del análisis comparativo de llenado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS del equipo; EU GMP Anexo 15 (rango y bracketing)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-008 — Peor caso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar uniformidad en el peor caso: activo de menor concentración, mayor diferencia de densidad o tamaño de partícula, o excipiente más cohesivo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el peor caso con el análisis de riesgo y anexar su justificación<br>\n  2) Ejecutar la corrida completa en peor caso con muestreo completo de uniformidad<br>\n  3) Confirmar RSD e individuales dentro de criterio en el peor caso<br>\n  a) Peor caso conforme en uniformidad<br>\n  4) Procesar los datos crudos del peor caso en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Peor caso conforme en uniformidad."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Definición del peor caso con análisis de riesgo<br>\n  - Resultados del peor caso<br>\n  - Data cruda y reporte estadístico del análisis del peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 (peor caso)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-009 — Segregación en descarga y manejo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que no hay segregación en la descarga y el manejo: muestreo al inicio, mitad y final de la descarga, y tras el transporte o la espera previa a compresión o llenado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Al descargar, tomar muestras al inicio, a la mitad y al final de la descarga<br>\n  2) Repetir el muestreo tras el transporte o la espera previa a la siguiente etapa, según aplique<br>\n  3) Analizar y comparar contra la uniformidad del mezclador<br>\n  4) Confirmar que la descarga y el manejo no degradan la uniformidad<br>\n  a) Inicio, mitad y final conformes con RSD menor o igual a 5,0%<br>\n  5) Procesar los datos crudos de segregación en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin segregación atribuible a descarga o manejo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados por momento de descarga y post-manejo<br>\n  - Data cruda y reporte estadístico del análisis de segregación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA/PQRI (segregación post-mezcla); EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-010 — Tiempo máximo de espera entre mezcla y uso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar con estudio de hold time que la uniformidad se mantiene hasta el tiempo máximo de espera entre la mezcla y su uso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el tiempo máximo de espera propuesto en el contenedor de proceso (registrar en horas, con la temperatura y humedad de almacenamiento)<br>\n  2) Mezclar a parámetros de rutina y mantener la mezcla el tiempo propuesto sin moverla<br>\n  3) Al vencimiento, muestrear y analizar uniformidad completa<br>\n  4) Comparar contra la uniformidad recién mezclado<br>\n  a) Uniformidad al vencimiento dentro de criterio (RSD menor o igual a 5,0%)<br>\n  5) Procesar los datos crudos del hold time en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  6) Declarar el hold time aprobado en el informe"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Uniformidad mantenida hasta el hold time declarado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados al vencimiento con comparativa<br>\n  - Data cruda y reporte estadístico del análisis de hold time<br>\n  - Hold time declarado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 (tiempos de espera); 21 CFR 211.111 (límites de tiempo en producción)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-011 — Densidad y fluidez del mezclado",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar densidad aparente y compactada, y fluidez, como control de que la mezcla es apta para la etapa siguiente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tomar muestra representativa de la mezcla final de cada lote<br>\n  2) Medir densidad aparente y compactada, calcular Carr o Hausner, y medir fluidez (ángulo de reposo o flujo por orificio)<br>\n  3) Comparar contra la especificación de mezcla para compresión o llenado<br>\n  a) Densidades y fluidez dentro de especificación<br>\n  4) Procesar los datos crudos de densidades en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Densidades y fluidez aptas para la etapa siguiente en todos los lotes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Reportes de densidades y fluidez por lote<br>\n  - Data cruda y reporte estadístico del análisis de densidades del mezclado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;616&gt; (densidades); especificación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-012 — Distribución de tamaño de partícula",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la distribución de tamaño de partícula de la mezcla, si es un atributo crítico."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tomar muestra representativa de la mezcla final de cada lote según el plan de muestreo<br>\n  2) Medir por tamizado o difracción láser con método validado<br>\n  3) Comparar d10, d50 y d90 contra la especificación<br>\n  a) Distribución dentro de especificación en todos los lotes<br>\n  4) Procesar los datos crudos de granulometría en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Granulometría conforme en todos los lotes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Reportes de granulometría por lote<br>\n  - Data cruda y reporte estadístico del análisis de granulometría"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;786&gt; (tamaño de partícula); especificación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-013 — Aspecto de la mezcla",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el aspecto de la mezcla: sin grumos, sin aglomerados ni material pegado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Al descargar cada lote, inspeccionar visualmente la mezcla con luz adecuada<br>\n  2) Buscar grumos, aglomerados, segregación visible y material adherido al bin<br>\n  3) Registrar el aspecto por lote con evidencia fotográfica<br>\n  4) Ante hallazgos, evaluar impacto y documentar la disposición<br>\n  a) Aspecto conforme en todos los lotes<br>\n  5) Anexar las fotografías con identificación de lote y fecha"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Aspecto conforme en el 100% de los lotes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de aspecto por lote con evidencia fotográfica"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; BMR."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-MZ-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-014 — Rendimiento y balance de masa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el rendimiento del <span class=\"equipo\">equipo</span> con balance de masa entre carga y descarga, incluyendo pérdida por adherencia o polvo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pesar la carga inicial con instrumento calibrado y registrar<br>\n  2) Descargar, pesar la descarga total y recuperar el material adherido al bin<br>\n  3) Calcular el rendimiento y la pérdida por adherencia o polvo<br>\n  4) Comparar contra el criterio de la receta<br>\n  a) Rendimiento mayor o igual a [98]% con pérdida dentro de lo previsto<br>\n  5) Procesar los datos crudos de balances en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  6) Repetir el balance en cada lote y anexar las pesadas"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Rendimiento mayor o igual al límite de la receta (98% por defecto) en todos los lotes, con la pérdida por adherencia o polvo cuantificada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Balances de masa por lote con pesadas<br>\n  - Data cruda y reporte estadístico del análisis de balances"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>BMR; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "mezclador"
   },
   {
    "kind": "resumen",
    "id": "EQ-PQ-MZ-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-RES — Tabla resumen de los ensayos del PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del PQ del mezclador para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EQ-PQ-MZ-001 a EQ-PQ-MZ-014 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 14 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "mezclador"
   },
   {
    "kind": "tabla",
    "id": "EQ-PQ-MZ-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-PQ-MZ-REF — Referencias del PQ de mezclador",
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
       "FDA/PQRI — Guía de uniformidad de mezcla en polvos: muestreo estratificado, réplicas, RSD ≤5,0% e individuales ±10%",
       "VIGENTE"
      ],
      [
       "6.2",
       "EU GMP Anexo 15 — PQ con tres lotes consecutivos salvo justificación por riesgo; peor caso y bracketing",
       "VIGENTE"
      ],
      [
       "6.3",
       "USP <616> — Densidad aparente y compactada de polvos",
       "VIGENTE"
      ],
      [
       "6.4",
       "USP <786> — Distribución de tamaño de partícula",
       "VIGENTE"
      ],
      [
       "6.5",
       "21 CFR 211.111 — Límites de tiempo en producción (tiempos de espera)",
       "VIGENTE"
      ],
      [
       "6.6",
       "BMR y especificación del producto — Atributos, receta nominal y punto final de mezcla",
       "VIGENTE"
      ],
      [
       "6.7",
       "Manual del fabricante del mezclador — Cargas, velocidades y límites de diseño",
       "VIGENTE"
      ]
     ]
    },
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de ciclos, perfiles de mezcla y curvas RSD-tiempo por lote</td></tr>\n<tr><td>8.2</td><td>Anexo B — Reportes analíticos (contenido, densidades, granulometría) y certificados de instrumentos</td></tr>\n<tr><td>8.3</td><td>Anexo C — Planos de muestreo, balances de masa y análisis de riesgo del número de lotes</td></tr>\n</tbody></table>",
    "familia": "mezclador"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO PQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Desempeño de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Desempeño con producción y calidad, asegurando personal, <span class=\"equipo\">equipo</span>, carga, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente durante todo el PQ.</li><li>Ejecutar y/o supervisar los ciclos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y dictaminar el desempeño del equipo.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span>, de la carga y de los accesos para la ejecución.</li><li>Facilitar la documentación de proceso y del fabricante.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Desempeño: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en las condiciones reales de uso (USP &lt;1058&gt;).</p>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-001 — Mapeo con carga máxima por ciclo de rutina",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear el <span class=\"equipo\">equipo</span> con la carga máxima en cada ciclo de rutina: uniformidad, ΔT entre sondas y respecto al sensor de control."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir la carga máxima por ciclo de rutina (configuración más densa) y distribuir los termopares según el plano<br>\n  2) Correr el mapeo por ciclo de rutina durante el periodo definido, registrando al intervalo establecido<br>\n  3) Calcular por sonda promedio, máximo y mínimo; ΔT entre sondas y contra el control<br>\n  a) Todos los sensores dentro de los límites del URS durante todo el estudio<br>\n  4) Procesar los datos crudos del mapeo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Mapeo conforme en todos los ciclos de rutina."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de sensores con carga máxima<br>\n  - Curvas y tabla por sonda y ciclo<br>\n  - Data cruda y reporte estadístico del análisis del mapeo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>OMS TRS 1010 Anexo 7; URS del equipo."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-002 — Mapeo con carga mínima (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear con carga mínima, pues con poca masa térmica el horno se comporta distinto, con calentamiento más rápido y mayor oscilación; si siempre opera lleno, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el horno opera con cargas variables; si no, pasar al paso 5)<br>\n  2) Configurar la carga mínima representativa y mapear por ciclo crítico<br>\n  3) Comparar oscilación y ciclos contra la carga máxima del ensayo EQ-PQ-HO-001<br>\n  a) Dentro de límites aun con mayor oscilación, o limitación documentada<br>\n  4) Procesar los datos crudos de carga mínima en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Sin cargas variables: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Carga mínima conforme o limitación documentada, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Mapeo con carga mínima y comparativa, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de carga mínima"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS del equipo; EU GMP Anexo 15 (rango)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-003 — Punto frío con carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Identificar el punto frío del <span class=\"equipo\">equipo</span> con carga, que puede estar en un lugar distinto al del OQ vacío, y revisar la posición del sensor de control y de monitoreo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con los datos del mapeo del ensayo EQ-PQ-HO-001, identificar el punto más lento y frío de la carga<br>\n  2) Comparar contra el punto frío del OQ en vacío y determinar si se desplazó, con su causa<br>\n  3) Revisar la posición del sensor de control y del monitoreo contra el nuevo punto frío<br>\n  4) Reubicar el monitoreo si cambió el punto crítico y registrar la nueva posición<br>\n  a) Punto frío con carga identificado con sensores en posiciones representativas<br>\n  5) Procesar los datos crudos de extremos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Punto frío con carga identificado con monitoreo correcto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Comparativa vacío contra carga con plano actualizado<br>\n  - Data cruda y reporte estadístico del análisis de extremos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>OMS TRS 1010 Anexo 7."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-004 — Tiempo de equilibrio del punto lento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir el tiempo de equilibrio del <span class=\"equipo\">equipo</span>: cuánto tarda el punto más lento de la carga en alcanzar la temperatura de proceso frente al sensor de control."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con los datos del mapeo, medir por sonda el tiempo desde que el control alcanza la temperatura hasta que cada punto la alcanza<br>\n  2) Determinar el equilibrio como el mayor tiempo (punto frío)<br>\n  3) Confirmar que el tiempo de mantenimiento programado cubre el equilibrio más la exposición requerida<br>\n  a) Equilibrio dentro del límite y mantenimiento posterior completo<br>\n  4) Procesar los datos crudos de equilibrio en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Equilibrio conocido y cubierto por el ciclo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de tiempos de equilibrio por sonda<br>\n  - Data cruda y reporte estadístico del análisis de equilibrio"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EN 285 §equilibrio (concepto); receta aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-005 — Penetración en el punto difícil por tipo de carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la penetración de calor en el punto más difícil de cada tipo de carga del <span class=\"equipo\">equipo</span> (contenedores cerrados, bandejas apiladas, material denso)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir los tipos de carga del sitio y el punto más difícil de cada uno<br>\n  2) Ubicar sondas en el punto difícil de cada tipo, con plano<br>\n  3) Correr un ciclo por tipo registrando la temperatura interna<br>\n  4) Confirmar meseta completa en el punto difícil de cada tipo<br>\n  a) El punto difícil alcanza la banda y la mantiene toda la meseta<br>\n  5) Procesar los datos crudos de penetración en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Penetración demostrada por tipo de carga."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de penetración por tipo de carga con curvas<br>\n  - Data cruda y reporte estadístico del análisis de penetración"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>PDA TR-01 (tipos de carga); receta aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-006 — Mantenimiento del punto lento y equivalencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el punto más lento del <span class=\"equipo\">equipo</span> mantiene el tiempo a temperatura requerido (o la equivalencia letal) con el criterio mínimo del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con los datos del punto frío, confirmar el tiempo a temperatura en cada ciclo<br>\n  2) Calcular la equivalencia (letalidad o exposición acumulada) si el proceso la requiere, contra el criterio mínimo definido<br>\n  3) Comparar contra el criterio mínimo del protocolo<br>\n  a) Tiempo y equivalencia mayores o iguales al mínimo en todos los ciclos<br>\n  4) Procesar los datos crudos de mantenimiento en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Punto lento con tiempo y equivalencia conformes."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Cálculo de tiempo y equivalencia en el punto frío<br>\n  - Data cruda y reporte estadístico del análisis de mantenimiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1229&gt; (concepto de letalidad); receta aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-007 — Conteo del ciclo desde el punto frío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el tiempo del ciclo del <span class=\"equipo\">equipo</span> cuenta desde que el punto frío alcanza la temperatura y no desde que lo hace el sensor de control."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Comparar el inicio del conteo del controlador contra el momento en que el punto frío alcanza la temperatura, en 3 ciclos<br>\n  2) Cuantificar la diferencia y su efecto en la exposición del punto frío<br>\n  3) Ajustar el ciclo o el procedimiento si el conteo parte del control<br>\n  a) El conteo parte del punto frío, o la diferencia está justificada y cubierta<br>\n  4) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Conteo del ciclo anclado al punto frío."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Comparativa control contra punto frío por ciclo<br>\n  - Data cruda y reporte estadístico del análisis comparativo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>OMS TRS 961 §6 (punto más frío); receta aprobada."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-008 — Tres ciclos consecutivos por configuración",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar repetibilidad en tres ciclos consecutivos por configuración de carga del <span class=\"equipo\">equipo</span>, con el número justificado por riesgo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aprobar el análisis de riesgo que justifica el número de ciclos y anexarlo<br>\n  2) Correr 3 ciclos consecutivos por configuración sin cambios al proceso<br>\n  3) Comparar parámetros críticos y atributos entre ciclos<br>\n  a) Los 3 ciclos cumplen idénticos criterios por configuración<br>\n  4) Procesar los datos crudos inter-ciclo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Documentar desviaciones, alarmas o intervenciones"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Repetibilidad demostrada por configuración."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Análisis de riesgo del número de ciclos<br>\n  - Comparativa de los 3 ciclos por configuración<br>\n  - Data cruda y reporte estadístico del análisis inter-ciclo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 §§4.16–4.19."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-009 — Peor caso (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño del <span class=\"equipo\">equipo</span> en el peor caso: carga más densa, mayor masa, bandejas más apiladas o menor espacio para el flujo de aire."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el peor caso con el análisis de riesgo; si no hay peor caso diferenciable, pasar al paso 4)<br>\n  2) Correr instrumentado el peor caso y confirmar meseta y uniformidad<br>\n  a) Peor caso conforme en todo<br>\n  3) Procesar los datos crudos del peor caso en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  4) Sin peor caso diferenciable: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Peor caso conforme, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Definición del peor caso con análisis de riesgo, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis del peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 (peor caso)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-010 — Humedad residual del secado (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la humedad residual del producto o material secado con el mismo método validado y puntos definidos de muestreo, cuando aplique al uso del horno."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el horno seca producto con especificación de humedad; si es solo calentamiento, pasar al paso 5)<br>\n  2) Muestrear el material secado en puntos definidos y medir humedad con método validado<br>\n  3) Comparar contra la especificación del producto<br>\n  a) Humedad dentro de especificación en todos los puntos<br>\n  4) Procesar los datos crudos de humedad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Si no aplica: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Humedad conforme, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados de humedad por punto, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de humedad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;731&gt; (pérdida por secado); especificación del producto."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-011 — Estado de la carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el estado de la carga del <span class=\"equipo\">equipo</span>: sin deformación, daño térmico ni degradación del material o producto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Al descargar cada ciclo, inspeccionar visualmente la carga con luz adecuada<br>\n  2) Buscar deformación, decoloración, daño térmico y degradación<br>\n  3) Registrar el estado por ciclo con evidencia fotográfica si hay hallazgos<br>\n  4) Ante hallazgos, evaluar impacto y documentar la disposición<br>\n  a) Carga sin daño térmico en todos los ciclos<br>\n  5) Procesar los datos crudos de estado en el módulo de análisis estadístico cuando aplique medición (por ejemplo conteo de unidades afectadas) y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Carga sin daño atribuible al ciclo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del estado de la carga por ciclo<br>\n  - Data cruda y reporte estadístico, si aplica medición"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; BMR."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-012 — Valoración y degradación (si aplica, termolábil)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la valoración y los productos de degradación cuando el producto es termolábil; si no lo es, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar en el dossier si el producto es termolábil; si no, pasar al paso 5)<br>\n  2) Analizar valoración y degradación por método validado en muestras de cada ciclo<br>\n  3) Comparar contra la especificación y contra el material antes del horno<br>\n  4) Evaluar el impacto térmico del ciclo<br>\n  a) Valoración y degradación dentro de especificación<br>\n  5) Si no aplica: redactar la justificación de No Aplica con firma del ejecutor y del revisor<br>\n  6) Procesar los datos crudos analíticos en el módulo de análisis estadístico (cuando aplique) y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Conforme, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Reportes analíticos por ciclo, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de valoración"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; dossier del activo."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-013 — Estabilidad de temperatura en mantenimiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la estabilidad de la temperatura del <span class=\"equipo\">equipo</span> durante el mantenimiento, sin excursiones fuera de límites."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar la temperatura cada intervalo definido durante la meseta, en 3 ciclos con carga<br>\n  2) Calcular estabilidad (rango y SD) y listar alarmas ocurridas<br>\n  a) Dentro de banda el 100% del tiempo, con cero alarmas no gestionadas<br>\n  3) Procesar los datos crudos de estabilidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Meseta estable sin alarmas no gestionadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de temperatura en meseta por ciclo<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Receta aprobada; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-014 — Respuesta de alarmas con carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las alarmas del <span class=\"equipo\">equipo</span> disparan dentro del retardo definido, con carga en la cámara."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con carga en la cámara, provocar o simular las alarmas críticas del ciclo<br>\n  2) Medir el tiempo entre la condición y el disparo, y confirmar el acuse<br>\n  3) Confirmar registro en el histórico con hora<br>\n  a) Disparo dentro del retardo con acuse y registro<br>\n  4) Anexar la matriz de alarmas con tiempos medidos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Alarmas funcionales con carga dentro del retardo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con tiempos y acuse"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; GAMP5 2.ª ed."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-015 — Falla de energía con carga (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el comportamiento del ciclo y el criterio de rechazo o repetición de la carga ante falla de energía con carga."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el escenario de falla a ensayar (duración y fase del ciclo); si el procedimiento no lo exige, pasar al paso 5)<br>\n  2) Cortar la energía con carga, anotar hora y fase, y registrar la deriva<br>\n  3) Restablecer y evaluar la carga según el criterio: rechazar o repetir<br>\n  4) Documentar la disposición con firmas<br>\n  a) Escenario cubierto con criterio de disposición aplicado<br>\n  5) Sin requisito: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Falla caracterizada con criterio de disposición, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la falla con disposición de la carga, o justificación de No Aplica firmada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>GAMP5 2.ª ed.; procedimiento de excursiones."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-016 — Registrador frente a control y mapeo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Comparar el registrador independiente del <span class=\"equipo\">equipo</span> frente al sensor de control y las sondas de mapeo durante la corrida, con diferencia dentro del criterio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar en paralelo control, registrador independiente y mapeo durante una corrida nominal con carga<br>\n  2) Calcular las diferencias punto a punto entre las tres fuentes<br>\n  3) Confirmar que las tres cuentan la misma historia del proceso<br>\n  a) Diferencias dentro del criterio (±0,5 °C)<br>\n  4) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Las tres fuentes coinciden dentro del criterio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Comparativa de las tres fuentes con diferencias<br>\n  - Data cruda y reporte estadístico del análisis comparativo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-017 — Revisión de registros de cada ciclo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Revisar los registros de cada ciclo del <span class=\"equipo\">equipo</span>: parámetros críticos, alarmas y acciones tomadas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recopilar los registros de todos los ciclos del PQ<br>\n  2) Verificar parámetros críticos dentro de límites y firmados por etapa<br>\n  3) Listar alarmas con causas, acciones y cierres<br>\n  4) Confirmar revisión por el área ejecutora y por calidad<br>\n  a) Registros completos, coherentes y cerrados<br>\n  5) Anexar la lista de verificación de registros diligenciada"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Registros completos con alarmas cerradas y trazabilidad total."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Lista de verificación de registros diligenciada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.180; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-HO-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-018 — Criterios de liberación de rutina",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Derivar del PQ los criterios de liberación de rutina del <span class=\"equipo\">equipo</span> y llevarlos al SOP."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recopilar los criterios demostrados en el PQ (tiempos, temperaturas, uniformidad, alarmas)<br>\n  2) Redactar los criterios de liberación de rutina (qué se verifica por ciclo y sus límites)<br>\n  3) Referenciar el SOP donde quedan oficializados, con su versión<br>\n  4) Aprobar los criterios con calidad<br>\n  a) Criterios de rutina definidos, trazables al PQ y en el SOP<br>\n  5) Anexar la tabla de criterios con su trazabilidad al ensayo que los demostró"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Liberación de rutina definida y en el SOP."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de criterios de liberación con trazabilidad al PQ"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; SOP del equipo."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "resumen",
    "id": "EQ-PQ-HO-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-RES — Tabla resumen de los ensayos del PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del PQ del horno de secado para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EQ-PQ-HO-001 a EQ-PQ-HO-018 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 18 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "horno-secado"
   },
   {
    "kind": "tabla",
    "id": "EQ-PQ-HO-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-PQ-HO-REF — Referencias del PQ de horno de secado",
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
       "OMS TRS 1010 Anexo 7 — Mapeo, uniformidad y monitoreo de cámaras y hornos",
       "VIGENTE"
      ],
      [
       "6.2",
       "USP <1058> — Analytical Instrument Qualification: sensores y patrones asociados",
       "VIGENTE"
      ],
      [
       "6.3",
       "USP <1229.8> — Esterilización por calor seco: conceptos de letalidad aplicables",
       "VIGENTE"
      ],
      [
       "6.4",
       "USP <731> — Pérdida por secado: humedad residual del material secado",
       "VIGENTE"
      ],
      [
       "6.5",
       "EU GMP Anexo 15 — PQ con tres ciclos salvo justificación por riesgo",
       "VIGENTE"
      ],
      [
       "6.6",
       "21 CFR 211.180 — Registros de lote y trazabilidad",
       "VIGENTE"
      ],
      [
       "6.7",
       "Manual del fabricante del horno — Ciclos, setpoints, alarmas y límites de diseño",
       "VIGENTE"
      ]
     ]
    },
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de ciclos, curvas de temperatura y mapeos con carga</td></tr>\n<tr><td>8.2</td><td>Anexo B — Reportes analíticos y certificados de patrones e instrumentos</td></tr>\n<tr><td>8.3</td><td>Anexo C — Matrices de alarmas, registros de fallas y listas de verificación</td></tr>\n</tbody></table>",
    "familia": "horno-secado"
   },
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO PQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Desempeño de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>",
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "firmas",
    "bloque": 1,
    "html": "<p><strong>FLUJO DE FIRMAS DEL PROTOCOLO:</strong></p>\n<p>Este apartado establece que los responsables revisan y aprueban el presente protocolo, declarando que está apto para su ejecución. Cualquier cambio posterior a la firma obliga a reiniciar el flujo de firmas, con el fin de garantizar que todos los departamentos involucrados estén al tanto de los ensayos a ejecutar.</p>\n<ol>\n  <li><strong>Elaborado Por:</strong> <br> Analista de validaciones — elabora / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Coordinador de validaciones — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Revisado Por:</strong> <br> Gerente de Área — revisa / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n  <li><strong>Aprobado por:</strong> <br> Gerente de gestión de calidad — aprueba / Nombre: ______ Firma: ______ Fecha: ______</li><br>\n</ol>",
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "responsabilidades",
    "bloque": 1,
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Desempeño con laboratorio y calidad, asegurando personal, <span class=\"equipo\">equipo</span>, material de referencia, carga real, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente durante todo el PQ.</li><li>Ejecutar y/o supervisar los ciclos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y dictaminar el desempeño del equipo.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span>, del material y de los accesos para la ejecución.</li><li>Facilitar la documentación de métodos y del fabricante.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>",
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice.</p>",
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Desempeño: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en las condiciones reales de uso (USP &lt;1058&gt;).</p>",
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-VA-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-001 — Secado del material de referencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el secado del material de referencia del <span class=\"equipo\">equipo</span> en las condiciones del método más exigente, contra el valor certificado o contra un horno ya calificado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el material de referencia (patrón, muestra certificada o material caracterizado) y el método más exigente del laboratorio<br>\n  2) Ejecutar el secado completo según el método, registrando condiciones y tiempos<br>\n  3) Medir el resultado (humedad residual, peso constante u otro parámetro del método) con método validado<br>\n  4) Comparar contra el valor certificado o contra el horno ya calificado<br>\n  a) Resultado dentro del criterio (igual al certificado o a la referencia dentro de la tolerancia)<br>\n  5) Procesar los datos crudos del secado en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Secado conforme al valor certificado o a la referencia."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del secado con resultado y comparativa<br>\n  - Data cruda y reporte estadístico del análisis del secado<br>\n  - Certificado del material de referencia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Métodos del laboratorio; USP &lt;731&gt;."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-VA-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-002 — Repetibilidad en una corrida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar repetibilidad con al menos seis réplicas en una sola corrida del <span class=\"equipo\">equipo</span>, con RSD dentro del criterio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Preparar 6 réplicas del material en posiciones distribuidas de la cámara<br>\n  2) Correr el ciclo completo una sola vez con las 6 réplicas<br>\n  3) Medir el resultado de cada réplica con el método del ensayo EQ-PQ-VA-001<br>\n  4) Calcular media, SD y RSD del conjunto<br>\n  a) RSD dentro del criterio (por ejemplo menor o igual a 5,0%)<br>\n  5) Procesar los datos crudos de réplicas en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Repetibilidad demostrada en una corrida."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de 6 réplicas con media, SD y RSD<br>\n  - Data cruda y reporte estadístico del análisis de repetibilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Métodos del laboratorio; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-VA-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-003 — Reproducibilidad entre corridas y analistas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar reproducibilidad entre corridas y entre analistas del <span class=\"equipo\">equipo</span>, en días distintos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Asignar corridas a analistas distintos en días distintos (mínimo 2 analistas y 2 días)<br>\n  2) Ejecutar el secado del material de referencia en cada combinación con el mismo método<br>\n  3) Comparar resultados entre corridas y entre analistas<br>\n  4) Evaluar el efecto del analista y del día<br>\n  a) Sin efecto significativo del analista ni del día; resultados dentro del criterio<br>\n  5) Procesar los datos crudos de reproducibilidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Reproducibilidad demostrada entre corridas y analistas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla por corrida, analista y día con comparativa<br>\n  - Data cruda y reporte estadístico del análisis de reproducibilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Métodos del laboratorio; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-VA-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-004 — Posiciones de bandeja",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el desempeño del <span class=\"equipo\">equipo</span> en varias posiciones de bandeja (superior, media e inferior), con la bandeja cargada como en uso real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Cargar bandejas como en uso real en las posiciones superior, media e inferior<br>\n  2) Correr el ciclo completo y medir el resultado por posición<br>\n  3) Comparar las posiciones entre sí y contra el criterio<br>\n  a) Todas las posiciones conformes sin efecto significativo de la posición<br>\n  4) Procesar los datos crudos por posición en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Desempeño uniforme en todas las posiciones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Resultados por posición de bandeja con comparativa<br>\n  - Data cruda y reporte estadístico del análisis por posición"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Métodos del laboratorio; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-VA-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-005 — Peso constante del método",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el tiempo de método del <span class=\"equipo\">equipo</span> alcanza el peso constante, sin sobresecar ni degradar el material."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Pesar el material antes del ciclo con balanza calibrada y registrar<br>\n  2) Correr el tiempo de método completo y pesar al final<br>\n  3) Extender 30 minutos adicionales y volver a pesar para confirmar constancia<br>\n  4) Confirmar que no hay degradación (aspecto, color) por sobreexposición<br>\n  a) Peso constante alcanzado en el tiempo de método sin degradación<br>\n  5) Procesar los datos crudos de pesadas en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Peso constante en el tiempo de método sin degradación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Pesadas antes, al final y extendidas<br>\n  - Data cruda y reporte estadístico del análisis de peso constante"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;731&gt; (pérdida por secado); métodos del laboratorio."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-VA-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-006 — Mapeo con carga representativa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear el <span class=\"equipo\">equipo</span> con carga representativa: número y tamaño de recipientes habituales, bajo vacío y a la temperatura de método, pues las muestras en recipiente cerrado o apilado se calientan distinto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir la carga representativa (número, tamaño y apilado de recipientes habituales)<br>\n  2) Distribuir termopares en la carga, incluyendo recipientes cerrados y apilados, con plano<br>\n  3) Correr el ciclo bajo vacío a la temperatura de método, registrando al intervalo definido<br>\n  4) Calcular uniformidad y comparar recipiente abierto contra cerrado y apilado<br>\n  a) Uniformidad dentro de tolerancia con la carga representativa<br>\n  5) Procesar los datos crudos del mapeo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Mapeo conforme con carga representativa."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de carga y sensores con curvas por sonda<br>\n  - Data cruda y reporte estadístico del análisis del mapeo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>DIN 12880 (hornos); métodos del laboratorio."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-VA-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-007 — Temperatura dentro del recipiente",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la temperatura dentro del recipiente o de la muestra del <span class=\"equipo\">equipo</span>, no solo la del aire de la cámara."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ubicar sondas dentro del recipiente o de la muestra, además de las de cámara<br>\n  2) Correr el ciclo y comparar interior contra cámara a lo largo del tiempo<br>\n  3) Medir el retraso térmico y la diferencia máxima<br>\n  4) Confirmar que el interior alcanza la temperatura requerida en el tiempo previsto<br>\n  a) Interior conforme con retraso conocido y aceptado<br>\n  5) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Temperatura interior verificada y aceptada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas interior contra cámara con retraso<br>\n  - Data cruda y reporte estadístico del análisis comparativo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Métodos del laboratorio; DIN 12880."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-VA-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-008 — Carga máxima: vacío y evacuación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el efecto de la carga máxima del <span class=\"equipo\">equipo</span> en el nivel de vacío alcanzable y en el tiempo de evacuación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Configurar la carga máxima declarada y evacuar registrando presión contra tiempo<br>\n  2) Comparar nivel y tiempo contra la cámara vacía del ensayo EQ-OQ-VA-006<br>\n  3) Confirmar que el vacío de método se alcanza con carga máxima<br>\n  a) Vacío y tiempo conformes con carga máxima<br>\n  4) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vacío de método alcanzable con carga máxima."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de evacuación con y sin carga<br>\n  - Data cruda y reporte estadístico del análisis comparativo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS del equipo; métodos del laboratorio."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-VA-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-009 — Peor caso con volátiles o carga densa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar el desempeño del <span class=\"equipo\">equipo</span> en el peor caso: muestra con mayor contenido de volátiles, solventes de baja presión de vapor, o configuración de carga más densa."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir el peor caso con el análisis de riesgo y anexar su justificación<br>\n  2) Correr instrumentado el peor caso y confirmar secado y uniformidad<br>\n  3) Confirmar que el vacío se mantiene pese a la carga de volátiles<br>\n  a) Peor caso conforme en todo<br>\n  4) Procesar los datos crudos del peor caso en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Peor caso conforme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Definición del peor caso con análisis de riesgo<br>\n  - Registros del peor caso<br>\n  - Data cruda y reporte estadístico del análisis del peor caso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15 (peor caso)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "ensayo",
    "id": "EQ-PQ-VA-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-010 — Operación continua del método más largo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la operación continua del <span class=\"equipo\">equipo</span> durante la duración más larga de un método."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar el método de mayor duración del laboratorio y su tiempo total<br>\n  2) Correr el ciclo completo de esa duración con carga y monitoreo continuo<br>\n  3) Confirmar mantenimiento de vacío y temperatura sin intervenciones extraordinarias<br>\n  4) Confirmar el resultado del material al final<br>\n  a) Operación continua conforme durante el método más largo<br>\n  5) Procesar los datos crudos del periodo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Operación continua conforme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros continuos del método más largo<br>\n  - Data cruda y reporte estadístico del análisis del periodo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Métodos del laboratorio; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "horno-vacio"
   },
   {
    "kind": "resumen",
    "id": "EQ-PQ-VA-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-RES — Tabla resumen de los ensayos del PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del PQ del horno de vacío para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EQ-PQ-VA-001 a EQ-PQ-VA-010 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 10 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "familia": "horno-vacio"
   },
   {
    "kind": "tabla",
    "id": "EQ-PQ-VA-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EQ-PQ-VA-REF — Referencias del PQ de horno de vacío",
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
       "DIN 12880 — Aparatos eléctricos de laboratorio: hornos, desempeño térmico",
       "VIGENTE"
      ],
      [
       "6.2",
       "USP <731> — Pérdida por secado: peso constante y humedad residual",
       "VIGENTE"
      ],
      [
       "6.3",
       "USP <1058> — Analytical Instrument Qualification: sensores y patrones asociados",
       "VIGENTE"
      ],
      [
       "6.4",
       "EU GMP Anexo 15 — PQ con repetibilidad y reproducibilidad justificadas",
       "VIGENTE"
      ],
      [
       "6.5",
       "Métodos del laboratorio — Material de referencia, réplicas y criterios de aceptación",
       "VIGENTE"
      ],
      [
       "6.6",
       "Manual del fabricante del horno de vacío — Vacío, setpoints y límites de diseño",
       "VIGENTE"
      ]
     ]
    },
    "familia": "horno-vacio"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de ciclos, curvas de vacío y temperatura, y mapeos con carga</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados del material de referencia, patrones e instrumentos</td></tr>\n<tr><td>8.3</td><td>Anexo C — Comparativas entre corridas, analistas y posiciones</td></tr>\n</tbody></table>",
    "familia": "horno-vacio"
   }
  ]
 }
};
if (typeof module !== "undefined" && module.exports) module.exports = BancoEquipos;
