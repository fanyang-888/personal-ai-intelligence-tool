# Personal AI Intelligence Tool

Frontend-first local MVP: **Daily Digest** (`/`), **story cluster** detail (`/cluster/[id]`), **Archive** search (`/archive`), and **draft** detail (`/draft/[id]`). Data is mocked under `lib/mock-data/`; there is no backend yet.

## Run locally

```bash
cd personal-ai-intelligence-tool
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production check
```

## Try these routes

| Route | Example |
|--------|---------|
| Daily Digest | `/` |
| Cluster | `/cluster/cluster-1` |
| Archive | `/archive` |
| Draft | `/draft/draft-1` |

On a draft page, **Regenerate** cycles through 2–3 local text variants (no model call).

## Folder map

- `app/` — App Router pages and layouts
- `components/` — UI by area (`layout`, `digest`, `cluster`, `archive`, `draft`, `shared`)
- `lib/mock-data/` — `sources`, `clusters`, `drafts`
- `lib/mappers/` — `digest`, `archive` view shaping
- `lib/utils/` — `format-date`, `search`, `score`
- `types/` — `source`, `cluster`, `draft`
- `public/` — static assets

Stack: **Next.js** (App Router), **TypeScript**, **Tailwind CSS**.
