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
  color_fondo?: string;
  color_activo?: string;
  color_barra_tabs_movil?: string;
  color_active_tab_movil?: string;
};

function TabButton({
  label,
  active,
  onClick,
  activeColor,
  onBar = false,
}: {
  label?: string;
  active: boolean;
  onClick: () => void;
  activeColor?: string;
  onBar?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative w-fit shrink-0 cursor-pointer border-0 bg-transparent p-0 text-left ${onBar ? "pb-8" : "pb-24 md:pb-8"}`}
    >
      <span
        style={{ color: !onBar && active ? activeColor || undefined : undefined }}
        className={
          onBar
            ? `font-gotham text-16 ${active ? "font-medium text-near-black" : "font-light text-warm-gray"}`
            : `font-gotham text-20 md:text-26 ${active ? "font-medium text-white" : "font-light text-white"}`
        }
      >
        {label}
      </span>
      {active && (
        <span
          className={`absolute bottom-0 left-0 w-full ${onBar ? "h-2" : "h-px bg-white"}`}
          style={{ backgroundColor: activeColor || (onBar ? "#c4786a" : undefined) }}
        />
      )}
    </button>
  );
}

export function GaleriaProyecto(props: GaleriaProyectoProps) {
  const { descripcion, tabs = [], color_fondo, color_activo, color_barra_tabs_movil, color_active_tab_movil } = props;
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
        } else if (tabs.length > 1) {
          setActive((current) => (current + 1) % tabs.length);
        } else {
          api.scrollTo(0);
          scheduleNext();
        }
      }, 5000);
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
      <div className="flex gap-24 overflow-x-auto  px-20 py-16 md:hidden"
       style={{ backgroundColor: color_barra_tabs_movil || '#ffffff' }}>
        {tabs.map((tab, i) => (
          <TabButton
            key={i}
            label={tab.titulo}
            active={i === active}
            activeColor={color_active_tab_movil}
            onBar
            onClick={() => setActive(i)}
          />
        ))}
      </div>

      <div className="relative h-640 w-full md:h-full md:flex-[1105]">
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
          showBullets={{ mobile: true, desktop: false }}
          bulletsContainerClassName="bottom-16 gap-8"
          bulletClassName="h-4 rounded-full"
          bulletActiveClassName="w-24 bg-white"
          bulletInactiveClassName="w-12 bg-white/75"
        />
        {activeDescription && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/70 via-black/30 to-transparent px-20 pt-48 pb-40 font-poppins text-16 font-light leading-[1.4] text-white md:hidden [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: activeDescription }}
          />
        )}
      </div>

      <div className="hidden w-full flex-col bg-near-black px-16 pt-34 pb-47 md:flex md:h-full md:w-340 md:px-35 md:pt-90 md:pb-58" style={{ backgroundColor: color_fondo || undefined }}>
        <div className="flex flex-row gap-28 md:flex-col md:gap-30">
          {tabs.map((tab, i) => (
            <TabButton
              key={i}
              label={tab.titulo}
              active={i === active}
              activeColor={color_activo}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        {activeDescription && (
          <div
            className="mt-61 font-poppins text-16 font-light leading-[1.4] text-white md:mt-auto md:text-18 [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: activeDescription }}
          />
        )}
      </div>
    </section>
  );
}
