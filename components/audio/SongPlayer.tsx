"use client";

import { useAudio } from "./AudioProvider";
import Waveform from "./Waveform";
import { PlayIcon, PauseIcon } from "./icons";
import { timecode } from "@/lib/format";
import type { Song } from "@/lib/content";

/**
 * The featured player.
 *
 * This is the section that has to answer "what do I actually receive?", so it's
 * built at scale: the pet's name in the display serif, the song title beneath
 * it, a waveform you can scrub, and a duration. No card, no border, no shadow —
 * it sits directly on the page and the type does the work.
 */
export default function SongPlayer({ song }: { song: Song }) {
  const { current, isPlaying, progress, duration, toggle, seek } = useAudio();

  const isThis = current?.id === song.id;
  const playing = isThis && isPlaying;
  const pos = isThis ? progress : 0;
  const shown = isThis && duration ? duration : song.length;

  return (
    <div>
      <p className="label">Their song</p>

      <h3 className="mt-5 font-display text-[clamp(2.1rem,4.4vw,3rem)] font-light leading-[1.05] text-ink">
        {song.pet}
      </h3>
      <p className="mt-2 font-display text-sub italic text-body">
        &ldquo;{song.title}&rdquo;
      </p>

      <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
        {song.line}
      </p>

      <div className="mt-9 flex items-center gap-5">
        <button
          onClick={() => toggle(song)}
          aria-label={
            playing ? `Pause ${song.title}` : `Play ${song.title}, ${song.pet}'s song`
          }
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-rose-deep text-page transition-colors duration-300 hover:bg-rose-press"
        >
          {playing ? (
            <PauseIcon className="size-4" />
          ) : (
            <PlayIcon className="ml-0.5 size-4" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            aria-label={`Scrub ${song.title}`}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              seek(song, (e.clientX - r.left) / r.width);
            }}
            className="block w-full cursor-pointer"
          >
            <Waveform bars={72} seed={song.seed} progress={pos} className="h-10 w-full" />
          </button>

          <div className="mt-2 flex justify-between text-[0.75rem] tabular-nums text-muted">
            <span>{timecode(shown * pos)}</span>
            <span>{timecode(shown)}</span>
          </div>
        </div>
      </div>

      {/* Required honesty: this is a generated demonstration, not a family's song. */}
      <p className="mt-7 border-t border-line-soft pt-5 text-[0.8125rem] leading-relaxed text-muted">
        A demonstration track, not a customer&rsquo;s song. Real songs are only
        ever shared with the family&rsquo;s permission.
      </p>
    </div>
  );
}
