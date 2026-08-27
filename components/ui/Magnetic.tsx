"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReduced } from "@/lib/scrollEngine";

/**
 * The primary call to action leans very slightly toward the cursor.
 *
 * Small numbers on purpose — a few pixels of pull reads as responsiveness, and
 * anything more reads as a toy. Pointer events only, so it costs nothing until
 * someone is actually near the button, and it's off on touch and under reduced
 * motion.
 */
export default function Magnetic({
  children,
  strength = 0.22,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      frame = 0;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
    >
      {children}
    </div>
  );
}
