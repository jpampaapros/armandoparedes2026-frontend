import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type BlogImageSectionProps = {
  imagen?: ACFImage;
};

export function BlogImageSection({ imagen }: BlogImageSectionProps) {
  if (!imagen?.url) return null;

  return (
    <figure className="m-0 w-full">
      <div className="relative aspect-[382/314] w-full overflow-hidden md:aspect-[730/500]">
        <Image
          src={imagen.url}
          alt={imagen.alt || ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 730px"
        />
      </div>
    </figure>
  );
}
