import type { Source } from "@/types/source";

export const sources: Source[] = [
  {
    id: "src-1",
    name: "The Register",
    url: "https://example.com/register-agent-browsers",
    publisher: "The Register",
  },
  {
    id: "src-2",
    name: "Ars Technica",
    url: "https://example.com/ars-context-windows",
    publisher: "Ars Technica",
  },
  {
    id: "src-3",
    name: "MIT Tech Review",
    url: "https://example.com/mit-llm-eval",
    publisher: "MIT Technology Review",
  },
  {
    id: "src-4",
    name: "IEEE Spectrum",
    url: "https://example.com/ieee-edge-inference",
    publisher: "IEEE Spectrum",
  },
  {
    id: "src-5",
    name: "Reuters Tech",
    url: "https://example.com/reuters-enterprise-ai",
    publisher: "Reuters",
  },
  {
    id: "src-6",
    name: "The Verge",
    url: "https://example.com/verge-multimodal",
    publisher: "The Verge",
  },
  {
    id: "src-7",
    name: "Hugging Face Blog",
    url: "https://example.com/hf-open-models",
    publisher: "Hugging Face",
  },
  {
    id: "src-8",
    name: "Lawfare",
    url: "https://example.com/lawfare-ai-data",
    publisher: "Lawfare",
  },
  {
    id: "src-9",
    name: "Distill",
    url: "https://example.com/distill-synthetic",
    publisher: "Distill",
  },
  {
    id: "src-10",
    name: "GitHub Blog",
    url: "https://example.com/github-copilot-agents",
    publisher: "GitHub",
  },
];

export function getSourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}
