import { TESTIMONIALS, TESTIMONIALS_ARE_PLACEHOLDER } from "@/lib/content";

/** Three quotes, large serif, hairlines between. No cards. */
export default function Testimonials() {
  return (
    <section className="band">
      <div className="shell">
        {TESTIMONIALS_ARE_PLACEHOLDER && (
          <div
            role="note"
            className="mx-auto mb-14 max-w-2xl border border-dashed border-edge px-5 py-4 font-mono text-[0.75rem] leading-relaxed text-low"
          >
            BUILD NOTE — these quotes are placeholders. Publishing invented
            reviews breaks the FTC rule on consumer testimonials. Replace them
            with real messages you have written permission to quote, then set
            TESTIMONIALS_ARE_PLACEHOLDER to false in lib/content.ts. This notice
            is not hidden behind an environment check on purpose: that would ship
            fabricated quotes to production with nothing to warn you.
          </div>
        )}

        <div className="mx-auto max-w-3xl">
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
