"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SmartLink } from "@/components/SmartLink";
import { getPublicCmsUrl } from "@/lib/urls";
import type { Project, WPMedia } from "@/lib/types";

function ProjectHoverImage({ value, sizes }: {
  value: Project["acf"]["imagen_hover"];
  sizes: string;
}) {
  const directUrl = typeof value === "string" && !/^\d+$/.test(value)
    ? value
    : value && typeof value === "object" ? value.url : undefined;
  const mediaId = typeof value === "number" || (typeof value === "string" && /^\d+$/.test(value))
    ? Number(value)
    : value && typeof value === "object" ? value.ID ?? value.id : undefined;
  const [resolved, setResolved] = useState<{ id: number; url: string }>();
  const [failedUrl, setFailedUrl] = useState<string>();

  useEffect(() => {
    if (directUrl || !mediaId) return;
    const controller = new AbortController();
    async function resolveImage() {
      try {
        const response = await fetch(
          `${getPublicCmsUrl()}/wp-json/wp/v2/media/${mediaId}?_fields=source_url`,
          { signal: controller.signal },
        );
        if (!response.ok) return;
        const media: Pick<WPMedia, "source_url"> = await response.json();
        if (!controller.signal.aborted && media.source_url) {
          setResolved({ id: mediaId!, url: media.source_url });
        }
      } catch {
        // Keep the featured image when the optional hover image is unavailable.
      }
    }
    void resolveImage();
    return () => controller.abort();
  }, [directUrl, mediaId]);

  const url = directUrl || (resolved?.id === mediaId ? resolved?.url : undefined);
  if (!url || url === failedUrl) return null;

  return (
    <Image
      src={url}
      alt=""
      fill
      sizes={sizes}
      onError={() => setFailedUrl(url)}
      className="project-card-hover-image pointer-events-none object-cover opacity-0 transition-opacity duration-300 motion-reduce:transition-none"
    />
  );
}

export function ProjectCard({
  project,
  compact = false,
  mobileDescriptionSemibold = false,
  saleCarousel = false,
}: {
  project: Project;
  compact?: boolean;
  mobileDescriptionSemibold?: boolean;
  saleCarousel?: boolean;
}) {
  const image = project._embedded?.["wp:featuredmedia"]?.[0];
  const distrito = project._embedded?.["wp:term"]
    ?.flat()
    .find((t) => t.taxonomy === "distrito");

  return (
    <article
      data-project-card
      className={`group relative flex w-full min-w-0 flex-col overflow-hidden bg-black ${
        saleCarousel ? "h-465 md:w-[calc(474*var(--fx))] md:h-[calc(641*var(--fx))]" : compact ? "h-[calc(430*var(--fx))] md:max-w-630 md:h-[calc(680*var(--fx))]" : "h-465 md:max-w-630 md:h-825"
      }`}
    >
      {image?.source_url && (
        <Image
          src={image.source_url}
          alt={image.alt_text || project.title.rendered}
          fill
          className="object-cover"
          sizes={saleCarousel ? "(max-width: 768px) 382px, 474px" : "(max-width: 768px) 382px, 630px"}
        />
      )}

      <ProjectHoverImage
        value={project.acf.imagen_hover}
        sizes={saleCarousel ? "(max-width: 768px) 382px, 474px" : "(max-width: 768px) 382px, 630px"}
      />

      {distrito && (
        <div className="absolute right-16 top-16 z-10 bg-white px-10 py-6 md:right-20 md:top-61 md:py-8">
          <span className="font-poppins text-16 font-medium leading-18 text-near-black md:text-24 md:leading-24">
            {distrito.name}
          </span>
        </div>
      )}

      <div className="relative z-10 mt-auto flex flex-col gap-16 p-24 md:p-54">
        <div className="flex flex-col">
          <h3 className="mb-20 font-gotham text-26 font-bold uppercase leading-26 text-white md:text-36" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
            {project.title.rendered}
          </h3>
          <hr className="my-0 h-px w-full border-0 bg-white" />
        </div>
        <div className={`font-poppins text-16 leading-20 text-white md:text-24 md:leading-30 [&_p]:my-0 ${mobileDescriptionSemibold ? "[&_p]:font-semibold md:[&_p]:font-light" : "[&_p]:font-light"}`}
          dangerouslySetInnerHTML={{ __html: project.acf.descripcion || "" }}
        />
        <SmartLink
          link={{
            title: "Ver proyecto",
            url: `/proyectos/${project.slug}`,
            target: "",
          }}
          className="inline-flex h-50 w-full items-center justify-center border border-white px-10 font-poppins text-16 font-semibold text-white transition-colors hover:text-card-dark hover:bg-white md:w-250 md:text-18"
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
  if (area < 60) return "0-60 m²";
  if (area < 100) return "60-100 m²";
  if (area < 150) return "100-150 m²";
  return "150+ m²";
}

export const AREA_FILTER_LABELS = ["0-60 m²", "60-100 m²", "100-150 m²", "150+ m²"];
