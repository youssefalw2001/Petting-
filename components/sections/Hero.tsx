"use client";

import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import ScrubWaveform from "@/components/ui/ScrubWaveform";
import RecordSleeve from "@/components/ui/RecordSleeve";
import { ButtonLink } from "@/components/ui/Button";
import { ScrollHintIcon } from "@/components/ui/icons";
import { TRACKS } from "@/lib/data";

/**
 * Asymmetric hero — text left, sleeve right, offset grid.
 *
 * Deliberately not a centred stack with three cards underneath. The offset
 * columns and the oversized serif at regular weight are doing the "this was
 * designed by someone" work.
 */
export default function Hero() {
  const featured = TRACKS[0];

  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      {/* faint pressing-plant detail, running down the right edge.
          writing-mode rather than rotate: rotating around origin-right pushes
          the box off-canvas and clips it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-32 hidden select-none xl:block"
      >
        <span className="eyebrow opacity-55 [writing-mode:vertical-rl]">
          Est. 2026 · One pressing per family
        </span>
      </div>

      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ── text column ── */}
          <div className="lg:pr-6">
            <Reveal delay={0.15}>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-clay" />
                Songs for the ones who slept at your feet
              </p>
            </Reveal>

            <SplitReveal
              as="h1"
              immediate
              delay={0.3}
              className="mt-7 text-display"
            >
              Their story,
              <br />
              turned into a song.
            </SplitReveal>

            <Reveal delay={0.85}>
              <p className="mt-7 text-lede text-ink-soft">
                An original song about your dog or cat, written from your
                memories and recorded in the style you choose. One record,
                pressed for one family, in your hands within 48 hours.
              </p>
            </Reveal>

            <Reveal delay={1} className="mt-9">
              <div className="flex flex-wrap items-center gap-3">
                <ButtonLink href="#listen" size="lg">
                  Hear a song
                </ButtonLink>
                <ButtonLink href="#pricing" size="lg" variant="outline">
                  Make their song — $97
                </ButtonLink>
              </div>
            </Reveal>

            {/* the scroll-scrubbed waveform */}
            <div className="mt-14 max-w-lg">
              <ScrubWaveform bars={84} seed={11} className="h-12 w-full" />
              <div className="mt-3 flex items-center justify-between">
                <span className="eyebrow">Side A · {featured.petName}</span>
                <span className="eyebrow inline-flex items-center gap-2">
                  Scroll
                  <ScrollHintIcon className="h-3.5 w-2 text-clay" />
                </span>
              </div>
            </div>
          </div>

          {/* ── sleeve column ── */}
          {/* pr on desktop leaves room for the disc to slide out without
              clipping against the section edge */}
          <Reveal mode="unmask" delay={0.5} className="lg:pl-4 lg:pr-20">
            <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
              <RecordSleeve
                photo={featured.photo}
                alt={featured.photoAlt}
                petName={featured.petName}
                catalog={featured.catalog}
                meta={featured.meta}
                priority
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
