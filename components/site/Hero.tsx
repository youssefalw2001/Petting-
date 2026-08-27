import Photo from "@/components/ui/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { PHOTOS } from "@/lib/content";

/**
 * Centred type, then one wide photograph. Nothing else.
 *
 * No statistics, no floating cards, no collage. The whole job of this screen is
 * to say what this is in about five seconds and then get out of the way.
 */
export default function Hero() {
  return (
    <section className="pb-4 pt-36 sm:pt-44 md:pb-8 md:pt-52">
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <h1 data-reveal className="text-hero font-light">
            A song for the one
            <br className="hidden sm:block" /> you&rsquo;ll always remember.
          </h1>

          <p
            data-reveal
            data-reveal-delay="90"
            className="mx-auto mt-8 max-w-xl text-lede text-body"
          >
            A personalised song made from the memories, personality and moments
            you shared with your pet.
          </p>

          <div
            data-reveal
            data-reveal-delay="180"
            className="mt-11 flex flex-col items-center gap-5"
          >
            <ButtonLink href="/create/">Create Their Song</ButtonLink>
            <p className="text-[0.8125rem] tracking-[0.02em] text-muted">
              Made from your memories. Kept forever.
            </p>
          </div>
        </div>
      </div>

      <div className="shell mt-16 md:mt-24">
        <div data-reveal data-reveal-delay="120">
          <Photo
            photo={PHOTOS.hero}
            sizes="(max-width: 768px) 100vw, 1140px"
            ratio="8 / 5"
            priority
          />
        </div>
      </div>
    </section>
  );
}
