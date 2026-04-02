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
];

export function getSourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}
