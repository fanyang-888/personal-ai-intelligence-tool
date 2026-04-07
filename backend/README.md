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

## Week 2 Day 2 — Trusted source adapters

Trusted publishers are defined in [`app/source_catalog/trusted_sources.yaml`](app/source_catalog/trusted_sources.yaml) (validated by [`TrustedSourceConfig`](app/schemas/trusted_source_config.py)). This lives under `app/source_catalog/` so it does not clash with the settings module [`app/config.py`](app/config.py).

**Dry run** (fetches remote feeds/HTML; does not write to the database):

```bash
python -m scripts.fetch_index_dry_run
python -m scripts.fetch_index_dry_run --slug anthropic-newsroom
python -m scripts.fetch_index_dry_run --json --slug techcrunch-ai   # full candidate list
python -m scripts.fetch_index_dry_run --json   # all sources, counts only (no huge item arrays)
python -m scripts.fetch_index_dry_run --allow-empty   # exit 0 even when a source returns 0 rows
```

Requires `SOURCE_FETCH_USER_AGENT` and the usual `.env` (imports `app.config.settings`). Each successful source prints a freshness line: `[Dry Run] Source: … | Found: … | Newest: YYYY-MM-DD` (or `n/a` when no dates). By default the script exits with a non-zero code if any source returns **zero** candidates (catches empty SPA shells); use `--allow-empty` to override.

Per-source YAML fields (optional): `user_agent` (browser-like string for WAFs), `import_limit` (cap after newest-first sort), `since_date` (UTC calendar day — drops older RSS rows). RSS fetches use small HTTP retries with backoff; Anthropic’s index is parsed with BeautifulSoup, not regex.

**Candidate shape** (after `normalize`): `title`, `url`, `published_at`, `author_name`, `raw_meta` (parser hints, summary snippet, tags).

**Registry**: `from app.adapters import get_adapter, ADAPTER_REGISTRY` maps `adapter_key` → `OpenAINewsAdapter`, `AnthropicNewsroomAdapter`, or `TechCrunchAIAdapter`.

| Source | Slug | Ingestion |
|--------|------|-----------|
| OpenAI News | `openai-news` | RSS (`openai.com/news/rss.xml`); HTML fallback logged only if RSS empty |
| Anthropic Newsroom | `anthropic-newsroom` | No public RSS in config → HTML index on `/news` (BS4 + `urljoin` / normalized URLs) |
| TechCrunch AI | `techcrunch-ai` | RSS category feed only |

`fetch_article` is implemented per adapter (Day 3): single-page GET + BeautifulSoup / JSON-LD + small site-specific fallbacks — **not** a generic crawler.

**Backlog (non-blocking before Day 3):** tracked in [`docs/BACKLOG.md`](../docs/BACKLOG.md) — `sources` vs YAML drift, full HTML fallback for OpenAI/Anthropic when RSS dies, and incremental ingestion (`last_polled_at`, conditional HTTP headers, end-to-end loop).

## Week 2 Day 3 — Full article fetch + persist

1. Run migrations (adds `sources.slug`, article metadata columns, `articles.word_count`, partial index on `canonical_url`, `ingest_url_states` with optional `retry_at`, etc.):

```bash
alembic upgrade head
```

2. Ingest full text for the first *N* index items per trusted source (upserts `sources` from YAML by `slug`, then inserts articles):

```bash
python -m scripts.ingest_full_articles
python -m scripts.ingest_full_articles --slug anthropic-newsroom --per-source-limit 2
python -m scripts.ingest_full_articles --dry-run
python -m scripts.ingest_full_articles --force-retry-failures   # clear 403 ban table, then ingest
```

- **Dedupe:** `articles.url` stays **UNIQUE** (no `UNIQUE` on `canonical_url` — multiple NULLs and concurrent writers mean canonical dedupe is **application-level** today; the ingest script is single-process). If the fetch provides a **canonical** URL that already matches an existing row’s `canonical_url` or `url`, that row is **updated** (and the index `url` may be moved when safe).
- **Body merge guard:** on update, if the new extract is **shorter than 80%** of the stored body length (and the stored body already meets the minimum size), **raw/cleaned text, hash, and word_count** are kept; `raw_meta.ingestion.body_preserved_short_fetch` records the event. Title/canonical/fetched_at still refresh.
- **Quality:** minimum body length ~400 chars; DOM extractions (non–JSON-LD) require minimum **block density** (text in `<p>` + `<li>` vs total). `techcrunch_ai` uses a lower threshold (0.08) than other adapters (0.12). `raw_meta.full_fetch.parser_version` tags the extractor revision for future re-runs.
- **Encoding:** HTML uses `Content-Type` charset when present, then optional `<meta charset>` sniff.
- **Boilerplate:** nav/header/footer/aside and common “related/social” blocks are stripped before text extraction (Day 4 can extend).
- **403 backoff:** after **three** HTTP 403s, status becomes `permanent_failure` with `retry_at = now + 7 days`; until then the URL is skipped. After `retry_at`, fetches are allowed again. Use **`--force-retry-failures`** to wipe `ingest_url_states` immediately (e.g. after changing VPN/region). Successful fetches reset counters.
- **`word_count`:** stored as an indexed integer column (not only JSONB) for cheap SQL filters.
- **Skips:** failures are logged with `adapter_key` and URL; outcomes include `inserted`, `updated`, `rejected`, `duplicate`, `skipped_blocked`, `fetch_failed`.
- **Scanning:** walks the index until `--per-source-limit` successes or attempts are exhausted.
- **`--dry-run`:** no database access — useful without Postgres.
- **Frontend / XSS:** `raw_text` / `cleaned_text` are **plain text** (BeautifulSoup `get_text` + `bleach.clean` with no allowed tags at persistence). Render as text nodes or escape; never as raw HTML unless you add a separate audited sanitizer pipeline.
- **Normalized model:** `app/schemas/normalized_article.py`, `app/services/article_ingest.py`.

**Manual QA ideas:** (1) Redirect chain — index `url` vs `canonical_url` / `og:url`. (2) **Canonical swap** — seed a row with `url` A; ingest a page whose canonical equals A; expect merge/update, not a second row. (3) Re-run after hand-editing `cleaned_text` — a **longer** re-fetch overwrites; a **much shorter** re-fetch triggers **body preserve** guard. (4) **403 counter** — hit a 403 URL three times, inspect `ingest_url_states`; after `retry_at` or `--force-retry-failures`, retries resume. (5) **Word count** — compare `word_count` to an external tool (~few % diff from whitespace rules). (6) Broken `ld+json` in a local HTML file — INFO log + DOM fallback, no crash.

## Adapters and scripts (ingestion)

Use a DB session **outside** FastAPI’s `Depends(get_db)`:

- `from app.db import SessionLocal, session_factory, session_scope` — `session_factory` is the same `sessionmaker` as `SessionLocal`. Prefer `with session_scope() as db:` in scripts so commits/rollbacks and `close()` are handled.
- `from app.crud.article import create_article` — inserts with PostgreSQL `ON CONFLICT DO NOTHING` on `articles.url`; merge/update paths live in `app/services/article_ingest.persist_fetched_article`.
- `from app.logging_config import configure_logging` — call once at the start of a standalone script (the ASGI app calls this on import via `main.py`).

## Layout

- `app/main.py` — FastAPI application
- `app/config.py` — settings from environment
- `app/source_catalog/` — `trusted_sources.yaml` + `load_trusted_sources()`
- `app/adapters/` — `BaseSourceAdapter`, RSS/HTML helpers, concrete adapters, `get_adapter`
- `app/db.py` — SQLAlchemy engine, `SessionLocal` / `session_factory`, `session_scope`, `get_db`
- `app/logging_config.py` — shared stderr logging format
- `app/crud/` — persistence helpers for ingestion (`article`, `ingest_url_state`)
- `app/models/` — ORM models
- `app/schemas/` — Pydantic schemas for future routes
- `app/api/routes/` — route modules
- `migrations/` — Alembic migration scripts
- `scripts/` — dev helpers (`seed_sources`, `fetch_index_dry_run`, `ingest_full_articles`)
- `app/services/` — `source_sync`, `article_ingest` (Day 3 persistence path)
