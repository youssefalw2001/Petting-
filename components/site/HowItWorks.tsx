import { STEPS, DETAILS } from "@/lib/content";
import { PRICE } from "@/lib/config";

/**
 * Three steps on hairlines, with the personalisation line absorbed into the
 * opening paragraph rather than given a section of its own.
 */
export default function HowItWorks() {
  return (
    <section id="how" className="band">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <h2 data-reveal className="text-section font-light">
            It&rsquo;s not just a song about a pet.
            <br className="hidden sm:block" />{" "}
            <span className="text-amber">
              It&rsquo;s a song about yours.
            </span>
          </h2>
          <p
            data-reveal
            data-reveal-delay="90"
            className="mx-auto mt-7 max-w-lg text-lede text-mid"
          >
            Written from what you tell us — {DETAILS.join(", ")}. The small
            things, mostly. They tend to be the ones that matter.
          </p>
        </div>

        <ol className="mx-auto mt-16 max-w-3xl">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              data-reveal
              data-reveal-delay={String(i * 90)}
              className="grid gap-4 border-t border-line py-9 last:border-b sm:grid-cols-[5rem_1fr] sm:gap-8 sm:py-11"
            >
              <span
                aria-hidden="true"
                className="mono text-[1.125rem] leading-none text-amber"
              >
                {step.n}
              </span>
              <div>
                <h3 className="font-display text-sub font-light">{step.title}</h3>
                <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-mid">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p
          data-reveal
          className="mx-auto mt-10 max-w-3xl text-[0.9375rem] text-low"
        >
          {PRICE} for the song, delivered within 48 hours. You tell us about them
          first — nothing is charged until you&rsquo;ve done that and seen what
          you&rsquo;re paying for.
        </p>
      </div>
    </section>
  );
}
