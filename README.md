# Sipply — Your Daily AI Intelligence Briefing

> **Sip** your morning news. **Supply** yourself with signal, not noise.

Sipply is a full-stack AI news intelligence tool that continuously ingests articles from 10+ trusted AI sources, clusters and summarises them with GPT-4o, and surfaces a bilingual (EN / 中文) daily digest with role-personalised newsletter drafts.

**Live demo:** [personal-ai-intelligence-tool.vercel.app](https://personal-ai-intelligence-tool.vercel.app)

---

## Why I built this

The AI space moves faster than any newsletter can keep up with. I wanted a tool that:
- **Aggregates** every major AI publication automatically
- **Filters** noise from signal using LLMs — not keyword rules
- **Clusters** related stories so you see the thread, not just individual articles
- **Personalises** the angle depending on whether you're a PM, engineer, or student
- **Translates** everything to Chinese for bilingual readers

So I built it — including the ingestion pipeline, the LLM processing chain, the REST API, and the frontend.

---

## Features

| | |
|--|--|
| 🔄 **Auto-ingestion** | Fetches full article text from 10+ sources every 6 hours via Railway cron |
| 🧹 **LLM filtering** | GPT-4o removes off-topic articles before they enter the pipeline |
| 📊 **Signal scoring** | Rule-based heuristic (0–100) weights recency, source authority, and coverage |
| 🧵 **Story clustering** | TF-IDF + cosine similarity groups related articles into story threads |
| 🔁 **Cross-day dedup** | Stories that evolve across days are merged, not duplicated |
| 📝 **Draft generation** | GPT-4o writes a LinkedIn-style newsletter draft for the top story |
| 🎯 **Role personalisation** | PM / Developer / Student lenses with tailored "why it matters" context |
| 🌐 **Bilingual** | Every field (title, summary, takeaways, draft) auto-translated to Chinese |
| ⚡ **Recency ranking** | Digest ranks stories by `score × e^(−0.15 × age_days)` — fresh beats stale |
| 🔍 **Full-text search** | Archive search across all clusters and articles |

---

## Architecture

```
Vercel (Next.js 16)
    └── NEXT_PUBLIC_API_URL
            │
            ▼
Railway (FastAPI)                  Railway (Cron — 4×/day)
    ├── GET  /api/digest/today     └── ingest → filter → score
    ├── GET  /api/clusters/{id}        → cluster → dedup → summarize
    ├── GET  /api/drafts/{id}          → translate → draft → translate
    ├── GET  /api/search
    └── POST /api/admin/*  (protected)
            │
            ▼
    PostgreSQL + Redis (Railway managed)
```

The backend is **stateless**. All state lives in PostgreSQL. Redis caches hot endpoints (5-min TTL) and is busted after each successful pipeline run.

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 16, TypeScript, Tailwind CSS | App Router, RSC, fast builds |
| Backend | FastAPI, SQLAlchemy 2, Alembic, psycopg3 | Async-ready, typed, proper migrations |
| Database | PostgreSQL | Relational + full-text search |
| Cache | Redis | Simple TTL cache; graceful fallback if unavailable |
| AI | OpenAI GPT-4o-mini | filter · score · cluster · summarise · translate · draft |
| Deployment | Vercel + Railway | Frontend CDN + managed Postgres/Redis/cron |
| i18n | Custom `useI18n()` hook | Zero-dependency EN/ZH with type-safe translation keys |

---

## Pipeline stages

Each stage is a standalone script; `run_pipeline.py` orchestrates them in sequence.

| # | Stage | Script | What it does |
|---|-------|--------|-------------|
| 1 | **Ingest** | `ingest_full_articles` | Fetches full HTML; deduplicates by URL; incremental via HTTP ETag + poll-frequency gate |
| 2 | **Filter** | `filter_articles` | GPT-4o classifies each article as relevant/irrelevant to AI |
| 3 | **Score** | `score_articles` | Heuristic signal score: source priority + article density + recency |
| 4 | **Cluster** | `cluster_articles` | TF-IDF vectorisation → cosine similarity → greedy merge into story clusters |
| 5 | **Status** | `update_cluster_status` | Labels clusters: `new` / `escalating` / `peaking` / `ongoing` / `fading` |
| 6 | **Dedup** | `dedup_clusters` | Title-similarity merge across days so recurring stories accumulate evidence |
| 7 | **Summarise** | `summarize` | GPT-4o writes summary, 3 takeaways, and PM / dev / student audience blocks |
| 8 | **Translate clusters** | `translate_clusters` | Translates all cluster text fields to Chinese |
| 9 | **Draft** | `generate_draft` | GPT-4o writes a LinkedIn newsletter draft for the highest-scoring cluster |
| 10 | **Translate drafts** | `translate_drafts` | Translates all draft fields to Chinese |

---

## Data sources

| Source | Type | Cadence |
|--------|------|---------|
| Anthropic Newsroom | HTML scrape | every 60 min |
| OpenAI News | RSS | every 60 min |
| Google DeepMind Blog | HTML scrape | every 120 min |
| Hugging Face Blog | RSS | every 60 min |
| arXiv cs.AI + cs.LG | RSS | daily |
| The Verge AI | RSS | every 30 min |
| Ars Technica AI | RSS | every 60 min |
| TechCrunch AI | RSS | every 30 min |
| VentureBeat AI | RSS | every 30 min |
| AI News | RSS | every 60 min |
| The Register AI | RSS | every 60 min |
| Import AI (newsletter) | RSS | daily |
| TLDR AI (newsletter) | RSS | daily |

---

## Project layout

```
├── app/                    Next.js pages (digest, cluster, draft, archive, admin)
├── components/             UI components (digest cards, cluster view, draft view…)
├── lib/
│   ├── api/                Type-safe backend API client
│   ├── i18n/               EN/ZH locale strings with typed keys
│   └── data/               Static content (AI Basics daily rotation)
├── types/                  Shared TypeScript type definitions
└── backend/
    ├── app/
    │   ├── adapters/       Per-source scrapers (RSS, HTML, arXiv, OpenAI, DeepMind…)
    │   ├── api/routes/     FastAPI route handlers
    │   ├── crud/           DB query helpers
    │   ├── models/         SQLAlchemy ORM models
    │   ├── services/       Pipeline business logic (ingest, cluster, summarise…)
    │   └── source_catalog/ trusted_sources.yaml — add new sources here
    ├── migrations/         Alembic migration history
    └── scripts/            Pipeline stage scripts + run_pipeline.py orchestrator
```

---

## Local development

### Frontend

```bash
npm install
npm run dev          # http://localhost:3000
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
cp .env.example .env   # fill in DATABASE_URL + OPENAI_API_KEY
alembic upgrade head
uvicorn app.main:app --reload   # http://localhost:8000
```

### Run the pipeline manually

```bash
cd backend/

# All stages at once
python -m scripts.run_pipeline --triggered-by manual

# Or stage by stage
python -m scripts.ingest_full_articles --slug anthropic-newsroom --per-source-limit 5
python -m scripts.filter_articles
python -m scripts.score_articles
python -m scripts.cluster_articles
python -m scripts.summarize
python -m scripts.generate_draft
```

---

## Deployment

### Backend (Railway)

Deployed as two Railway services sharing one Postgres + Redis instance:

| Service | Config | Schedule |
|---------|--------|----------|
| `personal-ai-intelligence-tool` | `railway.toml` | Always-on API |
| `daily-pipeline-cron` | `railway.cron.toml` | 02:00 / 08:00 / 14:00 / 20:00 UTC |

On startup, `alembic upgrade head` runs in a background thread so Railway's healthcheck passes immediately.

Required environment variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql+psycopg://…`) |
| `OPENAI_API_KEY` | GPT-4o calls for all AI pipeline stages |
| `REDIS_URL` | Auto-set by Railway Redis plugin |
| `APP_ENV` | `production` |
| `JWT_SECRET` | Signs admin JWT tokens |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin login credentials |

### Frontend (Vercel)

Auto-deploys from GitHub. Set one environment variable:

```
NEXT_PUBLIC_API_URL=https://personal-ai-intelligence-tool-production.up.railway.app
```

---

## API highlights

```bash
# Today's digest (featured story + top clusters + draft)
GET /api/digest/today

# All clusters (paginated, ranked by recency-weighted score)
GET /api/clusters?limit=20&offset=0

# Single cluster with source articles + related stories
GET /api/clusters/{id}

# Role-personalised draft
GET /api/drafts/{id}?role=pm          # PM lens
GET /api/drafts/{id}?role=developer   # Engineer lens
GET /api/drafts/{id}?role=student     # Student / job-seeker lens

# Full-text search
GET /api/search?q=GPT-5&type=cluster

# Interactive docs
GET /docs
```

---

## Design decisions worth noting

**Why not vector search for clustering?**
TF-IDF + cosine similarity runs locally with no API calls, adds zero cost per run, and works well on the short article excerpts we ingest. Vector embeddings would improve recall across semantically similar but lexically different articles — a natural next upgrade.

**Why GPT-4o-mini instead of a larger model?**
The pipeline runs 4× per day across 10+ sources. Using the mini model keeps cost under $1/day while still producing high-quality filter/score/summarise/draft output.

**Why Redis cache with 5-min TTL?**
The digest and cluster list endpoints are hit on every page load. Caching avoids repeated Postgres aggregation queries. The pipeline explicitly busts the cache (`ai_tool:*`) after every successful run so stale data never persists beyond one cycle.
