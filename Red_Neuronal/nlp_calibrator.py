"""NLP Calibrator - Ajusta probabilidades base usando embeddings de texto.
Entrena un LogisticRegression sobre [prob_base + embedding_384d] para
aprender cómo el texto del usuario debe modular la predicción del modelo base.
"""
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.decomposition import PCA
import joblib
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def generate_text_from_features(X: pd.DataFrame, meta: dict) -> list[str]:
    """Genera una descripción textual de cada fila basada en sus features."""
    texts = []
    num_f = meta.get("num_features", [])
    cat_f = meta.get("cat_features", [])

    for _, row in X.iterrows():
        parts = []
        for c in num_f:
            if c in row:
                v = row[c]
                if pd.notna(v):
                    parts.append(f"{c}={v:.2f}" if isinstance(v, (int, float)) else f"{c}={v}")
        for c in cat_f:
            if c in row:
                v = row[c]
                if pd.notna(v) and v != "":
                    parts.append(f"{c}={v}")
        texts.append(", ".join(parts) if parts else "sin datos")

    return texts


def train_calibrator(pipeline, X_train: pd.DataFrame, y_train: pd.Series,
                     meta: dict, embed_model: object,
                     n_val: int = 100, random_state: int = 42) -> dict:
    """Entrena un calibrador sobre [prob_base, embedding_384d]."""
    from sklearn.model_selection import train_test_split

    n = min(n_val, len(X_train) // 3)
    if n < 20:
        return {"status": "skipped", "reason": "too few samples"}

    X_sub, _, y_sub, _ = train_test_split(
        X_train, y_train, train_size=n, random_state=random_state, stratify=y_train if len(np.unique(y_train)) > 1 else None
    )

    probas = pipeline.predict_proba(X_sub)
    n_classes = probas.shape[1]
    if n_classes == 2:
        base_probs = probas[:, 1]
    else:
        base_probs = probas[:, 0]

    texts = generate_text_from_features(X_sub, meta)
    try:
        embeddings = embed_model.encode(texts)
        emb_array = np.array(embeddings, dtype=np.float64)
    except Exception as e:
        return {"status": "failed", "error": str(e)}

    n_comp = min(8, len(X_sub) - 1, emb_array.shape[1])
    pca = PCA(n_components=n_comp, random_state=random_state)
    emb_reduced = pca.fit_transform(emb_array)

    X_cal = np.column_stack([base_probs, emb_reduced])

    cal_model = LogisticRegression(C=1.0, max_iter=1000, random_state=random_state)
    cal_model.fit(X_cal, y_sub)

    score = cal_model.score(X_cal, y_sub)
    coef_nlp = cal_model.coef_[0][1:].tolist() if hasattr(cal_model, "coef_") else []

    return {
        "status": "trained",
        "model": cal_model,
        "pca": pca,
        "n_components": n_comp,
        "score": float(score),
        "coef_nlp": coef_nlp,
    }


def adjust_prediction(base_prob: float, text: str, meta: dict,
                      embed_model: object, cal_payload: dict) -> dict:
    """Aplica el calibrador NLP a una predicción base."""
    if cal_payload is None or cal_payload.get("status") != "trained":
        return {"probabilidad": base_prob, "ajuste": 0.0, "nlp_active": False}

    cal_model = cal_payload["model"]
    pca = cal_payload["pca"]

    if not text or not text.strip():
        text = "sin texto"

    try:
        embeddings = embed_model.encode([text])
        emb = np.array(embeddings[0], dtype=np.float64).reshape(1, -1)
        emb_r = pca.transform(emb)
    except Exception:
        return {"probabilidad": base_prob, "ajuste": 0.0, "nlp_active": False}

    X_cal = np.column_stack([[base_prob], emb_r])
    prob_pos = cal_model.predict_proba(X_cal)[0, 1]

    ajuste = prob_pos - base_prob

    return {
        "probabilidad": float(prob_pos),
        "ajuste": float(ajuste),
        "nlp_active": True,
    }
