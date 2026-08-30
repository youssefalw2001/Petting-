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
 * Demonstration tracks — real songs, but not customer work.
 *
 * These are genuine ACE-Step generations with hand-written lyrics, not the
 * twelve-second synthesised tones that used to sit here. Each is deliberately a
 * different record: fingerpicked steel-string for Buddy, gospel-soul with a
 * Hammond organ for Milo, resonator slide blues for Luna, pedal steel and the
 * only brushed drums of the four for Charlie. Four ballads at one tempo in one
 * key would imply the service fills in a template, which is the opposite of what
 * it sells.
 *
 * Milo and Luna were replaced once. The first pair had a metallic ringing that
 * read immediately as machine-made, and the cause was in the prompt rather than
 * the model: one asked for a "wide warm room" — reverb, in as many words — and
 * the other for "hushed close harmonies", which is a doubled vocal, and doubling
 * comes back with phase artefacts. Both said "breathy", which arrives as
 * sibilance. Every caption now states the absence outright: dry, close-miked, no
 * reverb, no echo, single tracked vocal, no harmonies.
 *
 * A consequence worth knowing rather than discovering: all four now have male
 * vocals. The two that rang were the two female ones, and the replacements chosen
 * by ear were both male. A dry female vocal was generated and offered; it lost on
 * sound. If range across the four ever matters more than that, this is the thing
 * to revisit.
 *
 * The words come from the same detail as the `line` beneath each one — thirteen
 * years and the bed he never used, eleven years of listening for the car, sixteen
 * years one step behind, four houses and three cities. The copy and the song
 * should tell the same story.
 *
 * The player still says these are demonstrations, and that notice stays until
 * there are real customers' songs here with written permission. Presenting a
 * generated example as a real family's song would be a lie told to grieving
 * people. Being AI-generated is not the part that would make it a lie; claiming
 * it belonged to someone is.
 *
 * Regenerate from Song23, src/scripts/site-examples.ts, where the briefs live.
 */
export const FEATURED: Song = {
  id: "buddy",
  pet: "Buddy",
  title: "You Were Always Home",
  photo: "buddy",
  line: "Thirteen years, and he never once slept in the bed they bought him.",
  src: "/songs/buddy.mp3",
  seed: 7,
  length: 55,
};

export const EXAMPLES: Song[] = [
  {
    id: "milo",
    pet: "Milo",
    title: "Wait For Me At The Door",
    photo: "milo",
    line: "He met them at the door every single day for eleven years.",
    src: "/songs/milo.mp3",
    seed: 23,
    length: 45,
  },
  {
    id: "luna",
    pet: "Luna",
    title: "My Little Shadow",
    photo: "luna",
    line: "Sixteen years of following her from room to room, one step behind.",
    src: "/songs/luna.mp3",
    seed: 41,
    length: 40,
  },
  {
    id: "charlie",
    pet: "Charlie",
    title: "Home Was Wherever You Were",
    photo: "charlie",
    line: "Four houses, three cities. He settled into every one of them first.",
    src: "/songs/charlie.mp3",
    seed: 59,
    length: 50,
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
