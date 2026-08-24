import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type BlogGallerySectionProps = {
  imagenes?: { imagen?: ACFImage }[];
};

export function BlogGallerySection({ imagenes }: BlogGallerySectionProps) {
  if (!imagenes || imagenes.length === 0) return null;

  return (
    <div className="grid min-w-0 max-w-full grid-cols-1 gap-16 overflow-hidden md:grid-cols-2 md:gap-20">
      {imagenes.map((item, index) =>
        item?.imagen?.url ? (
          <div
            key={`${item.imagen.ID ?? item.imagen.id ?? index}`}
            className={`mx-auto w-full overflow-hidden ${
              imagenes.length === 1 || (imagenes.length % 2 !== 0 && index === imagenes.length - 1)
                ? "md:col-span-2"
                : ""
            }`}
          >
            <Image
              src={item.imagen.url}
              alt={item.imagen.alt || `Imagen ${index + 1} de la galería`}
              width={item.imagen.width ?? 730}
              height={item.imagen.height ?? 500}
              className="block h-auto w-full"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : null,
      )}
    </div>
  );
}
