import type { Lang } from "@/lib/i18n/types";
import type { Draft, LinkedInDraftContent } from "@/types/draft";
import { pickLocalized } from "@/lib/utils/localized-string";
import { formatHashtagLine } from "@/lib/utils/draft-hashtags";

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

export type DraftClipboardLabels = {
  careerAngle: string;
  whyThisMatters: string;
};

/** Plain text for clipboard; labels follow current UI language. */
export function buildFullDraftText(
  content: LinkedInDraftContent,
  hashtagLabels: string[] | undefined,
  lang: Lang,
  labels: DraftClipboardLabels,
): string {
  const summaryParas = pickLocalized(content.summaryBlock, lang)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .join("\n\n");

  const lines = [
    pickLocalized(content.hook, lang).trim(),
    "",
    summaryParas,
    "",
    `1. ${pickLocalized(content.takeaways[0], lang).trim()}`,
    `2. ${pickLocalized(content.takeaways[1], lang).trim()}`,
    `3. ${pickLocalized(content.takeaways[2], lang).trim()}`,
    "",
    `${labels.careerAngle}:`,
    pickLocalized(content.careerInterpretationBlock, lang).trim(),
    "",
    `${labels.whyThisMatters}:`,
    pickLocalized(content.audienceWhyItMattersBlock, lang).trim(),
  ];

  if (content.closingBlock != null) {
    const closing = pickLocalized(content.closingBlock, lang).trim();
    if (closing) lines.push("", closing);
  }

  let text = lines.join("\n");
  if (hashtagLabels?.length) {
    const tagLine = formatHashtagLine(hashtagLabels);
    if (tagLine) text += `\n\n${tagLine}`;
  }
  return text;
}
