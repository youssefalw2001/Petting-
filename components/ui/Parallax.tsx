"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Subtle scroll-linked drift.
 *
 * One passive scroll listener, coalesced into a single rAF, writing one
 * `translate3d` — so it never reads layout during scroll and never touches
 * anything the compositor can't handle on its own thread.
 *
 * Skipped entirely under `prefers-reduced-motion`, and skipped on narrow
 * viewports where it costs frames and buys nothing.
 */
export default function Parallax({
  children,
  strength = 0.12,
  className = "",
}: {
  children: ReactNode;
  /** Fraction of scroll distance to drift. Keep it under ~0.2. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 767px)");
    if (reduce.matches || narrow.matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // progress: -1 just below the viewport, +1 just above it
      const progress =
        (rect.top + rect.height / 2 - window.innerHeight / 2) /
        (window.innerHeight / 2 + rect.height / 2);
      const shift = progress * strength * rect.height;
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.style.transform = "";
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
