"""Map ``adapter_key`` from config to concrete adapter classes."""

from __future__ import annotations

import logging

from app.adapters.anthropic import AnthropicNewsroomAdapter
from app.adapters.base import BaseSourceAdapter
from app.adapters.generic_rss import GenericRSSAdapter
from app.adapters.openai_news import OpenAINewsAdapter
from app.adapters.techcrunch_ai import TechCrunchAIAdapter
from app.schemas.trusted_source_config import TrustedSourceConfig

logger = logging.getLogger(__name__)


class AdapterNotRegisteredError(KeyError):
    """Raised when ``source_catalog/trusted_sources.yaml`` references an unknown ``adapter_key``."""


ADAPTER_REGISTRY: dict[str, type[BaseSourceAdapter]] = {
    OpenAINewsAdapter.adapter_key: OpenAINewsAdapter,
    AnthropicNewsroomAdapter.adapter_key: AnthropicNewsroomAdapter,
    TechCrunchAIAdapter.adapter_key: TechCrunchAIAdapter,
    GenericRSSAdapter.adapter_key: GenericRSSAdapter,
}


def get_adapter(config: TrustedSourceConfig) -> BaseSourceAdapter:
    cls = ADAPTER_REGISTRY.get(config.adapter_key)
    if cls is None:
        logger.error("adapter_key not registered: %r", config.adapter_key)
        raise AdapterNotRegisteredError(config.adapter_key)
    return cls(config)
