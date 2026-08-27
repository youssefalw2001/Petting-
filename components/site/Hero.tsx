import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import Lines from "@/components/ui/Lines";
import Parallax from "@/components/ui/Parallax";
import { PHOTOS } from "@/lib/content";
import { asset } from "@/lib/asset";

/**
 * Type, then one photograph edge to edge.
 *
 * On a near-black page the photograph stops being a picture on paper and starts
 * behaving like a light source, which is where the cinematic quality comes from.
 * It fades to the page black top and bottom so it dissolves into the sections
 * rather than stopping at a line.
 *
 * Three pieces of motion, all cheap: the headline rises line by line, the image
 * settles from a slight scale once on load, and it drifts against the scroll.
 */
export default function Hero() {
  return (
    <section className="pt-28 sm:pt-32 md:pt-36">
      <div className="shell">
        <div className="mx-auto max-w-5xl text-center">
          <p data-reveal className="label">
            In memory
          </p>

          <Lines
            as="h1"
            className="mt-7 text-hero font-extralight"
            delay={80}
            step={110}
            lines={["A song for the one", "you'll always remember."]}
          />

          <p
            data-reveal
            data-reveal-delay="330"
            className="mx-auto mt-8 max-w-xl text-lede text-mid"
          >
            A personalised song made from the memories, personality and moments
            you shared with your pet.
          </p>

          <div
            data-reveal
            data-reveal-delay="420"
            className="mt-11 flex flex-col items-center gap-5"
          >
            <ButtonLink href="/create/">Create Their Song</ButtonLink>
            <p className="label">Made from your memories · Kept forever</p>
          </div>
        </div>
      </div>

      <div className="relative mt-9 h-[56vh] min-h-[20rem] w-full overflow-hidden md:mt-10 md:h-[66vh]">
        {/* Parallax sits outside, scale-settle inside, so the two transforms
            never fight over the same element. */}
        <Parallax strength={0.1} className="absolute inset-0">
          <div className="photo-settle absolute inset-0">
            {/* object-position tuned by eye so the dog's eyes stay inside the
                visible band once the container crops the 8:5 image. */}
            <Image
              src={asset(PHOTOS.hero.src)}
              alt={PHOTOS.hero.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[64%_70%]"
            />
          </div>
        </Parallax>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-base" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-base" />
      </div>
    </section>
  );
}
