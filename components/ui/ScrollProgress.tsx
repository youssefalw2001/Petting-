"use client";

import { useEffect, useRef } from "react";
import { onScrollFrame, prefersReduced } from "@/lib/scrollEngine";

/**
 * A hairline of amber across the top of the viewport tracking read progress.
 *
 * Scales a single element on the X axis, so it never touches layout. Hidden
 * entirely under reduced motion — it is decoration, and a progress bar that
 * can't move has nothing to say.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    return onScrollFrame(() => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
    >
      {/* The initial zero-width state is set inline, NOT with Tailwind's
          `scale-x-0`. In v4 that utility compiles to the CSS `scale` property,
          which composes with `transform` rather than being overridden by it — so
          the class would multiply every value written here by zero and the bar
          would stay invisible forever. */}
      <div
        ref={ref}
        className="h-full w-full origin-left bg-amber/70"
        style={{ transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>
  );
}
