"""
evaluator.py — Evaluación completa y visualizaciones por tipo de problema.

Métricas:
  Binario    → AUC-ROC, PR-AUC, F1, matriz de confusión, calibración
  Multiclase → Accuracy, F1 ponderado, matriz de confusión, top-k
  Regresión  → R², RMSE, MAE, residuos, valores reales vs predichos
"""

import warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    classification_report, roc_auc_score, roc_curve,
    precision_recall_curve, average_precision_score,
    ConfusionMatrixDisplay, r2_score,
    mean_squared_error, mean_absolute_error,
    confusion_matrix, f1_score,
)

warnings.filterwarnings("ignore")
plt.style.use("seaborn-v0_8-darkgrid")


# ══════════════════════════════════════════════════════════════════
#  FUNCIÓN PRINCIPAL
# ══════════════════════════════════════════════════════════════════

def evaluate(pipeline, splits: dict, meta: dict,
             bootstrap_models: list = None,
             X_new: pd.DataFrame = None) -> dict:
    """Evalúa el modelo según el tipo de problema.

    Argumentos:
        pipeline         : Pipeline ajustado (preprocessor + modelo)
        splits           : dict con X_train/X_test/y_train/y_test
        meta             : metadatos del dataset (de preprocessor.prepare_data)
        bootstrap_models : lista de pipelines bootstrap (para CI de predicción)
        X_new            : DataFrame de nuevas observaciones a predecir

    Retorna:
        results : dict con todas las métricas calculadas
    """
    problem_type = meta["problem_type"]
    X_test = splits["X_test"]
    y_test = splits["y_test"]

    if problem_type == "binary":
        results = _eval_binary(pipeline, X_test, y_test, meta)
    elif problem_type == "multiclass":
        results = _eval_multiclass(pipeline, X_test, y_test, meta)
    else:
        results = _eval_regression(pipeline, X_test, y_test, meta)

    # Predicciones para nuevas observaciones
    if X_new is not None:
        results["predictions_new"] = predict(
            pipeline, X_new, meta, bootstrap_models
        )

    return results


# ══════════════════════════════════════════════════════════════════
#  EVALUACIÓN BINARIA
# ══════════════════════════════════════════════════════════════════

def _eval_binary(pipeline, X_test, y_test, meta) -> dict:
    y_pred  = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]
    
    classes = meta.get("target_classes") or ["0", "1"]
    
    # Convertir y_test a numérico si es string
    y_test_orig = y_test.copy() if hasattr(y_test, 'copy') else y_test
    try:
        # Intentar convertir directamente
        if hasattr(y_test, 'dtype') and y_test.dtype == object:
            # Es string - convertir a 0/1
            if set(str(v).lower() for v in y_test.unique()) <= {'si', 'no'}:
                y_test = (y_test == 'si').astype(int)
            else:
                y_test = pd.Series(y_test).apply(lambda x: 1 if str(x).lower() == 'si' else 0)
        elif hasattr(y_test, 'dtype') and str(y_test.dtype) == 'object':
            y_test = (y_test == 'si').astype(int)
    except:
        pass
    
    # Ahora y_test debe ser numérico
    auc = roc_auc_score(y_test, y_proba)
    ap  = average_precision_score(y_test, y_proba)

    print("\n" + "═" * 62)
    print("  EVALUACIÓN — CLASIFICACIÓN BINARIA")
    print("═" * 62)
    print(classification_report(y_test, y_pred,
                                 target_names=[str(c) for c in classes]))
    print(f"  AUC-ROC            : {auc:.4f}")
    print(f"  Average Precision  : {ap:.4f}")

    # ── Gráficas ─────────────────────────────────────────────────
    fig, axes = plt.subplots(2, 3, figsize=(16, 9))
    fig.suptitle("Evaluación — Clasificación Binaria", fontsize=14, fontweight="bold")

    # 1. Curva ROC
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    axes[0, 0].plot(fpr, tpr, lw=2, label=f"AUC = {auc:.3f}", color="darkorange")
    axes[0, 0].plot([0, 1], [0, 1], "k--", alpha=0.5)
    axes[0, 0].fill_between(fpr, tpr, alpha=0.15, color="orange")
    axes[0, 0].set(title="Curva ROC", xlabel="FPR", ylabel="TPR")
    axes[0, 0].legend(); axes[0, 0].grid(alpha=0.3)

    # 2. Curva PR
    pre, rec, _ = precision_recall_curve(y_test, y_proba)
    axes[0, 1].plot(rec, pre, lw=2, label=f"AP = {ap:.3f}", color="green")
    axes[0, 1].set(title="Curva Precision-Recall",
                   xlabel="Recall", ylabel="Precision")
    axes[0, 1].legend(); axes[0, 1].grid(alpha=0.3)

    # 3. Distribución de probabilidades
    axes[0, 2].hist(y_proba[y_test == 0], bins=20, alpha=0.6,
                    label=str(classes[0]), color="red", density=True)
    axes[0, 2].hist(y_proba[y_test == 1], bins=20, alpha=0.6,
                    label=str(classes[1]), color="green", density=True)
    axes[0, 2].axvline(0.5, color="black", ls="--", alpha=0.7)
    axes[0, 2].set(title="Distribución de probabilidades", xlabel="P(clase positiva)")
    axes[0, 2].legend(); axes[0, 2].grid(alpha=0.3)

    # 4. Matriz de confusión
    ConfusionMatrixDisplay.from_estimator(
        pipeline, X_test, y_test,
        display_labels=[str(c) for c in classes],
        ax=axes[1, 0], cmap="Blues", colorbar=False
    )
    axes[1, 0].set_title("Matriz de Confusión")

    # 5. Residuos de Pearson
    eps = 1e-6
    res_p = (y_test - y_proba) / np.sqrt(
        np.clip(y_proba * (1 - y_proba), eps, None))
    axes[1, 1].scatter(y_proba, res_p, alpha=0.4, s=20,
                       edgecolors="black", linewidths=0.3)
    axes[1, 1].axhline(0, color="red", ls="--", alpha=0.7)
    axes[1, 1].axhline(2, color="gray", ls=":", alpha=0.5)
    axes[1, 1].axhline(-2, color="gray", ls=":", alpha=0.5)
    axes[1, 1].set(title="Residuos de Pearson",
                   xlabel="P predicha", ylabel="Residuo")
    axes[1, 1].grid(alpha=0.3)

    # 6. Feature importances (si disponible)
    _plot_feature_importance(pipeline, meta, axes[1, 2])

    plt.tight_layout(); plt.show()

    return dict(auc_roc=auc, average_precision=ap,
                y_pred=y_pred, y_proba=y_proba)


# ══════════════════════════════════════════════════════════════════
#  EVALUACIÓN MULTICLASE
# ══════════════════════════════════════════════════════════════════

def _eval_multiclass(pipeline, X_test, y_test, meta) -> dict:
    y_pred  = pipeline.predict(X_test)
    classes = meta.get("target_classes") or sorted(np.unique(y_test).tolist())

    acc = (y_pred == y_test).mean()
    f1  = f1_score(y_test, y_pred, average="weighted")

    print("\n" + "═" * 62)
    print("  EVALUACIÓN — CLASIFICACIÓN MULTICLASE")
    print("═" * 62)
    print(classification_report(y_test, y_pred,
                                 target_names=[str(c) for c in classes]))
    print(f"  Accuracy   : {acc:.4f}")
    print(f"  F1 (prom.) : {f1:.4f}")

    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    fig.suptitle("Evaluación — Clasificación Multiclase",
                 fontsize=14, fontweight="bold")

    # Matriz de confusión
    ConfusionMatrixDisplay.from_estimator(
        pipeline, X_test, y_test,
        display_labels=[str(c) for c in classes],
        ax=axes[0], cmap="Blues", colorbar=False, xticks_rotation=45
    )
    axes[0].set_title("Matriz de Confusión")

    # Distribución de clases predichas vs reales
    df_comp = pd.DataFrame({"Real": y_test, "Predicho": y_pred})
    df_comp["Real"]     = df_comp["Real"].map(lambda x: str(classes[x]) if isinstance(x, (int, np.integer)) else str(x))
    df_comp["Predicho"] = df_comp["Predicho"].map(lambda x: str(classes[x]) if isinstance(x, (int, np.integer)) else str(x))
    df_comp["Real"].value_counts().plot(kind="bar", ax=axes[1],
                                        color="steelblue", alpha=0.7)
    df_comp["Predicho"].value_counts().plot(kind="bar", ax=axes[1],
                                            color="orange", alpha=0.5)
    axes[1].set_title("Distribución: Real vs Predicho")
    axes[1].legend(["Real", "Predicho"]); axes[1].grid(alpha=0.3)

    # Feature importances
    _plot_feature_importance(pipeline, meta, axes[2])

    plt.tight_layout(); plt.show()

    return dict(accuracy=acc, f1_weighted=f1,
                y_pred=y_pred)


# ══════════════════════════════════════════════════════════════════
#  EVALUACIÓN DE REGRESIÓN
# ══════════════════════════════════════════════════════════════════

def _eval_regression(pipeline, X_test, y_test, meta) -> dict:
    y_pred = pipeline.predict(X_test)

    r2   = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae  = mean_absolute_error(y_test, y_pred)

    print("\n" + "═" * 62)
    print("  EVALUACIÓN — REGRESIÓN")
    print("═" * 62)
    print(f"  R²   : {r2:.4f}")
    print(f"  RMSE : {rmse:.4f}")
    print(f"  MAE  : {mae:.4f}")

    residuals = y_test - y_pred

    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    fig.suptitle("Evaluación — Regresión", fontsize=14, fontweight="bold")

    # 1. Real vs Predicho
    lims = [min(y_test.min(), y_pred.min()),
            max(y_test.max(), y_pred.max())]
    axes[0].scatter(y_test, y_pred, alpha=0.4, s=20, edgecolors="black", lw=0.3)
    axes[0].plot(lims, lims, "r--", lw=1.5)
    axes[0].set(title=f"Real vs Predicho  (R²={r2:.3f})",
                xlabel="Real", ylabel="Predicho")
    axes[0].grid(alpha=0.3)

    # 2. Residuos
    axes[1].scatter(y_pred, residuals, alpha=0.4, s=20,
                    edgecolors="black", lw=0.3)
    axes[1].axhline(0, color="red", ls="--")
    axes[1].set(title="Residuos vs Predicho",
                xlabel="Predicho", ylabel="Residuo")
    axes[1].grid(alpha=0.3)

    # 3. Distribución de residuos
    axes[2].hist(residuals, bins=30, edgecolor="black", alpha=0.7, color="steelblue")
    axes[2].set(title="Distribución de Residuos", xlabel="Residuo", ylabel="Frecuencia")
    axes[2].grid(alpha=0.3)

    plt.tight_layout(); plt.show()

    return dict(r2=r2, rmse=rmse, mae=mae, y_pred=y_pred)


# ══════════════════════════════════════════════════════════════════
#  PREDICCIÓN CON IC BOOTSTRAP
# ══════════════════════════════════════════════════════════════════

def predict(pipeline, X_new: pd.DataFrame, meta: dict,
            bootstrap_models: list = None,
            alpha: float = 0.05) -> pd.DataFrame:
    """Genera predicciones para nuevas observaciones.

    Agrega intervalos de confianza (1-alpha) si se proveen modelos bootstrap.
    Retorna DataFrame con predicciones y, opcionalmente, IC.
    """
    problem_type = meta["problem_type"]
    classes      = meta.get("target_classes")

    results = {"index": list(range(len(X_new)))}

    if problem_type == "regression":
        preds = pipeline.predict(X_new)
        results["prediccion"] = preds

        if bootstrap_models:
            boot_preds = np.array([m.predict(X_new) for m in bootstrap_models])
            results[f"ic_lower_{int((1-alpha)*100)}"] = np.percentile(
                boot_preds, alpha / 2 * 100, axis=0)
            results[f"ic_upper_{int((1-alpha)*100)}"] = np.percentile(
                boot_preds, (1 - alpha / 2) * 100, axis=0)

    else:
        preds = pipeline.predict(X_new)
        probas = pipeline.predict_proba(X_new)

        # Manejar tanto predicciones como índices o etiquetas directas
        if classes and hasattr(classes, '__getitem__') and hasattr(preds, '__iter__'):
            try:
                results["clase_predicha"] = [str(classes[p]) if isinstance(p, (int, np.integer)) else str(p) for p in preds]
            except (TypeError, IndexError):
                results["clase_predicha"] = [str(p) for p in preds]
        else:
            results["clase_predicha"] = [str(p) for p in preds] if hasattr(preds, '__iter__') else [str(preds)]
        for i, cls in enumerate(classes or range(probas.shape[1])):
            results[f"prob_{cls}"] = probas[:, i]

        if bootstrap_models and problem_type == "binary":
            boot_probas = np.array(
                [m.predict_proba(X_new)[:, 1] for m in bootstrap_models]
            )
            results[f"ic_lower_{int((1-alpha)*100)}"] = np.percentile(
                boot_probas, alpha / 2 * 100, axis=0)
            results[f"ic_upper_{int((1-alpha)*100)}"] = np.percentile(
                boot_probas, (1 - alpha / 2) * 100, axis=0)

    return pd.DataFrame(results).set_index("index")


# ══════════════════════════════════════════════════════════════════
#  AUXILIAR — IMPORTANCIA DE FEATURES
# ══════════════════════════════════════════════════════════════════

def _plot_feature_importance(pipeline, meta, ax):
    """Grafica feature importances si el modelo las soporta."""
    model = pipeline.named_steps["model"]
    prep  = pipeline.named_steps["preprocessor"]

    # Obtener nombres de features post-transformación
    try:
        feature_names = prep.get_feature_names_out()
        feature_names = [n.split("__")[-1] for n in feature_names]
    except Exception:
        feature_names = None

    # Random Forest / XGBoost → feature_importances_
    if hasattr(model, "feature_importances_"):
        imp = model.feature_importances_
        if feature_names and len(feature_names) == len(imp):
            idx  = np.argsort(imp)[-15:]
            ax.barh([feature_names[i] for i in idx], imp[idx],
                    color="steelblue", alpha=0.8)
        else:
            ax.barh(range(len(imp)), np.sort(imp)[::-1],
                    color="steelblue", alpha=0.8)
        ax.set_title("Importancia de Features")
        ax.grid(alpha=0.3)

    # Logistic / Linear → coef_
    elif hasattr(model, "coef_"):
        coef = np.abs(model.coef_).flatten()
        if feature_names and len(feature_names) == len(coef):
            idx  = np.argsort(coef)[-15:]
            ax.barh([feature_names[i] for i in idx], coef[idx],
                    color="darkorange", alpha=0.8)
        else:
            ax.barh(range(len(coef)), np.sort(coef)[::-1],
                    color="darkorange", alpha=0.8)
        ax.set_title("|Coeficientes| del Modelo")
        ax.grid(alpha=0.3)

    else:
        ax.text(0.5, 0.5, "Importancia no disponible\npara este modelo",
                ha="center", va="center", transform=ax.transAxes,
                fontsize=11, color="gray")
        ax.set_title("Importancia de Features")
        ax.axis("off")
