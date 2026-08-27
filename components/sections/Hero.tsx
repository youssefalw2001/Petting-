"use client";

import Link from "next/link";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import RecordSleeve from "@/components/ui/RecordSleeve";
import { ButtonLink } from "@/components/ui/Button";
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

            {/* One action. The second CTA is a text link, not a second
                button: two buttons of equal weight is a stall, and the
                purchase path stays one click away in the nav regardless. */}
            <Reveal delay={1} className="mt-9">
              <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                <ButtonLink href="#listen" size="lg">
                  Hear a song
                </ButtonLink>
                {/* Kept as a demoted text link, not a second button — but
                    pointed at the order flow rather than the pricing anchor,
                    and via next/link so basePath applies on Pages. */}
                <Link
                  href="/order/"
                  className="text-[0.9375rem] text-ink-soft underline decoration-rule decoration-1 underline-offset-4 transition-colors duration-300 hover:text-clay-deep hover:decoration-clay-deep"
                >
                  Make their song — $97
                </Link>
              </div>
            </Reveal>
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
