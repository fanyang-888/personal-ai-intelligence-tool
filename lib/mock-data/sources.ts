import type { Source } from "@/types/source";

export const sources: Source[] = [
  {
    id: "src-1",
    name: "The Register",
    url: "https://example.com/register-agent-browsers",
    publisher: "The Register",
    channel: "web",
  },
  {
    id: "src-2",
    name: "Ars Technica",
    url: "https://example.com/ars-context-windows",
    publisher: "Ars Technica",
    channel: "web",
  },
  {
    id: "src-3",
    name: "MIT Tech Review",
    url: "https://example.com/mit-llm-eval",
    publisher: "MIT Technology Review",
    channel: "email",
  },
  {
    id: "src-4",
    name: "IEEE Spectrum",
    url: "https://example.com/ieee-edge-inference",
    publisher: "IEEE Spectrum",
    channel: "feed",
  },
  {
    id: "src-5",
    name: "Reuters Tech",
    url: "https://example.com/reuters-enterprise-ai",
    publisher: "Reuters",
    channel: "email",
  },
  {
    id: "src-6",
    name: "The Verge",
    url: "https://example.com/verge-multimodal",
    publisher: "The Verge",
    channel: "web",
  },
  {
    id: "src-7",
    name: "Hugging Face Blog",
    url: "https://example.com/hf-open-models",
    publisher: "Hugging Face",
    channel: "chat",
  },
  {
    id: "src-8",
    name: "Lawfare",
    url: "https://example.com/lawfare-ai-data",
    publisher: "Lawfare",
    channel: "web",
  },
  {
    id: "src-9",
    name: "Distill",
    url: "https://example.com/distill-synthetic",
    publisher: "Distill",
    channel: "feed",
  },
  {
    id: "src-10",
    name: "GitHub Blog",
    url: "https://example.com/github-copilot-agents",
    publisher: "GitHub",
    channel: "chat",
  },
];

export function getSourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}
