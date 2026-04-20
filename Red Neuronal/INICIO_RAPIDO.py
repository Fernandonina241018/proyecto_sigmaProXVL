#!/usr/bin/env python3
"""
INICIO RÁPIDO - Sistema de Persistencia de Modelos ML
════════════════════════════════════════════════════════

Este archivo te guía en los primeros pasos para usar el nuevo sistema.
"""

import sys
from pathlib import Path

def print_header(title):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def print_step(num, title):
    print(f"\n  [{num}] {title}")
    print("  " + "-" * 66)


def main():
    print_header("SISTEMA ML - GUÍA DE INICIO RÁPIDO")
    
    print("""
  ¡Bienvenido! Tu sistema de Machine Learning ahora tiene 
  persistencia automática de modelos entrenados.
  
  Esto significa que los modelos que entrenes se guardan automáticamente
  y puedes acceder a ellos en futuras sesiones sin necesidad de reentrenar.
    """)
    
    print_header("QUÉ ES NUEVO")
    
    print("""
  ✨ Nuevo menú interactivo con 4 opciones:
  
     1) Entrenar NUEVO modelo
        • Selecciona un dataset
        • Entrena automáticamente
        • Se guarda en modelos_guardados/
        • Haz predicciones inmediatas
     
     2) Cargar modelo EXISTENTE
        • Ver todos tus entrenamientos anteriores
        • Cargar uno por su ID
        • Hacer predicciones con él
     
     3) Ver historial de modelos
        • Tabla con todos los entrenamientos
        • Información: fecha, algoritmo, métricas
     
     4) Eliminar un modelo
        • Liberar espacio en disco
        • Remover entrenamientos antiguos
    """)
    
    print_header("CÓMO EMPEZAR")
    
    print_step(1, "Abre terminal en esta carpeta")
    print("""
  $ cd /mnt/g/My\\ Drive/SigmaProWeb/proyecto_sigmaProXVL/Red\\ Neuronal
  $ pwd  # Verifica que estés en el lugar correcto
    """)
    
    print_step(2, "Ejecuta el programa principal")
    print("""
  $ python main.py
  
  Se abrirá el menú interactivo automáticamente.
    """)
    
    print_step(3, "Primera ejecución: Entrena un modelo")
    print("""
  Selecciona opción 1:
  
  1) Entrenar NUEVO modelo
  > 1
  
  Elige un dataset de ejemplo:
  
  1) temporal
  2) alternativo
  3) financiero
  4) texto
  > 1
  
  El sistema:
  ✓ Cargará los datos
  ✓ Detectará automáticamente el tipo de problema
  ✓ Entrenará un modelo Random Forest
  ✓ Lo guardará en modelos_guardados/ con ID: modelo_001
  ✓ Mostrará métricas de desempeño
  ✓ Ofrecerá modo interactivo para predicciones
    """)
    
    print_step(4, "Segunda ejecución: Carga el modelo")
    print("""
  Ejecuta nuevamente:
  $ python main.py
  
  Selecciona opción 2:
  
  2) Cargar modelo EXISTENTE
  > 2
  
  Verás una tabla con tus entrenamientos:
  
  #    ID           Algoritmo   Problema    Dataset    Fecha         Métricas
  ─────────────────────────────────────────────────────────────────────────────
  1    modelo_001   rf          binary      temporal   2024-04-18    Acc: 0.847
  
  Ingresa: modelo_001
  
  El modelo se cargará y podrás hacer predicciones nuevamente
  ✓ Sin reentrenar
  ✓ Con los mismos parámetros
  ✓ Con acceso a métricas e información
    """)
    
    print_header("ESTRUCTURA DE ARCHIVOS")
    
    print("""
  Después de entrenar, tu carpeta lucirá así:
  
  Red Neuronal/
  ├── main.py                   (Programa principal - ya mejorado)
  ├── model_manager.py          (Nuevo gestor de modelos)
  ├── data_loader.py
  ├── preprocessor.py
  ├── trainer.py
  ├── evaluator.py
  ├── model_store.py
  ├── config.py
  │
  ├── modelos_guardados/        (Nueva carpeta - se crea automáticamente)
  │   ├── modelo_registro.json  (Registro central)
  │   ├── modelo_001_rf_temporal_20240418_143022.pkl
  │   ├── modelo_002_xgb_financiero_20240418_144015.pkl
  │   └── ...
  │
  ├── datos/
  │   ├── entrenamiento_temporal.csv
  │   ├── entrenamiento_alternativo.csv
  │   ├── entrenamiento_financiero.csv
  │   └── entrenamiento_texto.csv
  │
  ├── PERSISTENCIA_MODELOS.md   (Documentación detallada)
  ├── RESUMEN_IMPLEMENTACION.py (Resumen técnico)
  └── test_model_persistence.py (Script de prueba)
    """)
    
    print_header("INFORMACIÓN GUARDADA POR MODELO")
    
    print("""
  Cada modelo registra automáticamente:
  
  ✓ ID único               : modelo_001
  ✓ Algoritmo              : rf, xgb, mlp, logistic, linear
  ✓ Dataset usado          : entrenamiento_temporal.csv
  ✓ Tipo de problema       : binary, multiclass, regression
  ✓ Fecha y hora           : 2024-04-18 14:30:22
  ✓ Tamaño de archivo      : 15.42 MB
  ✓ Métricas de desempeño  : Accuracy, F1-Score, AUC-ROC, etc.
  ✓ Parámetros de entrada  : test_size, cv_folds, n_bootstraps
  ✓ Columna objetivo       : aprobado, resultado, etc.
  ✓ Características        : 6 numéricas, 0 categóricas
  
  Todo registrado en modelo_registro.json para consulta rápida.
    """)
    
    print_header("CASOS DE USO")
    
    print("""
  Caso 1: Experimentos
  ────────────────────
  Entrenas múltiples modelos (RF, XGBoost, MLP) y guardas cada uno.
  Después, selecciona el mejor según las métricas mostradas.
  
  
  Caso 2: Reutilización
  ─────────────────────
  Entrenaste un modelo hace 2 semanas. Ahora necesitas hacer nuevas
  predicciones. Simplemente cargas el modelo sin reentrenar.
  
  
  Caso 3: Integración
  ───────────────────
  Desde otro módulo de tu proyecto, cargas un modelo guardado:
  
  from model_manager import ModelManager
  
  manager = ModelManager()
  modelos = manager.list_models()
  payload = manager.load_model(modelos[0]['id'])
  
  # Usar pipeline, meta, bootstrap_models...
  
  
  Caso 4: Auditoría
  ────────────────
  Ver historial completo de entrenamientos:
  opción 3 en el menú.
  Tabla con todos los modelos, fechas y métricas.
    """)
    
    print_header("DOCUMENTACIÓN")
    
    print("""
  Para más información, consulta:
  
  📖 PERSISTENCIA_MODELOS.md
     • Guía completa de uso
     • API de ModelManager
     • Ejemplos de código
     • Preguntas frecuentes
  
  📋 RESUMEN_IMPLEMENTACION.py
     • Resumen técnico
     • Cambios implementados
     • Detalles de código
  
  🧪 test_model_persistence.py
     • Script de prueba
     • Validar funcionamiento
     • Ejemplos de uso
    """)
    
    print_header("PRIMEROS PASOS")
    
    print("""
  1. Ejecuta el programa:
     $ python main.py
  
  2. Elige opción 1 (Entrenar)
  
  3. Elige un dataset (ej: temporal)
  
  4. Espera a que termine el entrenamiento
  
  5. Haz predicciones en modo interactivo (cuando te lo pida)
  
  6. Cierra el programa (escribe 'salir')
  
  7. Ejecuta nuevamente: python main.py
  
  8. Elige opción 2 (Cargar modelo)
  
  9. Verás tu modelo anterior guardado
  
  10. ¡Éxito! El sistema funciona correctamente
    """)
    
    print_header("SOLUCIÓN DE PROBLEMAS")
    
    print("""
  ❌ No veo la carpeta modelos_guardados
  ✓ Se crea automáticamente al entrenar el primer modelo
  
  ❌ El modelo no se guardó
  ✓ Verifica que auto_save=True en main.py
  ✓ Revisa permisos de carpeta
  
  ❌ No puedo cargar un modelo
  ✓ Asegúrate de escribir el ID correcto (ej: modelo_001)
  ✓ Verifica que el archivo .pkl exista en modelos_guardados/
  
  ❌ Quiero eliminar todos los modelos
  ✓ Opción 4 en el menú, elimina uno a uno
  ✓ O elimina manualmente carpeta modelos_guardados/
  
  ❌ Error de ImportError en model_manager.py
  ✓ Verifica que estés en la carpeta correcta
  ✓ Revisa que main.py esté en el mismo directorio
    """)
    
    print_header("¡LISTO PARA EMPEZAR!")
    
    print("""
  El sistema está completamente funcional.
  
  Solo necesitas ejecutar:
  
    $ python main.py
  
  y seguir el menú interactivo.
  
  ¡Que disfrutes usando el sistema de ML con persistencia de modelos!
    """)
    
    print()


if __name__ == "__main__":
    main()
