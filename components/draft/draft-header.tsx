import Link from "next/link";
import type { Draft } from "@/types/draft";

type DraftHeaderProps = {
  draft: Draft;
  clusterTitle: string;
};

export function DraftHeader({ draft, clusterTitle }: DraftHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{draft.title}</h1>
      {draft.topic ? <p className="mt-2 text-sm text-zinc-600">Topic: {draft.topic}</p> : null}
      <p className="mt-3 text-sm text-foreground">
        Linked story cluster:{" "}
        <Link href={`/cluster/${draft.clusterId}`} className="font-medium underline">
          {clusterTitle}
        </Link>
      </p>
    </header>
  );
}
