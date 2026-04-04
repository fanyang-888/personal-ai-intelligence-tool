import type { Draft, LinkedInDraftContent } from "@/types/draft";

function toPrimaryContent(draft: Draft): LinkedInDraftContent {
  return {
    hook: draft.hook,
    summaryBlock: draft.summaryBlock,
    takeaways: draft.takeaways,
    careerInterpretationBlock: draft.careerInterpretationBlock,
    audienceWhyItMattersBlock: draft.audienceWhyItMattersBlock,
    closingBlock: draft.closingBlock,
  };
}

export function getDraftContentSlices(draft: Draft): LinkedInDraftContent[] {
  return [toPrimaryContent(draft), ...(draft.variants ?? [])];
}

/** Plain text for clipboard; single v1 template, English labels. */
export function buildFullDraftText(content: LinkedInDraftContent): string {
  const summaryParas = content.summaryBlock
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .join("\n\n");

  const lines = [
    content.hook.trim(),
    "",
    summaryParas,
    "",
    `1. ${content.takeaways[0].trim()}`,
    `2. ${content.takeaways[1].trim()}`,
    `3. ${content.takeaways[2].trim()}`,
    "",
    "Career angle:",
    content.careerInterpretationBlock.trim(),
    "",
    "Why this matters:",
    content.audienceWhyItMattersBlock.trim(),
  ];

  if (content.closingBlock?.trim()) {
    lines.push("", content.closingBlock.trim());
  }

  return lines.join("\n");
}
