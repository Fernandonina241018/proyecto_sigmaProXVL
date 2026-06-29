"""
drift_worker.py - Scheduled drift monitoring worker for Fly.io.

Run as: python drift_worker.py
Or via cron/scheduler: every 6 hours

Checks all promoted models for drift against their training data
and logs results. Alerts via stdout (captured by Fly.io logs).
"""

import json
import os
import sys
import time
from pathlib import Path

_RN_DIR = Path(__file__).resolve().parent.parent / "Red_Neuronal"
sys.path.insert(0, str(_RN_DIR))

from model_manager import ModelManager
from drift_detector import detect_drift, save_drift_check, get_drift_history
from data_loader import load_data

MODELS_DIR = _RN_DIR / "modelos_guardados"
DATOS_DIR = _RN_DIR / "datos"
manager = ModelManager(base_dir=str(MODELS_DIR))


def _get_training_data(entry: dict) -> dict:
    """Load training data for a model entry."""
    dataset_name = entry.get("dataset_name", "")
    if not dataset_name:
        return {"data": None, "columns": []}
    csv_path = DATOS_DIR / dataset_name
    if not csv_path.exists():
        csv_path = DATOS_DIR / f"{dataset_name}.csv"
    if not csv_path.exists():
        return {"data": None, "columns": []}
    try:
        df = load_data("csv", path=str(csv_path))
        return {"data": df, "columns": list(df.columns)}
    except Exception as e:
        print(f"[DRIFT_WORKER] Error loading dataset '{dataset_name}': {e}")
        return {"data": None, "columns": []}


def run_drift_check(model_id: str, entry: dict) -> dict:
    """Run a full drift check for a model."""
    print(f"[DRIFT_WORKER] Checking drift for {model_id}...")
    training = _get_training_data(entry)
    if training["data"] is None:
        print(f"[DRIFT_WORKER]  ✗ No training data available for {model_id}, skipping")
        return {"ok": False, "reason": "no_training_data"}

    meta = entry.get("meta", {})
    result = detect_drift(model_id, training["data"], training["data"], meta)
    save_drift_check(manager.base_dir, model_id, result)

    severity = result["global_severity"]
    n_high = result["n_features_drifted_high"]
    n_medium = result["n_features_drifted_medium"]

    print(f"[DRIFT_WORKER]  ✓ {model_id}: severity={severity}, "
          f"high={n_high}, medium={n_medium}, "
          f"avg_psi={result['global_avg_psi']:.4f}")

    if severity in ("high", "medium"):
        print(f"[DRIFT_WORKER]  ⚠ ALERT: Model {model_id} has {severity} drift "
              f"({n_high} high, {n_medium} medium features)")

    return {"ok": True, "result": result}


def main():
    print("=" * 60)
    print("  DRIFT MONITORING WORKER")
    print(f"  Started at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    models = manager.list_models()
    if not models:
        print("[DRIFT_WORKER] No models found in registry.")
        return

    results = {"checked": 0, "skipped": 0, "alerts": []}
    for entry in models:
        model_id = entry["id"]
        # Only check promoted models or models with training data
        if not entry.get("promoted") and not entry.get("dataset_name"):
            results["skipped"] += 1
            continue
        try:
            r = run_drift_check(model_id, entry)
            if r.get("ok"):
                results["checked"] += 1
                if r["result"]["global_severity"] in ("high", "medium"):
                    results["alerts"].append({
                        "model_id": model_id,
                        "severity": r["result"]["global_severity"],
                        "n_high": r["result"]["n_features_drifted_high"],
                    })
        except Exception as e:
            print(f"[DRIFT_WORKER] Error checking {model_id}: {e}")
            results["skipped"] += 1

    print(f"\n[DRIFT_WORKER] Summary: checked={results['checked']}, "
          f"skipped={results['skipped']}, alerts={len(results['alerts'])}")
    for alert in results["alerts"]:
        print(f"[DRIFT_WORKER]  ⚠ {alert['model_id']}: {alert['severity']} "
              f"({alert['n_high']} high features)")

    print(f"\n[DRIFT_WORKER] Finished at: {time.strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    main()
