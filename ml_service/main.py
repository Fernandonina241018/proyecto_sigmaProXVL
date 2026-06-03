"""
ml_service/main.py — FastAPI service wrapping Red Neuronal ML modules
Endpoints: train, predict, models, anomaly, explain, datasets
"""

import io
import json
import re
import sys
import threading
import time
import uuid
from pathlib import Path
from typing import Optional
import base64
import matplotlib
matplotlib.use('Agg')

import pandas as pd
import numpy as np
import joblib
from pandas.api.types import is_string_dtype, is_object_dtype
from fastapi import FastAPI, HTTPException, Query, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

_RN_DIR = Path(__file__).resolve().parent.parent / "Red_Neuronal"
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

ALLOWED_ORIGINS = [
    "https://fernandonina241018.github.io",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:3000",
]

# ── CORS personalizado (antes del CORSMiddleware) para manejar preflight OPTIONS ──
@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    origin = request.headers.get("origin")
    if request.method == "OPTIONS":
        response = JSONResponse(content="ok")
    else:
        response = await call_next(request)
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

MODELS_DIR = _RN_DIR / "modelos_guardados"
DATOS_DIR = _RN_DIR / "datos"
manager = ModelManager(base_dir=str(MODELS_DIR))

# ── Async task management ──
_tasks = {}
_tasks_lock = threading.Lock()
_MAX_TASKS = 50

DATASET_NAME_RE = re.compile(r"^[A-Za-z0-9_\-\.]+$")
MODEL_ID_RE = re.compile(r"^[A-Za-z0-9_\-]+$")


def _safe_resolve(base_dir: Path, name: str, allowed_ext: tuple) -> Path:
    """Resuelve un nombre de archivo dentro de base_dir, garantizando
    que el path absoluto final esté contenido (anti path-traversal)."""
    candidate = (base_dir / name).resolve()
    base_resolved = base_dir.resolve()
    if not str(candidate).startswith(str(base_resolved)):
        raise HTTPException(400, f"Nombre inválido: '{name}'")
    if not candidate.suffix or candidate.suffix not in allowed_ext:
        raise HTTPException(400, f"Extensión no permitida: '{name}'")
    return candidate


def _safe_dataset_name(name: str) -> str:
    if not name or not DATASET_NAME_RE.match(name) or ".." in name or name.startswith("."):
        raise HTTPException(400, f"Nombre de dataset inválido: '{name}'")
    return name


def _safe_model_id(model_id: str) -> str:
    if not model_id or not MODEL_ID_RE.match(model_id) or ".." in model_id or model_id.startswith("."):
        raise HTTPException(400, f"Model ID inválido: '{model_id}'")
    return model_id


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
    search_type: str = "none"
    search_params: Optional[dict] = None
    imbalance_strategy: str = "none"
    feature_engineering: Optional[dict] = None


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
        if is_string_dtype(df[col]) or is_object_dtype(df[col]):
            replaced = df[col].replace(["", "null", "None", "nan"], pd.NA)
            converted = pd.to_numeric(replaced, errors="coerce")
            if converted.notna().mean() > 0.5:
                df[col] = converted
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


def _execute_training(req: TrainRequest, progress_callback=None):
    """Core training logic — used by both sync and async paths.
    progress_callback(pct, text) is called periodically if provided."""
    def prog(pct, text):
        if progress_callback:
            progress_callback(pct, text)
    prog(5, "Cargando datos...")
    if req.dataset_name and (not req.data or len(req.data) == 0):
        safe_name = _safe_dataset_name(req.dataset_name)
        csv_path = _safe_resolve(DATOS_DIR, f"{safe_name}.csv", allowed_ext=(".csv",))
        if not csv_path.exists():
            csv_path = _safe_resolve(DATOS_DIR, safe_name, allowed_ext=(".csv",))
        if not csv_path.exists():
            raise HTTPException(404, f"Dataset '{req.dataset_name}' not found in {DATOS_DIR}")
        df = load_data("csv", path=str(csv_path))
    else:
        df = _df_from_payload(req.data, req.columns)
    if req.target not in df.columns:
        raise HTTPException(400, f"Target '{req.target}' not found in data")
    prog(15, "Preprocesando datos...")
    X_raw, y, preprocessor, meta = prepare_data(
        df, target=req.target, problem_type=req.problem_type,
        exclude_cols=req.exclude_cols, verbose=False,
        feature_engineering=req.feature_engineering,
    )
    prog(25, "Entrenando modelo...")
    pipeline, splits, cv_results, best_params = train(
        X_raw, y, preprocessor=preprocessor, model_key=req.model_key,
        problem_type=meta["problem_type"], meta=meta,
        test_size=req.test_size, cv_folds=req.cv_folds, random_state=42,
        search_type=req.search_type, search_params=req.search_params,
        imbalance_strategy=req.imbalance_strategy,
    )
    prog(65, "Evaluando modelo...")
    boot_models = []
    if req.n_bootstraps > 0:
        boot_models = run_bootstrap(
            splits["X_train"], splits["y_train"],
            preprocessor=preprocessor, model_key=req.model_key,
            problem_type=meta["problem_type"], meta=meta,
            n_bootstraps=req.n_bootstraps, random_state=42,
        )
    eval_results = evaluate(pipeline, splits, meta, bootstrap_models=boot_models)
    prog(85, "Guardando modelo...")
    ds_name = req.dataset_name or f"api_{req.target}"
    payload = {
        "pipeline": pipeline, "meta": meta,
        "bootstrap_models": boot_models,
        "train_params": {"source": "api", "model_key": req.model_key,
                         "problem_type": meta["problem_type"],
                         "test_size": req.test_size, "cv_folds": req.cv_folds,
                         "n_bootstraps": req.n_bootstraps,
                         "search_type": req.search_type,
                         "imbalance_strategy": req.imbalance_strategy,
                         "feature_engineering": req.feature_engineering},
        "best_params": best_params,
        "saved_at": None, "version": "1.0",
    }
    model_id = manager.save_training(
        payload=payload, dataset_name=ds_name,
        model_key=req.model_key, eval_results=eval_results,
    )
    tc = meta.get("target_classes", [])
    if hasattr(tc, "tolist"):
        tc = tc.tolist()
    prog(100, "Completado")
    return {
        "ok": True, "model_id": model_id,
        "metrics": _metrics_serializable(eval_results),
        "best_params": best_params,
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


def _run_training_thread(task_id, req):
    """Target for background thread: runs training and stores result in _tasks."""
    def set_progress(pct, text):
        with _tasks_lock:
            if task_id in _tasks:
                _tasks[task_id]["progress"] = pct
                _tasks[task_id]["status_text"] = text
    try:
        with _tasks_lock:
            if task_id in _tasks:
                _tasks[task_id]["status"] = "running"
        result = _execute_training(req, progress_callback=set_progress)
        with _tasks_lock:
            if task_id in _tasks:
                _tasks[task_id]["status"] = "done"
                _tasks[task_id]["result"] = result
                _tasks[task_id]["progress"] = 100
                _tasks[task_id]["status_text"] = "Completado"
    except HTTPException as e:
        with _tasks_lock:
            if task_id in _tasks:
                _tasks[task_id]["status"] = "failed"
                _tasks[task_id]["error"] = e.detail
    except Exception as e:
        with _tasks_lock:
            if task_id in _tasks:
                _tasks[task_id]["status"] = "failed"
                _tasks[task_id]["error"] = str(e)


@app.post("/api/ml/train")
def train_endpoint(req: TrainRequest):
    try:
        return _execute_training(req)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/ml/train/async")
async def train_async(req: TrainRequest):
    task_id = uuid.uuid4().hex[:8]
    with _tasks_lock:
        _tasks[task_id] = {
            "status": "queued", "progress": 0, "status_text": "En cola...",
            "result": None, "error": None, "created_at": time.time(),
        }
        if len(_tasks) > _MAX_TASKS:
            oldest = sorted(_tasks, key=lambda k: _tasks[k]["created_at"])[0]
            del _tasks[oldest]
    thread = threading.Thread(target=_run_training_thread, args=(task_id, req), daemon=True)
    thread.start()
    return {"ok": True, "task_id": task_id}


@app.get("/api/ml/tasks")
def list_tasks():
    with _tasks_lock:
        items = [{"id": k, "status": v["status"], "progress": v["progress"],
                   "status_text": v["status_text"], "created_at": v["created_at"],
                   "error": v.get("error")}
                 for k, v in sorted(_tasks.items(), key=lambda x: x[1]["created_at"], reverse=True)]
    return {"ok": True, "tasks": items}


@app.get("/api/ml/tasks/{task_id}")
def get_task(task_id: str):
    with _tasks_lock:
        task = _tasks.get(task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    resp = {"ok": True, "task": {"id": task_id, "status": task["status"],
            "progress": task["progress"], "status_text": task["status_text"],
            "created_at": task["created_at"]}}
    if task["status"] == "done" and task.get("result"):
        resp["task"]["result"] = task["result"]
    if task["status"] == "failed" and task.get("error"):
        resp["task"]["error"] = task["error"]
    return resp


@app.delete("/api/ml/tasks/{task_id}")
def delete_task(task_id: str):
    with _tasks_lock:
        _tasks.pop(task_id, None)
    return {"ok": True}


@app.post("/api/ml/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith('.csv'):
        raise HTTPException(400, "Only .csv files allowed")
    name = re.sub(r'\.csv$', '', file.filename, flags=re.IGNORECASE)
    safe_name = _safe_dataset_name(name)
    dest = DATOS_DIR / f"{safe_name}.csv"
    content = await file.read()
    dest.write_bytes(content)
    try:
        df = load_data("csv", path=str(dest))
        return {
            "ok": True, "filename": f"{safe_name}.csv",
            "nrows": len(df), "ncols": len(df.columns),
            "columns": list(df.columns),
        }
    except Exception as e:
        dest.unlink(missing_ok=True)
        raise HTTPException(400, f"Invalid CSV file: {e}")


@app.post("/api/ml/predict")
def predict_endpoint(req: PredictRequest):
    try:
        registry = manager._load_registry()
        _safe_model_id(req.model_id)
        if req.model_id not in registry:
            raise HTTPException(404, f"Model '{req.model_id}' not found")
        entry = registry[req.model_id]
        p = _safe_resolve(MODELS_DIR, entry.get("filename", ""), allowed_ext=(".joblib", ".pkl"))
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
            meta = entry.get("meta", {})
            if not meta or not isinstance(meta.get("num_features"), list):
                try:
                    p = _safe_resolve(MODELS_DIR, entry.get("filename", ""), allowed_ext=(".joblib", ".pkl"))
                    if p.exists():
                        payload = joblib.load(str(p))
                        meta = payload.get("meta", {})
                except Exception:
                    meta = {
                        "num_features": [],
                        "cat_features": [],
                        "target_col": entry.get("target_col", "?"),
                        "target_classes": entry.get("target_classes"),
                    }
            models.append({
                "id": mid,
                "filename": entry.get("filename", ""),
                "model_key": entry.get("model_key", ""),
                "dataset_name": entry.get("dataset_name", ""),
                "saved_at": entry.get("saved_at", ""),
                "metrics": entry.get("eval_results", {}),
                "meta": meta,
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
        safe_name = _safe_dataset_name(req.filename)
        path = _safe_resolve(DATOS_DIR, f"{safe_name}.csv", allowed_ext=(".csv",))
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
        _safe_model_id(req.model_id)
        if req.model_id not in registry:
            raise HTTPException(404, f"Model '{req.model_id}' not found")
        entry = registry[req.model_id]
        p = _safe_resolve(MODELS_DIR, entry.get("filename", ""), allowed_ext=(".joblib", ".pkl"))
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
    import os, uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
