#!/usr/bin/env python3
"""
Generates the three placeholder sample songs in /public/samples.

These exist only so the player, waveform and mini-player are testable before
the real songs land. Delete this script and the WAV files once you drop in the
actual MP3s (and update `src` in lib/data.ts).

Mono, 22.05kHz, ~12s => roughly 500KB each.
"""

import math
import struct
import wave
from pathlib import Path

RATE = 22050
LENGTH = 12.0

OUT = Path(__file__).resolve().parent.parent / "public" / "songs"


def note(freq, t, dur, kind):
    """One plucked/struck note with harmonics and a decaying envelope."""
    if t < 0 or t > dur:
        return 0.0

    # Envelope: fast-ish attack, long decay. Piano decays slower than a pluck.
    attack = 0.012 if kind == "pluck" else 0.03
    decay_rate = 2.6 if kind == "pluck" else 1.5
    if t < attack:
        env = t / attack
    else:
        env = math.exp(-decay_rate * (t - attack))

    # Harmonic stack — a bare sine sounds like a test tone, not an instrument.
    harmonics = [(1, 1.0), (2, 0.36), (3, 0.16), (4, 0.08), (5, 0.04)]
    value = 0.0
    for mult, amp in harmonics:
        # slight detune keeps it from sounding sterile
        f = freq * mult * (1.0 + 0.0006 * mult)
        value += amp * math.sin(2 * math.pi * f * t)

    return value * env


def build(pattern, kind, bpm, out_path):
    beat = 60.0 / bpm
    total = int(RATE * LENGTH)
    buf = [0.0] * total

    # Lay the arpeggio down repeatedly across the full length
    step = 0
    while step * beat < LENGTH:
        freq = pattern[step % len(pattern)]
        start = int(step * beat * RATE)
        dur = min(beat * 4.5, LENGTH - step * beat)
        n = int(dur * RATE)
        for i in range(n):
            idx = start + i
            if idx >= total:
                break
            buf[idx] += note(freq, i / RATE, dur, kind)
        step += 1

    # Soft-clip, then fade the tail so it loops politely
    peak = max(abs(v) for v in buf) or 1.0
    fade = int(RATE * 1.5)
    frames = bytearray()
    for i, v in enumerate(buf):
        v = v / peak
        v = math.tanh(v * 1.15) * 0.82
        if i > total - fade:
            v *= (total - i) / fade
        if i < RATE * 0.05:
            v *= i / (RATE * 0.05)
        frames += struct.pack("<h", int(max(-1.0, min(1.0, v)) * 32000))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(out_path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(bytes(frames))
    print(f"  {out_path.name}  {out_path.stat().st_size // 1024}KB")


def n(name):
    """Note name -> frequency (A4 = 440)."""
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6,
             "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    pitch = name[:-1]
    octave = int(name[-1])
    semis = names[pitch] + (octave - 4) * 12 - 9
    return 440.0 * (2 ** (semis / 12))


print("Generating placeholder samples...")

# Buddy — gentle acoustic, open and warm
build([n("C3"), n("G3"), n("C4"), n("E4"), n("G4"), n("E4")],
      "pluck", 92, OUT / "buddy.wav")

# Milo — piano, slower, more sustain
build([n("F2"), n("C3"), n("F3"), n("A3"), n("C4"), n("A3")],
      "piano", 72, OUT / "milo.wav")

# Luna — minor, sparse and close
build([n("A2"), n("E3"), n("A3"), n("C4"), n("E4"), n("C4")],
      "piano", 66, OUT / "luna.wav")

# Charlie — warmer, a little brighter
build([n("G2"), n("D3"), n("G3"), n("B3"), n("D4"), n("B3")],
      "pluck", 104, OUT / "charlie.wav")

print("Done.")
