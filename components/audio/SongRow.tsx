"use client";

import { useAudio } from "./AudioProvider";
import Waveform from "./Waveform";
import { PlayIcon, PauseIcon } from "./icons";
import Photo from "@/components/ui/Photo";
import { PHOTOS, type Song } from "@/lib/content";

/**
 * Compact example. Deliberately a different scale from the featured player
 * rather than a smaller copy of it — one is a demonstration, these are a list.
 *
 * No card, no border, no shadow. A hairline separates them, which is the same
 * device used between every other list on the site.
 */
export default function SongRow({ song }: { song: Song }) {
  const { current, isPlaying, progress, toggle, seek } = useAudio();

  const isThis = current?.id === song.id;
  const playing = isThis && isPlaying;
  const pos = isThis ? progress : 0;

  return (
    <article className="grid grid-cols-[4.5rem_1fr] items-center gap-5 border-t border-line py-7 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-7 sm:py-8">
      <Photo
        photo={PHOTOS[song.photo]}
        sizes="88px"
        ratio="1 / 1"
        note={false}
        className="w-full"
      />

      <div className="min-w-0">
        <h3 className="font-display text-[1.5rem] font-light leading-none text-ink">
          {song.pet}
        </h3>
        <p className="mt-1.5 font-display text-[1.0625rem] italic leading-snug text-body">
          &ldquo;{song.title}&rdquo;
        </p>
        <p className="mt-2.5 max-w-md text-[0.875rem] leading-relaxed text-muted">
          {song.line}
        </p>
      </div>

      <div className="col-span-2 flex items-center gap-4 sm:col-span-1 sm:w-56">
        <button
          onClick={() => toggle(song)}
          aria-label={
            playing ? `Pause ${song.title}` : `Play ${song.title}, ${song.pet}'s song`
          }
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:border-rose-deep hover:bg-rose-deep hover:text-page"
        >
          {playing ? (
            <PauseIcon className="size-3" />
          ) : (
            <PlayIcon className="ml-0.5 size-3" />
          )}
        </button>
        <button
          type="button"
          aria-label={`Scrub ${song.title}`}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            seek(song, (e.clientX - r.left) / r.width);
          }}
          className="block w-full cursor-pointer"
        >
          <Waveform bars={44} seed={song.seed} progress={pos} className="h-7 w-full" />
        </button>
      </div>
    </article>
  );
}
