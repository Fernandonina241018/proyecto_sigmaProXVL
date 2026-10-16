// Generado por scripts/extraer-banco.mjs sistemas — NO EDITAR A MANO.
// Fuente: docs/banco-ensayos/sistemas/oq-agua-purificada.html + docs/banco-ensayos/sistemas/pq-agua-purificada.html + docs/banco-ensayos/sistemas/oq-hvac.html + docs/banco-ensayos/sistemas/pq-hvac.html + docs/banco-ensayos/sistemas/oq-vapor-limpio.html + docs/banco-ensayos/sistemas/pq-vapor-limpio.html + docs/banco-ensayos/sistemas/oq-aire-comprimido.html + docs/banco-ensayos/sistemas/pq-aire-comprimido.html (versión: SIS-OQ-AP 2026-10-14 v1 + SIS-PQ-AP 2026-10-14 v1 + SIS-OQ-HV 2026-10-14 v1 + SIS-PQ-HV 2026-10-14 v1 + SIS-OQ-VL 2026-10-14 v1 + SIS-PQ-VL 2026-10-14 v1 + SIS-OQ-AC 2026-10-15 v1 + SIS-PQ-AC 2026-10-15 v1).
var BancoSistemas = {
 "version": "SIS-OQ-AP 2026-10-14 v1 + SIS-PQ-AP 2026-10-14 v1 + SIS-OQ-HV 2026-10-14 v1 + SIS-PQ-HV 2026-10-14 v1 + SIS-OQ-VL 2026-10-14 v1 + SIS-PQ-VL 2026-10-14 v1 + SIS-OQ-AC 2026-10-15 v1 + SIS-PQ-AC 2026-10-15 v1",
 "fases": {
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
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo OQ, y cubre los ensayos listados en el índice.</p>",
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Identificar las paradas de emergencia del sistema<br>\n  2) Accionar la parada y verificar el estado seguro del sistema"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  La parada lleva el sistema a estado seguro.<br>\n  Se exige rearme manual según lo definido."
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
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cada alarma dispara.<br>\n  El agua fuera de especificación se desvía a drenaje."
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
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Estado seguro ante la falla.<br>\n  Recirculación al reiniciar sin estancamiento prolongado."
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Simular la falla de la bomba principal (si aplica)<br>\n  2) Verificar el cambio automático a la bomba de respaldo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  El cambio automático opera (si aplica)."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Caudal y caída de presión dentro de lo definido en el protocolo aprobado.<br>\n  Retrolavado con secuencia y tiempos definidos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del filtro multimedia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dureza a la salida dentro de lo definido en el protocolo aprobado.<br>\n  Ciclos y consumo según lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del ablandador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cloro residual a la salida dentro de lo definido en el protocolo aprobado.<br>\n  Caudal y retrolavado según lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del carbón activado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud dentro de lo definido en el protocolo aprobado.<br>\n  Alarma de nivel operativa (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de dosificación"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Caída de presión dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cartuchos"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Relación de recuperación dentro del criterio definido."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Presiones dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de presiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Rechazo de sales dentro de lo definido en el protocolo aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del permeado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Conductividad resultante dentro de lo definido en el protocolo aprobado (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del segundo paso"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Parámetros dentro de lo definido en el protocolo aprobado.<br>\n  Enjuague completo verificado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de sanitización"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Alarmas de nivel alto y bajo operativas.<br>\n  Reposición automática según lo definido."
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar la prueba de integridad del filtro de venteo<br>\n  2) Registrar el resultado"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Integridad confirmada según el criterio del fabricante."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de integridad (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura completa y caudal dentro de lo definido en el protocolo aprobado (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de aspersión"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Temperatura controlada y estable según lo definido (si aplica)."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Caudal, presión y velocidad en rango operativo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de la bomba"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el caudal en el retorno<br>\n  2) Abrir todos los puntos de uso y verificar que la velocidad no baja del mínimo (práctica habitual: al menos 1 m/s con régimen turbulento)<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Velocidad igual o mayor al mínimo del URS con todos los puntos abiertos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de velocidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Presión positiva en toda la red incluido el retorno."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de presión"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Intensidad dentro de lo definido en el protocolo aprobado.<br>\n  Alarma operativa; sensor calibrado si es de 254 nm."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis UV"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Destrucción previa efectiva y ausencia en el agua usada (si se usa)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de ozono"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Control efectivo y barrera íntegra (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis del intercambiador"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Drenaje completo sin agua retenida."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de drenabilidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ramales dentro de la regla de 3D o del criterio adoptado.<br>\n  Válvulas sanitarias y operativas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de ramales"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema; ISPE Baseline Guide Vol. 4 (ramales y distribución)."
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Ejecutar la sanitización térmica con agua caliente (típicamente 80 °C) o vapor limpio, o con ozono o peróxido, según aplique<br>\n  2) Verificar temperatura o concentración y tiempo en todos los puntos incluidos uso y retorno"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Todos los puntos alcanzan lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la sanitización (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir conductividad o prueba específica del sanitizante tras el enjuague"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ausencia de residuos según el criterio definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro del enjuague (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Exactitud dentro de lo definido en el protocolo aprobado.<br>\n  Alarmas operativas."
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar sensores y registro de temperatura (si aplica)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Registro exacto según lo definido (si aplica)."
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
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Puntos identificados, accesibles y sanitarios."
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
      "html": "<strong>Procedimiento:</strong><br>\n  1) Operar el sistema completo durante 72 h (o el período definido en el protocolo aprobado)<br>\n  2) Verificar conductividad dentro de los límites, sin alarmas ni desviaciones"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Agua dentro de los límites durante todo el período.<br>\n  Sin alarmas ni desviaciones no tratadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de la operación (anexo del informe)"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
    "html": "<p><strong>ALCANCE</strong></p>\n<p>Esta calificación aplica a <span class=\"equipo\">equipo</span>, según protocolo PQ, y cubre los ensayos listados en el índice.</p>",
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
      "html": "<strong>Objetivo:</strong><br>Desarrollar el sistema con muestreo diario de todos los puntos para conductividad, TOC y microbiología."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear a diario todos los puntos del loops y de uso: conductividad, TOC y microbiología<br>\n  2) Muestrear el pretratamiento con frecuencia menor pero regular<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura diaria completa durante la Fase 1 (de 2 a 4 semanas)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros diarios con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de Fase 1"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
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
      "html": "<strong>Objetivo:</strong><br>Mantener el agua sin liberar para producto, o con estricta restricción, durante la Fase 1."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aplicar la restricción de uso definida<br>\n  2) Registrar las liberaciones restringidas si las hay<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin liberación para producto, o restricción documentada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de restricción con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de restricción"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Objetivo:</strong><br>Confirmar caudales, temperaturas, sanitizaciones y SOPs con los datos de la Fase 1."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Confirmar caudales y temperaturas contra lo definido<br>\n  2) Confirmar sanitizaciones ejecutadas y SOPs aplicables<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
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
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro de confirmación con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de parámetros"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Objetivo:</strong><br>Definir los puntos críticos y las frecuencias de sanitización con base en los datos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Analizar los datos de la Fase 1<br>\n  2) Definir puntos críticos y frecuencias de sanitización<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Puntos y frecuencias definidos con base en datos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Documento de definición con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de criticidad"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Objetivo:</strong><br>Demostrar control con monitoreo continuo a frecuencia reducida, con todos los puntos incluidos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Monitorear con frecuencia reducida respecto a la Fase 1, con todos los puntos incluidos<br>\n  2) Usar el agua para producto de forma controlada si la Fase 1 fue satisfactoria<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura total durante la Fase 2 (de 2 a 4 semanas)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de Fase 2"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
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
      "html": "<strong>Objetivo:</strong><br>Verificar que no hay excursiones de límite de acción, o que cada una está investigada y cerrada."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar los límites de acción en toda la Fase 2<br>\n  2) Investigar y cerrar cada excursión<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin excursiones abiertas al cierre de la Fase 2."
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
      "html": "<strong>Objetivo:</strong><br>Verificar la carga microbiana antes y después de la sanitización."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir la carga microbiana antes de sanitizar<br>\n  2) Medir después y comparar<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Reducción conforme a lo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de eficacia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Objetivo:</strong><br>Verificar conductividad, TOC y microbiología sin deriva."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Graficar la tendencia de conductividad, TOC y microbiología<br>\n  2) Verificar ausencia de deriva<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Sin deriva en los tres parámetros."
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
      "html": "<strong>Objetivo:</strong><br>Confirmar a largo plazo con la frecuencia definida, rotando los puntos de uso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Muestrear con la frecuencia definida (por ejemplo semanal en cada punto, rotando los puntos de uso)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cobertura de todos los puntos durante el ciclo."
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
      "html": "<strong>Objetivo:</strong><br>Cubrir los cambios en la calidad del agua de alimentación durante las cuatro estaciones."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar temperatura, cloro, carga orgánica y microorganismos del agua de alimentación por estación<br>\n  2) Verificar el desempeño del sistema en cada estación<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Desempeño dentro de los límites en las cuatro estaciones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis estacional"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Objetivo:</strong><br>Revisar tendencias y excursiones, y ajustar los límites de alerta y acción con los datos acumulados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Revisar tendencias y excursiones acumuladas<br>\n  2) Ajustar los límites de alerta y acción con los datos<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
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
      "html": "<strong>Objetivo:</strong><br>Confirmar la frecuencia de sanitización y de mantenimiento dentro de los intervalos definidos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar cambio de membranas, de lámparas UV y de filtros dentro de los intervalos<br>\n  2) Confirmar la frecuencia de sanitización<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Mantenimientos dentro de los intervalos definidos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de mantenimiento"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Objetivo:</strong><br>Verificar conductividad y TOC en todas las fases contra la especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir conductividad (USP 645 tres etapas, o la monografía que apliques)<br>\n  2) Medir TOC (referencia USP 643: 500 ppb en PW; verifica tu farmacopea y tu especificación)<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de la especificación adoptada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de conductividad y TOC"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP 645 (conductividad); USP 643 (TOC); más la especificación adoptada; USP 1231 (validación del sistema y niveles de alerta y acción)."
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
      "html": "<strong>Objetivo:</strong><br>Verificar el límite de acción según farmacopea y especificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el recuento microbiano total (referencia habitual: 100 UFC por mL para PW en USP 1231, 10 UFC por 100 mL para WFI; verifica el criterio que adoptes)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
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
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis microbiano"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP 1231 (criterios microbiológicos); más la especificación adoptada."
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
      "html": "<strong>Objetivo:</strong><br>Verificar endotoxinas (solo WFI, si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir endotoxinas (referencia: 0,25 UE por mL para WFI)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro del límite adoptado (solo WFI, si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de endotoxinas"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios); USP 1231 (endotoxinas en WFI)."
     }
    ],
    "tabla": null,
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
      "html": "<strong>Objetivo:</strong><br>Verificar si la monografía lo exige."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir nitratos, metales pesados y oxidantes si la monografía lo exige<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de la especificación si aplica."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis fisicoquímico"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
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
      "html": "<strong>Objetivo:</strong><br>Verificar la ausencia de patógenos específicos según el uso del agua."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Investigar patógenos específicos según el uso del agua<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ausencia según el uso del agua."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de objetables"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
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
      "html": "<strong>Objetivo:</strong><br>Verificar el cloro residual para proteger la RO (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir el cloro residual en el pretratamiento (si aplica)<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Dentro de lo definido (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de cloro"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
    "titulo": "SIS-PQ-AP-019 — Velocidad y presión en el loops",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar velocidad y presión en el loops en todo el período, con alarmas registradas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Registrar velocidad y presión en todo el período<br>\n  2) Registrar las alarmas ocurridas<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Registro continuo con alarmas documentadas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis hidráulico"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Objetivo:</strong><br>Verificar temperatura o concentración en todos los puntos, y resultados microbiológicos posteriores."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Verificar cumplimiento de temperatura o concentración en todos los puntos<br>\n  2) Verificar resultados microbiológicos posteriores<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Cumplimiento en todos los puntos con micro posterior conforme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de eficacia"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Objetivo:</strong><br>Verificar aislamiento del punto o sistema, investigación, acción correctiva y repetición del muestreo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Aislar el punto o sistema ante la excursión<br>\n  2) Investigar, aplicar acción correctiva y repetir el muestreo<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Excursión cerrada con correctiva y remuestreo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de excursiones"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Objetivo:</strong><br>Verificar el comportamiento tras un paro prolongado, con muestreo tras la reposición y criterio de vuelta a servicio (si aplica)."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tras un paro prolongado (fin de semana, mantenimiento), muestrear tras la reposición (si aplica)<br>\n  2) Aplicar el criterio de vuelta a servicio<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Vuelta a servicio solo con criterio cumplido (si aplica)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registros con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de paros"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Manual del fabricante del sistema."
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
      "html": "<strong>Objetivo:</strong><br>Verificar el efecto sobre la calidad del agua tras cada evento."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Tras cada retrolavado, regeneración o cambio de consumibles, medir el efecto en la calidad del agua<br>\n  2) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Calidad dentro de los límites tras cada evento."
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
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
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
      "html": "<strong>Objetivo:</strong><br>Verificar CO, CO2, SO2 y NOx."
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
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
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
