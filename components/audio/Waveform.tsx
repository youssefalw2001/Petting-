"use client";

import { useMemo } from "react";
import { seededBars } from "@/lib/waveform";

/**
 * Thin rounded bars, muted ahead of the playhead and rose behind it.
 *
 * SVG rather than canvas: it scales crisply, needs no animation loop of its own,
 * and the whole thing is a pure function of `progress`.
 *
 * Bar heights come from a seeded generator, never Math.random(), or the server
 * and client would render different markup and React would throw a hydration
 * mismatch on every load.
 */
export default function Waveform({
  bars = 64,
  seed = 1,
  progress = 0,
  className = "",
  tone = "light",
}: {
  bars?: number;
  seed?: number;
  /** 0–1 playhead position */
  progress?: number;
  className?: string;
  /** `light` for ivory surfaces, `dark` for ink ones */
  tone?: "light" | "dark";
}) {
  const heights = useMemo(() => seededBars(bars, seed), [bars, seed]);

  const slot = 100 / bars;
  const width = slot * 0.42;
  const played = progress * bars;

  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {heights.map((h, i) => {
        const height = Math.max(1.6, h * 38);
        const isPlayed = played >= i + 0.5;
        return (
          <rect
            key={i}
            x={i * slot + (slot - width) / 2}
            y={(40 - height) / 2}
            width={width}
            height={height}
            rx={width / 2}
            className={
              isPlayed
                ? "fill-rose-deep"
                : tone === "dark"
                  ? "fill-page/30"
                  : "fill-ink/16"
            }
          />
        );
      })}
    </svg>
  );
}
