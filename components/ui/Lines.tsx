/**
 * A headline that rises word by word, line by line.
 *
 * Lines are declared rather than measured, so there's no splitting library, no
 * re-measure on resize, and no chance of a line breaking mid-word on first
 * paint. Each line gets its own `overflow-hidden` wrapper, which is what makes
 * the words read as emerging from behind an edge rather than sliding around.
 *
 * Words carry their own stagger on top of the line's, so a two-line headline
 * arrives as a sequence instead of two blocks. Entirely server-rendered — the
 * shared IntersectionObserver adds `is-in` and CSS does the rest, so reduced
 * motion switches it off with no JavaScript branch.
 */
export default function Lines({
  lines,
  className = "",
  as: Tag = "h2",
  delay = 0,
  /** Between lines. */
  step = 110,
  /** Between words within a line. */
  wordStep = 55,
}: {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  step?: number;
  wordStep?: number;
}) {
  return (
    <Tag className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.1em]">
          {line.split(" ").map((word, wi) => (
            <span
              key={wi}
              data-reveal="word"
              data-reveal-delay={String(delay + li * step + wi * wordStep)}
              className="line-word"
            >
              {word}
              {wi < line.split(" ").length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
