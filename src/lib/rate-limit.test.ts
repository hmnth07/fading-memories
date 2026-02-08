import { getRemainingGenerations, canGenerate, recordGeneration } from "./rate-limit";

const STORAGE_KEY = "fading-memories-generations";

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

describe("rate-limit", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns 5 remaining on fresh state", () => {
    expect(getRemainingGenerations()).toBe(5);
  });

  it("canGenerate returns true initially", () => {
    expect(canGenerate()).toBe(true);
  });

  it("recordGeneration decrements remaining by 1", () => {
    recordGeneration();
    expect(getRemainingGenerations()).toBe(4);
  });

  it("multiple recordings decrement correctly", () => {
    recordGeneration();
    recordGeneration();
    recordGeneration();
    expect(getRemainingGenerations()).toBe(2);
  });

  it("canGenerate returns false at 5 used", () => {
    for (let i = 0; i < 5; i++) {
      recordGeneration();
    }
    expect(canGenerate()).toBe(false);
    expect(getRemainingGenerations()).toBe(0);
  });

  it("remaining never goes below 0", () => {
    for (let i = 0; i < 7; i++) {
      recordGeneration();
    }
    expect(getRemainingGenerations()).toBe(0);
  });

  it("resets to 5 when stored date is old", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ count: 4, date: "2020-01-01" })
    );
    expect(getRemainingGenerations()).toBe(5);
    expect(canGenerate()).toBe(true);
  });

  it("persists data to localStorage", () => {
    recordGeneration();
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const data = JSON.parse(raw!);
    expect(data.count).toBe(1);
    expect(data.date).toBe(todayKey());
  });
});
