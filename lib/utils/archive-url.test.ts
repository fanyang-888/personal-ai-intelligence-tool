import { describe, expect, it } from "vitest";
import {
  archiveHref,
  archiveTopicHref,
  parseArchiveQuery,
  serializeArchiveQuery,
} from "@/lib/utils/archive-url";

const params = (qs: string) => new URLSearchParams(qs);

describe("parseArchiveQuery", () => {
  it("reads keyword and a valid topic group", () => {
    expect(parseArchiveQuery(params("q=agents&topic=funding"))).toEqual({ q: "agents", topic: "funding" });
  });

  it("drops unknown topic keys instead of passing them to the API", () => {
    expect(parseArchiveQuery(params("topic=bogus")).topic).toBe("");
    expect(parseArchiveQuery(params("topic=Funding")).topic).toBe(""); // keys are lowercase
  });

  it("defaults missing params to empty strings", () => {
    expect(parseArchiveQuery(params(""))).toEqual({ q: "", topic: "" });
  });
});

describe("serializeArchiveQuery / archiveHref", () => {
  it("omits empty params and trims the keyword", () => {
    expect(serializeArchiveQuery({ q: "  gpt  ", topic: "" })).toBe("q=gpt");
    expect(archiveHref({ q: "", topic: "" })).toBe("/archive");
  });

  it("round-trips through parse", () => {
    const query = { q: "open weights", topic: "opensource" };
    expect(parseArchiveQuery(params(serializeArchiveQuery(query)))).toEqual(query);
  });

  it("builds the category deep link used by the homepage", () => {
    expect(archiveTopicHref("policy")).toBe("/archive?topic=policy");
  });
});
