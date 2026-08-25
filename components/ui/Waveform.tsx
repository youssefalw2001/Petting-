"use client";

import { useMemo } from "react";
import { seededBars } from "@/lib/waveform";

/**
 * SVG waveform. Bars behind the playhead take the clay accent, bars ahead stay
 * faint. Used three ways: scrubbed by scroll in the hero, driven by real
 * playback on the sample cards, and static as a section divider.
 *
 * SVG rather than canvas so it scales crisply and needs no rAF loop of its own.
 */
export default function Waveform({
  bars = 72,
  seed = 1,
  progress = 0,
  className = "",
  gap = 0.26,
  rounded = true,
  tone = "dark",
}: {
  bars?: number;
  seed?: number;
  /** 0–1 playhead position */
  progress?: number;
  className?: string;
  /** Fraction of each slot used as spacing */
  gap?: number;
  rounded?: boolean;
  /**
   * Colour of the *unplayed* bars. `dark` = ink bars for paper backgrounds,
   * `light` = paper bars for the ink and clay sections — ink-on-ink is
   * invisible.
   */
  tone?: "dark" | "light";
}) {
  const heights = useMemo(() => seededBars(bars, seed), [bars, seed]);

  const slot = 100 / bars;
  const barWidth = slot * (1 - gap);
  const playedUpTo = progress * bars;

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {heights.map((h, i) => {
        const height = h * 30;
        const y = (32 - height) / 2;
        // Partial fill on the bar the playhead is currently inside
        const played = playedUpTo >= i + 1;
        const active = !played && playedUpTo > i;

        return (
          <rect
            key={i}
            x={i * slot + (slot - barWidth) / 2}
            y={y}
            width={barWidth}
            height={height}
            rx={rounded ? barWidth / 2 : 0}
            className={
              played || active
                ? "fill-clay"
                : tone === "light"
                  ? "fill-paper/25"
                  : "fill-ink/20"
            }
            opacity={active ? 0.55 : 1}
          />
        );
      })}
    </svg>
  );
}
