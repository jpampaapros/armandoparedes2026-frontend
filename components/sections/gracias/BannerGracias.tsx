import Image from "next/image";
import Link from "next/link";
import { BackButton } from "./BackButton";
import type { ACFImage, ACFLink } from "@/lib/types";

type BannerGraciasProps = {
  titulo?: string;
  descripcion?: string;
  imagen_de_fondo?: ACFImage;
  proyectoSlug?: string;
  fallbackHref?: string;
  /** CTA opcional (p. ej. postventa → preguntas frecuentes). */
  boton?: ACFLink;
};

export function BannerGracias({
  titulo,
  descripcion,
  imagen_de_fondo,
  proyectoSlug,
  fallbackHref,
  boton,
}: BannerGraciasProps) {
  const backHref =
    fallbackHref ?? (proyectoSlug ? `/proyectos/${proyectoSlug}` : "/proyectos");
  const botonHref = boton?.url?.trim();
  const botonLabel = boton?.title?.trim();

  return (
    <section className="relative h-672 w-full overflow-hidden md:h-700">
      {imagen_de_fondo?.url && (
        <Image
          src={imagen_de_fondo.url}
          alt={imagen_de_fondo.alt || titulo || "Gracias"}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto flex h-full max-w-1440 flex-col items-center px-16 pt-116 text-center md:items-start md:px-80 md:pt-58 md:text-left">
        <BackButton fallbackHref={backHref}>Volver</BackButton>

        {titulo && (
          <h1
            className="mt-110 w-full max-w-900 font-gotham text-36 font-bold leading-[1.15] text-white md:mt-29 md:text-88 md:font-medium md:leading-96"
            dangerouslySetInnerHTML={{ __html: titulo }}
          />
        )}

        {descripcion && (
          <div
            className="mt-24 w-full max-w-720 font-gotham text-16 font-bold leading-[1.35] text-white md:mt-28 md:text-28 md:font-normal md:leading-35 [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: descripcion }}
          />
        )}

        {botonHref && botonLabel && (
          <Link
            href={botonHref}
            target={boton?.target || undefined}
            className="mt-32 inline-flex h-50 items-center justify-center bg-slate px-28 font-gotham text-14 font-bold uppercase text-white transition-opacity hover:opacity-90 md:mt-40 md:text-16"
          >
            {botonLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
