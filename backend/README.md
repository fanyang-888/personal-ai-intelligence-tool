# Backend (FastAPI)

Minimal API and database layer for the Personal AI Intelligence Tool. Week 2 Day 1 scope: health check, PostgreSQL schema (`sources`, `articles`), and local dev wiring only.

## Prerequisites

- Python 3.11+
- Docker (optional, for PostgreSQL)

## 1. Start PostgreSQL

From this directory (`backend/`):

```bash
docker compose up -d
```

This exposes Postgres on `localhost:5432` with user/password/database `pait` (see `docker-compose.yml`).

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
{"status":"ok","database":"ok"}
```

If PostgreSQL is unreachable or misconfigured, `/health` returns **503** with a JSON `detail` payload (no secrets).


API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## Layout

- `app/main.py` — FastAPI application
- `app/config.py` — settings from environment
- `app/db.py` — SQLAlchemy engine and sessions
- `app/models/` — ORM models
- `app/schemas/` — Pydantic schemas for future routes
- `app/api/routes/` — route modules
- `migrations/` — Alembic migration scripts
