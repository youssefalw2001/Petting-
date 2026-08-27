/**
 * A headline whose lines rise in sequence.
 *
 * Lines are declared explicitly rather than measured, so there's no splitting
 * library, no re-measuring on resize, and no risk of a line breaking mid-word on
 * first paint. Each line is masked by its own overflow-hidden wrapper, which is
 * what makes it read as the text emerging rather than sliding.
 *
 * Server-rendered — no client JavaScript. The rise is CSS driven by the same
 * `[data-reveal]` observer as everything else, so reduced-motion disables it for
 * free.
 */
export default function Lines({
  lines,
  className = "",
  as: Tag = "h2",
  delay = 0,
  step = 90,
}: {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  step?: number;
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <span
            data-reveal
            data-reveal-delay={String(delay + i * step)}
            className="block"
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
