"""
trainer.py — Entrenamiento modular con soporte para múltiples algoritmos.

Soporta:
  • Clasificación binaria    → LogisticRegression, MLP, RandomForest, XGBoost
  • Clasificación multiclase → mismos algoritmos con configuración automática
  • Regresión                → LinearRegression, MLP, RandomForest, XGBoost

Incluye:
  • Validación cruzada estratificada (o KFold para regresión)
  • Bootstrap de modelos para intervalos de confianza
  • Early stopping (MLP y XGBoost)
  • Selección automática de métricas por tipo de problema
"""

import warnings
import numpy as np
from sklearn.base import clone
from sklearn.pipeline import Pipeline
from sklearn.model_selection import (
    train_test_split, cross_val_score,
    StratifiedKFold, KFold
)
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

warnings.filterwarnings("ignore")


# ══════════════════════════════════════════════════════════════════
#  FÁBRICA DE MODELOS
# ══════════════════════════════════════════════════════════════════

def build_model(model_key: str, problem_type: str,
                n_classes: int = 2, **kwargs) -> object:
    """Instancia el modelo sklearn/xgb correcto.

    Argumentos:
        model_key    : 'logistic'|'mlp'|'rf'|'xgb'|'linear'|'softmax'
        problem_type : 'binary'|'multiclass'|'regression'
        n_classes    : número de clases (solo para multiclase)
        **kwargs     : hiperparámetros extra que sobreescriben los defaults

    Retorna: estimador sin ajustar
    """

    seed = kwargs.pop("random_state", 42)

    # ── Regresión ─────────────────────────────────────────────────
    if problem_type == "regression":
        if model_key == "linear":
            return LinearRegression()

        if model_key == "mlp":
            p = dict(hidden_layer_sizes=(64, 32, 16),
                     activation="relu", solver="adam",
                     alpha=0.001, max_iter=600,
                     early_stopping=True, validation_fraction=0.15,
                     n_iter_no_change=20, random_state=seed)
            p.update(kwargs)
            return MLPRegressor(**p)

        if model_key == "rf":
            p = dict(n_estimators=200, max_depth=None,
                     random_state=seed, n_jobs=-1)
            p.update(kwargs)
            return RandomForestRegressor(**p)

        if model_key == "xgb":
            return _build_xgb("regression", n_classes, seed, kwargs)

        raise ValueError(f"Modelo '{model_key}' no disponible para regresión.")

    # ── Clasificación (binaria / multiclase) ─────────────────────
    multiclass_strategy = "multinomial" if problem_type == "multiclass" else "auto"

    if model_key in ("logistic", "softmax"):
        p = dict(max_iter=1000, random_state=seed,
                 multi_class=multiclass_strategy, solver="lbfgs")
        p.update(kwargs)
        return LogisticRegression(**p)

    if model_key == "mlp":
        p = dict(hidden_layer_sizes=(64, 32, 16),
                 activation="relu", solver="adam",
                 alpha=0.001, max_iter=600,
                 early_stopping=True, validation_fraction=0.15,
                 n_iter_no_change=20, random_state=seed)
        p.update(kwargs)
        return MLPClassifier(**p)

    if model_key == "rf":
        p = dict(n_estimators=200, max_depth=None,
                 random_state=seed, n_jobs=-1)
        p.update(kwargs)
        return RandomForestClassifier(**p)

    if model_key == "xgb":
        return _build_xgb(problem_type, n_classes, seed, kwargs)

    raise ValueError(
        f"Modelo '{model_key}' no reconocido. "
        "Opciones: logistic, softmax, mlp, rf, xgb, linear"
    )


def _build_xgb(problem_type, n_classes, seed, extra):
    """Instancia XGBoost con configuración correcta según el problema."""
    try:
        from xgboost import XGBClassifier, XGBRegressor
    except ImportError:
        raise ImportError("Instala xgboost: pip install xgboost")

    base = dict(n_estimators=300, learning_rate=0.05,
                max_depth=6, subsample=0.8,
                use_label_encoder=False, eval_metric="logloss",
                random_state=seed, n_jobs=-1)
    base.update(extra)

    if problem_type == "regression":
        base.pop("use_label_encoder", None)
        base.pop("eval_metric", None)
        return XGBRegressor(**base)

    if problem_type == "multiclass":
        base["objective"]  = "multi:softprob"
        base["num_class"]  = n_classes
        base["eval_metric"]= "mlogloss"

    return XGBClassifier(**base)


# ══════════════════════════════════════════════════════════════════
#  PIPELINE COMPLETO  (preprocessor + modelo)
# ══════════════════════════════════════════════════════════════════

def build_pipeline(preprocessor, estimator) -> Pipeline:
    """Envuelve copias independientes de preprocessor + estimador en un Pipeline."""
    return Pipeline([
        ("preprocessor", clone(preprocessor)),
        ("model",        clone(estimator)),
    ])


# ══════════════════════════════════════════════════════════════════
#  ENTRENAMIENTO CON VALIDACIÓN CRUZADA
# ══════════════════════════════════════════════════════════════════

def train(X, y, preprocessor, model_key: str,
          problem_type: str, meta: dict,
          test_size: float = 0.2,
          cv_folds: int = 5,
          random_state: int = 42,
          model_kwargs: dict = None):
    """Entrena el pipeline completo y evalúa con CV.

    Retorna:
        pipeline   : Pipeline ajustado (preprocessor + modelo)
        splits     : dict con X_train, X_test, y_train, y_test
        cv_results : dict con métricas de validación cruzada
    """
    model_kwargs = model_kwargs or {}
    n_classes    = len(meta.get("target_classes") or [])
    n_samples    = len(X)

    # ── Ajustar cv_folds según tamaño del dataset ────────────
    # Si hay pocas muestras, reducir folds automáticamente
    if n_samples < 20 and cv_folds > 3:
        cv_folds = max(2, n_samples // 5)
        print(f"  ⚠️  Dataset pequeño ({n_samples} samples). CV folds ajustado a {cv_folds}")
    elif n_samples < 10:
        cv_folds = 2
    
    # ── Split ─────────────────────────────────────────────────────
    # Verificar si podemos stratificar (necesitamos al menos 2 samples por clase)
    can_stratify = problem_type != "regression" and len(np.unique(y)) >= 2
    
    # Además verificar que cada clase tenga al menos 2 samples
    if can_stratify:
        from collections import Counter
        class_counts = Counter(y)
        if min(class_counts.values()) < 2:
            can_stratify = False
            print(f"  ⚠️  No se puede stratificar (clase mínima < 2 samples). Usando split simple.")
    
    stratify = y if can_stratify else None
    
    # Si test_size resulta en muy pocas muestras, ajustar
    min_test_samples = max(1, int(n_samples * test_size))
    if min_test_samples < 1:
        test_size = 1 / n_samples if n_samples > 1 else 0.2
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=stratify,
    )

    splits = dict(X_train=X_train, X_test=X_test,
                  y_train=y_train, y_test=y_test)

    # ── Construir pipeline ────────────────────────────────────────
    estimator = build_model(model_key, problem_type,
                            n_classes=n_classes,
                            random_state=random_state,
                            **model_kwargs)
    pipeline = build_pipeline(preprocessor, estimator)

    # ── Ajuste ───────────────────────────────────────────────────
    pipeline.fit(X_train, y_train)

    # ── Validación cruzada ─────────────────────────────────────
    cv_results = _cross_validate(
        pipeline, X, y, problem_type, cv_folds, random_state
    )

    # ── Log ─────────────────────────────────────────────────────
    _print_train_summary(model_key, problem_type, splits, cv_results, pipeline)

    return pipeline, splits, cv_results


def _cross_validate(pipeline, X, y, problem_type, cv_folds, random_state):
    """Ejecuta validación cruzada y retorna métricas relevantes."""
    import warnings
    
    if problem_type == "regression":
        cv = KFold(n_splits=cv_folds, shuffle=True, random_state=random_state)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            r2    = cross_val_score(pipeline, X, y, cv=cv, scoring="r2", error_score="raise")
            rmse  = np.sqrt(-cross_val_score(
                pipeline, X, y, cv=cv, scoring="neg_mean_squared_error", error_score="raise"))
        return {"r2": r2, "rmse": rmse}

    cv = StratifiedKFold(n_splits=cv_folds, shuffle=True,
                         random_state=random_state)
    
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        try:
            acc = cross_val_score(pipeline, X, y, cv=cv, scoring="accuracy", error_score="raise")
        except Exception as e:
            print(f"  ⚠️  Error en CV accuracy: {e}")
            acc = None

        if problem_type == "binary":
            try:
                auc = cross_val_score(pipeline, X, y, cv=cv, scoring="roc_auc", error_score="raise")
            except Exception as e:
                print(f"  ⚠️  Error en CV AUC: {e}")
                auc = None
            return {"accuracy": acc, "auc_roc": auc}

        # Multiclase
        try:
            f1 = cross_val_score(pipeline, X, y, cv=cv,
                                scoring="f1_weighted", error_score="raise")
        except Exception as e:
            print(f"  ⚠️  Error en CV f1: {e}")
            f1 = None
        return {"accuracy": acc, "f1_weighted": f1}


def _print_train_summary(model_key, problem_type, splits, cv_results, pipeline):
    sep = "─" * 55
    print(f"\n{sep}")
    print(f"  ENTRENAMIENTO COMPLETADO")
    print(sep)
    print(f"  Modelo      : {model_key.upper()}")
    print(f"  Problema    : {problem_type.upper()}")
    print(f"  Train/Test  : {len(splits['X_train']):,} / {len(splits['X_test']):,} filas")

    # Iteraciones (MLP)
    model = pipeline.named_steps["model"]
    if hasattr(model, "n_iter_"):
        print(f"  Iteraciones : {model.n_iter_}")

    print(f"\n  Validación cruzada:")
    for metric, values in cv_results.items():
        if values is not None and hasattr(values, 'mean'):
            print(f"    {metric:<18} {values.mean():.4f}  (±{values.std():.4f})")
        else:
            print(f"    {metric:<18} N/A")
    print(sep)


# ══════════════════════════════════════════════════════════════════
#  BOOTSTRAP DE MODELOS  (intervalos de confianza de predicción)
# ══════════════════════════════════════════════════════════════════

def bootstrap_models(X_train, y_train, preprocessor, model_key: str,
                     problem_type: str, meta: dict,
                     n_bootstraps: int = 100,
                     random_state: int = 42) -> list:
    """Entrena n_bootstraps modelos sobre muestras bootstrap.

    Se usa para estimar intervalos de confianza empíricos en predicción.
    Retorna lista de pipelines ajustados.
    """
    n_classes = len(meta.get("target_classes") or [])
    modelos   = []
    np.random.seed(random_state)
    n         = len(X_train)

    print(f"  Entrenando {n_bootstraps} modelos bootstrap", end="", flush=True)

    for i in range(n_bootstraps):
        idx   = np.random.choice(n, n, replace=True)
        X_b   = X_train.iloc[idx] if hasattr(X_train, 'iloc') else X_train[idx]
        # Manejar tanto numpy arrays como pandas Series
        if isinstance(y_train, np.ndarray):
            y_b = y_train[idx]
        elif hasattr(y_train, 'iloc'):
            y_b = y_train.iloc[idx]
        else:
            y_b = np.array(y_train)[idx]

        # Saltar si solo hay una clase (bootstrap puede ser desbalanceado)
        if problem_type != "regression" and len(np.unique(y_b)) < 2:
            continue

        try:
            est  = build_model(model_key, problem_type,
                               n_classes=n_classes,
                               random_state=random_state + i)
            pipe = build_pipeline(preprocessor, est)
            pipe.fit(X_b, y_b)
            modelos.append(pipe)
        except Exception:
            continue

        if (i + 1) % 25 == 0:
            print(".", end="", flush=True)

    print(f" ✔  ({len(modelos)}/{n_bootstraps} válidos)")
    return modelos
