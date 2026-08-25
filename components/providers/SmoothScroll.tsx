"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one clock. Without that sync, pinned sections drift.
 *
 * Skipped entirely when the user prefers reduced motion — native scroll is
 * the accessible default, not a degraded fallback.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let raf: ((time: number) => void) | null = null;

    const start = () => {
      if (lenisRef.current) return;

      const lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 1,
        smoothWheel: true,
        // GSAP drives the loop instead of Lenis' own rAF
        autoRaf: false,
        anchors: true,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      // Lenis interpolates its own position; GSAP's lag smoothing fights it
      gsap.ticker.lagSmoothing(0);
    };

    const stop = () => {
      if (raf) {
        gsap.ticker.remove(raf);
        raf = null;
      }
      gsap.ticker.lagSmoothing(500, 33);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    if (!prefersReduced.matches) start();

    // Respond live if the user flips the OS setting
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) stop();
      else start();
      ScrollTrigger.refresh();
    };
    prefersReduced.addEventListener("change", onChange);

    // Line breaks shift once webfonts land, which moves every trigger
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      prefersReduced.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return <>{children}</>;
}
