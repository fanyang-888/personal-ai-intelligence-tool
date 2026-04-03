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
    clusterId: "cluster-2",
    title: "Evals that survive contact with users",
    topic: "Model evaluation",
    body: `Leaderboards are a compass, not a map. Teams that ship successfully tend to invest in small, high-signal task suites derived from real incidents and support tickets.

This week, try writing down five user tasks your product must never regress on. Those tasks become your north star before you chase the next benchmark gain.`,
    variants: [
      `Shorter brief: pick five “must not regress” user tasks. Automate them. Review failures weekly. Everything else is secondary.

Why it works: it aligns research metrics with revenue-critical workflows and makes tradeoffs legible to leadership.`,
      `Counterpoint: public benchmarks still move procurement. The winning strategy is dual-track: external story + internal task suite. Never confuse the two.`,
    ],
    takeaways: [
      "Product-specific eval beats generic leaderboard chasing.",
      "Regression tests should mirror real workflows, not toy prompts.",
      "Small models win when the task is scoped tightly.",
    ],
    careerInterpretation:
      "Being able to design an eval rubric and communicate failure modes is a differentiator for research and applied ML roles alike.",
  },
  {
    id: "draft-3",
    clusterId: "cluster-3",
    title: "Edge inference: when “fast enough” is the feature",
    topic: "Edge ML",
    body: `Moving inference closer to the user is not nostalgia—it is a product requirement for features that must feel instantaneous or work offline.

The design pattern is hybrid: tiny on-device models handle classification and routing; the cloud handles heavy reasoning. The craft is in choosing the split so users never feel the handoff.`,
    variants: [
      `One-liner strategy: route by tier—device for latency-sensitive paths, cloud for depth. Instrument both halves.

Risk: shipping a large on-device bundle hurts updates. Plan for modular downloads and graceful degradation.`,
      `For mobile specifically: thermal and battery caps are your real budget. If you ignore them, users will disable “smart” features within a week.`,
    ],
    takeaways: [
      "Hybrid edge/cloud is a product architecture choice.",
      "Quantization and efficient runtimes are prerequisites, not extras.",
      "Mobile constraints cap how large “local” models can be.",
    ],
    careerInterpretation:
      "Roles touching client ML value engineers who can reason about latency budgets and release mechanics, not only training loss curves.",
  },
  {
    id: "draft-4",
    clusterId: "cluster-4",
    title: "Enterprise multimodal rollout checklist",
    topic: "Multimodal assistants",
    body: `Bundling vision and documents into the same copilot surface sounds simple until procurement asks where pixels live and for how long.

Start with data maps: which modalities cross regions, which stay on-device, and how redaction propagates. Then align UX to “show your work” for every non-text answer.`,
    takeaways: [
      "Residency questions spike when images enter the thread.",
      "Latency SLAs need end-to-end budgets, not model-only numbers.",
    ],
    careerInterpretation:
      "Practice explaining multimodal risk in one slide: data flow, retention, and human review hooks.",
  },
  {
    id: "draft-5",
    clusterId: "cluster-5",
    title: "Open weights: when to fine-tune vs. prompt",
    topic: "Open models",
    body: `Cheaper bases mean more teams try custom weights. The winning pattern is tight task scope, clean eval harness, and license discipline—not the biggest download.

Pick five tasks, measure regressions weekly, and keep a paper trail of training data rights.`,
    takeaways: [
      "Narrow tasks reward adapters; broad ones need stronger bases.",
      "License audits belong in CI, not the night before launch.",
    ],
    careerInterpretation:
      "Be ready to compare LoRA vs full fine-tune with dollars and latency, not vibes.",
  },
  {
    id: "draft-6",
    clusterId: "cluster-6",
    title: "Provenance memo for legal and product",
    topic: "Training data policy",
    body: `Regulators and customers want receipts: what was ingested, with what consent, and how removals propagate.

Ship a living data register, not a one-pager. Tie it to embeddings, caches, and fine-tune artifacts so “delete” is operational, not aspirational.`,
    takeaways: [
      "Lineage is a cross-functional workflow, not a compliance checkbox.",
      "Retrofits cost more than designing hooks at ingest.",
    ],
    careerInterpretation:
      "Interviewers notice when you connect policy language to engineering artifacts.",
  },
  {
    id: "draft-7",
    clusterId: "cluster-7",
    title: "Synthetic data without self-deception",
    topic: "Synthetic data",
    body: `Synthetic sets can fill long tails fast. Without fidelity checks, they teach models confident nonsense.

Pair generation with spot audits, domain constraints, and diff tools that flag distribution shift week over week.`,
    takeaways: [
      "Measure diversity and failure modes, not just row counts.",
      "Label synthetic clearly downstream to avoid silent priors.",
    ],
    careerInterpretation:
      "Show you can design a validation rubric, not just a generation pipeline.",
  },
  {
    id: "draft-8",
    clusterId: "cluster-8",
    title: "IDE agents: design for review, not chat volume",
    topic: "Coding agents",
    body: `Developers trust diffs and tests more than eloquent explanations. Agentic IDEs should foreground plans, patches, and rollback—not endless threads.

Instrument each step: intent, files touched, commands run, and verification results.`,
    takeaways: [
      "Plan-then-act beats opaque end-to-end runs.",
      "Security review must hug the patch, not the prompt.",
    ],
    careerInterpretation:
      "Be ready to whiteboard an agent loop with human gates and observability.",
  },
  {
    id: "draft-9",
    clusterId: "cluster-9",
    title: "Voice UX: latency is the feature",
    topic: "Voice interfaces",
    body: `Natural turn-taking depends on VAD, ASR, and model streaming playing nicely. OS permissions and hardware mics still decide whether the demo ships.

Prototype on real devices early; lab metrics lie about echo and overlap.`,
    takeaways: [
      "Measure mouth-to-ear latency, not token latency alone.",
      "Accessibility use cases often define the quality bar.",
    ],
    careerInterpretation:
      "Voice roles reward systems thinking across audio stacks and UX.",
  },
  {
    id: "draft-10",
    clusterId: "cluster-10",
    title: "RAG chunking as a product craft",
    topic: "Retrieval",
    body: `Swapping embeddings helps at the margin; restructuring knowledge wins trust. Dynamic chunking and metadata routing beat one-size splits for mixed corpora.

Version chunks and cite stable anchors so users can verify answers.`,
    takeaways: [
      "Content ops is half the retrieval battle.",
      "Eval must include adversarial misses, not only happy paths.",
    ],
    careerInterpretation:
      "Strong candidates explain a retrieval failure taxonomy in plain language.",
  },
];

export function getDraftById(id: string): Draft | undefined {
  return drafts.find((d) => d.id === id);
}

export function getDraftOfTheDay(): Draft | undefined {
  return drafts[0];
}

/** All full-text strings for regenerate UI (body first, then variants) */
export function getDraftBodies(draft: Draft): string[] {
  return [draft.body, ...(draft.variants ?? [])];
}
