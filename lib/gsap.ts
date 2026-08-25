/**
 * Single GSAP registration point.
 *
 * Every plugin is free since Webflow's acquisition of GSAP — no license key,
 * no auth token, no private registry. Imported straight from the `gsap` package.
 *
 * This module is only ever imported by client components, so plugin
 * registration happens once on the client and never during SSR.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

  // Slow and confident is the house style. Registered once so every
  // component can reach for the same curve.
  gsap.defaults({ ease: "power3.out", duration: 1 });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** matchMedia queries — every animation lives inside one of these. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION =
  "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
