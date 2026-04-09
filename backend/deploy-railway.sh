#!/usr/bin/env bash
# Railway deployment script for personal-ai-intelligence-tool backend
# Usage: RAILWAY_TOKEN=<your-token> ./deploy-railway.sh
# Get your token from: https://railway.com/account/tokens

set -euo pipefail

BACKEND_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -z "${RAILWAY_TOKEN:-}" ]; then
  echo "ERROR: RAILWAY_TOKEN is not set."
  echo "  1. Go to https://railway.com/account/tokens"
  echo "  2. Create a new token"
  echo "  3. Run: RAILWAY_TOKEN=<your-token> ./deploy-railway.sh"
  exit 1
fi

export RAILWAY_TOKEN

cd "$BACKEND_DIR"
echo "Working in: $BACKEND_DIR"

# --- Step 1: Create or link project ---
echo ""
echo "==> Initializing Railway project..."
railway init --name personal-ai-intelligence-tool-backend

# --- Step 2: Add PostgreSQL plugin ---
echo ""
echo "==> Adding PostgreSQL database..."
railway add --database postgres

# --- Step 3: Set environment variables ---
echo ""
echo "==> Setting environment variables..."
railway variables --set "APP_ENV=production"
railway variables --set "SOURCE_FETCH_USER_AGENT=PersonalAIIntelligenceTool/0.1 (+local-dev)"
railway variables --set "OPENAI_API_KEY=${OPENAI_API_KEY:?ERROR: OPENAI_API_KEY env var is not set}"
# DATABASE_URL is set automatically by Railway from the Postgres plugin as ${{Postgres.DATABASE_URL}}
# We need to map it to what our app expects (postgresql+psycopg:// format)
echo "  Note: DATABASE_URL will be set from the Postgres plugin variable reference."
echo "  After deploy, set it manually if needed:"
echo "    railway variables --set 'DATABASE_URL=\${{Postgres.DATABASE_URL}}'"

# --- Step 4: Deploy ---
echo ""
echo "==> Deploying to Railway..."
railway up --detach

echo ""
echo "==> Deployment triggered. Getting service URL..."
sleep 10
railway domain

echo ""
echo "==> Done! Now run post-deploy steps:"
echo "  railway run alembic upgrade head"
echo "  railway run python -m scripts.seed_sources"
echo "  railway run python -m scripts.ingest_full_articles"
echo "  railway run python -m scripts.filter_articles"
echo "  railway run python -m scripts.score_articles"
echo "  railway run python -m scripts.cluster_articles"
echo "  railway run python -m scripts.summarize"
echo "  railway run python -m scripts.generate_draft"
