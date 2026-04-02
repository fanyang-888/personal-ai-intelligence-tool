import type { Cluster } from "@/types/cluster";

export const clusters: Cluster[] = [
  {
    id: "cluster-1",
    title: "Agent-style browsers reshape how work gets done",
    subtitle: "From demos to daily workflows",
    theme: "AI & productivity",
    summary:
      "Vendors are shipping browser experiences that plan, click, and summarize on behalf of users. The open question is whether this becomes a trusted assistant or a brittle automation layer.",
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
    sourceIds: ["src-1", "src-2"],
    relatedClusterIds: ["cluster-2", "cluster-3"],
    draftId: "draft-1",
    featured: true,
  },
  {
    id: "cluster-2",
    title: "Evaluation drift: benchmarks vs. real user tasks",
    theme: "Research",
    summary:
      "Leaderboards still move markets, but teams are quietly building internal task suites that better predict deployment success.",
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
    sourceIds: ["src-3"],
    relatedClusterIds: ["cluster-1"],
    draftId: "draft-2",
  },
  {
    id: "cluster-3",
    title: "Edge inference quietly wins latency-sensitive features",
    theme: "Infrastructure",
    summary:
      "On-device and edge deployments are back in vogue for privacy, cost, and responsiveness—especially for assistants that must feel instant.",
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
    sourceIds: ["src-4", "src-2"],
    relatedClusterIds: ["cluster-1"],
    draftId: "draft-3",
  },
];

export function getClusterById(id: string): Cluster | undefined {
  return clusters.find((c) => c.id === id);
}

export function getFeaturedCluster(): Cluster | undefined {
  return clusters.find((c) => c.featured) ?? clusters[0];
}

export function getTopClusters(limit = 5): Cluster[] {
  const featured = getFeaturedCluster();
  const rest = clusters.filter((c) => c.id !== featured?.id);
  return featured ? [featured, ...rest].slice(0, limit) : clusters.slice(0, limit);
}
