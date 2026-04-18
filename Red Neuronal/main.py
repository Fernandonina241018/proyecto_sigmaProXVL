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


_BASE_DATOS = Path(__file__).resolve().parent / "datos"
DEMO_CSV_BY_FUENTE = {
    "temporal": _BASE_DATOS / "entrenamiento_temporal.csv",
    "alternativo": _BASE_DATOS / "entrenamiento_patron_alternativo.csv",
    "financiero": _BASE_DATOS / "entrenamiento_financiero.csv",
    "texto": _BASE_DATOS / "entrenamiento_texto.csv",
}


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
) -> dict:
    """Ejecuta el pipeline completo de ML."""

    source_kwargs = source_kwargs or {}
    model_kwargs = model_kwargs or {}
    test_size = test_size or TRAIN_DEFAULTS["test_size"]
    cv_folds = cv_folds or TRAIN_DEFAULTS["cv_folds"]
    random_state = random_state or TRAIN_DEFAULTS["random_state"]
    n_bootstraps = n_bootstraps or TRAIN_DEFAULTS["bootstrap_n"]

    _banner("SISTEMA DE ML MODULAR - INICIO")

    _step(1, "Cargando datos")
    df = load_data(source, **source_kwargs)

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


def _format_input_row(row: pd.Series, columns) -> str:
    """Convierte una fila de entrada a texto breve."""
    return ", ".join(f"{col}={row[col]}" for col in columns)


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  pipeline ML - SELECCION DE FUENTE DE DATOS")
    print("=" * 60)
    print("\n  Elige una fuente de datos:\n")

    for i, fuente in enumerate(DEMO_CSV_BY_FUENTE.keys(), 1):
        archivo = DEMO_CSV_BY_FUENTE[fuente].name
        print(f"    {i}) {fuente:<15} -> {archivo}")

    print("    0) Salir")
    print("")

    while True:
        try:
            opcion = input("  Opcion: ").strip()

            if opcion == "0":
                print("\n  Hasta luego!")
                break

            opciones = list(DEMO_CSV_BY_FUENTE.keys())
            idx = int(opcion) - 1

            if 0 <= idx < len(opciones):
                fuente_elegida = opciones[idx]
                break

            print("  Opcion invalida. Intenta de nuevo.")
        except ValueError:
            print("  Ingresa un numero.")

    if opcion == "0":
        raise SystemExit(0)

    demo_csv = DEMO_CSV_BY_FUENTE[fuente_elegida]
    if not demo_csv.is_file():
        raise SystemExit(f"No se encontro el CSV: {demo_csv}")

    print(f"\n  Fuente seleccionada: '{fuente_elegida}' -> {demo_csv}\n")

    exclude_cols = None
    if fuente_elegida == "financiero":
        exclude_cols = ["id_cliente"]

    resultado = run_pipeline(
        source="csv",
        source_kwargs={"path": str(demo_csv)},
        target="aprobado",
        exclude_cols=exclude_cols,
        model_key="rf",
        problem_type="auto",
        run_bootstrap_ci=True,
        n_bootstraps=80,
        save_path="modelo_demo.pkl",
    )

    if fuente_elegida == "financiero":
        nuevos = pd.DataFrame({
            "edad": [30, 45, 38],
            "ingreso_mensual": [4000, 7000, 5200],
            "monto_solicitado": [15000, 50000, 28000],
            "plazo_meses": [24, 48, 36],
            "tasa_interes": [18.0, 12.5, 15.0],
            "historial_credito": [650, 750, 705],
            "empleo_actual": ["empleado", "empleado", "empleado"],
            "estado_civil": ["soltero", "casado", "casado"],
            "tiene_vivienda": ["no", "si", "si"],
            "tiene_vehiculo": ["si", "si", "si"],
            "deuda_actual": [1000, 2500, 1800],
            "score_credito": [620, 760, 690],
        })
        print("\n  Predicciones para 3 nuevos clientes:")
    elif fuente_elegida == "texto":
        nuevos = pd.DataFrame({
            "horas_estudio": [3.5, 6.8, 8.9],
            "asistencia_pct": [58, 83, 94],
            "promedio_previo": [55, 77, 90],
            "ciudad": ["Sevilla", "Bogota", "Madrid"],
            "modalidad_estudio": ["presencial", "hibrida", "online"],
            "turno": ["noche", "tarde", "manana"],
            "tiene_internet": ["no", "si", "si"],
        })
        print("\n  Predicciones para 3 nuevos estudiantes con columnas de texto:")
    else:
        nuevos = pd.DataFrame({
            "horas_estudio": [2.0, 7.5, 11.0],
            "asistencia_pct": [55, 85, 95],
            "promedio_previo": [50, 72, 88],
            "horas_sueno": [5, 7, 8],
            "actividades_extra": [0, 1, 2],
            "nivel_estres": [8, 5, 3],
        })
        print("\n  Predicciones para 3 nuevos estudiantes:")

    preds = predict(
        resultado["pipeline"],
        nuevos,
        resultado["meta"],
        resultado["bootstrap_models"],
    )
    _print_prediction_report(nuevos, preds, resultado["meta"])

    respuesta = input("\n  Iniciar modo interactivo? (s/n): ").strip().lower()
    if respuesta == "s":
        interactive_cli(
            resultado["pipeline"],
            resultado["meta"],
            resultado["bootstrap_models"],
        )
