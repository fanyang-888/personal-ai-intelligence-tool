"""Backfill topic_tag for existing clusters using keyword matching on tags + title.

No GPT calls — pure SQL keyword inference. Runs once automatically on deploy.

Revision ID: w3d3_backfill_topic_tags
Revises: w3d2_cluster_topic_tag
Create Date: 2026-05-08
"""

from alembic import op

revision = "w3d3_backfill_topic_tags"
down_revision = "w3d2_cluster_topic_tag"
branch_labels = None
depends_on = None

# ---------------------------------------------------------------------------
# Keyword → topic_tag mapping (ordered by priority — first match wins)
# Checks both the tags JSONB array and the representative_title (lowercased).
# ---------------------------------------------------------------------------
_RULES = [
    ("Funding",        ["fund", "investment", "raise", "series a", "series b", "seed", "valuat", "acqui", "ipo", "capital", "venture"]),
    ("Model Release",  ["release", "launch", "gpt", "claude", "gemini", "llama", "mistral", "qwen", "new model", "model release", "open-source model", "weights"]),
    ("Research",       ["research", "paper", "arxiv", "study", "benchmark", "dataset", "training", "preprint", "findings", "experiment"]),
    ("Safety",         ["safety", "alignment", "bias", "risk", "harm", "guardrail", "jailbreak", "red team", "responsible", "ethics"]),
    ("Regulation",     ["regulat", "policy", "law", "govern", "legislat", "congress", "eu ai", "compliance", "ban", "legal"]),
    ("Product Launch", ["product", "launch", "feature", "update", "plugin", "integration", "api", "sdk", "tool", "chatbot", "assistant"]),
    ("Open Source",    ["open source", "open-source", "github", "hugging face", "community", "mit license", "apache"]),
    ("Infrastructure", ["infrastructure", "cloud", "gpu", "chip", "hardware", "data center", "nvidia", "amd", "tpu", "compute"]),
    ("Benchmark",      ["benchmark", "leaderboard", "eval", "mmlu", "humaneval", "score", "performance", "sota", "state-of-the-art"]),
]


def _build_case_sql() -> str:
    """Build a SQL CASE expression for keyword → topic_tag mapping."""
    branches = []
    for tag, keywords in _RULES:
        conditions = []
        for kw in keywords:
            kw_escaped = kw.replace("'", "''")
            conditions.append(
                f"(tags::text ILIKE '%{kw_escaped}%' OR LOWER(representative_title) LIKE '%{kw_escaped}%')"
            )
        combined = " OR ".join(conditions)
        branches.append(f"    WHEN {combined} THEN '{tag}'")

    return "CASE\n" + "\n".join(branches) + "\n    ELSE 'Other'\nEND"


def upgrade() -> None:
    case_expr = _build_case_sql()
    op.execute(f"""
        UPDATE clusters
        SET topic_tag = {case_expr}
        WHERE topic_tag IS NULL
    """)


def downgrade() -> None:
    # Reset all backfilled tags (leaves manually-set ones too — acceptable)
    op.execute("UPDATE clusters SET topic_tag = NULL")
