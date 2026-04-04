import type { Draft, LinkedInDraftContent } from "@/types/draft";

export const drafts: Draft[] = [
  {
    id: "draft-1",
    clusterId: "cluster-1",
    draftType: "linkedin",
    title: "Agent browsers — trust and receipts",
    generatedAt: "2026-04-03T14:30:00.000Z",
    hook: "The browser is quietly becoming a workflow runtime—not just a place to read.",
    summaryBlock:
      "Agent-style browsers are shifting expectations from “summarize this page” to “complete this task across tabs.” The teams that win will optimize for inspectability: receipts, undo, and pauses before sensitive actions—not only model scores.",
    takeaways: [
      "Delegation beats chat when the goal spans multiple sites.",
      "Trust is a product surface: show what changed and let users reverse it.",
      "Enterprise buyers will ask for policy and logs before they adopt at scale.",
    ],
    careerInterpretationBlock:
      "In PM or solutions interviews, keep one crisp story about guardrails and one about measurable task completion. If you’re engineering-focused, be ready to discuss tracing, eval harnesses, and safe action APIs.",
    audienceWhyItMattersBlock:
      "If you build or buy AI that acts on the user’s behalf, your roadmap should assume scrutiny—both from users and from IT. Design for verification early, or adoption stalls even when the model is strong.",
    closingBlock: "How are you making agent actions legible to a non-expert reviewer?",
    variants: [
      {
        hook: "Treat your agent like a junior operator: checklists, citations, and “suggest before execute.”",
        summaryBlock:
          "Buyers are already asking for audit trails that match what demos promise. Shared machines and SSO-heavy orgs will push role-based policies to the top of the requirements list—optimize for individuals only and you lose the IT gate.",
        takeaways: [
          "Default to suggest mode before destructive or cross-site actions.",
          "Cite sources per step so a human can verify without replaying the run.",
          "Enterprise adoption is a policy story, not a capability flex.",
        ],
        careerInterpretationBlock:
          "Practice one interview answer on instrumentation: “How would a PM trust weekly metrics from an agent?” Tie it to logs, sampling, and human review hooks.",
        audienceWhyItMattersBlock:
          "If your product cannot explain actions or roll them back, you will not pass procurement—regardless of benchmark scores.",
      },
      {
        hook: "Latency and partial failure matter more than raw reasoning when the browser is the runtime.",
        summaryBlock:
          "When agents orchestrate tabs, retries, human takeover, and clear state machines become the product. Reasoning benchmarks do not replace reliability in production workflows.",
        takeaways: [
          "Design explicit states: running, blocked, needs approval, failed.",
          "Invest in retries and graceful degradation before fancier prompts.",
          "PMs should ask for task-level SLAs, not model-only numbers.",
        ],
        careerInterpretationBlock:
          "Be able to sketch a minimal state machine for an agent workflow and where a human steps in—many hiring loops now probe operational maturity, not just architecture diagrams.",
        audienceWhyItMattersBlock:
          "Shipping agentic UX without reliability is how you burn trust in the first real customer pilot.",
        closingBlock: "What is your first human-takeover path when the agent gets stuck?",
      },
    ] satisfies LinkedInDraftContent[],
  },
  {
    id: "draft-2",
    clusterId: "cluster-4",
    draftType: "linkedin",
    title: "Multimodal rollout — data maps first",
    generatedAt: "2026-04-03T11:00:00.000Z",
    hook: "Multimodal copilots are defaulting in enterprise suites—procurement is asking where pixels live.",
    summaryBlock:
      "Vision plus documents in one surface sounds simple until legal traces pixels across regions. Start with data maps: which modalities cross borders, which stay on-device, and how redaction propagates before you polish the demo.",
    takeaways: [
      "Residency and retention questions spike the moment images enter the thread.",
      "Redaction and access control are first-class multimodal problems, not afterthoughts.",
      "End-to-end latency budgets beat model-only SLAs when video and images are in play.",
    ],
    careerInterpretationBlock:
      "Have one slide on multimodal risk: data flow, retention, and where humans review non-text outputs. That single artifact often matters more than a feature list.",
    audienceWhyItMattersBlock:
      "If your roadmap still assumes text-only copilots, competitors will position whole-workflow assistants as table stakes within a year—especially in regulated functions.",
    closingBlock: "Have you drawn the pixel path for your copilot yet?",
    variants: [
      {
        hook: "Shorter version: draw the data-flow diagram before the demo.",
        summaryBlock:
          "If legal cannot trace pixels end to end, the deal stalls regardless of model quality. Lead with lineage, not sparkle.",
        takeaways: [
          "Procurement runs on checklists—package clarity, not raw capability.",
          "Map PII and sensitive visuals before you argue latency.",
          "Show human review hooks for every non-text answer.",
        ],
        careerInterpretationBlock:
          "Practice explaining one multimodal incident response: who sees the image, for how long, and how it is purged.",
        audienceWhyItMattersBlock:
          "A multimodal win in the lab that fails compliance review wastes quarters of roadmap.",
      },
    ] satisfies LinkedInDraftContent[],
  },
];

export function getDraftById(id: string): Draft | undefined {
  return drafts.find((d) => d.id === id);
}
