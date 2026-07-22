"use client";

import Image from "next/image";
import { EmblaSlider } from "@/components/EmblaSlider";
import type { ACFImage } from "@/lib/types";

type GaleriaProps = {
  imagenes?: ACFImage[];
};

export function Galeria({ imagenes }: GaleriaProps) {
  const images = (imagenes ?? []).filter((image) => image?.url);
  if (images.length === 0) return null;

  return (
    <section data-section="galeria" className="relative h-552 w-full md:h-700">
      <EmblaSlider
        slides={images}
        slidesPerView={1}
        gap={0}
        loop={images.length > 1}
        draggable={images.length > 1}
        showArrows={false}
        showBullets={true}
        bulletsContainerClassName="bottom-40 gap-3 md:bottom-120"
        bulletClassName="h-6 w-27 rounded-none"
        bulletInactiveClassName="bg-white/80"
        bulletActiveClassName="w-91 bg-white"
        renderSlide={(slide) => (
          <div className="relative h-full w-full">
            <Image
              src={slide.url!}
              alt={slide.alt || ""}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/15" />
          </div>
        )}
      />
    </section>
  );
}
