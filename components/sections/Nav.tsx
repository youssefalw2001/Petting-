"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Wordmark } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [settled, setSettled] = useState(false);

  useGSAP(() => {
    // Fires twice per page (crossing 72px each way), not on every scroll frame.
    //
    // `end` deliberately overshoots the bottom of the document. With
    // `end: "max"` the trigger deactivates the instant you hit the last pixel
    // of the page, which dropped the nav back to transparent right on top of
    // the clay closing section and made the wordmark unreadable.
    const st = ScrollTrigger.create({
      start: 72,
      end: () => ScrollTrigger.maxScroll(window) + 500,
      onToggle: (self) => setSettled(self.isActive),
    });

    gsap.from(ref.current, {
      yPercent: -100,
      duration: 1,
      delay: 0.2,
      ease: "power3.out",
    });

    return () => st.kill();
  });

  return (
    <header
      ref={ref}
      className={[
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500",
        settled
          ? "border-b border-rule bg-paper/88 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between">
        <a href="#top" aria-label="Sunbeam Records, home">
          <Wordmark />
        </a>

        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#listen"
            className="hidden px-3 py-2 text-[0.9375rem] text-ink-soft transition-colors duration-300 hover:text-clay sm:block"
          >
            Listen
          </a>
          <a
            href="#how"
            className="hidden px-3 py-2 text-[0.9375rem] text-ink-soft transition-colors duration-300 hover:text-clay md:block"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="hidden px-3 py-2 text-[0.9375rem] text-ink-soft transition-colors duration-300 hover:text-clay sm:block"
          >
            Pricing
          </a>
          <ButtonLink href="#pricing" className="ml-1.5">
            Make their song
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
