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
        className="h-full w-full appearance-none border-0 bg-transparent pl-[calc(7*var(--fx))] pr-8 font-poppins text-16 font-extralight text-warm-gray outline-none md:pl-0"
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
  const mobileTitle = titulo?.match(/^(.*?)\s+(en\s+venta)$/i);

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
    <section className="w-full bg-white px-[calc(15*var(--fx))] pb-35 pt-49 md:px-4 md:pb-60 md:pt-101">
      <div className="mx-auto max-w-1440 px-0 md:px-80">
        <div className="mb-40 flex flex-col gap-24 md:flex-row md:items-start md:justify-between">
          {titulo && (
            <h2 className="my-0 text-center md:text-left font-gotham text-36 font-medium leading-[1.1] text-slate md:text-55" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
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
            <div className="md:-mx-10">
              <EmblaSlider
                slides={filtered}
                slidesPerView={{ base: 1, md: 2 }}
                gap={0}
                showArrows={false}
                onApiReady={setEmblaApi}
                renderSlide={(project) => (
                  <div className="h-full md:px-10">
                    <ProjectCard key={project.id} project={project} mobileDescriptionSemibold />
                  </div>
                )}
              />
            </div>

            <div className="mt-16 flex justify-start gap-16 md:mt-35 md:justify-end">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Slide anterior"
                className="flex h-50 w-50 items-center justify-center bg-slate text-white transition-opacity hover:opacity-80 border-none"
              >
                <ChevronLeft className="h-28 w-28" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Siguiente slide"
                className="flex h-50 w-50 items-center justify-center bg-slate text-white transition-opacity hover:opacity-80 border-none"
              >
                <ChevronRight className="h-28 w-28" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
