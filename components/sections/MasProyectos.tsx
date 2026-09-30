"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { EmblaCarouselType } from "embla-carousel";
import { EmblaSlider } from "@/components/EmblaSlider";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilters, useProjectFilters } from "@/components/ProjectFilters";
import { getPublicCmsUrl } from "@/lib/urls";
import type { Project } from "@/lib/types";

type MasProyectosProps = {
  titulo?: string;
  proyectos?: Project[];
};

export function MasProyectos({ titulo, proyectos: proyectosProp }: MasProyectosProps) {
  const [proyectosFetch, setProyectosFetch] = useState<Project[]>(proyectosProp ?? []);
  const proyectos = proyectosProp ?? proyectosFetch;
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType>();

  useEffect(() => {
    if (proyectosProp) return;
    let canceled = false;
    fetch(`${getPublicCmsUrl()}/wp-json/wp/v2/proyectos?per_page=100&acf_format=standard&_embed=1`)
      .then((r) => r.json())
      .then((data) => {
        if (!canceled) setProyectosFetch(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!canceled) setProyectosFetch([]);
      });
    return () => {
      canceled = true;
    };
  }, [proyectosProp]);

  const { filtered, filters } = useProjectFilters(proyectos);

  return (
    <section data-layout="mas_proyectos" className="w-full bg-white pb-35">
      <div className="h-60 w-full md:h-110" />

      <div className="mx-auto max-w-1440 px-24 md:px-80">
        <div className="flex flex-col gap-24 md:flex-row md:items-center md:justify-between">
          {titulo && (
            <h2 className="m-0 font-gotham text-32 font-bold text-slate md:text-60">
              {titulo}
            </h2>
          )}

          <ProjectFilters
            filters={filters}
            className="hidden flex-wrap gap-24 md:flex"
          />
        </div>

        <div className="mt-40 md:mt-60">
          {filtered.length > 0 ? (
            <>
              <EmblaSlider
                slides={filtered}
                slidesPerView={{ base: 1, md: 2 }}
                className="h-430 md:h-680"
                renderSlide={(project) => (
                  <div className="h-full px-0 md:px-12">
                    <ProjectCard project={project} compact />
                  </div>
                )}
                showArrows={false}
                showBullets={false}
                onApiReady={setEmblaApi}
                gap={0}
              />

              {filtered.length > 1 && (
                <div className="mt-16 flex justify-start gap-16 md:mt-35 md:justify-end">
                  <button
                    type="button"
                    onClick={() => emblaApi?.scrollPrev()}
                    aria-label="Slide anterior"
                    className="flex h-50 w-50 items-center justify-center border-none bg-slate text-white transition-opacity hover:opacity-80"
                  >
                    <Image
                      src="/images/proyecto/mas-proyectos-arrow.svg"
                      alt=""
                      width={18}
                      height={31}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => emblaApi?.scrollNext()}
                    aria-label="Siguiente slide"
                    className="flex h-50 w-50 items-center justify-center border-none bg-slate text-white transition-opacity hover:opacity-80"
                  >
                    <Image
                      src="/images/proyecto/mas-proyectos-arrow.svg"
                      alt=""
                      width={18}
                      height={31}
                      className="rotate-180"
                    />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center font-poppins text-16 text-warm-gray">
              No se encontraron proyectos con los filtros seleccionados.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
