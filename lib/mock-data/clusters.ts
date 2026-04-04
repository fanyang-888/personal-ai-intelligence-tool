import type { Cluster } from "@/types/cluster";

export const clusters: Cluster[] = [
  {
    id: "cluster-1",
    clusterType: "AI & productivity",
    title: "Agent-style browsers reshape how work gets done",
    subtitle: "From demos to daily workflows",
    theme: "AI & productivity",
    themes: ["AI & productivity", "Trust", "Workflow"],
    tags: ["Agents", "Browsers", "Workflow"],
    storyStatus: "Escalating",
    clusterScore: 98,
    freshnessLabel: "Updated 2h ago",
    firstSeenAt: "2026-04-01T08:00:00.000Z",
    lastSeenAt: "2026-04-03T15:00:00.000Z",
    summary:
      "Vendors are shipping browser experiences that plan, click, and summarize on behalf of users. The open question is whether this becomes a trusted assistant or a brittle automation layer.\n\nEarly adopters report huge time savings when guardrails are clear: receipts for actions, undo paths, and policy-aware pauses before sensitive steps. Enterprise buyers are already asking for audit logs that match what demos promise.",
    takeaways: [
      "Task delegation is moving from “chat about a page” to “complete a workflow across tabs.”",
      "Trust and provenance matter as much as model quality when agents act for you.",
      "Enterprise buyers will prioritize audit logs and policy controls over flashy demos.",
    ],
    whyItMatters:
      "If agentic browsing sticks, knowledge workers will spend less time tab-hopping and more time reviewing outcomes—which changes how products are designed and measured.",
    audience: {
      pm: "Position features around outcomes and guardrails, not raw model scores.",
      developer: "Design APIs and UX affordances that expose what the agent did and why.",
      studentJobSeeker:
        "Practice articulating tradeoffs between autonomy, safety, and latency in interviews.",
    },
    articleIds: ["art-1", "art-2"],
    relatedClusterIds: [],
    draftId: "draft-1",
  },
  {
    id: "cluster-2",
    clusterType: "Research",
    title: "Evaluation drift: benchmarks vs. real user tasks",
    theme: "Research",
    themes: ["Research", "Product"],
    tags: ["Evals", "Benchmarks", "Product"],
    storyStatus: "Ongoing",
    clusterScore: 91,
    freshnessLabel: "Seen today",
    firstSeenAt: "2026-03-28T10:00:00.000Z",
    lastSeenAt: "2026-04-03T06:00:00.000Z",
    summary:
      "Leaderboards still move markets, but teams are quietly building internal task suites that better predict deployment success. The gap between public scores and on-the-ground reliability is widening.",
    takeaways: [
      "Static benchmarks lag product-specific failure modes.",
      "Human-in-the-loop eval is expensive but often the only signal that matters.",
      "Smaller models win when the task slice is narrow and well-defined.",
    ],
    whyItMatters:
      "Choosing the wrong eval story can misallocate months of engineering and create compliance risk when claims do not match behavior.",
    audience: {
      pm: "Tie roadmap bets to task-level metrics your users actually perform.",
      developer: "Invest in regression harnesses and trace replay before scaling traffic.",
      studentJobSeeker: "Study how to design eval rubrics and error taxonomies.",
    },
    articleIds: ["art-3"],
    relatedClusterIds: [],
  },
  {
    id: "cluster-3",
    clusterType: "Infrastructure",
    title: "Edge inference quietly wins latency-sensitive features",
    theme: "Infrastructure",
    themes: ["Infrastructure", "Mobile"],
    tags: ["Edge", "Latency", "Mobile"],
    storyStatus: "Ongoing",
    clusterScore: 88,
    freshnessLabel: "Updated 5h ago",
    firstSeenAt: "2026-03-30T12:00:00.000Z",
    lastSeenAt: "2026-04-03T11:30:00.000Z",
    summary:
      "On-device and edge deployments are back in vogue for privacy, cost, and responsiveness—especially for assistants that must feel instant. Hybrid routing between device and cloud is now a default architecture conversation.",
    takeaways: [
      "Quantization and spec decoding are table stakes for edge bundles.",
      "Hybrid cloud/edge routing is a product decision as much as an infra one.",
      "Battery and thermal constraints still cap model size on mobile.",
    ],
    whyItMatters:
      "Latency and offline behavior can be the difference between a feature users trust and one they disable.",
    audience: {
      pm: "Prioritize scenarios where milliseconds change perceived intelligence.",
      developer: "Prototype fallbacks when the device tier cannot run the full stack.",
      studentJobSeeker: "Learn the basics of ONNX, CoreML, and mobile ML lifecycles.",
    },
    articleIds: ["art-4", "art-5"],
    relatedClusterIds: [],
  },
  {
    id: "cluster-4",
    clusterType: "Enterprise AI",
    title: "Multimodal assistants move from demo to default in enterprise suites",
    theme: "Enterprise AI",
    themes: ["Enterprise AI", "Compliance"],
    tags: ["Multimodal", "Enterprise", "Assistants"],
    storyStatus: "New",
    clusterScore: 86,
    freshnessLabel: "Updated 4h ago",
    firstSeenAt: "2026-04-03T04:00:00.000Z",
    lastSeenAt: "2026-04-03T13:00:00.000Z",
    summary:
      "Major vendors are bundling vision + document understanding into the same copilot surfaces finance and legal teams already use. Buyers are asking harder questions about data residency and retention.",
    takeaways: [
      "Packaging beats raw capability when procurement runs the checklist.",
      "Redaction and access control become first-class multimodal problems.",
      "Latency budgets tighten when video and images enter the loop.",
    ],
    whyItMatters:
      "If your roadmap assumes text-only copilots, competitors will position whole-workflow assistants as table stakes within a year.",
    audience: {
      pm: "Map multimodal flows to the committees that sign contracts.",
      developer: "Plan for larger payloads, streaming, and PII boundaries per modality.",
      studentJobSeeker: "Practice one story about responsible deployment across modalities.",
    },
    articleIds: ["art-6", "art-7"],
    relatedClusterIds: [],
    draftId: "draft-2",
  },
];

export function getClusterById(id: string): Cluster | undefined {
  return clusters.find((c) => c.id === id);
}

/** Highest clusterScore wins; tie-break by lastSeenAt then id. */
export function getFeaturedCluster(): Cluster | undefined {
  if (clusters.length === 0) return undefined;
  return [...clusters].sort((a, b) => {
    const scoreDiff = (b.clusterScore ?? 0) - (a.clusterScore ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    const tb = new Date(b.lastSeenAt).getTime();
    const ta = new Date(a.lastSeenAt).getTime();
    if (tb !== ta) return tb - ta;
    return a.id.localeCompare(b.id);
  })[0];
}

/** Excludes featured cluster, sorted by score descending, capped. */
export function getTopClusters(limit = 3): Cluster[] {
  const featured = getFeaturedCluster();
  const cap = Math.min(Math.max(limit, 1), 10);
  const others = clusters
    .filter((c) => c.id !== featured?.id)
    .sort((a, b) => (b.clusterScore ?? 0) - (a.clusterScore ?? 0));
  return others.slice(0, cap);
}
