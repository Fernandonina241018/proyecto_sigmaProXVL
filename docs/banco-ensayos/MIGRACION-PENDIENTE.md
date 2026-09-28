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
