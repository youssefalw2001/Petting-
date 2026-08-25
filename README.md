# Sunbeam Records

Marketing site for a pet tribute song service — an original song about someone's
dog or cat, written from their memories and delivered in 48 hours.

The whole design is built on one idea: **it's a record label, not a SaaS product.**
Record sleeves, centre labels, catalogue numbers, Side A. That framing is what
makes the printed keepsake tier make sense, and it's why nothing here looks
machine-generated.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| Styling | Tailwind v4, CSS-first `@theme` with fully custom tokens |
| Animation | GSAP 3 + `@gsap/react` · ScrollTrigger · SplitText |
| Smooth scroll | [Lenis](https://github.com/darkroomengineering/lenis) |
| Fonts | Fraunces + Instrument Sans, self-hosted via `next/font` |
| Components | Hand-built. No component library — see below. |

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Design rules

Deliberate constraints, not preferences. AI-built sites converge on the same
visual defaults, and users read that as untrustworthy before they read a word.

**Never:** purple/indigo gradients · Inter · glassmorphism · glowing borders ·
bento grids · emoji icons · dark mode with neon · pure `#000`/`#FFF` ·
`rounded-2xl` everywhere · shadcn/Aceternity/Magic UI components.

**Always:** warm paper base · ink-brown text · one clay accent · editorial serif
display at **weight 400** (bold reads cheap) · asymmetric layout · visible SVG
paper grain · hairline rules · 2–4px corner radius.

Palette and type live in `app/globals.css` under `@theme`. Change them there and
the whole site follows.

## Motion

Durations 0.8–1.4s, `power3.out`. **Nothing bouncy or elastic** — playful easing
is the wrong emotional register for a grief product.

Every animation is wrapped in `gsap.matchMedia()` with a
`prefers-reduced-motion` branch, and only `transform`/`opacity` are animated.
Pinning-style effects and the follower cursor are desktop-only, since both cost
frames on a phone for no benefit.

- `SplitReveal` — masked line-by-line headline reveals. Uses `autoSplit` so lines
  re-split when webfonts land instead of breaking in the wrong place.
- `ScrubWaveform` — a waveform that fills as you scroll. Two stacked SVGs with the
  clay layer's `clip-path` scrubbed, so there are zero React re-renders.
- `MiniPlayer` — docks on first play and persists. A conversion feature: nobody
  buys a song they stopped hearing while scrolling to the pricing.
- `HowItWorks` — native `position: sticky`, not a ScrollTrigger pin. Pinning
  injects a layout spacer that fights Lenis on resize and has to be switched off
  on mobile anyway; sticky survives both and needs no refresh handling.

Elements that GSAP reveals carry `.pre-reveal`, which only hides them when the
`js` class is present on `<html>` (set by a blocking inline script in the head).
With JS off, everything renders normally rather than leaving a blank page.

## Before this goes live

1. **Replace the testimonials.** `REACTIONS` in `lib/data.ts` is placeholder copy
   and the site renders a visible warning while `REACTIONS_ARE_PLACEHOLDER` is
   `true`. Publishing invented reviews breaks the FTC rule on consumer reviews and
   testimonials, and it's the fastest way to lose a payment processor.
2. **Swap in the real songs.** `public/samples/*.wav` are synthesised placeholders
   from `scripts/make-placeholder-audio.py`. Drop in real MP3s, update `src` in
   `lib/data.ts`, then delete the script and the WAVs.
3. **Swap in real sleeve photography.** `public/placeholders/sleeve-*.svg` are
   stand-ins. Real photos of real animals will do more for conversion than any
   animation on this page.
4. **Wire up checkout.** Every pricing `href` is `#`. Point them at Stripe Payment
   Links — no backend needed to launch.
5. **Point the intake form** at a Tally or Typeform using the thirteen questions
   from the playbook.
6. **Confirm commercial rights** on whatever tool generates the music. On Suno you
   must be on a paid plan *at the time the song is created*; subscribing later does
   not retroactively license anything you already made.
7. Update `SITE` in `app/layout.tsx` and the email in `components/sections/Footer.tsx`.

## Layout

```
app/
  layout.tsx        fonts, metadata, providers, grain
  page.tsx          section order
  globals.css       design tokens + custom utilities
components/
  audio/            AudioProvider (one shared <audio>), MiniPlayer
  providers/        SmoothScroll (Lenis ⇄ ScrollTrigger sync)
  sections/         the eleven page sections
  ui/               Logo, Button, RecordSleeve, Waveform, SplitReveal, Reveal, …
lib/
  data.ts           all copy, pricing, FAQ, tracks
  gsap.ts           single plugin registration point
  waveform.ts       deterministic bar heights (SSR-safe)
```

Content lives in `lib/data.ts`. Editing copy shouldn't mean touching components.
