/**
 * Tails We Remember — logo lockup.
 *
 * Previously the nav was the name as plain text with no mark, which is why it
 * didn't read as a logo at all. The tail is back beside it, in amber, at a size
 * that holds its own.
 *
 * The mark is a single curling tail. It got there by elimination: an earlier
 * version put the tail on a record disc, and a circle with anything leaving its
 * upper right renders as the ♂ glyph at nav size — verified by rendering it at
 * 96 / 48 / 32 / 24 / 18px. The disc was the problem, so the disc went.
 */

/**
 * Filled and tapered — thick at the base, narrowing to a curled point.
 *
 * The stroked version read as a thin hook, indistinguishable from a lowercase p
 * at nav size. Rendering both at 48 / 22 / 16px side by side made it obvious: a
 * uniform stroke has no mass, so it reads as a glyph. Giving the base weight and
 * the tip a point is what makes it read as a tail.
 */
const TAIL =
  "M13.2 43C13.2 31 12.6 19.4 19.2 11.6 25.2 4.4 36.4 6.6 36.4 15.6 36.4 22.2 30.4 26 26 23.2 28.8 24 32.4 21.4 32.6 16.2 32.8 10.2 25.6 8.8 22.4 14.4 18.8 20.8 20.8 31.4 20.8 43Z";

export function TailMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={TAIL} fill="currentColor" />
    </svg>
  );
}

/** Nav lockup: mark plus name on one line. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <TailMark className="h-[1.9rem] w-[1.9rem] shrink-0 text-amber" />
      <span className="font-display text-[1.125rem] font-normal leading-none tracking-[-0.03em] text-hi sm:text-[1.25rem]">
        Tails<span className="text-low">We</span>Remember
      </span>
    </span>
  );
}

/** Stacked lockup for the footer, at a size where it reads as a signature. */
export function LogoStacked({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center gap-5 ${className}`}>
      <TailMark className="h-11 w-11 text-amber" />
      <span className="font-display text-[1.5rem] font-light leading-none tracking-[-0.035em] text-hi sm:text-[1.75rem]">
        Tails<span className="text-low">We</span>Remember
      </span>
    </span>
  );
}
