import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import SampleCard from "./SampleCard";
import { TRACKS } from "@/lib/data";

/**
 * Sits high on the page on purpose.
 *
 * Hearing one of these does more selling than every other section combined, so
 * it comes before how-it-works, before pricing, before the reaction wall.
 */
export default function Listen() {
  return (
    <section id="listen" className="relative bg-paper-deep py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-clay" />
              The catalogue
            </p>
            <SplitReveal as="h2" className="mt-6 text-h2 max-w-xl">
              Three we pressed last month.
            </SplitReveal>
          </div>

          <Reveal delay={0.2}>
            <p className="max-w-xs text-[0.9375rem] leading-relaxed text-ink-soft md:text-right">
              Every one written from a stranger&rsquo;s answers about an animal
              we never met.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
          {TRACKS.map((track, i) => (
            <Reveal key={track.id} delay={i * 0.12} start="top 88%">
              <SampleCard track={track} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
