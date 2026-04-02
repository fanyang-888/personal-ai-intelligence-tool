import Link from "next/link";
import { notFound } from "next/navigation";
import { drafts, getDraftById, getDraftBodies } from "@/lib/mock-data/drafts";
import { getClusterById } from "@/lib/mock-data/clusters";
import { DraftHeader } from "@/components/draft/draft-header";
import { DraftActions } from "@/components/draft/draft-actions";
import { SectionTitle } from "@/components/shared/section-title";

type DraftPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return drafts.map((d) => ({ id: d.id }));
}

export default async function DraftPage({ params }: DraftPageProps) {
  const { id } = await params;
  const draft = getDraftById(id);
  if (!draft) notFound();

  const cluster = getClusterById(draft.clusterId);
  const clusterTitle = cluster?.title ?? draft.clusterId;
  const bodies = getDraftBodies(draft);

  return (
    <article>
      <DraftHeader draft={draft} clusterTitle={clusterTitle} />

      <DraftActions bodies={bodies} />

      <section className="mb-6">
        <SectionTitle>Takeaways</SectionTitle>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
          {draft.takeaways.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      </section>

      <section className="mb-6">
        <SectionTitle>Career-oriented interpretation</SectionTitle>
        <p className="text-sm leading-relaxed text-foreground">{draft.careerInterpretation}</p>
      </section>

      <section className="rounded border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
        <p className="font-medium text-foreground">Notes</p>
        <p className="mt-2">
          Editing in-app is out of scope for this sprint. Copy the draft and refine in your notes
          app or doc, then save pointers back in your own workflow.
        </p>
        {cluster ? (
          <p className="mt-3">
            <Link href={`/cluster/${cluster.id}`} className="font-medium underline">
              Back to story cluster
            </Link>
          </p>
        ) : null}
      </section>
    </article>
  );
}
