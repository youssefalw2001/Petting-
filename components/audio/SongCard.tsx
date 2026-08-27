"use client";

import Image from "next/image";
import { useAudio } from "./AudioProvider";
import { PlayIcon, PauseIcon } from "./icons";
import PlayingBars from "./PlayingBars";
import { PHOTOS, type Song } from "@/lib/content";
import { asset } from "@/lib/asset";

/**
 * A tall portrait with the control on the image, name and title beneath.
 *
 * The photographs are the emotional argument, so they get to be large. An
 * earlier version used 88px thumbnails in a row, at which size the animal was a
 * smudge.
 *
 * Image is used directly rather than through <Photo> so the hover lift can be
 * applied to the img itself — scaling a wrapper would scale the control with it.
 */
export default function SongCard({ song }: { song: Song }) {
  const { current, isPlaying, progress, toggle } = useAudio();

  const isThis = current?.id === song.id;
  const playing = isThis && isPlaying;
  const pos = isThis ? progress : 0;
  const photo = PHOTOS[song.photo];

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
        <div className="relative aspect-4/5 w-full overflow-hidden bg-surface">
          <Image
            src={asset(photo.src)}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 350px"
            className="photo-lift object-cover"
          />
        </div>

        <span
          className={[
            "glow surface-amber pointer-events-none absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-full bg-amber text-base transition-transform duration-500",
            "group-hover:scale-105",
          ].join(" ")}
        >
          {playing ? (
            <PauseIcon className="size-3" />
          ) : (
            <PlayIcon className="ml-0.5 size-3" />
          )}
        </span>

        {playing && (
          <span className="pointer-events-none absolute bottom-[1.45rem] right-4 text-amber">
            <PlayingBars />
          </span>
        )}

        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-hi/15">
          <span
            className="block h-full bg-amber transition-[width] duration-150"
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
