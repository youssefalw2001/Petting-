import Image from "next/image";
import { asset } from "@/lib/asset";
import type { Photo as PhotoType } from "@/lib/content";

/**
 * Photography, with an honest placeholder state.
 *
 * `asset()` rather than a bare path: static export forces
 * `images.unoptimized`, and in that mode next/image emits the src verbatim
 * without applying basePath — so on a project GitHub Pages URL every image
 * would 404.
 *
 * When a photo is still a stand-in it says so, quietly, in the corner. The
 * alternative is shipping a memorial brand illustrated with tonal rectangles
 * and not noticing.
 */
export default function Photo({
  photo,
  sizes,
  priority = false,
  className = "",
  ratio = "4 / 5",
  note = true,
}: {
  photo: PhotoType;
  sizes: string;
  priority?: boolean;
  className?: string;
  ratio?: string;
  /**
   * Off for thumbnails. At 88px the placeholder note wraps to two lines and
   * becomes the loudest thing in the row; the message is already carried by
   * the full-size photographs above.
   */
  note?: boolean;
}) {
  return (
    <figure
      className={`relative overflow-hidden rounded-[3px] bg-raise ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={asset(photo.src)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {photo.placeholder && note && (
        <figcaption className="absolute bottom-0 left-0 px-3.5 py-3 text-[0.5625rem] uppercase tracking-[0.2em] text-muted">
          Photograph to follow
        </figcaption>
      )}
    </figure>
  );
}
