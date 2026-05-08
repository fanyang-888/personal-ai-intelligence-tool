"""Shared SlowAPI rate-limiter instance.

Defined in its own module to avoid circular imports:
  app.main imports routes → routes import limiter → limiter must not import app.main
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=[])
