"use client";

import Image from "next/image";
import { SmartLink } from "@/components/SmartLink";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const image = project._embedded?.["wp:featuredmedia"]?.[0];
  const distrito = project._embedded?.["wp:term"]
    ?.flat()
    .find((t) => t.taxonomy === "distrito");

  return (
    <article className="group relative flex h-465 w-full min-w-0 max-w-382 flex-col overflow-hidden bg-black md:h-825 md:max-w-630">
      {image?.source_url && (
        <Image
          src={image.source_url}
          alt={image.alt_text || project.title.rendered}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 382px, 630px"
        />
      )}

      {distrito && (
        <div className="absolute right-16 top-16 z-10 bg-white px-10 py-6 md:right-20 md:top-61 md:py-8">
          <span className="font-poppins text-16 font-medium leading-18 text-near-black md:text-24 md:leading-24">
            {distrito.name}
          </span>
        </div>
      )}

      <div className="relative z-10 mt-auto flex flex-col gap-16 p-24 md:p-54">
        <div className="flex flex-col gap-10">
          <h3 className="font-gotham text-26 font-bold uppercase leading-[1.1] text-white md:text-36" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
            {project.title.rendered}
          </h3>
          <hr className="h-px w-full border-0 bg-white" />
        </div>
        <div className="whitespace-pre-line font-poppins text-16 font-light leading-20 text-white md:text-24 md:leading-30"
          dangerouslySetInnerHTML={{ __html: project.acf.descripcion || "" }}
        />
        <SmartLink
          link={{
            title: "Ver proyecto",
            url: `/proyectos/${project.slug}`,
            target: "",
          }}
          className="inline-flex h-50 w-full items-center justify-center border border-white px-10 font-poppins text-16 font-semibold text-white transition-colors hover:bg-white/10 md:w-250 md:text-18"
        >
          Ver proyecto
        </SmartLink>
      </div>
    </article>
  );
}

export function getProjectFilterTags(project: Project): { distrito?: string; tipo?: string; area: number } {
  const distrito = project._embedded?.["wp:term"]?.flat().find((t) => t.taxonomy === "distrito");
  return {
    distrito: distrito?.name,
    tipo: project.acf.tipo,
    area: Number(project.acf.metros || 0),
  };
}

export function formatAreaFilter(area: number): string {
  if (area < 60) return "0-60 m2";
  if (area < 100) return "60-100 m2";
  if (area < 150) return "100-150 m2";
  return "150+ m2";
}

export const AREA_FILTER_LABELS = ["0-60 m2", "60-100 m2", "100-150 m2", "150+ m2"];
