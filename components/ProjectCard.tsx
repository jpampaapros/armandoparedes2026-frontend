"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SmartLink } from "@/components/SmartLink";
import { getPublicCmsUrl } from "@/lib/urls";
import type { Project, WPMedia } from "@/lib/types";

function ProjectHoverImage({ value, sizes }: {
  value: Project["acf"]["general_imagen_hover"];
  sizes: string;
}) {
  // Se prefiere un recorte de WP al original: el optimizador de Next corta la descarga
  // externa a los 7s y los originales pesados (varios MB) no llegan, dando 500.
  const sizedUrl = value && typeof value === "object"
    ? [value.sizes?.large, value.sizes?.["1536x1536"]].find((s): s is string => typeof s === "string")
    : undefined;
  const directUrl = typeof value === "string" && !/^\d+$/.test(value)
    ? value
    : value && typeof value === "object" ? sizedUrl ?? value.url : undefined;
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
      className="project-card-hover-image pointer-events-none object-cover opacity-0 scale-105 transition-[opacity,scale] duration-500 ease-out motion-reduce:scale-100 motion-reduce:transition-none"
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
        saleCarousel ? "h-465 md:w-474 md:h-641" : compact ? "h-430 md:max-w-630 md:h-680" : "h-465 md:max-w-630 md:h-825"
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
        value={project.acf.general_imagen_hover}
        sizes={saleCarousel ? "(max-width: 768px) 382px, 474px" : "(max-width: 768px) 382px, 630px"}
      />

      {/* Velo negro del diseño: arranca transparente arriba y oscurece el tercio inferior
          para que el título, la descripción y el botón blancos tengan contraste sobre la
          foto. Va después de las dos imágenes para cubrir también la de hover. */}
      <div className="project-card-veil pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none bg-gradient-to-t from-black/85 via-black/55 via-40% to-transparent to-85%" />

      {distrito && (
        <div className="absolute right-16 top-16 z-10 bg-white px-10 py-6 md:right-20 md:top-61 md:py-8">
          <span className="font-poppins text-16 font-medium leading-18 text-near-black md:text-24 md:leading-24">
            {distrito.name}
          </span>
        </div>
      )}

      <div className="relative z-10 mt-auto flex flex-col gap-16 p-24 md:p-54">
        <div className="flex flex-col">
          <h3 className="mb-20 font-gotham text-26 font-bold uppercase leading-33 text-white md:text-36">
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
          className="inline-flex h-50 w-full items-center justify-center border border-white px-10 font-poppins text-16 font-semibold text-white transition-colors duration-500 ease-out hover:text-card-dark hover:bg-white group-hover:text-card-dark group-hover:bg-white motion-reduce:transition-none md:w-250 md:text-18"
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
