/**
 * Every word and every asset reference on the site.
 *
 * Copy lives here so that changing a sentence never means opening a component.
 * Photography lives here for the same reason — swapping the placeholders for
 * real photographs is one edit in this file and nothing else moves.
 */

/* ─────────────────────────── photography ─────────────────────────── */

export type Photo = {
  src: string;
  alt: string;
};

/**
 * All CC0 (public domain) via Openverse — no attribution obligation, safe
 * commercially. Cropped, resized and graded by scripts/../process.py so five
 * photographs from five different rooms read as one brand rather than a
 * stock-photo grid.
 *
 * Swap these for real customer photographs the moment you have written
 * permission. Nothing else needs to change.
 */
export const PHOTOS: Record<string, Photo> = {
  hero: {
    src: "/photos/hero.jpg",
    alt: "A dog resting its head on the arm of a sofa, beside its owner",
  },
  buddy: { src: "/photos/buddy.jpg", alt: "Buddy, a black labrador, resting on a bed" },
  milo: { src: "/photos/milo.jpg", alt: "Milo lying with his head on the ground, watching" },
  luna: { src: "/photos/luna.jpg", alt: "Luna, a tabby cat, curled up asleep" },
  charlie: { src: "/photos/charlie.jpg", alt: "Charlie wrapped in a soft blanket" },
};

/* ─────────────────────────────── songs ─────────────────────────────── */

export type Song = {
  id: string;
  pet: string;
  title: string;
  photo: keyof typeof PHOTOS;
  line: string;
  src: string;
  seed: number;
  /** Seconds. Shown before playback begins, since preload is "none". */
  length: number;
};

/**
 * Demonstration tracks, generated — not customer work.
 *
 * The site says so plainly wherever they play. Presenting a synthesised
 * placeholder as a real family's song would be a lie told to grieving people,
 * and the moment there are real songs (with written permission) these get
 * replaced and the notice comes out.
 */
export const FEATURED: Song = {
  id: "buddy",
  pet: "Buddy",
  title: "You Were Always Home",
  photo: "buddy",
  line: "Thirteen years, and he never once slept in the bed they bought him.",
  src: "/songs/buddy.wav",
  seed: 7,
  length: 12,
};

export const EXAMPLES: Song[] = [
  {
    id: "milo",
    pet: "Milo",
    title: "Wait For Me At The Door",
    photo: "milo",
    line: "He met them at the door every single day for eleven years.",
    src: "/songs/milo.wav",
    seed: 23,
    length: 12,
  },
  {
    id: "luna",
    pet: "Luna",
    title: "My Little Shadow",
    photo: "luna",
    line: "Sixteen years of following her from room to room, one step behind.",
    src: "/songs/luna.wav",
    seed: 41,
    length: 12,
  },
  {
    id: "charlie",
    pet: "Charlie",
    title: "Home Was Wherever You Were",
    photo: "charlie",
    line: "Four houses, three cities. He settled into every one of them first.",
    src: "/songs/charlie.wav",
    seed: 59,
    length: 12,
  },
];

export const ALL_SONGS = [FEATURED, ...EXAMPLES];

/* ──────────────────────────── how it works ──────────────────────────── */

export const STEPS = [
  {
    n: "01",
    title: "Tell us about them",
    body: "Share their name, their personality, their favourite things, and the memories you never want to forget.",
  },
  {
    n: "02",
    title: "We turn it into a song",
    body: "Those memories become an original song, written for them and no one else.",
  },
  {
    n: "03",
    title: "Keep their song forever",
    body: "Yours to hold on to, and to return to whenever you miss them.",
  },
];

/* ─────────────────────────── personalisation ─────────────────────────── */

export const DETAILS = [
  "their name",
  "the way they behaved",
  "what they loved",
  "the habits that made you laugh",
  "the memories you hold on to",
  "what they were to you",
];

/* ──────────────────────────── testimonials ──────────────────────────── */

/* ──────────────────────────── the promise ──────────────────────────── */

/**
 * What stands in for social proof until there is any.
 *
 * Every line here is a commitment you can actually keep, which is the only kind
 * of trust signal available to a business on day one.
 */
export const PROMISES = [
  {
    n: "01",
    title: "A person reads every word",
    body: "Not a form that feeds a template. Someone sits with what you wrote about them.",
  },
  {
    n: "02",
    title: "Two versions, not one take",
    body: "You choose. If neither is right, we write it again — that isn't an upgrade, it's the job.",
  },
  {
    n: "03",
    title: "Yours to keep",
    body: "Download it, play it, share it. We don't put it on streaming or licence it to anyone.",
  },
  {
    n: "04",
    title: "Never shared without you",
    body: "Their song and their photographs stay between us unless you tell us otherwise, in writing.",
  },
];

/* ──────────────────────────── testimonials ──────────────────────────── */

export type Testimonial = { quote: string; name: string; detail: string };

/**
 * Empty on purpose.
 *
 * There are no customers yet, so there are no quotes. Writing some would be
 * fabricating consumer testimonials, which the FTC rule on reviews and
 * testimonials prohibits outright and which payment processors treat as grounds
 * for termination — a bad trade for a business about to take its first order.
 *
 * Add real ones here as they arrive, with written permission, and the section
 * appears on the page by itself. Nothing else needs changing.
 *
 * The fastest honest route to filling this: the free-song giveaway. Twenty real
 * reactions inside a week, every one of them quotable.
 */
export const TESTIMONIALS: Testimonial[] = [];
