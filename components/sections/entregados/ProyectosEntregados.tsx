"use client";

import { DeliveredCard } from "@/components/DeliveredCard";
import type { Delivered } from "@/lib/types";

type ProyectosEntregadosProps = {
  titulo?: string;
  entregados: Delivered[];
};

function groupByYear(entregados: Delivered[]) {
  const groups = entregados.reduce<Record<string, Delivered[]>>(
    (acc, project) => {
      const year = project.acf?.ano;
      if (!year) return acc;
      if (!acc[year]) acc[year] = [];
      acc[year].push(project);
      return acc;
    },
    {}
  );

  return Object.entries(groups).sort(
    ([a], [b]) => Number(b) - Number(a)
  );
}

export function ProyectosEntregados({
  titulo,
  entregados,
}: ProyectosEntregadosProps) {
  const grouped = groupByYear(entregados);

  if (grouped.length === 0 && !titulo) return null;

  return (
    <section
      data-section="proyectos_entregados"
      className="w-full bg-white pl-4 pr-16 pt-24 pb-67 md:pr-4 md:pt-40"
    >
      <div className="mx-auto max-w-1440 pl-12 pr-0 md:px-80">
        {titulo && (
          <h2 className="m-0 w-full text-center font-gotham text-36 font-bold leading-[1.1] text-slate md:text-left md:text-50">
            {titulo}
          </h2>
        )}

        <div className="mt-60 hidden grid-cols-4 gap-x-24 gap-y-60 md:grid">
          {grouped.flatMap(([year, projects]) =>
            projects.map((project, index) => (
              <div key={project.id} className="flex min-w-0 flex-col gap-24">
                <span className="h-24 font-gotham text-24 font-bold leading-none text-near-black">
                  {index === 0 ? year : null}
                </span>
                <div className="aspect-square w-full">
                  <DeliveredCard
                    project={project}
                    size="medium"
                    showButton
                    showYear={false}
                    strongVeil
                    distrito={project.acf.distrito}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="relative min-w-0 md:hidden">
          <div className="absolute bottom-0 left-5 top-60 w-[2px] bg-[#748CA4]" />
          {grouped.map(([year, projects]) => (
            <div
              key={year}
              className="relative mb-6 grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-20 pt-60 last:mb-0"
            >
              <div className="order-2 flex min-w-0 flex-col gap-20">
                {projects.map((project) => (
                  <div key={project.id} className="h-352 w-full">
                    <DeliveredCard
                      project={project}
                      size="large"
                      showButton
                      showYear={false}
                      strongVeil
                      distrito={project.acf.distrito}
                    />
                  </div>
                ))}
              </div>
              <div className="relative order-1 flex min-w-10 justify-start">
                <div className="relative flex h-fit items-center gap-14">
                  <span className="absolute -top-36 whitespace-nowrap font-gotham text-20 font-medium leading-none text-near-black">
                    {year}
                  </span>
                  <div className="absolute left-[calc(5*var(--fx)+1px)] top-0 z-10 h-[14px] w-[14px] shrink-0 -translate-x-1/2 rounded-full bg-slate [outline:calc(3*var(--fx))_solid_white]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
