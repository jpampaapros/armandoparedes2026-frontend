"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilters, useProjectFilters } from "@/components/ProjectFilters";
import type { Project } from "@/lib/types";

type ProyectosListaProps = {
  titulo?: string;
  proyectos: Project[];
};

export function ProyectosLista({ titulo, proyectos }: ProyectosListaProps) {

  const { filtered, filters } = useProjectFilters(proyectos);

  return (
    <section data-section="proyectos_en_venta" className="w-full bg-white px-15 pt-24 pb-60 md:px-0 md:pt-40 md:pb-120">
      <div className="mx-auto max-w-1440 px-0 md:px-80">
        <div className="mb-40 flex flex-col md:flex-row md:items-baseline gap-24 justify-between">
          {titulo && (
            <h2 className="order-1 font-gotham text-36 font-semibold leading-[1.1] text-slate md:order-1 md:text-40 text-center md:text-left">
              {titulo}
            </h2>
          )}
          <ProjectFilters
            filters={filters}
            className="order-2 grid grid-cols-2 gap-16 max-md:[&>:first-child]:col-span-2 md:order-2 md:flex md:flex-row md:justify-end md:gap-24"
            styles={{
              className: "w-full md:w-205",
              buttonClassName: "px-8 pb-8 pt-0 text-16 font-extralight leading-24 text-text-muted border-text",
              optionClassName: "gap-12 text-14 text-text-muted",
              checkboxClassName: "h-24 w-24 border-text-muted",
            }}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center font-poppins text-16 text-text-muted">
            No hay proyectos que coincidan con los filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-15 md:grid-cols-2">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} saleListing />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
