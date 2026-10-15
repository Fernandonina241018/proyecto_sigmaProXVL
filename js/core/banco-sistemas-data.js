// Generado por scripts/extraer-banco.mjs sistemas — NO EDITAR A MANO.
// Fuente: docs/banco-ensayos/sistemas/oq-agua-purificada.html + docs/banco-ensayos/sistemas/pq-agua-purificada.html (versión: SIS-OQ-AP 2026-10-14 v1 + SIS-PQ-AP 2026-10-14 v1).
var BancoSistemas = {
 "version": "SIS-OQ-AP 2026-10-14 v1 + SIS-PQ-AP 2026-10-14 v1",
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
      "html": "<strong>Objetivo:</strong><br>Medir la longitud de cada ramal en relación con su diámetro (regla de 3D) y revisar válvulas de diafragma y de punto de uso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>\n  1) Medir cada ramal y su diámetro y aplicar la regla de 3D<br>\n  2) Revisar válvulas de diafragma y de punto de uso<br>\n  3) Procesar los datos crudos en el módulo de análisis estadístico y anexar la data cruda y el reporte generado como evidencia de este ensayo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = la magnitud medida en este ensayo según el procedimiento; tamaño de muestra = las réplicas y puntos definidos en el procedimiento (mínimo por triplicado); estadísticos = media, desviación estándar y RSD, con intervalo de confianza al 95 % cuando aplique; comparaciones entre lotes, puntos o velocidades con ANOVA cuando aplique; tendencia = regresión de la variable contra tiempo o secuencia, sin pendiente estadísticamente significativa; valores atípicos = prueba de Grubbs con investigación y justificación documentada, sin exclusión silenciosa; criterio = el especificado en el criterio de aceptación de este ensayo."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>\n  Ramales dentro de la regla de 3D o justificados.<br>\n  Válvulas sanitarias y operativas."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>\n  - Registro con data cruda y reporte<br>\n  - Data cruda y reporte estadístico del análisis de ramales"
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
      "html": "<strong>Referencia:</strong><br>USP 645 (conductividad); USP 643 (TOC); más la especificación adoptada."
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
      "html": "<strong>Referencia:</strong><br>URS aprobada (rangos y criterios)."
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
   }
  ]
 }
};
if (typeof module !== "undefined" && module.exports) module.exports = BancoSistemas;
