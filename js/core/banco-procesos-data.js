// Generado por scripts/extraer-banco.mjs procesos — NO EDITAR A MANO.
// Fuente: docs/banco-ensayos/procesos/pq-comun.html + docs/banco-ensayos/procesos/pq-solidos.html + docs/banco-ensayos/procesos/pq-comprimidos.html + docs/banco-ensayos/procesos/pq-capsulas.html + docs/banco-ensayos/procesos/pq-granulados-polvos.html (versión: PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1).
var BancoProcesos = {
 "version": "PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1",
 "fases": {
  "PQ": [
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-000",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-000 — Requisitos previos a la PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar que el proceso, los equipos, los materiales, el personal y la documentación están listos antes de iniciar los lotes de PQ, para que una falla de ejecución no se confunda con una falla del proceso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Verificar que la URS, el análisis de riesgo y la especificación del producto están aprobados y vigentes<br>2) Confirmar que los equipos de la línea tienen IQ y OQ vigentes y que los instrumentos están calibrados<br>3) Verificar que el registro maestro de lote, la fórmula y las instrucciones de proceso están aprobados<br>4) Confirmar que materias primas y materiales de envase están liberados y que el personal está entrenado<br>5) Revisar que no hay desviaciones críticas abiertas que afecten la PQ<br>6) Anexar la lista de verificación firmada por ejecutor y revisor"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los requisitos previos verificados y documentados.<br>Cero desviaciones críticas abiertas que afecten la PQ.<br>Equipos con IQ/OQ vigentes e instrumentos con calibración vigente."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Lista de verificación de requisitos previos firmada<br>- Evidencia de IQ/OQ, calibraciones y liberación de materiales<br>- Registro maestro de lote aprobado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA — Process Validation: General Principles and Practices (2011), Stage 2; EU GMP Anexo 15; 21 CFR 211.100."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-011 — Plan de lotes y muestreo de la PQ",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Definir, antes de ejecutar, el número de lotes PPQ y el plan de muestreo por etapa: tamaño de lote, puntos, momentos, tamaño de muestra absoluto o porcentaje del lote, destino analítico y cadena de custodia."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Registrar el tamaño de lote [tamano_lote] y el número de lotes PPQ [lotes_ppq], con la justificación por riesgo y conocimiento del proceso<br>2) Identificar las etapas y puntos de muestreo (recepción, mezcla/granulación, compresión, recubrimiento, empaque) y asignar el porcentaje del lote o el n mínimo por etapa<br>3) Definir envase, rotulado, temperatura, tiempo máximo hasta el análisis y responsables de la muestra<br>4) Recolectar cada muestra en el punto y momento planificados, registrando lote, etapa, hora, operador y peso o volumen<br>5) Entregar al laboratorio con cadena de custodia; no sustituir ni completar muestras sin desviación aprobada antes del análisis<br>6) Anexar el plan aprobado, los registros de muestreo y las desviaciones"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Tamaño de lote [tamano_lote] y [lotes_ppq] lotes PPQ aprobados antes de iniciar.<br>100 % de las muestras planificadas recolectadas, identificadas y trazables.<br>Cero sustituciones de muestra sin desviación aprobada antes del análisis.<br>El porcentaje de muestreo por etapa queda definido en el plan aprobado y es consistente con el tamaño de lote."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Plan de muestreo aprobado, con tamaño de lote y lotes PPQ<br>- Registros de muestreo por etapa y punto<br>- Cadena de custodia y desviaciones de muestreo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Tamaño de lote, número de lotes y porcentaje por etapa: <span class=\"por-confirmar\">confirmar con el registro maestro y el plan de muestreo aprobado</span>. La propuesta de tres lotes consecutivos se justifica por riesgo; la FDA 2011 no fija un número."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA — Process Validation: General Principles and Practices (2011), Stage 2; 21 CFR 211.110(a); EU GMP Anexo 15; ICH Q9(R1); ICH Q10."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-001 — Descripción y aspecto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar los atributos organolépticos y físicos de la forma terminada: color, forma, olor, textura, homogeneidad, defectos visibles, marcas, ranuras y recubrimiento, para confirmar que el lote es representativo del producto aprobado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Tomar una muestra representativa del lote PPQ según el plan de muestreo aprobado<br>2) Inspeccionar cada unidad con luz blanca difusa y fondo mate, sin aumentar<br>3) Registrar color, forma, olor, textura, marcas y ranuras contra la descripción aprobada<br>4) Clasificar defectos: crítico (fisura, mancha, decoloración, contaminación), mayor (borde roto, recubrimiento incompleto) y menor (variación leve de tono)<br>5) Fotografiar la muestra y anexar la imagen al registro"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = defecto visual; unidad = pasa/no pasa. Tipo de dato = atributo. n = 20 unidades por lote PPQ. Estadísticos = proporción de defectos con IC binomial exacto del 95 %. Regla de decisión = cero defectos críticos y proporción de defectos menores ≤ 2,0 %. Atípicos: no aplica a atributo; toda unidad excluida se documenta y se conserva la original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Ninguna unidad con defecto crítico.<br>Defectos menores ≤ <span class=\"por-confirmar\">2,0 %</span> de las 20 unidades.<br>Color, forma, olor y marcas coinciden con la descripción aprobada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de inspección visual por unidad<br>- Fotografía de la muestra<br>- Data cruda y reporte del análisis de atributo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El 2,0 % es un valor de ejemplo; se confirma contra la especificación del producto y la monografía aplicable."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto aprobada; monografía del producto (USP o Ph. Eur.); 21 CFR 211.110(c)."
     }
    ],
    "tabla": null,
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-002 — Identificación del principio activo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar la presencia del principio activo en la forma terminada mediante un método cromatográfico o espectrofotométrico, según la monografía del producto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Preparar la muestra y el estándar de referencia según el método validado<br>2) Inyectar el estándar y la muestra por duplicado en el sistema HPLC o leer el espectro UV-Vis<br>3) Comparar tiempo de retención y espectro de la muestra contra el estándar<br>4) Calcular la diferencia de tiempo de retención y la similitud espectral<br>5) Anexar cromatogramas o espectros y la data cruda del sistema"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tiempo de retención y similitud espectral; unidad = min y %. Tipo de dato = analítico. n = 2 inyecciones de muestra y 2 del estándar. Estadísticos = media y diferencia absoluta; RSD de inyecciones ≤ 2,0 %. Regla de decisión = diferencia de retención ≤ 2,0 % y espectro coincidente. Atípicos: se repite la preparación; no se descarta la inyección original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Tiempo de retención de la muestra dentro de <span class=\"por-confirmar\">±2,0 %</span> del estándar.<br>Espectro UV-Vis coincidente con el estándar en los máximos de absorción.<br>RSD de inyecciones ≤ 2,0 %."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Cromatogramas o espectros de muestra y estándar<br>- Cálculo de retención y similitud<br>- Data cruda y reporte del análisis"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La tolerancia de retención es un valor de ejemplo; se confirma con el método validado y la monografía."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;621&gt; — Cromatografía; USP &lt;197&gt; — Pruebas de identificación espectrofotométrica; monografía del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "HPLC con detector UV o espectrofotómetro UV-Vis calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-003 — Valoración y contenido del principio activo",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Cuantificar el principio activo respecto de la cantidad declarada en el lote PPQ, para confirmar que el proceso entrega la potencia prevista."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Preparar por triplicado la muestra y el estándar según el método validado<br>2) Inyectar en HPLC y calcular el área o la relación de áreas<br>3) Calcular el porcentaje de la cantidad declarada por unidad y por lote<br>4) Comparar contra la especificación aprobada<br>5) Anexar cromatogramas, pesadas y datos crudos"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = porcentaje de la cantidad declarada; unidad = %. Tipo de dato = continua. n = 3 preparaciones por lote PPQ. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media dentro de 95,0–105,0 % y RSD ≤ 2,0 %. Atípicos = Grubbs solo si n ≥ 7; con n = 3 toda exclusión se justifica y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Contenido medio entre <span class=\"por-confirmar\">95,0 % y 105,0 %</span> de la cantidad declarada.<br>RSD de las tres preparaciones ≤ 2,0 %.<br>Cada resultado individual dentro de 90,0–110,0 % (por-confirmar)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Cromatogramas y cálculos por preparación<br>- Tabla de pesadas y diluciones<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites 95,0–105,0 % y 90,0–110,0 % son ilustrativos; se confirman contra la especificación del producto y la monografía."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;621&gt; — Cromatografía; ICH Q6A — Especificaciones; monografía del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "HPLC con detector UV calibrado; Balanza analítica calibrada",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-004 — Impurezas orgánicas y productos de degradación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Controlar los productos de degradación y las impurezas orgánicas del lote PPQ, para confirmar que el proceso y el envase no generan degradantes por encima de los límites aprobados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Preparar muestra y estándar de impurezas según el método validado<br>2) Inyectar en HPLC y registrar todos los picos, incluidos los no identificados<br>3) Calcular cada impureza individual, la suma y el total de impurezas<br>4) Comparar contra los límites de la especificación y de ICH Q3B(R2)<br>5) Anexar cromatogramas y la integración completa"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = porcentaje de impureza; unidad = %. Tipo de dato = analítico. n = 3 preparaciones por lote. Estadísticos = media, DE y suma; RSD ≤ 5,0 % para impurezas ≥ 0,10 %. Regla de decisión = cada impureza ≤ 0,20 %, total ≤ 1,0 % y ninguna impureza no identificada &gt; 0,10 %. Atípicos: se investiga el pico; no se descarta sin identificación."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cada impureza no identificada ≤ <span class=\"por-confirmar\">0,20 %</span>.<br>Total de impurezas ≤ <span class=\"por-confirmar\">1,0 %</span>.<br>Ninguna impureza por encima del umbral de identificación de ICH Q3B(R2)."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Cromatogramas con integración de todos los picos<br>- Tabla de impurezas individuales y total<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites 0,20 % y 1,0 % son ilustrativos; se confirman contra la especificación y el umbral de ICH Q3B(R2) para la dosis máxima diaria."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q3B(R2) — Impurezas en nuevos productos; USP &lt;621&gt;; monografía del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "HPLC con detector UV calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-005 — Impurezas inorgánicas y elementos traza",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las impurezas elementales del lote PPQ no superan los límites de exposición permitidos, considerando materias primas, agua, equipos y envase."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Preparar la muestra por digestión ácida validada, con blanco y duplicado<br>2) Analizar por ICP-MS o ICP-OES con curva de calibración y control de recuperación<br>3) Calcular la concentración de cada elemento y la exposición diaria según la dosis máxima<br>4) Comparar contra los PDE de ICH Q3D(R2) para la ruta oral<br>5) Anexar curva, blancos, recuperaciones y data cruda"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = concentración del elemento; unidad = µg/g y µg/día. Tipo de dato = analítico. n = 2 preparaciones por lote y 1 blanco. Estadísticos = media, DE y recuperación (80–120 %). Regla de decisión = exposición ≤ PDE de ICH Q3D(R2). Atípicos: se repite la digestión; no se descarta el resultado original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Pb ≤ <span class=\"por-confirmar\">5 µg/día</span>; Cd ≤ <span class=\"por-confirmar\">2 µg/día</span>; As ≤ <span class=\"por-confirmar\">15 µg/día</span>; Hg ≤ <span class=\"por-confirmar\">3 µg/día</span>.<br>Recuperación de cada elemento entre 80 % y 120 %.<br>La suma de aportes no supera el PDE de la ruta oral."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Curva de calibración y blancos<br>- Recuperaciones por elemento<br>- Data cruda y reporte de exposición diaria"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los PDE en rojo se toman de ICH Q3D(R2) y se confirman contra la dosis máxima diaria y la ruta de administración del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q3D(R2) — Impurezas elementales; USP &lt;232&gt; y &lt;233&gt;; 21 CFR 211.160."
     }
    ],
    "tabla": null,
    "instrumentos": "ICP-MS o ICP-OES calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-006 — Residuos de disolventes",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los disolventes residuales del proceso no superan los límites de ICH Q3C(R9) y la especificación del producto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Identificar los disolventes usados en la síntesis, granulación, recubrimiento o limpieza<br>2) Preparar la muestra por headspace según el método validado<br>3) Analizar por GC con estándar interno y curva de calibración<br>4) Calcular ppm y exposición diaria por disolvente<br>5) Anexar cromatogramas y la justificación de los disolventes incluidos"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = concentración de disolvente; unidad = ppm. Tipo de dato = analítico. n = 2 preparaciones por lote. Estadísticos = media, DE y recuperación (80–120 %). Regla de decisión = cada disolvente ≤ límite de ICH Q3C(R9). Atípicos: se repite la preparación; se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Disolventes Clase 1 ≤ límite de ICH Q3C(R9).<br>Clase 2 ≤ PDEconvertido a ppm para la dosis máxima.<br>Clase 3 ≤ <span class=\"por-confirmar\">5 000 ppm</span> o ≤ 0,5 % por pérdida por secado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Lista de disolventes y su clase<br>- Cromatogramas y cálculos de ppm<br>- Data cruda y reporte de exposición"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El límite de Clase 3 y la conversión a ppm se confirman con ICH Q3C(R9) y la dosis máxima diaria; si no se usan disolventes, se registra No Aplica con aprobación."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q3C(R9) — Disolventes residuales; USP &lt;467&gt;; USP &lt;731&gt;."
     }
    ],
    "tabla": null,
    "instrumentos": "Cromatógrafo de gases con headspace calibrado",
    "aplica": "solo si se usan disolventes orgánicos en la fabricación o limpieza",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-007",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-007 — Calidad microbiológica",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Controlar la carga microbiana y la ausencia de microorganismos especificados en el lote PPQ, según la categoría del producto oral no estéril."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Tomar la muestra de forma aséptica y homogeneizar según USP &lt;61&gt;<br>2) Sembrar para recuento total aerobio y levaduras/hongos<br>3) Incubar a la temperatura y tiempo del método<br>4) Sembrar para E. coli, S. aureus, P. aeruginosa y Salmonella según USP &lt;62&gt;<br>5) Anexar placas, diluciones y data cruda"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = UFC/g y ausencia/presencia; unidad = log10 UFC/g. Tipo de dato = recuento microbiológico. n = 2 muestras por lote. Estadísticos = media geométrica y log10; IC 95 % cuando n ≥ 3. Regla de decisión = recuentos ≤ límite y ausencia de especificados. Atípicos: Grubbs solo sobre log10 y con n ≥ 7."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Recuento total aerobio ≤ <span class=\"por-confirmar\">10³ UFC/g</span>.<br>Levaduras y hongos ≤ <span class=\"por-confirmar\">10² UFC/g</span>.<br>Ausencia de E. coli, S. aureus, P. aeruginosa y Salmonella en 1 g."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de siembra, diluciones e incubación<br>- Lectura de placas y pruebas confirmatorias<br>- Data cruda y reporte microbiológico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los recuentos en rojo se confirman contra la categoría microbiológica del producto (USP &lt;1111&gt;) y la monografía."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;61&gt; y &lt;62&gt; — Examen microbiológico; USP &lt;1111&gt;; 21 CFR 211.113."
     }
    ],
    "tabla": null,
    "instrumentos": "Incubadora calibrada; Cabina de flujo laminar; Balanza analítica calibrada",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-008",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-008 — Estabilidad del producto y atribución de vida útil",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar que el producto mantiene sus atributos durante la vida útil propuesta, con estudios acelerados y de larga duración en el envase comercial."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Verificar que los lotes PPQ ingresaron al plan de estabilidad con el envase y la orientación comercial<br>2) Revisar los puntos de tiempo, condiciones y métodos del protocolo ICH Q1A(R2)<br>3) Confirmar que cada punto tiene resultados completos y dentro de especificación<br>4) Evaluar tendencias y cambios significativos según ICH Q1A(R2)<br>5) Anexar el protocolo, los resultados y la conclusión de vida útil"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Sin cambio significativo en valoración, impurezas, disolución y atributos físicos durante <span class=\"por-confirmar\">12 meses</span> de larga duración.<br>Perfil de degradación consistente con el producto aprobado.<br>Vida útil propuesta sustentada por los datos disponibles."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Protocolo de estabilidad y cronograma<br>- Resultados por punto de tiempo<br>- Conclusión de vida útil y anexos"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los 12 meses y las condiciones se confirman contra ICH Q1A(R2), la zona climática y el plan de estabilidad aprobado."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>ICH Q1A(R2) — Estabilidad; ICH Q1B — Fotoestabilidad; 21 CFR 211.166."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-009",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-009 — Envase, cierre y protección del producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el envase y cierre del lote PPQ protegen el producto y cumplen las pruebas funcionales aplicables al sistema de empaque."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Identificar el sistema de envase y cierre aprobado: blíster, frasco, aluminio-aluminio u otro<br>2) Verificar integridad de sellado y ausencia de fugas en la muestra del lote<br>3) Ejecutar la prueba de permeación o transmisión aplicable según USP &lt;671&gt;<br>4) Revisar la compatibilidad y la ausencia de interacción con el producto<br>5) Anexar especificaciones, resultados y certificados del proveedor"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = integridad y tasa de permeación; unidad = pasa/no pasa y g/día. Tipo de dato = atributo y continua. n = 15 envases por lote para permeación; 30 para integridad. Estadísticos = proporción con IC binomial y media de permeación. Regla de decisión = cero fugas y permeación dentro de la especificación. Atípicos: se investiga el envase; no se descarta sin causa."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cero fugas en el 100 % de los envases examinados.<br>Permeación dentro del límite del sistema aprobado (USP &lt;671&gt;).<br>Sin interacción visible ni cambio de atributos del producto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Resultados de integridad y permeación<br>- Especificación del envase y certificados<br>- Data cruda y reporte del análisis"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El límite de permeación depende del material y del producto; se confirma con USP &lt;671&gt; y la especificación del envase."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;671&gt; — Containers: Performance Testing; 21 CFR 211.94; 21 CFR 211.122."
     }
    ],
    "tabla": null,
    "instrumentos": "Balanza analítica calibrada",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-010 — Etiquetado y control de materiales",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar que el etiquetado del lote PPQ coincide con el material aprobado y que no hubo mezclas ni errores de identificación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Comparar la etiqueta impresa contra el original aprobado y la orden de empaque<br>2) Verificar nombre, concentración, lote, vencimiento, condiciones de almacenamiento y advertencias<br>3) Revisar la conciliación de etiquetas emitidas, usadas y destruidas<br>4) Verificar la limpieza de línea y la separación de productos<br>5) Anexar la etiqueta aprobada, la muestra y el registro de conciliación"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de las etiquetas emitidas coinciden con el material aprobado.<br>Conciliación de etiquetas sin diferencias no justificadas.<br>Cero mezclas o errores de identificación en el lote."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Etiqueta aprobada y muestra del lote<br>- Registro de conciliación y limpieza de línea<br>- Evidencia de revisión por segunda persona"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 201; 21 CFR 211.122; 21 CFR 211.125; 21 CFR 211.130."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-012 — Proceso, diagrama de flujo y matriz CQA-CPP-IPC",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Documentar el proceso por etapas, su diagrama de flujo y la matriz que vincula cada atributo crítico de calidad (CQA) con los parámetros críticos de proceso (CPP) y los controles en proceso (IPC), con el análisis de riesgo que justifica la criticidad."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Describir el proceso por etapas: recepción y dispensación, mezcla, granulación, secado, compresión, recubrimiento y empaque; declarar el rango de lote [tamano_lote_min] a [tamano_lote_max], el tren de equipos [tren_equipos] y la condición de peor caso [peor_caso]<br>2) Anexar el diagrama de flujo con entradas, salidas, CPP e IPC de cada etapa<br>3) Listar los CQA del producto: valoración, impurezas, disolución, uniformidad, agua, microbiología y atributos físicos<br>4) Vincular cada CQA con al menos un CPP y un IPC; asignar criticidad con matriz S/P/D o FMEA y registrar la justificación<br>5) Verificar que cada CPP tiene rango aprobado y cada IPC tiene límite y frecuencia<br>6) Aprobar la matriz y el diagrama antes de ejecutar los lotes PPQ<br>7) Anexar la matriz firmada, el diagrama y el análisis de riesgo"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los CQA críticos con al menos un CPP y un IPC vinculados.<br>100 % de los CPP con rango aprobado y fuente documentada.<br>Criticidad y justificación aprobadas por Calidad antes de la ejecución.<br>Diagrama de flujo y matriz firmados y versionados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Diagrama de flujo del proceso versionado<br>- Matriz CQA-CPP-IPC con criticidad y justificación<br>- Análisis de riesgo del proceso aprobado"
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA — Process Validation (2011), Stage 1 y 2; ICH Q8(R2); ICH Q9(R1); ICH Q10; 21 CFR 211.110."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-013 — Rendimiento, balance de materiales y tiempos de espera",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el proceso rinde lo esperado, que el balance de materiales cierra y que los tiempos de espera entre etapas no degradan el producto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Registrar peso o cantidad teórica y real en cada etapa y calcular el rendimiento porcentual<br>2) Reconciliar material cargado, recuperado, rechazado y muestreado; calcular la diferencia porcentual<br>3) Definir el tiempo máximo de espera [hold_time_max] para mezcla, gránulos, núcleos, comprimidos recubiertos y granel antes del empaque<br>4) Mantener una muestra en el tiempo máximo de espera y analizar los atributos críticos antes y después<br>5) Anexar los registros de rendimiento, reconciliación y hold time, con la conclusión de aptitud"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = rendimiento, diferencia de reconciliación y cambio de atributos; unidad = %. Tipo de dato = continua. n = 3 lotes PPQ y 3 réplicas por etapa de hold time. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = rendimiento ≥ [yield_min] %, diferencia de reconciliación ≤ 1,0 % y cambio de atributos dentro de la especificación tras el hold time. Atípicos = Grubbs solo si n ≥ 7; toda exclusión se justifica."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Rendimiento por etapa ≥ <span class=\"por-confirmar\">[yield_min] %</span>.<br>Diferencia de reconciliación ≤ <span class=\"por-confirmar\">1,0 %</span>.<br>Hold time ≤ <span class=\"por-confirmar\">[hold_time_max] h</span> sin cambio significativo de atributos.<br>100 % de los lotes con balance de materiales cerrado y aprobado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de rendimiento por etapa y lote<br>- Balance de materiales y reconciliación<br>- Estudio de hold time con resultados antes/después"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El rendimiento mínimo, la tolerancia de reconciliación y el hold time en rojo son propuestas; se confirman con el desarrollo del proceso, el registro maestro y el riesgo del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.103 — Cálculo del rendimiento; 21 CFR 211.111 — Límites de tiempo de producción; 21 CFR 211.110; FDA — Process Validation (2011)."
     }
    ],
    "tabla": null,
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-014 — Capabilidad, lotes inválidos y verificación continua",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que el proceso es capaz, definir qué invalida un lote PPQ y establecer el plan de verificación continua (Stage 3) que mantiene el estado de control después de la validación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Calcular Cpk/Ppk de peso, dureza, valoración y disolución por lote y para el conjunto de lotes<br>2) Evaluar los componentes de varianza entre lotes y dentro del lote con ANOVA o modelo mixto<br>3) Definir los criterios de lote inválido: CPP fuera de rango no justificado, IPC fuera de límite, fallo de un CQA o error de muestreo<br>4) Definir la investigación, la CAPA y el número de lotes adicionales antes de repetir la PQ<br>5) Aprobar el plan de verificación continua [cpv_plan] con variables, frecuencia, cartas de control, límites de alerta/acción y revisión anual<br>6) Anexar el reporte de capabilidad, los criterios de invalidez y el plan CPV"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = Cpk/Ppk y componentes de varianza; unidad = índice y %. Tipo de dato = continua. n = 3 lotes PPQ con 10 a 30 resultados por atributo. Estadísticos = media, DE, Cpk/Ppk, ANOVA de componentes de varianza e IC 95 %. Regla de decisión = Cpk/Ppk ≥ [capability_min] y ningún lote inválido sin investigación. Atípicos = Grubbs solo si n ≥ 7; toda exclusión se justifica."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cpk/Ppk ≥ <span class=\"por-confirmar\">[capability_min]</span> en los atributos críticos.<br>100 % de los lotes con CPP e IPC dentro de rango.<br>Cero lotes inválidos sin investigación y CAPA aprobada.<br>Plan CPV [cpv_plan] aprobado antes del cierre de la PQ."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Reporte de capabilidad y componentes de varianza<br>- Criterios de lote inválido y registro de lotes adicionales<br>- Plan de verificación continua aprobado"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El Cpk/Ppk mínimo y el número de lotes adicionales en rojo son propuestas; se confirman con el riesgo del proceso y la política de Calidad. La FDA no fija un Cpk universal."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA — Process Validation (2011), Stage 3; ICH Q10; ICH Q9(R1); 21 CFR 211.180; 21 CFR 211.192."
     }
    ],
    "tabla": null,
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-015 — Variabilidad de materias primas y robustez del proceso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que el proceso tolera la variabilidad de las materias primas críticas (tamaño de partícula del API, humedad de excipientes, cambio de proveedor o lote) sin salir de los CPP, IPC y CQA aprobados."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Identificar los atributos críticos de material (CMA) y sus rangos: [cma_primas]<br>2) Seleccionar lotes en los extremos del rango o aplicar bracketing justificado<br>3) Ejecutar los lotes de desafío, o evaluar los lotes PPQ que contengan CMA en los extremos, manteniendo el resto de condiciones controladas<br>4) Comparar CPP, IPC y CQA contra los lotes con material nominal; evaluar si hubo ajustes de proceso<br>5) Anexar la matriz CMA-CPP-CQA, los certificados de materia prima y los resultados"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = CMA, CPP y CQA; unidad = µm, % y % de especificación. Tipo de dato = continua. n = 3 lotes por extremo o bracketing justificado. Estadísticos = media, DE, RSD (%) e IC 95 %; comparación entre extremos con ANOVA o modelo mixto. Regla de decisión = CQA dentro de especificación y CPP dentro de rango en ambos extremos. Atípicos = Grubbs solo si n ≥ 7; toda exclusión se justifica."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los CQA dentro de especificación en los lotes con CMA extrema.<br>100 % de los CPP dentro del rango aprobado, sin ajustes no justificados.<br>Matriz CMA-CPP-CQA completa y aprobada.<br>Cambio de proveedor o de lote evaluado antes de usarlo en la PQ."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Matriz CMA-CPP-CQA<br>- Certificados y resultados de materias primas<br>- Resultados comparativos de los lotes de desafío"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los CMA y sus rangos en rojo son propuestas; se confirman con el desarrollo, los certificados del proveedor y el análisis de riesgo. No se acepta un cambio de proveedor sin evaluación."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA — Process Validation (2011), Stage 1; ICH Q8(R2); ICH Q9(R1); 21 CFR 211.84; 21 CFR 211.110."
     }
    ],
    "tabla": null,
    "instrumentos": "Analizador de partículas calibrado; Balanza de humedad calibrada",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-016 — Condiciones ambientales y almacenamiento intermedio",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la temperatura y la humedad del área de manufactura y el almacenamiento intermedio no degradan el producto ni alteran los CPP/IPC."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Monitorear temperatura y humedad relativa durante los lotes, en los puntos críticos: balanza, mezcla, compresión, recubrimiento y almacén intermedio<br>2) Registrar cada 15 minutos o de forma continua, con fecha, hora y ubicación<br>3) Comparar contra los rangos aprobados: [area_temp_min] a [area_temp_max] °C y ≤ [area_hr_max] % HR<br>4) Mantener una muestra en la condición de peor humedad y tiempo de almacenamiento intermedio y analizar LOD, aspecto y microbiología<br>5) Anexar registros, excursiones, investigación y conclusiones"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura, HR, LOD y recuento microbiano; unidad = °C, % HR, % y UFC/g. Tipo de dato = continua y recuento. n = registro continuo del lote y 3 réplicas de la muestra en peor caso. Estadísticos = mínimo, máximo, media y DE; log10 para microbiología. Regla de decisión = 100 % del tiempo dentro de rango y sin cambio de atributos tras el almacenamiento. Atípicos: toda excursión se investiga; no se descarta."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % del tiempo de manufactura dentro de <span class=\"por-confirmar\">[area_temp_min]–[area_temp_max] °C</span> y <span class=\"por-confirmar\">≤ [area_hr_max] % HR</span>.<br>Sin cambio significativo de LOD, aspecto o microbiología tras el almacenamiento intermedio.<br>Cero excursiones sin investigación y disposición aprobada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro continuo de T/HR por área y lote<br>- Estudio de peor humedad/tiempo con resultados<br>- Investigación de excursiones y disposición"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los rangos de T/HR en rojo son propuestas; se confirman con el diseño del área, el producto y el plan de almacenamiento intermedio. Si el área no controla HR, se justifica con datos."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.46; 21 CFR 211.111; 21 CFR 211.110; ICH Q1A(R2) — Estabilidad; USP &lt;1111&gt;."
     }
    ],
    "tabla": null,
    "instrumentos": "Termohigrómetro calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-017 — Validación de limpieza y cambio de producto",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la limpieza entre productos está validada para el tren de equipos y que el cambio de producto no deja residuos por encima del límite aprobado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Revisar el protocolo de limpieza [limpieza_protocolo], aprobado y vigente para el producto y el tren de equipos<br>2) Verificar el MACO, el límite de residuo, la recuperación del método y el peor caso: producto más adherente, peor solubilidad y mayor tiempo de espera<br>3) Confirmar que el muestreo por hisopo o enjuague y el método analítico están validados<br>4) Revisar los tres ciclos de limpieza consecutivos y los resultados en los puntos críticos<br>5) Anexar protocolo, resultados, certificados y conclusión de cambio de producto"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los puntos críticos con residuo ≤ límite aprobado.<br>Tres ciclos de limpieza consecutivos conformes.<br>Recuperación del método ≥ <span class=\"por-confirmar\">70 %</span> o la justificada.<br>Cambio de producto aprobado por Calidad antes de la PQ."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Protocolo de limpieza y MACO<br>- Resultados de los tres ciclos y recuperación<br>- Conclusión de cambio de producto"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La recuperación y el límite de residuo en rojo son propuestas; se confirman con el protocolo de limpieza, el MACO y el riesgo del producto. La limpieza se ejecuta en su propio protocolo; aquí se verifica su estado."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.67; EU GMP Anexo 15; PIC/S PI 006-3; ICH Q9(R1)."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-018 — Transporte y distribución",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el producto mantiene sus atributos durante el transporte y la distribución, incluido el peor caso de ruta, temperatura, humedad y vibración."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Revisar el protocolo de transporte [transporte_protocolo]: rutas, duración, temperatura, humedad, vibración, impacto e integridad<br>2) Verificar la calibración y la colocación de los data loggers<br>3) Identificar y ejecutar el peor caso: ruta más larga, mayor temperatura y mayor vibración<br>4) Analizar el producto antes y después del transporte: aspecto, integridad, valoración, disolución y microbiología<br>5) Anexar protocolo, registros, resultados y conclusión"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = temperatura, humedad, vibración e integridad; unidad = °C, % HR, g y pasa/no pasa. Tipo de dato = continua y atributo. n = 3 rutas o 3 réplicas del peor caso. Estadísticos = mínimo, máximo, media y proporción con IC binomial. Regla de decisión = 100 % del tiempo dentro de rango y sin cambio de atributos. Atípicos: toda excursión se investiga; no se descarta."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % del tiempo de transporte dentro de <span class=\"por-confirmar\">2–30 °C</span> y <span class=\"por-confirmar\">≤ 75 % HR</span>, o el rango aprobado.<br>Integridad del envase 100 %.<br>Sin cambio significativo de atributos tras el peor caso.<br>Protocolo de transporte aprobado y ejecutado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Protocolo y rutas del estudio<br>- Registros de data loggers y vibración<br>- Resultados antes/después y conclusión"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los rangos de T/HR y las rutas en rojo son propuestas; se confirman con el estudio de transporte, el embalaje y el destino. El transporte se ejecuta en su propio protocolo; aquí se verifica su estado."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.142; 21 CFR 211.150; EU GDP; USP &lt;1079&gt;; ICH Q1A(R2)."
     }
    ],
    "tabla": null,
    "instrumentos": "Data logger de temperatura y humedad calibrado",
    "analisis": "si"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-019 — Scale-up y cambios de escala",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que un cambio de escala mantiene los CPP, IPC y CQA aprobados y que la justificación por bracketing o peor caso es válida."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Describir el cambio de escala y su justificación: [escala_justificacion]<br>2) Identificar los CPP que cambian con la escala: tiempo de mezcla, fuerza, velocidad, flujo, tiempos de secado y recubrimiento<br>3) Ejecutar bracketing en la escala menor y mayor, o el peor caso justificado<br>4) Comparar CPP, IPC y CQA contra la escala ya validada y evaluar la comparabilidad<br>5) Anexar el change control, el protocolo y los resultados"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los CQA dentro de especificación en las escalas evaluadas.<br>100 % de los CPP dentro del rango aprobado.<br>Sin diferencia no justificada entre escalas.<br>Change control aprobado antes de producir para comercial."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Change control y justificación de escala<br>- Protocolo de bracketing o peor caso<br>- Resultados comparativos y conclusión"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La justificación de escala en rojo es una propuesta; se confirma con el desarrollo, el análisis de riesgo y el change control. No se acepta un cambio de escala sin comparabilidad."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA — Process Validation (2011); ICH Q8(R2); ICH Q9(R1); ICH Q10; 21 CFR 211.110."
     }
    ],
    "tabla": null
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GEN-020",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GEN-020 — Recalificación periódica y revisión anual",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Definir la frecuencia y los disparadores de recalificación del proceso, y verificar que el estado de control se mantiene después de la PQ."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Definir la frecuencia de recalificación: [recalificacion_frecuencia]<br>2) Definir los disparadores: cambio de equipo, material, proceso o escala; desviación crítica; tendencia fuera de control; cambio de proveedor<br>3) Revisar el CPV, los cambios, las desviaciones, las CAPA, las quejas y la estabilidad del período<br>4) Definir el alcance de la recalificación: parámetros, lotes, muestreo y criterios<br>5) Aprobar el plan y anexar la revisión anual"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los disparadores evaluados y documentados.<br>Revisión anual completa y aprobada.<br>Plan de recalificación vigente con frecuencia ≤ <span class=\"por-confirmar\">[recalificacion_frecuencia]</span>.<br>Sin cambios no evaluados que afecten el proceso."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Plan de recalificación con frecuencia y disparadores<br>- Revisión anual de CPV, cambios y desviaciones<br>- Registro de reevaluación y conclusión"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La frecuencia en rojo es una propuesta; se confirma con el riesgo, el historial del proceso y la política de Calidad. La recalificación no reemplaza el CPV."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>FDA — Process Validation (2011), Stage 3; ICH Q10; 21 CFR 211.180; EU GMP Anexo 15."
     }
    ],
    "tabla": null
   },
   {
    "kind": "tabla",
    "id": "PRO-PQ-REF",
    "bloque": 6,
    "cond": "ambas",
    "titulo": "PRO-PQ-REF — Referencias del PQ de procesos",
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
       "FDA — Process Validation: General Principles and Practices (2011), Stage 2 PPQ",
       "VIGENTE"
      ],
      [
       "6.2",
       "EU GMP Anexo 15 — Cualificación y validación de procesos (2015)",
       "VIGENTE"
      ],
      [
       "6.3",
       "ICH Q8(R2), Q9(R1) y Q10 — Desarrollo, riesgo y sistema de calidad",
       "VIGENTE"
      ],
      [
       "6.4",
       "21 CFR 211.110 — Control de procesos e impurezas en proceso",
       "VIGENTE"
      ],
      [
       "6.5",
       "USP <701> (revisión oficial 2026-10-01), <711>, <905> y <1216>",
       "VIGENTE"
      ],
      [
       "6.6",
       "ICH Q1A(R2) — Estabilidad; ICH Q3B(R2) — Impurezas de degradación",
       "VIGENTE"
      ],
      [
       "6.7",
       "ICH Q3C(R9) — Disolventes residuales; ICH Q3D(R2) — Impurezas elementales",
       "VIGENTE"
      ],
      [
       "6.8",
       "USP <467>, <921>, <731>, <61>, <62>, <671> y <1092>",
       "VIGENTE"
      ],
      [
       "6.9",
       "21 CFR 211.94, 211.122, 211.125 y 211.130 — Envase y etiquetado",
       "VIGENTE"
      ]
     ]
    }
   },
   {
    "kind": "div",
    "clase": "anexos",
    "bloque": 8,
    "html": "<p><strong>ANEXOS:</strong></p>\n<table>\n<tbody><tr><th>SECCIÓN</th><th>TÍTULO</th></tr>\n<tr><td>8.1</td><td>Anexo A — Registros de lotes PPQ, muestreos y resultados por ensayo</td></tr>\n<tr><td>8.2</td><td>Anexo B — Certificados de instrumentos, columnas y estándares</td></tr>\n<tr><td>8.3</td><td>Anexo C — Data cruda, reportes estadísticos y trazabilidad de límites</td></tr>\n</tbody></table>"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-SOL-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-SOL-001 — Contenido de agua en la forma sólida",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Determinar el contenido de agua de la forma sólida del lote PPQ y confirmar que el proceso de secado o granulación entrega el nivel previsto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Tomar la muestra del lote PPQ y mantenerla en recipiente cerrado hasta el análisis<br>2) Pesar la muestra y determinar agua por Karl Fischer o pérdida por secado, según la monografía<br>3) Calcular el porcentaje de agua sobre la muestra tal cual<br>4) Comparar contra la especificación del producto<br>5) Anexar pesadas, consumo de reactivo y data cruda"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = contenido de agua; unidad = %. Tipo de dato = continua. n = 3 determinaciones por lote. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media ≤ 5,0 % y RSD ≤ 5,0 %. Atípicos = Grubbs solo si n ≥ 7; con n = 3 se repite la determinación y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Contenido de agua ≤ <span class=\"por-confirmar\">5,0 %</span>.<br>RSD de las tres determinaciones ≤ 5,0 %.<br>Método y temperatura de secado según la monografía del producto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Pesadas y consumo de reactivo<br>- Cálculo de porcentaje de agua<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El 5,0 % es ilustrativo; se confirma contra la especificación del producto y la monografía. Para productos higroscópicos se justifica un límite más estricto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;921&gt; — Determinación de agua; USP &lt;731&gt; — Pérdida por secado; monografía del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "Karl Fischer calibrado; Balanza analítica calibrada",
    "analisis": "si",
    "familia": "solidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-SOL-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-SOL-002 — Uniformidad de unidades de dosificación",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que las unidades de dosificación del lote PPQ contienen una cantidad uniforme del principio activo, por variación de peso o por uniformidad de contenido según la monografía."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Seleccionar 10 unidades al azar del lote PPQ<br>2) Pesar individualmente cada unidad y calcular el peso medio<br>3) Si la monografía exige uniformidad de contenido, analizar cada unidad por HPLC<br>4) Calcular el valor de aceptación (AV) y comparar contra USP &lt;905&gt;<br>5) Anexar pesadas, cromatogramas y cálculo del AV"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = masa o contenido por unidad; unidad = mg o %. Tipo de dato = continua. n = 10 unidades, ampliable a 30 según USP &lt;905&gt;. Estadísticos = media, DE y valor de aceptación (AV). Regla de decisión = AV ≤ 15,0 y ninguna unidad fuera de 85,0–115,0 %. Atípicos: se aplica el criterio de retesteo de USP &lt;905&gt;, no se descartan unidades."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Valor de aceptación (AV) ≤ <span class=\"por-confirmar\">15,0</span>.<br>Ninguna unidad fuera de <span class=\"por-confirmar\">85,0–115,0 %</span>.<br>RSD de peso ≤ 6,0 % cuando se usa variación de peso."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Pesadas individuales y cálculo de AV<br>- Cromatogramas si aplica uniformidad de contenido<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El AV y el intervalo se confirman contra USP &lt;905&gt; y la monografía; la elección entre peso y contenido depende de la dosis y del producto. Para granel (granulados o polvos), la homogeneidad se evalúa con PRO-PQ-SOL-003."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt; — Uniformidad de unidades de dosificación; monografía del producto; 21 CFR 211.110."
     }
    ],
    "tabla": null,
    "instrumentos": "Balanza analítica calibrada; HPLC con detector UV calibrado",
    "analisis": "si",
    "familia": "solidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-SOL-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-SOL-003 — Uniformidad de mezcla (blend uniformity)",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Demostrar que la mezcla de polvos es homogénea antes de la compresión o encapsulación, evaluando la variabilidad entre ubicaciones y dentro de cada ubicación."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Definir el plan de muestreo con el número de ubicaciones y réplicas: mínimo 10 ubicaciones para mezclador de volteo y al menos 20 para mezclador convectivo, con 3 réplicas por ubicación<br>2) Muestrear la mezcla al final del tiempo de mezcla, antes de descargar, con dispositivo que no segregue el lecho<br>3) Analizar cada réplica por HPLC o UV-Vis con método validado y calcular el porcentaje respecto del objetivo<br>4) Calcular media, DE, RSD y la media por ubicación; evaluar el efecto de ubicación con ANOVA o modelo mixto<br>5) Anexar el plan, los resultados por ubicación y la data cruda"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = porcentaje del principio activo respecto del objetivo; unidad = %. Tipo de dato = continua. n = 10 ubicaciones × 3 réplicas (30 muestras); 20 ubicaciones × 3 réplicas en mezclador convectivo. Estadísticos = media, DE, RSD (%) e IC 95 %; comparación de medias por ubicación con ANOVA o modelo mixto. Regla de decisión = RSD ≤ 5,0 %, cada media por ubicación dentro de 90,0–110,0 % y ningún individual fuera de 75,0–125,0 %. Atípicos = Grubbs solo si n ≥ 7 y sobre la variable medida; toda exclusión se justifica y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>RSD de todos los resultados ≤ <span class=\"por-confirmar\">5,0 %</span>.<br>Cada media por ubicación dentro de <span class=\"por-confirmar\">90,0–110,0 %</span> del objetivo.<br>Ningún resultado individual fuera de <span class=\"por-confirmar\">75,0–125,0 %</span> del objetivo.<br>Sin diferencia significativa entre ubicaciones (p &gt; 0,05) o diferencia explicada y aceptada por riesgo."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Plan de muestreo de mezcla con ubicaciones y réplicas<br>- Resultados por ubicación y análisis estadístico<br>- Data cruda y evaluación del efecto de ubicación"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los criterios son propuestas: la FDA retiró en 2013 el borrador de muestreo estratificado de 2003 y no fija límites numéricos. Se confirman con el plan de muestreo aprobado, el enfoque ISPE/PQRI y el riesgo del producto. USP &lt;905&gt; aplica a unidades terminadas, no al blend."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.110; FDA — Questions and Answers on CGMP (retiro del borrador de 2003); ISPE BUCU; PQRI — Stratified Sampling of Blend and Dosage Units; ICH Q9(R1); USP &lt;905&gt; (unidades terminadas)."
     }
    ],
    "tabla": null,
    "instrumentos": "HPLC con detector UV o espectrofotómetro UV-Vis calibrado; Balanza analítica calibrada",
    "analisis": "si",
    "familia": "solidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-001 — Dimensiones del comprimido",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar espesor, diámetro y forma de los comprimidos del lote PPQ contra la especificación, para confirmar la reproducibilidad de la compresión."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Tomar 10 comprimidos al azar del lote PPQ<br>2) Medir espesor y diámetro con calibrador digital, sin deformar el comprimido<br>3) Registrar cada medida y la forma observada<br>4) Calcular media, desviación y rango<br>5) Anexar la tabla de medidas y la verificación de calibración del calibrador"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = espesor y diámetro; unidad = mm. Tipo de dato = continua. n = 10 comprimidos. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada medida dentro de la especificación y RSD ≤ 2,0 %. Atípicos = Grubbs solo si n ≥ 7; se investiga la causa antes de excluir."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Espesor y diámetro dentro de <span class=\"por-confirmar\">±5,0 %</span> del valor nominal.<br>RSD de espesor y diámetro ≤ 2,0 %.<br>Forma y bordes conformes a la descripción aprobada."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Tabla de medidas por comprimido<br>- Cálculo de media, DE y RSD<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El ±5,0 % es un valor de ejemplo; se confirma contra la especificación del producto y el diseño del comprimido."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; USP &lt;1&gt; — Inyecciones y formas farmacéuticas (descripción); 21 CFR 211.110."
     }
    ],
    "tabla": null,
    "instrumentos": "Calibrador digital calibrado",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-002 — Peso promedio y variación de peso",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Asegurar la uniformidad de masa de los comprimidos del lote PPQ y detectar desviaciones de la compresión que puedan afectar la dosis."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Pesar individualmente 20 comprimidos al azar<br>2) Calcular el peso promedio y la desviación estándar<br>3) Calcular el porcentaje de desviación respecto del peso nominal<br>4) Identificar unidades fuera del intervalo y evaluar la causa<br>5) Anexar pesadas y cálculo estadístico"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = peso individual; unidad = mg. Tipo de dato = continua. n = 20 comprimidos. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media dentro de ±5,0 % del nominal, RSD ≤ 3,0 % y ninguna unidad fuera de ±10,0 %. Atípicos = Grubbs solo si n ≥ 7; toda exclusión se justifica."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Peso promedio dentro de <span class=\"por-confirmar\">±5,0 %</span> del peso nominal.<br>RSD ≤ 3,0 %.<br>Ninguna unidad fuera de <span class=\"por-confirmar\">±10,0 %</span> del promedio."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Pesadas individuales<br>- Cálculo de media, DE y RSD<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites son ilustrativos; se confirman contra la especificación y USP &lt;905&gt;. La variación de peso no sustituye la uniformidad de contenido cuando la dosis es baja."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;905&gt; — Uniformidad de unidades de dosificación; especificación del producto; 21 CFR 211.110."
     }
    ],
    "tabla": null,
    "instrumentos": "Balanza analítica calibrada",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-003 — Dureza y resistencia mecánica",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Evaluar la resistencia mecánica de los comprimidos del lote PPQ para confirmar que soportan manejo, empaque y transporte sin romperse."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Tomar 10 comprimidos al azar y acondicionarlos según el método<br>2) Medir la fuerza de ruptura en el durómetro, en la misma orientación<br>3) Registrar cada valor y la unidad (kp o N)<br>4) Calcular media, DE y RSD<br>5) Anexar la calibración del durómetro y la tabla de resultados"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = fuerza de ruptura; unidad = kp o N. Tipo de dato = continua. n = 10 comprimidos. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada valor dentro de 6–10 kp y RSD ≤ 10,0 %. Atípicos = Grubbs solo si n ≥ 7; se investiga la causa antes de excluir."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Dureza entre <span class=\"por-confirmar\">6 y 10 kp</span>.<br>RSD ≤ 10,0 %.<br>Ningún comprimido roto antes de alcanzar el límite inferior."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Tabla de dureza por comprimido<br>- Cálculo de media, DE y RSD<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El intervalo 6–10 kp es ilustrativo y depende del diseño del comprimido; se confirma contra la especificación y el estudio de compresión."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; USP &lt;1216&gt; — Friabilidad (como referencia de robustez); 21 CFR 211.110."
     }
    ],
    "tabla": null,
    "instrumentos": "Durómetro calibrado",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-004 — Friabilidad",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Evaluar la resistencia de los comprimidos a la abrasión y al manejo, midiendo la pérdida de masa después de la rotación en el friabilímetro."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Pesar el conjunto de comprimidos antes de la prueba (aproximadamente 6,5 g o 10 unidades)<br>2) Colocar en el tambor del friabilímetro y girar a 25 rpm durante 4 min<br>3) Retirar, limpiar el polvo y pesar de nuevo<br>4) Calcular la pérdida de masa porcentual<br>5) Repetir dos veces si el resultado es dudoso o supera el límite, y reportar la media de las tres"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = pérdida de masa; unidad = %. Tipo de dato = continua. n = 1 corrida de 10 comprimidos; 3 corridas si el resultado es dudoso. Estadísticos = media y DE de las corridas. Regla de decisión = pérdida ≤ 1,0 % en la corrida única o media ≤ 1,0 % en tres. Atípicos: se repite la prueba; no se descarta la corrida original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Pérdida de masa ≤ <span class=\"por-confirmar\">1,0 %</span>.<br>Sin comprimidos rotos, astillados o agrietados después de la prueba.<br>Tambor y velocidad conformes a USP &lt;1216&gt;."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Pesada inicial y final<br>- Cálculo de pérdida porcentual<br>- Data cruda y reporte de la prueba"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El 1,0 % es el criterio armonizado de USP &lt;1216&gt; para la mayoría de los productos; se confirma contra la especificación."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1216&gt; — Friabilidad de comprimidos; especificación del producto; 21 CFR 211.110."
     }
    ],
    "tabla": null,
    "instrumentos": "Friabilímetro calibrado; Balanza analítica calibrada",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-005 — Desintegración",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los comprimidos del lote PPQ se desintegran dentro del tiempo especificado en el medio y la temperatura definidos."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Verificar que el desintegrador cumple las dimensiones y la velocidad de USP &lt;701&gt;<br>2) Colocar 6 comprimidos en los tubos, con disco si la monografía lo exige<br>3) Operar con agua o el medio especificado a 37 ± 2 °C<br>4) Registrar el tiempo de desintegración de cada unidad<br>5) Si fallan 1 o 2, repetir con 12 unidades adicionales y evaluar 18"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tiempo de desintegración; unidad = min. Tipo de dato = continua. n = 6 unidades; 18 si hay retesteo. Estadísticos = tiempo máximo y proporción que cumple. Regla de decisión = las 6 unidades desintegran dentro del límite; en retesteo, al menos 16 de 18. Atípicos: se aplica el criterio de retesteo de USP &lt;701&gt;."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Desintegración ≤ <span class=\"por-confirmar\">15 min</span> para comprimidos no recubiertos.<br>≤ <span class=\"por-confirmar\">30 min</span> para comprimidos recubiertos, salvo especificación distinta.<br>Las 6 unidades desintegran; en retesteo, al menos 16 de 18."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de tiempo por unidad<br>- Verificación de temperatura y medio<br>- Data cruda y reporte de la prueba"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los tiempos en rojo se confirman contra la monografía y la forma (no recubierto, recubierto, liberación modificada)."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;701&gt; — Desintegración (revisión armonizada oficial desde 2026-10-01); monografía del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "Desintegrador calibrado; Termómetro/termopar calibrado",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-006",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-006 — Disolución",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Evaluar la liberación del principio activo de los comprimidos del lote PPQ en las condiciones farmacopeicas, como indicador de desempeño del producto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Verificar el aparato, el medio, el volumen y la velocidad especificados en la monografía<br>2) Colocar 6 comprimidos en el disolutor y muestrear al tiempo definido<br>3) Filtrar y analizar por HPLC o UV-Vis contra estándar<br>4) Calcular el porcentaje liberado por unidad y la media<br>5) Anexar cromatogramas, condiciones y data cruda"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = porcentaje liberado; unidad = %. Tipo de dato = continua. n = 6 unidades; 12 si se requiere retesteo. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media ≥ Q y ninguna unidad &lt; Q − 15 % en el primer estadio. Atípicos: se aplica el criterio de estadios de USP &lt;711&gt;."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Liberación media ≥ <span class=\"por-confirmar\">80 %</span> en <span class=\"por-confirmar\">30 min</span> para cápsulas duras; ≥ <span class=\"por-confirmar\">75 %</span> en <span class=\"por-confirmar\">45 min</span> para cápsulas blandas.<br>Ninguna cápsula &lt; Q − 15 % en el primer estadio.<br>Sin residuo de cubierta adherido a la canastilla o al vaso."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Condiciones del disolutor y curva de calibración<br>- Resultados por unidad y media<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Q = 80 % en 30 min es el ejemplo del archivo; se confirma contra la monografía y la especificación del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;711&gt; — Disolución; USP &lt;1092&gt; — Desarrollo y validación del método de disolución; monografía del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "Disolutor calibrado; HPLC con detector UV o espectrofotómetro UV-Vis calibrado",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-014",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-014 — Muestreo en proceso de comprimidos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Definir los puntos, momentos y tamaño de muestra del proceso de comprimidos, expresado como porcentaje del lote por etapa, para que la PQ cubra mezcla/granulación, compresión, recubrimiento y empaque."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Mezcla/granulación: muestrear 3 ubicaciones (superior, medio, inferior) × 3 réplicas al final de la mezcla; aplicar [porcentaje_mezcla] % del lote y enviar a PRO-PQ-SOL-003 (uniformidad de mezcla) y valoración<br>2) Compresión: muestrear al inicio, medio y final, cada 30 min; 10 comprimidos por punto; aplicar [porcentaje_compresion] % del lote; enviar a peso, dureza y dimensiones<br>3) Recubrimiento: muestrear al inicio, medio y final; 10 comprimidos por punto; aplicar [porcentaje_recubrimiento] % del lote; enviar a contenido e integridad del recubrimiento<br>4) Empaque: muestrear al inicio, medio y final; 10 unidades por punto; aplicar [porcentaje_empaque] % del lote; enviar a envase y etiquetado<br>5) Registrar lote, etapa, punto, hora, operador y peso o volumen; entregar con cadena de custodia"
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de las muestras planificadas recolectadas y trazables.<br>Mezcla: 3 ubicaciones × 3 réplicas; compresión y recubrimiento: 10 comprimidos por punto; empaque: 10 unidades por punto.<br>Porcentaje del lote por etapa: mezcla [porcentaje_mezcla] %, compresión [porcentaje_compresion] %, recubrimiento [porcentaje_recubrimiento] %, empaque [porcentaje_empaque] %.<br>Cero sustituciones sin desviación aprobada antes del análisis."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Tabla de muestreo por etapa, punto y momento<br>- Registros de muestreo y cadena de custodia<br>- Desviaciones de muestreo con disposición"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los porcentajes por etapa y el tamaño de lote son <span class=\"por-confirmar\">propuestas a confirmar</span> contra el plan de muestreo aprobado y el registro maestro; el mínimo de unidades por punto se mantiene aunque el porcentaje dé un número menor."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.110(a); FDA — Process Validation (2011), Stage 2; EU GMP Anexo 15; USP &lt;905&gt;; USP &lt;711&gt;."
     }
    ],
    "tabla": null,
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-015",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-015 — Granulación y secado: CPP e IPC",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Controlar la granulación y el secado dentro de los rangos aprobados y detectar desviaciones de humedad, tamaño o uniformidad antes de comprimir."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) CPP de mezcla/granulación: tiempo, velocidad de impulsor y chopper, tasa y cantidad de ligante; rangos propuestos en rojo (tiempo 5–15 min, impulsor 100–300 rpm, chopper 500–1500 rpm)<br>2) CPP de secado: temperatura de entrada 40–70 °C, flujo de aire y punto final por LOD o potencia; rangos propuestos en rojo<br>3) IPC: LOD 1,0–3,0 % (rojo), tamaño de partícula o densidad aparente según desarrollo, uniformidad de mezcla por PRO-PQ-SOL-003 y rendimiento<br>4) Frecuencia: LOD cada 15 min al final del secado; mezcla al final; 3 réplicas por punto<br>5) Registrar CPP cada 5 min y las alarmas; detener y desviar si sale de rango<br>6) Anexar registros, curvas y data cruda"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = LOD, tamaño de partícula, densidad y RSD de mezcla; unidad = % y µm. Tipo de dato = continua. n = 3 réplicas por punto y 3 puntos por lote. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = LOD 1,0–3,0 %, RSD de mezcla ≤ 5,0 % y CPP dentro de rango. Atípicos = Grubbs solo si n ≥ 7; se investiga antes de excluir."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los CPP dentro del rango aprobado durante el lote.<br>LOD final entre <span class=\"por-confirmar\">1,0 % y 3,0 %</span>.<br>RSD de mezcla ≤ <span class=\"por-confirmar\">5,0 %</span>.<br>Cero desviaciones de CPP o IPC sin investigación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de CPP por etapa y curvas de secado<br>- Resultados de LOD, tamaño/densidad y mezcla<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los rangos de tiempo, velocidad, temperatura y LOD son propuestas; se confirman con el desarrollo del proceso y el registro maestro. El tamaño de partícula solo se exige si el desarrollo lo define como crítico."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.110; FDA — Process Validation (2011); ICH Q8(R2); ICH Q9(R1)."
     }
    ],
    "tabla": null,
    "instrumentos": "Balanza de humedad calibrada; Registrador de datos del granulador calibrado",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-016",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-016 — Compresión: CPP e IPC",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Controlar la fuerza, la velocidad y la alimentación de la compresora y detectar desviaciones de peso, dureza y espesor durante la compresión."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) CPP: fuerza de compresión 5–15 kN, velocidad de turreta 20–40 rpm, velocidad de alimentación 20–60 rpm, precompresión y fuerza de eyección; rangos propuestos en rojo<br>2) IPC: peso ±5,0 %, dureza 6–10 kp, espesor ±5,0 %, friabilidad ≤ 1,0 % y aspecto 100 % conforme; límites propuestos en rojo<br>3) Frecuencia: inicio, cada 30 min y final; 10 comprimidos por punto<br>4) Registrar CPP de forma continua y detener la compresión si sale de rango<br>5) Anexar registros, tabla de IPC y data cruda"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = peso, dureza, espesor y friabilidad; unidad = mg, kp, mm y %. Tipo de dato = continua. n = 10 comprimidos por punto y 3 puntos por lote. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada IPC dentro de su límite y CPP dentro de rango. Atípicos = Grubbs solo si n ≥ 7; se investiga la causa."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los CPP dentro del rango aprobado.<br>Peso y espesor dentro de <span class=\"por-confirmar\">±5,0 %</span>; dureza <span class=\"por-confirmar\">6–10 kp</span>; friabilidad ≤ <span class=\"por-confirmar\">1,0 %</span>.<br>100 % de los puntos de muestreo recolectados.<br>Cero desviaciones de CPP o IPC sin investigación."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro continuo de fuerza, velocidad y alimentación<br>- Tabla de IPC por punto y lote<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los rangos de fuerza, velocidad y los límites de IPC son propuestas; se confirman con el estudio de compresión y la especificación del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.110; USP &lt;905&gt;; USP &lt;1216&gt;; USP &lt;701&gt;; FDA — Process Validation (2011)."
     }
    ],
    "tabla": null,
    "instrumentos": "Durómetro calibrado; Balanza analítica calibrada; Calibrador digital calibrado",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-017",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-017 — Recubrimiento: CPP e IPC",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Controlar la temperatura, la pulverización, la presión y la velocidad del recubrimiento y verificar la ganancia e integridad de la película."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) CPP: temperatura de entrada 40–60 °C, temperatura de salida 35–45 °C, tasa de pulverización 20–60 g/min, presión de atomización 1,5–3,0 bar, velocidad del tambor 10–20 rpm y flujo de aire; rangos propuestos en rojo<br>2) IPC: ganancia de peso 2,0–4,0 %, integridad 100 %, aspecto y LOD; límites propuestos en rojo<br>3) Frecuencia: inicio, medio y final; 10 comprimidos por punto<br>4) Registrar CPP de forma continua y detener si sale de rango<br>5) Anexar registros, ganancia de peso e integridad"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = ganancia de peso, integridad y LOD; unidad = % y pasa/no pasa. Tipo de dato = continua y atributo. n = 10 comprimidos por punto y 3 puntos por lote. Estadísticos = media, DE, RSD (%) y proporción con IC binomial. Regla de decisión = ganancia 2,0–4,0 %, integridad 100 % y CPP dentro de rango. Atípicos = Grubbs solo si n ≥ 7; se investiga la causa."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los CPP dentro del rango aprobado.<br>Ganancia de recubrimiento entre <span class=\"por-confirmar\">2,0 % y 4,0 %</span>.<br>Integridad del recubrimiento 100 %.<br>Cero comprimidos con núcleo expuesto o descascarado."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de temperatura, spray, presión y velocidad<br>- Ganancia de peso e integridad por punto<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los rangos de temperatura, spray, presión y ganancia son propuestas; se confirman con el desarrollo del recubrimiento y la especificación del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.110; USP &lt;711&gt; — Disolución (recubrimiento funcional); ICH Q8(R2); FDA — Process Validation (2011)."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado; Balanza analítica calibrada; Manómetro calibrado",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-018",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-018 — Empaque: CPP e IPC",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Controlar los parámetros de sellado y verificar la integridad, alineación y aspecto del empaque primario."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) CPP: temperatura de sellado 120–180 °C, presión 3–6 bar, tiempo de dwell 0,5–2,0 s, velocidad 20–60 golpes/min y alineación; rangos propuestos en rojo<br>2) IPC: integridad de sellado 100 %, alineación, aspecto y peso; límites propuestos en rojo<br>3) Frecuencia: inicio, medio y final; 30 unidades para integridad y 10 para aspecto<br>4) Registrar CPP de forma continua y detener si sale de rango; vincular temperatura, presión y dwell con la integridad y la permeabilidad de PRO-PQ-GEN-009<br>5) Anexar registros, resultados de integridad y muestras"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = integridad de sellado, alineación y peso; unidad = pasa/no pasa y g. Tipo de dato = atributo y continua. n = 30 unidades para integridad y 10 para aspecto por punto. Estadísticos = proporción con IC binomial y media/DE del peso. Regla de decisión = 100 % de sellos íntegros, cero desalineaciones y CPP dentro de rango. Atípicos: se investiga la unidad; no se descarta sin causa."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los envases con sellado íntegro.<br>Cero envases desalineados o con defecto crítico.<br>100 % de los CPP dentro del rango aprobado.<br>100 % de los puntos de muestreo recolectados."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de temperatura, presión, dwell y velocidad<br>- Resultados de integridad, alineación y aspecto<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los rangos de sellado y los límites de IPC son propuestas; se confirman con la validación del empaque y la especificación del material."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.110; USP &lt;671&gt;; 21 CFR 211.94; FDA — Process Validation (2011)."
     }
    ],
    "tabla": null,
    "instrumentos": "Termómetro/termopar calibrado; Manómetro calibrado; Cronómetro calibrado",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-019",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-019 — Detección de metales y cuerpos extraños",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el detector de metales rechaza cuerpos ferrosos, no ferrosos y de acero inoxidable en la matriz del producto, y que no libera producto contaminado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Usar patrones certificados de hierro, no ferroso y acero inoxidable de [metal_sensibilidad] mm<br>2) Pasar cada patrón al inicio, medio y final de la corrida, con 3 repeticiones por tipo y posición<br>3) Verificar el rechazo, la alarma y el registro del evento<br>4) Evaluar los rechazos falsos de producto bueno y registrar la tasa<br>5) Anexar certificados de los patrones, calibración del detector y registros de la prueba"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = rechazo del patrón; unidad = pasa/no pasa. Tipo de dato = atributo. n = 3 tipos × 3 posiciones × 3 repeticiones = 27 desafíos. Estadísticos = proporción de rechazo con IC binomial exacto. Regla de decisión = 100 % de rechazo de cada patrón y tasa de rechazo falso ≤ 0,1 %. Atípicos: no aplica a atributo; todo fallo se investiga."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>100 % de los patrones ferrosos, no ferrosos y de acero inoxidable rechazados.<br>Cero falsos negativos.<br>Tasa de rechazo falso de producto bueno ≤ <span class=\"por-confirmar\">0,1 %</span>.<br>Detector calibrado y verificado antes y después de la prueba."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Certificados de los patrones<br>- Registro de rechazo por tipo y posición<br>- Verificación de calibración y tasa de rechazo falso"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tamaño de patrón y la tasa de rechazo falso en rojo son propuestas; se confirman con la validación del detector, el fabricante y el riesgo del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.110; EU GMP Anexo 15; manual del fabricante del detector; ICH Q9(R1)."
     }
    ],
    "tabla": null,
    "instrumentos": "Detector de metales calibrado; Patrones certificados de prueba",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-010",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-010 — Contenido de recubrimiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el recubrimiento aplicado al lote PPQ alcanza el contenido y la uniformidad especificados, para asegurar protección y desempeño."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Pesar 10 comprimidos nucleares antes del recubrimiento y 10 recubiertos del mismo lote<br>2) Calcular la ganancia de peso por unidad y la media<br>3) Verificar la uniformidad visual del recubrimiento<br>4) Comparar contra la especificación del producto<br>5) Anexar pesadas y registro del proceso de recubrimiento"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = ganancia de peso por recubrimiento; unidad = % y mg. Tipo de dato = continua. n = 10 unidades. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = ganancia dentro de 2,0–4,0 % y RSD ≤ 5,0 %. Atípicos = Grubbs solo si n ≥ 7; se investiga la causa."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Ganancia de peso por recubrimiento entre <span class=\"por-confirmar\">2,0 % y 4,0 %</span>.<br>RSD ≤ 5,0 %.<br>Recubrimiento uniforme, sin zonas descubiertas ni acumulaciones."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Pesadas antes y después del recubrimiento<br>- Cálculo de ganancia y RSD<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>La ganancia 2,0–4,0 % es ilustrativa; se confirma contra la fórmula maestra y la especificación del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; USP &lt;711&gt; — Disolución (cuando el recubrimiento es funcional); 21 CFR 211.110."
     }
    ],
    "tabla": null,
    "instrumentos": "Balanza analítica calibrada",
    "subtipo": "Recubierto",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-011",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-011 — Integridad del recubrimiento",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar que el recubrimiento del lote PPQ está íntegro y protege el núcleo, sin grietas, descascarado ni zonas expuestas."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Tomar 20 comprimidos recubiertos al azar<br>2) Inspeccionar con luz blanca y aumento 10× si es necesario<br>3) Clasificar grietas, descascarado, picaduras, zonas descubiertas y acumulaciones<br>4) Registrar el número de unidades afectadas por tipo<br>5) Anexar fotografías y la evaluación por segunda persona"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = integridad visual; unidad = pasa/no pasa. Tipo de dato = atributo. n = 20 unidades. Estadísticos = proporción de defectos con IC binomial exacto del 95 %. Regla de decisión = cero unidades con núcleo expuesto y ≤ 1 unidad con defecto menor. Atípicos: no aplica; toda unidad excluida se documenta."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cero unidades con núcleo expuesto o descascarado.<br>≤ <span class=\"por-confirmar\">1 de 20</span> unidades con defecto menor.<br>Recubrimiento continuo en ambas caras y en el borde."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de inspección por unidad<br>- Fotografías de defectos<br>- Data cruda y reporte de atributo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El 1 de 20 es ilustrativo; se confirma contra la especificación y la criticidad del recubrimiento para el producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; USP &lt;711&gt; — Disolución (recubrimiento funcional); 21 CFR 211.110."
     }
    ],
    "tabla": null,
    "subtipo": "Recubierto",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-012",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-012 — Perfil de disolución para liberación modificada",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Caracterizar el perfil de liberación del principio activo del lote PPQ en varios tiempos, para demostrar que la forma de liberación modificada cumple el diseño."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Verificar el aparato, los medios y los tiempos del perfil aprobado (por ejemplo 1, 2, 4 y 8 h)<br>2) Colocar 12 unidades y muestrear en cada tiempo<br>3) Analizar cada muestra por HPLC o UV-Vis<br>4) Calcular el porcentaje acumulado liberado por unidad y la media<br>5) Comparar el perfil contra la especificación y el perfil de referencia"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = porcentaje acumulado liberado; unidad = %. Tipo de dato = continua. n = 12 unidades por tiempo. Estadísticos = media, DE, RSD (%) e IC 95 % por tiempo. Regla de decisión = cada tiempo dentro del intervalo aprobado y RSD ≤ 10 % en los tiempos tempranos. Atípicos: se aplica el criterio de estadios de USP &lt;711&gt;."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Perfil dentro de los intervalos aprobados en cada tiempo: <span class=\"por-confirmar\">1 h, 2 h, 4 h y 8 h</span>.<br>RSD ≤ 10 % en los tiempos tempranos.<br>Sin liberación súbita (dose dumping) fuera del diseño."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Condiciones del disolutor y curva de calibración<br>- Perfil por unidad y media por tiempo<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los tiempos y los intervalos en rojo se confirman contra la especificación del producto y el estudio de liberación."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;711&gt; — Disolución; USP &lt;1092&gt; — Desarrollo y validación; ICH Q1A(R2) — Estabilidad."
     }
    ],
    "tabla": null,
    "instrumentos": "Disolutor calibrado; HPLC con detector UV o espectrofotómetro UV-Vis calibrado",
    "subtipo": "Liberación modificada",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CMP-013",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CMP-013 — Tiempo de efervescencia y pH de la solución",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que los comprimidos efervescentes del lote PPQ se disgregan en el tiempo especificado y que la solución resultante cumple el pH aprobado."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Colocar un comprimido en un vaso con agua a la temperatura especificada<br>2) Medir con cronómetro el tiempo hasta que cesa la evolución de gas y no quedan aglomerados<br>3) Repetir con 6 unidades<br>4) Medir el pH de la solución con pH-metro calibrado<br>5) Anexar tiempos, pH y condiciones del agua"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tiempo de efervescencia y pH; unidad = min y unidades de pH. Tipo de dato = continua. n = 6 unidades. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = tiempo ≤ 5 min y pH dentro del intervalo aprobado. Atípicos: se repite la unidad; se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Tiempo de efervescencia ≤ <span class=\"por-confirmar\">5 min</span>.<br>pH de la solución dentro de <span class=\"por-confirmar\">3,0–6,0</span> o el intervalo aprobado.<br>Sin aglomerados ni residuo visible al final de la prueba."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Tiempo por unidad y pH de la solución<br>- Condiciones del agua y calibración del pH-metro<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El pH 3,0–6,0 es un valor de ejemplo; se confirma contra la especificación del producto. El tiempo de 5 min sigue el criterio de efervescentes de USP &lt;701&gt;."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;701&gt; — Desintegración (criterio para comprimidos efervescentes); monografía del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado; pH-metro calibrado; Balanza analítica calibrada",
    "subtipo": "Efervescente",
    "analisis": "si",
    "familia": "comprimidos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CAP-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CAP-001 — Desintegración de cápsulas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que las cápsulas del lote PPQ se desintegran dentro del tiempo especificado en el medio y la temperatura definidos por la monografía."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Verificar que el desintegrador cumple dimensiones y velocidad de USP &lt;701&gt;<br>2) Colocar 6 cápsulas en los tubos, con disco si la monografía lo exige<br>3) Operar con agua o el medio especificado a 37 ± 2 °C<br>4) Registrar el tiempo de desintegración de cada unidad<br>5) Si fallan 1 o 2, repetir con 12 unidades adicionales y evaluar 18"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tiempo de desintegración; unidad = min. Tipo de dato = continua. n = 6 unidades; 18 si hay retesteo. Estadísticos = tiempo máximo y proporción que cumple. Regla de decisión = las 6 cápsulas desintegran dentro del límite; en retesteo, al menos 16 de 18. Atípicos: se aplica el criterio de retesteo de USP &lt;701&gt;."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Desintegración ≤ <span class=\"por-confirmar\">30 min</span> para cápsulas duras, salvo especificación distinta.<br>≤ <span class=\"por-confirmar\">30 min</span> para cápsulas blandas o el límite de la monografía.<br>Las 6 unidades desintegran; en retesteo, al menos 16 de 18."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de tiempo por unidad<br>- Verificación de temperatura y medio<br>- Data cruda y reporte de la prueba"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo en rojo se confirma contra la monografía y el tipo de cápsula; no se generaliza el límite de comprimidos."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;701&gt; — Desintegración (revisión armonizada oficial desde 2026-10-01); monografía del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "Desintegrador calibrado; Termómetro/termopar calibrado",
    "analisis": "si",
    "familia": "capsulas"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CAP-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CAP-002 — Disolución de cápsulas",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Evaluar la liberación del principio activo de las cápsulas del lote PPQ en las condiciones farmacopeicas, como indicador de desempeño del producto."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Verificar aparato, medio, volumen y velocidad de la monografía<br>2) Colocar 6 cápsulas en el disolutor y muestrear al tiempo definido<br>3) Filtrar y analizar por HPLC o UV-Vis contra estándar<br>4) Calcular el porcentaje liberado por unidad y la media<br>5) Anexar cromatogramas, condiciones y data cruda"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = porcentaje liberado; unidad = %. Tipo de dato = continua. n = 6 unidades; 12 si se requiere retesteo. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = media ≥ Q y ninguna unidad &lt; Q − 15 % en el primer estadio. Atípicos: se aplica el criterio de estadios de USP &lt;711&gt;."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Liberación media ≥ <span class=\"por-confirmar\">80 %</span> en <span class=\"por-confirmar\">30 min</span>.<br>Ninguna unidad &lt; Q − 15 % en el primer estadio.<br>Condiciones de aparato y medio según la monografía."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Condiciones del disolutor y curva de calibración<br>- Resultados por unidad y media<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Q = 80 % en 30 min es un ejemplo; se confirma contra la monografía y la especificación del producto. Para cápsulas de liberación modificada se usa el perfil de PRO-PQ-CAP-004."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;711&gt; — Disolución; USP &lt;1092&gt; — Desarrollo y validación; monografía del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "Disolutor calibrado; HPLC con detector UV o espectrofotómetro UV-Vis calibrado",
    "analisis": "si",
    "familia": "capsulas"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CAP-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CAP-003 — Integridad de la cápsula",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Confirmar que las cápsulas del lote PPQ están cerradas, sin grietas, abolladuras, fugas, deformación ni separación de la tapa y el cuerpo."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Tomar 20 cápsulas al azar del lote PPQ<br>2) Inspeccionar con luz blanca difusa y aumento 10× si es necesario<br>3) Clasificar grietas, separación, fugas, deformación, abolladuras y contaminación<br>4) Registrar el número de unidades afectadas por tipo<br>5) Fotografiar y revisar por segunda persona"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = integridad visual; unidad = pasa/no pasa. Tipo de dato = atributo. n = 20 unidades. Estadísticos = proporción de defectos con IC binomial exacto del 95 %. Regla de decisión = cero unidades abiertas, agrietadas o con fuga y ≤ 1 unidad con defecto menor. Atípicos: no aplica; toda unidad excluida se documenta."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Cero cápsulas abiertas, agrietadas, con fuga o separadas.<br>≤ <span class=\"por-confirmar\">1 de 20</span> unidades con defecto menor.<br>100 % de las cápsulas cerradas y con el sello intacto."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de inspección por unidad<br>- Fotografías de defectos<br>- Data cruda y reporte de atributo"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El 1 de 20 es ilustrativo; se confirma contra la especificación y la criticidad de la integridad para el producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; 21 CFR 211.110; USP &lt;701&gt; — Desintegración (como referencia de integridad)."
     }
    ],
    "tabla": null,
    "analisis": "si",
    "familia": "capsulas"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CAP-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CAP-004 — Disolución de cápsulas de liberación modificada",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Caracterizar el perfil de liberación de las cápsulas de liberación modificada del lote PPQ en varios tiempos, para demostrar que cumplen el diseño."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Verificar aparato, medios y tiempos del perfil aprobado (por ejemplo 1, 2, 4 y 8 h)<br>2) Colocar 12 unidades y muestrear en cada tiempo<br>3) Analizar cada muestra por HPLC o UV-Vis<br>4) Calcular el porcentaje acumulado liberado por unidad y la media<br>5) Comparar el perfil contra la especificación y el perfil de referencia"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = porcentaje acumulado liberado; unidad = %. Tipo de dato = continua. n = 12 unidades por tiempo. Estadísticos = media, DE, RSD (%) e IC 95 % por tiempo. Regla de decisión = cada tiempo dentro del intervalo aprobado y RSD ≤ 10 % en los tiempos tempranos. Atípicos: se aplica el criterio de estadios de USP &lt;711&gt;."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Perfil dentro de los intervalos aprobados en cada tiempo: <span class=\"por-confirmar\">1 h, 2 h, 4 h y 8 h</span>.<br>Sin ruptura de la cubierta ni liberación súbita.<br>Tiempo de latencia (lag time) dentro del intervalo aprobado.<br>RSD ≤ 10 % en los tiempos tempranos."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Condiciones del disolutor y curva de calibración<br>- Perfil por unidad y media por tiempo<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los tiempos y los intervalos en rojo se confirman contra la especificación del producto y el estudio de liberación. Aplica solo si el subtipo es liberación modificada."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;711&gt; — Disolución; USP &lt;724&gt; — Drug Release; USP &lt;1092&gt;; ICH Q1A(R2)."
     }
    ],
    "tabla": null,
    "instrumentos": "Disolutor calibrado; HPLC con detector UV o espectrofotómetro UV-Vis calibrado",
    "subtipo": "Liberación modificada",
    "analisis": "si",
    "familia": "capsulas"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-CAP-005",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-CAP-005 — Dimensiones y calibre de la cápsula",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que la cápsula corresponde al calibre aprobado y que su longitud, diámetro y espesor de pared están dentro de la especificación del producto y del proveedor."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Identificar el calibre aprobado [calibre_capsula] y el certificado del proveedor<br>2) Tomar 20 cápsulas al azar del lote PPQ<br>3) Medir longitud total, diámetro del cuerpo y de la tapa, y espesor de pared con calibrador digital, sin deformar la cápsula<br>4) Comparar cada medida contra la especificación y el certificado; calcular media, DE y RSD<br>5) Verificar el cierre y el encaje de tapa y cuerpo; anexar tabla de medidas y certificado"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = longitud, diámetro y espesor de pared; unidad = mm. Tipo de dato = continua. n = 20 cápsulas por lote. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = cada medida dentro de la tolerancia, RSD ≤ 2,0 % y calibre igual al aprobado. Atípicos = Grubbs solo si n ≥ 7; toda exclusión se justifica."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Calibre de la cápsula igual a <span class=\"por-confirmar\">[calibre_capsula]</span>.<br>Longitud y diámetro dentro de <span class=\"por-confirmar\">±5,0 %</span> del nominal.<br>RSD de longitud y diámetro ≤ <span class=\"por-confirmar\">2,0 %</span>.<br>100 % de las cápsulas cerradas y con encaje tapa-cuerpo conforme."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Tabla de medidas por cápsula<br>- Certificado del proveedor y comparación con el calibre<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El calibre y las tolerancias en rojo son propuestas; se confirman con la especificación del producto y el certificado del proveedor. El calibre no se infiere de la longitud."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>Especificación del producto; certificado del proveedor de cápsulas; 21 CFR 211.110; USP &lt;701&gt; — Desintegración (referencia de integridad)."
     }
    ],
    "tabla": null,
    "instrumentos": "Calibrador digital calibrado",
    "analisis": "si",
    "familia": "capsulas"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GRA-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GRA-001 — Fluidez de granulados",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Evaluar la fluidez del granulado del lote PPQ para confirmar que alimenta de forma uniforme la compresora o encapsuladora y no segrega."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Acondicionar la muestra a la humedad del área y determinar densidad aparente y compactada<br>2) Medir el ángulo de reposo con embudo y altura fijos, por triplicado<br>3) Calcular el índice de Carr y el índice de Hausner<br>4) Evaluar segregación visual y homogeneidad de la muestra<br>5) Anexar la tabla de resultados y la verificación de calibración"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = ángulo de reposo, densidad aparente/compactada, índice de Carr y Hausner; unidad = grados, g/mL e índice. Tipo de dato = continua. n = 3 determinaciones por lote. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = ángulo ≤ 30°, Carr ≤ 20 % y Hausner ≤ 1,25. Atípicos = Grubbs solo si n ≥ 7; se repite la determinación y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Ángulo de reposo ≤ <span class=\"por-confirmar\">30°</span>.<br>Índice de Carr ≤ <span class=\"por-confirmar\">20 %</span> e índice de Hausner ≤ <span class=\"por-confirmar\">1,25</span>.<br>Sin segregación visible ni grumos en la muestra."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Tabla de fluidez por determinación<br>- Densidad aparente y compactada<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites de fluidez en rojo son propuestas; se confirman con el desarrollo, el equipo de compresión/encapsulación y el riesgo del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1174&gt; — Powder Flow; 21 CFR 211.110; especificación del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "Analizador de fluidez calibrado; Balanza analítica calibrada",
    "analisis": "si",
    "familia": "granulados"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GRA-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GRA-002 — Tamaño de partícula de granulados",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la distribución de tamaño de partícula del granulado y confirmar que está dentro del intervalo que asegura flujo y compresión reproducibles."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Cuartear la muestra y secarla según el método<br>2) Analizar por tamizado en cascada o difracción láser<br>3) Calcular D10, D50, D90 y el porcentaje retenido en cada tamiz<br>4) Comparar contra el intervalo aprobado y evaluar finos<br>5) Anexar la curva de distribución y la data cruda"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tamaño de partícula; unidad = mm o µm. Tipo de dato = continua. n = 3 determinaciones por lote. Estadísticos = D10, D50, D90, media, DE y RSD. Regla de decisión = D50 dentro del intervalo y finos ≤ 10 %. Atípicos = se repite el análisis; no se descarta la muestra original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>D50 dentro de <span class=\"por-confirmar\">0,25–2,0 mm</span>.<br>Finos (&lt; 0,25 mm) ≤ <span class=\"por-confirmar\">10 %</span>.<br>D90 dentro del intervalo aprobado para el proceso."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Curva de distribución por tamiz<br>- D10/D50/D90 y porcentaje de finos<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El intervalo y el límite de finos en rojo son propuestas; se confirman con el desarrollo del granulado y el equipo de compresión."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;786&gt; — Particle Size Distribution; 21 CFR 211.110; especificación del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "Juego de tamices calibrado; Analizador de partículas calibrado",
    "analisis": "si",
    "familia": "granulados"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-GRA-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-GRA-003 — Dispersibilidad y solubilidad de granulados",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el granulado se dispersa o disuelve en el medio y tiempo especificados, sin grumos ni residuo apreciable, cuando el producto se administra como dispersión o solución."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Pesar la cantidad de granulado equivalente a una dosis y añadirla al volumen de agua especificado<br>2) Agitar a la velocidad y temperatura definidas y medir el tiempo hasta dispersión completa<br>3) Filtrar o tamizar el residuo y pesarlo<br>4) Evaluar visualmente grumos, sedimento y uniformidad de la dispersión<br>5) Anexar el registro y el residuo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tiempo de dispersión y residuo; unidad = min y %. Tipo de dato = continua. n = 3 determinaciones por lote. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = tiempo ≤ 2 min y residuo ≤ 1,0 %. Atípicos = se repite la determinación; se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Tiempo de dispersión ≤ <span class=\"por-confirmar\">2 min</span>.<br>Residuo retenido ≤ <span class=\"por-confirmar\">1,0 %</span>.<br>Sin grumos ni sedimento visible después de agitar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de tiempo y condiciones<br>- Peso del residuo y observación visual<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo y el residuo en rojo son propuestas; se confirman con la forma de administración y la especificación del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.110; especificación del producto; USP &lt;1174&gt; — Powder Flow (referencia de dispersión)."
     }
    ],
    "tabla": null,
    "instrumentos": "Agitador calibrado; Cronómetro calibrado; Balanza analítica calibrada",
    "analisis": "si",
    "familia": "granulados"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-POL-001",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-POL-001 — Fluidez de polvos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Evaluar la fluidez del polvo del lote PPQ para confirmar que se dosifica y mezcla de forma uniforme y no segrega durante el proceso."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Acondicionar la muestra a la humedad del área y determinar densidad aparente y compactada<br>2) Medir el ángulo de reposo con embudo y altura fijos, por triplicado<br>3) Calcular el índice de Carr y el índice de Hausner<br>4) Evaluar la tendencia a la cohesión y la segregación visual<br>5) Anexar la tabla de resultados y la verificación de calibración"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = ángulo de reposo, densidad aparente/compactada, índice de Carr y Hausner; unidad = grados, g/mL e índice. Tipo de dato = continua. n = 3 determinaciones por lote. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = ángulo ≤ 35°, Carr ≤ 25 % y Hausner ≤ 1,35. Atípicos = Grubbs solo si n ≥ 7; se repite la determinación y se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Ángulo de reposo ≤ <span class=\"por-confirmar\">35°</span>.<br>Índice de Carr ≤ <span class=\"por-confirmar\">25 %</span> e índice de Hausner ≤ <span class=\"por-confirmar\">1,35</span>.<br>Sin segregación ni apelmazamiento visible."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Tabla de fluidez por determinación<br>- Densidad aparente y compactada<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>Los límites de fluidez en rojo son propuestas; se confirman con el desarrollo, el sistema de dosificación y el riesgo del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;1174&gt; — Powder Flow; 21 CFR 211.110; especificación del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "Analizador de fluidez calibrado; Balanza analítica calibrada",
    "analisis": "si",
    "familia": "polvos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-POL-002",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-POL-002 — Tamaño de partícula de polvos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar la distribución de tamaño de partícula del polvo y confirmar que cumple el intervalo que asegura mezcla, flujo y reconstitución reproducibles."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Cuartear la muestra y secarla según el método<br>2) Analizar por tamizado en cascada o difracción láser<br>3) Calcular D10, D50, D90 y el porcentaje de finos<br>4) Comparar contra el intervalo aprobado y evaluar el riesgo de segregación<br>5) Anexar la curva de distribución y la data cruda"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tamaño de partícula; unidad = µm. Tipo de dato = continua. n = 3 determinaciones por lote. Estadísticos = D10, D50, D90, media, DE y RSD. Regla de decisión = D90 ≤ 500 µm y finos ≤ 20 %. Atípicos = se repite el análisis; no se descarta la muestra original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>D90 ≤ <span class=\"por-confirmar\">500 µm</span>.<br>Finos (&lt; 50 µm) ≤ <span class=\"por-confirmar\">20 %</span>.<br>D50 dentro del intervalo aprobado para el proceso."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Curva de distribución por tamiz<br>- D10/D50/D90 y porcentaje de finos<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El D90 y el límite de finos en rojo son propuestas; se confirman con el desarrollo del polvo y el sistema de dosificación."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>USP &lt;786&gt; — Particle Size Distribution; 21 CFR 211.110; especificación del producto."
     }
    ],
    "tabla": null,
    "instrumentos": "Juego de tamices calibrado; Analizador de partículas calibrado",
    "analisis": "si",
    "familia": "polvos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-POL-003",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-POL-003 — Dispersibilidad y solubilidad de polvos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el polvo se dispersa o disuelve en el medio y tiempo especificados, sin grumos ni residuo apreciable, cuando el producto se administra como dispersión o solución."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Pesar la cantidad de polvo equivalente a una dosis y añadirla al volumen de agua especificado<br>2) Agitar a la velocidad y temperatura definidas y medir el tiempo hasta dispersión completa<br>3) Filtrar o tamizar el residuo y pesarlo<br>4) Evaluar visualmente grumos, sedimento y uniformidad de la dispersión<br>5) Anexar el registro y el residuo"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tiempo de dispersión y residuo; unidad = min y %. Tipo de dato = continua. n = 3 determinaciones por lote. Estadísticos = media, DE, RSD (%) e IC 95 %. Regla de decisión = tiempo ≤ 3 min y residuo ≤ 1,0 %. Atípicos = se repite la determinación; se conserva el dato original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Tiempo de dispersión ≤ <span class=\"por-confirmar\">3 min</span>.<br>Residuo retenido ≤ <span class=\"por-confirmar\">1,0 %</span>.<br>Sin grumos ni sedimento visible después de agitar."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de tiempo y condiciones<br>- Peso del residuo y observación visual<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo y el residuo en rojo son propuestas; se confirman con la forma de administración y la especificación del producto."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.110; especificación del producto; USP &lt;1174&gt; — Powder Flow (referencia de dispersión)."
     }
    ],
    "tabla": null,
    "instrumentos": "Agitador calibrado; Cronómetro calibrado; Balanza analítica calibrada",
    "analisis": "si",
    "familia": "polvos"
   },
   {
    "kind": "ensayo",
    "id": "PRO-PQ-POL-004",
    "bloque": 3,
    "cond": "ambas",
    "titulo": "PRO-PQ-POL-004 — Tiempo de reconstitución de polvos",
    "secciones": [
     {
      "et": "Objetivo",
      "html": "<strong>Objetivo:</strong><br>Verificar que el polvo para reconstitución se dispersa en el volumen y tiempo especificados y forma una suspensión uniforme, sin grumos ni sedimento persistente."
     },
     {
      "et": "Procedimiento",
      "html": "<strong>Procedimiento:</strong><br>1) Añadir el volumen de agua especificado a la cantidad de polvo de una dosis<br>2) Agitar o invertir según las instrucciones del producto y medir el tiempo hasta reconstitución completa<br>3) Evaluar grumos, espuma, sedimento y uniformidad de la suspensión<br>4) Dejar reposar el tiempo definido y verificar la redispersión<br>5) Anexar el registro y las observaciones"
     },
     {
      "et": "Plan estadístico",
      "html": "<strong>Plan estadístico:</strong><br>Variable = tiempo de reconstitución y uniformidad; unidad = min y pasa/no pasa. Tipo de dato = continua y atributo. n = 3 reconstrucciones por lote. Estadísticos = media, DE, RSD (%) y proporción con IC binomial. Regla de decisión = tiempo ≤ 2 min y suspensión uniforme sin grumos. Atípicos = se repite la reconstitución; se conserva el registro original."
     },
     {
      "et": "Criterio de aceptación",
      "html": "<strong>Criterio de aceptación:</strong><br>Tiempo de reconstitución ≤ <span class=\"por-confirmar\">2 min</span>.<br>Suspensión uniforme, sin grumos ni sedimento persistente.<br>Redispersión completa tras el tiempo de reposo definido."
     },
     {
      "et": "Documentos entregables",
      "html": "<strong>Documentos entregables:</strong><br>- Registro de tiempo y volumen<br>- Observación de grumos, espuma y sedimento<br>- Data cruda y reporte estadístico"
     },
     {
      "et": "Nota",
      "html": "<strong>Nota:</strong><br>El tiempo en rojo es una propuesta; se confirma con las instrucciones de uso, el volumen y la especificación del producto. Aplica solo al subtipo Polvo para reconstitución."
     },
     {
      "et": "Referencia",
      "html": "<strong>Referencia:</strong><br>21 CFR 211.110; especificación del producto; instrucciones de uso aprobadas."
     }
    ],
    "tabla": null,
    "instrumentos": "Cronómetro calibrado; Agitador calibrado",
    "subtipo": "Polvo para reconstitución",
    "analisis": "si",
    "familia": "polvos"
   }
  ]
 }
};
if (typeof module !== "undefined" && module.exports) module.exports = BancoProcesos;
