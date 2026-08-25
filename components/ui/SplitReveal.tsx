"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  /** ScrollTrigger start. Set `immediate` for above-the-fold headlines. */
  start?: string;
  immediate?: boolean;
};

/**
 * Masked line-by-line headline reveal — lines rise from behind an overflow
 * clip. The most expensive-looking effect available, and now free: SplitText
 * used to be a paid Club GSAP plugin.
 *
 * `autoSplit` re-splits when webfonts land or the box is resized, which is
 * what stops lines breaking in the wrong place on first paint. The animation
 * is created inside `onSplit` and returned, so GSAP reverts and re-syncs it
 * on every re-split.
 */
export default function SplitReveal({
  as: Tag = "h2",
  children,
  className = "",
  delay = 0,
  stagger = 0.075,
  start = "top 85%",
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          onSplit(self) {
            gsap.set(el, { autoAlpha: 1 });
            return gsap.from(self.lines, {
              yPercent: 108,
              duration: 1.15,
              stagger,
              delay,
              ease: "power3.out",
              ...(immediate
                ? {}
                : { scrollTrigger: { trigger: el, start, once: true } }),
            });
          },
        });
        return () => split.revert();
      });

      // Reduced motion: no split, no movement, just show the text.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { autoAlpha: 1 });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={`pre-reveal ${className}`}>
      {children}
    </Tag>
  );
}
