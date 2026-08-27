"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, DESKTOP_MOTION } from "@/lib/gsap";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import { TRANSFORMATIONS } from "@/lib/data";

/**
 * What they typed, next to the line it became.
 *
 * Laid out like a proof sheet: the raw answer set in a plain form field on the
 * left, the finished lyric set in the display serif on the right, a hairline
 * running between them. The connector draws in on scroll — the one bit of
 * motion here that carries meaning rather than decoration, since the whole
 * point of the section is "this turns into that".
 */
export default function AnswersToLyrics() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      // Connector lines draw from the answer toward the lyric.
      mm.add(MOTION_OK, () => {
        el.querySelectorAll<HTMLElement>("[data-connector]").forEach((line) => {
          gsap.from(line, {
            scaleX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: line, start: "top 88%", once: true },
          });
        });
      });

      // Desktop only: lyrics drift up very slightly slower than the answers,
      // so the pairs feel connected but not locked together.
      mm.add(DESKTOP_MOTION, () => {
        el.querySelectorAll<HTMLElement>("[data-lyric]").forEach((lyric) => {
          gsap.to(lyric, {
            y: -14,
            ease: "none",
            scrollTrigger: {
              trigger: lyric,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section className="border-y border-rule bg-paper py-24 md:py-32">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-clay" />
            From the form to the song
          </p>
          <SplitReveal as="h2" className="mt-6 text-h2">
            We don&rsquo;t drop their name into a template.
          </SplitReveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lede text-ink-soft">
              Here&rsquo;s what four people typed into the questions, and the
              lines those answers turned into.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="mt-16 flex flex-col">
          {TRANSFORMATIONS.map((t, i) => (
            <div
              key={i}
              className="grid items-center gap-6 border-t border-rule py-10 md:grid-cols-[1fr_auto_1fr] md:gap-8 md:py-12"
            >
              {/* what they wrote */}
              <Reveal start="top 88%">
                <p className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ink-faint">
                  {t.question}
                </p>
                <p className="mt-3 rounded-[2px] border border-rule-soft bg-paper-deep/60 px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {t.answer}
                </p>
              </Reveal>

              {/* connector */}
              <div
                aria-hidden="true"
                className="flex items-center justify-center md:px-2"
              >
                <span
                  data-connector
                  className="block h-px w-16 origin-left bg-clay/60 md:w-12"
                />
                <span className="ml-1.5 block size-[5px] shrink-0 rotate-45 border-r border-t border-clay" />
              </div>

              {/* what it became */}
              <Reveal start="top 88%" delay={0.12}>
                <div data-lyric>
                  <p className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-clay">
                    In the song
                  </p>
                  <blockquote
                    className="wonk mt-3 font-display text-[clamp(1.25rem,2.1vw,1.6rem)] leading-[1.32] text-ink"
                    style={{ textWrap: "pretty" }}
                  >
                    {t.lyric.map((line, li) => (
                      <span key={li} className="block">
                        {line}
                      </span>
                    ))}
                  </blockquote>
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal start="top 92%">
          <p className="mt-10 border-t border-rule pt-8 text-[0.9375rem] text-ink-faint">
            Thirteen questions. About five minutes. A real person reads every
            answer.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
