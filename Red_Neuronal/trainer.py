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
    train_test_split, cross_val_score, GridSearchCV,
    RandomizedSearchCV, StratifiedKFold, KFold
)
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

warnings.filterwarnings("ignore")
# Suprimir warning específico de sklearn 1.3+ sobre joblib/parallel
# (aparece cuando usamos n_jobs=-1 en RandomForest/XGBoost)
warnings.filterwarnings('ignore', 
    message='.*sklearn.utils.parallel.delayed.*',
    category=UserWarning)


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
                 multi_class=multiclass_strategy, solver="lbfgs",
                 class_weight="balanced")
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
        p = dict(n_estimators=200, max_depth=15,
                 random_state=seed, n_jobs=-1,
                 class_weight="balanced",
                 min_samples_split=3,
                 min_samples_leaf=2)
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

    self_weight = extra.pop("scale_pos_weight", None)

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
    else:
        if self_weight is not None:
            base["scale_pos_weight"] = self_weight

    return XGBClassifier(**base)


# ══════════════════════════════════════════════════════════════════
#  GRIDS DE HIPERPARÁMETROS POR MODELO
# ══════════════════════════════════════════════════════════════════

_MODEL_GRIDS = {
    "logistic": {
        "model__C": [0.01, 0.1, 1.0, 10.0],
        "model__max_iter": [1000, 2000],
        "model__solver": ["lbfgs", "liblinear"],
    },
    "softmax": {
        "model__C": [0.01, 0.1, 1.0, 10.0],
        "model__max_iter": [1000, 2000],
    },
    "mlp": {
        "model__hidden_layer_sizes": [(32, 16), (64, 32, 16), (128, 64, 32)],
        "model__alpha": [0.0001, 0.001, 0.01],
        "model__learning_rate_init": [0.001, 0.01],
    },
    "rf": {
        "model__n_estimators": [100, 200, 300],
        "model__max_depth": [10, 15, 20, None],
        "model__min_samples_split": [2, 3, 5],
        "model__min_samples_leaf": [1, 2],
    },
    "xgb": {
        "model__n_estimators": [100, 200, 300],
        "model__learning_rate": [0.01, 0.05, 0.1],
        "model__max_depth": [4, 6, 8],
        "model__subsample": [0.7, 0.8, 0.9],
        "model__colsample_bytree": [0.7, 0.8, 1.0],
    },
    "linear": {},
}


def _get_default_scoring(problem_type: str) -> str:
    if problem_type == "binary":
        return "roc_auc"
    elif problem_type == "multiclass":
        return "f1_weighted"
    return "r2"


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
#  HYPERPARAMETER TUNING
# ══════════════════════════════════════════════════════════════════

def tune_model(pipeline, X_train, y_train,
               model_key: str, problem_type: str,
               search_type: str = "grid",
               search_params: dict = None,
               cv_folds: int = 5,
               random_state: int = 42,
               n_iter: int = 20):
    """Aplica GridSearchCV o RandomizedSearchCV sobre el pipeline.

    Retorna:
        (best_pipeline, best_params)
    """
    param_grid = search_params or _MODEL_GRIDS.get(model_key, {})
    if not param_grid:
        print(f"  ℹ️ No hay hiperparámetros definidos para '{model_key}'")
        return pipeline, {}
    scoring = _get_default_scoring(problem_type)
    if search_type == "grid":
        searcher = GridSearchCV(
            pipeline, param_grid, cv=min(cv_folds, 5),
            scoring=scoring, n_jobs=-1, verbose=0,
            error_score="raise",
        )
    else:
        searcher = RandomizedSearchCV(
            pipeline, param_grid, n_iter=n_iter,
            cv=min(cv_folds, 5), scoring=scoring,
            n_jobs=-1, verbose=0, random_state=random_state,
            error_score="raise",
        )
    print(f"  🔍 Tuning {search_type.upper()} con {scoring}...", end=" ", flush=True)
    searcher.fit(X_train, y_train)
    print(f"✔ Mejores params: {searcher.best_params_}")
    return searcher.best_estimator_, searcher.best_params_


def _apply_smote(X_train, y_train, strategy: str,
                 random_state: int = 42):
    """Aplica SMOTE o ADASYN para balancear clases en entrenamiento.

    Retorna:
        (X_resampled, y_resampled) — copia aumentada sintéticamente.
    """
    try:
        if strategy == "smote":
            from imblearn.over_sampling import SMOTE
            sampler = SMOTE(random_state=random_state)
        else:
            from imblearn.over_sampling import ADASYN
            sampler = ADASYN(random_state=random_state)
    except ImportError:
        print("  ⚠️  imbalanced-learn no instalado. SMOTE no disponible.")
        return X_train, y_train

    from collections import Counter
    before = Counter(y_train)
    print(f"  ⚖️  Aplicando {strategy.upper()} para balancear clases...")
    X_res, y_res = sampler.fit_resample(X_train, y_train)
    after = Counter(y_res)
    print(f"    Antes: {dict(before)}  →  Después: {dict(after)}")
    return X_res, y_res


# ══════════════════════════════════════════════════════════════════
#  ENTRENAMIENTO CON VALIDACIÓN CRUZADA
# ══════════════════════════════════════════════════════════════════

def train(X, y, preprocessor, model_key: str,
          problem_type: str, meta: dict,
          test_size: float = 0.2,
          cv_folds: int = 5,
          random_state: int = 42,
          model_kwargs: dict = None,
          search_type: str = "none",
          search_params: dict = None,
          imbalance_strategy: str = "none",
          calibrate_nlp: bool = False):
    """Entrena el pipeline completo y evalúa con CV.

    Argumentos nuevos (v2):
        search_type        : 'none' | 'grid' | 'random'
        search_params      : dict con param_grid custom (pasa defaults si None)
        imbalance_strategy : 'none' | 'smote' | 'adasyn'
        calibrate_nlp     : Entrena calibrador NLP si True

    Retorna:
        pipeline     : Pipeline ajustado (preprocessor + modelo)
        splits       : dict con X_train, X_test, y_train, y_test
        cv_results   : dict con métricas de validación cruzada
        best_params  : dict con mejores hiperparámetros
        cal_payload  : dict con calibrador NLP entrenado (None si no se entrenó)
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
    # Para XGBoost binario con desbalance, calcular scale_pos_weight
    if model_key == "xgb" and problem_type == "binary":
        from collections import Counter
        counts = Counter(y_train)
        if len(counts) == 2:
            neg_count = min(counts.values())
            pos_count = max(counts.values())
            model_kwargs.setdefault("scale_pos_weight", neg_count / pos_count)
    estimator = build_model(model_key, problem_type,
                            n_classes=n_classes,
                            random_state=random_state,
                            **model_kwargs)
    pipeline = build_pipeline(preprocessor, estimator)

    # ── Hyperparameter tuning ─────────────────────────────────────
    best_params = {}
    if search_type in ("grid", "random"):
        pipeline, best_params = tune_model(
            pipeline, X_train, y_train,
            model_key=model_key, problem_type=problem_type,
            search_type=search_type, search_params=search_params,
            cv_folds=cv_folds, random_state=random_state,
        )

    # ── Imbalance handling ────────────────────────────────────────
    X_train_fit, y_train_fit = X_train, y_train
    if imbalance_strategy in ("smote", "adasyn"):
        X_train_fit, y_train_fit = _apply_smote(
            X_train, y_train, imbalance_strategy, random_state,
        )

    # ── Ajuste final ──────────────────────────────────────────────
    # Si hubo tuning, el pipeline ya está ajustado; si además hay
    # SMOTE, clonamos y reajustamos sobre datos balanceados.
    if search_type in ("grid", "random") and imbalance_strategy in ("smote", "adasyn"):
        pipeline = clone(pipeline)
        pipeline.fit(X_train_fit, y_train_fit)
    elif search_type not in ("grid", "random"):
        pipeline.fit(X_train_fit, y_train_fit)

    # ── Validación cruzada (siempre sobre datos originales) ─────
    cv_results = _cross_validate(
        pipeline, X, y, problem_type, cv_folds, random_state
    )

    # ── Log ─────────────────────────────────────────────────────
    _print_train_summary(model_key, problem_type, splits, cv_results, pipeline)

    # ── NLP Calibrator ─────────────────────────────────────────
    import sys as _sys
    cal_payload = None
    if calibrate_nlp:
        try:
            from ml_service.nlp_models import EmbeddingModel
            from Red_Neuronal.nlp_calibrator import train_calibrator

            _sys.stdout.write("  🔄 Entrenando calibrador NLP...\n")
            embed_model = EmbeddingModel.get_instance()
            cal_payload = train_calibrator(
                pipeline, X, y, meta, embed_model,
                n_val=min(100, len(X) // 3),
                random_state=random_state
            )
            if cal_payload.get("status") == "trained":
                _sys.stdout.write(f"  ✅ Calibrador NLP entrenado (score={cal_payload['score']:.3f})\n")
            else:
                _sys.stdout.write(f"  ⏭️  {cal_payload.get('reason', 'Calibrador no entrenado')}\n")
        except Exception as e:
            _sys.stdout.write(f"  ⚠️  Calibrador NLP omitido: {e}\n")
            cal_payload = None

    return pipeline, splits, cv_results, best_params, cal_payload


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
