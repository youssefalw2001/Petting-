/**
 * Prefixes a public asset path with the deployment base path.
 *
 * Required for two cases that Next does NOT rewrite:
 *
 *   1. Paths assigned straight to the DOM, e.g. `audio.src = ...`
 *   2. `next/image` when `images.unoptimized` is set — which a static export
 *      forces. Verified against the build output: with `unoptimized: true`
 *      the src is emitted verbatim, so `/placeholders/x.svg` stays
 *      `/placeholders/x.svg` and 404s under a subpath. (Optimised images get
 *      the prefix for free via the `/_next/image` wrapper, which is why this
 *      is easy to miss.)
 *
 * `next/link` and the build's own asset URLs are handled by Next and must NOT
 * be passed through here, or they end up double-prefixed.
 *
 * Reads the same env var as `basePath` in next.config.ts, so there's one
 * source of truth.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path)) return path; // already absolute
  // `blob:` and `data:` are already complete references to bytes the browser is
  // holding. Prefixing them produces `/Petting-/blob:…`, which resolves to
  // nothing. The studio fetches audio with an auth header and plays the
  // resulting object URL, so this case is load-bearing there.
  if (/^(blob|data):/.test(path)) return path;
  return `${BASE_PATH}${path.startsWith("/") ? "" : "/"}${path}`;
}
