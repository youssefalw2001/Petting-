/**
 * Three bars that move while a song plays.
 *
 * The only looping animation on the site, and it's justified: it runs solely
 * while audio is actually playing, and it communicates state rather than
 * decorating. Pure CSS, so reduced-motion flattens it automatically.
 */
export default function PlayingBars({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-end gap-[2px] ${className}`}
      aria-hidden="true"
    >
      <span className="eq-bar h-2 w-[2px] bg-current" />
      <span className="eq-bar eq-2 h-3 w-[2px] bg-current" />
      <span className="eq-bar eq-3 h-[0.4rem] w-[2px] bg-current" />
    </span>
  );
}
