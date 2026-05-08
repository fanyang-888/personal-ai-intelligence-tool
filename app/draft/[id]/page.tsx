// Server component — owns generateStaticParams and generateMetadata.
// All interactive logic lives in DraftPageClient ("use client").

import type { Metadata } from "next";
import { DraftPageClient } from "./draft-page-client";

type Props = {
  params: Promise<{ id: string }>;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/api/drafts/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};

    const data = await res.json() as {
      title: { en: string; zh: string | null };
    };

    const titleEn = data.title?.en ?? "";
    const description = titleEn ? `AI-written draft on: ${titleEn}` : "";

    return {
      title: titleEn,
      description,
      openGraph: {
        title: titleEn,
        description,
      },
      twitter: {
        card: "summary",
        title: titleEn,
        description,
      },
    };
  } catch {
    return {};
  }
}

export function generateStaticParams() {
  return [];
}

export default function DraftPage() {
  return <DraftPageClient />;
}
