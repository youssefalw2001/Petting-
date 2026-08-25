import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import ScrubWaveform from "@/components/ui/ScrubWaveform";
import { KEY_QUESTION, INTAKE_SAMPLE } from "@/lib/data";

/**
 * Answers the real objection.
 *
 * Nobody's worried about audio quality — they're worried they'll get something
 * generic with a name dropped in. Showing the actual question that does the
 * work is the cheapest way to prove otherwise, so it gets set as a pull quote
 * rather than buried in a feature list.
 */
export default function IntakeTease() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow !text-paper/45">The question that matters</p>

          <SplitReveal
            as="blockquote"
            className="wonk mt-8 font-display text-[clamp(1.85rem,4.4vw,3.15rem)] leading-[1.08] tracking-[-0.025em] !text-paper"
          >
            &ldquo;{KEY_QUESTION}&rdquo;
          </SplitReveal>

          <Reveal delay={0.25}>
            <p className="mx-auto mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-paper/65">
              It&rsquo;s question five of thirteen, and it&rsquo;s the one that
              turns a song about a dog into a song about{" "}
              <em className="font-display not-italic text-paper">your</em> dog.
              The laundry basket. The 4pm window. The mail truck.
            </p>
          </Reveal>

          <Reveal delay={0.35} className="mt-12">
            <ScrubWaveform
              bars={64}
              seed={29}
              tone="light"
              className="mx-auto h-9 w-full max-w-md"
              end="+=50%"
            />
          </Reveal>
        </div>

        {/* the rest of the intake, quietly */}
        <Reveal
          delay={0.1}
          stagger={0.07}
          start="top 85%"
          className="mx-auto mt-16 grid max-w-4xl gap-x-10 gap-y-4 border-t border-paper/12 pt-10 sm:grid-cols-2"
        >
          {INTAKE_SAMPLE.map((q) => (
            <p
              key={q}
              className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-paper/55"
            >
              <span
                className="mt-[0.6em] inline-block size-[3px] shrink-0 rounded-full bg-clay"
                aria-hidden="true"
              />
              {q}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
