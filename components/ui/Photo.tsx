import Image from "next/image";
import { asset } from "@/lib/asset";
import type { Photo as PhotoType } from "@/lib/content";

/**
 * `asset()` rather than a bare path: static export forces
 * `images.unoptimized`, and in that mode next/image emits the src verbatim
 * without applying basePath — so on a project GitHub Pages URL every photograph
 * would 404.
 */
export default function Photo({
  photo,
  sizes,
  priority = false,
  className = "",
  ratio = "4 / 5",
  position = "center",
}: {
  photo: PhotoType;
  sizes: string;
  priority?: boolean;
  className?: string;
  ratio?: string;
  position?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-surface ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={asset(photo.src)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
