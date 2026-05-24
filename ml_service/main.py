"""
ml_service/main.py — FastAPI service wrapping Red Neuronal ML modules
Endpoints: train, predict, models, anomaly, explain, datasets
"""

import io
import json
import sys
from pathlib import Path
from typing import Optional
import base64
import matplotlib
matplotlib.use('Agg')

import pandas as pd
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

_RN_DIR = Path(__file__).resolve().parent.parent / "Red Neuronal"
sys.path.insert(0, str(_RN_DIR))

from evaluator import evaluate, predict
from model_store import save_model, load_model
from model_manager import ModelManager
from preprocessor import prepare_data
from trainer import train, bootstrap_models as run_bootstrap
from data_loader import load_data
from csv_auto_loader import get_available_datasets

try:
    from anomaly_detector import (
        detect_outliers, data_quality_report, recommend_imbalance_handling,
    )
    HAS_ANOMALY = True
except ImportError:
    HAS_ANOMALY = False

try:
    from interpretability import explain_predictions
    HAS_INTERPRET = True
except ImportError:
    HAS_INTERPRET = False

app = FastAPI(title="SigmaPro ML Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = _RN_DIR / "modelos_guardados"
DATOS_DIR = _RN_DIR / "datos"
manager = ModelManager(base_dir=str(MODELS_DIR))


class TrainRequest(BaseModel):
    data: list
    columns: list[str]
    target: str
    model_key: str = "rf"
    problem_type: str = "auto"
    test_size: float = 0.2
    cv_folds: int = 5
    n_bootstraps: int = 0
    dataset_name: Optional[str] = None
    exclude_cols: Optional[list[str]] = None


class PredictRequest(BaseModel):
    model_id: str
    data: list
    columns: list[str]


class AnomalyRequest(BaseModel):
    data: list
    columns: list[str]


class ExplainRequest(BaseModel):
    model_id: str
    data: list
    columns: list[str]


class CSVLoadRequest(BaseModel):
    filename: str


def _df_from_payload(data: list, columns: list[str]) -> pd.DataFrame:
    df = pd.DataFrame(data, columns=columns)
    df = df.infer_objects()
    for col in df.columns:
        if df[col].dtype == object:
            try:
                df[col] = pd.to_numeric(df[col], errors="ignore")
            except (ValueError, TypeError):
                pass
    return df


def _metrics_serializable(metrics: dict) -> dict:
    result = {}
    for k, v in metrics.items():
        if isinstance(v, (np.ndarray,)):
            result[k] = v.tolist()
        elif isinstance(v, (np.integer,)):
            result[k] = int(v)
        elif isinstance(v, (np.floating,)):
            result[k] = float(v)
        elif isinstance(v, dict):
            result[k] = _metrics_serializable(v)
        else:
            result[k] = v
    return result


@app.get("/api/ml/health")
def health():
    return {"ok": True, "service": "SigmaPro ML Service",
            "anomaly": HAS_ANOMALY, "interpret": HAS_INTERPRET}


@app.post("/api/ml/train")
def train_endpoint(req: TrainRequest):
    try:
        df = _df_from_payload(req.data, req.columns)
        if req.target not in df.columns:
            raise HTTPException(400, f"Target '{req.target}' not found in data")

        X_raw, y, preprocessor, meta = prepare_data(
            df, target=req.target, problem_type=req.problem_type,
            exclude_cols=req.exclude_cols, verbose=False,
        )
        pipeline, splits, cv_results = train(
            X_raw, y, preprocessor=preprocessor, model_key=req.model_key,
            problem_type=meta["problem_type"], meta=meta,
            test_size=req.test_size, cv_folds=req.cv_folds, random_state=42,
        )
        boot_models = []
        if req.n_bootstraps > 0:
            boot_models = run_bootstrap(
                splits["X_train"], splits["y_train"],
                preprocessor=preprocessor, model_key=req.model_key,
                problem_type=meta["problem_type"], meta=meta,
                n_bootstraps=req.n_bootstraps, random_state=42,
            )
        eval_results = evaluate(pipeline, splits, meta, bootstrap_models=boot_models)

        ds_name = req.dataset_name or f"api_{req.target}"
        payload = {
            "pipeline": pipeline, "meta": meta,
            "bootstrap_models": boot_models,
            "train_params": {"source": "api", "model_key": req.model_key,
                             "problem_type": meta["problem_type"],
                             "test_size": req.test_size, "cv_folds": req.cv_folds,
                             "n_bootstraps": req.n_bootstraps},
            "saved_at": None, "version": "1.0",
        }
        model_id = manager.save_training(
            payload=payload, dataset_name=ds_name,
            model_key=req.model_key, eval_results=eval_results,
        )
        tc = meta.get("target_classes", [])
        if hasattr(tc, "tolist"):
            tc = tc.tolist()
        return {
            "ok": True, "model_id": model_id,
            "metrics": _metrics_serializable(eval_results),
            "meta": {
                "problem_type": meta["problem_type"],
                "target_col": meta.get("target_col", req.target),
                "num_features": meta.get("num_features", []),
                "cat_features": meta.get("cat_features", []),
                "target_classes": tc,
                "n_train": int(splits["X_train"].shape[0]),
                "n_test": int(splits["X_test"].shape[0]),
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/ml/predict")
def predict_endpoint(req: PredictRequest):
    try:
        registry = manager._load_registry()
        if req.model_id not in registry:
            raise HTTPException(404, f"Model '{req.model_id}' not found")
        entry = registry[req.model_id]
        p = MODELS_DIR / entry.get("filename", "")
        if not p.exists():
            raise HTTPException(404, f"Model file not found")
        payload = joblib.load(str(p))
        pipeline = payload["pipeline"]
        meta = payload["meta"]
        boot_models = payload.get("bootstrap_models", [])
        X_new = _df_from_payload(req.data, req.columns)
        result_df = predict(pipeline, X_new, meta, boot_models)
        return {
            "ok": True,
            "predictions": result_df.to_dict(orient="records"),
            "columns": list(result_df.columns),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/api/ml/models")
def list_models():
    try:
        registry = manager._load_registry()
        models = []
        for mid, entry in registry.items():
            models.append({
                "id": mid,
                "filename": entry.get("filename", ""),
                "model_key": entry.get("model_key", ""),
                "dataset_name": entry.get("dataset_name", ""),
                "saved_at": entry.get("saved_at", ""),
                "metrics": entry.get("eval_results", {}),
                "meta": entry.get("meta", {}),
            })
        models.sort(key=lambda m: m.get("saved_at", ""), reverse=True)
        return {"ok": True, "models": models}
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/api/ml/datasets")
def list_datasets():
    try:
        datasets = get_available_datasets()
        result = []
        for name, path in datasets.items():
            try:
                df = load_data("csv", path=str(path))
                result.append({
                    "name": name,
                    "ncols": len(df.columns),
                    "nrows": len(df),
                    "columns": list(df.columns),
                })
            except Exception:
                result.append({"name": name, "ncols": 0, "nrows": 0, "columns": []})
        return {"ok": True, "datasets": result}
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/ml/dataset/preview")
def preview_dataset(req: CSVLoadRequest):
    try:
        path = DATOS_DIR / req.filename
        if not path.exists():
            for p in DATOS_DIR.glob(f"**/{req.filename}"):
                path = p
                break
            if not path.exists():
                raise HTTPException(404, f"Dataset '{req.filename}' not found")
        df = load_data("csv", path=str(path))
        return {
            "ok": True,
            "filename": req.filename,
            "columns": list(df.columns),
            "nrows": len(df),
            "ncols": len(df.columns),
            "preview": df.head(10).to_dict(orient="records"),
            "dtypes": {str(c): str(d) for c, d in df.dtypes.items()},
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/ml/anomaly")
def anomaly_endpoint(req: AnomalyRequest):
    if not HAS_ANOMALY:
        raise HTTPException(501, "Anomaly detection module not available")
    try:
        df = _df_from_payload(req.data, req.columns)
        num_cols = df.select_dtypes(include="number").columns.tolist()
        outliers_result = detect_outliers(df, num_cols)
        quality = data_quality_report(df)
        imbalance = recommend_imbalance_handling(df)
        return {
            "ok": True,
            "outliers": {
                "method": outliers_result.get("method", ""),
                "n_outliers": int(outliers_result.get("n_outliers", 0)),
                "outlier_indices": outliers_result.get("outlier_indices", []),
            },
            "quality": {
                "n_rows": int(quality.get("n_rows", 0)),
                "n_cols": int(quality.get("n_cols", 0)),
                "missing_cells": int(quality.get("missing_cells", 0)),
                "missing_pct": float(quality.get("missing_pct", 0)),
            },
            "imbalance": {
                "recommendation": imbalance.get("recommendation", ""),
                "method": imbalance.get("method", ""),
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/ml/explain")
def explain_endpoint(req: ExplainRequest):
    if not HAS_INTERPRET:
        raise HTTPException(501, "Interpretability module not available")
    try:
        registry = manager._load_registry()
        if req.model_id not in registry:
            raise HTTPException(404, f"Model '{req.model_id}' not found")
        entry = registry[req.model_id]
        p = MODELS_DIR / entry.get("filename", "")
        payload = joblib.load(str(p))
        pipeline = payload["pipeline"]
        meta = payload["meta"]
        X_new = _df_from_payload(req.data, req.columns)
        explanation = explain_predictions(pipeline, X_new, meta)
        fi = explanation.get("feature_importance", {})
        return {
            "ok": True,
            "feature_importance": {
                str(k): float(v) if not isinstance(v, (list, dict)) else v
                for k, v in fi.items()
            },
            "explanation": explanation.get("text", ""),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
