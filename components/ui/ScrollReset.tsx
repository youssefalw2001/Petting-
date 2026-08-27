"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Puts every page load and every navigation at the top.
 *
 * The browser's default `scrollRestoration` is "auto", which restores your
 * previous offset. On a long single-page site that produced two bugs that looked
 * unrelated but weren't:
 *
 *   • reloading after scrolling down reopened the site near the bottom
 *   • clicking "Leave" from /create/ returned to the home page at maximum
 *     scroll, showing nothing but the footer
 *
 * Restoration is disabled in a blocking script in <head> — it has to happen
 * before the browser attempts the restore, which is far earlier than React runs.
 * This component then handles client-side navigation, where no reload occurs.
 *
 * `behavior: "instant"` matters: `scroll-behavior: smooth` is set globally for
 * anchor links, and without the override this would visibly animate a scroll up
 * through the whole page on arrival.
 */
export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // An in-page anchor is a deliberate destination — leave it alone.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
