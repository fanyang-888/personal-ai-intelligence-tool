import type { Draft, LinkedInDraftContent } from "@/types/draft";

export const drafts: Draft[] = [
  {
    id: "draft-1",
    clusterId: "cluster-1",
    draftType: "linkedin",
    title: {
      en: "Agent browsers — trust and receipts",
      zh: "智能体浏览器——信任与留痕",
    },
    generatedAt: "2026-04-03T14:30:00.000Z",
    hook: {
      en: "The browser is quietly becoming a workflow runtime—not just a place to read.",
      zh: "浏览器正悄然成为工作流运行时——而不只是阅读之所。",
    },
    summaryBlock: {
      en: "Agent-style browsers are shifting expectations from “summarize this page” to “complete this task across tabs.” The teams that win will optimize for inspectability: receipts, undo, and pauses before sensitive actions—not only model scores.",
      zh: "智能体式浏览器正把预期从「总结这一页」推向「跨标签完成任务」。赢家会优化可检视性：留痕、撤销与敏感操作前的暂停——而不只是模型分数。",
    },
    takeaways: [
      {
        en: "Delegation beats chat when the goal spans multiple sites.",
        zh: "当目标跨多个站点时，委派胜过闲聊。",
      },
      {
        en: "Trust is a product surface: show what changed and let users reverse it.",
        zh: "信任是产品界面：展示改变了什么，并让用户能回退。",
      },
      {
        en: "Enterprise buyers will ask for policy and logs before they adopt at scale.",
        zh: "企业买家在规模化采用前会要求策略与日志。",
      },
    ],
    careerInterpretationBlock: {
      en: "In PM or solutions interviews, keep one crisp story about guardrails and one about measurable task completion. If you’re engineering-focused, be ready to discuss tracing, eval harnesses, and safe action APIs.",
      zh: "在 PM 或方案面试中，准备一则关于护栏的清晰故事，一则关于可衡量任务完成的故事。若偏工程，准备好讨论追踪、评测工具链与安全动作 API。",
    },
    audienceWhyItMattersBlock: {
      en: "If you build or buy AI that acts on the user’s behalf, your roadmap should assume scrutiny—both from users and from IT. Design for verification early, or adoption stalls even when the model is strong.",
      zh: "若你构建或采购代用户行动的 AI，路线图应预设来自用户与 IT 的审视。尽早为可验证性设计，否则即便模型很强，采用也会停滞。",
    },
    closingBlock: {
      en: "How are you making agent actions legible to a non-expert reviewer?",
      zh: "你如何让非专业审阅者也能看懂智能体的动作？",
    },
    variants: [
      {
        hook: {
          en: "Treat your agent like a junior operator: checklists, citations, and “suggest before execute.”",
          zh: "把智能体当作初级操作员：清单、引用与「先建议再执行」。",
        },
        summaryBlock: {
          en: "Buyers are already asking for audit trails that match what demos promise. Shared machines and SSO-heavy orgs will push role-based policies to the top of the requirements list—optimize for individuals only and you lose the IT gate.",
          zh: "买家已要求审计轨迹与演示承诺一致。共享设备与重度 SSO 组织会把基于角色的策略顶到需求清单前列——只优化个人体验会失去 IT 门禁。",
        },
        takeaways: [
          {
            en: "Default to suggest mode before destructive or cross-site actions.",
            zh: "在破坏性或跨站动作前默认建议模式。",
          },
          {
            en: "Cite sources per step so a human can verify without replaying the run.",
            zh: "逐步引用来源，让人类无需重放即可核验。",
          },
          {
            en: "Enterprise adoption is a policy story, not a capability flex.",
            zh: "企业采用是策略叙事，不是能力炫技。",
          },
        ],
        careerInterpretationBlock: {
          en: "Practice one interview answer on instrumentation: “How would a PM trust weekly metrics from an agent?” Tie it to logs, sampling, and human review hooks.",
          zh: "练习一则关于插桩的面试答法：「PM 如何信任来自智能体的周指标？」关联日志、抽样与人工复核钩子。",
        },
        audienceWhyItMattersBlock: {
          en: "If your product cannot explain actions or roll them back, you will not pass procurement—regardless of benchmark scores.",
          zh: "若产品无法解释动作或回滚，则过不了采购——与基准分数无关。",
        },
      },
      {
        hook: {
          en: "Latency and partial failure matter more than raw reasoning when the browser is the runtime.",
          zh: "当浏览器是运行时，延迟与部分失败比裸推理更重要。",
        },
        summaryBlock: {
          en: "When agents orchestrate tabs, retries, human takeover, and clear state machines become the product. Reasoning benchmarks do not replace reliability in production workflows.",
          zh: "当智能体编排标签时，重试、人工接管与清晰状态机成为产品本身。推理基准无法替代生产工作流的可靠性。",
        },
        takeaways: [
          {
            en: "Design explicit states: running, blocked, needs approval, failed.",
            zh: "设计显式状态：运行中、阻塞、需批准、失败。",
          },
          {
            en: "Invest in retries and graceful degradation before fancier prompts.",
            zh: "在更花哨的提示词之前，先投入重试与优雅降级。",
          },
          {
            en: "PMs should ask for task-level SLAs, not model-only numbers.",
            zh: "PM 应要求任务级 SLA，而非仅模型指标。",
          },
        ],
        careerInterpretationBlock: {
          en: "Be able to sketch a minimal state machine for an agent workflow and where a human steps in—many hiring loops now probe operational maturity, not just architecture diagrams.",
          zh: "能画出智能体工作流的最小状态机及人类介入点——许多招聘环节现在在探运营成熟度，而不只是架构图。",
        },
        audienceWhyItMattersBlock: {
          en: "Shipping agentic UX without reliability is how you burn trust in the first real customer pilot.",
          zh: "没有可靠性就上线智能体体验，会在首次真实客户试点中烧掉信任。",
        },
        closingBlock: {
          en: "What is your first human-takeover path when the agent gets stuck?",
          zh: "智能体卡住时，你的第一条人工接管路径是什么？",
        },
      },
    ] satisfies LinkedInDraftContent[],
  },
  {
    id: "draft-2",
    clusterId: "cluster-4",
    draftType: "linkedin",
    title: {
      en: "Multimodal rollout — data maps first",
      zh: "多模态落地——先做数据地图",
    },
    generatedAt: "2026-04-03T11:00:00.000Z",
    hook: {
      en: "Multimodal copilots are defaulting in enterprise suites—procurement is asking where pixels live.",
      zh: "多模态 Copilot 正成为企业套件默认——采购在问像素存在哪里。",
    },
    summaryBlock: {
      en: "Vision plus documents in one surface sounds simple until legal traces pixels across regions. Start with data maps: which modalities cross borders, which stay on-device, and how redaction propagates before you polish the demo.",
      zh: "同一界面里视觉加文档听起来简单，直到法务要追踪像素跨境。先做数据地图：哪些模态跨境、哪些留在端侧、脱敏如何传播——再打磨演示。",
    },
    takeaways: [
      {
        en: "Residency and retention questions spike the moment images enter the thread.",
        zh: "图像一进线程，驻留与留存问题就会激增。",
      },
      {
        en: "Redaction and access control are first-class multimodal problems, not afterthoughts.",
        zh: "脱敏与访问控制是一等的多模态问题，不是事后补丁。",
      },
      {
        en: "End-to-end latency budgets beat model-only SLAs when video and images are in play.",
        zh: "当视频与图像入环时，端到端延迟预算胜过仅针对模型的 SLA。",
      },
    ],
    careerInterpretationBlock: {
      en: "Have one slide on multimodal risk: data flow, retention, and where humans review non-text outputs. That single artifact often matters more than a feature list.",
      zh: "准备一页多模态风险：数据流、留存以及人类审阅非文本输出的位置。这一页往往比功能列表更重要。",
    },
    audienceWhyItMattersBlock: {
      en: "If your roadmap still assumes text-only copilots, competitors will position whole-workflow assistants as table stakes within a year—especially in regulated functions.",
      zh: "若路线图仍假设纯文本 Copilot，竞争对手会在一年内把全流程助手定位为标配——监管职能尤甚。",
    },
    closingBlock: {
      en: "Have you drawn the pixel path for your copilot yet?",
      zh: "你为 Copilot 画好像素路径了吗？",
    },
    variants: [
      {
        hook: {
          en: "Shorter version: draw the data-flow diagram before the demo.",
          zh: "更短版：演示前先画数据流图。",
        },
        summaryBlock: {
          en: "If legal cannot trace pixels end to end, the deal stalls regardless of model quality. Lead with lineage, not sparkle.",
          zh: "若法务无法端到端追踪像素，交易就会卡住——与模型质量无关。领先的是血缘，不是炫光。",
        },
        takeaways: [
          {
            en: "Procurement runs on checklists—package clarity, not raw capability.",
            zh: "采购靠清单——要包装清晰，不要裸能力。",
          },
          {
            en: "Map PII and sensitive visuals before you argue latency.",
            zh: "在争论延迟之前，先映射 PII 与敏感视觉内容。",
          },
          {
            en: "Show human review hooks for every non-text answer.",
            zh: "为每个非文本回答展示人工复核钩子。",
          },
        ],
        careerInterpretationBlock: {
          en: "Practice explaining one multimodal incident response: who sees the image, for how long, and how it is purged.",
          zh: "练习解释一则多模态事件响应：谁看到图像、多久、如何清除。",
        },
        audienceWhyItMattersBlock: {
          en: "A multimodal win in the lab that fails compliance review wastes quarters of roadmap.",
          zh: "实验室里的多模态胜利若过不了合规审查，会浪费数个季度的路线图。",
        },
      },
    ] satisfies LinkedInDraftContent[],
  },
];

export function getDraftById(id: string): Draft | undefined {
  return drafts.find((d) => d.id === id);
}
