"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { onScrollFrame, prefersReduced } from "@/lib/scrollEngine";

/**
 * Scroll-linked drift, with an optional settle-away as the element leaves.
 *
 * Now subscribes to the shared scroll engine rather than attaching its own
 * listener, so adding scroll effects to the page doesn't add scroll handlers.
 * Writes one `transform` (and optionally one `opacity`) per frame and reads
 * layout only through a single `getBoundingClientRect`.
 *
 * Off under reduced motion and off below 768px, where it costs frames and buys
 * nothing on a screen that size.
 */
export default function Parallax({
  children,
  strength = 0.12,
  /** Scale down and fade slightly as it scrolls out of view. Cinematic depth. */
  settle = false,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  settle?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    return onScrollFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // -1 below the fold, 0 centred, +1 above the top
      const centred =
        (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      const shift = -centred * strength * r.height;

      if (settle) {
        // Only acts once the element starts leaving upward.
        const out = Math.min(1, Math.max(0, -centred));
        const scale = 1 - out * 0.06;
        el.style.transform = `translate3d(0,${shift.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
        el.style.opacity = String(1 - out * 0.35);
      } else {
        el.style.transform = `translate3d(0,${shift.toFixed(2)}px,0)`;
      }
    });
  }, [strength, settle]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
