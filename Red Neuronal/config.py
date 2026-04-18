"""
config.py — Configuración global del sistema
"""

# ────────────────────────────────────────────
# FUENTES DE DATOS DISPONIBLES
# ────────────────────────────────────────────
DATA_SOURCES = {
    "csv":      "Archivo CSV local",
    "excel":    "Archivo Excel local",
    "api":      "API REST (GET JSON)",
    "sql":      "Base de datos SQL (SQLite / PostgreSQL)",
    "synthetic": "Datos sintéticos de ejemplo",
}

# ────────────────────────────────────────────
# TIPOS DE PROBLEMA SOPORTADOS
# ────────────────────────────────────────────
PROBLEM_TYPES = {
    "binary":      "Clasificación binaria  (Sí / No)",
    "multiclass":  "Clasificación multiclase (A, B, C …)",
    "regression":  "Regresión  (valor numérico continuo)",
}

# ────────────────────────────────────────────
# MODELOS DISPONIBLES POR TIPO DE PROBLEMA
# ────────────────────────────────────────────
MODELS = {
    "binary": {
        "logistic":  "Regresión Logística",
        "mlp":       "Red Neuronal (MLP)",
        "rf":        "Random Forest",
        "xgb":       "XGBoost",
    },
    "multiclass": {
        "softmax":   "Regresión Softmax",
        "mlp":       "Red Neuronal (MLP)",
        "rf":        "Random Forest",
        "xgb":       "XGBoost",
    },
    "regression": {
        "linear":    "Regresión Lineal",
        "mlp":       "Red Neuronal (MLP)",
        "rf":        "Random Forest Regressor",
        "xgb":       "XGBoost Regressor",
    },
}

# ────────────────────────────────────────────
# PARÁMETROS POR DEFECTO DE ENTRENAMIENTO
# ────────────────────────────────────────────
TRAIN_DEFAULTS = {
    "test_size":        0.2,
    "random_state":     42,
    "cv_folds":         5,
    "bootstrap_n":      100,
    "mlp_layers":       (64, 32, 16),
    "mlp_max_iter":     600,
    "rf_n_estimators":  200,
}
