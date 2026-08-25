"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Mode = "rise" | "unmask";

/**
 * Scroll reveal for blocks and imagery.
 *
 * `rise`   — gentle lift + fade. For text blocks, cards, list items.
 * `unmask` — clip-path wipe upward with a slow settle from 1.06 scale.
 *            For photography. Never bounces; overshoot reads as playful and
 *            this product is not playful.
 */
export default function Reveal({
  children,
  className = "",
  mode = "rise",
  delay = 0,
  stagger = 0,
  start = "top 85%",
}: {
  children: ReactNode;
  className?: string;
  mode?: Mode;
  delay?: number;
  /** When set, direct children stagger in instead of the wrapper animating. */
  stagger?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const targets: Element[] | Element =
          stagger > 0 ? Array.from(el.children) : el;

        gsap.set(el, { autoAlpha: 1 });

        if (mode === "unmask") {
          gsap.from(targets, {
            clipPath: "inset(100% 0% 0% 0%)",
            scale: 1.06,
            duration: 1.4,
            ease: "power3.out",
            delay,
            stagger,
            scrollTrigger: { trigger: el, start, once: true },
          });
        } else {
          gsap.from(targets, {
            y: 34,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            delay,
            stagger,
            scrollTrigger: { trigger: el, start, once: true },
          });
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { autoAlpha: 1 });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`pre-reveal ${className}`}>
      {children}
    </div>
  );
}
