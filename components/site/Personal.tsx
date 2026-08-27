import { DETAILS } from "@/lib/content";

/**
 * The strongest line in the brief, given a whole section and almost nothing
 * else. The list of what goes into a song reads as one sentence rather than
 * bullets — six bulleted items here would have been six too many.
 */
export default function Personal() {
  return (
    <section className="band">
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
            className="mx-auto mt-8 max-w-lg text-lede text-body"
          >
            Every song is written from what you tell us — {DETAILS.join(", ")}.
            The small things, mostly. They are usually the ones that matter.
          </p>
        </div>
      </div>
    </section>
  );
}
