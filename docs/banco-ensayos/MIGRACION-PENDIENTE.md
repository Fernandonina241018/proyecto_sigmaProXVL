# Migración al módulo generador — preguntas guardadas (2026-09-24)

Responder antes de migrar HTML → BD + generador .docx:

1. **Credenciales al generar**: ¿basta la sesión iniciada (nombre + rol automáticos)
   o se exige usuario/clave otra vez al presionar Generar (doble autenticación 21 CFR 11)?
2. **Destino de los .docx**: ¿descarga inmediata, guardado en sistema para firma
   posterior, o ambas (generar → pendiente → flujo de firmas)?
3. **Congelar versión**: al generar, ¿el documento congela la versión del banco usada
   o usa siempre la última?

## Restricciones ya decididas

- Cada protocolo (DQ/IQ/OQ/PQ) = un .docx independiente.
- IDs fijos = claves inmutables; numeración visible solo presentación.
- Filtros (entidad + condición) definen qué ensayos entran a cada documento.
- Marcas dinámicas (.rango / .equipo / .cond / .lista-resumen) se congelan a texto.
- El usuario final NO ve ensayos: elige entidad + protocolos + condición + datos,
  presiona Generar y el sistema arma los documentos.

## Regla de bloques (2026-09-24)

Todo artículo lleva `data-bloque` (1-7). Orden del .docx = bloques 1→7:
1 portada/firmas/responsabilidades/índice · 2 preliminares (compuertas,
instrumentos, sensores, volumen, fuentes) · 3 calificación · 4 resumen ·
5 firmas personal · 6 referencias · 7 historial.
Todo ensayo nuevo debe declarar su bloque al crearse (el índice avisa "SIN BLOQUE").

## Bloques (actualizado)

Orden .docx 1→8: 1 portada/firmas/responsabilidades/índice/alcance/def-USP/nota-datos ·
2 preliminares · 3 calificación · 4 resumen · 5 firmas personal · 6 referencias ·
7 historial · 8 anexos. Rol oficial: Gerente de Área (revisa). Veredicto C/NC/NA.
