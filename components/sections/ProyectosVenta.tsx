"use client";

import { useMemo, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { EmblaSlider } from "@/components/EmblaSlider";
import { ProjectCard, getProjectFilterTags, formatAreaFilter, AREA_FILTER_LABELS } from "@/components/ProjectCard";
import { ChevronLeft } from "@/components/icons/ChevronLeft";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { ChevronDown } from "@/components/icons/ChevronDown";
import type { Project } from "@/lib/types";

type ProyectosVentaProps = {
  titulo?: string;
  proyectos: Project[];
};

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative flex h-54 w-full items-center justify-between border-b border-text md:w-180">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full appearance-none border-0 bg-transparent pr-8 font-poppins text-16 font-extralight text-warm-gray outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-24 w-24 -translate-y-1/2 text-warm-gray" />
    </div>
  );
}

export function ProyectosVenta({ titulo, proyectos }: ProyectosVentaProps) {
  const [distrito, setDistrito] = useState("");
  const [tipo, setTipo] = useState("");
  const [area, setArea] = useState("");
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);

  const tags = useMemo(() => proyectos.map((p) => getProjectFilterTags(p)), [proyectos]);

  const distritoOptions = useMemo(
    () => Array.from(new Set(tags.map((t) => t.distrito).filter((t): t is string => !!t))),
    [tags]
  );
  const tipoOptions = useMemo(
    () => Array.from(new Set(tags.map((t) => t.tipo).filter((t): t is string => !!t))),
    [tags]
  );

  const filtered = useMemo(() => {
    return proyectos.filter((p, i) => {
      const t = tags[i];
      if (distrito && t.distrito !== distrito) return false;
      if (tipo && t.tipo !== tipo) return false;
      if (area && formatAreaFilter(t.area) !== area) return false;
      return true;
    });
  }, [proyectos, tags, distrito, tipo, area]);

  return (
    <section className="w-full bg-white px-4 py-60 md:py-120">
      <div className="mx-auto max-w-1440 px-4 md:px-80">
        <div className="mb-40 flex flex-col gap-24 md:flex-row md:items-start md:justify-between">
          {titulo && (
            <h2 className="font-gotham text-36 font-bold leading-[1.1] text-slate md:text-55" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
              {titulo}
            </h2>
          )}
          <div className="flex flex-col gap-16 md:flex-row md:gap-24">
            <FilterSelect
              placeholder="Distrito"
              value={distrito}
              onChange={setDistrito}
              options={distritoOptions}
            />
            <FilterSelect
              placeholder="Tipo"
              value={tipo}
              onChange={setTipo}
              options={tipoOptions}
            />
            <FilterSelect
              placeholder="M2"
              value={area}
              onChange={setArea}
              options={AREA_FILTER_LABELS}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center font-poppins text-16 text-warm-gray">
            No hay proyectos que coincidan con los filtros.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-16 md:hidden">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <div className="-mx-4 hidden md:block md:mx-0">
              <EmblaSlider
                slides={filtered}
                slidesPerView={2}
                gap={20}
                showArrows={false}
                onApiReady={setEmblaApi}
                renderSlide={(project) => <ProjectCard key={project.id} project={project} />}
              />
            </div>

            <div className="hidden md:mt-10 md:flex md:justify-end md:gap-16">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Slide anterior"
                className="flex h-50 w-50 items-center justify-center bg-slate text-white transition-opacity hover:opacity-80"
              >
                <ChevronLeft className="h-24 w-24" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Siguiente slide"
                className="flex h-50 w-50 items-center justify-center bg-slate text-white transition-opacity hover:opacity-80"
              >
                <ChevronRight className="h-24 w-24" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
