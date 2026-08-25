export type Track = {
  id: string;
  petName: string;
  catalog: string;
  meta: string;
  genre: string;
  story: string;
  src: string;
  photo: string;
  photoAlt: string;
  seed: number;
};

/**
 * Sample songs.
 *
 * `src` files in /public/samples are generated placeholders — swap in the three
 * real MP3s and update `story`/`meta` to match. Keep them under ~2MB each.
 */
export const TRACKS: Track[] = [
  {
    id: "biscuit",
    petName: "Biscuit",
    catalog: "SB–001",
    meta: "Golden Retriever · 2011–2024",
    genre: "Gentle acoustic",
    story:
      "Thirteen years, and he never once slept in the bed they bought him. Always the laundry basket, always on the warm clothes.",
    src: "/samples/biscuit.wav",
    photo: "/placeholders/sleeve-1.svg",
    photoAlt: "Sleeve artwork for Biscuit's song",
    seed: 7,
  },
  {
    id: "olive",
    petName: "Olive",
    catalog: "SB–002",
    meta: "Tabby · 2009–2025",
    genre: "Piano ballad",
    story:
      "Sixteen years of finding the four o'clock sun on the landing before anyone else knew it was there.",
    src: "/samples/olive.wav",
    photo: "/placeholders/sleeve-2.svg",
    photoAlt: "Sleeve artwork for Olive's song",
    seed: 23,
  },
  {
    id: "tucker",
    petName: "Tucker",
    catalog: "SB–003",
    meta: "Beagle mix · 2014–2025",
    genre: "Country",
    story:
      "He hated the mail truck for eleven straight years and he never lost once, not according to him.",
    src: "/samples/tucker.wav",
    photo: "/placeholders/sleeve-3.svg",
    photoAlt: "Sleeve artwork for Tucker's song",
    seed: 41,
  },
];

export const STEPS = [
  {
    n: "01",
    title: "Tell us about them",
    body:
      "Thirteen short questions — their name, their habits, the spot they always sat, the thing they did that no other animal did. Takes about five minutes.",
  },
  {
    n: "02",
    title: "We write and record it",
    body:
      "An original song built from your answers, in the style you pick. You get two versions to choose between, not one take you're stuck with.",
  },
  {
    n: "03",
    title: "It arrives in 48 hours",
    body:
      "A private page with the song, a lyric video made from your photos, and files to download and keep. Yours — we never post it without asking.",
  },
];

export type Tier = {
  id: string;
  name: string;
  price: string;
  catalog: string;
  summary: string;
  includes: string[];
  featured?: boolean;
  cta: string;
};

export const TIERS: Tier[] = [
  {
    id: "digital",
    name: "Digital",
    price: "$47",
    catalog: "A-SIDE",
    summary: "The song itself, nothing extra.",
    includes: [
      "One original song, about 2 minutes",
      "Two versions to choose from",
      "Cover artwork",
      "MP3 download",
    ],
    cta: "Choose Digital",
  },
  {
    id: "keepsake",
    name: "Keepsake",
    price: "$97",
    catalog: "SB–100",
    summary: "The one most people pick. Song plus something to watch.",
    includes: [
      "Everything in Digital",
      "Lyric video built from your photos",
      "Private delivery page you can share",
      "Extended 3-minute cut",
      "48-hour delivery",
    ],
    featured: true,
    cta: "Choose Keepsake",
  },
  {
    id: "forever",
    name: "Forever",
    price: "$197",
    catalog: "SB–200",
    summary: "Something for the wall, not just the phone.",
    includes: [
      "Everything in Keepsake",
      "Printed sleeve with a code that plays the song",
      "One free revision",
      "Second song for another pet, half price",
      "Priority 24-hour delivery",
    ],
    cta: "Choose Forever",
  },
];

export const FAQS = [
  {
    q: "How long does it take?",
    a: "48 hours from the moment you finish the questions. Forever orders go out inside 24. If we're ever going to be late you'll hear it from us first, not after.",
  },
  {
    q: "How is the song actually made?",
    a: "A real person reads every answer you send and writes the lyrics around the specific things you tell us. The music and vocal are produced with AI tools, directed by hand, and we listen to every version before anything reaches you. We'd rather say that plainly than let you find out later.",
  },
  {
    q: "What if it doesn't feel right?",
    a: "Tell us what missed and we'll rewrite it. Forever includes a revision as standard, and honestly, if a song about someone's pet lands wrong we're going to fix it whatever tier you bought.",
  },
  {
    q: "Do I own it?",
    a: "Yes. The song is yours to keep, play, share, and post. We don't distribute it, licence it, or put it on streaming. It exists for you.",
  },
  {
    q: "Can you do a pet who's still here?",
    a: "Plenty of people do — gotcha days, birthdays, a new adoption, or just because. Same questions, same 48 hours, happier tense.",
  },
  {
    q: "More than one pet in the same song?",
    a: "Two in one song works nicely if they were a pair. Three or more starts to crowd the lyrics, so we'd suggest a song each — the second is half price on Forever.",
  },
];

export const REASSURANCE = [
  "48-hour delivery",
  "Two versions to choose from",
  "The song is yours to keep",
  "Never shared without your say",
];

/** Marquee names. Replace with real customers as they come in. */
export const PET_NAMES = [
  "Biscuit", "Olive", "Tucker", "Luna", "Cooper", "Maple", "Sadie", "Otis",
  "Bean", "Willow", "Gus", "Poppy", "Duke", "Nala", "Rufus", "Pepper",
  "Moose", "Clementine", "Bear", "Hazel", "Boone", "Mochi", "Waffles",
  "Juniper", "Scout", "Marlow", "Peanut", "Dottie",
];

/**
 * ⚠️  PLACEHOLDER TESTIMONIALS — MUST BE REPLACED BEFORE LAUNCH.
 *
 * Publishing invented customer reviews is illegal in the US (FTC rule on
 * consumer reviews and testimonials) and it's the fastest way to lose a
 * payment processor. Replace every entry below with a real message you have
 * written permission to quote, then delete this comment.
 *
 * Run the free-song giveaway from the playbook first — twenty real reactions
 * in seventy-two hours, all of them yours to use.
 */
export const REACTIONS_ARE_PLACEHOLDER = true;

export const REACTIONS = [
  {
    quote:
      "I got about eight seconds in before I had to put the phone down. You got the laundry basket thing exactly right.",
    name: "Placeholder",
    detail: "for Biscuit",
  },
  {
    quote:
      "My mum has played it every morning since Tuesday. She's never once played the same thing twice.",
    name: "Placeholder",
    detail: "for Olive",
  },
  {
    quote: "The mail truck line. My whole family lost it. Thank you.",
    name: "Placeholder",
    detail: "for Tucker",
  },
  {
    quote:
      "I wasn't sure a song could hold sixteen years. It somehow does.",
    name: "Placeholder",
    detail: "for Marlow",
  },
  {
    quote:
      "Ordered it at midnight not really expecting much. It arrived Thursday and I've cried twice.",
    name: "Placeholder",
    detail: "for Bean",
  },
  {
    quote:
      "We played it at her burial in the garden. It was the only part of the day that felt right.",
    name: "Placeholder",
    detail: "for Poppy",
  },
];

/** The intake question that does the heavy lifting. */
export const KEY_QUESTION =
  "What's the one thing they did that nobody else's pet did?";

export const INTAKE_SAMPLE = [
  "Their name — and what you actually called them",
  "How they came into your life",
  "Three words for their personality",
  "The spot they always ended up in",
  "Who else was in their family",
  "What you'd tell them if you could",
];
