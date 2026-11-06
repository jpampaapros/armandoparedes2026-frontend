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
  ocultar_en_movil?: boolean;
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
        // El color del admin solo pinta el tab móvil. En desktop el activo se queda blanco.
        style={onBar && active && activeColor ? { color: activeColor } : undefined}
        className={
          onBar
            ? `font-gotham text-16 ${active ? "font-bold text-near-black" : "font-light text-warm-gray"}`
            : `font-gotham text-20 md:text-26 ${active ? "font-medium text-white" : "font-light text-white"}`
        }
      >
        {label}
      </span>
      {active && (
        <span
          className={`absolute bottom-0 left-0 w-full ${onBar ? "h-2" : "h-px bg-white"}`}
          style={onBar ? { backgroundColor: activeColor || "#c4786a" } : undefined}
        />
      )}
    </button>
  );
}

export function GaleriaProyecto(props: GaleriaProyectoProps) {
  const { descripcion, tabs = [], color_fondo, color_barra_tabs_movil, color_active_tab_movil, ocultar_en_movil = false } = props;
  // titulo se recibe por contrato de ACF pero no se rendera según Figma
  const [active, setActive] = useState(0);
  const [carousel, setCarousel] = useState<{ tab: number; api: EmblaCarouselType }>();
  const activeTab = tabs[active] ?? { imagenes: [] };
  const activeDescription = activeTab.descripcion ?? (active === 0 ? descripcion : undefined);

  useEffect(() => {
    if (!carousel || carousel.tab !== active || tabs.length === 0) return;
    const { api } = carousel;
    let timer: ReturnType<typeof setTimeout>;
    // Arrastre más allá del borde (px). Positivo = hacia la siguiente pestaña.
    let overscroll = 0;

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

    const resetOverscroll = () => {
      overscroll = 0;
    };
    // En móvil: una sola imagen cambia de pestaña al swipe; con varias, solo al pasar la última o la primera.
    const trackOverscroll = () => {
      if (!window.matchMedia("(max-width: 767px)").matches) return;
      if (!api.internalEngine().dragHandler.pointerDown()) return;
      const { limit, location } = api.internalEngine();
      const pastEnd = limit.max - location.get();
      const pastStart = location.get() - limit.min;
      if (pastEnd > Math.abs(overscroll)) overscroll = pastEnd;
      if (pastStart > Math.abs(overscroll)) overscroll = -pastStart;
    };
    const swipeToTab = () => {
      if (!window.matchMedia("(max-width: 767px)").matches || tabs.length < 2) return;
      const snaps = api.scrollSnapList().length;
      const index = api.selectedScrollSnap();
      const threshold = 48;
      const atEnd = snaps <= 1 || index === snaps - 1;
      const atStart = snaps <= 1 || index === 0;
      if (overscroll > threshold && atEnd) {
        clearTimeout(timer);
        setActive((current) => (current + 1) % tabs.length);
      } else if (overscroll < -threshold && atStart) {
        clearTimeout(timer);
        setActive((current) => (current - 1 + tabs.length) % tabs.length);
      }
    };

    scheduleNext();
    api.on("select", scheduleNext).on("pointerDown", pause).on("pointerDown", resetOverscroll).on("scroll", trackOverscroll).on("pointerUp", swipeToTab).on("pointerUp", scheduleNext);
    return () => {
      clearTimeout(timer);
      api.off("select", scheduleNext).off("pointerDown", pause).off("pointerDown", resetOverscroll).off("scroll", trackOverscroll).off("pointerUp", swipeToTab).off("pointerUp", scheduleNext);
    };
  }, [active, carousel, tabs.length]);

  return (
    <section
      data-layout="galeria"
      className={`w-full flex-col overflow-hidden ${ocultar_en_movil ? "hidden md:flex" : "flex"}`}
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

      {/* El carrusel va en absolute: su alto no entra en el flujo. El marco es el único que mide, y overflow recorta la foto. */}
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{ height: "calc(640 * var(--fx))", maxHeight: "calc(640 * var(--fx))", contain: "size" }}
      >
        <div className="absolute inset-0">
        <EmblaSlider
          key={active}
          slides={activeTab.imagenes || []}
          slideClassName="h-full overflow-hidden"
          onApiReady={(api) => setCarousel({ tab: active, api })}
          renderSlide={(slide) => (
            <div className="relative h-full w-full overflow-hidden">
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
        </div>
        {(activeTab.titulo || activeDescription) && (
          // Solo escritorio. El velo sale de la esquina y se desvanece hacia arriba y a la derecha, sin borde de caja.
          <div className="pointer-events-none absolute bottom-0 left-0 z-10 hidden w-[58%] max-w-680 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.5)_24%,rgba(0,0,0,0.18)_52%,transparent_74%)] pb-35 pl-40 pr-100 pt-120 md:block">
            <div className="max-w-420">
              {activeTab.titulo && (
                <p className="m-0 font-gotham text-24 font-medium text-white">{activeTab.titulo}</p>
              )}
              {activeDescription && (
                <div
                  className="mt-8 font-poppins text-16 font-light leading-[1.4] text-white [&_p]:m-0 [&_p+p]:mt-8"
                  dangerouslySetInnerHTML={{ __html: activeDescription }}
                />
              )}
            </div>
          </div>
        )}
        {activeDescription && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/70 via-black/30 to-transparent px-20 pt-48 pb-40 font-poppins text-16 font-light leading-[1.4] text-white md:hidden [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: activeDescription }}
          />
        )}
      </div>
        {tabs.length > 1 && (
          <div className="hidden shrink-0 items-center justify-center gap-8 bg-white py-16 md:flex">
            {tabs.map((tab, i) => (
              <button
                key={i}
                type="button"
                aria-label={tab.titulo || `Ir a la imagen ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => setActive(i)}
                className={`cursor-pointer h-8 rounded-full ${i === active ? "w-28 bg-near-black/40" : "w-14 bg-near-black/35"}`}
              />
            ))}
          </div>
        )}
    </section>
  );
}
