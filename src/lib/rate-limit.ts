const STORAGE_KEY = "fading-memories-generations";
const MAX_GENERATIONS_PER_DAY = 5;

interface RateLimitData {
  count: number;
  date: string;
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function getData(): RateLimitData {
  if (typeof window === "undefined") return { count: 0, date: getTodayKey() };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: getTodayKey() };

    const data: RateLimitData = JSON.parse(raw);
    if (data.date !== getTodayKey()) {
      return { count: 0, date: getTodayKey() };
    }
    return data;
  } catch {
    return { count: 0, date: getTodayKey() };
  }
}

export function getRemainingGenerations(): number {
  const data = getData();
  return Math.max(0, MAX_GENERATIONS_PER_DAY - data.count);
}

export function canGenerate(): boolean {
  return getRemainingGenerations() > 0;
}

export function recordGeneration(): void {
  const data = getData();
  const updated: RateLimitData = {
    count: data.count + 1,
    date: getTodayKey(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
