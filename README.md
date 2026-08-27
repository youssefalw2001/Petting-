# Tails We Remember

A personalised song made from the memories of someone's pet.

One page, six sections, three dependencies. The design brief was "less" — this
is the result of taking that literally.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| Styling | Tailwind v4, CSS-first `@theme` |
| Fonts | Cormorant Garamond + DM Sans, self-hosted via `next/font` |
| Animation | ~40 lines of IntersectionObserver |
| Dependencies | `next`, `react`, `react-dom`. That's all. |

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
```

`next start` does **not** work — `output: "export"` means there's no server.
Serve `out/` instead.

## Design system

Everything lives in `@theme` in `app/globals.css`. Change it there and the site
follows.

**Colour.** Warm ivory `#F7F3EE`, deep charcoal `#24211F`, one muted rose.
Contrast was measured, not guessed, and two values from the brief had to move:

- Secondary text was specified as `#77716B`. Measured, that's **4.36:1** on the
  page background and 4.07:1 on the raised surface — it fails AA for normal text
  on both. Darkened to `#6B655F`, which clears it on both (5.21:1 / 4.86:1). The
  faintness survives; the failure doesn't.
- Rose `#A87F72` is **decoration only** — rules, marks, the active state of a
  control. At 3.20:1 it clears the 3:1 that applies to graphics but not the 4.5:1
  text needs, in either direction. Anything bearing or being text uses
  `rose-deep` (4.86:1), and `rose-press` steps *down* for hover so it can't drift
  back under AA.
- `.surface-dark` flips the focus ring to ivory. A rose ring on the ink closing
  section is 1.4:1 — invisible exactly where a keyboard user is about to buy.

**Type.** Cormorant Garamond at weight 300 for headlines; large serif at light
weight reads expensive where bold reads cheap. DM Sans for everything else — the
brief offered Inter, and DM Sans is on the same list, slightly warmer, and avoids
the single most recognisable typeface of generated landing pages.

**Spacing.** One shell at 1140px, two section rhythms (`band`, `band-tight`), four
type sizes. Fewer choices means the page can't drift.

**Texture.** A fixed film-grain layer at 20% opacity over the whole page. It is
the cheapest thing that stops large flat ivory areas reading as blank screen
rather than paper, and it ties the photographs to the background because they
share the same texture. The first pass omitted it and the page read as plain.

**Photography carries the page.** The hero image is full-bleed and tall — inside
the shell with margins and a corner radius it read as a document rather than a
place. Examples are large portraits, not thumbnails; at 88px the animal was a
smudge, which defeated the point.

## Motion

One effect: a gentle rise-and-fade as each block enters view. `[data-reveal]`
plus one IntersectionObserver mounted in the layout.

This replaced GSAP, ScrollTrigger, SplitText and Lenis. A memorial page doesn't
need scroll-jacking or split-text choreography — it needs to load fast and sit
still. Removing all four cut three dependencies and every infinite animation
from the page (verified: `document.getAnimations()` returns zero looping).

The transition lives in CSS, so `prefers-reduced-motion` disables it with no
JavaScript branch.

## The Create flow

`/create` — ten fields across eight steps, declared in `lib/questions.ts`.
Ordered so it feels like telling someone about your pet: who they were, then the
memories, then the practical details.

Only three things are required — their name, one memory, and an email. Someone
writing this two days after losing their dog shouldn't be blocked by a validation
error about music genre.

Static export means no server, so it posts from the browser:

```bash
# .env.local
NEXT_PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
NEXT_PUBLIC_WEB3FORMS_KEY=your-access-key
```

Photos post as multipart when files are chosen. Web3Forms' free tier doesn't
accept attachments, which is why the confirmation also invites people to reply
to the email with them.

**With no endpoint configured it still works** — it falls back to a formatted
summary with a copy button and a mailto link. Nobody's answers are lost to a
missing env var or a failed request.

## Before this goes live

1. **Photography.** The five photographs are CC0 (public domain) via Openverse —
   no attribution obligation, safe commercially. They're cropped, resized and
   graded by `/projects/sandbox/process.py`, which pulls saturation back, warms
   everything toward the page ivory and lifts contrast so five photographs from
   five different rooms read as one brand instead of a stock-photo grid. One
   image needed harder desaturation because a blue sky fought the palette.

   Swap them for real customer photographs the moment you have written
   permission — that's the only thing that will beat these. Replace the `src`
   values in `PHOTOS` (`lib/content.ts`); nothing else changes.
2. **Testimonials.** `TESTIMONIALS` are placeholders and the page renders a
   visible build note while `TESTIMONIALS_ARE_PLACEHOLDER` is true. Invented
   reviews break the FTC rule on consumer testimonials. The notice is
   deliberately not hidden behind an env check — that would ship fabricated
   quotes to production with nothing to warn you.
3. **Songs.** `public/songs/*.wav` are generated demonstrations and the player
   says so. Swap in real songs, update `src` and `length` in `lib/content.ts`,
   and remove the note.
4. **Price.** There is no pricing section — the brief asked for a memorial
   experience, not a store. Nothing on the page states a price and nothing is
   charged; the flow says so. Decide where price belongs before launch.
5. **Payment.** No checkout. Wire Stripe Payment Links when you're ready.
6. Update the address in `components/site/Footer.tsx` and `SITE` in
   `app/layout.tsx`.

## Layout

```
app/
  layout.tsx        fonts, metadata, audio provider, reveal
  page.tsx          the eight sections, in order
  globals.css       every design token
  create/page.tsx   the Create flow
components/
  site/             the page sections
  audio/            one shared <audio>, waveform, two players
  create/           the flow
  ui/               Button, Photo, Logo, Reveal
lib/
  content.ts        all copy, photography and songs
  questions.ts      the Create flow, declaratively
```

Copy lives in `lib/content.ts`. Editing a sentence should never mean opening a
component.
