"""
shap_explainer.py - SHAP-based feature attribution for predictions.

Converts SHAP values into the same feature_contributions format
as the baseline perturbation method (evaluator.py).

Usage:
    from shap_explainer import compute_feature_contributions, select_background
    contribs = compute_feature_contributions(pipeline, X_row, meta, X_background)
"""

import warnings
warnings.filterwarnings("ignore")

try:
    import shap
    import numpy as np
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False

from collections import defaultdict
from sklearn.cluster import KMeans


def shap_available() -> bool:
    return HAS_SHAP


def compute_feature_contributions(pipeline, X_row, meta, X_background=None):
    """
    Compute SHAP-based feature contributions matching the existing format:
    [{feature, actual, baseline, delta, direction, abs_delta}, ...]

    Uses TreeExplainer for tree models (rf, xgb), KernelExplainer for others.

    Args:
        pipeline: sklearn Pipeline (preprocessor + model)
        X_row: DataFrame with 1 row of original features
        meta: model metadata dict (must include model_key, feature_baselines)
        X_background: DataFrame of training samples for KernelExplainer

    Returns:
        list of dicts (same format as evaluator's feature_contributions)
        or None if SHAP is unavailable / computation fails
    """
    if not HAS_SHAP:
        return None

    model = pipeline.named_steps["model"]
    model_key = meta.get("model_key", "")
    original_features = list(X_row.columns)
    is_tree = model_key in ("rf", "xgb")

    if is_tree:
        result = _compute_tree_shap(pipeline, X_row, original_features)
    else:
        if X_background is None or len(X_background) == 0:
            return None
        result = _compute_kernel_shap(pipeline, X_row, original_features, X_background)

    if result is None:
        return None

    shap_per_feat, expected_value = result

    baselines = meta.get("feature_baselines", {})
    contribs = []
    for feat in original_features:
        sv = shap_per_feat.get(feat, 0.0)
        actual_val = X_row.iloc[0][feat] if feat in X_row.columns else "N/A"
        baseline_val = baselines.get(feat)

        contribs.append({
            "feature": str(feat),
            "actual": _fmt(actual_val),
            "baseline": _fmt(baseline_val) if baseline_val is not None else f"{expected_value:.4f}",
            "delta": round(sv, 4),
            "direction": "a_favor" if sv > 0 else "en_contra",
            "abs_delta": round(abs(sv), 4),
        })

    contribs.sort(key=lambda x: x["abs_delta"], reverse=True)
    return contribs


def _compute_tree_shap(pipeline, X_row, original_features):
    """Compute SHAP values using TreeExplainer, mapping back to original features."""
    try:
        preprocessor = pipeline.named_steps["preprocessor"]
        X_processed = preprocessor.transform(X_row)
        model = pipeline.named_steps["model"]

        explainer = shap.TreeExplainer(model)
        sv = explainer.shap_values(X_processed)
        ev = explainer.expected_value

        sv, ev = _normalize_shap_output(sv, ev)

        try:
            proc_names = preprocessor.get_feature_names_out()
        except Exception:
            proc_names = None

        if proc_names is not None:
            feat_groups = _map_preprocessed_to_original(proc_names, original_features)

            shap_per_feat = {}
            for orig, indices in feat_groups.items():
                shap_per_feat[orig] = sum(float(sv[0][idx]) for idx in indices)
        else:
            shap_per_feat = {}
            for i, feat in enumerate(original_features):
                shap_per_feat[feat] = float(sv[0][i]) if i < sv.shape[1] else 0.0

        expected_value = float(ev) if not isinstance(ev, np.ndarray) else float(ev.item())
        return shap_per_feat, expected_value

    except Exception:
        return None


def _compute_kernel_shap(pipeline, X_row, original_features, X_background):
    """Compute SHAP values using KernelExplainer on original features."""
    try:
        explainer = shap.KernelExplainer(pipeline.predict_proba, X_background)
        sv = explainer.shap_values(X_row)
        ev = explainer.expected_value

        sv, ev = _normalize_shap_output(sv, ev)

        expected_value = float(ev) if not isinstance(ev, np.ndarray) else float(ev.item())

        shap_per_feat = {}
        for i, feat in enumerate(original_features):
            shap_per_feat[feat] = float(sv[0][i]) if i < sv.shape[1] else 0.0

        return shap_per_feat, expected_value

    except Exception:
        return None


def _normalize_shap_output(shap_values, expected_value):
    """Normalize SHAP output to 2D array and scalar expected value."""
    if isinstance(shap_values, list):
        shap_values = shap_values[1] if len(shap_values) > 1 else shap_values[0]
        if isinstance(expected_value, (list, np.ndarray)) and len(expected_value) > 1:
            expected_value = expected_value[1]
        elif isinstance(expected_value, (list, np.ndarray)):
            expected_value = expected_value[0]

    if isinstance(expected_value, (list, np.ndarray)):
        expected_value = expected_value[0] if len(expected_value) > 0 else 0.0

    if hasattr(shap_values, 'shape') and len(shap_values.shape) == 3:
        shap_values = shap_values[:, :, 1]

    return shap_values, expected_value


def _map_preprocessed_to_original(proc_names, original_features):
    """Map preprocessed feature names (e.g. 'num__edad', 'cat__feature__value')
    back to original column names.

    Returns dict: {original_feature_name: [indices_in_preprocessed_array]}
    """
    sorted_originals = sorted(original_features, key=len, reverse=True)

    groups = defaultdict(list)
    for idx, pname in enumerate(proc_names):
        parts = pname.split("__")
        if len(parts) >= 2:
            remainder = "__".join(parts[1:])
        else:
            remainder = pname

        if remainder in original_features:
            groups[remainder].append(idx)
        else:
            matched = False
            for orig in sorted_originals:
                if remainder.startswith(orig + "__") or remainder == orig:
                    groups[orig].append(idx)
                    matched = True
                    break
            if not matched:
                groups[remainder.split("_")[0]].append(idx)

    return groups


def select_background(X_train, n_samples=50):
    """Select representative samples from training data for KernelExplainer.

    Uses KMeans clustering to pick n_samples centroids from the training data.
    Falls back to random sampling if KMeans fails.

    Args:
        X_train: DataFrame of training features (original, unpreprocessed)
        n_samples: number of background samples (default 50)

    Returns:
        DataFrame with n_samples rows
    """
    if len(X_train) <= n_samples:
        return X_train.reset_index(drop=True)

    X_numeric = X_train.select_dtypes(include=[np.number]).dropna(axis=1)
    if X_numeric.shape[1] == 0 or X_numeric.shape[1] < 2:
        return X_train.iloc[:n_samples].reset_index(drop=True)

    k = min(n_samples, len(X_numeric))
    try:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=3, max_iter=100)
        kmeans.fit(X_numeric)

        from sklearn.metrics.pairwise import euclidean_distances
        indices = []
        for center in kmeans.cluster_centers_:
            dists = euclidean_distances(X_numeric, [center]).flatten()
            indices.append(int(np.argmin(dists)))

        return X_train.iloc[indices].reset_index(drop=True)
    except Exception:
        return X_train.iloc[:n_samples].reset_index(drop=True)


def _fmt(val):
    if val is None:
        return "N/A"
    if isinstance(val, (float, np.floating)):
        return f"{val:.4f}"
    return str(val)
