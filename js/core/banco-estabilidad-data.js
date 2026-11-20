// Generado por scripts/extraer-banco.mjs estabilidad — NO EDITAR A MANO.
// Fuente: docs/banco-ensayos/estabilidad/iq-camaras.html + docs/banco-ensayos/estabilidad/oq-camaras.html + docs/banco-ensayos/estabilidad/pq-camaras.html (versión: EST-IQ-CAM 2026-11-19 v3 + EST-OQ-CAM 2026-11-19 v3 + EST-PQ-CAM 2026-11-19 v3).
var BancoEstabilidad = {
 "version": "EST-IQ-CAM 2026-11-19 v3 + EST-OQ-CAM 2026-11-19 v3 + EST-PQ-CAM 2026-11-19 v3",
 "fases": {
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
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Instalación con las áreas involucradas, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar las verificaciones del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar el inicio de la OQ.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>"
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
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Instalación: conjunto documentado de actividades necesarias para establecer que un instrumento se entrega según su diseño y especificación, y que está correctamente instalado en el entorno seleccionado y es adecuado para él (<span class=\"refnorma\"></span>).</p>"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>"
   },
   {
    "kind": "ensayo",
    "id": "EST-IQ-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-IQ-001 — Estanterías y parrillas internas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las estanterías y parrillas internas del <span class=\"equipo\">equipo</span> corresponden al diseño, están correctamente instaladas y soportan la carga prevista."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar estanterías y parrillas según plano y lista de empaque del fabricante<br>\n  2) Verificar material (acero inoxidable u otro aprobado), acabado sin rebabas y niveles ajustables operativos<br>\n  3) Confirmar instalación firme, sin movimientos ni deformaciones, con carga de prueba según capacidad declarada<br>\n  4) Registrar cantidad, posiciones y capacidad por nivel<br>\n  a) Instalación firme con capacidad declarada disponible<br>\n  5) Fotografiar la configuración instalada"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Estanterías y parrillas según plano, con material compatible y sin corrosión.<br>Separación mínima entre estantes y pared posterior ≥ <span class=\"por-confirmar\">10 cm</span> para circulación.<br>Carga uniforme y sin obstruir difusores ni retorno.<br>Fijación estable, sin vibración con el equipo en marcha."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de estanterías con capacidades y evidencia fotográfica"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La separación en rojo se confirma con el plano de la cámara y la recomendación del fabricante."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EST-IQ-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-IQ-002 — Controlador de setpoints de temperatura y HR",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el controlador del <span class=\"equipo\">equipo</span> permite programar los setpoints de temperatura y HR del rango declarado, con la resolución y los programas requeridos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Encender el controlador y confirmar arranque sin errores<br>\n  2) Programar el setpoint mínimo, uno medio y el máximo del rango y confirmar su aceptación<br>\n  3) Verificar la resolución de programación (0,1 °C y 1% HR o mejor, según modelo)<br>\n  4) Confirmar programas o recetas disponibles (acelerada, real, personalizados) y protección por contraseña o niveles de acceso<br>\n  5) Registrar firmware o versión de software del controlador<br>\n  a) Setpoints, resolución, programas y accesos conformes al manual<br>\n  6) Anexar pantallazos o registro de la configuración verificada"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Controlador con setpoints programables para los rangos de estudio (<span class=\"por-confirmar\">25/60, 30/65, 40/75</span>).<br>Alarmas configurables con límite y retardo; usuarios y roles únicos.<br>Registro con marca de tiempo y audit trail activo.<br>Restauración de configuración probada y documentada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de setpoints programados con resolución y versión de firmware"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los setpoints en rojo dependen del plan de estabilidad del producto; se confirman con ICH Q1A(R2)."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Registrador de datos calibrado"
   },
   {
    "kind": "resumen",
    "id": "EST-IQ-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EST-IQ-RES — Tabla resumen de los ensayos del IQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos específicos del IQ de cámaras para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos específicos EST-IQ-001 y EST-IQ-002 están incluidos en el índice junto al núcleo común"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ensayos específicos en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "tabla",
    "id": "EST-IQ-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EST-IQ-REF — Referencias del IQ de cámaras de estabilidad",
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
       "ICH Q1A(R2) — Estabilidad: condiciones y tolerancias de cámaras",
       "VIGENTE"
      ],
      [
       "6.2",
       "EU GMP Anexo 15 — Cualificación y validación",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación",
       "VIGENTE"
      ],
      [
       "6.4",
       "Manual del fabricante del recinto — Instalación y controlador",
       "VIGENTE"
      ]
     ]
    }
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de instalación y configuración del controlador</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de instrumentos y evidencia fotográfica</td></tr>\n</tbody></table>"
   }
  ],
  "OQ": [
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO OQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Operación de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>"
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
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Operación con las áreas involucradas, asegurando personal, <span class=\"equipo\">equipo</span>, instrumentos patrón y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente.</li><li>Ejecutar y/o supervisar los ensayos del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y autorizar el inicio de la PQ.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span> y los accesos para la ejecución.</li><li>Facilitar la documentación técnica del fabricante y del proveedor.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice.</p>"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Operación: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en el entorno seleccionado (<span class=\"refnorma\"></span>).</p>"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-001 — Parada de emergencia",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia del <span class=\"equipo\">equipo</span> detiene los sistemas activos y deja el recinto en estado seguro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar IQ aprobada y <span class=\"equipo\">equipo</span> liberado para OQ, en condición nominal de operación<br>\n  2) Accionar la parada de emergencia y medir con cronómetro el tiempo hasta la detención de ventilación, humidificación y calefacción<br>\n  3) Confirmar el estado seguro y el mensaje en el controlador o HMI<br>\n  a) Detención total dentro del límite del fabricante<br>\n  4) Sin rearmar, intentar arrancar y confirmar que queda impedido<br>\n  5) Rearmar según el fabricante, confirmar condición segura sin arranque solo y dejar el <span class=\"equipo\">equipo</span> en condición segura"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>La parada de emergencia detiene calefacción, humidificador y compresor en ≤ <span class=\"por-confirmar\">5 s</span>.<br>El equipo queda en estado seguro, sin reinicio automático.<br>El evento queda registrado con hora y usuario."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba con tiempo de detención medido"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo en rojo se confirma con el diseño del equipo y el procedimiento de emergencia."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-002 — Protección independiente de sobretemperatura",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la protección independiente de sobretemperatura corta la calefacción al llegar al límite, con el control principal inhabilitado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar el termostato o controlador independiente de seguridad y su setpoint (registrar el valor en °C y su fuente antes de iniciar)<br>\n  2) Inhabilitar el control principal según el procedimiento del fabricante (simulación supervisada)<br>\n  3) Elevar la temperatura de forma controlada hasta el límite de seguridad<br>\n  4) Confirmar el corte de la calefacción por el dispositivo independiente y su alarma<br>\n  a) Corte efectivo al límite con el control principal inhabilitado<br>\n  5) Restituir el control principal, normalizar y confirmar operación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>La protección independiente corta la calefacción a setpoint + <span class=\"por-confirmar\">2 °C</span>.<br>No hay reinicio automático: el rearme es manual.<br>La actuación queda registrada y es independiente del control principal."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba con setpoint y respuesta"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El margen en rojo se confirma con el fabricante; la protección debe ser independiente del lazo de control."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-003 — Interlocks del recinto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los interlocks del <span class=\"equipo\">equipo</span>: puerta abierta (humidificador, calefacción y compresor), falta de agua en el humidificador y falla de compresor."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Dejar el <span class=\"equipo\">equipo</span> en condición nominal y disponer de la matriz de interlocks<br>\n  2) Abrir la puerta y confirmar el comportamiento del humidificador, la calefacción y el compresor según el diseño (inhibición o detención)<br>\n  3) Vaciar o aislar el agua del humidificador y confirmar su interlock con mensaje<br>\n  4) Simular falla del compresor y confirmar la respuesta del sistema<br>\n  a) Cada interlock ejecuta su acción diseñada con mensaje<br>\n  5) Restituir todo a normal y cerrar la matriz"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Con puerta abierta se detienen humidificador, calefacción y compresor en ≤ <span class=\"por-confirmar\">5 s</span>.<br>Al cerrar, el equipo retoma el control sin intervención manual.<br>Prueba registrada por interlock."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de interlocks con condición y respuesta"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo en rojo se confirma con el diseño del control."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-004 — Alarmas y límites",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar límites, retardos y disparo de cada alarma del <span class=\"equipo\">equipo</span>: alta y baja temperatura, alta y baja HR, puerta abierta, falla de sensor y falta de agua."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar las alarmas con sus límites y retardos según el controlador y la receta<br>\n  2) Provocar o simular una por vez: alta y baja temperatura, alta y baja HR, puerta abierta, falla de sensor (desconexión) y falta de agua<br>\n  3) Por cada una confirmar disparo, retardo configurado, acción asociada y acuse registrado<br>\n  a) Todas disparan en su límite con su retardo y quedan en el histórico<br>\n  4) Normalizar cada condición y confirmar el retorno a operación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cada alarma dispara dentro del retardo configurado (<span class=\"por-confirmar\">≤ 5 min</span>).<br>Límites de alarma: ±<span class=\"por-confirmar\">2 °C</span> y ±<span class=\"por-confirmar\">5 % HR</span> respecto del setpoint.<br>Registro con fecha, hora, valor y usuario."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con límite, retardo, acción y acuse"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Límites y retardo en rojo se confirman con la URS del estudio y la criticidad del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-005 — Notificación remota de alarmas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la notificación remota de alarmas del <span class=\"equipo\">equipo</span> (SMS, correo o sistema de monitoreo del edificio)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar el medio de notificación configurado y sus destinatarios<br>\n  2) Provocar una alarma de prueba (por ejemplo puerta abierta o desviación de temperatura)<br>\n  3) Confirmar la recepción de la notificación en el medio correspondiente con hora<br>\n  4) Confirmar que la notificación identifica el equipo, la alarma y la hora del evento<br>\n  a) Notificación recibida con identificación completa del evento<br>\n  5) Registrar el resultado con evidencia de recepción"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>La notificación remota llega al destinatario en ≤ <span class=\"por-confirmar\">5 min</span>.<br>Se prueba cada canal configurado (SMS, correo o monitoreo).<br>Registro de envío y de recepción."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Evidencia de recepción de la notificación de prueba"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo en rojo depende del esquema de guardias; se confirma con Calidad."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-006 — Falla y recuperación de energía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el tiempo de retorno a condiciones, el estado del <span class=\"equipo\">equipo</span> y la continuidad del registro independiente (UPS o generador) ante falla de energía."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Poner el <span class=\"equipo\">equipo</span> en condición nominal de almacenamiento y coordinar el corte real o simulado<br>\n  2) Cortar la energía, anotar la hora y confirmar el estado del equipo y la conmutación del registro independiente<br>\n  3) Esperar 5 minutos sin energía<br>\n  4) Restablecer y medir el tiempo de retorno a condiciones nominales<br>\n  5) Confirmar que no hay arranque espontáneo inseguro y que el registro es continuo, sin huecos injustificados (ALCOA+)<br>\n  a) Retorno a condiciones dentro del límite y registro continuo<br>\n  6) Anexar el registro del evento y la verificación de datos"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Tras la alarma o parada, el equipo retorna a condiciones en ≤ <span class=\"por-confirmar\">60 min</span>.<br>La continuidad del registro se mantiene durante el evento.<br>Sin pérdida de datos ni reinicio del estudio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del evento con tiempo de retorno<br>\n  - Verificación de continuidad del registro independiente"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo en rojo se confirma con el diseño del equipo y el procedimiento de contingencia."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Registrador de datos calibrado"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-007 — Exactitud de sensores frente a patrón",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la exactitud de los sensores de control del <span class=\"equipo\">equipo</span> frente a un patrón de referencia en cada setpoint de la tabla."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Disponer del patrón de referencia calibrado (temperatura y HR) y de la tabla de setpoints aprobada del recinto<br>\n  2) Estabilizar el recinto en cada setpoint de la tabla y comparar control contra patrón<br>\n  3) Registrar por setpoint ambas lecturas y la diferencia<br>\n  a) Diferencia de temperatura menor o igual a ±0,5 °C y de HR menor o igual a ±3% HR<br>\n  4) Repetir en todos los setpoints de la tabla<br>\n  5) Procesar los datos crudos de exactitud en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = desviación de los sensores; unidad = °C y % HR. Tipo de dato = continua. n = 3 comparaciones por sensor contra patrón. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = desviación dentro de ±0,5 °C y ±3 % HR. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Exactitud de los sensores de control ≤ <span class=\"por-confirmar\">±0,5 °C</span> y ≤ <span class=\"por-confirmar\">±3 % HR</span> frente a patrón.<br>Calibración vigente y trazable de cada sensor usado.<br>Registro por sensor, sin promedio entre sensores."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de setpoints con control contra patrón por punto<br>\n  - Data cruda y reporte estadístico del análisis de exactitud<br>\n  - Certificado del patrón de referencia"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Las tolerancias en rojo se confirman con el certificado de calibración y la URS."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado; Termohigrómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-008 — Estabilidad y exactitud del control de temperatura",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad y la exactitud del control de temperatura del <span class=\"equipo\">equipo</span> en setpoints bajo, medio y alto del rango."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fijar el setpoint bajo del rango, estabilizar y registrar cada 5 minutos durante 30 minutos como mínimo<br>\n  2) Repetir en setpoint medio y en setpoint alto<br>\n  3) Calcular por setpoint el promedio, el rango y la desviación<br>\n  a) Estabilidad dentro de ±1 °C y exactitud dentro de ±0,5 °C contra el patrón<br>\n  4) Procesar los datos crudos de estabilidad en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura de control; unidad = °C. Tipo de dato = continua. n = 3 ventanas de 30 min por setpoint. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media dentro de ±2 °C y DE ≤ 0,5 °C. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Estabilidad de la temperatura de control dentro de ±<span class=\"por-confirmar\">0,5 °C</span> en 30 min.<br>Exactitud de consigna dentro de ±<span class=\"por-confirmar\">2 °C</span> del setpoint.<br>Sin oscilación sostenida ni ciclado corto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de estabilidad por setpoint con estadística<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad de temperatura"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Las tolerancias en rojo se confirman con la URS; para cámaras de estabilidad la práctica es ±2 °C de consigna."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-009 — Estabilidad y exactitud del control de HR (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad y la exactitud del control de HR del <span class=\"equipo\">equipo</span> en cada setpoint con HR; si el recinto no controla HR, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el recinto controla HR; si no, pasar al paso 5)<br>\n  2) Fijar cada setpoint con HR de la tabla, estabilizar y registrar cada 5 minutos durante 30 minutos<br>\n  3) Comparar contra el patrón de referencia en cada setpoint<br>\n  a) Estabilidad dentro de ±3% HR y exactitud dentro de ±3% HR contra el patrón<br>\n  4) Procesar los datos crudos de HR en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Sin control de HR: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = humedad relativa de control; unidad = % HR. Tipo de dato = continua. n = 3 ventanas de 30 min por setpoint. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media dentro de ±5 % HR del setpoint. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Estabilidad de la HR dentro de ±<span class=\"por-confirmar\">5 % HR</span> del setpoint.<br>Sin oscilación &gt; 5 % en 30 min.<br>Respuesta al cambio de setpoint ≤ 30 min."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de HR por setpoint, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de HR"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La tolerancia en rojo se confirma con la URS y el plan de estabilidad."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termohigrómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-010 — Tiempo de llegada a condiciones y sobreimpulso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir el tiempo de llegada a condiciones del <span class=\"equipo\">equipo</span> desde temperatura ambiente y su sobreimpulso (overshoot)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Partir del recinto a temperatura ambiente registrada, fijar el setpoint de trabajo<br>\n  2) Registrar temperatura (y HR si aplica) cada 5 minutos hasta estabilización<br>\n  3) Medir el tiempo hasta entrar en banda y el sobreimpulso máximo sobre el setpoint<br>\n  4) Repetir en un segundo setpoint representativo<br>\n  a) Tiempo de llegada dentro de lo previsto y sobreimpulso menor o igual a [2] °C<br>\n  5) Procesar los datos crudos de llegada en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tiempo de llegada a condiciones; unidad = min. Tipo de dato = continua. n = 3 arranques por setpoint. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media ≤ 60 min y sobreimpulso ≤ 2 °C. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Tiempo de llegada a condiciones ≤ <span class=\"por-confirmar\">60 min</span> desde temperatura ambiente.<br>Sobreimpulso de temperatura ≤ <span class=\"por-confirmar\">2 °C</span> sobre el setpoint.<br>Sin alarma durante la estabilización."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de llegada a condiciones por setpoint<br>\n  - Data cruda y reporte estadístico del análisis de llegada"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo y el sobreimpulso en rojo se confirman con el fabricante y el procedimiento de arranque."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-011 — Límites del rango en combinaciones extremas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar las combinaciones extremas de temperatura y HR que el recinto puede o no mantener, según su rango declarado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir las combinaciones extremas a ensayar (alta T con alta HR, alta T con baja HR, baja T con alta HR) según el rango declarado<br>\n  2) Fijar cada combinación, estabilizar y registrar durante 30 minutos<br>\n  3) Confirmar mantenimiento o documentar la limitación con su justificación técnica<br>\n  a) Cada combinación se mantiene o queda documentada como limitación del equipo<br>\n  4) Procesar los datos crudos de extremos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura y HR en extremos; unidad = °C y % HR. Tipo de dato = continua. n = 3 ventanas de 30 min por combinación extrema. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada combinación dentro de ±2 °C y ±5 % HR. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Combinaciones extremas de temperatura y HR mantenidas dentro de ±<span class=\"por-confirmar\">2 °C</span> y ±<span class=\"por-confirmar\">5 % HR</span>.<br>Mapa de capacidad declarado por el fabricante, verificado en los extremos.<br>Las combinaciones no soportadas se documentan como limitación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros por combinación extrema<br>\n  - Data cruda y reporte estadístico del análisis de extremos<br>\n  - Matriz de capacidades y limitaciones del equipo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los extremos y tolerancias en rojo se confirman con el mapa de capacidad del fabricante."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado; Termohigrómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-012 — Recuperación tras apertura de puerta",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir el tiempo de recuperación del <span class=\"equipo\">equipo</span> tras apertura de puerta, con una duración definida según el uso real."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Estabilizar el recinto en su setpoint de trabajo y definir la duración de apertura según el uso real (por ejemplo 1 a 5 min)<br>\n  2) Abrir la puerta el tiempo definido, cerrarla y medir el tiempo de retorno a banda<br>\n  3) Repetir 3 veces y registrar cada recuperación<br>\n  4) Confirmar que las aperturas breves de uso real quedan cubiertas<br>\n  a) Recuperación dentro del límite (picos breves aceptados como inevitables según ICH Q1A)<br>\n  5) Procesar los datos crudos de recuperación en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tiempo de recuperación tras apertura; unidad = min. Tipo de dato = continua. n = 3 aperturas por setpoint. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media ≤ 30 min en las 3. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Tiempo de recuperación tras apertura de puerta ≤ <span class=\"por-confirmar\">30 min</span>.<br>Apertura de duración definida (<span class=\"por-confirmar\">60 s</span>) y repetida 3 veces.<br>Sin excursión &gt; límite de alarma después de la recuperación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de recuperación por repetición<br>\n  - Data cruda y reporte estadístico del análisis de recuperación"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La duración de apertura y el tiempo en rojo se confirman con el uso real del área."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-013 — Mapeo de temperatura en recinto vacío",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear la temperatura del <span class=\"equipo\">equipo</span> en cada setpoint crítico, con sensores distribuidos en esquinas, centro, cerca de puerta, humidificador y ventilación; el número de sensores se justifica por volumen (gabinete contra walk-in) y la duración mínima suele ser 24 h por setpoint."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Justificar el número de sensores por el volumen del recinto y distribuirlos según el plano (esquinas, centro, puerta, humidificador, ventilación)<br>\n  2) Correr el mapeo en vacío por setpoint crítico durante 24 h como mínimo, registrando al intervalo definido<br>\n  3) Calcular por sensor promedio, máximo y mínimo; ΔT entre sensores; y estabilidad<br>\n  a) Uniformidad dentro de la tolerancia del recinto en todos los setpoints<br>\n  4) Procesar los datos crudos del mapeo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura por sensor; unidad = °C. Tipo de dato = continua. n = mínimo 9 sensores, 24 h por setpoint. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada sensor dentro de ±2 °C del setpoint. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Uniformidad de temperatura en vacío ≤ <span class=\"por-confirmar\">±2 °C</span> en cada setpoint crítico.<br>Mínimo <span class=\"por-confirmar\">9 sensores</span> justificados por volumen, distribuidos en esquinas, centro, puerta, humidificador y ventilación.<br>Duración mínima 24 h por setpoint, sin huecos de registro."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de sensores con justificación por volumen<br>\n  - Curvas y tabla por sensor y setpoint<br>\n  - Data cruda y reporte estadístico del análisis del mapeo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La tolerancia y el número de sensores en rojo se confirman con el volumen del recinto y la guía adoptada."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-014 — Mapeo de HR en los mismos setpoints (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear la HR del <span class=\"equipo\">equipo</span> en los mismos setpoints del mapeo de temperatura; si el recinto no controla HR, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el recinto controla HR; si no, pasar al paso 5)<br>\n  2) Con los mismos sensores y plano del ensayo EST-OQ-013, registrar HR por setpoint durante el mapeo<br>\n  3) Calcular uniformidad y estabilidad de HR por setpoint<br>\n  a) Uniformidad de HR dentro de la tolerancia del recinto<br>\n  4) Procesar los datos crudos de HR en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Sin control de HR: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = humedad relativa por sensor; unidad = % HR. Tipo de dato = continua. n = mismos puntos y duración del mapeo de T. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada sensor dentro de ±5 % HR del setpoint. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Uniformidad de HR en vacío ≤ <span class=\"por-confirmar\">±5 % HR</span> en cada setpoint con control de humedad.<br>Mismos puntos y duración que el mapeo de temperatura.<br>Si el recinto no controla HR, se declara No Aplica con aprobación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas y tabla de HR por sensor, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de HR"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La tolerancia en rojo se confirma con la URS; en recintos sin control de HR el ensayo no aplica."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termohigrómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-015 — Puntos críticos y sensor de monitoreo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Identificar puntos fríos, calientes, secos y húmedos del <span class=\"equipo\">equipo</span>, y ubicar el sensor de monitoreo en el punto crítico."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con los datos de los mapeos de los ensayos EST-OQ-013 y EST-OQ-014, identificar los puntos extremos de temperatura y HR<br>\n  2) Declarar el punto frío, el caliente, el seco y el húmedo con su justificación<br>\n  3) Ubicar o confirmar el sensor de monitoreo de rutina en el punto crítico y registrar su posición en el plano<br>\n  4) Verificar que el monitoreo de rutina refleja el peor caso del recinto<br>\n  a) Puntos críticos identificados y monitoreo ubicado en el peor caso<br>\n  5) Procesar los datos crudos de extremos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = identificación de puntos críticos; unidad = pasa/no pasa. Tipo de dato = atributo. n = 1 análisis del 100 % de los puntos mapeados. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = todos los extremos identificados y justificados. Atípicos: no aplica a datos de atributo; toda exclusión se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Puntos fríos, calientes, secos y húmedos identificados con datos del mapeo.<br>Sensor de control ubicado en el punto más desfavorable o justificación documentada.<br>Registro por punto, sin selección posterior a los resultados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano con puntos críticos y ubicación del monitoreo<br>\n  - Data cruda y reporte estadístico del análisis de extremos"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La ubicación del sensor de control se decide con el mapeo, no por comodidad de instalación."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-016 — Uniformidad y estabilidad dentro de límites URS",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la uniformidad y la estabilidad del <span class=\"equipo\">equipo</span> dentro de los límites de la URS, consolidando los mapeos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recopilar los resultados de uniformidad y estabilidad de los ensayos EST-OQ-013 y EST-OQ-014<br>\n  2) Comparar cada setpoint contra los límites de la URS (bandas de temperatura y HR)<br>\n  3) Consolidar la matriz de cumplimiento por setpoint<br>\n  a) El 100% de los setpoints dentro de los límites URS<br>\n  4) Procesar los datos crudos consolidados en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura y HR por sensor; unidad = °C y % HR. Tipo de dato = continua. n = 24 h por setpoint, todos los sensores. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada registro dentro de límite. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Uniformidad y estabilidad dentro de los límites del URS durante 24 h por setpoint.<br>Cada sensor dentro de límite en el 100 % de los registros.<br>Sin promediar sensores para declarar cumplimiento."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de cumplimiento por setpoint contra URS<br>\n  - Data cruda y reporte estadístico consolidado"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El URS es la fuente del límite; no se ajusta con los resultados del mapeo."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado; Termohigrómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-017 — Registrador de monitoreo frente a control y patrón",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Comparar el registrador de monitoreo del <span class=\"equipo\">equipo</span> frente al sensor de control y al patrón de referencia, con diferencia dentro del criterio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar en paralelo el sensor de control, el registrador de monitoreo y el patrón durante una corrida nominal de 24 h<br>\n  2) Calcular las diferencias punto a punto entre las tres fuentes<br>\n  3) Confirmar que el registrador refleja fielmente el control y el patrón<br>\n  a) Diferencia del registrador dentro del criterio (temperatura ±0,5 °C, HR ±3%)<br>\n  4) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = diferencia entre sensores; unidad = °C y % HR. Tipo de dato = continua. n = 3 comparaciones simultáneas. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = diferencia dentro de ±0,5 °C y ±3 % HR. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Diferencia entre registrador de monitoreo, sensor de control y patrón ≤ <span class=\"por-confirmar\">0,5 °C</span> y ≤ <span class=\"por-confirmar\">3 % HR</span>.<br>Calibración vigente de los tres.<br>Registro de la comparación en el mismo instante."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Comparativa de las tres fuentes con diferencias<br>\n  - Data cruda y reporte estadístico del análisis comparativo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Las tolerancias en rojo se confirman con los certificados; la comparación se hace simultánea."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Registrador de datos calibrado; Termómetro/termopar calibrado; Termohigrómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-018 — Intervalo de registro y marca de tiempo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el intervalo de registro y la exactitud de la marca de tiempo del <span class=\"equipo\">equipo</span>."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Configurar el intervalo de registro declarado (por ejemplo cada 5 min) y correr 24 h<br>\n  2) Descargar el registro y verificar la regularidad del intervalo en todo el periodo<br>\n  3) Comparar la marca de tiempo contra hora oficial al inicio y al fin (deriva del reloj)<br>\n  4) Confirmar que no hay huecos ni duplicados injustificados<br>\n  a) Intervalo regular según lo configurado y deriva dentro del criterio<br>\n  5) Procesar los datos crudos de intervalos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = intervalo y marca de tiempo; unidad = min. Tipo de dato = continua. n = 1 verificación por registrador. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = intervalo ≤ 15 min y desvío ≤ 1 min. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Intervalo de registro ≤ <span class=\"por-confirmar\">15 min</span> y marca de tiempo con desvío ≤ <span class=\"por-confirmar\">1 min</span>.<br>Sin huecos de registro en el período evaluado.<br>Registro exportable y trazable al usuario."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Verificación de intervalos y deriva del reloj<br>\n  - Data cruda y reporte estadístico del análisis de intervalos"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El intervalo y el desvío en rojo se confirman con la URS y el plan de monitoreo."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Registrador de datos calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-019 — Circulación de aire y zonas muertas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la circulación de aire del <span class=\"equipo\">equipo</span>: funcionamiento de ventiladores y ausencia de zonas muertas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar el funcionamiento de todos los ventiladores (encendido, giro correcto, sin ruidos anormales)<br>\n  2) Verificar con cintas o humo inocuo la circulación en esquinas, fondo y puerta<br>\n  3) Correlacionar con el mapeo: las zonas muertas de aire deben coincidir con los puntos extremos ya identificados<br>\n  4) Confirmar consignas de ventilación según el diseño<br>\n  a) Circulación efectiva sin zonas muertas no cubiertas por el mapeo<br>\n  5) Registrar el resultado con evidencia de la prueba de circulación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Ventiladores operativos y sin zonas muertas de circulación.<br>ΔT entre puntos de medición ≤ <span class=\"por-confirmar\">2 °C</span> con el equipo estable.<br>Sin cortocircuito entre impulsión y retorno."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba de circulación de aire"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La verificación es cualitativa y cuantitativa: no alcanza con que el ventilador gire."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "resumen",
    "id": "EST-OQ-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EST-OQ-RES — Tabla resumen de los ensayos del OQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del OQ de cámaras de estabilidad para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EST-OQ-001 a EST-OQ-019 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 19 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "tabla",
    "id": "EST-OQ-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EST-OQ-REF — Referencias del OQ de cámaras de estabilidad",
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
       "ICH Q1A(R2) — Estabilidad de medicamentos: condiciones 25/60, 30/65 y 40/75 con tolerancias de cámaras",
       "VIGENTE"
      ],
      [
       "6.2",
       "OMS TRS 1010 Anexo 7 — Mapeo, uniformidad y monitoreo de almacenes y cámaras",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: sensores y patrones asociados",
       "VIGENTE"
      ],
      [
       "6.4",
       "EU GMP Anexo 15 — Cualificación y validación: la OQ demuestra operación según especificaciones aprobadas",
       "VIGENTE"
      ],
      [
       "6.5",
       "21 CFR Part 11 — Registros electrónicos: intervalo, marca de tiempo e integridad de datos",
       "VIGENTE"
      ],
      [
       "6.6",
       "Manual del fabricante del recinto — Setpoints, alarmas, ventilación y límites de diseño",
       "VIGENTE"
      ],
      [
       "6.7",
       "OMS TRS 961 Anexo 9 Suplemento 8 — Mapeo térmico y monitoreo de cámaras de estabilidad",
       "VIGENTE"
      ],
      [
       "6.8",
       "USP <1079.4> — Monitoreo y mapeo de cámaras con temperatura controlada",
       "VIGENTE"
      ]
     ]
    },
    "instrumentos": "Registrador de datos calibrado"
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de ciclos, curvas de temperatura y HR, y mapeos por setpoint</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de patrones e instrumentos, y planos de sensores</td></tr>\n<tr><td>8.3</td><td>Anexo C — Matrices de interlocks y alarmas, y evidencias de notificaciones</td></tr>\n</tbody></table>"
   }
  ],
  "PQ": [
   {
    "kind": "div",
    "clase": "portada",
    "bloque": 1,
    "html": "<p><strong>PORTADA DEL PROTOCOLO PQ</strong></p>\n<p><strong>Logo:</strong><br><img class=\"ent-logo\" alt=\"Logo de la entidad\"></p>\n<p><strong>Calificación de Desempeño de <span class=\"equipo\">equipo</span>:</strong> <span class=\"ent-descripcion\">______</span></p>\n<ol>\n  <li><strong>Marca:</strong> <span class=\"ent-marca\">______</span></li>\n  <li><strong>Modelo:</strong> <span class=\"ent-modelo\">______</span></li>\n  <li><strong>Código:</strong> <span class=\"ent-codigo\">______</span></li>\n</ol>"
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
    "html": "<p><strong>RESPONSABILIDADES DEL PROTOCOLO:</strong></p>\n<p><strong>Responsabilidad del Analista de validaciones:</strong></p>\n<ol><li>Coordinar la ejecución de la Calificación de Desempeño con estabilidad y calidad, asegurando personal, <span class=\"equipo\">equipo</span>, carga, instrumentos y documentación.</li><li>Verificar que los instrumentos de medición estén identificados y con calibración vigente durante todo el PQ.</li><li>Ejecutar y/o supervisar los estudios del protocolo según los criterios aprobados.</li><li>Registrar los datos de forma completa, legible y trazable (ALCOA+).</li><li>Documentar las desviaciones y excursiones según los procedimientos internos vigentes.</li><li>Elaborar el informe de calificación con resultados, conclusiones y anexos.</li></ol>\n<p><strong>Responsabilidad del Coordinador de validaciones:</strong></p>\n<ol><li>Revisar técnicamente el protocolo antes de su ejecución.</li><li>Asignar al analista responsable y coordinar recursos.</li><li>Revisar las desviaciones y excursiones, su tratamiento y las CAPA asociadas.</li><li>Revisar el informe final y dictaminar el desempeño del equipo.</li></ol>\n<p><strong>Responsabilidad del Gerente de Área:</strong></p>\n<ol><li>Garantizar la disponibilidad del <span class=\"equipo\">equipo</span>, de la carga y de los accesos para la ejecución.</li><li>Facilitar la documentación de proceso y del fabricante.</li><li>Implementar las acciones operativas derivadas de desviaciones y CAPA.</li></ol>\n<p><strong>Responsabilidad del Gerente de gestión de calidad:</strong></p>\n<ol><li>Aprobar el protocolo y sus criterios de aceptación.</li><li>Aprobar las desviaciones y excursiones con sus evaluaciones de impacto.</li><li>Emitir el dictamen final del estado de calificación.</li></ol>"
   },
   {
    "kind": "div",
    "clase": "alcance",
    "bloque": 1,
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice.</p>"
   },
   {
    "kind": "div",
    "clase": "def-usp",
    "bloque": 1,
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Desempeño: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en las condiciones reales de uso (<span class=\"refnorma\"></span>).</p>"
   },
   {
    "kind": "div",
    "clase": "nota-datos",
    "bloque": 1,
    "html": "<p><strong>NOTA — DATOS DIGITALES</strong></p>\n<p>Si el equipo entrega datos digitales, se procesan directamente y se anexan la data cruda y el reporte estadístico como parte de la evidencia.</p>"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-001 — Mapeo de temperatura con carga máxima",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear la temperatura del <span class=\"equipo\">equipo</span> con la carga máxima en cada setpoint calificado, con sensores en esquinas, centro, cerca de puerta, humidificador y ventilación, más sensores dentro o junto a la carga."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir la carga máxima (configuración más densa) y distribuir los sensores según el plano, incluyendo dentro o junto a la carga<br>\n  2) Correr el mapeo por setpoint calificado durante el periodo definido, registrando al intervalo establecido<br>\n  3) Calcular por sensor promedio, máximo y mínimo; ΔT entre sensores y contra el control<br>\n  a) Todos los sensores dentro de los límites del URS durante todo el estudio, sin excursiones<br>\n  4) Procesar los datos crudos del mapeo con carga máxima en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura con carga máxima; unidad = °C. Tipo de dato = continua. n = todos los sensores, 24-72 h por setpoint. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada sensor dentro de ±2 °C del setpoint. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Uniformidad de temperatura con carga máxima ≤ <span class=\"por-confirmar\">±2 °C</span> en cada setpoint calificado.<br>Sensores en los puntos críticos identificados en OQ.<br>Duración de 24 a 72 h por setpoint, sin huecos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano de sensores con carga máxima<br>\n  - Curvas y tabla por sensor y setpoint<br>\n  - Data cruda y reporte estadístico del análisis del mapeo con carga máxima"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La tolerancia y la duración en rojo se confirman con la URS del estudio."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-002 — Mapeo de HR con carga (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear la HR del <span class=\"equipo\">equipo</span> en los mismos setpoints del mapeo de temperatura, donde se controle HR."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el recinto controla HR; si no, pasar al paso 5)<br>\n  2) Con los mismos sensores y plano del ensayo EST-PQ-001, registrar HR por setpoint con carga<br>\n  3) Calcular uniformidad y estabilidad de HR por setpoint<br>\n  a) HR dentro de los límites del URS durante todo el estudio<br>\n  4) Procesar los datos crudos de HR en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Sin control de HR: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = humedad relativa con carga; unidad = % HR. Tipo de dato = continua. n = mismos puntos y duración de T. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada sensor dentro de ±5 % HR. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Uniformidad de HR con carga ≤ <span class=\"por-confirmar\">±5 % HR</span> en los setpoints con control de humedad.<br>Mismos puntos y duración que el mapeo de temperatura.<br>Si no hay control de HR, No Aplica con aprobación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas y tabla de HR por sensor, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de HR"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La tolerancia en rojo se confirma con la URS; el ensayo no aplica en recintos sin control de humedad."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termohigrómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-003 — Duración del estudio por setpoint",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Definir y justificar la duración del mapeo con carga, normalmente de 24 a 72 h por setpoint con el recinto estable, extendida si la URS pide más estabilidad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Fijar la duración por setpoint con su justificación (mínimo 24 h; 72 h si la URS exige estabilidad extendida)<br>\n  2) Ejecutar el periodo completo sin interrupciones injustificadas<br>\n  3) Confirmar estabilidad sostenida durante todo el periodo (sin derivas fuera de banda)<br>\n  a) Periodo completo ejecutado con estabilidad sostenida<br>\n  4) Procesar los datos crudos de duración en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Si la URS pide más estabilidad, extender el periodo y documentar la extensión"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = duración del mapeo; unidad = h. Tipo de dato = continua. n = 1 mapeo por setpoint. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = duración justificada y sin huecos. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Duración del mapeo con carga justificada (<span class=\"por-confirmar\">24-72 h</span> por setpoint) según el tiempo que tarda la carga en estabilizarse.<br>Sin huecos de registro ni reinicios del estudio.<br>Justificación documentada antes de la corrida."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación de la duración por setpoint<br>\n  - Data cruda y reporte estadístico del análisis de duración"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La duración en rojo se confirma con el comportamiento térmico de la carga real; no se copia de otra cámara."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-004 — Mapeo con carga mínima (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear con carga mínima, pues un recinto casi vacío se comporta distinto, con ciclos más rápidos y mayor oscilación; si el recinto siempre opera lleno, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el recinto opera con cargas variables; si siempre va lleno, pasar al paso 5)<br>\n  2) Configurar la carga mínima representativa y mapear por setpoint crítico<br>\n  3) Comparar oscilación y ciclos contra la carga máxima del ensayo EST-PQ-001<br>\n  a) Dentro de límites aun con mayor oscilación, o limitación documentada<br>\n  4) Procesar los datos crudos de carga mínima en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Sin cargas variables: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura con carga mínima; unidad = °C. Tipo de dato = continua. n = todos los sensores, 24 h. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada sensor dentro de ±2 °C. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Mapeo con carga mínima dentro de ±<span class=\"por-confirmar\">2 °C</span> del setpoint.<br>Se compara con la carga máxima: el recinto casi vacío tiene ciclos más cortos.<br>Registro por sensor y condición."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Mapeo con carga mínima y comparativa, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de carga mínima"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La carga mínima es el otro extremo del peor caso; omitirla deja la calificación incompleta."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-005 — Puntos críticos del OQ con carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los puntos fríos, calientes, secos y húmedos del OQ se mantienen con carga, o si se desplazaron, y reubicar el sensor de monitoreo si cambió el punto crítico."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Comparar los puntos extremos del mapeo con carga contra los del OQ en vacío<br>\n  2) Determinar si cada punto crítico se mantiene o se desplazó, con su causa (carga, flujo, puerta)<br>\n  3) Si cambió el punto crítico, reubicar el sensor de monitoreo y registrar la nueva posición en el plano<br>\n  4) Confirmar que el monitoreo de rutina queda en el peor caso con carga<br>\n  a) Puntos confirmados o reubicación documentada con monitoreo en el peor caso<br>\n  5) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = puntos críticos con carga; unidad = pasa/no pasa. Tipo de dato = atributo. n = 1 análisis por condición de carga. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = mismos puntos críticos o reubicación justificada. Atípicos: no aplica a datos de atributo; toda exclusión se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Los puntos fríos, calientes, secos y húmedos del OQ se mantienen con carga.<br>Si cambia la ubicación del punto crítico, se justifica y se reubica el sensor de control.<br>Registro por punto con carga máxima y mínima."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Comparativa vacío contra carga con plano actualizado<br>\n  - Data cruda y reporte estadístico del análisis comparativo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Un cambio de punto crítico con carga obliga a revisar la ubicación del sensor de control."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-006 — Criterio de aceptación sin excursiones",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que todos los sensores están dentro de los límites del URS durante todo el estudio, sin excursiones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recopilar todos los registros de sensores del estudio con carga<br>\n  2) Verificar punto por punto contra los límites del URS, incluyendo picos de apertura si aplican al criterio<br>\n  3) Listar cualquier excursión con su investigación y disposición<br>\n  a) Cero excursiones fuera de URS, o excursiones investigadas y dispuestas<br>\n  4) Procesar los datos crudos de cumplimiento en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura y HR por sensor; unidad = °C y % HR. Tipo de dato = continua. n = 100 % de los registros del estudio. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada registro dentro de límite. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Todos los sensores dentro de los límites del URS durante todo el estudio.<br>El 100 % de los registros, sin promediar.<br>Excursiones tratadas según el procedimiento y evaluadas contra la estabilidad del producto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de cumplimiento por sensor y setpoint<br>\n  - Data cruda y reporte estadístico del análisis de cumplimiento<br>\n  - Investigaciones de excursión, si las hubo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Promediar sensores o períodos oculta la excursión que importa."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado; Termohigrómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-007 — Apertura de puerta con carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la apertura de puerta con carga con duración y frecuencia definidas según el uso real, con tiempo de recuperación a límites."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir duración (por ejemplo 1 a 5 min) y frecuencia de apertura según el uso real del recinto<br>\n  2) Abrir la puerta el tiempo definido con carga, cerrarla y medir el tiempo de retorno a límites<br>\n  3) Repetir 3 veces y registrar cada recuperación con el registro continuo<br>\n  4) Confirmar que el uso real queda cubierto por lo ensayado<br>\n  a) Recuperación dentro del límite en las 3 repeticiones<br>\n  5) Procesar los datos crudos de recuperación en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = recuperación tras apertura con carga; unidad = min. Tipo de dato = continua. n = 3 aperturas por setpoint. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = recuperación ≤ 30 min. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Apertura de puerta con carga: recuperación ≤ <span class=\"por-confirmar\">30 min</span>.<br>Duración y frecuencia según el uso real documentado.<br>Sin excursión &gt; límite de alarma."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de apertura y recuperación por repetición<br>\n  - Data cruda y reporte estadístico del análisis de recuperación"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La duración y frecuencia en rojo se confirman con el uso real del área, no con una apertura arbitraria."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-008 — Falla de energía con carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Medir el tiempo que el recinto mantiene condiciones sin alimentación y el tiempo de recuperación al restablecer, definiendo la duración según el escenario a cubrir."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir la duración de la prueba según el escenario (por ejemplo falla de 30 min) y coordinar el corte<br>\n  2) Cortar la energía con carga, anotar la hora y registrar la deriva de temperatura y HR<br>\n  3) Medir el tiempo que se mantienen condiciones y el tiempo de recuperación al restablecer<br>\n  4) Evaluar el impacto en la carga y definir acciones (mantener, mover o descartar según el caso)<br>\n  a) Tiempos medidos y escenario cubierto con acciones definidas<br>\n  5) Procesar los datos crudos de la falla en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = autonomía y recuperación tras corte; unidad = min. Tipo de dato = continua. n = 3 cortes controlados. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = autonomía ≥ 30 min y recuperación ≤ 60 min. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Corte de energía: el recinto mantiene condiciones ≥ <span class=\"por-confirmar\">30 min</span> y recupera en ≤ <span class=\"por-confirmar\">60 min</span>.<br>Registro continuo durante el corte.<br>Evaluación del impacto si la excursión supera el límite."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de deriva y recuperación con tiempos<br>\n  - Data cruda y reporte estadístico del análisis de falla<br>\n  - Acciones definidas ante falla real"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los tiempos en rojo se confirman con el respaldo del sitio y la estabilidad del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-009 — Respuesta de alarmas con carga",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la alarma dispara dentro del retardo definido y el sistema de notificación funciona, con carga en el recinto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con carga en el recinto, provocar o simular las alarmas críticas (desviación de temperatura, HR y puerta)<br>\n  2) Medir el tiempo entre la condición y el disparo, y entre el disparo y la notificación<br>\n  3) Confirmar acuse y registro en el histórico con hora<br>\n  a) Disparo dentro del retardo y notificación recibida<br>\n  4) Procesar los datos crudos de respuesta en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = disparo y notificación de alarma; unidad = min. Tipo de dato = continua. n = 3 repeticiones. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = disparo y aviso dentro del retardo. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>La alarma dispara dentro del retardo (<span class=\"por-confirmar\">≤ 5 min</span>) y la notificación llega.<br>Prueba con carga y personal en operación normal.<br>Registro de hora de disparo y de recepción."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con tiempos y notificación<br>\n  - Data cruda y reporte estadístico del análisis de respuesta"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El retardo en rojo se confirma con el procedimiento de monitoreo y guardias."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-010 — Falla de humidificador o compresor",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el comportamiento del recinto y el tiempo hasta alarma ante falla del humidificador o del compresor."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular la falla del humidificador (sin aporte de humedad) con carga y registrar la deriva de HR<br>\n  2) Simular la falla del compresor (sin frío) y registrar la deriva de temperatura<br>\n  3) Medir en cada caso el tiempo hasta la alarma y hasta salir de límites<br>\n  4) Definir acciones ante falla real (traslado de carga, tiempo máximo de tolerancia)<br>\n  a) Alarmas en tiempo y acciones definidas por falla<br>\n  5) Procesar los datos crudos de fallas en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = detección y recuperación ante falla; unidad = min. Tipo de dato = continua. n = 3 fallas simuladas. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = detección ≤ 30 min y recuperación ≤ 60 min. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Falla del humidificador: detección ≤ <span class=\"por-confirmar\">30 min</span> y recuperación ≤ <span class=\"por-confirmar\">60 min</span>.<br>Sin producto afectado o producto identificado.<br>Registro del evento y de la respuesta."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de deriva por falla con tiempos<br>\n  - Data cruda y reporte estadístico del análisis de fallas"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los tiempos en rojo se confirman con el plan de contingencia y la estabilidad del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-011 — Operación continua representativa",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar la operación continua del <span class=\"equipo\">equipo</span> durante un período representativo, con carga y apertura de puerta de rutina (algunas empresas lo hacen 7 días o más, justificado por riesgo)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Justificar el período por análisis de riesgo (mínimo 7 días continuos salvo justificación) y anexar la justificación<br>\n  2) Operar con carga y aperturas de rutina según el uso real, sin intervenciones extraordinarias<br>\n  3) Registrar condiciones, alarmas y aperturas durante todo el periodo<br>\n  4) Confirmar cumplimiento continuo de límites en todo el periodo<br>\n  a) Periodo completo dentro de límites con uso de rutina<br>\n  5) Procesar los datos crudos del periodo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = continuidad operativa; unidad = pasa/no pasa. Tipo de dato = atributo. n = 1 período de 7 días con registro continuo. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = período completo sin alarmas no tratadas. Atípicos: no aplica a datos de atributo; toda exclusión se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Operación continua <span class=\"por-confirmar\">7 días</span> con carga y demanda variable.<br>Sin alarmas no tratadas ni desviaciones abiertas.<br>Registro completo, sin reconstrucción."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación del periodo por riesgo<br>\n  - Registros continuos del periodo<br>\n  - Data cruda y reporte estadístico del análisis del periodo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La duración en rojo se confirma con el plan de validación; el registro se toma en el momento."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-012 — Condiciones ambientales externas (si aplica)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el desempeño con condiciones ambientales externas cuando el recinto está en un local sin climatización; el peor caso es la temperatura y humedad ambiente más altas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si el local tiene climatización; si la tiene, pasar al paso 5)<br>\n  2) Identificar la estación o condición de peor caso (ambiente más caliente y húmedo del año)<br>\n  3) Ejecutar el periodo representativo en peor caso con carga, registrando ambiente exterior e interior<br>\n  4) Confirmar cumplimiento interior pese al peor caso exterior<br>\n  a) Cámara cumple aun en peor caso exterior<br>\n  5) Con local climatizado: redactar la justificación de No Aplica con firma del ejecutor y del revisor<br>\n  6) Procesar los datos crudos comparativos en el módulo de análisis estadístico (cuando aplique) y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura y HR externas; unidad = °C y % HR. Tipo de dato = continua. n = 1 registro por día de prueba. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = condición extrema cubierta o riesgo aprobado. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Desempeño con condiciones ambientales externas extremas (<span class=\"por-confirmar\">verano/invierno</span>).<br>Si no se cubre, verificación posterior definida con riesgo aceptado.<br>Registro de la condición exterior."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros interior contra exterior, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis comparativo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La estación extrema en rojo depende del clima y de la instalación; se justifica la cobertura."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado; Termohigrómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-013 — Control contra monitoreo contra mapeo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Comparar el sensor de control, el de monitoreo y los de mapeo durante la corrida: la diferencia debe estar dentro del criterio."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar en paralelo control, monitoreo y mapeo durante una corrida nominal con carga<br>\n  2) Calcular las diferencias punto a punto entre las tres fuentes<br>\n  3) Confirmar que las tres cuentan la misma historia del proceso<br>\n  a) Diferencias dentro del criterio (temperatura ±0,5 °C, HR ±3%)<br>\n  4) Procesar los datos crudos comparativos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = diferencia entre sensores; unidad = °C. Tipo de dato = continua. n = 3 comparaciones por setpoint. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = diferencia ≤ 0,5 °C. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Diferencia entre sensor de control, monitoreo y mapeo ≤ <span class=\"por-confirmar\">0,5 °C</span>.<br>Comparación simultánea durante la corrida.<br>Registro de la diferencia por setpoint."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Comparativa de las tres fuentes con diferencias<br>\n  - Data cruda y reporte estadístico del análisis comparativo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Una diferencia mayor indica un sensor fuera de calibración o mal ubicado: se investiga, no se promedia."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-014 — Continuidad del registro y marca de tiempo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la continuidad del registro durante todo el estudio, sin huecos de datos, y la marca de tiempo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Descargar el registro completo del estudio y verificar la regularidad del intervalo en todo el periodo<br>\n  2) Comparar la marca de tiempo contra hora oficial al inicio y al fin<br>\n  3) Confirmar que no hay huecos ni duplicados injustificados<br>\n  a) Registro continuo con marca exacta<br>\n  4) Anexar la verificación de continuidad del estudio completo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Continuidad del registro durante todo el estudio, sin huecos.<br>Intervalo ≤ <span class=\"por-confirmar\">15 min</span> y marca de tiempo verificada.<br>Registro exportable, íntegro y trazable."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Verificación de continuidad y marca de tiempo del estudio"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Un hueco de registro es una desviación, no un dato faltante a completar."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Registrador de datos calibrado"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-015 — Alarmas del monitoreo independiente",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Probar las alarmas del sistema de monitoreo independiente: límites, retardos y destinatarios."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Listar las alarmas del monitoreo independiente con límites, retardos y destinatarios configurados<br>\n  2) Provocar o simular cada una y confirmar disparo, retardo y destinatario correcto<br>\n  3) Confirmar acuse y registro con hora en el histórico independiente<br>\n  a) Todas las alarmas disparan a su destinatario con su retardo<br>\n  4) Anexar la matriz de alarmas del monitoreo con evidencias"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Alarmas del sistema de monitoreo independiente: límites, retardos y destinatarios probados.<br>Disparo y aviso dentro del retardo (<span class=\"por-confirmar\">≤ 5 min</span>).<br>Registro por alarma y canal."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas del monitoreo con evidencias"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El monitoreo independiente debe probarse aparte del control; si comparten sensor, no es independiente."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-016 — Respaldo de datos y revisión de registros",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el respaldo de datos y la revisión de los registros del estudio completo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar el respaldo de los datos del estudio según el procedimiento y confirmar su restauración de prueba<br>\n  2) Revisar los registros completos: condiciones, alarmas, aperturas y firmas por etapa<br>\n  3) Confirmar revisión por el área ejecutora y por calidad con firmas y fechas<br>\n  4) Verificar la trazabilidad entre sensores, registros y el informe<br>\n  a) Respaldo funcional y registros revisados y cerrados<br>\n  5) Anexar la lista de verificación de registros diligenciada"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Respaldo de datos y revisión de los registros del estudio completo.<br>Restauración probada y verificada contra el original.<br>El 100 % de los registros revisados y firmados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Prueba de respaldo y restauración<br>\n  - Lista de verificación de registros diligenciada"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El respaldo se prueba restaurando, no declarando que existe."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-017 — Procedimiento de excursión",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el procedimiento de excursión: cómo se detecta, se registra, se evalúa su impacto en las muestras y se documenta."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular o tomar una excursión real registrada: detección por monitoreo y alarma<br>\n  2) Registrarla en el formato de excursiones con hora, duración, magnitud y sensores afectados<br>\n  3) Evaluar el impacto en las muestras almacenadas según estabilidad del producto<br>\n  4) Documentar la disposición (mantener, mover o descartar) con firmas<br>\n  a) Excursión detectada, evaluada y dispuesta según procedimiento<br>\n  5) Procesar los datos crudos de la excursión en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = respuesta a excursión simulada; unidad = pasa/no pasa. Tipo de dato = atributo. n = 1 simulacro por turno. Estadísticos = proporción de cumplimiento con IC binomial exacto. Regla de decisión = respuesta completa y documentada. Atípicos: no aplica a datos de atributo; toda exclusión se documenta y se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Procedimiento de excursión: detección, registro, evaluación de impacto en el producto y acción.<br>Simulacro con producto y personal reales.<br>Cierre con aprobación de Calidad."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de excursión diligenciado con evaluación y disposición<br>\n  - Data cruda y reporte estadístico del análisis de la excursión"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El simulacro se registra como simulacro; no se hace pasar por una excursión real."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-018 — Tiempo máximo de excursión aceptable",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Definir el tiempo máximo de excursión aceptable desde la estabilidad del producto y no desde el valor de fábrica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Recopilar datos de estabilidad del producto que soportan exposiciones breves fuera de rango<br>\n  2) Definir el tiempo máximo aceptable por tipo de excursión (temperatura y HR) con su justificación técnica<br>\n  3) Aprobar el límite con calidad y registrarlo en el procedimiento de excursiones<br>\n  4) Aplicar el límite a las excursiones del estudio y confirmar su uso<br>\n  a) Límite definido, justificado y aplicado<br>\n  5) Procesar los datos crudos de soporte en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tiempo máximo de excursión; unidad = h. Tipo de dato = continua. n = 1 definición por producto. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = justificado y aprobado antes de la corrida. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Tiempo máximo de excursión aceptable definido desde la estabilidad del producto (<span class=\"por-confirmar\">valor del estudio</span>).<br>Aprobado antes de la corrida, no después de ver el evento.<br>Trazable al estudio de estabilidad del producto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Justificación del tiempo máximo con datos de estabilidad<br>\n  - Data cruda y reporte estadístico del análisis de soporte"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Este criterio no se puede inventar en el PQ: sale del estudio de estabilidad del producto y de su MKT."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-PQ-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-PQ-019 — Cambio de setpoint en uso múltiple",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar el cambio de setpoint en uso múltiple: tiempo de transición y estabilidad antes de cargar muestras nuevas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con el recinto estable en un setpoint, cambiar al siguiente setpoint de uso<br>\n  2) Medir el tiempo de transición hasta entrar en banda y estabilizar<br>\n  3) Confirmar estabilidad sostenida antes de autorizar la carga de muestras nuevas<br>\n  4) Registrar el tiempo de transición aprobado por cambio en la matriz de uso múltiple<br>\n  a) Transición medida y estabilidad confirmada antes de cada carga<br>\n  5) Procesar los datos crudos de transiciones en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = transición entre setpoints; unidad = h. Tipo de dato = continua. n = 3 cambios. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = transición ≤ 4 h y estable antes de cargar. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se documenta y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cambio de setpoint en uso múltiple: transición ≤ <span class=\"por-confirmar\">4 h</span> y estabilidad antes de cargar.<br>Sin cargar producto hasta que el recinto esté estable.<br>Registro de la transición y de la estabilidad."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de transiciones con tiempos y estabilidades<br>\n  - Data cruda y reporte estadístico del análisis de transiciones"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo en rojo se confirma con el procedimiento de cambio de setpoint del sitio."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2); ICH Q1B (fotoestabilidad, si aplica); OMS TRS 1010 Anexo 7; USP &lt;1079&gt;; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "resumen",
    "id": "EST-PQ-RES",
    "bloque": 4,
    "cond": "ambas",
    "titulo": "EST-PQ-RES — Tabla resumen de los ensayos del PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Consolidar el listado de ensayos del PQ de cámaras de estabilidad para la tabla resumen del protocolo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar que los ensayos EST-PQ-001 a EST-PQ-019 están incluidos en el índice del protocolo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Los 19 ensayos aparecen en la tabla resumen con su veredicto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "tabla",
    "id": "EST-PQ-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "EST-PQ-REF — Referencias del PQ de cámaras de estabilidad",
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
       "ICH Q1A(R2) — Estabilidad: condiciones 25/60, 30/65 y 40/75; tolerancias y excursiones",
       "VIGENTE"
      ],
      [
       "6.2",
       "OMS TRS 1010 Anexo 7 — Mapeo, uniformidad y monitoreo de cámaras",
       "VIGENTE"
      ],
      [
       "6.3",
       "EU GMP Anexo 15 — Cualificación y validación: sensores y patrones asociados",
       "VIGENTE"
      ],
      [
       "6.4",
       "EU GMP Anexo 15 — PQ tras IQ/OQ; repetibilidad y peor caso justificados",
       "VIGENTE"
      ],
      [
       "6.5",
       "21 CFR Part 11 / 21 CFR 211.180 — Registros electrónicos, respaldo y registros de lote",
       "VIGENTE"
      ],
      [
       "6.6",
       "Manual del fabricante del recinto — Rangos, alarmas y límites de diseño",
       "VIGENTE"
      ],
      [
       "6.7",
       "OMS TRS 961 Anexo 9 Suplemento 8 — Mapeo térmico y monitoreo de cámaras de estabilidad",
       "VIGENTE"
      ],
      [
       "6.8",
       "USP <1079.4> — Monitoreo y mapeo de cámaras con temperatura controlada",
       "VIGENTE"
      ]
     ]
    }
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de mapeos, curvas de temperatura y HR por setpoint</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de patrones e instrumentos, y planos de sensores</td></tr>\n<tr><td>8.3</td><td>Anexo C — Registros de excursiones, alarmas y respaldos con verificaciones</td></tr>\n</tbody></table>"
   }
  ]
 }
};
if (typeof module !== "undefined" && module.exports) module.exports = BancoEstabilidad;
