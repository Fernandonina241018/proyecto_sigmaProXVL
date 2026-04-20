"""
main.py - Orquestador principal del sistema de ML modular.

Punto de entrada unico. Conecta todos los modulos:
    data_loader -> preprocessor -> trainer -> evaluator -> model_store
"""

from pathlib import Path
import pandas as pd

from config import TRAIN_DEFAULTS
from data_loader import load_data
from evaluator import evaluate, predict
from model_store import save_model
from preprocessor import prepare_data
from trainer import bootstrap_models as run_bootstrap
from trainer import train
from model_manager import ModelManager
from csv_auto_loader import get_available_datasets  # ✨ NUEVO: Carga automática de CSV

# ✨ DEMOS: Interpretability y Anomaly Detection
try:
    from interpretability import explain_predictions
    from anomaly_detector import (
        detect_outliers, data_quality_report, recommend_imbalance_handling,
        detect_prediction_anomalies, print_quality_report
    )
    DEMOS_AVAILABLE = True
except ImportError:
    DEMOS_AVAILABLE = False
    print("  ℹ️  Demos no disponibles (módulos no instalados)")

# ✨ Variable global para mantener el último modelo entrenado
_LAST_MODEL = {"pipeline": None, "meta": None, "splits": None, "predictions": None, "probabilities": None}


_BASE_DATOS = Path(__file__).resolve().parent / "datos"

# ✨ CAMBIO: Ahora se carga dinámicamente en lugar de estar hardcodeado
# Esto permite que nuevos CSV aparezcan automáticamente sin modificar este archivo
def _get_demo_csv_by_fuente():
    """Retorna diccionario de datasets disponibles (dinámico)."""
    return get_available_datasets()


# ═══════════════════════════════════════════════════════════════════════════
# FUNCIONES AUXILIARES PARA DETECCIÓN AUTOMÁTICA (Evita hardcoding)
# ═══════════════════════════════════════════════════════════════════════════

def _get_target_column(df: pd.DataFrame, csv_name: str) -> str:
    """
    Detecta automáticamente la columna target (variable a predecir).
    
    Busca entre nombres comunes en orden de preferencia.
    Si no encuentra, lanza error informativo en lugar de asumir.
    
    Args:
        df: DataFrame con los datos
        csv_name: Nombre del archivo (para mensajes de error)
    
    Returns:
        Nombre de la columna target
    
    Raises:
        ValueError: Si no se encuentra columna target
    """
    # Lista de nombres comunes para target (en orden de preferencia)
    common_targets = ['aprobado', 'resultado', 'target', 'clase', 'label', 
                      'outcome', 'prediccion', 'y']
    
    # Buscar en orden de preferencia
    for target_name in common_targets:
        if target_name in df.columns:
            return target_name
    
    # Si no encuentra ninguno, error informativo
    raise ValueError(
        f"❌ No se encontró columna target en '{csv_name}'.\n"
        f"   Se esperaba una de: {common_targets}\n"
        f"   Columnas disponibles: {list(df.columns)}"
    )


def _detect_id_columns(df: pd.DataFrame) -> list:
    """
    Detecta automáticamente columnas ID para excluir del entrenamiento.
    
    Args:
        df: DataFrame con los datos
    
    Returns:
        Lista de nombres de columnas que parecen ser ID
    """
    id_columns = []
    
    for col in df.columns:
        col_lower = col.lower()
        # Heurística: columnas que contienen 'id' en el nombre
        if 'id' in col_lower:
            id_columns.append(col)
    
    return id_columns


def _generate_prediction_data(df: pd.DataFrame, exclude_cols=None) -> pd.DataFrame:
    """
    Genera datos de predicción basado en las columnas reales del dataset.
    
    Crea un ejemplo con valores cercanos a la media/moda del dataset,
    evitando hardcodear columnas específicas.
    
    Args:
        df: DataFrame con los datos de entrenamiento
        exclude_cols: Columnas a excluir (típicamente target e ID)
    
    Returns:
        DataFrame con un ejemplo para predicción
    """
    import numpy as np
    
    exclude_cols = exclude_cols or []
    
    # Columnas disponibles para predicción
    feature_cols = [c for c in df.columns if c not in exclude_cols]
    
    # Crear ejemplo con valores cercanos a media/moda
    ejemplo = {}
    
    for col in feature_cols:
        try:
            if df[col].dtype in ['int64', 'float64', 'float32', 'int32']:
                # Para numéricos: usar media
                ejemplo[col] = df[col].mean()
            else:
                # Para categóricos: usar moda o primer valor
                moda = df[col].mode()
                ejemplo[col] = moda[0] if len(moda) > 0 else df[col].iloc[0]
        except Exception as e:
            # Si hay error, usar primer valor
            ejemplo[col] = df[col].iloc[0]
    
    return pd.DataFrame([ejemplo])


def run_pipeline(
    source: str = "synthetic",
    source_kwargs: dict = None,
    target: str = "aprobado",
    exclude_cols: list = None,
    model_key: str = "rf",
    problem_type: str = "auto",
    model_kwargs: dict = None,
    test_size: float = None,
    cv_folds: int = None,
    random_state: int = None,
    run_bootstrap_ci: bool = True,
    n_bootstraps: int = None,
    save_path: str = None,
    X_new: pd.DataFrame = None,
    verbose: bool = True,
    auto_save: bool = True,
    dataset_name: str = None,
) -> dict:
    """Ejecuta el pipeline completo de ML.
    
    Nuevo parámetro:
        auto_save       : bool = True    Guardar automáticamente en modelos_guardados/
        dataset_name    : str = None     Nombre del dataset (para registro)
    """

    source_kwargs = source_kwargs or {}
    model_kwargs = model_kwargs or {}
    test_size = test_size or TRAIN_DEFAULTS["test_size"]
    cv_folds = cv_folds or TRAIN_DEFAULTS["cv_folds"]
    random_state = random_state or TRAIN_DEFAULTS["random_state"]
    n_bootstraps = n_bootstraps or TRAIN_DEFAULTS["bootstrap_n"]

    _banner("SISTEMA DE ML MODULAR - INICIO")

    _step(1, "Cargando datos")
    df = load_data(source, **source_kwargs)
    
    # Inferir nombre del dataset si no se proporciona
    if dataset_name is None:
        if source == "csv" and "path" in source_kwargs:
            dataset_name = Path(source_kwargs["path"]).name
        else:
            dataset_name = f"{source}_{target}"

    _step(2, "Analizando y preparando datos")
    X_raw, y, preprocessor, meta = prepare_data(
        df,
        target=target,
        problem_type=problem_type,
        exclude_cols=exclude_cols,
        verbose=verbose,
    )

    _step(3, f"Entrenando modelo [{model_key.upper()}]")
    pipeline, splits, cv_results = train(
        X_raw,
        y,
        preprocessor=preprocessor,
        model_key=model_key,
        problem_type=meta["problem_type"],
        meta=meta,
        test_size=test_size,
        cv_folds=cv_folds,
        random_state=random_state,
        model_kwargs=model_kwargs,
    )

    boot_models = []
    if run_bootstrap_ci:
        _step(4, f"Bootstrap ({n_bootstraps} modelos)")
        boot_models = run_bootstrap(
            splits["X_train"],
            splits["y_train"],
            preprocessor=preprocessor,
            model_key=model_key,
            problem_type=meta["problem_type"],
            meta=meta,
            n_bootstraps=n_bootstraps,
            random_state=random_state,
        )

    _step(5, "Evaluando en datos de test")
    eval_results = evaluate(
        pipeline,
        splits,
        meta,
        bootstrap_models=boot_models,
        X_new=X_new,
    )

    if save_path:
        _step(6, f"Guardando modelo -> {save_path}")
        train_params = dict(
            source=source,
            model_key=model_key,
            problem_type=meta["problem_type"],
            test_size=test_size,
            cv_folds=cv_folds,
            n_bootstraps=n_bootstraps,
        )
        save_model(pipeline, meta, boot_models, train_params, path=save_path)
    
    # Guardado automático en modelos_guardados/ con metadatos completos
    if auto_save:
        _step(6, "Guardando automáticamente en modelos_guardados/")
        manager = ModelManager()
        
        payload = {
            "pipeline": pipeline,
            "meta": meta,
            "bootstrap_models": boot_models,
            "train_params": dict(
                source=source,
                model_key=model_key,
                problem_type=meta["problem_type"],
                test_size=test_size,
                cv_folds=cv_folds,
                n_bootstraps=n_bootstraps,
            ),
            "saved_at": None,  # Se actualiza en save_model
            "version": "1.0",
        }
        
        model_id = manager.save_training(
            payload=payload,
            dataset_name=dataset_name,
            model_key=model_key,
            eval_results=eval_results,
        )

    _banner("PIPELINE COMPLETADO")

    return dict(
        pipeline=pipeline,
        meta=meta,
        splits=splits,
        cv_results=cv_results,
        eval_results=eval_results,
        bootstrap_models=boot_models,
        predictions_new=eval_results.get("predictions_new"),
    )


def interactive_cli(pipeline, meta: dict, bootstrap_models: list = None):
    """CLI interactiva para predicciones manuales post-entrenamiento."""
    num_feats = meta["num_features"]
    cat_feats = meta["cat_features"]
    all_feats = num_feats + cat_feats

    print("\n" + "=" * 62)
    print("  MODO INTERACTIVO - PREDICCION MANUAL")
    print(f"  Features: {all_feats}")
    print("  Escribe 'salir' para terminar")
    print("=" * 62)

    historial = []

    while True:
        print()
        valores = {}

        try:
            for feat in num_feats:
                val = input(f"  {feat} (numerico): ").strip().lower()
                if val == "salir":
                    raise StopIteration
                valores[feat] = float(val)

            for feat in cat_feats:
                val = input(f"  {feat} (texto): ").strip().lower()
                if val == "salir":
                    raise StopIteration
                valores[feat] = val

        except StopIteration:
            break
        except ValueError:
            print("  Valor invalido. Intenta de nuevo.")
            continue

        X_new = pd.DataFrame([valores])
        result_df = predict(pipeline, X_new, meta, bootstrap_models)

        print("\n  " + "-" * 30)
        _print_prediction_report(X_new, result_df, meta, header="Resultado de la prediccion")

        historial.append(valores | result_df.to_dict(orient="records")[0])

    if historial:
        print(f"\n  Resumen: {len(historial)} predicciones realizadas.")
        print(pd.DataFrame(historial).to_string(index=False))

    print("\n  Hasta luego!")


def _banner(msg: str):
    sep = "=" * 62
    print(f"\n{sep}\n  {msg}\n{sep}")


def _step(n: int, msg: str):
    print(f"\n  [{n}] {msg}...")


def _print_prediction_report(X_input: pd.DataFrame, preds: pd.DataFrame,
                             meta: dict, header: str = "Resumen de predicciones"):
    """Imprime predicciones en un formato explicativo y facil de leer."""
    print(f"  {header}")

    problem = meta["problem_type"]
    merged = pd.concat(
        [X_input.reset_index(drop=True), preds.reset_index(drop=True)],
        axis=1,
    )

    for idx, row in merged.iterrows():
        print(f"\n  Caso {idx + 1}")
        print(f"  Datos      : {_format_input_row(row, X_input.columns)}")

        if problem == "regression":
            print(f"  Prediccion : {row['prediccion']:.4f}")
            if "explicacion" in merged.columns:
                print(f"  Resumen    : {row['explicacion']}")
            continue

        etiqueta = row.get("prediccion_legible", row.get("clase_predicha", "N/D"))
        print(f"  Prediccion : {etiqueta}")

        if "probabilidad_predicha" in merged.columns:
            print(
                f"  Confianza  : {row['nivel_confianza']} "
                f"({row['probabilidad_predicha']:.1%})"
            )

        if "clase_alternativa_legible" in merged.columns:
            print(
                f"  Alternativa: {row['clase_alternativa_legible']} "
                f"({row['probabilidad_alternativa']:.1%})"
            )
        elif "segunda_clase_legible" in merged.columns:
            print(
                f"  Segunda op.: {row['segunda_clase_legible']} "
                f"({row['probabilidad_segunda_clase']:.1%})"
            )

        if "explicacion" in merged.columns:
            print(f"  Resumen    : {row['explicacion']}")

        if "factores_a_favor" in merged.columns:
            print(f"  A favor    : {row['factores_a_favor']}")

        if "factores_en_contra" in merged.columns:
            print(f"  En contra  : {row['factores_en_contra']}")


def _format_input_row(row: pd.Series, columns) -> str:
    """Convierte una fila de entrada a texto breve."""
    return ", ".join(f"{col}={row[col]}" for col in columns)


# ═══════════════════════════════════════════════════════════════════════════════════
# FUNCIONES WRAPPER PARA DEMOS (Interpretability + Anomaly Detection)
# ═══════════════════════════════════════════════════════════════════════════════════

def run_interpretability_demo(resultado: dict):
    """Ejecuta demo de interpretability usando el modelo entrenado actual."""
    if not DEMOS_AVAILABLE:
        print("  ❌ Módulo interpretability no disponible.")
        return
    
    pipeline = resultado.get("pipeline")
    splits = resultado.get("splits")
    
    if pipeline is None or splits is None:
        print("  ❌ No hay modelo entrenado disponible.")
        return
    
    X_train = splits.get("X_train")
    if X_train is None:
        print("  ❌ No hay datos de entrenamiento disponibles.")
        return
    
    print("\n" + "=" * 62)
    print("  🎯 DEMO: INTERPRETABILIDAD (SHAP + Partial Dependence)")
    print("=" * 62)
    print("\n  Este demo muestra:")
    print("    1) SHAP values (importancia de features)")
    print("    2) Partial Dependence Plots")
    print("    3) Feature interactions")
    print("")
    
    X_sample = X_train.iloc[:min(20, len(X_train))]
    
    try:
        print("  Calculando SHAP values...")
        explain_predictions(pipeline, X_train=X_train, X_new=X_sample, verbose=True)
        print("\n  ✅ Demo de interpretability completado")
    except Exception as e:
        print(f"\n  ⚠️  Error: {e}")
        print("     Asegúrate de tener SHAP instalado: pip install shap")


def run_anomaly_demo(resultado: dict):
    """Ejecuta demo de anomaly detection usando el modelo y datos actuales."""
    if not DEMOS_AVAILABLE:
        print("  ❌ Módulo anomaly_detector no disponible.")
        return
    
    splits = resultado.get("splits")
    
    if splits is None:
        print("  ❌ No hay datos disponibles. Entrena un modelo primero.")
        return
    
    X_train = splits.get("X_train")
    X_test = splits.get("X_test")
    y_train = splits.get("y_train")
    y_test = splits.get("y_test")
    
    if X_train is None or y_train is None:
        print("  ❌ Datos de entrenamiento no disponibles.")
        return
    
    print("\n" + "=" * 62)
    print("  🚨 DEMO: ANOMALY DETECTOR")
    print("=" * 62)
    print("\n  Este demo muestra:")
    print("    1) Data Quality Report")
    print("    2) Outlier Detection")
    print("    3) Class Imbalance Analysis")
    print("    4) Prediction Anomalies")
    print("")
    
    # 1. Data Quality Report
    print("\n📊 [1/4] Data Quality Report...")
    try:
        report = data_quality_report(X_train, y_train)
        print_quality_report(report)
    except Exception as e:
        print(f"  ⚠️  Error: {e}")
    
    # 2. Outlier Detection
    print("\n📊 [2/4] Outlier Detection...")
    try:
        outliers = detect_outliers(X_train, method="isolation_forest", verbose=True)
        print(f"  Outliers encontrados: {outliers.get('outlier_count', 0)}")
    except Exception as e:
        print(f"  ⚠️  Error: {e}")
    
    # 3. Class Imbalance
    print("\n📊 [3/4] Class Imbalance Analysis...")
    try:
        imbalance = recommend_imbalance_handling(y_train)
        print(f"  Imbalance ratio: {imbalance.get('imbalance_ratio', 'N/D'):.2f}")
        print(f"  Clase minoritaria: {imbalance.get('minority_class', 'N/D')}")
    except Exception as e:
        print(f"  ⚠️  Error: {e}")
    
    # 4. Prediction Anomalies (si hay predicciones nuevas)
    print("\n📊 [4/4] Prediction Anomalies...")
    if resultado.get("predictions") is not None and X_test is not None:
        try:
            y_pred = resultado.get("predictions")
            y_proba = resultado.get("probabilities")
            if y_proba is not None:
                anomalies = detect_prediction_anomalies(y_test, y_pred, y_proba, confidence_threshold=0.7)
                print(f"  Casos anomalos: {anomalies.get('anomaly_count', 0)}")
        except Exception as e:
            print(f"  ⚠️  Error: {e}")
    else:
        print("  ℹ️  No hay predicciones nuevas para analizar.")
    
    print("\n  ✅ Demo de anomaly detector completado")


def _update_last_model(resultado: dict):
    """Actualiza la variable global _LAST_MODEL con el resultado actual."""
    global _LAST_MODEL
    _LAST_MODEL = {
        "pipeline": resultado.get("pipeline"),
        "meta": resultado.get("meta"),
        "splits": resultado.get("splits"),
        "predictions": resultado.get("predictions_new"),
        "probabilities": resultado.get("probabilities_new"),
    }


if __name__ == "__main__":
    manager = ModelManager()
    
    # Menú principal
    while True:
        print("\n" + "=" * 62)
        print("  SISTEMA ML MODULAR - MENÚ PRINCIPAL")
        print("=" * 62)
        print("\n  Opciones:\n")
        print("    1) Entrenar NUEVO modelo")
        print("    2) Cargar modelo EXISTENTE")
        print("    3) Ver historial de modelos")
        print("    4) Eliminar un modelo")
        if DEMOS_AVAILABLE:
            print("    5) Demo INTERPRETABILIDAD (SHAP)")
            print("    6) Demo ANOMALY DETECTOR")
        print("    0) Salir")
        print("")
        
        opciones_disponibles = "0-4" if not DEMOS_AVAILABLE else "0-6"
        opcion = input(f"  Selección ({opciones_disponibles}): ").strip()
        
        # ════════════════════════════════════════════════════════════════
        # OPCIÓN 0: SALIR
        # ════════════════════════════════════════════════════════════════
        if opcion == "0":
            print("\n  ¡Hasta luego!")
            break
        
        # ════════════════════════════════════════════════════════════════
        # OPCIÓN 3: VER HISTORIAL
        # ════════════════════════════════════════════════════════════════
        elif opcion == "3":
            manager.print_models_table()
            input("  Presiona Enter para continuar...")
            continue
        
        # ════════════════════════════════════════════════════════════════
        # OPCIÓN 4: ELIMINAR MODELO
        # ════════════════════════════════════════════════════════════════
        elif opcion == "4":
            models = manager.list_models()
            if not models:
                print("\n  No hay modelos para eliminar.")
                input("  Presiona Enter para continuar...")
                continue
            
            manager.print_models_table(models)
            model_id = input("  Ingresa el ID del modelo a eliminar (ej: modelo_001): ").strip()
            
            if model_id and manager.delete_model(model_id):
                input("  Presiona Enter para continuar...")
            continue
        
        # ════════════════════════════════════════════════════════════════
        # OPCIÓN 2: CARGAR MODELO EXISTENTE
        # ════════════════════════════════════════════════════════════════
        elif opcion == "2":
            resultado = manager.interactive_menu()
            
            if resultado is None:
                continue
            
            # Modelo cargado exitosamente
            print("\n  ¿Qué deseas hacer?\n")
            print("    1) Hacer predicciones en nuevos datos")
            print("    2) Volver al menú principal")
            print("")
            
            accion = input("  Selección (1-2): ").strip()
            
            if accion == "1":
                # Predicciones con el modelo cargado
                pipeline = resultado['pipeline']
                meta = resultado['meta']
                boot_models = resultado.get('bootstrap_models', [])
                
                print("\n  Ingresa datos para predicción (escribe 'salir' para terminar)")
                interactive_cli(pipeline, meta, boot_models)
            
            continue
        
        # ════════════════════════════════════════════════════════════════
        # OPCIÓN 1: ENTRENAR NUEVO MODELO
        # ════════════════════════════════════════════════════════════════
        elif opcion == "1":
            print("\n" + "=" * 62)
            print("  ENTRENAR NUEVO MODELO - SELECCIONAR FUENTE DE DATOS")
            print("=" * 62)
            print("\n  Elige una fuente de datos:\n")
            
            demo_datasets = _get_demo_csv_by_fuente()
            for i, fuente in enumerate(demo_datasets.keys(), 1):
                archivo = demo_datasets[fuente].name
                print(f"    {i}) {fuente:<15} -> {archivo}")
            
            print("    0) Volver")
            print("")
            
            while True:
                try:
                    opcion_fuente = input("  Opción: ").strip()
                    
                    if opcion_fuente == "0":
                        fuente_elegida = None
                        break
                    
                    opciones = list(demo_datasets.keys())
                    idx = int(opcion_fuente) - 1
                    
                    if 0 <= idx < len(opciones):
                        fuente_elegida = opciones[idx]
                        break
                    
                    print("  Opción inválida. Intenta de nuevo.")
                except ValueError:
                    print("  Ingresa un número.")
            
            if fuente_elegida is None:
                continue
            
            demo_csv = demo_datasets[fuente_elegida]
            if not demo_csv.is_file():
                print(f"  ✗ No se encontró el CSV: {demo_csv}")
                input("  Presiona Enter para continuar...")
                continue
            
            print(f"\n  Fuente seleccionada: '{fuente_elegida}' -> {demo_csv}\n")
            
            # ═══════════════════════════════════════════════════════════════
            # VALIDACIÓN AUTOMÁTICA DEL DATASET
            # ═══════════════════════════════════════════════════════════════
            try:
                # Cargar temporalmente para inspeccionar
                df_temp = pd.read_csv(demo_csv)
                
                # Detectar target automáticamente
                target = _get_target_column(df_temp, demo_csv.name)
                
                # Detectar columnas ID automáticamente
                exclude_cols = _detect_id_columns(df_temp)
                
                # Informar al usuario
                print(f"  ℹ️  Target automático: '{target}'")
                if exclude_cols:
                    print(f"  ℹ️  Excluyendo columnas ID: {exclude_cols}")
                print()
                
            except ValueError as e:
                print(f"  {e}")
                input("  Presiona Enter para continuar...")
                continue
            except Exception as e:
                print(f"  ❌ Error al inspeccionar dataset: {e}")
                input("  Presiona Enter para continuar...")
                continue
            
            # ─────────────────────────────────────────────────────────────
            # ENTRENAMIENTO (Dinámico)
            # ─────────────────────────────────────────────────────────────
            resultado = run_pipeline(
                source="csv",
                source_kwargs={"path": str(demo_csv)},
                target=target,  # ✨ Dinámico
                exclude_cols=exclude_cols,  # ✨ Dinámico
                model_key="rf",
                problem_type="auto",
                run_bootstrap_ci=True,
                n_bootstraps=80,
                auto_save=True,
                dataset_name=demo_csv.name,
            )
            
            # ✨ ACTUALIZAR MODELO ACTUAL PARA DEMOS
            _update_last_model(resultado)
            
            # ─────────────────────────────────────────────────────────────
            # PREDICCIONES EN NUEVOS DATOS (Dinámico)
            # ─────────────────────────────────────────────────────────────
            try:
                # Generar datos de predicción dinámicamente
                nuevos = _generate_prediction_data(df_temp, exclude_cols=[target] + exclude_cols)
                print(f"\n  Predicciones para {len(nuevos)} instancia(s) nuevo(a/s):")
                
            except Exception as e:
                print(f"  ⚠️  No se pudo generar datos de predicción: {e}")
                nuevos = None
            
            if nuevos is not None:
                preds = predict(
                    resultado["pipeline"],
                    nuevos,
                    resultado["meta"],
                    resultado["bootstrap_models"],
                )
                _print_prediction_report(nuevos, preds, resultado["meta"])
            
            respuesta = input("\n  ¿Iniciar modo interactivo de predicción? (s/n): ").strip().lower()
            if respuesta == "s":
                interactive_cli(
                    resultado["pipeline"],
                    resultado["meta"],
                    resultado["bootstrap_models"],
                )
            
            # ✨ PREGUNTA DESPUÉS DE ENTRENAR: Ver demos?
            if DEMOS_AVAILABLE:
                print("\n" + "=" * 62)
                print("  🎯 ¿QUIERES VER LAS DEMOS?")
                print("=" * 62)
                print("    1) Ver interpretability (SHAP + Partial Dependence)")
                print("    2) Ver anomaly detector (outliers + quality)")
                print("    3) Volver al menú principal")
                print("")
                
                respuesta_demo = input("  Selección (1-3): ").strip()
                
                if respuesta_demo == "1":
                    _update_last_model(resultado)
                    run_interpretability_demo(resultado)
                    input("\n  Presiona Enter para continuar...")
                elif respuesta_demo == "2":
                    _update_last_model(resultado)
                    run_anomaly_demo(resultado)
                    input("\n  Presiona Enter para continuar...")
            
            input("\n  Presiona Enter para volver al menú principal...")
        
        # ════════════════════════════════════════════════════════════════
        # OPCIÓN 5: DEMO INTERPRETABILIDAD
        # ════════════════════════════════════════════════════════════════
        elif opcion == "5" and DEMOS_AVAILABLE:
            if _LAST_MODEL["pipeline"] is None or _LAST_MODEL["splits"] is None:
                print("\n  ❌ No hay modelo entrenado.")
                print("  ℹ️  Entrena un modelo primero (opción 1).")
            else:
                run_interpretability_demo(_LAST_MODEL)
            input("  Presiona Enter para continuar...")
        
        # ════════════════════════════════════════════════════════════════
        # OPCIÓN 6: DEMO ANOMALY DETECTOR
        # ════════════════════════════════════════════════════════════════
        elif opcion == "6" and DEMOS_AVAILABLE:
            if _LAST_MODEL["splits"] is None:
                print("\n  ❌ No hay datos disponibles.")
                print("  ℹ️  Entrena un modelo primero (opción 1).")
            else:
                run_anomaly_demo(_LAST_MODEL)
            input("  Presiona Enter para continuar...")
        
        else:
            print("  Opción inválida. Intenta de nuevo.")

