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
  const firstGroupHasArrows = (grouped[0]?.[1].length ?? 0) > 1;

  if (grouped.length === 0 && !titulo) return null;

  return (
    <section
      data-section="proyectos_entregados"
      className="w-full bg-white pl-4 pr-0 pt-24 pb-67 md:pr-4 md:pt-40"
    >
      <div className="mx-auto max-w-1440 pl-12 pr-0 md:px-80">
        {titulo && (
          <h2 className="m-0 w-full text-center font-gotham text-36 font-bold leading-[1.1] text-slate md:text-left md:text-50">
            {titulo}
          </h2>
        )}

        <div className={`relative min-w-0 ${firstGroupHasArrows
          ? "mt-12 md:mt-88"
          : "mt-62 md:mt-60"}`}>
          <div className="absolute bottom-0 left-5 top-60 w-[2px] bg-[#748CA4] md:left-auto md:right-5 md:top-0 md:w-px md:bg-slate" />
          {grouped.map(([year, projects], index) => {
            const hasSingleProject = projects.length === 1;
            const nextGroupHasArrows = (grouped[index + 1]?.[1].length ?? 0) > 1;
            // Mobile rows already reserve 60 proportional pixels above the cards.
            const yearSpacing = nextGroupHasArrows
              ? "mb-12 md:mb-88"
              : "mb-6 md:mb-66";

            return (
              <div
                key={year}
                className={`relative ${yearSpacing} last:mb-0 grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-20 pr-0 pt-60 md:last:mb-0 md:grid-cols-[minmax(0,1fr)_auto] md:gap-40 md:pt-0`}
              >
                <div className="order-2 h-352 min-w-0 max-md:[&_[data-card=entregado]_span]:normal-case md:order-1 md:h-582">
                  <EmblaSlider
                    slides={projects}
                    slidesPerView={{ base: 1, md: hasSingleProject ? 1 : 2 }}
                    gap={20}
                    viewportClassName="max-md:[&>div]:!-ml-16"
                    slideClassName="max-md:!basis-316 max-md:!pl-16"
                    loop={projects.length > 1}
                    draggable={projects.length > 1}
                    showArrows={
                      projects.length > 1
                        ? { mobile: true, desktop: true }
                        : false
                    }
                    arrowButtonClassName="!-top-52 h-32 w-32 !translate-y-0 cursor-pointer rounded-none bg-slate p-0 hover:opacity-80 md:!-top-68 md:h-48 md:w-48"
                    previousArrowClassName="!left-auto !right-60 md:!right-56"
                    nextArrowClassName="!right-16 md:!right-0"
                    arrowChevronClassName="h-24 w-24 md:h-32 md:w-32"
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
                <div className="relative order-1 flex min-w-10 justify-start md:order-2 md:min-w-90 md:justify-end">
                  <div className="relative flex h-fit items-center gap-14">
                    <span className="absolute left-12 -top-36 whitespace-nowrap font-gotham text-20 font-medium leading-none text-near-black md:static">
                      {year}
                    </span>
                    <div className="relative z-10 h-[14px] w-[14px] shrink-0 rounded-full bg-slate [outline:calc(3*var(--fx))_solid_white] max-md:absolute max-md:top-0 max-md:left-[calc(5*var(--fx)+1px)] max-md:-translate-x-1/2 md:h-10 md:w-10" />
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
