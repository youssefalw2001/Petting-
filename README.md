# Tails We Remember

A personalised song made from the memories of someone's pet.

One page, six sections, three dependencies. The design brief was "less" — this
is the result of taking that literally.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| Styling | Tailwind v4, CSS-first `@theme` |
| Fonts | Sora + Manrope + JetBrains Mono, self-hosted via `next/font` |
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

Everything lives in `@theme` in `app/globals.css`.

**Colour — near-black with one warm light.** The photographs are the only real
colour on the page; against a deep background they behave like light sources
rather than pictures pasted onto paper.

| Token | Value | Measured |
|---|---|---|
| `base` | `#0B0C0E` | page |
| `surface` | `#14161A` | raised bands |
| `hi` | `#F2F3F5` | 17.62:1 |
| `mid` | `#C9CED4` | 12.36:1 |
| `low` | `#9BA1A9` | 7.51:1 |
| `amber` | `#F0B27A` | 10.58:1 |
| `line` / `edge` | `#1E2126` / `#2F343B` | decorative / control boundary |

Going dark made the accent far more useful. On the previous ivory scheme the rose
was 3.20:1 and could only ever be decoration; amber at 10.58:1 carries text,
fills buttons, and marks the step numerals. `edge` exists separately from `line`
because a control boundary needs 3:1 under 1.4.11 and a divider does not.

Amber is warm on purpose. A memorial page wants candlelight, not a cool neon
dashboard — and cool-neon-on-dark is also the single most recognisable
generated-site look there is.

**Type.** Sora at weight 200–300 with tight tracking for headlines: geometric and
precise rather than traditional. Manrope for body. **JetBrains Mono for
micro-labels, step numerals and timecodes** — a monospaced letterspaced caption
is doing most of the work of making the page feel engineered, and it costs
nothing.

Sora ships no italic, so nothing on the site is italic. A synthesised slant looks
broken at large sizes; weight and colour carry the emphasis instead.

**Texture.** Fixed film grain at 5%, **screen**-blended. On a light page grain
darkens; on a near-black one it has to lighten or it does nothing. Kept because
deep flat fills band badly on cheap panels.

**Light.** One radial amber bloom, behind the closing headline. The only gradient
on the site, and it means something: a light left on.

**Photography carries the page.** The hero runs full-bleed and tall, fading to
the page black at top and bottom so it dissolves into the sections rather than
stopping at a line. Examples are large portraits — at 88px an animal is a smudge.
The featured photograph is square, because it is functionally cover art and
because a 4:5 portrait left a dead block of background beside the player.

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

   They are graded for a near-black page: saturation back, contrast pushed,
   midpoint dropped so shadows join the background, warm highlight, and a
   vignette so each photograph falls off into the page instead of ending at a
   hard rectangle. `/projects/sandbox/regrade.py` does this. Grading is **not**
   idempotent — always run it against a clean checkout of `public/photos`.

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
