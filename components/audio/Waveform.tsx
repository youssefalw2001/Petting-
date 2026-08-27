"use client";

import { useMemo } from "react";
import { seededBars } from "@/lib/waveform";

/**
 * Thin rounded bars — amber behind the playhead, near-invisible ahead of it.
 *
 * Bar heights come from a seeded generator, never Math.random(), or the server
 * and client render different markup and React throws a hydration mismatch on
 * every load.
 */
export default function Waveform({
  bars = 64,
  seed = 1,
  progress = 0,
  className = "",
}: {
  bars?: number;
  seed?: number;
  /** 0–1 playhead position */
  progress?: number;
  className?: string;
}) {
  const heights = useMemo(() => seededBars(bars, seed), [bars, seed]);

  const slot = 100 / bars;
  const width = slot * 0.4;
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
            className={isPlayed ? "fill-amber" : "fill-hi/15"}
          />
        );
      })}
    </svg>
  );
}
