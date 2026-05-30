Bug crítico: firmaUpdateResetBtn() tiene la lógica invertida — muestra el botón cuando NO hay firmas y lo oculta cuando SÍ hay.
Hard reset: El estado persiste en localStorage pero si el reporte no se descargó, firmaClearState() nunca se llama, dejando el indicador "firmado" sin poder re-firmar.
Archivos múltiples: Al recargar un reporte y descargarlo se acumulan versiones _firmado.html.
Botón de reinicio: Falta lógica clara para resetear cuando el reporte aún no se descargó.
