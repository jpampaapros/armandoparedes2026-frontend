"use client";

import { useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { EmblaSlider } from "@/components/EmblaSlider";
import { ProjectCard } from "@/components/ProjectCard";
import { ChevronLeft } from "@/components/icons/ChevronLeft";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { ProjectFilters, useProjectFilters } from "@/components/ProjectFilters";
import type { Project } from "@/lib/types";

type ProyectosVentaProps = {
  titulo?: string;
  proyectos: Project[];
};

export function ProyectosVenta({ titulo, proyectos }: ProyectosVentaProps) {
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);
  const mobileTitle = titulo?.match(/^(.*?)\s+(en\s+venta)$/i);
  const { filtered, filters } = useProjectFilters(proyectos);

  return (
    <section className="w-full bg-white px-15 pb-35 pt-49 md:px-4 md:pb-60 md:pt-101">
      <div className="mx-auto max-w-1440 px-0 md:px-80">
        <div className="mb-40 flex flex-col gap-24 md:flex-row md:items-start md:justify-between">
          {titulo && (
            <h2 className="my-0 text-center md:text-left font-gotham text-36 font-medium leading-[1.1] text-slate md:text-55">
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
            className="flex flex-col gap-16 md:flex-row md:gap-24"
            styles={{
              className: "w-full md:w-180",
              buttonClassName: "h-54 pl-7 text-16 font-extralight text-warm-gray border-text md:pl-0",
            }}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center font-poppins text-16 text-warm-gray">
            No hay proyectos que coincidan con los filtros.
          </p>
        ) : (
          <div className="relative">
            <div className="md:w-[calc(50vw+50%)]">
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
            </div>

            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Slide anterior"
              className="absolute left-10 top-1/2 z-10 flex h-50 w-50 -translate-y-1/2 items-center justify-center bg-slate text-white transition-opacity hover:opacity-80 border-none sm:left-16 md:-left-27"
            >
              <ChevronLeft className="h-28 w-28" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Siguiente slide"
              className="absolute right-10 top-1/2 z-10 flex h-50 w-50 -translate-y-1/2 items-center justify-center bg-slate text-white transition-opacity hover:opacity-80 border-none sm:right-16 md:-right-220"
            >
              <ChevronRight className="h-28 w-28" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
