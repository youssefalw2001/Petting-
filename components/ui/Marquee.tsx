"use client";

/**
 * Slow infinite drift of real pet names.
 *
 * Pure CSS animation, no JS loop: the global reduced-motion rule already
 * neutralises CSS animations, so this stops moving for those users for free.
 * Doubles as social proof without a testimonial carousel.
 */
export default function Marquee({
  items,
  speed = 64,
  className = "",
}: {
  items: string[];
  /** Seconds for one full pass */
  speed?: number;
  className?: string;
}) {
  const track = (
    <ul className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((name, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="font-display text-[1.375rem] text-ink/45 md:text-[1.625rem]">
            {name}
          </span>
          <span
            className="mx-6 inline-block size-[3px] rounded-full bg-clay/50 md:mx-8"
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`relative flex overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      {/* Screen readers get the list once, plainly */}
      <span className="sr-only">
        Songs pressed for {items.join(", ")} and many more.
      </span>
      <div
        className="marquee-track flex"
        style={{ animationDuration: `${speed}s` }}
      >
        {track}
        {track}
      </div>
    </div>
  );
}
