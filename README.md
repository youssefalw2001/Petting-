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

Five effects, all transform/opacity, still with **no animation library**:

- **Reveal** — one IntersectionObserver in the layout drives every
  `[data-reveal]` element. No section owns animation code.
- **Headline lines** — `<Lines>` rises each line from behind its own mask. Lines
  are declared, not measured, so there's no splitting library and no reflow risk.
  Server-rendered, zero client JS.
- **Hero settle** — the photograph eases from a slight scale once on load.
- **Parallax** — one passive scroll listener coalesced into a single rAF writing
  one `translate3d`. Off under reduced motion and off below 768px.
- **Playing bars** — the only looping animation, and it exists only while audio
  is playing. Verified: `document.getAnimations()` reports 0 looping at rest, 3
  during playback, 0 again on pause.

All of it is CSS transitions and keyframes, so `prefers-reduced-motion` disables
everything without a single JavaScript branch.

## The Create flow

`/create` — ten fields across eight steps, declared in `lib/questions.ts`.
Ordered so it feels like telling someone about your pet: who they were, then the
memories, then the practical details.

Only three things are required — their name, one memory, and an email. Someone
writing this two days after losing their dog shouldn't be blocked by a validation
error about music genre.

Static export means no server, so the order posts straight from the browser to
**Web3Forms**, which emails it to you. 250 submissions a month, free, no account.

Get a key at [web3forms.com](https://web3forms.com) — enter your email and they
send it back. Then set it in the deploy workflow (or `.env.local` locally):

```bash
NEXT_PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
NEXT_PUBLIC_WEB3FORMS_KEY=your-access-key
```

The key is a public form ID, not a secret — it only permits sending mail to the
address it was created for, so it's safe to commit.

**Reply-to is wired.** The customer's address is sent as `email`, which
Web3Forms uses as the reply-to, so hitting reply on the notification reaches them
directly. That's how you ask for the photographs.

**The request is always JSON, never multipart.** An earlier version switched to
multipart when photos were chosen so attachments could ride along, but
`attachment` is a Web3Forms PRO feature — on the free plan that request can fail,
and a failure here drops the customer onto the copy-and-paste fallback instead of
quietly emailing you their story. Delivering the words reliably matters much more
than carrying the images, so photographs are collected by reply and the flow says
so.

Response handling checks `success` in the body as well as the HTTP status, since
a 200 can still carry `success: false`.

**With no key configured it still works** — the flow falls back to a formatted
summary with a copy button and a mailto link, and still offers payment. Nobody's
answers are lost to a missing env var or a failed request.

## Taking payments

There is no server — this is a static export — so there is nowhere to run
Stripe's server SDK, create a Checkout Session, or receive a webhook. The
approach that actually fits is a **Stripe Payment Link**: Stripe hosts the whole
checkout, handles cards, wallets, receipts and PCI scope, and the site only ever
links to it.

### Setup, once

1. **Create a Stripe account** at [stripe.com](https://stripe.com) and complete
   the activation steps. You can do this as an individual — a company isn't
   required in most countries.
2. **Product catalogue → Add product.** Name it (e.g. "A song for your pet"),
   set a **one-time** price of $59, save.
3. **Payment Links → Create link**, choose that product, and under *After
   payment* set a confirmation message such as: *"Thank you. We're writing their
   song now — you'll hear from us within 48 hours."*
4. Copy the link. It looks like `https://buy.stripe.com/xxxxxxxx`.
5. Add it to the deploy workflow (`.github/workflows/deploy.yml`) next to the
   existing base-path variable:

```yaml
env:
  NEXT_PUBLIC_BASE_PATH: /Petting-
  NEXT_PUBLIC_STRIPE_LINK: https://buy.stripe.com/xxxxxxxx
  NEXT_PUBLIC_PRICE: "$59"
```

Locally, put the same two lines in `.env.local`.

These are safe to commit. A Payment Link URL is public by design — it's the same
thing you'd paste into an Instagram bio. **Never** put a secret key
(`sk_live_…`) in this repo; nothing here needs one.

### How an order is matched to a pet

The flow captures the story **before** asking for money, so nothing is written
unpaid and the email is captured even if payment is abandoned — which makes a
follow-up possible.

On submit the site generates a short opaque reference (`TWR-XXXXXX`), shows it to
the customer, includes it in the emailed story, and appends it to the Payment
Link as [`client_reference_id`](https://docs.stripe.com/payment-links/url-parameters).
Stripe displays that value on the payment, so matching a payment to a story is
just reading the code. No backend required.

The reference is deliberately random rather than derived from a name or email:
Stripe's own guidance is to keep nothing sensitive in that parameter, because
links can end up in unexpected places.

### Without a link configured

`PAYMENTS_LIVE` is false, no payment button renders, and the flow ends on
"nothing has been charged". Nothing breaks and nothing half-works.

### Worth knowing

- Stripe's standard rate is **2.9% + 30¢** per successful card charge in the US,
  so about **$2.01** on $59 — you keep roughly **$56.99**. Verify current pricing
  for your country.
- Set a **statement descriptor** in Settings → Business → Public details.
  Something like `TAILSWEREMEMBER`. If a charge shows up on a card statement as
  an unrecognisable string, people dispute it — and a dispute costs more than the
  order was worth.
- Payouts arrive on a rolling schedule once your account is activated.
- Turn on **Stripe Tax** if you need VAT or sales tax handled.
- Test with a card in test mode first: `4242 4242 4242 4242`, any future expiry,
  any CVC. Use your test-mode Payment Link for that, then swap to the live one.

### When you outgrow it

The moment you want card details collected on your own page, tiers priced
dynamically, or automatic fulfilment on payment, you need a server — a single
serverless function is enough. That means moving the site from GitHub Pages to
Vercel, which is a deploy change rather than a rewrite.

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
2. **Testimonials.** `TESTIMONIALS` is an empty array and `<Testimonials />`
   renders nothing. Add real quotes with written permission and the section
   appears on the page by itself.

   It's empty rather than filled with invented quotes because fabricating
   consumer testimonials is prohibited outright by the FTC rule on reviews and
   is treated by payment processors as grounds for termination. `<Promise />`
   holds that ground in the meantime with four commitments that are actually
   true. The fastest honest route to real quotes is the free-song giveaway.
3. **Songs.** `public/songs/*.mp3` are four real ACE-Step generations, 40–55
   seconds, with hand-written lyrics — no longer the twelve-second synthesised
   tones. The briefs live in [Song23](https://github.com/youssefalw2001/Song23) at
   `src/scripts/site-examples.ts`, which is where you regenerate them. Each is a
   deliberately different arrangement — fingerpicked steel-string, gospel-soul
   Hammond, resonator slide blues, and pedal steel with the only drums of the four
   — because four ballads at one tempo would imply the service fills in a template.

   Milo and Luna were replaced once. The originals had a metallic ring that read
   as machine-made, and the cause was the prompt: one asked for a "wide warm room"
   (reverb, spelled out) and the other for "hushed close harmonies" (a doubled
   vocal, which phases). Captions now say `dry, close-miked, no reverb, no echo,
   single tracked vocal, no harmonies` explicitly. **If a generated vocal ever
   sounds artificial, look for space and layering in the caption before blaming
   the model.**

   The player still says they are demonstrations, and **that notice stays until
   real customers' songs replace them, with written permission.** Being
   AI-generated is not what would make it dishonest; claiming a song belonged to
   a family who never sent it in would be.
4. **Price.** Stated twice — under the how-it-works steps and beneath the
   closing CTA — and driven by `NEXT_PUBLIC_PRICE` so it can't drift out of sync
   with what Stripe charges. Still no pricing *section*: a memorial page
   shouldn't read as a store.
5. **Payment.** Wired — see "Taking payments" above. It needs one environment
   variable and no code.
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
