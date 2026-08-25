"use client";

import { useRef } from "react";
import { gsap, useGSAP, DESKTOP_MOTION } from "@/lib/gsap";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import { REACTIONS, REACTIONS_ARE_PLACEHOLDER } from "@/lib/data";

/**
 * Three columns drifting at slightly different speeds.
 *
 * Column-level parallax rather than per-card, so the effect reads as depth
 * instead of noise. Desktop only — parallax on a phone just costs frames.
 */
export default function Reactions() {
  const ref = useRef<HTMLDivElement>(null);

  const columns = [
    REACTIONS.filter((_, i) => i % 3 === 0),
    REACTIONS.filter((_, i) => i % 3 === 1),
    REACTIONS.filter((_, i) => i % 3 === 2),
  ];

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const cols = el.querySelectorAll<HTMLElement>("[data-col]");
        const offsets = [0, -58, -26];

        cols.forEach((col, i) => {
          gsap.to(col, {
            y: offsets[i] ?? 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section className="bg-paper-deep py-24 md:py-32">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-clay" />
            What comes back
          </p>
          <SplitReveal as="h2" className="mt-6 text-h2">
            People tend to write to us the same day.
          </SplitReveal>
        </div>

        {REACTIONS_ARE_PLACEHOLDER && (
          <div
            role="note"
            className="mt-10 rounded-[3px] border border-clay/40 bg-clay/[0.07] px-5 py-4 text-[0.875rem] leading-relaxed text-ink"
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

        <div ref={ref} className="mt-14 grid gap-6 md:grid-cols-3 md:gap-7">
          {columns.map((col, ci) => (
            <div key={ci} data-col className="flex flex-col gap-6 md:gap-7">
              {col.map((r, i) => (
                <Reveal key={i} delay={i * 0.08} start="top 92%">
                  <figure className="rounded-[3px] border border-rule bg-paper px-6 py-7">
                    <blockquote className="wonk font-display text-[1.1875rem] leading-[1.42] text-ink">
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-2.5 border-t border-rule-soft pt-4 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-faint">
                      <span
                        className="inline-block size-[3px] rounded-full bg-clay"
                        aria-hidden="true"
                      />
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
