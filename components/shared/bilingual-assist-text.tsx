"use client";

import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n/types";
import type { LocalizedString } from "@/types/localized";
import { isBilingual, pickLocalized } from "@/lib/utils/localized-string";

/** In 中文 bilingual mode: EN is reference (lower contrast); ZH is reading focus. */
const enMuted = "text-zinc-600";
const zhPrimary = "text-zinc-900";
/** Subtle left rule on the ZH block for long bilingual passages. */
const zhBlockContinuity = "border-l border-zinc-200/80 pl-3 sm:pl-3.5";

function splitParas(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

type BodyProps = {
  value: LocalizedString;
  lang: Lang;
  className?: string;
};

/** Single-language paragraphs from localized or bilingual field. */
export function LocalizedBody({
  value,
  lang,
  className = "space-y-3 text-sm leading-relaxed text-foreground",
}: BodyProps) {
  const text = pickLocalized(value, lang);
  const paras = splitParas(text);
  if (paras.length === 0) return null;
  return (
    <div className={className}>
      {paras.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

/** In zh mode with bilingual data: English block then Chinese block. */
export function BilingualAssistBody({
  value,
  lang,
  className = "space-y-3 text-sm leading-relaxed text-foreground",
}: BodyProps) {
  if (lang !== "zh" || !isBilingual(value)) {
    return <LocalizedBody value={value} lang={lang} className={className} />;
  }
  const enParas = splitParas(value.en);
  const zhParas = splitParas(value.zh);
  return (
    <div className={className}>
      <div className={`space-y-3 ${enMuted}`}>
        {enParas.map((p, i) => (
          <p key={`en-${i}`}>{p}</p>
        ))}
      </div>
      <div
        className={`mt-3 space-y-3 border-t border-zinc-100 pt-3 ${zhPrimary} ${zhBlockContinuity}`}
      >
        {zhParas.map((p, i) => (
          <p key={`zh-${i}`}>{p}</p>
        ))}
      </div>
    </div>
  );
}

type TakeawayProps = {
  value: LocalizedString;
  lang: Lang;
};

export function BilingualAssistTakeawayItem({ value, lang }: TakeawayProps) {
  if (lang !== "zh" || !isBilingual(value)) {
    return <>{pickLocalized(value, lang)}</>;
  }
  return (
    <div className="space-y-2">
      <p className={enMuted}>{value.en}</p>
      <p
        className={`border-t border-zinc-100 pt-2 ${zhPrimary} ${zhBlockContinuity}`}
      >
        {value.zh}
      </p>
    </div>
  );
}

/** Hook / lead line (draft body). */
export function BilingualAssistLead({
  value,
  lang,
  className = "text-lg font-medium leading-snug text-foreground",
}: {
  value: LocalizedString;
  lang: Lang;
  className?: string;
}) {
  if (lang !== "zh" || !isBilingual(value)) {
    return <p className={className}>{pickLocalized(value, lang)}</p>;
  }
  return (
    <div className={className}>
      <p className={`leading-snug ${enMuted}`}>{value.en}</p>
      <p
        className={`mt-2 border-t border-zinc-100 pt-2 leading-snug ${zhPrimary} ${zhBlockContinuity}`}
      >
        {value.zh}
      </p>
    </div>
  );
}

/** Page title: EN then ZH in Chinese mode. */
export function BilingualAssistHeading({
  value,
  lang,
}: {
  value: LocalizedString;
  lang: Lang;
}) {
  if (lang !== "zh" || !isBilingual(value)) {
    return <>{pickLocalized(value, lang)}</>;
  }
  return (
    <>
      <span className={`block ${enMuted}`}>{value.en}</span>
      <span
        className={`mt-2 block border-t border-zinc-100 pt-2 text-xl font-semibold tracking-tight sm:text-2xl ${zhPrimary} ${zhBlockContinuity}`}
      >
        {value.zh}
      </span>
    </>
  );
}

/** Subtitle / secondary line under page title (smaller type). */
export function BilingualAssistSubline({
  value,
  lang,
}: {
  value: LocalizedString;
  lang: Lang;
}) {
  if (lang !== "zh" || !isBilingual(value)) {
    return <>{pickLocalized(value, lang)}</>;
  }
  return (
    <>
      <span className={`block ${enMuted}`}>{value.en}</span>
      <span
        className={`mt-1 block border-t border-dashed border-zinc-200 pt-1 text-sm ${zhPrimary} ${zhBlockContinuity}`}
      >
        {value.zh}
      </span>
    </>
  );
}

/** Breadcrumb current page title (smaller). */
export function BilingualAssistBreadcrumbTitle({
  value,
  lang,
}: {
  value: LocalizedString;
  lang: Lang;
}) {
  if (lang !== "zh" || !isBilingual(value)) {
    return <span className="line-clamp-2">{pickLocalized(value, lang)}</span>;
  }
  return (
    <span className="line-clamp-4">
      <span className={`block ${enMuted}`}>{value.en}</span>
      <span
        className={`mt-1 block border-l border-zinc-200/80 pl-2 text-sm sm:pl-3 ${zhPrimary}`}
      >
        {value.zh}
      </span>
    </span>
  );
}

type BilingualTrustNoteProps = {
  children: ReactNode;
};

/** Dashed note shown in Chinese UI mode on story/draft pages (bilingual assist disclaimer). */
export function BilingualTrustNote({ children }: BilingualTrustNoteProps) {
  return (
    <p
      className="mb-4 rounded-md border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs leading-relaxed text-zinc-600"
      role="note"
    >
      {children}
    </p>
  );
}
