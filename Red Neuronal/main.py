"""
main.py — Orquestador principal del sistema de ML modular.

Punto de entrada único. Conecta todos los módulos:
    data_loader  → preprocessor → trainer → evaluator → model_store

Uso rápido (demo con CSV en datos/):
    python main.py
    python main.py --fuente temporal      # logística aditiva (default)
    python main.py --fuente alternativo   # patrón multiplicativo / interacciones

Uso con datos reales (API):
    from main import run_pipeline
    run_pipeline(
        source='api',
        source_kwargs={'url': 'https://mi-api.com/data', 'record_path': 'records'},
        target='resultado_examen',
        model_key='rf',
    )

Uso con CSV:
    from main import run_pipeline
    run_pipeline(
        source="csv",
        source_kwargs={"path": "datos/entrenamiento_temporal.csv"},
        target="aprobado",
        model_key="rf",  # o "mlp", "logistic", "xgb", …
    )


Uso con múltiples fuentes:
    run_pipeline(
        source='multi',
        source_kwargs={
            'sources': [
                {'type': 'csv',   'path': 'datos/entrenamiento_temporal.csv'},
                {'type': 'excel', 'path': 'asistencia.xlsx'},
                {'type': 'api',   'url':  'https://api.com/estres',
                                  'record_path': 'data'},
            ],
            'join_on': 'student_id',
        },
        target='nota_final',
        model_key='rf',
        problem_type='auto',
    )
"""

import numpy as np
import pandas as pd
from pathlib import Path

from data_loader  import load_data
from preprocessor import prepare_data
from trainer      import train, bootstrap_models as run_bootstrap
from evaluator    import evaluate, predict
from model_store  import save_model, load_model
from config       import TRAIN_DEFAULTS


# CSV de demo (elegir con python main.py --fuente temporal|alternativo|financiero)
_BASE_DATOS = Path(__file__).resolve().parent / "datos"
DEMO_CSV_BY_FUENTE = {
    "temporal": _BASE_DATOS / "entrenamiento_temporal.csv",
    "alternativo": _BASE_DATOS / "entrenamiento_patron_alternativo.csv",
    "financiero": _BASE_DATOS / "entrenamiento_financiero.csv",
}


# ══════════════════════════════════════════════════════════════════
#  PIPELINE COMPLETO
# ══════════════════════════════════════════════════════════════════

def run_pipeline(
    # ── Datos ─────────────────────────────────────────────────────
    source: str          = "synthetic",
    source_kwargs: dict  = None,
    target: str          = "aprobado",
    exclude_cols: list   = None,

    # ── Modelo ────────────────────────────────────────────────────
    model_key: str       = "rf",
    problem_type: str    = "auto",
    model_kwargs: dict   = None,

    # ── Entrenamiento ─────────────────────────────────────────────
    test_size: float     = None,
    cv_folds: int        = None,
    random_state: int    = None,

    # ── Bootstrap ─────────────────────────────────────────────────
    run_bootstrap_ci: bool = True,
    n_bootstraps: int      = None,

    # ── Guardado ──────────────────────────────────────────────────
    save_path: str       = None,

    # ── Predicciones nuevas ───────────────────────────────────────
    X_new: pd.DataFrame  = None,
    verbose: bool        = True,
) -> dict:
    """Ejecuta el pipeline completo de ML.

    Retorna:
        dict con claves:
            pipeline, meta, splits, cv_results,
            eval_results, bootstrap_models,
            predictions_new (si X_new dado)
    """

    # Valores por defecto desde config
    source_kwargs  = source_kwargs  or {}
    model_kwargs   = model_kwargs   or {}
    test_size      = test_size      or TRAIN_DEFAULTS["test_size"]
    cv_folds       = cv_folds       or TRAIN_DEFAULTS["cv_folds"]
    random_state   = random_state   or TRAIN_DEFAULTS["random_state"]
    n_bootstraps   = n_bootstraps   or TRAIN_DEFAULTS["bootstrap_n"]

    _banner("SISTEMA DE ML MODULAR — INICIO")

    # ── 1. Carga de datos ─────────────────────────────────────────
    _step(1, "Cargando datos")
    df = load_data(source, **source_kwargs)

    # ── 2. Preprocesamiento y detección automática ────────────────
    _step(2, "Analizando y preparando datos")
    X_raw, y, preprocessor, meta = prepare_data(
        df, target=target,
        problem_type=problem_type,
        exclude_cols=exclude_cols,
        verbose=verbose,
    )

    # ── 3. Entrenamiento ──────────────────────────────────────────
    _step(3, f"Entrenando modelo [{model_key.upper()}]")
    pipeline, splits, cv_results = train(
        X_raw, y,
        preprocessor=preprocessor,
        model_key=model_key,
        problem_type=meta["problem_type"],
        meta=meta,
        test_size=test_size,
        cv_folds=cv_folds,
        random_state=random_state,
        model_kwargs=model_kwargs,
    )

    # ── 4. Bootstrap (intervalos de confianza) ────────────────────
    boot_models = []
    if run_bootstrap_ci:
        _step(4, f"Bootstrap ({n_bootstraps} modelos)")
        boot_models = run_bootstrap(
            splits["X_train"], splits["y_train"],
            preprocessor=preprocessor,
            model_key=model_key,
            problem_type=meta["problem_type"],
            meta=meta,
            n_bootstraps=n_bootstraps,
            random_state=random_state,
        )

    # ── 5. Evaluación ─────────────────────────────────────────────
    _step(5, "Evaluando en datos de test")
    eval_results = evaluate(
        pipeline, splits, meta,
        bootstrap_models=boot_models,
        X_new=X_new,
    )

    # ── 6. Guardar modelo ─────────────────────────────────────────
    if save_path:
        _step(6, f"Guardando modelo → {save_path}")
        train_params = dict(
            source=source, model_key=model_key,
            problem_type=meta["problem_type"],
            test_size=test_size, cv_folds=cv_folds,
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


# ══════════════════════════════════════════════════════════════════
#  MODO INTERACTIVO  (CLI)
# ══════════════════════════════════════════════════════════════════

def interactive_cli(pipeline, meta: dict, bootstrap_models: list = None):
    """CLI interactiva para predicciones manuales post-entrenamiento.

    El usuario ingresa valores para cada feature detectada automáticamente.
    """
    num_feats = meta["num_features"]
    cat_feats = meta["cat_features"]
    all_feats = num_feats + cat_feats
    problem   = meta["problem_type"]
    classes   = meta.get("target_classes")

    print("\n" + "═" * 62)
    print("  MODO INTERACTIVO — PREDICCIÓN MANUAL")
    print(f"  Features: {all_feats}")
    print("  Escribe 'salir' para terminar")
    print("═" * 62)

    historial = []

    while True:
        print()
        valores = {}
        try:
            for feat in num_feats:
                val = input(f"  {feat} (numérico): ").strip().lower()
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
            print("  ❌ Valor inválido. Intenta de nuevo.")
            continue

        X_new = pd.DataFrame([valores])
        result_df = predict(pipeline, X_new, meta, bootstrap_models)

        print("\n  ── Resultado ──────────────────────────────")
        if problem == "regression":
            pred = result_df["prediccion"].iloc[0]
            print(f"  Predicción : {pred:.4f}")
            if "ic_lower_95" in result_df.columns:
                lo = result_df["ic_lower_95"].iloc[0]
                hi = result_df["ic_upper_95"].iloc[0]
                print(f"  IC 95%     : [{lo:.4f}, {hi:.4f}]")
        else:
            clase = result_df["clase_predicha"].iloc[0]
            print(f"  Clase predicha : {clase}")
            prob_cols = [c for c in result_df.columns if c.startswith("prob_")]
            for col in prob_cols:
                print(f"  {col:<25} {result_df[col].iloc[0]:.1%}")
            if "ic_lower_95" in result_df.columns:
                lo = result_df["ic_lower_95"].iloc[0]
                hi = result_df["ic_upper_95"].iloc[0]
                print(f"  IC 95% P(pos.) : [{lo:.1%}, {hi:.1%}]")

        historial.append(valores | result_df.to_dict(orient="records")[0])

    if historial:
        print(f"\n  📊 Resumen: {len(historial)} predicciones realizadas.")
        print(pd.DataFrame(historial).to_string(index=False))

    print("\n  👋 ¡Hasta luego!")


# ══════════════════════════════════════════════════════════════════
#  HELPERS
# ══════════════════════════════════════════════════════════════════

def _banner(msg: str):
    sep = "═" * 62
    print(f"\n{sep}\n  {msg}\n{sep}")

def _step(n: int, msg: str):
    print(f"\n  [{n}] {msg}…")


# ══════════════════════════════════════════════════════════════════
#  MODO INTERACTIVO (ejecutar directamente)
# ══════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    # Menú interactivo para elegir fuente de datos
    print("\n" + "=" * 60)
    print("  pipeline ML - SELECCIÓN DE FUENTE DE DATOS")
    print("=" * 60)
    print("\n  Elige una fuente de datos:\n")
    
    for i, fuente in enumerate(DEMO_CSV_BY_FUENTE.keys(), 1):
        archivo = DEMO_CSV_BY_FUENTE[fuente].name
        print(f"    {i}) {fuente:<15} → {archivo}")
    
    print(f"    0) Salir")
    print("")
    
    while True:
        try:
            opcion = input("  Opción: ").strip()
            
            if opcion == "0":
                print("\n  ¡Hasta luego!")
                break
                
            opciones = list(DEMO_CSV_BY_FUENTE.keys())
            idx = int(opcion) - 1
            
            if 0 <= idx < len(opciones):
                fuente_elegida = opciones[idx]
                break
            else:
                print("  ❌ Opción inválida. Intenta de nuevo.")
        except ValueError:
            print("  ❌ Ingresa un número.")
    
    if opcion == "0":
        raise SystemExit(0)
    
    demo_csv = DEMO_CSV_BY_FUENTE[fuente_elegida]
    if not demo_csv.is_file():
        raise SystemExit(f"No se encontró el CSV: {demo_csv}")

    print(f"\n  Fuente seleccionada: «{fuente_elegida}» → {demo_csv}\n")

    # Columnas a excluir según la fuente
    exclude_cols = None
    if fuente_elegida == "financiero":
        exclude_cols = ["id_cliente"]

    resultado = run_pipeline(
        source         = "csv",
        source_kwargs  = {"path": str(demo_csv)},
        target         = "aprobado",
        exclude_cols   = exclude_cols,
        model_key      = "rf",
        problem_type   = "auto",
        run_bootstrap_ci = True,
        n_bootstraps   = 80,
        save_path      = "modelo_demo.pkl",
    )

    # Predicción de nuevos según la fuente
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
    else:
        nuevos = pd.DataFrame({
            "horas_estudio":     [2.0, 7.5, 11.0],
            "asistencia_pct":    [55,  85,  95],
            "promedio_previo":   [50,  72,  88],
            "horas_sueno":       [5,   7,   8],
            "actividades_extra": [0,   1,   2],
            "nivel_estres":      [8,   5,   3],
        })
        print("\n  Predicciones para 3 nuevos estudiantes:")
    preds = predict(
        resultado["pipeline"], nuevos,
        resultado["meta"],
        resultado["bootstrap_models"]
    )
    print(preds.to_string())

    # CLI interactiva
    respuesta = input("\n  ¿Iniciar modo interactivo? (s/n): ").strip().lower()
    if respuesta == "s":
        interactive_cli(
            resultado["pipeline"],
            resultado["meta"],
            resultado["bootstrap_models"]
        )
