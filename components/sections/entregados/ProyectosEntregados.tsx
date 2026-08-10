"use client";

import { EmblaSlider } from "@/components/EmblaSlider";
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
      className="w-full bg-white px-4 py-60 md:py-120"
    >
      <div className="mx-auto max-w-1440 px-4 md:px-80">
        <div className="grid grid-cols-1 gap-24 md:grid-cols-[--spacing(300)_1fr] md:gap-40">
          <div className="md:sticky md:top-24 md:self-start">
            {titulo && (
              <h2 className="text-center font-gotham text-36 font-bold leading-[1.1] text-slate md:text-left md:text-50">
                {titulo}
              </h2>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate md:left-auto md:right-0" />
            {grouped.map(([year, projects]) => {
              return (
                <div
                  key={year}
                  className="relative mb-40 grid grid-cols-1 gap-24 pl-12 md:mb-80 md:grid-cols-[1fr_auto] md:gap-40 md:pl-0 md:pr-12"
                >
                  <div className="h-359 md:h-582">
                    <EmblaSlider
                      slides={projects}
                      slidesPerView={{ base: 1.1, md: 2 }}
                      gap={20}
                      loop={projects.length > 1}
                      draggable={projects.length > 1}
                      showArrows={
                        projects.length > 1
                          ? { mobile: false, desktop: true }
                          : false
                      }
                      renderSlide={(project) => (
                        <div className="h-full w-full">
                          <DeliveredCard
                            project={project}
                            size="large"
                            showButton
                            showYear={false}
                            distrito={project.acf.distrito}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="absolute left-4 top-0 -translate-x-1/2 md:static md:translate-x-0">
                    <div className="relative flex items-center gap-12 md:gap-16">
                      <span className="font-gotham text-36 font-bold leading-[1.1] text-slate md:text-55">
                        {year}
                      </span>
                      <div className="h-10 w-10 shrink-0 rounded-full border-5 border-white bg-slate md:h-14 md:w-14" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
