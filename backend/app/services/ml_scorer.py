"""ML-based article relevance scorer.

Loads the trained TF-IDF + Ridge model (models/scorer.pkl) and predicts
three scoring dimensions that were previously hardcoded as 3.0 in scoring.py:

  - audience_fit        (1–5)
  - practical_relevance (1–5)
  - novelty             (1–5)

Usage:
    from app.services.ml_scorer import get_ml_scorer

    scorer = get_ml_scorer()          # singleton, loaded once
    if scorer:
        scores = scorer.predict(title, text)
        # {"audience_fit": 3.8, "practical_relevance": 4.1, "novelty": 2.7}

If the model file is missing, get_ml_scorer() returns None and scoring.py
falls back to the original 3.0 defaults — no crash.
"""

from __future__ import annotations

import logging
import pickle
from pathlib import Path
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)

# Path relative to the backend/ directory
_DEFAULT_MODEL_PATH = Path(__file__).parent.parent.parent / "models" / "scorer.pkl"

_DIMENSIONS = ["audience_fit", "practical_relevance", "novelty"]
_CLAMP_MIN = 1.0
_CLAMP_MAX = 5.0

# Module-level singleton
_scorer_instance: "MLScorer | None | bool" = False  # False = not yet loaded


class MLScorer:
    """Wraps the trained pipelines for inference."""

    def __init__(self, artifact: dict[str, Any]) -> None:
        self._pipelines: dict[str, Any] = artifact["pipelines"]
        self._metrics: dict[str, dict] = artifact.get("metrics", {})
        self._n_train: int = artifact.get("n_train", 0)

    def predict(self, title: str, text: str) -> dict[str, float]:
        """Predict all three dimensions for a single article.

        Returns dict with keys: audience_fit, practical_relevance, novelty.
        Values are floats clamped to [1.0, 5.0].
        """
        combined = f"{title} . {(text or '')[:800]}"
        result: dict[str, float] = {}
        for dim in _DIMENSIONS:
            pipeline = self._pipelines[dim]
            raw = float(pipeline.predict([combined])[0])
            result[dim] = round(float(np.clip(raw, _CLAMP_MIN, _CLAMP_MAX)), 3)
        return result

    @property
    def metrics(self) -> dict[str, dict]:
        return self._metrics

    @property
    def n_train(self) -> int:
        return self._n_train


def get_ml_scorer(model_path: Path | None = None) -> MLScorer | None:
    """Return the singleton MLScorer, or None if model file not found.

    Thread-safe for read-only use after first load (module-level singleton).
    """
    global _scorer_instance

    if _scorer_instance is not False:
        return _scorer_instance  # type: ignore[return-value]

    path = model_path or _DEFAULT_MODEL_PATH
    if not path.exists():
        logger.info(
            "ml_scorer: model not found at %s — using default scores (3.0). "
            "Run scripts/train_scorer.py to train.",
            path,
        )
        _scorer_instance = None
        return None

    try:
        with path.open("rb") as f:
            artifact = pickle.load(f)
        _scorer_instance = MLScorer(artifact)
        logger.info(
            "ml_scorer: loaded model from %s (trained on %d examples)",
            path, _scorer_instance.n_train,
        )
        for dim, m in _scorer_instance.metrics.items():
            logger.debug("  %s: pearson_r=%.3f mae=%.3f", dim, m["pearson_r"], m["mae"])
        return _scorer_instance

    except Exception:
        logger.exception("ml_scorer: failed to load model from %s — falling back to 3.0", path)
        _scorer_instance = None
        return None
