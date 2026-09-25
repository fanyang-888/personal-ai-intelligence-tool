import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  TOPIC_GROUPS,
  isTopicGroupKey,
  topicTagsForGroup,
} from "@/lib/constants/topic-groups";

/** The canonical topic_tag vocabulary the backend LLM prompt allows. */
function backendTopicTags(): string[] {
  const src = readFileSync(
    new URL("../../backend/app/services/summarization.py", import.meta.url),
    "utf8",
  );
  const match = src.match(/"topic_tag":\s*"one of:\s*([^"]+)"/);
  if (!match) throw new Error("topic_tag vocabulary not found in summarization.py");
  return match[1].split("|").map((t) => t.trim());
}

describe("topic groups ↔ backend topic_tag contract", () => {
  const canonical = backendTopicTags();
  const grouped = TOPIC_GROUPS.flatMap((g) => g.tags);

  it("covers every canonical tag except Other exactly once", () => {
    const expected = canonical.filter((t) => t !== "Other").sort();
    expect([...grouped].sort()).toEqual(expected);
  });

  it("never exposes Other as a category", () => {
    expect(grouped).not.toContain("Other");
  });
});

describe("topic group helpers", () => {
  it("has unique keys and bilingual labels", () => {
    const keys = TOPIC_GROUPS.map((g) => g.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const g of TOPIC_GROUPS) {
      expect(g.label.en).toBeTruthy();
      expect(g.label.zh).toBeTruthy();
    }
  });

  it("expands a group key into backend tags", () => {
    expect(topicTagsForGroup("research")).toEqual(["Research", "Benchmark"]);
    expect(topicTagsForGroup("nope")).toEqual([]);
  });

  it("validates keys", () => {
    expect(isTopicGroupKey("models")).toBe(true);
    expect(isTopicGroupKey("Models")).toBe(false);
  });
});
