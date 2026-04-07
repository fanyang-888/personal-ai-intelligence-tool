# Personal AI Intelligence Tool

A **frontend-only MVP** for browsing a daily digest, story clusters, an archive with search, and LinkedIn-style drafts. All content lives in [`lib/mock-data/`](lib/mock-data/); there is **no backend, API, or authentication**.

## Known limitations

- **Mock data only** — nothing is persisted or fetched from a network.
- **Static export** — `next build` writes to `out/`; there are no server routes or SSR APIs. Use `npm run dev` for development; **`npm run start` is not used** for the static `out/` output.
- **GitHub Pages** — production builds set `PAGES_BASE_PATH` (see workflow). Local dev uses `/` — do not set `PAGES_BASE_PATH` when running `npm run dev`.
- **Draft “Regenerate”** — cycles a few **local** text variants; there is no model call.
- **Document titles** on cluster/draft pages are set client-side (`DocumentTitle`) so they work with static export.

**Requirements:** Node **20+**, npm.

## Quick start

```bash
cd personal-ai-intelligence-tool
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Live site (GitHub Pages)

**https://fanyang-888.github.io/personal-ai-intelligence-tool/**

Enable **Settings → Pages → Source: GitHub Actions**, then pushes to `main` run [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml) (build uses `PAGES_BASE_PATH=/personal-ai-intelligence-tool`). If you **rename the repo**, update that path in the workflow and in local preview commands below.

| Page | URL |
|------|-----|
| Daily Digest | [/](https://fanyang-888.github.io/personal-ai-intelligence-tool/) |
| Cluster | [/cluster/cluster-1](https://fanyang-888.github.io/personal-ai-intelligence-tool/cluster/cluster-1) |
| Archive | [/archive](https://fanyang-888.github.io/personal-ai-intelligence-tool/archive) |
| Draft | [/draft/draft-1](https://fanyang-888.github.io/personal-ai-intelligence-tool/draft/draft-1), `/draft/draft-2` |

## Build (static export)

```bash
npm run build
```

Output: `out/`. To match GitHub Pages paths locally:

```bash
PAGES_BASE_PATH=/personal-ai-intelligence-tool npm run build
npx --yes serve out
```

Use the URL `serve` prints (paths include `/personal-ai-intelligence-tool/...`).

## Routes (local)

| Route | Example |
|--------|---------|
| Daily Digest | `/` |
| Cluster | `/cluster/cluster-1` |
| Archive | `/archive` |
| Draft | `/draft/draft-1`, `/draft/draft-2` |

## Project layout

- `app/` — App Router pages and layouts
- `components/` — UI (`layout`, `digest`, `cluster`, `archive`, `draft`, `shared`)
- `lib/mock-data/` — sources, articles, clusters, drafts
- `lib/mappers/` — digest and archive view shaping
- `lib/utils/` — dates, search, scoring, archive URLs
- `types/` — shared TypeScript types
- `public/` — static assets (includes `.nojekyll` for GitHub Pages)

**Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS.
