"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { useI18n } from "@/lib/i18n";

type DraftActionProps = {
  draftId: string | undefined;
};

export function DraftAction({ draftId }: DraftActionProps) {
  const { t } = useI18n();

  return (
    <section className="rounded border border-zinc-200 p-4">
      <SectionTitle>{t.cluster.draftSectionTitle}</SectionTitle>
      {draftId ? (
        <>
          <p className="mb-3 text-sm text-zinc-600">{t.cluster.draftSectionLead}</p>
          <Link
            href={`/draft/${draftId}`}
            className="text-sm font-medium text-emerald-800 underline underline-offset-4 hover:text-emerald-950"
          >
            {t.cluster.openDraft}
          </Link>
        </>
      ) : (
        <p className="text-sm text-zinc-600">{t.cluster.noDraftLinked}</p>
      )}
    </section>
  );
}
