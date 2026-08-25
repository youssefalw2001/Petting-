"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import Waveform from "./Waveform";

/**
 * A waveform that fills as you scroll.
 *
 * Two stacked copies — one faint, one fully clay — with the clay layer's
 * clip-path scrubbed by scroll position. Doing it this way means zero React
 * re-renders and the whole thing stays on the compositor; driving a `progress`
 * prop from `onUpdate` would re-render 60 times a second.
 *
 * The point of the effect is that the motion is *about* the product. Generic
 * parallax could sit on any site; this one only makes sense on a record label.
 */
export default function ScrubWaveform({
  bars = 88,
  seed = 3,
  className = "",
  end = "+=70%",
  tone = "dark",
}: {
  bars?: number;
  seed?: number;
  className?: string;
  end?: string;
  tone?: "dark" | "light";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const fill = el.querySelector<HTMLElement>("[data-fill]");
      if (!fill) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          fill,
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end,
              scrub: 0.6,
            },
          }
        );
      });

      // Reduced motion: show it filled, no scrubbing.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(fill, { clipPath: "inset(0% 0% 0% 0%)" });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      <Waveform
        bars={bars}
        seed={seed}
        progress={0}
        tone={tone}
        className="h-full w-full"
      />
      <div data-fill className="absolute inset-0 [clip-path:inset(0_100%_0_0)]">
        <Waveform
          bars={bars}
          seed={seed}
          progress={1}
          tone={tone}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
