/**
 * Deterministic waveform bar heights.
 *
 * Seeded so the server and client render identical markup — a Math.random()
 * waveform would hydrate-mismatch on every load.
 *
 * The envelope matters more than the randomness: a real song opens quiet,
 * fills through the middle and tails off. Flat random noise reads as a
 * loading skeleton, not audio.
 */
export function seededBars(count: number, seed: number): number[] {
  let s = (seed * 2654435761) % 4294967296;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);

    // Slow swell in, sustain, gentle fade out
    const envelope = 0.34 + 0.66 * Math.sin(Math.PI * Math.pow(t, 0.82));
    // Bar-to-bar variation, plus a slower ripple so it reads as rhythmic
    const detail = 0.5 + rand() * 0.62;
    const pulse = 0.9 + 0.1 * Math.sin(t * Math.PI * 14);

    return Math.min(1, Math.max(0.07, envelope * detail * pulse));
  });
}
