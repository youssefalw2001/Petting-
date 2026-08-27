import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { PHOTOS } from "@/lib/content";
import { asset } from "@/lib/asset";

/**
 * Type, then one photograph edge to edge.
 *
 * On a near-black page the photograph stops being a picture on paper and starts
 * behaving like a light source, which is most of where the cinematic quality
 * comes from. The fade at its base is now to the page black, so the image
 * dissolves into the section beneath instead of stopping at a line.
 */
export default function Hero() {
  return (
    <section className="pt-28 sm:pt-32 md:pt-36">
      <div className="shell">
        <div className="mx-auto max-w-5xl text-center">
          <p data-reveal className="label">
            In memory
          </p>

          <h1 data-reveal data-reveal-delay="60" className="mt-7 text-hero font-extralight">
            A song for the one
            <br className="hidden sm:block" /> you&rsquo;ll always remember.
          </h1>

          <p
            data-reveal
            data-reveal-delay="130"
            className="mx-auto mt-8 max-w-xl text-lede text-mid"
          >
            A personalised song made from the memories, personality and moments
            you shared with your pet.
          </p>

          <div
            data-reveal
            data-reveal-delay="210"
            className="mt-11 flex flex-col items-center gap-5"
          >
            <ButtonLink href="/create/">Create Their Song</ButtonLink>
            <p className="label">Made from your memories · Kept forever</p>
          </div>
        </div>
      </div>

      <div
        data-reveal
        data-reveal-delay="140"
        className="relative mt-9 h-[56vh] min-h-[20rem] w-full overflow-hidden md:mt-10 md:h-[66vh]"
      >
        {/* object-position tuned by eye, so the dog's eyes stay inside the
            visible band once the container crops the 8:5 image. */}
        <Image
          src={asset(PHOTOS.hero.src)}
          alt={PHOTOS.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_70%]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-base" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-base" />
      </div>
    </section>
  );
}
