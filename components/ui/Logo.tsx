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

const TAIL =
  "M15 42C15 30 15 18 21 11.5 26 6 33.5 8 33.5 15 33.5 20.5 28 22.5 25 19.5";

export function TailMark({ className = "" }: { className?: string }) {
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
        strokeWidth={6}
        strokeLinecap="round"
      />
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
