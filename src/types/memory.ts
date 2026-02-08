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

export interface MemoryField {
  field: keyof MemoryFormData;
  label: string;
  hint: string;
  placeholder: string;
}

export interface MemoryFormStep {
  title: string;
  subtitle: string;
  fields: MemoryField[];
  required: boolean;
  skippable: boolean;
}

export const MEMORY_FORM_STEPS: MemoryFormStep[] = [
  {
    title: "Describe your memory",
    subtitle: "The core of your moment — who, where, and what happened",
    required: true,
    skippable: false,
    fields: [
      {
        field: "who",
        label: "Who is in this memory?",
        hint: "A person, people, or even just yourself alone",
        placeholder: "My grandmother and I, when I was about six years old...",
      },
      {
        field: "where",
        label: "Where were you?",
        hint: "The place — real or half-remembered",
        placeholder: "In her small kitchen with the yellow curtains...",
      },
      {
        field: "what",
        label: "What was happening?",
        hint: "The moment you want to capture",
        placeholder: "She was teaching me how to fold dumplings...",
      },
    ],
  },
  {
    title: "Add some atmosphere",
    subtitle: "Optional details that bring your memory to life",
    required: false,
    skippable: true,
    fields: [
      {
        field: "atmosphere",
        label: "What season? What time of day?",
        hint: "The light, the weather, the feeling of the air",
        placeholder: "A warm summer afternoon, golden sunlight through the window...",
      },
      {
        field: "details",
        label: "Any small details you remember?",
        hint: "The things that make this memory yours",
        placeholder: "Flour on her apron, the radio playing softly, steam rising from the pot...",
      },
      {
        field: "feeling",
        label: "How did this memory make you feel?",
        hint: "The emotion at the heart of it",
        placeholder: "Safe, warm, like nothing bad could ever happen...",
      },
    ],
  },
];
