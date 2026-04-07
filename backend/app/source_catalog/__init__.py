"""YAML-backed trusted source definitions (avoids clashing with ``app.config`` settings module)."""

from app.source_catalog.loader import load_trusted_sources

__all__ = ["load_trusted_sources"]
