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
  /** True between the user asking for a song and audio actually starting. */
  isLoading: boolean;
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
 * One shared <audio> element, driven by a request token.
 *
 * The previous version broke under fast clicking, and did so silently, which is
 * the worst way for a play button to fail. Three separate causes:
 *
 *  1. `el.play()` returns a promise that REJECTS with AbortError whenever a new
 *     `src` or a `pause()` interrupts it. That rejection was being treated as
 *     "playback failed" and flipped the UI back to a paused state even though a
 *     newer, valid play request was already in flight. Clicking through four
 *     songs quickly ended with everything stopped.
 *
 *  2. `current?.id` was read from React state inside those handlers. During a
 *     burst of clicks that value is stale, so the provider mistook a new song
 *     for the current one and skipped loading it — leaving readyState at 0 and
 *     a button that did nothing at all.
 *
 *  3. `seek()` on an unloaded song attached a `loadedmetadata` listener that was
 *     never removed. Load a different song before it fired and it would seek and
 *     start the wrong track.
 *
 * Every mutation now takes a token from `reqRef`. Any async step re-checks that
 * its token is still the newest before touching state, so stale work discards
 * itself instead of fighting whatever the user asked for most recently.
 * `currentIdRef` mirrors the current song so identity checks never read stale
 * state, and AbortError is treated as the routine, expected event it is.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const reqRef = useRef(0);
  const currentIdRef = useRef<string | null>(null);

  const [current, setCurrent] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  /** Resolves on the next `loadedmetadata`, or immediately if already known. */
  const awaitMetadata = useCallback((el: HTMLAudioElement) => {
    if (el.readyState >= 1 && Number.isFinite(el.duration)) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const done = () => {
        el.removeEventListener("loadedmetadata", done);
        el.removeEventListener("error", done);
        resolve();
      };
      // once:true on both, plus explicit removal, so a listener can never
      // outlive the request that created it.
      el.addEventListener("loadedmetadata", done, { once: true });
      el.addEventListener("error", done, { once: true });
    });
  }, []);

  const play = useCallback(
    async (song: Song, fraction?: number) => {
      const el = audioRef.current;
      if (!el) return;

      const req = ++reqRef.current;

      if (currentIdRef.current !== song.id) {
        currentIdRef.current = song.id;
        setCurrent(song);
        setProgress(0);
        setDuration(0);
        el.src = asset(song.src);
        el.load();
      }

      if (fraction !== undefined) {
        setIsLoading(true);
        await awaitMetadata(el);
        if (req !== reqRef.current) return; // superseded — drop it
        const d = Number.isFinite(el.duration) ? el.duration : 0;
        el.currentTime = Math.min(1, Math.max(0, fraction)) * d;
        setProgress(d ? el.currentTime / d : 0);
      }

      setIsLoading(true);
      try {
        await el.play();
      } catch (err) {
        // AbortError is expected: a newer src or pause interrupted this call.
        // Only a genuinely failed, still-current request should show as stopped.
        const name = (err as DOMException)?.name;
        if (req === reqRef.current && name !== "AbortError") setIsPlaying(false);
      } finally {
        if (req === reqRef.current) setIsLoading(false);
      }
    },
    [awaitMetadata]
  );

  const toggle = useCallback(
    (song: Song) => {
      const el = audioRef.current;
      if (!el) return;

      if (currentIdRef.current === song.id && !el.paused) {
        reqRef.current++; // cancel anything in flight
        el.pause();
        return;
      }
      void play(song);
    },
    [play]
  );

  const seek = useCallback(
    (song: Song, fraction: number) => {
      void play(song, fraction);
    },
    [play]
  );

  useEffect(() => stopLoop, [stopLoop]);

  const value = useMemo<State>(
    () => ({ current, isPlaying, progress, duration, isLoading, toggle, seek }),
    [current, isPlaying, progress, duration, isLoading, toggle, seek]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => {
          setIsPlaying(true);
          setIsLoading(false);
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
