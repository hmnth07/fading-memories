import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock the replicate module
vi.mock("@/lib/replicate", () => ({
  replicate: {
    run: vi.fn().mockResolvedValue(["https://example.com/image.webp"]),
  },
  MODEL_ID: "test-model",
  DEFAULT_PARAMS: { num_outputs: 1 },
}));

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/generate", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const validBody = {
  who: "grandmother",
  where: "kitchen",
  what: "cooking",
};

describe("POST /api/generate", () => {
  it("returns 200 with valid required fields only", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.imageUrl).toBe("https://example.com/image.webp");
    expect(json.prompt).toBeTruthy();
  });

  it("returns 400 when who is missing", async () => {
    const res = await POST(makeRequest({ where: "kitchen", what: "cooking" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("who");
  });

  it("returns 400 when where is missing", async () => {
    const res = await POST(makeRequest({ who: "grandmother", what: "cooking" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("where");
  });

  it("returns 400 when what is missing", async () => {
    const res = await POST(makeRequest({ who: "grandmother", where: "kitchen" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("what");
  });

  it("returns 400 when required field is whitespace-only", async () => {
    const res = await POST(makeRequest({ ...validBody, who: "   " }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("who");
  });

  it("returns 200 when optional fields are omitted", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
  });

  it("returns 200 when optional fields are provided", async () => {
    const res = await POST(makeRequest({
      ...validBody,
      atmosphere: "summer evening",
      details: "flour on her apron",
      feeling: "warm and safe",
    }));
    expect(res.status).toBe(200);
  });

  it("returns 200 with valid feedback", async () => {
    const res = await POST(makeRequest({
      ...validBody,
      feedback: "make the sky more orange",
    }));
    expect(res.status).toBe(200);
  });

  it("returns 400 when feedback exceeds 500 chars", async () => {
    const res = await POST(makeRequest({
      ...validBody,
      feedback: "a".repeat(501),
    }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Feedback");
  });

  it("returns 400 when required field exceeds 1000 chars", async () => {
    const res = await POST(makeRequest({
      ...validBody,
      who: "a".repeat(1001),
    }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("who");
  });
});
