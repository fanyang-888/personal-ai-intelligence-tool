# Personal AI Intelligence Tool

A full-stack AI news aggregator that ingests articles from trusted AI sources, clusters and summarises them with OpenAI, and surfaces a bilingual (EN/ZH) daily digest with newsletter-style drafts.

**Live:** [personal-ai-intelligence-tool.vercel.app](https://personal-ai-intelligence-tool.vercel.app)

---

## What it does

- **Ingests** articles from 10+ trusted AI sources (OpenAI, Anthropic, DeepMind, arXiv, VentureBeat, TechCrunch, and more) every 6 hours
- **Filters & scores** articles with GPT-4o to remove noise and rank by signal quality
- **Clusters** related articles into story threads using TF-IDF + cosine similarity
- **Summarises** each cluster with per-audience context (PMs, developers, students)
- **Translates** all content to Chinese automatically
- **Generates** LinkedIn-style newsletter drafts with role-specific career angles
- **Deduplicates** cross-day clusters so recurring stories are tracked, not duplicated

---

## Architecture

```
Vercel (Next.js frontend)
    └── NEXT_PUBLIC_API_URL
            │
            ▼
Railway (FastAPI backend)          Railway (Cron — 6×/day)
    ├── GET  /api/digest/today         └── ingest → filter → score
    ├── GET  /api/clusters                 → cluster → dedup → summarize
    ├── GET  /api/clusters/{id}            → translate → draft → translate
    ├── GET  /api/drafts/today
    ├── GET  /api/drafts/{id}?role=pm|developer|student
    ├── GET  /api/search
    ├── GET  /api/pipeline-runs
    └── POST /api/admin/trigger-pipeline   (JWT-protected)
            │
            ▼
    Railway PostgreSQL + Redis
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React, TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy, Alembic, psycopg3 |
| Database | PostgreSQL (Railway managed) |
| Cache | Redis (Railway managed, 5-min TTL on hot endpoints) |
| AI | OpenAI GPT-4o-mini (filter, score, cluster, summarise, translate, draft) |
| Deployment | Vercel (frontend) · Railway (backend + DB + Redis + cron) |

---

## Pipeline stages

| Stage | Script | What it does |
|-------|--------|-------------|
| Ingest | `ingest_full_articles` | Fetches full article text; incremental via HTTP ETag + poll-frequency gate |
| Filter | `filter_articles` | GPT-4o removes off-topic articles |
| Score | `score_articles` | Rule-based signal score (0–100) |
| Cluster | `cluster_articles` | TF-IDF + cosine similarity groups articles into story clusters |
| Status | `update_cluster_status` | Classifies clusters as new / escalating / ongoing / peaking / fading |
| Dedup | `dedup_clusters` | Merges cross-day duplicate clusters by title similarity |
| Summarise | `summarize` | GPT-4o writes summaries, takeaways, and per-audience context |
| Translate clusters | `translate_clusters` | Translates all cluster fields to Chinese |
| Draft | `generate_draft` | GPT-4o writes a LinkedIn-style newsletter draft |
| Translate drafts | `translate_drafts` | Translates all draft fields to Chinese |

---

## Data sources

| Source | Type |
|--------|------|
| OpenAI News | RSS |
| Anthropic Newsroom | RSS + HTML fallback |
| Google DeepMind Blog | HTML index scrape |
| arXiv cs.AI + cs.LG | RSS |
| VentureBeat AI | RSS |
| TechCrunch AI | RSS |
| MIT Technology Review AI | RSS |
| The Verge AI | RSS |
| Wired AI | RSS |
| Ars Technica AI | RSS |

---

## Local development

### Frontend

```bash
npm install
npm run dev        # http://localhost:3000
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend

```bash
cd backend/
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL, OPENAI_API_KEY, etc.
alembic upgrade head
uvicorn app.main:app --reload   # http://localhost:8000
```

### Run the pipeline

```bash
cd backend/

# Run all stages at once
python -m scripts.run_pipeline --triggered-by manual

# Or individual stages
python -m scripts.ingest_full_articles
python -m scripts.filter_articles
python -m scripts.score_articles
python -m scripts.cluster_articles
python -m scripts.update_cluster_status
python -m scripts.dedup_clusters
python -m scripts.summarize
python -m scripts.translate_clusters
python -m scripts.generate_draft
python -m scripts.translate_drafts
```

---

## Project layout

```
├── app/                    Next.js pages (digest, cluster, draft, archive)
├── components/             UI components
├── lib/api/                Backend API client + type definitions
├── lib/i18n/               EN/ZH localisation
├── types/                  Shared TypeScript types
├── backend/
│   ├── app/
│   │   ├── adapters/       Source adapters (RSS, HTML scrapers)
│   │   ├── api/routes/     FastAPI route handlers
│   │   ├── auth.py         JWT authentication helpers
│   │   ├── cache.py        Redis cache helpers (graceful fallback)
│   │   ├── models/         SQLAlchemy ORM models
│   │   ├── services/       Pipeline business logic
│   │   └── source_catalog/ trusted_sources.yaml
│   ├── migrations/         Alembic migration history
│   └── scripts/            Pipeline scripts + run_pipeline.py
└── docs/                   BACKLOG.md
```

---

## Deployment

### Backend (Railway)

Auto-deploys from `main`. On startup, `alembic upgrade head` runs in a background thread so Railway's healthcheck passes immediately.

Required environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key |
| `APP_ENV` | `production` |
| `SOURCE_FETCH_USER_AGENT` | HTTP User-Agent for article fetching |
| `REDIS_URL` | Redis connection string (auto-set by Railway Redis plugin) |
| `JWT_SECRET` | Random secret for signing JWT tokens |
| `ADMIN_USERNAME` | Login username (default: `admin`) |
| `ADMIN_PASSWORD` | Login password |

### Cron (Railway)

A separate Railway service (`daily-pipeline-cron`) runs `python -m scripts.run_pipeline` at **02:00, 08:00, 14:00, 20:00 UTC** every day. Shares the same env vars and Postgres instance as the web service.

### Frontend (Vercel)

Auto-deploys from `main`.

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://personal-ai-intelligence-tool-production.up.railway.app` |

---

## Admin API

```bash
# Get a JWT token
curl -X POST https://<backend>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<ADMIN_PASSWORD>"}'

# Trigger the pipeline manually
curl -X POST https://<backend>/api/admin/trigger-pipeline \
  -H "Authorization: Bearer <token>"

# Check pipeline run history
curl https://<backend>/api/pipeline-runs
```

---

## Role-based draft personalization

Append `?role=pm`, `?role=developer`, or `?role=student` to any draft endpoint to receive role-specific audience context:

```
GET /api/drafts/today?role=pm
GET /api/drafts/{id}?role=developer
```
