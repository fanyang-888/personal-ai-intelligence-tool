"""Generate a LinkedIn-style draft from the top cluster.

Usage (from backend/):
    python -m scripts.generate_draft                      # auto-pick top cluster
    python -m scripts.generate_draft --cluster-id <uuid>  # specific cluster
    python -m scripts.generate_draft --print              # print draft to stdout
"""

from __future__ import annotations

import argparse
import logging
import sys
import uuid

from app.db import session_scope
from app.logging_config import configure_logging
from app.services.draft_generation import generate_daily_draft, generate_draft_for_cluster
from app.crud.cluster import get_cluster_by_id

logger = logging.getLogger(__name__)


def main(argv: list[str] | None = None) -> int:
    configure_logging()
    parser = argparse.ArgumentParser(description="Generate a LinkedIn draft from a cluster")
    parser.add_argument("--cluster-id", type=str, default=None, help="Specific cluster UUID")
    parser.add_argument("--print", dest="print_draft", action="store_true", help="Print draft to stdout")
    args = parser.parse_args(argv)

    draft_id = None
    draft_cluster_id = None
    draft_full_text = None

    with session_scope() as db:
        if args.cluster_id:
            try:
                cid = uuid.UUID(args.cluster_id)
            except ValueError:
                print(f"Invalid UUID: {args.cluster_id}", file=sys.stderr)
                return 1
            cluster = get_cluster_by_id(db, cid)
            if cluster is None:
                print(f"Cluster not found: {cid}", file=sys.stderr)
                return 1
            draft = generate_draft_for_cluster(db, cluster)
        else:
            draft = generate_daily_draft(db)

        if draft is not None:
            draft_id = draft.id
            draft_cluster_id = draft.cluster_id
            draft_full_text = draft.full_text

    if draft_id is None:
        print("No eligible cluster found for draft generation.")
        return 0

    print(f"Draft generated — id={draft_id} cluster_id={draft_cluster_id}")
    if args.print_draft:
        print("\n" + "=" * 60)
        print(draft_full_text)
        print("=" * 60)

    return 0


if __name__ == "__main__":
    sys.exit(main())
