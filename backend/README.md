# Backend — FastAPI

FastAPI backend for the Personal AI Intelligence Tool. Handles article ingestion, the full processing pipeline (filter → score → cluster → summarise → draft), and REST API routes consumed by the Vercel frontend.

**Production URL:** `https://personal-ai-intelligence-tool-production.up.railway.app`

---

## Prerequisites

- Python 3.11+
- PostgreSQL (local Docker or Railway)
- OpenAI API key (required for filter, cluster, summarise, draft stages)

---

## Quick start

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # fill in DATABASE_URL and OPENAI_API_KEY
alembic upgrade head
uvicorn app.main:app --reload
```

Open [http://localhost:8000/health](http://localhost:8000/health).

---

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | SQLAlchemy URL (`postgresql+psycopg://...`) |
| `APP_ENV` | Yes | Environment label (`development` / `production`) |
| `SOURCE_FETCH_USER_AGENT` | Yes | User-Agent for HTTP fetching |
| `OPENAI_API_KEY` | Yes (pipeline) | GPT-4o calls for filter/cluster/summarise/draft |
| `REDIS_URL` | No | Reserved for future caching |

`DATABASE_URL` is auto-corrected from `postgresql://` → `postgresql+psycopg://` at startup if needed.

---

## Running the pipeline

Each stage can be run standalone or all at once:

```bash
# Run all stages in sequence
python -m scripts.run_pipeline

# Run stages individually
python -m scripts.ingest_full_articles           # fetch article text
python -m scripts.ingest_full_articles --slug techcrunch-ai --per-source-limit 5
python -m scripts.ingest_full_articles --dry-run  # no DB writes
python -m scripts.ingest_full_articles --force-retry-failures  # clear 403 bans

python -m scripts.filter_articles                # remove off-topic articles (GPT-4o)
python -m scripts.score_articles                 # rule-based signal score (0-100)
python -m scripts.cluster_articles               # group into story clusters (GPT-4o)
python -m scripts.summarize                      # per-article and cluster summaries
python -m scripts.generate_draft                 # newsletter draft for top cluster
```

---

## API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check (no DB) |
| GET | `/health/db` | Readiness check with DB ping |
| GET | `/api/digest/today` | Today's featured cluster + top clusters + draft |
| GET | `/api/clusters` | Paginated cluster list |
| GET | `/api/clusters/{id}` | Single cluster with articles |
| GET | `/api/search` | Full-text search across clusters and articles |
| GET | `/api/drafts/today` | Today's latest draft |
| GET | `/api/drafts/{id}` | Single draft |
| POST | `/api/drafts/generate` | Trigger draft generation |
| POST | `/api/drafts/{id}/regenerate` | Regenerate an existing draft |

Interactive docs: [/docs](https://personal-ai-intelligence-tool-production.up.railway.app/docs)

---

## Database schema

| Table | Purpose |
|-------|---------|
| `sources` | Trusted publisher registry (synced from `trusted_sources.yaml`) |
| `articles` | Ingested articles with full text, scores, summaries |
| `ingest_url_states` | Per-URL fetch state (403 backoff, retry_at) |
| `clusters` | Story clusters grouping related articles |
| `drafts` | LLM-generated newsletter drafts |

Migrations are in `migrations/`. Run `alembic upgrade head` to apply.

On Railway, migrations run automatically in a background thread at startup.

---

## Sources

Trusted sources are defined in `app/source_catalog/trusted_sources.yaml` and validated by `TrustedSourceConfig`. The `source_sync` service upserts them into the `sources` table on each pipeline run.

| Source | Slug | Method |
|--------|------|--------|
| OpenAI News | `openai-news` | RSS (`openai.com/news/rss.xml`) |
| Anthropic Newsroom | `anthropic-newsroom` | HTML index scrape |
| TechCrunch AI | `techcrunch-ai` | RSS category feed |

---

## Ingestion details

- **Deduplication:** `articles.url` is UNIQUE. Canonical URL matching also detects duplicates across redirect chains.
- **Body merge guard:** if a re-fetch returns < 80% of the stored body length, the existing text is preserved.
- **403 backoff:** after 3 consecutive 403s, a URL is blocked for 7 days (`retry_at`). Use `--force-retry-failures` to clear.
- **Quality threshold:** minimum ~400 chars body; DOM extractions require minimum block density (paragraph/list ratio).

---

## Daily cron

A separate Railway service (`daily-pipeline-cron`) runs `python -m scripts.run_pipeline` at **02:00 UTC daily** (configured in `railway.cron.toml`). The orchestrator:

1. Runs `ingest_full_articles` — aborts if it fails
2. Runs `filter → score → cluster → summarize → generate_draft` in sequence, continuing even if a non-critical stage fails

---

## Layout

```
app/
├── adapters/           Source adapters + article HTML extractor
├── api/routes/         FastAPI route handlers
├── crud/               DB persistence helpers
├── db.py               Engine, SessionLocal, session_scope
├── logging_config.py   Structured stderr logging
├── main.py             FastAPI app + startup migration
├── models/             SQLAlchemy ORM models
├── schemas/            Pydantic schemas
├── services/           Pipeline services (ingest, filter, score, cluster, summarize, draft)
└── source_catalog/     trusted_sources.yaml

migrations/             Alembic migration scripts
scripts/
├── ingest_full_articles.py
├── filter_articles.py
├── score_articles.py
├── cluster_articles.py
├── summarize.py
├── generate_draft.py
├── run_pipeline.py     Daily orchestrator
├── seed_sources.py
└── fetch_index_dry_run.py
```
