"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { EmblaCarouselType } from "embla-carousel";
import { EmblaSlider } from "@/components/EmblaSlider";
import { ProjectCard, getProjectFilterTags, formatAreaFilter, AREA_FILTER_LABELS } from "@/components/ProjectCard";
import { getPublicCmsUrl } from "@/lib/urls";
import type { Project } from "@/lib/types";

type MasProyectosProps = {
  titulo?: string;
  proyectos?: Project[];
};

export function MasProyectos({ titulo, proyectos: proyectosProp }: MasProyectosProps) {
  const [proyectosFetch, setProyectosFetch] = useState<Project[]>(proyectosProp ?? []);
  const proyectos = proyectosProp ?? proyectosFetch;
  const [filtroDistrito, setFiltroDistrito] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
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

  const distritos = useMemo(
    () => [
      ...new Set(
        proyectos
          .map((p) =>
            p._embedded?.["wp:term"]
              ?.flat()
              .find((t) => t.taxonomy === "distrito")?.name,
          )
          .filter(Boolean),
      ),
    ],
    [proyectos],
  );

  const tipos = useMemo(
    () => [...new Set(proyectos.map((p) => p.acf.tipo).filter(Boolean))],
    [proyectos],
  );

  const filtered = useMemo(() => {
    return proyectos.filter((p) => {
      const tags = getProjectFilterTags(p);
      const areaLabel = formatAreaFilter(tags.area);
      return (
        (!filtroDistrito || tags.distrito === filtroDistrito) &&
        (!filtroTipo || tags.tipo === filtroTipo) &&
        (!filtroArea || areaLabel === filtroArea)
      );
    });
  }, [proyectos, filtroDistrito, filtroTipo, filtroArea]);

  return (
    <section data-layout="mas_proyectos" className="w-full bg-white pb-[calc(35*var(--fx))]">
      <div className="h-60 w-full md:h-110" />

      <div className="mx-auto max-w-1440 px-24 md:px-80">
        <div className="flex flex-col gap-24 md:flex-row md:items-center md:justify-between">
          {titulo && (
            <h2 className="m-0 font-gotham text-32 font-bold text-slate md:text-60">
              {titulo}
            </h2>
          )}

          <div className="flex flex-wrap gap-24">
            <div className="relative w-146 border-b border-slate">
              <select
                value={filtroDistrito}
                onChange={(e) => setFiltroDistrito(e.target.value)}
                className={`h-36 w-full appearance-none border-0 bg-transparent px-7 pr-30 font-poppins text-13 outline-none ${filtroDistrito ? "text-slate" : "text-light-gray"}`}
              >
                <option value="">Distrito</option>
                {distritos.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <Image src="/images/proyecto/select-chevron.svg" alt="" width={24} height={24} className="pointer-events-none absolute right-4 top-1/2 h-24 w-24 -translate-y-1/2" />
            </div>

            <div className="relative w-146 border-b border-slate">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className={`h-36 w-full appearance-none border-0 bg-transparent px-7 pr-30 font-poppins text-13 outline-none ${filtroTipo ? "text-slate" : "text-light-gray"}`}
              >
                <option value="">Tipo</option>
                {tipos.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <Image src="/images/proyecto/select-chevron.svg" alt="" width={24} height={24} className="pointer-events-none absolute right-4 top-1/2 h-24 w-24 -translate-y-1/2" />
            </div>

            <div className="relative w-146 border-b border-slate">
              <select
                value={filtroArea}
                onChange={(e) => setFiltroArea(e.target.value)}
                className={`h-36 w-full appearance-none border-0 bg-transparent px-7 pr-30 font-poppins text-13 outline-none ${filtroArea ? "text-slate" : "text-light-gray"}`}
              >
                <option value="">M2</option>
                {AREA_FILTER_LABELS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <Image src="/images/proyecto/select-chevron.svg" alt="" width={24} height={24} className="pointer-events-none absolute right-4 top-1/2 h-24 w-24 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="mt-40 md:mt-60">
          {filtered.length > 0 ? (
            <>
              <EmblaSlider
                slides={filtered}
                slidesPerView={{ base: 1, md: 2 }}
                className="h-[calc(430*var(--fx))] md:h-[calc(680*var(--fx))]"
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
                <div className="mt-16 flex justify-end gap-16 md:mt-35">
                  <button
                    type="button"
                    onClick={() => emblaApi?.scrollPrev()}
                    aria-label="Slide anterior"
                    className="flex h-[calc(50*var(--fx))] w-[calc(50*var(--fx))] items-center justify-center border-none bg-slate text-white transition-opacity hover:opacity-80"
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
                    className="flex h-[calc(50*var(--fx))] w-[calc(50*var(--fx))] items-center justify-center border-none bg-slate text-white transition-opacity hover:opacity-80"
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
