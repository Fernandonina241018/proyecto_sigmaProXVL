// Generado por scripts/extraer-banco.mjs procesos — NO EDITAR A MANO.
// Fuente: docs/banco-ensayos/procesos/pq-comun.html + docs/banco-ensayos/procesos/pq-solidos.html + docs/banco-ensayos/procesos/pq-comprimidos.html (versión: PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1).
var BancoProcesos = {
 "version": "PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1 + PRO-PQ 2026-11-20 v1",
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
      "html": "<strong>Nota:</strong><br>El AV y el intervalo se confirman contra USP &lt;905&gt; y la monografía; la elección entre peso y contenido depende de la dosis y del producto."
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
      "html": "<strong>Criterio de aceptación:</strong><br>Liberación media ≥ <span class=\"por-confirmar\">80 %</span> en <span class=\"por-confirmar\">30 min</span>.<br>Ninguna unidad &lt; Q − 15 % en el primer estadio.<br>Condiciones de aparato y medio según la monografía."
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
   }
  ]
 }
};
if (typeof module !== "undefined" && module.exports) module.exports = BancoProcesos;
