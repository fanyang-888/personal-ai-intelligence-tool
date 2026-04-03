import type { Cluster } from "@/types/cluster";

export const clusters: Cluster[] = [
  {
    id: "cluster-1",
    title: "Agent-style browsers reshape how work gets done",
    subtitle: "From demos to daily workflows",
    theme: "AI & productivity",
    tags: ["Agents", "Browsers", "Workflow"],
    storyStatus: "Breaking",
    clusterScore: 98,
    freshnessLabel: "Updated 2h ago",
    summary:
      "Vendors are shipping browser experiences that plan, click, and summarize on behalf of users. The open question is whether this becomes a trusted assistant or a brittle automation layer. Early adopters report huge time savings when guardrails are clear.",
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
    tags: ["Evals", "Benchmarks", "Product"],
    storyStatus: "Emerging",
    clusterScore: 91,
    freshnessLabel: "Seen today",
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
    sourceIds: ["src-3"],
    relatedClusterIds: ["cluster-1"],
    draftId: "draft-2",
  },
  {
    id: "cluster-3",
    title: "Edge inference quietly wins latency-sensitive features",
    theme: "Infrastructure",
    tags: ["Edge", "Latency", "Mobile"],
    storyStatus: "Stable",
    clusterScore: 88,
    freshnessLabel: "Updated 5h ago",
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
    sourceIds: ["src-4", "src-2"],
    relatedClusterIds: ["cluster-1"],
    draftId: "draft-3",
  },
  {
    id: "cluster-4",
    title: "Multimodal assistants move from demo to default in enterprise suites",
    theme: "Enterprise AI",
    tags: ["Multimodal", "Enterprise", "Assistants"],
    storyStatus: "Emerging",
    clusterScore: 86,
    freshnessLabel: "Updated 4h ago",
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
    sourceIds: ["src-5", "src-6"],
    relatedClusterIds: ["cluster-1", "cluster-5"],
    draftId: "draft-4",
  },
  {
    id: "cluster-5",
    title: "Open-weight models compress the price of experimentation",
    theme: "Models",
    tags: ["Open weights", "Cost", "Fine-tuning"],
    storyStatus: "Stable",
    clusterScore: 84,
    freshnessLabel: "Seen today",
    summary:
      "Smaller open models plus better tooling mean teams can prototype domain adapters without seven-figure API bills. Legal and safety review still lag the pace of downloads.",
    takeaways: [
      "Fine-tuning ROI improves when base models are good enough at instruction following.",
      "License hygiene matters as much as perplexity for serious shipping.",
      "Internal benchmarks beat vendor claims for narrow tasks.",
    ],
    whyItMatters:
      "Cheaper experimentation shifts leverage toward product and data—not just whoever has the biggest API budget.",
    audience: {
      pm: "Frame pilots around measurable task lift, not model branding.",
      developer: "Automate eval loops before scaling custom weights to production.",
      studentJobSeeker: "Learn LoRA/QLoRA tradeoffs and when full fine-tune wins.",
    },
    sourceIds: ["src-7"],
    relatedClusterIds: ["cluster-2", "cluster-4"],
    draftId: "draft-5",
  },
  {
    id: "cluster-6",
    title: "Regulators sharpen focus on training data provenance",
    theme: "Policy",
    tags: ["Regulation", "Data", "Compliance"],
    storyStatus: "Breaking",
    clusterScore: 82,
    freshnessLabel: "Updated 1h ago",
    summary:
      "New guidance and court-adjacent settlements are pushing vendors to document sourcing and opt-outs. Product teams are scrambling to align release trains with incomplete legal maps.",
    takeaways: [
      "“Public web” is no longer a blanket answer in enterprise sales cycles.",
      "Deletion and audit requirements propagate to embeddings and caches.",
      "Jurisdictions disagree; global products need layered policies.",
    ],
    whyItMatters:
      "A single provenance gap can block a deal or force a costly retrain—planning early is cheaper than retrofitting.",
    audience: {
      pm: "Treat data governance as a ship blocker, not a footnote.",
      developer: "Instrument lineage from ingest through fine-tune artifacts.",
      studentJobSeeker: "Read up on consent, fair use debates, and sector rules.",
    },
    sourceIds: ["src-5", "src-8"],
    relatedClusterIds: ["cluster-5"],
    draftId: "draft-6",
  },
  {
    id: "cluster-7",
    title: "Synthetic data makes a comeback—with sharper guardrails",
    theme: "Data",
    tags: ["Synthetic data", "Privacy", "Training"],
    storyStatus: "Emerging",
    clusterScore: 79,
    freshnessLabel: "Updated 6h ago",
    summary:
      "Teams are generating structured scenarios to stress-test agents and fill long-tail classes. The catch: without fidelity checks, synthetic sets amplify blind spots instead of fixing them.",
    takeaways: [
      "Diversity metrics for synthetic sets are as important as scale.",
      "Human spot audits still anchor trust for high-stakes domains.",
      "Mixing real and synthetic requires clear labeling downstream.",
    ],
    whyItMatters:
      "The teams that master selective synthesis will ship safer edge cases faster than those that only scale raw collection.",
    audience: {
      pm: "Budget for validation, not just generation throughput.",
      developer: "Build replayable seeds and diff tools for synthetic shifts.",
      studentJobSeeker: "Study domain randomization vs. naive paraphrase pipelines.",
    },
    sourceIds: ["src-9", "src-3"],
    relatedClusterIds: ["cluster-2"],
    draftId: "draft-7",
  },
  {
    id: "cluster-8",
    title: "Coding agents shift IDE design from autocomplete to task orchestration",
    theme: "Developer tools",
    tags: ["IDE", "Agents", "DevEx"],
    storyStatus: "Stable",
    clusterScore: 93,
    freshnessLabel: "Seen today",
    summary:
      "IDEs are adding runbooks, terminal integration, and review panels tuned for multi-step coding tasks. The UX challenge is keeping humans in control without constant interruption.",
    takeaways: [
      "Diff-first review beats chat-first for many professional developers.",
      "Context windows pressure teams to summarize repos intelligently.",
      "Security scanning must move closer to agent-generated patches.",
    ],
    whyItMatters:
      "Developer velocity is becoming a function of how well tools choreograph agents—not raw token autocomplete.",
    audience: {
      pm: "Prioritize trust surfaces: undo, test hooks, and explainable plans.",
      developer: "Design APIs that expose partial plans for user edits.",
      studentJobSeeker: "Practice describing agentic workflows in system design interviews.",
    },
    sourceIds: ["src-10", "src-7"],
    relatedClusterIds: ["cluster-1", "cluster-5"],
    draftId: "draft-8",
  },
  {
    id: "cluster-9",
    title: "Voice interfaces get a second wave—this time with better turn-taking",
    theme: "Interfaces",
    tags: ["Voice", "UX", "Realtime"],
    storyStatus: "Emerging",
    clusterScore: 77,
    freshnessLabel: "Updated 8h ago",
    summary:
      "Streaming models and lower-latency stacks are making barge-in and overlap handling feel natural. Hardware and OS permissions remain the hidden bottleneck for mainstream adoption.",
    takeaways: [
      "End-to-end latency budgets now include VAD, not just LLM tokens.",
      "Multilingual prosody is still uneven across vendors.",
      "Accessibility wins overlap with power-user features.",
    ],
    whyItMatters:
      "Voice that feels interruptible changes which tasks move off-screen—especially for mobile and field work.",
    audience: {
      pm: "Prototype scenarios where hands-free is a must, not a gimmick.",
      developer: "Measure full pipeline latency, not model-only numbers.",
      studentJobSeeker: "Study speech stacks: ASR, diarization, and NLU glue code.",
    },
    sourceIds: ["src-6"],
    relatedClusterIds: ["cluster-4"],
    draftId: "draft-9",
  },
  {
    id: "cluster-10",
    title: "RAG pipelines mature: chunking strategies become product decisions",
    theme: "Retrieval",
    tags: ["RAG", "Chunking", "Search"],
    storyStatus: "Stable",
    clusterScore: 80,
    freshnessLabel: "Updated 12h ago",
    summary:
      "Teams report bigger wins from restructuring knowledge bases than from swapping embedding models. Dynamic chunking and metadata routing are replacing one-size-fits-all splits.",
    takeaways: [
      "Structure in source docs matters more than exotic vector DB marketing.",
      "Hybrid sparse+dense is default for mixed corpora.",
      "Evaluation sets must include adversarial retrieval misses.",
    ],
    whyItMatters:
      "When answers sound fluent but cite wrong passages, users lose trust—chunking is where retrieval quality is actually won.",
    audience: {
      pm: "Invest in content ops alongside model upgrades.",
      developer: "Version chunks and map citations to stable anchors.",
      studentJobSeeker: "Learn recall@k, nDCG basics, and failure taxonomy design.",
    },
    sourceIds: ["src-8", "src-9", "src-10"],
    relatedClusterIds: ["cluster-2", "cluster-7"],
    draftId: "draft-10",
  },
];

export function getClusterById(id: string): Cluster | undefined {
  return clusters.find((c) => c.id === id);
}

export function getFeaturedCluster(): Cluster | undefined {
  return clusters.find((c) => c.featured) ?? clusters[0];
}

/** Top clusters for digest list: excludes featured, sorted by score, capped 5–10. */
export function getTopClusters(limit = 8): Cluster[] {
  const featured = getFeaturedCluster();
  const cap = Math.min(Math.max(limit, 5), 10);
  const others = clusters
    .filter((c) => c.id !== featured?.id)
    .sort((a, b) => (b.clusterScore ?? 0) - (a.clusterScore ?? 0));
  return others.slice(0, cap);
}
