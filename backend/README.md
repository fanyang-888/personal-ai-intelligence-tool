# Backend (FastAPI)

Minimal API and database layer for the Personal AI Intelligence Tool. Core scope: health check, PostgreSQL schema (`sources`, `articles`), ingestion-oriented fields on `sources`, and helpers for **source adapters** (session factory, `create_article`, logging).

## Prerequisites

- Python 3.11+
- Docker (optional, for PostgreSQL)

## 1. Start PostgreSQL

From this directory (`backend/`):

```bash
docker compose up -d
```

The Compose service is named **`db`** (hostname `db` on the Compose network). Postgres is exposed on `localhost:5432` with user/password/database `pait` (see `docker-compose.yml`). The `db` service includes a **`healthcheck`** (`pg_isready`) so you can use `depends_on: { db: { condition: service_healthy } }` if you add an API container later.

To use your own Postgres instead, create a database and set `DATABASE_URL` in `.env` accordingly.

## 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if your database URL differs. Required variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLAlchemy URL (`postgresql+psycopg://...`) |
| `APP_ENV` | Environment label (e.g. `development`) |
| `SOURCE_FETCH_USER_AGENT` | User-Agent string for future HTTP fetching |

Optional placeholders (unused today): `OPENAI_API_KEY`, `REDIS_URL`.

## 3. Python environment and dependencies

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## 4. Run migrations

Still from `backend/`:

```bash
alembic upgrade head
```

## 5. Run the API

```bash
uvicorn app.main:app --reload
```

Open [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health). A successful response looks like:

```json
{"status":"healthy"}
```

If PostgreSQL is unreachable or misconfigured, `/health` returns **503** with `detail` set to the generic string **`Database connection failed`** (no hostnames, usernames, or driver/traceback text).

API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs). The OpenAPI UI currently exposes only **`GET /health`** — ingestion is expected to run from **scripts or tasks**, not from manual CRUD in Swagger.

## Article dedupe (which column is unique?)

- **Enforced in PostgreSQL and in** `create_article`: **`articles.url`** is **UNIQUE**; ingestion treats it as the stable identity for “already seen this item” (see `ON CONFLICT … ON url`).
- **`canonical_url`** is **not** unique and is **not** part of that conflict handling. Use it for display or later cross-reference; if you ever need dedupe on canonical links, that would be a **new** constraint and a deliberate change to `create_article`.

## Seed data (`sources`)

After migrations, optionally load dev/test **source** rows (idempotent by `name`):

```bash
python -m scripts.seed_sources
```

Run from `backend/` with `.env` configured. Safe to run multiple times; existing names are skipped.

## Adapters and scripts (ingestion)

Use a DB session **outside** FastAPI’s `Depends(get_db)`:

- `from app.db import SessionLocal, session_factory, session_scope` — `session_factory` is the same `sessionmaker` as `SessionLocal`. Prefer `with session_scope() as db:` in scripts so commits/rollbacks and `close()` are handled.
- `from app.crud.article import create_article` — inserts with PostgreSQL `ON CONFLICT DO NOTHING` on `articles.url`; returns the new `Article` or `None` if the URL was already present.
- `from app.logging_config import configure_logging` — call once at the start of a standalone script (the ASGI app calls this on import via `main.py`).

## Layout

- `app/main.py` — FastAPI application
- `app/config.py` — settings from environment
- `app/db.py` — SQLAlchemy engine, `SessionLocal` / `session_factory`, `session_scope`, `get_db`
- `app/logging_config.py` — shared stderr logging format
- `app/crud/` — persistence helpers for ingestion
- `app/models/` — ORM models
- `app/schemas/` — Pydantic schemas for future routes
- `app/api/routes/` — route modules
- `migrations/` — Alembic migration scripts
- `scripts/` — dev helpers (e.g. `seed_sources`)
