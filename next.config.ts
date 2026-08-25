import type { NextConfig } from "next";

/**
 * GitHub Pages serves static files only — no Node process — so the site is
 * built as a static export.
 *
 * Pages also serves a project repo from a subpath
 * (`youssefalw2001.github.io/Petting-/`), which is what `basePath` handles.
 * It's driven by an env var rather than hardcoded so the same codebase works
 * in three places without edits:
 *
 *   local dev / Vercel   NEXT_PUBLIC_BASE_PATH unset   → served at /
 *   GitHub Pages         NEXT_PUBLIC_BASE_PATH=/Petting-
 *   custom domain later  unset it again                → served at /
 *
 * Attaching a custom domain to Pages moves the site to the root, so the var
 * must be removed from the workflow at that point or every asset 404s.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",

  // Static export has no image server. Real photos therefore need to be
  // resized and compressed before they're committed — nothing will do it
  // for us at request time.
  images: { unoptimized: true },

  // Static hosts resolve /path/ to /path/index.html far more reliably
  // than bare /path.
  trailingSlash: true,

  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
