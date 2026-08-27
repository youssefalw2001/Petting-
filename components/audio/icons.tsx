/** Two icons, one weight. No icon library, no emoji. */

export function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 14" className={className} fill="currentColor" aria-hidden="true">
      <path d="M0 1.2A1.2 1.2 0 011.85.19l9.2 5.8a1.2 1.2 0 010 2.02l-9.2 5.8A1.2 1.2 0 010 12.8V1.2z" />
    </svg>
  );
}

export function PauseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 14" className={className} fill="currentColor" aria-hidden="true">
      <rect x="0.5" width="3.4" height="14" rx="0.6" />
      <rect x="8.1" width="3.4" height="14" rx="0.6" />
    </svg>
  );
}
