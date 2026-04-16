# Personal AI Intelligence Tool

A full-stack AI news aggregator that ingests articles from trusted sources, clusters and summarises them with OpenAI, and surfaces a daily digest with newsletter-style drafts.

**Live:** [personal-ai-intelligence-tool.vercel.app](https://personal-ai-intelligence-tool.vercel.app)

---

## Architecture

```
Vercel (Next.js frontend)
    └── NEXT_PUBLIC_API_URL
            │
            ▼
Railway (FastAPI backend)          Railway (Cron job)
    ├── /api/digest/today              └── runs daily at 02:00 UTC
    ├── /api/clusters                        ingest → filter → score
    ├── /api/search                          → cluster → summarize
    └── /api/drafts                          → generate_draft
            │
            ▼
    Railway PostgreSQL
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy (async-ready), Alembic |
| Database | PostgreSQL (psycopg3) |
| AI | OpenAI GPT-4o (filtering, clustering, summarisation, draft generation) |
| Deployment | Vercel (frontend), Railway (backend + DB + cron) |

---

## Local development

### Frontend

```bash
npm install
npm run dev        # http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local` to point at a local backend.

### Backend

```bash
cd backend/
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL, OPENAI_API_KEY
alembic upgrade head
uvicorn app.main:app --reload   # http://localhost:8000
```

### Run the pipeline locally

```bash
cd backend/
python -m scripts.ingest_full_articles
python -m scripts.filter_articles
python -m scripts.score_articles
python -m scripts.cluster_articles
python -m scripts.summarize
python -m scripts.generate_draft
```

Or run all stages at once:

```bash
python -m scripts.run_pipeline
```

---

## Pipeline stages

| Stage | Script | What it does |
|-------|--------|-------------|
| Ingest | `ingest_full_articles` | Fetches full article text from OpenAI News, Anthropic Newsroom, TechCrunch AI |
| Filter | `filter_articles` | GPT-4o removes off-topic articles |
| Score | `score_articles` | Rule-based signal score (0–100) based on source quality, recency, word count |
| Cluster | `cluster_articles` | Groups related articles into story clusters using TF-IDF + cosine similarity + GPT-4o titles |
| Summarise | `summarize` | GPT-4o writes per-article and per-cluster summaries, takeaways, audience context |
| Draft | `generate_draft` | GPT-4o writes a full newsletter draft for the top cluster |

---

## Project layout

```
├── app/                    Next.js pages and layouts
├── components/             UI components (digest, cluster, archive, draft, shared)
├── lib/api/                Backend API client
├── lib/i18n/               EN/ZH localisation
├── types/                  Shared TypeScript types
├── backend/
│   ├── app/
│   │   ├── adapters/       Source adapters (OpenAI, Anthropic, TechCrunch)
│   │   ├── api/routes/     FastAPI route handlers
│   │   ├── models/         SQLAlchemy ORM models
│   │   ├── services/       Pipeline business logic
│   │   └── source_catalog/ trusted_sources.yaml
│   ├── migrations/         Alembic migration scripts
│   └── scripts/            Pipeline scripts + run_pipeline.py orchestrator
└── docs/                   BACKLOG.md
```

---

## Deployment

### Backend (Railway)

The backend auto-deploys from `main`. On startup, `alembic upgrade head` runs in a background thread so Railway's healthcheck passes immediately.

Environment variables required on the Railway service:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Railway internal Postgres URL (`postgresql://...@postgres.railway.internal/railway`) |
| `OPENAI_API_KEY` | OpenAI API key |
| `APP_ENV` | `production` |
| `SOURCE_FETCH_USER_AGENT` | User-agent string for HTTP fetching |

### Daily cron (Railway)

A separate Railway service (`daily-pipeline-cron`) runs `python -m scripts.run_pipeline` at **02:00 UTC every day**. It uses the same env vars as the web service and shares the same Railway project / Postgres instance.

### Frontend (Vercel)

The frontend auto-deploys from `main`. Set one environment variable in the Vercel project settings:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://personal-ai-intelligence-tool-production.up.railway.app` |
