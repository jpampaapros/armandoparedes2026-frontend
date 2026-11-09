"use client";

import { useEffect, useMemo, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import Image from "next/image";
import { EmblaSlider } from "@/components/EmblaSlider";
import type { ACFImage, ProjectGaleriaTab } from "@/lib/types";

type GaleriaProyectoProps = {
  titulo?: string;
  descripcion?: string;
  tabs?: ProjectGaleriaTab[];
  color_fondo?: string;
  color_activo?: string;
  color_barra_tabs_movil?: string;
  color_active_tab_movil?: string;
  ocultar_en_movil?: boolean;
  titulo_flotante?: string;
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
  const { descripcion, tabs = [], color_fondo, color_barra_tabs_movil, color_active_tab_movil, ocultar_en_movil = false, titulo_flotante = "" } = props;
  // titulo se recibe por contrato de ACF pero no se rendera según Figma

  // Un único carrusel con las imágenes de todas las pestañas concatenadas: así el
  // cambio de pestaña usa el mismo deslizamiento que el cambio entre imágenes de
  // una misma pestaña (sin remount ni corte). `tabStarts` guarda el índice del
  // primer slide de cada pestaña para poder saltar a ella.
  const { slides, tabStarts } = useMemo(() => {
    const flat: { imagen?: ACFImage }[] = [];
    const starts: number[] = [];
    for (const tab of tabs) {
      starts.push(flat.length);
      for (const item of tab.imagenes || []) {
        flat.push({ imagen: item.imagen });
      }
    }
    return { slides: flat, tabStarts: starts };
  }, [tabs]);

  const [api, setApi] = useState<EmblaCarouselType>();
  const [selected, setSelected] = useState(0);
  // Pestaña a la que pertenece el slide seleccionado.
  const active = useMemo(() => {
    let tab = 0;
    for (let i = 0; i < tabStarts.length; i++) {
      if (tabStarts[i] <= selected) tab = i;
      else break;
    }
    return tab;
  }, [tabStarts, selected]);

  const activeTab = tabs[active] ?? { imagenes: [] };
  const activeDescription = activeTab.descripcion ?? (active === 0 ? descripcion : undefined);
  const tabStart = tabStarts[active] ?? 0;
  const tabImageCount = (tabs[active]?.imagenes || []).length;
  const localIndex = selected - tabStart;

  const goToTab = (tabIndex: number) => {
    const start = tabStarts[tabIndex];
    if (start == null) return;
    api?.scrollTo(start);
  };

  useEffect(() => {
    if (!api || slides.length === 0) return;
    let timer: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (api.canScrollNext()) api.scrollNext();
        else {
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
  }, [api, slides.length]);

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
            onClick={() => goToTab(i)}
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
          slides={slides}
          slideClassName="h-full overflow-hidden"
          onApiReady={(instance) => setApi(instance)}
          onSelectChange={setSelected}
          renderSlide={(slide) => (
            <div
              className="relative h-full w-full overflow-hidden"
              onDragStart={(event) => event.preventDefault()}
            >
              {slide.imagen?.url ? (
                <Image
                  src={slide.imagen.url}
                  alt={slide.imagen.alt || ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  draggable={false}
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
        {/* Bullets móvil: sólo cuentan las imágenes de la pestaña activa. */}
        {/* {tabImageCount > 0 && (
          <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 items-center gap-8 md:hidden">
            {Array.from({ length: tabImageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(tabStart + i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === localIndex ? "true" : undefined}
                className={`h-4 rounded-full transition-all ${i === localIndex ? "w-24 bg-white" : "w-12 bg-white/75"}`}
              />
            ))}
          </div>
        )} */}
        </div>
        {(activeTab.titulo || activeDescription) && (
          // Solo escritorio. El velo sale de la esquina y se desvanece hacia arriba y a la derecha, sin borde de caja.
          <div className="pointer-events-none absolute bottom-0 left-0 z-10 hidden w-[58%] max-w-680 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.5)_24%,rgba(0,0,0,0.18)_52%,transparent_74%)] pb-55 pl-40 pr-100 pt-120 md:block">
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
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/70 via-black/30 to-transparent px-20 pt-48 pb-50 font-poppins text-16 font-light leading-[1.4] text-white md:hidden [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: activeDescription }}
          />
        )}
        {titulo_flotante && (
          <div className="absolute top-20 left-20 md:left-40 z-10 font-gotham text-24 font-medium text-white">
            {titulo_flotante}
          </div>
        )}
        {tabs.length > 1 && (
          <div className="absolute bottom-14 md:bottom-16 left-1/2 z-10 flex -translate-x-1/2 items-center gap-8 shrink-0 items-center justify-center gap-8 py-16 md:flex">
            {tabs.map((tab, i) => (
              <button
                key={i}
                type="button"
                aria-label={tab.titulo || `Ir a la imagen ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goToTab(i)}
                className={`cursor-pointer h-4 md:h-8 rounded-full ${i === active ? "md:w-28 w-24 bg-white" : "md:w-14 w-12 bg-white/75"}`}
              />
            ))}
          </div>
        )}
      </div>
        {/* {tabs.length > 1 && (
          <div className="hidden shrink-0 items-center justify-center gap-8 bg-white py-16 md:flex">
            {tabs.map((tab, i) => (
              <button
                key={i}
                type="button"
                aria-label={tab.titulo || `Ir a la imagen ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goToTab(i)}
                className={`cursor-pointer h-8 rounded-full ${i === active ? "w-28 bg-near-black/40" : "w-14 bg-near-black/35"}`}
              />
            ))}
          </div>
        )} */}
    </section>
  );
}
