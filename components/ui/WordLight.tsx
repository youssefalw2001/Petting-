"use client";

import { useEffect, useRef } from "react";
import { onScrollFrame, prefersReduced } from "@/lib/scrollEngine";

/**
 * A sentence that lights up word by word as you scroll through it.
 *
 * The showpiece effect on the page: the line arrives rather than simply
 * appearing, which suits a sentence about memory more than a fade would.
 *
 * The interesting part is how little JavaScript it takes. Per frame this writes
 * exactly one custom property — `--p`, the element's scroll progress — onto the
 * container. Every word then derives its own brightness in CSS from that single
 * number plus its own index:
 *
 *     opacity: clamp(0.16, calc((var(--p) * var(--n) - var(--i)) * 1.6), 1)
 *
 * So a forty-word paragraph still costs one style write per frame instead of
 * forty, and the interpolation happens on the compositor rather than in JS.
 */
export default function WordLight({
  text,
  className = "",
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: light the whole sentence and never listen for scroll.
    if (prefersReduced()) {
      el.style.setProperty("--p", "1");
      return;
    }

    return onScrollFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Finish lighting while the sentence is still comfortably on screen,
      // rather than at the moment it leaves — otherwise the last words only
      // brighten as they disappear.
      const start = vh * 0.86;
      const end = vh * 0.3;
      const p = (start - r.top) / (start - end);
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    });
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={`word-light ${className}`}
      style={{ ["--n" as string]: words.length }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className="word"
          style={{ ["--i" as string]: i }}
          aria-hidden={false}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
