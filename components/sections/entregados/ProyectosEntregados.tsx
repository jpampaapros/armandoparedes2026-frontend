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
      className="w-full bg-white pl-4 pr-0 pt-[calc(24*var(--fx))] pb-[calc(67*var(--fx))] md:pr-4 md:pt-[calc(40*var(--fx))]"
    >
      <div className="mx-auto max-w-1440 pl-12 pr-0 md:px-80">
        {titulo && (
          <h2 className="m-0 w-full text-center font-gotham text-36 font-bold leading-[1.1] text-slate md:text-left md:text-[calc(50*var(--fx))]">
            {titulo}
          </h2>
        )}

        <div className={`relative min-w-0 ${firstGroupHasArrows
          ? "mt-[calc(12*var(--fx))] md:mt-[calc(88*var(--fx))]"
          : "mt-[calc(62*var(--fx))] md:mt-[calc(60*var(--fx))]"}`}>
          <div className="absolute bottom-0 left-[calc(5*var(--fx))] top-60 w-[2px] bg-[#748CA4] md:left-auto md:right-[calc(5*var(--fx))] md:top-0 md:w-px md:bg-slate" />
          {grouped.map(([year, projects], index) => {
            const hasSingleProject = projects.length === 1;
            const nextGroupHasArrows = (grouped[index + 1]?.[1].length ?? 0) > 1;
            // Mobile rows already reserve 60 proportional pixels above the cards.
            const yearSpacing = nextGroupHasArrows
              ? "mb-[calc(12*var(--fx))] md:mb-[calc(88*var(--fx))]"
              : "mb-[calc(6*var(--fx))] md:mb-[calc(66*var(--fx))]";

            return (
              <div
                key={year}
                className={`relative ${yearSpacing} last:mb-0 grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-[calc(20*var(--fx))] pr-0 pt-60 md:last:mb-0 md:grid-cols-[minmax(0,1fr)_auto] md:gap-[calc(40*var(--fx))] md:pt-0`}
              >
                <div className="order-2 h-352 min-w-0 max-md:[&_[data-card=entregado]_span]:normal-case md:order-1 md:h-582">
                  <EmblaSlider
                    slides={projects}
                    slidesPerView={{ base: 1, md: hasSingleProject ? 1 : 2 }}
                    gap={20}
                    viewportClassName="max-md:[&>div]:!ml-[calc(-16*var(--fx))]"
                    slideClassName="max-md:!basis-[calc(316*var(--fx))] max-md:!pl-16"
                    loop={projects.length > 1}
                    draggable={projects.length > 1}
                    showArrows={
                      projects.length > 1
                        ? { mobile: true, desktop: true }
                        : false
                    }
                    arrowButtonClassName="!-top-[calc(52*var(--fx))] h-[calc(32*var(--fx))] w-[calc(32*var(--fx))] !translate-y-0 cursor-pointer rounded-none bg-slate p-0 hover:opacity-80 md:!-top-[calc(68*var(--fx))] md:h-[calc(48*var(--fx))] md:w-[calc(48*var(--fx))]"
                    previousArrowClassName="!left-auto !right-[calc(60*var(--fx))] md:!right-[calc(56*var(--fx))]"
                    nextArrowClassName="!right-[calc(16*var(--fx))] md:!right-0"
                    arrowChevronClassName="h-[calc(24*var(--fx))] w-[calc(24*var(--fx))] md:h-[calc(32*var(--fx))] md:w-[calc(32*var(--fx))]"
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
                <div className="relative order-1 flex min-w-[calc(10*var(--fx))] justify-start md:order-2 md:min-w-[calc(90*var(--fx))] md:justify-end">
                  <div className="relative flex h-fit items-center gap-[calc(14*var(--fx))]">
                    <span className="absolute left-[calc(12*var(--fx))] top-[calc(-36*var(--fx))] whitespace-nowrap font-gotham text-[calc(20*var(--fx))] font-medium leading-none text-near-black md:static">
                      {year}
                    </span>
                    <div className="relative z-10 h-[14px] w-[14px] shrink-0 rounded-full bg-slate [outline:calc(3*var(--fx))_solid_white] max-md:absolute max-md:top-0 max-md:left-[calc(5*var(--fx)+1px)] max-md:-translate-x-1/2 md:h-[calc(10*var(--fx))] md:w-[calc(10*var(--fx))]" />
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
