import type { MemoryFormData } from "@/types/memory";

const QUALITY_PREFIX = [
  "anime style",
  "anime art",
  "masterpiece",
  "best quality",
  "very aesthetic",
  "illustration",
  "studio ghibli inspired",
];

const STYLE_SUFFIX = [
  "nostalgic",
  "cinematic lighting",
  "depth of field",
  "detailed background",
  "soft colors",
  "anime aesthetic",
];

const PERSON_KEYWORDS: Record<string, string[]> = {
  grandmother: ["elderly woman", "grandmother"],
  grandma: ["elderly woman", "grandmother"],
  grandfather: ["elderly man", "grandfather"],
  grandpa: ["elderly man", "grandfather"],
  mother: ["woman", "mother"],
  mom: ["woman", "mother"],
  father: ["man", "father"],
  dad: ["man", "father"],
  sister: ["girl", "sister"],
  brother: ["boy", "brother"],
  friend: ["friend"],
  child: ["child"],
  kid: ["child"],
  baby: ["baby", "infant"],
  dog: ["dog"],
  cat: ["cat"],
};

const SCENE_KEYWORDS: Record<string, string[]> = {
  cooking: ["cooking", "kitchen activity"],
  reading: ["reading", "book"],
  walking: ["walking"],
  running: ["running"],
  playing: ["playing"],
  singing: ["singing"],
  dancing: ["dancing"],
  eating: ["eating", "food"],
  swimming: ["swimming", "water"],
  fishing: ["fishing"],
  gardening: ["gardening", "plants"],
  painting: ["painting", "art"],
  studying: ["studying", "desk"],
  sleeping: ["sleeping", "peaceful"],
  hugging: ["hugging", "embrace"],
  laughing: ["laughing", "happy"],
  crying: ["crying", "emotional"],
  talking: ["talking", "conversation"],
};

const LOCATION_KEYWORDS: Record<string, string[]> = {
  kitchen: ["kitchen", "indoors"],
  bedroom: ["bedroom", "indoors"],
  garden: ["garden", "outdoors", "flowers"],
  park: ["park", "outdoors", "trees"],
  beach: ["beach", "ocean", "sand", "outdoors"],
  school: ["school", "classroom", "indoors"],
  forest: ["forest", "trees", "outdoors", "nature"],
  mountain: ["mountain", "outdoors", "scenic"],
  river: ["river", "water", "outdoors"],
  lake: ["lake", "water", "outdoors"],
  city: ["city", "urban", "buildings"],
  street: ["street", "urban", "outdoors"],
  home: ["house", "indoors", "cozy"],
  house: ["house", "indoors"],
  temple: ["temple", "traditional architecture"],
  church: ["church", "religious building"],
  market: ["market", "stalls", "outdoors"],
  field: ["field", "grass", "outdoors", "open space"],
  roof: ["rooftop", "sky", "outdoors"],
  balcony: ["balcony", "outdoors"],
  train: ["train", "railway"],
  car: ["car interior", "driving"],
};

const SEASON_KEYWORDS: Record<string, string[]> = {
  spring: ["spring", "cherry blossoms", "new growth"],
  summer: ["summer", "bright sunlight", "warm"],
  autumn: ["autumn", "falling leaves", "orange tones"],
  fall: ["autumn", "falling leaves", "orange tones"],
  winter: ["winter", "snow", "cold"],
  rain: ["rain", "wet", "overcast"],
  rainy: ["rain", "wet", "overcast"],
  snow: ["snow", "winter", "cold"],
  snowy: ["snow", "winter", "cold"],
};

const TIME_KEYWORDS: Record<string, string[]> = {
  morning: ["morning", "early light", "sunrise"],
  dawn: ["dawn", "early morning", "sunrise"],
  afternoon: ["afternoon", "golden hour"],
  evening: ["evening", "sunset", "warm light"],
  sunset: ["sunset", "orange sky", "golden hour"],
  night: ["night", "moonlight", "stars"],
  midnight: ["night", "dark", "moonlight"],
  dusk: ["dusk", "twilight"],
};

const FEELING_KEYWORDS: Record<string, string[]> = {
  happy: ["joyful expression", "bright colors", "warm atmosphere"],
  sad: ["melancholic", "soft light", "quiet"],
  safe: ["warm lighting", "cozy", "gentle", "comfort"],
  warm: ["warm lighting", "cozy", "gentle"],
  peaceful: ["serene", "calm", "tranquil", "soft light"],
  nostalgic: ["wistful", "sepia tones", "warm"],
  excited: ["dynamic", "vibrant colors", "energetic"],
  lonely: ["solitary", "quiet", "contemplative"],
  loved: ["warm embrace", "soft glow", "tender"],
  free: ["wind", "open space", "liberating"],
  grateful: ["warm smile", "gentle light", "thankful"],
  scared: ["dramatic lighting", "shadows", "tension"],
  wonder: ["sparkling", "magical", "awe-inspiring"],
  bittersweet: ["warm yet melancholic", "golden hour", "wistful"],
  content: ["relaxed", "peaceful", "satisfied", "gentle smile"],
};

function extractTags(
  text: string,
  keywordMap: Record<string, string[]>
): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const [keyword, tags] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) {
      found.push(...tags);
    }
  }

  return found;
}

function extractDetailPhrases(text: string): string[] {
  const phrases = text
    .split(/[,.;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2 && s.length < 60);
  return phrases.slice(0, 5);
}

export function composePrompt(memory: MemoryFormData, feedback?: string): string {
  const tags: string[] = [...QUALITY_PREFIX];

  // People
  const personTags = extractTags(memory.who, PERSON_KEYWORDS);
  if (personTags.length > 0) {
    tags.push(...personTags);
  } else {
    // Passthrough the who field as-is if no keywords matched
    const who = memory.who.trim();
    if (who) tags.push(who);
  }

  // Scene/activity
  const sceneTags = extractTags(memory.what, SCENE_KEYWORDS);
  if (sceneTags.length > 0) {
    tags.push(...sceneTags);
  } else {
    const what = memory.what.trim();
    if (what) tags.push(what);
  }

  // Location
  const locationTags = extractTags(memory.where, LOCATION_KEYWORDS);
  if (locationTags.length > 0) {
    tags.push(...locationTags);
  } else {
    const where = memory.where.trim();
    if (where) tags.push(where);
  }

  // Atmosphere (season + time)
  tags.push(...extractTags(memory.atmosphere, SEASON_KEYWORDS));
  tags.push(...extractTags(memory.atmosphere, TIME_KEYWORDS));
  if (
    extractTags(memory.atmosphere, SEASON_KEYWORDS).length === 0 &&
    extractTags(memory.atmosphere, TIME_KEYWORDS).length === 0
  ) {
    const atm = memory.atmosphere.trim();
    if (atm) tags.push(atm);
  }

  // Details (passthrough short phrases)
  if (memory.details.trim()) {
    tags.push(...extractDetailPhrases(memory.details));
  }

  // Feeling/mood
  const feelingTags = extractTags(memory.feeling, FEELING_KEYWORDS);
  if (feelingTags.length > 0) {
    tags.push(...feelingTags);
  } else {
    const feeling = memory.feeling.trim();
    if (feeling) tags.push(feeling);
  }

  // Append user feedback for iteration
  if (feedback && feedback.trim()) {
    tags.push(feedback.trim());
  }

  tags.push(...STYLE_SUFFIX);

  // Deduplicate while preserving order
  const seen = new Set<string>();
  const unique = tags.filter((tag) => {
    const lower = tag.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });

  return unique.join(", ");
}
