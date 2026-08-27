"use client";

import { useAudio } from "./AudioProvider";
import Waveform from "./Waveform";
import { PlayIcon, PauseIcon } from "./icons";
import { timecode } from "@/lib/format";
import type { Song } from "@/lib/content";

/**
 * The featured player.
 *
 * Timecodes and the catalogue-style label are set in mono, which is where most
 * of the engineered feel comes from at this size. The transport control carries
 * an amber halo — the one piece of glow on the page, on the one thing you're
 * meant to press.
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

      <h3 className="mt-5 font-display text-[clamp(2rem,4.2vw,2.75rem)] font-extralight leading-[1.04] text-hi">
        {song.pet}
      </h3>
      <p className="mt-3 text-sub font-light text-amber">{song.title}</p>

      <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-low">
        {song.line}
      </p>

      <div className="mt-10 flex items-center gap-5">
        <button
          onClick={() => toggle(song)}
          aria-label={
            playing
              ? `Pause ${song.title}`
              : `Play ${song.title}, ${song.pet}'s song`
          }
          className="glow surface-amber flex size-14 shrink-0 items-center justify-center rounded-full bg-amber text-base transition-colors duration-300 hover:bg-amber-deep"
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

          <div className="mono mt-2.5 flex justify-between text-[0.6875rem] text-low">
            <span>{timecode(shown * pos)}</span>
            <span>{timecode(shown)}</span>
          </div>
        </div>
      </div>

      {/* Required honesty: generated demonstration, not a family's song. */}
      <p className="mt-8 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-low">
        A demonstration track, not a customer&rsquo;s song. Real songs are only
        ever shared with the family&rsquo;s permission.
      </p>
    </div>
  );
}
