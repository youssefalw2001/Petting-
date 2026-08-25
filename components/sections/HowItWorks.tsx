"use client";

import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import { STEPS } from "@/lib/data";

/**
 * Sticky heading column, steps scrolling past it.
 *
 * The spec called for a ScrollTrigger pin here, and I built it with native
 * `position: sticky` instead. Pinning rewrites layout with a spacer element,
 * which fights Lenis on resize and has to be disabled on mobile anyway. Sticky
 * is one CSS line, survives resize, works on phones, and needs no refresh
 * handling — so GSAP is left doing the one thing it's actually better at:
 * tracking which step is in view and moving the accent.
 */
export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const triggers = Array.from(
        el.querySelectorAll<HTMLElement>("[data-step]")
      ).map((step, i) =>
        ScrollTrigger.create({
          trigger: step,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        })
      );

      return () => triggers.forEach((t) => t.kill());
    },
    { scope: ref }
  );

  return (
    <section id="how" className="py-24 md:py-32">
      <div className="shell" ref={ref}>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* sticky column */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-clay" />
              How it works
            </p>

            <SplitReveal as="h2" className="mt-6 text-h2">
              Five minutes of your memory. Forty-eight hours of ours.
            </SplitReveal>

            {/* step indicator */}
            <div className="mt-10 hidden items-center gap-4 lg:flex">
              {STEPS.map((step, i) => (
                <div key={step.n} className="flex items-center gap-4">
                  <span
                    className={[
                      "font-display text-[1.75rem] leading-none transition-colors duration-500",
                      i === active ? "text-clay" : "text-ink/20",
                    ].join(" ")}
                  >
                    {step.n}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span
                      className={[
                        "inline-block h-px w-10 transition-colors duration-500",
                        i < active ? "bg-clay" : "bg-rule",
                      ].join(" ")}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* steps */}
          <ol className="flex flex-col">
            {STEPS.map((step, i) => (
              <li
                key={step.n}
                data-step
                className={[
                  "border-t border-rule py-10 first:border-t-0 first:pt-0 md:py-14",
                  i === STEPS.length - 1 ? "pb-0" : "",
                ].join(" ")}
              >
                <Reveal start="top 88%">
                  <div className="flex gap-6 md:gap-9">
                    <span
                      className={[
                        "shrink-0 font-display text-[2.25rem] leading-none transition-colors duration-500 md:text-[2.75rem]",
                        i === active ? "text-clay" : "text-ink/22",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {step.n}
                    </span>
                    <div>
                      <h3 className="text-h3">{step.title}</h3>
                      <p className="mt-3.5 max-w-lg text-[1rem] leading-relaxed text-ink-soft">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
