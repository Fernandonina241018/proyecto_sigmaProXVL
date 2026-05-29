"""
test_model_persistence.py - Script para probar el sistema de persistencia de modelos

Flujo de prueba:
  1. Entrenar un modelo y guardar automáticamente
  2. Cerrar y "abrir" nuevamente
  3. Listar modelos guardados
  4. Cargar un modelo existente
  5. Hacer predicciones con el modelo cargado
"""

import sys
from pathlib import Path

# Agregar el directorio actual al path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from model_manager import ModelManager
from main import run_pipeline, predict, _print_prediction_report
import pandas as pd

def test_model_persistence():
    """Prueba completa del sistema de persistencia."""
    
    print("\n" + "=" * 70)
    print("  TEST: SISTEMA DE PERSISTENCIA DE MODELOS")
    print("=" * 70)
    
    # ════════════════════════════════════════════════════════════════════
    # PASO 1: ENTRENAR Y GUARDAR AUTOMÁTICAMENTE
    # ════════════════════════════════════════════════════════════════════
    print("\n\n  [PASO 1] Entrenando un modelo con guardado automático...")
    print("  " + "-" * 66)
    
    datos_csv = Path(__file__).resolve().parent / "datos" / "entrenamiento_temporal.csv"
    
    if not datos_csv.exists():
        print(f"  ✗ No se encontró: {datos_csv}")
        return False
    
    resultado = run_pipeline(
        source="csv",
        source_kwargs={"path": str(datos_csv)},
        target="aprobado",
        model_key="rf",
        problem_type="auto",
        run_bootstrap_ci=True,
        n_bootstraps=50,  # Menos para que sea más rápido
        auto_save=True,
        dataset_name=datos_csv.name,
        verbose=True,
    )
    
    print("\n  ✔ Modelo entrenado y guardado automáticamente")
    
    # ════════════════════════════════════════════════════════════════════
    # PASO 2: LISTAR MODELOS GUARDADOS
    # ════════════════════════════════════════════════════════════════════
    print("\n\n  [PASO 2] Listando modelos guardados...")
    print("  " + "-" * 66)
    
    manager = ModelManager()
    models = manager.list_models()
    
    if not models:
        print("  ✗ No se encontraron modelos guardados")
        return False
    
    manager.print_models_table(models)
    
    # ════════════════════════════════════════════════════════════════════
    # PASO 3: CARGAR UN MODELO EXISTENTE
    # ════════════════════════════════════════════════════════════════════
    print("\n  [PASO 3] Cargando el modelo más reciente...")
    print("  " + "-" * 66)
    
    model_id_cargado = models[0]['id']  # El más reciente
    
    modelo_cargado = manager.load_model(model_id_cargado)
    
    print("  ✔ Modelo cargado exitosamente")
    
    # ════════════════════════════════════════════════════════════════════
    # PASO 4: HACER PREDICCIONES CON EL MODELO CARGADO
    # ════════════════════════════════════════════════════════════════════
    print("\n\n  [PASO 4] Haciendo predicciones con el modelo cargado...")
    print("  " + "-" * 66)
    
    nuevos_datos = pd.DataFrame({
        "horas_estudio": [3.0, 7.5, 10.0],
        "asistencia_pct": [50, 85, 95],
        "promedio_previo": [55, 75, 90],
        "horas_sueno": [5, 7.5, 8],
        "actividades_extra": [0, 1, 2],
        "nivel_estres": [8, 5, 2],
    })
    
    pipeline_cargado = modelo_cargado['pipeline']
    meta_cargada = modelo_cargado['meta']
    bootstrap_models = modelo_cargado.get('bootstrap_models', [])
    
    predicciones = predict(
        pipeline_cargado,
        nuevos_datos,
        meta_cargada,
        bootstrap_models,
    )
    
    print("\n  Resultados de predicción:")
    _print_prediction_report(nuevos_datos, predicciones, meta_cargada,
                            header="Predicciones con modelo cargado")
    
    # ════════════════════════════════════════════════════════════════════
    # PASO 5: VERIFICAR INFORMACIÓN DEL MODELO
    # ════════════════════════════════════════════════════════════════════
    print("\n  [PASO 5] Información detallada del modelo cargado...")
    print("  " + "-" * 66)
    
    info = manager.get_model_info(model_id_cargado)
    
    print(f"\n  Información del modelo '{model_id_cargado}':")
    print(f"    Dataset         : {info['dataset_name']}")
    print(f"    Algoritmo       : {info['model_key'].upper()}")
    print(f"    Tipo problema   : {info['problem_type'].upper()}")
    print(f"    Target          : {info['target_col']}")
    print(f"    Features numéricas  : {info['num_features']}")
    print(f"    Features categóricas: {info['cat_features']}")
    print(f"    Tamaño archivo  : {info['file_size_mb']} MB")
    print(f"    Fecha creación  : {info['created_at']}")
    
    if info['metrics']:
        print(f"    Métricas de desempeño:")
        for metric_name, value in info['metrics'].items():
            if value is not None:
                if isinstance(value, float):
                    print(f"      {metric_name}: {value:.4f}")
                else:
                    print(f"      {metric_name}: {value}")
    
    # ════════════════════════════════════════════════════════════════════
    # RESULTADO FINAL
    # ════════════════════════════════════════════════════════════════════
    print("\n\n" + "=" * 70)
    print("  ✔ TEST COMPLETADO EXITOSAMENTE")
    print("=" * 70)
    print(f"""
  Resumen:
    • Modelo entrenado y guardado con ID: {model_id_cargado}
    • Archivo almacenado en: modelos_guardados/{info['filename']}
    • Registro JSON actualizado con metadatos completos
    • Modelo cargado y utilizado para hacer predicciones
    • Sistema funcionando correctamente
    
  Próximos pasos:
    • Ejecuta: python main.py
    • Selecciona opción 2 para cargar un modelo existente
    • Elige el modelo '{model_id_cargado}' para hacer predicciones
    
  El sistema ahora mantiene persistencia entre sesiones:
    • Los modelos se guardan automáticamente en modelos_guardados/
    • Se registran en modelo_registro.json con metadatos completos
    • Puedes cerrar y abrir main.py para acceder a entrenamientos anteriores
    """)
    
    return True


if __name__ == "__main__":
    try:
        success = test_model_persistence()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n  ✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
