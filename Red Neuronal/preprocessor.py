"""
preprocessor.py — Detección automática de columnas y preprocesamiento.

Capacidades:
  • Detecta el tipo de problema (binario / multiclase / regresión) mirando el target
  • Separa features numéricas y categóricas automáticamente
  • Imputa valores nulos con mediana (num) o moda (cat)
  • Codifica variables categóricas (OneHot)
  • Escala variables numéricas (StandardScaler)
  • Genera un reporte completo del dataset
"""

import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.impute import SimpleImputer


# ══════════════════════════════════════════════════════════════════
#  DETECCIÓN AUTOMÁTICA
# ══════════════════════════════════════════════════════════════════

def detect_problem_type(series: pd.Series) -> str:
    """Infiere el tipo de problema a partir de la columna target.

    Reglas:
        • 2  valores únicos                    → 'binary'
        • 3–20 valores únicos O dtype object   → 'multiclass'
        • Numérico continuo (>20 únicos)       → 'regression'
    """
    n_unique = series.nunique()
    dtype    = series.dtype

    if n_unique == 2:
        return "binary"
    if n_unique <= 20 or dtype == object:
        return "multiclass"
    return "regression"


def detect_columns(df: pd.DataFrame, target: str):
    """Clasifica las columnas del DataFrame automáticamente.

    Retorna:
        num_features  : lista de columnas numéricas (excluyendo target)
        cat_features  : lista de columnas categóricas/object (excluyendo target)
    """
    feature_cols = [c for c in df.columns if c != target]

    num_features = df[feature_cols].select_dtypes(
        include=["int64", "float64", "int32", "float32"]
    ).columns.tolist()

    cat_features = df[feature_cols].select_dtypes(
        include=["object", "category", "bool"]
    ).columns.tolist()

    return num_features, cat_features


# ══════════════════════════════════════════════════════════════════
#  REPORTE DE DATOS
# ══════════════════════════════════════════════════════════════════

def data_report(df: pd.DataFrame, target: str, problem_type: str,
                num_features: list, cat_features: list) -> None:
    """Imprime un reporte exploratorio completo del dataset."""

    sep = "═" * 62
    print(f"\n{sep}")
    print("  REPORTE AUTOMÁTICO DEL DATASET")
    print(sep)
    print(f"  Filas          : {len(df):,}")
    print(f"  Columnas total : {df.shape[1]}")
    print(f"  Target         : '{target}'")
    print(f"  Tipo problema  : {problem_type.upper()}")
    print(f"  Features num.  : {len(num_features)}  → {num_features}")
    print(f"  Features cat.  : {len(cat_features)}  → {cat_features}")

    # Nulos
    null_counts = df.isnull().sum()
    null_cols   = null_counts[null_counts > 0]
    if null_cols.empty:
        print("  Valores nulos  : ninguno ✔")
    else:
        print(f"  Valores nulos  :")
        for col, cnt in null_cols.items():
            print(f"      {col}: {cnt} ({cnt/len(df):.1%})")

    # Distribución del target
    print(f"\n  Distribución del target ('{target}'):")
    vc = df[target].value_counts(normalize=True)
    for val, pct in vc.items():
        bar = "█" * int(pct * 30)
        print(f"      {str(val):>12}  {bar} {pct:.1%}")

    # Estadísticas de features numéricas
    if num_features:
        print(f"\n  Estadísticas numéricas:")
        stats = df[num_features].describe().T[["mean", "std", "min", "max"]]
        stats.columns = ["Media", "Std", "Mín", "Máx"]
        print(stats.round(2).to_string())

    print(f"\n{sep}\n")


# ══════════════════════════════════════════════════════════════════
#  PIPELINE DE PREPROCESAMIENTO
# ══════════════════════════════════════════════════════════════════

def build_preprocessor(num_features: list, cat_features: list) -> ColumnTransformer:
    """Construye un ColumnTransformer que:

        Numéricas  → imputación mediana + StandardScaler
        Categóricas→ imputación moda   + OneHotEncoder (handle_unknown='ignore')
    """
    transformers = []

    if num_features:
        num_pipeline = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler",  StandardScaler()),
        ])
        transformers.append(("num", num_pipeline, num_features))

    if cat_features:
        cat_pipeline = Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ])
        transformers.append(("cat", cat_pipeline, cat_features))

    if not transformers:
        raise ValueError("No se encontraron features numéricas ni categóricas.")

    return ColumnTransformer(transformers=transformers, remainder="drop")


def encode_target(y: pd.Series, problem_type: str):
    """Codifica el target si es necesario.

    Binario/Multiclase con texto → LabelEncoder
    Regresión                    → sin cambio
    Retorna (y_encoded, label_encoder_or_None)
    """
    if problem_type == "regression":
        return y.astype(float), None

    if y.dtype == object or y.dtype.name == "category":
        le = LabelEncoder()
        y_enc = le.fit_transform(y)
        print(f"  ✔ Target codificado: {dict(enumerate(le.classes_))}")
        return y_enc, le

    # Numérico ya codificado
    return y.values, None


# ══════════════════════════════════════════════════════════════════
#  FUNCIÓN PRINCIPAL
# ══════════════════════════════════════════════════════════════════

def prepare_data(df: pd.DataFrame,
                 target: str,
                 problem_type: str = "auto",
                 exclude_cols: list = None,
                 verbose: bool = True):
    """Pipeline completo de preparación de datos.

    Argumentos:
        df           : DataFrame de entrada
        target       : nombre de la columna objetivo
        problem_type : 'auto' | 'binary' | 'multiclass' | 'regression'
        exclude_cols : columnas a ignorar (IDs, fechas, etc.)
        verbose      : imprimir reporte

    Retorna:
        X_raw        : DataFrame con features (sin escalar)
        y            : array del target (codificado si aplica)
        preprocessor : ColumnTransformer ajustado
        meta         : dict con metadatos {problem_type, num_features,
                       cat_features, label_encoder, target_classes}
    """
    df = df.copy()

    # Eliminar columnas excluidas
    if exclude_cols:
        df.drop(columns=[c for c in exclude_cols if c in df.columns],
                inplace=True)

    if target not in df.columns:
        raise ValueError(
            f"La columna target '{target}' no existe. "
            f"Columnas disponibles: {list(df.columns)}"
        )

    # Eliminar filas sin target
    before = len(df)
    df.dropna(subset=[target], inplace=True)
    if len(df) < before:
        print(f"  ⚠  Se eliminaron {before - len(df)} filas sin valor en '{target}'")

    # Detección automática
    if problem_type == "auto":
        problem_type = detect_problem_type(df[target])
        print(f"  🔍 Tipo de problema detectado automáticamente: {problem_type.upper()}")

    num_features, cat_features = detect_columns(df, target)

    if verbose:
        data_report(df, target, problem_type, num_features, cat_features)

    # Target
    y_raw = df[target]
    y, label_encoder = encode_target(y_raw, problem_type)

    # Features
    X_raw = df.drop(columns=[target])

    # Construir preprocessor
    preprocessor = build_preprocessor(num_features, cat_features)

    meta = {
        "problem_type":  problem_type,
        "num_features":  num_features,
        "cat_features":  cat_features,
        "label_encoder": label_encoder,
        "target_classes": (
            label_encoder.classes_.tolist() if label_encoder
            else sorted(y_raw.unique().tolist())
            if problem_type != "regression"
            else None
        ),
        "target_col": target,
        "n_features_in": len(num_features) + len(cat_features),
    }

    return X_raw, y, preprocessor, meta
