import type { Article } from "@/types/article";

export const articles: Article[] = [
  {
    id: "art-1",
    clusterId: "cluster-1",
    sourceId: "src-1",
    title: "Vendors race to ship ‘agent browsers’ with enterprise audit hooks",
    url: "https://example.com/register-agent-browsers-enterprise",
    publishedAt: "2026-04-03T14:00:00.000Z",
    excerpt:
      "Early adopters describe guardrailed tab automation as a net win when receipts and undo are first-class—less so when the stack is a black box.",
    tags: ["Agents", "Enterprise"],
    themes: ["AI & productivity", "Trust"],
    channel: "web",
    credibilityLabel: "Wire reporting",
  },
  {
    id: "art-2",
    clusterId: "cluster-1",
    sourceId: "src-2",
    title: "Context windows meet browser chrome: what actually ships in 2026",
    url: "https://example.com/ars-agent-browser-shipping",
    publishedAt: "2026-04-03T09:30:00.000Z",
    excerpt:
      "Engineering teams say the hard problems are policy, provenance, and partial failure—not raw model reasoning on a single page.",
    tags: ["Browsers", "UX"],
    themes: ["AI & productivity"],
    channel: "web",
    credibilityLabel: "Analysis",
  },
  {
    id: "art-3",
    clusterId: "cluster-2",
    sourceId: "src-3",
    title: "Why your leaderboard score stopped predicting production incidents",
    url: "https://example.com/mit-eval-drift",
    publishedAt: "2026-04-02T11:00:00.000Z",
    excerpt:
      "Applied teams are quietly replacing generic benchmarks with small task suites built from tickets, traces, and on-call retros.",
    tags: ["Evals", "MLOps"],
    themes: ["Research", "Product"],
    channel: "email",
    credibilityLabel: "Analysis",
  },
  {
    id: "art-4",
    clusterId: "cluster-3",
    sourceId: "src-4",
    title: "On-device inference is back—this time with hybrid cloud routing",
    url: "https://example.com/ieee-edge-hybrid",
    publishedAt: "2026-04-03T07:15:00.000Z",
    excerpt:
      "Latency-sensitive assistants are splitting work between quantized local models and cloud fallbacks; thermal budgets still cap mobile ambition.",
    tags: ["Edge", "Mobile"],
    themes: ["Infrastructure"],
    channel: "feed",
    credibilityLabel: "Trade reporting",
  },
  {
    id: "art-5",
    clusterId: "cluster-3",
    sourceId: "src-2",
    title: "Spec decoding and tiny bundles: what changed the edge economics",
    url: "https://example.com/ars-spec-decoding-edge",
    publishedAt: "2026-04-02T16:45:00.000Z",
    excerpt:
      "Developers report bigger wins from runtime packaging and routing than from swapping embedding models on the server.",
    tags: ["Inference", "Cost"],
    themes: ["Infrastructure"],
    channel: "web",
  },
  {
    id: "art-6",
    clusterId: "cluster-4",
    sourceId: "src-5",
    title: "Enterprise copilots add vision and documents under stricter data maps",
    url: "https://example.com/reuters-multimodal-enterprise",
    publishedAt: "2026-04-03T12:20:00.000Z",
    excerpt:
      "Buyers are asking where pixels live, how long they persist, and how redaction propagates before signing multimodal add-ons.",
    tags: ["Enterprise", "Compliance"],
    themes: ["Enterprise AI"],
    channel: "email",
    credibilityLabel: "Wire reporting",
  },
  {
    id: "art-7",
    clusterId: "cluster-4",
    sourceId: "src-6",
    title: "Multimodal latency: when your copilot starts receiving images and PDFs",
    url: "https://example.com/verge-multimodal-latency",
    publishedAt: "2026-04-02T13:00:00.000Z",
    excerpt:
      "Product teams are rewriting SLAs to include upload, preprocessing, and streaming—not just token time to first answer.",
    tags: ["Multimodal", "SLA"],
    themes: ["Enterprise AI"],
    channel: "web",
    credibilityLabel: "Analysis",
  },
];

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getArticlesByClusterId(clusterId: string): Article[] {
  return articles.filter((a) => a.clusterId === clusterId);
}
