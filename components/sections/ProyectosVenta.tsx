"use client";

import { useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { EmblaSlider } from "@/components/EmblaSlider";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilters, useProjectFilters } from "@/components/ProjectFilters";
import type { Project } from "@/lib/types";

type ProyectosVentaProps = {
  titulo?: string;
  proyectos: Project[];
  dataLayout?: string;
};

export function ProyectosVenta({ titulo, proyectos, dataLayout }: ProyectosVentaProps) {
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);
  const mobileTitle = titulo?.match(/^(.*?)\s+(en\s+venta)$/i);
  const { filtered, filters } = useProjectFilters(proyectos);

  return (
    <section data-layout={dataLayout} className="w-full bg-white px-15 md:px-4 py-52 md:py-90">
      <div className="mx-auto max-w-1440 px-0 md:px-80">
        <div className="mb-40 flex flex-col gap-24 md:flex-row md:items-center md:justify-between">
          {titulo && (
            <h2 className="my-0 text-center md:text-left font-gotham text-36 font-bold leading-[1.1] text-slate md:text-55">
              {mobileTitle ? (
                <>
                  <span className="block md:hidden">{mobileTitle[1]}</span>
                  <span className="block md:hidden">{mobileTitle[2]}</span>
                  <span className="hidden md:inline">{titulo}</span>
                </>
              ) : (
                titulo
              )}
            </h2>
          )}
          <ProjectFilters
            filters={filters}
            className="grid grid-cols-2 gap-16 max-md:[&>:first-child]:col-span-2 md:flex md:flex-row md:gap-24"
            styles={{
              sentenceCase: true,
              className: "w-full md:w-180",
              buttonClassName: "h-40 pl-7 text-16 font-extralight text-warm-gray border-text md:pl-0",
            }}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center font-poppins text-16 text-warm-gray">
            No hay proyectos que coincidan con los filtros.
          </p>
        ) : (
          <>
            <div className="flex flex-col items-center gap-14 md:hidden">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} saleCarousel />
              ))}
            </div>
          <div className="relative hidden md:block md:w-[calc(50vw+50%)]">
            <EmblaSlider
              slides={filtered}
              slidesPerView={1}
              slideClassName="md:basis-494! md:pr-20"
              gap={0}
              showArrows={false}
              onApiReady={setEmblaApi}
              renderSlide={(project) => (
                <div className="h-full">
                  <ProjectCard key={project.id} project={project} mobileDescriptionSemibold saleCarousel />
                </div>
              )}
            />

            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Slide anterior"
              className="absolute left-10 top-1/2 z-10 flex h-50 w-50 -translate-y-1/2 items-center justify-center bg-transparent p-0 transition-opacity hover:opacity-80 border-none sm:left-16 md:-left-50"
            >
              <svg aria-hidden="true" width="24" height="43" viewBox="0 0 24 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L3 21.5L22 41" stroke="black" strokeWidth="3" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Siguiente slide"
              className="absolute right-10 top-1/2 z-10 flex h-50 w-50 -translate-y-1/2 items-center justify-center bg-transparent p-0 transition-opacity hover:opacity-80 border-none sm:right-16 md:right-25"
            >
              <svg aria-hidden="true" width="24" height="43" viewBox="0 0 24 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L21 21.5L2 41" stroke="white" strokeWidth="3" />
              </svg>
            </button>
          </div>
          </>
        )}
      </div>
    </section>
  );
}
