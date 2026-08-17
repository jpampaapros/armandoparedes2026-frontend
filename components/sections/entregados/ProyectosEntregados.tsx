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
        {titulo && (
          <h2 className="m-0 w-full font-gotham text-36 font-bold leading-[1.1] text-slate md:text-[calc(50*var(--fx))]">
            {titulo}
          </h2>
        )}

        <div className="relative mt-40 min-w-0 md:mt-[calc(60*var(--fx))]">
          <div className="absolute bottom-0 right-[calc(5*var(--fx))] top-0 w-px bg-slate" />
          {grouped.map(([year, projects]) => {
            const hasSingleProject = projects.length === 1;

            return (
              <div
                key={year}
                className="relative mb-40 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-16 pr-0 md:mb-80 md:gap-[calc(40*var(--fx))]"
              >
                <div className="h-359 min-w-0 md:h-582">
                  <EmblaSlider
                    slides={projects}
                    slidesPerView={{ base: 1, md: hasSingleProject ? 1 : 2 }}
                    gap={20}
                    loop={projects.length > 1}
                    draggable={projects.length > 1}
                    showArrows={
                      projects.length > 1
                        ? { mobile: false, desktop: true }
                        : false
                    }
                    arrowButtonClassName="!-top-[calc(60*var(--fx))] h-[calc(48*var(--fx))] w-[calc(48*var(--fx))] !translate-y-0 cursor-pointer rounded-none bg-slate p-0 hover:opacity-80"
                    previousArrowClassName="!left-auto !right-[calc(56*var(--fx))]"
                    nextArrowClassName="!right-0"
                    arrowChevronClassName="h-[calc(32*var(--fx))] w-[calc(32*var(--fx))]"
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
                <div className="relative flex min-w-[calc(90*var(--fx))] justify-end">
                  <div className="relative flex h-fit items-center gap-[calc(14*var(--fx))]">
                    <span className="font-gotham text-[calc(20*var(--fx))] font-medium leading-none text-near-black">
                      {year}
                    </span>
                    <div className="relative z-10 h-[calc(10*var(--fx))] w-[calc(10*var(--fx))] shrink-0 rounded-full bg-slate [outline:calc(3*var(--fx))_solid_white]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
