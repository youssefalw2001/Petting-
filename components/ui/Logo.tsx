/**
 * Sunbeam Records identity.
 *
 * One idea, executed once: a record is a circle with a hole in it, and a sun is
 * a circle with rays coming off it. They're the same shape. The mark is that
 * overlap — a record with sunbeams — and the wordmark is Fraunces with the
 * tracking pulled in. No second concept, no gradient, no AI logo generator.
 */

const RAYS = 12;

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* sunbeams */}
      <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
        {Array.from({ length: RAYS }, (_, i) => {
          const angle = (i / RAYS) * Math.PI * 2 - Math.PI / 2;
          const inner = 16.6;
          const outer = i % 2 === 0 ? 21.4 : 19.2;
          return (
            <line
              key={i}
              x1={24 + Math.cos(angle) * inner}
              y1={24 + Math.sin(angle) * inner}
              x2={24 + Math.cos(angle) * outer}
              y2={24 + Math.sin(angle) * outer}
            />
          );
        })}
      </g>
      {/* record edge */}
      <circle cx="24" cy="24" r="13.1" stroke="currentColor" strokeWidth={1.4} />
      {/* grooves */}
      <circle
        cx="24"
        cy="24"
        r="9.4"
        stroke="currentColor"
        strokeWidth={0.7}
        opacity={0.5}
      />
      <circle
        cx="24"
        cy="24"
        r="6.2"
        stroke="currentColor"
        strokeWidth={0.7}
        opacity={0.32}
      />
      {/* spindle hole */}
      <circle cx="24" cy="24" r="1.9" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({
  className = "",
  showRecords = true,
}: {
  className?: string;
  showRecords?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-7 w-7 shrink-0 text-clay" />
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.28rem] leading-none tracking-[-0.035em] text-ink"
          style={{ fontVariationSettings: '"SOFT" 30, "WONK" 1, "opsz" 40' }}
        >
          Sunbeam
        </span>
        {showRecords && (
          <span className="mt-[0.22em] text-[0.5rem] font-medium uppercase leading-none tracking-[0.34em] text-ink-faint">
            Records
          </span>
        )}
      </span>
    </span>
  );
}

export function WordmarkStacked({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <LogoMark className="h-12 w-12 text-clay" />
      <span className="flex flex-col items-center leading-none">
        <span
          className="font-display text-[1.75rem] leading-none tracking-[-0.035em] text-ink"
          style={{ fontVariationSettings: '"SOFT" 30, "WONK" 1, "opsz" 48' }}
        >
          Sunbeam
        </span>
        <span className="mt-1.5 text-[0.5625rem] font-medium uppercase leading-none tracking-[0.4em] text-ink-faint">
          Records
        </span>
      </span>
    </span>
  );
}
