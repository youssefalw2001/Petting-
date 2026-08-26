"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap, useGSAP, DESKTOP_MOTION } from "@/lib/gsap";
import { asset } from "@/lib/asset";
import { LogoMark } from "./Logo";

/**
 * A record sleeve with the disc peeking out of the top-right.
 *
 * This is the brand's core object — it appears in the hero, on every sample
 * card and behind each pricing tier. It's why the printed keepsake makes sense
 * as a product instead of an upsell.
 *
 * On desktop it tilts toward the pointer. Small rotation values only; a big
 * 3D swing would look like a tech demo.
 */
export default function RecordSleeve({
  photo,
  alt,
  petName,
  catalog,
  meta,
  className = "",
  tilt = true,
  priority = false,
  showDisc = true,
  children,
}: {
  photo: string;
  alt: string;
  petName: string;
  catalog: string;
  meta?: string;
  className?: string;
  tilt?: boolean;
  priority?: boolean;
  /**
   * Off inside grids. A half-hidden disc peeking between columns reads as a
   * stray black shape and collides with the next card — the hero is the one
   * place there's room for it to look like a record.
   */
  showDisc?: boolean;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!tilt) return;
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const inner = el.querySelector<HTMLElement>("[data-sleeve-inner]");
        if (!inner) return;

        const rotX = gsap.quickTo(inner, "rotationX", {
          duration: 0.7,
          ease: "power3.out",
        });
        const rotY = gsap.quickTo(inner, "rotationY", {
          duration: 0.7,
          ease: "power3.out",
        });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          rotY(px * 9);
          rotX(-py * 9);
        };
        const onLeave = () => {
          rotY(0);
          rotX(0);
        };

        // The idle float loop and the 68s disc rotation are both gone. Three
        // simultaneous behaviours on one object read as restless, and two of
        // the three ran forever whether or not anyone was looking at them.
        // Pointer tilt is the one that only happens when someone is actually
        // engaging with the sleeve, so it's the one that survives.
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`[perspective:1200px] ${className}`}>
      <div
        data-sleeve-inner
        className="relative [transform-style:preserve-3d]"
      >
        {/* the disc, sliding out behind the sleeve. Pulled far enough right
            that the centre label clears the sleeve edge — otherwise the whole
            thing is just a black crescent. */}
        <div
          className={`absolute right-[-18%] top-[7%] aspect-square w-[80%] rounded-full ${
            showDisc ? "hidden lg:block" : "hidden"
          }`}
        >
          <div
            data-sleeve-disc
            className="size-full rounded-full bg-ink shadow-[0_18px_45px_-18px_rgba(31,27,24,0.55)]"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 50% 50%, #26211d 0 1px, #1c1815 1px 3px)",
            }}
          >
            {/* centre label */}
            <div className="absolute left-1/2 top-1/2 flex aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-clay-deep text-paper">
              <LogoMark className="h-[38%] w-[38%] opacity-90" />
              <span className="mt-[6%] text-[0.44rem] font-medium uppercase leading-none tracking-[0.18em] opacity-85">
                {catalog}
              </span>
            </div>
            {/* spindle hole */}
            <div className="absolute left-1/2 top-1/2 size-[2.6%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper" />
          </div>
        </div>

        {/* the sleeve itself */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[3px] bg-paper-sleeve shadow-[0_26px_60px_-26px_rgba(31,27,24,0.42)]">
          {/* board edge — the giveaway that it's printed card, not a div */}
          <div className="pointer-events-none absolute inset-0 z-20 rounded-[3px] ring-1 ring-inset ring-ink/12" />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[5px] bg-ink/[0.07]" />

          <div className="flex h-full flex-col p-[7%]">
            <div className="relative flex-1 overflow-hidden rounded-[2px] bg-ink/5">
              <Image
                src={asset(photo)}
                alt={alt}
                fill
                sizes="(max-width: 768px) 88vw, 440px"
                priority={priority}
                className="object-cover"
              />
              {/* warm the photo so it sits in the palette */}
              <div className="pointer-events-none absolute inset-0 bg-clay/[0.07] mix-blend-multiply" />
            </div>

            <div className="mt-[6%] flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="truncate font-display text-[clamp(1.1rem,2.4vw,1.6rem)] leading-none text-ink"
                  style={{ fontVariationSettings: '"SOFT" 28, "WONK" 1' }}
                >
                  {petName}
                </p>
                {meta && (
                  /* ink-soft, not ink-faint: this sits on paper-sleeve, the
                     darkest surface, where ink-faint is only 4.17:1. 7.11:1 */
                  <p className="mt-1.5 truncate text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
                    {meta}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-ink-soft">
                {catalog}
              </span>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
