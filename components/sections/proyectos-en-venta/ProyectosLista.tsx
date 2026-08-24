"use client";

import { useMemo, useState } from "react";
import { ProjectCard, getProjectFilterTags, formatAreaFilter, AREA_FILTER_LABELS } from "@/components/ProjectCard";
import { ChevronDown } from "@/components/icons/ChevronDown";
import type { Project } from "@/lib/types";

type ProyectosListaProps = {
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
    <div className="relative flex w-full items-center justify-between border-b border-text md:w-205">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border-0 bg-transparent pr-8 font-poppins text-16 font-extralight text-text-muted outline-none focus:ring-0 pb-0 pt-15 pl-8"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-24 w-24 -translate-y-1/2 text-text-muted" />
    </div>
  );
}

export function ProyectosLista({ titulo, proyectos }: ProyectosListaProps) {

  const [distrito, setDistrito] = useState("");
  const [tipo, setTipo] = useState("");
  const [area, setArea] = useState("");

  const tags = useMemo(() => proyectos.map((p) => getProjectFilterTags(p)), [proyectos]);

  const distritoOptions = useMemo(
    () => Array.from(new Set(tags.map((t) => t.distrito).filter((t): t is string => !!t))).sort(),
    [tags]
  );
  const tipoOptions = useMemo(
    () => Array.from(new Set(tags.map((t) => t.tipo).filter((t): t is string => !!t))).sort(),
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
    <section data-section="proyectos_lista" className="w-full bg-white px-4 py-60 md:py-120">
      <div className="mx-auto max-w-1440 px-4 md:px-80">
        <div className="mb-40 flex flex-col md:flex-row gap-24 justify-between">
          {titulo && (
            <h2 className="order-1 font-gotham text-36 font-semibold leading-[1.1] text-slate md:order-1 md:text-40 text-center md:text-left">
              {titulo}
            </h2>
          )}
          <div className="order-2 flex flex-col gap-16 md:order-2 md:flex-row md:justify-end md:gap-24">
            <FilterSelect placeholder="Distrito" value={distrito} onChange={setDistrito} options={distritoOptions} />
            <FilterSelect placeholder="Tipo" value={tipo} onChange={setTipo} options={tipoOptions} />
            <FilterSelect placeholder="M2" value={area} onChange={setArea} options={AREA_FILTER_LABELS} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center font-poppins text-16 text-text-muted">
            No hay proyectos que coincidan con los filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-49">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
