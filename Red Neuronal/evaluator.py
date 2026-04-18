"""
evaluator.py - Evaluacion completa y predicciones explicadas.

Metricas:
  Binary    -> AUC-ROC, PR-AUC, F1, matriz de confusion
  Multiclass-> Accuracy, F1 ponderado, matriz de confusion
  Regression-> R2, RMSE, MAE, residuos
"""

import warnings

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    average_precision_score,
    classification_report,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_recall_curve,
    r2_score,
    roc_auc_score,
    roc_curve,
)

warnings.filterwarnings("ignore")
plt.style.use("seaborn-v0_8-darkgrid")


def evaluate(pipeline, splits: dict, meta: dict,
             bootstrap_models: list = None,
             X_new: pd.DataFrame = None) -> dict:
    """Evalua el modelo segun el tipo de problema."""
    problem_type = meta["problem_type"]
    X_test = splits["X_test"]
    y_test = splits["y_test"]

    if problem_type == "binary":
        results = _eval_binary(pipeline, X_test, y_test, meta)
    elif problem_type == "multiclass":
        results = _eval_multiclass(pipeline, X_test, y_test, meta)
    else:
        results = _eval_regression(pipeline, X_test, y_test, meta)

    if X_new is not None:
        results["predictions_new"] = predict(
            pipeline, X_new, meta, bootstrap_models
        )

    return results


def _eval_binary(pipeline, X_test, y_test, meta) -> dict:
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]
    classes = meta.get("target_classes") or ["0", "1"]

    y_test_eval = _normalize_binary_target(y_test)

    auc = roc_auc_score(y_test_eval, y_proba)
    ap = average_precision_score(y_test_eval, y_proba)

    print("\n" + "=" * 62)
    print("  EVALUACION - CLASIFICACION BINARIA")
    print("=" * 62)
    print(classification_report(
        y_test_eval, y_pred, target_names=[str(c) for c in classes]
    ))
    print(f"  AUC-ROC            : {auc:.4f}")
    print(f"  Average Precision  : {ap:.4f}")

    fig, axes = plt.subplots(2, 3, figsize=(16, 9))
    fig.suptitle("Evaluacion - Clasificacion Binaria", fontsize=14, fontweight="bold")

    fpr, tpr, _ = roc_curve(y_test_eval, y_proba)
    axes[0, 0].plot(fpr, tpr, lw=2, label=f"AUC = {auc:.3f}", color="darkorange")
    axes[0, 0].plot([0, 1], [0, 1], "k--", alpha=0.5)
    axes[0, 0].fill_between(fpr, tpr, alpha=0.15, color="orange")
    axes[0, 0].set(title="Curva ROC", xlabel="FPR", ylabel="TPR")
    axes[0, 0].legend()
    axes[0, 0].grid(alpha=0.3)

    pre, rec, _ = precision_recall_curve(y_test_eval, y_proba)
    axes[0, 1].plot(rec, pre, lw=2, label=f"AP = {ap:.3f}", color="green")
    axes[0, 1].set(title="Curva Precision-Recall", xlabel="Recall", ylabel="Precision")
    axes[0, 1].legend()
    axes[0, 1].grid(alpha=0.3)

    axes[0, 2].hist(
        y_proba[y_test_eval == 0], bins=20, alpha=0.6,
        label=str(classes[0]), color="red", density=True
    )
    axes[0, 2].hist(
        y_proba[y_test_eval == 1], bins=20, alpha=0.6,
        label=str(classes[1]), color="green", density=True
    )
    axes[0, 2].axvline(0.5, color="black", ls="--", alpha=0.7)
    axes[0, 2].set(title="Distribucion de probabilidades", xlabel="P(clase positiva)")
    axes[0, 2].legend()
    axes[0, 2].grid(alpha=0.3)

    ConfusionMatrixDisplay.from_estimator(
        pipeline, X_test, y_test_eval,
        display_labels=[str(c) for c in classes],
        ax=axes[1, 0], cmap="Blues", colorbar=False
    )
    axes[1, 0].set_title("Matriz de Confusion")

    eps = 1e-6
    res_p = (y_test_eval - y_proba) / np.sqrt(
        np.clip(y_proba * (1 - y_proba), eps, None)
    )
    axes[1, 1].scatter(
        y_proba, res_p, alpha=0.4, s=20, edgecolors="black", linewidths=0.3
    )
    axes[1, 1].axhline(0, color="red", ls="--", alpha=0.7)
    axes[1, 1].axhline(2, color="gray", ls=":", alpha=0.5)
    axes[1, 1].axhline(-2, color="gray", ls=":", alpha=0.5)
    axes[1, 1].set(title="Residuos de Pearson", xlabel="P predicha", ylabel="Residuo")
    axes[1, 1].grid(alpha=0.3)

    _plot_feature_importance(pipeline, meta, axes[1, 2])

    plt.tight_layout()
    plt.show()

    return dict(auc_roc=auc, average_precision=ap, y_pred=y_pred, y_proba=y_proba)


def _eval_multiclass(pipeline, X_test, y_test, meta) -> dict:
    y_pred = pipeline.predict(X_test)
    classes = meta.get("target_classes") or sorted(np.unique(y_test).tolist())

    acc = (y_pred == y_test).mean()
    f1 = f1_score(y_test, y_pred, average="weighted")

    print("\n" + "=" * 62)
    print("  EVALUACION - CLASIFICACION MULTICLASE")
    print("=" * 62)
    print(classification_report(
        y_test, y_pred, target_names=[str(c) for c in classes]
    ))
    print(f"  Accuracy   : {acc:.4f}")
    print(f"  F1 (prom.) : {f1:.4f}")

    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    fig.suptitle("Evaluacion - Clasificacion Multiclase", fontsize=14, fontweight="bold")

    ConfusionMatrixDisplay.from_estimator(
        pipeline, X_test, y_test,
        display_labels=[str(c) for c in classes],
        ax=axes[0], cmap="Blues", colorbar=False, xticks_rotation=45
    )
    axes[0].set_title("Matriz de Confusion")

    df_comp = pd.DataFrame({"Real": y_test, "Predicho": y_pred})
    df_comp["Real"] = df_comp["Real"].map(
        lambda x: str(classes[x]) if isinstance(x, (int, np.integer)) else str(x)
    )
    df_comp["Predicho"] = df_comp["Predicho"].map(
        lambda x: str(classes[x]) if isinstance(x, (int, np.integer)) else str(x)
    )
    df_comp["Real"].value_counts().plot(kind="bar", ax=axes[1], color="steelblue", alpha=0.7)
    df_comp["Predicho"].value_counts().plot(kind="bar", ax=axes[1], color="orange", alpha=0.5)
    axes[1].set_title("Distribucion: Real vs Predicho")
    axes[1].legend(["Real", "Predicho"])
    axes[1].grid(alpha=0.3)

    _plot_feature_importance(pipeline, meta, axes[2])

    plt.tight_layout()
    plt.show()

    return dict(accuracy=acc, f1_weighted=f1, y_pred=y_pred)


def _eval_regression(pipeline, X_test, y_test, meta) -> dict:
    y_pred = pipeline.predict(X_test)

    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)

    print("\n" + "=" * 62)
    print("  EVALUACION - REGRESION")
    print("=" * 62)
    print(f"  R2   : {r2:.4f}")
    print(f"  RMSE : {rmse:.4f}")
    print(f"  MAE  : {mae:.4f}")

    residuals = y_test - y_pred

    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    fig.suptitle("Evaluacion - Regresion", fontsize=14, fontweight="bold")

    lims = [min(y_test.min(), y_pred.min()), max(y_test.max(), y_pred.max())]
    axes[0].scatter(y_test, y_pred, alpha=0.4, s=20, edgecolors="black", lw=0.3)
    axes[0].plot(lims, lims, "r--", lw=1.5)
    axes[0].set(title=f"Real vs Predicho  (R2={r2:.3f})", xlabel="Real", ylabel="Predicho")
    axes[0].grid(alpha=0.3)

    axes[1].scatter(y_pred, residuals, alpha=0.4, s=20, edgecolors="black", lw=0.3)
    axes[1].axhline(0, color="red", ls="--")
    axes[1].set(title="Residuos vs Predicho", xlabel="Predicho", ylabel="Residuo")
    axes[1].grid(alpha=0.3)

    axes[2].hist(residuals, bins=30, edgecolor="black", alpha=0.7, color="steelblue")
    axes[2].set(title="Distribucion de Residuos", xlabel="Residuo", ylabel="Frecuencia")
    axes[2].grid(alpha=0.3)

    plt.tight_layout()
    plt.show()

    return dict(r2=r2, rmse=rmse, mae=mae, y_pred=y_pred)


def predict(pipeline, X_new: pd.DataFrame, meta: dict,
            bootstrap_models: list = None,
            alpha: float = 0.05) -> pd.DataFrame:
    """Genera predicciones mas explicativas para nuevas observaciones."""
    problem_type = meta["problem_type"]
    results = {"index": list(range(len(X_new)))}
    confidence_pct = int((1 - alpha) * 100)

    if problem_type == "regression":
        preds = pipeline.predict(X_new)
        results["prediccion"] = preds
        ic_lower = None
        ic_upper = None

        if bootstrap_models:
            boot_preds = np.array([m.predict(X_new) for m in bootstrap_models])
            ic_lower = np.percentile(boot_preds, alpha / 2 * 100, axis=0)
            ic_upper = np.percentile(boot_preds, (1 - alpha / 2) * 100, axis=0)
            results[f"ic_lower_{confidence_pct}"] = ic_lower
            results[f"ic_upper_{confidence_pct}"] = ic_upper

        results["explicacion"] = [
            _build_regression_explanation(
                pred=preds[i],
                ic_lower=None if ic_lower is None else ic_lower[i],
                ic_upper=None if ic_upper is None else ic_upper[i],
                confidence_pct=confidence_pct,
            )
            for i in range(len(preds))
        ]
        return _add_local_feature_reasoning(
            pipeline, X_new, meta, pd.DataFrame(results).set_index("index")
        )

    probas = pipeline.predict_proba(X_new)
    class_labels = _resolve_class_labels(pipeline, meta, probas.shape[1])
    best_idx = np.argmax(probas, axis=1)
    pred_probs = probas[np.arange(len(probas)), best_idx]
    predicted_raw = [class_labels[i] for i in best_idx]
    predicted_display = [_humanize_class_label(label, meta) for label in predicted_raw]

    results["clase_predicha"] = predicted_raw
    results["prediccion_legible"] = predicted_display
    results["probabilidad_predicha"] = pred_probs
    results["nivel_confianza"] = [_confidence_label(p) for p in pred_probs]

    for i, cls in enumerate(class_labels):
        results[f"prob_{cls}"] = probas[:, i]

    if problem_type == "binary":
        alt_idx = 1 - best_idx
        alt_raw = [class_labels[i] for i in alt_idx]
        alt_display = [_humanize_class_label(label, meta) for label in alt_raw]
        alt_probs = probas[np.arange(len(probas)), alt_idx]
        positive_label = _humanize_class_label(class_labels[1], meta)
        ic_lower = None
        ic_upper = None

        if bootstrap_models:
            boot_probas = np.array([m.predict_proba(X_new)[:, 1] for m in bootstrap_models])
            ic_lower = np.percentile(boot_probas, alpha / 2 * 100, axis=0)
            ic_upper = np.percentile(boot_probas, (1 - alpha / 2) * 100, axis=0)
            results[f"ic_lower_{confidence_pct}"] = ic_lower
            results[f"ic_upper_{confidence_pct}"] = ic_upper

        results["clase_alternativa"] = alt_raw
        results["clase_alternativa_legible"] = alt_display
        results["probabilidad_alternativa"] = alt_probs
        results["margen_decision"] = pred_probs - alt_probs
        results["explicacion"] = [
            _build_binary_explanation(
                predicted_label=predicted_display[i],
                predicted_prob=pred_probs[i],
                alternative_label=alt_display[i],
                alternative_prob=alt_probs[i],
                confidence_label=results["nivel_confianza"][i],
                positive_label=positive_label,
                ic_lower=None if ic_lower is None else ic_lower[i],
                ic_upper=None if ic_upper is None else ic_upper[i],
                confidence_pct=confidence_pct,
            )
            for i in range(len(predicted_display))
        ]
    else:
        sorted_idx = np.argsort(-probas, axis=1)
        second_idx = sorted_idx[:, 1] if probas.shape[1] > 1 else sorted_idx[:, 0]
        second_raw = [class_labels[i] for i in second_idx]
        second_display = [_humanize_class_label(label, meta) for label in second_raw]
        second_probs = probas[np.arange(len(probas)), second_idx]

        results["segunda_clase"] = second_raw
        results["segunda_clase_legible"] = second_display
        results["probabilidad_segunda_clase"] = second_probs
        results["margen_top_2"] = pred_probs - second_probs
        results["explicacion"] = [
            _build_multiclass_explanation(
                predicted_label=predicted_display[i],
                predicted_prob=pred_probs[i],
                second_label=second_display[i],
                second_prob=second_probs[i],
                confidence_label=results["nivel_confianza"][i],
            )
            for i in range(len(predicted_display))
        ]

    return _add_local_feature_reasoning(
        pipeline, X_new, meta, pd.DataFrame(results).set_index("index")
    )


def _normalize_binary_target(y_test):
    """Convierte targets binarios tipo texto a una representacion numerica."""
    if hasattr(y_test, "dtype") and str(y_test.dtype) == "object":
        values = pd.Series(y_test).astype(str).str.lower()
        if set(values.unique()) <= {"si", "no"}:
            return (values == "si").astype(int)
        return values.map(lambda x: 1 if x in {"1", "true", "si", "yes"} else 0)
    return y_test


def _resolve_class_labels(pipeline, meta: dict, n_classes: int) -> list:
    """Obtiene las clases en el mismo orden que predict_proba."""
    classes = meta.get("target_classes")
    if classes is not None and len(classes) == n_classes:
        return [str(c) for c in classes]

    model_classes = getattr(pipeline.named_steps["model"], "classes_", None)
    if model_classes is not None and len(model_classes) == n_classes:
        return [str(c) for c in model_classes]

    return [str(i) for i in range(n_classes)]


def _humanize_class_label(label, meta: dict) -> str:
    """Hace mas legibles las clases binarias 0/1 o true/false."""
    label_str = str(label)
    target_col = meta.get("target_col")

    if target_col:
        lower = label_str.lower()
        if lower in {"1", "true"}:
            return f"{target_col}=si"
        if lower in {"0", "false"}:
            return f"{target_col}=no"
    return label_str


def _confidence_label(probability: float) -> str:
    """Clasifica la confianza del modelo en lenguaje simple."""
    if probability >= 0.90:
        return "muy alta"
    if probability >= 0.75:
        return "alta"
    if probability >= 0.60:
        return "media"
    return "baja"


def _build_regression_explanation(pred, ic_lower, ic_upper, confidence_pct: int) -> str:
    """Genera una explicacion breve para regresion."""
    text = f"El modelo estima un valor de {pred:.4f}."
    if ic_lower is not None and ic_upper is not None:
        text += f" El rango esperado al {confidence_pct}% va de {ic_lower:.4f} a {ic_upper:.4f}."
    return text


def _build_binary_explanation(predicted_label, predicted_prob,
                              alternative_label, alternative_prob,
                              confidence_label, positive_label,
                              ic_lower, ic_upper,
                              confidence_pct: int) -> str:
    """Resume una prediccion binaria en lenguaje natural."""
    text = (
        f"El modelo se inclina por {predicted_label} con confianza "
        f"{confidence_label} ({predicted_prob:.1%}). "
        f"La alternativa {alternative_label} queda en {alternative_prob:.1%}."
    )
    if ic_lower is not None and ic_upper is not None:
        text += (
            f" La probabilidad estimada de {positive_label} se mueve entre "
            f"{ic_lower:.1%} y {ic_upper:.1%} (IC {confidence_pct}%)."
        )
    return text


def _build_multiclass_explanation(predicted_label, predicted_prob,
                                  second_label, second_prob,
                                  confidence_label) -> str:
    """Resume una prediccion multiclase en lenguaje natural."""
    return (
        f"El modelo predice {predicted_label} con confianza {confidence_label} "
        f"({predicted_prob:.1%}). La segunda opcion mas probable es "
        f"{second_label} ({second_prob:.1%})."
    )


def _add_local_feature_reasoning(pipeline, X_new: pd.DataFrame,
                                 meta: dict, pred_df: pd.DataFrame,
                                 top_k: int = 3) -> pd.DataFrame:
    """Agrega una explicacion local aproximada por feature."""
    baselines = meta.get("feature_baselines") or {}
    if pred_df.empty or not baselines:
        return pred_df

    X_local = X_new.reset_index(drop=True).copy()
    pred_local = pred_df.reset_index(drop=False).copy()

    factores_a_favor = []
    factores_en_contra = []
    explicaciones = []

    for pos in range(len(X_local)):
        row_df = X_local.iloc[[pos]].copy()
        row_pred = pred_local.iloc[pos]
        effects = _estimate_feature_effects(pipeline, row_df, row_pred, meta, baselines)
        top_positive = [effect for effect in effects if effect["delta"] > 0][:top_k]
        top_negative = [effect for effect in effects if effect["delta"] < 0][:top_k]

        if not top_positive and not top_negative:
            factores_a_favor.append("Sin factores claros a favor frente al caso de referencia.")
            factores_en_contra.append("Sin factores claros en contra frente al caso de referencia.")
            explicaciones.append(
                "De forma aproximada, esta prediccion queda muy cerca del caso de referencia."
            )
            continue

        factores_a_favor.append(
            "; ".join(
                _format_feature_effect(effect, meta["problem_type"])
                for effect in top_positive
            ) if top_positive else "Sin factores claros a favor."
        )
        factores_en_contra.append(
            "; ".join(
                _format_feature_effect(effect, meta["problem_type"])
                for effect in top_negative
            ) if top_negative else "Sin factores claros en contra."
        )
        explicaciones.append(
            _build_feature_reasoning(top_positive, top_negative, meta["problem_type"])
        )

    pred_local["factores_a_favor"] = factores_a_favor
    pred_local["factores_en_contra"] = factores_en_contra
    pred_local["explicacion_factores"] = explicaciones
    return pred_local.set_index("index")


def _estimate_feature_effects(pipeline, row_df: pd.DataFrame, row_pred: pd.Series,
                              meta: dict, baselines: dict) -> list:
    """Mide el efecto aproximado de cada variable contra un valor de referencia."""
    actual_score = _score_for_explanation(pipeline, row_df, row_pred, meta)
    effects = []

    for feature in row_df.columns:
        probe = row_df.copy()
        probe[feature] = probe[feature].astype(object)
        probe.at[probe.index[0], feature] = baselines.get(feature, np.nan)
        baseline_score = _score_for_explanation(pipeline, probe, row_pred, meta)
        delta = actual_score - baseline_score

        effects.append({
            "feature": feature,
            "actual": row_df.iloc[0][feature],
            "baseline": baselines.get(feature, np.nan),
            "delta": float(delta),
        })

    return sorted(effects, key=lambda item: abs(item["delta"]), reverse=True)


def _score_for_explanation(pipeline, row_df: pd.DataFrame,
                           row_pred: pd.Series, meta: dict) -> float:
    """Calcula el score de soporte para la prediccion actual."""
    problem_type = meta["problem_type"]

    if problem_type == "regression":
        return float(pipeline.predict(row_df)[0])

    probas = pipeline.predict_proba(row_df)[0]
    class_labels = _resolve_class_labels(pipeline, meta, len(probas))
    predicted_raw = str(row_pred.get("clase_predicha", ""))

    try:
        class_idx = class_labels.index(predicted_raw)
    except ValueError:
        class_idx = int(np.argmax(probas))

    return float(probas[class_idx])


def _format_feature_effect(effect: dict, problem_type: str) -> str:
    """Formatea un efecto de variable para salida humana."""
    actual = _format_feature_value(effect["actual"])
    baseline = _format_feature_value(effect["baseline"])

    if problem_type == "regression":
        direction = "sube" if effect["delta"] >= 0 else "baja"
        return (
            f"{effect['feature']}={actual} "
            f"({direction} {abs(effect['delta']):.3f} vs ref {baseline})"
        )

    direction = "a favor" if effect["delta"] >= 0 else "en contra"
    return (
        f"{effect['feature']}={actual} "
        f"({direction}, {abs(effect['delta']) * 100:.1f} pts vs ref {baseline})"
    )


def _build_feature_reasoning(top_positive: list, top_negative: list,
                             problem_type: str) -> str:
    """Resume en lenguaje natural las variables de mayor impacto."""
    if not top_positive and not top_negative:
        return "De forma aproximada, no aparece un factor dominante."

    parts = []

    if top_positive:
        favor = "; ".join(
            _format_feature_effect(effect, problem_type)
            for effect in top_positive
        )
        parts.append(f"a favor: {favor}")

    if top_negative:
        contra = "; ".join(
            _format_feature_effect(effect, problem_type)
            for effect in top_negative
        )
        parts.append(f"en contra: {contra}")

    return (
        "De forma aproximada, las variables que mas pesan frente al caso "
        f"de referencia son {'. '.join(parts)}."
    )


def _format_feature_value(value) -> str:
    """Formatea valores numericos y categoricos para mostrar."""
    if pd.isna(value):
        return "valor_referencia"
    if isinstance(value, (float, np.floating)):
        return f"{value:.3f}"
    return str(value)


def _plot_feature_importance(pipeline, meta, ax):
    """Grafica feature importances si el modelo las soporta."""
    model = pipeline.named_steps["model"]
    prep = pipeline.named_steps["preprocessor"]

    try:
        feature_names = prep.get_feature_names_out()
        feature_names = [n.split("__")[-1] for n in feature_names]
    except Exception:
        feature_names = None

    if hasattr(model, "feature_importances_"):
        imp = model.feature_importances_
        if feature_names and len(feature_names) == len(imp):
            idx = np.argsort(imp)[-15:]
            ax.barh([feature_names[i] for i in idx], imp[idx], color="steelblue", alpha=0.8)
        else:
            ax.barh(range(len(imp)), np.sort(imp)[::-1], color="steelblue", alpha=0.8)
        ax.set_title("Importancia de Features")
        ax.grid(alpha=0.3)

    elif hasattr(model, "coef_"):
        coef = np.abs(model.coef_).flatten()
        if feature_names and len(feature_names) == len(coef):
            idx = np.argsort(coef)[-15:]
            ax.barh([feature_names[i] for i in idx], coef[idx], color="darkorange", alpha=0.8)
        else:
            ax.barh(range(len(coef)), np.sort(coef)[::-1], color="darkorange", alpha=0.8)
        ax.set_title("|Coeficientes| del Modelo")
        ax.grid(alpha=0.3)

    else:
        ax.text(
            0.5, 0.5, "Importancia no disponible\npara este modelo",
            ha="center", va="center", transform=ax.transAxes,
            fontsize=11, color="gray"
        )
        ax.set_title("Importancia de Features")
        ax.axis("off")
