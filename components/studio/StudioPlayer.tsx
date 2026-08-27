"use client";

import { useAudio } from "@/components/audio/AudioProvider";
import Waveform from "@/components/audio/Waveform";
import { PlayIcon, PauseIcon } from "@/components/audio/icons";
import { timecode } from "@/lib/format";
import type { Song } from "@/lib/content";

/**
 * Auditioning a take.
 *
 * Not `SongPlayer`. That component ends with a hardcoded line about being a
 * demonstration track rather than a customer's song, which is exactly wrong here
 * — in the studio it *is* a customer's song, and shipping a player that says
 * otherwise would be the sort of detail that eventually ends up on the public
 * page by accident. Same audio provider, same waveform, different frame.
 *
 * The audio arrives as an object URL because the service requires an auth header
 * that `<audio src>` cannot send. `asset()` passes `blob:` through untouched now,
 * which is what makes that work.
 */
export default function StudioPlayer({
  id,
  pet,
  title,
  src,
  seed,
  length,
}: {
  id: string;
  pet: string;
  title: string;
  src: string;
  seed: number;
  length: number;
}) {
  const { current, isPlaying, progress, duration, toggle, seek } = useAudio();

  // The shared provider identifies tracks by id, so each take needs its own.
  // `photo` and `line` are required by the Song type but unread by this
  // component; `hero` is a real key so nothing downstream can trip over it.
  const song: Song = { id, pet, title, photo: "hero", line: "", src, seed, length };

  const isThis = current?.id === id;
  const playing = isThis && isPlaying;
  const pos = isThis ? progress : 0;
  const shown = isThis && duration ? duration : length;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => toggle(song)}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-deep text-page transition-colors duration-300 hover:bg-rose-press"
      >
        {playing ? <PauseIcon className="size-3.5" /> : <PlayIcon className="ml-0.5 size-3.5" />}
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          aria-label={`Scrub ${title}`}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            seek(song, (e.clientX - r.left) / r.width);
          }}
          className="block w-full cursor-pointer"
        >
          <Waveform bars={80} seed={seed} progress={pos} className="h-9 w-full" />
        </button>
        <div className="mt-1.5 flex justify-between text-[0.75rem] tabular-nums text-muted">
          <span>{timecode(shown * pos)}</span>
          <span>{timecode(shown)}</span>
        </div>
      </div>
    </div>
  );
}
