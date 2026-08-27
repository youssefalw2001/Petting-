import { ButtonLink } from "@/components/ui/Button";
import Magnetic from "@/components/ui/Magnetic";
import { TailMark } from "@/components/ui/Logo";

/**
 * The end of the page: a single amber bloom behind the last line.
 *
 * The one gradient on the site, and it carries meaning rather than decoration —
 * a light left on. Previously this section inverted to a light background, which
 * on a dark page would have been a jarring slab of white right before the footer.
 */
export default function Closing() {
  return (
    <section className="relative overflow-hidden border-t border-line band">
      <div className="bloom" aria-hidden="true" />

      <div className="shell relative">
        <div className="mx-auto max-w-2xl text-center">
          {/* wrapper carries data-reveal: TailMark only forwards className, so
              the attribute was being dropped and the mark never animated —
              which is why it stayed visible while the rest of the section
              didn't. */}
          <span data-reveal className="block">
            <TailMark className="mx-auto h-9 w-9 text-amber" />
          </span>

          <h2 data-reveal data-reveal-delay="70" className="mt-9 text-section font-extralight">
            Their story deserves
            <br className="hidden sm:block" /> to be remembered.
          </h2>

          <p
            data-reveal
            data-reveal-delay="140"
            className="mx-auto mt-7 max-w-md text-lede text-mid"
          >
            Give their memories a melody you&rsquo;ll always have.
          </p>

          <div data-reveal data-reveal-delay="210" className="mt-11">
            <Magnetic>
              <ButtonLink href="/create/">Create Their Song</ButtonLink>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
