"use client";

import { useState } from "react";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import { PlusIcon } from "@/components/ui/icons";
import { FAQS } from "@/lib/data";

/**
 * Accordion on hairline rules.
 *
 * Height animates via the `grid-template-rows: 0fr → 1fr` trick rather than a
 * measured max-height — it handles variable content, needs no JS measurement,
 * and the global reduced-motion rule flattens it automatically.
 */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-clay" />
              Questions
            </p>
            <SplitReveal as="h2" className="mt-6 text-h2">
              The things people ask first.
            </SplitReveal>
          </div>

          <Reveal start="top 88%">
            <dl className="border-t border-rule">
              {FAQS.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <div key={faq.q} className="border-b border-rule">
                    <dt>
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span className="text-h3 font-display text-ink transition-colors duration-300 group-hover:text-clay">
                          {faq.q}
                        </span>
                        <span
                          className={[
                            "mt-1 shrink-0 text-clay transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            isOpen ? "rotate-45" : "rotate-0",
                          ].join(" ")}
                        >
                          <PlusIcon className="size-4" />
                        </span>
                      </button>
                    </dt>
                    <dd
                      id={`faq-panel-${i}`}
                      className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                      }}
                    >
                      <div className="overflow-hidden">
                        <p
                          className={[
                            "max-w-2xl pb-7 pr-10 text-[1rem] leading-relaxed text-ink-soft transition-opacity duration-500",
                            isOpen ? "opacity-100" : "opacity-0",
                          ].join(" ")}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
