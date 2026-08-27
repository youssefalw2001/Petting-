import { ButtonLink } from "@/components/ui/Button";

/** The natural end of the page. One line, one sentence, one button. */
export default function Closing() {
  return (
    <section className="surface-dark bg-ink band text-page">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <h2 data-reveal className="text-section font-light !text-page">
            Their story deserves to be remembered.
          </h2>

          <p
            data-reveal
            data-reveal-delay="90"
            className="mx-auto mt-7 max-w-md text-lede text-page/75"
          >
            Give their memories a melody you&rsquo;ll always have.
          </p>

          <div data-reveal data-reveal-delay="170" className="mt-11">
            <ButtonLink href="/create/" variant="onDark">
              Create Their Song
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
