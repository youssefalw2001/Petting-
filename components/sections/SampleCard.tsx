"use client";

import { useAudio } from "@/components/audio/AudioProvider";
import RecordSleeve from "@/components/ui/RecordSleeve";
import { PlayIcon, PauseIcon } from "@/components/ui/icons";
import type { Track } from "@/lib/data";

export default function SampleCard({ track }: { track: Track }) {
  const { current, isPlaying, progress, toggle } = useAudio();

  const isCurrent = current?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;

  return (
    <div className="group flex flex-col">
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
                : "bg-clay-deep text-paper hover:bg-clay-press",
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

          {/* Playback position as a hairline that fills, not a waveform.
              Reuses the print rule already used as a divider site-wide
              instead of importing a DAW signifier. scaleX on a transform,
              so it stays off the layout path. */}
          <div className="relative h-px flex-1 bg-rule">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-full origin-left bg-clay-deep"
              style={{ transform: `scaleX(${isCurrent ? progress : 0})` }}
            />
          </div>
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
