import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { PHOTOS } from "@/lib/content";
import { asset } from "@/lib/asset";

/**
 * Type, then one photograph edge to edge.
 *
 * The photograph is deliberately full-bleed and tall. The first version kept it
 * inside the 1140px shell with margins and a corner radius, and the result read
 * as a document rather than a place — the single biggest reason the page felt
 * plain. Letting one image run to both edges is most of the difference between
 * "minimal" and "empty".
 *
 * A soft ivory fade at the base carries the photograph into the page instead of
 * stopping it with a hard line.
 */
export default function Hero() {
  return (
    <section className="pt-32 sm:pt-36 md:pt-40">
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

      {/* full-bleed, no radius, no shell */}
      <div
        data-reveal
        data-reveal-delay="120"
        className="relative mt-12 h-[54vh] min-h-[20rem] w-full overflow-hidden md:mt-14 md:h-[64vh]"
      >
        {/* object-position tuned by eye rather than arithmetic: this keeps the
            dog's eyes inside the visible band once the container crops the 8:5
            image at desktop widths. */}
        <Image
          src={asset(PHOTOS.hero.src)}
          alt={PHOTOS.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_58%]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-page" />
      </div>
    </section>
  );
}
