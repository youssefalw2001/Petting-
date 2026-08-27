/**
 * The intake questions.
 *
 * Order matters. Easy factual questions first to build momentum, the
 * emotionally heavy ones once someone is already invested, contact details
 * last. Question 6 ("the one thing they did") is the one that produces the
 * line people cry at, so it's required and it gets the most encouragement.
 *
 * Editing copy here should never require touching a component.
 */

export type Step =
  | {
      kind: "choice";
      id: string;
      question: string;
      help?: string;
      options: { value: string; label: string; note?: string }[];
      required: boolean;
      defaultValue?: string;
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
      kind: "contact";
      id: string;
      question: string;
      help?: string;
      required: boolean;
    };

export const STEPS: Step[] = [
  {
    kind: "choice",
    id: "tier",
    question: "Which pressing would you like?",
    help: "You can change your mind before you pay — nothing is charged yet.",
    required: true,
    defaultValue: "keepsake",
    options: [
      { value: "digital", label: "Digital", note: "$47 · the song and artwork" },
      {
        value: "keepsake",
        label: "Keepsake",
        note: "$97 · song, lyric video, private page",
      },
      {
        value: "forever",
        label: "Forever",
        note: "$197 · everything, plus a printed sleeve",
      },
      {
        value: "legacy",
        label: "Legacy",
        note: "$397 · a call, two songs, framed",
      },
    ],
  },
  {
    kind: "short",
    id: "name",
    question: "What was their name?",
    help: "And what you actually called them — the silly version counts, and it often ends up in the song.",
    placeholder: "Biscuit. Mostly “Biscy” or “sir”.",
    required: true,
    maxLength: 120,
  },
  {
    kind: "choice",
    id: "species",
    question: "Dog or cat?",
    required: true,
    options: [
      { value: "dog", label: "Dog" },
      { value: "cat", label: "Cat" },
      { value: "other", label: "Someone else" },
    ],
  },
  {
    kind: "short",
    id: "breed",
    question: "What kind, and how old were they?",
    help: "Rough is fine. “Golden retriever, thirteen” is plenty.",
    placeholder: "Golden retriever, thirteen years",
    required: false,
    maxLength: 160,
  },
  {
    kind: "long",
    id: "arrival",
    question: "How did they come into your life?",
    help: "The shelter, the box outside a shop, the friend who couldn't keep them. Beginnings make good opening lines.",
    placeholder:
      "We weren't going to get a dog that day. He was the last one there and he didn't bark once.",
    required: false,
    maxLength: 700,
  },
  {
    kind: "short",
    id: "personality",
    question: "Three words for who they were.",
    placeholder: "Gentle, stubborn, always hungry",
    required: true,
    maxLength: 120,
  },
  {
    kind: "long",
    id: "signature",
    question: "What's the one thing they did that nobody else's pet did?",
    help: "This is the most important question here. The habit, the noise, the spot they always ended up in. Be as specific and as small as you like — small is what makes it theirs.",
    placeholder:
      "He never once slept in the bed we bought him. Always the laundry basket, right on the warm clothes.",
    required: true,
    maxLength: 700,
  },
  {
    kind: "short",
    id: "place",
    question: "Where did they love to be?",
    placeholder: "The landing at four o'clock, when the sun came through",
    required: false,
    maxLength: 240,
  },
  {
    kind: "long",
    id: "moment",
    question: "Is there a moment you replay?",
    help: "It doesn't have to be a big one. The ordinary ones tend to land hardest.",
    placeholder:
      "Every single day he lost his mind at the mail truck. Eleven years. Never won once.",
    required: false,
    maxLength: 700,
  },
  {
    kind: "short",
    id: "family",
    question: "Who else was in their family?",
    help: "Names we can put in the song — people and other animals.",
    placeholder: "Me, my wife Danni, and their sister Olive",
    required: false,
    maxLength: 240,
  },
  {
    kind: "long",
    id: "message",
    question: "What do you wish you could tell them?",
    help: "You can write this to them rather than to us. Most people do.",
    placeholder: "That we were the lucky ones. Not him.",
    required: false,
    maxLength: 700,
  },
  {
    kind: "choice",
    id: "genre",
    question: "How should it sound?",
    required: true,
    defaultValue: "acoustic",
    options: [
      { value: "acoustic", label: "Gentle acoustic", note: "Guitar, warm, quiet" },
      { value: "piano", label: "Piano ballad", note: "Slow and open" },
      { value: "country", label: "Country", note: "Story-telling, a little brighter" },
      { value: "soul", label: "Soul", note: "Fuller, with more voice in it" },
      { value: "folk", label: "Indie folk", note: "Sparse, close, intimate" },
    ],
  },
  {
    kind: "choice",
    id: "voice",
    question: "Whose voice should sing it?",
    required: true,
    defaultValue: "either",
    options: [
      { value: "female", label: "A woman" },
      { value: "male", label: "A man" },
      { value: "either", label: "Whichever suits it" },
    ],
  },
  {
    kind: "long",
    id: "avoid",
    question: "Anything we should leave out?",
    help: "How they died, a name that would sting, a detail you'd rather not hear sung. We'll avoid it.",
    placeholder: "Please don't mention the illness.",
    required: false,
    maxLength: 500,
  },
  {
    kind: "contact",
    id: "contact",
    question: "Where should we send it?",
    help: "We'll email you when it's ready — usually inside 48 hours — and ask for photos then.",
    required: true,
  },
];

export const TOTAL_STEPS = STEPS.length;

/** Human-readable labels for the summary email. */
export const LABELS: Record<string, string> = {
  tier: "Pressing",
  name: "Their name",
  species: "Dog or cat",
  breed: "Kind and age",
  arrival: "How they arrived",
  personality: "Three words",
  signature: "The one thing they did",
  place: "Where they loved to be",
  moment: "A moment they replay",
  family: "Their family",
  message: "What they'd tell them",
  genre: "Sound",
  voice: "Voice",
  avoid: "Leave out",
  yourName: "Your name",
  email: "Email",
};
