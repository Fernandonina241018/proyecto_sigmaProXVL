// Generado por scripts/extraer-banco.mjs estabilidad — NO EDITAR A MANO.
// Fuente: docs/banco-ensayos/estabilidad/oq-camaras.html (versión: EST-OQ-CAM 2026-10-06 v1).
var BancoEstabilidad = {
 "version": "EST-OQ-CAM 2026-10-06 v1",
 "fases": {
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
    "html": "<p><strong>DEFINICIÓN USP</strong></p>\n<p>Calificación de Operación: colección documentada de las actividades necesarias para demostrar que un instrumento se desempeña de manera uniforme de acuerdo con las especificaciones definidas por el usuario y es apropiado para el uso previsto, en el entorno seleccionado (USP &lt;1058&gt;).</p>"
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
      "html": "<strong>Objetivo:</strong><br>Verificar que la parada de emergencia del <span class=\"equipo\">equipo</span> detiene los sistemas activos y deja la cámara en estado seguro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar IQ aprobada y <span class=\"equipo\">equipo</span> liberado para OQ, en condición nominal de operación<br>\n  2) Accionar la parada de emergencia y medir con cronómetro el tiempo hasta la detención de ventilación, humidificación y calefacción<br>\n  3) Confirmar el estado seguro y el mensaje en el controlador o HMI<br>\n  a) Detención total dentro del límite del fabricante<br>\n  4) Sin rearmar, intentar arrancar y confirmar que queda impedido<br>\n  5) Rearmar según el fabricante, confirmar condición segura sin arranque solo y dejar el <span class=\"equipo\">equipo</span> en condición segura"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Detención en el tiempo previsto; estado seguro; sin arranque sin rearme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba con tiempo de detención medido"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; GAMP5 2.ª ed."
     }
    ],
    "tabla": null
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
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-003 — Interlocks de la cámara",
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
    "tabla": null
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
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El 100% de las alarmas dispara en su límite con su retardo y queda registrada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de alarmas con límite, retardo, acción y acuse"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>EU GMP Anexo 15; GAMP5 2.ª ed."
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
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Notificación remota funcional e identificada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Evidencia de recepción de la notificación de prueba"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Procedimiento de monitoreo; EU GMP Anexo 15."
     }
    ],
    "tabla": null
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
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Retorno a condiciones en el tiempo previsto con registro continuo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del evento con tiempo de retorno<br>\n  - Verificación de continuidad del registro independiente"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>GAMP5 2.ª ed.; 21 CFR Part 11."
     }
    ],
    "tabla": null
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Disponer del patrón de referencia calibrado (temperatura y HR) y de la tabla de setpoints aprobada de la cámara<br>\n  2) Estabilizar la cámara en cada setpoint de la tabla y comparar control contra patrón<br>\n  3) Registrar por setpoint ambas lecturas y la diferencia<br>\n  a) Diferencia de temperatura menor o igual a ±0,5 °C y de HR menor o igual a ±3% HR<br>\n  4) Repetir en todos los setpoints de la tabla<br>\n  5) Procesar los datos crudos de exactitud en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud conforme en todos los setpoints de la tabla."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Tabla de setpoints con control contra patrón por punto<br>\n  - Data cruda y reporte estadístico del análisis de exactitud<br>\n  - Certificado del patrón de referencia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; ICH Q1A(R2) (tolerancias)."
     }
    ],
    "tabla": null,
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
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estabilidad y exactitud conformes en los tres setpoints."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de estabilidad por setpoint con estadística<br>\n  - Data cruda y reporte estadístico del análisis de estabilidad de temperatura"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; ICH Q1A(R2)."
     }
    ],
    "tabla": null,
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
      "html": "<strong>Objetivo:</strong><br>Verificar la estabilidad y la exactitud del control de HR del <span class=\"equipo\">equipo</span> en cada setpoint con HR; si la cámara no controla HR, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si la cámara controla HR; si no, pasar al paso 5)<br>\n  2) Fijar cada setpoint con HR de la tabla, estabilizar y registrar cada 5 minutos durante 30 minutos<br>\n  3) Comparar contra el patrón de referencia en cada setpoint<br>\n  a) Estabilidad dentro de ±3% HR y exactitud dentro de ±3% HR contra el patrón<br>\n  4) Procesar los datos crudos de HR en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Sin control de HR: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  HR conforme en todos los setpoints, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de HR por setpoint, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de HR"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1058&gt;; ICH Q1A(R2)."
     }
    ],
    "tabla": null,
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Partir de la cámara a temperatura ambiente registrada, fijar el setpoint de trabajo<br>\n  2) Registrar temperatura (y HR si aplica) cada 5 minutos hasta estabilización<br>\n  3) Medir el tiempo hasta entrar en banda y el sobreimpulso máximo sobre el setpoint<br>\n  4) Repetir en un segundo setpoint representativo<br>\n  a) Tiempo de llegada dentro de lo previsto y sobreimpulso menor o igual a [2] °C<br>\n  5) Procesar los datos crudos de llegada en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Llegada a condiciones en el tiempo previsto con sobreimpulso controlado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas de llegada a condiciones por setpoint<br>\n  - Data cruda y reporte estadístico del análisis de llegada"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
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
      "html": "<strong>Objetivo:</strong><br>Verificar las combinaciones extremas de temperatura y HR que la cámara puede o no mantener, según su rango declarado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Definir las combinaciones extremas a ensayar (alta T con alta HR, alta T con baja HR, baja T con alta HR) según el rango declarado<br>\n  2) Fijar cada combinación, estabilizar y registrar durante 30 minutos<br>\n  3) Confirmar mantenimiento o documentar la limitación con su justificación técnica<br>\n  a) Cada combinación se mantiene o queda documentada como limitación del equipo<br>\n  4) Procesar los datos crudos de extremos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Rango verificado: combinaciones mantenidas o limitaciones documentadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros por combinación extrema<br>\n  - Data cruda y reporte estadístico del análisis de extremos<br>\n  - Matriz de capacidades y limitaciones del equipo"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS del equipo; EU GMP Anexo 15."
     }
    ],
    "tabla": null,
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Estabilizar la cámara en su setpoint de trabajo y definir la duración de apertura según el uso real (por ejemplo 1 a 5 min)<br>\n  2) Abrir la puerta el tiempo definido, cerrarla y medir el tiempo de retorno a banda<br>\n  3) Repetir 3 veces y registrar cada recuperación<br>\n  4) Confirmar que las aperturas breves de uso real quedan cubiertas<br>\n  a) Recuperación dentro del límite (picos breves aceptados como inevitables según ICH Q1A)<br>\n  5) Procesar los datos crudos de recuperación en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Recuperación en el tiempo previsto en las 3 repeticiones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros de recuperación por repetición<br>\n  - Data cruda y reporte estadístico del análisis de recuperación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2) (picos por apertura); EU GMP Anexo 15."
     }
    ],
    "tabla": null,
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "EST-OQ-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "EST-OQ-013 — Mapeo de temperatura en cámara vacía",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Mapear la temperatura del <span class=\"equipo\">equipo</span> en cada setpoint crítico, con sensores distribuidos en esquinas, centro, cerca de puerta, humidificador y ventilación; el número de sensores se justifica por volumen (gabinete contra walk-in) y la duración mínima suele ser 24 h por setpoint."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Justificar el número de sensores por el volumen de la cámara y distribuirlos según el plano (esquinas, centro, puerta, humidificador, ventilación)<br>\n  2) Correr el mapeo en vacío por setpoint crítico durante 24 h como mínimo, registrando al intervalo definido<br>\n  3) Calcular por sensor promedio, máximo y mínimo; ΔT entre sensores; y estabilidad<br>\n  a) Uniformidad dentro de la tolerancia de la cámara en todos los setpoints<br>\n  4) Procesar los datos crudos del mapeo en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
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
      "html": "<strong>Referencia:</strong><br>OMS TRS 1010 Anexo 7; ICH Q1A(R2)."
     }
    ],
    "tabla": null,
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
      "html": "<strong>Objetivo:</strong><br>Mapear la HR del <span class=\"equipo\">equipo</span> en los mismos setpoints del mapeo de temperatura; si la cámara no controla HR, declarar No Aplica."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar si la cámara controla HR; si no, pasar al paso 5)<br>\n  2) Con los mismos sensores y plano del ensayo EST-OQ-013, registrar HR por setpoint durante el mapeo<br>\n  3) Calcular uniformidad y estabilidad de HR por setpoint<br>\n  a) Uniformidad de HR dentro de la tolerancia de la cámara<br>\n  4) Procesar los datos crudos de HR en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo<br>\n  5) Sin control de HR: redactar la justificación de No Aplica con firma del ejecutor y del revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Mapeo de HR conforme, o No Aplica justificado y firmado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Curvas y tabla de HR por sensor, o justificación de No Aplica firmada<br>\n  - Data cruda y reporte estadístico del análisis de HR"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>OMS TRS 1010 Anexo 7; ICH Q1A(R2)."
     }
    ],
    "tabla": null,
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Con los datos de los mapeos de los ensayos EST-OQ-013 y EST-OQ-014, identificar los puntos extremos de temperatura y HR<br>\n  2) Declarar el punto frío, el caliente, el seco y el húmedo con su justificación<br>\n  3) Ubicar o confirmar el sensor de monitoreo de rutina en el punto crítico y registrar su posición en el plano<br>\n  4) Verificar que el monitoreo de rutina refleja el peor caso de la cámara<br>\n  a) Puntos críticos identificados y monitoreo ubicado en el peor caso<br>\n  5) Procesar los datos crudos de extremos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Puntos críticos identificados con monitoreo en el peor caso."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Plano con puntos críticos y ubicación del monitoreo<br>\n  - Data cruda y reporte estadístico del análisis de extremos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>OMS TRS 1010 Anexo 7; ICH Q1A(R2) (monitoreo)."
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
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Uniformidad y estabilidad dentro de URS en todos los setpoints."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Matriz de cumplimiento por setpoint contra URS<br>\n  - Data cruda y reporte estadístico consolidado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS del equipo; ICH Q1A(R2)."
     }
    ],
    "tabla": null,
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
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Intervalo regular y marca de tiempo exacta."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Verificación de intervalos y deriva del reloj<br>\n  - Data cruda y reporte estadístico del análisis de intervalos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR Part 11 (registros); EU GMP Anexo 15."
     }
    ],
    "tabla": null,
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
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ventilación funcional sin zonas muertas fuera del mapeo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la prueba de circulación de aire"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante; OMS TRS 1010 Anexo 7."
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
       "USP <1058> — Analytical Instrument Qualification: sensores y patrones asociados",
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
       "Manual del fabricante de la cámara — Setpoints, alarmas, ventilación y límites de diseño",
       "VIGENTE"
      ]
     ]
    }
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de ciclos, curvas de temperatura y HR, y mapeos por setpoint</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de patrones e instrumentos, y planos de sensores</td></tr>\n<tr><td>8.3</td><td>Anexo C — Matrices de interlocks y alarmas, y evidencias de notificaciones</td></tr>\n</tbody></table>"
   }
  ]
 }
};
if (typeof module !== "undefined" && module.exports) module.exports = BancoEstabilidad;
