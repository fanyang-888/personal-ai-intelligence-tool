export interface AIBasic {
  id: string;
  concept: string;
  concept_zh: string;
  definition: string;
  definition_zh: string;
  whyItMatters: string;
  whyItMatters_zh: string;
  example: string;
  example_zh: string;
}

export const AI_BASICS: AIBasic[] = [
  {
    id: "model",
    concept: "Model",
    concept_zh: "模型",
    definition:
      "An AI model is a system trained on data to recognize patterns and generate outputs — text, images, predictions, or actions.",
    definition_zh:
      "AI 模型是一种在数据上训练出来的系统，能够识别规律并生成输出——文本、图像、预测或动作。",
    whyItMatters:
      "Every AI product you use is built on top of a model. Understanding what a model is helps you evaluate claims about AI capabilities.",
    whyItMatters_zh:
      "你用的每一款 AI 产品背后都有一个模型。理解模型的本质，有助于你判断关于 AI 能力的各种说法。",
    example:
      "GPT-4o, Claude, and Gemini are all large language models. When you chat with them, you are interacting with a model.",
    example_zh:
      "GPT-4o、Claude 和 Gemini 都是大型语言模型。你和它们聊天，就是在与模型交互。",
  },
  {
    id: "training",
    concept: "Training",
    concept_zh: "训练",
    definition:
      "Training is the process where an AI model learns patterns by processing large amounts of data and adjusting its internal settings to reduce errors.",
    definition_zh:
      "训练是 AI 模型通过处理大量数据、不断调整内部参数以减少误差来学习规律的过程。",
    whyItMatters:
      "Training happens once (or periodically) and is extremely expensive. What a model was trained on determines what it knows and what biases it carries.",
    whyItMatters_zh:
      "训练只进行一次（或定期进行），成本极高。模型用什么数据训练，决定了它知道什么、存在哪些偏见。",
    example:
      "GPT-4 was trained on hundreds of billions of words from the internet and books. That training process took months and cost tens of millions of dollars.",
    example_zh:
      "GPT-4 用来自互联网和书籍的数千亿词语进行训练，整个训练过程耗时数月，花费数千万美元。",
  },
  {
    id: "inference",
    concept: "Inference",
    concept_zh: "推理（Inference）",
    definition:
      "Inference is when a trained AI model uses what it has learned to generate a response or prediction based on new input.",
    definition_zh:
      "推理是指已训练的 AI 模型利用所学知识，根据新输入生成回复或预测的过程。",
    whyItMatters:
      "Most real-world AI products are running inference, not training. Inference cost, speed, and quality are what determine your daily experience.",
    whyItMatters_zh:
      "现实中大多数 AI 产品运行的是推理而非训练。推理的成本、速度和质量决定了你每天的使用体验。",
    example:
      "When ChatGPT answers your question, that is inference. The model is not learning from your question — it is generating a response using patterns it already learned.",
    example_zh:
      "当 ChatGPT 回答你的问题时，那就是推理。模型并没有从你的问题中学习，而是在用已学到的规律生成回复。",
  },
  {
    id: "token",
    concept: "Token",
    concept_zh: "Token（词元）",
    definition:
      "A token is the basic unit of text that language models process — roughly a word or part of a word.",
    definition_zh:
      "Token 是语言模型处理文本的基本单位，大致相当于一个词或一个词的一部分。",
    whyItMatters:
      "AI APIs are priced by the number of tokens used. Token limits also determine how much text a model can read at once (its context window).",
    whyItMatters_zh:
      "AI API 按使用的 Token 数量计费。Token 限制也决定了模型一次能读多少文字（即上下文窗口大小）。",
    example:
      "The sentence 'AI is transforming industries' is about 5 tokens. GPT-4o can process up to ~128,000 tokens in one conversation.",
    example_zh:
      "句子\"AI is transforming industries\"大约是 5 个 Token。GPT-4o 单次对话最多可处理约 12.8 万个 Token。",
  },
  {
    id: "parameters",
    concept: "Parameters",
    concept_zh: "参数",
    definition:
      "Parameters are the numerical values inside a model that are learned during training and determine how the model responds to any input.",
    definition_zh:
      "参数是模型内部在训练中学习到的数值，决定了模型对任何输入的响应方式。",
    whyItMatters:
      "Parameter count is often used as a proxy for model capability. More parameters generally means more knowledge, but also more compute and cost.",
    whyItMatters_zh:
      "参数数量常被用来衡量模型能力。参数越多，通常意味着知识越丰富，但也需要更多算力和费用。",
    example:
      "GPT-3 had 175 billion parameters. Each one is a tiny number adjusted thousands of times during training to improve the model's outputs.",
    example_zh:
      "GPT-3 有 1750 亿个参数。每个参数都是一个微小的数值，在训练中被调整了数千次以优化模型输出。",
  },
  {
    id: "context-window",
    concept: "Context Window",
    concept_zh: "上下文窗口",
    definition:
      "The context window is the maximum amount of text a model can read and consider at once — including your conversation history and any documents you share.",
    definition_zh:
      "上下文窗口是模型一次能读取和考虑的最大文本量，包括对话历史和你分享的文档。",
    whyItMatters:
      "A larger context window lets the model handle longer documents, longer conversations, and more complex tasks without 'forgetting' earlier content.",
    whyItMatters_zh:
      "更大的上下文窗口让模型能处理更长的文档、更长的对话和更复杂的任务，而不会\"遗忘\"之前的内容。",
    example:
      "If a model has a 128k token context window, you can paste an entire book into it. A 4k window means the model forgets earlier parts of a long conversation.",
    example_zh:
      "如果模型有 12.8 万 Token 的上下文窗口，你可以把整本书粘贴进去。4000 Token 的窗口则意味着长对话中模型会遗忘早期内容。",
  },
  {
    id: "prompt",
    concept: "Prompt",
    concept_zh: "提示词（Prompt）",
    definition:
      "A prompt is the input you give to an AI model — the question, instruction, or context that tells the model what you want.",
    definition_zh:
      "提示词是你给 AI 模型的输入——告诉模型你想要什么的问题、指令或上下文信息。",
    whyItMatters:
      "How you write a prompt significantly affects the quality of the output. This is why prompt engineering has become a recognized skill.",
    whyItMatters_zh:
      "提示词的写法对输出质量影响很大，这也是提示词工程成为一项受认可技能的原因。",
    example:
      "Asking 'summarize this' gives a different result than 'summarize this in 3 bullet points for a non-technical executive.' Both are prompts; one is better.",
    example_zh:
      "问\"总结一下\"和\"用 3 条要点为非技术背景的高管总结\"得到的结果截然不同。两者都是提示词，但后者效果更好。",
  },
  {
    id: "fine-tuning",
    concept: "Fine-tuning",
    concept_zh: "微调（Fine-tuning）",
    definition:
      "Fine-tuning is further training a pre-trained model on a smaller, specialized dataset to make it better at a specific task or domain.",
    definition_zh:
      "微调是在预训练模型的基础上，用更小的专业数据集进一步训练，使其在特定任务或领域表现更好。",
    whyItMatters:
      "Companies fine-tune general models for customer support, legal writing, or medical use. It is cheaper than training from scratch but still requires data and compute.",
    whyItMatters_zh:
      "企业会对通用模型进行微调用于客服、法律写作或医疗场景。这比从头训练便宜，但仍需要数据和算力。",
    example:
      "A hospital might fine-tune GPT-4 on thousands of clinical notes so it speaks like a doctor and understands medical terminology accurately.",
    example_zh:
      "一家医院可能会用数千份临床病历对 GPT-4 进行微调，使其能像医生一样表达并准确理解医学术语。",
  },
  {
    id: "embedding",
    concept: "Embedding",
    concept_zh: "向量嵌入（Embedding）",
    definition:
      "An embedding is a way of representing text (or images, audio) as a list of numbers that captures semantic meaning, so similar ideas end up close together.",
    definition_zh:
      "向量嵌入是一种将文本（或图像、音频）表示为数字列表的方式，能捕捉语义，使相似概念在数值上更接近。",
    whyItMatters:
      "Embeddings power search, recommendations, and RAG systems. They let computers measure how similar two pieces of content are.",
    whyItMatters_zh:
      "Embedding 是搜索、推荐和 RAG 系统的核心。它让计算机能够衡量两段内容的相似程度。",
    example:
      "The words 'king' and 'queen' have embeddings that are numerically very close. This is why AI can answer 'king minus man plus woman equals queen.'",
    example_zh:
      "\"king\"和\"queen\"的 Embedding 在数值上非常接近，这就是为什么 AI 能回答\"国王 - 男人 + 女人 = 女王\"这类问题。",
  },
  {
    id: "rag",
    concept: "RAG",
    concept_zh: "RAG（检索增强生成）",
    definition:
      "RAG (Retrieval-Augmented Generation) combines a search step with a generation step — the model retrieves relevant documents first, then generates an answer using them.",
    definition_zh:
      "RAG（检索增强生成）将检索与生成结合——模型先检索相关文档，再基于这些文档生成答案。",
    whyItMatters:
      "RAG lets AI give accurate, up-to-date answers on topics it was not trained on, without the cost of retraining the whole model.",
    whyItMatters_zh:
      "RAG 让 AI 能在训练数据之外给出准确、最新的答案，而不需要重新训练整个模型。",
    example:
      "A customer service chatbot that searches your company's help docs before replying is using RAG. It is more accurate than a plain chatbot because it retrieves facts rather than guessing.",
    example_zh:
      "回复前先搜索公司帮助文档的客服机器人就在使用 RAG。它比普通聊天机器人更准确，因为它是在检索事实，而非猜测。",
  },
  {
    id: "agent",
    concept: "Agent",
    concept_zh: "AI 智能体（Agent）",
    definition:
      "An AI agent is a model that can take actions — browsing the web, running code, calling APIs — to complete a multi-step task on your behalf.",
    definition_zh:
      "AI 智能体是一种能采取行动的模型——浏览网页、运行代码、调用 API——代替你完成多步骤任务。",
    whyItMatters:
      "Agents move AI from answering questions to actually doing work. They are behind tools that book travel, write and run code, or manage your email.",
    whyItMatters_zh:
      "智能体让 AI 从回答问题转向真正做事。订机票、写代码并运行、管理邮件的工具背后都有智能体。",
    example:
      "Telling an AI 'research competitors and put the findings in a spreadsheet' requires an agent. It needs to search, read pages, extract data, and write a file — multiple steps.",
    example_zh:
      "让 AI \"调研竞争对手并整理成表格\"需要智能体，因为它要搜索、读取页面、提取数据、写入文件——这是多步骤任务。",
  },
  {
    id: "benchmark",
    concept: "Benchmark",
    concept_zh: "基准测试（Benchmark）",
    definition:
      "A benchmark is a standardized test used to compare AI models — a set of questions or tasks with known correct answers.",
    definition_zh:
      "基准测试是一种用来比较 AI 模型的标准化测试——一组有已知正确答案的问题或任务。",
    whyItMatters:
      "Benchmarks make it easier to compare models objectively. But they can also be gamed, so benchmark numbers alone are not always reliable.",
    whyItMatters_zh:
      "基准测试让模型比较更客观，但也容易被\"刷分\"，所以单凭数字并不总是可靠的。",
    example:
      "MMLU tests a model on 57 subjects like law, medicine, and history. When OpenAI says 'GPT-4 scores 86% on MMLU,' they mean it answered 86% of those questions correctly.",
    example_zh:
      "MMLU 在法律、医学、历史等 57 个学科上测试模型。OpenAI 说\"GPT-4 在 MMLU 上得分 86%\"，意思是它答对了 86% 的题。",
  },
  {
    id: "hallucination",
    concept: "Hallucination",
    concept_zh: "幻觉（Hallucination）",
    definition:
      "Hallucination is when an AI model confidently generates information that is factually wrong or entirely made up.",
    definition_zh:
      "幻觉是指 AI 模型自信地生成事实错误或完全编造的信息。",
    whyItMatters:
      "Hallucinations are one of the biggest reliability problems with current AI. High-stakes uses like medical or legal advice require extra caution and verification.",
    whyItMatters_zh:
      "幻觉是当前 AI 最大的可靠性问题之一。在医疗或法律等高风险场景中，需要格外谨慎并进行核实。",
    example:
      "A lawyer once submitted AI-generated court citations that did not exist. The model had invented plausible-sounding case names with confident incorrect details.",
    example_zh:
      "曾有律师提交了 AI 生成的不存在的案例引用。模型编造了听起来合理的案例名称，并给出了错误细节。",
  },
  {
    id: "latency",
    concept: "Latency",
    concept_zh: "延迟（Latency）",
    definition:
      "Latency is the time it takes for an AI model to start responding after you send a request.",
    definition_zh:
      "延迟是从你发送请求到 AI 模型开始响应所需的时间。",
    whyItMatters:
      "Latency directly affects user experience. Real-time applications like voice assistants or coding assistants require very low latency.",
    whyItMatters_zh:
      "延迟直接影响用户体验。语音助手或代码助手等实时应用对延迟要求极低。",
    example:
      "A model with 200ms latency feels instant. A model with 3 seconds of latency before it starts typing feels slow, even if the final output is the same quality.",
    example_zh:
      "200 毫秒延迟的模型感觉即时。3 秒才开始输出的模型感觉很慢，即使最终质量相同。",
  },
  {
    id: "api",
    concept: "API",
    concept_zh: "API（应用程序接口）",
    definition:
      "An API (Application Programming Interface) lets developers connect their software to another service — in AI, it means sending text to a model and getting a response back.",
    definition_zh:
      "API（应用程序接口）让开发者将软件与其他服务连接起来——在 AI 领域，就是向模型发送文本并获取回复。",
    whyItMatters:
      "Most AI products are built on top of APIs. Understanding APIs helps you understand how AI gets integrated into apps and what that costs.",
    whyItMatters_zh:
      "大多数 AI 产品都建立在 API 之上。理解 API 有助于你了解 AI 如何集成到应用中，以及这需要多少成本。",
    example:
      "When you use a writing assistant inside Google Docs, it likely calls OpenAI or Anthropic's API behind the scenes to generate suggestions.",
    example_zh:
      "当你在 Google Docs 里使用写作助手时，它很可能在后台调用 OpenAI 或 Anthropic 的 API 来生成建议。",
  },
  {
    id: "open-source-model",
    concept: "Open-source Model",
    concept_zh: "开源模型",
    definition:
      "An open-source AI model is one where the weights (trained parameters) are publicly released so anyone can download, run, and modify it.",
    definition_zh:
      "开源 AI 模型是指将权重（训练好的参数）公开发布，任何人都可以下载、运行和修改的模型。",
    whyItMatters:
      "Open-source models give companies full control, privacy, and no per-token costs. The tradeoff is they need their own infrastructure to run them.",
    whyItMatters_zh:
      "开源模型让企业拥有完全控制权、保护隐私，且没有按 Token 计费的成本。代价是需要自己的基础设施来运行。",
    example:
      "Meta's Llama models are open-source. A startup can download Llama, run it on their own servers, and build a product without paying OpenAI for every query.",
    example_zh:
      "Meta 的 Llama 系列是开源的。创业公司可以下载 Llama，在自己的服务器上运行，无需为每次查询向 OpenAI 付费。",
  },
  {
    id: "multimodal",
    concept: "Multimodal",
    concept_zh: "多模态",
    definition:
      "A multimodal AI model can process and generate multiple types of content — text, images, audio, and video — not just one.",
    definition_zh:
      "多模态 AI 模型能处理和生成多种类型的内容——文本、图像、音频、视频——而不只是单一类型。",
    whyItMatters:
      "Multimodal models unlock use cases that text-only models cannot handle, like analyzing a photo, transcribing audio, or generating images from descriptions.",
    whyItMatters_zh:
      "多模态模型解锁了纯文本模型无法处理的场景，例如分析照片、转录音频或根据描述生成图像。",
    example:
      "GPT-4o is multimodal. You can upload a photo of a whiteboard and ask it to explain what is written on it — that requires vision, not just text processing.",
    example_zh:
      "GPT-4o 是多模态的。你可以上传一张白板照片，让它解释上面写了什么——这需要视觉能力，而不仅仅是文本处理。",
  },
  {
    id: "evaluation",
    concept: "Evaluation",
    concept_zh: "评估（Evaluation）",
    definition:
      "Evaluation is the process of measuring how well an AI model performs on a given task, using metrics, human feedback, or automated testing.",
    definition_zh:
      "评估是通过指标、人工反馈或自动化测试，衡量 AI 模型在特定任务上表现好坏的过程。",
    whyItMatters:
      "Without proper evaluation, you cannot know whether a model is actually good at your specific use case. Generic benchmarks often do not reflect real-world performance.",
    whyItMatters_zh:
      "没有合适的评估，你就无法知道模型是否真的适合你的具体场景。通用基准测试往往不能反映实际表现。",
    example:
      "A company building an AI code reviewer should not just use MMLU scores. They need to evaluate the model on their own codebase and check whether it catches their bugs.",
    example_zh:
      "开发 AI 代码审查工具的公司不能只看 MMLU 分数，而需要在自己的代码库上评估模型，检验它是否能发现真实的 Bug。",
  },
  {
    id: "drift",
    concept: "Drift",
    concept_zh: "数据漂移（Drift）",
    definition:
      "Drift is when an AI model's performance degrades over time because the real-world data it encounters has changed from what it was trained on.",
    definition_zh:
      "漂移是指 AI 模型的性能随时间下降，原因是现实数据已经偏离了训练时使用的数据。",
    whyItMatters:
      "Production AI systems need ongoing monitoring. A model that was accurate last year might silently become inaccurate as language, topics, or user behavior changes.",
    whyItMatters_zh:
      "生产中的 AI 系统需要持续监控。去年还准确的模型，可能随着语言、话题或用户行为的变化，悄悄变得不准确。",
    example:
      "A sentiment analysis model trained before 2020 might misread phrases that took on new meanings during the pandemic — that is drift.",
    example_zh:
      "一个在 2020 年之前训练的情感分析模型，可能会误读疫情期间出现新含义的词语——这就是漂移。",
  },
  {
    id: "human-in-the-loop",
    concept: "Human-in-the-loop",
    concept_zh: "人在回路（Human-in-the-loop）",
    definition:
      "Human-in-the-loop means keeping a human in the decision process — reviewing, approving, or correcting AI outputs before they take effect.",
    definition_zh:
      "人在回路是指在决策过程中保留人的参与——在 AI 输出生效前由人来审核、批准或纠正。",
    whyItMatters:
      "For high-stakes decisions (hiring, loans, medical), full automation is risky. Human-in-the-loop is a way to get AI efficiency while maintaining human accountability.",
    whyItMatters_zh:
      "在招聘、贷款、医疗等高风险决策中，完全自动化风险很大。人在回路是一种兼顾 AI 效率与人类责任的方式。",
    example:
      "A content moderation system that flags posts for human review, rather than auto-removing them, is human-in-the-loop.",
    example_zh:
      "将帖子标记给人工审核而不是自动删除的内容审核系统，就是人在回路的应用。",
  },
];

/** Pick a concept based on the current date (same concept all day, cycles daily). */
export function getDailyBasic(): AIBasic {
  const today = new Date();
  const dayOfYear =
    Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000,
    ) - 1;
  return AI_BASICS[dayOfYear % AI_BASICS.length];
}

/** Get the next concept after the given id. */
export function getNextBasic(currentId: string): AIBasic {
  const idx = AI_BASICS.findIndex((b) => b.id === currentId);
  return AI_BASICS[(idx + 1) % AI_BASICS.length];
}
