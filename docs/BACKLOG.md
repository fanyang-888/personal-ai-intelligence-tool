# Backlog

Engineering debt and future improvements, roughly prioritised.

---

## High priority

### More data sources
Currently ingesting from 3 sources (OpenAI News, Anthropic Newsroom, TechCrunch AI). High-value additions:
- The Gradient, Import AI, Ahead of AI (newsletters)
- arXiv cs.AI/cs.LG abstracts
- Hacker News AI threads (top-N by score)
- Google DeepMind, Meta AI blogs

### Chinese (ZH) summaries
The frontend has a ZH/EN language toggle and the schema supports `LocalizedString` with `en`/`zh` fields, but the pipeline currently only generates English content. Need to either:
- Add a second GPT-4o summarisation pass with ZH prompts
- Or translate in-place if the target audience warrants it

### Search quality
Current search is PostgreSQL `ILIKE` over titles and summaries. Upgrade path:
- `tsvector` + `tsquery` for proper full-text search with ranking
- Or embeddings-based semantic search (pgvector)

---

## Medium priority

### Incremental ingestion
Current ingest fetches a fixed `--per-source-limit` per run and relies on `articles.url` deduplication to skip already-seen items. A proper incremental loop would:
- Store `last_polled_at` per source
- Use HTTP `ETag` / `Last-Modified` conditional requests
- Only process articles newer than last run

### OpenAI News HTML fallback
OpenAI's RSS sometimes lags behind the website. Implement an HTML index scrape (equivalent to the Anthropic adapter) as a fallback when RSS returns 0 items.

### Pipeline observability
- Per-run summary stats stored in a `pipeline_runs` table (articles processed, clusters created, errors, duration)
- Optional webhook/email alert on pipeline failure

### Cluster deduplication across days
Today, the same story can produce a new cluster on day 2 if it gets new coverage. Add logic to merge new articles into an existing open cluster when similarity is high enough, instead of always creating new ones.

---

## Low priority / Nice to have

### `sources` table as single source of truth
Currently, trusted sources are defined in `trusted_sources.yaml` (drives adapters) and mirrored into the `sources` table. A future refactor could make the DB the canonical source, with YAML only as an import format.

### Draft personalisation
The draft prompt currently targets a generic "AI professional" audience. Support per-user tone/audience configuration stored in a user profile.

### Authentication
The API is currently public. Add JWT auth if the tool is ever multi-user or exposed more broadly.

### Redis caching
`redis_url` is already in `Settings` as an optional field. Wire up response caching for `/api/digest/today` and `/api/clusters` so repeated frontend loads don't re-query the DB.

### Re-run pipeline via API
Expose `POST /api/pipeline/run` (admin-auth required) to trigger a pipeline run on demand without needing Railway CLI access.
