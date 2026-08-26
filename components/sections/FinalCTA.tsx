import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";

export default function FinalCTA() {
  return (
    <>
      {/* The 28-name marquee is gone. It was the busiest element on the page,
          it ran continuously on mobile as well as desktop, and every name in
          PET_NAMES is invented — so it was fabricated social proof presented
          as a customer list. Restore it only with real names. */}

      <section className="surface-dark relative overflow-hidden bg-clay-deep py-24 text-paper md:py-32">
        {/* oversized mark, bled off the corner */}
        <LogoMark
          className="pointer-events-none absolute -bottom-24 -right-20 size-96 text-paper/10"
        />

        <div className="shell relative">
          <div className="max-w-2xl">
            {/* full-strength paper: on clay-deep, paper/50 is 2.22:1 */}
            <p className="eyebrow !text-paper">Sunbeam Records</p>

            <SplitReveal as="h2" className="mt-7 text-h2 !text-paper">
              Tell us about them. We&rsquo;ll take it from there.
            </SplitReveal>

            <Reveal delay={0.2}>
              {/* full-strength paper: paper/75 on clay-deep is only 3.55:1,
                  and paper/90 still only reaches 4.37:1 */}
              <p className="mt-7 max-w-lg text-[1.0625rem] leading-relaxed text-paper">
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
                  // paper/35 border was 1.88:1 — under the 3:1 that 1.4.11
                  // requires for a control boundary. /80 is 3.81:1.
                  className="!border-paper/80 !text-paper hover:!border-paper hover:!bg-paper/10"
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
