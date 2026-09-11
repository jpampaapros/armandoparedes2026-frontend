"use client";

import { useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import Image from "next/image";
import { EmblaSlider } from "@/components/EmblaSlider";
import type { ProjectGaleriaTab } from "@/lib/types";

type GaleriaProyectoProps = {
  titulo?: string;
  descripcion?: string;
  tabs?: ProjectGaleriaTab[];
};

function TabButton({
  label,
  active,
  onClick,
}: {
  label?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="relative w-fit cursor-pointer border-0 bg-transparent p-0 pb-[calc(24*var(--fx))] text-left md:pb-[calc(8*var(--fx))]"
    >
      <span
        className={`font-gotham text-20 md:text-32 ${
          active ? "font-medium text-white" : "font-light text-white"
        }`}
      >
        {label}
      </span>
      {active && (
        <span className="absolute bottom-0 left-0 h-px w-full bg-white md:w-192" />
      )}
    </button>
  );
}

export function GaleriaProyecto(props: GaleriaProyectoProps) {
  const { descripcion, tabs = [] } = props;
  // titulo se recibe por contrato de ACF pero no se rendera según Figma
  const [active, setActive] = useState(0);
  const [carousel, setCarousel] = useState<{ tab: number; api: EmblaCarouselType }>();
  const activeTab = tabs[active] ?? { imagenes: [] };
  const activeDescription = activeTab.descripcion ?? (active === 0 ? descripcion : undefined);

  useEffect(() => {
    if (!carousel || carousel.tab !== active || tabs.length === 0) return;
    const { api } = carousel;
    let timer: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
          scheduleNext();
        }
      }, 3000);
    };
    const pause = () => clearTimeout(timer);

    scheduleNext();
    api.on("select", scheduleNext).on("pointerDown", pause).on("pointerUp", scheduleNext);
    return () => {
      clearTimeout(timer);
      api.off("select", scheduleNext).off("pointerDown", pause).off("pointerUp", scheduleNext);
    };
  }, [active, carousel, tabs.length]);

  return (
    <section
      data-layout="galeria"
      className="flex w-full flex-col overflow-hidden md:h-800 md:flex-row"
    >
      <div className="relative h-430 w-full md:h-full md:flex-[1105]">
        <EmblaSlider
          key={active}
          slides={activeTab.imagenes || []}
          onApiReady={(api) => setCarousel({ tab: active, api })}
          renderSlide={(slide) => (
            <div className="relative h-full w-full">
              {slide?.imagen?.url ? (
                <Image
                  src={slide.imagen.url}
                  alt={slide.imagen.alt || ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-neutral-800" />
              )}
            </div>
          )}
          loop={false}
          showArrows={false}
          showBullets={false}
        />
      </div>

      <div className="flex w-full flex-col bg-near-black px-16 pt-34 pb-47 md:h-full md:w-340 md:px-35 md:pt-90 md:pb-58">
        <div className="flex flex-row gap-28 md:flex-col md:gap-30">
          {tabs.map((tab, i) => (
            <TabButton
              key={i}
              label={tab.titulo}
              active={i === active}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        {activeDescription && (
          <div
            className="mt-61 font-poppins text-16 font-light leading-[1.4] text-white md:mt-auto md:text-20 [&_p]:m-0" /* leading-[1.4] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */
            dangerouslySetInnerHTML={{ __html: activeDescription }}
          />
        )}
      </div>
    </section>
  );
}
