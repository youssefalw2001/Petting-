/**
 * Hand-drawn icon set. Deliberately tiny — six icons, one stroke weight.
 *
 * No icon library, and no emoji: emoji feature icons are one of the loudest
 * tells of a generated site.
 */
type IconProps = { className?: string };

export function PlayIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 12 14" className={className} fill="currentColor" aria-hidden="true">
      <path d="M0 1.2A1.2 1.2 0 011.85.19l9.2 5.8a1.2 1.2 0 010 2.02l-9.2 5.8A1.2 1.2 0 010 12.8V1.2z" />
    </svg>
  );
}

export function PauseIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 12 14" className={className} fill="currentColor" aria-hidden="true">
      <rect x="0.5" width="3.5" height="14" rx="0.6" />
      <rect x="8" width="3.5" height="14" rx="0.6" />
    </svg>
  );
}

export function ArrowIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M2 8h12m-4.5-4.5L14 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M8 2.5v11M2.5 8h11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path
        d="M3 8.5l3.2 3.2L13 4.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScrollHintIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 12 20" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 0v16m-4-4l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
