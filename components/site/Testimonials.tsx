import { TESTIMONIALS } from "@/lib/content";

/**
 * Renders nothing while `TESTIMONIALS` is empty, which it is until there are
 * real ones. Add a quote to `lib/content.ts` and this section appears on the
 * page by itself — no wiring, no placeholder to remember to delete, and no
 * invented reviews sitting in production waiting to be noticed.
 */
export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="border-t border-line band">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="label">
            From families
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              data-reveal
              data-reveal-delay={String(i * 90)}
              className="border-t border-line py-11 last:border-b sm:py-14"
            >
              <blockquote className="font-display text-[clamp(1.3rem,2.5vw,1.75rem)] font-extralight leading-[1.38] tracking-[-0.02em] text-hi">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="label mt-6">
                {t.name} — {t.detail}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
