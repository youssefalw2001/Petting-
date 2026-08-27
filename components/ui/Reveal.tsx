"use client";

import { useEffect } from "react";

/**
 * The only animation on the site: a single gentle rise-and-fade as each block
 * enters view.
 *
 * Mounted once in the layout and driven by one IntersectionObserver over every
 * `[data-reveal]` element, so no section carries its own animation code and
 * there is nothing to keep in sync.
 *
 * This replaced GSAP, ScrollTrigger, SplitText and Lenis. A memorial page does
 * not need scroll-jacking, split-text choreography or an animation library — it
 * needs to load fast and sit still. Dropping all four removed three
 * dependencies and every infinite loop from the page.
 *
 * The transition itself lives in CSS, which means `prefers-reduced-motion`
 * disables it without any JavaScript branch.
 */
export default function Reveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (!els.length) return;

    // Old browsers, or anything without IO: show everything immediately.
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay;
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.04 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
