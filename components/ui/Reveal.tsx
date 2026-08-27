"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The rise-and-fade that every `[data-reveal]` element uses, driven by one
 * IntersectionObserver mounted in the layout.
 *
 * ── Why this is keyed on `pathname` ──
 *
 * It previously ran once, on mount, with an empty dependency array. In the App
 * Router the root layout persists across client-side navigation, so that effect
 * never ran again — meaning after navigating from /create/ back to /, none of
 * the home page's elements were ever observed. They kept `opacity: 0` forever
 * and the entire page rendered invisible. Every element was in the DOM, styled,
 * and readable to a script, so it looked like a blank page rather than a broken
 * one, which is why it was easy to miss and alarming to hit.
 *
 * Re-running per route fixes it. The safety net below then guarantees the class
 * of failure can't recur: content that is on screen cannot stay hidden, whatever
 * happens to the observer.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (!els.length) return;

    const show = (el: HTMLElement) => {
      const delay = el.dataset.revealDelay;
      if (delay) el.style.transitionDelay = `${delay}ms`;
      el.classList.add("is-in");
    };

    // No IO (very old browsers): show everything rather than hide it.
    if (typeof IntersectionObserver === "undefined") {
      els.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.04 }
    );

    els.forEach((el) => io.observe(el));

    /**
     * Last resort. If the observer somehow hasn't revealed something that is
     * plainly on screen, reveal it anyway. Scoped to the viewport so elements
     * further down the page keep their scroll animation.
     *
     * A marketing page must never be able to render as a blank screen. This
     * costs one timeout and removes that whole failure mode.
     */
    const safety = window.setTimeout(() => {
      for (const el of els) {
        if (el.classList.contains("is-in")) continue;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) show(el);
      }
    }, 2000);

    return () => {
      window.clearTimeout(safety);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
