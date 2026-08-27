/**
 * The emotional turn, immediately after the hero.
 *
 * One line and one paragraph. No cards, no icons, no imagery — the silence
 * around the words is the design.
 */
export default function Opening() {
  return (
    <section className="band">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <h2 data-reveal className="text-section font-light">
            Some memories deserve
            <br className="hidden sm:block" /> more than a photograph.
          </h2>

          <p
            data-reveal
            data-reveal-delay="90"
            className="mx-auto mt-8 max-w-lg text-lede text-body"
          >
            When a pet becomes part of your family, losing them leaves an empty
            space. We turn the memories you shared into an original song —
            something you can listen to whenever you miss them.
          </p>
        </div>
      </div>
    </section>
  );
}
