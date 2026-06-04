"""Lightweight NLP models for text embeddings and semantic search.
Uses fastembed (ONNX Runtime) — no PyTorch needed.
Model is lazy-loaded on first request (not at startup).
"""
import os
import gc
import numpy as np
from pathlib import Path
from typing import List

NLP_CACHE_DIR = Path(__file__).resolve().parent.parent / "Red_Neuronal" / "modelos_guardados" / "nlp"


class EmbeddingModel:
    """Sentence embedding model (lazy-loaded singleton)."""
    _instance = None

    def __init__(self):
        self._model = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def load(self):
        if self._model is not None:
            return
        os.makedirs(str(NLP_CACHE_DIR), exist_ok=True)
        from fastembed import TextEmbedding
        os.environ["HF_HOME"] = str(NLP_CACHE_DIR)
        self._model = TextEmbedding(
            model_name="all-MiniLM-L6-v2",
            cache_dir=str(NLP_CACHE_DIR),
            threads=2,
        )

    def encode(self, texts: List[str]) -> List[List[float]]:
        self.load()
        embeddings = list(self._model.embed(texts))
        return [e.tolist() if hasattr(e, 'tolist') else e for e in embeddings]

    def similarity(self, a: str, b: str) -> float:
        emb = self.encode([a, b])
        return float(np.dot(emb[0], emb[1]))

    def unload(self):
        self._model = None
        gc.collect()
