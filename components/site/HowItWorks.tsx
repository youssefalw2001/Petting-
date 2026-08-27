import { STEPS } from "@/lib/content";

/** Three steps, numbered, on hairlines. No illustrations. */
export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-line bg-raise band">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <h2 data-reveal className="text-section font-light">
            How it works
          </h2>
        </div>

        <ol className="mx-auto mt-14 max-w-3xl">
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
