# Personal AI Intelligence Tool

Frontend-first local MVP: **Daily Digest** (`/`), **story cluster** detail (`/cluster/[id]`), **Archive** search (`/archive`), and **draft** detail (`/draft/[id]`). Data is mocked under `lib/mock-data/`; there is no backend yet.

## Live site (GitHub Pages)

After you enable **Settings → Pages → Source: GitHub Actions** and push to `main`, the workflow deploys the static export:

**https://fanyang-888.github.io/personal-ai-intelligence-tool/**

Examples:

- [Daily Digest](https://fanyang-888.github.io/personal-ai-intelligence-tool/)
- [Cluster](https://fanyang-888.github.io/personal-ai-intelligence-tool/cluster/cluster-1)
- [Draft](https://fanyang-888.github.io/personal-ai-intelligence-tool/draft/draft-1)
- [Archive](https://fanyang-888.github.io/personal-ai-intelligence-tool/archive)

If you **rename the GitHub repository**, set the same path in the workflow and in `PAGES_BASE_PATH` (see below).

## Run locally

```bash
cd personal-ai-intelligence-tool
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Do **not** set `PAGES_BASE_PATH` for normal local dev (the app is served at `/`).

## Build (static export)

`next build` emits static files to `out/` (`output: "export"`).

```bash
npm run build
```

Preview the **GitHub Pages** URL layout locally:

```bash
PAGES_BASE_PATH=/personal-ai-intelligence-tool npm run build
npx --yes serve out
```

Then open the URL `serve` prints (paths will include `/personal-ai-intelligence-tool/...`).

**Note:** With static export, use `npm run dev` for development. `npm run start` is not used for the `out/` folder.

## Try these routes

| Route | Local example | On GitHub Pages |
|--------|----------------|-----------------|
| Daily Digest | `/` | `/personal-ai-intelligence-tool/` |
| Cluster | `/cluster/cluster-1` | `.../cluster/cluster-1` |
| Archive | `/archive` | `.../archive` |
| Draft | `/draft/draft-1` | `.../draft/draft-1` |

On a draft page, **Regenerate** cycles through 2–3 local text variants (no model call).

## Folder map

- `app/` — App Router pages and layouts
- `components/` — UI by area (`layout`, `digest`, `cluster`, `archive`, `draft`, `shared`)
- `lib/mock-data/` — `sources`, `clusters`, `drafts`
- `lib/mappers/` — `digest`, `archive` view shaping
- `lib/utils/` — `format-date`, `search`, `score`
- `types/` — `source`, `cluster`, `draft`
- `public/` — static assets (includes `.nojekyll` for GitHub Pages)
- `.github/workflows/` — deploy to GitHub Pages on push to `main`

Stack: **Next.js** (App Router), **TypeScript**, **Tailwind CSS**.
