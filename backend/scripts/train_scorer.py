"""Train a lightweight ML scorer for article relevance dimensions.

Trains three Ridge Regression models on TF-IDF features to predict:
  - audience_fit        (1–5)
  - practical_relevance (1–5)
  - novelty             (1–5)

These replace the hardcoded 3.0 defaults in scoring.py.

Usage (from backend/):
    python -m scripts.train_scorer
    python -m scripts.train_scorer --labels data/labels.jsonl --output models/scorer.pkl
    python -m scripts.train_scorer --eval-only   # just print metrics, don't save

Output:
    models/scorer.pkl  — serialized {pipeline, feature_names, metrics}
    Prints a metrics table (Pearson r, MAE, per dimension)
"""

from __future__ import annotations

import argparse
import json
import logging
import pickle
import sys
from pathlib import Path

import numpy as np
from scipy.stats import pearsonr
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_predict, KFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)

DIMENSIONS = ["audience_fit", "practical_relevance", "novelty"]
DEFAULT_LABELS = "data/labels.jsonl"
DEFAULT_OUTPUT = "models/scorer.pkl"


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def load_labels(path: Path) -> tuple[list[str], dict[str, list[float]]]:
    """Load JSONL labels. Returns (texts, {dim: [scores]})."""
    texts: list[str] = []
    scores: dict[str, list[float]] = {d: [] for d in DIMENSIONS}

    with path.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            row = json.loads(line)
            # Combine title + text as the feature
            title = row.get("title", "")
            text = row.get("text", "")
            combined = f"{title} . {text[:800]}"
            texts.append(combined)
            for dim in DIMENSIONS:
                scores[dim].append(float(row[dim]))

    logger.info("Loaded %d labeled examples from %s", len(texts), path)
    return texts, scores


# ---------------------------------------------------------------------------
# Training
# ---------------------------------------------------------------------------

def build_pipeline() -> Pipeline:
    """TF-IDF → Ridge Regression pipeline."""
    return Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),        # unigrams + bigrams
            max_features=30_000,
            sublinear_tf=True,         # log(1+tf) smoothing
            min_df=2,                  # ignore very rare terms
            strip_accents="unicode",
            analyzer="word",
        )),
        ("ridge", Ridge(alpha=1.0)),
    ])


def evaluate_cv(pipeline: Pipeline, texts: list[str], y: list[float], n_splits: int = 5) -> dict:
    """5-fold cross-validation. Returns {pearson_r, mae, rmse}."""
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    y_arr = np.array(y)
    y_pred = cross_val_predict(pipeline, texts, y_arr, cv=kf)

    # Clamp predictions to [1, 5]
    y_pred = np.clip(y_pred, 1.0, 5.0)

    r, _ = pearsonr(y_arr, y_pred)
    mae = float(np.mean(np.abs(y_arr - y_pred)))
    rmse = float(np.sqrt(np.mean((y_arr - y_pred) ** 2)))

    return {"pearson_r": round(float(r), 4), "mae": round(mae, 4), "rmse": round(rmse, 4)}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def train(labels_path: Path, output_path: Path, eval_only: bool = False) -> None:
    # ---- Load data ----
    texts, scores = load_labels(labels_path)

    if len(texts) < 50:
        logger.error("Need at least 50 labeled examples, got %d", len(texts))
        sys.exit(1)

    # ---- Evaluate each dimension ----
    logger.info("\n%s", "=" * 56)
    logger.info("%-22s  %10s  %8s  %8s", "Dimension", "Pearson r", "MAE", "RMSE")
    logger.info("%s", "-" * 56)

    all_metrics: dict[str, dict] = {}
    trained_pipelines: dict[str, Pipeline] = {}

    for dim in DIMENSIONS:
        y = scores[dim]
        pipeline = build_pipeline()

        # Cross-val metrics
        metrics = evaluate_cv(pipeline, texts, y)
        all_metrics[dim] = metrics

        logger.info(
            "%-22s  %10.4f  %8.4f  %8.4f",
            dim, metrics["pearson_r"], metrics["mae"], metrics["rmse"],
        )

        # Fit on full dataset for final model
        pipeline.fit(texts, np.array(y))
        trained_pipelines[dim] = pipeline

    logger.info("%s", "=" * 56)

    # ---- Baseline comparison (always predict mean) ----
    logger.info("\nBaseline (always predict mean):")
    for dim in DIMENSIONS:
        y = np.array(scores[dim])
        mean_pred = np.full_like(y, y.mean())
        baseline_mae = float(np.mean(np.abs(y - mean_pred)))
        improvement = (baseline_mae - all_metrics[dim]["mae"]) / baseline_mae * 100
        logger.info("  %-22s  baseline MAE=%.4f  improvement=+%.1f%%", dim, baseline_mae, improvement)

    if eval_only:
        logger.info("\n[eval-only mode] Models not saved.")
        return

    # ---- Save ----
    output_path.parent.mkdir(parents=True, exist_ok=True)
    artifact = {
        "pipelines": trained_pipelines,
        "metrics": all_metrics,
        "dimensions": DIMENSIONS,
        "n_train": len(texts),
    }
    with output_path.open("wb") as f:
        pickle.dump(artifact, f)

    logger.info("\n✓ Model saved → %s", output_path)
    logger.info("  Trained on %d examples", len(texts))
    logger.info("  Dimensions: %s", ", ".join(DIMENSIONS))


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Train article relevance scorer")
    parser.add_argument("--labels", default=DEFAULT_LABELS, help=f"JSONL labels file (default: {DEFAULT_LABELS})")
    parser.add_argument("--output", default=DEFAULT_OUTPUT, help=f"Output pickle path (default: {DEFAULT_OUTPUT})")
    parser.add_argument("--eval-only", action="store_true", help="Print metrics only, don't save model")
    args = parser.parse_args(argv)

    train(
        labels_path=Path(args.labels),
        output_path=Path(args.output),
        eval_only=args.eval_only,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
