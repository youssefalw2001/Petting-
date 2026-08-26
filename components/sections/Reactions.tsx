import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import { REACTIONS, REACTIONS_ARE_PLACEHOLDER } from "@/lib/data";

/**
 * Three columns of quotes.
 *
 * The column-level parallax drift is gone. On a page that already reveals
 * every block on scroll, a second scroll-linked motion on the same content
 * read as drift rather than depth — and it was the third scroll-driven
 * behaviour competing for the same gesture.
 */
export default function Reactions() {
  const columns = [
    REACTIONS.filter((_, i) => i % 3 === 0),
    REACTIONS.filter((_, i) => i % 3 === 1),
    REACTIONS.filter((_, i) => i % 3 === 2),
  ];

  return (
    <section className="bg-paper-deep py-24 md:py-32">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow">What comes back</p>
          <SplitReveal as="h2" className="mt-6 text-h2">
            People tend to write to us the same day.
          </SplitReveal>
        </div>

        {REACTIONS_ARE_PLACEHOLDER && (
          /* Styled as a build artifact, not page content. It was previously a
             clay-bordered card, which made a note addressed to a developer the
             loudest element in the section. Deliberately NOT hidden behind an
             env check: that would ship invented reviews to production with no
             warning at all, which is the outcome the guard exists to prevent. */
          <div
            role="note"
            className="mt-10 border-y border-dashed border-ink/25 py-3 font-mono text-[0.75rem] leading-relaxed text-ink-soft"
          >
            <strong className="font-medium">
              Placeholder testimonials — replace before launch.
            </strong>{" "}
            Publishing invented reviews breaks the FTC rule on consumer reviews
            and testimonials, and it&rsquo;s the fastest way to lose a payment
            processor. Swap in real messages you have permission to quote, then
            set <code className="font-mono text-[0.8em]">REACTIONS_ARE_PLACEHOLDER</code>{" "}
            to <code className="font-mono text-[0.8em]">false</code> in{" "}
            <code className="font-mono text-[0.8em]">lib/data.ts</code> to hide
            this notice.
          </div>
        )}

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-7">
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-6 md:gap-7">
              {col.map((r, i) => (
                <Reveal key={i} delay={i * 0.08} start="top 92%">
                  {/* Open on a hairline instead of boxed in a bordered card.
                      A quote and a pricing tier were previously the same
                      object; now the eye can tell them apart without reading. */}
                  <figure className="border-t border-rule pt-6">
                    <blockquote className="wonk font-display text-[1.1875rem] leading-[1.42] text-ink">
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-faint">
                      {r.name} · {r.detail}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
