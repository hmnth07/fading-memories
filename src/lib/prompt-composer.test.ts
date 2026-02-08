import { composePrompt } from "./prompt-composer";
import type { MemoryFormData } from "@/types/memory";

function makeMemory(overrides: Partial<MemoryFormData> = {}): MemoryFormData {
  return {
    who: "grandmother",
    where: "kitchen",
    what: "cooking",
    atmosphere: "",
    details: "",
    feeling: "",
    ...overrides,
  };
}

describe("composePrompt", () => {
  it("starts with QUALITY_PREFIX tags", () => {
    const result = composePrompt(makeMemory());
    expect(result).toMatch(/^anime style, anime art, masterpiece/);
  });

  it("ends with STYLE_SUFFIX tags", () => {
    const result = composePrompt(makeMemory());
    expect(result).toMatch(/anime aesthetic$/);
    expect(result).toContain("nostalgic");
    expect(result).toContain("cinematic lighting");
    expect(result).toContain("depth of field");
    expect(result).toContain("detailed background");
    expect(result).toContain("soft colors");
  });

  it("extracts person keywords from who field", () => {
    const result = composePrompt(makeMemory({ who: "grandmother" }));
    expect(result).toContain("elderly woman");
    expect(result).toContain("grandmother");
  });

  it("extracts location keywords from where field", () => {
    const result = composePrompt(makeMemory({ where: "beach" }));
    expect(result).toContain("beach");
    expect(result).toContain("ocean");
    expect(result).toContain("sand");
    expect(result).toContain("outdoors");
  });

  it("extracts scene keywords from what field", () => {
    const result = composePrompt(makeMemory({ what: "cooking" }));
    expect(result).toContain("cooking");
    expect(result).toContain("kitchen activity");
  });

  it("passes through unknown who values as-is", () => {
    const result = composePrompt(makeMemory({ who: "my neighbor Totoro" }));
    expect(result).toContain("my neighbor Totoro");
  });

  it("passes through unknown where values as-is", () => {
    const result = composePrompt(makeMemory({ where: "a quiet hilltop" }));
    expect(result).toContain("a quiet hilltop");
  });

  it("passes through unknown what values as-is", () => {
    const result = composePrompt(makeMemory({ what: "building a sandcastle" }));
    expect(result).toContain("building a sandcastle");
  });

  it("deduplicates tags", () => {
    // "nostalgic" appears in STYLE_SUFFIX, so if feeling also produces it, it shouldn't be duplicated
    const result = composePrompt(makeMemory({ feeling: "nostalgic" }));
    const matches = result.split("nostalgic").length - 1;
    // "nostalgic" from STYLE_SUFFIX + "wistful" from feeling. The word "nostalgic" should appear only once.
    expect(matches).toBe(1);
  });

  it("appends feedback before STYLE_SUFFIX", () => {
    const result = composePrompt(makeMemory(), "make the sky redder");
    expect(result).toContain("make the sky redder");
    // Feedback should come before style suffix tags
    const feedbackIndex = result.indexOf("make the sky redder");
    const suffixIndex = result.indexOf("nostalgic");
    expect(feedbackIndex).toBeLessThan(suffixIndex);
  });

  it("ignores empty feedback", () => {
    const withEmpty = composePrompt(makeMemory(), "");
    const withoutFeedback = composePrompt(makeMemory());
    expect(withEmpty).toBe(withoutFeedback);
  });

  it("ignores whitespace-only feedback", () => {
    const withWhitespace = composePrompt(makeMemory(), "   ");
    const withoutFeedback = composePrompt(makeMemory());
    expect(withWhitespace).toBe(withoutFeedback);
  });

  it("handles atmosphere with season keywords", () => {
    const result = composePrompt(makeMemory({ atmosphere: "summer" }));
    expect(result).toContain("summer");
    expect(result).toContain("bright sunlight");
    expect(result).toContain("warm");
  });

  it("handles atmosphere with time keywords", () => {
    const result = composePrompt(makeMemory({ atmosphere: "evening" }));
    expect(result).toContain("evening");
    expect(result).toContain("sunset");
    expect(result).toContain("warm light");
  });

  it("handles atmosphere with both season and time", () => {
    const result = composePrompt(makeMemory({ atmosphere: "winter evening" }));
    expect(result).toContain("winter");
    expect(result).toContain("snow");
    expect(result).toContain("evening");
    expect(result).toContain("sunset");
  });

  it("handles feeling keywords", () => {
    const result = composePrompt(makeMemory({ feeling: "happy" }));
    expect(result).toContain("joyful expression");
    expect(result).toContain("bright colors");
    expect(result).toContain("warm atmosphere");
  });

  it("handles all empty optional fields gracefully", () => {
    const result = composePrompt(makeMemory({
      atmosphere: "",
      details: "",
      feeling: "",
    }));
    expect(result).toBeTruthy();
    expect(result).toContain("anime style");
    expect(result).toContain("anime aesthetic");
  });

  it("extracts detail phrases", () => {
    const result = composePrompt(makeMemory({
      details: "flour on her apron, the radio playing softly",
    }));
    expect(result).toContain("flour on her apron");
    expect(result).toContain("the radio playing softly");
  });
});
