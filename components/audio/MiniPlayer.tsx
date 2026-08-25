"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAudio } from "./AudioProvider";
import Waveform from "@/components/ui/Waveform";
import { PlayIcon, PauseIcon } from "@/components/ui/icons";

function timecode(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Docks to the bottom of the viewport the first time a sample plays and stays
 * there.
 *
 * This is a conversion feature, not decoration: it lets someone keep listening
 * while they scroll down to the pricing. Nobody buys a song they stopped
 * hearing.
 */
export default function MiniPlayer() {
  const { current, isPlaying, progress, duration, toggle, seek, dismiss } =
    useAudio();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.to(el, {
        yPercent: current ? 0 : 120,
        duration: current ? 0.7 : 0.45,
        ease: current ? "power3.out" : "power2.in",
        overwrite: true,
      });
    },
    { dependencies: [current?.id ?? null], scope: ref }
  );

  const elapsed = duration * progress;

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-50 translate-y-[120%] px-3 pb-3 sm:px-4 sm:pb-4"
      aria-hidden={!current}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-[3px] border border-rule bg-paper/95 px-3 py-2.5 shadow-[0_-8px_40px_-16px_rgba(31,27,24,0.3)] backdrop-blur-sm sm:gap-4 sm:px-4">
        {current && (
          <>
            <div className="relative size-11 shrink-0 overflow-hidden rounded-[2px] bg-paper-sleeve ring-1 ring-inset ring-ink/10">
              <Image
                src={current.photo}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>

            <button
              onClick={() => toggle(current)}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-clay text-paper transition-colors duration-300 hover:bg-clay-deep"
              aria-label={isPlaying ? `Pause ${current.petName}` : `Play ${current.petName}`}
            >
              {isPlaying ? (
                <PauseIcon className="size-3.5" />
              ) : (
                <PlayIcon className="ml-0.5 size-3.5" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate font-display text-[1.0625rem] leading-none text-ink">
                  {current.petName}
                </p>
                <span className="shrink-0 font-sans text-[0.6875rem] tabular-nums text-ink-faint">
                  {timecode(elapsed)} / {timecode(duration)}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  seek((e.clientX - r.left) / r.width);
                }}
                className="mt-1.5 block w-full cursor-pointer"
                aria-label={`Seek within ${current.petName}`}
              >
                <Waveform
                  bars={64}
                  seed={current.seed}
                  progress={progress}
                  className="h-6 w-full"
                />
              </button>
            </div>

            <button
              onClick={dismiss}
              className="shrink-0 self-start p-1 text-ink-faint transition-colors duration-300 hover:text-ink"
              aria-label="Close player"
            >
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
                <path
                  d="M2.5 2.5l11 11m0-11l-11 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
