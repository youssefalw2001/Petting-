"use client";

import { useAudio } from "./AudioProvider";
import { PlayIcon, PauseIcon } from "./icons";
import Photo from "@/components/ui/Photo";
import { PHOTOS, type Song } from "@/lib/content";

/**
 * A tall portrait with the control on the image, name and title beneath.
 *
 * The photographs are the emotional argument, so they get to be large. An
 * earlier version used 88px thumbnails in a row, at which size the animal was a
 * smudge.
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
        className="group relative block w-full overflow-hidden rounded-[2px] text-left"
      >
        <Photo
          photo={PHOTOS[song.photo]}
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 350px"
          ratio="4 / 5"
        />

        {/* lifts slightly on hover so the control reads on any photograph */}
        <span className="pointer-events-none absolute inset-0 bg-base/0 transition-colors duration-500 group-hover:bg-base/20" />

        <span className="glow surface-amber pointer-events-none absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-full bg-amber text-base">
          {playing ? (
            <PauseIcon className="size-3" />
          ) : (
            <PlayIcon className="ml-0.5 size-3" />
          )}
        </span>

        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-hi/15">
          <span
            className="block h-full bg-amber"
            style={{ width: `${pos * 100}%` }}
          />
        </span>
      </button>

      <h3 className="mt-6 font-display text-[1.5rem] font-light leading-none text-hi">
        {song.pet}
      </h3>
      <p className="mt-2.5 text-[1.0625rem] font-light leading-snug text-amber">
        {song.title}
      </p>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-low">
        {song.line}
      </p>
    </article>
  );
}
