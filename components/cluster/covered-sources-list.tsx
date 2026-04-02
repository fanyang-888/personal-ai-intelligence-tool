import { SectionTitle } from "@/components/shared/section-title";
import type { Source } from "@/types/source";

type CoveredSourcesListProps = {
  sources: Source[];
};

export function CoveredSourcesList({ sources }: CoveredSourcesListProps) {
  return (
    <section className="mb-6">
      <SectionTitle>Covered sources</SectionTitle>
      <ul className="space-y-2 text-sm">
        {sources.map((s) => (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4"
            >
              {s.name}
            </a>
            {s.publisher ? (
              <span className="text-zinc-600"> — {s.publisher}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
