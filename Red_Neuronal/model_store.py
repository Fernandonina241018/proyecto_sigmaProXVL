"""
model_store.py — Guardado y carga de pipelines entrenados.

Guarda en un solo archivo .pkl:
  • El pipeline completo (preprocessor + modelo)
  • Los metadatos del dataset (meta)
  • Los modelos bootstrap (opcional)
  • Parámetros de entrenamiento usados
"""

import os
import json
import joblib
from datetime import datetime


def save_model(pipeline, meta: dict,
               bootstrap_models: list = None,
               train_params: dict = None,
               path: str = "modelo_entrenado.pkl") -> str:
    """Guarda el pipeline + metadatos en disco.

    Argumentos:
        pipeline         : Pipeline sklearn ajustado
        meta             : dict de metadatos del dataset
        bootstrap_models : lista de pipelines bootstrap (puede ser None)
        train_params     : hiperparámetros usados en el entrenamiento
        path             : ruta del archivo de salida (.pkl)

    Retorna:
        path : ruta donde se guardó el archivo
    """
    payload = {
        "pipeline":          pipeline,
        "meta":              meta,
        "bootstrap_models":  bootstrap_models or [],
        "train_params":      train_params or {},
        "saved_at":          datetime.now().isoformat(),
        "version":           "1.0",
    }
    joblib.dump(payload, path, compress=3)
    size_mb = os.path.getsize(path) / 1_048_576
    print(f"  ✔ Modelo guardado: '{path}'  ({size_mb:.2f} MB)")
    return path


def load_model(path: str) -> dict:
    """Carga un modelo guardado con save_model().

    Retorna:
        dict con claves: pipeline, meta, bootstrap_models,
                         train_params, saved_at, version
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"No se encontró el modelo: {path}")

    payload = joblib.load(path)
    saved   = payload.get("saved_at", "desconocida")
    print(f"  ✔ Modelo cargado: '{path}'  (guardado: {saved})")
    return payload


def model_info(path: str) -> None:
    """Imprime un resumen del modelo guardado sin cargarlo completamente."""
    payload = load_model(path)
    meta    = payload.get("meta", {})

    print("\n  Información del modelo:")
    print(f"    Tipo problema  : {meta.get('problem_type', 'N/A')}")
    print(f"    Target         : {meta.get('target_col', 'N/A')}")
    print(f"    Features num.  : {meta.get('num_features', [])}")
    print(f"    Features cat.  : {meta.get('cat_features', [])}")
    print(f"    Clases         : {meta.get('target_classes', 'N/A')}")
    print(f"    Bootstrap mods : {len(payload.get('bootstrap_models', []))}")
    params = payload.get("train_params", {})
    if params:
        print(f"    Parámetros     : {json.dumps(params, indent=6)}")
