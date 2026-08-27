/**
 * Tails We Remember.
 *
 * The nav is the name, set in the display serif. No mark beside it — at this
 * scale a symbol next to elegant type is one thing too many, and the brief asks
 * for the brand name on the left, nothing more.
 *
 * The tail mark survives where a wordmark can't go: the favicon and the social
 * avatar. It's a single curling stroke, arrived at by elimination — the earlier
 * disc-and-tail version read as the ♂ glyph at nav size, verified by rendering
 * it at 96 / 48 / 32 / 24 / 18px.
 */

const TAIL =
  "M15 42C15 30 15 18 21 11.5 26 6 33.5 8 33.5 15 33.5 20.5 28 22.5 25 19.5";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-[1.3rem] font-normal leading-none tracking-[-0.01em] text-ink sm:text-[1.4rem] ${className}`}
    >
      Tails We Remember
    </span>
  );
}

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
        strokeWidth={4.6}
        strokeLinecap="round"
      />
    </svg>
  );
}
