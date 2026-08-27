import SongCard from "@/components/audio/SongCard";
import { EXAMPLES } from "@/lib/content";

export default function Examples() {
  return (
    <section id="examples" className="band">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <h2 data-reveal className="text-section font-light">
            Every pet has a story.
          </h2>
          <p
            data-reveal
            data-reveal-delay="90"
            className="mx-auto mt-6 max-w-md text-lede text-body"
          >
            Three of them, and the songs they became.
          </p>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLES.map((song, i) => (
            <div key={song.id} data-reveal data-reveal-delay={String(i * 90)}>
              <SongCard song={song} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
