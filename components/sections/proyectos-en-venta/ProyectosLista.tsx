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
        <div className="mb-40 flex flex-col md:flex-row gap-24 justify-between">
          {titulo && (
            <h2 className="order-1 font-gotham text-36 font-semibold leading-[1.1] text-slate md:order-1 md:text-40 text-center md:text-left">
              {titulo}
            </h2>
          )}
          <ProjectFilters
            filters={filters}
            className="order-2 flex flex-col gap-16 md:order-2 md:flex-row md:justify-end md:gap-24"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center font-poppins text-16 text-text-muted">
            No hay proyectos que coincidan con los filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-15 md:grid-cols-2">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
