"""Database engine and session factory.

FastAPI routes should use :func:`get_db`. Adapters, cron jobs, and CLI scripts should **not**
use ``Depends``; instead open a session with one of:

- ``with session_scope() as db:`` — commits on success, rolls back on error, always closes.
- ``db = SessionLocal()`` — manual lifecycle (remember ``commit``/``rollback``/``close``).

``SessionLocal`` is the same :class:`sqlalchemy.orm.sessionmaker` used by ``get_db``; the alias
``session_factory`` refers to the same object for clarity in non-FastAPI code.
"""

from collections.abc import Generator
from contextlib import contextmanager

from sqlalchemy import MetaData, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

# https://docs.sqlalchemy.org/en/20/core/metadata.html#constraint-naming-conventions
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)


engine = create_engine(
    settings.database_url.get_secret_value(),
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

session_factory = SessionLocal


@contextmanager
def session_scope() -> Generator[Session, None, None]:
    """Transactional session for scripts and adapters (not tied to HTTP request scope)."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
