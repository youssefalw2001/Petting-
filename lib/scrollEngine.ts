/**
 * One scroll listener for the whole site.
 *
 * Every scroll-driven effect subscribes here instead of attaching its own
 * listener. With five or six effects on the page that difference matters: one
 * passive listener coalesced into a single requestAnimationFrame, one shared
 * read of scroll position, and subscribers that only ever *write* style.
 *
 * Subscribers must not read layout inside their callback — do that on
 * subscribe or on resize, never per frame, or every effect pays for a forced
 * reflow on every scroll event.
 */

type Sub = () => void;

let subs: Set<Sub> | null = null;
let frame = 0;

function flush() {
  frame = 0;
  subs?.forEach((fn) => fn());
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(flush);
}

/** Returns an unsubscribe function. Safe to call before mount checks. */
export function onScrollFrame(fn: Sub): () => void {
  if (typeof window === "undefined") return () => {};

  if (!subs) {
    subs = new Set();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }
  subs.add(fn);
  fn(); // run once so nothing waits for the first scroll

  return () => {
    subs?.delete(fn);
    if (subs && subs.size === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      subs = null;
    }
  };
}

/** True when the visitor has asked for less motion. */
export function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * How far an element has travelled through the viewport.
 * 0 as its top reaches the bottom of the screen, 1 as its bottom leaves the top.
 */
export function viewportProgress(rect: DOMRect, vh: number) {
  const total = rect.height + vh;
  return Math.min(1, Math.max(0, (vh - rect.top) / total));
}
