import Photo from "@/components/ui/Photo";
import SongPlayer from "@/components/audio/SongPlayer";
import { FEATURED, PHOTOS } from "@/lib/content";

/** What you actually receive: a photograph, a name, and a song you can play. */
export default function Receive() {
  return (
    <section className="border-y border-line bg-raise band">
      <div className="shell">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div data-reveal>
            <Photo
              photo={PHOTOS[FEATURED.photo]}
              sizes="(max-width: 768px) 100vw, 520px"
              ratio="4 / 5"
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
