import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type BlogImageSectionProps = {
  imagen?: ACFImage;
};

export function BlogImageSection({ imagen }: BlogImageSectionProps) {
  if (!imagen?.url) return null;

  return (
    <figure className="mx-auto my-0 min-w-0 max-w-full overflow-hidden">
      <Image
        src={imagen.url}
        alt={imagen.alt || ""}
        width={imagen.width ?? 730}
        height={imagen.height ?? 500}
        className="block h-auto w-full"
        sizes="(max-width: 768px) 92vw, calc(730 * var(--fx))"
      />
    </figure>
  );
}
