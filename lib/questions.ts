/**
 * The Create flow.
 *
 * Ten fields across eight steps, ordered so it feels like telling someone about
 * your pet rather than completing a form: who they were first, then the
 * memories, then the practical details last.
 *
 * Only three things are actually required — their name, one piece of memory, and
 * an email to send the song to. Everything else can be skipped, because someone
 * writing this two days after losing their dog should not be blocked by a
 * validation error about music genre.
 */

export type Step =
  | {
      kind: "name";
      id: "opening";
      question: string;
      help?: string;
      required: true;
    }
  | {
      kind: "short" | "long";
      id: string;
      question: string;
      help?: string;
      placeholder?: string;
      required: boolean;
      maxLength?: number;
    }
  | {
      kind: "choice";
      id: string;
      question: string;
      help?: string;
      options: { value: string; label: string }[];
      required: boolean;
    }
  | { kind: "photos"; id: "photos"; question: string; help?: string; required: false }
  | { kind: "contact"; id: "contact"; question: string; help?: string; required: true };

export const STEPS: Step[] = [
  {
    kind: "name",
    id: "opening",
    question: "Who are we writing about?",
    help: "Their name, and whether they were a dog, a cat, or someone else entirely.",
    required: true,
  },
  {
    kind: "long",
    id: "about",
    question: "Tell us about them.",
    help: "However you'd describe them to someone who never got to meet them. There's no wrong length.",
    placeholder:
      "We got him at eight weeks and he never really stopped being a puppy. Terrible guard dog. Slept through a break-in.",
    required: false,
    maxLength: 900,
  },
  {
    kind: "short",
    id: "personality",
    question: "What were they like?",
    help: "A few words is plenty.",
    placeholder: "Gentle, stubborn, always hungry",
    required: false,
    maxLength: 160,
  },
  {
    kind: "long",
    id: "memories",
    question: "What do you never want to forget?",
    help: "The habits, the spot they always sat, the thing they did that no other animal did. Small and specific is better than big and general — the small things are what end up in the song.",
    placeholder:
      "He never once slept in the bed we bought him. Always the laundry basket, right on the warm clothes.",
    required: true,
    maxLength: 900,
  },
  {
    kind: "long",
    id: "include",
    question: "Anything you'd like in the song?",
    help: "A name to mention, a line you want in there, or something you'd rather we left out.",
    placeholder:
      "Please include my daughter Ellie — he was really her dog. And please don't mention the illness.",
    required: false,
    maxLength: 600,
  },
  {
    kind: "choice",
    id: "style",
    question: "How would you like it to sound?",
    help: "Optional. If you're not sure, we'll choose something gentle.",
    required: false,
    options: [
      { value: "acoustic", label: "Gentle acoustic" },
      { value: "piano", label: "Piano" },
      { value: "folk", label: "Soft folk" },
      { value: "country", label: "Country" },
      { value: "unsure", label: "You choose" },
    ],
  },
  {
    kind: "photos",
    id: "photos",
    question: "Do you have photos of them?",
    help: "Optional, and you can always send them later — we'll ask again in our reply.",
    required: false,
  },
  {
    kind: "contact",
    id: "contact",
    question: "Where should we send their song?",
    help: "We'll be in touch within 48 hours. Nothing is charged yet.",
    required: true,
  },
];

export const TOTAL = STEPS.length;

export const LABELS: Record<string, string> = {
  petName: "Their name",
  species: "Dog or cat",
  about: "About them",
  personality: "What they were like",
  memories: "Never want to forget",
  include: "To include or avoid",
  style: "Preferred sound",
  photoNames: "Photos attached",
  yourName: "Your name",
  email: "Email",
};

export const SUMMARY_ORDER = [
  "petName",
  "species",
  "about",
  "personality",
  "memories",
  "include",
  "style",
  "photoNames",
  "yourName",
  "email",
];
