"use client";

import { useState } from "react";
import Image from "next/image";
import { EmblaSlider } from "@/components/EmblaSlider";
import type { ACFImage } from "@/lib/types";

type GaleriaProyectoProps = {
  titulo?: string;
  descripcion?: string;
  tabs?: { titulo?: string; imagenes?: { imagen?: ACFImage }[] }[];
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
      className="relative w-fit border-0 bg-transparent p-0 pb-[calc(16*var(--fx))] text-left md:pb-0"
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
  const activeTab = tabs[active] ?? { imagenes: [] };

  return (
    <section
      data-layout="galeria"
      className="flex w-full flex-col overflow-hidden md:h-800 md:flex-row"
    >
      <div className="relative h-430 w-full md:h-full md:flex-[1105]">
        <EmblaSlider
          slides={activeTab.imagenes || []}
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
          showBullets={{
            mobile: false,
            desktop: (activeTab.imagenes?.length ?? 0) > 1,
          }}
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

        {descripcion && (
          <div
            className="mt-61 font-poppins text-16 font-light leading-[1.4] text-white md:mt-auto md:text-20 [&_p]:m-0" /* leading-[1.4] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */
            dangerouslySetInnerHTML={{ __html: descripcion }}
          />
        )}
      </div>
    </section>
  );
}
