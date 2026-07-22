"use client";

import Image from "next/image";
import { EmblaSlider } from "@/components/EmblaSlider";
import type { ACFImage } from "@/lib/types";

type Slide = {
  imagen_fondo?: ACFImage;
  titulo?: string;
  descripcion?: string;
};

type BannerPreLanzamientoProps = {
  badge?: string;
  slides?: Slide[];
};

export function BannerPreLanzamiento({
  badge,
  slides = [],
}: BannerPreLanzamientoProps) {
  if (slides.length === 0) return null;

  return (
    <section
      data-layout="banner_pre_lanzamiento"
      className="relative h-[calc(672*var(--fx))] w-full overflow-hidden md:h-[calc(700*var(--fx))]"
    >
      {badge && (
        <span className="absolute top-0 left-1/2 z-20 hidden -translate-x-1/2 bg-peach px-24 py-12 font-poppins text-20 font-medium text-white md:inline-block">
          {badge}
        </span>
      )}
      <EmblaSlider
        slides={slides}
        className="h-full"
        viewportClassName="h-full"
        effect="slide"
        loop={slides.length > 1}
        draggable={slides.length > 1}
        showArrows={false}
        showBullets={{ mobile: false, desktop: slides.length > 1 }}
        bulletClassName="h-[calc(6*var(--fx))] rounded-none transition-all"
        bulletActiveClassName="w-[calc(91*var(--fx))] bg-white"
        bulletInactiveClassName="w-[calc(27*var(--fx))] bg-white/80"
        renderSlide={(slide) => (
          <div className="relative h-full w-full">
            {slide.imagen_fondo?.url && (
              <Image
                src={slide.imagen_fondo.url}
                alt={slide.imagen_fondo.alt || slide.titulo || ""}
                fill
                priority
                className="object-cover md:object-fill"
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center text-white md:px-80">
              {slide.titulo && (
                <h2 className="font-gotham-black text-36 leading-[1] md:text-80">
                  {slide.titulo}
                </h2>
              )}
              {slide.descripcion && (
                <div
                  className="mt-16 font-gotham text-16 font-medium leading-[1.3] md:mt-24 md:text-27"
                  dangerouslySetInnerHTML={{ __html: slide.descripcion }}
                />
              )}
            </div>
          </div>
        )}
      />
    </section>
  );
}
