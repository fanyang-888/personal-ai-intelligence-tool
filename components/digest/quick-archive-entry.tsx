import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";

/** Bottom-of-home CTA: no duplicate search field (keyword search lives in the top nav). */
export function DiscoverArchiveCta() {
  return (
    <section
      className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6"
      aria-labelledby="discover-archive-heading"
    >
      <SectionTitle id="discover-archive-heading">Discover in the Archive</SectionTitle>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
        Browse the full catalog of synthesized clusters and sources. Use the{" "}
        <span className="font-medium text-foreground">search field in the header</span>{" "}
        to find companies, models, themes, or keywords.
      </p>
      <Link
        href="/archive"
        className="mt-5 inline-block rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        Go to Archive
      </Link>
    </section>
  );
}
