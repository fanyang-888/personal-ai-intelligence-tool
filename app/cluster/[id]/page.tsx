// Server component — owns generateStaticParams and generateMetadata.
// All interactive logic lives in ClusterPageClient ("use client").

import type { Metadata } from "next";
import { ClusterPageClient } from "./cluster-page-client";

type Props = {
  params: Promise<{ id: string }>;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/api/clusters/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};

    const data = await res.json() as {
      title: { en: string; zh: string | null };
      summary: { en: string; zh: string | null };
    };

    const title = data.title?.en ?? "";
    const description = (data.summary?.en ?? "").slice(0, 160);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
      twitter: {
        card: "summary",
        title,
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

export default function ClusterPage() {
  return <ClusterPageClient />;
}
