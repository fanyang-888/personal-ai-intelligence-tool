import { SectionTitle } from "@/components/shared/section-title";
import type { AudienceBlocks } from "@/types/cluster";

type AudienceBlocksProps = {
  audience: AudienceBlocks;
};

export function AudienceBlocksSection({ audience }: AudienceBlocksProps) {
  return (
    <section className="mb-6">
      <SectionTitle>Why it matters for you</SectionTitle>
      <div className="space-y-4 text-sm leading-relaxed text-foreground">
        <div>
          <h3 className="font-semibold">PMs</h3>
          <p className="mt-1 text-zinc-700">{audience.pm}</p>
        </div>
        <div>
          <h3 className="font-semibold">Developers</h3>
          <p className="mt-1 text-zinc-700">{audience.developer}</p>
        </div>
        <div>
          <h3 className="font-semibold">Students & job seekers</h3>
          <p className="mt-1 text-zinc-700">{audience.studentJobSeeker}</p>
        </div>
      </div>
    </section>
  );
}
