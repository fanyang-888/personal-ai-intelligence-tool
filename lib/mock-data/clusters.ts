import type { Cluster } from "@/types/cluster";

export const clusters: Cluster[] = [
  {
    id: "cluster-1",
    clusterType: "AI & productivity",
    title: {
      en: "Agent-style browsers reshape how work gets done",
      zh: "智能体式浏览器正在重塑工作方式",
    },
    subtitle: {
      en: "From demos to daily workflows",
      zh: "从演示到日常工作流",
    },
    theme: "AI & productivity",
    themes: ["AI & productivity", "Trust", "Workflow"],
    tags: ["Agents", "Browsers", "Workflow"],
    storyStatus: "Escalating",
    clusterScore: 98,
    freshnessLabel: "Updated 2h ago",
    firstSeenAt: "2026-04-01T08:00:00.000Z",
    lastSeenAt: "2026-04-03T15:00:00.000Z",
    summary: {
      en: "Vendors are shipping browser experiences that plan, click, and summarize on behalf of users. The open question is whether this becomes a trusted assistant or a brittle automation layer.\n\nEarly adopters report huge time savings when guardrails are clear: receipts for actions, undo paths, and policy-aware pauses before sensitive steps. Enterprise buyers are already asking for audit logs that match what demos promise.",
      zh: "厂商正在推出能代用户规划、点击与总结的浏览器体验。关键问题是：这会成为可信助手，还是脆弱的自动化层。\n\n早期采用者表示，当护栏清晰时——行动留痕、可撤销路径、敏感操作前的策略感知暂停——能显著节省时间。企业采购方已开始要求审计日志与演示承诺一致。",
    },
    takeaways: [
      {
        en: "Task delegation is moving from “chat about a page” to “complete a workflow across tabs.”",
        zh: "任务委派正从「围绕页面聊天」转向「跨标签完成工作流」。",
      },
      {
        en: "Trust and provenance matter as much as model quality when agents act for you.",
        zh: "当智能体代你行动时，信任与可追溯性与模型质量同样重要。",
      },
      {
        en: "Enterprise buyers will prioritize audit logs and policy controls over flashy demos.",
        zh: "企业买家会优先审计日志与策略控制，而非花哨演示。",
      },
    ],
    whyItMatters: {
      en: "If agentic browsing sticks, knowledge workers will spend less time tab-hopping and more time reviewing outcomes—which changes how products are designed and measured.",
      zh: "若智能体浏览成为常态，知识工作者将更少切标签、更多审结果——这将改变产品设计与衡量方式。",
    },
    audience: {
      pm: {
        en: "Position features around outcomes and guardrails, not raw model scores.",
        zh: "围绕结果与护栏定位功能，而非裸模型分数。",
      },
      developer: {
        en: "Design APIs and UX affordances that expose what the agent did and why.",
        zh: "设计能说明智能体做了什么、为何如此做的 API 与交互。",
      },
      studentJobSeeker: {
        en: "Practice articulating tradeoffs between autonomy, safety, and latency in interviews.",
        zh: "练习在面试中阐述自主性、安全与延迟之间的取舍。",
      },
    },
    articleIds: ["art-1", "art-2"],
    relatedClusterIds: [],
    draftId: "draft-1",
  },
  {
    id: "cluster-2",
    clusterType: "Research",
    title: {
      en: "Evaluation drift: benchmarks vs. real user tasks",
      zh: "评测漂移：基准测试与真实用户任务",
    },
    theme: "Research",
    themes: ["Research", "Product"],
    tags: ["Evals", "Benchmarks", "Product"],
    storyStatus: "Ongoing",
    clusterScore: 91,
    freshnessLabel: "Seen today",
    firstSeenAt: "2026-03-28T10:00:00.000Z",
    lastSeenAt: "2026-04-03T06:00:00.000Z",
    summary: {
      en: "Leaderboards still move markets, but teams are quietly building internal task suites that better predict deployment success. The gap between public scores and on-the-ground reliability is widening.",
      zh: "榜单仍能搅动市场，但团队正悄悄搭建更能预测上线成功的内部任务集。公开分数与地面可靠性之间的鸿沟在扩大。",
    },
    takeaways: [
      {
        en: "Static benchmarks lag product-specific failure modes.",
        zh: "静态基准滞后于产品特有的失效模式。",
      },
      {
        en: "Human-in-the-loop eval is expensive but often the only signal that matters.",
        zh: "人机协同评测昂贵，却常是唯一关键信号。",
      },
      {
        en: "Smaller models win when the task slice is narrow and well-defined.",
        zh: "当任务切片狭窄且定义清晰时，小模型往往更胜。",
      },
    ],
    whyItMatters: {
      en: "Choosing the wrong eval story can misallocate months of engineering and create compliance risk when claims do not match behavior.",
      zh: "选错评测叙事会错配数月工程，并在宣称与行为不符时带来合规风险。",
    },
    audience: {
      pm: {
        en: "Tie roadmap bets to task-level metrics your users actually perform.",
        zh: "把路线图押注与用户真实执行的任务级指标挂钩。",
      },
      developer: {
        en: "Invest in regression harnesses and trace replay before scaling traffic.",
        zh: "在扩量前投入回归工具链与轨迹回放。",
      },
      studentJobSeeker: {
        en: "Study how to design eval rubrics and error taxonomies.",
        zh: "学习如何设计评测量表与错误分类体系。",
      },
    },
    articleIds: ["art-3"],
    relatedClusterIds: [],
  },
  {
    id: "cluster-3",
    clusterType: "Infrastructure",
    title: {
      en: "Edge inference quietly wins latency-sensitive features",
      zh: "边缘推理悄然拿下延迟敏感型功能",
    },
    theme: "Infrastructure",
    themes: ["Infrastructure", "Mobile"],
    tags: ["Edge", "Latency", "Mobile"],
    storyStatus: "Ongoing",
    clusterScore: 88,
    freshnessLabel: "Updated 5h ago",
    firstSeenAt: "2026-03-30T12:00:00.000Z",
    lastSeenAt: "2026-04-03T11:30:00.000Z",
    summary: {
      en: "On-device and edge deployments are back in vogue for privacy, cost, and responsiveness—especially for assistants that must feel instant. Hybrid routing between device and cloud is now a default architecture conversation.",
      zh: "出于隐私、成本与响应，端侧与边缘部署再度流行——对必须「瞬时」的助手尤其如此。端云混合路由已成为默认架构议题。",
    },
    takeaways: [
      {
        en: "Quantization and spec decoding are table stakes for edge bundles.",
        zh: "量化与投机解码已是边缘打包的标配。",
      },
      {
        en: "Hybrid cloud/edge routing is a product decision as much as an infra one.",
        zh: "混合云/边缘路由既是基础设施决策，也是产品决策。",
      },
      {
        en: "Battery and thermal constraints still cap model size on mobile.",
        zh: "电池与散热仍在限制移动端的模型体量。",
      },
    ],
    whyItMatters: {
      en: "Latency and offline behavior can be the difference between a feature users trust and one they disable.",
      zh: "延迟与离线表现，决定用户是信任某功能还是关掉它。",
    },
    audience: {
      pm: {
        en: "Prioritize scenarios where milliseconds change perceived intelligence.",
        zh: "优先毫秒级差异会改变「智能感」的场景。",
      },
      developer: {
        en: "Prototype fallbacks when the device tier cannot run the full stack.",
        zh: "为设备算力跑不全栈时设计降级原型。",
      },
      studentJobSeeker: {
        en: "Learn the basics of ONNX, CoreML, and mobile ML lifecycles.",
        zh: "了解 ONNX、CoreML 与移动端 ML 生命周期的基础。",
      },
    },
    articleIds: ["art-4", "art-5"],
    relatedClusterIds: [],
  },
  {
    id: "cluster-4",
    clusterType: "Enterprise AI",
    title: {
      en: "Multimodal assistants move from demo to default in enterprise suites",
      zh: "多模态助手从演示走进企业套件默认能力",
    },
    theme: "Enterprise AI",
    themes: ["Enterprise AI", "Compliance"],
    tags: ["Multimodal", "Enterprise", "Assistants"],
    storyStatus: "New",
    clusterScore: 86,
    freshnessLabel: "Updated 4h ago",
    firstSeenAt: "2026-04-03T04:00:00.000Z",
    lastSeenAt: "2026-04-03T13:00:00.000Z",
    summary: {
      en: "Major vendors are bundling vision + document understanding into the same copilot surfaces finance and legal teams already use. Buyers are asking harder questions about data residency and retention.",
      zh: "大型厂商正把视觉与文档理解塞进财务与法务团队已在使用的同一 Copilot 界面。买家对数据驻留与留存问得更尖锐。",
    },
    takeaways: [
      {
        en: "Packaging beats raw capability when procurement runs the checklist.",
        zh: "采购按清单走时，打包方案胜过裸能力。",
      },
      {
        en: "Redaction and access control become first-class multimodal problems.",
        zh: "脱敏与访问控制成为多模态的一等公民问题。",
      },
      {
        en: "Latency budgets tighten when video and images enter the loop.",
        zh: "视频与图像入环时，延迟预算更紧。",
      },
    ],
    whyItMatters: {
      en: "If your roadmap assumes text-only copilots, competitors will position whole-workflow assistants as table stakes within a year.",
      zh: "若路线图仍假设纯文本 Copilot，竞争对手会在一年内把全流程助手定位为标配。",
    },
    audience: {
      pm: {
        en: "Map multimodal flows to the committees that sign contracts.",
        zh: "把多模态流程映射到真正签合同的委员会。",
      },
      developer: {
        en: "Plan for larger payloads, streaming, and PII boundaries per modality.",
        zh: "为更大载荷、流式传输及各模态的 PII 边界做规划。",
      },
      studentJobSeeker: {
        en: "Practice one story about responsible deployment across modalities.",
        zh: "准备一则跨模态负责任部署的叙事。",
      },
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
