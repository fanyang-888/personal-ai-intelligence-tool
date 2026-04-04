import type { Source } from "@/types/source";

export const sources: Source[] = [
  {
    id: "src-1",
    name: "The Register",
    url: "https://www.theregister.com/",
    baseUrl: "https://www.theregister.com",
    publisher: "The Register",
    type: "tech press",
    channel: "web",
    sourcePrior: 2,
  },
  {
    id: "src-2",
    name: "Ars Technica",
    url: "https://arstechnica.com/",
    baseUrl: "https://arstechnica.com",
    publisher: "Ars Technica",
    type: "tech press",
    channel: "web",
    sourcePrior: 2,
  },
  {
    id: "src-3",
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/",
    baseUrl: "https://www.technologyreview.com",
    publisher: "MIT Technology Review",
    type: "analysis",
    channel: "email",
    sourcePrior: 3,
  },
  {
    id: "src-4",
    name: "IEEE Spectrum",
    url: "https://spectrum.ieee.org/",
    baseUrl: "https://spectrum.ieee.org",
    publisher: "IEEE Spectrum",
    type: "trade",
    channel: "feed",
    sourcePrior: 2,
  },
  {
    id: "src-5",
    name: "Reuters",
    url: "https://www.reuters.com/technology/",
    baseUrl: "https://www.reuters.com",
    publisher: "Reuters",
    type: "wire",
    channel: "email",
    sourcePrior: 1,
  },
  {
    id: "src-6",
    name: "The Verge",
    url: "https://www.theverge.com/",
    baseUrl: "https://www.theverge.com",
    publisher: "The Verge",
    type: "tech press",
    channel: "web",
    sourcePrior: 2,
  },
];

export function getSourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}
