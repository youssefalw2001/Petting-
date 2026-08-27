"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Song } from "@/lib/content";
import { asset } from "@/lib/asset";

type State = {
  current: Song | null;
  isPlaying: boolean;
  /** 0–1 */
  progress: number;
  duration: number;
  toggle: (song: Song) => void;
  seek: (song: Song, fraction: number) => void;
};

const Ctx = createContext<State | null>(null);

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}

/**
 * One shared <audio> element for the whole page.
 *
 * A single element means starting a second song stops the first automatically —
 * no overlapping playback and no per-player state to reconcile.
 *
 * Progress is read on a requestAnimationFrame loop rather than the `timeupdate`
 * event, which only fires about four times a second and makes a waveform
 * playhead visibly stutter.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [current, setCurrent] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    stopLoop();
    const tick = () => {
      const el = audioRef.current;
      if (el && el.duration > 0) {
        setProgress(el.currentTime / el.duration);
        setDuration(el.duration);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopLoop]);

  const load = useCallback((song: Song) => {
    const el = audioRef.current;
    if (!el) return;
    setCurrent(song);
    setProgress(0);
    setDuration(0);
    // asset(): a raw DOM assignment bypasses Next's basePath rewriting, so the
    // file would 404 anywhere the site isn't served from the domain root.
    el.src = asset(song.src);
    el.currentTime = 0;
  }, []);

  const toggle = useCallback(
    (song: Song) => {
      const el = audioRef.current;
      if (!el) return;

      if (current?.id === song.id) {
        if (el.paused) void el.play().catch(() => setIsPlaying(false));
        else el.pause();
        return;
      }

      load(song);
      void el.play().catch(() => setIsPlaying(false));
    },
    [current, load]
  );

  const seek = useCallback(
    (song: Song, fraction: number) => {
      const el = audioRef.current;
      if (!el) return;
      const clamped = Math.min(1, Math.max(0, fraction));

      // Scrubbing a song that isn't loaded yet should start it there.
      if (current?.id !== song.id) {
        load(song);
        const onReady = () => {
          el.currentTime = clamped * (el.duration || 0);
          void el.play().catch(() => setIsPlaying(false));
          el.removeEventListener("loadedmetadata", onReady);
        };
        el.addEventListener("loadedmetadata", onReady);
        return;
      }

      if (!el.duration) return;
      el.currentTime = clamped * el.duration;
      setProgress(clamped);
    },
    [current, load]
  );

  useEffect(() => stopLoop, [stopLoop]);

  const value = useMemo<State>(
    () => ({ current, isPlaying, progress, duration, toggle, seek }),
    [current, isPlaying, progress, duration, toggle, seek]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => {
          setIsPlaying(true);
          startLoop();
        }}
        onPause={() => {
          setIsPlaying(false);
          stopLoop();
        }}
        onEnded={() => {
          setIsPlaying(false);
          stopLoop();
          setProgress(1);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
      />
    </Ctx.Provider>
  );
}
