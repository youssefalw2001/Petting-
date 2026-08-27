import { STEPS, DETAILS } from "@/lib/content";

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
            <em className="font-display italic text-rose-deep">
              It&rsquo;s a song about yours.
            </em>
          </h2>
          <p
            data-reveal
            data-reveal-delay="90"
            className="mx-auto mt-7 max-w-lg text-lede text-body"
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
                className="font-display text-[1.75rem] font-light leading-none text-rose-deep"
              >
                {step.n}
              </span>
              <div>
                <h3 className="font-display text-sub font-light">{step.title}</h3>
                <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-body">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
