"use client";

import { useRef } from "react";
import { gsap, useGSAP, DESKTOP_MOTION } from "@/lib/gsap";
import { useAudio } from "@/components/audio/AudioProvider";
import RecordSleeve from "@/components/ui/RecordSleeve";
import Waveform from "@/components/ui/Waveform";
import { PlayIcon, PauseIcon } from "@/components/ui/icons";
import type { Track } from "@/lib/data";

export default function SampleCard({ track }: { track: Track }) {
  const { current, isPlaying, progress, toggle } = useAudio();
  const ref = useRef<HTMLDivElement>(null);

  const isCurrent = current?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;

  // A custom cursor that follows the pointer over the sleeve. Desktop only —
  // there is no pointer to follow on a phone.
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const cursor = el.querySelector<HTMLElement>("[data-cursor]");
      const hit = el.querySelector<HTMLElement>("[data-hit]");
      if (!cursor || !hit) return;

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const x = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
        const y = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });

        const onMove = (e: PointerEvent) => {
          const r = hit.getBoundingClientRect();
          x(e.clientX - r.left);
          y(e.clientY - r.top);
        };
        const onEnter = () =>
          gsap.to(cursor, { scale: 1, autoAlpha: 1, duration: 0.4 });
        const onLeave = () =>
          gsap.to(cursor, { scale: 0.6, autoAlpha: 0, duration: 0.3 });

        hit.addEventListener("pointermove", onMove);
        hit.addEventListener("pointerenter", onEnter);
        hit.addEventListener("pointerleave", onLeave);

        return () => {
          hit.removeEventListener("pointermove", onMove);
          hit.removeEventListener("pointerenter", onEnter);
          hit.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="group flex flex-col">
      <div data-hit className="relative cursor-pointer">
        <RecordSleeve
          photo={track.photo}
          alt={track.photoAlt}
          petName={track.petName}
          catalog={track.catalog}
          meta={track.meta}
          tilt={false}
          showDisc={false}
        />

        {/* full-sleeve hit area; the visible control is the pill below */}
        <button
          onClick={() => toggle(track)}
          className="absolute inset-0 z-30 rounded-[3px]"
          aria-label={
            isThisPlaying
              ? `Pause the song for ${track.petName}`
              : `Play the song for ${track.petName}`
          }
        />

        {/* follower cursor */}
        <div
          data-cursor
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-40 flex size-16 -translate-x-1/2 -translate-y-1/2 scale-[0.6] items-center justify-center rounded-full bg-ink text-paper opacity-0"
        >
          {isThisPlaying ? (
            <PauseIcon className="size-3" />
          ) : (
            <PlayIcon className="ml-0.5 size-3" />
          )}
        </div>
      </div>

      {/* controls + story */}
      <div className="mt-6 flex flex-1 flex-col">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => toggle(track)}
            className={[
              "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
              isThisPlaying
                ? "bg-ink text-paper"
                : "bg-clay text-paper hover:bg-clay-deep",
            ].join(" ")}
            aria-label={
              isThisPlaying
                ? `Pause the song for ${track.petName}`
                : `Play the song for ${track.petName}`
            }
          >
            {isThisPlaying ? (
              <PauseIcon className="size-3.5" />
            ) : (
              <PlayIcon className="ml-0.5 size-3.5" />
            )}
          </button>

          <Waveform
            bars={48}
            seed={track.seed}
            progress={isCurrent ? progress : 0}
            className="h-8 flex-1"
          />
        </div>

        <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-soft">
          {track.story}
        </p>

        <p className="mt-4 border-t border-rule-soft pt-3.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-faint">
          {track.genre}
        </p>
      </div>
    </div>
  );
}
