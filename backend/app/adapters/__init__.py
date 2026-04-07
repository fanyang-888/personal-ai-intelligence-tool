"""Trusted source adapters (Week 2 Day 2)."""

from app.adapters.base import BaseSourceAdapter
from app.adapters.registry import ADAPTER_REGISTRY, AdapterNotRegisteredError, get_adapter

__all__ = [
    "ADAPTER_REGISTRY",
    "AdapterNotRegisteredError",
    "BaseSourceAdapter",
    "get_adapter",
]
