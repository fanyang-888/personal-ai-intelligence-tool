"""Load and validate ``trusted_sources.yaml``."""

from __future__ import annotations

from pathlib import Path

import yaml

from app.schemas.trusted_source_config import TrustedSourceConfig

_CONFIG_DIR = Path(__file__).resolve().parent
_DEFAULT_FILE = _CONFIG_DIR / "trusted_sources.yaml"


def load_trusted_sources(path: Path | None = None) -> list[TrustedSourceConfig]:
    """Parse YAML, validate each row, return only ``is_active`` sources (>= 1 row in file)."""
    file_path = path or _DEFAULT_FILE
    raw = yaml.safe_load(file_path.read_text(encoding="utf-8"))
    if not raw or "sources" not in raw:
        raise ValueError("trusted_sources.yaml must contain a top-level 'sources' list")
    items = raw["sources"]
    if not isinstance(items, list) or len(items) < 1:
        raise ValueError("trusted_sources.yaml 'sources' must be a non-empty list")
    configs = [TrustedSourceConfig.model_validate(row) for row in items]
    return [c for c in configs if c.is_active]
