export interface MemoryFormData {
  who: string;
  where: string;
  what: string;
  atmosphere: string;
  details: string;
  feeling: string;
}

export interface GenerationResult {
  imageUrl: string;
  prompt: string;
}

export type CreatePageState = "form" | "generating" | "result";

export interface MemoryStep {
  field: keyof MemoryFormData;
  question: string;
  hint: string;
  placeholder: string;
}

export const MEMORY_STEPS: MemoryStep[] = [
  {
    field: "who",
    question: "Who is in this memory?",
    hint: "A person, people, or even just yourself alone",
    placeholder: "My grandmother and I, when I was about six years old...",
  },
  {
    field: "where",
    question: "Where were you?",
    hint: "The place — real or half-remembered",
    placeholder: "In her small kitchen with the yellow curtains...",
  },
  {
    field: "what",
    question: "What was happening?",
    hint: "The moment you want to capture",
    placeholder: "She was teaching me how to fold dumplings...",
  },
  {
    field: "atmosphere",
    question: "What season? What time of day?",
    hint: "The light, the weather, the feeling of the air",
    placeholder: "A warm summer afternoon, golden sunlight through the window...",
  },
  {
    field: "details",
    question: "Any small details you remember?",
    hint: "The things that make this memory yours",
    placeholder: "Flour on her apron, the radio playing softly, steam rising from the pot...",
  },
  {
    field: "feeling",
    question: "How did this memory make you feel?",
    hint: "The emotion at the heart of it",
    placeholder: "Safe, warm, like nothing bad could ever happen...",
  },
];
