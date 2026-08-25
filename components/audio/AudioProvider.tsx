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
import type { Track } from "@/lib/data";

type AudioState = {
  current: Track | null;
  isPlaying: boolean;
  /** 0–1 */
  progress: number;
  duration: number;
  /** Plays the track, or toggles it if it's already loaded. */
  toggle: (track: Track) => void;
  pause: () => void;
  seek: (fraction: number) => void;
  dismiss: () => void;
};

const Ctx = createContext<AudioState | null>(null);

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}

/**
 * One shared <audio> element for the whole page.
 *
 * Single element means starting a second sample automatically stops the first —
 * no overlapping songs, no per-card state to reconcile. Progress is read on a
 * rAF loop rather than `timeupdate`, which only fires about four times a second
 * and makes the waveform playhead visibly stutter.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [current, setCurrent] = useState<Track | null>(null);
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

  const toggle = useCallback(
    (track: Track) => {
      const el = audioRef.current;
      if (!el) return;

      const isSame = current?.id === track.id;

      if (isSame) {
        if (el.paused) {
          void el.play().catch(() => setIsPlaying(false));
        } else {
          el.pause();
        }
        return;
      }

      setCurrent(track);
      setProgress(0);
      setDuration(0);
      el.src = track.src;
      el.currentTime = 0;
      void el.play().catch(() => {
        // Missing file or a browser gesture rule — surface the player anyway
        // so the UI stays truthful instead of silently doing nothing.
        setIsPlaying(false);
      });
    },
    [current]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const seek = useCallback((fraction: number) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const clamped = Math.min(1, Math.max(0, fraction));
    el.currentTime = clamped * el.duration;
    setProgress(clamped);
  }, []);

  const dismiss = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    stopLoop();
    setCurrent(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  }, [stopLoop]);

  useEffect(() => stopLoop, [stopLoop]);

  const value = useMemo<AudioState>(
    () => ({
      current,
      isPlaying,
      progress,
      duration,
      toggle,
      pause,
      seek,
      dismiss,
    }),
    [current, isPlaying, progress, duration, toggle, pause, seek, dismiss]
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
