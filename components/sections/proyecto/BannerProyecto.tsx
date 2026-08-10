"use client";

import Image from "next/image";
import { EmblaSlider } from "@/components/EmblaSlider";
import type { ACFImage } from "@/lib/types";

type BannerProyectoProps = {
  badge?: string;
  distrito?: string;
  logo?: ACFImage;
  slides?: { imagen?: ACFImage }[];
};

export function BannerProyecto({ badge, distrito, logo, slides = [] }: BannerProyectoProps) {
  const items = slides.length > 0 ? slides : [{ imagen: logo }];

  return (
    <section
      data-layout="banner_proyecto"
      className="relative h-672 w-full overflow-hidden md:h-700"
    >
      <EmblaSlider
        slides={items}
        renderSlide={(slide) => (
          <div className="relative h-full w-full">
            {slide?.imagen?.url ? (
              <Image
                src={slide.imagen.url}
                alt={slide.imagen.alt || ""}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-neutral-800" />
            )}
            <div className="absolute inset-0 bg-black/35" />
          </div>
        )}
        loop={items.length > 1}
        draggable={items.length > 1}
        showArrows={false}
        showBullets={{ mobile: false, desktop: items.length > 1 }}
        gap={0}
        bulletsContainerClassName="bottom-120 gap-3"
        bulletClassName="h-6 w-27 rounded-none bg-white/80 shrink-0"
        bulletActiveClassName="w-91 bg-white"
      />

      {badge && (
        <div className="absolute top-0 left-1/2 hidden -translate-x-1/2 bg-slate px-24 py-12 md:flex md:px-48 md:py-16">
          <span className="font-poppins text-14 font-medium text-white md:text-20">
            {badge}
          </span>
        </div>
      )}

      {logo?.url && (
        <div className="absolute left-1/2 top-257 h-100 w-380 -translate-x-1/2 md:top-143 md:h-141 md:w-612">
          <Image
            src={logo.url}
            alt={logo.alt || ""}
            fill
            sizes="(max-width: 768px) 380px, 612px"
            className="object-contain"
            priority
          />
        </div>
      )}

      {distrito && (
        <div className="absolute left-1/2 top-405 w-274 -translate-x-1/2 border border-white px-24 py-10 md:top-312 md:px-48 md:py-12 text-center">
          <span className="font-poppins text-18 text-white md:text-24">
            {distrito}
          </span>
        </div>
      )}
    </section>
  );
}
