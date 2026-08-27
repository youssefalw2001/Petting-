import { PROMISES } from "@/lib/content";

/**
 * Stands where testimonials would go, until there are real ones.
 *
 * A brand with no customers has no quotes, but it does have commitments — and a
 * plainly stated commitment is a stronger trust signal than an invented review,
 * because a reader can check it against what actually happens next.
 */
export default function Promise() {
  return (
    <section className="border-t border-line bg-surface band">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="label">
            Our promise
          </p>
          <h2
            data-reveal
            data-reveal-delay="70"
            className="mt-7 text-section font-extralight"
          >
            No templates.
            <br className="hidden sm:block" />{" "}
            <span className="text-amber">No two songs alike.</span>
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-x-12 sm:grid-cols-2">
          {PROMISES.map((p, i) => (
            <div
              key={p.n}
              data-reveal
              data-reveal-delay={String(i * 80)}
              className="border-t border-line py-8 sm:py-9"
            >
              <span className="mono text-[0.8125rem] text-amber">{p.n}</span>
              <h3 className="mt-4 font-display text-[1.25rem] font-light leading-snug">
                {p.title}
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-low">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
