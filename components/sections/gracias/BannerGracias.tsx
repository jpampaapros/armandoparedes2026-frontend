import Image from "next/image";
import { BackButton } from "./BackButton";
import type { ACFImage } from "@/lib/types";

type BannerGraciasProps = {
  titulo?: string;
  descripcion?: string;
  imagen_de_fondo?: ACFImage;
  proyectoSlug?: string;
};

export function BannerGracias({
  titulo,
  descripcion,
  imagen_de_fondo,
  proyectoSlug,
}: BannerGraciasProps) {
  const fallbackHref = proyectoSlug ? `/proyectos/${proyectoSlug}` : "/proyectos";

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
        <BackButton fallbackHref={fallbackHref}>Volver</BackButton>

        {titulo && (
          <h1
            className="mt-110 max-w-524 font-gotham text-36 font-bold leading-[1.05] text-white md:mt-29 md:text-88 md:font-medium md:leading-84"
            dangerouslySetInnerHTML={{ __html: titulo }}
          />
        )}

        {descripcion && (
          <div
            className="mt-16 max-w-406 font-gotham text-16 font-bold leading-[1.2] text-white md:mt-28 md:text-28 md:font-normal md:leading-35 [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: descripcion }}
          />
        )}
      </div>
    </section>
  );
}
