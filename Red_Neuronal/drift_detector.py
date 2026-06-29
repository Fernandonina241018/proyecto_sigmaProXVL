"""
drift_detector.py - Detección de deriva (Data/Concept Drift) para modelos ML.

Capacidades:
  • Data Drift: KS-test (numéricas), Chi-cuadrado (categóricas)
  • Population Stability Index (PSI) general y por feature
  • Comparación de distribuciones con estadísticos y alertas
  • Historial de drift persistido en JSON
"""

import json
import math
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple


_DRIFT_HISTORY_FILE = "drift_history.json"


def _eps() -> float:
    """Small epsilon to avoid log(0) or division by zero."""
    return 1e-6


def _psi(expected: np.ndarray, actual: np.ndarray, buckets: int = 10) -> float:
    """Population Stability Index.
    
    Mide el cambio en la distribución de una variable entre dos poblaciones.
    PSI < 0.1 → sin cambio significativo
    PSI 0.1-0.25 → cambio moderado, requiere revisión
    PSI > 0.25 → cambio severo, requiere acción
    """
    expected = np.asarray(expected, dtype=float)
    actual = np.asarray(actual, dtype=float)
    if len(expected) == 0 or len(actual) == 0:
        return 0.0

    all_vals = np.concatenate([expected, actual])
    if np.all(all_vals == all_vals[0]):
        return 0.0

    min_v, max_v = np.min(all_vals), np.max(all_vals)
    if max_v - min_v < _eps():
        return 0.0

    bins = np.linspace(min_v, max_v, buckets + 1)
    expected_counts, _ = np.histogram(expected, bins=bins)
    actual_counts, _ = np.histogram(actual, bins=bins)

    expected_pct = expected_counts / max(len(expected), 1)
    actual_pct = actual_counts / max(len(actual), 1)

    psi_val = 0.0
    for e_pct, a_pct in zip(expected_pct, actual_pct):
        e_pct = max(e_pct, _eps())
        a_pct = max(a_pct, _eps())
        psi_val += (a_pct - e_pct) * math.log(a_pct / e_pct)

    return psi_val


def _ks_statistic(expected: np.ndarray, actual: np.ndarray) -> Tuple[float, float]:
    """Kolmogorov-Smirnov test statistic.
    
    Retorna (D_statistic, p_value_approximation).
    D > 0.2 → diferencia significativa (threshold empírico)
    """
    expected = np.asarray(expected, dtype=float)
    actual = np.asarray(actual, dtype=float)

    if len(expected) == 0 or len(actual) == 0:
        return 0.0, 1.0

    expected_sorted = np.sort(expected)
    actual_sorted = np.sort(actual)

    all_vals = np.unique(np.concatenate([expected_sorted, actual_sorted]))
    if len(all_vals) == 0:
        return 0.0, 1.0

    d_stat = 0.0
    for v in all_vals:
        ecdf_expected = np.searchsorted(expected_sorted, v, side='right') / len(expected)
        ecdf_actual = np.searchsorted(actual_sorted, v, side='right') / len(actual)
        d_stat = max(d_stat, abs(ecdf_expected - ecdf_actual))

    n1, n2 = len(expected), len(actual)
    ne = n1 * n2 / (n1 + n2)
    p_value = 2.0 * math.exp(-2.0 * ne * d_stat * d_stat)
    p_value = min(p_value, 1.0)

    return d_stat, p_value


def _chi2_cramers(observed: np.ndarray, expected: np.ndarray,
                  categories: List[str]) -> Tuple[float, float]:
    """Chi-cuadrado para variables categóricas con V de Cramér.
    
    Retorna (chi2_stat, cramers_v).
    """
    observed_counts = np.zeros(len(categories))
    expected_counts = np.zeros(len(categories))

    obs_series = pd.Series(observed).value_counts()
    exp_series = pd.Series(expected).value_counts()

    for i, cat in enumerate(categories):
        observed_counts[i] = obs_series.get(cat, 0)
        expected_counts[i] = exp_series.get(cat, 0)

    # Normalizar expected_counts a misma suma que observed
    if expected_counts.sum() > 0:
        expected_counts = expected_counts / expected_counts.sum() * observed_counts.sum()

    chi2_stat = 0.0
    for o, e in zip(observed_counts, expected_counts):
        e = max(e, _eps())
        chi2_stat += (o - e) ** 2 / e

    n = observed_counts.sum()
    k = len(categories)
    cramers_v = math.sqrt(chi2_stat / max(n * (k - 1), 1)) if k > 1 else 0.0

    return chi2_stat, cramers_v


def detect_drift(model_id: str, reference_data: pd.DataFrame,
                 new_data: pd.DataFrame, meta: dict) -> Dict:
    """Detecta data drift entre datos de referencia (entrenamiento) y nuevos datos.
    
    Args:
        model_id: ID del modelo
        reference_data: DataFrame con datos de entrenamiento
        new_data: DataFrame con nuevos datos a evaluar
        meta: metadatos del modelo con num_features y cat_features
    
    Returns:
        dict con resultados de drift por feature y global
    """
    num_features = meta.get("num_features", [])
    cat_features = meta.get("cat_features", [])

    # Filtrar solo columnas que existen en ambos datasets
    common_cols = set(reference_data.columns) & set(new_data.columns)
    num_features = [f for f in num_features if f in common_cols]
    cat_features = [f for f in cat_features if f in common_cols]

    features_drift = []
    global_psi_sum = 0.0
    n_psi_features = 0

    # Drift en numéricas: KS + PSI
    for col in num_features:
        ref_vals = reference_data[col].dropna().values
        new_vals = new_data[col].dropna().values

        if len(ref_vals) < 5 or len(new_vals) < 5:
            continue

        d_stat, p_val = _ks_statistic(ref_vals, new_vals)
        psi_val = _psi(ref_vals, new_vals)

        ref_mean = float(np.mean(ref_vals))
        ref_std = float(np.std(ref_vals))
        new_mean = float(np.mean(new_vals))
        new_std = float(np.std(new_vals))

        mean_change_pct = ((new_mean - ref_mean) / max(abs(ref_mean), _eps())) * 100

        severity = "none"
        if psi_val > 0.25 or d_stat > 0.3:
            severity = "high"
        elif psi_val > 0.1 or d_stat > 0.2:
            severity = "medium"

        features_drift.append({
            "feature": col,
            "type": "numerical",
            "ks_statistic": round(d_stat, 4),
            "ks_p_value": round(p_val, 6),
            "psi": round(psi_val, 4),
            "ref_mean": round(ref_mean, 4),
            "ref_std": round(ref_std, 4),
            "new_mean": round(new_mean, 4),
            "new_std": round(new_std, 4),
            "mean_change_pct": round(mean_change_pct, 2),
            "severity": severity,
        })
        global_psi_sum += psi_val
        n_psi_features += 1

    # Drift en categóricas: Chi² + Cramér's V
    for col in cat_features:
        ref_vals = reference_data[col].dropna()
        new_vals = new_data[col].dropna()

        if len(ref_vals) < 5 or len(new_vals) < 5:
            continue

        categories = list(set(ref_vals.unique()) | set(new_vals.unique()))
        categories = [str(c) for c in categories]

        if len(categories) < 2:
            continue

        chi2_stat, cramers_v = _chi2_cramers(new_vals.values, ref_vals.values, categories)

        # Distribución de frecuencias
        ref_dist = ref_vals.value_counts(normalize=True).to_dict()
        new_dist = new_vals.value_counts(normalize=True).to_dict()

        severity = "none"
        if cramers_v > 0.3:
            severity = "high"
        elif cramers_v > 0.15:
            severity = "medium"

        features_drift.append({
            "feature": col,
            "type": "categorical",
            "chi2_statistic": round(chi2_stat, 4),
            "cramers_v": round(cramers_v, 4),
            "ref_distribution": {str(k): round(float(v), 4) for k, v in ref_dist.items()},
            "new_distribution": {str(k): round(float(v), 4) for k, v in new_dist.items()},
            "n_categories": len(categories),
            "severity": severity,
        })
        global_psi_sum += cramers_v
        n_psi_features += 1

    # Score global de drift
    avg_psi = global_psi_sum / max(n_psi_features, 1)
    n_high = sum(1 for f in features_drift if f["severity"] == "high")
    n_medium = sum(1 for f in features_drift if f["severity"] == "medium")

    if n_high > 0:
        global_severity = "high"
    elif n_medium > len(features_drift) * 0.3:
        global_severity = "high"
    elif n_medium > 0:
        global_severity = "medium"
    else:
        global_severity = "low" if avg_psi > 0.05 else "none"

    return {
        "model_id": model_id,
        "checked_at": datetime.now().isoformat(),
        "n_features_checked": len(features_drift),
        "n_features_drifted_high": n_high,
        "n_features_drifted_medium": n_medium,
        "global_avg_psi": round(avg_psi, 4),
        "global_severity": global_severity,
        "features": features_drift,
    }


def _load_history(base_dir: Path) -> Dict:
    """Carga el historial de drift desde JSON."""
    path = base_dir / _DRIFT_HISTORY_FILE
    if not path.exists():
        return {}
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, Exception):
        return {}


def _save_history(base_dir: Path, history: Dict) -> None:
    """Guarda el historial de drift."""
    path = base_dir / _DRIFT_HISTORY_FILE
    with open(path, 'w') as f:
        json.dump(history, f, indent=2)


def save_drift_check(base_dir: Path, model_id: str, result: Dict) -> None:
    """Persiste un chequeo de drift en el historial."""
    history = _load_history(base_dir)
    if model_id not in history:
        history[model_id] = []
    history[model_id].append({
        "checked_at": result["checked_at"],
        "global_severity": result["global_severity"],
        "global_avg_psi": result["global_avg_psi"],
        "n_features_checked": result["n_features_checked"],
        "n_drifted_high": result["n_features_drifted_high"],
        "n_drifted_medium": result["n_features_drifted_medium"],
    })
    # Mantener solo últimos 100 checks
    if len(history[model_id]) > 100:
        history[model_id] = history[model_id][-100:]
    _save_history(base_dir, history)


def get_drift_history(base_dir: Path, model_id: str,
                      limit: int = 20) -> List[Dict]:
    """Obtiene el historial de drift checks para un modelo."""
    history = _load_history(base_dir)
    entries = history.get(model_id, [])
    return entries[-limit:]
