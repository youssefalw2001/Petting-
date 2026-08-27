/**
 * Tails We Remember — identity.
 *
 * The mark is a single tail, curling up. Nothing else.
 *
 * It got there by elimination. The obvious idea was a pressed record with a
 * tail sweeping off it — two meanings in one shape, memory plus animal. Built
 * and tested at real sizes, it was unusable: a circle with anything leaving its
 * upper right is the ♂ glyph, and at 28px in a nav bar that is the only thing
 * anyone sees. Moving the tail to the top of the disc didn't help. The disc was
 * the problem, so the disc went.
 *
 * What's left is better anyway. The name is *Tails*, the record already lives
 * all over the site in the sleeve artwork, and one clean organic curve survives
 * being shrunk to a favicon in a way that a circle with grooves never would.
 *
 * Verified legible at 80 / 40 / 30 / 18px, reversed on ink, and filled for the
 * Instagram avatar.
 */

/**
 * Upright stem, curl at the tip — a cat sitting with its tail up.
 * Optically centred in the 48×48 box including the 5px stroke.
 */
const TAIL =
  "M15 42C15 30 15 18 21 11.5 26 6 33.5 8 33.5 15 33.5 20.5 28 22.5 25 19.5";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={TAIL}
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Reversed out of a filled disc — the Instagram avatar and the favicon.
 * A solid shape holds up at 32px in a comment thread where an outline thins out.
 */
export function LogoMonogram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="24" cy="24" r="24" fill="currentColor" />
      <g transform="translate(24 24) scale(0.66) translate(-24 -24)">
        <path
          d={TAIL}
          fill="none"
          stroke="var(--color-paper)"
          strokeWidth={5.6}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Horizontal lockup — nav, and anywhere on a single line. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-[1.75rem] w-[1.75rem] shrink-0 text-clay" />
      <span
        className="font-display text-[1.075rem] leading-none tracking-[-0.03em] text-ink sm:text-[1.15rem]"
        style={{ fontVariationSettings: '"SOFT" 30, "WONK" 1, "opsz" 40' }}
      >
        Tails We Remember
      </span>
    </span>
  );
}

/** Stacked lockup — footer and closing sections. */
export function WordmarkStacked({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <LogoMark className="h-12 w-12 text-clay" />
      <span
        className="flex flex-col items-center font-display text-[1.6rem] leading-[1.06] tracking-[-0.035em] text-ink"
        style={{ fontVariationSettings: '"SOFT" 30, "WONK" 1, "opsz" 48' }}
      >
        <span>Tails We</span>
        <span>Remember</span>
      </span>
    </span>
  );
}
