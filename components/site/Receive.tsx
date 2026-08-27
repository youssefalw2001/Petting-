import Photo from "@/components/ui/Photo";
import SongPlayer from "@/components/audio/SongPlayer";
import { FEATURED, PHOTOS } from "@/lib/content";

/**
 * The emotional turn and the product demonstration, folded into one section.
 *
 * They were two separate bands — "some memories deserve more than a photograph"
 * on its own, then the player further down. Merging them makes both stronger: the
 * line sets up an argument that the photograph beside it and the song beneath it
 * immediately answer. It also removes an entire section from the page.
 */
export default function Receive() {
  return (
    <section className="border-y border-line bg-surface band">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <h2 data-reveal className="text-section font-light">
            Some memories deserve
            <br className="hidden sm:block" /> more than a photograph.
          </h2>
          <p
            data-reveal
            data-reveal-delay="90"
            className="mx-auto mt-7 max-w-lg text-lede text-mid"
          >
            When a pet becomes part of your family, losing them leaves an empty
            space. We turn the memories you shared into an original song.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-12 md:mt-20 md:grid-cols-2 md:gap-16">
          <div data-reveal>
            <Photo
              photo={PHOTOS[FEATURED.photo]}
              sizes="(max-width: 768px) 100vw, 520px"
              ratio="1 / 1"
              className="rounded-[2px]"
            />
          </div>
          <div data-reveal data-reveal-delay="110">
            <SongPlayer song={FEATURED} />
          </div>
        </div>
      </div>
    </section>
  );
}
