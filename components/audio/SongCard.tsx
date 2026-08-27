"use client";

import { useAudio } from "./AudioProvider";
import { PlayIcon, PauseIcon } from "./icons";
import Photo from "@/components/ui/Photo";
import { PHOTOS, type Song } from "@/lib/content";

/**
 * A tall portrait photograph with the control sitting on it, and the name and
 * song title beneath.
 *
 * This replaced a row layout with an 88px thumbnail. At that size the animal was
 * a smudge, which defeated the entire point — the photographs are the emotional
 * argument, so they get to be large.
 *
 * A thin progress rule sits along the bottom edge of the image while it plays,
 * so the card doesn't need a waveform competing with the portrait.
 */
export default function SongCard({ song }: { song: Song }) {
  const { current, isPlaying, progress, toggle } = useAudio();

  const isThis = current?.id === song.id;
  const playing = isThis && isPlaying;
  const pos = isThis ? progress : 0;

  return (
    <article>
      <button
        onClick={() => toggle(song)}
        aria-label={
          playing
            ? `Pause ${song.title}`
            : `Play ${song.title}, ${song.pet}'s song`
        }
        className="group relative block w-full text-left"
      >
        <Photo
          photo={PHOTOS[song.photo]}
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 350px"
          ratio="4 / 5"
        />

        {/* darkens a touch on hover so the control stays legible on any photo */}
        <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />

        <span className="pointer-events-none absolute bottom-4 left-4 flex size-12 items-center justify-center rounded-full bg-page/92 text-ink backdrop-blur-sm transition-colors duration-300 group-hover:bg-page">
          {playing ? (
            <PauseIcon className="size-3.5" />
          ) : (
            <PlayIcon className="ml-0.5 size-3.5" />
          )}
        </span>

        {/* progress along the base of the photograph */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-page/25">
          <span
            className="block h-full bg-page"
            style={{ width: `${pos * 100}%` }}
          />
        </span>
      </button>

      <h3 className="mt-6 font-display text-[1.75rem] font-light leading-none text-ink">
        {song.pet}
      </h3>
      <p className="mt-2 font-display text-[1.125rem] italic leading-snug text-body">
        &ldquo;{song.title}&rdquo;
      </p>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
        {song.line}
      </p>
    </article>
  );
}
