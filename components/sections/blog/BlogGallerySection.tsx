import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type BlogGallerySectionProps = {
  imagenes?: { imagen?: ACFImage }[];
};

export function BlogGallerySection({ imagenes }: BlogGallerySectionProps) {
  if (!imagenes || imagenes.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
      {imagenes.map((item, index) =>
        item?.imagen?.url ? (
          <div
            key={`${item.imagen.ID ?? item.imagen.id ?? index}`}
            className={`relative w-full overflow-hidden ${
              imagenes.length === 1 || (imagenes.length % 2 !== 0 && index === imagenes.length - 1)
                ? "aspect-[16/9] md:col-span-2"
                : "aspect-[16/9]"
            }`}
          >
            <Image
              src={item.imagen.url}
              alt={item.imagen.alt || `Imagen ${index + 1} de la galería`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : null,
      )}
    </div>
  );
}
