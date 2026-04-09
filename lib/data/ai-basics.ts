export interface AIBasic {
  id: string;
  concept: string;
  definition: string;
  whyItMatters: string;
  example: string;
}

export const AI_BASICS: AIBasic[] = [
  {
    id: "model",
    concept: "Model",
    definition:
      "An AI model is a system trained on data to recognize patterns and generate outputs — text, images, predictions, or actions.",
    whyItMatters:
      "Every AI product you use is built on top of a model. Understanding what a model is helps you evaluate claims about AI capabilities.",
    example:
      "GPT-4o, Claude, and Gemini are all large language models. When you chat with them, you are interacting with a model.",
  },
  {
    id: "training",
    concept: "Training",
    definition:
      "Training is the process where an AI model learns patterns by processing large amounts of data and adjusting its internal settings to reduce errors.",
    whyItMatters:
      "Training happens once (or periodically) and is extremely expensive. What a model was trained on determines what it knows and what biases it carries.",
    example:
      "GPT-4 was trained on hundreds of billions of words from the internet and books. That training process took months and cost tens of millions of dollars.",
  },
  {
    id: "inference",
    concept: "Inference",
    definition:
      "Inference is when a trained AI model uses what it has learned to generate a response or prediction based on new input.",
    whyItMatters:
      "Most real-world AI products are running inference, not training. Inference cost, speed, and quality are what determine your daily experience.",
    example:
      "When ChatGPT answers your question, that is inference. The model is not learning from your question — it is generating a response using patterns it already learned.",
  },
  {
    id: "token",
    concept: "Token",
    definition:
      "A token is the basic unit of text that language models process — roughly a word or part of a word.",
    whyItMatters:
      "AI APIs are priced by the number of tokens used. Token limits also determine how much text a model can read at once (its context window).",
    example:
      "The sentence 'AI is transforming industries' is about 5 tokens. GPT-4o can process up to ~128,000 tokens in one conversation.",
  },
  {
    id: "parameters",
    concept: "Parameters",
    definition:
      "Parameters are the numerical values inside a model that are learned during training and determine how the model responds to any input.",
    whyItMatters:
      "Parameter count is often used as a proxy for model capability. More parameters generally means more knowledge, but also more compute and cost.",
    example:
      "GPT-3 had 175 billion parameters. Each one is a tiny number adjusted thousands of times during training to improve the model's outputs.",
  },
  {
    id: "context-window",
    concept: "Context Window",
    definition:
      "The context window is the maximum amount of text a model can read and consider at once — including your conversation history and any documents you share.",
    whyItMatters:
      "A larger context window lets the model handle longer documents, longer conversations, and more complex tasks without 'forgetting' earlier content.",
    example:
      "If a model has a 128k token context window, you can paste an entire book into it. A 4k window means the model forgets earlier parts of a long conversation.",
  },
  {
    id: "prompt",
    concept: "Prompt",
    definition:
      "A prompt is the input you give to an AI model — the question, instruction, or context that tells the model what you want.",
    whyItMatters:
      "How you write a prompt significantly affects the quality of the output. This is why prompt engineering has become a recognized skill.",
    example:
      "Asking 'summarize this' gives a different result than 'summarize this in 3 bullet points for a non-technical executive.' Both are prompts; one is better.",
  },
  {
    id: "fine-tuning",
    concept: "Fine-tuning",
    definition:
      "Fine-tuning is further training a pre-trained model on a smaller, specialized dataset to make it better at a specific task or domain.",
    whyItMatters:
      "Companies fine-tune general models for customer support, legal writing, or medical use. It is cheaper than training from scratch but still requires data and compute.",
    example:
      "A hospital might fine-tune GPT-4 on thousands of clinical notes so it speaks like a doctor and understands medical terminology accurately.",
  },
  {
    id: "embedding",
    concept: "Embedding",
    definition:
      "An embedding is a way of representing text (or images, audio) as a list of numbers that captures semantic meaning, so similar ideas end up close together.",
    whyItMatters:
      "Embeddings power search, recommendations, and RAG systems. They let computers measure how similar two pieces of content are.",
    example:
      "The words 'king' and 'queen' have embeddings that are numerically very close. This is why AI can answer 'king minus man plus woman equals queen.'",
  },
  {
    id: "rag",
    concept: "RAG",
    definition:
      "RAG (Retrieval-Augmented Generation) combines a search step with a generation step — the model retrieves relevant documents first, then generates an answer using them.",
    whyItMatters:
      "RAG lets AI give accurate, up-to-date answers on topics it was not trained on, without the cost of retraining the whole model.",
    example:
      "A customer service chatbot that searches your company's help docs before replying is using RAG. It is more accurate than a plain chatbot because it retrieves facts rather than guessing.",
  },
  {
    id: "agent",
    concept: "Agent",
    definition:
      "An AI agent is a model that can take actions — browsing the web, running code, calling APIs — to complete a multi-step task on your behalf.",
    whyItMatters:
      "Agents move AI from answering questions to actually doing work. They are behind tools that book travel, write and run code, or manage your email.",
    example:
      "Telling an AI 'research competitors and put the findings in a spreadsheet' requires an agent. It needs to search, read pages, extract data, and write a file — multiple steps.",
  },
  {
    id: "benchmark",
    concept: "Benchmark",
    definition:
      "A benchmark is a standardized test used to compare AI models — a set of questions or tasks with known correct answers.",
    whyItMatters:
      "Benchmarks make it easier to compare models objectively. But they can also be gamed, so benchmark numbers alone are not always reliable.",
    example:
      "MMLU tests a model on 57 subjects like law, medicine, and history. When OpenAI says 'GPT-4 scores 86% on MMLU,' they mean it answered 86% of those questions correctly.",
  },
  {
    id: "hallucination",
    concept: "Hallucination",
    definition:
      "Hallucination is when an AI model confidently generates information that is factually wrong or entirely made up.",
    whyItMatters:
      "Hallucinations are one of the biggest reliability problems with current AI. High-stakes uses like medical or legal advice require extra caution and verification.",
    example:
      "A lawyer once submitted AI-generated court citations that did not exist. The model had invented plausible-sounding case names with confident incorrect details.",
  },
  {
    id: "latency",
    concept: "Latency",
    definition:
      "Latency is the time it takes for an AI model to start responding after you send a request.",
    whyItMatters:
      "Latency directly affects user experience. Real-time applications like voice assistants or coding assistants require very low latency.",
    example:
      "A model with 200ms latency feels instant. A model with 3 seconds of latency before it starts typing feels slow, even if the final output is the same quality.",
  },
  {
    id: "api",
    concept: "API",
    definition:
      "An API (Application Programming Interface) lets developers connect their software to another service — in AI, it means sending text to a model and getting a response back.",
    whyItMatters:
      "Most AI products are built on top of APIs. Understanding APIs helps you understand how AI gets integrated into apps and what that costs.",
    example:
      "When you use a writing assistant inside Google Docs, it likely calls OpenAI or Anthropic's API behind the scenes to generate suggestions.",
  },
  {
    id: "open-source-model",
    concept: "Open-source Model",
    definition:
      "An open-source AI model is one where the weights (trained parameters) are publicly released so anyone can download, run, and modify it.",
    whyItMatters:
      "Open-source models give companies full control, privacy, and no per-token costs. The tradeoff is they need their own infrastructure to run them.",
    example:
      "Meta's Llama models are open-source. A startup can download Llama, run it on their own servers, and build a product without paying OpenAI for every query.",
  },
  {
    id: "multimodal",
    concept: "Multimodal",
    definition:
      "A multimodal AI model can process and generate multiple types of content — text, images, audio, and video — not just one.",
    whyItMatters:
      "Multimodal models unlock use cases that text-only models cannot handle, like analyzing a photo, transcribing audio, or generating images from descriptions.",
    example:
      "GPT-4o is multimodal. You can upload a photo of a whiteboard and ask it to explain what is written on it — that requires vision, not just text processing.",
  },
  {
    id: "evaluation",
    concept: "Evaluation",
    definition:
      "Evaluation is the process of measuring how well an AI model performs on a given task, using metrics, human feedback, or automated testing.",
    whyItMatters:
      "Without proper evaluation, you cannot know whether a model is actually good at your specific use case. Generic benchmarks often do not reflect real-world performance.",
    example:
      "A company building an AI code reviewer should not just use MMLU scores. They need to evaluate the model on their own codebase and check whether it catches their bugs.",
  },
  {
    id: "drift",
    concept: "Drift",
    definition:
      "Drift is when an AI model's performance degrades over time because the real-world data it encounters has changed from what it was trained on.",
    whyItMatters:
      "Production AI systems need ongoing monitoring. A model that was accurate last year might silently become inaccurate as language, topics, or user behavior changes.",
    example:
      "A sentiment analysis model trained before 2020 might misread phrases that took on new meanings during the pandemic — that is drift.",
  },
  {
    id: "human-in-the-loop",
    concept: "Human-in-the-loop",
    definition:
      "Human-in-the-loop means keeping a human in the decision process — reviewing, approving, or correcting AI outputs before they take effect.",
    whyItMatters:
      "For high-stakes decisions (hiring, loans, medical), full automation is risky. Human-in-the-loop is a way to get AI efficiency while maintaining human accountability.",
    example:
      "A content moderation system that flags posts for human review, rather than auto-removing them, is human-in-the-loop.",
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
