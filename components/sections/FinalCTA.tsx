import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/ui/Marquee";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { PET_NAMES } from "@/lib/data";

export default function FinalCTA() {
  return (
    <>
      {/* names drifting past — social proof without a carousel */}
      <section className="border-y border-rule bg-paper py-10">
        <Marquee items={PET_NAMES} speed={72} />
      </section>

      <section className="relative overflow-hidden bg-clay py-24 text-paper md:py-32">
        {/* oversized mark, bled off the corner */}
        <LogoMark
          className="pointer-events-none absolute -bottom-24 -right-20 size-96 text-paper/10"
        />

        <div className="shell relative">
          <div className="max-w-2xl">
            <p className="eyebrow !text-paper/50">Sunbeam Records</p>

            <SplitReveal as="h2" className="mt-7 text-h2 !text-paper">
              Tell us about them. We&rsquo;ll take it from there.
            </SplitReveal>

            <Reveal delay={0.2}>
              <p className="mt-7 max-w-lg text-[1.0625rem] leading-relaxed text-paper/75">
                Thirteen questions, about five minutes. The song lands in your
                inbox two days later, and it will only ever exist for you.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-10">
              <div className="flex flex-wrap items-center gap-3">
                <ButtonLink
                  href="#pricing"
                  size="lg"
                  className="!bg-paper !text-ink hover:!bg-paper/90"
                >
                  Make their song — $97
                </ButtonLink>
                <ButtonLink
                  href="#listen"
                  size="lg"
                  variant="outline"
                  className="!border-paper/35 !text-paper hover:!border-paper hover:!bg-paper/10"
                >
                  Hear one first
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
