import type { Draft } from "@/types/draft";

export const drafts: Draft[] = [
  {
    id: "draft-1",
    clusterId: "cluster-1",
    title: "Morning brief: agent browsers",
    topic: "Agent-style browsers",
    body: `Agent-style browsers are shifting the center of gravity from “read and search” to “delegate and verify.” Instead of asking for a summary of a page, users increasingly expect the system to complete multi-step tasks across tabs while surfacing receipts for what changed.

For this week, the practical implication is simple: design for inspectability. If your product cannot explain actions, undo them, or pause for approval, adoption will stall even if the underlying model is strong.`,
    variants: [
      `A tighter version: treat the agent as a junior operator. Give it checklists, force it to cite sources for each action, and default to “suggest” before “execute.” Buyers will ask for audit trails—build them early.

Edge case: shared machines and SSO-heavy enterprises will demand role-based policies. If you only optimize for individual prosumer users, you will lose the IT gate.`,
      `Narrative angle: the browser becomes a workflow runtime. That means latency, reliability, and partial failure handling matter more than raw reasoning scores. Invest in retries, human takeover, and clear state machines.

Interview prompt you can reuse: “How would you instrument an agent so a PM can trust weekly metrics?”`,
    ],
    takeaways: [
      "Delegation beats chat when the user’s goal spans multiple sites.",
      "Trust is a product surface: receipts, undo, approvals.",
      "Enterprise adoption hinges on policy and logging, not demos.",
    ],
    careerInterpretation:
      "If you are targeting PM or solutions roles, practice one story about guardrails and one about measurable task completion. If you are engineering-focused, be ready to discuss tracing, eval harnesses, and safe action APIs.",
  },
  {
    id: "draft-2",
    clusterId: "cluster-4",
    title: "Enterprise multimodal rollout checklist",
    topic: "Multimodal assistants",
    body: `Bundling vision and documents into the same copilot surface sounds simple until procurement asks where pixels live and for how long.

Start with data maps: which modalities cross regions, which stay on-device, and how redaction propagates. Then align UX to “show your work” for every non-text answer.`,
    variants: [
      `Shorter brief: draw the data-flow diagram before the demo. If legal cannot trace pixels, the deal stalls regardless of model quality.`,
    ],
    takeaways: [
      "Residency questions spike when images enter the thread.",
      "Latency SLAs need end-to-end budgets, not model-only numbers.",
    ],
    careerInterpretation:
      "Practice explaining multimodal risk in one slide: data flow, retention, and human review hooks.",
  },
];

export function getDraftById(id: string): Draft | undefined {
  return drafts.find((d) => d.id === id);
}

/** All full-text strings for regenerate UI (body first, then variants) */
export function getDraftBodies(draft: Draft): string[] {
  return [draft.body, ...(draft.variants ?? [])];
}
