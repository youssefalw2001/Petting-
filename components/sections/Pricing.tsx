import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { CheckIcon } from "@/components/ui/icons";
import { TIERS } from "@/lib/data";

/**
 * Tiers drawn as record centre labels.
 *
 * The ladder is the whole business model: Digital exists to make Keepsake look
 * obvious, and Forever exists to make Keepsake look reasonable. Keepsake is
 * where the margin lives, so it's pre-selected and lifted.
 *
 * Replace each `href` with a Stripe Payment Link — no backend needed to launch.
 */
export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-clay" />
            Pressings
          </p>
          <SplitReveal as="h2" className="mt-6 text-h2">
            One song. Three ways to keep it.
          </SplitReveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-7">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.id} delay={i * 0.1} start="top 88%">
              <div
                className={[
                  "relative flex h-full flex-col rounded-[3px] border p-7 md:p-8",
                  tier.featured
                    ? "border-clay bg-paper shadow-[0_28px_70px_-32px_rgba(31,27,24,0.32)] lg:-mt-4 lg:pb-11"
                    : "border-rule bg-paper/60",
                ].join(" ")}
              >
                {tier.featured && (
                  <span className="absolute -top-[0.7rem] left-7 rounded-[2px] bg-clay px-2.5 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-paper">
                    Most chosen
                  </span>
                )}

                {/* centre-label header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-h3">{tier.name}</h3>
                    <p className="mt-1.5 text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-ink-faint">
                      {tier.catalog}
                    </p>
                  </div>
                  <LogoMark
                    className={[
                      "size-8 shrink-0",
                      tier.featured ? "text-clay" : "text-ink/22",
                    ].join(" ")}
                  />
                </div>

                <p
                  className="wonk mt-7 font-display text-[2.75rem] leading-none text-ink"
                  aria-label={`${tier.price} one time`}
                >
                  {tier.price}
                </p>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {tier.summary}
                </p>

                <ul className="mt-7 flex flex-1 flex-col gap-3 border-t border-rule-soft pt-6">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[0.9375rem] leading-snug text-ink-soft"
                    >
                      <CheckIcon
                        className={[
                          "mt-[0.15em] size-4 shrink-0",
                          tier.featured ? "text-clay" : "text-ink-faint",
                        ].join(" ")}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href="#"
                  size="lg"
                  variant={tier.featured ? "primary" : "outline"}
                  className="mt-8 w-full"
                >
                  {tier.cta}
                </ButtonLink>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Legacy tier, as a footnote rather than a fourth card */}
        <Reveal delay={0.15} start="top 92%">
          <div className="mt-12 flex flex-col gap-4 rounded-[3px] border border-rule bg-paper-deep/70 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="wonk font-display text-[1.375rem] leading-none text-ink">
                Legacy — $397
              </p>
              <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
                A twenty-minute call so we hear the stories in your voice, two
                songs, and a framed pressing. For the ones where one song
                isn&rsquo;t going to cover it.
              </p>
            </div>
            <ButtonLink href="#" variant="outline" className="shrink-0">
              Enquire
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
